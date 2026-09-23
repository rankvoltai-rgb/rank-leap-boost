# @rankbox/api-client

Typed, zero-dependency client for the Rankbox public API (`/api/public/v1/*`).
Shared by the Framer, Webflow, and Shopify plugins so auth, response shapes,
retries, and timeouts live in one place.

A key is scoped to **one site**, not a whole account.

## Usage

```ts
import { RankboxClient } from "@rankbox/api-client";

const rankbox = new RankboxClient({
  apiKey: "rv_live_…", // from dashboard → Integrations
  baseUrl: "https://rankbox.xyz", // override for staging
});

const who = await rankbox.ping(); // { ok, service, brand_name, website_url?, logo_url? }

// Incremental sync: keep the returned next_since for the next poll.
let cursor: string | null = null;
const page = await rankbox.listArticles({ since: cursor, limit: 100 });
cursor = page.next_since ?? cursor;

const article = await rankbox.getArticle(page.articles[0].id);

// Report where a plugin published an article. The server rejects a URL that
// isn't on the site's own domain with a 400, so probe with one before
// reporting a whole library.
await rankbox.reportPublished(
  article.id,
  "https://brightloop.app/blog/how-to-price-a-saas-product-a1b2c3d4",
);
```

## Errors

Everything throws `RankboxApiError` with:

| Field          | Meaning                                                          |
| -------------- | ---------------------------------------------------------------- |
| `status`       | HTTP status, or `0` for a network failure or a cancelled request |
| `message`      | The server's own message where there is one                      |
| `code`         | Machine-readable body code — `"subscription_required"` on a 402  |
| `retryAfterMs` | Parsed from `Retry-After` on a 429                               |

Branch on `status` and `code`, never on `message` text.

`5xx` and network blips retry twice with a short backoff. A `429` also retries,
but backs off in **seconds** — the API's rate limit is a 60-second fixed window,
so a sub-second retry is guaranteed to fail again. Definitive `4xx` responses
never retry.

Every method takes an optional `AbortSignal` as its last argument, composed with
the client's own timeout, so long runs stay cancellable.

## Build

```bash
npm install && npm run build
```
