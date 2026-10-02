---
title: Applebot User-Agent & Preparing for Apple Intelligence Search
description: What Applebot crawls for Siri, Spotlight and Safari, what Applebot-Extended controls, how it renders pages, and the server checks Apple search needs.
keyword: Applebot
date: 2026-11-19
updated: 2026-11-19
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, Apple
---

Applebot is Apple's web crawler. What it fetches feeds search in Spotlight, Siri and Safari, and Apple says the same crawl can give its AI models fresh context when Siri or Search answers a general question, with links to the sources. A second name, Applebot-Extended, isn't a crawler at all: it's a robots.txt switch that only decides whether Apple may train its foundation models on what the crawler collected.

So preparing for Apple Intelligence search is mostly crawler work. The crawler has to reach your server, be allowed by robots.txt, render the page, find nothing that tells it to stay quiet, and then rank. Each of those steps can fail on its own, and Apple's crawler page points to no crawl report or console for site owners, only an email address. You check each step yourself.

The timing matters. Apple put Siri AI into beta on 14 September 2026, and its [launch note](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/) says it answers "questions from the web on virtually any topic" and sits inside Spotlight on iPad and Mac. Apple's [About Applebot page](https://support.apple.com/en-us/119829) carries a publish date of 4 September 2026, and it still did on 1 October. Many sites have already made a choice: Rankbox's [AI bot crawler census](/blog/ai-bot-crawler-census) found 44.63% of news and media sites, and 5.94% of all 21,353 sites, fully block Applebot-Extended.

This guide covers the crawler itself: what it powers, which switch does what, how it renders, the robots.txt rules Apple applies, server checks and Apple's ranking factors, ending in a five-gate readiness check. For the exact user-agent strings and how to prove a request is really Apple's, see our reference on [Applebot user agent strings and verification](/blog/applebot-user-agent). For how Siri decides between its own answer and ChatGPT, see our guide to [Apple Intelligence routing](/blog/apple-intelligence-siri-chatgpt).

## Key Takeaways

- Applebot's crawl powers search in Spotlight, Siri and Safari, and can supply context for AI answers to general questions in Siri and Search. Blocking it removes you from all of them.
- Applebot-Extended never visits your site. Disallowing it only opts your pages out of training Apple's foundation models, and Apple says it plays no part in search ranking.
- If robots.txt never names Applebot, Apple applies your Googlebot group instead, as of 1 October 2026. None of the three robots.txt parsers tested for this guide models that fallback, so name Applebot in its own group.
- Applebot can render pages in a browser, so blocked JavaScript, CSS or API calls can leave it with an empty page. Apple says it doesn't crawl content behind logins or paywalls.
- Applebot ignores `crawl-delay` and slows down on its own when your site slows or returns errors.
- A CDN setting can block Applebot by accident. Cloudflare says customers who block AI training also block multi-purpose crawlers such as Applebot, Googlebot and Bingbot.
- Apple lists five ranking factors for its web search with no fixed weights: engagement, relevance, links, approximate location and page design.

## What Applebot Powers in October 2026

Apple's support page lists three jobs for the crawl, each with its own off switch.

### Search in Spotlight, Siri and Safari

This is the original job. Apple says the data it gathers powers "the search technology integrated into many user experiences" across its devices, naming Spotlight, Siri and Safari. Allowing Applebot in robots.txt lets your pages appear in those results "for Apple users around the world."

The archived [App Search Programming Guide](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/WebContent.html), last updated in 2016, explains where those pages live: the crawler stores them in "Apple's server-side index," which feeds Spotlight and Safari search results. That guide is no longer maintained, so treat it as background.

### Context for AI answers

The second job is newer. Applebot's data may give Apple's models current context "when AI models are used to generate output" in Apple products. Apple's example is answering broad general-knowledge questions in Siri and Search, with links to the sites used. In June 2026 Apple said Siri AI on iPad and Mac is part of Spotlight, so on those devices a Spotlight search can turn into an AI answer.

### Training data for Apple's models

The third job is training. Apple's [training data page](https://www.apple.com/legal/ai-regulations/training-data/), dated 9 September 2026, says Apple trains its generative models partly on "publicly available information crawled by Apple's web crawler Applebot," after filtering and plain-text extraction. Apple's [third-generation model announcement](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models) of 8 June 2026 adds that Apple respects "the rights of web publishers to opt out." That opt-out is Applebot-Extended.

### What Applebot doesn't power

Two Apple features sound like crawler work but aren't, going by Apple's own descriptions:

- **Safari page summaries.** Apple's iOS 26 guide says Apple Intelligence can [summarize the webpage you have open](https://support.apple.com/guide/iphone/get-webpage-summaries-in-safari-iph60293c790/26/ios/26), and in iOS 27, [Reader](https://support.apple.com/guide/iphone/hide-distractions-when-reading-iphdc30e3b86/ios) adds "a summary and table of contents" to longer pages. Both work from the page in front of the reader. Apple doesn't connect either to its crawler.
- **Podcast fetches.** Apple's page names a separate agent, `iTMS`, that may come from the same `applebot.apple.com` hosts. It only fetches URLs tied to content registered on Apple Podcasts, and it doesn't follow robots.txt because it isn't a general search crawler.

## Applebot vs Applebot-Extended: Which Switch Does What

Apple gives publishers several controls, and they overlap in confusing ways. The table below sets each one against the four uses of the crawl, in Apple's own wording, checked on 1 October 2026.

| Control                                | Crawler fetches the page     | Spotlight, Siri and Safari results   | Context for AI answers | Training Apple's models            |
| -------------------------------------- | ---------------------------- | ------------------------------------ | ---------------------- | ---------------------------------- |
| Nothing set (default)                  | Yes                          | Eligible                             | Eligible               | Eligible                           |
| `Disallow` for Applebot-Extended       | Yes                          | Eligible                             | Eligible               | Opted out                          |
| `nosnippet` (meta tag or header)       | Yes                          | Title only, no description           | Not used               | Not stated; use the training token |
| `isAccessibleForFree: false`           | Yes                          | Eligible                             | Not used               | Not stated                         |
| `noindex`                              | Yes, to read the tag         | Not in Spotlight or Siri Suggestions | Not stated             | Not stated                         |
| `Disallow` for Applebot                | No                           | Not crawled                          | No new crawl data      | No new crawl data                  |
| Content behind a login or hard paywall | No, per Apple's privacy page | Not crawled                          | Not crawled            | Not crawled                        |

### Applebot-Extended is a rule, not a visitor

Apple calls Applebot-Extended a "secondary user agent," but it also says plainly that it "does not crawl webpages." It's only used to decide what Apple may do with data the main crawler already fetched. That has two practical effects. You'll never see it in your logs, so no firewall rule can match it. And disallowing it costs you nothing in search: Apple says those rules "are not considered in ranking for Search."

Apple's own robots.txt example disallows only `/private/` for the token, which shows you can opt out section by section. Most sites that opt out use `Disallow: /` for the whole site.

### The page-level tags Applebot honors

Apple supports the standard robots meta tag and an Apple-only version, plus the HTTP header. Here's what each directive means to the crawler, in Apple's terms:

| Directive   | What the crawler does                                                                 |
| ----------- | ------------------------------------------------------------------------------------- |
| `noindex`   | Doesn't index the page, so it won't appear in Spotlight or Siri Suggestions           |
| `nosnippet` | No description or web answer; suggestions show the title only; not used as AI context |
| `nofollow`  | Doesn't follow links on the page                                                      |
| `none`      | All three of the above                                                                |
| `all`       | Indexes, snippets and may follow links                                                |

Three details are easy to miss. First, `<meta name="applebot" content="nosnippet">` targets Apple alone, leaving Google's snippets untouched. Second, the header form `X-Robots-Tag: applebot: nosnippet` is how you tag PDFs and images, which can't carry meta tags, and it never shows up in a page's source. Third, the paywall flag works only on whole pages: Apple says "Section-level markup using `hasPart` is not supported." Our glossary entry on [snippet controls](/glossary/snippet-controls) explains how these tags work across search engines.

## How Applebot Renders Pages

Apple says outright that its crawler renders. The support page puts it this way: "Applebot may render the content of your website within a browser."

### What Apple says it does

The support page is short. If robots.txt blocks the JavaScript, CSS, XHR requests or other files a page needs, Applebot "may not be able to render the content properly." Apple gives you two ways out: let it fetch everything a person's browser would, or make sure the page still makes sense when some files are missing, which Apple calls "graceful degradation."

Apple's machine learning team went further in a [June 2025 report](https://machinelearning.apple.com/research/apple-foundation-models-2025-updates). For training data, it described "headless rendering, enabling full-page loading, dynamic content interaction, and JavaScript execution," plus "interaction simulation" for pages that depend on clicks. That describes the training pipeline, not search, so don't read it as proof that every search fetch runs every script. The support page's "may render" is the safer promise.

That sets Apple apart. In [Vercel and MERJ's December 2024 study](https://vercel.com/blog/the-rise-of-the-ai-crawler), none of the major AI crawlers they measured ran JavaScript, including OpenAI's, Anthropic's and Perplexity's. A client-rendered page can therefore look fine to Apple and blank to them. Our guide to [dynamic rendering and prerendering for AI crawlers](/blog/dynamic-rendering-prerendering-ai-crawlers) covers the fix per framework.

### Four things that hide your content from Applebot

1. **Blocked files.** A `Disallow` that covers `/assets/`, `/static/` or `/api/` can strip the scripts and data a page needs. Check this first, because it often comes from the Googlebot fallback described in the next section.
2. **Logins and paywalls.** Apple's [crawler privacy page](https://support.apple.com/en-us/120320), published 9 September 2026, says Applebot "does not crawl data from websites that require login credentials or that are protected by a paywall." Its main crawler page, meanwhile, says pages flagged `isAccessibleForFree: false` can still appear in search. Apple doesn't explain how the two fit, so keep anything you want found outside the wall.
3. **Hash routes.** The archived 2016 guide says "Applebot ignores the fragment identifier component of a URL." If your pricing tabs live at `/pricing#agency` and `/pricing#enterprise`, Apple may see one URL. Give each view its own path.
4. **Text in images.** If your prices only appear inside a graphic, a renderer that reads text won't find them. Put key facts in HTML text.

### A quick render test

Open a key page in Chrome, then open DevTools, go to the Network panel and block the URL patterns your robots.txt disallows for Applebot (or for Googlebot, if Applebot isn't named). Reload. What's left on screen is roughly what Apple can render. For the stricter case, what a crawler that runs no JavaScript gets, view the page source, or run the free [AI search readiness check](/tools/ai-search-readiness-check), which fetches raw HTML only. See our glossary on [server-side rendering](/glossary/server-side-rendering) for why the raw HTML matters to other crawlers.

## The robots.txt Rules Apple Applies

Apple says Applebot "respects standard robots.txt directives" in its search crawls. The standard is [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.txt), and Apple follows it with one big exception.

### The fallback order

1. **A group that names Applebot.** If one exists, that's the group used.
2. **Your Googlebot group.** If robots.txt never mentions Applebot but does mention Googlebot, Apple says "the Apple robot will follow Googlebot instructions." The page still said this on 1 October 2026.
3. **The `*` group.** If neither is named, the standard rule applies, and the crawler obeys the group for all user agents.

Step 2 is not part of RFC 9309, which sends unnamed crawlers straight to `*`. It means a rule you wrote for Google years ago can quietly govern Apple today. Apple doesn't say whether a group for a Google variant, such as `Googlebot-Image`, counts, so naming Applebot removes the guesswork. For every other bot's tokens, see our [AI crawler directory](/blog/ai-crawler-directory). For which AI bots to block by goal, with ready-made files, see our [AI crawler robots.txt guide](/blog/ai-crawler-robots-txt-guide), and for the basic syntax, our [robots.txt glossary entry](/glossary/robots-txt).

### Crawl-delay doesn't work

"Applebot does not follow crawl-delay," Apple says. Instead, its "crawl rate adjusts automatically when a site slows down or returns errors," and Apple caches what it fetched to avoid repeat visits. If you need to throttle it hard, do it at the server with rate limits, after confirming the requests are genuine.

### A tested template

This file keeps Applebot in search, opts out of training and stops the Googlebot fallback from deciding anything. Adjust the private paths to your own site.

```txt
# Apple: opt out of model training only
User-agent: Applebot-Extended
Disallow: /

# Apple: stay in Spotlight, Siri and Safari search
User-agent: Applebot
Disallow: /account/

# Google keeps its own rules
User-agent: Googlebot
Disallow: /account/

User-agent: GPTBot
Disallow: /

User-agent: *
Disallow: /account/
```

On 1 October 2026 this file was run through three parsers: Python 3.14.3's built-in `urllib.robotparser`, Protego 0.7.0 and the npm package robots-parser 3.0.1. All three agreed: Apple's crawler may fetch `/`, `/pricing` and `/assets/app.js` but not `/account/settings`, and the training token is blocked everywhere. Two layout choices keep simpler parsers honest. Python's parser takes the first group whose name appears inside the bot's name, so the longer `Applebot-Extended` group goes first. It also applies rules in file order, so the template leaves out an `Allow: /` line that would otherwise win before the `Disallow`.

### Why testers miss the fallback

The same three parsers were run on a file with no Apple group and a Googlebot group that disallows `/assets/`. All three said Apple's crawler could fetch `/assets/app.js`, because they fall back to `*`. Apple's rule says the opposite. So when Apple isn't named, test your paths as Googlebot. Better still, name it.

## Server Checks Before Apple Intelligence Search Reaches You

robots.txt only matters if the crawler's request gets an answer. Four server-side checks catch most of the rest.

### Status codes

Apple doesn't publish how its crawler treats each HTTP status code. It only says the crawler slows down when your site returns errors. For robots.txt itself, RFC 9309 sets the baseline: if the file returns a 4xx status, a crawler "MAY access any resources," and if it returns a 5xx, the crawler "MUST assume complete disallow." A robots.txt that errors during deploys can pause Apple's crawl. Serve it as a static file with a 200.

For pages, use plain HTTP: 200 for live pages, 301 for moved ones, 404 or 410 for pages that are gone. Avoid soft errors, where a missing page returns 200 with a "not found" message.

### Speed

Apple gives no speed threshold. What it does say is that the crawler backs off when your site slows down, so a slow site gets crawled less. "Webpage design characteristics" is also one of Apple's ranking factors, though Apple doesn't define it.

### Firewalls and CDNs

A block can also sit outside robots.txt. Cloudflare's [July 2026 announcement](https://blog.cloudflare.com/content-independence-day-ai-options/) says that from 15 September, "multi-purpose crawlers such as Googlebot, Applebot, and BingBot will be blocked by customers who have selected to block Training," whether through its new AI traffic options or the older Block AI bots toggle. Its [changelog](https://developers.cloudflare.com/changelog/post/2026-07-01-ai-traffic-options/) says the same. Our [Cloudflare challenge trap guide](/blog/cloudflare-challenge-trap) shows where to see the block and how to block trainers by name instead, and our guide to [Cloudflare AI bot management](/blog/cloudflare-ai-bot-management) walks through each setting.

Before you let anything through a firewall because it claims Apple's name, confirm it's real. Apple publishes a reverse DNS rule and an IP list, and they don't fully overlap. Our [Applebot user agent reference](/blog/applebot-user-agent) shows the tested method.

### Recognize Applebot in your logs

Apple documents one general format and two example strings, for a Mac and an iPhone. Both end in `(Applebot/0.1; +http://www.apple.com/go/applebot)`, and Apple warns that the browser version in front of that may change. So match the `Applebot/` token, not the whole string. Requests from `iTMS` come from the same hosts but serve Apple Podcasts. Our [Applebot user agent reference](/blog/applebot-user-agent) lists the exact strings, log one-liners and a verification script run against Apple's own list.

### A three-command curl check

These commands show what your server returns to a request carrying Apple's desktop crawler string. Replace the URL with one of yours.

```bash
URL="https://www.example.com/pricing"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)'
curl -s -o /dev/null --max-time 20 -A "$UA" -w 'page %{http_code} %{time_total}s\n' "$URL"
curl -s -D - -o /dev/null --max-time 20 -A "$UA" "$URL" | grep -i '^x-robots-tag' || echo 'no X-Robots-Tag header'
curl -s --max-time 20 -A "$UA" "$URL" | grep -ioE '<meta[^>]+name="?(robots|applebot)"?[^>]*>' || echo 'no robots or applebot meta tag'
```

These commands were run on 1 October 2026 against a local test server that sent `X-Robots-Tag: applebot: nosnippet` and an Apple-only meta tag, and they printed both. Against `example.com` they printed a 200 and no tags.

One caution: this only tests your origin's response to the name. If your CDN checks crawler IPs, it may refuse your laptop's imitation while letting the real crawler through, or the reverse. Your access logs show what Apple actually received.

## Apple's Ranking Factors and What You Control

Apple's crawler page lists five factors its search may use, and adds that they carry no set weights. The table turns each into something you can act on. The last column says how firm the link is.

| Factor, as Apple lists it                            | What you can change                                                                 | Evidence                                                |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Aggregated user engagement with search results       | Titles and descriptions that match what the page delivers, so people who click stay | Documented factor; how it's measured isn't stated       |
| Relevancy of search terms to page topics and content | Use the words buyers use, in headings and the first lines                           | Documented factor                                       |
| Number and quality of links from other pages         | Earn mentions and links from sites in your category                                 | Documented factor                                       |
| Approximate user location signals                    | For local businesses, a correct place card in Apple Business                        | Documented factor; the place-card link is our inference |
| Webpage design characteristics                       | A page that loads and reads well on an iPhone                                       | Documented factor; Apple doesn't define it              |

Two notes. First, Apple's [Search and Privacy statement](https://www.apple.com/legal/privacy/data/en/siri-suggestions-search/) says Safari and Spotlight send Apple limited data, including location and the suggestions people choose, without linking it to their account. That's the likely source of the engagement and location signals, though Apple doesn't say so directly. Second, these factors describe Apple's web search. Apple doesn't say whether Siri AI picks sources for its answers the same way.

An old Apple note hints at how engagement works. Its archived [2015 App Search FAQ](https://developer.apple.com/library/archive/technotes/tn2416/_index.html) told app makers that their "engagement-to-shown ratio" would be "an important factor." That was about app results a decade ago, so it's history, not a current rule.

For the routing side of Siri, including when ChatGPT answers instead, our [Apple Intelligence routing guide](/blog/apple-intelligence-siri-chatgpt) has a three-door audit. For every assistant's crawler and listing at once, use the [voice search optimization checklist](/blog/voice-search-optimization-2026).

## The Five-Gate Applebot Readiness Check

A page reaches an Apple answer only if it clears five gates in order. A failure early on makes everything after it irrelevant, so audit top-down. We call this the Five-Gate Applebot Readiness Check: Reach, Permit, Render, Use and Rank, with three checks each.

| Gate   | Check                                                                           | How to verify                                       |
| ------ | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| Reach  | R1. Your CDN and firewall let verified Applebot through                         | CDN bot settings, then logs for its hits with a 200 |
| Reach  | R2. Public pages need no login and return 200                                   | Open each key page in a private window              |
| Reach  | R3. robots.txt returns 200 or 404, never 5xx                                    | `curl -I` on `/robots.txt`                          |
| Permit | P1. robots.txt names Applebot in its own group                                  | Read the file                                       |
| Permit | P2. The crawler may fetch the scripts, styles and APIs key pages need           | A parser, testing the asset paths                   |
| Permit | P3. Applebot-Extended matches your training decision                            | Read the file                                       |
| Render | D1. Key text appears when rendered with only the files Apple may fetch          | DevTools request blocking                           |
| Render | D2. Each view has its own path, not a `#fragment`                               | Click through tabs and watch the URL                |
| Render | D3. Prices and key facts are HTML text, not images                              | Select the text with your cursor                    |
| Use    | U1. No `noindex` in meta tags or headers on pages you want found, PDFs included | The curl check above                                |
| Use    | U2. No `nosnippet` on pages you want in AI answers                              | The curl check above                                |
| Use    | U3. `isAccessibleForFree: false` only on truly paywalled pages                  | Search your JSON-LD templates                       |
| Rank   | K1. Titles and opening lines use your buyers' words                             | Compare with real buyer questions                   |
| Rank   | K2. Other sites in your category link to you                                    | A backlink tool                                     |
| Rank   | K3. Pages read well on an iPhone                                                | Load them on one                                    |

Score one point per pass. Skip checks that can't apply, and divide by what's left.

### Worked example: Tallyfold

Tallyfold is a fictional invoicing and payments app for agencies, with fictional rivals Brindlework and Kestrelyn, at the reserved domain `tallyfold.example`. Everything here is invented to show the method. Its pricing page should let Siri say one thing correctly: Tallyfold costs $39 a month with 3 users included, then $12 per extra user, so a five-person agency pays $39 + 2 × $12 = $63 a month.

Tallyfold's marketing site is a single-page React app. Its first audit:

| Gate      | Passed      | Failed checks and why                                                                                                                                                                     |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reach     | 2 of 3      | R1: in July the team set Cloudflare's Training preset to Block, which also blocks Apple's crawler                                                                                         |
| Permit    | 0 of 3      | P1: Applebot isn't named. P2: the Googlebot group's old `Disallow: /assets/` and `/api/` now apply to Apple. P3: the team wanted to opt out of training but never added Applebot-Extended |
| Render    | 1 of 3      | D1: without its scripts the pricing page is an empty shell. D2: plans sit at `/pricing#agency` and `/pricing#studio`                                                                      |
| Use       | 1 of 3      | U1: help-center PDFs send `X-Robots-Tag: noindex`. U3: the blog template marks every post `isAccessibleForFree: false`                                                                    |
| Rank      | 3 of 3      | None                                                                                                                                                                                      |
| **Total** | **7 of 15** | **8 fails**                                                                                                                                                                               |

That's 7 of 15, or 47%. Notice that the Rank gate passes while the page still can't appear. Good content was never the problem.

The fixes, in order of reach and effort:

1. **Cloudflare (R1).** Set the Training preset back to Allow and block training crawlers by name, so the multi-purpose rule stops catching Apple's crawler.
2. **robots.txt (P1, P2, P3).** Swap in the template above. Apple's crawler gets its own group, the asset and API paths open, and the training token carries the training opt-out that Cloudflare used to.
3. **Rendering follows (D1).** With scripts and the plans API now allowed, Apple can render the prices. No code change needed.
4. **Headers and markup (U1, U3).** Remove the `noindex` header from public PDFs, and set the paywall flag only on the two paid reports that are really gated.

Those four steps fix seven checks, so Tallyfold moves from 7 to 14 of 15, or 93%. The last fail, D2, needs a developer: each plan gets its own path, such as `/pricing/agency`. That brings it to 15 of 15.

One more step serves crawlers beyond Apple. Since most AI crawlers run no JavaScript, Tallyfold should also server-render the pricing page, so the $63 example is in the HTML from the first byte. Apple would read the page either way. Others won't.

None of this guarantees that Siri will mention Tallyfold. It removes every documented reason it can't.

## Where Rankbox Fits

Rankbox works on the Rank gate, mostly check K1. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask AI assistants and search engines, with volume, difficulty and intent shown as model estimates. The [Citation-Ready Writer](/features/citation-ready-writer) then researches the live web and drafts source-backed articles of 2,000 to 3,500 words that open with a plain answer, and articles reach your site through Rankbox's API.

The first four gates are yours or your host's. Rankbox doesn't run a CDN, manage robots.txt, change headers or prerender pages, and it doesn't track whether Siri or any other assistant cites you. Signup is free, the Business plan is $49.50 a month, and adding a card starts a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### What is Applebot used for?

Applebot is Apple's web crawler. Its data powers search in Spotlight, Siri and Safari, can give Apple's AI models context for answers to general questions in Siri and Search, and may help train Apple's foundation models. Each use has its own control: robots.txt for the crawl, `nosnippet` for AI answers, and Applebot-Extended for training.

### Is Applebot-Extended a separate crawler?

No. Apple says Applebot-Extended "does not crawl webpages." It's a robots.txt token that tells Apple whether pages the crawler already fetched may train its foundation models. It never appears in logs, and Apple says its rules aren't considered in search ranking.

### Does Applebot render JavaScript?

Apple says Applebot "may render the content of your website within a browser," and its 2025 model report describes JavaScript execution in its crawl pipeline. Rendering can fail if robots.txt blocks the scripts, styles or API calls a page needs, so allow them or make sure the page works without them.

### What happens if my robots.txt doesn't mention Applebot?

It follows your Googlebot group if you have one, according to Apple's support page as of 1 October 2026. If neither is named, it falls back to the `*` group. The parsers tested for this guide don't model the Googlebot step, so name Applebot in its own group.

### Does Applebot follow crawl-delay?

No. Apple says its crawler ignores `crawl-delay` and instead slows its crawl automatically when a site slows down or returns errors. To limit it harder, rate-limit at your server or CDN, after checking that the requests really come from Apple.

### How can I tell if a request really comes from Applebot?

Check the source IP. Apple says real traffic resolves by reverse DNS to a host under `applebot.apple.com`, and it publishes a JSON list of the crawler's IP ranges. Accept a request that passes either check. Our [Applebot user agent guide](/blog/applebot-user-agent) has a tested script.

## References

1. [About Applebot, Apple Support](https://support.apple.com/en-us/119829)
2. [Applebot model training and individual privacy rights, Apple Support](https://support.apple.com/en-us/120320)
3. [Datasets used for Apple's generative AI systems and services, Apple Legal](https://www.apple.com/legal/ai-regulations/training-data/)
4. [Updates to Apple's On-Device and Server Foundation Language Models, Apple Machine Learning Research](https://machinelearning.apple.com/research/apple-foundation-models-2025-updates)
5. [Introducing the Third Generation of Apple's Foundation Models, Apple Machine Learning Research](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)
6. [Apple introduces Siri AI, Apple Newsroom](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/)
7. [Search & Privacy, Apple Legal](https://www.apple.com/legal/privacy/data/en/siri-suggestions-search/)
8. [Use Apple Intelligence in Safari on iPhone (iOS 26), Apple Support](https://support.apple.com/guide/iphone/get-webpage-summaries-in-safari-iph60293c790/26/ios/26)
9. [Hide distractions when reading articles in Safari on iPhone (iOS 27), Apple Support](https://support.apple.com/guide/iphone/hide-distractions-when-reading-iphdc30e3b86/ios)
10. [App Search Programming Guide: Mark Up Web Content (archived), Apple Developer](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/WebContent.html)
11. [Technical Note TN2416: iOS Search API Best Practices and FAQs (archived), Apple Developer](https://developer.apple.com/library/archive/technotes/tn2416/_index.html)
12. [Applebot IP CIDRs (JSON), Apple](https://search.developer.apple.com/applebot.json)
13. [RFC 9309: Robots Exclusion Protocol, IETF](https://www.rfc-editor.org/rfc/rfc9309.txt)
14. [Your site, your rules: new AI traffic options for all customers, Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)
15. [New options to manage AI traffic, Cloudflare Changelog](https://developers.cloudflare.com/changelog/post/2026-07-01-ai-traffic-options/)
16. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
