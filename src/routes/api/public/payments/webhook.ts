import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, createStripeClient, verifyWebhook } from "@/lib/stripe.server";
import { PLAN, TRIAL_ARTICLE_CREDITS } from "@/data/pricing";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

/**
 * How many articles this subscription's current period is worth.
 *
 * A trial is capped: the full allowance is what a *payment* buys. Any other
 * status — past_due, unpaid, incomplete — grants nothing, which matters
 * because a failed first payment still advances the period and would
 * otherwise refill the abuser's balance.
 */
function creditsForStatus(status: string | undefined): number | null {
  if (status === "trialing") return TRIAL_ARTICLE_CREDITS;
  if (status === "active") return PLAN.articlesPerMonth;
  return null;
}

// Refill the user's article credits for a new billing cycle.
// reset_article_credits no-ops unless the period actually advanced, so this is
// safe to call on every relevant subscription event.
async function refillArticleCredits(
  userId: string,
  periodEnd: number | null | undefined,
  credits: number | null,
) {
  if (!userId || credits === null) return;
  const periodIso = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
  await getSupabase().rpc("reset_article_credits", {
    _user_id: userId,
    _period_end: periodIso,
    _credits: credits,
  });
}

/**
 * What the card must prove it can cover, in cents. Held and released in the
 * same breath — never captured, so nothing is charged. It appears on the
 * customer's statement as a pending authorization for a day or two, which is
 * the cost of running the check.
 */
const CARD_CHECK_CENTS = 100;

/**
 * Place and immediately release a small authorization against the card a trial
 * was started with.
 *
 * Starting a trial only runs a $0 setup, which an empty prepaid card passes
 * happily; the decline then arrives a week later, after the articles have been
 * generated and paid for in LLM time. A real authorization, however small, is
 * the earliest point at which the card has to show it holds funds.
 *
 * A failure marks the subscription rather than cancelling it. A genuine card
 * can fail here by demanding 3-D Secure, and cancelling a real customer's
 * subscription from a webhook is a worse error than asking them to fix their
 * card. `hasGenerationEntitlement` reads the mark and withholds access while
 * the subscription is still trialing.
 */
async function verifyCardHasFunds(subscription: any, env: StripeEnv) {
  const subscriptionId = subscription.id;
  const customer =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  async function mark(fields: Record<string, unknown>) {
    await getSupabase()
      .from("subscriptions")
      .update({ ...fields, card_checked_at: new Date().toISOString() })
      .eq("stripe_subscription_id", subscriptionId);
  }

  try {
    const stripe = createStripeClient(env);

    let paymentMethod =
      typeof subscription.default_payment_method === "string"
        ? subscription.default_payment_method
        : subscription.default_payment_method?.id;

    // Checkout usually leaves the card on the customer, not the subscription.
    if (!paymentMethod && customer) {
      const customerRecord = await stripe.customers.retrieve(customer);
      if (!("deleted" in customerRecord && customerRecord.deleted)) {
        const fallback = (
          customerRecord as { invoice_settings?: { default_payment_method?: unknown } }
        ).invoice_settings?.default_payment_method;
        paymentMethod =
          typeof fallback === "string"
            ? fallback
            : (fallback as { id?: string } | undefined)?.id;
      }
    }

    if (!paymentMethod || !customer) {
      await mark({ card_verified: null, card_check_error: "No card on file to check" });
      return;
    }

    const authorization = await stripe.paymentIntents.create(
      {
        amount: CARD_CHECK_CENTS,
        currency: "usd",
        customer,
        payment_method: paymentMethod,
        capture_method: "manual",
        confirm: true,
        off_session: true,
        description: "Rankbox card check — released immediately, never charged",
        metadata: { subscriptionId, userId: subscription.metadata?.userId ?? "" },
      },
      // Stripe replays webhooks. Without this key a retry would hold a second dollar.
      { idempotencyKey: `card-check-${subscriptionId}` },
    );

    if (authorization.status === "requires_capture") {
      // Release it at once: whether the hold could be placed was the whole test.
      await stripe.paymentIntents.cancel(authorization.id);
      await mark({ card_verified: true, card_check_error: null });
      return;
    }

    await mark({
      card_verified: false,
      card_check_error: `Authorization ${authorization.status}`,
    });
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Card check failed";
    console.error("Card check failed for", subscriptionId, message);
    await mark({ card_verified: false, card_check_error: message });
  }
}

async function handleSubscriptionCreated(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }

  const item = subscription.items?.data?.[0];
  const priceId =
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase().from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  // A trial starts with the capped allowance; a straight-to-paid one gets all 30.
  await refillArticleCredits(userId, periodEnd, creditsForStatus(subscription.status));

  // Only a trial needs the check — a paid subscription has already moved money.
  if (subscription.status === "trialing") {
    await verifyCardHasFunds(subscription, env);
  }
}

async function handleSubscriptionUpdated(subscription: any, env: StripeEnv) {
  const item = subscription.items?.data?.[0];
  const priceId =
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  // Stamp the start of a failure spell once, not on every retry: the grace
  // period in entitlement.server.ts is measured from it.
  const { data: existing } = await getSupabase()
    .from("subscriptions")
    .select("user_id, status, past_due_since")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();
  const pastDueSince =
    subscription.status === "past_due"
      ? (existing?.past_due_since ?? new Date().toISOString())
      : null;

  await getSupabase()
    .from("subscriptions")
    .update({
      status: subscription.status,
      past_due_since: pastDueSince,
      product_id: productId,
      price_id: priceId,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);

  // On renewal the period advances → refill. Unrelated updates no-op, and a
  // failed payment refills nothing (see creditsForStatus).
  const userId = (subscription.metadata?.userId as string | undefined) ?? existing?.user_id;
  if (userId) {
    await refillArticleCredits(userId, periodEnd, creditsForStatus(subscription.status));
  }
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({
      status: "canceled",
      past_due_since: null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "customer.subscription.created":
      await handleSubscriptionCreated(event.data.object, env);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env query parameter:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});