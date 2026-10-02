---
title: Brand Sentiment & Mention Monitoring in ChatGPT
description: Brand sentiment in ChatGPT: what shapes how it describes you, a scoring rubric for a prompt panel, how to split wrong facts from opinions, and clean runs.
keyword: brand sentiment
date: 2026-11-04
updated: 2026-11-04
written: 2026-10-01
author: Rankbox Team
tags: AI Search, Brand Strategy
---

Brand sentiment in ChatGPT is the way ChatGPT describes your brand when a buyer asks about it: which traits it ties to you, whether those traits sound good or bad, and whether the facts behind them are true. To monitor it, run a fixed panel of prompts in clean sessions, score every claim ChatGPT makes about you with a written rubric, and read the results as rates across many runs, not as one screenshot.

Mentions tell you whether you're in the answer. Sentiment tells you what the answer says once you're in it. That second question is where deals are won or lost. In a [March 2026 BrightEdge release](https://www.brightedge.com/news/press-releases/brightedge-data-google-ai-overviews-more-likely-to-criticize-brands-than-chatgpt), negative sentiment showed up in about 1.6% of ChatGPT's brand mentions, but 19.4% of that negativity came at the consideration-to-purchase stage, against 1.5% for Google's AI Overviews. ChatGPT's criticism, BrightEdge says, centers on "compatibility limitations, feature shortcomings, and 'is it worth it?' assessments."

This guide covers ChatGPT only, and it leads with brand sentiment: what ChatGPT says about you. For the cross-engine system (prompt buckets, a recording template and alert rules), read our guide to [tracking brand mentions in AI search](/blog/how-to-track-brand-mentions-in-ai-search). For a practical weekly routine, see [how to monitor brand mentions in ChatGPT](/blog/monitor-brand-mentions-in-chatgpt). For moving the numbers in both ChatGPT and Perplexity, see [how to optimize brand mentions in ChatGPT and Perplexity](/blog/optimize-brand-mentions-in-chatgpt-and-perplexity).

## Key Takeaways

- Three layers shape brand sentiment in ChatGPT: what the model learned in training, the pages it reads when it searches, and the memory and location of the person asking. OpenAI documents each one.
- OpenAI says ads "do not influence ChatGPT's answers." Ads have shown below some answers for Free and Go users since testing began on 9 February 2026, so never score a sponsored unit as sentiment.
- Score brand sentiment claim by claim, not answer by answer. Rankbox's Attribute Sentiment Grid rates each claim about you from −2 to +2 against fixed anchor sentences, then rolls the scores up by attribute.
- Sort every negative claim into one of three bins before you act: wrong fact, unsupported claim or real opinion. Each bin has a different fix.
- Run sentiment checks signed out or in a Temporary Chat set to Unpersonalized. A personalized temporary chat can use your memories.
- Read share of voice and sentiment over pooled runs. One ChatGPT answer is an anecdote, and a small panel needs a four-week window before a change means much.
- Rankbox doesn't track mentions, citations or sentiment. It helps after you've found the gap, with research and source-backed articles.

## What Shapes Brand Sentiment in ChatGPT

ChatGPT doesn't look up a "brand score." It writes an answer from three layers of input, and each layer changes on its own clock. Knowing which layer produced a sentence tells you what can change it.

| Layer               | What OpenAI documents                                                                          | What it means for brand sentiment             | How fast it changes     |
| ------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------- |
| Training data       | Models learn from public web pages, partner data and data from users, trainers and researchers | The default traits ChatGPT links to your name | Slowly, with new models |
| Live search         | ChatGPT "may search the web automatically" and rewrites your question into targeted queries    | Today's reviews, threads and pricing pages    | Days to weeks           |
| Memory and location | Saved memories can shape the search query; location comes from your IP address                 | Two buyers can get two different descriptions | Per person, per session |

### Training data: the traits the model already holds

OpenAI's [model development page](https://help.openai.com/en/articles/7842364-how-chatgpt-and-our-language-models-are-developed) says its models learn from "information that is publicly available on the internet," information from third-party partners, and information that users, human trainers and researchers provide. Public forums and blogs count. During training, the model learns "how words typically appear together in context."

That's the likely route by which brand sentiment forms inside the model. If thousands of pages put "Brand X" near "cheap" and "clunky," the model can learn that pairing. The same page warns that "the same question may yield different answers across different queries," because answers are sampled, not looked up.

Small brands face a specific risk here. OpenAI's [research on hallucinations](https://openai.com/index/why-language-models-hallucinate/) (September 2025) says "arbitrary low-frequency facts" can't be predicted from patterns alone, so models guess. Your founding year, your price and your integration list are low-frequency facts unless the web repeats them often. When ChatGPT answers without searching, it may fill those gaps with a confident guess.

### Live search: the pages it reads today

When ChatGPT searches, OpenAI's [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says it "typically rewrites your query into one or more targeted queries" and may send follow-up queries after reading the first results. The page lists Microsoft and Shopify among the search providers whose privacy policies apply. OpenAI also warns that "search results and citations can be incomplete, outdated, or incorrect."

Search doesn't happen on every prompt. In the 2026 study ["Don't Measure Once"](https://arxiv.org/abs/2604.07585), only 42.2% of ChatGPT runs returned at least one citation, which the authors tie to its "tendency to suppress web search on definitional queries." A question like "What is Tallyfold?" may be answered from training data alone, while "Tallyfold reviews 2026" is more likely to trigger a search. That split matters when you decide how to fix poor brand sentiment.

For products, OpenAI documents a direct brand sentiment surface. Its [shopping help page](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search) says review summaries are "based on reviews from public websites" and "intended to highlight common user likes and dislikes," and that labels such as "Budget-friendly" are generated by ChatGPT and are "not guarantees or verified statements."

### Memory, location and the person asking

The same search help page says: "If memory is enabled, ChatGPT may use relevant saved memories when rewriting a search query." ChatGPT also estimates location from the IP address, and "a VPN or network location may affect" it. OpenAI's [memory page](https://help.openai.com/en/articles/8590148-memory-faq) lists what memory can draw on, depending on plan and region: past chats, saved memories, custom instructions, files and connected apps such as Gmail.

So a founder who has spent months asking ChatGPT about their own product may see warmer brand sentiment than a stranger does. We'll come back to this when we set up clean runs.

### Ads and ChatGPT Work: two things that sit beside the answer

Two newer features touch brand perception without being part of the answer's sentiment.

- **Ads.** OpenAI's [ads help page](https://help.openai.com/en/articles/20001047-ads-in-chatgpt) says ad testing started in the US on 9 February 2026, for Free and Go users, and that "ads can appear below the end of a response," labeled as sponsored. It states: "Ads do not influence ChatGPT's answers." Our post on [whether ChatGPT search has paid ads](/blog/does-chatgpt-search-have-paid-ads) covers how to tell them apart.
- **ChatGPT Work.** OpenAI introduced Work on 9 July 2026 as "an agent for longer, more involved tasks." Its [cloud browser](https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt) "can read web pages, click buttons, enter information into forms" on paid plans other than Free and Go. Work runs its own models: OpenAI's [Work and Codex page](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex) says GPT-6.1 Sol, GPT-6 Sol and GPT-6 Luna "are not available in regular ChatGPT conversations."

The second point has a practical edge. A buyer who asks Work to compare three invoicing apps may get a report built from your live pricing and feature pages. OpenAI notes that some websites "restrict access from automated browser agents." If your site blocks that browser, the report leans on what others say about you.

## How ChatGPT Ties Brand Attributes to a Category

Sentiment in ChatGPT is rarely a flat "good" or "bad." It's a set of attributes tied to your name in a category context: "easy to set up," "pricey for small teams," "weak on integrations." OpenAI doesn't publish how this happens inside its models. Research gives a reasonable picture, but treat what follows as evidence plus inference.

### Evidence that models hold brand-attribute maps

- **Models reproduce human brand maps.** In [Marketing Science (March 2024)](https://ideas.repec.org/a/inm/ormksc/v43y2024i2p254-266.html), Li, Castelo, Katona and Sarvary found that "agreement rates between human- and LLM-generated data sets reach over 75%" for brand similarity and product attribute ratings. In plain terms, an LLM's sense of which brands are alike, and on which traits, roughly matches what surveyed people say.
- **Models lean toward known brands.** In ["Global is Good, Local is Bad?"](https://arxiv.org/abs/2406.13997) (EMNLP 2024), researchers tested GPT-4o and three open models across shoes, clothing, electronics and beverages. They found a consistent pattern of "disproportionately associating global brands with positive attributes," and GPT-4o showed the strongest associations of the four in their first test.
- **Web mentions travel with AI mentions.** In [Ahrefs' December 2025 study](https://ahrefs.com/blog/ai-brand-visibility-correlations) of 75,000 brands, branded web mentions correlated at 0.664 with how often ChatGPT named a brand. That's a correlation, not proof of cause.

### What this means in practice

The inference is simple. ChatGPT tends to describe you with the traits the web repeats most often next to your name and your category. A brand that is mostly discussed in "cheapest option" threads is likely to be described as the cheap option, even after it moves upmarket.

Two consequences follow. First, sentiment is category-specific: you can be "great for freelancers" and "too basic for agencies" in the same week. So score brand sentiment per category prompt, not as one overall mood. Second, a small or local brand starts with a weaker default. BrightEdge also found that the engines often surface old history: one example was "a nearly decade-old product safety recall" still appearing in answers. Old material doesn't age out on its own.

Our glossary entry on [brand mentions](/glossary/brand-mentions) explains why an unlinked mention still counts.

## The Attribute Sentiment Grid: Rankbox's Scoring Method

Most brand sentiment checks label a whole answer as positive or negative. That hides the useful part. An answer that praises your onboarding and warns about your integrations has two findings, and they need two different owners. The Attribute Sentiment Grid is Rankbox's method for scoring brand sentiment in a ChatGPT prompt panel, claim by claim. It complements the answer-level tone labels and severity ladder in our guide to [monitoring AI-generated responses for risk](/blog/how-to-monitor-brand-mentions-in-ai-generated-responses).

### Step 1: Fix the attribute list

Pick five to seven attributes buyers weigh in your category. For a B2B app, that's often price, ease of use, integrations, support, reliability and fit for a segment. Write them down before the first run, and don't add new ones mid-quarter. An "other" bucket catches the rest.

### Step 2: Split each answer into claims

A claim is one sentence, or part of a sentence, that says something about your brand on one attribute. "Tallyfold is easy to set up but has few accounting integrations" is two claims: ease of use and integrations. Ignore sentences about rivals unless they compare you directly.

### Step 3: Score each claim against fixed anchors

| Score | Meaning                                     | Anchor sentence (fictional Tallyfold)                       |
| ----- | ------------------------------------------- | ----------------------------------------------------------- |
| +2    | Clear endorsement on this attribute         | "Tallyfold is one of the easiest invoicing apps to set up." |
| +1    | Mild positive, or positive with a hedge     | "Users generally find Tallyfold straightforward."           |
| 0     | Neutral description, no judgment            | "Tallyfold costs $39 a month for three users."              |
| −1    | Mild negative, a hedge, or "some users say" | "Some reviewers mention slow support replies."              |
| −2    | Clear criticism or advice against you       | "Tallyfold lacks the integrations most agencies need."      |

Then add one of three flags to every claim, whatever its score:

- **Sourced:** ChatGPT searched, and a cited page supports the claim.
- **Unsupported:** no citation backs it, or the cited page doesn't say it. These are your hallucination candidates.
- **Wrong:** it contradicts a fact you can document today, such as your current price.

### Step 4: Roll up three numbers

1. **Net Sentiment Score** = (positive claims − negative claims) ÷ all claims × 100. It runs from −100 to +100.
2. **Attribute mean** = the average score for each attribute. This is your brand sentiment map.
3. **Unsupported rate** = unsupported claims ÷ all claims. It shows how much of what ChatGPT says has no visible source.

Add [AI share of voice](/glossary/ai-share-of-voice) from the category prompts, so you can see whether more mentions came with better or worse sentiment. Our [GEO Metrics Framework](/blog/geo-metrics-framework) defines Sentiment Share and Accuracy Rate if you want to report on the same scale as other engines.

### Step 5: Keep the scoring consistent

Sentiment scores drift when people score differently, or when one person scores differently on a tired Friday. Four rules keep brand sentiment numbers comparable over time:

- **Use the anchor bank.** Keep the table above, with two or three real examples per score, in the sheet itself. Score by comparing, not by feel.
- **Mask the brand names.** Before scoring, replace your name and rivals' names with "Brand A," "Brand B" and so on. Masking keeps scorers from going easier, or harder, on their own brand.
- **Double-score a sample.** Each month, have a second person score 20% of the claims on their own. Aim for exact agreement on at least 70% and agreement within one point on at least 90%. Below that, add anchor examples and re-score.
- **Version the rubric.** If you change an anchor or an attribute, note the date and start a new trend line from it.

The thresholds are Rankbox's working defaults, not an industry standard. Tighten them if two people disagree often on a high-stakes attribute such as security.

## Wrong Facts, Unsupported Claims and Real Opinions

A negative claim isn't automatically a brand sentiment problem that marketing can fix. Sort it first, because each type has a different fix and a different owner.

| Type              | How to spot it                                     | Typical cause                                        | The fix                                                           |
| ----------------- | -------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| Wrong fact        | Contradicts something you can document today       | Outdated review, old pricing page, a copied error    | Correct the source, publish a dated facts page, report the answer |
| Unsupported claim | No citation, or the cited page doesn't say it      | Model guess from training data; a low-frequency fact | Make the true fact easy to find and repeated by others            |
| Real opinion      | Matches what real customers say, even if unwelcome | Reviews, Reddit threads, comparison articles         | Fix the product, answer in public, or publish an honest fit page  |

### Check the claim before you blame the page

Open every cited page and find the passage. OpenAI's own help page says citations can be wrong, so a cited page may not support the sentence. If ChatGPT didn't search at all, the claim came from the model's training data, and changing one page won't move it quickly.

Wrong facts follow the process in our guide to [fixing incorrect brand facts in AI answers](/blog/fix-incorrect-brand-facts-in-ai-answers): trace the seed source, publish a canonical facts page and get it recrawled. Real opinions follow the [defensive GEO playbook](/blog/defensive-geo), where some complaints turn out to be product work, not content work.

### Report, but don't wait on it

ChatGPT's thumbs-down button includes a "Safety or Legal concern" option. OpenAI's [reporting page](https://help.openai.com/en/articles/10245791-reporting-content-in-chatgpt-and-openai-platforms) says reported domains "may be reviewed by OpenAI's Model Quality team, which may apply filters or other mitigations." That's a "may," not a promise to change your answer. Report clear errors and false legal claims, and keep fixing the sources in parallel.

## Run Sentiment Checks Without Personalization Skewing Them

A common mistake in brand sentiment checks is running them from your own account. ChatGPT may know you work at the company. Here's what each session type does, per OpenAI's help pages as of October 2026.

| Session                        | Uses your memory?                                    | Shows ads?                              | Use it for                                    |
| ------------------------------ | ---------------------------------------------------- | --------------------------------------- | --------------------------------------------- |
| Signed out                     | No account memory; location still comes from your IP | Possibly, ads for all audiences         | Baseline panel runs                           |
| Temporary Chat, Unpersonalized | No: no memory, custom instructions or plugins        | No                                      | Baseline panel runs while signed in           |
| Temporary Chat, Personalized   | Yes, existing memories                               | No                                      | Not for baselines                             |
| Your normal chat               | Yes, if Memory is on                                 | On Free and Go                          | A separate "insider" reading, labeled as such |
| ChatGPT Work                   | Separate models and an agent                         | No: Work runs on paid plans without ads | Testing what an agent can read on your site   |

### Set up the Temporary Chat correctly

OpenAI's [temporary chat page](https://help.openai.com/en/articles/8914046-temporary-chat-faq) says a temporary chat "can use existing memories, custom instructions, and plugins" unless you turn personalization off. Open a new chat, select Temporary, and choose Unpersonalized before your first message. You can't change it after the chat starts. OpenAI's release note of 27 August 2026 says temporary chats aren't personalized by default, but check the setting every time.

Temporary chats don't create or update memories, and OpenAI's ads page says they show no ads. That makes them the cleanest signed-in option.

### Five more controls

1. **Fix the location.** Run from the country your buyers are in, without a VPN, and note it.
2. **Fix the model.** Use the same plan and model each time, and record it on every row.
3. **Check the Sources icon.** Since 5 May 2026, ChatGPT can show which memories shaped a response. If memory sources appear on a baseline run, discard the run.
4. **Record whether it searched.** A no-search answer is a training-data reading; a searched answer is a live-web reading. Report them apart.
5. **Skip workspace accounts.** OpenAI says account and workspace restrictions take priority over the personalization choice, so a company workspace may not match what a buyer sees.

The "insider" reading from your own account is still worth one row a month. If it's much warmer than the clean runs, your team may be overrating how ChatGPT describes you to strangers.

## Track Share of Voice Across Sessions, Not Single Answers

Brand sentiment only matters if you're in the answer, so read it next to share of voice. Share of voice is your mentions divided by all brand mentions in the category answers. It's noisy. When SparkToro ran [the same prompts 2,961 times](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/), there was less than a 1-in-100 chance that ChatGPT would give the same list of brands twice. Yet SparkToro concluded that "visibility % across dozens to hundreds of prompts run multiple times is a reasonable metric."

"Don't Measure Once" put numbers on the drift: brand lists overlapped by 45% to 59% from one day to the next, and the authors recommend "at least 7 runs per prompt per day" read over two-to-four-week windows. By hand, you won't reach seven a day. So run fewer, pool by month, and report the margin of error with each number. Our guide to [measuring GEO](/blog/how-to-measure-geo) has the sample-size table, and our explainer on [why AI answers vary](/blog/is-it-possible-to-track-brand-mentions-in-ai-answers) covers the statistics.

Treat each session type as its own series. Clean signed-out runs and clean Temporary Chat runs can be pooled. Your personalized account can't. Mixing them can inflate both share of voice and brand sentiment.

## Worked Example: Tallyfold's First Brand Sentiment Baseline

Tallyfold is a fictional invoicing and payments app for agencies. It costs $39 a month with three users included, then $12 per extra user. Its fictional rivals are Brindlework and Kestrelyn. Every number below is illustrative, but the arithmetic is real.

### The panel

Tallyfold runs 20 prompts in ChatGPT: 6 brand prompts ("Is Tallyfold worth it?"), 8 category prompts ("best invoicing app for a design agency") and 6 comparison prompts ("Tallyfold vs Brindlework"). Each prompt runs three times in Temporary Chat set to Unpersonalized and once signed out: 80 clean answers.

| Prompt group | Answers | Answers naming Tallyfold |
| ------------ | ------- | ------------------------ |
| Brand        | 24      | 24                       |
| Comparison   | 24      | 24                       |
| Category     | 32      | 10                       |
| **Total**    | **80**  | **58**                   |

In the 32 category answers, ChatGPT named 80 brands in all: Tallyfold 10, Brindlework 24, Kestrelyn 18 and others 28. Tallyfold's share of voice is 10 ÷ 80 = 12.5%, against Brindlework's 30%. For contrast, the founder's own personalized account named Tallyfold in 7 of 8 category answers. That's why the insider reading stays out of the baseline.

### The attribute grid

The 58 answers that named Tallyfold held 92 claims about it.

| Attribute        | Claims | Positive | Neutral | Negative | Attribute mean |
| ---------------- | ------ | -------- | ------- | -------- | -------------- |
| Fit for agencies | 18     | 15       | 3       | 0        | +1.22          |
| Ease of use      | 20     | 15       | 4       | 1        | +1.00          |
| Price            | 22     | 8        | 6       | 8        | 0.00           |
| Integrations     | 18     | 4        | 4       | 10       | −0.44          |
| Support          | 14     | 2        | 3       | 9        | −0.79          |
| **All**          | **92** | **44**   | **20**  | **28**   | **+0.25**      |

The Net Sentiment Score is (44 − 28) ÷ 92 × 100 = +17.4. The overall brand sentiment looks fine. The grid shows the problem: ChatGPT likes Tallyfold's fit and ease of use, and pulls it down on integrations and support.

### Sorting the 28 negative claims

| Bin          | Claims | Example                                                                        |
| ------------ | ------ | ------------------------------------------------------------------------------ |
| Wrong fact   | 9      | "No QuickBooks integration" (it launched in May); "$29 per user" (old pricing) |
| Unsupported  | 5      | "Users report payment delays," with no citation and no search run              |
| Real opinion | 14     | "Support replies can take a day," matching recent reviews                      |

Nine wrong facts out of 92 claims is a 9.8% error rate on its own. The five unsupported claims give an unsupported rate of 5 ÷ 92 = 5.4%. Each bin gets an owner:

1. **Wrong facts (content team, this month).** Publish a dated integrations page and pricing page, ask the two review sites quoting old pricing to update, and report the answers.
2. **Unsupported claims (content and PR, this quarter).** The payment-delay claim had no source, so it likely came from training data or a weak pattern. Tallyfold publishes payout timing in plain text and pitches an independent payments roundup for a fair mention.
3. **Real opinions (support lead, now).** Slow replies are real. The fix is staffing, and then a public, dated support-hours page once it improves.

### Reading it next month

With 92 claims, brand sentiment numbers move a lot from month to month by chance alone. Tallyfold compares four-week windows and only acts on an attribute when its negative count changes by more than a few claims in the same direction twice in a row. The wrong-fact count is the exception: any repeated wrong fact gets fixed at once, at any sample size.

## Where Rankbox Fits After the Baseline

Rankbox doesn't track brand mentions, citations or brand sentiment in ChatGPT or any other engine, and it won't score your panel. The free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) gives you 30 prompts across the buying journey to paste into ChatGPT, Perplexity and Gemini, with a scorecard to tick which ones mention you. That's a fair start for the panel above.

Rankbox helps with the fixes. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google in your category, with volume, difficulty and intent as model estimates. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word source-backed articles, such as a dated integrations explainer, which reach your site through Rankbox's API. The Business plan is $49.50 a month, and you can start a 7-day trial when you add a card. See [pricing](/pricing).

## Frequently Asked Questions

### What is brand sentiment in ChatGPT?

Brand sentiment in ChatGPT is how ChatGPT describes your brand: the traits it links to you, whether they read as positive or negative, and whether the facts are right. It's measured across many prompts and runs, because one answer can differ from the next.

### How do I check my brand sentiment in ChatGPT?

Write 20 to 30 prompts buyers ask about you, your category and your rivals. Run each a few times signed out or in an Unpersonalized Temporary Chat. Score each claim about your brand on a fixed scale, and read the totals by attribute over a four-week window.

### Does ChatGPT memory change brand sentiment?

It can. OpenAI says ChatGPT may use saved memories when it rewrites a search query, and memory can draw on past chats and custom instructions. Someone who often asks about your product may see a different description than a stranger. Test from clean sessions.

### Do ads change brand sentiment in ChatGPT?

OpenAI says no. Its ads help page states that ads "do not influence ChatGPT's answers" and run on separate systems. Ads appear below some answers for Free and Go users, labeled as sponsored. Don't count them as mentions or sentiment.

### How do I fix negative brand sentiment in ChatGPT?

First sort the claim. Correct wrong facts at their source and publish a dated facts page. Make unsupported facts easy to find and repeated by others. If the claim is a real opinion, fix the product or answer it openly. Reporting the answer helps, but OpenAI doesn't promise a change.

### Why does ChatGPT say false things about my company?

Usually because it's working from an outdated source or guessing. OpenAI's research says rare facts are hard for models to learn, so they guess. Check whether the answer searched and what it cited, then fix the page it read or publish the missing fact.

## References

1. [BrightEdge Data Reveals New AI Brand Risk for CMOs, BrightEdge (5 March 2026)](https://www.brightedge.com/news/press-releases/brightedge-data-google-ai-overviews-more-likely-to-criticize-brands-than-chatgpt)
2. [How ChatGPT and our foundation models are developed, OpenAI Help Center](https://help.openai.com/en/articles/7842364-how-chatgpt-and-our-language-models-are-developed)
3. [Why language models hallucinate, OpenAI (5 September 2025)](https://openai.com/index/why-language-models-hallucinate/)
4. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
5. [Memory in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/8590148-memory-faq)
6. [Temporary chat in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/8914046-temporary-chat-faq)
7. [Ads in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)
8. [Using cloud browser in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt)
9. [ChatGPT Work and Codex, OpenAI Help Center](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)
10. [ChatGPT release notes, OpenAI Help Center](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
11. [Shopping with ChatGPT Search, OpenAI Help Center](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search)
12. [Reporting content in ChatGPT and OpenAI platforms, OpenAI Help Center](https://help.openai.com/en/articles/10245791-reporting-content-in-chatgpt-and-openai-platforms)
13. [Determining the Validity of Large Language Models for Automated Perceptual Analysis (Li et al., Marketing Science, 2024), RePEc](https://ideas.repec.org/a/inm/ormksc/v43y2024i2p254-266.html)
14. ["Global is Good, Local is Bad?": Understanding Brand Bias in LLMs (Kamruzzaman et al., EMNLP 2024), arXiv](https://arxiv.org/abs/2406.13997)
15. [Top brand visibility factors in ChatGPT, AI Mode and AI Overviews, Ahrefs (12 December 2025)](https://ahrefs.com/blog/ai-brand-visibility-correlations)
16. [Don't Measure Once: Measuring Visibility in AI Search (Schulte, Bleeker and Kaufmann, 2026), arXiv](https://arxiv.org/abs/2604.07585)
17. [AIs are highly inconsistent when recommending brands or products, SparkToro (27 January 2026)](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
