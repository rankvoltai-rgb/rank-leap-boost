import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "llm-training-data",
  metaTitle: "What Is LLM Training Data? How AI Learns What It Knows About You",
  metaDescription:
    "LLM training data is the text a model learns from before release. What's in it, how it shapes what AI says about your brand, and whether to block training bots.",
  keywords: [
    "LLM training data",
    "AI training data",
    "what data are LLMs trained on",
    "parametric knowledge",
    "should I block AI training crawlers",
    "get my brand into LLM training data",
  ],

  whyItMatters:
    "Most AI answers never trigger a web search, so what a model says about your category comes from what it learned in training — and a brand that barely appeared in that data is a brand the model doesn't think to recommend. For a small team this is a long game worth starting early, because every consistent mention of you on the open web now is raw material for the next model.",

  questions: [
    {
      id: "what-data",
      question: "What data are large language models trained on?",
      answer:
        "Large language models are trained mainly on filtered web crawls, plus books, code, encyclopedias, forum discussions and licensed content — the GPT-3 paper, for example, gave a filtered Common Crawl 60% of the weight in its training mix.",
      blocks: [
        {
          kind: "p",
          text: "Vendors rarely publish full data recipes any more, so the clearest public example is still OpenAI's [GPT-3 paper](https://arxiv.org/abs/2005.14165) from 2020. Its training mix:",
        },
        {
          kind: "table",
          head: ["Dataset", "What it is", "Weight in the mix"],
          rows: [
            ["Common Crawl (filtered)", "A broad web crawl, quality-filtered", "60%"],
            ["WebText2", "Web pages linked from Reddit posts", "22%"],
            ["Books1 and Books2", "Two internet-based book corpora", "16% (8% each)"],
            ["Wikipedia", "English-language Wikipedia", "3%"],
          ],
        },
        {
          kind: "p",
          text: 'Two things stand out. Web crawl dominates, and [Common Crawl](https://commoncrawl.org/) — a free corpus of "over 300 billion pages spanning 15 years" — sits under many open training datasets. And quality is weighted, not just volume: the paper sampled datasets it judged higher quality more often, which is how a Reddit-curated set of pages outweighed its size. Licensing has since formalized that value: in February 2024 Google announced access to Reddit\'s Data API to "display, train on, and otherwise use" Reddit content ([Google](https://blog.google/inside-google/company-announcements/expanded-reddit-partnership/)).',
        },
      ],
    },
    {
      id: "training-vs-retrieval",
      question: "Training data vs retrieval: what's the difference for my brand?",
      answer:
        "Training data is what a model memorized before release and can't be edited until the next model ships, while retrieval is what it looks up at answer time from a search index — so training shapes unprompted recommendations, and retrieval shapes answers that cite sources.",
      blocks: [
        {
          kind: "table",
          head: ["", "Training data (parametric knowledge)", "Retrieval"],
          rows: [
            [
              "**When it's collected**",
              "Before the model's [knowledge cutoff](/glossary/knowledge-cutoff)",
              "At the moment of the question",
            ],
            [
              "**Which answers use it**",
              "Most — ChatGPT and Claude searched on only about a third of prompts in 2026 tests",
              "Current, specific, product-level questions",
            ],
            ["**Shows citations?**", "No", "Yes"],
            [
              "**How fast you can change it**",
              "Months to years — at the next model",
              "Days to weeks — at the next crawl",
            ],
            [
              "**Crawlers that collect it**",
              "`GPTBot`, `ClaudeBot`, `Google-Extended` (a token, not a bot), `CCBot`",
              "`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, Googlebot",
            ],
          ],
        },
        {
          kind: "p",
          text: "The two are separate on purpose. OpenAI, Anthropic and Google each split training from search into different robots.txt tokens, so you can opt out of one without touching the other. See [retrieval-augmented generation](/glossary/retrieval-augmented-generation) for how the retrieval side works.",
        },
      ],
    },
    {
      id: "block-training-crawlers",
      question: "Should you block AI training crawlers?",
      answer:
        "Block AI training crawlers only if keeping your content out of future models matters more than being known to them. Brands that want to be recommended usually allow them — and blocking `GPTBot` or `ClaudeBot` doesn't remove you from AI search, though disallowing `Google-Extended` also ends Gemini-app grounding.",
      blocks: [
        {
          kind: "crawlers",
          bots: [
            {
              token: "GPTBot",
              role: "training",
              purpose:
                "Collects content that may train OpenAI's models. Independent of `OAI-SearchBot`, which controls ChatGPT search.",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "ClaudeBot",
              role: "training",
              purpose:
                "Collects public content that may train future Claude models. Blocking it doesn't affect Claude's search, which uses `Claude-SearchBot` and `Claude-User`.",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "Google-Extended",
              role: "training",
              purpose:
                "A robots.txt token for Gemini training **and** grounding in the Gemini app and Vertex AI. It doesn't affect Google Search or AI Overviews.",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "CCBot",
              role: "other",
              purpose:
                "Common Crawl's crawler. Its free web archive is a common ingredient in open training datasets.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "Blocking training is a real trade-off. Most answers never search, so opting out keeps your future content out of the majority of answers. If your content is your product — a publisher, a paid dataset — that can be the right call. If you sell software or services and want to be recommended, being learned is usually the point. The free [AI robots.txt generator](/tools/ai-robots-txt-generator) makes each choice explicit, and [GPTBot](/glossary/gptbot), [ClaudeBot](/glossary/claudebot) and [Google-Extended](/glossary/google-extended) each have their own entry.",
        },
      ],
    },
    {
      id: "get-into-training-data",
      question: "How do you get your brand into LLM training data?",
      answer:
        "Get your brand into LLM training data by being described consistently, and often, in the open web sources training sets draw from: your own crawlable site, publications, reference sites, forums and review platforms — ideally in the same words everywhere.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Keep your own site crawlable** by training bots if you want it learned, with a plain-language description of what you do on the homepage and About page.",
            "**Use one consistent description.** The same name, category and one-line positioning across your site, profiles and directories. Repetition is how a pattern gets learned.",
            "**Earn discussion in communities.** Reddit content is licensed to Google for training, and GPT-3's WebText2 was built from Reddit-linked pages. Genuinely useful answers in threads about your category count — see [Reddit SEO](/glossary/reddit-seo).",
            "**Get covered by publications and reference sites** where you're genuinely notable. See [digital PR](/glossary/digital-pr) and [brand mentions](/glossary/brand-mentions).",
            "**Publish things worth quoting.** Original data and first-hand guides get cited and repeated across the web, multiplying the mentions a crawler sees.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "No submission form, and no delete button",
          text: "There's no way to submit your brand to a training set, and nothing already learned can be edited until the next model is trained. Any service that promises to \"inject\" you into a model's memory is selling something that doesn't exist as a mechanism.",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Parametric Footprint Map",
    summary:
      "A way to audit how much of your brand a future model can learn, by checking the five kinds of sources training sets are built from. Mark each one present, thin or missing, then fill the gaps from the top of the list you can control.",
    items: [
      {
        label: "Your own site",
        body: "Crawlable by training bots, with a clear, consistent statement of what you do. **Check:** robots.txt rules for `GPTBot`, `ClaudeBot`, `Google-Extended` and `CCBot`, and whether your homepage says what you do in one sentence.",
      },
      {
        label: "Reference sources",
        body: "Encyclopedias, industry directories and databases where you're genuinely notable. **Check:** search for your brand on the reference sites your industry uses.",
      },
      {
        label: "Publications",
        body: "Trade press, newsletters and podcasts with transcripts. **Check:** count the independent articles that mention you by name in the past year.",
      },
      {
        label: "Communities",
        body: "Reddit, forums and Q&A sites, where real users describe you in their own words. **Check:** search Reddit for your brand and for your category's main questions.",
      },
      {
        label: "Reviews and marketplaces",
        body: "Review sites, app stores and marketplaces. **Check:** whether your listings exist and match your current positioning and pricing.",
      },
    ],
    outcome:
      "The map shows where your brand is thin before the next model is trained on the web. Your own site is the one row you can fix today; community and publication presence take months to build and can't be bought quickly, so start them now rather than after a launch.",
  },

  related: [
    "knowledge-cutoff",
    "large-language-model",
    "gptbot",
    "claudebot",
    "google-extended",
    "brand-mentions",
  ],
  product: {
    feature: "reddit-presence",
    pitch:
      "Rankbox finds the Reddit threads that rank on Google and feed AI answers, drafts a genuinely useful reply that says who you are, and hands it to you to post under your own name — Rankbox never posts.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Which crawler controls search and which controls training, for ChatGPT, Google, Gemini, Claude and Perplexity.",
    },
    {
      title: "Gemini SEO: the technical guide",
      href: "/ai-seo/gemini",
      description:
        "Why disallowing Google-Extended opts you out of Gemini-app grounding as well as training.",
    },
  ],
  sources: [
    {
      title: "Language Models are Few-Shot Learners",
      publisher: "Brown et al., OpenAI, 2020",
      href: "https://arxiv.org/abs/2005.14165",
    },
    {
      title: "Common Crawl",
      publisher: "Common Crawl Foundation",
      href: "https://commoncrawl.org/",
    },
    {
      title: "CCBot",
      publisher: "Common Crawl Foundation",
      href: "https://commoncrawl.org/ccbot",
    },
    {
      title: "An expanded partnership with Reddit",
      publisher: "Google",
      href: "https://blog.google/inside-google/company-announcements/expanded-reddit-partnership/",
    },
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
    {
      title: "Does Anthropic crawl data from the web, and how can site owners block the crawler?",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    {
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
  ],
};
