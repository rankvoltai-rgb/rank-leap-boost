---
title: How to Optimize Brand Mentions in ChatGPT and Perplexity
description: Optimize brand mentions in ChatGPT and Perplexity: the five levers that move them, where each engine finds brands (documented vs observed) and a checklist.
keyword: brand mentions in ChatGPT and Perplexity
date: 2026-11-17
updated: 2026-11-17
written: 2026-10-01
author: Rankbox Team
tags: AI Search, Brand Strategy
---

To optimize brand mentions in ChatGPT and Perplexity, get your brand onto the pages both engines read for your category (roundups, review sites, comparison pages and community threads), and make your own pages state what you do, what you cost and who you're for in plain, quotable text. OpenAI says its [ads don't influence ChatGPT's answers](https://help.openai.com/en/articles/20001047-ads-in-chatgpt), so mentions come from what the web says about you and how easy your pages are to read.

The two engines overlap more than they differ. Both search the web live, and both lean heavily on Reddit. But they don't read the same sources in the same proportions. In Ahrefs' September 2026 data, YouTube held [20.8% of Perplexity's top-source citations](https://ahrefs.com/blog/most-cited-domains-perplexity/) but only [2.5% of ChatGPT's](https://ahrefs.com/blog/most-cited-domains-in-chatgpt/). A plan built for one engine can miss the other.

This post is the optimization side. For how to score what ChatGPT says about you once you're named, see our [guide to brand sentiment and mention monitoring in ChatGPT](/blog/brand-sentiment-chatgpt). For Perplexity's citation layer in depth, see [how to get cited by Perplexity AI](/blog/get-cited-by-perplexity).

## Key Takeaways

- Brand mentions in ChatGPT and Perplexity grow from the same five levers: third-party roundups, review sites, honest comparison pages, community threads and video, and clear facts on your own pages.
- OpenAI and Perplexity don't publish ranking criteria. Treat studies of which sites they cite as observed patterns, dated and sampled, not rules.
- Perplexity runs its own index of over 200 billion URLs. ChatGPT partners with search providers and runs its own crawler. Allow OAI-SearchBot and PerplexityBot, or you lose your own voice in both.
- In Ahrefs' July 2026 experiment, 82% of a new event's new mentions came in answers that cited the organizer's own pages, but 43% of answers citing those pages still named someone else.
- Check progress with a fixed prompt panel in each engine over four-week windows, and expect retrieval-based gains in weeks, not days.

## Where ChatGPT and Perplexity Find the Brands They Name

To plan for brand mentions in ChatGPT and Perplexity, start with what the vendors document, then add what studies observe. Keep the two apart, because a study of last quarter's citations can be overtaken by one product update.

### What the vendors document

| Question                       | ChatGPT (OpenAI's pages)                                                                                                                  | Perplexity (Perplexity's pages)                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Where search results come from | Partners with "other search providers" and links Microsoft's and Shopify's privacy policies; rewrites your question into targeted queries | Its own index, which "tracks over 200 billion unique URLs"                           |
| How a page becomes eligible    | Allow OAI-SearchBot and OpenAI's published IP addresses                                                                                   | Allow PerplexityBot and Perplexity's published IP ranges                             |
| How a page is read             | Search results are ranked "using multiple factors"; "placement is not guaranteed"                                                         | Pages are split into "self-contained spans" that are retrieved and ranked one by one |
| Personal context               | Saved memories may shape the search query; location comes from the IP address                                                             | Memory stores preferences such as "favorite brands"; off in incognito                |
| Product opinions               | Review summaries are "based on reviews from public websites"                                                                              | Not covered on the pages we read                                                     |

Sources: OpenAI's [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) and [shopping help page](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search); Perplexity's [search API architecture post](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api) (September 2025), [crawler docs](https://docs.perplexity.ai/guides/bots) and [memory announcement](https://www.perplexity.ai/hub/blog/introducing-ai-assistants-with-memory) (November 2025).

One more documented difference shapes what you can control. Perplexity's crawler docs say PerplexityBot exists "to surface and link websites in search results," while Perplexity-User fetches pages for a user's question and "generally ignores robots.txt rules." OpenAI ties ChatGPT search eligibility to OAI-SearchBot. Our [two-engine website checklist](/blog/optimize-website-for-chatgpt-and-perplexity) covers the access settings.

### What studies observe

These are citation counts, which are not the same as brand mentions in ChatGPT and Perplexity. A cited page can name your rival, and a mention can come with no link. Still, they show which sites each engine leans on.

| Study                                                                                                      | Date and sample                                                      | ChatGPT                                                                    | Perplexity                                                   |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Ahrefs most-cited domains                                                                                  | September 2026, US queries, share of top-source citations            | Reddit 16.8%, Wikipedia 7.0%, YouTube 2.5%, Trustpilot 1.5%                | Reddit 21.6%, YouTube 20.8%, Wikipedia 6.3%, Trustpilot 0.8% |
| [Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)                                 | Aug 2024 to June 2025, 680 million citations, share of all citations | Wikipedia 7.8%, Reddit 1.8%, G2 1.1%                                       | Reddit 6.6%, YouTube 2.0%, Yelp 0.8%                         |
| [Ahrefs overlap study](https://ahrefs.com/blog/top-mentioned-sources-are-not-shared-across-ai-assistants/) | June 2025, 957k ChatGPT and 953.5k Perplexity prompts                | Only 7 sites made the top 50 in ChatGPT, Perplexity and AI Overviews alike |                                                              |

The Ahrefs Perplexity table covers over 3.1 million US queries. Its ChatGPT table says "a broad sample of US queries" without a count. The two tables use the same method, so the gap in YouTube's share is the clearest signal here: video coverage likely matters more for Perplexity than for ChatGPT.

## Five Levers That Move Brand Mentions in ChatGPT and Perplexity

Each lever below helps both engines. The notes say where one engine leans harder.

### 1. Get onto the roundups each engine reads

"Best X" lists were the most common page type ChatGPT cited for recommendation prompts in one large study. In [Ahrefs' December 2025 study](https://ahrefs.com/blog/best-lists-research/) of 750 ChatGPT prompts across software, products and agencies, blog lists made up 43.8% of all cited page types. Of 1,100 dated lists, 79.1% had been updated in 2025, and 35% sat on low-authority domains.

So run your own category prompts in both engines, collect every roundup they cite, and ask each author for a fair look. Give them current prices, one honest sentence on who you're best for, and a demo account. Fresh lists win, so an update is a new chance to be included. Our guide to [ranking on ChatGPT](/blog/how-to-rank-on-chatgpt) covers the outreach in more depth.

### 2. Keep review profiles current where buyers look

Review sites show up in both engines' sources, with different favorites. Profound saw G2 among ChatGPT's most-cited domains and Yelp among Perplexity's. Ahrefs' September 2026 tables put Trustpilot in both top 30s. For products, OpenAI says ChatGPT's review summaries come from "reviews from public websites" and are meant to "highlight common user likes and dislikes."

Pick the two or three review platforms that appear in your own prompt results. Keep the profile facts current, answer reviews in public, and ask happy customers to post where your buyers read. Don't offer rewards for positive reviews or hide the bad ones. The FTC's [2024 rule on fake reviews](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials) bans incentives "conditioned on the writing of consumer reviews expressing a particular sentiment."

### 3. Publish honest comparison pages

Your own comparison and "alternatives" pages can move brand mentions in ChatGPT and Perplexity, especially for a new brand. In a [July 2026 Ahrefs experiment](https://ahrefs.com/blog/self-promotional-content-ai-seo-experiment/) across 9,886 answers from ChatGPT, Gemini, Perplexity and Copilot, 82% of the new mentions of Ahrefs' new conference came in answers that cited one of Ahrefs' own pages. For the well-known Brand Radar product, only 6% did.

Three cautions from the same study. First, 43% of answers that cited the conference pages still never named the conference. Second, fit mattered: the conference appeared in 66.4% of answers for "best SEO conferences 2026" but 15.8% for "best marketing conferences 2026." Third, the engines treated the pages differently. When a page was found, ChatGPT cited 61% of them, while Perplexity left 76% uncited. Our [comparison page formula](/blog/comparison-page-formula) shows how to write one that stays fair.

### 4. Show up in community threads and on video

Reddit tops both engines' cited sources in Ahrefs' September 2026 data. YouTube is close behind in Perplexity. In [Ahrefs' study of 75,000 brands](https://ahrefs.com/blog/ai-brand-visibility-correlations) (December 2025), YouTube mentions had the strongest correlation with AI visibility of any factor tested, at about 0.737. That's a correlation, not proof of cause.

Answer real questions in the communities where your buyers ask for advice, say who you work for, and follow each community's rules. On video, the useful formats are demos, honest reviews and setup walkthroughs that say your brand name out loud. Our post on [Reddit in AI search](/blog/reddit-in-ai-search) covers what works there.

### 5. Make your own pages easy to quote

Third-party pages mostly decide whether you earn brand mentions in ChatGPT and Perplexity. Your own pages often decide what's said about you. State your category, price, plans, main integrations and best-fit customer in plain HTML text, near the top, with a date. Perplexity ranks passages, so each fact should make sense on its own. ChatGPT can only quote your pages if OAI-SearchBot can reach them.

Our glossary entry on [brand mentions](/glossary/brand-mentions) explains why an unlinked mention still counts.

## The Two-Engine Mention Checklist

This is Rankbox's checklist for planning work on brand mentions in ChatGPT and Perplexity. Score each row 0 (not done), 1 (partly) or 2 (done). Start with the lowest-scoring rows that touch both engines.

| Check                                      | ChatGPT                                     | Perplexity                      | How to verify it                                             |
| ------------------------------------------ | ------------------------------------------- | ------------------------------- | ------------------------------------------------------------ |
| Search crawler allowed                     | OAI-SearchBot                               | PerplexityBot                   | robots.txt test plus a log check for each bot                |
| CDN or firewall lets bots through          | Yes                                         | Yes                             | Server logs show 200s, not 403s, for both                    |
| Facts page in plain text                   | Yes                                         | Yes, as self-contained passages | View the page source and find each fact                      |
| On the top 5 roundups each engine cites    | Check its list                              | Check its list                  | Run 5 category prompts in each; tick the lists that name you |
| Review profiles current                    | G2 or Trustpilot if cited                   | Yelp or Trustpilot if cited     | Compare profile facts with your facts page                   |
| Honest comparison page for each main rival | Yes                                         | Yes                             | One page per rival, dated, fair on weaknesses                |
| Active in 2 to 3 relevant communities      | Reddit                                      | Reddit                          | Your replies in the last 30 days                             |
| Video coverage                             | Helpful                                     | Weigh it higher                 | Search YouTube for your brand and category                   |
| Wrong facts traced and fixed               | Yes                                         | Yes                             | Every repeated error has a source and a fix date             |
| Prompt panel run in clean sessions         | Unpersonalized Temporary Chat or signed out | Incognito, where memory is off  | Same prompts, same location, every week                      |

A worked example. Tallyfold, a fictional invoicing app for agencies, scores itself and gets 11 out of 20. Its weakest rows are roundups (0: none of the five lists Perplexity cites name it), video (0) and comparison pages (1: one page, for Brindlework only). It fixes roundups first because that row affects both engines, then adds a Kestrelyn comparison page, and leaves video for next quarter. Score again after eight weeks.

## How Long It Takes, and How to Tell It Worked

Changes to brand mentions in ChatGPT and Perplexity arrive on different clocks. Anything that works through live search (a new roundup listing, a fixed review profile, a clearer facts page) can show up once the page is crawled and the engine searches for that prompt. That's usually weeks. Anything that works through training data, such as a broad shift in how the web describes you, shows up only with new models.

Measure each engine on its own, with the same prompts each week, and read four-week windows. Perplexity answers usually list their sources, so you can often trace a change to a page. ChatGPT doesn't search on every prompt, so log whether it searched. For a step-by-step routine, see [how to monitor brand mentions in ChatGPT](/blog/monitor-brand-mentions-in-chatgpt), and for Perplexity's own branded answers, see our guide to [brand presence in Perplexity](/blog/brand-presence-in-perplexity).

## Where Rankbox Helps With Brand Mentions

Rankbox doesn't track brand mentions in ChatGPT and Perplexity, or citations or sentiment, so use a manual panel or a tracker to measure. Rankbox helps with levers 3 and 5. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google, and the [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles, such as a fair comparison page, delivered through Rankbox's API. [Reddit Presence](/features/reddit-presence), rolling out now, finds relevant threads and drafts replies you post yourself. The Business plan is $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### How do I get more brand mentions in ChatGPT and Perplexity?

Get listed on the roundups and review sites both engines cite for your category, publish fair comparison pages, take part in the communities where buyers ask for advice, and keep your own facts clear and current. Make sure OAI-SearchBot and PerplexityBot can reach your site.

### Do ChatGPT and Perplexity use the same sources?

Not in the same proportions. Both cite Reddit heavily, but in Ahrefs' September 2026 data YouTube held 20.8% of Perplexity's top-source citations against 2.5% of ChatGPT's. An Ahrefs study from June 2025 found only 7 sites in the top 50 of ChatGPT, Perplexity and AI Overviews alike.

### Can I pay to be mentioned in ChatGPT or Perplexity answers?

Not inside the answer. OpenAI says ads in ChatGPT appear below answers and "do not influence ChatGPT's answers," and Perplexity's crawler and search docs describe no paid route into its answers. If you pay for a "best of" listing, make sure the publisher labels it as paid, so buyers aren't misled.

### How long does it take to change brand mentions in ChatGPT and Perplexity?

Changes that work through live search, such as a new roundup listing or a clearer facts page, usually take weeks to show. Changes to what the model learned in training take longer and arrive with new models. Read results over four-week windows.

### Does my own website help brand mentions in ChatGPT and Perplexity?

Yes, especially for newer brands. In Ahrefs' 2026 experiment, most new mentions of a new event came in answers citing the organizer's own pages, while an established product's came mostly from third-party pages. Clear, dated facts in plain text help both engines.

## References

1. [The 50 most-cited websites in ChatGPT (September 2026), Ahrefs](https://ahrefs.com/blog/most-cited-domains-in-chatgpt/)
2. [The 50 most-cited websites in Perplexity (September 2026), Ahrefs](https://ahrefs.com/blog/most-cited-domains-perplexity/)
3. [86% of top mentioned sources are not shared across ChatGPT, Perplexity and AI Overviews, Ahrefs (June 2025)](https://ahrefs.com/blog/top-mentioned-sources-are-not-shared-across-ai-assistants/)
4. [AI platform citation patterns, Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)
5. [Do self-promotional "best" lists boost ChatGPT visibility?, Ahrefs (December 2025)](https://ahrefs.com/blog/best-lists-research/)
6. [Self-promotional content works, until it backfires, Ahrefs (July 2026)](https://ahrefs.com/blog/self-promotional-content-ai-seo-experiment/)
7. [Top brand visibility factors in ChatGPT, AI Mode and AI Overviews, Ahrefs (December 2025)](https://ahrefs.com/blog/ai-brand-visibility-correlations)
8. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
9. [Shopping with ChatGPT Search, OpenAI Help Center](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search)
10. [Ads in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)
11. [Architecting and evaluating an AI-first search API, Perplexity (September 2025)](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api)
12. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/guides/bots)
13. [Introducing AI assistants with memory, Perplexity (November 2025)](https://www.perplexity.ai/hub/blog/introducing-ai-assistants-with-memory)
14. [FTC announces final rule banning fake reviews and testimonials, Federal Trade Commission (August 2024)](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)
