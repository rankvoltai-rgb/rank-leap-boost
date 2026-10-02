---
title: Security and privacy
nav_title: Security and privacy
description: How Rankbox protects your account and data: sign-in, connected apps, API keys, platform tokens, payments, subprocessors, retention and deletion.
order: 6
updated: 2026-10-02
---

This page explains how Rankbox keeps your account and data safe, what connected apps and keys can and can't reach, which kinds of providers process your data, and how to have it deleted. It describes practices in the product today. For the legal terms, read the [Privacy Policy](/legal/privacy), the [Data Processing Addendum](/legal/dpa) and the [Trust & Security](/trust) page.

## Security at a glance

| Area | How it works |
| --- | --- |
| Sign-in | Email and password, or Google |
| Passwords | Handled by a managed authentication provider and stored hashed, never in plain text |
| Your data | Scoped to your account. Each user can access only their own sites, articles, keywords, settings and billing records |
| Credit balances | Read-only from the browser. Only Rankbox's server-side processes change them |
| Connected AI apps | Approved on a consent page. Their tokens work only with the Rankbox MCP server |
| API keys | Shown once. Stored only as a SHA-256 hash. Revocable at any time |
| Webflow and Shopify tokens | Encrypted at rest with AES-256-GCM and used only on Rankbox's servers |
| Payments | Processed by Stripe. Rankbox never receives or stores your card number |
| Reddit | Rankbox never posts to Reddit and never holds a Reddit login |
| In transit | Traffic is served over HTTPS |

## Signing in

You can sign in to Rankbox in two ways:

- **Google.** Click **Google** on the sign-in page. Google handles your credentials, and Rankbox receives your name and email from it.
- **Email and password.** Your password is handled by Rankbox's managed authentication provider and stored hashed.

Signing in with Google lets you protect the account with your Google account's 2-Step Verification. Rankbox's own email-and-password sign-in has no second step, so use a strong, unique password.

The sign-in page has no password-reset link. If you can't sign in, or you need to change the email on your account, [contact support](/docs/help/support).

**Settings → Account → Sign out** ends your session, clears your data from the browser tab, and also ends your sessions in other browsers. Use it if you signed in on a computer you no longer control.

## How your data is isolated

Every row of your data belongs to your account, and the database enforces that on every read and write, whatever a browser sends:

- You can read and change only your own sites, articles, keywords and settings.
- Every per-site record must point to a site that the same owner owns. A request can't attach data to another account's site.
- Extra sites are added, archived and restored only through billing. From the browser you can create your first site in onboarding and edit a site's brand fields, but never change a site's billing status.
- Credit balances and credit ledgers are read-only from the browser. Credits are granted and spent only by Rankbox's server-side billing and generation processes.
- Server actions that act on a site, like writing an article, first check on the server that the site is yours and that it's entitled to that action.

## Connected apps and the consent page

When you add Rankbox to an AI app such as Claude, ChatGPT or Cursor, the app sends you to Rankbox's consent page at `/oauth/consent` to approve it.

1. If you aren't signed in, the page asks you to **Sign in to Rankbox** first.
2. The page shows "{App} wants to use your Rankbox account", with the email you're signed in as and a **Not you?** link to switch accounts.
3. Read what the app will be able to do. It always includes "Use Rankbox's AI search tools for you", plus profile details only if the app asked for them: your name and profile picture, your email address, or staying connected without asking again.
4. Check where you'll be sent afterwards. The page names the destination, such as the app's domain or "an app on this computer".
5. Click **Connect** to approve, or **Cancel** to refuse.

If you've approved the same app before, the page sends you straight back to it without asking again.

> [!WARNING]
> Apps name themselves, and Rankbox doesn't verify the name. Only click **Connect** if you just added Rankbox to that app yourself, and check that the destination shown is the app you expect.

### What an approved app can and can't do

An approved app gets a token that works only with the [Rankbox MCP server](/docs/ai-tools/mcp-server), which provides AI search research tools. The rest of Rankbox refuses that token:

- Rankbox's dashboard server actions reject it.
- Every table in Rankbox's database returns no rows to it and accepts no changes from it.

In practice, an app you connect can't see or change your sites, articles, keys or billing. It can't create API keys or read your subscription either, even though it acts as you.

To stop an app from using your account, remove the Rankbox connector in that app's settings. For help revoking an app's access, [contact support](/docs/help/support).

## API keys

API keys let your site or your code pull articles through the [REST API](/docs/api/overview). You create and revoke them in **Dashboard → Integrations**.

- **Format:** every key starts with `rv_live_`. The prefix is left over from Rankbox's earlier name and is kept on purpose.
- **Shown once:** the full key appears only when you create it. Copy it then.
- **Hashed at rest:** Rankbox stores only a SHA-256 hash of each key, plus a short, unusable prefix such as `rv_live_a1b2c3…` so you can tell keys apart. A copy of the database alone doesn't expose a usable key.
- **One site per key:** a key reads and writes only the site it was created for.
- **Tied to the plan:** a key works only while its site has an active trial or plan. A key for an archived Studio site, or an account whose plan has ended, gets `402` with the code `subscription_required`.
- **Revocable:** revoking a key stops it at once and can't be undone. To rotate a key, create the replacement, put it on your site, then revoke the old one.
- **Rate limited:** the public API limits requests per IP address and per account. See [Rate limits](/docs/api/rate-limits).

Treat a key like a password. Keep it in server-side configuration, never in client-side JavaScript or a public repository.

## Webflow and Shopify connections

If you connect a site to Webflow or Shopify, Rankbox stores the access token the platform issues so it can publish articles without you having the platform open. See [How publishing works](/docs/publishing/overview) for what each platform supports.

- Tokens are encrypted at rest with AES-256-GCM. They're never stored in plain text.
- Tokens are used only on Rankbox's servers. The dashboard reads connection status through server actions that never return the token, and the browser can't read the connection tables at all.
- **Webflow:** disconnecting deletes the stored token and asks Webflow to revoke it.
- **Shopify:** uninstalling the Rankbox app from your Shopify admin deletes the stored tokens. Disconnecting the store in Rankbox unlinks it from your site.
- Your site never gives Rankbox a password. Other platforms connect with an API key you can revoke.

## Payments

Payments run through Stripe. You enter your card in Stripe's checkout and manage it in Stripe's billing portal.

- Rankbox never receives or stores your full card number.
- Rankbox keeps billing records such as your plan, billing status and transaction references.
- Rankbox can display your card's brand and last four digits, which it reads from Stripe, for example when Studio confirms which card a charge goes to.
- When a trial starts, Rankbox places a $1.00 authorization on the card and releases it at once to confirm the card can hold funds. It's never captured. See [The free trial](/docs/account/free-trial#the-card-check).

## Reddit Presence

Rankbox never posts to Reddit and never holds a Reddit username, password or token. It drafts replies; you post them yourself from your own Reddit account and paste the permalink back. See [Reddit Presence](/docs/growth/reddit-presence).

## Data processing and subprocessors

Rankbox is operated by Autusus LLC. To run the service, Rankbox shares data with providers only as needed. The Privacy Policy, the DPA and the Trust page list these categories:

| Category | Used for |
| --- | --- |
| Cloud hosting and database providers | Storing and serving your data, and sign-in |
| A payment processor | Subscriptions and billing |
| AI model providers | Researching, writing and scoring the content you request |
| Analytics and email providers | Operating and improving the service |
| Publishing and research integrations | Researching topics and publishing to the destinations you connect |

Rankbox doesn't sell your personal information. Your data may be processed in countries other than your own, with appropriate safeguards where required.

For personal data you submit about your own end users, you're the data controller and Autusus LLC acts as a data processor, processing it only on your instructions and to provide the service. Business customers who need a signed data processing agreement can email Rankboxai@gmail.com.

## Data retention and deletion

- **While your account is active,** Rankbox keeps your data to provide the service.
- **Articles:** you can delete an article from the dashboard at any time.
- **Studio sites:** removing a site archives it. Its articles and settings are kept so you can restore it; archiving doesn't delete them.
- **A plan that ends:** your articles, settings and archived sites stay on the account.
- **Your published content:** articles Rankbox published to your website stay there. Rankbox doesn't remove them; you manage them in your CMS.
- **Deleting your account:** there is no self-serve delete button. Email Rankboxai@gmail.com and ask for deletion. When an account is deleted, its sites and everything attached to them are deleted with it, and personal data is deleted or anonymized within a reasonable period, except where the law requires keeping it.

Depending on where you live, for example under the GDPR or the CCPA, you may have the right to access, correct, export or delete your personal data, and to object to or restrict certain processing. Email Rankboxai@gmail.com to exercise these rights.

## Cookies

Rankbox uses essential cookies and similar storage to keep you signed in and secure your session, preference cookies to remember your choices, and analytics cookies to understand how the service is used. Blocking essential cookies breaks sign-in. See the [Cookie Policy](/legal/cookies).

## Report a security issue

If you think you've found a security vulnerability, or you're concerned about how your data is handled, email Rankboxai@gmail.com with the details. Rankbox reviews reports promptly and works with you to understand and fix the issue.

## Certifications

The Trust page and the DPA describe Rankbox's own practices. Neither is an independent audit or a certification.

## Related

- [Authentication and API keys](/docs/api/authentication): creating, using and revoking keys.
- [The Rankbox MCP server](/docs/ai-tools/mcp-server): what connected AI apps can use.
- [Connect your AI tools](/docs/ai-tools/connect-ai-tools): adding Rankbox to Claude, ChatGPT and Cursor.
- [Account and site settings](/docs/account/settings): signing out and what lives in Settings.
- [Billing, invoices and cancellation](/docs/account/billing): the Stripe portal and refunds.
- [Get help](/docs/help/support): account changes and deletion requests.
