import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "long-tail-keywords",
  metaTitle: "What Are Long-Tail Keywords? Why They Matter More in AI Search",
  metaDescription:
    "Long-tail keywords are specific, low-volume searches with precise intent. How much demand they hold, how AI prompts stretch the tail, and how to find them.",
  keywords: [
    "long-tail keywords",
    "long tail keywords",
    "long-tail SEO",
    "what are long-tail keywords",
    "how to find long-tail keywords",
    "conversational long-tail keywords",
  ],

  whyItMatters:
    "Head terms belong to brands with years of links, but the specific questions your buyers ask — with their team size, budget and stack attached — often have no page written for them at all. Long-tail keywords are where a small team can win now, and they're also the closest thing classic SEO has to the full-sentence prompts buyers type into ChatGPT.",

  questions: [
    {
      id: "share-of-demand",
      question: "Do long-tail keywords make up most searches?",
      answer:
        "Long-tail keywords make up the vast majority of distinct searches — about 93% of keywords in Ahrefs' US database get fewer than 10 searches a month, and roughly 15% of Google searches each day are brand new — though keyword tools, which count volume phrase by phrase, show most measured volume sitting in head terms.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "~93%",
              label: "of keywords in Ahrefs' US database get fewer than 10 searches a month",
              source: {
                name: "Ahrefs, updated May 2026",
                href: "https://ahrefs.com/blog/long-tail-keywords/",
              },
            },
            {
              value: "15%",
              label: "of the queries Google processes each day have never been searched before",
              source: {
                name: "Google, 2018",
                href: "https://blog.google/products/search/reintroduction-googles-featured-snippets/",
              },
            },
            {
              value: "3.3%",
              label:
                "of measured search volume came from keywords with 1–100 monthly searches, though they were 91.8% of keywords",
              source: {
                name: "Backlinko, 306M keywords",
                href: "https://backlinko.com/google-keyword-study",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Both pictures are true at once. Each long-tail phrase is tiny, head terms carry most of the volume that tools can measure, and the tail is so long and so new that no database lists it all. The practical reading: don't size an opportunity by one phrase's volume. A page that fully answers one specific question tends to rank for many related phrasings — what Ahrefs calls supporting long-tail keywords.",
        },
        {
          kind: "p",
          text: "Length isn't the definition, either. Ahrefs points out that some one-word keywords get under 100 searches a month while some five-word keywords get hundreds of thousands. The tail is about low demand and high specificity.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "How are long-tail keywords different in AI search?",
      answer:
        "In AI search the long tail gets longer and harder to measure: people type full questions with context into ChatGPT and AI Mode, most of those prompts match no keyword in any database, and the engine then turns each prompt into narrower sub-searches of its own.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "65–85%",
              label:
                "of ChatGPT prompts couldn't be matched to any keyword in a 27-billion-keyword database",
              source: {
                name: "Semrush, Apr 2026",
                href: "https://www.semrush.com/blog/chatgpt-search-insights/",
              },
            },
            {
              value: "8.7",
              label:
                "words on average in ChatGPT prompts that triggered a search in early 2026, up from 4.7 a year earlier",
              source: {
                name: "Semrush, Apr 2026",
                href: "https://www.semrush.com/blog/chatgpt-search-insights/",
              },
            },
            {
              value: "53% vs 8%",
              label:
                "of Google searches with 10+ words produced an AI summary, against one- or two-word searches",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Ahrefs calls these conversational long-tail keywords and estimates that over 95% have no measurable search volume — “not because nobody is searching, but because everybody is searching differently.” Google's AI features guide makes the same point from the other side: AI systems understand synonyms and meaning, so “you don't have to worry that you don't have enough ‘long-tail’ keywords or haven't captured every variation of how someone might seek content like yours.”",
        },
        {
          kind: "p",
          text: "The target shifts from phrasings to questions. Long-tail keywords are what people type; [query fan-out](/glossary/query-fan-out) searches are what the engine types on their behalf — and both reward one clear page per specific question.",
        },
      ],
    },
    {
      id: "how-to-find",
      question: "How do you find long-tail keywords?",
      answer:
        "Find long-tail keywords where buyers phrase their problems — Google's autocomplete and People also ask, sales and support conversations, forums and Reddit threads, and the prompts buyers put to AI assistants — then group phrasings that share one intent into a single page.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Start from the buyer's situation**, not a seed keyword: their role, team size, stack and the job they're stuck on.",
            "**Mine the questions you already hear.** Sales calls, demo notes and support tickets are long-tail lists no competitor can export.",
            "**Harvest Google's suggestions**: autocomplete, People also ask and related searches for each core question.",
            "**Read the threads.** Reddit and niche forums show the exact wording buyers use, and often which answers they found missing.",
            "**Ask the AI assistants** your buyers use, and note the follow-up questions and searches they show.",
            "**Group by [search intent](/glossary/search-intent) before writing.** Phrasings a searcher would expect answered on one page belong together; a question that needs its own answer gets its own page in a [topic cluster](/glossary/topic-cluster).",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Don't build a page per phrasing",
          text: "Google says creating “separate content for every possible variation of how people might search” primarily to manipulate rankings or AI responses violates its [scaled content abuse](/glossary/scaled-content-abuse) policy. [Programmatic SEO](/glossary/programmatic-seo) works only when each page carries unique, useful data.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with long-tail keywords",
      answer:
        "The most common long-tail mistakes are dismissing queries because a tool shows zero volume, defining the long tail by word count instead of demand, and publishing a thin page for every variation instead of one strong page per intent.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Zero volume in a keyword tool means zero demand.",
              reality:
                "Tools can't see brand-new or conversational queries. Around 15% of Google's daily searches are new, and most AI prompts match no keyword at all.",
            },
            {
              myth: "Long-tail means long.",
              reality:
                "Some one-word keywords are long-tail and some five-word ones are head terms. Judge by demand and specificity, not word count.",
            },
            {
              myth: "Every variation needs its own page.",
              reality:
                "Google says its AI systems understand synonyms, and mass-producing variants risks its spam policy. One page per intent, answered fully, covers the variations.",
            },
            {
              myth: "Long-tail traffic is too small to matter.",
              reality:
                "Ahrefs notes long-tail queries often convert better because they're more specific, and one page can rank for dozens of related phrasings. Use [keyword difficulty](/glossary/keyword-difficulty) to find the winnable ones, then stack them.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Long-Tail Demand Stack",
    summary:
      "A way to compare one head term with a stack of long-tail questions for the same product. Every figure below is illustrative, for Plannora, a fictional project management tool — swap in your own volume and difficulty numbers.",
    items: [
      {
        label: "The head term",
        body: "“project management software”: big volume, but the top 10 belongs to category leaders with years of links. Keyword difficulty 90 out of 100.",
        value: "40,000/mo",
      },
      {
        label: "Plannora's realistic share of it",
        body: "Assume a young site won't reach page one for that term this year, and plan on no clicks from it.",
        value: "≈ 0 clicks",
      },
      {
        label: "Twenty-five long-tail questions",
        body: "“project management for a 5-person design agency”, “how to track client approvals”, “Plannora vs Trello for freelancers” and 22 more, each 40–300 searches a month.",
        value: "3,200/mo",
      },
      {
        label: "The winnable ones",
        body: "Low difficulty and no strong page answering them yet: 15 of the 25.",
        value: "1,900/mo",
      },
      {
        label: "Clicks at an assumed 10% click share",
        body: "If each page earns about a tenth of its query's searches — an assumption for the example, not a benchmark — the stack sends roughly 190 visits a month, before counting the related phrasings each page also ranks for.",
        value: "≈ 190/mo",
      },
    ],
    outcome:
      "190 specific visits beat zero generic ones, and the real total is likely higher: tools miss most conversational phrasings, and each of the 15 pages is also a candidate answer for the sub-questions AI engines search. Build the long tail first, and revisit the head term once the cluster has earned links.",
  },

  related: [
    "query-fan-out",
    "search-intent",
    "keyword-difficulty",
    "topic-cluster",
    "programmatic-seo",
    "keyword-cannibalization",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox maps the questions your buyers ask ChatGPT, Perplexity and Google — including the conversational phrasings that rarely show up in keyword tools — scores each for volume, difficulty and intent, and turns the winnable ones into articles.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description: "How ChatGPT rewrites one prompt into several targeted searches.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "Finding the questions buyers ask and writing one page for each.",
    },
  ],
  sources: [
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "A reintroduction to Google's featured snippets",
      publisher: "Google",
      href: "https://blog.google/products/search/reintroduction-googles-featured-snippets/",
    },
    {
      title: "Long-tail keywords: what they are and how to get search traffic from them",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/long-tail-keywords/",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
    {
      title: "Google users are less likely to click on links when an AI summary appears",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
    {
      title: "Google keyword study: 306 million keywords",
      publisher: "Backlinko",
      href: "https://backlinko.com/google-keyword-study",
    },
  ],
};
