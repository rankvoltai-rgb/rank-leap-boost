---
title: The free trial
nav_title: Free trial
description: How the 7-day Rankbox trial works, from adding a card in Stripe Checkout to automatic conversion, early upgrade, cancelling and a failed card.
order: 2
updated: 2026-10-02
---

The Rankbox free trial lasts 7 days and lets Rankbox write and publish up to 7 articles for your site before you pay anything. It starts in Stripe Checkout and takes a card. If you don't cancel, it converts automatically to the Business plan at $49.50 a month when the 7 days are up.

## The trial at a glance

| Item | During the trial |
| --- | --- |
| Length | 7 days from the moment checkout completes |
| Card | Required, entered in Stripe Checkout inside the dashboard |
| Charged when you start | $0. A $1.00 card authorization is placed and released at once (see [The card check](#the-card-check)) |
| Article credits | 7 for your plan's own site |
| Sites | 1. Studio opens with the first payment |
| Research, writing, scoring, editing | Included |
| Autopilot | Included, limited by the 7 article credits |
| Publishing (REST API keys and publishing connections) | Included |
| Backlink exchange | Not included. Opens with the first paid invoice |
| Reddit Presence | Not included. Opens with the first paid invoice |
| After 7 days | Converts to the Business plan at $49.50 a month, unless cancelled |

## Before the trial starts

You don't need a card to sign up or to finish onboarding. Without a trial you can:

- Set up your site and brand in onboarding.
- See the keywords, content plan and queued articles Rankbox built for you.
- Look around every page of the dashboard.

Nothing is written until the trial starts. The check runs on Rankbox's servers, so it applies equally to the dashboard, to autopilot and to API keys. If you try to write an article without a trial, Rankbox refuses with "Start your free trial to generate articles." Autopilot also stays idle, and pages that depend on the plan show a **Start 7-day free trial** button over a preview of the page.

## Start the trial

You can start the trial from any **Start free trial** or **Start 7-day free trial** button: the Overview's next-step card, the autopilot bar on Articles, **Settings → Autopilot**, the Rank, Backlinks and Reddit pages, and **Plan & Billing**.

1. Click **Start free trial**. A dialog opens with the number of articles ready to publish and what the trial includes.
2. Click **Start free trial** in the dialog. Stripe's checkout form appears inside the same dialog. It says "Add a card to begin. You aren't charged today — your plan starts at $49.50/month on day 8, and you can cancel before then in one click."
3. Enter your card details and complete checkout.
4. Wait for "Starting your trial…" to finish. A confirmation reads "Your 7-day trial is live."

If you started the trial by clicking **Write now** on an article, Rankbox writes that article as soon as the trial is live.

> [!NOTE]
> Card details go straight to Stripe. Rankbox never receives or stores your full card number.

## The card check

When a trial starts, Rankbox asks Stripe to place a $1.00 authorization on the card and then releases it immediately. Nothing is captured or charged. It exists because a card can pass checkout's $0 setup while holding no funds. Your bank may show the $1.00 as a pending authorization for a day or two before it disappears.

If the authorization fails, the trial still exists but can't write articles. Writing an article then shows "We couldn't verify your card. Update it in billing to start generating." This can happen with an empty or prepaid card, and also with a valid card whose bank requires 3-D Secure for the hold. See [Troubleshooting the trial](#troubleshooting-the-trial) for the fix.

## What the trial includes

The trial runs the whole content engine for one site:

- Research and the content plan.
- Writing up to 7 articles, by clicking **Write now** or with autopilot.
- The SEO and GEO score on every article.
- The editor, including its AI actions on selected text.
- Publishing to your site, with API keys for the REST API or a publishing connection. See [How publishing works](/docs/publishing/overview).

Everything published during the trial stays on your site, whether or not you continue.

## What waits for the first payment

Some parts of the plan open only once an invoice has actually been paid. **Plan & Billing** lists them under "Waiting on your first payment".

| Feature | Why it isn't part of the trial |
| --- | --- |
| The full 30 articles a month | A trial that handed over 30 articles up front would be worth abusing with a card that later declines, so the trial allowance is 7 |
| Backlink exchange (30 credits a month) | Links in the exchange carry real value to other members. Keeping it paid-only stops throwaway accounts from minting links out of the network |
| Reddit Presence (30 reply drafts a month) | Replies go out under your own name, in threads that outlive any trial |
| Studio (more sites) | The trial covers one site. Studio adds sites to a paid plan |

The Backlinks and Reddit pages say "Part of the paid plan" during the trial, with the date of your first invoice.

## Track the trial in Plan & Billing

**Dashboard → Plan & Billing** shows the trial while it runs:

- **Your plan** shows the **Free trial** status, "N days left in your free trial" and the trial's start and end dates.
- **Trial articles** shows how many of the 7 credits you've used.
- **First charge** shows $49.50 and the date it will be taken, with "Cancel before {date} and you pay nothing."

## When the trial ends

If the trial isn't cancelled, Stripe charges the card $49.50 when the 7 days are up, and the subscription becomes active. At that moment:

- Your site's article balance resets to 30 for the new period.
- The backlink exchange opens and the site receives 30 backlink credits.
- Reddit Presence opens with 30 reply credits.
- Studio opens, so you can add more sites.
- The plan renews monthly from that date.

## Start the paid plan early

You don't have to wait out the 7 days. Starting early is the only way to get the full allowance, the backlink exchange, Reddit Presence or Studio during the first week.

1. Open **Dashboard → Plan & Billing**.
2. Click **Unlock everything now**. On the Studio page, the same action is labeled **Start paid plan now**.
3. Read the confirmation, "Start your paid plan today?". It explains that the trial ends now, your card is charged $49.50 for the first month, and the plan renews monthly from today.
4. Click **Start plan · $49.50**.

If the charge goes through, you get the full allowance immediately: 30 articles, backlinks and Reddit Presence, and Studio opens. If the charge fails, nothing changes and you stay on the trial. If the result can't be confirmed straight away, you see "The payment is still being confirmed. Check back in a minute."

## Cancel during the trial

1. Open **Dashboard → Plan & Billing**.
2. Click **Card & invoices** (top right) or **Manage in Stripe**. The Stripe billing portal opens in a new tab.
3. Cancel the subscription in the portal.

After you cancel, the plan's status shows **Ending** and the page says "Your trial ends {date} and won't convert." You keep the trial, including any of the 7 article credits left, until that date, and your card is not charged. The trial's articles stay on your site. If you change your mind before the end date, click **Keep my plan** on the "Your plan ends" banner in **Plan & Billing**, which opens the portal, and renew the subscription there.

## If the card fails at the end of the trial

If Stripe can't take the first $49.50 when the trial ends, the subscription becomes **Payment due**:

- **Plan & Billing** shows "Your last payment didn't go through" with an **Update card** button that opens the Stripe portal.
- For the first 48 hours after the failed payment, you can still use whatever trial article credits are left. No new credits are granted.
- After 48 hours, writing and autopilot stop until the invoice is paid.
- The backlink exchange, Reddit Presence and Studio stay closed, because no invoice has been paid.

Once the invoice is paid, the subscription becomes active and the site is refilled to 30 article credits, with backlinks, Reddit Presence and Studio unlocked.

## Troubleshooting the trial

| What you see | What it means and what to do |
| --- | --- |
| "We couldn't verify your card. Update it in billing to start generating." | The $1.00 card check failed. Updating the card in the Stripe portal doesn't rerun the check. Either update the card and then start the paid plan with **Unlock everything now**, or [contact support](/docs/help/support) |
| "Your payment went through, but we couldn't start the trial." | Checkout finished but Rankbox couldn't confirm it straight away. Reload the dashboard after a minute. Stripe's own notification usually completes it |
| Rankbox asks you to start a trial you just started | The confirmation from Stripe hadn't arrived when the page loaded. Reload the page |
| A pending $1.00 on your statement | The card check. It's released, never captured |

## Related

- [Plans and credits](/docs/account/plans-and-credits): the full allowance and how each credit resets.
- [Billing, invoices and cancellation](/docs/account/billing): the Stripe portal, renewals and refunds.
- [Studio: run several sites](/docs/account/studio): adding sites once the plan is paid.
- [Onboarding, step by step](/docs/get-started/onboarding): what you set up before the trial.
- [Autopilot and the publishing schedule](/docs/content/autopilot): what autopilot does once the trial starts.
