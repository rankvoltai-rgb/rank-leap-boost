---
title: Events and webhooks
nav_title: Events and webhooks
description: Every Rankbox event type with payloads, how to register signed webhooks, verify the HMAC signature in TypeScript or Python, handle retries and poll GET /events.
order: 7
updated: 2026-10-02
---

Rankbox records an event whenever something happens on an account: a scan finishes, an article is written or published, credits run low, a payment fails. An agent hears about events in two ways: Rankbox posts them to a webhook URL, or the agent polls `GET /events`. Both deliver the same event objects.

## Webhooks or polling

| | Webhooks | Polling `GET /events` |
| --- | --- | --- |
| How | Rankbox sends an HTTPS `POST` to your URL | You call the API on a schedule |
| Latency | Seconds | Your polling interval |
| Needs | A public `https` endpoint | Nothing beyond the API |
| Security | Verify the `Rankbox-Signature` header | Your agent key |
| Missed events | Retried for about 2 days | Kept for 30 days; read from your last cursor |
| Best for | Agents with a server | Agents in a chat app, a CLI, an MCP client, a cron job |

Many agents use both: webhooks for speed, and a daily `GET /events` pass from the last cursor to catch anything a webhook outage missed.

## The event object

```json
{
  "id": "4c1f7a0e-3b5d-4e9a-8c2f-7d6e5b4a3c21",
  "type": "article.finished",
  "created_at": "2026-10-02T15:25:31Z",
  "account_id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
  "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
  "data": {
    "article": {
      "id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76",
      "status": "finished",
      "title": "How to choose a product analytics tool for B2B SaaS",
      "slug": "how-to-choose-a-product-analytics-tool-for-b2b-saas-f2b8c1d4",
      "keyword": "product analytics tool for b2b saas",
      "seo_score": 100,
      "published_url": null,
      "updated_at": "2026-10-02T15:25:31Z"
    },
    "trigger": "api"
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Unique event ID. Use it to ignore duplicates |
| `type` | string | The event type, from the table below |
| `created_at` | string | When it happened |
| `account_id` | string | The account |
| `site_id` | string or null | The site, or `null` for account-wide events such as billing |
| `data` | object | What changed. Article objects in events leave out the bodies; fetch the article when you need them |

## Event types

| Type | When it fires | `data` |
| --- | --- | --- |
| `account.claimed` | The owner claimed the account | `account` |
| `agent_access.created` | An agent key was created or an OAuth app was connected | `agent_key` (without the secret) |
| `agent_access.revoked` | A key was revoked or an app disconnected | `agent_key` |
| `site.scan_completed` | A site scan finished | `scan` |
| `site.scan_failed` | A site scan failed | `scan` with `error` |
| `site.added` | A Studio site was paid for and is live | `site` |
| `site.removal_scheduled` | A Studio site was set to stop at the end of the period | `site` with `removes_at` |
| `site.archived` | A Studio site stopped | `site` |
| `article.created` | An idea or scheduled article was added, by anyone | `article`, `source` (`scan`, `research`, `api`, `dashboard`) |
| `article.generated` | Rankbox finished writing an article | `article`, `job_id`, `trigger` (`api`, `autopilot`, `dashboard`), `credits_spent` |
| `article.generation_failed` | Writing failed and the credit was refunded | `article_id`, `job_id`, `trigger`, `error`, `credits_refunded` |
| `article.finished` | An article became `finished`, written by Rankbox or by hand | `article`, `trigger` |
| `article.updated` | A finished article's title, description, body or tags changed | `article`, `changed` (field names) |
| `article.published` | An article was pushed to a destination or its live URL was recorded | `article_id`, `source`, `url`, `result` |
| `article.publish_failed` | A push to Webflow or Shopify failed | `article_id`, `destination`, `error` |
| `article.deleted` | An article was deleted | `article_id`, `title` |
| `autopilot.queue_empty` | Autopilot was due but had nothing scheduled | `site_id`, `weekly_cadence` |
| `credits.low` | A site's article or Reddit reply credits fell to 3 for the period | `kind`, `remaining`, `period_end` |
| `credits.exhausted` | A site's article or Reddit reply credits reached 0 | `kind`, `period_end` |
| `credits.reset` | A new period's credits were granted | `credits` |
| `integration.connected` | The owner finished connecting a platform | `integration` |
| `integration.error` | A push integration recorded an error | `integration` with `last_error` |
| `integration.disconnected` | A push integration was disconnected, here or on the platform | `integration` |
| `backlink.verified` | A link was verified live and its credits settled | `placement` |
| `backlink.lost` | A live link went missing after repeated checks | `placement` |
| `reddit.sweep_completed` | A Reddit sweep finished | `threads_seen`, `opportunities_created` |
| `reddit.reply_verified` | A recorded reply was found live on Reddit | `reply` |
| `reddit.reply_removed` | A recorded reply was removed or couldn't be found | `reply` |
| `billing.trial_started` | The owner completed checkout and the trial began | `billing` |
| `billing.card_check_failed` | The trial's $1 card check failed; generation is off until the card is updated | `billing` |
| `billing.activated` | The first invoice was paid. Paid-only features open | `billing` |
| `billing.payment_failed` | A payment failed. Generation continues for 48 hours | `billing`, `grace_ends_at` |
| `billing.canceled` | Cancellation was scheduled for the end of the period | `billing` |
| `billing.ended` | The subscription ended. Generation stops | `billing` |
| `webhook.test` | You called `POST /webhooks/{webhook_id}/test` | `webhook_id` |

`article.published` `source` is one of `webflow`, `shopify`, `site_key` (a website or plugin reported the URL through the public API), `agent` (`POST …/publish`) or `dashboard`. New event types are added over time; ignore types you don't handle.

## Payload examples

### Generation failed

```json
{
  "id": "7e9a1c3e-5b7d-4f9a-8c1e-3d5f7a9b1c42",
  "type": "article.generation_failed",
  "created_at": "2026-10-03T09:04:12Z",
  "account_id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
  "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
  "data": {
    "article_id": "1a3c5e7b-9d0f-4b2d-8f4a-6c8e0a2c4e93",
    "job_id": "5f7b9d1a-3c5e-4a7c-9e1b-3d5f7a9c1e64",
    "trigger": "autopilot",
    "error": { "code": "generation_failed", "message": "The writer didn't return an article." },
    "credits_refunded": 1
  }
}
```

The article went back to `scheduled`. Retry with `POST …/generate`, or let autopilot pick it up on its next run.

### Article published

```json
{
  "id": "2b4d6f8a-0c2e-4b4d-9f6a-8c0e2b4d6f15",
  "type": "article.published",
  "created_at": "2026-10-02T16:02:44Z",
  "account_id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
  "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
  "data": {
    "article_id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76",
    "source": "agent",
    "url": "https://northwind.example/blog/how-to-choose-a-product-analytics-tool-for-b2b-saas",
    "result": "recorded"
  }
}
```

`result` is `recorded` when a live URL was recorded, and `created` or `updated` for a push to Webflow or Shopify.

### Credits low

```json
{
  "id": "9c1e3a5b-7d9f-4b1d-8a3c-5e7a9c1e3b26",
  "type": "credits.low",
  "created_at": "2026-10-06T00:12:09Z",
  "account_id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
  "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
  "data": { "kind": "articles", "remaining": 3, "period_end": "2026-10-09T15:20:44Z" }
}
```

Fires once per kind per period. During the trial, this is the moment to tell the owner what happens on day 8, or to slow autopilot.

### Payment failed

```json
{
  "id": "3d5f7b9c-1e3a-4c5e-8b7d-9f1b3d5f7a38",
  "type": "billing.payment_failed",
  "created_at": "2026-10-09T15:21:02Z",
  "account_id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
  "site_id": null,
  "data": {
    "billing": {
      "status": "past_due",
      "paid": false,
      "card_verified": true,
      "trial_ends_at": "2026-10-09T15:20:44Z",
      "current_period_end": "2026-11-09T15:20:44Z",
      "cancel_at_period_end": false,
      "past_due_since": "2026-10-09T15:21:00Z",
      "plan": { "name": "Business", "amount": 49.5, "currency": "usd", "interval": "month" },
      "studio_sites": 0,
      "monthly_total": 49.5
    },
    "grace_ends_at": "2026-10-11T15:21:00Z"
  }
}
```

Create a portal link with `POST /billing/portal` and ask the owner to update the card before `grace_ends_at`.

### Backlink verified

```json
{
  "id": "5f7a9c1e-3b5d-4f7a-9c1e-3b5d7f9a1c50",
  "type": "backlink.verified",
  "created_at": "2026-10-19T06:00:41Z",
  "account_id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
  "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
  "data": {
    "placement": {
      "id": "6a8c0e2f-4b6d-4e8a-9c1e-3f5b7d9a1c34",
      "direction": "inbound",
      "status": "live",
      "target_url": "https://northwind.example/features/retention",
      "anchor_used": "cohort retention tool",
      "host_url": "https://partner.example/blog/saas-churn-playbook",
      "credits": 2,
      "live_at": "2026-10-19T06:00:00Z"
    }
  }
}
```

## Set up a webhook

1. Build an endpoint that accepts `POST` requests over `https`, reads the raw body, verifies the signature and answers `2xx` within 10 seconds.
2. Register it with the event types you want:

```bash title="cURL"
curl -X POST https://rankbox.xyz/api/agent/v1/webhooks \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://agent.northwind.example/hooks/rankbox",
    "events": ["article.finished", "article.published", "article.generation_failed", "credits.low", "billing.payment_failed"],
    "description": "Atlas"
  }'
```

3. Save `webhook.secret` (`whsec_…`) from the response in your secret store. It isn't shown again.
4. Send a test event and check that your endpoint returns `200`:

```bash title="cURL"
curl -X POST https://rankbox.xyz/api/agent/v1/webhooks/5e3c1a9f-7b2d-4f8e-a1c3-6d4b2e9f8a17/test \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

Use `"events": ["*"]` to receive every type, including ones added later. An account can have 10 webhook endpoints. Each endpoint belongs to the agent key or OAuth connection that created it: revoking that credential disables its endpoints.

## Delivery format

Each delivery is a `POST` with the event object as its JSON body and these headers:

| Header | Example | Meaning |
| --- | --- | --- |
| `Content-Type` | `application/json` | |
| `User-Agent` | `Rankbox-Webhooks/1.0` | |
| `Rankbox-Event-Id` | `4c1f7a0e-3b5d-4e9a-8c2f-7d6e5b4a3c21` | Same as the body's `id` |
| `Rankbox-Event-Type` | `article.finished` | Same as the body's `type` |
| `Rankbox-Delivery-Attempt` | `1` | 1 for the first try, higher on retries |
| `Rankbox-Signature` | `t=1759418731,v1=5d41402abc4b2a76…` | Timestamp and HMAC signature |

One delivery carries one event.

## Verify signatures

Every delivery is signed with the endpoint's secret, so you can reject requests that didn't come from Rankbox. The `Rankbox-Signature` header has two parts, `t` (Unix seconds when Rankbox signed it) and `v1` (the signature):

1. Split the header on `,` and each part on the first `=`, to get `t` and `v1`.
2. Build the signed payload: `t`, a period, then the raw request body exactly as received, bytes unchanged.
3. Compute HMAC-SHA256 of the signed payload, using the whole secret string, `whsec_` prefix included, as the key. Encode it as lowercase hex.
4. Compare it with `v1` in constant time.
5. Reject the request if `t` is more than 300 seconds from your clock, to stop replays.

Parse the body only after the signature checks out. Frameworks that parse JSON first change the bytes and break the signature.

```ts title="TypeScript"
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyRankboxSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  toleranceSeconds = 300,
): boolean {
  if (!header) return false;
  const parts = new Map(
    header.split(",").map((part) => {
      const i = part.indexOf("=");
      return [part.slice(0, i).trim(), part.slice(i + 1).trim()] as const;
    }),
  );
  const t = Number(parts.get("t"));
  const v1 = parts.get("v1") ?? "";
  if (!Number.isFinite(t) || Math.abs(Date.now() / 1000 - t) > toleranceSeconds) return false;

  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(v1, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

// Next.js App Router: app/hooks/rankbox/route.ts
export async function POST(request: Request) {
  const raw = await request.text();
  const ok = verifyRankboxSignature(
    raw,
    request.headers.get("rankbox-signature"),
    process.env.RANKBOX_WEBHOOK_SECRET!,
  );
  if (!ok) return new Response("invalid signature", { status: 400 });

  const event = JSON.parse(raw) as { id: string; type: string; data: unknown };
  // Record event.id first, then hand the work to a queue and answer at once.
  return new Response(null, { status: 204 });
}
```

```python title="Python"
import hashlib
import hmac
import time

def verify_rankbox_signature(raw_body: bytes, header: str | None, secret: str, tolerance: int = 300) -> bool:
    if not header:
        return False
    try:
        parts = dict(part.strip().split("=", 1) for part in header.split(","))
        timestamp = int(parts["t"])
        signature = parts["v1"]
    except (KeyError, ValueError):
        return False
    if abs(time.time() - timestamp) > tolerance:
        return False
    signed = f"{timestamp}.".encode() + raw_body
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)

# Flask
from flask import Flask, request
import json, os

app = Flask(__name__)

@app.post("/hooks/rankbox")
def rankbox_webhook():
    raw = request.get_data()
    if not verify_rankbox_signature(raw, request.headers.get("Rankbox-Signature"), os.environ["RANKBOX_WEBHOOK_SECRET"]):
        return "invalid signature", 400
    event = json.loads(raw)
    # Record event["id"], queue the work, answer at once.
    return "", 204
```

## Responses, retries and disabling

Rankbox counts a delivery as received when your endpoint answers with any `2xx` status within 10 seconds. Anything else (a `3xx`, `4xx` or `5xx`, a timeout, a TLS or connection error) is a failure, and Rankbox tries again:

| Attempt | After the previous one |
| --- | --- |
| 1 | Immediately |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |
| 6 | 6 hours |
| 7 | 12 hours |
| 8 | 24 hours |

After 8 failed attempts, about 45 hours, Rankbox stops retrying that event; it stays readable in `GET /events`. Redirects aren't followed, so register the final URL.

If every delivery to an endpoint has failed for 3 days in a row, Rankbox disables it: `enabled` becomes `false` and `disabled_reason` says why. The owner gets an email. Fix the endpoint, then turn it back on with `PATCH /webhooks/{webhook_id}` and `{ "enabled": true }`, and read what you missed from `GET /events`.

Answer quickly and do the work afterwards. A handler that writes an article summary to a chat before answering times out on a slow day.

## Ordering, duplicates and idempotency

- **At least once.** An event can arrive more than once, for example when your `2xx` was lost. Store each `id` you've handled and skip repeats.
- **No ordering guarantee.** Retries and parallel deliveries can arrive out of order: `article.published` can arrive before `article.finished`. Use `created_at` to order events, and the resource's own `updated_at` to decide which version is newer.
- **Events are notifications.** When you need the current state, read it from the API (`GET /sites/{site_id}/articles/{article_id}`) rather than trusting an older event's payload.
- **Your actions trigger events too.** An agent that generates an article receives `article.generated` and `article.finished` for it. Don't react to your own events by generating again.

## Poll the event stream

`GET /events` returns events oldest first, with a `next_cursor` that always points just after the last event returned. Start with `since` once, then always pass `cursor`:

```ts title="TypeScript"
const BASE = "https://rankbox.xyz/api/agent/v1";
const headers = { Authorization: `Bearer ${process.env.RANKBOX_AGENT_KEY}` };

// Load the cursor you saved last time; on the very first run, start from a timestamp.
let cursor: string | null = await loadCursor();
let url = cursor ? `${BASE}/events?cursor=${cursor}` : `${BASE}/events?since=2026-10-02T14:00:00Z`;

for (;;) {
  const res = await fetch(url, { headers });
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, Number(res.headers.get("retry-after") ?? 5) * 1000));
    continue;
  }
  const page = (await res.json()) as { events: { id: string; type: string }[]; next_cursor: string; has_more: boolean };
  for (const event of page.events) await handle(event); // skip ids you've already handled
  await saveCursor(page.next_cursor);
  if (!page.has_more) break;
  url = `${BASE}/events?cursor=${page.next_cursor}`;
}
```

Poll every 1 to 5 minutes; more often only spends your request budget. Filter with `types` and `site_id` to fetch less. A cursor older than 30 days has nothing left to return, so start again from `since`.

## Who receives which events

Events belong to the account. Every agent key and OAuth connection on the account can read every event with `GET /events`, whichever agent or person caused it. A webhook receives the types it subscribed to, for every site on the account; filter on `site_id` in your handler if you only care about one site.

## Troubleshooting

- **Every signature fails.** You are hashing the parsed and re-serialized JSON instead of the raw body, or using the secret without its `whsec_` prefix, or the secret of another endpoint.
- **Some signatures fail.** Your server's clock is off. Sync it with NTP; the check allows 300 seconds.
- **No deliveries arrive.** Check `last_delivery_status` in `GET /webhooks`, and that the endpoint is `enabled`. Send a test event. Endpoints behind a login, a firewall that blocks unknown IPs, or a redirect never receive deliveries.
- **The endpoint was disabled.** It failed for 3 days. Fix it, re-enable it with `PATCH`, and catch up from `GET /events`.
- **Events stopped after a key rotation.** Endpoints belong to the credential that created them. Create the endpoints again with the new key before revoking the old one.

## Related

- [Agent API reference](/docs/agents/api-reference#events-and-webhooks): the webhook and event endpoints.
- [Quickstart for AI agents](/docs/agents/quickstart#step-13-subscribe-to-events): subscribing in a new setup.
- [Billing, credits and limits](/docs/agents/billing-and-limits): what `credits.*` and `billing.*` events mean.
- [Permissions and guardrails](/docs/agents/permissions): `agent_access.*` events and the activity log.
- [Agent playbooks](/docs/agents/playbooks#a-weekly-maintenance-loop): an event-driven weekly loop.
