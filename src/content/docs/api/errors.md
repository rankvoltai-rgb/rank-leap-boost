---
title: Errors
description: Every error the Rankbox REST API returns: the JSON error format, each status code and its exact message, the causes, and how your integration should respond.
order: 6
updated: 2026-10-02
---

When a request fails, the Rankbox REST API returns an HTTP status code and a small JSON body that says what went wrong. This page lists every status the API can return, the exact message for each, what causes it, and what your integration should do.

## Error format

Every error body is a JSON object with an `error` string. A `402` also carries a machine-readable `code`:

```json
{
  "error": "This site isn't active on a Rankbox plan, so it can't sync articles. Check the plan, and the site in Studio, at https://rankbox.xyz/dashboard/billing.",
  "code": "subscription_required"
}
```

| Field | Type | Present | Description |
| --- | --- | --- | --- |
| `error` | string | Always | A human-readable message, written to be shown to the person using your integration |
| `code` | string | Only on `402` | `subscription_required` |

Error responses use `Content-Type: application/json` and carry the same CORS headers as successful ones, so browser code can read them.

Branch your logic on the HTTP status and on `code`. Show `error` to people, but don't match on its wording in code: messages can be reworded.

## Status codes at a glance

| Status | `code` | Returned by | Cause | Retry? |
| --- | --- | --- | --- | --- |
| `400` | none | `PATCH /articles/{id}` | Missing, unsafe or off-domain `published_url` | No |
| `401` | none | All endpoints | Missing, malformed, unknown or revoked API key | No |
| `402` | `subscription_required` | All endpoints | The key's site isn't active on a trial or plan | No, until the plan is fixed |
| `404` | none | `GET` and `PATCH /articles/{id}` | No finished article with that id on the key's site | No |
| `429` | none | All endpoints | Too many requests in the current minute | Yes, in the next minute |
| `500` | none | All endpoints | Server error, or an article id that isn't a UUID | Yes, with backoff |

The API checks requests in this order: the per-IP rate limit, then the key and plan, then the per-account rate limit, then the request itself. So a request with a bad key and a bad body gets `401`, not `400`.

## 400 Bad request

Only `PATCH /articles/{id}` returns `400`. It means the `published_url` in the body can't be accepted. Three messages are possible:

| Message | Cause | Fix |
| --- | --- | --- |
| `Send { published_url } — the article's live URL.` | No body, a body that isn't JSON, no `published_url` field, a non-string value, or an empty string | Send `{"published_url": "https://..."}` with `Content-Type: application/json` |
| `published_url is not a public http(s) URL.` | A scheme other than `http` or `https`, an unparseable URL, or a host that is `localhost`, a private or reserved IP address, or a local-only name (such as one ending in `.local` or `.internal`) | Report the page's public address |
| `published_url must be on your own site (example.com).` | The URL's host isn't on the site's website domain or its verified backlink exchange domain. The message lists the accepted domains | Publish the article on that domain, or correct **Website** in **Dashboard → Settings → Your brand** |

When the site has neither a website nor a verified exchange domain, the third message reads `published_url must be on your own site (set your website in Settings).`

A leading `www.` is ignored and subdomains are accepted, so `https://blog.example.com/...` passes for `example.com`. A site still on a platform's staging address, such as a `.framer.website` or `.webflow.io` subdomain, fails the check until it publishes on its own domain.

How to handle it: don't retry. A domain mismatch affects every article, so stop reporting after the first `400` and tell the person what to fix, quoting the domains from the message.

## 401 Unauthorized

```json
{
  "error": "Invalid or missing API key. Pass it as 'Authorization: Bearer <key>'."
}
```

Rankbox doesn't accept the key. Causes:

- No `Authorization: Bearer` or `X-Api-Key` header was sent.
- The value doesn't start with `rv_live_`, for example because it was copied with a character missing or an extra one.
- The key doesn't exist, or it was revoked in **Dashboard → Integrations**.

How to handle it: don't retry. Show a "reconnect" state and ask the person for a new key from **Dashboard → Integrations**. A `401` never means the site has no articles: never delete content after one. See [Authentication and API keys](/docs/api/authentication).

## 402 Subscription required

```json
{
  "error": "This site isn't active on a Rankbox plan, so it can't sync articles. Check the plan, and the site in Studio, at https://rankbox.xyz/dashboard/billing.",
  "code": "subscription_required"
}
```

The key is valid, but the site it belongs to can't sync right now. Any of these causes it:

- The account has no trial or plan.
- The trial's card check failed.
- A payment failed more than 48 hours ago and hasn't been fixed.
- The plan was cancelled and its paid period has ended.
- The site is an extra [Studio](/docs/account/studio) site that was removed or archived, or the account is no longer on a paid plan. Studio sites need a paid plan; a trial covers only the plan's own site.

How to handle it: don't retry on a timer, and don't discard the key. Show the `error` text with a link to **Dashboard → Plan & Billing**. The same key works again the moment the site is active, and your saved cursor is still valid. In the dashboard, the **Integrations** page shows "Syncing is paused" while this lasts. See [Billing, invoices and cancellation](/docs/account/billing).

## 404 Not found

```json
{
  "error": "Article not found"
}
```

Returned by `GET /articles/{id}` and `PATCH /articles/{id}` when the key's site has no finished article with that id. The article was deleted, it isn't finished, or the id belongs to another site.

How to handle it: skip the article. During a batch of live-URL reports, a `404` usually means the article was deleted after your last sync, so carry on with the rest. Your next full walk removes it from your CMS. `GET /articles` never returns `404`; a site with no finished articles gets an empty list.

On `PATCH`, the URL is validated before the article is looked up, so an unacceptable URL returns `400` even when the id doesn't exist.

## 429 Too many requests

```json
{
  "error": "Rate limit exceeded. Slow down and retry shortly."
}
```

The caller's IP address made more than 300 requests, or the Rankbox account made more than 120, in the current one-minute window. The response has no `Retry-After` header and no rate-limit headers.

How to handle it: wait until the next clock minute starts, plus a second, then retry. Retrying sooner fails, because the window is a fixed minute. Spread out live-URL reports and keep `limit=100` so you need fewer requests. See [Rate limits](/docs/api/rate-limits).

## 500 Internal error

```json
{
  "error": "Internal error"
}
```

Something failed on Rankbox's side while handling the request. It can also mean an article id in the path isn't a valid UUID, which the API doesn't check before querying.

How to handle it: retry with exponential backoff, for example after 0.5, 1 and 2 seconds. Check that the id in the path is a UUID taken from an API response. If `500`s persist for a valid request, contact [support](/docs/help/support) with the time of the request and the endpoint.

## Handle errors in code

A pattern that covers every status:

```ts title="TypeScript"
async function rankbox<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://rankbox.xyz/api/public/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.RANKBOX_API_KEY}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (res.ok) return (await res.json()) as T;

  const body = (await res.json().catch(() => null)) as { error?: string; code?: string } | null;
  const message = body?.error ?? `HTTP ${res.status}`;

  switch (true) {
    case res.status === 400:
      throw new Error(`Rejected: ${message}`); // fix the URL; don't retry
    case res.status === 401:
      throw new Error("Reconnect: the Rankbox key is invalid or revoked.");
    case res.status === 402 || body?.code === "subscription_required":
      throw new Error(message); // link to https://rankbox.xyz/dashboard/billing
    case res.status === 404:
      throw new Error("Not found: skip this article.");
    case res.status === 429:
      throw new Error("Rate limited: retry after the next minute starts.");
    default:
      throw new Error(`Rankbox error ${res.status}: ${message}`); // retry with backoff
  }
}
```

For a complete version with retries built in, see [the reference sync loop](/docs/api/syncing#a-reference-sync-loop-in-typescript).

## Related

- [Authentication and API keys](/docs/api/authentication): fixing `401` and `402`.
- [Rate limits](/docs/api/rate-limits): avoiding `429`.
- [Articles endpoints](/docs/api/articles): the validation rules behind each `400`.
- [Live URLs and verification](/docs/publishing/live-urls): why live URLs must be on your own domain.
- [Troubleshooting](/docs/help/troubleshooting): fixes for problems outside the API.
