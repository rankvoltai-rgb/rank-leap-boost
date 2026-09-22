/**
 * The long-form head-to-head bodies. Only /compare/$slug imports this; the
 * hub, navbar and sitemap read the light ./matchups index. Each body is its
 * own chunk, so a visitor reading one comparison never downloads the rest.
 */
import type { MatchupEntry, Round, Winner } from "./types";

const MODULES = import.meta.glob<MatchupEntry>("./content/*.ts", { import: "entry" });

function pathOf(slug: string): string {
  return `./content/${slug}.ts`;
}

export function hasEntry(slug: string): boolean {
  return pathOf(slug) in MODULES;
}

export function loadEntry(slug: string): Promise<MatchupEntry> {
  const load = MODULES[pathOf(slug)];
  if (!load) throw new Error(`No head-to-head for "${slug}"`);
  return load();
}

export const ENTRY_SLUGS = Object.keys(MODULES).map((p) => p.replace(/^\.\/content\/|\.ts$/g, ""));

/** Rounds won by each side, and draws. The page and the index both show this. */
export function tallyOf(rounds: Round[]): Record<Winner, number> {
  const t: Record<Winner, number> = { a: 0, b: 0, draw: 0 };
  for (const r of rounds) t[r.winner] += 1;
  return t;
}
