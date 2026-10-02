---
title: "Rank: market coverage and AI readiness"
nav_title: Rank
description: What the Rank page shows, where each number comes from, how to act on it, and what it doesn't measure, including AI citations and live rankings.
order: 3
updated: 2026-10-02
---

The Rank page shows how much of your market your articles answer, how ready those articles are for Google and AI engines, and the next moves that would grow both. Every number on it is derived from your site's keywords and articles inside Rankbox. It doesn't measure live rankings, real traffic or AI citations.

You find it at **Dashboard → Rank**. It is available during the free trial and on the paid plan; without either, the page shows **See where you rank — and what to do next** with a button to start the trial.

## Where the Rank numbers come from

The Rank page reads three things Rankbox already has for the site on screen: its keywords, its articles, and Rankbox's own analysis of each finished article. Nothing on the page is fetched from Google, an analytics tool or an AI engine.

| Number | Source | Measured or estimated |
| --- | --- | --- |
| **Searches** | The monthly search volume stored with each keyword when research created it | Estimated during research, not measured from a search engine |
| **Est. traffic** | The monthly visits projection stored with each keyword and article idea when it was created | A modeled projection |
| **SEO** score | Rankbox's analyzer, run on the article text in your browser | Computed from the article itself |
| **Status** | The article's stage in Rankbox: Idea, Scheduled, Writing, Published | Rankbox's own record |

Keywords include both your tracked and your discovered keywords. See [Research](/docs/content/research) for how keywords are found and [The SEO and GEO score](/docs/content/scoring) for the analyzer.

> [!NOTE]
> "Published" on the Rank page means the article is finished in Rankbox. The page doesn't check that the article is live on your site. See [Live URLs and verification](/docs/publishing/live-urls) for how Rankbox learns where an article went live.

## Market coverage

**Market coverage** is the headline: the share of your market that has a published answer.

- When your keywords carry search volumes, coverage is weighted by monthly searches, and the sentence under it reads "of the N monthly searches in your market have a published answer."
- When none do, every keyword counts once, and it reads "of the N topics you target have a published answer."

The bar under the percentage splits the market into **Published**, **Scheduled** (scheduled or being written) and **Open** (an idea, or no article at all).

## Est. monthly visits

**Est. monthly visits** adds up the traffic projections of your published articles. When articles are scheduled or being written, the card also shows the total "once your schedule is written".

These are projections stored with each article, not visits Rankbox measured. Real traffic, if any, builds over the weeks after a page is indexed and depends on search engines.

## Avg. SEO score

**Avg. SEO score** is the average analyzer score of your published articles, out of 100.

| Average | What the card says |
| --- | --- |
| 80 or more | Strong across your published articles. |
| 55 to 79 | Good — a few fixes would lift it. |
| Below 55 | Most articles need work to rank. |

**Most common gap** names the AI signal that the fewest published articles pass (see below). With no published articles, the card says "Publish an article to see how ready it is to rank."

## Projected monthly visits chart

The **Projected monthly visits** chart plots, for each day, the sum of the traffic projections of every article live by that day. A published article counts from its scheduled date or the date it was last saved, whichever is earlier. An article being written counts from today. A scheduled article counts from its scheduled date, and an overdue one from tomorrow, the soonest it can go out.

- The solid line is what's already published; the dashed line is what your schedule adds.
- The chart covers up to 120 days back and up to 90 days ahead.
- Hover over the chart, or use the arrow keys, to read any day.

The chart starts with your first scheduled or published article. Until then it says "Your curve starts with your first scheduled or published article."

## Next best moves

**Next best moves** lists up to four actions, at most one of each kind, ordered by what the visits are worth: answering new demand first, then fixing weak articles, then timing.

| Move | When it appears | Button | What the button does |
| --- | --- | --- | --- |
| Answer "keyword" | A keyword with no article, the one with the highest projected traffic (rising keywords count 25% more) | **Plan it** | Creates an Idea for that keyword and opens it |
| Schedule "title" | An Idea is waiting, the one with the highest projected traffic | **Schedule** | Puts the Idea on your publishing schedule |
| Strengthen "title" | A published article scores below 70 | **Improve** | Opens the article, with the signals it's missing listed under the move |
| Publish "title" sooner | An unwritten article is scheduled more than 7 days out, and you have article credits left | **Write now** | Writes it now, which spends an article credit |

Each move shows its projected impact: "est. added" visits, visits "riding on it" for a weak article, or visits that "arrive sooner". With nothing to suggest, the panel says every keyword you track has an answer on the way.

## What AI engines look for

**What AI engines look for** counts how many of your published articles pass six checks from Rankbox's analyzer. These are signals that make a page easier for an answer engine to read and quote; passing them doesn't guarantee a citation.

| Signal | Passes when |
| --- | --- |
| **Answers up front** | The article's keyword appears in its first 100 words |
| **FAQ section** | The article has an FAQ section |
| **Clear sections** | The article has three or more H2 headings |
| **Cites sources** | The article has two or more links |
| **Depth** | The article has 1,500 words or more |
| **Easy to read** | The article's Flesch reading-ease score is 55 or higher |

Each bar turns from red to amber to the brand color as more articles pass. Open an article from **Your market** to see its full analysis in the editor.

## Your market table

**Your market** lists every keyword for the site, biggest first, with the article that answers it. Filter it with **All**, **Gaps** (no article, or only an Idea), **Scheduled** (scheduled or being written) and **Published**.

| Column | Meaning |
| --- | --- |
| **Keyword** | The keyword, with its intent and trend when research recorded them |
| **Searches** | Estimated monthly searches, or a dash when unknown |
| **Est. traffic** | Projected monthly visits, with a flame shaded by whether it's in the top, middle or bottom third of your site's projections |
| **Your article** | The strongest article for the keyword: published beats in progress beats idea |
| **Status** | **Published**, **Scheduled**, **Overdue**, **Writing**, **Idea** or **Gap** |
| **SEO** | The analyzer score of the published article |

Click a row to open its article. Rows marked **Gap** have a **Plan it** button, and rows marked **Idea** have a **Schedule** button.

## What the Rank page does not measure

The Rank page shows readiness and projections. It does not show outcomes.

- **AI citations.** Rankbox doesn't track whether ChatGPT, Perplexity, Gemini, Claude or Google AI Overviews cite or mention your brand. The engine logos beside **What AI engines look for** mark the section's topic, not a measurement.
- **Google rankings.** The page doesn't measure where your pages rank in Google or any other search engine.
- **Real traffic.** Visits on this page are projections, not analytics data.
- **Whether a page is live.** Published means finished in Rankbox, as described above.

To measure AI visibility yourself, follow [How to measure GEO](/blog/how-to-measure-geo): a fixed panel of buyer prompts, run on a schedule, with a control group. The free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) writes 30 starter prompts with a scorecard, and search engines' own webmaster tools report real impressions and clicks.

## When the Rank page is empty

With no keywords and no articles, the page says **Your market isn't mapped yet** and links to **Overview**. Rankbox maps the searches your customers make when you connect your site during onboarding. See [Onboarding, step by step](/docs/get-started/onboarding).

## Related

- [The SEO and GEO score](/docs/content/scoring) — the analyzer behind the score and the AI signals
- [Research: the questions buyers ask AI](/docs/content/research) — where keywords and volumes come from
- [Content plan and calendar](/docs/content/content-plan) — scheduling Ideas
- [Autopilot and the publishing schedule](/docs/content/autopilot) — what writes scheduled articles
- [Free SEO and AI search tools](/docs/growth/free-tools) — including the AI Visibility Prompt Kit
