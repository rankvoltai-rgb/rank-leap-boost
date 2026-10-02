/**
 * The switchboard's logic, kept pure so the tests can drive it with three
 * pages or sixty: grouping, which controls have earned a place, search, and
 * the small formatters the panel needs. No copy lives here.
 */
import type { Solution } from "@/data/solutions";

/** The groups a /solutions/<slug> page can sit in (a hub never lists itself). */
export type HubGroup = Exclude<Solution["group"], "hub">;

/** Display order: how most visitors describe a problem first. */
export const GROUP_ORDER: HubGroup[] = ["job", "platform", "industry", "alternative", "tracker"];

/** Filter chips appear once there are this many pages and two or more groups. */
export const FILTER_FROM = 8;

/** The search field appears once there are this many pages. */
export const SEARCH_FROM = 12;

export interface Line {
  slug: string;
  path: string;
  /** The name with its first letter raised, as a row title. */
  title: string;
  tagline: string;
  group: HubGroup;
}

export interface Group {
  id: HubGroup;
  lines: Line[];
}

/** "AI search visibility" stays; "autonomous GEO" → "Autonomous GEO". */
export function capitalise(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function toLine(s: Solution): Line | null {
  if (s.group === "hub") return null;
  return {
    slug: s.slug,
    path: `/solutions/${s.slug}`,
    title: capitalise(s.name),
    tagline: s.tagline,
    group: s.group,
  };
}

/**
 * Pages grouped in GROUP_ORDER, keeping each group's pages in the order the
 * index lists them. Groups with no pages are left out entirely, so the panel
 * never draws an empty box.
 */
export function buildGroups(solutions: readonly Solution[]): Group[] {
  const lines = solutions.map(toLine).filter((l): l is Line => l !== null);
  return GROUP_ORDER.map((id) => ({ id, lines: lines.filter((l) => l.group === id) })).filter(
    (g) => g.lines.length > 0,
  );
}

export function countLines(groups: readonly Group[]): number {
  return groups.reduce((n, g) => n + g.lines.length, 0);
}

/** Which controls have earned their place at this size. */
export function controlsFor(groups: readonly Group[]): { filter: boolean; search: boolean } {
  const total = countLines(groups);
  return {
    filter: groups.length >= 2 && total >= FILTER_FROM,
    search: total >= SEARCH_FROM,
  };
}

const fold = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Every word of the query must appear somewhere in the page's name, tagline,
 * slug or group words. "shop seo" finds "Shopify AI SEO"; an empty query
 * matches everything.
 */
export function matches(line: Line, query: string, groupWords = ""): boolean {
  const words = fold(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const hay = fold(`${line.title} ${line.tagline} ${line.slug} ${groupWords}`);
  return words.every((w) => hay.includes(w));
}

/**
 * The groups left after a group filter and a search, with empty groups
 * dropped. `groupWords` lets a search for "industry" find every industry page.
 */
export function filterGroups(
  groups: readonly Group[],
  { group, query }: { group: HubGroup | "all"; query: string },
  groupWords: Partial<Record<HubGroup, string>> = {},
): Group[] {
  return groups
    .filter((g) => group === "all" || g.id === group)
    .map((g) => ({ ...g, lines: g.lines.filter((l) => matches(l, query, groupWords[g.id])) }))
    .filter((g) => g.lines.length > 0);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "2026-09-28" → "Sep 28, 2026". Parsed by hand, not through Date, so the
 * server and the browser can never disagree about the day (no time zones).
 */
export function formatDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${month} ${Number(m[3])}, ${m[1]}` : iso;
}

/** "1 page", "3 pages". */
export function pagesLabel(n: number): string {
  return `${n} ${n === 1 ? "page" : "pages"}`;
}
