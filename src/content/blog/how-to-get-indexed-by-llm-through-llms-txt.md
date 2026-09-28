---
title: How to Get Indexed by an LLM Through an llms.txt File (and What Actually Works)
description: Can an llms.txt file get you indexed by an LLM? Not on its own. How ChatGPT, Claude, Perplexity and Google add pages, plus a setup checklist for both.
keyword: indexed by an LLM
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

You can't get indexed by an LLM through an llms.txt file alone. The file is a reading list that agents open when something points them to it; what puts your pages into ChatGPT, Claude, Perplexity or Google's AI answers is each engine's search crawler reaching your pages and adding them to a search index.

So the working route has two tracks. Track one gets you indexed: open the door to each engine's search crawler, make pages readable without JavaScript, and tell search engines what changed. Track two publishes an llms.txt file, so the agents that do look for one find a clean map. Our [complete guide to getting indexed by LLMs with an llms.txt file](/blog/how-to-get-indexed-by-llms-with-llms-txt) goes deep on both.

This post answers the indexing question head-on: what being indexed by an LLM means, how each engine adds pages, how to check you're in, and a two-track checklist to finish. If the file itself is new to you, read [what an llms.txt file is](/blog/what-is-an-llms-txt-file) first.

## Key Takeaways

- "Indexed by an LLM" can mean three things: in a model's training data, in an assistant's search index, or fetched live during a chat. llms.txt has no documented role in the first two.
- As of September 2026, no AI vendor says it reads other sites' llms.txt files to find, index or rank pages.
- ChatGPT search needs OAI-SearchBot access and also queries partner search providers, with Microsoft named. Claude needs Claude-SearchBot, Perplexity needs PerplexityBot, and Google's AI features need ordinary Google indexing.
- In a 12-week log study, AI crawlers fetched robots.txt hundreds or thousands of times and llms.txt in single digits, or not at all.
- Check whether you're indexed by an LLM with server logs and URL inspection tools, not by counting llms.txt requests.
- Do track one first. Track two takes about an hour.

## What "Indexed by an LLM" Actually Means

A language model doesn't keep a live copy of the web the way a search engine does. When people ask to be indexed by an LLM, they mean one of three routes, and the big vendors run a separate bot for each. We call them the Three Routes Into an LLM:

| Route | What happens | The bots | What controls it | llms.txt's part |
| --- | --- | --- | --- | --- |
| 1. Training data | Pages are collected to train future models | GPTBot, ClaudeBot; the Google-Extended token | robots.txt | None documented |
| 2. Search index | Pages are stored so the assistant's search can find and cite them | OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot | robots.txt, firewalls, sitemaps | None documented |
| 3. Live fetch | The assistant or an agent opens a page mid-conversation | ChatGPT-User, Claude-User, Perplexity-User, coding agents | Partly robots.txt; user-triggered fetches may skip it | Read here, when an agent is sent to it |

Route 2 is what most people mean. If you want your pages quoted in AI answers next month, being indexed by an LLM's search feature is the goal. Training data only changes when a new model ships, and the spec itself says the file was meant for "inference rather than training." See [LLM training data](/glossary/llm-training-data) for how that route works.

### Why the file can't index you

Start with the vendors. [OpenAI's crawler overview](https://developers.openai.com/api/docs/bots), [Anthropic's crawler article](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) and [Perplexity's crawler page](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) explain robots.txt tokens and IP ranges. None of them says its search bot reads llms.txt, and Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says Google Search "itself doesn't use" such files.

The logs agree. [EZY Research](https://www.ezy.ai/research/do-ai-bots-read-llms-txt), a vendor, published llms.txt files on 83 sites and watched them from 27 April to 19 July 2026:

| Crawler | robots.txt fetches | llms.txt fetches |
| --- | --- | --- |
| OpenAI's crawlers | 3,990 | 7 |
| Anthropic's ClaudeBot | 3,120 | 9 |
| PerplexityBot | 775 | 0 |
| Googlebot | 5,125 | 67 |

A crawler that checks your robots.txt 3,990 times and your llms.txt 7 times isn't using the file to decide what to index. [Ahrefs](https://ahrefs.com/blog/llmstxt-study/) saw the same pattern in May 2026: no AI bot requested an llms.txt file that didn't exist, which suggests none of them goes looking for it unprompted.

### Where the file does help: route 3

The llms.txt spec opens by describing how agents use websites today: "a coding agent fetches a library's documentation to get an API call right, and a chat assistant with search reads pages to answer questions about a product." That's route 3. An agent that has been sent to your site can read the file, pick the two pages it needs and skip the rest.

The vendors treat route 3 differently from route 2. OpenAI says ChatGPT-User "is not used to determine whether content may appear in Search." Perplexity says Perplexity-User "generally ignores robots.txt rules" because a person asked for the page. Anthropic lets you block Claude-User, but warns this "may reduce your site's visibility for user-directed web search."

## How Each Engine Adds Your Pages to Its Index

Each assistant has its own search crawler, and each vendor documents what happens when you block it.

### ChatGPT: OAI-SearchBot plus search partners

OpenAI says OAI-SearchBot "is used to surface websites in search results in ChatGPT's search features," and that sites that opt out "will not be shown in ChatGPT search answers, though can still appear as navigational links." Its [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) repeats the point: to appear in summaries and snippets, "make sure you aren't blocking OAI-SearchBot." Robots.txt changes take about 24 hours to apply.

ChatGPT also looks beyond its own crawler. Its [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says it "sometimes partners with other search providers" and links Microsoft's privacy statement, so being in Bing's index helps too.

Plenty of sites close this door. Rankbox's [AI Bot Crawler Census](/blog/ai-bot-crawler-census) found OAI-SearchBot is blocked by 28.78% of news sites, 3.54% of retailers and 0.81% of the Fortune 500.

### Claude: Claude-SearchBot

Anthropic runs three bots. For Claude, being indexed by an LLM search feature comes down to Claude-SearchBot: blocking it "prevents our system from indexing your content for search optimization, which may reduce your site's visibility and accuracy in user search results." Blocking ClaudeBot only signals that your pages should be left out of training. Anthropic says its bots honor robots.txt and warns that blocking its IP addresses may not work as a reliable opt-out.

### Perplexity: PerplexityBot

For Perplexity, getting indexed by an LLM search engine starts with one bot. Perplexity says PerplexityBot "is designed to surface and link websites in search results on Perplexity. It is not used to crawl content for AI foundation models." It asks you to allow the bot and its published IP ranges, and says changes may take up to 24 hours to show.

### Google AI Overviews, AI Mode and Gemini

Google's AI answers draw on its main index. A page must be "indexed and eligible to be shown in Google Search with a snippet" to appear as a supporting link, per Google's [AI features page](https://developers.google.com/search/docs/appearance/ai-features), and "there are no additional technical requirements."

The [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) token is separate. It controls whether Gemini models may train on your content and use it for grounding in the Gemini apps, and Google says it "does not impact a site's inclusion in Google Search." Blocking it won't remove you from AI Overviews.

## How to Check Whether You're Indexed by an LLM

No AI vendor gives you an index report the way Search Console does. You work out whether you're indexed by an LLM from four checks:

1. **Read your server logs.** Look for OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot and Bingbot requests that got a 200 response on your key pages. Check heavy hitters against the vendors' published IP lists, since user agents can be faked. The free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) does this in your browser.
2. **Inspect URLs in Bing and Google.** Bing Webmaster Tools' URL Inspection shows whether Bing has indexed a page, which matters for ChatGPT's partner searches. Our [Bing Webmaster Tools guide](/blog/bing-webmaster-tools-ai-indexing-guide) walks through it. Search Console's URL Inspection does the same for Google.
3. **Spot-check the assistants.** With search turned on, ask a question only one of your pages answers, and see whether it's cited. One run proves little, so repeat it; our guide to [measuring GEO](/blog/how-to-measure-geo) explains how many runs you need.
4. **Don't read llms.txt fetches as an index signal.** A request for the file shows a client downloaded it. It says nothing about any search index.

## The Two-Track Setup Checklist

Work through track 1 before track 2. The first decides whether you can be found at all; the second makes life easier for agents that already found you.

### Track 1: Get indexed by an LLM's search

1. **Allow the search crawlers in robots.txt.** OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot and Bingbot. If you don't want your pages used for training, block GPTBot, ClaudeBot or Google-Extended separately; those tokens don't govern search. Our [AI robots.txt generator](/tools/ai-robots-txt-generator) writes the rules and the [robots.txt tester](/tools/robots-txt-tester) checks them.
2. **Clear your firewall and CDN.** A bot challenge blocks a crawler before robots.txt matters. See [the Cloudflare challenge trap](/blog/cloudflare-challenge-trap).
3. **Put the words in the first HTML response.** Crawlers that don't run JavaScript need [server-side rendering](/glossary/server-side-rendering) or static pages.
4. **Submit a sitemap to Google and Bing.** Sitemaps "inform search engines about pages on their sites that are available for crawling," per [sitemaps.org](https://www.sitemaps.org/).
5. **Ping Bing with IndexNow when pages change.** Bing is on the [IndexNow members list](https://www.indexnow.org/searchengines.json); OpenAI, Anthropic, Perplexity and Google aren't. See [IndexNow](/glossary/indexnow).
6. **Re-check logs a week later** to confirm each search crawler got 200 responses.

### Track 2: Publish llms.txt for agents

1. **Write the file**: an H1, a one-line summary and H2 lists of links with notes. The [llms.txt standard, explained line by line](/blog/llms-txt-standard) covers each element, and the free [llms.txt generator](/tools/llms-txt-generator) builds one from a form.
2. **Serve it properly**: a 200 status, a plain text or Markdown content type, and a real 404 for missing files. [The complete guide](/blog/how-to-get-indexed-by-llms-with-llms-txt) has steps for five stacks.
3. **Point agents to it.** Agents tend to open the file when a link or a user sends them there, so link it from your docs and add a `rel="describedby"` link on key pages.
4. **Keep it current.** Review prices, plan names and links whenever they change.
5. **Watch the logs monthly** to see which agents fetch it.

Whether the file is worth the hour for your SEO is its own question, covered in [will an llms.txt file help your SEO](/blog/will-llms-txt-help-your-seo).

Rankbox fits on the far side of indexing: once crawlers can reach your pages, those pages need to answer what buyers ask. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles built for that. Rankbox doesn't change your robots.txt, submit sitemaps or manage llms.txt for you, and it doesn't track AI citations today. Plans are on the [pricing page](/pricing).

## Frequently Asked Questions

### Can I submit my llms.txt file to ChatGPT or Claude?

No. As of September 2026, neither OpenAI nor Anthropic offers a way to submit an llms.txt file, and neither says its search crawler reads one. To get into ChatGPT and Claude search, allow OAI-SearchBot and Claude-SearchBot and keep your pages crawlable.

### How long does it take to get indexed by an LLM?

Access changes apply fast: OpenAI says robots.txt updates take about 24 hours, and Perplexity says up to 24 hours. After that, a page appears only once the crawler visits it and the engine chooses to use it, and no vendor publishes a timeline for that step. Training data reaches a model only when a new one is trained.

### Does blocking GPTBot remove my site from ChatGPT search?

No. OpenAI says each bot setting "is independent of the others." GPTBot gathers training data, while OAI-SearchBot decides whether you appear in ChatGPT search answers. You can block the first and allow the second.

### Do LLMs read llms.txt during training?

No vendor says so. The spec's authors expected the file to be "mainly useful for inference rather than training," and write that this is how it has been used. Training crawlers such as GPTBot and ClaudeBot follow robots.txt, not llms.txt.

### Is Bing indexing enough for ChatGPT?

It helps but isn't the whole story. ChatGPT search partners with outside providers, with Microsoft named, and also runs its own crawler, OAI-SearchBot. Sites that block OAI-SearchBot aren't shown in ChatGPT search answers, except as navigational links, even if Bing has them.

### Does Perplexity use llms.txt to find pages?

Perplexity hasn't said so. Its crawler page asks you to allow PerplexityBot and its IP ranges, and in EZY Research's 12-week study PerplexityBot fetched robots.txt 775 times and llms.txt 0 times.

## References

1. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
2. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
3. [Publishers and Developers FAQ, OpenAI Help Center](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
4. [Does Anthropic crawl data from the web?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
5. [Perplexity crawlers, Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
6. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
7. [Google's common crawlers (Google-Extended), Google Search Central](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
8. [Optimizing your website for generative AI features, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
9. [The /llms.txt file, v2, llmstxt.org](https://llmstxt.org/)
10. [We put llms.txt on 83 websites, EZY Research](https://www.ezy.ai/research/do-ai-bots-read-llms-txt)
11. [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read, Ahrefs](https://ahrefs.com/blog/llmstxt-study/)
12. [IndexNow participating search engines, IndexNow](https://www.indexnow.org/searchengines.json)
13. [Sitemaps.org](https://www.sitemaps.org/)
