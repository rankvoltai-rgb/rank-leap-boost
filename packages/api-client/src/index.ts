/**
 * @rankvolt/api-client
 *
 * Zero-dependency, framework-agnostic client for the Rankvolt public API
 * (`/api/public/v1/*`). Shared by every Rankvolt CMS plugin (Framer, Webflow,
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
  published_at: string;
  updated_at: string;
}

export interface PingResult {
  ok: boolean;
  service: string;
  brand_name: string | null;
}

export interface ArticlesPage {
  articles: PublishedArticle[];
  count: number;
  /** Pass back as `since` on the next poll to fetch only newer articles. */
  next_since: string | null;
}

export interface RankvoltClientOptions {
  /** A Rankvolt API key (starts with `rv_live_`). Generate one in dashboard → Integrations. */
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

export class RankvoltApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "RankvoltApiError";
  }
}

const DEFAULT_BASE_URL = "https://rankvolt.top";

export class RankvoltClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly retries: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: RankvoltClientOptions) {
    if (!options.apiKey) throw new Error("RankvoltClient requires an `apiKey`.");
    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? 20_000;
    this.retries = options.retries ?? 2;
    const f = options.fetch ?? (globalThis.fetch as typeof fetch | undefined);
    if (!f) throw new Error("No fetch implementation available — pass `fetch` in options.");
    this.fetchImpl = f;
  }

  /** Validate the key and return the connected brand. Use this on plugin setup. */
  ping(): Promise<PingResult> {
    return this.get<PingResult>("/api/public/v1/ping");
  }

  /** List the account's finished articles, newest last. Use `since` for incremental sync. */
  listArticles(options: { since?: string; limit?: number } = {}): Promise<ArticlesPage> {
    const params = new URLSearchParams();
    if (options.since) params.set("since", options.since);
    if (options.limit) params.set("limit", String(options.limit));
    const query = params.toString();
    return this.get<ArticlesPage>(`/api/public/v1/articles${query ? `?${query}` : ""}`);
  }

  /** Fetch a single finished article by id. */
  async getArticle(id: string): Promise<PublishedArticle> {
    const { article } = await this.get<{ article: PublishedArticle }>(
      `/api/public/v1/articles/${encodeURIComponent(id)}`,
    );
    return article;
  }

  private async get<T>(path: string): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.retries; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${this.apiKey}` },
          signal: controller.signal,
        });

        if ((response.status >= 500 || response.status === 429) && attempt < this.retries) {
          lastError = new RankvoltApiError(response.status, `HTTP ${response.status}`);
          await delay(300 * (attempt + 1));
          continue;
        }

        const payload = (await response.json().catch(() => null)) as
          | (T & { error?: string })
          | { error: string }
          | null;

        if (!response.ok) {
          const message =
            payload && typeof payload === "object" && "error" in payload && payload.error
              ? payload.error
              : `Request failed (HTTP ${response.status}).`;
          throw new RankvoltApiError(response.status, message);
        }
        if (!payload) {
          throw new RankvoltApiError(response.status, "Malformed API response.");
        }
        return payload as T;
      } catch (err) {
        lastError = err;
        // Definitive 4xx errors shouldn't be retried.
        if (err instanceof RankvoltApiError && err.status >= 400 && err.status < 500) throw err;
        if (attempt >= this.retries) break;
        await delay(300 * (attempt + 1));
      } finally {
        clearTimeout(timer);
      }
    }
    if (lastError instanceof RankvoltApiError) throw lastError;
    throw new RankvoltApiError(
      0,
      lastError instanceof Error ? lastError.message : "Network request failed.",
    );
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
