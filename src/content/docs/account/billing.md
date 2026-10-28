---
title: Billing, invoices and cancellation
nav_title: Billing
description: How Rankbox billing works: what Plan & Billing shows, the Stripe portal for cards, invoices and cancelling, plus refunds and failed payments.
order: 3
updated: 2026-10-28
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
| Banners | A notice at the top when the plan is set to end or isn't renewing. A failed payment, a failed card check or an ended plan shows in the [billing banner](#the-billing-banner) on every dashboard page instead |

Every account that reaches Plan & Billing has a subscription: an account without one is sent to step 4 of onboarding to start the trial before the dashboard opens. See [Step 4: Trial](/docs/get-started/onboarding#step-4-trial).

### Your plan

The line above the progress bar tells you where the plan stands:

| Line | Meaning |
| --- | --- |
| "N days left in your free trial" | You're on the [free trial](/docs/account/free-trial) |
| "Renews {date}" | The plan is active and renews on that date |
| "Access until {date}" | You cancelled. Everything works until that date, then stops |
| "Payment overdue" | The last payment failed |

When the plan has ended, the period line is hidden, the status shows **Canceled**, and the billing banner at the top of the page reads "Your plan has ended." with a **Restart plan** button.

During the trial, this panel also shows your trial article usage, what waits for the first payment, and the **Unlock everything now** button that starts the paid plan early.

### Plan status labels

| Label | Stripe status | What it means for you |
| --- | --- | --- |
| **Free trial** | trialing | Writing works with 7 article credits. Backlinks, Reddit and Studio are closed |
| **Active** | active | Everything in the plan works |
| **Ending** | active or trialing, set to cancel | Everything works until the period's end date, then stops |
| **Payment due** | past_due | A payment failed. Writing, autopilot and the paid features stop until it's paid. See [Failed payments](#failed-payments) |
| **Unpaid** | unpaid | Payment failed and retries are over. Writing is stopped |
| **Incomplete** | incomplete | The first payment didn't complete. Writing is stopped |
| **Canceled** | canceled | The plan has ended |

### Next invoice

The **Next invoice** total is the Business plan plus every Studio site that is billed next period. A Studio site you've scheduled for removal isn't included, because it stops billing from the next invoice. If you cancel, the panel shows "None scheduled".

## The billing banner

While billing stops your account from writing, a red banner sits at the top of every dashboard page. It says what's paused, that nothing is lost, and has the one button that fixes it.

| Banner | Why it shows | Button |
| --- | --- | --- |
| "We couldn't verify your card." | The trial's $1.00 card check failed | **Update card** opens Stripe's card-update page. Back on the dashboard, Rankbox reruns the check on the new card. See [Fix a failed card check](/docs/account/free-trial#fix-a-failed-card-check) |
| "Your last payment didn't go through." | The trial's first charge or a renewal failed (Stripe status `past_due`, `unpaid` or `incomplete`) | **Update billing** opens Stripe's card-update page. Back on the dashboard, Rankbox retries the open invoice with the new card. See [Failed payments](#failed-payments) |
| "Your plan has ended." | The plan was cancelled and its period is over | **Restart plan** opens a checkout at $49.50/month, starting today. See [Restart after the plan has ended](#restart-after-the-plan-has-ended) |

**Update card** and **Update billing** open in the same tab and bring you back to the page you were on. If your bank asks for 3-D Secure when Rankbox reruns the check or retries the payment, the approval appears on the page. When it goes through, you see "Billing is sorted. Article writing is back on." and the banner clears.

## The Stripe billing portal

Rankbox doesn't handle card numbers. Payment details, invoices and cancellation live in Stripe's billing portal, which opens in a new browser tab.

These buttons open the portal:

- **Card & invoices**, in the page header.
- **Manage in Stripe**, under the next invoice.
- **Keep my plan**, on the plan-ending banner.

In the portal you can:

- Update the card that pays for the plan and every Studio site.
- See and download past invoices and receipts.
- Cancel the subscription, or renew one that is set to end.

To fix a failed payment or a failed card check, use the billing banner's button rather than **Card & invoices**. It brings you back to the dashboard, where Rankbox retries the payment or reruns the card check with the new card straight away.

> [!NOTE]
> The portal belongs to your subscription, so it opens once the trial has started at the end of onboarding.

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

When a plan has ended, the banner at the top of every dashboard page reads "Your plan has ended. Your articles and settings are saved. Restart your plan to keep writing." Click **Restart plan** to open a checkout at $49.50/month, starting today. The free trial is once per account, so a restarted plan is paid from day one, with no second trial. Your articles and settings are still there, and autopilot picks up where it left off once the plan is paid.

If the subscription was cancelled but its paid period hasn't run out, Plan & Billing shows "Your plan isn't renewing" with the same **Restart plan** button.

## Refunds

Rankbox's [Refund & Cancellation Policy](/legal/refunds) sets these rules:

- Subscription fees are non-refundable, including partial billing periods and unused time.
- Removing a Studio site isn't refunded either. The site runs to the end of the period you've paid for.
- **Billing errors** are the exception. If you were charged in error, or charged twice for the same period, Rankbox reviews and corrects verified errors.
- Where consumer-protection law in your jurisdiction requires a refund, Rankbox honors it.

To request a billing review, email Rankboxai@gmail.com with the email on your account and the approximate date and amount of the charge.

> [!TIP]
> The 7-day free trial exists so you can see Rankbox work on your own site before paying. Cancel before the trial's end date and you aren't charged at all. Each account gets one trial.

## Failed payments

When a payment fails, whether it's the trial's first charge or a monthly renewal, the plan shows **Payment due** and the billing banner reads "Your last payment didn't go through. Article writing and autopilot are paused until you update billing. Your articles and settings are safe." There is no grace period: everything below stops from the first failure.

| Area | While a payment is overdue |
| --- | --- |
| Writing | Stops on every site. **Write now** and the editor's AI actions are refused with "Your last payment didn't go through. Update billing to keep writing." |
| Autopilot | Stops. Scheduled articles wait in the queue |
| Backlink exchange and Reddit Presence | Stop |
| Studio | Studio sites stop writing, and you can't add or restore sites |
| Credits | Not refilled. Credits left from the previous period can't be used until the invoice is paid |
| API keys | Syncs return `402` with the code `subscription_required` |

The statuses **Payment due** (`past_due`), **Unpaid** (`unpaid`) and **Incomplete** (`incomplete`) all block in the same way.

To fix it:

1. Click **Update billing** on the banner. Stripe's card-update page opens.
2. Replace the card and save it. Stripe returns you to the dashboard.
3. Rankbox immediately retries the open invoice with the new card. If your bank asks for 3-D Secure, approve it on the page.
4. When the invoice is paid, you see "Billing is sorted. Article writing is back on."

Your articles and settings stay safe throughout. As soon as the invoice is paid, the plan becomes **Active** again, every site's credits refill for the new period, and writing, autopilot and the paid features resume. If the payment isn't fixed and the subscription ends up **Canceled**, you can start again with **Restart plan**, paid from day one.

## Invoices, taxes and your billing email

- **Invoices and receipts** are in the Stripe portal under **Card & invoices**. Rankbox keeps your plan, billing status and transaction references, but not your card number.
- **Taxes:** Rankbox's prices are listed in USD. For questions about tax on a specific invoice, [contact support](/docs/help/support).
- **Billing email:** **Settings → Account → Email** shows the address receipts and account emails go to. It's read-only in the dashboard. To change the email on your account, [contact support](/docs/help/support).

## Troubleshooting billing

| Problem | What to do |
| --- | --- |
| Clicking **Card & invoices** opens nothing | The portal opens in a new tab. Allow pop-ups for rankbox.xyz and try again |
| "Couldn't open billing portal." or "No subscription found" | The account has no subscription. Finish step 4 of onboarding to start the trial |
| The banner stays after you updated the card from **Card & invoices** | The portal on its own only changes the card on file. Click **Update card** or **Update billing** on the banner so Rankbox reruns the check or retries the payment |
| Charged after cancelling | Cancelling stops the next renewal; it doesn't refund the current period. If the charge came after the end date, request a billing review |
| Charged twice for one period | Email support with the date and amount. Verified billing errors are corrected |
| The page still shows the old status after a change in the portal | Reload the page. Stripe notifies Rankbox within moments |

## Related

- [Plans and credits](/docs/account/plans-and-credits): what the plan includes and when credits refill.
- [The free trial](/docs/account/free-trial): the card check, converting, starting early and cancelling during the trial.
- [Studio: run several sites](/docs/account/studio): extra sites on the same invoice.
- [Account and site settings](/docs/account/settings): the Account section and your email.
- [Errors](/docs/api/errors): what a `402` means for API syncs.
- [Get help](/docs/help/support): billing reviews and account changes.
