---
title: Quickstart for AI agents
nav_title: Quickstart
description: Step-by-step instructions an AI agent can execute: create a Rankbox account, start the trial, plan, generate, publish, turn on autopilot and listen for events.
order: 2
updated: 2026-10-02
---

This page is written for an AI agent to execute from top to bottom. It takes a new project from no Rankbox account to a published article and a running autopilot, with one hand-off to a person (the card for the trial). Every step shows the exact request and the response to expect.

## Before you start

You need four things:

| Item | Example | Notes |
| --- | --- | --- |
| The owner's email | `maya@northwind.example` | The person or business the account is for. Rankbox emails them a claim link |
| The website URL | `https://northwind.example` | A public `http` or `https` address. Rankbox scans it |
| Your agent's name | `Atlas` | Shown to the owner in emails and in the activity log |
| A secret store | An environment variable, a vault, your platform's secrets | The agent key is shown once |

All requests go to `https://rankbox.xyz/api/agent/v1`, send and receive JSON, and use snake_case field names. Errors look like `{ "error": "…", "code": "…" }`. If the owner already has a Rankbox account, skip step 1 and get a key through [Agent authentication](/docs/agents/authentication) instead.

## Step 1: Create the account

Send the owner's email, the website and your identity. This call needs no authentication. Send an `Idempotency-Key` so a retry after a network error returns the same account instead of failing.

```bash title="cURL"
curl -X POST https://rankbox.xyz/api/agent/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 0f7c1d52-create-northwind" \
  -d '{
    "email": "maya@northwind.example",
    "site_url": "https://northwind.example",
    "site_name": "Northwind Analytics",
    "agent": {
      "name": "Atlas",
      "operator": "Northwind Analytics",
      "contact_url": "https://northwind.example/atlas"
    }
  }'
```

A `201 Created` response:

```json
{
  "account": {
    "id": "8b0d3c4e-2f6a-4f1b-9d3e-5a7c1e2b9f40",
    "email": "maya@northwind.example",
    "claimed": false,
    "claimed_at": null,
    "created_at": "2026-10-02T14:03:11Z",
    "created_by_agent": {
      "name": "Atlas",
      "operator": "Northwind Analytics",
      "contact_url": "https://northwind.example/atlas"
    },
    "primary_site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "billing_status": "none"
  },
  "site": {
    "id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "kind": "primary",
    "status": "active",
    "brand_name": "Northwind Analytics",
    "website_url": "https://northwind.example",
    "product_description": "",
    "avatar_url": null,
    "writing": {
      "tone": "Professional",
      "writing_style": "Balanced",
      "audience": "Founders / Entrepreneurs",
      "brand_voice": ""
    },
    "scan_status": "running",
    "billed_from": null,
    "removes_at": null,
    "archived_at": null,
    "dashboard_url": "https://rankbox.xyz/dashboard?site=6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "created_at": "2026-10-02T14:03:11Z"
  },
  "scan_job_id": "3c5e7a9b-1d3f-4b5c-8e7a-9c1b3d5f7a92",
  "agent_key": {
    "id": "2d4f6a8c-1e3b-4c5d-8f7a-9b0c1d2e3f45",
    "type": "key",
    "name": "Atlas",
    "key": "rv_agent_xxxxxxxxxxxx",
    "prefix": "rv_agent_a1b2c3…",
    "client_id": null,
    "operator": "Northwind Analytics",
    "contact_url": "https://northwind.example/atlas",
    "created_at": "2026-10-02T14:03:11Z",
    "last_used_at": null
  },
  "claim_url": "https://rankbox.xyz/claim/ct_xxxxxxxxxxxx"
}
```

If the response is `409` with `"code": "account_exists"`, the email already has a Rankbox account. Stop here and follow [Connect to an existing account](/docs/agents/authentication#connect-to-an-existing-account).

## Step 2: Store the key and check it

Save `agent_key.key` to your secret store now. Rankbox keeps only a hash and can't show it again. Then confirm it works.

```bash title="cURL"
export RANKBOX_AGENT_KEY="rv_agent_xxxxxxxxxxxx"
export SITE_ID="6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64"

curl https://rankbox.xyz/api/agent/v1/account \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

The response is `{ "account": { … } }` with the same fields as in step 1. Tell the owner, in your own channel, that the account exists and that an email from Rankbox is on its way. Share `claim_url` too: it is the same link as in the email and lets them sign in.

## Step 3: Wait for the site scan

Rankbox starts scanning the website the moment the account exists. The scan reads the brand, finds about 20 keywords buyers search for and plans one article per keyword, up to 30. It usually takes 1 to 3 minutes. Poll every 15 seconds:

```bash title="cURL"
curl "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/scan" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

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

`status` moves from `queued` to `running` to `completed` or `failed`. On `failed`, read `error` and re-run with `POST /sites/{site_id}/scan`. The scan put 4 articles in the plan as ideas (`opportunity`) and 16 in the autopilot queue (`scheduled`), one a day from tomorrow.

## Step 4: Ask the owner to start the trial

Writing articles needs the 7-day trial, and the trial needs a card that only the owner can enter. Create the checkout link now so the owner can act while you plan.

```bash title="cURL"
curl -X POST https://rankbox.xyz/api/agent/v1/billing/checkout \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Idempotency-Key: 5b1e-checkout-northwind"
```

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

Send `checkout_url` to the owner with the facts they need to decide. For example:

```text
Rankbox is set up for northwind.example and has a plan of 20 articles.
To let me start writing, start the 7-day free trial here:
https://rankbox.xyz/checkout/co_xxxxxxxxxxxx
You add a card but aren't charged today. The plan is $49.50/month from day 8,
and you can cancel before then in the billing portal.
```

Don't wait for the answer. Steps 5 and 6 work without a plan.

## Step 5: Add topics and run research

Read the plan the scan built:

```bash title="cURL"
curl "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/articles?status=opportunity,scheduled&limit=50" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

The response is `{ "articles": [ … ], "next_cursor": null }`. Each article has `id`, `title`, `keyword`, `description`, `status`, `scheduled_date` and `queue_position`; lists leave out the body.

Add a topic you already know matters, straight onto the schedule:

```bash title="cURL"
curl -X POST "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/articles" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Product analytics vs. web analytics: what a B2B SaaS team needs",
    "keyword": "product analytics vs web analytics",
    "description": "Explain the difference with examples from B2B SaaS, then a checklist for choosing.",
    "status": "scheduled",
    "scheduled_date": "2026-10-05"
  }'
```

The response is `201` with `{ "article": { … "status": "scheduled" … } }`. To find more topics, run research around a seed and save what it finds:

```bash title="cURL"
curl -X POST "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/research" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "seed": "feature adoption", "ideas": 10, "save": true }'
```

Research returns `202 Accepted` with a job. Poll it the same way as in step 8. With `"save": true`, the keywords it finds are added to the site and the article ideas land in the plan as `opportunity`.

## Step 6: Set the writing voice

The scan fills in tone and audience. Tighten them so every article sounds right:

```bash title="cURL"
curl -X PATCH "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "writing": {
      "tone": "Confident",
      "writing_style": "In-depth and data-driven",
      "audience": "Product managers at B2B SaaS companies",
      "brand_voice": "Say \"teams\", not \"users\".\nNever name competitors.\nUse US spelling."
    }
  }'
```

`brand_voice` holds the house rules, one per line. See [Brand voice and writing settings](/docs/content/brand-voice).

## Step 7: Confirm the trial started

Check billing until the owner has finished checkout:

```bash title="cURL"
curl https://rankbox.xyz/api/agent/v1/billing \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

```json
{
  "billing": {
    "status": "trialing",
    "paid": false,
    "card_verified": true,
    "trial_ends_at": "2026-10-09T15:20:44Z",
    "current_period_end": "2026-10-09T15:20:44Z",
    "cancel_at_period_end": false,
    "past_due_since": null,
    "plan": { "name": "Business", "amount": 49.5, "currency": "usd", "interval": "month" },
    "studio_sites": 0,
    "monthly_total": 49.5
  }
}
```

You can generate when `status` is `trialing` and `card_verified` is not `false`, or when `status` is `active`. Poll every few minutes, not seconds, or listen for the `billing.trial_started` event (step 12). The trial gives the site 7 article credits.

## Step 8: Generate an article

Pick an article from the plan and write it. Generation spends 1 article credit and runs in the background.

```bash title="cURL"
export ARTICLE_ID="f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76"

curl -X POST "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/articles/$ARTICLE_ID/generate" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: gen-f2b8c1d4" \
  -d '{ "word_count": 2000 }'
```

```json
{
  "job": {
    "id": "9a7e5c3b-1d2f-4e6a-8b9c-0d1e2f3a4b5c",
    "type": "article.generate",
    "status": "queued",
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "resource": { "type": "article", "id": "f2b8c1d4-7e3a-4b9c-a6d5-3e8f1a2b4c76" },
    "result": null,
    "error": null,
    "created_at": "2026-10-02T15:22:05Z",
    "started_at": null,
    "finished_at": null
  }
}
```

A `402` here means the trial hasn't started (`subscription_required`) or the site has no credits left (`insufficient_credits`). See [Billing, credits and limits](/docs/agents/billing-and-limits#what-a-402-means).

## Step 9: Poll the job

Writing takes 1 to 5 minutes: Rankbox researches the pages that rank for the keyword, drafts the article, checks it against the SEO and GEO score and fixes what failed. Poll with `wait`, which holds the request open for up to 30 seconds and returns early when the job ends:

```bash title="cURL"
curl "https://rankbox.xyz/api/agent/v1/jobs/9a7e5c3b-1d2f-4e6a-8b9c-0d1e2f3a4b5c?wait=30" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

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

Repeat until `status` is `completed` or `failed`. A failed job has `error.code` and `error.message`, and its credit is refunded automatically. A generated article is `finished` straight away, which makes it available to every destination. `deliveries` lists pushes to a connected Webflow or Shopify site; it is empty when none is connected.

## Step 10: Review the article

Read the article and its score:

```bash title="cURL"
curl "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/articles/$ARTICLE_ID" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"

curl "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/articles/$ARTICLE_ID/score" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

The article has three bodies: `body` (the stored Markdown with the writer's notes), `body_markdown` and `body_html` (publish-ready, notes removed). The score endpoint returns `analysis`, with `score` (0 to 100), a list of `checks` that each `pass`, `warn` or `fail`, and `metrics`. To change something, `PATCH` the fields or rewrite one passage with `POST …/rewrite-section`. Edits to a finished article reach a connected destination when you call publish in step 11. See the [Agent API reference](/docs/agents/api-reference#articles).

## Step 11: Publish to the website

Pick the path that matches how the website is built. Check what is available first:

```bash title="cURL"
curl "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/integrations" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

### Path A: the website pulls articles with a site key

This works for any stack you can deploy code to. Create a site key for the website:

```bash title="cURL"
curl -X POST "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/keys" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "name": "northwind.example website" }'
```

```json
{
  "site_key": {
    "id": "7b9d1f3a-5c7e-4a2b-9d4f-6e8a0c2b4d61",
    "name": "northwind.example website",
    "key": "rv_live_xxxxxxxxxxxx",
    "prefix": "rv_live_d4e5f6…",
    "last_used_at": null,
    "revoked_at": null,
    "created_at": "2026-10-02T15:30:12Z"
  }
}
```

Put the `rv_live_` key in the website's server environment as `RANKBOX_API_KEY`. The website reads finished articles from `GET https://rankbox.xyz/api/public/v1/articles` and renders `body_html`. See [Any website, with the REST API](/docs/publishing/custom-sites). After the page is live, record its URL so Rankbox and the backlink exchange know where it is:

```bash title="cURL"
curl -X POST "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/articles/$ARTICLE_ID/publish" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "published_url": "https://northwind.example/blog/how-to-choose-a-product-analytics-tool-for-b2b-saas" }'
```

The URL must be on the site's own domain. The response is `{ "article": { … "published_url": "…" … }, "deliveries": [] }`.

### Path B: Rankbox pushes to Webflow or Shopify

If the integrations list shows `webflow` or `shopify` with `"available": true`, connect it:

```bash title="cURL"
curl -X POST "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/integrations/webflow/connect" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY"
```

The response contains `authorize_url`. Send it to the owner: they approve Rankbox on Webflow's own screen. When the `integration.connected` event arrives, finish setup with `PATCH /sites/{site_id}/integrations/webflow` (collection and field map), then call `POST /sites/{site_id}/integrations/webflow/sync` to push every finished article. From then on, each new finished article is pushed automatically. See [Webflow](/docs/publishing/webflow) and [Shopify](/docs/publishing/shopify).

## Step 12: Turn on autopilot

Autopilot writes the next scheduled article on its own, at the pace you set, and pushes it to connected destinations. It is on by default at 7 articles a week, which uses the whole trial allowance in a week. Set a pace that fits the credits:

```bash title="cURL"
curl -X PATCH "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/autopilot" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "enabled": true, "weekly_cadence": 3 }'
```

```json
{
  "autopilot": {
    "site_id": "6f1c2a9e-4b7d-4e2a-8c3f-1d9e5b7a2c64",
    "enabled": true,
    "weekly_cadence": 3,
    "last_run_at": null,
    "next_due_at": "2026-10-03T00:00:00Z",
    "queue_length": 17,
    "blocked_reason": null
  }
}
```

`weekly_cadence` is 1 to 7 articles a week. `blocked_reason` tells you why autopilot won't write: `paused`, `no_plan`, `site_inactive`, `no_credits` or `queue_empty`.

## Step 13: Subscribe to events

Register a webhook so you hear about finished articles, publishing and billing without polling:

```bash title="cURL"
curl -X POST https://rankbox.xyz/api/agent/v1/webhooks \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://agent.northwind.example/hooks/rankbox",
    "events": ["article.finished", "article.published", "article.generation_failed",
               "autopilot.queue_empty", "credits.low", "billing.trial_started",
               "billing.payment_failed", "integration.error"]
  }'
```

The response includes `secret` (`whsec_…`), shown once. Verify every delivery with it. If you can't receive webhooks, poll `GET /events?since=2026-10-02T14:00:00Z` and then follow `next_cursor`. See [Events and webhooks](/docs/agents/events).

## Step 14: Report to the owner

Close the loop in your own channel. A useful report says what exists, what it costs and what you need:

```text
Done: Rankbox account for northwind.example (claim it: https://rankbox.xyz/claim/ct_xxxxxxxxxxxx)
Plan: 30 articles in the plan (17 scheduled, 13 ideas), 1 published (score 100/100)
Autopilot: on, 3 articles a week; 6 of 7 trial credits left
Trial: ends 9 October 2026, then $49.50/month unless cancelled
Waiting on you: nothing right now
```

## If something goes wrong

| Response | Meaning | What to do |
| --- | --- | --- |
| `401 unauthorized` | Key missing, mistyped or revoked | Check the `Authorization: Bearer` header. If the owner revoked the key, ask for a new one |
| `402 subscription_required` | No active trial or plan, or the trial's card check failed | Send a fresh `checkout_url` (step 4), or the portal link from `POST /billing/portal` |
| `402 insufficient_credits` | The site used this period's article credits | Wait for the reset in `GET /sites/{site_id}/credits`, or lower the autopilot pace |
| `409 account_exists` | The owner already has an account | Connect through OAuth or a dashboard key |
| `422 validation_failed` | A field is wrong | Read `details` and fix the named fields |
| `429 rate_limited` | Too many requests | Wait for `Retry-After` seconds |

More recovery recipes are in [Agent playbooks](/docs/agents/playbooks#recover-from-errors).

## Related

- [Create an account as an agent](/docs/agents/create-account): every field and limit of step 1.
- [Agent API reference](/docs/agents/api-reference): all endpoints and objects.
- [Events and webhooks](/docs/agents/events): payloads and signature checks.
- [Billing, credits and limits](/docs/agents/billing-and-limits): what each call costs.
- [Agent playbooks](/docs/agents/playbooks): longer recipes, including a Next.js site.
