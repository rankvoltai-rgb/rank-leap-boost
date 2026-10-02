---
title: Articles endpoints
nav_title: Articles
description: Reference for GET /articles, GET /articles/{id} and PATCH /articles/{id}, with every parameter, the Article object, full examples and status codes.
order: 3
updated: 2026-10-02
---

The articles endpoints deliver a site's finished articles and record where each one went live. This page is the complete reference: the Article object, listing and paging, retrieving one article, reporting a live URL, and every status code each endpoint returns.

All three operations use the base URL `https://rankbox.xyz/api/public/v1` and an API key sent as `Authorization: Bearer <key>`. A key only ever sees its own site's articles. See [Authentication and API keys](/docs/api/authentication).

## Which articles the API returns

The API returns **finished** articles: the ones in the **Published** view of **Dashboard → Articles**. In Rankbox, "published" means the article is written and released for your site. It goes live on your site when your integration publishes it there.

These never appear in any articles endpoint:

- Ideas, scheduled articles, and articles that are still being written.
- Unpublished edits to a finished article. Edits reach the API when you click **Publish changes** in the editor. See [Editing articles](/docs/content/editor).
- Deleted articles. A deleted article disappears from every endpoint, with no tombstone. See [Full walk to detect deletions](/docs/api/syncing#full-walk-to-detect-deletions).
- Articles of any other site, including other sites on the same account.

## The Article object

Every endpoint returns articles in the same shape.

| Field | Type | Description |
| --- | --- | --- |
| `id` | string (UUID) | Permanent, unique id of the article. Use it as the article's key in your CMS |
| `slug` | string | URL slug built from the current title plus the first 8 characters of `id`, for example `how-to-price-a-saas-product-8f14e45f`. Changes when the title changes. See [How slugs are built](#how-slugs-are-built) |
| `title` | string | The article's title |
| `description` | string | The meta description. `""` when the article has none |
| `body_markdown` | string | The article body in Markdown, with Rankbox's writing notes removed. Usually starts with the title as a level-1 heading. See [What the body contains](#what-the-body-contains) |
| `body_html` | string | The same body rendered to HTML. Not sanitized. `""` when the body is empty |
| `tags` | array of strings | Topic tags. `[]` when there are none |
| `seo_score` | integer | Rankbox's SEO and GEO score for the article, from 0 to 100. See [The SEO and GEO score](/docs/content/scoring) |
| `published_url` | string or null | The live URL Rankbox has on file for the article. `null` until one is reported with `PATCH /articles/{id}` or recorded another way (see [Live URLs and verification](/docs/publishing/live-urls)) |
| `published_at` | string (timestamp) | Currently always equal to `updated_at`. It is not the date the article went live |
| `updated_at` | string (timestamp) | When the article last changed in Rankbox. Orders the list and drives `since` |

Timestamps are ISO 8601 in UTC with microseconds, such as `2026-09-30T14:03:11.204518+00:00`.

A complete article:

```json
{
  "id": "8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10",
  "slug": "how-to-price-a-saas-product-8f14e45f",
  "title": "How to Price a SaaS Product",
  "description": "A practical way to set SaaS prices: pick a value metric, test three tiers, and review prices every quarter.",
  "body_markdown": "# How to Price a SaaS Product\n\nPrice on the value your customer gets, not on your costs. Pick one value metric, test three tiers, and review prices every quarter.\n\n## Pick a value metric\n\nA value metric grows as the customer gets more out of the product.\n\n- Seats\n- Usage\n- Outcomes",
  "body_html": "<h1>How to Price a SaaS Product</h1>\n<p>Price on the value your customer gets, not on your costs. Pick one value metric, test three tiers, and review prices every quarter.</p>\n<h2>Pick a value metric</h2>\n<p>A value metric grows as the customer gets more out of the product.</p>\n<ul>\n<li>Seats</li>\n<li>Usage</li>\n<li>Outcomes</li>\n</ul>\n",
  "tags": ["pricing", "saas"],
  "seo_score": 92,
  "published_url": null,
  "published_at": "2026-09-30T14:03:11.204518+00:00",
  "updated_at": "2026-09-30T14:03:11.204518+00:00"
}
```

### What the body contains

`body_markdown` is the article as written in Rankbox, cleaned for a public page. `body_html` is that Markdown rendered with GitHub-flavored Markdown rules, where a single line break becomes `<br>`.

- **Writing notes are removed.** Rankbox's editor stores image suggestions such as `**[Image: …] (alt: "…")**` and internal-link placeholders such as `[anchor](#internal: target)`. The API drops the image suggestions and keeps only the anchor text of the placeholders. The body therefore contains no images: add your own in your CMS if your template needs them.
- **The title is usually the first line.** Most bodies start with the title as a level-1 heading (`# Title` in Markdown, `<h1>` in HTML). If your page template already shows `title` as the heading, remove that first heading before you save the body, or the title appears twice.
- **A body can include a video embed.** Some articles have a section headed `## Watch: …` containing a YouTube `<iframe>` and a plain link to the same video beneath it. Raw HTML in the Markdown passes through to `body_html` unchanged. If your CMS strips iframes, the link still carries the reference.
- **Links stay as written.** Source links and any link placed through the backlink exchange are ordinary links. Publish them without adding `rel="nofollow"`, `"sponsored"` or `"ugc"`: the exchange checks hosted links on your live page and counts those attributes as a failure. See [Backlink exchange](/docs/growth/backlink-exchange).

> [!WARNING]
> `body_html` is not sanitized. It can contain raw HTML from the Markdown, including `<iframe>` elements. Run it through your CMS's sanitizer or an allow-list before you render it.

### How slugs are built

Rankbox doesn't store a slug. It derives one from the current title on every response:

1. Lowercase the title and apply Unicode NFKD normalization.
2. Replace every run of characters other than `a`–`z` and `0`–`9` with a single `-`.
3. Trim leading and trailing hyphens and cut the result to 60 characters.
4. Append `-` and the first 8 characters of the article's `id`. A title with no usable characters becomes `article-` plus those 8 characters.

| Title | Slug |
| --- | --- |
| How to Price a SaaS Product | `how-to-price-a-saas-product-8f14e45f` |
| Résumé tips for 2026: what works? | `re-sume-tips-for-2026-what-works-0b3e5f7a` |

The second row shows an accented letter splitting a word, because the accent mark is removed as a separate character. The id suffix keeps slugs unique within a site, but retitling an article in Rankbox changes its slug. If the article is already live, store the slug you first published under and keep using it. See [Keep slugs stable](/docs/api/syncing#keep-slugs-stable).

### When the timestamps change

`updated_at` moves forward whenever Rankbox writes to the article, including:

- You click **Publish changes** on a finished article in the editor.
- Your integration, or another one, reports a live URL with `PATCH /articles/{id}`.
- Rankbox records a live URL for the article some other way.

Because a live-URL report changes `updated_at` without changing the content, `updated_at` alone can't tell you whether the content changed. Compare a hash of the fields you publish instead. `published_at` mirrors `updated_at`, so it moves at the same moments: don't display it as a publication date. Record the date your site first published the article in your own CMS.

## List articles

`GET /articles`

Returns a page of the site's finished articles, ordered by `updated_at` from oldest to newest.

### Query parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `limit` | integer | 1 when omitted | Articles per page. Values are cut to whole numbers and kept between 1 and 100. Send it on every call; `limit=100` is the most efficient |
| `since` | ISO 8601 timestamp | none | Return only articles whose `updated_at` is later than this time. Pass the `next_since` of your previous page. Read to the millisecond. A value that doesn't parse is ignored |
| `published` | `false` | none | `published=false` returns only articles with no live URL on file (`published_url` is `null`). Any other value is ignored |

The parameters combine. `?published=false&since=…&limit=100` pages through the articles that have no live URL yet.

> [!IMPORTANT]
> A missing or empty `limit` gives one article per page. A value that isn't a number at all, such as `limit=all`, gives 50. Values above 100 are treated as 100, and 0 or negative values as 1. Always send `limit=100`. With one-article pages, the cursor overlap described below returns the same article again and again, so paging never moves forward.

### Response

| Field | Type | Description |
| --- | --- | --- |
| `articles` | array of Article | This page, oldest change first |
| `count` | integer | The number of articles in this page, not the total |
| `next_since` | string or null | The `updated_at` of the last article in this page. When the page is empty, the `since` value you sent, unchanged, or `null` if you sent none |

There is no offset, page number or total count. You page forward by sending `next_since` back as `since`. A page with fewer articles than `limit` is the last one.

The cursor overlaps at the page boundary: `updated_at` has microseconds, but `since` is read to the millisecond, so the last article of one page usually comes back as the first article of the next. Treat articles as upserts keyed by `id`, and stop paging on a short page rather than an empty one. [How the cursor works](/docs/api/syncing#how-the-cursor-works) explains the details.

### Examples for listing

```bash title="cURL"
curl -G https://rankbox.xyz/api/public/v1/articles \
  -H "Authorization: Bearer $RANKBOX_API_KEY" \
  --data-urlencode "limit=100" \
  --data-urlencode "since=2026-09-30T14:03:11.204518+00:00"
```

```js title="JavaScript"
const url = new URL("https://rankbox.xyz/api/public/v1/articles");
url.searchParams.set("limit", "100");
if (cursor) url.searchParams.set("since", cursor); // URLSearchParams encodes the "+"

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${process.env.RANKBOX_API_KEY}` },
});
if (!res.ok) throw new Error(`Rankbox ${res.status}: ${(await res.json()).error}`);
const { articles, count, next_since } = await res.json();
```

```python title="Python"
import os
import requests

params = {"limit": 100}
if cursor:
    params["since"] = cursor  # requests encodes the "+"

res = requests.get(
    "https://rankbox.xyz/api/public/v1/articles",
    headers={"Authorization": f"Bearer {os.environ['RANKBOX_API_KEY']}"},
    params=params,
    timeout=20,
)
res.raise_for_status()
page = res.json()
articles, next_since = page["articles"], page["next_since"]
```

Example response, the last page of a walk:

```json
{
  "articles": [
    {
      "id": "8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10",
      "slug": "how-to-price-a-saas-product-8f14e45f",
      "title": "How to Price a SaaS Product",
      "description": "A practical way to set SaaS prices: pick a value metric, test three tiers, and review prices every quarter.",
      "body_markdown": "# How to Price a SaaS Product\n\nPrice on the value your customer gets, not on your costs. Pick one value metric, test three tiers, and review prices every quarter.\n\n## Pick a value metric\n\nA value metric grows as the customer gets more out of the product.\n\n- Seats\n- Usage\n- Outcomes",
      "body_html": "<h1>How to Price a SaaS Product</h1>\n<p>Price on the value your customer gets, not on your costs. Pick one value metric, test three tiers, and review prices every quarter.</p>\n<h2>Pick a value metric</h2>\n<p>A value metric grows as the customer gets more out of the product.</p>\n<ul>\n<li>Seats</li>\n<li>Usage</li>\n<li>Outcomes</li>\n</ul>\n",
      "tags": ["pricing", "saas"],
      "seo_score": 92,
      "published_url": null,
      "published_at": "2026-09-30T14:03:11.204518+00:00",
      "updated_at": "2026-09-30T14:03:11.204518+00:00"
    },
    {
      "id": "0b3e5f7a-1c2d-4e5f-8a9b-0c1d2e3f4a5b",
      "slug": "re-sume-tips-for-2026-what-works-0b3e5f7a",
      "title": "Résumé tips for 2026: what works?",
      "description": "What hiring managers say they read first, and how to structure a résumé around it.",
      "body_markdown": "# Résumé tips for 2026: what works?\n\n...",
      "body_html": "<h1>Résumé tips for 2026: what works?</h1>\n<p>...</p>\n",
      "tags": ["careers"],
      "seo_score": 88,
      "published_url": "https://www.example.com/blog/re-sume-tips-for-2026-what-works-0b3e5f7a",
      "published_at": "2026-10-01T09:12:44.871203+00:00",
      "updated_at": "2026-10-01T09:12:44.871203+00:00"
    }
  ],
  "count": 2,
  "next_since": "2026-10-01T09:12:44.871203+00:00"
}
```

## Retrieve an article

`GET /articles/{id}`

Returns one finished article of the key's site.

| Path parameter | Type | Description |
| --- | --- | --- |
| `id` | string (UUID) | The article's `id`, exactly as the API returned it |

The response wraps the article in an `article` field:

```bash title="cURL"
curl https://rankbox.xyz/api/public/v1/articles/8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10 \
  -H "Authorization: Bearer $RANKBOX_API_KEY"
```

```js title="JavaScript"
const id = "8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10";
const res = await fetch(
  `https://rankbox.xyz/api/public/v1/articles/${encodeURIComponent(id)}`,
  { headers: { Authorization: `Bearer ${process.env.RANKBOX_API_KEY}` } },
);
if (res.status === 404) {
  // Deleted in Rankbox, or not a finished article of this site.
}
const { article } = await res.json();
```

```python title="Python"
import os
import requests

article_id = "8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10"
res = requests.get(
    f"https://rankbox.xyz/api/public/v1/articles/{article_id}",
    headers={"Authorization": f"Bearer {os.environ['RANKBOX_API_KEY']}"},
    timeout=20,
)
if res.status_code == 404:
    pass  # deleted in Rankbox, or not a finished article of this site
res.raise_for_status()
article = res.json()["article"]
```

```json
{
  "article": {
    "id": "8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10",
    "slug": "how-to-price-a-saas-product-8f14e45f",
    "title": "How to Price a SaaS Product",
    "description": "A practical way to set SaaS prices: pick a value metric, test three tiers, and review prices every quarter.",
    "body_markdown": "# How to Price a SaaS Product\n\n...",
    "body_html": "<h1>How to Price a SaaS Product</h1>\n<p>...</p>\n",
    "tags": ["pricing", "saas"],
    "seo_score": 92,
    "published_url": null,
    "published_at": "2026-09-30T14:03:11.204518+00:00",
    "updated_at": "2026-09-30T14:03:11.204518+00:00"
  }
}
```

The API returns `404` with `{ "error": "Article not found" }` when no finished article with that id exists on the key's site: it was deleted, it isn't finished, or it belongs to another site. An id that isn't a UUID at all returns `500` with `{ "error": "Internal error" }`, so validate ids before you call if they come from user input.

Use this endpoint to refresh one article, for example from a "resync" button. To sync many articles, page through `GET /articles` instead: one list call returns up to 100 articles for the cost of one request.

## Report a live URL

`PATCH /articles/{id}`

Records the public URL where your site published an article. Rankbox stores it as the article's `published_url`, and the backlink exchange uses that page to verify links hosted in the article.

### Request body

Send a JSON object with `Content-Type: application/json`:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `published_url` | string | Yes | The absolute `https://` (or `http://`) URL of the article's live page on your site. Whitespace at either end is trimmed |

Any other field in the body is ignored. Send the full URL with its scheme: Rankbox stores the value as you send it.

### Validation rules

Rankbox checks the request in this order and stops at the first failure:

1. **The body has a `published_url`.** A missing body, invalid JSON, a non-string value or an empty string returns `400` with "Send { published_url } — the article's live URL."
2. **The URL is a public web address.** The scheme must be `http` or `https`, and the host can't be `localhost`, a private or reserved IP address, or a local-only name such as one ending in `.local`, `.internal`, `.lan`, `.localhost` or `.home.arpa`. Otherwise the API returns `400` with "published_url is not a public http(s) URL."
3. **The URL is on the site's own domain.** The host must match the **Website** set for this site in **Dashboard → Settings → Your brand**, or the domain the site verified in the backlink exchange. A leading `www.` is ignored on both sides, and subdomains match, so `blog.example.com` and `www.example.com` both pass for `example.com`. Otherwise the API returns `400` with "published_url must be on your own site (example.com)." naming the accepted domains, or "published_url must be on your own site (set your website in Settings)." when neither is set.
4. **The article is a finished article of the key's site.** Otherwise the API returns `404` with "Article not found".

Because the URL is checked before the article is looked up, a request with an off-domain URL for an id that doesn't exist returns `400`, not `404`.

### What a successful report changes

- `published_url` becomes the URL you sent, replacing any earlier value, including one entered by hand on the **Backlinks** page.
- Rankbox records that the URL came from an integration.
- `updated_at` and `published_at` move to the time of the request, so the article appears in your next incremental sync.
- The article no longer appears in `GET /articles?published=false`.

The API can't clear a live URL: an empty `published_url` is rejected. Sending the same URL again leaves the same value, so retrying a `PATCH` is safe, but each success moves `updated_at` again. Only report when the URL differs from the article's current `published_url`.

### Examples for reporting

```bash title="cURL"
curl -X PATCH https://rankbox.xyz/api/public/v1/articles/8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10 \
  -H "Authorization: Bearer $RANKBOX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"published_url": "https://www.example.com/blog/how-to-price-a-saas-product-8f14e45f"}'
```

```js title="JavaScript"
const res = await fetch(
  `https://rankbox.xyz/api/public/v1/articles/${encodeURIComponent(article.id)}`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.RANKBOX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ published_url: liveUrl }),
  },
);
const body = await res.json();
if (res.status === 400) throw new Error(body.error); // e.g. the URL isn't on your domain
if (!res.ok) throw new Error(`Rankbox ${res.status}: ${body.error}`);
const updated = body.article;
```

```python title="Python"
import os
import requests

res = requests.patch(
    f"https://rankbox.xyz/api/public/v1/articles/{article['id']}",
    headers={"Authorization": f"Bearer {os.environ['RANKBOX_API_KEY']}"},
    json={"published_url": live_url},  # sets Content-Type: application/json
    timeout=20,
)
if res.status_code == 400:
    raise RuntimeError(res.json()["error"])  # e.g. the URL isn't on your domain
res.raise_for_status()
updated = res.json()["article"]
```

The response is the updated article:

```json
{
  "article": {
    "id": "8f14e45f-ceea-4c8e-9a3b-2d1f6b7c9a10",
    "slug": "how-to-price-a-saas-product-8f14e45f",
    "title": "How to Price a SaaS Product",
    "description": "A practical way to set SaaS prices: pick a value metric, test three tiers, and review prices every quarter.",
    "body_markdown": "# How to Price a SaaS Product\n\n...",
    "body_html": "<h1>How to Price a SaaS Product</h1>\n<p>...</p>\n",
    "tags": ["pricing", "saas"],
    "seo_score": 92,
    "published_url": "https://www.example.com/blog/how-to-price-a-saas-product-8f14e45f",
    "published_at": "2026-10-02T08:41:07.552190+00:00",
    "updated_at": "2026-10-02T08:41:07.552190+00:00"
  }
}
```

A domain mismatch looks like this:

```json
{
  "error": "published_url must be on your own site (example.com)."
}
```

> [!TIP]
> A domain mismatch affects every article on the site at once. When you report a batch, send one article first and stop if it returns `400`, instead of sending hundreds of requests that will all fail. Comparing your site's host with the `website_url` from [`GET /ping`](/docs/api/ping) catches most mismatches before the first request.

## Status codes by endpoint

| Status | `GET /articles` | `GET /articles/{id}` | `PATCH /articles/{id}` | Meaning |
| --- | --- | --- | --- | --- |
| `200` | Yes | Yes | Yes | Success |
| `204` | `OPTIONS` | `OPTIONS` | `OPTIONS` | CORS preflight, no body |
| `400` | No | No | Yes | Missing, unsafe or off-domain `published_url` |
| `401` | Yes | Yes | Yes | Missing, malformed, unknown or revoked key |
| `402` | Yes | Yes | Yes | The key's site isn't active on a trial or plan (`code: subscription_required`) |
| `404` | No | Yes | Yes | No finished article with that id on the key's site |
| `429` | Yes | Yes | Yes | Rate limit exceeded |
| `500` | Yes | Yes | Yes | Server error, or an article id that isn't a UUID |

`GET /articles` never returns `404`: a site with no finished articles returns `200` with an empty `articles` array. Exact messages and handling for every status are in [Errors](/docs/api/errors).

## Related

- [Syncing articles reliably](/docs/api/syncing): cursor semantics, deletions, change detection and a complete sync loop.
- [Errors](/docs/api/errors): every error body and what to do about it.
- [Rate limits](/docs/api/rate-limits): how many requests you can make per minute.
- [Live URLs and verification](/docs/publishing/live-urls): what Rankbox does with the URLs you report.
- [Build a CMS integration](/docs/api/build-an-integration): mapping these fields into a CMS.
