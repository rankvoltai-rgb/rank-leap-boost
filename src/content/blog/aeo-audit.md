---
title: How to Conduct an Answer Engine Optimization (AEO) Audit in 2026
description: Run an AEO audit with a 20-point checklist for AI crawler access, llms.txt and schema, citation readiness, prompt gaps and backlink spread, then score it.
keyword: AEO
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, Playbooks
---

An AEO audit checks whether answer engines such as ChatGPT, Perplexity, Claude and Google's AI Overviews can reach your site, read it without guessing, and find a reason to quote you. To conduct one, score 20 points across five areas in a fixed order: crawl permissions, machine-readable summaries, citation readiness, prompt coverage and authority. Then fix the failures from the top down, because a blocked crawler cancels every point below it.

Most AEO audit checklists online get the writing half right and thin out elsewhere. Four popular ones, read on 29 September 2026, show it. [AirOps' 48-factor list](https://www.airops.com/blog/aeo-audit-checklist), [HubSpot's audit guide](https://blog.hubspot.com/marketing/aeo-audit) and [LSEO's 2026 checklist](https://lseo.com/answer-engine-optimization-services/the-aeo-audit-a-step-by-step-checklist-for-2026/) don't mention llms.txt at all. [Erlin's checklist](https://www.erlin.ai/blog/aeo-audit-checklist) does, but it calls GPTBot OpenAI's crawler "for ChatGPT search" and asks you to allow "Claude-Web." OpenAI's [crawler docs](https://developers.openai.com/api/docs/bots) say GPTBot gathers training data, and Anthropic's [bot page](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) lists ClaudeBot, Claude-User and Claude-SearchBot, with no Claude-Web. None of the four looks at how your backlinks spread across your pages.

That last gap matters. In [Ahrefs' December 2025 study](https://ahrefs.com/blog/ai-brand-visibility-correlations/) of 75,000 brands, branded web mentions correlated with ChatGPT visibility at 0.664, well above domain rating at 0.266. Authority still counts in AI search. It shows up as mentions and links around the pages you want quoted.

Below are all 20 points, each with a check, a pass rule, a tool or command, and a link to the Rankbox guide that goes deeper. Then comes a scored AEO audit of Tallyfold, a made-up invoicing app. For software that speeds up each check, see our [GEO tools list](/blog/geo-tools-list).

## Key Takeaways

- An AEO audit scores 20 points in five areas: crawl permissions, machine-readable summaries, citation readiness, prompt coverage and authority.
- Run the areas in order. Points 1, 3 and 6 are gates: a blocked bot, a firewall that rejects AI fetches or an unindexed page cancels everything after it.
- Check the bots vendors document today: OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot and Bingbot for search, plus ChatGPT-User, Claude-User and Perplexity-User for live fetches.
- Validate llms.txt against the published spec, but fix it last in its area. Google says its Search ignores such files.
- Structured data has to match the page. Bing's guidelines say markup "must accurately reflect visible content."
- Prompt coverage means 30 or more buyer questions mapped to URLs, plus a baseline run more than once in each engine.
- Check where your links land, not just how many you have. A homepage that holds most of your linking sites leaves your answer pages unsupported.

## What an AEO Audit Covers, and What to Gather First

A classic SEO audit asks whether Google can crawl, index and rank your pages. An AEO audit asks a narrower question: can an answer engine fetch the page, lift a correct passage out of it, and trust that passage enough to cite it? It's the health check for [answer engine optimization](/glossary/answer-engine-optimization).

The two overlap. Google's [AI features documentation](https://developers.google.com/search/docs/appearance/ai-features) says a page must be "indexed and eligible to be shown in Google Search with a snippet" to appear in AI Overviews or AI Mode. So an AEO audit keeps the SEO checks that decide eligibility and adds the ones that decide whether you get quoted.

| Area                            | Points | The question it answers                                   | Gates             |
| ------------------------------- | ------ | --------------------------------------------------------- | ----------------- |
| 1. Crawl permissions and access | 1–6    | Can each engine fetch and index the page?                 | Points 1, 3 and 6 |
| 2. Machine-readable summaries   | 7–10   | Can a machine tell what the site and each page are about? | None              |
| 3. Citation readiness           | 11–14  | Is there a passage worth quoting, with proof behind it?   | None              |
| 4. Prompt coverage              | 15–17  | Is there a page for each question buyers ask?             | None              |
| 5. Authority and link spread    | 18–20  | Do other sites vouch for the pages you want cited?        | None              |

### The five inputs to collect

1. **A page list:** your top 20 URLs, from pricing and product pages to the articles that answer buyer questions.
2. **Your robots.txt and 7 to 30 days of access logs** from your server or CDN.
3. **Access to Google Search Console and Bing Webmaster Tools.**
4. **At least 30 buyer prompts**, written without your brand name.
5. **A spreadsheet** with one row per point.

Score each point 2 (pass), 1 (partial: it passes for some pages or bots, or only in part) or 0 (fail). Plan a full working day for a first AEO audit of 20 pages. Areas 4 and 5 take longest, because you run prompts by hand and read link reports.

## Area 1: Crawl Permissions and Access (Points 1–6)

Access fails in silence. No engine emails you when its crawler gets a 403.

### 1. Search bots are allowed in robots.txt (gate)

**Check:** read robots.txt for the five search crawlers that feed answers today. They are OAI-SearchBot for ChatGPT search, Claude-SearchBot for Claude, PerplexityBot for Perplexity, Googlebot for AI Overviews and AI Mode, and Bingbot for Copilot. Watch for `User-agent: *` with `Disallow: /`, which catches every bot that has no group of its own.

**Pass:** all five may fetch every URL on your list. **Fail:** any one is blocked from a page you want cited. OpenAI says sites that opt out of OAI-SearchBot won't be shown in ChatGPT search answers, apart from navigational links.

**Tool:** our free [robots.txt tester](/tools/robots-txt-tester) tests each bot against each URL and names the rule that decided.

**Go deeper:** [The AI Crawler Directory](/blog/ai-crawler-directory) lists every documented bot, token and IP list.

### 2. Training bots are set on purpose

**Check:** find the rules for GPTBot, ClaudeBot, Google-Extended, Applebot-Extended and CCBot. These gather training data or govern model use; they aren't the search crawlers from point 1. OpenAI says disallowing GPTBot signals your content "should not be used in training." It doesn't take you out of ChatGPT search.

**Pass:** each rule matches a written decision that someone owns. **Fail:** rules nobody can explain, or a search bot blocked by accident while aiming at a training bot.

**Tool:** our [AI crawler robots.txt generator](/tools/ai-robots-txt-generator) groups bots by job.

**Go deeper:** [The AI Bot Crawler Census](/blog/ai-bot-crawler-census) shows how publishers split training rules from search rules.

### 3. The firewall lets verified AI bots through (gate)

**Check:** robots.txt can say yes while your CDN says no. Count the error codes AI bots got in the last 7 days, including the live fetchers ChatGPT-User, Claude-User and Perplexity-User. From 15 September 2026, Cloudflare [blocks agent bots by default](https://blog.cloudflare.com/content-independence-day-ai-options/) on ad-carrying pages of new domains, and it names ChatGPT-User as an agent.

**Pass:** zero 403, 429 or challenge responses to verified AI bots on public pages. **Fail:** any such response on a page you want cited.

**Command:** this assumes the common combined log format, where field 9 is the status code.

```bash
grep -E "OAI-SearchBot|ChatGPT-User|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User" access.log \
  | awk '$9 >= 400 {print $9}' | sort | uniq -c
```

On Cloudflare, [AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/) is available on all plans and shows which AI services reach your content.

**Go deeper:** [The Cloudflare Challenge Trap](/blog/cloudflare-challenge-trap) covers the settings that block AI fetchers and the rules that let them in.

### 4. Logs prove each engine visits, from its own IPs

**Check:** confirm each engine's search crawler fetched pages in the last 30 days. An engine missing for that long usually means a block you haven't found. Then test a sample of IP addresses against the vendors' published lists, because a user-agent string is easy to fake.

**Pass:** OAI-SearchBot, Claude-SearchBot and PerplexityBot each appear, and the sampled IPs match. **Fail:** none of the three has a verified hit in 30 days.

**Command:** replace the IP with one from your logs.

```bash
IP=216.73.216.5
for list in openai.com/searchbot.json openai.com/chatgpt-user.json \
  claude.com/crawling/bots.json www.perplexity.com/perplexitybot.json \
  www.perplexity.com/perplexity-user.json; do
  curl -sL "https://$list" | python3 -c "
import sys, json, ipaddress
ip = ipaddress.ip_address('$IP')
nets = [p.get('ipv4Prefix') or p.get('ipv6Prefix') for p in json.load(sys.stdin)['prefixes']]
print('$list', 'MATCH' if any(ip in ipaddress.ip_network(n) for n in nets) else '-')"
done
```

**Tool:** our free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) counts hits per bot inside your browser.

**Go deeper:** [How to Track GPTBot and ClaudeBot](/blog/how-to-track-gptbot-and-claudebot) sets up a weekly log routine.

### 5. The answer is in the raw HTML

**Check:** fetch each page without a browser and look for its key sentence, price or table. When Vercel studied crawler traffic, it found that ["none of the major AI crawlers currently render JavaScript,"](https://vercel.com/blog/the-rise-of-the-ai-crawler) OpenAI's and Anthropic's included. Bing's [webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) add that content which "cannot be reliably rendered may not be indexed or selected for grounding results."

**Pass:** the answer sentence on each page shows up in the raw HTML. **Fail:** prices, tables or FAQs appear only after JavaScript runs.

**Command:** `curl -sL https://tallyfold.example/pricing | grep -c "per user a month"`. A result of 0 means the phrase isn't in the HTML.

**Tool:** our [AI search readiness check](/tools/ai-search-readiness-check) fetches a page without JavaScript and counts the words it can see.

**Go deeper:** [How to Optimize Your Website for ChatGPT and Perplexity](/blog/optimize-website-for-chatgpt-and-perplexity).

### 6. Pages are indexed and allowed into AI answers (gate)

**Check:** inspect each URL in Search Console and Bing Webmaster Tools, then look for directives that shut AI features out. Google lists `noindex`, `nosnippet`, `data-nosnippet` and `max-snippet` as controls that limit its AI features, and Bing says `noarchive` "prevents content from being used in Copilot responses." Last, open Settings in Search Console and confirm the [Search generative AI control](https://support.google.com/webmasters/answer/16908024) reads Include.

**Pass:** all 20 pages are indexed in both engines, carry none of those directives, and the control says Include. **Fail:** any one of the three.

**Command:** `curl -sIL URL | grep -i x-robots-tag` shows header directives, and `curl -sL URL | grep -o -i '<meta name="robots"[^>]*>'` shows the meta tag.

**Go deeper:** [Bing Webmaster Tools Is the New Google Search Console](/blog/bing-webmaster-tools-ai-indexing-guide).

## Area 2: Machine-Readable Structured Summaries (Points 7–10)

This area checks the summaries machines read alongside your prose: llms.txt, your entity graph in JSON-LD, and each page's head tags. Keep the stakes in view. Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says "structured data isn't required for generative AI search." These points help engines and agents understand you. They don't buy a citation on their own.

### 7. llms.txt exists and follows the spec

**Check:** the [llms.txt proposal](https://llmstxt.org/) puts a Markdown file at `/llms.txt`. Its only required part is an H1 with the site's name. After that come a blockquote summary and H2 sections that list links as `[name](url): notes`. Serve it as plain text, and make sure every link works.

**Pass:** a 200 response in plain text, one H1 on the first line, a summary, spec-style links and no broken links. **Fail:** an HTML page at that path, bare URLs, several H1s, or robots.txt rules pasted in.

**Command:** this prints the status and counts each part of the file.

```bash
SITE=https://tallyfold.example
curl -sL -o /dev/null -w "status %{http_code}, type %{content_type}\n" "$SITE/llms.txt"
curl -sL "$SITE/llms.txt" | python3 -c "
import re, sys
lines = sys.stdin.read().splitlines()
text = [l for l in lines if l.strip()]
links = [l for l in lines if re.match(r'^\s*- \[[^\]]+\]\([^)]+\)(: .*)?$', l)]
print('H1 first:', bool(text) and text[0].startswith('# '), '| H1s:', sum(l.startswith('# ') for l in lines))
print('Summary:', any(l.startswith('> ') for l in lines), '| H2s:', sum(l.startswith('## ') for l in lines))
print('Spec links:', len(links), '| bare URLs:', sum(bool(re.match(r'^\s*-\s+https?://', l)) for l in lines))"
```

**Weight:** fix it last in this area. Google's guide says such files "will neither harm nor help" in Search, which ignores them. The file serves agents and tools that choose to read it.

**Tool:** our [llms.txt generator](/tools/llms-txt-generator) writes a file in the spec's format.

**Go deeper:** [The llms.txt Standard, Explained Line by Line](/blog/llms-txt-standard).

### 8. Your organization is one complete entity node

**Check:** view the JSON-LD on your homepage or about page. Google [recommends placing Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization) on one of those two pages, and says it has no required properties, so completeness is up to you. Look for a stable `@id`, name, url, logo, a one-line description and a `sameAs` list with every official profile.

**Pass:** one Organization node with those fields, and every `sameAs` profile links back to your site. **Fail:** no node, two nodes that disagree, or `sameAs` links to profiles you don't control.

**Tool:** our [schema generator](/tools/schema-generator) writes the node, and the [Schema Markup Validator](https://validator.schema.org/) parses the markup so you can read each node and its properties.

**Go deeper:** [Building a Knowledge Graph for AI](/blog/knowledge-graph-for-ai).

### 9. Page markup links to that node and matches the page

**Check:** on each key page, the Article, Product or SoftwareApplication node should point to your organization's `@id` as its publisher, brand or provider, instead of repeating a loose copy. Then compare every price, date and name in the markup with the visible text. Bing's guidelines say markup "must accurately reflect visible content," and that misleading markup "may be ignored."

**Pass:** markup parses on every key page, references the same `@id`, and has zero mismatches with the text. **Fail:** parse errors, orphan copies of your organization, or a single price that differs.

**Go deeper:** [SEO Knowledge Graph](/blog/seo-knowledge-graph) for connecting nodes, and [Hallucination by Omission](/blog/hallucination-by-omission-pricing-page) for price markup.

### 10. Every key page has a clear summary layer

**Check:** each page needs a title, a meta description, one H1 and a canonical that points to itself. They tell any parser what the page is. Bing warns that duplicate URLs "reduce Bing's confidence in selecting a URL for grounding results or citations."

**Pass:** every page on your list has a unique title, a 120–160-character description, one H1 and a self-referencing canonical. **Fail:** any tag missing or copied from another page.

**Tool:** the [AI search readiness check](/tools/ai-search-readiness-check) grades all four in one run, along with bot access, llms.txt presence and JSON-LD.

**Go deeper:** [How to Optimize Content for LLMs](/blog/optimize-content-for-llms-writing-for-machines).

## Area 3: Citation Readiness (Points 11–14)

A reachable, well-labeled page still has to hold something worth quoting, and this is where most AEO work happens. The [research paper that named GEO](https://arxiv.org/abs/2311.09735) reported that content changes "can boost visibility by up to 40%" in generative engine answers, and adding quotes, statistics and cited sources ranked among the strongest methods it tested.

### 11. Sections open with the answer

**Check:** sample 10 sections across your key pages and read only the first sentence under each heading. Does it answer the heading on its own?

**Pass:** 8 or more of the 10 do. **Fail:** 5 or fewer.

**Tool:** our [AI citation readiness checker](/tools/ai-citation-readiness-checker) scores answer-first openings, sentence length and question-style headings.

**Go deeper:** [How to Optimize Content for AI Search](/blog/optimize-content-for-ai-search), which walks through the Lift Test.

### 12. Claims carry numbers and named sources

**Check:** on each key page, mark every statistic, price and claim about another company. Each one should name its source and link to it.

**Pass:** every such claim is sourced, and each section holds at least one concrete number, date or named source. **Fail:** unsourced figures across most key pages, or sections made only of adjectives.

**Tool:** the same checker flags pages short on numbers and named sources.

**Go deeper:** [How to Write Blog Posts for AI Citation](/blog/how-to-write-blog-posts-for-ai-citation).

### 13. Fact pages show honest dates

**Check:** look for a visible "Updated" date on pricing, docs and comparison pages, and compare it with `dateModified` in the markup. [Ahrefs' study](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) of 17 million citations found AI assistants cited content 25.7% fresher than Google's organic results, on average. But a date that changes on every deploy tells engines nothing true.

**Pass:** each fact page shows a date that matches its markup, changed only when the content did, within the last 12 months. **Fail:** no date, or dates that update on every build.

**Go deeper:** the freshness section of our guide to [optimizing for ChatGPT and Perplexity](/blog/optimize-website-for-chatgpt-and-perplexity).

### 14. An official page exists for each fact buyers check

**Check:** list the facts buyers ask engines to confirm: price, plans, features, integrations, how you compare with rivals, security and company details. Each one needs a single official URL that states it in plain text.

**Pass:** every fact has a page, and the page answers in text, not only in an image or a PDF. **Fail:** pricing or core product facts have no page, which leaves engines to borrow someone else's version.

**Go deeper:** [Hallucination by Omission](/blog/hallucination-by-omission-pricing-page) for pricing, and [The Comparison Page Formula](/blog/comparison-page-formula) for rival comparisons.

## Area 4: Prompt Coverage Gaps (Points 15–17)

The first three areas grade pages you have. This one finds the pages you lack, which makes it the part of an AEO audit that turns into a content plan.

### 15. Buyer prompts map to pages

**Check:** write 30 or more prompts that buyers would type, without your brand name. Mix problems, "best X for Y" questions, comparisons and alternatives. Map each prompt to the one URL that should win it, or mark it as a gap.

**Pass:** at least 80% of prompts have a matching page, and every gap has a planned page. **Fail:** under 60% mapped, or no prompt list at all.

**Tool:** our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) writes 30 prompts across the buying journey, and the [AI question generator](/tools/ai-question-generator) finds more.

**Go deeper:** [How to See If AI Mentions Your Brand](/blog/how-to-see-if-ai-mentions-your-brand).

### 16. A baseline exists, run more than once

**Check:** run every prompt at least twice in each of three engines, from a clean session, and log whether you were named and whether you were cited. When SparkToro studied 2,961 runs, it found [less than a 1-in-100 chance](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/) that ChatGPT or Google's AI would return the same brand list twice. One run is a sample of one.

**Pass:** a log of named and cited rates for each engine, with the number of answers behind each rate. **Fail:** screenshots, or a single run per prompt.

Add the free first-party data while you're here. Bing's [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) counts citations across Copilot and Bing's AI summaries, with the grounding queries behind them. Search Console's [generative AI report](https://support.google.com/webmasters/answer/16984139) counts impressions in AI Overviews and AI Mode.

**Go deeper:** [How to Measure GEO](/blog/how-to-measure-geo) for sample sizes, and [How to Benchmark AI Search Performance](/blog/how-to-benchmark-ai-search-performance) for a comparison sheet.

### 17. Answers about your brand are accurate

**Check:** run six branded prompts, such as "What is Tallyfold?", "Tallyfold pricing" and "Tallyfold vs Brindlework," three times each in three engines. That's 54 answers. Mark every wrong price, feature or company fact.

**Pass:** 90% or more of answers get your core facts right. **Fail:** under 75%, or any wrong price.

**Go deeper:** [How to Fix Incorrect Brand Facts in AI Answers](/blog/fix-incorrect-brand-facts-in-ai-answers).

## Area 5: Authority and Backlink Distribution (Points 18–20)

AI answers lean on what other sites say about you. Ahrefs' [May 2025 study](https://ahrefs.com/blog/ai-overview-brand-correlation/) of AI Overviews found branded web mentions correlated at 0.664 and backlinks at 0.218. The December 2025 study, across ChatGPT, AI Mode and AI Overviews, found YouTube mentions led at about 0.737. These are correlations, not proof of cause, but they point this part of the AEO audit at mentions, anchors and where links land.

### 18. Links reach the pages you want cited

**Check:** in Search Console's [Links report](https://support.google.com/webmasters/answer/9049606), open Top linked pages. Compare the linking sites for your homepage with those for your top 10 answer pages. The report shows a sample, capped at 1,000 rows, so treat it as a guide. Ahrefs' [webmaster tools](https://ahrefs.com/webmaster-tools), free for sites you verify as of 29 September 2026, add a fuller backlink view.

**Pass (our rule of thumb, not a published benchmark):** at least half of your top 10 answer pages have links from two or more relevant external sites. **Fail:** fewer than 3 of the 10 have any external links at all.

**Go deeper:** [Entity Authority in the AI Era](/blog/entity-authority-in-the-ai-era) explains how links and entities work together now.

### 19. You're named on the sources engines cite

**Check:** from your baseline in point 16, list the third-party pages engines cited for category prompts: review sites, "best X" roundups, Reddit threads and YouTube videos. Count how many name you. Look at anchor text as well. In Ahrefs' December data, branded anchors correlated with ChatGPT visibility at 0.511.

**Pass:** you're named on at least a third of the cited third-party pages. **Fail:** you're named on fewer than 1 in 10.

**Go deeper:** [How to Rank on ChatGPT](/blog/how-to-rank-on-chatgpt) and [Brand Presence in Perplexity](/blog/brand-presence-in-perplexity).

### 20. Your entity facts agree everywhere

**Check:** compare your name, category, founding year, headquarters, pricing model and founders across your site, LinkedIn, Crunchbase, G2 or Capterra, and Wikidata if you qualify for an item. Look yourself up in Google's Knowledge Graph too, using the method in our [Knowledge Graph Search API guide](/blog/knowledge-graph-search-api).

**Pass:** every profile states the same core facts as your site. **Fail:** two or more profiles disagree with it.

**Go deeper:** [Entity Authority SEO: A 30-Day Plan to Build It](/blog/entity-authority-seo).

## The Gate-First AEO Audit Scorecard

Add up the 20 scores for a total out of 40, then read the band. The gates come first: points 1, 3 and 6 stop fetching or indexing outright, so a high total means nothing until they pass.

| Area                         | Points        | Maximum |
| ---------------------------- | ------------- | ------- |
| Crawl permissions and access | 1–6           | 12      |
| Machine-readable summaries   | 7–10          | 8       |
| Citation readiness           | 11–14         | 8       |
| Prompt coverage              | 15–17         | 6       |
| Authority and link spread    | 18–20         | 6       |
| **Total**                    | **20 points** | **40**  |

| Result                     | Band     | What it means                                      | Next step                             |
| -------------------------- | -------- | -------------------------------------------------- | ------------------------------------- |
| 34–40, no gate at 0        | Citable  | Engines can reach, read and trust your pages       | Re-audit every quarter                |
| 24–33, no gate at 0        | Readable | The site works; the gaps are content and authority | Close prompt gaps, then earn mentions |
| Under 24, or any gate at 0 | Blocked  | Something stops engines before quality matters     | Fix the gates, then area 2            |

Give each point a row with its score, the evidence you saw, the fix, an owner and a date to check again. The evidence column matters most: when a score moves next quarter, it tells you why.

## Worked Example: Tallyfold's First AEO Audit

Tallyfold is a fictional invoicing and payments app for agencies, at tallyfold.example. Its rivals, Brindlework and Kestrelyn, are fictional too. The team audits 20 URLs and 30 prompts. Every finding below is illustrative.

| #   | Point                      | Score | What the audit found                                                          |
| --- | -------------------------- | ----- | ----------------------------------------------------------------------------- |
| 1   | Search bots allowed        | 2     | All five allowed on every URL                                                 |
| 2   | Training bots on purpose   | 1     | GPTBot blocked by choice; ClaudeBot and CCBot have no rule and no decision    |
| 3   | Firewall lets bots through | 0     | Bot protection returned 403 to 212 of 1,040 ChatGPT-User fetches in 7 days    |
| 4   | Logs verified by IP        | 1     | OAI-SearchBot and PerplexityBot verified; no Claude-SearchBot hits in 30 days |
| 5   | Answer in raw HTML         | 1     | Articles fine; the pricing table is built by JavaScript                       |
| 6   | Indexed, AI features on    | 2     | All 20 indexed in both engines; control set to Include                        |
| 7   | llms.txt follows spec      | 1     | Valid H1 and links, but no summary and 3 broken links                         |
| 8   | Organization node          | 1     | No `@id`; `sameAs` lists 2 of 6 profiles                                      |
| 9   | Markup linked and true     | 0     | The Offer says $15 a user; the page says $12                                  |
| 10  | Summary layer              | 2     | All tags present and unique                                                   |
| 11  | Answer-first sections      | 1     | 7 of 10 sampled sections                                                      |
| 12  | Sourced claims             | 1     | Three unsourced statistics on the features page                               |
| 13  | Honest dates               | 0     | No visible dates; `dateModified` changes on every deploy                      |
| 14  | Official fact pages        | 1     | No page comparing Tallyfold with Brindlework                                  |
| 15  | Prompts mapped             | 1     | 21 of 30 prompts mapped (70%)                                                 |
| 16  | Baseline                   | 0     | Screenshots only                                                              |
| 17  | Brand accuracy             | 1     | 44 of 54 branded answers right (81%); no price errors                         |
| 18  | Link spread                | 0     | Homepage has 58 linking sites; 1 of 10 answer pages has any                   |
| 19  | Named on cited sources     | 1     | Named on 4 of 15 cited third-party pages (27%)                                |
| 20  | Entity facts agree         | 1     | G2 still shows a retired plan; other profiles agree                           |

The area totals are 7 of 12, 4 of 8, 3 of 8, 2 of 6 and 2 of 6: 18 of 40, with point 3, a gate, at 0. Tallyfold is Blocked even though its robots.txt is perfect. The file said yes; the firewall said no to one fetch in five.

### The fix order

1. **Round 1, week one: the gate and cheap fixes.** A skip rule for verified AI bots (point 3, +2), the correct price in the markup (point 9, +2), visible dates with an honest `dateModified` (point 13, +2), a server-rendered pricing table (point 5, +1), a spec-clean llms.txt (point 7, +1) and a full Organization node (point 8, +1). That's +9, for 27 of 40: Readable.
2. **Round 2, weeks two to four.** A real baseline (point 16, +2), a written training-bot decision (point 2, +1) and sources for the three statistics (point 12, +1). That's +4, for 31.
3. **Round 3, the rest of the quarter.** The Brindlework comparison (point 14), pages for the nine unmapped prompts (point 15) and three rewritten openings (point 11). If all three land, Tallyfold reaches 34: Citable. Link and mention work (points 18 to 20) starts now but pays out over months.

Rounds 1 and 2 lift Tallyfold from 18 to 31 without one new article. Round 3 decides who gets cited.

## How Often to Run an AEO Audit

Run the full AEO audit once a quarter. Re-check area 1 every month, and after any change to robots.txt, your CDN or your firewall, since those break access overnight. Refresh the baseline in point 16 monthly.

This audit covers the whole site. For a check you run on each new article before it goes live, use our [30-minute pre-publish AI SEO checklist](/blog/ai-seo-checklist-pre-publish-audit).

Once the manual version works, automate parts of it. Trackers can take over points 16 and 17, and log tools points 3 and 4. For options sorted by job, with free ones first, see our [GEO tools list](/blog/geo-tools-list). Before you pay for any of them, test whether it moves your numbers with the pilot in [how to evaluate a GEO tool before purchasing](/blog/evaluate-geo-tool-before-purchasing).

## Where Rankbox Fits in an AEO Audit

Rankbox's paid product doesn't run an AEO audit for you. It doesn't crawl sites, manage robots.txt or llms.txt, or track AI citations. Its free tools cover several checks: the [AI search readiness check](/tools/ai-search-readiness-check) for points 1, 5, 7 and 10, the robots.txt tester for point 1, the llms.txt generator for point 7, the schema generator for points 8 and 9, the citation readiness checker for points 11 and 12, the log analyzer for points 3 and 4, and the Prompt Kit for point 15.

The paid product fits the gaps areas 3 and 4 uncover. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google. The [Citation-Ready Writer](/features/citation-ready-writer) then researches the live web and writes 2,000–3,500-word source-backed articles for those gaps, and they reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial. [See pricing](/pricing).

## Frequently Asked Questions

### What is an AEO audit?

An AEO audit is a structured check of whether answer engines such as ChatGPT, Perplexity, Claude and Google's AI Overviews can fetch your pages, understand them and find a reason to cite them. It covers crawler access, structured summaries, citation readiness, prompt coverage and authority.

### How long does an AEO audit take?

Plan a full working day for a first AEO audit of about 20 pages and 30 prompts. Crawler and markup checks go quickly with free tools; running prompts and reading link reports take longest. Later audits are faster, because the page list, prompts and sheet already exist.

### How is an AEO audit different from an SEO audit?

An SEO audit asks whether Google can crawl, index and rank your pages. An AEO audit keeps the eligibility checks and adds what answer engines need: access for AI bots, passages that stand alone, sourced facts, a prompt map and mentions on cited sites.

### Do I need an llms.txt file to pass an AEO audit?

No. It's one point out of 20, and Google says its Search ignores llms.txt files. If you publish one, follow the llmstxt.org format: an H1, a short summary and lists of working links. Validate it before you count it.

### How often should you run an AEO audit?

Run a full AEO audit every quarter, and re-check crawler access monthly or after any robots.txt, CDN or firewall change. Refresh your prompt baseline every month, so you see trends rather than noise.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
3. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/guides/bots)
4. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
5. [AI optimization guide, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
6. [Search generative AI control, Search Console Help](https://support.google.com/webmasters/answer/16908024)
7. [Bing Webmaster Guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
8. [Your site, your rules: new AI traffic options, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
9. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
10. [The /llms.txt file, llmstxt.org](https://llmstxt.org/)
11. [Organization structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/organization)
12. [GEO: Generative Engine Optimization (Aggarwal et al., KDD 2024), arXiv](https://arxiv.org/abs/2311.09735)
13. [Do AI assistants prefer to cite fresh content?, Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/)
14. [An analysis of AI Overview brand visibility factors (75K brands), Ahrefs](https://ahrefs.com/blog/ai-overview-brand-correlation/)
15. [AI brand visibility correlations across ChatGPT, AI Mode and AI Overviews, Ahrefs](https://ahrefs.com/blog/ai-brand-visibility-correlations/)
16. [AIs are highly inconsistent when recommending brands or products, SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
17. [Introducing AI Performance in Bing Webmaster Tools, Microsoft Bing](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
18. [Generative AI performance report, Search Console Help](https://support.google.com/webmasters/answer/16984139)
19. [Links report, Search Console Help](https://support.google.com/webmasters/answer/9049606)
