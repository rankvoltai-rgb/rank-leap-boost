/**
 * Server-side entitlement: what one SITE of an account may do right now.
 *
 * Two facts decide it. The owner's subscription says what the account has paid
 * for, and the site's own row says whether that site is live under it — a
 * Studio site is billed on its own line, so it can have been removed or
 * archived while the rest of the account carries on. Every check reads both,
 * from the database, never from anything the caller sends.
 *
 * The product rule is "nothing generates until a trial is started", enforced
 * here rather than in the UI: `generateBlogContent` and `runAutopilot` would
 * otherwise generate for anyone signed in, whatever the page showed.
 */
import type { StripeEnv } from "@/lib/stripe.server";
import { getServerStripeEnv } from "@/lib/stripe.server";
import { siteIsLive } from "@/lib/studio";

/** Which site a server call acts on, and whose it is. */
export interface SiteScope {
  userId: string;
  siteId: string;
}

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
 * The site itself isn't running: it was never paid for, its Studio line was
 * removed and the paid period has ended, or it isn't this account's at all.
 * One message for all three, so a probe learns nothing about other accounts.
 */
export class SiteUnavailableError extends Error {
  constructor(message = "This site isn't active on your plan. Restore it from Studio to use it.") {
    super(message);
    this.name = "SiteUnavailableError";
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

/** The columns of a site (`profiles` row) the checks read. */
export interface SiteGateRow {
  kind: string;
  status: string;
  removes_at: string | null;
}

function rowEntitles(row: SubRow | null | undefined, now = Date.now()): boolean {
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
    return now - new Date(row.past_due_since).getTime() < PAST_DUE_GRACE_MS;
  }
  // A cancelled plan still entitles until the paid period actually ends.
  if (row.status === "canceled" && row.current_period_end) {
    return new Date(row.current_period_end).getTime() > now;
  }
  return false;
}

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

/**
 * Whether this site may generate. The primary follows the plan, trial
 * included. A Studio site is only ever sold on a paid plan, so it asks the
 * stricter question — a plan that lapses back past paid takes its Studio
 * sites with it, whatever state they were left in.
 */
export function siteMayGenerate(
  site: SiteGateRow | null | undefined,
  row: SubRow | null | undefined,
  now = Date.now(),
): boolean {
  if (!site || !siteIsLive(site, now)) return false;
  return site.kind === "studio" ? subscriptionIsPaid(row, now) : rowEntitles(row, now);
}

/** Whether this site takes part in the paid-only features (backlinks, Reddit). */
export function siteIsPaid(
  site: SiteGateRow | null | undefined,
  row: SubRow | null | undefined,
  now = Date.now(),
): boolean {
  return !!site && siteIsLive(site, now) && subscriptionIsPaid(row, now);
}

/* ── Reads ─────────────────────────────────────────────────────────────── */

type Chain<T> = {
  select: (cols: string) => Chain<T>;
  eq: (c: string, v: string) => Chain<T>;
  order: (c: string, o: { ascending: boolean }) => Chain<T>;
  limit: (n: number) => Chain<T>;
  maybeSingle: () => PromiseLike<{ data: T | null }>;
};
type MinimalClient = { from: (table: string) => Chain<unknown> };

/**
 * The owner's newest subscription for the SERVER's Stripe environment.
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
  return data as SubRow | null;
}

/** The site, only if this owner owns it. */
async function loadSiteGate(supabase: unknown, scope: SiteScope): Promise<SiteGateRow | null> {
  const client = supabase as MinimalClient;
  const { data } = await client
    .from("profiles")
    .select("kind, status, removes_at")
    .eq("id", scope.siteId)
    .eq("user_id", scope.userId)
    .maybeSingle();
  return data as SiteGateRow | null;
}

async function loadGate(supabase: unknown, scope: SiteScope, env: StripeEnv) {
  const [row, site] = await Promise.all([
    latestSubscription(supabase, scope.userId, env),
    loadSiteGate(supabase, scope),
  ]);
  return { row, site };
}

/* ── Generation (trial or paid) ─────────────────────────────────────────── */

export async function hasGenerationEntitlement(
  supabase: unknown,
  scope: SiteScope,
  env: StripeEnv = getServerStripeEnv(),
): Promise<boolean> {
  const { row, site } = await loadGate(supabase, scope, env);
  return siteMayGenerate(site, row);
}

/**
 * Throws unless this site may generate.
 *
 * Known race: `subscriptions` is written asynchronously by the Stripe webhook,
 * so a user who just completed checkout can briefly have no row and be told to
 * start a trial they already started. `confirmCheckout` closes it for the
 * embedded checkout by writing the row itself.
 */
export async function requireGenerationEntitlement(
  supabase: unknown,
  scope: SiteScope,
): Promise<void> {
  const { row, site } = await loadGate(supabase, scope, getServerStripeEnv());
  if (siteMayGenerate(site, row)) return;
  if (!site || !siteIsLive(site)) throw new SiteUnavailableError();
  throw new TrialRequiredError(
    row?.status === "trialing" && row.card_verified === false
      ? CARD_CHECK_FAILED_MESSAGE
      : undefined,
  );
}

/* ── Paid-only entitlement (the backlink exchange) ───────────────────────── */

export class PaidPlanRequiredError extends Error {
  constructor(
    message = "The backlink exchange is part of the paid plan. It unlocks with your first invoice.",
  ) {
    super(message);
    this.name = "PaidPlanRequiredError";
  }
}

/** Whether this site may take part in the backlink exchange. Paid plans only. */
export async function hasExchangeEntitlement(
  supabase: unknown,
  scope: SiteScope,
  env: StripeEnv = getServerStripeEnv(),
): Promise<boolean> {
  const { row, site } = await loadGate(supabase, scope, env);
  return siteIsPaid(site, row);
}

/** Throws unless the site is live on a paid plan. */
export async function requireExchangeEntitlement(
  supabase: unknown,
  scope: SiteScope,
): Promise<void> {
  if (await hasExchangeEntitlement(supabase, scope)) return;
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

/** The same verdict for one site: a site that isn't live is never `paid`. */
export function siteRedditAccessFor(
  site: SiteGateRow | null | undefined,
  row: SubRow | null | undefined,
  tookPart: boolean,
  now = Date.now(),
): RedditAccessVerdict {
  if (site && !siteIsLive(site, now)) return tookPart ? "lapsed" : "none";
  return redditAccessFor(row, tookPart, now);
}

/** Whether this site may run sweeps and draft replies. Paid plans only. */
export async function hasRedditEntitlement(
  supabase: unknown,
  scope: SiteScope,
  env: StripeEnv = getServerStripeEnv(),
): Promise<boolean> {
  const { row, site } = await loadGate(supabase, scope, env);
  return siteIsPaid(site, row);
}

/** The verdict for the page's gate, from the subscription itself — never a cached flag. */
export async function loadRedditAccess(
  supabase: unknown,
  scope: SiteScope,
  tookPart: boolean,
  env: StripeEnv = getServerStripeEnv(),
): Promise<RedditAccessVerdict> {
  const { row, site } = await loadGate(supabase, scope, env);
  return siteRedditAccessFor(site, row, tookPart);
}

/** Throws unless the site is live on a paid plan. */
export async function requireRedditEntitlement(
  supabase: unknown,
  scope: SiteScope,
  env: StripeEnv = getServerStripeEnv(),
): Promise<void> {
  if (await hasRedditEntitlement(supabase, scope, env)) return;
  throw new PaidPlanRequiredError(REDDIT_PAID_MESSAGE);
}
