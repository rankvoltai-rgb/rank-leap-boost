---
title: How ChatGPT Search Decides Citations: What OpenAI Documents and What Tests Show
description: How ChatGPT search decides what to cite: when it searches, how it rewrites queries, where pages come from, how Sources work, and what tests found.
keyword: ChatGPT search
date: 2026-10-08
updated: 2026-10-08
written: 2026-09-29
author: Rankbox Team
tags: AI Search, ChatGPT
---

ChatGPT search decides citations in two stages. First it gathers pages: it rewrites your question into one or more targeted queries, sends them to its search partners and its own crawled index, and gets back a pool of results. Then the model writes the answer and cites the pages it drew on, using what OpenAI calls "multiple factors intended to help users find relevant, reliable information," which it doesn't list.

So OpenAI documents the plumbing but not the scoring. Independent tests fill part of the gap. One of the largest, [Ahrefs' April 2026 study of 1.4 million prompts](https://ahrefs.com/blog/why-chatgpt-cites-pages/), found ChatGPT cited only about half of the pages it retrieved, and the cited ones had titles closer in meaning to the sub-queries it searched. That's a correlation, not a rule, and this post keeps the two kinds of evidence apart.

The same pipeline sits behind other doors. When Siri hands a question to ChatGPT on an iPhone, it goes to this ChatGPT, as our [guide to how Apple Intelligence routes Siri queries to ChatGPT](/blog/apple-intelligence-siri-chatgpt) explains. For crawler setup, see our [ChatGPT SEO guide](/ai-seo/chatgpt).

## Key Takeaways

- ChatGPT search runs automatically when a question needs current information, or when you pick the Search tool. Answers without a search carry no citations.
- OpenAI says ChatGPT rewrites your question into targeted queries for its search providers, and names Microsoft and Shopify among them.
- A page must allow OAI-SearchBot to appear in ChatGPT search answers. Opted-out pages can still show as bare navigational links.
- Inline citations and the Sources panel are different lists. OpenAI's API docs say the full source list is often longer than the citations.
- In Ahrefs' 2026 study, ChatGPT cited about half the pages it retrieved, and cited pages had titles that matched its sub-queries more closely.
- Ads and product cards run on separate systems. OpenAI says ads don't influence answers.

## When ChatGPT Search Runs at All

A citation can only appear if ChatGPT searched. OpenAI's [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says ChatGPT "may search the web automatically when your question would benefit from current information." You can also force it: open the tools menu and choose Search, type "/" and pick Search, or regenerate an answer with "Search the web." Web search works on every plan, including Free and logged-out use, and in voice conversations when you ask for it.

That first decision explains a lot of missing citations. A question about a stable fact ("what is double-entry bookkeeping?") may be answered from the model's training, with no sources at all. A question about prices, reviews, news or "best X in 2026" needs current facts, which is the case OpenAI's wording describes. Ahrefs noted in its [August 2025 overlap study](https://ahrefs.com/blog/ai-search-overlap/) that ChatGPT and Gemini "don't always link out" and that their citations depend on the query. In the 2026 paper ["Don't Measure Once"](https://arxiv.org/html/2604.07585v1), just 42.2% of repeated ChatGPT runs produced any citation at all, the lowest of the four engines tested. The authors link that to ChatGPT skipping web search for definition-style prompts.

**Evidence grade:** OpenAI documents that search is automatic or manual. It doesn't document the threshold for "would benefit from current information."

## How ChatGPT Search Rewrites Your Question

ChatGPT doesn't send your words to a search engine as typed. OpenAI's help page says that when ChatGPT search partners with other providers, it "typically rewrites your query into one or more targeted queries." Its example turns a researcher's question about drugs that target CCR8 into "CCR8 immunotherapy drug development 2025," then a narrower follow-up, "CHS-114 conference 2025."

Three inputs shape the rewrite, per OpenAI:

1. **Your words**, turned into short keyword-style searches.
2. **Your rough location**, estimated from your IP address. "Good restaurants near me" becomes "top restaurants San Francisco." OpenAI says it doesn't send your IP address or account details to the search provider.
3. **Your saved memories**, if memory is on. A user who once said they're vegan gets "good vegan restaurants San Francisco."

How many sub-queries run has changed a lot over time. Nectiv measured an average of 7.61 per prompt in [August 2026](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study), up from 2.17 a year earlier. Our [ChatGPT rank tracker guide](/blog/chatgpt-rank-tracker) covers what this fan-out means for measurement, and our glossary defines [query fan-out](/glossary/query-fan-out). The point here is simpler: you're competing for the sub-queries, not for the prompt the user typed.

## Where ChatGPT Search Gets Its Candidate Pages

Once the queries exist, ChatGPT needs results. OpenAI names four kinds of input across its pages, each with a different control.

| Source                       | What OpenAI says                                                                                                                             | What controls it                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Third-party search providers | ChatGPT "sometimes partners with other search providers"; Microsoft and Shopify are listed                                                   | Being indexed by those providers           |
| OpenAI's own crawl           | [OAI-SearchBot](https://developers.openai.com/api/docs/bots) "is used to surface websites in search results in ChatGPT's search features"    | robots.txt and your CDN                    |
| Content partners             | ChatGPT search uses "content provided directly by our partners," per its [launch post](https://openai.com/index/introducing-chatgpt-search/) | Publisher agreements                       |
| Live fetches                 | ChatGPT-User visits a page for a user's request; it's "not used to determine whether content may appear in Search"                           | Firewall rules; robots.txt "may not apply" |

Two details matter most. First, OpenAI's crawler page says sites that opt out of OAI-SearchBot "will not be shown in ChatGPT search answers, though can still appear as navigational links." OpenAI's [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) adds that in its Atlas browser, a disallowed page found through a search provider or another page may still show as a bare link and title. A `noindex` tag stops that, but only if the crawler is allowed to read it. Robots.txt changes take about 24 hours to take effect.

Second, OpenAI keeps some kind of index of its own. Its [API web search guide](https://developers.openai.com/api/docs/guides/tools-web-search) offers a mode that uses "only cached/indexed results" instead of live fetching. That's the developer API, not the ChatGPT app, but it shows OpenAI's web search can run from stored results, not only live lookups.

Studies suggest the pool is uneven. In Ahrefs' 2026 data, URLs that came through ChatGPT's general search channel were cited 88.5% of the time, while Reddit URLs pulled through a separate channel were cited 1.9% of the time. Reddit made up 67.8% of all retrieved-but-uncited URLs. ChatGPT reads Reddit a lot, it seems, but rarely credits it.

## How Citations and the Sources Panel Are Shown

"Cited by ChatGPT" can mean three different things, and trackers don't always separate them.

- **Inline citations** sit next to a claim in the answer. OpenAI says you can select one to open the source, and on desktop web you can hover to preview it.
- **The Sources panel** opens from a Sources button under the answer. OpenAI says it shows "cited sources and other relevant links," so it lists more than the inline citations.
- **Images and maps** can link to their source pages. On iOS and Android, local answers may include a map.

OpenAI's API docs make the split explicit. Inline citations "show only the most relevant references," while a separate sources field "returns the complete list of URLs the model consulted." The docs add that "the number of sources is often greater than the number of citations." The ChatGPT app may differ from the API, but the principle matches what the help page describes.

One change in 2026 muddies the panel further. Since [5 May 2026](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), the Sources icon can also show "memory sources": saved memories, past chats and custom instructions that shaped a personalized answer. Those aren't web pages, and a shared chat doesn't show them.

Ads and shopping sit outside all of this. OpenAI's [ads help page](https://help.openai.com/en/articles/20001047-ads-in-chatgpt) says "Ads do not influence ChatGPT's answers" and that ads appear below the response, labeled as sponsored. Its [shopping help](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search) says product results "are selected independently" and aren't ads.

## What Independent Tests Found About Which Pages Get Cited

OpenAI publishes no citation factors beyond "relevant, reliable information." Everything below is correlation from third-party studies. Each used different prompts, dates and methods, so read them as patterns, not as rules. Our guide to [the seven ChatGPT ranking factors](/blog/chatgpt-ranking-factors-ai-search-placement) grades each claimed factor by the strength of its evidence.

| Study                                                                                                  | Date and sample                               | Finding                                                                                                                         |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [Ahrefs, why ChatGPT cites pages](https://ahrefs.com/blog/why-chatgpt-cites-pages/)                    | April 2026, 1.4 million prompts               | About half of retrieved URLs cited; cited titles closer to the sub-queries; readable URL slugs cited 89.8% of the time vs 81.1% |
| [Ahrefs, AI search overlap](https://ahrefs.com/blog/ai-search-overlap/)                                | August 2025, 15,000 prompts                   | 8% of ChatGPT's inline citations ranked in Google's top 10 for the prompt, and 8.1% in Bing's                                   |
| [Ahrefs, freshness](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)            | July 2025, 17 million citations               | ChatGPT cited the freshest pages of any platform tested, 958 days old on average                                                |
| [Ahrefs, "best" lists](https://ahrefs.com/blog/best-lists-research/)                                   | December 2025, 750 prompts                    | "Best X" lists were 43.8% of cited page types for top-of-funnel questions                                                       |
| [Peec AI, citation rates](https://peec.ai/blog/citation-rate-benckmarks-from-over-1-million-citations) | February 2026, 1 million+ citations           | Listicles were about a fifth of URLs, and 52% of them were cited more than twice per answer                                     |
| [Schulte et al., "Don't Measure Once"](https://arxiv.org/abs/2604.07585)                               | January to March 2026, 4 campaigns, 4 engines | Only 34% to 42% of cited sources overlapped from one day to the next                                                            |

### Titles and URLs do early work

The Ahrefs 2026 study leans on outside research suggesting each search result reaches the model with a title, a short snippet and a URL, and the model picks which pages to open from those. OpenAI hasn't confirmed this. But it fits the numbers: cited pages scored 0.602 on title-to-prompt similarity against 0.484 for skipped ones, and 0.656 against the best-matching sub-query. Ahrefs measured similarity with open-source embedding models as a stand-in, since ChatGPT's scoring is private.

### Ranking helps less than you'd think

Fewer than 1 in 10 ChatGPT citations in the 2025 overlap study ranked in Google's or Bing's top 10 for the user's prompt. One likely reason is the rewriting step: ChatGPT looks for pages that match its own sub-queries, not your keyword. That's an inference, not something OpenAI states.

### Fresh, but not brand new

Across all its citations, ChatGPT skews toward newer pages than Google's results do. Yet within a single prompt, Ahrefs found the newest retrieved pages were often the ones left uncited, and the median cited page was about 500 days old. For news questions, where relevance scores were close, newer pages won.

## The Citation Path Check: Trace One Page Through Five Checkpoints

When a page you expected isn't cited, don't guess. Walk it through the pipeline in order and stop at the first checkpoint it fails. We call this the Citation Path Check. It's a diagnosis tool; for the fixes themselves, our playbook on [how to get cited by ChatGPT](/blog/how-to-get-cited-by-chatgpt) goes step by step.

| #   | Checkpoint  | Question to ask                                   | How to test                                            | Evidence grade        |
| --- | ----------- | ------------------------------------------------- | ------------------------------------------------------ | --------------------- |
| 1   | Searched    | Did ChatGPT search for this prompt?               | Look for citations or a Sources button                 | OpenAI documents      |
| 2   | Eligible    | Can OAI-SearchBot crawl the page?                 | Robots tester, then look for OAI-SearchBot in logs     | OpenAI documents      |
| 3   | Retrieved   | Is the page findable for the likely sub-queries?  | Search the sub-queries in Bing and note where you rank | Partly documented     |
| 4   | Shortlisted | Do the title and URL match the sub-query?         | Compare your title with the queries                    | Correlated in studies |
| 5   | Cited       | Does the opening state the fact the answer needs? | Read the first two sentences alone                     | Inference             |

### A worked example with Tallyfold

Tallyfold is a fictional invoicing app for agencies; the pages and numbers below are made up for the example. A buyer asks ChatGPT, "How much does Tallyfold cost for a five-person agency?" Across 10 runs, ChatGPT cites a review site 7 times and Tallyfold's own pricing page twice. The team traces the pricing page:

1. **Searched: pass.** All 10 answers show a Sources button.
2. **Eligible: pass.** Logs show OAI-SearchBot fetching `tallyfold.example/plans` every few days.
3. **Retrieved: pass.** The page ranks third in Bing for "Tallyfold pricing."
4. **Shortlisted: fail.** The page title is "Plans," and the URL says `/plans`. The likely sub-query is "Tallyfold pricing per user 2026." The review site's title is "Tallyfold Pricing 2026: Cost Per User Explained."
5. **Cited: fail.** The page opens with "Simple plans for growing teams," and the per-user price sits in a table image with no text version.

The fix targets checkpoints 4 and 5: retitle the page "Tallyfold Pricing: Plans and Cost Per User," add a `/pricing` URL that redirects from `/plans`, and open with one sentence stating the price for five users in text. Then rerun the same 10 prompts after a few weeks. A move from 2 to 5 citations out of 10 would be encouraging, but 10 runs is a small sample; our guide to [measuring GEO](/blog/how-to-measure-geo) explains how many runs you need before a change is real.

Rankbox can help with checkpoint 5 on new pages. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts source-backed articles that open with a direct answer. It doesn't track ChatGPT citations or fix crawler access, so pair it with the free [robots.txt tester](/tools/robots-txt-tester). The Business plan is $49.50 a month; see [pricing](/pricing).

## Frequently Asked Questions

### How does ChatGPT search choose its sources?

ChatGPT search rewrites your question into targeted queries, gathers results from its search providers and its own crawl, then cites the pages it drew on. OpenAI says it ranks results using several factors aimed at relevant, reliable information, but it doesn't publish them. Studies link citations to titles that match its sub-queries.

### Does ChatGPT search use Bing?

Partly. OpenAI says ChatGPT search sometimes works with third-party search providers and lists Microsoft among them. It also runs its own crawler, OAI-SearchBot, and says a site must allow that crawler to be eligible. So Bing is one input, not the whole index.

### Why does ChatGPT cite some pages but not others?

It retrieves more pages than it cites. In Ahrefs' 2026 study, about half of retrieved URLs were cited, and cited pages had titles closer to ChatGPT's sub-queries. Pages can also miss out because the answer didn't search at all or the crawler was blocked.

### What is the difference between citations and sources in ChatGPT?

Citations are the links placed next to specific claims in the answer. The Sources panel lists those plus other relevant links ChatGPT consulted. OpenAI's API docs say the full source list is often longer than the citations.

### Do ads affect ChatGPT search citations?

No, according to OpenAI. Its ads help page says ads run on separate systems, appear below the answer labeled as sponsored, and don't influence ChatGPT's responses. Product results in shopping answers are also selected independently of ads.

### Does Siri use ChatGPT search?

Only when you send a question to ChatGPT. On iOS 27 with Siri AI, Apple says a request reaches ChatGPT only after you ask for ChatGPT. Neither Apple nor OpenAI says whether those requests run a web search, so the rules above apply when one does.

## References

1. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
2. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
3. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
4. [Web search tool guide, OpenAI API docs](https://developers.openai.com/api/docs/guides/tools-web-search)
5. [Introducing ChatGPT search, OpenAI](https://openai.com/index/introducing-chatgpt-search/)
6. [ChatGPT release notes, OpenAI Help Center](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
7. [Ads in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)
8. [Shopping with ChatGPT search, OpenAI Help Center](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search)
9. [Why ChatGPT cites one page over another, Ahrefs](https://ahrefs.com/blog/why-chatgpt-cites-pages/)
10. [Only 12% of AI cited URLs rank in Google's top 10, Ahrefs](https://ahrefs.com/blog/ai-search-overlap/)
11. [AI assistants prefer to cite fresher content, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
12. [Do self-promotional "best" lists boost ChatGPT visibility?, Ahrefs](https://ahrefs.com/blog/best-lists-research/)
13. [Citation rate benchmarks from over 1 million AI citations, Peec AI](https://peec.ai/blog/citation-rate-benckmarks-from-over-1-million-citations)
14. [ChatGPT tripled its fan-out queries, Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)
15. [Don't Measure Once: Measuring Visibility in AI Search (Schulte et al., 2026)](https://arxiv.org/abs/2604.07585)
16. [Turn on ChatGPT on iPhone, Apple Support](https://support.apple.com/guide/iphone/turn-on-chatgpt-iph00fd3c8c2/ios)
