---
title: How to Use Claude for SEO Audits and Content Analysis
description: Six copy-ready prompts for using Claude for SEO audits: entity gaps, schema vs rivals, quotable lines, internal links and FAQ gaps, each with a proof step.
keyword: Claude for SEO audits
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI SEO Tools, Playbooks
---

To use Claude for SEO audits, paste the evidence into one chat (your page's raw HTML, the pages that outrank it, and a Search Console or crawl export), ask one narrow question per prompt, and make Claude quote the source line behind every finding. Claude is very good at reading several long documents side by side and spotting what one has that the others lack. It is not a crawler, a rank tracker or a schema validator, so every finding needs a proof step before you act on it.

Claude for SEO audits works now because of room. As of September 2026, Anthropic's help center lists a [1M-token context window](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans) in chat on paid plans for Claude Fable 5.1, Claude Opus 5.5 and Claude Sonnet 5.5. The same page puts 200K tokens at "about 500 pages of text," so 1M tokens is roughly 2,500 pages by that ratio. Your article, three rival pages and all their markup fill a tiny corner of that.

Guides to Claude for SEO audits do exist. The two we read on 29 September 2026 covered crawl triage, title tags and a single page's schema, and one compared topics with competitors. Neither listed entities side by side with rivals or compared your markup with the pages that outrank you. Those are the jobs where a long context window earns its keep.

This post is the prompt library: six templates, each with the exact prompt, what to paste in, and how to check the output, plus a worked example with a fictional brand. For a start-to-finish run inside a Claude Project, read our [step-by-step walkthrough of Claude for SEO audits](/blog/how-to-use-claude-for-seo-audits). For plans, connectors and Claude Code, see the [Claude SEO tool guide](/blog/claude-seo-tool).

## Key Takeaways

- Claude for SEO audits works best as a reader and comparer of documents you supply. It has no rankings, search volumes or crawl data of its own.
- Paste raw HTML or JSON-LD yourself. Anthropic's web fetch returns a page's text and doesn't run JavaScript, so markup and scripted content can go missing.
- Put the documents first and the question last, in labeled tags. Anthropic says queries at the end improved response quality by up to 30% in its tests.
- Make Claude quote before it concludes. Anthropic advises pulling word-for-word quotes from long documents first, and retracting any claim with no supporting quote.
- Validate every schema change in Google's Rich Results Test or the Schema Markup Validator. Claude saying markup "looks valid" is not a test.
- Don't add FAQPage markup to chase rich results. Google stopped showing FAQ rich results on 7 May 2026.
- Budget for false alarms. In our fictional worked example, 2 of 6 entity gaps Claude flagged failed the proof step.

## What Claude Sees When You Audit a Page

Claude only audits what reaches its context window. That sounds obvious, but it decides which jobs Claude for SEO audits can cover alone and which need another tool.

| Audit job            | Claude handles it when you paste  | Needs another tool for          | Proof step                                 |
| -------------------- | --------------------------------- | ------------------------------- | ------------------------------------------ |
| On-page elements     | Raw HTML of the page              | Content rendered by JavaScript  | Compare with a crawler export              |
| Entity coverage      | Main text of your page and rivals | Nothing                         | Find each gap in the pages yourself        |
| Schema comparison    | JSON-LD blocks from each page     | Validity                        | Rich Results Test, Schema Markup Validator |
| Quotable sentences   | Your draft                        | Nothing                         | Recount characters, check no facts changed |
| Internal links       | A URL list with titles            | Status codes, indexability      | Match every target to the crawl list       |
| FAQ gaps             | Search Console query export       | Demand beyond your own data     | Match impressions to the export            |
| Rankings and volumes | Nothing it can use                | Search Console, Ahrefs, Semrush | Not a Claude job                           |

### Paste the source, not just a link

With web search on, Claude can [fetch a URL](https://support.claude.com/en/articles/10684626-enabling-and-using-web-search) you give it. Anthropic's developer docs say the fetch tool "retrieves the full text content" of a page and [does not support](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool) sites rendered with JavaScript. They don't say whether `<script>` blocks such as JSON-LD survive the trip. Claude Code's docs are blunter: its WebFetch tool converts pages to Markdown and is ["lossy by design"](https://code.claude.com/docs/en/tools-reference).

So when you use Claude for SEO audits on markup, open the page source (Ctrl+U in most browsers) and paste it. For content that appears only after scripts run, copy the rendered HTML from your browser's developer tools.

### Pick the model and the plan

Anthropic's [models overview](https://platform.claude.com/docs/en/about-claude/models/overview) suggests starting with Claude Opus 5.5 for most workloads. On the [pricing page](https://claude.com/pricing), Free includes Sonnet and Haiku but not Opus, and Pro costs $17 a month billed annually or $20 monthly, as listed on 29 September 2026. Claude for SEO audits works on any current model. Long comparisons just fit better on the 1M-token ones.

## The Proof-Step Audit Kit: Six Prompts

Every template here has three parts. **Paste** is the evidence. **Prompt** is the exact text to send. **Proof** is how you check the answer before it becomes a task. Skip the proof and Claude for SEO audits becomes one run of a language model deciding your roadmap.

All six use the same shell, taken from Anthropic's [long-context prompting advice](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices): documents at the top, each in its own labeled tag, and the question at the end.

```text
<documents>
<document index="1">
<source>Our page: tallyfold.example/blog/late-invoices</source>
<document_content>
[paste our page here]
</document_content>
</document>
<document index="2">
<source>Rival page: [URL]</source>
<document_content>
[paste the rival page here]
</document_content>
</document>
</documents>

[paste one of the six prompts here]
```

### Prompt 1: The entity gap audit

An entity is a named thing a search system can identify: a company, a law, a product, a place, a defined concept. Pages that rank often share entities your page never mentions. Our glossary entry on [entity SEO](/glossary/entity-seo) covers the idea.

**Paste:** the main text of your page (document 1) and of the two or three pages that outrank it. Strip menus and footers.

```text
Document 1 is our page. The other documents are rival pages.
Step 1. List every named entity in each document: people, companies, products, laws, standards, places and named concepts. Quote the sentence where each one first appears.
Step 2. Make a table with one row per entity and one column per document. Mark each cell yes or no.
Step 3. List the entities that appear in at least two rival documents but not in document 1. Call these gaps.
Step 4. For each gap, write one sentence on why a reader of document 1 might need it.
Use only the documents. If you are unsure whether two names mean the same thing, say so. Do not guess.
```

**Proof:** search your own page for each gap, synonyms included. Then search two rival pages for the quote Claude gave. Reject any gap you can't confirm both ways. For a second opinion, Google Cloud's [Natural Language API](https://docs.cloud.google.com/natural-language/docs/analyzing-entities) lists the entities in a text with a salience score for each.

A confirmed gap is a question, not an order. Add an entity only where it helps the reader. Our explainer on [entity authority in SEO](/blog/what-is-entity-authority-in-seo) covers why consistent entities matter beyond one page.

### Prompt 2: Schema comparison against top-ranking rivals

This is the job most guides to Claude for SEO audits skip. You want to know which structured data properties the pages above you use, and whether any describe facts your page already shows.

**Paste:** the JSON-LD blocks from your page and from two or three rivals (search the source for `application/ld+json`), then the visible text of your page as the last document.

```text
Documents 1 to 4 are JSON-LD blocks. Document 1 is ours. Document 5 is the visible text of our page.
1. For each JSON-LD document, list every @type and every property, with its value.
2. Make a table of properties by document. Mark each cell present or absent.
3. List the properties that two or more rivals use and we do not.
4. For each one, check document 5. Say whether the fact it describes is visible on our page. If it is not visible, mark it "do not add".
5. Flag any property in document 1 whose value does not match document 5, such as a different date or author name.
Do not tell me whether the markup is valid. I will test that separately.
```

**Proof:** paste new markup into Google's [Rich Results Test](https://developers.google.com/search/docs/appearance/structured-data), then the Schema Markup Validator for generic schema.org checks. Keep Google's rule in mind: don't mark up [information that isn't visible](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) to the reader.

Two cautions. Google's AI guide says structured data [isn't required](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) for its generative AI features, though it still helps with rich result eligibility. And a rival's FAQPage block is no reason to copy it: Google's [changelog](https://developers.google.com/search/updates) says FAQ rich results stopped appearing on 7 May 2026. Our free [schema generator](/tools/schema-generator) writes clean JSON-LD once you know what to add.

### Prompt 3: Quotable soundbites before you publish

AI answers quote short passages, not whole pages. Anthropic's web search API, for instance, returns a [`cited_text` field](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) of up to 150 characters per citation. That's one field in one API, not a rule for every engine, but it makes a useful target for a sentence meant to be lifted.

**Paste:** your draft, alone.

```text
Find the ten sentences in this draft that could best be quoted as a stand-alone answer.
Test each one against four rules:
A. Under 150 characters.
B. Makes sense on its own, with no "it", "this" or "as above" pointing elsewhere.
C. Names its subject.
D. States a specific fact, number, rule or definition.
Quote each sentence exactly, give its character count, and list the rules it fails.
Rewrite the ones that fail. Keep the meaning. Add no new facts.
Then list any question the draft answers that has no quotable sentence at all.
```

**Proof:** recount characters in your editor and read each rewrite against the original. A rewrite that adds a number or a claim fails, even if it reads better. Our [AI citation readiness checker](/tools/ai-citation-readiness-checker) scores the whole draft, and the Lift Test in our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search) goes deeper on passage-level edits.

### Prompt 4: Internal link suggestions

Claude matches sentences to pages well, and it will also invent a URL that sounds right. The fix is a closed list.

**Paste:** a crawler export of your indexable URLs with title and H1, then the page you're editing.

```text
Document 1 is a list of our URLs with titles. Document 2 is the page we are editing.
Suggest up to eight internal links from document 2 to pages in document 1.
For each link give: the exact sentence in document 2 where it fits, the target URL copied exactly from document 1, an anchor text of two to six words that describes the target, and one line on why a reader would click.
Use only URLs from document 1. Do not create URLs.
Then name three pages in document 1 that should link to document 2.
```

**Proof:** look up every target in the crawl list. It must exist, return a 200 status and be indexable. Reject near-identical anchors that point to different pages. Our glossary entry on [internal linking](/glossary/internal-linking) covers the ground rules.

### Prompt 5: The FAQ gap audit

Search Console shows which questions bring people to a page. The gap is the ones the page never answers.

**Paste:** the Queries tab of the Performance report, filtered to the page and exported as CSV. Google says report exports are [truncated to 1,000 rows](https://support.google.com/webmasters/answer/12919797), which is plenty for one page. Then paste the page text.

```text
Document 1 is a Search Console export of queries for our page, with clicks and impressions. Document 2 is the page.
1. Pick the queries that are questions or clearly imply one.
2. Group queries that ask the same thing. Sum the impressions for each group.
3. For each group, quote the sentence in document 2 that answers it, or write "not answered".
4. Rank the unanswered groups by impressions.
5. For the top five, draft a 40 to 60 word answer using only facts in document 2. If document 2 lacks the facts, write "needs a source".
```

**Proof:** add up the impressions for each group yourself and compare with the export. Check every "answered" quote exists on the page. Then answer the gaps in visible copy, as real headings with short answers. Our [AI question generator](/tools/ai-question-generator) adds questions your Search Console data may not show yet.

### Prompt 6: The raw HTML read

The last template is the classic on-page check in Claude for SEO audits, done from source instead of a browser tab.

**Paste:** the full page source.

```text
This is the raw HTML of one page. Extract and quote:
the title tag and its length in characters; the meta description and its length; the canonical URL; any meta robots tag; every hreflang tag; the number of H1 tags; the H2 and H3 outline in order; the number of images with no alt text; the @type of every JSON-LD block; and the count of internal and external links.
Then check the page against these house rules: [list your rules].
For each problem, quote the exact line of HTML. If something is missing, say "not found" rather than assuming.
```

**Proof:** run the page through a crawler or our free [heading structure checker](/tools/heading-structure-checker) and compare counts. If Claude's counts differ from the crawler's, trust the crawler, or ask Claude to recount with code execution turned on.

## Worked Example: Auditing a Tallyfold Post Against Two Rivals

Tallyfold is a made-up invoicing and payments app for agencies. Its rivals Brindlework and Kestrelyn are made up too, and so are all the numbers below. The page under audit is a Tallyfold guide on chasing late invoices that ranks below both rivals' guides. This is Claude for SEO audits at the scale of one page.

### The entity gap audit

In this illustrative run, Claude listed 12 entities on Tallyfold's page, 19 on Brindlework's and 17 on Kestrelyn's. It flagged six gaps: entities in both rival pages but not in Tallyfold's. The proof step changed that list.

| Entity Claude flagged | Brindlework | Kestrelyn       | Tallyfold                 | After the proof step                  |
| --------------------- | ----------- | --------------- | ------------------------- | ------------------------------------- |
| Late fee clause       | Yes         | Yes             | No                        | Confirmed gap                         |
| Statement of account  | Yes         | Yes             | No                        | Confirmed gap                         |
| Dunning schedule      | Yes         | Yes             | No                        | Confirmed gap                         |
| Small claims court    | Yes         | Yes             | No                        | Confirmed gap                         |
| Net-30 terms          | Yes         | Yes             | Written as "30-day terms" | Rejected: same concept, other wording |
| Payment plan          | Yes         | Quote not found | No                        | Rejected: only one rival has it       |

Four of six flags survived, so two of six (33%) were false alarms. One was a synonym Claude didn't match. The other was a quote Claude pinned on the wrong rival. That's the core lesson of Claude for SEO audits: the model finds candidates fast, and you confirm them.

### The schema comparison

| Property                              | Tallyfold           | Brindlework | Kestrelyn | Decision                                   |
| ------------------------------------- | ------------------- | ----------- | --------- | ------------------------------------------ |
| Article with headline and image       | Yes                 | Yes         | Yes       | Keep                                       |
| author as a Person with a profile URL | No, an Organization | Yes         | Yes       | Add, because the page shows a named author |
| dateModified                          | No                  | Yes         | Yes       | Add, matching the visible "Updated" date   |
| BreadcrumbList                        | No                  | Yes         | No        | Optional: only one rival uses it           |
| FAQPage                               | No                  | No          | Yes       | Skip: no FAQ rich results since 7 May 2026 |

Claude also caught one mismatch. Tallyfold's markup gave `datePublished` as 3 November 2025, while the page showed "Updated 12 January 2026" and had no dateModified at all. The fix went through the Rich Results Test before it shipped.

### The FAQ gaps

The page's Search Console export held 212 queries. Claude marked 38 as questions and grouped them into 9 intents with 7,500 impressions between them. Five intents had no answer on the page:

| Unanswered question group                  | Impressions |
| ------------------------------------------ | ----------- |
| Can I charge interest on a late invoice    | 1,240       |
| What to say to a client who won't pay      | 860         |
| When does a late invoice go to collections | 410         |
| Can I stop work until a client pays        | 300         |
| How to write a final payment notice        | 190         |
| **Total**                                  | **3,000**   |

That's 3,000 of 7,500 question impressions, or 40%, landing on a page that doesn't answer the question. The totals matched the export, so the proof step passed. The top two groups became new H3 sections, each checked by someone who knows the law in Tallyfold's market.

## Where Claude for SEO Audits Goes Wrong, and How to Catch It

Anthropic is direct about the main risk. Its [guide to reducing hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) says Claude "can sometimes generate text that is factually incorrect or inconsistent with the given context," and that its fixes "don't eliminate them entirely." Plan for these five failures whenever you use Claude for SEO audits.

| Failure           | What it looks like                             | How to catch it                                          |
| ----------------- | ---------------------------------------------- | -------------------------------------------------------- |
| Invented findings | A gap, quote or URL that isn't in any document | Require quotes, then search for each one                 |
| Run-to-run drift  | A second run flags different gaps              | Run key prompts twice and keep what appears both times   |
| Stale knowledge   | Advice on a search feature that has changed    | Paste the current doc page instead of asking from memory |
| Missing data      | Confident guesses about rankings or volume     | Give it Search Console data or a data connector          |
| Invisible content | "No schema found" on a page that has it        | Paste raw or rendered HTML, not a link                   |

Anthropic also suggests letting Claude say "I don't know" and running a prompt several times to compare outputs, which it calls best-of-N verification. Both are built into the kit.

Stale knowledge needs a note. The models overview lists a reliable knowledge cutoff of June 2026 for Fable 5.1, Opus 5.5 and Sonnet 5.5, and February 2025 for Haiku 4.5. Search features change faster than that. When the audit depends on what Google supports today, paste Google's current page into the chat.

Last, check what you may paste. Anthropic's pricing page lists model training as "Opt-out" on Free, Pro and Max, and "None by default" on Team and Enterprise. Read your contracts before you use Claude for SEO audits on a client's Search Console export.

## Faster Audits With Projects and Connectors

Claude for SEO audits gets repetitive by the third page. Two features cut the repetition.

**Projects.** A [Claude Project](https://support.claude.com/en/articles/9517075-what-are-projects) holds instructions and files that every chat inside it can use. Save the six prompts and your house rules there once. Free accounts get up to five projects, and paid plans switch large projects to retrieval, which Anthropic says holds up to ten times more. Our [walkthrough](/blog/how-to-use-claude-for-seo-audits) shows the full setup.

**Connectors.** Remote MCP servers let Claude pull live data. Ahrefs and Semrush both run official ones that add the rankings and volumes Claude doesn't have on its own. The [Claude SEO tool guide](/blog/claude-seo-tool) lists which plans they need, per their own pages.

![Getting started with connectors in Claude.ai](youtube:_jjSS0qGFbI "Anthropic shows how to set up connectors that give Claude access to your files and apps (December 2025).")

### Adding Rankbox to the audit loop

Rankbox runs a remote MCP server at `https://rankbox.xyz/mcp`, which you add in Claude as a custom connector. It gives Claude three research tools: the questions people ask AI search about a topic, an SEO content brief (title, H2 outline, questions and entities) and meta descriptions (three options of 120 to 160 characters). It fits the planning step that follows an audit: a brief's entity list is a second source to check your gaps against. It does not audit sites, crawl pages, read Search Console or publish anything. Setup steps are on our [Claude integration page](/integrations/claude).

When an audit says a page needs a rewrite, not a patch, Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and drafts a source-backed replacement for your team to review.

## Frequently Asked Questions

### Can Claude do a full SEO audit on its own?

No. Claude reads and compares what you give it, but it doesn't crawl sites, see rankings or know search volumes. Pair it with a crawler export and Search Console data, or a connector such as Ahrefs or Semrush. Claude for SEO audits covers the judgment calls those tools leave to you.

### Can Claude read my website from a URL?

Yes, with web search on, Claude can fetch a page you link. Anthropic's docs say the fetch returns the page's text and doesn't support JavaScript-rendered sites. For markup or scripted content, paste the page source or rendered HTML instead.

### Can you use Claude for SEO audits on the free plan?

Yes, for single pages. As of September 2026, Free includes Sonnet and Haiku, web search, file uploads and up to five projects, but not Opus. Anthropic suggests Opus 5.5 for most work, which needs Pro or higher. Paid plans also add Claude Code and retrieval for large Projects.

### How much can I paste into Claude for an audit?

On paid plans, up to 1M tokens in chat with Fable 5.1, Opus 5.5 or Sonnet 5.5, as of September 2026. Anthropic counts 200K tokens as about 500 pages. Chat uploads allow up to 20 files of up to 500MB each, and project files up to 30MB each.

### Can Claude check whether my schema markup is valid?

Not reliably. Claude can compare properties and spot mismatches with your visible text, but that isn't validation. Test every change in Google's Rich Results Test, then the Schema Markup Validator, before it ships.

### Should I use Claude for SEO audits of client sites?

Yes, if your plan and contract allow it. Anthropic lists model training as opt-out on Free, Pro and Max and off by default on Team and Enterprise, as of September 2026. Strip personal data from exports and log which findings passed the proof step.

## References

1. [Models overview, Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/models/overview)
2. [How large is the context window on paid Claude plans?, Claude Help Center](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans)
3. [Plans and pricing, Claude](https://claude.com/pricing)
4. [Enable and use web search, Claude Help Center](https://support.claude.com/en/articles/10684626-enabling-and-using-web-search)
5. [Web fetch tool, Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool)
6. [Web search tool, Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)
7. [Tools reference, Claude Code Docs](https://code.claude.com/docs/en/tools-reference)
8. [Prompting best practices: long context, Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
9. [Reduce hallucinations, Claude Platform Docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)
10. [What are projects?, Claude Help Center](https://support.claude.com/en/articles/9517075-what-are-projects)
11. [Upload files to Claude, Claude Help Center](https://support.claude.com/en/articles/8241126-uploading-files-to-claude)
12. [Test your structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data)
13. [Introduction to structured data markup in Google Search, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
14. [Latest Google Search documentation updates, Google Search Central](https://developers.google.com/search/updates)
15. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
16. [Analyzing entities, Google Cloud Natural Language](https://docs.cloud.google.com/natural-language/docs/analyzing-entities)
17. [Export data directly from a Search Console report, Search Console Help](https://support.google.com/webmasters/answer/12919797)
