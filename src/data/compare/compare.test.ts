/**
 * The head-to-head editorial rules, enforced. Each check is one of the rules
 * in ./types: a round that doesn't name its winner, a picker that can only
 * ever recommend one side, a card tally that disagrees with its page, or a
 * third-option pitch that claims something Rankbox doesn't ship fails here
 * rather than in production.
 *
 * COMPARE_ONLY=slug,slug checks just those pages — for writing one at a time.
 */
import { describe, expect, it } from "vitest";
import { FEATURES } from "@/data/features";
import { TOOLS } from "@/data/tools";
import { ENGINES } from "@/data/ai-seo/engines";
import { TERMS } from "@/data/glossary/terms";
import { plainText } from "@/lib/inline-md";
import { ENTRY_SLUGS, loadEntry, tallyOf } from "./entries";
import { allAnswerSets, scoreFinder } from "./finder";
import { CATEGORIES, MATCHUPS, canonicalSlug, type Matchup } from "./matchups";
import { PRODUCTS } from "./products";
import type { MatchupEntry } from "./types";

const ONLY = process.env.COMPARE_ONLY?.split(",").filter(Boolean);
const CHECKED = ONLY ? MATCHUPS.filter((m) => ONLY.includes(m.slug)) : MATCHUPS;

const words = (md: string) => plainText(md).match(/\S+/g)?.length ?? 0;
const sentences = (md: string) =>
  plainText(md)
    .split(/(?<=[.!?])\s+(?=[A-Z"“])/)
    .filter(Boolean).length;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/* Rule 4: no first-party testing we didn't do. Rule 2: no "it can't". */
const BANNED = [
  /\bwe tested\b/i,
  /\bin our (own )?test(s|ing)?\b/i,
  /\bour (own )?(data|benchmark|study|research)\b/i,
  /\bhands-on\b/i,
  /\bwe found\b/i,
  /\bcan(?:'|’)t\b/i,
  /\bcannot\b/i,
  /\black(s|ing)?\b/i,
  /\bis missing\b/i,
];

/* Rule 5: things Rankbox does not do today, so the third option can't say them. */
const NOT_SHIPPED = [
  /citation tracking/i,
  /tracks? (your )?citations/i,
  /one-click/i,
  /\bplugin/i,
  /unlimited (seats|team)/i,
  /backlink/i,
  /keyword database/i,
  /search volume/i,
  /reddit/i,
];

function isKnownPath(href: string): boolean {
  const [path] = href.split("#");
  const [, section, slug, extra] = path.split("/");
  if (extra !== undefined) return false;
  switch (section) {
    case "compare":
      return slug === undefined || MATCHUPS.some((m) => m.slug === slug);
    case "glossary":
      return slug === undefined || TERMS.some((t) => t.slug === slug);
    case "features":
      return slug === undefined || FEATURES.some((f) => f.slug === slug);
    case "tools":
      return slug === undefined || TOOLS.some((t) => t.slug === slug);
    case "ai-seo":
      return slug === undefined || ENGINES.some((e) => e.slug === slug);
    case "pricing":
    case "alternatives":
      return true;
    default:
      return false;
  }
}

function allMd(e: MatchupEntry): string[] {
  return [
    e.subhead,
    e.shortAnswer,
    ...e.picks.a,
    ...e.picks.b,
    ...e.tape.flatMap((t) => [t.label, t.a, t.b]),
    ...e.rounds.flatMap((r) => [r.verdict, r.a, r.b]),
    ...e.matrix.flatMap((g) => g.rows.flatMap((r) => [r.label, r.a.note, r.b.note])),
    e.pricing.note,
    ...e.finder.flatMap((q) => [q.question, ...q.options.flatMap((o) => [o.label, o.because])]),
    e.thirdOption.title,
    e.thirdOption.body,
    ...e.faqs.flatMap((f) => [f.q, f.a]),
  ];
}

describe("head-to-head index", () => {
  it("names every slug `${a}-vs-${b}`, uniquely, from real products", () => {
    expect(new Set(MATCHUPS.map((m) => m.slug)).size).toBe(MATCHUPS.length);
    for (const m of MATCHUPS) {
      expect(m.slug).toBe(`${m.a}-vs-${m.b}`);
      expect(m.a).not.toBe(m.b);
      expect(PRODUCTS[m.a]).toBeDefined();
      expect(PRODUCTS[m.b]).toBeDefined();
    }
  });

  it("never lists the same pair twice in either order", () => {
    const pairs = MATCHUPS.map((m) => [m.a, m.b].sort().join("|"));
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it("redirects the reversed slug to the canonical one", () => {
    for (const m of MATCHUPS) expect(canonicalSlug(`${m.b}-vs-${m.a}`)).toBe(m.slug);
    expect(canonicalSlug("nothing-vs-nobody")).toBeUndefined();
  });

  it("files every matchup under a real category, with dates in order", () => {
    const ids = CATEGORIES.map((c) => c.id);
    for (const m of MATCHUPS) {
      expect(ids).toContain(m.category);
      expect(m.published).toMatch(ISO);
      expect(m.updated).toMatch(ISO);
      expect(m.updated >= m.published).toBe(true);
    }
  });

  it("has a written page for every matchup, and no orphan pages", () => {
    expect([...ENTRY_SLUGS].sort()).toEqual(MATCHUPS.map((m) => m.slug).sort());
  });

  it("keeps each card's best-for line short enough for the card", () => {
    for (const m of MATCHUPS) {
      for (const line of [m.bestFor.a, m.bestFor.b]) expect(line.length).toBeLessThanOrEqual(72);
    }
  });
});

describe.each(CHECKED.map((m) => [m.slug, m] as [string, Matchup]))("%s", (_slug, m) => {
  const a = PRODUCTS[m.a].name;
  const b = PRODUCTS[m.b].name;
  let e: MatchupEntry;

  it("loads, under its own slug", async () => {
    e = await loadEntry(m.slug);
    expect(e.slug).toBe(m.slug);
  });

  it("has search-sized meta that names both products", () => {
    for (const name of [a, b]) {
      expect(e.metaTitle).toContain(name);
      expect(e.metaDescription).toContain(name);
    }
    expect(e.metaTitle.length).toBeLessThanOrEqual(70);
    expect(e.metaDescription.length).toBeGreaterThanOrEqual(110);
    expect(e.metaDescription.length).toBeLessThanOrEqual(165);
    expect(e.keywords.length).toBeGreaterThanOrEqual(4);
  });

  it("opens with a quotable short answer that names both", () => {
    const text = plainText(e.shortAnswer);
    expect(text).toContain(a);
    expect(text).toContain(b);
    expect(words(e.shortAnswer)).toBeLessThanOrEqual(110);
    expect(sentences(e.subhead)).toBeLessThanOrEqual(2);
  });

  it("gives three picks per side and a six-to-eight row tale of the tape", () => {
    expect(e.picks.a).toHaveLength(3);
    expect(e.picks.b).toHaveLength(3);
    expect(e.tape.length).toBeGreaterThanOrEqual(6);
    expect(e.tape.length).toBeLessThanOrEqual(8);
    for (const t of e.tape) {
      expect(t.a.length, t.label).toBeLessThanOrEqual(48);
      expect(t.b.length, t.label).toBeLessThanOrEqual(48);
    }
  });

  it("runs five to seven rounds, each calling its winner first", () => {
    expect(e.rounds.length).toBeGreaterThanOrEqual(5);
    expect(e.rounds.length).toBeLessThanOrEqual(7);
    expect(new Set(e.rounds.map((r) => r.id)).size).toBe(e.rounds.length);
    for (const r of e.rounds) {
      expect(r.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(sentences(r.verdict), r.title).toBeLessThanOrEqual(2);
      expect(words(r.verdict), r.title).toBeLessThanOrEqual(45);
      // The verdict's first words say who won, so a lifted sentence still answers.
      const opening = plainText(r.verdict).split(/\s+/).slice(0, 6).join(" ");
      if (r.winner === "draw") expect(opening, r.title).toMatch(/draw|even|tie|level/i);
      // "Koala" and "Surfer" are how people write them; either form counts.
      else expect(opening, r.title).toContain(PRODUCTS[m[r.winner]].name.split(" ")[0]);
      expect(words(r.a)).toBeGreaterThan(8);
      expect(words(r.b)).toBeGreaterThan(8);
    }
  });

  it("keeps a split decision a split: nobody sweeps every round", () => {
    const t = tallyOf(e.rounds);
    expect(t.a).toBeLessThan(e.rounds.length);
    expect(t.b).toBeLessThan(e.rounds.length);
  });

  it("matches the tally on its hub card", () => {
    expect(tallyOf(e.rounds)).toEqual(m.tally);
  });

  it("runs a full matrix", () => {
    const rows = e.matrix.flatMap((g) => g.rows);
    expect(rows.length).toBeGreaterThanOrEqual(10);
    expect(new Set(rows.map((r) => r.label)).size).toBe(rows.length);
  });

  it("dates its prices and links both pricing pages", () => {
    expect(e.pricing.checkedOn).toMatch(ISO);
    expect(e.pricing.checkedOn <= m.updated).toBe(true);
    for (const p of [e.pricing.a, e.pricing.b]) {
      expect(p.plans.length).toBeGreaterThanOrEqual(1);
      expect(p.url).toMatch(/^https:\/\//);
      for (const pl of p.plans) {
        if (pl.annual !== undefined) expect(pl.monthly).not.toBeNull();
      }
    }
  });

  it("has a picker that can land on either side", () => {
    expect(e.finder).toHaveLength(3);
    for (const q of e.finder) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.length).toBeLessThanOrEqual(3);
      for (const o of q.options) {
        expect(
          Object.values(o.points).some((p) => (p ?? 0) > 0),
          o.label,
        ).toBe(true);
      }
    }
    const picks = new Set(allAnswerSets(e.finder).map((s) => scoreFinder(e.finder, s).pick));
    expect(picks.has("a")).toBe(true);
    expect(picks.has("b")).toBe(true);
  });

  it("pitches the third option within what Rankbox ships", () => {
    for (const text of [e.thirdOption.title, e.thirdOption.body]) {
      for (const re of NOT_SHIPPED) expect(plainText(text), String(re)).not.toMatch(re);
    }
  });

  it("answers five to eight FAQs, each in the first sentence", () => {
    expect(e.faqs.length).toBeGreaterThanOrEqual(5);
    expect(e.faqs.length).toBeLessThanOrEqual(8);
    for (const f of e.faqs) {
      expect(f.q.trim().endsWith("?"), f.q).toBe(true);
      expect(words(f.a), f.q).toBeLessThanOrEqual(90);
    }
  });

  it("cites at least eight distinct https sources", () => {
    expect(e.sources.length).toBeGreaterThanOrEqual(8);
    expect(new Set(e.sources.map((s) => s.href)).size).toBe(e.sources.length);
    for (const s of e.sources) expect(s.href).toMatch(/^https:\/\//);
  });

  it("claims no testing it didn't do, and never says a product can't", () => {
    for (const text of allMd(e)) {
      for (const re of BANNED) expect(plainText(text), String(re)).not.toMatch(re);
    }
  });

  it("links only to pages that exist", () => {
    for (const text of allMd(e)) {
      for (const [, href] of text.matchAll(/\]\((\/[^)\s]*)\)/g)) {
        expect(isKnownPath(href), href).toBe(true);
      }
    }
  });
});
