---
title: AI SEO Checklist for Old Posts: 15 Checks Before You Refresh
description: An AI SEO checklist for old posts: 15 checks to pick what to refresh, fix facts and dates, add direct answers and sources, reopen crawl access and re-index.
keyword: AI SEO checklist
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, Playbooks
---

Before you refresh an old post for AI search, run 15 checks in order: confirm the post is worth the work, correct its facts and dates, rewrite its answers and sources, make sure AI search crawlers can still reach it, then get it re-crawled and record a baseline. This AI SEO checklist is built for posts that are already live, where the risks are stale numbers, rules that changed around the page, and edits no crawler ever sees.

New drafts need a different pass. For those, use our [30-minute pre-publish AI SEO checklist](/blog/ai-seo-checklist-pre-publish-audit), which checks a new article before its first crawl. This post covers what changes once a page has a history: traffic to protect, a URL with links pointing at it, and facts that were true when you wrote them. For the whole site at once, run an [AEO audit](/blog/aeo-audit) instead.

Old posts are worth the effort. In [Ahrefs' study of about 17 million AI citations](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content), the average page cited by AI assistants was 2.9 years old, yet a full year younger than the average page in Google's organic results. Old pages still get quoted, and an old post with current facts is exactly what these engines like to cite.

## Key Takeaways

- Run this AI SEO checklist in five groups: choose, facts and dates, answers and sources, crawl access, and re-index.
- Checks 1 to 3 decide whether to refresh at all. A post with no demand should be merged or retired, not refreshed.
- Change the visible date and `dateModified` only when the content substantially changed. Google lists fake freshness as a warning sign.
- Re-test crawl access on every refresh. Robots.txt files, firewall rules and CDN bot settings change after a post goes live, and any of them can shut out AI search crawlers.
- Tell crawlers about the change: update the sitemap `lastmod`, send an IndexNow ping for Bing, and request indexing in Search Console once.
- Save a baseline before the refresh goes live, and compare four to six weeks later.

## The Refresh 15: An AI SEO Checklist at a Glance

The Refresh 15 is this AI SEO checklist in one table. Each check has a pass test you can answer yes or no. Work top to bottom, because the early checks can save you from doing the later ones.

| #   | Check                                                                     | Pass test                                                                                |
| --- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | The post still has demand.                                                | It earned Google impressions in the last three months, or it matches a prompt you track. |
| 2   | There's a clear reason to refresh it.                                     | You can name it in one line: a changed fact, falling clicks, or a wrong AI answer.       |
| 3   | It's the only page answering its question.                                | One URL per question. A duplicate gets merged and redirected.                            |
| 4   | Every number, price, name and rule matches its source today.              | Each one is re-opened, confirmed and dated.                                              |
| 5   | The title doesn't promise a year the body doesn't deliver.                | A year appears only if the content is current for it.                                    |
| 6   | Dead links, retired features and old screenshots are gone.                | No broken links, and every screenshot shows today's product.                             |
| 7   | The visible date and `dateModified` move together, for real changes only. | Both show the same date, and the edit was substantial.                                   |
| 8   | The opening answers the question people ask now.                          | The first sentence answers the page's top query.                                         |
| 9   | New sub-questions get their own answer.                                   | Each top question query has a heading and a direct answer.                               |
| 10  | Every statistic links to a live primary source.                           | No dead sources, and no stat replaced by a newer edition.                                |
| 11  | Search crawlers can still reach the path.                                 | A robots.txt tester and your CDN settings show them allowed.                             |
| 12  | The content is still in the server's HTML.                                | The raw HTML contains the opening, a table cell and an FAQ answer.                       |
| 13  | Newer posts link to it, and it links to them.                             | At least two links in and two links out.                                                 |
| 14  | Crawlers are told the page changed.                                       | Sitemap `lastmod` updated, IndexNow sent, indexing requested once.                       |
| 15  | A baseline and a re-check date are saved.                                 | Before-numbers logged, with a date four to six weeks out.                                |

## Checks 1–3: Choose the Posts Worth Refreshing

The first three checks of the AI SEO checklist answer the question most refresh guides skip: should this post be refreshed, merged, or left alone?

### Check 1: Demand

In Search Console's Performance report, group by page and look at the last three months. A post with impressions has demand. The [Generative AI performance report](https://support.google.com/webmasters/answer/16984139) adds how often your pages appeared in Google's AI features. A post that matches a buyer prompt you track counts too; our guide to [measuring GEO](/blog/how-to-measure-geo) shows how to build that prompt panel.

### Check 2: A reason

A refresh needs a reason you can write down. Three cover most cases:

1. **A fact changed.** A price, a law, a product name or a statistic has moved on.
2. **Clicks fell.** Use the report's [Compare](https://support.google.com/webmasters/answer/17011165) option to set the last three months against the same months a year earlier. Google suggests weekly or monthly granularity, so the day of the week doesn't skew it.
3. **An AI answer quotes it wrong.** If ChatGPT or Perplexity repeats an old claim from your post, that post jumps the queue. Our guide to [fixing incorrect brand facts in AI answers](/blog/fix-incorrect-brand-facts-in-ai-answers) traces a wrong answer back to its page.

Slow traffic loss is called [content decay](/glossary/content-decay), and the Compare view is the easiest way to spot it.

### Check 3: One page per question

Two posts that answer the same question split your signals. Merge them into the stronger one and redirect the weaker URL. Google says a [permanent redirect](https://developers.google.com/search/docs/crawling-indexing/301-redirects) tells its indexing pipeline that the target should be canonical.

Checks 1 to 3 point to one of five outcomes:

| Demand? | Reason?                                    | Duplicate? | What to do                                                     |
| ------- | ------------------------------------------ | ---------- | -------------------------------------------------------------- |
| Yes     | Yes                                        | No         | Refresh: run checks 4 to 15.                                   |
| Yes     | Yes                                        | Yes        | Merge into the stronger URL, redirect the other, then refresh. |
| Yes     | Yes, and most sections fail checks 4 to 10 | No         | Rewrite at the same URL.                                       |
| Yes     | No                                         | No         | Leave it. Look again next quarter.                             |
| No      | Any                                        | Any        | Merge it into a related post, or retire it.                    |

With dozens of candidates, rank them before you run the AI SEO checklist on any one post. Our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search) has a refresh priority score for that.

## Checks 4–10: Fix the Facts, Answers and Sources

This is the part of the AI SEO checklist that changes the page itself, and where most of your time goes.

### Facts and dates (checks 4 to 7)

**Check 4** is the slowest and matters most. Open every source the post links to, confirm each figure still says the same thing, and date anything that can change: "as of September 2026." Google's quality questions ask whether content has ["easily-verified factual errors."](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

**Check 5** catches a common shortcut. Changing "2024" to "2026" in a title without updating the body promises something the page doesn't deliver. Change the year only when the content earns it. Leave the URL alone, even if it has a year in it. A new URL needs a redirect, and the old address is the one with the links and history.

**Check 6** covers what ages fastest: broken links, retired features and screenshots of an old interface. Each one signals a page nobody has looked at in a while.

**Check 7** is about honesty. Google's [guidance on dates](https://developers.google.com/search/docs/appearance/publication-dates) asks for a visible "Last updated" date plus `dateModified` in your Article markup. Google's helpful content guide warns against "changing the date of pages to make them seem fresh when the content has not substantially changed." A typo fix isn't a refresh.

### Answers (checks 8 and 9)

**Check 8** starts in Search Console. Click the post in the Pages view, then open the Queries tab to see what people search when they find it. Rewrite the first sentence so it answers the top query directly, with its key number or condition.

**Check 9** uses the same list. Question queries the post shows up for, but never answers, are free topics. Give each one a heading phrased the way people ask it, and answer it in the first sentence below. Microsoft's guide to [inclusion in AI search answers](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers) asks for the same thing: headings that reflect real questions, and claims anchored "in measurable facts."

### Sources (check 10)

Studies get new editions, vendor pages move, and blogs vanish. Check that every statistic links to a live primary source that still says the same thing, and use the newest edition of any study. It's worth the effort: in the [GEO study](https://arxiv.org/abs/2311.09735), adding citations, quotations and statistics raised a page's visibility in AI answers by 30% to 40%.

## Checks 11–15: Reopen the Door and Re-Index

A refresh can be perfect and still invisible. The last five checks of the AI SEO checklist make sure crawlers can reach the new version, and know it's there.

### Crawl access (checks 11 to 13)

**Check 11.** Rules written after a post went live can block it: a "block all AI bots" list, a firewall rule for scrapers, or a CDN bot setting. Cloudflare, for one, now [sorts AI bots](https://blog.cloudflare.com/content-independence-day-ai-options/) into Search, Agent and Training groups that are allowed or blocked separately. Paste your live robots.txt and the post's path into our [robots.txt Tester](/tools/robots-txt-tester), and confirm Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and PerplexityBot are allowed. OpenAI says a site that blocks OAI-SearchBot [won't be shown in ChatGPT search answers](https://developers.openai.com/api/docs/bots) except as a navigational link. Our [Cloudflare challenge trap](/blog/cloudflare-challenge-trap) guide shows where a blocked bot appears.

**Check 12.** Theme updates, CMS moves and new plugins can push content into JavaScript unnoticed. In a December 2024 analysis, Vercel found that [none of the major AI crawlers render JavaScript](https://vercel.com/blog/the-rise-of-the-ai-crawler). Fetch the raw HTML and search it for a phrase from the new opening:

```bash
curl -s https://example.com/blog/old-post | grep -c "a phrase from your new opening"
```

A count of 0 means those crawlers won't see the refresh. Repeat with a table cell and an FAQ answer, or run our [AI Search Readiness Check](/tools/ai-search-readiness-check) for an outside view.

**Check 13.** An old post often has no links from anything written since. Link to it from two newer related posts, and link out from it to them. Google's [AI features guide](https://developers.google.com/search/docs/appearance/ai-features) lists content "easily findable through internal links" among its best practices.

### Re-index and baseline (checks 14 and 15)

**Check 14.** Tell each engine about the change the way it listens:

1. **Sitemap.** Update the post's `lastmod`. Google [uses lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) only when it's "consistently and verifiably" accurate, and a new copyright line doesn't count.
2. **IndexNow.** Send one ping. The [IndexNow FAQ](https://www.indexnow.org/faq) says a submission is shared with every participating engine. Bing takes part. Google doesn't. See our [IndexNow glossary entry](/glossary/indexnow).
3. **Search Console.** Request indexing once in URL Inspection. Google says [repeat requests](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) won't speed things up, and crawling "can take anywhere from a few days to a few weeks."

**Check 15.** Before the refresh goes live, log the post's clicks and impressions for the last four weeks, its AI impressions, and whether it appears for a few prompts you track. Set a re-check date four to six weeks out. Without a baseline, you can't tell a refresh that worked from a quiet month.

## Worked Example: A 2024 Tallyfold Post, Refreshed

Tallyfold is a fictional invoicing app for agencies, and every number here is made up. Its post "How to Set Payment Terms for Agency Clients (2024 Guide)" went live in March 2024. Over the last three months it had 4,200 impressions, but clicks fell 38% against the same months a year earlier. Tallyfold's editor ran the AI SEO checklist on it. Checks 1 to 3 passed: demand, a reason and no duplicate, so it was a refresh.

| Check                            | Before | What the team did                                                                               |
| -------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| 4. Facts match sources           | Miss   | Tallyfold's own plan price was out of date. Corrected it and added "as of September 2026".      |
| 5. Year in title                 | Miss   | Retitled it as a 2026 guide only after the body was current.                                    |
| 6. Dead links and screenshots    | Miss   | Replaced two broken links and three screenshots of a retired dashboard.                         |
| 7. Honest dates                  | Pass   | The old dates were accurate. Both were updated together after the rewrite.                      |
| 8. Opening answers today's query | Miss   | The top query was "net 30 vs net 15". The new first sentence answers it.                        |
| 9. New sub-questions answered    | Miss   | Added headings for "Can you charge a late fee?" and "What should a payment terms clause say?"   |
| 10. Live primary sources         | Miss   | One survey link was dead. Cut the figure, since no live source had it.                          |
| 11. Crawlers allowed             | Miss   | A 2025 scraper rule was challenging OAI-SearchBot. Added an exception for verified search bots. |
| 12. Content in the HTML          | Pass   | The raw HTML held the opening, the table and the FAQ.                                           |
| 13. Internal links               | Miss   | Linked it from two 2026 posts, and linked out to both.                                          |
| 14. Re-index                     | To do  | Updated `lastmod`, sent IndexNow, requested indexing once.                                      |
| 15. Baseline                     | To do  | Logged four weeks of numbers, with a re-check on 10 November.                                   |

Of checks 4 to 13, the post passed 2 of 10 before and all 10 after, and checks 14 and 15 closed the job. It took about half a day. The check that mattered most is one many refresh guides leave out: a firewall rule written a year after the post went live was stopping OpenAI's search crawler from reaching it, however good the rewrite was. The AI SEO checklist caught it because it re-tests access on every refresh.

When checks 1 to 3 say rewrite instead, Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) can draft the new version: it researches the live web and writes 2,000–3,500-word articles with their sources. You'd still run this AI SEO checklist on the draft, keep the old URL and add your own figures. Rankbox doesn't audit existing posts, manage robots.txt or track AI citations today. Plans are on the [pricing page](/pricing).

## Frequently Asked Questions

### How often should you refresh old posts for AI search?

Review your top posts each quarter, and refresh a post as soon as a fact in it changes. No fixed schedule is rewarded, and a refresh only helps when the content improves. Checks 1 to 3 of the AI SEO checklist tell you which posts need it.

### Does changing the date on a post help with AI search?

Not on its own. Google warns against changing dates to make pages seem fresh when the content hasn't substantially changed. Update the visible date and `dateModified` together, and only after a real edit: new facts, new answers or new sources.

### Should you change the URL when you refresh a post?

No. Keep the URL, even if it contains an old year, because it carries the page's links and history. Change a URL only when you merge two posts, and then add a permanent redirect from the old address to the one you keep.

### How long does a refreshed post take to show up in AI answers?

It varies. Google says crawling can take a few days to a few weeks. OpenAI says robots.txt changes reach its systems in about 24 hours, but a changed page still has to be re-crawled and weighed against other sources. Compare with your baseline after four to six weeks.

### How is this AI SEO checklist different from a pre-publish one?

This AI SEO checklist handles what only an old post has: traffic to protect, aged facts, dead sources, and rules written after it went live. A pre-publish checklist, like our [30-minute pre-publish audit](/blog/ai-seo-checklist-pre-publish-audit), checks a new draft before its first crawl. Use the refresh checklist on live posts and the pre-publish one on new drafts.

## References

1. [New study: AI assistants prefer to cite "fresher" content, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content)
2. [Generative AI performance report (Search), Search Console Help](https://support.google.com/webmasters/answer/16984139)
3. [Performance report: advanced filtering and comparison, Search Console Help](https://support.google.com/webmasters/answer/17011165)
4. [Creating helpful, reliable, people-first content, Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
5. [Add a byline date to Google Search results, Google Search Central](https://developers.google.com/search/docs/appearance/publication-dates)
6. [Optimizing your content for inclusion in AI search answers, Microsoft Advertising](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)
7. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
8. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
9. [Ask Google to recrawl your website, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
10. [IndexNow FAQ, IndexNow](https://www.indexnow.org/faq)
