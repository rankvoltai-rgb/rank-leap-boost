import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "featured-snippet",
  metaTitle: "What Is a Featured Snippet? Position Zero in the AI Overviews Era",
  metaDescription:
    "A featured snippet is the answer box Google lifts from one ranking page. Whether snippets matter in 2026, how they differ from AI Overviews, and how to win one.",
  keywords: [
    "featured snippet",
    "position zero",
    "answer box",
    "featured snippets vs AI Overviews",
    "how to get a featured snippet",
    "are featured snippets still relevant",
  ],

  whyItMatters:
    "Featured snippets taught a generation of marketers how to write a passage Google would lift, and that skill is exactly what AI Overviews and chatbots reward now. The snippet box itself is a shrinking prize — Ahrefs tracked it falling from about 15% to under 6% of US desktop results in the first half of 2025 — but for a small team, the writing habit behind it is one of the cheapest routes into AI answers.",

  questions: [
    {
      id: "still-exist",
      question: "Do featured snippets still exist in 2026?",
      answer:
        "Featured snippets still exist in 2026 and Google still documents them, but they appear far less often: Ahrefs found them on 15.41% of US desktop results in January 2025 and 5.53% by June, a decline that closely tracked the expansion of AI Overviews.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "5.53%",
              label:
                "of 1 million US desktop results showed a featured snippet in June 2025, down from 15.41% in January",
              source: {
                name: "Ahrefs, Jul 2025",
                href: "https://ahrefs.com/blog/how-serp-features-have-evolved-in-the-ai-era",
              },
            },
            {
              value: "0.9",
              label:
                "correlation between the fall in featured snippets and the growth of AI Overviews",
              source: {
                name: "Ahrefs, Jul 2025",
                href: "https://ahrefs.com/blog/how-serp-features-have-evolved-in-the-ai-era",
              },
            },
            {
              value: "−57%",
              label:
                "fewer queries earning one large site a featured snippet between September 2024 and March 2025",
              source: {
                name: "GSQi, Mar 2025",
                href: "https://www.gsqi.com/marketing-blog/how-to-track-prevalence-featured-snippets-aios/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Ahrefs' conclusion: “It seems very likely that AI Overviews have superseded Featured snippets.” Google hasn't announced retiring the format — its [featured snippets documentation](https://developers.google.com/search/docs/appearance/featured-snippets) still describes how they work and how to opt out — so treat the snippet as a smaller, still-live prize, and check which of your own queries still show one rather than assuming either way.",
        },
      ],
    },
    {
      id: "vs-ai-overviews",
      question: "Featured snippets vs AI Overviews: what's the difference?",
      answer:
        "A featured snippet quotes one ranking page almost word for word and links to it; an [AI Overview](/glossary/ai-overviews) is a new answer written by a Gemini model from several pages — often pages that don't rank for the typed query — with multiple links attached.",
      blocks: [
        {
          kind: "table",
          head: ["", "Featured snippet", "AI Overview"],
          rows: [
            ["**What's shown**", "An excerpt lifted from one page", "A generated summary"],
            [
              "**Where sources come from**",
              "One page, almost always already on page one",
              "Several pages; in 2026 data, most outside the top 10",
            ],
            [
              "**How sources are found**",
              "Ranking for the query as typed",
              "[Query fan-out](/glossary/query-fan-out) across related sub-queries",
            ],
            ["**Your link**", "One prominent link", "One of several inline links and cards"],
            [
              "**Opt-out controls**",
              "`nosnippet`, `max-snippet`, `data-nosnippet`",
              "The same, plus Search Console's Search generative AI setting",
            ],
          ],
        },
        {
          kind: "p",
          text: "The sourcing gap is the big change. Ahrefs' 2017 study of 2 million featured snippets found 99.58% came from pages already ranking in the top 10; its March 2026 study found only 37.9% of pages cited in AI Overviews ranked top 10 for the query. One thing carried over intact is eligibility: both formats use only pages allowed a snippet, so [snippet controls](/glossary/snippet-controls) switch off both at once.",
        },
        {
          kind: "p",
          text: "Google also deduplicates snippets: “If a web page listing is elevated to become a featured snippet, we don't repeat the listing later on the first page of results.”",
        },
      ],
    },
    {
      id: "how-to-win",
      question: "How do you get a featured snippet?",
      answer:
        "To get a featured snippet, first rank on page one for the query, then answer it directly under a heading that matches it — a short paragraph for “what” and “why” questions, a numbered list for steps, a table for comparisons — in text Google is allowed to quote.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Rank in the top 10 first.** Snippets almost always come from pages already on page one, and there's no way to mark a page as a featured snippet yourself — Google's systems decide.",
            "**Target queries that already show one.** Among the queries you rank for on page one, those showing a snippet today are your best openings: you're already eligible, and a clearer, better-formatted answer may be enough to take the box.",
            "**Match the format Google shows.** Paragraph snippets answer definitions and whys; list snippets show steps or rankings; table snippets show comparisons. Mirror the current snippet's shape and beat its substance.",
            "**Put the answer right under the heading**, as a complete statement: the subject named, the answer in the first sentence, the detail after.",
            "**Keep snippet controls open.** Google says featured snippets “will only appear if enough text can be shown,” so a low `max-snippet` value opts you out.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Write it once for both",
          text: "The passage that wins a snippet — a question heading, a direct first sentence, supporting detail — is the same passage AI engines lift. Writing for snippets today is mostly a way of writing [answer-first content](/glossary/answer-first-content).",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with featured snippets",
      answer:
        "The most common featured snippet mistakes today are chasing the snippet as the end goal while AI Overviews replace it, blocking snippets with restrictive controls, and writing a teaser that holds the answer back instead of a complete answer that can be quoted.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Featured snippets are fading, so snippet-style writing is pointless.",
              reality:
                "The box is rarer; the skill isn't. AI engines extract passages the same way — Growth Memo found 44.2% of ChatGPT citations came from the first 30% of a page.",
            },
            {
              myth: "Schema markup earns a featured snippet.",
              reality:
                "Google's systems decide whether a page would make a good snippet. There's no markup that requests one, and Google says its AI features need no special schema either.",
            },
            {
              myth: "A cliffhanger answer earns more clicks.",
              reality:
                "Snippets and AI answers quote complete statements. A teaser gives the engine nothing usable, so it quotes a competitor instead — and in a [zero-click search](/glossary/zero-click-search), being quoted is the visibility.",
            },
            {
              myth: "Opting out of snippets only affects the snippet box.",
              reality:
                "`nosnippet` also stops a page being used as input for AI Overviews and AI Mode. To protect one passage, wrap just that element in `data-nosnippet`.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Liftable Passage Benchmarks",
    summary:
      "Five thresholds for a passage that can serve as a featured snippet and an AI citation at once. Each comes from published documentation or research, except one clearly labelled rule of thumb.",
    items: [
      {
        label: "Rank before you format",
        value: "Top 10",
        body: "Ahrefs' 2017 study of 2 million snippets found 99.58% came from page-one results. AI Overviews cast wider — 37.9% of cited pages ranked top 10 in Ahrefs' March 2026 data — but the snippet itself still needs page one.",
      },
      {
        label: "Where the answer sits",
        value: "First 30%",
        body: "44.2% of ChatGPT citations came from the first 30% of a page's text (Growth Memo, Feb 2026). Answer the page's main question near the top, not after a long introduction.",
      },
      {
        label: "The quotable sentence",
        value: "≤ 150 chars",
        body: "Claude's web search citations quote up to 150 characters of the source (Anthropic documentation). A first sentence that states the answer within that length can be quoted whole.",
      },
      {
        label: "The answer paragraph (rule of thumb)",
        value: "40–60 words",
        body: "A long-standing practitioner convention for paragraph snippets, not a Google rule — Google says it has no exact minimum length. Long enough to answer completely, short enough to quote.",
      },
      {
        label: "The whole section",
        value: "120–180 words",
        body: "Sections of this length between headings averaged 4.6 ChatGPT citations, against 2.7 for sections under 50 words (SE Ranking, 129,000 domains).",
      },
    ],
    outcome:
      "Check each key section against all five before publishing. Failing a length row is an edit; failing the top-10 row means the snippet needs ranking work first — though the same passage can still be cited by AI engines through fan-out.",
  },

  related: [
    "ai-overviews",
    "answer-first-content",
    "answer-engine-optimization",
    "snippet-controls",
    "zero-click-search",
    "serp",
  ],
  product: {
    feature: "seo-geo-score",
    pitch:
      "Rankbox scores every article before it publishes — one score for SEO, one for GEO — checking structure, headings, readability and citation-readiness, with specific fixes wherever a section isn't ready to be quoted.",
  },
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Eligibility, snippet controls and what the 2026 citation data shows for Google's AI answers.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "The step-by-step playbook for writing passages Google's AI features lift.",
    },
  ],
  sources: [
    {
      title: "Featured snippets and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/featured-snippets",
    },
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title: "A reintroduction to Google's featured snippets",
      publisher: "Google",
      href: "https://blog.google/products/search/reintroduction-googles-featured-snippets/",
    },
    {
      title: "Robots meta tag, data-nosnippet and X-Robots-Tag specifications",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
    },
    {
      title: "How SERP features have evolved in the AI era",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/how-serp-features-have-evolved-in-the-ai-era",
    },
    {
      title: "Ahrefs' study of 2 million featured snippets",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/featured-snippets-study/",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title: "Are featured snippets losing their feature?",
      publisher: "GSQi (Glenn Gabe)",
      href: "https://www.gsqi.com/marketing-blog/how-to-track-prevalence-featured-snippets-aios/",
    },
    {
      title: "The science of how AI pays attention",
      publisher: "Growth Memo (Kevin Indig)",
      href: "https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
  ],
};
