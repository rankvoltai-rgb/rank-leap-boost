import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "ai-visibility",
  metaTitle: "What Is AI Visibility? How to Measure Your Brand in AI Answers",
  metaDescription:
    "AI visibility measures how often, how prominently and how favorably AI answers mention your brand. How to measure it, what drives it, and common mistakes.",
  keywords: [
    "AI visibility",
    "LLM visibility",
    "AI search visibility",
    "what is AI visibility",
    "how to measure AI visibility",
    "AI brand visibility",
  ],

  whyItMatters:
    "Your buyers now ask ChatGPT, Perplexity or Google's AI for a shortlist, and you never see that moment in analytics unless someone clicks. AI visibility is the number that tells a founder whether the brand is on those shortlists at all — and for a small team with modest traffic, it can show movement long before AI referral visits are large enough to read.",

  questions: [
    {
      id: "how-to-measure",
      question: "How do you measure AI visibility?",
      answer:
        "Measure AI visibility by running a fixed set of buyer prompts through each AI engine on a schedule and recording, for every answer, whether your brand appears, how prominently, and whether what's said is accurate — then trend the results week over week.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Choose 25–50 prompts** your buyers actually ask: category (“best X for Y”), comparison (“X vs Y”) and problem prompts. Leave your brand name out.",
            "**Pick the engines that matter** — ChatGPT, Google AI Overviews and AI Mode, Gemini, Perplexity, Claude — weighted by where your buyers ask.",
            "**Run each prompt more than once.** Attrifast's 2026 study found roughly a third to a half of cited sources change between repeated runs of the same prompt.",
            "**Record presence, prominence and accuracy** for every answer: named or not, first or fifth, right or wrong.",
            "**Trend weekly** against two or three named competitors; that comparison is your [AI share of voice](/glossary/ai-share-of-voice).",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Mentions and citations are different signals",
          text: "A Semrush and Growth Memo study found 62% of AI citations were “ghost citations” — the page was linked but the brand never named — while Gemini named brands far more often than it linked them. Track [AI citations](/glossary/ai-citation) and [brand mentions](/glossary/brand-mentions) as separate columns.",
        },
      ],
    },
    {
      id: "what-drives-it",
      question: "What drives AI visibility?",
      answer:
        "AI visibility is driven by two things: being retrievable — crawlable, indexed pages that answer the sub-questions engines search — and being talked about across the web, where studies find brand mentions correlate with AI visibility far more strongly than backlinks.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Off-site brand mentions",
              body: "Across 75,000 brands, Ahrefs found YouTube mentions correlated most with AI visibility (about 0.74) and branded web mentions next (0.66–0.71), while backlink counts correlated at about 0.19.",
              evidence: "observed",
            },
            {
              title: "Retrievable pages",
              body: "Every engine's live search runs on an index. Google says its AI features are “rooted in our core Search ranking and quality systems.”",
              evidence: "official",
            },
            {
              title: "Sub-question coverage",
              body: "Only 37.9% of pages cited in AI Overviews rank top 10 for the typed query (Ahrefs, March 2026); the rest win a [fan-out](/glossary/query-fan-out) sub-query.",
              evidence: "observed",
            },
            {
              title: "Official first-party pages",
              body: "After August 2026, 64% of ChatGPT's fan-out searches used `site:` to query specific domains directly (Nectiv) — brands' own pages among them.",
              evidence: "observed",
            },
            {
              title: "Freshness",
              body: "Perplexity documents filtering stale content before ranking, and Claude added the current year to 94% of its sub-queries in Profound's tests.",
              evidence: "observed",
            },
            {
              title: "Consistent entity facts",
              body: "The same name, category and facts across your site and profiles plausibly help models tie you to the right topics, though no vendor documents it. See [entity SEO](/glossary/entity-seo).",
              evidence: "our-read",
            },
          ],
        },
      ],
    },
    {
      id: "vs-search-rankings",
      question: "AI visibility vs search rankings: what's the difference?",
      answer:
        "Search rankings measure where one page sits for one query on one results page, while AI visibility measures whether your brand appears across many generated answers that vary by run, user and engine — so AI visibility is reported as a rate or share, not a position.",
      blocks: [
        {
          kind: "table",
          head: ["", "Search rankings", "AI visibility"],
          rows: [
            ["**Unit**", "A URL's position for a keyword", "The brand's presence in an answer"],
            [
              "**Stability**",
              "Fairly steady day to day",
              "Changes between runs of the same prompt",
            ],
            ["**Reported as**", "Position 1–100", "Share of answers, prominence, accuracy"],
            ["**Counts unlinked mentions?**", "No", "Yes — most of it, on Gemini"],
            [
              "**First-party data**",
              "Search Console",
              "Search Console's AI report for Google only; elsewhere, [prompt tracking](/glossary/prompt-tracking)",
            ],
          ],
        },
        {
          kind: "p",
          text: "Rankings still feed visibility, because every engine retrieves from an index. But the two diverge often enough that a brand can rank well and be absent from AI answers, or be named in answers for queries it doesn't rank for. Report both, side by side, and treat [AI referral traffic](/glossary/ai-referral-traffic) as the downstream check.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with AI visibility",
      answer:
        "The most common AI visibility mistakes are judging from one screenshot, prompting with your own brand name, counting only linked citations, and ignoring accuracy — a mention with a wrong price can hurt more than no mention.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "I asked ChatGPT and it named us, so we're visible.",
              reality:
                "One run from one account in one place says little. Answers change between runs, and ChatGPT [infers location and may use memories](https://help.openai.com/en/articles/9237897-chatgpt-search) when it searches; use a repeated panel.",
            },
            {
              myth: "Branded prompts are a fair test.",
              reality:
                "“What is Plannora?” tests recognition, not visibility. Buyers ask category and problem questions before they know your name.",
            },
            {
              myth: "AI referral traffic is my AI visibility.",
              reality:
                "Most answers send no click, and some app traffic arrives without a referrer. Referral traffic is a lagging, partial signal.",
            },
            {
              myth: "Being mentioned is the goal.",
              reality:
                "Accuracy matters as much. Check that answers get your category, pricing and positioning right, and fix the pages they draw from when they don't. See [AI hallucination](/glossary/ai-hallucination).",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The AI Visibility Scorecard",
    summary:
      "A way to turn a week of prompt runs into four numbers a team can trend. The inputs are illustrative, for a fictional project-management tool called Plannora. The scorecard deliberately isn't blended into one index, so a single number can't hide a problem.",
    items: [
      {
        label: "Answers collected",
        body: "25 buyer prompts × 4 engines (ChatGPT, Perplexity, Claude, Google AI Overviews) × 2 runs each.",
        value: "200 answers",
      },
      {
        label: "Presence",
        body: "Answers that mention or cite Plannora at all.",
        value: "46 of 200",
      },
      {
        label: "Prominence",
        body: "Of those 46, answers that name Plannora first or recommend it outright.",
        value: "12 of 46",
      },
      {
        label: "Linked citations",
        body: "Of those 46, answers that link a Plannora page; the rest are unlinked mentions.",
        value: "22 of 46",
      },
      {
        label: "Accuracy",
        body: "Of those 46, answers that state Plannora's category and pricing correctly. Ten repeat an old price.",
        value: "36 of 46",
      },
      {
        label: "The scorecard",
        body: "Present in 23% of buyer answers, leading in 6%, linked in 11%, accurate 78% of the time it appears.",
        value: "23 · 6 · 11 · 78",
      },
    ],
    outcome:
      "Each number points to a different fix: low presence is a coverage and mentions problem, low prominence a comparison-content problem, few links a page-structure problem, and inaccuracy an outdated-facts problem — here, an old price still live on a third-party review. Re-run the same panel every week and move one number at a time.",
  },

  related: [
    "ai-share-of-voice",
    "prompt-tracking",
    "ai-citation",
    "brand-mentions",
    "ai-referral-traffic",
    "llm-seo",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews for the prompts your buyers ask, shows which article earned each citation, and turns it into a visibility trend you can report on.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "How each engine finds sources, and how its traffic shows up in analytics.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "Includes how to build and run a weekly prompt panel.",
    },
  ],
  sources: [
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews (75k brands)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
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
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
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
