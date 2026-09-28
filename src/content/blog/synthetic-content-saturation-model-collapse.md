---
title: Synthetic Content Saturation & The "Model Collapse" Moat
description: What model collapse really is, how much of the web is now AI-written, what rerankers do with generic pages, and how first-party facts build a moat.
keyword: model collapse
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Content Strategy
---

Model collapse is what happens when AI models are trained, generation after generation, on text that earlier models wrote. In the [Nature study that named it](https://www.nature.com/articles/s41586-024-07566-y), rare information vanished first, and later models drifted into nonsense. It is a training-data effect, not a search penalty. But it points to a real business risk: when the web fills with machine-written articles, a page that says what every other page says gives an AI engine no reason to pick it.

The scale is no longer small. [Graphite's May 2026 study](https://graphite.io/five-percent/research/ai-now-writes-as-many-online-articles-as-humans-do) of 55,400 articles sampled from Common Crawl found that about half of new English articles are now primarily AI-generated, a share that has held near 50% for five quarters. In that flood, generic articles are interchangeable. The pages that stand out carry something a model can't make up: your prices, your specs, your test results.

This post explains model collapse correctly, then maps what synthetic content does to search at four layers, and what the evidence does and doesn't show about AI filters. It ends with the Information Gain Moat and the Moat Ledger, a way to score any draft by how much of it only you could have written. If your question is simply whether publishing AI-written posts works, read our honest answer to [whether automated blog posts are effective for SEO](/blog/are-automated-blog-posts-effective-for-seo).

## Key Takeaways

- Model collapse is a training effect. Shumailov and colleagues showed that models trained on their own output lose the rare "tails" of the data first, then drift away from reality.
- Collapse is not certain. A 2024 follow-up found that keeping real data and adding synthetic data on top, rather than replacing it, avoided collapse in their tests.
- About half of new English articles are primarily AI-generated, per Graphite's May 2026 study. Ahrefs found AI content in 74.2% of 900,000 new pages from April 2025.
- No AI search vendor documents a filter that removes AI-written pages. Perplexity documents filters for non-responsive and stale content, then relevance rerankers.
- Research cuts both ways: neural rankers can favor LLM-written text, while LLM rankers suppress junk better than keyword ranking. "Rerankers filter generic AI content" is a hypothesis, not a fact.
- Google's information gain patent scores documents by what they add beyond pages a user has already seen. A patent is not proof Google uses it.
- The moat is first-party information: company facts, integration specs and benchmarks with a published method. AI tools can speed up the writing, but those facts must come from you.

## What Model Collapse Is, in Plain Terms

The paper is "AI models collapse when trained on recursively generated data," by Ilia Shumailov and co-authors, published in *Nature* on 24 July 2024. Its abstract states the core finding: "indiscriminate use of model-generated content in training causes irreversible defects in the resulting models, in which tails of the original content distribution disappear."

The "tails" are the rare parts of the data. They are unusual facts, minority views and low-frequency events. A model sees them less often, so it reproduces them less faithfully. Train the next model on that output and the rare parts shrink again. Repeat, and they're gone.

### What the Nature paper tested

The authors showed the effect in three kinds of models: Gaussian mixture models, variational autoencoders and a language model. For the language test, they fine-tuned Meta's OPT-125m on wikitext2, a set of Wikipedia articles. Each new generation was then trained on text written by the generation before it.

The results were measured in perplexity, a score where lower means the model predicts real text better. With no original data kept, the models lost "from 20 to 28 perplexity points" of performance. When 10% of the original data was mixed back in at each generation, the paper reports "only minor degradation."

The most quoted example is the text itself. The prompt was about 14th-century church towers. By generation 9, the model wrote about "black-tailed jackrabbits, white-tailed jackrabbits, blue-tailed jackrabbits" and more colors of jackrabbit.

### Early and late model collapse

The paper splits model collapse into two stages:

1. **Early collapse.** The model "begins losing information about the tails of the distribution." Output still looks fine. The rare material is quietly missing.
2. **Late collapse.** The model converges to something with "little resemblance to the original one, often with substantially reduced variance." Output gets repetitive and wrong.

### Why model collapse isn't a certainty

The Nature experiments replaced old data with new synthetic data at each step. A 2024 paper by [Gerstgrasser and colleagues](https://arxiv.org/abs/2404.01413) tested the other case. They confirmed that "replacing the original real data by each generation's synthetic data does indeed tend towards model collapse." But when synthetic data accumulated alongside the original real data, it "avoids model collapse," across several model sizes and types.

So the risk depends on how labs build training sets, which they don't publish in detail. The Nature authors drew a lesson that matters for publishers: "the value of data collected about genuine human interactions with systems will be increasingly valuable in the presence of LLM-generated content."

### What model collapse is not

Model collapse describes training. It does not describe how Google ranks a page or how ChatGPT picks a citation. No search engine has said it demotes a page because of model collapse, and the paper makes no claim about search ranking. When you read that model collapse "kills AI content in search," that's a stretch. The honest link is narrower: first-hand human data is getting scarcer relative to synthetic text, so it's worth more. The rest of this post is about where that scarcity shows up in search.

![What Is AI Model Collapse? Why AI Could Forget Reality](youtube:uhWFLmr7xao "IBM's Meenakshi Kodati explains model collapse, why synthetic data can distort future models, and how data quality and human-written content help.")

## How Much of the Web Is Synthetic Now?

Three large studies give a picture, each using AI detectors, which are imperfect. Treat the numbers as directions, not exact counts.

| Study | Sample | Finding |
| --- | --- | --- |
| [Graphite, May 2026](https://graphite.io/five-percent/research/ai-now-writes-as-many-online-articles-as-humans-do) | 55,400 English articles from Common Crawl, three detectors | Primarily AI-generated share: 35.9% a year after ChatGPT launched, 49.9% in Q1 2026 |
| [Ahrefs, May 2025](https://ahrefs.com/blog/what-percentage-of-new-content-is-ai-generated/) | 900,000 pages created in April 2025 | 74.2% contained some AI-generated content |
| [Graphite, October 2025](https://graphite.io/five-percent/ai-content-in-search-and-llms) | Articles from Google results for 31,493 keywords, plus ChatGPT and Perplexity citations | 86% of articles in Google results and 82% of ChatGPT and Perplexity citations were human-written |

The first two rows measure what gets published. The third measures what gets surfaced. The gap between them is the interesting part: in Graphite's October 2025 data, AI-generated articles were about half of what was published but 14% of what ranked in Google, and only 7% of the articles in position one.

A newer [Ahrefs study from July 2026](https://ahrefs.com/blog/google-doesnt-punish-ai-content/) found a gentler slope. Of pages in Google's top three, 5.3% scored as 100% AI-generated. Pages with less than half AI content held 82.2% of top-three spots. Ahrefs saw "no obvious hard cutoffs suggesting a binary AI classifier." Performance simply got worse as AI share rose, which the author puts down to quality, not detection.

Sources disagree on AI answers too. Graphite's [June 2026 simulation study](https://graphite.io/five-percent/research/ai-search-collapse) found that 42.7% of the pages ChatGPT cited for its question set in June 2026 were predicted to be AI-generated, up from 38.9% in January. Its set leaned on questions about named entities, such as products or people, where AI-written pages were more common (45.8%) than for editorial questions (27.5%). Different questions, detectors and dates give different shares.

## The Saturation Stack: Four Places Synthetic Content Meets Search

"Synthetic content saturation" is easier to reason about when you split it by layer. We call this the Saturation Stack. Each layer has different evidence, and only some of it is documented by the vendors themselves.

| Layer | What synthetic saturation does there | Best evidence | Evidence type |
| --- | --- | --- | --- |
| Training | Models trained on their own output lose rare facts (model collapse) | Shumailov et al. 2024; Gerstgrasser et al. 2024 | Peer-reviewed lab experiments |
| Index | Search engines demote or remove unoriginal pages made at scale | Google's spam policies and its 2024 update results | Vendor policy and vendor-reported results |
| Retrieval and reranking | Rankers score relevance; some favor LLM-written text; near-duplicates compete for few slots | Perplexity's pipeline write-up; Dai et al. 2024; Yu et al. 2026 | Vendor docs plus research |
| Answer | Engines cite AI-written pages; in simulations, answers converge when AI retrieves its own writing | Graphite 2026 | Industry research, simulation |

### Training layer

This is where model collapse lives. You can't control what any lab trains on. What you can control is whether your facts exist on the open web in a form that isn't a copy of someone else's. If they don't, no training run can learn them, collapsed or not. See our glossary entry on [LLM training data](/glossary/llm-training-data) for how that data is gathered.

### Index layer

This is the best-documented layer, because Google publishes its rules. Its [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), last updated 28 August 2026, define scaled content abuse as "when many pages are generated for the primary purpose of manipulating search rankings and not helping users." The same page now says spam includes "attempting to manipulate generative AI responses in Google Search."

Google says its March 2024 changes cut "low-quality, unoriginal content in search results" by 45%, [per its own update note](https://blog.google/products/search/google-search-update-march-2024/). That's a vendor claim, not an audit, but it tells you where the index layer points: against unoriginal pages at volume, however they were made. Our glossary covers [scaled content abuse](/glossary/scaled-content-abuse) in depth.

### Retrieval and reranking layer

Perplexity has described its ranking stack in more detail than most engines. In its [September 2025 write-up](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api), it describes "prefiltering stages" that "remove clearly non-responsive or stale content," then "multiple stages of progressively advanced ranking," ending with "cross-encoder reranker models." A [reranker](/glossary/reranking) is a model that rescores a short list of results by how well each one answers the query. Nothing in the write-up mentions detecting AI authorship. Our [Perplexity guide](/ai-seo/perplexity) covers the rest of that pipeline.

### Answer layer

The last layer is what the engine writes. Graphite's June 2026 study ran 1,528 simulations with three LLMs and 1,019 prompts. When a model retrieved pages it had written itself, 79.6% of simulations ended in collapse, meaning nearly the same answer every time. Graphite calls this AI search collapse, a retrieval cousin of model collapse rather than the same thing. The authors are clear that this is a simulation and does not prove it is happening in live products.

## Do Rerankers Filter Out Generic AI Content?

A popular claim in AI SEO is that retrieval rerankers filter out generic AI articles. That's worth testing against what's published, because the evidence is mixed and partly points the other way.

### What would support the idea

- **LLM rankers catch bad content better.** In a 2026 paper at The Web Conference, [Yu and colleagues](https://arxiv.org/abs/2602.16136) planted adversarial content in a search pool. Keyword ranking (BM25) exposed about 19% of the harmful content, while "LLM-based rankers demonstrated stronger suppression capabilities."
- **Agents get taught to prefer primary sources.** Anthropic [reported](https://www.anthropic.com/engineering/multi-agent-research-system) that its early research agents "consistently chose SEO-optimized content farms over authoritative but less highly-ranked sources like academic PDFs or personal blogs." It fixed this with "source quality heuristics" in the prompts, and grades outputs on whether they used "primary sources over lower-quality secondary sources."
- **Retrieval research penalizes repeats.** Context windows hold only so many passages. A 2024 paper on [relevant information gain](https://arxiv.org/abs/2407.12101) argues it's "important to avoid occupying context window space with redundant information," a goal older methods such as Maximal Marginal Relevance also target.

### What cuts against it

- **Neural rankers can prefer LLM text.** A KDD 2024 paper by [Dai and colleagues](https://arxiv.org/abs/2310.20501) found that "neural retrieval models tend to rank LLM-generated documents higher," and that the bias extends to second-stage rerankers. Their explanation: LLM text has "more focused semantics with less noise."
- **Polished synthetic content can take over.** In Yu's SEO scenario, when 67% of the pool was AI-written, over 80% of the retrieved results were AI-written, while answer accuracy looked stable.
- **ChatGPT cites AI-written pages.** Graphite's June 2026 data found that "it does not appear that ChatGPT is filtering out AI-generated references now."

### The accurate version

No vendor documents an AI-detection filter in its reranker. The evidence supports a narrower claim, and it's labelled here as inference. Generic pages lose less because they are detected and more because they are substitutable. When ten pages make the same point, a system that avoids redundancy needs one of them, and it can pick any. Your page wins that slot only by carrying something the other nine don't.

Rankbox's own experiment points the same way at the passage level. In [Vector Distance vs. Keyword Density](/blog/vector-distance-vs-keyword-density), a definition sentence moved retrieval similarity about 3.2 times as much as a keyword mention (median of 8 open embedding models), and repeats stopped helping after the second mention. That measured open models, not any product's ranking, but it fits the pattern: substance moves scores, repetition doesn't.

## Information Gain: What the Patent Says and Doesn't Prove

"Information gain" in SEO comes from a Google patent, [US11354342B2](https://patents.google.com/patent/US11354342B2/en), "Contextual estimation of link information gain." Google filed it on 18 October 2018 and it was granted on 7 June 2022. The inventors are Victor Carbune and Pedro Gonnet Anders.

### What the claims describe

The first claim describes an automated assistant that has already shown a user information from some documents on a topic. For each new document on that topic, it computes an information gain score based on "a quantity of new information included in the given new document" that differs from what the user has already seen. It then picks a document and presents information from it.

Three details matter:

1. **The score is relative.** It compares a new document with documents this user has already seen, not with the whole web.
2. **It's framed around an assistant.** The claims describe answering "free form natural language input," which is closer to AI search than to ten blue links.
3. **It's a patent, not a product.** Google's John Mueller [said in 2021](https://www.searchenginejournal.com/google-patents-are-not-always-used-in-search/395383/) that "just because it's patented from Google ... doesn't mean that we actually use it in search." Google hasn't said this system runs anywhere.

### What Google does confirm

The principle is on the record even if the patent isn't. Google's [guide to optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), updated in July 2026, tells site owners: "Don't just recycle what others on the internet have already said, or could easily be produced by a generative AI model." It contrasts commodity content, "7 Tips for First-Time Homebuyers," with a first-hand piece, "Why We Waived the Inspection & Saved Money." Our [information gain](/glossary/information-gain) entry has more on the patent.

## The Information Gain Moat: Facts Only Your Company Holds

This is the model collapse moat in practical form. The scarcer first-hand information becomes, the more a page that carries it stands out. A moat, here, is information that a competitor or a model can't produce without you. Three kinds matter most for a B2B company: proprietary company facts, integration specs and verifiable benchmarks. Here's how each looks for Tallyfold, a made-up invoicing and payments app for agencies (its rivals Brindlework and Kestrelyn are made up too).

| Moat asset | Tallyfold example (fictional) | Who has to supply it | How a reader checks it | Refresh |
| --- | --- | --- | --- | --- |
| Company facts | Plan prices, payout timing, supported currencies, limits | Tallyfold's team | Dated pricing and docs pages | On every change |
| Integration specs | Which accounting tools sync, which fields map, webhook retry rules | Tallyfold's engineers | Public API docs and changelog | Each release |
| Benchmarks | Time to reconcile 200 invoices, with the test setup | Tallyfold runs the test | Published method and raw numbers | Quarterly |
| Aggregate usage data | Median days from invoice sent to paid, anonymized | Tallyfold's data team | Sample size, date range, definitions | Quarterly |
| Field experience | What broke when an agency moved over from Brindlework, and the fix | Tallyfold's support team | Named author, date | As it happens |

### Company facts

These are the facts AI answers most often get wrong because nobody states them plainly. If Tallyfold charges per invoice above a limit, the exact limit and price belong on a dated page. No research tool can find a number that was never published.

### Integration specs

Specs are the most copy-proof asset a B2B product has. "Syncs with your accounting software" is commodity. "Syncs paid invoices to the ledger within five minutes, maps 14 fields, retries failed webhooks three times" is a moat, if it's true. Specs must come from the people who built the integration. Never let a writer, human or AI, guess them.

### Benchmarks you can verify

A benchmark is only worth citing if a reader could repeat it. Publish the setup, the sample, the date and the raw numbers, and say what you didn't test. A benchmark that claims "3x faster" with no method is a claim, not evidence, and careful engines and readers treat it that way.

For how to lay these facts out so engines can quote them, see our [section-by-section template for AI citation](/blog/how-to-write-blog-posts-for-ai-citation).

## The Moat Ledger: Score a Draft Before It Ships

The Moat Ledger is our method for measuring information gain on a single draft. It takes about 30 minutes for a 2,500-word article.

1. **List every claim.** One row per factual statement. Skip transitions and opinions.
2. **Tag each claim.** C is commodity: it appears in three or more of the top results, or in the AI answer for the query. S is sourced: a public fact with a citation, useful but copyable. P is proprietary: only your company could publish it.
3. **Compute the moat share.** P claims divided by all claims.
4. **Check placement.** Every H2 section needs at least one P claim, and the opening answer needs one too, because engines lift passages, not pages.
5. **Fix or hold.** If the moat share is under 20%, or any section has no P claim, add first-party facts or cut commodity claims before you publish.

The 20% line is our rule of thumb for this method, not a measured threshold. It's there to force a decision, not to predict a ranking.

### Worked example: Tallyfold's invoicing article

Tallyfold drafts "How to automate agency invoicing" from web research alone. The draft reads well. The ledger tells a different story.

| Tag | Before: claims | Before: share | After: claims | After: share |
| --- | --- | --- | --- | --- |
| C (commodity) | 30 | 75.0% | 21 | 45.7% |
| S (sourced) | 7 | 17.5% | 10 | 21.7% |
| P (proprietary) | 3 | 7.5% | 15 | 32.6% |
| Total | 40 | 100% | 46 | 100% |

Before editing, the moat share is 3 ÷ 40 = 7.5%, and five of the seven H2 sections have no P claim at all. Anyone could publish this article, and a model could write it from memory.

The team then makes three changes:

1. **Adds 12 P claims** from its own records: the invoice limit on each plan, the three accounting tools it syncs with and the fields each maps, the webhook retry rule, and a reconciliation test on 200 sample invoices with its setup written out.
2. **Adds 3 S claims** that source the test method and two public facts the new sections rely on.
3. **Cuts 9 C claims** that repeated generic tips already covered in every top result.

After editing, the moat share is 15 ÷ 46 = 32.6%, and every section carries at least one P claim. The commodity share falls from 75.0% to 45.7%. All numbers here are illustrative, for a made-up company. The method is the point.

## How Rankbox Fits Into the Moat

Rankbox supplies the speed, not the moat. Its [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000–3,500-word, source-backed articles, which covers the C and S rows of the ledger. [Brand Voice](/features/brand-voice) applies the tone, audience, style rules and product details you give it, and mentions your product where it fits. So if you enter Tallyfold's plan limits and sync rules there, drafts can use them.

What Rankbox doesn't do matters just as much. It doesn't import proprietary data, run benchmarks, invent integration specs, track AI citations or publish straight to a CMS. The P claims have to come from you, and a person should check each one. Finished articles reach your site through the [Rankbox API](/integrations/api), which a developer wires in, on the Business plan at $49.50 a month with a 7-day trial. See [pricing](/pricing) for details.

## Frequently Asked Questions

### What is model collapse in AI?

Model collapse is the loss of quality that happens when AI models are trained on text generated by earlier models. Shumailov and colleagues, in Nature in 2024, showed that rare information disappears first ("early collapse"), and later generations drift toward repetitive, wrong output ("late collapse"). A 2024 follow-up found that keeping real data alongside synthetic data avoided it in their tests.

### Does model collapse affect SEO or search rankings?

Model collapse does not directly affect search rankings. It's a training-data effect, and no search engine says it demotes pages because of it. The related risk for SEO is different: Google's spam policies target unoriginal pages made at scale, and generic articles are easy for any engine to swap for another page that says the same thing.

### Are automated blog posts effective for SEO?

Sometimes. Automated or AI-written posts can rank when each one adds real value and a person checks it. They fail when used to mass-produce interchangeable pages, which Google treats as scaled content abuse. Our full answer covers [what Google says about automated blog posts](/blog/are-automated-blog-posts-effective-for-seo) and the evidence on how they perform.

### Is information gain a Google ranking factor?

Information gain is not a confirmed ranking factor. The term comes from a Google patent, US11354342B2, granted in June 2022, which scores documents by what they add beyond pages a user has already seen. Google hasn't said it uses that system. It does publicly advise creating "non-commodity content" that goes beyond what others have already said.

### Do AI search engines filter out AI-generated content?

No AI search vendor documents a filter that removes AI-generated content. Perplexity describes filters for non-responsive and stale content, then relevance rerankers. Research shows neural rankers can even favor LLM-written text, and a June 2026 study found ChatGPT citing AI-written pages. Generic pages mostly lose because they add nothing a competing page lacks.

### How do I write blog posts that AI engines cite?

Lead each section with a direct answer, define your terms, and include facts only your company can supply, such as dated prices, specs and test results with a method. Then add a clear sources list. Our [section-by-section template](/blog/how-to-write-blog-posts-for-ai-citation) shows each part with an example.

## References

1. [AI models collapse when trained on recursively generated data, Nature (Shumailov et al., 2024)](https://www.nature.com/articles/s41586-024-07566-y)
2. [Is Model Collapse Inevitable? Breaking the Curse of Recursion by Accumulating Real and Synthetic Data, arXiv (Gerstgrasser et al., 2024)](https://arxiv.org/abs/2404.01413)
3. [AI Now Writes as Many Online Articles as Humans, Graphite (May 2026)](https://graphite.io/five-percent/research/ai-now-writes-as-many-online-articles-as-humans-do)
4. [74% of New Webpages Include AI Content (Study of 900k Pages), Ahrefs](https://ahrefs.com/blog/what-percentage-of-new-content-is-ai-generated/)
5. [How Does AI-Generated Content Perform in Search and Answer Engines?, Graphite (October 2025)](https://graphite.io/five-percent/ai-content-in-search-and-llms)
6. [Google Doesn't Punish AI Content; It Punishes Bad Content (331k Pages Studied), Ahrefs (July 2026)](https://ahrefs.com/blog/google-doesnt-punish-ai-content/)
7. [AI Search Collapse: AI Responses Collapse When AI Retrieves Its Own Generations, Graphite (June 2026)](https://graphite.io/five-percent/research/ai-search-collapse)
8. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
9. [New ways we're tackling spammy, low-quality content on Search, Google](https://blog.google/products/search/google-search-update-march-2024/)
10. [Architecting and evaluating an AI-first Search API, Perplexity Research](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api)
11. [Retrieval Collapses When AI Pollutes the Web, WWW '26 (Yu, Kim and Kim)](https://arxiv.org/abs/2602.16136)
12. [How we built our multi-agent research system, Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)
13. [Better RAG using Relevant Information Gain, arXiv (Pickett et al., 2024)](https://arxiv.org/abs/2407.12101)
14. [Neural Retrievers are Biased Towards LLM-Generated Content, KDD 2024 (Dai et al.)](https://arxiv.org/abs/2310.20501)
15. [US11354342B2: Contextual estimation of link information gain, Google Patents](https://patents.google.com/patent/US11354342B2/en)
16. [Google: Patents Are Not Always Used in Search, Search Engine Journal](https://www.searchenginejournal.com/google-patents-are-not-always-used-in-search/395383/)
17. [Google's Guide to Optimizing for Generative AI Features on Google Search, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
