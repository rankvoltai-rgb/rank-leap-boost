---
title: Perplexity SEO Tools: Track and Earn Perplexity Citations
description: Perplexity SEO tools sorted by job: bot access checks, trackers with dated prices, a DIY API tracker with cost math, and ways to earn the sources it cites.
keyword: Perplexity SEO tools
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI SEO Tools, AI Visibility
---

Perplexity SEO tools do five jobs. They check that Perplexity's bots can reach your pages, track how often its answers cite you, let you run your own tracker on Perplexity's API, help you win a place among the sources it reads, and connect you to Perplexity's own publisher and merchant programs. Most teams need the first two jobs, and a developer can build the third for under $2 a month in API fees.

Perplexity is the easiest AI engine to measure. Its answers show numbered sources, and its API hands back the same kind of source list as data. It also leans on pages that already rank: in an [Ahrefs study of 15,000 prompts](https://ahrefs.com/blog/ai-search-overlap/), 28.6% of the URLs Perplexity cited sat in Google's top 10, far more than the other assistants tested.

One change makes this week a good time to check your setup. Perplexity's developer docs now say its Sonar chat API ["will be supported until September 27, 2026"](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview) and recommend the Agent API for all new projects. Any tracking script written for Sonar needs updating.

This guide sorts Perplexity SEO tools by the job each one does, with prices checked on 28 September 2026. For how Perplexity crawls and ranks pages, read our [Perplexity SEO guide](/ai-seo/perplexity). For how to read the numbers once you have them, see [how to measure GEO](/blog/how-to-measure-geo).

## Key Takeaways

- Sort Perplexity SEO tools by job: access checks, tracking, DIY tracking on the API, earning sources, and Perplexity's own programs. Buy for the job you have now.
- PerplexityBot builds Perplexity's index. Perplexity-User fetches pages live for a user's question and "generally ignores robots.txt rules," per Perplexity. Verify both against the two IP lists Perplexity publishes.
- Otterly.AI Lite includes Perplexity for $29 a month (15 prompts, daily), and AthenaHQ's free Essential tier includes it with 300 credits, both as listed on 28 September 2026.
- Build new DIY trackers on `POST https://api.perplexity.ai/v1/agent` with the `fast` preset. Sources arrive in a `search_results` item, and each `[n]` marker in the answer points to a result `id`.
- A 30-prompt panel run three times a week costs roughly $0.66 to $1.56 a month in API fees at Perplexity's published rates on 28 September 2026.
- API answers can differ from perplexity.ai. Perplexity says the configuration and the model can differ, so use a DIY panel for trends and source lists, not as a copy of what users see.
- Perplexity SEO tools show the gaps. Pages and third-party mentions close them. Rankbox writes those pages, but it doesn't track AI citations today.

## The Five Jobs Perplexity SEO Tools Do

Most "best Perplexity SEO tools" lists are one long ranking of trackers. That hides the fact that a tracker is only one of five jobs. Here is the whole map, with what each job costs to start.

| Job | The question it answers | Example tools | Cost to start (28 Sep 2026) |
| --- | --- | --- | --- |
| 1. Access checks | Can PerplexityBot and Perplexity-User fetch my pages? | Server logs, Perplexity's IP lists, free log and robots.txt tools | Free |
| 2. Tracking | How often do Perplexity answers name or cite me? | Otterly.AI, Semrush, Ahrefs Brand Radar, SE Ranking, Surfer, Peec AI, AthenaHQ, Profound | Free tier to custom contract |
| 3. DIY tracking | The same, on my own prompts, as raw data I own | Perplexity's Agent API and a short script | Under $2 a month in API fees for 90 answers a week |
| 4. Earning sources | Which pages does Perplexity cite instead of mine, and how do I get onto them? | Your source list, content tools, Reddit, YouTube and review sites | Mostly time |
| 5. Perplexity's programs | Can I get paid for citations, or feed it my products? | Comet Plus, the Merchant Program, Instant Buy with PayPal | Free to apply |

Use Perplexity SEO tools in that order. A page Perplexity's bots are blocked from reading has no chance of being cited, so access comes first. Tracking comes second because it tells you where to spend effort. The rest is where the results come from.

## Job 1: Check That Perplexity's Bots Can Reach You

Access checks are the cheapest Perplexity SEO tools on this list. Perplexity publishes its bots, their user agents and their IP ranges on one [crawlers page](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), and your own logs do the rest.

### Two bots, two different signals

- **PerplexityBot** "is designed to surface and link websites in search results on Perplexity," and Perplexity says it isn't used to crawl content for AI foundation models. It follows robots.txt. Its hits tell you the index can see your pages.
- **Perplexity-User** fetches a page when a user's question needs it. "Since a user requested the fetch, this fetcher generally ignores robots.txt rules," the same page says. Each hit is a real question that pulled your page, which makes it the closest thing to a citation signal in your own logs.

Perplexity says robots.txt changes can take up to 24 hours to apply. If you block or unblock either bot, wait a day before you judge the result.

### Verify hits against the published IP ranges

User agents are easy to fake, so check the source IP of heavy hitters. Perplexity publishes two lists: [perplexitybot.json](https://www.perplexity.com/perplexitybot.json) and [perplexity-user.json](https://www.perplexity.com/perplexity-user.json). Each holds a `prefixes` array of `ipv4Prefix` ranges. On 28 September 2026 the first listed 8 ranges and the second listed 4. This short script checks an IP against both:

```python
import ipaddress, json, urllib.request

LISTS = {
    "PerplexityBot": "https://www.perplexity.com/perplexitybot.json",
    "Perplexity-User": "https://www.perplexity.com/perplexity-user.json",
}

def load(url):
    data = json.load(urllib.request.urlopen(url))
    return [ipaddress.ip_network(p["ipv4Prefix"])
            for p in data["prefixes"] if "ipv4Prefix" in p]

nets = {bot: load(url) for bot, url in LISTS.items()}

def verify(ip, bot):
    addr = ipaddress.ip_address(ip)
    return any(addr in net for net in nets[bot])

print(verify("18.97.1.229", "PerplexityBot"))  # True on 28 Sep 2026
```

Run it on a schedule if your firewall allowlists these ranges. Perplexity's docs tell you to automate the refresh, because the lists change.

### Free Perplexity SEO tools for access checks

1. **Your logs.** Export a day of access logs and paste them into our free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer). It counts hits by bot and lists the pages each one fetched, and nothing leaves your browser.
2. **A robots.txt test.** The [robots.txt tester](/tools/robots-txt-tester) shows whether a rule blocks PerplexityBot on a given URL, and which line did it.
3. **A firewall rule.** Perplexity's docs give a Cloudflare rule: user agent contains PerplexityBot or Perplexity-User, AND source IP is in the published ranges, then Allow. The docs say a firewall may need this rule before the bots get through.
4. **A page scan.** The [AI search readiness check](/tools/ai-search-readiness-check) scans one URL for 12 signals, including crawler access in robots.txt.

## Job 2: Trackers That Cover Perplexity, and How They Collect It

Most Perplexity SEO tools on "best of" lists are trackers. A tracker runs your prompts on a schedule and records whether each answer names or links you. For Perplexity, the useful differences sit below the price tag.

### Five questions to ask about Perplexity coverage

1. **Is Perplexity on the plan you'd buy?** Some vendors keep it on a higher tier or sell it as an add-on.
2. **Does it query perplexity.ai like a user, or call the API?** Perplexity's own [API FAQ](https://docs.perplexity.ai/docs/resources/faq) says results can differ between the two.
3. **Does it store the full source list?** You want every cited URL per answer, not a yes or no for your brand.
4. **How many runs per prompt, and from where?** One run is a sample of one, and location changes sources.
5. **Can you export raw answers?** Raw answers let you check a surprising number yourself.

If a vendor's pages don't answer a question, ask before you buy. To see where trackers sit among other Perplexity SEO tools and AI search tools, read our [guide to AI search optimization tools](/blog/ai-search-optimization-tools). For the ChatGPT side of the same tools, see our [ChatGPT rank tracker guide](/blog/chatgpt-rank-tracker).

### Perplexity SEO tools for tracking, compared

Prices are as listed on each vendor's site on 28 September 2026, except Peec AI's, which come from a Peec page that says they were confirmed on 10 July 2026. "Not stated" means the vendor's public pages don't say.

| Tool and plan | Perplexity on this plan? | Price | Prompts | How it collects answers, in the vendor's words |
| --- | --- | --- | --- | --- |
| Otterly.AI Lite | Yes, by default | $29/mo | 15, daily | "Queries as a neutral, non-personalized user" |
| Semrush AI Visibility Toolkit | Yes | $99/mo per domain | 25, daily | Not stated |
| Ahrefs Brand Radar prompts | Yes, per platform | From $50/mo | 2,500 checks | Not stated |
| SE Ranking + AI Search add-on | Yes, in the add-on | $129 + $89/mo | 200 | Not stated |
| Surfer AI Search Analytics | Yes | $95/mo | 50, daily | Not stated |
| Peec AI Starter | Listed as an add-on | $95/mo + $35 | 50, daily | "UI scraping rather than APIs" |
| AthenaHQ Essential | Yes | Free | 300 credits | Not stated |
| Profound Enterprise | Yes | Custom | Custom | "Directly from the consumer browsing experience" |

### What each tracker does with Perplexity

**Otterly.AI.** Lite is [$29 a month](https://otterly.ai/pricing), or $25 billed yearly, for 15 prompts checked daily. Perplexity is one of four default engines on every plan, with ChatGPT, Google AI Overviews and Microsoft Copilot, and Lite allows unlimited team members. Otterly says it [queries as a neutral, non-personalized user](https://help.otterly.ai/what-is-otterly.ai). Best for a small team that wants Perplexity from day one.

**Semrush AI Visibility Toolkit.** It's [$99 a month per domain](https://www.semrush.com/pricing/ai/), for 25 custom prompts tracked daily. Perplexity is in the base plan, beside ChatGPT, Google AI and Gemini. Best for teams already running their SEO in Semrush.

**Ahrefs Brand Radar.** Brand Radar's index holds [about 30.9 million Perplexity prompts](https://ahrefs.com/brand-radar), so you can look up any brand's Perplexity visibility with no setup. The index starts at $199 a month and is re-tested monthly. For your own prompts, packages start at [$50 a month for 2,500 checks](https://ahrefs.com/pricing), where one check is one prompt, on one platform, in one location, per update. Thirty Perplexity prompts a day for 30 days is 900 checks, well inside that. Best for competitor research at scale.

**SE Ranking.** The [AI Search add-on](https://seranking.com/subscription.html) is $89 a month on monthly billing, on top of a base plan from $129. Its AI Results Tracker lists Perplexity with AI Overviews, AI Mode and ChatGPT, for 200 prompts. Best for agencies that already report from SE Ranking.

**Surfer AI Search Analytics.** It's [$95 a month, or $82 billed yearly](https://surferseo.com/pricing/), for 50 prompts refreshed daily across ChatGPT, Perplexity, Google AI Mode, AI Overviews and Gemini. Best for content teams who already write in Surfer's editor.

**Peec AI.** Peec's [AI-instructions page](https://peec.ai/ai-instructions) says it uses "UI scraping rather than APIs for most tracked engines," so its Perplexity data comes from the interface users see. That page lists Starter at $95 a month for 50 prompts on three models, and says every plan includes Perplexity. Peec's [pricing page](https://peec.ai/pricing) tells a different story on 28 September 2026. It lists Starter's models as ChatGPT, AI Mode, AI Overviews, Copilot, Gemini and Naver AI, and shows Perplexity under add-on models, which the instructions page prices at $35 a month on Starter. Ask Peec which applies before you buy.

**AthenaHQ.** The free Essential tier on its [plans page](https://athenahq.ai/plans) gives you 300 credits across ChatGPT, Perplexity, AI Overviews, Gemini and Copilot, with unlimited members. One credit is one AI response, so a 30-prompt panel on all five engines uses 150 credits per run. Starter is $295 a month for 3,600 credits. Best for a free first look.

**Profound.** Profound says it [captures responses "directly from the consumer browsing experience rather than from model APIs."](https://www.tryprofound.com/ai-instructions) Its free Trial covers ChatGPT, Gemini and Google AI Overviews. Perplexity comes with [Enterprise](https://www.tryprofound.com/pricing), a custom contract that tracks up to nine engines. Best for large brands with a procurement process.

## Job 3: Build a DIY Perplexity Tracker (the Source Ledger)

Paid Perplexity SEO tools save time. A DIY tracker gives you something they may not: every source URL, every search query Perplexity ran, and the cost of each answer, in a file you own. We call this recipe the Source Ledger. It fits a team with a developer and a fixed list of 20 to 50 prompts.

### Sonar is now the Agent API

The old way was Sonar: `POST https://api.perplexity.ai/v1/sonar` with a model such as `sonar`, returning a `citations` array of URLs. Perplexity's docs say Sonar "will be supported until September 27, 2026" and recommend "Using the Agent API for all new projects." Its [migration guide](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/how-to) maps `sonar` to the `fast` preset.

Here is what changes if you have an old script:

| Sonar (legacy) | Agent API (current) |
| --- | --- |
| `POST /v1/sonar` | `POST /v1/agent` |
| `"model": "sonar"` | `"preset": "fast"` |
| `"messages": [...]` | `"input": "your prompt"` |
| Top-level `citations` URL list | `search_results` item in `output`, with `results` and `queries` |
| Answer in `choices[0].message.content` | Answer in a `message` item's `output_text` part |

The auth header stays the same: `Authorization: Bearer` plus your API key. According to the [API reference](https://docs.perplexity.ai/api-reference/agent-post), each result carries an `id`, `url`, `title`, `snippet`, `date` and `last_updated`. The [web search docs](https://docs.perplexity.ai/docs/agent-api/tools/web-search) say each `[n]` marker in the answer "refers to a result's `id`," and the answer's text parts also carry `url_citation` annotations with the cited URL.

### The recipe

Put one prompt per line in `prompts.txt`, set `PERPLEXITY_API_KEY`, install `requests`, and run this once a week. It's written against Perplexity's API reference as of 28 September 2026.

```python
# source_ledger.py: log which sources Perplexity cites for each prompt
import csv, datetime, os, re, time
from urllib.parse import urlparse
import requests

API_URL = "https://api.perplexity.ai/v1/agent"
HEADERS = {"Authorization": f"Bearer {os.environ['PERPLEXITY_API_KEY']}"}
DOMAIN = "plannora.io"  # your domain (Plannora is a made-up example)
RUNS = 3

def host(url):
    return urlparse(url).hostname or ""

def is_mine(url):
    return host(url) == DOMAIN or host(url).endswith("." + DOMAIN)

prompts = [p.strip() for p in open("prompts.txt") if p.strip()]
with open("ledger.csv", "a", newline="") as f:
    out = csv.writer(f)
    if f.tell() == 0:
        out.writerow(["date", "prompt", "run", "model", "retrieved", "cited",
                      "my_urls", "cited_domains", "queries", "cost_usd"])
    for prompt in prompts:
        for run in range(1, RUNS + 1):
            r = requests.post(API_URL, headers=HEADERS, timeout=120,
                              json={"preset": "fast", "input": prompt})
            r.raise_for_status()
            data = r.json()
            results, queries, text, cited = [], [], "", set()
            for item in data["output"]:
                if item["type"] == "search_results":
                    results += item["results"]
                    queries += item.get("queries", [])
                elif item["type"] == "message":
                    for part in item["content"]:
                        text += part.get("text", "")
                        cited |= {a["url"] for a in part.get("annotations", [])
                                  if a.get("type") == "url_citation"}
            ids = {int(n) for n in re.findall(r"\[(\d+)\]", text)}
            cited |= {x["url"] for x in results if x["id"] in ids}
            mine = [x for x in results if is_mine(x["url"])]
            out.writerow([
                datetime.date.today().isoformat(), prompt, run, data["model"],
                bool(mine), any(is_mine(u) for u in cited),
                " ".join(x["url"] for x in mine),
                " ".join(sorted({host(u) for u in cited})),
                " | ".join(queries),
                data.get("usage", {}).get("cost", {}).get("total_cost"),
            ])
            time.sleep(1)
```

### What each column tells you

- **Retrieved** is true when your domain is in the result set Perplexity searched. You were in the running.
- **Cited** is true when the answer cites one of your pages, either through a `url_citation` annotation or an `[n]` marker that points at your result. You won a source slot.
- **Cited domains** lists every site the answer leaned on. This is your target list for Job 4.
- **Queries** holds the searches Perplexity ran for the prompt. These are the sub-questions your pages need to answer, a pattern called [query fan-out](/glossary/query-fan-out).
- **Model** matters because presets aren't versioned. Perplexity says calling a preset "always resolves to the latest Perplexity-recommended configuration," so a jump in your numbers may be a model change, not your work.
- **Cost** comes from `usage.cost.total_cost`, which Perplexity's pricing page says reports the calculated request cost.

Keep retrieved and cited apart. A page that is often retrieved but rarely cited is close. Rewriting its opening passage may be enough. A page that is never retrieved has an access, indexing or relevance problem first.

### What a 30-prompt, 3-run weekly panel costs

On 28 September 2026 the `fast` preset runs `openai/gpt-6-luna` on priority processing, per Perplexity's [presets page](https://docs.perplexity.ai/docs/agent-api/presets). The [changelog](https://docs.perplexity.ai/docs/resources/changelog) says priority "uses 2× the model's standard token prices," and that the preset's search now costs $1.00 per 1,000 calls. The [pricing page](https://docs.perplexity.ai/docs/getting-started/pricing) lists gpt-6-luna at $0.10 per million input tokens and $0.50 per million output tokens. Doubled, that's $0.20 and $1.00.

A 30-prompt panel run three times is 90 calls a week. Token counts vary by prompt, so the table shows two cases. The light case uses the 1,000 input and 500 output tokens that Perplexity's own cost calculator treats as a typical `fast` run. The heavy case is a round upper bound we chose.

| Line item | Rate | Light call | Heavy call |
| --- | --- | --- | --- |
| Input tokens | $0.20 per million | 1,000 = $0.0002 | 10,000 = $0.0020 |
| Output tokens | $1.00 per million | 500 = $0.0005 | 1,000 = $0.0010 |
| Web search (Fast Search) | $0.001 per call | $0.0010 | $0.0010 |
| **Per call** | | **$0.0017** | **$0.0040** |
| Per week (90 calls) | | $0.153 | $0.36 |
| Per month (× 52 ÷ 12) | | $0.66 | $1.56 |

For comparison, the same light call at legacy Sonar's listed rates costs $0.0065: $1 per million tokens each way, plus a $5 per 1,000 request fee. That's about $2.54 a month for the same panel. Either way the API bill is small. The real cost is the hour a week someone spends reading the ledger.

Ninety answers a week is also a small sample. At a citation rate near 10%, the margin of error is at least ±6 points. Pool four weeks into 360 answers and it falls to about ±3 points. Our [GEO measurement guide](/blog/how-to-measure-geo) explains the math and a control test for proving your changes worked.

### Where the API and perplexity.ai part ways

Perplexity's FAQ says the API "uses the same search system as the UI with differences in configuration," and that "the underlying AI model might differ." Three practical effects follow:

- **One search call per answer.** The `fast` preset makes at most one search call and collects up to 10 results. An answer a user sees in the app may be built differently.
- **No personal context.** Your script has no login, history or location unless you add one. The `web_search` tool accepts a `user_location` with a country code if your market is local.
- **Filters on by default.** The FAQ says SafeSearch is on for the API.

So treat the Source Ledger as a trend line and a source list, next to your other Perplexity SEO tools. For your 5 to 10 most valuable prompts, also check the app by hand now and then. If a question only needs raw ranked results with no answer, Perplexity's [Search API](https://docs.perplexity.ai/docs/search/quickstart) returns them for $5 per 1,000 requests, or $1 with Fast Search.

## Job 4: Earn the Sources Perplexity Cites

Most Perplexity SEO tools stop at measurement. Tracking and access checks tell you where you stand, but they don't move you. For that you need to be on the pages Perplexity reads, or be one of them.

### Turn the ledger into a target list

Sort one week of `cited_domains` by how many answers each domain appears in. Here is an illustrative week for Plannora, a made-up project management tool, across its 90 answers:

| Cited domain (made-up example) | Answers citing it, of 90 | What it is | The move |
| --- | --- | --- | --- |
| stackreview.co | 41 | Review site | Send current pricing and screenshots, and ask for an updated review |
| reddit.com | 33 | Community threads | Answer the threads the ledger names, as yourself, where rules allow |
| loopcraft.ai | 27 | Competitor's comparison pages | Publish your own honest comparison that covers the same sub-queries |
| youtube.com | 12 | Video walkthroughs | Post a short demo that answers the top prompt |
| plannora.io | 9 | Your own pages | Refresh the pages that already win and extend them |

Answers cite several sources, so the counts don't sum to 90. Plannora's own citation rate is 9 in 90, or 10%. That's the baseline its next month is judged against.

Two studies shape how you read a list like this. [Profound's analysis](https://www.tryprofound.com/blog/ai-platform-citation-patterns) of 680 million citations, from August 2024 to June 2025, found that Reddit held 46.7% of the citations going to Perplexity's top 10 domains, but only 6.6% of all its citations. Most sources come from a long tail of ordinary sites. And the Ahrefs overlap above says classic rankings still carry weight here. Your ledger shows which of those forces rules your own prompts.

### Tools for earning sources

- **Your own pages.** Answer-first sections, dated facts and real tables help Perplexity's passage-level ranking pick you. Our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search) covers the writing.
- **Community.** Reddit and forums matter when the ledger says they do. See [Reddit SEO](/glossary/reddit-seo) for the rules of engagement.
- **Press and reviews.** Digital PR and review-site outreach target the third-party domains in your list.
- **Branded prompts.** If the problem is what Perplexity says about your brand, the fix works differently. Our guide to [brand presence in Perplexity](/blog/brand-presence-in-perplexity) traces wrong answers to their sources.

## Job 5: Perplexity's Own Programs for Publishers and Stores

Perplexity publishes no citation report for site owners as of September 2026, which is why third-party Perplexity SEO tools exist. It does run programs that pay or feature some sites.

- **Comet Plus, for publishers.** Announced in August 2025 at $5 a month, and included in Pro and Max, it pays partners on three kinds of use: human visits, search citations and agent actions, [per Search Engine Journal](https://www.searchenginejournal.com/perplexity-launches-comet-plus-shares-revenue-with-publishers/554596/). [Digiday reported](https://digiday.com/media/how-perplexity-new-revenue-model-works-according-to-its-head-of-publisher-partnerships/) an initial $42.5 million pool with 80% going to publishers. Publishers apply by emailing publishers@perplexity.ai. Check current terms with Perplexity before you plan around them.
- **The Merchant Program, for stores.** It [launched in November 2024](https://techcrunch.com/2024/11/18/perplexity-introduces-a-shopping-feature-for-pro-users) with Perplexity's shopping feature. Merchants who share product details give Perplexity more complete data to recommend from, and at launch they got free API access for search on their own sites.
- **Instant Buy with PayPal.** Since [25 November 2025](https://newsroom.paypal-corp.com/2025-11-PayPal-and-Perplexity-Launch-Instant-Buy), US users can buy inside Perplexity, and PayPal's Store Sync makes merchant catalogs discoverable there.

Like the other Perplexity SEO tools here, none of these buys a place in an answer. They add revenue or product data on top of the organic work.

## Which Perplexity SEO Tools Fit Your Team

This decision table matches Perplexity SEO tools to teams. Find the row that looks like you, start with the first column, and add the second only when the first stops being enough. Prices are as listed on 28 September 2026.

| Your team | Start with | Add when | Why |
| --- | --- | --- | --- |
| Solo founder, no budget | Log analyzer, plus 10 to 15 prompts from the [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) checked by hand | Manual checks take over an hour a week | Access and a baseline cost nothing |
| Small marketing team | Otterly.AI Lite ($29) or AthenaHQ Essential (free) | You need more than 15 prompts or raw exports | Perplexity on the entry plan |
| Team with a developer | The Source Ledger (under $2 a month in API fees) | You need a check of what the app shows | Every source URL and query, in your own file |
| Already on Semrush or Ahrefs | The suite's AI tool ($99, or packages from $50) | You want raw source lists | One login, one bill |
| Content team on Surfer | AI Search Analytics ($95) | You track more than 50 prompts | Tracking next to the editor |
| Agency | SE Ranking's AI Search add-on ($89 on a base plan) or Peec AI | A client needs custom engines | Multi-client reporting |
| Enterprise brand | Profound or AthenaHQ Starter ($295) | Rarely | Contracts, security review, support |
| Publisher or store | Log checks, then Comet Plus or the Merchant Program | Perplexity sends real traffic | Revenue and product data from Perplexity itself |

Whichever Perplexity SEO tools you pick, keep the Source Ledger idea: log sources, not only mentions. The source list tells you what to do next.

## Where Rankbox Fits in a Perplexity Stack

Rankbox isn't one of the Perplexity SEO tools for tracking, and it doesn't track AI citations today. It belongs in Job 4. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google, with model-estimated volume, difficulty and intent. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word articles with their sources cited, and every draft gets an [SEO and GEO score](/features/seo-geo-score). Articles reach your site through Rankbox's API, which a developer wires in once. Reddit Presence, which finds threads and drafts replies for you to post, is rolling out.

The Business plan is $49.50 a month for one site and 30 articles, with a 7-day trial of up to 7 articles (a card is required). Pair it with any tracker above, or with the Source Ledger, and aim each article at a prompt where your ledger says you're absent. [See plans and pricing](/pricing).

## Frequently Asked Questions

### What are the best Perplexity SEO tools?

The best Perplexity SEO tools depend on the job. For access, use your server logs and Perplexity's published IP lists. For tracking, Otterly.AI Lite includes Perplexity for $29 a month and AthenaHQ has a free tier, as listed on 28 September 2026. Teams with a developer can log every cited source through Perplexity's Agent API for under $2 a month in API fees.

### Are there free Perplexity SEO tools?

Yes. Free Perplexity SEO tools cover access and a first look at tracking. AthenaHQ's Essential tier is free with 300 credits across five engines, including Perplexity. Server logs, Perplexity's IP lists and our AI crawler log analyzer cover access checks. Checking 10 to 15 prompts by hand, with the sources written down, costs only time.

### How do I track Perplexity citations with the API?

Send each prompt to `POST https://api.perplexity.ai/v1/agent` with `"preset": "fast"` and your key in an `Authorization: Bearer` header. Read the `search_results` item in `output`: each result has an `id` and `url`, and each `[n]` marker in the answer points to a result `id`. Log whether your domain appears and whether it's cited.

### Is the Perplexity Sonar API still available?

Perplexity's docs say Sonar Chat Completions "will be supported until September 27, 2026," and recommend the Agent API for all new projects. Its migration guide maps the `sonar` and `sonar-pro` models to the `fast` preset. If a tracking script still calls `/v1/sonar`, move it to `/v1/agent` now.

### Why do Perplexity API results differ from perplexity.ai?

Perplexity's FAQ says the API uses the same search system as the app but with a different configuration, and the underlying model may differ. The API's `fast` preset makes at most one search call and collects up to 10 results, with no login or history. Use API data for trends and source lists, and spot-check key prompts in the app.

### Does blocking PerplexityBot stop Perplexity from using my pages?

Not fully. Blocking PerplexityBot in robots.txt keeps it from crawling for Perplexity's index, but Perplexity says Perplexity-User, which fetches pages live for users, "generally ignores robots.txt rules." A full block needs a firewall rule on both user agents and IP lists. Most sites that want citations should allow both.

## References

1. [Migrate from Sonar to the Agent API, Perplexity Docs](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview)
2. [How to migrate from Sonar, Perplexity Docs](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/how-to)
3. [Create Agent Response (API reference), Perplexity Docs](https://docs.perplexity.ai/api-reference/agent-post)
4. [Create Chat Completion, Sonar (API reference), Perplexity Docs](https://docs.perplexity.ai/api-reference/sonar-post)
5. [Web Search tool, Perplexity Docs](https://docs.perplexity.ai/docs/agent-api/tools/web-search)
6. [Presets, Perplexity Docs](https://docs.perplexity.ai/docs/agent-api/presets)
7. [Pricing, Perplexity Docs](https://docs.perplexity.ai/docs/getting-started/pricing)
8. [Changelog, Perplexity Docs](https://docs.perplexity.ai/docs/resources/changelog)
9. [Frequently Asked Questions, Perplexity Docs](https://docs.perplexity.ai/docs/resources/faq)
10. [Perplexity Crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
11. [Pricing, Otterly.AI](https://otterly.ai/pricing)
12. [AI Visibility Toolkit pricing, Semrush](https://www.semrush.com/pricing/ai/)
13. [Brand Radar, Ahrefs](https://ahrefs.com/brand-radar)
14. [Plans and pricing, SE Ranking](https://seranking.com/subscription.html)
15. [Pricing, Surfer](https://surferseo.com/pricing/)
16. [AI instructions, Peec AI](https://peec.ai/ai-instructions)
17. [Plans and pricing, AthenaHQ](https://athenahq.ai/plans)
18. [Official information about Profound, Profound](https://www.tryprofound.com/ai-instructions)
19. [AI search overlap with Google and Bing, Ahrefs](https://ahrefs.com/blog/ai-search-overlap/)
20. [AI platform citation patterns, Profound](https://www.tryprofound.com/blog/ai-platform-citation-patterns)
