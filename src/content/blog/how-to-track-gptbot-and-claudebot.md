---
title: How to Track GPTBot and ClaudeBot Website Crawling Activity
description: Track GPTBot and ClaudeBot in your server, Cloudflare or Vercel logs, verify each hit against OpenAI's and Anthropic's IP lists, and run a weekly check.
keyword: GPTBot and ClaudeBot
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

To track GPTBot and ClaudeBot, pull every request whose user agent contains those tokens from your access logs, then check each source IP against the lists OpenAI and Anthropic publish. Count the verified hits per bot, per page and per status code each week, and you have a crawl record you can trust.

The hard part isn't the search. It's knowing where your logs live, which fields they keep, and which bot did what job. [GPTBot](/glossary/gptbot) collects training data for OpenAI, and [ClaudeBot](/glossary/claudebot) does the same for Anthropic. Each vendor also runs a search crawler and a live fetcher, and those tell you far more about AI search than the training bots do. Our [AI crawler directory](/blog/ai-crawler-directory) lists every AI bot's token and IP file. This guide sticks to OpenAI and Anthropic, and goes step by step.

Below: where the logs live on each host, commands that turn raw lines into a spreadsheet, an IP check for six bots, and a weekly routine.

## Key Takeaways

- Search for six tokens, not two: `GPTBot`, `OAI-SearchBot` and `ChatGPT-User` from OpenAI, and `ClaudeBot`, `Claude-SearchBot` and `Claude-User` from Anthropic.
- OpenAI publishes one IP list per bot. Anthropic publishes one list for all three of its bots, so only the token tells you which Anthropic bot called.
- Reverse DNS can't verify GPTBot and ClaudeBot. Their listed addresses have no useful hostname, so the JSON lists are the only proof.
- Behind Cloudflare, your server log shows Cloudflare's IP unless you restore the visitor's address from `CF-Connecting-IP`.
- Vercel's runtime logs show a user agent per request but can't search or group by it. Log drains and the Firewall Traffic view can.
- A weekly sheet with verified hits, error rates and job split catches a broken firewall rule within days.

## Where GPTBot and ClaudeBot Show Up in Your Logs

You need two fields from every request: the client IP and the user agent. Where they live depends on what sits in front of your site.

### Your own server: Apache and NGINX

Both servers ship a "combined" format that records IP, time, request line, status, bytes, referrer and user agent. [Apache's docs](https://httpd.apache.org/docs/2.4/logs.html) define it as `%h %l %u %t "%r" %>s %b "%{Referer}i" "%{User-agent}i"`, and [NGINX's](https://nginx.org/en/docs/http/ngx_http_log_module.html) predefined version ends in `"$http_referer" "$http_user_agent"`.

- **Apache** writes to `/var/log/apache2/access.log` on Debian and Ubuntu and `/var/log/httpd/access_log` on Fedora, CentOS and RHEL, per the [Apache wiki's layout table](https://cwiki.apache.org/confluence/display/httpd/DistrosDefaultLayout).
- **NGINX** defaults to `logs/access.log` under its install prefix, but your build or config may set another path. Run `nginx -T | grep access_log` to see the real one.

Logs rotate, and old files are often gzipped. Search the rotated copies too, or a weekly count may cover only a day.

### Behind Cloudflare

Cloudflare sits between the bot and your server, so two things change.

1. **Your server log shows Cloudflare's IP.** [Cloudflare's docs](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/) say the visitor's address arrives in the `CF-Connecting-IP` header. On Apache, restore it with mod_remoteip: `RemoteIPHeader CF-Connecting-IP`, Cloudflare's ranges as trusted proxies, and `%a` in place of `%h` in your log format. On NGINX, use `set_real_ip_from` for each Cloudflare range plus `real_ip_header CF-Connecting-IP`. Until you do, every IP check will fail.
2. **Blocked requests never reach you.** If Cloudflare returns a 403 or a challenge to GPTBot and ClaudeBot, your server logs nothing. Open [AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/) instead. Its Crawlers tab lists requests and data transfer per bot, the Metrics tab shows status codes and top paths, and "Download CSV" exports it all.

Unless you're on Enterprise with Bot Management, AI Crawl Control [keeps a 24-hour window](https://developers.cloudflare.com/ai-crawl-control/get-started/) and identifies bots by user agent, so it counts fakes too. Export the CSV daily if you want a week. Raw per-request logs come through Logpush, which Cloudflare [offers on Enterprise plans only](https://developers.cloudflare.com/logs/logpush/). Its HTTP requests dataset carries `ClientRequestUserAgent`, `ClientIP`, `ClientRequestPath` and `EdgeResponseStatus`.

### On Vercel

Vercel's [runtime logs](https://vercel.com/docs/logs/runtime) do show a "Request User Agent" when you open one request. But the free-text search covers only the message and request path, so you can't pull every GPTBot and ClaudeBot line at once. Retention is short too, as of September 2026: 1 hour on Hobby, 1 day on Pro, 3 days on Enterprise, 30 days with Observability Plus. And runtime logs don't list every static request; Vercel points to log drains for those.

Two better options:

- **Firewall Traffic view.** The [Firewall's Traffic page](https://vercel.com/docs/vercel-firewall/firewall-observability) groups requests by user agent, IP, path and ASN for the last hour or 24 hours. Good for a spot check.
- **Log drains.** On Pro and Enterprise plans, a [log drain](https://vercel.com/docs/drains/reference/logs) sends each request as JSON with `proxy.userAgent`, `proxy.clientIp`, `proxy.path`, `proxy.statusCode` and `proxy.responseByteSize`. Include the `static` source, and skip sampling rules for this job, because requests that match no rule are dropped.

### Other CDNs

Look for the same two fields. In [CloudFront standard logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/standard-logs-reference.html) they're `c-ip` and `cs(User-Agent)`, and the user agent is URL-encoded, so spaces show as `%20`. The tokens contain no spaces, so a search for `GPTBot` still works.

## Pull GPTBot and ClaudeBot Hits Out of Raw Logs

Start with a count across current and rotated logs. `zgrep` reads plain and gzipped files alike:

```bash
# GPTBot and ClaudeBot, plus their search and live-fetch siblings
zgrep -ohE 'GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User' \
  /var/log/nginx/access.log* | sort | uniq -c | sort -rn
```

Then turn each hit into a spreadsheet row. This reads the combined format, where splitting on double quotes puts the request in field 2, status and bytes in field 3 and the user agent in field 6:

```bash
zgrep -hE 'GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User' \
  /var/log/nginx/access.log* \
  | awk -F'"' 'BEGIN { print "date,bot,ip,path,status,bytes" }
    { match($6, /GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User/)
      bot = substr($6, RSTART, RLENGTH)
      split($1, head, " "); split($2, req, " "); split($3, res, " ")
      print substr(head[4], 2, 11) "," bot "," head[1] "," req[2] "," res[1] "," res[2] }' > ai-bots.csv
```

Each row reads like `22/Sep/2026,OAI-SearchBot,104.210.140.130,/pricing,200,22110`. Open the file in Google Sheets or Excel and you can pivot by bot, day, path or status.

One OpenAI detail helps here. Its [crawler docs](https://developers.openai.com/api/docs/bots) say GPTBot and OAI-SearchBot may add a `robots.txt` marker to the user agent when they fetch that file. If your log drops paths, that marker still tells you which hits were robots.txt checks.

Prefer a browser? Paste a day of lines into our free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer). It counts hits, pages and status codes per bot without uploading anything. It matches on names only, so run the IP check below on anything that matters.

## Verify GPTBot and ClaudeBot Against Published IP Lists

Any scraper can call itself GPTBot. The source IP is what proves it. Here's what each vendor publishes, as served on 28 September 2026:

| Bot | IP list | Ranges | List dated |
| --- | --- | --- | --- |
| GPTBot | `openai.com/gptbot.json` | 18 | 22 Sep 2026 |
| OAI-SearchBot | `openai.com/searchbot.json` | 39 | 2 Jan 2026 |
| ChatGPT-User | `openai.com/chatgpt-user.json` | 230 | 25 Sep 2026 |
| ClaudeBot, Claude-SearchBot, Claude-User | `claude.com/crawling/bots.json` | 26 | 18 Aug 2026 |

All four lists hold IPv4 ranges only. [Anthropic's help article](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) puts it plainly: "If a crawler has a source IP address on this list, it indicates that the crawler is coming from Anthropic." Don't bother with reverse DNS. The OpenAI and Anthropic addresses checked for this guide returned no hostname, or a generic Google Cloud one.

Download the lists, then add a "verified" column to your CSV:

```bash
curl -sL https://openai.com/gptbot.json -o gptbot.json
curl -sL https://openai.com/searchbot.json -o searchbot.json
curl -sL https://openai.com/chatgpt-user.json -o chatgpt-user.json
curl -sL https://claude.com/crawling/bots.json -o anthropic.json
python3 add_verified.py ai-bots.csv > ai-bots-checked.csv
```

```python
# add_verified.py: adds yes/no to each row, using the vendor's own IP list
import csv, ipaddress, json, sys

LIST_FILE = {
    "GPTBot": "gptbot.json", "OAI-SearchBot": "searchbot.json",
    "ChatGPT-User": "chatgpt-user.json", "ClaudeBot": "anthropic.json",
    "Claude-SearchBot": "anthropic.json", "Claude-User": "anthropic.json",
}

def load(path):
    return [ipaddress.ip_network(v) for p in json.load(open(path))["prefixes"] for v in p.values()]

nets = {bot: load(path) for bot, path in LIST_FILE.items()}
rows = csv.DictReader(open(sys.argv[1]))
out = csv.DictWriter(sys.stdout, fieldnames=rows.fieldnames + ["verified"], lineterminator="\n")
out.writeheader()
for row in rows:
    ip = ipaddress.ip_address(row["ip"])
    row["verified"] = "yes" if any(ip in n for n in nets[row["bot"]]) else "no"
    out.writerow(row)
```

For a quick summary without a spreadsheet, count verified hits and errors per bot:

```bash
awk -F, 'NR > 1 && $7 == "yes" { n[$2]++; if ($5 >= 400) e[$2]++ }
  END { for (b in n) printf "%-17s %6d verified %5d errors\n", b, n[b], e[b] }' ai-bots-checked.csv
```

Refresh the four JSON files before each run. OpenAI's ChatGPT-User list carried a creation date three days before this guide was written. For vendors beyond these two, the [AI crawler directory](/blog/ai-crawler-directory) lists every published IP file.

## Training, Search or a Live Fetch: Reading the Six Tokens

A raw total of GPTBot and ClaudeBot hits mixes different jobs. Split the count by token before you draw conclusions.

| Token | Vendor's stated job | A rising count means | A drop to zero means |
| --- | --- | --- | --- |
| `GPTBot` | Content that "may be used in training" | More of your site going into training data | Blocked, or a crawl pause |
| `OAI-SearchBot` | Surfacing sites in ChatGPT search | Pages being indexed for ChatGPT search | Check robots.txt and your CDN first |
| `ChatGPT-User` | Visits for a user's question | Real conversations pulling your pages | A firewall may be refusing live fetches |
| `ClaudeBot` | Content that could contribute to training | More of your site going into training data | Blocked, or a crawl pause |
| `Claude-SearchBot` | Improving Claude's search results | Pages being indexed for Claude search | Check robots.txt and your CDN first |
| `Claude-User` | Visits for a user's question | Claude users reading your pages | A firewall may be refusing live fetches |

Two rules help when you read the sheet:

1. **Training volume isn't a visibility signal.** A heavy GPTBot week says nothing about whether ChatGPT cites you. For that, see our [guide to OAI-SearchBot](/blog/what-is-oai-searchbot) and our method for [measuring GEO](/blog/how-to-measure-geo).
2. **Live fetches are the closest thing to a citation hint in your logs.** Each `ChatGPT-User` or `Claude-User` hit is a question that needed your page. It isn't a click, but a page that keeps drawing them is being used in answers.

OpenAI also runs `OAI-AdsBot`, which only visits pages submitted as ChatGPT ads. Leave it out of your crawl sheet unless you advertise there.

## The Monday Crawl Sheet: A Weekly Tracking Routine

Tracking GPTBot and ClaudeBot works best as a fixed habit. The Monday Crawl Sheet is one row per bot per week, with five numbers: total hits, verified hits, verified share, errors on verified hits, and error rate.

### The routine

1. **Pull seven days of logs**, including rotated files, or seven daily CSV exports from your CDN.
2. **Refresh the four IP lists** and run the verification step.
3. **Fill one row per token** in the sheet, verified hits only for everything after column two.
4. **Compare with last week.** Flag any search or live-fetch bot that fell to zero, any error rate above 10%, and any rise in unverified hits.
5. **Act on the flags**, and note each change in a comment column.

### A worked example: Fernway's week

Fernway is a made-up online plant shop. These are one week of its numbers, for illustration:

| Bot | Hits | Verified | Verified share | Errors | Error rate |
| --- | --- | --- | --- | --- | --- |
| GPTBot | 3,120 | 3,090 | 99.0% | 620 | 20.1% |
| OAI-SearchBot | 840 | 700 | 83.3% | 14 | 2.0% |
| ChatGPT-User | 150 | 150 | 100% | 3 | 2.0% |
| ClaudeBot | 5,400 | 5,380 | 99.6% | 1,290 | 24.0% |
| Claude-SearchBot | 310 | 310 | 100% | 6 | 1.9% |
| Claude-User | 20 | 20 | 100% | 0 | 0% |
| **Total** | **9,840** | **9,650** | | | |

Three flags come out of the arithmetic.

- **Fakes are hiding in the search bot.** 140 of the 840 OAI-SearchBot hits came from IPs outside OpenAI's list. Fernway blocks that token from unlisted IPs at the firewall. The real bot keeps its access.
- **Training bots hit dead pages.** GPTBot and ClaudeBot made 8,470 verified requests, 87.8% of the week. 1,910 of them, or 22.6%, ended in errors, mostly old product URLs. Redirecting those URLs cuts wasted load for every bot.
- **Live fetches point at useful pages.** ChatGPT-User's 150 hits and Claude-User's 20 went mostly to care guides. Those are the pages real questions pull in, so Fernway updates them first.

Search bots made 10.5% of verified hits and live fetchers 1.8%. A site can block GPTBot and ClaudeBot entirely and stay eligible for ChatGPT and Claude search, because the search bots are separate.

## Where Rankbox Fits After the Logs

Rankbox doesn't read your logs, manage your firewall or track AI citations today. The free log analyzer, the [robots.txt tester](/tools/robots-txt-tester) and the [AI robots.txt generator](/tools/ai-robots-txt-generator) cover the access side.

What the crawl sheet often shows is a short list of pages the live fetchers love, and many that no bot reads. Rankbox helps with the second group. Answer-Space Research maps the questions buyers ask AI engines, and the Citation-Ready Writer turns them into source-backed articles. The Business plan is $49.50 a month: [see pricing](/pricing). If Perplexity shows up in your logs too, our [PerplexityBot user agent guide](/blog/perplexitybot-user-agent) covers its strings and IP checks.

## Frequently Asked Questions

### How do I see if GPTBot is crawling my site?

Search your access logs for the token `GPTBot`, then check each source IP against `openai.com/gptbot.json`. On Cloudflare, AI Crawl Control lists GPTBot's requests for the last 24 hours. On Vercel, use the Firewall Traffic view or a log drain.

### How do I check ClaudeBot activity?

Search your logs for `ClaudeBot`, `Claude-SearchBot` and `Claude-User`, then check each IP against `claude.com/crawling/bots.json`. Anthropic uses that one list for all three bots, so the token is what tells you which job each request was.

### Can I verify GPTBot and ClaudeBot with reverse DNS?

No. The OpenAI and Anthropic addresses checked for this guide returned no hostname, or a generic cloud one. Both vendors publish IP lists instead, and a hit counts as real only when its source IP falls inside the matching list.

### Why don't I see GPTBot and ClaudeBot in my server logs?

Something in front of your server may be answering first. A CDN or firewall that blocks or challenges a bot stops the request before your server logs it. Check your CDN's security events, and on Cloudflare, AI Crawl Control. If robots.txt disallows a bot, expect little more than its robots.txt fetches.

### Does GPTBot activity mean ChatGPT will cite my site?

No. GPTBot collects content that may be used in training. ChatGPT search uses `OAI-SearchBot`, and live answers use `ChatGPT-User`. Track those two to judge search access, and measure citations separately with a prompt panel.

### How often should I check AI crawler logs?

Weekly works for most sites. Review verified hits, error rates and unverified traffic per bot, and check again the day after any robots.txt, CDN or firewall change. OpenAI says robots.txt changes take about 24 hours to reach its search systems.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Claude Help Center](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
3. [Log files, Apache HTTP Server 2.4 documentation](https://httpd.apache.org/docs/2.4/logs.html)
4. [Module ngx_http_log_module, NGINX](https://nginx.org/en/docs/http/ngx_http_log_module.html)
5. [Distros default layout, Apache HTTP Server wiki](https://cwiki.apache.org/confluence/display/httpd/DistrosDefaultLayout)
6. [Restoring original visitor IPs, Cloudflare docs](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/)
7. [Analyze AI traffic, Cloudflare AI Crawl Control docs](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/)
8. [Get started with AI Crawl Control, Cloudflare docs](https://developers.cloudflare.com/ai-crawl-control/get-started/)
9. [Logpush, Cloudflare docs](https://developers.cloudflare.com/logs/logpush/)
10. [Runtime logs, Vercel docs](https://vercel.com/docs/logs/runtime)
11. [Log Drains reference, Vercel docs](https://vercel.com/docs/drains/reference/logs)
12. [Firewall observability, Vercel docs](https://vercel.com/docs/vercel-firewall/firewall-observability)
13. [Standard logging reference, Amazon CloudFront Developer Guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/standard-logs-reference.html)
