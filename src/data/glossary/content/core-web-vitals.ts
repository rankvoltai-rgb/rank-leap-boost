import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "core-web-vitals",
  metaTitle: "What Are Core Web Vitals? LCP, INP, CLS Thresholds and AI Search",
  metaDescription:
    "Core Web Vitals are Google's field metrics for loading, responsiveness and stability. Current LCP, INP and CLS thresholds, how to measure them, and AI search.",
  keywords: [
    "Core Web Vitals",
    "LCP INP CLS",
    "what are Core Web Vitals",
    "Core Web Vitals thresholds",
    "good INP score",
    "do Core Web Vitals affect rankings",
    "page speed AI search",
  ],

  whyItMatters:
    'Core Web Vitals are one of the few ranking inputs Google names outright, but Google also says relevance comes first — and small teams regularly burn weeks chasing a perfect score that changes little. The useful goal is "good" at the 75th percentile on the templates that earn traffic, plus a fast server response, which is also what AI engines\' live fetchers need when they pull your page while a user waits.',

  questions: [
    {
      id: "the-three-metrics",
      question: "What are the three Core Web Vitals?",
      answer:
        "The three Core Web Vitals are Largest Contentful Paint (LCP), which measures loading; Interaction to Next Paint (INP), which measures responsiveness; and Cumulative Layout Shift (CLS), which measures visual stability — each judged at the 75th percentile of real Chrome users' page loads, mobile and desktop separately.",
      blocks: [
        {
          kind: "table",
          head: ["Metric", "What it measures", "Good", "Needs improvement", "Poor"],
          rows: [
            [
              "**LCP** — Largest Contentful Paint",
              "When the largest image or text block in view finishes rendering",
              "≤ 2.5 s",
              "≤ 4 s",
              "> 4 s",
            ],
            [
              "**INP** — Interaction to Next Paint",
              "How quickly the page responds visually to clicks, taps and key presses across the visit",
              "≤ 200 ms",
              "≤ 500 ms",
              "> 500 ms",
            ],
            [
              "**CLS** — Cumulative Layout Shift",
              "How much visible content jumps around unexpectedly",
              "≤ 0.1",
              "≤ 0.25",
              "> 0.25",
            ],
          ],
        },
        {
          kind: "p",
          text: "INP replaced First Input Delay as a Core Web Vital on 12 March 2024, so any audit, plugin or agency report still quoting FID is out of date. A page passes only when all three metrics are good at the 75th percentile: up to a quarter of visits can be slower and the page still passes, but one poor metric fails it.",
        },
        {
          kind: "p",
          text: "The data comes from the Chrome UX Report (CrUX), which records real visits from Chrome users — field data, not a lab simulation. That's why the metrics reward what visitors actually experience on their own devices and connections, and why a fast developer laptop proves little.",
        },
      ],
    },
    {
      id: "rankings",
      question: "Do Core Web Vitals affect rankings?",
      answer:
        'Core Web Vitals do affect rankings — Google says they "are used by our ranking systems" — but modestly: Google also says it shows the most relevant content even when page experience is sub-par, and that chasing a perfect score just for SEO "may not be the best use of your time."',
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Used in ranking",
              body: 'Google\'s page experience FAQ: "Core Web Vitals are used by our ranking systems." Other page experience aspects "don\'t directly help your website rank higher."',
              evidence: "official",
            },
            {
              title: "Relevance comes first",
              body: "Google shows the most relevant content even if the experience is poor; a great experience helps most when many pages are equally helpful.",
              evidence: "official",
            },
            {
              title: "Mostly page-level",
              body: 'Google\'s core ranking systems "generally evaluate content on a page-specific basis," though it also has "some site-wide assessments."',
              evidence: "official",
            },
            {
              title: "Small sites may have no field data",
              body: "Search Console's report needs a minimum amount of real-user data. Quiet URLs are grouped with similar pages or rolled up to the whole origin, and some are left out entirely.",
              evidence: "official",
            },
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Where the effort pays",
          text: "Fix metrics rated poor on the templates that earn traffic — pricing, top articles, sign-up — before polishing anything already good. Moving from poor to good is the change that counts; moving from good to perfect rarely is.",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure Core Web Vitals?",
      answer:
        "Measure Core Web Vitals with field data from real Chrome users — Search Console's Core Web Vitals report and PageSpeed Insights both draw on the Chrome UX Report — and use lab tools like Lighthouse only to debug, because a lab test has no real user and cannot measure INP.",
      blocks: [
        {
          kind: "table",
          head: ["Tool", "Data", "Use it for"],
          rows: [
            [
              "Search Console → Core Web Vitals",
              "Field (CrUX), grouped by similar URLs",
              "Which templates fail, on mobile and desktop",
            ],
            [
              "PageSpeed Insights",
              "Field (CrUX) plus a Lighthouse lab run",
              "One URL's real-user scores and likely causes",
            ],
            [
              "Lighthouse, Chrome DevTools",
              "Lab",
              "Debugging LCP and CLS, with Total Blocking Time as a stand-in for INP",
            ],
            [
              "The `web-vitals` library",
              "Field, in your own analytics",
              "Pages too quiet to appear in CrUX",
            ],
          ],
        },
        {
          kind: "code",
          lang: "js",
          code: '// Send real-user Core Web Vitals to your own analytics endpoint\nimport { onCLS, onINP, onLCP } from "web-vitals";\n\nfunction send(metric) {\n  navigator.sendBeacon("/analytics", JSON.stringify({\n    name: metric.name,     // "LCP" | "INP" | "CLS"\n    value: metric.value,\n    rating: metric.rating, // "good" | "needs-improvement" | "poor"\n    page: location.pathname,\n  }));\n}\n\nonCLS(send);\nonINP(send);\nonLCP(send);',
        },
        {
          kind: "p",
          text: "Search Console grades each group of URLs by its slowest metric and reports the last 28 days of data, and its fix validation runs a 28-day monitoring session. Expect a month between shipping a fix and seeing it confirmed in [Search Console](/glossary/google-search-console).",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Do Core Web Vitals matter for AI search?",
      answer:
        "Core Web Vitals matter to AI search indirectly: Google's AI Overviews and AI Mode rest on the same ranking systems that use them, but AI crawlers never click, scroll or watch the layout, so what they feel is server speed and page weight.",
      blocks: [
        {
          kind: "requirements",
          items: [
            {
              label: "Google AI Overviews & AI Mode",
              status: "helps",
              note: '[AI Overviews](/glossary/ai-overviews) and AI Mode are grounded in core ranking, which uses Core Web Vitals. Google\'s AI optimization guide lists "a good page experience" — including reducing latency — among the technical basics.',
            },
            {
              label: "Server response time",
              status: "helps",
              note: "Not a Core Web Vital, but the part of speed a bot experiences. Live fetchers such as `ChatGPT-User`, `Claude-User` and `Perplexity-User` retrieve pages while the user waits — see [AI crawlers](/glossary/ai-crawlers) — and slow responses also lower how much Google crawls, as covered under [crawl budget](/glossary/crawl-budget).",
            },
            {
              label: "Fast first paint",
              status: "helps",
              note: "SE Ranking found pages with a first contentful paint under 0.4 seconds averaged 6.7 ChatGPT citations, against 2.1 for pages slower than 1.13 seconds. A correlation, not proof of cause.",
            },
            {
              label: "Page weight",
              status: "required",
              note: "Googlebot reads only the first 2 MB of a page's HTML, and Brave's discovery fetches — which feed Claude's search provider — refuse pages over 2 MB and time out after 10 seconds.",
            },
            {
              label: "INP and CLS, for AI crawlers",
              status: "no-effect",
              note: "Crawlers don't tap, type or look at the layout, so these can't change what a bot reads. They still feed Google's rankings, and through them its AI features.",
            },
          ],
        },
        {
          kind: "p",
          text: "[Server-side rendering](/glossary/server-side-rendering) often helps both audiences at once: the HTML arrives complete, the largest element can paint without waiting for a script bundle, and non-rendering bots get the full text in a single fetch.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with Core Web Vitals",
      answer:
        "The most common Core Web Vitals mistakes are optimizing a Lighthouse lab score instead of field data, chasing perfection on pages already rated good, still reporting First Input Delay after INP replaced it, and speeding up the homepage while the templates that earn traffic stay slow.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "A Lighthouse score of 100 means the page passes.",
              reality:
                "Lighthouse is a lab test of one simulated load and can't measure INP. Google uses field data from real Chrome users at the 75th percentile.",
            },
            {
              myth: "Core Web Vitals are the biggest ranking factor.",
              reality:
                "Google says good scores don't guarantee top rankings and relevance comes first. Treat them as a floor to clear, not a lever to pull forever.",
            },
            {
              myth: "An empty Core Web Vitals report means we're fine.",
              reality:
                "It usually means too little traffic for CrUX, not a pass. Check PageSpeed Insights, which can fall back to origin-level data, or collect your own with the `web-vitals` library.",
            },
            {
              myth: "Speed only matters for human visitors.",
              reality:
                "AI fetchers retrieve pages live, and heavy or slow pages can miss their deadlines — Brave's discovery fetches stop at 10 seconds. A fast server response is the speed bots actually feel.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Core Web Vitals Scorecard",
    summary:
      "Google's published thresholds for each Core Web Vital, plus the server-response target web.dev offers as a rough guide. Score each traffic-earning template at the 75th percentile of real-user data, mobile and desktop separately.",
    items: [
      {
        label: "LCP — good",
        body: "Largest Contentful Paint within this time for 75% of page loads. Poor starts above 4 seconds.",
        value: "≤ 2.5 s",
      },
      {
        label: "INP — good",
        body: "Interaction to Next Paint at or under this for 75% of page loads. Poor starts above 500 ms.",
        value: "≤ 200 ms",
      },
      {
        label: "CLS — good",
        body: "Cumulative Layout Shift at or under this score for 75% of page loads. Poor starts above 0.25.",
        value: "≤ 0.1",
      },
      {
        label: "Passing rule",
        body: "A page passes only when all three are good at the 75th percentile; Search Console grades a URL group by its slowest metric.",
        value: "3 of 3 at p75",
      },
      {
        label: "Time to First Byte — rough guide",
        body: "Not a Core Web Vital, but web.dev suggests most sites aim for this, with poor above 1.8 seconds. It's the part of speed crawlers and live AI fetchers feel.",
        value: "≤ 0.8 s",
      },
    ],
    outcome:
      "Read it top to bottom for each template. Any poor metric is the priority, needs-improvement is worth fixing when it's cheap, and good is done. Then check server response time, because a page that's good for people but slow to respond can still lose a bot's live fetch.",
  },

  related: [
    "server-side-rendering",
    "crawl-budget",
    "search-engine-optimization",
    "google-search-console",
    "ai-overviews",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Speed work is easy to over-invest in, so measure what it buys: Rankbox tracks where your brand is cited across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation.",
  },
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "What the correlation studies show about speed, freshness and ChatGPT citations.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "Brave's 2 MB and 10-second fetch limits, and why they decide what Claude can read.",
    },
  ],
  sources: [
    {
      title: "Understanding Core Web Vitals and Google search results",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/core-web-vitals",
    },
    {
      title: "Understanding page experience in Google Search results",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/page-experience",
    },
    {
      title: "Web Vitals",
      publisher: "web.dev",
      href: "https://web.dev/articles/vitals",
    },
    {
      title: "Defining the Core Web Vitals metrics thresholds",
      publisher: "web.dev",
      href: "https://web.dev/articles/defining-core-web-vitals-thresholds",
    },
    {
      title: "Interaction to Next Paint is now a stable Core Web Vital",
      publisher: "web.dev",
      href: "https://web.dev/blog/inp-cwv-launch",
    },
    {
      title: "Core Web Vitals report",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/9205520",
    },
    {
      title: "Time to First Byte (TTFB)",
      publisher: "web.dev",
      href: "https://web.dev/articles/ttfb",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
  ],
};
