/**
 * Lets Vercel's CDN keep public pages, so a page view doesn't always run a
 * server render. Rendering is the site's main cost: Vercel paused the Hobby
 * team on 2026-10-21 for Active CPU, at about a second of CPU per render.
 *
 * Public pages render the same for every visitor and change only on a deploy
 * (each deployment has its own cache) or at 00:00 UTC, when scheduled blog
 * posts go live (blog-release.ts). So a page is kept until the next UTC
 * midnight, then served stale to one request while it renders again.
 *
 * Never cached: signed-in pages, the API, server functions, the lab, and blog
 * posts in their first TRIAL_HOLD_DAYS days, because lab experiment B6 logs
 * bot visits to new posts in the server entry and a CDN hit never reaches it.
 */
import { BLOG_SCHEDULE } from "@/data/blog-schedule";
import { blogSlugOf } from "@/lib/blog-release";
import { TRIAL_HOLD_DAYS } from "@/lib/lab/experiments";

/** First path segments of the public pages ("" is the home page). */
const PUBLIC_SECTIONS = new Set([
  "",
  "about",
  "ai-seo",
  "alternatives",
  "blog",
  "changelog",
  "compare",
  "docs",
  "features",
  "glossary",
  "integrations",
  "legal",
  "llms.txt",
  "pricing",
  "sitemap.xml",
  "solutions",
  "tools",
  "trust",
  "use-cases",
  "white-label",
]);

const DAY_MS = 86_400_000;

/** Whether the page at this path is the same for every visitor and safe to cache. */
export function isCacheablePath(path: string, now: Date = new Date()): boolean {
  // "/docs.md" is the docs index as markdown for agents.
  const section = (path.split("/")[1] ?? "").replace(/\.md$/, "");
  if (!PUBLIC_SECTIONS.has(section)) return false;
  const slug = blogSlugOf(path);
  const live = slug ? BLOG_SCHEDULE[slug] : undefined;
  return !live || now.getTime() - Date.parse(live) >= TRIAL_HOLD_DAYS * DAY_MS;
}

/** The Vercel-CDN-Cache-Control value for a page rendered at `now`: fresh until 00:00 UTC. */
export function cdnCacheControl(now: Date = new Date()): string {
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const maxAge = Math.max(60, Math.ceil((midnight - now.getTime()) / 1000));
  return `max-age=${maxAge}, stale-while-revalidate=${DAY_MS / 1000}`;
}

/**
 * The response with Vercel-CDN-Cache-Control added when it's a public page
 * that's safe to share. Browsers and other CDNs never see that header, so
 * their caching is unchanged.
 */
export function withCdnCache(
  request: Request,
  response: Response,
  now: Date = new Date(),
): Response {
  if (request.method !== "GET" && request.method !== "HEAD") return response;
  if (response.status !== 200 || response.headers.has("set-cookie")) return response;
  if (/no-store|no-cache|private/.test(response.headers.get("cache-control") ?? ""))
    return response;
  if (!isCacheablePath(new URL(request.url).pathname, now)) return response;

  const headers = new Headers(response.headers);
  headers.set("Vercel-CDN-Cache-Control", cdnCacheControl(now));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
