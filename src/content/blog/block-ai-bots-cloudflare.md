---
title: How to Block AI Bots in Cloudflare Without Losing AI Search Traffic
description: Block AI bots that train on your content in Cloudflare while keeping AI search and assistant bots: the dashboard path for each step, a WAF rule, and log checks.
keyword: block AI bots
date: 2026-11-03
updated: 2026-11-03
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, AI Search
---

To block AI bots that train on your content without losing AI search traffic, set Cloudflare's Training control to Disallow AI Training and leave Search and Agent on Allow. Then block any extra training crawlers by name in AI Crawl Control, add one WAF rule for bots that ignore robots.txt, and check your logs: training bots should be refused while OAI-SearchBot, ChatGPT-User and Googlebot keep getting 200s.

The order matters because Cloudflare changed its controls on 15 September 2026. The obvious choice, Training on Block, now also [stops Googlebot, Bingbot and Applebot](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/), search included. Disallow AI Training is the setting built for this job.

This is the how-to. For what every setting does and a decision path by goal, read our [full guide to Cloudflare AI bot management](/blog/cloudflare-ai-bot-management). If a bot you want is hitting a challenge page, see [the Cloudflare challenge trap](/blog/cloudflare-challenge-trap) instead.

## Key Takeaways

- To block AI bots for training only, use Disallow AI Training. Training on Block also blocks Google, Bing and Apple search crawlers since 15 September 2026.
- Keep Search and Agent on Allow. Those controls cover OAI-SearchBot, Claude-SearchBot and the live fetchers that read pages for ChatGPT, Claude and Perplexity users.
- AI Crawl Control lets you block single crawlers by name on every plan. Each block joins one WAF rule named "AI Crawl Control."
- For crawlers that ignore robots.txt, find them in AI Crawl Control's Directives tab, then block them with a WAF custom rule.
- Verify with three sources: AI Crawl Control's status chart per crawler, Security Analytics for search engines, and your own server logs.

## Before You Start: Decide What You're Blocking

Most vendors now split their bots by job, so you can refuse training and stay in AI answers. Write your list down before you block AI bots in the dashboard. Our [AI crawler directory](/blog/ai-crawler-directory) has every user agent and IP list.

**Training bots you can block without losing AI search:**

- [GPTBot](/glossary/gptbot) (OpenAI). OpenAI's [crawler page](https://developers.openai.com/api/docs/bots) says each of its bot settings is independent, so blocking GPTBot leaves ChatGPT search alone.
- [ClaudeBot](/glossary/claudebot) (Anthropic), Meta-ExternalAgent (Meta) and Amazonbot (Amazon), which Cloudflare's Radar labels as Training.
- CCBot (Common Crawl) and Bytespider (ByteDance), both filed as "AI Crawler" in Cloudflare's [bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/).
- The tokens Google-Extended and Applebot-Extended, which never crawl. They tell Google and Apple how to use what Googlebot and Applebot fetch.

**Bots to keep, because they build AI answers:**

- OAI-SearchBot, Claude-SearchBot and [PerplexityBot](/glossary/perplexitybot), the AI search crawlers.
- ChatGPT-User, Claude-User and Perplexity-User, which read a page when someone asks about it.
- Googlebot, Bingbot and Applebot, which feed Google's AI features, Copilot and Siri as well as classic search.

## Step 1: Set the Three AI Bot Controls

This one screen does most of the work to block AI bots for training. It's on every plan, including Free.

1. Log in to the Cloudflare dashboard and select your domain.
2. Go to **Security Settings**. Filter by **Bot traffic** if the list is long.
3. Open **Configure AI bot policies**, the path Cloudflare's [Block AI Bots docs](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) give.
4. Set **Training** to **Disallow AI Training**.
5. Set **Search** to **Allow**.
6. Set **Agent** to **Allow**.
7. Save.

### Why Disallow AI Training, not Block

Cloudflare's [15 September post](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/) defines the two options differently:

| Training option         | Training-only crawlers (GPTBot, ClaudeBot) | Googlebot, Bingbot, Applebot        | robots.txt                               |
| ----------------------- | ------------------------------------------ | ----------------------------------- | ---------------------------------------- |
| Disallow AI Training    | Blocked                                    | Still crawl for search              | A no-training line is published          |
| Block on pages with ads | Blocked on ad pages                        | Blocked on ad pages                 | Not published                            |
| Block                   | Blocked                                    | Blocked everywhere, search included | Listed too, per Cloudflare's August post |

Disallow AI Training works because Cloudflare rates Apple, Google and Microsoft as "Accountable": they let you opt out of training without leaving search. Every other training crawler gets blocked at the edge.

### Check Agent if you used the old toggle

If your zone had the old Block AI bots switch on, Cloudflare's migration set Agent to **Block on pages with ads**. That setting stops ChatGPT-User and Claude-User on any page where Cloudflare detects ad code. If you want those pages read when buyers ask about them, change Agent to Allow.

## Step 2: Check the robots.txt Cloudflare Writes for You

Disallow AI Training publishes your choice in robots.txt through Bot Preference Sync, which Cloudflare [announced in August 2026](https://blog.cloudflare.com/bot-preference-sync/) for all plans. It adds its block to the top of any file you already serve.

1. Open `https://yourdomain.com/robots.txt` in a browser.
2. Look for the block that starts `# BEGIN Cloudflare Bot Preference Sync`. It should list training user agents with `Disallow: /`.
3. Make sure your own groups below it don't allow those same bots back in.
4. Run the file through our [robots.txt tester](/tools/robots-txt-tester) with GPTBot and with OAI-SearchBot as the user agent. GPTBot should come back blocked and OAI-SearchBot allowed.

If you turned the sync off, or write robots.txt yourself, add the training groups by hand. Our free [AI crawler robots.txt generator](/tools/ai-robots-txt-generator) builds a file that keeps search bots and lets you decide on training ones, and our [AI crawler robots.txt guide](/blog/ai-crawler-robots-txt-guide) has templates by goal.

### Two opt-outs with a cost

- **Google-Extended.** Google says it controls training and "grounding" in Gemini Apps, while having no effect on Google Search ranking. If you disallow it, expect your pages to be used less in Gemini app answers.
- **Bing.** Cloudflare says Disallow AI Training will pass a no-training preference to Bing through robots.txt once Microsoft adds support, targeted for early 2027. Bing's alternative is the NOARCHIVE tag, but its [webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) say NOARCHIVE "prevents content from being used in Copilot responses and grounding results." Skip it on pages you want quoted in Copilot.

## Step 3: Block Single Crawlers in AI Crawl Control

AI Crawl Control is where you block AI bots by name, on top of the Training control. It's on every plan.

1. Go to **AI Crawl Control** in your zone and open the **Crawlers** tab.
2. Find each training crawler on your list, such as Bytespider or CCBot, and set its **Action** to **Block**.
3. Scan the list for OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User, Claude-User and Perplexity-User. Each should read **Allow**.
4. On a paid plan, open the **Settings** tab and, under **Block response**, choose 403 Forbidden. The other choice, 402 Payment Required, tells crawlers they must pay.

Cloudflare's [management guide](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/) adds two details. On the Free plan, AI Crawl Control recognizes crawlers by user agent only. And every block you set joins a single WAF custom rule named "AI Crawl Control," which sits after your other custom rules. A Skip rule above it can let a blocked bot through, so keep "AI Crawler" out of any Skip rule.

## Step 4: Block AI Bots That Ignore robots.txt With a WAF Rule

robots.txt is a request, not a lock. To find bots that don't honor yours, open **AI Crawl Control**, then the **Directives** tab. Its robots.txt violations table lists each crawler that asked for a disallowed path, the path, and the exact line it broke. Cloudflare's [Directives docs](https://developers.cloudflare.com/ai-crawl-control/features/track-robots-txt/) warn that violations are checked against your current file, so a rule you just added flags older requests too.

When a name keeps showing up there, block it at the edge:

1. Go to **Security rules**, select **Create rule**, then **Custom rules**.
2. Name it, for example "Block training crawlers."
3. Select **Edit expression** and paste the rule below.
4. Set the action to **Block** and select **Deploy**.

```txt
(http.user_agent contains "Bytespider")
or (http.user_agent contains "CCBot")
or (cf.verified_bot_category eq "AI Crawler")
```

What each line does:

- **Line 1** catches ByteDance's crawler. Cloudflare's Radar listed ByteDance as unverified on 1 October 2026, and our AI crawler directory found no ByteDance documentation for it.
- **Line 2** names Common Crawl's bot, so it's blocked whichever category Cloudflare gives it.
- **Line 3** matches every bot Cloudflare has verified under the legacy "AI Crawler" category, which it defines as crawling "for content that is used for training AI models." That includes GPTBot, ClaudeBot, Meta-ExternalAgent and Amazonbot. It doesn't match "AI Search", "AI Assistant" or "Search Engine Crawler", so OAI-SearchBot, ChatGPT-User, Googlebot and Applebot pass untouched.

Four cautions before you deploy:

- **Case matters.** Cloudflare's [operators page](https://developers.cloudflare.com/ruleset-engine/rules-language/operators/) says string operators such as `contains` are case-sensitive, so type the names exactly.
- **Check for Vertex AI.** Google-CloudVertexBot is also filed as "AI Crawler." It only crawls sites whose owners asked for it. If you use Vertex AI Agents on your own site, change line 3 to `(cf.verified_bot_category eq "AI Crawler" and not http.user_agent contains "Google-CloudVertexBot")`.
- **Count your rules.** Free plans get [5 custom rules](https://developers.cloudflare.com/waf/custom-rules/), Pro 20 and Business 100. This one uses one.
- **Log is Enterprise-only.** Cloudflare offers the Log action on Enterprise, so on other plans deploy the rule and watch Security Events for the first hour.

We checked both versions of the expression with wirefilter, Cloudflare's open-source rules parser, and both parsed. We haven't run them on a live zone, so treat them as untested examples and confirm the result in Security Events.

## Step 5: Verify That You Block AI Bots and Keep Search

When you block AI bots, mistakes fail quietly in both directions, so check the result rather than trusting the settings screen. Your own laptop can't stand in for GPTBot, because your IP address isn't OpenAI's.

### The Keep-Search Check

The Keep-Search Check is our seven-line test for this setup. Run it a few days after the change, once real crawlers have visited. Every row should match.

| Bot                             | You want               | Where to look                                                                 |
| ------------------------------- | ---------------------- | ----------------------------------------------------------------------------- |
| GPTBot                          | Blocked (4xx)          | AI Crawl Control, Metrics tab, status code chart filtered to GPTBot           |
| ClaudeBot                       | Blocked (4xx)          | Same chart, filtered to ClaudeBot                                             |
| Bytespider, CCBot               | Blocked, if they visit | Security Events, your rule's name in the event details                        |
| OAI-SearchBot, Claude-SearchBot | 2xx                    | AI Crawl Control, Allowed requests view                                       |
| ChatGPT-User, Perplexity-User   | 2xx                    | AI Crawl Control, Allowed requests view                                       |
| Googlebot, Bingbot, Applebot    | 2xx                    | Security Analytics, filtered by user agent                                    |
| PerplexityBot                   | 2xx                    | Security Analytics; a challenge here means Bot Fight Mode or a rule caught it |

Cloudflare's [AI traffic docs](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/) say the Allowed requests view counts only 2xx responses, while the status chart's 4xx line includes 403 blocks and 402 payment requests. Free plans see 24 hours of crawler metrics, so check daily for the first week. Then confirm against your origin. A day of access logs in our [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) shows each bot's hits and status codes, and nothing leaves your browser.

### Worked example: Tallyfold's first week

Tallyfold is a made-up invoicing app for agencies that wanted to block AI bots for training only. These numbers are illustrative, but the arithmetic is real. After the five steps, its week in AI Crawl Control looked like this:

| Bot           | Requests | Allowed (2xx) | Share allowed |
| ------------- | -------- | ------------- | ------------- |
| GPTBot        | 3,200    | 0             | 0%            |
| ClaudeBot     | 1,800    | 0             | 0%            |
| OAI-SearchBot | 1,450    | 1,421         | 98.0%         |
| ChatGPT-User  | 620      | 614           | 99.0%         |

So 5,000 training requests were refused and 2,035 of 2,070 search and assistant requests got through, 98.3%. The 35 failures were 404s from old URLs. Security Analytics showed Googlebot at its usual volume, which confirms the Training control didn't touch search.

If a row fails, our guide to [why Cloudflare blocks ChatGPT](/blog/why-is-cloudflare-blocking-chatgpt) maps each symptom to the setting behind it.

## Where Rankbox Fits After the Block Is Live

Rankbox doesn't run a CDN or manage Cloudflare, firewalls or robots.txt for you, and it doesn't track AI citations today. Its free tools above help you check access. When you block AI bots for training and keep search open, the search side needs something worth citing. Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### Can I block AI bots on Cloudflare's free plan?

Yes. The Training, Search and Agent controls, Bot Preference Sync and AI Crawl Control all work on Free, and Free includes 5 custom rules for the WAF step. Free plans spot crawlers by user agent only and show 24 hours of crawler metrics, so check results daily.

### Does blocking AI bots in Cloudflare hurt SEO?

Not if you use Disallow AI Training. It keeps Googlebot, Bingbot and Applebot crawling for search. Training on Block is the risky choice, because since 15 September 2026 it blocks those crawlers too. Blocking GPTBot or ClaudeBot has no effect on Google rankings.

### What's the difference between Block and Disallow AI Training?

Disallow AI Training blocks training-only crawlers and publishes a no-training line in robots.txt, while letting Google, Bing and Apple crawl for search. Block stops every training crawler, including those three search engines. Use Disallow unless you want to leave their search results.

### Will blocking GPTBot remove my site from ChatGPT?

No. OpenAI says GPTBot and OAI-SearchBot settings are independent. ChatGPT search uses OAI-SearchBot, and live page reads use ChatGPT-User. Keep both allowed and you stay eligible for ChatGPT's answers while GPTBot is blocked.

### How do I block AI bots that ignore robots.txt?

Find them in AI Crawl Control's Directives tab, which lists crawlers that requested disallowed paths. Then set them to Block on the Crawlers tab, or write a WAF custom rule that matches their user agent with the Block action.

### Should I use NOARCHIVE to stop Bing's AI training?

Only on pages you don't need in Copilot. Bing says NOARCHIVE keeps content out of Copilot responses and grounding. Cloudflare's robots.txt preference won't reach Bing until Microsoft adds support, targeted for early 2027.

## References

1. [Have it both ways: stay discoverable in search while disallowing AI training, Cloudflare](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/)
2. [Say it once: introducing Bot Preference Sync, Cloudflare](https://blog.cloudflare.com/bot-preference-sync/)
3. [Block AI Bots, Cloudflare Docs](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)
4. [Manage AI crawlers, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/)
5. [Directives, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/track-robots-txt/)
6. [Analyze AI traffic, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/)
7. [Bot reference, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
8. [Operators and grouping symbols, Cloudflare Docs](https://developers.cloudflare.com/ruleset-engine/rules-language/operators/)
9. [Custom rules, Cloudflare Docs](https://developers.cloudflare.com/waf/custom-rules/)
10. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
11. [Bing Webmaster Guidelines, Microsoft](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
12. [Google's common crawlers, Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
