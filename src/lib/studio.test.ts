import { describe, expect, it } from "vitest";
import { PLAN, STUDIO } from "@/data/pricing";
import {
  allowanceFor,
  allowanceShare,
  monthlyTotal,
  PENDING_TTL_MS,
  periodRemaining,
  prorateAllowance,
  reconcileStudio,
  siteIsBilled,
  siteIsLive,
  sortSites,
  studioBlockFor,
  type ReconcileSite,
} from "./studio";

const NOW = Date.parse("2026-09-22T12:00:00Z");
const DAY = 86_400_000;
const iso = (offsetMs: number) => new Date(NOW + offsetMs).toISOString();

const START = iso(-10 * DAY);
const END = iso(20 * DAY);

const site = (over: Partial<ReconcileSite> = {}): ReconcileSite => ({
  id: over.id ?? "s",
  kind: "studio",
  status: "active",
  billed_from: iso(-DAY),
  removes_at: null,
  created_at: iso(-DAY),
  ...over,
});

describe("siteIsLive", () => {
  it("is true for an active site with nothing scheduled", () => {
    expect(siteIsLive(site(), NOW)).toBe(true);
  });
  it("keeps a site scheduled for removal running until the date passes", () => {
    expect(siteIsLive(site({ removes_at: iso(DAY) }), NOW)).toBe(true);
    expect(siteIsLive(site({ removes_at: iso(0) }), NOW)).toBe(false);
    expect(siteIsLive(site({ removes_at: iso(-DAY) }), NOW)).toBe(false);
  });
  it("is false for pending and archived sites", () => {
    expect(siteIsLive(site({ status: "pending" }), NOW)).toBe(false);
    expect(siteIsLive(site({ status: "archived" }), NOW)).toBe(false);
  });
});

describe("siteIsBilled", () => {
  it("counts only active Studio sites with no removal scheduled", () => {
    expect(siteIsBilled(site())).toBe(true);
    expect(siteIsBilled(site({ kind: "primary" }))).toBe(false);
    expect(siteIsBilled(site({ removes_at: iso(DAY) }))).toBe(false);
    expect(siteIsBilled(site({ status: "pending" }))).toBe(false);
    expect(siteIsBilled(site({ status: "archived" }))).toBe(false);
  });
});

describe("proration", () => {
  it("measures what's left of the period", () => {
    expect(periodRemaining(START, END, NOW)).toBeCloseTo(20 / 30, 6);
    expect(periodRemaining(START, END, Date.parse(END) + DAY)).toBe(0);
    expect(periodRemaining(START, END, Date.parse(START) - DAY)).toBe(1);
  });

  it("treats an unknown period as a whole one", () => {
    expect(periodRemaining(null, null, NOW)).toBe(1);
    expect(periodRemaining(END, START, NOW)).toBe(1);
  });

  it("gives the primary its full allowance, always", () => {
    expect(allowanceShare({ kind: "primary", billed_from: iso(-DAY) }, START, END)).toBe(1);
  });

  it("gives a Studio site added part-way through the share it paid for", () => {
    const share = allowanceShare({ kind: "studio", billed_from: NOW_ISO() }, START, END);
    expect(share).toBeCloseTo(20 / 30, 6);
    expect(allowanceFor(share)).toEqual({
      articles: 20,
      backlinkCredits: 20,
      redditReplies: 20,
    });
  });

  it("gives a Studio site billed since before this period its full allowance", () => {
    expect(allowanceShare({ kind: "studio", billed_from: iso(-40 * DAY) }, START, END)).toBe(1);
    expect(allowanceShare({ kind: "studio", billed_from: null }, START, END)).toBe(1);
  });

  it("rounds up, and never leaves a paid site with nothing", () => {
    expect(prorateAllowance(30, 0.5)).toBe(15);
    expect(prorateAllowance(30, 0.51)).toBe(16);
    expect(prorateAllowance(30, 0.001)).toBe(1);
    expect(prorateAllowance(30, 0)).toBe(0);
    expect(prorateAllowance(30, 1)).toBe(30);
    expect(prorateAllowance(30, 1.5)).toBe(30);
  });

  it("scales every part of the plan the same way", () => {
    expect(allowanceFor(1)).toEqual({
      articles: PLAN.articlesPerMonth,
      backlinkCredits: PLAN.backlinkCreditsPerMonth,
      redditReplies: PLAN.redditRepliesPerMonth,
    });
  });
});

describe("monthlyTotal", () => {
  it("adds each Studio site at its own price", () => {
    expect(monthlyTotal(0)).toBe(PLAN.monthly);
    expect(monthlyTotal(1)).toBe(PLAN.monthly + STUDIO.monthlyPerSite);
    expect(monthlyTotal(3)).toBe(PLAN.monthly + 3 * STUDIO.monthlyPerSite);
    expect(monthlyTotal(-2)).toBe(PLAN.monthly);
  });
});

describe("studioBlockFor", () => {
  it("opens only on an active plan that isn't ending", () => {
    expect(studioBlockFor({ status: "active", cancel_at_period_end: false })).toBeNull();
  });
  it("names what's in the way otherwise", () => {
    expect(studioBlockFor(null)).toBe("no_plan");
    expect(studioBlockFor({ status: "trialing" })).toBe("trialing");
    expect(studioBlockFor({ status: "past_due" })).toBe("past_due");
    expect(studioBlockFor({ status: "unpaid" })).toBe("past_due");
    expect(studioBlockFor({ status: "canceled" })).toBe("lapsed");
    expect(studioBlockFor({ status: "active", cancel_at_period_end: true })).toBe("canceling");
  });
});

describe("reconcileStudio", () => {
  const a = site({ id: "a", created_at: iso(-3 * DAY) });
  const b = site({ id: "b", created_at: iso(-2 * DAY) });
  const primary = site({ id: "p", kind: "primary", created_at: iso(-90 * DAY) });

  it("does nothing when our sites and Stripe agree", () => {
    expect(reconcileStudio([primary, a, b], 2, NOW)).toEqual({
      activate: [],
      scheduleRemoval: [],
      discard: [],
    });
  });

  it("brings up a pending site Stripe is already billing for", () => {
    const pending = site({ id: "n", status: "pending", created_at: iso(-60_000) });
    expect(reconcileStudio([primary, a, pending], 2, NOW).activate).toEqual(["n"]);
  });

  it("brings up the oldest pending sites first, and only as many as are paid for", () => {
    const n1 = site({ id: "n1", status: "pending", created_at: iso(-120_000) });
    const n2 = site({ id: "n2", status: "pending", created_at: iso(-60_000) });
    expect(reconcileStudio([a, n2, n1], 2, NOW).activate).toEqual(["n1"]);
  });

  it("winds down the newest sites when fewer are billed, never the primary", () => {
    const plan = reconcileStudio([primary, a, b], 1, NOW);
    expect(plan.scheduleRemoval).toEqual(["b"]);
    expect(reconcileStudio([primary, a, b], 0, NOW).scheduleRemoval).toEqual(["b", "a"]);
  });

  it("ignores sites already leaving when counting what's billed", () => {
    const leaving = site({ id: "l", removes_at: iso(5 * DAY) });
    expect(reconcileStudio([a, leaving], 1, NOW)).toEqual({
      activate: [],
      scheduleRemoval: [],
      discard: [],
    });
  });

  it("discards a pending site nobody paid for once it has gone stale", () => {
    const stale = site({ id: "x", status: "pending", created_at: iso(-PENDING_TTL_MS - 1) });
    const fresh = site({ id: "y", status: "pending", created_at: iso(-60_000) });
    expect(reconcileStudio([a, stale, fresh], 1, NOW).discard).toEqual(["x"]);
  });
});

describe("sortSites", () => {
  it("puts the primary first, then the rest in the order they were added", () => {
    const sorted = sortSites([
      site({ id: "late", created_at: iso(-DAY) }),
      site({ id: "p", kind: "primary", created_at: iso(-DAY / 2) }),
      site({ id: "early", created_at: iso(-3 * DAY) }),
    ]);
    expect(sorted.map((s) => s.id)).toEqual(["p", "early", "late"]);
  });
});

function NOW_ISO() {
  return new Date(NOW).toISOString();
}
