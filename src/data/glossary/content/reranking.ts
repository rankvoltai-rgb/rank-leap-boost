import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "reranking",
  metaTitle: "What Is Reranking? The Step That Decides Which Pages AI Cites",
  metaDescription:
    "Reranking is the retrieval stage where a precise model re-scores search results and picks the passages an AI answer cites. How it works and how to win it.",
  keywords: [
    "reranking",
    "re-ranking",
    "what is reranking",
    "cross-encoder reranking",
    "passage reranking",
    "reranking in AI search",
  ],

  whyItMatters:
    "Getting retrieved only puts your page in a pool of dozens or hundreds of candidates; reranking is the cut that decides which few the answer actually uses. For a small team it's the step where a clear answer counts most, because the reranker reads your passage side by side with the question and scores how well it answers.",

  questions: [
    {
      id: "how-reranking-works",
      question: "How does reranking work?",
      answer:
        "Reranking works by taking the top results from a fast first-stage search and re-scoring each one with a slower, more accurate model that reads the query and the passage together, then reordering the list so only the best-matching few reach the answer.",
      blocks: [
        {
          kind: "p",
          text: "The split exists because of a speed-accuracy trade-off. First-stage retrieval — keyword matching and [vector embeddings](/glossary/vector-embeddings) — compares representations computed in advance, fast enough for billions of passages. A reranker, usually a **cross-encoder**, runs the query and the passage through the model together, which is far more accurate and far too slow to run on everything. The [Sentence-BERT paper](https://arxiv.org/abs/1908.10084) puts numbers on the gap: finding the most similar pair among 10,000 sentences takes about 65 hours with BERT reading every pair, and about 5 seconds with precomputed embeddings.",
        },
        {
          kind: "table",
          head: ["", "First-stage retrieval", "Reranking"],
          rows: [
            [
              "**Model type**",
              "Embeddings (bi-encoders) and BM25 keyword scoring",
              "A cross-encoder reading query and passage together",
            ],
            ["**Scale**", "The whole index", "A short list, often around 100 candidates"],
            [
              "**Good at**",
              "Recall — finding plausible candidates",
              "Precision — putting the best ones first",
            ],
            ["**Output**", "A candidate pool", "The few passages the answer reads"],
          ],
        },
        {
          kind: "p",
          text: "The [Sentence-Transformers documentation](https://sbert.net/examples/cross_encoder/applications/README.html) describes the standard recipe: retrieve the top 100 or so candidates with a fast bi-encoder, then re-rank those hits with a cross-encoder. The approach took off in 2019, when [Nogueira and Cho](https://arxiv.org/abs/1901.04085) used BERT as a passage re-ranker and beat the previous best result on the MS MARCO benchmark by 27% (relative, MRR@10).",
        },
      ],
    },
    {
      id: "reranking-in-ai-search",
      question: "Do AI search engines use reranking?",
      answer:
        "AI search engines rerank before they answer: Perplexity documents cross-encoder rerankers as its final ranking stage, Anthropic's published retrieval setup reranks 150 candidates down to 20, and every engine that fans out many searches must cut the pooled results to a handful of citations.",
      blocks: [
        {
          kind: "p",
          text: "Perplexity's [architecture write-up](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api) is the most explicit: fast lexical and embedding scorers narrow the set, then cross-encoder rerankers make the final cut at document and sub-document level, and the rankers keep learning from signals across millions of user requests an hour. Google and OpenAI both describe [query fan-out](/glossary/query-fan-out) — several searches per question — which produces a pool far larger than the few sources an answer cites.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "150 → 20",
              label:
                "chunks retrieved, then kept after reranking, in Anthropic's published retrieval setup",
              source: {
                name: "Anthropic, Sep 2024",
                href: "https://www.anthropic.com/news/contextual-retrieval",
              },
            },
            {
              value: "67%",
              label:
                "fewer failed retrievals than a standard baseline once contextual retrieval was combined with reranking",
              source: {
                name: "Anthropic, Sep 2024",
                href: "https://www.anthropic.com/news/contextual-retrieval",
              },
            },
            {
              value: "2.4–6.4",
              label:
                "median domains cited per answer across Gemini, ChatGPT, Claude and Perplexity",
              source: {
                name: "Attrifast, May 2026",
                href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
              },
            },
          ],
        },
        {
          kind: "p",
          text: 'Anthropic sums up why the step exists: reranking ensures "only the most relevant chunks are passed to the model," which "provides better responses and reduces cost and latency because the model is processing less information." For a site owner, that means the model never reads most of what was retrieved — only what survived the rerank.',
        },
      ],
    },
    {
      id: "optimize-for-reranking",
      question: "How do you optimize content for reranking?",
      answer:
        "Optimize content for reranking by writing passages a model would judge a direct answer when it reads them next to the question: the question's key terms restated, the answer in the first sentence, specific facts, and nothing that depends on text outside the passage.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            '**Restate the question\'s subject and terms.** A cross-encoder reads the query and passage together, so a passage that says "Plannora pricing for a team of five" plainly addresses a question about exactly that.',
            "**Answer in the first sentence.** The reranker is judging whether this passage answers this question; make that obvious from the first line. See [answer-first content](/glossary/answer-first-content).",
            "**Be specific.** Numbers with units, names, dates and conditions separate an answer from a description.",
            "**Stay on one question.** A passage covering three topics is a partial match for all three.",
            "**Make it self-contained.** Rerankers see the passage, not your page. See [content chunking](/glossary/content-chunking).",
            "**Keep it current and dated.** Perplexity prefilters stale content before its rerankers even run. See [content freshness](/glossary/content-freshness).",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Test a section like a reranker",
          text: "Paste a buyer's question and your section into any AI assistant, and ask it to score from 0 to 10 how directly the section answers the question, and why. It isn't the engine's reranker, but it reads the pair together, as a cross-encoder does, and it will point at vague openings.",
        },
      ],
    },
    {
      id: "reranking-vs-ranking",
      question: "Reranking vs ranking: what's the difference?",
      answer:
        "Ranking orders an entire index for a query, while reranking re-scores only the short list a first ranking produced, using a more expensive model — so ranking decides whether you're a candidate and reranking decides whether you're chosen.",
      blocks: [
        {
          kind: "p",
          text: "In classic search the ranked list is the product. In AI search it's an intermediate step: a page can rank on page one for a sub-query and still lose at reranking to a passage that answers the question more directly. Citation lists rarely match the classic top 10 — only 37.9% of pages cited in Google AI Overviews rank top 10 for the typed query, per [Ahrefs' March 2026 data](https://ahrefs.com/blog/ai-overview-citations-top-10/). Ahrefs attributes that mainly to fan-out; reranking is the step that then picks among the pooled sub-query results.",
        },
        {
          kind: "list",
          items: [
            "**Ranking gets you retrieved:** crawlable, indexed and matching the sub-query. This is classic SEO, and it's the entry ticket.",
            "**Reranking gets you chosen:** the passage that best answers the question, judged next to the question.",
            "**Grounding gets you cited:** the model attaches a citation to the passage it actually used. See [grounding](/glossary/grounding).",
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Rerank Reorder",
    summary:
      'How a reranker can flip a first-stage ranking. The scores are illustrative, not output from a real model, for three passages about a fictional project tool called Plannora answering the question "How much does Plannora cost for a team of five?"',
    items: [
      {
        label: "First-stage winner: the keyword-rich intro",
        body: '"Plannora pricing: flexible Plannora plans and Plannora pricing options for teams of every size." It shares the most terms with the query, so it tops the fast first pass.',
        value: "1st of 3",
      },
      {
        label: "First-stage runner-up: the FAQ answer",
        body: '"A five-person team pays $40 a month on Plannora\'s Team plan — $8 per user, billed annually."',
        value: "2nd of 3",
      },
      {
        label: "First-stage third: the feature overview",
        body: '"Plannora\'s Team plan adds automations, guest access and priority support."',
        value: "3rd of 3",
      },
      {
        label: "Reranker scores, read with the question",
        body: "Intro: on topic but answers nothing. FAQ answer: states the price for exactly five people. Overview: names the plan but gives no price.",
        value: "0.21 · 0.94 · 0.33",
      },
      {
        label: "New order",
        body: "The FAQ answer moves to the top and becomes the passage the answer quotes; the intro drops to last.",
        value: "FAQ answer 1st",
      },
    ],
    outcome:
      "The keyword-rich intro won the fast first pass and lost the cut that mattered. Reranking rewards the passage that answers, which is why one direct, specific sentence per question does more than repeating the product name.",
  },

  related: [
    "retrieval-augmented-generation",
    "semantic-search",
    "vector-embeddings",
    "content-chunking",
    "query-fan-out",
    "answer-first-content",
  ],
  product: {
    feature: "seo-geo-score",
    pitch:
      "Rankbox scores every article before it publishes, one score for SEO and one for GEO, checking structure, headings, readability and citation-readiness — with specific fixes, so vague sections get tightened before any engine reads them.",
  },
  further: [
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "The best-documented reranking pipeline in AI search, from span parsing to cross-encoders.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "Writing answer-first pages that survive fan-out and reranking, step by step.",
    },
  ],
  sources: [
    {
      title: "Passage Re-ranking with BERT",
      publisher: "Nogueira & Cho, 2019",
      href: "https://arxiv.org/abs/1901.04085",
    },
    {
      title: "Cross-Encoders",
      publisher: "Sentence-Transformers documentation",
      href: "https://sbert.net/examples/cross_encoder/applications/README.html",
    },
    {
      title: "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
      publisher: "Reimers & Gurevych, EMNLP 2019",
      href: "https://arxiv.org/abs/1908.10084",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "Introducing Contextual Retrieval",
      publisher: "Anthropic",
      href: "https://www.anthropic.com/news/contextual-retrieval",
    },
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
  ],
};
