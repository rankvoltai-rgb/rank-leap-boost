---
title: ChatGPT Traffic Analysis: How to Measure Visits From ChatGPT
description: ChatGPT traffic analysis in GA4: find every chatgpt.com row, split ads from organic clicks, read landing pages and conversions, and know what stays hidden.
keyword: ChatGPT traffic
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Measurement
---

ChatGPT traffic analysis starts with one filter: sessions whose source is `chatgpt.com`. That single source gathers ChatGPT's tagged links, its plain referrals and GA4's AI Assistant rows. From there, split out any ChatGPT ads you run, read where the visits land and how they convert against organic search, and treat the total as a floor, because some clicks arrive with no source at all.

ChatGPT deserves its own analysis because it sends most [AI referral traffic](/glossary/ai-referral-traffic). BrightEdge [reported](https://www.globenewswire.com/news-release/2026/09/24/3368345/0/en/brightedge-data-chatgpt-referral-traffic-more-than-doubles-in-2026-reaching-record-95-1-share-of-ai-traffic.html) that ChatGPT had 95.1% of AI referral traffic in August 2026. SE Ranking's panel of 101,574 sites puts its 2026 share lower, at [74.78%](https://seranking.com/blog/ai-traffic-research-study/). The panels differ, but both say the same thing: for most sites, ChatGPT traffic is most of the AI story.

This guide covers ChatGPT only. For the channel setup that catches every assistant, read our [full guide to measuring AI referral traffic in GA4](/blog/how-to-measure-ai-referral-traffic-in-ga4). If you just want GA4 working today, the [15-minute AI referral setup](/blog/how-to-track-ai-referral-traffic-in-ga4) is the shorter path.

## Key Takeaways

- Filter on the source `chatgpt.com`, not on a channel. Depending on the medium, ChatGPT visits can sit in AI Assistant, Referral, Unassigned or Paid Other.
- OpenAI says ChatGPT adds `utm_source=chatgpt.com` to the links in its search answers. It documents no medium.
- If you buy ChatGPT ads, tag them with your own medium, such as `cpc`. OpenAI says static UTM parameters persist on ad clicks.
- Read ChatGPT traffic by landing page. Homepages drove ChatGPT's May 2026 jump in referrals, so post-level reports undercount it.
- Compare conversion with organic search only with a margin of error beside it. Page-level rates need far more sessions than channel-level rates.
- The count is a floor. Clicks from apps and copied links often lose both referrer and tag, and no report can see the conversation behind a click.

## How ChatGPT Traffic Reaches Your Analytics

Three signals can identify a ChatGPT visit. Each one fails in a different way, so it helps to know all three.

1. **The referrer.** A click from ChatGPT on the web carries `chatgpt.com` as its referring host. Old `chat.openai.com` links now answer with a 308 redirect to `chatgpt.com`, so expect little of that host in new data.
2. **The tag.** OpenAI's [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) says ChatGPT adds `utm_source=chatgpt.com` to its referral URLs. The tag travels in the address, so it survives even when a browser drops the referrer.
3. **GA4's channel.** Since 13 May 2026, Google's [AI Assistant channel](https://support.google.com/analytics/answer/9756891) sets the medium to `ai-assistant` when the referrer is on its list of assistants, and Google names ChatGPT among them.

Google's [processing rules](https://support.google.com/analytics/answer/11242841) say UTM values map straight onto source and medium, and that the referrer only fills gaps. Google doesn't document how its `ai-assistant` rewrite interacts with a source-only tag. So your property may show ChatGPT traffic in more than one row.

### The chatgpt.com rows you may find

| Session source / medium | What produced it | Default channel |
| --- | --- | --- |
| `chatgpt.com / ai-assistant` | A click GA4 matched to its assistant list. | AI Assistant |
| `chatgpt.com / referral` | A referral that wasn't rewritten, common before 13 May 2026. | Referral |
| `chatgpt.com / (not set)` | The source tag with no medium. | Unassigned, since no default rule fits. |
| `chatgpt.com / cpc` | Your own tagged ChatGPT ads. | Paid Other |
| `(direct) / (none)` | A click that lost both referrer and tag. | Direct |

The paid row follows from Google's definitions: a paid-style medium with a source that isn't on Google's search, social, video or shopping lists falls into Paid Other.

## Build a ChatGPT-Only View in GA4

You don't need a custom channel group for this. You need the source.

1. **Find every row.** Open Reports, then Acquisition, then Traffic acquisition. Set the primary dimension to Session source / medium and type `chatgpt` in the search box. Write down each row and its sessions for the last 28 days.
2. **Start an exploration.** In Explore, choose Free form. Add the dimensions Session source / medium, Landing page + query string and Session default channel group. Add the metrics Sessions, Engaged sessions, Engagement rate, Key events and Session key event rate.
3. **Add two segments.** Create a session segment where Session source exactly matches `chatgpt.com`, and a second where Session default channel group exactly matches Organic Search. Google's [free-form docs](https://support.google.com/analytics/answer/9327972) allow up to four segments side by side.
4. **Check new users.** In the User acquisition report, the First user source `chatgpt.com` shows people whose first visit came from ChatGPT.

Exclude your ad rows before you read any rate. OpenAI's [ads basics page](https://help.openai.com/en/articles/20001207-ads-in-chatgpt-the-basics) says advertisers can add static UTM parameters to landing page URLs, and that they persist on ad clicks. Build those links with our [UTM link builder](/tools/utm-link-builder) and a medium of `cpc`, so paid clicks never blend into organic ChatGPT traffic.

## The ChatGPT Traffic Scorecard

The ChatGPT traffic scorecard is our five-read monthly check. Each read answers one question, and together they fit on half a page.

| Read | How to calculate it | What it tells you |
| --- | --- | --- |
| 1. Share | Organic `chatgpt.com` sessions ÷ all sessions | Whether ChatGPT matters yet, and its trend. |
| 2. Landing mix | Homepage sessions ÷ ChatGPT sessions | Whether clicks come from brand links or from cited pages. |
| 3. Quality | Session key event rate against Organic Search, with a margin of error | Whether a ChatGPT visit is worth more or less than a search visit. |
| 4. Paid split | `cpc` rows ÷ all `chatgpt.com` rows | How much of your ChatGPT traffic you bought. |
| 5. Leak rate | `(not set)` plus `referral` rows ÷ organic `chatgpt.com` rows | How much sits outside the AI Assistant channel. |

### Why the landing mix matters now

SE Ranking [found](https://seranking.com/blog/chatgpt-referral-traffic-may-2026/) that ChatGPT's worldwide referral share rose from 0.23% of all traffic in April 2026 to 0.32% in May, and that homepages drove most of the jump. Practitioners tie it to brand names in answers becoming clickable around 7 May. The same study reports that 60% of AI-referred visits land on homepages, against 17% from organic search. If you judge ChatGPT only by the posts it cites, you miss most of it.

### Why quality needs a margin of error

ChatGPT sessions are few, so their conversion rate swings. Put the 95% margin next to the rate every time: 1.96 × √(rate × (1 − rate) ÷ sessions). If the range overlaps your organic search rate, the gap isn't proven yet.

## Worked Analysis: Tallyhive's September

Tallyhive is a made-up invoicing app at tallyhive.io. The numbers are illustrative, but the arithmetic is real. In September 2026 it had 80,000 sessions, 42,000 of them from Organic Search.

### Step 1: Gather the rows

| Session source / medium | Sessions | Trial starts |
| --- | --- | --- |
| `chatgpt.com / ai-assistant` | 1,150 | 34 |
| `chatgpt.com / (not set)` | 90 | 3 |
| `chatgpt.com / referral` | 20 | 0 |
| **Organic ChatGPT traffic** | **1,260** | **37** |
| `chatgpt.com / cpc` (Tallyhive's ads) | 240 | 4 |

Organic ChatGPT traffic is 1,260 ÷ 80,000 = 1.6% of sessions. Reading only the AI Assistant channel would have missed 110 of those 1,260 sessions, or 8.7%. The leak rate is the same 8.7%.

### Step 2: Read the landing mix

Of the 1,260 organic sessions, 740 landed on the homepage: 58.7%. For Organic Search, the homepage took 9,000 of 42,000 sessions, or 21.4%. The rest of the ChatGPT sessions landed on `/pricing` (190), comparison pages (160) and the blog (170).

### Step 3: Compare quality

ChatGPT traffic converted at 37 ÷ 1,260 = 2.94%. Organic Search converted at 756 ÷ 42,000 = 1.80%. The margin on the ChatGPT rate is ±0.93 points, so the true rate likely sits between 2.0% and 3.9%. Even the low end beats 1.8%, and a two-proportion test gives p ≈ 0.003. On this data, a ChatGPT visit is worth about 1.6 times a search visit for trial starts.

The ads tell a different story: 4 trials from 240 sessions is 1.67%, with a margin of ±1.62 points. That's too few sessions to judge.

### Step 4: Find the page that converts

| Landing page | Sessions | Trials | Rate |
| --- | --- | --- | --- |
| Homepage | 740 | 14 | 1.89% |
| `/pricing` | 190 | 12 | 6.32% |
| Comparison pages | 160 | 7 | 4.38% |
| Blog | 170 | 4 | 2.35% |

The pricing page converts at more than three times the homepage rate, and that gap holds up (p ≈ 0.001). But ChatGPT sends four times more visits to the homepage. Tallyhive's next move is to put its pricing and a comparison summary on the homepage, where ChatGPT traffic actually lands, and to track the homepage rate next month.

## What ChatGPT Traffic Analysis Can't See

Every number above undercounts, in known ways.

- **The prompt.** Browsers default to sending only the origin to other sites, per [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy). You see `chatgpt.com`, never the question.
- **Clicks with no referrer and no tag.** Seer Interactive [warns](https://www.seerinteractive.com/insights/are-ai-sites-like-chatgpt-sending-your-website-traffic) that clicks from in-app browsers and copied links land in Direct, so read the AI channel as a floor. OpenAI doesn't document what its desktop and mobile apps send.
- **Journeys across devices.** A buyer who reads the answer on a phone and signs up on a laptop looks like two people.
- **Mentions without clicks.** A buyer who reads your name and searches for it later shows up as branded search. Our [GEO measurement guide](/blog/how-to-measure-geo) covers a signup-form question that catches them.

One gap is smaller than it looks. Google's [scope docs](https://support.google.com/analytics/answer/11080067) say sessions that start by direct entry are credited to the campaign values GA4 already holds for that user. ChatGPT's links carry a campaign source, so a buyer who clicks from ChatGPT and later types your URL in the same browser can still count toward `chatgpt.com`.

Two outside checks help. Hits from `ChatGPT-User` in your server logs show pages that ChatGPT read for a user, even without a click; our [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) counts them per URL. And on paid Cloudflare plans, AI Crawl Control's [referral charts](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/) count `chatgpt.com` referrals at the edge, before any analytics script runs.

## Where Rankbox Fits

Rankbox doesn't analyze your GA4 data or track AI citations today. Everything above runs in GA4 and your logs.

Rankbox works on what earns the click. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, and the [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles that answer them, delivered to your site through Rankbox's API. The scorecard above then shows whether those pages bring ChatGPT traffic that converts. See [plans and pricing](/pricing).

## Frequently Asked Questions

### How do I see ChatGPT traffic in Google Analytics?

Open Traffic acquisition, set the primary dimension to Session source / medium, and search for `chatgpt`. You'll usually see `chatgpt.com` with the medium `ai-assistant`, and sometimes `referral` or `(not set)`. Add the rows together, minus any rows from your own ChatGPT ads.

### Why does ChatGPT traffic show up as Unassigned?

Because the tag ChatGPT adds names a source but no medium. A row of `chatgpt.com / (not set)` matches none of GA4's default channel rules, so GA4 files it as Unassigned. Filtering on the source `chatgpt.com` brings it back into your ChatGPT count.

### Does ChatGPT traffic show up as direct?

Some of it does. Clicks from in-app browsers or copied links can lose both the referrer and the `utm_source` tag, and GA4 then files them as Direct. No report can move those sessions back, so treat your ChatGPT traffic figure as a minimum.

### How do I separate ChatGPT ads from organic ChatGPT clicks?

Tag every ad's landing page URL with your own source and medium, such as `utm_source=chatgpt.com&utm_medium=cpc`. OpenAI says those parameters persist on ad clicks. The paid visits then land in Paid Other, and your organic filter can exclude the `cpc` rows.

### Is ChatGPT traffic worth more than Google traffic?

Sometimes, and published studies disagree. Measure your own: compare the session key event rate of `chatgpt.com` sessions with Organic Search over the same dates, for one key event, with a margin of error. Wait until the ranges stop overlapping before you call it.

### Can I see which prompts sent ChatGPT traffic?

No. The browser passes at most the `chatgpt.com` hostname, and OpenAI shares no prompt data with publishers. The landing page is the closest clue: it tells you which answer the visitor clicked from, if not the question they asked.

## References

1. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
2. [Ads in ChatGPT: The Basics, OpenAI Help Center](https://help.openai.com/en/articles/20001207-ads-in-chatgpt-the-basics)
3. [Ads in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)
4. [Default channel group, Google Analytics Help](https://support.google.com/analytics/answer/9756891)
5. [Campaigns and traffic sources, Google Analytics Help](https://support.google.com/analytics/answer/11242841)
6. [Scopes of traffic-source dimensions, Google Analytics Help](https://support.google.com/analytics/answer/11080067)
7. [Free-form exploration, Google Analytics Help](https://support.google.com/analytics/answer/9327972)
8. [Analytics dimensions and metrics, Google Analytics Help](https://support.google.com/analytics/answer/9143382)
9. [BrightEdge data: ChatGPT referral traffic more than doubles in 2026, GlobeNewswire](https://www.globenewswire.com/news-release/2026/09/24/3368345/0/en/brightedge-data-chatgpt-referral-traffic-more-than-doubles-in-2026-reaching-record-95-1-share-of-ai-traffic.html)
10. [AI traffic research study, SE Ranking](https://seranking.com/blog/ai-traffic-research-study/)
11. [Referral traffic from ChatGPT hit an all-time high in May 2026, SE Ranking](https://seranking.com/blog/chatgpt-referral-traffic-may-2026/)
12. [Are AI sites like ChatGPT sending your website traffic?, Seer Interactive](https://www.seerinteractive.com/insights/are-ai-sites-like-chatgpt-sending-your-website-traffic)
13. [Referrer-Policy header, MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy)
14. [Analyze AI traffic, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/)
