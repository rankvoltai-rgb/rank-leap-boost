---
title: How Does RAG Reduce Hallucinations Compared to Traditional Language Models?
description: How RAG and grounding reduce hallucinations compared to traditional language models, what the studies measured, and where retrieval still gets facts wrong.
keyword: reduce hallucinations
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Research
---

Retrieval-augmented generation (RAG) helps a model reduce hallucinations by making it look up relevant text before it answers, then write from that text instead of from memory alone. A traditional language model answers closed book, rebuilding facts from patterns stored in its weights, while a RAG system answers open book, and in one controlled study that cut hallucinated replies from 68% to 8%.

It doesn't bring errors to zero. Retrieval can fetch the wrong page, pages that disagree, or no useful page at all, and the model may still guess. Commercial RAG tools built to reduce hallucinations still hallucinated on one legal query in six to one in three in a 2025 study.

That gap matters for brands, because ChatGPT search, Perplexity, Google's AI Overviews and Copilot all retrieve pages before they answer. When the fact a buyer asks about isn't on any page they can find, they fill the hole with something else. Our guide to [hallucination by omission and why a clear pricing page matters](/blog/hallucination-by-omission-pricing-page) covers that business risk. This post is the technical side.

## Key Takeaways

- RAG adds a search step. The model retrieves passages and writes from them, rather than relying only on facts stored in its weights.
- In a 2021 study, adding retrieval cut the share of chatbot replies with a false claim from 68.2% to 7.9%. On short factual questions, OpenAI reported 38% accuracy for GPT-4o and 90% for its search-enabled version.
- Retrieval can reduce hallucinations most for rare facts. On the least-known subjects, a small model with retrieval beat a far larger model answering from memory.
- RAG still fails when retrieval misses, when sources conflict, or when no retrieved page holds the answer. Three commercial legal RAG tools hallucinated on 17% to 33% of queries.
- Retrieved answers change when the search index changes. Weights change only when the vendor retrains.
- For a brand, the rule is simple: if the fact isn't on a page an engine can retrieve, the engine uses whatever page it can find.

## Open Book vs Closed Book: What RAG Changes

The difference between the two approaches is where the facts live at the moment of answering.

### How a traditional language model answers

A traditional [large language model](/glossary/large-language-model) learns from a huge snapshot of text. What it learns is spread across billions of numbers called weights. Ask a question and it predicts a likely answer, word by word, from those weights. Nothing is looked up.

That works for facts that appear thousands of times in its [training data](/glossary/llm-training-data). It works badly for rare facts. In 2025, OpenAI researchers showed that a base model's hallucination rate on arbitrary facts should be at least the share of those facts seen only once in training ([Kalai et al.](https://arxiv.org/abs/2509.04664)). Their example: if 20% of birthday facts appear once, expect at least 20% of birthday answers to be wrong. The model also has a [knowledge cutoff](/glossary/knowledge-cutoff), so anything that changed after training is invisible to it.

### What retrieval adds

[Retrieval-augmented generation](/glossary/retrieval-augmented-generation) puts a lookup in front of the answer. The name comes from a [2020 NeurIPS paper](https://arxiv.org/abs/2005.11401) by Patrick Lewis and colleagues. Their system paired a text generator, which they called parametric memory, with a searchable index of 21 million Wikipedia passages, the non-parametric memory. For each question, a retriever pulled the closest passages and the generator wrote its answer with them in view.

AI search engines apply the same idea to the web, a process usually called [grounding](/glossary/grounding). OpenAI's help center says ChatGPT ["may search the web automatically"](https://help.openai.com/en/articles/9237897-chatgpt-search) when a question needs current information, and answers that use search can cite what it found. Pipelines differ by engine, but the order is Lewis's: look it up, then answer. That order is what lets search reduce hallucinations on fresh facts.

![What is Retrieval-Augmented Generation (RAG)?](youtube:T-D1OfcDW1M "IBM Senior Research Scientist Marina Danilevsky explains how RAG gives a model up-to-date facts and a source it can point to.")

## How Much Does RAG Reduce Hallucinations? What the Studies Measured

The short answer is "a lot, on the right questions." No single percentage applies, because each study measured a different task. Here is how far retrieval managed to reduce hallucinations in published tests, with their setups.

| Study (year, venue) | Task measured | Without retrieval | With retrieval |
| --- | --- | --- | --- |
| Lewis et al. (2020, NeurIPS) | Jeopardy questions, 452 pairs judged by people | BART judged more factual in 7.1% of pairs | RAG judged more factual in 42.7% |
| Lewis et al. (2020, NeurIPS) | Natural Questions, exact-match score | 34.5 (T5-11B, closed book) | 44.5 (RAG-Sequence) |
| Shuster et al. (2021, Findings of EMNLP) | Knowledge chat: replies with a false claim | 68.2% (BART-Large) | 7.9% (FiD-RAG, 5 documents) |
| Mallen et al. (2023, ACL) | 4,000 least popular PopQA questions: accuracy | 19% (GPT-3 davinci-003) | Beaten by a 2.7B model with retrieval |
| OpenAI (March 2025, vendor post) | SimpleQA short facts: accuracy | 38% (GPT-4o) | 90% (GPT-4o search preview) |
| Magesh et al. (2025, Journal of Empirical Legal Studies) | 200+ legal research questions: answers with a hallucination | 43% (GPT-4) | 17% to 33% (three legal RAG tools) |

Read the table with three cautions.

1. **The OpenAI result is a vendor figure on a hard test.** SimpleQA was built so that ["most questions had to induce hallucinations"](https://openai.com/index/introducing-simpleqa/) from GPT-4o or GPT-3.5, so the 38% baseline is low by design. The 90% is from OpenAI's [March 2025 announcement](https://openai.com/index/new-tools-for-building-agents/).
2. **More retrieved text isn't always better.** In [Shuster et al.](https://aclanthology.org/2021.findings-emnlp.320/), 25 documents instead of 5 raised one model's hallucination rate from 7.9% to 19.8%. Their human checks covered 100 replies per model.
3. **The legal tools are the most realistic test.** [Magesh et al.](https://onlinelibrary.wiley.com/doi/abs/10.1111/jels.12413) preregistered their questions and tested paid products. Retrieval beat GPT-4, yet one tool still hallucinated on 33% of queries. An August 2026 preprint on eight legal RAG systems found rates [from under 10% to nearly half](https://arxiv.org/abs/2608.14210).

### Why rare facts gain the most

[Mallen et al.](https://arxiv.org/abs/2212.10511) sorted 14,000 questions by how famous their subject was. Bigger models got better at famous subjects but barely moved on obscure ones. On the 4,000 least popular questions, GPT-J 6B scored 16% and GPT-3 davinci-003 scored 19%. A 2.7-billion-parameter model with retrieval beat davinci-003 on those same questions.

Scale memorizes the famous; retrieval serves the long tail. Most facts about a company sit in that tail: its prices, plan limits, newest features and founding year. Few pages state them, and some are out of date. That is where RAG can reduce hallucinations the most, and where a missing page does the most harm.

## The Grounding Chain Check: Five Links Where RAG Still Fails

A grounded answer passes through five links, and retrieval can reduce hallucinations only while all five hold. Each break produces a different kind of wrong answer. We call this the Grounding Chain Check: use it to diagnose any answer about your brand that looks wrong.

| Link | What should happen | How it breaks | Published evidence | What a brand controls |
| --- | --- | --- | --- | --- |
| 1. Find | The engine retrieves pages on the question | It misses the right page or pulls a lookalike | Poor retrieval contributed to 47% of one legal tool's hallucinations ([Magesh et al.](https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf)) | A page whose title and first lines match the question |
| 2. Pick | It weighs the passages it found | A wrong or stale passage wins | Models adopted wrong retrieved facts over their own correct answer more than 60% of the time ([ClashEval](https://arxiv.org/abs/2404.10198)) | One current source; old copies updated or removed |
| 3. Read | It reads the passage | The fact is blocked, hidden in scripts or absent | Agent runs with access errors took 58% of content from third-party sites, against 12% without ([Siteline](https://siteline.ai/blog/ai-agent-software-benchmark/)) | Server-rendered HTML that AI crawlers may fetch |
| 4. Answer | It says only what the passages support | It guesses when no passage holds the answer | Given documents without the answer, the best model declined only 45% of the time ([RGB](https://arxiv.org/abs/2309.01431)) | The fact stated plainly, so nothing is left to guess |
| 5. Cite | Each claim links to a source that backs it | The link doesn't support the sentence | 51.5% of sentences fully supported by their citations ([Liu et al.](https://aclanthology.org/2023.findings-emnlp.467/)) | One claim per sentence, near the top of the page |

Even with the right document in hand, models add details it doesn't contain. On Vectara's [hallucination leaderboard](https://github.com/vectara/hallucination-leaderboard), updated 22 September 2026, 108 models did so in 1.8% to 24.2% of summaries (median near 9.5%). And OpenAI's researchers note that grading ["still rewards guessing whenever search fails to yield a confident answer"](https://arxiv.org/abs/2509.04664).

Live products show the same breaks. When the [EBU and BBC](https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants) had journalists check 2,709 news answers from ChatGPT, Copilot, Gemini and Perplexity in 2025, 45% had a significant issue, most often sourcing. In medicine, [SourceCheckup](https://www.nature.com/articles/s41467-025-58551-6) found about 30% of GPT-4o's statements unsupported by its sources, with web search on.

### A worked example: one price, five links

Plannora is a made-up project management tool whose Team plan costs $10 per user per month. A buyer asks: "How much does Plannora cost for 40 users?"

1. **Find:** the engine searches for Plannora pricing and gets Plannora's pricing page and a 2024 review on stackreview.co, a made-up review site.
2. **Pick:** both look relevant, so both are passed to the model.
3. **Read:** the pricing page draws its plan table with JavaScript. The fetch returns headings and no numbers. The review says $12 per user.
4. **Answer:** the only number in view is $12, so the answer says 40 users cost $480 a month.
5. **Cite:** the citation points to the review, and the review really does say $12.

The true figure is 40 × $10 = $400 a month, so the answer is $80 too high. The engine did nothing unusual, and its citation is honest. The weak link was Read, and the fix sits on Plannora's own site: put the price in the page's HTML as a plain sentence, then ask stackreview.co to update the old review.

## Retrieval Updates in Weeks, Weights Wait for Retraining

The Lewis paper has a neat test of this. The team built two indexes, from 2016 and 2018 Wikipedia dumps, and asked about 82 world leaders who had changed. With the matching index, the model named the right leader 70% of the time for 2016 and 68% for 2018. With the mismatched index, accuracy fell to 12% and 4%. Swapping the documents updated the answers, with no retraining at all.

| Layer | Where the facts live | When it changes | Your lever |
| --- | --- | --- | --- |
| Model weights | Numbers learned in training | Only when the vendor retrains, on its own schedule | Be described consistently across the web before the next training run |
| Search index | Pages the engine has crawled | When pages are recrawled and reindexed, typically days to weeks | Publish, correct and resubmit pages |
| The answer | Assembled at question time | Can differ on every run | Check many runs, not one screenshot |

So publishing or fixing a page changes what retrieval-based answers can find, once the engine recrawls it. It does not change what the model learned. Answers given without a search still come from the weights, which update only when the vendor trains a new model. Our guide to [Bing Webmaster Tools and AI indexing](/blog/bing-webmaster-tools-ai-indexing-guide) covers getting a changed page recrawled sooner.

Fine-tuning is a poor way to reduce hallucinations about new facts. In an [EMNLP 2024 study](https://arxiv.org/abs/2405.05904), new facts taught this way were learned slowly and raised the model's tendency to hallucinate. For fresh, specific facts, retrieval is the better tool.

## What This Means for Your Brand: The Page Has to Exist

RAG can only reduce hallucinations when there is something correct to retrieve. If your price, plan limits or feature list aren't on a page an engine can fetch, the Find and Read links return whatever else exists: review sites, old announcements, reseller listings, rival comparisons. In Siteline's June 2026 benchmark of 100 B2B software products, [14% disclosed no prices](https://siteline.ai/blog/ai-agent-software-benchmark/) on any plan. Our playbook on [pricing pages and hallucination by omission](/blog/hallucination-by-omission-pricing-page) shows what to publish instead, even when enterprise deals are quoted by hand.

Five habits keep the chain intact and reduce hallucinations about your brand:

1. **Give every checkable fact its own page:** pricing, plans, integrations, security, comparisons.
2. **Serve it as HTML,** not a script-drawn table or an image.
3. **Write facts as dated sentences:** "Team costs $10 per user per month, billed annually, as of September 2026."
4. **Update or retire stale copies** of the fact on your own site first, then ask third parties to fix theirs. Our [guide to fixing incorrect brand facts in LLM citations](/blog/how-to-fix-incorrect-brand-facts-in-llm-citations) has the report-and-recheck steps.
5. **Recheck across many runs.** Score correctness with the Accuracy Rate from our [GEO metrics framework](/blog/geo-metrics-framework), using the clean-session method in our [15-minute AI mention audit](/blog/how-to-see-if-ai-mentions-your-brand).

Rankbox helps with the writing side of the first and third habits. [Answer-Space Research](/features/answer-space-research) maps the questions buyers ask ChatGPT, Perplexity and Google, and the [Citation-Ready Writer](/features/citation-ready-writer) writes source-backed articles that answer them, delivered to your site through Rankbox's API. Rankbox doesn't track what AI engines say about you, so pair it with the checks above. The Business plan is $49.50 a month with a 7-day trial ([pricing](/pricing)).

## Frequently Asked Questions

### Does RAG eliminate hallucinations?

No. RAG can reduce hallucinations sharply, but it doesn't remove them. Commercial legal RAG tools still hallucinated on 17% to 33% of queries in a 2025 study, and models summarizing a supplied document add unsupported facts in roughly 2% to 24% of summaries.

### Why does RAG reduce hallucinations more for some questions than others?

RAG helps most with rare and recent facts, which a model can't reliably memorize. For famous subjects the model often already knows the answer, and retrieval adds little. Mallen et al. found retrieval can even hurt on popular questions when the retrieved text is misleading.

### Can RAG make an answer worse?

Yes. In an ACL 2023 study, retrieval turned right answers wrong on 10% of questions, usually when the top passage was off target. In ClashEval, models adopted wrong retrieved facts over their own correct knowledge more than 60% of the time.

### Is fine-tuning a better way to reduce hallucinations than RAG?

Not for new facts. An EMNLP 2024 study found models learn new facts through fine-tuning slowly, and that learning them raised the tendency to hallucinate. Retrieval is the better way to supply specific, changing facts such as prices.

### Does ChatGPT use RAG?

When it searches, yes in effect. OpenAI says ChatGPT may search the web automatically when a question needs current information, then cites sources. When it doesn't search, it answers from its weights, so the same question can get a sourced answer one time and a memory-based one the next.

### How can I tell if an AI answer came from retrieval or from memory?

Look for sources. A grounded answer usually shows citations or a sources panel, which tell you what the engine read. An answer with no sources likely came from the model's weights. Where a product allows it, run the question with search on and off and compare.

## References

1. [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, Lewis et al., NeurIPS 2020](https://arxiv.org/abs/2005.11401)
2. [Retrieval Augmentation Reduces Hallucination in Conversation (Shuster et al., Findings of EMNLP 2021)](https://aclanthology.org/2021.findings-emnlp.320/)
3. [When Not to Trust Language Models (Mallen et al., ACL 2023)](https://arxiv.org/abs/2212.10511)
4. [New tools for building agents, OpenAI, March 2025](https://openai.com/index/new-tools-for-building-agents/)
5. [Introducing SimpleQA, OpenAI](https://openai.com/index/introducing-simpleqa/)
6. [Hallucination-Free? Leading AI Legal Research Tools, Magesh et al., JELS 2025](https://onlinelibrary.wiley.com/doi/abs/10.1111/jels.12413)
7. [How Much Do Legal RAG Systems Still Hallucinate? (arXiv preprint, August 2026)](https://arxiv.org/abs/2608.14210)
8. [Benchmarking Large Language Models in Retrieval-Augmented Generation (Chen et al., AAAI 2024)](https://arxiv.org/abs/2309.01431)
9. [ClashEval (Wu, Wu and Zou, NeurIPS 2024 Datasets and Benchmarks)](https://arxiv.org/abs/2404.10198)
10. [Evaluating Verifiability in Generative Search Engines (Liu et al., Findings of EMNLP 2023)](https://aclanthology.org/2023.findings-emnlp.467/)
11. [SourceCheckup: how well LLMs cite medical references, Nature Communications 2025](https://www.nature.com/articles/s41467-025-58551-6)
12. [News Integrity in AI Assistants, EBU and BBC, October 2025](https://www.ebu.ch/research/open/report/news-integrity-in-ai-assistants)
13. [Hallucination Leaderboard, Vectara](https://github.com/vectara/hallucination-leaderboard)
14. [Why Language Models Hallucinate (Kalai et al., OpenAI, 2025)](https://arxiv.org/abs/2509.04664)
15. [Does Fine-Tuning LLMs on New Knowledge Encourage Hallucinations?, EMNLP 2024](https://arxiv.org/abs/2405.05904)
16. [How well do AI agents understand top software products?, Siteline, June 2026](https://siteline.ai/blog/ai-agent-software-benchmark/)
17. [Searching the web with ChatGPT, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
