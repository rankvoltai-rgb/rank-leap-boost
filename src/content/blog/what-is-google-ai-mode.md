---
title: What Is Google AI Mode? How It Works and How It Differs From AI Overviews
description: What is Google AI Mode? How Google's conversational search works: Gemini models, query fan-out, follow-ups, Deep Search, and how it differs from AI Overviews.
keyword: Google AI Mode
date: 2026-09-29
updated: 2026-09-29
author: Rankbox Team
tags: AI Search, Google
---

Google AI Mode is a chat-style search mode inside Google Search. You ask a full question, a custom Gemini model splits it into smaller questions, searches Google for each one at once, and writes a single answer with links. You can then ask follow-up questions, and it keeps track of what you asked before.

Google launched it as a [Labs experiment](https://blog.google/products/search/ai-mode-search/) in March 2025 and began rolling it out to everyone in the US that May. By May 2026, Google said it had [passed a billion monthly users](https://blog.google/products-and-platforms/products/search/search-io-2026/). It lives beside [AI Overviews](/glossary/ai-overviews), the short AI summaries that sit on top of some regular results, but it is a separate system with its own model and its own habits.

This explainer covers how it works, step by step, as Google documents it in September 2026. For what it means for your traffic and how to optimize, read our [guide to Google AI Mode vs. traditional search](/blog/google-ai-mode-vs-traditional-search). To open it and try it yourself, see [where to find AI Mode in Google](/blog/what-is-ai-mode-in-google).

## Key Takeaways

- Google AI Mode is conversational search: one question goes in, many background searches run, and one answer with links comes out. Follow-up questions keep the context.
- Google calls the method "query fan-out." Its help page says the model divides a question "into subtopics" and searches "for each one simultaneously." Google has never published a fixed number of searches.
- Gemini 3.5 Flash has been the default model since May 2026. A model menu offers stronger options with daily limits, and paying subscribers get Deep Search, which can run hundreds of searches for one report.
- Answers draw on Google's index plus other data, such as the Knowledge Graph and shopping listings. When Google isn't confident in an AI answer, it shows plain web links instead.
- AI Overviews and AI Mode follow the same eligibility rules and share a Search Console report, yet they usually cite different pages. Ahrefs measured a 13.7% overlap.

## How Google AI Mode Builds an Answer

Google hasn't published a full blueprint, but its launch posts and help pages describe the main steps. We've put them in order and called it the **AI Mode answer loop**: five steps that repeat every time you ask something new in the same thread.

1. **Read the request and its context.** Your question can be typed, spoken, photographed or uploaded as a file, and earlier turns in the conversation come along with it. If you're 18 or older and turn on Personal Intelligence, Google can also draw on your search history and connected apps such as Gmail and Google Photos.
2. **Plan the research.** At launch, Google said the model would "make a plan, conduct searches to find information and adjust the plan based on what it finds."
3. **Fan out.** The model writes several narrower searches and runs them at the same time, across the web index and other data sources.
4. **Ground the answer and write it.** Google says its AI features are ["rooted in our core Search ranking and quality systems."](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) The model reads the pages it retrieved, then writes a response in whatever layout fits: text, a table or an interactive tool.
5. **Show links and wait for the next turn.** Links appear inline and at the end, and a box invites your follow-up. The thread is saved to your AI Mode history if history is on.

### The model behind Google AI Mode

Google AI Mode has always run on a custom version of Gemini, and the version changes often. It started on Gemini 2.0 in March 2025 and moved to Gemini 2.5 two months later. Gemini 3 arrived in [November 2025](https://blog.google/products-and-platforms/products/search/gemini-3-search-ai-mode/), first for subscribers. At I/O on 19 May 2026, Google made Gemini 3.5 Flash "the new default model in AI Mode for everyone globally."

You can also pick a model yourself. Google's help page describes a "Pro" option in the menu of the Ask anything bar, with daily limits, next to the everyday "Fast" model. Since 2 September 2026, Google AI Pro and Ultra members can also switch to [Gemini 3.8 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/) in AI Mode. Google has also described automatic routing, starting with US subscribers, that sends the hardest questions to stronger models "while continuing to use faster models for simpler tasks." One warning: Google's own [AI Mode product page](https://search.google/ways-to-search/ai-mode/) still says it uses Gemini 3, so don't treat any single page as the final word.

### Query fan-out, in Google's words

Fan-out is the step that makes AI Mode different from a normal search. Google's [help page](https://support.google.com/websearch/answer/16011537?hl=en) says AI Mode uses this technique, "dividing your question into subtopics and searching for each one simultaneously across multiple data sources," then combines what it finds. When Gemini 3 arrived, Google said fan-out could "perform even more searches" and find content "it may have previously missed."

Google gives no fixed count. It describes "multiple" or "a multitude" of searches for a normal answer and "hundreds" for Deep Search. Our glossary entry on [query fan-out](/glossary/query-fan-out) compares how Google and ChatGPT describe the technique.

### Follow-ups and memory

A follow-up in Google AI Mode doesn't start from scratch. The earlier turns stay in play, so "which of those is cheapest?" makes sense without repeating the product names. Since January 2026, you can also [start a conversation](https://blog.google/products-and-platforms/products/search/ai-mode-ai-overviews-updates/) by typing a follow-up under an AI Overview, and it continues in AI Mode. With history on, you can reopen an old thread later and carry on.

## Deep Search and the Other Tools Inside AI Mode

The default answer is only one of several things AI Mode can do. Some tools are open to everyone, and some are held back for paid plans or certain countries. Here is what Google documents as of September 2026.

| Tool                  | What it does                                                              | Who can use it                                                                                                       |
| --------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Deep Search           | Runs hundreds of searches and writes a fully cited report in minutes      | Google AI Pro and Ultra subscribers; launched first in the US through Labs                                           |
| Model menu            | Swaps the everyday "Fast" model for "Pro" or a newer Gemini model         | Pro: signed-in users in English in listed countries, with daily limits; newer models and higher limits on paid plans |
| Search Live           | Talks back and forth by voice, with your camera if you like               | Google app on Android and iOS, wherever AI Mode is available                                                         |
| Interactive visuals   | Builds simulations, charts and calculators inside the answer              | Signed-in users, in English                                                                                          |
| Notebooks             | Keeps project sources and instructions, synced with Gemini                | Anyone signed in to a personal Google Account                                                                        |
| Personal Intelligence | Tailors answers using your history and connected apps                     | Ages 18+, with history on; no subscription needed                                                                    |
| Tasks for you         | Checks local prices, calls businesses, books tables, buys from some shops | English, signed in, 18+; checkout is US only                                                                         |

### Deep Search

Deep Search is the research end of Google AI Mode. Google says it [issues "hundreds of searches"](https://blog.google/products/search/deep-search-business-calling-google-search/), reasons "across disparate pieces of information" and crafts "a comprehensive, fully-cited report in minutes." It reached Google AI Pro and Ultra subscribers in July 2025, starting in the US for people in the AI Mode Labs experiment. It suits questions you'd otherwise spend an afternoon on, like comparing mortgage options or researching a new market.

### Search Live and multimodal input

[Search Live](https://support.google.com/websearch/answer/16329036?hl=en) turns AI Mode into a voice conversation. You tap Live in the Google app, talk, and can turn on your camera to show Search what you're looking at. Answers come back as audio with links on screen. Google says it's available in every region and language where AI Mode works.

### Tasks it can do for you

AI Mode can now do some of the legwork. Google's help page on [local availability and pricing](https://support.google.com/websearch/answer/17104441?hl=en) says it can find appointments, check real-time prices and stock, and call businesses for details that aren't online. In the US, it can also [buy from eligible retailers](https://support.google.com/websearch/answer/16833721?hl=en) with Google Pay. Google says only the details you confirm are passed to businesses, and typing "don't call" keeps the search online.

## Where AI Mode Gets Its Sources and How It Shows Links

Google AI Mode doesn't answer from memory alone. When it launched, Google said it taps "high-quality web content" plus "fresh, real-time sources like the Knowledge Graph, info about the real world, and shopping data for billions of products." Google's [guide to generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) calls this grounding: its ranking systems retrieve "relevant, up-to-date web pages" and the model writes from them.

For a page to be used, Google's rules are short. It must be [indexed and eligible to show a snippet](https://developers.google.com/search/docs/appearance/ai-features), and there's no special markup or AI file to add. The traffic side of this, and how to earn those links, is covered in our [AI Mode traffic guide](/blog/google-ai-mode-vs-traditional-search).

### How links appear in the answer

In [May 2026](https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/), Google changed how AI Mode shows its sources:

- **Inline links** sit next to the sentence they support.
- **Further reading** appears at the end of many answers, pointing to in-depth articles.
- **Community perspectives** preview quotes from forums and social posts, with the creator's or community's name.
- **Subscription labels** mark links from news sites you subscribe to.
- **Hover previews** show the site's name and page title before you click, on desktop.

Source mix differs from AI Overviews, too. Ahrefs found that AI Mode [leans more on encyclopedic and detailed medical sources](https://ahrefs.com/blog/ai-overviews-vs-ai-mode/), while AI Overviews lean more on video and community sites like Reddit.

### When AI Mode gets it wrong

Google is upfront that the product makes mistakes. Its help page says AI Mode "doesn't always get it right" and may "misinterpret web content or miss context." Google's advice is to check important facts in more than one place, open the linked sources, and use the thumbs-up or thumbs-down buttons under each answer to send feedback.

## Google AI Mode vs. AI Overviews

AI Overviews and AI Mode come from the same company and the same index, so people mix them up. In practice, they differ in how you reach them, how long they run and which pages they pick.

| Question                          | AI Overviews                                               | Google AI Mode                                         |
| --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| How do you get one?               | Google adds it to a results page when it judges it helpful | You open AI Mode, or ask a follow-up under an Overview |
| How long is the answer?           | Short summary                                              | About four times longer, per Ahrefs                    |
| Brands or people named per answer | 1.3 on average                                             | 3.3 on average                                         |
| Can you keep talking?             | Only by moving into AI Mode                                | Yes, context carries across turns                      |
| Default model                     | Gemini 3, since January 2026                               | Gemini 3.5 Flash, since May 2026                       |
| What you can control              | Nothing; it appears or it doesn't                          | Model choice, follow-ups and history                   |

### Why they pick different pages

Google's [AI features documentation](https://developers.google.com/search/docs/appearance/ai-features) says the two "may use different models and techniques, so the set of responses and links they show will vary." It adds that AI Overviews only appear when Google judges them useful, so they often don't show at all. AI Mode tries to answer whatever you bring to it, and falls back to web links when it isn't confident.

Ahrefs put numbers on the gap. Across 540,000 US query pairs from September 2025, the two surfaces cited the same URLs just 13.7% of the time. Yet their answers reached the same meaning 86% of the time. Same conclusions, different sources.

### What they share

For site owners, the rules are the same. One set of eligibility requirements applies to both. One Search Console setting, the [Search generative AI control](https://support.google.com/webmasters/answer/16908024?hl=en), opts a site in or out of both. And one report counts impressions from both together. Our [technical guide to AI Overviews and AI Mode](/ai-seo/google-ai-overviews) covers those controls in detail.

## What Google AI Mode Means If You Publish on the Web

Because AI Mode searches for sub-questions, a page can be cited for a narrow part of a big question, even if it would never rank first for the whole thing. Because the answer comes before the click, the visits that do arrive tend to come from people who want depth, proof or a next step. Our [guide to AI Mode and web traffic](/blog/google-ai-mode-vs-traditional-search) weighs the click studies and gives a model for estimating your own exposure. For the shorter surface, see [how to show up in Google AI Overviews](/blog/how-to-show-up-in-google-ai-overviews).

If you want pages that answer those narrow sub-questions, Rankbox can help. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000 to 3,500-word, source-backed articles, and your developer connects them to your site through Rankbox's API. It doesn't track AI Mode citations. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)).

## Frequently Asked Questions

### Is Google AI Mode free?

Yes. The standard AI Mode experience is free, and Google says its default model is available "for everyone globally." Some extras, such as Deep Search, the newest model choices, higher usage limits and certain agents, are reserved for Google AI Pro and Ultra subscribers.

### What model does Google AI Mode use?

Google AI Mode uses custom Gemini models. Gemini 3.5 Flash became the default for everyone on 19 May 2026. Since 2 September 2026, Google AI Pro and Ultra subscribers can also choose Gemini 3.8 Flash. Google has also described automatic routing of harder questions to stronger models.

### Is Google AI Mode the same as Gemini?

No. Gemini is Google's AI model family and also the name of its separate chat app. Google AI Mode is a mode inside Google Search that runs on Gemini models and grounds its answers in Google's search index. Notebooks sync between the two, but chats don't.

### What is Deep Search in Google AI Mode?

Deep Search is a research tool inside AI Mode. Google says it runs hundreds of searches and writes a fully cited report in minutes. It's available to Google AI Pro and Ultra subscribers and launched first in the US.

### Does Google AI Mode use my search history?

It can, if your settings allow it. With history and personalized recommendations turned on, you can reopen past AI Mode threads. If you're 18 or older and use Personal Intelligence, AI Mode can also draw on past searches and connected apps like Gmail. You can disconnect apps or delete history at any time.

### Can Google AI Mode be wrong?

Yes. Google says AI Mode "doesn't always get it right" and can misread web content or miss context. Check important facts in the linked sources, and use the thumbs-down button to report a bad answer.

## References

1. [Get AI-powered responses with AI Mode in Google Search, Google Search Help](https://support.google.com/websearch/answer/16011537?hl=en)
2. [Expanding AI Overviews and introducing AI Mode, Google](https://blog.google/products/search/ai-mode-search/)
3. [A new era for AI Search (Google I/O 2026), Google](https://blog.google/products-and-platforms/products/search/search-io-2026/)
4. [Google brings Gemini 3 to Search and AI Mode, Google](https://blog.google/products-and-platforms/products/search/gemini-3-search-ai-mode/)
5. [Introducing Gemini 3.8 Flash, Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/)
6. [Deep Search and AI calling in Google Search, Google](https://blog.google/products/search/deep-search-business-calling-google-search/)
7. [Have a real-time conversation with Live in Search, Google Search Help](https://support.google.com/websearch/answer/16329036?hl=en)
8. [Use AI Mode to check local availability and pricing, Google Search Help](https://support.google.com/websearch/answer/17104441?hl=en)
9. [Make purchases and manage orders directly from AI Mode, Google Search Help](https://support.google.com/websearch/answer/16833721?hl=en)
10. [New ways to explore the web in AI Mode and AI Overviews, Google](https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/)
11. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
12. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
13. [Gemini 3 in AI Overviews and follow-ups in AI Mode, Google](https://blog.google/products-and-platforms/products/search/ai-mode-ai-overviews-updates/)
14. [Are AI Mode and AI Overviews just different versions of the same answer?, Ahrefs](https://ahrefs.com/blog/ai-overviews-vs-ai-mode/)
15. [Google AI Mode product page, Google](https://search.google/ways-to-search/ai-mode/)
