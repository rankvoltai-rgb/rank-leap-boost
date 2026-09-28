---
title: Is It Possible to Track Brand Mentions in AI Answers? (The Technical Reality)
description: Can you track brand mentions in AI answers? As rates, yes. How temperature, seeds, search and memory change answers, and how many runs you need.
keyword: brand mentions in AI answers
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Measurement
---

Yes, but not one answer at a time. You can't track brand mentions in AI answers the way you track a Google ranking, because the same prompt returns a different answer on almost every run. What you can track is a rate: how often your brand is named across many runs of many prompts, reported with a margin of error.

The variation isn't a bug in the tools. It comes from how the systems work. Chat models choose each word by sampling from probabilities. The web results they read shift from hour to hour. Memory, location and search history change what each person sees. And buyers phrase the same need in very different ways. When SparkToro and Gumshoe had 600 volunteers run 12 prompts a combined 2,961 times, they found [less than a 1-in-100 chance](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/) that ChatGPT or Google's AI would give the same list of brands in any two responses.

This post takes each cause in turn, sourced to OpenAI's, Anthropic's and Google's own documentation as of September 2026. Then it does the arithmetic: what a single check can tell you, how many runs give a ±5-point answer, and why batches of many prompts work. For the short, buyer-facing version, read our answer to [whether you can track brand mentions in AI search](/blog/is-it-possible-to-track-brand-mentions-in-ai-search).

## Key Takeaways

- One check can't tell you whether an AI engine mentions your brand. If your true rate is 30%, a single check comes back empty 70% of the time, and three checks all miss about a third of the time.
- Sampling is the root cause. OpenAI's GPT-6 Astra and every Claude model released after Opus 4.6 reject a custom temperature, and the ChatGPT, Claude and Gemini apps offer no temperature or seed setting at all.
- Temperature 0 and a fixed seed don't guarantee identical answers. Anthropic and Google both say so, and OpenAI now marks its `seed` parameter as deprecated.
- The sources move too. In a 2026 study, runs of the same prompt within 24 hours shared only 32% to 43% of their cited sources.
- Memory, location and search history shape each person's answer, so a tracker measures a clean reference session, not what one buyer saw.
- Brand mentions in AI answers become measurable as a rate with a stated error. About 385 answers give ±5 points in the worst case.
- For the same number of answers, more prompts beat more runs of one prompt, because runs of the same prompt tend to agree with each other.

## Temperature, Sampling and Seeds in Plain Words

Sampling is the first reason brand mentions in AI answers vary. A language model writes one token (a word or part of a word) at a time. At each step it gives every possible next token a score, turns the scores into probabilities, and picks one. Always taking the top token is called greedy decoding. Picking at random, weighted by the probabilities, is called sampling. Chat products sample, so two runs of one prompt can drift apart.

Temperature sets how bold that pick is. Google's [prompt design guide](https://ai.google.dev/gemini-api/docs/prompting-strategies) says lower temperatures suit prompts "that require a more deterministic or less open-ended response, while higher temperatures can lead to more diverse or creative results." Top-p, also called nucleus sampling, trims the list before the pick. OpenAI's [API reference](https://developers.openai.com/api/reference/resources/responses/methods/create) explains that a top_p of 0.1 "means only the tokens comprising the top 10% probability mass are considered."

### A toy example: who gets named first

Picture a model about to name the first tool in an answer to "best project management tool for agencies." The scores below are made up to show the mechanism. They don't come from any real model, and all four brands are fictional.

| Candidate | Score | Greedy (T→0) | T = 0.5 | T = 1.0 | T = 1.5 |
| --- | --- | --- | --- | --- | --- |
| Loopcraft | 2.0 | 100% | 59.1% | 43.1% | 37.1% |
| Plannora | 1.6 | 0% | 26.6% | 28.9% | 28.4% |
| Taskwell | 1.2 | 0% | 11.9% | 19.4% | 21.8% |
| Brightdesk | 0.4 | 0% | 2.4% | 8.7% | 12.8% |

Each probability is e raised to (score ÷ T), divided by the same sum for all four. At T = 1.0, Plannora gets e^1.6 = 4.953 out of a total of 17.154, which is 28.9%. So a runner-up brand still leads the list in more than one run in four. Add a top-p of 0.9 and Brightdesk drops out, because the top three already hold 91.3% of the probability. A real answer repeats this draw for every token, which is why whole lists reshuffle and brand mentions in AI answers come and go between runs.

### What OpenAI, Anthropic and Google document

| | Temperature | Seed | Newest models |
| --- | --- | --- | --- |
| OpenAI | 0 to 2 in the [Chat Completions reference](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create); "We generally recommend altering this or top_p but not both" | `seed` is labeled Deprecated: a "best effort" where "Determinism is not guaranteed." The Responses API lists no seed | [Model guidance](https://developers.openai.com/api/docs/guides/latest-model): when reasoning effort is not `none`, remove `temperature` and `top_p`. GPT-6 Astra doesn't support `none` |
| Anthropic | 0.0 to 1.0, default 1.0, in the [Messages API reference](https://platform.claude.com/docs/en/api/messages/create) | No seed parameter | "Models released after Claude Opus 4.6 do not support setting temperature." A value of 1.0 is accepted; others return an error |
| Google | 0.0 to 2.0, default varies by model, in the [Gemini API reference](https://ai.google.dev/api/generate-content) | `seed` is optional; "If not set, the request uses a randomly generated seed" | For Gemini 3.x, Google "strongly recommend[s]" keeping temperature, top_p and top_k at their defaults |

The trend is clear. The newest models from all three vendors reject a custom temperature, accept one only with reasoning switched off, or come with advice not to change it. Sampling at the default is simply how AI answers are made now.

### Why temperature 0 still isn't the same answer twice

Setting temperature to 0 was never a guarantee. Anthropic's reference says that "even with temperature of 0.0, the results will not be fully deterministic," and its [migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide) adds that temperature 0 "never guaranteed identical outputs on prior models." Google's own pages disagree slightly. The Gemini API guide calls temperature 0 deterministic, while [Google Cloud's parameter docs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/content-generation-parameters) say answers are "mostly deterministic, but a small amount of variation is still possible." The same Cloud page says a fixed seed is a "best effort" and "Deterministic output isn't guaranteed."

The Cloud wording matches what engineers measure. Thinking Machines Lab [sampled 1,000 completions at temperature 0](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/) from one open model and got 80 different completions. The cause was server load: the number of requests processed together changes the order of the math, and so the result. Earlier, [Atil and colleagues](https://arxiv.org/abs/2408.04667) ran five models set to be deterministic 10 times each and saw accuracy vary by up to 15%.

### The apps have no dial

Everything above is a developer setting. The ChatGPT, Claude and Gemini apps show no temperature, top-p or seed control. The vendors document those dials only for developer tools: OpenAI's [Playground](https://help.openai.com/en/articles/6643200-why-am-i-getting-different-completions-on-playground-vs-the-api), the [Claude Console playground](https://support.claude.com/en/articles/8606378-how-do-i-use-the-playground), where you "adjust parameters like temperature," and the Run settings panel in [Google AI Studio](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart). Google's AI Overviews and AI Mode sit inside Search with no model settings at all.

So brand mentions in AI answers are always sampled at whatever setting the product uses. You can't switch that off to get a cleaner reading. You can only take more readings.

## Retrieval Variance: The Sources Shift Under the Answer

Many AI answers are grounded in a live web search, and search adds its own layer of change on top of sampling. That matters for brand mentions in AI answers, because the pages an engine reads decide which brands it can name.

- **The query gets rewritten.** OpenAI's [ChatGPT search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says it "typically rewrites your query into one or more targeted queries" for its search providers, then may send more specific queries after reading the first results. Different rewrites surface different pages, and different pages name different brands. The glossary entry on [query fan-out](/glossary/query-fan-out) explains the pattern.
- **The model may not search at all.** OpenAI's [web search tool guide](https://developers.openai.com/api/docs/guides/tools-web-search) says "the model can choose to search the web or not." In the ["Don't Measure Once"](https://arxiv.org/abs/2604.07585) study, only 42.2% of ChatGPT runs returned at least one citation, which the authors tie to its "tendency to suppress web search on definitional queries." One run may come from training memory and the next from a fresh search.
- **The cited pages churn.** Ahrefs tracked 43,000+ keywords, each with at least 16 recorded AI Overviews, for a month. It found [a 70% chance](https://ahrefs.com/blog/ai-overview-change/) the content changed between observations, and 45.5% of cited URLs were new each time. Only 54% of entities, the named things such as brands, stayed.
- **Within a day, not just over weeks.** The "Don't Measure Once" authors re-ran identical prompts inside a 24-hour window on ChatGPT, Gemini, Google AI Mode and Perplexity. Source overlap averaged 32% to 43%, and brand overlap ranged from 33% to 48%.

Microsoft says the same about its own data. Its [June 2026 Bing Webmaster Tools update](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare) warns that "citation patterns can shift due to changes in user behavior, evolving models, freshness signals, partner refresh cycles, and broader changes across the web itself."

There is a steady core under the churn. Ahrefs measured an average semantic similarity of 0.95 between consecutive AI Overviews, so the meaning held while the words and sources changed. That is why brand mentions in AI answers can be tracked as frequencies even though no two answers match.

## Personalization, Memory and Location

The third source of variation in brand mentions in AI answers is the person asking. Each vendor documents it.

- **ChatGPT.** "If memory is enabled, ChatGPT may use relevant saved memories when rewriting a search query," says OpenAI's search help page, with the example of a vegan user in San Francisco. It also infers an approximate location from your IP address, and "A VPN or network location may affect" it. A temporary chat can be set to Unpersonalized, which skips memories and custom instructions, according to the [Memory FAQ](https://help.openai.com/en/articles/8590148-memory-faq).
- **Claude.** An [incognito chat](https://support.claude.com/en/articles/12260368-use-incognito-chats) won't use Claude's existing memory. But the same page says Claude can still read your profile preferences and custom styles inside it.
- **Google.** Search uses "your location, past Search history, and Search settings to determine what is most relevant for you," per its [ranking explainer](https://www.google.com/search/howsearchworks/how-search-works/ranking-results/). In May 2026 Google [expanded Personal Intelligence in AI Mode](https://blog.google/products-and-platforms/products/search/search-io-2026/) to nearly 200 countries and territories. People who opt in can connect Gmail and Google Photos.

This sets a hard limit. A tracker can only measure a clean, neutral session from one location. Your buyer's session carries their memory, history and city. So a tracked rate is a reference reading of the engine, not a record of what any one customer saw. The SparkToro volunteers kept their own settings on purpose, so that study's spread includes personalization. A clean tracker's spread is narrower but less like real life. Our post on [how AI search uses user intent and context](/blog/how-ai-search-uses-user-intent-and-context) covers what these signals do to answers.

## Prompt Permutations: Nobody Asks the Same Way Twice

The last source is the prompt itself. Small wording changes can move model output a long way. In an ICLR 2024 paper, [Sclar and colleagues](https://arxiv.org/abs/2310.11324) found formatting changes that kept the meaning the same could swing accuracy by up to 76 points on LLaMA-2-13B. They advise reporting a range across plausible formats instead of one number from one format.

Real buyers vary far more than formatting. SparkToro collected 142 prompts people wrote for the same need, headphones for a traveling family member, and found an average semantic similarity of just 0.081. Yet across the 994 answers those prompts produced, Bose, Sony, Sennheiser and Apple each showed up 55% to 77% of the time. The wording scattered. The brand set held. That's good news for anyone measuring brand mentions in AI answers.

The "Don't Measure Once" data show the same risk from the other side. Prompt-level overlap scores inside one vertical ran from below 0.2 to above 0.8, so a panel of one or two prompts mostly measures those prompts' quirks. So that brand mentions in AI answers don't just reflect one wording's quirks, track several phrasings of each buying intent, not one "keyword prompt."

## What the Consistency Studies Found

| Study | Date | What was tested | Key finding |
| --- | --- | --- | --- |
| SparkToro and Gumshoe | Jan 2026 (runs Nov–Dec 2025) | ChatGPT, Claude, Google AI Overviews and AI Mode; 12 prompts, 2,961 runs | Under 1 in 100 chance of the same brand list twice; about 1 in 1,000 for the same order |
| Ahrefs | Nov 2025, updated Aug 2026 | 43,000+ keywords with 16+ AI Overviews each, over a month | 70% chance of changed content; 45.5% of citations new each time |
| Schulte, Bleeker and Kaufmann | Apr 2026 | ChatGPT, Gemini, AI Mode, Perplexity; four Swiss-German verticals, 8 prompts each | 32% to 43% source overlap within 24 hours; at least 7 runs per prompt per day advised |
| Thinking Machines Lab | Sep 2025 | 1,000 completions at temperature 0 on one open model | 80 unique completions |
| Atil et al. | Aug 2024 | Five models set to be deterministic, 8 tasks, 10 runs | Accuracy varied by up to 15% |

Read together, the studies say the same thing about brand mentions in AI answers. Single answers are unstable, but how often a brand appears is steady enough to measure. In SparkToro's data, one cancer hospital appeared in 69 of 71 ChatGPT answers. SparkToro's own conclusion is that "visibility % across dozens to hundreds of prompts run multiple times is a reasonable metric," while any tool reporting a single "ranking position in AI" is "full of baloney."

## The Statistics of Tracking Brand Mentions in AI Answers

To measure brand mentions in AI answers, treat each answer as a weighted coin flip: your brand is named, or it isn't. The chance of heads is your true mention rate for that prompt and engine. Everything below follows from that one idea.

### What one check can tell you

| True mention rate | One check shows "not named" | Two checks disagree | Three checks all miss |
| --- | --- | --- | --- |
| 10% | 90% | 18% | 72.9% |
| 30% | 70% | 42% | 34.3% |
| 50% | 50% | 50% | 12.5% |
| 70% | 30% | 42% | 2.7% |

The math is simple: a miss has chance 1 − p, two checks disagree with chance 2p(1 − p), and three misses in a row have chance (1 − p)³. A brand named in 30% of answers looks invisible after three checks about a third of the time. Two colleagues who each check once will disagree 42% of the time.

### A confidence interval for a mention rate

Say Plannora, a fictional project management tool, runs 40 prompts three times each in one engine and is named in 42 of the 120 answers.

1. **Rate:** 42 ÷ 120 = 35.0%.
2. **Standard error:** √(0.35 × 0.65 ÷ 120) = 0.0435.
3. **Margin at 95% confidence:** 1.96 × 0.0435 = 0.085, or 8.5 points.
4. **Report it as a range:** 35% named, likely between 26.5% and 43.5%.

This simple formula breaks near 0% or 100%. SparkToro's hospital, at 69 of 71 answers, would get a range of 93.3% to 101.0%, which is impossible. The Wilson interval, which most statistics tools offer, gives 90.3% to 99.2%. Use Wilson whenever a rate sits below 10% or above 90%, or the sample is small.

### How many answers give ±5 points

Flip the formula to find the sample size: n = 1.96² × p(1 − p) ÷ E², where E is the margin you want. The worst case is p = 50%: 3.8415 × 0.25 ÷ 0.0025 = 384.1, so 385 answers.

| Target margin | Rate near 10% | Rate near 30% | Rate near 50% |
| --- | --- | --- | --- |
| ±10 points | 35 answers | 81 answers | 97 answers |
| ±5 points | 139 answers | 323 answers | 385 answers |
| ±3 points | 385 answers | 897 answers | 1,068 answers |

Those are answers, not runs of one prompt. A panel of 55 prompts run 7 times gives 385. Comparing two periods or two brands needs more, because both numbers carry error. Our guide to [benchmarking AI search performance](/blog/how-to-benchmark-ai-search-performance) gives the smallest gap you can trust at each panel size.

### Why batches work, and why more prompts beat more runs

Runs of one prompt aren't independent. If a prompt's search tends to surface a roundup that lists you, most runs of that prompt name you. Statisticians handle this with a design effect: deff = 1 + (m − 1) × ρ, where m is runs per prompt and ρ is how strongly runs of the same prompt agree. Divide your answer count by deff to get the effective sample.

Here is the same 400 answers split four ways, at a 30% mention rate and an illustrative ρ of 0.3. Your real ρ is unknown until you measure it.

| Prompts × runs | Design effect | Effective sample | Margin |
| --- | --- | --- | --- |
| 400 × 1 | 1.0 | 400 | ±4.5 points |
| 100 × 4 | 1.9 | 211 | ±6.2 points |
| 40 × 10 | 3.7 | 108 | ±8.6 points |
| 10 × 40 | 12.7 | 32 | ±16.0 points |

Ten prompts run 40 times each look like a big sample, but they behave like 32 independent answers. That's why "Don't Measure Once" advises a broad prompt portfolio as well as repeat runs, and why batches are the only reliable way to measure brand mentions in AI answers. Repeats smooth out sampling. Breadth covers the many ways buyers ask.

A small simulation shows batches at work. Take a made-up 40-prompt panel whose true rate is 24.7%, with each prompt's own rate anywhere from 0% to 98%, and run it 10,000 times. One prompt with a true 21.6% rate, checked once, reads 0% or 100%. Checked 10 times, it lands anywhere from 0% to 50%. The whole panel run 3 times (120 answers) lands between 19.2% and 30.8% in 95% of trials, and run 7 times (280 answers), between 20.7% and 28.9%.

### When the count is zero

Zero mentions doesn't prove a zero rate. After 0 of n answers, the 95% upper bound on the true rate is 1 − 0.05^(1/n). That's 25.9% after 10 answers, 9.5% after 30 and 3.0% after 100. The quick version is the "rule of three": divide 3 by the number of answers.

## The Noise Budget: What a Batch Fixes and What It Doesn't

Rankbox's Noise Budget sorts every source of variation in brand mentions in AI answers by what you can do about it. Batching fixes some rows. Prompt design fixes one. The rest you disclose.

| Source of noise | Where it comes from | Can you switch it off? | What a batch does | What's left to disclose |
| --- | --- | --- | --- | --- |
| Sampling | The token-by-token draw at the product's temperature | No: the apps have no setting | Averages out as answers grow | Nothing; it shrinks with more answers |
| Serving noise | Server load and batch size | No | Averages out | Nothing |
| Retrieval churn | Query rewrites, fresh pages, whether the model searches | No | Averages out over a 2–4 week window | Real source shifts, which are signal |
| Prompt wording | How buyers phrase the need | Partly: you choose the phrasings | Several phrasings per intent | Your panel still isn't every buyer's wording |
| Personalization | Memory, history, IP location, connected apps | For your readings, yes | Nothing: clean runs stay clean | Your rate is a neutral reference, not a buyer's view |
| Product changes | New models, search modes, providers | No | Nothing: it's a real change | Mark the date as a break in the trend |

A good report on brand mentions in AI answers says which rows its number controls. "Named in 35% of 120 clean, logged-out ChatGPT answers across 40 prompts in September, ±8.5 points" is honest. "We rank #2 in ChatGPT" is not.

## So Can You Track Brand Mentions in AI Answers?

You can't track exact answers, because each one is a single draw that won't come back the same way. Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) is blunt about outside tools: "No third-party tool has access to our internal ranking or AI systems."

You can track rates, within a stated error. Brand mentions in AI answers behave like any sampled measure, and the fixes are the ones polling uses:

1. **Fix the conditions.** Use logged-out or unpersonalized sessions, one location, and a note of the engine, mode and model shown.
2. **Sample widely.** Use many prompts with several phrasings per intent, then repeat runs. Breadth first.
3. **Pool over time.** Read rates over two to four weeks. "Don't Measure Once" found a 28-day window cut the 95% margin on a brand's detection rate to ±6.5 points, against ±63 points for a single day.
4. **Always show the error.** Report the count, the rate and the range together.
5. **Watch for breaks.** A model launch or a new search mode resets the baseline.

To run this every week, follow our guide to [tracking brand mentions in AI search](/blog/how-to-track-brand-mentions-in-ai-search), which covers the prompt set, cadence, recording template and alert rules. The formulas for visibility rate, Share of Model and the other rates you can compute from brand mentions in AI answers are defined in [the GEO Metrics Framework](/blog/geo-metrics-framework). The [GEO measurement guide](/blog/how-to-measure-geo) turns this into a full reporting program, and the [ChatGPT rank tracker roundup](/blog/chatgpt-rank-tracker) lists the questions to ask a vendor, such as how many runs it takes per prompt and whether it reads the app or the API. Our glossary entry on [AI share of voice](/glossary/ai-share-of-voice) covers the rate you'll most often report.

## Where Rankbox Fits

Rankbox doesn't track brand mentions in AI answers today, so it won't run your panel or report your rate. For that, use a spreadsheet and the free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator), Bing Webmaster Tools' AI Performance report for Copilot, GA4 for AI referral visits, or a third-party tracker.

Rankbox works on the other side of the rate: earning more mentions. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI in your category, which is also a good source of prompt phrasings. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### Why does ChatGPT give a different answer every time?

ChatGPT samples each word from probabilities instead of always picking the most likely one, and it often runs a fresh web search that returns different pages. That's why brand mentions in AI answers shift between runs. Memory and location add more variation. So repeated runs name different brands, even for the same prompt.

### Does setting temperature to 0 make AI answers consistent?

No. Anthropic says results at temperature 0 "will not be fully deterministic," and Google Cloud says small variation is "still possible." Server load also changes results. On OpenAI's GPT-6 Astra and on Claude models released after Opus 4.6 you can't set it anyway, and the consumer apps have no such setting.

### How many runs do you need to track brand mentions in AI answers?

About 385 answers give a ±5-point margin in the worst case, and 97 give ±10. Spread them across many prompts rather than repeating a few, because runs of the same prompt tend to agree. The "Don't Measure Once" study advises at least 7 runs per prompt per day, pooled over two to four weeks.

### Can you see what ChatGPT tells a specific customer?

No. What one customer sees can reflect their memory, chat history, location and connected apps, and none of that is visible to you. A tracker measures a clean, neutral session, which is a reference point for the engine, not a copy of any buyer's screen.

### Is tracking brand mentions in AI answers accurate?

It's accurate as a rate with a margin of error, not as a snapshot. A panel of 120 answers gives roughly ±8 to ±9 points; 385 answers give ±5 at worst. Any report without a sample size and a range can't be checked.

### Does the OpenAI seed parameter make answers repeatable?

Not reliably. OpenAI's API reference labels `seed` as deprecated and calls it a "best effort" where "Determinism is not guaranteed." The newer Responses API has no seed parameter, and ChatGPT's app doesn't expose one.

## References

1. [Create chat completion, OpenAI API Reference](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)
2. [Create a model response, OpenAI API Reference](https://developers.openai.com/api/reference/resources/responses/methods/create)
3. [Model guidance, OpenAI API](https://developers.openai.com/api/docs/guides/latest-model)
4. [Web search tool guide, OpenAI API](https://developers.openai.com/api/docs/guides/tools-web-search)
5. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
6. [Memory in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/8590148-memory-faq)
7. [Create a Message, Claude API Reference](https://platform.claude.com/docs/en/api/messages/create)
8. [Migrating to Claude Opus 5.5, Claude Platform Docs](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide)
9. [Use incognito chats, Claude Help Center](https://support.claude.com/en/articles/12260368-use-incognito-chats)
10. [Generating content, Gemini API Reference](https://ai.google.dev/api/generate-content)
11. [Prompt design strategies, Gemini API](https://ai.google.dev/gemini-api/docs/prompting-strategies)
12. [Content generation parameters, Google Cloud Documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/content-generation-parameters)
13. [How Google determines ranking results, Google Search](https://www.google.com/search/howsearchworks/how-search-works/ranking-results/)
14. [A new era for AI Search (I/O 2026), Google](https://blog.google/products-and-platforms/products/search/search-io-2026/)
15. [AIs are highly inconsistent when recommending brands or products, SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
16. [AI Overviews change every 2 days, Ahrefs](https://ahrefs.com/blog/ai-overview-change/)
17. [Don't Measure Once: Measuring Visibility in AI Search (Schulte, Bleeker and Kaufmann, 2026)](https://arxiv.org/abs/2604.07585)
18. [Defeating Nondeterminism in LLM Inference, Thinking Machines Lab](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
19. [Non-Determinism of "Deterministic" LLM Settings (Atil et al., 2024)](https://arxiv.org/abs/2408.04667)
20. [Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design (Sclar et al., ICLR 2024)](https://arxiv.org/abs/2310.11324)
