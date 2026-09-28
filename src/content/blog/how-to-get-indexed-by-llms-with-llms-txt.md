---
title: How to Get Indexed by LLMs with an llms.txt File: The Complete Guide
description: What an llms.txt file does for AI search, the full spec with an annotated example, how to serve it on five stacks, and how to check your logs.
keyword: llms.txt
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

To get indexed by LLMs with an llms.txt file, publish a Markdown reading list of your best pages at your domain root, serve it as plain text with a 200 status, and pair it with the three things that put pages into ChatGPT, Claude and Perplexity search: crawler access, discovery and server-rendered HTML. The file guides the AI agents that read it. It doesn't index pages by itself: as of September 2026, no major AI search engine says it uses llms.txt to index or cite sites, and Google says its Search ignores the file.

The file is still worth an hour. Its spec got a major revision in [August 2026](https://llmstxt.org/changes.html), Chrome's Lighthouse now audits it, and Shopify serves one for every store by default. But when Ahrefs checked 137,210 domains, [97% of llms.txt files got zero requests](https://ahrefs.com/blog/llmstxt-study/) in May 2026. So the job is to publish a correct file cheaply, serve it properly, and read your logs to see who fetches it.

This guide covers the full spec, an annotated example for Plannora (a made-up project management app), serving steps for five stacks, validation, log checks and an honest answer on SEO. For a short definition, see our [llms.txt glossary entry](/glossary/llms-txt).

Short answers to two related questions: [will an llms.txt file help your SEO?](/blog/will-llms-txt-help-your-seo) and [can an llms.txt file get you indexed by an LLM?](/blog/how-to-get-indexed-by-llm-through-llms-txt)

## Key Takeaways

- llms.txt is a reading list for AI agents, not an index or a permission file. No major AI search engine says it ranks or cites pages because of it.
- Google says Search ignores llms.txt and that the file "will neither harm nor help" rankings. Chrome's Lighthouse, a separate Google product, still checks it.
- In Ahrefs' study of 137,210 domains, 97% of llms.txt files got no requests in May 2026. GPTBot and Claude-Code, Anthropic's coding agent, fetched them more often than any AI search crawler.
- Pages reach AI search through four layers: access, discovery, rendering and guidance. llms.txt only works on the fourth, so fix the other three first.
- The spec requires only an H1. A useful file adds a blockquote summary, H2 lists of links with notes, and an Optional section. llms-full.txt isn't part of the spec at all.
- Serve the file as UTF-8 plain text or Markdown with a 200 status, and make sure missing paths return a real 404 rather than your homepage.

## What llms.txt Does, and Who Actually Reads It

Jeremy Howard of Answer.AI proposed llms.txt in September 2024. The [current spec](https://llmstxt.org/) says agents "view or search" the file, then follow the links that fit the task. It's used "most heavily for software documentation."

### A reading list, not an index

Four files tell machines about your site. Only two have a documented effect on indexing.

| File | What it tells machines | Who reads it | Documented effect on indexing |
| --- | --- | --- | --- |
| robots.txt | Which paths a crawler may fetch | Every major search and AI crawler | Controls access |
| XML sitemap | Every canonical URL and when it changed | Search engines such as Google and Bing | Helps discovery |
| llms.txt | A curated list of pages, with notes | Coding agents and docs tools, mostly when pointed to it | None |
| Markdown page copies | The clean text of one page | Agents that ask for Markdown | None |

Classic SEO checklists cover the first two. An XML sitemap lists everything; llms.txt lists what matters, and SEO plugins such as Yoast and AIOSEO now generate it. Neither replaces robots.txt.

### What the vendors say

Google has put its position in writing. Its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says an llms.txt file "will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them."

OpenAI, Anthropic and Perplexity publish llms.txt files for their developer docs, and the Markdown version of OpenAI's [crawler page](https://developers.openai.com/api/docs/bots) opens with a pointer to one. But none of their crawler pages says their bots read anyone else's file. Some guides promise the file earns "priority" in AI answers. No vendor documents any such status, and an [SE Ranking study](https://seranking.com/blog/llms-txt/) of about 300,000 domains found no link between having the file and AI citations.

### What server logs show

In the Ahrefs study, only 3% of files were fetched at all. Among those, AI search crawlers such as OAI-SearchBot and PerplexityBot made just 233 requests, 1.1% of the total. Slackbot's link previews fetched the files more often than PerplexityBot did.

A smaller study by [EZY Research](https://www.ezy.ai/research/do-ai-bots-read-llms-txt), a vendor, watched 83 sites for 12 weeks from 27 April 2026:

| Crawler | robots.txt fetches | llms.txt fetches |
| --- | --- | --- |
| OpenAI (GPT family) | 3,990 | 7 |
| Anthropic (ClaudeBot) | 3,120 | 9 |
| PerplexityBot | 775 | 0 |
| Googlebot | 5,125 | 67 |
| Meta-ExternalAgent | 172 | 193 |

Crawlers that fetch robots.txt hundreds or thousands of times barely touch llms.txt. Meta's was the one exception.

### Where the file does get read

The readers are agents. In Ahrefs' data, Claude-Code out-fetched every AI search bot, assistant and training crawler except GPTBot and one agent-infrastructure crawler. Docs platforms such as [Mintlify](https://www.mintlify.com/docs/ai/llmstxt) generate the file for every site they host.

Ahrefs also saw zero AI bot requests for llms.txt files that didn't exist: "Agents fetch llms.txt when directed, not speculatively." A file nobody links to is unlikely to be read.

## How AI Crawlers Read Markdown Compared With HTML

None of the AI vendors' crawler docs describe how they parse Markdown. Crawlers download the raw response and read what's in it.

### What a crawler gets from an HTML page

AI crawlers don't run your JavaScript. A December 2024 [Vercel and MERJ study](https://vercel.com/blog/the-rise-of-the-ai-crawler) found that "none of the major AI crawlers currently render JavaScript," including OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot and PerplexityBot. Content that appears only after scripts run is invisible to them. That's why [server-side rendering](/glossary/server-side-rendering) matters more than any text file.

Raw HTML also carries menus, scripts and footers a model doesn't need. Cloudflare measured one of its blog posts at [16,180 tokens as HTML and 3,150 as Markdown](https://blog.cloudflare.com/markdown-for-agents/), an 80% cut. [Vercel reported](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation) a page falling from about 500 KB of HTML to 3 KB of Markdown.

### What a crawler gets from a Markdown file

To a search crawler, llms.txt is a text file. The `#` marks and link brackets are just characters. Google lists plain text among the [file types it can index](https://developers.google.com/search/docs/crawling-indexing/indexable-file-types), but says it can generally only [follow links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) written as HTML `<a>` elements with an `href`. So the links inside your llms.txt are not a dependable way to get pages discovered. That's the sitemap's job.

Google's John Mueller made the same point about serving Markdown to AI bots. "Are you sure they can even recognize MD on a website as anything other than a text file?" he [asked](https://www.searchenginejournal.com/googles-mueller-calls-markdown-for-bots-idea-a-stupid-idea/566598/). "Can they parse & follow the links?"

### Where Markdown wins: agents that ask for it

Agents are different. Many request Markdown through content negotiation: the client lists the formats it prefers in an `Accept` header. [Cloudflare says](https://blog.cloudflare.com/markdown-for-agents/) coding agents such as Claude Code and OpenCode send `Accept: text/markdown`, and Vercel now serves Markdown from the same URL when they do.

This is where llms.txt earns its keep: an agent gets a map, follows two or three links, and reads clean text instead of a heavy page. The Markdown must say the same thing as the HTML: a version only bots see is a different page.

## The Four-Layer LLM Indexing Stack

"Getting indexed by LLMs" is really four jobs. We call them the Four-Layer LLM Indexing Stack. Each layer depends on the one below it, so fix them from the bottom up.

| Layer | The job | What controls it | Who documents it | How to check it |
| --- | --- | --- | --- | --- |
| 1. Access | Let AI search crawlers fetch your pages | robots.txt, CDN and firewall rules | OpenAI, Anthropic, Perplexity | Robots tester, server logs |
| 2. Discovery | Tell engines which URLs exist and changed | XML sitemap, IndexNow, internal links | Bing, IndexNow members | Bing Webmaster Tools, IndexNow responses |
| 3. Rendering | Put the words in the first HTML response | Server-side or static rendering | Vercel crawler study | Fetch the page, search for a sentence |
| 4. Guidance | Give agents a short map and clean text | llms.txt, Markdown copies, Link headers | llmstxt.org proposal | Lighthouse, parser, logs |

**Layer 1, access.** Each engine names the crawler that builds its search index. OpenAI says sites that block OAI-SearchBot "will not be shown in ChatGPT search answers," and that robots.txt changes take about 24 hours to apply. Anthropic says blocking Claude-SearchBot [stops it indexing your content](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) for search. Perplexity recommends allowing [PerplexityBot](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) and its published IP ranges. Our [AI robots.txt generator](/tools/ai-robots-txt-generator) writes the rules.

**Layer 2, discovery.** ChatGPT search "sometimes partners with other search providers," and OpenAI's [help page](https://help.openai.com/en/articles/9237897-chatgpt-search) links Microsoft's privacy statement, so being in Bing's index matters. Bing reads your sitemap, and [IndexNow](/glossary/indexnow) tells it when a URL changes. The [IndexNow members list](https://www.indexnow.org/searchengines.json) names Bing, Yandex, Seznam, Naver, Yep, the Internet Archive and Amazonbot. Neither OpenAI nor Perplexity is on it.

**Layer 3, rendering.** If a page's key facts appear only after JavaScript runs, layers 1 and 2 deliver an empty shell. Server-render or pre-render anything you want quoted.

**Layer 4, guidance.** This is where llms.txt lives: the cheapest layer and the least proven. For layers 1 to 3 across two engines, see our guide to [optimizing for ChatGPT and Perplexity](/blog/optimize-website-for-chatgpt-and-perplexity).

## The llms.txt Spec, Part by Part

Here is the v2 format, dated August 2026, in file order.

### Where the file lives

Put it at `/llms.txt` on your domain. The spec also allows subpaths, such as `/docs/llms.txt`, and says a file "covers the URLs under its path." When more than one file applies, agents should use the most specific one.

### The five parts, in order

1. **An optional byte-order mark.** You can leave it out.
2. **An H1 with the name of the project or site.** "This is the only required section."
3. **A blockquote summary.** A short description with the key facts needed to understand the rest of the file.
4. **Details.** Zero or more Markdown sections "of any type except headings": paragraphs, lists, notes on how to read the links.
5. **File lists under H2 headings.** Each item is a Markdown link, then optionally a colon and a note: `- [Pricing](https://plannora.io/pricing.md): plans and limits`.

Anthropic's [developer llms.txt](https://platform.claude.com/llms.txt) skips the blockquote and opens with a plain paragraph, which the spec allows.

### The Optional section

An H2 titled `Optional` holds secondary links "an agent can skip when a shorter context is needed." In the first version it had a special meaning: the spec's own context tool left those links out. The [v2 changes](https://llmstxt.org/changes.html) removed that mechanical meaning. It's now just a useful convention.

### Markdown copies and link relations

The spec suggests a clean Markdown copy of each important page at the same URL, with `.md` added (`page.html.md`) or swapped in for the extension (`page.md`). Links in llms.txt should point to those copies when they exist. Version 2 adds a way to find them: a page can carry `rel="alternate" type="text/markdown"` for its Markdown copy and `rel="describedby"` for the llms.txt that covers it, as `<link>` tags or one HTTP header:

```http
Link: </pricing.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"
```

### What about llms-full.txt?

llms-full.txt is not in the spec. Mintlify says it [developed the format with Anthropic](https://www.mintlify.com/blog/the-value-of-llms-txt-hype-or-real): a whole docs site joined into one Markdown file. On 28 September 2026, OpenAI's developer llms-full.txt was 7.6 MB, Perplexity's 4.4 MB and Anthropic's 38.6 MB. At OpenAI's rule of thumb of [about 4 characters per token](https://developers.openai.com/api/docs/concepts), Anthropic's file is roughly 9.6 million tokens. The spec itself says context windows are "still too small for most websites in their entirety," so a file that size gets searched or read in pieces, not loaded whole. Build one only if you run a docs site.

## Tutorial: Write Plannora's llms.txt Step by Step

Plannora is a fictional project management app at plannora.io, with a made-up rival, Loopcraft. Here is how its team would write the file.

1. **Pick 10 to 30 pages.** Choose what an agent needs to answer questions about you: pricing, features, security, integrations, docs and comparisons.
2. **Write the H1 and summary.** The blockquote should say what you are, who it's for and how pricing works, in one or two sentences an agent can quote.
3. **Add a short details paragraph.** Tell the agent which link answers which kind of question. Don't write instructions to the model.
4. **Group links under H2s.** Name sections after the questions people ask: Product, Docs, Compare.
5. **Write a note for every link.** Say what's on the page, not why it's great.
6. **Move extras to Optional.** Changelogs and blogs are useful, but skippable.

The finished file:

```markdown
# Plannora

> Plannora is project management software for teams of 5 to 50 people: boards, timelines and automations. The free plan covers up to 5 users; paid plans are billed per user, in US dollars.

The linked pages are the source of truth for prices and limits. Each link points to a Markdown copy of the page. For API questions, start with the API reference. For buying questions, start with Pricing and Security.

## Product

- [Pricing](https://plannora.io/pricing.md): plans, per-user prices, limits and what the free plan includes
- [Features](https://plannora.io/features.md): boards, timelines, automations and reports, one section each
- [Security](https://plannora.io/security.md): SSO, data residency and audit logs
- [Integrations](https://plannora.io/integrations.md): Slack, Google Workspace, GitHub and Zapier, with setup notes

## Docs

- [Getting started](https://plannora.io/docs/start.md): create a workspace, invite a team, import a CSV
- [API reference](https://plannora.io/docs/api.md): REST endpoints, authentication, rate limits and webhooks
- [Import from Loopcraft](https://plannora.io/docs/import-loopcraft.md): field mapping and what doesn't carry over

## Compare

- [Plannora vs Loopcraft](https://plannora.io/compare/loopcraft.md): features and prices side by side

## Optional

- [Changelog](https://plannora.io/changelog.md): release notes, newest first
- [Blog](https://plannora.io/blog.md): guides to planning and team workflows
```

What each part is doing:

| Part | Spec rule | Why Plannora wrote it this way |
| --- | --- | --- |
| `# Plannora` | H1, the only required part | Lighthouse flags a file without one |
| `> Plannora is...` | Blockquote summary | The facts an agent needs before opening any link: what, who for, how it's priced |
| Plain paragraph | Details, any Markdown except headings | Routes each kind of question to the right link |
| `## Product`, `## Docs`, `## Compare` | H2 file lists | Grouped by the questions buyers and developers ask |
| `- [Pricing](...): plans...` | Link, colon, note | Absolute `.md` URLs, so the file works when read away from the site |
| `## Optional` | Convention | Changelog and blog can be skipped when space is short |

The file is 1,467 bytes with 10 links: about 370 tokens at 4 characters per token, easy to read in one request. If you don't serve Markdown copies, link your normal page URLs. Our free [llms.txt generator](/tools/llms-txt-generator) builds the same structure from a form and warns you about a missing H1, relative links and links without notes.

Keep the file dull on purpose. Ahrefs spotted a research bot named `prompt-injection-survey` among the requesters, and advises treating llms.txt like code: version-control it, limit who can edit it, and keep it to plain links and descriptions.

## How to Serve llms.txt at Your Domain Root

The spec is silent on Content-Type, caching and redirects, and a correct file served badly is a broken file. Aim for this:

| Check | Target | Why |
| --- | --- | --- |
| Status | 200 at `https://yourdomain.com/llms.txt` | Lighthouse fails 5xx errors and treats 4xx as "not applicable" |
| Content-Type | `text/plain; charset=utf-8` or `text/markdown; charset=utf-8` | On 28 September 2026, llmstxt.org, OpenAI, Anthropic and Perplexity served plain text; Stripe served Markdown. Never `text/html` |
| Redirects | None, or one hop to your main host | Fewer hops, fewer failures |
| X-Robots-Tag | `noindex` (optional) | Mueller said noindex [could make sense](https://www.searchenginejournal.com/google-says-it-could-make-sense-to-use-noindex-header-with-llms-txt/551744/) so the file stays out of search results |
| Cache-Control | Short, such as `max-age=3600` | Edits show up within an hour |

`text/markdown` is a registered type under [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763). Either type works. HTML doesn't.

### Static hosting on Nginx or Apache

Upload llms.txt to your web root. By default Nginx serves `.txt` as `text/plain` with no charset and has no mapping for `.md`. This fixes both:

```nginx
location = /llms.txt {
    charset utf-8;
    add_header X-Robots-Tag "noindex" always;
    add_header Cache-Control "public, max-age=3600" always;
}
location ~ \.md$ {
    types { }
    default_type text/markdown;
    charset utf-8;
    charset_types text/markdown;
}
```

One gotcha: an `add_header` inside a location cancels the server block's `add_header` lines, so repeat any security headers there. On Apache, `AddType text/markdown .md`, `AddCharset utf-8 .txt .md` and a `Header set` line inside `<Files "llms.txt">` do the same job.

### Next.js on Vercel

The simplest route is a static file: save it as `public/llms.txt` and Next.js serves it at `/llms.txt`. Vercel checks [the filesystem before rewrites](https://vercel.com/docs/project-configuration/vercel-json), so a catch-all rewrite won't swallow a real file. Set headers with `headers()` in `next.config.js`.

To build the file from your CMS, use a Route Handler. Next.js supports [non-UI responses](https://nextjs.org/docs/app/api-reference/file-conventions/route) at paths like `app/rss.xml/route.ts`, and the same works for llms.txt:

```ts
// app/llms.txt/route.ts
export const dynamic = "force-static"; // build once, serve from the CDN

export async function GET() {
  const pages = await getKeyPages(); // your CMS query: [{ title, url, note }]
  const links = pages.map((p) => `- [${p.title}](${p.url}): ${p.note}`);
  const body = ["# Plannora", "", "> Project management software for small teams.", "", "## Product", "", ...links];
  return new Response(body.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
```

Route Handlers aren't cached by default, hence the `dynamic` line. With Cache Components turned on, that option is gone: remove it and move the CMS query into a function marked `'use cache'`.

### WordPress

Upload the file to the folder where WordPress is installed. WordPress's standard rewrite rules only hand requests to `index.php` when [no real file matches](https://developer.wordpress.org/advanced-administration/server/web-server/httpd/), so the file is served as is.

Or let a plugin write it. Yoast SEO's free llms.txt feature sits under Settings, then Site features, then AI tools. Per [Yoast's spec](https://developer.yoast.com/features/llms-txt/functional-specification/), it writes a real file to your site root and refreshes it weekly. By default it lists your 5 most recently updated posts and pages from the last 12 months, cornerstone content first, so switch to manual page selection. Yoast won't overwrite an existing file and doesn't support multisite. AIOSEO has a generator too. Run one tool, not two.

### Shopify

Every Shopify store already serves `/llms.txt`. Per Shopify's [28 May 2026 changelog](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd), the default mirrors the store's `/agents.md`, a document for shopping agents that lists commerce and MCP endpoints and store policies, not a curated page list.

To publish your own, go to Online Store, then Themes, then Edit code, and add `templates/llms.txt.liquid`. Shopify uses that template first, then `agents.md.liquid`, then its default. The [template docs](https://shopify.dev/docs/storefronts/themes/architecture/templates/llms-txt-liquid) note two limits: only the `request` and `agents` objects are available, so you write page links by hand, and the file is served on the bare primary domain with no Markets or language prefix.

### Cloudflare

On Cloudflare Pages or Workers with static assets, put llms.txt in your build output folder. Wrangler sets the Content-Type from the file extension. Add headers with a `_headers` file in the same folder:

```text
/llms.txt
  X-Robots-Tag: noindex
  Cache-Control: public, max-age=3600
```

Two catches. `_headers` rules don't apply to responses your Worker code generates. And a single-page app deployed with `not_found_handling = "single-page-application"` answers any missing file with [/index.html and a 200 status](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/). Delete your llms.txt and bots get your homepage's HTML with a success code.

If your site runs elsewhere behind Cloudflare, a small Worker on the route `plannora.io/llms.txt` can serve the file from the edge. Cloudflare's Markdown for Agents (in beta, Pro plans and up) converts HTML pages for agents that ask, but doesn't write llms.txt.

Whatever the stack, serve the file on the host your pages use and redirect the other host in a single 301. Don't redirect `/llms.txt` to an HTML page about AI: a client that expects Markdown gets markup.

## Validate the File and Check Your Logs

### Run the llms.txt serve check

These four commands catch most failures:

```bash
# 1. Status, type, redirect count and final URL
curl -sL -o /dev/null -w "%{http_code} | %{content_type} | redirects=%{num_redirects} | %{url_effective}\n" https://www.plannora.io/llms.txt
# 2. The first line should be the H1
curl -sL https://plannora.io/llms.txt | head -1
# 3. A missing file must return 404, not your homepage
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://plannora.io/llms-missing.txt
# 4. Every link in the file should answer 200
curl -s https://plannora.io/llms.txt | grep -oE '\]\(https?://[^)]+' | cut -c3- | while read u; do echo "$(curl -s -o /dev/null -w '%{http_code}' "$u") $u"; done
```

Plannora's first run, with illustrative results:

| Check | Plannora's result | Verdict and fix |
| --- | --- | --- |
| 1. Status and type | `200 \| text/plain; charset=utf-8 \| redirects=1` | Pass: one hop from www to the main host |
| 2. First line | `# Plannora` | Pass |
| 3. Missing file | `200 text/html` | Fail: a catch-all rewrite serves the homepage. Limit it to page routes so missing files return 404 |
| 4. Links | 8 of 10 return 200; `changelog.md` and `blog.md` return 404 | Fail: generate those two Markdown copies, or link the HTML pages |

Two of four checks failed, and neither shows up when you open `/llms.txt` in a browser.

### Run Lighthouse's llms.txt audit

Lighthouse 13.3.0 added an Agentic Browsing category to its default config in [May 2026](https://github.com/GoogleChrome/lighthouse/blob/main/changelog.md). Run it from Chrome DevTools, or from a terminal:

```bash
npx lighthouse https://plannora.io --only-categories=agentic-browsing
```

The [audit's source code](https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/agentic/llms-txt.js) shows what it checks. It fetches `/llms.txt` on the tested page's origin, after redirects. A 5xx fails and a 4xx marks the audit "not applicable." Otherwise it passes if the file has a line starting `# `, at least one Markdown link and 50 or more characters. That's a floor, not a quality score.

### Parse it and ask an agent

The spec's authors publish a Python parser that shows whether your title and sections come out as meant:

```bash
pip install llms-txt
curl -s https://plannora.io/llms.txt | python3 -c "import sys; from llms_txt import parse_llms_file; f = parse_llms_file(sys.stdin.read()); print(f.title, list(f.sections))"
```

Plannora's file prints `Plannora ['Product', 'Docs', 'Compare', 'Optional']`. Then run the test the spec recommends: give an agent only your llms.txt and ask it questions about your product. If it can't find your pricing or your API limits, fix the notes. Our [AI search readiness check](/tools/ai-search-readiness-check) also fetches your llms.txt, alongside robots.txt and the page itself.

### Check your logs for who fetched it

User agents are easy to fake, so this script checks each requester's IP against the ranges OpenAI, Anthropic and Perplexity publish. It reads logs in the common "combined" format. Download the lists first:

```bash
mkdir -p ips
for f in gptbot searchbot chatgpt-user; do curl -s "https://openai.com/$f.json" -o "ips/$f.json"; done
curl -s https://claude.com/crawling/bots.json -o ips/claude.json
for f in perplexitybot perplexity-user; do curl -sL "https://www.perplexity.com/$f.json" -o "ips/$f.json"; done
```

```python
# llms_log_check.py. Usage: python3 llms_log_check.py access.log ips/*.json
import sys, re, json, ipaddress
from collections import Counter

nets = [ipaddress.ip_network(p.get("ipv4Prefix") or p.get("ipv6Prefix"))
        for f in sys.argv[2:] for p in json.load(open(f))["prefixes"]]
hit = re.compile(r'^(\S+) .*"GET (/llms(?:-full)?\.txt)\S* [^"]*" (\d{3}) .*"([^"]*)"$')
tally = Counter()
for line in open(sys.argv[1], errors="ignore"):
    m = hit.match(line.strip())
    if m:
        ip, path, status, ua = m.groups()
        bot = ua.split("compatible; ")[-1].split(";")[0][:40]
        listed = any(ipaddress.ip_address(ip) in n for n in nets)
        tally[(path, status, "listed" if listed else "-", bot)] += 1
for (path, status, listed, bot), n in tally.most_common(20):
    print(f"{n:5}  {path:14} {status}  {listed:6}  {bot}")
```

"Listed" means the IP is on one of those vendors' published lists. A GPTBot or PerplexityBot line marked "-" came from somewhere else, so treat it as an impostor. SEO tools and link-preview bots will always show "-", and coding agents may too.

An illustrative 30-day tally for Plannora:

| Requester | Requests | On a vendor IP list |
| --- | --- | --- |
| SEO and audit tools | 61 | No list |
| Unidentified scripts | 38 | No list |
| GPTBot | 24 | 22 of 24 |
| Claude-Code | 17 | No list |
| Googlebot | 11 | Check [Google's own ranges](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests) |
| People in browsers | 9 | No list |
| Slackbot | 6 | No list |
| OAI-SearchBot | 3 | 3 of 3 |
| PerplexityBot | 1 | 1 of 1 |
| **Total** | **170** | |

AI search crawlers made 4 of 170 requests, about 2.4%. Two "GPTBot" requests came from unlisted IPs, so treat them as fakes. SEO tools on top and search crawlers near the bottom is the same pattern Ahrefs saw, and it's the honest baseline to expect.

A fetch shows a bot downloaded the file, not that any answer used it. To see whether AI answers name or cite you, run a fixed prompt panel, as our guide to [measuring GEO](/blog/how-to-measure-geo) explains. If you'd rather skip the terminal, the free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) reads a day of logs in your browser and shows which pages each AI bot fetched.

## Where Rankbox Helps, and Where It Doesn't

Rankbox's free tools cover the file itself. The llms.txt generator writes the structure in this guide, and the readiness check confirms the file is live.

The product works on the pages your llms.txt points to. The [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that answer the questions your buyers ask AI. Rankbox doesn't create, host or manage llms.txt files for you, and it doesn't track AI citations today. Plans are on the [pricing page](/pricing).

## Frequently Asked Questions

### Will an llms.txt file help your SEO?

No, not for Google rankings. Google says Search ignores llms.txt and that the file "will neither harm nor help" your visibility. No study shows it lifts AI citations either: SE Ranking found no link across about 300,000 domains. It can help coding agents and docs tools read your site, so treat it as a cheap, harmless extra after crawler access, sitemaps and server-rendered pages.

### Does ChatGPT use llms.txt?

OpenAI hasn't said ChatGPT reads other sites' llms.txt files, though it publishes one for its developer docs. In EZY Research's 12-week sample, OpenAI's crawlers fetched llms.txt 7 times against 3,990 robots.txt fetches. To appear in ChatGPT search, allow OAI-SearchBot, server-render key content, and make sure Bing can index you. See our [ChatGPT SEO guide](/ai-seo/chatgpt).

### Do I need an llms-full.txt file?

Only if you run a documentation site that agents load in bulk. llms-full.txt joins all your docs into one Markdown file. It isn't part of the llmstxt.org spec, and docs platforms such as Mintlify generate it for you. For a marketing site, a good llms.txt is enough.

### Where should the llms.txt file go?

Put it at the root of your main host, such as `https://yourdomain.com/llms.txt`. The spec also allows subfolders: `/docs/llms.txt` covers only that folder. Each subdomain needs its own file, served with a 200 status and a plain text or Markdown Content-Type.

### Should I noindex or block llms.txt?

Don't block it in robots.txt: that tells well-behaved bots to stay away, and a crawler that can't fetch the file can't see a noindex header. The header is optional. Google's John Mueller said noindex "could make sense," because linked files can otherwise appear in search results.

### Can I submit llms.txt to AI search engines?

No. As of September 2026, no AI search engine documents a way to submit an llms.txt file. Ahrefs found agents fetch the file "when directed, not speculatively," so link to it from your docs and footer and add a `Link` header. For indexing, submit your sitemap to Bing Webmaster Tools and use IndexNow.

## References

1. [The /llms.txt file, v2, llmstxt.org](https://llmstxt.org/)
2. [Changes since v1, llmstxt.org](https://llmstxt.org/changes.html)
3. [Optimizing your website for generative AI features, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
4. [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read, Ahrefs](https://ahrefs.com/blog/llmstxt-study/)
5. [LLMs.txt: why brands rely on it and why it doesn't work, SE Ranking](https://seranking.com/blog/llms-txt/)
6. [We put llms.txt on 83 websites, EZY Research](https://www.ezy.ai/research/do-ai-bots-read-llms-txt)
7. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
8. [Does Anthropic crawl data from the web?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
9. [Perplexity crawlers, Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
10. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
11. [Introducing Markdown for Agents, Cloudflare](https://blog.cloudflare.com/markdown-for-agents/)
12. [Making agent-friendly pages with content negotiation, Vercel](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation)
13. [Lighthouse llms-txt audit source, GoogleChrome on GitHub](https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/agentic/llms-txt.js)
14. [Customize /llms.txt, /llms-full.txt and /agents.md, Shopify](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd)
15. [llms.txt.liquid, Shopify](https://shopify.dev/docs/storefronts/themes/architecture/templates/llms-txt-liquid)
16. [llms.txt, Mintlify documentation](https://www.mintlify.com/docs/ai/llmstxt)
