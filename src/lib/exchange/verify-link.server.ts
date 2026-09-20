/**
 * Is the link actually live on the host's page?
 *
 * This is the trust backbone of the exchange: credits move only on a "live"
 * verdict, and a host is charged back only on repeated "missing" ones. A
 * false negative takes credits from an honest member, so the verdict is
 * deliberately cautious about what counts as a failure:
 *
 *   live         the link is in the article body, followed, on an indexable page
 *   missing      the page loaded fine and the link is not in its body
 *   nofollow     the link is there but carries rel=nofollow/sponsored/ugc
 *   noindex      the link is there but the page is noindex or canonicalised elsewhere
 *   unreachable  timeout, network error, 5xx          ┐
 *   blocked      403/429/503 — a bot wall             ├ inconclusive: never a strike
 *   truncated    the page was cut off or is JS-rendered ┘
 */
import { safeFetchText, UnsafeUrlError } from "@/lib/safe-fetch.server";
import { sameLink } from "./domain";

export type LinkOutcome =
  | "live"
  | "missing"
  | "nofollow"
  | "noindex"
  | "unreachable"
  | "blocked"
  | "truncated";

export interface LinkCheck {
  outcome: LinkOutcome;
  httpStatus?: number;
  rel?: string;
  detail: string;
}

/** Outcomes that count against a host. Everything else is "try again later". */
export const FAILING_OUTCOMES: ReadonlySet<LinkOutcome> = new Set([
  "missing",
  "nofollow",
  "noindex",
]);

/**
 * The 512 KB default of safeFetchText is too small here: pages with inlined
 * CSS or a big hydration payload run past it, and a cut-off body would read
 * as "missing" — an unearned chargeback. 2 MB covers real articles.
 */
const MAX_BYTES = 2_000_000;

const STRIP_BLOCKS =
  /<(head|script|style|noscript|template|svg|nav|header|footer|aside)\b[\s\S]*?<\/\1\s*>/gi;
const COMMENTS = /<!--[\s\S]*?-->/g;
const ANCHOR = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;

function attr(tag: string, name: string): string {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return (m?.[1] ?? m?.[2] ?? m?.[3] ?? "").trim();
}

/** The part of the page a reader would call the article: no chrome, no scripts. */
export function bodyRegion(html: string): string {
  return html.replace(COMMENTS, " ").replace(STRIP_BLOCKS, " ");
}

export function extractAnchors(html: string): Array<{ href: string; rel: string; text: string }> {
  const out: Array<{ href: string; rel: string; text: string }> = [];
  for (const m of html.matchAll(ANCHOR)) {
    const href = attr(m[1], "href");
    if (!href) continue;
    out.push({
      href,
      rel: attr(m[1], "rel").toLowerCase(),
      text: m[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    });
  }
  return out;
}

function resolve(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function robotsNoindex(html: string): boolean {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const name = attr(m[0], "name").toLowerCase();
    if (name !== "robots" && name !== "googlebot") continue;
    const content = attr(m[0], "content").toLowerCase();
    if (/\b(noindex|none)\b/.test(content)) return true;
  }
  return false;
}

function canonicalElsewhere(html: string, pageUrl: string): boolean {
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    if (attr(m[0], "rel").toLowerCase() !== "canonical") continue;
    const href = attr(m[0], "href");
    if (!href) return false;
    try {
      const canon = new URL(href, pageUrl).hostname.replace(/^www\./, "");
      const page = new URL(pageUrl).hostname.replace(/^www\./, "");
      return canon !== page;
    } catch {
      return false;
    }
  }
  return false;
}

/** The verdict for a fetched page. Pure, so every branch is unit-tested. */
export function judgePage(
  html: string,
  pageUrl: string,
  targetUrl: string,
  truncated: boolean,
): LinkCheck {
  const region = bodyRegion(html);
  const inBody = extractAnchors(region).filter((a) =>
    sameLink(resolve(a.href, pageUrl), targetUrl),
  );

  if (inBody.length > 0) {
    const followed = inBody.find((a) => !/\b(nofollow|sponsored|ugc)\b/.test(a.rel));
    if (!followed) {
      return {
        outcome: "nofollow",
        rel: inBody[0].rel,
        detail: `the link carries rel="${inBody[0].rel}"`,
      };
    }
    if (robotsNoindex(html)) return { outcome: "noindex", detail: "the page is marked noindex" };
    if (canonicalElsewhere(html, pageUrl)) {
      return { outcome: "noindex", detail: "the page's canonical URL points at another domain" };
    }
    return { outcome: "live", rel: followed.rel, detail: "link found in the article body" };
  }

  // Not in the body. Before calling it missing, rule out not having seen the page.
  if (truncated)
    return { outcome: "truncated", detail: "the page was larger than the fetch limit" };
  const anywhere = extractAnchors(html).some((a) => sameLink(resolve(a.href, pageUrl), targetUrl));
  if (anywhere) {
    return {
      outcome: "missing",
      detail: "the link is only in the page's navigation, header or footer",
    };
  }
  const text = region
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < 600 || extractAnchors(region).length === 0) {
    // A shell the browser fills in with JavaScript: we never saw the article.
    return {
      outcome: "truncated",
      detail: "the page renders its content with JavaScript, so it can't be read",
    };
  }
  return { outcome: "missing", detail: "the page loaded, and the link is not in it" };
}

/** Fetches the host page and judges it. Never throws. */
export async function verifyLink(pageUrl: string, targetUrl: string): Promise<LinkCheck> {
  let res;
  try {
    res = await safeFetchText(pageUrl, {
      maxBytes: MAX_BYTES,
      timeoutMs: 12_000,
      accept: "text/html",
    });
  } catch (err) {
    if (err instanceof UnsafeUrlError)
      return { outcome: "unreachable", detail: `unsafe URL: ${err.message}` };
    return { outcome: "unreachable", detail: err instanceof Error ? err.message : "fetch failed" };
  }
  const status = res.status;
  if (status === 403 || status === 429 || status === 503) {
    return {
      outcome: "blocked",
      httpStatus: status,
      detail: `the site answered ${status} to our checker`,
    };
  }
  if (status === 404 || status === 410) {
    return { outcome: "missing", httpStatus: status, detail: `the page returned ${status}` };
  }
  if (status >= 500)
    return { outcome: "unreachable", httpStatus: status, detail: `the site returned ${status}` };
  if (status !== 200)
    return { outcome: "unreachable", httpStatus: status, detail: `unexpected status ${status}` };
  return {
    ...judgePage(res.body, res.url || pageUrl, targetUrl, res.truncated),
    httpStatus: status,
  };
}
