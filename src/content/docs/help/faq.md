---
title: Frequently asked questions
nav_title: FAQ
description: Direct answers to the questions people ask most about Rankbox: setup, articles, publishing, backlinks, Reddit, billing, the API and AI agents.
order: 1
updated: 2026-10-02
---

Short, direct answers to the questions people ask most about Rankbox. Each answer leads with the answer itself and links to the page that covers it in depth.

## Getting started

### What is Rankbox?

Rankbox is an AI search growth engine that researches the searches your buyers make, writes source-backed articles for them, and publishes those articles to your website. It plans one article per keyword from a read of your site, writes on a pace you choose with autopilot, scores every article for SEO and GEO, and, on the paid plan, adds a backlink exchange and Reddit reply drafts. See [What is Rankbox?](/docs/get-started/introduction).

### Do I need a credit card to sign up?

No. Creating an account and building your content plan in onboarding are free and need no card. You add a card when you start the 7-day free trial, which is the first point at which Rankbox can write for you. See [The free trial](/docs/account/free-trial).

### How long does setup take?

Onboarding takes a few minutes. The site analysis takes about 20 seconds, building the plan a little longer, and a first article usually takes under a minute to write. Connecting your site through the API takes as long as adding one API call to your site. See [Quickstart](/docs/get-started/quickstart).

### How do I sign in?

Sign in with Google, or with the email address and password you signed up with, at `https://rankbox.xyz/auth`. Those are the two sign-in methods. See [Troubleshooting: sign-in](/docs/help/troubleshooting#sign-in-and-account) if it doesn't work.

### How do I reset my password?

Rankbox's sign-in page doesn't have a password reset link. If you signed up with Google, use **Google** to sign in. Otherwise, email support from the address on your account and ask for a reset. See [Get help](/docs/help/support).

### Can I invite teammates?

No. A Rankbox account is one login, with no team seats, roles or invitations. To run sites for several clients or brands, add them to the same account with Studio. See [Core concepts: account](/docs/get-started/core-concepts#account).

### Can I change my keywords after onboarding?

Not as a list. The keyword set comes from onboarding, and Settings has no keyword editor. You can still steer what gets written: edit an unwritten article's title, keyword or meta description before it's written, delete articles you don't want, and use **Rank → Next best moves → Plan it** to create an idea for a tracked keyword that has no article. See [Onboarding: change your answers later](/docs/get-started/onboarding#change-your-answers-later).

## Content

### How does Rankbox write articles?

Rankbox researches the live top-ranking pages for the article's keyword, drafts a long-form article in your brand voice, then revises it against its own SEO checks. The draft leads with a direct two to three sentence answer and includes key takeaways, lists, an FAQ, in-text citations and a references section; a relevant YouTube video is embedded when one is found. The writer targets about 2,750 words, and the article panel shows each article's word count and read time under **Content**. See [How articles are written](/docs/content/writing).

### Will articles sound like my brand?

They follow the brand brief in **Settings**: your brand name, what you sell, audience, tone, writing style and house rules. **Settings → What autopilot reads** shows the exact brief the writer receives. Changes apply to the next article written. See [Brand voice and writing settings](/docs/content/brand-voice).

### Can I edit an article before or after it's published?

Yes. Open any article in **Articles** to edit it. Edits to a draft save as you go; edits to a published article stay local until you click **Publish changes**, which also sends them to a connected Webflow or Shopify site. Before an article is written, edit its title, keyword or meta description to steer the writer. See [Editing articles](/docs/content/editor).

### Can I rewrite part of an article without spending a credit?

Yes. Select text in the editor and choose **Improve SEO**, **Rewrite**, **Expand** or **Shorten**. These AI actions don't spend article credits, and neither do edits you make by hand. **Write now** writes a whole article and is offered only for articles that haven't been written yet.

### Can I write an article myself?

Yes. Open an idea or a scheduled article and click **Start writing** to write it by hand, then **Publish**. Writing by hand doesn't spend a credit. If the article is scheduled, publish your version as soon as it's ready: autopilot writes scheduled articles and replaces any unpublished text.

### How often does autopilot publish?

As often as you set under **Settings → Autopilot → Pace**: **Every day**, **5 a week**, **3 a week**, **2 a week** or **1 a week**. Every day is the default and is about 30 articles a month, matching the plan's 30 article credits. Autopilot stops for the rest of the billing period when a site runs out of credits. See [Autopilot and the publishing schedule](/docs/content/autopilot).

### Does Rankbox guarantee rankings, traffic or AI citations?

No. Rankbox writes and structures articles the way search engines and AI answers tend to reward, but it doesn't promise any ranking, traffic or citation outcome. Traffic figures in the dashboard are labelled estimates.

### Does Rankbox track whether AI engines cite my site?

No. Rankbox doesn't track AI citations of your site or articles. It scores each article for the structure AI answers quote, and the **Rank** page shows how many of your articles pass each of those signals, but it doesn't measure whether any AI engine cites you. See [Rank: AI search visibility](/docs/growth/rank).

### Where do the search volumes and traffic estimates come from?

They are estimates. Monthly search volumes in onboarding and on the Rank page are estimated by AI, not taken from a search-volume provider. An article's estimated traffic is modeled from its keyword's estimated volume and its position in the plan. See [Core concepts: estimates and measured data](/docs/get-started/core-concepts#estimates-and-measured-data).

## Publishing

### How do articles get onto my site?

Your site either pulls them or Rankbox pushes them. Any site can pull published articles through the REST API with an API key; Webflow and Shopify sites can instead connect so Rankbox pushes each article into a collection or blog as soon as it's written. See [How publishing works](/docs/publishing/overview).

### Which website platforms does Rankbox work with?

Any of them can publish Rankbox articles through the REST API today, with a developer adding one API call. Webflow and Shopify also have their own push connections. Each platform's page shows exactly what is available for it today: [WordPress](/docs/publishing/wordpress), [Webflow](/docs/publishing/webflow), [Shopify](/docs/publishing/shopify) and [Framer](/docs/publishing/framer).

### What does "Published" mean in Rankbox?

It means the article is written and available to your site. A connected Webflow or Shopify site receives it straight after it's written. A site connected through the API receives it on its next request, so timing depends on how often your code calls Rankbox; **Integrations** shows **Last sync** and how many articles are **On the way**. An article marked Published in Rankbox isn't on your site until one of those happens. See [Core concepts: article statuses](/docs/get-started/core-concepts#article-statuses).

### Will Rankbox overwrite changes I make in my CMS?

No, for Webflow and Shopify: an item edited or deleted there is left alone. For sites using the API, your own code decides whether to apply updates, since Rankbox only hands over the latest version. See [Syncing articles reliably](/docs/api/syncing).

### What happens to published articles if I cancel?

They stay on your site. Rankbox never removes articles your site already has. After your paid period ends, your API key stops returning articles (HTTP 402) and Webflow or Shopify stop receiving new ones, but your settings and articles stay in your account.

## Backlinks and Reddit

### Is the backlink exchange included in the free trial?

No. The backlink exchange and Reddit Presence both open with your first paid invoice, so throwaway trial accounts can't mint links or post under someone's name. To open them before day 8, click **Unlock everything now** in **Plan & Billing**. See [Backlink exchange](/docs/growth/backlink-exchange).

### How do backlink credits work?

You earn credits by hosting relevant member links in your articles, and spend them to get links to your site placed in other members' articles. Each paid site gets 30 credits a month as a top-up, a link costs 1 to 3 credits depending on the host site's tier, and credits move only when the link is verified live. See [Plans and credits](/docs/account/plans-and-credits).

### Will my own sites link to each other through the exchange?

No. The exchange only links your sites with other members' sites, never one of your sites with another, and never as a direct swap.

### Does Rankbox post to Reddit for me?

No. Rankbox has no Reddit account and never asks for your Reddit login. It drafts a reply that discloses who you are; you decide whether to post it, post it from your own account, and paste the link so Rankbox can confirm it's there. See [Reddit Presence](/docs/growth/reddit-presence).

## Billing

### How much does Rankbox cost?

$49.50 a month for the Business plan, which covers one site with 30 articles, 30 backlink credits and 30 Reddit reply drafts a month. Each extra site added with Studio is another $49.50 a month with the same allowance; Studio sites are the only optional extra. There are no setup fees and no contracts. You pay by card through Stripe, and Rankbox never sees or stores your card details. See [Plans and credits](/docs/account/plans-and-credits).

### What happens when my free trial ends?

Your plan continues automatically at $49.50 a month: your card is charged on day 8 and the site's article credits reset to 30. Cancel any time before then and you aren't charged. See [The free trial](/docs/account/free-trial).

### Why is there a $1 charge on my card?

When a trial starts, Rankbox places a $1 authorization on the card to check it can hold funds, then releases it straight away. Nothing is captured, but the hold can show as pending on your statement for a day or two.

### Can I cancel anytime?

Yes. In **Plan & Billing**, click **Card & invoices** to open Stripe's billing portal and cancel there. Your plan won't renew, and you keep access until the end of the period you've already paid for. See [Billing, invoices and cancellation](/docs/account/billing).

### Do you offer refunds?

Subscriptions are non-refundable; that's why the free trial exists. If you were charged in error or twice for the same period, email support with your account email and the date and amount of the charge, and verified errors are corrected. See the [Refund and Cancellation Policy](/legal/refunds).

### What happens when I run out of article credits?

Writing stops until the site's credits reset at the next billing period, and autopilot picks up again then. During the trial, you can click **Unlock everything now** in **Plan & Billing** to start the paid plan today, which resets the site to 30 credits. On the paid plan there is no larger plan or credit top-up; the allowance per site is 30 a month. See [Plans and credits](/docs/account/plans-and-credits).

### Do unused credits roll over?

Article and Reddit credits don't: they reset to the allowance each billing period. Backlink credits do: the monthly grant tops up your balance, and credits you earn by hosting links carry over.

### Can I run more than one website?

Yes, with Studio, once your plan is paid. Each extra site costs $49.50 a month on the same invoice and gets its own 30 articles, 30 backlink credits, 30 Reddit drafts, content plan and schedule. Remove a site any time; it runs to the end of the period you've paid for. See [Studio: run several sites](/docs/account/studio).

## Developers and agents

### Is there an API?

Yes. The REST API at `https://rankbox.xyz/api/public/v1` returns a site's published articles (`GET /articles`, `GET /articles/{id}`), checks a key (`GET /ping`), and accepts each article's live URL (`PATCH /articles/{id}`). Authenticate with the site's API key as a bearer token. See [API overview](/docs/api/overview).

### What are the API rate limits?

120 requests a minute per Rankbox account across all its keys, and 300 requests a minute per IP address. Going over returns HTTP 429 with "Rate limit exceeded. Slow down and retry shortly." See [Rate limits](/docs/api/rate-limits).

### Can I use one API key for several sites?

No. Each key belongs to exactly one site and only returns that site's articles. A site can have several keys, and each Studio site needs its own. See [Authentication and API keys](/docs/api/authentication).

### Can I use Rankbox from Claude, ChatGPT or Cursor?

Yes, through the Rankbox MCP server at `https://rankbox.xyz/mcp`. It offers tools to find the questions people ask AI about a topic, plan an article for a keyword, and draft meta descriptions. **Integrations** has setup steps for each AI tool. See [The Rankbox MCP server](/docs/ai-tools/mcp-server) and [Connect your AI tools](/docs/ai-tools/connect-ai-tools).

### Where can an AI agent read these docs?

Start at `https://rankbox.xyz/docs/llms.txt`, an index of every docs page. Add `.md` to any docs page address for its raw Markdown, or read `https://rankbox.xyz/docs/llms-full.txt` for every page in one file. See [Agent access](/docs/agents/overview).

## Related

- [Troubleshooting](/docs/help/troubleshooting): fixes for specific error messages.
- [Get help](/docs/help/support): how to contact Rankbox and what to include.
- [Core concepts](/docs/get-started/core-concepts): precise definitions behind these answers.
- [Plans and credits](/docs/account/plans-and-credits): the plan and every credit in detail.
