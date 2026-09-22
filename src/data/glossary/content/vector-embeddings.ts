import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "vector-embeddings",
  metaTitle: "What Are Vector Embeddings? How AI Search Matches Meaning",
  metaDescription:
    "Vector embeddings turn text into numbers so AI search can match a question to your page by meaning, not keywords. How they work, with a worked example.",
  keywords: [
    "vector embeddings",
    "embeddings",
    "what are vector embeddings",
    "text embeddings",
    "cosine similarity",
    "embeddings for SEO",
  ],

  whyItMatters:
    "Embeddings are why an AI engine can match a buyer's question to your page even when you never used their exact words, and why a page stuffed with keywords but vague on meaning loses to one that plainly answers the question. For a small team that's good news: you don't need an expensive keyword tool to compete, you need pages whose sections each mean one clear thing.",

  questions: [
    {
      id: "how-embeddings-work",
      question: "How do vector embeddings work?",
      answer:
        "Vector embeddings work by running text through a model that outputs a fixed-length list of numbers, positioned so that texts with similar meaning land close together; a search system then compares the query's vector with each passage's vector and ranks the closest.",
      blocks: [
        {
          kind: "p",
          text: 'OpenAI\'s documentation defines an embedding as a "vector (list) of floating point numbers" where "the distance between two vectors measures their relatedness" ([OpenAI](https://developers.openai.com/api/docs/guides/embeddings)). Its current embedding models return **1,536** numbers (`text-embedding-3-small`) or **3,072** (`text-embedding-3-large`) for any input, from a single word to a long passage.',
        },
        {
          kind: "list",
          items: [
            '**Each dimension is a learned feature**, not a human-readable one. No single number means "pricing"; meaning is spread across all of them.',
            "**Closeness is usually measured with cosine similarity**, where 1 means pointing the same way and 0 means unrelated. OpenAI recommends it, and because its embeddings are normalized to length 1, a simple dot product gives the same result.",
            "**The idea is old; the scale is new.** Word-level embeddings went mainstream with Google's word2vec in 2013 ([Mikolov et al.](https://arxiv.org/abs/1301.3781)), and sentence-level models such as [Sentence-BERT](https://arxiv.org/abs/1908.10084) made it practical to embed whole passages for search.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Embeddings power the first cut, not the final one",
          text: "Every passage can be embedded ahead of time, so comparing vectors is fast enough to search billions of passages. That's why engines use embeddings to pull candidates, then hand a short list to slower, more precise [rerankers](/glossary/reranking).",
        },
      ],
    },
    {
      id: "embeddings-in-ai-search",
      question: "How do AI search engines use vector embeddings?",
      answer:
        "AI search engines use vector embeddings to retrieve candidate passages by meaning, usually alongside keyword matching: the query and each indexed passage are embedded, the nearest passages are pulled, and a reranker picks the few the answer will cite.",
      blocks: [
        {
          kind: "p",
          text: 'Perplexity documents this directly: lexical and embedding retrieval run in parallel and merge into one candidate set before cross-encoder rerankers make the final cut ([Perplexity Research](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api)). Google has matched queries to pages by concept since neural matching arrived in Search in 2018, which it describes as understanding "how queries relate to pages" through "fuzzier representations of concepts" ([Google](https://blog.google/products/search/how-ai-powers-great-search-results/)).',
        },
        {
          kind: "stats",
          items: [
            {
              value: "0.602 vs 0.484",
              label:
                "semantic similarity of ChatGPT prompts to the titles of pages it cited, versus pages it didn't",
              source: {
                name: "Ahrefs, Apr 2026",
                href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
              },
            },
            {
              value: "0.656",
              label:
                "similarity of cited titles to their closest ChatGPT fan-out query — higher than to the prompt itself",
              source: {
                name: "Ahrefs, Apr 2026",
                href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
              },
            },
            {
              value: "9–19 pts",
              label:
                "gain in top-20 passage retrieval accuracy for an embedding retriever over BM25 keyword search",
              source: { name: "Karpukhin et al., 2020", href: "https://arxiv.org/abs/2004.04906" },
            },
          ],
        },
        {
          kind: "p",
          text: "The Ahrefs figures are a correlation measured from outside, not a view inside ChatGPT, but they point the same way as the mechanism: pages whose titles mean what the engine's sub-query means get cited more. See [query fan-out](/glossary/query-fan-out) for where those sub-queries come from.",
        },
      ],
    },
    {
      id: "embeddings-vs-keywords",
      question: "Vector embeddings vs keywords: what's the difference?",
      answer:
        'Keyword matching scores a page on the exact words it shares with the query, while vector embeddings score it on shared meaning — so embeddings can match "cheap tool to track sales leads" to a page about "affordable CRM for small teams" with no words in common.',
      blocks: [
        {
          kind: "table",
          head: ["", "Keyword matching (BM25)", "Vector embeddings"],
          rows: [
            ["**Matches on**", "Exact terms and how often they appear", "Meaning and intent"],
            [
              "**Synonyms and paraphrases**",
              "Missed unless the words overlap",
              "Matched — similar meanings land close together",
            ],
            [
              "**Strong at**",
              "Names, product codes, rare terms, numbers",
              "Conversational questions, different wording",
            ],
            [
              "**Weak at**",
              "Different words for the same idea",
              "Exact identifiers the query depends on",
            ],
            ["**Used in AI search?**", "Yes — lexical retrieval", "Yes — semantic retrieval"],
          ],
        },
        {
          kind: "p",
          text: 'Engines use both because each covers the other\'s blind spot. Anthropic\'s [contextual retrieval](https://www.anthropic.com/news/contextual-retrieval) research notes that embedding models "can miss crucial exact matches" and pairs them with BM25, which is "particularly effective for queries that include unique identifiers or technical terms." For your pages the lesson is to write for both: explain the idea naturally, and still use the exact names buyers type — product names, category terms, units. See [semantic search](/glossary/semantic-search).',
        },
      ],
    },
    {
      id: "optimize-for-embeddings",
      question: "How do you optimize content for vector embeddings?",
      answer:
        "Optimize content for vector embeddings by making each section mean one thing: a heading phrased like the question, a first sentence that answers it, and a body that stays on topic — because an embedding blends everything in a passage into a single point.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**One question per section.** A passage that covers pricing, onboarding and security embeds to a point between all three and matches none of them well.",
            '**Phrase headings as buyers ask.** "How much does Plannora cost for a team of five?" sits closer to that question than "Flexible plans for every stage."',
            "**Answer in the first sentence.** It anchors the passage's meaning and is the part most likely to be quoted. See [answer-first content](/glossary/answer-first-content).",
            '**Keep the subject explicit.** Name the product instead of writing "it", because the passage is embedded without the paragraph before it. See [content chunking](/glossary/content-chunking).',
            '**Don\'t chase synonyms.** Google tells site owners that "AI systems can understand synonyms and general meanings," so repeating variants adds noise, not coverage.',
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Start from the questions",
          text: "Embeddings reward pages that mean what buyers ask, so collect the questions first. The free [AI question generator](/tools/ai-question-generator) lists the questions people ask AI about a topic.",
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Three-Number Similarity Walkthrough",
    summary:
      "Real embeddings have well over a thousand dimensions, but the math is the same with three. This toy example uses illustrative vectors, not output from a real model, to show why a focused section beats a catch-all one for the same question about a fictional tool called Plannora.",
    items: [
      {
        label: "The query vector",
        body: '"How much does Plannora cost?" Imagine three features — pricing, onboarding, security. The query is almost all pricing.',
        value: "Q = (0.9, 0.1, 0.1)",
      },
      {
        label: "A focused pricing section",
        body: "A section that states the price in its first sentence and stays on topic.",
        value: "A = (0.8, 0.2, 0.1)",
      },
      {
        label: "A catch-all overview section",
        body: '"Why teams choose Plannora" — pricing, onboarding and security in one passage.',
        value: "B = (0.5, 0.5, 0.5)",
      },
      {
        label: "Cosine similarity of Q and A",
        body: "Dot product 0.72 + 0.02 + 0.01 = 0.75. Lengths √0.83 ≈ 0.911 and √0.69 ≈ 0.831. Similarity = 0.75 ÷ (0.911 × 0.831).",
        value: "≈ 0.99",
      },
      {
        label: "Cosine similarity of Q and B",
        body: "Dot product 0.45 + 0.05 + 0.05 = 0.55. Lengths 0.911 and √0.75 ≈ 0.866. Similarity = 0.55 ÷ (0.911 × 0.866).",
        value: "≈ 0.70",
      },
    ],
    outcome:
      "Against the same question, the focused section scores 0.99 and the catch-all 0.70, even though both mention pricing. In a real engine, a gap like that decides which passage reaches the reranker's short list. Split catch-all sections into one question each, and every one of them gets its own chance to be the closest match.",
  },

  related: [
    "semantic-search",
    "reranking",
    "content-chunking",
    "retrieval-augmented-generation",
    "query-fan-out",
    "search-intent",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox maps the questions your buyers ask ChatGPT, Perplexity and Google, scores each for volume, difficulty and intent, and turns the winnable ones into articles, each built around a question phrased the way buyers ask it.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "How Perplexity combines keyword and embedding retrieval, then reranks passages with cross-encoders.",
    },
  ],
  sources: [
    {
      title: "Vector embeddings",
      publisher: "OpenAI API",
      href: "https://developers.openai.com/api/docs/guides/embeddings",
    },
    {
      title: "Efficient Estimation of Word Representations in Vector Space",
      publisher: "Mikolov et al., Google, 2013",
      href: "https://arxiv.org/abs/1301.3781",
    },
    {
      title: "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
      publisher: "Reimers & Gurevych, EMNLP 2019",
      href: "https://arxiv.org/abs/1908.10084",
    },
    {
      title: "Dense Passage Retrieval for Open-Domain Question Answering",
      publisher: "Karpukhin et al., EMNLP 2020",
      href: "https://arxiv.org/abs/2004.04906",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "Why ChatGPT cites the pages it does",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Introducing Contextual Retrieval",
      publisher: "Anthropic",
      href: "https://www.anthropic.com/news/contextual-retrieval",
    },
  ],
};
