---
title: Will an llms.txt File Help Your SEO?
description: Will an llms.txt file help your SEO? Not for Google rankings. What it does for AI agents, what server logs show, the small risks, and who should add one.
keyword: llms.txt file
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Technical SEO
---

No. An llms.txt file will not raise your Google rankings, and Google says so in writing: its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) states that the file "will neither harm nor help your site's visibility or rankings in Google Search, as Google Search ignores them." It can still earn its keep elsewhere, with the AI agents and coding tools that open it when someone points them at your site.

So the real question is narrower than most guides admit. For classic SEO, the answer is settled. For AI search, no engine has said it reads the file, and server logs show its crawlers rarely ask for it. For agents that help developers, the file does get used. Our [complete guide to getting indexed by LLMs with an llms.txt file](/blog/how-to-get-indexed-by-llms-with-llms-txt) covers the whole topic; this post sticks to the SEO value.

Below: what Google and the AI vendors say, what the log studies show, what the file costs you, and a decision table for who should add one. New to the file? Start with [what an llms.txt file is](/blog/what-is-an-llms-txt-file). For the format itself, read [the llms.txt standard, explained line by line](/blog/llms-txt-standard).

## Key Takeaways

- An llms.txt file is not a Google ranking factor. Google's guide says Search ignores it and that it "will neither harm nor help" rankings, AI Overviews included.
- As of September 2026, no AI search engine documents reading other sites' llms.txt files. OpenAI, Anthropic and Perplexity publish their own for developer docs.
- In Ahrefs' June 2026 study of 137,210 domains, 97% of llms.txt files got zero requests, and AI search bots made 1.1% of the requests that did happen.
- The file's real readers are agents, above all coding agents, which fetch it when a link or a user tells them it exists.
- The cost is close to zero, and many platforms make the file for you. The risks are small and fixable: stale facts, fake files and the file turning up in search results.
- Add one if developers or agents use your docs, or if your platform makes one anyway. Otherwise, fix crawler access and your pages first.

## What Google Says About llms.txt and Rankings

Google's position sits in its own documentation, not in a conference quote. The [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) on Search Central, last updated 10 July 2026, lists llms.txt under things "you can ignore for Google Search." It says you don't need "new machine readable files, AI text files, markup, or Markdown to appear in Google Search (including its generative AI capabilities), as Google Search itself doesn't use them."

The same passage adds a line many summaries skip: "It's completely fine if you decide to create and maintain LLMS.txt files (or other similar files) for other services or systems that use these files." So Google isn't warning you off. It's telling you the file sits outside Search.

### AI Overviews and AI Mode follow the same rules

Google's AI features draw on its normal Search index. Its [AI features page](https://developers.google.com/search/docs/appearance/ai-features) says a page must be "indexed and eligible to be shown in Google Search with a snippet" to appear as a supporting link, and that "there are no additional technical requirements." An llms.txt file isn't one of them.

John Mueller, a Search Advocate at Google, made the skeptic's case in April 2025. He called the file ["comparable to the keywords meta tag"](https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/): a site owner's claim about the site, which a search engine would check against the pages anyway.

### Why a Lighthouse audit isn't a ranking signal

Chrome's Lighthouse does look for the file. Its Agentic Browsing category, added to the default config in [Lighthouse 13.3.0](https://github.com/GoogleChrome/lighthouse/blob/main/changelog.md) in May 2026, includes an llms.txt audit. That's a developer tool, not Search. Chrome's [scoring notes](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring) call the category experimental and say it "does not have a weighted average score from 0 to 100." The [audit page](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt) marks a missing file "Not Applicable," since "providing the file is optional at the moment."

A passing audit tells you the file exists and isn't broken. It says nothing about rankings.

## What the Evidence Shows for AI Search

SEO in 2026 often means AI search too: being named and cited by ChatGPT, Claude, Perplexity and Gemini. Here the file has no confirmed effect either.

### The vendors are silent on it

Each vendor's crawler page covers robots.txt rules and IP lists, not llms.txt. [OpenAI's crawler overview](https://developers.openai.com/api/docs/bots) and [Perplexity's crawler page](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) both point readers to their own llms.txt documentation index. Neither says its bots read yours. [Anthropic's crawler article](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), updated 7 April 2026, covers ClaudeBot, Claude-User and Claude-SearchBot without a word about the file.

### The logs show AI search bots rarely ask for it

[Ahrefs](https://ahrefs.com/blog/llmstxt-study/) looked at request data across 137,210 domains for May 2026. Of the sites that published an llms.txt file, 97% saw no requests for it at all. AI retrieval bots such as OAI-SearchBot and PerplexityBot made 1.1% of the requests that did occur. Claude-Code, Anthropic's coding agent, fetched the files more often than any AI retrieval bot.

Correlation studies point the same way. [SE Ranking](https://seranking.com/blog/llms-txt/) modelled AI citations across about 300,000 domains in November 2025 and found no link to having the file. Removing llms.txt from its model "actually improved its accuracy."

Our report on [the state of llms.txt adoption](/blog/state-of-llms-txt-adoption) sets these log studies next to Rankbox's own crawl. That crawl found the file on 31.3% of the 16,784 sites that answered on 28 September 2026, and on 44.5% of software companies. With a third of the sites in that sample already publishing one, an llms.txt file is unlikely to set you apart, even if an engine started reading it tomorrow.

### Where the file does get read

The spec's authors say the file is ["used most heavily for software documentation, where coding agents follow them"](https://llmstxt.org/), and the v2 [changes page](https://llmstxt.org/changes.html) says "coding agents use them reliably." That's their own claim, but it fits the Ahrefs data. Ahrefs also saw zero AI bot requests for files that didn't exist, and concluded that AI tools fetch llms.txt "when a link, an index, or a user instruction tells them it exists."

Put simply, an agent sent to your docs may read the file. A search crawler building its index almost never does.

## What an llms.txt File Costs You

The money cost is nil and the time cost is small. Several platforms now make the file for you:

- **Shopify** stores serve `/llms.txt` by default, pointing it at a store `agents.md`, per Shopify's [28 May 2026 changelog](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd).
- **Wix** "automatically generates and maintains your llms.txt file" for upgraded sites with a custom domain, per its [help page](https://support.wix.com/en/article/understanding-your-sites-llmstxt-file).
- **Yoast SEO** and **AIOSEO** add a generator to WordPress. [Yoast's feature page](https://yoast.com/features/llms-txt/) says it builds the file "automatically with a click."
- **Docs platforms** such as [Mintlify](https://www.mintlify.com/docs/ai/llmstxt) make one for every site they host.

By hand, a curated file of 10 to 30 links takes about an hour. The risks are small but real:

1. **Stale facts.** The file often repeats prices and plan names. When those change and the file doesn't, an agent reads the old version. On Wix, editing the file by hand stops its automatic updates.
2. **A fake file.** Some sites answer `/llms.txt` with their homepage and a 200 status. Rankbox's crawl counted HTML pages at that path on 7.4% of sites. An agent that expects Markdown gets markup instead; our [llms.txt guide](/blog/how-to-get-indexed-by-llms-with-llms-txt) shows how to make missing files return a real 404.
3. **The file showing up in search.** Google can index text files. Mueller said a `noindex` header [could make sense](https://www.searchenginejournal.com/google-says-it-could-make-sense-to-use-noindex-header-with-llms-txt/551744/) "as sites might link to it and it could otherwise become indexed."
4. **Edits you didn't make.** Ahrefs advises treating the file "like code": keep it in version control, limit who can change it and review anything a plugin writes, since agents act on what it says.
5. **Opportunity cost.** An hour on llms.txt is an hour not spent on crawler access, rendering or content, which do move AI visibility.

None of these is an SEO penalty. Google says the file can't hurt rankings, and a stale file takes minutes to fix.

## The llms.txt Payoff Matrix: Who Should Add One

The value depends on who reaches your site through agents. The llms.txt Payoff Matrix sorts common kinds of site by who is likely to read the file, then gives a verdict. It's Rankbox's rule of thumb from the evidence above, not a vendor rule.

| Your site | Likely readers of the file | Verdict | Effort |
| --- | --- | --- | --- |
| Developer docs, API or SDK | Coding agents and docs tools | Add it, with Markdown copies of key pages | Low on a docs platform |
| B2B SaaS marketing site | Buyers' agents, now and then; no search engine confirmed | Worth an hour if you keep it short and accurate | About an hour |
| WordPress with Yoast or AIOSEO | Same as SaaS | Switch it on, then pick pages by hand | 15 minutes |
| Shopify store | Shopping agents, through the default file | You already have one; read what it says | 10 minutes |
| Wix site on a paid plan | Agents; the file is automatic | Review the default version | 10 minutes |
| Local service business | Almost nobody yet | Skip it for now; fix your listings | None |
| News or media site | Agents, if you let them in | Low priority; settle your bot policy first | About an hour |
| Any site that blocks AI search bots or renders pages only in JavaScript | Nobody useful until that's fixed | Fix access and rendering first | Varies |

Three questions make the call for most sites:

1. **Do developers or agents use your docs?** If yes, add the file.
2. **Does your platform make one anyway?** If yes, spend ten minutes checking that it's accurate.
3. **Can AI search crawlers reach your pages?** If not, the file is the wrong fix.

If you said no to the first two and yes to the third, the file is optional. Adding it won't hurt, and skipping it won't cost you rankings. Local businesses get more from consistent listings; see our guide to [optimizing a business for AI search engines](/blog/optimize-business-for-ai-search).

## What Moves SEO More Than llms.txt

If the goal is Google rankings or AI citations, spend the hour on these first:

- **Crawler access.** Allow Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and PerplexityBot in robots.txt and at your CDN. Our [robots.txt tester](/tools/robots-txt-tester) checks each token, and our post on [getting indexed by an LLM through llms.txt](/blog/how-to-get-indexed-by-llm-through-llms-txt) walks through each engine's route in.
- **Server-rendered pages.** Crawlers that don't run JavaScript see an empty shell.
- **Answer-first content.** Pages that answer buyers' questions with facts and sources are what AI answers quote. See [how to optimize content for AI search](/blog/optimize-content-for-ai-search).

If you do publish an llms.txt file, look at your server logs a month later. The free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) shows which bots fetched it. A file nobody requests is harmless, and that's the honest baseline to expect.

Rankbox works on the third item. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes source-backed articles that answer the questions your buyers ask AI. Rankbox doesn't create or manage llms.txt files for you, though the free [llms.txt generator](/tools/llms-txt-generator) writes one from a form, and it doesn't track AI citations today. Plans are on the [pricing page](/pricing).

## Frequently Asked Questions

### Can an llms.txt file hurt my SEO?

No. Google's AI optimization guide says the file "will neither harm nor help" your visibility in Google Search. The only indirect risks are a stale file that repeats old facts to agents, and the file itself appearing in search results, which a `noindex` header prevents.

### Does ChatGPT read my llms.txt file?

OpenAI hasn't said so as of September 2026. Its crawler page tells site owners to allow OAI-SearchBot for ChatGPT search and points to OpenAI's own llms.txt, but it doesn't say its bots read other sites' files. In Ahrefs' study, AI search bots made 1.1% of llms.txt requests.

### Is llms.txt a ranking factor for Google AI Overviews?

No. Google says its AI features have "no additional technical requirements" beyond being indexed and eligible for a snippet in Search. Its AI optimization guide names llms.txt among the files Google Search doesn't use.

### Should I add noindex to my llms.txt file?

It's optional. John Mueller said noindex "could make sense" so the file doesn't appear in results when other sites link to it. Send it as an `X-Robots-Tag` header, since a text file can't carry a meta tag, and don't block the file in robots.txt.

### Does passing Lighthouse's llms.txt audit help SEO?

No. The audit sits in Lighthouse's experimental Agentic Browsing category, where Chrome says the current focus is to "gather data and provide actionable signals rather than a definitive ranking." It checks that the file loads and has a heading and a link. It plays no part in how Google ranks pages.

### Will llms.txt matter for SEO later?

Nobody can say. If an AI search engine starts reading the file, expect it to appear in that vendor's crawler documentation first. Until then, a correct file costs little to keep, so check the vendor pages each quarter rather than betting on it.

## References

1. [Optimizing your website for generative AI features, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
2. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
3. [Agentic browsing scoring, Lighthouse, Chrome for Developers](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring)
4. [llms.txt audit, Lighthouse, Chrome for Developers](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt)
5. [Lighthouse changelog, GoogleChrome on GitHub](https://github.com/GoogleChrome/lighthouse/blob/main/changelog.md)
6. [The /llms.txt file, v2, llmstxt.org](https://llmstxt.org/)
7. [Changes since v1, llmstxt.org](https://llmstxt.org/changes.html)
8. [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read, Ahrefs](https://ahrefs.com/blog/llmstxt-study/)
9. [LLMs.txt: why brands rely on it and why it doesn't work, SE Ranking](https://seranking.com/blog/llms-txt/)
10. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
11. [Perplexity crawlers, Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
12. [Does Anthropic crawl data from the web?, Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
13. [Google says LLMs.txt comparable to keywords meta tag, Search Engine Journal](https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/)
14. [Google says it could make sense to use noindex header with llms.txt, Search Engine Journal](https://www.searchenginejournal.com/google-says-it-could-make-sense-to-use-noindex-header-with-llms-txt/551744/)
15. [Customize /llms.txt, /llms-full.txt and /agents.md, Shopify](https://shopify.dev/changelog/customize-llmstxt-llms-fulltxt-and-agentsmd)
16. [Understanding your site's llms.txt file, Wix Help Center](https://support.wix.com/en/article/understanding-your-sites-llmstxt-file)
17. [llms.txt, Yoast SEO features](https://yoast.com/features/llms-txt/)
18. [llms.txt, Mintlify documentation](https://www.mintlify.com/docs/ai/llmstxt)
