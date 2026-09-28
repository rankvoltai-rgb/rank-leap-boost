---
title: The Cloudflare Challenge Trap: Are You Silently Blocking ChatGPT from Recommending You?
description: Cloudflare bot settings can silently block ChatGPT and Perplexity. Audit Bot Fight Mode, AI bot policies and WAF rules, then let verified AI bots in.
keyword: Cloudflare
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

If your site runs behind Cloudflare, you may be blocking ChatGPT without knowing it. Bot Fight Mode, Super Bot Fight Mode, the AI bot defaults that took effect on 15 September 2026, and any firewall rule without a bot exception can stop `OAI-SearchBot` or `ChatGPT-User` at the edge. The request never reaches your server, nothing warns you, and ChatGPT answers your buyer from other people's pages.

That matters because of how much of the web sits there. Cloudflare says [more than 20% of web domains](https://blog.cloudflare.com/content-independence-day-ai-options/) are behind its network. The visits at stake are small but valuable. [Ahrefs reported](https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/) that over 30 days in mid-2025, AI search sent it 0.5% of its visits but 12.1% of its signups, most of them from ChatGPT. That's one company's data, but it shows why a silent block costs more than it looks.

This guide is the audit. It maps which Cloudflare settings stop which AI bots, shows you where a blocked bot appears in Security Events and AI Crawl Control, and gives you copy-paste custom rules that keep scrapers out while letting verified AI search bots in. For how ChatGPT search finds pages in the first place, see our [ChatGPT SEO guide](/ai-seo/chatgpt).

Two shorter guides answer the common questions: [why Cloudflare is blocking ChatGPT](/blog/why-is-cloudflare-blocking-chatgpt), symptom by symptom, and [how to let ChatGPT's bots through on each Cloudflare plan](/blog/cloudflare-blocking-chatgpt).

## Key Takeaways

- A blocked AI bot fails silently. Cloudflare stops the request at its edge, your origin logs show nothing, and Security Events keeps only 24 hours on the Free and Pro plans.
- Since 15 September 2026, new Cloudflare domains block Agent bots such as `ChatGPT-User` on pages that display ads. Search bots such as `OAI-SearchBot` stay allowed by default.
- Training blocks now reach further. Cloudflare says any Training block, including the legacy Block AI bots toggle, also stops mixed-purpose crawlers such as Googlebot and Bingbot, unless you opted out before 15 September.
- Bot Fight Mode on the Free plan can't be skipped with custom rules. If it challenges a bot you want, your options are IP Access rules, switching it off, or upgrading.
- Turnstile doesn't stop crawlers from reading a page. Challenge pages, Block actions, rate limits and Under Attack mode do.
- Custom rules have no Allow action. The Three-Lane Rulebook below lets AI search bots through with a Skip rule, matched on Cloudflare's verified-bot category or on user agent plus published IPs. It needs two rules and one IP list, so it fits the Free plan.

## What the Cloudflare Challenge Trap Looks Like From ChatGPT's Side

### The buyer's prompt

A buyer types "Compare Plannora vs Loopcraft for a 12-person agency" into ChatGPT. Plannora and Loopcraft are made-up brands. ChatGPT decides to search. OpenAI's [help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says it rewrites the prompt into targeted queries for its search partners, and it points to Microsoft's privacy statement for them. ChatGPT also surfaces sites that [OAI-SearchBot](/glossary/oai-searchbot) has crawled. And if the buyer asks about a specific page, `ChatGPT-User` may fetch it live.

Now suppose Plannora's Cloudflare zone challenges both bots. The answer might then read like this. It's an illustrative example, not a captured transcript:

> "I could not retrieve information for Plannora, but Loopcraft offers a Team plan with..."

### What happens when an AI bot hits a block

OpenAI doesn't publish what ChatGPT says when a page is blocked. Three primary sources do describe what the bots do:

- **ChatGPT walks away.** Cloudflare [tested ChatGPT in August 2025](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/). When it showed ChatGPT a block page, "they again stopped crawling," and no other user agent tried again.
- **Answers get built from other sites.** In the same post, once Cloudflare also blocked an undeclared crawler it tied to Perplexity, Perplexity fell back on "other data sources," including other websites. The answers "were less specific and lacked details from the original content."
- **Anthropic's bots won't fight a challenge.** Its [crawler page](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) says they "will not attempt to bypass CAPTCHAs."

So a blocked bot doesn't argue. It leaves, and the answer is written from whatever else the engine can read: a review site, an old forum thread, or your competitor's own comparison page.

### What the bot actually receives

A Block action returns a 403 with a Cloudflare error page. A rate limit returns a 429. A challenge swaps your page for Cloudflare's, and every [challenge response](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/) carries the header `cf-mitigated: challenge` and a `text/html` body, whatever was requested.

You can see one now, because chatgpt.com itself sits behind Cloudflare. On 28 September 2026, a plain `curl -sI https://chatgpt.com/` returned these lines, among others:

```http
HTTP/2 403
cf-mitigated: challenge
server: cloudflare
```

A browser usually passes that check on its own. A crawler that can't run the challenge gets this response and never sees the page. That's what your site looks like to `OAI-SearchBot` when a rule challenges it.

### Why nobody notices the block

- **Your server never sees the request.** Block and challenge are terminating actions, so the request stops at Cloudflare. Origin logs look normal.
- **The evidence expires.** [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/) keeps 24 hours on the Free and Pro plans, and the Free plan shows sampled logs only.
- **Nothing drops.** Referrals from ChatGPT don't fall, because a blocked page never earned any.
- **robots.txt looks fine.** A robots.txt check and a firewall are separate layers. Our [robots.txt tester](/tools/robots-txt-tester) can say "allowed" while Cloudflare blocks the same bot.

### Why teams set the trap in the first place

Blocking AI bots isn't irrational. Cloudflare [estimated for June 2025](https://blog.cloudflare.com/control-content-use-for-ai-training/) that Google crawled sites about 14 times per referral, OpenAI about 1,700 times and Anthropic about 73,000 times. In August 2025 it also accused Perplexity of stealth crawling, which Perplexity [denied](https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web), saying Cloudflare had misattributed a third-party browser service's traffic.

So blocking training crawlers is a fair business choice. The trap is blocking by broad category, by accident, and catching the search and assistant bots that build buyer answers. When your competitor's page is readable and yours isn't, that's revenue suicide in slow motion.

## Which Cloudflare Settings Block Which AI Bots

Cloudflare has many switches that touch AI bots. Some are obvious. Some changed on 15 September 2026 without you touching anything. We call the table below the Cloudflare collateral map: each setting, what it does to each class of bot, and how to carve out an exception.

The columns follow Cloudflare's [bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/), which files `OAI-SearchBot`, `PerplexityBot` and `Claude-SearchBot` as AI Search, and `ChatGPT-User`, `Perplexity-User` and `Claude-User` as AI Assistant. For every bot by name, see [AI crawlers](/glossary/ai-crawlers).

| Setting (plan) | AI search crawlers | AI assistants (live fetchers) | AI training crawlers (GPTBot, ClaudeBot, CCBot) | Googlebot, Bingbot, Applebot | How to exempt a bot |
| --- | --- | --- | --- | --- | --- |
| Bot Fight Mode (Free) | Verified: passes if its category is allowed. Unverified: challenged | Same | Same | Same | No Skip rules. IP Access rules, or switch it off |
| Super Bot Fight Mode: Definitely automated set to Block (Pro and up) | Verified bots follow their own setting. Unverified: blocked | Same | Same | Own setting | Skip rule: Super Bot Fight Mode |
| Super Bot Fight Mode: Verified bots set to Block | Blocked | Blocked | Blocked | Blocked | Set it back to Allow |
| AI bot policy: Search set to Block | Blocked | Not in this preset | Only mixed-purpose ones | Blocked (Search plus Training) | Set Search to Allow |
| AI bot policy: Agent, Block on pages with ads (new-domain default since 15 Sept 2026) | Allowed | Blocked on ad pages | Not in this preset | Not in this preset | Set Agent to Allow |
| AI bot policy: Training set to Block, or legacy Block AI bots | Allowed if search-only | Not in this preset | Blocked | Blocked since 15 Sept 2026 unless you opted out before | Block trainers by name in AI Crawl Control instead |
| AI Crawl Control: a crawler set to Block | Blocked if picked | Blocked if picked | Blocked if picked | Blocked if picked | Set it to Allow, then check rules above it |
| Custom rule with no bot exception (country, ASN, "non-browser") | Challenged or blocked | Same | Same | Same | Add `not cf.client.bot`, or a Skip rule above it |
| Rate limiting rule | 429 over the limit | 429 over the limit | 429 over the limit | 429; Cloudflare warns of SEO impact | Add a Verified Bot condition |
| Browser Integrity Check (on by default) | Not documented | Not documented | Not documented | Not documented | Skip rule: Browser Integrity Check |
| Under Attack mode | Challenge page; needs JavaScript | Same | Same | No bot exception documented | Scope it with a configuration rule |
| Turnstile widget on a form | Page still loads | Page still loads | Page still loads | Page still loads | Nothing to exempt |
| Managed robots.txt | Not disallowed in Cloudflare's sample | robots.txt may not apply | Disallowed | Googlebot not listed; Google-Extended disallowed | Edit it or turn it off |

"Not documented" means Cloudflare's docs don't say. Check Security Events for your own zone before you assume either way.

### Bot Fight Mode: the switch with no exceptions

[Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/) is the Free plan's bot defense. It challenges traffic that matches known bot patterns, which Cloudflare's plan page describes as simple bots from cloud hosting providers and headless browsers. AI bots come from cloud hosting too: a whois lookup on the first range in OpenAI's `searchbot.json` returns Microsoft, and Perplexity's ranges return Amazon EC2.

The catch is control. Bot Fight Mode runs outside Cloudflare's Ruleset Engine, so Skip rules have no effect on it. Cloudflare says verified bots used to be allowed by default, as Bot Fight Mode reflected. Since 1 July 2026, "Verified" only makes a bot allowable: your Search, Agent and Training choices decide whether it gets in. Anything Cloudflare doesn't verify can't be exempted with a custom rule.

The one documented escape is an IP Access rule, since Bot Fight Mode won't trigger when one matches first. But those rules take IPv4 ranges only as a /24 or /16, or single addresses. OpenAI's `searchbot.json` listed 39 ranges on 28 September 2026, mostly /28 and /25 blocks. Entered exactly, that's 2 ranges plus 2,048 single addresses, for one bot. If Security Events shows Bot Fight Mode hitting bots you want, the practical fixes are to switch it off or move to Pro.

### Super Bot Fight Mode: three groups, one dangerous switch

On Pro and above, [Super Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/) splits traffic into Definitely automated, Likely automated (Business and up) and Verified bots. Leave Verified bots on Allow. Set it to Block and you stop Googlebot and Bingbot along with every verified AI search bot. Unlike Bot Fight Mode, this one takes exceptions: custom rules run first, and a Skip rule can bypass it.

### The 15 September 2026 defaults

This is Cloudflare's second default change in 15 months. On 1 July 2025 it [switched its default](https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/) to blocking AI crawlers, and its [press release](https://www.cloudflare.com/press/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/) said every new domain would be asked at sign-up whether to allow them. The setting behind it, Block AI bots, covered training crawlers.

The [July 2026 update](https://blog.cloudflare.com/content-independence-day-ai-options/) replaced it with three presets: Search, Agent and Training. Under Security Settings, then Configure AI bot policies, each can be set to Block, Block on pages with ads, or Allow.

For domains added from 15 September 2026, Training and Agent are blocked by default on pages that display ads. Search stays allowed. Cloudflare's own example of an Agent is `ChatGPT-User`. So on a new zone, `OAI-SearchBot` can still crawl your ad-carrying pages, but `ChatGPT-User` can't fetch them live when a buyer asks about them.

How does Cloudflare know a page shows ads? Its [July 2025 write-up](https://blog.cloudflare.com/control-content-use-for-ai-training/) says it scans HTML for ad-unit code, using about 400 patterns from ad-blocker filter lists, and matches requests against hostnames it knows serve ads. If a page runs ad-network code, assume the Agent default can apply to it.

### Training blocks now reach Googlebot and Bingbot

Cloudflare's [Block AI Bots page](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/) says that from 15 September 2026, crawlers that combine Search and Training "will also be blocked by all configurations to block AI training, including the legacy 'Block AI bots' option." The July blog names Googlebot, Applebot and BingBot as examples. Customers could opt out up to 15 September.

If you switched on Block AI bots in 2025 to keep GPTBot out and didn't opt out, check Bingbot today. Bing's index grounds [Copilot](/ai-seo/copilot), and Microsoft is one of ChatGPT's search partners. The safer way to block training is by name: in [AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/), set GPTBot, ClaudeBot, CCBot and other trainers to Block one by one. Blocking [GPTBot](/glossary/gptbot) doesn't touch ChatGPT search.

### Challenges, Turnstile and Under Attack mode

People often say a bot "hit Turnstile." Strictly, Turnstile is a widget that runs on a page after the visitor has [already arrived](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/turnstile/). It gates actions like submitting a form. It doesn't stop a crawler from reading your pricing page.

What stops crawlers is a full-page challenge, served by a WAF rule, a bot setting, a rate limit or Under Attack mode. Under Attack mode shows a Managed Challenge to every visitor, and the page needs JavaScript to pass. Browser Integrity Check, on by default, challenges visitors with a missing or non-standard user agent. Cloudflare doesn't document how either treats verified AI bots.

## The 20-Minute Cloudflare Audit

Run these steps in one sitting. Security Events only keeps 24 hours on lower plans, so steps 4 and 5 need to happen on the same day.

1. **Write down your bot product.** Go to Security, then Settings, and filter by Bot traffic. Free plans have Bot Fight Mode. Pro and up have Super Bot Fight Mode. Note every switch that's on, then clear the filter and note Browser Integrity Check too.
2. **Read your AI bot policies.** On the same page, open Configure AI bot policies and note what Search, Agent and Training are set to. If Training is blocked, or the legacy Block AI bots toggle is on, add Googlebot and Bingbot to your checks in step 4.
3. **Open AI Crawl Control.** On the Crawlers tab, find `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot` and `Perplexity-User`. Check the Action column, and compare each bot's requests with its unsuccessful ones. On the Metrics tab, filter to one crawler and read the status code chart. A wall of 4xx means blocks or challenges, though 404s count too.
4. **Open Security Events.** Go to Security, then Analytics, and select the Events tab. In Sampled logs, choose Edit columns and add User agent and Path. Scan Top events by source for user agents that contain a bot name, then expand an event. Its Service field names the feature that acted, such as Bot Fight Mode, Super Bot Fight Mode, Custom rules or Rate limiting rules.
5. **Run the ask-and-watch test.** In ChatGPT, ask it to open one specific URL on your site and summarize it. Do the same in Perplexity. OpenAI says ChatGPT "may" fetch a page with `ChatGPT-User` when you ask. Within a few minutes, look for the fetch in Security Events and AI Crawl Control.
6. **Check the response headers.** Run the command below with a bot user agent. A `cf-mitigated: challenge` line, or a 403 from `server: cloudflare`, means Cloudflare stopped the request. Run it again without `-A` to see if the user agent is the trigger.
7. **Read your origin logs.** If they show zero `OAI-SearchBot` hits for weeks, something upstream is eating them. Our free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) counts each bot's hits and errors in your browser.

Here's the header check from step 6, using OpenAI's published `ChatGPT-User` string:

```bash
curl -s -o /dev/null -D - \
  -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot" \
  https://yoursite.com/pricing | grep -i -E "^(HTTP|server:|cf-mitigated)"
```

Read the result with care. Your laptop's IP isn't OpenAI's, so Cloudflare won't treat you as a verified bot. A clean result only proves that no rule blocks that user agent from your address. Once lane 2 of the rulebook below is live, this test should return a 403, because to Cloudflare you're an impostor. The real verdict comes from steps 3 to 5.

### What a blocked OAI-SearchBot looks like

In Sampled logs, a challenged `OAI-SearchBot` request looks like this once you expand it. The rule name is illustrative, since custom rule names are yours, and large volumes are sampled, so not every request appears:

```txt
Action:      Managed Challenge
Service:     Custom rules  (rule: "Challenge cloud ASNs")
User agent:  Mozilla/5.0 (...) compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot
Path:        /compare/loopcraft
```

A blocked `ChatGPT-User` looks the same, with `ChatGPT-User/1.0; +https://openai.com/bot` at the end of the user agent. In AI Crawl Control, both show up as unsuccessful requests. If the Action column there says Allow but requests still fail, Cloudflare's [AI Crawl Control guide](https://developers.cloudflare.com/ai-crawl-control/configuration/ai-crawl-control-with-waf/) points to rules that run before its own.

## The Three-Lane Rulebook for Cloudflare Custom Rules

The Three-Lane Rulebook is our method for blocking scrapers without blocking the bots that recommend you. Its logic fits in one line: let in by proof, block by claim, then defend against everything else.

- **Lane 1: let in by proof.** Skip your bot defenses for requests that Cloudflare has verified as AI search, AI assistant or search engine bots, or that pair a known user agent with the vendor's published IPs.
- **Lane 2: block by claim.** Block anything that claims to be one of those bots in its user agent but can't prove it.
- **Lane 3: everything else.** Your normal scraper defenses stay on for all remaining traffic.

Order matters. Cloudflare runs custom rules in order, and custom rules run [before rate limiting and Super Bot Fight Mode](https://developers.cloudflare.com/waf/feature-interoperability/). Put lane 1 at the top.

### Lane 1: Skip verified AI search and assistant bots

Create a custom rule, choose Edit expression, and paste:

```txt
(cf.verified_bot_category in {"AI Search" "AI Assistant" "Search Engine Crawler"})
or (ip.src in $ai_search_bots and (
  http.user_agent contains "OAI-SearchBot"
  or http.user_agent contains "ChatGPT-User"
  or http.user_agent contains "PerplexityBot"
  or http.user_agent contains "Perplexity-User"))
```

Set the action to Skip, and tick All remaining custom rules, All rate limiting rules, All Super Bot Fight Mode rules (Pro and up) and Browser Integrity Check. Leave managed rules running, and keep Log matching requests on so you can see the rule work.

Why two halves? `cf.verified_bot_category` only matches bots Cloudflare has verified, using the documented category strings. But Cloudflare keeps "AI Search" only for backward compatibility, and verified status can change. It removed Perplexity from its list in August 2025, and its docs don't say whether that status came back. The second half uses each vendor's published IP ranges, which don't depend on Cloudflare's verdict.

[Perplexity's own docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) recommend the same user agent plus IP pairing, but tell you to set the action to "Allow." Current custom rules [have no Allow action](https://developers.cloudflare.com/ruleset-engine/rules-language/actions/). Skip is the equivalent.

ChatGPT's cloud browser, formerly ChatGPT agent, signs its requests with Web Bot Auth. Cloudflare calls such bots signed agents, and since 1 July 2026 it [counts them as verified](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/). On Enterprise with Bot Management, you can also name it directly: OpenAI [lists its Cloudflare detection ID](https://help.openai.com/en/articles/11845367-chatgpt-agent-allowlisting) as 129220581. Add this line to lane 1:

```txt
or any(cf.bot_management.detection_ids[*] eq 129220581)
```

### Lane 2: Block impostors

Any client can send a famous bot's user agent, so rules that trust the name alone are easy to slip past. This rule blocks anyone who claims to be one of these four bots but isn't verified and isn't in the list:

```txt
(http.user_agent contains "OAI-SearchBot"
  or http.user_agent contains "ChatGPT-User"
  or http.user_agent contains "PerplexityBot"
  or http.user_agent contains "Perplexity-User")
and not cf.client.bot
and not ip.src in $ai_search_bots
```

Set the action to Block. One rule of thumb: only add a user agent to lane 2 after that vendor's IPs are in your list. Otherwise you'll block the real bot the day Cloudflare's verdict on it changes.

### Lane 3: Keep your scraper defenses

Lanes 1 and 2 only handle traffic that names a known bot. Everything else meets your normal defenses:

- **Pro and Business:** set Super Bot Fight Mode's Definitely automated to Managed Challenge or Block, Likely automated (Business) to Managed Challenge, and Verified bots to Allow.
- **Enterprise:** use Cloudflare's [bad-bots pattern](https://developers.cloudflare.com/waf/custom-rules/use-cases/challenge-bad-bots/), `(cf.bot_management.score lt 30 and not cf.bot_management.verified_bot)`, with a Managed Challenge.
- **Training crawlers:** block them by name in AI Crawl Control, not with the Training preset, to leave Googlebot and Bingbot alone.
- **Rate limits:** add a condition that Verified Bot is false. Cloudflare [warns](https://developers.cloudflare.com/waf/rate-limiting-rules/) that limiting verified bots can affect SEO.
- **Old custom rules:** add `and not cf.client.bot` to any rule that challenges by country or ASN, as Cloudflare's own [example](https://developers.cloudflare.com/waf/custom-rules/use-cases/allow-traffic-from-verified-bots/) does.

### Build and refresh the IP list

Create one [custom IP list](https://developers.cloudflare.com/waf/tools/lists/custom-lists/) named `ai_search_bots`. On 28 September 2026 the four vendor files held 39 ranges for `OAI-SearchBot`, 230 for `ChatGPT-User`, 8 for `PerplexityBot` and 4 for `Perplexity-User`. That's 281 items, well under the Free plan's 10,000.

The files change. The `creationTime` in `chatgpt-user.json` read 25 September 2026, so a list you typed by hand in August may already be stale. This script rebuilds the list from the source files through Cloudflare's Lists API, using an API token that can edit lists. Run it daily from any scheduler:

```bash
#!/usr/bin/env bash
# Rebuild the ai_search_bots list from the vendors' published IP files.
set -euo pipefail
for url in https://openai.com/searchbot.json \
           https://openai.com/chatgpt-user.json \
           https://www.perplexity.com/perplexitybot.json \
           https://www.perplexity.com/perplexity-user.json; do
  curl -sfL "$url"
done | jq -s '[.[].prefixes[] | {ip: (.ipv4Prefix // .ipv6Prefix)}]' > items.json

# An empty PUT deletes every item, so stop if nothing came back.
test "$(jq length items.json)" -gt 0

curl -sf -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/rules/lists/$LIST_ID/items" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data @items.json
```

If any file fails to download, the script stops before the upload, so a half-built list never replaces a good one. The PUT swaps in the whole list, dropping ranges a vendor has retired.

### The rulebook by Cloudflare plan

| Plan | Bot product | Rule budget | Lanes 1 and 2 | Lane 3 |
| --- | --- | --- | --- | --- |
| Free | Bot Fight Mode, no exceptions | 5 custom rules, 1 list, 1 rate limiting rule | Yes: 2 rules and the list | Keep Bot Fight Mode only if Security Events shows it isn't hitting bots you want |
| Pro | Super Bot Fight Mode | 20 custom rules, 10 lists, 2 rate limiting rules | Yes | Definitely automated on Managed Challenge |
| Business | Super Bot Fight Mode plus Likely automated | 100 custom rules, regex | Yes | Likely automated on Managed Challenge |
| Enterprise with Bot Management | Bot scores and detection IDs | 1,000 custom rules | Yes, plus the detection ID line | Score rule from Cloudflare's example |

### Mistakes that reopen the trap

- **Adding "AI Crawler" to lane 1.** AI Crawl Control enforces its blocks with a custom rule at the end of your list. A Skip rule above it for the AI Crawler category would let GPTBot straight past your own block. The same goes for any AI Assistant bot you block there: drop that category from lane 1 and name the bots you want instead.
- **Trusting a Skip rule to beat the presets.** Cloudflare doesn't document whether a Skip rule overrides the Search, Agent and Training presets. Set the preset itself.
- **Letting the list go stale.** New ranges from OpenAI or Perplexity fall into lane 2 until your list catches up. Automate the refresh.

## Worked Example: Plannora's Hidden Block

Plannora is a made-up project management tool on Cloudflare's Pro plan. The numbers are illustrative, but the arithmetic is real. The team runs the audit after a sales rep notices ChatGPT pointing prospects to Loopcraft's comparison page.

They find two settings, each reasonable on its own:

1. **A 2025 toggle.** Someone switched on Block AI bots to keep GPTBot out. Nobody opted out before 15 September, so it now blocks mixed-purpose crawlers too. Security Events shows Bingbot blocked.
2. **An incident rule.** During a scraping spike, an engineer added "Challenge cloud ASNs," a custom rule with a Managed Challenge and no bot exception.

AI Crawl Control shows seven days before the fix and seven days after:

| Crawler | Requests before | Unsuccessful before | Requests after | Unsuccessful after |
| --- | --- | --- | --- | --- |
| `OAI-SearchBot` | 1,240 | 1,240 | 1,310 | 26 |
| `ChatGPT-User` | 310 | 310 | 402 | 0 |
| `PerplexityBot` | 520 | 520 | 548 | 11 |
| `Perplexity-User` | 90 | 90 | 131 | 0 |
| **Total** | **2,160** | **2,160** | **2,391** | **37** |

Before the fix, 0 of 2,160 requests reached a page. After it, 2,354 of 2,391 did, about 98%. The 37 failures left are 404s from retired URLs, which the team redirects the same day.

The fix took four steps, in this order:

1. Add lane 1 at the top of the custom rules, then lane 2 below it.
2. Add `and not cf.client.bot` to "Challenge cloud ASNs," so it stops catching verified bots even if lane 1 is ever edited.
3. Set the Training preset to Allow, along with the legacy Block AI bots toggle where the zone still shows it, and block GPTBot, ClaudeBot and CCBot by name in AI Crawl Control.
4. Rerun the ask-and-watch test and confirm the live fetches in Security Events.

Unblocking doesn't win the recommendation on its own. It puts Plannora's pages back in the pool the answer is written from. What gets named after that is a content question: see [how to rank on ChatGPT](/blog/how-to-rank-on-chatgpt).

## Beyond Cloudflare: Vercel, AWS WAF, Akamai and Fastly

The same trap exists on other platforms, with different switches:

- **Vercel.** Its [Bot Protection ruleset](https://vercel.com/docs/bot-management) challenges non-browser traffic but skips verified bots. The AI Bots ruleset covers crawling "for training data, search purposes, or user-generated fetches," so Deny can block search bots like `OAI-SearchBot` too. Both are off by default.
- **AWS WAF.** In the [Bot Control rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html), the CategoryAI rule blocks by default and "applies the action to all matches, regardless of whether the bots are verified or unverified." Override that rule if you want AI search bots in.
- **Akamai.** On 3 September 2026, Akamai [split its AI Bots category](https://www.akamai.com/blog/security/introducing-more-granular-controls-ai-bot-traffic) into AI training crawlers, AI search crawlers and AI fetchers and agents. If your policy predates the split, check the action on each new category.
- **Fastly.** Its bot variables separate [AI crawlers](https://www.fastly.com/documentation/reference/vcl/variables/miscellaneous/fastly-bot-category-is-ai-crawler/) from AI fetchers, but it defines AI crawlers as bots for "building AI models or indexes." A rule on that flag alone can catch search indexers, so pair it with the verified-bot flag.

On any platform, the audit is the same: find the bot's requests in the firewall log, read which rule acted, then allow by proof, not by name. Our [two-engine site checklist](/blog/optimize-website-for-chatgpt-and-perplexity) covers the rest of the access work.

## Where Rankbox Fits Once the Door Is Open

Rankbox works on the other side of the firewall. It doesn't manage Cloudflare, your WAF or robots.txt, and it doesn't track AI citations today. For access checks, use the free tools linked above, or run a page through the [AI search readiness check](/tools/ai-search-readiness-check).

What Rankbox does is fill the pool you just reopened. Answer-Space Research maps the questions buyers ask ChatGPT, Perplexity and Google, like "Plannora vs Loopcraft for agencies." The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles of 2,000 to 3,500 words, which reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### Why is Cloudflare blocking ChatGPT from my site?

A bot setting or a rule is stopping ChatGPT's bots. Check four first: Bot Fight Mode, an AI bot policy such as the Agent block on ad pages for domains added since 15 September 2026, an AI Crawl Control block, or a custom or rate limiting rule with no bot exception. Find the request in Security Events by its user agent and read the Service field. It names the feature that acted.

### Does Cloudflare block OAI-SearchBot by default?

Not under its current defaults. The September 2026 defaults keep Search bots allowed, and Cloudflare files `OAI-SearchBot` under AI Search. It can still be stopped by Bot Fight Mode, a Verified bots block, a Search block you set, AI Crawl Control or a custom rule. `ChatGPT-User` is different: it's an Agent, blocked by default on ad pages of new domains.

### Can ChatGPT get past a Cloudflare challenge or Turnstile?

Don't count on getting past a challenge. A challenge page is built for browsers, and Under Attack mode needs JavaScript to pass. Cloudflare saw ChatGPT stop at a block page, and Anthropic says its bots won't try to bypass CAPTCHAs. Turnstile is different: it's a widget on a page that's already loaded, so it gates forms, not reading. Exempt the bots you want with a Skip rule.

### How do I allow ChatGPT on Cloudflare's free plan?

Set the Search and Agent policies to Allow, create one IP list from OpenAI's and Perplexity's published ranges, and add the lane 1 Skip rule and lane 2 Block rule. That uses two of your five custom rules and your one list. Bot Fight Mode can't be skipped, so if Security Events shows it hitting AI bots, switch it off.

### Why do I see a Cloudflare check when I open ChatGPT itself?

Because chatgpt.com also sits behind Cloudflare. A plain terminal request to it on 28 September 2026 returned a 403 with `cf-mitigated: challenge`, and a normal browser usually passes that check on its own. If ChatGPT and many other sites fail at once, suspect a Cloudflare outage, like the one on [18 November 2025](https://blog.cloudflare.com/18-november-2025-outage/), not your settings.

## References

1. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
2. [Content Independence Day: no AI crawl without compensation!, Cloudflare](https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/)
3. [Control content use for AI training with Cloudflare's managed robots.txt and blocking for monetized content, Cloudflare](https://blog.cloudflare.com/control-content-use-for-ai-training/)
4. [Perplexity is using stealth, undeclared crawlers to evade website no-crawl directives, Cloudflare](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/)
5. [Agents or Bots? Making Sense of AI on the Open Web, Perplexity](https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web)
6. [Bot Fight Mode, Cloudflare Docs](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
7. [Super Bot Fight Mode, Cloudflare Docs](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/)
8. [Block AI Bots, Cloudflare Docs](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)
9. [Verified bots, Cloudflare Docs](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)
10. [AI Crawl Control with Cloudflare WAF, Cloudflare Docs](https://developers.cloudflare.com/ai-crawl-control/configuration/ai-crawl-control-with-waf/)
11. [Security features interoperability, Cloudflare Docs](https://developers.cloudflare.com/waf/feature-interoperability/)
12. [Detect a Challenge Page response, Cloudflare Docs](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/)
13. [Security Events, Cloudflare Docs](https://developers.cloudflare.com/waf/analytics/security-events/)
14. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
15. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
16. [ChatGPT Work's Cloud browser allowlisting, OpenAI Help Center](https://help.openai.com/en/articles/11845367-chatgpt-agent-allowlisting)
17. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
18. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
19. [AWS WAF Bot Control rule group, AWS](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html)
20. [Does AI search traffic convert better than traditional search?, Ahrefs](https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/)
