---
title: The llms.txt Standard, Explained Line by Line
description: The llms.txt standard, line by line: who wrote it, what v2 changed in August 2026, each required and optional part, and what Lighthouse and parsers check.
keyword: llms.txt standard
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

The llms.txt standard is a one-page proposal, not a formal web standard. Jeremy Howard of Answer.AI published it on 3 September 2024, and its only hard rule is that the file starts with an H1 naming your site. Every other part is optional, but each has a set order and syntax.

Version 2 arrived in August 2026. It added a way for agents to find Markdown copies of pages, defined what a file in a subfolder covers, and took away the special meaning of the Optional section. Real files follow the basics well: in Rankbox's crawl of 5,246 llms.txt files, 94.3% opened with an H1. Our report on [the state of llms.txt adoption](/blog/state-of-llms-txt-adoption) has the full error counts and the adoption rates by industry.

This post reads the llms.txt standard line by line, using a short example file, then compares the text with what validators actually test. It doesn't cover hosting or headers; our [complete llms.txt guide](/blog/how-to-get-indexed-by-llms-with-llms-txt) does. For a gentler start, read [what an llms.txt file is](/blog/what-is-an-llms-txt-file), and for whether the file gets your pages into AI search, see [how to get indexed by an LLM](/blog/how-to-get-indexed-by-llm-through-llms-txt).

## Key Takeaways

- The llms.txt standard is a community proposal kept in Answer.AI's GitHub repository. No standards body such as the IETF or W3C has adopted it, while robots.txt is RFC 9309.
- Only the H1 is required. A useful file adds a blockquote summary, an optional notes block and H2 sections of `- [name](url): note` links.
- v2 (August 2026) added `rel="alternate"` and `rel="describedby"` links, allowed `page.md` as well as `page.html.md`, defined subfolder scope and turned "Optional" into a plain convention.
- llms-full.txt isn't in the text of either version, despite claims that it was adopted.
- A spec-valid file can still fail the tools. A file with only an H1 fails Lighthouse's audit and stops the reference Python parser, llms-txt 0.0.7, with an error.
- In Rankbox's crawl, 14.1% of files listed bare URLs instead of Markdown links, the most common break with the llms.txt standard.

## Who Wrote the llms.txt Standard, and How Official Is It

Jeremy Howard, the [founding CEO of Answer.AI](https://www.answer.ai/posts/2023-12-12-launch.html), wrote the proposal. The [spec page](https://llmstxt.org/) is dated 3 September 2024 and now titled "The /llms.txt file, v2." It calls itself a proposal ("We propose adding a /llms.txt markdown file to websites") and says the text is "open for community input" through a [GitHub repository](https://github.com/AnswerDotAI/llms-txt) that hosts "this informal overview."

So "standard" here means a shared convention, not a ratified document. Compare robots.txt: the Robots Exclusion Protocol became [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), a Standards Track document, in September 2022. The llms.txt standard has no RFC number, no registry and no formal test suite. It changes when the text in that repository changes.

### From v1 to v2, with dates

The spec page, the repository's commit history and PyPI date each change:

| Date | What changed | Where to see it |
| --- | --- | --- |
| 3 Sep 2024 | First proposal: root `/llms.txt`, H1, blockquote, notes, H2 file lists, a special "Optional" section | [Spec page](https://llmstxt.org/) date line |
| 9 Jun 2026 | An "optional byte-order mark (BOM)" added at the top of the format list | [Commit history](https://github.com/AnswerDotAI/llms-txt/commits/main/nbs/index.qmd) |
| 10 Aug 2026 | v2: link relations for discovery, `page.md` allowed, subfolder scope defined, context tool and Optional's special meaning removed | [Changes page](https://llmstxt.org/changes.html) and commit history |
| 24 Sep 2026 | Reference Python package `llms-txt` 0.0.7 released | [PyPI](https://pypi.org/project/llms-txt/) |

The changes page gives v2's motive. After two years of use, the most requested fix was discoverability: "Given a page, how does an agent find its markdown version, or the llms.txt file that covers it, without guessing?" v1 also said nothing about how agents should read the file. v2 states it: agents "view or search" the file, "then follow the relevant links."

## The llms.txt Standard, Line by Line

Here's a complete file for Tidewell, a made-up invoicing API on the reserved test domain `tidewell.example`. It runs to 18 lines and 618 bytes:

```markdown
# Tidewell

> Tidewell is an invoicing API for online marketplaces. It creates, sends and reconciles invoices in 30 currencies.

Prices on the pricing page are in US dollars. For endpoint details, start with the API reference.

## Docs

- [Quickstart](https://tidewell.example/docs/quickstart.md): send a first invoice in five minutes
- [API reference](https://tidewell.example/docs/api.md): every endpoint, with sample requests and responses

## Company

- [Pricing](https://tidewell.example/pricing.md): plans, per-invoice fees and volume discounts

## Optional

- [Changelog](https://tidewell.example/changelog.md)
```

The spec lists the parts "in the specific order" they must appear. Here they are, top to bottom.

### Before line 1: an optional byte-order mark

A BOM is an invisible character some editors put at the start of UTF-8 files. The June 2026 edit made it explicitly allowed. Tools haven't caught up evenly: Lighthouse's check still passes a file that starts with a BOM, but the reference parser fails on it. Save the file as UTF-8 without a BOM and the question never comes up.

### Line 1: the H1, the only required part

`# Tidewell` names the project or site. The spec says: "This is the only required section." In Rankbox's crawl, 94.3% of files opened with an H1, 1.8% had none and 5.6% had more than one. The reference parser doesn't treat a second H1 as a new part; it folds it into the notes text above the first H2.

### Line 3: the blockquote summary

The `>` line is "a short summary of the project, containing key information necessary for understanding the rest of the file." Give the facts an agent needs before it opens any link: what you are, who it's for, and a number or two. 84.5% of crawled files had one.

Keep it to one line. The reference parser takes only the first line of a blockquote as the summary and files any other lines as notes.

### Line 5: the notes block

Between the summary and the first H2, you may add "zero or more markdown sections (e.g. paragraphs, lists, etc) of any type except headings." Tidewell uses it to say which link answers which question. The spec's own FastHTML example puts a short list of "Important notes" here.

One quirk matters. If a file has a blockquote but no notes block, the reference parser returns an empty summary and files the quote under notes instead. The [llms.txt file on llmstxt.org](https://llmstxt.org/llms.txt) itself has that shape.

### Lines 7 to 14: H2 file lists

Each `##` heading starts a "file list." Every item needs "a required markdown hyperlink `[name](url)`, then optionally a `:` and notes about the file." So `- [Pricing](https://tidewell.example/pricing.md): plans, per-invoice fees and volume discounts` is the full pattern: dash, link, colon, note.

Three details trip people up:

1. **Bare URLs don't count.** A line like `- https://tidewell.example/pricing` has no link text. 14.1% of files in [Rankbox's crawl](/blog/state-of-llms-txt-adoption) did this.
2. **Absolute URLs travel better.** Every example in the spec uses full `https://` links, and relative links only work if the reader knows your host. 2.9% of crawled files used relative links.
3. **Lists should hold only links.** The spec describes each section as a Markdown list of links. The reference parser stops with an error on a paragraph inside a section, on `*` bullets and on bare URLs, and it treats an H3 as the start of a new section.

96.3% of crawled files had H2 sections, and 11.2% linked to `.md` copies of pages.

### Lines 16 to 18: the Optional section

An H2 called `Optional` holds "secondary information: links an agent can skip when a shorter context is needed." In v1 this heading had "a special meaning": the tool that expanded a file into one big context file left those links out. v2 dropped that tool from the proposal, so Optional is now a plain convention with no "mechanical semantics." 24.1% of crawled files used it.

## Beyond the File: Markdown Copies, Scope and llms-full.txt

The llms.txt standard also covers the pages the file points to and where the file may live.

### Markdown copies and how agents find them

Under the llms.txt standard, pages that agents might need should offer "a clean markdown version" at the same URL, with `.md` appended (`page.html.md`) or, since v2, swapped in for the extension (`page.md`). URLs that end in a folder get `index.html.md` or `index.md`.

v2 adds two link relations so an agent can find these files without guessing. Both are listed in the [IANA link relations registry](https://www.iana.org/assignments/link-relations/link-relations.xhtml). In a page's HTML head they look like this:

```html
<link rel="alternate" type="text/markdown" href="/docs/quickstart.md">
<link rel="describedby" href="/docs/llms.txt">
```

The same pair can go in an HTTP `Link:` header, which the spec notes "also works for non-HTML resources" and can be set at the server or CDN without touching pages.

### Where the file lives, and what it covers

The first version of the llms.txt standard put the file at the root, "or, optionally, in a subpath," without saying what a subpath file meant. v2 fills the gap: "A file covers the URLs under its path, and where more than one file applies, agents should use the most specific one." So `/docs/llms.txt` covers everything in `/docs/` and wins over `/llms.txt` for a page in that folder.

The spec also explains why it skips `/.well-known/`, the reserved folder defined in [RFC 8615](https://www.rfc-editor.org/rfc/rfc8615.html): well-known URIs "exist only at the origin root, and many authors control only a path on a shared host," such as a GitHub Pages project site. Some platforms serve a copy there anyway. [Mintlify](https://www.mintlify.com/docs/ai/llmstxt) also hosts `/.well-known/llms.txt`.

### llms-full.txt isn't in the llms.txt standard

Neither version of the spec mentions llms-full.txt. The [v1 text](https://web.archive.org/web/20260304093711/https://llmstxt.org/) described two files a tool could build from llms.txt, `llms-ctx.txt` without the Optional links and `llms-ctx-full.txt` with them, and v2 removed that tooling. Mintlify says it [developed llms-full.txt with Anthropic](https://www.mintlify.com/blog/the-value-of-llms-txt-hype-or-real) and that it "was officially adopted into the llmstxt.org standard," but the spec text doesn't bear that out. It's a common companion format all the same: 933 sites (5.6%) served one in Rankbox's crawl.

## What Validators Check: The llms.txt Conformance Ladder

"Valid" means different things to the spec, to Chrome and to the spec's own parser. The llms.txt Conformance Ladder puts them in order, from the lowest bar to the highest. Treat each rung as a step up: a good file clears the ones below it too.

| Rung | Who sets the bar | What passes |
| --- | --- | --- |
| 1. Spec-valid | The text of the llms.txt standard | An H1 at the top, then any optional parts in order |
| 2. Lighthouse-clean | Chrome's [llms.txt audit](https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/agentic/llms-txt.js) | A file at the origin's `/llms.txt` (a 4xx is marked not applicable, a 5xx fails) with a line starting `# `, one or more Markdown links and 50 or more characters |
| 3. Parser-clean | The reference `llms-txt` package, 0.0.7 | No BOM before the H1, a notes block after the summary so the summary is read, and only `- [name](url)` lines inside sections |
| 4. Agent-ready | The spec's own test | An agent given only the file can answer questions about you |

Six test files show where the rungs split. The spec column is a reading of the text. The other two come from running Lighthouse's check, as written in its source, and the reference parser on each file.

| Test file | Spec | Lighthouse check | Reference parser |
| --- | --- | --- | --- |
| `# Tidewell` and nothing else | Valid | Fails: no link, 11 characters | Error |
| H1, then an H2 list of bare URLs | Invalid | Fails: no Markdown link | Error |
| H1, blockquote and one H2 list, no notes block | Valid | Passes | Parses, but the summary comes back empty |
| The full Tidewell file | Valid | Passes | Parses: title, summary, 3 sections |
| The full file saved with a BOM | Valid since June 2026 | Passes | Error |
| The full file with `*` bullets | Valid Markdown list | Passes | Error |

Two lessons follow. First, the least the spec allows is below what either tool accepts, so treat "H1 only" as a floor, not a target. Second, Lighthouse looks for a few markers, not for the parts in order. It only fetches `/llms.txt` at the root of the tested origin, so a `/docs/llms.txt` is invisible to it, and it never reads your summary or notes. The [Chrome audit page](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt) marks a missing file "Not Applicable."

Lighthouse's help text also overstates the file's job. It says a file that breaks the rules means models "may not be able to understand how you want your website to be crawled or used for training." The llms.txt standard doesn't cover crawling or training. It says robots.txt handles access, while llms.txt is "used on demand, when an agent needs information." Whether any of this helps rankings is a separate question, answered in [will an llms.txt file help your SEO](/blog/will-llms-txt-help-your-seo).

To reach rung 4, take the spec's advice: "Test your file by asking an agent questions about your content, giving it only your llms.txt as a starting point." If the agent can't find Tidewell's per-invoice fee, the pricing note needs more detail.

Rankbox's free [llms.txt generator](/tools/llms-txt-generator) writes files in the spec's order, always with Markdown links, and warns about a missing summary, relative URLs and links without notes. The product itself works on the pages those links point to: the [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles that answer buyers' questions. Rankbox doesn't manage llms.txt files or track AI citations today. Plans are on the [pricing page](/pricing).

## Frequently Asked Questions

### Is llms.txt an official web standard?

No. The llms.txt standard is a community proposal written by Jeremy Howard of Answer.AI and kept on GitHub, where it's "open for community input." Neither the IETF nor the W3C has adopted it. robots.txt, by contrast, is an IETF standard, RFC 9309.

### What is the smallest valid llms.txt file?

A single H1 line, such as `# Tidewell`, meets the spec's only requirement. In practice, add a summary and at least one Markdown link: Chrome's Lighthouse fails a file with no link or fewer than 50 characters, and the reference Python parser can't read an H1-only file.

### What changed in llms.txt v2?

v2, dated August 2026, added `rel="alternate"` and `rel="describedby"` link relations so agents can find Markdown copies and the covering llms.txt. It also allowed `page.md` URLs, defined what a subfolder file covers, and made the Optional section a plain convention.

### Is llms-full.txt part of the llms.txt standard?

No. Neither v1 nor v2 of the spec mentions it. Mintlify says it built the format with Anthropic to bundle a whole docs site into one Markdown file. It's a common companion, served by 5.6% of sites in Rankbox's September 2026 crawl, but no spec defines it.

### Can an llms.txt file live in a subfolder?

Yes. v2 says a file "covers the URLs under its path," so `/docs/llms.txt` covers your docs folder, and agents should use the most specific file that applies. Lighthouse only checks the root file, though, so it won't report on subfolder files.

### Does the llms.txt standard control AI crawling or training?

No. The spec says robots.txt decides access, while llms.txt is read "on demand" when an agent needs information. To allow or block AI crawlers, use robots.txt rules, which our [AI robots.txt generator](/tools/ai-robots-txt-generator) can write.

## References

1. [The /llms.txt file, v2, llmstxt.org](https://llmstxt.org/)
2. [Changes since v1, llmstxt.org](https://llmstxt.org/changes.html)
3. [The /llms.txt file (v1), archived 4 March 2026, Internet Archive](https://web.archive.org/web/20260304093711/https://llmstxt.org/)
4. [AnswerDotAI/llms-txt repository, GitHub](https://github.com/AnswerDotAI/llms-txt)
5. [Commit history of the spec text, GitHub](https://github.com/AnswerDotAI/llms-txt/commits/main/nbs/index.qmd)
6. [llms-txt package, PyPI](https://pypi.org/project/llms-txt/)
7. [llms-txt audit source, Lighthouse, GoogleChrome on GitHub](https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/agentic/llms-txt.js)
8. [llms.txt audit, Lighthouse, Chrome for Developers](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt)
9. [RFC 9309: Robots Exclusion Protocol, RFC Editor](https://www.rfc-editor.org/rfc/rfc9309.html)
10. [RFC 8615: Well-Known Uniform Resource Identifiers, RFC Editor](https://www.rfc-editor.org/rfc/rfc8615.html)
11. [Link relations registry, IANA](https://www.iana.org/assignments/link-relations/link-relations.xhtml)
12. [The value of llms.txt: hype or real?, Mintlify](https://www.mintlify.com/blog/the-value-of-llms-txt-hype-or-real)
13. [llms.txt, Mintlify documentation](https://www.mintlify.com/docs/ai/llmstxt)
14. [A new old kind of R&D lab, Answer.AI](https://www.answer.ai/posts/2023-12-12-launch.html)
