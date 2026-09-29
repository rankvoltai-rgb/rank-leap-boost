---
title: How to Use Claude for SEO Audits: A Step-by-Step Walkthrough
description: A step-by-step walkthrough of Claude for SEO audits: set up a Project, feed it crawl, Search Console and HTML files, run one audit and check each finding.
keyword: Claude for SEO audits
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI SEO Tools, Playbooks
---

To use Claude for SEO audits, set up a Claude Project that holds your audit rules, load it with three files (a crawl export, a Search Console export and the page's raw HTML), then run one page through a fixed order of prompts. Finish by opening the file behind every finding and confirming it before anything goes on the fix list.

This walkthrough follows one audit from an empty Project to a checked fix list. The six prompt templates themselves (entity gaps, schema against rivals, quotable lines, internal links, FAQ gaps and a raw HTML read) live in our [full guide to Claude for SEO audits and content analysis](/blog/claude-for-seo-audits). Here you'll see where each file goes, what order to run things in, and how to check the answers.

Why a Project? Anthropic's help center says [context is not shared across chats](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects) in a Project unless it's in the project knowledge. Put your rules and exports there once, and every audit chat starts with them.

## Key Takeaways

- Claude for SEO audits depends on the files you feed it. Export a crawl, Search Console data and raw page HTML before you start.
- Projects are on every plan, including Free (up to five). Store stable files in project knowledge and paste the page under audit into the chat.
- Search Console's own export stops at 1,000 rows per report. Filter to the pages and queries you need before you export.
- Write project instructions that force a source for every finding: a file name and row, or a quoted line of HTML.
- Check each finding against the file it cites. Act only on the ones that hold up, and log the rest.
- Save the audit as a dated file in the Project so next month's run can compare against it.

## Step 1: Export Three Files Before You Open Claude

Claude for SEO audits is only as good as the files you hand it. Claude doesn't crawl your site or log into Search Console by default, so the evidence has to come from you. Three exports cover most single-page and small-site audits.

| File                        | Where it comes from                          | What Claude uses it for                   | Limit to know                                       |
| --------------------------- | -------------------------------------------- | ----------------------------------------- | --------------------------------------------------- |
| Crawl export (CSV)          | A crawler such as Screaming Frog             | Triage, duplicate titles, link targets    | Screaming Frog's free version crawls up to 500 URLs |
| Search Console export (CSV) | Performance report, Pages and Queries tabs   | Which pages and questions have demand     | Report exports stop at 1,000 rows                   |
| Page source (HTML)          | View source, or rendered HTML from dev tools | Title, meta, canonical, headings, JSON-LD | Paste it; don't rely on a fetched link              |

### The crawl export

Any crawler works. [Screaming Frog's SEO Spider](https://www.screamingfrog.co.uk/seo-spider/) is a common choice. It exports titles, meta descriptions and headings to a spreadsheet, and its free version crawls up to 500 URLs. A licence to lift the limit was listed at €245 a year on 29 September 2026.

Keep only the columns you'll ask about: URL, status code, indexability, title, meta description, H1, word count, [canonical](/glossary/canonical-tag) and inlinks. Fewer columns mean less for Claude to misread.

### The Search Console export

In the Performance report, export the Pages tab and the Queries tab for the same date range. Google caps each report export at [1,000 rows](https://support.google.com/webmasters/answer/12919797) of representative data, and offers Google Sheets, Excel or CSV. For a small site that may be everything. For a large one, filter by folder first, or pull the data through the Search Console API or the [bulk export to BigQuery](https://support.google.com/webmasters/answer/12918484). Our glossary entry on [Google Search Console](/glossary/google-search-console) covers the reports.

### The page source

This is the file Claude for SEO audits leans on most. Open the page, press Ctrl+U (Cmd+Option+U on a Mac) and copy everything. If the page builds its content with JavaScript, open developer tools and copy the rendered page instead. Anthropic's docs say Claude's web fetch tool [does not support](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool) sites rendered with JavaScript, so a pasted source is the safer input.

### Name and size the files

Name files so Claude can cite them: `crawl-2026-09-29.csv` beats `export (3).csv`. Anthropic's advice for large Projects is to use [clear, descriptive filenames](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects). Strip personal data from any export first.

Size rarely bites. Per Anthropic's [upload limits](https://support.claude.com/en/articles/8241126-uploading-files-to-claude), project files can be up to 30MB each, and chat uploads up to 500MB each, 20 per chat. Excel files need code execution turned on. CSVs don't.

## Step 2: Set Up a Claude Project for Audits

A Project is where Claude for SEO audits becomes repeatable. It keeps instructions and files that any chat in it can read. Projects are [available on all plans](https://support.claude.com/en/articles/9517075-what-are-projects), and Free accounts can create up to five.

1. Go to `claude.ai/projects` and click **+ New Project**.
2. Name it after the site, such as "Tallyfold SEO audits". Anthropic notes that Claude won't have access to the name or description, so don't put rules there.
3. Click **Set project instructions** and paste the rules below.
4. Click **+** in the project knowledge panel and upload the crawl export and the Search Console exports.
5. Start a chat inside the Project for each page you audit.

Here are project instructions that fit the checks in Step 4. Edit the house rules to match yours.

```text
You audit pages on tallyfold.example for SEO.
Work only from files in project knowledge or pasted in this chat.
Give every finding a source: the file name and row number, or a quoted line of HTML.
If the files don't hold the answer, write "not in the files".
Never state rankings, search volumes or traffic that are not in the files.
Report findings in a table: finding, source, severity (high, medium or low), suggested fix.
House rules: one H1 per page. Titles under 60 characters. Every indexable page has a self-referencing canonical. No indexable page is left with fewer than three internal links pointing to it.
```

### What goes in knowledge and what goes in the chat

Put stable files in project knowledge: the crawl export, the Search Console exports, your house rules and last month's audit. Paste the page under audit into the chat, since it changes with every run.

On paid plans, a Project that outgrows the context window switches to retrieval. Anthropic says this expands capacity [by up to 10x](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects), with Claude searching project knowledge instead of reading all of it. When that happens, ask Claude to name the file it used for each finding, which your instructions already require.

One more note. Anthropic is rolling out a new version of Projects in beta, starting with Claude Code, and says existing Projects keep working as they do today. The steps above describe the current version, as of September 2026.

## Step 3: Run One Audit From Start to Finish

Here's one pass of Claude for SEO audits on a fictional site. Tallyfold is a made-up invoicing app for agencies, at `tallyfold.example`, and every number below is illustrative. Its crawl found 480 URLs, inside the free crawler limit.

1. **Triage the crawl.** Ask: "From the crawl file, list indexable pages with status 200 whose title or meta description is missing, duplicated or over the house limit. Give row numbers." Claude returned 23 rows, 17 of them duplicate titles on invoice template pages.
2. **Pick the page that matters most.** Ask: "Join the Pages export to the crawl by URL. List pages with over 5,000 impressions and a click-through rate under 2%." One stood out: the late-invoices guide, with 18,400 impressions, 1.1% CTR and an average position of 8.7. That's about 202 clicks (18,400 × 1.1%).
3. **Read the page source.** Paste the guide's HTML into a new chat and run the raw HTML read from the [prompt library](/blog/claude-for-seo-audits). Claude flagged two H1s, a [meta description](/glossary/meta-description) of 171 characters and a missing dateModified.
4. **Compare with the pages above it.** Paste the two ranking rivals and run the entity gap and schema comparison prompts from the same library.
5. **Check the questions.** Paste the Queries export for that URL and run the FAQ gap prompt.
6. **Merge the findings.** Ask: "Combine every finding in this chat into one table, sorted by severity. Keep each source." This is the draft fix list, not the final one.

The draft list had 14 findings. Step 4 decides which ones survive.

## Step 4: Check Every Finding Against Its Source

This step separates Claude for SEO audits from guessing. Anthropic's own [guidance on hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) says its techniques reduce made-up answers but "don't eliminate them entirely," and tells you to validate anything critical. Here's a simple way to do that, which we call the Source-Trace Check.

### The Source-Trace Check

Open the file and row, or search the HTML for the quoted line, that Claude gave as the source. Each finding then gets one of four results.

| Result                      | What you saw                                 | What to do                    |
| --------------------------- | -------------------------------------------- | ----------------------------- |
| Confirmed                   | The source says what Claude said             | Add it to the fix list        |
| Right finding, wrong source | The issue is real but sits elsewhere         | Fix the citation, then add it |
| Not found                   | The source doesn't support it                | Reject it and note why        |
| Needs a tool                | The claim is about status, speed or validity | Re-crawl, or run a validator  |

Two rules keep this quick:

- **Check every high-severity finding.** These drive the most work, so they get a full trace.
- **Sample the rest, one in three.** If any sampled finding fails, trace them all.

Tallyfold's 14 findings split into 5 high and 9 medium or low. Of the 5 high ones, 4 were confirmed. The fifth, a claimed missing canonical, was not found: the tag was there, just placed after the JSON-LD block. For the other 9, a sample of 3 all held up, so the rest stood. That left 13 findings for the fix list and 1 rejection on record.

### Three extra checks for numbers and markup

- **Recount with code.** For counts and sums, ask Claude to recompute them with code and compare with its first answer. Anthropic says code execution is on [every plan](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude) and can run analyses on uploaded data.
- **Validate schema outside Claude.** Test any JSON-LD change in Google's [Rich Results Test](https://developers.google.com/search/docs/appearance/structured-data) and the Schema Markup Validator. Our [schema generator](/tools/schema-generator) helps you write the fix.
- **Re-crawl before closing.** A status code or redirect only counts as fixed once a fresh crawl says so.

## Step 5: Save the Audit and Re-Run It Next Month

Claude for SEO audits pays off on the second run, when it can compare. Save the checked fix list as a dated file, such as `audit-2026-09-29.md`, and upload it to project knowledge. Chats in a Project don't share context unless it's in knowledge, so this file is how next month's chat knows what you found.

Next month, upload a fresh crawl and Search Console export, then ask: "Compare the new crawl with the last audit file. List findings that are fixed, still open, and new." Run the Source-Trace Check on the new findings only.

For a quick outside view between audits, our free [AI search readiness check](/tools/ai-search-readiness-check) scans a live URL for signals AI engines need. It's a spot check, not a replacement for the crawl.

## Adding Rankbox's Research Tools to the Project

Rankbox's MCP server lives at `https://rankbox.xyz/mcp` and goes into Claude as a custom connector. Once it's added, Claude can call three research tools: one lists the questions people ask AI search about a topic, one builds an SEO content brief with a title, an H2 outline, questions and entities, and one writes three meta description options between 120 and 160 characters long. In a Project built for Claude for SEO audits, it fits Step 3: when the HTML read flags a 171-character meta description, that tool drafts replacements you can check against the page. It won't audit a site, crawl pages, read your Search Console data or publish anything. Setup is on our [Claude integration page](/integrations/claude), and our [Claude SEO tool guide](/blog/claude-seo-tool) covers other connectors.

## Frequently Asked Questions

### Can Claude crawl my website for an SEO audit?

No, not in the chat app. Claude reads files and pages you give it, and web fetch retrieves one page's text at a time. Use a crawler for the site-wide view and give Claude its export. Claude Code can write and run crawl scripts on your own machine, but that's a coding project.

### Do you need a paid plan to use Claude for SEO audits?

No. Free includes Projects (up to five), file uploads, web search and code execution, as of September 2026. Paid plans add Opus models, Claude Code and retrieval for big Projects. Pro was $17 a month billed annually or $20 monthly on 29 September 2026.

### How do I get Search Console data into Claude?

Export it from the Performance report as CSV and upload the file. Google truncates report exports at 1,000 rows, so filter to the pages you need. For more, use the Search Console API or the BigQuery bulk export, or a third-party connector that reads Search Console.

### How accurate is Claude for SEO audits?

Accurate enough to find candidates, not to act on unchecked. Claude can misread a file or quote the wrong source. Anthropic says its hallucination fixes reduce errors but don't remove them. Trace each finding to its source and validate markup outside Claude.

### How often should I re-run the audit?

Re-running Claude for SEO audits monthly works for most small sites, timed with a fresh crawl and Search Console export. Re-run sooner after a redesign, a CMS change or a template edit, since those break titles, canonicals and markup across many pages at once.

## References

1. [How can I create and manage projects?, Claude Help Center](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects)
2. [What are projects?, Claude Help Center](https://support.claude.com/en/articles/9517075-what-are-projects)
3. [Retrieval augmented generation (RAG) for projects, Claude Help Center](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects)
4. [Upload files to Claude, Claude Help Center](https://support.claude.com/en/articles/8241126-uploading-files-to-claude)
5. [Create and edit files with Claude, Claude Help Center](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude)
6. [Plans and pricing, Claude](https://claude.com/pricing)
7. [Web fetch tool, Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool)
8. [Reduce hallucinations, Claude Platform Docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)
9. [Export data directly from a Search Console report, Search Console Help](https://support.google.com/webmasters/answer/12919797)
10. [About bulk data export of Search Console data to BigQuery, Search Console Help](https://support.google.com/webmasters/answer/12918484)
11. [SEO Spider, Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/)
12. [Test your structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data)
