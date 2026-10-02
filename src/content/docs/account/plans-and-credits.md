---
title: Plans and credits
description: What the Rankbox Business plan includes, how article, backlink and Reddit credits are granted, spent and reset, and what happens when one runs out.
order: 1
updated: 2026-10-02
---

Rankbox sells one plan, Business, and meters its work with three kinds of credit: article credits, backlink credits and Reddit reply credits. This page explains what each credit pays for, when it refills, what never costs a credit, and what you see when a balance reaches zero.

## The Business plan

Every Rankbox account runs on the same plan. There are no tiers, no annual price, no setup fee and no contract.

| Item | Business plan |
| --- | --- |
| Price | $49.50 a month, billed monthly in US dollars |
| Sites included | 1 (add more with [Studio](/docs/account/studio) at $49.50 a month per extra site) |
| Article credits | 30 a month |
| Backlink credits | 30 a month |
| Reddit reply credits | 30 a month |
| Free trial | 7 days, with 7 article credits ([details](/docs/account/free-trial)) |
| Payment | Card through Stripe; the trial needs a card |
| Cancellation | Any time; access runs to the end of the paid period |

The plan covers one site: the one you set up in onboarding, called your plan's own site. Every allowance in the table belongs to a site, not to the account. If you add sites with Studio, each extra site gets its own 30 articles, 30 backlink credits and 30 Reddit reply credits a month.

> [!NOTE]
> Signing up and onboarding are free and need no card. You add a card only when you start the free trial, which is also when Rankbox can first write an article for you.

## The three credit types

| Credit | What one credit pays for | Monthly grant | During the trial | Unused credits | Where you see the balance |
| --- | --- | --- | --- | --- | --- |
| Article credit | Writing one article | 30 per site | 7 | Do not roll over | **Plan & Billing → Sites & usage**, Studio site cards |
| Backlink credit | Part of the price of one inbound link (1 to 3 credits per link) | 30 per site, as a top-up | None | Carry over | **Backlinks → Overview → Credits to spend** |
| Reddit reply credit | Drafting or rewriting one Reddit reply | 30 per site | None | Do not roll over | **Reddit → Reply credits** |

Credit balances are read-only from the browser. Only Rankbox's server-side billing and generation processes can grant or spend them, so a balance can't be changed from the dashboard or through the database API.

## Article credits

An article credit is spent each time Rankbox writes a full article for a site. Each site has its own article balance for the current billing period, shown as used out of total, for example "12 / 30 articles".

### What spends an article credit

| Action | Credits |
| --- | --- |
| Clicking **Write now** on a planned article (Articles, Calendar, the article panel) | 1 |
| Clicking **Generate now** on the Overview | 1 |
| Autopilot writing the next scheduled article | 1 |

The credit is reserved at the moment writing starts. If writing fails, the credit is returned to the site automatically, and the article goes back to its previous state. Autopilot works the same way: if it finds nothing scheduled to write, it gives the reserved credit back.

### What never spends an article credit

- Research: keyword discovery, website analysis, content strategy and the content plan built in onboarding.
- Planning: adding ideas to the queue, scheduling, reordering, moving dates and changing the autopilot pace.
- Editing a written article by hand in the editor.
- The editor's AI actions on a selected passage (rewrite, expand, shorten, improve SEO, change tone, AI suggest). These are rate limited per account but don't use credits.
- The SEO and GEO score. Scoring comes with the article and doesn't cost extra.
- Publishing: sending articles to your site through a publishing connection or the REST API.
- The free tools at `/tools` and the tools in the Rankbox MCP server.

Deleting an article doesn't return its credit. The credit paid for the writing, which already happened.

### When article credits reset

Article credits reset at the start of each billing period. On renewal, the site's used count goes back to 0 and its total is set to the plan allowance. Unused article credits from the previous period are not carried forward.

| Moment | Article balance of your plan's own site |
| --- | --- |
| Onboarding finished, before the trial starts | 7, but nothing can be written until a trial starts |
| Trial starts | Reset to 7 for the trial period |
| First payment (trial converts, or you start the paid plan early) | Reset to 30 |
| Each successful renewal | Reset to 30 |
| A renewal payment fails | No refill until the invoice is paid; then reset to 30 |

The refill is tied to a successful payment, not to the calendar. A failed renewal advances the billing period in Stripe but grants nothing until the invoice is paid.

## Backlink credits

Backlink credits are the currency of the [backlink exchange](/docs/growth/backlink-exchange). You earn them by hosting another member's link in one of your articles and spend them to have your own pages linked from other members' sites.

- **Monthly grant:** each paid period adds 30 credits per site. The grant is a top-up, not a reset, so unspent and earned credits survive the billing boundary.
- **Grant cap:** the monthly grant never lifts a balance past 90 credits (three months of grants). At 70 credits, a renewal adds 20; at 90 or more, it adds nothing. Credits you earn by hosting are not limited by this cap.
- **Price of a link:** 1 to 3 credits, set by the authority tier of the site that hosts the link.
- **Escrow:** when a link is reserved, its credits move from **Credits to spend** into a held amount ("held for links in progress").
- **Settlement:** credits settle only when the link is verified live on the host's page. The host then earns exactly what you escrowed.
- **Refunds:** if a reserved link is never published and verified within 30 days, the escrowed credits come back to you.
- **Trial:** the exchange is paid-only, so a trial gets no backlink credits.
- **Lapsed plan:** your live links stay live and your balance is held, not lost. Nothing new is placed until you pay again.

## Reddit reply credits

Reddit reply credits pay for drafts in [Reddit Presence](/docs/growth/reddit-presence). Rankbox drafts the reply; you post it from your own Reddit account.

| Action | Credits |
| --- | --- |
| Finding threads (sweeps) | 0 |
| Drafting a reply to a thread | 1 |
| Rewriting a draft | 1 |
| First rewrite of a draft that failed its compliance checks | 0 |
| Editing a draft by hand | 0 |

Each draft can be rewritten at most 3 times. After that, you edit it by hand. If a draft or rewrite can't be written or saved, its credit is refunded.

Reddit reply credits reset to 30 at the start of each paid period. Unused credits do not roll over. The **Reddit** page shows the reset date under **Reply credits**. Like the exchange, Reddit Presence is paid-only, so a trial gets no Reddit reply credits.

## What happens when a balance runs out

### Out of article credits

When a site has used every article credit for the period:

- The **Write now** button changes to **Upgrade to write**. Clicking it, or **Generate now** on the Overview, opens a dialog that says "You've used all 30 articles this month" (7 during the trial).
- During the trial, the dialog says to confirm your plan and its button, **Confirm your plan**, opens **Plan & Billing**. There, **Unlock everything now** ends the trial, charges the first $49.50 and resets the site to 30 article credits straight away.
- On a paid plan, the dialog shows the date your limit resets. Its **Manage plan & upgrade** button opens **Plan & Billing**. There is no higher plan and no article top-up pack, so the site's next articles are written after the renewal refill.
- Autopilot skips the site until credits refill. The autopilot bar on Articles and Calendar shows "Autopilot has used this month's articles", and the Overview shows "You've used every article this cycle". Scheduled articles stay in the queue and nothing is lost.

> [!TIP]
> Keep autopilot's pace within your allowance. Writing every day produces about 30 articles a month, which matches the paid allowance exactly. **Settings → Autopilot → Pace** warns you when the pace would run out before the month ends.

### Out of backlink credits

The exchange stops reserving new links for your pages until your balance covers the next link's price. Your existing links are unaffected, and if you host links in your own articles, each one that is verified live earns credits that you can spend.

### Out of Reddit reply credits

Rankbox keeps finding threads, because sweeps are free, but drafting shows "You're out of Reddit reply credits for this cycle." Drafts you already have can still be edited, copied and posted.

## Credits on Studio sites

Every Studio site has its own balances and spends only its own credits. A site added part-way through a billing period gets a prorated first allowance: the share of the period left when it was added, rounded up, and never less than 1. A site added with half the period left starts with 15 articles, 15 backlink credits and 15 Reddit reply credits, then gets the full 30 of each from the next renewal. See [Studio](/docs/account/studio) for how sites are billed.

## Related

- [The free trial](/docs/account/free-trial): what the 7 trial articles cover and what waits for the first payment.
- [Billing, invoices and cancellation](/docs/account/billing): renewals, failed payments and the Stripe portal.
- [Studio: run several sites](/docs/account/studio): per-site allowances and prorated charges.
- [Autopilot and the publishing schedule](/docs/content/autopilot): how pace turns into articles and credits.
- [Backlink exchange](/docs/growth/backlink-exchange): how links are matched, verified and settled.
- [Reddit Presence](/docs/growth/reddit-presence): sweeps, drafts and posting from your own account.
