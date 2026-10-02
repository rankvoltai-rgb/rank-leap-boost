---
title: Billing, invoices and cancellation
nav_title: Billing
description: How Rankbox billing works: what Plan & Billing shows, the Stripe portal for cards, invoices and cancelling, plus refunds and failed payments.
order: 3
updated: 2026-10-02
---

Rankbox bills one subscription per account: the Business plan at $49.50 a month, plus $49.50 a month for each extra site you run with Studio, all on one invoice and one card. You see it in **Dashboard → Plan & Billing** and manage your card, invoices and cancellation in Stripe's billing portal.

## Open Plan & Billing

Open **Dashboard → Plan & Billing** from the sidebar's **Account** group, next to **Studio** and **Settings**. The page is account-wide. It shows the same subscription whichever site the site switcher is on, because every site is billed on the same subscription.

The page header reads "One plan, one invoice, every site on it." Once you have a subscription, the header also has a **Card & invoices** button that opens the Stripe billing portal.

## What Plan & Billing shows

| Panel | What's in it |
| --- | --- |
| **Your plan** | The plan name (Business), its status, the price, the current period's dates and a progress bar through the period |
| **Next invoice** (or **First charge** during the trial) | The amount of the next charge, its date, and a breakdown: the plan, plus Studio sites × $49.50 |
| **Sites & usage** | Every live site, its article credits used this cycle, and what it costs: "Included" for your plan's own site, "$49.50/mo" for a Studio site, or "Not renewing" for one being removed |
| **Billing questions** | Short answers about cancelling, refunds, payment and the trial |
| Banners | A notice at the top when a payment has failed, the plan is set to end, or the plan isn't active |

Without a subscription, the page shows the offer instead: the 7-day free trial, $0 today, $49.50 a month after the trial, and a **Start 7-day free trial** button.

### Your plan

The line above the progress bar tells you where the plan stands:

| Line | Meaning |
| --- | --- |
| "N days left in your free trial" | You're on the [free trial](/docs/account/free-trial) |
| "Renews {date}" | The plan is active and renews on that date |
| "Access until {date}" | You cancelled. Everything works until that date, then stops |
| "Payment overdue" | The last payment failed |

When the plan has ended, the period line is hidden, the status shows **Canceled**, and a "Your plan isn't active" banner appears at the top.

During the trial, this panel also shows your trial article usage, what waits for the first payment, and the **Unlock everything now** button that starts the paid plan early.

### Plan status labels

| Label | Stripe status | What it means for you |
| --- | --- | --- |
| **Free trial** | trialing | Writing works with 7 article credits. Backlinks, Reddit and Studio are closed |
| **Active** | active | Everything in the plan works |
| **Ending** | active or trialing, set to cancel | Everything works until the period's end date, then stops |
| **Payment due** | past_due | A payment failed. See [Failed payments](#failed-payments) |
| **Unpaid** | unpaid | Payment failed and retries are over. Writing is stopped |
| **Incomplete** | incomplete | The first payment didn't complete. Writing is stopped |
| **Canceled** | canceled | The plan has ended |

### Next invoice

The **Next invoice** total is the Business plan plus every Studio site that is billed next period. A Studio site you've scheduled for removal isn't included, because it stops billing from the next invoice. If you cancel, the panel shows "None scheduled".

## The Stripe billing portal

Rankbox doesn't handle card numbers. Payment details, invoices and cancellation live in Stripe's billing portal, which opens in a new browser tab.

These buttons open the portal:

- **Card & invoices**, in the page header.
- **Manage in Stripe**, under the next invoice.
- **Update card**, on the failed-payment banner.
- **Keep my plan**, on the plan-ending banner.

In the portal you can:

- Update the card that pays for the plan and every Studio site.
- See and download past invoices and receipts.
- Cancel the subscription, or renew one that is set to end.

> [!NOTE]
> The portal belongs to your subscription, so it only opens once you've started the trial or a plan. Before that, Plan & Billing shows the offer instead.

## How you're billed

- **In advance, monthly.** The plan is billed at the start of each monthly period. The renewal date is shown as "Renews {date}".
- **One invoice.** The Business plan and every Studio site renew together on the same invoice and card.
- **Studio sites added mid-period.** Adding or restoring a Studio site charges its share of the current period straight away, then $49.50 a month on the shared invoice. See [Studio](/docs/account/studio).
- **US dollars.** All prices are in USD.
- **No contracts or setup fees.**

Credits refill when a period's payment succeeds, not on a calendar date. See [Plans and credits](/docs/account/plans-and-credits) for each credit's reset rule.

## Cancel your plan

1. Open **Dashboard → Plan & Billing**.
2. Click **Card & invoices** or **Manage in Stripe**.
3. Cancel the subscription in the Stripe portal.
4. Return to Plan & Billing. The plan shows **Ending** with "Access until {date}", and a banner reads "Your plan ends {date}".

Cancelling stops the next renewal. It doesn't cut anything off early.

### What keeps working until the end date

Everything you've paid for keeps running until the end of the current period: writing, autopilot, the backlink exchange, Reddit Presence, publishing and every Studio site.

### What happens when the plan ends

| Area | After the paid period ends |
| --- | --- |
| Articles already published | Stay on your site. Rankbox doesn't remove them |
| Articles and settings in Rankbox | Kept on your account |
| Writing and autopilot | Stop |
| Studio sites | Archived, with their articles and settings kept |
| Backlink exchange | No new links are placed. Live links stay live and your credits are held |
| Reddit Presence | Read-only. Your drafts and history stay visible |
| API keys | Stop syncing. API calls return `402` with the code `subscription_required` |

### Keep your plan before the end date

Click **Keep my plan** on the "Your plan ends" banner. It opens the Stripe portal, where you renew the subscription. Nothing is charged until the next normal renewal.

### Restart after the plan has ended

When a plan has ended, Plan & Billing shows "Your plan isn't active" with a **Restart plan** button. It opens the same start-trial checkout on the Overview. Your articles and settings are still there, and autopilot picks up where it left off.

## Refunds

Rankbox's [Refund & Cancellation Policy](/legal/refunds) sets these rules:

- Subscription fees are non-refundable, including partial billing periods and unused time.
- Removing a Studio site isn't refunded either. The site runs to the end of the period you've paid for.
- **Billing errors** are the exception. If you were charged in error, or charged twice for the same period, Rankbox reviews and corrects verified errors.
- Where consumer-protection law in your jurisdiction requires a refund, Rankbox honors it.

To request a billing review, email Rankboxai@gmail.com with the email on your account and the approximate date and amount of the charge.

> [!TIP]
> The 7-day free trial exists so you can see Rankbox work on your own site before paying. Cancel before the trial's end date and you aren't charged at all.

## Failed payments

When a renewal payment fails, the plan shows **Payment due** and the page shows "Your last payment didn't go through" with an **Update card** button.

1. Click **Update card** to open the Stripe portal.
2. Replace the card.
3. Wait for Stripe to retry the open invoice. Stripe retries failed payments automatically.

What happens while the payment is overdue:

| Time since the payment failed | Effect |
| --- | --- |
| First 48 hours | Writing and autopilot keep running on the credits left from the previous period. Backlinks and Reddit stay on if the account had paid before |
| After 48 hours | Writing, autopilot, the backlink exchange and Reddit Presence stop |
| The whole time | No credits are refilled. Studio can't add or restore sites |

Your articles and settings stay safe throughout. As soon as the invoice is paid, the plan becomes **Active** again and every site's credits refill for the new period. If Stripe's retries all fail, the subscription ends up **Unpaid** or **Canceled**, and you can start again with **Restart plan**.

## Invoices, taxes and your billing email

- **Invoices and receipts** are in the Stripe portal under **Card & invoices**. Rankbox keeps your plan, billing status and transaction references, but not your card number.
- **Taxes:** Rankbox's prices are listed in USD. For questions about tax on a specific invoice, [contact support](/docs/help/support).
- **Billing email:** **Settings → Account → Email** shows the address receipts and account emails go to. It's read-only in the dashboard. To change the email on your account, [contact support](/docs/help/support).

## Troubleshooting billing

| Problem | What to do |
| --- | --- |
| Clicking **Card & invoices** opens nothing | The portal opens in a new tab. Allow pop-ups for rankbox.xyz and try again |
| "Couldn't open billing portal." or "No subscription found" | The account has no subscription. Start the trial first |
| Charged after cancelling | Cancelling stops the next renewal; it doesn't refund the current period. If the charge came after the end date, request a billing review |
| Charged twice for one period | Email support with the date and amount. Verified billing errors are corrected |
| The page still shows the old status after a change in the portal | Reload the page. Stripe notifies Rankbox within moments |

## Related

- [Plans and credits](/docs/account/plans-and-credits): what the plan includes and when credits refill.
- [The free trial](/docs/account/free-trial): converting, starting early and cancelling during the trial.
- [Studio: run several sites](/docs/account/studio): extra sites on the same invoice.
- [Account and site settings](/docs/account/settings): the Account section and your email.
- [Errors](/docs/api/errors): what a `402` means for API syncs.
- [Get help](/docs/help/support): billing reviews and account changes.
