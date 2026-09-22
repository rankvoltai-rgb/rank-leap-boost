import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "serp",
  metaTitle: "What Is a SERP? Search Results Pages and Features in the AI Era",
  metaDescription:
    "A SERP is the page a search engine returns for a query, now mixing blue links, AI Overviews, ads and forums. What's on it, how AI changed it, and how to read one.",
  keywords: [
    "SERP",
    "search engine results page",
    "what is a SERP",
    "SERP features",
    "SERP analysis",
    "AI Overviews on the SERP",
  ],

  whyItMatters:
    "The SERP is where your buyer decides whether you're worth a click, and it no longer looks like ten blue links: an AI answer, ads, videos and forum threads now compete for the same glance. For a small team, reading the SERP before writing is the cheapest research there is — it shows what Google thinks the searcher wants, whether a click is even likely, and which slot a new page could realistically take.",

  questions: [
    {
      id: "serp-features",
      question: "What are SERP features?",
      answer:
        "SERP features are the results that aren't classic blue links — AI Overviews, featured snippets, People Also Ask boxes, video results, forum threads, rich results and ads — and each one is a separate way onto the page, with its own rules for getting in.",
      blocks: [
        {
          kind: "table",
          head: ["Feature", "What it is", "How you get in"],
          rows: [
            [
              "**AI Overview**",
              "A generated summary at the top, linking to the pages it drew on",
              "Be indexed and snippet-eligible, and answer the sub-questions it searches — see [AI Overviews](/glossary/ai-overviews)",
            ],
            [
              "**Featured snippet**",
              "An excerpt from one page, shown as the direct answer",
              "A clear, concise answer under a matching heading — see [featured snippet](/glossary/featured-snippet)",
            ],
            [
              "**People Also Ask**",
              "What Google calls the related questions group: expandable follow-up questions",
              "Answer those follow-ups directly on your page",
            ],
            [
              "**Video results**",
              "Videos with thumbnails, often from YouTube",
              "Publish video on the topic",
            ],
            [
              "**Forum threads**",
              "Discussions from Reddit and other communities",
              "Take part genuinely — see [Reddit SEO](/glossary/reddit-seo)",
            ],
            [
              "**Rich results**",
              "Results with extra detail from structured data, such as ratings or prices",
              "Valid [schema markup](/glossary/schema-markup) that matches the page",
            ],
            [
              "**Ads**",
              "Paid results above and below the organic list",
              "Pay; they push organic results down",
            ],
          ],
        },
        {
          kind: "p",
          text: "Local packs, knowledge panels, top stories and shopping results join them depending on the query, and the mix shifts over time. Check the live page for the queries you care about rather than assuming what's on it.",
        },
      ],
    },
    {
      id: "ai-overviews-serp",
      question: "How have AI Overviews changed the SERP?",
      answer:
        "AI Overviews put a generated answer above the organic results for a large share of question-style searches, so more searches end on the SERP itself: Pew found users clicked a classic result on 8% of visits with an AI summary, against 15% without one.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "60%",
              label:
                "of searches starting with a question word produced an AI summary, against 8% of one- or two-word searches",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
            {
              value: "68%",
              label: "of US Google searches ended without a click in January–April 2026",
              source: {
                name: "SparkToro, Jun 2026",
                href: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
              },
            },
            {
              value: "2.5B+",
              label: "monthly users of AI Overviews, announced at Google I/O 2026",
              source: {
                name: "Google, May 2026",
                href: "https://blog.google/innovation-and-ai/sundar-pichai-io-2026/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Longer, question-shaped searches — the kind buyers type while researching — are the ones most likely to be topped by an AI answer: Pew saw summaries on 53% of searches of ten words or more. Since May 2026 Google has also merged AI Overviews and [AI Mode](/glossary/ai-mode) into one experience, placed more inline links beside the generated text, and started surfacing forum and social perspectives inside answers. The result is more [zero-click searches](/glossary/zero-click-search) and a lower ceiling on organic clicks.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "The SERP you see isn't the only one that counts",
          text: "To write an AI Overview, Google fans the query out into related searches, each with its own results. In Ahrefs' March 2026 data only 37.9% of cited pages ranked top 10 for the query the user typed — the rest won one of the unseen results pages behind it.",
        },
      ],
    },
    {
      id: "how-to-analyze",
      question: "How do you analyze a SERP before writing?",
      answer:
        "Analyze a SERP by searching the query in a clean session and recording what kind of page ranks, which features sit above the organic results, which sources any AI Overview cites and whether smaller sites make the top 10 — together that tells you the format to write and whether a click is likely.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Search clean.** Use a logged-out or private window, set to the country your buyers are in.",
            "**Name the dominant page type.** Guides, product pages, listicles, tools or forum threads: that's Google's read of [search intent](/glossary/search-intent), and fighting it rarely works.",
            "**Count what sits above result one.** Ads, an AI Overview, a featured snippet, a video carousel. Each pushes the first organic link down and lowers the [click-through rate](/glossary/click-through-rate) you can expect.",
            "**Open the AI Overview's sources.** Note which pages it cites and which sub-questions it covers. Those are the passages to beat.",
            "**Check who ranks.** Small sites and forum threads in the top 10 suggest the query is winnable without a big link profile; ten household names suggest a narrower question.",
            "**Read People Also Ask.** Each question is a candidate section heading, or a page of its own.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Preview your own result",
          text: "Once the page is written, check how its title and description will display with the [SERP snippet preview](/tools/serp-snippet-preview). Google truncates both as needed, typically to fit the device width.",
        },
      ],
    },
    {
      id: "serp-vs-ai-answer",
      question: "SERP vs AI answer: what's the difference?",
      answer:
        "A SERP is a ranked list of results the user chooses from; an AI answer is a written response that has already chosen a few sources and quotes them — so on a SERP you compete for a click, and in an AI answer you compete to be one of the sources.",
      blocks: [
        {
          kind: "table",
          head: ["", "SERP", "AI answer"],
          rows: [
            [
              "**What the user gets**",
              "Links, features and ads to choose from",
              "A written answer with a few cited sources",
            ],
            ["**Unit that competes**", "The page", "The passage"],
            [
              "**Query that decides it**",
              "The one the user typed",
              "The sub-queries the engine writes",
            ],
            ["**Success**", "A high position and a click", "A citation or a mention"],
            [
              "**Measured in**",
              "Search Console positions and clicks",
              "[Prompt tracking](/glossary/prompt-tracking) and Search Console's AI report",
            ],
          ],
        },
        {
          kind: "p",
          text: "The two are connected. Almost every AI engine retrieves its candidates from a search index — Google's for AI Overviews and Gemini, Bing plus OpenAI's own for ChatGPT, Brave for Claude — so ranking on the results pages behind a question is how a page enters the pool an answer is written from. The [AI SEO guides](/ai-seo) cover each engine's index.",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Four-Layer SERP Read",
    summary:
      "A ten-minute read of any results page, layer by layer, that ends in a decision: try to rank, try to get cited, or pick a narrower question. Run it before you brief a single article.",
    items: [
      {
        label: "Intent layer",
        body: "What type of page ranks — guide, product page, listicle, tool, forum thread? **Ask:** would my page look like the top three results?",
      },
      {
        label: "Answer layer",
        body: "Is there an AI Overview or featured snippet, and who does it cite? **Ask:** which of its sub-questions could my page answer better than the cited sources?",
      },
      {
        label: "Attention layer",
        body: "How much sits above organic result one — ads, videos, carousels, an AI answer? **Ask:** if I ranked third, would anyone see me without scrolling?",
      },
      {
        label: "Competition layer",
        body: "Who holds the top 10 — household names, niche sites, forums? **Ask:** is there at least one page here my site could plausibly beat?",
      },
    ],
    outcome:
      "Mark each layer go or no-go, then pick one of three plays: **rank** when intent matches, there's room above the fold and the competition is beatable; **get cited** when an AI answer dominates but you can answer one of its sub-questions better; or **skip** to a narrower question. For a young site the second play is often the realistic one, because AI citations reach well beyond the top 10.",
  },

  related: [
    "ai-overviews",
    "featured-snippet",
    "zero-click-search",
    "click-through-rate",
    "search-intent",
    "ai-mode",
  ],
  product: {
    feature: "seo-geo-score",
    pitch:
      "Rankbox scores every article before it publishes — one score for SEO and one for GEO — checking structure, headings, internal links, keyword use, readability and citation-readiness, with specific fixes for each.",
  },
  tool: "serp-snippet-preview",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "How Google builds the AI answer at the top of the SERP, and what decides which pages it cites.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "The step-by-step playbook for winning the AI slot on the results page.",
    },
  ],
  sources: [
    {
      title: "Visual elements gallery of Google Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/visual-elements-gallery",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "New ways to explore the web in AI Mode and AI Overviews",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/",
    },
    {
      title: "Search at I/O 2026",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/search-io-2026/",
    },
    {
      title: "Google users are less likely to click on links when an AI summary appears",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
    {
      title: "In 2026, less than one third of Google searches still send a click",
      publisher: "SparkToro",
      href: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
  ],
};
