---
title: How User Search Intent Evolves Within a Conversation With an AI Assistant
description: Search intent evolves turn by turn inside one AI chat. What conversation data shows about follow-ups, and how to write pages for each next question.
keyword: search intent evolves
date: 2026-11-05
updated: 2026-11-05
written: 2026-09-30
author: Rankbox Team
tags: AI Search, Content Strategy
---

Inside one conversation with an AI assistant, search intent evolves by refinement. The first message sets a goal, and most follow-ups narrow, deepen or test the last answer instead of starting over. In a [May 2026 study](https://arxiv.org/abs/2605.20087) of 2,155 conversations, 57% of the users' messages built on the previous request, and only 12.5% switched to something new.

Most chats are still short. Public chat logs from 2023 and 2024 average two to two and a half turns per conversation, and Microsoft said in 2023 that most Bing chat users found their answer within five turns. But the thread is getting longer. A [Microsoft Research analysis](https://arxiv.org/abs/2605.29018) of Copilot users found messages per conversation rose about 1.5 times over six months of 2024. Every extra turn is another point where your page is either in the answer or dropped from it.

This post zooms in on those turns: how search intent evolves from one message to the next, what the assistant does with a follow-up, and how to write pages that survive the second and third question. For the long view, from ranked links to written answers, read [The Death of 10 Blue Links](/blog/death-of-10-blue-links), our timeline of search from 1998 to 2026. For how intent changed over the years, see [how search intent is evolving with conversational AI assistants](/blog/how-search-intent-is-evolving-with-conversational-ai).

## Key Takeaways

- Search intent evolves mostly by extension. In the ThoughtTrace study, 57% of user messages built on the prior request, 25.2% opened a conversation and 12.5% were new requests.
- Opening turns carry the goal. Later turns carry constraints, expectations and checks. The study's authors call it a shift "from goal-setting to refinement."
- The average chat is short: 2.0 turns in LMSYS-Chat-1M and 2.54 in WildChat. Longer threads are growing, with Copilot's messages per conversation up about 1.5 times over six months of 2024.
- Follow-ups are often half-sentences, like "what about in Canada?" Assistants turn them into full searches that carry names and limits forward from earlier turns.
- A page wins a follow-up only when one passage states the product and the constraint together.
- Test pages with three- to five-turn scripts, not single prompts. Most losses happen after the first answer, as search intent evolves toward specifics.

## What Conversation Data Shows About Follow-Ups

No AI company publishes a full log of how its users move between turns. The best evidence comes from a vendor statement, two open datasets and two 2026 studies. Each measures something slightly different, so read them side by side.

| Source                                  | Date     | Sample                                                    | What it found about turns                                                             |
| --------------------------------------- | -------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Microsoft Bing                          | Feb 2023 | Bing chat preview users                                   | The "vast majority" found answers within 5 turns; about 1% of chats had 50+ messages. |
| LMSYS-Chat-1M                           | Sep 2023 | 1M conversations with 25 models, April to August 2023     | 2.0 turns per conversation on average.                                                |
| WildChat                                | May 2024 | About 1.04M ChatGPT conversations, April 2023 to May 2024 | 2.54 turns per conversation on average.                                               |
| Hicke and Tomlinson, Microsoft Research | May 2026 | About 12,000 Bing Copilot users over six months of 2024   | Messages per conversation rose about 1.5 times over the period.                       |
| ThoughtTrace                            | May 2026 | 1,058 recruited users, 2,155 conversations                | 57% of user messages extend the prior task; 12.5% are new requests.                   |

### Most conversations are short, but getting longer

When Microsoft capped Bing chat in February 2023, it explained the numbers behind the cap. Its [update post](https://blogs.bing.com/search/february-2023/The-new-Bing-Edge-Updates-to-Chat) said "the vast majority of you find the answers you're looking for within 5 turns and that only ~1% of chat conversations have 50+ messages."

Open datasets tell a similar story. [LMSYS-Chat-1M](https://arxiv.org/abs/2309.11998), a million conversations collected in 2023, averages 2.0 turns. [WildChat](https://arxiv.org/abs/2405.01470), about a million ChatGPT conversations from April 2023 to May 2024, averages 2.54. Averages hide how many chats are a single exchange. Counting both sides of the conversation, the ThoughtTrace authors found that one question and one reply made up over 60% of WildChat conversations and 67% of LMSYS-Chat-1M conversations. Treat WildChat with care, too: the Microsoft Research team found it is "significantly skewed towards highly proficient 'power' users."

The trend runs toward more turns. In the Copilot data from 2024, both messages per conversation and message complexity grew about 1.5 times. Google's and Semrush's reports on longer AI sessions are covered in our [history of search intent](/blog/how-search-intent-is-evolving-with-conversational-ai), so we won't repeat them here.

### Follow-ups mostly build on the last answer

The most direct evidence on how search intent evolves within a thread comes from ThoughtTrace, a 2026 dataset from researchers at Johns Hopkins, MIT and Google Research. Participants chatted with AI models about their own tasks and noted, turn by turn, why they sent each message. An AI model then labeled how each message related to the one before.

- **57.0%** of user messages extended, deepened or built on the prior request.
- **25.2%** were first requests that opened a conversation.
- **12.5%** were completely new requests.
- The rest, about 5%, were re-attempts or variations of the prior task.

The reasons people gave shifted as the chat went on. Task Motivation, the goal itself, drove opening turns. Later turns were driven by Task Continuation, Context Grounding (adding constraints) and expectations about content or style. In the authors' words, "user intent shifts from goal-setting to refinement as interactions progress." Even when people were unhappy with an answer, they mostly extended the task rather than abandoning or retrying it.

One caveat: participants were recruited through Prolific, and their conversations ran long, with a median of eight turns counting both sides, against two in the open datasets. The split between move types is the useful part. The length is not typical.

## How Search Intent Evolves: The Follow-Up Move Map

The data says follow-ups mostly refine. It doesn't say how search intent evolves from one turn to the next. The Follow-Up Move Map is Rankbox's model of the six moves a follow-up usually makes. It's a planning tool for content, not a label any assistant uses.

| Move       | What the person types                       | How the intent changes                    | What your page must state                                      |
| ---------- | ------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| 1. Narrow  | "Which of those suit a 10-person agency?"   | Same need, plus a constraint              | The constraint in plain words: team size, region, budget, plan |
| 2. Deepen  | "How do automatic late fees actually work?" | From choosing to understanding one option | How it works, step by step                                     |
| 3. Compare | "Is that better than Brindlework?"          | A choice between named options            | A fair comparison that names the rival                         |
| 4. Verify  | "Is that price still current?"              | A check on a claim from the last answer   | Dated facts and where they come from                           |
| 5. Pivot   | "What if we bill clients monthly instead?"  | A variation on the same task              | The alternative case, on the page or one link away             |
| 6. Act     | "How do I set that up?"                     | From deciding to doing                    | Setup steps and the next link                                  |

Moves 1, 2, 3 and 6 are what ThoughtTrace counts as extending the prior task. Move 4 often follows a doubtful answer, and move 5 matches the study's "new variation." The order isn't fixed, but a typical thread runs from exploring (deepen, narrow) to comparing (compare, verify) to deciding (act). That arc is the backbone of our [four conversational buyer stages](/blog/ai-search-intent-conversational-buyer-stages), which plans the pages each stage needs. The Move Map works one level down, at the single turn.

## What the Assistant Does With a Follow-Up

People type follow-ups as fragments: "what about in Canada?" or "is that on the cheaper plan?" Neither makes sense as a search on its own. So before it searches, the assistant has to rebuild the full question from the conversation.

Vendors describe this step in their own words:

- **Microsoft, 2023.** Bing's Prometheus system [generated "a set of internal queries"](https://blogs.bing.com/search-quality-insights/february-2023/Building-the-New-Bing) to answer the user's question "within the given conversation context."
- **OpenAI.** ChatGPT search [rewrites prompts](https://help.openai.com/en/articles/9237897-chatgpt-search) into one or more targeted queries before it sends them to search providers. Our post on [how AI search interprets user intent](/blog/how-does-ai-search-interpret-user-intent) walks through OpenAI's own example.
- **Microsoft, 2025.** Its agentic retrieval engine for developers sends ["chat history along with the original query"](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-agentic-retrieval-in-azure-ai-search/4414677) to a model that plans the searches.

Researchers treat this as a standard step. Apple's [QReCC dataset](https://arxiv.org/abs/2010.04898), 14,000 conversations with 80,000 question-answer pairs, splits conversational answering into question rewriting, passage retrieval and reading. A [2025 study](https://arxiv.org/abs/2503.16789) of real chat logs adds that rewrites get better in longer conversations, where there is more context, and that models "make plausible assumptions" about what users want.

Here is why this matters for your pages. The search that finds your page isn't the fragment the person typed. It's a rebuilt query carrying the product name, the constraint and sometimes a rival from earlier turns. Context from memory and location can join in too, as our guide to [how AI search uses user intent and context](/blog/how-ai-search-uses-user-intent-and-context) explains. As search intent evolves across the thread, the rebuilt queries get more specific, and fewer pages match them.

## Worked Example: Tallyfold's Carry-Forward Test

Tallyfold is a fictional invoicing and payments app for agencies. Brindlework is a fictional rival. The buyer, the turns and the rebuilt searches below are invented to show the method. None of it was captured from a real assistant.

A studio owner opens with: "What's a good invoicing tool for a small design agency?" The assistant names Tallyfold among others. Then come five follow-ups, and here is how search intent evolves for this one buyer. For each, we write the search an assistant might rebuild, and ask one question: does a single Tallyfold passage answer that search on its own?

| Turn | What the buyer types                  | Move    | Rebuilt search (illustrative)            | One passage answers it?                                               |
| ---- | ------------------------------------- | ------- | ---------------------------------------- | --------------------------------------------------------------------- |
| 2    | "Can it add late fees on its own?"    | Deepen  | Tallyfold automatic late fees            | Yes: the features page says "Tallyfold adds late fees automatically." |
| 3    | "What about for clients in Canada?"   | Narrow  | Tallyfold late fees Canadian clients CAD | No: the currency page never mentions late fees.                       |
| 4    | "Is that on the cheaper plan?"        | Verify  | Tallyfold late fees Starter plan         | No: the pricing table says "Automations," not late fees.              |
| 5    | "Would Brindlework do that for less?" | Compare | Brindlework vs Tallyfold late fees price | No: there is no comparison page.                                      |
| 6    | "OK, how do I turn it on?"            | Act     | set up late fees in Tallyfold            | Yes: a help article covers it.                                        |

Tallyfold answers 2 of 5 follow-ups, a 40% carry-forward rate. The first turn went well. The losses come in the middle of the thread, where search intent evolves from "what is this?" to "does it fit my case?"

The fixes are small and specific:

1. **Turn 3:** add one sentence to the currency page: "Tallyfold adds late fees to invoices in CAD, USD, GBP and EUR."
2. **Turn 4:** rename the pricing row from "Automations" to "Automatic reminders and late fees," and mark which plans include it.
3. **Turn 5:** publish a fair Tallyfold vs Brindlework page that covers late fees and price.

With those three changes, each of the five rebuilt searches has a passage that answers it: 5 of 5, or 100%, on paper. Whether assistants then use those passages is something to test, not assume.

## How to Write Pages for Every Turn

You can't write a page for every follow-up, and Google warns against trying. Its [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says that creating separate content for fan-out queries mainly to manipulate AI answers breaks its [scaled content abuse](/glossary/scaled-content-abuse) policy. The goal is fewer, stronger pages that hold up as search intent evolves.

1. **List the follow-ups for each key page.** Run the six moves against it. Our free [AI question generator](/tools/ai-question-generator) can suggest questions to start the list.
2. **Put the name and the constraint in one sentence.** "Tallyfold adds late fees on the Starter plan" survives a rebuilt search. "It also handles this" doesn't.
3. **Answer the next question on the same page.** Then link the one after it.
4. **Date the facts people check.** Prices, limits and plan contents are the classic verify turns.
5. **Name rivals fairly where buyers compare.** If you don't publish the comparison, the assistant builds it from someone else's page.
6. **Test with multi-turn scripts.** Write three to five turns per scenario, run them in clean sessions, and note the turn where your brand drops out. Our guide to [measuring GEO](/blog/how-to-measure-geo) covers how many runs you need before a change is real.

## Where Rankbox Fits

Rankbox's [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google in your category and scores each for volume, difficulty and intent. The volumes are model estimates, not measured counts. That list is a good start for mapping how search intent evolves in your category, step 1 above. Its Citation-Ready Writer then drafts 2,000 to 3,500-word, source-backed articles for the questions you choose, delivered through its API. Rankbox doesn't track AI citations or run your multi-turn tests. [See pricing](/pricing).

## Frequently Asked Questions

### How does search intent change during a conversation with an AI assistant?

Search intent evolves by narrowing. The first message states a goal, and later messages add constraints, compare options, check facts or ask for the next step. In the 2026 ThoughtTrace study, 57% of user messages built on the previous request, and 12.5% started something new.

### How many turns does a typical AI chat have?

Few. Open datasets from 2023 and 2024 average 2.0 turns (LMSYS-Chat-1M) and 2.54 turns (WildChat). Microsoft said in 2023 that most Bing chat users found answers within five turns. Conversations are getting longer: Copilot's messages per conversation rose about 1.5 times over six months of 2024.

### Do AI assistants use earlier questions when they search?

Yes. Microsoft described Bing generating internal queries "within the given conversation context," and OpenAI says ChatGPT search rewrites prompts into targeted queries. So a short follow-up like "what about Canada?" becomes a full search that includes the product and the constraint from earlier turns.

### Why does my brand drop out after the first answer?

Usually because your pages don't answer the rebuilt follow-up search. As search intent evolves toward a region, plan or rival, the assistant searches for all of it together. A page that names your product but never states that constraint has nothing to match, so another source wins the turn.

### Should I create a page for every follow-up question?

No. Google says making separate pages for fan-out queries mainly to sway AI answers breaks its scaled content abuse policy. Cover the common follow-ups on the strongest existing page, and add a new page only for a real need, such as a comparison buyers ask for.

### How do I test my content against follow-up questions?

Write short scripts of three to five turns that match how buyers talk, then run each one several times in clean sessions. Record the turn where your brand or your page stops appearing. That turn shows which constraint or comparison your site doesn't state yet.

## References

1. [ThoughtTrace: Understanding User Thoughts in Real-World LLM Interactions, Jin et al. (May 2026)](https://arxiv.org/abs/2605.20087)
2. [Adopt ≠ Adapt: Longitudinal Analyses of LLM Conversations in the Wild, Hicke and Tomlinson (May 2026)](https://arxiv.org/abs/2605.29018)
3. [LMSYS-Chat-1M: A Large-Scale Real-World LLM Conversation Dataset, Zheng et al. (September 2023)](https://arxiv.org/abs/2309.11998)
4. [WildChat: 1M ChatGPT Interaction Logs in the Wild, Zhao et al. (May 2024)](https://arxiv.org/abs/2405.01470)
5. [The new Bing and Edge: updates to chat, Microsoft Bing (February 2023)](https://blogs.bing.com/search/february-2023/The-new-Bing-Edge-Updates-to-Chat)
6. [Building the new Bing, Microsoft Bing (February 2023)](https://blogs.bing.com/search-quality-insights/february-2023/Building-the-New-Bing)
7. [ChatGPT search, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
8. [Introducing agentic retrieval in Azure AI Search, Microsoft (May 2025)](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-agentic-retrieval-in-azure-ai-search/4414677)
9. [Open-Domain Question Answering Goes Conversational via Question Rewriting, Anantha et al. (2020)](https://arxiv.org/abs/2010.04898)
10. [Conversational User-AI Intervention: A Study on Prompt Rewriting, Sarkar et al. (March 2025)](https://arxiv.org/abs/2503.16789)
11. [AI optimization guide, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
