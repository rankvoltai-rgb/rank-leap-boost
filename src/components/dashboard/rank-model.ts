import { addDays, differenceInCalendarDays } from "date-fns";
import type { Blog, BlogStatus, Keyword } from "@/lib/data";
import type { SeoAnalysis } from "@/lib/seo-analysis";
import { hasBody } from "@/components/dashboard/article-stages";
import { dateKey, parseDateKey, publishedOn, todayKey } from "@/components/dashboard/queue-plan";

/**
 * Everything the Rank page shows, derived from what the account really has:
 * the keywords that define its market, the articles that answer them, and the
 * analyzer's read of each article. Nothing here claims a ranking or citation
 * that wasn't measured — estimates are the article's own traffic projection,
 * and they're labelled as estimates wherever they appear.
 */

/* ── The market: every tracked keyword, and whether you answer it ── */

export type MarketStatus = "published" | "writing" | "scheduled" | "idea" | "gap";

export interface MarketRow {
  key: string;
  keyword: string;
  /** Monthly searches; null for an article keyword the account doesn't track. */
  searches: number | null;
  intent: string | null;
  trend: string | null;
  /** Projected monthly visits once answered. */
  traffic: number;
  status: MarketStatus;
  article: Blog | null;
  /** SEO score of the published answer. */
  score: number | null;
}

const STATUS_PRIORITY: Record<BlogStatus, number> = {
  finished: 0,
  generating: 1,
  scheduled: 2,
  opportunity: 3,
};

const STATUS_OF: Record<BlogStatus, MarketStatus> = {
  finished: "published",
  generating: "writing",
  scheduled: "scheduled",
  opportunity: "idea",
};

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildMarket(
  blogs: Blog[],
  keywords: Keyword[],
  analyses: Map<string, SeoAnalysis>,
): MarketRow[] {
  // The strongest article per keyword: published beats in-progress beats idea.
  const best = new Map<string, Blog>();
  for (const b of blogs) {
    if (!b.keyword?.trim()) continue;
    const k = norm(b.keyword);
    const current = best.get(k);
    if (!current || STATUS_PRIORITY[b.status] < STATUS_PRIORITY[current.status]) best.set(k, b);
  }

  const row = (
    key: string,
    keyword: string,
    kw: Keyword | null,
    article: Blog | null,
  ): MarketRow => ({
    key,
    keyword,
    searches: kw?.search_volume ?? null,
    intent: kw?.intent ?? null,
    trend: kw?.trend ?? null,
    traffic: article?.traffic_estimate || kw?.traffic_estimate || 0,
    status: article ? STATUS_OF[article.status] : "gap",
    article,
    score: article?.status === "finished" ? (analyses.get(article.id)?.score ?? null) : null,
  });

  const rows = new Map<string, MarketRow>();
  for (const kw of keywords) {
    const k = norm(kw.name);
    if (!rows.has(k)) rows.set(k, row(k, kw.name, kw, best.get(k) ?? null));
  }
  for (const [k, article] of best) {
    if (!rows.has(k)) rows.set(k, row(k, article.keyword ?? k, null, article));
  }

  return [...rows.values()].sort(
    (a, b) => (b.searches ?? -1) - (a.searches ?? -1) || b.traffic - a.traffic,
  );
}

/* ── Coverage: how much of the market has an answer ── */

export interface Coverage {
  /** Weighted by monthly searches when the account tracks volumes, else by topic count. */
  basis: "searches" | "topics";
  total: number;
  published: number;
  planned: number;
  open: number;
}

export function coverageOf(rows: MarketRow[]): Coverage {
  const weighted = rows.filter((r) => r.searches !== null);
  const basis = weighted.some((r) => (r.searches ?? 0) > 0) ? "searches" : "topics";
  const pool = basis === "searches" ? weighted : rows;
  const weight = (r: MarketRow) => (basis === "searches" ? (r.searches ?? 0) : 1);
  const sum = (pred: (r: MarketRow) => boolean) =>
    pool.filter(pred).reduce((s, r) => s + weight(r), 0);
  const total = sum(() => true);
  const published = sum((r) => r.status === "published");
  const planned = sum((r) => r.status === "writing" || r.status === "scheduled");
  return { basis, total, published, planned, open: total - published - planned };
}

/* ── What AI answer engines look for ── */

export interface Signal {
  id: string;
  label: string;
  why: string;
}

/** The analyzer checks that decide whether an answer engine can lift and cite a page. */
export const AI_SIGNALS: Signal[] = [
  {
    id: "kw-intro",
    label: "Answers up front",
    why: "The answer sits in the first 100 words — the part engines quote.",
  },
  {
    id: "faq",
    label: "FAQ section",
    why: "Question-shaped headings match how people prompt AI.",
  },
  {
    id: "h2",
    label: "Clear sections",
    why: "Headings let engines find and lift the exact passage.",
  },
  {
    id: "links",
    label: "Cites sources",
    why: "Linked sources make a page safer for an engine to cite.",
  },
  { id: "words", label: "Depth", why: "1,500+ words covers the follow-up questions too." },
  {
    id: "readability",
    label: "Easy to read",
    why: "Plain sentences survive being summarized intact.",
  },
];

export interface SignalCoverage extends Signal {
  passing: number;
  total: number;
}

export function signalCoverage(analyses: SeoAnalysis[]): SignalCoverage[] {
  return AI_SIGNALS.map((s) => ({
    ...s,
    total: analyses.length,
    passing: analyses.filter((a) => a.checks.find((c) => c.id === s.id)?.status === "pass").length,
  }));
}

/** The AI signals an article is missing, by label, most important first. */
export function missingSignals(analysis: SeoAnalysis | undefined): string[] {
  if (!analysis) return [];
  return AI_SIGNALS.filter(
    (s) => analysis.checks.find((c) => c.id === s.id)?.status !== "pass",
  ).map((s) => s.label);
}

/* ── Momentum: projected monthly visits over time ── */

export interface TrajectoryPoint {
  day: string;
  /** Projected monthly visits from everything live by this day. */
  value: number;
  /** Articles live by this day. */
  articles: number;
  future: boolean;
}

const MAX_PAST_DAYS = 120;
const MAX_FUTURE_DAYS = 90;

/**
 * One point per day: the sum of the traffic projections of every article live
 * by then. Published articles count from the day they went live; scheduled
 * ones from their planned day (overdue ones from tomorrow, the soonest they
 * can go out). Null until there's anything to plot.
 */
export function buildTrajectory(blogs: Blog[]): TrajectoryPoint[] | null {
  const today = todayKey();
  const tomorrow = dateKey(addDays(new Date(), 1));
  const events: { day: string; value: number }[] = [];
  for (const b of blogs) {
    const value = b.traffic_estimate ?? 0;
    if (b.status === "finished") events.push({ day: publishedOn(b), value });
    else if (b.status === "generating") events.push({ day: today, value });
    else if (b.status === "scheduled" && b.scheduled_date && !hasBody(b)) {
      const day = b.scheduled_date.slice(0, 10);
      events.push({ day: day < tomorrow ? tomorrow : day, value });
    }
  }
  if (events.length === 0) return null;
  events.sort((a, b) => a.day.localeCompare(b.day));

  const todayDate = parseDateKey(today);
  const first = parseDateKey(events[0].day);
  const last = parseDateKey(events[events.length - 1].day);
  const start = addDays(
    first < addDays(todayDate, -MAX_PAST_DAYS) ? addDays(todayDate, -MAX_PAST_DAYS) : first,
    -1,
  );
  const endCap = addDays(todayDate, MAX_FUTURE_DAYS);
  const end = last > endCap ? endCap : last > todayDate ? last : todayDate;

  const points: TrajectoryPoint[] = [];
  let i = 0;
  let value = 0;
  let articles = 0;
  const span = differenceInCalendarDays(end, start);
  for (let d = 0; d <= span; d++) {
    const day = dateKey(addDays(start, d));
    while (i < events.length && events[i].day <= day) {
      value += events[i].value;
      articles += 1;
      i += 1;
    }
    points.push({ day, value, articles, future: day > today });
  }
  return points;
}

/* ── Next best moves ── */

export type MoveKind = "cover" | "schedule" | "strengthen" | "accelerate";

export interface Move {
  id: string;
  kind: MoveKind;
  title: string;
  reason: string;
  /** Projected monthly visits the move adds — or, for "strengthen", has riding on it. */
  impact: number;
  row?: MarketRow;
  blog?: Blog;
}

const RISING_BONUS = 1.25;

/**
 * The few moves that would grow rank the most right now. One of each kind at
 * most, so the list is a set of different levers, not four of the same one.
 *
 * Ordered by what the visits are worth, not just how many: answering new
 * demand adds visits for good, so it leads; fixing a weak live answer protects
 * visits already counted on; publishing sooner only moves visits earlier.
 */
export function buildMoves(
  rows: MarketRow[],
  blogs: Blog[],
  analyses: Map<string, SeoAnalysis>,
  { canWrite }: { canWrite: boolean },
): Move[] {
  const moves: Move[] = [];
  const weight = (r: MarketRow) =>
    r.traffic * (r.trend?.toLowerCase() === "rising" ? RISING_BONUS : 1);

  const gap = rows.filter((r) => r.status === "gap").sort((a, b) => weight(b) - weight(a))[0];
  if (gap) {
    moves.push({
      id: `cover-${gap.key}`,
      kind: "cover",
      title: `Answer “${gap.keyword}”`,
      reason: [
        gap.searches !== null ? `${gap.searches.toLocaleString()} searches a month` : null,
        gap.trend ? gap.trend.toLowerCase() : null,
        "no article yet",
      ]
        .filter(Boolean)
        .join(" · "),
      impact: gap.traffic,
      row: gap,
    });
  }

  const idea = rows.filter((r) => r.status === "idea").sort((a, b) => weight(b) - weight(a))[0];
  if (idea?.article) {
    moves.push({
      id: `schedule-${idea.article.id}`,
      kind: "schedule",
      title: `Schedule “${idea.article.title}”`,
      reason: "The idea is ready — autopilot writes it once it's on the schedule",
      impact: idea.traffic,
      blog: idea.article,
    });
  }

  const weak = blogs
    .filter((b) => b.status === "finished" && (analyses.get(b.id)?.score ?? 100) < 70)
    .sort((a, b) => (b.traffic_estimate ?? 0) - (a.traffic_estimate ?? 0))[0];
  if (weak) {
    const missing = missingSignals(analyses.get(weak.id)).slice(0, 2);
    moves.push({
      id: `strengthen-${weak.id}`,
      kind: "strengthen",
      title: `Strengthen “${weak.title}”`,
      reason: `SEO score ${analyses.get(weak.id)?.score ?? 0}${
        missing.length ? ` · missing ${missing.join(" and ").toLowerCase()}` : ""
      }`,
      impact: weak.traffic_estimate ?? 0,
      blog: weak,
    });
  }

  if (canWrite) {
    const inAWeek = dateKey(addDays(new Date(), 7));
    const late = blogs
      .filter(
        (b) =>
          b.status === "scheduled" &&
          !hasBody(b) &&
          !!b.scheduled_date &&
          b.scheduled_date.slice(0, 10) > inAWeek,
      )
      .sort((a, b) => (b.traffic_estimate ?? 0) - (a.traffic_estimate ?? 0))[0];
    if (late) {
      moves.push({
        id: `accelerate-${late.id}`,
        kind: "accelerate",
        title: `Publish “${late.title}” sooner`,
        reason: `Scheduled for ${formatDay(late.scheduled_date)} — write it now and it starts ranking ${daysUntil(late.scheduled_date)} days sooner`,
        impact: late.traffic_estimate ?? 0,
        blog: late,
      });
    }
  }

  return moves.sort((a, b) => MOVE_RANK[a.kind] - MOVE_RANK[b.kind] || b.impact - a.impact);
}

const MOVE_RANK: Record<MoveKind, number> = { cover: 0, schedule: 0, strengthen: 1, accelerate: 2 };

function daysUntil(day: string | null): number {
  return day ? differenceInCalendarDays(parseDateKey(day), new Date()) : 0;
}

function formatDay(day: string | null): string {
  if (!day) return "later";
  return parseDateKey(day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** "Kanban Board Software", "Linear vs Jira" — a working title from a keyword. */
export function titleFromKeyword(keyword: string): string {
  const small = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "for",
    "in",
    "of",
    "on",
    "or",
    "the",
    "to",
    "vs",
  ]);
  return keyword
    .trim()
    .split(/\s+/)
    .map((w, i) =>
      i > 0 && small.has(w.toLowerCase()) ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1),
    )
    .join(" ");
}
