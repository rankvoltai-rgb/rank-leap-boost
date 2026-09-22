import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "large-language-model",
  metaTitle: "What Is a Large Language Model (LLM)? How It Shapes AI Answers",
  metaDescription:
    "A large language model (LLM) writes the answers in ChatGPT, Claude and Gemini. How LLMs work, when they search the web, and how to get your brand mentioned.",
  keywords: [
    "large language model",
    "LLM",
    "what is a large language model",
    "how do LLMs work",
    "LLM vs search engine",
    "how to get mentioned by LLMs",
  ],

  whyItMatters:
    "Every AI answer your buyers read is written by a large language model, and for each question the model either answers from what it memorized in training or searches the web first. For a small team that can't outspend category leaders, knowing which path a buyer question takes tells you where your hours go: into pages retrieval can find this month, or into the wider web presence the next model will learn from.",

  questions: [
    {
      id: "how-llms-work",
      question: "How do large language models work?",
      answer:
        "A large language model works by predicting the next token — a word or word fragment — over and over, using patterns learned from billions of pages of text, then fine-tuned with human feedback so its output reads as a helpful answer.",
      blocks: [
        {
          kind: "p",
          text: "Modern LLMs are built on the transformer, an architecture introduced by Google researchers in 2017 ([Vaswani et al.](https://arxiv.org/abs/1706.03762)) that lets the model weigh every word in a passage against every other. Scale did the rest: OpenAI's GPT-3 paper described a model with **175 billion parameters** trained mostly on filtered web crawl text ([Brown et al., 2020](https://arxiv.org/abs/2005.14165)). A second stage — fine-tuning on human preferences ([Ouyang et al., 2022](https://arxiv.org/abs/2203.02155)) — turned raw text predictors into assistants that follow instructions.",
        },
        {
          kind: "list",
          items: [
            "**Pre-training:** the model reads a huge corpus — see [LLM training data](/glossary/llm-training-data) — and learns which words tend to follow which. What it absorbs becomes its built-in knowledge.",
            "**Fine-tuning:** people rank the model's outputs and it is tuned toward the answers they prefer. This shapes tone, format and caution more than facts.",
            "**Generation:** at answer time the model writes one token at a time. It isn't looking anything up unless a search tool hands it sources, which is why it can state a wrong price with total confidence — an [AI hallucination](/glossary/ai-hallucination).",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Built-in knowledge has an end date",
          text: "Everything a model learned in pre-training stops at its [knowledge cutoff](/glossary/knowledge-cutoff). Your launch last month, your new pricing and your latest customer story don't exist for the model until it retrieves them from the live web.",
        },
      ],
    },
    {
      id: "do-llms-search",
      question: "Do large language models search the web?",
      answer:
        "Large language models search the web only when the product around them decides a question needs current or specific information; stable questions are answered from training alone, and independent tests found ChatGPT and Claude searched on roughly a third of prompts.",
      blocks: [
        {
          kind: "p",
          text: 'Search is a separate tool the model can call. Anthropic\'s [web search documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) spells out Claude\'s rule: it searches for recent events, current prices and "information about specific organizations, people, or products that might have changed," and answers directly for established facts, creative writing and analysis. OpenAI says ChatGPT "will choose to search the web based on what you ask." When the model does search, it follows the [retrieval-augmented generation](/glossary/retrieval-augmented-generation) pattern: fetch sources, then write from them.',
        },
        {
          kind: "stats",
          items: [
            {
              value: "34.5%",
              label: "of ChatGPT prompts triggered a web search in February 2026",
              source: {
                name: "Semrush, Feb 2026",
                href: "https://www.semrush.com/blog/chatgpt-search-insights/",
              },
            },
            {
              value: "36.6%",
              label: "of 400+ test prompts made Claude search the web",
              source: {
                name: "Profound, Jul 2026",
                href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
              },
            },
            {
              value: "7.61",
              label: "searches ChatGPT runs per prompt when it does search, after August 2026",
              source: {
                name: "Nectiv, Aug 2026",
                href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Read those rules from a buyer's side. Questions about a specific product — its price, its integrations, how it compares — are exactly the kind the vendors say trigger a search, so they're answered from live pages. Broad definitional questions are the ones most likely to be answered from memory.",
        },
      ],
    },
    {
      id: "llm-vs-search-engine",
      question: "LLM vs search engine: what's the difference?",
      answer:
        "A search engine retrieves and ranks existing pages, while a large language model generates new text — and AI search products combine the two, using a search index to find sources and an LLM to write one answer that cites a few of them.",
      blocks: [
        {
          kind: "table",
          head: ["", "Search engine", "Large language model", "AI search (both)"],
          rows: [
            [
              "**What it returns**",
              "A ranked list of pages",
              "Generated text",
              "A written answer with citations",
            ],
            [
              "**Where facts come from**",
              "The live index",
              "Training data, frozen at a cutoff",
              "Retrieved pages, with training filling gaps",
            ],
            [
              "**Freshness**",
              "As fresh as the last crawl",
              "Stops at the knowledge cutoff",
              "As fresh as the pages it retrieves",
            ],
            [
              "**Unit that competes**",
              "The page",
              "Nothing — there are no sources",
              "The passage it quotes",
            ],
            [
              "**Examples**",
              "Google, Bing, Brave",
              "A chatbot with search turned off",
              "ChatGPT search, Perplexity, AI Overviews",
            ],
          ],
        },
        {
          kind: "p",
          text: "The practical consequence: an [AI search engine](/glossary/ai-search-engine) is only as good as what its retrieval step finds, and each one retrieves from a different place. Perplexity runs its own 200-billion-URL index, Claude searches Brave, ChatGPT draws on Bing and OpenAI's own index, and Google's [AI Overviews](/glossary/ai-overviews) use Google's index. The model writes the answer; the index decides who is eligible to be in it. The [engine-by-engine guides](/ai-seo) cover each source.",
        },
      ],
    },
    {
      id: "get-mentioned",
      question: "How do you get a large language model to mention your brand?",
      answer:
        "Get a large language model to mention your brand by working on both of its memories: make your pages easy to retrieve and quote for the questions that trigger a search, and build a consistent presence across the web so future models learn your name in training.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Allow the search crawlers.** `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` and Googlebot feed the indexes models retrieve from. Blocking training bots like `GPTBot` is a separate decision. See [AI crawlers](/glossary/ai-crawlers).",
            "**Serve the text in the HTML.** OpenAI's, Anthropic's and Perplexity's fetchers don't run JavaScript, so [server-side rendering](/glossary/server-side-rendering) is the price of entry.",
            "**Answer the buyer's exact question early.** Engines lift passages, not pages. Write [answer-first](/glossary/answer-first-content) sections that name the product and state the fact.",
            "**Be talked about elsewhere.** Reviews, forums, press and video are what both retrieval and future training see. See [brand mentions](/glossary/brand-mentions).",
            "**Check the result.** Run a fixed set of buyer prompts every week and record who gets named — that's [prompt tracking](/glossary/prompt-tracking).",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "You can't edit what a model memorized",
          text: "If a model's training data says something outdated about you, no form or file corrects it. The fix is to make the right answer easy to retrieve, so questions that trigger a search get the current version, and to keep publishing so the next model learns it.",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Two-Memory Model",
    summary:
      "Every AI answer draws on one of two memories: what the model learned in training, and what it retrieves at the moment of the question. Sort each buyer question by which memory answers it, and you know which lever moves it.",
    items: [
      {
        label: "Trained memory",
        body: "What the model absorbed before its cutoff. It answers broad and stable questions, can't be edited, and changes only when a new model ships. **Lever:** a consistent, widely repeated description of your brand across your site, reviews, forums and press.",
      },
      {
        label: "The search decision",
        body: "The product decides, question by question, whether to search. Current, specific and product-level questions usually trigger it. **Lever:** none directly — but you can choose to target the questions that trigger search, because those are the ones you can win this month.",
      },
      {
        label: "Retrieved memory",
        body: "Pages fetched from an index at answer time. **Lever:** crawler access, server-rendered HTML, and indexing in the engine's source — Google, Bing, Brave or Perplexity's own index.",
      },
      {
        label: "The written answer",
        body: "The model quotes the passages that best match and names the brands in them. **Lever:** sections that state the product, the fact and the number in one self-contained sentence.",
      },
    ],
    outcome:
      "List your top 20 buyer questions, run each one, and mark it **T** (answered from trained memory, no citations) or **R** (triggers retrieval, shows sources). R questions are this quarter's writing list; T questions are a long-term mentions project. Pricing, comparison and alternatives questions are the kind the vendors' own rules say trigger a search, which makes them the fastest to move.",
  },

  related: [
    "retrieval-augmented-generation",
    "knowledge-cutoff",
    "llm-training-data",
    "ai-hallucination",
    "grounding",
    "ai-search-engine",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation — so you can see which buyer questions the models answer with you in them, and which without.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Where ChatGPT, Google AI Overviews, Gemini, Claude and Perplexity each retrieve from, and which crawler to allow for each.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "When Claude answers from training and when it searches Brave — and what that means for your pages.",
    },
  ],
  sources: [
    {
      title: "Attention Is All You Need",
      publisher: "Vaswani et al., NeurIPS 2017",
      href: "https://arxiv.org/abs/1706.03762",
    },
    {
      title: "Language Models are Few-Shot Learners",
      publisher: "Brown et al., OpenAI, 2020",
      href: "https://arxiv.org/abs/2005.14165",
    },
    {
      title: "Training language models to follow instructions with human feedback",
      publisher: "Ouyang et al., OpenAI, 2022",
      href: "https://arxiv.org/abs/2203.02155",
    },
    {
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
  ],
};
