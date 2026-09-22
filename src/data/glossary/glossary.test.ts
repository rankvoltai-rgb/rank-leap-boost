/**
 * The glossary's editorial rules, enforced. Each check is one of the rules in
 * ./types — a definition that runs to two sentences, a section that doesn't
 * answer its own question, or a link to a page that doesn't exist fails here
 * rather than in production.
 */
import { describe, expect, it } from "vitest";
import { FEATURES } from "@/data/features";
import { TOOLS } from "@/data/tools";
import { ENGINES } from "@/data/ai-seo/engines";
import { guideBlockText } from "@/data/ai-seo/guides";
import { plainText } from "@/lib/inline-md";
import { ENTRY_SLUGS, loadEntry } from "./entries";
import { CATEGORIES, TERMS } from "./terms";
import type { GlossaryEntry } from "./types";

const BLOG_POSTS = ["how-to-get-cited-by-chatgpt", "how-to-show-up-in-google-ai-overviews"];

const words = (md: string) => plainText(md).match(/\S+/g)?.length ?? 0;

/* A sentence ends at . ! or ? followed by a space and a capital — close
   enough for prose that avoids abbreviations like "e.g." (the style rule). */
const sentences = (md: string) =>
  plainText(md)
    .split(/(?<=[.!?])\s+(?=[A-Z"“])/)
    .filter(Boolean).length;

function internalHrefs(md: string): string[] {
  return [...md.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
}

const slugs = new Set(TERMS.map((t) => t.slug));

/* GLOSSARY_ONLY=slug,slug checks just those entries — for writing one at a time. */
const ONLY = process.env.GLOSSARY_ONLY?.split(",").filter(Boolean);
const CHECKED = ONLY ? TERMS.filter((t) => ONLY.includes(t.slug)) : TERMS;

function isKnownPath(href: string): boolean {
  const path = href.split("#")[0];
  const [, section, slug, extra] = path.split("/");
  if (extra !== undefined) return false;
  switch (section) {
    case "glossary":
      return slug === undefined || slugs.has(slug);
    case "features":
      return slug === undefined || FEATURES.some((f) => f.slug === slug);
    case "tools":
      return slug === undefined || TOOLS.some((t) => t.slug === slug);
    case "ai-seo":
      return slug === undefined || ENGINES.some((e) => e.slug === slug);
    case "blog":
      return slug === undefined || BLOG_POSTS.includes(slug);
    case "pricing":
    case "use-cases":
    case "alternatives":
      return true;
    default:
      return false;
  }
}

function allMd(e: GlossaryEntry): string[] {
  return [
    e.whyItMatters,
    ...e.questions.flatMap((q) => [q.answer, ...q.blocks.flatMap(guideBlockText)]),
    e.original.summary,
    e.original.outcome ?? "",
    ...e.original.items.map((i) => i.body),
    e.product.pitch,
  ];
}

describe("glossary index", () => {
  it("has unique, url-safe slugs", () => {
    expect(new Set(TERMS.map((t) => t.slug)).size).toBe(TERMS.length);
    for (const t of TERMS) expect(t.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("files every term under a real category, and every category has terms", () => {
    const ids = CATEGORIES.map((c) => c.id);
    for (const t of TERMS) expect(ids).toContain(t.category);
    for (const id of ids) expect(TERMS.some((t) => t.category === id)).toBe(true);
  });

  it.each(TERMS.map((t) => [t.slug, t.definition]))(
    "%s: definition is one sentence of 15–55 words",
    (_slug, definition) => {
      expect(sentences(definition)).toBe(1);
      expect(words(definition)).toBeGreaterThanOrEqual(15);
      expect(words(definition)).toBeLessThanOrEqual(55);
      expect(definition.trim()).toMatch(/\.$/);
    },
  );

  it.skipIf(Boolean(ONLY))("has an entry for every term, and no entry without a term", () => {
    expect([...ENTRY_SLUGS].sort()).toEqual(TERMS.map((t) => t.slug).sort());
  });
});

describe.each(CHECKED.map((t) => [t.slug]))("glossary entry: %s", (slug) => {
  const load = () => loadEntry(slug);

  it("matches its file name and has usable meta", async () => {
    const e = await load();
    expect(e.slug).toBe(slug);
    expect(e.metaTitle.length).toBeLessThanOrEqual(70);
    expect(e.metaDescription.length).toBeGreaterThanOrEqual(110);
    expect(e.metaDescription.length).toBeLessThanOrEqual(165);
    expect(e.keywords.length).toBeGreaterThanOrEqual(3);
  });

  it("says why it matters in two or three sentences", async () => {
    const e = await load();
    expect(sentences(e.whyItMatters)).toBeGreaterThanOrEqual(2);
    expect(sentences(e.whyItMatters)).toBeLessThanOrEqual(3);
  });

  it("asks three to five real questions, each answered up front", async () => {
    const e = await load();
    expect(e.questions.length).toBeGreaterThanOrEqual(3);
    expect(e.questions.length).toBeLessThanOrEqual(5);
    expect(new Set(e.questions.map((q) => q.id)).size).toBe(e.questions.length);
    for (const q of e.questions) {
      expect(q.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(q.question).toMatch(/\?$|^Common mistakes/);
      expect(words(q.answer)).toBeLessThanOrEqual(60);
      expect(sentences(q.answer)).toBeLessThanOrEqual(2);
      expect(q.blocks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("has an original element with at least three parts", async () => {
    const e = await load();
    expect(e.original.name.length).toBeGreaterThan(0);
    expect(e.original.items.length).toBeGreaterThanOrEqual(3);
  });

  it("links to real related terms and a real product page", async () => {
    const e = await load();
    expect(e.related.length).toBeGreaterThanOrEqual(3);
    expect(e.related.length).toBeLessThanOrEqual(6);
    for (const r of e.related) {
      expect(r).not.toBe(slug);
      expect(slugs.has(r), `unknown related term "${r}"`).toBe(true);
    }
    expect(FEATURES.some((f) => f.slug === e.product.feature)).toBe(true);
    if (e.tool) expect(TOOLS.some((t) => t.slug === e.tool)).toBe(true);
    for (const f of e.further ?? []) expect(isKnownPath(f.href), f.href).toBe(true);
  });

  it("only links internally to pages that exist", async () => {
    const e = await load();
    for (const href of allMd(e).flatMap(internalHrefs)) {
      expect(isKnownPath(href), `broken internal link ${href}`).toBe(true);
    }
  });

  it("cites at least two sources", async () => {
    const e = await load();
    expect(e.sources.length).toBeGreaterThanOrEqual(2);
    for (const s of e.sources) expect(s.href).toMatch(/^https:\/\//);
  });

  it("never claims first-party data Rankbox doesn't have", async () => {
    const e = await load();
    const text = allMd(e).map(plainText).join(" ");
    expect(text).not.toMatch(
      /\b(our (data|study|analysis|research|customers|dataset)|we (analy[sz]ed|studied|measured|surveyed|tracked))\b/i,
    );
  });
});
