/**
 * Scheduled blog posts: a post goes live at 00:00 UTC on the date in its
 * frontmatter. Until then it's left out of the blog, the sitemap, llms.txt
 * and the link graph, its URL is a 404, and links to it from live posts
 * render as plain text. The site renders per request, so nothing needs
 * deploying on the day.
 *
 * `vite dev` shows scheduled posts, so they can be read before they go live.
 * See scripts/blog-schedule.ts for how dates are given out.
 */
import { BLOG_SCHEDULE } from "@/data/blog-schedule";

/** Today in UTC, as YYYY-MM-DD. */
export function todayUTC(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Whether a post with this date is live. Undated posts always are. */
export function isLive(
  date: string | null | undefined,
  today: string = todayUTC(),
  preview: boolean = import.meta.env.DEV,
): boolean {
  return preview || !date || date <= today;
}

/** The slug of an on-site blog link ("/blog/x", "https://rankbox.xyz/blog/x#y"), or null. */
export function blogSlugOf(href: string): string | null {
  const m = /^(?:https?:\/\/(?:www\.)?rankbox\.xyz)?\/blog\/([a-z0-9-]+)\/?(?:[?#].*)?$/.exec(href);
  return m ? m[1] : null;
}

/** Whether a path's blog post is live. Paths outside the blog always are. */
export function isBlogPathLive(
  path: string,
  today: string = todayUTC(),
  preview: boolean = import.meta.env.DEV,
): boolean {
  const slug = blogSlugOf(path);
  return !slug || isLive(BLOG_SCHEDULE[slug], today, preview);
}

/** A copy of `value` (article blocks) with links to the given blog posts made plain text. */
export function unlinkPosts<T>(value: T, slugs: ReadonlySet<string>): T {
  if (Array.isArray(value)) return value.map((v) => unlinkPosts(v, slugs)) as T;
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(value)) {
    const target = key === "href" && typeof v === "string" ? blogSlugOf(v) : null;
    out[key] = target && slugs.has(target) ? null : unlinkPosts(v, slugs);
  }
  return out as T;
}
