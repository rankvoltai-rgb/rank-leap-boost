---
title: Claude SEO Tool Guide: What Claude Can Do for SEO in 2026
description: A Claude SEO tool guide for 2026: which Claude plan fits SEO work, prices as of September 2026, SEO data connectors, Claude Code scripts and real limits.
keyword: Claude SEO tool
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI SEO Tools, Playbooks
---

Claude can research, analyze and write for SEO, but it isn't an SEO database. It has no keyword volumes, rankings or backlink index of its own. So the real Claude SEO tool is a setup: a Claude plan, the files you give it, connectors that pull live SEO data, and Claude Code when a job needs scripts.

Get those four parts right and Claude covers a lot of daily SEO work: briefs, on-page reviews, schema drafts, Search Console analysis and bulk checks across a site. Get them wrong and you'll get confident answers with no data behind them.

This guide covers each part of a Claude SEO tool setup as of September 2026, with prices checked on Anthropic's own pages on 29 September. For audit prompts you can copy, read our [guide to using Claude for SEO audits and content analysis](/blog/claude-for-seo-audits). For a start-to-finish audit, see the [step-by-step walkthrough](/blog/how-to-use-claude-for-seo-audits).

## Key Takeaways

- A Claude SEO tool setup can start free: the Free plan includes web search, file uploads, code execution, up to five Projects and one custom connector.
- Pro adds Opus models, Claude Code and Research for $20 monthly, or $17 a month on an annual plan (listed 29 September 2026).
- For live keyword, ranking and backlink data, add a connector. Ahrefs and Semrush both run official MCP servers, each tied to one of their paid plans.
- Claude Code handles technical SEO scripts: status checks, JSON-LD extraction and crawl comparisons. It's included in every paid plan.
- The API suits bulk jobs. At listed prices, rewriting 500 meta descriptions with Claude Haiku 4.5 costs about $1.25 in tokens.
- Claude doesn't track rankings or AI citations and has a June 2026 knowledge cutoff on its newest models. Feed it current data.

## What Claude Does for SEO, Job by Job

Here's what a Claude SEO tool setup can do, split by whether Claude needs outside data for the job.

| SEO job                      | Claude with no outside data                       | With files or a connector                             |
| ---------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| Keyword research             | Brainstorms topics and groups keywords by intent  | Adds volumes and difficulty from Ahrefs or Semrush    |
| Content briefs               | Drafts outlines, questions and angles             | Grounds them in real SERP and competitor data         |
| On-page review               | Reads pasted HTML: titles, headings, meta, schema | Compares with ranking rivals you paste in             |
| Schema markup                | Drafts JSON-LD from visible page facts            | Still needs a validator to confirm it                 |
| Search Console analysis      | Nothing to analyze                                | Finds low-CTR pages and question queries in an export |
| Technical checks at scale    | Explains what to check                            | Runs scripts across a site in Claude Code             |
| Backlink research            | General tactics only                              | Referring domains and anchors via a data connector    |
| Rank or AI citation tracking | Not a Claude job                                  | Use a dedicated tracker                               |

The pattern is simple. Claude brings judgment, reading speed and writing. The numbers come from somewhere else. For AI visibility tracking, our roundup of [ChatGPT rank trackers](/blog/chatgpt-rank-tracker) covers the tools built for it.

## Claude SEO Tool Pricing by Plan

Anthropic's [pricing page](https://claude.com/pricing) lists five plans. Here's what each adds for SEO work, with prices as listed on 29 September 2026. Prices exclude tax.

| Plan       | Price                                                              | What matters for SEO                                                                          |
| ---------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Free       | $0                                                                 | Sonnet and Haiku, web search, uploads, code execution, up to 5 Projects, one custom connector |
| Pro        | $17/month billed annually ($200 up front), or $20 monthly          | Opus, Claude Code, Research, Projects without Free's cap of five                              |
| Max        | From $100/month                                                    | 5x or 20x Pro's usage per session, higher output limits                                       |
| Team       | $20/seat/month annually or $25 monthly; premium seats $100 or $125 | Shared Projects, admin controls, no model training by default                                 |
| Enterprise | $20/seat/month billed annually, plus usage at API rates            | Audit logs, SCIM, custom data retention                                                       |

Three details matter more than the price column.

- **Usage limits.** Every plan resets on a rolling five-hour window, and paid plans add weekly limits. Claude Code draws from the same pool as your chats.
- **Context window.** On paid plans, chats with Claude Fable 5.1, Opus 5.5 or Sonnet 5.5 get a [1M-token context window](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans), per Anthropic's help center. It counts 200K tokens as about 500 pages, so 1M is roughly 2,500 pages by that ratio. The pricing page lists "up to 1M, varies by model" on every plan, Free included.
- **Connectors.** [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) work on every plan, but Free users are limited to one.

### Which model to pick

Anthropic's [models overview](https://platform.claude.com/docs/en/about-claude/models/overview) lists four current models: Claude Fable 5.1, Claude Opus 5.5, Claude Sonnet 5.5 and Claude Haiku 4.5. It suggests starting with Opus 5.5 for most workloads and using Fable 5.1 for the most demanding reasoning. Haiku 4.5 is the fastest and cheapest, which suits short, repetitive jobs.

### The API for bulk jobs

The API is the Claude SEO tool option priced per token, and it's the better fit for work across hundreds of pages. Listed prices per million tokens, input then output, were: Haiku 4.5 $1 and $5, Sonnet 5.5 $2 and $10, Opus 5.5 $4 and $20. Batch processing saves 50%.

Here's the arithmetic for rewriting 500 meta descriptions. We assume about 1,500 input tokens (instructions plus the page summary) and 200 output tokens per page. Your token counts will differ.

| Model      | Input: 500 × 1,500 tokens | Output: 500 × 200 tokens | Total | With batch (50% off) |
| ---------- | ------------------------- | ------------------------ | ----- | -------------------- |
| Haiku 4.5  | 0.75M × $1 = $0.75        | 0.1M × $5 = $0.50        | $1.25 | About $0.63          |
| Sonnet 5.5 | 0.75M × $2 = $1.50        | 0.1M × $10 = $1.00       | $2.50 | $1.25                |
| Opus 5.5   | 0.75M × $4 = $3.00        | 0.1M × $20 = $2.00       | $5.00 | $2.50                |

Web search through the API costs extra: $10 per 1,000 searches, plus tokens.

## Connectors and MCP Servers for SEO Data

Connectors give your Claude SEO tool setup live numbers. Most use the Model Context Protocol (MCP), an open standard for linking AI apps to outside tools. Anthropic's [connector marketplace](https://claude.com/marketplace/connectors-plugins) lists several SEO platforms. Below are three whose own pages we checked on 29 September 2026. Our [MCP explainer](/blog/mcp-protocol-new-sitemap) covers how the protocol works.

| Connector    | What it adds                                   | What the vendor says you need                                                                                               |
| ------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Ahrefs       | Ahrefs API data inside Claude                  | A paid plan from Lite up; each call uses your monthly API units                                                             |
| Semrush      | Keyword, ranking, competitor and backlink data | Semrush One Starter or Pro+, or SEO Classic Pro or Guru, each with 50,000 MCP API units; a Trends API plan for traffic data |
| Supermetrics | Search Console and other marketing data        | A Supermetrics account; its page lists a free 14-day trial                                                                  |

**Ahrefs.** Its [MCP documentation](https://docs.ahrefs.com/en/mcp/docs/introduction) says the hosted server is for users "with a Lite plan or higher," and that each plan caps rows per request and monthly API units. Calls from Claude use units "the same way as direct API usage."

**Semrush.** Its [knowledge base](https://www.semrush.com/kb/1618-mcp) lists the plans above and says the connection is read-only. It also advises being specific ("Top 50 keywords in the US" rather than "all keywords globally") to save units. In Claude, you enable the Semrush app and tag it as @Semrush in a prompt.

**Supermetrics.** Its [Search Console page](https://supermetrics.com/connect/google-search-console-to-claude) describes connecting through the Supermetrics connector in Claude's directory, then asking about clicks, impressions, CTR and average position in plain language.

Search Console data can also reach Claude without a connector: export a CSV from the Performance report, or set up Google's bulk export to BigQuery for bigger sites.

### Connect only what you trust

Anthropic's [connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) warns that "malicious MCP servers may include hidden instructions" and advises reviewing each tool approval before clicking "Allow always." Connectors are also token-heavy. Anthropic's [context window article](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans) suggests watching how many you have active to save context.

### Rankbox's research connector

Rankbox offers a remote MCP server too, at `https://rankbox.xyz/mcp`. Added to Claude as a custom connector, it provides three research tools: AI search questions for any topic; SEO content briefs covering a title, H2 outline, questions and entities; and meta descriptions, returned as three options of 120–160 characters. It doesn't run audits, crawl pages, touch Search Console or publish content. See our [Claude integration page](/integrations/claude) for setup, or the [MCP server page](/integrations/mcp) for other AI tools.

## Claude Code for Technical SEO Scripts

Claude Code is the part of a Claude SEO tool setup that writes and runs code. Anthropic describes it as an [agentic coding tool](https://code.claude.com/docs/en/overview) that "reads your codebase, edits files, runs commands," available in the terminal, IDEs, a desktop app and the browser. The pricing page says it's included in all paid plans.

For SEO, that means jobs that suit a script better than a chat:

1. **Status checks.** Read every URL in your sitemap, request each one politely, and list any that don't return 200.
2. **JSON-LD extraction.** Pull every JSON-LD block from a list of URLs into one CSV of types and properties.
3. **Crawl comparisons.** Diff this month's crawl export with last month's and list new 404s, lost canonicals and changed titles.
4. **Redirect maps.** Match old URLs to new ones by slug and title, then write the redirect rules for review.

A prompt for the second job might read:

```text
Read urls.txt. For each URL, fetch the raw HTML with curl, not a summarizing fetch.
Extract every script tag with type application/ld+json.
Write jsonld.csv with columns: url, @type, property, value.
Wait one second between requests. Show me the script before you run it.
```

The curl line matters. According to Claude Code's docs, WebFetch turns each page into Markdown and hands it to a small model first, which makes it ["lossy by design"](https://code.claude.com/docs/en/tools-reference). The docs point to curl for the unprocessed page.

Claude Code also takes MCP servers. Its [MCP docs](https://code.claude.com/docs/en/mcp) show the pattern `claude mcp add --transport http <name> <url>`, and Semrush documents its own version of that command.

### Community SEO plugins

Some people searching for a Claude SEO tool mean a plugin. A widely starred example is [Claude SEO](https://github.com/AgriciDaniel/claude-seo), an open-source, MIT-licensed plugin for Claude Code with about 17,900 GitHub stars on 29 September 2026. Its README says it runs 26 sub-skills and 19 specialist agents across technical SEO, content, schema and AI search. It's a community project, not an Anthropic product. Anthropic's [plugin docs](https://code.claude.com/docs/en/discover-plugins) note that "a plugin can run hooks and MCP servers," so read what one does before you install it.

## Claude SEO Tool Limits to Plan Around

- **No SEO data of its own.** Without files or connectors, any volume or ranking Claude gives is a guess. Ask for sources, and reject numbers without one.
- **Knowledge cutoff.** Fable 5.1, Opus 5.5 and Sonnet 5.5 have a reliable knowledge cutoff of June 2026; Haiku 4.5's is February 2025, per the models overview. Paste current documentation when it matters.
- **JavaScript pages.** Anthropic's [web fetch docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool) say the tool "does not support websites dynamically rendered with JavaScript." Paste rendered HTML instead.
- **Answers vary.** The same prompt can return different findings. Run important checks twice and keep what repeats.
- **Usage caps.** Long audits, connectors and Claude Code all draw on one usage pool. Heavy weeks may need Max or the API.
- **Data rules.** Model training is opt-out on Free, Pro and Max, and off by default on Team and Enterprise, according to the pricing page.

## The Claude SEO Tool Stack Picker

Pick the row closest to how you work. Claude prices are as listed on 29 September 2026. Third-party plans are priced on the vendors' own pages and aren't included in the totals.

| You are                         | Claude plan                  | Add                                                  | Claude cost per month     |
| ------------------------------- | ---------------------------- | ---------------------------------------------------- | ------------------------- |
| A solo blogger                  | Free, or Pro monthly         | Search Console CSV exports                           | $0 or $20                 |
| A freelance SEO                 | Pro, billed annually         | An Ahrefs or Semrush connector on your existing plan | $17                       |
| An in-house SEO with a dev bent | Max                          | Claude Code, Supermetrics for Search Console         | From $100                 |
| An agency of five               | Team, standard seats, annual | One premium seat for the Claude Code user            | 4 × $20 + 1 × $100 = $180 |

The agency row shows why seat types matter. Five standard seats billed annually would be 5 × $20 = $100 a month. Swapping one for a premium seat, with five times the usage, adds $80.

Rankbox fits beside any of these rows as a writer, not an analytics layer. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts source-backed articles for your team to review and publish.

## Frequently Asked Questions

### Is there an official Claude SEO tool?

No. Anthropic doesn't sell an SEO product. Claude becomes an SEO tool through its features (Projects, uploads, web search, Claude Code) and through connectors from SEO vendors such as Ahrefs and Semrush. "Claude SEO" on GitHub is a community-made plugin, not an Anthropic release.

### Can Claude do keyword research?

Partly. Claude can brainstorm topics, group keywords by intent and draft clusters on any plan. It has no search volume or difficulty data of its own. For those numbers, connect Ahrefs or Semrush, or upload an export from your keyword tool, then ask Claude to analyze it.

### How much does a Claude SEO tool setup cost?

From $0. Free covers light work. Pro listed at $20 monthly, or $200 a year paid up front, on 29 September 2026, and adds Opus and Claude Code. Max starts at $100 a month. Data connectors need their own vendor plans on top.

### Can Claude connect to Google Search Console?

Yes, indirectly. You can upload a Performance report export as CSV, use a third-party connector such as Supermetrics that reads Search Console, or run Google's bulk export to BigQuery and bring the query results into Claude. Report exports from Search Console's interface stop at 1,000 rows.

### Can Claude Code audit a whole website?

It can write and run scripts that check a site: status codes, JSON-LD, titles and redirects. You review each script before it runs, and the work counts against your plan's usage limits. For a full crawl, a dedicated crawler's export is usually faster to get and easier to trust.

## References

1. [Plans and pricing, Claude](https://claude.com/pricing)
2. [Models overview, Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/models/overview)
3. [How large is the context window on paid Claude plans?, Claude Help Center](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans)
4. [Get started with custom connectors using remote MCP, Claude Help Center](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
5. [Connectors and plugins, Claude Marketplace](https://claude.com/marketplace/connectors-plugins)
6. [Claude Code overview, Claude Code Docs](https://code.claude.com/docs/en/overview)
7. [Tools reference, Claude Code Docs](https://code.claude.com/docs/en/tools-reference)
8. [Connect Claude Code to tools via MCP, Claude Code Docs](https://code.claude.com/docs/en/mcp)
9. [Discover and install plugins, Claude Code Docs](https://code.claude.com/docs/en/discover-plugins)
10. [Web fetch tool, Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool)
11. [What is Ahrefs MCP, Ahrefs for Developers](https://docs.ahrefs.com/en/mcp/docs/introduction)
12. [What is Semrush MCP?, Semrush Knowledge Base](https://www.semrush.com/kb/1618-mcp)
13. [Getting started with Semrush MCP, Semrush Knowledge Base](https://www.semrush.com/kb/1619-getting-started-with-mcp)
14. [Connect Google Search Console to Claude, Supermetrics](https://supermetrics.com/connect/google-search-console-to-claude)
15. [Claude SEO, GitHub](https://github.com/AgriciDaniel/claude-seo)
