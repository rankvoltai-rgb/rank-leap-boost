import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "semantic-search",
  metaTitle: "What Is Semantic Search? Meaning-Based Search Explained for SEO",
  metaDescription:
    "Semantic search matches queries to content by meaning, not exact words. How Google and AI engines use it, semantic vs keyword search, and how to optimize for it.",
  keywords: [
    "semantic search",
    "what is semantic search",
    "semantic search SEO",
    "semantic search vs keyword search",
    "vector search",
    "meaning-based search",
  ],

  whyItMatters:
    "Buyers don't type your keywords into ChatGPT; they describe their problem in their own words, and semantic search is how the engine connects that description to your page. For a small team, it shifts the job from guessing exact phrases to answering real questions clearly — work you can do without an SEO department.",

  questions: [
    {
      id: "how-semantic-search-works",
      question: "How does semantic search work?",
      answer:
        "Semantic search works by converting the query and every indexed passage into vector embeddings, then returning the passages whose vectors sit closest to the query's — so results are ranked by how close their meaning is, not by how many words they share.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**At index time**, each page is split into passages and every passage is run through an embedding model. See [vector embeddings](/glossary/vector-embeddings) and [content chunking](/glossary/content-chunking).",
            "**At query time**, the question is embedded with the same model.",
            "**Nearest-neighbor search** finds the passages whose vectors are closest, usually by cosine similarity, using indexes built to search billions of vectors quickly.",
            "**Reranking** has a slower, more precise model re-score the short list against the query. See [reranking](/glossary/reranking).",
          ],
        },
        {
          kind: "p",
          text: "The approach beat keyword search on its home turf early. In the 2020 Dense Passage Retrieval paper, an embedding-based retriever outperformed BM25 by 9 to 19 points in top-20 passage retrieval accuracy across open-domain question-answering benchmarks ([Karpukhin et al.](https://arxiv.org/abs/2004.04906)). A pre-trained version of that retriever powered the original [retrieval-augmented generation](/glossary/retrieval-augmented-generation) paper the same year.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Meaning, not magic",
          text: "Semantic search matches what a passage is about. It can't match a page to a question the page doesn't address, and it still needs the page to be crawlable, indexed and readable as plain HTML before any of this happens.",
        },
      ],
    },
    {
      id: "semantic-vs-keyword-search",
      question: "Semantic search vs keyword search: what's the difference?",
      answer:
        "Keyword search finds pages containing the query's words and ranks them by term statistics, while semantic search finds pages that mean the same thing even with different words — and modern engines run both together, because each catches what the other misses.",
      blocks: [
        {
          kind: "table",
          head: ["", "Keyword (lexical) search", "Semantic search"],
          rows: [
            [
              '**Query: "cheap tool to track sales leads"**',
              "Needs pages containing those words",
              'Also finds "affordable CRM for small teams"',
            ],
            [
              '**Query: "Plannora API rate limit"**',
              "Precise — exact product and term",
              "May drift toward generic rate-limit pages",
            ],
            [
              "**Typical method**",
              "BM25 over an inverted index",
              "Embeddings and nearest-neighbor search",
            ],
            ["**Main blind spot**", "Synonyms and paraphrases", "Exact identifiers and rare names"],
          ],
        },
        {
          kind: "p",
          text: 'That\'s why answer engines are hybrid. Perplexity runs lexical and embedding retrieval in parallel and merges the results ([Perplexity Research](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api)). Google has layered meaning-based systems onto its ranking for a decade: RankBrain in 2015, neural matching in 2018, and BERT in 2019, which Google said would help it understand "one in 10 searches in the U.S. in English" ([Google](https://blog.google/products/search/search-language-understanding-bert/)). Meaning-based matching widens the set of questions a page can be found for; exact terms still decide the precise lookups — product names, prices, error codes.',
        },
      ],
    },
    {
      id: "do-ai-engines-use-semantic-search",
      question: "Do AI search engines use semantic search?",
      answer:
        'AI search engines use semantic search at the retrieval step: Perplexity documents embedding retrieval alongside keyword matching, and Google tells site owners its AI systems "can understand synonyms and general meanings" — so pages compete on meaning as well as on exact terms.',
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Perplexity: hybrid retrieval",
              body: "Lexical and embedding retrieval run together over its own 200-billion-URL index, then cross-encoders rerank the passages.",
              evidence: "official",
            },
            {
              title: "Google AI Overviews and AI Mode",
              body: "Grounded in core Search ranking, which has used meaning-based systems since RankBrain. Google's guidance: \"You don't need to write in a specific way just for generative AI search.\"",
              evidence: "official",
            },
            {
              title: "ChatGPT",
              body: "Titles of pages ChatGPT cited were semantically closer to the prompt than uncited titles (0.602 vs 0.484) and closer still to its fan-out queries, in Ahrefs' April 2026 study — meaning-level matching, measured from outside.",
              evidence: "observed",
            },
            {
              title: "Claude",
              body: "Retrieves from Brave Search, whose top 10 held 79.2% of the URLs Claude cited in Profound's 2026 study. How Brave matches meaning isn't documented.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "p",
          text: "Semantic retrieval also explains why a page can be cited for a question it never phrases exactly. Engines split a prompt into sub-queries — see [query fan-out](/glossary/query-fan-out) — and each sub-query is matched by meaning against the passages in the index.",
        },
      ],
    },
    {
      id: "optimize-for-semantic-search",
      question: "How do you optimize for semantic search?",
      answer:
        "Optimize for semantic search by covering the questions behind a topic in plain language — one clear idea per section, headings phrased the way buyers ask, and the exact names buyers use — rather than repeating keyword variants.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Start from questions, not keywords.** Map what a buyer asks before, during and after choosing. See [search intent](/glossary/search-intent) and [long-tail keywords](/glossary/long-tail-keywords).",
            "**Give each question its own section**, with a heading that reads like the question and a first sentence that answers it.",
            "**Cover the topic, not the phrase.** A [topic cluster](/glossary/topic-cluster) of pages answering related questions gives the engine more passages that mean what buyers ask.",
            "**Keep the exact terms too.** Product names, category words, prices and units still win the lexical half of hybrid retrieval.",
            "**Skip synonym stuffing.** Google says its AI systems understand synonyms, and the original GEO study found keyword stuffing did little or hurt visibility in generative answers ([Aggarwal et al.](https://arxiv.org/abs/2311.09735)).",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Semantic isn't a license to be vague",
          text: 'Meaning-based retrieval rewards pages that are clearly about one thing. Abstract headlines like "Work, reimagined" embed close to nothing a buyer actually asks.',
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Two-Lane Match Check",
    summary:
      "Hybrid engines retrieve through two lanes at once — exact terms and meaning — so audit each important section against both. A section that passes only one lane is relying on luck.",
    items: [
      {
        label: "The exact-term lane",
        body: "Does the section contain the literal words a buyer would type: the product name, the category term, the number and its unit? **Test:** read the buyer's question aloud, then find its key nouns in the section.",
      },
      {
        label: "The meaning lane",
        body: "Would a stranger reading only this section say it answers the question? **Test:** show a colleague just the heading and first two sentences, and ask what question they answer.",
      },
      {
        label: "The focus check",
        body: "Does the section cover one question or several? Mixed sections dilute both lanes. **Test:** if it takes two headings to describe the section honestly, split it.",
      },
      {
        label: "The standalone check",
        body: "Does the section make sense lifted out of the page, with its subject named? **Test:** hide everything above it and reread.",
      },
    ],
    outcome:
      'Score each section pass or fail on all four. A pricing section that says "plans for every stage" but never states a price fails the exact-term lane; a guide that answers five questions under one heading fails the focus check. Fix the fails on your ten highest-intent pages first.',
  },

  related: [
    "vector-embeddings",
    "reranking",
    "search-intent",
    "query-fan-out",
    "retrieval-augmented-generation",
    "topic-cluster",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web and writes 2,000–3,500-word articles in your brand voice, with answer-first structure, clear definitions and sources — plain-language sections that match on meaning and still use the exact terms buyers type.",
  },
  tool: "content-brief-generator",
  further: [
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "Hybrid keyword and embedding retrieval over Perplexity's own index, step by step.",
    },
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Why Google says optimizing for its AI features is still SEO, and what that means for your pages.",
    },
  ],
  sources: [
    {
      title: "Dense Passage Retrieval for Open-Domain Question Answering",
      publisher: "Karpukhin et al., EMNLP 2020",
      href: "https://arxiv.org/abs/2004.04906",
    },
    {
      title: "Understanding searches better than ever before",
      publisher: "Google",
      href: "https://blog.google/products/search/search-language-understanding-bert/",
    },
    {
      title: "How AI powers great search results",
      publisher: "Google",
      href: "https://blog.google/products/search/how-ai-powers-great-search-results/",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Why ChatGPT cites the pages it does",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
  ],
};
