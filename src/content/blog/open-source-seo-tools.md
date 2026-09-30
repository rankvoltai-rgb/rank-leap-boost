---
title: Open Source SEO Tools: A 2026 List With What Each One Does
description: 20 open source SEO tools sorted by job, from crawlers and log analyzers to rank trackers and analytics, each with its licence and last release date.
keyword: open source SEO tools
date: 2026-11-10
updated: 2026-11-10
written: 2026-09-30
author: Rankbox Team
tags: AI SEO Tools, SEO
---

The open source SEO tools worth running in 2026 cover nine jobs: site crawling and audits, link checking, log analysis, rank tracking, keyword research, structured data, robots.txt control and site speed, plus analytics. Below are 20 projects sorted by job, each checked on its own GitHub page on 30 September 2026, with its licence as the project states it and its latest release or commit date.

Open source SEO tools let you read, run and change the code under each project's licence. That doesn't mean zero cost. Most tools here need a server, a Docker install or some Python, and a rank tracker still needs a paid data source or your own proxies to fetch search results.

Open-source projects matter for search in a second way too. A well-kept public repo is itself a discovery channel for developers and AI coding assistants, which our guide to [GitHub READMEs as AI SEO fuel](/blog/github-readme-ai-seo) explains.

## Key Takeaways

- These 20 open source SEO tools all had a public repo with a licence file and a release or commit in 2026 when checked on 30 September 2026.
- Licences differ in what they ask of you. MIT, BSD and Apache 2.0 are permissive; GPL and AGPL are copyleft, and AGPL covers modified versions that users reach over a network.
- For site audits, SEOnaut, LibreCrawl and SiteOne Crawler are self-hosted crawlers; advertools gives Python users a crawler, log parser and SERP tools in one package.
- GoAccess sorts AI crawlers into their own category in server logs, separate from search engine bots.
- The ai.robots.txt list blocks 180 user agents, including OAI-SearchBot, Claude-SearchBot and PerplexityBot, so copy it whole only if you also want to leave AI search.
- Matomo, Plausible Community Edition and Umami are the self-hosted analytics options, under GPL, AGPL and MIT licences.

## All 20 Open Source SEO Tools at a Glance

Each row was checked on the project's GitHub page on 30 September 2026. Where a project hasn't tagged a release recently, the table gives its latest commit too.

| Tool                     | Job                    | Licence           | Latest release or commit                | Best for                                         |
| ------------------------ | ---------------------- | ----------------- | --------------------------------------- | ------------------------------------------------ |
| SEOnaut                  | Site audit             | MIT               | Commit, 23 May 2026                     | Teams who want a web dashboard                   |
| LibreCrawl               | Crawling               | MIT               | Commit, 29 Sep 2026                     | Crawls with JavaScript rendering                 |
| SiteOne Crawler          | Crawl and audit        | MIT               | v2.6.1, 29 Jun 2026                     | One binary, CI quality gates                     |
| advertools               | Crawl, logs, SERPs     | MIT               | 0.18.0, 17 Jun 2026                     | SEOs who work in Python                          |
| lychee                   | Link checking          | MIT or Apache 2.0 | v0.24.2, 1 May 2026                     | Broken links in CI                               |
| GoAccess                 | Log analysis           | MIT               | v1.12, 16 Sep 2026                      | Reading server logs fast                         |
| SerpBear                 | Rank tracking          | MIT               | v3.1.0, 27 Mar 2026                     | Tracking Google positions                        |
| SEO Panel                | Multi-site SEO panel   | GPL v2            | 6.0.0, 26 Mar 2026                      | PHP hosts, many sites                            |
| KeyBERT                  | Keyword extraction     | MIT               | v0.9, 7 Feb 2025; commit 25 Aug 2026    | Keywords from your own pages                     |
| YAKE!                    | Keyword extraction     | AGPL v3 or later  | 0.7.3, 9 Feb 2026                       | Fast, training-free extraction                   |
| extruct                  | Structured data        | BSD 3-Clause      | v0.18.0, 8 Nov 2024; commit 27 Sep 2026 | Auditing schema at scale                         |
| schema-dts               | Structured data        | Apache 2.0        | v2.0.0, 23 Mar 2026                     | Typed JSON-LD in TypeScript                      |
| Google robots.txt parser | robots.txt testing     | Apache 2.0        | Stable tag, 20 Feb 2026                 | Matching Googlebot's parsing                     |
| ai.robots.txt            | AI crawler list        | MIT               | v1.52, 7 Sep 2026                       | Blocking AI bots on purpose                      |
| Lighthouse               | Page audits            | Apache 2.0        | v13.5.0, 18 Sep 2026                    | Single-page performance and best-practice checks |
| Unlighthouse             | Site-wide audits       | MIT               | v0.19.0, 29 Sep 2026                    | Lighthouse on every page                         |
| sitespeed.io             | Performance monitoring | MIT               | 42.7.0, 11 Sep 2026                     | Scheduled speed tracking                         |
| Matomo                   | Analytics              | GPL v3 or later   | 5.14.0, 21 Sep 2026                     | A full Google Analytics alternative              |
| Plausible CE             | Analytics              | AGPL v3 or later  | v3.2.1, 1 Jun 2026                      | Light, cookie-free stats                         |
| Umami                    | Analytics              | MIT               | v3.4.0, 17 Sep 2026                     | Simple self-hosted analytics                     |

### How this list was chosen

A project made this list of open source SEO tools if it met four rules on 30 September 2026:

1. **Public source with a licence file.** We read each project's LICENSE or COPYING file, not just the label on GitHub, and give the licence in the project's own words.
2. **Active in 2026.** A tagged release or a commit to the default branch this year. Dates come from each repo's release and commit feeds on GitHub.
3. **An SEO job.** The tool does one of the nine jobs above, not general web development.
4. **Verified on its own page.** Every description below comes from the project's README or docs.

Some well-known names fell out. The pytrends library for Google Trends data and Google's Schemarama validator are both archived, which on GitHub means read-only. A few "open source" SEO suites in other roundups had no public source repo we could match to their website. And free desktop tools with a closed codebase, however useful, are freeware rather than open source SEO tools.

## Crawling, Audits and Link Checks

Crawlers are the core of most open source SEO tools lists, because a crawl finds the broken links, redirect chains and absent tags that cost rankings.

### SEOnaut

[SEOnaut](https://github.com/StJudeWasHere/seonaut) (MIT, last commit 23 May 2026) calls itself an "open-source SEO auditing tool." It scans a site and sorts issues into critical, high and low, covering broken links, redirect problems, absent or duplicated meta tags and heading order. It's a Go web app with a MySQL database, and the project recommends Docker. There's also a hosted version at seonaut.org. **Best for:** a small team that wants a shared audit dashboard.

### LibreCrawl

[LibreCrawl](https://github.com/PhialsBasement/LibreCrawl) (MIT, last commit 29 September 2026) is "a web-based multi-tenant crawler for SEO analysis and website auditing," built on Python Flask. It renders JavaScript with Playwright, extracts titles, descriptions and headings, maps internal and external links, pulls PageSpeed Insights data and exports to CSV, Excel, JSON or XML. Its repo pitches it as an open source alternative to Screaming Frog. **Best for:** crawling JavaScript-heavy sites on your own machine.

### SiteOne Crawler

[SiteOne Crawler](https://github.com/janreges/siteone-crawler) (MIT, v2.6.1 on 29 June 2026) is a "website analyzer, cloner, and converter," now rewritten in Rust as a single binary for Windows, macOS and Linux. It writes an HTML audit report with a quality score from 0 to 10, generates sitemaps, and can convert a whole site to Markdown. A `--ci` flag fails a deploy when scores drop below your thresholds. **Best for:** developers who want audits inside their build pipeline.

### advertools

[advertools](https://github.com/eliasdabbas/advertools) (MIT, 0.18.0 on 17 June 2026) is a Python package with a Scrapy-based SEO crawler, robots.txt and XML sitemap downloaders, a Google and YouTube SERP importer and a [log file parser](https://advertools.readthedocs.io/en/master/advertools.logs.html) with reverse DNS lookup. Version 0.18.0 added [`serp_claude`](https://advertools.readthedocs.io/en/latest/advertools.serp_claude.html), which records the pages, ranks and cited domains that Claude's web search returns through Anthropic's API. You supply your own API key, and API results come from a different surface than the Claude apps. **Best for:** analysts who live in notebooks.

### lychee

[lychee](https://github.com/lycheeverse/lychee) (MIT or Apache 2.0, your choice; v0.24.2 on 1 May 2026, with nightly builds since) is a "fast, async, stream-based link checker written in Rust." It checks links in websites, Markdown and HTML files, and ships as a command-line tool, a library and a GitHub Action. **Best for:** catching broken links in docs before they go live.

## Logs, Rank Tracking and Keyword Research

These open source SEO tools answer three questions: who is crawling you, where you rank, and what your pages are about.

### GoAccess

[GoAccess](https://github.com/allinurl/goaccess) (MIT, v1.12 on 16 September 2026) is a "real-time web log analyzer" that runs in a terminal or as a live HTML dashboard. It reads Apache, Nginx, CloudFront and other log formats. Its README says it "keeps AI crawlers and Fediverse (ActivityPub) traffic in their own categories, separate from traditional search engine crawlers," which makes it a quick way to see GPTBot and ClaudeBot hits. **Best for:** anyone with server access who wants answers in minutes.

### SerpBear

[SerpBear](https://github.com/towfiqi/serpbear) (MIT, v3.1.0 on 27 March 2026) is an "Open Source Search Engine Position Tracking and Keyword Research App." It tracks keyword positions in Google for unlimited domains and keywords, emails you when they move, and connects to Search Console for real clicks and impressions. Positions come from a third-party scraping API or proxies you supply, so budget for that service. **Best for:** replacing a paid rank tracker for a handful of sites.

### SEO Panel

[SEO Panel](https://github.com/seopanel/Seo-Panel) (GPL v2, 6.0.0 on 26 March 2026) is a PHP and MySQL "seo control panel" for managing many websites. Its README lists a keyword position checker, site auditor, backlink checker and Moz rank checker. It also lists an automatic directory submission tool; Google's [link spam policy](https://developers.google.com/search/docs/essentials/spam-policies) covers "using automated programs or services to create links to your site," so leave that feature off. Change the default admin password on install, as the README says. **Best for:** agencies on shared PHP hosting.

### KeyBERT and YAKE!

[KeyBERT](https://github.com/MaartenGr/KeyBERT) (MIT, v0.9 on 7 February 2025, commits through 25 August 2026) uses BERT embeddings to find "keywords and keyphrases that are most similar to a document." [YAKE!](https://github.com/INESCTEC/yake) (AGPL v3 or later, with a commercial licence from INESC TEC; 0.7.3 on 9 February 2026) extracts keywords from text statistics, with no training data or dictionaries, in many languages. Both work on text you give them rather than search data, so they show what your own pages, or a rival's, are about. **Best for:** content audits and topic maps.

## Structured Data, robots.txt and Site Speed

The next group of open source SEO tools handles the technical layer: schema, crawler rules and page speed.

### extruct and schema-dts

[extruct](https://github.com/scrapinghub/extruct) (BSD 3-Clause, v0.18.0 on 8 November 2024, commits through 27 September 2026) pulls JSON-LD, Microdata, RDFa, Open Graph, Microformats and Dublin Core out of HTML, which makes it handy for auditing [schema markup](/glossary/schema-markup) across a crawl. [schema-dts](https://github.com/google/schema-dts) (Apache 2.0, v2.0.0 on 23 March 2026) gives TypeScript types for Schema.org JSON-LD, so errors show up in your editor. Its README notes it's "not an officially supported Google product." **Best for:** developers who generate schema in code.

### Google's robots.txt parser

Google's [robots.txt parser](https://github.com/google/robotstxt) (Apache 2.0, stable tag on 20 February 2026, last commit 1 April 2026) is "slightly modified … production code used by Googlebot." It includes a small binary to test one URL and user agent against a robots.txt file. **Best for:** settling arguments about how Google reads a tricky rule.

### ai.robots.txt

[ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) (MIT, v1.52 on 7 September 2026) is a community list of "AI-related crawlers of all types, regardless of purpose," shipped as robots.txt, `.htaccess`, Nginx, Caddy, HAProxy and lighttpd rules. Its robots.txt on 30 September 2026 had 180 user agents, including OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot and Applebot. OpenAI says sites that block OAI-SearchBot [won't be shown in ChatGPT search answers](https://developers.openai.com/api/docs/bots) except as navigational links, so edit the list to your goals. Our [AI crawler directory](/blog/ai-crawler-directory) explains which bot does what. **Best for:** sites that want to opt out of AI crawling deliberately.

### Lighthouse, Unlighthouse and sitespeed.io

[Lighthouse](https://github.com/GoogleChrome/lighthouse) (Apache 2.0, v13.5.0 on 18 September 2026) "analyzes web apps and web pages, collecting modern performance metrics" and best-practice checks, from Chrome DevTools, a CLI or a Node module. [Unlighthouse](https://github.com/harlan-zw/unlighthouse) (MIT, v0.19.0 on 29 September 2026) runs Lighthouse across "your entire site" with one `npx` command. [sitespeed.io](https://github.com/sitespeedio/sitespeed.io) (MIT, 42.7.0 on 11 September 2026) produces reports with [Core Web Vitals](/glossary/core-web-vitals), a load video and a waterfall, and can run on a schedule. **Best for:** Lighthouse for spot checks, Unlighthouse for full-site sweeps, sitespeed.io for trends.

## Analytics

Analytics closes the loop on the other open source SEO tools, because it shows whether your fixes brought visits.

### Matomo, Plausible CE and Umami

[Matomo](https://github.com/matomo-org/matomo) (GPL v3 or later, stable 5.14.0 on 21 September 2026) is a PHP and MySQL analytics platform that aims to be "a Free software alternative to Google Analytics." [Plausible Community Edition](https://github.com/plausible/analytics) (AGPL v3 or later, with its tracker script under MIT; v3.2.1 on 1 June 2026) is a "privacy-first," cookie-free analytics tool you can self-host. [Umami](https://github.com/umami-software/umami) (MIT, v3.4.0 on 17 September 2026) covers traffic, campaigns and conversions without cookies, on Node.js and PostgreSQL. **Best for:** Matomo if you need depth, Plausible or Umami if you want a single page of stats.

## The Open Source SEO Starter Stack

Picking open source SEO tools is easier by team than by feature. We call this the starter stack: the smallest set that covers crawling, speed, logs and analytics for each kind of team.

| Team                            | Crawl and audit          | Speed          | Logs and bots         | Analytics        | Setup effort             |
| ------------------------------- | ------------------------ | -------------- | --------------------- | ---------------- | ------------------------ |
| Solo developer with a docs site | lychee link checks in CI | Unlighthouse   | GoAccess              | Umami            | An afternoon             |
| Content team with one engineer  | SEOnaut in Docker        | Lighthouse     | GoAccess              | Plausible CE     | A day                    |
| Agency with many client sites   | SiteOne Crawler          | sitespeed.io   | GoAccess              | Matomo           | A week, then routine     |
| Data-minded SEO                 | advertools               | Lighthouse CLI | advertools log parser | Any of the three | Depends on Python skills |

Add SerpBear to any row if you track rankings, and pair every row with Google Search Console, which is free but not open source. For AI visibility trackers, which are almost all paid, see our [GEO tools list](/blog/geo-tools-list).

Rankbox isn't open source. It's a paid AI writer that researches the live web and drafts source-backed articles, on the Business plan at $49.50 a month with a 7-day trial ([pricing](/pricing)). Its [free tools](/tools/ai-crawler-log-analyzer), such as the AI crawler log analyzer and robots.txt tester, are free to use but not open source.

## Frequently Asked Questions

### What are the best open source SEO tools?

It depends on the job. For a full-site audit, SEOnaut, LibreCrawl or SiteOne Crawler; for server logs, GoAccess; for speed, Lighthouse and Unlighthouse; for analytics, Matomo, Plausible CE or Umami. Python users can cover crawling, logs and SERPs with advertools alone.

### Is there an open source alternative to Screaming Frog?

Several open source SEO tools fill that role. LibreCrawl describes itself as an open source alternative to Screaming Frog and renders JavaScript. SEOnaut and SiteOne Crawler also crawl sites and report SEO issues, and advertools offers a customizable crawler in Python. Check each licence against how you plan to use it.

### Are open source SEO tools free?

The code is free to use under its licence, but running it costs something. You'll need a server or a local install, and some tools rely on paid services: SerpBear, for example, fetches rankings through a scraping API or proxies you supply. Budget for hosting and your own time.

### Can I track rankings with open source software?

Yes. SerpBear tracks Google positions for unlimited keywords and domains, and SEO Panel includes a keyword position checker. Both need a data source for search results. Google Search Console, which is free, reports your average position from Google's own data.

### Is Google Lighthouse open source?

Yes. Lighthouse is published by the Google Chrome team on GitHub under the Apache 2.0 licence, and version 13.5.0 was released on 18 September 2026. You can run it in Chrome DevTools, from the command line or as a Node module.

### Are there open source tools for AI search?

A few cover parts of it. GoAccess separates AI crawlers in your logs, ai.robots.txt lists AI bots for blocking, and advertools records what Claude's web search returns through Anthropic's API. Full AI visibility trackers are mostly paid products.

## References

1. [SEOnaut, GitHub](https://github.com/StJudeWasHere/seonaut)
2. [LibreCrawl, GitHub](https://github.com/PhialsBasement/LibreCrawl)
3. [SiteOne Crawler, GitHub](https://github.com/janreges/siteone-crawler)
4. [advertools, GitHub](https://github.com/eliasdabbas/advertools)
5. [serp_claude documentation, advertools](https://advertools.readthedocs.io/en/latest/advertools.serp_claude.html)
6. [lychee, GitHub](https://github.com/lycheeverse/lychee)
7. [GoAccess, GitHub](https://github.com/allinurl/goaccess)
8. [SerpBear, GitHub](https://github.com/towfiqi/serpbear)
9. [SEO Panel, GitHub](https://github.com/seopanel/Seo-Panel)
10. [KeyBERT, GitHub](https://github.com/MaartenGr/KeyBERT)
11. [YAKE!, GitHub](https://github.com/INESCTEC/yake)
12. [extruct, GitHub](https://github.com/scrapinghub/extruct)
13. [schema-dts, GitHub](https://github.com/google/schema-dts)
14. [Google robots.txt parser, GitHub](https://github.com/google/robotstxt)
15. [ai.robots.txt, GitHub](https://github.com/ai-robots-txt/ai.robots.txt)
16. [Lighthouse, GitHub](https://github.com/GoogleChrome/lighthouse)
17. [Unlighthouse, GitHub](https://github.com/harlan-zw/unlighthouse)
18. [sitespeed.io, GitHub](https://github.com/sitespeedio/sitespeed.io)
19. [Matomo, GitHub](https://github.com/matomo-org/matomo)
20. [Plausible Analytics, GitHub](https://github.com/plausible/analytics)
