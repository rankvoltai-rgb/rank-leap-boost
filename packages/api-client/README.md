# @rankvolt/api-client

Typed, zero-dependency client for the Rankvolt public API (`/api/public/v1/*`).
Shared by the Framer, Webflow, and Shopify plugins so auth, response shapes,
retries, and timeouts live in one place.

## Usage

```ts
import { RankvoltClient } from "@rankvolt/api-client";

const rankvolt = new RankvoltClient({
  apiKey: "rv_live_…", // from dashboard → Integrations
  baseUrl: "https://rankvolt.top", // your app's origin
});

const who = await rankvolt.ping(); // { ok, service, brand_name }

// Incremental sync: keep the returned next_since for the next poll.
let cursor: string | undefined;
const page = await rankvolt.listArticles({ since: cursor, limit: 50 });
cursor = page.next_since ?? cursor;

const article = await rankvolt.getArticle(page.articles[0].id);
```

Errors throw `RankvoltApiError` (`status`, `message`). Transient `5xx`/`429`
responses retry automatically.

## Build

```bash
npm install && npm run build
```
