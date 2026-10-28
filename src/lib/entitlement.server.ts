/**
 * Server-side entitlement: what one SITE of an account may do right now.
 *
 * Two facts decide it. The owner's subscription says what the account has paid
 * for, and the site's own row says whether that site is live under it — a
 * Studio site is billed on its own line, so it can have been removed or
 * archived while the rest of the account carries on. Every check reads both,
 * from the database, never from anything the caller sends.
 *
 * The product rule is "nothing generates until a trial is started, and
 * nothing generates while billing is broken", enforced here rather than in the
 * UI: `generateBlogContent` and `runAutopilot` would otherwise generate for
 * anyone signed in, whatever the page showed.
 */
import type { StripeEnv } from "@/lib/stripe.server";
import { getServerStripeEnv } from "@/lib/stripe.server";
import { siteIsLive } from "@/lib/studio";
import {
  BILLING_ISSUE_MESSAGE,
  billingIssueOf,
  siteIsPaid,
  siteMayGenerate,
  subscriptionIsPaid,
  type SiteGateRow,
  type SubRow,
} from "@/lib/entitlement";

// The rules themselves are pure and shared with the dashboard; the server
// half only reads the rows and refuses.
export { siteIsPaid, siteMayGenerate, subscriptionIsPaid, type SiteGateRow };

/** Which site a server call acts on, and whose it is. */
export interface SiteScope {
  userId: string;
  siteId: string;
}

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
  const issue = billingIssueOf(row);
  throw new TrialRequiredError(issue ? BILLING_ISSUE_MESSAGE[issue] : undefined);
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
 * `trialing` and a failed payment never qualify, and `canceled` only does for
 * an account that actually paid once. Sharing `subscriptionIsPaid` rather than
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
