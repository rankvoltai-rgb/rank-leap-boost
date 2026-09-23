/**
 * The internal-linking rules, enforced. A page nobody links to, a card whose
 * title drifted from the page it points at, or a comparison that links to a
 * feature that hasn't shipped fails here rather than in production.
 */
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FEATURE_SLUGS } from "@/data/features";
import { PERSONA_SLUGS } from "@/data/personas";
import { INTEGRATIONS, INTEGRATION_SLUGS } from "@/data/integrations";
import { AI_TOOLS, AI_TOOL_SLUGS, relatedAiTools } from "@/data/ai-integrations";
import { ENGINES } from "@/data/ai-seo/engines";
import { TERMS } from "@/data/glossary/terms";
import { TOOLS, TOOL_SLUGS, relatedTools } from "@/data/tools";
import { COMPETITORS, SHIPPED } from "@/data/alternatives";
import { MATCHUPS, matchupTitle, relatedMatchups } from "@/data/compare/matchups";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { parseFrontmatter } from "@/lib/markdown-blocks";
import {
  CARD_LIMIT,
  HAND_WRITTEN,
  PER_SECTION,
  TERM_LIMIT,
  TERM_NAMES,
  TOPICS,
  cardFor,
  crossLinks,
  sectionOf,
} from "./link-graph";

const BLOG_DIR = "src/content/blog";
const POSTS = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({
    slug: f.replace(/\.md$/, ""),
    ...parseFrontmatter(readFileSync(`${BLOG_DIR}/${f}`, "utf8")),
  }))
  .filter((p) => p.data.draft !== "true" && p.data.title);

/** Every public detail page the sitemap lists, by the same sources it reads. */
const PAGES = [
  "/pricing",
  ...FEATURE_SLUGS.map((s) => `/features/${s}`),
  ...PERSONA_SLUGS.map((s) => `/use-cases/${s}`),
  ...INTEGRATION_SLUGS.map((s) => `/integrations/${s}`),
  ...AI_TOOL_SLUGS.map((s) => `/integrations/${s}`),
  ...ENGINES.map((e) => `/ai-seo/${e.slug}`),
  ...TERMS.map((t) => `/glossary/${t.slug}`),
  ...TOOL_SLUGS.map((s) => `/tools/${s}`),
  ...COMPETITORS.map((c) => `/alternatives/${c.slug}`),
  ...MATCHUPS.map((m) => `/compare/${m.slug}`),
  ...POSTS.map((p) => `/blog/${p.slug}`),
];

const LISTED = new Set(TOPICS.flatMap((t) => t.pages));
const links = new Map(PAGES.map((p) => [p, crossLinks(p)]));

describe("hand-written titles match the pages they point at", () => {
  it("names every glossary term exactly as the glossary does", () => {
    expect(Object.keys(TERM_NAMES).sort()).toEqual(TERMS.map((t) => t.slug).sort());
    for (const t of TERMS) expect(TERM_NAMES[t.slug], t.slug).toBe(t.term);
  });

  it("covers every publishing integration by its own name", () => {
    expect(Object.keys(HAND_WRITTEN.integrations).sort()).toEqual([...INTEGRATION_SLUGS].sort());
    for (const i of INTEGRATIONS) {
      const card = HAND_WRITTEN.integrations[i.slug];
      expect(card.title, i.slug).toContain(i.name);
      if (i.kind !== "mcp") expect(card.blurb, i.slug).toBe(i.tagline);
    }
  });

  it("titles AI-tool pages the way their own H1 does", () => {
    for (const [slug, card] of Object.entries(HAND_WRITTEN.connectors)) {
      const tool = AI_TOOLS.find((t) => t.id === slug);
      expect(tool, slug).toBeDefined();
      expect(card.title).toBe(`Rankbox for ${tool!.name}`);
      expect(card.blurb).toBe(tool!.tagline);
    }
  });

  it("titles every head-to-head as the page does", () => {
    expect(Object.keys(HAND_WRITTEN.compare).sort()).toEqual(MATCHUPS.map((m) => m.slug).sort());
    for (const m of MATCHUPS) expect(HAND_WRITTEN.compare[m.slug].title).toBe(matchupTitle(m));
  });

  it("titles every blog article as its frontmatter does", () => {
    expect(Object.keys(HAND_WRITTEN.blog).sort()).toEqual(POSTS.map((p) => p.slug).sort());
    for (const p of POSTS) expect(HAND_WRITTEN.blog[p.slug].title, p.slug).toBe(p.data.title);
  });
});

describe("topics", () => {
  it("only list pages that exist", () => {
    const pages = new Set(PAGES);
    for (const topic of TOPICS) {
      for (const p of topic.pages) {
        expect(pages.has(p), `${topic.id}: ${p}`).toBe(true);
        expect(cardFor(p), `${topic.id}: ${p} has no title`).toBeDefined();
      }
      expect(new Set(topic.pages).size, `${topic.id} lists a page twice`).toBe(topic.pages.length);
    }
  });

  it("place every public page", () => {
    const unplaced = PAGES.filter((p) => links.get(p) === null);
    expect(unplaced, "add these to a topic in link-graph.ts").toEqual([]);
  });

  it("give every page they list a link from another section", () => {
    const linked = new Set<string>();
    for (const result of links.values()) {
      for (const card of [...(result?.cards ?? []), ...(result?.terms ?? [])])
        linked.add(card.href);
    }
    const orphans = [...LISTED].filter((p) => !linked.has(p));
    expect(
      orphans,
      "no other section suggests these; list them higher or in another topic",
    ).toEqual([]);
  });
});

describe("the links on a page", () => {
  it("never point at the page itself, twice at one page, or into its own section", () => {
    for (const [path, result] of links) {
      if (!result) continue;
      const hrefs = [...result.cards, ...result.terms].map((c) => c.href);
      expect(hrefs, path).not.toContain(path);
      expect(new Set(hrefs).size, path).toBe(hrefs.length);
      for (const href of hrefs)
        expect(sectionOf(href), `${path} -> ${href}`).not.toBe(sectionOf(path));
    }
  });

  it("stay within the limits, so no section crowds out the rest", () => {
    for (const [path, result] of links) {
      if (!result) continue;
      expect(result.cards.length, path).toBeLessThanOrEqual(CARD_LIMIT);
      expect(result.terms.length, path).toBeLessThanOrEqual(TERM_LIMIT);
      const per = new Map<string, number>();
      for (const c of result.cards) per.set(c.section, (per.get(c.section) ?? 0) + 1);
      for (const [section, n] of per)
        expect(n, `${path}: ${section}`).toBeLessThanOrEqual(PER_SECTION);
    }
  });

  it("give every page at least three places to go", () => {
    for (const [path, result] of links) {
      if (!result) continue;
      expect(result.cards.length + result.terms.length, path).toBeGreaterThanOrEqual(3);
    }
  });

  it("drop the pages the template already links to", () => {
    const [first] = crossLinks("/features/citation-tracking")!.cards;
    const without = crossLinks("/features/citation-tracking", [first.href])!;
    expect(without.cards.map((c) => c.href)).not.toContain(first.href);
  });

  it("never send a comparison to a feature or add-on that hasn't shipped", () => {
    const unshipped = [
      ...(SHIPPED.citationTracking ? [] : ["/features/citation-tracking"]),
      ...(PUBLISH_PLATFORMS.some((p) => p.addonLive) ? [] : ["/features/auto-publishing"]),
      ...PUBLISH_PLATFORMS.filter((p) => !p.addonLive).map((p) => `/integrations/${p.id}`),
    ];
    for (const [path, result] of links) {
      if (!result || !/^\/(alternatives|compare)\//.test(path)) continue;
      for (const card of result.cards)
        expect(unshipped, `${path} -> ${card.href}`).not.toContain(card.href);
    }
  });
});

describe("related blocks within a section reach every page", () => {
  it("every free tool is suggested by another tool", () => {
    const suggested = new Set(TOOLS.flatMap((t) => relatedTools(t).map((r) => r.slug)));
    expect(TOOL_SLUGS.filter((s) => !suggested.has(s))).toEqual([]);
  });

  it("every AI-tool page is suggested by another of its kind", () => {
    const suggested = new Set(AI_TOOLS.flatMap((t) => relatedAiTools(t).map((r) => r.id)));
    expect(AI_TOOL_SLUGS.filter((s) => !suggested.has(s))).toEqual([]);
  });

  it("every head-to-head is suggested by another", () => {
    const suggested = new Set(MATCHUPS.flatMap((m) => relatedMatchups(m).map((r) => r.slug)));
    expect(MATCHUPS.map((m) => m.slug).filter((s) => !suggested.has(s))).toEqual([]);
  });
});
