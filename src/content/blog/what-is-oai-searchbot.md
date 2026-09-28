---
title: OAI-SearchBot: What It Is and How to Allow or Block It
description: OAI-SearchBot is OpenAI's crawler for ChatGPT search. Its user agent, IP list and robots.txt effects, how it differs from GPTBot, and how to allow or block it.
keyword: OAI-SearchBot
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

OAI-SearchBot is OpenAI's search crawler: it fetches web pages so ChatGPT's search features can show and link them. Allow it in robots.txt and let its published IP addresses through your CDN if you want ChatGPT search to cite you. Block it, and OpenAI says your pages "will not be shown in ChatGPT search answers, though can still appear as navigational links."

It is not the bot that trains OpenAI's models. That's GPTBot, and OpenAI treats the two as separate switches. So the most common question about OAI-SearchBot has a simple answer: you can refuse training and still stay in ChatGPT search. Our [AI crawler directory](/blog/ai-crawler-directory) lists the equivalent bots from every other AI vendor.

Most sites leave it open. In Rankbox's [AI bot crawler census](/blog/ai-bot-crawler-census), 3.66% of all sites checked fully block OAI-SearchBot in robots.txt, rising to 28.78% among the top 500 news and media sites. This guide covers what OpenAI documents about the bot, how it compares with OpenAI's other bots, how to allow or block it, and how to confirm it in your logs.

## Key Takeaways

- OAI-SearchBot decides whether ChatGPT search can show your pages. OpenAI recommends allowing it in robots.txt and allowing its IPs, listed at `openai.com/searchbot.json`.
- OpenAI says each bot setting "is independent of the others." Blocking GPTBot opts you out of training without touching search.
- A block isn't total. Blocked sites can still appear as navigational links, and ChatGPT Atlas may show a blocked page's link and title. OpenAI's fix for the Atlas case is a `noindex` tag, which the bot must be allowed to read.
- Changes take about 24 hours. OpenAI gives that figure for robots.txt updates to reach its search systems.
- In the census, 53.0% of sites that block GPTBot keep OAI-SearchBot open. Only 8 of 13,359 sites do the reverse.

## What OAI-SearchBot Does, According to OpenAI

OpenAI's [crawler page](https://developers.openai.com/api/docs/bots) gives the bot one job: "OAI-SearchBot is used to surface websites in search results in ChatGPT's search features." Its [ChatGPT search help article](https://help.openai.com/en/articles/9237897-chatgpt-search) adds the eligibility rule: "allow OAI-Searchbot to crawl the site and confirm that the website host or content delivery network allows traffic from OpenAI's published searchbot IP addresses."

Two things follow. First, being crawlable makes you eligible, not ranked. OpenAI says "Placement is not guaranteed." Second, OAI-SearchBot isn't ChatGPT's only source. The same help article says ChatGPT search "sometimes partners with other search providers," and its privacy links name Microsoft and Shopify. OpenAI's own crawl is still the one part of that pipeline you control directly.

### The user agent, and its robots.txt variant

As of September 2026, OpenAI prints this example, noting that "the version number may change":

```text
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot
```

When it fetches your robots.txt file, the bot may add a marker: `...; OAI-SearchBot/1.4; robots.txt; +https://openai.com/searchbot`. OpenAI says the marker helps "especially when their logs do not include paths." Unlike GPTBot's string, this one starts with a full Chrome-on-macOS prefix. So any rule should match the token `OAI-SearchBot`, not the browser part, or you'll catch real people.

### The IP list

OpenAI publishes the bot's addresses at [openai.com/searchbot.json](https://openai.com/searchbot.json). On 28 September 2026 the file held 39 IPv4 ranges, with a `creationTime` of 2 January 2026, and no IPv6. Reverse DNS on the addresses checked from that list returned no hostname, so the list is your only proof that a request came from OpenAI.

OpenAI runs an RSS feed for changes to the crawler page. Subscribe to it if you allowlist these IPs anywhere.

## OAI-SearchBot vs GPTBot vs ChatGPT-User

OpenAI runs four named bots. Each has its own IP list and its own robots.txt behavior:

| Bot | What OpenAI says it does | robots.txt | CDN category |
| --- | --- | --- | --- |
| `OAI-SearchBot` | Surfaces websites in ChatGPT search results | Yes; changes take ~24 hours | Cloudflare: AI Search |
| `GPTBot` | Crawls content "that may be used in training" | Yes | Cloudflare: AI Crawler |
| `ChatGPT-User` | Visits a page when a ChatGPT or Custom GPT user asks | "May not apply" | Cloudflare: AI Assistant |
| `OAI-AdsBot` | Checks landing pages submitted as ChatGPT ads | Not stated | Not listed |

The categories come from [Cloudflare's bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/), and they matter more than they look. From 15 September 2026, [Cloudflare's new defaults](https://blog.cloudflare.com/content-independence-day-ai-options/) block Training and Agent bots on ad-carrying pages of new domains, while "Search will remain allowed by default." Its example of an Agent bot is ChatGPT-User. So a new Cloudflare site keeps OAI-SearchBot by default but can lose ChatGPT-User on pages with ads.

Other vendors split their bots the same way, and the [directory's side-by-side table](/blog/ai-crawler-directory) lines them up. OpenAI also says ChatGPT-User "is not used to determine whether content may appear in Search." If you want out of ChatGPT search, the ChatGPT-User line won't do it. Use the OAI-SearchBot line.

One more point on load. When you allow both GPTBot and OAI-SearchBot, OpenAI says it "may use the results from just one crawl for both use cases." Allowing both doesn't mean twice the traffic.

### The OpenAI Bot Switchboard

Pick your goal, then set the three switches. The last column is what OpenAI's docs say happens.

| Your goal | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` | Result, per OpenAI |
| --- | --- | --- | --- | --- |
| In ChatGPT search, out of training | Disallow | Allow | Allow | Eligible for search; content "should not be used in training" |
| Fully open | Allow | Allow | Allow | Eligible for search; one crawl may serve both jobs |
| Out of search, open to training | Allow | Disallow | Allow | Not shown in search answers; navigational links possible |
| Out of search and training | Disallow | Disallow | Firewall block | Not in answers; links and Atlas titles still possible |
| Keep specific pages fully out | Your call | Allow, plus `noindex` on those pages | Firewall block | The tag stops Atlas showing even the link and title |

Row four surprises people. A robots.txt block can't hide a page completely, because OpenAI can learn its URL elsewhere. Its [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) says that for a disallowed page found through "a third-party search provider or by crawling other pages," ChatGPT Atlas "may surface just the link and page title." The fix is row five: the `noindex` meta tag. But "in order for our crawler to read a meta tag, it must be allowed to crawl the relevant page(s)."

The ChatGPT-User column says "firewall block" because OpenAI says robots.txt "may not apply" to it. A robots.txt line for it is a preference, not a lock.

## How to Allow OAI-SearchBot

Allowing it takes two layers. robots.txt says yes, and your host or CDN has to let the request through.

1. **Give it a named group.** Under [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.txt), a crawler follows the group that names it and ignores the `*` group. A named group protects the bot if someone later adds `Disallow: /` under `*`. Repeat any private paths, since the `*` rules no longer apply to it:

```robots.txt
User-agent: OAI-SearchBot
Disallow: /account/

User-agent: GPTBot
Disallow: /

User-agent: *
Disallow: /account/
```

2. **Check the CDN and firewall.** Bot-fight modes, challenge pages and rate limits run before robots.txt matters. On Cloudflare, check AI Crawl Control and Security Events for 403s or challenges on the token. Our guide to [letting ChatGPT's bots through Cloudflare on any plan](/blog/cloudflare-blocking-chatgpt) covers each setting. On Vercel, OAI-SearchBot is in the [verified bots directory](https://vercel.com/docs/bot-management), which bot protection lets through without a challenge.
3. **Serve the answer in HTML.** In [Vercel's December 2024 study](https://vercel.com/blog/the-rise-of-the-ai-crawler), none of the major AI crawlers rendered JavaScript, OAI-SearchBot included. Text your page builds in the browser may never be seen.
4. **Test it as the bot.** Request a key page with the full user agent and look for a sentence you expect: `curl -s -A "<OAI-SearchBot string>" https://yoursite.com/pricing | grep -c "Plans start at"`. A 0 means a challenge page or client-rendered text. This only tests user-agent rules, because the request comes from your IP, not OpenAI's.
5. **Wait a day.** OpenAI says robots.txt changes take ~24 hours to reach its search systems.

Our [robots.txt tester](/tools/robots-txt-tester) checks any URL against the OAI-SearchBot group before you ship, and the [AI robots.txt generator](/tools/ai-robots-txt-generator) writes the OpenAI groups for you.

## How to Block OAI-SearchBot, and What You Give Up

To block it, give it its own group with `Disallow: /`. Here's what that buys, and what it doesn't:

- **You leave ChatGPT search answers.** OpenAI's wording is that opted-out sites "will not be shown in ChatGPT search answers." Your pages can't be quoted or cited there.
- **You may still appear as a link.** The same sentence continues: "though can still appear as navigational links." Atlas may also show a link and title, as above.
- **You don't opt out of training.** That's GPTBot's job. Blocking OAI-SearchBot alone leaves training untouched.
- **You give up clicks from cited answers.** OpenAI's publisher FAQ says ChatGPT adds `utm_source=chatgpt.com` to referral URLs, so check that traffic in GA4 before you decide. Our guide to [AI referral traffic in GA4](/blog/how-to-measure-ai-referral-traffic-in-ga4) shows how to count it.

The census shows how rarely sites choose a search block by accident. In the news and e-commerce top 1,000, 122 of the 129 full OAI-SearchBot blocks come from a rule that names the bot. And across all sites, 7.66% fully block GPTBot against 3.66% for OAI-SearchBot. Most publishers who object to OpenAI object to training, not search.

## How to Confirm OAI-SearchBot in Your Logs

A healthy site should see OAI-SearchBot fetch robots.txt, then pages. Three quick checks on a standard access log:

```bash
# Robots.txt checks vs page fetches, using the marker OpenAI may add
grep "OAI-SearchBot" access.log | grep -c "; robots.txt;"
grep "OAI-SearchBot" access.log | grep -vc "; robots.txt;"

# Is each IP really OpenAI's?
curl -sL https://openai.com/searchbot.json -o searchbot.json
grep -h "OAI-SearchBot" access.log | awk '{print $1}' | sort -u | python3 -c '
import ipaddress, json, sys
nets = [ipaddress.ip_network(p["ipv4Prefix"]) for p in json.load(open("searchbot.json"))["prefixes"]]
for ip in sys.stdin.read().split():
    print(ip, "OpenAI" if any(ipaddress.ip_address(ip) in n for n in nets) else "NOT OpenAI")'
```

The IP check assumes the client address is the first field. Behind a CDN, log the visitor's address instead of the proxy's. Any "NOT OpenAI" line is a scraper using the name, and you can block the token from unlisted IPs safely.

What the results mean:

- **Robots.txt fetches but no page fetches** usually means your robots.txt blocks the bot, or a new site hasn't been picked up yet.
- **No hits at all** points at a CDN or firewall that refuses the request before your server logs it. If you use Cloudflare, [find which setting is blocking ChatGPT](/blog/why-is-cloudflare-blocking-chatgpt).
- **Many 403s or 429s** mean a security layer is answering. Fix that before anything else.

For a weekly routine that covers all six OpenAI and Anthropic bots, see our guide on [how to track GPTBot and ClaudeBot](/blog/how-to-track-gptbot-and-claudebot). Perplexity has its own pair of bots, covered in the [PerplexityBot user agent guide](/blog/perplexitybot-user-agent).

## Where Rankbox Fits Once ChatGPT Can Crawl You

Rankbox doesn't edit robots.txt, change CDN settings or track ChatGPT citations today. The free tester and generator above handle access.

Access makes you eligible. What ChatGPT then quotes depends on the page. Rankbox's Answer-Space Research maps the questions buyers ask ChatGPT, Perplexity and Google, and its Citation-Ready Writer turns them into source-backed articles. The Business plan is $49.50 a month: [see pricing](/pricing). For what happens after the crawl, read our [ChatGPT SEO guide](/ai-seo/chatgpt) and the playbook on [getting cited by ChatGPT](/blog/how-to-get-cited-by-chatgpt).

## Frequently Asked Questions

### What is OAI-SearchBot?

OAI-SearchBot is OpenAI's web crawler for ChatGPT search. OpenAI says it is "used to surface websites in search results in ChatGPT's search features." Sites that block it aren't shown in ChatGPT search answers, though they can still appear as navigational links. See our [OAI-SearchBot glossary entry](/glossary/oai-searchbot) for a short definition.

### Should I allow OAI-SearchBot?

Yes, if you want ChatGPT search to show and cite your pages. OpenAI names allowing the bot and its published IPs as the way to become eligible. Blocking it doesn't stop model training, which GPTBot handles, so a block aimed at training costs you visibility and gains nothing.

### Is OAI-SearchBot the same as GPTBot?

No. OAI-SearchBot crawls for ChatGPT search, and GPTBot crawls content that may be used to train OpenAI's models. OpenAI says each setting "is independent of the others," so you can block GPTBot and keep OAI-SearchBot.

### Does OAI-SearchBot follow robots.txt?

Yes. OpenAI manages ChatGPT search opt-outs through the OAI-SearchBot robots.txt tag and says changes take about 24 hours to reach its search systems. ChatGPT-User is different: OpenAI says robots.txt rules "may not apply" to it.

### How do I block OAI-SearchBot?

Add a robots.txt group with `User-agent: OAI-SearchBot` and `Disallow: /`. Your pages then leave ChatGPT search answers, but may still appear as links. To keep a page out entirely, allow the bot on that page and add a `noindex` meta tag instead.

### How do I know OAI-SearchBot is really OpenAI?

Check the request's source IP against `openai.com/searchbot.json`. If the address isn't in one of the listed ranges, it isn't OpenAI's bot, whatever the user agent says. Reverse DNS won't help, because OpenAI's addresses don't return a hostname.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [OAI-SearchBot IP ranges (searchbot.json), OpenAI](https://openai.com/searchbot.json)
3. [ChatGPT search, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
4. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
5. [Bots reference, Cloudflare AI Crawl Control docs](https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
6. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
7. [Bot management and verified bots, Vercel docs](https://vercel.com/docs/bot-management)
8. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
9. [RFC 9309: Robots Exclusion Protocol, IETF](https://www.rfc-editor.org/rfc/rfc9309.txt)
