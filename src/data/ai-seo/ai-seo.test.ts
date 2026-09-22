/**
 * The engine guides' structural rules, enforced. The matrix on /ai-seo, the
 * spec band, the hero preview and the schema.org graph all assume every guide
 * fills the same shape the same way — a hole or a dead link fails here rather
 * than as a blank cell in production.
 */
import { describe, expect, it } from "vitest";
import { AI_MARKS, ENGINE_MARKS } from "@/components/landing/ai-logos";
import { FEATURES } from "@/data/features";
import { TOOLS } from "@/data/tools";
import { TERMS } from "@/data/glossary/terms";
import { plainText } from "@/lib/inline-md";
import { ENGINES, enginesInTier } from "./engines";
import { guideBlockText, loadGuide } from "./guides";
import type { EngineGuide } from "./types";

const BLOG_POSTS = ["how-to-get-cited-by-chatgpt", "how-to-show-up-in-google-ai-overviews"];
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function isKnownPath(href: string): boolean {
  const path = href.split("#")[0];
  const [, section, slug, extra] = path.split("/");
  if (extra !== undefined) return false;
  switch (section) {
    case "glossary":
      return slug === undefined || TERMS.some((t) => t.slug === slug);
    case "features":
      return slug === undefined || FEATURES.some((f) => f.slug === slug);
    case "tools":
      return slug === undefined || TOOLS.some((t) => t.slug === slug);
    case "ai-seo":
      return slug === undefined || ENGINES.some((e) => e.slug === slug);
    case "blog":
      return slug === undefined || BLOG_POSTS.includes(slug);
    case "pricing":
      return slug === undefined;
    default:
      return false;
  }
}

/** Every inline-markup string a guide renders. */
function allMd(g: EngineGuide): string[] {
  return [
    g.shortAnswer,
    ...g.takeaways,
    ...g.sections.flatMap((s) => s.blocks.flatMap(guideBlockText)),
    ...g.checklist.map((c) => c.detail),
    ...g.faqs.map((f) => f.a),
  ];
}

const links = (md: string) => [...md.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);

describe("engine registry", () => {
  it("has unique, url-safe slugs", () => {
    expect(new Set(ENGINES.map((e) => e.slug)).size).toBe(ENGINES.length);
    for (const e of ENGINES) expect(e.slug).toMatch(KEBAB);
  });

  /* The landing hero's "Cited across" badge is AI_MARKS. It stays at five,
     and a click on each lands on its guide — so the frontier tier must be
     exactly those five, in the same order. */
  it("keeps the frontier tier identical to the hero's five logos", () => {
    expect(enginesInTier("frontier").map((e) => e.mark)).toEqual(AI_MARKS.map((m) => m.name));
  });

  it("has a mark for every engine", () => {
    for (const e of ENGINES) expect(ENGINE_MARKS[e.mark], e.mark).toBeTypeOf("function");
  });

  it("dates every guide, never updated before published", () => {
    for (const e of ENGINES) {
      expect(e.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.updated >= e.published, e.slug).toBe(true);
    }
  });
});

describe.each(ENGINES.map((e) => [e.slug]))("engine guide: %s", (slug) => {
  const load = () => loadGuide(slug);

  it("matches its registry slug and has usable meta", async () => {
    const g = await load();
    expect(g.slug).toBe(slug);
    expect(g.metaTitle.length).toBeLessThanOrEqual(75);
    expect(g.metaDescription.length).toBeGreaterThanOrEqual(110);
    expect(g.metaDescription.length).toBeLessThanOrEqual(190);
    expect(g.keywords.length).toBeGreaterThanOrEqual(3);
  });

  it("fills the hero, the spec band and the matrix", async () => {
    const g = await load();
    expect(g.facts).toHaveLength(4);
    expect(g.takeaways.length).toBeGreaterThanOrEqual(4);
    expect(g.preview.sources.length).toBeGreaterThanOrEqual(3);
    expect(g.preview.answer).toMatch(/\*\*[^*]+\*\*/);
    for (const [key, value] of Object.entries(g.profile)) {
      expect(value.trim().length, key).toBeGreaterThan(0);
      expect(value.length, `${key} is too long for a matrix cell`).toBeLessThanOrEqual(110);
    }
  });

  it("has unique anchors for its sections and checklist", async () => {
    const g = await load();
    const ids = g.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(KEBAB);
    for (const reserved of ["takeaways", "checklist", "faq", "sources", "top"]) {
      expect(ids).not.toContain(reserved);
    }
    const items = g.checklist.map((c) => c.id);
    expect(new Set(items).size).toBe(items.length);
    expect(g.checklist.length).toBeGreaterThanOrEqual(8);
    expect(g.faqs.length).toBeGreaterThanOrEqual(5);
  });

  it("cites real, distinct sources", async () => {
    const g = await load();
    expect(g.sources.length).toBeGreaterThanOrEqual(8);
    const hrefs = g.sources.map((s) => s.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const h of hrefs) expect(h).toMatch(/^https:\/\//);
    const stats = g.sections.flatMap((s) =>
      s.blocks.flatMap((b) => (b.kind === "stats" ? b.items : [])),
    );
    for (const st of stats) expect(st.source.href, st.value).toMatch(/^https:\/\//);
  });

  it("only links internally to pages that exist", async () => {
    const g = await load();
    const internal = [...allMd(g).flatMap(links), ...g.furtherReading.map((r) => r.href)].filter(
      (h) => h.startsWith("/"),
    );
    for (const href of internal) expect(isKnownPath(href), `broken link ${href}`).toBe(true);
    for (const href of allMd(g)
      .flatMap(links)
      .filter((h) => !h.startsWith("/"))) {
      expect(href, "external links must be https").toMatch(/^https:\/\//);
    }
  });

  it("never claims first-party data Rankbox doesn't have", async () => {
    const g = await load();
    const text = allMd(g).map(plainText).join(" ");
    expect(text).not.toMatch(
      /\b(our (data|study|analysis|research|customers|dataset)|we (analy[sz]ed|studied|measured|surveyed|tracked))\b/i,
    );
  });
});
