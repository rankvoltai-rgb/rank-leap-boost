---
title: What Is an llms.txt File? A Plain-English Explainer
description: What is an llms.txt file? A plain-English answer: what it says, a tiny example, who reads it, how it differs from robots.txt and sitemaps, and who has one.
keyword: llms.txt
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

An llms.txt file is a short text file, written in Markdown, that sits at `yoursite.com/llms.txt` and tells AI tools what your site is and which pages to read first. Think of it as a table of contents for AI agents: it points the way, but it doesn't grant access, block anything or change your search rankings.

The name comes from LLMs, short for [large language models](/glossary/large-language-model), the systems behind ChatGPT, Claude and Gemini. Jeremy Howard of Answer.AI proposed the file in September 2024, and a second version followed in August 2026. It's a community proposal that anyone can follow, not a rule set by a standards body.

It's also more common than you might guess. When Rankbox checked 16,784 websites on 28 September 2026, 31.3% served one, and half of developer-tool companies did. Our report on [the state of llms.txt adoption](/blog/state-of-llms-txt-adoption) breaks that down by industry. This explainer covers the basics: what the file looks like, who reads it, and how it differs from the two files you may already have.

## Key Takeaways

- An llms.txt file is a Markdown summary of your site plus a short list of links to your most useful pages, placed at `/llms.txt`.
- Only the title line is required. Most files add a one-line summary and a few groups of links with notes.
- AI agents, especially coding assistants, read it when someone sends them to your site. Google Search ignores it, and AI search crawlers rarely request it.
- robots.txt sets rules for crawlers and a sitemap lists every page for search engines. llms.txt does neither job; it's a guided tour.
- About a third of the sites in Rankbox's September 2026 crawl had one, led by software companies.

## What an llms.txt File Looks Like

Here's a complete example for Fernwood Bakery, a made-up bakery on a reserved test domain:

```markdown
# Fernwood Bakery

> Fernwood Bakery is a family bakery selling sourdough, pastries and custom cakes. Cake orders need 48 hours' notice.

## Main pages

- [Menu and prices](https://fernwood.example/menu): breads, pastries and cake prices
- [Custom cakes](https://fernwood.example/cakes): sizes, flavours and how to order
- [Visit us](https://fernwood.example/visit): address, opening hours and parking
```

That's the whole file. An AI agent that reads it learns what Fernwood is in one sentence, then knows exactly which page answers a question about prices, cakes or opening hours.

Real files usually run longer. In [Rankbox's crawl](/blog/state-of-llms-txt-adoption), the median file was 6.9 KB with 26 Markdown links, and 221 files (4.2%) ran past 100 KB. A file that long stops being a quick map, so keep yours to the pages people actually ask about.

### What each symbol means

The file uses a few Markdown marks, the same ones you might type in a chat app:

- `#` starts the title. It's the only part the [llmstxt.org proposal](https://llmstxt.org/) requires.
- `>` marks the one-line summary, the key facts an agent needs first.
- `##` starts a group of links. You can have several groups, and one called "Optional" for pages an agent can skip.
- `- [Name](link): note` is one link, with a short note on what the page holds.

For the full rules, element by element, read [the llms.txt standard, explained line by line](/blog/llms-txt-standard).

### Where the file goes

Put it at the root of your site, so it loads at `https://yoursite.com/llms.txt`. The proposal also allows a file in a folder, such as `/docs/llms.txt`, which covers only the pages in that folder. Many platforms create one for you: Shopify stores serve one by default, per Shopify's [May 2026 changelog](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd), and [Wix generates one](https://support.wix.com/en/article/understanding-your-sites-llmstxt-file) for upgraded sites with a custom domain.

## Who Actually Reads llms.txt

The proposal says the files are ["used most heavily for software documentation, where coding agents follow them to find API references and tutorials."](https://llmstxt.org/) It adds that the same layout works for a business outlining its policies or a school listing its courses. Here's who reads the file in practice, as of September 2026:

| Reader | Does it read llms.txt? | Source |
| --- | --- | --- |
| Coding agents and docs tools | Yes, when sent to a site | [Ahrefs log study](https://ahrefs.com/blog/llmstxt-study/): Anthropic's Claude-Code agent fetched files more often than any AI search bot |
| AI search crawlers (ChatGPT, Perplexity, Claude search) | Rarely | Ahrefs: AI retrieval bots made 1.1% of the requests for these files in May 2026 |
| Google Search, including AI Overviews | No | Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says Search "ignores" these files |
| Chrome's Lighthouse audit | Checks it exists | Lighthouse's [agentic browsing checks](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) look for "a machine-readable summary at the domain root" |
| People | Sometimes | Ahrefs: 98% of requests for files that didn't exist came from humans, likely SEOs checking competitors |

The pattern is simple. Agents read the file when a link, a person or a task sends them to it. Search crawlers building an index mostly don't. The AI companies themselves publish one for their developer docs, but none of their crawler pages says their bots read other sites' files.

If your real question is whether the file helps your rankings, we answer that in [will an llms.txt file help your SEO](/blog/will-llms-txt-help-your-seo). If it's whether the file gets you into AI search, see [how to get indexed by an LLM through llms.txt](/blog/how-to-get-indexed-by-llm-through-llms-txt).

## llms.txt vs robots.txt vs sitemap.xml: Three Files, One Bakery

Three small files can sit at the root of the same site, and each does a different job. Here's what Fernwood Bakery's other two might look like.

Its robots.txt sets rules for crawlers:

```text
User-agent: *
Disallow: /checkout/

Sitemap: https://fernwood.example/sitemap.xml
```

Its sitemap.xml lists every page and when it last changed:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://fernwood.example/menu</loc><lastmod>2026-09-20</lastmod></url>
  <url><loc>https://fernwood.example/cakes</loc><lastmod>2026-09-12</lastmod></url>
  <url><loc>https://fernwood.example/visit</loc><lastmod>2026-06-02</lastmod></url>
</urlset>
```

A real sitemap would list every public page, up to 50,000 per file under the [sitemaps.org protocol](https://www.sitemaps.org/protocol.html). The llms.txt file lists only the three that matter, with a note on each.

### Which file does the job?

The easiest way to keep them apart is by task. This "which file" table is the one to keep handy:

| You want to | Use | Why |
| --- | --- | --- |
| Keep crawlers out of your checkout pages | robots.txt | [Google says](https://developers.google.com/search/docs/crawling-indexing/robots/intro) it "tells search engine crawlers which URLs the crawler can access" |
| Tell Google and Bing about every page and when it changed | sitemap.xml | Sitemaps "inform search engines about pages on their sites that are available for crawling," per [sitemaps.org](https://www.sitemaps.org/) |
| Give an AI agent a short guided tour | llms.txt | A summary plus the few pages that answer most questions |
| Stop AI companies training on your pages | robots.txt rules for training bots such as GPTBot and ClaudeBot | llms.txt grants and blocks nothing |
| Keep a page out of Google's results | A `noindex` tag, not any of the three | Google says robots.txt "is not a mechanism for keeping a web page out of Google" |

robots.txt is also the only one of the three with a formal standard behind it: the Robots Exclusion Protocol is [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). The proposal itself says the file is designed to "coexist with current web standards" like these two, not replace them.

## Four Things llms.txt Is Not

Plenty of guides oversell the file. Four claims come up often, and none holds up:

1. **It isn't a ranking factor.** [Google says](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) making one "will neither harm nor help" your visibility in Google Search.
2. **It isn't a permission file.** It can't block AI crawlers or opt you out of training. That's robots.txt's job.
3. **It isn't an official standard.** It's a proposal maintained [on GitHub](https://github.com/AnswerDotAI/llms-txt), open for community input, with no RFC or W3C document behind it.
4. **It isn't a full list of your pages.** It's meant to be curated. Your sitemap is the complete list.

What's left is modest but real: a cheap, tidy map for AI agents that come looking.

## Should Your Site Have One?

If you publish developer docs or an API, yes: that's where agents use the file most. If your platform already makes one, spend ten minutes checking that its summary and links are right. For everyone else, it's optional and harmless, and it comes after the basics that decide whether AI search can see you at all: crawler access, pages that load without JavaScript, and content that answers real questions.

### Check whether a site already has one

Type the address into a browser: `https://anysite.com/llms.txt`. If you see plain text that starts with a `#` title, the site has one. If you see the homepage or a styled error page instead, it doesn't. Rankbox's crawl found 7.4% of sites answering that address with an HTML page, which gives an agent markup where it expected a map. Try it on your own site first, then on two or three competitors, to see what a finished file looks like in your field.

Our [complete guide to getting indexed by LLMs with an llms.txt file](/blog/how-to-get-indexed-by-llms-with-llms-txt) covers writing, serving and testing the file step by step. To make one in a few minutes, the free [llms.txt generator](/tools/llms-txt-generator) builds it from a form, and the [AI search readiness check](/tools/ai-search-readiness-check) confirms it's live.

Rankbox's paid product works on the pages your file points to. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that answer your buyers' questions. Rankbox doesn't create or host the file for you, and it doesn't track AI citations today. See the [pricing page](/pricing).

## Frequently Asked Questions

### What does llms.txt stand for?

The "llms" stands for large language models, the AI systems behind tools like ChatGPT, Claude and Gemini. The ".txt" is the usual text-file ending. The file is named after its audience, the same way robots.txt is named after crawlers.

### Where does an llms.txt file go?

At the root of your website, so it loads at `https://yoursite.com/llms.txt`. The proposal also allows a file in a folder, such as `/docs/llms.txt`, which covers only that folder. Serve it as plain text or Markdown with a normal 200 status.

### Is llms.txt the same as robots.txt?

No. robots.txt is a set of access rules that crawlers follow, backed by an internet standard. llms.txt is a reading guide for AI agents that grants and blocks nothing. A site can have both, and they don't affect each other.

### Who created llms.txt?

Jeremy Howard, founding CEO of the AI lab Answer.AI, proposed it on 3 September 2024. He published version 2 in August 2026, adding ways for agents to find Markdown copies of pages. The text lives on llmstxt.org and in a public GitHub repository.

### Do ChatGPT and Claude read llms.txt files?

Not for their search indexes, as far as anyone can tell: as of September 2026, neither OpenAI nor Anthropic says its search crawler reads other sites' files. Both publish their own for developer docs. Coding agents such as Claude Code do fetch the files when pointed to a site, according to Ahrefs' log study.

### How many websites have an llms.txt file?

In Rankbox's crawl of 16,784 sites on 28 September 2026, 31.3% served one. The share varies a lot by group: 50.4% of developer-tool companies, 15.7% of the Fortune 500 and 5.2% of news and media sites.

## References

1. [The /llms.txt file, v2, llmstxt.org](https://llmstxt.org/)
2. [Changes since v1, llmstxt.org](https://llmstxt.org/changes.html)
3. [Optimizing your website for generative AI features, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
4. [Introduction to robots.txt, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
5. [RFC 9309: Robots Exclusion Protocol, RFC Editor](https://www.rfc-editor.org/rfc/rfc9309.html)
6. [Sitemaps.org](https://www.sitemaps.org/)
7. [Sitemaps XML format, sitemaps.org](https://www.sitemaps.org/protocol.html)
8. [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read, Ahrefs](https://ahrefs.com/blog/llmstxt-study/)
9. [Agentic browsing scoring, Lighthouse, Chrome for Developers](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring)
10. [Customize /llms.txt, /llms-full.txt and /agents.md, Shopify](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd)
11. [Understanding your site's llms.txt file, Wix Help Center](https://support.wix.com/en/article/understanding-your-sites-llmstxt-file)
12. [AnswerDotAI/llms-txt repository, GitHub](https://github.com/AnswerDotAI/llms-txt)
