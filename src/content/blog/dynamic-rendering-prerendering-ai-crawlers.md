---
title: Dynamic Rendering & Prerendering for JavaScript-Heavy AI Crawlers
description: Dynamic rendering, SSR and prerendering for AI crawlers: what they read without JavaScript, a raw HTML test, and the fix for each framework.
keyword: dynamic rendering
date: 2026-11-02
updated: 2026-11-02
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, AI Search
---

If your site builds its pages with JavaScript in the browser, most AI crawlers probably see an empty shell. The published tests show they read the HTML your server sends and don't run your scripts. The fix is to put the words in that first response, with server-side rendering, static generation or prerendering. Dynamic rendering, which hands a prerendered copy only to bots, still works as a stopgap, but Google's own page now says it ["was a workaround and not a long-term solution."](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering)

Googlebot is the exception people mistake for the rule. Google renders pages in an ["evergreen version of Chromium"](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), and its AI Overviews and AI Mode use pages [indexed for Search](https://developers.google.com/search/docs/appearance/ai-features). When Vercel and MERJ studied crawler traffic in December 2024, they found ["none of the major AI crawlers currently render JavaScript,"](https://vercel.com/blog/the-rise-of-the-ai-crawler) naming OpenAI's three bots, ClaudeBot, PerplexityBot, Meta's crawler and Bytespider. Tests in 2025 and 2026 point the same way, with one fresh and unconfirmed exception covered below.

This guide is the fix. It covers the evidence as of October 2026, a raw HTML test you can run in five minutes, the fix options ranked by how long they last, a decision table for nine frameworks and six kinds of site, and a worked example. For Google's policy history and the cloaking line in depth, read our guide to [dynamic rendering SEO](/blog/dynamic-rendering-seo). For how prerender services work and what they cost, read [prerender SEO, explained](/blog/prerender-seo).

## Key Takeaways

- Published tests from December 2024 to June 2026 found that OpenAI's, Anthropic's and Perplexity's crawlers read raw HTML without running JavaScript. None of those vendors documents rendering.
- Googlebot renders JavaScript, and Google's AI Overviews and AI Mode use the Search index. Apple says Applebot "may render" pages in a browser.
- One developer reported OpenAI's bots rendering some pages from 25 September 2026. It's a single, unconfirmed report, so keep building for crawlers that don't render.
- You can test any page in five minutes: fetch it without JavaScript, with a crawler user agent, and look for a sentence that matters.
- Server-side rendering and static generation fix the problem for every crawler at once. Dynamic rendering only fixes it for the bots on your list.
- Google accepts dynamic rendering that serves bots similar content, and calls it cloaking when the content differs.
- Every framework in the decision table below can put full HTML in the first response. Plain React or Vue on Vite, and Angular without SSR, need a change.

## What a Non-Rendering Crawler Gets From a JavaScript App

A client-rendered app sends almost nothing in its first response. The browser downloads a script, runs it, fetches data from an API and only then draws the page. A person never notices the gap. A crawler that reads the first response and stops sees the gap and nothing else.

Here is the body of a new React app made with Vite's official template, trimmed:

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

Everything a buyer would read arrives later: the headline, the prices, the feature list, the FAQ, often the links to other pages. React's own docs say the build tools it lists ["start off with a client-only, single-page app (SPA)."](https://react.dev/learn/build-a-react-app-from-scratch)

The same gap hides metadata. A title, canonical tag or JSON-LD block added by a script isn't there for a bot that runs no scripts. Google can read a [canonical tag](/glossary/canonical-tag) injected with JavaScript, but its own guide still says the best way to set one "is to use HTML."

One naming trap before going further. Next.js uses "dynamic rendering" in its glossary for pages ["rendered at request time rather than build time."](https://nextjs.org/docs/app/glossary#dynamic-rendering) That is ordinary server rendering for everyone. In this guide, dynamic rendering means Google's sense: detecting bots and serving them a prerendered copy.

## What AI Crawlers Render, as of October 2026

Everything below is third-party evidence or vendor documentation, each dated. Read it as the best current picture, not a permanent rule.

### The published tests

- **[Vercel and MERJ](https://vercel.com/blog/the-rise-of-the-ai-crawler), December 2024.** Using traffic on nextjs.org, Vercel's network and two job-board sites, the study found no JavaScript execution by OpenAI's `OAI-SearchBot`, `ChatGPT-User` and `GPTBot`, Anthropic's `ClaudeBot`, Meta's `Meta-ExternalAgent`, ByteDance's `Bytespider` or `PerplexityBot`. ChatGPT's and Claude's crawlers did download script files (11.50% and 23.84% of their fetches) without running them. Vercel adds one caveat: JSON or React Server Component data already in the first response "may still be indexed."
- **Glenn Gabe, August 2025.** On a fully client-rendered site, [ChatGPT said it could not read the page](https://www.gsqi.com/marketing-blog/ai-search-javascript-rendering/) because it relied on JavaScript-based rendering. Perplexity and Claude also failed, while server-rendered control pages worked. He saw the same result on other client-rendered sites.
- **EdgeComet, January 2026.** On a fresh test domain, [`ChatGPT-User` fetched only the HTML](https://edgecomet.com/blog/openseotest-how-gptbot-and-chatgpt-user-handle-javascript/), with no CSS or scripts. `GPTBot` downloaded scripts but fired a single AJAX request out of hundreds. EdgeComet sells rendering, and it calls this one experiment.
- **Siteline, June 2026.** In [Claude agent runs](https://siteline.ai/blog/ai-agent-software-benchmark/) that looked up pricing for 100 B2B products, 13% of runs noted JavaScript or rendering issues. Where a plan table loaded by script, the agent fell back to third-party blogs.
- **One developer, 30 September 2026.** A Next.js site owner [reported that `OAI-SearchBot` and `GPTBot`](https://dev.to/hisashispace/traffic-from-chatgpt-jumped-is-it-because-its-crawlers-now-run-javascript-5961), checked against OpenAI's IP lists, began fetching Next.js prefetch URLs, CSS and images from 25 September. Those are signs of rendering. He found no OpenAI announcement and thinks it reaches only some sites.

### What each vendor documents

| Crawler                                        | What the vendor says about JavaScript                                                                                      | Published tests                                                                |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Googlebot` (Search, AI Overviews, AI Mode)    | Renders in headless Chromium, after a queue                                                                                | Renders                                                                        |
| `bingbot` (Bing, Copilot grounding)            | Asks you to let it "crawl and render" and to avoid "hiding critical content behind client-side rendering"                  | Not in Vercel's study; Glenn Gabe says Bing renders it                         |
| `Applebot`                                     | "May render the content of your website within a browser"                                                                  | Renders                                                                        |
| `OAI-SearchBot`, `GPTBot`, `ChatGPT-User`      | Nothing on rendering                                                                                                       | No (2024, 2025, 2026); one unconfirmed report of rendering from September 2026 |
| `ClaudeBot`, `Claude-SearchBot`, `Claude-User` | Crawler page says nothing; Anthropic's API web fetch tool "does not support websites dynamically rendered with JavaScript" | No (2024, 2025)                                                                |
| `PerplexityBot`, `Perplexity-User`             | Nothing on rendering                                                                                                       | No (2024, 2025)                                                                |

The sources are [Bing's Webmaster Guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a), [Apple's Applebot page](https://support.apple.com/en-us/119829), [OpenAI's crawler docs](https://developers.openai.com/api/docs/bots), [Anthropic's crawler page](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), its [web fetch tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool) and [Perplexity's crawler docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), all read on 1 October 2026. Bing's guidelines add that "content that cannot be reliably rendered may not be indexed or selected for grounding results." Our [AI crawler directory](/blog/ai-crawler-directory) lists every bot's user agent and IP file, and our [Applebot guide](/blog/applebot-apple-intelligence-search) covers how Apple's crawler renders pages.

Browser agents are a different case. OpenAI says ChatGPT agent has ["a visual browser that interacts with the web through a graphical-user interface,"](https://openai.com/index/introducing-chatgpt-agent/) so it sees a rendered page. But it browses for one user at a time. It doesn't build the index that ChatGPT search answers from.

### The safe reading

Treat "AI crawlers don't run JavaScript" as the working assumption, not a law. Even the author of the September report thinks OpenAI was re-rendering HTML it had already stored, and only on some sites. HTML in the first response is read by every crawler in the table, so it's the one choice that doesn't depend on who renders what this month.

## The Five-Minute Raw HTML Test

You don't need to wait for a study to check your own site. Run these steps on five templates: your home page, pricing, a product or feature page, a blog post and a docs page.

1. **Pick a sentence that matters** on each page, such as a price or a one-line answer. Avoid text that mixes words and numbers from separate data fields (see the note below).
2. **Fetch the page without JavaScript.** The script below requests it twice, once as a browser and once with the user agent OpenAI documents for `OAI-SearchBot`. It counts the words a non-rendering bot gets and looks for your sentence.
3. **Compare with what you see.** Open `view-source:` in Chrome, not the Inspect panel. Inspect shows the page after scripts ran. You can also turn JavaScript off in DevTools and reload.
4. **Run Rankbox's free [AI search readiness check](/tools/ai-search-readiness-check).** It fetches the page without running JavaScript and reports how many words are visible, flagging pages with fewer than 150. It uses its own user agent, so pair it with step 2 to catch firewall rules aimed at bots.
5. **Check Google's view** in Search Console's URL Inspection, which shows the HTML Googlebot rendered. A page that looks fine there and empty in step 2 is readable by Google but not by most AI crawlers.

```bash
#!/usr/bin/env bash
# raw-html-check.sh: what does a crawler that runs no JavaScript receive?
# Usage: ./raw-html-check.sh https://example.com/pricing "a phrase from the page"
url="$1"
phrase="$2"
browser='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
searchbot="$browser; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot"

check() {
  local label="$1" ua="$2" body status text words hits
  body=$(curl -sL --max-time 20 -A "$ua" -w '\n%{http_code}' "$url")
  status=${body##*$'\n'}
  # Drop comments, scripts and styles, then tags, to get the visible text.
  text=$(printf '%s' "${body%$'\n'*}" | perl -0777 -pe \
    's/<!--.*?-->//gs; s/<(script|style|noscript)\b.*?<\/\1>//gis; s/<[^>]+>/ /g; s/\s+/ /g')
  words=$(printf '%s' "$text" | wc -w | tr -d ' ')
  hits=$(printf '%s' "$text" | grep -o -i -F -- "$phrase" | wc -l | tr -d ' ')
  echo "$label: HTTP $status, $words words without JavaScript, phrase found $hits time(s)"
}

check "Browser" "$browser"
check "OAI-SearchBot" "$searchbot"
```

This script was run on 1 October 2026 with bash, curl and perl on macOS. On Google's dynamic rendering page it returned 1,627 words, with "workaround" found 8 times. On Bing's Webmaster Guidelines page, which builds its text in the browser, it returned 6 words: the page title. Bingbot renders, so that page is fine for Bing. A crawler that runs no scripts gets the title and nothing else.

Two notes on reading the output. First, React splits text and values with empty comment markers, so the raw HTML for "$39 a month" can read `$<!-- -->39 a month`. The script strips comments for that reason; a plain `grep` would miss it. Second, a spoofed bot user agent comes from your IP, not the vendor's. A firewall that checks IPs may block it, which tells you about the firewall, not about the real bot. Our [Cloudflare challenge guide](/blog/cloudflare-challenge-trap) covers that case, and the [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) shows what real bots received.

## Fix Options, Ranked by How Long They Last

Every fix does the same thing: it moves the words into the first response. They differ in who gets that HTML and how fresh it stays.

| Approach                                          | Where the HTML is built                       | Who gets full HTML      | How fresh               | Google's view                                |
| ------------------------------------------------- | --------------------------------------------- | ----------------------- | ----------------------- | -------------------------------------------- |
| Server-side rendering (SSR)                       | On the server, per request                    | Everyone                | Live                    | Recommended                                  |
| Static generation (SSG, ISR)                      | At build time, or on a revalidate timer       | Everyone                | As of the last build    | Recommended ("static rendering")             |
| Build-time prerendering of an SPA's public routes | At build time, by the framework               | Everyone                | As of the last build    | Static rendering by another name             |
| Prerender service with bot detection              | In a headless browser, on demand, then cached | Only bots on the list   | As of the cache         | Dynamic rendering: "a workaround"            |
| Markdown or text copy at the edge                 | Converted from your HTML at the CDN           | Clients that ask for it | Same as the source page | Not addressed; the same-content rule applies |

### Why the first three come first

[Server-side rendering](/glossary/server-side-rendering), static generation and build-time prerendering send the same HTML to people and bots. There's no bot list to maintain, no second copy to drift and nothing to explain to a search engine. Google's dynamic rendering page names them directly: "we recommend that you use server-side rendering, static rendering, or hydration as a solution." Hydration is the step where the browser's JavaScript takes over server-built HTML and makes it interactive.

### When dynamic rendering is the right stopgap

Dynamic rendering earns its place when you can't change the build this quarter: a large legacy single-page app, a platform you don't control, or a team with no front-end time. A prerender service sits in front of your server, spots crawler user agents and hands them a cached snapshot from a headless browser. It works for any bot on its list. That's its weak spot for AI search: a bot left off the list still gets the shell. Our [prerender SEO guide](/blog/prerender-seo) covers the services, their prices and cache freshness.

### Where a Markdown copy fits

Some sites now offer a Markdown version of each page to clients that ask for it, usually at the CDN. That's a cleaner format of the same content, not a fix for an empty page. Cloudflare's [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/), for example, fetches "the original HTML version from the origin" and converts it. If the HTML is a shell, the Markdown is a shell too. Our guide to [edge SEO for AI](/blog/edge-seo-for-ai-cloudflare-workers) covers content negotiation with the `Accept` header.

## Framework Decision Table: Get HTML Into the First Response

Most modern frameworks already server-render or prerender by default. The risk sits with plain single-page apps and with switches that turn server rendering off. Versions and defaults below come from each framework's docs on 1 October 2026.

| Framework                          | Default for a new project                                        | To ship HTML for public pages                                             | Watch for                                                      |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Next.js 16 (App Router)            | Server Components, prerendered unless they use request-time APIs | Nothing; `output: 'export'` for a fully static site                       | Slow metadata streamed to AI bots; text behind clicks          |
| Nuxt 4                             | Universal rendering, `ssr: true`                                 | Nothing; `routeRules` with `prerender: true`, or `nuxt generate`          | `ssr: false`, which Nuxt says leaves pages with "no content"   |
| SvelteKit 3                        | Server-render, then hydrate                                      | `export const prerender = true`                                           | `ssr = false` and the static adapter's `fallback` page         |
| React Router 8, framework mode     | `ssr: true`                                                      | A `prerender` list, which also works with `ssr: false`                    | SPA Mode: `ssr: false` with no `prerender`                     |
| Astro 7                            | Every page prerendered                                           | Nothing                                                                   | `client:only` components, which skip server HTML               |
| TanStack Start (release candidate) | SSR on                                                           | `prerender: { enabled: true }` in its Vite plugin                         | `spa: { enabled: true }` and routes set to `ssr: false`        |
| React with Vite, no framework      | Client-only SPA                                                  | Move to a framework, or prerender routes at build                         | The most common source of empty pages                          |
| Angular 22                         | Client-side rendering                                            | `ng add @angular/ssr`, then `RenderMode.Prerender` or `RenderMode.Server` | The `ng new` SSR prompt defaults to No                         |
| Vue with Vite, no framework        | Client-side SPA                                                  | Nuxt, or a static generator such as VitePress or Astro                    | Vue's docs suggest static generation for a few marketing pages |

### The frameworks that need a change

**React on Vite.** React's docs now recommend ["starting with a framework,"](https://react.dev/learn/creating-a-react-app) and Create React App was [deprecated for new apps](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) on 14 February 2025. The lightest move for an existing Vite app is usually React Router's framework mode, which runs on Vite and can [prerender chosen routes](https://reactrouter.com/how-to/pre-rendering). Remix v2 users were told to move to React Router as well. The config below was run on 1 October 2026 with React Router 8.4.0. The build wrote `build/client/pricing/index.html` with the pricing sentence in its body, while the SPA fallback page had no body text.

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false, // keep static hosting
  prerender: ["/", "/pricing"], // these routes get full HTML at build time
} satisfies Config;
```

**Angular.** Angular ["ships all applications as client-side rendered (CSR) by default."](https://angular.dev/guide/ssr) Adding `@angular/ssr` prerenders the whole app by default. In `app.routes.server.ts` you can then set `RenderMode.Prerender` for public routes, `RenderMode.Server` for pages that change per request, and `RenderMode.Client` for the logged-in app.

**Vue on Vite.** Vue's guide says that if you only want SEO for ["a handful of marketing pages,"](https://vuejs.org/guide/scaling-up/ssr) you probably want static generation, not SSR. For a whole app, it recommends a framework such as Nuxt.

### The frameworks that only need checking

Next.js, Nuxt, SvelteKit, Astro and TanStack Start send HTML by default. The risk is a switch someone flipped, such as Nuxt's `ssr: false` or SvelteKit's `ssr = false`. Nuxt's [`routeRules`](https://nuxt.com/docs/4.x/guide/concepts/rendering) let one app keep marketing pages prerendered and a logged-in area client-side.

Next.js has one AI-specific catch. When `generateMetadata` is slow, Next.js streams the title and meta tags into the page body, and only gives a blocking render, with metadata in the `<head>`, to bots on its `htmlLimitedBots` list. That list was built for search and social bots. [Vercel's own guide](https://vercel.com/kb/guide/agentic-commerce-readiness) says GPTBot, ClaudeBot, PerplexityBot and OAI-SearchBot "don't match it." In a test build on 1 October 2026 with Next.js 16.3.8, a page with slow metadata sent `bingbot` its title in the `<head>`, while `GPTBot`, `OAI-SearchBot` and `PerplexityBot` got it in the body. The body text reached all of them. After this change, all four got the title in the `<head>`:

```ts
// next.config.ts (run on 1 October 2026 with Next.js 16.3.8)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Replaces Next.js's default list: keep the search and social bots you rely on.
  htmlLimitedBots:
    /GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|[\w-]+-Google|Google-[\w-]+|Bingbot|Applebot|DuckDuckBot|facebookexternalhit|Twitterbot|LinkedInBot|Slackbot/i,
};

export default nextConfig;
```

Keep the `i` flag: real user agents mix case, such as `bingbot` and `Applebot`. Next.js's [docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots) also show `htmlLimitedBots: /.*/`, which turns streaming metadata off for everyone. Two more checks: a `"use client"` component is still prerendered to HTML, but [Next.js warns](https://nextjs.org/docs/app/guides/server-and-client-boundary) that "content gated behind user interaction or an event does not appear in the HTML." And SvelteKit 3.0.0, published on 1 October 2026, moved adapter settings from `svelte.config.js` into `vite.config.js`, so check your major version before copying an example.

## The Render Route Picker: Choose a Fix by Site Type

The framework table tells you what's possible. This table, which we call the Render Route Picker, tells you what to do first for the kind of site you run.

| Site type                                      | Usual problem                                          | First choice                                             | Stopgap if you can't rebuild             |
| ---------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- | ---------------------------------------- |
| Marketing site or blog on an SPA               | Every page is a shell                                  | Static generation or build-time prerendering             | Prerender service                        |
| SaaS: public pages plus a logged-in app        | Pricing and feature pages share the app's client build | Prerender the public routes, keep the app client-side    | Prerender service for public paths only  |
| Docs or help center                            | Docs widget or search UI loads the text                | Static site generator                                    | Prerender service                        |
| Store with changing prices or stock            | Product data loads from an API after page load         | SSR, or static generation with short revalidation        | Prerender service with short cache times |
| Large listings or user content (100,000+ URLs) | Shells across millions of pages                        | SSR                                                      | Prerender service, priced by renders     |
| App made with an AI app builder                | Exported as a Vite single-page app                     | Prerender public routes at build, or move to a framework | Prerender service                        |

For the last row, check your builder first. Lovable, for one, now says new apps "ship with full server-side rendering" and older apps get static snapshots, [free on all tiers](https://lovable.dev/seo-aeo) as of October 2026. Run the raw HTML test before you pay for anything.

Two rules sit behind the table. If the content changes faster than you can rebuild, prefer SSR over anything cached. If only bots see a copy, someone must check that it still matches what people see.

## Dynamic Rendering Without Crossing the Cloaking Line

Google's position has moved in three steps. In 2018 its guide [recommended dynamic rendering](https://web.archive.org/web/20181001220905/https://developers.google.com/search/docs/guides/dynamic-rendering) "as a workaround solution" and named Puppeteer, Rendertron and Prerender.io. In [August 2022](https://developers.google.com/search/updates) it said this "isn't a recommended solution." Its current page, last updated 10 December 2025, says dynamic rendering "was a workaround" and "creates additional complexities and resource requirements." The full story is in our [dynamic rendering SEO guide](/blog/dynamic-rendering-seo).

The line between dynamic rendering and cloaking is about content, not technique. Google's page puts it plainly: "As long as your dynamic rendering produces similar content, Googlebot won't view dynamic rendering as cloaking." Its [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) define cloaking as "presenting different content to users and search engines with the intent to manipulate search rankings and mislead users." Bing's guidelines say sites should not serve "materially different experiences to crawlers and visitors."

So the rule for any bot-specific copy is simple. The same facts and content in a different format is acceptable. Different content for bots is cloaking. That covers prices, claims, links and anything a person would act on.

If you run dynamic rendering for AI search, check four things:

1. **Bot list.** Add the AI search and user-triggered bots you want, such as `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot` and `Perplexity-User`. A bot that isn't matched still gets the shell.
2. **Matching.** Dynamic rendering keys on the user agent. The crawler pages from OpenAI, Anthropic and Perplexity document user agents and IP lists, not request headers such as `Accept`, so there's no standard signal to switch on instead. Verify heavy hitters against the vendors' IP files.
3. **Caching.** If a CDN caches the bot copy and the human copy under one URL, add `Vary: User-Agent` or keep the bot copy out of the shared cache.
4. **Parity.** Each week, compare the bot copy with the live page for title, canonical, prices, headings and status code. A cached snapshot that's a month old is different content, even if nobody meant it to be.

## Worked Example: Tallyfold's Client-Side Pricing Page

Tallyfold is a fictional invoicing and payments app for agencies. It charges $39 a month with 3 users included, then $12 for each extra user. The numbers in this example are illustrative, except the build output noted in step 3.

**The setup.** Tallyfold's marketing pages and app are one React single-page app built with Vite. The pricing page draws its plan table from `/api/plans` after the page loads.

**Step 1: the raw HTML test.** In a browser, the pricing page shows 640 words. The script above, run with the `OAI-SearchBot` user agent, returns 41 words: the navigation, the footer and "Loading plans…". Tallyfold checks four facts a buyer would ask about:

| Fact                                                 | In the browser | In the raw HTML |
| ---------------------------------------------------- | -------------- | --------------- |
| Base price, $39 a month                              | Yes            | No              |
| 3 users included                                     | Yes            | No              |
| $12 per extra user                                   | Yes            | No              |
| Price for a team of 8: $39 + (5 × $12) = $99 a month | Yes            | No              |

So 0 of 4 facts reach a crawler that doesn't render. When a buyer asks an AI assistant what Tallyfold costs for eight people, the answer has to come from somewhere else. Our post on [pricing pages AI can't read](/blog/hallucination-by-omission-pricing-page) shows where that tends to lead.

**Step 2: pick the fix.** The Render Route Picker puts Tallyfold in the "SaaS: public pages plus a logged-in app" row. The first choice is to prerender the public routes and keep the app client-side. On Vite, React Router's framework mode does that without a server.

**Step 3: move the data to build time.** The plan table's data moves from a browser fetch into a route `loader`, which runs during the build when the route is prerendered. The config is the one shown in the framework section. In the minimal build run on 1 October 2026, the prerendered pricing file contained "Tallyfold costs $39 a month with 3 users included, then $12 per extra user."

**Step 4: re-test and set a refresh rule.**

| Check                         | Before                        | After                        |
| ----------------------------- | ----------------------------- | ---------------------------- |
| Words without JavaScript      | 41                            | 640                          |
| Key facts in the raw HTML     | 0 of 4                        | 4 of 4                       |
| Same HTML for people and bots | Yes (an empty shell for both) | Yes (the full page for both) |
| Needs a bot list              | No                            | No                           |

Prices are now fixed at build time, so a price change needs a rebuild. Tallyfold adds a deploy hook to its billing admin and a visible "Prices updated" date to the page. It considered a prerender service too. That would have fixed bots on the list without touching the build, at the cost of a cache to watch and a monthly bill.

## Where Rankbox Fits

Rankbox doesn't host sites, run a CDN or prerender pages, so the fixes in this guide belong to you or your developer. Two parts of Rankbox help around them. The free [AI search readiness check](/tools/ai-search-readiness-check) shows how many words a page offers without JavaScript, which makes it a quick before-and-after test.

Once your pages send real HTML, the paid product works on what goes in them. It researches the questions buyers ask AI assistants and writes source-backed articles with the [Citation-Ready Writer](/features/citation-ready-writer). The articles reach your site through Rankbox's API, which your developer wires into whichever rendering setup you chose. Rankbox doesn't track AI citations today. The Business plan is $49.50 a month with a 7-day trial when you add a card; see [pricing](/pricing).

## Frequently Asked Questions

### Do AI crawlers render JavaScript?

Mostly no, based on published tests as of October 2026. Vercel and MERJ found in December 2024 that OpenAI's, Anthropic's and Perplexity's crawlers didn't run JavaScript, and tests in 2025 and 2026 agreed. Googlebot and Applebot render. One developer reported OpenAI's bots rendering some pages from 25 September 2026, which OpenAI hasn't confirmed.

### Is dynamic rendering considered cloaking?

Not when bots get similar content. Google says dynamic rendering that "produces similar content" isn't cloaking, and that serving completely different content to users and crawlers can be. The same facts in a different format are fine. Different prices, claims or text for bots cross the line.

### Does Google still recommend dynamic rendering?

No. Google's page, last updated 10 December 2025, says dynamic rendering "was a workaround and not a long-term solution" and recommends server-side rendering, static rendering or hydration instead. Google first suggested it as a workaround in 2018 and stopped recommending it in August 2022.

### What is the difference between prerendering and server-side rendering?

Prerendering builds a page's HTML ahead of time, usually during the build, and serves the saved file. Server-side rendering builds the HTML on the server for each request. Both send full HTML to every visitor. Prerendering is cheaper and faster to serve, while server rendering stays current without a rebuild.

### Can ChatGPT read content that loads with JavaScript?

Usually not through its crawlers, based on published tests. ChatGPT's search crawler and its live fetcher read the HTML your server sends. ChatGPT agent uses a visual browser, so it can see rendered pages, but it browses for one user at a time. Content you want quoted belongs in the first response.

### Do I have to rebuild my React app to show up in AI search?

Not always. If your app runs on Vite, React Router's framework mode can prerender your public pages at build time with a short config change. A prerender service needs no code change but serves only the bots on its list. Rebuilding on a framework is the longest-lasting fix.

## References

1. [Dynamic rendering as a workaround, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering)
2. [Understand the JavaScript SEO basics, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
3. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
4. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
5. [Latest Google Search documentation updates, Google Search Central](https://developers.google.com/search/updates)
6. [Get started with dynamic rendering (October 2018 capture), Google Developers via the Internet Archive](https://web.archive.org/web/20181001220905/https://developers.google.com/search/docs/guides/dynamic-rendering)
7. [The rise of the AI crawler, Vercel and MERJ](https://vercel.com/blog/the-rise-of-the-ai-crawler)
8. [AI search and JavaScript rendering, GSQi (Glenn Gabe)](https://www.gsqi.com/marketing-blog/ai-search-javascript-rendering/)
9. [OpenSeoTest: how GPTBot and ChatGPT-User handle JavaScript, EdgeComet](https://edgecomet.com/blog/openseotest-how-gptbot-and-chatgpt-user-handle-javascript/)
10. [AI agent software benchmark, Siteline](https://siteline.ai/blog/ai-agent-software-benchmark/)
11. [Traffic from ChatGPT jumped! Is it because its crawlers now run JavaScript?, DEV Community](https://dev.to/hisashispace/traffic-from-chatgpt-jumped-is-it-because-its-crawlers-now-run-javascript-5961)
12. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
13. [Does Anthropic crawl data from the web?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
14. [Web fetch tool, Claude Developer Platform](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool)
15. [Perplexity crawlers, Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
16. [About Applebot, Apple Support](https://support.apple.com/en-us/119829)
17. [Bing Webmaster Guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
18. [Pre-rendering, React Router](https://reactrouter.com/how-to/pre-rendering)
19. [Making your catalog discoverable to AI agents, Vercel](https://vercel.com/kb/guide/agentic-commerce-readiness)
20. [Markdown for Agents, Cloudflare](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
