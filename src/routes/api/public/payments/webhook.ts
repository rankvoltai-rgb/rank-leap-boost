import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook, createStripeClient } from "@/lib/stripe.server";

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

// Refill the user's article credits to 30 for a new billing cycle.
// reset_article_credits no-ops unless the period actually advanced, so this is
// safe to call on every relevant subscription event.
async function refillArticleCredits(userId: string, periodEnd: number | null | undefined) {
  if (!userId) return;
  const periodIso = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
  await getSupabase().rpc("reset_article_credits", {
    _user_id: userId,
    _period_end: periodIso,
  });
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

  // New / trialing subscriber starts the cycle with a full 30 credits.
  await refillArticleCredits(userId, periodEnd);
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

  await getSupabase()
    .from("subscriptions")
    .update({
      status: subscription.status,
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

  // On renewal the period advances → refill to 30. Unrelated updates no-op.
  let userId = subscription.metadata?.userId as string | undefined;
  if (!userId) {
    const { data } = await getSupabase()
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscription.id)
      .maybeSingle();
    userId = data?.user_id;
  }
  if (userId) await refillArticleCredits(userId, periodEnd);
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

// Card-validation trial: the $1 verification charge just succeeded. Create the
// real subscription with a trial on the saved card, then refund the $1.
async function handleValidationCheckout(session: any, env: StripeEnv) {
  if (session.metadata?.flow !== "trial_validation") return;
  const userId = session.metadata?.userId as string | undefined;
  const planPriceId = session.metadata?.planPriceId as string | undefined;
  const trialDays = Number(session.metadata?.trialDays ?? "2") || 2;
  const customerId = session.customer as string | undefined;
  if (!userId || !planPriceId || !customerId) {
    console.error("Validation checkout missing metadata/customer", {
      userId,
      planPriceId,
      customerId,
    });
    return;
  }

  // Idempotency: skip if this user already has a subscription in this env.
  const { data: existing } = await getSupabase()
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("environment", env)
    .maybeSingle();
  if (existing) {
    console.log("Subscription already exists for user, skipping create", userId);
    return;
  }

  const stripe = createStripeClient(env);

  // Retrieve the PaymentIntent to grab the saved payment method.
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  let paymentMethodId: string | undefined;
  if (paymentIntentId) {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    paymentMethodId =
      typeof pi.payment_method === "string"
        ? pi.payment_method
        : pi.payment_method?.id;
  }

  // Make the saved card the customer's default for invoices.
  if (paymentMethodId) {
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  }

  // Resolve the human-readable plan price (e.g. "business_monthly").
  const prices = await stripe.prices.list({ lookup_keys: [planPriceId] });
  if (!prices.data.length) {
    console.error("Plan price not found for validation checkout", planPriceId);
    return;
  }
  const planPrice = prices.data[0];

  await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: planPrice.id }],
    trial_period_days: trialDays,
    metadata: { userId },
    ...(paymentMethodId && { default_payment_method: paymentMethodId }),
  });

  // Refund the $1 validation charge immediately.
  if (paymentIntentId) {
    try {
      await stripe.refunds.create({ payment_intent: paymentIntentId });
    } catch (e) {
      console.error("Failed to refund validation charge", e);
    }
  }
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed":
      await handleValidationCheckout(event.data.object, env);
      break;
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