/**
 * The rules for "best X alternatives" blog posts (src/content/blog/*-alternatives.md).
 *
 * These posts name real companies and rank Rankbox first, so they are held to
 * the same standard as the comparison pages (src/data/competitors/shared.ts):
 * a price without a date, a competitor described as unable to do something,
 * testing we didn't do, or a Rankbox feature claimed before it ships should
 * fail here rather than in production. Every post must also score 100 on the
 * same SEO checks the article writer optimizes to.
 */
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "@/lib/markdown-blocks";
import { analyzeArticle } from "@/lib/seo-analysis";
import { COMPETITORS, HAS_LIVE_PLUGIN, SHIPPED } from "@/data/alternatives";
import { PLAN, formatUsd } from "@/data/pricing";
import { cardFor, sectionOf } from "@/data/link-graph";
import { PRICE_CHARTS } from "@/data/blog-figures";

const BLOG_DIR = "src/content/blog";
const POSTS = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith("-alternatives.md"))
  .map((f) => {
    const slug = f.replace(/\.md$/, "");
    const { data, body } = parseFrontmatter(readFileSync(`${BLOG_DIR}/${f}`, "utf8"));
    return { slug, data, body };
  });

/** "surfer-seo-alternatives" -> the Surfer SEO competitor entry. */
function competitorOf(slug: string) {
  return COMPETITORS.find((c) => `${c.slug}-alternatives` === slug);
}

/** The markdown under one "## Heading", up to the next "## ". */
function section(body: string, heading: RegExp): string {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => l.startsWith("## ") && heading.test(l));
  if (start < 0) return "";
  const end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n");
}

/** Body text without link targets, code, or the References list (titles quote vendors). */
function prose(body: string): string {
  return body
    .replace(/\n## References[\s\S]*$/, "")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/`[^`]*`/g, "");
}

/* No first-party testing we didn't do, and never "it can't" about a product. */
const BANNED = [
  /\bwe tested\b/i,
  /\bwe tried\b/i,
  /\bin our (own )?test(s|ing)?\b/i,
  /\bour (own )?(data|benchmark|study|research)\b/i,
  /\bhands-on\b/i,
  /\bwe found\b/i,
  /\bcan(?:'|’)t\b/i,
  /\bcannot\b/i,
  /\black(s|ing)?\b/i,
  /\bis missing\b/i,
  /no credit card/i,
];

/* Rankbox features that are not live, so no post may state them as shipped. */
const RANKBOX_OVERCLAIMS = [
  ...(SHIPPED.citationTracking
    ? []
    : [/Rankbox (also )?(tracks|monitors)/i, /\/features\/citation-tracking/]),
  ...(HAS_LIVE_PLUGIN ? [] : [/Rankbox publishes (directly|natively)/i, /one-click publishing/i]),
  ...(SHIPPED.teamInvites ? [] : [/unlimited (seats|team members|users)/i]),
];

describe("alternatives posts", () => {
  it("exist, one per competitor at most", () => {
    expect(POSTS.length).toBeGreaterThan(0);
    for (const p of POSTS) expect(competitorOf(p.slug), p.slug).toBeDefined();
  });
});

describe.each(POSTS.map((p) => [p.slug, p] as const))("%s", (slug, { data, body }) => {
  const competitor = competitorOf(slug)!;
  const keyword = data.keyword ?? "";

  it("targets '<name> alternatives' in the title and meta description", () => {
    expect(keyword.toLowerCase()).toBe(`${competitor.name} alternatives`.toLowerCase());
    expect(data.title.length).toBeLessThanOrEqual(60);
    expect(data.title.toLowerCase()).toContain(keyword.toLowerCase());
    expect(data.description.length).toBeGreaterThanOrEqual(120);
    expect(data.description.length).toBeLessThanOrEqual(160);
    expect(data.description.toLowerCase()).toContain(keyword.toLowerCase());
    expect(data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(data.tags).toMatch(/\bAlternatives\b/);
  });

  it("scores 100 on the article writer's SEO checks", () => {
    const analysis = analyzeArticle({
      title: data.title,
      keyword,
      description: data.description,
      body,
    });
    const failing = analysis.checks.filter((c) => c.status !== "pass").map((c) => c.detail);
    expect(failing).toEqual([]);
    expect(analysis.score).toBe(100);
    expect(analysis.metrics.words).toBeGreaterThanOrEqual(2750);
  });

  it("ranks 4–12 tools, Rankbox first, and never the competitor itself", () => {
    const picks = [...body.matchAll(/^### (\d+)\. (.+)$/gm)].map((m) => ({
      n: Number(m[1]),
      name: m[2],
    }));
    expect(picks.length).toBeGreaterThanOrEqual(4);
    expect(picks.length).toBeLessThanOrEqual(12);
    picks.forEach((p, i) => expect(p.n, p.name).toBe(i + 1));
    expect(picks[0].name).toMatch(/^Rankbox\b/);
    for (const p of picks) expect(p.name.startsWith(competitor.name), p.name).toBe(false);
    // The count in the title is the count on the page.
    const titled = data.title.match(/^(\d+) /);
    if (titled) expect(Number(titled[1])).toBe(picks.length);
  });

  it("discloses that we make Rankbox before the list starts", () => {
    const beforeList = body.slice(0, body.search(/^### 1\. /m));
    expect(beforeList).toMatch(/we make Rankbox/i);
  });

  it("dates its prices", () => {
    expect(body).toMatch(/checked on \d{1,2} [A-Z][a-z]+ 20\d\d/);
  });

  it("claims no testing it didn't do, and never says a product can't", () => {
    const text = prose(body);
    for (const pattern of BANNED) expect(text, String(pattern)).not.toMatch(pattern);
  });

  it("describes Rankbox as it ships today", () => {
    // What the post says about Rankbox: its own entry, plus any sentence
    // elsewhere that names it. Other tools' entries may say what they ship.
    const entry = body.match(/^### 1\. Rankbox[\s\S]*?(?=^### 2\. )/m)?.[0] ?? "";
    // Sentences, and table rows one at a time (rows carry no end punctuation).
    const naming = prose(body)
      .split(/(?<=[.!?])\s+|\n+/)
      .filter((s) => /\bRankbox\b/.test(s));
    const claims = [entry, ...naming].join("\n");
    for (const pattern of RANKBOX_OVERCLAIMS) {
      expect(claims, String(pattern)).not.toMatch(pattern);
    }
    if (!SHIPPED.citationTracking) expect(body).not.toMatch(/\/features\/citation-tracking/);
    expect(body).toContain(formatUsd(PLAN.monthly));
    expect(body).toContain(`${PLAN.articlesPerMonth} articles`);
    if (!HAS_LIVE_PLUGIN) expect(body).toMatch(/publishing API/);
  });

  it("links the matching Rankbox vs competitor page, and only to pages that exist", () => {
    expect(body).toContain(`](/alternatives/${competitor.slug})`);
    const internal = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1].split("#")[0]);
    for (const href of internal) {
      // A hub ("/alternatives", "/tools") or a detail page with a real card.
      const hub = /^\/[a-z-]+$/.test(href) && sectionOf(href) !== undefined;
      expect(hub || cardFor(href) !== undefined, href).toBe(true);
    }
  });

  it("draws its price chart from real data, naming only tools on the page", () => {
    const placed = [...body.matchAll(/\(figure:price-chart\/([a-z0-9-]+)/g)].map((m) => m[1]);
    expect(placed).toEqual([slug]);
    const chart = PRICE_CHARTS[slug];
    expect(chart, "add the chart to src/data/blog-figures.ts").toBeDefined();
    expect(chart.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(chart.bars.some((b) => b.rankbox)).toBe(true);
    for (const bar of chart.bars) expect(body, bar.name).toContain(bar.name);
  });

  it("answers five questions and lists its references", () => {
    const faq = section(body, /Frequently Asked Questions/);
    expect([...faq.matchAll(/^### .+\?$/gm)].length).toBe(5);
    const refs = section(body, /^## References$/);
    const links = [...refs.matchAll(/^\d+\. \[[^\]]+\]\((https:\/\/[^)]+)\)/gm)];
    expect(links.length).toBeGreaterThanOrEqual(8);
  });
});
