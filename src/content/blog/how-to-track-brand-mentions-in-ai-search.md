---
title: How to Track Brand Mentions in AI Search: A Practical Guide for 2026
description: How to track brand mentions in AI search: sample brand, category and comparison prompts, log each answer, set alerts that beat the noise, and pick tools.
keyword: track brand mentions in AI search
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Measurement
---

To track brand mentions in AI search, pick a fixed sample of prompts in three buckets: questions about your brand, questions about your category, and head-to-head comparisons. Run each one on a schedule in every engine your buyers use, log each answer as one row in a sheet, and set alert rules that fire only when a change is bigger than the run-to-run noise.

This is a new job, not an old one in a new place. A web mention sits on a page anyone can find. A mention inside ChatGPT lives in one person's chat, and the next person may get a different answer. OpenAI says ChatGPT has [more than 900 million weekly active users](https://openai.com/index/accelerating-the-next-phase-ai/) and that its search usage nearly tripled in a year. Almost none of those answers is published where a crawler or a listening tool can read it.

Web mentions still matter, because they feed the answers. In an [Ahrefs study of 75,000 brands](https://ahrefs.com/blog/ai-brand-visibility-correlations) from December 2025, branded web mentions correlated at 0.664 with how often ChatGPT named a brand, and YouTube mentions at about 0.74. So you watch two things: the web that feeds the answers, and the answers themselves.

This guide is about the second job, run as a system: prompt sampling, the prompt set, setup, a recording template, cadence and alerts, and your options. For the metrics in depth, see our guide to [measuring GEO](/blog/how-to-measure-geo). For plan-by-plan prices, read [how to track brand mentions in AI search for free, and when to pay](/blog/track-brand-mentions-in-ai-search-free-and-paid). If you only want a one-time reading, run the [15-minute audit](/blog/how-to-see-if-ai-mentions-your-brand) instead.

## Key Takeaways

- To track brand mentions in AI search, you sample prompts. An answer lives in one private chat and changes on each run, so no web search will find it.
- Use three buckets. Brand prompts check what engines say about you, category prompts check whether you get found, and comparison prompts check whether you get picked.
- Log "named" and "linked" apart. In a June 2026 Semrush study, ChatGPT linked 87% of the brands that appeared in its answers but named only 20.7%.
- Set alert rules before you collect data. At 180 category answers per four-week window, a fall from 30% to 20% clears the 8.9-point margin of error.
- Brand24 now sells an AI Visibility add-on through its Chatbeat product. Mention's published source list doesn't include AI answers. Listening and answer tracking stay different jobs.
- API scripts cost roughly a cent per search plus tokens, but API answers aren't the consumer apps, so report them apart.

## Why You Can't Track Brand Mentions in AI Search Like Web Mentions

For twenty years, a brand mention meant your name on a page. You could find it with a search or a listening tool, and it stayed put. AI search adds a second kind of mention that behaves very differently.

| | Web mention | AI answer mention |
| --- | --- | --- |
| Where it lives | A public page, post or video | A generated answer in one user's chat |
| Who can see it | Anyone | Only the person who asked |
| How long it lasts | Until someone edits it | One session; the next run may differ |
| How you find it | Keyword alerts, listening tools | Running prompts yourself, or a tracker |

Links behave differently too. Semrush's [ghost citations study](https://www.semrush.com/blog/the-ghost-citations-study/), published on 9 June 2026, logged 3,981 domain appearances across 115 prompts. Gemini named a brand in 83.7% of its appearances but linked it in 21.4%. ChatGPT did the reverse: 87% linked, 20.7% named. Count only links, or only names, and you miss half the picture.

### Listening tools watch the web, answer trackers watch the answers

A common claim is that listening platforms such as Brand24 and Mention only track Twitter, Reddit and news sites, and don't watch answers in ChatGPT, Claude or Perplexity. As of September 2026, the first half is out of date and the second is only partly true.

- **Brand24** lists sources such as Facebook, Instagram, X, Reddit, LinkedIn, YouTube, TikTok, news, blogs, reviews and podcasts on its [pricing page](https://brand24.com/prices/), and sells an "AI Visibility module" there as an add-on. Its [AI visibility page](https://brand24.com/ai-visibility/) says this runs through Chatbeat, a product from the same company that tracks prompts in ChatGPT, Claude, Gemini, Perplexity, AI Overviews, AI Mode, DeepSeek, Grok and Copilot. [Chatbeat](https://chatbeat.com/pricing/) starts at $99 a month for 30 prompts on three models, as listed on 28 September 2026.
- **Mention**, now owned by Agorapulse, lists X, Facebook, Instagram, YouTube, Reddit, forums, blogs, videos, news and the web in its [sources article](https://support.mention.com/en/articles/13420818-mention-sources-explained), dated 25 August 2026. Its [pricing page](https://mention.com/en/pricing/) adds TikTok, Pinterest and 75+ review sites. Neither page lists AI chatbot answers.
- **Meltwater** sells [GenAI Lens](https://www.meltwater.com/en/products/genai-lens), typically as an add-on, with a 48-hour refresh across ChatGPT, Gemini, Claude and more. It doesn't publish a price.

So the point stands, with a correction. Listening finds what people publish about you. Answer tracking samples what engines say when a buyer asks. They're different jobs even when one vendor sells both. If you want your listening suite's AI module to track brand mentions in AI search for you, ask whether it keeps the exact prompt, the full answer and every cited source.

## How Prompt Sampling Works

You can't read other people's chats, so prompt sampling is how you track brand mentions in AI search at all. You do what pollsters do: pick a sample of questions that stands in for the real ones, ask them the same way each time, and read the rate across many answers. The practice is called [prompt tracking](/glossary/prompt-tracking).

### Three buckets of prompts

Each bucket answers a different question, so report them apart.

| Bucket | Example for Plannora, a made-up tool | What it measures | Warning sign |
| --- | --- | --- | --- |
| Brand | "What is Plannora and what does it cost?" | Whether engines describe you correctly | A wrong price or "I don't know this brand" |
| Category | "Best project management tool for a small agency" | Whether buyers who don't know you find you | Your mention rate falls while rivals hold |
| Comparison | "Plannora vs Loopcraft for client work" | Whether you get picked at the moment of choice | The answer favors the rival more often |

Category prompts grow the business, so give them about half the set. A 30-prompt set might hold 6 brand, 15 category and 9 comparison prompts.

### Why one run per prompt tells you little

When SparkToro had [600 volunteers run 12 prompts 2,961 times](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/), there was less than a 1-in-100 chance that ChatGPT or Google's AI would give the same list of brands twice. Still, Rand Fishkin concluded that "visibility % across dozens to hundreds of prompts run multiple times is a reasonable metric."

The 2026 paper ["Don't Measure Once"](https://arxiv.org/abs/2604.07585) measured the drift. Cited sources overlapped by only 34% to 42% from one day to the next, while brand lists were steadier, at 45% to 59%. The authors advise at least 7 runs per prompt per day, read over a rolling two-to-four-week window. By hand, run each prompt weekly, pool four weeks into one reading, and accept a wider margin. Our post on [the technical reality of tracking AI answers](/blog/is-it-possible-to-track-brand-mentions-in-ai-answers) explains where the randomness comes from.

## Build the Prompt Set

Every team that wants to track brand mentions in AI search needs its own prompt set. A tracker can run prompts, but it can't know what your buyers ask.

1. **Collect raw questions** from sales calls, support tickets, demo forms and question-shaped Search Console queries. Rankbox's free AI question generator can fill gaps.
2. **Sort them into buckets**, roughly 20% brand, 50% category and 30% comparison.
3. **Keep your name out of category prompts.** "Best tool for X" tests discovery; "Is Plannora good for X" belongs in the brand bucket.
4. **Add a second wording** for your five most important category prompts, so one lucky phrasing can't flatter you.
5. **List every form of each name**: "Plannora", "plannora.io" and the misspelling "Planora", plus each rival's variants.
6. **Tag each prompt with the page you expect to win it**, so a drop points at a page to fix.
7. **Freeze the set for a quarter.** Add and retire prompts in one batch.

The free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) writes 30 starter prompts from your brand, category and a competitor.

## Set Up a System to Track Brand Mentions in AI Search

The setup takes an afternoon. After that it runs in a weekly slot.

1. **Pick engines and modes.** Often ChatGPT, Perplexity and Google AI Mode, plus Copilot, Gemini or Claude if your buyers use them. Record the mode on every row.
2. **Remove personalization.** OpenAI says ChatGPT [may use saved memories](https://help.openai.com/en/articles/9237897-chatgpt-search) when it rewrites a search and estimates your location from your IP address. Run prompts logged out, or in a temporary chat set to [Unpersonalized](https://help.openai.com/en/articles/8590148-memory-faq), from the same place each week.
3. **Fix the run count.** One run per prompt per engine per week, pooled into rolling four-week windows.
4. **Build the log** from the template below.
5. **Flag whether the engine searched.** ChatGPT decides for itself when a question would benefit from current information. An answer from training data won't move because you published a page last week.
6. **Add the free vendor reports** for the same dates (see the options table below).
7. **Write alert rules and book a weekly review.** Rules come first, so you can't talk yourself into a trend later.

## The Recording Template

The log is where you actually track brand mentions in AI search, one row per answer. Here is the header with two made-up rows for Plannora:

```csv
week,run_date,engine,mode,bucket,prompt_id,run,searched,named,name_as,first_named_at,brands_in_answer,our_urls,other_domains,fact_check,note
5,2026-09-07,perplexity,default,brand,brd-02,1,yes,yes,Plannora,1,Plannora,plannora.io/pricing,stackreview.co,wrong-price,"quotes a 2025 price"
5,2026-09-07,chatgpt,web,category,cat-04,1,yes,no,-,-,"Loopcraft; Taskwell",-,"stackreview.co; reddit.com",-,"roundup dropped us"
```

- **searched** splits live-search answers from answers written from memory.
- **named** and **our_urls** stay apart, because a mention and a citation move for different reasons.
- **first_named_at** is your place among the brands named. Average it; never report it from one answer.
- **fact_check** uses fixed labels (ok, wrong-price, outdated, wrong-claim) so errors can be counted.
- **other_domains** shows which third-party pages the engine leaned on. Most fixes start there.

Add a roll-up tab. In Google Sheets, the category mention rate for weeks 1 to 4 is:

```
=COUNTIFS(E:E,"category",I:I,"yes",A:A,">=1",A:A,"<=4")/COUNTIFS(E:E,"category",A:A,">=1",A:A,"<=4")
```

Copy it per bucket, engine and window. Count rivals from brands_in_answer the same way to get your [AI share of voice](/glossary/ai-share-of-voice).

## Cadence and the Mention Watch Rules

How often should you track brand mentions in AI search? Weekly runs, read by bucket. We call the alert system below the Mention Watch Rules. A wrong price and a slow slide in category mentions need different triggers.

| Bucket | Read over | Alert fires when |
| --- | --- | --- |
| Brand | Each week on its own | The same wrong fact appears in 2 or more answers, or an engine says it doesn't know you |
| Category | Rolling four weeks | Your mention rate falls by more than the margin of error |
| Comparison | Rolling four weeks | You lose the recommendation by more than the margin, or a new rival appears two weeks running |
| Any | Each week | A new domain is cited in 2 or more answers about you |
| Vendor reports | Monthly | Bing citations or Search Console AI impressions fall for a key page |

Brand alerts skip the statistics on purpose: a wrong price repeated twice is a problem at any sample size. Our guide to [brand presence in Perplexity](/blog/brand-presence-in-perplexity) shows how to trace a bad sentence to its source.

For rate alerts, compare this window with the last one:

`margin = 1.96 × √( p1(1 − p1) / n1 + p2(1 − p2) / n2 )`

Before you have data, plan with a rate near 30% in both windows. With the 30-prompt set run weekly in three engines, each bucket gets these answers per window, and needs a drop this large before an alert fires:

| Bucket | Answers per window | Smallest drop that fires |
| --- | --- | --- |
| Brand (6 prompts) | 72 | 15.0 points |
| Comparison (9 prompts) | 108 | 12.2 points |
| Category (15 prompts) | 180 | 9.5 points |

Treat these as a floor, since runs of one prompt aren't fully independent. If the thresholds feel coarse, add runs, not prompts. Each quarter, swap dead prompts in one batch and restart the trend line from that date.

## Worked Example: Plannora's First Eight Weeks

Here is what it looks like to track brand mentions in AI search for two windows. Plannora runs the 30-prompt set in ChatGPT, Perplexity and Google AI Mode once a week: 90 answers a week, 360 per window. All numbers are illustrative.

| Bucket | Weeks 1–4 | Weeks 5–8 | Change | Margin | Alert? |
| --- | --- | --- | --- | --- | --- |
| Category, named | 54 of 180 (30.0%) | 36 of 180 (20.0%) | −10.0 points | ±8.9 | Yes |
| Comparison, recommended | 41 of 108 (38.0%) | 44 of 108 (40.7%) | +2.8 points | ±13.0 | No |
| Brand, wrong fact | 1 of 72 | 9 of 72 | +8 answers | 2 or more | Yes |

The category margin uses the real rates: 1.96 × √(0.30 × 0.70 ÷ 180 + 0.20 × 0.80 ÷ 180) = 1.96 × √0.002056 = 1.96 × 0.0453 = 0.089, or 8.9 points. A 10-point fall clears it. The comparison margin works the same way: 1.96 × √(0.380 × 0.620 ÷ 108 + 0.407 × 0.593 ÷ 108) = 1.96 × 0.0665 = 0.130. A 2.8-point rise is noise.

Then the team reads the rows behind each alert:

1. **Category drop.** The other_domains column shows stackreview.co's "best project management tools" roundup cited in 31 of the 180 category answers in weeks 5 to 8. It was updated and no longer lists Plannora. The fix: outreach to the roundup and a stronger comparison page.
2. **Brand error.** Seven of the nine wrong-price answers came from Perplexity, all quoting a 2025 price from an old review. The fix: a dated pricing page and a correction request.
3. **Comparisons.** The small rise sits inside the margin, so the team waits.

The rules also kept the team from celebrating the comparison bump, which a screenshot habit would have done.

## Your Options, From Free to Paid

You can track brand mentions in AI search at four levels of cost. Prices are as listed on 28 September 2026.

| Option | Cost | What it adds |
| --- | --- | --- |
| Manual runs and a spreadsheet | $0 plus your time | Full control of prompts, conditions and fields |
| Scripts against engine APIs | Cents per search, plus tokens | Many runs without manual work |
| Bing AI Performance, Search Console, GA4 | $0 | Vendor data on your own pages and visits |
| Third-party trackers | From $29 a month | Daily runs, many engines, history and exports |

The free vendor reports cover what a sample can't. Bing's [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview), in preview since 10 February 2026, counts citations of your pages in Copilot, Bing's AI summaries and select partners, with the grounding queries behind them; its [June update](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare) added Citation Share, which "does not expose competitor domains." Search Console's [generative AI reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports), live for all sites since 31 August 2026, count impressions of your URLs in AI Overviews, AI Mode and Discover. GA4's [AI Assistant channel](https://support.google.com/analytics/answer/9756891) groups visits from "ChatGPT, Gemini, Deepseek, Copilot, or Grok." Our guides to [Bing Webmaster Tools](/blog/bing-webmaster-tools-ai-indexing-guide) and [AI referral traffic in GA4](/blog/how-to-measure-ai-referral-traffic-in-ga4) cover setup.

### Scripts where engines offer APIs

Scripts let you track brand mentions in AI search at a volume no person could log. OpenAI charges [$10 per 1,000 web search calls](https://developers.openai.com/api/docs/pricing) plus search tokens, and Anthropic [$10 per 1,000 searches](https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-search-tool) plus tokens. Gemini's API gives paid-tier users [5,000 grounded searches a month free](https://ai.google.dev/gemini-api/docs/pricing), then $14 per 1,000. Perplexity's Agent API charges [$2.50 per 1,000 web searches](https://docs.perplexity.ai/docs/getting-started/pricing) plus tokens; its older Sonar Chat Completions lost support on 27 September 2026. Thirty prompts run four times a month is 120 calls, or $1.20 in OpenAI search fees.

A minimal logger for OpenAI's [web search tool](https://developers.openai.com/api/docs/guides/tools-web-search), which returns cited URLs as `url_citation` annotations:

```python
from openai import OpenAI
client = OpenAI()  # reads OPENAI_API_KEY
r = client.responses.create(
    model="gpt-6-astra",  # the model in OpenAI's web search guide, Sept 2026
    tools=[{"type": "web_search"}],
    input="Best project management tool for a small agency?",
)
searched = any(i.type == "web_search_call" for i in r.output)
urls = [a.url for i in r.output if i.type == "message"
        for c in i.content for a in (getattr(c, "annotations", None) or [])
        if a.type == "url_citation"]
named = "plannora" in r.output_text.lower()
print(searched, named, urls)
```

Two cautions. API answers aren't the consumer app: OpenAI's guide says the model "can choose to search the web or not," and you set the model and location yourself. The "Don't Measure Once" authors warn that mixing API and interface data "would create a methodological inconsistency for ChatGPT specifically," so mark API rows and report them apart. And don't script the apps: among the things OpenAI's [terms of use](https://openai.com/policies/row-terms-of-use/) forbid is to "Automatically or programmatically extract data or Output." Check each engine's terms first.

### When a tracker earns its fee

A tracker makes sense once your sample needs more runs, engines or markets than a person can log in a morning. Entry plans include [Otterly.AI](https://otterly.ai/pricing) Lite at $29 a month for 15 prompts in four engines, [HubSpot AEO](https://www.hubspot.com/products/aeo) at $50 for 25 prompts, [Peec AI](https://peec.ai/pricing) Starter at $95 for 50 prompts on three models, and Semrush's [AI Visibility Toolkit](https://www.semrush.com/pricing/ai/) at $99 per domain for 25 prompts. Export raw answers into your own log so the history survives a vendor switch. Our [free vs paid guide](/blog/track-brand-mentions-in-ai-search-free-and-paid) shows when paying beats your hours, and the [ChatGPT rank tracker roundup](/blog/chatgpt-rank-tracker) lists questions to ask vendors.

## Where Rankbox Fits in a Monitoring Program

Rankbox doesn't track brand mentions in AI search today, or citations and share of voice, so it won't fill in the log. Where it helps is the step after an alert. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI in your category, a quick way to fill the category bucket. The [Citation-Ready Writer](/features/citation-ready-writer) then writes source-backed articles for the prompts rivals win, and they reach your site through the [Rankbox API](/integrations/api). The Business plan is $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### How do you track brand mentions in AI search?

Run a fixed set of brand, category and comparison prompts in each engine on a schedule and log every answer: named or not, linked or not, position and cited sources. Read rates over four-week windows, and add Bing's AI Performance report, Search Console and GA4 for first-party data.

### How often should you check AI answers for your brand?

Weekly works for manual tracking. Run each prompt once per engine per week and pool four weeks into one reading. Check brand prompts every week on their own, because a wrong fact needs fixing at any sample size. Refresh the prompt set each quarter.

### Can social listening tools track brand mentions in AI search?

Some can now, through add-ons. Brand24 sells an AI Visibility module through Chatbeat, and Meltwater sells GenAI Lens. Mention's published source list doesn't include AI answers. Listening still does a different job: it finds what people publish, while answer tracking samples what engines say.

### How many prompts do you need to track brand mentions in AI search?

Start with 25 to 50, split roughly 20% brand, 50% category and 30% comparison. The number of answers matters more than the number of prompts: at 180 answers per window, a category drop of about 9 points is the smallest you can trust.

### Can you track brand mentions in AI search for free with scripts?

Nearly. The OpenAI, Anthropic, Gemini and Perplexity APIs cost cents per search, and Gemini includes 5,000 free grounded searches a month on its paid tier. API answers can differ from the consumer apps, so report them apart, and don't script the apps themselves.

## References

1. [Accelerating the next phase of AI, OpenAI](https://openai.com/index/accelerating-the-next-phase-ai/)
2. [Top brand visibility factors in ChatGPT, AI Mode and AI Overviews, Ahrefs](https://ahrefs.com/blog/ai-brand-visibility-correlations)
3. [Why 62% of AI citations don't lead to brand mentions, Semrush](https://www.semrush.com/blog/the-ghost-citations-study/)
4. [AIs are highly inconsistent when recommending brands or products, SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
5. [Don't Measure Once (Schulte, Bleeker and Kaufmann, 2026)](https://arxiv.org/abs/2604.07585)
6. [Pricing, Brand24](https://brand24.com/prices/)
7. [Pricing, Chatbeat](https://chatbeat.com/pricing/)
8. [Mention sources explained, Mention Help Center](https://support.mention.com/en/articles/13420818-mention-sources-explained)
9. [GenAI Lens, Meltwater](https://www.meltwater.com/en/products/genai-lens)
10. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
11. [Introducing AI Performance in Bing Webmaster Tools, Microsoft Bing](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
12. [Introducing Search generative AI performance reports, Google Search Central](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
13. [Web search tool guide, OpenAI](https://developers.openai.com/api/docs/guides/tools-web-search)
14. [Web search tool, Anthropic Claude Docs](https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-search-tool)
15. [Gemini API pricing, Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
16. [Pricing, Perplexity Docs](https://docs.perplexity.ai/docs/getting-started/pricing)
