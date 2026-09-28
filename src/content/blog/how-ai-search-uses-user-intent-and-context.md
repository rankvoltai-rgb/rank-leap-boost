---
title: How AI Search Uses User Intent and Context
description: How AI search uses user intent and context: what memory, location, chat history and connected apps change, per vendor, and how to write pages for it.
keyword: user intent
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Content Strategy
---

AI search uses user intent as the target and context as the lens. It works out what you need, then folds in what it knows about you (the conversation so far, saved memories, your rough location and, if you connect them, personal apps like Gmail) before it runs a search. So two people who type the same words can trigger different searches and see different sources.

For anyone writing pages, that changes the job. You aren't matching a keyword. You're matching user intent that arrives with constraints the person may not have typed this time, such as a diet, a budget or a city. Rankbox's [experiment on vector distance and keyword density](/blog/vector-distance-vs-keyword-density) found the passage-level version of this: on prompts that described a need without naming it, paragraphs full of defining facts beat paragraphs full of repeats.

This post covers the context signals the big vendors document, what they do to the search, and how to write for them. For how engines parse the question itself, from intent types to query rewriting, see our companion post on [how AI search interprets user intent](/blog/how-does-ai-search-interpret-user-intent).

## Key Takeaways

- Context changes the search, not just the answer. OpenAI says ChatGPT may use saved memories and an IP-based location when it rewrites your question into a search query.
- The vendors document four context signals: conversation history, memory, location and connected personal data.
- Google's Personal Intelligence lets AI Mode use Gmail and Google Photos. In May 2026 Google began expanding it to nearly 200 countries, with no subscription required.
- Your page competes with a rewritten query that may carry the asker's city, diet, budget or earlier questions.
- Write for user intent, not a keyword: say who a page is for, where, at what price and with what limits, and answer the next question on the same page.

## The Four Context Signals, Vendor by Vendor

Context doesn't replace user intent. It narrows it. As of September 2026, each major vendor documents some of these signals, and none documents all of them the same way.

| Signal | OpenAI (ChatGPT) | Google (Search, AI Mode) | Perplexity | Microsoft (Copilot) |
| --- | --- | --- | --- | --- |
| Conversation history | Reference chat history setting | Follow-ups keep your context | Remembers previous questions in a thread | Memories drawn from conversations |
| Memory and preferences | Saved memories can shape the search query | Past Search history is a relevance signal | Stored preferences such as dietary needs | Personalization and memory setting |
| Location | Approximate location from IP; device location opt-in | Location is a relevance signal | `user_location` in its search API | Not stated on the pages checked |
| Connected personal data | Connected apps such as Gmail, by plan and region | Gmail and Google Photos via Personal Intelligence | Not stated on the pages checked | Work files can inform the search query |

### Conversation history

Follow-up questions are read in light of earlier ones. Perplexity's [getting-started guide](https://www.perplexity.ai/hub/blog/getting-started-with-perplexity) (2024) says it "remembers your previous questions, so you can follow up naturally." At Google I/O 2026, Google said that when you ask a follow-up from an AI Overview and carry on in AI Mode, ["your context stays with you"](https://blog.google/products-and-platforms/products/search/search-io-2026/), and the links get more relevant as you go deeper.

ChatGPT can reach further back. With Reference chat history on, it can "use relevant information from past conversations to personalize future responses," according to OpenAI's [memory help page](https://help.openai.com/en/articles/8590148-memory-faq).

### Memory and saved preferences

Memory is where context most clearly enters the search itself. OpenAI's [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) gives the example: if you've told ChatGPT you're vegan and live in San Francisco, a request for nearby restaurants may become the search "good vegan restaurants San Francisco." Its memory FAQ confirms memory can personalize web searches, with "location or dietary preferences" as examples.

Perplexity's [memory announcement](https://www.perplexity.ai/hub/blog/introducing-ai-assistants-with-memory) (November 2025) says it stores "structured preferences, like favorite brands, dietary needs, or keywords you often ask about," and retrieves them from a memory store when it writes answers. Microsoft's [Copilot privacy controls](https://support.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-privacy-controls) describe a personalization and memory setting that remembers details from your conversations until you turn it off.

### Location

Location is the oldest context signal in search. Google's [How Search Works](https://www.google.com/search/howsearchworks/how-search-works/ranking-results/) page says it uses "your location, past Search history, and Search settings to determine what is most relevant for you." Its example: "football" in Chicago brings up the Chicago Bears, and in London the Premier League.

OpenAI says ChatGPT estimates a general location from your IP address and may pass it to search partners, so "restaurants near me" in San Francisco can become "top restaurants San Francisco." Sharing precise device location is optional and off by default. Perplexity's API lets developers pass a [user location](https://docs.perplexity.ai/docs/grounded-llm/filters/user-location-filter) to "personalize search by country, region, city, latitude, and longitude."

### Connected apps and personal data

The newest signal is your own data. Google launched [Personal Intelligence in AI Mode](https://blog.google/products-and-platforms/products/search/personal-intelligence-ai-mode-search/) on 22 January 2026, letting opted-in users connect Gmail and Google Photos. Google's example is an itinerary built from a hotel booking in Gmail and travel photos. It started with paid US subscribers. At I/O in May 2026, Google said it was expanding the feature to more people in nearly 200 countries and 98 languages, "no subscription required," with Google Calendar coming soon.

ChatGPT's memory can draw on connected apps such as Gmail, depending on plan and region. At work, Microsoft says Copilot's web query can be shaped by a document the user has open or names. In Microsoft's [example](https://learn.microsoft.com/en-us/microsoft-365/copilot/manage-public-web-access), a prompt about an internal clean-energy strategy becomes the Bing query "Fabrikam clean energy policy announcements."

## How Context Rewrites the Search Your Page Must Win

Put the signals together and the pattern is clear. The engine doesn't search for what the person typed. It searches for a short query that blends user intent with context. Microsoft describes its generated query as "a few words informed by the user's prompt," and OpenAI shows memory and location landing inside the query text.

That has three consequences for a page:

1. **The query can name things the user didn't type.** A city, a diet, a product they own, a problem they mentioned an hour ago.
2. **The same topic splits into many queries.** One person's "is it worth it?" becomes a search about cost, another's about noise, a third's about their region.
3. **Your page is judged against the whole user intent, not only the topic.** A page that never mentions the city, the budget or the limit has nothing to match.

You can't write a page for every person. Google warns against trying. Its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says that making separate content "for every possible variation of how people might search," including fan-out queries, mainly to manipulate results breaks its scaled content abuse policy. The answer is one strong page that covers the common constraints of the need.

## Write for the Need, Not the Keyword

Rankbox's September 2026 test backs this at the passage level. It scored paragraphs against eight intent prompts that state the user intent in plain words without the keyword, such as "How do I make sure the messages I send actually reach people's inboxes?" In a head-to-head between a definition-dense paragraph (four defining facts, one mention of the keyword) and a keyword-stuffed one, the definition-dense paragraph won 88–100% of intent prompts in every embedding model, and 100% for the reranker. Adding keyword repeats to that paragraph raised its score on 50–78% of all prompts in the embedding models, but on only 0–38% of intent prompts. These are similarity scores from open models, not rankings inside ChatGPT or Google, but they point the same way as the vendors.

Here's how to turn user intent and context into page copy:

1. **Say who the page is for, and who it isn't for.** Team size, home type, skill level, budget band.
2. **Name places plainly.** Cities, regions and service areas, because location often lands in the query.
3. **State the constraints as facts.** Prices, dimensions, compatibility, dietary details, dates, eligibility.
4. **Answer the next question on the same page.** Follow-ups carry context forward, so the second question often retrieves from the same site.
5. **Keep each passage self-contained.** A rewritten query may match one section, so it must make sense alone.
6. **Use the words people use for the need,** not only your category term. See our glossary entries on [search intent](/glossary/search-intent) and [query fan-out](/glossary/query-fan-out).

Our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search) covers the passage-level editing in detail.

## The Context Coverage Check: A Worked Example

Hearthwise is a made-up heat pump installer in Minneapolis. Its services page says: "Hearthwise installs heat pumps. Contact us for a quote." That line matches the topic and nothing else.

Now picture one asker. ChatGPT's memory holds that they own a 1920s house with radiators. Their IP places them in Minneapolis. Earlier in the chat they asked why their winter gas bill was so high. Then they type: "Is it worth switching?" The user intent is a decision: replace gas heating or not. A rewritten search could plausibly read "cold climate heat pump radiators old house Minneapolis cost" (illustrative, not captured from ChatGPT).

| Context signal | What it may add to the search | What the page must state | Hearthwise's new line |
| --- | --- | --- | --- |
| Memory: old house, radiators | "radiators", "old house" | Whether it works with existing radiators | "We fit air-to-water heat pumps that feed existing radiators in pre-1940 homes." |
| Location: Minneapolis | "Minneapolis", "cold climate" | Service area and cold-weather performance | "We serve Minneapolis and St. Paul, and fit cold-climate models rated to −13°F." |
| Earlier question: gas bills | "cost", "savings" | A price range and what drives it | "Most installs run $14,000 to $22,000 before rebates, depending on house size." |
| The typed words: "worth switching" | "worth it", "vs gas furnace" | A plain verdict with its conditions | "Switching pays off fastest when your furnace is near replacement." |

Hearthwise and its figures are invented for the example; they aren't real prices or ratings. The point is structure: every row gives the rewritten query something concrete to match. None of the lines repeats "heat pump" for its own sake.

Use the same check on any page:

- Who is it for, in one sentence?
- Which places does it serve, by name?
- What does it cost, or what drives the cost?
- What must the buyer already have, or not have?
- What's the verdict, and under what conditions?
- What would they ask next, and is it answered here?

## See Pages the Way a Stranger Would

Your own context skews what you see. If you test your pages in your usual ChatGPT account, your memories and location shape the search. OpenAI lets you start a temporary chat set to Unpersonalized, which skips saved memories and custom instructions. Perplexity says memory and search history are switched off in incognito mode.

For local pages, OpenAI's own tip is to "include your city, neighborhood, or postal code in your question." Test with the city typed in, then without it. To track this over time, our guide to [benchmarking AI search performance](/blog/how-to-benchmark-ai-search-performance) covers fixed conditions and panel sizes.

## Where Rankbox Helps

Rankbox's [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google and scores each for user intent, so you can see the needs and constraints behind a topic before you write. Its Citation-Ready Writer then drafts source-backed articles built from defining facts. Rankbox doesn't track AI citations today. [See pricing](/pricing).

## Frequently Asked Questions

### How does AI search use context?

AI search folds context into the query before it searches. OpenAI says ChatGPT may add saved memories and an IP-based location when it rewrites a question. Google uses location and past searches, and Perplexity keeps earlier questions in a thread, so the same words can lead to different searches.

### Does ChatGPT use memory to personalize search?

Yes, when memory is on. OpenAI's memory FAQ says ChatGPT may use relevant details, such as location or dietary preferences, to formulate a more useful search query. You can turn memory off, or start a temporary chat set to Unpersonalized.

### Does my location change AI search answers?

Often, yes. ChatGPT estimates a general location from your IP address and may share it with search partners. Google says it uses your location to judge relevance. Questions about nearby places, weather, laws or prices shift the most.

### Is user intent the same as context?

No. User intent is the goal behind the question, such as learning, comparing or buying. Context is what the engine knows around it: earlier messages, memories, location and connected data. Intent says what to find. Context narrows which answer fits this person.

### How do I write content for user intent in AI search?

Cover the need, not the keyword. Say who the page is for, name the places you serve, state prices and limits as facts, and answer the likely follow-up question on the same page. Keep each section able to stand alone, because a rewritten query may match only one of them.

### Can I see what context an AI engine used?

Partly. OpenAI says ChatGPT may show Sources below a response when personal context shaped it, and Copilot Chat shows the web queries it sent to Bing. Other engines show the cited pages but not the context that shaped the search.

## References

1. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
2. [Memory in ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/8590148-memory-faq)
3. [How Search determines ranking results, Google](https://www.google.com/search/howsearchworks/how-search-works/ranking-results/)
4. [Google brings Personal Intelligence to AI Mode in Search, Google](https://blog.google/products-and-platforms/products/search/personal-intelligence-ai-mode-search/)
5. [Google Search's I/O 2026 updates, Google](https://blog.google/products-and-platforms/products/search/search-io-2026/)
6. [AI optimization guide, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
7. [Introducing AI assistants with memory, Perplexity](https://www.perplexity.ai/hub/blog/introducing-ai-assistants-with-memory)
8. [Getting started with Perplexity, Perplexity](https://www.perplexity.ai/hub/blog/getting-started-with-perplexity)
9. [User location filter, Perplexity Docs](https://docs.perplexity.ai/docs/grounded-llm/filters/user-location-filter)
10. [Microsoft Copilot privacy controls, Microsoft Support](https://support.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-privacy-controls)
11. [Data, privacy, and security for web search in Microsoft Copilot, Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/manage-public-web-access)
