import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "ai-mode",
  metaTitle: "What Is Google AI Mode? How It Works and How to Get Cited",
  metaDescription:
    "Google AI Mode is conversational search that answers complex questions with fan-out searches and follow-ups. How it works, how it differs from AI Overviews.",
  keywords: [
    "AI Mode",
    "Google AI Mode",
    "what is Google AI Mode",
    "AI Mode vs AI Overviews",
    "AI Mode SEO",
    "how to rank in Google AI Mode",
  ],

  whyItMatters:
    "AI Mode is where Google now handles the long, comparison-style questions that used to take a buyer five separate searches, and more than a billion people use it each month. Because it runs many searches per question and carries context into follow-ups, a small site that owns one narrow sub-question — pricing, setup, a specific comparison — can be cited in an answer about a category it would never rank for.",

  questions: [
    {
      id: "how-it-works",
      question: "How does Google AI Mode work?",
      answer:
        "Google AI Mode works by breaking a question into subtopics, running many related searches at once — the query fan-out technique — and writing one answer from the combined results, then keeping the context so the user can ask follow-ups instead of starting a new search.",
      blocks: [
        {
          kind: "p",
          text: "Google introduced AI Mode in March 2025 as an opt-in Labs experiment, saying it \"uses a 'query fan-out' technique, issuing multiple related searches concurrently across subtopics and multiple data sources.\" Deep Search inside AI Mode can issue hundreds of searches for one report, and Gemini 3.5 Flash has powered AI Mode since Google I/O in May 2026.",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "A complex question arrives",
              body: "Often long, comparative or multi-part — the kind that would take several classic searches.",
            },
            {
              title: "The model fans it out",
              body: "It writes related searches across subtopics and data sources, including the Shopping Graph for product questions. See [query fan-out](/glossary/query-fan-out).",
              lever: "Own a sub-question: a clear page for pricing, setup, comparisons and limits.",
            },
            {
              title: "Core ranking retrieves pages",
              body: "Each search is answered from Google's index by the normal ranking systems. The eligibility rules are the same as for AI Overviews.",
              lever: "Be indexed, snippet-eligible and set to Include in Search Console.",
            },
            {
              title: "A long answer with inline links",
              body: "AI Mode answers run about four times longer than AI Overviews, per Ahrefs, with inline links beside claims and a further-exploration list.",
            },
            {
              title: "Follow-ups continue the thread",
              body: "Context carries over, including follow-ups started from an AI Overview. In Search Console, each follow-up counts as a new query.",
            },
          ],
        },
      ],
    },
    {
      id: "ai-mode-vs-ai-overviews",
      question: "AI Mode vs AI Overviews: what's the difference?",
      answer:
        "AI Overviews are short summaries shown above classic Google results when Google judges them useful, while AI Mode is a full conversational experience with longer answers, heavier fan-out and follow-ups — and the two cite the same URL only 13.7% of the time.",
      blocks: [
        {
          kind: "table",
          head: ["", "AI Overviews", "AI Mode"],
          rows: [
            [
              "**Where it appears**",
              "Above classic results, on some queries",
              "Its own conversational experience in Search",
            ],
            [
              "**Answer length**",
              "A short summary",
              "About four times longer, naming more entities",
            ],
            ["**Follow-ups**", "Continue in AI Mode", "Built in; each logged as a new query"],
            ["**Model (2026)**", "Gemini 3", "Gemini 3.5 Flash"],
            ["**Eligibility and controls**", "Shared", "Shared"],
            ["**Reporting**", "Search Console Generative AI report", "The same report"],
          ],
        },
        {
          kind: "p",
          text: 'At I/O 2026 Google merged the two into "one seamless Search experience," so users move from an Overview into AI Mode without switching. They still pick sources differently: Ahrefs found they cited the same URL only 13.7% of the time, yet reached similar conclusions, with 86% semantic similarity. You optimize for both at once but should track them separately. See [AI Overviews](/glossary/ai-overviews).',
        },
      ],
    },
    {
      id: "how-to-get-cited",
      question: "How do you get cited in Google AI Mode?",
      answer:
        "Getting cited in Google AI Mode starts with the same eligibility bar as AI Overviews — indexed, snippet-eligible, included in Search generative AI — and then depends on pages that win the sub-questions AI Mode fans out to, since its answers draw on many searches.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Pass eligibility once.** Indexing, snippet eligibility and the Search Console setting are shared with AI Overviews. See [indexing](/glossary/indexing).",
            "**Map the follow-ups.** For each buyer question, list what they'd ask next — cost, setup time, integrations, alternatives — and give each a clearly titled page or section in a [topic cluster](/glossary/topic-cluster).",
            "**Publish non-commodity material.** Google asks for “unique expert or experienced takes” — first-hand tests, real numbers, screenshots.",
            "**Keep product and local data current.** AI Mode shops from the Shopping Graph, and agentic booking for local services launched in the US in 2026, so Merchant Center feeds and Business Profiles count.",
            "**Skip doorway variants.** Google treats pages made for every fan-out variant to manipulate AI answers as [scaled content abuse](/glossary/scaled-content-abuse).",
          ],
        },
      ],
    },
    {
      id: "how-to-track",
      question: "How do you track Google AI Mode?",
      answer:
        "Track Google AI Mode in Search Console's Generative AI report, which counts AI Mode impressions by page alongside AI Overviews — and remember two quirks: positions are counted as in regular Search, and every follow-up is logged as a new query.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Impressions:** the Generative AI report shows them by page, country, device and date — but no clicks.",
            "**Position:** AI Mode positions are counted as in regular Search, unlike AI Overviews, where every link shares the Overview's one position.",
            "**Follow-ups:** logged as new queries, so one conversation can add several queries to your totals.",
            "**Clicks:** blended into Organic Search from google.com in GA4, not the AI Assistant channel.",
            "**Citations:** a weekly [prompt tracking](/glossary/prompt-tracking) panel shows which conversations cite you and who's cited instead.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Test like a conversation",
          text: "A single prompt misses how AI Mode is used. Run your buyer question, then two or three natural follow-ups, and note where your brand enters or drops out of the thread.",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Follow-Up Ladder",
    summary:
      "AI Mode answers a conversation, not a single query, and buying conversations tend to climb four rungs. Map one page or section to each rung so that wherever the conversation goes next, a page of yours can answer it.",
    items: [
      {
        label: "Orient",
        body: "“What's the best project management tool for a five-person startup?” **Own it with:** a category explainer or “best X for Y” page that names its criteria honestly, including where you're not the best fit.",
      },
      {
        label: "Compare",
        body: "“Plannora vs Trello” or “alternatives to Trello.” **Own it with:** fair comparison pages built on real HTML tables that a model can parse and quote.",
      },
      {
        label: "Verify",
        body: "“Plannora pricing per user,” “does Plannora integrate with Gmail?” **Own it with:** official pricing, integration and policy pages on your own domain, with the fact stated in the first sentence.",
      },
      {
        label: "Act",
        body: "“How to move a team from spreadsheets to Plannora.” **Own it with:** setup guides, migration steps and templates — what buyers ask once they've mostly decided.",
      },
    ],
    outcome:
      "Plannora is a fictional example; swap in your own product. Score each rung as covered, weak or missing for your top five buyer questions, then fill Verify first: it's the cheapest to write, and official facts are the ones an engine most needs a primary source for. Compare comes next, because it's where buyers decide between you and the alternatives.",
  },

  related: [
    "ai-overviews",
    "query-fan-out",
    "ai-search-engine",
    "topic-cluster",
    "google-search-console",
    "zero-click-search",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox maps the questions your buyers ask ChatGPT, Perplexity and Google — including the follow-ups a conversation would reach — scores each for volume, difficulty and intent, and turns the winnable ones into articles.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Shared eligibility, separate citation behavior: the technical guide to both of Google's AI surfaces.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "Mapping fan-out and writing liftable passages, step by step.",
    },
  ],
  sources: [
    {
      title: "Expanding AI Overviews and introducing AI Mode",
      publisher: "Google",
      href: "https://blog.google/products/search/ai-mode-search/",
    },
    {
      title: "Search at I/O 2026",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/search-io-2026/",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "AI Overviews vs AI Mode",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overviews-vs-ai-mode/",
    },
    {
      title: "Alphabet Q2 2026 earnings remarks",
      publisher: "Alphabet",
      href: "https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/",
    },
    {
      title: "How Search Console counts position, clicks and impressions",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7042828",
    },
    {
      title: "Introducing Search generative AI performance reports",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports",
    },
  ],
};
