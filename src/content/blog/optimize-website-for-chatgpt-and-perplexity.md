---
title: How to Optimize Your Website for ChatGPT and Perplexity
description: Optimize your website for ChatGPT and Perplexity with one checklist: crawler access, raw HTML, indexing and freshness, plus where the two engines differ.
keyword: ChatGPT and Perplexity
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Playbooks
---

To optimize your website for ChatGPT and Perplexity, let each engine's search crawler and live fetcher through your robots.txt and firewall, put every answer in the raw HTML, and keep a clear, dated page for each fact buyers check. Most of that work is shared. The rest differs, because ChatGPT leans on outside search providers such as Bing, while Perplexity crawls and ranks the web with its own index.

That split shows up in the data. In [Ahrefs' August 2025 study of 15,000 prompts](https://ahrefs.com/blog/ai-search-overlap/), 28.6% of the pages Perplexity cited ranked in Google's top 10 for the query. For ChatGPT, Gemini and Copilot the figure hovered around 8%. Same web, different pickers.

The rules also moved this month. From 15 September 2026, [Cloudflare blocks "Agent" bots by default](https://blog.cloudflare.com/content-independence-day-ai-options/) on ad-carrying pages of newly added domains, and its own example of an agent is `ChatGPT-User`. A site can pass every content check and still lose live fetches from ChatGPT and Perplexity to a CDN default.

This guide gives you one checklist for ChatGPT and Perplexity, with a way to verify each item yourself in a minute, then maps the six places where they split. For crawler internals, see our technical guides to [ChatGPT SEO](/ai-seo/chatgpt) and [Perplexity SEO](/ai-seo/perplexity).

## Key Takeaways

- Most fixes serve ChatGPT and Perplexity at once: crawler access, raw HTML, fast responses, dated fact pages and clean internal links.
- ChatGPT search needs `OAI-SearchBot`. Perplexity needs `PerplexityBot`. Both vendors say robots.txt changes take up to about 24 hours to apply.
- The live fetchers, `ChatGPT-User` and `Perplexity-User`, may skip robots.txt entirely. Your firewall, not robots.txt, decides whether they get through.
- Neither vendor documents JavaScript rendering, and independent tests found neither engine reads client-rendered text. Server-render every answer.
- Bing indexing and IndexNow help ChatGPT, since Microsoft is one of its search providers. Perplexity isn't an IndexNow participant and runs its own crawler.
- You can block `GPTBot` (training) and stay in ChatGPT search. Perplexity says `PerplexityBot` isn't used to crawl content for AI foundation models, so there's no second bot to weigh.
- Neither OpenAI nor Perplexity says its crawler reads your llms.txt. Spend that time on pricing, comparison and docs pages instead.

## How ChatGPT and Perplexity Reach Your Site

Both engines answer from the live web. They build their pool of pages in different ways, and that one fact explains most of the checklist below.

### ChatGPT borrows results and runs its own crawler

ChatGPT decides when a question needs a search. When it searches, OpenAI's [help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says it "typically rewrites your query into one or more targeted queries" and sends them to partner search providers. The page points to Microsoft's and Shopify's privacy policies for those providers.

OpenAI also runs its own crawler. Its [crawler docs](https://developers.openai.com/api/docs/bots) say `OAI-SearchBot` "is used to surface websites in search results in ChatGPT's search features." So a page reaches ChatGPT through two doors: a provider's index, such as Bing, and OpenAI's own crawl.

The searches themselves have changed shape. [Nectiv's 2026 study](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study) of about 4,000 prompts found ChatGPT running 7.61 searches per prompt, up from 2.17, with the `site:` operator in 64% of them. "Official" and "gov" were among the words it added most. That is [query fan-out](/glossary/query-fan-out) aimed straight at official domains.

### Perplexity runs its own index and ranks passages

Perplexity started out on third-party search APIs, then built its own index. Its [September 2025 architecture write-up](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api) says the index "tracks over 200 billion unique URLs." A model predicts when each URL needs a recrawl, based on its importance and how often it changes.

Pages are then split into "self-contained spans, each of which can be individually retrieved and ranked." Prefilters drop "clearly non-responsive or stale content" before ranking starts. So being in Bing's index doesn't help Perplexity directly. What counts is whether `PerplexityBot` can fetch you, how often your pages change, and whether each section stands on its own.

### ChatGPT and Perplexity side by side

| | ChatGPT | Perplexity |
| --- | --- | --- |
| Where results come from | Partner search providers plus OpenAI's crawler | Perplexity's own index of 200B+ URLs |
| Search crawler | `OAI-SearchBot` | `PerplexityBot` |
| Live fetcher for user questions | `ChatGPT-User`: "robots.txt rules may not apply" | `Perplexity-User`: "generally ignores robots.txt rules" |
| Training crawler | `GPTBot`, a separate setting | None; `PerplexityBot` isn't used for AI foundation models |
| robots.txt changes apply | In about 24 hours | In up to 24 hours |
| Published IP lists | `searchbot.json`, `chatgpt-user.json` | `perplexitybot.json`, `perplexity-user.json` |
| JavaScript rendering | Not documented | Not documented |
| IndexNow | Reaches Bing, a participating engine | Not a participant |
| How citations look | Inline citations and a Sources panel | Numbered citations linking to each source |
| How clicks arrive | `chatgpt.com`, tagged `utm_source=chatgpt.com` | `perplexity.ai` referrer |

The rows come from OpenAI's crawler docs and [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), Perplexity's [crawler docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) and [help center](https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work), [IndexNow's list of engines](https://www.indexnow.org/searchengines.json) and Cloudflare's referrer list, all checked in September 2026.

## The Two-Engine Site Checklist for ChatGPT and Perplexity

We call this the two-engine site checklist. Each row is one check, what each engine needs, whether the fix is the same, and how to confirm it yourself. Work from the top down. A failure high on the list blocks every row below it.

| # | Check | ChatGPT needs | Perplexity needs | Same fix? | Verify it yourself |
| --- | --- | --- | --- | --- | --- |
| 1 | Search crawler allowed in robots.txt | `OAI-SearchBot` allowed | `PerplexityBot` allowed | Same, different token | Command 1, or our [robots.txt tester](/tools/robots-txt-tester) |
| 2 | Training crawler set on purpose | Decide on `GPTBot`; search is unaffected | Nothing to decide | Different | Command 1: read the `GPTBot` group |
| 3 | Published IP ranges allowed at the CDN and WAF | OpenAI's JSON lists | Perplexity's JSON lists | Same | Command 4 on IPs from your firewall log |
| 4 | Live fetchers not blocked, challenged or rate-limited | `ChatGPT-User` | `Perplexity-User` | Same | Command 3: any 403, 429 or 503 |
| 5 | The answer is in the raw HTML | No JS rendering documented | No JS rendering documented | Same | Command 2: a count of 0 means missing |
| 6 | Fast, error-free responses | Live fetches while a user waits | Live fetches while a user waits | Same | Command 2: status code and time to first byte |
| 7 | Indexed by Bing | Helps: Microsoft is a provider | No documented effect | Different | URL Inspection in Bing Webmaster Tools |
| 8 | IndexNow pinged on publish and update | Helps, through Bing | Not a participant | Different | Command 5: a 200 or 202 reply |
| 9 | XML sitemap with honest `lastmod` | Not documented; Bing uses it | Not documented | Same | `curl -s yoursite.com/sitemap.xml \| grep -o "<lastmod>" \| wc -l` |
| 10 | Pages that must stay hidden really are | `noindex`, and let the crawler read it | Firewall block; no `noindex` rule documented | Different | `curl -sI URL \| grep -i x-robots-tag` and view source |
| 11 | Visible dates that change only with the content | Cites newer pages than Google does | Stale content filtered out | Same | `curl -s URL \| grep -oE '"dateModified": ?"[^"]+"'` |
| 12 | An official page for every fact buyers check | Targets of `site:` searches | Passages ranked on their own | Same | Match your top 20 buyer questions to URLs |
| 13 | Every key page linked from other pages | Discovery by crawl | Discovery by crawl | Same | Your site crawler's orphan-page report |
| 14 | Syndicated copies point back to you | Canonical tag on the copy | Canonical tag on the copy | Same | View source on the partner's copy |
| 15 | AI referrals tracked | Grouped in GA4's AI Assistant channel | Not named in that channel | Different | GA4 Traffic acquisition, by session source |

Ten of the fifteen rows are the same fix for ChatGPT and Perplexity. Do those first, because each one counts twice.

### The five verification commands

Every command below runs in a normal terminal on macOS or Linux. Swap in your own domain, page and a sentence you expect to find.

1. **Read what robots.txt tells each crawler.** A `Disallow: /` under `User-agent: *` blocks any crawler that has no group of its own.

```bash
curl -s https://yoursite.com/robots.txt | grep -i -A3 -E "^user-agent: *(\*|oai-searchbot|perplexitybot|gptbot)"
```

2. **Fetch a page the way each crawler asks for it.** The loop uses the user-agent strings from each vendor's docs (OpenAI notes its version number may change). The first line of each pair is the status code and time to first byte. The second is how many lines contain your key sentence. Zero means the sentence isn't in the raw HTML: JavaScript adds it, the wording differs, or your firewall served a challenge page.

```bash
for ua in \
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"; do
  curl -s -o /dev/null -w "%{http_code} %{time_starttransfer}s\n" -A "$ua" https://yoursite.com/pricing
  curl -s -A "$ua" https://yoursite.com/pricing | grep -c "Plans start at"
done
```

This tests your server and any user-agent rules. It can't copy the bots' IP addresses, so a CDN may treat your test differently from the real crawler. Command 3 shows what the real bots got.

3. **Count the status codes each AI bot received.** This assumes the common "combined" log format, where the ninth field is the status code.

```bash
for bot in OAI-SearchBot ChatGPT-User PerplexityBot Perplexity-User; do
  echo "$bot"; grep "$bot" access.log | awk '{print $9}' | sort | uniq -c
done
```

4. **Check that a bot is who it claims to be.** User agents are easy to fake. Both vendors publish their IP ranges, so test a suspect IP against the list. Replace the example IP with one from your logs, and swap the URL for `https://openai.com/searchbot.json`, `chatgpt-user.json` or `perplexity-user.json` to check the other bots. It prints True or False.

```bash
IP=203.0.113.7
curl -sL https://www.perplexity.com/perplexitybot.json | python3 -c "
import sys, json, ipaddress
ip = ipaddress.ip_address('$IP')
nets = [p.get('ipv4Prefix') or p.get('ipv6Prefix') for p in json.load(sys.stdin)['prefixes']]
print(any(ip in ipaddress.ip_network(n) for n in nets))"
```

5. **Ping IndexNow after you publish.** Host your key file first. A 200 means the URL was received. [IndexNow's FAQ](https://www.indexnow.org/faq) says a first request may return 202 while your key is checked.

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://api.indexnow.org/indexnow?url=https://yoursite.com/pricing&key=YOUR_KEY"
```

If you'd rather not use a terminal, our free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) reads a day of access logs in your browser and shows each bot's hits and errors.

### Why the firewall rows matter more than robots.txt

Rows 3 and 4 are the easiest to fail without noticing. OpenAI says "robots.txt rules may not apply" to `ChatGPT-User`, and Perplexity says `Perplexity-User` "generally ignores robots.txt rules." Both are fetching a page because a person asked a question. So robots.txt can't reliably block them, and it can't help them past a firewall either.

Cloudflare's [AI Crawl Control list](https://developers.cloudflare.com/ai-crawl-control/reference/bots/) files `OAI-SearchBot` and `PerplexityBot` as AI Search, and `ChatGPT-User` and `Perplexity-User` as AI Assistant. Under its new defaults, search stays allowed and agents are blocked on ad-carrying pages of new domains. Perplexity's crawler docs include ready-made Cloudflare and AWS WAF rules that match its user agents and IP ranges. OpenAI's help page asks you to confirm that your host or CDN "allows traffic from OpenAI's published searchbot IP addresses."

## The Divergence Map: Where ChatGPT and Perplexity Split

Most of the checklist is one fix, applied once. In six places, ChatGPT and Perplexity want different things. We call them the divergence map: the spots where a change helps one engine and does little or nothing for the other.

| Divergence | ChatGPT | Perplexity | What to do |
| --- | --- | --- | --- |
| 1. Where the index comes from | Search providers, plus `OAI-SearchBot` | Its own crawler and index | Set up Bing Webmaster Tools for ChatGPT. For Perplexity, focus on crawl access and links |
| 2. How much Google rank carries over | About 8% of citations rank top 10 | 28.6% of citations rank top 10 | For ChatGPT, win the sub-queries. For Perplexity, classic SEO transfers better |
| 3. Training opt-out | Block `GPTBot`, keep `OAI-SearchBot` | No separate training crawler | Make the `GPTBot` call once |
| 4. Freshness | Cites the newest pages in Ahrefs' data | Documents a stale-content filter | Date everything; refresh fast-changing facts first |
| 5. What a blocked page leaves behind | A link and page title | Domain, headline and a brief factual summary | `noindex` for ChatGPT; a firewall rule for Perplexity |
| 6. How visits show up | `utm_source=chatgpt.com` | `perplexity.ai` referrer | A custom GA4 channel covering both |

### 1. Bing and IndexNow only help one engine

Microsoft is one of ChatGPT's search providers, so a page Bing has indexed gives ChatGPT a second way to find it. IndexNow tells Bing about a new or changed URL the moment you publish, and Bing's [sitemap guidance](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/) calls an accurate `lastmod` "a key signal" for recrawling. Neither step touches Perplexity. It isn't on [IndexNow's list](https://www.indexnow.org/searchengines.json) of participating engines as of September 2026, and it documents no URL submission tool.

Perplexity learns your rhythm instead. Its write-up says the recrawl model lets it defer visits "for sites with routine publication and refresh cadences" to when they're "likely to be most useful." Publish on a steady schedule, and link new pages from pages that change often, such as your blog index or changelog.

### 2. Rankings carry over to Perplexity more than to ChatGPT

Ahrefs found Perplexity's citations overlap with Google's top 10 far more than ChatGPT's do. Perplexity doesn't read Google's results. It runs its own index, yet its picks land closer to classic search. Strong SEO pages have a head start there.

For ChatGPT and the other assistants, Ahrefs found more than 80% of citations came from pages that don't rank at all for the original prompt. That fits what OpenAI describes: ChatGPT rewrites the question into its own targeted searches. With `site:` searches now common, the vendor's own page for that exact fact gets a direct shot.

### 3. Only ChatGPT asks you to make a training call

OpenAI keeps search and training apart: "Each setting is independent of the others." You can block `GPTBot` and still be cited. Perplexity's docs say `PerplexityBot` "is not used to crawl content for AI foundation models," so there's no second Perplexity bot to decide on.

This matters at your CDN too. Under Cloudflare's new rules, a crawler that mixes search and training is blocked once you block training. Neither `OAI-SearchBot` nor `PerplexityBot` is a training crawler, so a training block leaves both search crawlers alone.

### 4. ChatGPT and Perplexity both reward fresh pages

Perplexity is explicit about freshness: stale content is filtered out before ranking. ChatGPT publishes no such rule. Yet in [Ahrefs' July 2025 freshness study](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) of 17 million citations, ChatGPT's cited pages averaged 958 days old, against 1,166 for Perplexity and 1,416 for Google's organic results. Ahrefs also found both engines appear to order their in-text references from newest to oldest.

The fix is the same for both: show a real published date and a real updated date, and change the date only when the content changes. For pricing and specs, refresh on every change and ping IndexNow.

### 5. A blocked page doesn't fully leave ChatGPT and Perplexity

OpenAI says a site blocked from `OAI-SearchBot` "can still appear as navigational links." Its publisher FAQ says to use a `noindex` meta tag to stop that, and the crawler must be allowed to fetch the page to see the tag.

Perplexity's [robots.txt help page](https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt) says that for a blocked page, "we may still index the domain, headline, and a brief factual summary." It doesn't document `noindex` handling. If you need Perplexity to stay away entirely, robots.txt alone won't do it. Blocking both bots at your firewall, by user agent and IP, is the stronger option.

### 6. Your analytics sees the two differently

OpenAI's FAQ says ChatGPT "automatically includes the UTM parameter utm_source=chatgpt.com in referral URLs." Google's [channel definition](https://support.google.com/analytics/answer/9756891) groups ChatGPT, Gemini, DeepSeek, Copilot and Grok into GA4's AI Assistant channel. It doesn't name Perplexity, so check your Referral report for `perplexity.ai` and add it to a custom channel. Our guide to [measuring GEO](/blog/how-to-measure-geo) has a regex that covers both.

## Pages ChatGPT and Perplexity Both Reach For

Access gets you into the pool. Page inventory decides whether you have something worth citing. Both ChatGPT and Perplexity pull from the same kinds of first-party pages, for slightly different reasons.

| Page | The buyer question | ChatGPT angle | Perplexity angle | Must include |
| --- | --- | --- | --- | --- |
| Pricing | "How much does X cost?" | The official answer to a `site:` search | A short, dated passage passes the stale filter | Plans, prices, limits, updated date |
| Comparison (X vs Y) | "X or Y for a team of five?" | Matches a rewritten query naming both | Tables may get "more formulaic parsing" | A sourced comparison table |
| Alternatives | "Alternatives to Y" | Each option can answer its own sub-query | Each entry works as its own span | Honest fit notes for every option |
| Use case | "Best X for agencies" | The page title matches the qualifier | One audience per passage | Who it's for, a worked example |
| Docs and help | "Does X work with Z?" | Only the vendor can answer officially | Short sections rank on their own | One question per section |
| About or facts page | "Who makes X?" | First-party facts on the official domain | Plain facts in plain HTML | Founded, location, products, contact |

A few rules make these pages work for both engines:

- **One question per page, or per clearly headed section.** Perplexity ranks spans on their own, and ChatGPT's rewritten queries are targeted. A page that answers ten things gives both of them ten weak passages.
- **Put comparisons and specs in real HTML tables.** Perplexity's write-up says list- and table-heavy pages "may benefit from more formulaic parsing."
- **Use plain, descriptive URLs and titles.** "/pricing" and "/compare/loopcraft" say what the page answers before anyone opens it.
- **Keep facts identical everywhere.** A price that differs between your pricing page and a docs page gives either engine two answers to choose from.
- **Make syndicated copies point home.** In a 2025 [Tow Center test](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php) of eight AI search tools, answers sometimes cited syndicated copies on Yahoo News or AOL instead of the original. Ask partners for a canonical tag that points back to your page.

How you write each section is its own craft. Our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search) covers answer-first writing at the passage level. The about page also feeds your wider entity work, covered in our guide to [optimizing your business for AI search](/blog/optimize-business-for-ai-search).

## A Worked Example: Auditing Plannora

Plannora is a made-up project management tool at plannora.io. Its team checks the site against both ChatGPT and Perplexity using the two-engine checklist. Rows 2, 7 and 8 only apply to ChatGPT, so ChatGPT has 15 rows to pass and Perplexity has 12.

| Row | What the audit found | Engines hit | Fix |
| --- | --- | --- | --- |
| 4 | A rate-limit rule returns 429 to `Perplexity-User` during bursts | Perplexity | Exempt verified Perplexity IPs from the rule |
| 5 | The pricing table is built by JavaScript. Command 2 returns 0 for "$10 per user" | Both | Server-render the pricing table |
| 8 | No IndexNow pings | ChatGPT | Add a ping to the publish hook |
| 11 | Docs pages show no date | Both | Add a visible "Updated" date and `dateModified` |
| 12 | No Plannora vs Loopcraft page, though buyers ask for one | Both | Publish a comparison page with a sourced table |
| 15 | Perplexity visits land in Referral | Perplexity | Add a custom GA4 channel |

The starting score: ChatGPT fails rows 5, 8, 11 and 12, so Plannora passes 11 of 15 (73%). Perplexity fails rows 4, 5, 11, 12 and 15, so it passes 7 of 12 (58%).

The fix order follows the arithmetic:

1. **Fix the shared rows first.** Rows 5, 11 and 12 fail for both engines. Three fixes clear six failures. ChatGPT rises to 14 of 15 (93%) and Perplexity to 10 of 12 (83%).
2. **Fix the Perplexity-only rows next.** Rows 4 and 15 take Perplexity to 12 of 12.
3. **Finish with IndexNow.** Row 8 takes ChatGPT to 15 of 15.
4. **Re-run all five commands** a week later to confirm each fix held.

A full pass doesn't guarantee a single citation. It removes every technical reason for ChatGPT and Perplexity not to cite you. The rest comes down to whether Plannora's pages answer the question better than the next site's.

## What ChatGPT and Perplexity Don't Ask For

Some popular fixes don't appear anywhere in either vendor's documentation. Skip them until the checklist is green.

- **llms.txt.** Neither OpenAI's nor Perplexity's crawler docs mention reading your llms.txt file. Perplexity publishes one for its own help and developer docs, which is a different job. A file does no harm, but don't expect it to move citations.
- **A submission console.** Neither vendor documents a URL submission form or webmaster console. OpenAI's FAQ says: "Any public website can appear in ChatGPT search."
- **Schema as a ranking switch.** Neither vendor's crawler docs mention structured data. Keep schema accurate for Google and Bing, and make sure it matches the visible text.
- **Blocking GPTBot to "protect" search.** It changes nothing about ChatGPT search, in either direction.

One more thing: OpenAI's FAQ says its Atlas browser uses ARIA tags "to interpret page structure and interactive elements" when ChatGPT's agent works on a page. If you want agents to book demos or fill forms on your site, accessible markup now pulls double duty.

## Where Rankbox Fits in the Two-Engine Checklist

Rankbox helps with row 12, the page inventory, not the plumbing. Its Answer-Space Research maps the questions your buyers ask ChatGPT, Perplexity and Google, and scores them by estimated volume, difficulty and intent. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles of 2,000 to 3,500 words. Articles reach your site through Rankbox's API, which a developer wires in once.

Rankbox doesn't change your robots.txt, CDN or firewall, and it doesn't track AI citations today. For the access rows, use the free tools linked above. For tracking, see our round-ups of [ChatGPT rank trackers](/blog/chatgpt-rank-tracker) and [Perplexity SEO tools](/blog/perplexity-seo-tools). The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### Do ChatGPT and Perplexity use the same crawler?

No. ChatGPT search uses `OAI-SearchBot`, plus results from partner search providers such as Microsoft. Perplexity uses `PerplexityBot` to build its own index. Each has a separate robots.txt token and IP list. Each also has a live fetcher, `ChatGPT-User` or `Perplexity-User`, that visits pages when a person asks a question.

### Can ChatGPT and Perplexity read JavaScript?

Not reliably. Neither vendor documents JavaScript rendering. [Vercel's December 2024 crawler study](https://vercel.com/blog/the-rise-of-the-ai-crawler) found OpenAI's crawlers download script files without running them, and [Glenn Gabe's 2025 test](https://www.gsqi.com/marketing-blog/ai-search-javascript-rendering/) found both engines unable to read client-rendered pages. Put your key content in the server-rendered HTML.

### Does IndexNow help ChatGPT and Perplexity?

It helps ChatGPT indirectly and Perplexity not at all. Bing is an IndexNow participant, and Microsoft is one of ChatGPT's search providers. Perplexity isn't on IndexNow's list of participating engines as of September 2026, so it finds changes through its own crawler.

### Will blocking GPTBot remove my site from ChatGPT?

No. `GPTBot` collects content that may be used for training. `OAI-SearchBot` handles search. OpenAI says each setting "is independent of the others," so you can block `GPTBot`, allow `OAI-SearchBot`, and stay eligible for ChatGPT search.

### Do ChatGPT and Perplexity use llms.txt?

Neither vendor says so. OpenAI's and Perplexity's crawler docs list their bots, robots.txt rules and IP ranges, and none mention reading llms.txt files on other sites. A file does no harm, but it shouldn't come before crawler access, raw HTML or your fact pages.

### How long before ChatGPT and Perplexity see my changes?

Robots.txt changes take up to about 24 hours with both vendors. Page changes take longer, because each engine has to recrawl the page. IndexNow can speed that up for Bing, and so for ChatGPT's provider path. Perplexity schedules recrawls by how important a page is and how often it changes.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
3. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
4. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
5. [How does Perplexity follow robots.txt?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt)
6. [How does Perplexity work?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work)
7. [Architecting and evaluating an AI-first search API, Perplexity](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api)
8. [Participating search engines, IndexNow](https://www.indexnow.org/searchengines.json)
9. [IndexNow FAQ, IndexNow](https://www.indexnow.org/faq)
10. [Keeping content discoverable with sitemaps in AI-powered search, Microsoft Bing](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)
11. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
12. [Bot reference, Cloudflare AI Crawl Control docs](https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
13. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
14. [AI search and JavaScript rendering, GSQi (Glenn Gabe)](https://www.gsqi.com/marketing-blog/ai-search-javascript-rendering/)
15. [Only 12% of AI cited URLs rank in Google's top 10 for the original prompt, Ahrefs](https://ahrefs.com/blog/ai-search-overlap/)
16. [Do AI assistants prefer to cite fresh content?, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
17. [New Research: ChatGPT Tripled Its Fan-Out Queries + Looks For Authoritative Sources, Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)
18. [Default channel group, Google Analytics Help](https://support.google.com/analytics/answer/9756891)
19. [AI search has a citation problem, Columbia Journalism Review](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php)
