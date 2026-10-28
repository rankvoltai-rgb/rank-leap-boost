/**
 * What a subscription row lets an account do, as pure rules.
 *
 * The server enforces these (entitlement.server.ts reads the row and refuses);
 * the dashboard explains them (the billing banner, the engine strip, the
 * launch checklist). Both import this one copy, so the UI can never show a
 * user as writing while the server refuses them — which is what happened when
 * each page kept its own list of "good" statuses.
 *
 * A failed payment stops everything at once. There used to be a 48-hour grace
 * for `past_due`; the rule now is that nothing generates until billing is
 * fixed, and the banner says so from the first failure.
 */
import { siteIsLive } from "@/lib/studio";

/** The subscription columns the rules read. */
export interface SubRow {
  status: string | null;
  current_period_end: string | null;
  past_due_since?: string | null;
  card_verified?: boolean | null;
  /** First time the subscription was seen active — i.e. paid. See subscriptionIsPaid. */
  activated_at?: string | null;
}

/** The columns of a site (`profiles` row) the checks read. */
export interface SiteGateRow {
  kind: string;
  status: string;
  removes_at: string | null;
}

/** Statuses that entitle a user to generate outright. */
const ENTITLED = new Set(["trialing", "active"]);

/** Statuses Stripe uses for "a payment is owed and hasn't gone through". */
const PAYMENT_FAILED = new Set(["past_due", "unpaid", "incomplete", "paused"]);

/** A cancelled plan keeps what it paid for until the period actually ends. */
function stillInPaidPeriod(row: SubRow, now: number): boolean {
  return !!row.current_period_end && new Date(row.current_period_end).getTime() > now;
}

/** Whether the row lets the account's primary site generate. */
export function rowEntitles(row: SubRow | null | undefined, now = Date.now()): boolean {
  if (!row?.status) return false;
  // A trial whose card could not hold a dollar generates nothing. Only an
  // explicit false blocks: null means the check has not run or found no card,
  // and a paying subscriber is past the question entirely.
  if (row.status === "trialing" && row.card_verified === false) return false;
  if (ENTITLED.has(row.status)) return true;
  if (row.status === "canceled") return stillInPaidPeriod(row, now);
  return false;
}

/**
 * Whether a subscription row is PAID, as opposed to merely entitled.
 *
 * Generation is open to a trial; the backlink exchange is not — a throwaway
 * seven-day trial must not be able to mint link equity out of the network.
 * So `trialing` fails here even with a verified card, and a cancelled plan
 * only qualifies when it was actually seen active at some point
 * (`activated_at`, stamped by the webhook) — a trial cancelled mid-way also
 * has a future period end.
 */
export function subscriptionIsPaid(row: SubRow | null | undefined, now = Date.now()): boolean {
  if (!row?.status) return false;
  if (row.status === "active") return true;
  if (row.status === "canceled" && row.activated_at) return stillInPaidPeriod(row, now);
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

/**
 * Why an account that has been through checkout can't write right now, if
 * anything. No subscription at all is not a billing issue — that account
 * hasn't passed the onboarding paywall yet, and the route sends it there.
 */
export type BillingIssue = "card_check_failed" | "payment_failed" | "plan_ended";

export function billingIssueOf(
  row: SubRow | null | undefined,
  now = Date.now(),
): BillingIssue | null {
  if (!row?.status) return null;
  if (row.status === "trialing") return row.card_verified === false ? "card_check_failed" : null;
  if (PAYMENT_FAILED.has(row.status)) return "payment_failed";
  if (row.status === "canceled") return stillInPaidPeriod(row, now) ? null : "plan_ended";
  if (row.status === "incomplete_expired") return "plan_ended";
  return null;
}

/** What the server says when it refuses, one line per issue: what to do, not what broke. */
export const BILLING_ISSUE_MESSAGE: Record<BillingIssue, string> = {
  card_check_failed: "We couldn't verify your card. Update it to start writing.",
  payment_failed: "Your last payment didn't go through. Update billing to keep writing.",
  plan_ended: "Your plan has ended. Restart it to keep writing.",
};

/**
 * One free trial per account. Anyone who has ever had a subscription — trial
 * or paid, ended or not — restarts on the paid plan.
 */
export function trialDaysFor(hadSubscription: boolean, trialDays: number): number | undefined {
  return hadSubscription ? undefined : trialDays;
}
