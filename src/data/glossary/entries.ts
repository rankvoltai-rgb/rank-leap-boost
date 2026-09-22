/**
 * The long-form glossary entries. Only /glossary/$term imports this; the hub
 * and the sitemap read the light ./terms index. Each entry is its own chunk,
 * so a visitor reading one term never downloads the other sixty-odd.
 */
import { countWords } from "@/lib/inline-md";
import { guideBlockText } from "@/data/ai-seo/guides";
import type { GlossaryEntry } from "./types";
import type { GlossaryTerm } from "./terms";

const MODULES = import.meta.glob<GlossaryEntry>("./content/*.ts", { import: "entry" });

function pathOf(slug: string): string {
  return `./content/${slug}.ts`;
}

export function hasEntry(slug: string): boolean {
  return pathOf(slug) in MODULES;
}

export function loadEntry(slug: string): Promise<GlossaryEntry> {
  const load = MODULES[pathOf(slug)];
  if (!load) throw new Error(`No glossary entry for "${slug}"`);
  return load();
}

/** Slugs that have a written entry — the hub links only to these. */
export const ENTRY_SLUGS = Object.keys(MODULES).map((p) => p.replace(/^\.\/content\/|\.ts$/g, ""));

export function entryWordCount(term: GlossaryTerm, e: GlossaryEntry): number {
  return countWords([
    term.definition,
    e.whyItMatters,
    ...e.questions.flatMap((q) => [q.question, q.answer, ...q.blocks.flatMap(guideBlockText)]),
    e.original.name,
    e.original.summary,
    ...e.original.items.flatMap((i) => [i.label, i.body]),
    e.original.outcome ?? "",
  ]);
}

export function entryReadingMinutes(term: GlossaryTerm, e: GlossaryEntry): number {
  return Math.max(1, Math.round(entryWordCount(term, e) / 230));
}
