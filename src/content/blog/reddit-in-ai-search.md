---
title: The Role of Reddit in AI Search: Why LLMs Prioritize Forum Discussions
description: Reddit in AI search: what the Google and OpenAI data deals say, dated studies of Reddit's citation share by engine, and how to join buyer threads by the rules.
keyword: Reddit in AI search
date: 2026-10-09
updated: 2026-10-09
written: 2026-09-29
author: Rankbox Team
tags: AI Search, Reddit
---

Reddit shows up in AI answers for three reasons that are on the record: Google and OpenAI announced a direct feed of its posts, its threads rank for the question-style searches AI engines run, and Google's rater guidelines score first-hand forum answers highly. But "LLMs prioritize forum discussions" is only half true. The role of Reddit in AI search depends on the engine. Reddit is the most-cited domain in Gemini and Perplexity in [Ahrefs' September 2026 counts](https://ahrefs.com/blog/most-cited-domains-gemini/), while its share of ChatGPT's citations [fell about 86% in August 2026](https://promptwatch.com/blog/chatgpt-stop-citing-reddit).

That split is what makes Reddit in AI search hard to plan for. A buyer who asks Gemini for the best invoicing app for agencies may get an answer built on two Reddit threads. The same buyer in ChatGPT is more likely to see vendor pages, even though ChatGPT read the threads first. In [Ahrefs' study of 1.4 million ChatGPT prompts](https://ahrefs.com/blog/why-chatgpt-cites-pages/), Reddit results pulled in through their own channel were cited just 1.93% of the time.

This guide covers the data deals behind Reddit in AI search, the dated evidence on Reddit's share of AI citations by engine, a way to find high-intent buyer threads, and a playbook for taking part within Reddit's rules. For the Google side, read our guide to [using Reddit for SEO](/blog/how-to-use-reddit-for-seo). For where Reddit sits in a wider plan, see our [10-step plan to rank in AI search results](/blog/how-to-rank-in-ai-search-results).

## Key Takeaways

- Google (22 February 2024) and OpenAI (16 May 2024) announced access to Reddit's Data API, which both describe as real-time, structured content. Neither announcement promises Reddit any special placement.
- Reddit's IPO filing disclosed data licensing deals signed in January 2024 worth $203.0 million in total, over two to three years. The filings don't name the buyers or the price of each deal.
- Reddit in AI search is strongest in Gemini and Perplexity. In Ahrefs' September 2026 data, Reddit held 28.5% of the citation share among Gemini's 50 most-cited domains and 21.6% among Perplexity's.
- ChatGPT is the exception. Promptwatch measured Reddit's share of ChatGPT citations falling from 3.83% to 0.52% in August 2026, and Otterly saw a 73% drop across 16 brands in the same weeks.
- Studies of Reddit in AI search disagree mostly because they count different things: share of all citations, share among the top domains, or share of answers. Check the denominator before you quote a figure.
- The best buyer threads ask for a recommendation, already rank in Google or appear in AI answers, are still open for replies, and sit in communities that allow a disclosed vendor.
- Reddit bans spam, vote manipulation and misleading identities, and the US FTC expects staff to disclose who they work for. Every tactic for Reddit in AI search in this guide stays inside both.

## Why There Is So Much Reddit in AI Search Answers

There are five candidate reasons, and they don't carry equal evidence. The table grades each one.

| Reason                              | What backs it                                              | Evidence type               |
| ----------------------------------- | ---------------------------------------------------------- | --------------------------- |
| A licensed, structured feed         | Google and OpenAI announcements, 2024                      | Documented by the companies |
| Threads rank for question searches  | Semrush ranking counts; AI citations track top-10 rankings | Correlation                 |
| Engines value first-hand experience | Google's rater guidelines and AI features                  | Documented by Google        |
| Threads read like prompts           | Plain-language questions and answers                       | Inference, untested         |
| Reddit shaped early training data   | GPT-2's WebText used Reddit votes as a filter              | Documented for 2019 only    |

### A licensed feed gives two engines direct access

Google says its deal gives it "[efficient and structured access to fresher information](https://blog.google/company-news/inside-google/company-announcements/expanded-reddit-partnership/)" through Reddit's Data API. [Reddit's announcement](https://www.redditinc.com/blog/reddit-and-oai-partner) of the OpenAI deal says it lets OpenAI's tools "better understand and showcase Reddit content, especially on recent topics." A direct feed means these engines don't have to wait for a crawler to find a new thread.

Ahrefs found that ChatGPT tags some sources with a separate "reddit" retrieval type, with more than 16 million results in its sample. Ahrefs infers a dedicated Reddit feed next to web search, which fits the OpenAI deal.

### Threads rank for the searches AI engines run

Cited answers are built on search. Google says its AI features retrieve pages ["from our Search index"](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), and 88% of the URLs ChatGPT cited in Ahrefs' sample came through its general search channel. Reddit ranks for a huge range of queries: [Semrush's November 2025 data](https://www.semrush.com/blog/most-cited-domains-ai/) counted about 263 million Google keywords for Reddit, with 34% of those rankings in positions 21 to 100. In a [July 2025 study of 5,000 keywords](https://www.semrush.com/blog/ai-mode-comparison-study/), Semrush found that domains with more top-10 rankings earn more AI citations. It calls that a correlation, not proof of cause.

### Google says first-hand forum answers can be high quality

Google's [rater guidelines](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf) (September 2025) say "social media posts and forum discussions are often High quality when they involve people sharing their experience." Raters don't set rankings directly, but the guidelines show what Google's systems aim for. In May 2026 Google added [previews of "perspectives from public online discussions"](https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/) to AI Overviews and AI Mode, with the community name shown.

### Two weaker explanations for Reddit in AI search

Forum threads are written the way people prompt: a real question, then answers in plain words. That may make them easy to match to a prompt, but no public study tests it. And Reddit shaped early training data. OpenAI's [GPT-2 paper](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) built its WebText dataset from outbound Reddit links with at least 3 karma, using votes as a quality filter. Current training mixes aren't disclosed, so treat any claim about Reddit's weight in today's models as a guess. Our [shadow training data audit](/blog/shadow-training-data-audit) covers what vendors have published.

## The Data Deals Behind Reddit in AI Search

Most articles about Reddit in AI search mention the licensing deals. Few quote them. Here is what each company announced or filed, and nothing more.

| Date        | Source                                                                                                                                                                                                  | What it says                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 22 Feb 2024 | [Google blog](https://blog.google/company-news/inside-google/company-announcements/expanded-reddit-partnership/) and [Reddit blog](https://www.redditinc.com/blog/reddit-and-google-expand-partnership) | Google gets Reddit's Data API to display, train on "and otherwise use" Reddit content. The deal doesn't change Google's use of crawlable pages. Reddit uses Google's Vertex AI. |
| 22 Feb 2024 | [Reddit's S-1 filing](https://www.sec.gov/Archives/edgar/data/1713445/000162828024006294/reddits-1q423.htm)                                                                                             | Deals signed in January 2024, $203.0 million aggregate contract value, two-to-three-year terms, at least $66.4 million of revenue expected in 2024. Buyers not named.           |
| 16 May 2024 | [Reddit blog](https://www.redditinc.com/blog/reddit-and-oai-partner), also on [OpenAI's site](https://openai.com/index/openai-and-reddit-partnership/)                                                  | OpenAI gets Data API access to bring Reddit content into ChatGPT and new products. Reddit builds on OpenAI models. OpenAI becomes an ad partner.                                |
| 6 Feb 2026  | [Reddit's 10-K for 2025](https://www.sec.gov/Archives/edgar/data/1713445/000171344526000022/rddt-20251231.htm)                                                                                          | Now called "content licensing." Reddit expects its data to stay valuable across language model uses "(e.g., search, run-time inference)."                                       |
| 30 Jul 2026 | [Reddit's Q2 2026 results](https://www.sec.gov/Archives/edgar/data/1713445/000171344526000098/exhibit992q226.htm)                                                                                       | "Other revenue," which includes licensing, was $43 million, up 24% on a year earlier.                                                                                           |

Three things the documents don't say. They don't give a price per partner: the per-deal figures in news stories are press reports, not company statements. They don't promise Reddit better placement in any answer. And as of 29 September 2026, neither Reddit's blog nor its latest quarterly filing announces new terms with either company.

Access for everyone else is narrower. Reddit's [robots.txt](https://www.reddit.com/robots.txt), as served on 29 September 2026, tells every crawler `Disallow: /` and points to its [Public Content Policy](https://support.reddithelp.com/hc/en-us/articles/26410290525844-Public-Content-Policy). That policy says Reddit's data licensees are mainly brand-monitoring firms, "large language model makers" and researchers. In July 2024, [MERJ found](https://merj.com/blog/investigating-reddits-robots-txt-cloaking-strategy) that Reddit served Google a different robots.txt from the public one, which fits with Google still indexing Reddit today.

## Reddit in AI Search, Engine by Engine

Each figure comes from a named study. Read the metric column before you compare rows.

| Engine              | Study                                                                                 | Sample and metric                                             | Reddit's figure                                    |
| ------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| Gemini              | [Ahrefs, Sept 2026](https://ahrefs.com/blog/most-cited-domains-gemini/)               | 3M+ US queries; share among top 50 cited domains              | 28.5%, first                                       |
| Perplexity          | [Ahrefs, Sept 2026](https://ahrefs.com/blog/most-cited-domains-perplexity/)           | 3.1M+ US queries; top-50 share                                | 21.6%, first                                       |
| Perplexity          | [Profound, June 2025](https://www.tryprofound.com/blog/ai-platform-citation-patterns) | 680M citations, Aug 2024 to Jun 2025; share of all citations  | 6.6%, first                                        |
| Google AI Overviews | [Ahrefs, Sept 2026](https://ahrefs.com/blog/most-cited-domains-ai-overviews/)         | 3M+ US queries; top-50 share                                  | 18.5%, second after YouTube                        |
| Google AI Overviews | [Profound, June 2025](https://www.tryprofound.com/blog/ai-platform-citation-patterns) | Share of all citations                                        | 2.2%, first                                        |
| Grok                | [Ahrefs, June 2026](https://ahrefs.com/blog/most-cited-domains-grok/)                 | 1.9M+ US queries; top-50 share                                | 16.3%, first                                       |
| ChatGPT             | [Profound, June 2025](https://www.tryprofound.com/blog/ai-platform-citation-patterns) | Share of all citations                                        | 1.8%, second after Wikipedia                       |
| ChatGPT             | [Semrush, Nov 2025](https://www.semrush.com/blog/most-cited-domains-ai/)              | 230K prompts, Jul to Oct 2025; share of answers citing Reddit | About 60% in early Aug 2025, about 10% by mid-Sept |
| ChatGPT             | [Promptwatch, Aug 2026](https://promptwatch.com/blog/chatgpt-stop-citing-reddit)      | Share of all ChatGPT Search citations                         | 3.83%, then 0.52%                                  |
| Microsoft Copilot   | [Ahrefs, Sept 2026](https://ahrefs.com/blog/most-cited-domains-copilot/)              | 3M+ US queries; top-50 share                                  | Not in the top 50                                  |

### Why studies of Reddit in AI search disagree

They use three different denominators. Profound's data puts Reddit at 6.6% of all Perplexity citations, yet at 46.7% of the citations that went to Perplexity's ten most-cited domains. Same data, two very different numbers. Ahrefs reports shares among the top 50 domains, which inflates any giant site.

One widely shared version of the claim that Reddit is "the #1 cited domain" comes from [Visual Capitalist's chart](https://www.visualcapitalist.com/ranked-the-most-cited-websites-by-ai-models/) of Semrush's June 2025 data, where Reddit had a 40.1% "citation frequency." That is the share of answers that cited Reddit at least once, not its share of all citations. So before you repeat a figure about Reddit in AI search, ask: share of what, in which engine, and when?

### The August 2026 ChatGPT drop

Time matters as much as method. [Promptwatch](https://promptwatch.com/blog/chatgpt-stop-citing-reddit) tracked Reddit at an average of 3.83% of ChatGPT Search citations from 18 July to 7 August 2026, then 0.52% from 14 to 17 August. On 8 August, the share of ChatGPT's background searches that used the `site:` operator jumped from about 0.37% to 16.8% in a day. Over the same weeks, Reddit's share slipped only 11% in Google AI Overviews and 30% in AI Mode.

[Otterly](https://otterly.ai/blog/chatgpt-reddit-citations/) checked the drop against a control. Across 16 brand reports, ChatGPT's Reddit citations fell from 497 to 132 a day, down 73.4%, while ChatGPT's total citations rose 3.5%. Over the same days, Google, AI Mode, Gemini and Perplexity kept citing Reddit at a flat rate in its data. In 10 of 15 reports, official brand and competitor pages gained. Both vendors call the `site:` change the leading explanation, not a proven cause, and Promptwatch calls the size of the drop provisional. OpenAI told Yahoo Tech, as [Semrush reported](https://www.semrush.com/blog/reddits-citations-in-chatgpt-fall/), that it doesn't set a fixed visibility level for individual sites and still cites Reddit.

It had happened before. [Semrush saw](https://www.semrush.com/blog/most-cited-domains-ai/) ChatGPT's share of answers citing Reddit fall from about 60% to about 10% in September 2025. Its head of organic and AI visibility doubted the popular explanation and suggested ChatGPT was trying "to avoid over-citing on certain websites."

## Read, Not Credited: How ChatGPT Uses Reddit Now

A citation count shows only the last step. [Ahrefs found](https://ahrefs.com/blog/why-chatgpt-cites-pages/) that 67.8% of the pages ChatGPT retrieved but didn't cite came from Reddit. In its words, ChatGPT uses Reddit "to understand topics, gauge consensus, and build context," then credits another source.

A single August 2026 capture shows the pattern. In [Search Engine Journal](https://www.searchenginejournal.com/chatgpt-rebuilt-its-search-tool-i-read-the-new-language-it-speaks/586710/), Suganthan Mohanadasan logged ChatGPT searching Reddit for opinions on six vendors it had already picked. Reddit threads made up 84 of the 221 results it pulled in, and none was credited in the answer. It's one conversation, not a study, but it matches Ahrefs' numbers.

So in ChatGPT, Reddit in AI search answers works more like background reading than a source list. It may shape how your brand is described more than which page gets the link. Measure mentions and descriptions, not just links. Our [ChatGPT SEO guide](/ai-seo/chatgpt) covers the fan-out searches behind this, and our breakdown of [ChatGPT ranking factors](/blog/chatgpt-ranking-factors-ai-search-placement) grades community signals against six others. For Perplexity, where Reddit citations are easy to see, read our [Perplexity SEO guide](/ai-seo/perplexity).

## How to Find High-Intent Buyer Threads in Your Niche

You don't need a paid tool to find the threads that matter for Reddit in AI search. Five free steps, in order:

1. **List 10 to 20 buyer questions** in the words buyers use: "best X for Y," "X vs Y," "alternatives to X," "is X worth it," and plain problem statements. Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) writes 30 for you.
2. **Search Google two ways.** Add "reddit" to each question, then try `site:reddit.com` with quoted phrases. Google's help page documents [`site:`, quotes, `-` and `after:`](https://support.google.com/websearch/answer/2466433), plus a Forums filter. Note every thread in the top 10.
3. **Search Reddit itself.** Reddit's [search help](https://support.reddithelp.com/hc/en-us/articles/19696541895316-Available-search-features) documents `title:`, `subreddit:` and `self:true`, and the operators AND, OR and NOT in capitals.
4. **Ask engines that show sources.** Run your questions in Perplexity, Google AI Mode and Gemini, and note every Reddit thread they cite. Those threads already feed answers.
5. **Set alerts.** [Reddit Pro](https://www.business.reddit.com/pro) is free from Reddit and tracks keywords such as your brand, products and competitors. [F5Bot](https://f5bot.com/) sends free email alerts; its Silver plan is $9.99 a month for 20 keywords, as listed on 29 September 2026. [GummySearch](https://gummysearch.com/), once a popular option, closed on 30 November 2025.

Match each query to a buyer stage, so you find threads at every step of the decision:

| Buyer stage  | Google query                                    | Reddit search                     |
| ------------ | ----------------------------------------------- | --------------------------------- |
| Problem      | `site:reddit.com "late client payments" agency` | `title:"late payments" self:true` |
| Category     | `best invoicing software for agencies reddit`   | `title:invoicing agency`          |
| Comparison   | `site:reddit.com Brindlework vs Kestrelyn`      | `Brindlework AND Kestrelyn`       |
| Alternatives | `site:reddit.com "alternative to Kestrelyn"`    | `"alternative to Kestrelyn"`      |
| Reputation   | `Tallyfold reddit after:2026/01/01`             | `Tallyfold`                       |

### The Thread Priority Score

Not every thread deserves a reply. Score each one out of 10 before you write a word.

| Factor     | Points | How to score it                                                                                                            |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| Intent     | 0 to 3 | 3 asks for a tool or a comparison. 2 describes a problem you solve. 1 is general talk. 0 is off-topic.                     |
| Visibility | 0 to 3 | 2 if it ranks in Google's top 10 for a buyer query. Add 1 if an AI engine cited it in your checks.                         |
| Openness   | 0 to 2 | 2 if it's open and the community allows disclosed vendors. 1 if links are restricted. 0 if archived or vendors are banned. |
| Fit        | 0 to 2 | 2 if you can answer fully from real experience, even when a rival fits better. 0 if you'd only be pitching.                |

Two gates come first. A zero on Openness or Fit means skip, whatever the total. Reply to threads that score 7 or more. Check openness carefully: communities can [archive posts after six months](https://support.reddithelp.com/hc/en-us/articles/15484546290068-Community-settings), which blocks new comments and votes.

## A Participation Playbook That Follows Reddit's Rules

Any plan for Reddit in AI search has to fit Reddit's own rules, as published on 29 September 2026. The [Reddit Rules](https://redditinc.com/policies/reddit-rules) ask you to "participate authentically in communities where you have a personal interest" and not to spam or manipulate content (Rule 2). Rule 5 says: "do not intentionally mislead others or impersonate an individual or entity in a deceptive manner."

Reddit's help pages add detail. The [spam policy](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam) asks anyone whose posts are mostly links to their own business to "be thoughtful about the frequency of posting," or to buy ads instead. It lists "generative AI tools" that spread spam as a violation, and says moderators decide what counts as spam in their community. The [disrupting communities policy](https://support.reddithelp.com/hc/en-us/articles/360043066412-Disrupting-Communities) bans "multiple accounts, voting services, or any automation to manipulate vote counts." The [impersonation policy](https://support.reddithelp.com/hc/en-us/articles/360043075032) bans misrepresenting "your identity or affiliation," but lists "Creating your brand's official community to directly engage with redditors" as allowed.

US businesses have a second rulebook. Under the FTC's [Endorsement Guides](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255), a connection readers wouldn't expect "must be disclosed clearly and conspicuously." The FTC's [staff FAQ](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) says "I work for XYZ" is clearer than "#employee." Its [2024 reviews rule](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465) bars officers and managers from reviewing their own company without disclosing the tie, and bans buying fake followers or views.

### The playbook

1. **Post as who you are.** Use a clearly named brand account (Reddit Pro suggests a separate business username) or your own account with a disclosure. One person, one voice per thread.
2. **Read the room first.** Check the community's rules, wiki and pinned posts. If vendors are banned, leave. If you're unsure, ask the moderators.
3. **Disclose in the first line.** For example: "I work at Tallyfold, so weigh this accordingly." The FTC's [guides](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255) give a disclosure made only on a profile page as an example that is easy to miss.
4. **Answer before you mention anything.** Give the steps, the trade-offs and the price range. Name a rival when it fits better.
5. **Link only when it helps the asker**, and follow the community's link rules.
6. **Stay for follow-ups.** Answer questions and criticism in the thread.
7. **Keep volume low.** A few replies a week in threads that pass the score beats dozens anywhere.

### What never to do

- Run second accounts to agree with yourself, or ask anyone to vote. Reddit says it now revokes [nearly 2 million inauthentic votes a day](https://redditinc.com/news/how-were-keeping-reddit-real-and-safe-in-the-ai-era).
- Buy aged accounts, or buy upvotes and followers.
- Let staff, agencies or paid posters recommend you without saying who they work for.
- Post fake customer stories or reviews.
- Mass-produce replies with AI and post them unread.

Our glossary entry on [Reddit SEO](/glossary/reddit-seo) turns these rules into a five-check test for any draft reply.

### Why a good reply lasts

Archiving closes a thread to new comments, but the thread stays public. So a useful, disclosed reply keeps being read for as long as the thread ranks or gets retrieved. Each accurate mention also puts your brand name next to your category's words, the kind of co-occurrence our [co-citation guide](/blog/link-building-ai-visibility-co-citation) examines. Treat that second effect as likely, not proven: no engine documents how it weighs forum mentions.

## Worked Example: Tallyfold's Plan for Reddit in AI Search

Tallyfold is a fictional invoicing and payments app for agencies, with fictional rivals Brindlework and Kestrelyn. The threads, scores and results below are illustrative. Its marketer ran the five steps above and found six candidate threads:

| Thread                                                                         | Intent | Visibility | Openness | Fit | Total | Decision                            |
| ------------------------------------------------------------------------------ | ------ | ---------- | -------- | --- | ----- | ----------------------------------- |
| A. "Best invoicing tool for a 12-person agency?" (agency owners, 3 months old) | 3      | 3          | 2        | 2   | 10    | Reply                               |
| B. "Brindlework vs Kestrelyn for retainers" (freelancers, 5 months old)        | 3      | 2          | 2        | 2   | 9     | Reply this week, before it archives |
| C. "How do you chase late client payments?" (small business, 2 weeks old)      | 2      | 0          | 2        | 2   | 6     | Watch                               |
| D. "Kestrelyn raised prices again" (1 year old)                                | 2      | 3          | 0        | 2   | Gated | Skip; archived                      |
| E. "Invoicing for multi-currency clients?" (bans vendors)                      | 3      | 1          | 0        | 2   | Gated | Skip                                |
| F. "Anyone automate retainer billing?" (1 week old)                            | 3      | 0          | 2        | 1   | 6     | Watch                               |

Thread A ranks fourth in Google for "best invoicing software for agencies" and was cited by Perplexity, so it scores full Visibility. Threads D and E would score 7 and 6, but both fail the Openness gate. They still teach something: the questions they ask become pages. Tallyfold writes a dated pricing comparison for thread D's question and a multi-currency guide for thread E's.

The reply to thread A opens with the disclosure line, then answers the question for a 12-person agency. It covers retainer billing, late-payment reminders and card fees, and says Kestrelyn is the better fit for teams that bill mostly by the hour.

### What Tallyfold measures

To see whether its work pays off, Tallyfold tracks 12 buyer prompts on three engines that cite Reddit in AI search results often (Perplexity, Gemini and Google AI Mode), with two runs each: 72 answers per check.

- **Before:** Tallyfold is named in 9 of 72 answers, or 12.5%.
- **Six weeks later:** it's named in 14 of 72, or 19.4%, a rise of 6.9 points.

At this sample size, the margin of error on that change is about ±12 points, so the rise isn't proven yet. Tallyfold keeps the panel running for another month and adds prompts. Our guide to [measuring GEO](/blog/how-to-measure-geo) explains the sample-size math and a control-prompt test.

## How Rankbox Helps With Threads and Your Own Pages

Rankbox doesn't track AI citations today, so measuring Reddit in AI search stays a manual job, and the free Prompt Kit is the quickest way to start it. Where Rankbox helps is the page side of this work. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google, with volume, difficulty and intent as model estimates. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word, source-backed articles, like the pricing comparison thread D called for. Articles reach your site through Rankbox's API.

[Reddit Presence](/features/reddit-presence), which is rolling out on paid plans, finds relevant threads and drafts replies for you to review and post yourself. It never posts on its own. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### Why does ChatGPT cite Reddit less than Perplexity?

ChatGPT changed how it searches in August 2026. Promptwatch and Otterly saw its Reddit citations fall 73% to 86% in the days after it began pointing many searches at named sites with `site:`. Otterly saw no drop in Perplexity or Gemini, and Google's AI features slid only gradually. ChatGPT still reads plenty of Reddit; it just credits it less. That makes Reddit in AI search an engine-by-engine question.

### Does Google pay Reddit for AI training data?

Neither company has said what, if anything, Google pays. Google's February 2024 post says it has access to Reddit's Data API and may "train on" Reddit content. Reddit's IPO filing, from the same day, disclosed data licensing deals signed in January 2024 worth $203.0 million in total, without naming the buyers.

### Is Reddit in AI search worth the effort for a B2B brand?

Yes, if your buyers already discuss your category there and the threads rank or get cited. Check first: run your buyer questions in Perplexity and Gemini and count the Reddit threads cited. If none show up, put the effort into your own pages and review sites instead.

### Can I post about my own product on Reddit?

Yes, where the community allows it and you're open about it. Reddit's rules require authentic participation and ban misleading identities. Its spam policy asks businesses to post links to themselves sparingly. Read each community's rules, disclose your role, and answer the question before mentioning your product.

### Do I have to disclose that I work for the company?

Yes. Reddit's Rule 5 bans misleading others about who you are, and in the US the FTC's Endorsement Guides say connections readers wouldn't expect, such as your job, must be disclosed clearly. Put a plain line like "I work at Tallyfold" in the comment itself, not only on your profile.

### How do I find which Reddit threads AI engines cite?

Run your buyer questions in engines that show sources, such as Perplexity, Google AI Mode and Gemini, and list every Reddit thread they cite. Repeat each question more than once, because answers change between runs. ChatGPT cites Reddit rarely now, so check its answers for mentions of your brand too.

## References

1. [An expanded partnership with Reddit, Google (22 February 2024)](https://blog.google/company-news/inside-google/company-announcements/expanded-reddit-partnership/)
2. [Expanding our Partnership with Google, Reddit (22 February 2024)](https://www.redditinc.com/blog/reddit-and-google-expand-partnership)
3. [Reddit and OpenAI Build Partnership, Reddit (16 May 2024)](https://www.redditinc.com/blog/reddit-and-oai-partner)
4. [Reddit, Inc. Form S-1, US SEC (22 February 2024)](https://www.sec.gov/Archives/edgar/data/1713445/000162828024006294/reddits-1q423.htm)
5. [Reddit, Inc. Form 10-K for 2025, US SEC (6 February 2026)](https://www.sec.gov/Archives/edgar/data/1713445/000171344526000022/rddt-20251231.htm)
6. [Reddit Q2 2026 shareholder letter, US SEC (30 July 2026)](https://www.sec.gov/Archives/edgar/data/1713445/000171344526000098/exhibit992q226.htm)
7. [Public Content Policy, Reddit Help](https://support.reddithelp.com/hc/en-us/articles/26410290525844-Public-Content-Policy)
8. [Why ChatGPT Cites One Page Over Another (Study of 1.4M Prompts), Ahrefs (April 2026)](https://ahrefs.com/blog/why-chatgpt-cites-pages/)
9. [The 50 Most-Cited Websites in Gemini, Ahrefs (September 2026)](https://ahrefs.com/blog/most-cited-domains-gemini/)
10. [The 50 Most-Cited Websites in Perplexity, Ahrefs (September 2026)](https://ahrefs.com/blog/most-cited-domains-perplexity/)
11. [AI platform citation patterns, Profound (June 2025)](https://www.tryprofound.com/blog/ai-platform-citation-patterns)
12. [The Most-Cited Domains in AI: A 3-Month Study, Semrush (November 2025)](https://www.semrush.com/blog/most-cited-domains-ai/)
13. [Why Did ChatGPT Stop Citing Reddit?, Promptwatch (August 2026)](https://promptwatch.com/blog/chatgpt-stop-citing-reddit)
14. [ChatGPT cut Reddit citations by at least 73% in August 2026, Otterly.AI](https://otterly.ai/blog/chatgpt-reddit-citations/)
15. [Search Quality Evaluator Guidelines, Google (September 2025)](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf)
16. [Reddit Rules, Reddit](https://redditinc.com/policies/reddit-rules)
17. [Spam, Reddit Help](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam)
18. [Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255, eCFR](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255)
19. [FTC's Endorsement Guides: What People Are Asking, US Federal Trade Commission](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)
20. [Language Models are Unsupervised Multitask Learners (GPT-2), OpenAI](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
