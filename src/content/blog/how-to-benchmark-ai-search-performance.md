---
title: How to Benchmark AI Search Performance
description: How to benchmark AI search performance against your baseline and your rivals, engine by engine, with five metrics, panel sizes and a worked example.
keyword: AI search performance
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Measurement
---

To benchmark AI search performance, run one fixed panel of buyer prompts for your brand and two or three rivals, record five numbers for each engine, and repeat the same panel on a set schedule. The five numbers are visibility rate, citation rate, share of voice, AI referral sessions and crawl coverage. Your first run is the baseline, and every later run is compared with it, with your rivals, and engine by engine.

Start with access, because it sets the ceiling. A site that blocks an engine's search crawler can't win that engine with its own text. In Rankbox's [AI Bot Crawler Census of 21,353 sites](/blog/ai-bot-crawler-census), 28.78% of top news sites fully block OAI-SearchBot, the crawler behind ChatGPT search, while only 1.28% of software and SaaS sites do. Before you compare yourself with a rival in ChatGPT, check that you are both in the race.

This post is about comparing AI search performance: which numbers to put side by side, how big a gap has to be before it's real, and how to read it. For collecting each number in depth, from logging answers to the control-prompt test, see our guide to [measuring GEO](/blog/how-to-measure-geo).

## Key Takeaways

- A benchmark of AI search performance has three reference points: your own baseline, named rivals on the same prompts, and each engine on its own.
- Track five numbers. Visibility rate, citation rate and share of voice can be measured for rivals. AI referral sessions and crawl coverage can only be measured for you.
- Check crawl access first. A rival that blocks OAI-SearchBot drops out of ChatGPT search answers, so its robots.txt can explain its score.
- With 360 answers per brand per period, a gap of about 7 points between two brands is the smallest you can trust. For one engine at 120 answers, you need about 12.
- Hold the conditions fixed when you measure AI search performance: the same prompts, unpersonalized sessions, one location, and runs pooled over two to four weeks.

## What Benchmarking Adds to Measuring

Measuring tells you your numbers. Benchmarking AI search performance tells you whether they are good and whether they moved. That takes three comparisons, and each catches a mistake the others miss.

1. **Against your baseline.** Did your visibility rise since the last period, by more than the noise?
2. **Against rivals.** On the same prompts, in the same answers, who gets named more often?
3. **Per engine.** A blended score hides the engine where you are losing. The 2026 study ["Don't Measure Once"](https://arxiv.org/abs/2604.07585), which tested ChatGPT, Gemini, Google AI Mode and Perplexity, advises marketers to "set engine-specific visibility baselines rather than applying a single threshold across all AI search products." AI Mode concentrated citations most and Perplexity spread them most evenly.

As of September 2026, two vendors give you first-party numbers. Google's [Search Generative AI performance report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports), live for all sites since 31 August 2026, counts how often your URLs appeared in AI Overviews and AI Mode. Microsoft's [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) counts citations across Copilot, AI summaries in Bing and select partners, and its [June 2026 update](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare) added two features built for benchmarking. Compare lets you "overlay a previous time period directly onto the current reporting view." Citation Share is "the percentage of citations attributed to your site out of all citations shown across all sites for that same grounding query." ChatGPT, Perplexity and Claude offer nothing similar, so for them your prompt panel is the benchmark.

## The Five Numbers That Make Up AI Search Performance

| Metric | What it counts | Where you get it | Visible for rivals? |
| --- | --- | --- | --- |
| Visibility rate | Answers that name or cite a brand, divided by all answers | Your prompt panel | Yes |
| Citation rate | Answers that link to a brand's domain, divided by all answers | Your prompt panel | Yes |
| Share of voice | A brand's appearances, divided by all brand appearances | Your prompt panel; Bing's Citation Share for Copilot | Yes |
| AI referral sessions | Visits that arrive from AI assistants | GA4, with a custom channel | No |
| Crawl coverage | Priority URLs each search crawler fetched in 30 days, divided by all priority URLs | Your server or CDN logs | No, but their robots.txt is public |

The first three come from the same answers, so log every brand each answer names, not just yours. Your rivals' numbers come free. Our glossary entry on [AI share of voice](/glossary/ai-share-of-voice) covers the two common ways to calculate the third.

AI referral sessions need a fix first. Google's [default channel definitions](https://support.google.com/analytics/answer/9756891) describe the AI Assistant channel as traffic from "sources like ChatGPT, Gemini, Deepseek, Copilot, or Grok," excluding AI Overviews and AI Mode, so Perplexity and Claude go unnamed. Our [GA4 guide to AI referral traffic](/blog/how-to-measure-ai-referral-traffic-in-ga4) has a custom channel that catches them. Set it up before your baseline.

Crawl coverage is the number most benchmarks skip. Pick 30 to 60 pages that should win answers, such as pricing, comparisons and core guides, and count how many each search crawler fetched in the last 30 days. The free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) lists the pages each bot fetched from a log export.

## Check Crawl Access Before You Compare

A fair benchmark of AI search performance compares like with like. If a rival has shut out an engine's search crawler, its low score there reflects a choice, not weaker content. Here is what each vendor documents about blocking its search bot:

- **OpenAI.** Sites opted out of OAI-SearchBot "will not be shown in ChatGPT search answers, though can still appear as navigational links," according to OpenAI's [crawler overview](https://developers.openai.com/api/docs/bots).
- **Perplexity.** PerplexityBot "is designed to surface and link websites in search results on Perplexity," says Perplexity's [crawler page](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), and it isn't used to train foundation models. Blocking it opts a site out of Perplexity search.
- **Anthropic.** Turning off Claude-SearchBot "may reduce your site's visibility and accuracy in user search results," per [Anthropic's help center](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).

### How to run the access check

1. **Test your own robots.txt** for OAI-SearchBot, PerplexityBot, Claude-SearchBot and Bingbot with the [robots.txt tester](/tools/robots-txt-tester).
2. **Read each rival's robots.txt** at `/robots.txt` and note, per engine, whether its search bot is allowed.
3. **Mark each rival and engine pair** as open or closed. Leave closed pairs out of the rival comparison for that engine.
4. **Re-check every quarter.** The census will re-run each quarter, and rivals change their files too.

The census shows how often a closed pair turns up. It's rare in B2B software and common in news, where 45.12% of top sites also block PerplexityBot. A GPTBot block alone usually leaves ChatGPT search open: across all 13,359 readable files in the census, only 8 sites block OAI-SearchBot while letting GPTBot in.

Robots.txt isn't the only gate. A quarter of e-commerce sites (25.1%) wouldn't serve robots.txt to the census crawler at all, a sign that firewalls decide at the edge. If your own crawl coverage drops to zero for one bot, check your CDN first, using our post on [the Cloudflare challenge trap](/blog/cloudflare-challenge-trap). After any access change, wait a day before you measure: OpenAI says robots.txt updates take about 24 hours to reach its systems, and Perplexity says up to 24 hours.

## Size the Panel and Fix the Conditions

### How many answers you need

One answer tells you almost nothing. When SparkToro had [600 volunteers run 12 prompts](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/) 2,961 times, lists of brands almost never repeated, and Rand Fishkin advises asking "usually at least 60-100X, then average these out." The "Don't Measure Once" authors recommend at least 7 runs per prompt per day, pooled over a rolling two-to-four-week window.

By hand, you pool instead. Use 30 to 50 unbranded buyer prompts, the same list for every brand, and add up the answers across the period. Then check whether a gap between two brands beats chance. The standard margin on a difference between two rates is:

`margin = 1.96 × √( p1(1 − p1) / n1 + p2(1 − p2) / n2 )`

Here is what it gives for two brands at 25% and 40% visibility:

| Answers per brand per period | Example panel | Smallest gap you can trust |
| --- | --- | --- |
| 120 | 40 prompts, 1 engine, 3 runs | 11.7 points |
| 240 | 40 prompts, 2 engines, 3 runs | 8.3 points |
| 360 | 40 prompts, 3 engines, 3 runs | 6.8 points |
| 720 | 40 prompts, 3 engines, 6 runs | 4.8 points |
| 1,440 | 40 prompts, 3 engines, 12 runs | 3.4 points |

Treat these as a floor. Repeated runs of one prompt aren't fully independent, so the true margin is wider. The same formula works for your own change over time: put last period's rate in as p1 and this period's as p2.

### Freeze the conditions

AI answers change with who is asking, so benchmarking AI search performance needs a neutral asker. OpenAI says ChatGPT "may use relevant saved memories when rewriting a search query" and estimates your location from your IP address, which a VPN can change ([OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)). A temporary chat can be set to Unpersonalized, so it skips saved memories and custom instructions ([memory help page](https://help.openai.com/en/articles/8590148-memory-faq)).

- Run every prompt logged out, or in an unpersonalized temporary session.
- Use the same location, or the same VPN exit, every time.
- Record the engine, mode and model shown, so a model change doesn't pass for a real gain.
- Change prompts in batches between periods, never mid-period.

Our post on [how AI search uses user intent and context](/blog/how-ai-search-uses-user-intent-and-context) explains why these signals move answers.

### Set a cadence

- **Every week:** run each prompt once in each engine. Spreading runs over weeks follows the rolling-window advice.
- **Every month:** pool the weeks into one benchmark period, update the sheet and export Bing's and Google's AI reports for the same dates.
- **Every quarter:** re-check rivals' robots.txt, retire dead prompts and add new ones in a batch.
- **After a big change** to your site's access or an engine's search mode: take a new baseline.

## The Three-Way Benchmark Sheet: A Worked Example

Plannora is a made-up project management tool. It benchmarks itself against two made-up rivals, Loopcraft and Taskwell. Its panel is 40 unbranded prompts in ChatGPT, Perplexity and Google AI Mode, run once a week for three weeks a month. That gives 360 answers per period and 120 per engine. June is the baseline. All numbers are illustrative.

### Sheet 1: over time and against rivals

| Metric | Plannora, June | Plannora, September | Change | Real? | Loopcraft, September | Taskwell, September |
| --- | --- | --- | --- | --- | --- | --- |
| Visibility rate | 16.9% (61 of 360) | 26.9% (97 of 360) | +10.0 points | Yes, beats ±6.0 | 41.1% (148) | 21.9% (79) |
| Citation rate | 6.1% (22) | 11.4% (41) | +5.3 points | Yes, beats ±4.1 | 19.4% (70) | 9.2% (33) |
| Share of voice | 6.2% (61 of 990) | 9.5% (97 of 1,020) | +3.3 points | Read with visibility | 14.5% | 7.7% |
| AI referral sessions | 410 | 655 | +59.8% | Watch | Not visible | Not visible |
| Crawl coverage, OAI-SearchBot | 48.3% (29 of 60) | 63.3% (38 of 60) | +15.0 points | Yes, a count | robots.txt open | robots.txt open |

Plannora's AI search performance improved on its baseline in every row. But it still trails Loopcraft by 14.2 points of visibility, and at 360 answers each the margin on that gap is ±6.8. The gap is real.

### Sheet 2: engine by engine

| Engine (120 answers each) | Plannora | Loopcraft | Taskwell | Plannora vs Loopcraft |
| --- | --- | --- | --- | --- |
| ChatGPT | 28.3% (34) | 45.8% (55) | 33.3% (40) | −17.5 points, real (±12.0) |
| Perplexity | 34.2% (41) | 44.2% (53) | 3.3% (4) | −10.0 points, not proven (±12.3) |
| Google AI Mode | 18.3% (22) | 33.3% (40) | 29.2% (35) | −15.0 points, real (±10.9) |

The per-engine sheet changes the plan in three ways:

1. **Taskwell's Perplexity score is an access choice.** Its robots.txt blocks PerplexityBot, so Plannora drops Taskwell from its Perplexity comparison. Beating Taskwell there proves nothing.
2. **The Perplexity gap with Loopcraft isn't proven yet.** Ten points at 120 answers is inside the margin, so Plannora pools another month before acting on it.
3. **ChatGPT and AI Mode are the real gaps.** Plannora checks which pages Loopcraft gets cited for in those two engines and plans pages to answer the same prompts.

### How to read your AI search performance gaps

| Pattern in the sheet | Likely cause | Next step |
| --- | --- | --- |
| You and every rival rose by similar amounts | The engine changed, not your work | Credit nothing; read the gap, not the level |
| A rival is near zero in one engine only | It blocks that engine's search bot, or a firewall does | Check its robots.txt; drop the pair |
| Your visibility rose but citation rate stayed flat | Answers name you from other sites' pages | Find the cited pages; give your own page the answer |
| Your crawl coverage fell for one bot | A robots.txt, CDN or firewall change | Fix access before touching content |
| AI referral sessions rose while visibility stayed flat | One page took off, or tagging changed | Check landing pages and channel rules |
| The gap with a rival is inside the margin | Not enough answers yet | Pool another period before acting |

The first row matters most: when a whole category rises in the month an engine changes, the rise is drift. The control-prompt test in our [GEO measurement guide](/blog/how-to-measure-geo) separates your work from it.

## Where Rankbox Fits

Rankbox doesn't track AI citations today, so it won't fill in the benchmark sheet for you. Run the panel by hand with the free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator), which writes 30 buyer prompts and a scorecard, or use one of the trackers in our [ChatGPT rank tracker roundup](/blog/chatgpt-rank-tracker).

Where Rankbox helps is lifting AI search performance where the sheet finds gaps. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI in your category, and the Citation-Ready Writer drafts source-backed pages for the prompts your rivals win. The Business plan is $49.50 a month: [see pricing](/pricing).

## Frequently Asked Questions

### What is a good benchmark for AI search performance?

There's no universal number, because visibility depends on your category, prompts and engines. Benchmark against your own baseline, the rivals named in the same answers, and each engine on its own. A change counts when it beats the margin, about 7 points at 360 answers per brand.

### How often should you benchmark AI search performance?

Run the prompt panel weekly and pool the results into a monthly benchmark period. Re-check rivals' robots.txt and refresh your prompt list each quarter. Take a new baseline after a big access change on your site or a change in how an engine searches.

### How many prompts do you need to benchmark AI search performance?

Use 30 to 50 unbranded buyer prompts, run several times in each engine. The total number of answers per brand is what counts: at 360 answers, a 7-point gap between two brands is real, and at 120 you need about 12.

### Can you benchmark competitors' AI referral traffic?

No. Referral sessions only show in your own analytics. For rivals, compare visibility rate, citation rate and share of voice from the same prompt panel, plus what their robots.txt allows.

### Does blocking GPTBot hurt AI search performance?

Not in ChatGPT search, according to OpenAI. GPTBot is the training crawler, and OpenAI says each bot setting is independent. Blocking OAI-SearchBot is what removes a site from ChatGPT search answers, apart from navigational links.

### Which tools benchmark AI search performance?

Search Console and Bing Webmaster Tools report AI visibility for Google and Microsoft, and Bing adds Citation Share and a Compare view. For ChatGPT, Perplexity and Claude, use a prompt panel, by hand or with a tracker. Add GA4 for sessions and logs for crawl coverage.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
3. [Memory in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/8590148-memory-faq)
4. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
5. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
6. [Introducing Search Generative AI performance reports in Search Console, Google Search Central](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
7. [Generative AI performance report, Search Console Help](https://support.google.com/webmasters/answer/16984139)
8. [Introducing AI Performance in Bing Webmaster Tools, Microsoft Bing](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
9. [New AI visibility insights in Bing Webmaster Tools: intents, topics, citation share and compare, Microsoft Bing](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare)
10. [Default channel group, Google Analytics Help](https://support.google.com/analytics/answer/9756891)
11. [Don't Measure Once: Measuring Visibility in AI Search (Schulte, Bleeker and Kaufmann, 2026)](https://arxiv.org/abs/2604.07585)
12. [AIs are highly inconsistent when recommending brands or products, SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
