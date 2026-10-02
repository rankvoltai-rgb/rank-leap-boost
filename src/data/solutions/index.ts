/**
 * The /solutions pages: one per problem a buyer searches for by name ("AI
 * search visibility", "AEO tools"), each answered with what Rankbox does about
 * it. This index is the light half: the link graph, footer and sitemap read it,
 * so it carries names and lines only. Each page's copy is its own module.
 */

import { SUBLANDING_SOLUTIONS, type SublandingGroup } from "@/sublanding/registry";

export interface Solution {
  slug: string;
  /** The head term, as the page's H1 and breadcrumb spell it. */
  name: string;
  /** The line under a link card. */
  tagline: string;
  /** How the /solutions hub groups it. */
  group: SublandingGroup;
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "ai-search-visibility",
    name: "AI search visibility",
    tagline: "Get named in AI answers by building what engines cite, every day.",
    group: "job",
  },
  {
    slug: "aeo-tools",
    name: "AEO tools",
    tagline: "Free answer engine optimization tools for every job, plus an autopilot.",
    group: "job",
  },
  // Each built in its own directory under src/sublanding (see its README).
  ...SUBLANDING_SOLUTIONS.map((p) => ({
    slug: p.path.split("/")[2],
    name: p.name,
    tagline: p.tagline,
    group: p.group,
  })),
];

export const SOLUTION_SLUGS = SOLUTIONS.map((s) => s.slug);

/** Bump when a page's facts are re-checked, not for copy edits. */
export const SOLUTIONS_UPDATED = ["2026-09-28", ...SUBLANDING_SOLUTIONS.map((p) => p.updated)]
  .sort()
  .at(-1)!;

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
