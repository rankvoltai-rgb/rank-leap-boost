import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "google-search-console",
  metaTitle: "What Is Google Search Console? AI Overviews Data & Controls (2026)",
  metaDescription:
    "Google Search Console reports how your site performs in Google Search, and since 2026 in AI Overviews. What it shows, the AI report, the opt-out and the limits.",
  keywords: [
    "Google Search Console",
    "Search Console",
    "GSC",
    "Search Console AI Overviews report",
    "Search generative AI control",
    "Search Console vs Google Analytics",
  ],

  whyItMatters:
    "Search Console is the only place Google tells you first-hand which searches show your pages, how often people click, and now how often your pages appear inside AI Overviews and AI Mode. It's free and takes minutes to verify, which makes it the highest-return hour a small team can spend on measurement — and in 2026 it also holds the switch that decides whether Google's AI features can use your site at all.",

  questions: [
    {
      id: "what-it-shows",
      question: "What does Google Search Console show?",
      answer:
        "Google Search Console shows how Google sees and serves your site: the queries that earn impressions and clicks, your CTR and average position, which pages are indexed and why others aren't, and — since 2026 — how often your pages appear in AI Overviews and AI Mode.",
      blocks: [
        {
          kind: "table",
          head: ["Report", "What it tells you"],
          rows: [
            [
              "**Performance (Search results)**",
              "Clicks, impressions, CTR and average position by query, page, country, device and date — for web, image, video and news search",
            ],
            [
              "**Generative AI performance**",
              "Impressions in AI Overviews and AI Mode by page, country, device and date; no clicks or queries",
            ],
            [
              "**Page indexing & URL Inspection**",
              "Whether a page is [indexed](/glossary/indexing), the canonical Google chose, and the HTML it rendered",
            ],
            [
              "**Sitemaps**",
              "Which [XML sitemaps](/glossary/xml-sitemap) Google has read, and how many URLs they list",
            ],
            [
              "**Settings → Search generative AI**",
              "Whether your site may appear in Google's generative AI features at all",
            ],
          ],
        },
        {
          kind: "p",
          text: "Two limits shape everything you read in it. **Anonymized queries** — ones not issued by more than a few dozen users over two to three months — are left out of the tables, though they count in chart totals. And the interface exports at most **1,000 rows**; the API and Looker Studio connector go up to 50,000 rows per day per site per search type. For a small site, that means part of the long tail of conversational queries, the ones most like AI prompts, stays invisible.",
        },
      ],
    },
    {
      id: "ai-overviews-report",
      question: "How do you see AI Overviews data in Search Console?",
      answer:
        "See AI Overviews data in Search Console's generative AI performance report, launched on 3 June 2026 and rolled out worldwide by 31 August 2026: it shows impressions in AI Overviews and AI Mode by page, country, device and date, but no clicks and no queries.",
      blocks: [
        {
          kind: "list",
          items: [
            "**What counts:** an impression is a link to your site shown to a user in an AI feature. In the chart, two links from your site in one answer count as one impression; filter by URL and the count is per page.",
            '**How it overlaps:** Google says the report "includes data from the Web search type in the Performance report" — AI impressions are a subset of your web impressions, not extra ones.',
            "**What's missing:** clicks, CTR, position and queries. AI clicks are counted in the web Performance report, blended with classic results.",
            "**Discover is separate:** a second generative AI report covers Discover's AI features.",
            "**Not seeing it?** Google says not every property has access yet, and sites with too few AI impressions — or excluded from AI features — won't see data.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "How position works inside AI answers",
          text: "An AI Overview occupies one position on the results page, and every link in it is assigned that position. In AI Mode, position is counted as on a normal results page, and follow-up questions are logged as new queries.",
        },
      ],
    },
    {
      id: "ai-opt-out",
      question: "How do you opt out of AI Overviews in Search Console?",
      answer:
        "Opt out of AI Overviews under Settings → Search generative AI in Search Console by choosing Exclude: within a few days your site's links and content stop appearing in AI Overviews, AI Mode and Discover's AI features, while classic rankings are unaffected.",
      blocks: [
        {
          kind: "p",
          text: 'The **Search generative AI** control rolled out to all websites worldwide on 31 August 2026. It has three settings — Include (the default), Exclude, and Inherit control from parent for child properties — and works per property: a domain, a subdomain or a URL prefix, so a URL-prefix property can scope it to one folder. Google says it "isn\'t used as a ranking or inclusion signal affecting other parts of Search."',
        },
        {
          kind: "table",
          head: ["If you want to…", "Use"],
          rows: [
            [
              "Leave AI Overviews, AI Mode and Discover AI but keep classic results",
              "Search Console → **Exclude**",
            ],
            [
              "Keep one passage out of AI answers",
              "`data-nosnippet` on that element — see [snippet controls](/glossary/snippet-controls)",
            ],
            [
              "Stop Gemini training and Gemini-app grounding",
              "[Google-Extended](/glossary/google-extended) in robots.txt — no effect on AI Overviews",
            ],
            ["Leave Google Search entirely", "`noindex`"],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Check that it still says Include",
          text: "Anyone with owner access can change the setting, and child properties inherit their parent's. An accidental Exclude takes every page in the property out of Google's AI answers, so check each property after any agency or team change.",
        },
      ],
    },
    {
      id: "search-console-vs-google-analytics",
      question: "Google Search Console vs Google Analytics: what's the difference?",
      answer:
        "Google Search Console measures what happens on Google before the click — impressions, queries, position and AI Overviews visibility — while Google Analytics measures what visitors do after they arrive from any channel, including AI assistants such as ChatGPT and Gemini.",
      blocks: [
        {
          kind: "table",
          head: ["", "Search Console", "Google Analytics 4"],
          rows: [
            ["**Covers**", "Google Search only", "Every channel, including AI assistants"],
            [
              "**Measures**",
              "Impressions, clicks, CTR, position",
              "Sessions, engagement, conversions",
            ],
            [
              "**AI Overviews & AI Mode**",
              "Impressions in the AI report; clicks blended into web totals",
              "Clicks arrive as Organic Search from google.com and can't be separated",
            ],
            [
              "**ChatGPT, Claude, Perplexity**",
              "Not covered",
              "AI Assistant channel or Referral — see [AI referral traffic](/glossary/ai-referral-traffic)",
            ],
            ["**Search queries**", "Yes, minus anonymized queries", "No"],
          ],
        },
        {
          kind: "p",
          text: "Use them in sequence: Search Console to see which pages gain impressions and lose [click-through rate](/glossary/click-through-rate), GA4 to see whether visits to those pages still convert. Neither shows which AI answers cite you on engines other than Google — that takes [prompt tracking](/glossary/prompt-tracking).",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with Google Search Console",
      answer:
        "The most common Search Console mistakes are expecting table rows to add up to the chart total, reading AI impressions as if they came with clicks, and judging average position across every query at once — each produces numbers that look precise and mislead.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "The table rows should add up to the total.",
              reality:
                "Anonymized queries are left out of the table but counted in chart totals. Google's own worked example shows 450 itemized clicks against 550 in total.",
            },
            {
              myth: "More AI impressions means more AI traffic.",
              reality:
                "The generative AI report has no clicks. Check the same pages' clicks in the web report and their sessions and conversions in analytics.",
            },
            {
              myth: "Average position tells me how I rank.",
              reality:
                "It's averaged across every query and impression in the view. Filter to one query or one page before reading it.",
            },
            {
              myth: "The AI setting defaults to Include, so I can ignore it.",
              reality:
                "Owners can change it and child properties inherit it. One wrong setting removes a whole property from Google's AI answers.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The AI Impression Share Check",
    summary:
      "A monthly check of how much of a page's Google visibility now comes from AI features, and whether its clicks are keeping up. It works because Google says the generative AI report draws on the same web search data. The inputs are illustrative, for the pricing page of a fictional tool called Plannora.",
    items: [
      {
        label: "Web impressions for the page",
        body: "Performance → Search results, search type Web, filtered to `plannora.io/pricing`, last 28 days.",
        value: "40,000",
      },
      {
        label: "AI impressions for the same page",
        body: "Generative AI performance report, same URL filter, same dates.",
        value: "12,000",
      },
      {
        label: "AI impression share",
        body: "12,000 ÷ 40,000 — the share of the page's impressions that came from AI Overviews and AI Mode.",
        value: "30%",
      },
      {
        label: "Web CTR",
        body: "880 clicks ÷ 40,000 impressions, from the Performance report.",
        value: "2.2%",
      },
      {
        label: "Change against the previous 28 days",
        body: "Then the AI share was 18% and CTR 2.9%: AI share up 12 points, CTR down 0.7 points.",
        value: "−0.7 pts",
      },
    ],
    outcome:
      "An AI impression means a link to the page was shown in an AI answer, so a rising share with a falling CTR usually means more of the page's queries now carry an AI answer that cites it but satisfies searchers on the spot. Decide by outcomes, not clicks: compare the page's sessions and sign-ups in GA4 across both periods, and check which prompts cite it with a prompt panel, since Search Console won't list the queries.",
  },

  related: [
    "click-through-rate",
    "ai-overviews",
    "ai-referral-traffic",
    "indexing",
    "snippet-controls",
    "google-extended",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Search Console counts your Google AI impressions but shows no clicks, no queries and no other engine. Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation.",
  },
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "The eligibility switches, snippet controls and what the Search Console AI report can and can't tell you.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "The playbook, including how to read the generative AI report month to month.",
    },
  ],
  sources: [
    {
      title: "Introducing Search generative AI performance reports",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports",
    },
    {
      title: "Generative AI performance report (Search)",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/16984139",
    },
    {
      title: "Search generative AI control",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/16908024",
    },
    {
      title: "How Search Console counts position, clicks and impressions",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7042828",
    },
    {
      title: "Performance report (Search results)",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7576553",
    },
    {
      title: "A deep dive into Search Console performance data filtering and limits",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2022/10/performance-data-deep-dive",
    },
  ],
};
