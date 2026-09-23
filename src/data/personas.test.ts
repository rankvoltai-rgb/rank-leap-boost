/**
 * The use-case pages' rules, enforced. A headline that breaks the hero lockup,
 * a pick or platform that points at nothing, or copy that promises a result
 * fails here rather than in production.
 */
import { describe, expect, it } from "vitest";
import { FEATURES } from "@/data/features";
import { INTEGRATIONS } from "@/data/integrations";
import { PLAN, STUDIO, formatUsd } from "@/data/pricing";
import {
  PERSONAS,
  PERSONA_GROUPS,
  getPersona,
  personasIn,
  withArticle,
  type Persona,
} from "./personas";

/** Every string a visitor reads on the persona's page. */
function copyOf(p: Persona): string[] {
  return [
    p.name,
    p.tagline,
    p.eyebrow,
    p.headline.lead,
    p.headline.accent,
    p.subhead,
    p.metaTitle,
    p.metaDescription,
    p.shortAnswer,
    ...p.specs.flatMap((s) => [s.value, s.label]),
    ...p.handoff.runs.flatMap((l) => [l.label, l.detail]),
    ...p.handoff.keeps.flatMap((l) => [l.label, l.detail]),
    p.painsTitle,
    p.painsIntro,
    ...p.pains.flatMap((x) => [x.pain, x.fix]),
    p.workflowTitle,
    p.workflowIntro,
    ...p.steps.flatMap((s) => [s.when, s.title, s.body]),
    p.stackTitle,
    p.stackIntro,
    ...p.stack.flatMap((s) => [s.label, s.detail]),
    p.stackNote,
    p.picksTitle,
    p.picksIntro,
    ...p.picks.map((x) => x.why),
    ...(p.topics
      ? [
          p.topics.title,
          p.topics.intro,
          p.topics.note,
          p.topics.platformsTitle,
          ...p.topics.clusters.flatMap((c) => [c.stage, c.intent, ...c.questions]),
          ...p.topics.platforms.map((x) => x.why),
        ]
      : []),
    ...p.faqs.flatMap((f) => [f.q, f.a]),
    p.ctaTitle,
    p.ctaBody,
  ];
}

describe("use-case pages", () => {
  it("uses unique, URL-safe slugs", () => {
    const slugs = PERSONAS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const slug of slugs) expect(getPersona(slug)?.slug).toBe(slug);
  });

  it("puts every page in a group, and fills every group", () => {
    const ids = PERSONA_GROUPS.map((g) => g.id);
    for (const p of PERSONAS) expect(ids).toContain(p.group);
    for (const id of ids) expect(personasIn(id).length, id).toBeGreaterThan(0);
  });

  it("keeps each group to rows of three, so the index and seat grids stay even", () => {
    for (const g of PERSONA_GROUPS) expect(personasIn(g.id).length % 3, g.id).toBe(0);
  });

  it("keeps the hero lockup and the nav rail labels short enough to hold", () => {
    for (const p of PERSONAS) {
      // Measured at 390–1440px: an 18-character lead ("Compete on content")
      // broke onto two lines, so the H1 ran to three.
      expect(p.headline.lead.length, p.slug).toBeLessThanOrEqual(17);
      expect(p.headline.accent.length, p.slug).toBeLessThanOrEqual(18);
      expect(p.shortName.length, p.slug).toBeLessThanOrEqual(10);
    }
  });

  it("keeps meta titles and descriptions within what search results show", () => {
    for (const p of PERSONAS) {
      expect(p.metaTitle.length, p.slug).toBeLessThanOrEqual(60);
      expect(p.metaDescription.length, p.slug).toBeLessThanOrEqual(175);
    }
  });

  it("gives the band under the hero four facts, and every section its full set", () => {
    for (const p of PERSONAS) {
      expect(p.specs, p.slug).toHaveLength(4);
      expect(p.handoff.runs, p.slug).toHaveLength(4);
      expect(p.handoff.keeps, p.slug).toHaveLength(4);
      expect(p.pains, p.slug).toHaveLength(4);
      expect(p.steps, p.slug).toHaveLength(4);
      expect(p.stack.length, p.slug).toBeGreaterThanOrEqual(4);
      expect(p.picks, p.slug).toHaveLength(4);
      expect(p.faqs.length, p.slug).toBeGreaterThanOrEqual(4);
    }
  });

  it("points every pick at a real feature page, once", () => {
    for (const p of PERSONAS) {
      const slugs = p.picks.map((x) => x.featureSlug);
      expect(new Set(slugs).size, p.slug).toBe(slugs.length);
      for (const slug of slugs) {
        expect(
          FEATURES.some((f) => f.slug === slug),
          `${p.slug} picks ${slug}`,
        ).toBe(true);
      }
    }
  });

  it("gives every business page a sample map and the integrations that fit", () => {
    for (const p of personasIn("business")) {
      expect(p.topics, p.slug).toBeDefined();
      expect(p.topics!.clusters, p.slug).toHaveLength(4);
      for (const c of p.topics!.clusters) expect(c.questions.length, c.stage).toBe(3);
      expect(p.topics!.platforms, p.slug).toHaveLength(3);
      for (const { slug } of p.topics!.platforms) {
        expect(
          INTEGRATIONS.some((i) => i.slug === slug),
          `${p.slug} lists ${slug}`,
        ).toBe(true);
      }
      // The sample is labelled as one, in words, under the window.
      expect(p.topics!.note, p.slug).toMatch(/fictional/i);
    }
  });

  it("never borrows proof: a page with none shows none", () => {
    for (const p of personasIn("business")) expect(p.proof, p.slug).toEqual([]);
  });

  it("promises no outcomes", () => {
    const outcome =
      /\b(guarantee[sd]?|10x|2x|3x|double your|triple your|skyrocket|explode|#1|rank(s|ed)? first|first page of google|page one of google|more traffic|more sales|more revenue|boost(s|ed)? (your )?(sales|traffic|revenue)|hours saved|save \d+ hours)\b/i;
    for (const p of PERSONAS) {
      for (const line of copyOf(p)) expect(line, `${p.slug}: ${line}`).not.toMatch(outcome);
    }
  });

  it("puts a price only on our own plan", () => {
    const ours = new Set([formatUsd(PLAN.monthly), formatUsd(STUDIO.monthlyPerSite)]);
    for (const p of PERSONAS) {
      for (const line of copyOf(p)) {
        for (const price of line.match(/\$\d[\d,.]*/g) ?? []) {
          expect(ours.has(price), `${p.slug}: ${price} in "${line}"`).toBe(true);
        }
      }
    }
  });

  it("reads 'a' or 'an' correctly before each role", () => {
    expect(withArticle("agency")).toBe("an agency");
    expect(withArticle("marketer")).toBe("a marketer");
    for (const p of PERSONAS) expect(withArticle(p.role)).toMatch(/^an? \S/);
  });
});
