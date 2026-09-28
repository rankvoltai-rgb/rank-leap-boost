---
title: How to Track AI Referral Traffic in GA4: A 15-Minute Setup
description: Track AI referral traffic in GA4 in 15 minutes: read the AI Assistant channel, save one comparison, build one exploration and one report, then test it.
keyword: AI referral traffic
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Measurement
---

To track AI referral traffic in GA4 in 15 minutes, start with the AI Assistant channel that Google added on 13 May 2026, then add three things: a saved comparison that catches the assistants Google leaves out, one exploration that puts AI next to organic search, and one saved report for your team. Finish by clicking a real ChatGPT link to your site and checking that the visit shows up.

You don't need regex or a custom channel group for this version. It uses menus every GA4 property already has. The trade-off is that comparisons and segments only filter reports; they don't create a permanent channel. When you want that, our [full guide to measuring AI referral traffic in GA4](/blog/how-to-measure-ai-referral-traffic-in-ga4) walks through a tested channel group that also re-sorts past data.

Why start now? AI referral traffic is small but growing fast. BrightEdge [reported](https://www.globenewswire.com/news-release/2026/09/24/3368345/0/en/brightedge-data-chatgpt-referral-traffic-more-than-doubles-in-2026-reaching-record-95-1-share-of-ai-traffic.html) that referrals from AI platforms grew about 73% in less than a year, and ChatGPT's alone rose 101% from January to August 2026. If ChatGPT is most of your AI traffic, our [ChatGPT traffic analysis guide](/blog/chatgpt-traffic-analysis) shows what to do with the numbers once you have them.

## Key Takeaways

- GA4 already sorts some [AI referral traffic](/glossary/ai-referral-traffic) into an AI Assistant channel. Google's definition names ChatGPT, Gemini, DeepSeek, Copilot and Grok.
- Google's definition doesn't name Perplexity, so its visits usually stay in Referral. A saved comparison on Session source catches them.
- One free-form exploration with three segments shows AI visits beside organic search, by landing page and key event.
- A saved detail report in the Library gives your team the same view without rebuilding it.
- Test with a real click. GA4 can take 24 to 48 hours to process data, so check the saved report the next day.

## Before You Start the Clock

Three things make the 15 minutes work:

- **An Editor role or higher.** Google requires it to save comparisons, create detail reports and save segments for the whole property.
- **A key event.** Mark the action you care about, such as a signup or a purchase, as a [key event](https://support.google.com/analytics/answer/9355848). Without one, you can count visits but not value.
- **A few weeks of data after 13 May 2026.** Google hasn't said whether the AI Assistant channel re-sorts older sessions, so read trends from that date on.

## The 15-Minute AI Referral Setup Card

This card is the whole setup on one screen. Work down it in order and tick each "done when" before you move on.

| Minutes | Task | Where in GA4 | Done when |
| --- | --- | --- | --- |
| 0 to 3 | Read the built-in channel | Reports, Acquisition, Traffic acquisition | You can see the AI Assistant row and the sources inside it. |
| 3 to 6 | Save an "AI referrals" comparison | Admin, Data display, Comparisons | The comparison lists every assistant host in your data. |
| 6 to 11 | Build one exploration | Explore, Free form | AI, Perplexity and Organic Search sit side by side. |
| 11 to 14 | Save one detail report | Reports, Library | The report appears in your left navigation. |
| 14 to 15 | Test with a real click | ChatGPT, then Realtime | You see the page view, and the URL carries its tag. |

### Minutes 0 to 3: Read the AI Assistant channel

1. Open **Reports**, then **Acquisition**, then **Traffic acquisition**.
2. Set the primary dimension to **Session default channel group** and look for the **AI Assistant** row.
3. Switch the dimension to **Session source / medium**. Click **Add filter**, choose Session default channel group, pick **Exactly matches**, and select AI Assistant.

Now you can see which assistants Google recognized. Google's [channel definition](https://support.google.com/analytics/answer/9756891) says the channel covers "sources like ChatGPT, Gemini, Deepseek, Copilot, or Grok," and its [launch note](https://support.google.com/analytics/answer/9164320) also mentions Claude. The same page says the channel leaves out Google's AI Overviews and AI Mode, which count as Organic Search.

### Minutes 3 to 6: Save a comparison that adds Perplexity

A comparison lets you pick several sources at once, with no regex. Google's [comparison docs](https://support.google.com/analytics/answer/9269518) say multiple values in one condition are joined with OR.

1. In **Admin**, under **Data display**, click **Comparisons**, then **New comparison**.
2. Choose the dimension **Session source** and the match type **Exactly matches**.
3. Select every AI host that appears in your data: `chatgpt.com`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`, and Perplexity, which may show as `perplexity.ai` or `www.perplexity.ai`.
4. Save it as "AI referrals" and confirm.

Saved comparisons are still rolling out. If you don't see Comparisons in Admin, open any report, click the comparison icon, and choose **Create new** with the same settings. It won't be saved, but it works the same way.

### Minutes 6 to 11: Build one exploration

1. Open **Explore** and choose **Free form**.
2. Create three session segments: Session default channel group exactly matches AI Assistant; Session source contains `perplexity`; and Session default channel group exactly matches Organic Search. A free-form exploration [takes up to four segments](https://support.google.com/analytics/answer/9327972).
3. Add the dimension **Landing page + query string** to rows.
4. Add the metrics **Sessions**, **Engagement rate**, **Key events** and **Session key event rate**.
5. Name the exploration "AI vs organic."

Segments you build here stay inside this exploration, unless you choose Save to property, which [needs Editor access](https://support.google.com/analytics/answer/9304353). The Perplexity segment is there because the AI Assistant segment won't include it.

### Minutes 11 to 14: Save one detail report

1. Open **Reports**, then **Library** at the bottom left.
2. Click **Create new report**, then **Create detail report**, and pick the Traffic acquisition template. Google's [steps](https://support.google.com/analytics/answer/13844077) are the same for any template.
3. Add a report filter: Session source, exactly matches, with the same AI hosts you picked for the comparison.
4. Keep Session source / medium as the dimension and save the report as "AI referral traffic."
5. In the Library, edit a collection, drag the new report into a topic and save. That puts it in the [left navigation](https://support.google.com/analytics/answer/10460557) for everyone.

Now anyone on the team can open one report and see AI referral traffic by assistant, with no setup of their own.

### Minutes 14 to 15: Test with a real click

1. In ChatGPT, ask a question that should make it search and cite your site, such as your brand plus "pricing." Click the link it cites.
2. Look at the address bar. OpenAI's [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) says ChatGPT adds `utm_source=chatgpt.com`. If the tag is gone after the page loads, a redirect on your site dropped it.
3. Open **Realtime** and find your page in **Views by page title**.

Don't expect to see `chatgpt.com` in Realtime. Google's [Realtime docs](https://support.google.com/analytics/answer/9271392) say it shows first-user sources, and only for users GA4 has already processed. Google also says [processing can take 24 to 48 hours](https://support.google.com/analytics/answer/11198161), so check your saved report the next day.

## What One Week Can Look Like

Loopcraft is a made-up project management app at loopcraft.ai. After a week, its saved report shows the rows below. The numbers are illustrative, but they add up.

| Session source | Sessions | Where the default channels put it |
| --- | --- | --- |
| `chatgpt.com` | 212 | AI Assistant |
| `gemini.google.com` | 18 | AI Assistant |
| `copilot.microsoft.com` | 6 | AI Assistant |
| `www.perplexity.ai` | 31 | Referral |
| `claude.ai` | 9 | Referral |
| **Total AI referral traffic** | **276** | |

The AI Assistant channel alone shows 236 sessions. The comparison adds 40 more from Perplexity and Claude, so the built-in channel missed 14.5% of Loopcraft's AI referral traffic (40 ÷ 276). Where Claude lands varies between properties, which is why the comparison picks hosts by name.

## What This Quick Setup Leaves Out

The 15-minute version answers "how much AI referral traffic do we get, and does it convert?" It leaves four gaps, and each has a fix.

- **No permanent channel.** Comparisons and segments filter your reports, but your channel reports still split AI across two rows. A custom channel group fixes that, and the [complete GA4 guide](/blog/how-to-measure-ai-referral-traffic-in-ga4) has one with a tested hostname pattern.
- **Clicks that arrive as Direct.** A click that loses both its referrer and its tag carries no source for any report to read. Check that your redirects keep query strings, so ChatGPT's tag survives.
- **Google's own AI answers.** Clicks from AI Overviews and AI Mode stay in Organic Search, and GA4 can't split them out.
- **New assistants.** Once a month, filter the Referral and Unassigned rows for hosts that look like assistants, and add any new ones to your comparison and report.

For the wider view of AI visibility, from crawls and citations to conversions, see our [GEO measurement guide](/blog/how-to-measure-geo).

## Where Rankbox Fits

Rankbox doesn't track AI citations or read your GA4 data today. This setup runs entirely in Google Analytics.

What Rankbox does happens before the click. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google, and the [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles on them, delivered to your site through Rankbox's API. Your new report then shows whether those pages earn AI referral traffic. If you run AI ads or share links inside AI products, tag them with our [UTM link builder](/tools/utm-link-builder) so paid clicks don't inflate the organic count. See [plans and pricing](/pricing).

## Frequently Asked Questions

### Where is AI referral traffic in GA4?

Most of it is in the AI Assistant channel in Traffic acquisition, which Google added on 13 May 2026. Visits from assistants Google doesn't recognize, often Perplexity, stay in Referral. Visits that lose their source land in Direct, and clicks from Google's AI Overviews count as Organic Search.

### Why isn't Perplexity in GA4's AI Assistant channel?

Google's channel definition names ChatGPT, Gemini, DeepSeek, Copilot and Grok, and doesn't publish its full list. Perplexity isn't named, so its visits usually arrive as an ordinary referral. Add its host to a comparison or a custom channel to count it with the rest.

### Do I need regex to track AI referral traffic in GA4?

No. The built-in channel, a comparison with several exact values, and an exploration segment cover it without regex. You need a pattern only for a custom channel group, which gives you a permanent channel and re-sorts past data.

### How long does GA4 take to show AI referral traffic?

Realtime shows the page view within minutes, but not the AI source for new users. Google says standard processing can take 24 to 48 hours, so check your saved report or exploration the day after a test click.

### Can I see AI referral traffic from before May 2026?

Partly. Google hasn't said whether the AI Assistant channel applies to sessions before 13 May 2026. A comparison or segment on Session source works on older data, because it reads the source itself. A custom channel group can also be applied to past data.

### Does GA4 count clicks from Google AI Overviews as AI referral traffic?

No. Google's channel definitions put AI Overviews and AI Mode clicks in Organic Search, and they arrive from google.com like any search click. Search Console's [generative AI performance report](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports), live for all sites since 31 August 2026, shows how often those features show your pages.

## References

1. [Default channel group, Google Analytics Help](https://support.google.com/analytics/answer/9756891)
2. [What's new in Google Analytics, Google Analytics Help](https://support.google.com/analytics/answer/9164320)
3. [Apply comparisons to reports, Google Analytics Help](https://support.google.com/analytics/answer/9269518)
4. [Free-form exploration, Google Analytics Help](https://support.google.com/analytics/answer/9327972)
5. [Segment builder, Google Analytics Help](https://support.google.com/analytics/answer/9304353)
6. [Create a detail report, Google Analytics Help](https://support.google.com/analytics/answer/13844077)
7. [Customize report navigation, Google Analytics Help](https://support.google.com/analytics/answer/10460557)
8. [Realtime report, Google Analytics Help](https://support.google.com/analytics/answer/9271392)
9. [Data freshness, Google Analytics Help](https://support.google.com/analytics/answer/11198161)
10. [Key event, Google Analytics Help](https://support.google.com/analytics/answer/9355848)
11. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
12. [Introducing Search generative AI performance reports, Google Search Central](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
13. [BrightEdge data: ChatGPT referral traffic more than doubles in 2026, GlobeNewswire](https://www.globenewswire.com/news-release/2026/09/24/3368345/0/en/brightedge-data-chatgpt-referral-traffic-more-than-doubles-in-2026-reaching-record-95-1-share-of-ai-traffic.html)
