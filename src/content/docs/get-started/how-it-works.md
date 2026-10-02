---
title: How Rankbox works
description: The full Rankbox pipeline: site scan, research, content plan, writing, scoring, publishing, live URLs, backlinks, Reddit and Rank, with credit costs.
order: 3
updated: 2026-10-02
---

Rankbox runs every site through the same pipeline: it reads the site, researches the searches to win, plans one article per search, writes and scores each article, publishes it to the site, and then works on the site's authority. This page explains each stage, where you see it in the dashboard, and what it costs in credits.

## The pipeline at a glance

```text
 ONBOARDING (free, no card)                  WRITING (trial or paid)
 ┌───────────┐   ┌──────────┐   ┌─────────┐   ┌─────────────────────────────┐
 │ Site scan │──▶│ Research │──▶│ Content │──▶│ Write: research → draft →   │
 │ brand,    │   │ keywords │   │ plan    │   │ optimize → video → links    │
 │ logo      │   │ + context│   │ 1 / kw  │   └──────────────┬──────────────┘
 └───────────┘   └──────────┘   └─────────┘                  │
                                                             ▼
                                                     ┌──────────────┐
                                                     │ Score 0–100  │
                                                     └──────┬───────┘
                                                            ▼
 AUTHORITY (paid only)          ┌──────────┐        ┌──────────────┐
 ┌──────────────────────┐       │ Live URL │◀───────│ Publish      │
 │ Backlink exchange    │◀──────│ recorded │        │ pull (API) / │
 │ Reddit Presence      │       └──────────┘        │ push (CMS)   │
 └──────────┬───────────┘                           └──────────────┘
            ▼
 ┌──────────────────────────────────────────────┐
 │ Rank: coverage, readiness, next best moves   │
 └──────────────────────────────────────────────┘
```

Onboarding runs once per site and is free. Writing and publishing need a trial or a paid plan. The backlink exchange and Reddit Presence need a paid plan. Autopilot repeats the writing stage for you, one scheduled article at a time.

## Each stage in one table

| Stage | What happens | Where you see it | Credits spent |
| --- | --- | --- | --- |
| Site scan | Rankbox reads your website and fills in brand name, what you do and logo | Onboarding, step 1 | None |
| Research | About 20 buyer searches, plus niche, audience, market, voice, competitors, topic clusters and content gaps | Onboarding, step 2 | None |
| Content plan | One article per confirmed keyword, up to 30, ordered quick wins first | Onboarding, step 3, then **Articles** and **Calendar** | None |
| Writing | A long-form, source-backed article for one planned title and keyword | **Articles**, **Overview**, **Calendar** | 1 article credit |
| Scoring | A 0 to 100 SEO and GEO score with a pass, warn or fail checklist | Article panel (**SEO** section), **Articles**, **Rank** | None |
| Publishing | Your site pulls finished articles, or Rankbox pushes them to Webflow or Shopify | **Integrations**, **Overview → Your site** | None |
| Live URL | The public address of each published article is recorded | Backlinks (**Give links**), API responses | None |
| Backlinks | Your articles host member links; your site earns links in theirs | **Backlinks** | Backlink credits, only when a link is verified live |
| Reddit | Threads worth joining are found; you get a reply draft to post yourself | **Reddit** | 1 Reddit credit per draft |
| Rank | Coverage of your keyword set, article readiness, next best moves | **Rank** | None |

## Site scan

When you enter your website in onboarding, Rankbox fetches the page and asks its AI model to read it. The model writes your brand name and a one or two sentence description of what you do, and Rankbox picks a logo from the page's `og:image`, `apple-touch-icon` or favicon. Anything the scan can't ground in the page comes back blank rather than guessed.

You can edit every field before moving on. The description you confirm here briefs every article Rankbox writes for the site. See [Onboarding, step by step](/docs/get-started/onboarding).

## Research

Rankbox analyzes the same scrape to work out who the site serves and which searches its articles should target. It returns about 20 keywords (at most 25), each with an intent (Commercial, Informational, Transactional or Navigational), a trend (Rising, Steady or Declining) and an estimated monthly search volume.

The search volumes are AI estimates, not measured data. Around the keywords, the analysis proposes the niche, audience, market, brand voice, up to 6 competitors, 4 to 6 topic clusters, 3 to 5 content gaps and a few observations on how likely AI engines are to cite the site today. You review and edit all of it before planning. See [Research: the questions buyers ask AI](/docs/content/research).

## Content plan

Rankbox turns your confirmed keywords into a content plan: exactly one article per keyword, highest search volume first, capped at 30 articles. Each planned article has a title under 70 characters, a one or two sentence brief describing the gap it fills, a competition rating (Low, Medium or High) and an AI signal from 1 to 100.

When you confirm the plan, the first 4 articles land in **Articles** as ideas you write when you like. The rest go into the autopilot queue as scheduled articles, one a day starting the next day. Each planned article carries an estimated monthly traffic figure, calculated from its keyword's estimated volume and its place in the plan; it is a model, labelled as an estimate everywhere it appears. See [Content plan and calendar](/docs/content/content-plan).

## Writing

Writing one article spends 1 article credit. The credit is reserved when writing starts and returned automatically if writing fails. Writing starts in one of three ways: **Write now** on an article, **Generate now** on the Overview, or autopilot reaching a scheduled article.

The writer works in five stages:

1. **Research.** It searches the web for the keyword and reads the top-ranking pages, so the outline covers what already ranks and finds what those pages miss.
2. **Draft.** It writes a long-form article in your brand's voice, targeting about 2,750 words, with a direct two to three sentence answer at the top, a key takeaways section, at least two lists, an FAQ of five questions, in-text citations and a references section.
3. **Optimize.** It scores the draft against the same checks you see in the editor and rewrites only what failed, for a limited number of passes, stopping early when a pass doesn't improve the score.
4. **Video.** When it finds a relevant YouTube video, it embeds it under the opening answer.
5. **Links.** On a paid plan with the backlink exchange set up, it weaves in the member link reserved for this article, if the network has one that belongs there.

An article usually takes under a minute to write. The brand brief the writer receives is the one shown under **Settings → What autopilot reads**. See [How articles are written](/docs/content/writing) and [Brand voice and writing settings](/docs/content/brand-voice).

## Scoring

Every article has an SEO and GEO score from 0 to 100. Rankbox computes it from the article's own title, keyword, meta description and body, with no external service, so the score in the article list, the editor and the Rank page always agree. The checks cover the keyword in the title and introduction, keyword density, length, section structure, sub-headings, lists, an FAQ for AI engines, links, the meta description and readability.

In the editor, 80 or above reads "Strong — ready to rank.", 55 to 79 reads "Good — a few tweaks left." and below 55 reads "Needs work to rank well." The score measures structure and readiness, not where the article ranks. See [The SEO and GEO score](/docs/content/scoring).

## Publishing

When an article is written, its status becomes **Published**: it is finished and available to your site. How it reaches your site depends on how the site is connected.

| Connection | How articles reach the site | When |
| --- | --- | --- |
| REST API (any site) | Your site's code calls `GET /api/public/v1/articles` with the site's API key and renders what comes back | Whenever your code asks, typically at build time or on a schedule |
| Webflow | Rankbox creates or updates an item in the collection you chose, live or as a draft | Straight after the article is written or its changes are published |
| Shopify | Rankbox creates or updates a post in the blog you chose in the Rankbox app in Shopify | Straight after the article is written or its changes are published |

Edits you publish from the Rankbox editor go out the same way. An item someone edited or deleted in Webflow or Shopify is left alone. See [How publishing works](/docs/publishing/overview).

## Live URL

The live URL is the public address of a published article on your site. Rankbox records it from whichever source reports it first: your site calling `PATCH /api/public/v1/articles/{id}` with a `published_url`, a Webflow or Shopify publish, your sitemap, or a URL you paste in **Backlinks → Give links**. A reported URL must be on the site's own domain.

The backlink exchange uses the live URL to verify links, and the Rank page uses your published articles to show coverage. See [Live URLs and verification](/docs/publishing/live-urls).

## Backlinks

The backlink exchange is open to paid plans and runs per site, after the site verifies its domain. Each paid site gets 30 backlink credits a month as a top-up, and earns more by hosting relevant member links inside its own articles. It spends credits to have its own link placed in another member's article on a related topic; a link costs 1 to 3 credits depending on the host site's tier.

Credits move only when Rankbox verifies the link is live on the host page: followed, in the article body, on an indexable page. A link that never goes live is refunded. There are no direct swaps, and your own sites never link to each other through the exchange. See [Backlink exchange](/docs/growth/backlink-exchange).

## Reddit

Reddit Presence is open to paid plans. It searches for Reddit threads related to your tracked keywords, and for a thread you choose, it drafts a reply that discloses who you are. Each draft costs 1 Reddit credit, and each paid site gets 30 a month; they reset each period and don't carry over.

Rankbox never posts. You read the draft, post it from your own Reddit account if it fits the conversation, and paste the link to your comment so Rankbox can confirm it's there. See [Reddit Presence](/docs/growth/reddit-presence).

## Rank

The **Rank** page shows how much of your keyword set your articles answer, what those articles are projected to earn, how ready they are for Google and AI engines, and the next moves ranked by the traffic they add: plan an article for a gap, schedule an idea, improve a weak article or write an overdue one. Every figure is derived from your keywords and articles; nothing on the page claims a measured ranking or citation. See [Rank: AI search visibility](/docs/growth/rank).

## What runs on its own and what you trigger

| Runs on its own | You trigger |
| --- | --- |
| Autopilot writing the next scheduled article, at your pace, while the site has a plan and credits | **Write now** or **Generate now** on any planned article |
| Pushing written articles to a connected Webflow or Shopify site | Adding the API call to your site, which then pulls on its own schedule |
| Credit refills at each billing period | Scheduling, moving or deleting articles |
| Verifying exchange links on host pages | Verifying your domain and choosing backlink targets |
| Searching for Reddit threads once Reddit Presence is set up | Drafting, posting and confirming each Reddit reply |

## What each stage needs

| Stage | No plan | Free trial | Paid plan |
| --- | --- | --- | --- |
| Site scan, research, content plan | Yes | Yes | Yes |
| Writing and autopilot | No | Yes, up to 7 articles | Yes, 30 articles a month per site |
| Creating an API key and syncing | No | Yes | Yes |
| Rank page | No | Yes | Yes |
| Backlink exchange | No | No | Yes |
| Reddit Presence | No | No | Yes |
| Studio sites | No | No | Yes |

## Related

- [Core concepts](/docs/get-started/core-concepts): precise definitions of every term on this page.
- [Quickstart](/docs/get-started/quickstart): run the pipeline for the first time.
- [Autopilot and the publishing schedule](/docs/content/autopilot): how the writing stage repeats.
- [How publishing works](/docs/publishing/overview): pull, push and choosing between them.
- [Plans and credits](/docs/account/plans-and-credits): every credit, grant and reset in detail.
