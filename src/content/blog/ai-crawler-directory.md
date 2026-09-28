---
title: The AI Crawler Directory
description: Every AI crawler in one table: user-agent tokens, training vs search jobs, IP lists and robots.txt behavior, plus tested NGINX and .htaccess rules.
keyword: AI crawler
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

This AI crawler directory lists every AI bot that its vendor documents, with four facts for each: the user-agent token to match, the job it does (training, search or a live fetch for one person), how to prove a request is real, and what the vendor says about robots.txt. Every row comes from the vendor's own pages, not from third-party bot lists. Where a vendor documents nothing, the table says so.

**Last checked 28 September 2026.** This page is a living reference. Each month the vendor pages and IP lists are rechecked, and every change is dated in the changelog near the end.

AI crawler documentation is scattered across more than a dozen help pages, each in a different format. OpenAI documents four bots, Anthropic three, Google a token that never shows up in your logs, and xAI nothing at all. The traffic is lopsided too. In the week to 28 September 2026, [Cloudflare Radar](https://radar.cloudflare.com/ai-insights) put 43.6% of AI bot traffic down to training and another 39.5% to mixed training and search. User actions, a person asking a question, made up 3.2%.

Below you'll find the master table, the verification method behind each row, what AI crawlers cost your server next to Googlebot, robots.txt, .htaccess and NGINX rules checked on real servers, and log one-liners. For the concepts, see our glossary entry on [AI crawlers](/glossary/ai-crawlers).

## Key Takeaways

- Most vendors now run a separate bot for each job, so you can refuse training and stay in AI search: block `GPTBot`, keep `OAI-SearchBot`. Anthropic, Mistral and Amazon split their bots the same way.
- `Google-Extended` and `Applebot-Extended` are robots.txt tokens, not crawlers. They never appear in logs, and no firewall rule can match them.
- Live fetchers are where robots.txt gets weak. OpenAI, Perplexity, Google, Meta and Amazon say theirs may skip or ignore it. Anthropic, Mistral and DuckDuckGo say theirs follow it.
- Nine vendors publish raw JSON IP lists in the same format, so one script checks them all. Meta, ByteDance, xAI and DeepSeek publish no list.
- Match an AI crawler on its user agent only to block, never to allow. A faked name that gets blocked costs you nothing. A faked name that gets allowed lets a scraper in.
- AI crawlers still take far more than they send back. In the week to 28 September 2026, Cloudflare Radar counted about 278 crawls per referral for OpenAI, 543 for Anthropic and 2,800 for Perplexity, against 5 for Google.
- Serve robots.txt to every bot, even the ones you block. Under RFC 9309, a 4xx on robots.txt means "no rules", and Anthropic warns that IP blocks stop it reading your opt-out.

## How to Read This AI Crawler Directory

Every AI crawler in the table does one of five jobs. The job decides what a block costs you.

- **Training:** collects pages that may train future models. Blocking it changes what the next model knows, not today's answers.
- **Search:** builds the index an AI answer engine searches. Block it and you drop out of that engine's cited answers.
- **Live fetch:** reads one page because a person asked a question. Vendors often exempt these from robots.txt.
- **Token:** a robots.txt name with no crawler behind it. It tells the vendor how to use what another bot fetched.
- **Agent:** a cloud browser acting for a user. It proves who it is with a signature, not a name.

### The Proof Ladder

Anyone can type "GPTBot" into a user-agent header. So the column that matters most is proof: how you can tell a real AI crawler from a scraper wearing its name. We call the five levels the Proof Ladder. Each AI crawler sits on the highest rung its vendor supports.

| Rung | What proves the request is real | Bots on this rung |
| --- | --- | --- |
| 1. Signed | A Web Bot Auth signature (RFC 9421) checked against the vendor's public keys | ChatGPT agent, Manus, YouBot; Google is testing it |
| 2. DNS | Reverse DNS lands on the vendor's domain, and forward DNS points back | Googlebot, Bingbot, Applebot, CCBot, YouBot |
| 3. IP list | The source IP sits in a range the vendor publishes | OpenAI, Anthropic, Perplexity, Amazon, Mistral, DuckDuckGo |
| 4. Name only | A documented token, but no way to check it | Meta's bots, `MistralAI-Training` |
| 5. Nothing | No vendor documentation at all | `Bytespider`, xAI's fetches, DeepSeek |

The rule that follows is simple. **Allow only from rungs 1 to 3. Block at any rung.** A block on a user agent is safe even if the name is faked, because the faker gets blocked too. An allow on a user agent alone, such as a firewall skip rule that matches "PerplexityBot", opens a hole for every scraper that copies the string.

## The Master Table: Every AI Crawler by Vendor

Tokens are what to match in logs and robots.txt. The robots.txt column paraphrases or quotes the vendor. "Proof" uses the rungs above.

| Token | Vendor | Job | robots.txt, per the vendor | Proof |
| --- | --- | --- | --- | --- |
| `GPTBot` | OpenAI | Training | Yes: a block means "should not be used in training" | IP list |
| `OAI-SearchBot` | OpenAI | Search | Yes; blocked sites may still show as links | IP list |
| `ChatGPT-User` | OpenAI | Live fetch | "May not apply" | IP list |
| `OAI-AdsBot` | OpenAI | Ad page review | Not stated; visits submitted ad pages only | IP list |
| None (ChatGPT agent) | OpenAI | Agent | Not stated | Signed |
| `ClaudeBot` | Anthropic | Training | Yes, plus Crawl-delay | IP list |
| `Claude-SearchBot` | Anthropic | Search | Yes, plus Crawl-delay | IP list |
| `Claude-User` | Anthropic | Live fetch | Yes, plus Crawl-delay | IP list |
| `PerplexityBot` | Perplexity | Search; "not used" for AI models | Yes | IP list |
| `Perplexity-User` | Perplexity | Live fetch | "Generally ignores" | IP list |
| `Googlebot` | Google | Search, incl. AI Overviews and AI Mode | Yes | DNS, IP list |
| `Google-Extended` | Google | Token: Gemini training and grounding | Yes (token only) | No traffic |
| `Google-CloudVertexBot` | Google | Owner-requested Vertex AI crawls | Yes; falls back to Googlebot rules | DNS, IP list |
| `Google-Agent` | Google | Agent | Ignored (user-triggered) | IP list |
| `Google-GeminiNotebook` | Google | Live fetch | Ignored (user-triggered) | IP list |
| `Applebot` | Apple | Search; data may train | Yes; uses Googlebot rules if unnamed | DNS, IP list |
| `Applebot-Extended` | Apple | Token: training opt-out | Yes (token only) | No traffic |
| `bingbot` | Microsoft | Search (Bing's index, which Copilot uses) | Yes, plus Crawl-delay | DNS, IP list |
| `meta-externalagent` | Meta | Training or product indexing | Yes | Name only |
| `meta-webindexer` | Meta | Search (Meta AI) | Yes | Name only |
| `meta-externalfetcher` | Meta | Live fetch | "May bypass" | Name only |
| `Amazonbot` | Amazon | Products; may train | Yes; no Crawl-delay | IP list |
| `Amzn-SearchBot` | Amazon | Search (Alexa) | Yes; copies other search bots' rules if unnamed | IP list |
| `Amzn-User` | Amazon | Live fetch | "May not follow all" | IP list |
| `MistralAI-Training` | Mistral | Training | Yes | Name only |
| `MistralAI-Index` | Mistral | Search | Yes (listed as a robots.txt tag) | IP list |
| `MistralAI-User` | Mistral | Live fetch | Token "governs" user fetches | IP list |
| `DuckAssistBot` | DuckDuckGo | Live crawl for AI answers | Yes, after 72 hours | IP list |
| `YouBot` | You.com | Search | Yes, plus Crawl-delay | Signed, DNS, IP range |
| `CCBot` | Common Crawl | Open dataset | Yes, plus Crawl-delay | DNS, IP list |
| `Bytespider` | ByteDance | Training, per Cloudflare | Undocumented | Nothing |
| `Manus-User` (unconfirmed) | Manus | Agent | Undocumented | Signed |
| None | xAI (Grok) | Live fetch | Undocumented | Nothing |
| None | DeepSeek | Unknown | Undocumented | Nothing |

### What each vendor adds to the table

**OpenAI.** Its [crawler page](https://developers.openai.com/api/docs/bots) says each setting "is independent of the others," and that when both `GPTBot` and `OAI-SearchBot` are allowed it "may use the results from just one crawl for both use cases." When either bot fetches robots.txt, it may add a `robots.txt` marker to its user agent, which helps if your logs drop paths. ChatGPT's agent sends no bot token. It [signs its requests](https://help.openai.com/en/articles/11845367-chatgpt-agent-allowlisting) with a `Signature-Agent` header of "https://chatgpt.com".

**Anthropic.** Its [help article](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) says all three bots honor robots.txt, support `Crawl-delay` and won't try to bypass CAPTCHAs. One IP list covers all three. Anthropic publishes tokens, not full user-agent strings, and asks for rules on every subdomain.

**Perplexity.** Its [crawler docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) say `Perplexity-User` "generally ignores robots.txt rules" because a person asked for the page. In August 2025, [Cloudflare reported](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) undeclared Perplexity crawling from outside its IP ranges and removed it from its verified-bot list. Perplexity [replied](https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web) that Cloudflare had confused it with a third-party browser service. On 28 September 2026, Radar's AI bot transparency table listed Perplexity as not verified.

**Google.** AI Overviews and AI Mode use Googlebot's crawl, and Google's [AI features page](https://developers.google.com/search/docs/appearance/ai-features) says robots.txt rules for Googlebot are "the control." `Google-Extended` governs training and "grounding ... in Gemini Apps and Grounding with Google Search on Vertex AI," with no effect on Search. `Google-CloudVertexBot` only crawls sites whose owners asked it to. See our [Gemini guide](/ai-seo/gemini) for what each control switches off.

**Apple, Amazon and Microsoft.** [Applebot](https://support.apple.com/en-us/119829) follows your Googlebot group when you don't name it, and ignores `Crawl-delay`. [Amzn-SearchBot](https://developer.amazon.com/amazonbot) copies the rules you give "other search bots." Amazon's bots also read a `noarchive` robots meta tag as "do not use the page for model training." Microsoft documents no Copilot crawler at all. Its [webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) say Bing and Copilot search experiences "rely on the same core crawling, indexing, and ranking foundation," which is why our [Copilot guide](/ai-seo/copilot) starts with Bingbot.

**Meta, Mistral, DuckDuckGo and You.com.** Meta's [crawler page](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) (updated 21 May 2026) says allowing `meta-webindexer` "helps us cite and link to your content in Meta AI's responses," but it lists no IP ranges. [Mistral](https://docs.mistral.ai/robots) publishes lists for its index and user bots, not for `MistralAI-Training`. DuckDuckGo says `DuckAssistBot` data "is not used in any way to train AI models." [YouBot](https://you.com/docs/youbot) caches robots.txt for 30 minutes, the shortest window here.

**Common Crawl and ByteDance.** `CCBot` builds an open archive, not a product. Mozilla found at least [64% of 47 LLMs](https://www.mozillafoundation.org/en/research/library/generative-ai-training-data/common-crawl/) released from 2019 to October 2023 trained on a filtered copy of it. ByteDance publishes no crawler page. Cloudflare's [bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/) files `Bytespider` under "AI Crawler", a category Cloudflare defines as crawling for content "used for training AI models."

### Where each vendor publishes its IP list

Nine of these vendors use the same JSON shape: a `prefixes` array of `ipv4Prefix` or `ipv6Prefix` entries. Dates are each file's own `creationTime` field on 28 September 2026. An old date isn't an error, but Microsoft asks you to refresh its list daily anyway.

| Vendor | List | List dated |
| --- | --- | --- |
| OpenAI | `openai.com/gptbot.json`, `searchbot.json`, `chatgpt-user.json`, `adsbot.json` | 22 Sep, 2 Jan, 25 Sep, 12 May 2026 |
| Anthropic | `claude.com/crawling/bots.json` (all three bots) | 18 Aug 2026 |
| Perplexity | `perplexity.com/perplexitybot.json`, `perplexity-user.json` | 7 Feb 2025, 17 Oct 2025 |
| Google | `developers.google.com/static/crawling/ipranges/common-crawlers.json` | 25 Sep 2026 |
| Apple | `search.developer.apple.com/applebot.json` | 15 Sep 2026 |
| Microsoft | `bing.com/toolbox/bingbot.json` | 3 Jan 2024 |
| Mistral | `mistral.ai/mistralai-index-ips.json`, `mistralai-user-ips.json` | 19 Apr 2026, 19 Feb 2025 |
| DuckDuckGo | `duckduckgo.com/duckassistbot.json` | 1 Sep 2026 |
| Common Crawl | `index.commoncrawl.org/ccbot.json` | 11 Aug 2026 |
| Amazon | Three web pages under `developer.amazon.com/amazonbot/` | 8 Sep 2026 (two), 4 Nov 2025 (Amzn-User) |
| You.com | One range in its docs: `68.67.112.0/24` | Not dated |

Amazon's lists are JSON pasted into HTML pages, and its SearchBot list names the field `ip_prefix` instead. Scripts that parse the other nine need a special case for it. Google's user-triggered fetchers and agents have their own files, linked from its [verification page](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests).

## GPTBot vs OAI-SearchBot: Training and Search Crawlers Side by Side

A common AI crawler question is how `OAI-SearchBot` differs from `GPTBot`. The answer is the job. [OAI-SearchBot](/glossary/oai-searchbot) decides whether ChatGPT search can show your pages. [GPTBot](/glossary/gptbot) decides whether your pages may train OpenAI's models. Block one and the other carries on.

Most vendors now follow the same pattern:

| Vendor | Training | Search index | Live fetch |
| --- | --- | --- | --- |
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | None documented | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (token) | `Googlebot` | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (token) | `Applebot` | None documented |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Amazon | `Amazonbot` | `Amzn-SearchBot` | `Amzn-User` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Microsoft | None separate | `bingbot` | None documented |
| DuckDuckGo | None ("not used in any way to train") | `DuckDuckBot` (web search) | `DuckAssistBot` |

Google and Apple differ in one way that trips people up. Their training switch is a token, not a crawler. The same Googlebot or Applebot fetch serves search, and the token tells the vendor what it may do with that fetch afterwards. So the only way to opt out of their AI training without leaving search is robots.txt.

Our [ChatGPT SEO guide](/ai-seo/chatgpt) covers what `OAI-SearchBot` does once it has your page.

## Server Overhead: What Each AI Crawler Costs Next to Googlebot

Googlebot is still the heaviest single crawler. What sets an AI crawler apart is how little traffic comes back for each page it takes. Every figure below is dated, because these numbers move fast.

### Crawls per referral, by operator

Cloudflare Radar calls this the crawl-to-refer ratio: HTML page requests from an operator's bots, divided by HTML page visits its products refer back.

| Operator | Week to 28 Sep 2026 | July 2025 |
| --- | --- | --- |
| Google | 5 : 1 | 5.4 : 1 |
| Microsoft | 43.8 : 1 | 40 : 1 |
| OpenAI | 277.6 : 1 | 1,091 : 1 |
| Anthropic | 543.1 : 1 | 38,065 : 1 |
| Perplexity | About 2,800 : 1 | 194 : 1 |
| Mistral | No referrals recorded | Not reported |

The first column is from [Radar's AI Insights](https://radar.cloudflare.com/ai-insights), the second from Cloudflare's [August 2025 analysis](https://blog.cloudflare.com/crawlers-click-ai-bots-training/). The ratios swing hard between periods, so treat any single week as a snapshot. The gap to Google holds in both, though. Radar also splits each operator's crawling by bot. That week, `GPTBot` made 75.5% of OpenAI's crawl requests and `ClaudeBot` 83.3% of Anthropic's, so training bots do most of the fetching.

### Volume and waste

- **Share of requests.** In the same Radar week, Googlebot made 23.6% of the AI bot and crawler requests Radar tracked, ahead of `ClaudeBot` at 12.8%, `meta-externalagent` at 10%, Applebot at 8.8% and Bingbot at 7.1%.
- **Reach.** Over the two months before 30 January 2026, [Cloudflare found](https://blog.cloudflare.com/uk-google-ai-crawler-policy/) Googlebot reached about 1.7 times as many unique pages as `ClaudeBot` or `GPTBot`, 3.3 times as many as Bingbot and 167 times as many as `PerplexityBot`.
- **Errors.** In [Vercel's December 2024 study](https://vercel.com/blog/the-rise-of-the-ai-crawler), 34.82% of ChatGPT's crawler fetches and 34.16% of Claude's hit 404 pages, against 8.22% for Googlebot. That month, GPTBot and Claude together made 939 million fetches, about 21% of Googlebot's 4.5 billion.
- **Refusals.** In Radar's week to 28 September 2026, 16.7% of responses to AI bots and crawlers were 403s. Many sites already turn them away.

The takeaway for a sysadmin is practical. Most of the load comes from training crawls, and in Vercel's data about a third of OpenAI's and Anthropic's fetches landed on pages that no longer exist. Fixing dead links and old sitemap entries cuts waste without blocking anyone.

### Which bots honor Crawl-delay

`Crawl-delay` is a non-standard robots.txt line that asks a bot to wait between requests. Support varies from one AI crawler to the next:

| Honors it | Ignores it, per the vendor | Vendor doesn't say |
| --- | --- | --- |
| Anthropic's bots, `CCBot`, `YouBot`, `bingbot` | Googlebot, Applebot, Amazon's bots | OpenAI, Perplexity, Meta, Mistral, DuckDuckGo |

For bots that ignore it, throttle at the server instead. The NGINX rules below include a rate limit that returns 429, the "slow down" status. [YouBot's docs](https://you.com/docs/youbot) say a 429 makes it reduce its crawl rate.

## Copy-Paste AI Crawler Rules: robots.txt, .htaccess and NGINX

Start with robots.txt. It states your policy, and every documented training and search bot reads it. Server rules are for enforcement: bots that skip robots.txt, and names you can't verify.

### robots.txt

This file keeps every search and live-fetch bot in, opts out of training and keeps one private path closed. Swap the training group to `Allow: /` if you want your pages in future models.

```robots.txt
# AI crawler policy for example.com. Last checked 28 September 2026.

# Search indexes and live fetchers: allowed
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: MistralAI-Index
User-agent: MistralAI-User
User-agent: DuckAssistBot
User-agent: meta-webindexer
User-agent: Amzn-SearchBot
Disallow: /account/

# Training: your call. This example opts out.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
User-agent: MistralAI-Training
User-agent: Amazonbot
User-agent: Bytespider
Disallow: /

# Everyone else, including Googlebot, Bingbot and Applebot
User-agent: *
Disallow: /account/

Sitemap: https://www.example.com/sitemap.xml
```

Five rules explain the layout:

1. **A named group replaces the `*` group** for that bot. [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) says a crawler obeys the group that names it and falls back to `*` only when none does, so repeat private paths in every named group.
2. **Several `User-agent` lines can share one group**, and matching is case-insensitive.
3. **Naming the search bots protects them.** If someone later adds `Disallow: /` under `*`, those bots stay in.
4. **Blocking `Google-Extended` costs more than training.** Google says it also ends grounding in the Gemini app.
5. **Changes aren't instant.** OpenAI, Perplexity and Meta allow about 24 hours, DuckDuckGo 72, and Amazon may use a cached copy up to 30 days old.

Our free [AI robots.txt generator](/tools/ai-robots-txt-generator) builds this file bot by bot, and the [robots.txt tester](/tools/robots-txt-tester) checks a URL against it.

### Apache (.htaccess)

This rule refuses the training crawlers with a 403 but still serves robots.txt to them. Both details matter. RFC 9309 says a crawler that gets a 4xx for robots.txt "MAY access any resources," and Anthropic warns that blocking by IP "impedes our ability to read your robots.txt file." Your opt-out has to stay readable.

```apache
# AI crawler rules for Apache 2.4 (.htaccess needs AllowOverride FileInfo)
# Refuses training crawlers, but every bot can still read robots.txt
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/robots\.txt$
RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|CCBot|Bytespider|meta-externalagent|MistralAI-Training) [NC]
RewriteRule ^ - [F]
```

In [Apache's flag docs](https://httpd.apache.org/docs/2.4/rewrite/flags.html), `-` means "no substitution" and `[F]` returns 403 and stops further rules. On Apache 2.4.62, the rule returned 403 to each listed bot, 200 to the same bots for robots.txt, and 200 to `OAI-SearchBot` and ordinary browsers. Without mod_rewrite, this version does the same job and also needs `AllowOverride AuthConfig`:

```apache
SetEnvIfNoCase User-Agent "(GPTBot|ClaudeBot|CCBot|Bytespider|meta-externalagent|MistralAI-Training)" ai_training
SetEnvIf Request_URI "^/robots\.txt$" !ai_training
<RequireAll>
    Require all granted
    Require not env ai_training
</RequireAll>
```

### NGINX

The NGINX version does three things: refuses training crawlers, refuses anything that claims to be `OAI-SearchBot` from outside OpenAI's published IPs, and slows bots that ignore `Crawl-delay`. robots.txt is exempt from all three. Put this file in the `http` block:

```nginx
# AI crawler rules for NGINX: /etc/nginx/conf.d/ai-crawlers.conf (http context)

# 1. Training crawlers you have decided to refuse
map $http_user_agent $ai_training_ua {
    default 0;
    "~*(GPTBot|ClaudeBot|CCBot|Bytespider|MistralAI-Training|meta-externalagent)" 1;
}

# 2. Requests that claim to be OAI-SearchBot, and OpenAI's published IPs
map $http_user_agent $claims_oai_search {
    default 0;
    "~*OAI-SearchBot" 1;
}
geo $oai_search_ip {
    default 0;
    include /etc/nginx/ai-ips/oai-searchbot.conf;
}

# 3. robots.txt stays readable for every bot
map $uri $is_robots_txt {
    default 0;
    /robots.txt 1;
}
map "$is_robots_txt$ai_training_ua" $refuse_training {
    default 0;
    "01" 1;
}
map "$is_robots_txt$claims_oai_search$oai_search_ip" $refuse_fake_bot {
    default 0;
    "010" 1;
}

# 4. Slow down, rather than refuse, bots that ignore Crawl-delay
map "$is_robots_txt:$http_user_agent" $ai_throttle_key {
    default "";
    "~*^0:.*(Amazonbot|Applebot)" $binary_remote_addr;
}
limit_req_zone $ai_throttle_key zone=ai_throttle:10m rate=1r/s;
```

Then add four lines to each `server` block:

```nginx
if ($refuse_training) { return 403; }
if ($refuse_fake_bot) { return 403; }
limit_req zone=ai_throttle burst=5 nodelay;
limit_req_status 429;
```

Build the IP file from OpenAI's list with `jq`, and refresh it on a daily cron. The size check stops a failed download from emptying the file, which would refuse the real bot:

```bash
curl -sf https://openai.com/searchbot.json \
  | jq -r '.prefixes[] | (.ipv4Prefix // .ipv6Prefix) + " 1;"' > /tmp/oai-searchbot.conf \
  && [ -s /tmp/oai-searchbot.conf ] \
  && mv /tmp/oai-searchbot.conf /etc/nginx/ai-ips/oai-searchbot.conf \
  && nginx -t && nginx -s reload
```

Each line checks out against the NGINX docs. The [`map`](https://nginx.org/en/docs/http/ngx_http_map_module.html) module takes `~*` for a case-insensitive regex and accepts several variables as its source. [`geo`](https://nginx.org/en/docs/http/ngx_http_geo_module.html) reads CIDR lines from an included file. And in [`limit_req_zone`](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html), "requests with an empty key value are not accounted," so only the named bots are limited. On NGINX 1.24.0 the config passed `nginx -t` (that build lacks the geo module, so an exact-IP `map` stood in for it). It returned 403 to `GPTBot`, 403 to a fake `OAI-SearchBot`, 200 once the test IP was on the list, and 429 to Applebot after its burst, while robots.txt always returned 200. Copy the `claims` and `geo` pair for any other bot with an IP list. One warning: behind a CDN or load balancer, `$remote_addr` is the proxy's address. Set up the realip module first, or the fake-bot rule will refuse the real bot.

### What not to block

Never block Googlebot, Bingbot or Applebot to stop AI training. They are search crawlers first, and blocking them removes you from Google, Bing, Copilot and Siri results. Use `Google-Extended` and `Applebot-Extended` in robots.txt instead. CDN settings can do this by accident: under Cloudflare's [new defaults](https://blog.cloudflare.com/content-independence-day-ai-options/), customers who block Training also block multi-purpose crawlers such as Googlebot, Applebot and Bingbot. Our [Cloudflare audit guide](/blog/cloudflare-challenge-trap) shows where to check.

## How to Track GPTBot and ClaudeBot Crawling Activity

Every AI crawler leaves its token in your access log. The commands below read logs in the "combined" format that Apache and NGINX both ship. Splitting each line on double quotes puts the request in field 2, status and bytes in field 3 and the user agent in field 6. Swap in any tokens from the master table. If you sit behind a CDN, make sure the log records the visitor's IP, not the CDN's, or the IP checks below will fail every bot.

1. **Daily hits per bot.** A sudden drop to zero usually means a CDN or firewall change, not a bot policy change.

```bash
awk -F'"' '$6 ~ /GPTBot|ClaudeBot/ { split($1, a, " "); split(a[4], d, ":");
  match($6, /GPTBot|ClaudeBot/); print substr(d[1], 2), substr($6, RSTART, RLENGTH) }' access.log \
  | sort | uniq -c
```

2. **Pages each bot wants most.** For a live fetcher such as `ChatGPT-User`, this is the list of pages real questions pull into answers.

```bash
awk -F'"' '$6 ~ /ClaudeBot/ { split($2, r, " "); print r[2] }' access.log | sort | uniq -c | sort -rn | head -20
```

3. **Requests, megabytes and errors per bot, with Googlebot for scale.** This is your own server-overhead report.

```bash
awk -F'"' 'match($6, /GPTBot|ClaudeBot|OAI-SearchBot|PerplexityBot|Googlebot|bingbot/) {
  bot = substr($6, RSTART, RLENGTH); split($3, s, " "); n[bot]++; mb[bot] += s[2] / 1048576;
  if (s[1] >= 400) err[bot]++ }
  END { for (b in n) printf "%-14s %8d req %9.1f MB %7d errors\n", b, n[b], mb[b], err[b] }' access.log
```

4. **Check every claimed bot against its vendor's IP list.** This script handles the nine lists that share one JSON format. It assumes the first field of each line is the client IP.

```python
# Checks each AI crawler hit against its vendor's IP list.
# Usage: python3 verify_ai_bots.py access.log
import ipaddress, json, subprocess, sys

LISTS = {
    "GPTBot": "https://openai.com/gptbot.json",
    "OAI-SearchBot": "https://openai.com/searchbot.json",
    "ChatGPT-User": "https://openai.com/chatgpt-user.json",
    "ClaudeBot": "https://claude.com/crawling/bots.json",
    "Claude-SearchBot": "https://claude.com/crawling/bots.json",
    "Claude-User": "https://claude.com/crawling/bots.json",
    "PerplexityBot": "https://www.perplexity.com/perplexitybot.json",
    "Perplexity-User": "https://www.perplexity.com/perplexity-user.json",
    "Googlebot": "https://developers.google.com/static/crawling/ipranges/common-crawlers.json",
    "bingbot": "https://www.bing.com/toolbox/bingbot.json",
    "Applebot": "https://search.developer.apple.com/applebot.json",
    "CCBot": "https://index.commoncrawl.org/ccbot.json",
    "DuckAssistBot": "https://duckduckgo.com/duckassistbot.json",
    "MistralAI-User": "https://mistral.ai/mistralai-user-ips.json",
    "MistralAI-Index": "https://mistral.ai/mistralai-index-ips.json",
}
cache, result = {}, {}

def networks(url):
    if url not in cache:
        raw = subprocess.run(["curl", "-sL", url], capture_output=True, text=True).stdout
        cache[url] = [ipaddress.ip_network(v) for p in json.loads(raw)["prefixes"] for v in p.values()]
    return cache[url]

for line in open(sys.argv[1], errors="ignore"):
    bot = next((b for b in LISTS if b in line), None)
    if bot:
        ip = ipaddress.ip_address(line.split()[0])
        ok = any(ip in net for net in networks(LISTS[bot]))
        result.setdefault(bot, {True: set(), False: set()})[ok].add(str(ip))

for bot, r in result.items():
    print(f"{bot:16} verified: {len(r[True]):4}  unverified: {len(r[False]):4}  {sorted(r[False])[:3]}")
```

5. **Confirm DNS-verified crawlers.** For Googlebot, Bingbot, Applebot and `CCBot`, a real request resolves to the vendor's domain and back. A result of 1 means the round trip matched.

```bash
for ip in $(awk -F'"' '$6 ~ /Googlebot|bingbot|Applebot|CCBot/ { split($1, a, " "); print a[1] }' access.log | sort -u | head -20); do
  name=$(host "$ip" | awk '/pointer/ { print $NF }' | head -1)
  echo "$ip ${name:-no-PTR} $(host "$name" 2>/dev/null | grep -cF "$ip")"
done
```

Expect `googlebot.com` or `google.com`, `search.msn.com`, `applebot.apple.com` and `crawl.commoncrawl.org`. Signed agents such as ChatGPT's need a CDN that validates signatures, but you can at least log the claim: add `sig="$http_signature_agent"` to an NGINX `log_format`.

### A worked example: Plannora's crawl ledger

Plannora is a made-up project management app. Its admin runs command 3 on 30 days of logs, then pulls referral sessions from GA4. The numbers are illustrative.

| Bot | Requests | Errors | Error rate | Referrals from the same vendor | Crawls per referral |
| --- | --- | --- | --- | --- | --- |
| Googlebot | 42,000 | 1,260 | 3% | 9,800 (Google organic) | 4.3 |
| `GPTBot` + `OAI-SearchBot` | 20,400 | 5,520 | 27% | 180 (chatgpt.com) | 113 |
| `ClaudeBot` | 9,500 | 3,040 | 32% | 6 (claude.ai) | 1,583 |
| `PerplexityBot` | 300 | 6 | 2% | 24 (perplexity.ai) | 12.5 |

Two actions fall out of the arithmetic. First, 8,566 of the 30,200 AI crawler requests (28%) hit errors, mostly old URLs. Redirecting those cuts load for every bot at once. Second, Anthropic sends back almost nothing in visits for its crawling, so Plannora makes its `ClaudeBot` call on principle, not traffic. It keeps `Claude-SearchBot` and `Claude-User` open either way. For measuring what those visits are worth, see our guide to [measuring GEO](/blog/how-to-measure-geo).

Not a terminal person? Paste a day of logs into our free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer). It runs in your browser and uploads nothing.

## What This AI Crawler Directory Leaves Out, and Why

An AI crawler directory is only useful if every row is real. These were left out on purpose:

- **xAI.** No crawler page, token or IP list. Cloudflare wrote in September 2025 that "xAI's bot, grok, does not self-identify at all." Names such as `GrokBot` come from third-party lists.
- **DeepSeek.** No crawler documentation. `DeepSeekBot` appears only in third-party directories.
- **Cohere.** Its [crawler policy](https://docs.cohere.com/docs/cohere-web-crawlers) says it doesn't use bots to crawl for training "at this time." `cohere-ai` is a third-party label.
- **Manus, as a full row.** Manus publishes no working bot page. Radar's directory links to a help page that returns 404, and lists a signing key instead. `Manus-User` comes from third-party records, so it's marked unconfirmed.
- **Copilot and Brave.** Neither has a user agent of its own. Vercel left Copilot out of its study for that reason, and Brave says its crawler "does not advertise a differentiated user agent." [Brave](https://search.brave.com/help/brave-search-crawler) also won't crawl what Googlebot can't, so a Googlebot block reaches it too.
- **Agentic browsers** such as Perplexity's Comet. They run in the user's own browser, so they look like people.
- **Retired names.** `FacebookBot` is gone from Meta's current page, and `Google-NotebookLM` was supported only until August 2026.
- **Ad and preview bots**, such as `AdIdxBot`, `facebookexternalhit` and `meta-externalads`. They aren't AI crawlers.
- **Smaller research and data crawlers.** Cloudflare's Radar bot directory lists many more. Rows get added here once their vendor documents them.

## Changelog: Last Checked 28 September 2026

Recent AI crawler changes, newest first:

- **28 Sep 2026:** Full recheck of every vendor page and IP list. Radar's crawl-to-refer figures added.
- **15 Sep 2026:** Cloudflare's new default took effect: new domains block Training and Agent bots on ad-carrying pages.
- **August 2026:** Google's `Google-NotebookLM` fetcher reached its end date, replaced by `Google-GeminiNotebook`. Anthropic's IP list carries an 18 August date.
- **14 July 2026:** Google updated its common crawlers page, home of `Google-Extended` and `Google-CloudVertexBot`.
- **21 May 2026:** Meta updated its crawler page. `FacebookBot` isn't on it.
- **7 April 2026:** Anthropic updated its crawler article. Mistral's index IP list is dated 19 April.

The monthly check has three steps. Diff each vendor page in the references. Compare each IP list's `creationTime` with last month's. Then scan Radar's verified-bot directory for operators that newly document a bot.

## Where Rankbox Fits

Rankbox doesn't manage robots.txt, CDN or firewall settings for you, and it doesn't track AI citations today. For access, use the free tools linked above: the robots.txt generator, the tester and the log analyzer.

Once an AI crawler can reach you, Rankbox helps with what it reads. Its Citation-Ready Writer researches the live web and writes source-backed articles of 2,000 to 3,500 words, and Answer-Space Research maps the questions buyers ask AI engines. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### What is OAI-SearchBot?

`OAI-SearchBot` is OpenAI's search crawler. It decides whether your pages can appear in ChatGPT search answers, and it is separate from `GPTBot`, which collects training data. OpenAI publishes its IP ranges at `openai.com/searchbot.json` and says robots.txt changes take about 24 hours. See our [OAI-SearchBot glossary entry](/glossary/oai-searchbot).

### Where is the PerplexityBot user agent documented?

Perplexity documents it on its crawler page at docs.perplexity.ai: `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)`. The page lists its IP file, says it isn't used to train AI models, and gives Cloudflare and AWS WAF allow-rule steps. It follows robots.txt, with changes taking up to 24 hours. `Perplexity-User` has its own string and IP file.

### How do I track GPTBot and ClaudeBot crawling activity?

Search your access logs for the tokens `GPTBot` and `ClaudeBot`, count hits per day and per URL, then check each source IP against `openai.com/gptbot.json` and `claude.com/crawling/bots.json`. The one-liners above do all three for any AI crawler with a published list. A free log analyzer works too.

### Which AI crawler ignores robots.txt?

User-triggered fetchers are the usual exceptions. Perplexity says `Perplexity-User` "generally ignores" robots.txt. OpenAI says the rules "may not apply" to `ChatGPT-User`. Google, Meta and Amazon say similar things about their user-triggered bots. Undocumented crawlers such as `Bytespider` make no promise either way.

### Does blocking GPTBot remove my site from ChatGPT?

No. `GPTBot` only governs training. ChatGPT search uses `OAI-SearchBot`, and OpenAI says each setting is independent. Block `GPTBot`, keep `OAI-SearchBot` allowed, and your pages stay eligible for ChatGPT search.

### How do I verify that an AI crawler is real?

Check the source IP against the vendor's published list, or run reverse and forward DNS for Google, Bing, Apple and Common Crawl. For signed agents, have your CDN validate the Web Bot Auth signature. If a vendor offers none of these, block by name if you must, but never allow by name.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [ChatGPT Work's Cloud browser allowlisting, OpenAI Help Center](https://help.openai.com/en/articles/11845367-chatgpt-agent-allowlisting)
3. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Claude Help Center](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
4. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
5. [Google's common crawlers, Google Crawling Infrastructure](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
6. [Google's user-triggered fetchers, Google Crawling Infrastructure](https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers)
7. [Verify requests from Google crawlers and fetchers, Google](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests)
8. [About Applebot, Apple Support](https://support.apple.com/en-us/119829)
9. [Which crawlers does Bing use?, Bing Webmaster Tools](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0)
10. [Meta web crawlers, Meta for Developers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/)
11. [Amazonbot, Amazon Developer](https://developer.amazon.com/amazonbot)
12. [Mistral crawlers, Mistral Docs](https://docs.mistral.ai/robots)
13. [DuckAssistBot, DuckDuckGo Help](https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot)
14. [CCBot, Common Crawl](https://commoncrawl.org/ccbot)
15. [AI Insights, Cloudflare Radar](https://radar.cloudflare.com/ai-insights)
16. [The crawl-to-click gap, Cloudflare](https://blog.cloudflare.com/crawlers-click-ai-bots-training/)
17. [Google's AI advantage: why crawler separation is the only path to a fair Internet, Cloudflare](https://blog.cloudflare.com/uk-google-ai-crawler-policy/)
18. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
19. [RFC 9309: Robots Exclusion Protocol, IETF](https://www.rfc-editor.org/rfc/rfc9309.html)
20. [ngx_http_map_module, NGINX](https://nginx.org/en/docs/http/ngx_http_map_module.html)
