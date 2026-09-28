---
title: How to Fix Incorrect Brand Facts in AI Answers & LLM Citations
description: Fix incorrect brand facts in AI answers: trace the seed source, publish a facts page with valid JSON-LD, get it recrawled and prove it with Accuracy Rate.
keyword: incorrect brand facts
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Playbooks
---

To fix incorrect brand facts in AI answers, find the page the engine is reading, correct or outweigh it, and publish one dated facts page with matching JSON-LD. Then get the changed pages recrawled and rerun the same questions until your Accuracy Rate holds. Report the error in each engine's feedback tool too, but treat that as a backup, not the fix.

This works because incorrect brand facts often reach AI answers through pages fetched at the moment someone asks. ChatGPT search, Perplexity, Google's AI Overviews and Microsoft Copilot all read the live web and cite what they read. Fix the page and those answers can change within days to weeks. What you can't do is overwrite what a model learned in training. Those weights only change when the vendor trains a new model, so an answer written from memory may keep the old fact until then.

Incorrect brand facts are common, and they cost money. When journalists from 22 public broadcasters checked more than 3,000 AI answers to news questions in 2025, [45% had at least one significant issue](https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants), and sourcing was the biggest cause. Soundslice's co-founder [built a whole feature in 2025](https://www.holovaty.com/writing/chatgpt-fake-feature/) because ChatGPT kept telling users it already existed. A Minnesota solar firm, Wolf River Electric, [sued Google](https://reason.com/volokh/2025/06/11/large-libel-models-small-business-sues-google-claiming-ai-overview-in-searches-hallucinated-attorney-general-lawsuit/) after an AI Overview allegedly said the state attorney general had sued it. Per the complaint, none of the cited sources said so.

Some tools now flag these errors. Profound launched [FactCheck](https://www.tryprofound.com/blog/introducing-factcheck) in July 2026 to compare AI claims with a brand's verified facts and trace them to the sites repeating them, and Semrush's AI Visibility Toolkit has a [Perception report](https://www.semrush.com/kb/1595-brand-performance-reports) on how engines describe a brand. A flag still leaves the repair of incorrect brand facts to you. This guide is the repair: a five-step recovery blueprint with a worked example. If you only need the quick path for one wrong fact, read our guide on [how to fix incorrect brand facts in LLM citations](/blog/how-to-fix-incorrect-brand-facts-in-llm-citations).

## Key Takeaways

- When an answer cites sources, you can follow incorrect brand facts back to a page. Trace each one to its seed source: the first page that stated it, which others then copied.
- Publishing and recrawling change what search-grounded answers can find within days to weeks. They don't change a model's trained weights; only a new model release does.
- A canonical facts page should state each fact once, in plain HTML, with a date, and carry Organization, Product, Offer and FAQPage JSON-LD that matches the visible text.
- Google says AI features need no special schema, and FAQ rich results stopped appearing on 7 May 2026. Markup helps machines parse your facts; it doesn't force an answer to change.
- On Wikipedia, request changes on the talk page and disclose your connection. On Wikidata, you may fix clear errors on an existing item, but you shouldn't create one about yourself.
- Feedback buttons in ChatGPT, Perplexity, Google and Copilot send your report to the vendor. None of them promises to remove incorrect brand facts from a specific answer.
- Prove the fix with Accuracy Rate over repeated runs. In the worked example, 108 answers per round detect a change of about 11 points.

## Two Layers: Where Incorrect Brand Facts Live

Incorrect brand facts reach an answer from one of two places, and only one of them responds to a fix this month.

### Retrieval: the answer reads a page today

A search-grounded answer runs a web search, reads a handful of pages and writes from them. Google calls this [grounding](/glossary/grounding): its Gemini API docs say grounding with Google Search [connects the model to "real-time web content"](https://ai.google.dev/gemini-api/docs/google-search) and lets it cite its sources. A wrong page makes a wrong answer, and a fixed, recrawled page can change it.

### Weights: the answer repeats what the model learned

An answer written without a search comes from the model's training data, which stops at a [knowledge cutoff](/glossary/knowledge-cutoff). No citation appears, because nothing was fetched. You can't reach those weights with a new page or a feedback click. What you can do is make sure the pages that future training crawls will read are correct. OpenAI, for example, says [GPTBot collects content](https://developers.openai.com/api/docs/bots) that "may be used in training" its models, so a facts page GPTBot can reach may inform a later model. Whether to allow it is your call. If the old facts come from a product pivot, our guide to [semantic drift](/blog/semantic-drift-ai-memory-reset) covers the full deprecation campaign.

### How each engine uses the web

| Engine | When it reads the web | Where you see its sources | What a page fix can change |
| --- | --- | --- | --- |
| ChatGPT | Searches when a question needs current information, or when you pick Search | The Sources button and inline citations | Search answers, after OAI-SearchBot or a partner picks up the change |
| Perplexity | Every answer | Numbered citations on every answer | Answers soon after a recrawl or a live fetch |
| Google AI Overviews and AI Mode | When Google shows the feature, using its own index | Supporting links in the overview | Answers after Googlebot recrawls the page |
| Microsoft Copilot | For information-seeking questions, via Bing | Hyperlinked citations below the text | Answers after Bing recrawls the page |
| Any model answering from memory | Never | None | Nothing until the next model release |

ChatGPT [searches the web automatically](https://help.openai.com/en/articles/9237897-chatgpt-search) "when your question would benefit from current information" and sometimes uses partner search providers, including Microsoft. Perplexity says [every answer links to numbered citations](https://www.perplexity.ai/hub/getting-started). Google requires a supporting page to be [indexed and eligible for a snippet](https://developers.google.com/search/docs/appearance/ai-features). Copilot is [grounded in web search results](https://support.microsoft.com/en-us/topic/transparency-note-for-microsoft-copilot-c1541cad-8bb4-410a-954c-07225892dbc2) for information-seeking conversations.

## Step 1: Trace the Seed Source of Incorrect Brand Facts

A seed source is the first page that stated the wrong fact. Other pages copy it, engines cite the copies, and the error spreads. Fix the seed and the most-cited copies, and you fix the pattern.

### Make the error repeat before you chase it

One bad answer may be noise. Ask the same question three times in each engine with web search on, and save a share link or screenshot of each answer. If the wrong claim shows up in at least two of three runs, it's a pattern worth tracing. Our explainer on [why AI answers vary between runs](/blog/is-it-possible-to-track-brand-mentions-in-ai-answers) covers the statistics.

Then open every citation and search it for the wrong number or phrase. Note the URL, the sentence and the page's date. ChatGPT's own help page warns that [citations "can be incomplete, outdated, or incorrect"](https://help.openai.com/en/articles/9237897-chatgpt-search), so don't assume the cited page actually says what the answer says.

### Sort incorrect brand facts by cause

| Cause | How you spot it | What fixes it |
| --- | --- | --- |
| Stale owned page | Your old blog post, press release or help page states the old fact | Update it, add a dated note, or redirect it |
| Stale or wrong third-party page | A directory, review site or article states it | Update the profile you control, or ask the owner |
| Misread source | The cited page is right, but the answer isn't | Report it to the engine; add a clearer statement on your own page |
| Entity mix-up | Facts belong to another company with a similar name | Add a disambiguation line and `sameAs` links on your facts page |
| No source | The answer cites nothing | Model memory or a gap; publish the missing fact and wait for retraining |

The misread case is real. In the EBU and BBC study, broadcasters flagged [responses that attributed an incorrect claim to them](https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants), and sourcing caused 31% of significant issues. That's also the core allegation in the Wolf River case: the sources existed, but they didn't support the sentence.

### Follow the copies back to the original

Search a distinctive phrase from the wrong claim, in quotes, and sort the results by date. The earliest version is your seed. Common seeds are a syndicated press release, a directory profile that other directories scraped, and a launch-week article that later reviews quoted.

## Step 2: Publish a Canonical Facts Page

A canonical facts page gives every engine one dated place that states each fact plainly. It's also the URL you'll cite in every request to fix incorrect brand facts elsewhere.

### What goes on the page

- Legal name, brand name and any former names, with the year each changed
- Founding date and place, and the founders' names
- What the product does and who it's for, in one sentence
- Every plan and price, with currency, billing unit and an "as of" date
- What the product doesn't do, when AI answers keep claiming it does
- Retired products and old prices, each with the date it ended
- Headquarters, markets served and a contact point
- Links to your official profiles

The price and retired-product lines matter most, because stale sources don't go away. Your page should explain them: "Business was $24 until 1 March 2026; it's now $18." That gives a retrieval system a newer, dated sentence that addresses the old claim directly. If you hide prices entirely, read why [a missing pricing page invites guesses](/blog/hallucination-by-omission-pricing-page).

### Write it for retrieval, not for design

Put the facts in plain HTML, not a script-loaded widget or an image. Give each fact its own sentence, and use question-shaped headings such as "How much does Plannora cost?" so a passage matches the question a buyer asks. Show a "last reviewed" date near the top. Link the page from your footer, pricing page and about page so crawlers find it. Our free [AI search readiness check](/tools/ai-search-readiness-check) flags pages whose content only appears after JavaScript runs.

### Add JSON-LD that matches the page

[Structured data](/glossary/schema-markup) gives machines a clean copy of the same facts. Keep it honest about what it does. Google says there's [no special schema.org markup](https://developers.google.com/search/docs/appearance/ai-features) you need for AI Overviews or AI Mode, and asks that structured data match the visible text. Google's [Organization guide](https://developers.google.com/search/docs/appearance/structured-data/organization), updated on 8 September 2026, recommends properties such as `legalName`, `foundingDate`, `address` and `sameAs`, and says some are used to tell your organization apart from others.

Here is a complete example for Plannora, a made-up project management tool. It uses one `@graph` with four main types: Organization for the company, Product for what it sells, Offer for each plan, and FAQPage for the page itself.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://plannora.io/#organization",
      "name": "Plannora",
      "legalName": "Plannora Software Inc.",
      "url": "https://plannora.io/",
      "logo": "https://plannora.io/logo.png",
      "description": "Project management software for teams of 5 to 200 people.",
      "foundingDate": "2021-04-12",
      "founder": { "@type": "Person", "name": "Ines Carter" },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Toronto",
        "addressRegion": "ON",
        "addressCountry": "CA"
      },
      "sameAs": [
        "https://www.linkedin.com/company/plannora-example",
        "https://github.com/plannora-example"
      ]
    },
    {
      "@type": "Product",
      "@id": "https://plannora.io/#product",
      "name": "Plannora",
      "description": "Task boards, timelines and workload views. No built-in time tracking.",
      "brand": { "@id": "https://plannora.io/#organization" },
      "offers": [
        {
          "@type": "Offer",
          "name": "Free",
          "price": 0,
          "priceCurrency": "USD",
          "description": "Up to 5 users.",
          "url": "https://plannora.io/pricing"
        },
        {
          "@type": "Offer",
          "name": "Team",
          "price": 10,
          "priceCurrency": "USD",
          "validFrom": "2026-03-01",
          "url": "https://plannora.io/pricing",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": 10,
            "priceCurrency": "USD",
            "unitText": "per user per month",
            "billingDuration": "P1M"
          }
        },
        {
          "@type": "Offer",
          "name": "Business",
          "price": 18,
          "priceCurrency": "USD",
          "validFrom": "2026-03-01",
          "url": "https://plannora.io/pricing",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": 18,
            "priceCurrency": "USD",
            "unitText": "per user per month",
            "billingDuration": "P1M"
          }
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://plannora.io/facts#page",
      "url": "https://plannora.io/facts",
      "name": "Plannora company facts",
      "about": { "@id": "https://plannora.io/#organization" },
      "dateModified": "2026-09-28",
      "lastReviewed": "2026-09-28",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "When was Plannora founded?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Plannora was founded in Toronto in April 2021. Its founders ran a consultancy from 2019, but Plannora the company dates from 2021."
          }
        },
        {
          "@type": "Question",
          "name": "How much does Plannora cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "As of 28 September 2026: Free for up to 5 users, Team at $10 per user per month and Business at $18 per user per month, in USD. Prices last changed on 1 March 2026."
          }
        },
        {
          "@type": "Question",
          "name": "Does Plannora include time tracking?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Plannora has no built-in time tracking. Teams that need it connect a time-tracking app through Plannora's integrations."
          }
        }
      ]
    }
  ]
}
```

A few notes on the choices. The `@id` values let each node point to the others, so the Product's `brand` is the same entity as the Organization. `validFrom` dates each price, and `lastReviewed` is schema.org's field for the date a page was [last reviewed for accuracy](https://schema.org/lastReviewed). The `sameAs` links here are placeholders; schema.org defines `sameAs` as a URL that ["unambiguously indicates the item's identity"](https://schema.org/sameAs), so use your real profiles. For a software product you can add `SoftwareApplication` as a second type, and our guide to [building a knowledge graph for AI](/blog/knowledge-graph-for-ai) extends this into a full entity graph.

FAQPage deserves a caveat. Google [stopped showing FAQ rich results on 7 May 2026](https://developers.google.com/search/updates), so this markup won't earn a special listing in Google. It's still valid schema.org, and it mirrors the page's visible questions for any system that parses it. Only mark up questions that actually appear on the page.

### Validate before you ship

Every type and property in the example above is defined in the current schema.org vocabulary. To check your own version, the [Schema Markup Validator](https://validator.schema.org/) checks any schema.org markup without Google-specific warnings, and Google's [Rich Results Test](https://search.google.com/test/rich-results) shows which Google features the markup can generate. Google describes the difference on its [structured data overview](https://developers.google.com/search/docs/appearance/structured-data). Our free [schema generator](/tools/schema-generator) builds a starting Organization block from a form.

## Step 3: Correct the Pages You Don't Own

Engines cite third-party pages for brand facts all the time, and many incorrect brand facts start there. Each kind of site has its own rules, and following them is what gets a change to stick.

### Profiles and listings you control

Update every profile you can log in to, from directories and app stores to review-site vendor profiles and LinkedIn. Copy the wording from your facts page. Consistency across listings is its own project for local businesses, covered in [how to optimize your business for AI search](/blog/optimize-business-for-ai-search).

### Review sites, directories and publishers

For pages you can't edit, write to the owner. Name the page, quote the wrong sentence, give the right fact and link to your dated facts page as proof. Bing puts the principle plainly: search engines ["cannot delete content directly from any website"](https://www.bing.com/webmasters/help/content-removal-cb6c294d), so you ask the site owner to correct it at the source. Our [LLM citations correction guide](/blog/how-to-fix-incorrect-brand-facts-in-llm-citations) has copy-ready message templates.

### Wikipedia: request, don't edit

Wikipedia's [conflict-of-interest guideline](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) says editors with a conflict are "strongly discouraged" from editing affected articles directly. Instead, post your request on the article's talk page under the `{{edit COI}}` template, disclose who you work for, and cite a source. Anyone paid to edit must also disclose the employer and client, a Wikimedia Foundation requirement.

Your own facts page can help here. Wikipedia's [verifiability policy](https://en.wikipedia.org/wiki/Wikipedia:Verifiability) lets a self-published source support facts about its publisher, as long as the claim isn't unduly self-serving and the article isn't based mainly on such sources. A founding date or a current price usually qualifies. A claim that you're the market leader doesn't.

### Wikidata: correct clear errors, don't promote

Wikidata has no formal conflict-of-interest policy; a 2015 proposal closed with no consensus. Its community essay on [self-promotion](https://www.wikidata.org/wiki/Wikidata:Self-promotion) sets the norms. Creating an item about your own company is "strongly discouraged." If an item already exists, you "may correct clear factual errors," but you shouldn't remove sourced claims, and you can ask for changes on the item's talk page with `{{edit request}}`. Paid editors must [disclose who pays them](https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing). The same essay adds that Wikidata doesn't control Google's knowledge panels, so an edit there is not a shortcut.

### Google's knowledge panel

If Google shows a [knowledge panel](/glossary/knowledge-graph) for your company, you may be able to [claim it](https://support.google.com/knowledgepanel/answer/7534902) with an official profile such as your Search Console or YouTube account. Not every panel is claimable. Once verified, you can suggest edits fact by fact, and Google says it [reviews verified feedback "within a few days"](https://support.google.com/knowledgepanel/answer/7534842) and emails you the result. Descriptions can't be edited at all: Google says to contact the source they came from.

### Pages you can't change

You can't edit a rival's comparison page or an old news story, but you can publish a better page for the same question: a fair, dated comparison that states the fact clearly. Our guide to [brand presence in Perplexity](/blog/brand-presence-in-perplexity) shows how to outweigh sources you can't touch, and [defensive GEO](/blog/defensive-geo) covers complaints rather than wrong facts.

## Step 4: Get the Fixed Pages Recrawled

A fixed page does nothing until engines read it again. Recrawling is how a corrected page replaces incorrect brand facts in search-grounded answers. Each index has its own tools, and none guarantees timing.

| Tool | Reaches | What it does | What it doesn't promise |
| --- | --- | --- | --- |
| URL Inspection, Request indexing | Google, so AI Overviews and AI Mode | Queues one URL for a recrawl | Google says crawling [can take "a few days to a few weeks"](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), with a daily quota |
| XML sitemap with accurate `lastmod` | Google and Bing | Flags many changed URLs at once | A crawl on any date |
| Refresh Outdated Content | Google results for pages you don't own | Updates a result after the owner removed content | Anything while the wrong text is still live |
| IndexNow | Bing and six other participants | Tells engines a URL changed, right away | Crawling or indexing; Google isn't a participant |
| Bing Content Removal Tool | Bing and Copilot | Requests a refresh when a page changed but results show the old version | A timeline |
| Keeping OAI-SearchBot and PerplexityBot allowed | ChatGPT search and Perplexity | Lets their crawlers reach the new page | Neither vendor documents a URL submission tool |

Three details matter. Google's [Refresh Outdated Content tool](https://support.google.com/webmasters/answer/7041154) is for pages that were deleted or changed significantly; it won't act while the wrong information is still on the live page. [IndexNow's participant list](https://www.indexnow.org/searchengines.json) as of September 2026 is Bing, Yandex, Seznam, Naver, Yep, the Internet Archive and Amazonbot. And Bing's guide says that if a site updated a page but ["Bing and Copilot still show the old version,"](https://www.bing.com/webmasters/help/content-removal-cb6c294d) anyone can use the Content Removal Tool to request a refresh.

For ChatGPT, keep OAI-SearchBot allowed; OpenAI says opted-out sites [aren't shown in ChatGPT search answers](https://developers.openai.com/api/docs/bots). Some ChatGPT searches also go through Microsoft, so a fast Bing recrawl may help there too. Perplexity says its Perplexity-User agent [may visit a page live](https://docs.perplexity.ai/guides/bots) when a question needs it, so a fixed page can show up quickly. Our [Bing Webmaster Tools guide](/blog/bing-webmaster-tools-ai-indexing-guide) and the [IndexNow glossary entry](/glossary/indexnow) cover setup.

## Step 5: Report Incorrect Brand Facts, Then Prove the Fix

### What the feedback buttons promise

Report incorrect brand facts as you go, but know what each channel says it does.

| Engine | Channel | What the vendor says it does |
| --- | --- | --- |
| ChatGPT | Thumbs down; a formal report for policy or legal issues | Feedback conversations [may be used to train models](https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance); reported domains may be [reviewed by a Model Quality team](https://help.openai.com/en/articles/10245791-reporting-content-in-chatgpt-and-openai-platforms) that can apply filters |
| Perplexity | Flag icon, or a support ticket | Takes reports of misinformation and outdated information, per its [help article](https://www.perplexity.ai/help-center/en/articles/10354902-how-can-i-report-incorrect-or-inaccurate-answers) |
| Google AI Overviews | Thumbs down, then Report a problem | Sends your query and results; feedback [helps improve AI Overviews](https://support.google.com/websearch/answer/14901683) |
| Gemini | Bad response, with a reason | Helps make Gemini ["more helpful, accurate, and safe"](https://support.google.com/gemini/answer/13275746) |
| Copilot | Thumbs down, with details | Feedback is [reviewed by Microsoft's operations teams](https://support.microsoft.com/en-us/topic/transparency-note-for-microsoft-copilot-c1541cad-8bb4-410a-954c-07225892dbc2) |

None of these promises to fix a specific answer, or to reply, so the report backs up the page work rather than replacing it.

### Measure Accuracy Rate over repeated runs

The metric for this job is Accuracy Rate, defined in our [GEO metrics framework](/blog/geo-metrics-framework): answers that name your brand with no factual error, divided by all answers that name your brand. Check each answer against the facts page, claim by claim. One or more incorrect brand facts makes the whole answer count as an error.

Run a fixed set of fact prompts ("How much does [brand] cost?", "When was [brand] founded?", "Does [brand] do X?") three times per engine. Take a baseline before you fix anything, then rerun at two, four and six weeks. Record whether each answer ran a web search, because errors in no-search answers point to the weights layer. For the ongoing version, see [how to track brand mentions in AI search](/blog/how-to-track-brand-mentions-in-ai-search), and for sample sizes, our [guide to measuring GEO](/blog/how-to-measure-geo).

## The Seed-Source Ledger: A Worked Plannora Recovery

The Seed-Source Ledger is one table that turns a pile of incorrect brand facts into an ordered fix list. Each row is one wrong claim. The columns record where it came from, how much harm it does and how you'll get it fixed. The example below is fictional: Plannora and its rival loopcraft.ai are made up, and every number is illustrative.

### The baseline

Plannora ran 12 fact prompts three times each in ChatGPT, Perplexity and Google AI Mode: 108 answers, 102 of which named it. Thirty-three of those carried at least one wrong claim, so 69 were error-free.

Accuracy Rate = 69 ÷ 102 = 67.6%.

### The ledger

Harm weight scores the damage: 3 for money or legal claims, 2 for capabilities, 1 for background facts. Priority = answers affected × harm weight.

| Wrong claim | Truth | Seed source | Cause | Answers | Harm | Priority | Fix and recrawl |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Business costs $24 per user | $18 since 1 March 2026 | A 2025 "best project management tools" listicle, copied by two directories | Stale third-party page | 12 | 3 | 36 | Email the listicle's editor and both directories with the facts page; IndexNow and Request indexing for the pricing page |
| Plannora has built-in time tracking | It doesn't | loopcraft.ai comparison says the opposite | Misread source | 9 | 2 | 18 | "What Plannora doesn't do" section; report in each engine |
| Founded in 2019 | April 2021 | Plannora's own 2022 funding release, copied by news sites | Stale owned page | 15 | 1 | 15 | Dated note on the release; consistent founding date on every profile |

The founding year shows up most often, but the price error hurts most, so it goes first. Together the three claims appear 36 times across 33 answers, because three answers carried two errors.

### Six weeks later

Plannora rewrote its pricing page, published the facts page with the JSON-LD above, sent three correction emails and pinged each changed URL. Six weeks later it ran the same panel again. It was named in 104, and 9 carried a wrong claim: 2 on price, 4 on time tracking and 3 on the founding year.

| Measure | Before | After six weeks |
| --- | --- | --- |
| Answers naming Plannora | 102 | 104 |
| Answers with a wrong claim | 33 | 9 |
| Accuracy Rate | 67.6% | 91.3% |

Is a 23.7-point rise real? With about 100 answers per round, the 95% margin of error for the difference is about ±10.6 points: the square root of (0.676 × 0.324 ÷ 102 + 0.913 × 0.087 ÷ 104), times 1.96. The rise clears it comfortably.

The leftovers tell the rest of the story. Six of the nine remaining errors came from answers that ran no web search: all three founding-year errors and three of the time-tracking ones. That's the weights layer, where incorrect brand facts outlast any page fix. Plannora can't reach it now, so it keeps every source correct for the next model release and checks again when one ships.

## How Rankbox Helps With the Pages

Rankbox doesn't track AI citations, mentions or sentiment, and it doesn't monitor or correct what AI engines say about your brand. The audit, the ledger and the feedback reports stay with you, and the free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) is a quick way to write the prompts.

Where Rankbox helps is the page work. Most fixes for incorrect brand facts are pages: a clear pricing explainer, a facts page, a fair comparison, a help article that answers the question engines keep getting wrong. Rankbox's [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google about your category, and the [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles in your voice. Articles reach your site through Rankbox's API. The Business plan is $49.50 a month with a 7-day trial (card required). See [plans and pricing](/pricing).

## Frequently Asked Questions

### How do I fix incorrect brand facts in ChatGPT?

Turn on Search and open the answer's sources to find the page behind the wrong claim. Fix that page, or ask its owner to, and publish a dated facts page on your site. Keep OAI-SearchBot allowed so ChatGPT can read it, and report the answer with the thumbs-down button. Answers written without a search may keep the old fact until OpenAI releases a new model.

### Can Google or ChatGPT correct incorrect brand facts for me?

You can report them, but neither promises a correction. Both take feedback through a thumbs-down button, and a verified knowledge panel owner can suggest edits that Google reviews within a few days. The dependable fix is changing the pages these engines cite.

### How long do incorrect brand facts take to disappear from AI answers?

Search-grounded answers can change within days to a few weeks, once the engine recrawls the fixed page. Google says crawling can take a few days to a few weeks. Answers written from a model's training data don't change until the vendor releases a new model.

### Does schema markup fix incorrect brand facts?

Not on its own. Google says AI features need no special schema, and it asks that structured data match the page's visible text. Organization, Product and Offer markup give machines a clean, dated copy of your facts, which helps them parse the page. Treat the visible text as the source of truth.

### Can I edit Wikipedia or Wikidata to correct my company's facts?

Only in limited ways. On Wikipedia, you should propose changes on the talk page with the edit COI template and disclose your connection. On Wikidata, you may fix clear factual errors on an existing item, but shouldn't remove sourced claims or create an item about your own company. Paid editors must disclose on both.

### Why do incorrect brand facts come back after I fix my website?

Usually because another page still states them, or the engine hasn't recrawled yours. Check the citations again: if they point to a directory or review, fix that source. If the answer cites nothing, it's likely coming from training data, which only changes with a new model.

## References

1. [News Integrity in AI Assistants, EBU and BBC, October 2025](https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants)
2. [Adding a feature because ChatGPT incorrectly thinks it exists, Adrian Holovaty](https://www.holovaty.com/writing/chatgpt-fake-feature/)
3. [Small business sues Google, claiming AI Overview hallucinated attorney general lawsuit, Reason (Volokh Conspiracy)](https://reason.com/volokh/2025/06/11/large-libel-models-small-business-sues-google-claiming-ai-overview-in-searches-hallucinated-attorney-general-lawsuit/)
4. [Google missed key deadline in suit alleging Google's AI libeled business, Reason (Volokh Conspiracy)](https://reason.com/volokh/2026/01/12/google-missed-key-deadline-in-suit-alleging-googles-ai-libeled-business-court-holds/)
5. [Introducing FactCheck, Profound](https://www.tryprofound.com/blog/introducing-factcheck)
6. [Brand Performance reports, Semrush Knowledge Base](https://www.semrush.com/kb/1595-brand-performance-reports)
7. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
8. [Overview of OpenAI crawlers, OpenAI](https://developers.openai.com/api/docs/bots)
9. [Reporting content in ChatGPT and OpenAI platforms, OpenAI Help Center](https://help.openai.com/en/articles/10245791-reporting-content-in-chatgpt-and-openai-platforms)
10. [How can I report incorrect or inaccurate answers?, Perplexity Help Center](https://www.perplexity.ai/help-center/en/articles/10354902-how-can-i-report-incorrect-or-inaccurate-answers)
11. [Perplexity crawlers, Perplexity Docs](https://docs.perplexity.ai/guides/bots)
12. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
13. [Organization structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/organization)
14. [Latest documentation updates, Google Search Central](https://developers.google.com/search/updates)
15. [Update your Google knowledge panel, Google Search Help](https://support.google.com/knowledgepanel/answer/7534842)
16. [Ask Google to recrawl your URLs, Google Search Central](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
17. [Refresh Outdated Content tool, Search Console Help](https://support.google.com/webmasters/answer/7041154)
18. [How to remove content from Bing and Copilot, Bing Webmaster Tools](https://www.bing.com/webmasters/help/content-removal-cb6c294d)
19. [Transparency Note for Microsoft Copilot, Microsoft Support](https://support.microsoft.com/en-us/topic/transparency-note-for-microsoft-copilot-c1541cad-8bb4-410a-954c-07225892dbc2)
20. [Wikipedia:Conflict of interest, Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest)
21. [Wikidata:Self-promotion, Wikidata](https://www.wikidata.org/wiki/Wikidata:Self-promotion)
