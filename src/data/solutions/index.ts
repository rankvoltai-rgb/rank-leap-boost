/**
 * The /solutions pages: one per problem a buyer searches for by name ("AI
 * search visibility", "AEO tools"), each answered with what Rankbox does about
 * it. This index is the light half: the link graph, footer and sitemap read it,
 * so it carries names and lines only. Each page's copy is its own module.
 */

export interface Solution {
  slug: string;
  /** The head term, as the page's H1 and breadcrumb spell it. */
  name: string;
  /** The line under a link card. */
  tagline: string;
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "ai-search-visibility",
    name: "AI search visibility",
    tagline: "Get named in AI answers by building what engines cite, every day.",
  },
  {
    slug: "aeo-tools",
    name: "AEO tools",
    tagline: "Free answer engine optimization tools for every job, plus an autopilot.",
  },
];

export const SOLUTION_SLUGS = SOLUTIONS.map((s) => s.slug);

/** Bump when a page's facts are re-checked, not for copy edits. */
export const SOLUTIONS_UPDATED = "2026-09-28";

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
