/**
 * The /solutions rules, enforced: every tool and feature a page names exists,
 * competitor prices come from the sourced head-to-heads, the readiness checks
 * match the dashboard's, and no copy claims citation tracking before it ships.
 */
import { describe, expect, it } from "vitest";
import { TOOLS } from "@/data/tools";
import { FEATURES } from "@/data/features";
import { MATCHUPS } from "@/data/compare/matchups";
import { SHIPPED } from "@/data/competitors/shared";
import { AI_SIGNALS } from "@/components/dashboard/rank-model";
import { MARKETING_VOICE } from "@/lib/reddit/compliance";
import { SOLUTIONS } from "./index";
import { GATES, JOBS, READINESS_SIGNALS } from "./gates";
import { VISIBILITY, VISIBILITY_FAQS } from "./ai-search-visibility";
import { AEO, AEO_TOOL_SLUGS, LANDSCAPE, PRICING_SOURCE, aeoFaqs } from "./aeo-tools";
import { cheapestOf, loadPricing } from "./market";

/** Every string a page renders from data, flattened. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const COPY = strings([VISIBILITY, VISIBILITY_FAQS, AEO, aeoFaqs(null), JOBS, SOLUTIONS]);

describe("what the pages name exists", () => {
  it("lists only real tools, each once", () => {
    const slugs = new Set(TOOLS.map((t) => t.slug));
    for (const s of AEO_TOOL_SLUGS) expect(slugs.has(s), s).toBe(true);
    expect(new Set(AEO_TOOL_SLUGS).size).toBe(AEO_TOOL_SLUGS.length);
  });

  it("links only real features", () => {
    const slugs = new Set(FEATURES.map((f) => f.slug));
    const named = [
      ...JOBS.flatMap((j) => j.features),
      ...VISIBILITY.loop.flatMap((l) => (l.feature ? [l.feature] : [])),
    ];
    for (const s of named) expect(slugs.has(s), s).toBe(true);
  });

  it("describes the readiness score with the dashboard's own checks", () => {
    expect([...READINESS_SIGNALS]).toEqual(AI_SIGNALS.map((s) => s.label));
  });

  it("gives every gate a failure line for the lab", () => {
    for (const g of GATES) expect(g.fail.length, g.id).toBeGreaterThan(20);
  });
});

describe("competitor facts come from the head-to-heads", () => {
  it("maps every product to the side of the matchup it's on", () => {
    for (const row of LANDSCAPE) {
      for (const p of row.products) {
        const src = PRICING_SOURCE[p];
        const m = MATCHUPS.find((x) => x.slug === src.matchup);
        expect(m, `${p}: ${src.matchup}`).toBeDefined();
        expect(m![src.side], p).toBe(p);
      }
    }
  });

  it("loads a dated price or quote for every product listed", async () => {
    const priced = await loadPricing(LANDSCAPE.flatMap((r) => r.products));
    for (const p of Object.values(priced)) {
      expect(p.checkedOn, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.url, p.slug).toMatch(/^https:\/\//);
    }
    expect(cheapestOf(priced)).not.toBeNull();
  });
});

describe("claims", () => {
  it("never says Rankbox tracks citations while it doesn't", () => {
    if (SHIPPED.citationTracking) return;
    const claims = COPY.filter(
      (t) =>
        /\b(tracks?|tracking|monitors?|monitoring)\b[^.]*\bcitations?\b/i.test(t) ||
        /\bcitations?\b[^.]*\b(tracked|monitored)\b/i.test(t),
    )
      // A question ("Does Rankbox track AI citations?") asks; it doesn't claim.
      .filter((t) => !t.trim().endsWith("?"))
      .filter((t) => !/\b(not|n't|yet)\b/i.test(t));
    expect(claims).toEqual([]);
  });

  it("sounds like a person", () => {
    const hits = COPY.flatMap((t) =>
      MARKETING_VOICE.filter((m) => m.pattern.test(t)).map((m) => `${m.word}: ${t.slice(0, 60)}`),
    );
    expect(hits).toEqual([]);
  });

  it("keeps titles and descriptions inside what search results show", () => {
    for (const page of [VISIBILITY, AEO]) {
      expect(page.metaTitle.length, page.metaTitle).toBeLessThanOrEqual(65);
      expect(page.metaDescription.length, page.metaDescription).toBeGreaterThanOrEqual(110);
      expect(page.metaDescription.length, page.metaDescription).toBeLessThanOrEqual(165);
    }
  });

  it("puts each page's head term in its title and H1", () => {
    for (const page of [VISIBILITY, AEO]) {
      const term = page.keywords[0].toLowerCase();
      expect(page.metaTitle.toLowerCase()).toContain(term);
      expect(`${page.h1.lead} ${page.h1.accent}`.toLowerCase()).toContain(term.replace(/s$/, ""));
    }
  });
});
