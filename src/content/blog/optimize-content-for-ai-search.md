---
title: How to Optimize Content for AI Search: Passage by Passage
description: How to optimize content for AI search one passage at a time: a 9-check Lift Test, an annotated rewrite, and a table for picking which articles to refresh.
keyword: optimize content for AI search
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Playbooks
---

To optimize content for AI search, edit one passage at a time: open each section with a direct answer, make sure it still makes sense on its own, and back it with a number, a named source or a date. AI engines don't cite your page as a whole. They cut it into passages, score each one against a question, and quote the few that win.

Engines and researchers agree on this. Perplexity's index splits documents into ["self-contained spans"](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api) and scores them one by one. In [Growth Memo's February 2026 study](https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention) of 1.2 million ChatGPT answers, 44.2% of citations came from the first 30% of a page. And in the [KDD 2024 GEO study](https://arxiv.org/abs/2311.09735), adding quotations raised a source's visibility in AI answers by about 41%.

Google adds a caution. Its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) calls this work "still SEO" and says there's no need to chop pages into tiny pieces. Both hold: a good passage is good writing, held to a stricter test.

This guide gives you that test, the Lift Test, plus an annotated rewrite and a way to pick which old articles to fix first, so you can optimize content for AI search without rewriting whole pages. For crawlers, rendering and indexing, see our [site checklist for ChatGPT and Perplexity](/blog/optimize-website-for-chatgpt-and-perplexity).

## Key Takeaways

- AI engines quote passages, so you optimize content for AI search section by section, not page by page.
- The Lift Test asks nine yes-or-no questions of each passage. A score of 8 or 9 is ready; 5 or less needs a rewrite.
- Put the answer first. Growth Memo found 44.2% of ChatGPT citations came from the first 30% of a page.
- Proof beats polish. In the GEO study, quotations lifted visibility by about 41% and statistics by 31%, while keyword stuffing cut it by 8%.
- Give sections room. SE Ranking found sections under 50 words averaged 2.7 ChatGPT citations, against 4.6 at 120–180 words.
- Skip the hacks. Hidden text, llms.txt files and FAQ schema don't optimize content for AI search, and Google dropped FAQ rich results on 7 May 2026.
- Refresh before you write new. Score old articles on demand, decay and Lift Test gap, and fix the top scores first.

## Why AI Engines Quote Passages, Not Pages

AI engines quote passages because they retrieve and score pages in pieces. A passage is a heading plus the text under it, or a single paragraph, list or table. When you optimize content for AI search, the passage is your unit of work too.

### What the engines say

- **Perplexity** [treats](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api) "the individual sections and spans of documents as first-class units."
- **Google** runs passage ranking, "an AI system we use to identify individual sections or 'passages' of a web page," per its [ranking systems guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide).
- **Microsoft** says Copilot breaks pages into "smaller, structured pieces" and builds answers from several sources, in an October 2025 [Bing team post](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers).
- **Claude** quotes "up to 150 characters" of a source in each web search citation, per Anthropic's [web search docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool).

### What the citation studies add

Position matters. [Growth Memo found](https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention) 44.2% of ChatGPT citations came from the first 30% of a page, 31.1% from the middle and 24.7% from the final third.

Structure matters too. A [2026 preprint](https://arxiv.org/abs/2604.25707) by Zhang, He and Yao tracked 21,143 citations across ChatGPT, Google and Perplexity. The pages that shaped answers most averaged 10.59 headings; those that shaped them least averaged 0.85. That's a correlation, not proof of cause, but it matches the engines' own docs.

### Google's caution: whole sections, not tiny pieces

Google says "there's no requirement to break your content into tiny pieces for AI to better understand it," and "there's no ideal page length." The goal is a section that stands on its own, not a short one. Our entry on [content chunking](/glossary/content-chunking) explains how engines split pages.

## The Lift Test: Nine Checks for Every Passage

The Lift Test is one question asked nine ways: if an AI engine lifted this passage out of your page and dropped it into an answer, would it still work? Each check is a yes or a no. Together they turn "optimize content for AI search" from a vague goal into a to-do list for one section.

| # | Check | Ask of the passage | It passes when |
| --- | --- | --- | --- |
| 1 | Lead | Does the first sentence answer the heading? | The answer comes first, with its key number or condition. |
| 2 | Lift | Does it make sense with nothing around it? | No "as mentioned above", no "this" or "it" that points outside the passage. |
| 3 | Name | Are the subject, place and time named? | Proper nouns replace pronouns in the first two sentences. |
| 4 | Match | Would someone search the heading's words? | The heading reads like a real question or sub-query. |
| 5 | Scope | Does it do one job, fully? | One idea, about 120 words or more, no second topic. |
| 6 | Proof | Can a reader check it? | At least one number, quote or named source, with outside sources linked. |
| 7 | Gain | Does it add something new? | At least one fact the top results don't have. |
| 8 | Shape | Does the format fit the content? | Steps are numbered, comparisons sit in a table, definitions read "X is". |
| 9 | Date | Will a reader know when it was true? | Prices, stats and "best" claims carry a month and year. |

### How to score it

Count the yes answers for each section:

- **8 or 9:** ready to publish.
- **6 or 7:** fix the missing checks first.
- **5 or fewer:** rewrite the section from the heading down.

Start with the sections buyers read most: the opening, pricing, comparisons and any direct answer to a buyer question.

### How to run it on one section

1. Copy one section, from its heading to the next heading, into a blank document.
2. Read it cold, as if you'd never seen the rest of the page.
3. Answer the nine questions and note the score.
4. Fix the failed checks, starting with Lead and Lift, then score it again.

Our free [AI Citation Readiness Checker](/tools/ai-citation-readiness-checker) automates part of this: paste a draft and it checks the opening answer, sentence length, numbers and named sources, and question headings.

## How to Optimize Content for AI Search, Check by Check

Each check maps to one edit, and each edit rests on research or on an engine's own guidance. Here's what to do, and why.

### Lead: answer in the first sentence

Open each section with the answer to its heading, then give the reasons. Apply Growth Memo's top-of-page finding inside every section: an engine that reads your first two sentences should leave with the answer. Put the key figure or condition in that first sentence. "About six working hours" can be quoted; "quickly" can't. Our entry on [answer-first content](/glossary/answer-first-content) walks through the method.

### Lift and Name: make every passage stand alone

To make a passage stand alone, cut the words that point elsewhere and name what you mean. Each passage gets read without the page around it, which is why Microsoft's Bing team asks for "sentences that make sense even when pulled out of context." Watch for "as mentioned above", "this approach" and a stray "it".

Anthropic's [contextual retrieval research](https://www.anthropic.com/news/contextual-retrieval) shows the cost with one line: "The company's revenue grew by 3% over the previous quarter." True on the page, useless alone, because it names neither the company nor the quarter. Name the product, the place and the period. Cited text in the [Growth Memo study](https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention) was 20.6% proper nouns, against 5–8% in typical English. For facts about the company itself, such as listings and reviews, see [how to optimize a business for AI search engines](/blog/optimize-business-for-ai-search).

### Match: write headings that mirror sub-queries

Write each heading as the sub-question its section answers, because AI engines rarely search your reader's exact words. Google's AI features use [query fan-out](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): the model splits one question into related searches, so "how to fix a lawn that's full of weeds" also becomes "best herbicides for lawns." ChatGPT "typically rewrites your query into one or more targeted queries," per [OpenAI's help center](https://help.openai.com/en/articles/9237897-chatgpt-search), and [Nectiv counted](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study) 7.61 of those searches per prompt in 2026, up from 2.17 a year before.

Headings are where you optimize content for AI search for queries you'll never see, and they get read: [Growth Memo found](https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention) 78.4% of question-based citations came from headings. Don't build a page for every variant, though. Google says doing that mainly to sway its AI answers breaks its spam policy. Our [query fan-out](/glossary/query-fan-out) entry goes deeper.

### Scope: give each passage one job and enough room

A section should answer one question, fully. Too thin and there's nothing to cite. In [SE Ranking's study](https://seranking.com/blog/how-to-optimize-for-chatgpt/) of 129,000 domains, sections under 50 words averaged 2.7 ChatGPT citations, sections of 120–180 words 4.6, and sections over 180 words 5.7.

Page length matters far less. [Ahrefs found](https://ahrefs.com/blog/short-vs-long-content-in-ai-overviews/) almost no link between word count and AI Overview citations (a correlation of 0.04), and 53.4% of cited pages ran under 1,000 words. Write full sections, not long pages, and split any section that answers two questions.

### Proof: add numbers, quotes and named sources

If you only have an hour to optimize content for AI search, spend it adding proof. The [GEO study](https://arxiv.org/abs/2311.09735) rewrote web sources in nine ways and measured how much of each AI answer they supplied:

| Change the researchers made | Visibility score | Change vs. unedited |
| --- | --- | --- |
| None (the baseline) | 19.3 | – |
| Added quotations | 27.2 | +41% |
| Added statistics | 25.2 | +31% |
| Made the text more fluent | 24.7 | +28% |
| Cited sources | 24.6 | +27% |
| Made the language easier | 22.0 | +14% |
| Made the tone more authoritative | 21.3 | +10% |
| Stuffed in keywords | 17.7 | -8% |

The visibility score is the paper's "position-adjusted word count": how many of the answer's words came from a source, weighted toward sources cited earlier. The test engine was GPT-3.5 reading five Google results, so treat the sizes as direction, not a forecast. On live Perplexity, quotations still came out on top, with a 22% gain.

Newer data agrees. [SE Ranking found](https://seranking.com/blog/how-to-optimize-for-chatgpt/) pages with 19 or more statistics averaged 5.4 ChatGPT citations, against 2.8 for pages with little data, and pages with expert quotes 4.1, against 2.4.

### Gain: add something the top results don't have

Proof works best when it's yours. Google's guide warns against content that "could easily be produced by a generative AI model," and contrasts "7 Tips for First-Time Homebuyers" with a first-hand account of why one buyer waived an inspection.

To test a section, list what the top five results and one AI answer already say, then mark every claim in your draft that's on that list. What's left is your gain. If nothing is, add a first-party number, a test result, a worked example or a named expert's view. Our [information gain](/glossary/information-gain) entry calls this the Consensus Diff.

### Shape: match the format to the content

Steps belong in a numbered list, comparisons in a table, and definitions in a plain "X is" sentence. Microsoft's Bing team says lists and tables "break complex details into clean, reusable segments," and in Growth Memo's data, "X is" phrasing was nearly twice as likely to be cited.

The [Zhang preprint](https://arxiv.org/abs/2604.25707) found definitions and comparisons shaped AI answers most. Pages with numbers had 61.55% higher influence, and pages with definitions 57.33% higher. Format alone isn't the lever, though. The same preprint found Q&A formatting slightly lowered influence (-5.74%), while [Semrush's January 2026 study](https://www.semrush.com/blog/content-optimization-ai-search-study/) scored AI-cited pages 25.45% higher on it. When studies disagree, write for substance first.

### Date: stamp anything that can go stale

Put a month and year on every fact that can go stale, because AI engines lean newer than Google. [Ahrefs' freshness study](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) of about 17 million citations found AI-cited pages averaged 1,064 days old, against 1,432 for organic results: 25.7% fresher. ChatGPT's citations ran 458 days newer than organic.

Engines read dates, too. Each Claude search result carries a ["page_age" field](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool), and OpenAI's own example of a rewritten ChatGPT query ends in a year. So date every price, statistic and "best" claim, and show a real updated date on the page. On pages that already rank, dates are one of the quickest ways to optimize content for AI search. Our [content freshness](/glossary/content-freshness) entry covers how often to update.

## A Before-and-After Rewrite, Annotated

Here's what it looks like to optimize content for AI search on one real-sized section. Plannora is a made-up project management tool, Loopcraft is its made-up rival, and the numbers are illustrative. The bold line in each version is the section's heading.

### Before: 136 words, 1 of 9 checks

**Getting started is easy**

Switching tools can feel overwhelming, and every team's situation is a little different. That's why we've put a lot of thought into making the move as painless as possible. As mentioned above, the importer does most of the heavy lifting, so you won't need to rebuild everything by hand. It works with the most popular tools on the market and brings over your projects, tasks and comments. Most teams tell us they're up and running quickly, often faster than they expected. Of course, bigger teams with complex setups may need a little longer, and a few things will need to be set up again. The support team is always happy to help if you get stuck, and there are plenty of guides in the help center to walk you through every step.

It passes one check, Scope, because it sticks to one topic. It fails the other eight: the heading matches no search, the answer never arrives, "As mentioned above" and "It" point off the page, and nothing is named, counted or dated.

### After: 142 words, 9 of 9 checks

**How long does it take to move a team from Loopcraft to Plannora?**

A 20-person team can move from Loopcraft to Plannora in about six working hours, or one working day. Plannora's importer copies projects, tasks, comments and due dates. The importer doesn't copy Loopcraft automations or custom-field rules, so those take most of the time (checked September 2026).

The move has four steps for a team with about 4,000 tasks:

1. Connect Loopcraft with an API key: 10 minutes.
2. Run the importer: 50 minutes.
3. Map custom fields: 1 hour.
4. Rebuild automations: 4 hours.

That adds up to 6 hours. Plannora's support team logged 180 Loopcraft moves between March and August 2026. The median move took 5.5 hours, and the slowest ones had more than 30 automations each. Before you start, export your list of Loopcraft automations, since you'll rebuild them by hand.

### What changed, and which check each change passes

| Change | Check |
| --- | --- |
| The heading became the question a buyer would type | Match |
| The answer, "about six working hours", moved to sentence one | Lead |
| "As mentioned above" and "It works with" were cut | Lift |
| "The importer" and "the most popular tools" became Plannora and Loopcraft | Name |
| "A few things" became automations and custom-field rules, each with a time | Proof |
| The steps moved into a numbered list that sums to 6 hours | Shape |
| The 180-move support log and the export tip were added | Gain |
| "Checked September 2026" and the March to August window were added | Date |
| The support-team filler went, so it still does one job | Scope |

The rewrite is only 6 words longer. It didn't need more words, just the answer up front, names instead of pronouns, and numbers that add up.

## What Doesn't Help You Optimize Content for AI Search

Some popular tactics do nothing, and a few can hurt. None of these will optimize content for AI search:

- **Hidden text written for bots.** Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) define hidden text as content placed "solely to manipulate search engines and not to be easily viewable by human visitors," and they now cover attempts to manipulate Google's AI responses. Microsoft adds that AI systems "may not render hidden content" in tabs, so even honest hidden text can go unread.
- **Keyword stuffing.** It cut visibility by 8% in the [GEO study](https://arxiv.org/abs/2311.09735), and did 10% worse than the unedited page on Perplexity.
- **A page for every fan-out variant.** Google says separate pages made "primarily to manipulate rankings or generative AI responses" break its [scaled content abuse](/glossary/scaled-content-abuse) policy.
- **An llms.txt file as a ranking lever.** Google says Search ignores llms.txt, which "will neither harm nor help" visibility. As of September 2026, no major AI search engine has confirmed using it to choose sources.
- **FAQ schema for rich results.** Google's [changelog](https://developers.google.com/search/updates) says FAQ rich results stopped appearing on 7 May 2026, and its AI guide says there's "no special schema.org markup you need to add." [SE Ranking found](https://seranking.com/blog/how-to-optimize-for-chatgpt/) pages with FAQ schema averaged 3.6 ChatGPT citations, against 4.2 without.
- **A new date on old content.** Google's [helpful content guide](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) asks whether you are "changing the date of pages to make them seem fresh when the content has not substantially changed."
- **A louder tone.** A persuasive, authoritative style gave the smallest gain in the GEO table above (+10%), which the authors called "no significant improvement."

A visible FAQ section is still fine when it answers real questions with substance. The value is in the answers, not the markup.

## Which Old Articles to Refresh First

Refresh the articles people already see first, starting with those furthest from passing the Lift Test. Fixing a page with demand is often the cheapest way to optimize content for AI search. You'll have more old articles than time, so give each one a quick score.

### Score each article on three factors

| Factor | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Demand: is anyone asking? | No impressions or prompts | A few impressions | Steady impressions or a panel prompt | Top page for a buyer question |
| Decay: how old are its facts? | Checked in the last 90 days | 3 to 6 months | 6 to 12 months | Over a year, or a known error |
| Lift gap: how far from 9 of 9? | Sections average 8 or 9 | 6 or 7 | 4 or 5 | 3 or less |

**Refresh priority = Demand × (Decay + Lift gap).** The top score is 18. Demand multiplies the rest, so a stale page nobody reads can't jump the queue. A page with zero demand isn't a refresh at all; merge it or retire it.

For demand, read Search Console's Performance report and the [Generative AI performance report](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) Google recommends for its AI features. Add a prompt panel of your own; our guide on [how to measure GEO](/blog/how-to-measure-geo) shows how to build one.

### A worked example

Here are five articles on Plannora's blog, scored. Again, the brand and numbers are made up.

| Article | Demand | Decay | Lift gap | Priority | Next step |
| --- | --- | --- | --- | --- | --- |
| Plannora vs Loopcraft | 3 | 2 | 2 | 3 × 4 = 12 | Refresh this week |
| Best project management tools for agencies (2025) | 3 | 3 | 1 | 3 × 4 = 12 | Refresh this week; the year in the title is stale |
| Moving from Loopcraft to Plannora | 2 | 1 | 3 | 2 × 4 = 8 | Refresh next; it holds the "before" section above |
| What is a Gantt chart? | 1 | 0 | 2 | 1 × 2 = 2 | Leave for now |
| Plannora 2024 roadmap recap | 0 | 3 | 3 | 0 × 6 = 0 | Merge or retire |

When two pages tie, fix the one with a known wrong fact first. A wrong price in an AI answer does more harm than a missing citation.

### How to refresh one article

Once a page tops the queue, here's how to optimize content for AI search on it in one sitting:

1. **Re-check every number, price and date** against its source, and replace or cut anything stale.
2. **Run the Lift Test on each section** and rewrite the lowest scorers first.
3. **Rewrite vague headings** as the sub-questions buyers ask.
4. **Add one new fact** to each major section, from your own data or experience.
5. **Update the visible date and the `dateModified` markup together,** and only when the content changed.
6. **Keep the URL,** so the page keeps its links and history.

## Writing New Articles That Pass the Lift Test

The Lift Test works on any article, whoever wrote it. If you'd rather not optimize content for AI search by hand on every new piece, Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts 2,000–3,500-word articles with their sources, and each draft gets an SEO score and a GEO score. Articles reach your site through Rankbox's API, which a developer wires in.

Run the Lift Test on those drafts anyway, because only your team can add the first-party numbers that pass the Gain check. And know the limit: Rankbox doesn't track AI citations today, so pair it with a prompt panel to see which pages start getting cited. Plans are on the [pricing page](/pricing).

## Frequently Asked Questions

### How do you optimize content for AI search?

To optimize content for AI search, work section by section. Put the answer in each section's first sentence, name the subject instead of using pronouns, and write headings as the sub-questions people ask. Back each claim with a number, a named source or a date. Then check that each passage still makes sense when it's lifted out of the page. Pages must also be crawlable and indexed, so the SEO basics come first.

### Is optimizing for AI search different from SEO?

Mostly, no. Google calls optimizing for its AI features "still SEO," and its AI answers draw on its core ranking systems. The difference is emphasis: AI engines quote passages, so each section has to stand alone and carry its own proof. The edits that optimize content for AI search also make pages clearer for readers and for classic search.

### How long should a section be for AI citations?

Aim for about 120 words or more per section when you optimize content for AI search. SE Ranking found sections of 120–180 words averaged 4.6 ChatGPT citations and sections over 180 words averaged 5.7, against 2.7 for sections under 50 words. Google says there's no ideal page length, so let the question set the length, and avoid thin sections.

### Do you need an llms.txt file to optimize content for AI search?

No. Google says Search doesn't use llms.txt and that the file will neither help nor harm your visibility. As of September 2026, no major AI search engine has confirmed using it to choose sources. Keeping one is harmless, but the writing inside your sections matters far more.

### Does FAQ schema still help with AI search?

Not for rich results. Google stopped showing FAQ rich results on 7 May 2026, and it says its AI features need no special schema. SE Ranking found pages with FAQ schema averaged slightly fewer ChatGPT citations (3.6 against 4.2). A visible FAQ that answers real questions with substance can still help readers and engines.

### How often should you optimize content for AI search?

Review the pages you most want cited at least once a quarter, and update them whenever a fact changes. SE Ranking says content updated in the past three months "averages nearly double the citations (6.0 vs. 3.6)." Change the visible date only when the content changed, since Google asks site owners not to fake freshness.

## References

1. [GEO: Generative Engine Optimization (Aggarwal et al., KDD 2024), arXiv](https://arxiv.org/abs/2311.09735)
2. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
3. [Latest Google Search documentation updates, Google Search Central](https://developers.google.com/search/updates)
4. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
5. [Creating helpful, reliable, people-first content, Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
6. [A guide to Google Search ranking systems, Google Search Central](https://developers.google.com/search/docs/appearance/ranking-systems-guide)
7. [Optimizing your content for inclusion in AI search answers, Microsoft Advertising](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)
8. [Architecting and evaluating an AI-first search API, Perplexity](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api)
9. [ChatGPT search, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
10. [Web search tool, Claude Developer Platform](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)
11. [Introducing contextual retrieval, Anthropic](https://www.anthropic.com/news/contextual-retrieval)
12. [The science of how AI pays attention, Growth Memo](https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention)
13. [How to optimize for ChatGPT, SE Ranking](https://seranking.com/blog/how-to-optimize-for-chatgpt/)
14. [From citation selection to citation absorption (Zhang, He and Yao, 2026), arXiv](https://arxiv.org/abs/2604.25707)
15. [How we built a content optimization tool for AI search, Semrush](https://www.semrush.com/blog/content-optimization-ai-search-study/)
16. [Do AI assistants prefer to cite fresh content?, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
17. [Short vs. long content in AI Overviews, Ahrefs](https://ahrefs.com/blog/short-vs-long-content-in-ai-overviews/)
18. [New Research: ChatGPT Tripled Its Fan-Out Queries + Looks For Authoritative Sources, Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)
