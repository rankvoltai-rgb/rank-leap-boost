---
title: PerplexityBot User Agent Documentation: robots.txt Rules and IP Checks
description: The PerplexityBot user agent string from Perplexity's own docs, the IP lists that prove a hit is real, and robots.txt rules to allow, limit or block it.
keyword: PerplexityBot user agent
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

Perplexity documents the PerplexityBot user agent on its [crawler page](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) as `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)`, and says the bot follows robots.txt. Its second bot, `Perplexity-User`, fetches pages live for people and "generally ignores robots.txt rules", so robots.txt controls one Perplexity bot fully and the other only loosely.

The string alone proves nothing, because anyone can send it. What proves a request is real is the source IP, checked against the two lists Perplexity publishes. This matters more for Perplexity than for most AI vendors: Cloudflare stopped treating Perplexity as a verified bot in 2025, and its Radar dashboard still listed Perplexity as not verified on 28 September 2026. For every other vendor's tokens and IP files, see our [AI crawler directory](/blog/ai-crawler-directory).

Plenty of sites have already made their call. In Rankbox's [AI bot crawler census](/blog/ai-bot-crawler-census), 45.12% of the top 500 news and media sites fully block PerplexityBot in robots.txt, against 4.93% across every site in the study. This guide covers the exact strings, how to check an IP, which robots.txt lines do what, and how to test a rule before you trust it.

## Key Takeaways

- The PerplexityBot user agent ends in `compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)`. Match the token `PerplexityBot`, never the whole string.
- Perplexity publishes two IP lists. As of 28 September 2026, PerplexityBot's covers 18 addresses in 8 ranges and Perplexity-User's covers 14 addresses in 4 ranges, all IPv4.
- Reverse DNS can't verify Perplexity. Its listed IPs resolve to generic Amazon EC2 hostnames, so the JSON lists are the only proof.
- A robots.txt block on PerplexityBot keeps your text out of Perplexity's index, but Perplexity says it may still index your domain, headline and a brief factual summary.
- A robots.txt line for Perplexity-User states a wish. Only a firewall rule reliably stops a live fetch.
- Test rules with a longest-match tester. On Python 3.14.3, Python's built-in robots.txt parser gives the wrong answer for a common Perplexity rule.

## The PerplexityBot User Agent, Word for Word

Perplexity runs two declared bots, each with one fixed string. Here they are exactly as the vendor prints them, as of September 2026:

| Token | Full user-agent string | Job | Follows robots.txt? |
| --- | --- | --- | --- |
| `PerplexityBot` | `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)` | Finds and links pages for Perplexity's search results | Yes |
| `Perplexity-User` | `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)` | Visits a page when a user's question needs it | "Generally ignores" it |

Perplexity says PerplexityBot "is not used to crawl content for AI foundation models." Perplexity-User isn't used "for web crawling or to collect content for training" either. So neither bot is a training crawler, and there is no separate Perplexity training bot to manage. New to the term? See our [PerplexityBot glossary entry](/glossary/perplexitybot).

### Match the token, not the whole PerplexityBot user agent

Write log searches and firewall rules against the token `PerplexityBot`. A full-string match breaks the day Perplexity ships version 1.1, and misses requests where a CDN rewrites spacing or encoding.

Two details trip people up:

1. **The hyphen.** The live fetcher is `Perplexity-User`, with a hyphen and no "Bot". A rule for `PerplexityUser` matches nothing.
2. **Case.** Under [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.txt), crawlers match robots.txt groups case-insensitively. Firewall and `grep` matches are case-sensitive unless you say otherwise.

### Where Perplexity's own docs stop

The crawler page says nothing about `Crawl-delay` or rate limits, and third-party guides disagree on it. If load is the worry, rate-limit at your server or CDN instead.

## Check the IP Behind Any PerplexityBot User Agent

Anyone can type the PerplexityBot user agent into a request header, so the IP is the real test. Perplexity's two lists live at `perplexity.com/perplexitybot.json` and `perplexity.com/perplexity-user.json`. Both now redirect to `perplexity.ai`. Each file holds a `creationTime` and a `prefixes` array of `ipv4Prefix` entries.

| List | Ranges | Addresses | `creationTime` |
| --- | --- | --- | --- |
| [PerplexityBot](https://www.perplexity.com/perplexitybot.json) | 6 single IPs, one /30, one /29 | 18 | 7 February 2025 |
| [Perplexity-User](https://www.perplexity.com/perplexity-user.json) | 2 single IPs, one /30, one /29 | 14 | 17 October 2025 |

The counts come from the files as served on 28 September 2026. A /30 holds 4 addresses and a /29 holds 8, so PerplexityBot's list is 6 + 4 + 8 = 18. An old date is normal. Perplexity's docs still say the ranges are "updated regularly" and tell you to fetch them automatically. Most AI vendors use this same JSON shape, and the [directory's IP-list table](/blog/ai-crawler-directory) shows where each one publishes its file.

Don't try reverse DNS. The first address of every listed range resolved to a hostname such as `ec2-3-224-62-45.compute-1.amazonaws.com`. That tells you the request came from Amazon's cloud, which anyone can rent. It doesn't tell you it came from Perplexity.

### A worked check: three hits on Plannora's logs

Plannora is a made-up project management app. Its admin sees three requests in one morning that carry the PerplexityBot user agent, plus one Perplexity-User hit. She downloads both lists, then runs a short script over the log:

```bash
curl -sL https://www.perplexity.ai/perplexitybot.json -o PerplexityBot.json
curl -sL https://www.perplexity.ai/perplexity-user.json -o Perplexity-User.json
python3 check_perplexity.py access.log
```

```python
# check_perplexity.py: labels each Perplexity hit REAL or FAKE
import ipaddress, json, sys

TOKENS = ["PerplexityBot", "Perplexity-User"]
nets = {t: [ipaddress.ip_network(p["ipv4Prefix"])
            for p in json.load(open(f"{t}.json"))["prefixes"]] for t in TOKENS}

for line in open(sys.argv[1], errors="ignore"):
    token = next((t for t in TOKENS if t in line), None)
    if token:
        ip = ipaddress.ip_address(line.split()[0])
        label = "REAL" if any(ip in n for n in nets[token]) else "FAKE"
        print(label, token, ip, line.split('"')[1])
```

The output, run on 28 September 2026:

```text
REAL PerplexityBot 18.97.9.99 GET /blog/pricing-guide HTTP/1.1
REAL PerplexityBot 3.224.62.45 GET /robots.txt HTTP/1.1
FAKE PerplexityBot 203.0.113.50 GET /members/report HTTP/1.1
REAL Perplexity-User 18.97.43.83 GET /blog/pricing-guide HTTP/1.1
```

The first address sits inside `18.97.9.96/29`, which runs from .96 to .103. The third one is on no list, and it went for the members area. That's a scraper borrowing the name, so Plannora can block it without touching the real bot. The script assumes the client IP is the first field of each line. Behind a CDN, log the visitor's address, not the proxy's, or every hit will read FAKE.

## robots.txt Rules for PerplexityBot and Perplexity-User

robots.txt groups use the bare token, not the full PerplexityBot user agent string: `PerplexityBot` or `Perplexity-User`. Perplexity says each setting "works independently" and that changes can take up to 24 hours to apply.

### What a block actually does

A block on PerplexityBot isn't a full exit. Perplexity's help center says the crawler "will not index the full or partial text content" of a disallowed site, "However, if a page is blocked, we may still index the domain, headline, and a brief factual summary." That article returned an error on 28 September 2026, so the quote comes from the [archived copy of 1 April 2026](https://web.archive.org/web/20260401182247/https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt).

### Why Perplexity-User is different

Perplexity-User only runs when a person asks something. Perplexity's reasoning is that the fetch is the user's, not the crawler's. Google says the same about its own [user-triggered fetchers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers): "Because the fetch was requested by a user, these fetchers generally ignore robots.txt rules."

Perplexity's docs pull in two directions here. They list `Perplexity-User` as a robots.txt tag that "controls which sites these user requests can access", then say the fetcher generally ignores robots.txt. The archived help article adds that summarizing a blocked URL on request "has been disabled." Read the current docs as the rule: a `Perplexity-User` line is a request, and the firewall is the lock.

### The Perplexity Access Matrix

Pick the row that matches your goal. The last column is what Perplexity's docs say still happens.

| Your goal | robots.txt | Firewall step | What Perplexity says remains |
| --- | --- | --- | --- |
| Be fully in Perplexity | No `Disallow` for either token | Let the listed IPs through any challenge | Full indexing and live fetches |
| Search, but keep a private area out | `PerplexityBot` group with `Disallow: /members/` | Optional: block `Perplexity-User` on `/members/` | That area's text isn't indexed |
| Leave Perplexity search | `PerplexityBot` with `Disallow: /` | None needed for the crawler | Domain, headline and a brief summary may still be indexed |
| No Perplexity access at all | Both tokens with `Disallow: /` | Block both tokens by name | Declared fetches stop; the summary caveat still applies |
| Keep the real bot, stop fakes | Nothing | Block the token when the IP isn't listed | No change for the real bot |

Blocking by name is always safe, because a faker who gets blocked costs you nothing. Allowing by name alone is not. An allow rule has to check the IP too, or every scraper that copies the PerplexityBot user agent walks straight in.

For row two, the file looks like this. A named group replaces the `*` group for that bot, so repeat any private paths you still need:

```robots.txt
User-agent: PerplexityBot
Disallow: /members/
Disallow: /checkout/

User-agent: *
Disallow: /checkout/
```

Our free [AI robots.txt generator](/tools/ai-robots-txt-generator) builds these groups for Perplexity and other AI bots in one file.

## How to Test a Perplexity Rule Before You Rely on It

A robots.txt mistake fails silently. Run these five checks in order:

1. **Parse the file with a longest-match tester.** RFC 9309 says the most specific rule wins: "the match that has the most octets." Our [robots.txt tester](/tools/robots-txt-tester) applies that rule and names the line that decided each URL.
2. **Don't trust Python's built-in parser for this.** Its [docs](https://docs.python.org/3/library/urllib.robotparser.html) point to RFC 9309. Yet on Python 3.14.3 it let `PerplexityBot` into `/members/` under `Allow: /` then `Disallow: /members/`, because it stops at the first matching line. Given the full PerplexityBot user agent string instead of the token, it skipped the PerplexityBot group entirely.
3. **Request a page as the bot.** `curl -s -o /dev/null -w "%{http_code}\n" -A "<full PerplexityBot string>" https://yoursite.com/pricing` shows what your user-agent rules return. A 403 or a challenge page means a firewall is in the way. This only tests user-agent rules, because the request comes from your IP, not Perplexity's.
4. **Wait a day, then read the logs.** After 24 hours, look for PerplexityBot fetching `/robots.txt` and then the paths you changed. Our free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) counts hits and status codes per bot in your browser. It matches on names only, so pair it with the IP script above.
5. **Check your CDN's own bot settings.** On Cloudflare, Perplexity's docs tell you to create a custom rule with the action "Allow". Cloudflare custom rules have no Allow action; [its docs](https://developers.cloudflare.com/ruleset-engine/rules-language/actions/) say Allow belonged to the deprecated Firewall Rules, and the current equivalent is Skip. Free-plan Bot Fight Mode [can't be skipped](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/) by custom rules at all, though it won't fire when an IP Access rule matches first. IP Access rules take single IPv4 addresses, /24s or /16s only, per [Cloudflare's parameters page](https://developers.cloudflare.com/waf/tools/ip-access-rules/parameters/). So PerplexityBot's /30 and /29 ranges have to go in as 12 single addresses. Our [Cloudflare challenge guide](/blog/cloudflare-challenge-trap) walks through the full audit.

## The 2025 Stealth-Crawling Dispute and What It Changes

In August 2025, [Cloudflare reported](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) that Perplexity still reached content on test domains that blocked both of its declared bots, using "a generic browser intended to impersonate Google Chrome on macOS" from IPs outside its published ranges. Cloudflare counted 3 to 6 million such requests a day, against 20 to 25 million from the declared Perplexity-User, and removed Perplexity from its verified-bot list. Perplexity's [reply](https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web), also dated 4 August, said Cloudflare had confused it with traffic from BrowserBase, a third-party cloud browser it says it uses for fewer than 45,000 requests a day, and argued that user-driven fetches aren't crawling. On 28 September 2026, the AI bot transparency table on [Cloudflare Radar](https://radar.cloudflare.com/ai-insights) still listed Perplexity as not verified.

You don't need to settle who was right. Two practical points follow:

- **A token only governs traffic that announces itself.** robots.txt and user-agent rules work on declared bots. Anything that looks like a browser needs bot detection, not a robots.txt line.
- **Verified-bot shortcuts may not cover Perplexity.** Settings that wave through a CDN's verified bots depend on that CDN's list. Vercel's [verified bots directory](https://vercel.com/docs/bot-management) includes both Perplexity bots, while Cloudflare's Radar marks Perplexity as not verified. If you want PerplexityBot in, write an explicit rule that checks the token and the IP list, as Perplexity's own docs advise.

## What Rankbox Does Once PerplexityBot Can Read You

Rankbox doesn't manage robots.txt, firewalls or IP allowlists, and it doesn't track whether Perplexity cites you today. The free robots.txt tester, generator and log analyzer above cover access.

Once PerplexityBot can reach your pages, give it something worth quoting. Rankbox's Citation-Ready Writer researches the live web and writes source-backed articles, and Answer-Space Research maps the questions buyers ask Perplexity, ChatGPT and Google. The Business plan is $49.50 a month: [see pricing](/pricing). For how Perplexity picks and ranks passages once it has your page, read our [Perplexity SEO guide](/ai-seo/perplexity). For the OpenAI and Anthropic side of your logs, see [how to track GPTBot and ClaudeBot](/blog/how-to-track-gptbot-and-claudebot) and our guide to [OAI-SearchBot](/blog/what-is-oai-searchbot).

## Frequently Asked Questions

### What is the PerplexityBot user agent string?

The full PerplexityBot user agent is `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)`, as published on Perplexity's crawler page in September 2026. In robots.txt and firewall rules, use the token `PerplexityBot` rather than the whole string.

### Does PerplexityBot respect robots.txt?

Yes. Perplexity says PerplexityBot follows robots.txt and that changes can take up to 24 hours. A disallowed site's text isn't indexed, though Perplexity says it may still index the domain, headline and a brief factual summary.

### Does Perplexity-User follow robots.txt?

Not reliably. Perplexity's docs say that because a user requested the fetch, Perplexity-User "generally ignores robots.txt rules." A `Disallow` line for it states your preference. To stop it, block the `Perplexity-User` token in your firewall or CDN.

### How do I verify a PerplexityBot IP address?

Check the source IP against Perplexity's `perplexitybot.json` list, linked from its crawler page. A request with the PerplexityBot user agent from an address outside that list is not Perplexity. Use `perplexity-user.json` for Perplexity-User hits. Reverse DNS won't help, because the listed addresses resolve to generic Amazon EC2 hostnames.

### Is PerplexityBot used to train AI models?

No. Perplexity says PerplexityBot "is not used to crawl content for AI foundation models," and that Perplexity-User doesn't collect training content either. Blocking PerplexityBot opts you out of Perplexity search, not out of model training.

### How many sites block PerplexityBot?

In Rankbox's September 2026 census, 45.12% of the top 500 news and media sites fully blocked PerplexityBot in robots.txt. The rate was 4.18% for the top 500 online retailers and 4.93% across all sites checked.

## References

1. [Perplexity Crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
2. [PerplexityBot IP ranges (perplexitybot.json), Perplexity](https://www.perplexity.com/perplexitybot.json)
3. [Perplexity-User IP ranges (perplexity-user.json), Perplexity](https://www.perplexity.com/perplexity-user.json)
4. [How does Perplexity follow robots.txt?, Perplexity Help Center (archived 1 April 2026)](https://web.archive.org/web/20260401182247/https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt)
5. [Perplexity is using stealth, undeclared crawlers to evade website no-crawl directives, Cloudflare](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/)
6. [Agents or bots? Making sense of AI on the open web, Perplexity](https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web)
7. [AI Insights, Cloudflare Radar](https://radar.cloudflare.com/ai-insights)
8. [Google's user-triggered fetchers, Google Crawling Infrastructure](https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers)
9. [RFC 9309: Robots Exclusion Protocol, IETF](https://www.rfc-editor.org/rfc/rfc9309.txt)
10. [urllib.robotparser, Python documentation](https://docs.python.org/3/library/urllib.robotparser.html)
11. [Actions, Cloudflare Ruleset Engine docs](https://developers.cloudflare.com/ruleset-engine/rules-language/actions/)
12. [Bot Fight Mode, Cloudflare docs](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
13. [IP Access rules parameters, Cloudflare docs](https://developers.cloudflare.com/waf/tools/ip-access-rules/parameters/)
14. [Bot management and verified bots, Vercel docs](https://vercel.com/docs/bot-management)
