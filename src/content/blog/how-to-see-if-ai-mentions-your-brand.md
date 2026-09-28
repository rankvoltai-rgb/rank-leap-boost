---
title: How to See If AI Mentions Your Brand: The 15-Minute Audit
description: See if AI mentions your brand in 15 minutes: five prompts for ChatGPT, Claude and Perplexity, clean-session settings, a scoring sheet and fixes.
keyword: AI mentions your brand
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Playbooks
---

To see if AI mentions your brand, paste five buyer prompts into ChatGPT, Claude and Perplexity from a clean session, score each answer on a simple sheet, and check which sources each engine cited. It takes 15 minutes and costs nothing. You come away with three numbers: how well the engines know you, how often they recommend you, and how often they cite your own site.

Many of the top results for this question are tool pages that end in a free trial or a demo request. Enterprise tracker plans are often quote-only: Profound lists its Enterprise plan as ["Custom"](https://www.tryprofound.com/pricing) as of 28 September 2026. You don't need one to learn whether AI mentions your brand. A careful manual audit tells you whether you have a problem and roughly where it is.

Care matters because AI answers change from run to run. When SparkToro and Gumshoe had 600 volunteers run 12 prompts a combined 2,961 times, they put the odds that ChatGPT or Google's AI gives the [same list of brands twice](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/) at under 1 in 100. This audit is built around that fact. For the always-on version, read our guide to [measuring GEO](/blog/how-to-measure-geo). For why single checks mislead, see [the technical reality of tracking brand mentions](/blog/is-it-possible-to-track-brand-mentions-in-ai-answers).

## Key Takeaways

- You can check whether AI mentions your brand in 15 minutes with five prompts, three engines and one repeat run: 18 answers in all.
- Test from a clean session. ChatGPT's temporary chat set to Unpersonalized skips memory and custom instructions, Claude's incognito chat skips memory, and signed-out Perplexity threads are anonymous.
- Claude's incognito chat can still read your profile preferences and custom styles, so clear them before you test.
- Score recall (does the engine know you?) and discovery (does it recommend you unprompted?) as separate numbers. They often differ a lot, and they have different fixes.
- Open the sources on every answer. Even when AI mentions your brand, the third-party pages behind the answer tell you what to fix.
- Problem-style prompts catch a blind spot that "best of" prompts miss: engines that know your brand but don't link it to the job it does.
- One audit is a baseline, not a trend. Repeat it monthly, or move to a larger prompt panel when the stakes rise.

## How to See If AI Mentions Your Brand in 15 Minutes

Here is the whole plan on one screen. The settings, prompts and scoring rules follow in the next sections.

| Minutes | What you do | What you get |
| --- | --- | --- |
| 0–2 | Fill in five blanks, open a sheet, open three clean sessions | A fair starting point |
| 2–5 | Paste the two recall prompts into each engine | 6 answers: does each engine know you? |
| 5–10 | Paste the three discovery prompts into each engine | 9 answers: are you recommended without being named? |
| 10–12 | Re-run the "best of" prompt once in each engine | 3 answers: how stable is your place? |
| 12–15 | Total the scores, open the sources, read the diagnosis table | Your baseline and one fix to start with |

Work in three browser tabs, one per engine. Paste the same prompt into all three, and score each answer while the next one loads.

### Minutes 0 to 2: set up

Open a sheet with these columns: engine, prompt, run, points, your site in sources (yes or no), rivals named, and notes for wrong facts. Open a signed-out or temporary ChatGPT chat, a Claude incognito chat with web search on, and a signed-out or incognito Perplexity thread. Write down the date, your country and whether you used a VPN.

### Minutes 2 to 5: recall prompts

Paste prompt A into all three tabs, then prompt B. Start a fresh chat for each prompt, so one answer doesn't shape the next. Score each answer as you read it and note any wrong price, feature or description.

### Minutes 5 to 10: discovery prompts

Paste C, D and E into all three tabs, each in a fresh chat. Write down every brand each answer recommends, in order. Then open the sources and note whether your site appears, plus the two or three other domains cited most.

### Minutes 10 to 12: one repeat

Run prompt C again, in a new clean chat, in each engine. You'll often get a different list. One repeat isn't a statistic, but it shows whether your place is steady or shaky.

### Minutes 12 to 15: score and diagnose

Total your points, work out the three numbers in the scorecard, and find your pattern in the diagnosis table. By now you know whether AI mentions your brand, how often, and where it doesn't. Pick one fix. Don't try to fix everything from one reading.

## Test Whether AI Mentions Your Brand From a Clean Session

Your own account is the worst place to check whether AI mentions your brand. It knows your job, your company and what you've asked before, and each product can use that to shape answers. The settings below come from each vendor's help pages as of 28 September 2026.

| Product | Use it signed out? | Private chat | Memory control | Make sure it searches | Where sources show |
| --- | --- | --- | --- | --- | --- |
| ChatGPT | Yes, search works signed out | Temporary chat, set to Unpersonalized | Settings > Personalization > Memory | Search in the tools menu, or type / | Inline citations and the Sources button |
| Claude | No, claude.ai asks you to sign in | Incognito (ghost icon) | Settings > Memory | "+" > Web search, or say "search the web" | Inline citations |
| Perplexity | Yes, threads are anonymous | Profile icon > Incognito | Turn memory off; clear your bio | Searches for every answer | Numbered citations |

### ChatGPT

OpenAI says web search is available to [people who are not signed in](https://help.openai.com/en/articles/9237897-chatgpt-search), so a signed-out private window is one clean option. If you'd rather stay signed in, open a new chat, select Temporary, and choose Unpersonalized before your first message. OpenAI's [temporary chat page](https://help.openai.com/en/articles/8914046-temporary-chat-faq) says an unpersonalized chat "does not use memory, custom instructions, or plugins," and you can't change the choice once the chat starts.

This matters when you check whether AI mentions your brand. OpenAI's [memory page](https://help.openai.com/en/articles/8590148-memory-faq) says that when Memory is on, ChatGPT "may use relevant details to formulate a more useful search query." If you've spent months asking ChatGPT about your own product, it may steer searches toward you.

Watch two more things. ChatGPT estimates your location from your IP address, and a VPN can change it, so test from the country your buyers are in. And on Free, Go and signed-out sessions, [ads may appear](https://help.openai.com/en/articles/20001047-ads-in-chatgpt) below an answer, labeled as sponsored. OpenAI says ads don't influence answers. Don't count a sponsored unit as a mention. Temporary chats show no ads.

### Claude

Claude asks you to sign in before you can chat: on 28 September 2026, claude.ai sent signed-out visitors to its login page. A free account works. Then use an [incognito chat](https://support.claude.com/en/articles/12260368-use-incognito-chats), which every plan has. Start a new chat outside any project and click the ghost icon in the upper right. Anthropic says an incognito chat "won't use Claude's existing memory."

The same page spells out a catch: Claude can still read your profile information, such as personal preferences and custom styles, inside an incognito chat. If your preferences say "I'm head of marketing at Plannora," clear that field before you test. You can also pause memory under Settings > Memory. Anthropic's [memory page](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context) says memory is on by default for Free, Pro and Max plans.

Then make sure Claude searches. In the classic interface, click "+" and select Web search. Anthropic's [web search page](https://support.claude.com/en/articles/10684626-enable-and-use-web-search) says the newer Claude experience has no toggle and searches when it helps, and suggests adding "Search the web" to your prompt. Without a search, Claude answers from training data and shows no sources to check.

### Perplexity

Perplexity is the simplest of the three. Its help center says that if you are [not signed in](https://www.perplexity.ai/help-center/en/articles/10352990-account-settings), "your threads are anonymous by default, so there is no need for incognito mode." If you're signed in, click your profile icon at the bottom left and choose Incognito. Perplexity says [memory and search history](https://www.perplexity.ai/hub/blog/introducing-ai-assistants-with-memory) are switched off in incognito mode. Incognito threads [expire within 24 hours](https://www.perplexity.ai/help-center/en/articles/12639758-incognito-mode-troubleshooting), so screenshot anything you want to keep.

One more setting: Perplexity uses your "Introduce yourself" bio to personalize answers. If yours names your company, blank it for the audit or test signed out.

### Optional: Gemini and Google AI Mode

With five spare minutes, run prompts C and D in two more places. Google's AI answers draw on Google Search, so they can surface pages the other three skip. Score them with the same rules, but in their own rows, so next month's three-engine totals still compare.

- **Gemini.** Google says you can use [some Gemini features signed out](https://support.google.com/gemini/answer/13275745) on some devices, mostly text questions. Signed in, click Temporary chat next to New chat. It needs a personal Google Account, not a work or school one, and Google says a temporary chat can't give personalized responses. When Gemini shows links, the [Sources button](https://support.google.com/gemini/answer/14143489) sits at the bottom of the answer.
- **Google AI Mode.** [Go to google.com/ai](https://support.google.com/websearch/answer/16011537). Google says AI Mode [personalizes answers](https://support.google.com/websearch/answer/17212611) only if you're 18 or older and have history and personalized recommendations on, so turn that setting off first, or test signed out. AI Mode splits your question into sub-searches, which Google calls [query fan-out](/glossary/query-fan-out), and links the pages it used.

## The Five Prompts That Show Whether AI Mentions Your Brand

Fill in five blanks first. In the worked example below, Plannora is a made-up project management tool and Loopcraft is its made-up rival.

- **{Brand}:** your brand name, spelled the way customers spell it. (Plannora)
- **{Rival}:** the competitor buyers mention most. (Loopcraft)
- **{category}:** what buyers call your type of product. (project management software)
- **{audience}:** who buys it. (small marketing agencies)
- **{problem}:** the pain that sends them looking. (client projects keep going over budget)

Then paste these, word for word, with your blanks filled in:

```text
A. What is {Brand}, and who is it for?
B. {Brand} vs {Rival}: which is better for {audience}?
C. What are the best {category} tools for {audience}? Give me a shortlist.
D. Our {problem}. What tools or approaches would you recommend?
E. What are the best alternatives to {Rival}?
```

Prompts A and B are **recall prompts**. They name you, so they test whether each engine knows who you are and gets the facts right. Prompts C, D and E are **discovery prompts**. They never name you, so they test whether an engine recommends you to a buyer who has never heard of you. That's the harder test, and the one that brings new customers.

Prompt D is the one most audits skip. Buyers often describe a problem before they name a category, and engines can know your brand without tying it to the job it does.

Want more prompts after the audit? Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) writes 30 across the buying journey from the same kind of blanks.

## The Brand Recall Scorecard

This sheet turns 18 answers into a baseline for how often AI mentions your brand. It separates knowing from recommending, because they have different causes and different fixes.

### What counts when AI mentions your brand

An answer can include you in three ways, and they aren't equal:

1. **Named.** Your brand appears in the text. That's a [brand mention](/glossary/brand-mentions), with or without a link.
2. **Recommended.** You're on the shortlist the answer gives, ideally near the top. A passing mention ("some teams also use Plannora") is weaker.
3. **Cited.** One of your own pages appears in the answer's sources. That's an [AI citation](/glossary/ai-citation), and it's the only kind that can send a click.

An engine can name you without citing you, having learned about you from a review site or a Reddit thread. It can also cite your blog for a fact while recommending a rival. So the scorecard scores naming and recommending, and tracks citations as a separate rate.

### How to score each answer

| Score | Recall prompts (A, B) | Discovery prompts (C, D, E, C repeat) |
| --- | --- | --- |
| 2 | Knows you and describes you correctly | Recommends you among the first three brands |
| 1 | Knows you, but vague, dated or partly wrong | Names you fourth or later, or only in passing |
| 0 | Doesn't know you, or mixes you up with another company | Doesn't name you |

### The three numbers to report

- **Recall score** = recall points ÷ 12. Six answers (two prompts, three engines), two points each.
- **Discovery score** = discovery points ÷ 24. Twelve answers (four runs, three engines), two points each.
- **Own-source rate** = answers whose sources include your site ÷ answers that showed any sources.

Read the discovery score with a rule of thumb, not a verdict. At 50% or more, engines already treat you as a real option. From 20% to 49%, you're on some shortlists but not most. Under 20%, buyers who don't know your name mostly won't hear it. These bands are ours, set for a first read, not an industry standard. Read each engine on its own too. A brand can be strong in Perplexity and missing in ChatGPT, and the fix differs.

## Worked Example: Plannora's First Audit

Plannora is fictional and these scores are illustrative, but the arithmetic is real. Here is its sheet.

| Engine | A | B | C | C repeat | D | E | Recall (of 4) | Discovery (of 8) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ChatGPT | 2 | 2 | 1 | 0 | 0 | 2 | 4 | 3 |
| Claude | 1 | 2 | 0 | 1 | 0 | 1 | 3 | 2 |
| Perplexity | 2 | 1 | 2 | 1 | 0 | 2 | 3 | 5 |
| **Total** | | | | | | | **10 of 12** | **10 of 24** |

**Recall is strong.** 10 of 12 is 83%. Every engine knows Plannora. The weak spots are Claude's answer to A, a vague line from training data because it didn't search, and Perplexity's answer to B, which quoted a price Plannora changed last year. The notes column traced that price to a 2024 review.

**Discovery is patchy.** 10 of 24 is 42%, the middle band. The rows tell the story. Prompt E, alternatives to Loopcraft, scored 5 of 6 because Plannora has its own comparison page. Prompt D, the budget problem, scored 0 of 6: no engine tied Plannora to over-budget projects, though that's what it's built for.

**Own-source rate is low.** Thirteen answers showed sources: four in ChatGPT, three in Claude and all six in Perplexity. Plannora's site appeared in three, so 3 ÷ 13 is 23%. On prompt D, all three engines cited the same kinds of pages: agency blogs about project budgets and a "best tools" roundup that listed Loopcraft but not Plannora.

**One fix to start with.** The engines already know Plannora, so more brand awareness isn't the first job. It's a clear, answer-first page on keeping agency projects on budget, plus a pitch to the roundup that left it out. Second comes correcting the old price at its source.

## If AI Mentions Your Brand Rarely: Symptom, Cause, Fix

Each row starts from something you saw while checking whether AI mentions your brand. Most audits show two or three at once. Start with the one on your highest-value prompt.

| What you saw | Likely cause | What to do |
| --- | --- | --- |
| "I'm not familiar with {Brand}," or a description of a different company | Too little written about you on pages engines trust, or a name clash | Publish a plain facts page and keep every profile consistent. See [optimizing your business for AI search](/blog/optimize-business-for-ai-search). |
| Knows you but gets a price, feature or plan wrong | An old page is being read, yours or a reviewer's | Fix your page and ask the third party to update theirs. In Perplexity, [use the flag icon](https://www.perplexity.ai/help-center/en/articles/10354902-how-can-i-report-incorrect-or-inaccurate-answers), and see our guide to [brand presence in Perplexity](/blog/brand-presence-in-perplexity). |
| Named on A and B, missing on C | You're not on the roundups and review pages the engine reads for your category | Earn a place on those pages. Our playbook on [ranking on ChatGPT](/blog/how-to-rank-on-chatgpt) shows how. |
| Missing on D only | No page ties your product to the problem in plain words | Write an answer-first page for the problem. See [optimizing content for AI search](/blog/optimize-content-for-ai-search). |
| The rival comes first, and the sources are the rival's pages | The rival owns the comparison and alternatives pages | Publish fair comparison and alternatives pages of your own. |
| Named, but your site is never in the sources | Engines learned about you from third parties, and your pages aren't retrieved or quoted | Run the free [AI search readiness check](/tools/ai-search-readiness-check) and make key pages quotable. |
| Your site never appears in any engine's sources, even on B | A crawler is blocked by robots.txt, a CDN or a firewall | Test your file with the [robots.txt tester](/tools/robots-txt-tester) and read [the Cloudflare challenge trap](/blog/cloudflare-challenge-trap). |
| Cited in Perplexity, absent in ChatGPT | The engines search different sources | Check that ChatGPT can reach and find you (see the note below) and read our [Bing Webmaster Tools guide](/blog/bing-webmaster-tools-ai-indexing-guide). |
| Claude answers with no sources | Web search was off or didn't run | Turn web search on and re-run with "search the web". |
| Named in one run of C, missing in the other | You're on the edge of the shortlist | Count it as partial and confirm with a bigger prompt panel. |

A note on the ChatGPT row. OpenAI's [search help](https://help.openai.com/en/articles/9237897-chatgpt-search) says that when ChatGPT works with search partners, it rewrites your question into targeted queries for them, and it links Microsoft's privacy statement among those providers. The same page says a site becomes eligible by letting OAI-SearchBot crawl it and allowing OpenAI's published IP addresses. So "absent in ChatGPT" is often an access or index problem, not a writing problem.

## After the Audit: Turn One Reading Into a Habit

A single audit shows whether AI mentions your brand today. It can't show whether you're improving. That takes the same prompts, run the same way, again and again.

- **Monthly:** re-run the five prompts with the same settings and compare the three numbers. Don't reword the prompts, or the comparison means nothing.
- **Always on:** our guide to [tracking brand mentions in AI search](/blog/how-to-track-brand-mentions-in-ai-search) sets up a prompt set, a recording template and a cadence you can keep running.
- **When it matters:** grow to a panel of 25 to 50 prompts, run several times each. Our guide to [measuring GEO](/blog/how-to-measure-geo) covers panel sizes and the margin of error at each size.
- **Against rivals:** our [20-prompt benchmark against competitors](/blog/how-to-benchmark-ai-citations-against-competitors) turns "Loopcraft keeps winning" into a score.
- **Between audits:** some evidence needs no prompts. Our list of [six places to see AI mentions](/blog/see-if-ai-mentions-your-brand-places-to-look) covers the reports Google, Microsoft and your analytics already give you.

Paid trackers run prompts for you on a schedule. Entry plans start low: Otterly.AI's Lite plan is [$29 a month](https://otterly.ai/pricing) for 15 prompts, as listed on 28 September 2026. Our [ChatGPT rank tracker comparison](/blog/chatgpt-rank-tracker) lists what to ask before you buy one.

## What Rankbox Does With Your Blind Spots

Rankbox doesn't track AI mentions or citations today, so it won't run this audit for you. It works on the step after. Once you know where AI mentions your brand and where it doesn't, [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google about your category, including problem-style questions like prompt D. The [Citation-Ready Writer](/features/citation-ready-writer) then researches the live web and writes source-backed articles aimed at those gaps, which reach your site through Rankbox's API.

That's one Business plan at $49.50 a month with a 7-day trial. [See pricing](/pricing). Then re-run your five prompts next month and see whether the D row has moved.

## Frequently Asked Questions

### How do I check if ChatGPT mentions my brand?

Open a temporary chat set to Unpersonalized, or a signed-out window, and ask for the best tools in your category for your kind of buyer. Run the prompt twice in fresh chats. Note whether you're named, where you sit in the list, and whether your site appears under Sources. Then ask "What is {Brand}?" to check the facts it holds about you.

### Do I need to be logged out to see if AI mentions your brand?

Not always, but you need a clean session. ChatGPT and Perplexity both work signed out. Signed in, use ChatGPT's unpersonalized temporary chat, Perplexity's incognito mode, or Claude's incognito chat with your profile preferences cleared. Your own account knows your company, which can tilt answers toward you.

### Why does AI mention my competitor but not me?

Usually because your competitor appears on the pages the engine reads for that question: roundups, review sites, comparison pages and forum threads. Open the sources on the answer that named them. Those pages show where to earn a place, or which topic your own site doesn't cover yet.

### How often should I check whether AI mentions your brand?

Once a month is enough for a manual audit, as long as you use the same prompts and settings each time. Weekly checks of a handful of answers mostly show noise, because answers vary from run to run. For faster or finer readings, move to a larger panel or a paid tracker.

### Is there a free way to see if AI mentions your brand?

Yes. This 15-minute audit costs nothing. Google Search Console and Bing Webmaster Tools also report some AI visibility for free, and GA4 shows visits from AI assistants. Our free AI Visibility Prompt Kit writes 30 prompts and a scorecard if you want a longer test.

### Why does the answer change every time I ask?

AI engines pick each word by sampling, and they often run a fresh web search that returns different pages. So whether AI mentions your brand can change from one run to the next. That's why the audit repeats the "best of" prompt, and why a mention rate across many runs beats any single answer.

## References

1. [Temporary chat in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/8914046-temporary-chat-faq)
2. [Memory in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/8590148-memory-faq)
3. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
4. [Ads in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/20001047-ads-in-chatgpt)
5. [Use incognito chats, Claude Help Center](https://support.claude.com/en/articles/12260368-use-incognito-chats)
6. [Use Claude's chat search and memory to build on previous context, Claude Help Center](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)
7. [Enable and use web search, Claude Help Center](https://support.claude.com/en/articles/10684626-enable-and-use-web-search)
8. [Account & Settings, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10352990-account-settings)
9. [Incognito Mode Troubleshooting, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/12639758-incognito-mode-troubleshooting)
10. [Introducing AI assistants with memory, Perplexity](https://www.perplexity.ai/hub/blog/introducing-ai-assistants-with-memory)
11. [How can I report incorrect or inaccurate answers?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10354902-how-can-i-report-incorrect-or-inaccurate-answers)
12. [Use Gemini Apps, Gemini Apps Help](https://support.google.com/gemini/answer/13275745)
13. [View related sources from Gemini Apps, Gemini Apps Help](https://support.google.com/gemini/answer/14143489)
14. [Personal Intelligence: How AI Mode in Search personalizes responses, Google Search Help](https://support.google.com/websearch/answer/17212611)
15. [Get AI-powered responses with AI Mode in Google Search, Google Search Help](https://support.google.com/websearch/answer/16011537)
16. [AIs are highly inconsistent when recommending brands or products, SparkToro](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
17. [Pricing, Profound](https://www.tryprofound.com/pricing)
18. [Pricing, Otterly.AI](https://otterly.ai/pricing)
