import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "topical-authority",
  metaTitle: "What Is Topical Authority? Why Depth Wins in SEO and AI Search",
  metaDescription:
    "Topical authority is how far search engines and AI trust a site on a whole subject. What Google has actually said, how to build it, and how to measure it.",
  keywords: [
    "topical authority",
    "topic authority",
    "what is topical authority",
    "topical authority SEO",
    "how to build topical authority",
    "topical authority AI search",
  ],

  whyItMatters:
    "A small team can't outrank a category leader on its head term, but it can become the most complete source on a narrow slice of the subject — the kind of depth search engines and AI systems reward. Topical authority turns a limited publishing budget into a strategy: pick the subject your buyers care about, cover it thoroughly, and stop spreading effort across topics that never feed your pipeline.",

  questions: [
    {
      id: "does-google-use-it",
      question: "Does Google use topical authority?",
      answer:
        "Google has confirmed a “topic authority” system only for news, explained in a May 2023 post; for the wider web it has published no topical-authority score, though its helpful-content guidance asks whether a site has “a primary purpose or focus” and warns against publishing on many unrelated topics.",
      blocks: [
        {
          kind: "p",
          text: "Google's [news topic authority system](https://developers.google.com/search/blog/2023/05/understanding-news-topic-authority) surfaces expert publications for newsy queries in areas such as health, politics and finance. Its example: people looking for Nashville high school football news often turn to The Tennessean. For every other kind of site, the evidence is indirect.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Topic authority for news",
              body: "Google weighs how notable a publication is for a topic or location, how often other publishers cite its original reporting, and its history of high-quality reporting.",
              evidence: "official",
            },
            {
              title: "Site focus in Google's guidance",
              body: 'Google\'s [helpful content questions](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) ask "Does your site have a primary purpose or focus?" and flag "producing lots of content on many different topics in hopes that some of it might perform well" as a warning sign.',
              evidence: "official",
            },
            {
              title: "Site-focus attributes in the 2024 leak",
              body: "Google API documentation leaked in 2024 listed `siteFocusScore` — \"how much a site is focused on one topic\" — and `siteRadius`. They suggest focus is measured somewhere, but Google hasn't confirmed how, or whether, they're used.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "p",
          text: 'The news post ends with advice that generalizes well: publishers should "provide great coverage about the areas and topics they know well."',
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does topical authority matter for AI search?",
      answer:
        "Topical authority matters for AI search because engines fan one question out into many sub-questions and cite whichever pages best answer each one — so a site that covers a subject's follow-up questions gets more chances to be cited than a single strong page on the head term.",
      blocks: [
        {
          kind: "p",
          text: 'Google describes AI Overviews and AI Mode issuing "a set of concurrent, related queries" — its example turns a question about a weedy lawn into separate searches about herbicides, chemical-free removal and prevention. Each sub-query has its own winners. That is why so many cited pages don\'t rank for the question the user typed. See [query fan-out](/glossary/query-fan-out).',
        },
        {
          kind: "stats",
          items: [
            {
              value: "37.9%",
              label:
                "of pages cited in Google AI Overviews rank top 10 for the query the user typed",
              source: {
                name: "Ahrefs, Mar 2026",
                href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
              },
            },
            {
              value: "7.61",
              label: "ChatGPT fan-out searches per prompt after August 2026, up from 2.17",
              source: {
                name: "Nectiv, Aug 2026",
                href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
              },
            },
            {
              value: "~0.19",
              label:
                "correlation between a site's page count and AI brand visibility — “almost no relationship”",
              source: {
                name: "Ahrefs, 75K brands",
                href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Depth, not volume",
          text: 'Page count barely tracked AI visibility in Ahrefs\' data, and Google says separate pages for every fan-out variant, made "primarily to manipulate rankings or generative AI responses," violate its [scaled content abuse](/glossary/scaled-content-abuse) policy — adding that "a high quantity of pages doesn\'t make a website higher quality or more relevant to users."',
        },
      ],
    },
    {
      id: "how-to-build",
      question: "How do you build topical authority?",
      answer:
        "Build topical authority by choosing one subject your buyers care about, mapping every question they ask about it, answering each in a page or clearly headed section, linking those pages into a cluster, and earning references from other sites in the same field.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Draw the boundary.** One subject tied to what you sell — “project management for small agencies,” not “productivity.” Say no to posts outside it, however easy they look.",
            "**Map the questions.** Definitions, how-tos, comparisons, pricing, troubleshooting, alternatives — plus the follow-ups an AI engine would search on the buyer's behalf.",
            "**Answer each one properly.** A page or clearly headed section per question, [answer-first](/glossary/answer-first-content), with first-hand detail a generic page lacks.",
            "**Wire it together.** A pillar page that links to every subtopic page and back — a [topic cluster](/glossary/topic-cluster) held together by [internal links](/glossary/internal-linking).",
            "**Earn outside references.** Google's news system weighs how often others cite a publisher's work; on the wider web, [backlinks](/glossary/backlinks) and [brand mentions](/glossary/brand-mentions) from sites in your field are the nearest equivalent.",
            "**Keep it current and tidy.** Refresh pages as facts change, and merge overlapping ones before they compete with each other.",
          ],
        },
      ],
    },
    {
      id: "vs-domain-authority",
      question: "Topical authority vs domain authority: what's the difference?",
      answer:
        "Domain authority is a third-party score of a whole site's link strength across every subject; topical authority is how trusted a site is on one specific subject — so a small specialist site can be the stronger source on its own topic than a high-scoring generalist.",
      blocks: [
        {
          kind: "table",
          head: ["", "Domain authority", "Topical authority"],
          rows: [
            [
              "**What it measures**",
              "Backlink strength of the whole domain",
              "Depth and recognition on one subject",
            ],
            [
              "**Who defines it**",
              "Moz, Ahrefs, Semrush — not Google",
              "No public score; Google confirms a news version",
            ],
            [
              "**How you raise it**",
              "Earning links from strong sites",
              "Covering a subject completely and being cited for it",
            ],
            [
              "**Carries across topics?**",
              "Yes, the score is site-wide",
              "No — authority on CRM says nothing about recipes",
            ],
            [
              "**Link to AI visibility**",
              "Weak: Domain Rating correlated 0.27 with ChatGPT brand visibility",
              "Plausible through fan-out, which rewards subtopic coverage",
            ],
          ],
        },
        {
          kind: "p",
          text: "See [domain authority](/glossary/domain-authority). The practical difference for a small team: a high Domain Rating takes years of links to build, while depth on a narrow subject is within reach of anyone who publishes steadily on it.",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure topical authority?",
      answer:
        "Measure topical authority indirectly, since no tool can read Google's assessment: track how many of a subject's mapped questions your site answers, how visible you are across that whole group of queries and prompts, and how often other sites in the field reference you.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Coverage:** the share of mapped subtopic questions that have a page answering them. The worked example below shows the arithmetic.",
            "**Visibility across the cluster:** impressions and rankings in Search Console for the whole group of queries, not one head term.",
            "**AI citations for the topic:** in [prompt tracking](/glossary/prompt-tracking), the share of subject-related prompts where engines cite or name you, against competitors.",
            "**Outside references:** new referring domains and mentions from sites in the same field.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Tool scores are estimates",
          text: "Some SEO tools publish a “topical authority” metric. It's modeled from rankings and links, not read from Google, so use it to spot trends rather than as a verdict.",
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Focus-and-Depth Check",
    summary:
      "Two ratios that show whether your publishing builds authority or scatters it: how much of what you publish stays on your core subject (focus), and how much of that subject you have actually answered (depth). The inputs below are illustrative, for a fictional project management tool called Plannora.",
    items: [
      {
        label: "Posts published in the last year",
        body: "Every blog post and guide on the site.",
        value: "60",
      },
      {
        label: "Posts on the core subject",
        body: "Project management for small agencies. The rest are generic productivity tips, remote-work listicles and company news.",
        value: "21",
      },
      {
        label: "Focus ratio",
        body: "21 ÷ 60 — the share of publishing effort spent on the subject Plannora wants to own.",
        value: "35%",
      },
      {
        label: "Subtopic questions mapped",
        body: "What buyers ask about the subject: setup, templates, pricing models, client reporting, resourcing, comparisons and more.",
        value: "40",
      },
      {
        label: "Questions with a page that answers them",
        body: "Several of the 21 on-topic posts overlap, so together they answer 12 distinct questions.",
        value: "12",
      },
      {
        label: "Depth ratio",
        body: "12 ÷ 40 — the share of the subject a searcher, or an engine's fan-out, can find answered on the site.",
        value: "30%",
      },
      {
        label: "Authority gap",
        body: "40 − 12 unanswered questions to cover before publishing anything off-topic.",
        value: "28 questions",
      },
    ],
    outcome:
      "Plannora's problem isn't volume — five posts a month — but aim: almost two-thirds went off-topic. Pointing the same budget at the 28 unanswered questions would take depth to 100% in under six months without publishing a single extra post. Recompute both ratios every quarter.",
  },

  related: [
    "topic-cluster",
    "internal-linking",
    "query-fan-out",
    "e-e-a-t",
    "domain-authority",
    "entity-seo",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox maps the questions your buyers ask ChatGPT, Perplexity and Google about your subject, scores each for volume, difficulty and intent, and turns the winnable ones into articles — the question map a focus-and-depth check starts from.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "How Google fans a query out into subtopics, and why depth beats per-variant pages.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description:
        "Mapping the fan-out for your buyer questions and writing pages that win each one.",
    },
  ],
  sources: [
    {
      title: "Understanding news topic authority",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2023/05/understanding-news-topic-authority",
    },
    {
      title: "Creating helpful, reliable, people-first content",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title:
        "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews (75K brands studied)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
    {
      title: "Secrets from the Google algorithm leak",
      publisher: "iPullRank",
      href: "https://ipullrank.com/google-algo-leak",
    },
  ],
};
