---
title: How to Get Cited by Perplexity AI
description: How to get cited by Perplexity AI: how it names brands and picks sources per prompt, authority vs relevance, dated studies and a reachability check.
keyword: cited by Perplexity AI
date: 2026-11-06
updated: 2026-11-06
written: 2026-10-01
author: Rankbox Team
tags: AI Search, Perplexity
---

To get cited by Perplexity AI, your page has to clear three hurdles: Perplexity's crawler must be able to fetch it, its index must hold a current copy, and one passage on it must answer the question better than the other candidates. Being named is a separate win. Perplexity often names brands it found on other people's pages, such as lists, reviews and Reddit threads, so a brand can be named without its own site being cited.

That split matters at Perplexity's scale. The company says people ask it [1.5 billion questions a month](https://www.perplexity.ai/hub/getting-started), and every answer shows numbered sources you can click. Those sources are concentrated. In Ahrefs' [September 2026 snapshot](https://ahrefs.com/blog/most-cited-domains-perplexity/) of more than 3.1 million US queries, Reddit, YouTube and Wikipedia held 48.7% of the citations that went to Perplexity's 50 most-cited sites.

This guide explains what it takes to be cited by Perplexity AI. It starts with how Perplexity names and cites brands, then walks through the retrieval layer that picks a source for each prompt. You'll get what Perplexity documents, what studies have observed, a ladder for finding where your page drops out, and a reachability check. For the full technical playbook, read our [Perplexity SEO guide](/ai-seo/perplexity).

## Key Takeaways

- Getting cited by Perplexity AI and getting named by it are two outcomes. A citation is a numbered link to your page. A mention is your brand's name in the answer text.
- Perplexity runs its own index of over 200 billion URLs. It splits pages into self-contained spans and reranks those spans for each question, so one strong passage can beat a stronger domain.
- Perplexity says its answer engine ranks sources "based on authority and relevance." Its architecture post links authority to which documents it keeps in fast storage, and relevance to how each passage is scored.
- Studies agree on a long tail. Reddit took 46.7% of the citations among Perplexity's top 10 domains in Profound's data, but only 6.6% of all its citations.
- Perplexity sells no placement. It phased out ads, and it says its shopping product cards aren't sponsored.
- Before a page can be cited by Perplexity AI, check reachability: PerplexityBot allowed in robots.txt, your CDN letting it through, and the answer in the raw HTML.
- Track rates, not single answers. In a 2026 study, two runs of the same Perplexity prompt within 24 hours had a source overlap of just 0.28 on a scale where 1 means identical.

## How Perplexity Mentions and Cites Brands

Every Perplexity answer has two layers. The text names things, including brands. The citations link to the pages the text was built from. Perplexity's guide tells users to ["highlight answer text to check the sources referenced,"](https://www.perplexity.ai/hub/getting-started) so each sentence can be traced to its sources.

Those two layers don't always line up. A "best invoicing tools" list may be the cited source, while the brands it lists are the ones named in the answer. Your own help article may be cited for a general fact, with no brand named at all. Our guide to [brand mentions in Perplexity](/blog/brand-mentions-in-perplexity) maps all four combinations and what causes each.

### Why lists drive so many brand names

In an August 2026 study of 460 B2B prompts, the tracking vendor Analyze AI [classified 115,843 citations](https://www.tryanalyze.ai/blog/state-of-ai-search-source-family-mix) by page type. For Perplexity, 35.4% went to brand websites and product pages, 34.4% to lists, comparisons and reviews, and 25.2% to editorial pages. On matched prompts, Perplexity named the brand being tracked in 41.7% of answers, against 32.3% for ChatGPT. The authors' explanation: one cited "top 10" article puts ten brand names in front of the model.

So there are two routes to being named. Your own page gets cited, or a page Perplexity trusts mentions you. A plan to get cited by Perplexity AI needs both.

### Mentions hold steadier than sources

The 2026 paper ["Don't Measure Once"](https://arxiv.org/abs/2604.07585) ran the same prompts repeatedly within 24 hours. Perplexity's source lists overlapped by a Jaccard score of 0.282, where 1 means identical. The sets of brands it named overlapped by 0.492. Sources rotate faster than names. That's why you track both, and why our guide to [tracking brand mentions in Perplexity](/blog/track-brand-mentions-in-perplexity) logs each one separately.

## What Perplexity Documents About Searching and Citing

Perplexity publishes more about its search stack than most AI vendors. Here is what its own pages say, as of October 2026.

### The answer engine

Its help center says Perplexity ["searches the internet in real-time,"](https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work) gathers information "from authoritative sources like articles, websites, and journals," and adds "numbered citations linking to the original sources." Pro Search runs [multiple searches](https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search) and shows "how the AI broke down your question." The Research mode performs "dozens of searches" and reads "hundreds of sources."

The breakdown is useful to you. Each sub-question Perplexity shows is a separate retrieval, and each one is a chance for a different page to win.

### The index and the ranking pipeline

Perplexity's [September 2025 architecture post](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api) describes the system behind both the app and its API. Every page cited by Perplexity AI passes through these six stages:

1. **Crawl scheduling.** A model decides when to index each URL, based on "the importance and likely update frequency" of that URL. The index tracks "over 200 billion unique URLs."
2. **Storage priority.** Documents kept in fast storage favor "authoritative domains" and "undercovered topics."
3. **Parsing.** Pages are split into "self-contained spans, each of which can be individually retrieved and ranked at query time." Sites heavy on lists and tables "may benefit from more formulaic parsing."
4. **Retrieval.** Keyword and semantic search run side by side and merge into one candidate set.
5. **Filtering.** Prefilters remove "clearly non-responsive or stale content."
6. **Ranking.** Fast scorers cut the set down, then cross-encoder rerankers make the final choice, at "both the document and sub-document levels." The rankers learn from the "millions of user requests" served each hour.

### What the API docs add

Perplexity's developer docs show what a source looks like as data. Each search result carries an `id`, the canonical `url`, a `snippet` described as ["excerpted text extracted from the page during search"](https://docs.perplexity.ai/docs/agent-api/tools/web-search), a publish `date` and a `last_updated` date. The same page says a question can be split into "several reformulated queries," and offers filters for recency and for publish or update dates.

Two caveats. First, the Sonar chat API is no longer supported. Perplexity's docs say ["Sonar Chat Completions support ended on September 27, 2026,"](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview) that old requests are being reformulated as Agent API requests, and that new projects should use the Agent API. Second, Perplexity's [API FAQ](https://docs.perplexity.ai/docs/resources/faq) says the API uses "the same search system as the UI with differences in configuration," so API results won't match the app exactly.

### Crawlers and blocked pages

Perplexity documents two bots on its [crawler page](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). `PerplexityBot` surfaces and links sites in search results and "is not used to crawl content for AI foundation models." `Perplexity-User` visits a page when a user's question needs it, and "generally ignores robots.txt rules." Its help center adds that for a page blocked in robots.txt, Perplexity ["may still index the domain, headline, and a brief factual summary."](https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt) Our [PerplexityBot user agent guide](/blog/perplexitybot-user-agent) covers the strings, IP lists and rules.

### Publishers and paid placement

Perplexity's [Publishers' Program](https://www.perplexity.ai/hub/blog/introducing-the-perplexity-publishers-program) launched in July 2024 with revenue sharing tied to planned ads. Those ads didn't last. [MacRumors reported](https://www.macrumors.com/2026/02/18/perplexity-abandons-ai-advertising/) in February 2026 that sponsored answers were phased out and executives had no plans to bring them back. The newer route is [Comet Plus](https://www.perplexity.ai/hub/blog/introducing-comet-plus), which shares subscription revenue with partner publishers on "human visits, search citations, and agent actions." Digiday reported an [80% share and a $42.5 million initial pool](https://digiday.com/media/how-perplexity-new-revenue-model-works-according-to-its-head-of-publisher-partnerships/). Perplexity doesn't say partner status changes which sources get cited, so don't plan on it.

### Documented, observed or unpublished

| Question                                  | Status as of October 2026                               | Source                   |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------ |
| Does Perplexity run its own index?        | Documented: 200B+ URLs                                  | Architecture post        |
| Does it rank passages, not whole pages?   | Documented: spans ranked at query time                  | Architecture post        |
| Does it filter stale pages?               | Documented, without a threshold                         | Architecture post        |
| Does it weigh authority?                  | Documented in general terms ("authority and relevance") | Instant Buy help article |
| Does a Google top-10 ranking help?        | Observed: 28.6% of citations rank top 10                | Ahrefs, 2025             |
| Can you submit URLs or request a recrawl? | No tool described in its help center or docs            | Help center, API docs    |
| Exact ranking factors and weights         | Not published                                           | None                     |

## Domain Authority vs Topical Relevance for Being Cited by Perplexity AI

Perplexity puts both words in one sentence. Its [Instant Buy help article](https://www.perplexity.ai/help-center/en/articles/10352906-what-is-instant-buy) says: "Just as our answer engine ranks sources based on authority and relevance, we rank product listings using similar criteria." It doesn't publish how the two are weighed.

The architecture post shows where each one acts. Authority shows up early: a URL's "importance" helps set how often it's indexed, and authoritative domains get priority in fast storage. Relevance shows up late, when each passage is scored against the reformulated query. A trusted domain stays current in the index. A relevant passage wins the slot.

### What the studies observed

| Study                                                                             | Date                       | Sample and method                                                                                 | Finding for Perplexity                                                                             |
| --------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Ahrefs](https://ahrefs.com/blog/most-cited-domains-perplexity/)                  | Sept 2026 snapshot         | Brand Radar; every domain cited across 3.1M+ US queries, all topics                               | Reddit 21.6%, YouTube 20.8%, Wikipedia 6.3% of top-50 citation share                               |
| [Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)        | Aug 2024 to June 2025 data | 680M citations across ChatGPT, AI Overviews and Perplexity                                        | Reddit 46.7% of top-10 share, 6.6% of all citations                                                |
| [Ahrefs](https://ahrefs.com/blog/ai-search-overlap/)                              | Aug 2025                   | 15,000 long-tail queries; cited URLs matched to Google's top 10                                   | 28.6% of cited URLs ranked top 10; other assistants averaged about 12%                             |
| [Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)  | July 2025                  | 16.975M cited URLs on 7 platforms; age since publication                                          | In-text citations averaged 1,166 days old, against 1,432 for organic results; ordered newest first |
| [Schulte et al.](https://arxiv.org/abs/2604.07585)                                | Apr 2026                   | 32 German-language prompts in 4 verticals, run daily for about 45 days, plus a 10-run repeat test | Lowest citation concentration of four engines (Gini 0.671); sources overlap 0.282 within 24 hours  |
| [Analyze AI](https://www.tryanalyze.ai/blog/state-of-ai-search-source-family-mix) | Aug 2026                   | 22,295 answers, 460 B2B prompts; citations classed by page type                                   | Brand sites 35.4%, lists 34.4%, editorial 25.2%, community 4.7%                                    |

Read together, the picture is consistent. A few giant sites take a big slice of Perplexity's attention across all topics. Inside any one niche, though, citations spread out more than on other engines, and pages that already rank in Google show up often. Authority helps you get into the pool. Relevance at the passage level decides which page gets cited by Perplexity AI.

One finding cuts against a common belief. Ahrefs found Perplexity's cited pages were younger than Google's results on average, yet still more than three years old. Fresh dates help when the topic changes. An old page that answers the question well can still be cited by Perplexity AI.

## The Retrieval Ladder: Find Where Your Page Drops Out

We call this diagnostic the Retrieval Ladder: six rungs a page climbs on its way to being cited by Perplexity AI. Each rung maps to a stage Perplexity documents. A page has to clear every rung below to reach the next one, so you diagnose from the bottom up.

| Rung            | What has to be true                        | How to check it yourself                                                    | Common failure                                                    |
| --------------- | ------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1. Fetchable    | PerplexityBot gets a 200 with your content | Server logs, verified against Perplexity's IP list                          | A firewall challenge or a robots.txt block                        |
| 2. Indexed      | Perplexity holds a current copy            | Search a phrase from the page with the API's domain filter set to your site | New page not crawled yet; content hidden behind JavaScript        |
| 3. Retrieved    | The page is a candidate for a sub-question | Log the API's `search_results` for your prompts                             | Wording doesn't match how the question is asked                   |
| 4. Passage wins | Your span beats the other candidates       | Compare your passage with the cited ones, side by side                      | Answer buried under a long intro; no numbers or dates             |
| 5. Cited        | Your URL appears as a numbered source      | Run the prompt in a clean session and read the source list                  | Another page covers the same point more directly                  |
| 6. Named        | Your brand appears in the answer text      | Highlight the sentence and check what it cites                              | Your page answers generically; lists that name rivals outrank you |

The API checks belong to a developer. Our guide to [Perplexity SEO tools](/blog/perplexity-seo-tools) includes a short script that logs which results were retrieved and which were cited. Without a developer, run rungs 1, 5 and 6 by hand and infer the middle from what wins.

### Read the ladder before you rewrite

It's tempting to start at rung 4 and rewrite the copy. Sometimes the page never reached rung 1. A rewrite can't fix a 403, and a perfect passage inside client-rendered HTML can't be cited by Perplexity AI if its crawler never sees the text. Check the bottom rungs first. They're quicker to fix and they block everything above.

If you want the one-page version of this work, our [30-day plan to get cited by Perplexity](/blog/how-to-get-cited-by-perplexity) takes a single page through every rung, day by day.

## A Reachability Check for Perplexity

Rung 1 fails silently. Nothing in Perplexity tells you a page was blocked, and a blocked page can't be cited by Perplexity AI however good it is. Run these five checks once, then after any CDN, firewall or robots.txt change.

1. **robots.txt.** Confirm no group blocks `PerplexityBot` on the paths you want cited. Perplexity says changes can take up to 24 hours to apply. Our [robots.txt tester](/tools/robots-txt-tester) shows which line decides each URL.
2. **Firewall and CDN.** Perplexity's crawler docs advise a rule that matches the user agent and the published IP ranges. On Cloudflare, the 15 September 2026 changes moved AI bots into new controls, and Cloudflare Radar didn't list Perplexity as a verified bot on 1 October 2026. Our [Cloudflare AI bot management guide](/blog/cloudflare-ai-bot-management) shows which settings reach PerplexityBot and Perplexity-User.
3. **Raw HTML.** Fetch the page without running JavaScript and search for your key sentence. If it's missing, the crawler sees an empty page. Our guide to [prerendering for AI crawlers](/blog/dynamic-rendering-prerendering-ai-crawlers) covers the fix for each framework.
4. **Logs.** Look for PerplexityBot fetching the URL after you publish, and for Perplexity-User hits, which mean a live question pulled the page. Paste a day of logs into our [AI crawler log analyzer](/tools/ai-crawler-log-analyzer), then verify heavy hitters against the IP list.
5. **Status and speed.** Perplexity-User fetches while a person waits. Timeouts, 429s and 5xx errors cost you that answer.

| Symptom                                 | Likely cause                                     | Where to dig deeper                                                              |
| --------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- |
| No PerplexityBot hits at all            | robots.txt block or firewall challenge           | [PerplexityBot user agent guide](/blog/perplexitybot-user-agent)                 |
| Hits, but 403 or challenge pages        | Bot protection treating Perplexity as unverified | [Cloudflare AI bot management](/blog/cloudflare-ai-bot-management)               |
| Hits with 200, but answers quote rivals | Content missing from raw HTML, or a weak passage | [Prerendering for AI crawlers](/blog/dynamic-rendering-prerendering-ai-crawlers) |
| Only Perplexity-User hits               | Page used live but not crawled often             | Link it from pages that change often                                             |

There's no shortcut around the crawler. Perplexity's help center and docs describe no URL submission form, and it isn't on [IndexNow's list](https://www.indexnow.org/searchengines.json) of participating engines as of October 2026. Discovery comes from its crawler and from links.

## Worked Example: Tallyfold Climbs the Ladder

Tallyfold is a fictional invoicing and payments app for agencies. Its rivals, Brindlework and Kestrelyn, are fictional too. Every number below is illustrative.

Tallyfold picks eight buyer questions and runs each three times in Perplexity's incognito mode: 24 answers. Its own pages are cited by Perplexity AI in 7 of them (29%), and its name appears in 6 (25%). Then it finds the highest rung each question reached.

| Question                                | Highest rung | What stopped it                                | Fix                                          |
| --------------------------------------- | ------------ | ---------------------------------------------- | -------------------------------------------- |
| Tallyfold pricing                       | 1            | A bot rule challenged PerplexityBot            | Allow the user agent plus IP list            |
| Tallyfold vs Brindlework                | 1            | Same rule                                      | Same fix                                     |
| Retainer billing software               | 2            | Plan table built by JavaScript                 | Server-render the table                      |
| How to chase late client payments       | 4            | Answer sat after 300 words of intro            | Lead with the answer and three steps         |
| Invoice approval workflow for agencies  | 4            | Rival guide had a table; Tallyfold's had prose | Add a step table with dated facts            |
| How long should agency payment terms be | 5            | Cited for a general fact, not named            | Fine: an educational question                |
| Best invoicing software for agencies    | 6            | Named via a review list, own page not cited    | Fair comparison page; update the list owner  |
| Kestrelyn alternatives                  | 6            | Named via a Reddit thread                      | Staff reply with facts; an alternatives page |

That's 2 + 1 + 2 + 1 + 2 = 8 questions. Three of them stall on the bottom two rungs, and their fixes are technical, not editorial. The writing fixes come after.

Six weeks later, Tallyfold reruns the same 24 answers. Its pages are cited in 13 (54%) and its name appears in 10 (42%). That looks like a 25-point gain in citations. With only 24 answers per round, though, the 95% margin of error on the difference is about ±27 points. The gain is promising, not proven. Tallyfold should run the panel twice more before it reports a win, as our [guide to measuring GEO](/blog/how-to-measure-geo) explains.

## Where Rankbox Fits

Rankbox doesn't track citations or brand mentions in Perplexity, and it doesn't manage robots.txt or firewalls. Use the free tools above for reachability, and the [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) for a set of prompts to run by hand.

Rankbox helps with rungs 3 and 4: having a page worth being cited by Perplexity AI because it answers the sub-questions Perplexity searches for. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask Perplexity, ChatGPT and Google, with model-estimated volume, difficulty and intent. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word articles with their sources cited. Articles reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### How do you get cited by Perplexity AI?

Let PerplexityBot fetch your page, serve the answer in plain HTML, and lead each section with a direct, dated answer to one sub-question. Perplexity ranks passages, not whole pages, so the clearest span wins. Then earn mentions on the lists, reviews and threads it already cites for your topic.

### How does Perplexity choose which sources to cite?

Pages cited by Perplexity AI survive three steps, per its 2025 architecture post: keyword and semantic retrieval from its own index, a filter that drops stale or off-topic pages, and passage reranking with cross-encoder models. Its help center says sources are ranked on "authority and relevance." Exact weights aren't published.

### Does domain authority matter to Perplexity?

Partly. Perplexity gives documents from "authoritative domains" priority in fast storage, and Ahrefs found 28.6% of its cited URLs ranked in Google's top 10. But to be cited by Perplexity AI, a passage still has to win on relevance, and in a 2026 study its citations spread across more domains than other engines did.

### Can you pay to be cited by Perplexity AI?

No. Perplexity phased out its ads, and executives said in February 2026 they don't plan to return to them. Its product cards "aren't sponsored," and advertisers can't pay to list products. Comet Plus pays publishers for citations but isn't described as a ranking factor.

### Why does Perplexity mention my brand without citing my site?

Because another page it cited named you. Lists, reviews and Reddit threads often name several brands, and Perplexity cites the list rather than each brand's site. To be cited too, publish a page that answers the same question directly.

### How long does it take to get cited by Perplexity AI?

Perplexity doesn't publish a timeline. Robots.txt changes take up to 24 hours. New or rewritten pages wait for a recrawl, which Perplexity schedules by each URL's importance and how often it changes. Plan to re-test after three to six weeks.

## References

1. [Getting started with Perplexity, Perplexity](https://www.perplexity.ai/hub/getting-started)
2. [How does Perplexity work?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work)
3. [What is Pro Search?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search)
4. [What is Instant Buy?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10352906-what-is-instant-buy)
5. [How does Perplexity follow robots.txt?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt)
6. [Architecting and evaluating an AI-first search API, Perplexity](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api)
7. [Perplexity Crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
8. [Web Search tool, Perplexity Docs](https://docs.perplexity.ai/docs/agent-api/tools/web-search)
9. [Migrate from Sonar to the Agent API, Perplexity Docs](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview)
10. [Frequently Asked Questions, Perplexity Docs](https://docs.perplexity.ai/docs/resources/faq)
11. [Introducing the Perplexity Publishers' Program, Perplexity](https://www.perplexity.ai/hub/blog/introducing-the-perplexity-publishers-program)
12. [Introducing Comet Plus, Perplexity](https://www.perplexity.ai/hub/blog/introducing-comet-plus)
13. [How Perplexity's new revenue model works, Digiday](https://digiday.com/media/how-perplexity-new-revenue-model-works-according-to-its-head-of-publisher-partnerships/)
14. [Perplexity abandons AI advertising strategy over trust worries, MacRumors](https://www.macrumors.com/2026/02/18/perplexity-abandons-ai-advertising/)
15. [The 50 Most-Cited Websites in Perplexity (September 2026), Ahrefs](https://ahrefs.com/blog/most-cited-domains-perplexity/)
16. [AI Platform Citation Patterns, Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)
17. [AI search overlap with Google and Bing, Ahrefs](https://ahrefs.com/blog/ai-search-overlap/)
18. [Do AI assistants prefer to cite fresh content?, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
19. [Don't Measure Once: Measuring Visibility in AI Search (Schulte, Bleeker and Kaufmann, 2026)](https://arxiv.org/abs/2604.07585)
20. [State of AI search: source family mix, Analyze AI](https://www.tryanalyze.ai/blog/state-of-ai-search-source-family-mix)
