---
title: Agent API reference
nav_title: API reference
description: Every endpoint of the Rankbox agent API: conventions, objects, parameters and example requests and responses for accounts, sites, articles, billing and more.
order: 5
updated: 2026-10-02
---

The agent API is the REST API behind agent access. It covers everything the dashboard does, for every site on the account. This page lists every endpoint with its parameters, an example request and an example response. Read [Conventions](#conventions) first; the rest is reference.

## Conventions

### Base URL and versioning

All endpoints live under one base URL:

```text
https://rankbox.xyz/api/agent/v1
```

The version is in the path. Within `v1`, Rankbox only adds things: new endpoints, new optional request fields, new response fields and new event types. Removing or renaming a field, or changing its meaning, would come as `v2` at a new path. Write clients that ignore fields they don't know.

### Authentication

Send an agent key or an OAuth access token in the `Authorization` header:

```http
Authorization: Bearer rv_agent_xxxxxxxxxxxx
```

Only `POST /accounts` works without it. Every credential has full access to the account; there are no scopes. See [Agent authentication](/docs/agents/authentication).

### Requests

- Bodies are JSON with `Content-Type: application/json`, at most 1 MB.
- Field names are snake_case.
- IDs are UUIDs, for example `6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64`, except integration IDs, which are names such as `webflow`.
- A site is addressed in the path: `/sites/{site_id}/…`. Get site IDs from `GET /sites`. The primary site's ID is also `account.primary_site_id`.
- `PATCH` changes only the fields you send. Send `null` to clear a nullable field.
- A resource on another account returns `404 not_found`, never `403`, so a probe learns nothing.

### Responses

- One object comes wrapped in its name: `{ "article": { … } }`.
- A list comes as a plural name plus a cursor: `{ "articles": [ … ], "next_cursor": "…" }`.
- Every response carries an `X-Request-Id` header. Quote it when you contact support.
- Timestamps are ISO 8601 in UTC, for example `2026-10-02T14:03:11Z`. Calendar days such as `scheduled_date` are `YYYY-MM-DD`.
- Money is a number in US dollars, for example `49.5` for $49.50, with `"currency": "usd"`.

### Pagination

List endpoints take `limit` (1 to 100, default 50) and `cursor`. When `next_cursor` is `null` there is nothing more. Otherwise pass it back as `?cursor=` to get the next page. Cursors are opaque strings; don't build or parse them.

```bash title="cURL"
curl "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/articles?limit=100&cursor=eyJ1IjoiMjAyNi0xMC0wMlQx…" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

### Idempotency

Every `POST` accepts an `Idempotency-Key` header: any string up to 255 characters, unique per operation. A UUID is a good choice.

| Retry | Result |
| --- | --- |
| Same key, same body, within 24 hours | The original response, replayed with the header `Idempotent-Replayed: true`. Nothing runs twice and no credit is spent twice |
| Same key, different body | `409 conflict` |
| Same key while the first request is still running | `409 conflict`. Retry after a second |

Send one on every `POST` that spends credits or money: `generate`, `POST /sites`, `POST /sites/{site_id}/restore`, `POST /billing/activate`, Reddit drafts. `PATCH` and `DELETE` are naturally idempotent.

### Asynchronous jobs

Work that can take longer than 30 seconds runs as a job: the site scan, research, article generation, integration syncs and Reddit sweeps. These endpoints return `202 Accepted` with `{ "job": { … } }`. Poll [Get a job](#get-a-job) with `?wait=30`, or listen for the matching event. Everything else answers synchronously.

### Errors

Errors use the same envelope as the [public API](/docs/api/errors): a sentence for people and a stable code for programs.

```json
{
  "error": "This site has used all 7 article credits for this period. They reset on 9 October 2026.",
  "code": "insufficient_credits"
}
```

Some errors add fields: `details` (an array of `{ "field", "problem" }` on `validation_failed`), `action_url` (a page for the owner on `human_required` and `payment_failed`) and `docs_url`.

| Status | `code` | Meaning |
| --- | --- | --- |
| 400 | `bad_request` | The body isn't valid JSON, or a header is malformed |
| 401 | `unauthorized` | Missing, unknown, revoked or expired credential |
| 402 | `subscription_required` | Needs the trial or the plan; or the trial's card check failed; or the site isn't active on the plan |
| 402 | `paid_plan_required` | Needs a paid invoice. The trial doesn't count. Applies to the backlink exchange, Reddit Presence and Studio |
| 402 | `insufficient_credits` | The site used this period's credits of the kind the call spends |
| 402 | `payment_failed` | A charge (a Studio site, ending the trial early) was declined. Nothing changed |
| 403 | `human_required` | Only the signed-in owner can do this. `action_url` says where |
| 404 | `not_found` | No such resource on this account |
| 409 | `account_exists` | `POST /accounts` with an email that already has an account |
| 409 | `conflict` | The resource is in the wrong state for this call, or an idempotency key was reused |
| 409 | `integration_unavailable` | The platform's Rankbox add-on isn't open to every account. Use the REST API path |
| 422 | `validation_failed` | A field is missing or invalid. See `details` |
| 429 | `rate_limited` | Too many requests. Wait `Retry-After` seconds |
| 500 | `internal_error` | Rankbox failed. Retry with backoff; quote `X-Request-Id` if it persists |
| 503 | `unavailable` | Temporarily unavailable. Wait `Retry-After` seconds |

### Rate limit headers

Every response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` (Unix seconds) for the account's request budget. A `429` adds `Retry-After` in seconds. The numbers are in [Billing, credits and limits](/docs/agents/billing-and-limits#rate-limits).

## Endpoint index

Paths are relative to `https://rankbox.xyz/api/agent/v1`. "Needs" is what the account must have; everything else works on an account with no plan.

| Method | Path | Purpose | Needs |
| --- | --- | --- | --- |
| POST | `/accounts` | Create an account (no auth) | |
| GET | `/account` | Get the account | |
| POST | `/account/resend-claim` | Resend the claim email | |
| DELETE | `/account` | Delete the account (owner only) | |
| GET | `/agent-keys` | List agent keys and OAuth connections | |
| POST | `/agent-keys` | Create an agent key | |
| DELETE | `/agent-keys/{id}` | Revoke a key or connection | |
| GET | `/activity` | Read the activity log | |
| GET | `/sites` | List sites | |
| POST | `/sites` | Add a Studio site (charges the card) | Paid plan |
| GET | `/sites/{site_id}` | Get a site | |
| PATCH | `/sites/{site_id}` | Update brand and writing settings | |
| DELETE | `/sites/{site_id}` | Schedule a Studio site's removal | |
| POST | `/sites/{site_id}/restore` | Keep or restore a Studio site | Paid plan |
| GET | `/sites/{site_id}/scan` | Get the site scan | |
| POST | `/sites/{site_id}/scan` | Run the scan again | |
| POST | `/sites/{site_id}/research` | Run research | |
| GET | `/sites/{site_id}/keywords` | List keywords | |
| POST | `/sites/{site_id}/keywords` | Add a keyword | |
| DELETE | `/sites/{site_id}/keywords/{keyword_id}` | Delete a keyword | |
| GET | `/sites/{site_id}/articles` | List articles | |
| POST | `/sites/{site_id}/articles` | Create an idea or scheduled article | |
| GET | `/sites/{site_id}/articles/{article_id}` | Get an article | |
| PATCH | `/sites/{site_id}/articles/{article_id}` | Update an article | |
| DELETE | `/sites/{site_id}/articles/{article_id}` | Delete an article | |
| POST | `/sites/{site_id}/articles/{article_id}/generate` | Write the article (1 article credit) | Trial or plan |
| POST | `/sites/{site_id}/articles/{article_id}/rewrite-section` | Rewrite one passage | |
| GET | `/sites/{site_id}/articles/{article_id}/score` | SEO and GEO score | |
| POST | `/sites/{site_id}/articles/{article_id}/finish` | Mark a hand-written article finished | |
| POST | `/sites/{site_id}/articles/{article_id}/publish` | Push to destinations, record the live URL | |
| GET | `/jobs/{job_id}` | Get a job | |
| GET | `/jobs` | List jobs | |
| GET | `/sites/{site_id}/autopilot` | Get autopilot | |
| PATCH | `/sites/{site_id}/autopilot` | Turn autopilot on or off, set the pace | |
| GET | `/sites/{site_id}/integrations` | List integrations | |
| GET | `/sites/{site_id}/integrations/{integration_id}` | Get one integration and its setup options | |
| POST | `/sites/{site_id}/integrations/{integration_id}/connect` | Start a connection | Trial or plan |
| PATCH | `/sites/{site_id}/integrations/{integration_id}` | Configure a push integration | Trial or plan |
| POST | `/sites/{site_id}/integrations/{integration_id}/sync` | Push every missing or changed article | Trial or plan |
| DELETE | `/sites/{site_id}/integrations/{integration_id}` | Disconnect a push integration | |
| GET | `/sites/{site_id}/keys` | List site keys | |
| POST | `/sites/{site_id}/keys` | Create a site key | Trial or plan |
| DELETE | `/sites/{site_id}/keys/{key_id}` | Revoke a site key | |
| GET | `/sites/{site_id}/credits` | Credit balances | |
| GET | `/sites/{site_id}/rank` | Rank: keyword coverage | |
| GET | `/sites/{site_id}/backlinks` | Backlink exchange overview | |
| PATCH | `/sites/{site_id}/backlinks` | Exchange settings | Paid plan |
| POST | `/sites/{site_id}/backlinks/domain` | Set the domain to verify | Paid plan |
| POST | `/sites/{site_id}/backlinks/domain/verify` | Check domain verification | Paid plan |
| GET | `/sites/{site_id}/backlinks/targets` | List targets | |
| POST | `/sites/{site_id}/backlinks/targets` | Create a target | Paid plan |
| PATCH | `/sites/{site_id}/backlinks/targets/{target_id}` | Update a target | Paid plan |
| DELETE | `/sites/{site_id}/backlinks/targets/{target_id}` | Delete a target | Paid plan |
| GET | `/sites/{site_id}/backlinks/placements` | List placements | |
| DELETE | `/sites/{site_id}/backlinks/placements/{placement_id}` | Remove a hosted link | |
| GET | `/sites/{site_id}/reddit` | Reddit Presence overview | |
| PATCH | `/sites/{site_id}/reddit` | Turn on and configure Reddit Presence | Paid plan |
| POST | `/sites/{site_id}/reddit/sweeps` | Start a sweep | Paid plan |
| GET | `/sites/{site_id}/reddit/threads` | List threads | |
| GET | `/sites/{site_id}/reddit/threads/{thread_id}` | Get a thread | |
| PATCH | `/sites/{site_id}/reddit/threads/{thread_id}` | Save, dismiss or restore a thread | Paid plan |
| POST | `/sites/{site_id}/reddit/threads/{thread_id}/drafts` | Draft or rewrite a reply (1 Reddit credit) | Paid plan |
| PATCH | `/sites/{site_id}/reddit/drafts/{draft_id}` | Edit a draft | Paid plan |
| POST | `/sites/{site_id}/reddit/replies` | Record a reply a person posted | Paid plan |
| GET | `/sites/{site_id}/reddit/replies` | List recorded replies | |
| GET | `/billing` | Billing status | |
| POST | `/billing/checkout` | Checkout link for the owner | |
| POST | `/billing/portal` | Billing portal link for the owner | |
| POST | `/billing/activate` | End the trial now and pay | Trial |
| GET | `/billing/studio-quote` | Price of one more Studio site | |
| GET | `/events` | Read the event stream | |
| GET | `/webhooks` | List webhook endpoints | |
| POST | `/webhooks` | Create a webhook endpoint | |
| PATCH | `/webhooks/{webhook_id}` | Update a webhook endpoint | |
| DELETE | `/webhooks/{webhook_id}` | Delete a webhook endpoint | |
| POST | `/webhooks/{webhook_id}/test` | Send a test event | |

## Accounts

### Create an account

```http
POST /accounts
```

Creates an account, its primary site and an agent key, starts the site scan and emails the owner. No authentication. Full details, limits and the claim flow are in [Create an account as an agent](/docs/agents/create-account).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `email` | string | Yes | The owner's email, at most 254 characters, not a disposable address |
| `site_url` | string | Yes | Public `http` or `https` URL, at most 2,048 characters |
| `site_name` | string | No | 1 to 120 characters. Read from the site when left out |
| `site_description` | string | No | At most 2,000 characters. Written from the site when left out |
| `agent.name` | string | Yes | 2 to 60 characters |
| `agent.operator` | string | No | At most 100 characters |
| `agent.contact_url` | string | No | An `https` URL |

Returns `201` with `account`, `site`, `scan_job_id`, `agent_key` (with the secret `key`, shown once) and `claim_url`. The full example is in [The response](/docs/agents/create-account#the-response). Errors: `409 account_exists`, `422 validation_failed`, `429 rate_limited`.

### The account object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Account ID |
| `email` | string | The owner's email |
| `claimed` | boolean | Whether the owner has claimed the account and can sign in |
| `claimed_at` | string or null | When they claimed it |
| `created_at` | string | When the account was created |
| `created_by_agent` | object or null | `name`, `operator`, `contact_url` of the agent that created it; `null` if a person signed up |
| `primary_site_id` | string | The site the plan covers |
| `billing_status` | string | `none`, `trialing`, `active`, `past_due` or `canceled`. Details in `GET /billing` |

### Get the account

```http
GET /account
```

```json
{
  "account": {
    "id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
    "email": "maya@northwind.example",
    "claimed": true,
    "claimed_at": "2026-10-02T16:10:27Z",
    "created_at": "2026-10-02T14:03:11Z",
    "created_by_agent": {
      "name": "Atlas",
      "operator": "Northwind Analytics",
      "contact_url": "https://northwind.example/atlas"
    },
    "primary_site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "billing_status": "trialing"
  }
}
```

A cheap call: use it to check a credential.

### Resend the claim email

```http
POST /account/resend-claim
```

Sends the owner a new claim email and returns the new link. At most 3 a day per account.

```json
{ "sent": true, "claim_url": "https://rankbox.xyz/claim/ct_xxxxxxxxxxxx" }
```

Errors: `409 conflict` when the account is already claimed, `429 rate_limited` after 3 in a day.

### Delete the account

```http
DELETE /account
```

Deleting the account removes every site, article and setting and can't be undone, so only the signed-in owner can do it, from **Dashboard → Settings → Account**. The agent API always answers:

```json
{
  "error": "Only the account owner can delete the account, from Dashboard → Settings → Account.",
  "code": "human_required",
  "action_url": "https://rankbox.xyz/dashboard/settings"
}
```

## Agent keys

### The agent key object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | ID of the key or connection |
| `type` | string | `key` for an agent key, `oauth` for an app connected through OAuth |
| `name` | string | The agent's name, or the OAuth app's `client_name` |
| `key` | string | The secret. Only in the response that creates it |
| `prefix` | string or null | First 15 characters and an ellipsis, for keys; `null` for OAuth |
| `client_id` | string or null | The OAuth client, for connections; `null` for keys |
| `operator` | string or null | The operator given when the key was created |
| `contact_url` | string or null | The contact URL given when the key was created |
| `created_at` | string | When it was created or approved |
| `last_used_at` | string or null | The last authenticated request |

### List agent keys and connections

```http
GET /agent-keys
```

```json
{
  "agent_keys": [
    {
      "id": "2d4f6a8c-1e3b-4c5d-8f7a-9b0c1d2e3f45",
      "type": "key",
      "name": "Atlas",
      "prefix": "rv_agent_a1b2c3…",
      "client_id": null,
      "operator": "Northwind Analytics",
      "contact_url": "https://northwind.example/atlas",
      "created_at": "2026-10-02T14:03:11Z",
      "last_used_at": "2026-10-02T15:22:05Z"
    },
    {
      "id": "b8d0f2a4-6c8e-4a1b-9c3d-5e7f9a1b3c86",
      "type": "oauth",
      "name": "Claude",
      "prefix": null,
      "client_id": "c3f1e5d7-…",
      "operator": null,
      "contact_url": null,
      "created_at": "2026-10-04T08:31:50Z",
      "last_used_at": "2026-10-04T08:35:12Z"
    }
  ],
  "next_cursor": null
}
```

Revoked keys and disconnected apps aren't listed.

### Create an agent key

```http
POST /agent-keys
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | 2 to 60 characters |
| `operator` | string | No | At most 100 characters |
| `contact_url` | string | No | An `https` URL |

Returns `201` with `{ "agent_key": { … "key": "rv_agent_xxxxxxxxxxxx" … } }`. The owner is emailed. At most 25 active keys and connections per account; beyond that, `409 conflict`. Example in [Create a key through the API](/docs/agents/authentication#create-a-key-through-the-api).

### Revoke a key or connection

```http
DELETE /agent-keys/{id}
```

Revokes an agent key or disconnects an OAuth app, immediately. Webhook endpoints it registered are disabled. Returns `{ "revoked": true, "id": "…" }`. You can revoke the key you are calling with; the next request then returns `401`.

## Activity

### List activity

```http
GET /activity
```

The activity log the owner sees at **Dashboard → Settings → Agent access**: every change made by an agent or by the owner, newest first, kept for 365 days.

| Query parameter | Type | Notes |
| --- | --- | --- |
| `actor_id` | string | Only entries by this agent key or connection |
| `site_id` | string | Only entries about this site |
| `since` | string | Only entries at or after this timestamp |
| `limit`, `cursor` | | Pagination |

```json
{
  "activity": [
    {
      "id": "d1e3f5a7-9b2c-4d6e-8f0a-2b4c6d8e0f13",
      "created_at": "2026-10-02T15:22:05Z",
      "actor": { "type": "agent", "id": "2d4f6a8c-1e3b-4c5d-8f7a-9b0c1d2e3f45", "name": "Atlas" },
      "action": "article.generate",
      "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
      "resource": { "type": "article", "id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76" },
      "summary": "Started writing “How to choose a product analytics tool for B2B SaaS” (1 article credit)",
      "ip": "203.0.113.7"
    }
  ],
  "next_cursor": null
}
```

`actor.type` is `agent` (a key), `app` (an OAuth connection), `owner` or `rankbox` (autopilot and other scheduled work).

## Sites

### The site object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Site ID |
| `kind` | string | `primary` (the site the plan covers) or `studio` (an extra site billed at $49.50 a month) |
| `status` | string | `pending` (Studio payment in flight), `active` or `archived` |
| `brand_name` | string or null | Brand name |
| `website_url` | string or null | The website articles are published to |
| `product_description` | string or null | What the business sells ("What you sell" in Settings) |
| `avatar_url` | string or null | Logo URL |
| `writing` | object | `tone`, `writing_style`, `audience`, `brand_voice` (house rules, one per line) |
| `scan_status` | string | `queued`, `running`, `completed` or `failed` |
| `billed_from` | string or null | When a Studio site started billing |
| `removes_at` | string or null | A scheduled removal. The site runs until then |
| `archived_at` | string or null | When a Studio site stopped |
| `dashboard_url` | string | Opens this site in the dashboard |
| `created_at` | string | When the site was added |

A site is usable when `status` is `active` and `removes_at` is null or in the future.

### List sites

```http
GET /sites
```

Returns every site on the account, primary first, then Studio sites in the order they were added, archived ones included.

```json
{
  "sites": [
    {
      "id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
      "kind": "primary",
      "status": "active",
      "brand_name": "Northwind Analytics",
      "website_url": "https://northwind.example",
      "product_description": "Product analytics for B2B SaaS teams: funnels, retention and feature adoption without SQL.",
      "avatar_url": "https://northwind.example/apple-touch-icon.png",
      "writing": {
        "tone": "Confident",
        "writing_style": "In-depth and data-driven",
        "audience": "Product managers at B2B SaaS companies",
        "brand_voice": "Say \"teams\", not \"users\".\nNever name competitors.\nUse US spelling."
      },
      "scan_status": "completed",
      "billed_from": null,
      "removes_at": null,
      "archived_at": null,
      "dashboard_url": "https://rankbox.xyz/dashboard?site=6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
      "created_at": "2026-10-02T14:03:11Z"
    }
  ],
  "next_cursor": null
}
```

### Get a site

```http
GET /sites/{site_id}
```

Returns `{ "site": { … } }` in the shape above.

### Update a site

```http
PATCH /sites/{site_id}
```

| Field | Type | Notes |
| --- | --- | --- |
| `brand_name` | string | 1 to 120 characters |
| `website_url` | string | Public `http` or `https` URL. Changing it doesn't re-run the scan |
| `product_description` | string | At most 2,000 characters |
| `avatar_url` | string or null | `https` URL of a logo |
| `writing.tone` | string | At most 80 characters. The dashboard offers `Professional`, `Friendly`, `Confident`, `Conversational`, `Authoritative`, `Playful`; any text works |
| `writing.writing_style` | string | At most 80 characters. Offered: `Balanced`, `Concise and actionable`, `In-depth and data-driven`, `Story-led`, `Step-by-step` |
| `writing.audience` | string | At most 160 characters. Offered: `Founders / Entrepreneurs`, `Marketers`, `Small business owners`, `Developers`, `Agencies` |
| `writing.brand_voice` | string | House rules, one per line, at most 4,000 characters |

```http
PATCH /sites/6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64
Content-Type: application/json

{ "writing": { "tone": "Confident", "audience": "Product managers at B2B SaaS companies" } }
```

Returns the updated `{ "site": { … } }`. The writing settings feed every article written afterwards, by you or autopilot. See [Brand voice and writing settings](/docs/content/brand-voice).

### Add a Studio site

```http
POST /sites
```

Adds a Studio site: an extra site with its own plan allowance, billed at $49.50 a month on the same subscription. Rankbox charges the card on file at once for the rest of the current period (prorated), and only a successful charge creates the site. The scan then starts as it did for the first site. Needs a paid plan; check [Get a Studio quote](#get-a-studio-quote) first. Send an `Idempotency-Key`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `site_url` | string | Yes | Public `http` or `https` URL |
| `site_name` | string | Yes | 1 to 120 characters |
| `site_description` | string | No | At most 2,000 characters |
| `logo_url` | string | No | `https` URL |
| `proration_date` | integer | No | From the quote. Locks the charge to the quoted amount for 30 minutes |

```json
{
  "site": {
    "id": "a3e9b1c7-5d2f-4c8a-9e6b-7f1a2d3c4b58",
    "kind": "studio",
    "status": "active",
    "brand_name": "Fernhill Coffee",
    "website_url": "https://fernhill.example",
    "product_description": "",
    "avatar_url": null,
    "writing": { "tone": "Professional", "writing_style": "Balanced", "audience": "Founders / Entrepreneurs", "brand_voice": "" },
    "scan_status": "running",
    "billed_from": "2026-10-20T10:00:00Z",
    "removes_at": null,
    "archived_at": null,
    "dashboard_url": "https://rankbox.xyz/dashboard?site=a3e9b1c7-5d2f-4c8a-9e6b-7f1a2d3c4b58",
    "created_at": "2026-10-20T10:00:00Z"
  },
  "scan_job_id": "4d6f8a0c-2e4b-4c6d-8e0f-1a3b5c7d9e21",
  "charged": { "amount": 24.75, "currency": "usd" }
}
```

Errors: `402 paid_plan_required` during the trial or without a plan (see [End the trial now](#end-the-trial-now)), `402 payment_failed` when the card is declined (no site is created), `403 human_required` when the bank asks the cardholder to authenticate, `409 conflict` while another site change on the account is in progress (retry after a few seconds).

### Remove a Studio site

```http
DELETE /sites/{site_id}
```

Schedules a Studio site's removal at the end of the period already paid for. Nothing is refunded and nothing is deleted: the site keeps working until `removes_at`, then becomes `archived`, and its articles stay readable. The primary site can't be removed; the call returns `409 conflict` (cancel the plan in the billing portal instead).

```json
{ "site": { "id": "a3e9b1c7-5d2f-4c8a-9e6b-7f1a2d3c4b58", "kind": "studio", "status": "active", "removes_at": "2026-11-17T15:20:44Z" } }
```

The response holds the full site object; it is shortened here.

### Restore a Studio site

```http
POST /sites/{site_id}/restore
```

Undoes a removal. If the site is still running with a `removes_at` in the future, this cancels the removal at no cost. If the site is `archived`, Rankbox charges the prorated price for the rest of the period, like adding a site, and brings it back with its articles. Body: optional `proration_date` from a quote. Returns `{ "site": { … }, "charged": null }` or with `charged` set. Same errors as [Add a Studio site](#add-a-studio-site).

### Get the scan

```http
GET /sites/{site_id}/scan
```

The latest scan of the site's website: brand, analysis and the articles it added to the plan.

```json
{
  "scan": {
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "job_id": "3c5e7a9b-1d3f-4b5c-8e7a-9c1b3d5f7a92",
    "status": "completed",
    "stage": "plan",
    "started_at": "2026-10-02T14:03:12Z",
    "finished_at": "2026-10-02T14:05:40Z",
    "brand": {
      "brand_name": "Northwind Analytics",
      "product_description": "Product analytics for B2B SaaS teams: funnels, retention and feature adoption without SQL.",
      "avatar_url": "https://northwind.example/apple-touch-icon.png"
    },
    "analysis": {
      "niche": "B2B product analytics",
      "audience": "Product managers and founders at B2B SaaS companies",
      "geo": "United States",
      "competitors": ["Lumen Metrics", "Quarry"]
    },
    "keywords_found": 20,
    "articles_planned": 20,
    "ideas": 4,
    "scheduled": 16,
    "error": null
  }
}
```

`stage` is `brand`, `analysis` or `plan`. Fields the scan couldn't ground in the website come back empty rather than guessed.

### Run the scan again

```http
POST /sites/{site_id}/scan
```

Re-scans the website and rebuilds the plan from it. Returns `202` with a `site.scan` job. What it changes:

- Brand fields that are empty are filled in; fields you set are kept.
- Keywords it finds replace keywords with the same name; others are kept.
- Unwritten articles (`opportunity` or `scheduled`, empty body) for the same keywords are replaced; written articles are never touched.

On an account with no trial or plan, at most 3 scans a day, the first one included.

## Research and keywords

### Run research

```http
POST /sites/{site_id}/research
```

Finds keywords buyers search for and article ideas for the site, using its brand and writing settings. Free; counts toward the AI rate limit. Returns `202` with a `research` job.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `seed` | string | none | A topic to research around, at most 200 characters. Without it, research works from the brand and product |
| `ideas` | integer | 10 | Article ideas to return, 0 to 30. Ideas never repeat titles already on the site |
| `save` | boolean | `false` | Add the keywords to the site (`source: discovered`) and the ideas to the plan (`status: opportunity`) |

The finished job's `result`:

```json
{
  "keywords": [
    { "name": "feature adoption metrics", "tag": "High Intent", "search_volume": 1300, "traffic_estimate": 230, "intent": "Informational", "trend": "Rising" }
  ],
  "ideas": [
    { "title": "Feature adoption metrics: the 6 that predict expansion revenue", "description": "Define each metric, show how to compute it, and when it matters.", "keyword": "feature adoption metrics", "traffic_estimate": 900, "competition": "Low", "ai_signal": 84 }
  ],
  "saved": { "keywords": 18, "articles": 10 }
}
```

Up to 24 keywords per run. `search_volume`, `traffic_estimate`, `competition` and `ai_signal` are model estimates for planning, not measured data. `saved` is `null` when `save` is `false`. On an account with no trial or plan, at most 10 research runs a day. See [Research](/docs/content/research).

### The keyword object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Keyword ID |
| `site_id` | string | The site |
| `name` | string | The search phrase, lowercase |
| `source` | string | `library` (tracked by you or the scan) or `discovered` (found by research) |
| `tag` | string or null | A short label such as `High Intent` |
| `intent` | string or null | `Commercial`, `Informational`, `Transactional` or `Navigational` |
| `search_volume` | integer | Estimated monthly searches |
| `traffic_estimate` | integer | Estimated monthly visits once answered |
| `trend` | string | `Rising`, `Steady` or `Declining` |
| `created_at` | string | When it was added |

### List keywords

```http
GET /sites/{site_id}/keywords?source=library
```

`source` is optional. Returns `{ "keywords": [ … ], "next_cursor": null }`, highest `search_volume` first.

### Add a keyword

```http
POST /sites/{site_id}/keywords
Content-Type: application/json

{ "name": "product analytics for startups", "intent": "Commercial", "search_volume": 880 }
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | 2 to 200 characters. Stored lowercase |
| `intent` | string | No | One of the four intents |
| `search_volume` | integer | No | Your own estimate or a figure from your keyword tool |
| `tag` | string | No | At most 40 characters |
| `trend` | string | No | `Rising`, `Steady` or `Declining` |

Returns `201` with `{ "keyword": { … "source": "library" … } }`. A keyword with the same name on the site returns `409 conflict`. Tracked keywords drive [Get Rank](#get-rank).

### Delete a keyword

```http
DELETE /sites/{site_id}/keywords/{keyword_id}
```

Returns `{ "deleted": true, "id": "…" }`. Articles that target the keyword are kept.

## Articles

### The article object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Article ID |
| `site_id` | string | The site |
| `status` | string | `opportunity`, `scheduled`, `generating` or `finished`. See [Article statuses](#article-statuses) |
| `title` | string | Title |
| `slug` | string | The title in URL form plus the first 8 characters of the ID, the same slug the public API returns |
| `keyword` | string or null | The target keyword |
| `description` | string | The brief before writing; the meta description after |
| `body` | string | The stored Markdown, including the writer's notes. What `PATCH` writes |
| `body_markdown` | string | Publish-ready Markdown: writer's notes removed |
| `body_html` | string | Publish-ready HTML, rendered from `body_markdown` |
| `tags` | array of strings | Tags |
| `seo_score` | integer | 0 to 100, the score stored when the article was written or last scored |
| `traffic_estimate` | integer | Estimated monthly visits |
| `competition` | string or null | `Low`, `Medium` or `High`, estimated |
| `ai_signal` | integer | 0 to 100, how likely the topic is to come up in AI answers, estimated |
| `scheduled_date` | string or null | The day autopilot writes it, for scheduled articles |
| `queue_position` | integer or null | Order in the autopilot queue; lowest goes first |
| `notes` | string | Free-form notes, never published |
| `published_url` | string or null | Where the article is live, once known |
| `published_at` | string or null | When `published_url` was recorded |
| `dashboard_url` | string | Opens the article in the dashboard editor |
| `created_at`, `updated_at` | string | Timestamps |

The writer's notes in `body` are image ideas written as `**[Image: …] (alt: "…")**` and internal-link suggestions written as `[anchor](#internal: target)`. Destinations never receive them: `body_markdown` and `body_html` drop the image ideas and keep only the anchor text of internal-link suggestions. An agent that builds the website can use them to add images and real internal links. The body usually starts with an H1 that repeats the title; drop it if your template prints the title itself.

```json
{
  "article": {
    "id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76",
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "status": "finished",
    "title": "How to choose a product analytics tool for B2B SaaS",
    "slug": "how-to-choose-a-product-analytics-tool-for-b2b-saas-f2b8c1d4",
    "keyword": "product analytics tool for b2b saas",
    "description": "A buyer's checklist for B2B SaaS teams: the events to track, the questions to ask vendors and the traps to avoid.",
    "body": "# How to choose a product analytics tool for B2B SaaS\n\nChoosing a product analytics tool comes down to three things…\n\n**[Image: A checklist on a desk] (alt: \"Product analytics buying checklist\")**\n\n## What a B2B SaaS team needs to measure\n…see [retention analysis](#internal: retention guide)…",
    "body_markdown": "# How to choose a product analytics tool for B2B SaaS\n\nChoosing a product analytics tool comes down to three things…\n\n## What a B2B SaaS team needs to measure\n…see retention analysis…",
    "body_html": "<h1>How to choose a product analytics tool for B2B SaaS</h1>\n<p>Choosing a product analytics tool comes down to three things…</p>\n<h2>What a B2B SaaS team needs to measure</h2>\n<p>…see retention analysis…</p>",
    "tags": ["product analytics", "b2b saas"],
    "seo_score": 100,
    "traffic_estimate": 1400,
    "competition": "Medium",
    "ai_signal": 86,
    "scheduled_date": null,
    "queue_position": null,
    "notes": "",
    "published_url": null,
    "published_at": null,
    "dashboard_url": "https://rankbox.xyz/dashboard/editor/f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76",
    "created_at": "2026-10-02T14:05:40Z",
    "updated_at": "2026-10-02T15:25:31Z"
  }
}
```

### Article statuses

| `status` | Dashboard label | Meaning | Can be set with |
| --- | --- | --- | --- |
| `opportunity` | Idea | In the plan, not on the schedule | `POST`, `PATCH` |
| `scheduled` | Scheduled | In the autopilot queue with a `scheduled_date` | `POST`, `PATCH` |
| `generating` | Writing | Being written by `generate` or autopilot | Only by Rankbox |
| `finished` | Published | Written and ready. The only status destinations and site keys ever see | `generate`, `finish`, autopilot |

`finished` means ready in Rankbox, not necessarily live on the website. `published_url` says where it is live. See [How publishing works](/docs/publishing/overview).

### List articles

```http
GET /sites/{site_id}/articles
```

| Query parameter | Type | Notes |
| --- | --- | --- |
| `status` | string | One status or several, comma-separated, for example `opportunity,scheduled` |
| `updated_since` | string | Only articles changed after this timestamp |
| `include` | string | `body` adds `body`, `body_markdown` and `body_html`. Left out by default |
| `limit`, `cursor` | | Pagination |

Sorted by `updated_at`, newest first. Returns `{ "articles": [ … ], "next_cursor": … }`.

### Create an article

```http
POST /sites/{site_id}/articles
```

Adds a topic to the plan, or an article you wrote yourself.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | Yes | 1 to 200 characters |
| `keyword` | string | No | At most 200 characters. Without it, the title is the keyword |
| `description` | string | No | The brief, at most 2,000 characters. The writer follows it |
| `status` | string | No | `opportunity` (default) or `scheduled` |
| `scheduled_date` | string | No | `YYYY-MM-DD`. For `scheduled`, defaults to the day after the last scheduled article |
| `queue_position` | integer | No | Defaults to the end of the queue |
| `body` | string | No | Your own Markdown. Then call [Finish an article](#finish-an-article) instead of generating |
| `tags` | array | No | At most 10 tags |
| `notes` | string | No | Never published |

Returns `201` with `{ "article": { … } }` and fires `article.created`.

### Get an article

```http
GET /sites/{site_id}/articles/{article_id}
```

Returns `{ "article": { … } }` with all three bodies, as in [The article object](#the-article-object).

### Update an article

```http
PATCH /sites/{site_id}/articles/{article_id}
```

| Field | Type | Notes |
| --- | --- | --- |
| `title`, `keyword`, `description`, `tags`, `notes` | | As in Create |
| `body` | string | The whole Markdown body |
| `status` | string | `opportunity` or `scheduled` only, and only for unwritten articles |
| `scheduled_date` | string or null | `YYYY-MM-DD` |
| `queue_position` | integer or null | Lower goes first. Use `0` or a negative number to move an article to the front |

An article that is `generating` can't be changed (`409 conflict`). Changes to a `finished` article are saved and fire `article.updated`, but a connected Webflow or Shopify site keeps the previous version until you call [Publish an article](#publish-an-article), like **Publish changes** in the editor. Site keys see the change at once.

> [!WARNING]
> A finished article can carry a link to another member's page, placed by the [backlink exchange](/docs/growth/backlink-exchange). Removing that link from `body` loses the credits the site earned for hosting it.

### Delete an article

```http
DELETE /sites/{site_id}/articles/{article_id}
```

Deletes the article permanently and returns `{ "deleted": true, "id": "…" }`. A credit spent writing it isn't returned. Copies already pushed to Webflow or Shopify, or pulled by a website, aren't removed from those places. An article that is `generating` can't be deleted until the job ends.

### Generate an article

```http
POST /sites/{site_id}/articles/{article_id}/generate
```

Writes the article, like **Write now** in the dashboard. It works on an `opportunity` or `scheduled` article and uses its `title`, `keyword` and `description` as the brief, plus the site's writing settings.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `word_count` | integer | 2750 | Target length, 800 to 6,000 words |

What happens:

1. Rankbox checks that the site may generate (an active trial with a card that passed the check, or the paid plan) and reserves 1 article credit.
2. The article moves to `generating` and a job starts. The call returns `202` with `{ "job": { … "type": "article.generate" … } }`.
3. The writer researches the pages that rank for the keyword, drafts the article, scores it and rewrites what failed. If the site takes part in the backlink exchange, one link to another member's page may be placed in it.
4. On success the article becomes `finished`, its `seo_score` is stored, it is pushed to every connected Webflow or Shopify destination, and `article.generated` and `article.finished` fire. The job's `result` has `article_id`, `status`, `seo_score`, `credits_spent` and `deliveries`.
5. On failure the article returns to its previous status, the credit is refunded and `article.generation_failed` fires.

Errors: `402 subscription_required`, `402 insufficient_credits`, `409 conflict` (already `finished` or `generating`), `429 rate_limited` (the AI limit, or 3 generations already in progress on this site). To rewrite a finished article, edit it with `PATCH` and `rewrite-section`. See [How articles are written](/docs/content/writing).

### Rewrite a section

```http
POST /sites/{site_id}/articles/{article_id}/rewrite-section
```

Rewrites one passage, like the editor's AI actions on selected text. Synchronous, usually 5 to 15 seconds. No credits; counts toward the AI rate limit.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `selection` | string | Yes | The exact passage, 1 to 10,000 characters |
| `action` | string | Yes | `rewrite`, `expand`, `shorten`, `improve_seo`, `change_tone` (apply the site's tone and voice) or `ai_suggest` |
| `apply` | boolean | No | `true` replaces the first exact match of `selection` in `body` and saves. Default `false` |

```json
{
  "rewrite": {
    "action": "shorten",
    "result": "Pick the tool that answers your three core questions without SQL.",
    "applied": true
  },
  "article": { "id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76", "updated_at": "2026-10-02T15:40:10Z" }
}
```

`article` is the full article when `applied` is `true`, and `null` otherwise. With `apply: true`, a `selection` that doesn't appear in `body` returns `422 validation_failed`.

### Score an article

```http
GET /sites/{site_id}/articles/{article_id}/score
```

Scores the current body exactly the way the editor does. Deterministic and free.

```json
{
  "analysis": {
    "score": 92,
    "checks": [
      { "id": "kw-title", "label": "Keyword in title", "status": "pass", "detail": "\"product analytics tool for b2b saas\" appears in the title." },
      { "id": "faq", "label": "FAQ for AI engines", "status": "pass", "detail": "FAQ section helps AI answer engines cite you." },
      { "id": "meta", "label": "Meta description", "status": "warn", "detail": "172 characters — aim for 120–160." }
    ],
    "metrics": {
      "words": 2140,
      "reading_time": 10,
      "keyword_density": 0.9,
      "keyword_count": 19,
      "h2": 7,
      "h3": 9,
      "links": 6,
      "readability": 52,
      "readability_grade": "Standard"
    }
  }
}
```

Check IDs: `kw-title`, `kw-intro`, `kw-density`, `words`, `h2`, `h3`, `lists`, `faq`, `meta`, `links`, `readability`. Each `status` is `pass`, `warn` or `fail`. See [The SEO and GEO score](/docs/content/scoring).

### Finish an article

```http
POST /sites/{site_id}/articles/{article_id}/finish
```

Marks an article you wrote yourself as finished, like **Publish** in the editor on a hand-written draft. The body must not be empty. No credit is spent. The article leaves the queue (`scheduled_date` and `queue_position` become `null`), is pushed to connected destinations, becomes visible to site keys and fires `article.finished`.

```json
{
  "article": { "id": "0c2e4a6b-8d1f-4a3c-9e5b-7d9f1b3d5e82", "status": "finished" },
  "deliveries": [
    { "destination": "webflow", "result": "created", "reason": null, "url": "https://northwind.example/blog/onboarding-metrics", "draft": false, "error": null }
  ]
}
```

`article` holds the full article; it is shortened here. Errors: `409 conflict` when already `finished` or `generating`, `422 validation_failed` when `body` is empty. Generated articles are finished already and don't need this call.

### Publish an article

```http
POST /sites/{site_id}/articles/{article_id}/publish
```

For a `finished` article: pushes the current version to every connected push destination (like **Publish changes**) and, if you send it, records where the article is live.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `published_url` | string | No | The article's live URL. Must be on the site's own domain: `website_url`, or the domain verified in the backlink exchange |

```http
POST /sites/6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64/articles/f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76/publish
Content-Type: application/json

{ "published_url": "https://northwind.example/blog/how-to-choose-a-product-analytics-tool-for-b2b-saas" }
```

```json
{
  "article": {
    "id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76",
    "status": "finished",
    "published_url": "https://northwind.example/blog/how-to-choose-a-product-analytics-tool-for-b2b-saas",
    "published_at": "2026-10-02T16:02:44Z"
  },
  "deliveries": []
}
```

A delivery has `destination` (`webflow` or `shopify`), `result` (`created`, `updated`, `unchanged`, `skipped` or `failed`), `reason` for skipped deliveries (`in_progress`, `edited_in_destination`, `deleted_in_destination`, `no_plan`), `url`, `draft` and `error`. An article edited or deleted on the platform itself is never overwritten or re-created. Recording `published_url` fires `article.published` and is what the backlink exchange uses to verify links hosted in the article. Pushing needs a trial or plan; recording a URL doesn't. Errors: `409 conflict` when the article isn't `finished`, `422 validation_failed` when the URL isn't on the site's domain. See [Live URLs and verification](/docs/publishing/live-urls).

## Jobs

### The job object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Job ID |
| `type` | string | `site.scan`, `research`, `article.generate`, `integration.sync` or `reddit.sweep` |
| `status` | string | `queued`, `running`, `completed` or `failed` |
| `site_id` | string | The site it runs for |
| `resource` | object or null | What it works on, for example `{ "type": "article", "id": "…" }` |
| `result` | object or null | The outcome, once `completed`. Shape depends on `type` |
| `error` | object or null | `{ "code", "message" }`, once `failed` |
| `created_at`, `started_at`, `finished_at` | string or null | Timestamps |

Jobs are kept for 7 days. A failed `article.generate` job's `error.code` is `generation_failed` or `timeout`; its credit is always refunded.

### Get a job

```http
GET /jobs/{job_id}?wait=30
```

`wait` (0 to 30 seconds, default 0) holds the request open until the job finishes or the time runs out, whichever comes first. A loop of `wait=30` calls is the cheapest way to wait for a job; each call counts as one request.

```json
{
  "job": {
    "id": "9a7e5c3b-1d2f-4e6a-8b9c-0d1e2f3a4b5c",
    "type": "article.generate",
    "status": "completed",
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "resource": { "type": "article", "id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76" },
    "result": {
      "article_id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76",
      "status": "finished",
      "seo_score": 100,
      "credits_spent": 1,
      "deliveries": []
    },
    "error": null,
    "created_at": "2026-10-02T15:22:05Z",
    "started_at": "2026-10-02T15:22:06Z",
    "finished_at": "2026-10-02T15:25:31Z"
  }
}
```

### List jobs

```http
GET /jobs?status=queued,running&site_id=6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64
```

Filters: `status`, `type`, `site_id`, plus `limit` and `cursor`. Newest first. Use it after a restart to pick up jobs you lost track of.

## Autopilot

### The autopilot object

| Field | Type | Description |
| --- | --- | --- |
| `site_id` | string | The site |
| `enabled` | boolean | **Write automatically** in Settings. On by default for new sites |
| `weekly_cadence` | integer | Articles a week, 1 to 7. Default 7 |
| `last_run_at` | string or null | When autopilot last wrote an article for this site |
| `next_due_at` | string or null | The earliest time the next article is due. Autopilot runs once a day and writes at the first run after this |
| `queue_length` | integer | Scheduled articles waiting |
| `blocked_reason` | string or null | `paused`, `no_plan`, `site_inactive`, `no_credits`, `queue_empty`, or `null` when nothing blocks it |

Autopilot writes the scheduled article with the lowest `queue_position`, then the earliest `scheduled_date`, spends 1 article credit, finishes it and pushes it to connected destinations. Articles it writes fire the same events as `generate`, with `trigger: "autopilot"`. See [Autopilot and the publishing schedule](/docs/content/autopilot).

### Get autopilot

```http
GET /sites/{site_id}/autopilot
```

Returns `{ "autopilot": { … } }`.

### Update autopilot

```http
PATCH /sites/{site_id}/autopilot
Content-Type: application/json

{ "enabled": true, "weekly_cadence": 3 }
```

Both fields are optional. Returns the updated object, as in [step 12 of the quickstart](/docs/agents/quickstart#step-12-turn-on-autopilot).

## Integrations

### The integration object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | `webflow`, `shopify`, `framer`, `wordpress` or `rest_api` |
| `name` | string | Display name |
| `delivery` | string | `push` (Rankbox writes into the platform) or `pull` (the website or plugin reads with a site key) |
| `available` | boolean | Whether this integration can be connected on this account. `rest_api` and `wordpress` always can |
| `status` | string | `not_connected`, `pending`, `setup`, `active`, `idle`, `error` or `disconnected` |
| `connected_at` | string or null | When it was connected |
| `last_published_at` | string or null | Last successful push, or last use of a site key for pull integrations |
| `last_error` | string or null | The last push error |
| `settings` | object or null | Platform settings, below |
| `counts` | object or null | Push only: `in_destination`, `not_yet`, `edited_in_destination` |

`pending` means a connect link is waiting for the owner. `setup` means connected but not configured. `idle` is a pull integration whose keys haven't been used for 48 hours.

Settings by platform:

| `id` | `settings` fields |
| --- | --- |
| `webflow` | `webflow_site_id`, `webflow_site_name`, `collection_id`, `collection_name`, `field_map` (`body`, `summary`, `tags`, `published_at`), `publish_mode` (`live` or `draft`) |
| `shopify` | `shop`, `shop_name`, `shopify_blog_id`, `blog_title`, `publish_mode` (`visible` or `hidden`), `admin_url` |
| `framer`, `wordpress`, `rest_api` | `keys` (active site keys), `last_key_used_at` |

### List integrations

```http
GET /sites/{site_id}/integrations
```

```json
{
  "integrations": [
    { "id": "webflow", "name": "Webflow", "delivery": "push", "available": true, "status": "not_connected", "connected_at": null, "last_published_at": null, "last_error": null, "settings": null, "counts": null },
    { "id": "rest_api", "name": "REST API", "delivery": "pull", "available": true, "status": "active", "connected_at": "2026-10-02T15:30:12Z", "last_published_at": "2026-10-02T15:58:03Z", "last_error": null, "settings": { "keys": 1, "last_key_used_at": "2026-10-02T15:58:03Z" }, "counts": null }
  ],
  "next_cursor": null
}
```

All five integrations are always listed; this example is shortened. The [publishing pages](/docs/publishing/overview) say which platform add-ons are open to every account.

### Get an integration

```http
GET /sites/{site_id}/integrations/{integration_id}
```

Returns `{ "integration": { … }, "options": { … } }`. `options` lists the choices for configuring a connected push integration:

- `webflow`: `webflow_sites` (`id`, `display_name`, `domain`, `published`). Add `?webflow_site_id=` to also get `collections` (`id`, `display_name`, `slug`), and add `&collection_id=` to get `fields` (`slug`, `display_name`, `type`, `is_required`) and `suggested_field_map`.
- `shopify`: `blogs` (`id`, `title`).
- Pull integrations: `options` is `null`.

### Connect an integration

```http
POST /sites/{site_id}/integrations/{integration_id}/connect
```

Starts a connection. Needs a trial or plan. What comes back depends on the platform:

| `id` | Response | The owner's part |
| --- | --- | --- |
| `webflow` | `authorize_url`, valid 7 days | Opens it, then approves Rankbox on Webflow's own screen |
| `shopify` | `install_url`, valid 7 days | Opens it in the store's admin and approves the Rankbox app; the store then links to this site automatically |
| `framer` | `site_key` with its secret | Opens the Rankbox plugin in the Framer project and pastes the key |
| `wordpress`, `rest_api` | `site_key` with its secret | Nothing: deploy the key to the website's server |

```json
{
  "connection": {
    "integration_id": "webflow",
    "status": "pending",
    "authorize_url": "https://rankbox.xyz/connect/webflow/cr_xxxxxxxxxxxx",
    "install_url": null,
    "site_key": null,
    "expires_at": "2026-10-09T15:31:00Z"
  }
}
```

The connect page shows the owner which site and which agent asked. When they finish, `integration.connected` fires and `status` becomes `setup` (Webflow, Shopify) or `active`. Errors: `402 subscription_required`, `409 integration_unavailable` when `available` is `false`, `409 conflict` when already connected.

### Configure an integration

```http
PATCH /sites/{site_id}/integrations/{integration_id}
```

Finishes setup of a push integration. Pull integrations have nothing to configure (`409 conflict`).

| `id` | Fields |
| --- | --- |
| `webflow` | `webflow_site_id`, `collection_id`, `field_map` with `body` (required, a rich-text field), `summary`, `tags`, `published_at`, and `publish_mode`. `live` needs a Webflow site that has been published at least once |
| `shopify` | `shopify_blog_id`, `publish_mode` (`visible` or `hidden`) |

```http
PATCH /sites/6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64/integrations/webflow
Content-Type: application/json

{
  "webflow_site_id": "64f1a2b3c4d5e6f708192a3b",
  "collection_id": "64f1a2b3c4d5e6f708192c4d",
  "field_map": { "body": "post-body", "summary": "post-summary", "tags": null, "published_at": "published-date" },
  "publish_mode": "draft"
}
```

Returns `{ "integration": { … "status": "active" … } }`. A field map the collection won't accept returns `422 validation_failed` with one `details` entry per problem. See [Webflow](/docs/publishing/webflow) and [Shopify](/docs/publishing/shopify).

### Sync an integration

```http
POST /sites/{site_id}/integrations/{integration_id}/sync
```

Pushes every finished article that isn't on the platform yet and every article changed since its last push. Returns `202` with an `integration.sync` job. The result:

```json
{ "created": 12, "updated": 1, "unchanged": 3, "skipped": 1, "failed": 0, "remaining": 0, "errors": [] }
```

When `remaining` is above 0, the run stopped at its time limit: call sync again. Pull integrations return `409 conflict`; they sync from their own side.

### Disconnect an integration

```http
DELETE /sites/{site_id}/integrations/{integration_id}
```

Stops pushing to the platform. For Webflow, Rankbox deletes its stored token. For Shopify, the site is unlinked; the app stays installed until the merchant removes it. Items already on the platform stay there. Returns `{ "integration": { … "status": "disconnected" … } }`. To stop a pull integration, revoke its site keys.

## Site keys

Site keys (`rv_live_…`) let a website or plugin read one site's finished articles through the [public API](/docs/api/overview). Create them for the website; never deploy the agent key.

### List site keys

```http
GET /sites/{site_id}/keys
```

```json
{
  "site_keys": [
    {
      "id": "7b9d1f3a-5c7e-4a2b-9d4f-6e8a0c2b4d61",
      "name": "northwind.example website",
      "prefix": "rv_live_d4e5f6…",
      "last_used_at": "2026-10-02T15:58:03Z",
      "revoked_at": null,
      "created_at": "2026-10-02T15:30:12Z"
    }
  ],
  "next_cursor": null
}
```

Revoked keys are included, with `revoked_at` set.

### Create a site key

```http
POST /sites/{site_id}/keys
Content-Type: application/json

{ "name": "northwind.example website" }
```

`name` is optional, at most 60 characters, default `API key`. Returns `201` with `{ "site_key": { … "key": "rv_live_xxxxxxxxxxxx" … } }`; the secret is shown only here. Needs a trial or plan (`402 subscription_required`), and a site key stops working while the account has neither.

### Revoke a site key

```http
DELETE /sites/{site_id}/keys/{key_id}
```

Returns `{ "site_key": { … "revoked_at": "2026-10-03T09:00:00Z" } }`. Revocation is immediate and permanent.

## Credits

### Get credits

```http
GET /sites/{site_id}/credits
```

Each site has its own balances.

```json
{
  "credits": {
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "articles": { "total": 7, "used": 1, "remaining": 6, "period_end": "2026-10-09T15:20:44Z" },
    "backlinks": { "balance": 0, "escrowed": 0, "period_end": null },
    "reddit_replies": { "balance": 0, "period_end": null }
  }
}
```

| Balance | Granted | Resets |
| --- | --- | --- |
| `articles` | 7 in the trial, 30 per paid period | Each period, no rollover |
| `backlinks` | 30 per paid period, as a top-up that never lifts the balance past 90; plus credits earned by hosting links | Doesn't reset |
| `reddit_replies` | 30 per paid period | Each period, no rollover |

See [Plans and credits](/docs/account/plans-and-credits).

## Rank

### Get Rank

```http
GET /sites/{site_id}/rank
```

The Rank page's data: how much of the site's tracked keyword market has a finished article. It doesn't measure rankings or AI citations; searches and traffic are estimates.

```json
{
  "rank": {
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "coverage": { "basis": "searches", "total": 48200, "published": 6100, "planned": 21900, "open": 20200 },
    "market": [
      {
        "keyword": "product analytics tool for b2b saas",
        "searches": 1900,
        "intent": "Commercial",
        "trend": "Rising",
        "traffic_estimate": 1400,
        "status": "published",
        "article_id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76",
        "score": 100
      }
    ]
  }
}
```

`coverage.basis` is `searches` when keywords have search volumes (the totals are monthly searches) and `topics` otherwise (the totals are keyword counts). A market row's `status` is `published`, `writing`, `scheduled`, `idea` or `gap`. See [Rank: AI search visibility](/docs/growth/rank).

## Backlinks

The backlink exchange is paid-only: reads work on any account, changes need a paid plan (`402 paid_plan_required`). Credits settle only when a link is verified live. See [Backlink exchange](/docs/growth/backlink-exchange).

### Get the backlink overview

```http
GET /sites/{site_id}/backlinks
```

```json
{
  "backlinks": {
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "paid": true,
    "domain": "northwind.example",
    "status": "verified",
    "verified_at": "2026-10-17T11:02:00Z",
    "opted_in": true,
    "authority_score": 34,
    "tier": 2,
    "reputation": 100,
    "niche": "B2B product analytics",
    "topic_tags": ["product analytics", "saas metrics"],
    "blocked_categories": ["gambling", "crypto"],
    "max_links_per_article": 1,
    "credits": { "balance": 30, "escrowed": 1, "lifetime_earned": 0, "lifetime_spent": 0 },
    "counts": { "live_inbound": 0, "live_hosted": 0, "in_progress": 1 }
  }
}
```

`status` is `unverified`, `verifying`, `verified` or `suspended`, or `null` before a domain is set.

### Update backlink settings

```http
PATCH /sites/{site_id}/backlinks
```

| Field | Type | Notes |
| --- | --- | --- |
| `opted_in` | boolean | Host other members' links in this site's articles. Needs a verified domain |
| `max_links_per_article` | integer | 0 to 2 member links per article |
| `niche` | string | At most 120 characters |
| `topic_tags` | array | At most 15 tags, 2 to 40 characters each |
| `blocked_categories` | array | Any of `gambling`, `adult`, `crypto`, `cannabis`, `loans`, `pharma`, `weapons`, `tobacco`, `politics`, `dating` |

Returns the updated `{ "backlinks": { … } }`.

### Set the exchange domain

```http
POST /sites/{site_id}/backlinks/domain
Content-Type: application/json

{ "domain": "northwind.example" }
```

Returns the ways to prove ownership. Any one of them works:

```json
{
  "verification": {
    "domain": "northwind.example",
    "status": "unverified",
    "token": "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
    "methods": {
      "dns_txt": { "host": "_rankbox.northwind.example", "value": "rankbox-site-verification=c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6" },
      "meta_tag": { "tag": "<meta name=\"rankbox-site-verification\" content=\"c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6\">" },
      "well_known": { "url": "https://northwind.example/.well-known/rankbox-verification", "content": "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6" }
    }
  }
}
```

### Verify the exchange domain

```http
POST /sites/{site_id}/backlinks/domain/verify
```

Checks all three methods now. Counts toward the AI rate limit.

```json
{
  "verification": {
    "domain": "northwind.example",
    "status": "verified",
    "checks": [
      { "method": "dns_txt", "ok": false, "seen": "no TXT record at _rankbox.northwind.example" },
      { "method": "well_known", "ok": false, "seen": "404" },
      { "method": "meta_tag", "ok": true, "seen": "meta tag matched" }
    ]
  }
}
```

### List backlink targets

```http
GET /sites/{site_id}/backlinks/targets
```

A target is a page on your site you want links to. Returns `{ "targets": [ … ], "next_cursor": null }`. Each target has `id`, `url`, `anchors`, `topic_tags`, `priority`, `max_new_links_per_month`, `active`, `live_count`, `last_placed_at` and `created_at`.

### Create a backlink target

```http
POST /sites/{site_id}/backlinks/targets
Content-Type: application/json

{
  "url": "https://northwind.example/features/retention",
  "anchors": ["retention analysis", "cohort retention tool", "Northwind retention reports"],
  "topic_tags": ["retention", "saas metrics"],
  "priority": 7,
  "max_new_links_per_month": 4
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `url` | string | Yes | A page on the verified domain |
| `anchors` | array | Yes | 3 to 5 different anchor texts, 2 to 80 characters each |
| `topic_tags` | array | No | At most 10 |
| `priority` | integer | No | 1 to 10, default 5 |
| `max_new_links_per_month` | integer | No | 1 to 10, default 4 |
| `active` | boolean | No | Default `true` |

Returns `201` with `{ "target": { … } }`. At most 25 targets per site.

### Update a backlink target

```http
PATCH /sites/{site_id}/backlinks/targets/{target_id}
```

Any field of Create. Returns `{ "target": { … } }`.

### Delete a backlink target

```http
DELETE /sites/{site_id}/backlinks/targets/{target_id}
```

Returns `{ "deleted": true, "id": "…" }`. Links already live stay live.

### List placements

```http
GET /sites/{site_id}/backlinks/placements?direction=inbound&status=live
```

`direction` is `inbound` (links to your targets) or `hosted` (links your articles carry for others). `status` is any of `reserved`, `placed`, `live`, `lost`, `expired`, `cancelled`.

```json
{
  "placements": [
    {
      "id": "6a8c0e2f-4b6d-4e8a-9c1e-3f5b7d9a1c34",
      "direction": "inbound",
      "status": "live",
      "target_url": "https://northwind.example/features/retention",
      "anchor_used": "cohort retention tool",
      "host_url": "https://partner.example/blog/saas-churn-playbook",
      "host_article_id": null,
      "credits": 2,
      "reserved_at": "2026-10-18T09:00:00Z",
      "placed_at": "2026-10-18T09:04:00Z",
      "live_at": "2026-10-19T06:00:00Z",
      "ended_at": null,
      "expires_at": "2026-11-17T09:00:00Z",
      "last_checked_at": "2026-10-25T06:00:00Z",
      "end_reason": null
    }
  ],
  "next_cursor": null
}
```

`host_article_id` is set on hosted placements: the article that carries the link.

### Remove a hosted link

```http
DELETE /sites/{site_id}/backlinks/placements/{placement_id}
```

For a hosted placement only. Rankbox unlinks the anchor in your article (the words stay). A live link's earned credits are clawed back; a link not yet live is cancelled and its credits return to the member who requested it. Returns `{ "placement": { … "status": "cancelled" … } }`.

## Reddit

Reddit Presence finds Reddit threads where the site's buyers ask questions and drafts replies. Rankbox never posts to Reddit and never holds a Reddit login: a person posts the reply from their own account and the agent records the permalink. Paid-only: reads work on any account, actions need a paid plan. See [Reddit Presence](/docs/growth/reddit-presence).

### Get Reddit Presence

```http
GET /sites/{site_id}/reddit
```

```json
{
  "reddit": {
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "access": "paid",
    "enabled": true,
    "sweep_enabled": true,
    "niche": "B2B product analytics",
    "topic_tags": ["product analytics", "saas metrics"],
    "disclosure_line": "Full disclosure: I work on {brand}.",
    "tone": "plain",
    "max_links_per_reply": 1,
    "allow_subreddits": [],
    "deny_subreddits": ["startups"],
    "keywords_per_sweep": 12,
    "last_sweep_at": "2026-10-18T06:00:00Z",
    "credits": { "balance": 28, "period_end": "2026-11-17T15:20:44Z" }
  }
}
```

`access` is `paid`, `trial` (shown the feature, can't use it yet), `lapsed` (history read-only) or `none`.

### Update Reddit settings

```http
PATCH /sites/{site_id}/reddit
```

| Field | Type | Notes |
| --- | --- | --- |
| `enabled` | boolean | `true` turns Reddit Presence on for the site. The site needs a brand name |
| `sweep_enabled` | boolean | Automatic sweeps |
| `disclosure_line` | string | 10 to 200 characters. Must name the brand (or use `{brand}`) and say the writer works on it |
| `niche` | string | At most 160 characters |
| `topic_tags` | array | At most 12 |
| `tone` | string | At most 80 characters, default `plain` |
| `max_links_per_reply` | integer | 0 or 1 |
| `allow_subreddits`, `deny_subreddits` | array | At most 50 subreddit names each, without `r/` |
| `keywords_per_sweep` | integer | 1 to 30, default 12 |

Returns `{ "reddit": { … } }`.

### Start a Reddit sweep

```http
POST /sites/{site_id}/reddit/sweeps
```

Searches Reddit now for threads matching the site's keywords. Free; counts toward the AI rate limit. Returns `202` with a `reddit.sweep` job whose result has `threads_seen` and `opportunities_created`. One sweep at a time per site (`409 conflict`).

### List Reddit threads

```http
GET /sites/{site_id}/reddit/threads?status=new,saved
```

`status` is any of `new`, `saved`, `drafted`, `posted`, `dismissed`, `dead`, `stale`. Best fit first.

```json
{
  "threads": [
    {
      "id": "0e2c4a6b-8d1f-4c3e-9a5b-7d9f1b3d5e70",
      "status": "new",
      "fit": 82,
      "matched_keyword": "product analytics tool",
      "channel": "serp",
      "blocked_reason": null,
      "thread": {
        "reddit_id": "1f3k9qz",
        "subreddit": "saas",
        "permalink": "https://www.reddit.com/r/saas/comments/1f3k9qz/which_product_analytics_tool_for_a_10person_b2b/",
        "title": "Which product analytics tool for a 10-person B2B SaaS?",
        "up_votes": 48,
        "num_comments": 31,
        "posted_at": "2026-10-16T19:12:00Z",
        "is_locked": false
      },
      "draft": null,
      "reply": null,
      "first_seen_at": "2026-10-18T06:00:00Z"
    }
  ],
  "next_cursor": null
}
```

`fit` is 0 to 100, `null` for blocked threads; `blocked_reason` is `archived`, `likely_archived`, `locked`, `removed`, `subreddit_denied`, `promo_banned` or `off_topic`.

### Get a Reddit thread

```http
GET /sites/{site_id}/reddit/threads/{thread_id}
```

Returns `{ "thread": { … } }` with the thread's body and top comments, the latest `draft` and the recorded `reply`.

### Update a Reddit thread

```http
PATCH /sites/{site_id}/reddit/threads/{thread_id}
Content-Type: application/json

{ "status": "dismissed", "dismiss_reason": "Asking for free tools only" }
```

`status` can be set to `saved`, `dismissed` or `new` (restore). A `posted` thread can't be dismissed.

### Draft a Reddit reply

```http
POST /sites/{site_id}/reddit/threads/{thread_id}/drafts
Content-Type: application/json

{ "instructions": "Mention the free plan only if asked." }
```

The first call drafts a reply and spends 1 Reddit reply credit. Later calls on the same thread rewrite the latest draft: 1 credit each, at most 3 rewrites, and the first rewrite is free when the draft failed a compliance check. `instructions` is optional, at most 500 characters. Synchronous.

```json
{
  "draft": {
    "id": "8c0e2a4b-6d8f-4b1c-9e3a-5c7e9b1d3f46",
    "thread_id": "0e2c4a6b-8d1f-4c3e-9a5b-7d9f1b3d5e70",
    "body": "For a 10-person team, start from the three questions you need answered weekly…\n\nFull disclosure: I work on Northwind Analytics.",
    "edited_body": null,
    "compliance": {
      "pass": true,
      "failures": 0,
      "unknowns": 1,
      "checks": [
        { "id": "disclosure", "label": "Discloses that you work there", "state": "pass", "detail": "Says who you are up front." },
        { "id": "answers_first", "label": "Answers the question first", "state": "pass", "detail": "Helps before it mentions you." },
        { "id": "subreddit_rules", "label": "Subreddit rules", "state": "unknown", "detail": "Couldn't read this subreddit's rules. Check them before posting." }
      ]
    },
    "credits_spent": 1,
    "regen_count": 0,
    "created_at": "2026-10-18T09:20:00Z",
    "updated_at": "2026-10-18T09:20:00Z"
  }
}
```

Errors: `402 paid_plan_required`, `402 insufficient_credits`, `409 conflict` after 3 rewrites or for a blocked thread. A refused or failed draft refunds its credit.

### Edit a Reddit draft

```http
PATCH /sites/{site_id}/reddit/drafts/{draft_id}
Content-Type: application/json

{ "edited_body": "For a 10-person team, start from the three questions…" }
```

Free. Returns `{ "draft": { … } }`. The text to hand to a person is `edited_body` when set, otherwise `body`.

### Record a posted reply

```http
POST /sites/{site_id}/reddit/replies
Content-Type: application/json

{
  "thread_id": "0e2c4a6b-8d1f-4c3e-9a5b-7d9f1b3d5e70",
  "draft_id": "8c0e2a4b-6d8f-4b1c-9e3a-5c7e9b1d3f46",
  "permalink": "https://www.reddit.com/r/saas/comments/1f3k9qz/comment/lq2x8ab/"
}
```

Call this after a person has posted the reply from their own Reddit account. `permalink` must be a `https://www.reddit.com/` link to a comment in that thread. Leave it out to record that a reply was posted before the link is known (`status: "claimed"`), then call again with it. One reply per thread per account.

```json
{
  "reply": {
    "id": "2a4c6e8b-0d2f-4a4c-8e6b-9d1f3a5c7e58",
    "thread_id": "0e2c4a6b-8d1f-4c3e-9a5b-7d9f1b3d5e70",
    "draft_id": "8c0e2a4b-6d8f-4b1c-9e3a-5c7e9b1d3f46",
    "permalink": "https://www.reddit.com/r/saas/comments/1f3k9qz/comment/lq2x8ab/",
    "status": "posted",
    "score": null,
    "posted_at": "2026-10-18T10:05:00Z",
    "confirmed_at": null,
    "removed_at": null,
    "last_checked_at": null
  }
}
```

Rankbox then checks the comment on its own: `status` moves to `confirmed` (`reddit.reply_verified`), or `removed` or `not_found` (`reddit.reply_removed`). Recording and verifying never spend credits.

### List Reddit replies

```http
GET /sites/{site_id}/reddit/replies?status=posted,confirmed
```

Returns `{ "replies": [ … ], "next_cursor": … }`.

## Billing

### The billing object

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | `none`, `trialing`, `active`, `past_due` or `canceled` |
| `paid` | boolean | Whether an invoice has been paid and the plan is current. Opens backlinks, Reddit and Studio |
| `card_verified` | boolean or null | The trial's card check. `false` blocks generation until the card is updated |
| `trial_ends_at` | string or null | End of the trial |
| `current_period_end` | string or null | When the current period renews or ends |
| `cancel_at_period_end` | boolean | Cancellation is scheduled |
| `past_due_since` | string or null | When a payment first failed. Generation keeps working for 48 hours after it |
| `plan` | object | `name` (`Business`), `amount` (49.5), `currency`, `interval` |
| `studio_sites` | integer | Studio sites billed on top of the plan |
| `monthly_total` | number | The monthly bill, plan plus Studio sites |

### Get billing

```http
GET /billing
```

Returns `{ "billing": { … } }`, as in [step 7 of the quickstart](/docs/agents/quickstart#step-7-confirm-the-trial-started).

### Create a checkout link

```http
POST /billing/checkout
```

Creates a link for the owner to start the plan. The owner enters their card on Stripe's checkout page; Rankbox never sees the card number.

```json
{
  "checkout": {
    "mode": "trial",
    "checkout_url": "https://rankbox.xyz/checkout/co_xxxxxxxxxxxx",
    "expires_at": "2026-10-09T14:07:02Z",
    "trial_days": 7,
    "price": { "amount": 49.5, "currency": "usd", "interval": "month" }
  }
}
```

`mode` is `trial` (7 days free, then $49.50 a month) for an account that has never had a subscription, and `plan` (charged today) for one whose earlier subscription ended. The link is valid for 7 days and can be opened more than once until checkout completes. When it does, `billing.trial_started` (or `billing.activated`) fires. An account with a current subscription gets `409 conflict`; use the portal link instead.

### Create a portal link

```http
POST /billing/portal
```

Returns `{ "portal": { "portal_url": "https://rankbox.xyz/billing/portal/po_xxxxxxxxxxxx", "expires_at": "…" } }`, valid for 24 hours. Stripe's billing portal is where the owner updates the card, downloads invoices and cancels. Hand it to the owner. Needs an existing subscription (`409 conflict` otherwise).

### End the trial now

```http
POST /billing/activate
```

Ends the trial today and charges the first $49.50 to the card on file, like **Unlock everything now** in **Plan & Billing**. The site's article balance resets to 30, and the backlink exchange, Reddit Presence and Studio open. Send an `Idempotency-Key`.

```json
{
  "billing": { "status": "active", "paid": true, "current_period_end": "2026-11-04T10:00:00Z" },
  "charged": { "amount": 49.5, "currency": "usd" }
}
```

`billing` holds the full object; it is shortened here. Errors: `409 conflict` when not trialing, `402 payment_failed` with `action_url` when the card is declined (the trial continues), `403 human_required` when the bank asks the cardholder to authenticate.

### Get a Studio quote

```http
GET /billing/studio-quote
```

What one more Studio site costs today, previewed by Stripe.

```json
{
  "studio_quote": {
    "block": null,
    "message": null,
    "price_per_site": 49.5,
    "due_today": 24.75,
    "proration_date": 1760954400,
    "renews_at": "2026-11-04T10:00:00Z",
    "allowance": { "articles": 15, "backlink_credits": 15, "reddit_replies": 15 },
    "studio_sites": 0,
    "monthly_after": 99,
    "card": { "brand": "visa", "last4": "4242" }
  }
}
```

`block` says why a site can't be added now: `no_plan`, `trialing`, `past_due`, `canceling` or `lapsed`, with `message` in words. Pass `proration_date` to [Add a Studio site](#add-a-studio-site) within 30 minutes to be charged exactly `due_today`.

## Events and webhooks

The payloads, signatures and retry rules are on [Events and webhooks](/docs/agents/events). These are the endpoints.

### List events

```http
GET /events?since=2026-10-02T14:00:00Z
```

| Query parameter | Type | Notes |
| --- | --- | --- |
| `since` | string | Start after this timestamp. Use on the first call |
| `cursor` | string | Continue from a previous `next_cursor`. Use on every later call |
| `types` | string | Comma-separated event types, for example `article.finished,credits.low` |
| `site_id` | string | Only events about this site |
| `limit` | integer | 1 to 100, default 50 |

Oldest first. Returns `{ "events": [ … ], "next_cursor": "…", "has_more": false }`. `next_cursor` is always set, even when no events came back, so the next poll starts where this one ended. Events are kept for 30 days.

### List webhooks

```http
GET /webhooks
```

Returns `{ "webhooks": [ … ], "next_cursor": null }`, without secrets.

### Create a webhook

```http
POST /webhooks
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `url` | string | Yes | Public `https` URL |
| `events` | array | Yes | Event types, or `["*"]` for all |
| `description` | string | No | At most 200 characters |

```json
{
  "webhook": {
    "id": "5e3c1a9f-7b2d-4f8e-a1c3-6d4b2e9f8a17",
    "url": "https://agent.northwind.example/hooks/rankbox",
    "events": ["article.finished", "article.published", "credits.low"],
    "description": "Atlas",
    "enabled": true,
    "disabled_reason": null,
    "secret": "whsec_xxxxxxxxxxxx",
    "created_by": { "type": "agent", "id": "2d4f6a8c-1e3b-4c5d-8f7a-9b0c1d2e3f45", "name": "Atlas" },
    "created_at": "2026-10-02T16:10:00Z",
    "last_delivery_at": null,
    "last_delivery_status": null
  }
}
```

`secret` is shown only here. At most 10 endpoints per account.

### Update a webhook

```http
PATCH /webhooks/{webhook_id}
```

Change `url`, `events`, `description` or `enabled`. Setting `enabled: true` re-enables an endpoint Rankbox disabled after repeated failures. Returns `{ "webhook": { … } }` without the secret.

### Delete a webhook

```http
DELETE /webhooks/{webhook_id}
```

Returns `{ "deleted": true, "id": "…" }`. Deliveries in flight are dropped.

### Send a test event

```http
POST /webhooks/{webhook_id}/test
```

Sends a signed `webhook.test` event to the endpoint now and returns `{ "delivery": { "status": 200, "duration_ms": 184, "error": null } }`.

## Related

- [Quickstart for AI agents](/docs/agents/quickstart): these endpoints in order.
- [Events and webhooks](/docs/agents/events): event types and signatures.
- [Billing, credits and limits](/docs/agents/billing-and-limits): plans, credits, rate limits.
- [Agent MCP tools](/docs/agents/mcp): the same operations as MCP tools.
- [Errors](/docs/api/errors): the public API's errors, which share this envelope.
