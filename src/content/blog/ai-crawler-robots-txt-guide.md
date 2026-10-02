---
title: The Complete AI Crawler robots.txt Guide
description: Pick an AI crawler robots.txt policy by goal, then copy one of six tested templates: block training, keep AI search, or lock one folder.
keyword: AI crawler robots.txt
date: 2026-10-29
updated: 2026-10-29
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, AI Search
---

An AI crawler robots.txt policy is a set of named groups in your robots.txt file, one for each AI bot you want to treat differently from everyone else. The big decision is not "AI yes or no". It's which jobs you allow: training future models, building an AI search index, or fetching a page live because someone asked a question. Most vendors now run a separate bot for each job, so you can say yes to one and no to another.

That split is the trade-off at the heart of the topic. Blocking GPTBot or ClaudeBot keeps your future pages out of training sets, and publishers lean that way: in Rankbox's [crawl of 21,353 sites](/blog/ai-bot-crawler-census), 47.56% of top news sites fully block GPTBot. Blocking OAI-SearchBot, Claude-SearchBot or PerplexityBot removes you from the answers those engines give buyers, which is rarely what a business wants. The same crawl found that 53.0% of sites that fully block GPTBot still leave OAI-SearchBot open.

This guide makes that call by goal. It covers how robots.txt matching works under RFC 9309, what each vendor says its bots do with your file as of 1 October 2026, six AI crawler robots.txt templates for six goals, how each template was tested with real parsers, and what the file can't do. For every bot's user-agent string and IP list, use the [AI crawler directory](/blog/ai-crawler-directory). For testing and fixing a file that misbehaves, see our companion guide to [AI crawler robots.txt mistakes and how to test for them](/blog/ai-crawler-robots-txt).

## Key Takeaways

- Decide by job, not by vendor. Training bots, AI search bots and live fetchers each need their own line in your AI crawler robots.txt policy.
- A bot that has its own group ignores `User-agent: *` completely. Repeat your private paths in every named group.
- Google-Extended and Applebot-Extended are tokens, not crawlers. Blocking them opts you out of Gemini and Apple model training without touching Google or Apple search.
- User-triggered fetchers are the soft spot. OpenAI says robots.txt "may not apply" to ChatGPT-User, Perplexity says Perplexity-User "generally ignores" it, and Google, Meta and Amazon say similar things. Anthropic says Claude-User follows it.
- Applebot follows your Googlebot rules when you don't name it, and Amzn-SearchBot copies the rules you give other search bots. An allowlist has to name both.
- All six templates here passed 71 of 71 checks in Google's open-source robots.txt parser, and in Protego, robots-parser and Python's urllib.robotparser.
- robots.txt is a request. To stop a bot that ignores it, you need a firewall or CDN rule.

## How AI Crawler robots.txt Matching Works

robots.txt became an internet standard, [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), in 2022. Every vendor that documents its AI crawlers points site owners to it, so the same four rules decide what each bot may fetch. Our glossary entry on [robots.txt](/glossary/robots-txt) covers the basics. These are the parts that trip up AI rules.

### Groups and product tokens

A group is one or more `User-agent` lines followed by `Allow` and `Disallow` rules. The value of a `User-agent` line is a product token, such as `GPTBot`. The RFC says a token may only contain letters, hyphens and underscores, and that crawlers "MUST use case-insensitive matching" to find their group. So `gptbot` and `GPTBot` are the same line.

Stacking several `User-agent` lines on top of one set of rules is valid and saves space. Blank lines inside a group are allowed too. The RFC grammar permits empty lines between the user-agent lines and the rules. A group ends only when a new `User-agent` line follows a rule, or the file ends.

### Why `*` doesn't cover a bot that has its own group

This is the rule behind most AI crawler robots.txt surprises. A crawler obeys the group that names it, and falls back to the `*` group only "if no matching group exists," in the RFC's words. Google's own [robots.txt spec](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) says it plainly: "User agent specific groups and global groups (`*`) are not combined."

So if your `*` group blocks `/admin/` and you add a `GPTBot` group that blocks `/drafts/`, GPTBot may now crawl `/admin/`. Every named group needs its own copy of your private paths.

Two groups that name the same bot do merge. RFC 9309 says their rules "MUST be combined into one group," and Google does the same.

### Longest match decides between Allow and Disallow

Inside a group, the rule with the longest matching path wins, whatever order the lines are in. If an `Allow` and a `Disallow` match with the same length, the `Allow` wins. Paths are case-sensitive, `*` matches any run of characters, and `$` marks the end of a URL. A `Disallow:` line with no path blocks nothing.

### Vendor fallbacks the RFC doesn't cover

Some vendors add rules of their own on top of the standard:

- **Applebot.** Apple's [Applebot page](https://support.apple.com/en-us/119829) says: "If robots instructions don't mention Applebot but mention Googlebot, the Apple robot will follow Googlebot instructions." Our [Applebot guide](/blog/applebot-apple-intelligence-search) covers the rest of Apple's rules.
- **Amzn-SearchBot.** Amazon's [crawler page](https://developer.amazon.com/amazonbot) says that if your file doesn't mention it "but allow[s] other search bots," it crawls by "the robots.txt directives given to other search bots."
- **Google's specialist crawlers.** Google's [common crawlers list](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) gives some crawlers two tokens, such as `Google-CloudVertexBot` and `Googlebot`, and says "you need to match only one crawler token for a rule to apply."

No generic parser knows these fallbacks. A generic tester will say Applebot falls to your `*` group, when Apple says it reads your Googlebot group. Name these bots whenever their behavior matters to you.

## Training, Search, User-Triggered and Agent Bots

AI bots do four jobs, plus one special case: tokens with no crawler behind them. The job decides what a block costs you. This table sorts them by job, the way your AI crawler robots.txt groups should, and quotes what vendors say about the file. The full list of tokens, user-agent strings and IP ranges lives in the [AI crawler directory](/blog/ai-crawler-directory).

| Job                               | Examples (vendor)                                                                                                                               | What vendors say about robots.txt                                                                                                                                                             | What a block costs                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Training                          | `GPTBot` (OpenAI), `ClaudeBot` (Anthropic), `meta-externalagent` (Meta), `Amazonbot` (Amazon), `CCBot` (Common Crawl), `Bytespider` (ByteDance) | Followed by all that document it; ByteDance publishes no crawler page, and Cloudflare [files Bytespider](https://developers.cloudflare.com/ai-crawl-control/reference/bots/) as an AI crawler | Future models learn less from your pages. Today's AI answers don't change                                   |
| Training token                    | `Google-Extended` (Google), `Applebot-Extended` (Apple)                                                                                         | Applied to data Google's and Apple's crawlers already fetch; never seen in logs                                                                                                               | Google: Gemini training and grounding in Gemini Apps. Apple: foundation model training. Search is untouched |
| AI search index                   | `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `meta-webindexer`, `Amzn-SearchBot`                                                       | Followed                                                                                                                                                                                      | You drop out of that engine's cited answers                                                                 |
| Search crawler that also feeds AI | `Googlebot`, `bingbot`, `Applebot`                                                                                                              | Followed                                                                                                                                                                                      | You drop out of search itself, plus Google's AI Overviews, Copilot and Siri answers                         |
| User-triggered fetcher            | `ChatGPT-User`, `Claude-User`, `Perplexity-User`, `meta-externalfetcher`, `Amzn-User`                                                           | Mixed; see below                                                                                                                                                                              | The engine can't read your page when someone asks about it                                                  |
| Agent                             | ChatGPT's Cloud browser, `Google-Agent`                                                                                                         | OpenAI's agent proves itself with a request signature, not a token; Google lists Google-Agent among user-triggered fetchers, which "generally ignore robots.txt rules"                        | Little you can do in robots.txt                                                                             |

### Who says what about user-triggered fetchers

User-triggered fetchers read one page because a person asked. That's why several vendors exempt them. Their exact words, checked on 1 October 2026:

| Fetcher                          | Vendor's statement                                                                                                                                                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChatGPT-User`                   | "Because these actions are initiated by a user, robots.txt rules may not apply." ([OpenAI](https://developers.openai.com/api/docs/bots))                                                                                                                            |
| `Perplexity-User`                | "Since a user requested the fetch, this fetcher generally ignores robots.txt rules." ([Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers))                                                                                                  |
| `Claude-User`                    | Covered by "Anthropic's Bots respect 'do not crawl' signals by honoring industry standard directives in robots.txt." ([Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)) |
| `meta-externalfetcher`           | "This crawler may bypass robots.txt rules." ([Meta](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/))                                                                                                                                         |
| `Amzn-User`                      | "It may not follow all robots.txt directives." ([Amazon](https://developer.amazon.com/amazonbot))                                                                                                                                                                   |
| Google's user-triggered fetchers | "These fetchers generally ignore robots.txt rules." ([Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers))                                                                                                        |

Two vendors control AI use outside robots.txt altogether. Google says that for AI Overviews and AI Mode, "robots.txt directives for Googlebot is the control," and points to `nosnippet`, `data-nosnippet`, `max-snippet` and `noindex` to limit what's shown ([AI features page](https://developers.google.com/search/docs/appearance/ai-features)). Microsoft documents no AI token for robots.txt, though Cloudflare [wrote on 15 September 2026](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/) that Microsoft is building support for a robots.txt "no training" preference, "targeted for early 2027." Its [webmaster guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) say "NOARCHIVE prevents content from being used in Copilot responses and grounding results," and `NOCACHE` limits Copilot to the URL, title and snippet. Both are meta tags, not robots.txt lines.

### Training blocks look forward, not back

A training block changes what happens next. Anthropic says restricting ClaudeBot signals that "the site's future materials should be excluded" from training. OpenAI says disallowing GPTBot "indicates a site's content should not be used in training." Neither describes removing pages already collected. If your pages were crawled last year, a block today doesn't pull them out of models already trained.

## The Six Doors: Choose an AI Crawler robots.txt Policy by Goal

Most AI crawler robots.txt policies come down to one of six positions. We call them the Six Doors. Find your goal in the left column, then copy the matching template below.

| Door             | Your goal                                        | Training bots        | AI search bots     | Live fetchers      | Classic search     | Template |
| ---------------- | ------------------------------------------------ | -------------------- | ------------------ | ------------------ | ------------------ | -------- |
| Open door        | Be read, cited and learned from everywhere       | In                   | In                 | In                 | In                 | 1        |
| Split door       | Stay in AI answers, keep pages out of training   | Out                  | In                 | In                 | In                 | 2        |
| Search-only door | Google and Bing only, no AI crawlers             | Out                  | Out                | Asked out          | Google and Bing in | 3        |
| Guest list       | Only bots you name; Bytespider and strangers out | Your choice          | In                 | In                 | In                 | 4        |
| Locked room      | Everything open except one folder                | Out of that folder   | Out of that folder | Out of that folder | In                 | 5        |
| Token switch     | Opt out of Google and Apple AI training only     | Gemini and Apple out | In                 | In                 | In                 | 6        |

Three questions settle it for most sites:

1. **Do you sell something people research before buying?** Then keep the AI search bots and live fetchers in. Every door except the search-only door does that.
2. **Is your text your product?** News, research, course and data sites often decide they lose more from training than they gain, so a split door or a locked room fits. Most software, services and retail sites have more to gain from being well known to future models. The census reflects this: 47.56% of top news sites block GPTBot, against 3.22% of software companies.
3. **Do you see heavy crawling from bots with no documentation?** Then the guest list is for you. But read the section on what robots.txt can't do first, because the worst offenders may not read the file at all.

## Six AI Crawler robots.txt Templates

Each template is a complete file. Replace `example.com` and the private paths with your own. Keep the comments; they tell the next person why each group exists. Every one of them was run through four parsers, described in the next section.

### Template 1: the open door

```robots.txt
# AI crawler robots.txt, template 1: open door.
# Every crawler may read the public site. Private paths stay closed.
User-agent: *
Disallow: /admin/
Disallow: /checkout/

Sitemap: https://www.example.com/sitemap.xml
```

You don't need to name any AI bot to let it in. Without a group of its own, each bot falls back to `*`. This is the right file for most small businesses and software companies. Its weakness is that one later edit to the `*` group, such as `Disallow: /`, shuts out every AI bot at once.

### Template 2: the split door

```robots.txt
# AI crawler robots.txt, template 2: split door.
# AI search indexes and user-triggered fetchers may read the site.
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: meta-webindexer
User-agent: Amzn-SearchBot
Disallow: /admin/
Disallow: /checkout/

# Training crawlers and training tokens stay out.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: meta-externalagent
User-agent: Amazonbot
User-agent: CCBot
User-agent: Bytespider
Disallow: /

# Everyone else, including Googlebot, Bingbot and Applebot.
User-agent: *
Disallow: /admin/
Disallow: /checkout/

Sitemap: https://www.example.com/sitemap.xml
```

Naming the search bots looks redundant, since `*` would let them in anyway. It isn't. It protects them if someone later blocks everything under `*`. Two judgment calls hide in the training group. Amazon says `Amazonbot` "may be used to train Amazon AI models" but also improves its products, and as of 1 October 2026 its page says sites that allow it "may be eligible for benefits" through Amazon Content Partners. Meta describes `meta-externalagent` as crawling for "training foundation AI models or improving products by indexing content directly." Move either one up if the product side matters more to you.

### Template 3: the search-only door

```robots.txt
# AI crawler robots.txt, template 3: classic search only.
# Google and Bing may crawl. Every other bot is asked to stay out.
User-agent: Googlebot
User-agent: Bingbot
Disallow: /admin/
Disallow: /checkout/

# Applebot would borrow the Googlebot group, and Amzn-SearchBot the rules
# of other search bots, so both are named. The -Extended tokens opt out
# of Gemini and Apple training.
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: Amzn-SearchBot
User-agent: Google-Extended
Disallow: /

User-agent: *
Disallow: /

Sitemap: https://www.example.com/sitemap.xml
```

Be clear about what this file keeps. Google's AI Overviews and AI Mode use Googlebot, and Copilot relies on Bing's crawling and index, so this door doesn't keep you out of those. Add the `nosnippet` or `noarchive` meta tags for that. Delete `Applebot` from the blocked group if you want to stay in Siri and Spotlight. It will then follow your Googlebot group, as Apple describes. This file also blocks DuckDuckGo, Yandex and every other search engine.

### Template 4: the guest list

```robots.txt
# AI crawler robots.txt, template 4: guest list.
# Bots named here may read the public site. Bytespider and every
# unnamed bot are asked to stay out.
User-agent: Googlebot
User-agent: Bingbot
User-agent: Applebot
User-agent: DuckDuckBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Amzn-SearchBot
User-agent: Google-Extended
User-agent: Applebot-Extended
Disallow: /admin/
Disallow: /checkout/

User-agent: Bytespider
Disallow: /

User-agent: *
Disallow: /

Sitemap: https://www.example.com/sitemap.xml
```

A guest list has one trap. `Google-Extended` and `Applebot-Extended` are robots.txt tokens, so if you leave them off the list, they fall to `*` and you opt out of Gemini and Apple training without meaning to. Name them if you want to stay in. `Bytespider` gets its own group even though `*` already blocks it. That way the block survives if someone opens up the `*` group later. Move `GPTBot` and `ClaudeBot` into that group if you also want out of training.

### Template 5: the locked room

```robots.txt
# AI crawler robots.txt, template 5: one locked folder.
# AI bots may read the site, except /research/. Its summaries stay open.
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: meta-externalagent
User-agent: CCBot
User-agent: Bytespider
Allow: /research/summaries/
Disallow: /research/
Disallow: /admin/
Disallow: /checkout/

User-agent: *
Disallow: /admin/
Disallow: /checkout/

Sitemap: https://www.example.com/sitemap.xml
```

The `Allow` line carves a hole in the `Disallow` below it, because `/research/summaries/` is the longer match. Order doesn't matter under RFC 9309, but it matters to simpler parsers. Python's urllib.robotparser applies the first rule that matches, so writing the `Allow` first keeps it in agreement. Notice that `/admin/` and `/checkout/` are repeated in the AI group. Without them, the named bots could crawl both.

The locked room stops Google and Apple from using `/research/` for training, but not from showing it in search. Googlebot and Applebot still crawl it, so use `noindex` or `nosnippet` on those pages if they must stay out of AI Overviews or Siri answers.

### Template 6: the token switch

```robots.txt
# AI crawler robots.txt, template 6: opt out of Google and Apple AI training.
# Google Search and Apple search are not affected.
User-agent: Google-Extended
User-agent: Applebot-Extended
Disallow: /

User-agent: *
Disallow: /admin/
Disallow: /checkout/

Sitemap: https://www.example.com/sitemap.xml
```

Google says [Google-Extended](/glossary/google-extended) "does not impact a site's inclusion in Google Search nor is it used as a ranking signal." It does cost more than training, though. It also covers "grounding" in Gemini Apps and in Grounding with Google Search on Vertex AI. Apple says pages that disallow Applebot-Extended "can still be included in search results" and that its rules "are not considered in ranking for Search." Neither token shows up in your logs, because no crawler sends it. You can only check that the rule is written correctly.

## How These AI Crawler robots.txt Templates Were Tested

Each template was saved as a file and run through four parsers on 1 October 2026, with a list of bot and path pairs and the result RFC 9309 expects for each. The expected results were written before any parser ran.

- **Google's robotstxt library**, the [open-source C++ parser](https://github.com/google/robotstxt) Google describes as "production code used by Googlebot." It was built from source (commit 22b355f) with Apple clang 17 and abseil, and its `robots` test binary was called once per check.
- **Protego 0.7.0**, the Python parser [Scrapy uses](https://github.com/scrapy/protego).
- **robots-parser 3.0.1**, a [JavaScript parser](https://github.com/samclarke/robots-parser), the same version Rankbox's census used.
- **Python 3.14's [urllib.robotparser](https://docs.python.org/3/library/urllib.robotparser.html)**, from the standard library.

| File                             | Checks | Google robotstxt | Protego | robots-parser | urllib.robotparser |
| -------------------------------- | ------ | ---------------- | ------- | ------------- | ------------------ |
| Template 1: open door            | 6      | 6                | 6       | 6             | 6                  |
| Template 2: split door           | 20     | 20               | 20      | 20            | 20                 |
| Template 3: search-only door     | 12     | 12               | 12      | 12            | 12                 |
| Template 4: guest list           | 16     | 16               | 16      | 16            | 16                 |
| Template 5: locked room          | 10     | 10               | 10      | 10            | 10                 |
| Template 6: token switch         | 7      | 7                | 7       | 7             | 7                  |
| Template 5 with `Disallow` first | 4      | 4                | 4       | 4             | 2                  |

All six templates passed 71 of 71 checks in every parser. The last row shows why the line order in template 5 matters. Write the `Disallow: /research/` line above the `Allow`, and urllib.robotparser blocks the summaries folder, because it uses the first matching rule rather than the longest. The other three still get it right.

Two limits apply. These parsers read the file; they don't know vendor fallbacks such as Applebot borrowing your Googlebot group. That's why templates 3 and 4 name Applebot outright, so no fallback decides the result. And no AI vendor publishes the parser it uses, so a pass here means the file is correct under the standard, not that every bot will obey it. Our [testing guide](/blog/ai-crawler-robots-txt) runs 17 problem files through the same four parsers and shows where they disagree.

## Worked Example: Tallyfold Picks Its Doors

Tallyfold is a made-up invoicing and payments app for agencies. It charges $39 a month for three users, plus $12 for each extra user, and it wants ChatGPT, Claude and Perplexity to quote that pricing correctly. Its site has a pricing page, docs, a blog, a logged-in app under `/app/`, an API under `/api/`, and a paid benchmark report under `/benchmarks/`, with a free landing page at `/benchmarks/` itself.

Its AI crawler robots.txt file has to serve three doors at once:

1. **Open door for the public site.** Tallyfold wants future models to know its product, so it keeps GPTBot and ClaudeBot in.
2. **Locked room for the paid report.** Every AI bot stays out of `/benchmarks/`, except for the landing page.
3. **Guest-list thinking for Bytespider.** ByteDance documents nothing, so Tallyfold names it and shuts it out.

```robots.txt
# AI crawler robots.txt for tallyfold.example (a fictional invoicing app).

# AI bots may read everything public except the paid benchmark report.
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: meta-externalagent
User-agent: meta-webindexer
User-agent: CCBot
Allow: /benchmarks/$
Disallow: /benchmarks/
Disallow: /app/
Disallow: /api/

# No documentation, no promise.
User-agent: Bytespider
Disallow: /

# Search engines and everyone else.
User-agent: *
Disallow: /app/
Disallow: /api/

Sitemap: https://www.tallyfold.example/sitemap.xml
```

The `$` in `Allow: /benchmarks/$` matches the landing page URL exactly and nothing below it. Here's the test grid: eight bots across five paths, 40 checks in Google's parser.

| Bot                                                                                     | `/pricing` | `/docs/api` | `/benchmarks/` | `/benchmarks/2026-report` | `/app/settings` |
| --------------------------------------------------------------------------------------- | ---------- | ----------- | -------------- | ------------------------- | --------------- |
| GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended (6 bots) | Allowed    | Allowed     | Allowed        | Blocked                   | Blocked         |
| Googlebot                                                                               | Allowed    | Allowed     | Allowed        | Allowed                   | Blocked         |
| Bytespider                                                                              | Blocked    | Blocked     | Blocked        | Blocked                   | Blocked         |

That's 22 allowed and 18 blocked: 6 bots × 3 allowed paths gives 18, plus Googlebot's 4. Protego and robots-parser matched all 40 results. Python's urllib.robotparser got 34, because it ignores the `$` and blocked the landing page for all six AI bots.

The grid shows one gap the file can't close. Googlebot can still read the report, so it could still appear in AI Overviews. Tallyfold adds `<meta name="robots" content="noindex">` to the report pages, which also covers Bing and Copilot. Applebot honors `noindex` too.

## What an AI Crawler robots.txt File Can't Do

A robots.txt file states a policy. It doesn't enforce one. Cloudflare's [managed robots.txt docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) put it plainly: "robots.txt compliance is voluntary. The file expresses your preferences, but it does not prevent crawlers from accessing your content at a technical level."

Five limits follow from that:

- **It can't stop a bot that doesn't read it.** ByteDance publishes no crawler documentation, so `Bytespider` makes no promise either way. Undeclared scrapers don't announce a token at all.
- **It can't bind live fetchers that opt out.** As the table above shows, several vendors exempt user-triggered fetches.
- **It can't verify who's asking.** Anyone can claim to be GPTBot. Check IPs against each vendor's list, as the [directory](/blog/ai-crawler-directory) explains.
- **It can't keep a URL out of search results.** Google says a disallowed page may still be indexed by its URL "without a snippet." Use `noindex` and let the crawler read it.
- **It can't recall past training.** Vendors describe blocks as applying from now on.

Enforcement happens at the edge, with firewall and CDN rules that check IPs or signatures. Our walkthrough of [Cloudflare's AI bot management settings](/blog/cloudflare-ai-bot-management) covers which switch hits which bots, and [the Cloudflare challenge trap](/blog/cloudflare-challenge-trap) shows how a firewall can block the search bots you meant to keep.

One more interaction is worth knowing if you use Cloudflare. Its older managed robots.txt setting will "prepend our managed robots.txt before your existing robots.txt," with a block that disallows eight training bots and tokens, from Amazonbot to meta-externalagent. Its replacement, [Bot Preference Sync](https://blog.cloudflare.com/bot-preference-sync/), launched in August 2026 and on by default for new customers, also prepends its rules to your file. Cloudflare said on 15 September 2026 that managed robots.txt "will be deprecated" in its favor. Either way, your own groups for the same bots merge with Cloudflare's, so check the live file, not the one in your repository.

### Content Signals are a separate line

Cloudflare's managed file also adds a `Content-Signal` line, such as `search=yes, ai-train=no`. It's a statement of how content may be used, not an access rule, and crawlers aren't obliged to read it. Cloudflare's policy text calls these restrictions "express reservations of rights" under Article 4 of the EU's copyright directive. That's Cloudflare's framing, not legal advice. Ask a lawyer if the legal weight of your opt-out matters to you.

## What 13,359 Sites Actually Block

Rankbox's [AI bot crawler census](/blog/ai-bot-crawler-census) read the robots.txt files of 21,353 sites on 28 September 2026, of which 13,359 were readable. The numbers show how real AI crawler robots.txt files use each door:

- **News sites close the training door.** 47.56% of top news sites fully block GPTBot and 50.24% block ClaudeBot. Across all readable files, only 7.66% block GPTBot.
- **The most-blocked tokens are training crawlers.** Bytespider (9.18% of all files) and CCBot (8.86%) top the list. In news, CCBot reaches 54.88%.
- **The split door is common.** Across all sites, 53.0% of GPTBot blockers keep OAI-SearchBot open, and 50.8% of ClaudeBot blockers keep Claude-SearchBot open.
- **Blocks are deliberate.** In the news and e-commerce top 1,000, 207 of 217 GPTBot blocks come from a group that names GPTBot.
- **Few sites lock everything.** Just 2.2% of all sites block every crawler with `User-agent: *` and `Disallow: /`.
- **Old tokens linger.** 47.07% of news sites still block `anthropic-ai`, which Anthropic's current page doesn't list. Copied blocklists age quickly.

The last point is a reason to audit your file twice a year. Vendors add, rename and retire tokens, and a stale list can block nothing while looking strict.

## Rankbox's Part, and What It Leaves to You

Rankbox doesn't write, host or manage robots.txt files, CDN rules or firewalls for customers. Two free tools help you build and check an AI crawler robots.txt file. The [AI robots.txt generator](/tools/ai-robots-txt-generator) builds a file from three presets (allow all AI bots, search and live fetch only, or block all AI bots) with bot-by-bot switches grouped by job, plus private paths and a sitemap line. The [robots.txt tester](/tools/robots-txt-tester) lets you paste a file, pick a bot and see which line decided. To see which AI bots actually visit, paste a day of logs into the [AI crawler log analyzer](/tools/ai-crawler-log-analyzer).

Once the right bots can read your site, Rankbox works on what they read. Answer-Space Research maps the questions buyers ask AI engines, and the Citation-Ready Writer researches the live web and writes source-backed articles that reach your site through Rankbox's API. Rankbox doesn't track AI citations today. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### Should I block AI crawlers in robots.txt?

Block training crawlers only if keeping your text out of future models matters more than being well known to them. Keep AI search bots and live fetchers in if you want to appear in AI answers. Most businesses that sell a product choose the open door or the split door.

### How do I block AI training but keep AI search in robots.txt?

Put the training bots (GPTBot, ClaudeBot, CCBot, meta-externalagent, Amazonbot, Bytespider) and the tokens Google-Extended and Applebot-Extended in one group with `Disallow: /`. Name the search bots and live fetchers in another group with your private paths. Template 2 above does exactly this.

### Does an AI crawler robots.txt file stop AI bots?

Only the ones that choose to obey it. Documented training and search crawlers say they follow it, but several user-triggered fetchers say robots.txt may not apply, and undocumented bots make no promise. To stop a bot that ignores your file, use a firewall or CDN rule.

### Do I need to list every AI crawler in my AI crawler robots.txt file?

No. Bots you don't name follow your `User-agent: *` group. Name a bot only when you want it treated differently, or to protect it from a future change to `*`. If your `*` group blocks everything, you must name every bot you want in.

### Does blocking Google-Extended remove my site from Google AI Overviews?

No. AI Overviews and AI Mode use Googlebot, and Google says Google-Extended doesn't affect inclusion in Search. Google-Extended covers Gemini model training and grounding in Gemini Apps and Vertex AI. To limit what AI Overviews show, use `nosnippet`, `max-snippet` or `noindex`.

### How long does an AI crawler robots.txt change take to work?

About a day for most vendors. OpenAI says about 24 hours for search, Perplexity up to 24 hours, and Meta caches the file for up to 24 hours. Google generally caches it for up to 24 hours. Amazon may use a cached copy up to 30 days old.

## References

1. [RFC 9309: Robots Exclusion Protocol, IETF](https://www.rfc-editor.org/rfc/rfc9309.html)
2. [How Google interprets the robots.txt specification, Google](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
3. [Google's common crawlers, Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
4. [Google's user-triggered fetchers, Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers)
5. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
6. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
7. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
8. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
9. [About Applebot, Apple Support](https://support.apple.com/en-us/119829)
10. [About Amazonbot, Amazon Developer](https://developer.amazon.com/amazonbot)
11. [Meta web crawlers, Meta for Developers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/)
12. [CCBot, Common Crawl](https://commoncrawl.org/ccbot)
13. [Bing webmaster guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
14. [Bot reference, Cloudflare AI Crawl Control docs](https://developers.cloudflare.com/ai-crawl-control/reference/bots/)
15. [robots.txt setting (managed robots.txt), Cloudflare docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
16. [Say it once: introducing Bot Preference Sync, Cloudflare](https://blog.cloudflare.com/bot-preference-sync/)
17. [Have it both ways: stay discoverable in search while disallowing AI training, Cloudflare](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/)
18. [Google robots.txt parser and matcher library, Google on GitHub](https://github.com/google/robotstxt)
19. [robots-parser, Sam Clarke on GitHub](https://github.com/samclarke/robots-parser)
20. [urllib.robotparser, Python documentation](https://docs.python.org/3/library/urllib.robotparser.html)
