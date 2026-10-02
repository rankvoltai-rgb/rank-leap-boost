---
title: Get help
description: How to contact Rankbox support, what to include in a request, where to raise billing errors and security issues, and where to follow product changes.
order: 3
updated: 2026-10-02
---

Rankbox support works by email. This page lists the contact address, the details to include so your request can be answered without a back-and-forth, how to raise billing, privacy and security matters, and where to follow product changes.

## Contact Rankbox

Email **Rankboxai@gmail.com**. The same address handles product questions, billing, privacy requests and security reports.

| Detail | Value |
| --- | --- |
| Support email | Rankboxai@gmail.com |
| Company | Autusus LLC, the operator of Rankbox |
| Website | `https://rankbox.xyz` |

Write from the email address on your Rankbox account when you can. It's the fastest way for support to find your account, and it's required for billing and privacy requests.

## Before you write

Many problems have a documented fix. Search for the exact message you see:

- [Troubleshooting](/docs/help/troubleshooting) quotes Rankbox's error messages word for word, grouped by area: sign-in, onboarding, trial and billing, writing, autopilot, the API, Webflow, Shopify, backlinks, Reddit and Studio.
- [FAQ](/docs/help/faq) answers the questions people ask most.
- [Errors](/docs/api/errors) lists every REST API status code and what to do about it.

Some messages ask you to contact support because nothing on your side can fix them, for example "Studio isn't switched on for this account yet. Contact support and we'll set it up." or "Reddit discovery isn't switched on yet". For those, write straight away and quote the message.

## What to include in a support request

Include as much of this as applies. Each item removes a round of questions.

| Include | Why | Where to find it |
| --- | --- | --- |
| Your account email | Identifies your account | **Settings → Account → Email** |
| The site's website address | Identifies the site, especially on an account with Studio sites | The site switcher at the foot of the sidebar |
| A link to the article | Identifies the exact article | Open it, then **More actions → Copy link**. The link contains `?article=` and the article id |
| When it happened, with your time zone | Lets support find the event in the logs | Your own notes; for API calls, the time you sent the request, in UTC if you can |
| The exact message you saw | Most messages map to one cause | Copy it from the screen or the API response |
| What you were doing | Reproduces the problem | The page and the button you clicked, in order |
| For API problems: endpoint, HTTP status and response body | Separates key, plan, rate-limit and server errors | Your server or build logs |
| For API problems: the key's prefix | Identifies the key without exposing it | **Integrations → Your connections**, for example `rv_live_a1b2c3…` |
| For Webflow or Shopify: the Webflow site or the Shopify store | Identifies the connection | The Webflow tile in **Integrations**, or your Shopify admin |

A request that reads "Article on yoursite.com, link attached, failed at 14:05 UTC with 'Couldn't publish to Webflow.' after I clicked **Sync now**" can usually be answered in one reply.

> [!WARNING]
> Never send a full API key, a password or a card number by email. A key prefix such as `rv_live_a1b2c3…` is enough to identify a key. If you think a key was exposed, replace it in **Integrations → Your connections** with **Replace key**, then revoke the old one.

## Billing questions and refunds

Billing runs through Stripe. Most billing tasks don't need support:

- **Update your card, download invoices or cancel:** open **Plan & Billing** and click **Card & invoices** to reach Stripe's billing portal.
- **Start the paid plan before the trial ends:** **Plan & Billing → Unlock everything now**.
- **Add or remove Studio sites:** **Studio**.

Subscriptions are non-refundable, which is why the free trial exists. If you were charged in error, or charged twice for the same period, email support with the email on your account and the approximate date and amount of the charge; verified billing errors are corrected. Where the law in your jurisdiction requires a refund, it is honored. You can also email support to cancel. The full terms are in the [Refund and Cancellation Policy](/legal/refunds). See [Billing, invoices and cancellation](/docs/account/billing).

## Privacy requests and account deletion

To access, correct, export or delete your personal data, or to delete your account and its data, email support from the address on your account. Requests are answered within the timeframe the applicable law requires. Rankbox doesn't have a self-serve account deletion button.

The [Privacy Policy](/legal/privacy) explains what Rankbox collects and why, and the [Trust and security page](/trust) summarizes how data is handled. Business customers can review the [Data Processing Addendum](/legal/dpa). See [Security and privacy](/docs/account/security).

## Report a security issue

If you believe you've found a security vulnerability, or have a concern about how your data is handled, email **Rankboxai@gmail.com** with the details: what you found, how to reproduce it, and what it affects. Reports are reviewed promptly, and support works with you to understand and fix the issue.

Please report privately by email rather than in public, and don't access, change or delete data that isn't yours while testing. The [Acceptable Use Policy](/legal/acceptable-use) applies to all use of Rankbox.

## Follow product changes

The [changelog](/changelog) lists what shipped to Rankbox, newest first. Each release has its own page with the date, who it applies to (for example **Paid plans**) and a status showing whether it is live for customers or still being switched on.

- **Subscribe by RSS:** `https://rankbox.xyz/changelog/rss.xml`.
- **Check a feature's availability before you report it missing:** the changelog entry for the feature says whether it is live.

## Docs for AI agents

Every page in these docs is available as Markdown, so an AI assistant or agent can read it directly:

| Address | What it returns |
| --- | --- |
| `https://rankbox.xyz/docs/llms.txt` | An index of every docs page, with one line describing each |
| `https://rankbox.xyz/docs/llms-full.txt` | Every docs page in one Markdown file |
| Any docs page address plus `.md` | That page's raw Markdown, for example `https://rankbox.xyz/docs/help/support.md` |

To have an AI assistant help with a Rankbox problem, point it at `https://rankbox.xyz/docs/llms.txt` and the relevant page. For agents that act on an account, start with [Agent access](/docs/agents/overview).

## Legal and policy pages

| Page | Address |
| --- | --- |
| Terms of Service | [/legal/terms](/legal/terms) |
| Privacy Policy | [/legal/privacy](/legal/privacy) |
| Refund and Cancellation Policy | [/legal/refunds](/legal/refunds) |
| Cookie Policy | [/legal/cookies](/legal/cookies) |
| Acceptable Use Policy | [/legal/acceptable-use](/legal/acceptable-use) |
| Data Processing Addendum | [/legal/dpa](/legal/dpa) |
| Trust and security | [/trust](/trust) |
| About Rankbox | [/about](/about) |

## Related

- [Troubleshooting](/docs/help/troubleshooting): fixes for the messages you see, by area.
- [FAQ](/docs/help/faq): short answers to common questions.
- [Billing, invoices and cancellation](/docs/account/billing): the billing portal and what each banner means.
- [Security and privacy](/docs/account/security): how your account and data are protected.
- [Agent access](/docs/agents/overview): what AI agents can do with Rankbox.
