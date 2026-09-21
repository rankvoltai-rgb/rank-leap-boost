/**
 * The one place Rankbox talks to Apify.
 *
 * Reddit presence reads public Reddit threads and public Google results
 * through two Apify actors. It never authenticates to Reddit, and nothing here
 * can post. The actors are chosen by env var, so either can be swapped — or
 * the whole vendor replaced — without touching the sweep.
 *
 * Every call spends money, so every call is built the same careful way:
 *
 *   • The token is read INSIDE the function. On Workers, env binds at request
 *     time; a module-scope read resolves to undefined.
 *   • No token means an empty result, never a throw. The page then says
 *     discovery isn't switched on — reduced function, not a broken page.
 *   • `maxTotalChargeUsd` goes on the URL. That is the only spend cap Apify
 *     itself enforces; our own accounting is a second opinion, not a limit.
 *   • We abort at two minutes. Apify's own ceiling is five (then HTTP 408), and
 *     one slow actor must not eat a whole request.
 *   • ONE retry, only on 429/5xx, never on a timeout or a 4xx. Retrying a paid
 *     actor that may still be running is how a cost incident happens.
 *   • The in-flight PROMISE is cached, so two members sweeping the same niche
 *     in the same hour share one charge rather than paying twice.
 *
 * Every result carries what it cost. Those figures are internal — they feed
 * the sweep budget and the monthly kill switch and are never shown to a member.
 */
import { createHash } from "crypto";

const API = "https://api.apify.com/v2/acts";

const DEFAULT_REDDIT_ACTOR = "trudax~reddit-scraper-lite";
const DEFAULT_SERP_ACTOR = "apify~google-search-scraper";

/** USD per 1,000 billed units. Estimates, from each actor's listed price. */
const DEFAULT_REDDIT_COST_PER_1K = 3.4;
const DEFAULT_SERP_COST_PER_1K = 1.8;
const DEFAULT_AI_COST_PER_1K = 25;

export interface ApifyCost {
  /** Estimated. Apify bills per event; this is units × the listed unit price. */
  usd: number;
  units: number;
}

export interface ApifyResult {
  items: unknown[];
  cost: ApifyCost;
  /** False when the call was skipped or failed — as opposed to finding nothing. */
  ok: boolean;
  /** Why it was not ok, for the sweep's own log. Never shown to a member. */
  reason?: "unconfigured" | "timeout" | "http" | "budget" | "error";
}

const NO_COST: ApifyCost = { usd: 0, units: 0 };
const skipped = (reason: ApifyResult["reason"]): ApifyResult => ({
  items: [],
  cost: NO_COST,
  ok: false,
  reason,
});

function num(name: string, fallback: number): number {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

export function apifyConfigured(): boolean {
  return Boolean(process.env.APIFY_TOKEN);
}

/** Actor ids use "~" in the path; accept the "user/actor" form people paste. */
function actorId(raw: string): string {
  return raw.trim().replace("/", "~");
}

export function redditActor(): string {
  return actorId(process.env.APIFY_REDDIT_ACTOR || DEFAULT_REDDIT_ACTOR);
}

export function serpActor(): string {
  return actorId(process.env.APIFY_SERP_ACTOR || DEFAULT_SERP_ACTOR);
}

/* ── Cache ──────────────────────────────────────────────────────── */

const CACHE_MAX = 100;
const cache = new Map<string, { at: number; value: Promise<ApifyResult> }>();

function cacheKey(actor: string, input: unknown): string {
  return createHash("sha256")
    .update(`${actor}|${JSON.stringify(input)}`)
    .digest("hex");
}

/**
 * Caches the in-flight promise, which collapses concurrent identical calls
 * into one charge. A cached HIT costs nothing, and reports a cost of nothing —
 * the first caller already paid. Failures are not cached. Per-isolate and
 * best-effort on Workers; the shared reddit_threads table is the durable cache.
 */
function cached(key: string, ttlMs: number, run: () => Promise<ApifyResult>): Promise<ApifyResult> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value.then((r) => ({ ...r, cost: NO_COST }));

  const value = run();
  cache.set(key, { at: Date.now(), value });
  while (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
  void value.then(
    (r) => {
      if (!r.ok) cache.delete(key);
    },
    () => cache.delete(key),
  );
  return value;
}

/* ── The call ───────────────────────────────────────────────────── */

interface RunOptions {
  maxItems: number;
  /** Hard ceiling for this run, enforced by Apify. */
  maxChargeUsd: number;
  costPer1k: number;
  cacheTtlMs?: number;
}

async function runActor(actor: string, input: unknown, opts: RunOptions): Promise<ApifyResult> {
  const token = process.env.APIFY_TOKEN;
  if (!token) return skipped("unconfigured");
  if (opts.maxChargeUsd <= 0 || opts.maxItems <= 0) return skipped("budget");

  const timeoutMs = num("APIFY_TIMEOUT_MS", 120_000);
  const params = new URLSearchParams({
    maxItems: String(Math.ceil(opts.maxItems)),
    maxTotalChargeUsd: opts.maxChargeUsd.toFixed(2),
    timeout: String(Math.ceil(timeoutMs / 1000)),
    format: "json",
    clean: "true",
  });
  const url = `${API}/${encodeURIComponent(actor)}/run-sync-get-dataset-items?${params}`;

  const once = async (): Promise<ApifyResult & { retry?: boolean }> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        // A header, not ?token= — a URL ends up in logs; this does not.
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(input),
        signal: controller.signal,
      });
      if (!res.ok) {
        const retry = res.status === 429 || res.status >= 500;
        return { ...skipped(res.status === 408 ? "timeout" : "http"), retry };
      }
      const json: unknown = await res.json();
      const items = Array.isArray(json) ? json.slice(0, Math.ceil(opts.maxItems)) : [];
      return {
        items,
        ok: true,
        cost: { units: items.length, usd: (items.length / 1000) * opts.costPer1k },
      };
    } catch (e) {
      const aborted = e instanceof Error && e.name === "AbortError";
      return skipped(aborted ? "timeout" : "error");
    } finally {
      clearTimeout(timer);
    }
  };

  const run = async (): Promise<ApifyResult> => {
    const first = await once();
    if (first.ok || !first.retry) return first;
    await new Promise((r) => setTimeout(r, 1500));
    return once();
  };

  return opts.cacheTtlMs ? cached(cacheKey(actor, input), opts.cacheTtlMs, run) : run();
}

const HOUR = 60 * 60 * 1000;

/* ── Reddit ─────────────────────────────────────────────────────── */

/** Channel B: threads Reddit's own search returns for these keywords. */
export function searchReddit(
  queries: string[],
  opts: { perQuery: number; maxChargeUsd: number },
): Promise<ApifyResult> {
  const searches = [...new Set(queries.map((q) => q.trim()).filter(Boolean))].sort();
  if (searches.length === 0) return Promise.resolve(skipped("budget"));
  const maxItems = searches.length * opts.perQuery;
  return runActor(
    redditActor(),
    {
      searches,
      searchPosts: true,
      searchComments: false,
      searchCommunities: false,
      searchUsers: false,
      sort: "relevance",
      time: "year",
      maxItems,
      maxPostCount: opts.perQuery,
      skipComments: true,
      includeNSFW: false,
      proxy: { useApifyProxy: true },
    },
    {
      maxItems,
      maxChargeUsd: opts.maxChargeUsd,
      costPer1k: num("APIFY_REDDIT_COST_PER_1K", DEFAULT_REDDIT_COST_PER_1K),
      cacheTtlMs: 6 * HOUR,
    },
  );
}

/** Hydration: the posts at these URLs, each with a few of its top comments. */
export function fetchRedditPosts(
  urls: string[],
  opts: { commentsPerPost: number; maxChargeUsd: number },
): Promise<ApifyResult> {
  const startUrls = [...new Set(urls)].sort().map((url) => ({ url }));
  if (startUrls.length === 0) return Promise.resolve(skipped("budget"));
  const maxItems = startUrls.length * (1 + opts.commentsPerPost);
  return runActor(
    redditActor(),
    {
      startUrls,
      maxItems,
      maxPostCount: startUrls.length,
      maxComments: opts.commentsPerPost,
      skipComments: opts.commentsPerPost === 0,
      includeNSFW: false,
      proxy: { useApifyProxy: true },
    },
    {
      maxItems,
      maxChargeUsd: opts.maxChargeUsd,
      costPer1k: num("APIFY_REDDIT_COST_PER_1K", DEFAULT_REDDIT_COST_PER_1K),
      cacheTtlMs: 6 * HOUR,
    },
  );
}

/** One comment, to see whether a reply is still there. Never cached. */
export function fetchRedditComment(
  permalink: string,
  opts: { maxChargeUsd: number },
): Promise<ApifyResult> {
  return runActor(
    redditActor(),
    {
      startUrls: [{ url: permalink }],
      maxItems: 6,
      maxPostCount: 1,
      maxComments: 5,
      skipComments: false,
      proxy: { useApifyProxy: true },
    },
    {
      maxItems: 6,
      maxChargeUsd: opts.maxChargeUsd,
      costPer1k: num("APIFY_REDDIT_COST_PER_1K", DEFAULT_REDDIT_COST_PER_1K),
    },
  );
}

/** A subreddit's about page — where its rules live. Cached for a day. */
export function fetchSubreddit(name: string, opts: { maxChargeUsd: number }): Promise<ApifyResult> {
  return runActor(
    redditActor(),
    {
      startUrls: [
        { url: `https://www.reddit.com/r/${name}/about/rules/` },
        { url: `https://www.reddit.com/r/${name}/` },
      ],
      maxItems: 3,
      maxPostCount: 0,
      maxCommunitiesCount: 1,
      skipComments: true,
      skipUserPosts: true,
      proxy: { useApifyProxy: true },
    },
    {
      maxItems: 3,
      maxChargeUsd: opts.maxChargeUsd,
      costPer1k: num("APIFY_REDDIT_COST_PER_1K", DEFAULT_REDDIT_COST_PER_1K),
      cacheTtlMs: 24 * HOUR,
    },
  );
}

/* ── Google ─────────────────────────────────────────────────────── */

export const SERP_COUNTRY = "us";
export const SERP_DEVICE = "desktop";

/**
 * Channel A: Google's results for each keyword, a page at a time. One dataset
 * item per (query, page). Billed per page, so `pages` is a cost multiplier.
 */
export function searchGoogle(
  queries: string[],
  opts: { pages: number; maxChargeUsd: number },
): Promise<ApifyResult> {
  const list = [...new Set(queries.map((q) => q.trim()).filter(Boolean))].sort();
  if (list.length === 0) return Promise.resolve(skipped("budget"));
  const maxItems = list.length * opts.pages;
  return runActor(
    serpActor(),
    {
      queries: list.join("\n"),
      maxPagesPerQuery: opts.pages,
      countryCode: SERP_COUNTRY,
      languageCode: "en",
      mobileResults: false,
      saveHtml: false,
      includeIcons: false,
    },
    {
      maxItems,
      maxChargeUsd: opts.maxChargeUsd,
      costPer1k: num("APIFY_SERP_COST_PER_1K", DEFAULT_SERP_COST_PER_1K),
      cacheTtlMs: 6 * HOUR,
    },
  );
}

export type AiEngineKey = "chatgpt" | "perplexity" | "gemini" | "google_ai_overview";

const AI_ADDON: Record<AiEngineKey, Record<string, unknown>> = {
  chatgpt: { chatGptSearch: { enableChatGpt: true } },
  perplexity: {
    perplexitySearch: {
      enablePerplexity: true,
      returnImages: false,
      returnRelatedQuestions: false,
    },
  },
  gemini: { geminiSearch: { enableGemini: true } },
  google_ai_overview: { aiOverview: { scrapeFullAiOverview: true } },
};

/** The engines an operator has switched on. Empty by default: nothing is checked. */
export function enabledAiEngines(): AiEngineKey[] {
  return (process.env.REDDIT_AI_ENGINES ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is AiEngineKey => s in AI_ADDON);
}

/**
 * What the AI engines answer for each query, with their sources. The add-ons
 * ride on the SERP actor, one page per query. The dearest call here by far, so
 * it takes few queries and is off unless REDDIT_AI_ENGINES says otherwise.
 */
export function askAiEngines(
  queries: string[],
  engines: AiEngineKey[],
  opts: { maxChargeUsd: number },
): Promise<ApifyResult> {
  const list = [...new Set(queries.map((q) => q.trim()).filter(Boolean))].sort();
  if (list.length === 0 || engines.length === 0) return Promise.resolve(skipped("budget"));
  const addons = Object.assign({}, ...engines.map((e) => AI_ADDON[e])) as Record<string, unknown>;
  return runActor(
    serpActor(),
    {
      queries: list.join("\n"),
      maxPagesPerQuery: 1,
      countryCode: SERP_COUNTRY,
      languageCode: "en",
      mobileResults: false,
      saveHtml: false,
      includeIcons: false,
      ...addons,
    },
    {
      maxItems: list.length,
      maxChargeUsd: opts.maxChargeUsd,
      // Billed per engine answer, not per page.
      costPer1k: num("APIFY_AI_COST_PER_1K", DEFAULT_AI_COST_PER_1K) * engines.length,
      cacheTtlMs: 24 * HOUR,
    },
  );
}

/* ── Budget ─────────────────────────────────────────────────────── */

/**
 * A running total for one sweep. Each stage asks what it may still spend and
 * reports what it did. Spending is refused, not throttled: a sweep that runs
 * out of budget stops hydrating and is marked `partial`, which is a better
 * failure than an open-ended bill.
 */
export class SweepBudget {
  private spentUsd = 0;
  readonly counts = { serpQueries: 0, redditQueries: 0, aiChecks: 0 };
  exhausted = false;

  constructor(
    private readonly limitUsd = num("REDDIT_SWEEP_BUDGET_USD", 1),
    private readonly perRunUsd = num("APIFY_MAX_CHARGE_USD_PER_RUN", 0.5),
  ) {}

  get spent(): number {
    return Math.round(this.spentUsd * 10_000) / 10_000;
  }

  get remaining(): number {
    return Math.max(0, this.limitUsd - this.spentUsd);
  }

  /** What one more run may be allowed to charge: the per-run cap, or what's left. */
  allowance(): number {
    const room = Math.min(this.perRunUsd, this.remaining);
    if (room < 0.01) this.exhausted = true;
    return room < 0.01 ? 0 : room;
  }

  record(result: ApifyResult): void {
    this.spentUsd += result.cost.usd;
    if (result.reason === "budget") this.exhausted = true;
  }
}
