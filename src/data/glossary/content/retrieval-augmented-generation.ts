import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "retrieval-augmented-generation",
  metaTitle: "What Is Retrieval-Augmented Generation (RAG)? How AI Finds Sources",
  metaDescription:
    "Retrieval-augmented generation (RAG) is how ChatGPT, Perplexity and AI Overviews find pages before answering. How RAG works and how to become a retrieved source.",
  keywords: [
    "retrieval-augmented generation",
    "RAG",
    "what is RAG",
    "how does RAG work",
    "RAG vs fine-tuning",
    "RAG SEO",
  ],

  whyItMatters:
    "RAG is the step where an AI engine goes looking for sources, and it's the only point in the process where a page published this week can beat a brand the model has known for years. For a founder without a content team, that's the opening: you can't change what a model memorized, but you can make your pages the ones its retrieval step finds and quotes.",

  questions: [
    {
      id: "how-rag-works",
      question: "How does retrieval-augmented generation work?",
      answer:
        "Retrieval-augmented generation works in two steps: a retriever searches an index for passages relevant to the question, then a large language model writes the answer with those passages placed in its prompt, citing the ones it used.",
      blocks: [
        {
          kind: "p",
          text: 'The technique was named in a 2020 paper by researchers at Facebook AI Research, University College London and New York University ([Lewis et al.](https://arxiv.org/abs/2005.11401)), which paired a text generator with "a dense vector index of Wikipedia, accessed with a pre-trained neural retriever." The paper called the two halves **parametric memory** — what the model learned — and **non-parametric memory**, the index it can search. Every AI answer engine now runs a scaled-up version of that design, with the web as the index.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "The question is rewritten into searches",
              body: "Engines rarely search the exact prompt. They write narrower sub-queries — [query fan-out](/glossary/query-fan-out) — and run them in parallel.",
              lever:
                "Title pages and sections the way a buyer's follow-up question would be searched.",
            },
            {
              title: "The retriever pulls candidates from an index",
              body: "Keyword matching and [semantic search](/glossary/semantic-search) run over Google's, Bing's, Brave's or the engine's own index. Perplexity runs both at once and merges the results.",
              lever: "Be crawlable by the engine's search bot and indexed where it looks.",
            },
            {
              title: "Pages are split into passages and reranked",
              body: "Documents are broken into [chunks](/glossary/content-chunking), and a more precise model [reranks](/glossary/reranking) them against the question. Only the top few survive.",
              lever: "Make each section answer one question in its first sentence.",
            },
            {
              title: "The model writes from the survivors",
              body: "The surviving passages go into the model's context, and it writes an answer [grounded](/glossary/grounding) in them, attaching citations to the claims they support.",
            },
          ],
        },
        {
          kind: "p",
          text: 'Google describes the same pattern for [AI Overviews](/glossary/ai-overviews): RAG is used "to improve the quality, accuracy, and freshness of AI responses by relying on our core Search ranking systems to retrieve relevant, up-to-date web pages" ([Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)).',
        },
      ],
    },
    {
      id: "rag-vs-fine-tuning",
      question: "RAG vs fine-tuning: what's the difference?",
      answer:
        "RAG gives a model new information at answer time by retrieving documents, while fine-tuning changes the model's weights with extra training — so RAG handles fresh, citable facts, and fine-tuning shapes style and behavior.",
      blocks: [
        {
          kind: "table",
          head: ["", "Retrieval-augmented generation", "Fine-tuning", "Training data alone"],
          rows: [
            [
              "**When knowledge is added**",
              "At the moment of the question",
              "In an extra training run",
              "Before the model's release",
            ],
            [
              "**Freshness**",
              "As current as the index",
              "Frozen at the fine-tune",
              "Frozen at the [knowledge cutoff](/glossary/knowledge-cutoff)",
            ],
            ["**Can it cite sources?**", "Yes — the retrieved pages", "No", "No"],
            [
              "**What a site owner can influence**",
              "Access, indexing and passages",
              "Nothing",
              "Slowly, through [training data](/glossary/llm-training-data)",
            ],
          ],
        },
        {
          kind: "p",
          text: "The two aren't rivals inside an AI product. A model is fine-tuned once to behave like a helpful assistant, and RAG then supplies the facts question by question. For marketers the distinction that matters is control: you'll never fine-tune ChatGPT, and you can't edit what it memorized. RAG is the part of the system that's open to you — every engine that cites sources is retrieving them, and retrieval can be earned page by page.",
        },
      ],
    },
    {
      id: "rag-and-seo",
      question: "Why does retrieval-augmented generation matter for SEO?",
      answer:
        "Retrieval-augmented generation matters for SEO because the retrieval step runs on search indexes: a page that isn't crawlable, indexed and matched to the engine's sub-queries can't be retrieved, and a page that isn't retrieved can't be cited.",
      blocks: [
        {
          kind: "p",
          text: "That makes classic SEO the entry ticket, not the whole game. Retrieval works on sub-queries and passages, so a page can be cited for a follow-up question it answers well while ranking nowhere for the prompt the user typed.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "~8%",
              label:
                "of ChatGPT citations rank in Google's or Bing's top 10 for the original prompt",
              source: {
                name: "Ahrefs, Aug 2025",
                href: "https://ahrefs.com/blog/ai-search-overlap/",
              },
            },
            {
              value: "37.9%",
              label: "of pages cited in Google AI Overviews rank top 10 for the typed query",
              source: {
                name: "Ahrefs, Mar 2026",
                href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
              },
            },
            {
              value: "28.6%",
              label:
                "of Perplexity's citations rank in Google's top 10 — the highest overlap of any assistant",
              source: {
                name: "Ahrefs, Aug 2025",
                href: "https://ahrefs.com/blog/ai-search-overlap/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Each engine retrieves from a different place — Google's index for AI Overviews and Gemini, Bing plus OpenAI's own index for ChatGPT, Brave for Claude, and Perplexity's own 200-billion-URL index — so being findable means being indexed in all of them. The [AI SEO guides](/ai-seo) cover each engine's source and crawler.",
        },
      ],
    },
    {
      id: "optimize-for-rag",
      question: "How do you optimize content for retrieval-augmented generation?",
      answer:
        "Optimize for retrieval-augmented generation by removing anything that blocks retrieval, then writing passages a retriever can match and a model can quote: descriptive headings, the answer in the first sentence, and specific names, numbers and dates.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Let the search bots in**, and check your CDN, whose AI-bot toggles can override robots.txt. See [AI crawlers](/glossary/ai-crawlers).",
            "**Put the text in the HTML.** Only Google's pipeline renders JavaScript; OpenAI's, Anthropic's and Perplexity's fetchers read raw HTML.",
            "**Match the sub-question** in titles, H2s and URL slugs. [Ahrefs found](https://ahrefs.com/blog/why-chatgpt-cites-pages/) the titles of pages ChatGPT cited were semantically closer to the prompt than uncited titles (0.602 vs 0.484), and closer still to its fan-out queries.",
            "**Answer first, then expand.** [Growth Memo found](https://searchengineland.com/chatgpt-citations-content-study-469483) 44.2% of ChatGPT citations came from the first 30% of a page. See [answer-first content](/glossary/answer-first-content).",
            '**Make sections stand alone.** A retrieved chunk arrives without the paragraphs around it, so name the subject instead of writing "it" or "as above."',
            "**Stay current.** Perplexity filters stale pages before ranking, and [Ahrefs found](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) assistants cite newer pages than classic search does. See [content freshness](/glossary/content-freshness).",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "A one-line retrieval test",
          text: 'Fetch a page without running JavaScript — `curl -s https://yoursite.com/pricing | grep -c "Plans start at"` — using a sentence from the page. A zero means the sentence is rendered client-side or blocked, and no RAG system outside Google will see it.',
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with retrieval-augmented generation",
      answer:
        "The most common RAG mistakes are assuming a top ranking for the head term is enough, hiding the answer behind JavaScript or a long intro, and writing sections that only make sense in context — each one stops a page at retrieval or extraction.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "RAG engines just show Google's top results.",
              reality:
                "Engines retrieve for their own sub-queries from their own indexes. Only about 8% of ChatGPT's citations rank top 10 for the original prompt.",
            },
            {
              myth: "An llms.txt file feeds my content to RAG systems.",
              reality:
                "No major engine has confirmed reading other sites' [llms.txt](/glossary/llms-txt) files. Retrieval runs on search indexes and crawlers.",
            },
            {
              myth: "Being retrieved means being cited.",
              reality:
                "Retrieval only puts a page in the pool. A reranker cuts the pool to a short list, and the answer cites a few sources — a median of about three domains per ChatGPT answer in Attrifast's 2026 study.",
            },
            {
              myth: "Longer, more comprehensive pages always win.",
              reality:
                'Retrieval scores passages. A long page with the answer buried in paragraph nine loses to a short section that answers first — Google says there\'s "no ideal page length."',
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The RAG Funnel",
    summary:
      "A way to see how few passages survive each step of retrieval-augmented generation — and why the passage, not the page, is what you're writing. Stage sizes are illustrative, anchored to published figures where they exist, for a fictional project tool called Plannora.",
    items: [
      {
        label: "Sub-queries the engine writes",
        body: "A buyer asks ChatGPT for the best project tool for a five-person team. Nectiv measured about 7.6 fan-out searches per ChatGPT prompt after August 2026; round down to 7.",
        value: "7 searches",
      },
      {
        label: "Candidate pages retrieved",
        body: "Assume ten results per sub-query, then remove pages that appear in more than one search.",
        value: "~50 pages",
      },
      {
        label: "Passages in the pool",
        body: "At roughly one passage per 150-word section, a 2,000-word page yields about 13. 50 pages × 13.",
        value: "~650 passages",
      },
      {
        label: "Reranked short list",
        body: "Anthropic's published RAG setup retrieves 150 chunks and reranks them down to 20 for the model. Assume the same cut to 20.",
        value: "20 passages",
      },
      {
        label: "Cited in the answer",
        body: "Attrifast's 2026 study measured a median of 3.1 domains cited per ChatGPT answer. Call it 3.",
        value: "3 sources",
      },
      {
        label: "Odds for any one passage",
        body: "3 ÷ 650 — the share of the pool that makes it into the answer.",
        value: "under 0.5%",
      },
    ],
    outcome:
      "Plannora's pricing page could be retrieved for three of the seven sub-queries and still lose if a competitor's section answers \"price per user for five people\" in its first sentence. The funnel shows where effort pays: being indexed and matching the sub-queries gets you into the pool of 650, and a passage that answers first is what survives the last two cuts.",
  },

  related: [
    "grounding",
    "query-fan-out",
    "reranking",
    "content-chunking",
    "semantic-search",
    "large-language-model",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web and writes 2,000–3,500-word articles in your brand voice, with answer-first sections, clear definitions and cited sources — the passage shape a retriever can match and a model can quote.",
  },
  tool: "content-brief-generator",
  further: [
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "The most openly documented RAG pipeline in AI search: passage splitting, hybrid retrieval and cross-encoder reranking.",
    },
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "How Google grounds its AI answers in the Search index through RAG and query fan-out.",
    },
  ],
  sources: [
    {
      title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      publisher: "Lewis et al., NeurIPS 2020",
      href: "https://arxiv.org/abs/2005.11401",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
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
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
  ],
};
