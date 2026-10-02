---
title: Cloudflare AI Bots: How Cloudflare Classifies AI Crawlers and Where to See Them
description: How Cloudflare AI bots are classified by behavior, verification and operator, where to see them in the dashboard, and what Radar's crawl ratios mean.
keyword: Cloudflare AI bots
date: 2026-11-06
updated: 2026-11-06
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, AI Search
---

Cloudflare classifies AI bots by what they do on your site (Search, Agent, Training and other behaviors), by whether it has verified who runs them, and by who drives each request: the operator directly, or end users through an intermediary. You see Cloudflare AI bots on your own zone in AI Crawl Control and Security Analytics, and across the whole network on Cloudflare Radar.

Those labels matter because your settings act on them. A block on "Training" reaches all Cloudflare AI bots filed under that behavior, whatever their names. So before you change anything, it helps to know which label each crawler carries and where its traffic shows up. For the settings themselves, see our [full walkthrough of Cloudflare AI bot management](/blog/cloudflare-ai-bot-management).

This guide covers the labels, a lookup table for the crawlers that shape AI answers, the dashboard screens that show them, what Radar publishes, and how to read a crawl-to-referral ratio. All facts are as of 1 October 2026.

## Key Takeaways

- Cloudflare AI bots carry three labels: a behavior (Search, Agent, Training or one of eight others), a verified status, and an access type, Direct or Intermediary.
- Since 1 July 2026, verified means a bot can be allowed, not that it is. Your Search, Agent and Training settings decide.
- Googlebot, Bingbot and Applebot are labeled Training and Search on Radar. ChatGPT-User and Claude-User are Agents with Intermediary access.
- The old WAF categories, such as "AI Crawler" and "AI Search", still work in custom rules, but new search crawlers are filed under Search.
- AI Crawl Control shows crawler requests on every plan. Referral counts need a paid plan, and the Free plan's metrics cover 24 hours.
- In the week to 1 October 2026, Radar counted 210.6 OpenAI crawls per referral, 500.9 for Anthropic and about 3,700 for Perplexity, against 5.4 for Google.

## How Cloudflare AI Bots Get Their Labels

Cloudflare keeps one directory of the bots it tracks, called BotBase, and publishes it on [Radar's bots and agents directory](https://radar.cloudflare.com/bots/directory). Each entry carries three labels.

### Label 1: behavior

Cloudflare's [verified bots page](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/) lists eleven behaviors. A bot can have more than one.

| Behavior                | What it means                                                   |
| ----------------------- | --------------------------------------------------------------- |
| Search                  | Crawling to build search indexes or RAG databases               |
| Agent                   | User-directed agents visiting a page for a human                |
| Training                | Crawling to train or fine-tune models                           |
| Transact                | Checkout and other transactions for users                       |
| Data Collection         | Price scraping, competitive intelligence, third-party analytics |
| Security Testing        | Vulnerability scans and penetration tests                       |
| SEO                     | SEO crawling, site audits, accessibility checks                 |
| Ads Verification        | Ad placement checks and ad fraud detection                      |
| Social / Link Preview   | Link previews for social and messaging apps                     |
| Feed Fetching           | RSS readers, podcast and news feed bots                         |
| Monitoring & Operations | Uptime checks, webhooks, health checks                          |

Only the first three are settings you can act on in every plan. The rest describe traffic.

### Label 2: verified or not

To be verified, a bot has to clear two bars. It must identify itself in a way that can be checked: a [Web Bot Auth](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/) signature, a published IP list with a stable user agent, or reverse DNS. And it must behave, which includes obeying robots.txt and crawl directives. Cloudflare lists "an AI Crawler that does not respect the crawl-delay directive" as one way to lose the status.

Two changes from July 2026 matter here. Signed agents, which prove identity with a cryptographic signature, now count as verified. And Cloudflare's [July announcement](https://blog.cloudflare.com/content-independence-day-ai-options/) says verified no longer means allowed by default. It only makes a bot allowable under the behavior you choose to allow.

### Label 3: direct or intermediary

Radar now marks each bot by who drives it. Direct bots are run by one operator on its own systems. Intermediary bots are run by a platform but triggered by many different end users, such as a chat assistant fetching a page because someone asked. On Radar, OAI-SearchBot is Direct and [ChatGPT-User](https://radar.cloudflare.com/bots/directory/chatgpt-user) is Intermediary.

### The older categories you'll still meet

Firewall rules use an older field, `cf.verified_bot_category`, with values such as "AI Crawler", "AI Search", "AI Assistant", "Archiver" and "Search Engine Crawler". Cloudflare says these legacy categories "continue to work as before." But under the July 2026 taxonomy, AI search and classic search are both Search, and new search crawlers aren't added to "AI Search". So rules built on that value can miss newer bots.

### The newest label: Accountable

On 15 September 2026, Cloudflare added an [Accountable designation](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/) for operators that let you opt out of training without leaving search, offer an AI-summary opt-out, and show URL-level data on how content was used. Apple, Google and Microsoft qualify, which is why their crawlers keep crawling for search under Cloudflare's Disallow AI Training setting.

## The Three-Label Lookup for Common Crawlers

The Three-Label Lookup is our one-table answer to "what does Cloudflare think this bot is?" for the Cloudflare AI bots that shape AI answers. It joins three Cloudflare sources that rarely appear together: the [bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/) for the category AI Crawl Control shows, Radar's directory pages for behavior and access, and Radar's [AI bot transparency table](https://radar.cloudflare.com/ai-insights) for whether the operator is verified. All were checked on 1 October 2026.

| Crawler            | Behavior on Radar        | Bot reference category | Access       | Operator verified |
| ------------------ | ------------------------ | ---------------------- | ------------ | ----------------- |
| GPTBot             | Training                 | AI Crawler             | Direct       | Yes (OpenAI)      |
| OAI-SearchBot      | Search                   | AI Search              | Direct       | Yes (OpenAI)      |
| ChatGPT-User       | Agent                    | AI Assistant           | Intermediary | Yes (OpenAI)      |
| ClaudeBot          | Training                 | AI Crawler             | Direct       | Yes (Anthropic)   |
| Claude-SearchBot   | Search                   | AI Search              | Direct       | Yes (Anthropic)   |
| Claude-User        | Agent                    | AI Assistant           | Intermediary | Yes (Anthropic)   |
| PerplexityBot      | No directory entry found | AI Search              | Not shown    | No (Perplexity)   |
| Perplexity-User    | No directory entry found | AI Assistant           | Not shown    | No (Perplexity)   |
| Googlebot          | Training, Search         | Search Engine          | Direct       | Yes (Google)      |
| Bingbot            | Training, Search         | Search Engine          | Direct       | Yes (Microsoft)   |
| Applebot           | Training, Search         | AI Search              | Direct       | Yes (Apple)       |
| Meta-ExternalAgent | Training                 | AI Crawler             | Direct       | Yes (Meta)        |
| Amazonbot          | Training                 | AI Crawler             | Direct       | Yes (Amazon)      |
| Bytespider         | No directory entry found | AI Crawler             | Not shown    | No (ByteDance)    |

Read the lookup by row. Among Cloudflare AI bots, Googlebot, Bingbot and Applebot carry both Training and Search, which is why blocking all training reaches them. PerplexityBot has a category in the bot reference, but its operator isn't verified. Verified-bot allowances don't cover it, and `cf.verified_bot_category` only describes verified bots. Applebot still sits in the old "AI Search" category, so a rule built on those values treats it like an AI bot. For user-agent strings and IP lists, see our [AI crawler directory](/blog/ai-crawler-directory).

## Where to See Cloudflare AI Bots in Your Dashboard

Cloudflare shows traffic from Cloudflare AI bots in four places. Which one you use depends on your plan and your question.

### AI Crawl Control

[AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/) is on every plan. Go to AI Crawl Control in your zone. It has four tabs:

1. **Overview:** total, allowed and unsuccessful requests, crawlers grouped by operator, and whether managed robots.txt is on. Referral totals need a paid plan.
2. **Crawlers:** one row per crawler with its category, requests and Action. Each row's menu can open the bot on Radar or copy its user agent.
3. **Metrics:** requests over time grouped by crawler, category, operator or host, a status code chart, a Content Format chart, top referrers and most popular paths.
4. **Directives:** robots.txt health per hostname and a list of crawlers that fetched paths your robots.txt disallows.

On the Free plan, AI Crawl Control spots Cloudflare AI bots by user agent only, so a scraper that copies GPTBot's name is counted as GPTBot. The Metrics tab covers the past 24 hours. Use the Allowed requests view to count only 2xx responses. The All requests view includes 403 blocks and 402 payment requests.

### Security Analytics and Security Events

[Security Analytics](https://developers.cloudflare.com/waf/analytics/security-analytics/) shows all traffic, mitigated or not, so it's where you see a bot that got through. It keeps 7 days on Free and Pro, 31 on Business and 90 on Enterprise. [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) shows only requests a security feature acted on, with a Service field naming the feature. It keeps 24 hours on Free and Pro. For reading those events when ChatGPT is blocked, see [why Cloudflare blocks ChatGPT](/blog/why-is-cloudflare-blocking-chatgpt).

### Business Insights and BotBase (Enterprise)

Enterprise Bot Management customers get two more screens. [Business Insights](https://developers.cloudflare.com/bots/business-insights/) reports crawl-to-referral ratios per operator and site-wide over 24 hours, 7 days or 30 days. BotBase lists every tracked bot with its behaviors and lets you copy its detection ID for rules.

### The GraphQL API

For your own reports, AI Crawl Control data is also available through Cloudflare's GraphQL Analytics API, including detection IDs, referrer data and data transfer. That's the route if you want a weekly export without clicking through the dashboard.

## What Cloudflare Radar Publishes About AI Crawlers

Radar's [AI Insights page](https://radar.cloudflare.com/ai-insights) shows network-wide numbers for Cloudflare AI bots. These were the figures for the seven days to 1 October 2026:

- **Crawl purpose:** Training 42.5%, Training and Search 41.2%, Search 11.4%, user action 3.2%, undeclared 1.7%.
- **Busiest AI bots by HTTP traffic:** Googlebot 25.7%, ClaudeBot 12.2%, Meta-ExternalAgent 10.8%, Applebot 8.6%, Bingbot 6.9%.
- **Responses to AI bots:** 59.5% got a 200 and 16.1% a 403.
- **HTML page requests by client:** non-AI bots 54.5%, humans 35.6%, AI bots 5.9%, mixed-purpose bots 4.1%.
- **Robots.txt:** of 4,242 robots.txt files in the top 10,000 domains, 344 fully disallowed GPTBot and 176 partly did, updated 27 September 2026.

Radar also has one page for each of the verified Cloudflare AI bots. The [ChatGPT-User page](https://radar.cloudflare.com/bots/directory/chatgpt-user) showed 31.3% of its requests across Cloudflare getting a 403 that week, against 12.8% for OAI-SearchBot and 4.7% for Googlebot. Sites separate bots by job in robots.txt too. In Rankbox's [AI bot crawler census](/blog/ai-bot-crawler-census), of 195 news sites that fully block GPTBot, 78 still let OAI-SearchBot in.

### The crawl-to-refer ratios

Radar defines the ratio as HTML page crawl requests divided by HTML page referrals, per platform. In the week to 1 October 2026:

| Platform   | Crawls per referral             | Change on previous week |
| ---------- | ------------------------------- | ----------------------- |
| Perplexity | About 3,700 : 1 (shown as 3.7K) | +26.4%                  |
| Anthropic  | 500.9 : 1                       | -11%                    |
| OpenAI     | 210.6 : 1                       | -63.5%                  |
| Microsoft  | 42.5 : 1                        | +5.1%                   |
| Google     | 5.4 : 1                         | +13.2%                  |
| DuckDuckGo | 4.9 : 1                         | +16%                    |

Radar also splits each operator's crawling by bot. GPTBot made 72.8% of OpenAI's requests, OAI-SearchBot 19.7% and ChatGPT-User 7.5%. ClaudeBot made 83% of Anthropic's. Training crawlers do most of the fetching and send nothing back by design, which drives the ratios up. The weekly swings are large, so treat any one week as a snapshot.

## How to Read a Crawl-to-Referral Ratio for Your Site

A crawl-to-referral ratio tells you how much an operator takes for each visit it sends. It's a rough price tag on letting its Cloudflare AI bots in. Here's how to work out your own from AI Crawl Control on a paid plan.

1. **Pick a 30-day window,** so one busy week doesn't skew it.
2. **Count crawls per operator.** On the Metrics tab, choose Allowed requests and group by operator. Radar counts HTML pages only. To get close, filter to one operator and read the Content tab under Most popular paths, which leaves out images and other media.
3. **Count referrals per operator.** Use Referrals over time, grouped by operator.
4. **Divide,** then split the crawls by bot so you can see how much is training.

### Worked example: Tallyfold's ratios

Tallyfold is a made-up invoicing app for agencies. These 30-day numbers are illustrative, but the arithmetic is real.

| Operator  | Allowed HTML crawls | Referrals | Ratio     | Share from training bots |
| --------- | ------------------- | --------- | --------- | ------------------------ |
| OpenAI    | 18,600              | 310       | 60.0 : 1  | 71%                      |
| Anthropic | 9,400               | 47        | 200.0 : 1 | 82%                      |
| Google    | 52,000              | 9,600     | 5.4 : 1   | Googlebot does both jobs |

Then strip out training, since a training crawler isn't meant to send visits. OpenAI's search and assistant bots made 29% of 18,600, about 5,394 crawls, for 310 referrals. That's 17.4 crawls per visit. Anthropic's non-training share is 18% of 9,400, or 1,692 crawls, for 47 referrals, about 36.0 per visit. Seen that way, the bots that cite you are far cheaper than the headline ratio suggests. The training crawlers are the ones worth deciding about.

### What the ratio can't tell you

- **Referrals undercount.** Some apps drop the referrer, and Business Insights counts referrals through UTM parameters. Pair the ratio with our guide to [tracking AI referral traffic in GA4](/blog/how-to-track-ai-referral-traffic-in-ga4).
- **No referral doesn't mean no value.** An AI answer can name you without a click. See [how to measure GEO](/blog/how-to-measure-geo) for the other signals.
- **Your ratio isn't Radar's.** Radar's figures are network-wide. Yours depend on your content and your rules.

## Rankbox's Role Once You Can See the Bots

Rankbox doesn't run a CDN, manage Cloudflare settings or track AI citations today. Its free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) counts AI bot hits in your own server logs, in your browser, which is useful when you aren't on Cloudflare or want to check its numbers.

Once AI Crawl Control or your logs show search bots such as OAI-SearchBot and Claude-SearchBot reading your pages, the job is to give them pages worth citing. Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### What are Cloudflare AI bots?

They're the crawlers and agents Cloudflare tracks as doing AI-related work on websites: building search indexes, fetching pages for chat assistants, or training models. Cloudflare files each one by behavior, verified status and access type, and lists verified ones on Radar's bots directory.

### How does Cloudflare know a bot is really GPTBot?

It checks proof, not the name. A verified bot must identify itself through a Web Bot Auth signature, a published IP list with a stable user agent, or reverse DNS. One catch: on the Free plan, AI Crawl Control's counts go by user agent, so they can include impostors.

### Where do I see Cloudflare AI bots on the free plan?

Open AI Crawl Control in your zone. The Crawlers tab lists each AI bot, and the Metrics tab shows the last 24 hours by crawler, operator and status code. Security Analytics adds 7 days of all traffic, including bots that got through.

### Is PerplexityBot a verified bot on Cloudflare?

No, as of 1 October 2026. Radar's AI bot transparency table lists Perplexity as not verified. Cloudflare's bot reference still gives PerplexityBot the legacy "AI Search" category, but verified-bot allowances don't cover it.

### What is a good crawl-to-referral ratio?

There's no official benchmark. Radar showed Google at 5.4 crawls per referral and OpenAI at 210.6 in the week to 1 October 2026. Compare your ratio for search and assistant bots only, since training crawlers aren't built to send visits.

### Are Googlebot and Bingbot Cloudflare AI bots?

Partly. Radar labels Googlebot, Bingbot and Applebot with both Training and Search behaviors. That's why a full Training block now reaches them, while Cloudflare's Disallow AI Training setting lets them keep crawling for search.

## References

1. [Verified bots, Cloudflare Docs](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)
2. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
3. [Have it both ways: stay discoverable in search while disallowing AI training, Cloudflare](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/)
4. [Bot reference, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
5. [Analyze AI traffic, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/)
6. [Security Analytics, Cloudflare Docs](https://developers.cloudflare.com/waf/analytics/security-analytics/)
7. [Security Events, Cloudflare Docs](https://developers.cloudflare.com/waf/analytics/security-events/)
8. [Business Insights, Cloudflare Docs](https://developers.cloudflare.com/bots/business-insights/)
9. [Web Bot Auth, Cloudflare Docs](https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/)
10. [AI Insights, Cloudflare Radar](https://radar.cloudflare.com/ai-insights)
11. [Bots and agents directory, Cloudflare Radar](https://radar.cloudflare.com/bots/directory)
12. [ChatGPT-User, Cloudflare Radar](https://radar.cloudflare.com/bots/directory/chatgpt-user)
