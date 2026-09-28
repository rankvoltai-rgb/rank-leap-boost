---
title: Cloudflare Blocking ChatGPT: How to Let ChatGPT's Bots Through on Any Plan
description: Stop Cloudflare blocking ChatGPT on Free, Pro, Business or Enterprise. Allow OAI-SearchBot and ChatGPT-User in each setting, then prove it works.
keyword: Cloudflare blocking ChatGPT
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

To stop Cloudflare blocking ChatGPT, allow OpenAI's two answer bots, `OAI-SearchBot` and `ChatGPT-User`, in every feature that can turn them away: the AI bot policies, AI Crawl Control, your bot product and your own rules. The first two work the same on every plan. What changes by plan is the bot product: on Free you can only switch Bot Fight Mode off, Pro and Business take a Skip rule, and Enterprise can match OpenAI's bots by detection ID.

Why fix Cloudflare blocking ChatGPT at all? OpenAI's [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says a site is only eligible for ChatGPT search if its host or CDN lets OpenAI's published search bot addresses in. And Cloudflare changed its defaults on 15 September 2026, so a zone you add today blocks `ChatGPT-User` on pages that show ads unless you say otherwise.

This guide is the setup, plan by plan. If you're not sure what is failing yet, start with [our diagnosis guide to why Cloudflare blocks ChatGPT](/blog/why-is-cloudflare-blocking-chatgpt). For the full three-lane rulebook, with an IP list and a rule that blocks impostors, see our [Cloudflare challenge trap guide](/blog/cloudflare-challenge-trap).

## Key Takeaways

- Allow `OAI-SearchBot` and `ChatGPT-User`. You can still block `GPTBot`, OpenAI's training crawler, without leaving ChatGPT search.
- On every plan, the first cure for Cloudflare blocking ChatGPT is the same: set the Search and Agent presets to Allow, and set both OpenAI bots to Allow in AI Crawl Control.
- Free: Bot Fight Mode can't be skipped by any rule. If it acts on OpenAI's bots, switch it off.
- Pro and Business: one Skip rule at the top of your custom rules exempts verified OpenAI bots from Super Bot Fight Mode, rate limits and your other rules.
- Enterprise with Bot Management: match OpenAI's documented detection IDs instead of user agents.
- Don't block training with the Training preset. Since 15 September 2026 it also stops Googlebot and Bingbot.

## What to Allow, and What You Can Keep Blocking

OpenAI lists four bots on its [crawler page](https://developers.openai.com/api/docs/bots). Only two of them build ChatGPT's answers, so the allow-list that ends Cloudflare blocking ChatGPT can be short.

| Bot | Allow it? | Why |
| --- | --- | --- |
| `OAI-SearchBot` | Yes | It crawls pages for ChatGPT search ([what OAI-SearchBot does](/blog/what-is-oai-searchbot)). Cloudflare files it as AI Search. |
| `ChatGPT-User` | Yes | It reads a page live when a user's question needs it. Cloudflare files it as AI Assistant. |
| `OAI-AdsBot` | Only if you buy ChatGPT ads | OpenAI's [ad rules](https://help.openai.com/en/articles/20001212-create-ads-for-chatgpt) say landing pages must not block it. |
| `GPTBot` | Your choice | It gathers training data. OpenAI says its settings are independent of search. |

The categories come from Cloudflare's [bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/), and they matter because each Cloudflare preset acts on categories, not on names.

## Step 1: The Settings Every Plan Shares

These four changes take ten minutes and fix most cases of Cloudflare blocking ChatGPT, whatever you pay.

### Set the AI bot policies

Go to Security Settings, then Configure AI bot policies. Cloudflare's [Block AI Bots page](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) lists three presets, Search, Agent and Training, each with Block, Block on pages with ads, or Allow.

1. **Search:** set it to Allow. This covers `OAI-SearchBot`.
2. **Agent:** set it to Allow. Cloudflare's [July 2026 post](https://blog.cloudflare.com/content-independence-day-ai-options/) names `ChatGPT-User` as an example of an Agent. New zones start at Block on pages with ads.
3. **Training:** set it to Allow unless you accept the side effect. Cloudflare says any Training block now also stops crawlers that mix search and training, and it names Googlebot, Applebot and BingBot. New zones start at Block on pages with ads, so check this one too.

The same post explains why the presets come first. Cloudflare used to let every verified bot through by default. Now "Verified" only makes a bot allowable, and your Search and Agent choices decide whether it gets in.

### Set each OpenAI crawler in AI Crawl Control

[AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/) is on every plan. Open its Crawlers tab and set `OAI-SearchBot` and `ChatGPT-User` to Allow. If you want to refuse training, set `GPTBot` to Block here instead of using the Training preset. That blocks one crawler by name and leaves Googlebot and Bingbot alone.

Cloudflare enforces these blocks with a single custom rule named "AI Crawl Control," placed after your other custom rules. On the Free plan it spots crawlers by user agent only.

### Give rate limits and old rules a bot exception

- **Rate limiting rules:** every plan can use the Verified Bot field, per Cloudflare's [rate limiting docs](https://developers.cloudflare.com/waf/rate-limiting-rules/). Add a condition that Verified Bot is false, so crawl bursts from OpenAI don't trip a limit meant for scrapers.
- **Custom rules that block or challenge by country, ASN or path:** add `and not cf.client.bot`. In the dashboard builder the field is called Known Bots, as in Cloudflare's [own example](https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-verified-bots/).

### Check Browser Integrity Check and Under Attack mode

Browser Integrity Check is on by default and challenges visitors with a missing or unusual user agent. Under Attack mode puts a JavaScript check in front of every page. If Security Events shows either one acting on OpenAI's bots, skip Browser Integrity Check for them with the rule below, and switch Under Attack mode off once an incident ends.

## Step 2: Plan-by-Plan Setup to Stop Cloudflare Blocking ChatGPT

The bot product is where plans differ most, so it's where the allow-list differs too.

| Plan | Bot product | Can a Skip rule bypass it? | Custom rules | Rate limiting rules | Best way to let OpenAI through |
| --- | --- | --- | --- | --- | --- |
| Free | Bot Fight Mode | No | 5 | 1 | Presets on Allow; switch Bot Fight Mode off if it acts. |
| Pro | Super Bot Fight Mode | Yes | 20 | 2 | Verified bots on Allow, plus one Skip rule. |
| Business | Super Bot Fight Mode with Likely automated | Yes | 100, regex allowed | 5 | Same as Pro. |
| Enterprise with Bot Management | Bot Management | Custom rules run first | 1,000 | 100 | A Skip rule on OpenAI's detection IDs. |

Rule counts come from Cloudflare's pages on [custom rules](https://developers.cloudflare.com/waf/custom-rules/) and rate limiting. Enterprise zones without Bot Management get the Business setup.

### Free plan

Once the presets are fixed, the usual cause of Cloudflare blocking ChatGPT on Free is [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/). It runs outside Cloudflare's rules engine, so a Skip rule has no effect on it. Set the presets and AI Crawl Control first. Then check Security Events. If you still see Bot Fight Mode challenging `OAI-SearchBot` or `ChatGPT-User`, turn it off under Security Settings, filtered to Bot traffic.

The only other escape is an IP Access rule, because Bot Fight Mode won't trigger when one matches first. It's rarely worth it. Those rules take IPv4 ranges only as a /16 or /24, or single addresses, and an [Allow match](https://developers.cloudflare.com/waf/tools/ip-access-rules/) also bypasses your custom rules, rate limits and managed rules without showing in Security Events. On 28 September 2026, OpenAI's [search bot file](https://openai.com/searchbot.json) held 39 ranges, which come to 2,050 entries in that format. Its [ChatGPT-User file](https://openai.com/chatgpt-user.json) held 230 ranges, which come to 3,792. That's 5,842 rules for two bots, from files that change. The user file was regenerated on 25 September.

You can still add the Skip rule below on Free. It uses one of your five custom rules and exempts OpenAI's bots from your other rules, your rate limit and Browser Integrity Check.

### Pro plan

On Pro, Cloudflare blocking ChatGPT usually means a Verified bots setting of Block or a scraper rule with no exception. Open Security Settings, filter to Bot traffic, and open [Super Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/). Leave Verified bots on Allow. Definitely automated can stay on Block or Managed Challenge for scrapers. Cloudflare runs custom rules before Super Bot Fight Mode, so the Skip rule below, placed first, carves out OpenAI's bots. Pro allows 20 custom rules and 10 lists.

### Business plan

Business adds a Likely automated group, which catches more sophisticated bots. Treat it like Definitely automated: challenge it, and rely on the Skip rule for OpenAI. Business also allows regex in rules, 100 custom rules, and rate limiting rules that can match on the user agent. Security Events keeps 3 days of history instead of 24 hours, which makes the final check easier.

### Enterprise plan

With [Bot Management](https://developers.cloudflare.com/bots/get-started/bot-management/), Cloudflare scores every request from 1 to 99 and replaces Super Bot Fight Mode. Its rule templates already exclude verified bots. For an exact allow-list, match the detection IDs in Cloudflare's bot reference: `126255384` and `33563986` for `OAI-SearchBot`, `132995013` and `33563857` for `ChatGPT-User`. Use this as the expression of a Skip rule at the top of your custom rules:

```txt
any(cf.bot_management.detection_ids[*] eq 126255384)
or any(cf.bot_management.detection_ids[*] eq 33563986)
or any(cf.bot_management.detection_ids[*] eq 132995013)
or any(cf.bot_management.detection_ids[*] eq 33563857)
```

If your team uses ChatGPT's cloud browser on your site, OpenAI's [allowlisting page](https://help.openai.com/en/articles/11845367-chatgpt-agent-allowlisting) gives its Cloudflare detection ID as `129220581`, shown as ChatGPT Operator in the picker.

## The Skip Rule for Free, Pro and Business

This single rule ends most Cloudflare blocking ChatGPT on plans without Bot Management. It matches a request only when Cloudflare has verified it as a known bot and its user agent names one of OpenAI's two answer bots.

```txt
(cf.client.bot and (http.user_agent contains "OAI-SearchBot"
  or http.user_agent contains "ChatGPT-User"))
```

1. Go to Security rules, choose Create rule, then Custom rules, and paste the expression.
2. Set the action to Skip. Tick All remaining custom rules, All rate limiting rules and, on Pro and up, All Super Bot Fight Mode rules. Add Browser Integrity Check if it acted on these bots.
3. Leave Log matching requests on. Cloudflare's [skip options](https://developers.cloudflare.com/waf/custom-rules/skip/options/) say it's on by default, and it's how you'll confirm the rule works.
4. Drag the rule to the top of the list and deploy.

Three notes keep it safe. The `contains` operator is case-sensitive, so type the names exactly. A fake request that copies OpenAI's user agent fails `cf.client.bot`, so impostors don't get the skip. And Cloudflare doesn't document whether a Skip rule overrides the Search, Agent and Training presets, which is why Step 1 sets them directly. If a real OpenAI request doesn't match, Cloudflare may not treat it as verified. The [challenge trap guide](/blog/cloudflare-challenge-trap) has a version that also matches OpenAI's published IP ranges.

## The ChatGPT Allow-List Checklist

Our allow-list checklist puts the fix for Cloudflare blocking ChatGPT on one card. Tick each row for your plan, then run the test at the bottom.

| Step | Free | Pro | Business | Enterprise with Bot Management |
| --- | --- | --- | --- | --- |
| Search and Agent presets on Allow | Yes | Yes | Yes | Yes |
| `OAI-SearchBot` and `ChatGPT-User` on Allow in AI Crawl Control | Yes | Yes | Yes | Yes |
| Block `GPTBot` by name, not with Training (optional) | Yes | Yes | Yes | Yes |
| Verified Bot exception on rate limits | Yes | Yes | Yes | Yes |
| `not cf.client.bot` on country or ASN rules | Yes | Yes | Yes | Yes |
| Bot Fight Mode off if it acts on OpenAI | Yes | n/a | n/a | n/a |
| Verified bots on Allow | n/a | Yes | Yes | n/a |
| Skip rule at the top | User agent version | User agent version | User agent version | Detection ID version |
| Security Events history for the check | 24 hours | 24 hours | 3 days | 30 days |

To test, wait for real traffic. In Security Events, look for events from your Skip rule. Skip rules log each match by default, so each one is an OpenAI request that got through. On the AI Crawl Control Metrics tab, the Allowed requests view counts only 2xx responses. If Cloudflare blocking ChatGPT continues, our [diagnosis guide](/blog/why-is-cloudflare-blocking-chatgpt) maps each symptom to the setting behind it. A test from your own laptop won't tell you much, because your IP address isn't OpenAI's.

## Where Rankbox Fits After You Open the Door

Rankbox doesn't manage Cloudflare, firewalls or robots.txt for you, and it doesn't track AI citations today. For the access side, use our free [robots.txt tester](/tools/robots-txt-tester) and [AI crawler log analyzer](/tools/ai-crawler-log-analyzer).

Once ChatGPT can read your site, the question is what it finds. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, and the [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles on them, which reach your site through Rankbox's API. See [plans and pricing](/pricing).

## Frequently Asked Questions

### How do I whitelist ChatGPT in Cloudflare?

Set the Search and Agent presets to Allow, set `OAI-SearchBot` and `ChatGPT-User` to Allow in AI Crawl Control, and add a Skip rule for verified requests that name those bots. On Enterprise with Bot Management, match their detection IDs instead. Cloudflare's current custom rules have no Allow action, so Skip does the job.

### Should I allow GPTBot too?

Only if you're happy for your content to be used for training. GPTBot doesn't power ChatGPT search, and OpenAI says each bot's setting is independent. To refuse it without side effects, block it by name in AI Crawl Control rather than with the Training preset, which also blocks Googlebot and Bingbot.

### Does Cloudflare's free plan let ChatGPT crawl my site?

Yes, if you set it up. On Free, set Search and Agent to Allow and allow OpenAI's bots in AI Crawl Control. Bot Fight Mode is the weak spot: no rule can skip it, so if Security Events shows it challenging OpenAI's bots, turn it off.

### Can I stop Cloudflare blocking ChatGPT without allowing every AI bot?

Yes. The presets act on whole categories, but AI Crawl Control works per crawler. Allow Search and Agent, then set any crawler you don't want, such as `GPTBot` or another vendor's trainer, to Block by name. The Skip rule in this guide only matches OpenAI's two answer bots.

### Will allowing ChatGPT-User let scrapers in?

Not with this setup. Anyone can copy OpenAI's user agent, but the Skip rule also requires `cf.client.bot`, which is only true for bots Cloudflare has verified. A scraper using the name fails that check and still meets your other defenses.

### How long after fixing Cloudflare blocking ChatGPT will ChatGPT see my site?

Access changes at once, but OpenAI doesn't publish a recrawl schedule. For robots.txt changes, it says its search systems adjust in about 24 hours. `ChatGPT-User` fetches pages when people ask, so you may see it within hours of the fix.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
3. [ChatGPT Work's Cloud browser allowlisting, OpenAI Help Center](https://help.openai.com/en/articles/11845367-chatgpt-agent-allowlisting)
4. [Create ads for ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001212-create-ads-for-chatgpt)
5. [Block AI Bots, Cloudflare Docs](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)
6. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
7. [Manage AI crawlers, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/)
8. [Bot reference, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
9. [Bot Fight Mode, Cloudflare Docs](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
10. [Super Bot Fight Mode, Cloudflare Docs](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/)
11. [Bot Management, Cloudflare Docs](https://developers.cloudflare.com/bots/get-started/bot-management/)
12. [Custom rules, Cloudflare Docs](https://developers.cloudflare.com/waf/custom-rules/)
13. [Available skip options, Cloudflare Docs](https://developers.cloudflare.com/waf/custom-rules/skip/options/)
14. [Rate limiting rules, Cloudflare Docs](https://developers.cloudflare.com/waf/rate-limiting-rules/)
15. [IP Access rules parameters, Cloudflare Docs](https://developers.cloudflare.com/waf/tools/ip-access-rules/parameters/)
16. [Allow traffic from search engine bots, Cloudflare Docs](https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-verified-bots/)
