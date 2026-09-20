import { describe, expect, it } from "vitest";
import { authorityFrom } from "./cycle.server";

describe("authorityFrom", () => {
  it("starts a brand-new site at the bottom tier", () => {
    expect(
      authorityFrom({
        finishedArticles: 0,
        avgSeoScore: 0,
        verifiedDays: 0,
        liveHosted: 0,
        lostHosted: 0,
      }),
    ).toEqual({ score: 0, tier: 1 });
  });
  it("rises with publishing, quality, tenure and a clean hosting record", () => {
    const young = authorityFrom({
      finishedArticles: 8,
      avgSeoScore: 90,
      verifiedDays: 20,
      liveHosted: 1,
      lostHosted: 0,
    });
    const proven = authorityFrom({
      finishedArticles: 90,
      avgSeoScore: 96,
      verifiedDays: 200,
      liveHosted: 12,
      lostHosted: 0,
    });
    expect(proven.score).toBeGreaterThan(young.score);
    expect(proven.tier).toBeGreaterThanOrEqual(3);
    expect(young.tier).toBeLessThanOrEqual(2);
  });
  it("is dragged down by lost links", () => {
    const clean = authorityFrom({
      finishedArticles: 40,
      avgSeoScore: 92,
      verifiedDays: 120,
      liveHosted: 6,
      lostHosted: 0,
    });
    const careless = authorityFrom({
      finishedArticles: 40,
      avgSeoScore: 92,
      verifiedDays: 120,
      liveHosted: 6,
      lostHosted: 3,
    });
    expect(careless.score).toBeLessThan(clean.score);
  });
  it("stays within 0..100 and tiers 1..4", () => {
    const max = authorityFrom({
      finishedArticles: 10_000,
      avgSeoScore: 100,
      verifiedDays: 5000,
      liveHosted: 500,
      lostHosted: 0,
    });
    const min = authorityFrom({
      finishedArticles: 0,
      avgSeoScore: 0,
      verifiedDays: 0,
      liveHosted: 0,
      lostHosted: 50,
    });
    expect(max).toEqual({ score: 100, tier: 4 });
    expect(min).toEqual({ score: 0, tier: 1 });
  });
});
