---
title: Why Is Cloudflare Blocking ChatGPT? How to Find and Fix It
description: Cloudflare blocking ChatGPT? Match what you see to the setting that fired, confirm it in Security Events, and apply the one fix that setting needs.
keyword: Cloudflare blocking ChatGPT
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

Cloudflare blocking ChatGPT usually traces back to one of seven settings in your own zone: Bot Fight Mode, Super Bot Fight Mode, an AI bot policy, a crawler set to Block in AI Crawl Control, a custom rule, a rate limiting rule, or Under Attack mode. To find the one that fired, open a blocked request in Security Events and read its Service field, then change that one setting.

The catch is that ChatGPT isn't one bot. OpenAI's [crawler page](https://developers.openai.com/api/docs/bots) lists `OAI-SearchBot` for ChatGPT search, `ChatGPT-User` for pages fetched when someone asks about them, and `GPTBot` for model training. A GPTBot block is often deliberate and doesn't touch search. The other two decide what ChatGPT can say about you. OpenAI's [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says a site is only eligible if its host or CDN lets OpenAI's published search bot addresses through.

This post is the diagnosis for Cloudflare blocking ChatGPT: the symptom, the setting behind it, and the fix. For why these blocks happen and the full firewall rulebook, read our [complete guide to the Cloudflare challenge trap](/blog/cloudflare-challenge-trap). If you already know you want an allow-list, our [plan-by-plan setup for letting ChatGPT's bots through](/blog/cloudflare-blocking-chatgpt) covers Free, Pro, Business and Enterprise.

## Key Takeaways

- Before you fix Cloudflare blocking ChatGPT, name the bot. A GPTBot block only affects training. An `OAI-SearchBot` or `ChatGPT-User` block affects what ChatGPT can read and cite.
- The Service field in Security Events names the feature that acted, such as Bot Fight Mode, Super Bot Fight Mode, Custom rules or Rate limiting rules.
- The evidence expires. Free and Pro plans keep Security Events for 24 hours, while Security Analytics covers all traffic, blocked or not, for 7 days.
- Zones added since 15 September 2026 block Agent bots such as `ChatGPT-User` on pages that show ads, unless someone changed the default.
- A 403 with Cloudflare branding came from Cloudflare. A plain 403 that never shows up in Security Events came from your own server.
- If Cloudflare blocking ChatGPT turns out to be Bot Fight Mode on the Free plan, no rule can skip it. The fix is to switch it off.

## Which ChatGPT Bot Is Failing?

When you suspect Cloudflare blocking ChatGPT, start with the bot, because each one costs you something different. Cloudflare's [bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/) files OpenAI's crawlers under different categories, and those categories decide which setting can catch them.

| OpenAI bot | Its job | Cloudflare category | What a block costs you |
| --- | --- | --- | --- |
| `OAI-SearchBot` | Crawls pages for ChatGPT search. | AI Search | Your pages leave ChatGPT's search answers, apart from bare navigational links. |
| `ChatGPT-User` | Fetches a page live when a question needs it. | AI Assistant | ChatGPT can't read the page a buyer asked about. |
| `GPTBot` | Gathers content that may train OpenAI's models. | AI Crawler | Nothing in search. This is often the block you meant to set. |
| `OAI-AdsBot` | Checks the landing pages of ChatGPT ads. | Not listed | Your ads can fail review. |

The last row matters if you advertise. OpenAI's [ad guidelines](https://help.openai.com/en/articles/20001212-create-ads-for-chatgpt) say landing pages must not block OAI-AdsBot or OAI-SearchBot.

Two checks rule out false alarms. First, robots.txt is not Cloudflare's firewall, and many sites turn bots away there on purpose. In Rankbox's [AI bot crawler census](/blog/ai-bot-crawler-census), 35.12% of news sites block ChatGPT-User in robots.txt and 28.78% block OAI-SearchBot. Test your file with our [robots.txt tester](/tools/robots-txt-tester). Second, Cloudflare's [managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) disallows GPTBot but doesn't list OAI-SearchBot or ChatGPT-User, so a lone GPTBot refusal may be working as designed.

### Tell a Cloudflare block from a server block

Cloudflare's [403 page](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-403/) says a 403 without Cloudflare branding comes from your origin, from things like `.htaccess` rules or mod_security. A branded 403 comes from Cloudflare itself.

- **Error 1020, Access denied:** a firewall rule blocked the request, per Cloudflare's [1020 page](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1020/).
- **Error 1015:** a rate limiting rule, per the [1015 page](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1015/).
- **Error 1010:** a banned "browser signature", which Cloudflare's [1010 page](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/) ties to Browser Integrity Check.
- **A 402:** pay per crawl, or an AI Crawl Control [block response](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/) set to 402.
- **A challenge page:** every Cloudflare challenge carries the header `cf-mitigated: challenge`, per its [detection docs](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/).

## How to Confirm Cloudflare Blocking ChatGPT in Your Dashboard

The fastest proof of Cloudflare blocking ChatGPT sits in screens every plan has. Work through these steps in one sitting.

1. **Open Security Events.** In the dashboard, go to the Analytics page and select the Events tab, as [Cloudflare's docs](https://developers.cloudflare.com/waf/analytics/security-events/) describe. Set the widest time range your plan allows.
2. **Narrow it to the bot.** In Top events by source, find a user agent that names `OAI-SearchBot` or `ChatGPT-User`, hover it and choose Filter. You can also filter by the path ChatGPT couldn't read.
3. **Read Events by service.** It lists each security feature that acted on the filtered traffic.
4. **Expand one event.** In Sampled logs, open a matching row and note the Action, the Service, the rule name, the path and the Ray ID. Choose Edit columns to keep User agent and Path on screen.
5. **If nothing shows, switch to Security Analytics.** It [shows all traffic](https://developers.cloudflare.com/waf/analytics/security-analytics/), including requests Cloudflare let through. Filter to the bot. Requests served by your origin with errors point to your server.
6. **Cross-check AI Crawl Control.** On the Crawlers tab, read the Action column for each OpenAI bot. The [Metrics tab](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/) charts status codes, and its 4xx line includes both 403 blocks and 402 payment requests.

### What the Service field tells you

| Service in the event | What it means | Where to change it |
| --- | --- | --- |
| Bot Fight Mode | The Free plan's bot defense challenged the bot. | Security Settings, filtered to Bot traffic. |
| Super Bot Fight Mode | A Pro or higher bot setting acted. | Security Settings, bot groupings. |
| Custom rules, rule named "AI Crawl Control" | Someone set this crawler to Block in AI Crawl Control. | AI Crawl Control, Crawlers tab. |
| Custom rules, any other name | A rule your team wrote caught the bot. | Security rules, filtered to Custom rules. |
| Rate limiting rules | The bot crossed a request limit. | Security rules, filtered to Rate limiting. |
| Managed rules | A WAF managed rule matched the request. | The rule ID in the event. |
| AI Labyrinth | Not a block. Cloudflare says these actions aren't mitigations. | Nothing to fix. |

Cloudflare's [AI Crawl Control guide](https://developers.cloudflare.com/ai-crawl-control/configuration/ai-crawl-control-with-waf/) says its blocks run as one custom rule called "AI Crawl Control," and that rules above it can block a bot you set to Allow without showing in its charts. Cloudflare doesn't document which Service label the Search, Agent and Training presets use, so if a label looks unfamiliar, read those presets directly.

### How long the evidence lasts

| Plan | Security Events | Security Analytics |
| --- | --- | --- |
| Free | 24 hours, sampled logs only | 7 days |
| Pro | 24 hours | 7 days |
| Business | 3 days | 31 days |
| Enterprise | 30 days | 90 days |

On Free and Pro, Monday's block is gone from Security Events by Wednesday, so start with Security Analytics when the trail looks cold.

## The ChatGPT Block Finder: Symptom, Cause, Fix

The ChatGPT block finder is our lookup table for Cloudflare blocking ChatGPT. Find the row that matches what you saw, confirm it, and apply only that fix. Changing several settings at once hides which one was the problem.

| What you see | Likely cause | Confirm it | Fix |
| --- | --- | --- | --- |
| Service says Bot Fight Mode, action is a challenge. | Bot Fight Mode on the Free plan. | Security Settings, Bot traffic. | Switch it off. [Cloudflare says](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/) no custom rule can skip it. |
| Service says Super Bot Fight Mode on an OpenAI bot. | Verified bots set to Block, or the bot wasn't seen as verified. | Security Settings, bot groupings. | Set Verified bots to Allow, or add a Skip rule. |
| `ChatGPT-User` fails only on pages with ads, and the zone was added after 15 September 2026. | The Agent preset's new default, Block on pages with ads. | Security Settings, Configure AI bot policies. | Set Agent to Allow. |
| `OAI-SearchBot`, Googlebot and Bingbot all fail. | The Search preset set to Block. | The same AI bot policies screen. | Set Search to Allow. |
| Bingbot fails but `OAI-SearchBot` works. | A Training block, including the new-zone default on ad pages, which now catches mixed-purpose crawlers. | The Training preset or the legacy Block AI bots toggle. | Allow Training and block trainers by name. |
| One OpenAI crawler fails everywhere, Action column says Block. | A per-crawler block in AI Crawl Control. | The custom rule named "AI Crawl Control." | Set that crawler to Allow. |
| Service says Custom rules with your own rule name. | A country, ASN or "non-browser" rule with no bot exception. | Security rules, Custom rules. | Add `and not cf.client.bot`, or a Skip rule above it. |
| 429 responses or error 1015 during crawl bursts. | A rate limiting rule. | Security rules, Rate limiting. | Add a condition that Verified Bot is false. |
| Every visitor sees an interstitial page. | Under Attack mode. | The zone overview's Quick Actions. | Turn it off, or scope it with a configuration rule. |
| Error 1010 or a Browser Integrity Check event. | A missing or unusual user agent. | Security Settings. | Skip Browser Integrity Check for that traffic. |
| An unbranded 403, and nothing in Security Events. | Your origin server or a plugin. | Server logs and security plugins. | Allow the bot at the origin. |

Three rows need a source. Cloudflare's [July 2026 announcement](https://blog.cloudflare.com/content-independence-day-ai-options/) names `ChatGPT-User` as an example of an Agent. Its [Block AI Bots page](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) says every Training block now also stops crawlers that mix search and training. And its [rate limiting docs](https://developers.cloudflare.com/waf/rate-limiting-rules/) warn that limiting verified bots can hurt SEO. For the rule syntax behind these fixes, see the [challenge trap guide](/blog/cloudflare-challenge-trap).

## Check That ChatGPT Can Read the Page Again

A fix for Cloudflare blocking ChatGPT only counts once a real OpenAI request gets through. A test from your laptop proves little, because your IP address isn't OpenAI's.

- **AI Crawl Control:** switch the Metrics tab to Allowed requests, which counts only 2xx responses, and filter to the bot you fixed.
- **Security Analytics:** filter to the bot's user agent and confirm its requests now show as served by Cloudflare or your origin, not mitigated.
- **Your own logs:** a day of access logs in our [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) shows each bot's hits and status codes, and nothing leaves your browser. Our guide to [tracking GPTBot and ClaudeBot](/blog/how-to-track-gptbot-and-claudebot) covers where each host keeps those logs.

Then ask ChatGPT to open and summarize one specific URL. If it still can't, go back to step 1 with a fresh time range. Cloudflare saw in [its August 2025 test](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) that ChatGPT's fetcher stopped at a block page and no other user agent tried again, so each failed ask is a lost read.

## Worked Example: Cloudflare Blocking ChatGPT on a Review Site

stackreview.co is a made-up software review site that runs display ads. It moved to Cloudflare Pro on 20 September 2026. A week later, ChatGPT tells the editor it can't open one of the site's reviews. The numbers are illustrative; the arithmetic is real.

Seven days of AI Crawl Control data show three problems:

| Crawler | Requests | Unsuccessful | What the logs show |
| --- | --- | --- | --- |
| `ChatGPT-User` | 1,480 | 1,020 | Failures only on review pages with ads |
| `OAI-SearchBot` | 2,300 | 210 | Service: Rate limiting rules, 429 responses |
| `GPTBot` | 900 | 900 | Custom rule "AI Crawl Control" |

The block finder splits this case of Cloudflare blocking ChatGPT into three causes:

1. **`ChatGPT-User`:** all 1,020 failures hit ad-carrying review pages, and the 460 requests to pages without ads worked. That's a success rate of 31.1% (460 ÷ 1,480). The zone is new, so this is the Agent default. The editor sets Agent to Allow.
2. **`OAI-SearchBot`:** 210 of 2,300 requests, 9.1%, tripped a rate limit written for scrapers. The team adds a Verified Bot exception to that rule.
3. **`GPTBot`:** blocked on purpose in AI Crawl Control. It stays that way.

The next week, `ChatGPT-User` made 1,390 requests and only 14 failed, all 404s from retired URLs. That's 1,376 of 1,390, or 99.0%. `OAI-SearchBot` made 2,410 requests with no 429s. The team redirects the dead URLs and moves on.

## Where Rankbox Fits Once ChatGPT Can Read Your Pages

Rankbox doesn't change Cloudflare settings, firewalls or robots.txt, and it doesn't track AI citations today. For access checks, use the free tools above or run a page through the [AI search readiness check](/tools/ai-search-readiness-check).

Unblocking only puts your pages back in the pool ChatGPT reads from. What it finds there is the next job. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, and the [Citation-Ready Writer](/features/citation-ready-writer) turns them into source-backed articles that reach your site through Rankbox's API. The Business plan is $49.50 a month: [see pricing](/pricing).

## Frequently Asked Questions

### Why is Cloudflare blocking ChatGPT but not Googlebot?

Because Cloudflare sorts them into different groups. Googlebot is a search engine crawler, while `ChatGPT-User` is an AI assistant, which the presets treat as an Agent. Since 15 September 2026, new zones block Agent bots on pages with ads by default.

### Is Cloudflare blocking ChatGPT by default now?

Partly. For domains added from 15 September 2026, Cloudflare blocks Agent bots such as `ChatGPT-User` on pages that display ads, and keeps Search bots such as `OAI-SearchBot` allowed. Older zones keep their own settings, but any Training block now also stops mixed-purpose crawlers like Bingbot.

### How can I tell if ChatGPT can access my site?

Check AI Crawl Control's Crawlers tab for `OAI-SearchBot` and `ChatGPT-User` and compare total with unsuccessful requests. Then filter Security Analytics to each bot's user agent, and ask ChatGPT to summarize one specific URL. If all three come back clean, Cloudflare isn't the problem.

### Does blocking GPTBot remove my site from ChatGPT?

No. OpenAI says its robots.txt settings are independent, so a site can block GPTBot from training and still allow OAI-SearchBot for search. The same logic holds in Cloudflare: GPTBot sits in the AI Crawler category, apart from the AI Search and AI Assistant bots that serve answers.

### What does Cloudflare error 1020 mean for ChatGPT?

It means a firewall rule denied the request. Search Security Events for the Ray ID or the time of the failure, open the event, and read the rule name. Then add a bot exception to that rule or move a Skip rule above it.

### How do I stop Cloudflare blocking ChatGPT on the Free plan?

Set the Search and Agent presets to Allow, set OpenAI's search and user bots to Allow in AI Crawl Control, and check that no custom or rate limiting rule catches them. If Security Events shows Bot Fight Mode acting on them, switch Bot Fight Mode off, since rules can't skip it. The [Free-plan section of our allow-list guide](/blog/cloudflare-blocking-chatgpt) has the steps.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
3. [Create ads for ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001212-create-ads-for-chatgpt)
4. [Security Events, Cloudflare Docs](https://developers.cloudflare.com/waf/analytics/security-events/)
5. [Security Analytics, Cloudflare Docs](https://developers.cloudflare.com/waf/analytics/security-analytics/)
6. [Bot Fight Mode, Cloudflare Docs](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
7. [Block AI Bots, Cloudflare Docs](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)
8. [AI Crawl Control with Cloudflare WAF, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/configuration/ai-crawl-control-with-waf/)
9. [Analyze AI traffic, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/)
10. [Bot reference, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
11. [Error 403, Cloudflare Docs](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-403/)
12. [Error 1020, Cloudflare Docs](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1020/)
13. [Rate limiting rules, Cloudflare Docs](https://developers.cloudflare.com/waf/rate-limiting-rules/)
14. [Managed robots.txt, Cloudflare Docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
15. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
16. [Perplexity is using stealth, undeclared crawlers to evade website no-crawl directives, Cloudflare](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/)
