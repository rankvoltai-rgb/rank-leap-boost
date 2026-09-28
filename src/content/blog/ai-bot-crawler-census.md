---
title: The AI Bot Crawler Census
description: The AI bot crawler census, Q3 2026: robots.txt rules from 21,353 sites show who blocks GPTBot, ClaudeBot, PerplexityBot and OAI-SearchBot.
keyword: AI bot
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Research
---

The AI Bot Crawler Census is Rankbox's count of who blocks which AI bot in robots.txt. On 28 September 2026 the crawl read the robots.txt files of 21,353 sites and tested 18 bot tokens against each one. News and media sites block hard: 47.56% fully block OpenAI's GPTBot, 50.24% block Anthropic's ClaudeBot and 45.12% block PerplexityBot. Online retailers and the Fortune 500 rarely do.

Many publishers also draw a line inside each vendor, shutting out the training bot and letting the search bot in. Of the 195 news sites that fully block GPTBot, 78 still let OAI-SearchBot, the crawler behind ChatGPT search, read their pages.

This is the Q3 2026 edition of a quarterly benchmark, and Rankbox will re-run the same crawl every quarter. Debates about AI bot blocking tend to run on opinion or on small samples of news sites, while the traffic keeps shifting. Cloudflare says [52% of crawler requests were for AI training](https://blog.cloudflare.com/agentic-internet-bot-report/) in June 2026, up from 22% in spring 2025.

Below: block rates by bot and industry, split policies, OAI-SearchBot, how sites write their rules, public log data, and what vendors say happens when you block their search bots. For user-agent tokens and IP lists, see the [AI crawler directory](/blog/ai-crawler-directory). For firewalls that stop bots before robots.txt matters, see [the Cloudflare challenge trap](/blog/cloudflare-challenge-trap).

To turn these base rates into a baseline for your own brand, see [how to benchmark AI search performance](/blog/how-to-benchmark-ai-search-performance).

## Key Takeaways

- News and media sites block far more than the plan predicted: GPTBot 47.56% (hypothesis about 35%), ClaudeBot 50.24% (about 25%) and PerplexityBot 45.12% (about 18%).
- E-commerce and the Fortune 500 rarely block an AI bot: only 7.07% and 2.71% fully block GPTBot.
- Publishers split training from search. 40% of the news sites that block GPTBot keep OAI-SearchBot open, and 178 of the 179 that block Google-Extended still let Googlebot in.
- OAI-SearchBot is blocked by 28.78% of news sites, 3.54% of retailers and 0.81% of the Fortune 500. OpenAI says blocked sites drop out of ChatGPT search answers, except as navigational links.
- Almost every AI bot block names the bot. In the news and e-commerce top 1,000, 207 of 217 GPTBot blocks name GPTBot rather than relying on a wildcard.
- A quarter of e-commerce sites (25.1%) wouldn't serve robots.txt to the census crawler at all. For retailers, the firewall may be the real gate.
- Content-Signal lines appear in 4.6% of robots.txt files, and among the most common values, more lines allow AI training than refuse it. Just 2.2% of sites block every crawler.

## The Q3 2026 Census: Block Rates for Each AI Bot

A site counts as blocking an AI bot when its robots.txt disallows both the homepage and a deep page for that bot's token. Each rate is a share of sites that served a readable robots.txt. The Methodology section has the full rules.

![Grouped bar chart of the share of news and media, e-commerce and Tranco top 10,000 robots.txt files that fully block each AI bot, from GPTBot to Googlebot](figure:study/ai-bot-blocking "Share of parsed robots.txt files that fully block each AI bot, 28 September 2026. News sites block the most, and block search bots less often than training bots; retailers and the wider web rarely block either.")

### Hypothesis vs finding

The content plan predicted block rates for three bots across the top 1,000 news, media and e-commerce domains. Here are the results, with that pool split in two.

| Bot | Plan's hypothesis | News & media (top 500) | E-commerce (top 500) | Both groups together (top 1,000) |
| --- | --- | --- | --- | --- |
| GPTBot | ~35% | 47.56% | 7.07% | 30.1% |
| ClaudeBot | ~25% | 50.24% | 6.75% | 31.48% |
| PerplexityBot | ~18% | 45.12% | 4.18% | 27.46% |

Three things differ from the plan.

1. **The ladder isn't there.** The plan expected GPTBot to be blocked most, then ClaudeBot, then PerplexityBot. In news and in the combined pool, ClaudeBot is blocked slightly more often than GPTBot, and PerplexityBot trails by only a few points.
2. **The pooled numbers hide two worlds.** The combined GPTBot rate of 30.1% sits near the plan's 35%, but it averages a group blocking at almost 48% with one blocking at 7%.
3. **PerplexityBot isn't a training bot.** Perplexity says it exists to [surface and link websites](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) in search results and "is not used to crawl content for AI foundation models." The 45.12% of news sites that block it are opting out of Perplexity search.

### Every AI bot, every group

The census checked 18 tokens. Googlebot and Bingbot are there as a baseline.

| Bot | News & media | E-commerce | Fortune 500 | Tranco top 10,000 | Software & SaaS | All sites |
| --- | --- | --- | --- | --- | --- | --- |
| GPTBot | 47.56% | 7.07% | 2.71% | 15.83% | 3.22% | 7.66% |
| OAI-SearchBot | 28.78% | 3.54% | 0.81% | 8% | 1.28% | 3.66% |
| ChatGPT-User | 35.12% | 3.86% | 0.81% | 10% | 1.45% | 4.48% |
| ClaudeBot | 50.24% | 6.75% | 2.44% | 14.64% | 2.75% | 6.92% |
| Claude-SearchBot | 25.12% | 3.86% | 1.08% | 7.56% | 1.18% | 3.45% |
| Claude-User | 25.12% | 4.18% | 0.81% | 7.71% | 1.13% | 3.47% |
| anthropic-ai | 47.07% | 3.54% | 1.63% | 12.36% | 2.46% | 5.93% |
| PerplexityBot | 45.12% | 4.18% | 0.81% | 11.34% | 1.45% | 4.93% |
| Perplexity-User | 27.07% | 4.18% | 1.08% | 8.23% | 1.19% | 3.67% |
| Google-Extended | 43.66% | 6.11% | 2.17% | 12.97% | 2.51% | 6.18% |
| Applebot-Extended | 44.63% | 3.86% | 2.17% | 12.36% | 2.48% | 5.94% |
| CCBot | 54.88% | 8.68% | 2.71% | 16.98% | 4.5% | 8.86% |
| Bytespider | 50.73% | 9.65% | 2.98% | 16.29% | 5.42% | 9.18% |
| meta-externalagent | 40.49% | 6.75% | 2.17% | 13.22% | 2.72% | 6.39% |
| Amazonbot | 40% | 6.11% | 1.63% | 12.15% | 2.72% | 6.03% |
| cohere-ai | 43.41% | 5.47% | 1.9% | 12.51% | 2.23% | 5.83% |
| Googlebot | 0.24% | 0.64% | 0% | 2.38% | 0.82% | 1.37% |
| Bingbot | 0.73% | 0.64% | 0% | 2.84% | 0.95% | 1.62% |
| *Files parsed* | *410* | *311* | *369* | *4,789* | *8,391* | *13,359* |

A few patterns stand out:

- **GPTBot is never the most-blocked token.** Common Crawl's CCBot or ByteDance's Bytespider tops every group. In news, CCBot leads at 54.88%.
- **Each vendor's search bot is blocked less than its training bot, in every group.** In news, GPTBot is blocked 18.78 points more often than OAI-SearchBot.
- **Googlebot and Bingbot are almost never blocked.** Even in news, only 0.24% of files block Googlebot.
- **The top 10,000 sits in between.** Tranco's top 10,000 blocks GPTBot at 15.83%. More than one in five of its sites (22.1%) fully blocks at least one AI bot, against 62.2% in news and 12.2% across all 13,359 files.

## Training Bots Out, Search Bots In: The Split-Door Rate

Most AI vendors now run a separate bot for each job. OpenAI's [GPTBot](/glossary/gptbot) gathers training data, while OAI-SearchBot builds the ChatGPT search index. Anthropic splits [ClaudeBot](/glossary/claudebot) and Claude-SearchBot the same way. So a site can refuse training without leaving AI search.

This census measures that choice with one number. **The Split-Door Rate is the share of sites that fully block a vendor's training bot but leave its search bot open.**

| Group | Sites blocking GPTBot | …that keep OAI-SearchBot open | Split-Door Rate, OpenAI | Split-Door Rate, Anthropic |
| --- | --- | --- | --- | --- |
| News & media | 195 | 78 | 40.0% | 50.0% |
| E-commerce | 22 | 13 | 59.1% | 47.6% |
| News, media & e-commerce | 217 | 91 | 41.9% | 49.8% |
| Fortune 500 | 10 | 7 | 70.0% | 55.6% |
| Tranco top 10,000 | 758 | 379 | 50.0% | 48.5% |
| Software & SaaS | 270 | 166 | 61.5% | 58.9% |
| All sites | 1,023 | 542 | 53.0% | 50.8% |

Each rate divides the blockers that keep the search bot open by all blockers of the training bot. The Fortune 500 row rests on just 10 sites, so read it as a hint.

The rule of thumb that falls out is simple. **Outside news, about half or more of the sites that shut out a training bot leave the matching search bot open. In news, it's four in ten for OpenAI and half for Anthropic.**

The reverse almost never happens. Across all 13,359 files, only 8 sites block OAI-SearchBot while letting GPTBot in.

Google's split is starker. [Google-Extended](/glossary/google-extended) is a token for Gemini training and grounding that Google says "[does not impact a site's inclusion in Google Search](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)." Of the 179 news sites that block it, 178 still let Googlebot in.

### Which publishers block GPTBot, and which don't

Among the largest news and media sites by Tranco rank, these fully block GPTBot: nytimes.com, cnn.com, t-online.de, forbes.com, bbc.com, reuters.com, globo.com, cnbc.com, usatoday.com, telegraph.co.uk, dailymail.co.uk, apnews.com, lefigaro.fr, nbcnews.com and latimes.com.

The 15 highest-ranked news sites in the census that don't fully block it are theguardian.com, washingtonpost.com, bloomberg.com, wsj.com, businessinsider.com, sina.com.cn, indiatimes.com, ft.com, wired.com, time.com, uol.com.br, elpais.com, lemonde.fr, independent.co.uk and bild.de.

Ten of those 15 belong to publishers that have announced content deals with OpenAI:

| Site | Publisher | OpenAI deal announced |
| --- | --- | --- |
| businessinsider.com, bild.de | Axel Springer | [13 December 2023](https://openai.com/index/axel-springer-partnership/) |
| lemonde.fr, elpais.com | Le Monde; Prisa Media | [13 March 2024](https://openai.com/index/global-news-partnerships-le-monde-and-prisa-media/) |
| ft.com | Financial Times | [29 April 2024](https://openai.com/index/content-partnership-with-financial-times/) |
| wsj.com | News Corp | [22 May 2024](https://openai.com/index/news-corp-and-openai-sign-landmark-multi-year-global-partnership/) |
| time.com | TIME | [27 June 2024](https://openai.com/index/strategic-content-partnership-with-time/) |
| wired.com | Condé Nast | [20 August 2024](https://openai.com/index/conde-nast/) |
| theguardian.com | Guardian Media Group | [14 February 2025](https://openai.com/index/openai-and-guardian-media-group-launch-content-partnership/) |
| washingtonpost.com | The Washington Post | [22 April 2025](https://www.cnbc.com/2025/04/22/chatgpt-adds-washington-post-openai-media-bezos-altman.html) |

A robots.txt file doesn't say why it allows an AI bot, so treat this as a pattern, not a cause. A deal doesn't always mean an open door, either: OpenAI's Condé Nast announcement lists the Associated Press among its partners, yet apnews.com blocks GPTBot (it keeps OAI-SearchBot open). And open to OpenAI isn't open to all. theguardian.com, washingtonpost.com, bloomberg.com and wsj.com leave GPTBot alone but block PerplexityBot.

### Old and unofficial tokens still get blocked

Many files carry names no vendor documents today. Anthropic's [crawler page](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) lists three bots, and none of them is `anthropic-ai`. Yet 47.07% of news sites block `anthropic-ai`, and in the news and e-commerce top 1,000 it's named in 199 files, the same number that name OAI-SearchBot.

The same goes for `cohere-ai`, blocked by 43.41% of news sites, though Cohere says it doesn't use bots [to crawl content for model training](https://docs.cohere.com/docs/cohere-web-crawlers) "at this time." These lines suggest copied blocklists. If yours has them, check it also names the bots that crawl today.

## OAI-SearchBot: Who Blocks ChatGPT's Search Crawler

[OAI-SearchBot](/glossary/oai-searchbot) is the crawler OpenAI uses to surface sites in ChatGPT search. It's separate from GPTBot, and OpenAI says each setting "is independent of the others."

| Group | GPTBot | OAI-SearchBot | ChatGPT-User |
| --- | --- | --- | --- |
| News & media | 47.56% | 28.78% | 35.12% |
| E-commerce | 7.07% | 3.54% | 3.86% |
| Fortune 500 | 2.71% | 0.81% | 0.81% |
| Tranco top 10,000 | 15.83% | 8% | 10% |
| Software & SaaS | 3.22% | 1.28% | 1.45% |
| All sites | 7.66% | 3.66% | 4.48% |

### What blocking OAI-SearchBot does

OpenAI's [crawler docs](https://developers.openai.com/api/docs/bots) are direct. Sites that opt out of OAI-SearchBot "will not be shown in ChatGPT search answers, though can still appear as navigational links." Its [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) adds a second exception. If OpenAI finds a blocked page's URL through a third-party search provider or other pages, and it looks relevant, ChatGPT Atlas "may surface just the link and page title." OpenAI says a `noindex` tag prevents that, but its crawler must be allowed to read the tag.

So a block doesn't erase a site from ChatGPT. It removes the site's text from search answers and may leave a thin trace. Our [ChatGPT SEO guide](/ai-seo/chatgpt) covers what OAI-SearchBot does with pages it can read.

### Who blocks it, and who splits

Large sites that block OAI-SearchBot include amazon.com and five other Amazon country sites, nytimes.com, cnn.com, bbc.com, cnbc.com, usatoday.com, telegraph.co.uk, dailymail.co.uk and cnet.com.

Large sites that block GPTBot but keep OAI-SearchBot open include ebay.com, alibaba.com, forbes.com, reuters.com, apnews.com, techcrunch.com, cbsnews.com, hbr.org, latimes.com, repubblica.it, corriere.it and webmd.com.

Almost every OAI-SearchBot block is deliberate. In the news and e-commerce top 1,000, 122 of its 129 full blocks come from a rule that names it.

### The ChatGPT-User puzzle

In news, more sites block ChatGPT-User (35.12%) than OAI-SearchBot (28.78%). ChatGPT-User fetches a page live when someone asks about it, and OpenAI says that for such fetches "robots.txt rules may not apply." Perplexity says Perplexity-User "generally ignores robots.txt rules," yet 27.07% of news sites block it there.

Those lines state a wish the AI bot may not follow. Stopping live fetchers takes a firewall rule, and the [Cloudflare challenge trap](/blog/cloudflare-challenge-trap) shows how to write one without catching the search bots you want.

### Block GPTBot, keep OAI-SearchBot

In robots.txt, the split takes two groups. Naming OAI-SearchBot with `Allow: /` keeps it in even if someone later adds a wildcard block:

```robots.txt
User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Allow: /
```

OpenAI says changes take about 24 hours to reach its systems. The free [AI robots.txt generator](/tools/ai-robots-txt-generator) builds the full file bot by bot, and the [robots.txt tester](/tools/robots-txt-tester) checks any URL against each AI bot token before you ship it.

## Retailers and the Fortune 500: Few Blocks, More Firewalls

Only 14.1% of e-commerce sites fully block at least one AI bot, against 62.2% of news sites. The Fortune 500 sits at 3.8%, software and SaaS companies at 7.0%.

The retailers that do block an AI bot include some of the largest. amazon.com, amazon.co.uk, amazon.co.jp, amazon.fr, amazon.ca and amazon.in all fully block GPTBot, as do ebay.com, alibaba.com, mercadolibre.com, instacart.com, zalando.de and vinted.com. They split on search: eBay and Alibaba keep OAI-SearchBot open, while Amazon's sites block it.

### The firewall gate robots.txt can't show

Some sites wouldn't serve robots.txt to the census crawler at all. They returned 401, 403 or 429, or a bot challenge page.

| Group | Sites answering | robots.txt parsed | No robots.txt (404/410) | robots.txt blocked for the census bot | HTML instead of robots.txt |
| --- | --- | --- | --- | --- | --- |
| News & media | 446 | 410 | 5 | 21 (4.7%) | 8 |
| E-commerce | 458 | 311 | 10 | 115 (25.1%) | 11 |
| Fortune 500 | 472 | 369 | 20 | 59 (12.5%) | 20 |
| Tranco top 10,000 | 6,473 | 4,789 | 522 | 635 (9.8%) | 320 |
| Software & SaaS | 9,989 | 8,391 | 792 | 291 (2.9%) | 322 |
| All sites | 16,784 | 13,359 | 1,335 | 1,028 (6.1%) | 654 |

The census crawler identified itself honestly but sits on no allow list, so a verified AI bot may well get further. Still, the gap is telling. News sites state their AI bot policy in robots.txt, where anyone can read it. A quarter of retail sites put a firewall in front of the file itself, so their real policy may live at the edge.

Under [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), a 4xx response to robots.txt means the file is "unavailable," and a crawler "MAY access any resources on the server." A firewall that hides robots.txt from a bot also hides your opt-out from it.

## How Sites Write Their AI Bot Rules

### Named rules, not wildcards

A bot can be blocked two ways. A rule can name it (`User-agent: GPTBot`), or a `User-agent: *` group can disallow everything the file doesn't name. This table covers the news and e-commerce top 1,000.

| Bot | Fully blocked | …by a rule naming it | Named anywhere in the file |
| --- | --- | --- | --- |
| GPTBot | 217 | 207 | 277 |
| OAI-SearchBot | 129 | 122 | 199 |
| ChatGPT-User | 156 | 149 | 221 |
| ClaudeBot | 227 | 211 | 257 |
| Claude-SearchBot | 115 | 101 | 132 |
| PerplexityBot | 198 | 186 | 236 |
| Google-Extended | 198 | 183 | 235 |
| CCBot | 252 | 236 | 259 |
| anthropic-ai | 204 | 187 | 199 |
| Googlebot | 3 | 1 | 169 |
| Bingbot | 5 | 2 | 82 |

About 95% of GPTBot blocks (207 of 217) name the bot. AI bot blocking here is a choice someone typed, not a side effect of a catch-all rule.

Naming isn't always blocking. Googlebot is named in 169 files but fully blocked in 3; sites name it to give it its own rules. And 199 files name OAI-SearchBot, but only 122 block it by name.

### Sites that block every crawler

A `User-agent: *` group with `Disallow: /` shuts out every bot the file doesn't name on its own. It's rare: 2.2% of all sites, 4.2% of the Tranco top 10,000, 2.9% of news sites and 1.1% of the Fortune 500. Some of these files still let Googlebot in by name, which is why Googlebot's block rate is lower than this number in every group.

### Content signals: a new line in robots.txt

In September 2025, Cloudflare launched its [Content Signals Policy](https://blog.cloudflare.com/content-signals-policy/): a `Content-Signal:` line with three yes-or-no keys, `search` (results and short excerpts), `ai-input` (feeding content into AI answers, such as grounding) and `ai-train` (training models). Cloudflare calls them expressions of preference, and said 3.8 million domains using its managed robots.txt would get `search=yes, ai-train=no`.

Adoption is still small:

| Group | Files with a Content-Signal line |
| --- | --- |
| News & media | 8 (2.0%) |
| E-commerce | 10 (3.2%) |
| Fortune 500 | 2 (0.5%) |
| Tranco top 10,000 | 145 (3.0%) |
| Software & SaaS | 490 (5.8%) |
| All sites | 619 (4.6%) |

Cloudflare Radar's own scan puts [content signals at 2.1%](https://radar.cloudflare.com/ai-insights) of 104,549 domains in its top 200,000, updated 27 September 2026.

The values are more surprising. Counted per line (a file can repeat it under several user-agent groups), the most common value is `search=yes, ai-input=yes, ai-train=yes`, with 513 lines. The same three yeses in another order add 319 more. Among the 15 most common values, 958 lines allow training and 558 refuse it. The all-no line, `search=no, ai-input=no, ai-train=no`, appears just 14 times.

So in this sample, the line is used more often to invite AI use than to refuse it. The publishers that refuse most barely use it (2.0% of news sites); they write `User-agent` rules instead.

Cloudflare's managed file leaves a marker, "BEGIN Cloudflare Managed content." Just 20 files in the census carry it, none of them news sites. Its [current default line](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) reads `search=yes, ai-train=no, use=reference`.

### How Cloudflare Radar's count compares

Cloudflare Radar publishes its own tally of AI bot rules. On 27 September 2026 it counted 4,228 robots.txt files across its top 10,000 domains, with GPTBot fully disallowed in 341 and partly in 176, and OAI-SearchBot fully disallowed in 113. In [July 2025](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/), the same kind of scan found 250 full and 62 partial GPTBot blocks.

These counts aren't directly comparable with Rankbox's Tranco figures: Radar ranks domains its own way and counts only rules that [name each user agent](https://developers.cloudflare.com/radar/glossary/), while this census also counts wildcard blocks. Both sources agree that training bots are blocked far more often than search bots, and Radar's two snapshots show GPTBot blocks rising.

Two news-only trackers agree too. The [News Homepages tracker](https://palewi.re/docs/news-homepages/openai-gptbot-robotstxt.html) shows 46.5% of 1,154 news publishers opting out of OpenAI's crawling, close to this census's 47.56% for GPTBot. [BuzzStream's study](https://www.buzzstream.com/blog/publishers-block-ai-study/) of 100 top US and UK news sites, last updated April 2026, found higher rates in that smaller sample: GPTBot 62%, OAI-SearchBot 49%. By the end of 2023, the [Reuters Institute](https://reutersinstitute.politics.ox.ac.uk/how-many-news-websites-block-ai-crawlers) counted 48% of leading news sites in 10 countries blocking OpenAI.

## What AI Crawlers Do After the Door Opens: Public Log Data

The content plan asked for server-log numbers: crawl frequency, page priorities, response codes and bandwidth. **Rankbox did not measure these** (see Methodology). Here is the best dated public evidence, and a way to run the analysis on your own logs.

### Crawl volume and purpose

- **Training dominates.** In the seven days to 28 September 2026, [Cloudflare Radar](https://radar.cloudflare.com/ai-insights) put 43.3% of AI bot and crawler traffic down to training, 39.9% to mixed training and search, 11.5% to search and 3.1% to user actions. GPTBot made 75.5% of OpenAI's crawl requests, OAI-SearchBot 16.4% and ChatGPT-User 8%.
- **The growth is recent.** Between May 2024 and May 2025, Cloudflare saw [GPTBot's requests rise 305%](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/), lifting its share of crawler traffic from 2.2% to 7.7%.
- **Other networks see other leaders.** From mid-April to mid-July 2025, [Fastly](https://www.fastly.com/press/press-releases/new-fastly-threat-research-reveals-ai-crawlers-make-up-almost-80-of-ai-bot) found crawlers made almost 80% of AI bot traffic, Meta alone 52% of AI crawler traffic, and OpenAI 98% of live fetcher requests, which peaked at 39,000 a minute in some cases.

### Page priorities

No large public dataset splits AI crawler requests by page type, such as docs against pricing against blog posts. The closest evidence is by content type. In [Vercel's December 2024 study](https://vercel.com/blog/the-rise-of-the-ai-crawler), 57.70% of ChatGPT's crawler fetches were HTML and 11.50% JavaScript. Claude's crawler spent 35.17% of its fetches on images and 23.84% on JavaScript. Neither ran JavaScript, so text that only appears after scripts run was out of their reach. Radar's latest week shows HTML at 69.4% of what AI bots receive.

### Response codes

In Radar's week to 28 September 2026, 58.7% of responses to AI bots were 200s, 16.4% were 403s, 7.3% were 404s and 3% were rate limits (429). In Vercel's 2024 data, 34.82% of ChatGPT's crawler requests and 34.16% of Claude's hit 404 pages, and another 14.36% of ChatGPT's followed redirects.

### Bandwidth

The cost stories are anecdotal. [Read the Docs](https://about.readthedocs.com/blog/2024/07/ai-crawlers-abuse/) reported that one crawler downloaded 73 TB of zipped HTML in May 2024, almost 10 TB in a single day, costing it over $5,000 in bandwidth. After it blocked AI crawlers, download bandwidth fell 75%. [Wikimedia](https://diff.wikimedia.org/2025/04/01/how-crawlers-impact-the-operations-of-the-wikimedia-projects/) said in April 2025 that bots caused at least 65% of its most expensive traffic while making up about 35% of pageviews.

### Run the log analysis on your own site

Your own logs are the only place to learn whether each AI bot prefers your docs or your blog. Export 30 days of access logs, keeping the user agent, path, status and bytes on each line, then work through this table.

| Question | What to compute | Why it matters |
| --- | --- | --- |
| Crawl frequency | Requests per day per AI bot token | A drop to zero often means a firewall change |
| Page priorities | Hits per bot per path group (`/docs/`, `/pricing`, `/blog/`) | Which pages each engine wants |
| Response codes | Share of 2xx, 3xx, 403, 404 and 429 per bot | 403s are your blocks, 404s wasted crawl |
| Bandwidth | Bytes served per AI bot per day | The real cost of saying yes |
| Honesty check | Source IPs checked against each vendor's published list | Separates real bots from scrapers wearing their names |

The [AI crawler directory](/blog/ai-crawler-directory) has copy-paste log commands and every vendor's IP list. Or paste a day of logs into the free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer), which counts each bot's hits and top pages in your browser and uploads nothing.

## Does Blocking an AI Bot Cost You Citations?

The plan asked whether sites that block AI search bots vanish from ChatGPT Search or still get cited through third-party indexes. **Rankbox did not run a citation test for this edition.** Here is what the vendors document, and how to test it.

### What each vendor says happens

| Vendor | Bot you block | What the vendor documents |
| --- | --- | --- |
| OpenAI | OAI-SearchBot | Not shown in ChatGPT search answers, "though can still appear as navigational links"; Atlas may show "just the link and page title" for a URL found through a third-party provider |
| OpenAI | GPTBot | Content "should not be used in training"; no effect on search, since settings are independent |
| Anthropic | Claude-SearchBot | Stops indexing, which "may reduce your site's visibility and accuracy in user search results" |
| Anthropic | Claude-User | Stops live retrieval, which "may reduce your site's visibility for user-directed web search" |
| Perplexity | PerplexityBot | No full or partial text indexed, but Perplexity "may still index the domain, headline, and a brief factual summary" |
| Google | Google-Extended | Gemini training and grounding only; no effect on inclusion or ranking in Google Search |

Sources: [OpenAI crawlers](https://developers.openai.com/api/docs/bots), [OpenAI publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity Help Center](https://web.archive.org/web/20260401182247/https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt) (archived 1 April 2026; the live page returned an error on 28 September) and [Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers).

Read together, the docs describe a partial penalty, not a vanishing act. A blocked site loses its text in the answer but may keep a link, a title or a short summary. No vendor publishes how often that happens, so a test has to measure it.

### How to run the citation test

1. **Pick two matched groups.** Take 30 sites from this census that fully block OAI-SearchBot and 30 that allow it, in the same industry and a similar rank band.
2. **Write prompts each site should win,** on topics it covered recently.
3. **Run every prompt several times in ChatGPT with search on,** in a clean session from a fixed location. Record whether each domain appears as a cited source, a bare link or not at all.
4. **Compare rates, not screenshots.** A difference between the groups in cited-source rate is the penalty. A bare-link rate above zero for blockers confirms OpenAI's exception.
5. **Watch for policy changes.** When a site flips its OAI-SearchBot rule between quarters, compare its before and after against sites that didn't change.
6. **Repeat for Perplexity and Claude.**

Our guide to [measuring GEO](/blog/how-to-measure-geo) covers sample sizes and the control-group math behind step 5. Rankbox doesn't track AI citations today, so this test runs on a spreadsheet or a third-party tracker.

## Methodology

### Sample

The census drew five groups of domains, then removed duplicates, so a site in several groups counts once in "All sites."

- **Fortune 500 (2026):** the 500 companies on [Fortune's 2026 list](https://fortune.com/ranking/fortune500/), using the website on each company's Fortune profile page.
- **Software & SaaS companies:** active or public companies in Y Combinator's directory, through the [yc-oss mirror](https://github.com/yc-oss/api) (snapshot 28 September 2026), in the B2B or Fintech industries or tagged SaaS, B2B or Developer Tools; plus [Wikidata](https://www.wikidata.org/) organizations with an official website in software, SaaS, cloud, IT or security, or classed as software, technology or internet companies or online services.
- **Tranco top 10,000:** the first 10,000 domains of [Tranco list 64X3X](https://tranco-list.eu/list/64X3X), generated 27 September 2026 from Chrome UX Report, Farsight, Majestic, Cloudflare Radar and Cisco Umbrella data.
- **News & media (top 500) and e-commerce (top 500):** Wikidata items classed as news outlets, magazines, broadcasters or TV stations, or as online retailers and retail companies, whose official domain is in Tranco; the top 500 of each by Tranco rank. Subdomain sites, platforms (social networks, blog hosts, app stores, file hosts, academic publishers), .gov and .edu sites, and a hand-checked list of misclassified domains were removed.

That gave **21,353 unique sites.** Of these, 16,784 answered over HTTP or HTTPS. The rest failed on DNS, TLS or timeouts, often because the company is defunct but still listed in Wikidata or YC, and are left out of every percentage, as are 24 parked domains that served a "domain for sale" page.

### How the crawler worked

The crawl ran once, on 28 September 2026, from one machine. It tried HTTPS on the bare domain, then `https://www.`, followed redirects, allowed 15 seconds per request and sent one request at a time per site. Its user agent was `RankboxResearchBot/1.0 (+https://rankbox.xyz/blog; one-time study of robots.txt and llms.txt files)`.

It fetched three paths per site and nothing else: `/robots.txt`, `/llms.txt` and `/llms-full.txt`. The llms.txt results are in the companion report, [the state of llms.txt adoption](/blog/state-of-llms-txt-adoption).

### What counted

- **Parsing:** the open-source [robots-parser](https://github.com/samclarke/robots-parser) library, version 3, which follows RFC 9309: a bot obeys the group that names it most specifically, else the `*` group, and the longest matching rule wins.
- **Fully blocked:** both the homepage (`/`) and an arbitrary deep page are disallowed for the bot's token.
- **Partially blocked:** one of the two is disallowed, but not the other. This was rare.
- **Named:** the file has a `User-agent:` line for the token. A bot can be fully blocked without being named, through `User-agent: *` and `Disallow: /`.
- **Denominators:** only files served with HTTP 200 that weren't HTML pages. Sites with no robots.txt (404 or 410) allow everything and sit outside the block rates, as do sites that refused the file to the census bot (401, 403, 429 or a challenge).
- **Tokens checked:** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, Bytespider, meta-externalagent, Amazonbot and cohere-ai, plus Googlebot and Bingbot as a baseline.

Tables give the census figures exactly. Where the text rounds or says "about," the table value is the source. Split-Door Rates are derived from the census counts.

### What this edition did not measure

- **Server logs.** Rankbox's own hosting logs record the path and status of each request but not the user agent, so they can't tie requests to an AI bot. Rankbox plans to add its own AI bot request logs to a future edition. The public data above stands in.
- **The citation penalty.** No citation test was run. The vendor documentation and the test design above stand in.

### Limitations

- **robots.txt is a request.** It shows what a site asks for, not whether bots obey or whether a firewall blocks them anyway.
- **The census bot was unverified.** Firewalls blocked robots.txt for it on 6.1% of all sites and 25.1% of e-commerce sites. Those sites are missing from the block rates, so the e-commerce rates describe only the 311 retail sites whose file could be read.
- **One fetch, one user agent.** Some sites serve different robots.txt files to different bots. The census saw only the version served to its own bot, on one day.
- **Two test paths.** Checking the homepage and one deep page catches site-wide blocks, not rules for one section, such as a paywalled archive.
- **Group labels come from public data.** Wikidata and YC classifications contain errors, and a hand-check removed only the obvious ones.
- **Tranco includes infrastructure.** Its top 10,000 contains CDN, API and ad-serving domains that aren't websites.
- **Small groups.** The Fortune 500 has only 10 GPTBot blockers, so its split rates are fragile.

### How to cite this study

Rankbox, "The AI Bot Crawler Census", 28 September 2026, https://rankbox.xyz/blog/ai-bot-crawler-census

## What Rankbox Does, and Doesn't Do, With Crawler Access

Rankbox doesn't manage robots.txt, firewalls or CDN settings, and it doesn't track AI citations today. For access, use the free tools linked above: the robots.txt generator, the tester and the log analyzer.

Once an AI bot can read your site, Rankbox works on what it finds there. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles of 2,000 to 3,500 words, which reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### Which sites block AI crawlers?

News and media sites block AI crawlers most. In this census, 62.2% of top news sites fully block at least one AI bot, against 14.1% of retailers, 7.0% of software companies and 3.8% of the Fortune 500. Large blockers include nytimes.com, bbc.com, reuters.com and amazon.com.

### How many websites block GPTBot?

About one in thirteen. Across 13,359 readable robots.txt files, 7.66% fully block GPTBot. The rate is 47.56% for top news sites, 15.83% for the Tranco top 10,000, 7.07% for retailers and 2.71% for the Fortune 500, as of 28 September 2026.

### Should I block OAI-SearchBot?

Only if you're willing to leave ChatGPT search. OpenAI says sites that block OAI-SearchBot won't be shown in ChatGPT search answers, apart from navigational links. To stay out of model training instead, block GPTBot. More than half the GPTBot blockers in this census keep OAI-SearchBot open.

### How do I block GPTBot in robots.txt?

Add a group with `User-agent: GPTBot` followed by `Disallow: /`. That opts your site out of OpenAI's training crawls without touching ChatGPT search, which uses OAI-SearchBot. OpenAI says the change takes about 24 hours. Check it with a robots.txt tester.

### Does every AI bot obey robots.txt?

No. The training and search crawlers from OpenAI, Anthropic, Perplexity and Google say they follow it. But OpenAI says robots.txt "may not apply" to ChatGPT-User, and Perplexity says Perplexity-User "generally ignores" it, because a person started the fetch. Stopping those takes a firewall rule.

### How often will the AI bot census be updated?

Every quarter. This is the Q3 2026 edition, crawled on 28 September 2026. Each edition will use the same method, so block rates and Split-Door Rates can be compared over time.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
3. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
4. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
5. [How does Perplexity follow robots.txt?, Perplexity Help Center (archived 1 April 2026)](https://web.archive.org/web/20260401182247/https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt)
6. [Google's common crawlers, Google Crawling Infrastructure](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
7. [Giving users choice with Cloudflare's new Content Signals Policy, Cloudflare](https://blog.cloudflare.com/content-signals-policy/)
8. [Managed robots.txt, Cloudflare Docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
9. [AI Insights, Cloudflare Radar](https://radar.cloudflare.com/ai-insights)
10. [From Googlebot to GPTBot: who's crawling your site in 2025, Cloudflare](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/)
11. [The agentic internet bot report, Cloudflare](https://blog.cloudflare.com/agentic-internet-bot-report/)
12. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
13. [AI crawlers make up almost 80% of AI bot traffic, Fastly](https://www.fastly.com/press/press-releases/new-fastly-threat-research-reveals-ai-crawlers-make-up-almost-80-of-ai-bot)
14. [AI crawlers need to be more respectful, Read the Docs](https://about.readthedocs.com/blog/2024/07/ai-crawlers-abuse/)
15. [How crawlers impact the operations of the Wikimedia projects, Wikimedia Foundation](https://diff.wikimedia.org/2025/04/01/how-crawlers-impact-the-operations-of-the-wikimedia-projects/)
16. [Which news sites block AI crawlers?, BuzzStream](https://www.buzzstream.com/blog/publishers-block-ai-study/)
17. [Who blocks OpenAI, Google AI and Common Crawl?, News Homepages](https://palewi.re/docs/news-homepages/openai-gptbot-robotstxt.html)
18. [How many news websites block AI crawlers?, Reuters Institute](https://reutersinstitute.politics.ox.ac.uk/how-many-news-websites-block-ai-crawlers)
19. [RFC 9309: Robots Exclusion Protocol, IETF](https://www.rfc-editor.org/rfc/rfc9309.html)
20. [Tranco list 64X3X, Tranco](https://tranco-list.eu/list/64X3X)
