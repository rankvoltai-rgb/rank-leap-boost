---
title: AI SEO Checklist: A 30-Minute Pre-Publish Audit for Every New Article
description: A printable AI SEO checklist for new articles: 24 checks in 8 timed sections, from the opening answer to AI crawler rules, with a worked 30-minute pass.
keyword: AI SEO checklist
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, Playbooks
---

An AI SEO checklist for a new article should test what an AI engine needs before it can quote the page: an opening that answers the question, claims tied to named sources and checked against them, clear entities, headings and tables a machine can parse, and a page the AI search crawlers are allowed to reach. The version below fits all of that into 30 minutes. It has 24 checks in eight timed sections, and each check comes with its reason and a pass test.

Most pre-publish lists were built for a different job. A typical one, like [Grid13's 10-point checklist](https://blog.grid13.ai/blog/seo-check-before-publishing-checklist), checks the title tag, meta description, alt text, page speed and URL slug. Only one of its ten core points, a direct answer in the opening, is about being quoted. The AI lists that do cover citations, such as [SEOSLY's AI SEO checklist](https://seosly.com/blog/free-ai-seo-checklist/) and the AI section of [Semrush's technical checklist](https://www.semrush.com/blog/technical-seo-checklist/), are mostly site-level audits. You run those once a quarter, not on each post.

The first version of a new article matters more than it used to, because AI engines lean new. In [Ahrefs' study of about 17 million citations](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content), pages cited by AI assistants were 25.7% fresher on average than pages in Google's organic results, and ChatGPT showed the strongest pull toward new pages. A fresh post is the kind these engines reach for, so the version you publish is often the version they read.

This AI SEO checklist gives you the minute-by-minute flow, every check with its reason and pass test, a simple ship rule, and a worked pass on a fictional draft. It ends with a free printable copy. For posts that are already live, use our [AI SEO checklist for old posts](/blog/ai-seo-checklist), which adds the refresh and re-index steps.

## Key Takeaways

- This AI SEO checklist runs 24 checks in eight timed sections that add up to 30 minutes: opening, sources, claims, entities, headings, tables, crawl access and crawler rules.
- Seven checks in the AI SEO checklist are blockers. If any one fails, hold the post, because a wrong number or a blocked crawler undoes the rest.
- Claim verification gets the most time, six minutes. AI search engines already get attribution wrong: in a Tow Center test, eight of them together answered more than 60% of its citation queries incorrectly.
- Google says AI Overviews and AI Mode need no special optimization, only an indexed page that can show a snippet. That makes a stray `noindex` or `nosnippet` a blocker.
- Allow the search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) on the post's path. Blocking training bots such as GPTBot is a separate business choice.
- Put the answer, tables and FAQ in the server's HTML. Vercel found that none of the major AI crawlers render JavaScript.
- The checklist is free to print and share as a two-page PDF, with a link back to this page.

## Why a Classic Pre-Publish List Misses AI Search

A pre-publish checklist exists to catch problems while they're cheap to fix. The problems that stop an AI engine from quoting a page are different from the ones that stop Google from ranking it, and most lists haven't caught up.

### What the usual checklist covers

Classic lists check what shows on a results page: the title, the meta description, the URL, image alt text and load speed. Those still matter. But none of them tells you whether a passage lifted out of your article would be true, sourced and complete on its own. That's the test an AI answer puts every page through.

The newer AI checklists fix part of this. SEOSLY's, for example, covers answer-first writing, attribution and robots.txt rules for AI bots. But it's a site audit in a spreadsheet, with no time budget and no pass-or-fail line for each article. A per-article pass with a clock, pass tests and a step for checking every figure against its source is the gap a pre-publish AI SEO checklist has to fill.

### What AI engines ask of a new page

The engines publish less than you'd hope, but what they do publish is consistent.

- **Google** says a page needs to be ["indexed and eligible to be shown in Google Search with a snippet"](https://developers.google.com/search/docs/appearance/ai-features) to appear in AI Overviews or AI Mode, and that there are "no additional requirements." Its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) adds that you don't need to write in a special way or cut content into tiny pieces.
- **Microsoft** is more specific. Its October 2025 guide on [inclusion in AI search answers](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers) asks for descriptive headings, lists, comparison tables and "sentences that make sense even when pulled out of context." It warns against hiding answers in tabs.
- **Research** backs the evidence checks. In the [GEO paper](https://arxiv.org/abs/2311.09735) (KDD 2024), citing sources, adding quotations and adding statistics raised a page's visibility in AI answers by 30% to 40%. Keyword stuffing did not help.

So the AI SEO checklist below isn't a set of tricks. It's ordinary good editing, sorted into the order an AI engine meets your page: the opening, the evidence, the structure, and the path a crawler takes to reach it.

## The 30-Minute AI SEO Checklist, Minute by Minute

Run the eight sections in order, with a timer. Content comes first because the writer can fix it alone. Crawl access comes last because it may need a developer.

| Clock       | Section                  | Checks | Blockers | Have open                                  |
| ----------- | ------------------------ | ------ | -------- | ------------------------------------------ |
| 00:00–03:00 | 1. Direct-answer opening | 3      | 1        | The draft.                                 |
| 03:00–07:00 | 2. Source attribution    | 3      | 1        | The draft.                                 |
| 07:00–13:00 | 3. Claim verification    | 3      | 1        | Each source in its own tab.                |
| 13:00–17:00 | 4. Entity clarity        | 3      | 0        | The draft and a markup tester.             |
| 17:00–20:00 | 5. Semantic headings     | 3      | 0        | A heading checker.                         |
| 20:00–23:00 | 6. Tables and lists      | 3      | 0        | The preview page.                          |
| 23:00–27:00 | 7. Crawl accessibility   | 3      | 2        | A terminal and the preview URL.            |
| 27:00–30:00 | 8. AI crawler directives | 3      | 2        | A robots.txt tester and your CDN settings. |
| **Total**   | **30 minutes**           | **24** | **7**    |                                            |

Ask the writer to hand over three things with the draft: the preview URL, the list of sources, and the one question the article answers. That keeps the setup out of your 30 minutes.

If your preview sits on a staging host that's set to `noindex` on purpose, run sections 7 and 8 against the live site instead: a post already published on the same template, and your live robots.txt with the new post's path.

### How to score the AI SEO checklist

Tick each check in the AI SEO checklist as a pass or a miss, then apply one rule:

- **Ship:** all 7 blockers pass and at least 20 of the 24 checks pass.
- **Fix, then ship:** all blockers pass and 16 to 19 checks pass. Fix the misses the same day.
- **Hold:** any blocker fails, or fewer than 16 checks pass.

The blockers are marked **(B)** below. Each one either makes the page wrong or makes it unreachable, and no amount of polish elsewhere makes up for that.

## Minutes 0–13: The Answer, the Sources and the Claims

The first three sections of the AI SEO checklist decide whether a quoted passage from your article would be useful and true. Together they take 13 minutes, and claim verification gets almost half of that.

### Section 1: Direct-answer opening (3 minutes)

| #       | Check                                                           | Why it matters                                                                                                                        | Pass test                                                                                  |
| ------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1.1 (B) | The first sentence answers the title's question.                | Microsoft says assistants "can often lift" a clear question-and-answer pair word for word. A warm-up line gives them nothing to lift. | Read only the first sentence. It works as a full answer, with the key number or condition. |
| 1.2     | The opening is two or three sentences and under about 60 words. | A short opening keeps the whole answer in one quotable block.                                                                         | Count the words before the first paragraph break.                                          |
| 1.3     | The answer states its scope: who, where or when it applies.     | An answer without its conditions gets quoted as if it were true everywhere.                                                           | Any answer that changes by country, plan, size or date says which one.                     |

Our free [AI Citation Readiness Checker](/tools/ai-citation-readiness-checker) flags an opening that doesn't give a direct answer in its first 40 to 60 words. Paste the draft in and it runs in your browser.

### Section 2: Source attribution (4 minutes)

| #       | Check                                                                               | Why it matters                                                                                  | Pass test                                                                   |
| ------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 2.1 (B) | Every number, quote and "research shows" claim links to its source where it's used. | Citing sources was one of the three methods that lifted visibility 30% to 40% in the GEO paper. | Highlight every number. Each has a link in the same sentence.               |
| 2.2     | Links go to the primary source, not a roundup that quotes it.                       | Roundups round numbers and drop dates. The original lets a reader, or an engine, check you.     | Each link lands on the study, the vendor's own doc, the law or the dataset. |
| 2.3     | The source is named in the sentence, not only linked.                               | A quoted passage can lose its link. A name like "according to GOV.UK" travels with the text.    | No bare "here" or "this study" links.                                       |

Google's own quality questions ask whether content shows ["clear sourcing, evidence of the expertise involved."](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) Section 2 is where you prove it.

### Section 3: Claim verification (6 minutes)

This is the section most checklists skip, and the one that protects your name. AI search engines already struggle with attribution. When the Tow Center at Columbia tested eight of them on 1,600 queries, they [gave incorrect answers more than 60% of the time](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php), and were "generally bad at declining to answer." If your page carries a wrong number, an engine can repeat it with your brand attached.

| #       | Check                                                                            | Why it matters                                                                                                                       | Pass test                                                                                      |
| ------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 3.1 (B) | Each linked number matches its source: same figure, unit, year and scope.        | Google asks, "Does the content have any easily-verified factual errors?" An engine that quotes the error repeats it under your name. | Open every source, find the number, tick it. Fix or cut any mismatch.                          |
| 3.2     | Claims with no source are cut, or rewritten as your own labelled view.           | If you can't find a source for a figure, a reader can't either, and no engine can confirm it elsewhere.                              | Search the draft for numbers, "studies" and "experts". None is left without a link or a label. |
| 3.3     | Fast-moving facts carry a date: prices, stats, features, laws and "best" claims. | A dated fact stays true in context. An undated one goes stale without warning.                                                       | Every price, statistic and product claim has a month and year, such as "as of September 2026". |

As a rule of thumb, six minutes covers eight to ten sources. If a draft cites more, split the job with the writer, or give this section more time and say so. Don't skim it. Your own product facts count too: if the post mentions your prices or plans, check them against your pricing page, the way our guide to [hallucination by omission](/blog/hallucination-by-omission-pricing-page) describes.

## Minutes 13–23: Entities, Headings and Tables

The middle ten minutes of the AI SEO checklist test whether a machine can tell what each part of the page is about, and pull out a clean piece of it.

### Section 4: Entity clarity (4 minutes)

An entity is a named thing an engine can identify: a company, a product, a law, a person. Clear entities let a lifted passage keep its meaning.

| #   | Check                                                                                              | Why it matters                                                                                                                                                                                                    | Pass test                                                                                            |
| --- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 4.1 | Each section names its subject in full at first use, not "it", "we" or "the tool".                 | Sections get pulled out alone. A pronoun that points to an earlier section points at nothing.                                                                                                                     | The first sentence under every H2 names the subject.                                                 |
| 4.2 | Each key term is defined once in an "X is a Y that Z" sentence, and abbreviations are spelled out. | In Rankbox's [embedding experiment](/blog/vector-distance-vs-keyword-density), per point of density, a definition sentence moved similarity 3.2 times as much as a keyword mention (median of eight open models). | The two or three terms the post depends on each have a definition sentence.                          |
| 4.3 | Article markup names the author, headline and dates, and matches the page.                         | Google's rules say markup must be "a true representation of the page content."                                                                                                                                    | The Rich Results Test shows Article with no errors, and the byline and dates match what readers see. |

Google's [Article markup guide](https://developers.google.com/search/docs/appearance/structured-data/article) recommends `author`, `datePublished`, `dateModified` and `headline`, and "strongly" recommends a `url` or `sameAs` for each author. The [Rich Results Test](https://support.google.com/webmasters/answer/7445569) accepts pasted code, so you can check markup before the page is live. Markup won't earn you a place in AI answers on its own: Google says structured data "isn't required for generative AI search." It just has to be right. For what a named, verifiable author can and can't do, see our look at whether [author bios help AI search visibility](/blog/do-author-bios-help-ai-search-visibility).

### Section 5: Semantic headings (3 minutes)

| #   | Check                                                       | Why it matters                                                                                                                                                                                                | Pass test                                                                                             |
| --- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 5.1 | There's one H1 and no skipped heading levels.               | The W3C says [skipping heading ranks](https://www.w3.org/WAI/tutorials/page-structure/headings/) "can be confusing." Screen readers build the page outline from these levels, and so do many content parsers. | A heading checker shows one H1 and no jump from H2 to H4.                                             |
| 5.2 | Each H2 and H3 names its topic or asks its sub-question.    | Microsoft's example: not "Learn More" but "What Makes This Dishwasher Quieter Than Most Models?"                                                                                                              | Read the headings alone. Each one tells you what its section answers. No "Overview" or "Wrapping up". |
| 5.3 | The first sentence under each heading answers that heading. | A heading and its first sentence make a ready question-and-answer pair.                                                                                                                                       | Spot-check every H2.                                                                                  |

Paste the draft into our [Heading Structure Checker](/tools/heading-structure-checker) for 5.1. It also flags duplicate headings and any over 70 characters.

### Section 6: Tables and lists (3 minutes)

| #   | Check                                                                          | Why it matters                                                                                                  | Pass test                                                                   |
| --- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 6.1 | Any comparison of three or more items sits in an HTML table with a header row. | Microsoft says "comparison tables break complex details into clean, reusable segments."                         | No paragraph walks through "A costs this, B costs that, C costs the other." |
| 6.2 | Tables and charts are text, not screenshots.                                   | Microsoft notes that reading text from images "adds extra complexity." A crawler that reads only HTML skips it. | You can select the table's text on the preview page.                        |
| 6.3 | Steps are a numbered list, one action per item.                                | Numbered steps can be quoted one at a time, in order.                                                           | Any process with an order is numbered, and each step makes sense alone.     |

## Minutes 23–30: Crawl Access and AI Crawler Directives

The last seven minutes of the AI SEO checklist cover the path a crawler takes to your page. These checks usually pass once your templates are right. They're in the checklist because the one time they fail, nothing else in it matters. They cover one page only. Site-wide checks, such as server logs, bot IP verification and llms.txt, belong in a quarterly [AEO audit](/blog/aeo-audit).

### Section 7: Crawl accessibility (4 minutes)

| #       | Check                                                                                                    | Why it matters                                                                                                                                                                                            | Pass test                                                                                |
| ------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 7.1 (B) | The final URL returns a 200 status and its canonical tag points to itself.                               | Google needs a page that's indexed and eligible for a snippet. A canonical that points elsewhere asks Google to index the other URL instead.                                                              | A status check returns 200, and the canonical in the page source is the post's own URL.  |
| 7.2 (B) | The answer, tables and FAQ are in the HTML the server sends, not loaded by JavaScript or hidden in tabs. | In its December 2024 analysis, Vercel found that [none of the major AI crawlers render JavaScript](https://vercel.com/blog/the-rise-of-the-ai-crawler), including OpenAI's, Anthropic's and Perplexity's. | The raw HTML contains the first words of the opening, one table cell and one FAQ answer. |
| 7.3     | The post is linked from at least one live page and listed in the XML sitemap.                            | Google's AI features guide asks for content that's "easily findable through internal links."                                                                                                              | A related post or the blog index links to it, and the sitemap lists the URL.             |

Two terminal commands cover 7.1 and 7.2. Replace the URL and the phrase with your own:

```bash
# 7.1: status code and any robots header
curl -sI https://example.com/blog/new-post | grep -iE "^HTTP|x-robots-tag"

# 7.2: is the opening in the raw HTML? A count of 0 means it's rendered by JavaScript
curl -s https://example.com/blog/new-post | grep -c "first six words of your opening"
```

For a quick outside view once the page is public, our [AI Search Readiness Check](/tools/ai-search-readiness-check) fetches the page and grades crawler access, one H1, a canonical, structured data and whether real HTML content came back.

### Section 8: AI crawler directives (3 minutes)

| #       | Check                                                                                                                            | Why it matters                                                                                                                                                                                                                            | Pass test                                                                                                |
| ------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 8.1 (B) | robots.txt allows the search crawlers on the post's path: Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and PerplexityBot. | OpenAI says sites that block OAI-SearchBot [won't be shown in ChatGPT search answers](https://developers.openai.com/api/docs/bots) except as navigational links. Anthropic says blocking Claude-SearchBot stops it indexing your content. | A robots.txt tester, given the live file and the new path, shows "allowed" for each.                     |
| 8.2 (B) | No unintended `noindex`, `nosnippet`, small `max-snippet`, `noarchive` or `nocache` rule, in the page or its headers.            | Google says `nosnippet` also stops content being used as a "direct input for AI Overviews and AI Mode." Bing said in 2023 that `noarchive` keeps a page out of its chat answers.                                                          | The page source and the `X-Robots-Tag` header show only rules you meant to set.                          |
| 8.3     | Your CDN or firewall lets verified search crawlers through.                                                                      | Since 15 September 2026, Cloudflare blocks its Agent and Training bot categories by default on ad-carrying pages of new domains.                                                                                                          | Your CDN's AI crawler settings show the search category allowed, with no new rule since your last check. |

Keep two kinds of bot apart when you read 8.1. Search crawlers decide whether you can be found and cited. Training crawlers, such as GPTBot, ClaudeBot and the Google-Extended token, decide whether your pages train future models. Google says Google-Extended ["does not impact a site's inclusion in Google Search."](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers) Blocking training bots is a fair choice. Blocking search bots by accident is the mistake this check catches.

Our free [robots.txt Tester](/tools/robots-txt-tester) takes your live file and a path, and shows the verdict for every known bot at once. For each vendor's user agents and IP lists, see our [AI crawler directory](/blog/ai-crawler-directory). If you run on Cloudflare, the [Cloudflare challenge trap](/blog/cloudflare-challenge-trap) shows where a blocked AI bot appears in its logs.

## A Worked AI SEO Checklist Pass on a Tallyfold Draft

Tallyfold is a fictional invoicing and payments app for agencies, and the draft below is made up. The law it discusses is real, and every fix links the official source.

The draft is a 1,400-word post titled "Can Agencies Charge Interest on Late Invoices?" A writer produced it with an AI assistant, and it's due to publish on `tallyfold.example/blog` the next morning. Here's what 30 minutes with the AI SEO checklist turned up.

| Section       | Passed      | What the pass found                                                                                                                                                                          | The fix                                                                                                                         |
| ------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1. Opening    | 1 of 3      | It opened with "Late payments are every agency owner's headache. Luckily, the law is on your side." No answer, and no mention that the rules are UK and business-to-business only.           | A new first sentence with the answer and its scope, shown below.                                                                |
| 2. Sources    | 1 of 3      | The line "1 in 3 invoices is paid late" had no link. The law was linked through a solicitor's blog summary.                                                                                  | Cut the unsourced line. Linked GOV.UK and legislation.gov.uk directly.                                                          |
| 3. Claims     | 0 of 3      | It said "8% interest". GOV.UK says 8% plus the Bank of England base rate. It said "a £100 fee on every late invoice". GOV.UK sets £40, £70 or £100 by debt size, once per payment. No dates. | Corrected both claims and dated the section "as of September 2026".                                                             |
| 4. Entities   | 1 of 3      | "The Act" was never named. "BoE" was never spelled out. Sections opened with "our app". The Article markup was fine.                                                                         | Named the Late Payment of Commercial Debts (Interest) Act 1998 in full, spelled out Bank of England, and used Tallyfold's name. |
| 5. Headings   | 1 of 3      | H2s read "Overview", "The details" and "Wrapping up", and none opened with an answer.                                                                                                        | Rewrote them as questions, such as "When is a UK invoice legally late?"                                                         |
| 6. Tables     | 1 of 3      | The fee bands were a spreadsheet screenshot, so they were neither text nor an HTML table. The chasing steps were already numbered.                                                           | Rebuilt the bands as an HTML table.                                                                                             |
| 7. Crawl      | 2 of 3      | The FAQ loaded through a JavaScript accordion. The raw HTML had none of its text.                                                                                                            | The developer switched the FAQ to plain headings and paragraphs in the template.                                                |
| 8. Directives | 2 of 3      | A 2024 block list still had `User-agent: PerplexityBot` with `Disallow: /`.                                                                                                                  | Removed that group. GPTBot stayed blocked, as a deliberate training choice.                                                     |
| **Total**     | **9 of 24** | Five of the seven blockers failed: 1.1, 2.1, 3.1, 7.2 and 8.1.                                                                                                                               | **Verdict: Hold.**                                                                                                              |

The new opening passes 1.1 and 1.3 at once, and every figure in it comes from [GOV.UK's guide to charging interest](https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt) and its page on [debt recovery costs](https://www.gov.uk/late-commercial-payments-interest-debt-recovery/claim-debt-recovery-costs):

> Yes. Under UK law, an agency can charge another business statutory interest of 8% plus the Bank of England base rate on a late invoice, plus a one-off fixed sum of £40, £70 or £100 depending on the size of the debt.

The fee table that replaced the screenshot is three rows long:

| Debt size           | Fixed sum you can claim |
| ------------------- | ----------------------- |
| Up to £999.99       | £40.                    |
| £1,000 to £9,999.99 | £70.                    |
| £10,000 or more     | £100.                   |

The writer's fixes took about 40 minutes and the developer's took 15. A second pass scored 23 of 24, with every blocker passing. The one miss was 5.3: the closing section still opened with a recap instead of an answer. That's a same-day fix, not a reason to wait, so the verdict became **Ship**.

Notice where the misses were. Almost none were classic SEO problems. The title, meta description and URL were fine. The misses were a wrong interest rate, a wrong fee, a crawler blocked by an old rule, and a FAQ no AI crawler could read. A traditional checklist would have passed this draft. The AI SEO checklist held it.

## Download the Checklist

The whole AI SEO checklist fits on two A4 pages: 24 tick boxes in eight timed sections, the pass test for each, the seven blockers marked, and the ship rule at the bottom.

**[Download the AI SEO checklist (PDF)](/downloads/ai-seo-checklist.pdf)**

It's free to share. Print it, put it in your editorial workflow, or hand it to a client, as long as you link back to this page as the source. Agencies are welcome to use it on client work.

Keep the web version of the AI SEO checklist bookmarked too. Microsoft's guidance advises against [relying on PDFs for core information](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers), which is why every check also lives on this page as plain HTML. The PDF is for the desk. This page is the one that stays current.

For drafts that need deeper work on each passage, the Lift Test in our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search) goes section by section. To plan the structure before anyone writes, use the [six-block template for AI citation](/blog/how-to-write-blog-posts-for-ai-citation).

## Where Rankbox Fits in a Pre-Publish Audit

Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts 2,000–3,500-word articles with their sources linked, and every draft gets an [SEO score and a GEO score](/features/seo-geo-score) before it ships. That covers part of sections 1, 2 and 5. It doesn't replace the pass. Only your team can confirm a figure against its source for your market, add your own data, and check your robots.txt, templates and CDN. Rankbox doesn't manage crawler access, and it doesn't track AI citations today.

Articles reach your site through Rankbox's API on the Business plan, at $49.50 a month with a 7-day trial. [See pricing](/pricing). Run this AI SEO checklist on those drafts the same way you'd run it on your own.

## Frequently Asked Questions

### What should an AI SEO checklist include?

An AI SEO checklist should cover the opening answer, source links, claim checks, entity names, headings, tables, crawl access and AI crawler rules. Classic items like title tags still matter, but they don't test whether a passage lifted into an AI answer would be true and complete. Give each check a pass test, and mark the few that block publishing.

### How long should a pre-publish SEO audit take?

About 30 minutes is enough for a typical 1,500-word article if the writer hands over the preview URL and source list first. That's the budget this AI SEO checklist is built around. Spend the most time on checking claims against sources. Crawl and crawler-rule checks go fast once your templates are right, but keep them in, because a single failure there hides the page from AI search.

### Do I need to allow GPTBot for my articles to appear in ChatGPT?

No. GPTBot collects training data. ChatGPT search relies on OAI-SearchBot, and OpenAI says sites that block OAI-SearchBot won't be shown in ChatGPT search answers except as navigational links. You can block GPTBot and still allow OAI-SearchBot. Changes take about 24 hours to reach OpenAI's systems.

### Does structured data help new articles appear in AI answers?

Not on its own. Google says structured data "isn't required for generative AI search." Article markup is still worth adding, because it states the author and dates clearly. It must match what the page shows. Google also stopped showing FAQ rich results in 2026, so don't add FAQ markup expecting a special listing.

### Do I need an llms.txt file before I publish?

No. Google says you don't need new machine-readable files or AI text files to appear in its search, and as of September 2026 no AI search engine documents reading other sites' llms.txt files. It's optional and cheap to add. Our guide on [whether llms.txt helps SEO](/blog/will-llms-txt-help-your-seo) covers when it's worth it.

### Can I share this AI SEO checklist with clients?

Yes. The PDF is free to print, share and use on client work, as long as you link back to this page as the source. Keep the footer on the printed copy so readers can find the current version on this page.

## References

1. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
2. [Google's guide to optimizing for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
3. [Robots meta tags specifications, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
4. [Google's common crawlers (Google-Extended), Google Search Central](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)
5. [General structured data guidelines, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
6. [Learn about Article schema markup, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
7. [Creating helpful, reliable, people-first content, Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
8. [Rich Results Test, Search Console Help](https://support.google.com/webmasters/answer/7445569)
9. [Optimizing your content for inclusion in AI search answers, Microsoft Advertising](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)
10. [Announcing new options for webmasters to control usage of their content in Bing Chat, Microsoft Bing](https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat)
11. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
12. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
13. [Perplexity crawlers, Perplexity](https://docs.perplexity.ai/guides/bots)
14. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
15. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
16. [GEO: Generative Engine Optimization (Aggarwal et al., KDD 2024)](https://arxiv.org/abs/2311.09735)
17. [AI search has a citation problem, Columbia Journalism Review Tow Center](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php)
18. [New study: AI assistants prefer to cite "fresher" content, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content)
19. [Late commercial payments: charging interest, GOV.UK](https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt)
20. [Headings, W3C Web Accessibility Initiative](https://www.w3.org/WAI/tutorials/page-structure/headings/)
