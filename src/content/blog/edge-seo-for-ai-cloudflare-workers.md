---
title: Edge SEO for AI: Dynamic Rendering & Header Injection via Cloudflare Workers
description: Edge SEO for AI with Cloudflare Workers: inject headers, fix canonicals and serve the same page as Markdown to agents that ask, without cloaking.
keyword: edge SEO for AI
date: 2026-11-02
updated: 2026-11-02
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, AI Search
---

Edge SEO for AI means using code at your CDN, such as a Cloudflare Worker, to change what AI crawlers and agents receive without rebuilding your site. The worker can add headers, fix redirects and canonicals, and hand a clean Markdown copy of a page to any client that asks for one. The rule that keeps it safe is short: give bots the same content in a cleaner format, never different content.

Edge SEO is older than the AI use. Dan Taylor, who [says he was credited with coining the term](https://searchengineland.com/edge-seo-447510) at TechSEO Boost in 2018, defines it as shipping technical SEO fixes "through a serverless application, such as Cloudflare Workers, deployed on a CDN." What changed in 2026 is who fetches the page. Agent tools now ask for Markdown by name, and the savings are large: [Roots measured](https://roots.io/some-seo-plugins-claim-markdown-for-ai-but-ignore-the-accept-header/) one WordPress.org docs page at 271,268 bytes as HTML and 44,841 bytes as Markdown.

This guide covers edge SEO for AI end to end: Google's cloaking line, what AI vendors document, a Cloudflare Worker printed in full and run locally, the headers to inject, when Cloudflare's built-in feature replaces the code, and how to test and roll back. New to the topic? Start with our [plain definition of edge SEO](/blog/what-is-edge-seo) or the [practical guide to SEO changes at the CDN](/blog/edge-seo).

## Key Takeaways

- Edge SEO for AI is a format change, not a content change. Google says Googlebot won't treat dynamic rendering as cloaking "as long as your dynamic rendering produces similar content."
- Serve Markdown only to clients that name `text/markdown` in their `Accept` header. Every other client gets the HTML.
- OpenAI, Anthropic and Perplexity document no `Accept` header for their crawlers as of 1 October 2026. The evidence for Markdown requests comes from agent tools such as Claude Code.
- Cloudflare's Markdown for Agents does the conversion with no code on Pro, Business and Enterprise plans at no extra cost. A Worker earns its place on the Free plan, for `.md` URLs, or when you need control.
- Every negotiated response needs `Vary: Accept`. Cloudflare's CDN ignores most `Vary` values by default, so convert after the cache lookup.
- The Worker in this post ran under wrangler 4.146.0: 15 request types behaved as designed, and the sample page's Markdown came out 61.6% smaller than its HTML.
- Every edge SEO for AI change should pass the Same-Page Parity Test: status, canonical, headings, numbers, links and freshness must match across formats.

## What Edge SEO for AI Changes at the CDN

A CDN worker sits between the visitor and your origin server. It reads the request, fetches the page, and can change the response before anyone sees it. Classic edge SEO uses that spot for five jobs, and Google documents a form of each.

| Edit           | What the worker does                                              | What Google documents                                                                                                                                         |
| -------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Redirects      | Answers old URLs with a 301 or 308 before the origin is hit       | Google [recommends](https://developers.google.com/search/docs/crawling-indexing/301-redirects) "a permanent server-side redirect whenever possible"           |
| Robots headers | Adds `X-Robots-Tag: noindex` to PDFs, staging hosts or thin pages | Any robots meta rule ["can also be specified as an X-Robots-Tag"](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)                |
| Canonicals     | Sends `Link: <url>; rel="canonical"` as a header                  | [Supported](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) for web search, including non-HTML files                  |
| Hreflang       | Adds `Link` headers or `<link>` tags for language versions        | HTML, headers and sitemaps are ["equivalent from Google's perspective"](https://developers.google.com/search/docs/specialty/international/localized-versions) |
| HTML rewrites  | Fixes titles, injects JSON-LD, removes stray `noindex` tags       | The same rules as any server-rendered HTML                                                                                                                    |

Our [practical edge SEO guide](/blog/edge-seo) walks through those jobs platform by platform. The rest of this post is the AI layer on top.

### Why edge SEO for AI is worth the effort

1. **Many AI crawlers read raw HTML.** In December 2024, Vercel and MERJ reported that ["none of the major AI crawlers currently render JavaScript,"](https://vercel.com/blog/the-rise-of-the-ai-crawler) naming bots from OpenAI, Anthropic, Meta, ByteDance and Perplexity. Googlebot does render. Our guide to [dynamic rendering and prerendering for AI crawlers](/blog/dynamic-rendering-prerendering-ai-crawlers) covers client-rendered pages.
2. **Agents pay per token.** Menus, scripts and footers fill an agent's context window and answer nothing.
3. **Agents can say what they want.** Some agent tools send an `Accept` header that lists Markdown first, which turns the job into ordinary HTTP content negotiation.

## Edge SEO for AI Without Cloaking: Where Google Draws the Line

Anything that serves bots a different response from people sits next to Google's cloaking rule. Start with Google's own words.

### What Google's pages say, word for word

Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies#cloaking) (updated 28 August 2026) define cloaking as "presenting different content to users and search engines with the intent to manipulate search rankings and mislead users." One example is "inserting text or keywords into a page only when the user agent that is requesting the page is a search engine, not a human visitor."

Google's page on [dynamic rendering](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering) (updated 10 December 2025) covers the format case: "Googlebot generally doesn't consider dynamic rendering as cloaking. As long as your dynamic rendering produces similar content, Googlebot won't view dynamic rendering as cloaking." Serving "completely different content to users and crawlers can be considered cloaking," such as "a page about cats to users and a page about dogs to crawlers." The same page calls dynamic rendering "a workaround and not a long-term solution." Serving Markdown on request is a close cousin: one URL, a second rendering for a different client. Our post on [dynamic rendering SEO](/blog/dynamic-rendering-seo) covers Google's history with the technique.

So the line is plain. The same facts and content in a different format is acceptable. Different content for bots is cloaking. A Markdown copy that drops your menu is a format change. A Markdown copy that adds claims, keywords or prices the HTML doesn't show is cloaking, whoever receives it.

Google's rules govern Google Search, and the crawler pages from OpenAI, Anthropic and Perplexity set out no cloaking rule of their own. The same test still protects you: an answer engine that quotes your Markdown should quote what a buyer reads on the page.

Two more points from Google matter. Its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says you don't need "Markdown to appear in Google Search (including its generative AI capabilities), as Google Search itself doesn't use them." And when a developer served Markdown to GPTBot and ClaudeBot by user agent, John Mueller [pushed back](https://www.searchenginejournal.com/googles-mueller-calls-markdown-for-bots-idea-a-stupid-idea/566598/) in February 2026: "it seems very different to serve it a text file when they're looking for a HTML page."

### What AI vendors document about their requests

Before you build edge SEO for AI around a bot, check what its vendor says it sends.

| Client                                   | What is documented about format                                                       | Where                                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GPTBot, OAI-SearchBot, ChatGPT-User      | User agents and IP lists; no `Accept` header                                          | [OpenAI crawler docs](https://developers.openai.com/api/docs/bots)                                                                                       |
| ClaudeBot, Claude-SearchBot, Claude-User | Bot purposes and robots.txt; no `Accept` header                                       | [Anthropic help center](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| PerplexityBot, Perplexity-User           | User agents, IP lists, firewall tips; no `Accept` header                              | [Perplexity docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)                                                                         |
| Claude Code's web fetch                  | Roots logged `Accept: text/markdown, text/html, */*` under a `Claude-User` user agent | [Roots](https://roots.io/some-seo-plugins-claim-markdown-for-ai-but-ignore-the-accept-header/), 14 April 2026                                            |
| Claude Code and OpenCode                 | Cloudflare says both "send these accept headers"                                      | [Cloudflare blog](https://blog.cloudflare.com/markdown-for-agents/)                                                                                      |

All rows checked on 1 October 2026. Our [AI crawler directory](/blog/ai-crawler-directory) has the full user-agent list.

### Why content negotiation beats user-agent sniffing

Matching user agents to decide who gets Markdown has three flaws. Crawler vendors don't say their bots want Markdown, so you'd be guessing. Every new bot needs a new rule. And `Vary: User-Agent` splits your cache into a copy per browser version. Content negotiation flips it around: the client states the formats it accepts, weighted by `q` values under [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), and the server answers. A crawler that asks for HTML gets HTML, which settles Mueller's objection. So this edge SEO for AI pattern starts from the header, and user-agent matching stays an off-by-default fallback for a client whose vendor documents that it reads Markdown without the header.

## Cloudflare Workers and HTMLRewriter: The Edge SEO for AI Toolkit

A Worker is a JavaScript function that Cloudflare runs on a route you choose, such as `tallyfold.example/pricing*`. It receives each request, calls `fetch()` to reach your cache or origin, and returns a response. Cloudflare says Workers [run before the cache](https://developers.cloudflare.com/workers/reference/how-the-cache-works/), so a Worker can shape every response without the origin knowing.

`HTMLRewriter` is the Workers API for editing HTML as it streams. You attach handlers to CSS-style selectors with `.on()`. An element handler can read and set attributes, insert content around a tag, or call `onEndTag()` when the element closes. A text handler receives the text inside it. Cloudflare's [HTMLRewriter docs](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) flag two details that bite:

- **Text arrives in chunks.** One text node "can be represented by multiple chunks," so join them before matching on text.
- **A thrown error stops the parse.** If a handler throws, "parsing is immediately halted," and a response already streaming arrives cut short.

A third detail showed up when the Worker below ran: text chunks keep their HTML entities, so `&amp;` stays `&amp;` until you decode it.

As of 1 October 2026, [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) gives the Free plan 100,000 requests a day with 10 ms of CPU time per request. The Paid plan starts at $5 a month with 10 million requests and 30 million CPU milliseconds included, then $0.30 per extra million requests. Watch the 10 ms Free limit: converting a big page costs far more CPU than adding a header.

![Cloudflare Workers Explained](youtube:WDhruDqb5nM "Cloudflare Developers explain how Workers run code on Cloudflare's network, compared with a traditional Node.js server (June 2026).")

## Edge SEO for AI in Practice: A Markdown Worker

The Worker below serves the same page as Markdown when a client asks for it. It does four things:

1. Reads the `Accept` header. Markdown goes out only when the client names `text/markdown` and weights it at least as high as `text/html`.
2. Fetches the normal HTML page from the cache or origin, so the cache only ever holds HTML.
3. Converts the main content with HTMLRewriter: headings, paragraphs, list items and links, minus scripts, menus and forms.
4. Adds headers: `Vary: Accept` on both formats, a `Link` to the Markdown copy on HTML pages, and a canonical `Link` on the Markdown.

It also answers `/pricing.md` style URLs, which llms.txt files often point to. Skip that branch if your origin already serves real `.md` files. Set `ROOT` to the element that wraps your content.

```js
// Same page, cleaner format: serve Markdown when a client asks for it.
const ROOT = "main"; // the element that wraps your page content
const BLOCKS = { h1: "# ", h2: "## ", h3: "### ", p: "", li: "- " };
const SKIP = ["script", "style", "nav", "noscript", "svg", "form"];
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " " };
const isHtml = (res) => (res.headers.get("Content-Type") || "").includes("text/html");
const safeUrl = (href, base) => {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
};
// HTMLRewriter passes raw text, so entities such as &amp; arrive encoded.
const decode = (s) =>
  s.replace(/&(#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(Number(e.slice(1))) : (ENTITIES[e.toLowerCase()] ?? m),
  );

// The weight (q-value, RFC 9110) a client gives a media type; 0 = not acceptable.
function quality(accept, type, useWildcards) {
  const weights = {};
  for (const part of accept.toLowerCase().split(",")) {
    const [range, ...params] = part.split(";").map((s) => s.trim());
    const q = params.find((p) => p.startsWith("q="));
    weights[range] = q ? Number(q.slice(2)) || 0 : 1;
  }
  if (!useWildcards) return weights[type] ?? 0;
  return weights[type] ?? weights[type.split("/")[0] + "/*"] ?? weights["*/*"] ?? 0;
}

function wantsMarkdown(request, env) {
  const accept = request.headers.get("Accept") || "";
  const md = quality(accept, "text/markdown", false); // must be named, not implied by */*
  if (md > 0) return md >= quality(accept, "text/html", true); // a tie goes to Markdown
  // Fallback, off by default: tokens for clients whose vendors document
  // that they read Markdown but don't send the Accept header.
  const tokens = (env.MARKDOWN_UA || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return tokens.some((t) => (request.headers.get("User-Agent") || "").includes(t));
}

async function toMarkdown(html, pageUrl) {
  const blocks = [];
  const meta = { title: "", canonical: pageUrl };
  let current = null;
  let skipDepth = 0;
  const open = (prefix) => {
    current = { prefix, text: "" };
    blocks.push(current);
  };
  const add = (s) => {
    if (!current) open("");
    current.text += s;
  };
  const rw = new HTMLRewriter()
    .on("head > title", {
      text(t) {
        meta.title += t.text;
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        meta.canonical = safeUrl(el.getAttribute("href"), pageUrl) || pageUrl;
      },
    })
    .on(ROOT, {
      text(t) {
        if (!skipDepth) add(t.text);
      },
    })
    .on(`${ROOT} a[href]`, {
      element(el) {
        const href = safeUrl(el.getAttribute("href"), meta.canonical);
        if (skipDepth || !href) return; // a broken link stays as plain text
        add("[");
        el.onEndTag(() => add(`](${href})`));
      },
    });
  for (const [tag, prefix] of Object.entries(BLOCKS)) {
    rw.on(`${ROOT} ${tag}`, {
      element(el) {
        if (skipDepth) return;
        open(prefix);
        el.onEndTag(() => {
          current = null;
        });
      },
    });
  }
  for (const tag of SKIP) {
    rw.on(`${ROOT} ${tag}`, {
      element(el) {
        skipDepth++;
        el.onEndTag(() => {
          skipDepth--;
        });
      },
    });
  }
  await rw
    .transform(new Response(html, { headers: { "Content-Type": "text/html" } }))
    .arrayBuffer();
  let body = "";
  let prev = null;
  for (const b of blocks) {
    const text = decode(b.text)
      .replace(/\s+/g, " ")
      .replace(/\[ /g, "[")
      .replace(/ \]/g, "]")
      .trim();
    if (!text) continue;
    if (body) body += b.prefix === "- " && prev === "- " ? "\n" : "\n\n";
    body += b.prefix + text;
    prev = b.prefix;
  }
  const front = `---\ntitle: ${JSON.stringify(decode(meta.title.trim()))}\ncanonical: ${meta.canonical}\n---\n\n`;
  return { markdown: front + body + "\n", canonical: meta.canonical };
}

export default {
  async fetch(request, env, ctx) {
    ctx.passThroughOnException(); // in production, an uncaught error falls through to the origin
    if (!["GET", "HEAD"].includes(request.method)) return fetch(request);
    const url = new URL(request.url);
    const isMdPath = url.pathname.endsWith(".md");
    const vary = env.MARKDOWN_UA ? "Accept, User-Agent" : "Accept";

    if (!isMdPath && !wantsMarkdown(request, env)) {
      const res = await fetch(request); // people and search engines: the HTML, untouched
      if (!isHtml(res)) return res;
      const out = new Response(res.body, res);
      const mdUrl = url.pathname === "/" ? "/index.md" : url.pathname.replace(/\/$/, "") + ".md";
      out.headers.append("Vary", vary);
      out.headers.append("Link", `<${mdUrl}>; rel="alternate"; type="text/markdown"`);
      return out;
    }

    // Fetch the normal HTML page, so the cache only ever stores HTML.
    const htmlUrl = new URL(url);
    if (isMdPath) htmlUrl.pathname = url.pathname === "/index.md" ? "/" : url.pathname.slice(0, -3);
    const headers = new Headers(request.headers);
    headers.set("Accept", "text/html");
    const res = await fetch(new Request(htmlUrl, { method: "GET", headers }));
    if (!res.ok || !isHtml(res)) return res;
    const html = await res.text();
    try {
      const { markdown, canonical } = await toMarkdown(html, htmlUrl.href);
      return new Response(request.method === "HEAD" ? null : markdown, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": res.headers.get("Cache-Control") || "public, max-age=300",
          Vary: vary,
          Link: `<${canonical}>; rel="canonical"`,
        },
      });
    } catch (err) {
      console.error("markdown conversion failed", htmlUrl.pathname, err);
      const fallback = new Response(request.method === "HEAD" ? null : html, res);
      fallback.headers.append("Vary", vary);
      return fallback; // same page, original format
    }
  },
};
```

The `wrangler.toml` scopes the Worker to HTML paths, so images and scripts skip it:

```toml
name = "tallyfold-edge-markdown"
main = "src/index.js"
compatibility_date = "2026-09-30"
routes = [
  { pattern = "tallyfold.example/pricing*", zone_name = "tallyfold.example" },
  { pattern = "tallyfold.example/docs/*", zone_name = "tallyfold.example" }
]
```

### How this Worker was tested

It ran under wrangler 4.146.0 in local mode (`wrangler dev --local --local-upstream 127.0.0.1:8799`) in front of a Python static server holding a fictional Tallyfold pricing page. `wrangler deploy --dry-run` also built it with the routes above. Nothing was deployed to a live zone.

| Request                                                         | What came back                                          |
| --------------------------------------------------------------- | ------------------------------------------------------- |
| Browser-style `Accept`, or `*/*`                                | HTML, plus `Vary: Accept` and a `Link` to `/pricing.md` |
| `Accept: text/markdown`, or `/pricing.md` with no header        | Markdown with a canonical `Link` header                 |
| `text/markdown, text/html, */*` (Claude Code's header)          | Markdown: equal weights tie, and ties go to Markdown    |
| `text/html, text/markdown;q=0.9`, or `text/markdown;q=0.5, */*` | HTML                                                    |
| robots.txt, a 404 page, a POST                                  | Passed through untouched                                |
| A page whose entity broke the decoder                           | The HTML, status 200                                    |
| `MARKDOWN_UA` set and a matching user agent                     | Markdown, with `Vary: Accept, User-Agent`               |

The sample page shrank from 2,185 bytes to 840. Untested: a live zone, the Free plan's 10 ms CPU limit, and very large pages. Locally, an uncaught error returned a 500 rather than reaching the origin, so the code catches conversion errors itself.

The converter is minimal on purpose. It flattens tables, ignores code blocks and decodes five named entities plus numeric ones. Table-heavy pages need Cloudflare's converter or build-time Markdown.

## Header Injection for AI Crawlers and Agents

Headers are the cheapest edge change, and most edge SEO for AI work is header work. Five earn their place:

| Header                                                       | Put it on                                       | Why                                                                                                                                                         |
| ------------------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Vary: Accept`                                               | Both formats of a negotiated URL                | Tells every cache the format depends on the request                                                                                                         |
| `Link: </pricing.md>; rel="alternate"; type="text/markdown"` | HTML pages                                      | Lets agents find the Markdown copy; the llms.txt proposal uses the same relation (see our [llms.txt guide](/blog/how-to-get-indexed-by-llms-with-llms-txt)) |
| `Link: <https://tallyfold.example/pricing>; rel="canonical"` | Markdown responses, above all `.md` URLs        | Points search engines at the HTML; Google asks for absolute URLs here                                                                                       |
| `X-Robots-Tag`                                               | PDFs, staging hosts, thin variants              | Any robots meta rule works as a header                                                                                                                      |
| `Content-Signal`                                             | Any response, if you use Cloudflare's framework | States your terms for AI training, search and AI input                                                                                                      |

Two cautions. Don't put `noindex` on a `.md` copy that already carries a canonical: Google [doesn't recommend](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) "using noindex to prevent selection of a canonical page within a single site." And skip `Vary: User-Agent` unless you really match user agents: Cloudflare's [Workers Cache](https://developers.cloudflare.com/workers/cache/) stores variants "per exact request-header value."

On `Content-Signal`, Cloudflare's converter adds `ai-train=yes, search=yes, ai-input=yes` when your origin sends no value, and keeps yours when you do. If you'd rather not offer pages for training, set the header at the origin before switching conversion on.

## When Cloudflare's Markdown for Agents Replaces the Code

Cloudflare ships the same idea as a switch, so on Pro and above, edge SEO for AI can be one toggle. [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) converts HTML to Markdown whenever a request lists `text/markdown` in its `Accept` header. Per its docs (updated 13 July 2026), responses carry `text/markdown`, `Vary: Accept`, token-count headers and YAML front matter, with navigation and scripts stripped and JSON-LD kept. It launched as a beta in February 2026; the current docs no longer use that word. It's available "to Pro, Business and Enterprise plans, and SSL for SaaS customers at no cost," under AI Crawl Control or per path with a Configuration Rule.

| Your situation                                               | Best fit                                                                                                                                       |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Pro or higher, and the default output looks right | Markdown for Agents; no code                                                                                                                   |
| Cloudflare Free plan                                         | A Worker like the one above                                                                                                                    |
| Your llms.txt links to `.md` URLs                            | A Worker, or static `.md` files from your build                                                                                                |
| You need to choose what's kept                               | A Worker, or Markdown generated at build time                                                                                                  |
| Pages over 2 MB of HTML                                      | Build-time Markdown; Cloudflare's converter handles origin responses up to 2 MB                                                                |
| Not on Cloudflare                                            | Your platform's middleware; Vercel [describes a Next.js version](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation) |

Cloudflare's converter does better on tables and structured data. The Worker's advantage is control over selectors, URLs and headers. Don't run both on one path, or you'll debug two converters at once.

## Testing Edge SEO for AI, Rolling It Back, and the Risks

### The Same-Page Parity Test

Any edge SEO for AI variant must carry the same facts as the page people see. The Same-Page Parity Test is six checks, run on every template before launch and after each template change:

| Check        | Passes when                                  | How to check                                            |
| ------------ | -------------------------------------------- | ------------------------------------------------------- |
| 1. Status    | Both formats return the same code            | `curl -w "%{http_code}"` with each `Accept` value       |
| 2. Canonical | The Markdown names the HTML page's canonical | Compare `<link rel="canonical">` with the `Link` header |
| 3. Headings  | Same count, same wording                     | Count `<h1>` to `<h3>` tags against `#` lines           |
| 4. Numbers   | Every price, date and figure appears in both | Extract them from each format and `diff`                |
| 5. Links     | Every content link survives                  | Compare link targets inside your content wrapper        |
| 6. Freshness | Both reflect the same deploy                 | Change one word, purge, fetch both                      |

Check 4 catches the real problems. This version compares dollar amounts:

```bash
URL=https://tallyfold.example/pricing
prices() { grep -oE '\$[0-9]([0-9,.]*[0-9])?' | sort -u; }
diff <(curl -s -H "Accept: text/html" "$URL" | prices) \
     <(curl -s -H "Accept: text/markdown" "$URL" | prices) && echo "prices match"
```

Against the local Worker it printed "prices match". Then a yearly price was placed in an `<aside>` outside `<main>`. The diff printed `< $390` and no match line, because the converter only reads `ROOT`. That's drift in miniature: a price people see that agents never get.

### Cache variance and Vary

Cloudflare's docs say that ["by default, Cloudflare does not consider vary values in caching decisions,"](https://developers.cloudflare.com/cache/concepts/cache-control/) apart from `Accept-Encoding`, image variants and the [Cache Rules Vary setting](https://developers.cloudflare.com/cache/concepts/vary/), which every plan has. If your origin did the negotiation itself, a cached Markdown copy could reach a browser. The safe edge SEO for AI pattern converts after the cache lookup, so the cache only ever holds HTML. Switch on Workers Cache in front of the Worker and each distinct `Accept` string becomes its own cached copy.

### Rollback and failure modes

- **Roll back in one step.** `wrangler rollback` or the Deployments tab restores one of the last 100 versions at once, per Cloudflare's [rollback docs](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/).
- **Fail open, within limits.** `ctx.passThroughOnException()` sends a request to the origin when code throws. Cloudflare's [context docs](https://developers.cloudflare.com/workers/runtime-apis/context/) say it "does not mitigate failures such as exceeding CPU or memory limits."
- **Debug with headers.** `curl -sI -H "Accept: text/markdown"` shows which branch ran, and `wrangler tail` streams live logs.
- **Check the bot settings.** Cloudflare's AI bot controls run at the same layer and can block the agents this Worker serves. Our [Cloudflare AI bot management walkthrough](/blog/cloudflare-ai-bot-management) covers each setting.

The bigger risk isn't technical. Edge code is a second place where a page can change, so the Markdown and the CMS can drift apart. Give one team ownership, keep the Worker in version control, and rerun the parity test whenever a template changes.

## Worked Example: Tallyfold's Edge SEO for AI Rollout

Tallyfold is a fictional invoicing and payments app for agencies, made up for this example. Its marketing site runs on an older CMS behind Cloudflare's Free plan. Its pricing page says $39 a month with 3 users included, then $12 for each extra user. Here is how its edge SEO for AI rollout runs.

**The problem.** In this example, Tallyfold's logs show agent requests for `/pricing` and `/docs/` with `Accept: text/markdown, text/html, */*`, and its llms.txt links to `/pricing.md`, which returns a 404. The pricing HTML also carries a menu, scripts and a pricing-experiment flag that no agent needs.

**The plan, in order.**

1. **No-code fixes first.** Old 2024 plan URLs move to `/pricing` with Bulk Redirects, and staging gets `X-Robots-Tag: noindex` from a Transform Rule.
2. **The Worker** goes on `/pricing*` and `/docs/*` only.
3. **The parity test** runs on both templates. On the pricing page, status (200), canonical, the four headings, the three content links and all four prices ($12, $39, $84 and $123) match.
4. **The budget check.** Those paths get about 600,000 requests a month: 600,000 ÷ 30 = 20,000 a day, a fifth of the Workers Free plan's 100,000.

**The numbers.** The trimmed pricing page drops from 2,185 bytes of HTML to 840 bytes of Markdown, a saving of 1,345 bytes, or 61.6%. Both formats show the same price for a 10-person team: $39 + 7 × $12 = $123 a month.

**What Tallyfold doesn't do.** It doesn't show bots a lower price, add keyword text to the Markdown, or noindex the `.md` copies. If it moves to Cloudflare Pro ($20 a month billed annually, or $25 monthly, per [Cloudflare's plans page](https://www.cloudflare.com/plans/) on 1 October 2026), its edge SEO for AI setup shrinks: Markdown for Agents covers `/docs/`, and the Worker stays only for the `.md` URLs.

## Where Rankbox Fits in Edge SEO for AI

Rankbox doesn't run a CDN, edge workers, prerendering or bot management, and it won't touch your headers or robots.txt. Its part comes earlier: [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI engines, and the [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles that reach your site through the [Rankbox API](/integrations/api). A clean Markdown copy only helps if the page underneath says something worth quoting.

Rankbox doesn't track AI citations today. To see what a non-rendering crawler gets from a page, try the free [AI search readiness check](/tools/ai-search-readiness-check). The Business plan is $49.50 a month, with free signup and a 7-day trial when you add a card; see [pricing](/pricing).

## Frequently Asked Questions

### Is edge SEO for AI cloaking?

No, as long as both formats carry the same content. Google says Googlebot won't treat dynamic rendering as cloaking "as long as your dynamic rendering produces similar content," and calls serving completely different content to crawlers cloaking. Serve Markdown on request, keep the facts identical, and run a parity check after each change.

### Do AI crawlers like GPTBot ask for Markdown?

Not according to their vendors. As of 1 October 2026, the crawler pages from OpenAI, Anthropic and Perplexity cover user agents, IP ranges and robots.txt, with no `Accept` header. The documented Markdown requests come from agent tools: Cloudflare names Claude Code and OpenCode.

### Does edge SEO for AI help Google rankings?

Not the Markdown part. Google's AI optimization guide says you don't need Markdown to appear in Google Search or its AI features, "as Google Search itself doesn't use them." Classic edge fixes such as redirects, canonicals and hreflang do affect Google.

### Do I need a Worker for edge SEO for AI on Cloudflare Pro?

Usually not. On Pro, Business or Enterprise, Markdown for Agents converts HTML for any request that lists `text/markdown`, at no extra cost. Write a Worker if you're on the Free plan, need `.md` URLs, or want to choose what the conversion keeps.

### How much does edge SEO for AI cost on Cloudflare?

As of 1 October 2026, the Workers Free plan covers 100,000 requests a day with 10 ms of CPU per request. The Paid plan starts at $5 a month with 10 million requests included, then $0.30 per extra million. Cloudflare doesn't bill the subrequests a Worker makes to your origin.

### Should the Markdown version be noindexed?

No. Point it at the HTML page with a canonical `Link` header. Google says `noindex` "will completely block the page from Search" and prefers `rel="canonical"` for choosing between duplicates on one site.

## References

1. [Spam policies for Google web search: cloaking, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies#cloaking)
2. [Dynamic rendering as a workaround, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering)
3. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
4. [How to specify a canonical URL with rel="canonical" and other methods, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
5. [Markdown for Agents, Cloudflare Docs](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
6. [Introducing Markdown for Agents, Cloudflare Blog](https://blog.cloudflare.com/markdown-for-agents/)
7. [HTMLRewriter, Cloudflare Workers Docs](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)
8. [Workers pricing, Cloudflare Docs](https://developers.cloudflare.com/workers/platform/pricing/)
9. [Vary, Cloudflare Cache Docs](https://developers.cloudflare.com/cache/concepts/vary/)
10. [Workers Cache, Cloudflare Docs](https://developers.cloudflare.com/workers/cache/)
11. [Rollbacks, Cloudflare Workers Docs](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/)
12. [RFC 9110: HTTP Semantics, IETF](https://www.rfc-editor.org/rfc/rfc9110.html)
13. [Making agent-friendly pages with content negotiation, Vercel](https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation)
14. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
15. [Some SEO plugins claim Markdown for AI but ignore the Accept header, Roots](https://roots.io/some-seo-plugins-claim-markdown-for-ai-but-ignore-the-accept-header/)
16. [Google's Mueller calls Markdown-for-bots idea "a stupid idea", Search Engine Journal](https://www.searchenginejournal.com/googles-mueller-calls-markdown-for-bots-idea-a-stupid-idea/566598/)
17. [What is edge SEO?, Search Engine Land](https://searchengineland.com/edge-seo-447510)
