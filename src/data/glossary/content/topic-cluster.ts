import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "topic-cluster",
  metaTitle: "What Is a Topic Cluster? Pillar Pages, Cluster Pages and AI Search",
  metaDescription:
    "A topic cluster links a broad pillar page to focused pages on each subtopic. How clusters work, why they suit AI search's fan-out, and how to build one right.",
  keywords: [
    "topic cluster",
    "topic clusters SEO",
    "pillar page",
    "pillar-cluster model",
    "content hub",
    "how to build a topic cluster",
  ],

  whyItMatters:
    "When a buyer asks an AI engine about your category, the engine splits the question into several searches, and no single article can be the best answer to all of them. A topic cluster lets a small team build that coverage deliberately — one pillar and a handful of focused pages — instead of scattering posts that compete with each other for the same queries.",

  questions: [
    {
      id: "how-it-works",
      question: "How does a topic cluster work?",
      answer:
        "A topic cluster works by pairing one broad pillar page, which covers a subject at a high level, with narrower cluster pages that each answer one subtopic in depth, all linked to each other so readers and search engines can move through the whole topic.",
      blocks: [
        {
          kind: "p",
          text: "HubSpot popularized the model in 2017, building on its 2015 “Topics Over Keywords” research, and still defines it as “an SEO content strategy that links a broad pillar page to a set of focused cluster pages on related subtopics, with internal links from each cluster page back to its pillar.” A cluster has three parts:",
        },
        {
          kind: "list",
          items: [
            "**The pillar** covers the whole subject — “project management for agencies” — answers the core question up front, and gives each subtopic a short section that links to its cluster page.",
            "**The cluster pages** each own one subtopic or long-tail question — client approvals, resource planning, retainer pricing — and go deeper than the pillar can.",
            "**The links** run both ways: every cluster page links to the pillar with descriptive anchor text, the pillar links to every cluster page, and siblings link where a reader would naturally go next. See [internal linking](/glossary/internal-linking).",
          ],
        },
        {
          kind: "p",
          text: "Google's own linking guidance is the floor: “Every page you care about should have a link from at least one other page on your site.” A cluster makes sure every page has several, with anchors that say what each page covers.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Do topic clusters help with AI search?",
      answer:
        "Topic clusters help with AI search because engines fan one question out into several sub-queries and cite whichever page answers each one best; a cluster gives you a clearly titled page for each sub-question instead of one page trying to answer them all.",
      blocks: [
        {
          kind: "p",
          text: "Google's own example of [query fan-out](/glossary/query-fan-out): “how to fix a lawn that's full of weeds” becomes “best herbicides for lawns,” “remove weeds without chemicals” and “how to prevent weeds in lawn.” Each is a separate search with its own winners — the shape of a pillar and three cluster pages.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Sub-query coverage wins citations",
              body: "Only 37.9% of pages cited in Google AI Overviews ranked top 10 for the typed query in Ahrefs' March 2026 data, down from 76.1% in its July 2025 study. Pages win by answering a sub-question, not the head term.",
              evidence: "observed",
            },
            {
              title: "Undercovered topics get crawl priority",
              body: "Perplexity says its index keeps documents from “authoritative domains” and “undercovered topics” fresh — a reward for depth where others are thin.",
              evidence: "official",
            },
            {
              title: "Depth, not doorways",
              body: "Google warns that creating “separate content for every possible variation of how people might search,” including fan-out queries, primarily to manipulate rankings or AI responses violates its scaled content abuse policy.",
              evidence: "official",
            },
            {
              title: "Links make the structure readable",
              body: "Google says descriptive internal anchor text helps “both people and Google make sense of your site” — the same links that let an engine landing on one cluster page reach the rest.",
              evidence: "official",
            },
          ],
        },
      ],
    },
    {
      id: "how-to-build",
      question: "How do you build a topic cluster?",
      answer:
        "Build a topic cluster by listing the questions buyers ask about one subject, grouping them by intent into subtopics, giving the core question a pillar and each distinct subtopic its own page, then linking every page to the pillar and the pillar to every page.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Pick a subject you can cover completely** — “onboarding for B2B SaaS”, not “marketing”.",
            "**Collect the questions**: search suggestions, People also ask, sales calls, support tickets, and what buyers ask ChatGPT and Perplexity.",
            "**Group by [search intent](/glossary/search-intent), not wording.** Ahrefs separates supporting long-tail keywords, variations one page can rank for, from topical long-tail keywords that deserve a page of their own. Only the second kind become cluster pages.",
            "**Make the pillar a map**: a direct answer to the core question, then a short section per subtopic that links out.",
            "**Link deliberately**: descriptive anchors, pillar and cluster pages linked both ways, sibling links where one question leads to the next.",
            "**Ship the set together** where you can, so readers and crawlers find a complete cluster rather than a pillar pointing at pages that don't exist yet.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Check the SERP before you split",
          text: "If two questions return mostly the same URLs in Google, searchers — and Google — treat them as one intent. Give them one page, or you'll create [keyword cannibalization](/glossary/keyword-cannibalization).",
        },
      ],
    },
    {
      id: "vs-topical-authority",
      question: "Topic cluster vs topical authority: what's the difference?",
      answer:
        "A topic cluster is something you build — a set of linked pages on one subject — while topical authority is the result you hope it earns: search engines and AI systems treating your site as a reliable source on that subject, which also depends on mentions and links from elsewhere.",
      blocks: [
        {
          kind: "table",
          head: ["", "Topic cluster", "Topical authority"],
          rows: [
            ["**What it is**", "A content structure", "A reputation"],
            ["**Who controls it**", "You, entirely", "Partly others"],
            [
              "**Built from**",
              "A pillar, cluster pages, internal links",
              "Coverage plus mentions, links and time",
            ],
            [
              "**How you see it**",
              "A map of linked pages",
              "Rankings and citations across the whole topic",
            ],
          ],
        },
        {
          kind: "p",
          text: "The cluster is necessary but not sufficient. Coverage shows depth; trust comes partly from outside the site, through [brand mentions](/glossary/brand-mentions) and [backlinks](/glossary/backlinks) in the places engines read. See [topical authority](/glossary/topical-authority).",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Spoke Admission Test",
    summary:
      "Four checks a candidate page must pass before it joins a cluster. It stops the two failures that sink most clusters: pages that duplicate each other, and pages that exist only to catch a keyword variant.",
    items: [
      {
        label: "A distinct question",
        body: "The page answers a question the pillar can't cover in one section, and a searcher would expect a separate page for it. **Test:** search the page's question and its nearest sibling's; if the top results mostly overlap, merge them.",
      },
      {
        label: "A standalone answer",
        body: "The page answers its question in the first sentence and makes sense to someone who never saw the pillar. **Test:** read only the first section — does it answer the title?",
      },
      {
        label: "Something the pillar lacks",
        body: "It carries detail the pillar only summarizes: steps, numbers, examples, a comparison. **Test:** if the whole page could be pasted into the pillar as one paragraph, it should be one paragraph.",
      },
      {
        label: "Two-way links",
        body: "It links up to the pillar with a descriptive anchor, the pillar links down to it, and it links to at least one sibling. **Test:** no page in the cluster is reachable only through the sitemap.",
      },
    ],
    outcome:
      "Run every planned page through all four before anyone writes it. Pages that fail the first check are variants — fold them into an existing page as a section. Six pages that pass are worth more than twenty that don't, and they keep you clear of Google's [scaled content abuse](/glossary/scaled-content-abuse) policy.",
  },

  related: [
    "topical-authority",
    "internal-linking",
    "keyword-cannibalization",
    "query-fan-out",
    "long-tail-keywords",
    "scaled-content-abuse",
  ],
  product: {
    feature: "auto-publishing",
    pitch:
      "Rankbox publishes a new optimized article every day to WordPress, Webflow, Shopify, Wix or Framer — or any stack through its API — so a planned cluster goes live page by page without waiting on a content calendar, with approval before publishing if you want it.",
  },
  tool: "content-brief-generator",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "How Google fans queries out into subtopics, and why depth beats per-variant pages.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "Mapping the fan-out for your buyer questions and building the pages it needs.",
    },
  ],
  sources: [
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "SEO link best practices for Google",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
    },
    {
      title: "Topic clusters: the next evolution of SEO",
      publisher: "HubSpot",
      href: "https://blog.hubspot.com/marketing/topic-clusters-seo",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "Long-tail keywords: what they are and how to get search traffic from them",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/long-tail-keywords/",
    },
  ],
};
