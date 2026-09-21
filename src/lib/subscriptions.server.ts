/**
 * Everything that happens to our own tables when a Stripe subscription
 * appears or changes: the `subscriptions` row itself, the article-credit
 * refill, the paid-only gates (exchange, Reddit), and the trial card check.
 *
 * This used to live inside the webhook route. It was lifted out because the
 * webhook is no longer the only caller: a user returning from embedded
 * checkout reconciles their own subscription straight away
 * (`confirmCheckout` in src/lib/payments.functions.ts) rather than waiting on
 * a webhook that may be seconds behind — or, in local development, never
 * configured at all. Both paths must produce exactly the same row, so they
 * share one implementation.
 *
 * Every step is idempotent: whichever of the two arrives second is a no-op.
 */
import type Stripe from "stripe";
import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";
import { PLAN, TRIAL_ARTICLE_CREDITS } from "@/data/pricing";
import { subscriptionIsPaid } from "@/lib/entitlement.server";

/**
 * A subscription as Stripe hands it to us.
 *
 * `current_period_*` moved onto the line item in the 2026 API but still
 * arrives at the top level on older events, so both are read (see itemFacts)
 * and the pair is declared here rather than asserted at each use.
 */
type SubscriptionLike = Stripe.Subscription & {
  current_period_start?: number | null;
  current_period_end?: number | null;
};

let _supabase: SupabaseClient | null = null;

/** Service-role client: these writes are the billing system's, not a user's. */
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
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
 * Keeps the backlink exchange in step with the subscription.
 *
 * The exchange is PAID ONLY. `activated_at` is stamped the first time a
 * subscription is seen active, so a later past_due or canceled row can still
 * be told apart from a trial that never converted; `paid_active` on the
 * member's exchange site is then the matcher's one-boolean gate; and the
 * monthly credit grant happens only for a paying period — a trial gets none,
 * not a smaller one. Everything is idempotent, so replays are harmless.
 */
async function syncExchange(
  userId: string,
  subscription: SubscriptionLike,
  periodEnd: number | null | undefined,
) {
  if (!userId) return;
  const db = getSupabase();
  if (subscription.status === "active") {
    await db
      .from("subscriptions")
      .update({ activated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", subscription.id)
      .is("activated_at", null);
  }
  const { data: row } = await db
    .from("subscriptions")
    .select("status, current_period_end, past_due_since, card_verified, activated_at")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();
  const paid = subscriptionIsPaid(row);
  await db.rpc("exchange_set_paid", { _user_id: userId, _paid: paid });
  if (paid && subscription.status === "active") {
    await db.rpc("exchange_grant_credits", {
      _user_id: userId,
      _period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      _credits: PLAN.backlinkCreditsPerMonth,
    });
  }
  await syncReddit(db, userId, paid, subscription.status, periodEnd);
}

/**
 * Reddit presence sits behind the same paid gate as the exchange, so it takes
 * the verdict already computed above rather than deciding again.
 *
 * `reddit_set_paid` is what lets the cron's sweep stage — and
 * `reddit_start_sweep` itself — refuse an unpaid account in SQL. The monthly
 * grant is a RESET, not a top-up: these credits are never earned, so an unused
 * month does not bank. A trial gets none.
 *
 * Isolated on purpose. This runs inside the billing webhook, and nothing about
 * Reddit is worth failing a subscription event over: on any error we log and
 * move on, and the cron's paid re-sync puts the flag right within a day.
 */
async function syncReddit(
  db: SupabaseClient,
  userId: string,
  paid: boolean,
  status: string | undefined,
  periodEnd: number | null | undefined,
) {
  try {
    await db.rpc("reddit_set_paid", { _user_id: userId, _paid: paid });
    if (paid && status === "active" && periodEnd) {
      await db.rpc("reddit_grant_credits", {
        _user_id: userId,
        _period_end: new Date(periodEnd * 1000).toISOString(),
        _credits: PLAN.redditRepliesPerMonth,
      });
    }
  } catch (e) {
    console.error("reddit sync failed", e);
  }
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
async function verifyCardHasFunds(subscription: SubscriptionLike, env: StripeEnv) {
  const subscriptionId = subscription.id;
  const customer =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;

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
          typeof fallback === "string" ? fallback : (fallback as { id?: string } | undefined)?.id;
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
      // Stripe replays webhooks, and checkout's own confirmation races them.
      // Without this key a retry would hold a second dollar.
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

/** The fields we read off a subscription's single line item, in one place. */
function itemFacts(subscription: SubscriptionLike) {
  const item = subscription.items?.data?.[0];
  return {
    priceId:
      item?.price?.lookup_key || item?.price?.metadata?.lovable_external_id || item?.price?.id,
    productId: item?.price?.product,
    periodStart: item?.current_period_start ?? subscription.current_period_start,
    periodEnd: item?.current_period_end ?? subscription.current_period_end,
  };
}

export async function handleSubscriptionCreated(subscription: SubscriptionLike, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }

  const { priceId, productId, periodStart, periodEnd } = itemFacts(subscription);

  await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        product_id: productId,
        price_id: priceId,
        status: subscription.status,
        current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    );

  // A trial starts with the capped allowance; a straight-to-paid one gets all 30.
  await refillArticleCredits(userId, periodEnd, creditsForStatus(subscription.status));
  await syncExchange(userId, subscription, periodEnd);

  // Only a trial needs the check — a paid subscription has already moved money.
  if (subscription.status === "trialing") {
    await verifyCardHasFunds(subscription, env);
  }
}

export async function handleSubscriptionUpdated(subscription: SubscriptionLike, env: StripeEnv) {
  const { priceId, productId, periodStart, periodEnd } = itemFacts(subscription);

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
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
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
    await syncExchange(userId, subscription, periodEnd);
  }
}

export async function handleSubscriptionDeleted(subscription: SubscriptionLike, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({
      status: "canceled",
      past_due_since: null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);

  const { data: row } = await getSupabase()
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();
  const userId = (subscription.metadata?.userId as string | undefined) ?? row?.user_id;
  if (userId) await syncExchange(userId, { ...subscription, status: "canceled" }, null);
}

/**
 * Write a subscription we have just been handed, whatever its age.
 *
 * The webhook knows which event it received; the checkout return does not —
 * it has only "here is the subscription that now exists". Upserting via the
 * created path is right for both: the row is keyed on
 * `stripe_subscription_id`, so an existing row is updated in place, and the
 * follow-on steps (credits, paid gates, card check) are each idempotent.
 */
export async function syncSubscriptionFromCheckout(subscription: SubscriptionLike, env: StripeEnv) {
  await handleSubscriptionCreated(subscription, env);
}
