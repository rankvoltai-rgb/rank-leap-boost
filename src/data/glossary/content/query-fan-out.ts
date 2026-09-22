import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "query-fan-out",
  metaTitle: "What Is Query Fan-Out? How AI Search Splits Your Question",
  metaDescription:
    "Query fan-out is how ChatGPT, Google AI Mode and other AI engines split one question into many searches. How it works, why it matters, and how to optimize.",
  keywords: [
    "query fan-out",
    "fan-out queries",
    "what is query fan-out",
    "query fan-out SEO",
    "AI Mode query fan-out",
    "ChatGPT fan-out",
  ],

  whyItMatters:
    "Fan-out is why a small site can be cited next to a category leader: the engine isn't searching for your competitor's head term, it's searching for a dozen narrower questions, and many of them have no great answer yet. For a founder with limited time, that turns the plan from “outrank the big players” into “own the follow-up questions they ignore.”",

  questions: [
    {
      id: "how-it-works",
      question: "How does query fan-out work?",
      answer:
        "The engine reads the question, writes several narrower searches that together cover it — sub-topics, comparisons, specifics like price or location — runs them in parallel, and writes one answer from the combined results.",
      blocks: [
        {
          kind: "p",
          text: 'Google introduced the name when it launched [AI Mode](/glossary/ai-mode), saying it uses a "query fan-out technique" that breaks a question into subtopics and issues a multitude of queries simultaneously. OpenAI describes the same step for ChatGPT search: it "typically rewrites your query into one or more targeted queries." Both then [rerank](/glossary/reranking) the pooled results and cite the passages they use.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "The user asks one question",
              body: "“What's the best CRM for a 10-person startup?”",
            },
            {
              title: "The engine fans it out",
              body: "It writes narrower searches: best CRM for small teams this year, CRM pricing per user, easiest CRM to set up, specific product comparisons — and, increasingly, `site:` searches of vendors' own domains.",
              lever:
                "Have a clearly titled page for each sub-question a buyer checks: pricing, setup, integrations, comparisons.",
            },
            {
              title: "Results are pooled and reranked",
              body: "Candidates from every sub-query compete in one pool. A page that answers one sub-query well can beat a page that ranks for the original question.",
              lever: "Answer the sub-question in the section's first sentence.",
            },
            {
              title: "The answer cites the passages it used",
              body: "Citations point at the pages behind each claim, which is why the cited list rarely matches the classic top ten.",
            },
          ],
        },
      ],
    },
    {
      id: "how-many",
      question: "How many searches does an AI engine run per question?",
      answer:
        "It varies by engine and by question: ChatGPT jumped from about two sub-queries per prompt to about 7.6 in August 2026, and Google says Deep Search in AI Mode can issue hundreds of searches for one question.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "7.61",
              label: "ChatGPT fan-out searches per prompt after August 2026, up from 2.17",
              source: {
                name: "Nectiv, Aug 2026",
                href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
              },
            },
            {
              value: "64%",
              label: "of those ChatGPT fan-outs used the site: operator to search specific domains",
              source: {
                name: "Nectiv, Aug 2026",
                href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
              },
            },
            {
              value: "37.9%",
              label:
                "of pages cited in Google AI Overviews rank top 10 for the query the user typed",
              source: {
                name: "Ahrefs, Mar 2026",
                href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: 'The August 2026 shift matters most for brands: `site:` fan-outs go straight to domains the engine already treats as authoritative — the vendor itself, regulators, standards bodies — and "official" became one of the most common words in ChatGPT\'s sub-queries. The fastest way into an answer about your product is now your own clearly titled page.',
        },
      ],
    },
    {
      id: "fan-out-vs-long-tail",
      question: "Query fan-out vs long-tail keywords: what's the difference?",
      answer:
        "Long-tail keywords are narrow queries people type; fan-out queries are narrow queries the engine writes on the user's behalf — so you can't see them in a keyword tool, but they reward the same thing: specific pages for specific questions.",
      blocks: [
        {
          kind: "p",
          text: "Classic [long-tail keyword](/glossary/long-tail-keywords) research starts from search volume. Fan-out has no published volume: sub-queries are generated fresh for each prompt and rarely logged anywhere you can access. The practical workaround is to reason from the buyer's decision — what would they need to check before choosing? — and to watch which pages get cited in [prompt tracking](/glossary/prompt-tracking).",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "See real fan-outs yourself",
          text: "Some engines show their work. Perplexity and ChatGPT often display the searches they ran while answering. Run your top buyer prompts and write down every sub-query you see.",
        },
      ],
    },
    {
      id: "how-to-optimize",
      question: "How do you optimize for query fan-out?",
      answer:
        "Map the sub-questions a buyer's prompt would trigger, make sure each one has a page or a clearly headed section that answers it in the first sentence, and title those pages the way the engine would search.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**List the decision questions** behind each buyer prompt: price, setup time, integrations, who it's for, alternatives, proof.",
            "**Build official pages for facts** buyers verify — pricing, specs, policies, comparisons — so `site:` searches land on your domain, not a reseller's.",
            "**Title for the sub-query**: natural-language titles, H2s and slugs that read like the search (“CRM pricing per user”), not clever headlines.",
            "**Write [answer-first](/glossary/answer-first-content)** so the matching passage can be lifted without the paragraphs around it.",
            "**Link the cluster together** with [internal links](/glossary/internal-linking), so an engine that lands on one page can reach the rest.",
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Fan-Out Coverage Map",
    summary:
      "A way to estimate how much of an AI answer you could be cited in: list the sub-queries a prompt is likely to trigger, then check which ones your site answers. The inputs below are illustrative, for a fictional CRM called Plannora — swap in your own prompt.",
    items: [
      {
        label: "Pick one buyer prompt",
        body: "“What's the best CRM for a 10-person startup?”",
        value: "1 prompt",
      },
      {
        label: "List its likely sub-queries",
        body: "Best CRM for small teams 2026 · CRM pricing per user · easiest CRM to set up · Plannora vs HubSpot · CRM with Gmail integration · `site:plannora.io pricing`",
        value: "6 sub-queries",
      },
      {
        label: "Match each to a page that answers it first",
        body: "Pricing page ✓ · Gmail integration doc ✓ · no setup guide ✗ · no comparison page ✗ · no small-team page ✗ · no roundup mention ✗",
        value: "2 of 6",
      },
      {
        label: "Coverage",
        body: "2 ÷ 6 — the share of the answer you can currently be cited for.",
        value: "33%",
      },
    ],
    outcome:
      "The map turns “we're not in ChatGPT” into a build list: a setup guide, a vs-HubSpot page and a small-team page lift coverage to 5 of 6 (83%) — and the one gap left, third-party roundups, is an outreach job, not a writing job. Repeat for your top 10 prompts and fix the sub-queries that appear most often first.",
  },

  related: [
    "ai-mode",
    "long-tail-keywords",
    "reranking",
    "retrieval-augmented-generation",
    "topic-cluster",
    "generative-engine-optimization",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox maps the questions your buyers ask ChatGPT, Perplexity and Google — including the follow-ups a fan-out would search — scores each for volume, difficulty and intent, and turns the gaps into articles.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "How ChatGPT's fan-out works, including the August 2026 shift to site: searches.",
    },
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description: "How Google fans queries out and what the citation data shows.",
    },
  ],
  sources: [
    {
      title: "Expanding AI Overviews and introducing AI Mode",
      publisher: "Google",
      href: "https://blog.google/products/search/ai-mode-search/",
    },
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
  ],
};
