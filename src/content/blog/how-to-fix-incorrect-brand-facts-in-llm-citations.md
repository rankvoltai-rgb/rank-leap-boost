---
title: How to Fix Incorrect Brand Facts in LLM Citations: Report, Correct, Recheck
description: A quick path for one wrong fact in LLM citations: report it in each AI engine, get the cited page corrected with a template, then recheck on a set schedule.
keyword: LLM citations
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Playbooks
---

To fix an incorrect brand fact in LLM citations, report the answer through the engine's own feedback button, get the cited page corrected, then recheck the same question on a schedule until the right fact holds. The report tells the vendor. The correction changes what the engine reads next time. The recheck proves it worked.

This post is the quick path for one wrong fact, with a correction log and message templates you can copy. For the full recovery blueprint (tracing the seed source, building a canonical facts page with JSON-LD, and speeding up recrawls), read our [complete guide to fixing incorrect brand facts in AI answers](/blog/fix-incorrect-brand-facts-in-ai-answers).

A citation is good news, even when the sentence next to it is wrong. It tells you which page the engine read. That matters, because LLM citations are often shaky. When the Tow Center asked eight AI search tools to identify the source of 1,600 news excerpts, they [gave incorrect answers to more than 60% of them](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php). In a 2025 study by the EBU and BBC, sourcing problems caused [31% of significant issues](https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants), including answers that pinned a wrong claim on the outlet they cited.

## Key Takeaways

- Capture the evidence first: the prompt, a share link, the wrong sentence and every cited URL. You'll need it for every report and request.
- Open the LLM citations and check whether the cited page really says the wrong thing. If it does, fix the page. If it doesn't, the engine misread it.
- ChatGPT, Perplexity, Google, Gemini and Copilot all take feedback on answers. None of them promises to correct a specific answer or to reply.
- A short correction request with the wrong sentence, the right fact and a dated proof link is the fastest way to fix a page you don't own.
- Recheck at day 7, 14, 28 and 56 with three runs per engine. Call the fact fixed only when it's right in every run at two checks in a row.

## Before You Report: Capture the Answer and Its LLM Citations

Answers change on every run, so save the wrong one before you do anything else.

1. **Note the engine and mode.** Write down whether web search ran. In ChatGPT, answers that used search can show citations and a Sources button; an answer with neither probably came from memory.
2. **Copy the exact prompt** and the date and time you ran it.
3. **Save a share link and a screenshot** of the full answer, sources included.
4. **Quote the wrong sentence** word for word.
5. **List every cited URL** next to the sentence it supports.
6. **Write the correct fact** and the URL that proves it, ideally a dated page on your own site.

### Does the cited page say it?

Open each of the LLM citations and search the page for the wrong number or phrase. Each of the three possible results sends you down a different path.

| What you find | What it means | Where to spend effort |
| --- | --- | --- |
| The page states the wrong fact | The source is wrong or out of date | Get the page corrected, then recheck |
| The page doesn't say it | The engine misread or mixed up sources | Report the answer and state the fact more plainly on your own site |
| The answer cites nothing | It likely came from the model's training data | Report it, fix the web anyway, and wait for a new model |

OpenAI's own help page says ChatGPT's [search results and citations "can be incomplete, outdated, or incorrect"](https://help.openai.com/en/articles/9237897-chatgpt-search), and asks users to check that a source supports the answer. The EBU and BBC study counted claims the cited source didn't support among its sourcing problems, the largest category of error.

## Report It Through Each Engine's Feedback Channel

Every major engine lets you flag an answer, and your note can point at the LLM citations under it. Write the same three sentences each time: the wrong claim, the correct fact, and the link that proves it. Here's what each vendor says the channel does, as of September 2026.

### ChatGPT

Click the thumbs-down icon under the answer and describe the problem. OpenAI says the whole conversation behind a thumbs-up or thumbs-down [may be used to train its models](https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance), even if you've opted out of training. That's the whole promise: no reply, and no fix for one answer.

Formal reports are a separate path for content that may break OpenAI's policies or the law, through the thumbs-down menu's "Safety or Legal concern" option or a web form. OpenAI says reported domains may be [reviewed by its Model Quality team](https://help.openai.com/en/articles/10245791-reporting-content-in-chatgpt-and-openai-platforms), which "may apply filters" so ChatGPT relies less on unreliable sources. Save it for fraud, such as a scam number shown as your support line, not a stale price. For product cards in ChatGPT shopping results, OpenAI offers a menu option to [report products with incorrect information](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search), and notes that price changes may show up with a delay.

### Perplexity

Perplexity asks you to [use the flag icon below the answer](https://www.perplexity.ai/help-center/en/articles/10354902-how-can-i-report-incorrect-or-inaccurate-answers) or open a support ticket. It wants the link to the thread, a description of the error and the answer you expected. Misinformation and outdated information are both on its list of issues it looks for. The article doesn't say what happens after you report.

### Google AI Overviews and Gemini

Under an AI Overview, click the thumbs-down icon, then Report a problem, and pick a category. Google says the report [includes your query and its search results](https://support.google.com/websearch/answer/14901683) and helps it improve AI Overviews. In the Gemini app, click Bad response under the answer, choose a reason and add details. Google says that feedback [helps make Gemini "more helpful, accurate, and safe"](https://support.google.com/gemini/answer/13275746). Neither page promises a correction.

If the wrong fact sits in a Google knowledge panel, the path is different and stronger. A verified representative can suggest edits, and Google says it [reviews that feedback "within a few days"](https://support.google.com/knowledgepanel/answer/7534842) and emails a resolution. Not every panel can be claimed, and descriptions can't be edited at all; Google points you to the source they came from.

### Microsoft Copilot

Use the thumbs-down icon and explain what went wrong. Microsoft's transparency note says Copilot's feedback tools send reports that are [reviewed by Microsoft's operations teams](https://support.microsoft.com/en-us/topic/transparency-note-for-microsoft-copilot-c1541cad-8bb4-410a-954c-07225892dbc2). Because Copilot draws on Bing, a page fix plus a Bing recrawl does more than the report alone.

## Correct the Page Behind the Citation

The report is a note to the vendor. The page is what the engine reads. This is the step that actually moves LLM citations.

### If it's your page

Fix the sentence, add a visible "Updated" date, and add a short dated note where an old fact used to be: "Until June 2025, the free plan covered 3 users. It now covers 5." Then ask for a recrawl so the LLM citations that point to the page pick up the new text: Request indexing in Google Search Console, and an IndexNow ping or URL Submission for Bing. Our hub guide explains [which recrawl tool reaches which engine](/blog/fix-incorrect-brand-facts-in-ai-answers).

### If someone else owns it

Write to the page owner. Engines can't edit other people's sites; as Bing puts it, you [must contact the site owner](https://www.bing.com/webmasters/help/content-removal-cb6c294d) to correct content at the source. Keep it short and specific. Three templates follow.

**Template 1: a directory or review site**

> Subject: Correction request for [Brand] on [page title]
>
> Hi [Name or team], your page at [URL] says "[wrong sentence]". That was true until [date], but it's no longer correct. [Correct fact.] Our pricing page, updated [date], confirms it: [proof URL]. Could you update the listing? Thanks, [Name, role, Brand]

**Template 2: a journalist or blog author**

> Subject: Small factual fix in your [month year] article on [topic]
>
> Hi [Name], thanks for covering [Brand] in "[article title]". One detail is out of date: the article says "[wrong sentence]". [Correct fact], as shown here: [proof URL]. If you're able to add a correction or an update note, we'd be grateful. [Name, role, Brand]

**Template 3: a Wikipedia talk page**

> {{edit COI}}
> I work for [Brand] and have a conflict of interest. The article says "[wrong sentence]" in the [section] section. Please change it to "[correct sentence]". Source: [independent source, or the company's own dated page for an uncontroversial fact]. Thank you. ~~~~

Wikipedia's [conflict-of-interest guideline](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) strongly discourages editing your own company's article directly and points you to the `{{edit COI}}` request instead. On Wikidata, the community's [self-promotion essay](https://www.wikidata.org/wiki/Wikidata:Self-promotion) says you may correct clear factual errors on an existing item but shouldn't remove sourced claims; use the item's talk page for anything more.

### When the owner fixes it but the old version lingers

If a site updated its page but ["Bing and Copilot still show the old version,"](https://www.bing.com/webmasters/help/content-removal-cb6c294d) anyone can ask for a refresh with Bing's Content Removal Tool. Google's [Refresh Outdated Content tool](https://support.google.com/webmasters/answer/7041154) does the same for pages you don't own, but only after content was removed or changed significantly.

## Recheck on a Schedule

A fix isn't done until the answers and their LLM citations change. Rerun the exact prompt you captured, three times in each engine where the error appeared, on this schedule.

| When | What to do | What you're looking for |
| --- | --- | --- |
| Day 0 | Capture, report, send correction requests | A full log entry |
| Day 3 | Check the corrected page is live; ask for recrawls | The page shows the right fact |
| Day 7 | Three runs per engine | Is the new page cited yet? |
| Day 14 | Three runs per engine; chase unanswered emails | Fewer runs with the wrong fact |
| Day 28 | Three runs per engine | Right fact in every run |
| Day 56 | Three runs per engine | Still right in every run: close the entry |

Call the fact fixed only when it's right in every run at two checks in a row. One clean run is luck. For the metric behind this, Accuracy Rate, see our [GEO metrics framework](/blog/geo-metrics-framework); for why single checks mislead, see [the technical reality of tracking AI answers](/blog/is-it-possible-to-track-brand-mentions-in-ai-answers).

### The One-Fact Correction Log

Keep one log entry per wrong fact; it's the record you'll want if the error comes back. Here it is filled in for Plannora, a made-up project management tool at plannora.io; the review site stackreview.co is made up too.

| Field | Plannora example |
| --- | --- |
| Wrong claim | "Plannora's free plan is limited to 3 users." |
| Correct fact and proof | Free plan covers up to 5 users since June 2025; plannora.io/pricing, updated 1 September 2026 |
| First seen | 2 September 2026, Perplexity, prompt "Does Plannora have a free plan?" |
| Cited URL | stackreview.co review of Plannora, last updated 2024 |
| Does the source say it? | Yes, word for word |
| Feedback sent | 2 September: Perplexity flag; ChatGPT thumbs-down on the same claim |
| Correction request | 2 September: Template 1 to stackreview.co; fixed on 9 September |
| Recrawl | 9 September: Bing Content Removal Tool refresh for the review URL; nothing to submit to Perplexity |
| Day 7 check | Wrong in 2 of 3 Perplexity runs and 1 of 3 ChatGPT runs |
| Day 14 check | Wrong in 1 of 3 Perplexity runs, 0 of 3 ChatGPT runs |
| Day 28 check | 0 of 6 runs wrong; the updated review is cited |
| Day 56 check | 0 of 6 runs wrong; entry closed |

Two columns do most of the work. "Does the source say it?" tells you whether to chase the page or the engine, and the dated checks show whether the fix stuck.

### If the wrong fact won't budge

If an answer still states the old fact at day 56 and cites nothing, it's probably coming from the model's training data. A page fix can't reach that until the vendor releases a new model, so keep your sources correct and recheck after each major model update. If the LLM citations still point to a page that's now correct, the engine may not have recrawled it yet; request a recrawl again and check the page is reachable by the engine's crawler. Our guide on [how to track brand mentions in AI search](/blog/how-to-track-brand-mentions-in-ai-search) shows how to fold these checks into a regular routine.

## Where Rankbox Fits

Rankbox doesn't track LLM citations or monitor what AI says about your brand, so the capture, the reports and the rechecks in this guide are manual. The free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) helps you write the prompts. Rankbox helps with the pages that fix the problem: its [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles, such as a pricing explainer or a company facts page, that reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial; see [pricing](/pricing).

## Frequently Asked Questions

### How do I report wrong LLM citations in ChatGPT?

Click the thumbs-down icon under the answer and explain the error: the wrong claim, the correct fact and a link that proves it. OpenAI may use that conversation to improve its models. For fraud or legal problems, use the Safety or Legal concern option instead. Neither promises to change the answer, so fix the cited page as well.

### Does reporting an AI answer fix it?

Not directly. ChatGPT, Perplexity, Google and Copilot all accept feedback, but none promises to correct a specific answer or reply to you. The fix that changes LLM citations quickly is correcting the page the engine cites.

### Why do LLM citations link to pages that don't say what the answer says?

The model writes the answer after reading several pages, and it can blend, misread or misattribute them. Studies of AI search found this often: sourcing caused 31% of significant issues in the 2025 EBU and BBC study. Always open the citation and check the exact sentence.

### How long do LLM citations take to update after a fix?

Usually days to a few weeks after the cited page changes, because search indexes must recrawl it; Google says crawling can take a few days to a few weeks. Recheck at 7, 14, 28 and 56 days. Run each prompt three times per engine, because a single run can mislead.

### What should a correction request to a website include?

Include the page URL, the wrong sentence quoted exactly, the correct fact, and a dated proof link, such as your pricing or facts page. Say who you are and your role. Keep it under 100 words and ask for one change, which makes it easy for an editor to say yes.

### Can I edit Wikipedia to fix a wrong fact about my company?

Not directly, if you work for the company. Post an edit request on the article's talk page with the edit COI template, disclose your connection and cite a source. Volunteer editors review it; the guideline says a verifiable, appropriate request will usually be accepted, though editors may decline.

## References

1. [AI search has a citation problem, Tow Center for Digital Journalism (Columbia Journalism Review)](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php)
2. [News Integrity in AI Assistants, EBU and BBC, October 2025](https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants)
3. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
4. [How your data is used to improve model performance, OpenAI Help Center](https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance)
5. [Reporting content in ChatGPT and OpenAI platforms, OpenAI Help Center](https://help.openai.com/en/articles/10245791-reporting-content-in-chatgpt-and-openai-platforms)
6. [Shopping with ChatGPT search, OpenAI Help Center](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search)
7. [How can I report incorrect or inaccurate answers?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10354902-how-can-i-report-incorrect-or-inaccurate-answers)
8. [AI Overviews in Google Search, Google Search Help](https://support.google.com/websearch/answer/14901683)
9. [Send feedback or report a problem with Gemini Apps, Gemini Apps Help](https://support.google.com/gemini/answer/13275746)
10. [Update your Google knowledge panel, Google Search Help](https://support.google.com/knowledgepanel/answer/7534842)
11. [Transparency Note for Microsoft Copilot, Microsoft Support](https://support.microsoft.com/en-us/topic/transparency-note-for-microsoft-copilot-c1541cad-8bb4-410a-954c-07225892dbc2)
12. [How to remove content from Bing and Copilot, Bing Webmaster Tools](https://www.bing.com/webmasters/help/content-removal-cb6c294d)
13. [Refresh Outdated Content tool, Search Console Help](https://support.google.com/webmasters/answer/7041154)
14. [Wikipedia:Conflict of interest, Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest)
15. [Wikidata:Self-promotion, Wikidata](https://www.wikidata.org/wiki/Wikidata:Self-promotion)
