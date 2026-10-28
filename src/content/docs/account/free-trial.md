---
title: The free trial
nav_title: Free trial
description: How the 7-day Rankbox trial works, from adding a card as the last step of onboarding to the $1 card check, automatic conversion, early upgrade, cancelling and failed payments.
order: 2
updated: 2026-10-28
---

The Rankbox free trial lasts 7 days and lets Rankbox write and publish up to 7 articles for your site before you pay anything. It starts at step 4 of onboarding, where you add a card in Stripe Checkout, and it is required: the dashboard opens only once the trial has started. If you don't cancel, you're charged $49.50 a month for the Business plan 7 days after you start. Each account gets one free trial.

## The trial at a glance

| Item | During the trial |
| --- | --- |
| Length | 7 days from the moment checkout completes |
| Card | Required, entered in Stripe Checkout at step 4 of onboarding |
| Charged when you start | $0. A $1.00 card authorization is placed and released at once (see [The card check](#the-card-check)) |
| Article credits | 7 for your plan's own site |
| Sites | 1. Studio opens with the first payment |
| Research, writing, scoring, editing | Included |
| Autopilot | Included, limited by the 7 article credits |
| Publishing (REST API keys and publishing connections) | Included |
| Backlink exchange | Not included. Opens with the first paid invoice |
| Reddit Presence | Not included. Opens with the first paid invoice |
| After 7 days | Converts to the Business plan: $49.50 a month, charged 7 days after you start, unless you cancel first |
| Trials per account | One. Restarting a plan that has ended is paid from day one |

## Before the trial starts

Signing up and the first three steps of onboarding (**Brand**, **Keywords** and **Plan**) happen before you add a card. Confirming step 3 saves your site, its keywords and its content plan, then step 4 asks for the card. Step 4 has no skip.

- **The dashboard waits for the trial.** An account with no subscription that opens the dashboard is sent back to step 4. This includes accounts created before the card step existed.
- **Leaving is safe.** If you close the tab or sign out at step 4, your site and plan stay saved, and you resume on step 4 the next time you sign in.
- **Nothing is written before the trial.** The check runs on Rankbox's servers, so it applies equally to the dashboard, to autopilot and to API keys. A request to write an article for an account with no subscription is refused with "Start your free trial to generate articles."

## Start the trial

1. On step 3 of onboarding, click **Continue**. Step 4, "Start your 7-day free trial", opens with the number of articles planned and ready.
2. Read the terms above the card form: "A card is required to start. We place a $1 hold to verify it and release it right away, so nothing is charged today. Your plan starts at $49.50/month 7 days from today unless you cancel first."
3. Enter your card details in Stripe's checkout form and complete checkout.
4. Wait for "Starting your trial…" to finish. "Your 7-day trial is live. Welcome to Rankbox." confirms it, and the dashboard opens.

If you're signed in to the wrong account, use **Sign out** under "Not the right account?" at the bottom of step 4.

> [!NOTE]
> Card details go straight to Stripe. Rankbox never receives or stores your full card number.

## The card check

When a trial starts, Rankbox asks Stripe to place a $1.00 authorization on the card and then releases it immediately. Nothing is captured or charged. It exists because a card can pass checkout's $0 setup while holding no funds. Your bank may show the $1.00 as a pending authorization for a day or two before it disappears.

If the authorization fails, the trial still exists, but article writing is paused. Onboarding ends with "Your trial started, but we couldn't verify your card. Update it from the dashboard to start writing." Until the check passes:

- **Write now** is refused with "We couldn't verify your card. Update it to start writing."
- Autopilot doesn't write.
- The editor's AI actions (rewrite, expand, shorten and improve SEO) are refused with the same message.

This can happen with an empty or prepaid card, and also with a valid card whose bank requires 3-D Secure for the hold.

### Fix a failed card check

While the check has failed, a red banner at the top of every dashboard page reads "We couldn't verify your card. Article writing is paused until you update it. Everything you've set up is saved."

1. Click **Update card** on the banner. Stripe's card-update page opens.
2. Enter the new card and save it. Stripe returns you to the dashboard.
3. Rankbox runs the $1.00 check again on the new card while you're on the page ("Checking your card…"). If your bank asks for 3-D Secure, approve it in the prompt that appears on the page.
4. When the check passes, you see "Billing is sorted. Article writing is back on." The banner clears and writing and autopilot resume.

If the new card fails the check too, the banner stays and a message says why. Click **Update card** again and try another card.

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

If the trial isn't cancelled, Stripe charges the card $49.50 seven days after you started, and the subscription becomes active. At that moment:

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

After you cancel, the plan's status shows **Ending** and the page says "Your trial ends {date} and won't convert." You keep the trial, including any of the 7 article credits left, until that date, and your card is not charged. The trial's articles stay on your site. If you change your mind before the end date, click **Keep my plan** on the "Your plan ends" banner in **Plan & Billing**, which opens the portal, and renew the subscription there. Once the end date has passed, the trial can't be restarted; a new plan is paid from day one (see [One trial per account](#one-trial-per-account)).

## If the card fails at the end of the trial

If Stripe can't take the first $49.50 when the trial converts, the subscription becomes **Payment due**, and everything that needs the plan stops at once:

- Article writing and autopilot stop, including any trial article credits left over. There is no grace period.
- The backlink exchange, Reddit Presence and Studio stay closed, because no invoice has been paid.
- A red banner at the top of every dashboard page reads "Your last payment didn't go through." with an **Update billing** button.

To fix it:

1. Click **Update billing** on the banner. Stripe's card-update page opens.
2. Enter a new card and save it. Stripe returns you to the dashboard.
3. Rankbox immediately retries the open invoice with the new card. If your bank asks for 3-D Secure, approve it in the prompt that appears on the page.
4. When the invoice is paid, you see "Billing is sorted. Article writing is back on."

The subscription is then active, the site is refilled to 30 article credits, and the backlink exchange, Reddit Presence and Studio open.

## One trial per account

Each account gets one free trial. Once a trial or plan has ended, restarting it is paid from day one:

- The banner at the top of the dashboard reads "Your plan has ended." with a **Restart plan** button.
- **Restart plan** opens a checkout at $49.50/month, starting today. There's no second trial.
- Your articles, keywords and settings are kept, and autopilot picks up where it left off once the plan is paid.

## Troubleshooting the trial

| What you see | What it means and what to do |
| --- | --- |
| "We couldn't verify your card. Update it to start writing." | The $1.00 card check failed. Click **Update card** on the banner and add a card that can hold $1.00. Rankbox reruns the check when you return. See [Fix a failed card check](#fix-a-failed-card-check) |
| "Your card went through, but the trial hasn't shown up yet. Refresh in a moment." | Checkout finished but Rankbox couldn't confirm it straight away. Reload the page after a minute. Stripe's own notification usually completes it |
| Step 4 of onboarding opens when you try to open the dashboard | The account has no trial or plan yet. Add a card on step 4 to start the trial. If you just added one, reload the page |
| "Your last payment didn't go through." | The trial's first charge failed. Click **Update billing**. See [If the card fails at the end of the trial](#if-the-card-fails-at-the-end-of-the-trial) |
| A pending $1.00 on your statement | The card check. It's released, never captured |

## Related

- [Plans and credits](/docs/account/plans-and-credits): the full allowance and how each credit resets.
- [Billing, invoices and cancellation](/docs/account/billing): the Stripe portal, renewals and refunds.
- [Studio: run several sites](/docs/account/studio): adding sites once the plan is paid.
- [Onboarding, step by step](/docs/get-started/onboarding): the steps before the card, and step 4 where the trial starts.
- [Autopilot and the publishing schedule](/docs/content/autopilot): what autopilot does once the trial starts.
