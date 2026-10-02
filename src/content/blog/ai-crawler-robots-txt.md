---
title: AI Crawler robots.txt Mistakes: How to Test Rules for GPTBot, ClaudeBot and Others
description: Find and fix AI crawler robots.txt mistakes. Test rules for GPTBot, ClaudeBot and PerplexityBot with real parsers, live fetches and your logs.
keyword: AI crawler robots.txt
date: 2026-11-03
updated: 2026-11-03
written: 2026-10-01
author: Rankbox Team
tags: Technical SEO, AI Search
---

To test AI crawler robots.txt rules, check three things in order: that a standards-based parser reads your rules the way you meant, that every bot actually receives the file you think it gets, and that your logs show the bots behaving accordingly. Rules for GPTBot, ClaudeBot and PerplexityBot usually break in one of two places: in how robots.txt groups work, or in what a firewall, CDN or framework actually serves to bots.

This guide lists the mistakes behind those failures, shows where popular parsers disagree about them, and ends with a five-step test. If you're still choosing what to block, start with [the complete AI crawler robots.txt guide](/blog/ai-crawler-robots-txt-guide), which sets out six policies by goal with tested templates. Facts and parser runs here are as of 1 October 2026.

## Key Takeaways

- Many AI crawler robots.txt mistakes are grouping mistakes. A bot with its own group ignores `User-agent: *` entirely, so repeat private paths in every named group.
- A group that holds only a `Crawl-delay` line can merge with the next group. In Google's parser, a ClaudeBot delay placed above a GPTBot block also blocks ClaudeBot.
- Parsers disagree. Across 17 problem files, Google's open-source parser gave the expected result on 39 of 39 checks, while Python's urllib.robotparser managed 24.
- A 403 or 404 on robots.txt tells crawlers there are no rules. A firewall that blocks the file hides your opt-out.
- Most vendors say a change takes about 24 hours. Amazon may use a copy up to 30 days old.

## Ten Rule Mistakes in AI Crawler robots.txt Files

Each of these is valid syntax that does something other than what its author meant.

### 1. The rule sits in the wrong group

```robots.txt
User-agent: *
Disallow: /drafts/

User-agent: GPTBot
Disallow: /admin/
```

The author wanted GPTBot kept out of both folders. But GPTBot has its own group, so it never reads the `*` group, and `/drafts/` is open to it. [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) says a crawler falls back to `*` only "if no matching group exists." The fix is to copy `Disallow: /drafts/` into the GPTBot group.

### 2. A Crawl-delay group swallows the next group

```robots.txt
User-agent: ClaudeBot
Crawl-delay: 10

User-agent: GPTBot
Disallow: /
```

The first group is Anthropic's own `Crawl-delay` example, and the file reads like "slow ClaudeBot down, block GPTBot." Under the standard, it blocks both. A group only ends when a `User-agent` line follows a rule, and `Crawl-delay` isn't a rule. The RFC says other records "MUST NOT interfere" with grouping, and Google's [robots.txt spec](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) says lines other than `user-agent`, `allow` and `disallow` "are ignored." So ClaudeBot and GPTBot share one group, and both get `Disallow: /`. Google's parser blocked ClaudeBot on this file. Three other parsers didn't. A `Content-Signal` line in the same place does the same thing.

The fix is one line. Give the delay group a rule of its own, such as `Allow: /` under `Crawl-delay: 10`. With that line added, all four parsers agreed ClaudeBot was allowed.

### 3. Token names that are close but wrong

`User-agent: Claude` doesn't match ClaudeBot in Google's parser, which compares whole tokens. Anthropic's [crawler page](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) lists exactly three names: `ClaudeBot`, `Claude-User` and `Claude-SearchBot`. Rankbox's [census of 21,353 sites](/blog/ai-bot-crawler-census) found 47.07% of top news sites still block `anthropic-ai`, which isn't on Anthropic's current page. Copy tokens from each vendor's own docs, or from our [AI crawler directory](/blog/ai-crawler-directory).

### 4. Case in the wrong place

Token names are case-insensitive, so `gptbot` works. Paths are case-sensitive, so `Disallow: /Private/` doesn't cover `/private/`. Match the case your URLs actually use.

### 5. Wildcards a parser doesn't support

`Disallow: /*.pdf$` blocks URLs that end in `.pdf`, and `Disallow: /*?session=` blocks any URL with that parameter. RFC 9309 says crawlers "MUST support" `*` and `$`. Some testing libraries don't, so a rule can look broken in a tool when it works for the bot.

### 6. Allow and Disallow written in the "wrong" order

The longest matching path wins, not the first line. In this group, PerplexityBot may crawl `/blog/` even though `Disallow: /` comes first:

```robots.txt
User-agent: PerplexityBot
Disallow: /
Allow: /blog/
```

When an `Allow` and a `Disallow` match with the same length, the RFC says the `Allow` "SHOULD be used." Simple parsers that stop at the first match get both cases wrong. Putting `Allow` lines first costs nothing and keeps them honest.

### 7. Two groups for the same bot

If GPTBot appears in two groups, the RFC says their rules "MUST be combined." People who edit one group often forget the other. Search the file for each token before you change it.

### 8. An empty Disallow

`Disallow:` with nothing after it blocks nothing. Google says crawlers "ignore rules without a path." Write `Disallow: /` to block a whole site.

### 9. Rules above the first User-agent line

A rule before any `User-agent` line belongs to no group, and the RFC says crawlers "SHOULD ignore" it.

### 10. Invisible characters at the top

Some editors save a byte order mark (BOM) at the start of the file. Google says it ignores the BOM. Two of the four parsers tested here didn't, and missed the first `User-agent` line. Save the file as plain UTF-8 without a BOM.

## The Parser Split Test: Same File, Different Answers

An AI crawler robots.txt tester is only as good as its parser. To show how much that matters, 17 small problem files were run through four parsers on 1 October 2026. We call it the Parser Split Test. Each check had an expected result from RFC 9309 and Google's spec, written down before any parser ran:

- **Google robotstxt**, the [open-source C++ library](https://github.com/google/robotstxt) Google calls "production code used by Googlebot," built from source;
- **Protego 0.7.0**, the Python parser [Scrapy uses](https://github.com/scrapy/protego);
- **robots-parser 3.0.1**, a [JavaScript parser](https://github.com/samclarke/robots-parser);
- **urllib.robotparser**, from Python 3.14's [standard library](https://docs.python.org/3/library/urllib.robotparser.html).

| Problem file                                                      | Expected          | Google robotstxt | Protego | robots-parser | urllib.robotparser |
| ----------------------------------------------------------------- | ----------------- | ---------------- | ------- | ------------- | ------------------ |
| ClaudeBot `Crawl-delay` group above a GPTBot block                | ClaudeBot blocked | Blocked          | Allowed | Allowed       | Allowed            |
| Same, with a `Content-Signal` line                                | ClaudeBot blocked | Blocked          | Allowed | Allowed       | Blocked            |
| Blank line between two `User-agent` lines                         | GPTBot blocked    | Blocked          | Blocked | Blocked       | Allowed            |
| `User-agent: Claude`, tested as ClaudeBot                         | Allowed           | Allowed          | Blocked | Allowed       | Blocked            |
| Two GPTBot groups, `/drafts/` in the second                       | Blocked           | Blocked          | Blocked | Blocked       | Allowed            |
| `Disallow: /` then `Allow: /blog/`                                | `/blog/` allowed  | Allowed          | Allowed | Allowed       | Blocked            |
| `Allow` and `Disallow` of equal length                            | Allowed           | Allowed          | Allowed | Allowed       | Blocked            |
| `Disallow: /*.pdf$`                                               | PDF blocked       | Blocked          | Blocked | Blocked       | Allowed            |
| BOM before the first line                                         | GPTBot blocked    | Blocked          | Allowed | Blocked       | Allowed            |
| `User-agent: GPTBot/1.4`                                          | GPTBot blocked    | Blocked          | Allowed | Blocked       | Allowed            |
| Cloudflare's managed block prepended to a file that allows GPTBot | GPTBot allowed    | Allowed          | Allowed | Allowed       | Blocked            |

Across all 17 files and 39 checks, Google's parser matched the expected result 39 times, robots-parser 37, Protego 33 and urllib.robotparser 24. Python's parser applies the first rule that matches and treats `*` and `$` as plain text; its source code shows both.

Three lessons follow. Test with a parser built to the standard. Avoid shapes that split parsers, such as rule-less groups and BOMs, since no AI vendor publishes its parser. And mind the last row if you use Cloudflare, whose robots.txt features prepend `Disallow: /` groups for GPTBot and other training bots. If your own file has `User-agent: GPTBot` with `Allow: /`, the groups merge and the rules tie. Under the RFC's tie rule, and in Google's parser, your `Allow` wins. OpenAI doesn't say how GPTBot settles it.

## Serving Mistakes That Hide Good Rules

A perfect AI crawler robots.txt file does nothing if bots don't receive it. These mistakes live in your server, CDN or framework.

### The status code changes the meaning

| What the server returns for /robots.txt | RFC 9309                           | Google                                                                      |
| --------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------- |
| 200 with the file                       | Follow the rules                   | Follow the rules                                                            |
| 3xx redirect                            | Follow at least five hops          | Follows at least five hops, then treats it as a 404                         |
| 4xx, such as 403 or 404                 | Crawler "MAY access any resources" | No crawl restrictions (429 excepted)                                        |
| 5xx or a network error                  | "MUST assume complete disallow"    | Stops crawling for 12 hours, then uses the last good copy for up to 30 days |

The 4xx row catches people out. A firewall that answers robots.txt with a 403 tells AI bots there are no rules at all. Anthropic warns that blocking its IPs "impedes our ability to read your robots.txt file." In Rankbox's census, 6.1% of sites that answered refused robots.txt to the census crawler, including 25.1% of e-commerce sites. Amazon says that when a file "can't be fetched," its bots "behave as if it does not exist." Serve robots.txt with a 200 to every bot, even ones you block elsewhere. Our guide to the [Cloudflare challenge trap](/blog/cloudflare-challenge-trap) shows how challenges can catch the file by accident.

### The wrong host, or HTML instead of text

Each host needs its own file. Google says rules apply "only to the host, protocol, and port number where the robots.txt file is hosted," so `www.example.com` and `example.com` are separate, and Anthropic asks for rules on "every subdomain that you wish to opt out from." Check that the file comes back as plain text, too; a catch-all route that returns an HTML page gives crawlers nothing usable. Google ignores anything past 500 KiB.

### A layer in front of you rewrites the file

Your repository file may not be what bots get:

- **Cloudflare.** The older managed robots.txt will "prepend our managed robots.txt before your existing robots.txt" ([docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)), and its replacement, [Bot Preference Sync](https://blog.cloudflare.com/bot-preference-sync/), on by default for new customers, prepends its own block. Our guide to [Cloudflare AI bot management](/blog/cloudflare-ai-bot-management) shows where those switches live.
- **Next.js.** A generated `app/robots.ts` "is cached by default" unless it uses request-time APIs ([docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)), so a change may need a deploy.
- **WordPress.** Any plugin can rewrite the built-in `do_robots()` output through the `robots_txt` filter ([reference](https://developer.wordpress.org/reference/functions/do_robots/)).
- **Shopify.** It generates a default file, editable through `robots.txt.liquid`, and says "the default rules are updated regularly" ([docs](https://shopify.dev/docs/storefronts/themes/seo/robots-txt)).

The rule for all four is the same. Test the live URL, not the source file.

## How Often Vendors Reread an AI Crawler robots.txt File

What each vendor states about picking up a change, as of 1 October 2026:

| Vendor           | What it says                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| OpenAI           | About 24 hours for search ([OpenAI](https://developers.openai.com/api/docs/bots))                                       |
| Perplexity       | "Up to 24 hours" ([Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers))                          |
| Google           | Generally caches the file "for up to 24 hours," longer when it can't refresh                                            |
| Meta             | May cache the file "for up to 24 hours" ([Meta](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/)) |
| Amazon           | About 24 hours, but may use "a cached copy from the last 30 days" ([Amazon](https://developer.amazon.com/amazonbot))    |
| Common Crawl     | Will "periodically continue to check" ([Common Crawl FAQ](https://commoncrawl.org/faq))                                 |
| Anthropic, Apple | No interval stated                                                                                                      |

RFC 9309 says crawlers "SHOULD NOT use the cached version for more than 24 hours" unless the file is unreachable. So wait a day before you judge a change, and a month before you assume Amazon has it.

## A Five-Step AI Crawler robots.txt Test

Run these steps after every change to your AI crawler robots.txt file.

1. **Fetch the live file as each bot.** This POSIX shell script asks for robots.txt with five AI user agents and prints the status, redirects, content type, size and a checksum for each. Every line should match. It ran as written on 1 October 2026.

```bash
#!/bin/sh
# AI crawler robots.txt check: fetch the file as five AI bots and compare.
site="${1:-https://www.example.com}"
for bot in GPTBot/1.4 OAI-SearchBot/1.4 ClaudeBot/1.0 PerplexityBot/1.0 Bytespider; do
  printf '%-20s ' "$bot"
  curl -sL --max-time 20 -o robots.out \
    -w '%{http_code} %{num_redirects} redirects %{content_type} %{size_download} bytes ' \
    -A "Mozilla/5.0 (compatible; $bot)" "$site/robots.txt"
  cksum < robots.out | cut -d' ' -f1
done
```

Your machine isn't on any vendor's IP list, so a firewall that verifies bots may treat these requests as fakes. A 403 here means "check the firewall," not proof that the real bot is blocked.

2. **Run the rules through a parser.** Paste the file into Rankbox's free [robots.txt tester](/tools/robots-txt-tester), pick a bot and a URL, and it shows the line that decided. For the shapes in the table above, or any result that surprises you, confirm with Google's parser, since it reads files the way Googlebot does. Skip the tester for Applebot: its list has no plain Applebot, and no parser models Apple's habit of following your Googlebot group, which our [Applebot guide](/blog/applebot-apple-intelligence-search) explains. Its README documents Bazel and CMake builds, and the test binary takes a file, a token and a URL: `robots robots.txt GPTBot https://www.example.com/pricing`.

3. **Check the vendor tools that exist.** Google Search Console's [robots.txt report](https://support.google.com/webmasters/answer/6062598) shows the files Google fetched for your top 20 hosts and any errors, and lets you request a recrawl. Bing Webmaster Tools has a [robots.txt tester](https://blogs.bing.com/webmaster/september-2020/Bing-Webmaster-Tools-makes-it-easy-to-edit-and-verify-your-robots-txt) that "operates as Bingbot and BingAdsBot would." On Cloudflare, AI Crawl Control's Directives tab shows robots.txt status codes and a [violations table](https://developers.cloudflare.com/ai-crawl-control/features/track-robots-txt/). Cloudflare warns the table uses your current rules, so a new `Disallow` can flag old requests.

4. **Read your logs.** Look for each bot fetching robots.txt, and the status it got. OpenAI says GPTBot and OAI-SearchBot may add a `robots.txt` marker to their user agent for these requests. This works on Apache and NGINX logs in the default combined format:

```bash
# AI crawler robots.txt fetches, counted by bot and status code
awk -F'"' '$2 ~ /^GET \/robots\.txt/ && match($6, /GPTBot|OAI-SearchBot|ClaudeBot|Claude-SearchBot|PerplexityBot|Bytespider/) {
  split($3, s, " "); print substr($6, RSTART, RLENGTH), s[1] }' access.log | sort | uniq -c
```

A bot that gets a 403 here can't read your rules. Our guide to [tracking GPTBot and ClaudeBot](/blog/how-to-track-gptbot-and-claudebot) covers the page-level log checks and IP verification, and the free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) does the counting in your browser.

5. **Recheck after 24 hours.** Confirm that blocked bots stopped requesting blocked paths, and that allowed bots still reach your key pages. ChatGPT-User and Perplexity-User say robots.txt may not bind them, so their page hits don't prove a rule is broken.

## Where Rankbox's Free Tools Fit

Rankbox doesn't manage robots.txt, firewalls or CDN settings for you. Its free tools cover AI crawler robots.txt checks. The [AI robots.txt generator](/tools/ai-robots-txt-generator) builds a file from three presets (allow all AI bots, search and live fetch only, or block all AI bots), with bot-by-bot switches grouped by job, private paths and a sitemap line. The tester and the log analyzer cover steps 2 and 4.

Rankbox's paid product works on what bots find once they're in. It researches the questions buyers ask AI engines and writes source-backed articles that reach your site through its API. It doesn't track AI citations today. The Business plan is $49.50 a month with a 7-day trial: [see pricing](/pricing).

## Frequently Asked Questions

### How do I test my AI crawler robots.txt for GPTBot?

Fetch your live robots.txt with a GPTBot user agent to confirm it returns a 200 and the right file. Then test the token `GPTBot` against your key URLs in a parser built to RFC 9309, such as Google's open-source library. Check your logs a day later.

### Why is my AI crawler robots.txt rule for ClaudeBot not working?

The usual cause is grouping. ClaudeBot may have its own group that lacks the rule, or a rule-less group may have merged with another one. Check the token is spelled `ClaudeBot`, that robots.txt returns a 200, and that Anthropic's IPs aren't blocked from reading it.

### Does a 403 on robots.txt block AI crawlers?

No. Under RFC 9309, a 4xx response means the file is unavailable, and crawlers "MAY access any resources." Google treats 4xx errors other than 429 as no restrictions. A 403 on robots.txt hides your rules instead of enforcing them.

### Does Crawl-delay work for AI crawlers?

For some. Anthropic and Common Crawl say they honor it. Google, Applebot and Amazon's bots say they don't. Never leave a `Crawl-delay` line as the only line in a group, because the group can merge with the next one.

### How long does a change to an AI crawler robots.txt file take?

Usually about a day. OpenAI, Perplexity and Meta all cite roughly 24 hours, and Google generally caches the file for up to 24 hours. Amazon may rely on a cached copy up to 30 days old.

## References

1. [RFC 9309: Robots Exclusion Protocol, IETF](https://www.rfc-editor.org/rfc/rfc9309.html)
2. [How Google interprets the robots.txt specification, Google](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
3. [robots.txt report, Search Console Help](https://support.google.com/webmasters/answer/6062598)
4. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
5. [Does Anthropic crawl data from the web, and how can site owners block the crawler?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
6. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
7. [About Amazonbot, Amazon Developer](https://developer.amazon.com/amazonbot)
8. [robots.txt setting (managed robots.txt), Cloudflare docs](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
9. [Say it once: introducing Bot Preference Sync, Cloudflare](https://blog.cloudflare.com/bot-preference-sync/)
10. [Directives tab, Cloudflare AI Crawl Control docs](https://developers.cloudflare.com/ai-crawl-control/features/track-robots-txt/)
11. [Bing Webmaster Tools makes it easy to edit and verify your robots.txt, Microsoft Bing](https://blogs.bing.com/webmaster/september-2020/Bing-Webmaster-Tools-makes-it-easy-to-edit-and-verify-your-robots-txt)
12. [Metadata Files: robots.txt, Next.js docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
13. [Google robots.txt parser and matcher library, Google on GitHub](https://github.com/google/robotstxt)
14. [urllib.robotparser, Python documentation](https://docs.python.org/3/library/urllib.robotparser.html)
