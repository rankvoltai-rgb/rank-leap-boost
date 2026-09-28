---
title: The State of llms.txt Adoption
description: Rankbox crawled 21,353 sites on 28 September 2026. llms.txt adoption: 50.4% of developer tools, 15.7% of the Fortune 500, 5.2% of news sites.
keyword: llms.txt adoption
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Research
---

llms.txt adoption is far higher than most guides assume, and very uneven. On 28 September 2026, Rankbox checked 21,353 sites. Of the 16,784 that answered, 5,246 (31.3%) served an llms.txt file. Half of developer-tool companies have one (50.4%), and so do 46.5% of B2B SaaS companies. The Fortune 500 sits at 15.7%, and news and media sites trail every group at 5.2%.

An llms.txt file is a Markdown file at `/llms.txt` that gives AI agents a short summary of a site and a curated list of links to its most useful pages. Jeremy Howard proposed it in September 2024, and it's still a community proposal, not a formal standard: its [v2 revision](https://llmstxt.org/changes.html) came out in August 2026. For the format and setup steps, read our guide to [getting indexed by LLMs with an llms.txt file](/blog/how-to-get-indexed-by-llms-with-llms-txt).

Other counts exist, but each covers one list. [SE Ranking](https://seranking.com/blog/llms-txt/) found the file on 10.13% of about 300,000 domains in November 2025. [ProGEO.ai](https://www.globenewswire.com/news-release/2026/03/31/3265644/0/en/ProGEO-ai-research-finds-7-4-of-the-Fortune-500-have-implemented-llms-txt.html) put the Fortune 500 at 7.4% in March 2026. [Rankability](https://www.rankability.com/data/llms-txt-adoption/) confirmed the file on 830 of the Tranco top 10,000 domains on 18 September 2026. None of them, as far as Rankbox could find, audits the files' format or checks their links.

This report does. It splits llms.txt adoption by industry, checks the rarer `/llms-full.txt` file, tests all 5,246 files against the spec, names the tools that generated them, and sets out what is known about whether any of it changes AI answers. The results also blow past Rankbox's own pre-crawl guesses for llms.txt adoption.

New to the file? Start with [what an llms.txt file is](/blog/what-is-an-llms-txt-file), then read [the llms.txt standard, explained line by line](/blog/llms-txt-standard).

## Key Takeaways

- On 28 September 2026, llms.txt adoption stood at 31.3% of the 16,784 sites that answered Rankbox's crawler. Only 5.6% served llms-full.txt.
- Software companies lead llms.txt adoption: 50.4% of YC developer-tool companies and 46.5% of B2B SaaS companies, against pre-crawl guesses of about 12% and 4%.
- E-commerce reached 16.4% (the guess was under 1%) and the Fortune 500 reached 15.7%. News and media sites have the lowest llms.txt adoption at 5.2%, and none of the 446 served llms-full.txt.
- Most files get the basics right: 94.3% open with an H1 and 96.3% have H2 sections. The common faults are bare URLs instead of Markdown links (14.1%), no summary line (15.5%) and more than one H1 (5.6%).
- In a random sample of 1,000 files, 4.6% linked to at least one page that returned 404 or 410.
- Only 7.8% of files carry a generator's signature. Yoast SEO leads with 4.0% of all files. The other 92.2% were hand-written, built by a site's own code, or made by a tool that leaves no mark.
- No one has shown that llms.txt makes AI answers more accurate. Google says Search ignores the file, and server-log studies show AI search crawlers rarely fetch it.

## llms.txt Adoption by Industry: Prediction vs. Result

Before the crawl, Rankbox's working hypothesis was that llms.txt adoption would be niche: about 12% of developer-tool companies, about 4% of B2B SaaS companies and under 1% of online stores. Every one of those guesses was far too low.

| Group | Pre-crawl hypothesis | llms.txt adoption on 28 Sep 2026 | Sites with the file / sites that answered |
| --- | --- | --- | --- |
| Developer tools (YC) | ~12% | 50.4% | 315 / 625 |
| B2B SaaS | ~4% | 46.5% | 1,465 / 3,150 |
| E-commerce (top 500) | <1% | 16.4% | 75 / 458 |
| Fortune 500 (2026) | Not predicted | 15.7% | 74 / 472 |
| News & media (top 500) | Not predicted | 5.2% | 23 / 446 |

Developer tools came in at about four times the guess, B2B SaaS at more than eleven times, and e-commerce at more than sixteen times. The guesses were rough, so read the multiples loosely. The direction is not in doubt.

![Bar chart of the share of sites serving /llms.txt and /llms-full.txt by group: developer tools 50.4%, B2B SaaS 46.5%, other software and IT 42.9%, e-commerce 16.4%, Fortune 500 15.7%, Tranco ranks 1 to 1,000 15.3%, Tranco ranks 1,001 to 10,000 12.1%, news and media 5.2%](figure:study/llms-txt-adoption "Share of sites in each group serving /llms.txt and /llms-full.txt. Rankbox crawl, 28 September 2026.")

Here is every group in the crawl. "Sites answering" is the denominator for each percentage. It includes sites that blocked the crawler, which count as having no file.

| Group | Sites answering | Has llms.txt | Has llms-full.txt | HTML page at /llms.txt | Blocked the crawler |
| --- | --- | --- | --- | --- | --- |
| All sites (deduplicated) | 16,784 | 5,246 (31.3%) | 933 (5.6%) | 7.4% | 8.3% |
| Software & SaaS companies (all) | 9,989 | 4,446 (44.5%) | 842 (8.4%) | 6.6% | 3.9% |
| …developer tools (YC) | 625 | 315 (50.4%) | 58 (9.3%) | 6.6% | 2.1% |
| …B2B SaaS | 3,150 | 1,465 (46.5%) | 251 (8.0%) | 5.9% | 2.1% |
| …other software & IT (Wikidata) | 6,214 | 2,666 (42.9%) | 533 (8.6%) | 7.0% | 5.1% |
| Fortune 500 (2026) | 472 | 74 (15.7%) | 3 (0.6%) | 6.8% | 14.0% |
| Tranco top 10,000 | 6,473 | 808 (12.5%) | 97 (1.5%) | 8.5% | 13.9% |
| …ranks 1–1,000 | 694 | 106 (15.3%) | 13 (1.9%) | 9.8% | 15.0% |
| …ranks 1,001–10,000 | 5,779 | 702 (12.1%) | 84 (1.5%) | 8.4% | 13.8% |
| E-commerce (top 500) | 458 | 75 (16.4%) | 13 (2.8%) | 7.6% | 30.8% |
| News & media (top 500) | 446 | 23 (5.2%) | 0 (0.0%) | 2.9% | 9.9% |
| News, media & e-commerce (top 1,000) | 904 | 98 (10.8%) | 13 (1.4%) | 5.3% | 20.5% |

### Software companies lead llms.txt adoption

Across 9,989 software and SaaS company sites, 44.5% serve llms.txt. The rate stays within eight points across developer tools (50.4%), B2B SaaS (46.5%) and the wider pool of software and IT firms from Wikidata (42.9%). These groups also blocked the crawler least (2.1% to 5.1%), so their rates are close to the true figure.

The crawl can't say why software leads, since most files carry no generator mark. The spec itself offers one reason: it says llms.txt files are ["used most heavily for software documentation"](https://llmstxt.org/), where coding agents follow them. Docs platforms such as [Mintlify](https://www.mintlify.com/docs/ai/llmstxt) also generate the file automatically.

### E-commerce sits in the middle, and it's a floor

Online stores reached 16.4%. Among the top-ranked adopters are etsy.com, shein.com, target.com, trendyol.com, zalando.de, cvs.com, farfetch.com, newegg.com and groupon.com. But 30.8% of e-commerce sites blocked the crawler, the highest rate of any group. Those sites stay in the denominator as "no file", so the true share of stores with the file is likely higher than 16.4%.

### News and media have the lowest llms.txt adoption

Only 23 of 446 news and media sites (5.2%) serve llms.txt, and none serves llms-full.txt. The adopters include repubblica.it, hindustantimes.com, phys.org, chosun.com, coindesk.com, bankrate.com, patch.com and msnbc.com. Publishers are also the group most likely to block AI crawlers in robots.txt, as the companion [AI Bot Crawler Census](/blog/ai-bot-crawler-census) shows.

### The biggest sites: 15.3% of the Tranco top 1,000

Across the Tranco top 10,000, 12.5% of answering domains serve llms.txt: 15.3% of the top 1,000 and 12.1% of ranks 1,001 to 10,000. Read the Tranco numbers with care. The list ranks domains by traffic signals, so it includes infrastructure domains that aren't websites, such as gstatic.com and googleapis.com. Many answer 404 to any path, which pulls the rate down.

The highest-ranked domains with a file are cloudflare.com, github.com, fastly.net, digicert.com, wordpress.org, adobe.com, workers.dev, opera.com, sentry.io and samsung.com. Among the highest-ranked that answered 404: google.com, microsoft.com, youtube.com, apple.com, amazon.com, wikipedia.org, bing.com and x.com.

### How this compares with earlier llms.txt adoption counts

Rankability's September scan confirmed llms.txt on 830 of 10,000 Tranco domains, keeping every unreachable or blocked domain in the denominator of its 8.3% figure. This crawl counted 808 among the 6,473 domains that answered it. Two teams, two Tranco snapshots, a similar count.

Other studies measured different pools. [Ahrefs](https://ahrefs.com/blog/llmstxt-study/) found the file on 28% of 137,210 domains in its analytics product in June 2026, a sample it says skews "more technical and SEO-aware than the web at large," so it treats 28% as an upper bound. SE Ranking's 10.13% came from about 300,000 domains in late 2025. Each method gives a different number, so compare groups within one study, not rates across studies.

## The Fortune 500: 74 Companies Serve llms.txt

Fortune 500 llms.txt adoption is 15.7%: of the 472 company websites that answered, 74 serve the file. Only 3 (0.6%) serve llms-full.txt. Another 14.0% blocked the crawler, so this rate is a floor too.

The highest-ranked adopters are CVS Health (#6), Cencora (#10), Nvidia (#16), Ford Motor (#22), AT&T (#35), Dell Technologies (#41), American Express (#56), Archer Daniels Midland (#58), MetLife (#59), Prudential Financial (#78), Cisco Systems (#83), Intel (#88), Liberty Mutual Insurance Group (#95), GE Aerospace (#101), Thermo Fisher Scientific (#106), Qualcomm (#108), U.S. Bancorp (#110), Salesforce (#114), US Foods Holding (#121), Lennar (#135), PayPal Holdings (#139), Nucor (#142), Jabil (#151), AutoNation (#166), Booking Holdings (#169), 3M (#183), Adobe (#192), Group 1 Automotive (#204), Becton Dickinson (#211) and Cognizant Technology Solutions (#216). Forty-four more further down the list also serve one.

ProGEO.ai counted 37 of 500 companies (7.4%) in March 2026. The 74 counted here is double that, but the two studies used different methods and denominators. Read it as a sign that llms.txt adoption is growing, not as a precise rate.

### llms.txt adoption by Fortune 500 sector

| Sector | Sites answering | Has llms.txt | llms.txt adoption |
| --- | --- | --- | --- |
| Telecommunications | 5 | 2 | 40.0% |
| Apparel | 3 | 1 | 33.3% |
| Engineering & Construction | 15 | 5 | 33.3% |
| Technology | 49 | 15 | 30.6% |
| Health Care | 44 | 10 | 22.7% |
| Financials | 88 | 16 | 18.2% |
| Aerospace & Defense | 11 | 2 | 18.2% |
| Materials | 17 | 3 | 17.6% |
| Business Services | 18 | 3 | 16.7% |
| Chemicals | 12 | 2 | 16.7% |
| Retailing | 39 | 5 | 12.8% |
| Wholesalers | 16 | 2 | 12.5% |
| Motor Vehicles & Parts | 9 | 1 | 11.1% |
| Hotels, Restaurants & Leisure | 9 | 1 | 11.1% |
| Industrials | 19 | 2 | 10.5% |
| Food, Beverages & Tobacco | 23 | 2 | 8.7% |
| Transportation | 16 | 1 | 6.3% |
| Energy | 59 | 1 | 1.7% |
| Media | 8 | 0 | 0.0% |
| Food & Drug Stores | 4 | 0 | 0.0% |
| Household Products | 8 | 0 | 0.0% |

Most sectors are small, so a single company moves the rate a lot. Telecommunications tops the table on 2 of 5 sites. The larger sectors tell a steadier story: Technology at 30.6% of 49 sites, Health Care at 22.7% of 44 and Financials at 18.2% of 88, against Energy at 1.7% of 59.

## llms-full.txt: The Rare Companion File

Only 933 sites (5.6%) serve `/llms-full.txt`, the long version that joins a site's content into one Markdown file. Almost all of them pair it with llms.txt: 924 sites serve both, and just 9 serve llms-full.txt alone.

The split follows the same line as llms.txt adoption, only steeper. Software companies lead at 8.4% (developer tools 9.3%). The Tranco top 10,000 sits at 1.5%, e-commerce at 2.8% and the Fortune 500 at 0.6%. No news or media site in the sample serves one. The highest-ranked sites with the file are cloudflare.com, developers.cloudflare.com, workers.dev, sentry.io, shopify.com, base.org, pages.dev, forter.com, hostinger.com and name.com.

The low rate makes sense. llms-full.txt isn't in the text of the [llmstxt.org spec](https://llmstxt.org/). Mintlify says it [developed the format with Anthropic](https://www.mintlify.com/blog/the-value-of-llms-txt-hype-or-real) to feed whole documentation sites to models, and the file still fits docs far better than marketing sites.

## Common llms.txt Syntax and Formatting Errors

Rankbox parsed all 5,246 files. The median file is 6.9 KB with 26 Markdown links. The 90th percentile is 36.2 KB, and 221 files (4.2%) run past 100 KB. Almost all are served as `text/plain` (95.4%) or `text/markdown` (4.5%). One arrived as `application/json`.

The spec asks for little. An H1 with the site's name is the only required part, followed by an optional blockquote summary, optional notes and H2 sections holding lists of links. Here is how the files measure up:

| Check against the llmstxt.org format | Files | % of files |
| --- | --- | --- |
| First non-empty line is an H1 (`# Name`), as the spec requires | 4,948 | 94.3% |
| No H1 anywhere | 97 | 1.8% |
| More than one H1 | 293 | 5.6% |
| Has a blockquote summary (`> …`) | 4,432 | 84.5% |
| Has H2 sections | 5,053 | 96.3% |
| Has a Markdown link list (`- [name](url)`) | 4,301 | 82.0% |
| No Markdown links at all | 803 | 15.3% |
| …of which list bare URLs instead | 739 | 14.1% |
| Uses relative links (spec examples use absolute URLs) | 150 | 2.9% |
| Links to .md versions of pages | 587 | 11.2% |
| Has an `## Optional` section | 1,263 | 24.1% |
| Contains robots.txt directives (User-agent, Allow, Disallow) | 92 | 1.8% |
| Contains HTML tags | 40 | 0.8% |
| No headings and no links (plain text) | 48 | 0.9% |
| Uses only H3 or smaller headings, no H2 | 5 | 0.1% |
| Reached only through a redirect to a different path | 71 | 1.4% |

Most files are structurally sound. The errors cluster in a few places.

### Bare URLs instead of Markdown links

The most common break with the spec: 739 files (14.1%) list plain URLs rather than `[name](url)` links. The spec says each list item needs a Markdown link. Chrome's Lighthouse [llms.txt audit](https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/agentic/llms-txt.js) also fails any file without at least one Markdown link. A list of naked URLs also drops the link name and the note that tells an agent what each page holds.

### Missing, extra or misplaced H1s

The spec wants one H1, at the top. 97 files (1.8%) have none, and 293 (5.6%) have more than one. One cause of a misplaced H1 is a plugin default. Rank Math's plugin code writes its ["Generated by Rank Math SEO" credit line](https://plugins.svn.wordpress.org/seo-by-rank-math/trunk/includes/modules/llms/class-llms-txt.php) above the H1, unless the site turns it off with a filter Rank Math [added on 28 July 2026](https://rankmath.com/changelog/free/page/2/).

A missing summary is the other gap: 84.5% of files have a blockquote, so 15.5% skip the one line an agent reads before any link.

### robots.txt rules in the wrong file

92 files (1.8%) contain `User-agent`, `Allow` or `Disallow` lines. llms.txt grants and blocks nothing. The spec says robots.txt handles access, while llms.txt is read "on demand, when an agent needs information." Crawlers look for access rules in robots.txt, not here.

Seventeen of those files are the same 65-byte template: `User-agent: *`, `Allow: /`, `Disallow-Training: /`, `Sitemap: /sitemap.xml`. Unrelated domains serve it with no identifying server header, and its origin is unknown. `Disallow-Training` is not a directive in either robots.txt or llms.txt.

The reverse link is rare too. Of 13,359 robots.txt files the crawl could parse, 879 (6.6%) mention llms.txt. There is no standard directive for that, so those lines are comments or rules crawlers ignore.

### Broken and relative links

Rankbox took a random sample of 1,000 files with links and checked up to 3 random absolute links in each: 2,988 links in all, on 28 September 2026.

| Result | Links | % of links checked |
| --- | --- | --- |
| 2xx (working) | 2,857 | 95.6% |
| 404 or 410 (gone) | 75 | 2.5% |
| Other 4xx, mostly bot blocking | 39 | 1.3% |
| 5xx | 5 | about 0.2% |
| Network error | 12 | about 0.4% |

Most links work. Still, 46 of the 1,000 files (4.6%) had at least one dead link among those checked. Links to `.md` copies fared a little worse: 5 of 162 (3.1%) returned 404 or 410. Another 150 files (2.9%) use relative links such as `/pricing`, which only work if the reader knows the host. The spec's examples all use absolute URLs.

### Files that aren't files

Across all sites, 7.4% answered `/llms.txt` with an HTML page and a 200 status, usually the homepage or a styled 404 page. These soft 404s tell a client "here is your file" and hand it markup. They were counted as no file. A further 71 real files (1.4%) were only reachable through a redirect to a different path.

## Who Generates llms.txt Files?

Rankbox only credited a tool when the file carried that tool's explicit signature. Most don't.

| Signature in the file | Files | % of all files |
| --- | --- | --- |
| No signature | 4,839 | 92.2% |
| Yoast SEO ("Generated by Yoast SEO") | 208 | 4.0% |
| Rank Math ("Generated by Rank Math SEO") | 72 | 1.4% |
| All in One SEO ("Generated by All in One SEO") | 44 | 0.8% |
| Shopify agent template ("# Agent Instructions") | 43 | 0.8% |
| Wix ("This site is powered by Wix and supports the Model Context Protocol (MCP)") | 40 | 0.8% |

Each of the five signatures matches a feature its vendor documents. Here is what each vendor says, with the date the feature shipped:

| Vendor | Documented behaviour | On by default? | Shipped |
| --- | --- | --- | --- |
| Yoast SEO | Generates the file and [refreshes it weekly](https://developer.yoast.com/features/llms-txt/functional-specification/) once you turn it on; the signature string is in its [plugin code](https://plugins.svn.wordpress.org/wordpress-seo/trunk/src/llms-txt/application/markdown-builders/intro-builder.php) | No, [opt-in](https://yoast.com/yoast-seo-june-10-2025/) | [Yoast SEO 25.3, 10 June 2025](https://developer.yoast.com/changelog/yoast-seo/25.3/) |
| Rank Math | An "LLMS Txt" module you switch on; the file [stays empty until you configure it](https://rankmath.com/kb/llms-txt/) | No | [Version 1.0.250, 31 July 2025](https://rankmath.com/changelog/free/page/7/) |
| All in One SEO | Generates llms.txt, plus llms-full.txt in Pro | Yes, per its [docs (updated August 2026)](https://aioseo.com/docs/how-to-create-an-llms-txt-using-all-in-one-seo/) | [Version 4.8.4, 25 June 2025](https://aioseo.com/changelog/page/4/) |
| Wix | "Wix automatically generates and maintains your llms.txt file" for upgraded sites with a custom domain and indexing on | Yes, [with an opt-out](https://support.wix.com/en/article/understanding-your-sites-llmstxt-file) | [Some premium stores from 16 July 2025](https://www.wix.com/press-room/home/post/wix-launches-ai-visibility-overview-with-full-generative-engine-optimization-support-for-ai-powered); [later all sites](https://support.wix.com/en/article/seo-request-making-llmstxt-available-for-all-sites) |
| Shopify | Every store gets a managed [agents.md](https://shopify.dev/docs/storefronts/themes/architecture/templates/agents-md-liquid), mirrored at /llms.txt and /llms-full.txt, with store endpoints and a pointer to the Shop skill | Yes | Documented in the [28 May 2026 changelog](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd) |

Plugins and platforms explain only a slice of llms.txt adoption. Two cautions apply. First, signatures undercount tools. Docs platforms, site builders and custom scripts that leave no mark all land in "no signature". Second, a default-on feature only shows up here when sites on that platform are in these lists. Wix also needs a paid plan and a custom domain, and the lists lean toward companies and top domains rather than small shops.

## The llms.txt Hygiene Score

llms.txt adoption is only half the story. The other half is whether the file works. Most audits stop at "does the file exist?" The Hygiene Score goes one step further. It is eight pass-or-fail checks, each drawn from a fault this crawl found in real files. Give your file one point per check it passes.

| # | Check | How often it failed on 28 Sep 2026 | The fix |
| --- | --- | --- | --- |
| 1 | `/llms.txt` returns 200 with text, not an HTML page | 7.4% of sites served HTML | Serve a real file; make missing paths return 404 |
| 2 | The first line is a single H1 with your site's name | 5.7% of files don't open with an H1; 5.6% have more than one | One `# Name` at the top; move signatures below it |
| 3 | A one-line blockquote summary follows the H1 | 15.5% of files have none | Say what you are and who it's for in one sentence |
| 4 | Every link is a Markdown link with a name | 14.1% list bare URLs | Write `- [Pricing](https://…): what's on the page` |
| 5 | Links use full absolute URLs | 2.9% use relative links | Include `https://` and your host |
| 6 | Every link answers 200 | 4.6% of sampled files had a dead link | Recheck links after each site change |
| 7 | No robots.txt rules or HTML in the file | 1.8% hold robots rules; 0.8% hold HTML | Keep access rules in robots.txt |
| 8 | The file fits in a model's context | 4.2% are over 100 KB | Link out to pages instead of pasting them in |

Read the total like this:

- **8 of 8:** clean. Recheck after big site changes.
- **6 or 7:** usable, with gaps an agent will trip on. Fix them this week.
- **5 or fewer:** rebuild the file from scratch.

Checks 1 and 6 need a request, not a read. The serving checks in our [llms.txt guide](/blog/how-to-get-indexed-by-llms-with-llms-txt) cover both. The free [llms.txt generator](/tools/llms-txt-generator) builds a file that passes checks 2 to 5 and warns you about relative links. The [AI search readiness check](/tools/ai-search-readiness-check) confirms the file is live.

## Do llms.txt Sites Get Cited More Accurately?

This crawl did not measure it, and high llms.txt adoption proves nothing about answers on its own. Testing citation accuracy needs AI answers, not file fetches. Here is the best public evidence as of September 2026, and how Rankbox plans to test the question.

### What the AI vendors say

- **Google** says it plainly in its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (updated 10 July 2026): llms.txt files "will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them."
- **OpenAI** and **Perplexity** point readers of their [crawler](https://developers.openai.com/api/docs/bots) [docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) to their own llms.txt indexes. Neither page says their bots read anyone else's file.
- **Anthropic's** [crawler help article](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) (7 April 2026) covers robots.txt and doesn't mention llms.txt.
- **Chrome's Lighthouse** does check for the file. Its [agentic browsing audit](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt) flags server errors and treats a missing file as "not applicable." That is a browser audit, not a ranking signal.

### What server logs show

[Ahrefs](https://ahrefs.com/blog/llmstxt-study/) checked the logs behind 137,210 domains in May 2026. 97% of llms.txt files got zero requests. AI search bots such as OAI-SearchBot and PerplexityBot made 233 requests, 1.1% of the total. Claude-Code, Anthropic's coding agent, made more requests than any AI search bot. Ahrefs concluded that "agents fetch llms.txt when directed, not speculatively."

[EZY Research](https://www.ezy.ai/research/do-ai-bots-read-llms-txt), a vendor, put llms.txt on 83 sites for 12 weeks. OpenAI's crawlers fetched it 7 times while fetching robots.txt 3,990 times. PerplexityBot fetched it 0 times against 775 robots.txt fetches.

### What correlation studies show

SE Ranking tested whether having the file tracks with AI citations across about 300,000 domains. It found no link, and dropping the llms.txt variable made its model more accurate. That study measured how often a domain is cited, not whether answers are correct.

### How Rankbox plans to test it

A fair test compares answers, not files. Rankbox plans to run it along these lines:

1. **Pair sites.** Match each adopter with a non-adopter in the same group and a similar Tranco rank.
2. **Write fact prompts.** Ask 10 to 20 checkable questions per brand: prices, plans, founding year, headquarters, main features.
3. **Run the panel.** Ask ChatGPT, Perplexity, Claude and Gemini each prompt several times, in clean sessions.
4. **Score accuracy.** Mark each answer correct or wrong against the brand's own site, using the accuracy rate from our [GEO measurement guide](/blog/how-to-measure-geo).
5. **Check the logs.** Where a site shares logs, confirm whether any assistant fetched its llms.txt during the test.
6. **Compare.** A real effect shows as a gap in accuracy between matched pairs, larger than the run-to-run noise.

Until that test runs, treat the file as a guide for agents that choose to read it, not a way to fix what AI answers say about you.

## Methodology

### Sample

To measure llms.txt adoption, Rankbox built five site lists and crawled them once on 28 September 2026. A site in more than one list counts once in "All sites."

- **Fortune 500 (2026):** the 500 companies on Fortune's 2026 list, with each company's website taken from its Fortune profile page.
- **Software and SaaS companies:** two sources. From Y Combinator's public directory, read through the [yc-oss mirror](https://github.com/yc-oss/api) as it stood on 28 September 2026, every active or public company that YC files under B2B or Fintech, or tags SaaS, B2B or Developer Tools. From Wikidata, every organization with an official website that either works in a software-type industry (SaaS, software, software development, cloud computing, IT or computer security) or is classed as a software, SaaS, technology or internet company, a web application or an online service.
  - Developer tools: YC firms with the Developer Tools tag or in YC's Engineering, Product and Design subindustry.
  - B2B SaaS: the remaining YC B2B and Fintech firms, plus Wikidata entries classed as SaaS.
  - Other software & IT: every other Wikidata entry.
- **Tranco top 10,000:** the first 10,000 domains on [Tranco list 64X3X](https://tranco-list.eu/list/64X3X). Tranco built it on 27 September 2026 by blending five popularity sources: Chrome UX Report, Farsight, Majestic, Cloudflare Radar and Cisco Umbrella.
- **News and media, e-commerce:** two Wikidata lists, each cut to its 500 best-ranked domains on Tranco. The news list takes print and online newspapers, news sites and agencies, other news media, magazines, broadcasters and TV networks or stations. The store list takes online retailers and shops, plus firms Wikidata places in e-commerce, online retail or retail. Both dropped sites on subdomains, platforms (social networks, blog hosts, app stores, file hosts, academic publishers), government and education domains, and a hand-checked set of misfiled domains such as universities, sports leagues, holding-company sites and e-commerce software vendors.

Merged and deduplicated, the lists held 21,353 unique sites, and 16,784 of them answered. The others failed at DNS, TLS or the timeout, many of them firms that have closed but still appear in Wikidata or YC. They are left out of every percentage.

### How each site was fetched

The crawler identified itself as `RankboxResearchBot/1.0 (+https://rankbox.xyz/blog; one-time study of robots.txt and llms.txt files)`. It is on no allow list, so some firewalls challenged it. It tried HTTPS first and fell back to `https://www.` when the bare domain didn't connect, followed redirects, waited up to 15 seconds per request and sent one request at a time per site. It fetched three paths and nothing else: `/robots.txt`, `/llms.txt` and `/llms-full.txt`.

### What counted as a "yes"

- **Has llms.txt:** `/llms.txt` returned HTTP 200 with a non-empty body that isn't HTML (not served as `text/html` and not starting with `<`). A redirect to another URL serving such a file counts.
- **Soft 404:** HTTP 200 with an HTML page. Counted as no file.
- **Blocked:** HTTP 401, 403 or 429, or a bot-challenge page such as Cloudflare's `cf-mitigated: challenge`. The crawler couldn't see whether a file exists, so these count as no file.
- **Not a file:** catch-all 200 responses such as bodies under 20 characters without a heading ("OK", "1", an IP address), short "not found" messages, short JSON errors, or non-text content such as a tracking GIF. Counted as no file.
- The same rules applied to `/llms-full.txt`.
- **Parked domains:** 24 sites served an llms.txt saying the domain is for sale, such as GoDaddy's aftermarket template. They were removed from every count.

### File checks, link checks and signatures

Every file was parsed against the llmstxt.org format for the checks in the error table. For links, a random sample of 1,000 files with links had up to 3 random absolute links each checked (2,988 links) with the same user agent on the same day. A file was credited to a tool only when it carried that tool's explicit signature string.

### Limitations

- **Blocked sites lower the rates.** They stay in each denominator as "no file", so every llms.txt adoption rate here is a floor. The gap matters most for e-commerce (30.8% blocked) and the Fortune 500 (14.0%).
- **Tranco includes non-websites.** CDNs, API hosts and ad servers such as gstatic.com and googleapis.com rank high on traffic signals but often answer 404 to any path. That pulls the Tranco rate down.
- **The SaaS sample is not a traffic ranking.** No public ranking of the top 10,000 SaaS sites exists. The software group is every reachable YC and Wikidata company that fit the rules above, big and small.
- **One crawl, one place.** A single pass from one machine can't see files served only to some user agents or regions.
- **Root paths only.** The spec allows files in subpaths such as `/docs/llms.txt`. Those, and files on docs subdomains, weren't counted unless that host was itself in a list.
- **Some dead companies remain.** Wikidata and YC list firms that have closed. Unreachable sites are out, and parked domains with a for-sale llms.txt are out, but other parked pages without an llms.txt may still sit in the denominators.
- **Small sectors are noisy.** Several Fortune 500 sectors have fewer than 10 answering sites.
- **Citation accuracy was not measured**, as covered in the section above.

### How to cite this study

Rankbox, "The State of llms.txt Adoption", 28 September 2026, https://rankbox.xyz/blog/state-of-llms-txt-adoption

## What Rankbox Does and Doesn't Do With llms.txt

Rankbox's free tools touch the file itself. The [llms.txt generator](/tools/llms-txt-generator) writes a spec-shaped file from a form, and the readiness check confirms it's live. Rankbox doesn't create, host or manage llms.txt files for you.

The product works on the pages your llms.txt points to. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that answer the questions your buyers ask AI. Rankbox doesn't track AI citations today, so pair it with a prompt panel like the one described above. Plans are on the [pricing page](/pricing).

## Frequently Asked Questions

### What is an llms.txt file?

An llms.txt file is a Markdown file at `/llms.txt` that gives AI agents a short summary of a site and a list of links to its key pages. It opens with an H1, then a one-line summary and H2 sections of links with notes. It guides agents; it doesn't block or grant access.

### Is llms.txt an official standard?

No. llms.txt is a community proposal, first published by Jeremy Howard in September 2024 and revised to v2 in August 2026. No standards body has adopted it. Google says Search ignores it, though Chrome's Lighthouse audits for it.

### How many websites have an llms.txt file?

On 28 September 2026, 31.3% of 16,784 answering sites in Rankbox's crawl served an llms.txt file. llms.txt adoption depends heavily on the sample: 44.5% of software companies, 15.7% of the Fortune 500, 12.5% of the Tranco top 10,000 and 5.2% of news and media sites.

### Which industries lead llms.txt adoption?

Software companies lead llms.txt adoption: 50.4% of YC developer-tool companies, 46.5% of B2B SaaS companies and 42.9% of other software and IT firms. In the Fortune 500, Technology (30.6%) and Health Care (22.7%) lead the larger sectors, and Energy trails at 1.7%.

### Does ChatGPT read llms.txt files?

OpenAI hasn't said so. Its crawler docs point to OpenAI's own llms.txt but don't say its bots read other sites' files. In EZY Research's 12-week test on 83 sites, OpenAI's crawlers fetched llms.txt 7 times against 3,990 robots.txt fetches.

### What is the most common llms.txt mistake?

Listing bare URLs instead of Markdown links is the most common break with the spec: 14.1% of the 5,246 files in the crawl did it. A missing blockquote summary is even more common (15.5%), but the spec treats it as optional. More than one H1 (5.6%) comes next, and 7.4% of sites serve an HTML page at /llms.txt.

## References

1. [The /llms.txt file, v2, llmstxt.org](https://llmstxt.org/)
2. [Changes since v1, llmstxt.org](https://llmstxt.org/changes.html)
3. [Optimizing your website for generative AI features, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
4. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
5. [Perplexity crawlers, Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
6. [Does Anthropic crawl data from the web?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
7. [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read, Ahrefs](https://ahrefs.com/blog/llmstxt-study/)
8. [LLMs.txt: why brands rely on it and why it doesn't work, SE Ranking](https://seranking.com/blog/llms-txt/)
9. [We put llms.txt on 83 websites, EZY Research](https://www.ezy.ai/research/do-ai-bots-read-llms-txt)
10. [LLMS.txt adoption research report, Rankability](https://www.rankability.com/data/llms-txt-adoption/)
11. [ProGEO.ai research finds 7.4% of the Fortune 500 have implemented llms.txt, GlobeNewswire](https://www.globenewswire.com/news-release/2026/03/31/3265644/0/en/ProGEO-ai-research-finds-7-4-of-the-Fortune-500-have-implemented-llms-txt.html)
12. [Yoast SEO 25.3 changelog, Yoast](https://developer.yoast.com/changelog/yoast-seo/25.3/)
13. [Yoast SEO llms.txt functional specification, Yoast](https://developer.yoast.com/features/llms-txt/functional-specification/)
14. [Free plugin changelog, Rank Math](https://rankmath.com/changelog/free/)
15. [How to create an llms.txt using All in One SEO, AIOSEO](https://aioseo.com/docs/how-to-create-an-llms-txt-using-all-in-one-seo/)
16. [Understanding your site's llms.txt file, Wix Help Center](https://support.wix.com/en/article/understanding-your-sites-llmstxt-file)
17. [Customize /llms.txt, /llms-full.txt and /agents.md, Shopify](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd)
18. [agents.md.liquid, Shopify](https://shopify.dev/docs/storefronts/themes/architecture/templates/agents-md-liquid)
19. [llms.txt audit, Lighthouse, Chrome for Developers](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt)
20. [Tranco list 64X3X, Tranco](https://tranco-list.eu/list/64X3X)
