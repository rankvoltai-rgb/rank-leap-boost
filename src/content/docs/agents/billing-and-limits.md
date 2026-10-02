---
title: Billing, credits and limits
nav_title: Billing and limits
description: What agents can do before a plan, how the trial and the owner's card work, article, backlink and Reddit credits, Studio, rate limits and each 402.
order: 8
updated: 2026-10-02
---

Agents run on the account's own plan and credits. Agent access has no price of its own, and an agent can't do more than the plan allows. This page covers what works before anyone pays, how the trial starts, what each action costs, the rate limits, and how to read a `402`.

## Who pays

The account owner pays, through Stripe, on one monthly subscription. An agent never enters payment details: it creates a checkout link and hands it to the owner. After that, everything an agent does is billed to the owner's plan in the same way as if the owner did it in the dashboard:

- Writing articles spends the site's article credits, which come with the plan.
- Adding a Studio site, restoring an archived one, or ending the trial early charges the owner's card on file. These are the only agent actions that cost money beyond the plan's monthly price.
- Nothing else an agent does is charged.

The owner receives Stripe's receipts and sees every charge in **Dashboard → Plan & Billing**, and every action in the activity log.

## The Business plan

Rankbox has one plan. Each site on the account gets the full allowance.

| | Business |
| --- | --- |
| Price | $49.50 a month |
| Sites included | 1 |
| Article credits | 30 a month per site |
| Backlink credits | 30 a month per site |
| Reddit reply drafts | 30 a month per site |
| Free trial | 7 days, with 7 article credits. A card is required |
| More sites | Studio, $49.50 a month per extra site, each with the full allowance |

See [Plans and credits](/docs/account/plans-and-credits) and [/pricing](/pricing).

## What works before a plan

An account with no trial or plan, such as a new account an agent just created, can already do a lot:

| Action | No plan | Trial | Paid plan |
| --- | --- | --- | --- |
| Create the account, read everything, manage keys and webhooks | Yes | Yes | Yes |
| Site scan, research, keywords | Yes, with daily caps | Yes | Yes |
| Content plan: ideas, scheduling, queue order | Yes | Yes | Yes |
| Writing settings, autopilot settings | Yes | Yes | Yes |
| Score, rewrite a section, finish a hand-written article | Yes | Yes | Yes |
| Rank | Yes | Yes | Yes |
| Generate articles (manually or by autopilot) | No | Yes, 7 credits | Yes, 30 a month |
| Create site keys, connect and sync Webflow or Shopify | No | Yes | Yes |
| Backlink exchange | Read only | Read only | Yes |
| Reddit Presence | Read only | Read only | Yes |
| Studio sites | No | No | Yes |

"Paid plan" means an invoice has actually been paid: the trial converted, or the owner ended it early. A trial never counts as paid.

## The trial

The trial is how most agent-created accounts start writing.

1. The agent calls `POST /billing/checkout` and gets a `checkout_url` with `"mode": "trial"`. The link is valid for 7 days.
2. The owner opens it and adds a card on Stripe's checkout page. Nothing is charged that day.
3. Rankbox checks the card with a $1.00 authorization that it releases immediately. If the check fails, the trial exists but `card_verified` is `false` and generation stays off until the owner updates the card in the billing portal. The `billing.card_check_failed` event fires.
4. The trial starts: `billing.status` becomes `trialing`, the primary site gets 7 article credits, `billing.trial_started` fires, and autopilot starts writing on its next run.
5. On day 8, Stripe charges $49.50. The plan becomes `active`, the site's article balance resets to 30, and the backlink exchange, Reddit Presence and Studio open. `billing.activated` fires.

The owner can cancel any time before day 8 in the billing portal and pay nothing. An agent can end the trial early with `POST /billing/activate`, which charges $49.50 at once; do that only when the owner has asked, for example because they want backlinks or a second site this week. See [The free trial](/docs/account/free-trial).

> [!IMPORTANT]
> Autopilot is on by default at 7 articles a week. On a trial, that uses all 7 article credits in the first week, leaving none for articles you generate yourself. Set `weekly_cadence` before the trial starts if you plan to generate manually too.

## Credits and resets

Each site has its own balances. `GET /sites/{site_id}/credits` returns them.

| Credit | Spent by | Granted | Resets | Unused |
| --- | --- | --- | --- | --- |
| Article | `generate` and autopilot, 1 per article | 7 in the trial; 30 per paid period | At each new period | Lost |
| Backlink | A link to one of your targets, 1 to 3 credits by the host's tier, settled only when verified live | 30 per paid period, topped up to at most 90; plus credits earned by hosting other members' links | Never | Kept |
| Reddit reply | A draft or a rewrite, 1 each (the first rewrite of a draft that failed compliance is free) | 30 per paid period | At each new period | Lost |

Rules that matter to agents:

- **Reserved, then refunded on failure.** An article credit is reserved when writing starts and refunded if it fails. A Reddit draft that is refused or fails refunds its credit.
- **Deleting doesn't refund.** Deleting a written article doesn't return its credit.
- **Free actions.** Research, scans, planning, scoring, rewriting a section, finishing your own article, publishing, syncing, recording a live URL, sweeps and recording a Reddit reply spend no credits.
- **Refills follow payment, not the calendar.** A period whose invoice fails grants nothing until it is paid.
- **No top-ups.** There is no larger plan and no credit pack. A site that runs out waits for the next period, or the owner adds a Studio site for another brand.

## Plan states

`GET /billing` returns `status` and a few flags. What each state means for an agent:

| State | Can generate | Paid-only features | What to do |
| --- | --- | --- | --- |
| `none` | No | No | Send the owner a `checkout_url` |
| `trialing`, `card_verified` not `false` | Yes, up to 7 articles | No | Work within 7 credits; ask before `POST /billing/activate` |
| `trialing`, `card_verified: false` | No | No | Send the owner a portal link to update the card |
| `active` | Yes | Yes | Normal operation |
| `active`, `cancel_at_period_end: true` | Yes, until `current_period_end` | Yes, until then; no new Studio sites | Tell the owner what stops and when |
| `past_due` | For 48 hours after `past_due_since` | Yes, during the 48 hours if the account paid before | Send the owner a portal link now |
| `canceled` | Until `current_period_end`, then no | Same | Send a new `checkout_url` (`mode: "plan"`) if the owner wants to restart |

Articles already published stay on the website whatever the plan does.

## Studio sites

Studio adds sites to the account, for agencies and owners with several brands. Each extra site costs $49.50 a month on the same subscription and has the full allowance of its own: 30 article, 30 backlink and 30 Reddit reply credits a month.

- **Paid plan only.** During the trial, `POST /sites` returns `402 paid_plan_required`. `GET /billing/studio-quote` returns a `block` with the reason.
- **Charged at once, prorated.** Adding a site charges the share of the current period that's left, and the site's first allowance is prorated the same way, rounded up and never below 1. A site added halfway through a period costs $24.75 and starts with 15 of each credit.
- **One change at a time.** A second Studio change while one is in progress returns `409 conflict` for a few seconds.
- **Removal runs to the end of the period.** `DELETE /sites/{site_id}` stops billing from the next invoice; the site works until `removes_at`. Nothing is refunded. `POST /sites/{site_id}/restore` before that date undoes it for free.

See [Studio: run several sites](/docs/account/studio).

## Rate limits

Limits apply per account (all its agent keys and OAuth connections together) or per IP address, in fixed one-minute windows unless noted.

| Limit | Value | Applies to |
| --- | --- | --- |
| Requests per account | 120 a minute | Every agent API request and authenticated MCP tool call |
| Requests per IP address | 300 a minute | All agent API traffic from one address |
| AI operations per account | 12 a minute | Starting a scan, research, `generate`, `rewrite-section`, Reddit drafts and sweeps, domain verification checks |
| Article generations in progress | 3 per site | `queued` or `running` `article.generate` jobs |
| Reddit sweeps in progress | 1 per site | |
| Studio changes in progress | 1 per account | `POST /sites`, `DELETE /sites/{site_id}`, `restore` |
| Account creation | 5 an hour and 20 a day per IP address | `POST /accounts` |
| Claim emails | 3 a day per account | `POST /account/resend-claim` |
| Research runs without a trial or plan | 10 a day per account | `POST /sites/{site_id}/research` |
| Scans without a trial or plan | 3 a day per account | Including the first scan |
| Webhook endpoints | 10 per account | |
| Agent keys and OAuth connections | 25 active per account | |
| Request body | 1 MB | |

The public articles API that websites call with site keys has its own budget: see [Rate limits](/docs/api/rate-limits).

When a limit is hit, the API returns `429` with `"code": "rate_limited"` and a `Retry-After` header in seconds. Wait that long, then retry the same request. Every response also carries `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset`, so you can slow down before hitting the limit.

```ts title="TypeScript"
async function rankbox(path: string, init: RequestInit = {}, attempt = 0): Promise<Response> {
  const res = await fetch(`https://rankbox.xyz/api/agent/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.RANKBOX_AGENT_KEY}`, ...init.headers },
  });
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    const wait = Number(res.headers.get("retry-after")) || 2 ** attempt;
    await new Promise((r) => setTimeout(r, wait * 1000));
    return rankbox(path, init, attempt + 1);
  }
  return res;
}
```

Reuse the same `Idempotency-Key` when you retry a `POST`, so a request that succeeded but whose answer was lost doesn't run twice.

## Working within the limits

- **Wait for jobs with `wait=30`.** One long-poll request replaces up to 30 one-second polls.
- **Prefer events to polling.** A webhook costs no requests. `GET /events` every few minutes is enough when you poll.
- **Batch planning.** `POST /sites/{site_id}/research` with `save: true` adds up to 30 ideas in one AI operation.
- **Don't fan out generation.** Three articles in progress per site is the cap; queue the rest by scheduling them and let autopilot write them.
- **Cache reads.** Sites, keywords and settings change rarely. Read them once per session.

## What a 402 means

A `402` always means the plan or the credits stand in the way, never a bug in your request. The `code` says which:

| `code` | Cause | Fix |
| --- | --- | --- |
| `subscription_required` | No trial or plan | `POST /billing/checkout` and send `checkout_url` to the owner |
| `subscription_required` | The trial's card check failed (`card_verified: false`) | `POST /billing/portal` and ask the owner to update the card |
| `subscription_required` | The plan lapsed: payment failed more than 48 hours ago, or the subscription ended | Portal link for a failed payment; a new `checkout_url` for an ended plan |
| `subscription_required` | The site isn't live: a Studio site that is pending, removed or archived | `POST /sites/{site_id}/restore`, or work on another site |
| `paid_plan_required` | Backlinks, Reddit Presence or Studio during the trial or without a plan | Wait for day 8, or `POST /billing/activate` if the owner agrees |
| `insufficient_credits` | The site used this period's article or Reddit reply credits | Wait for `period_end` in `GET /sites/{site_id}/credits`; lower the autopilot pace |
| `payment_failed` | A charge you started (Studio site, ending the trial early) was declined | Send the owner `action_url`. Nothing changed |

The `error` sentence names the cause and the date when there is one, so you can pass it to the owner as is.

## Related

- [Plans and credits](/docs/account/plans-and-credits): the allowances from the owner's side.
- [The free trial](/docs/account/free-trial): the trial, the card check and cancellation.
- [Studio: run several sites](/docs/account/studio): billing for extra sites.
- [Agent API reference](/docs/agents/api-reference#billing): the billing endpoints.
- [Permissions and guardrails](/docs/agents/permissions): spending actions and owner controls.
