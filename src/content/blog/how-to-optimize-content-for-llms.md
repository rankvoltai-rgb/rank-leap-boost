---
title: How to Optimize Content for LLMs: A Before-and-After Rewrite
description: A worked rewrite of content for LLMs: one weak section of a made-up SaaS article, seven edits with the reason for each, the result and a reusable checklist.
keyword: content for LLMs
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Content Strategy
---

To optimize content for LLMs, rewrite one section at a time until a machine that skips JavaScript, cuts your page into chunks and reads each chunk alone still gets the whole answer. In practice that means moving hidden facts into the page text, naming and defining the product, cutting keyword repeats, and putting specs in a table. This post does it on one real-sized section, edit by edit.

The section comes from a made-up article by Tallyfold, a fictional invoicing and payments app for agencies, and every Tallyfold fact in it is invented. The theory behind each edit, how LLM pipelines fetch, chunk and embed a page, lives in our [guide to writing for machines that don't read like Google](/blog/optimize-content-for-llms-writing-for-machines).

The result: against four product questions, scored with eight open embedding models, the rewrite's median similarity rose from 0.48–0.70 to 0.71–0.85. On two broader category questions it scored slightly lower than the original. That trade-off is worth understanding before you rewrite your own content for LLMs.

## Key Takeaways

- Rewriting content for LLMs starts with what the machine can't see. Facts in tabs, widgets and images may never reach an AI crawler, so move them into the HTML first.
- Open the section with a sentence that names and defines the product. A new brand name means little to an embedding model without one.
- Name the keyword twice, then stop. Spend the other words on facts: numbers, limits, dates.
- Put terms and fees in a table and the process in numbered steps, and keep the section under about 300 words so it fits whole in one chunk.
- The rewrite won all four product questions in 8 of 8 open models. It scored a little lower on the two category questions, which belong on a category page.

## The Section Before the Rewrite

Here is the section as a browser shows it, inside an article called "Tallyfold for agencies: a feature tour." The tab contents load only on click, and the fees sit in an image.

**Go global with ease**

Working with clients overseas shouldn't be a headache. That's why our invoicing software for agencies makes multi-currency billing simple. With our invoicing software for agencies, you can bill clients anywhere in the world without the usual hassle. It handles the conversion for you, so it's one less thing to worry about. It supports all the major currencies, it updates rates regularly, and payouts are fast. Agencies love it because invoicing software for agencies should just work. See the tabs below for the details.

*Tabs, loaded by JavaScript on click:* Currencies: 24 currencies, including EUR, GBP, CAD, AUD and JPY. Rates: Rates are locked when you send the invoice. Fees: Low conversion fees.

*Image, file rate-card.png, alt text "rate card":* 0.9% conversion fee. Payouts in 2 business days.

### What an AI crawler receives

An AI crawler that doesn't run JavaScript and doesn't read text inside images gets far less. It sees the heading, the paragraph, three tab labels ("Currencies Rates Fees") and the alt text "rate card." That's 92 words with no numbers at all.

Five problems keep this section from working as content for LLMs:

1. The facts buyers ask about (currency count, rate, fee, payout time) never reach the crawler.
2. The heading matches no question anyone would type.
3. The product is never named. The subject is "it," five times.
4. The same keyword phrase appears three times in 92 words, with nothing defined around it.
5. Nothing is dated, so a model can't tell whether "low conversion fees" is still true.

## Seven Edits That Turn It Into Content for LLMs

Each edit fixes one problem. The first decides what a crawler can see; the rest decide what it understands.

### Edit 1: Move the tab and image text into the page

Take the currency list, the rate rule, the fee and the payout time out of the tabs and the image, and write them as plain text in the section. In December 2024, Vercel and MERJ found that [none of the major AI crawlers rendered JavaScript](https://vercel.com/blog/the-rise-of-the-ai-crawler), OpenAI's and Anthropic's included. Microsoft's Bing team [advises](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers) against hiding answers in tabs, and against putting key information only in images, which "often reduces accuracy."

Keep the tabs for human visitors if you like. Just make sure the same facts also sit in the server's HTML.

### Edit 2: Turn the heading into a question with the product's name

"Go global with ease" becomes "How does Tallyfold invoice clients in other currencies?" AI engines split a buyer's question into smaller searches, a step called [query fan-out](/glossary/query-fan-out), and a heading phrased as one of those searches tells a machine exactly what the section answers. Bing's guide makes the same swap in its own example, replacing a vague "Learn More" with a full question.

### Edit 3: Open with a sentence that defines the product

The first sentence now reads: "Tallyfold is invoicing software for agencies that bills clients in 24 currencies and pays the agency out in its home currency." It names the product, its category, what it does and a number.

For a small brand, this may be the most useful line of content for LLMs on the page. Google Cloud's [hybrid search docs](https://docs.cloud.google.com/vertex-ai/docs/vector-search/about-hybrid-search) say "brand new product names that were added recently" don't work with meaning-based search alone, because the embedding model never saw them. The definition gives the name a meaning. In Rankbox's [keyword density experiment](/blog/vector-distance-vs-keyword-density), per point of density, a definition sentence moved similarity about 3.2 times as much as a keyword mention.

### Edit 4: Keep the keyword to two mentions, and swap filler for facts

The original repeats "invoicing software for agencies" three times and says little else. The rewrite uses the phrase twice, once in the opening definition and once in the closing tip, following the Twice-Four Rule from the same experiment: name it twice, then give defining facts. Repeats past the second stopped helping in that test.

"Agencies love it" and "one less thing to worry about" are gone. Neither says anything a buyer could check.

### Edit 5: Replace "it" with names, and spell out FX

Every "it" that pointed back to the product became "Tallyfold." The fee line spells out "foreign exchange (FX)" before the short form. A chunk may be read with nothing around it, so each sentence needs its own subject.

The Dense X Retrieval study by [Chen and colleagues](https://arxiv.org/abs/2312.06648) rewrote text into self-contained statements, "replacing pronouns" with full names, and those retrieved better than raw passages. In Anthropic's [contextual retrieval](https://www.anthropic.com/news/contextual-retrieval) tests, adding context back to each chunk cut failed retrievals by 35%.

### Edit 6: Put the terms in a table and the process in steps

The five terms (currencies, rate, fee, payout time, payout currencies) went into a two-column table, and the invoicing flow became three numbered steps. In the [Table Meets LLM study](https://arxiv.org/abs/2305.13062), models read tables given as HTML 6.76% better than the same data written as plain text with separators.

### Edit 7: Date it, show one worked number, and keep it short

The table header carries "checked 28 September 2026," and the last paragraph works one example: a 0.9% fee on a 10,000-euro invoice is 90 euros. A worked number is easy to quote and hard to misread.

The section comes to about 325 tokens on the GPT-4o tokenizer. OpenAI's file search [cuts files into 800-token chunks](https://developers.openai.com/api/docs/guides/retrieval) that overlap by 400 by default, so any passage of 400 tokens or fewer, roughly 300 words by [OpenAI's rule of thumb](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them), lands whole in at least one chunk.

## The Section After the Rewrite

**How does Tallyfold invoice clients in other currencies?**

Tallyfold is invoicing software for agencies that bills clients in 24 currencies and pays the agency out in its home currency. A US agency can invoice a client in euros (EUR) or British pounds (GBP) and still get paid in dollars. Tallyfold locks the exchange rate when the invoice is sent and prints that rate on the invoice, so the client and the agency's books show the same number.

Multi-currency invoicing in Tallyfold works in three steps:

1. Pick the client's currency on the invoice: euros, pounds, Canadian or Australian dollars, yen, or one of 19 others.
2. Send the invoice. Tallyfold locks the mid-market rate at that moment and prints it on the invoice.
3. When the client pays, Tallyfold converts the payment and pays the agency within 2 business days.

| Item | Tallyfold's multi-currency terms (checked 28 September 2026) |
| --- | --- |
| Invoice currencies | 24, including EUR, GBP, CAD, AUD and JPY |
| Exchange rate | Mid-market rate, locked when the invoice is sent |
| Conversion fee | 0.9% of the converted amount |
| Payout time | 2 business days after the client pays |
| Payout currencies | USD, EUR, GBP, CAD and AUD |

A 0.9% foreign exchange (FX) fee on a 10,000 euro invoice is 90 euros. When you compare invoicing software for agencies, check the conversion fee and the payout time, not just the number of currencies.

## What the Rewrite Changed, Measured

"Before" here is the crawler view. Tokens are counted with the GPT-4o tokenizer.

| Measure | Before (crawler view) | After |
| --- | --- | --- |
| Tokens | 110 | 325 |
| Exact keyword phrase | 3 | 2 |
| Times the product is named | 0 | 7 |
| Numbers a buyer could check | 0 | 7 |
| Facts hidden behind JavaScript or images | All of them | None |
| Date on the facts | None | 28 September 2026 |

### How close each version sits to six buyer questions

Each version was then scored against six buyer questions with the eight open embedding models from Rankbox's keyword density study, run locally with that study's settings. The score is cosine similarity, where higher means closer in meaning. Each cell is the median across the eight models.

| Buyer question | Before, crawler view | Before, all text shown | After | Models where after beat the crawler view |
| --- | --- | --- | --- | --- |
| Can Tallyfold send invoices in other currencies? | 0.70 | 0.70 | 0.84 | 8 of 8 |
| What exchange rate does Tallyfold use on foreign currency invoices? | 0.68 | 0.70 | 0.85 | 8 of 8 |
| How much does Tallyfold charge for currency conversion? | 0.63 | 0.68 | 0.83 | 8 of 8 |
| How long do Tallyfold payouts take? | 0.48 | 0.52 | 0.71 | 8 of 8 |
| Which invoicing app for agencies can bill clients in euros and pounds? | 0.79 | 0.80 | 0.76 | 0 of 8 |
| Our agency invoices clients in Europe but gets paid in dollars. What software handles the conversion? | 0.79 | 0.82 | 0.77 | 2 of 8 |

Three results stand out:

- **Showing the hidden text helped on its own.** With the tab and image text visible, the median rose on all six questions before any rewriting, though only slightly on the first.
- **The rewrite won every product question** in all eight models, raising the median by roughly 0.15 to 0.23.
- **It scored slightly lower on the two category questions.** The original talks about the category (agencies, clients overseas); the rewrite talks about one product. An earlier draft did worse still, and naming the category twice and writing "euros" and "pounds" beside EUR and GBP won back part of the gap (in 6 and 7 of the 8 models).

The fix for the category questions isn't more keywords here. Good content for LLMs answers each question on the page built for it, and for these two that's a category page, such as a comparison of invoicing apps for agencies. [Our main guide](/blog/optimize-content-for-llms-writing-for-machines) calls this coverage.

Keep the limits in view when you judge content for LLMs this way. These are similarity scores from open models on one invented passage, not rankings in ChatGPT, Perplexity or Google, none of which publishes the embedding models it uses.

## A Checklist for Rewriting Content for LLMs

Run this on any section before you publish it. Each item is a yes or no.

1. **Visible:** every fact a buyer might ask about is in the server's HTML, not in tabs, widgets, images or PDFs only.
2. **Asked:** the heading is a question or task a buyer would type, with the product's name in it.
3. **Defined:** the first sentence says what the product is, what it does, for whom, with a number.
4. **Twice:** the exact keyword appears about twice, not three or more times.
5. **Named:** no sentence depends on "it," "this" or "the platform" pointing to an earlier section; acronyms are spelled out once.
6. **Shaped:** terms, limits and fees sit in a table; processes sit in numbered steps.
7. **Dated:** facts that can change carry a month and year.
8. **Sized:** the section runs under about 300 words, so it fits whole in one chunk.
9. **Scoped:** the section answers product questions; category questions have their own page.

A section that scores 8 or 9 is ready to publish as content for LLMs. For passage-level checks such as answer-first openings and proof, add the Lift Test from [our guide to optimizing content for AI search](/blog/optimize-content-for-ai-search). The free [heading structure checker](/tools/heading-structure-checker) and [keyword density checker](/tools/keyword-density-checker) speed up the counting. For a template that covers a whole post, see [how to write blog posts for AI citation](/blog/how-to-write-blog-posts-for-ai-citation).

## Where Rankbox Fits

If you'd rather start new articles from a draft than write every piece of content for LLMs by hand, Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000–3,500-word, source-backed articles, and its [Brand Voice](/features/brand-voice) feature applies the tone, audience, style rules and product details you give it. Articles reach your site through Rankbox's API on the Business plan, $49.50 a month with a 7-day trial ([pricing](/pricing)).

The facts in a table like Tallyfold's still come from you: Rankbox doesn't import proprietary data or invent fees and limits, so enter them in Brand Voice's product details. It doesn't track AI citations today.

## Frequently Asked Questions

### How do you optimize content for LLMs?

Rewrite section by section. Put every fact in the page's HTML, open each section with a sentence that names and defines the product, use the keyword about twice, move specs into a table and steps into a numbered list, date anything that changes, and keep sections under about 300 words.

### What should you fix first when rewriting content for LLMs?

Fix visibility first. If facts sit in tabs that load with JavaScript, in images or only in PDFs, many AI crawlers never see them, and no rewrite helps. In the Tallyfold example, showing the tab and image text alone raised median similarity on all six questions.

### Do AI crawlers read content inside tabs and accordions?

Often not, if the content loads with JavaScript. Vercel and MERJ found in December 2024 that none of the major AI crawlers rendered JavaScript, and Bing advises against hiding important answers in tabs or expandable menus. Text that's in the HTML and only collapsed on screen still reaches a crawler that reads raw HTML.

### How long should a section of content for LLMs be?

Under about 300 words is a safe target. With OpenAI's default file search settings, any passage of 400 tokens (about 300 words) or less always fits whole inside one chunk. [Google says](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) pages don't need to be cut into tiny pieces, and a very short section gives an engine little to quote, so don't overdo it.

### Should you still use your keyword in content for LLMs?

Yes, but only about twice per passage. In Rankbox's keyword density experiment on passages of about 100 words, the second mention still raised similarity, but repeats after that stopped helping. Many AI search systems also run keyword search alongside meaning-based search, so the exact product and category names should appear.

### How can you tell whether a rewrite helped?

Check what changed for a machine first: facts in the raw HTML, the product named, a table present. To see whether AI answers change, run a fixed set of buyer prompts before and after for several weeks, as our [GEO measurement guide](/blog/how-to-measure-geo) explains.

## References

1. [The rise of the AI crawler, Vercel and MERJ](https://vercel.com/blog/the-rise-of-the-ai-crawler)
2. [Optimizing your content for inclusion in AI search answers, Microsoft Advertising](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)
3. [About hybrid search, Google Cloud](https://docs.cloud.google.com/vertex-ai/docs/vector-search/about-hybrid-search)
4. [Dense X Retrieval: What Retrieval Granularity Should We Use? (Chen et al.), arXiv](https://arxiv.org/abs/2312.06648)
5. [Introducing Contextual Retrieval, Anthropic](https://www.anthropic.com/news/contextual-retrieval)
6. [Table Meets LLM (Sui et al., WSDM 2024), arXiv](https://arxiv.org/abs/2305.13062)
7. [Retrieval guide (vector stores and chunking), OpenAI](https://developers.openai.com/api/docs/guides/retrieval)
8. [What are tokens and how to count them?, OpenAI Help Center](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)
9. [Optimizing your website for generative AI features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
