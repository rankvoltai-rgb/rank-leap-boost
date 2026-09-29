---
title: How to Build an AI Search Content Refresh Calendar
description: Build a content refresh calendar for AI search: review intervals by page type, a free spreadsheet template, and a change log that readers and crawlers can see.
keyword: content refresh calendar
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, Playbooks
---

To build a content refresh calendar for AI search, list the pages that state facts a buyer might ask an AI assistant about, give each one a review interval based on how fast those facts change, and let a spreadsheet work out when each page is next due. A good starting point: pricing pages every 30 days, comparison pages every 60, integration docs and statistics posts every 90, and evergreen guides every 180. Pull a page forward when an event changes its facts. When a review changes the page, say so on the page, in its markup and on a sitewide change log.

A publishing calendar asks what to write next. A content refresh calendar asks which live pages are now wrong. For AI search, the second question often matters more. Assistants quote specific facts: a plan price, a feature a rival just added, a setup step, a statistic. If your page holds the old fact, the answer that quotes it is wrong too.

Recency plays a part as well. In [Ahrefs' July 2025 study](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) of about 17 million citations, AI assistants cited content that was 25.7% fresher than the pages in Google's organic results. [SE Ranking's study](https://seranking.com/blog/how-to-optimize-for-chatgpt/) of 129,000 domains found that pages updated in the past three months averaged 6.0 ChatGPT citations, against 3.6 for older ones. Both are correlations, not proof that an update causes a citation. Our guide to [the freshness factor in AI search](/blog/freshness-factor-ai-search) weighs that evidence in full.

This guide covers the schedule: intervals by page type, the events that override them, a free template, and a change log pattern that makes each update visible. For the steps of refreshing a single page, use our [AI SEO checklist for old posts](/blog/ai-seo-checklist).

## Key Takeaways

- A content refresh calendar schedules reviews of live pages by how fast their facts change, not by how many posts you want to ship.
- Start with default intervals: pricing pages 30 days, comparison pages 60, integration docs and statistics posts 90, evergreen guides 180. These are starting points to tune. No AI engine publishes a schedule.
- Events beat the clock. A price change, a rival's new plan or a partner's API release makes a page due that day.
- A review can end with no change. Record it in the calendar and leave the page's dates alone, because Google warns against re-dating pages that haven't substantially changed.
- When a page does change, show a "Last updated" date and a one-line "What changed" note, match them with `dateModified` in Article markup, and update the sitemap's `lastmod`.
- Keep the full history on a sitewide change log page. Google accepts an RSS or Atom feed as a sitemap, so the log's feed can point crawlers at recently changed URLs.
- Check the workload before you start a content refresh calendar: pages × (365 ÷ interval) gives reviews a year. In the fictional Tallyfold example, 123 pages come to 284 reviews, about two hours a week before any edits.

## Why a Publishing Calendar Misses What AI Answers Quote

Most content calendars plan output and count what ships. That does nothing for the pages you shipped last year, which are the ones AI engines already know.

A content refresh calendar plans upkeep instead. The unit isn't a new post. It's an existing URL with a due date.

|                     | Publishing calendar          | Content refresh calendar                        |
| ------------------- | ---------------------------- | ----------------------------------------------- |
| Unit of work        | A new post                   | An existing URL                                 |
| What triggers work  | An open slot on the calendar | A review date, or an event that changes a fact  |
| What "done" means   | The post is live             | Every fact on the page is checked and dated     |
| What it produces    | A new URL                    | The same URL, with a dated note of what changed |
| The risk it manages | Not enough content           | Wrong content still being quoted                |

Google is blunt about churn for its own sake. Its guide to [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) asks whether you add or remove lots of content "because you believe it will help your search rankings overall by somehow making your site seem 'fresh'", and answers: "No, it won't." A content refresh calendar isn't a way to look busy. It's a way to catch the pages that went wrong.

Google also runs ["query deserves freshness" systems](https://developers.google.com/search/docs/appearance/ranking-systems-guide) that show fresher content "for queries where it would be expected." And Google says its [generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) rely on its core ranking systems to retrieve "relevant, up-to-date web pages" for their answers. An accurate page serves both. Our glossary entry on [content freshness](/glossary/content-freshness) covers how each engine weighs recency.

## The Clock-and-Tripwire Model

The Clock-and-Tripwire model is how this content refresh calendar decides when a page is due. It has four parts.

1. **A clock.** Each page type gets a default review interval. The clock sets the next review date from the last one.
2. **Tripwires.** Named events that make a page due now, whatever the clock says.
3. **An outcome.** Every review ends in one of four results, and each result tells you which dates move.
4. **A tuning rule.** The outcomes of past reviews shorten or lengthen the clock.

The clock catches changes nobody announced, like a plan limit a billing team tweaked quietly. The tripwires catch the changes you can see coming. You need both, because neither catches everything.

### The four outcomes of a review

| Outcome           | What happened                                 | Page's visible date and `dateModified` | Calendar's "Last reviewed" | Change log entry              |
| ----------------- | --------------------------------------------- | -------------------------------------- | -------------------------- | ----------------------------- |
| Confirmed         | Every fact checked, nothing changed           | Stay the same                          | Moves to today             | No                            |
| Updated           | Some facts, sections or sources changed       | Move to today                          | Moves to today             | Yes                           |
| Rewritten         | Most of the page was replaced at the same URL | Move to today                          | Moves to today             | Yes, with a summary           |
| Merged or retired | The page was folded into another or removed   | Not applicable                         | Row removed                | Yes, with the redirect target |

Teams get the first row wrong most often. A review that finds nothing to fix is worth recording, but it isn't an update. Google's helpful content guide asks whether you are "changing the date of pages to make them seem fresh when the content has not substantially changed." So the calendar keeps two dates per page: when you last checked it, and when it last really changed. Only the second one appears on the page.

For how to add new facts to a section without rewriting it, see the fact patch method in our [freshness factor guide](/blog/freshness-factor-ai-search).

### Tune the clock with the halve-or-double rule

Default intervals are guesses until your own reviews correct them. Use the last two outcomes:

- **Two Updated or Rewritten outcomes in a row:** halve the interval, but not below 14 days. The page changes faster than you check it.
- **Two Confirmed outcomes in a row:** double the interval, but not above 365 days. You're checking a page that isn't moving.
- **Anything else:** keep the interval.

Within a year, the clocks on your content refresh calendar reflect how your pages actually change, not how an average site's might. To measure how often a page's facts changed last year before you pick its first interval, use the Change-Rate Test in our guide on [how often to update content for AI SEO](/blog/how-often-to-update-content-for-ai-seo).

## Refresh Intervals for Five Page Types

The table gives each page type on a content refresh calendar a default clock and its usual tripwires. The first five rows get a section each below; the last three round out a typical software site. These are Rankbox's starting defaults, not numbers any engine publishes.

| Page type                            | What goes stale                                | Default clock        | Typical tripwires                                                       |
| ------------------------------------ | ---------------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| Pricing page                         | Prices, plan limits, fees, trial terms         | 30 days              | Any price, plan or fee change                                           |
| Comparison or alternatives page      | Rivals' prices, plans and features             | 60 days              | A rival changes pricing or launches a plan; you ship a compared feature |
| Integration doc                      | Setup steps, screenshots, partner API versions | 90 days              | A partner ships a major API release or redesigns its settings           |
| Statistics post                      | Cited figures and study editions               | 90 days              | A source publishes a new edition, or a source link breaks               |
| Evergreen guide                      | Examples, tool names, links, rules             | 180 days             | A law, standard or platform rule it explains changes                    |
| Feature page                         | What the feature does, limits, screenshots     | 90 days              | A release that touches the feature                                      |
| Glossary term                        | Rarely anything                                | 365 days             | The term's meaning or common use shifts                                 |
| Dated post (news, recap, case study) | Nothing; it records a moment                   | 365 days, links only | Someone reports a factual error                                         |

One principle sets every clock: make it shorter than the usual gap between changes to that page's facts. Then a change waits at most one cycle before someone catches it.

### Pricing pages: every 30 days

Price is one of the most direct questions buyers put to AI, and one of the costliest facts to get wrong. Our post on [hallucination by omission](/blog/hallucination-by-omission-pricing-page) shows how a missing or stale price turns into a guessed one in AI answers. Google's [AI features guide](https://developers.google.com/search/docs/appearance/ai-features) also asks sites to check that "Merchant Center and Business Profile information is up-to-date."

Make every price change a tripwire, so the page changes the day the price does. The 30-day clock is the backstop for changes that slip through: a new fee, a trial rule, a plan limit. Each review checks every number against your billing system, not against last month's page.

### Comparison and alternatives pages: every 60 days

These pages describe other companies' products, and those companies don't tell you when they change. A rival can rename a plan or raise a price, and your page is wrong without you touching it.

Review against each rival's own pricing page and changelog, and date each fact: "as of September 2026." The tripwire is any rival launch you hear about. Our [comparison page formula](/blog/comparison-page-formula) covers how to keep these pages fair enough to be quoted.

### Integration docs: every 90 days

Integration docs break when a partner changes its API or its settings screens. Take Stripe. Its [versioning docs](https://docs.stripe.com/api/versioning) say it releases new API versions monthly "with no breaking changes," and twice a year issues a major release "that starts with an API version containing breaking changes."

So split the work. A 90-day clock folds in the small monthly changes, and a tripwire on each major release catches the ones that can break your steps. Check every screenshot against the live screen, since screenshots tend to age first.

### Statistics posts: every 90 days

A statistics post is only as current as its oldest figure. Two things go wrong: a study publishes a new edition, or a source page moves and your link dies. The 90-day review opens every source link and checks each figure. A new edition of any study you cite is the tripwire: replace the figure, date it in the sentence, and log the swap.

### Evergreen guides: every 180 days

Guides that explain how to do something stable don't need a monthly look. Google's freshness systems target queries where fresh content "would be expected," such as reviews of a film that just came out. A guide to writing a retainer agreement isn't one of those.

Old pages still get cited. In the same Ahrefs study, even ChatGPT's cited pages were 958 days old on average, counted from when Ahrefs' crawler first saw them. A 180-day clock catches dead links, renamed tools and changed rules without turning upkeep into a rewrite cycle.

## How to Set Up a Content Refresh Calendar in a Spreadsheet

You don't need a content platform to run a content refresh calendar. A spreadsheet with two formulas does the job, and our template below has them built in.

1. **Export your URLs** from your XML sitemap or CMS.
2. **Keep the pages worth checking:** those with checkable facts or demand, meaning clicks in Search Console, impressions in its [Generative AI performance report](https://support.google.com/webmasters/answer/16984139), or a prompt you track. Pages with no demand go to a merge-or-retire list.
3. **Tag each page with a type** from the interval table.
4. **Enter its interval** in days, taken from the Intervals sheet.
5. **Enter the last reviewed date.** If you don't know it, use the date the page last really changed.
6. **Write its tripwires** in plain words: "Brindlework pricing change," "Stripe major release."
7. **Name one owner** per page. A page owned by "the team" gets reviewed by no one.
8. **Each week, sort the content refresh calendar by next review date.** Work overdue pages first, then pages due in the next 14 days.

When too many pages are due at once, rank them with the refresh priority score in our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search).

### The two formulas

The content refresh calendar computes two columns. Everything else is typed in.

- **Next review** = last reviewed date + interval in days. In a sheet: `=IF(G2="","",G2+F2)`.
- **Status** = "Overdue" if the next review date has passed, "Due soon" if it falls in the next 14 days, "Scheduled" otherwise, and "Not reviewed" if there is no date yet.

Both use only IF, TODAY and simple date addition, so the file works the same in Google Sheets, Excel and Apple Numbers, which includes both functions in its [function list](https://www.apple.com/au/mac/numbers/compatibility/functions.html).

### Stagger the start dates

If every page gets today as its last reviewed date, every 90-day page comes due on one day three months from now. Spread the first dates across the interval instead: for 12 integration docs on a 90-day clock, start one about every week.

### Check the review load before you commit

A content refresh calendar that needs more hours than you have will be abandoned by spring. Work out the load before you set it up:

**Reviews a year = number of pages × (365 ÷ interval in days)**

Round to whole cycles: 12 a year for a 30-day clock, 6 for 60, 4 for 90, 2 for 180 and 1 for 365. Multiply by the minutes a review takes, then add time for the share of reviews that end in an update.

## Worked Example: Tallyfold's First Month on a Content Refresh Calendar

Tallyfold is a fictional invoicing and payments app for agencies. Brindlework and Kestrelyn are fictional rivals. Every page, date and number here is made up to show the method.

### The review load

Tallyfold's content lead listed 123 pages worth checking and applied the default clocks:

| Page type                      | Pages   | Clock    | Reviews a year |
| ------------------------------ | ------- | -------- | -------------- |
| Pricing                        | 1       | 30 days  | 12             |
| Comparison and alternatives    | 7       | 60 days  | 42             |
| Integration docs               | 12      | 90 days  | 48             |
| Statistics posts               | 5       | 90 days  | 20             |
| Feature pages                  | 8       | 90 days  | 32             |
| Evergreen guides               | 40      | 180 days | 80             |
| Glossary terms and dated posts | 50      | 365 days | 50             |
| **Total**                      | **123** |          | **284**        |

That's about 24 reviews a month. At 20 minutes each, 284 reviews take about 95 hours a year, just under two hours a week. If one review in four ends in an update that takes two hours, add 71 updates and 142 hours. The total is about 237 hours, or four and a half hours a week. Tallyfold had that time. A team without it should lengthen the clocks on its lowest-demand types first, and never on pricing or comparison pages.

### The first due list

On 29 September 2026, Tallyfold's content refresh calendar sorted these pages to the top. The full ten-row version is in the template.

| Page                                 | Type            | Clock    | Last reviewed | Next review | Status   |
| ------------------------------------ | --------------- | -------- | ------------- | ----------- | -------- |
| Tallyfold vs Brindlework             | Comparison      | 60 days  | 20 Jul 2026   | 18 Sep 2026 | Overdue  |
| Connect Stripe to Tallyfold          | Integration doc | 90 days  | 30 Jun 2026   | 28 Sep 2026 | Overdue  |
| Tallyfold pricing                    | Pricing         | 30 days  | 1 Sep 2026    | 1 Oct 2026  | Due soon |
| Best invoicing software for agencies | Comparison      | 60 days  | 4 Aug 2026    | 3 Oct 2026  | Due soon |
| Late payment statistics for agencies | Statistics post | 90 days  | 6 Jul 2026    | 4 Oct 2026  | Due soon |
| How to write a retainer agreement    | Evergreen guide | 180 days | 14 Apr 2026   | 11 Oct 2026 | Due soon |

### Two reviews, two outcomes

**Tallyfold vs Brindlework: Updated.** Brindlework had replaced its two plans with three. The team rebuilt the pricing rows from Brindlework's own pricing page and dated them. The page's "Last updated" date and `dateModified` moved to 29 September, and the change went into the log. The July review had also ended in an update, so the halve-or-double rule cut the clock from 60 days to 30. The next review is 29 October.

**Connect Stripe to Tallyfold: Confirmed.** The docs owner checked every step and screenshot against Stripe's current dashboard and API version. Nothing had changed. The calendar's "Last reviewed" date moved to 29 September, so the next review is 28 December. The page still says "Last updated 30 June 2026," because that's when it last changed. No log entry.

The whole content refresh calendar rests on that second outcome. Bumping the Stripe page's date would have been easy, and untrue.

To judge whether updated pages later earn more AI visibility, set a baseline before the change and compare four to six weeks later. Our guide on [how to measure GEO](/blog/how-to-measure-geo) covers the method.

## The Change Log Pattern: Show Readers and Machines What Changed

The change log is the public side of a content refresh calendar. It has three layers: a short note on the page, markup that matches it, and a sitewide page with the full history. Each layer tells a different audience the same true thing.

### Decide what earns a log entry

Google gives two useful lines. Its [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) says an update to "the main content, the structured data, or links on the page is generally considered significant, however an update to the copyright date is not." Its guide to [byline dates](https://developers.google.com/search/docs/appearance/publication-dates) says the dates you show "must describe the publication or update date of the page."

| Change                                    | Log it?           | Move visible date and `dateModified`? | Update sitemap `lastmod`?               |
| ----------------------------------------- | ----------------- | ------------------------------------- | --------------------------------------- |
| A price, figure or fact corrected         | Yes               | Yes                                   | Yes                                     |
| A new section or FAQ answer added         | Yes               | Yes                                   | Yes                                     |
| A cited study replaced by its new edition | Yes               | Yes                                   | Yes                                     |
| Broken links replaced, nothing else       | Yes               | No, if readers see no new content     | Yes, Google counts links as significant |
| Review with no change                     | No, calendar only | No                                    | No                                      |
| Typo, styling or footer year              | No                | No                                    | No                                      |

### Add a visible "What changed" note

Put the dates under the title, labelled the way Google suggests: "Published" and "Last updated." Directly below, add one or two lines on the latest change and a link to the full history:

```html
<p>Published 3 November 2025 · Last updated 29 September 2026</p>
<aside aria-label="What changed">
  <strong>What changed:</strong> Brindlework now sells three plans, not two. We rebuilt the pricing
  rows from its pricing page.
  <a href="/changelog#tallyfold-vs-brindlework">All changes to this page</a>
</aside>
```

Don't stack a dozen dated entries on the page. Google's byline guidance says that if the wrong date gets picked, "consider removing some or all other dates that appear on the page." Keep one date in the byline and one line of what changed; the full list lives on the change log page.

### Match it in the markup

Your Article or BlogPosting markup should carry the same two dates. Google's [Article structured data docs](https://developers.google.com/search/docs/appearance/structured-data/article) define `dateModified` as when the article was "most recently modified," in ISO 8601 format, and recommend a timezone:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Tallyfold vs Brindlework for agency invoicing",
  "datePublished": "2025-11-03T09:00:00-05:00",
  "dateModified": "2026-09-29T10:30:00-04:00"
}
```

Three rules keep it honest. The dates must match what readers see, which Google asks for directly. The offsets must be right for daylight saving: New York is five hours behind UTC in November and four in September. And the markup should never claim a change the page doesn't show, since Google's [structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) say not to mark up content "that is not visible to readers of the page." Our free [schema generator](/tools/schema-generator) builds Article markup with both date fields.

What about reviews with no change? Schema.org defines a [`lastReviewed`](https://schema.org/lastReviewed) property for the date content "was last reviewed for accuracy and/or completeness." Google's Article docs don't mention it, and a second date near the byline cuts against its advice on other dates. Record reviews in your calendar, not on the page.

### Publish a sitewide change log page

A change log page lists every substantive update across the site, newest first. Each entry needs four things: the date, the page (linked), one sentence on what changed, and the source behind the change. That's the Change Log sheet in the template, published.

It shows readers what's current and gives crawlers one place to find recently changed URLs. Give it an RSS or Atom feed. Google's sitemap docs say you "can submit the feed's URL as a sitemap," though a feed "only provides information on recent URLs," so keep your XML sitemap too. No AI engine documents a change log page as a ranking signal. Treat it as a service, not a trick.

Rankbox's own [changelog](/changelog) uses the same shape for product releases: one dated list feeds the hub page, a page for each entry, an RSS feed and the sitemap. A content change log works the same way, with pages in place of features.

### Tell crawlers the page changed

Bing is direct about dates. In a [July 2025 post](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search), it said the `lastmod` field "remains a key signal, helping Bing prioritize URLs for recrawling and reindexing," asked for full ISO 8601 date and time values, and warned against setting `lastmod` to the time your sitemap was generated. Send an [IndexNow](/glossary/indexnow) ping for Bing as well. The recrawl steps for Google are in check 14 of our [AI SEO checklist](/blog/ai-seo-checklist).

## Download the Content Refresh Calendar Template

This content refresh calendar template is the Clock-and-Tripwire model, ready to fill in, with Tallyfold's ten example rows so you can see how it works before you delete them.

- **[Download the spreadsheet (.xlsx)](/downloads/ai-search-refresh-calendar.xlsx).** Four sheets: Calendar (your pages, with next review and status computed), Intervals (the default clock and tripwires for each page type), Change Log (date, URL, what changed, source, who) and Read Me.
- **[Download the CSV](/downloads/ai-search-refresh-calendar.csv).** The Calendar sheet only, with fixed values in place of formulas, for importing into a database or project tool. Its Status column is blank, because status depends on today's date.

The spreadsheet opens in Google Sheets, Excel and Numbers. It's free to use, change and share with your team or clients. If you publish it or pass it on, please link back to this page.

## Where Rankbox Fits When a Review Turns Into a Rewrite

Rankbox writes new articles. It doesn't refresh, audit or re-date your existing posts, it doesn't track AI citations, and it doesn't publish directly to your CMS: articles reach your site through its API. It won't keep your content refresh calendar for you.

It helps at one point in the cycle. When a review ends in "Rewritten," Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) can draft the new version: it researches the live web and writes a 2,000–3,500-word article with its sources linked. [Brand Voice](/features/brand-voice) applies the tone, audience and product details you give it. You still check every fact, keep the old URL and log the change. The Business plan is $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### How often should you update content for AI search?

It depends on how fast the page's facts change. Start by reviewing pricing pages every 30 days, comparison pages every 60, integration docs and statistics posts every 90, and evergreen guides every 180. Update any page the day an event changes its facts, and tune each interval from your own review outcomes.

### What should a content refresh calendar include?

A content refresh calendar needs, for each page: the URL, its type, an owner, a review interval, the last reviewed date, a computed next review date and status, its tripwires, the last outcome and the date it last really changed. Add a separate change log with the date, URL, what changed, the source and who made the change.

### Should you change the published date when you update a post?

No. Keep the original published date and add a "Last updated" date beside it, with `datePublished` and `dateModified` to match in your markup. Google's byline guidance allows both dates. Move the updated date only when the content changed substantially, not after a typo fix or a review that found nothing.

### Does a changelog page help with AI search?

Not directly: no AI engine documents a changelog page as a ranking or citation signal. It helps readers see what's current, and its RSS or Atom feed can be submitted to Google as a sitemap of recently changed URLs. Keep your XML sitemap too, since a feed only covers recent URLs.

### What's the difference between reviewing and updating a page?

A review checks every fact on a page against its source; an update changes the page. When a review ends with no change, only the "Last reviewed" date in your calendar moves. The page's visible date and `dateModified` stay put, because nothing on it is new.

### How many pages can one person keep on a content refresh calendar?

Multiply pages by reviews a year for their interval, then by minutes per review. In the Tallyfold example, 123 pages need 284 reviews a year, about 95 hours at 20 minutes each, or just under two hours a week before edits. If that's more than one person has, lengthen the clocks on low-demand pages first.

## References

1. [Influence your byline dates in Google Search, Google Search Central](https://developers.google.com/search/docs/appearance/publication-dates)
2. [Article structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
3. [Build and submit a sitemap, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
4. [Creating helpful, reliable, people-first content, Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
5. [A guide to Google Search ranking systems, Google Search Central](https://developers.google.com/search/docs/appearance/ranking-systems-guide)
6. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
7. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
8. [General structured data guidelines, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
9. [Generative AI performance report (Search), Search Console Help](https://support.google.com/webmasters/answer/16984139)
10. [Keeping content discoverable with sitemaps in AI powered search, Microsoft Bing](https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search)
11. [New study: AI assistants prefer to cite "fresher" content, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
12. [How to optimize for ChatGPT: a study of 129,000 domains, SE Ranking](https://seranking.com/blog/how-to-optimize-for-chatgpt/)
13. [API versioning, Stripe Docs](https://docs.stripe.com/api/versioning)
14. [lastReviewed, Schema.org](https://schema.org/lastReviewed)
15. [Numbers function list, Apple](https://www.apple.com/au/mac/numbers/compatibility/functions.html)
