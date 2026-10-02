---
title: Applebot User Agent Strings: How to Identify and Verify Apple's Crawler
description: The Applebot user agent strings exactly as Apple documents them, plus tested reverse DNS and IP-list checks to tell real Applebot from spoofers.
keyword: Applebot user agent
date: 2026-11-24
updated: 2026-11-24
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, Apple
---

The Applebot user agent is a Safari-style browser string that ends in `(Applebot/0.1; +http://www.apple.com/go/applebot)`, and Apple documents two versions of it: one that looks like a Mac and one that looks like an iPhone. To prove a request is really Apple's, ignore the string and check the IP address: it should resolve to a host under `applebot.apple.com` and back again, or sit inside one of the ranges in Apple's published IP list.

The string is easy to copy, which is why the IP check matters. Any scraper can send the Applebot user agent, and a firewall rule that trusts the name lets it straight in. This page is the reference half of our guide to [Applebot and preparing for Apple Intelligence search](/blog/applebot-apple-intelligence-search), which covers what the crawler powers, how it renders and the robots.txt rules Apple applies.

Below: the exact strings from Apple's [About Applebot page](https://support.apple.com/en-us/119829) as of 1 October 2026, Apple's two other names, both verification methods (run against Apple's live DNS and IP file that day), log one-liners and a triage table for spoofers.

## Key Takeaways

- Apple documents a general format and two example strings for the Applebot user agent, a desktop one and an iPhone one. Both end in `(Applebot/0.1; +http://www.apple.com/go/applebot)`.
- Apple says the browser version inside the Applebot user agent changes from time to time, so match the `Applebot/` token, never the full string.
- Applebot-Extended is a robots.txt token that never crawls, and `iTMS` is a separate Apple Podcasts fetcher that ignores robots.txt.
- Apple's IP file listed 24 IPv4 ranges, 4,752 addresses in all, on 1 October 2026, last changed on 15 September.
- The two checks don't fully overlap. Apple's own example address passes reverse DNS but isn't in the IP file, and some listed addresses have no reverse DNS record. Accept a request that passes either check.
- A reverse DNS name proves nothing until a forward lookup returns the same IP.

## The Applebot User Agent, Exactly as Apple Prints It

Apple says a user agent exists so site owners can read "accurate access log reports of crawler activity" and set robots.txt rules. Here is every Applebot user agent string Apple publishes, copied character for character on 1 October 2026:

| Version         | Applebot user agent string                                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| General format  | `Mozilla/5.0 (Device; OS_version) AppleWebKit/WebKit_version (KHTML, like Gecko)Version/Safari_version [Mobile/Mobile_version] Safari/WebKit_version (Applebot/Applebot_version; +http://www.apple.com/go/applebot)` |
| Desktop example | `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)`                                            |
| Mobile example  | `Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1 (Applebot/0.1; +http://www.apple.com/go/applebot)`                      |

### Reading the string

Most of it mirrors Safari's own string. The parts that matter for you:

1. **Device and OS.** `Macintosh; Intel Mac OS X 10_15_7` or `iPhone; CPU iPhone OS 17_4_1`. Seeing both in your logs is expected, since Apple documents both.
2. **WebKit and Safari versions.** `AppleWebKit/605.1.15` and `Version/17.4`. Apple warns that "occasionally, Applebot will update the browser version that it advertises," while keeping the format.
3. **The product token.** `Applebot/0.1`. This is the part your log filters and firewall rules should key on.
4. **The info URL.** `+http://www.apple.com/go/applebot`, with plain `http`, not `https`.

### Match the token, not the whole Applebot user agent

There's a small trap in Apple's general format line. It reads `(KHTML, like Gecko)Version/` with no space, while both real examples have a space there. Copy the template literally into an exact-match rule and real traffic won't match it. A rule that matches the full desktop example will also break the next time Apple bumps the Safari version.

So filter on the token. A regular expression like this matches both examples and survives version changes:

```txt
\(Applebot/[0-9.]+; \+http://www\.apple\.com/go/applebot\)
```

For robots.txt, the name is simply `Applebot`, written as its own `User-agent:` line. The hub post covers the rules, including Apple's habit of following your Googlebot group when Applebot isn't named.

## Applebot-Extended and iTMS: Apple's Other Two Names

Apple's crawler page uses two more names. Neither behaves like the main crawler, and both confuse log reviews.

| Name                | What it is                                                | Shows up in logs?                    | Follows robots.txt?              |
| ------------------- | --------------------------------------------------------- | ------------------------------------ | -------------------------------- |
| `Applebot`          | The search crawler, with desktop and iPhone strings       | Yes                                  | Yes, plus the Googlebot fallback |
| `Applebot-Extended` | A robots.txt token for the model-training opt-out         | No                                   | It is a robots.txt rule          |
| `iTMS`              | Fetches URLs tied to content registered on Apple Podcasts | Yes, from `applebot.apple.com` hosts | No, per Apple                    |

### Applebot-Extended never sends a request

Apple calls Applebot-Extended a "secondary user agent," but says it "does not crawl webpages" and is "only used to determine how to use the data crawled by the Applebot user agent." So you'll never see it in an access log. Apple's [training data page](https://www.apple.com/legal/ai-regulations/training-data/), dated 9 September 2026, describes the same split: Applebot crawls, and robots.txt tells Apple whether it may use that content to train its models. If a request does arrive carrying the Applebot-Extended name, Apple didn't send it for that purpose. Run it through the IP checks below before you trust it.

### iTMS is the podcast fetcher

Apple says `iTMS` traffic "may come from applebot.apple.com hosts" and "only crawls URLs associated with registered content on Apple Podcasts." It ignores robots.txt "as it is not a general search crawler." If you host a podcast feed, expect it. If you don't and see `iTMS` anyway, run the same IP checks.

## How to Verify a Request With the Applebot User Agent

Apple offers two methods: reverse DNS, which it calls the general way, and an IP list. Both were run on 1 October 2026, and both were needed.

### Check 1: reverse DNS, then forward DNS

A reverse lookup asks which hostname owns an IP. A request with the real Applebot user agent comes from an address that resolves to names like `17-58-101-179.applebot.apple.com`. Then a forward lookup on that name must return the same IP, because anyone who controls an IP block can set its reverse record to any name they like.

```bash
host 17.58.101.179
host 17-58-101-179.applebot.apple.com
```

The run that day printed what Apple's page shows: `179.101.58.17.in-addr.arpa domain name pointer 17-58-101-179.applebot.apple.com.` and then `17-58-101-179.applebot.apple.com has address 17.58.101.179`. The round trip matched.

### Check 2: Apple's IP list

Apple's crawler page links to a JSON file at `search.developer.apple.com/applebot.json`. On 1 October 2026 it returned:

- **24 prefixes, all IPv4.** Three `/27` ranges, three `/28` and eighteen `/24`, for 4,752 addresses. There are no IPv6 ranges.
- **A creation time of 15 September 2026**, matching the file's last-modified header.

Apple doesn't say how often the file changes. Download it on a schedule, daily or weekly, rather than pasting the ranges into a config once.

### Why you need both checks

Here's the result that changes how you should write the rule. Apple's own example address, `17.58.101.179`, passed the DNS round trip but sits in none of the 24 listed ranges. And when the first, middle and last usable address of every range was checked (72 addresses), 51 passed the DNS round trip and 21 had no reverse record at all. All 21 were the first usable address in a `/28` or `/24` range. Probes of two of those ranges found no record on the first three usable addresses, and records on the ones after.

So each check, used alone, rejects some real Apple addresses. The safe rule is to accept a request if either check passes, and reject it only if both fail.

### A verification script you can run

This Python 3 script uses only the standard library. It downloads Apple's file, then checks each IP you pass it against the list and the DNS round trip.

```python
#!/usr/bin/env python3
"""Check whether IP addresses that claim to be Applebot belong to Apple.
Usage: python3 verify_applebot.py 17.241.208.176 203.0.113.50 ...
"""
import ipaddress
import json
import socket
import sys
import urllib.request

LIST_URL = "https://search.developer.apple.com/applebot.json"
socket.setdefaulttimeout(10)

with urllib.request.urlopen(LIST_URL, timeout=20) as resp:
    prefixes = json.load(resp)["prefixes"]
nets = [ipaddress.ip_network(p.get("ipv4Prefix") or p.get("ipv6Prefix")) for p in prefixes]


def in_apple_list(ip):
    addr = ipaddress.ip_address(ip)
    return any(addr in net for net in nets if net.version == addr.version)


def dns_round_trip(ip):
    try:
        host = socket.gethostbyaddr(ip)[0].rstrip(".")
    except OSError:
        return False, "no PTR record"
    if not host.endswith(".applebot.apple.com"):
        return False, host
    try:
        forward = {info[4][0] for info in socket.getaddrinfo(host, None)}
    except OSError:
        return False, host + " (no forward record)"
    return ip in forward, host


for ip in sys.argv[1:]:
    listed = in_apple_list(ip)
    dns_ok, host = dns_round_trip(ip)
    verdict = "real Applebot" if (listed or dns_ok) else "NOT Applebot"
    print(f"{ip:15}  list={'yes' if listed else 'no ':3}  dns={'yes' if dns_ok else 'no ':3}  {host:38}  {verdict}")
```

It ran on Python 3.14.3 on 1 October 2026. One setup note: that python.org build needed `SSL_CERT_FILE=/etc/ssl/cert.pem` before it would fetch Apple's file over HTTPS. The output:

| IP             | In Apple's list | DNS round trip | Hostname                            | Verdict      |
| -------------- | --------------- | -------------- | ----------------------------------- | ------------ |
| 17.241.208.176 | Yes             | Yes            | `17-241-208-176.applebot.apple.com` | Real         |
| 17.58.101.179  | No              | Yes            | `17-58-101-179.applebot.apple.com`  | Real         |
| 17.166.20.2    | Yes             | No             | No PTR record                       | Real         |
| 17.253.144.10  | No              | No             | `safaricampaign.apple`              | Not Applebot |
| 66.249.66.1    | No              | No             | `crawl-66-249-66-1.googlebot.com`   | Not Applebot |
| 203.0.113.50   | No              | No             | No PTR record                       | Not Applebot |

Two rows deserve a second look. `17.253.144.10` starts with 17, like every Applebot range, and resolves to an Apple hostname, but not a crawler one. So "it looks like an Apple IP" isn't the same as "it's Applebot." And `203.0.113.50` comes from a range [RFC 5737](https://www.rfc-editor.org/rfc/rfc5737) reserves for documentation, standing in here for a spoofer.

The forward check was also tested against forged records, by feeding the script fake DNS answers. A spoofer's IP with a reverse record of `crawl-1.applebot.apple.com`, whose forward lookup points elsewhere, failed. So did a look-alike name ending in `.applebot.apple.com.evil.example`, which the suffix test rejects.

## Find the Applebot User Agent in Your Logs

These one-liners pull every request carrying the Applebot user agent out of a log. They assume the Apache or NGINX combined log format, where the user agent is the sixth field when you split each line on double quotes. They were run on 1 October 2026 against an 11-line sample log built for this guide.

```bash
# Requests that carry the Applebot token
grep -c "Applebot/" access.log

# How many of those used the iPhone string
grep "Applebot/" access.log | grep -c "iPhone"

# IPs claiming to be Applebot, busiest first
awk -F'"' '$6 ~ /Applebot\// { split($1, a, " "); print a[1] }' access.log | sort | uniq -c | sort -rn

# Status codes served to anything claiming to be Applebot
awk -F'"' '$6 ~ /Applebot\// { split($3, s, " "); print s[1] }' access.log | sort | uniq -c

# Podcast fetches from iTMS
awk -F'"' '$6 ~ /^iTMS/ { print $2 }' access.log

# Verify every claimed IP in one go
python3 verify_applebot.py $(awk -F'"' '$6 ~ /Applebot\// { split($1, a, " "); print a[1] }' access.log | sort -u)
```

Behind a CDN or load balancer, the first field is often the proxy's address, not the crawler's. Log the original client IP instead, for example with NGINX's [realip module](https://nginx.org/en/docs/http/ngx_http_realip_module.html), which replaces the client address with one "sent in the specified header field." Otherwise every check above will fail, real Apple traffic included. For log locations on common hosts and CDNs, see our guide to [tracking GPTBot and ClaudeBot](/blog/how-to-track-gptbot-and-claudebot), which works the same way for Apple.

## Triage: When the Applebot User Agent Is Fake

Once you have the two results for an IP, this table turns them into an action. It's the rule the script applies, plus what to do next. Remember that a verified crawler can still be stopped further up the chain: Cloudflare [says](https://blog.cloudflare.com/content-independence-day-ai-options/) customers who block AI training also block multi-purpose crawlers such as Applebot, and the hub post shows where to check.

| Apple IP list | DNS round trip                                      | What it means                                 | What to do                                  |
| ------------- | --------------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| Yes           | Yes                                                 | Real Applebot                                 | Allow; check the status codes it got        |
| Yes           | No reverse record                                   | Real; some listed addresses have none         | Allow                                       |
| No            | Yes                                                 | Real; the list doesn't cover every Apple host | Allow, and re-download the list             |
| No            | Reverse name points to Apple, forward doesn't match | Forged reverse record                         | Block or rate-limit                         |
| No            | No                                                  | Spoofer using Apple's name                    | Block or rate-limit                         |
| Either        | Either, but the name is `Applebot-Extended`         | Not a crawl Apple documents                   | Treat as unverified unless both checks pass |

### Worked example: Tallyfold's log for 1 October

Tallyfold is a fictional invoicing app for agencies, at the reserved domain `tallyfold.example`. Its sample log for 1 October 2026 has 11 lines. Eight carry the Applebot user agent, from four IPs:

| IP             | Requests | List | DNS | Verdict |
| -------------- | -------- | ---- | --- | ------- |
| 17.241.208.176 | 3        | Yes  | Yes | Real    |
| 17.166.232.10  | 2        | Yes  | Yes | Real    |
| 17.58.101.179  | 1        | No   | Yes | Real    |
| 203.0.113.50   | 2        | No   | No  | Spoofer |

That's 6 real requests out of 8, or 75%. A list-only rule would have thrown out the request from `17.58.101.179`, Apple's own example address, and counted 5 of 8. The two spoofed requests went to `/pricing` and `/account/login`, the second of which got a 403. That second target is a hint in itself: Apple's [crawler privacy page](https://support.apple.com/en-us/120320) says Applebot "does not crawl data from websites that require login credentials," so a run of Applebot-labelled hits on account pages deserves a look.

The real traffic also showed one fix to make. Apple's iPhone crawler asked for `/help/late-fees` and got a 404, because the article moved without a redirect. Tallyfold adds a 301, then blocks `203.0.113.50`'s pattern at the edge. A ninth line in the same log, from `iTMS`, fetched the company podcast feed. It's expected traffic, not a crawler to block.

## Where Rankbox Fits

Rankbox doesn't verify bots, read your logs or run firewall rules. Those stay with your host or CDN. What it does is the content that verified crawlers come for: its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts source-backed articles that open with a plain answer, delivered to your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial when you add a card; see [pricing](/pricing). For the other bots in your logs, our [AI crawler directory](/blog/ai-crawler-directory) lists each vendor's tokens and IP files.

## Frequently Asked Questions

### What is the Applebot user agent?

It's a Safari-style string ending in `(Applebot/0.1; +http://www.apple.com/go/applebot)`. Apple's desktop example starts `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)` and its mobile example starts `Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X)`. Apple says the browser version in the middle can change.

### Does Applebot-Extended appear in server logs?

No. Apple says Applebot-Extended "does not crawl webpages." It's a robots.txt token that controls whether Apple may train its models on pages the main crawler fetched. A logged request carrying that name didn't come from that token's job, so check its IP before trusting it.

### Is every Apple IP address Applebot?

No. Apple's addresses serve many things besides its crawler. In a check on 1 October 2026, `17.253.144.10` resolved to `safaricampaign.apple`, not to a host under `applebot.apple.com`. Use Apple's IP file or the DNS round trip, not the first number of the address.

### Why is there an iPhone version of the Applebot user agent?

Apple documents a mobile Applebot user agent alongside the desktop one, so the crawler can fetch your pages as an iPhone sees them. Both carry the same `Applebot/0.1` token. If your site serves different content to phones, make sure the mobile view has everything you want found.

### How often does Apple update the Applebot IP list?

Apple doesn't say. On 1 October 2026 the file's creation time and last-modified header both read 15 September 2026. Re-download it on a schedule, and don't treat it as complete: Apple's own example crawler address passes reverse DNS but isn't in it.

### What is the iTMS user agent?

`iTMS` is an Apple fetcher for Apple Podcasts. Apple says it may come from `applebot.apple.com` hosts, only crawls URLs tied to content registered on Apple Podcasts, and doesn't follow robots.txt because it isn't a general search crawler.

## References

1. [About Applebot, Apple Support](https://support.apple.com/en-us/119829)
2. [Applebot IP CIDRs (JSON), Apple](https://search.developer.apple.com/applebot.json)
3. [Applebot model training and individual privacy rights, Apple Support](https://support.apple.com/en-us/120320)
4. [Datasets used for Apple's generative AI systems and services, Apple Legal](https://www.apple.com/legal/ai-regulations/training-data/)
5. [RFC 5737: IPv4 Address Blocks Reserved for Documentation, IETF](https://www.rfc-editor.org/rfc/rfc5737)
6. [socket: Low-level networking interface, Python documentation](https://docs.python.org/3/library/socket.html)
7. [Module ngx_http_realip_module, NGINX](https://nginx.org/en/docs/http/ngx_http_realip_module.html)
8. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
