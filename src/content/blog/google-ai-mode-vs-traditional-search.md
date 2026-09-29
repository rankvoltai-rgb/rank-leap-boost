---
title: Google AI Mode vs. Traditional Search: What It Means for Web Traffic
description: Google AI Mode turns one question into many searches and one long answer. How it differs from classic results, and what the data says about your traffic.
keyword: Google AI Mode
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, Google
---

Google AI Mode is a conversational way to search Google. It splits your question into subtopics, searches for each one at the same time, and writes one long answer with links, which you can then refine with follow-up questions. Traditional search returns a ranked list of pages for the words you typed. For web traffic, that difference means fewer clicks per search: in a [March 2026 field experiment](https://arxiv.org/abs/2608.18352), sending every search to AI Mode cut click-through to websites by 18.8 percentage points.

The catch is scale. Google says AI Mode [passed one billion monthly users](https://blog.google/products-and-platforms/products/search/search-io-2026/) in May 2026. Yet in Similarweb's US browser panel, only [0.34% of Google searches](https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/) reached AI Mode between January and April 2026. So AI Mode takes a bigger bite out of each search, from a slice of searches that is still small and growing fast.

Most coverage blurs AI Mode with AI Overviews and blends their traffic studies into one scary number. This guide keeps them apart. It lays out how each surface works, what Google means by "query fan-out", how follow-ups change a buyer's path, what every credible study found, and how to estimate your own exposure. New to the topic? Start with our explainer on [what Google AI Mode is and how it works](/blog/what-is-google-ai-mode), or the user's guide to [where to find AI Mode in Google](/blog/what-is-ai-mode-in-google).

## Key Takeaways

- Google AI Mode is a separate conversational surface, not a bigger AI Overview. Google says it "divides your question into subtopics and searches for each one simultaneously," and gives no fixed number of sub-searches.
- AI Overviews and AI Mode share the same eligibility rules and the same Search Console report, but Google says they "may use different models and techniques." Ahrefs found they cite the same URL only 13.7% of the time.
- In Search Console, every AI Mode follow-up counts as a new query, and AI Mode positions are counted like a normal results page. The generative AI report shows impressions only and doesn't split AI Mode from AI Overviews.
- The strongest AI Mode traffic evidence is a 1,100-person field experiment: forcing searches into AI Mode cut click-through by 18.8 points and cut daily search sessions by 0.92.
- AI Overviews data is a separate story. Ahrefs linked an AI Overview to a 58% lower click rate for the top result in December 2025, while Seer Interactive saw those click rates partly recover in early 2026.
- Google says optimizing for AI Mode is still SEO, and warns that writing a page for every fan-out variant breaks its scaled content abuse policy.
- Our AI Mode Exposure Model turns three inputs into an estimate of clicks at risk. For a fictional invoicing brand with 30,000 monthly Google clicks, it puts the risk at about 43 clicks today and about 990 in a heavier-adoption scenario.

## What Changes When You Search in Google AI Mode

A classic Google search works in [three stages](https://developers.google.com/search/docs/fundamentals/how-search-works): crawl the web, index what it finds, then serve the pages it judges most relevant to the query. You type a few words, scan ten links and a few features, click one, and come back to try again. Each new idea is a new search.

Google AI Mode changes the unit of search from a query to a conversation. Google's help center calls it its ["most powerful AI search experience"](https://support.google.com/websearch/answer/16011537?hl=en). When it [launched in Labs](https://blog.google/products/search/ai-mode-search/) in March 2025, Google said its custom Gemini model would "make a plan, conduct searches to find information and adjust the plan based on what it finds." It draws on the web index, the Knowledge Graph and shopping data, then writes one answer with links. If Google isn't confident in the answer, it shows a set of web links instead.

Three things follow for anyone who publishes on the web:

1. **The searcher asks more at once.** Google says the [average AI Mode search is triple the length](https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/) of a traditional query in the US.
2. **Google does the follow-up searching.** The sub-searches are written by the model, not typed by a person, so they never show up in a keyword tool.
3. **The answer arrives before the click.** Visits come from people who want to check, go deeper or act.

For the full mechanics, including Deep Search and the other tools inside AI Mode, see [what Google AI Mode is](/blog/what-is-google-ai-mode) or the short definition in our [AI Mode glossary entry](/glossary/ai-mode). The rest of this guide is about what the change means for your pages and your traffic.

## AI Mode vs. AI Overviews vs. Classic Results: How Each One Works

Google runs three answer surfaces side by side. They share an index, but they behave and report differently. Here is the breakdown, sourced to Google's own pages as of September 2026.

|                         | Classic results            | AI Overviews                                                     | Google AI Mode                                                                        |
| ----------------------- | -------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Where it appears        | Every results page         | Top of some results pages, only when Google judges it "additive" | Its own mode: the AI Mode button, google.com/ai, the Google app, Chrome's address bar |
| What the searcher sees  | Ranked links plus features | A short summary with supporting links                            | A long answer with inline links, follow-up box and suggestions for further reading    |
| Model (Sept 2026)       | Ranking systems            | Gemini 3, default globally since January 2026                    | Gemini 3.5 Flash by default since May 2026; a model menu offers others                |
| Query fan-out           | No; one query              | "May use" fan-out                                                | Core technique; Deep Search "can issue hundreds of searches"                          |
| Follow-ups              | Type a new search          | A follow-up moves you into AI Mode                               | Built in, with context kept                                                           |
| Search Console position | Standard rules             | Every link shares the Overview's one position                    | Counted like a normal results page                                                    |
| Search Console queries  | One per search             | One per search                                                   | Each follow-up counts as a new query                                                  |
| Generative AI report    | Not included               | Impressions included                                             | Impressions included, not split from AI Overviews                                     |
| GA4 channel             | Organic Search             | Organic Search                                                   | Organic Search                                                                        |
| Site owner opt-out      | `noindex`                  | Search generative AI control or `nosnippet`                      | The same control                                                                      |

### Where each surface appears

AI Overviews sit inside the normal results page. Google's [AI features documentation](https://developers.google.com/search/docs/appearance/ai-features) says they are "only shown when our systems determine that it is additive to classic Search, and as such, often don't trigger." Google AI Mode, by contrast, is something the searcher opens. Since January 2026, a follow-up question typed under an AI Overview [continues in AI Mode](https://blog.google/products-and-platforms/products/search/ai-mode-ai-overviews-updates/), and Google made that flow live on desktop and mobile worldwide at I/O in May 2026.

### The models behind them

Google made Gemini 3 the default model for AI Overviews globally on 27 January 2026. On 19 May 2026 it made Gemini 3.5 Flash ["the new default model in AI Mode for everyone globally"](https://blog.google/products-and-platforms/products/search/search-io-2026/). AI Mode also has a model menu with a "Pro" option, subject to daily limits. Since 2 September, Google AI Pro and Ultra members can also [pick Gemini 3.8 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/). Google has also described [automatic routing](https://blog.google/products-and-platforms/products/search/gemini-3-search-ai-mode/), starting with US subscribers, that sends harder questions to stronger models and simpler ones to faster models. Some of Google's own product pages still describe AI Mode as running on Gemini 3.

### How links and sources differ

Because the two AI surfaces search separately, they rarely cite the same pages. Ahrefs compared 540,000 query pairs from September 2025 and found a [13.7% overlap in cited URLs](https://ahrefs.com/blog/ai-overviews-vs-ai-mode/), even though the answers reached similar conclusions 86% of the time. AI Mode answers ran about four times longer and named 3.3 people or brands on average, against 1.3 in AI Overviews.

Google has also changed how AI Mode shows links. In [May 2026](https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/) it added links right next to the sentences they support, suggestions for in-depth reading at the end of many answers, and previews of forum and social posts with the community's name attached.

### How each one shows up in your reports

Search Console's help page on [how clicks, impressions and position are counted](https://support.google.com/webmasters/answer/7042828?hl=en) treats the two AI surfaces differently. An AI Overview takes one position, and every link inside it shares that position. In AI Mode, "position follows the same methodology as a Google Search results page," and a follow-up question means the user is "essentially performing a new query." One five-turn conversation can therefore add five queries to your data.

![How AI Is Changing Google Search and SEO](youtube:_R04ySodhGE "On Search Off the Record, Nikola Todorovic, a director of software engineering at Google Search, on the move from classic results to AI Overviews and AI Mode (May 2026).")

## Query Fan-Out: What Google Actually Says

You may read that AI Mode checks a set number of related questions for every search, such as five. Google's documentation gives no such number. Google has described [query fan-out](/glossary/query-fan-out) many times, and it has never given a fixed count:

| Source                | Date                   | Google's wording                                                                               |
| --------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| AI Mode launch post   | March 2025             | "issuing multiple related searches concurrently across subtopics and multiple data sources"    |
| I/O 2025 post         | May 2025               | "breaking down your question into subtopics and issuing a multitude of queries simultaneously" |
| Deep Search, I/O 2025 | May 2025               | "can issue hundreds of searches"                                                               |
| Gemini 3 in AI Mode   | November 2025          | fan-out "can perform even more searches to uncover relevant web content"                       |
| AI optimization guide | Updated July 2026      | "a set of concurrent, related queries generated by the model"                                  |
| AI Mode help page     | Checked September 2026 | "dividing your question into subtopics and searching for each one simultaneously"              |

So the honest answer to "how many searches does Google AI Mode run?" is: several, a variable number, and up to hundreds in Deep Search. The one worked example Google gives, in its [guide to generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), lists three. For "how to fix a lawn that's full of weeds," the sub-queries "might include 'best herbicides for lawns', 'remove weeds without chemicals', and 'how to prevent weeds in lawn'."

The practical point survives without the number. Your page doesn't compete only for the words the searcher typed. It competes to answer one of the narrower questions the model writes on their behalf. That is why a smaller site can earn a link inside an answer about a category it would never rank first for. Our [AI Overviews playbook](/blog/how-to-show-up-in-google-ai-overviews) walks through mapping those subtopics for the shorter surface.

## How Follow-Ups in Google AI Mode Change the Buyer's Journey

In classic search, a buyer researching software runs a string of separate searches, and each one is a fresh start. In Google AI Mode, much of that research can happen in one thread, because the context carries from one turn to the next. The published data shows what that does to behavior.

- **Questions get longer and more goal-shaped.** Google reports that AI Mode queries about planning grew 80% faster than AI Mode queries overall in the six months before May 2026.
- **Follow-ups are rising fast.** Google's [one-year AI Mode report](https://storage.googleapis.com/gweb-uniblog-publish-prod/documents/AI-Mode-US-Insights.pdf) says follow-up queries in AI Mode grew by more than 40% a month on average in the US. It also says shoppers "often begin their journey with traditional Search and click into AI Mode to dive deeper."
- **Sessions get fewer but longer.** In the Penn and Northeastern experiment, people moved into AI Mode ran 0.92 fewer search sessions a day, and each session lasted 0.43 minutes longer.
- **Reaching a specific site gets harder.** When the same study asked the AI Mode group for their overall impression, 15.3% of the 309 answers mentioned trouble getting to a website they wanted, and 13.4% mentioned limited links or sources.

What this means is that the thread, not the query, is now the unit you compete in. A buyer might meet your brand in turn one, drop you in turn two, and never return. Or they might find you only when they ask about pricing in turn three. Our post on [how AI search uses user intent and context](/blog/how-ai-search-uses-user-intent-and-context) covers how assistants carry that context between turns, and our model of the [four conversational buyer stages](/blog/ai-search-intent-conversational-buyer-stages) maps the content each stage needs.

### The Turn Map: one conversation, four chances to be cited

Here is how that plays out in Google AI Mode for Tallyfold, a fictional invoicing and payments app for agencies, with fictional rivals Brindlework and Kestrelyn. Google doesn't publish the sub-searches it runs, so the fan-out column is illustrative. The last column is the page Tallyfold needs for each turn.

| Turn | What the buyer types                                                                    | Sub-searches Google might run (illustrative)                                         | Page that can win the turn                                            |
| ---- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 1    | "Best invoicing software for a 12-person design agency that bills in euros and dollars" | invoicing software for agencies; multi-currency invoicing; agency billing tools 2026 | A fair "best invoicing tools for agencies" guide with clear criteria  |
| 2    | "Which of those handle retainers and partial payments?"                                 | retainer billing software; partial payment invoicing; deposit invoices               | A retainer and deposits feature page stating exactly what's supported |
| 3    | "Tallyfold vs Brindlework pricing for 12 users"                                         | Tallyfold pricing; Brindlework pricing; per-user invoicing cost                      | An official pricing page with a dated price table                     |
| 4    | "How do I move my invoices from spreadsheets to Tallyfold?"                             | import invoices from spreadsheet; Tallyfold migration                                | A step-by-step migration guide                                        |

The turns move from broad to specific, and the specific turns point at the vendor's own pages. A site that owns only the turn-one guide gets one of four chances. In Search Console, this single conversation would appear as four separate queries.

## What Google AI Mode Means for Web Traffic: The Evidence

Many articles put a Pew figure about AI Overviews next to a Semrush figure about AI Mode and draw one conclusion. The two surfaces work differently, reach different numbers of people and were measured in different ways, so we treat them separately.

### What Google says

In August 2025, Google's head of Search wrote that [total organic click volume](https://blog.google/products-and-platforms/products/search/ai-search-driving-more-queries-higher-quality-clicks/) from Google Search to websites "has been relatively stable year-over-year." She added that Google sends "slightly more quality clicks," meaning clicks where users "don't quickly click back." The post called third-party reports of steep declines "often based on flawed methodologies." It also said traffic is shifting, "resulting in decreased traffic to some sites and increased traffic to others." Google's developer documentation adds that clicks from pages with AI Overviews "are higher quality." Google hasn't published the numbers behind either claim.

### Independent data on Google AI Mode

- **A causal experiment.** Researchers at the University of Pennsylvania and Northeastern University ran a [preregistered field experiment](https://arxiv.org/html/2608.18352v1) with 1,100 US Chrome users in March 2026. After three normal days, a browser extension put each person into one of three groups for seven days: normal Google, Google with AI features hidden, or every search redirected to AI Mode. The AI Mode group's click-through rate to outside sites fell by 18.8 percentage points. Their clicks to news sites, Reddit and Wikipedia all fell, and 11.2 points more of them tried a rival search engine.
- **Early clickstream.** Semrush studied about 69 million US desktop search sessions from May to July 2025. It found that only [6–8% of AI Mode sessions](https://www.semrush.com/blog/google-ai-mode-seo-impact/) led to a visit to an outside site. AI Mode's share of sessions rose from 0.25% to just over 1% in that period.
- **Adoption.** SparkToro's analysis of Similarweb's US panel found that 0.34% of Google searches reached AI Mode from January to April 2026. That panel covers browser searches and leaves out the Google app.

Read the experiment carefully. It shows what happens when AI Mode is forced on everyone for a week, not when people choose it. The authors note that baseline AI Mode use in their sample was only 0.6% of searches. It is the best evidence on the per-search effect, not a forecast of your traffic.

### Independent data on AI Overviews (kept separate)

- **Pew Research Center** tracked 68,879 searches by 900 US adults in March 2025. People [clicked a regular result](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/) on 8% of visits with an AI summary, against 15% without one.
- **Ahrefs** compared 300,000 keywords using Search Console data from December 2023 and December 2025. An AI Overview [correlated with a 58% lower click rate](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/) for the top-ranking page.
- **Seer Interactive** tracked 5.47 million queries across 53 brands. Organic click rates on AI Overview queries [fell to 1.3% in December 2025](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update), then rose to 2.4% by February 2026. Pages cited inside the Overview earned 120% more clicks per impression than pages that weren't.

| Study                              | Surface      | Sample and method                         | Finding                                                 | Type        |
| ---------------------------------- | ------------ | ----------------------------------------- | ------------------------------------------------------- | ----------- |
| Wang et al., Aug 2026              | AI Mode      | 1,100 US Chrome users, randomized, 7 days | Click-through down 18.8 points when forced into AI Mode | Causal      |
| Semrush, Jul 2025                  | AI Mode      | ~69M US desktop sessions, clickstream     | 6–8% of AI Mode sessions reach an outside site          | Descriptive |
| SparkToro and Similarweb, Jun 2026 | AI Mode      | US browser panel, Jan–Apr 2026            | 0.34% of searches reach AI Mode                         | Descriptive |
| Pew, Jul 2025                      | AI Overviews | 900 adults, 68,879 searches               | 8% vs 15% clicked a result                              | Correlation |
| Ahrefs, Feb 2026                   | AI Overviews | 300,000 keywords, Search Console data     | Top result's click rate 58% lower                       | Correlation |
| Seer Interactive, Apr 2026         | AI Overviews | 53 brands, 5.47M queries                  | Click rates bottomed in Dec 2025, then rose             | Correlation |

### How to read the two sets together

AI Overviews already appear on about 36% of informational queries in Seer's data, so their effect is broad today. Google AI Mode has a larger effect on each search it handles, but it handles few searches so far. Both trends point the same way. The mistake is multiplying one surface's click loss by the other surface's reach.

## The AI Mode Exposure Model: Estimate Your Own Risk

You can't see Google AI Mode traffic on its own in any Google report. You can still estimate how much of your Google traffic is exposed, with three inputs:

**Clicks at risk = Google organic clicks × share of those searches made in AI Mode × click loss per AI Mode search**

1. **Google organic clicks.** Take a month of clicks from the Search Console Performance report, split by query type.
2. **AI Mode share.** The market-wide figure is 0.34% (US browsers, early 2026). Your share is likely higher on queries that match what Google says AI Mode is for: "further exploration, reasoning, or complex comparisons." Treat your own share as a scenario, not a fact.
3. **Click loss per AI Mode search.** At baseline, the experiment's participants averaged 9.2 searches and 4.1 clicks a day, roughly 45 clicks per 100 searches. An 18.8-point drop is about 42% of that. This is our rough arithmetic on the paper's averages, not a figure the authors report.

### A worked example with Tallyfold

Tallyfold, the same fictional brand, gets 30,000 Google clicks a month. We split them into three groups and assign each an assumed AI Mode share for a heavier-adoption scenario. The shares are illustrative assumptions.

| Query group                                         | Monthly clicks | Assumed AI Mode share | Loss per AI Mode search | Clicks at risk |
| --------------------------------------------------- | -------------- | --------------------- | ----------------------- | -------------- |
| Branded ("tallyfold login")                         | 11,000         | 1%                    | 42%                     | 46             |
| How-to ("how to invoice a retainer")                | 13,000         | 8%                    | 42%                     | 437            |
| Comparison ("best invoicing software for agencies") | 6,000          | 20%                   | 42%                     | 504            |
| **Total**                                           | **30,000**     |                       |                         | **987 (3.3%)** |

At today's market-wide share, the math is much smaller: 30,000 × 0.34% × 42% = about 43 clicks a month, or 0.14% of Tallyfold's Google traffic. If AI Mode use doubled from the scenario above, the risk would double too, to about 1,970 clicks, or 6.6%.

The model tells Tallyfold where to focus. The comparison group holds only a fifth of its clicks but more than half of its exposure. Those are the queries where AI Mode answers first and a citation matters most. Branded traffic barely moves, because people who type a brand name usually want the site itself.

Two cautions. The 42% loss comes from forced adoption over one week, and people who choose AI Mode may click more or less. And clicks at risk aren't clicks lost for good, because a brand named in an answer can still win a later branded search.

## How to Optimize for Google AI Mode Without Chasing Fan-Out Queries

Start with Google's own rules, because they rule out a lot of paid advice. Google says a page is eligible for Google AI Mode if it is indexed and able to show a snippet, with "no additional technical requirements." It says you don't need AI text files, special markup or chunked content. It also says, in its [generative AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), that "optimizing for generative AI search is optimizing for the search experience, and thus still SEO."

It also draws a firm line. Writing separate pages for "other queries that people have asked, or fan-out queries," mainly to sway AI answers, "violates Google's [scaled content abuse](/glossary/scaled-content-abuse) spam policy." So the goal is coverage of real questions on pages that deserve to exist, not a page per sub-query.

1. **Confirm eligibility.** Check that key pages are indexed, not held back by `nosnippet`, and that Search Console's [Search generative AI control](https://support.google.com/webmasters/answer/16908024?hl=en) is set to Include. Our [technical guide to AI Overviews and AI Mode](/ai-seo/google-ai-overviews) covers each control.
2. **Map the turns, not the keyword.** For each buyer question, list the three or four follow-ups that usually come next, as in the Turn Map. Our free [AI question generator](/tools/ai-question-generator) helps with the list.
3. **Give each turn one strong page.** Pricing, comparisons, integrations and migration guides are the pages buyers check before they decide. Merge thin variants instead of adding more.
4. **Add what a model can't make up.** Google's example of "non-commodity" content is a first-hand story with real numbers, not "7 Tips for First-Time Homebuyers." Dated prices, screenshots, test results and named sources give AI Mode a reason to link you.
5. **Keep product and local data current.** Google's AI features documentation tells site owners to keep Merchant Center and Business Profile information up to date. AI Mode now [checks local prices](https://support.google.com/websearch/answer/17104441?hl=en) and can call businesses for you, so those listings feed answers directly. See our guide to [optimizing a business for AI search](/blog/optimize-business-for-ai-search).
6. **Make the click worth it.** Since the summary comes first, the visit is for depth, proof or action. Lead with the answer, then give the calculator, the full table or the next step. Our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search) covers the passage-level writing.

## How to Measure Google AI Mode Traffic

No report isolates AI Mode, so you piece it together.

### What Search Console shows

The [Generative AI performance report](https://support.google.com/webmasters/answer/16984139?hl=en), live for all sites since 31 August 2026, counts impressions in AI Overviews and AI Mode by page, country, device and date. It shows no clicks, and it has no filter that separates the two surfaces. Clicks from AI Mode sit inside the main Performance report under the Web search type, blended with classic results. Search Labs experiments aren't counted at all.

### What GA4 shows

Google's [default channel rules](https://support.google.com/analytics/answer/9756891?hl=en) put visits from AI Overviews and AI Mode in Organic Search, not the AI Assistant channel. So AI Mode visits look like ordinary Google visits. Our guide to [AI referral traffic in GA4](/blog/how-to-measure-ai-referral-traffic-in-ga4) covers the channels that do separate out.

### Signals worth watching

- **Impressions rise while clicks stay flat** on pages that answer comparison or planning questions.
- **Long, question-shaped queries** grow in your Performance report, since each AI Mode turn is logged as a query.
- **Your conversation panel changes.** Run your buyer questions in AI Mode with two or three follow-ups each month, and note where Tallyfold-style pages enter or drop out. Our guide to [measuring GEO](/blog/how-to-measure-geo) explains sample sizes and control tests.

None of these proves AI Mode caused a change on its own. Together, they tell you whether the exposure model's scenario is coming true for your site.

## Where Rankbox Fits in an AI Mode Plan

Rankbox helps with the content side of this work. Its [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google and scores them for volume, difficulty and intent, which gives you raw material for a Turn Map. The volumes are model estimates, not measured counts. The [Citation-Ready Writer](/features/citation-ready-writer) then researches the live web and writes 2,000 to 3,500-word, source-backed articles for the turns you don't cover yet. Articles reach your site through Rankbox's API.

Rankbox doesn't track Google AI Mode citations or report its traffic today, so pair it with Search Console and a monthly conversation panel. The Business plan is $49.50 a month with a 7-day trial. [See plans and pricing](/pricing).

## Frequently Asked Questions

### What is Google AI Mode?

Google AI Mode is a conversational search mode in Google Search. It breaks your question into subtopics, searches for each at the same time, and writes one answer with links you can follow or question further. Our [full explainer](/blog/what-is-google-ai-mode) covers how it works.

### Is Google AI Mode the same as AI Overviews?

No. AI Overviews are short summaries at the top of some results pages. Google AI Mode is a separate conversational mode with longer answers and built-in follow-ups. They share eligibility rules and a Search Console report, but Google says they may use different models, and Ahrefs found only 13.7% overlap in the URLs they cite.

### Does Google AI Mode reduce website traffic?

Per search, yes. In a 1,100-person experiment, forcing searches into AI Mode cut click-through to websites by 18.8 percentage points. But only 0.34% of US browser searches reached AI Mode in early 2026, so the total effect on most sites is likely small for now. Google said in August 2025 that overall organic clicks had been relatively stable.

### How many searches does Google AI Mode run for one question?

Google doesn't give a fixed number. It says AI Mode issues "a multitude of queries simultaneously" across subtopics, and that Deep Search "can issue hundreds of searches." The one example in Google's documentation lists three sub-queries.

### Can I see Google AI Mode traffic in Search Console?

Partly. The Generative AI performance report shows impressions from AI Overviews and AI Mode combined, with no clicks. AI Mode clicks are counted in the main Performance report, blended with classic results. Each follow-up question counts as a new query.

### How do you optimize content for query fan-out?

List the narrower questions a buyer's main question leads to, then make sure a strong, existing page answers each one in its first lines. Google warns against creating a page for every fan-out variant, which it treats as scaled content abuse.

## References

1. [AI in Search Reduces Publisher Referrals Without Improving User Experience: Experimental Evidence (Wang et al., arXiv, August 2026)](https://arxiv.org/abs/2608.18352)
2. [A new era for AI Search (Google I/O 2026), Google](https://blog.google/products-and-platforms/products/search/search-io-2026/)
3. [In 2026, less than one third of Google searches still send a click, SparkToro](https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/)
4. [Get AI-powered responses with AI Mode in Google Search, Google Search Help](https://support.google.com/websearch/answer/16011537?hl=en)
5. [Expanding AI Overviews and introducing AI Mode, Google](https://blog.google/products/search/ai-mode-search/)
6. [AI Mode in Google Search: updates from Google I/O 2025, Google](https://blog.google/products-and-platforms/products/search/google-search-ai-mode-update/)
7. [How AI Mode is changing and expanding the way people search, Google](https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/)
8. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
9. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
10. [How impressions, position and clicks are counted, Search Console Help](https://support.google.com/webmasters/answer/7042828?hl=en)
11. [Generative AI performance report (Search), Search Console Help](https://support.google.com/webmasters/answer/16984139?hl=en)
12. [Search generative AI control, Search Console Help](https://support.google.com/webmasters/answer/16908024?hl=en)
13. [Update: AI Overviews reduce clicks by 58%, Ahrefs](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/)
14. [Google brings Gemini 3 to Search and AI Mode, Google](https://blog.google/products-and-platforms/products/search/gemini-3-search-ai-mode/)
15. [AIO impact on Google CTR: 2026 update, Seer Interactive](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update)
16. [New ways to explore the web in AI Mode and AI Overviews, Google](https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/)
17. [AI in Search is driving more queries and higher quality clicks, Google](https://blog.google/products-and-platforms/products/search/ai-search-driving-more-queries-higher-quality-clicks/)
18. [Google AI Mode's early adoption and SEO impact, Semrush](https://www.semrush.com/blog/google-ai-mode-seo-impact/)
19. [Are AI Mode and AI Overviews just different versions of the same answer?, Ahrefs](https://ahrefs.com/blog/ai-overviews-vs-ai-mode/)
20. [Google users are less likely to click on links when an AI summary appears, Pew Research Center](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)
