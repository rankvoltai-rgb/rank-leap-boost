---
title: TypeScript client and plugin starter
nav_title: Client library
description: The TypeScript client behind Rankbox's own Framer plugin: methods, errors, retry rules, a copy for your project, and the plugin starter it builds on.
order: 8
updated: 2026-10-02
---

Rankbox's own plugin code talks to the REST API through one small TypeScript client, `@rankbox/api-client`. It wraps the four operations, types every response, and handles timeouts, retries and errors. This page documents its API, gives you the full source to copy into your project, and describes the plugin starter that Rankbox's CMS plugins are built from.

## Get the client

The client is not published to the npm registry, so `npm install @rankbox/api-client` won't find it. It is a single TypeScript file with no dependencies, and its complete source is at the end of this page, in [The client source](#the-client-source).

1. Copy the source into your project, for example as `rankbox-client.ts`.
2. Import from that file.

```ts title="TypeScript"
import { MAX_PAGE_SIZE, RankboxApiError, RankboxClient } from "./rankbox-client";
```

Requirements:

- TypeScript 5 or any bundler that strips types. The code targets ES2020 or later.
- A global `fetch`: Node 18 or later, modern browsers, Deno and Bun all have one. Elsewhere, pass your own with the `fetch` option.

The client is the one the Rankbox plugin for Framer and the plugin starter use. Use it as is, or as a reference for a client in another language.

## Create a client

```ts title="TypeScript"
const rankbox = new RankboxClient({
  apiKey: process.env.RANKBOX_API_KEY!, // rv_live_...
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | string | Required | A Rankbox API key. Whitespace at either end is trimmed. The constructor throws if it is empty |
| `baseUrl` | string | `https://rankbox.xyz` | The API origin, without `/api/public/v1`. Trailing slashes are removed |
| `timeoutMs` | number | `20000` | Timeout for each attempt, in milliseconds |
| `retries` | number | `2` | Extra attempts after a network error, a `5xx` or a `429`. `2` means up to three attempts |
| `fetch` | function | global `fetch` | A custom `fetch` implementation. The constructor throws if neither exists |

The client sends the key as `Authorization: Bearer <key>` on every request.

## Methods

Every method returns a promise and takes an optional `AbortSignal` as its last argument.

| Method | Calls | Resolves to |
| --- | --- | --- |
| `ping(signal?)` | `GET /ping` | `PingResult`: `ok`, `service`, `brand_name`, `website_url`, `logo_url` |
| `listArticles({ since, limit }, signal?)` | `GET /articles` | `ArticlesPage`: `articles`, `count`, `next_since` |
| `getArticle(id, signal?)` | `GET /articles/{id}` | The `PublishedArticle`, unwrapped from `{ article }` |
| `reportPublished(id, publishedUrl, signal?)` | `PATCH /articles/{id}` | The updated `PublishedArticle`, unwrapped |

The module also exports `MAX_PAGE_SIZE` (100), the `RankboxApiError` class, the `backoffMs` and `parseRetryAfter` helpers, and the types `PublishedArticle`, `PingResult`, `ArticlesPage` and `RankboxClientOptions`.

### Check a key

```ts title="TypeScript"
const site = await rankbox.ping();
console.log(`Connected to ${site.brand_name ?? "your Rankbox site"}`);
```

### List articles

`listArticles` sends `since` only when it is set, so passing `null` on a first run is safe. It sends `limit` only when it is set, and the API returns one-article pages when `limit` is missing, so always pass `MAX_PAGE_SIZE`:

```ts title="TypeScript"
import type { PublishedArticle } from "./rankbox-client";

let cursor: string | null = null; // load your saved cursor here
const byId = new Map<string, PublishedArticle>();

for (;;) {
  const page = await rankbox.listArticles({ since: cursor, limit: MAX_PAGE_SIZE });
  for (const article of page.articles) byId.set(article.id, article); // the boundary article repeats
  if (page.count < MAX_PAGE_SIZE) {
    cursor = page.next_since ?? cursor;
    break;
  }
  if (!page.next_since || page.next_since === cursor) break; // stalled: see Syncing
  cursor = page.next_since;
}
```

The paging rules behind this loop are in [Syncing articles reliably](/docs/api/syncing#how-the-cursor-works).

### Get one article

```ts title="TypeScript"
const article = await rankbox.getArticle("8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10");
```

The id is URL-encoded for you.

### Report a live URL

```ts title="TypeScript"
try {
  await rankbox.reportPublished(
    article.id,
    "https://www.example.com/blog/how-to-price-a-saas-product-8f14e45f",
  );
} catch (err) {
  if (err instanceof RankboxApiError && err.status === 400) {
    // The URL isn't on the site's own domain: stop reporting and tell the person.
  } else throw err;
}
```

## Errors

Every failure throws a `RankboxApiError`:

| Property | Type | Meaning |
| --- | --- | --- |
| `status` | number | The HTTP status, or `0` for a network failure or a cancelled request |
| `message` | string | The API's `error` message when there is one, otherwise a generic message such as "Request failed (HTTP 502)." |
| `code` | string or undefined | The body's `code`: `"subscription_required"` on a `402` |
| `retryAfterMs` | number or undefined | Parsed from a `Retry-After` header. The API doesn't send one today, so this is `undefined` |

Branch on `status` and `code`, never on `message`:

```ts title="TypeScript"
try {
  await rankbox.ping();
} catch (err) {
  if (!(err instanceof RankboxApiError)) throw err;
  if (err.status === 401) askForNewKey();
  else if (err.status === 402 || err.code === "subscription_required") showBilling(err.message);
  else if (err.status === 429) scheduleRetryAfterNextMinute();
  else if (err.status === 0) showOffline();
  else throw err;
}
```

A `200` response that isn't JSON throws with the message "Malformed API response."

## Retries and timeouts

The client retries some failures on its own, up to `retries` times:

| Failure | Retried | Wait before each retry |
| --- | --- | --- |
| Network error or attempt timeout | Yes | 300 ms, then 600 ms |
| `5xx` | Yes | 300 ms, then 600 ms |
| `429` | Yes | 2 seconds, then 5 seconds, or the `Retry-After` value capped at 60 seconds when the API sends one |
| Any other `4xx` | No | Thrown immediately |
| Cancelled by your `AbortSignal` | No | Thrown immediately as status `0`, "Request cancelled." |

Two things follow from the API's [one-minute rate-limit window](/docs/api/rate-limits):

- **A `429` usually still reaches you.** Two retries over about seven seconds rarely outlast a fixed one-minute window. Catch the error and run the job again after the next minute starts.
- **Don't wrap the client in a tight retry loop.** Requests rejected with `429` still count toward the window.

`timeoutMs` applies to each attempt separately, so with the defaults a call can take up to three times 20 seconds plus the waits. Pass an `AbortSignal` to cap the total:

```ts title="TypeScript"
const page = await rankbox.listArticles(
  { since: cursor, limit: MAX_PAGE_SIZE },
  AbortSignal.timeout(45_000),
);
```

## What the client leaves to you

The client is deliberately thin. Your code handles:

- **Paging.** `listArticles` returns one page. Loop with `next_since` as shown above.
- **The `published=false` filter.** `listArticles` doesn't expose it. Call `GET /articles?published=false&limit=100` with `fetch` when you need it.
- **Deduplication and change detection.** See [Detect changes with a content hash](/docs/api/syncing#detect-changes-with-a-content-hash).
- **Pacing bulk reports.** Space `reportPublished` calls at least 500 milliseconds apart to stay under 120 requests a minute.

## The plugin starter

Rankbox's CMS plugins start from a shared starter: a small React and Vite app that handles the parts every platform has in common. The starter is part of Rankbox's own plugin code and isn't distributed as a package, so this section describes its structure for you to reproduce.

It does three things:

1. **Connect.** A screen asks for the **Rankbox API key** and an **API base URL** (default `https://rankbox.xyz`). Clicking **Connect** first checks locally that the key starts with `rv_live_`, showing "Enter a valid Rankbox API key (starts with rv_live_)." if not. It then calls `ping()`, saves the key and base URL, and shows the returned brand name.
2. **List.** It loads the site's finished articles with `listArticles({ limit: 100 })` and shows each title, SEO score and description with a checkbox.
3. **Publish.** A **Publish** button passes the selected articles to a `publish()` function. In the starter it is a stub; each platform's plugin replaces it with that platform's CMS calls.

The starter keeps its connection in the browser's local storage, because a plugin runs inside the platform's editor in the browser:

| Storage key | Holds |
| --- | --- |
| `rankbox.apiKey` | The API key |
| `rankbox.baseUrl` | The API base URL |
| `rankbox.since` | The last `next_since`, for incremental syncs |

**Disconnect** removes the key. The connection helpers are this small:

```ts title="TypeScript"
import { RankboxClient } from "./rankbox-client";

const KEY_STORAGE = "rankbox.apiKey";
const BASE_STORAGE = "rankbox.baseUrl";
const CURSOR_STORAGE = "rankbox.since";

export const DEFAULT_BASE_URL = "https://rankbox.xyz";

export function loadConnection(): { apiKey: string; baseUrl: string } {
  return {
    apiKey: localStorage.getItem(KEY_STORAGE) ?? "",
    baseUrl: localStorage.getItem(BASE_STORAGE) ?? DEFAULT_BASE_URL,
  };
}

export function saveConnection(apiKey: string, baseUrl: string): void {
  localStorage.setItem(KEY_STORAGE, apiKey.trim());
  localStorage.setItem(BASE_STORAGE, baseUrl.trim() || DEFAULT_BASE_URL);
}

export function clearConnection(): void {
  localStorage.removeItem(KEY_STORAGE);
}

export function loadCursor(): string | undefined {
  return localStorage.getItem(CURSOR_STORAGE) ?? undefined;
}

export function saveCursor(since: string | null): void {
  if (since) localStorage.setItem(CURSOR_STORAGE, since);
}

export function makeClient(apiKey: string, baseUrl: string): RankboxClient {
  return new RankboxClient({ apiKey, baseUrl });
}
```

The starter is a skeleton, not a finished plugin. It loads one page of up to 100 articles and stops, and it has no ledger, deletion handling or live-URL reporting. The Rankbox plugin for Framer has all of these. [Build a CMS integration](/docs/api/build-an-integration) walks through each addition, and local storage is only the right place for a key in a tool that runs in the person's own browser: see [Store keys safely](/docs/api/authentication#store-keys-safely).

## The client source

The complete client, version 0.1.0. Save it as `rankbox-client.ts`.

```ts title="rankbox-client.ts"
// rankbox-client.ts: the Rankbox API client (@rankbox/api-client 0.1.0) in one file.
// Zero dependencies. Needs a global fetch (Node 18+, browsers, Deno, Bun) or pass one in.

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
  /** API origin. Defaults to https://rankbox.xyz; override it to point at a test server. */
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
```

## Related

- [Syncing articles reliably](/docs/api/syncing): paging, change detection and a complete sync loop built on plain `fetch`.
- [Build a CMS integration](/docs/api/build-an-integration): from the starter to a production plugin.
- [Errors](/docs/api/errors): every status the client can surface.
- [Rate limits](/docs/api/rate-limits): why `429` needs a minute, not seconds.
- [Framer](/docs/publishing/framer): the Rankbox plugin built on this client.
