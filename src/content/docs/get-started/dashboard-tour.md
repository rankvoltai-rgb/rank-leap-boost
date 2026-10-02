---
title: A tour of the dashboard
nav_title: Dashboard tour
description: What every page in the Rankbox dashboard is for, the key elements on each, the site switcher for Studio accounts, the phone layout and keyboard shortcuts.
order: 6
updated: 2026-10-02
---

The Rankbox dashboard lives at `/dashboard`. This page walks through every area in the sidebar, in order, so you know where things are and which deeper page explains each one.

## The layout

The dashboard has a sidebar on the left and the page you're on to its right.

The sidebar has two groups. The first, the workspace, holds the pages about the site you're looking at: **Overview**, **Articles**, **Calendar**, **Rank**, **Backlinks**, **Reddit** and **Integrations**. The second, **Account**, holds the pages about your whole account: **Studio**, **Plan & Billing** and **Settings**.

- **Articles** shows a small number when articles are scheduled or being written: the size of the autopilot queue.
- **The account corner** at the foot of the sidebar shows the site you're looking at (the site switcher), your name, your plan and a sign-out button.
- **Your plan** reads "Business · trial", "Business plan", "Business · 3 sites", "Business · payment due" or "No plan yet".
- **Start free trial** appears above the site switcher until the account has a plan.
- **Collapse the sidebar** to an icon rail with the round handle on its edge, or press ⌘\ on a Mac or Ctrl+\ elsewhere. Your browser remembers the choice.

Every page in the workspace group shows one site at a time. If you run several sites with Studio, see [The site switcher](#the-site-switcher).

## Overview

**Overview** (`/dashboard`) is the home page: whether the engine is running, what to do next, and what's coming up.

- **Greeting and autopilot status.** The top right reads **Autopilot On** or **Off**. Hover for the reason, or click to open **Settings → Autopilot**.
- **Next step card.** One card tells you the single most useful next action, with a launch checklist: "Start your 7-day free trial", "Connect your site", "Publish your first article". Its button changes with your state: **Start free trial**, **Connect your site**, **Finish setup**, **Generate now**, **Browse ideas**, **Upgrade** or **Turn autopilot on**.
- **Stats panel.** Four figures: **Projected traffic** (estimated monthly visits from all planned and written articles), **Published** (written articles against a monthly goal of 30), **Your site** (**Live**, **Not syncing**, **Waiting** or **Not connected**) and **Article credits** (left this billing cycle).
- **Autopilot queue.** The scheduled and in-progress articles, filtered by **All**, **Scheduled** or **Writing**. Each row has **Generate now** to write it immediately and a remove button. Removing deletes the article. **Open Articles** goes to the full list.
- **Publishing schedule.** A strip of the coming week. Pick a day to see what's scheduled for it, or click **Open calendar**.
- **Content gaps to win.** Your ideas, with their keyword, estimated traffic and competition. **Add to queue** schedules one for autopilot.

See [Content plan and calendar](/docs/content/content-plan) and [Autopilot and the publishing schedule](/docs/content/autopilot).

## Articles

**Articles** (`/dashboard/blog-engine`) is every article on the site, "from first idea to published".

- **Autopilot bar.** One line on whether autopilot is running and what it writes next, with the one action that fixes it: **Start free trial**, **Upgrade**, **Resume**, **Pause**, or **Re-plan from tomorrow** when articles are overdue.
- **Views.** **All**, **Ideas**, **Scheduled** and **Published**, each with a count. Each view shows the columns that matter for it: ideas show **Competition**, **AI signal** and **Est. traffic**; the schedule shows **Writes on**; published articles show **Updated** and **SEO**.
- **Search.** **Search articles** matches titles and keywords. Press **/** to jump to it.
- **Quick write.** Unwritten rows carry a lightning button: **Write now**, or **Upgrade to write** when the site is out of credits.

Click a title to open the article panel, which slides in from the right and keeps the list visible at its edge. The open article is in the address (`?article=`), so you can refresh, bookmark or share it.

| Article state | Main buttons in the panel |
| --- | --- |
| Idea | **Schedule**, **Write now** |
| Scheduled or overdue | **Write now** |
| Written by hand, not yet published | **Publish** |
| Published | **Publish changes** |

The panel also has **More actions** (**Copy link**, **Delete article**), an AI menu when you select text (**Improve SEO**, **Rewrite**, **Expand**, **Shorten**), and a side column with the **SEO** score, the meta description, **Details**, **Content** metrics and a **Checklist**. **Start writing** lets you write an idea yourself instead of spending a credit. See [Editing articles](/docs/content/editor) and [The SEO and GEO score](/docs/content/scoring).

## Calendar

**Calendar** (`/dashboard/calendar`) shows "What autopilot has published, and when it writes the rest."

- **Month** and **Agenda** views. Phones always show **Agenda**.
- **Drag to reschedule.** Drag a scheduled or overdue article to another day. The autopilot queue reorders to match the new dates, and the toast offers **Undo**. Published articles and articles being written don't move.
- **No day yet.** Scheduled articles without a date sit above the grid, ready to drag on.
- **Legend.** **Published**, **Writing now**, **Scheduled** and **Overdue**.
- The month header totals the month's articles, how many are published and their estimated monthly visits.

See [Content plan and calendar](/docs/content/content-plan).

## Rank

**Rank** (`/dashboard/visibility`) shows "How much of your market you answer, how ready those answers are for Google and AI engines, and the moves that grow both." It opens with a trial or paid plan.

- **Headline figures.** **Market coverage** (keywords with a published, scheduled or no article), **Est. monthly visits** and **Avg. SEO score**.
- **Projected monthly visits.** A chart of published and scheduled articles' estimated traffic.
- **Next best moves.** Ranked by the traffic they add: **Plan it** (create an idea for an uncovered keyword), **Schedule**, **Improve** and **Write now**.
- **What AI engines look for.** How many published articles pass each structural signal: **Answers up front**, **FAQ section**, **Clear sections**, **Cites sources**, **Depth** and **Easy to read**.
- **Your market.** Every tracked keyword with its estimated searches, estimated traffic, your article, its status and SEO score, filtered by **All**, **Gaps**, **Scheduled** or **Published**.

Nothing on the Rank page is a measured ranking or a measured AI citation. See [Rank: AI search visibility](/docs/growth/rank).

## Backlinks

**Backlinks** (`/dashboard/backlinks`) is the backlink exchange: "Earn credits by hosting one relevant link in your articles; spend them on dofollow links from verified members in your niche. Credits move only when a link is verified live."

- **Without a paid plan** the page shows what the exchange is and the live network figures. The exchange opens with your first paid invoice, not during the trial.
- **Verify your domain** comes first on a paid plan, by **DNS record**, **Meta tag** or **File**.
- **Tabs** after verification: **Overview**, **Get links** (the pages you want links to), **Give links** (links hosted in your articles, where you can paste a live URL) and **Settings**.
- **If your plan lapses**, the page shows "Your plan has lapsed." Your links stay live and your credits are held.

See [Backlink exchange](/docs/growth/backlink-exchange).

## Reddit

**Reddit** (`/dashboard/reddit`) is Reddit Presence: "Find the Reddit threads your buyers and AI engines read, draft a reply that discloses who you are, and post it yourself. Rankbox never posts to Reddit."

- **Without a paid plan** the page explains the feature. It opens with your first paid invoice.
- **First run.** Set **Your disclosure line** and **Your space**, then click **Run my first sweep**. The sweep is free; drafting a reply spends a credit.
- **Main view.** Four figures (**Open threads**, **Drafts waiting**, **Live mentions**, **Reply credits**), a **Run a sweep** button, and tabs for **Opportunities**, **Mentions** and **Settings**.
- **Posting.** Open a thread, review the **Suggested reply**, click **Copy reply**, post it from your own account, then paste your comment's link and click **I posted this** so Rankbox can confirm it.

See [Reddit Presence](/docs/growth/reddit-presence).

## Integrations

**Integrations** (`/dashboard/integrations`) is where you connect your site and your AI tools: "Publish every article to your site automatically, and bring Rankbox's research into the AI tools you already use."

- **Status card.** Whether articles are reaching your site, for example "Your site is connected" or "Waiting for your site's first sync", with **Last sync**, **Delivered** and **On the way** counts.
- **Your connections.** Each API key with its status (**Live**, **Idle**, **Waiting** or **Revoked**), when it last synced, and **Replace key** and **Revoke** buttons.
- **Connector library.** Tiles grouped as **Your website**, **AI app builders**, **AI assistants**, **Coding agents**, **Automation** and **Developer**, with a search box (press **/**). Opening a tile shows its setup: an API key flow for websites, the Webflow or Shopify connection, or the MCP server address for AI tools.
- **REST API.** Under **Developer**, the **REST API** tile holds the key setup and a reference: base URL, authentication header and endpoints.

Creating a key needs a trial or paid plan. See [How publishing works](/docs/publishing/overview), [Authentication and API keys](/docs/api/authentication) and [Connect your AI tools](/docs/ai-tools/connect-ai-tools).

## Studio

**Studio** (`/dashboard/studio`) lists every site on your account: "Each one after your first is $49.50 a month, with the full plan of its own."

- **Summary figures.** **Sites**, **Monthly total**, **Articles this cycle** across every live site, and **Next invoice**.
- **Site cards.** Each site shows **On your plan** or **Studio**, its articles used this cycle, **Published**, **In the queue** and **Autopilot**. The card's menu has **Open overview**, **Open articles**, **Site settings**, and for Studio sites **Remove from Studio…** or **Keep this site**.
- **Add a site** runs the same three setup steps as onboarding and opens once your plan is paid.

See [Studio: run several sites](/docs/account/studio).

## Plan & Billing

**Plan & Billing** (`/dashboard/billing`) is "One plan, one invoice, every site on it."

- **Your plan.** Status (**Free trial**, **Active**, **Payment due**, **Canceled** and others), the current period, and what's included. During the trial it shows your trial article usage, what waits for the first payment, and **Unlock everything now** to start the paid plan today.
- **Next invoice** or **First charge.** The amount and date, with the Studio sites listed.
- **Sites & usage.** Each site's article credits this cycle and its price: **Included** for your plan's site, $49.50/mo for each Studio site.
- **Card & invoices** and **Manage in Stripe** open Stripe's billing portal, where you update your card, download invoices and cancel.
- **Banners** appear when a payment fails ("Your last payment didn't go through"), when the plan is set to end, or when it isn't active.

See [Billing, invoices and cancellation](/docs/account/billing).

## Settings

**Settings** (`/dashboard/settings`) teaches autopilot your brand and holds your account. "Changes save as you go."

| Section | What's in it |
| --- | --- |
| **Your brand** | **Brand name**, **Website**, **What you sell** |
| **How autopilot writes** | **Audience**, **Tone**, **Writing style**, **House rules**, and **What autopilot reads**, a preview of the exact brief the writer gets |
| **Autopilot** | **Write automatically** on or off, and **Pace** from 1 a week to **Every day** |
| **Studio** | Whether this site is your plan's own site or a Studio site, and its removal controls |
| **Account** | **Email**, **Plan** (with a link to Plan & Billing) and **Sign out** |

The brand, writing and autopilot sections belong to the site you're looking at. See [Account and site settings](/docs/account/settings) and [Brand voice and writing settings](/docs/content/brand-voice).

## The site switcher

The site switcher sits at the foot of the sidebar and shows the site you're looking at. Click it to open **Your sites**, the list of your live sites, plus **Studio overview** and **Add another site** (or **Add a site**).

- **Which site is open is in the address.** Your primary site has a clean URL, for example `/dashboard/blog-engine`. Any other site adds `?site=` with its id, for example `/dashboard/blog-engine?site=…`. Refreshing, bookmarking or sharing the link opens the same site.
- **Switching keeps your page.** Choosing another site opens the same page for that site. Anything specific to the last site, like an open article, is left behind.
- **Two tabs, two sites.** Because the site is in the address, you can keep two sites open side by side.
- **Stale links fall back.** A link to a site that has left your account opens your primary site instead.
- A site that is scheduled to leave Studio shows "Leaves Studio" and its date in the list, and a banner on every page offers **Keep this site**.

## On a phone

On a narrow screen the sidebar is hidden and a bar at the top shows a menu button and the Rankbox logo. Tap the menu button to open the navigation drawer: the same pages, the site switcher and **Sign out**. Choosing a page or a site closes the drawer. The Calendar shows its **Agenda** view on phones, and the article panel fills the screen.

## Keyboard shortcuts

| Shortcut | Where | What it does |
| --- | --- | --- |
| ⌘\ or Ctrl+\ | Anywhere in the dashboard | Collapse or expand the sidebar |
| / | **Articles**, **Integrations** | Jump to the search box |
| J and K | Article panel | Next and previous article |
| ⌘S or Ctrl+S | Article panel | Save a draft, or publish changes to a published article |
| Esc | Search box | Clear the search |

## Related

- [Quickstart](/docs/get-started/quickstart): the dashboard in the order you first use it.
- [Core concepts](/docs/get-started/core-concepts): the terms used on every page.
- [Editing articles](/docs/content/editor): the article panel in depth.
- [Studio: run several sites](/docs/account/studio): adding, removing and restoring sites.
- [Troubleshooting](/docs/help/troubleshooting): what to do when a page shows an error.
