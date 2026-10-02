---
title: Prerender SEO: How Prerendering Works and When You Need It
description: Prerender SEO explained: build-time vs on-demand prerendering, services and prices as of October 2026, cache freshness risks, and how to test the result.
keyword: prerender SEO
date: 2026-11-09
updated: 2026-11-09
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, SEO
---

Prerender SEO means giving crawlers a finished HTML copy of a JavaScript page instead of the empty shell a client-rendered app sends first. You need it when the words people see on a page aren't in your server's first response, which is common for single-page apps built with React, Vue or Angular.

There are two ways to do prerender SEO. You can build the HTML ahead of time, at deploy, so every visitor gets it. Or you can put a prerender service in front of your site that loads each page in a headless browser, caches the result and serves it to bots.

It matters more now because of AI search. Published tests, summed up in our guide to [dynamic rendering and prerendering for AI crawlers](/blog/dynamic-rendering-prerendering-ai-crawlers), found that OpenAI's, Anthropic's and Perplexity's crawlers read raw HTML without running JavaScript. This post covers how each kind of prerender SEO works, the main services with prices as of 1 October 2026, a worksheet for estimating your render bill, the stale-cache risk and how to test the result.

## Key Takeaways

- Prerender SEO comes in two forms: build-time prerendering, which serves the same HTML to everyone, and on-demand prerender services, which serve a cached copy to bots.
- Google calls bot-only serving "dynamic rendering" and now describes it as a workaround. Build-time prerendering is what Google calls static rendering, which it recommends.
- Prerender services charge by renders, pages, requests or browser hours. Prerender.io's Starter plan lists $59 a month for 30,000 renders as of 1 October 2026.
- Cache freshness is the hidden cost. A short refresh time multiplies renders; a long one serves bots old prices.
- A prerender SEO service only helps the bots on its list. Check that AI search crawlers such as `OAI-SearchBot` and `PerplexityBot` get the prerendered copy.

## How Prerendering Works: Build Time vs On Demand

Both kinds of prerender SEO end the same way: a crawler gets full HTML. They differ in when that HTML is made and who receives it.

|                      | Build-time prerendering                  | On-demand prerender service                       |
| -------------------- | ---------------------------------------- | ------------------------------------------------- |
| When HTML is made    | During your build or deploy              | When a bot first asks, then on a refresh schedule |
| Who gets it          | Every visitor                            | Only requests matched as bots                     |
| Freshness            | As of the last build                     | As of the last render in the cache                |
| Cost model           | Build minutes                            | Renders, pages, requests or browser hours         |
| Code change          | Framework config, sometimes data loading | Middleware or a CDN rule                          |
| Google's name for it | Static rendering (recommended)           | Dynamic rendering (a workaround)                  |

### Build-time prerendering

Build-time prerendering is the low-maintenance form of prerender SEO. web.dev, Google's web developer site, defines prerendering as ["running a client-side application at build time to capture its initial state as static HTML."](https://web.dev/articles/rendering-on-the-web) The output is one HTML file per route, served to people and bots alike. Most current frameworks do this with a setting: React Router's `prerender` list, SvelteKit's `export const prerender = true`, Nuxt's `routeRules`, Angular's `RenderMode.Prerender`. Astro prerenders every page by default. Our [hub guide's framework table](/blog/dynamic-rendering-prerendering-ai-crawlers) lists the switch for nine frameworks.

The limit is data that changes between builds. A page prerendered on Monday shows Monday's prices until the next build, so tie a rebuild to the events that change the page.

### On-demand prerender services

A prerender service adds a layer in front of your site. [Prerender.io's docs](https://docs.prerender.io/docs/how-does-prerender.io-work) describe the flow, and the other services work much the same way:

1. Your CDN or server checks the request's user agent and decides whether it's a crawler.
2. People go straight to your normal site. Crawler requests go to the service.
3. If the page is in the cache, the service returns the stored HTML.
4. If it isn't, the service renders the page in a headless browser and returns it. Prerender.io calls this a "cache miss."
5. The service refreshes stored pages on a timer, from your sitemap, or when you call its recache API.

Because this serves bots something people don't get, it's what Google calls dynamic rendering. Google's page says it ["was a workaround and not a long-term solution,"](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering) and treats it as cloaking only if bots get different content. Our [dynamic rendering SEO guide](/blog/dynamic-rendering-seo) covers that line in detail.

## Prerender Services Compared (Prices as of 1 October 2026)

These are the services you'll meet most often in prerender SEO, with prices as listed on each vendor's page on 1 October 2026. Each counts usage in its own unit, so convert your traffic before you compare.

| Service                                                                                                       | Entry price                                                          | Free option                     | Usage included                       | Cache refresh range                      | AI crawlers in the default bot list                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------- | ------------------------------------ | ---------------------------------------- | -------------------------------------------------- |
| [Prerender.io](https://prerender.io/pricing/)                                                                 | Starter: $59/month, billed monthly                                   | 30-day Starter trial            | 30,000 renders, then $2.25 per 1,000 | 24 hours to 7 days on Starter            | Yes, in current integrations                       |
| [SEO4Ajax](https://www.seo4ajax.com/pricing/)                                                                 | Project plan: $39/month monthly, or $29/month on a yearly commitment | Developer plan: 1,000 pages     | 20,000 pages, up to 3 sites          | Set per path in site settings            | None named; its connectors match "bot" and "-user" |
| [Ostr.io](https://ostr.io/info/pricing)                                                                       | Pay as you go, no monthly fee; hobby tier $0.00024 per render        | 1,200 renders on the hobby tier | Billed per render                    | 4 hours to 31 days on hobby              | Yes, including `GPTBot` and `PerplexityBot`        |
| [Headless-Render-API](https://headless-render-api.com/pricing) (formerly Prerender.cloud)                     | $9/month under 20,000 requests                                       | Under 500 requests a month      | Billed by requests                   | 5-minute default, up to 1 month          | Default mode prerenders for all visitors           |
| [Netlify Prerender extension](https://docs.netlify.com/build/post-processing/prerendering/)                   | Free extension; functions billed as usual                            | Yes, on Netlify plans           | Your plan's function usage           | Cleared when your site's cache is purged | Routes by Netlify's user-agent categories          |
| [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/pricing/) (formerly Browser Rendering) | Workers Paid: 10 browser hours a month, then $0.09 per hour          | Workers Free: 10 minutes a day  | Browser hours                        | Whatever cache you build                 | You write the rules                                |

A few notes that don't fit in the table:

- **Prerender.io** moved Starter to $59 with 30,000 renders on [15 September 2026](https://docs.prerender.io/docs/pricing-update-2026), up from 25,000 renders, and ended its free plan on 15 October 2025. Its docs warn that "GPTBot, ClaudeBot, PerplexityBot, and others may not appear in older integration versions," so check your middleware's list.
- **SEO4Ajax** describes itself as "the solution that implements dynamic rendering." For other refresh rates, its pricing page says to contact it.
- **Ostr.io** bills re-renders at the same per-render rate when its opt-in "Re-cache Upon Expiration" setting is on.
- **Headless-Render-API**'s Node middleware sends all traffic through the service by default. Its README advises against bot-only mode, citing "potential google cloaking penalties."
- **Netlify** made its Prerender extension [generally available on 16 December 2025](https://www.netlify.com/changelog/2025-12-16-prerender-extension-ga/) and retired its older prerendering feature in stages from January to March 2026.
- **Cloudflare** has a tutorial on [pre-rendering pages for crawlers](https://developers.cloudflare.com/browser-run/how-to/pre-render-pages/) with Browser Run's `/content` endpoint. You write the bot rules and the cache. Workers Paid has a $5 monthly minimum.
- **Rendertron**, the open-source renderer Google once suggested, was [archived on 6 October 2022](https://github.com/GoogleChrome/rendertron). Its README calls it deprecated.
- **Services for AI-built apps** have appeared too. As of 1 October 2026, [Encited](https://encited.com/pricing) (formerly LovableHTML) lists a Basic plan at $19 a month, [Hado SEO](https://hadoseo.com/) a Starter plan at $19 a month and [Crawllify](https://crawllify.com/pricing/) a Starter plan at $9 a month. Check your builder first, though: Lovable now says its apps get server rendering or static snapshots, ["free on all tiers."](https://lovable.dev/seo-aeo)

## The Render Budget Worksheet

The bill for prerender SEO grows with three numbers: how many URLs you cache, how often each one refreshes, and how many versions of each page get rendered. We call this the Render Budget Worksheet:

**Monthly renders = URLs × (30 ÷ refresh interval in days) × versions per page**

Prerender.io's pricing FAQ says each page is rendered once for desktop and once for mobile, so use 2 for versions there.

Here's the worksheet for Tallyfold, a fictional invoicing app for agencies. Its marketing site is a client-rendered app with 1,200 public URLs: 80 marketing and pricing pages, 220 blog posts and 900 help articles. The plan prices are Prerender.io's, as listed on 1 October 2026.

| Option                                       | Arithmetic                    | Renders a month | Plan and cost                                                                         |
| -------------------------------------------- | ----------------------------- | --------------- | ------------------------------------------------------------------------------------- |
| A. Refresh everything weekly                 | 1,200 × (30 ÷ 7) × 2          | 10,286          | Starter, $59                                                                          |
| B. Refresh everything daily                  | 1,200 × 30 × 2                | 72,000          | Starter plus 42,000 extra at $2.25 per 1,000: $59 + $94.50 = $153.50 (Growth is $169) |
| C. Weekly, plus a recache when prices change | 10,286 + (80 × 2 × 3 changes) | 10,766          | Starter, $59                                                                          |

Option B buys freshness the expensive way: most help articles don't change daily, so it pays to re-render pages that haven't changed. Option C keeps the weekly schedule and asks the service to re-render only the 80 marketing pages when prices change. Prerender.io says its recache API is available on every plan. The cost stays at $59, and the window in which bots could see an old price shrinks from up to 7 days to however long the recache queue takes.

The worksheet assumes a 30-day month and three price changes a month. Swap in your own counts. If the result is far above your plan, that's a sign build-time prerendering or server rendering would cost less.

## Cache Freshness and the Stale-Page Risk

A prerender cache is a copy, and copies age. It's the part of prerender SEO that teams forget after launch. Prerender.io defines cache freshness as "how often your pages are re-rendered to stay up-to-date for visitors and search engines." On its Starter plan you can set that between 24 hours and 7 days. Between refreshes, bots get the last snapshot.

That gap causes three kinds of trouble:

- **Old facts.** A price, a stock level or a date changes on the live page and not in the bot copy. Search results and AI answers can quote the old one.
- **Different content.** Google treats dynamic rendering as acceptable when bots get "similar content." A snapshot from weeks ago may not be.
- **Error pages.** If a page breaks during a render, the cached copy can be the error. Prerender.io says it caches only 200 responses and drops pages that return errors on recache, which limits this. Other services document caching differently, so check yours.

Three habits keep the gap small. Trigger a recache from the same event that changes the page, such as a price update or a publish. Set shorter refresh times only on pages whose facts move. And show a visible "updated" date on pages like pricing, so you can spot a stale snapshot at a glance.

## How to Test Your Prerender SEO Setup

Test a prerender SEO setup the way crawlers meet it: by user agent, without JavaScript.

1. **Compare a browser request with bot requests.** On a working setup, bot requests get far more words than a browser request to the same client-rendered page. The script below prints the status and word count for six user agents.
2. **Check every bot you care about.** Include `Googlebot` and the AI search bots. A bot missing from the list gets the same shell as the browser line.
3. **Check a fact that changed recently.** Search the bot copy for today's price or newest headline. If it's missing, your refresh schedule is too slow for that page.
4. **Check status codes.** Request a URL that doesn't exist. Bots should get a 404, not a 200 with a rendered error page.
5. **Run Rankbox's free [AI search readiness check](/tools/ai-search-readiness-check).** It fetches without JavaScript and with its own user agent, so it shows what a crawler outside your bot list receives.
6. **Watch real traffic.** Your prerender dashboard and server logs show which bots got cached pages. Our [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) counts AI bot hits from a log file.

```bash
#!/usr/bin/env bash
# prerender-ua-check.sh: does each bot on your list get the prerendered copy?
# Usage: ./prerender-ua-check.sh https://example.com/pricing
url="$1"
agents=(
  "Browser|Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  "Googlebot|Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  "OAI-SearchBot|Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot"
  "ChatGPT-User|Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot"
  "PerplexityBot|Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"
  "Claude-User|Claude-User" # Anthropic names this agent but publishes no full string
)

for entry in "${agents[@]}"; do
  name=${entry%%|*}
  ua=${entry#*|}
  status=$(curl -sL --max-time 20 -A "$ua" -o page.html -w '%{http_code}' "$url")
  words=$(perl -0777 -pe 's/<!--.*?-->//gs; s/<(script|style|noscript)\b.*?<\/\1>//gis; s/<[^>]+>/ /g' page.html | wc -w | tr -d ' ')
  printf '%-14s HTTP %s  %6s words\n' "$name" "$status" "$words"
done
```

The user agents come from the vendors' docs: [Google's crawler list](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [OpenAI's crawler page](https://developers.openai.com/api/docs/bots) and [Perplexity's crawler page](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). The script was run on 1 October 2026 against two pages without a prerender service, to confirm it works: a server-rendered page returned 1,627 words for all six agents, and a client-rendered page returned 6 words for all six. Behind a working prerender service, the bot lines should show the full page while the browser line stays small. Real bots also come from the vendors' IP ranges, so a firewall may treat these spoofed requests differently.

## When You Need Prerender SEO, and When You Don't

Use this order of questions before you pay for any prerender SEO setup:

1. **Do your important pages fail the raw HTML test?** If the words are already in the first response, you don't need prerendering. Many WordPress, Shopify and server-rendered sites are in this group.
2. **Can you change the build?** If yes, prerender at build time or switch on server rendering. It reaches every crawler with no bot list, and Google recommends it.
3. **Does the content change faster than you deploy?** Prices, stock and listings suit server rendering, or a build-time setup with event-driven rebuilds.
4. **Is the build out of reach for now?** A legacy app, a vendor platform or a busy team is a fair reason for a prerender service. Treat it as a bridge, with a parity check and a date to revisit.
5. **Are the pages behind a login?** Then skip it. Pages that crawlers never reach don't need a crawler copy.

Rankbox doesn't run prerendering or a CDN, so the setup is your developer's call. It helps with what goes on the pages: it researches the questions buyers ask AI assistants and writes source-backed articles with the [Citation-Ready Writer](/features/citation-ready-writer), which reach your site through Rankbox's API. Rankbox doesn't track AI citations today. The Business plan is $49.50 a month; see [pricing](/pricing).

## Frequently Asked Questions

### What is prerendering in SEO?

Prerendering in SEO means producing a page's finished HTML before a crawler asks for it, so the crawler doesn't have to run JavaScript. It's done at build time, for every visitor, or by a prerender service that renders pages in a headless browser and serves cached copies to bots.

### Is prerender SEO good for Google?

Build-time prerendering is what Google calls static rendering, and Google recommends it. Bot-only prerender services count as dynamic rendering, which Google accepts when bots get similar content but describes as a workaround. Google renders JavaScript itself, so the bigger gain today is with crawlers that don't.

### Does prerendering count as cloaking?

Not when the content matches. Google says dynamic rendering that "produces similar content" isn't cloaking. It becomes cloaking when bots get different content, such as extra keywords or a different offer. A stale snapshot with old prices is a risk too, so keep the cache fresh.

### How much does prerender SEO cost?

As of 1 October 2026, Prerender.io's Starter plan lists $59 a month for 30,000 renders, SEO4Ajax's Project plan lists $39 a month billed monthly, and Ostr.io bills per render with no monthly fee. Your cost depends on URLs, refresh frequency and how each service counts usage.

### How often should prerendered pages refresh?

As often as the facts on them change. Pricing and stock pages need a refresh when the data changes, ideally triggered by that change. Blog posts and help articles can refresh weekly. Daily refreshes on every page multiply renders without making most pages any fresher.

### Do AI crawlers see prerendered pages?

Yes, if the service recognises them. A prerender service sends the cached copy only to user agents on its bot list, so check that AI search bots like `OAI-SearchBot`, `ChatGPT-User` and `PerplexityBot` are matched. Build-time prerendering avoids the question, because every visitor gets the same HTML.

## References

1. [Pricing, Prerender.io](https://prerender.io/pricing/)
2. [How does Prerender.io work?, Prerender.io docs](https://docs.prerender.io/docs/how-does-prerender.io-work)
3. [Pricing update 2026, Prerender.io docs](https://docs.prerender.io/docs/pricing-update-2026)
4. [How to add additional bots, Prerender.io docs](https://docs.prerender.io/docs/how-to-add-additional-bots)
5. [Pricing, SEO4Ajax](https://www.seo4ajax.com/pricing/)
6. [Pricing, Ostr.io](https://ostr.io/info/pricing)
7. [Pricing, Headless-Render-API](https://headless-render-api.com/pricing)
8. [Prerendering, Netlify Docs](https://docs.netlify.com/build/post-processing/prerendering/)
9. [Prerender extension now generally available, Netlify changelog](https://www.netlify.com/changelog/2025-12-16-prerender-extension-ga/)
10. [Browser Run pricing, Cloudflare Docs](https://developers.cloudflare.com/browser-run/pricing/)
11. [Pre-render pages for crawlers, Cloudflare Docs](https://developers.cloudflare.com/browser-run/how-to/pre-render-pages/)
12. [Rendertron, GoogleChrome on GitHub](https://github.com/GoogleChrome/rendertron)
13. [Dynamic rendering as a workaround, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering)
14. [Rendering on the Web, web.dev](https://web.dev/articles/rendering-on-the-web)
