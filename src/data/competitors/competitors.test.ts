/**
 * The comparison pages' rules, enforced. These pages name other companies, so
 * a stale price, an unsourced claim, a competitor described as "missing"
 * something, or a Rankbox feature promised before it ships should fail here
 * rather than in production. The rules themselves are written down in
 * ./shared.ts.
 */
import { describe, expect, it } from "vitest";
import { FEATURE_SLUGS } from "@/data/features";
import {
  COMPETITORS,
  COMPETITOR_SLUGS,
  NAV_COMPETITORS,
  RANKBOX_CELLS,
  RANKBOX_SNAPSHOT,
  SHIPPED,
  HAS_LIVE_PLUGIN,
  costPerArticle,
  type Competitor,
  type Fact,
} from "@/data/alternatives";

const words = (s: string) => s.trim().split(/\s+/).length;

/** Every string Rankbox says about itself on a page, outside the shared cells. */
function rankboxClaims(c: Competitor): string[] {
  return [
    c.subhead,
    c.verdict.rankbox,
    ...c.specs.flatMap((s) => [s.value, s.label]),
    ...c.positioning.rankbox,
    ...c.battlegrounds.flatMap((b) => [b.title, b.body, ...b.points]),
    ...c.migration.steps.flatMap((s) => [s.title, s.body]),
    c.ctaTitle,
    c.ctaBody,
  ];
}

describe("comparison registry", () => {
  it("has unique slugs", () => {
    expect(new Set(COMPETITOR_SLUGS).size).toBe(COMPETITOR_SLUGS.length);
  });

  it("only features registered competitors in the navbar", () => {
    for (const c of NAV_COMPETITORS) expect(COMPETITORS).toContain(c);
  });
});

describe.each(COMPETITORS.map((c) => [c.slug, c] as const))("%s", (_slug, c) => {
  it("is dated with a real calendar date", () => {
    expect(c.pricing.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const [y, m, d] = c.pricing.checkedOn.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    expect(date.getMonth()).toBe(m - 1);
    expect(date.getDate()).toBe(d);
  });

  it("lists at least four sources, all on the competitor's own site", () => {
    expect(c.sources.length).toBeGreaterThanOrEqual(4);
    for (const s of c.sources) {
      const host = new URL(s.url).hostname;
      expect(s.url.startsWith("https://")).toBe(true);
      expect(host === c.domain || host.endsWith(`.${c.domain}`)).toBe(true);
    }
    expect(new Set(c.sources.map((s) => s.url)).size).toBe(c.sources.length);
  });

  it("compares against a plan that appears in its own plan ladder", () => {
    const plan = c.pricing.plans.find((p) => p.name === c.pricing.plan);
    expect(plan, `${c.pricing.plan} missing from plans`).toBeDefined();
    expect(plan!.monthly).toBe(c.pricing.monthly);
    expect(plan!.articles).toBe(c.pricing.articles);
  });

  it("lists plans cheapest first, ending with any custom tier", () => {
    const priced = c.pricing.plans.map((p) => p.monthly).filter((n): n is number => n !== null);
    const firstCustom = c.pricing.plans.findIndex((p) => p.monthly === null);
    if (firstCustom !== -1) {
      expect(c.pricing.plans.slice(firstCustom).every((p) => p.monthly === null)).toBe(true);
    }
    // Annual variants of a plan may sit beside the monthly one; the base
    // monthly prices must still rise.
    const base = c.pricing.plans.filter((p) => !/annual|quarterly/i.test(p.name));
    const baseMonthly = base.map((p) => p.monthly).filter((n): n is number => n !== null);
    expect([...baseMonthly].sort((a, b) => a - b)).toEqual(baseMonthly);
    expect(priced.length).toBeGreaterThan(0);
  });

  it("works out cost per article only where the plan is sold by the article", () => {
    const each = costPerArticle(c);
    if (c.pricing.articles) expect(each).toBeCloseTo(c.pricing.monthly / c.pricing.articles, 1);
    else expect(each).toBeNull();
  });

  it("never says a competitor can't do something (rule 1)", () => {
    for (const row of c.matrix.flatMap((g) => g.rows)) {
      if (row.them.state !== "no") continue;
      expect(row.them.note).not.toMatch(/\b(can'?t|cannot|missing|lacks?|unable|fails?)\b/i);
    }
  });

  it("keeps snapshot facts short enough for the hero card", () => {
    const facts: Fact[] = [
      c.snapshot.publishing,
      c.snapshot.backlinks,
      c.snapshot.aiVisibility,
      c.snapshot.keywordData,
    ];
    for (const f of facts) expect(words(f.short), f.short).toBeLessThanOrEqual(7);
    expect(words(c.snapshot.bestFor)).toBeLessThanOrEqual(8);
  });

  it("links every deep dive to a real feature page", () => {
    for (const b of c.battlegrounds) {
      expect(FEATURE_SLUGS as readonly string[]).toContain(b.featureSlug);
    }
  });

  it("gives the page's short answer both names", () => {
    expect(c.shortAnswer).toContain("Rankbox");
    expect(c.shortAnswer).toContain(c.name);
  });

  it("names a real FAQ set and a 'when they win' section", () => {
    expect(c.faqs.length).toBeGreaterThanOrEqual(5);
    expect(c.betterWhen.length).toBeGreaterThanOrEqual(3);
  });

  /* Rule 3: Rankbox's side describes what ships today. */
  it("doesn't promise unshipped Rankbox features", () => {
    const text = rankboxClaims(c).join("\n");
    if (!SHIPPED.citationTracking) {
      expect(text).not.toMatch(/\b(tracks?|monitors?)\b[^.]*\bcitations?\b/i);
      expect(text).not.toMatch(/which AI answers (now )?(name|cite)/i);
    }
    if (!SHIPPED.teamInvites) {
      expect(text).not.toMatch(/unlimited (seats|team|users)/i);
    }
    if (!HAS_LIVE_PLUGIN) {
      expect(text).not.toMatch(/one[- ]click (for )?(WordPress|Shopify|Webflow|Wix|Framer)/i);
      expect(text).not.toMatch(/\bWix\b/);
    }
  });

  it("uses the shared Rankbox cells, so one flag updates every page", () => {
    const shared = new Set(Object.values(RANKBOX_CELLS).map((cell) => cell.note));
    const tracking = c.matrix
      .flatMap((g) => g.rows)
      .filter((r) => /citation tracking/i.test(r.label));
    for (const r of tracking) expect(shared.has(r.rankbox.note)).toBe(true);
    const publishing = c.matrix
      .flatMap((g) => g.rows)
      .filter((r) => /publishes to your cms/i.test(r.label));
    for (const r of publishing) expect(r.rankbox).toBe(RANKBOX_CELLS.publish);
  });
});

describe("Rankbox's own side", () => {
  it("describes tracking as it actually is", () => {
    expect(RANKBOX_SNAPSHOT.aiVisibility.state).toBe(SHIPPED.citationTracking ? "yes" : "partial");
  });

  it("describes publishing as it actually is", () => {
    expect(RANKBOX_CELLS.publish.state).toBe(HAS_LIVE_PLUGIN ? "yes" : "partial");
  });
});
