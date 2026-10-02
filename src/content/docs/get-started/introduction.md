---
title: What is Rankbox?
nav_title: Introduction
description: What Rankbox does from site scan to published article, who it is for, what it deliberately does not do, the plan in brief, and where to go next.
order: 1
updated: 2026-10-02
---

Rankbox is an AI search growth engine. It reads your website, finds the searches and questions your buyers type into Google and AI assistants, plans one article for each, writes them, scores them, and publishes them to your site on a schedule you control.

This page explains what Rankbox does end to end, who it is built for, what it does not do, and which page to read next.

## Who Rankbox is for

Rankbox is built for people who need a steady stream of useful, search-ready articles on their own site and don't have a content team to write them.

| You are | What you use Rankbox for |
| --- | --- |
| A founder or small team | A content plan built from your own site, articles written in your brand voice, and an autopilot that writes on a pace you set |
| A marketer | Research, writing and scoring in one place, with an editor for review and a calendar for the schedule |
| An agency or multi-brand operator | [Studio](/docs/account/studio): several sites under one account, each with its own plan, credits and schedule |
| A developer | A read-only [REST API](/docs/api/overview) that hands finished articles to any CMS, static site or build step |
| An AI agent or AI tool | The [MCP server](/docs/ai-tools/mcp-server) and the [agent access](/docs/agents/overview) docs, written to be read as raw Markdown |

## What Rankbox does, end to end

Rankbox runs one pipeline for every site. Each stage feeds the next.

1. **Reads your site.** During [onboarding](/docs/get-started/onboarding), Rankbox reads the website you enter and fills in your brand name, what you do and your logo.
2. **Finds the searches to win.** It analyzes the site and proposes about 20 keywords your buyers search for, plus the context around them: niche, audience, market, brand voice, competitors, topic clusters and content gaps.
3. **Plans the content.** It turns your confirmed keywords into a content plan: one article per keyword, up to 30, each aimed at a gap your site doesn't answer yet, in publishing order.
4. **Writes the articles.** For each article it researches the live top-ranking pages for the keyword, drafts a long-form article with a direct answer up top, key takeaways, cited sources and an FAQ, then revises the draft against its own SEO checks.
5. **Scores every article.** Each article gets an SEO and GEO score from 0 to 100, computed from the text itself. See [The SEO and GEO score](/docs/content/scoring).
6. **Publishes to your site.** Your site pulls finished articles through the [REST API](/docs/publishing/custom-sites), or Rankbox pushes them into a connected [Webflow](/docs/publishing/webflow) collection or [Shopify](/docs/publishing/shopify) blog.
7. **Records the live URL.** When your site reports where an article went live, Rankbox stores that address. See [Live URLs and verification](/docs/publishing/live-urls).
8. **Builds authority.** On a paid plan, the [backlink exchange](/docs/growth/backlink-exchange) places relevant links between member sites, and [Reddit Presence](/docs/growth/reddit-presence) finds threads worth joining and drafts a reply for you to post yourself.
9. **Shows your coverage.** The [Rank](/docs/growth/rank) page shows how much of your keyword set you answer, how ready those articles are for Google and AI engines, and the next moves that add the most projected traffic.

[How Rankbox works](/docs/get-started/how-it-works) walks through each stage in detail, with what you see in the dashboard and what each one costs in credits.

## What Rankbox does not do

Knowing the limits up front saves you from expecting something the product doesn't promise.

- **Rankbox does not track AI citations of your site.** It writes articles structured the way AI answers quote sources, and it scores them for that structure, but it does not measure whether ChatGPT, Perplexity, Gemini or Google cite your site or your articles.
- **Rankbox never posts to Reddit.** It has no Reddit account and never asks for your Reddit login. It drafts a reply; you read it, post it from your own account, and paste the link back if you want Rankbox to check it.
- **Rankbox does not promise rankings, traffic or citations.** Traffic figures in the dashboard are labelled as estimates and come from a model, not from your analytics.
- **Rankbox does not measure keyword search volume.** The monthly search numbers in onboarding and on the Rank page are AI estimates, not data from a search-volume provider.
- **Rankbox does not host your blog.** Articles live in Rankbox until your site pulls them or a connected platform receives them. Your site, your CMS and your domain stay yours.
- **Rankbox does not overwrite edits made in your CMS.** If you edit or delete an article inside Webflow or Shopify, Rankbox leaves it alone.
- **Rankbox does not trade links between your own sites.** The backlink exchange only links you with other members, and a backlink credit only moves when a link is verified live.

## The plan in one paragraph

Rankbox has one plan, Business, at $49.50 a month for one site, with 30 articles, 30 backlink credits and 30 Reddit reply drafts a month. Signing up and building your content plan are free and need no card. The 7-day free trial goes through Stripe Checkout and takes a card; you aren't charged until day 8, and you can cancel before then. The trial includes 7 article credits; research, writing, scoring and publishing all work, while the backlink exchange and Reddit Presence open with your first paid invoice. Studio adds more sites at $49.50 a month each, every one with the full allowance of its own. Details are in [Plans and credits](/docs/account/plans-and-credits) and [The free trial](/docs/account/free-trial).

## Key terms

These terms appear throughout the docs. [Core concepts](/docs/get-started/core-concepts) defines each one precisely.

| Term | Meaning in one line |
| --- | --- |
| Site | One website on your account, with its own brand, content plan, credits and API keys |
| Content plan | The articles Rankbox has planned for a site, one per keyword |
| Article | One planned or written piece; it moves through Idea, Scheduled, Writing and Published |
| Article credit | Pays for writing one article; each site gets 30 a month on the paid plan |
| Autopilot | The engine that writes the next scheduled article on your chosen pace |
| SEO and GEO score | A 0 to 100 score computed from the article's own text |
| API key | A secret that lets one site's code pull that site's published articles |
| Live URL | The public address where a published article lives on your site |

## Where to go next

Pick the path that matches how you'll use Rankbox.

### For people using the dashboard

- [Quickstart](/docs/get-started/quickstart): sign up, confirm a plan, start the trial and publish a first article in about 10 minutes.
- [Onboarding, step by step](/docs/get-started/onboarding): every field in setup and what Rankbox does with it.
- [A tour of the dashboard](/docs/get-started/dashboard-tour): what each page in the sidebar is for.
- [Autopilot and the publishing schedule](/docs/content/autopilot): how the engine decides what to write and when.

### For developers

- [How publishing works](/docs/publishing/overview): pull and push, and which one your site uses.
- [API overview](/docs/api/overview): base URL, endpoints and response shapes.
- [Authentication and API keys](/docs/api/authentication): create, store, replace and revoke keys.
- [Build a CMS integration](/docs/api/build-an-integration): sync articles and report live URLs.

### For AI agents

- [Agent access](/docs/agents/overview): what an agent can do with Rankbox and where to start.
- [Quickstart for AI agents](/docs/agents/quickstart): the shortest path from nothing to a working setup.
- [The Rankbox MCP server](/docs/ai-tools/mcp-server): connect Claude, ChatGPT, Cursor and other MCP clients.
- Every docs page is available as raw Markdown: add `.md` to its address, or start from `/docs/llms.txt`.

## Related

- [How Rankbox works](/docs/get-started/how-it-works): the full pipeline, stage by stage.
- [Core concepts](/docs/get-started/core-concepts): precise definitions of sites, articles, credits and keys.
- [Plans and credits](/docs/account/plans-and-credits): what the plan includes and how credits reset.
- [FAQ](/docs/help/faq): short answers to the questions people ask most.
