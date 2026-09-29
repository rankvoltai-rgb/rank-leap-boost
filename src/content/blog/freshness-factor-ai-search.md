---
title: The Freshness Factor in AI Search: Why 30-Day-Old Content Beats 10-Year-Old Giants
description: The freshness factor in AI search: what studies show about recency in AI citations, which topics are time-sensitive, the fact patch, and how to track it.
keyword: freshness factor
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, SEO
---

The freshness factor is how much recency weighs when an AI engine picks the sources for an answer. It is strong on questions whose facts change, like prices, versions, rules and "best" lists, and weak on questions whose answers hold still. So a 30-day-old page can beat a 10-year-old giant, but mostly when the question is time-sensitive and the giant's facts have gone stale.

The evidence backs both halves of that sentence. In a [July 2026 study](https://arxiv.org/abs/2607.15771) of four Chinese-language AI search engines, 61% of the dated pages cited for time-sensitive queries were published within 30 days, against 32% across all queries. Yet across about 17 million citations, [Ahrefs found](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) that the average page AI assistants cite is 2.9 years old. Old pages still win plenty of answers. They lose the ones where time matters.

This guide weighs that evidence, then turns it into a method you can measure: a test for which of your topics are time-sensitive, a "fact patch" for adding new facts without a rewrite, and a before-and-after way to see whether patched pages start earning AI citations. For how Google itself judges fresh content, read our explainer on [content freshness SEO](/blog/content-freshness-seo). For cadence, see [how often to update content for AI SEO](/blog/how-often-to-update-content-for-ai-seo).

## Key Takeaways

- The freshness factor is not one setting. Recency enters an AI answer at several points: whether the engine searches, how it words its searches, what its index holds, and how it ranks dated pages.
- Studies from Ahrefs, Seer and SE Ranking all find AI engines leaning toward recent pages, but the average cited page is still years old. Recency wins on time-sensitive questions, not everywhere.
- Every published figure on the freshness factor is a correlation. None proves that updating a page causes a citation.
- AI citations turn over fast. Scrunch and Stacker measured a citation half-life of about 4.5 weeks overall, and 3.4 weeks on ChatGPT.
- Run the Freshness Sensitivity Test before you schedule updates. Five yes-or-no signals tell you whether engines treat a prompt as time-sensitive.
- A fact patch adds a dated, sourced fact to a section's first sentence and deletes the old one. It keeps the URL, the structure and most of the text.
- Track patched pages against untouched control pages in Bing's AI Performance report, Search Console's generative AI report and a fixed prompt panel.

## What the Freshness Factor Means in AI Search

Search engines have weighed recency for a long time. Google's [ranking systems guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide) describes "query deserves freshness" systems that show fresher content "for queries where it would be expected." AI engines inherit that idea and add new places where dates matter.

We use "freshness factor" as a name for the combined effect. It isn't a documented ranking signal with one value. It's the sum of several steps where a newer page, or a newer date, can change which source gets cited. Our glossary entry on [content freshness](/glossary/content-freshness) covers the term itself.

### Five places recency enters an AI answer

1. **The decision to search.** OpenAI says ChatGPT [may search the web](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt) "when your question would benefit from current information." A question answered from training data can't cite last month's page at all.
2. **The wording of the searches.** OpenAI's own example turns "what's the latest on" a cancer drug into the search "CCR8 immunotherapy drug development 2025." In a [July 2026 analysis](https://www.joshblyskal.com/research/state-of-aeo-2026), Profound found Claude added "2026" or "2025" to 94% of its searches, against 17% for ChatGPT. Profound also found that adding the year to a page title made it 17% more similar to Claude's searches. This splitting of one prompt into several searches is called [query fan-out](/glossary/query-fan-out).
3. **The freshness of the index.** Perplexity's [search architecture write-up](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api) says refreshing known pages "must compete with indexing operations for new unvisited pages," so a model predicts which URLs to recrawl from their "importance and likely update frequency."
4. **Filters and rankers that read dates.** The same Perplexity document says early filters remove "clearly non-responsive or stale content." Anthropic's [web search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) hands Claude a `page_age` field for each result: "When the site was last updated."
5. **The core ranking behind the answer.** Google says its AI features are ["rooted in our core Search ranking and quality systems"](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) and retrieve "relevant, up-to-date web pages." So Google's freshness systems apply to AI Overviews and [AI Mode](/glossary/ai-mode) where they apply to Search. Our comparison of [Google AI Mode and traditional search](/blog/google-ai-mode-vs-traditional-search) explains how the two AI features differ.

Stacked together, these steps explain why the freshness factor is large for some prompts and close to zero for others.

## What the Evidence Says About the Freshness Factor

Most numbers on recency in AI citations come from vendors that sell AI visibility tools. That doesn't make them wrong, but you should know who measured what, and how. Here are the studies worth knowing, oldest first.

| Study                                                                                                                 | Sample and method                                                                                      | Main finding                                                                                         | Caveat                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Seer Interactive](https://www.seerinteractive.com/insights/study-ai-brand-visibility-and-content-recency), June 2025 | Log hits from three ChatGPT bots, plus 5,000+ cited URLs with publish dates, via Peec AI               | Nearly 65% of AI bot hits went to content published in the past year                                 | Industry mattered: in decking, pages from as far back as 2004 still drew bot hits                                                                                  |
| [Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/), July 2025                           | 16.975 million cited URLs across ChatGPT, Perplexity, Gemini, Copilot, AI Overviews and Google organic | AI assistants cited pages 25.7% fresher than organic results; ChatGPT's citations ran 458 days newer | Average cited page was still 2.9 years old                                                                                                                         |
| [Fang et al., Waseda University](https://arxiv.org/abs/2509.11353), Sept 2025 (revised Sept 2026)                     | Lab test: fake "Published on" dates added to TREC passages, reranked by seven LLMs                     | Newer-dated passages moved up as many as 95 places                                                   | A lab reranker, not a live search product                                                                                                                          |
| [SE Ranking](https://seranking.com/blog/how-to-optimize-for-chatgpt/), Nov 2025                                       | 216,524 pages on 129,000 domains, ChatGPT citations, factor analysis                                   | Pages updated in the past three months averaged 6.0 citations, against 3.6                           | Correlation across many factors                                                                                                                                    |
| [AirOps](https://www.airops.com/report/the-2026-state-of-ai-search), Dec 2025                                         | "Millions of datapoints"; sample and method not detailed on the report page                            | Pages not updated quarterly were over three times as likely to lose citations                        | Method not published in detail                                                                                                                                     |
| [Scrunch with Stacker](https://scrunch.com/blog/half-life-of-ai-citations), Mar 2026                                  | 3.5 million citation events, Sept 2025 to Mar 2026, six AI platforms                                   | Half of a week's cited sources dropped out in about 4.5 weeks                                        | Measures turnover, not page age; [Stacker](https://stacker.com/blog/source-decay-research-the-stacker-network-effect-on-ai-citation-persistence) sells syndication |
| [Zhen et al.](https://arxiv.org/abs/2607.15771), July 2026                                                            | 614 queries × 3 runs on Doubao, DeepSeek, Tencent Yuanbao and Qwen; 160,860 citation records           | Median age of dated cited pages: 18 days for time-sensitive queries, 101 for stable ones             | Chinese-language engines only                                                                                                                                      |

### Where the studies agree

Three findings about the freshness factor repeat across publishers. AI engines lean toward recent pages, and in Ahrefs' data they cite newer pages than Google's organic results do. Recently updated pages are cited more often than pages left alone. And the gap is widest where facts move fast: Seer saw it most in financial services, and the July 2026 study saw it most in categories like digital products, cars and home renovation.

### Where they disagree

The studies split on the freshness factor in Google's AI features. Ahrefs found AI Overviews cited pages 16 days older than organic results, so no freshness premium at all. Seer found AI Overviews had the strongest pull toward recent content of the three engines it checked, with about 85% of citations from 2023 to 2025. The samples, dates and methods differ, so neither settles it. Treat Google's AI features like Google Search: freshness matters where its freshness systems expect it.

### Why "30-day-old content beats 10-year-old giants" is only half true

The title's claim holds for time-sensitive questions, where the freshness factor is strongest. In the July 2026 study, 61% of dated pages cited for those queries were under 30 days old, and pages cited in the same domain ran about 45 days newer for time-sensitive queries than for stable ones.

It fails for stable questions. Seer found about 21% of ChatGPT's citations came from before 2022, some reaching back to 2004. Ahrefs' author put it plainly: "AI assistants still prefer citing long-lived content." A 10-year-old guide that is still correct keeps winning answers where nothing has changed.

So the accurate version is narrower. A 30-day-old page beats a 10-year-old giant when the question depends on a fact that changed, and the giant still states the old one. That's the gap to aim at.

### A date line alone can sway an LLM ranker

The Waseda study adds a warning. Researchers added fake "Published on" dates to passages and asked seven models, including GPT-4o and Qwen-2.5 72B, to rerank them. Newer-dated passages rose, the top 10's average year moved forward by up to 4.78 years, and larger models reduced the effect without removing it.

It isn't a tactic. Google's [helpful content guide](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) asks whether you are "changing the date of pages to make them seem fresh when the content has not substantially changed." Perplexity's Search API can [filter results](https://docs.perplexity.ai/docs/search/filters/date-time-filters) by both published and last-updated dates, so its index tracks both. Bing asks site owners to [set `lastmod`](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search) only when "the content on that URL was actually updated." A fake date spends trust for a short gain.

## How Fast AI Answer Engines Refresh Their Sources

Most guides to the freshness factor stop at Google's ranking systems. The practical question for AI search is how fast each engine notices a change, and how long a citation lasts once you win it. Vendors document the first part. Only third-party data covers the second.

| Engine                          | What the vendor documents                                                                                                                                              | Citation half-life (Scrunch, Mar 2026) | Your lever                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| Google AI Overviews and AI Mode | Built on core ranking; retrieves "up-to-date web pages" from the Search index; recrawling "can take anywhere from a few days to a few weeks"                           | 4.3 to 4.8 weeks                       | Request indexing once; keep sitemap `lastmod` honest            |
| ChatGPT                         | Searches when current information helps; rewrites prompts into targeted searches, which include a year in OpenAI's own example; robots.txt changes take about 24 hours | 3.4 weeks                              | Put the year and "as of" dates where the answer depends on them |
| Perplexity                      | Own index of 200+ billion URLs; recrawls by predicted update frequency; filters stale content                                                                          | 5.8 weeks                              | Show real published and updated dates                           |
| Microsoft Copilot               | Bing uses `lastmod`, ETags and IndexNow to spot changes; IndexNow helps "reduce outdated or incorrect URL references in Copilot responses"                             | Not reported                           | Ping IndexNow on every real update                              |
| Claude                          | Each search result carries `page_age`; Profound found a year in 94% of its searches                                                                                    | Not reported                           | Keep the visible updated date accurate                          |

Sources for the table: Google's [recrawl guide](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), OpenAI's [crawler docs](https://developers.openai.com/api/docs/bots), Perplexity's architecture write-up, Bing's [Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a), Anthropic's web search docs and the [Scrunch study](https://scrunch.com/blog/half-life-of-ai-citations).

Two lessons follow. First, a change can reach an answer within weeks, because these engines search live indexes rather than waiting for a new model. Our [Perplexity SEO guide](/ai-seo/perplexity) shows the recrawl pipeline in more depth. Second, the freshness factor cuts both ways: a citation you win is not yours to keep. Scrunch's authors are careful here: they say it's safe to assume recency matters, but "tough to say exactly how much without follow-up research." Their half-life measures rotation, and fresh pages are one reason sources rotate.

## The Freshness Sensitivity Test

Before you update anything, find out which of your prompts engines treat as time-sensitive. Google's [2011 freshness update](https://googleblog.blogspot.com/2011/11/giving-you-fresher-more-recent-search.html) named three kinds of searches that need recent results: recent events or hot topics, regularly recurring events, and topics with frequent updates, like camera or car reviews. It added that "different searches have different freshness needs." That holds for AI engines too: how time-sensitive a prompt is forms part of its [search intent](/glossary/search-intent).

The Freshness Sensitivity Test is our five-signal check of how big the freshness factor is for one prompt. Score one point for each yes.

| #   | Signal         | Where to look                                      | Yes when                                                        |
| --- | -------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| 1   | Time words     | The prompt                                         | It says "latest," "new," "current," "this year" or a year       |
| 2   | A moving fact  | The prompt                                         | It asks about a price, plan, version, rate, rule or "best" list |
| 3   | Dated searches | The engine's visible searches, where it shows them | A search adds a year or "latest" that the prompt didn't have    |
| 4   | Recent sources | The cited pages                                    | Half or more are dated within the last 12 months                |
| 5   | Hedged answer  | The answer text                                    | It gives an "as of" date or warns that details may have changed |

Run each prompt in two or three engines with search on, twice, and score what you see. A score of 0 or 1 means low sensitivity: the freshness factor is small and quality decides. A score of 2 or 3 is medium. A score of 4 or 5 is high: a stale page is likely to lose to a newer one, even a strong page on a big site. These cut-offs are our rule of thumb, not a published standard.

### Worked example: six Tallyfold prompts

Tallyfold is a fictional invoicing and payments app for agencies. Its rivals, Brindlework and Kestrelyn, are fictional too. Here are six prompts from its buyer panel, scored by hand. The scores are illustrative.

| Prompt                                                 | Signals present | Score | Sensitivity |
| ------------------------------------------------------ | --------------- | ----- | ----------- |
| Best invoicing software for design agencies in 2026    | 1, 2, 3, 4, 5   | 5     | High        |
| Tallyfold vs Brindlework pricing                       | 2, 3, 4, 5      | 4     | High        |
| Does Kestrelyn support invoices in several currencies? | 2, 4, 5         | 3     | Medium      |
| Average days for agency clients to pay an invoice      | 2, 4            | 2     | Medium      |
| How to write a polite late payment email               | None            | 0     | Low         |
| What does net 30 mean?                                 | None            | 0     | Low         |

The high rows are where the freshness factor bites, so Tallyfold's pages there need current facts and visible dates. The low rows are where a clear, correct page can stay unchanged for a year. Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) writes a 30-prompt buyer panel you can score this way.

## Which Pages to Update First

Use the freshness factor to set priorities. Pair each prompt's sensitivity score with the page you expect to win it, then sort by what the engines already show you. Pages that get impressions or citations today have the most to lose.

| Sensitivity  | Page already cited or shown in AI features | Page not cited yet                          |
| ------------ | ------------------------------------------ | ------------------------------------------- |
| High (4–5)   | Fact patch now, then track it              | Patch, then check that engines can crawl it |
| Medium (2–3) | Fact patch at the next review              | Improve the answer first, then patch        |
| Low (0–1)    | Leave it; check facts yearly               | Fix the answer; freshness won't help        |

This table decides where the freshness factor is worth your time. For a scored queue across dozens of articles, use the refresh priority score in our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search). For review dates by page type, use our [AI search content refresh calendar](/blog/ai-search-content-refresh-calendar). A page with no demand at all isn't a patch candidate; our [content decay](/glossary/content-decay) entry covers when to merge or retire it.

## The Fact Patch: Add New Facts Without Rewriting the Article

A fact patch is the cheapest way to act on the freshness factor: a small, dated edit that brings one section up to date. You replace an old claim with a current one, show when it was true and where it came from, and leave the rest of the page alone. It keeps the URL, the headings and the links that made the page worth citing.

It fits the evidence. Engines cite sections, and they read dates. SE Ranking's own advice is to "add recent trends or revised sections rather than republishing entirely." A patch does exactly that at the level of one sentence.

### The five parts of a fact patch

Every patched sentence carries five things, in about this order:

1. **The claim.** What is true now, in plain words.
2. **The number.** The figure, price or version, stated once.
3. **The as-of date.** A month and year, so a reader or an engine can judge it.
4. **The source.** A link to the primary page that states it.
5. **The consequence.** One clause on what it means for the reader.

### Rules that keep a patch honest

- **Patch the first sentence of the section.** It's the sentence a reader sees first, and the one that answers the heading's question.
- **Delete the old figure.** Two numbers for one fact make an answer engine guess.
- **One source per number.** If no live source states it, cut the number.
- **Keep the heading** unless the question itself changed.
- **Move the page's updated date only when the patch changes the answer.** A reworded sentence with no new fact isn't an update.
- **Stop at half.** If more than half the sections need patches, it's a rewrite. Run our [AI SEO checklist for old posts](/blog/ai-seo-checklist) instead.

### Before and after: a Tallyfold section

Here is a section from Tallyfold's guide to getting paid on time. The survey, figures and dates are made up for the example.

**Before (written in 2023):**

> **How long do agency clients take to pay?** Most agency clients pay within 30 days, but late payments are common. A recent survey found that many agencies wait more than a month. Sending reminders helps you get paid faster, so it's worth setting them up early.

**After (a fact patch in September 2026):**

> **How long do agency clients take to pay?** Agency clients took a median of 41 days to pay in 2026, 11 days past a standard net-30 term, according to the Northgate Agency Survey (fictional, September 2026, 1,200 agencies). That gap means a 30-day term works more like a 45-day wait for cash planning. The same survey found invoices with an automatic reminder on day 25 were paid a median of 9 days sooner.

The patch swapped vague claims for dated, sourced figures and one consequence. The heading and the next section stayed as they were, and the page's updated date moved because the answer changed. On a live page, the survey name would link to its source.

## Patch and Compare: Track Whether Patched Pages Earn AI Citations

A patch is a bet that the freshness factor applies to your page, and that fresher facts earn more citations. Patch and Compare is how you check the bet. It uses three free instruments and one control group.

### The three instruments

- **Bing Webmaster Tools, AI Performance.** Since [February 2026](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) it counts citations of your pages across Copilot, AI summaries in Bing and select partners, with the grounding queries behind them. Its [June 2026 Compare view](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare) overlays a past period, such as the last 30 days against the 30 before, to spot shifts that "may correlate with content updates." Our [Bing Webmaster Tools guide](/blog/bing-webmaster-tools-ai-indexing-guide) covers setup.
- **Search Console, Generative AI performance report.** It counts impressions in AI Overviews and AI Mode by page, country, device and date, and Google says it reached [all websites worldwide](https://support.google.com/webmasters/answer/16984139) as of 31 August 2026. It counts impressions only. Mark the patch date with a [custom annotation](https://support.google.com/webmasters/answer/16530728) on the Performance chart.
- **A fixed prompt panel.** The same prompts, engines and settings every week, logged answer by answer. Our guide to [measuring GEO](/blog/how-to-measure-geo) explains how to build one and how many runs you need.

### The steps

1. **Pick patched and control pages.** Choose pages of similar type and sensitivity. Patch half and leave half alone.
2. **Take a four-week baseline** on both groups in all three instruments.
3. **Ship the patches on one day.** Annotate the date, update each patched page's sitemap `lastmod`, and send IndexNow pings. Our [AI SEO checklist](/blog/ai-seo-checklist) covers the recrawl steps in check 14.
4. **Wait about two weeks** for recrawling, then measure four more weeks. With citation half-lives near a month, shorter windows mostly catch noise.
5. **Calculate the lift:** the patched group's change minus the control group's change.

### Worked example: Tallyfold's eight-page patch

Tallyfold patched eight high-sensitivity pages and left eight similar pages alone. Its panel ties one prompt to each page and runs each prompt in ChatGPT, Perplexity and Google AI Mode, three times a week. That's 8 × 3 × 3 = 72 answers per group each week, or 288 over each four-week period. All numbers are illustrative.

| Measure                                | Patched: before   | Patched: after    | Control: before   | Control: after    |
| -------------------------------------- | ----------------- | ----------------- | ----------------- | ----------------- |
| Panel answers citing a Tallyfold page  | 41 of 288 (14.2%) | 83 of 288 (28.8%) | 38 of 288 (13.2%) | 47 of 288 (16.3%) |
| Bing AI citations, 30 days             | 212               | 305               | 198               | 207               |
| Search Console AI impressions, 4 weeks | 9,400             | 11,900            | 8,800             | 9,100             |

On the panel, the patched group rose 14.6 points and the control group rose 3.1. The lift is 14.6 − 3.1 = 11.5 points. With 288 answers in each cell, the 95% margin of error on that difference is about ±8.8 points, so an 11.5-point lift clears it. Bing's citations tell the same story: up 44% on patched pages, against 5% on control pages. Search Console's impressions rose 27% against 3%.

Three instruments agreeing is what makes the result believable evidence that the freshness factor paid off for these pages. If only one moves, treat it as a lead, not a win. Repeated runs of one prompt aren't fully independent, so the true margin is a little wider than the math says.

## Where Rankbox Helps and Where It Doesn't

Rankbox writes new articles. It doesn't refresh, audit or re-date your existing posts, it doesn't track AI citations, and it doesn't publish to your CMS: articles reach your site through its API. It won't keep your content fresh for you, and it won't run Patch and Compare.

It helps when a review shows a page needs more than a patch. Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) can draft the rewrite: it researches the live web and writes a 2,000–3,500-word article with its sources linked. [Brand Voice](/features/brand-voice) applies the tone, audience and product details you give it. You still check every fact and keep the old URL. The Business plan costs $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### What is the freshness factor in AI search?

The freshness factor is how much recency weighs when an AI engine picks sources for an answer. It comes from several steps: whether the engine searches, whether its searches include a year, how fresh its index is, and how its rankers read page dates. It's large for time-sensitive questions and small for stable ones.

### Do AI engines prefer newer content than Google?

Mostly, yes. Ahrefs found that ChatGPT, Perplexity, Gemini and Copilot cited pages 25.7% fresher than Google's organic results, while Google AI Overviews showed no freshness premium. Another study, from Seer Interactive, found the opposite for AI Overviews. All of these are correlations, and the average cited page was still 2.9 years old.

### Does changing the date on a page help AI citations?

No, not honestly. A lab study showed fake dates can sway LLM rerankers, but Google asks site owners not to change dates "when the content has not substantially changed," and Bing asks for `lastmod` values that reflect real updates. Change the date after a real fact patch, not instead of one.

### How long does it take for an update to show up in AI answers?

Expect weeks, not days. Google says recrawling can take a few days to a few weeks, and OpenAI says robots.txt changes take about 24 hours to reach ChatGPT search. Measure four weeks after a two-week crawl gap, since Scrunch found cited sources turn over in about a month anyway.

### Does old content still get cited by AI engines?

Yes. The average page AI assistants cite is about 2.9 years old, per Ahrefs, and Seer saw ChatGPT cite pages from as far back as 2004. The freshness factor is small for questions whose answers haven't changed, so old pages keep winning those. They lose questions about prices, versions, rules and rankings once their facts go stale.

### How do I know if my topic is time-sensitive for the freshness factor?

Run the Freshness Sensitivity Test. Check the prompt for time words and facts that change, then run it with search on and check for dated searches, sources from the last 12 months and hedged answers. Four or five yes answers mean high sensitivity; zero or one means freshness barely matters.

## References

1. [What Do Chinese-Language Generative Search Engines Cite and Surface? (Zhen et al., arXiv, July 2026)](https://arxiv.org/abs/2607.15771)
2. [New Study: AI Assistants Prefer to Cite "Fresher" Content, Ahrefs (July 2025)](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
3. [Study: AI Brand Visibility and Content Recency, Seer Interactive (June 2025)](https://www.seerinteractive.com/insights/study-ai-brand-visibility-and-content-recency)
4. [Do Large Language Models Favor Recent Content? (Fang et al., arXiv)](https://arxiv.org/abs/2509.11353)
5. [How to Optimize for ChatGPT, SE Ranking (November 2025)](https://seranking.com/blog/how-to-optimize-for-chatgpt/)
6. [The 2026 State of AI Search, AirOps (December 2025)](https://www.airops.com/report/the-2026-state-of-ai-search)
7. [The half-life of AI citations, Scrunch (March 2026)](https://scrunch.com/blog/half-life-of-ai-citations)
8. [The state of AEO in 2026: Claude is not ChatGPT, Josh Blyskal and Jasman Singh (July 2026)](https://www.joshblyskal.com/research/state-of-aeo-2026)
9. [A guide to Google Search ranking systems, Google Search Central](https://developers.google.com/search/docs/appearance/ranking-systems-guide)
10. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
11. [Creating helpful, reliable, people-first content, Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
12. [Giving you fresher, more recent search results, Google (November 2011)](https://googleblog.blogspot.com/2011/11/giving-you-fresher-more-recent-search.html)
13. [Ask Google to recrawl your URLs, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
14. [Generative AI performance report (Search), Search Console Help](https://support.google.com/webmasters/answer/16984139)
15. [Search Console annotations, Search Console Help](https://support.google.com/webmasters/answer/16530728)
16. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt)
17. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
18. [Architecting and evaluating an AI-first Search API, Perplexity Research](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api)
19. [Web search tool, Claude Developer Platform](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)
20. [Bing Webmaster Guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
21. [Keeping Content Discoverable with Sitemaps in AI Powered Search, Microsoft Bing (July 2025)](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search)
22. [Introducing AI Performance in Bing Webmaster Tools, Microsoft Bing (February 2026)](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
23. [New AI Visibility Insights in Bing Webmaster Tools, Microsoft Bing (June 2026)](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare)
