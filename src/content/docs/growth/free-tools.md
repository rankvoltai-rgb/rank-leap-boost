---
title: Free SEO and AI search tools
nav_title: Free tools
description: Every free Rankbox tool at /tools, what each one does, which ones use AI, the per-IP limit on AI runs, and how they relate to the paid product.
order: 4
updated: 2026-10-02
---

Rankbox has 23 free tools at [/tools](/tools) for making a site readable by AI engines, writing pages that get quoted, and checking whether AI recommends you. They need no account and no sign-up: open a tool and use it.

Use them for one-off jobs, such as writing an llms.txt file or checking a draft before you publish. The paid product does the same kind of work continuously for your site, as described at the end of this page.

## Three kinds of free tool

Every tool page carries a label that says how it runs.

| Label | How it runs | What leaves your browser |
| --- | --- | --- |
| **Instant** | Runs in your browser | Nothing. The crawler log analyzer, for example, never uploads your logs |
| **AI-powered** | Generated fresh by an AI model on each run | The text you enter, sent to Rankbox's server and its AI model provider |
| **Live check** | Fetches the URL you enter from Rankbox's server | The URL. Rankbox fetches the page, its robots.txt and its llms.txt |

AI-powered output is written by a model on each run, so two runs give different results and the output can contain mistakes. Check names, numbers and claims before you publish anything a tool wrote.

## Limits on the free tools

The six AI-powered tools share one limit: 6 runs a minute from the same IP address by default, across all AI tools together. Over the limit, a tool says **You've run a lot of these in the last minute. Wait a moment and try again.** The window resets each minute.

The **Live check** tool, AI Search Readiness Check, is limited per network on a much larger allowance and says **Too many checks from your network right now. Please wait a minute.** when it's exceeded. It only fetches public pages; private addresses and unsafe URLs are refused.

Instant tools have no limit because they never call Rankbox's server.

## All free tools by category

The [tools hub](/tools) groups the 23 tools into five categories. Every tool lives at `/tools/<slug>`.

### AI crawlers

Control which AI bots read your site, and check they can.

| Tool | Kind | What it does |
| --- | --- | --- |
| [llms.txt Generator](/tools/llms-txt-generator) | Instant | Builds a valid llms.txt: your site in one line and your key pages grouped by section |
| [AI Crawler robots.txt Generator](/tools/ai-robots-txt-generator) | Instant | Writes a robots.txt that lets search bots in and decides on training bots, preset or bot by bot |
| [robots.txt Tester](/tools/robots-txt-tester) | Instant | Tells you whether a URL is blocked for a given bot, and which line decided it |
| [AI Crawler Log Analyzer](/tools/ai-crawler-log-analyzer) | Instant | Reads pasted access-log lines and shows which AI bots visited and the pages they fetched |
| [AI Search Readiness Check](/tools/ai-search-readiness-check) | Live check | Scans a URL for the 12 basics AI engines need to cite it and returns a score with a fix list |

### Schema and tags

Structured data and the meta tags engines read first.

| Tool | Kind | What it does |
| --- | --- | --- |
| [Schema Markup Generator](/tools/schema-generator) | Instant | JSON-LD for 10 schema types, with field-level guidance |
| [Open Graph & Social Tags Generator](/tools/open-graph-generator) | Instant | Open Graph and Twitter Card tags, with a preview for X, LinkedIn and Slack |
| [Hreflang Tag Generator](/tools/hreflang-generator) | Instant | The full reciprocal set of hreflang tags, including x-default |
| [XML Sitemap Generator](/tools/sitemap-generator) | Instant | Turns a list of URLs into a valid sitemap.xml |

### Content and on-page

Write, check and tighten pages so they rank and get quoted.

| Tool | Kind | What it does |
| --- | --- | --- |
| [SERP Snippet Preview](/tools/serp-snippet-preview) | Instant | Pixel-measured desktop and mobile previews of your title and description, with the cut-off marked |
| [AI Citation Readiness Checker](/tools/ai-citation-readiness-checker) | Instant | Scores a draft on how easily an AI engine can lift an answer from it, with a fix for each check |
| [Keyword Density Checker](/tools/keyword-density-checker) | Instant | Word count, keyword density and the phrases you use most |
| [Heading Structure Checker](/tools/heading-structure-checker) | Instant | Outlines your H1 to H6 and flags skipped levels and duplicate H1s |
| [URL Slug Generator](/tools/url-slug-generator) | Instant | Turns a title into a short, clean, keyword-first slug |
| [Meta Description Writer](/tools/meta-description-writer) | AI-powered | Three meta descriptions for a page, measured for length |
| [Content Brief Generator](/tools/content-brief-generator) | AI-powered | A keyword in; a title, outline, questions and entities out |
| [AI Question Generator](/tools/ai-question-generator) | AI-powered | The questions people ask AI about a topic, grouped by intent |
| [AI FAQ Generator](/tools/ai-faq-generator) | AI-powered | A ready FAQ section with answers and FAQPage schema |
| [Blog Title Generator](/tools/blog-title-generator) | AI-powered | Ten titles across five angles, checked against Google's title width |

### URLs and links

Redirects, tracking links and clean URLs.

| Tool | Kind | What it does |
| --- | --- | --- |
| [301 Redirect Generator](/tools/redirect-generator) | Instant | Turns old-to-new URL lists into rules for Apache, Nginx, Vercel, Netlify, Cloudflare or Next.js |
| [UTM Link Builder](/tools/utm-link-builder) | Instant | Consistent campaign URLs with presets and a bulk mode |

### AI visibility

Find out whether AI recommends you, and fix it if not.

| Tool | Kind | What it does |
| --- | --- | --- |
| [Get Recommended by ChatGPT](/tools/get-recommended-by-chatgpt) | AI-powered | A personal plan, with headlines, an About text and a checklist, so AI engines know who you are |
| [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) | Instant | 30 buyer prompts to test whether ChatGPT, Perplexity and Gemini recommend your brand, with a scorecard |

## Guided toolkits

The tools hub also offers three toolkits: a job, and the tools that do it, in order.

### Make your site readable by AI

The one-time setup that decides whether anything you publish can be cited.

1. [AI Search Readiness Check](/tools/ai-search-readiness-check): see what's missing today.
2. [AI Crawler robots.txt Generator](/tools/ai-robots-txt-generator): let the search bots in.
3. [llms.txt Generator](/tools/llms-txt-generator): hand engines a map.
4. [Schema Markup Generator](/tools/schema-generator): remove the guesswork.

### Ship a page that gets quoted

From keyword to a draft that AI engines can lift an answer from.

1. [AI Question Generator](/tools/ai-question-generator): find the questions.
2. [Content Brief Generator](/tools/content-brief-generator): plan the outline.
3. [AI Citation Readiness Checker](/tools/ai-citation-readiness-checker): score the draft.
4. [SERP Snippet Preview](/tools/serp-snippet-preview): nail the snippet.

### Find out if AI recommends you

Test it by hand, then read the logs to see which bots already visit.

1. [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator): test 30 buyer prompts.
2. [AI Crawler Log Analyzer](/tools/ai-crawler-log-analyzer): see who's reading you.
3. [Get Recommended by ChatGPT](/tools/get-recommended-by-chatgpt): fix your personal footprint.

## How the free tools relate to Rankbox

The free tools do single jobs by hand. Rankbox, the paid product, runs the whole pipeline for your site: it researches the questions your buyers ask, writes source-backed articles, scores them, and publishes them on a schedule. See [How Rankbox works](/docs/get-started/how-it-works).

- **Research.** The AI Question Generator and Content Brief Generator do by hand what Rankbox's research and writing do for every article. See [Research](/docs/content/research).
- **Scoring.** The AI Citation Readiness Checker and Heading Structure Checker check drafts one at a time; Rankbox scores every article it writes. See [The SEO and GEO score](/docs/content/scoring).
- **Inside your AI tools.** The [Rankbox MCP server](/docs/ai-tools/mcp-server) gives Claude, ChatGPT, Cursor and other AI tools three similar research tools: AI search questions, content briefs and meta descriptions.
- **Measuring AI visibility.** Rankbox doesn't track AI citations, so the AI Visibility Prompt Kit is the way to check by hand. See [How to measure GEO](/blog/how-to-measure-geo) for a method.

Nothing you type into a free tool is added to a Rankbox account, and the tools work the same whether or not you have one.

## Related

- [The Rankbox MCP server](/docs/ai-tools/mcp-server) — the research tools inside your AI assistant
- [Rank: market coverage and AI readiness](/docs/growth/rank) — what Rankbox shows for your own site
- [The SEO and GEO score](/docs/content/scoring) — how Rankbox scores articles
- [What is Rankbox?](/docs/get-started/introduction) — the paid product in one page
