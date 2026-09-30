---
title: ChatGPT Ranking Factors: What OpenAI Documents and What the Data Shows
description: ChatGPT ranking factors, sorted by proof: what OpenAI documents about finding and ranking sources, what studies link to citations, and a 10-minute check.
keyword: ChatGPT ranking factors
date: 2026-10-16
updated: 2026-10-16
written: 2026-09-29
author: Rankbox Team
tags: AI Search, ChatGPT
---

OpenAI documents very few ChatGPT ranking factors. It says its search crawler, OAI-SearchBot, must be able to reach your site, and that ChatGPT then ranks results "using multiple factors" it doesn't list. Independent studies fill some of the gap: they link ChatGPT citations to brand mentions across the web, answers placed early on the page, recent updates and titles that match ChatGPT's own searches.

Those studies show patterns, not rules. Each one used a different sample, a different month and often a different ChatGPT model. So the useful question isn't "what are the secret ChatGPT ranking factors?" It's "which claims have proof, and what does that proof cover?"

This post is the short, evidence-first answer. For all seven factors people quote, each graded with a scoring sheet, read our [full breakdown of the seven ChatGPT ranking factors](/blog/chatgpt-ranking-factors-ai-search-placement). Here you'll find what OpenAI says, what the data shows, and a 10-minute check to run on your own site.

## Key Takeaways

- OpenAI's only stated requirement for web pages is access: allow OAI-SearchBot and OpenAI's published IP ranges, and robots.txt changes take about 24 hours to apply.
- ChatGPT rewrites a question into targeted searches and sends them to providers, naming Microsoft and Shopify. Memory and approximate location can shape those searches.
- The strongest correlations for ChatGPT so far: branded web mentions (0.664 across 75,000 brands) and answers near the top of the page (44.2% of 18,012 citations came from the first 30%).
- Studies disagree or go stale fast. Reddit's share of ChatGPT citations dropped from 3.8% to 0.5% in mid-August 2026.
- Schema, page speed and tone have no solid ChatGPT-specific proof. Treat them as hygiene, not levers.
- The 10-Minute ChatGPT Source Check tests access, raw HTML, the opening answer, titles, freshness and third-party mentions.

## What OpenAI Says About Finding, Ranking and Showing Sources

OpenAI doesn't publish a list of ChatGPT ranking factors. It spreads its guidance across a help article, a crawler page and a publisher FAQ. Put together, they cover three stages.

### How ChatGPT finds pages

ChatGPT "may search the web automatically when your question would benefit from current information," according to OpenAI's [search help article](https://help.openai.com/en/articles/9237897-chatgpt-search). It "typically rewrites your query into one or more targeted queries" and can follow up with narrower ones. Those queries go to outside search providers. The article links two providers' privacy policies: Microsoft's and Shopify's.

OpenAI also crawls the web itself. Its [crawler page](https://developers.openai.com/api/docs/bots) says OAI-SearchBot "is used to surface websites in search results in ChatGPT's search features." Sites that block it "will not be shown in ChatGPT search answers, though can still appear as navigational links." GPTBot, which gathers training data, is a separate choice. Blocking it doesn't remove you from search. Our [OAI-SearchBot explainer](/blog/what-is-oai-searchbot) covers the bot in detail.

### How ChatGPT ranks what it finds

Here OpenAI says the least about ChatGPT ranking factors. ChatGPT "ranks search results using multiple factors intended to help users find relevant, reliable information," and "placement is not guaranteed." That's the whole statement for web pages.

Three nearby facts are documented:

1. **Personal context shapes the search.** With memory on, ChatGPT "may use relevant saved memories when rewriting a search query." It may also use a rough location from your IP address.
2. **Ads sit outside the ranking.** OpenAI's [ads help page](https://help.openai.com/en/articles/20001047-ads-in-chatgpt) says advertisers "have no ability to shape, rank, or alter ChatGPT's responses."
3. **Shopping has its own list.** On the [shopping help page](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search), merchants are "ranked based on factors like availability, price, quality, and whether they are the maker or primary seller." That's the only published ranking list, and it covers products only.

### How ChatGPT shows sources

Answers that used search "may include citations," which open the source when clicked. A Sources button shows "cited sources and other relevant links," so the panel can hold more than the pages quoted in the text. The [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) adds that ChatGPT puts `utm_source=chatgpt.com` on referral links, so clicks show up in analytics.

For how those pieces turn into an answer, see our walkthrough of [how ChatGPT search decides citations](/blog/how-chatgpt-search-decides-citations).

## What the Data Links to ChatGPT Citations

Outside researchers can't see ChatGPT ranking factors directly, so they compare cited pages with pages that weren't cited. Every row below is a correlation, not proof of cause, and each is dated because ChatGPT keeps changing.

| Study                                                                                                                    | Sample                                                         | Finding                                                                                  | Watch out for                        |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------ |
| [Ahrefs, December 2025](https://ahrefs.com/blog/ai-brand-visibility-correlations/)                                       | 75,000 brands                                                  | Branded web mentions correlate 0.664 with ChatGPT visibility; Domain Rating, 0.266       | Famous brands score high on both     |
| [Growth Memo via Search Engine Land, February 2026](https://searchengineland.com/chatgpt-citations-content-study-469483) | 18,012 citations traced to source sentences, from 1.2M answers | 44.2% of citations come from the first 30% of a page                                     | One team's matching method           |
| [Ahrefs, April 2026](https://ahrefs.com/blog/why-chatgpt-cites-pages/)                                                   | 1.4M prompts                                                   | About half of retrieved URLs get cited; cited titles sit closer to ChatGPT's sub-queries | Similarity measured with open models |
| [Ahrefs, July 2025](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)                              | About 17M citations                                            | ChatGPT's citations are 458 days newer than Google's organic results                     | Collected before 2026 changes        |
| [SE Ranking, November 2025](https://seranking.com/blog/how-to-optimize-for-chatgpt/)                                     | 216,524 pages, 20 niches                                       | Pages updated in the last 3 months average 6.0 citations vs 3.6                          | Many factors tested at once          |
| [Nectiv, August 2026](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)                         | About 4,000 prompts                                            | 7.61 searches per prompt; 64% use `site:`                                                | Counts searches, not citations       |
| [Promptwatch via Semrush, August 2026](https://www.semrush.com/blog/reddits-citations-in-chatgpt-fall/)                  | Citation share tracking                                        | Reddit fell from 3.8% to 0.5% of ChatGPT citations                                       | Promptwatch calls it provisional     |

### Where the studies agree

Three findings line up across publishers. Brands the wider web talks about get named more. Passages that answer early and plainly get quoted more. And recent, maintained pages beat stale ones on average. The August 2026 fan-out data adds a fourth point: ChatGPT now runs many narrow searches, often aimed at one site, so a clear page on your own domain for each buyer fact has more chances to match.

### Where they disagree or age badly

Freshness has a wrinkle. Ahrefs' 2025 study found ChatGPT favors newer pages overall, but its 2026 study found that, within a single prompt's results, older and established pages were often the ones cited. Reddit is the clearest case of data going stale: a source that was among the most cited in July 2026 dropped sharply in August.

### What nobody has shown

No public study shows that three popular ChatGPT ranking factors, schema markup, HTTPS response speed and a "neutral tone," lift citations for ordinary pages. SE Ranking even found pages with FAQ schema averaged slightly fewer citations, 3.6 against 4.2. The full grades for those claims are in our [seven-factor breakdown](/blog/chatgpt-ranking-factors-ai-search-placement).

## The 10-Minute ChatGPT Source Check

This check covers the ChatGPT ranking factors that are documented or well supported, in the order problems usually block you. Pick one page that should win a buyer question, such as your pricing or comparison page. You need a terminal, a browser and ChatGPT with search.

| Step                      | Time  | What to do                                                                                        | A pass looks like                                     |
| ------------------------- | ----- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1. Robots.txt             | 1 min | Open `yoursite.com/robots.txt` and look for a `Disallow` under `OAI-SearchBot` or `User-agent: *` | No rule blocks OAI-SearchBot from the page            |
| 2. Fetch as OAI-SearchBot | 2 min | Run the command below                                                                             | A 200 status, and your key sentence found in the HTML |
| 3. First 100 words        | 2 min | Read only the top of the page                                                                     | A specific answer: a price, a limit or a date         |
| 4. Titles                 | 2 min | Ask ChatGPT the buyer question with search on, then compare the cited titles with yours           | Your title names the exact thing asked, not a slogan  |
| 5. Freshness              | 1 min | Check the "updated" date and the facts on the page                                                | The date is real and the facts match today's product  |
| 6. Mentions               | 2 min | List the third-party pages cited in that answer                                                   | You're named on at least one of them                  |

Our [robots.txt tester](/tools/robots-txt-tester) handles step 1 for any bot. Steps 4 and 6 use the same ChatGPT answer, so run them together.

### The fetch command for step 2

This requests the page with OpenAI's documented user agent, saves the HTML, and prints the status code and time to first byte. The second line counts how often a sentence you want quoted appears.

```bash
curl -s -o page.html -w "%{http_code} %{time_starttransfer}s\n" \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot" \
  https://yoursite.example/pricing
grep -c "Plans start at" page.html
```

A 403, a challenge page or a count of 0 is a fail. This only tests rules keyed to the user agent. Firewalls that check IP addresses also need OpenAI's [published ranges](https://openai.com/searchbot.json) allowed.

### A quick example

Tallyfold is a made-up invoicing and payments app for agencies. Its team runs the check on `tallyfold.example/pricing`. Step 1 passes. Step 2 returns a 200, but the grep count is 0: the price table loads through JavaScript, so a crawler that doesn't run scripts sees an empty table. That one failure explains more than any content tweak could. The fix is to server-render the prices, then rerun step 2 until the count is above 0.

Step 2 matters most because [Vercel's crawler study](https://vercel.com/blog/the-rise-of-the-ai-crawler) found that OpenAI's crawlers don't render JavaScript. If the answer isn't in the raw HTML, none of the other ChatGPT ranking factors get a chance.

## How to Act on Your Results

Fix failures in the order of the check. Access problems come first, because they zero out everything else. Then make sure the answer lives in the HTML and sits near the top. After that, work on titles and on the third-party pages ChatGPT already cites, which is where the brand-mention correlations point.

Two warnings keep this honest. First, a pass on all six steps doesn't guarantee a citation, since OpenAI says placement isn't guaranteed. Second, one ChatGPT answer is a sample of one. To see whether a fix worked, run a fixed set of buyer prompts several times before and after, as our guide to [measuring GEO](/blog/how-to-measure-geo) explains. For the crawler and fan-out details behind this check, our [ChatGPT SEO guide](/ai-seo/chatgpt) goes deeper.

Rankbox fits the content steps, 3 and 4. [Answer-Space Research](/features/answer-space-research) finds the questions buyers ask ChatGPT, and the [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles that open with the answer. Rankbox doesn't track AI citations or change your robots.txt. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)), and the free [AI search readiness check](/tools/ai-search-readiness-check) scans a URL for 12 AI-readiness signals.

## Frequently Asked Questions

### What ranking factors does ChatGPT use?

OpenAI names none for web pages beyond access: OAI-SearchBot must be allowed. It says ChatGPT ranks results with "multiple factors" aimed at relevant, reliable information. Studies link citations to brand mentions, early answers, freshness and titles that match ChatGPT's searches, but those are correlations, not confirmed ChatGPT ranking factors.

### Is Bing ranking one of the ChatGPT ranking factors?

Only indirectly. OpenAI names Microsoft as a search provider, so Bing's index can feed ChatGPT. But in Ahrefs' 2025 study of 15,000 prompts, just 8.1% of ChatGPT's in-text citations ranked in Bing's top 10 for the same prompt. Matching ChatGPT's narrower sub-searches matters too.

### Does blocking GPTBot hurt my ChatGPT search visibility?

No. OpenAI treats GPTBot, its training crawler, and OAI-SearchBot, its search crawler, as separate settings. You can block GPTBot and still appear in ChatGPT search, as long as OAI-SearchBot is allowed and your firewall lets its IP ranges through.

### Can you pay to rank higher in ChatGPT?

No. OpenAI says ads don't influence ChatGPT's answers and that advertisers can't shape or rank its responses. Ads appear separately and are labeled. Shopping results aren't ads either; they're picked from product data, with merchants ranked on availability, price, quality and whether they make or mainly sell the item.

### How often do ChatGPT ranking factors change?

Often enough that dated evidence matters. In August 2026, Nectiv measured ChatGPT running 7.61 searches per prompt, up from 2.17 a year earlier, and Reddit's citation share fell sharply the same month. Recheck your prompts monthly and trust recent studies over old ones.

### Does ChatGPT personalize which sources it cites?

It can. OpenAI says ChatGPT may use saved memories when it rewrites a search query and may use an approximate location from your IP address. To see what a new buyer sees, test in a logged-out window or with memory off.

## References

1. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
2. [Overview of OpenAI Crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
3. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
4. [Shopping with ChatGPT Search, OpenAI Help Center](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search)
5. [Ads in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)
6. [Top Brand Visibility Factors in ChatGPT, AI Mode, and AI Overviews, Ahrefs](https://ahrefs.com/blog/ai-brand-visibility-correlations/)
7. [Why ChatGPT Cites One Page Over Another, Ahrefs](https://ahrefs.com/blog/why-chatgpt-cites-pages/)
8. [Do AI Assistants Prefer to Cite "Fresh" Content?, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
9. [Only 12% of AI Cited URLs Rank in Google's Top 10 for the Original Prompt, Ahrefs](https://ahrefs.com/blog/ai-search-overlap/)
10. [44% of ChatGPT Citations Come From the First Third of Content: Study, Search Engine Land](https://searchengineland.com/chatgpt-citations-content-study-469483)
11. [How to Optimize for ChatGPT, SE Ranking](https://seranking.com/blog/how-to-optimize-for-chatgpt/)
12. [What We Learned From Analyzing 28K+ ChatGPT and Gemini Fan-Out Queries, Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)
13. [Reddit's Citations in ChatGPT Fall From 3.8% to 0.5%, Semrush](https://www.semrush.com/blog/reddits-citations-in-chatgpt-fall/)
14. [The Rise of the AI Crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
