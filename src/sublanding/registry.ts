/**
 * Every sublanding page that is built, in one light index. The hub, footer,
 * sitemap and link graph read it (via src/data/solutions for /solutions
 * pages), so it holds names and lines only, never a page's copy.
 *
 * Only the main session edits this file, after a page's agent has finished
 * and the page has been reviewed. sublanding.test.ts checks that every entry
 * has its directory, brief, content and route, and that every page directory
 * on disk is listed here.
 */

export type SublandingGroup =
  /** A job the buyer names: an audit, a category, a way of working. */
  | "job"
  /** A platform or engine the buyer already uses. */
  | "platform"
  /** An industry. */
  | "industry"
  /** Rankbox vs a named competitor. */
  | "alternative"
  /** Rank, citation or brand tracking (only once tracking ships). */
  | "tracker"
  /** A section hub. */
  | "hub";

export interface SublandingPage {
  /** The route, e.g. "/solutions/autonomous-geo". */
  path: string;
  /** The page's directory under src/sublanding, e.g. "solutions/autonomous-geo". */
  dir: string;
  /** Short display name for cards and the footer, e.g. "Autonomous GEO". */
  name: string;
  /** One line under a link card. */
  tagline: string;
  /** The primary query. The title and H1 must contain it. Empty for a hub. */
  query: string;
  group: SublandingGroup;
  /** When the page's facts were last checked. */
  updated: string;
}

export const SUBLANDING: SublandingPage[] = [
  {
    path: "/solutions",
    dir: "solutions/_index",
    name: "Solutions",
    tagline: "Every live solutions page in one list, grouped by job, platform and industry.",
    query: "solutions",
    group: "hub",
    updated: "2026-10-02",
  },
  {
    path: "/solutions/autonomous-geo",
    dir: "solutions/autonomous-geo",
    name: "Autonomous GEO",
    tagline:
      "The AI search optimization tool that does the homework: questions found, answers written and delivered.",
    query: "ai search optimization tools",
    group: "job",
    updated: "2026-10-02",
  },
  {
    path: "/white-label",
    dir: "white-label/_index",
    name: "White-label",
    tagline:
      "Deliver research, articles and publishing to every client under their own name, from one Studio account.",
    query: "white label seo platform",
    group: "hub",
    updated: "2026-10-29",
  },
  {
    path: "/white-label/content-writing",
    dir: "white-label/content-writing",
    name: "White-label content writing",
    tagline:
      "A writing line for every client site: researched, scored articles in each client's voice, published under the client's name.",
    query: "white label content writing",
    group: "job",
    updated: "2026-10-29",
  },
  {
    path: "/white-label/ai-seo",
    dir: "white-label/ai-seo",
    name: "White-label AI SEO",
    tagline:
      "AI search as a service line: a scope to send, a live prospect check, and honest reporting without a tracker.",
    query: "white label ai seo",
    group: "job",
    updated: "2026-10-29",
  },
  {
    path: "/white-label/pricing",
    dir: "white-label/pricing",
    name: "White-label pricing",
    tagline:
      "A fixed cost per client site, a margin calculator, and how Studio billing moves as clients change.",
    query: "white label seo pricing",
    group: "job",
    updated: "2026-10-29",
  },
];

/** The /white-label section: the hub first, then its deep dives. */
export const SUBLANDING_WHITE_LABEL = SUBLANDING.filter((p) => p.path.startsWith("/white-label"));

/** The /solutions/<slug> pages, for src/data/solutions. */
export const SUBLANDING_SOLUTIONS = SUBLANDING.filter((p) => /^\/solutions\/[^/]+$/.test(p.path));

export function getSublanding(path: string): SublandingPage | undefined {
  return SUBLANDING.find((p) => p.path === path);
}
