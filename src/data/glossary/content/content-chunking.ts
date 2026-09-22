import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "content-chunking",
  metaTitle: "What Is Content Chunking? How AI Splits Pages Into Passages",
  metaDescription:
    "Content chunking is how AI search splits your page into passages it scores and quotes one by one. How chunking works, what Google says, and how to write for it.",
  keywords: [
    "content chunking",
    "chunking",
    "what is content chunking",
    "passage indexing",
    "passage-level retrieval",
    "chunking content for AI search",
  ],

  whyItMatters:
    "AI engines don't judge your article as a whole; they judge each section on its own, which means one well-built section can win a citation for a site with no other authority on the topic. For a small team, that makes it the most leveraged editing habit there is: every section should answer one question without leaning on the rest of the page.",

  questions: [
    {
      id: "how-chunking-works",
      question: "How does content chunking work in AI search?",
      answer:
        "Content chunking works by splitting each fetched page into passages — often a heading and the text under it — that are indexed, retrieved and scored individually, so the engine can quote the one section that answers a question and ignore the rest of the page.",
      blocks: [
        {
          kind: "p",
          text: 'Perplexity describes the step in its [architecture write-up](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api): a content-understanding module splits each document into "self-contained spans" that are "individually retrieved and ranked at query time." Google moved the same way in classic search in October 2020, saying it could now "better understand the relevancy of specific passages" in addition to the page as a whole, a change it expected to improve 7 percent of search queries ([Google](https://blog.google/products/search/search-on/)).',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "The page is fetched as HTML",
              body: "Most AI fetchers read raw HTML and don't run JavaScript, and Claude's fetcher can truncate long pages to a token budget.",
              lever: "Server-render the page, and put the most important sections early.",
            },
            {
              title: "It's split into passages",
              body: "Headings, paragraphs, lists and tables mark the boundaries. Perplexity parses list- and table-heavy pages more formulaically.",
              lever: "Use real H2s and H3s, and real HTML tables for specs and comparisons.",
            },
            {
              title: "Each passage is embedded and indexed",
              body: "The passage is represented on its own, without the paragraphs around it. See [vector embeddings](/glossary/vector-embeddings).",
            },
            {
              title: "Passages compete for the question",
              body: "Retrieval and [reranking](/glossary/reranking) score passages against the query, and the answer quotes the winners.",
              lever: "Answer each section's question in its first sentence.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "What Google says about chunking",
          text: 'Google\'s AI guidance is explicit: "There\'s no requirement to break your content into tiny pieces for AI to better understand it," and "there\'s no ideal page length." Chunking is something engines do to your page. Your job is clear sections written for people — which happen to chunk well.',
        },
      ],
    },
    {
      id: "why-chunks-lose-context",
      question: "Why do chunks lose context?",
      answer:
        'Chunks lose context because each passage is indexed and read on its own, so anything it relies on from elsewhere on the page — the product name, the time period, what "it" refers to — disappears when the passage is lifted out.',
      blocks: [
        {
          kind: "p",
          text: "Anthropic's [contextual retrieval](https://www.anthropic.com/news/contextual-retrieval) research gives the textbook example: the chunk \"The company's revenue grew by 3% over the previous quarter\" is useless alone, because it doesn't say which company or which quarter. Anthropic's fix — adding a short generated summary of the surrounding document to every chunk before indexing — cut failed retrievals by 35%, by 49% when paired with keyword matching, and by 67% with reranking added.",
        },
        {
          kind: "p",
          text: "You can't count on every engine doing that repair for you. The safe move is to write passages that carry their own context:",
        },
        {
          kind: "table",
          head: ["Leans on the page", "Stands alone"],
          rows: [
            [
              '"It integrates with Slack and Teams."',
              '"Plannora integrates with Slack and Microsoft Teams on every plan."',
            ],
            [
              '"As mentioned above, pricing starts at $8."',
              '"Plannora\'s pricing starts at $8 per user per month."',
            ],
            [
              '"This makes it ideal for smaller teams."',
              '"Plannora\'s free tier covers teams of up to five people."',
            ],
            ['"Revenue grew 3% last quarter."', '"Plannora\'s revenue grew 3% in Q2 2026."'],
          ],
        },
      ],
    },
    {
      id: "write-for-chunking",
      question: "How do you write content that chunks well?",
      answer:
        "Write content that chunks well by giving every section one question-shaped heading, answering it in the first sentence, naming the subject instead of using pronouns, and giving each section enough substance to stand alone — very short sections earned the fewest ChatGPT citations in SE Ranking's study.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**One heading, one question.** The heading is the chunk's label, so make it the question the section answers.",
            "**Answer first.** [Growth Memo found](https://searchengineland.com/chatgpt-citations-content-study-469483) 44.2% of ChatGPT citations came from the first 30% of a page, and the same logic holds inside a section. See [answer-first content](/glossary/answer-first-content).",
            "**Name the subject** in each section's opening sentence, even if the previous section just did.",
            "**Don't go too thin.** [SE Ranking found](https://seranking.com/blog/how-to-optimize-for-chatgpt/) sections under 50 words averaged 2.7 ChatGPT citations, against 4.6 for sections of 120–180 words and 5.7 for longer ones.",
            "**Use real structure.** HTML tables and lists are parsed as structure, and they split cleanly into passages.",
            "**Put key facts in short sentences.** Claude's citations quote at most 150 characters.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Don't chop content for the machine",
          text: 'Splitting one idea across five thin sections, or publishing a page for every variant of a question, backfires. Google treats pages created "primarily to manipulate generative AI responses" as [scaled content abuse](/glossary/scaled-content-abuse).',
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with content chunking",
      answer:
        "The most common content chunking mistakes are sections that depend on the one before, headings too clever to say what's below them, answers buried after a long preamble, and key facts hidden in images, tabs or scripts a fetcher never sees.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Chunking means breaking content into tiny pieces.",
              reality:
                "Google says there's no need to, and tiny sections lose the evidence that makes them worth citing. The goal is self-contained sections, not short ones.",
            },
            {
              myth: "A long page gets more chances to be cited.",
              reality:
                "Only if its sections stand alone. A 4,000-word page with the answer buried in paragraph nine can have fewer winning passages than a focused 1,500-word page.",
            },
            {
              myth: "Headings are just for design.",
              reality:
                'Headings mark passage boundaries and tell retrieval what each passage is about. "Our approach" labels nothing; "How long does Plannora take to set up?" labels everything.',
            },
            {
              myth: "Content in tabs and accordions is fine.",
              reality:
                "Only if it's in the server-rendered HTML. Text injected by JavaScript on click is invisible to fetchers that don't run scripts — every major AI fetcher except Google's. See [server-side rendering](/glossary/server-side-rendering).",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Passage-Size Benchmarks",
    summary:
      "The published numbers that bound a good passage, from vendor documentation and large citation studies. Use them as guardrails when editing a section, not as quotas.",
    items: [
      {
        label: "Quotable sentence",
        body: "The most text a Claude web-search citation quotes from a page, per Anthropic's documentation. Put each key fact in a sentence this short.",
        value: "≤150 characters",
      },
      {
        label: "Section length",
        body: "In SE Ranking's study, ChatGPT citations rose with the words between headings: 2.7 on average under 50 words, 4.6 at 120–180 and 5.7 above 180. A correlation, not a rule — the clear lesson is to avoid thin sections.",
        value: "Over 120 words",
      },
      {
        label: "Where the answer sits",
        body: "44.2% of ChatGPT citations came from the first 30% of a page in Growth Memo's analysis of 1.2 million answers.",
        value: "First 30%",
      },
      {
        label: "Production chunk size",
        body: 'Anthropic describes typical RAG chunks as "usually no more than a few hundred tokens" — about one well-scoped section.',
        value: "A few hundred tokens",
      },
      {
        label: "Page weight Claude reads",
        body: "Anthropic estimates an average 10 kB web page at about 2,500 tokens; its fetcher truncates content beyond the limit a developer sets.",
        value: "10 kB ≈ 2,500 tokens",
      },
      {
        label: "HTML Googlebot fetches",
        body: "Content after the first 2 MB of a URL's HTML is not fetched, rendered or indexed.",
        value: "First 2 MB",
      },
    ],
    outcome:
      "Read the list from the sentence up: one fact in one short sentence, inside a focused section with enough substance to stand alone, near the top of a page light enough to be read in full. Each number comes from a different engine or study, so treat the set as a shared envelope rather than one engine's spec.",
  },

  related: [
    "answer-first-content",
    "reranking",
    "vector-embeddings",
    "retrieval-augmented-generation",
    "featured-snippet",
    "scaled-content-abuse",
  ],
  product: {
    feature: "seo-geo-score",
    pitch:
      "Rankbox scores every article before it publishes — one score for SEO, one for GEO — checking structure, headings, internal links, readability and citation-readiness, with specific fixes before anything goes live.",
  },
  tool: "content-brief-generator",
  further: [
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "How Perplexity parses pages into self-contained spans and reranks them per question.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "Why Claude's fetcher reads raw HTML, truncates long pages and quotes 150 characters at a time.",
    },
  ],
  sources: [
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
      title: "How AI is powering a more helpful Google (Search On 2020)",
      publisher: "Google",
      href: "https://blog.google/products/search/search-on/",
    },
    {
      title: "Introducing Contextual Retrieval",
      publisher: "Anthropic",
      href: "https://www.anthropic.com/news/contextual-retrieval",
    },
    {
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
    {
      title: "Web fetch tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
    {
      title: "44% of ChatGPT citations come from the first third of content",
      publisher: "Search Engine Land (Growth Memo study)",
      href: "https://searchengineland.com/chatgpt-citations-content-study-469483",
    },
    {
      title: "Googlebot's 2 MB fetch limit and rendering",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/03/crawler-blog-post",
    },
  ],
};
