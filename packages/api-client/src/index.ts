/**
 * @rankbox/api-client
 *
 * Zero-dependency, framework-agnostic client for the Rankbox public API
 * (`/api/public/v1/*`). Shared by every Rankbox CMS plugin (Framer, Webflow,
 * Shopify) so authentication, the response shapes, retries, and timeouts live
 * in exactly one place.
 *
 * The types mirror the server shapes in `src/lib/public-api.server.ts`. Keep
 * them in sync when the API evolves.
 */

/** A finished, publishable article — the unit every plugin syncs to a site. */
export interface PublishedArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_markdown: string;
  body_html: string;
  tags: string[];
  seo_score: number;
  /** Where a plugin published it, once reported. Null until `reportPublished`. */
  published_url: string | null;
  published_at: string;
  updated_at: string;
}

export interface PingResult {
  ok: boolean;
  service: string;
  brand_name: string | null;
  /** The website the site is set up with. Added 2026-09; absent on older deployments. */
  website_url?: string | null;
  /** The site's logo, for structured data. Added 2026-09; absent on older deployments. */
  logo_url?: string | null;
}

export interface ArticlesPage {
  articles: PublishedArticle[];
  count: number;
  /** Pass back as `since` on the next poll to fetch only newer articles. */
  next_since: string | null;
}

export interface RankboxClientOptions {
  /** A Rankbox API key (starts with `rv_live_`). Generate one in dashboard → Integrations. */
  apiKey: string;
  /** API origin. Defaults to the hosted app; override for staging/self-host. */
  baseUrl?: string;
  /** Per-request timeout in ms (default 20000). */
  timeoutMs?: number;
  /** Network / 5xx / 429 retry attempts (default 2). */
  retries?: number;
  /** Inject a custom fetch. Defaults to global fetch. */
  fetch?: typeof fetch;
}

export class RankboxApiError extends Error {
  constructor(
    public status: number,
    message: string,
    /** Machine-readable code from the body, e.g. "subscription_required" on a 402. */
    public code?: string,
    /** Parsed from `Retry-After` on a 429, in milliseconds. */
    public retryAfterMs?: number,
  ) {
    super(message);
    this.name = "RankboxApiError";
  }
}

const DEFAULT_BASE_URL = "https://rankbox.xyz";

/** The public API caps `limit` at 100, so that is the most a single page can hold. */
export const MAX_PAGE_SIZE = 100;

interface RequestOptions {
  method?: "GET" | "PATCH";
  body?: unknown;
  /** Caller-supplied cancellation, composed with the internal timeout. */
  signal?: AbortSignal;
}

export class RankboxClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly retries: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: RankboxClientOptions) {
    if (!options.apiKey) throw new Error("RankboxClient requires an `apiKey`.");
    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? 20_000;
    this.retries = options.retries ?? 2;
    const f = options.fetch ?? (globalThis.fetch as typeof fetch | undefined);
    if (!f) throw new Error("No fetch implementation available — pass `fetch` in options.");
    this.fetchImpl = f;
  }

  /** Validate the key and return the connected brand. Use this on plugin setup. */
  ping(signal?: AbortSignal): Promise<PingResult> {
    return this.request<PingResult>("/api/public/v1/ping", { signal });
  }

  /** List the site's finished articles, oldest first. Use `since` for incremental sync. */
  listArticles(
    options: { since?: string | null; limit?: number } = {},
    signal?: AbortSignal,
  ): Promise<ArticlesPage> {
    const params = new URLSearchParams();
    if (options.since) params.set("since", options.since);
    if (options.limit) params.set("limit", String(options.limit));
    const query = params.toString();
    return this.request<ArticlesPage>(`/api/public/v1/articles${query ? `?${query}` : ""}`, {
      signal,
    });
  }

  /** Fetch a single finished article by id. */
  async getArticle(id: string, signal?: AbortSignal): Promise<PublishedArticle> {
    const { article } = await this.request<{ article: PublishedArticle }>(
      `/api/public/v1/articles/${encodeURIComponent(id)}`,
      { signal },
    );
    return article;
  }

  /**
   * Report where a plugin published an article. This is how the backlink
   * exchange learns which page to verify hosted links on.
   *
   * The server rejects a URL that isn't on the site's own domain with a 400,
   * so callers should probe with one article before reporting a whole library.
   */
  async reportPublished(
    id: string,
    publishedUrl: string,
    signal?: AbortSignal,
  ): Promise<PublishedArticle> {
    const { article } = await this.request<{ article: PublishedArticle }>(
      `/api/public/v1/articles/${encodeURIComponent(id)}`,
      { method: "PATCH", body: { published_url: publishedUrl }, signal },
    );
    return article;
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, signal } = options;
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.retries; attempt += 1) {
      if (signal?.aborted) throw new RankboxApiError(0, "Request cancelled.");

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      const onAbort = () => controller.abort();
      signal?.addEventListener("abort", onAbort);

      try {
        const headers: Record<string, string> = { Authorization: `Bearer ${this.apiKey}` };
        if (body !== undefined) headers["Content-Type"] = "application/json";

        const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
          method,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });

        if ((response.status >= 500 || response.status === 429) && attempt < this.retries) {
          const retryAfterMs = parseRetryAfter(response);
          lastError = new RankboxApiError(
            response.status,
            `HTTP ${response.status}`,
            undefined,
            retryAfterMs,
          );
          await delay(backoffMs(response.status, attempt, retryAfterMs), signal);
          continue;
        }

        const payload = (await response.json().catch(() => null)) as
          | (T & { error?: string; code?: string })
          | { error: string; code?: string }
          | null;

        if (!response.ok) {
          const message =
            payload && typeof payload === "object" && "error" in payload && payload.error
              ? payload.error
              : `Request failed (HTTP ${response.status}).`;
          const code =
            payload && typeof payload === "object" && "code" in payload && payload.code
              ? String(payload.code)
              : undefined;
          throw new RankboxApiError(response.status, message, code, parseRetryAfter(response));
        }
        if (!payload) {
          throw new RankboxApiError(response.status, "Malformed API response.");
        }
        return payload as T;
      } catch (err) {
        lastError = err;
        // A caller-initiated cancel is final, never a retry.
        if (signal?.aborted) throw new RankboxApiError(0, "Request cancelled.");
        // Definitive 4xx errors shouldn't be retried.
        if (err instanceof RankboxApiError && err.status >= 400 && err.status < 500) throw err;
        if (attempt >= this.retries) break;
        await delay(backoffMs(0, attempt), signal);
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
      }
    }

    if (lastError instanceof RankboxApiError) throw lastError;
    throw new RankboxApiError(
      0,
      lastError instanceof Error ? lastError.message : "Network request failed.",
    );
  }
}

/**
 * 5xx and network blips clear in milliseconds, but the public API's rate limit
 * is a 60-second fixed window — retrying a 429 after 300ms is guaranteed to
 * fail again, so those back off in seconds and prefer the server's own hint.
 */
export function backoffMs(status: number, attempt: number, retryAfterMs?: number): number {
  if (status === 429) {
    if (retryAfterMs && retryAfterMs > 0) return Math.min(retryAfterMs, 60_000);
    return [2_000, 5_000][Math.min(attempt, 1)];
  }
  return 300 * (attempt + 1);
}

/** `Retry-After` is either seconds or an HTTP date. Returns ms, or undefined. */
export function parseRetryAfter(response: {
  headers?: { get(name: string): string | null };
}): number | undefined {
  const raw = response.headers?.get("Retry-After");
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(raw);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return undefined;
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new RankboxApiError(0, "Request cancelled."));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new RankboxApiError(0, "Request cancelled."));
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
