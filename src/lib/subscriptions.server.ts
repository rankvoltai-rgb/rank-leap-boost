/**
 * Everything that happens to our own tables when a Stripe subscription
 * appears or changes: the `subscriptions` row itself, the account's sites
 * (Studio), each site's article-credit refill, the paid-only gates (exchange,
 * Reddit), and the trial card check.
 *
 * This used to live inside the webhook route. It was lifted out because the
 * webhook is not the only caller: a user returning from embedded checkout
 * reconciles their own subscription straight away (`confirmCheckout` in
 * src/lib/payments.functions.ts), and so does every Studio change
 * (src/lib/studio.server.ts), rather than waiting on a webhook that may be
 * seconds behind — or, in local development, never configured at all. Every
 * path must produce exactly the same rows, so they share one implementation.
 *
 * Every step is idempotent: whichever caller arrives second is a no-op.
 */
import type Stripe from "stripe";
import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import { type StripeEnv, createStripeClient } from "@/lib/stripe.server";
import {
  PLAN,
  PLAN_PRICE_LOOKUP_KEY,
  STUDIO_PRICE_LOOKUP_KEY,
  TRIAL_ARTICLE_CREDITS,
} from "@/data/pricing";
import { subscriptionIsPaid } from "@/lib/entitlement.server";
import {
  allowanceShare,
  prorateAllowance,
  reconcileStudio,
  siteIsLive,
  type ReconcileSite,
} from "@/lib/studio";

/**
 * A subscription as Stripe hands it to us.
 *
 * `current_period_*` moved onto the line item in the 2026 API but still
 * arrives at the top level on older events, so both are read (see itemFacts)
 * and the pair is declared here rather than asserted at each use.
 */
export type SubscriptionLike = Stripe.Subscription & {
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

const isoOf = (seconds: number | null | undefined) =>
  seconds ? new Date(seconds * 1000).toISOString() : null;

/**
 * How many articles the PRIMARY site's current period is worth.
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

/**
 * The two lines a subscription can carry: the plan itself, and Studio (one
 * unit per extra site). Matched by lookup key, never by position — Stripe
 * does not promise an order.
 */
export function itemFacts(subscription: SubscriptionLike) {
  const items = subscription.items?.data ?? [];
  const key = (i: Stripe.SubscriptionItem | undefined) => i?.price?.lookup_key ?? null;
  const studio = items.find((i) => key(i) === STUDIO_PRICE_LOOKUP_KEY);
  const base =
    items.find((i) => key(i) === PLAN_PRICE_LOOKUP_KEY) ??
    items.find((i) => key(i) !== STUDIO_PRICE_LOOKUP_KEY) ??
    items[0];
  return {
    priceId:
      base?.price?.lookup_key || base?.price?.metadata?.lovable_external_id || base?.price?.id,
    productId: base?.price?.product,
    periodStart: base?.current_period_start ?? subscription.current_period_start,
    periodEnd: base?.current_period_end ?? subscription.current_period_end,
    studioItem: studio ?? null,
    studioSites: studio?.quantity ?? 0,
  };
}

type Facts = ReturnType<typeof itemFacts>;

/**
 * Makes the account's sites agree with the subscription, then gives each live
 * site what its period is worth.
 *
 *  1. Stamp `activated_at` the first time the plan is seen paid: the paid
 *     gate tells a lapsed paying member from a trial that never converted.
 *  2. Studio: bring up pending sites Stripe already bills for, wind down any
 *     it no longer does (see reconcileStudio), drop stale unpaid ones, and
 *     archive every site whose scheduled removal date has passed. A plan that
 *     has ended takes every Studio site with it.
 *  3. Per live site: the article refill, the exchange's paid flag and monthly
 *     grant, and Reddit's. A Studio site that started billing part-way
 *     through the period gets the share it paid for (allowanceShare).
 */
async function syncAccount(
  userId: string,
  subscription: SubscriptionLike,
  facts: Facts,
  env: StripeEnv,
) {
  const db = getSupabase();
  const now = Date.now();
  const status = subscription.status;

  // Only the member's newest subscription speaks for their sites. A late or
  // replayed event for one that ended before they subscribed again must not
  // archive the Studio sites the new one is paying for.
  const { data: newest } = await db
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", userId)
    .eq("environment", env)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (newest && newest.stripe_subscription_id !== subscription.id) return;

  if (status === "active") {
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

  const periodStart = isoOf(facts.periodStart);
  const periodEnd = isoOf(facts.periodEnd);

  const loadSites = async () => {
    const { data } = await db
      .from("profiles")
      .select("id, kind, status, billed_from, removes_at, created_at")
      .eq("user_id", userId);
    return (data ?? []) as ReconcileSite[];
  };
  let sites = await loadSites();

  if (status === "canceled") {
    await db
      .from("profiles")
      .update({ status: "archived", archived_at: new Date().toISOString(), removes_at: null })
      .eq("user_id", userId)
      .eq("kind", "studio")
      .neq("status", "archived");
  } else {
    const plan = reconcileStudio(sites, facts.studioSites, now);
    if (plan.activate.length) {
      await db.from("profiles").update({ status: "active" }).in("id", plan.activate);
    }
    if (plan.scheduleRemoval.length && periodEnd) {
      await db.from("profiles").update({ removes_at: periodEnd }).in("id", plan.scheduleRemoval);
    }
    if (plan.discard.length) {
      await db.from("profiles").delete().in("id", plan.discard).eq("status", "pending");
    }
  }
  await db
    .from("profiles")
    .update({ status: "archived", archived_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("kind", "studio")
    .eq("status", "active")
    .lte("removes_at", new Date(now).toISOString());
  sites = await loadSites();

  const paid = subscriptionIsPaid(row);
  for (const site of sites) {
    if (site.status === "pending") continue;
    const live = siteIsLive(site, now);
    const share = allowanceShare(site, periodStart, periodEnd);

    // Article credits. The primary follows the trial/paid ladder; a Studio
    // site only ever exists on a paid plan and only refills on a paid one.
    const monthly =
      site.kind === "primary"
        ? creditsForStatus(status)
        : status === "active"
          ? PLAN.articlesPerMonth
          : null;
    if (live && monthly !== null) {
      await db.rpc("reset_article_credits", {
        _site_id: site.id,
        _period_end: periodEnd,
        _credits: site.kind === "primary" ? monthly : prorateAllowance(monthly, share),
      });
    }

    const sitePaid = paid && live;
    await syncExchange(db, site.id, sitePaid, status, periodEnd, share);
    await syncReddit(db, site.id, sitePaid, status, periodEnd, share);
  }
}

/**
 * The backlink exchange is PAID ONLY, per site. `paid_active` on the site's
 * exchange row is the matcher's one-boolean gate, and the monthly grant
 * happens only for a paying period — a trial gets none, not a smaller one.
 */
async function syncExchange(
  db: SupabaseClient,
  siteId: string,
  paid: boolean,
  status: string | undefined,
  periodEnd: string | null,
  share: number,
) {
  await db.rpc("exchange_set_paid", { _site_id: siteId, _paid: paid });
  if (paid && status === "active") {
    await db.rpc("exchange_grant_credits", {
      _site_id: siteId,
      _period_end: periodEnd,
      _credits: prorateAllowance(PLAN.backlinkCreditsPerMonth, share),
    });
  }
}

/**
 * Reddit presence sits behind the same paid gate as the exchange, so it takes
 * the verdict already computed rather than deciding again.
 *
 * `reddit_set_paid` is what lets the cron's sweep stage — and
 * `reddit_start_sweep` itself — refuse an unpaid site in SQL. The monthly
 * grant is a RESET, not a top-up: these credits are never earned, so an unused
 * month does not bank. A trial gets none.
 *
 * Isolated on purpose. This runs inside the billing webhook, and nothing about
 * Reddit is worth failing a subscription event over: on any error we log and
 * move on, and the cron's paid re-sync puts the flag right within a day.
 */
async function syncReddit(
  db: SupabaseClient,
  siteId: string,
  paid: boolean,
  status: string | undefined,
  periodEnd: string | null,
  share: number,
) {
  try {
    await db.rpc("reddit_set_paid", { _site_id: siteId, _paid: paid });
    if (paid && status === "active" && periodEnd) {
      await db.rpc("reddit_grant_credits", {
        _site_id: siteId,
        _period_end: periodEnd,
        _credits: prorateAllowance(PLAN.redditRepliesPerMonth, share),
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

export async function handleSubscriptionCreated(subscription: SubscriptionLike, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }

  const facts = itemFacts(subscription);

  await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        product_id: facts.productId,
        price_id: facts.priceId,
        status: subscription.status,
        current_period_start: isoOf(facts.periodStart),
        current_period_end: isoOf(facts.periodEnd),
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        studio_sites: facts.studioSites,
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    );

  // A trial starts with the capped allowance; a straight-to-paid one gets all 30.
  await syncAccount(userId, subscription, facts, env);

  // Only a trial needs the check — a paid subscription has already moved money.
  if (subscription.status === "trialing") {
    await verifyCardHasFunds(subscription, env);
  }
}

export async function handleSubscriptionUpdated(subscription: SubscriptionLike, env: StripeEnv) {
  const facts = itemFacts(subscription);

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
      product_id: facts.productId,
      price_id: facts.priceId,
      current_period_start: isoOf(facts.periodStart),
      current_period_end: isoOf(facts.periodEnd),
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      studio_sites: facts.studioSites,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);

  // On renewal the period advances → refill. Unrelated updates no-op, and a
  // failed payment refills nothing (see creditsForStatus).
  const userId = (subscription.metadata?.userId as string | undefined) ?? existing?.user_id;
  if (userId) await syncAccount(userId, subscription, facts, env);
}

export async function handleSubscriptionDeleted(subscription: SubscriptionLike, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({
      status: "canceled",
      past_due_since: null,
      studio_sites: 0,
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
  if (userId) {
    const canceled = { ...subscription, status: "canceled" as const };
    await syncAccount(userId, canceled, { ...itemFacts(canceled), studioSites: 0 }, env);
  }
}

/**
 * Write a subscription we have just been handed, whatever its age.
 *
 * The webhook knows which event it received; checkout returns and Studio
 * changes do not — they have only "here is the subscription as it now is".
 * Upserting via the created path is right for all of them: the row is keyed
 * on `stripe_subscription_id`, so an existing row is updated in place, and the
 * follow-on steps (sites, credits, paid gates, card check) are each idempotent.
 */
export async function syncSubscriptionFromCheckout(subscription: SubscriptionLike, env: StripeEnv) {
  await handleSubscriptionCreated(subscription, env);
}
