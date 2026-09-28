---
title: How to Benchmark Website Performance Against Competitors in AI Search
description: Benchmark website performance against competitors in AI search: which rival pages get cited, citation share by domain and page type, gaps and access checks.
keyword: website performance
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Measurement
---

To benchmark website performance against competitors in AI search, run one set of buyer prompts, record every URL the answers cite, and compare sites: how much of the citation pool each domain wins, which of its pages win it, and which page types your rivals have that you don't. Then check whether crawler access or technical problems explain the gaps before you write a single new page.

This benchmark measures website performance, not brand performance. A brand benchmark asks how often answers name you. A website benchmark asks which pages AI engines actually read and quote, yours or your rivals'. The two metrics at its core, Citation Share and Citation Rate, are defined with formulas in our [GEO Metrics Framework](/blog/geo-metrics-framework). For brand baselines over time and the smallest gap you can trust, see [how to benchmark AI search performance](/blog/how-to-benchmark-ai-search-performance).

Why pages matter so much: engines now go looking for them. In a 2026 study of about 4,000 prompts, [Nectiv found](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study) that ChatGPT ran 7.61 searches per prompt, up from 2.17, and 64% of them used the `site:` operator to search specific official sites. When an engine searches your rival's domain directly, the pages it finds there set the bar for your own website performance.

## Key Takeaways

- Website performance in AI search is best compared with two numbers per domain: Citation Share (its slice of all cited URLs) and Citation Rate (the share of answers that link to it).
- Log every cited URL, not just your own. Your rivals' cited pages are the free half of the benchmark.
- Tag each cited page by type. A rival that wins citations with comparison or docs pages you don't have shows you exactly what to build.
- Check access before you compare. Rankbox's census found OAI-SearchBot blocked by 28.78% of news sites but 1.28% of software and SaaS sites, so a rival's low score can be a robots.txt choice.
- Website performance also depends on technical health. Run the same checks on both sites: robots.txt per bot, firewall challenges, text in raw HTML, indexing in Google and Bing, and visible update dates.
- Benchmark each engine on its own. Page types that win in ChatGPT may not win in Google AI Mode or Perplexity.

## What a Website Performance Benchmark Compares

Five numbers make up a website performance benchmark. All but the last come from the same set of AI answers, so one round of prompt runs fills in every rival at once.

| Metric | What it counts, per domain | What it tells you |
| --- | --- | --- |
| Citation Share (CS) | Its cited URLs ÷ all cited URLs in the panel | Its slice of the sources AI answers rely on |
| Citation Rate (CR) | Answers linking to it ÷ all answers | How often it earns at least one source slot |
| Unique cited pages | Distinct URLs on the domain that were cited | Whether wins come from one page or many |
| Page-type share | Its citations by page type ÷ its citations | Which kinds of page do the winning |
| Access status | Whether each AI search bot may crawl it | Whether the domain is even in the race |

Citation Share is the number to lead with. It's the site-level cousin of share of voice, and Microsoft uses the same idea in Bing Webmaster Tools, where [Citation Share](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare) is "the percentage of citations attributed to your site out of all citations shown across all sites for that same grounding query." The [framework's Citation Share entry](/blog/geo-metrics-framework) has the full formula and a worked example. Our [AI citation glossary entry](/glossary/ai-citation) explains how a citation differs from a mention.

## Collect the Citation Data

You can gather the data for a website performance benchmark by hand. It takes a few hours the first time and less after that.

1. **Pick the domains to compare.** Take two to four direct rivals. Then add the third-party sites that keep showing up as sources in your category, such as review sites, since they compete with you for the same slots.
2. **Write 30 unbranded buyer prompts.** Mix problem questions, "best tool for" questions and comparisons. Leave every brand name out. The free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) drafts 30 from your category and a rival.
3. **Run each prompt at least twice per engine.** Use a clean session from the same location every time. AI answers vary between runs, so one pass isn't a benchmark.
4. **Copy every cited URL.** In ChatGPT, [OpenAI says](https://help.openai.com/en/articles/9237897-chatgpt-search) you can "select Sources, when available, to view cited sources and other relevant links." Perplexity numbers its sources under each answer. Paste one row per URL: date, engine, prompt, run, URL, domain.
5. **Tag each URL with a page type.** Use a short fixed list: homepage, pricing, comparison or alternatives, integrations and docs, how-to guide, listicle, review page, forum thread.

### Add the first-party reports for your own site

Google and Microsoft report part of this for your domain, which helps you check your panel against a larger sample. Bing's [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) shows total citations, cited pages and "citation counts for specific URLs from your site" across Copilot and AI summaries in Bing. Google's [Search Console report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) shows how often your URLs appeared in AI Overviews and AI Mode. Both cover your own site. Microsoft even notes that Citation Share "does not expose competitor domains," so for rivals' pages the prompt panel is your source.

### When a tracker saves time

Trackers run the prompts on a schedule and collect the cited URLs for you. [Peec AI's](https://docs.peec.ai/understanding-sources) Gap Analysis "highlights sources where your competitors appear but your brand does not," and its Starter plan was $95 a month for 50 prompts on its [pricing page](https://peec.ai/pricing), as listed on 28 September 2026. Ahrefs' [Brand Radar](https://ahrefs.com/brand-radar) includes a Cited pages report, with its AI Visibility Index listed at $199 a month and custom prompts from $50 a month on the same date. Google's reminder applies to all of them: ["No third-party tool has access to our internal ranking or AI systems."](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) Trackers watch answers the way your panel does, at larger scale.

## The Domain Citation Ledger: A Worked Example

The Domain Citation Ledger is Rankbox's one-sheet format for benchmarking website performance: one row per domain, then one row per page type for you and your strongest rival. Here it is for Plannora, a made-up project management tool, against a made-up rival, Loopcraft, a third made-up brand, Taskwell, and a made-up review site, stackreview.co. The panel is 30 prompts in ChatGPT and Perplexity, run twice each: 120 answers citing 744 URLs in total. All numbers are illustrative.

### Sheet 1: citation share and rate by domain

| Domain | Cited URLs | Citation Share | Answers linking it | Citation Rate |
| --- | --- | --- | --- | --- |
| loopcraft.ai | 97 | 13.0% | 46 | 38.3% |
| stackreview.co | 71 | 9.5% | 52 | 43.3% |
| Taskwell's site | 44 | 5.9% | 29 | 24.2% |
| plannora.io | 29 | 3.9% | 18 | 15.0% |
| All other domains | 503 | 67.6% | n/a | n/a |

Loopcraft's site wins more than three times Plannora's share of sources. The review site is linked in more answers than any vendor, which makes it a target for Plannora's outreach, not just a rival.

### Sheet 2: which page types win the citations

| Page type | loopcraft.ai | plannora.io |
| --- | --- | --- |
| Comparison and alternatives pages | 31 (32.0%) | 0 (0.0%) |
| Integration and docs pages | 24 (24.7%) | 0 (0.0%) |
| Pricing page | 17 (17.5%) | 3 (10.3%) |
| How-to guides | 16 (16.5%) | 18 (62.1%) |
| Homepage | 9 (9.3%) | 8 (27.6%) |
| **Total** | **97** | **29** |

The ledger explains the gap. More than half of Loopcraft's citations (55 of 97) come from two page types Plannora doesn't have at all. Plannora's how-to guides hold their own, with 18 citations to Loopcraft's 16. Its pricing page is the odd one out: it exists but earns 3 citations to Loopcraft's 17. That's a flag for a technical check, covered below.

### Reading the ledger

1. **Taskwell's number is an access story.** All 44 of its citations came from ChatGPT and none from Perplexity. Its robots.txt blocks PerplexityBot, so Plannora compares with Taskwell in ChatGPT only, where Taskwell holds 44 of 402 cited URLs, or 10.9%.
2. **Missing page types come first.** Comparison pages and integration docs are where the citations are and where Plannora has nothing.
3. **Existing pages that underperform come second.** The pricing page gets a technical check before any rewrite.

## Find the Content Gaps

Content-gap analysis is where a website performance benchmark turns into a to-do list. It asks a simple question: which of your rivals' cited pages have no counterpart on your site? Sheet 2 gives you the page types. Now go one level down, to the URLs.

1. **List each rival's cited URLs** with their citation counts, sorted from most to least.
2. **Match each one to your closest page.** Write the URL, or "none."
3. **Score the gaps.** A rival page with many citations and no match on your site goes to the top.
4. **Check which prompts pulled each rival page.** That tells you what the new page must answer in its first lines.
5. **Re-check by engine.** Different engines reward different page types.

That last step matters because engines differ. In [Peec's study of over 1 million citations](https://peec.ai/blog/citation-rate-benckmarks-from-over-1-million-citations), published in February 2026, listicles made up just under a fifth of the URLs ChatGPT used, and 52% of them landed in its top citation bucket. Google AI Mode showed no favourite page type and tended "to prefer official sources, such as brand websites and their product and category pages." A gap that costs you in one engine may not matter in another.

Some gaps sit on other sites. If review sites or forum threads win a big share, the answer is presence there: a listing, an update to wrong facts, or a genuine reply. For the writing side of new pages, see our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search).

## Compare Crawl Access and Technical Health

Before you blame content, check whether both sites can be read. Website performance in AI search starts with access, and a rival's robots.txt is public.

### Crawl access

Each engine's search crawler decides whether a site's text can appear. OpenAI says sites that opt out of OAI-SearchBot ["will not be shown in ChatGPT search answers, though can still appear as navigational links."](https://developers.openai.com/api/docs/bots) Perplexity says PerplexityBot is ["designed to surface and link websites in search results on Perplexity."](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) Anthropic says turning off Claude-SearchBot ["may reduce your site's visibility and accuracy in user search results."](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

How often do sites block? Rankbox's [AI Bot Crawler Census](/blog/ai-bot-crawler-census) of 21,353 sites found: "OAI-SearchBot is blocked by 28.78% of news sites, 3.54% of retailers and 0.81% of the Fortune 500." Among software and SaaS sites, the rate was 1.28%. The census adds: "Only 14.1% of e-commerce sites fully block at least one AI bot, against 62.2% of news sites. The Fortune 500 sits at 3.8%, software and SaaS companies at 7.0%." It also found: "A quarter of e-commerce sites (25.1%) wouldn't serve robots.txt to the census crawler at all." For those sites, a firewall may make the call before robots.txt does.

### The technical check table

Run the same checks on your site and on each rival. Most can be done from the outside.

| Check | On your site | On a rival's site |
| --- | --- | --- |
| Search bots allowed in robots.txt | Test each token with the [robots.txt tester](/tools/robots-txt-tester) | Read their /robots.txt for OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot and Bingbot |
| No firewall challenge | Look for 403s to AI user agents in your logs; see [the Cloudflare challenge trap](/blog/cloudflare-challenge-trap) | Can't see their logs; a missing robots.txt is a hint |
| Key text in raw HTML | View source and find your main answer sentence | `curl` the page and search for its price or answer |
| Indexed in Google and Bing | Search Console and Bing Webmaster Tools | Search `site:` plus the page's URL in both engines |
| Visible freshness | A "last updated" date on key pages | Note their dates on the pages that beat yours |

The raw-HTML check catches a common problem. [Vercel's crawler analysis](https://vercel.com/blog/the-rise-of-the-ai-crawler) found that "none of the major AI crawlers currently render JavaScript," naming OpenAI's crawlers, ClaudeBot and PerplexityBot, while Gemini renders through Googlebot. In the worked example, this is where Plannora's pricing problem turns up: its price table loads by script, so the raw HTML has no prices. Loopcraft's prices sit in plain HTML. The fix comes before any rewrite.

For a quick scan of one URL, the free [AI search readiness check](/tools/ai-search-readiness-check) tests 12 AI-readiness signals. For site-wide crawler and CDN fixes, see our guide to [optimizing a website for ChatGPT and Perplexity](/blog/optimize-website-for-chatgpt-and-perplexity).

## Where Rankbox Fits

Rankbox doesn't track AI citations today, so it won't benchmark website performance for you. Run the panel by hand or with one of the trackers above. Where Rankbox helps is closing the gaps the ledger finds. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI in your category, so your new comparison and docs pages answer the prompts rivals win. The [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles that reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### How do I see which competitor pages AI engines cite?

Run unbranded buyer prompts in each engine and copy every cited URL from the answer's sources. ChatGPT shows them under Sources and Perplexity numbers them. Trackers such as Peec AI and Ahrefs Brand Radar collect cited pages on a schedule for a monthly fee.

### What is a good citation share in AI search?

There is no universal benchmark. Citation share depends on your prompts, engines and rivals. Compare it with the domains that answer the same prompts, and watch whether your share grows between periods. A share that beats your direct rivals is a strong result.

### Can Bing Webmaster Tools show competitor citations?

No. Microsoft says its Citation Share metric "does not expose competitor domains." The AI Performance report covers your own site: total citations, cited pages, grounding queries and your share of citations for each query. To see which other domains were cited, use a prompt panel or a tracker.

### How often should I benchmark website performance in AI search?

Run the prompt panel every week and pool the results into a monthly benchmark. Re-check rivals' robots.txt and your page-type gaps each quarter, and take a new baseline after any big change to your site's access or structure.

### Why does a competitor get cited when my page ranks higher on Google?

AI engines search for narrower follow-up questions than the one typed, and ChatGPT often searches official sites directly. A rival's page may answer that sub-question more directly, or your page may hide its answer in scripts that AI crawlers don't run.

### Does blocking AI crawlers hurt website performance in AI search?

Blocking a search crawler does. OpenAI says sites that opt out of OAI-SearchBot won't be shown in ChatGPT search answers, apart from navigational links. Blocking a training-only bot such as GPTBot is a separate choice that OpenAI handles independently.

## References

1. [ChatGPT tripled fan-out queries: data study, Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)
2. [New AI visibility insights in Bing Webmaster Tools, Microsoft Bing](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare)
3. [Introducing AI Performance in Bing Webmaster Tools, Microsoft Bing](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
4. [Introducing Search generative AI performance reports in Search Console, Google Search Central](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
5. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
6. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
7. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
8. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
9. [What does a good citation rate look like?, Peec AI](https://peec.ai/blog/citation-rate-benckmarks-from-over-1-million-citations)
10. [Understanding sources, Peec AI Docs](https://docs.peec.ai/understanding-sources)
11. [Pricing, Peec AI](https://peec.ai/pricing)
12. [Brand Radar, Ahrefs](https://ahrefs.com/brand-radar)
13. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
14. [Optimizing your website for generative AI features, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
