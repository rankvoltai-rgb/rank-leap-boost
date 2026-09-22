/**
 * Competitor comparison pages — /alternatives/$slug.
 *
 * Each competitor is one sub-landing page, written in its own file under
 * src/data/competitors/. This module assembles them and holds the helpers the
 * pages share. The rules every entry follows, and Rankbox's side of every
 * comparison, live in src/data/competitors/shared.ts.
 */
import type { Competitor } from "./competitors/shared";
import { rankpill } from "./competitors/rankpill";
import { outrank } from "./competitors/outrank";
import { seobot } from "./competitors/seobot";
import { koala } from "./competitors/koala";
import { byword } from "./competitors/byword";
import { writesonic } from "./competitors/writesonic";
import { frase } from "./competitors/frase";
import { surfer } from "./competitors/surfer";
import { jasper } from "./competitors/jasper";

export * from "./competitors/shared";

/**
 * In the order a founder shortlists them: the autopilots that do the same job
 * first, then the tools that do part of it.
 */
export const COMPETITORS: Competitor[] = [
  rankpill,
  outrank,
  seobot,
  koala,
  byword,
  writesonic,
  frase,
  surfer,
  jasper,
];

/** The handful the navbar has room for; the hub page lists the rest. */
export const NAV_COMPETITORS: Competitor[] = [rankpill, outrank, seobot, surfer];

export function getCompetitor(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}

export const COMPETITOR_SLUGS = COMPETITORS.map((c) => c.slug);

/** The latest date any comparison was checked, for the hub's lastmod. */
export const ALTERNATIVES_UPDATED = COMPETITORS.map((c) => c.pricing.checkedOn)
  .sort()
  .at(-1)!;

/**
 * `checkedOn` is a calendar date, not an instant. `new Date("2026-09-20")`
 * parses as UTC midnight, which renders as the 19th anywhere west of
 * Greenwich — so the page would quietly claim it was checked a day before it
 * was. Build the date in local time instead.
 */
function localDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatCheckedOn(iso: string): string {
  return localDate(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "Sep 2026", for the hero card's small dated pill. */
export function formatCheckedOnShort(iso: string): string {
  return localDate(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/** The H1 as one plain string, for schema and anywhere the lockup can't run. */
export function competitorH1(c: Competitor): string {
  return `${c.headline.lead} ${c.headline.accent}`;
}

/** Cost per published article on the compared plan, where it is sold that way. */
export function costPerArticle(c: Competitor): number | null {
  if (!c.pricing.articles) return null;
  return Math.round((c.pricing.monthly / c.pricing.articles) * 100) / 100;
}

/** Their cheapest self-serve plan, for "starts at". */
export function startingPrice(c: Competitor): number {
  const prices = c.pricing.plans.map((p) => p.monthly).filter((n): n is number => n !== null);
  return prices.length ? Math.min(...prices) : c.pricing.monthly;
}
