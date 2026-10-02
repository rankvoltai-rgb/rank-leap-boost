---
title: Agent playbooks
nav_title: Playbooks
description: End-to-end recipes for agents: launch a content engine, add Rankbox to a Next.js site, run client sites with Studio, a weekly loop and error recovery.
order: 10
updated: 2026-10-02
---

These playbooks string the agent API together into complete jobs. Each one says what it needs, the calls in order, the decisions along the way and what to tell the owner. They assume you have read the [Quickstart for AI agents](/docs/agents/quickstart); request and response shapes are in the [Agent API reference](/docs/agents/api-reference).

## Launch a content engine for a new project

**Goal:** a new business goes from no Rankbox account to a month of articles in the plan, the first ones published, and autopilot running.
**Needs:** the owner's email and consent, the website URL, a way to message the owner.
**Owner's part:** add a card once, and claim the account when convenient.

### Day 0: set up

1. Tell the owner what you are about to do, including that the plan is $49.50 a month after a 7-day free trial, and get a yes.
2. `POST /accounts` with an `Idempotency-Key`. Store `agent_key.key`.
3. Send the owner `claim_url` and say that Rankbox has emailed them.
4. `POST /billing/checkout` and send `checkout_url` with a one-line explanation of the trial.
5. Wait for `site.scan_completed` (or poll `GET /sites/{site_id}/scan`).
6. Read the plan: `GET /sites/{site_id}/articles?status=opportunity,scheduled`. Remove topics that don't fit the business with `DELETE` or move them back to ideas with `PATCH` and `"status": "opportunity"`.
7. Add the topics the owner cares about most with `POST /sites/{site_id}/articles`, `"status": "scheduled"` and a low `queue_position` so they are written first.
8. Run `POST /sites/{site_id}/research` with `"save": true` around one or two seeds, to fill the idea list.
9. Set `writing` with `PATCH /sites/{site_id}`: the audience in the owner's words, the tone, and house rules such as words to avoid.
10. Set the pace before the trial starts: `PATCH /sites/{site_id}/autopilot` with `weekly_cadence` 3, which leaves room in the 7 trial credits for articles you write on purpose.

### When the trial starts

1. `billing.trial_started` arrives (or `GET /billing` shows `trialing`). Check `card_verified` isn't `false`.
2. Generate the 2 or 3 articles with the highest `traffic_estimate` and `ai_signal` that match the owner's priorities.
3. For each: wait for the job, `GET …/score`, fix `fail` checks with `rewrite-section`, then publish (see the next playbook for a website you build, or connect Webflow or Shopify when `available` is `true`).
4. Record each live URL with `POST …/publish` and `published_url`.
5. Register a webhook, or start polling `GET /events`.

### Before day 8

Tell the owner, in one message, what was published, how many trial credits are left, and that $49.50 is charged on the trial's end date unless they cancel in the portal. After the first payment, `billing.activated` fires: the site has 30 article credits, and the backlink exchange and Reddit Presence are open. Raise `weekly_cadence` to fit 30 a month (7 a week writes about 30).

## A coding agent adds Rankbox to a Next.js site

**Goal:** while building a Next.js site, add a blog whose articles Rankbox writes, served from the site's own domain.
**Needs:** the project, a deployment target, the owner's email and consent.
**Owner's part:** the checkout link, then nothing.

The rule that matters most: the website gets a **site key** (`rv_live_`), read-only and limited to one site. The **agent key** stays in your own secret store and never enters the repository, the build or the deployed app.

### 1. Create the account and ask for the trial

Run steps 1 to 4 of [Day 0: set up](#day-0-set-up). Keep `RANKBOX_AGENT_KEY` in your own environment, not in the project's `.env` files.

### 2. Add the blog routes

The website reads finished articles from the public API. A minimal client:

```ts title="lib/rankbox.ts"
const API = "https://rankbox.xyz/api/public/v1";

export interface RankboxArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_html: string;
  tags: string[];
  published_url: string | null;
  published_at: string;
  updated_at: string;
}

export async function getAllArticles(): Promise<RankboxArticle[]> {
  const all: RankboxArticle[] = [];
  let since: string | null = null;
  for (;;) {
    const url = new URL(`${API}/articles`);
    url.searchParams.set("limit", "100");
    if (since) url.searchParams.set("since", since);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.RANKBOX_API_KEY}` },
      next: { revalidate: 3600, tags: ["rankbox"] },
    });
    if (!res.ok) throw new Error(`Rankbox responded ${res.status}`);
    const page = (await res.json()) as { articles: RankboxArticle[]; count: number; next_since: string | null };
    all.push(...page.articles);
    if (page.count < 100 || !page.next_since) break;
    since = page.next_since;
  }
  return all.sort((a, b) => b.published_at.localeCompare(a.published_at));
}
```

Then add `app/blog/page.tsx` (the list) and `app/blog/[slug]/page.tsx` (one article). Render `body_html` after removing its opening `<h1>`, which repeats the title, and sanitize it. The full, tested version of both pages, with metadata, structured data and slug handling, is in [Next.js App Router](/docs/publishing/custom-sites#nextjs-app-router). Add the blog URLs to `app/sitemap.ts` from the same `getAllArticles()`.

### 3. Give the website its key

After `billing.trial_started`, create a site key and put it in the hosting provider's server environment:

```bash title="cURL"
curl -X POST "https://rankbox.xyz/api/agent/v1/sites/$SITE_ID/keys" \
  -H "Authorization: Bearer $RANKBOX_AGENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "name": "northwind.example (Next.js)" }'
```

Set `RANKBOX_API_KEY` to the returned `site_key.key` for production and preview builds. Don't prefix it with `NEXT_PUBLIC_`; that would ship it to browsers. For local development, put it in `.env.local`, which must be in `.gitignore`.

### 4. Refresh pages when articles change

Pages revalidate every hour on their own. To show new articles within seconds, add a webhook route that verifies the signature and clears the cache tag:

```ts title="app/api/rankbox-webhook/route.ts"
import { revalidateTag } from "next/cache";
import { verifyRankboxSignature } from "@/lib/rankbox-signature";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyRankboxSignature(raw, request.headers.get("rankbox-signature"), process.env.RANKBOX_WEBHOOK_SECRET!)) {
    return new Response("invalid signature", { status: 400 });
  }
  const event = JSON.parse(raw) as { type: string };
  if (event.type.startsWith("article.")) revalidateTag("rankbox");
  return new Response(null, { status: 204 });
}
```

`verifyRankboxSignature` is the function from [Verify signatures](/docs/agents/events#verify-signatures). Register the route with `POST /webhooks` for `article.finished`, `article.updated` and `article.deleted`, and set `RANKBOX_WEBHOOK_SECRET` in the hosting environment. This webhook endpoint belongs to the website, so it only needs the secret, never the agent key.

### 5. Publish and record live URLs

1. Generate the first article and wait for the job.
2. Deploy, or wait for the webhook to revalidate.
3. Check that `https://northwind.example/blog/{slug}` returns `200`.
4. Record it: `POST /sites/{site_id}/articles/{article_id}/publish` with `"published_url": "https://northwind.example/blog/{slug}"`.

The site could report its own URLs instead with the site key and `PATCH /api/public/v1/articles/{id}`; see [Report the live URL](/docs/publishing/custom-sites#report-the-live-url). Either way, recorded URLs are what the backlink exchange verifies links on. The URL must be on the site's own domain.

### 6. Prepare for the backlink exchange

Once the plan is paid, the exchange needs proof that the site owns its domain. Since you control the code, the meta tag is the quickest method. Call `POST /sites/{site_id}/backlinks/domain` with the domain, then put the token in the root layout:

```ts title="app/layout.tsx"
import type { Metadata } from "next";

export const metadata: Metadata = {
  verification: {
    other: { "rankbox-site-verification": process.env.RANKBOX_VERIFICATION_TOKEN ?? "" },
  },
};
```

Deploy, call `POST /sites/{site_id}/backlinks/domain/verify`, then turn on hosting with `PATCH /sites/{site_id}/backlinks` and `"opted_in": true`, and add targets for the pages you want links to.

### 7. Hand over

Turn on autopilot at a pace the owner agreed to, and leave the owner a short note: where the blog lives, that articles appear on their own, how to pause autopilot (**Dashboard → Settings → Autopilot**), and that the agent key can be revoked at **Dashboard → Settings → Agent access**.

## An agency agent runs client sites with Studio

**Goal:** one agent manages content for several client brands.
**Needs:** a decision on who owns and pays for each client's Rankbox.

### Choose the account model

| | One agency account with Studio | One account per client |
| --- | --- | --- |
| Owner | The agency | Each client |
| Billing | One invoice: $49.50 plus $49.50 per extra site | Each client pays $49.50 |
| Trial | One, for the agency's first site | One per client |
| Access | One agent key covers every client | One agent key per client account |
| Client can sign in | No, unless the agency shares its login | Yes, to their own account |
| Client leaves | Remove their site; it runs to the end of the paid period | Revoke your key; they keep everything |
| Set up with | `POST /sites` | `POST /accounts` with the client's email, `agent.operator` set to the agency |

Both work with the same agent. With one account per client, store each client's key separately and never mix them. The rest of this playbook covers Studio.

### Add a client site

1. Make sure the agency's plan is paid: `GET /billing` must show `paid: true`. During the agency's own trial, Studio is closed.
2. Get the price: `GET /billing/studio-quote`. Check `block` is `null` and note `due_today`.
3. Confirm the charge with the agency owner.
4. `POST /sites` with the client's `site_url`, `site_name`, the quote's `proration_date` and an `Idempotency-Key`. The response has the new `site` and `charged`.
5. Wait for its `site.scan_completed`, then review its plan and set its `writing` settings in the client's voice.
6. Set its autopilot pace and create a site key, or connect its platform, exactly as for any site.

Each Studio site has its own credits, queue, autopilot pace, integrations, site keys, backlink settings and Reddit settings. Nothing is shared between sites, and the backlink exchange never trades links between two sites of the same account.

### Run several sites

- **Address sites explicitly.** Every call carries `site_id`. Keep a table of client to `site_id` and never default to the primary site.
- **One webhook, filtered.** A webhook receives events for every site; route each by its `site_id`.
- **Report per client.** `GET /sites/{site_id}/credits`, `GET /sites/{site_id}/rank` and `GET /sites/{site_id}/articles?updated_since=` give a client's month at a glance.
- **Mind the shared budgets.** Rate limits are per account, so 20 sites share 120 requests a minute and 12 AI operations a minute. Spread heavy work, such as research, across the week.
- **Remove a client cleanly.** `DELETE /sites/{site_id}` stops billing from the next invoice; the site keeps working until `removes_at`, so finish the month's articles first. Revoke the client's site keys after their own site no longer needs them.

Running clients on your agency's account is what Studio is for. Reselling Rankbox itself, as a product, needs written permission: see [Acceptable use](/docs/agents/permissions#acceptable-use).

## A weekly maintenance loop

**Goal:** keep a running site healthy without the owner's attention, and tell them what happened.
**Runs:** once a week per site, plus reactions to events in between.

| Check | Call | Act when | Action |
| --- | --- | --- | --- |
| Billing | `GET /billing` | `past_due`, `card_verified: false`, `cancel_at_period_end` | Send the owner a portal link and the date things stop |
| Autopilot | `GET /sites/{site_id}/autopilot` | `blocked_reason` isn't `null` | `queue_empty`: plan more. `no_credits`: lower the pace. `no_plan`: billing first |
| Queue depth | Same response, `queue_length` | Less than 2 weeks of articles at the current pace | `POST …/research` with `save: true`, then schedule the best ideas |
| Credits | `GET /sites/{site_id}/credits` | Fewer than the queue needs before `period_end` | Lower `weekly_cadence` or tell the owner |
| New articles | `GET …/articles?status=finished&updated_since=` (last week) | Any article scored below 80 | `GET …/score`, then `rewrite-section` on failing checks, then `POST …/publish` |
| Live URLs | Same list | `published_url` is `null` a day after finishing | Find the page and record it, or check the website's sync |
| Integrations | `GET /sites/{site_id}/integrations` | `status` is `error` | Read `last_error`; reconnect or fix the field map |
| Backlinks (paid) | `GET /sites/{site_id}/backlinks` | No active targets, or `status` not `verified` | Add targets for the pages that sell; fix verification |
| Reddit (paid) | `GET …/reddit/threads?status=new` | Threads with high `fit` | Draft replies and hand them to a person |
| Rank | `GET /sites/{site_id}/rank` | `coverage.open` is large | Plan articles for the biggest gaps |

Between runs, react to events instead of polling: `article.generation_failed` (retry once), `autopilot.queue_empty` (plan), `credits.low` (pace), `integration.error` (fix), `billing.payment_failed` (portal link), `reddit.reply_removed` (tell the person who posted).

Close each week with a short report to the owner: articles published with their links, scores, credits left and the reset date, anything waiting on them. Don't report rankings or AI citations: Rankbox doesn't measure them, and Rank's numbers are estimates of coverage.

## Recover from errors

### Error responses

| What you see | Likely cause | Recovery |
| --- | --- | --- |
| `401 unauthorized` on every call | The key was revoked, the OAuth app disconnected, or the account deleted | Stop. Ask the owner; don't create a new account for the same email |
| `401` after about an hour, OAuth only | The access token expired | Refresh it; if refresh fails with `invalid_grant`, run the OAuth flow again |
| `402 subscription_required` | No trial or plan, a failed card check, a lapsed plan or an inactive Studio site | See [What a 402 means](/docs/agents/billing-and-limits#what-a-402-means) |
| `402 insufficient_credits` | The period's credits are used | Wait for `period_end`; lower the pace |
| `409 conflict` on `generate` | The article is already `finished` or `generating` | `GET` the article; if `generating`, find its job with `GET /jobs?status=running` |
| `409 conflict` on a Studio call | Another site change is in progress | Retry after 5 seconds with the same `Idempotency-Key` |
| `409 integration_unavailable` | The platform's add-on isn't open to every account | Publish with a site key and the REST API |
| `422 validation_failed` on publish | `published_url` isn't on the site's domain | Check the site's `website_url`; fix whichever is wrong |
| `429 rate_limited` | A per-minute limit or the 3-generations cap | Wait `Retry-After` seconds; queue work instead of firing it at once |
| `5xx` | A Rankbox failure | Retry with exponential backoff and the same `Idempotency-Key`; quote `X-Request-Id` to support if it persists |

### A generation job failed

The credit is already refunded and the article is back in its previous status. Retry once with `POST …/generate`. If it fails again, change the brief: a clearer `title`, a specific `keyword`, a `description` that says what the article must cover, or a shorter `word_count`. Then retry.

### The scan failed

`GET /sites/{site_id}/scan` has `error`. The usual causes are a website that blocks crawlers, shows only a login page, or is mostly empty. Fill in `brand_name` and `product_description` with `PATCH /sites/{site_id}`, add keywords yourself with `POST …/keywords`, and run `POST /sites/{site_id}/scan` again, or plan by hand with `POST …/research` and `POST …/articles`.

### You lost the agent key

If you created the account with an `Idempotency-Key` less than 24 hours ago, repeat the identical `POST /accounts` call to get the original response back. Otherwise, ask the owner to claim the account from the email and create a new key at **Dashboard → Settings → Agent access → Create agent key**. Then ask them to revoke the lost one.

### An integration is in error

`GET /sites/{site_id}/integrations/{integration_id}` shows `last_error`. Common causes: the owner removed Rankbox's access on the platform (connect again), a Webflow field was renamed or deleted (fix `field_map`), or the Webflow site was never published while `publish_mode` is `live`. After fixing, run `POST …/sync` to push what was missed.

### A webhook endpoint was disabled

Fix the endpoint, re-enable it with `PATCH /webhooks/{webhook_id}` and `{ "enabled": true }`, send a test event, then read what you missed from `GET /events` with `since` set to the time it started failing.

### The owner clicked This wasn't me

The account and everything in it are deleted and your key returns `401`. Don't recreate the account. Check with the owner that you had the right email and their consent before trying again.

## Related

- [Quickstart for AI agents](/docs/agents/quickstart): the basic flow these playbooks build on.
- [Agent API reference](/docs/agents/api-reference): every call used here.
- [Events and webhooks](/docs/agents/events): reacting instead of polling.
- [Any website, with the REST API](/docs/publishing/custom-sites): full website recipes.
- [Studio: run several sites](/docs/account/studio): Studio from the owner's side.
