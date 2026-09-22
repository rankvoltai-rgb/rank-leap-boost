import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "content-decay",
  metaTitle: "What Is Content Decay? How to Spot and Fix Declining Pages",
  metaDescription:
    "Content decay is the slow loss of rankings, traffic and AI citations as a page ages. How to measure it in Search Console, why AI engines notice, and what to fix.",
  keywords: [
    "content decay",
    "traffic decay",
    "content drift",
    "what is content decay",
    "how to fix content decay",
    "content refresh",
  ],

  whyItMatters:
    "For a small team, the articles you published last year are the cheapest pipeline you have, and they lose ground every month someone publishes a newer answer. AI engines speed up the slide: in Ahrefs' data ChatGPT's citations averaged 458 days newer than Google's organic results, and Perplexity filters stale pages out before it ranks anything. Catching decay early is usually faster than writing a new article to win back the traffic.",

  questions: [
    {
      id: "causes",
      question: "What causes content decay?",
      answer:
        "Content decay usually has one of four causes: the page's facts go out of date, a competitor publishes a better answer, searchers' intent shifts toward a different kind of page, or demand for the topic falls — and each one needs a different response.",
      blocks: [
        {
          kind: "table",
          head: ["Cause", "What it looks like in Search Console", "Typical response"],
          rows: [
            [
              "**Aging facts**",
              "Position slips slowly while impressions hold",
              "Update the data, examples and screenshots, and the year where it's true",
            ],
            [
              "**Better competitors**",
              "Position drops, often after a rival publishes or a core update lands",
              "Add what the new winners have and you lack: depth, original data, a clearer answer",
            ],
            [
              "**Intent shift**",
              "Clicks fall and the type of page ranking above you changes",
              "Rebuild the page in the format that now wins — a comparison instead of a guide, say",
            ],
            [
              "**Falling demand**",
              "Impressions and clicks fall together while position holds",
              "Nothing wrong with the page. Put the effort elsewhere",
            ],
            [
              "**A changed results page**",
              "Position holds but [click-through rate](/glossary/click-through-rate) falls",
              "An AI Overview or other feature is absorbing clicks; work on being cited in it",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Google documents part of the mechanism. Its [ranking systems guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide) describes "query deserves freshness" systems "designed to show fresher content for queries where it would be expected." On time-sensitive topics an older page loses ground even when nothing on it is wrong. See [content freshness](/glossary/content-freshness).',
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure content decay?",
      answer:
        "Measure content decay by comparing each page's clicks and impressions in Google Search Console with the same period a year earlier, then checking whether position, impressions or click-through rate drove the drop — and whether the page is still cited in AI answers.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Compare year over year.** In the [Search Console](/glossary/google-search-console) Performance report, compare the last three months with the same three months a year earlier, so seasonality cancels out.",
            "**Sort by clicks lost, not percentage.** A page down 60% from 50 clicks matters less than one down 20% from 5,000.",
            "**Diagnose with three columns.** Falling position points to competitors or quality; falling impressions at a steady position points to demand; falling click-through rate at a steady position points to a changed results page.",
            "**Check the answers.** Ask the page's buyer questions in ChatGPT, Perplexity and Google AI Mode, or use [prompt tracking](/glossary/prompt-tracking), and record whether the page is still cited.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Rankings can hold while citations slip",
          text: "Search Console's Generative AI report shows AI Overviews and AI Mode impressions by page, but no clicks, and no engine outside Google reports citations to you. A page can keep its position and still drop out of AI answers, the kind of decay classic reports miss. Judge citation trends over several weeks, because AI answers vary from run to run.",
        },
      ],
    },
    {
      id: "ai-citations",
      question: "Does content decay affect AI citations?",
      answer:
        "Content decay affects AI citations sharply, because most AI answer engines lean toward fresher sources: Ahrefs found ChatGPT's citations average 458 days newer than Google's organic results, and Perplexity removes stale content before it ranks candidates.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "458 days",
              label:
                "newer, on average, are ChatGPT's citations than the pages in Google's organic results",
              source: {
                name: "Ahrefs, Jul 2025",
                href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
              },
            },
            {
              value: "6.0 vs 3.6",
              label:
                "average ChatGPT citations for pages updated in the past three months, against older pages",
              source: {
                name: "SE Ranking, Nov 2025",
                href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
              },
            },
            {
              value: "94%",
              label: "of Claude's search sub-queries include the current year",
              source: {
                name: "Profound, Jul 2026",
                href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Each engine checks freshness its own way. Perplexity's index stores publish and last-updated dates and prefilters \"clearly non-responsive or stale content\" before scoring, per its [architecture write-up](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api). Claude's search tool hands the model each result's `page_age`. [Google AI Overviews](/glossary/ai-overviews) are the exception in Ahrefs' data: their citations were about as old as Google's organic results, so classic ranking strength matters more there. The citation-age figures are correlations; the Perplexity and Claude mechanics are documented by the vendors.",
        },
      ],
    },
    {
      id: "how-to-fix",
      question: "How do you fix content decay?",
      answer:
        "Fix content decay with one of three moves per page: refresh it when the topic still matters and the page can be the best answer again, consolidate it into a stronger page when it overlaps, or retire it when the demand is gone.",
      blocks: [
        {
          kind: "h3",
          text: "What a real refresh includes",
        },
        {
          kind: "list",
          items: [
            "**Replace dated facts** — statistics, prices, screenshots, product names — and cite the new sources.",
            "**Answer the questions that appeared since.** New sub-questions are where [query fan-out](/glossary/query-fan-out) looks for sources, so add a section for each.",
            "**Add something the current winners lack**: a worked example, original numbers or first-hand experience. That's [information gain](/glossary/information-gain).",
            "**Tighten each section's opening** so its first sentence answers the heading.",
            "**Update the visible date and `dateModified`** only when the content changed substantively.",
          ],
        },
        {
          kind: "p",
          text: "Consolidate when two decaying pages cover the same question: merge them into the stronger URL and redirect the other, which also fixes [keyword cannibalization](/glossary/keyword-cannibalization). Retire a page only when it has no demand, no links and nothing worth moving.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Don't fake freshness",
          text: 'Google\'s [helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) lists "changing the date of pages to make them seem fresh when the content has not substantially changed" among its warning signs. Change the date when the page changes, not instead.',
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with content decay",
      answer:
        "The most common content decay mistakes are faking freshness with a new date, prioritizing by percentage lost instead of clicks lost, rewriting before diagnosing the cause, and mass-deleting old posts to make a site look fresh — which Google says won't help.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "A new published date makes a page fresh.",
              reality:
                "Google lists date changes without substantial updates as a sign of search-engine-first content. Update the page, then the date.",
            },
            {
              myth: "Deleting old posts lifts the rest of the site.",
              reality:
                "Google asks whether you're removing a lot of older content because you believe it makes your site \"seem 'fresh'\" — and answers, \"No, it won't.\" Retire pages that have no value, not pages that are merely old.",
            },
            {
              myth: "If traffic fell, the page got worse.",
              reality:
                "Often nothing on the page changed: a competitor published, demand fell or an AI Overview started absorbing clicks. Diagnose before you rewrite.",
            },
            {
              myth: "Every page needs refreshing on a fixed schedule.",
              reality:
                "Refresh by value at stake. A quarterly review of top pages suits fast-moving topics, but an evergreen page that still wins its query and its citations needs no change.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Decay Triage Worksheet",
    summary:
      "A way to turn a Search Console export into a decision for one page: how much it lost, why, and what that loss is worth. The figures below are illustrative, for a fictional project-management tool called Plannora — swap in your own.",
    items: [
      {
        label: "Clicks, same quarter last year",
        body: "Plannora's guide to running a sprint retrospective, from Search Console's Performance report.",
        value: "2,400",
      },
      {
        label: "Clicks, last quarter",
        body: "Same page, same three months of the year, so seasonality cancels out.",
        value: "1,500",
      },
      {
        label: "Decay rate",
        body: "(2,400 − 1,500) ÷ 2,400. Set your own trigger for a closer look; this example uses 20%.",
        value: "−37.5%",
      },
      {
        label: "Cause",
        body: "Impressions held near 60,000 while average position slid from 4.1 to 7.8 — a ranking loss, not falling demand. A competitor's newer guide now sits above it.",
        value: "4.1 → 7.8",
      },
      {
        label: "AI citations",
        body: "Of 10 tracked buyer prompts, the guide was cited in 4 six months ago and in 1 now.",
        value: "4 → 1",
      },
      {
        label: "Value at stake",
        body: "900 clicks lost a quarter × a 1.5% signup rate from this page.",
        value: "≈14 signups a quarter",
      },
    ],
    outcome:
      "A 37.5% decline caused by a ranking loss, with citations falling too, on a page worth about 14 signups a quarter: refresh it first. Update the examples, answer the questions the competitor now covers, and re-check both position and citations once it's recrawled. A page that lost the same share of clicks because demand fell would score the same decay rate and deserve no work at all, which is why the cause step matters.",
  },

  related: [
    "content-freshness",
    "keyword-cannibalization",
    "prompt-tracking",
    "google-search-console",
    "information-gain",
    "click-through-rate",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox's Citation Tracking shows where your brand appears across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation — so you can see when a page starts losing answers, not just rankings.",
  },
  further: [
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description: "How Perplexity schedules recrawls and filters stale pages before ranking.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description: "Why Claude adds the year to its searches and reads every result's page age.",
    },
  ],
  sources: [
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title: "Creating helpful, reliable, people-first content",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title: "Performance report (Search results)",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7576553",
    },
    {
      title: "Do AI assistants prefer to cite fresh content?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
  ],
};
