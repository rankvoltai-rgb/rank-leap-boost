import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "zero-click-search",
  metaTitle: "What Is Zero-Click Search? What It Means for Your Traffic",
  metaDescription:
    "A zero-click search ends without a click because the results page answered it. How common it is in 2026, what AI Overviews changed, and how to compete.",
  keywords: [
    "zero-click search",
    "zero-click searches",
    "what is zero-click search",
    "no-click search",
    "zero-click search statistics",
    "zero-click SEO",
  ],

  whyItMatters:
    "If your organic traffic is flat while your rankings hold, zero-click search is a likely reason: roughly two in three US Google searches now end without a click. For a small team the answer isn't to abandon search — it's to measure visibility as well as visits, and to become the brand named in the answer when the click never comes.",

  questions: [
    {
      id: "how-common",
      question: "How common are zero-click searches?",
      answer:
        "Zero-click searches are now the majority on Google: SparkToro found 68% of US Google searches ended without a click in January–April 2026, up from about 60% in 2024 — the fastest rise in a decade by its measure.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "68%",
              label: "of US Google searches ended without a click, January–April 2026",
              source: {
                name: "SparkToro, Jun 2026",
                href: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
              },
            },
            {
              value: "360",
              label: "clicks to the open web per 1,000 US Google searches in 2024",
              source: {
                name: "SparkToro, 2024",
                href: "https://sparktoro.com/blog/2024-zero-click-search-study-for-every-1000-us-google-searches-only-374-clicks-go-to-the-open-web-in-the-eu-its-360/",
              },
            },
            {
              value: "26% vs 16%",
              label:
                "of Google visits ended the browsing session with an AI summary present, versus without",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Zero-click isn't new. [Featured snippets](/glossary/featured-snippet), knowledge panels, weather boxes and calculators have answered queries on the results page for years. What changed is scale: [AI Overviews](/glossary/ai-overviews) now answer long, informational questions that used to send a click, and chatbots like ChatGPT answer without a results page at all. Panels differ — SparkToro's 2024 figures came from Datos, its 2026 figures from Similarweb — so compare the trend, not the decimals.",
        },
      ],
    },
    {
      id: "ai-overviews-effect",
      question: "How do AI Overviews affect zero-click searches?",
      answer:
        "AI Overviews push more searches to zero-click: Pew found users clicked a classic result on 8% of visits when an AI summary appeared versus 15% without, and clicked a link inside the summary itself on just 1% of visits.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "8% vs 15%",
              label:
                "of visits clicked a classic result with an AI summary present, versus without",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
            {
              value: "1%",
              label: "of visits clicked a link inside the AI summary itself",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
            {
              value: "−58%",
              label: "click-through for the #1 result when an AI Overview is shown",
              source: {
                name: "Ahrefs, Feb 2026",
                href: "https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "The effect concentrates where AI summaries appear most. Pew saw them on 60% of searches starting with a question word and 53% of searches of ten words or more, against 8% of one- or two-word searches. Those long, question-shaped queries are exactly the ones most content marketing targets — which is why a blog can lose clicks while its [click-through rate](/glossary/click-through-rate) on short brand queries stays steady.",
        },
      ],
    },
    {
      id: "how-to-compete",
      question: "How do you compete in zero-click search?",
      answer:
        "Competing in zero-click search means aiming to be the source an answer names or cites, not only the link below it, while also targeting queries that still need a visit and measuring impressions and citations alongside clicks.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Get cited in the answer.** Seer Interactive found brands cited in an AI Overview earned about 120% more organic clicks per impression than uncited brands. See [AI citation](/glossary/ai-citation).",
            "**Write answers worth naming.** Answer-first sections that carry your brand, product and data mean the answer can name you even when nobody clicks. See [answer-first content](/glossary/answer-first-content).",
            "**Balance the portfolio.** Keep informational content for visibility, and add pages for queries that need a visit: comparisons, pricing, tools, templates.",
            "**Offer what a summary can't.** Original data, calculators and first-hand tests — what Google calls non-commodity content — give readers a reason to click through.",
            "**Re-baseline your reporting.** Report impressions, [AI visibility](/glossary/ai-visibility) and branded search next to sessions, so a flat traffic line isn't misread as failure.",
          ],
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure zero-click impact?",
      answer:
        "Measure zero-click impact by comparing impressions with clicks per page in Search Console: when impressions and average position hold but clicks fall, the results page — often an AI Overview — is answering the query instead of sending the visit.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Search Console Performance:** chart clicks, impressions, CTR and position for your top pages over the full 16 months Search Console keeps. A CTR drop at a stable position is the zero-click signature. See [Google Search Console](/glossary/google-search-console).",
            "**Generative AI report:** shows which pages earn impressions in AI Overviews and AI Mode, though not clicks.",
            "**Branded search:** rising branded queries can be a sign that answers are naming you even without a click.",
            "**[Prompt tracking](/glossary/prompt-tracking):** records whether the answers that replace the click mention or cite you.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "A CTR drop isn't a ranking drop",
          text: "Before rewriting a page that lost clicks, check its position. If position held, the page didn't get worse — the results page changed around it. The fix is earning a citation in the answer, not rewriting for rank.",
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Zero-Click Traffic Model",
    summary:
      "A way to size what an AI Overview does to one query's traffic, using Seer Interactive's published organic click rates for informational queries (April 2026). The impressions figure is illustrative, for a fictional project-management tool called Plannora — swap in your own from Search Console.",
    items: [
      {
        label: "Monthly impressions for one informational query",
        body: "“How to plan a product launch,” where Plannora's guide ranks on page one.",
        value: "40,000",
      },
      {
        label: "No AI Overview on the results page",
        body: "At Seer's rate of about 33,500 organic clicks per million impressions (3.35%).",
        value: "1,340 clicks",
      },
      {
        label: "AI Overview shown, Plannora cited",
        body: "At about 20,743 clicks per million impressions (2.07%).",
        value: "830 clicks",
      },
      {
        label: "AI Overview shown, Plannora not cited",
        body: "At about 9,445 clicks per million impressions (0.94%).",
        value: "378 clicks",
      },
      {
        label: "Monthly value of being cited",
        body: "830 − 378: the extra clicks from being in the answer rather than under it, for this one query.",
        value: "+452 clicks",
      },
    ],
    outcome:
      "Being cited keeps about 62% of the no-Overview traffic (830 ÷ 1,340); not being cited keeps about 28% (378 ÷ 1,340). Repeat the sum for your top 20 informational queries and the case for writing to be cited becomes a number, not a hunch. Seer's rates are averages across 53 brands and show correlation, not causation — use them for sizing, not forecasting.",
  },

  related: [
    "ai-overviews",
    "click-through-rate",
    "featured-snippet",
    "ai-visibility",
    "ai-citation",
    "serp",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation — the visibility analytics can't see when the click never happens.",
  },
  tool: "serp-snippet-preview",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "What AI Overviews do to your clicks, and how to measure them now that Search Console reports on them.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "The playbook for being the cited source instead of the skipped link.",
    },
  ],
  sources: [
    {
      title: "In 2026, less than one third of Google searches still send a click",
      publisher: "SparkToro",
      href: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
    },
    {
      title: "2024 zero-click search study",
      publisher: "SparkToro",
      href: "https://sparktoro.com/blog/2024-zero-click-search-study-for-every-1000-us-google-searches-only-374-clicks-go-to-the-open-web-in-the-eu-its-360/",
    },
    {
      title: "Google users are less likely to click on links when an AI summary appears",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
    {
      title: "AI Overviews reduce clicks by 58%",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/",
    },
    {
      title: "AIO impact on Google CTR: 2026 update",
      publisher: "Seer Interactive",
      href: "https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Introducing Search generative AI performance reports",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports",
    },
  ],
};
