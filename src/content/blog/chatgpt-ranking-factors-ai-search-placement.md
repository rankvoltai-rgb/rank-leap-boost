---
title: The 7 ChatGPT Ranking Factors: What Actually Influences AI Search Placement
description: The 7 ChatGPT ranking factors people quote, each graded: what OpenAI documents, what studies only correlate, what is a guess, and how to check each one.
keyword: ChatGPT ranking factors
date: 2026-10-06
updated: 2026-10-06
written: 2026-09-29
author: Rankbox Team
tags: AI Search, ChatGPT
---

ChatGPT ranking factors are the signals that decide whether ChatGPT's web search finds your page, cites it, and names your brand in the answer. OpenAI documents almost none of them. Its help center says only that ChatGPT ["ranks search results using multiple factors intended to help users find relevant, reliable information,"](https://help.openai.com/en/articles/9237897-chatgpt-search) and that placement "is not guaranteed."

The one rule OpenAI spells out is access. Let its search crawler, OAI-SearchBot, reach your pages, or you won't be shown in ChatGPT's search answers. Everything else on the popular lists of ChatGPT ranking factors comes from outside studies, from what Microsoft says about Bing, or from educated guesses.

That's why most advice on the topic reads like forum talk. This guide takes the seven ChatGPT ranking factors most often named and grades each one: documented by the vendor, correlated in independent studies, or unverified. For each, you get a way to check it on your own site and what to change. It ends with a scoring sheet and a worked example. For the step-by-step playbook, read [how to get cited by ChatGPT](/blog/how-to-get-cited-by-chatgpt). For crawlers and fan-out in depth, see our [ChatGPT SEO guide](/ai-seo/chatgpt). For a shorter version with a 10-minute site check, read [what OpenAI documents and what the data shows](/blog/chatgpt-ranking-factors).

## Key Takeaways

- OpenAI documents one hard requirement for ChatGPT search: allow OAI-SearchBot and its published IP ranges. None of the seven popular ChatGPT ranking factors is documented by OpenAI for ordinary web pages.
- Three of the seven have correlational support in large studies: entity co-occurrence, factual extractability and community validation.
- Four are unverified for ChatGPT: schema, IndexNow, response latency and a "neutral tone score." Schema is documented only for product data in shopping results.
- Across 75,000 brands, Ahrefs found branded web mentions correlated 0.664 with ChatGPT visibility, against 0.266 for Domain Rating (December 2025).
- In Growth Memo's February 2026 analysis, 44.2% of 18,012 ChatGPT citations, each traced to its source sentence, came from the first 30% of the cited page.
- Community signals are real but unstable: Reddit's share of ChatGPT citations fell from 3.8% to 0.5% in August 2026, per Promptwatch data.
- Score your site against the ChatGPT ranking factors with the ChatGPT Placement Scorecard: 0 to 2 per factor, weighted by evidence, out of 20. Fix the heavy gaps first.

## What OpenAI Documents About ChatGPT Search

Before any list of ChatGPT ranking factors, start with the facts OpenAI puts in writing. They are short, and they matter more than any list of tips.

**When ChatGPT searches.** ChatGPT "may search the web automatically when your question would benefit from current information," and users can also start a search by hand. When it searches, it "typically rewrites your query into one or more targeted queries" and may send "additional, more specific queries" after reading the first results. Memory and an approximate location from your IP address can shape those queries, per the same [help article](https://help.openai.com/en/articles/9237897-chatgpt-search). Our post on [how ChatGPT search decides citations](/blog/how-chatgpt-search-decides-citations) walks through that pipeline.

**Where results come from.** The help article links the privacy policies of two search providers, Microsoft and Shopify. At launch in October 2024, OpenAI said ChatGPT search uses ["third-party search providers, as well as content provided directly by our partners."](https://openai.com/index/introducing-chatgpt-search/) OpenAI also runs its own crawler for search.

**Who is eligible.** OpenAI's [crawler page](https://developers.openai.com/api/docs/bots) says sites that opt out of OAI-SearchBot "will not be shown in ChatGPT search answers, though can still appear as navigational links." Robots.txt changes take about 24 hours to reach its systems, and GPTBot, the training crawler, is a separate setting. The [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) adds that "any public website can appear in ChatGPT search." Cited pages show as inline citations and in a Sources panel.

**The only ranking list OpenAI publishes** is for shopping. Its [shopping help page](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search) says merchants "are ranked based on factors like availability, price, quality, and whether they are the maker or primary seller." Product picks draw on "structured metadata from first-party and third-party providers."

| What OpenAI says                                        | Source                                                                  | What it means for placement                              |
| ------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| OAI-SearchBot must be allowed, plus its IP ranges       | Crawler page, search help                                               | The only documented gate for web pages                   |
| Queries are rewritten and sent to providers             | Search help                                                             | Your page competes for sub-queries, not the user's words |
| Microsoft and Shopify are named providers               | Search help                                                             | Their results can feed ChatGPT's answers                 |
| Ranking uses "multiple factors," unnamed                | Search help                                                             | No official list for web pages exists                    |
| Merchants ranked by availability, price, quality, maker | Shopping help                                                           | The one documented ranking list, for products only       |
| Ads "do not influence ChatGPT's answers"                | [Ads help](https://help.openai.com/en/articles/20001047-ads-in-chatgpt) | Ad spend doesn't buy a place in answers                  |

Notice what's missing. OpenAI says nothing about links, schema, page speed, tone or Reddit for ordinary pages. Those are the gaps the popular ChatGPT ranking factors try to fill.

## How We Grade ChatGPT Ranking Factors

We grade ChatGPT ranking factors on three levels. They're strict on purpose, because a claim is only as good as its source.

- **Grade A, documented.** OpenAI states it for ChatGPT. Microsoft's own guidance for Bing counts as support, not as an A, because OpenAI doesn't say how it weighs what a provider returns.
- **Grade B, correlated.** Independent studies show a pattern, and we name the publisher, date and sample. A correlation can come from a hidden third cause, such as brand size. ChatGPT also changes often, so a 2025 study may not describe the 2026 product.
- **Grade C, unverified.** A reasonable guess, a claim with no public data behind it, or a claim the data contradicts.

The grade tells you how much effort a factor deserves, not whether to ignore it. A cheap C-grade fix can still be worth doing. A costly one usually isn't.

## The 7 ChatGPT Ranking Factors at a Glance

Here are the seven ChatGPT ranking factors in the order most lists use, with the grade each one earns.

| #   | Factor                          | Grade              | Strongest evidence                            | Quick check                                       |
| --- | ------------------------------- | ------------------ | --------------------------------------------- | ------------------------------------------------- |
| 1   | Entity co-occurrence            | B                  | Ahrefs, 75,000 brands, Dec 2025               | Count the cited "best" pages that name you        |
| 2   | Factual extractability          | B                  | Growth Memo, 18,012 citations, Feb 2026       | Is the answer in the first 100 words of raw HTML? |
| 3   | Schema verification             | C (A for products) | SE Ranking, 216,524 pages, Nov 2025           | Does markup match the visible page?               |
| 4   | IndexNow and Bing freshness     | C                  | Microsoft docs; Ahrefs, 17M citations         | Is IndexNow on, and are facts current?            |
| 5   | Reddit and community validation | B, unstable        | SE Ranking; Promptwatch via Semrush, Aug 2026 | Do real threads discuss you?                      |
| 6   | HTTPS response latency          | C                  | SE Ranking page-speed correlation             | Do OpenAI's bots get errors or timeouts?          |
| 7   | Neutral tone score              | C                  | Growth Memo subjectivity finding              | Does the opening read as fact or as an ad?        |

## The Seven ChatGPT Ranking Factors, One by One

Each factor below starts with what the claim says, then the evidence, then how to check it and what to change.

### 1. Entity co-occurrence (Grade B)

**The claim.** ChatGPT is more likely to name your brand when the web often names you in the same text as your category and your rivals. An [entity](/glossary/entity-seo) is a named thing, such as a company or product, that a system can tell apart from others.

**The evidence.** In [Ahrefs' December 2025 study](https://ahrefs.com/blog/ai-brand-visibility-correlations/) of 75,000 brands, branded web mentions correlated 0.664 with ChatGPT visibility. YouTube mentions were stronger across all three AI products tested, at about 0.737. Domain Rating reached just 0.266 for ChatGPT, and Ahrefs noted ChatGPT had the weakest link to classic authority signals of the three. A [second Ahrefs study](https://ahrefs.com/blog/best-lists-research/) of 750 buyer prompts found "best X" lists were 43.8% of the page types ChatGPT cited, and brands placed high on third-party lists were more likely to be recommended.

Microsoft's [Bing guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) add that "clear entity definition improves grounding visibility and citation accuracy." That's documented for Bing, not for ChatGPT.

**What the data doesn't show.** No public study separates co-occurrence from plain fame. Big brands are named everywhere, and they're named in ChatGPT too.

**How to check.** Ask ChatGPT your top three category prompts with search on. Open every cited "best" list and comparison, and count how many name you next to your rivals.

**What to change.** Earn a place on the lists and reviews ChatGPT already cites. Use one brand name and one plain description everywhere. Our guide to [entity authority](/blog/entity-authority-in-the-ai-era) covers the wider work, and our post on [co-citation and link building](/blog/link-building-ai-visibility-co-citation) covers unlinked mentions.

### 2. Factual extractability (Grade B)

**The claim.** ChatGPT cites passages it can lift out whole: a clear answer, a named fact, a number with a source.

**The evidence.** Kevin Indig's [Growth Memo study](https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention) matched 18,012 ChatGPT citations to the exact sentences they came from. [Search Engine Land's summary](https://searchengineland.com/chatgpt-citations-content-study-469483) reports that 44.2% came from the first 30% of the page, cited text was nearly twice as likely to use definitions ("X is"), and it averaged 20.6% proper nouns against 5% to 8% in typical English.

Ahrefs' [April 2026 study](https://ahrefs.com/blog/why-chatgpt-cites-pages/) of 1.4 million prompts found ChatGPT cited only about half the URLs it retrieved. Cited page titles were closer in meaning to ChatGPT's own sub-queries, scoring 0.656 on a similarity scale where 1 is identical. Slugs in plain words were cited 89.78% of the time, against 81.11% for other URLs.

Experiments point the same way. In the [GEO paper](https://arxiv.org/abs/2311.09735) (KDD 2024), which tested a GPT-3.5 research engine, not ChatGPT, adding quotations lifted a source's visibility score from 19.5 to 27.8, and adding statistics lifted it to 25.9. Microsoft's guidelines ask for facts and definitions to be "explicit" and key information "near the top."

**How to check.** Fetch a key page the way a crawler does. OpenAI's crawlers don't run JavaScript, according to [Vercel's crawler study](https://vercel.com/blog/the-rise-of-the-ai-crawler), so the answer must be in the raw HTML. Then read the first 100 words alone. Do they answer the question the page targets?

**What to change.** Lead with the answer, define terms in one sentence, and pair each claim with a number and a source. Match titles to the [sub-queries](/glossary/query-fan-out) buyers' prompts turn into. Our guide to [optimizing content passage by passage](/blog/optimize-content-for-ai-search) shows the edits.

### 3. Schema verification (Grade C for web pages, A for product data)

**The claim.** ChatGPT checks your facts against your JSON-LD [schema markup](/glossary/schema-markup) and trusts pages whose markup agrees.

**The evidence.** OpenAI publishes nothing about schema on ordinary web pages. For shopping, it does document "structured metadata" from providers, and it takes direct product feeds. Shopify stores reach ChatGPT through Shopify Catalog, with no extra work.

For web pages, the data leans the other way. [SE Ranking's study](https://seranking.com/blog/how-to-optimize-for-chatgpt/) of 216,524 pages (November 2025) found pages with FAQ schema averaged 3.6 ChatGPT citations, against 4.2 for pages without it. Its authors concluded schema alone "does not significantly increase ChatGPT citation likelihood." Microsoft says structured data "may support clearer grounding but does not guarantee visibility," and that it "must accurately reflect visible content."

**How to check.** Run key pages through a validator, then compare every value in the markup (price, name, rating) with the visible text.

**What to change.** Keep Organization and Product markup accurate, because wrong markup can hurt trust in Bing. If you sell products, apply for OpenAI's product feed or keep your Shopify catalog clean. Don't expect markup alone to win citations. Our free [schema generator](/tools/schema-generator) writes the JSON-LD.

### 4. IndexNow and Bing freshness (Grade C for the ChatGPT link)

**The claim.** Because ChatGPT uses Bing, pinging Bing through [IndexNow](/glossary/indexnow) gets fresh pages into ChatGPT faster.

**The evidence.** Part of the chain is documented. OpenAI names Microsoft as a search provider. Microsoft says IndexNow notices help Bing "refresh the index and reduce outdated or incorrect URL references in Copilot responses and grounding results." But OpenAI isn't among the engines on [IndexNow's participant list](https://www.indexnow.org/faq), and no public data shows IndexNow speeding up ChatGPT.

Bing rank isn't the whole story either. In [Ahrefs' 2025 overlap study](https://ahrefs.com/blog/ai-search-overlap/) of 15,000 prompts, only 8.1% of ChatGPT's in-text citations ranked in Bing's top 10 for the same prompt.

Freshness itself has better support. Across 17 million citations, [Ahrefs found](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) ChatGPT cited URLs 458 days newer than Google's organic results. SE Ranking found pages updated in the past three months averaged 6.0 citations, against 3.6. There's a twist: within one prompt's results, Ahrefs' 2026 study found older, established pages were often the ones cited.

**How to check.** Confirm your key pages are indexed in Bing Webmaster Tools, your IndexNow key file responds, and your sitemap `lastmod` dates are true.

**What to change.** Turn on IndexNow, since it's cheap. Update facts when they change, and never bump a date without changing the page. Our post on the [freshness factor](/blog/freshness-factor-ai-search) covers what to update first, and our [Bing Webmaster Tools guide](/blog/bing-webmaster-tools-ai-indexing-guide) covers setup.

### 5. Reddit and community validation (Grade B, unstable)

**The claim.** Brands that real people discuss in forums, reviews and Reddit threads get recommended more.

**The evidence.** OpenAI and Reddit announced a [partnership on 16 May 2024](https://openai.com/index/openai-and-reddit-partnership/): OpenAI gets access to Reddit's Data API to "bring enhanced Reddit content to ChatGPT." That's a documented data deal, not a ranking rule.

The correlations are strong but shaky. SE Ranking found domains with millions of Reddit and Quora mentions had about four times the chance of being cited, and domains with review-site profiles averaged 4.6 to 6.3 citations, against 1.8 for those without. Yet Ahrefs found Reddit results pulled in through ChatGPT's separate Reddit channel were cited just 1.93% of the time. And per Promptwatch data [reported by Semrush](https://www.semrush.com/blog/reddits-citations-in-chatgpt-fall/), Reddit's share of ChatGPT citations fell from 3.8% to 0.5% in mid-August 2026, a drop Promptwatch calls provisional.

The likely reading: discussion shapes what ChatGPT reads and believes about a brand, but a Reddit thread is an unreliable citation target.

**How to check.** Search Reddit and review sites for your category terms. Are you mentioned by people who don't work for you?

**What to change.** Take part the way each community's rules allow, and say who you are. The [Reddit Rules](https://redditinc.com/policies/reddit-rules) ask you to "participate authentically" and ban spam and content manipulation. In the US, the FTC says employees who praise their company's product should [disclose that they work there](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Microsoft's guidelines also list "artificial social promotion schemes that simulate popularity" as a violation. See our [Reddit SEO](/glossary/reddit-seo) entry and our post on [Reddit in AI search](/blog/reddit-in-ai-search).

### 6. HTTPS response latency (Grade C)

**The claim.** ChatGPT prefers pages that answer fast over HTTPS.

**The evidence.** Of all the ChatGPT ranking factors on popular lists, this one has the thinnest support. OpenAI documents no speed or HTTPS requirement. SE Ranking found pages with a first contentful paint under 0.4 seconds averaged 6.7 citations, against 2.1 above 1.1 seconds. But first contentful paint is a browser measure, and fast sites tend to be large, well-funded brands. No public study links server response time to ChatGPT citations.

The fair inference is narrow. A crawler or live fetch that hits an error or a timeout gets nothing, so failures matter. Past that point, there's no evidence that shaving milliseconds changes placement.

**How to check.** Request a key page with OAI-SearchBot's user agent and time the first byte. Then scan your logs for 5xx errors or timeouts served to OpenAI's bots. Google's [web.dev guidance](https://web.dev/articles/ttfb) calls 0.8 seconds or less a good time to first byte.

**What to change.** Fix errors, timeouts and firewall challenges first. Treat speed as general site health, not as a ChatGPT lever.

### 7. Neutral tone score (Grade C)

**The claim.** ChatGPT scores tone and favors neutral, unbiased pages over promotional ones.

**The evidence.** No vendor documents a tone score. OpenAI's [Model Spec](https://model-spec.openai.com/) has a section titled "Assume an objective point of view," which asks for "reliable sources" on factual questions. That governs how ChatGPT writes, not how it ranks pages.

The data is thin and mixed. Growth Memo found cited text clustered at a subjectivity score of 0.47 on a 0 to 1 scale, which its author describes as fact plus interpretation, not flat neutrality. Ahrefs found self-promotional "best" lists still appeared in more than a third of software answers that recommended their publisher. In the GEO paper, a more persuasive, authoritative rewrite moved the score from 19.5 to 21.8, far less than adding statistics.

**How to check.** Read your page's first three paragraphs. Count claims like "best" or "leading" that have no number or source behind them.

**What to change.** Swap hype for facts, name your limits, and compare rivals fairly. Balanced pages seem to do well because they're easier to quote, not because of a tone meter. Of the seven ChatGPT ranking factors, this is the cheapest to fix and among the least proven. Our [comparison page formula](/blog/comparison-page-formula) shows the format.

## What Most ChatGPT Ranking Factors Lists Leave Out

Two signals with better evidence than several of the seven don't appear on most lists.

**The access gate (Grade A).** OAI-SearchBot must reach your pages through robots.txt, your CDN and your firewall. OpenAI asks sites to allow its [published IP ranges](https://openai.com/searchbot.json). A bot-protection rule can undo everything above, as our [Cloudflare challenge guide](/blog/cloudflare-challenge-trap) explains.

**Sub-query match (Grade B).** ChatGPT doesn't search for the user's words. Nectiv re-ran about 4,000 prompts in August 2026 and found [7.61 searches per prompt](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study), up from 2.17 a year earlier, with 64% using the `site:` operator to search specific domains. That favors clear, official pages on your own site for every fact a buyer checks: pricing, features, integrations and policies.

## The ChatGPT Placement Scorecard

This scorecard turns the graded ChatGPT ranking factors into a to-do list. Score each factor 0, 1 or 2, multiply by the evidence weight, and add up. Grade A factors weigh 3, grade B weigh 2, and grade C weigh 1. Access is a gate: if OAI-SearchBot is blocked, your score is zero.

| Factor                    | Weight           | 0 points                             | 1 point                                   | 2 points                                             |
| ------------------------- | ---------------- | ------------------------------------ | ----------------------------------------- | ---------------------------------------------------- |
| 1. Entity co-occurrence   | 2                | Named on none of the top cited lists | Named on 1 or 2                           | Named on 3 or more                                   |
| 2. Factual extractability | 2                | Answer missing from raw HTML         | Answer present, but below the first third | Answer in the first 100 words, with a sourced number |
| 3. Schema verification    | 1 (3 for stores) | Markup contradicts the page          | Markup present, never checked             | Validates and matches the page                       |
| 4. IndexNow and freshness | 1                | Key pages missing from Bing          | Indexed, facts older than a year          | Indexed, IndexNow on, facts current                  |
| 5. Community validation   | 2                | No outside discussion                | A few mentions by others                  | Regular, unprompted mentions and review profiles     |
| 6. Response latency       | 1                | Errors or timeouts for OpenAI bots   | Slow first byte, over 0.8 seconds         | Fast and error-free                                  |
| 7. Neutral tone           | 1                | Unsupported hype in the opening      | Mixed                                     | Specific, sourced and fair to rivals                 |

The weights add up to 10, so the top score is 20. For each factor, the gap is (2 − your score) × weight. Work on the biggest gaps first.

### Worked example: Tallyfold

Tallyfold is a made-up invoicing and payments app for agencies, and its rivals Brindlework and Kestrelyn are made up too. The numbers are illustrative.

Tallyfold's team first runs 20 buyer prompts three times each in ChatGPT, for 60 answers. Tallyfold is named in 7 of them (11.7%). Brindlework is named in 38 (63.3%) and Kestrelyn in 29 (48.3%). OAI-SearchBot is allowed, so the gate is passed. Then the team scores the seven ChatGPT ranking factors.

| Factor                    | Score | Weight | Points      | Gap    |
| ------------------------- | ----- | ------ | ----------- | ------ |
| 1. Entity co-occurrence   | 0     | 2      | 0           | 4      |
| 2. Factual extractability | 1     | 2      | 2           | 2      |
| 3. Schema verification    | 2     | 1      | 2           | 0      |
| 4. IndexNow and freshness | 2     | 1      | 2           | 0      |
| 5. Community validation   | 0     | 2      | 0           | 4      |
| 6. Response latency       | 2     | 1      | 2           | 0      |
| 7. Neutral tone           | 1     | 1      | 1           | 1      |
| **Total**                 |       | **10** | **9 of 20** | **11** |

Look at the pattern. Tallyfold has maxed out the cheap C-grade factors, markup, IndexNow and speed, and scores zero on the two B-grade factors that take real work. Its gaps of 4 sit on co-occurrence and community validation.

So the plan runs in this order:

1. **Co-occurrence (gap 4).** Pitch the three agency-software roundups ChatGPT cites most, and publish a fair Tallyfold vs Brindlework comparison.
2. **Community (gap 4).** Get listed on the review sites those roundups use, and have the founder answer invoicing questions in agency forums, saying each time that she runs Tallyfold.
3. **Extractability (gap 2).** Move the answer to the top of the pricing and integrations pages, with dated numbers.
4. **Tone (gap 1).** Replace "the best invoicing tool" on the homepage with what Tallyfold does and for whom.

If co-occurrence and community reach 1, and extractability and tone reach 2, the score is 16 of 20. The score is a plan, not a forecast. The real test is the prompt panel: re-run the same 60 answers after eight weeks and compare. Our guide to [measuring GEO](/blog/how-to-measure-geo) shows how many answers you need before a change is real, and our [ChatGPT rank tracker](/blog/chatgpt-rank-tracker) roundup covers tools that run the panel for you.

## What Rankbox Covers, and What It Doesn't

Of the seven ChatGPT ranking factors, Rankbox helps most with factor 2, extractability, and with sub-query match. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google, with volume, difficulty and intent shown as model estimates. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles, answer first, and the [SEO/GEO score](/features/seo-geo-score) checks each draft. Articles reach your site through Rankbox's [API](/integrations/api).

Rankbox doesn't track AI citations, manage robots.txt or IndexNow, or publish directly to a CMS. For factor 5, [Reddit Presence](/features/reddit-presence) is rolling out: it finds relevant threads and drafts replies for you to post yourself. For tools that run inside ChatGPT, including Rankbox's research server, see our guide to the [best ChatGPT SEO software](/blog/best-chatgpt-seo-software). The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### What are the ChatGPT ranking factors?

ChatGPT ranking factors are the signals that decide whether ChatGPT's search finds, cites and names you. OpenAI documents one for web pages: OAI-SearchBot access. Studies correlate brand mentions, answer-first passages and community discussion with visibility. Schema, IndexNow, speed and tone are unverified for ChatGPT.

### Does OpenAI publish its ChatGPT ranking factors?

No. OpenAI says ChatGPT ranks results using "multiple factors" meant to surface relevant, reliable information, and that placement isn't guaranteed. The only ranking list it publishes is for shopping, where merchants are ranked on availability, price, quality and whether they make or mainly sell the item.

### Does schema markup help you rank in ChatGPT?

There's no evidence it does for ordinary pages. OpenAI says nothing about schema for web pages, and SE Ranking found pages with FAQ schema averaged slightly fewer ChatGPT citations than pages without. Product data is different: OpenAI documents structured product metadata and feeds for shopping results.

### Do backlinks matter for ChatGPT?

Less than brand mentions, on current evidence. Ahrefs found Domain Rating correlated just 0.266 with ChatGPT visibility, against 0.664 for branded web mentions. Links still help pages get found and ranked by search providers, which shapes the pool of pages ChatGPT reads. See our post on whether [link building helps AI visibility](/blog/does-link-building-help-ai-visibility).

### Does Reddit help you get recommended by ChatGPT?

Sometimes, but it's unstable. OpenAI has a data partnership with Reddit, and studies link Reddit mentions with more citations. Yet Reddit's share of ChatGPT citations fell from 3.8% to 0.5% in August 2026, per Promptwatch. Real discussion by customers helps. Fake or seeded posts break Reddit's rules and Microsoft's guidelines.

### How long do ChatGPT ranking factors take to change results?

Access fixes are fastest: OpenAI says robots.txt changes reach its systems in about 24 hours. Content and mention work takes weeks or months, because pages must be crawled, indexed and weighed against others. Re-run a fixed prompt panel after about eight weeks.

## References

1. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
2. [Overview of OpenAI Crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
3. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
4. [Shopping with ChatGPT Search, OpenAI Help Center](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search)
5. [Ads in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)
6. [Introducing ChatGPT search, OpenAI](https://openai.com/index/introducing-chatgpt-search/)
7. [OpenAI and Reddit Partnership, OpenAI](https://openai.com/index/openai-and-reddit-partnership/)
8. [OpenAI Model Spec, OpenAI](https://model-spec.openai.com/)
9. [Bing Webmaster Guidelines, Microsoft](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
10. [IndexNow FAQ, IndexNow.org](https://www.indexnow.org/faq)
11. [Top Brand Visibility Factors in ChatGPT, AI Mode, and AI Overviews (75k Brands Studied), Ahrefs](https://ahrefs.com/blog/ai-brand-visibility-correlations/)
12. [Why ChatGPT Cites One Page Over Another (Study of 1.4M Prompts), Ahrefs](https://ahrefs.com/blog/why-chatgpt-cites-pages/)
13. [Do AI Assistants Prefer to Cite "Fresh" Content?, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
14. [Only 12% of AI Cited URLs Rank in Google's Top 10 for the Original Prompt, Ahrefs](https://ahrefs.com/blog/ai-search-overlap/)
15. [Do Self-Promotional "Best" Lists Boost ChatGPT Visibility?, Ahrefs](https://ahrefs.com/blog/best-lists-research/)
16. [How to Optimize for ChatGPT: LLMs.txt Doesn't Matter but Brand Mentions on Quora and Reddit Do, SE Ranking](https://seranking.com/blog/how-to-optimize-for-chatgpt/)
17. [The Science of How AI Pays Attention, Growth Memo](https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention)
18. [44% of ChatGPT Citations Come From the First Third of Content: Study, Search Engine Land](https://searchengineland.com/chatgpt-citations-content-study-469483)
19. [Reddit's Citations in ChatGPT Fall From 3.8% to 0.5%, Semrush](https://www.semrush.com/blog/reddits-citations-in-chatgpt-fall/)
20. [GEO: Generative Engine Optimization (Aggarwal et al., KDD 2024)](https://arxiv.org/abs/2311.09735)
