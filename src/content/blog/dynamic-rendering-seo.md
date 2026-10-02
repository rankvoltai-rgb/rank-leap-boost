---
title: Dynamic Rendering SEO: What Google Says Now and Safer Alternatives
description: Dynamic rendering SEO in 2026: what Google's docs say now, where it becomes cloaking, a bot-parity check, and safer options like SSR and static rendering.
keyword: dynamic rendering SEO
date: 2026-11-05
updated: 2026-11-05
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, SEO
---

Dynamic rendering SEO is the practice of serving search engine bots a prerendered HTML copy of a JavaScript page while people get the normal client-side version. Google now treats it as a legacy fix: its page says dynamic rendering ["was a workaround and not a long-term solution"](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering) and recommends server-side rendering, static rendering or hydration instead.

Dynamic rendering SEO still works, and Google doesn't call it cloaking as long as bots get similar content. But it adds a second copy of every page that someone has to keep in step with the first. For most sites in 2026, the better move is to stop needing it.

This post covers dynamic rendering SEO as it stands in October 2026: what Google says now and how that changed, where the cloaking line sits, a parity check you can run today, and the safer alternatives. If you're also fixing a JavaScript site for ChatGPT, Claude and Perplexity, our guide to [dynamic rendering and prerendering for AI crawlers](/blog/dynamic-rendering-prerendering-ai-crawlers) has the evidence on what those crawlers read and a fix for each framework.

## Key Takeaways

- Google recommended dynamic rendering "as a workaround solution" in 2018, said it "isn't a recommended solution" in August 2022, and called it a "deprecated workaround" in February 2024.
- Google's current page, last updated 10 December 2025, says it "was a workaround" and that it "creates additional complexities and resource requirements."
- Dynamic rendering SEO stays on the right side of Google's rules when the bot copy matches what people see. Different content for bots is cloaking.
- A stale or broken bot copy is the usual way a setup drifts. Check parity on a schedule, not once.
- Server-side rendering, static rendering and hydration send one version to everyone, so there's nothing to keep in sync.
- The best dynamic rendering SEO plan for 2026 is an exit plan: move one template at a time, checking parity before you remove the bot switch.

## How Dynamic Rendering SEO Works

Dynamic rendering puts a switch in front of your site. Google's description is short: the server has to ["detect crawlers (for example, by checking the user agent),"](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering) then route those requests to a rendering server. Everyone else gets the normal page.

1. A request arrives, and the server or CDN reads its `User-Agent` header.
2. If the user agent matches a list of bots, the request goes to a renderer. That's a headless browser such as Chrome, run by you or by a prerender service.
3. The renderer loads the page, runs its JavaScript and saves the finished HTML, usually in a cache.
4. The bot gets that static HTML. A person gets the usual app shell and scripts, and the browser builds the page.

The [2018 version of Google's guide](https://web.archive.org/web/20181001220905/https://developers.google.com/search/docs/guides/dynamic-rendering) named three common renderers: Puppeteer, Rendertron and Prerender.io. Its sample bot list had five entries, from `googlebot` to `linkedinbot`. Lists like that are the weak point. A crawler that isn't on the list gets the shell, and that includes the AI crawlers that arrived after most setups were written.

### What dynamic rendering is not

Three terms get mixed up with it:

- **Server-side rendering** builds HTML on the server for every visitor, people and bots alike. There is no bot switch.
- **Next.js "dynamic rendering"** is the framework's name for pages ["rendered at request time rather than build time."](https://nextjs.org/docs/app/glossary#dynamic-rendering) That's ordinary server rendering, not Google's technique.
- **Prerendering** usually means building HTML ahead of time. It becomes dynamic rendering only when a bot list decides who gets the prerendered copy. Our [prerender SEO guide](/blog/prerender-seo) covers the services and their costs.

## Google's Position on Dynamic Rendering SEO, Then and Now

Google's wording has shifted from "we recommend" to "was a workaround" over seven years. Each step is on the record in its [documentation updates log](https://developers.google.com/search/updates) or an archived copy of the page.

| When                           | What Google said                                                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2018                           | "We recommend dynamic rendering as a workaround solution to this problem," because "not all search engine crawlers are able to process it successfully or immediately" |
| August 2022                    | Updated the page "to explain that this isn't a recommended solution, and is a workaround if you have no other choice"                                                  |
| 6 February 2024                | Updated the page "to clarify it's a deprecated workaround"                                                                                                             |
| 10 December 2025 (last update) | "Dynamic rendering was a workaround and not a long-term solution for problems with JavaScript-generated content in search engines"                                     |

The current page gives the reason in one line: dynamic rendering is "not a recommended solution, because it creates additional complexities and resource requirements." It no longer includes setup steps or names any renderer.

Google's own rendering has also been in place for years. Its [JavaScript SEO guide](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) says Google Search runs JavaScript "with an evergreen version of Chromium." In March 2026, Google removed an old accessibility note from that guide, saying Search "has been rendering JavaScript for multiple years now."

![Dynamic Rendering for JavaScript web apps - JavaScript SEO](youtube:CrzUP6MmBW4 "Martin Splitt shows how to set up dynamic rendering, from April 2019, when Google still recommended it as a workaround. Google now calls it a deprecated workaround.")

### Where Google's own pages disagree

One Google page hasn't caught up. The web.dev article [Rendering on the Web](https://web.dev/articles/rendering-on-the-web), last updated 5 January 2026, still says dynamic rendering "has also become an option worth considering if your architecture depends heavily on client-side JavaScript." For dynamic rendering SEO decisions, the Search Central page is the one to follow. It's the page that speaks for Google Search, and it was updated more recently on this exact question.

### What Bing says

Bing's [Webmaster Guidelines](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a), which now cover Copilot and grounding results, don't mention dynamic rendering as of 1 October 2026. They ask you to avoid "hiding critical content behind client-side rendering," and say sites should not rely on "serving materially different experiences to crawlers and visitors."

## Dynamic Rendering SEO vs Cloaking

The technique isn't the problem. The content is. Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) define cloaking as "presenting different content to users and search engines with the intent to manipulate search rankings and mislead users." One of its examples is "inserting text or keywords into a page only when the user agent that is requesting the page is a search engine."

Google's dynamic rendering page draws the line from the other side: "As long as your dynamic rendering produces similar content, Googlebot won't view dynamic rendering as cloaking." Its example of crossing it is a site that shows people a page about cats and crawlers a page about dogs.

So the working rule is simple. The same facts and content in a different format is acceptable. Different content for bots is cloaking.

| What the bot copy contains                                           | Where it stands                                                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| The same text, links and prices as the rendered page, as static HTML | Similar content: fine, per Google                                                           |
| An error page because the renderer failed                            | Google treats it like any other error page, not as cloaking, but the page's content is lost |
| Extra keywords or links people never see                             | Cloaking: Google's own example                                                              |
| A different topic or offer                                           | Cloaking: the cats and dogs example                                                         |
| A snapshot from weeks ago with old prices                            | Not cloaking by intent, but searchers and AI answers still get wrong facts                  |

The last row is the easiest to fall into. Nobody plans to show bots old prices. A cache that refreshes once a month does it anyway.

## The Bot-Parity Check

If you rely on dynamic rendering SEO, check that the bot copy still matches the page people see. We call this the Bot-Parity Check: eight comparisons, run on each template after every release and at least monthly.

| #   | Compare                        | Pass if                                        |
| --- | ------------------------------ | ---------------------------------------------- |
| 1   | HTTP status code               | Both return the same code, usually 200         |
| 2   | `<title>`                      | Identical                                      |
| 3   | Meta description               | Identical                                      |
| 4   | Canonical tag                  | Same URL in both, and only one tag             |
| 5   | Robots meta and `X-Robots-Tag` | Same directives                                |
| 6   | Main heading and body text     | Same wording; word counts within a few percent |
| 7   | Prices, dates and other facts  | Same values                                    |
| 8   | Internal links and JSON-LD     | Same targets and the same structured data      |

The script below fetches the copy a bot gets and the page a headless Chrome renders, then prints the title, canonical, robots meta and word count for each. It was run on 1 October 2026 with Chrome on macOS. On a server-rendered Google help page, both copies had the same title and canonical, with 1,627 and 1,675 words. On Bing's Webmaster Guidelines page, which builds its text in the browser and uses no dynamic rendering, the bot copy had 6 words and a different title, while the rendered page had 1,899 words.

```bash
#!/usr/bin/env bash
# bot-parity.sh: compare the copy a bot receives with the page a browser renders.
# Usage: CHROME=/path/to/chrome ./bot-parity.sh https://example.com/pricing
url="$1"
chrome="${CHROME:-google-chrome}"
bot='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

curl -sL --max-time 20 -A "$bot" "$url" > bot.html
"$chrome" --headless --disable-gpu --virtual-time-budget=10000 --dump-dom "$url" > rendered.html 2>/dev/null

for f in bot.html rendered.html; do
  echo "== $f"
  grep -o -i -E '<title>[^<]*' "$f" | head -1
  grep -o -i -E '<link[^>]*rel="canonical"[^>]*>' "$f" | head -1
  grep -o -i -E '<meta[^>]*name="robots"[^>]*>' "$f" | head -1
  words=$(perl -0777 -pe 's/<!--.*?-->//gs; s/<(script|style|noscript)\b.*?<\/\1>//gis; s/<[^>]+>/ /g' "$f" | wc -w | tr -d ' ')
  echo "words: $words"
done
```

Three notes. The user agent above is one Google lists for Googlebot, but your setup may match other strings, so test each one on your bot list. The `--virtual-time-budget` flag gives scripts time to finish; without it, Chrome returned the Bing page before its text loaded. And the grep patterns are rough. Use them to spot drift, then read both files for the details in rows 7 and 8.

## Safer Alternatives to Dynamic Rendering

Google names three replacements for dynamic rendering SEO. All of them send one version of the page to everyone, which removes the parity problem entirely.

- **Server-side rendering.** The server builds the full HTML for each request, so content is always current. web.dev's definition: it "generates the full HTML for a page on the server in response to navigation." See our [server-side rendering](/glossary/server-side-rendering) glossary entry.
- **Static rendering.** HTML is built ahead of time, usually at deploy. web.dev says static rendering "happens at build time." It's the cheapest to serve and suits pages that change less often than you deploy.
- **Hydration.** The browser's JavaScript takes over server-built HTML and makes it interactive. web.dev calls it "running client-side scripts to add application state and interactivity to server-rendered HTML." It isn't a separate rendering mode; it's how server-rendered and static pages become interactive.

Which one fits depends on your framework, and most current frameworks do one of them by default. The [hub guide's framework table](/blog/dynamic-rendering-prerendering-ai-crawlers) lists the defaults and switches for nine of them.

### Moving off dynamic rendering safely

Most teams retire a dynamic rendering SEO setup one template at a time.

1. **List the routes the renderer serves.** Your prerender service or server logs show which URLs bots fetched through it.
2. **Pick an alternative per template.** Pricing and marketing pages often suit static rendering. Search results and stock levels suit SSR.
3. **Ship one template first.** Run the Bot-Parity Check on the new version against the old bot copy. The new HTML should hold everything the old copy did.
4. **Remove the user-agent rule for that template.** Keep the renderer for the rest until each template has moved.
5. **Watch for four weeks.** Check Search Console's Page indexing report and your logs for 5xx errors and empty pages, then move the next template.

One more check while you're there: don't block your JavaScript or CSS in robots.txt. Google says it "won't render JavaScript from blocked files or on blocked pages." Paste your file into our free [robots.txt tester](/tools/robots-txt-tester) and test a script URL as Googlebot to see which line, if any, blocks it.

### Does dynamic rendering SEO help with AI crawlers?

Only for the bots on your list. Published tests, starting with [Vercel and MERJ's December 2024 study](https://vercel.com/blog/the-rise-of-the-ai-crawler), found that OpenAI's, Anthropic's and Perplexity's crawlers didn't run JavaScript. So an AI crawler that your renderer doesn't recognise gets the empty shell. If you keep dynamic rendering, add the AI search bots you want to the list. Our [AI crawler directory](/blog/ai-crawler-directory) has their user agents.

That's the strongest case for the alternatives above. Server-rendered or static HTML reaches every crawler, including ones that don't exist yet, with no list to update. You can check what a page offers without JavaScript in a few seconds with the free [AI search readiness check](/tools/ai-search-readiness-check).

Rankbox doesn't run prerendering, CDNs or bot detection, and it doesn't change how your site renders. Those fixes belong to your developer. What Rankbox does is research the questions buyers ask AI assistants and write source-backed articles that reach your site through its API, so they land in whatever rendering setup you choose. Rankbox doesn't track AI citations today. The Business plan is $49.50 a month, with a 7-day trial when you add a card; see [pricing](/pricing).

## Frequently Asked Questions

### Is dynamic rendering bad for SEO?

Not by itself. Google accepts dynamic rendering when bots get content similar to what people see. The risks are practical: a stale cache, a renderer that fails, or a bot list that misses newer crawlers. Google calls it a workaround and recommends server-side rendering, static rendering or hydration for the long term.

### Is dynamic rendering SEO the same as cloaking?

No, as long as the content matches. Google says dynamic rendering that "produces similar content" isn't cloaking, and that serving completely different content to users and crawlers can be. Showing bots extra keywords, extra links or a different offer crosses the line.

### Does Google still support dynamic rendering?

Google still reads pages served this way, but it no longer recommends the method. Its page, last updated 10 December 2025, says dynamic rendering "was a workaround and not a long-term solution." Google stopped recommending it in August 2022 and called it a deprecated workaround in February 2024.

### What replaced dynamic rendering?

Server-side rendering, static rendering and hydration, according to Google's own page. Each sends the same HTML to people and bots, so there's no second copy to maintain. Most modern frameworks, including Next.js, Nuxt, SvelteKit and Astro, do one of these by default.

### How can I tell if my site uses dynamic rendering?

Fetch a page twice with curl, once with a browser user agent and once with Googlebot's, and compare the HTML. If the Googlebot copy is a full page and the browser copy is a script shell, a bot switch is in place. Your CDN, server config or prerender service settings will confirm it.

### Does dynamic rendering SEO still matter in 2026?

It matters for sites still running it, mostly older single-page apps. For new builds, server or static rendering is the better choice. It also matters for AI search: crawlers that don't run JavaScript only get the full page if they're on your bot list or your HTML is complete for everyone.

## References

1. [Dynamic rendering as a workaround, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering)
2. [Latest Google Search documentation updates, Google Search Central](https://developers.google.com/search/updates)
3. [Get started with dynamic rendering (October 2018 capture), Google Developers via the Internet Archive](https://web.archive.org/web/20181001220905/https://developers.google.com/search/docs/guides/dynamic-rendering)
4. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
5. [Understand the JavaScript SEO basics, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
6. [Google's common crawlers, Google Crawling Infrastructure](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
7. [Rendering on the Web, web.dev](https://web.dev/articles/rendering-on-the-web)
8. [Bing Webmaster Guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a)
9. [Next.js glossary, Vercel](https://nextjs.org/docs/app/glossary)
10. [The rise of the AI crawler, Vercel and MERJ](https://vercel.com/blog/the-rise-of-the-ai-crawler)
