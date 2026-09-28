---
title: Vector Distance vs. Keyword Density
description: Rankbox scored 263 test paragraphs with 8 embedding models, a reranker and BM25. Definitions beat keyword density, and repeats stopped paying after two.
keyword: keyword density
date: 2026-09-28
updated: 2026-09-28
author: Rankbox Team
tags: AI Search, Research
---

Vector distance measures how close a passage's meaning sits to a question's meaning. Keyword density measures how often one phrase repeats. When Rankbox scored 263 test paragraphs on 28 September 2026, eight open embedding models and a reranker rewarded definitions far more than repeats: per point of density, a definition sentence moved similarity 3.2 times as much as a keyword mention, and extra mentions stopped paying after the second one.

Only BM25 disagreed. It's a classic word-counting formula, the kind keyword density advice was built around, and it kept paying for every repeat.

That split matters because writing advice hasn't caught up. [Yoast SEO](https://yoast.com/what-is-keyphrase-density-and-why-is-it-important/) still gives a green light when a keyphrase fills 0.5% to 3% of a text, and tells the writer how many times to use it. At 3%, a 500-word post carries the phrase 15 times. Meanwhile, [Perplexity describes](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api) a search stack that retrieves by keywords and by meaning at once, then lets cross-encoder rerankers make the final cut. And [Google says](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) its AI systems "can understand synonyms and general meanings of what someone is seeking."

Below: both measures, how AI search retrieves passages, per-model results, a rule of thumb and the full method. For the wider craft of writing passages AI engines quote, see our guide to [optimizing content for AI search](/blog/optimize-content-for-ai-search).

Two companion guides cover the question side: [how AI search interprets user intent](/blog/how-does-ai-search-interpret-user-intent) and [how it uses intent and context](/blog/how-ai-search-uses-user-intent-and-context).

## Key Takeaways

- Per percentage point of density, a definition sentence moved cosine similarity 3.2 times as much as a keyword mention (median of 8 open embedding models). A cross-encoder reranker put the ratio at 6.6×. BM25 put it at 0.3×.
- Name it twice, then stop. Averaged over the 8 embedding models, the second mention gave the big lift and later ones were flat or slightly lower. BM25 rose with every repeat.
- Classic stuffing ("Best X. X guide. X tips. X 2026.") lowered the average score in 8 of 8 embedding models and in the reranker. A stuffing-tail paragraph was BM25's top pick for 72% of prompts, and the reranker's for 6%.
- On intent prompts, which describe the need without the keyword, each extra mention lowered similarity in all 8 embedding models.
- Repetition isn't poison. The definition-dense paragraph beat the stuffed one on 47–75% of all prompts, not all of them.
- The Twice-Four Rule replaces a keyword density target: in a passage of about 100 words, name the keyword twice and give four defining facts.
- These are similarity scores from open models, not rankings inside ChatGPT, Perplexity or Google, none of which names the embedding model behind its answers.

## What Vector Distance and Keyword Density Each Measure

### What an embedding is

An embedding is a list of numbers that stands for a piece of text. [OpenAI's embeddings guide](https://developers.openai.com/api/docs/guides/embeddings) defines it as "a vector (list) of floating point numbers" and adds that "the distance between two vectors measures their relatedness." Texts with similar meanings land near each other, even when they share few words. The eight models here turn each text into 384 to 1,024 numbers. See our glossary entry on [vector embeddings](/glossary/vector-embeddings).

![Transformers, the tech behind LLMs | Deep Learning Chapter 5](youtube:wjZofJX0v4M "3Blue1Brown shows how language models turn words into embedding vectors, and how directions in that space carry meaning.")

### What cosine similarity measures

Cosine similarity scores how closely two vectors point the same way. It is the cosine of the angle between them, as [Google's machine learning course](https://developers.google.com/machine-learning/clustering/dnn-clustering/supervised-similarity) explains. A score near 1 means two texts mean nearly the same thing. Lower scores mean they drift apart.

Google also notes that once vectors are scaled to length 1, as they were here, cosine similarity, dot product and Euclidean distance all rank results the same way. So "vector distance" and "cosine similarity" are two views of one measurement. The higher the similarity, the shorter the distance.

### What keyword density measures

Keyword density is the share of a text taken up by one phrase: mentions divided by total words, times 100. Yoast's own example is a 100-word text with 5 uses of the phrase, a density of 5%. The number says nothing about meaning. A paragraph can hit 3% with facts or with filler.

### Where keyword density came from

The habit comes from lexical ranking, which scores a page by the words it shares with the query. The Stanford textbook [Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/term-frequency-and-weighting-1.html) states the principle: a document that mentions a query term more often "has more to do with that query and therefore should receive a higher score."

BM25, the default scoring formula in [Elasticsearch](https://www.elastic.co/docs/reference/elasticsearch/index-settings/similarity), refines that idea. Its k1 setting "controls non-linear term frequency normalization (saturation)," so each repeat adds less than the one before. But each repeat still adds something. If the scorer counts words, repeating words looks like a lever, and that is the logic behind keyword density targets.

Google has pushed back for a long time. In an [August 2011 Google video](https://www.youtube.com/watch?v=Rk4qgQdp2UA), Matt Cutts, then head of Google's webspam team, said "the first one or two times you mention a word that might help with your rankings," and that after that there are "diminishing returns" ([transcript](https://www.searchenginejournal.com/ranking-factors/keyword-density/)). Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) now list "repeating the same words or phrases so often that it sounds unnatural" as keyword stuffing.

## How AI Search Retrieves Passages

An AI answer engine pulls a short list of passages from an index and writes from them. Pages are split into passages first, a step called [content chunking](/glossary/content-chunking), so each section competes on its own. Retrieval then runs in stages, from fast and rough to slow and precise.

### Dense retrieval matches by meaning

Dense retrieval embeds the question and every passage, then returns the passages whose vectors sit closest. In 2020, [Karpukhin and colleagues](https://arxiv.org/abs/2004.04906) showed that retrieval "can be practically implemented using dense representations alone." Their retriever beat a Lucene BM25 system by 9 to 19 points in top-20 passage accuracy. This experiment's eight embedding models stand in for this stage.

### Hybrid retrieval adds BM25 back

Meaning-based search has a blind spot: exact strings. [Google Cloud's docs](https://docs.cloud.google.com/vertex-ai/docs/vector-search/about-hybrid-search) say product numbers, SKUs, brand-new product names and internal codenames "don't work with semantic search" because the embedding model never saw them. The fix is hybrid search, which runs keyword and semantic search together and merges the two lists. The same page calls Google Search "one of the most popular hybrid search systems."

OpenAI's [Retrieval API](https://developers.openai.com/api/docs/guides/retrieval) exposes the same dial, letting developers weight "semantic embedding matches vs. sparse keyword matches." In Anthropic's [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) tests, pairing contextual embeddings with contextual BM25 cut the top-20 retrieval failure rate by 49%, from 5.7% to 2.9%.

### Rerankers read the question and the passage together

A reranker, or cross-encoder, is a second-stage model. It reads the question and the passage side by side and outputs one relevance score. The [bge-reranker-base model card](https://huggingface.co/BAAI/bge-reranker-base) puts it plainly: a reranker "uses question and document as input and directly output similarity instead of embedding." It suggests using one on the top documents an embedding model returns.

[Nogueira and Cho](https://arxiv.org/abs/1901.04085) showed in 2019 that BERT used this way beat the previous best on the MS MARCO passage task by 27% (relative). In Anthropic's tests, adding a reranker grew the failure-rate cut from 49% to 67%. More in our [reranking](/glossary/reranking) entry.

### What Perplexity, Google and ChatGPT publish about their pipelines

| Engine | What its own documentation says | What it doesn't say |
| --- | --- | --- |
| Perplexity | Its Search API write-up (September 2025) queries the index "via both modalities," lexical and semantic. Early ranking uses "lexical and embedding-based scorers," then "cross-encoder reranker models" make the final cut. | Which embedding or reranker models it runs |
| Google (AI Overviews, AI Mode) | Its AI optimization guide says these features are "rooted in our core Search ranking and quality systems." Google has described [neural matching](https://blog.google/products/search/how-ai-powers-great-search-results/) (2018) and BERT (2019) as part of Search. | Which models retrieve passages for AI answers |
| ChatGPT | OpenAI's [search help page](https://help.openai.com/en/articles/9237897-chatgpt-search) says ChatGPT "typically rewrites your query into one or more targeted queries" for its search partners. | How results are ranked, or which models score them |

So this experiment can't show how any one engine ranks your page. It shows how the two kinds of scorer these companies describe, meaning-based and word-counting, react to the same edits. Perplexity's full pipeline is broken down in our [Perplexity SEO guide](/ai-seo/perplexity).

## How AI Search Uses User Intent and Context

### How does AI search interpret user intent?

AI search turns a question into a representation of the need, then looks for passages close to that need, whether or not they repeat its words. Google described this in 2022: neural matching "looks at an entire query or page rather than just keywords." Its AI optimization guide says AI systems understand "synonyms and general meanings," so they can connect people "with content that might not use the same precise words." Our glossary entry on [search intent](/glossary/search-intent) covers the types of need.

The experiment's intent prompts test this. "What system can both heat and cool my house using only electricity?" never says "heat pump." On these 8 prompts, each definition sentence raised similarity in all 8 embedding models, and each step up in keyword density lowered it in all 8. The definitions described the need ("runs in reverse to cool"). The repeats didn't.

### How does AI search use context?

Context reshapes the question before retrieval starts. OpenAI's help page says that when ChatGPT search uses partner search providers, it typically rewrites your query into targeted queries. It may use saved memories when rewriting, and may use "an approximate location based on your IP address." Google's AI Mode uses [query fan-out](/glossary/query-fan-out), "breaking down your question into subtopics and issuing a multitude of queries simultaneously," as [Google announced in May 2025](https://blog.google/products/search/google-search-ai-mode-update/).

So your passage rarely competes against the user's exact words. It competes against rewritten sub-queries, each naming one slice of the need. A passage that defines the thing and gives a number is more likely to match those slices than one that repeats a phrase. Our [ChatGPT SEO guide](/ai-seo/chatgpt) shows what the rewrites look like.

## The Experiment: 263 Paragraphs, 32 Prompts, 10 Scorers

Rankbox built a test set in which only two things change: how many sentences define the topic (definition density) and how often the keyword repeats (keyword density).

1. **Eight topics**, each with a target keyword, from "heat pump" to "Roth IRA" and "vector database."
2. **32 prompts**, four per topic. Three contain the keyword, such as "What is a heat pump?" One is an intent prompt that describes the need without it.
3. **263 paragraphs** of 70–108 words. Each opens with the same lead sentence naming the keyword, then four sentences. Each is either filler (vague, no facts) or a definition (a concrete defining fact). Paragraphs carry 0 to 4 definitions.
4. **Keyword repeats** swap pronouns such as "it" for the exact keyword, one slot at a time, from 1 mention up to 5–7. Keyword density runs from 1.2% to 7.8%.
5. **A stuffing tail**, "Best KW. KW guide. KW tips. KW 2026.", added to the most repetitive paragraph at each definition level. With the tail, keyword density runs from 8.3% to 11.2%.
6. **Ten scorers**: eight open embedding models scored by cosine similarity, one cross-encoder reranker and BM25.

Here are the two paragraphs at the heart of the head-to-head test, from the heat pump topic. The definition-dense version has four definitions and one mention:

> Here is a short guide to the heat pump. It is an electric appliance that moves heat between indoors and outdoors instead of burning fuel. In winter it pulls heat from outdoor air or the ground, and in summer it runs in reverse to cool. Because it moves heat rather than creating it, it can deliver three to four units of heat per unit of electricity. Cold-climate models keep heating efficiently at outdoor temperatures well below freezing.

The keyword-stuffed version has no definitions, every slot filled with the keyword, and the tail:

> Here is a short guide to the heat pump. A heat pump is getting plenty of attention from homeowners who want to upgrade their homes this year. Many people who install a heat pump say they only wish they had done it years earlier. A heat pump can be a great choice, but it pays to do your homework before you buy a heat pump. There are lots of options on the market, so finding the right heat pump for your home is possible. Best heat pump. Heat pump guide. Heat pump tips. Heat pump 2026.

Scores are compared within each prompt as z-scores (standard deviations from that prompt's mean), so models on different scales can be averaged. The full method is at the end.

## What the Scores Showed

![Scatter map of the llms.txt topic embedded with bge-base-en-v1.5: four prompts and 28 paragraphs fall into five tight clusters by number of definitions, and the intent prompt sits apart from the other three](figure:study/embedding-map "One topic and one model, projected to two dimensions that carry 55% of the variance, so distances are approximate. Keyword repeats barely move a dot. Definitions move the whole cluster.")

In this topic, with bge-base-en-v1.5, mean similarity to the three keyword prompts rose from 0.773 with no definitions to 0.820 with four. Similarity to the intent prompt rose from 0.568 to 0.610.

### Finding 1: definitions moved similarity 3.2× as much as keyword density

The table shows the change in cosine similarity when one filler sentence becomes a definition, and when one more pronoun becomes the keyword, across all 32 prompts. The last column compares one percentage point of definition density with one point of keyword density.

| Model | Per definition sentence | Per keyword mention | Ratio per density point |
| --- | --- | --- | --- |
| all-MiniLM-L6-v2 | +0.0145 | +0.0007 | Very large, unstable |
| gte-small | +0.0037 | +0.0008 | 3.9× |
| bge-small-en-v1.5 | +0.0071 | +0.0026 | 2.4× |
| bge-base-en-v1.5 | +0.0094 | +0.0047 | 1.8× |
| e5-base-v2 | +0.0055 | +0.0006 | 6.9× |
| nomic-embed-text-v1.5 | +0.0082 | +0.0053 | 1.5× |
| snowflake-arctic-embed-m-v1.5 | +0.0161 | +0.0069 | 2.1× |
| mxbai-embed-large-v1 | +0.0145 | +0.0027 | 4.4× |

- **The median ratio across the 8 models was 3.2×.** The plan behind this study predicted about 3×, so the hypothesis roughly held for embeddings.
- **The seven stable models ranged from 1.5× to 6.9×.** Without MiniLM, the median is 2.4×.
- **MiniLM's ratio is very large but unstable**, because its per-mention effect is close to zero.
- **The reranker put the ratio at 6.6×. BM25 put it at 0.3×**, which means keyword density won there.
- **Definition sentences raised similarity in all 8 models.** Extra mentions raised it too on average, but mostly through the first repeat (Finding 2), and they lowered it on intent prompts (Finding 4).

### Finding 2: past two mentions, keyword density stopped paying

This is the keyword-repeat curve: the mean z-score, averaged over all 8 embedding models and all 32 prompts, by number of mentions. Higher means closer to the prompt.

| Definitions | 1 mention | 2 | 3 | 4 | 5 | 6 | 7 | Most mentions + tail |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | −1.58 | −0.79 | −0.82 | −0.83 | −0.86 | −0.87 | n/a | −1.43 |
| 2 | −0.42 | +0.34 | +0.34 | +0.33 | +0.34 | +0.28 | +0.52 | +0.05 |
| 4 | −0.25 | +0.50 | +0.46 | +0.50 | +0.49 | +0.48 | n/a | +0.17 |

Not every topic reaches 6 or 7 mentions, so the rightmost columns average fewer paragraphs.

Going from one mention to two was the big lift: −1.58 to −0.79 with no definitions, and −0.25 to +0.50 with four. From the third mention on, the curve is flat or slightly lower. Now look at the vertical gap. The best filler score, −0.79, stays below every four-definition score in the table, the tail included. No amount of repetition closed it.

The reranker and BM25 drew very different curves (z-scores, mentions 1 to 6):

| Scorer | Definitions | 1 | 2 | 3 | 4 | 5 | 6 | With tail |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Reranker | 0 | −2.18 | −1.08 | −1.13 | −1.01 | −0.98 | −0.94 | −1.09 |
| Reranker | 4 | +0.31 | +0.73 | +0.49 | +0.46 | +0.50 | +0.39 | +0.09 |
| BM25 | 0 | −1.73 | −0.51 | −0.01 | +0.26 | +0.39 | +0.57 | +0.69 |
| BM25 | 4 | −1.06 | −0.12 | +0.29 | +0.52 | +0.67 | +0.96 | +0.89 |

With four definitions, the reranker also peaked at two mentions (+0.73, then +0.49 at three). With none, it crept up slightly after the third mention (−1.13 to −0.94) but never came near a four-definition score. BM25 has the opposite shape. It climbed with every repeat, and the tail sits at or near the top of its curve.

### Finding 3: stuffing lowered similarity everywhere except BM25

Adding the stuffing tail to the most repetitive filler paragraph lowered its average score in 8 of 8 embedding models, and in the reranker too. In the curve above, the tail column sits at −1.43 for filler, lower than every filler paragraph with two or more mentions. With four definitions it sits at +0.17, lower than every four-definition paragraph with two or more mentions.

BM25 went the other way. The tail raised its score, and a stuffing-tail paragraph was BM25's top-ranked result for 72% of prompts. The reranker put a stuffing-tail paragraph first for only 6% of prompts, and a paragraph with all four definitions first for 28%.

Outside research points the same way. In the [GEO paper](https://arxiv.org/abs/2311.09735) (KDD 2024), rewriting pages to add more query keywords did 10% worse than the unedited page on Perplexity.

### Finding 4: intent prompts punish keyword density

Split the prompts in two and the effect of a mention changes sign. The first two columns cover the 24 prompts that contain the keyword, the last two the 8 intent prompts.

| Model | Keyword prompts: per definition | Keyword prompts: per mention | Intent prompts: per definition | Intent prompts: per mention |
| --- | --- | --- | --- | --- |
| all-MiniLM-L6-v2 | +0.0098 | +0.0043 | +0.0287 | −0.0100 |
| gte-small | +0.0024 | +0.0015 | +0.0077 | −0.0014 |
| bge-small-en-v1.5 | +0.0047 | +0.0050 | +0.0145 | −0.0046 |
| bge-base-en-v1.5 | +0.0069 | +0.0080 | +0.0168 | −0.0052 |
| e5-base-v2 | +0.0044 | +0.0015 | +0.0091 | −0.0022 |
| nomic-embed-text-v1.5 | +0.0052 | +0.0089 | +0.0172 | −0.0056 |
| snowflake-arctic-embed-m-v1.5 | +0.0155 | +0.0103 | +0.0180 | −0.0032 |
| mxbai-embed-large-v1 | +0.0109 | +0.0045 | +0.0253 | −0.0028 |

On the intent prompts, higher keyword density lowered similarity: each extra mention cost points in 8 of 8 models, while each definition sentence raised it in 8 of 8. The reranker agreed: +1.195 per definition and −0.134 per mention, in its own logit units. BM25 still gave a mention a small positive weight on intent prompts (+0.069), but a definition carried far more (+0.496).

### Finding 5: definitions won head to head, with a catch

For each prompt, Rankbox compared the definition-dense paragraph (four definitions, one mention) with the keyword-stuffed one (no definitions, most mentions), with and without the tail. It also checked whether adding repeats to the definition-dense paragraph raised its score.

| Scorer | Beats stuffed: all | Beats stuffed: intent | Beats stuffed + tail | Repeats helped it: all | Repeats helped it: intent |
| --- | --- | --- | --- | --- | --- |
| all-MiniLM-L6-v2 | 69% | 88% | 84% | 63% | 0% |
| gte-small | 63% | 100% | 75% | 75% | 13% |
| bge-small-en-v1.5 | 59% | 100% | 66% | 72% | 13% |
| bge-base-en-v1.5 | 56% | 100% | 66% | 72% | 0% |
| e5-base-v2 | 72% | 100% | 84% | 50% | 0% |
| nomic-embed-text-v1.5 | 47% | 100% | 56% | 72% | 0% |
| snowflake-arctic-embed-m-v1.5 | 66% | 100% | 75% | 75% | 13% |
| mxbai-embed-large-v1 | 75% | 100% | 81% | 78% | 38% |
| bge-reranker-base | 72% | 100% | 72% | 56% | 25% |
| BM25 | 19% | 63% | 19% | 81% | 38% |

Each percentage is out of 32 prompts (all) or 8 prompts (intent).

The definition-dense paragraph won 88–100% of intent prompts in every embedding model, and 100% for the reranker. Across all 32 prompts, though, it won only 47–75% of the time in the embedding models.

That's the catch, and two things in the data help explain it. First, on prompts that contain the keyword, extra mentions still nudged similarity up slightly. In three models (bge-small, bge-base and nomic), one more mention moved keyword-prompt similarity a little more than one more definition did. Second, the definition-dense paragraph had only one mention, so it missed the second-mention lift from Finding 2. When repeats were added to it, its score rose on 50–78% of all prompts in the embedding models, but on only 0–38% of intent prompts.

So repetition isn't poison. It stops paying after the second mention, and it costs you on intent prompts. Definitions pay on every kind of prompt.

## The Twice-Four Rule: Name It Twice, Define It Four Times

The findings replace a keyword density target with one rule of thumb for a passage of about 100 words: **name the keyword twice, then define it four times.** Rankbox calls it the Twice-Four Rule.

- **Why twice.** The second mention gave the big lift in the averaged embedding curve and in the reranker. Past that, the embedding average was flat or slightly lower, and on intent prompts each extra mention cost similarity in every model.
- **Why four.** Each definition sentence raised similarity in all 8 embedding models, on keyword prompts and intent prompts alike. Four was the most the test used, so treat it as a target the data supports, not a proven peak.

Use this scorecard on any passage:

| Check | How to count it | Target per ~100 words |
| --- | --- | --- |
| Keyword mentions | The exact phrase, including the opening sentence | 2 |
| Definition sentences | Sentences that state what it is, how it works, a number, a named standard or a concrete example | 4 |
| Filler sentences | Sentences with no fact a reader could check | 0 |
| Stuffing lines | Tag-style fragments such as "Best X. X tips." | 0 |

The test set already holds a paragraph that follows the rule. It is the definition-dense heat pump paragraph above with one change: "It is an electric appliance" becomes "A heat pump is an electric appliance." That cell of the test (four definitions, two mentions) averaged a z-score of +0.50 across all 32 prompts and eight embedding models. The stuffed filler cell averaged −1.43. Those are averages over every prompt, not scores for this one paragraph, but the gap is almost two standard deviations.

### How to apply the rule to an existing page

1. **Split the page into passages** at each heading. Retrieval systems score passages, not whole pages.
2. **Count exact-phrase mentions** in each passage, by hand or with our free [Keyword Density Checker](/tools/keyword-density-checker). Turn any mention past the second back into "it" or a plain synonym.
3. **Keep the first mention in the opening sentence**, as every paragraph in the test did.
4. **Swap filler for facts:** what it is, how it works, a number, a named standard, a real example.
5. **Delete tag lines and stuffing tails** such as "Best X. X tips. X 2026."
6. **Test it against the intent version of the question**, the one that never names your keyword. If the passage still answers it, the definitions are working.

The rule was measured on passages of about 100 words. Applying it to each 100 words of a longer section is a reasonable extension, but this test didn't measure it.

## Where Keyword Density Still Matters

The data doesn't say to drop the keyword. It says to stop at two.

- **Lexical retrieval is still in the pipeline.** Perplexity retrieves "via both modalities," and Google Cloud documents hybrid search because embeddings miss exact strings. A passage that never uses the exact term gives the keyword half of a hybrid system nothing to find, which matters most for product names, model numbers and technical terms.
- **Early stages may still favour repeats.** In a pipeline like Perplexity's, fast lexical and embedding scorers come first and a cross-encoder decides last. In this test, BM25 put a stuffed paragraph first for 72% of prompts; the cross-encoder did so for 6%.

That makes keyword density a floor and a ceiling, not a target. Here is how a content brief changes (example lines):

| Old brief line | Replace it with |
| --- | --- |
| "Use the keyword 12–15 times" | "Name the keyword in each passage's opening sentence, then once more at most" |
| "Hit 1–2% keyword density" | "Give four checkable facts per 100 words" |
| "Add keyword variations at the end" | "Answer the question a reader would ask without knowing the term" |
| "Repeat the keyword in every section" | "Open each section with a sentence that defines or answers" |

To see whether rewrites change how often AI answers cite you, run a before-and-after prompt panel as in our [GEO measurement guide](/blog/how-to-measure-geo).

## Where Rankbox Fits

Rankbox's [Citation-Ready Writer](/features/citation-ready-writer) researches the live web and writes 2,000–3,500-word articles with sources, definitions and structure. The [SEO / GEO Score](/features/seo-geo-score) checks every draft before it ships, keyword use included.

Rankbox doesn't track AI citations today, so measure results with your own prompt panel or a tracker. [See plans and pricing](/pricing).

## Methodology

Rankbox ran this experiment once, on 28 September 2026.

### Test set

The set has 8 topics, 32 prompts (24 that contain the keyword and 8 intent prompts) and 263 paragraphs: 223 built from sentence swaps, plus 40 with the stuffing tail. Rankbox wrote every sentence for the test.

| Target keyword | Intent prompt (no keyword) |
| --- | --- |
| llms.txt file | "Is there a text file I can add to my site to help AI assistants understand it?" |
| project management software | "What tool can my team use to plan tasks, deadlines and who is working on what?" |
| Roth IRA | "Which retirement account lets me pay tax now and take the money out tax-free later?" |
| heat pump | "What system can both heat and cool my house using only electricity?" |
| cold brew coffee | "How can I make smooth coffee at home without using hot water?" |
| zero trust security | "How do we stop attackers moving around our network after one laptop is hacked?" |
| email deliverability | "How do I make sure the messages I send actually reach people's inboxes?" |
| vector database | "Where should I store embeddings so I can search my documents by meaning?" |

### Scorers

| Scorer | Type | Original model and publisher |
| --- | --- | --- |
| all-MiniLM-L6-v2 | Embedding | [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2), Sentence Transformers |
| gte-small | Embedding | [thenlper/gte-small](https://huggingface.co/thenlper/gte-small), Alibaba DAMO Academy |
| bge-small-en-v1.5 | Embedding | [BAAI/bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5), Beijing Academy of Artificial Intelligence (BAAI) |
| bge-base-en-v1.5 | Embedding | [BAAI/bge-base-en-v1.5](https://huggingface.co/BAAI/bge-base-en-v1.5), BAAI |
| e5-base-v2 | Embedding | [intfloat/e5-base-v2](https://huggingface.co/intfloat/e5-base-v2), Microsoft researchers (Wang et al., 2022) |
| nomic-embed-text-v1.5 | Embedding | [nomic-ai/nomic-embed-text-v1.5](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5), Nomic AI |
| snowflake-arctic-embed-m-v1.5 | Embedding | [Snowflake/snowflake-arctic-embed-m-v1.5](https://huggingface.co/Snowflake/snowflake-arctic-embed-m-v1.5), Snowflake |
| mxbai-embed-large-v1 | Embedding | [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1), Mixedbread |
| bge-reranker-base | Cross-encoder reranker | [BAAI/bge-reranker-base](https://huggingface.co/BAAI/bge-reranker-base), BAAI |
| BM25 | Lexical formula | k1 = 1.2, b = 0.75 (Elasticsearch's defaults) |

All models ran locally in Transformers.js 3 (version 3.8.1) on ONNX weights quantized to 8 bits. Six ran from ONNX ports of the cards above (Xenova/ repositories, plus Supabase/gte-small); nomic, Snowflake and mxbai ran from their own repositories. Each embedding model got the query and document prefixes its model card specifies, such as "query: " and "passage: " for e5. Vectors were L2-normalized, and the score is the cosine similarity between prompt and paragraph.

### Analysis

- **Within-prompt scoring.** Each prompt was scored only against paragraphs from its own topic, and each score was expressed as a z-score (standard deviations from that prompt's mean) so models on different scales can be averaged.
- **Effects per sentence and per mention.** A linear regression within each prompt, on the 223 paragraphs without the stuffing tail, estimated both effects at once. The ratio per density point compares one point of definition density (definition sentences per 100 words) with one point of keyword density.
- **Head to head.** A "win" means the definition-dense paragraph scored higher than the other paragraph for that prompt.
- **Precision check.** Two models were re-run at full 32-bit precision. bge-small-en-v1.5's ratio was 2.4× at 8-bit and 2.6× at full precision. MiniLM's per-mention effect was near zero at both (+0.0007 and −0.0002), which is why its ratio is reported as unstable; it is the highest ratio either way, so the median doesn't change. Definition-dense beat stuffed on intent prompts at the same rate at both precisions (MiniLM 88%, bge-small 100%).

### What this study didn't measure

The plan behind this study named OpenAI's text-embedding-3-small as its example model. Rankbox used open models only and didn't test it or any paid API model. OpenAI documents it as returning 1,536-number vectors normalized to length 1, so the test would run unchanged: embed the same 32 prompts and 263 paragraphs through the API and repeat the analysis. Nothing here measures rankings or citations inside ChatGPT, Perplexity, Google AI Overviews or any other product.

### Limitations

- **A proxy for one stage.** Similarity scores from open models stand in for the first retrieval stage. Production systems add other signals, such as freshness, authority, rerankers and user context, and none of the named AI search products publishes which embedding model it uses.
- **Short, written-for-the-test passages.** The paragraphs are 70–108 words. Long pages are chunked into passages before embedding, so the results apply per passage.
- **A small test set.** 8 topics and 32 prompts, only 8 of them intent prompts. Treat the numbers as directional.
- **A ceiling of four definitions.** The test didn't try five or more per paragraph.
- **8-bit weights**, checked against full precision for two of the eight models.
- **English only.**

### How to cite this study

Rankbox, "Vector Distance vs. Keyword Density", 28 September 2026, https://rankbox.xyz/blog/vector-distance-vs-keyword-density

## Frequently Asked Questions

### What is keyword density?

Keyword density is the share of a text taken up by one phrase: mentions divided by total words, times 100. Five mentions in 100 words is 5%. It measures repetition, not meaning, so it tracks word-counting formulas like BM25 better than it tracks how embedding models judge relevance.

### Does keyword density matter for AI search?

Keyword density matters a little, and only at the low end. In Rankbox's September 2026 experiment, the second mention of a keyword gave the big lift, averaged over eight embedding models. From the third mention on, similarity was flat or slightly lower. Definition sentences moved similarity 3.2 times as much per point of density.

### How does AI search understand what I mean if I don't use the keyword?

It turns your question into a representation of the need and looks for passages close to that meaning, even in different words. Google says its AI systems "can understand synonyms and general meanings." In the experiment, prompts without the keyword rewarded definitions and penalized repeats in all eight embedding models.

### Is vector distance the same as cosine similarity?

They are two views of one measurement. Cosine similarity is the cosine of the angle between two vectors, and higher means closer in meaning. Distance runs the other way. With vectors scaled to length 1, cosine similarity, dot product and Euclidean distance rank results the same way.

### What keyword density should I aim for?

Aim for a count, not a percentage: about two mentions per 100 words, based on this study. Name the keyword in the opening sentence and once more, then spend the passage on definitions. On average, repeats past the second added nothing across eight embedding models, and they cost similarity on intent prompts.

## References

1. [Vector embeddings guide, OpenAI](https://developers.openai.com/api/docs/guides/embeddings)
2. [Measuring similarity from embeddings, Google for Developers](https://developers.google.com/machine-learning/clustering/dnn-clustering/supervised-similarity)
3. [Term frequency and weighting, Introduction to Information Retrieval (Manning, Raghavan and Schütze)](https://nlp.stanford.edu/IR-book/html/htmledition/term-frequency-and-weighting-1.html)
4. [Similarity settings (BM25), Elasticsearch documentation](https://www.elastic.co/docs/reference/elasticsearch/index-settings/similarity)
5. [What is the ideal keyword density of a page?, Google Search Central (YouTube, August 2011)](https://www.youtube.com/watch?v=Rk4qgQdp2UA)
6. [Spam policies for Google web search, Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies)
7. [What is keyphrase density and why is it important?, Yoast](https://yoast.com/what-is-keyphrase-density-and-why-is-it-important/)
8. [Dense Passage Retrieval for Open-Domain Question Answering (Karpukhin et al., 2020)](https://arxiv.org/abs/2004.04906)
9. [About hybrid search, Google Cloud documentation](https://docs.cloud.google.com/vertex-ai/docs/vector-search/about-hybrid-search)
10. [Retrieval guide, OpenAI](https://developers.openai.com/api/docs/guides/retrieval)
11. [Introducing Contextual Retrieval, Anthropic](https://www.anthropic.com/news/contextual-retrieval)
12. [Passage Re-ranking with BERT (Nogueira and Cho, 2019)](https://arxiv.org/abs/1901.04085)
13. [bge-reranker-base model card, BAAI on Hugging Face](https://huggingface.co/BAAI/bge-reranker-base)
14. [Architecting and evaluating an AI-first Search API, Perplexity](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api)
15. [How AI powers great search results, Google](https://blog.google/products/search/how-ai-powers-great-search-results/)
16. [AI optimization guide, Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
17. [ChatGPT search, OpenAI Help Center](https://help.openai.com/en/articles/9237897-chatgpt-search)
18. [AI Mode in Google Search: updates from Google I/O 2025, Google](https://blog.google/products/search/google-search-ai-mode-update/)
19. [GEO: Generative Engine Optimization (Aggarwal et al., KDD 2024)](https://arxiv.org/abs/2311.09735)
