import { addDays, format } from "date-fns";
import type { Blog } from "@/lib/data";
import { isOverdue, stageOf, type Stage } from "@/components/dashboard/article-stages";

/**
 * Keeps the calendar honest.
 *
 * Autopilot picks what to write by queue position first and date second. The
 * calendar edits dates. If the two orders drift apart, moving an article to
 * tomorrow on the calendar wouldn't make autopilot write it tomorrow. So every
 * change here re-derives queue positions from the dates: the calendar is the
 * queue.
 */

export type QueuePatch = Pick<Blog, "id"> &
  Partial<Pick<Blog, "scheduled_date" | "queue_position">>;

const DATE_KEY = "yyyy-MM-dd";

export function dateKey(date: Date): string {
  return format(date, DATE_KEY);
}

/** Midnight local time for a "yyyy-MM-dd" key, so calendar math never drifts a day. */
export function parseDateKey(key: string): Date {
  return new Date(`${key.slice(0, 10)}T00:00:00`);
}

export function todayKey(): string {
  return dateKey(new Date());
}

function queued(blogs: Blog[]): Blog[] {
  return blogs.filter((b) => b.status === "scheduled");
}

/** Autopilot's own order, which the dates are about to define. */
function byDateThenPosition(a: Blog, b: Blog): number {
  const da = a.scheduled_date ?? "9999-12-31";
  const db = b.scheduled_date ?? "9999-12-31";
  if (da !== db) return da.localeCompare(db);
  const pa = a.queue_position ?? Number.POSITIVE_INFINITY;
  const pb = b.queue_position ?? Number.POSITIVE_INFINITY;
  if (pa !== pb) return pa - pb;
  return a.created_at.localeCompare(b.created_at);
}

/** Positions 1…n in date order; returns only the rows that change. */
function renumber(blogs: Blog[]): Map<string, QueuePatch> {
  const patches = new Map<string, QueuePatch>();
  queued(blogs)
    .sort(byDateThenPosition)
    .forEach((b, i) => {
      if (b.queue_position !== i + 1) patches.set(b.id, { id: b.id, queue_position: i + 1 });
    });
  return patches;
}

/** Move one article to a day, and reorder the queue to match. */
export function planMove(blogs: Blog[], id: string, day: string): QueuePatch[] {
  const moved = blogs.map((b) => (b.id === id ? { ...b, scheduled_date: day } : b));
  const patches = renumber(moved);
  patches.set(id, { ...patches.get(id), id, scheduled_date: day });
  return [...patches.values()];
}

/**
 * Lay the whole queue out again from tomorrow, in its current order, at the
 * account's pace (articles per week). Used to catch up after autopilot was
 * stopped: overdue articles move forward instead of piling up in the past.
 */
export function planFromTomorrow(blogs: Blog[], perWeek: number): QueuePatch[] {
  const pace = Math.max(1, Math.min(7, perWeek || 7));
  const step = 7 / pace;
  const tomorrow = addDays(new Date(), 1);
  const order = queued(blogs).sort((a, b) => {
    // Current autopilot order: position first, then date.
    const pa = a.queue_position ?? Number.POSITIVE_INFINITY;
    const pb = b.queue_position ?? Number.POSITIVE_INFINITY;
    if (pa !== pb) return pa - pb;
    return byDateThenPosition(a, b);
  });
  const patches: QueuePatch[] = [];
  order.forEach((b, i) => {
    const day = dateKey(addDays(tomorrow, Math.round(i * step)));
    if (b.scheduled_date !== day || b.queue_position !== i + 1) {
      patches.push({ id: b.id, scheduled_date: day, queue_position: i + 1 });
    }
  });
  return patches;
}

/** The patches that put these rows back the way they were — for Undo. */
export function inversePatches(blogs: Blog[], patches: QueuePatch[]): QueuePatch[] {
  const byId = new Map(blogs.map((b) => [b.id, b]));
  return patches.flatMap((p) => {
    const before = byId.get(p.id);
    if (!before) return [];
    return [
      {
        id: p.id,
        ...("scheduled_date" in p ? { scheduled_date: before.scheduled_date } : {}),
        ...("queue_position" in p ? { queue_position: before.queue_position } : {}),
      },
    ];
  });
}

export function applyPatches(blogs: Blog[], patches: QueuePatch[]): Blog[] {
  const byId = new Map(patches.map((p) => [p.id, p]));
  return blogs.map((b) => {
    const p = byId.get(b.id);
    return p ? { ...b, ...p } : b;
  });
}

/**
 * The day a published article went live, as best the row can tell: its
 * planned day, unless it was written early — then the day it was written.
 */
export function publishedOn(blog: Blog): string {
  const written = dateKey(new Date(blog.updated_at));
  if (!blog.scheduled_date) return written;
  const planned = blog.scheduled_date.slice(0, 10);
  return planned < written ? planned : written;
}

/** "every day", "3 times a week", "once a week". */
export function paceLabel(perWeek: number): string {
  const n = Math.max(1, Math.min(7, perWeek || 7));
  if (n === 7) return "every day";
  if (n === 1) return "once a week";
  if (n === 2) return "twice a week";
  return `${n} times a week`;
}

/* ── Placing articles on days ───────────────────────────────────── */

export type Tone = "published" | "writing" | "scheduled" | "overdue";

export interface Placed {
  blog: Blog;
  tone: Tone;
  /** "yyyy-MM-dd", or null for a queued article that has no day yet. */
  day: string | null;
}

const TONE_ORDER: Record<Tone, number> = { published: 0, writing: 1, overdue: 2, scheduled: 3 };

function toneOf(stage: Stage, blog: Blog): Tone {
  if (stage === "published") return "published";
  if (stage === "writing") return "writing";
  return isOverdue(blog) ? "overdue" : "scheduled";
}

/**
 * Where each article belongs on the calendar: published work on the day it
 * went live (the past fills with proof), queued work on the day autopilot
 * writes it (the future is the plan), and anything being written on today.
 * Ideas have no day and stay on the Articles page.
 */
export function placeArticles(blogs: Blog[], isWriting: (id: string) => boolean): Placed[] {
  const today = todayKey();
  const placed = blogs.flatMap((blog): Placed[] => {
    const stage = stageOf(blog, isWriting(blog.id));
    if (stage === "idea") return [];
    const tone = toneOf(stage, blog);
    if (tone === "writing") return [{ blog, tone, day: today }];
    if (tone === "published") return [{ blog, tone, day: publishedOn(blog) }];
    return [{ blog, tone, day: blog.scheduled_date?.slice(0, 10) ?? null }];
  });
  // Day, then done-before-pending, then autopilot's own queue order.
  return placed.sort((a, b) => {
    const da = a.day ?? "9999-12-31";
    const db = b.day ?? "9999-12-31";
    if (da !== db) return da.localeCompare(db);
    if (a.tone !== b.tone) return TONE_ORDER[a.tone] - TONE_ORDER[b.tone];
    return (a.blog.queue_position ?? 1e9) - (b.blog.queue_position ?? 1e9);
  });
}
