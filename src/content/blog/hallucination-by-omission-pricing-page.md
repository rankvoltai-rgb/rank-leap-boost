---
title: Hallucination by Omission: The Silent Risk of Not Having a Clear Pricing Page
description: Without a clear pricing page, AI answers fill the gap with old reviews and rival guesses. What to publish, schema to add, and how to check your AI price.
keyword: pricing page
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Playbooks
---

Hallucination by omission is what happens when your pricing page doesn't state a price, so an AI engine asked "How much does your product cost?" answers from whatever else it can find: an old review, a reseller listing, a competitor's teardown or its own guess. The error is the engine's, but the gap is yours. The fix is a clear pricing page that publishes at least a starting price, a typical range and what drives the cost, dated and written in plain HTML.

This used to be a sales-process choice. Now it's a visibility problem. In G2's March 2026 survey of 1,076 B2B decision-makers, [51% said they start software research with an AI chatbot](https://www.prnewswire.com/news-releases/new-g2-research-half-of-b2b-software-buyers-now-start-their-research-with-ai-chatbots-302742807.html) more often than with Google, and 69% said they chose a different vendor than planned because of what a chatbot told them. And price is the fact AI engines get wrong most often. When Searchable had 1,704 brands grade 32,556 AI statements about themselves, [pricing was the most error-prone category](https://www.searchable.com/data/ai-brand-misinformation-report), at 13.5% false.

This playbook covers why a missing price becomes a guessed one, what that costs, what to publish when your enterprise pricing is custom, the schema to add, and how to check what AI says you charge. For the technical background on why retrieval reduces errors but can't invent a fact you never published, read our explainer on [how RAG reduces hallucinations compared to traditional language models](/blog/how-does-rag-reduce-hallucinations).

## Key Takeaways

- Hallucination by omission is a wrong AI answer caused by a fact you never published. For B2B software, the fact is usually price.
- In Siteline's June 2026 benchmark, AI agent runs that hit access errors on a vendor's site took 58% of their content from third-party sites, against 12% for clean runs.
- 14% of 100 leading B2B products in that benchmark showed no price on any plan. Engines still tend to answer the question, with someone else's number.
- No public record we could locate names a B2B SaaS company that lost a deal to an AI-quoted enterprise price, and the claim that AI inflates hidden prices by 300% has no source. What is documented is the mechanism and the error rate.
- A pricing page can remove most guesswork without a full price list: a starting price, a typical range by company size, the cost drivers, billing terms and an "updated" date.
- Publishing changes what search-based answers can find within days to weeks. It does not change a model's trained weights, which update only when the vendor retrains.
- Check your AI price with a fixed set of price prompts, run several times per engine, and score it with the Accuracy Rate.

## What Hallucination by Omission Means

A classic [AI hallucination](/glossary/ai-hallucination) is a confident false statement a model makes up. Hallucination by omission is a specific kind. The model or search engine isn't inventing from nothing. It is answering a question your site refused to answer, using the best material it can find.

The distinction matters because it tells you where the fix lives. You can't reach into a model and correct it. You can publish the missing fact where retrieval will find it.

### Three ways a missing price becomes a wrong price

1. **A stale source fills the gap.** An old announcement post, a 2024 review or a cached directory listing still shows last year's price. The engine quotes it because it's the only number it can find.
2. **A rival's estimate fills the gap.** Competitors and affiliate sites publish "[Your product] pricing" articles, sometimes with an estimated enterprise range. With no official number to contradict them, those estimates become the answer.
3. **The model guesses.** When no retrieved page states a price, a model may still produce one from patterns: what similar tools charge, or what it saw in training.

All three are silent. The buyer never tells you where they heard the number. You find out when a prospect goes quiet, or when someone on a first call says "I thought you were more expensive."

## Why a Missing Price Turns Into a Guessed Price

AI search engines don't answer from one page. They often run several searches, read what comes back and write from the results. That process, often called retrieval-augmented generation, is what makes their answers current. It is also what makes a missing price dangerous.

### Retrieval fills the gap with whatever exists

Engines increasingly check the vendor's own domain first. Nectiv's 2026 analysis of about 4,000 prompts found ChatGPT ran a [`site:` search in 64% of its fan-out queries](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study), often aimed at specific companies. Our [ChatGPT SEO guide](/ai-seo/chatgpt) covers that shift. If the `site:` search on your domain returns a pricing page that says only "Contact sales," the engine has confirmed you exist and learned nothing about price. So it widens the search.

Siteline's [June 2026 benchmark](https://siteline.ai/blog/ai-agent-software-benchmark/) shows what happens next. Its founder gave a Claude agent one task for 100 top B2B products: find the monthly price of every public plan. Three products from the report show the pattern:

- **Braze:** the agent couldn't access the pricing pages in any run and pulled prices from G2 and Vendr instead.
- **Zendesk:** the plan table loaded with JavaScript, so in the session Siteline shows, the agent fell back to pricing articles on the blogs of two other software companies, Hiver and Featurebase.
- **Iterable:** the agent tried a /pricing URL that doesn't exist. Siteline's lesson: "always have a pricing page even if you don't disclose prices directly."

Across all runs, the ones with access errors took 58% of their content from third-party sources. Clean runs took 12%. None of this proves a lost deal. It does show that when your own pricing page can't answer, the answer comes from someone else's.

### Models rarely say "I don't know"

You might hope an engine would just say "Plannora doesn't publish its price." Sometimes it does. Often it doesn't. In a benchmark of retrieval-augmented models published at AAAI 2024, researchers gave models documents that didn't contain the answer. The best model [declined to answer only 45% of the time](https://arxiv.org/abs/2309.01431). The rest of the time it answered anyway.

OpenAI's own researchers explain why. Models are trained and graded in a way that "still rewards guessing whenever search fails to yield a confident answer," as their [2025 paper on hallucination](https://arxiv.org/abs/2509.04664) puts it. A plausible number scores better than a blank.

### Your price is a rare fact

Language models are good at facts that appear thousands of times online and bad at facts that appear once or twice. The same OpenAI paper argues a base model's error rate on such facts should be at least the share of them seen only once in training. Your enterprise price, if it appears at all, is exactly that kind of fact. Our [RAG explainer](/blog/how-does-rag-reduce-hallucinations) goes deeper on why rare facts benefit most from retrieval.

### What publishing can and can't change

Be precise about what a new pricing page does. It changes what search-based answers can find: ChatGPT when it searches, Perplexity, Google's AI Overviews and AI Mode, and Copilot. Once engines recrawl and reindex the page, which typically takes days to weeks, those answers can quote you.

It doesn't change what a model learned in training. Those weights update only when the vendor trains a new model, on its own schedule, and nobody can force a reset. OpenAI says ChatGPT ["may search the web automatically"](https://help.openai.com/en/articles/9237897-chatgpt-search) when a question needs current information, which means some answers still skip search and lean on the old weights. A clear pricing page, repeated consistently across the web, is also what future training runs will see.

## The Business Case Against Pricing Invisibility

Hiding prices behind "Book a demo" has a logic: qualify leads, avoid sticker shock, keep room to negotiate. The AI era changes the trade. The buyer now gets a number either way. The only question is whose.

### What is documented

- **Buyers want the number.** In TrustRadius's 2025 survey of 2,058 technology buyers, [49% said the one thing they'd change](https://www.trustradius.com/blog/bridging-the-trust-gap-b2b-tech-buying-in-the-age-of-ai) about buying software is the lack of transparent pricing. The same report suggests vendors with complex pricing give "a ballpark range or base level."
- **AI shortlists move deals.** G2's survey found AI chatbots are the number one source influencing which vendors make a shortlist.
- **Price is the most-missed fact.** In Searchable's brand-graded data, AI got pricing wrong 13.5% of the time overall and 16.1% of the time for US brands. Searchable sells AI visibility tracking, so treat it as a vendor study, though each fact was graded by the brand itself.
- **Many vendors still hide price.** Siteline's agent found a published price for 65% of plans. For 30% of customer support products and 29% of marketing and sales products, it found no price at all.
- **Wrong AI prices cost real money.** When Google's AI Overview told customers a Missouri pizzeria offered [a large pizza for the price of a small](https://www.firstalert4.com/2025/08/20/please-do-not-use-google-ai-find-out-our-specials-wentzville-restaurant-asks-patrons/), the owner said, "As a small business, we can't honor a Google AI special." In 2024 a Canadian tribunal ordered Air Canada to pay C$812.02 after its own chatbot misstated a fare rule. The tribunal said it makes no difference whether wrong information [comes from "a static page or a chatbot"](https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot).

### What we could not document

You'll read that AI-quoted prices are costing SaaS companies deals. We searched for a documented case that names a company and a lost deal, and came up empty. Vendor blogs describe anonymous prospects quoting ChatGPT prices on sales calls, but none of those accounts gives details anyone can verify. A December 2025 press release from Kodec AI claimed AI platforms gave [wrong pricing or feature details in 62% of simulated B2B software queries](https://www.globenewswire.com/news-release/2025/12/10/3203348/0/en/Kodec-AI-Research-Reveals-Rogue-Sales-Rep-Problem-in-AI-Search.html) and that "companies lose deals" as a result. It published no method, so read it as a claim, not a finding.

A figure also circulates in GEO pitches: that AI "inflates" hidden prices by 300%. We could not trace it to any study, so we don't use it. The example below shows how an inflated quote can happen, with made-up numbers and the arithmetic shown.

### How a hidden price loses a deal (a fictional example)

Plannora is a made-up project management tool. Its pricing page lists Free, Team at $10 per user per month and Business at $18, then "Enterprise: Contact sales." A buyer at a 200-person company asks an AI engine what Plannora Enterprise would cost.

The engine finds no enterprise number on plannora.io. It does find a comparison post on loopcraft.ai, the blog of a fictional rival, which says Plannora Enterprise "likely runs $45 to $60 per user per month." So the answer says: about $108,000 to $144,000 a year for 200 users.

| | Per user per month | 200 users, per year | Midpoint per year |
| --- | --- | --- | --- |
| AI answer (rival's estimate) | $45 to $60 | $108,000 to $144,000 | $126,000 |
| Plannora's real 200-seat range | $25 to $32 | $60,000 to $76,800 | $68,400 |
| Gap | | | $57,600 (the AI's figure is 84% higher) |

The buyer's budget is $90,000. On the AI's numbers, Plannora is out. On the real numbers, it fits with room to spare. Nobody at Plannora ever hears about the deal. That is the silent part of the risk.

## The Pricing Disclosure Ladder

You don't have to publish every discount to stop the guessing. The Pricing Disclosure Ladder is a six-rung scale for deciding how much a pricing page needs to say. Each rung shows what an engine can retrieve from your site and what its answer is likely to rest on. It's a planning model built from the evidence above, not a measured result.

| Rung | What your pricing page publishes | What an engine finds on your site | What the answer tends to rest on |
| --- | --- | --- | --- |
| 0 | No pricing page | Nothing; an agent may guess a URL | Third-party pages or a model guess |
| 1 | "Contact sales" only | Proof you sell, no number | Review sites, resellers, rival teardowns |
| 2 | Plan names and features, no prices | Your plan names | Other sites' prices attached to your plan names |
| 3 | A "starting at" price per plan | A floor for each plan | Your floor, plus guesses above it |
| 4 | Starting prices, a typical range by company size, and cost drivers | Enough to size a quote | Your own range for most questions |
| 5 | Full price list, add-ons and a dated change log | Every public number | Your numbers, if the page is current |

Most B2B teams can reach rung 4 without changing how they sell. Rung 3 is the minimum. Rungs 0 to 2 leave the answer to other people.

## How to Build a Pricing Page AI Can Quote

A pricing page that removes guesswork states the facts a buyer, or an engine acting for one, needs to size a purchase. Here is what that means when your largest deals are quoted by hand.

### The seven facts to state, even with custom enterprise pricing

1. **A starting price for every plan,** including enterprise: "Enterprise starts at $25 per user per month."
2. **A typical range by size:** "Most 200-user contracts land between $25 and $32 per user per month."
3. **What drives the price:** seat count, add-ons such as SSO or audit logs, contract length, support tier, usage.
4. **Minimums and terms:** minimum seats, annual versus monthly billing, the monthly premium.
5. **What every plan includes,** so an engine doesn't attach one plan's feature to another plan's price.
6. **Currency and tax:** "Prices in US dollars, excluding sales tax."
7. **A visible date:** "Prices updated 28 September 2026," changed only when prices change.

The range is the fact most teams resist. It doesn't commit you to a quote. It tells a buyer whether to call, which is what "Book a demo" was meant to do in the first place.

### Write prices as sentences, not only as a grid

Most AI crawlers don't run JavaScript. Vercel's crawler study found that ["none of the major AI crawlers currently render JavaScript"](https://vercel.com/blog/the-rise-of-the-ai-crawler), and Siteline's 2026 report says the same of agents from platforms other than Google. A plan table drawn in the browser can reach an engine as empty headings.

So put the key prices in the HTML the server sends, and state each one in a sentence as well as in the table: "Plannora Team costs $10 per user per month, billed annually." Sentences survive being quoted out of context. Grids often don't. Our guide to [optimizing a site for ChatGPT and Perplexity](/blog/optimize-website-for-chatgpt-and-perplexity) has the rendering checks, and the free [AI search readiness check](/tools/ai-search-readiness-check) scans a URL for them.

### Publish only numbers you will honour

The Air Canada ruling cuts both ways. A clear public price protects you from other people's guesses, but a number on your own site is a number you may be held to. Don't publish a "from" price no real customer can get. If the range varies by region or contract, say so on the page rather than showing a figure that only applies in one case.

### Keep one source of truth

Your pricing page can lose to your own old content. Update or redirect old launch posts that announce a past price, and refresh your profiles on review sites and marketplaces. When a third-party page keeps an old number, ask the owner to fix it; our guide on [fixing incorrect brand facts in LLM citations](/blog/how-to-fix-incorrect-brand-facts-in-llm-citations) has the steps and message templates, and the [full recovery blueprint for incorrect brand facts](/blog/fix-incorrect-brand-facts-in-ai-answers) covers tracing the source an engine relies on. After any price change, resubmit the page for crawling, for example through [Bing Webmaster Tools](/blog/bing-webmaster-tools-ai-indexing-guide) and [IndexNow](/glossary/indexnow).

## Add Offer and PriceSpecification Schema

[Schema markup](/glossary/schema-markup) restates your prices in a machine-readable form. It won't replace the visible text, and it can't rescue a page that hides prices from people. But it removes ambiguity about which number belongs to which plan.

Here is a complete example for Plannora's pricing page. It uses `AggregateOffer` for the price floor, one `Offer` per plan, `UnitPriceSpecification` for per-user pricing, and `minPrice` with `eligibleQuantity` to express "from $25 per user for 100 or more users" without inventing a fixed enterprise price.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://plannora.io/pricing#webpage",
      "url": "https://plannora.io/pricing",
      "name": "Plannora pricing",
      "dateModified": "2026-09-28",
      "about": { "@id": "https://plannora.io/#app" }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://plannora.io/#app",
      "name": "Plannora",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": 0,
        "priceCurrency": "USD",
        "offerCount": 4,
        "offers": [
          {
            "@type": "Offer",
            "name": "Free",
            "price": 0,
            "priceCurrency": "USD",
            "description": "Up to 5 users."
          },
          {
            "@type": "Offer",
            "name": "Team",
            "price": 10,
            "priceCurrency": "USD",
            "description": "Per user per month, billed annually.",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": 10,
              "priceCurrency": "USD",
              "unitText": "per user per month",
              "referenceQuantity": { "@type": "QuantitativeValue", "value": 1, "unitText": "user" },
              "validFrom": "2026-03-01"
            }
          },
          {
            "@type": "Offer",
            "name": "Business",
            "price": 18,
            "priceCurrency": "USD",
            "description": "Per user per month, billed annually."
          },
          {
            "@type": "Offer",
            "name": "Enterprise",
            "priceCurrency": "USD",
            "description": "Custom quote. From $25 per user per month, billed annually, for 100 or more users.",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "minPrice": 25,
              "priceCurrency": "USD",
              "unitText": "per user per month",
              "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 100, "unitText": "users" },
              "validFrom": "2026-09-28"
            }
          }
        ]
      }
    }
  ]
}
```

This block uses only types and properties in the current schema.org vocabulary and processes cleanly as JSON-LD. A longer version with the same types and structure returned no errors and no warnings in the [Schema Markup Validator](https://validator.schema.org/) on 28 September 2026. Place yours in a `<script type="application/ld+json">` tag on the pricing page, and run it through that validator and Google's Rich Results Test before you publish. Our free [schema generator](/tools/schema-generator) builds the surrounding markup.

Four rules keep it honest and useful:

- **Match the visible page.** Google's guidelines say ["Don't mark up content that is not visible to readers of the page"](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Every number in the JSON-LD must appear in the text.
- **Don't expect a rich result.** Google's [software app markup](https://developers.google.com/search/docs/appearance/structured-data/software-app) needs a rating or review to qualify, as of its 8 September 2026 update. Never add ratings you haven't earned.
- **Don't treat schema as an AI switch.** Google says there's ["no special schema.org structured data"](https://developers.google.com/search/docs/appearance/ai-features) needed for AI Overviews or AI Mode. Microsoft's Fabrice Canel said in March 2025 that [schema markup helps Microsoft's LLMs understand content](https://www.seroundtable.com/schema-llms-copilot-bing-microsoft-39093.html). Treat it as clarity, not a ranking lever.
- **Update it with the page.** Change `dateModified` and `validFrom` whenever prices change.

## How to Check What AI Says Your Price Is

You can't fix an error you haven't measured. Run what we call the Price Answer Test: a fixed set of price questions, asked the same way every time, scored against your own pricing page.

### The prompts

| Prompt | A correct answer includes |
| --- | --- |
| How much does [Brand] cost? | Every public plan price, or "from $X" |
| [Brand] pricing per user | Per-user price and billing basis |
| How much would [Brand] cost for a 200-person company? | Your published range, not a third-party estimate |
| Does [Brand] have a free plan? | The right answer, with its limits |
| [Brand] enterprise pricing | Your starting price and what drives it |
| [Brand] vs [Rival] price for 50 users | Both totals, calculated from current prices |
| Is [Brand] expensive? | A comparison built on real numbers |
| Cheapest [Brand] plan with SSO | The right plan and its price |

### How to run it

1. **Use clean sessions.** Log out or use a temporary chat, with memory off where the product allows. Our [15-minute AI mention audit](/blog/how-to-see-if-ai-mentions-your-brand) covers the setup for each engine.
2. **Cover the engines your buyers use:** ChatGPT, Perplexity, Google AI Overviews or AI Mode, Copilot and Gemini.
3. **Run each prompt three times per engine.** Answers change from run to run, so one screenshot proves little.
4. **Log every stated price and every cited URL.** A wrong price with a citation points to a page you can fix. A wrong price with no citation probably came from the model's weights.
5. **Score it.** Price accuracy is the [Accuracy Rate](/blog/geo-metrics-framework) applied to price claims: correct price statements divided by answers that state a price.
6. **Repeat monthly and after every price change.** Our guide to [measuring GEO](/blog/how-to-measure-geo) explains how many answers you need before a change is real.

Our free [AI Visibility Prompt Kit](/tools/ai-visibility-prompt-generator) can generate a wider prompt set if you want to test more than price, and our [defensive GEO playbook](/blog/defensive-geo) covers the hidden-cost and dealbreaker questions buyers ask next.

## Worked Example: Plannora's Enterprise Price

Here is the fictional Plannora case from start to finish, with made-up numbers.

**Before.** Plannora runs the eight prompts above in three engines, three runs each: 8 × 3 × 3 = 72 answers. 60 of them state a Plannora price. Only 21 are correct, a price accuracy of 35%. The 39 errors trace to three sources:

| Source of the wrong price | Answers | Fix |
| --- | --- | --- |
| Loopcraft's comparison post (enterprise estimate) | 27 | Publish Plannora's own enterprise range |
| An old stackreview.co review ($12 Team price) | 9 | Ask the site to update; note the change date on the pricing page |
| No citation (a plan that doesn't exist) | 3 | Nothing to edit; state all plans clearly and wait for retraining |

**The change.** Plannora moves from rung 2 to rung 4. The enterprise section now reads: "Enterprise starts at $25 per user per month, billed annually, for 100 users or more. Most 200-user contracts land between $25 and $32 per user per month, or $60,000 to $76,800 a year. Price depends on seat count, SSO and audit add-ons, contract length and support tier. Updated 28 September 2026." The prices sit in the server-rendered HTML, the JSON-LD above goes live, and the page is resubmitted for crawling.

**After six weeks.** The same 72 answers now include 66 that state a price, and 53 are correct: 80%. The remaining 13 errors are 7 answers still citing Loopcraft's post, 3 citing the old review and 3 uncited guesses.

Is the jump real? With 60 and 66 price answers in the two periods, the margin of error on the change is roughly ±15 points at 95% confidence. A 45-point rise clears it easily. The three uncited errors didn't move, and that shows the limit of the fix: answers written from weights, not search, change only when the model is retrained.

## Where Rankbox Fits

Rankbox helps with the content side of this problem. [Answer-Space Research](/features/answer-space-research) maps the pricing and comparison questions buyers ask ChatGPT, Perplexity and Google, so you know which answers your site is missing. The [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles, such as a clear pricing explainer or a "cost for a 200-person team" page, that reach your site through [Rankbox's API](/integrations/api).

Rankbox doesn't track or report what AI engines say about your prices, so run the Price Answer Test yourself or use a third-party tracker. For what it's worth, Rankbox's own [pricing page](/pricing) states its one plan in the page's HTML: $49.50 a month, with a 7-day trial.

## Frequently Asked Questions

### What is hallucination by omission?

Hallucination by omission is a wrong AI answer caused by a fact you never published. When your pricing page gives no number, an AI engine answering "How much does it cost?" uses whatever it finds instead: an old review, a rival's estimate or a guess.

### Should B2B SaaS companies publish pricing on their pricing page?

Yes, at least a starting price and a typical range. You don't need a full price list. Publishing a floor, a range by company size and the cost drivers gives AI engines and buyers your number instead of someone else's, while leaving room for custom quotes.

### Why does ChatGPT show the wrong price for my product?

Usually because it found an outdated or third-party page, or no page at all. Check the answer's citations. If one points to an old review or a rival's post, update the source or outrank it with a clear pricing page. If there's no citation, the price likely came from training data.

### Can I make ChatGPT forget an old price?

Not directly. You can't edit a model's trained weights; they change only when OpenAI retrains. What you can change is what ChatGPT finds when it searches: publish the current price on your pricing page, fix old pages, and get them recrawled. Search-based answers can update within days to weeks.

### Does pricing schema help AI engines get my price right?

It helps with clarity, not rankings. Google says no special schema is needed for its AI features, while Microsoft has said schema helps its models understand content. Use Offer and UnitPriceSpecification markup that matches your visible prices exactly.

### How do I check what AI says my product costs?

Ask a fixed set of price questions in each engine, three times each, in clean sessions. Record every price and cited URL, then divide correct price statements by answers that state a price. Repeat monthly and after every price change.

## References

1. [New G2 research: half of B2B software buyers now start their research with AI chatbots, G2 via PR Newswire, April 2026](https://www.prnewswire.com/news-releases/new-g2-research-half-of-b2b-software-buyers-now-start-their-research-with-ai-chatbots-302742807.html)
2. [The AI brand misinformation report, Searchable, July 2026](https://www.searchable.com/data/ai-brand-misinformation-report)
3. [How well do AI agents understand top software products?, Siteline, June 2026](https://siteline.ai/blog/ai-agent-software-benchmark/)
4. [Bridging the trust gap: B2B tech buying in the age of AI, TrustRadius, 2025](https://www.trustradius.com/blog/bridging-the-trust-gap-b2b-tech-buying-in-the-age-of-ai)
5. [ChatGPT tripled fan-out queries: data study, Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)
6. [Benchmarking Large Language Models in Retrieval-Augmented Generation, Chen et al., AAAI 2024](https://arxiv.org/abs/2309.01431)
7. [Why Language Models Hallucinate, Kalai et al., OpenAI, 2025](https://arxiv.org/abs/2509.04664)
8. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
9. [Please do not use Google AI to find out our specials, First Alert 4, August 2025](https://www.firstalert4.com/2025/08/20/please-do-not-use-google-ai-find-out-our-specials-wentzville-restaurant-asks-patrons/)
10. [Moffatt v. Air Canada: a misrepresentation by an AI chatbot, McCarthy Tétrault](https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot)
11. [Kodec AI research reveals "rogue sales rep" problem in AI search, GlobeNewswire, December 2025](https://www.globenewswire.com/news-release/2025/12/10/3203348/0/en/Kodec-AI-Research-Reveals-Rogue-Sales-Rep-Problem-in-AI-Search.html)
12. [The rise of the AI crawler, Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler)
13. [General structured data guidelines, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
14. [Software app (SoftwareApplication) structured data, Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/software-app)
15. [AI features and your website, Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)
16. [Schema helps Microsoft's LLMs understand your content, Search Engine Roundtable](https://www.seroundtable.com/schema-llms-copilot-bing-microsoft-39093.html)
17. [UnitPriceSpecification, Schema.org](https://schema.org/UnitPriceSpecification)
18. [Schema Markup Validator, Schema.org](https://validator.schema.org/)
