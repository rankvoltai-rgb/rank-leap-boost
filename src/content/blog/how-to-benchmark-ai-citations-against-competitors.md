---
title: How to Benchmark Your Brand's AI Citations Against Competitors
description: Benchmark your brand's AI citations against competitors with a 20-prompt matrix, a head-to-head score for each rival and a worked example with real math.
keyword: AI citations
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Measurement
---

To benchmark your brand's AI citations against competitors, run the same 20 buyer prompts through each AI engine several times, then log every brand each answer recommends and every page it cites. Next, count how often each answer puts you ahead of each rival. Divide your wins by every answer that recommends either of you, and you get a head-to-head score: one percentage per competitor that you can track from month to month.

A single check can't do this job. When SparkToro had 600 volunteers run 12 prompts 2,961 times, it found [less than a 1 in 100 chance](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/) that ChatGPT or Google's AI would return the same list of brands twice. Links and names also move apart. In Semrush's [June 2026 study](https://www.semrush.com/blog/the-ghost-citations-study/), 62% of AI citations were "ghost citations": the page was linked, but the brand behind it was never named.

This guide gives you a fixed 20-prompt matrix, the scoring math, a worked example with three made-up brands, and a table for reading the result. It's a one-off benchmark you can run in an afternoon. For the weekly version, see our guide on [how to track competitor rankings in AI search](/blog/how-to-track-competitor-rankings-in-ai-search). For baselines over time, see [how to benchmark AI search performance](/blog/how-to-benchmark-ai-search-performance).

## Key Takeaways

- A fair competitor benchmark uses three kinds of prompts: problem queries, alternative searches and feature comparisons. The 20-Prompt Rival Matrix uses 8, 6 and 6.
- Score each rival on its own. The head-to-head score is wins divided by wins plus losses, counted only in answers where you, the rival, or both appear.
- A brand named in the prompt can't be recommended as an alternative to itself. Leave it out of that prompt's count, or the score is rigged.
- Count AI citations and brand mentions apart. A rival can win the links while you win the names, and each gap has a different fix.
- 20 prompts on three engines with three runs each gives 180 answers. At that size, a head-to-head score carries a margin of about ±7 to ±10 points.
- Read the score by prompt type. A brand can win feature questions and still lose almost every problem question.
- Several trackers now report competitor share of voice, but they define position and share differently. Check the formula before you compare numbers across tools.

## Why a Competitor Benchmark Needs Its Own Prompt Set

SEO tools taught us to compare rivals by keyword overlap: which terms you both rank for, and who ranks higher. AI answers don't work that way. There is no list of ten results. The engine writes a short answer, names a few brands, and links a handful of pages. So the question changes from "who ranks above me?" to "when a buyer asks, who does the answer recommend first?"

That question depends on how the buyer asks. People rarely type your category name and stop. They describe a problem ("my team keeps missing client deadlines"). They look for a way out of the tool they have ("what can I use instead of Loopcraft?"). Or they compare features ("which tools have client approvals built in?"). A benchmark built only from "best X for Y" prompts tests one of those moments and misses the other two.

### Mentions and AI citations are separate wins

An answer can help a brand in two ways. It can name the brand in the text, which is a mention. It can link to the brand's page as a source, which counts toward its AI citations. The two often split. The same Semrush study found that ChatGPT linked to a domain 87% of the time it appeared but named the brand in the text only 20.7% of the time. Gemini did the reverse, naming brands 83.7% of the time and linking 21.4%.

So a rival can lead your benchmark on mentions and trail on AI citations, or the reverse. Log both, and score both. Our glossary entry on [AI citations](/glossary/ai-citation) covers the difference in more depth.

### Engines disagree, so benchmark each one

The 2026 study ["Don't Measure Once"](https://arxiv.org/abs/2604.07585) tested ChatGPT, Gemini, Google AI Mode and Perplexity. It advises marketers to "set engine-specific visibility baselines rather than applying a single threshold across all AI search products." Google AI Mode concentrated its AI citations most heavily on a few sources, and Perplexity spread them most evenly. A rival that dominates one engine can be a minor name in another, so every table in this guide splits by engine as well as in total.

## The 20-Prompt Rival Matrix

The matrix is a fixed set of 20 prompts, split by the three ways buyers compare products. It's small enough to run by hand and broad enough to show where you win and lose. Here it is for Plannora, a made-up project management tool whose made-up rivals are Loopcraft and Taskwell.

| Prompt type | Count | What it tests | Example prompt | Rivals it scores |
| --- | --- | --- | --- | --- |
| Problem queries | 8 | Does the engine think of you when a buyer only describes the pain? | "How can a 12-person agency stop missing client deadlines?" | All rivals |
| Alternative searches | 6 | Are you offered when a buyer wants to leave a rival, and who is offered when they want to leave you? | "What are good alternatives to Loopcraft for a small agency?" | Every brand except the one named |
| Feature comparisons | 6 | Does the engine match you to the features you win on, and who wins a direct comparison? | "Which project tools have client approvals and time tracking built in?" | All rivals, or the two named |

### Problem queries (8 prompts)

Write these the way buyers talk in sales calls and support tickets. Name the pain, not the product type. Use four plain versions and four with a constraint, such as team size, budget, industry or a tool the buyer already uses.

- "Our design team keeps losing track of client feedback. What should we use?"
- "What's the easiest way to plan work for a 12-person agency on a small budget?"

Problem queries tell you whether the engine links your brand to the job it does. They are often the hardest prompts to win, because nothing in them points to you.

### Alternative searches (6 prompts)

Alternative searches catch buyers at the moment they switch. Split them across your rivals and add one about yourself:

- 3 prompts that ask for alternatives to your biggest rival
- 2 prompts that ask for alternatives to your second rival
- 1 prompt that asks for alternatives to your own brand

The last one is defensive. It shows which rival an engine hands your own customers when they ask how to leave.

### Feature comparisons (6 prompts)

Use four feature-led prompts that name no brand, built around the features you think you win on. Add two head-to-head prompts that name you and one rival each, such as "Plannora vs Loopcraft for client work: which is better?" For those two, record the answer's verdict: which brand it recommends, or no clear pick.

### Five rules that keep the matrix fair

1. **Keep your brand out of 17 prompts.** Only the two head-to-head prompts and the one defensive prompt name you.
2. **Never score a brand that the prompt names as its own alternative.** In "alternatives to Loopcraft," Loopcraft isn't eligible, so that prompt only scores you against Taskwell.
3. **Freeze the wording.** Run the same text every time. A new phrasing is a new prompt.
4. **Pick rivals from the answers, not your sales deck.** Run the matrix once, then track the two or three brands that appear most. The brand that AI recommends may not be the one you lose deals to.
5. **Tag each prompt with the page you expect to win it.** This turns the result into a to-do list.

Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) writes 30 buyer prompts from your brand, category and a competitor. Use it as a pool, then sort 20 of them into the matrix.

## How to Run the Matrix and Log AI Citations

### Engines, runs and clean sessions

Pick the three or four engines your buyers use. For most B2B software, that's ChatGPT, Perplexity and Google AI Mode, with Gemini or Claude as a fourth. Run each prompt three times per engine, on the same days, from the same place. That gives 180 answers across three engines, which is the minimum this method is built for.

Keep the sessions neutral. OpenAI says that if memory is on, ChatGPT ["may use relevant saved memories when rewriting a search query"](https://help.openai.com/en/articles/9237897-chatgpt-search), and that it estimates your location from your IP address, which a VPN can change. Log out, or use a temporary chat with memory off, and use one location for every run. Record the model or mode each engine shows, so a model change doesn't pass as a real gain.

### What to write down for every answer

Log one row per answer. Keep the brands in the order the answer first names them, and include brands you don't track. Peec AI's documentation makes the same choice: its [position metric](https://peec.ai/ai-instructions) "accounts for every brand detected in a chat, not just tracked competitors." If an untracked brand comes first, your rival is second, not first.

```csv
date,engine,prompt_id,type,run,brands_in_order,verdict,cited_urls,cited_pages_naming_rivals_not_you
2026-09-22,perplexity,prob-3,problem,2,"Loopcraft; Wrenboard; Plannora",,"loopcraft.ai/guides/deadlines; stackreview.co/best-pm-tools","stackreview.co/best-pm-tools"
2026-09-22,chatgpt,h2h-PL,feature,1,,Loopcraft,"stackreview.co/loopcraft-vs-plannora",""
```

Three columns do the heavy lifting:

- **brands_in_order** feeds every mention metric: Share of Model, AI Share of Voice, First-Mention Rate, Average Answer Position and the head-to-head score.
- **cited_urls** feeds the metrics for AI citations. Count each domain once per answer for Citation Rate, and count each distinct URL for Citation Share.
- **cited_pages_naming_rivals_not_you** is your gap list. Open the cited third-party pages, such as reviews, roundups and forum threads, and note which brands each one names. A page that is cited often and names your rivals but not you is where to act first.

### What counts as a recommendation

For Share of Model and the other mention metrics, count any brand the answer names, as the framework does. The head-to-head score is stricter. A brand only wins a contest when the answer offers it as an option: in a list, a table, a sentence ("Loopcraft is a good fit if…") or a closing tip. A brand named only to rule it out ("Taskwell isn't built for agencies") wins nothing, so log it as a negative mention in a notes column. Never count a name the answer just repeats from the prompt. For tables, order is row order. For prose, order is where each brand first appears.

## The Scoring Formulas

Every number comes from the same log. The first six metrics use the names and formulas of our [GEO Metrics Framework](/blog/geo-metrics-framework), which defines each one with notation and worked examples. The last two are this matrix's own. Measure the mention metrics on the 12 unbranded prompts only (the problem queries and feature-led prompts), because a prompt that names a brand is no fair test of whether the engine thinks of it. The framework asks for each engine to be computed on its own, or given equal weight when blended; a matrix with the same runs per engine does that for you.

| Metric | Formula | What it answers |
| --- | --- | --- |
| Share of Model (SoM) | Answers that name the brand ÷ unbranded answers | How often does the engine think of this brand at all? |
| AI Share of Voice (SoV) | Answers that name the brand ÷ all brand appearances | What slice of the conversation does it hold? |
| First-Mention Rate (FMR) | Answers that name the brand first ÷ answers that name any brand | How often is it the lead pick? |
| Average Answer Position (AAP) | Sum of the brand's positions ÷ answers that name it | When named, how high does it sit? |
| Citation Rate (CR) | Answers linking at least one page on the brand's domain ÷ all answers | How often does the brand's own site earn a source slot? |
| Citation Share (CS) | Distinct URLs on the brand's domain ÷ all cited URLs | What slice of all AI citations does its site take? |
| Head-to-head score | Wins ÷ (wins + losses) against one rival | How often is the brand recommended over that rival? |
| Rival Matrix Score | All wins ÷ all contests, across every rival | The one headline percentage |

### How to count wins and losses

For each answer, compare your brand with one rival at a time:

1. **Only you are recommended:** a win.
2. **Only the rival is recommended:** a loss.
3. **Both are recommended:** the one named first wins.
4. **Neither is recommended:** no contest. The answer doesn't count toward the head-to-head score, but it still counts toward Share of Model.
5. **Head-to-head prompts:** the verdict decides. "No clear pick" is no contest.
6. **Either brand is named in the prompt as the thing to replace:** no contest for that pair.

Then check the margin before you trust a score. With the head-to-head score as p and the number of contests as n, the 95% margin is:

`margin = 1.96 × √( p × (1 − p) ÷ n )`

Treat this as a floor. Runs of the same prompt aren't fully independent, so the true margin is a little wider.

## Worked Example: Plannora vs Loopcraft and Taskwell

Plannora, Loopcraft and Taskwell are made-up brands, and the answers are an illustrative dataset. The arithmetic is real, so you can check every line. Plannora ran the 20-Prompt Rival Matrix on ChatGPT, Perplexity and Google AI Mode, three runs each: 180 answers.

### Step 1: Share of Model and order

These are the 12 unbranded prompts: 108 answers, 99 of which name at least one brand. Across them, brands appear 207 times, 70 of them for brands Plannora doesn't track. Every prompt has the same nine runs, so the pooled rate equals the framework's per-prompt average.

| Brand | Share of Model | AI Share of Voice | First-Mention Rate | Average Answer Position |
| --- | --- | --- | --- | --- |
| Plannora | 38.9% (42 of 108) | 20.3% (42 of 207) | 26.3% (26 of 99) | 1.60 (67 ÷ 42) |
| Loopcraft | 59.3% (64 of 108) | 30.9% (64 of 207) | 38.4% (38 of 99) | 1.59 (102 ÷ 64) |
| Taskwell | 28.7% (31 of 108) | 15.0% (31 of 207) | 8.1% (8 of 99) | 2.03 (63 ÷ 31) |

Loopcraft is named in far more answers. Yet when Plannora is named, it sits almost as high as Loopcraft does. Plannora's problem is being left out, not being placed low.

### Step 2: The head-to-head score by prompt type

| Prompt type (answers) | vs Loopcraft, wins–losses | Score | vs Taskwell, wins–losses | Score |
| --- | --- | --- | --- | --- |
| Problem queries (72) | 9–43 | 17.3% | 16–19 | 45.7% |
| Alternative searches (54) | 6–12 | 33.3% | 7–16 | 30.4% |
| Feature-led comparisons (36) | 22–5 | 81.5% | 21–4 | 84.0% |
| Head-to-head verdicts (18) | 1–7 | 12.5% | 6–2 | 75.0% |
| **All 180 answers** | **38–67** | **36.2%** | **50–41** | **54.9%** |

The totals check out: against Loopcraft, 9 + 6 + 22 + 1 = 38 wins and 43 + 12 + 5 + 7 = 67 losses. The alternative rows only count the prompts that don't name the rival: Plannora meets Loopcraft in the two "alternatives to Taskwell" prompts, and Taskwell in the three "alternatives to Loopcraft" prompts.

Plannora's Rival Matrix Score is 88 wins out of 196 contests, or **44.9%**. With 196 contests, the margin is ±7.0 points, so the true figure sits somewhere between about 38% and 52%.

### Step 3: Is each gap real?

- **Against Loopcraft: 36.2% ± 9.2**, a range of 27% to 45%. The whole range is below 50%, so Loopcraft really is recommended over Plannora more often than not.
- **Against Taskwell: 54.9% ± 10.2**, a range of 45% to 65%. That range includes 50%, so Plannora can't yet claim to beat Taskwell. It is roughly even.
- **Problem queries against Loopcraft: 17.3% ± 10.3** across 52 contests. Even the top of that range is far below even. This is the biggest gap in the matrix.

The head-to-head verdict row is striking (Loopcraft picked 7 times out of 9), but it rests on only eight contests. On its own, it's a hint. Step 4 explains it.

### Step 4: Where the AI citations come from

Across the 180 answers, the engines made 647 AI citations, each one a cited URL. 162 answers cited at least one source.

| Source | Cited URLs | Citation Share | Answers citing it | Citation Rate |
| --- | --- | --- | --- | --- |
| plannora.io | 75 | 11.6% | 59 | 32.8% |
| loopcraft.ai | 84 | 13.0% | 68 | 37.8% |
| Taskwell's site | 46 | 7.1% | 40 | 22.2% |
| Review sites | 158 | 24.4% | 105 | 58.3% |
| Reddit and forums | 111 | 17.2% | 79 | 43.9% |
| Other sites | 173 | 26.7% | 106 | 58.9% |

Overall, plannora.io earns almost as many AI citations as loopcraft.ai: 11.6% of cited URLs against 13.0%. The split by engine tells a different story. In Perplexity, plannora.io earned 47 of 326 cited URLs (14.4%) to Loopcraft's 36 (11.0%). In Google AI Mode, it earned 21 of 205 (10.2%) to Loopcraft's 36 (17.6%). In ChatGPT, it earned 7 of 116 (6.0%) to Loopcraft's 12 (10.3%).

The gap list explains the verdict row. One made-up review page, a stackreview.co roundup of project tools, was cited in 50 of the 180 answers (27.8%). It names Loopcraft and Taskwell but not Plannora. A second page on the same site, "Loopcraft vs Plannora," was cited in 19 answers, and its verdict favors Loopcraft. In this example, the engines echo the pages they read.

### Step 5: What Plannora does next

1. **Write problem-led pages.** Plannora wins when buyers name features (81.5% and 84.0%) and loses when they describe the pain (17.3% against Loopcraft). It needs pages that answer the problem prompts in buyers' words, such as a guide to managing client feedback in agencies.
2. **Fix the pages behind the AI citations.** Plannora publishes its own fair "Plannora vs Loopcraft" page with current facts and asks stackreview.co to review Plannora for its roundup.
3. **Watch the defensive prompt.** In "alternatives to Plannora," Loopcraft was named in 7 of 9 answers and came first in 5. Plannora's existing customers are being pointed at Loopcraft.
4. **Rerun in four to six weeks** with the same 20 prompts, and compare each head-to-head score against its margin.

## How to Read Your Benchmark

| What you see | Likely cause | What to do |
| --- | --- | --- |
| High Share of Model, low First-Mention Rate | Engines know you but rank a rival as the default | Find the pages that name the rival first; give buyers a clear reason to pick you |
| You win feature prompts, lose problem prompts | Your pages describe features, not the jobs buyers need done | Write pages that answer problem questions in the buyer's words |
| You're named often but earn few AI citations | Engines learn about you from other sites' pages | Improve the cited third-party pages, and publish your own page on the same question |
| High Citation Rate but low Share of Model | Your pages are used as sources, but your name isn't carried into the answer | Put your brand name and the claim in the same sentence near the top of the page |
| A rival wins in one engine only | That engine reads different sources, or can't reach your pages | Compare cited domains for that engine; check that its crawler can reach you |
| Score within the margin of 50% | Not enough contests yet | Add runs or another engine before you act |

Two checks stop most bad readings. First, compare like with like. If a rival blocks an engine's crawler, a low score there reflects its choice, not its content. Our [AI Bot Crawler Census](/blog/ai-bot-crawler-census) shows how often sites block each bot. Second, don't read a single month as a trend. Our guide to [benchmarking AI search performance](/blog/how-to-benchmark-ai-search-performance) has the table of how big a gap must be at each panel size.

If your competitor benchmark keeps moving because engines change, the control-prompt test in our [GEO measurement guide](/blog/how-to-measure-geo) separates your work from that drift.

## Tools That Report Competitor Share of Voice

You don't need software for a one-off matrix. A spreadsheet works. But the old idea that SEO tools only show keyword overlap with rivals is out of date. As of September 2026, several trackers report AI share of voice against named competitors, and each defines it a little differently. Prices below are as listed on 28 September 2026, billed monthly.

| Tool | What it reports against rivals | How it defines the key metric | Entry price |
| --- | --- | --- | --- |
| [Peec AI](https://peec.ai/pricing) | Visibility, position, sentiment and share of voice "tracked daily against competitors," plus a gap analysis of sources that name rivals but not you | Share of voice is your mentions ÷ all tracked-brand mentions; position counts every brand in the answer | $95/month (Starter, 50 prompts) |
| [Semrush AI Visibility Toolkit](https://www.semrush.com/pricing/ai/) | Competitor Research, with "Missing" and "Weak" topics and prompts | [Average Position](https://www.semrush.com/kb/1594-ai-seo-metrics) is where a citation of your domain appears, such as first citation | $99/month per domain (25 prompts) |
| [Ahrefs Brand Radar](https://ahrefs.com/brand-radar) | Mentions, citations and AI share of voice against competitors | Its [help center](https://help.ahrefs.com/en/articles/15501968-ai-visibility-metrics) defines AI Share of Voice as a brand's share of impressions, which are weighted by the search volume of each prompt | Custom prompts from $50/month; the AI Visibility Index from $199/month |
| [SE Visible](https://visible.seranking.com/) | Visibility against competitors, with the sources and prompts that favor them | Its API returns Visibility Score, Share of Voice and average position | $99/month (Basic, 200 prompts) |
| [Otterly.AI](https://otterly.ai/features) | Brand Report benchmarks for brand mentions, brand coverage and domain citations | Compares you with your competitors on each KPI | [$29/month](https://otterly.ai/pricing) (Lite, 15 prompts) |
| [Profound](https://www.tryprofound.com/features/answer-engine-insights) | Competitive benchmarking, share of voice and "competitor rankings" | Visibility score and share of voice | [Free 7-day trial](https://www.tryprofound.com/pricing), then a custom Enterprise contract |

The definitions matter more than the prices. Semrush's average position follows the order of citations, while Peec's follows the order of brands named in the text, so the two can disagree about the same answer. Ahrefs weights share of voice by search volume, while Peec counts mentions equally. Before you compare your matrix with a dashboard, check which formula the dashboard uses.

Two first-party reports show your own AI citations or AI impressions, though neither names rivals. Bing Webmaster Tools reports Citation Share across Copilot, Bing and select partner AI experiences, but Microsoft's [June 2026 post](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare) says it "does not expose competitor domains." Google's [generative AI performance report](https://support.google.com/webmasters/answer/16984139) in Search Console shows how your own site performs in AI Overviews and AI Mode. For a fuller list of trackers and the questions to ask them, see our [ChatGPT rank tracker guide](/blog/chatgpt-rank-tracker).

## Where Rankbox Helps After the Benchmark

Rankbox doesn't track AI citations, mentions or share of voice today, so it won't run the matrix for you. Use a spreadsheet, the free Prompt Kit or one of the trackers above for that part.

Rankbox helps with what the matrix tells you to fix. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI in your category, which is a good source for the problem queries you're losing. The [Citation-Ready Writer](/features/citation-ready-writer) then drafts source-backed articles for those questions, and they reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### How do I benchmark my brand's AI citations against competitors?

Run a fixed set of about 20 buyer prompts in each AI engine, three times each, and log every brand named and every page cited. Then compute each rival's Share of Model, Citation Rate and Citation Share, plus a head-to-head score: how often answers recommend you over that rival.

### How many prompts do I need to benchmark AI citations?

Twenty prompts is enough if you run them on three engines, three times each, for 180 answers. What counts is the number of answers and contests, not the number of prompts. Below about 100 contests per rival, margins pass ±10 points, so add runs before you act on a small gap.

### What is a good head-to-head score against a competitor?

Anything reliably above 50% means answers recommend you over that rival more often than not. "Reliably" means the whole margin sits above 50%. A score of 55% with a ±10-point margin is a tie, not a win. Compare the score by prompt type too, since most brands win some types and lose others.

### What's the difference between AI citations and brand mentions?

A brand mention is your name in the answer text. An AI citation is a link to your page as a source. They often split: in Semrush's 2026 study, 62% of AI citations linked a page without naming the brand. Benchmark both, because each gap has a different fix.

### Which AI engines should I include in the benchmark?

Include the engines your buyers use, benchmarked one by one. For most software brands that's ChatGPT, Perplexity and Google AI Mode, with Gemini or Claude as a fourth. Report each engine on its own, because a rival can lead in one engine and trail in another.

### How often should I rerun the competitor benchmark?

Rerun the full matrix every four to six weeks, or after you publish pages aimed at a gap. Keep the prompts identical between runs, so changes in AI citations reflect the engines and your pages, not your wording. For weekly monitoring of rivals between benchmarks, use a smaller tracker panel and a rolling four-week window.

## References

1. [AIs are highly inconsistent when recommending brands or products, SparkToro, January 2026](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
2. [The ghost citations study, Semrush, June 2026](https://www.semrush.com/blog/the-ghost-citations-study/)
3. [Don't Measure Once: Measuring Visibility in AI Search (Schulte, Bleeker and Kaufmann, 2026)](https://arxiv.org/abs/2604.07585)
4. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
5. [AI instructions, Peec AI](https://peec.ai/ai-instructions)
6. [Pricing, Peec AI](https://peec.ai/pricing)
7. [AI Visibility pricing, Semrush](https://www.semrush.com/pricing/ai/)
8. [AI Visibility metrics, Semrush Knowledge Base](https://www.semrush.com/kb/1594-ai-seo-metrics)
9. [Brand Radar, Ahrefs](https://ahrefs.com/brand-radar)
10. [AI visibility metrics, Ahrefs Help Center](https://help.ahrefs.com/en/articles/15501968-ai-visibility-metrics)
11. [SE Visible plans and FAQ, SE Ranking](https://visible.seranking.com/)
12. [Features, Otterly.AI](https://otterly.ai/features)
13. [Pricing, Otterly.AI](https://otterly.ai/pricing)
14. [Answer Engine Insights, Profound](https://www.tryprofound.com/features/answer-engine-insights)
15. [Pricing, Profound](https://www.tryprofound.com/pricing)
16. [New AI visibility insights in Bing Webmaster Tools, Microsoft Bing, June 2026](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare)
17. [Generative AI performance report, Search Console Help](https://support.google.com/webmasters/answer/16984139)
