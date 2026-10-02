---
title: Indirect Prompt Injection & "Black Hat" GEO: Can You Hijack AI Search Crawlers?
description: Can prompt injection hijack AI search? What published tests found, how AI vendors defend, what Google and Bing's spam rules say, and how to audit your site.
keyword: prompt injection
date: 2026-10-14
updated: 2026-10-14
written: 2026-09-30
author: Rankbox Team
tags: AI Search, AI Security
---

No, not in any way you can count on, and trying is a bad bet. AI crawlers such as GPTBot and ClaudeBot fetch and store your HTML, and no vendor documents a crawler that acts on the text it collects. Prompt injection matters later, when a language model reads your page to answer a question or to act for a user. At that point the published tests are mixed, the vendor defenses are getting stronger, and the search penalties are clear.

People are trying anyway. In February 2026, Microsoft's security researchers [reported](https://www.microsoft.com/en-us/security/blog/2026/02/10/ai-recommendation-poisoning/) 50 hidden "remember us" prompts from 31 companies in 14 industries, planted in "Summarize with AI" buttons. They named the tactic AI Recommendation Poisoning and compared it to adware. OWASP, the nonprofit web security project, ranks prompt injection first in its [Top 10 for LLM applications](https://genai.owasp.org/llmrisk/llm01-prompt-injection/).

This is a security-meets-SEO investigation. It maps where the risk actually sits, reports what published tests found (with dates), explains the defenses each vendor documents, and ends with an audit you can run on your own site. We didn't run any injection tests for this post. Every result below comes from researchers, journalists or vendors. New to the topic? Start with our plain-English guide to [what prompt injection is](/blog/what-is-prompt-injection), the [step-by-step mechanics of how it works](/blog/how-does-prompt-injection-work), or our deep dive on [indirect prompt injection cases and defenses](/blog/indirect-prompt-injection).

## Key Takeaways

- Crawlers fetch; models read. The risk sits at answer time, inside AI agents and browsers, and in assistant memory, not in the moment GPTBot or ClaudeBot downloads a page.
- Hidden instructions have swayed some AI answers. The Guardian got an "entirely positive" ChatGPT verdict on a fake camera page in November 2024 tests, and one of 12 assistants obeyed a hidden line in a June 2026 test.
- Resistance is growing. In OtterlyAI's April 2026 experiment, no platform followed the injected instructions, and Copilot flagged the page as unsafe.
- Since 15 May 2026, Google's spam policies cover attempts to manipulate generative AI responses. Bing's guidelines list "Prompt Injection and AI Manipulation," with delisting as a possible result.
- OpenAI, Anthropic, Google and Microsoft all document layered defenses. None claims immunity. Anthropic says plainly: "No browser agent is immune to prompt injection."
- Black hat GEO is a prisoner's dilemma. If every site injects, AI answers get worse for everyone, and each site risks its search visibility for a gain that may not survive the next model update.
- The useful work for site owners is defensive: audit your pages, plugins and user content for hidden instructions, because a compromised plugin can plant them for you.

## Crawlers Fetch, Models Read: Where the Risk Actually Sits

The title asks whether you can hijack AI search crawlers. The honest answer starts with what a crawler is. A crawler is a program that downloads pages and stores them. It doesn't think about what the page says.

OpenAI's [crawler documentation](https://developers.openai.com/api/docs/bots) says GPTBot collects content that "may be used in training" its models, and OAI-SearchBot is "used to surface websites in search results in ChatGPT's search features." Anthropic [describes its three bots](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) the same way: ClaudeBot for training data, Claude-SearchBot for search quality, and Claude-User for fetches a person asks for. Neither vendor describes a crawler that reads a page and changes its own behavior. Our [AI crawler directory](/blog/ai-crawler-directory) lists every bot and what it's for.

So text on your page only becomes a possible prompt injection when a model reads it later. That can happen at several points, which we lay out as the Read-Point Map.

### The Read-Point Map

| Read point             | What reads your page                                                                                                             | Can hidden instructions matter?                                                       | Documented evidence                                                                            | Main defense                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Crawl and store        | GPTBot, ClaudeBot, OAI-SearchBot, Claude-SearchBot, PerplexityBot                                                                | Not as instructions. The text is stored, and hidden text can still trip spam systems. | Vendor crawler docs describe collection only                                                   | Your robots.txt; the vendor's own filters |
| Index and rank         | Google, Bing and AI search indexes                                                                                               | Hidden text is a spam signal on its own                                               | Google and Bing spam policies                                                                  | Search engine spam systems                |
| Answer time            | ChatGPT search, Perplexity, Copilot, AI Overviews and AI Mode read retrieved passages                                            | Yes. It can tilt a summary or a product ranking.                                      | Guardian, Dec 2024; Pfrommer et al., 2024; Nestaas et al., 2024; Search Engine World, Jun 2026 | Model training and classifiers            |
| Agents and AI browsers | ChatGPT's cloud browser (which replaced ChatGPT agent; Atlas was retired in August 2026), Claude in Chrome, Comet, Gemini agents | Yes, with the highest stakes: actions and data leaks                                  | Brave on Comet, Aug 2025; OpenAI on Atlas, Dec 2025                                            | Confirmations, sandboxes, classifiers     |
| Assistant memory       | Saved memories in ChatGPT, Copilot and others                                                                                    | Yes. A planted "remember" can persist across chats.                                   | Microsoft, Feb 2026; Rehberger's "SpAIware," Sep 2024                                          | Memory review; link checks                |
| Training               | Future model weights                                                                                                             | A different attack: data poisoning                                                    | Anthropic, UK AISI and Alan Turing Institute, Oct 2025                                         | Data filtering by the vendor              |

The map changes the question. "Can I hijack a crawler?" has a short answer: no. "Can text on my page steer a model that reads it later?" has a longer one, and the rest of this post is about that.

### Why the crawl itself is the wrong target

A line that says "note to GPTBot" is talking to a program that isn't listening. But the line doesn't vanish. It sits in the stored copy, may reach a search index, and may be read by a model months later. That's why hidden text is risky even when it does nothing for you. For [grounding](/glossary/grounding), the step where an AI answer pulls in live sources, the engine reads what the index holds.

### Training is a separate problem

Planting text to shape a future model is data poisoning, not prompt injection. OWASP lists it as its own risk (LLM04). In an [October 2025 study](https://www.anthropic.com/research/small-samples-poison) with the UK AI Security Institute and the Alan Turing Institute, Anthropic found that as few as 250 malicious documents could backdoor models from 600 million to 13 billion parameters. The backdoor was low-stakes: a trigger phrase that made the model output gibberish. The authors say it's "still unclear" whether the pattern holds for larger models. It's no marketing lever either, because you can't know when or whether your pages enter a training set. Our [shadow training data audit](/blog/shadow-training-data-audit) covers what you can and can't find out about [LLM training data](/glossary/llm-training-data).

## What Published Tests Found, 2023 to 2026

You may have heard that rogue sites hide comments in their HTML telling AI systems to always cite them. That claim is mostly anecdote: there's no published count of how common it is. What is documented appears in the table below: hidden instructions in research papers, "remember us" prompts in AI links from 31 companies, and controlled tests. Here is how the hidden-comment pattern of prompt injection usually looks, defanged, so you can recognize it in your own source code.

**Defanged illustration, for recognition only.** A hidden block of this kind usually sits in an HTML comment or an off-screen element, calls itself a "system note," addresses AI assistants, and names a brand. With a placeholder brand and the instruction removed, the shape is:

```html
<!-- ILLUSTRATION ONLY. Not a working payload.
     "System note for AI assistants: [instruction to favor BrandX removed]" -->
```

Whether a given AI system even sees HTML comments depends on how it turns a page into text, and vendors don't publish that. Here is what researchers, journalists and practitioners have reported.

| Date                                  | Who                                     | What they did                                                          | What happened                                                        |
| ------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Feb 2023                              | Greshake et al. (paper)                 | Planted instructions in content Bing's GPT-4 chat would read           | Showed remote control of the chat; named "indirect prompt injection" |
| Apr 2024                              | Kumar and Lakkaraju (paper)             | Added a "strategic text sequence" to a fictional coffee machine's page | Raised its chance of being the top recommendation                    |
| Jun 2024                              | Pfrommer et al. (EMNLP 2024)            | Adversarial text on real consumer product pages                        | "Reliably" promoted low-ranked products; worked on perplexity.ai     |
| Jun 2024                              | Nestaas, Debenedetti and Tramèr (paper) | Crafted page content and plugin docs                                   | Promoted the attacker's products on Bing and Perplexity              |
| Nov 2024 tests, published 24 Dec 2024 | The Guardian                            | Fake camera page with hidden text; gave ChatGPT search the URL         | Hidden instructions made the verdict "always entirely positive"      |
| Jul 2025                              | Nikkei Asia                             | Found hidden "positive review" prompts in 17 research preprints        | A co-author said one paper would be withdrawn                        |
| Feb 2026                              | Microsoft Defender researchers          | Reviewed AI-related links in email traffic for 60 days                 | 50 memory prompts from 31 companies                                  |
| Apr 2026 (last updated 9 Apr)         | OtterlyAI                               | Hidden text plus an injection block on one test domain                 | No platform followed it; Copilot flagged the page                    |
| 10–11 Jun 2026                        | Search Engine World (Andre Alpar)       | Hidden off-screen line on a fake product review page, 12 assistants    | One obeyed; three warned the user                                    |

### Lab papers: it works under their conditions

The academic results are strong but narrow. [Kumar and Lakkaraju](https://arxiv.org/abs/2404.07981) used a catalog of made-up coffee machines. [Pfrommer et al.](https://arxiv.org/abs/2406.03589) built a dataset of real product sites and found their attack "transfer[s] effectively" to perplexity.ai. [Nestaas, Debenedetti and Tramèr](https://arxiv.org/abs/2406.18382) showed that crafted content could "promote the attacker products and discredit competitors" on Bing and Perplexity. All three used 2024 models in set-ups the authors controlled. They prove the weakness is real, not that it works on today's production systems. Our look at [how AI models rank brands](/blog/how-ai-models-rank-brands-in-search-results) covers the ranking side of this research.

### Journalist and practitioner tests: mixed, and moving

[The Guardian's test](https://www.theguardian.com/technology/2024/dec/24/chatgpt-search-tool-vulnerable-to-manipulation-and-deception-tests-show) ran on GPT-4o with search on, in November 2024. The reporters gave ChatGPT the URL of a fake camera page and asked if it was worth buying. With hidden instructions, the answer was "always entirely positive," even when the page showed negative reviews. Hidden fake reviews with no instructions also tilted the summary. Note the set-up: the page was handed to ChatGPT, not found through search.

[OtterlyAI](https://otterly.ai/blog/blackhat-geo-experiment-hidden-text/), which sells AI search monitoring, put white-on-white text and a hidden "system instruction override" on one test domain. "No platform followed the injection instructions," it reported. Copilot refused the page as "unsafe or inaccessible content," and Gemini told the user about the injection. Otterly calls it "not an industry-wide study."

[Search Engine World](https://www.searchengineworld.com/hidden-prompt-injection-vs-twelve-ai-assistants-one-obeyed-three-warned-the-user) pasted a unique link into 12 consumer assistants on 10 and 11 June 2026 and checked its server logs. Nine fetched the page. One repeated the hidden praise word for word. Three flagged the page as a manipulation attempt and warned the user. Each assistant got one run, so treat the split as a snapshot.

### What the pattern says

Three things stand out.

1. **It depends on the system and the date.** Lab set-ups and 2024 products were easy to sway. By 2026, more production assistants refuse the text or warn the user.
2. **A win is one answer, not a ranking.** Even when a hidden line works, it works for the person who pasted that page on that day.
3. **The bigger everyday risk points the other way.** In the June 2026 test, four of the eight assistants that answered from the page repeated its unverified negative claim as fact. Pages you don't control can shape what AI says about you. That's the case for [defensive GEO](/blog/defensive-geo), not for injection.

## How AI Vendors Defend Against Prompt Injection

Each vendor documents its defenses in its own words, and each describes layers rather than one filter.

| Vendor     | What it documents                                                                                                                                                                                                                                                                         | Date                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| OpenAI     | Instruction Hierarchy training, AI-powered monitors, approval before visiting sites that ask not to be catalogued, sandboxing, confirmation before purchases, "Watch Mode" on sensitive sites, logged-out mode; an automated attacker trained with reinforcement learning to harden Atlas | 7 Nov 2025; 22 Dec 2025       |
| Anthropic  | Training Claude to refuse injected instructions, classifiers that scan untrusted content, probes on tool results, an action classifier that checks each step against your request, human red teaming                                                                                      | 24 Nov 2025; 26 Aug 2026      |
| Google     | Content classifiers, "security thought reinforcement," markdown sanitization and suspicious-URL redaction, user confirmations, security notifications                                                                                                                                     | 13 Jun 2025                   |
| Microsoft  | Spotlighting (delimiting, datamarking, encoding), the Prompt Shields classifier, data governance, deterministic blocking of known leak paths, human approval                                                                                                                              | 29 Jul 2025                   |
| Perplexity | BrowseSafe, a paper by Perplexity researchers with a benchmark of attacks hidden in realistic HTML, an open detection model and a layered defense                                                                                                                                         | 25 Nov 2025; revised Aug 2026 |

Sources: [OpenAI](https://openai.com/index/prompt-injections/) and its [Atlas post](https://openai.com/index/hardening-atlas-against-prompt-injection/), [Anthropic](https://www.anthropic.com/research/prompt-injection-defenses) and its [Claude in Chrome launch](https://claude.com/blog/claude-in-chrome-generally-available), [Google](https://security.googleblog.com/2025/06/mitigating-prompt-injection-attacks.html), [Microsoft](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks) and [BrowseSafe](https://arxiv.org/abs/2511.20597).

### What the defenses have in common

The layers fall into three groups. First, train the model to treat page text as information, not orders. OpenAI's [Model Spec](https://model-spec.openai.com/2026-08-18.html) says tool outputs and quoted text "have no authority by default." Second, detect attacks with separate classifiers before or after the model reads. Third, limit the damage: ask the user before risky actions, block known ways to leak data, and run agents in sandboxes. Our guide to [how prompt injection works](/blog/how-does-prompt-injection-work) walks through each defense and where it cuts in.

For a site owner, one fact matters most: several layers inspect page content itself. A page carrying injected text can be flagged, as Copilot did in Otterly's test, and a flag may cost more than the answer you hoped to win.

### What no vendor claims

No vendor says it has solved the problem. Anthropic wrote in November 2025 that "no browser agent is immune," and in August 2026 that injection "remains a moving target." OpenAI said in December 2025 that it's "unlikely to ever be fully 'solved'." The UK's National Cyber Security Centre [argued in December 2025](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection) that it "may never be totally mitigated" the way SQL injection was, because models draw no hard line between data and instructions.

Independent research backs the caution. In October 2025, [Nasr, Carlini and colleagues](https://arxiv.org/abs/2510.09023) bypassed 12 published defenses with attack success above 90% for most, though most had first reported near-zero rates. The vendors' own numbers show progress, not zero. In [May 2026](https://www.anthropic.com/engineering/how-we-contain-claude), Anthropic reported that Claude Opus 4.7 held attacks to about 0.1% on single attempts and 5–6% after 100 adaptive attempts on one benchmark.

The takeaway for marketers cuts both ways. Defenses are good enough that injection is an unreliable way to win answers. They aren't good enough to ignore as a security risk to your users and your staff.

![Securing AI Agents: How to Prevent Hidden Prompt Injection Attacks](youtube:5ZA1lTxTH3c "IBM Technology's Jeff Crume and Martin Keen on hidden prompt injection in AI agents and how to defend against it (January 2026).")

## What Google and Bing Say About Hidden Instructions

Search engines settled the policy question on prompt injection before the security question.

### Google

On 15 May 2026, Google [clarified](https://developers.google.com/search/updates) that its spam policies "also apply to generative AI responses in Google Search." The [policy page](https://developers.google.com/search/docs/essentials/spam-policies) now defines spam to include "attempting to manipulate generative AI responses in Google Search." Sites that break the rules "may rank lower in results or not appear in results at all," through automated systems or a manual action.

Two long-standing policies cover injected text directly:

- **Hidden text.** Google's examples include white text on a white background, text behind an image, CSS that moves text off-screen, and a font size or opacity of zero. Those are the same tricks the published tests used.
- **Cloaking.** Google gives the example of "inserting text or keywords into a page only when the user agent that is requesting the page is a search engine." Serving an instruction only to AI user agents fits that pattern.

Google also lists hidden content that's fine: accordions, tabs, tooltips and "text that's only accessible to screen readers and is intended to improve the experience" for screen reader users. Accessible design isn't the problem. Text written for machines and hidden from people is.

### Bing

Bing's [Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) have a section titled "Prompt Injection and AI Manipulation." It says attempts to add content "designed to manipulate or interfere with language models used by Bing or Copilot may result in reduced visibility or removal from search experiences." The next line spells out the range: "reduced ranking, suppressed grounding visibility, or delisting from the Bing index." [Search Engine Journal reported](https://www.searchenginejournal.com/bing-adds-geo-to-official-guidelines-expands-ai-abuse-definitions/568442/) in February 2026 that this grew from a brief mention into a full section. Copilot grounds its answers in Bing, as our [Copilot guide](/ai-seo/copilot) explains, so the penalty reaches Copilot too.

### Detection doesn't need to read minds

A spam system doesn't have to prove what a prompt injection meant. Text hidden from visitors, or served only to bots, shows up when anyone compares the rendered page with the source.

## Why Black Hat GEO Is a Bad Bet

Black hat GEO means tactics that break search or platform rules to get into AI answers, and prompt injection is the newest of them. Here is the evidence for each tactic, set against what it puts at risk. We call this the Black Hat GEO Risk Ledger.

| Tactic                                              | What it tries                                | Best documented result                                                          | What it puts at risk                                                         |
| --------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Hidden instructions on your own pages               | Tell the AI to favor you                     | Swayed ChatGPT in the Guardian's Nov 2024 tests; 1 of 12 assistants in Jun 2026 | Google spam action, Bing delisting, pages flagged as unsafe                  |
| Hidden praise or fake reviews                       | Tilt the summary without "instructions"      | Also tilted ChatGPT in the Guardian's tests                                     | The same, plus the FTC's fake review rule in the US                          |
| Cloaking for AI user agents                         | Show bots different text than people         | No published success found                                                      | Google's and Bing's cloaking rules                                           |
| "Summarize with AI" memory prompts                  | Plant "remember us" in an assistant's memory | Microsoft: effectiveness "varied by the target AI assistant … and over time"    | Public naming as recommendation poisoning; users can see and delete memories |
| Instructions planted in reviews, forums or comments | Hijack pages you don't own                   | A Reddit comment hijacked Comet in Brave's Aug 2025 disclosure                  | Platform bans, and it's an attack on users, not SEO                          |

Every row has the same shape: a weak, short-lived upside and a lasting downside. A hidden block can put years of search visibility at risk for an answer that may change on the next run.

### The prisoner's dilemma

Nestaas and colleagues made the economic point in 2024. Each site has a reason to inject, but "the collective effect degrades the LLM's outputs for everyone." Engines respond the way search engines always have: they trust page text less and detect more. The first mover gains little. Everyone else inherits a noisier channel.

### Platform rules and the law

Planting instructions on pages you don't own breaks those platforms' rules. [Reddit's Rule 2](https://redditinc.com/policies/reddit-rules) bars spam and "content manipulation," and its penalties include temporary or permanent account suspension. When the hidden text poses as customer praise, US law is in play too. The FTC's [final rule on fake reviews](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials), announced on 14 August 2024, bans fake reviews, including AI-generated ones, and lets the agency seek civil penalties. Text that tries to make an assistant open accounts or send data out is no longer marketing at all. It's an attack on the reader. We're not lawyers, so ask one before you test anything near that line.

### What earns AI citations instead

What works is visible and boring: clear, sourced pages that answer real questions, as in our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search), and earned mentions on sites engines already trust, covered in our post on [link building and co-citation](/blog/link-building-ai-visibility-co-citation).

## How to Audit Your Own Site for Injected Text

Your site may carry prompt injection text you never wrote. Google's Search Console help lists the usual routes for [content injection](https://support.google.com/webmasters/answer/9044101?hl=en): an insecure server directory, an outdated CMS, or "hacking third-party plugins that you use on your site." Add user comments and any marketing widget that builds AI links. We call the check below the Four-Surface Injection Audit.

| Surface              | What to look for                                                            | How to check                                                              | Expect these false alarms                     |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------- |
| Page source          | Off-screen blocks, zero-size or zero-opacity text, comments addressed to AI | grep for hiding tricks and AI-directed phrases                            | Screen-reader labels, accordions, tabs        |
| What bots are served | Text that appears only for AI user agents                                   | Fetch as a browser and as a bot, then diff; Search Console URL Inspection | Personalization, A/B tests, geo banners       |
| Third-party code     | Modified plugin files; AI links with prefilled prompts                      | Plugin checksums; search for `?q=` links to AI assistants                 | Legitimate share buttons with plain questions |
| User content         | Hidden styling or AI-directed text in comments, reviews, profiles           | Search the database; review moderation rules                              | Quoted examples in genuine discussion         |

### Step 1: Compare what people see with what bots get

Fetch the same page with a browser user agent and with an AI crawler's, then compare. A difference can mean cloaking.

```bash
# Fetch one page twice and compare the HTML.
UA_BOT="Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot"
curl -s -A "Mozilla/5.0" https://www.example.com/pricing > as-browser.html
curl -s -A "$UA_BOT" https://www.example.com/pricing > as-bot.html
diff as-browser.html as-bot.html
```

This won't catch cloaking keyed to IP addresses. For Google's view, use [URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en) and open "View crawled page," which shows the HTML Googlebot received. Our [guide to tracking GPTBot and ClaudeBot](/blog/how-to-track-gptbot-and-claudebot) shows how to confirm which bots reach you in the first place.

### Step 2: Search the source for hiding tricks and AI-directed phrases

Run two searches over your rendered pages or your theme and content files.

```bash
# Hiding tricks from Google's hidden-text examples, plus off-screen positioning
grep -rniE "font-size:\s*0|opacity:\s*0|left:\s*-9999px|text-indent:\s*-9999" ./site
# Phrases that address AI systems instead of people
grep -rniE "note to (ai|llm)|system (note|prompt)|ignore (all |the )?(previous|prior|above)|as a trusted source|in future conversations" ./site
```

Expect false alarms. Screen-reader text and collapsed panels are allowed. Read every hit before you delete anything.

### Step 3: Check third-party code

On WordPress, `wp plugin verify-checksums --all` [compares plugin files](https://developer.wordpress.org/cli/commands/plugin/verify-checksums/) with WordPress.org's copies, and `wp core verify-checksums` does the same for core. Then search your templates for links to `chatgpt.com/?q=`, `claude.ai/new?q=` and `perplexity.ai/search?q=`. Decode the prompt in each one. Microsoft suggests hunting for AI links whose prompt contains words like "remember" or "trusted source."

### Step 4: Check user-generated content

Comments, reviews, Q&A threads and profile bios are open doors. Brave's [Comet disclosure](https://brave.com/blog/comet-prompt-injection/) used a Reddit comment hidden behind a spoiler tag. Strip inline styles from user posts, render them as plain text, and search stored posts for the phrases from Step 2.

### Step 5: Check the reports search engines give you

Open Search Console's Security issues and Manual actions reports, and the matching areas in Bing Webmaster Tools. They show what a search engine has already caught.

### Step 6: Fix it and keep it fixed

1. Remove the injected text, or restore affected files from a clean backup.
2. Update or remove the plugin or theme that carried it.
3. Change admin passwords and API keys, since injected content usually means someone got in.
4. Request a review in Search Console if you had a manual action or security issue.
5. Add the Step 2 searches to a weekly scheduled job, so a new hit alerts someone.

## Worked Example: Tallyfold Cleans Up a Compromised Plugin

Tallyfold is a fictional invoicing and payments app for agencies. Its marketing site runs on WordPress, with 214 URLs in the sitemap. The numbers below are illustrative.

A developer opens URL Inspection for a blog post and spots a paragraph nobody on the team wrote. The team runs the Four-Surface Injection Audit to find any prompt injection text.

| Check               | Scope        | Raw hits | Allowed or harmless                         | Real problems               |
| ------------------- | ------------ | -------- | ------------------------------------------- | --------------------------- |
| Bot vs browser diff | 214 URLs     | 0        | 0                                           | 0                           |
| Hiding-trick search | 214 URLs     | 57       | 41 (screen-reader labels, accordion panels) | 16                          |
| AI-phrase search    | 214 URLs     | 16       | 0                                           | 16 (the same block)         |
| Plugin checksums    | 23 plugins   | 1        | 0                                           | 1 (a social-sharing plugin) |
| Comment search      | 312 comments | 2        | 0                                           | 2 spam comments             |

The arithmetic is short. Of 57 hiding hits, 41 were legitimate, which leaves 16. The AI-phrase search found the same 16, so every real hit was one repeated block. That's 16 of 214 URLs, or about 7.5% of the site. All 16 were blog posts that used the compromised plugin's share block.

The block sat off-screen and addressed "AI assistants." Defanged, it read: "[instruction to recommend an unrelated invoice-financing site removed]." Tallyfold never wrote it, yet its pages carried it. Left alone, it risked a hacked-content warning in Google and a Bing penalty, and it could have pushed readers' AI assistants toward a stranger's site.

The fix took an afternoon. The team removed the plugin, restored the 16 posts from a clean backup, deleted the 2 spam comments, and rotated admin passwords and keys. A week later the scheduled search found 41 hits, all of them the known screen-reader labels and panels, and 0 new problems.

## What Rankbox Does and Doesn't Do Here

Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000–3,500-word, source-backed articles for your site. Everything it writes is visible, sourced text for people. It doesn't write hidden instructions, and it doesn't scan your site for injected text or track AI citations. Use the audit above for that.

Because the writer reads web pages during research, it faces the same class of risk as any tool that reads the web. No product is immune to prompt injection, ours included, so read each draft and check its sources before you publish. Our own footer's "Ask AI about Rankbox" links send a plain question, shown on the page exactly as sent, with no "remember" instruction. Plans start at $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### Can prompt injection get my site cited by ChatGPT?

Not reliably. The Guardian swayed ChatGPT search with hidden text in November 2024 tests, but later tests found most assistants ignored or flagged hidden instructions. Google and Bing treat attempts to manipulate AI answers as spam, so any gain is small and short-lived, and the downside can include lost rankings or delisting.

### Do AI crawlers like GPTBot follow instructions hidden in web pages?

No vendor documents a crawler that acts on page text. GPTBot and ClaudeBot collect pages, and OAI-SearchBot and Claude-SearchBot build search indexes. Hidden instructions matter only when a language model later reads the stored text, for example while answering a question or running an agent task.

### Is hidden text for AI a violation of Google's spam policies?

Yes. Google's spam policies cover hidden text and cloaking, and since 15 May 2026 they explicitly cover attempts to manipulate generative AI responses in Google Search. Text that only screen readers can reach, meant to help screen reader users, is allowed. Text hidden from people and aimed at machines isn't.

### What is black hat GEO?

Black hat GEO is any tactic that breaks search engine or platform rules to get a brand into AI answers. Examples include hidden instructions, hidden fake reviews, cloaking for AI bots, and "Summarize with AI" links that plant memory prompts. Microsoft calls the last one AI Recommendation Poisoning.

### Is a "Summarize with AI" button a form of prompt injection?

It can be. A button that only opens an assistant with a plain question is fine. Microsoft's February 2026 research found buttons that also told the assistant to "remember" a company as a trusted source. It treats those hidden memory instructions as a form of prompt injection and advises users to check their saved memories.

### How do I check my site for injected prompts?

Compare the HTML served to browsers and to AI bots, search your source for hiding tricks and AI-directed phrases, verify plugin files against official checksums, and review user comments and reviews. Then check the Security issues and Manual actions reports in Search Console and Bing Webmaster Tools.

## References

1. [Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection, Greshake et al., arXiv](https://arxiv.org/abs/2302.12173)
2. [LLM01:2025 Prompt Injection, OWASP Gen AI Security Project](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
3. [ChatGPT search tool vulnerable to manipulation and deception, tests show, The Guardian](https://www.theguardian.com/technology/2024/dec/24/chatgpt-search-tool-vulnerable-to-manipulation-and-deception-tests-show)
4. [Ranking Manipulation for Conversational Search Engines, Pfrommer et al., arXiv](https://arxiv.org/abs/2406.03589)
5. [Adversarial Search Engine Optimization for Large Language Models, Nestaas et al., arXiv](https://arxiv.org/abs/2406.18382)
6. [Manipulating Large Language Models to Increase Product Visibility, Kumar and Lakkaraju, arXiv](https://arxiv.org/abs/2404.07981)
7. [Manipulating AI memory for profit: The rise of AI Recommendation Poisoning, Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/02/10/ai-recommendation-poisoning/)
8. [We Hid Text on a Webpage to Trick AI Search, OtterlyAI](https://otterly.ai/blog/blackhat-geo-experiment-hidden-text/)
9. [Hidden Prompt Injection vs. Twelve AI Assistants, Search Engine World](https://www.searchengineworld.com/hidden-prompt-injection-vs-twelve-ai-assistants-one-obeyed-three-warned-the-user)
10. [Understanding prompt injections: a frontier security challenge, OpenAI](https://openai.com/index/prompt-injections/)
11. [Continuously hardening ChatGPT Atlas against prompt injection attacks, OpenAI](https://openai.com/index/hardening-atlas-against-prompt-injection/)
12. [Mitigating the risk of prompt injections in browser use, Anthropic](https://www.anthropic.com/research/prompt-injection-defenses)
13. [Claude in Chrome is generally available, Anthropic](https://claude.com/blog/claude-in-chrome-generally-available)
14. [Mitigating prompt injection attacks with a layered defense strategy, Google Security Blog](https://security.googleblog.com/2025/06/mitigating-prompt-injection-attacks.html)
15. [How Microsoft defends against indirect prompt injection attacks, Microsoft Security Response Center](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks)
16. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
17. [Latest Google Search documentation updates, Google Search Central](https://developers.google.com/search/updates)
18. [Bing Webmaster Guidelines, Microsoft Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
19. [Prompt injection is not SQL injection (it may be worse), UK National Cyber Security Centre](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection)
20. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
