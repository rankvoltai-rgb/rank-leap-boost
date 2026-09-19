import { format } from "date-fns";
import type { Blog } from "@/lib/data";

/**
 * An article's place in the pipeline, in the user's words. Derived from the
 * stored status plus what the client knows that the row doesn't yet — an
 * article this tab is writing right now reads "writing" before the server
 * flips it.
 */
export type Stage = "idea" | "scheduled" | "writing" | "published";

/** The Articles views, in pipeline order after "all". */
export type ArticleView = "all" | "ideas" | "scheduled" | "published";

export function stageOf(blog: Blog, writing = false): Stage {
  if (writing || blog.status === "generating") return "writing";
  if (blog.status === "finished") return "published";
  if (blog.status === "scheduled") return "scheduled";
  return "idea";
}

export function hasBody(blog: Blog): boolean {
  return !!blog.body?.trim();
}

/**
 * Scheduled for a day that has passed and still unwritten — autopilot is
 * behind (no active trial, or out of credits). Worth saying out loud.
 */
export function isOverdue(blog: Blog): boolean {
  if (blog.status !== "scheduled" || !blog.scheduled_date) return false;
  // The user's own today — the calendar is laid out in local days.
  return blog.scheduled_date.slice(0, 10) < format(new Date(), "yyyy-MM-dd");
}

export function inView(stage: Stage, view: ArticleView): boolean {
  if (view === "all") return true;
  if (view === "ideas") return stage === "idea";
  if (view === "scheduled") return stage === "scheduled" || stage === "writing";
  return stage === "published";
}

/** What needs attention first: in flight, then next up, then done, then maybe. */
const STAGE_ORDER: Record<Stage, number> = { writing: 0, scheduled: 1, published: 2, idea: 3 };

/** Autopilot's own pick order — lowest queue position, then soonest date. */
function byQueue(a: Blog, b: Blog): number {
  const pa = a.queue_position ?? Number.POSITIVE_INFINITY;
  const pb = b.queue_position ?? Number.POSITIVE_INFINITY;
  if (pa !== pb) return pa - pb;
  return (a.scheduled_date ?? "9999").localeCompare(b.scheduled_date ?? "9999");
}

/**
 * The one ordering every view and the panel's prev/next arrows share. The
 * schedule follows autopilot's own pick order, so the list shows what it will
 * write next, first.
 */
export function sortArticles(blogs: Blog[], isWriting: (id: string) => boolean): Blog[] {
  return [...blogs].sort((a, b) => {
    const sa = stageOf(a, isWriting(a.id));
    const sb = stageOf(b, isWriting(b.id));
    if (sa !== sb) return STAGE_ORDER[sa] - STAGE_ORDER[sb];
    if (sa === "published") return b.updated_at.localeCompare(a.updated_at);
    if (sa === "idea") return (b.traffic_estimate ?? 0) - (a.traffic_estimate ?? 0);
    return byQueue(a, b);
  });
}

export function matchesQuery(blog: Blog, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return blog.title.toLowerCase().includes(q) || (blog.keyword ?? "").toLowerCase().includes(q);
}
