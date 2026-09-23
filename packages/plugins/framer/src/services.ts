/**
 * The two things the plugin does beyond filling the CMS: telling Rankbox where
 * each article went live, and writing structured data into the published site.
 */
import { framer } from "framer-plugin";
import { RankboxApiError, type PublishedArticle, type RankboxClient } from "@rankbox/api-client";
import { composeLiveUrl, normalizeBlogPath } from "./lib/live-url";
import { articlesNeedingReport, type SlugChange } from "./lib/reconcile";
import { buildCustomCode, CUSTOM_CODE_LOCATION, isRankboxCustomCode } from "./lib/seo";
import type { Ledger } from "./lib/ledger";
import { can } from "./framer-adapter";

/* -------------------------------------------------------------------------- */
/* Live URL reporting                                                          */
/* -------------------------------------------------------------------------- */

export interface ReportOptions {
  client: RankboxClient;
  articles: PublishedArticle[];
  ledger: Ledger;
  productionUrl: string;
  blogPath: string;
  signal?: AbortSignal;
  onProgress?: (done: number, total: number) => void;
}

export interface ReportResult {
  reported: number;
  skipped: number;
  total: number;
  /** Set when the API rejected the domain — the whole run stops on that. */
  domainRejection?: RankboxApiError;
}

/** The API's per-user limit is 120/min, so stay comfortably under it. */
const REPORT_CONCURRENCY = 4;
const MIN_INTERVAL_MS = 600;

/**
 * Report each article's live URL.
 *
 * The first article is sent alone as a probe. An off-domain `published_url` is
 * rejected with a 400, and that will be true for every article, so failing once
 * and explaining it beats firing hundreds of doomed requests.
 */
export async function reportLiveUrls(options: ReportOptions): Promise<ReportResult> {
  const { client, articles, ledger, productionUrl, blogPath, signal, onProgress } = options;
  const path = normalizeBlogPath(blogPath);
  const liveUrlFor = (slug: string) => composeLiveUrl(productionUrl, path, slug);

  const pending = articlesNeedingReport(articles, ledger, liveUrlFor);
  const total = pending.length;
  if (total === 0) return { reported: 0, skipped: 0, total: 0 };

  let reported = 0;
  let skipped = 0;

  // Probe with one, so a domain mismatch costs a single request.
  const [first, ...rest] = pending;
  try {
    await client.reportPublished(first.article.id, first.url, signal);
    reported += 1;
    onProgress?.(reported + skipped, total);
  } catch (err) {
    if (err instanceof RankboxApiError && err.status === 400) {
      return { reported: 0, skipped: 0, total, domainRejection: err };
    }
    if (err instanceof RankboxApiError && err.status === 404) skipped += 1;
    else throw err;
  }

  const queue = [...rest];
  let lastStart = 0;

  async function worker() {
    for (;;) {
      const next = queue.shift();
      if (!next) return;
      if (signal?.aborted) return;

      // Simple pacing so a large library can't trip the rate limiter.
      const wait = Math.max(0, lastStart + MIN_INTERVAL_MS / REPORT_CONCURRENCY - Date.now());
      lastStart = Date.now() + wait;
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));

      try {
        await client.reportPublished(next.article.id, next.url, signal);
        reported += 1;
      } catch (err) {
        // An article deleted or unfinished since the sync isn't a run failure.
        if (err instanceof RankboxApiError && err.status === 404) skipped += 1;
        else throw err;
      }
      onProgress?.(reported + skipped, total);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(REPORT_CONCURRENCY, queue.length) }, () => worker()),
  );

  return { reported, skipped, total };
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                             */
/* -------------------------------------------------------------------------- */

export interface SeoOptions {
  articles: PublishedArticle[];
  ledger: Ledger;
  productionUrl: string;
  blogPath: string;
  brandName: string | null;
  logoUrl?: string | null;
}

export type SeoOutcome = "installed" | "unchanged" | "skipped-permission" | "skipped-occupied";

/**
 * Write the JSON-LD graph into the site's head.
 *
 * Framer allows one custom-code block per location, so if something else
 * already owns `headEnd` we leave it alone rather than overwrite a user's code.
 */
export async function installSeo(options: SeoOptions): Promise<SeoOutcome> {
  if (!can("setCustomCode")) return "skipped-permission";

  const html = buildCustomCode({
    productionUrl: options.productionUrl,
    blogPath: normalizeBlogPath(options.blogPath),
    brandName: options.brandName,
    logoUrl: options.logoUrl,
    articles: options.articles,
    ledger: options.ledger,
  });
  if (!html) return "unchanged";

  const existing = await framer.getCustomCode();
  const current = existing?.[CUSTOM_CODE_LOCATION]?.html ?? null;
  if (current && !isRankboxCustomCode(current)) return "skipped-occupied";
  if (current === html) return "unchanged";

  await framer.setCustomCode({ html, location: CUSTOM_CODE_LOCATION });
  return "installed";
}

/** Remove our block, and only ours. Used on logout and when SEO is turned off. */
export async function removeSeo(): Promise<void> {
  if (!can("setCustomCode")) return;
  try {
    const existing = await framer.getCustomCode();
    const current = existing?.[CUSTOM_CODE_LOCATION]?.html ?? null;
    if (!isRankboxCustomCode(current)) return;
    await framer.setCustomCode({ html: null, location: CUSTOM_CODE_LOCATION });
  } catch {
    // Nothing to clean up is not an error.
  }
}

/* -------------------------------------------------------------------------- */
/* Redirects                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Keep old article URLs working when a slug changes.
 *
 * `addRedirects` throws when the user lacks Site Settings permission or the
 * project's plan has no Redirects, so this is always best-effort: a failure
 * here must never fail a sync.
 */
export async function addSlugRedirects(changes: SlugChange[], blogPath: string): Promise<number> {
  if (changes.length === 0) return 0;
  if (!can("addRedirects")) return 0;
  const path = normalizeBlogPath(blogPath);
  try {
    await framer.addRedirects(
      changes.map((change) => ({
        from: `${path}/${change.from}`,
        to: `${path}/${change.to}`,
        expandToAllLocales: false,
      })),
    );
    return changes.length;
  } catch {
    return 0;
  }
}
