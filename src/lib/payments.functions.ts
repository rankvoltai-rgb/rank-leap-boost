import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  type StripeEnv,
  createStripeClient,
  getServerStripeEnv,
  getStripeErrorMessage,
} from "@/lib/stripe.server";
import { PLAN_PRICE_LOOKUP_KEY, TRIAL_DAYS } from "@/data/pricing";

type CheckoutSessionResult = { clientSecret: string; sessionId: string } | { error: string };
type PortalSessionResult = { url: string } | { error: string };

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

/** Prices the server will sell, and the trial each carries. Client cannot add to this. */
const ALLOWED_PRICES: Record<string, { trialDays: number }> = {
  [PLAN_PRICE_LOOKUP_KEY]: { trialDays: TRIAL_DAYS },
};

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { priceId: string; returnUrl?: string }) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
    if (!(data.priceId in ALLOWED_PRICES)) throw new Error("Unknown priceId");
    return data;
  })
  .handler(async ({ data, context }): Promise<CheckoutSessionResult> => {
    try {
      // Identity, environment and trial length are all server-derived. Taking
      // any of them from the caller is what let a client mint a free
      // entitlement via a test-mode checkout.
      const environment = getServerStripeEnv();
      const userId = context.userId;
      const customerEmail = (context.claims as { email?: string } | undefined)?.email;
      const stripe = createStripeClient(environment);

      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      if (!prices.data.length) throw new Error("Price not found");
      const stripePrice = prices.data[0];
      const isRecurring = stripePrice.type === "recurring";

      const customerId = await resolveOrCreateCustomer(stripe, {
        email: customerEmail,
        userId,
      });

      let productDescription: string | undefined;
      if (!isRecurring) {
        const productId =
          typeof stripePrice.product === "string" ? stripePrice.product : stripePrice.product.id;
        const product = await stripe.products.retrieve(productId);
        productDescription = product.name;
      }

      const trialDays = isRecurring ? ALLOWED_PRICES[data.priceId].trialDays : undefined;

      const session = await stripe.checkout.sessions.create({
        // Always one: the plan covers one site, and every extra site is a
        // unit of the Studio line (src/lib/studio.server.ts), never a
        // quantity a checkout caller could choose.
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: isRecurring ? "subscription" : "payment",
        ui_mode: "embedded_page",
        // No return URL means the checkout was opened inside a dialog that
        // wants to stay open: Stripe then calls the client's onComplete
        // instead of navigating the page away, and the caller reconciles
        // through `confirmCheckout` below.
        ...(data.returnUrl
          ? { return_url: data.returnUrl }
          : { redirect_on_completion: "never" as const }),
        ...(customerId && { customer: customerId }),
        ...(!isRecurring && {
          payment_intent_data: { description: productDescription },
        }),
        metadata: { userId },
        ...(isRecurring && {
          subscription_data: {
            metadata: { userId },
            ...(trialDays && { trial_period_days: trialDays }),
          },
        }),
      });

      return { clientSecret: session.client_secret ?? "", sessionId: session.id };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

type ConfirmCheckoutResult = { status: string | null } | { error: string };

/**
 * Reconcile a just-completed checkout without waiting for the webhook.
 *
 * The webhook remains the source of truth — it is the only thing that hears
 * about renewals, failures and cancellations — but it is asynchronous, and
 * the user is standing in front of a dialog that is about to start generating
 * articles. `requireGenerationEntitlement` reads the `subscriptions` row, so
 * a user who beat the webhook back would be told to start a trial they had
 * just paid for. This closes that race, and is also what makes checkout work
 * in local development, where no webhook is forwarded at all.
 *
 * The session id is not a secret, so ownership is checked rather than
 * assumed: the session's metadata must name the caller. Everything the sync
 * does is idempotent, so running alongside the webhook is harmless.
 */
export const confirmCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { sessionId: string }) => {
    if (!/^cs_[a-zA-Z0-9_]+$/.test(data.sessionId)) throw new Error("Invalid sessionId");
    return data;
  })
  .handler(async ({ data, context }): Promise<ConfirmCheckoutResult> => {
    try {
      const environment = getServerStripeEnv();
      const stripe = createStripeClient(environment);

      const session = await stripe.checkout.sessions.retrieve(data.sessionId, {
        expand: ["subscription"],
      });
      if (session.metadata?.userId !== context.userId) {
        throw new Error("This checkout session belongs to another account");
      }
      if (session.status !== "complete") return { status: session.status ?? null };

      const subscription = session.subscription;
      if (!subscription || typeof subscription === "string") return { status: session.status };

      const { syncSubscriptionFromCheckout } = await import("@/lib/subscriptions.server");
      await syncSubscriptionFromCheckout(subscription, environment);
      return { status: subscription.status };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl?: string }) => data)
  .handler(async ({ data, context }): Promise<PortalSessionResult> => {
    const { supabase, userId } = context;

    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .eq("environment", getServerStripeEnv())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subError || !sub?.stripe_customer_id) throw new Error("No subscription found");

    try {
      const stripe = createStripeClient(getServerStripeEnv());
      const portal = await stripe.billingPortal.sessions.create({
        customer: sub.stripe_customer_id as string,
        ...(data.returnUrl && { return_url: data.returnUrl }),
      });
      return { url: portal.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
