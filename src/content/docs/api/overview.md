---
title: API overview
nav_title: Overview
description: The Rankbox REST API lets your site pull finished articles and report where each one went live. Base URL, conventions, endpoints and a first request.
order: 1
updated: 2026-10-02
---

The Rankbox REST API is how a website gets its articles out of Rankbox. Your code asks for the finished articles of one site, puts them into your CMS or build, and tells Rankbox the live URL of each one. Use it for any stack that Rankbox has no ready-made connector for, or to build a connector of your own.

## What the API does

The API has two jobs:

1. **Deliver finished articles.** Every article in the **Published** view of **Dashboard → Articles** is available as JSON, with the body in both Markdown and HTML, plus its slug, meta description, tags and SEO score. "Published" in Rankbox means the article is finished. It is live on your site only once your integration has put it there.
2. **Record where each article went live.** After your site publishes an article, you send its public URL back. Rankbox keeps it as the article's live URL, and the [backlink exchange](/docs/growth/backlink-exchange) uses that page to verify the links it places.

Publishing through the API is pull-based. Rankbox never calls your site: your integration asks for what changed, on a schedule or at build time. The API has no webhooks.

The API does not create, edit or delete articles, run research, change settings or control autopilot. Those happen in the dashboard. To use Rankbox's research tools from an AI assistant, see [the Rankbox MCP server](/docs/ai-tools/mcp-server).

## Base URL

Every endpoint lives under one base URL:

```text
https://rankbox.xyz/api/public/v1
```

Use HTTPS for every request. Each request carries an API key that belongs to exactly one of your sites, sent as `Authorization: Bearer <key>`. See [Authentication and API keys](/docs/api/authentication).

## Endpoints

The API has four operations on three paths.

| Method | Path | What it does | Reference |
| --- | --- | --- | --- |
| `GET` | `/ping` | Checks a key and returns the brand name, website and logo of the site it belongs to | [Ping endpoint](/docs/api/ping) |
| `GET` | `/articles` | Lists the site's finished articles, oldest change first, up to 100 per page | [List articles](/docs/api/articles#list-articles) |
| `GET` | `/articles/{id}` | Returns one finished article | [Retrieve an article](/docs/api/articles#retrieve-an-article) |
| `PATCH` | `/articles/{id}` | Records the live URL of an article | [Report a live URL](/docs/api/articles#report-a-live-url) |

Each path also answers `OPTIONS` for browser preflight requests. No other methods are supported.

## Your first request in 60 seconds

You need a Rankbox account with an active trial or plan. Keys can't be created without one.

1. Open **Dashboard → Integrations**.
2. In the connector library, choose **REST API** (under **Developer**).
3. Keep the suggested name or type your own, then click **Create key**.
4. Click **Copy key**. This is the only time the full key is shown.

Save the key in an environment variable and check it with the ping endpoint:

```bash title="cURL"
export RANKBOX_API_KEY="rv_live_xxxxxxxxxxxx"

curl https://rankbox.xyz/api/public/v1/ping \
  -H "Authorization: Bearer $RANKBOX_API_KEY"
```

A working key returns the site it belongs to:

```json
{
  "ok": true,
  "service": "Rankbox",
  "brand_name": "Example Co",
  "website_url": "https://www.example.com",
  "logo_url": null
}
```

Then fetch the first page of finished articles. Always send `limit`:

```bash title="cURL"
curl -G https://rankbox.xyz/api/public/v1/articles \
  -H "Authorization: Bearer $RANKBOX_API_KEY" \
  --data-urlencode "limit=100"
```

The response holds the articles, how many are in this page, and a cursor for the next request:

```json
{
  "articles": [
    {
      "id": "8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10",
      "slug": "how-to-price-a-saas-product-8f14e45f",
      "title": "How to Price a SaaS Product",
      "description": "A practical way to set SaaS prices: pick a value metric, test three tiers, and review prices every quarter.",
      "body_markdown": "# How to Price a SaaS Product\n\nPrice on the value your customer gets...",
      "body_html": "<h1>How to Price a SaaS Product</h1>\n<p>Price on the value your customer gets...</p>\n",
      "tags": ["pricing", "saas"],
      "seo_score": 92,
      "published_url": null,
      "published_at": "2026-09-30T14:03:11.204518+00:00",
      "updated_at": "2026-09-30T14:03:11.204518+00:00"
    }
  ],
  "count": 1,
  "next_since": "2026-09-30T14:03:11.204518+00:00"
}
```

Back in the dashboard, the last setup step, **See it connect**, changes from "Listening for your site's first request…" to "Connected — your site called in just now." The page checks for the first request every 5 seconds.

> [!IMPORTANT]
> Send `limit` on every call to `GET /articles`. When `limit` is missing, a page holds a single article, and paging with `next_since` can get stuck returning that same article. `limit=100` is the largest page the API returns.

## Request conventions

These rules apply to every endpoint.

- **Authentication.** Send the key in the `Authorization` header as `Bearer <key>`. An `X-Api-Key: <key>` header also works. Keys in the query string are not read.
- **Query strings must be URL-encoded.** The timestamps the API returns contain a `+` (as in `+00:00`). An unencoded `+` reaches the server as a space, the timestamp no longer parses, and the API ignores `since` without an error, so you get the oldest articles again. Build query strings with `URLSearchParams` in JavaScript, `params=` in Python requests, or `--data-urlencode` in cURL.
- **Request bodies are JSON.** Only `PATCH /articles/{id}` takes a body. Send a JSON object with `Content-Type: application/json`.
- **Ids are UUIDs.** Use article ids exactly as the API returns them.

## Response conventions

Every response body is a JSON object, sent with `Content-Type: application/json`.

| Convention | Detail |
| --- | --- |
| Field names | `snake_case`, for example `body_markdown`, `next_since`, `published_url` |
| List responses | `{ "articles": [...], "count": n, "next_since": "..." }` |
| Single-article responses | `{ "article": { ... } }` |
| Errors | `{ "error": "message" }`, plus `"code"` on a 402. See [Errors](/docs/api/errors) |
| Values that may be absent | `null` for `published_url`, `brand_name`, `website_url`, `logo_url` and `next_since`. Never omitted |
| Empty text and lists | `description` is `""` and `tags` is `[]` when there is nothing to send |
| Numbers | `seo_score` and `count` are integers |

Parse responses tolerantly and ignore fields you don't recognise. Fields can be added to v1 responses over time.

## Timestamps

Every timestamp the API returns is ISO 8601 in UTC, with microsecond precision and an explicit offset:

```text
2026-09-30T14:03:11.204518+00:00
```

JavaScript's `Date`, Python's `datetime.fromisoformat` and most ISO 8601 parsers read this format directly.

When you send a timestamp, which only happens in the `since` parameter, any ISO 8601 date-time works. Always include `Z` or an offset. Rankbox reads the value to the millisecond and drops the extra digits, which affects cursor paging (see [How the cursor works](/docs/api/syncing#how-the-cursor-works)). A value that can't be parsed is ignored rather than rejected, so a malformed `since` returns articles from the beginning.

## Versioning

The API version is part of the path: `/api/public/v1`. Within v1, responses can gain fields. The ping endpoint gained `website_url` and `logo_url` this way in September 2026. Write your parser so an extra field never breaks it, and don't depend on the order of keys in a JSON object.

## CORS

Every response, including errors, carries these headers, and an `OPTIONS` request to any endpoint returns `204 No Content` with the same set:

| Header | Value |
| --- | --- |
| `Access-Control-Allow-Origin` | `*` |
| `Access-Control-Allow-Methods` | `GET, PATCH, OPTIONS` |
| `Access-Control-Allow-Headers` | `Content-Type, Authorization, X-Api-Key` |
| `Access-Control-Max-Age` | `86400` |

The open CORS policy means browser code on any origin can call the API, which is what lets a tool that runs inside a browser editor, such as the Rankbox plugin for Framer, reach it. It is not an invitation to put a key in a public web page: anyone who opens the page can copy the key. Keep keys on a server wherever you can. See [Store keys safely](/docs/api/authentication#store-keys-safely).

## Idempotency and retries

`GET` requests never change anything, so you can repeat them freely.

`PATCH /articles/{id}` sets the article's live URL to the value you send. Sending the same URL twice leaves the article in the same state, so a `PATCH` is safe to retry after a timeout or a network error. There are no idempotency keys.

One side effect matters: every successful `PATCH` moves the article's `updated_at` forward, even when the URL didn't change. The article then reappears in your next incremental sync. Only send a `PATCH` when the URL you want differs from the article's current `published_url`, and detect content changes with a hash rather than `updated_at`. [Syncing articles reliably](/docs/api/syncing) shows both.

## Limits at a glance

| Limit | Value |
| --- | --- |
| Articles per page | 1 to 100, set with `limit` (send it every time) |
| Requests per IP address | 300 per one-minute window |
| Requests per Rankbox account | 120 per one-minute window, across all keys and sites |
| Sites per key | 1 |
| Key lifetime | No expiry. A key works until it is revoked, and only while its site is active on a trial or plan |

Details are in [Rate limits](/docs/api/rate-limits) and [Authentication and API keys](/docs/api/authentication).

## Related

- [Authentication and API keys](/docs/api/authentication): create, rotate and store keys.
- [Articles endpoints](/docs/api/articles): the full reference for the Article object and every parameter.
- [Syncing articles reliably](/docs/api/syncing): cursors, deletions, change detection and a complete sync loop.
- [Build a CMS integration](/docs/api/build-an-integration): the step-by-step guide to a production integration.
- [Any website, with the REST API](/docs/publishing/custom-sites): publishing to a custom site without writing a full integration.
