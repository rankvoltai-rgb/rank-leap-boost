/**
 * Server-side generation entitlement.
 *
 * The product rule is "nothing generates until a trial is started", but until
 * now that was enforced nowhere: `generateBlogContent` is a plain POST server
 * function that only checked auth, and `runAutopilot` selected purely on
 * `content_settings.autopilot_enabled` (which defaults to true). Both the UI
 * checks and the credit check were bypassable — credits are granted during
 * onboarding, before any payment.
 *
 * Needs no schema change: `public.subscriptions` already exists and is written
 * by the Stripe webhook.
 */
import type { StripeEnv } from "@/lib/stripe.server";
import { getServerStripeEnv } from "@/lib/stripe.server";

/** Statuses that entitle a user to generate outright. */
const ENTITLED = new Set(["trialing", "active"]);

/**
 * How long a failed payment keeps its access.
 *
 * `past_due` used to entitle indefinitely, which handed anyone whose card
 * declined the whole of Stripe's retry schedule — about three weeks — for
 * free. A short window still covers the genuine case of an expired card, and
 * is measured from `past_due_since` because `current_period_end` jumps a month
 * ahead the moment a trial converts, failed payment or not.
 */
const PAST_DUE_GRACE_MS = 48 * 60 * 60 * 1000;

export class TrialRequiredError extends Error {
  constructor(message = "Start your free trial to generate articles.") {
    super(message);
    this.name = "TrialRequiredError";
  }
}

/**
 * Shown when the card check failed. Deliberately says what to do rather than
 * what went wrong: the same failure covers an empty card and a real one whose
 * bank wanted 3-D Secure, and only one of those deserves an accusation.
 */
const CARD_CHECK_FAILED_MESSAGE =
  "We couldn't verify your card. Update it in billing to start generating.";

interface SubRow {
  status: string | null;
  current_period_end: string | null;
  past_due_since: string | null;
  card_verified: boolean | null;
  /** First time the subscription was seen active — i.e. paid. See subscriptionIsPaid. */
  activated_at?: string | null;
}

function rowEntitles(row: SubRow | null | undefined): boolean {
  if (!row?.status) return false;
  // A trial whose card could not hold a dollar generates nothing. Only an
  // explicit false blocks: null means the check has not run or found no card,
  // and a paying subscriber is past the question entirely.
  if (row.status === "trialing" && row.card_verified === false) return false;
  if (ENTITLED.has(row.status)) return true;
  if (row.status === "past_due") {
    // No stamp means the spell predates this column: treat it as expired
    // rather than granting open-ended access.
    if (!row.past_due_since) return false;
    return Date.now() - new Date(row.past_due_since).getTime() < PAST_DUE_GRACE_MS;
  }
  // A cancelled plan still entitles until the paid period actually ends.
  if (row.status === "canceled" && row.current_period_end) {
    return new Date(row.current_period_end).getTime() > Date.now();
  }
  return false;
}

type MinimalClient = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (
        c: string,
        v: string,
      ) => {
        eq: (
          c: string,
          v: string,
        ) => {
          order: (
            c: string,
            o: { ascending: boolean },
          ) => {
            limit: (n: number) => {
              maybeSingle: () => PromiseLike<{ data: SubRow | null }>;
            };
          };
        };
      };
    };
  };
};

/**
 * Whether this user may generate.
 *
 * `environment` is taken from the server, never the caller — both Stripe keys
 * live on the same worker, so a client-chosen "sandbox" would otherwise let
 * someone complete a $0 test-mode checkout and unlock real generation.
 */
async function latestSubscription(
  supabase: unknown,
  userId: string,
  env: StripeEnv,
): Promise<SubRow | null> {
  const client = supabase as MinimalClient;
  const { data } = await client
    .from("subscriptions")
    .select("status, current_period_end, past_due_since, card_verified, activated_at")
    .eq("user_id", userId)
    .eq("environment", env)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function hasGenerationEntitlement(
  supabase: unknown,
  userId: string,
  env: StripeEnv = getServerStripeEnv(),
): Promise<boolean> {
  return rowEntitles(await latestSubscription(supabase, userId, env));
}

/**
 * Throws unless the user may generate.
 *
 * Known race: `subscriptions` is written asynchronously by the Stripe webhook,
 * so a user who just completed checkout can briefly have no row and be told to
 * start a trial they already started. The UI softens this by only reaching here
 * on an explicit Generate click (well after the redirect back), but closing it
 * properly means reconciling against Stripe on miss — deliberately not done
 * here because that adds a Stripe round trip to every blocked call.
 */
export async function requireGenerationEntitlement(
  supabase: unknown,
  userId: string,
): Promise<void> {
  const row = await latestSubscription(supabase, userId, getServerStripeEnv());
  if (rowEntitles(row)) return;
  throw new TrialRequiredError(
    row?.status === "trialing" && row.card_verified === false
      ? CARD_CHECK_FAILED_MESSAGE
      : undefined,
  );
}

/* ── Paid-only entitlement (the backlink exchange) ───────────────────────── */

/**
 * Whether a subscription row is PAID, as opposed to merely entitled.
 *
 * Generation is open to a trial; the backlink exchange is not — a throwaway
 * seven-day trial must not be able to mint link equity out of the network.
 * So `trialing` fails here even with a verified card, and the two statuses
 * that follow a trial as easily as a paid period (`past_due`, `canceled`) only
 * qualify when the subscription was actually seen active at some point
 * (`activated_at`, stamped by the webhook).
 */
export function subscriptionIsPaid(row: SubRow | null | undefined, now = Date.now()): boolean {
  if (!row?.status) return false;
  if (row.status === "active") return true;
  if (!row.activated_at) return false;
  if (row.status === "past_due") {
    if (!row.past_due_since) return false;
    return now - new Date(row.past_due_since).getTime() < PAST_DUE_GRACE_MS;
  }
  // A cancelled plan was paid for through the end of its period.
  if (row.status === "canceled" && row.current_period_end) {
    return new Date(row.current_period_end).getTime() > now;
  }
  return false;
}

export class PaidPlanRequiredError extends Error {
  constructor(
    message = "The backlink exchange is part of the paid plan. It unlocks with your first invoice.",
  ) {
    super(message);
    this.name = "PaidPlanRequiredError";
  }
}

/** Whether this user may take part in the backlink exchange. Paid plans only. */
export async function hasExchangeEntitlement(
  supabase: unknown,
  userId: string,
  env: StripeEnv = getServerStripeEnv(),
): Promise<boolean> {
  return subscriptionIsPaid(await latestSubscription(supabase, userId, env));
}

/** Throws unless the user is on a paid plan. */
export async function requireExchangeEntitlement(supabase: unknown, userId: string): Promise<void> {
  if (await hasExchangeEntitlement(supabase, userId)) return;
  throw new PaidPlanRequiredError();
}

/* ── Paid-only entitlement (Reddit presence) ─────────────────────────────── */

/**
 * Reddit presence sits behind the SAME predicate as the exchange, on purpose.
 *
 * The reasons differ — the exchange guards link equity; this guards a metered
 * scraping bill and, more to the point, reputational output under a real
 * person's name in threads that outlive any trial — but the rule is identical:
 * `trialing` never qualifies, and `past_due` / `canceled` only do for an
 * account that actually paid once. Sharing `subscriptionIsPaid` rather than
 * restating it is what keeps the two gates from drifting apart.
 */
const REDDIT_PAID_MESSAGE =
  "Reddit presence is part of the paid plan. It opens with your first paid invoice.";

export type RedditAccessVerdict = "paid" | "trial" | "lapsed" | "none";

/**
 * Where an account stands with Reddit presence. Pure, so it can be pinned by a
 * test. `tookPart` is whether the member ever switched the feature on: someone
 * who did and then stopped paying keeps their history, read-only (`lapsed`);
 * someone who never did just sees the pitch (`none`).
 */
export function redditAccessFor(
  row: SubRow | null | undefined,
  tookPart: boolean,
  now = Date.now(),
): RedditAccessVerdict {
  if (subscriptionIsPaid(row, now)) return "paid";
  if (row?.status === "trialing") return "trial";
  return tookPart ? "lapsed" : "none";
}

/** Whether this user may run sweeps and draft replies. Paid plans only. */
export async function hasRedditEntitlement(
  supabase: unknown,
  userId: string,
  env: StripeEnv = getServerStripeEnv(),
): Promise<boolean> {
  return subscriptionIsPaid(await latestSubscription(supabase, userId, env));
}

/** The verdict for the page's gate, from the subscription itself — never a cached flag. */
export async function loadRedditAccess(
  supabase: unknown,
  userId: string,
  tookPart: boolean,
  env: StripeEnv = getServerStripeEnv(),
): Promise<RedditAccessVerdict> {
  return redditAccessFor(await latestSubscription(supabase, userId, env), tookPart);
}

/** Throws unless the user is on a paid plan. */
export async function requireRedditEntitlement(
  supabase: unknown,
  userId: string,
  env: StripeEnv = getServerStripeEnv(),
): Promise<void> {
  if (await hasRedditEntitlement(supabase, userId, env)) return;
  throw new PaidPlanRequiredError(REDDIT_PAID_MESSAGE);
}
