/**
 * The integrations directory's rules, enforced. A platform the dashboard offers
 * without a page, a headline that breaks the hero lockup, or copy that leans on
 * proof we don't have fails here rather than in production.
 */
import { describe, expect, it } from "vitest";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import {
  INTEGRATIONS,
  INTEGRATION_CATEGORIES,
  getIntegration,
  isAddon,
  relatedIntegrations,
  type Integration,
} from "./integrations";

/** Every string a visitor reads on the integration's page. */
function copyOf(i: Integration): string[] {
  return [
    i.name,
    i.tagline,
    i.eyebrow,
    i.headline.lead,
    i.headline.accent,
    i.subhead,
    i.metaTitle,
    i.metaDescription,
    i.highlightsTitle,
    i.fields.title,
    i.fields.intro,
    ...i.specs.flatMap((s) => [s.value, s.label]),
    ...i.highlights.flatMap((h) => [h.title, h.body]),
    ...i.setup.flatMap((s) => [s.title, s.body]),
    ...i.fields.rows.flatMap((r) => [r.from, r.to]),
    ...i.faqs.flatMap((f) => [f.q, f.a]),
  ];
}

describe("integrations directory", () => {
  it("has a page for every platform the dashboard offers", () => {
    for (const p of PUBLISH_PLATFORMS) {
      const page = INTEGRATIONS.find((i) => i.platform === p.id);
      expect(page, `no integration page for ${p.id}`).toBeDefined();
      // The dashboard and the page must agree on what gets installed.
      expect(page!.kind, `${p.id} is a ${p.addon} in platforms.ts`).toBe(p.addon);
      expect(page!.name).toBe(p.name);
    }
  });

  it("uses unique, URL-safe slugs", () => {
    const slugs = INTEGRATIONS.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const slug of slugs) expect(getIntegration(slug)?.slug).toBe(slug);
  });

  it("puts every integration in a listed category", () => {
    for (const i of INTEGRATIONS) expect(INTEGRATION_CATEGORIES).toContain(i.category);
  });

  it("suggests related integrations other than the page itself", () => {
    for (const i of INTEGRATIONS) {
      const related = relatedIntegrations(i);
      expect(related).toHaveLength(3);
      expect(related.map((r) => r.slug)).not.toContain(i.slug);
    }
  });
});

describe.each(INTEGRATIONS.map((i) => [i.slug, i] as const))("%s", (_slug, i) => {
  it("keeps each headline part short enough for the hero lockup", () => {
    expect(i.headline.lead.length).toBeLessThanOrEqual(22);
    expect(i.headline.accent.length).toBeLessThanOrEqual(22);
  });

  it("has search metadata within length", () => {
    expect(i.metaTitle.length).toBeLessThanOrEqual(60);
    expect(i.metaDescription.length).toBeGreaterThanOrEqual(120);
    expect(i.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("fills every section of the page template", () => {
    expect(i.specs).toHaveLength(4);
    expect(i.highlights).toHaveLength(3);
    expect(i.setup).toHaveLength(3);
    expect(i.fields.rows.length).toBeGreaterThanOrEqual(3);
    expect(i.faqs.length).toBeGreaterThanOrEqual(4);
    expect(i.sample.titles.length).toBeGreaterThanOrEqual(1);
  });

  it("never asks the same question twice", () => {
    const qs = i.faqs.map((f) => f.q);
    expect(new Set(qs).size).toBe(qs.length);
  });

  it("claims no proof we don't have", () => {
    // Facts about the product only: no install counts, ratings, reviews,
    // customer tallies, or traffic promises.
    const banned =
      /\b\d[\d,.]*\s*[kKmM]?\+?\s*(installs?|downloads?|users|customers|reviews|stars|sites)\b|\brat(ed|ing)\b|\b\d+(\.\d+)?\s*\/\s*5\b|\b(guarantee[sd]?|10x|skyrocket)\b/i;
    for (const text of copyOf(i)) expect(text).not.toMatch(banned);
  });

  it("links to no third-party store listing", () => {
    for (const text of copyOf(i)) expect(text).not.toMatch(/https?:\/\/(?!rankbox\.xyz)/);
  });

  if (isAddon(i)) {
    it("shows the add-on's settings and where articles land", () => {
      expect(i.platform).toBeDefined();
      expect(i.settings?.length).toBeGreaterThanOrEqual(2);
      expect(i.sample.titles.length).toBeGreaterThanOrEqual(4);
    });

    it("reports each live URL back to Rankbox, as the API expects", () => {
      expect(i.fields.rows.at(-1)?.back).toBe(true);
    });
  }
});
