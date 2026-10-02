---
title: Rate limits
description: The Rankbox API's request limits: 300 per IP address and 120 per account in each one-minute window, what counts, the 429 response, and how to stay under them.
order: 7
updated: 2026-10-02
---

The Rankbox REST API limits how many requests arrive in each minute, per IP address and per Rankbox account. A normal integration stays far below both. This page gives the exact limits, what counts toward them, what a limited request looks like, and how to pace bulk work.

## The limits

| Limit | Default | Counted per | Counts |
| --- | --- | --- | --- |
| Per IP address | 300 requests per window | The caller's IP address | Every `GET` and `PATCH` request, before the key is checked |
| Per account | 120 requests per window | The Rankbox account that owns the key | Every request whose key and plan are accepted, across all of the account's keys and sites |

A window is one clock minute: it starts at second `:00` of each minute (UTC) and lasts 60 seconds. These are the current defaults for every account. Build your integration to handle a `429` whatever the numbers are.

## How the window works

Rankbox uses fixed windows, not a rolling one. Each request adds one to the counter for the current minute. When the counter passes the limit, every further request in that minute gets `429`. At the start of the next minute, the counter starts again from zero.

Two consequences:

- **Waiting a few seconds rarely helps.** A request limited at `:20` will be limited at `:25` too. The earliest time a retry can succeed is the start of the next minute.
- **Bursts can straddle a boundary.** 120 requests at `:59` and 120 more at `:00` both succeed, because they fall in different windows. Don't rely on it: pace your requests evenly instead.

## What counts toward each limit

**The per-IP limit** counts every `GET` and `PATCH` that reaches the API from an address, whatever the key, including requests rejected with `401` or `402`. It protects the API from floods of bad keys. `OPTIONS` preflight requests don't count. Integrations behind one shared outbound IP, such as several jobs on the same server, share this budget.

**The per-account limit** counts every request made with any key of the account, once the key and the site's plan have been accepted. All keys and all sites share it, including every [Studio](/docs/account/studio) site. Three sites syncing every minute and a bulk live-URL report all draw on the same 120.

Requests that are themselves rejected with `429` still count in that minute's window. A client that retries in a tight loop keeps itself limited until the minute ends.

## The 429 response

```json
{
  "error": "Rate limit exceeded. Slow down and retry shortly."
}
```

The status is `429`, and the body is the same for both limits. The response has no `Retry-After` header and no `X-RateLimit-*` headers, so your client can't read the remaining budget. Compute the wait from the clock instead:

```ts title="TypeScript"
/** Milliseconds until one second after the next minute starts. */
function untilNextWindow(now = Date.now()): number {
  return 60_000 - (now % 60_000) + 1_000;
}

async function withRateLimitRetry(send: () => Promise<Response>, attempts = 3): Promise<Response> {
  for (let attempt = 0; ; attempt += 1) {
    const res = await send();
    if (res.status !== 429 || attempt >= attempts) return res;
    await new Promise((resolve) => setTimeout(resolve, untilNextWindow()));
  }
}
```

```python title="Python"
import time

def until_next_window() -> float:
    """Seconds until one second after the next minute starts."""
    return 60 - (time.time() % 60) + 1

def with_rate_limit_retry(send, attempts=3):
    for attempt in range(attempts + 1):
        res = send()
        if res.status_code != 429 or attempt == attempts:
            return res
        time.sleep(until_next_window())
```

## Stay under the limits

Most integrations never see a `429`. These habits keep it that way:

- **Use the biggest page.** Send `limit=100` on every list call. Without it, a page holds one article, so a walk costs one request per article at best. Worse, a one-article page usually repeats the article at the cursor, so a cursor loop without `limit` can stop advancing altogether.
- **Poll at a sensible interval.** Every few minutes to once a day is plenty for articles. An incremental poll that finds nothing costs one request. Rankbox marks a key **Idle** after 48 hours without a request.
- **Don't ping before every sync.** `GET /articles` checks the key too. Call `GET /ping` when someone connects, not on every run.
- **Pace bulk live-URL reports.** Reporting a large library is one `PATCH` per article. Space them at least 500 milliseconds apart (120 per minute at most), and better 600 milliseconds (about 100 per minute) so the account's regular syncs still fit.
- **Probe before a batch.** Send one `PATCH` first. If it returns `400`, the domain is wrong for every article, so stop instead of spending the minute's budget on failures.
- **Run one sync at a time per site.** Overlapping runs double the requests and race each other on the cursor.

| Task | Requests |
| --- | --- |
| Incremental poll, nothing new | 1 |
| Full walk of 1,000 articles with `limit=100` | 11 |
| Reporting 1,000 live URLs | 1,000, so at least 9 minutes at 120 per minute |
| Ping | 1 |

## Several integrations on one account

The per-account limit is shared, so plan for the total. An agency running ten Studio sites, each polling once a minute, uses 10 of the 120 requests per minute and leaves plenty of room. Ten sites each reporting a large backlog at the same moment would not fit. Stagger bulk jobs across sites, or run them one after another.

The per-IP limit matters when many sites sync from one server. Ten sites on one host share that host's 300 requests per minute, whichever accounts they belong to.

## Related

- [Errors](/docs/api/errors#429-too-many-requests): the 429 body and other statuses.
- [Syncing articles reliably](/docs/api/syncing): retries and backoff in a complete sync loop.
- [Articles endpoints](/docs/api/articles): `limit` and paging.
- [Studio](/docs/account/studio): running several sites on one account.
