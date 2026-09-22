/**
 * Studio's rules — more than one site under one account — as pure functions
 * the server, the Stripe webhook and the dashboard all read, so what a page
 * promises and what billing does cannot drift apart.
 *
 * A site is `primary` (the one onboarding created, covered by the base plan)
 * or `studio` (every extra site, one more unit of the Studio line on the same
 * subscription). A studio site is `pending` while its first payment is in
 * flight, `active` once paid, and `archived` when it stops being billed; a
 * scheduled removal (`removes_at`) keeps it running to the end of the period
 * already paid for. Nothing is refunded and nothing is deleted.
 */
import { PLAN, STUDIO } from "@/data/pricing";

export type SiteKind = "primary" | "studio";
export type SiteStatus = "pending" | "active" | "archived";

/** The billing-relevant columns of a site (a `profiles` row). */
export interface SiteBilling {
  kind: string;
  status: string;
  billed_from: string | null;
  removes_at: string | null;
}

/** A pending site nobody confirmed within this long was never paid for. */
export const PENDING_TTL_MS = 60 * 60 * 1000;

const at = (iso: string | null | undefined): number => (iso ? Date.parse(iso) : Number.NaN);

/**
 * Usable right now. Pending sites are not yet, archived ones no longer are,
 * and a scheduled removal ends a site the moment its date passes — even if
 * the webhook that archives it has not arrived.
 */
export function siteIsLive(
  site: Pick<SiteBilling, "status" | "removes_at">,
  now = Date.now(),
): boolean {
  if (site.status !== "active") return false;
  const ends = at(site.removes_at);
  return !(Number.isFinite(ends) && ends <= now);
}

/** Counts toward the Studio line on the next invoice. */
export function siteIsBilled(site: Pick<SiteBilling, "kind" | "status" | "removes_at">): boolean {
  return site.kind === "studio" && site.status === "active" && !site.removes_at;
}

/** Share of a billing period still to run at `moment`, from 0 to 1. */
export function periodRemaining(
  periodStart: string | null | undefined,
  periodEnd: string | null | undefined,
  moment = Date.now(),
): number {
  const start = at(periodStart);
  const end = at(periodEnd);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 1;
  return Math.min(1, Math.max(0, (end - moment) / (end - start)));
}

/**
 * How much of this period's allowance a site gets: all of it, unless it
 * started billing part-way through, when it gets the share it paid for. The
 * webhook and the checkout that adds the site both compute it from
 * `billed_from`, so whichever arrives first grants the same number.
 */
export function allowanceShare(
  site: Pick<SiteBilling, "kind" | "billed_from">,
  periodStart: string | null | undefined,
  periodEnd: string | null | undefined,
): number {
  if (site.kind !== "studio") return 1;
  const from = at(site.billed_from);
  if (!Number.isFinite(from) || from <= at(periodStart)) return 1;
  return periodRemaining(periodStart, periodEnd, from);
}

/**
 * A monthly allowance scaled to a share of the period. Rounded up, and never
 * zero while any of the period is left: a site bought on the last day still
 * gets its one article.
 */
export function prorateAllowance(monthly: number, share: number): number {
  if (!(share > 0) || monthly <= 0) return 0;
  if (share >= 1) return monthly;
  return Math.max(1, Math.ceil(monthly * share));
}

export interface Allowance {
  articles: number;
  backlinkCredits: number;
  redditReplies: number;
}

/** The plan's full monthly allowance, scaled to a share of the period. */
export function allowanceFor(share: number): Allowance {
  return {
    articles: prorateAllowance(PLAN.articlesPerMonth, share),
    backlinkCredits: prorateAllowance(PLAN.backlinkCreditsPerMonth, share),
    redditReplies: prorateAllowance(PLAN.redditRepliesPerMonth, share),
  };
}

/** What the account costs a month with this many Studio sites on top of the plan. */
export function monthlyTotal(studioSites: number): number {
  return Math.round((PLAN.monthly + STUDIO.monthlyPerSite * Math.max(0, studioSites)) * 100) / 100;
}

/**
 * Why Studio can't take a new site right now, or null when it can.
 *
 *   no_plan    nothing to add a line to
 *   trialing   the trial covers one site; Studio opens with the first paid
 *              invoice (a trial that could add sites would hand every
 *              throwaway card a stack of free articles)
 *   past_due   the last invoice failed; fix the card first
 *   canceling  the plan ends at the period's close; adding to it is pointless
 *   lapsed     canceled, unpaid or otherwise not running
 */
export type StudioBlock = "no_plan" | "trialing" | "past_due" | "canceling" | "lapsed";

export function studioBlockFor(
  sub: { status: string | null; cancel_at_period_end?: boolean | null } | null | undefined,
): StudioBlock | null {
  if (!sub?.status) return "no_plan";
  if (sub.status === "trialing") return "trialing";
  if (sub.status === "past_due" || sub.status === "unpaid" || sub.status === "incomplete") {
    return "past_due";
  }
  if (sub.status !== "active") return "lapsed";
  if (sub.cancel_at_period_end) return "canceling";
  return null;
}

export const STUDIO_BLOCK_COPY: Record<StudioBlock, string> = {
  no_plan: "Start your plan first. Studio adds sites to a paid plan.",
  trialing: "Studio opens with your first paid invoice. Your trial covers one site.",
  past_due: "Your last payment didn't go through. Update your card in billing to add sites.",
  canceling: "Your plan is set to end. Resume it in billing to add sites.",
  lapsed: "Your plan isn't active. Restart it in billing to add sites.",
};

export interface ReconcileSite extends SiteBilling {
  id: string;
  created_at: string;
}

export interface ReconcilePlan {
  /** Pending sites Stripe is already billing for: their payment went through. */
  activate: string[];
  /** Billed sites Stripe no longer bills for: they run to the period's end, then stop. */
  scheduleRemoval: string[];
  /** Pending sites nobody paid for within PENDING_TTL_MS. */
  discard: string[];
}

/**
 * Makes our sites agree with the quantity Stripe actually bills on the Studio
 * line, which is the truth about what has been paid for.
 *
 * Normally they already agree, because every change goes through the Studio
 * functions and they move both. This is for the gaps: a request that died
 * between the charge and marking the site live (Stripe's webhook then brings
 * it up), or a quantity changed from outside the app (the newest sites are
 * the ones that stop, at the end of the period already paid for — never at
 * once, and never the primary).
 */
export function reconcileStudio(
  sites: ReconcileSite[],
  quantity: number,
  now = Date.now(),
): ReconcilePlan {
  const byAge = (a: ReconcileSite, b: ReconcileSite) => at(a.created_at) - at(b.created_at);
  const billed = sites.filter(siteIsBilled).sort(byAge);
  const pending = sites.filter((s) => s.kind === "studio" && s.status === "pending").sort(byAge);
  const want = Math.max(0, quantity);

  const activate =
    billed.length < want ? pending.slice(0, want - billed.length).map((s) => s.id) : [];
  const scheduleRemoval =
    billed.length > want
      ? billed
          .slice()
          .reverse()
          .slice(0, billed.length - want)
          .map((s) => s.id)
      : [];
  const discard = pending
    .filter((s) => !activate.includes(s.id) && now - at(s.created_at) > PENDING_TTL_MS)
    .map((s) => s.id);

  return { activate, scheduleRemoval, discard };
}

/** Switchers and lists: the primary first, then the rest in the order they were added. */
export function sortSites<T extends { kind: string; created_at: string }>(sites: T[]): T[] {
  return sites
    .slice()
    .sort((a, b) =>
      a.kind === b.kind ? at(a.created_at) - at(b.created_at) : a.kind === "primary" ? -1 : 1,
    );
}
