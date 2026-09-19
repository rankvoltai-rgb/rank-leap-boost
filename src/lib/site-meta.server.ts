/**
 * Server-side site scrape: brand metadata (name, description, logo) plus the
 * page's readable text, which onboarding feeds to the AI.
 *
 * Two paths, in order:
 *
 *   1. Firecrawl, when FIRECRAWL_API_KEY is set. It renders JS and rotates
 *      proxies, so it reads sites a plain server fetch cannot — g2.com returns
 *      403 to our own bot but 200 through Firecrawl. It also means the
 *      outbound request to a user-supplied URL leaves *their* infrastructure,
 *      not ours, which removes the SSRF surface rather than merely guarding it.
 *
 *   2. A direct guarded fetch, when there is no key or Firecrawl fails. Uses
 *      safe-fetch.server.ts, so private/loopback/metadata addresses are still
 *      refused. This keeps onboarding working with zero configuration.
 *
 * Mirrors the graceful degradation research.server.ts already uses for its
 * Firecrawl search: no key means reduced quality, never a hard failure.
 */
import { safeFetchText, UnsafeUrlError, assertSafeUrl } from "./safe-fetch.server";
import { brandFromDomain, brandFromTitle, domainOf, type SiteMeta } from "./site-meta";

const FIRECRAWL_SCRAPE = "https://api.firecrawl.dev/v2/scrape";
const FIRECRAWL_TIMEOUT_MS = 45_000;
/** Enough of a homepage to brief the AI without flooding the prompt. */
const MAX_CONTENT_CHARS = 14_000;

export interface SiteScrape {
  meta: SiteMeta;
  /** Readable page text (markdown via Firecrawl). Empty when the page couldn't be read. */
  content: string;
}

interface FirecrawlMeta {
  title?: string | string[];
  description?: string | string[];
  ogImage?: string | string[];
  ogTitle?: string | string[];
  ogSiteName?: string | string[];
  favicon?: string | string[];
  language?: string | string[];
  statusCode?: number;
  url?: string;
  sourceURL?: string;
  "theme-color"?: string | string[];
  [key: string]: unknown;
}

/** Firecrawl returns some fields as string | string[]; take the first string. */
function one(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (Array.isArray(value)) {
    const first = value.find((v) => typeof v === "string" && v.trim());
    return typeof first === "string" ? first.trim() : null;
  }
  return null;
}

function originOf(rawUrl: string, fallback: string): string {
  try {
    return new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`).origin;
  } catch {
    return fallback;
  }
}

async function viaFirecrawl(rawUrl: string, apiKey: string): Promise<SiteScrape | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FIRECRAWL_TIMEOUT_MS);
  try {
    const res = await fetch(FIRECRAWL_SCRAPE, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        url: rawUrl,
        // markdown is the page text for the AI; rawHtml is only read for the
        // <head> icon links, since metadata.favicon is a single guess.
        formats: ["markdown", "rawHtml"],
        onlyMainContent: true,
        // Escalates through proxies only when a site actually blocks us.
        proxy: "auto",
      }),
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      success?: boolean;
      data?: { metadata?: FirecrawlMeta; markdown?: string; rawHtml?: string };
    };
    const md = json?.data?.metadata;
    if (!json?.success || !md) return null;
    if (typeof md.statusCode === "number" && (md.statusCode < 200 || md.statusCode >= 400)) {
      return null;
    }

    const finalUrl = one(md.url) ?? one(md.sourceURL) ?? rawUrl;
    const domain = domainOf(finalUrl);
    const title = one(md.ogTitle) ?? one(md.title) ?? "";
    const icon = await resolveFavicon(json.data?.rawHtml ?? "", finalUrl, one(md.favicon));

    return {
      meta: {
        url: originOf(finalUrl, finalUrl),
        domain,
        brandName: one(md.ogSiteName) ?? brandFromTitle(title, domain),
        title,
        description: one(md.description) ?? "",
        ...icon,
        themeColor: one(md["theme-color"]),
        via: "firecrawl",
      },
      content: (json.data?.markdown ?? "").trim().slice(0, MAX_CONTENT_CHARS),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Favicon — the brand logo                                            */
/* ------------------------------------------------------------------ */

interface DeclaredIcon {
  url: string;
  source: "favicon" | "apple-touch-icon";
  /** Edge length in px it renders cleanly at; how candidates are ranked. */
  size: number;
}

/** A tag's attributes: lowercased names, unquoted values. */
function tagAttributes(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-z][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi)) {
    out[m[1].toLowerCase()] = (m[2] ?? m[3] ?? m[4] ?? "").trim().replace(/&amp;/g, "&");
  }
  return out;
}

/**
 * The favicons a page declares in <head>, sharpest first.
 *
 * The logo well is 64px, where a 16px icon is a blur, so size decides: SVG or
 * sizes="any" scales cleanly, then the largest declared size, then
 * apple-touch-icon (180px by convention). mask-icon is skipped — it is Safari's
 * one-colour silhouette, not the brand mark.
 */
function declaredFavicons(html: string, base: string): DeclaredIcon[] {
  const headEnd = html.search(/<\/head>/i);
  const head = headEnd > 0 ? html.slice(0, headEnd) : html.slice(0, 200_000);
  const icons: DeclaredIcon[] = [];
  for (const [tag] of head.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = tagAttributes(tag);
    const rel = (attrs.rel ?? "").toLowerCase().split(/\s+/);
    const apple = rel.some((r) => r.startsWith("apple-touch-icon"));
    if (!apple && !rel.includes("icon")) continue;
    const url = absolute(attrs.href || null, base);
    // `href="data:,"` is a common way to declare "no favicon"; only an inline
    // image counts.
    if (!url || (url.startsWith("data:") && !/^data:image\//i.test(url))) continue;
    const sizes = (attrs.sizes ?? "").toLowerCase();
    const scalable =
      sizes === "any" || /svg/i.test(attrs.type ?? "") || /\.svg(?:[?#]|$)/i.test(url);
    const declared = Math.max(0, ...[...sizes.matchAll(/(\d+)x\d+/g)].map((m) => Number(m[1])));
    icons.push({
      url,
      source: apple ? "apple-touch-icon" : "favicon",
      size: scalable ? 512 : declared || (apple ? 180 : 32),
    });
  }
  // sort is stable, so equal sizes keep document order.
  return icons.sort((a, b) => b.size - a.size);
}

/** True when the URL actually serves something other than an HTML error page. */
async function servesIcon(url: string): Promise<boolean> {
  try {
    const res = await safeFetchText(url, { timeoutMs: 4000, maxBytes: 64_000, accept: "image/*" });
    return (
      res.status >= 200 && res.status < 300 && !/text\/html/i.test(res.contentType) && !!res.body
    );
  } catch {
    return false;
  }
}

/**
 * The brand logo: the site's sharpest declared favicon.
 *
 * With none declared, falls back to the scraper's reported favicon and then
 * /favicon.ico. Those are conventions rather than declarations, so each is
 * checked before use, and the logo stays empty if neither exists — the UI then
 * asks for an upload instead of showing a broken image.
 */
async function resolveFavicon(
  html: string,
  pageUrl: string,
  reported: string | null,
): Promise<Pick<SiteMeta, "logoUrl" | "faviconUrl" | "logoSource">> {
  const best = declaredFavicons(html, pageUrl)[0];
  if (best) return { logoUrl: best.url, faviconUrl: best.url, logoSource: best.source };

  const guesses = [reported, absolute("/favicon.ico", pageUrl)].filter(
    (u, i, all): u is string => !!u && all.indexOf(u) === i,
  );
  for (const url of guesses) {
    if (await servesIcon(url)) return { logoUrl: url, faviconUrl: url, logoSource: "favicon" };
  }
  return { logoUrl: null, faviconUrl: null, logoSource: null };
}

/* ------------------------------------------------------------------ */
/* Direct fallback                                                     */
/* ------------------------------------------------------------------ */

function metaContent(html: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]?.trim()) return m[1].trim();
  }
  return null;
}

/** Resolves a possibly-relative asset URL against the page it came from. */
function absolute(href: string | null, base: string): string | null {
  if (!href) return null;
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

/** Visible text of an HTML page: scripts, styles and tags stripped. */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CONTENT_CHARS);
}

async function viaDirectFetch(rawUrl: string): Promise<SiteScrape> {
  const domain = domainOf(rawUrl);
  const empty: SiteMeta = {
    url: originOf(rawUrl, `https://${domain}`),
    domain,
    brandName: brandFromDomain(domain),
    title: "",
    description: "",
    logoUrl: null,
    faviconUrl: null,
    themeColor: null,
    logoSource: null,
    via: "direct",
  };

  let html = "";
  let finalUrl = rawUrl;
  try {
    const res = await safeFetchText(rawUrl, { timeoutMs: 8000 });
    if (res.status < 200 || res.status >= 400) return { meta: empty, content: "" };
    if (!/text\/html|application\/xhtml\+xml/i.test(res.contentType)) {
      return { meta: empty, content: "" };
    }
    html = res.body;
    finalUrl = res.url;
  } catch (err) {
    // A refused URL is a caller error worth surfacing; anything else degrades.
    if (err instanceof UnsafeUrlError) throw err;
    return { meta: empty, content: "" };
  }

  const title =
    metaContent(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
      /<title[^>]*>([^<]+)<\/title>/i,
    ]) ?? "";

  const description =
    metaContent(html, [
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
    ]) ?? "";

  const siteName = metaContent(html, [
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
  ]);

  const icon = await resolveFavicon(html, finalUrl, null);
  return {
    meta: {
      ...empty,
      url: originOf(finalUrl, empty.url),
      domain: domainOf(finalUrl),
      brandName: siteName ?? brandFromTitle(title, domainOf(finalUrl)),
      title,
      description,
      ...icon,
      themeColor: metaContent(html, [
        /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i,
      ]),
      via: "direct",
    },
    content: htmlToText(html),
  };
}

/* Onboarding scrapes the same site twice in a minute — once to prefill the
   brand, once for the keyword analysis. Caching the in-flight promise makes the
   second a free hit and collapses concurrent calls into one Firecrawl credit.
   Per-isolate and best-effort on Workers; a miss just scrapes again. */
const CACHE_TTL_MS = 10 * 60_000;
const CACHE_MAX = 50;
const cache = new Map<string, { at: number; value: Promise<SiteScrape> }>();

function cacheKey(url: string): string {
  return url.replace(/\/+$/, "").toLowerCase();
}

/**
 * Scrapes a site's brand metadata and readable text.
 *
 * Validates the URL before spending a Firecrawl credit, so junk and
 * non-routable hosts are rejected for free.
 */
export async function scrapeSite(rawUrl: string): Promise<SiteScrape> {
  // Throws UnsafeUrlError for bad schemes / private hosts.
  const validated = assertSafeUrl(rawUrl).toString();
  const key = cacheKey(validated);

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;

  const value = (async () => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (apiKey) {
      const result = await viaFirecrawl(validated, apiKey);
      if (result) return result;
    }
    return viaDirectFetch(validated);
  })();

  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
  cache.set(key, { at: Date.now(), value });
  value.then(
    // Also file it under the post-redirect origin, which is the URL the client
    // carries forward into the analysis step.
    (result) => {
      const finalKey = cacheKey(result.meta.url);
      if (finalKey !== key) cache.set(finalKey, { at: Date.now(), value });
    },
    () => cache.delete(key),
  );
  return value;
}

/** Brand metadata only. */
export async function scrapeSiteMeta(rawUrl: string): Promise<SiteMeta> {
  return (await scrapeSite(rawUrl)).meta;
}
