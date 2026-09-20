/**
 * Finding where an article actually went live.
 *
 * Rankbox never learns this on its own: CMS plugins pull finished articles
 * from the public API and publish them on the member's site. Three sources,
 * best first — the plugin reporting it (PATCH /api/public/v1/articles/:id),
 * this sitemap crawl, and the member pasting it. The crawl needs no plugin
 * release at all, which is why it exists.
 */
import { articleSlug } from "@/lib/api-keys.server";
import { safeFetchText } from "@/lib/safe-fetch.server";
import { isOnDomain } from "./domain";
import { tokens } from "./scoring";

const MAX_URLS = 5000;
const MAX_SITEMAPS = 20;
const MAX_DEPTH = 3;
const CACHE_MS = 6 * 60 * 60 * 1000;

const cache = new Map<string, { at: number; urls: string[] }>();

/** `<loc>` entries of a sitemap or sitemap index. */
export function parseSitemap(xml: string): { urls: string[]; sitemaps: string[] } {
  const locs = (block: string) =>
    [...block.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)\s*(?:\]\]>)?\s*<\/loc>/gi)].map(
      (m) => m[1].replace(/&amp;/g, "&").trim(),
    );
  const sitemaps = [...xml.matchAll(/<sitemap\b[\s\S]*?<\/sitemap>/gi)].flatMap((m) => locs(m[0]));
  const urls = [...xml.matchAll(/<url\b[\s\S]*?<\/url>/gi)].flatMap((m) => locs(m[0]));
  return { urls, sitemaps };
}

function lastSegment(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    return decodeURIComponent(path.slice(path.lastIndexOf("/") + 1))
      .toLowerCase()
      .replace(/\.(html?|php)$/, "");
  } catch {
    return "";
  }
}

/**
 * The URL among `urls` that is this article, or null. Tries the exact plugin
 * slug, then the id suffix, then the bare title slug, then a close title
 * match — and refuses to guess when two pages fit equally well.
 */
export function matchArticleUrl(urls: string[], title: string, id: string): string | null {
  const exact = articleSlug(title, id);
  const idSuffix = id.slice(0, 8).toLowerCase();
  const titleSlug = exact.slice(0, exact.length - idSuffix.length - 1);
  const segments = urls.map((u) => ({ url: u, seg: lastSegment(u) })).filter((s) => s.seg);

  const only = (hits: Array<{ url: string }>) => (hits.length === 1 ? hits[0].url : null);

  const byExact = segments.filter((s) => s.seg === exact);
  if (byExact.length) return byExact[0].url;
  const byId = only(segments.filter((s) => s.seg.endsWith(`-${idSuffix}`) || s.seg === idSuffix));
  if (byId) return byId;
  const byTitle = only(segments.filter((s) => s.seg === titleSlug));
  if (byTitle) return byTitle;

  const want = new Set(tokens(title));
  if (want.size < 3) return null;
  let best: { url: string; score: number } | null = null;
  let tie = false;
  for (const s of segments) {
    const have = new Set(tokens(s.seg.replace(/-/g, " ")));
    if (have.size === 0) continue;
    let shared = 0;
    for (const t of want) if (have.has(t)) shared += 1;
    const score = shared / Math.max(want.size, have.size);
    if (score < 0.85) continue;
    if (!best || score > best.score) {
      best = { url: s.url, score };
      tie = false;
    } else if (score === best.score) tie = true;
  }
  return best && !tie ? best.url : null;
}

async function fetchXml(url: string): Promise<string | null> {
  try {
    const res = await safeFetchText(url, {
      maxBytes: 2_000_000,
      timeoutMs: 10_000,
      accept: "application/xml,text/xml,text/plain;q=0.8,*/*;q=0.5",
    });
    return res.status === 200 ? res.body : null;
  } catch {
    return null;
  }
}

/** Every page URL in the site's sitemaps, capped, cached for six hours. */
export async function crawlSitemapUrls(domain: string, max = MAX_URLS): Promise<string[]> {
  const hit = cache.get(domain);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.urls;

  const roots: string[] = [];
  const robots = await fetchXml(`https://${domain}/robots.txt`);
  if (robots) {
    for (const m of robots.matchAll(/^\s*sitemap:\s*(\S+)/gim)) {
      // A sitemap on another host says nothing trustworthy about this one.
      if (isOnDomain(m[1], domain)) roots.push(m[1]);
    }
  }
  if (roots.length === 0) {
    roots.push(
      `https://${domain}/sitemap.xml`,
      `https://${domain}/sitemap_index.xml`,
      `https://${domain}/wp-sitemap.xml`,
      `https://${domain}/sitemap-index.xml`,
    );
  }

  const seen = new Set<string>();
  const urls = new Set<string>();
  let queue = roots.map((url) => ({ url, depth: 0 }));
  let fetched = 0;
  while (queue.length && fetched < MAX_SITEMAPS && urls.size < max) {
    const next: typeof queue = [];
    for (const { url, depth } of queue) {
      if (seen.has(url) || fetched >= MAX_SITEMAPS || urls.size >= max) continue;
      seen.add(url);
      if (/\.gz($|\?)/i.test(url)) continue;
      const xml = await fetchXml(url);
      fetched += 1;
      if (!xml) continue;
      const parsed = parseSitemap(xml);
      for (const u of parsed.urls) {
        if (urls.size >= max) break;
        if (isOnDomain(u, domain)) urls.add(u);
      }
      if (depth < MAX_DEPTH) {
        for (const s of parsed.sitemaps)
          if (isOnDomain(s, domain)) next.push({ url: s, depth: depth + 1 });
      }
    }
    queue = next;
  }

  const list = [...urls];
  cache.set(domain, { at: Date.now(), urls: list });
  return list;
}

/** The article's live URL on `domain`, from its sitemap, or null. */
export async function discoverPublishedUrl(
  blog: { id: string; title: string },
  domain: string,
): Promise<string | null> {
  const urls = await crawlSitemapUrls(domain);
  if (urls.length === 0) return null;
  return matchArticleUrl(urls, blog.title, blog.id);
}
