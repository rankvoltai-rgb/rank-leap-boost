import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "search-intent",
  metaTitle: "What Is Search Intent? The 4 Types and How AI Search Changes Them",
  metaDescription:
    "Search intent is the goal behind a query. The four types, how to identify intent, and how ChatGPT, Perplexity and AI Overviews change which page wins.",
  keywords: [
    "search intent",
    "user intent",
    "keyword intent",
    "types of search intent",
    "what is search intent",
    "search intent in AI search",
  ],

  whyItMatters:
    "A small team can't afford a page that answers the wrong question: a how-to guide aimed at a query where buyers want a pricing or comparison page won't rank, won't be cited and won't convert. AI engines raise the stakes, because they answer many learn-something questions outright — so the pages that still earn a visit are the ones built for the step a buyer takes next.",

  questions: [
    {
      id: "types",
      question: "What are the types of search intent?",
      answer:
        "Search intent is usually sorted into four types — informational (learn), navigational (reach a site), commercial (compare options) and transactional (buy or sign up) — though many queries blend two, like “best CRM for startups”, which is comparison research with a purchase behind it.",
      blocks: [
        {
          kind: "table",
          head: ["Intent", "The searcher wants to", "Typical words", "The page that matches"],
          rows: [
            [
              "**Informational**",
              "Learn or understand",
              "how, what, why, guide",
              "Guide, explainer, definition",
            ],
            [
              "**Navigational**",
              "Reach a specific site or page",
              "a brand name, login, docs",
              "The official page itself",
            ],
            [
              "**Commercial**",
              "Compare options before choosing",
              "best, vs, alternatives, review",
              "Comparison, roundup, use-case page",
            ],
            [
              "**Transactional**",
              "Buy, sign up or book",
              "pricing, buy, free trial, demo",
              "Product, pricing or sign-up page",
            ],
          ],
        },
        {
          kind: "p",
          text: "The idea goes back to Andrei Broder's 2002 paper “A taxonomy of web search,” which split queries into navigational, informational and transactional. Most SEO tools now use four types, separating comparison research from the purchase itself, and Google's search quality rater guidelines use a parallel set: Know, Do, Website and Visit-in-person.",
        },
        {
          kind: "p",
          text: "Google puts the principle plainly in its explanation of how ranking works: “To return relevant results, we first need to establish what you're looking for — the intent behind your query.” The format of the pages that rank is Google's answer to that question, which is why a strong page in the wrong format rarely breaks in.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "How does search intent change in AI search?",
      answer:
        "In AI search, intent decides whether the engine searches at all, what shape the answer takes and whether anyone clicks: learn-something questions are often answered outright, while comparison, verification and buying intents send the engine to shortlists, official pages and product feeds.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "60% vs 8%",
              label:
                "of Google searches starting with a question word produced an AI summary, against one- or two-word searches",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
            {
              value: "65–85%",
              label: "of ChatGPT prompts matched no keyword in a 27-billion-keyword database",
              source: {
                name: "Semrush, Apr 2026",
                href: "https://www.semrush.com/blog/chatgpt-search-insights/",
              },
            },
            {
              value: "64%",
              label:
                "of ChatGPT's fan-out searches used site: to query specific domains after August 2026",
              source: {
                name: "Nectiv, Aug 2026",
                href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
              },
            },
          ],
        },
        {
          kind: "list",
          items: [
            "**Informational intent is answered in place.** Pew found people clicked a classic result on 8% of visits when an AI summary appeared, against 15% without. You can still be cited here, but expect fewer visits.",
            "**Verification intent goes to official pages.** ChatGPT's `site:` searches aim at brand, vendor and .gov domains, and “official” became one of the most common words in its sub-queries. A buyer checking your price is now served by your own clearly titled pricing page.",
            "**Commercial intent produces shortlists.** Answers name a handful of brands, and list-style pages feed them: listicles were 36.4% of the pages Claude cited in Profound's 2026 data, against 19.7% for ChatGPT.",
            "**Transactional intent moves to feeds.** ChatGPT's shopping results come from merchants' structured product data, and [AI Mode](/glossary/ai-mode) shops from Google's Shopping Graph — so a buying query may never reach an article.",
          ],
        },
        {
          kind: "p",
          text: "One prompt can also carry several intents at once. “Which CRM should a 10-person startup use?” is research, comparison and purchase in one sentence, and [query fan-out](/glossary/query-fan-out) splits it into sub-searches that each have a single intent. You compete for those one page at a time.",
        },
      ],
    },
    {
      id: "how-to-identify",
      question: "How do you identify search intent?",
      answer:
        "Identify search intent by reading what already wins: the modifiers in the query, the page types in Google's top 10, and the shape of the AI answer to the same question — then build the format all three point to.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Read the modifiers.** “How” and “what” signal learning; “best”, “vs” and “alternatives” signal comparison; “pricing”, “buy” and “free trial” signal a purchase; a brand name signals navigation.",
            "**Read the SERP.** If eight of the top 10 are comparison pages, Google has decided the query is commercial, and a how-to guide won't break in. Note the features too — a video carousel, a local pack or shopping results each say something about the goal. See [SERP](/glossary/serp).",
            "**Read the AI answer.** Ask ChatGPT, Perplexity or Google AI Mode the question the way a buyer would. A definition, a numbered process, a shortlist of brands and a comparison table are four different intents.",
            "**Check for mixed intent.** When the results split between two formats, the query has two intents. Serve the dominant one on this page and link to a separate page for the other.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Treat tool labels as a first pass",
          text: "Keyword tools assign intent automatically from the words in a query. That's a useful start, but the live results are Google's own answer to what the query means, and they move: Google runs “query deserves freshness” systems that change what ranks for a topic when something new happens.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with search intent",
      answer:
        "The most common search intent mistakes are writing a blog post for a query that wants a product or comparison page, stuffing several intents into one page, and treating AI prompts as if they were short keywords with a single goal.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "A good enough article can rank for any query.",
              reality:
                "Format mismatch beats quality. If Google shows pricing and product pages, a guide is competing against Google's idea of what the searcher wants, not against the other guides.",
            },
            {
              myth: "One page should cover every intent around a topic.",
              reality:
                "Split learn, compare and buy into separate pages linked together — a [topic cluster](/glossary/topic-cluster) — so each can be the best answer to one job. Two pages chasing the same intent cause [keyword cannibalization](/glossary/keyword-cannibalization).",
            },
            {
              myth: "Intent is fixed once you've classified a keyword.",
              reality:
                "Intent shifts with events and seasons. Google's own example: a search for “earthquake” usually returns preparation guides, but after an earthquake, news and fresher pages appear.",
            },
            {
              myth: "A prompt has the same intent as the keyword inside it.",
              reality:
                "Prompts carry context — team size, budget, stack — that narrows the goal. Write for the specific situation, which is where [long-tail keywords](/glossary/long-tail-keywords) and AI prompts overlap.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Three-Read Intent Test",
    summary:
      "A ten-minute check to run before writing any page: read what the query says, what Google shows and what the AI answer does, then commit to one format. When the three reads disagree, the query has mixed intent and needs two linked pages, not one compromise.",
    items: [
      {
        label: "Read the query",
        body: "Underline the modifiers and the context words. “Best project tool” and “best project tool for a 5-person agency on a budget” share a head term but not a goal. **Output:** the job the searcher is trying to finish.",
      },
      {
        label: "Read the SERP",
        body: "Count the page types in Google's top 10 — guides, comparisons, product pages, forum threads, videos. The majority type is the format Google believes fits. **Output:** the format to beat.",
      },
      {
        label: "Read the AI answer",
        body: "Run the query as a full question in ChatGPT, Perplexity and Google AI Mode. Note whether it searched, the shape of the answer and which pages it cited. **Output:** the passage you need to supply and the sources you're up against.",
      },
      {
        label: "Commit to one job",
        body: "If all three reads agree, build that format and answer the job in the page's first sentence. If they split, give this page the dominant intent and plan a linked page for the other. **Output:** one page, one intent, one opening answer.",
      },
    ],
    outcome:
      "Run it on your top 20 target queries before briefing anything. The queries where the reads disagree deserve the most care — they're where a single page is most likely to miss both the ranking and the citation.",
  },

  related: [
    "long-tail-keywords",
    "query-fan-out",
    "answer-first-content",
    "keyword-cannibalization",
    "serp",
    "topic-cluster",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox maps the questions your buyers ask ChatGPT, Perplexity and Google, scores each one for volume, difficulty and intent, and turns the winnable ones into articles — so every page starts from a question whose intent you've already read.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "How ChatGPT, Google AI Overviews, Gemini, Claude and Perplexity decide when to search and what to cite.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "Finding buyer questions and writing the page each one needs, step by step.",
    },
  ],
  sources: [
    {
      title: "How Search works: ranking results",
      publisher: "Google",
      href: "https://www.google.com/search/howsearchworks/how-search-works/ranking-results/",
    },
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title: "A taxonomy of web search",
      publisher: "Andrei Broder, SIGIR Forum 2002",
      href: "https://sigir.org/files/forum/F2002/broder.pdf",
    },
    {
      title: "Search Quality Rater Guidelines",
      publisher: "Google",
      href: "https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf",
    },
    {
      title: "Google users are less likely to click on links when an AI summary appears",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
    {
      title: "Shopping with ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
  ],
};
