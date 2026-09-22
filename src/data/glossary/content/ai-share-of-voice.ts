import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "ai-share-of-voice",
  metaTitle: "What Is AI Share of Voice? How to Calculate It in AI Answers",
  metaDescription:
    "AI share of voice is how often AI answers name or cite your brand versus competitors. How to calculate it, why it swings, and what a good number looks like.",
  keywords: [
    "AI share of voice",
    "share of voice in AI search",
    "how to calculate AI share of voice",
    "AI share of voice formula",
    "share of model",
    "LLM share of voice",
  ],

  whyItMatters:
    "When a buyer asks ChatGPT for the best tools in your category, the answer names a handful of brands, and share of voice tells you how often yours is one of them compared with the rivals you actually lose deals to. For a small team it is the most honest AI metric to put in a growth report: it can be counted by hand, it doesn't reward budget for its own sake, and it shows whether your content is changing the shortlist or just adding pages.",

  questions: [
    {
      id: "how-to-calculate",
      question: "How do you calculate AI share of voice?",
      answer:
        "Calculate AI share of voice by running a fixed set of buyer prompts, counting the answers that name or cite each brand, and dividing your count by the total — either by all answers, or by all brand appearances if you want your slice of the whole conversation.",
      blocks: [
        {
          kind: "p",
          text: "There are two common versions, and they answer different questions. Vendors and agencies use the term loosely, so report both and say which one you mean.",
        },
        {
          kind: "table",
          head: ["", "Visibility rate", "Share of voice"],
          rows: [
            [
              "**Formula**",
              "Answers that include you ÷ all answers",
              "Your appearances ÷ all brand appearances in the panel",
            ],
            [
              "**Question it answers**",
              "How often am I in the answer at all?",
              "How big is my slice of the conversation?",
            ],
            [
              "**Adds up to 100%?**",
              "No — several brands can appear in one answer",
              "Yes, across every brand named",
            ],
            [
              "**Moves when**",
              "You earn more mentions or citations",
              "You gain appearances, or a competitor loses them",
            ],
          ],
        },
        {
          kind: "p",
          text: "Count mentions and citations separately as well. A mention is your name in the answer text; an [AI citation](/glossary/ai-citation) is a link to your page. The engines differ sharply: in Semrush's June 2026 study, 87% of the times a brand's domain appeared in a ChatGPT answer it was a linked citation, but only 20.7% named the brand in the text. Gemini was the reverse, at 21.4% linked and 83.7% named. One blended number hides which kind of visibility you are winning.",
        },
        {
          kind: "p",
          text: "The raw counts come from [prompt tracking](/glossary/prompt-tracking): the same buyer questions, run on a schedule, with every brand and cited page recorded.",
        },
      ],
    },
    {
      id: "why-it-changes",
      question: "Why does AI share of voice change from week to week?",
      answer:
        "AI share of voice changes because AI answers are probabilistic: the same prompt returns a different set of brands on almost every run, so a single check is noise and only a large, repeated sample shows a real trend.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "<1 in 100",
              label:
                "chance that ChatGPT or Google's AI returns the same list of brands twice across 100 runs of one prompt",
              source: {
                name: "SparkToro & Gumshoe, Jan 2026",
                href: "https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/",
              },
            },
            {
              value: "~1 in 1,000",
              label: "runs before the same brands appear in the same order twice",
              source: {
                name: "SparkToro & Gumshoe, Jan 2026",
                href: "https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/",
              },
            },
            {
              value: "~50%",
              label: "of the domains Claude cites change between runs of the same prompt",
              source: {
                name: "Attrifast, 2026",
                href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "The SparkToro study — 600 volunteers running 12 prompts through ChatGPT, Claude and Google's AI 2,961 times — also found the signal inside the noise: how often a brand appears across many runs is stable enough to track. For one Google AI prompt about digital marketing consultants, a single agency appeared in 85 of 95 responses. Frequency across runs, not position in any one list, is what share of voice should be built on.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Size the sample before you read the trend",
          text: "With 30 prompts, three engines and two runs each, one extra appearance moves a visibility rate by about half a point (1 of 180 answers). Treat week-to-week moves of a few points as noise, and act on trends that hold for a month.",
        },
      ],
    },
    {
      id: "good-share-of-voice",
      question: "What is a good AI share of voice?",
      answer:
        "A good AI share of voice is one that beats the competitors you meet in deals and keeps rising; there is no published universal benchmark, because the number depends entirely on which prompts and which rivals you chose to track.",
      blocks: [
        {
          kind: "p",
          text: "Two brands can report 40% and 12% in the same market and both be right: one tracked ten category prompts against two rivals, the other fifty prompts against eight. Share of voice is only comparable inside one fixed panel. What makes it meaningful:",
        },
        {
          kind: "list",
          items: [
            "**Rank against named rivals.** Leading your own panel matters more than any absolute figure.",
            "**Split by prompt type.** Category prompts (“best CRM for startups”) and problem prompts (“how to stop losing leads”) usually tell different stories; a brand can own one and be missing from the other.",
            "**Split by engine.** Engines search different indexes. Claude and ChatGPT shared only about 8% of their cited domains in Profound's 2026 data, so a strong ChatGPT share says little about [Claude](/ai-seo/claude).",
            "**Watch the trend.** A share that climbs from 10% to 18% over a quarter is a better result than a flat 25%.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Keep brand prompts out of the count",
          text: "A prompt that contains your own name (“Is Plannora good for agencies?”) will name you almost every time. Track those separately as an accuracy check, or they inflate the share.",
        },
      ],
    },
    {
      id: "how-to-improve",
      question: "How do you improve AI share of voice?",
      answer:
        "Improve AI share of voice by owning the specific questions where competitors are named and you aren't: publish a clear, answer-first page for each one, and earn mentions on the sites the engines already cite for your category.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Find the gaps in your panel.** List the prompts where a rival appears and you don't, and note which pages the engine cited instead.",
            "**Answer the sub-questions.** Engines [fan each prompt out](/glossary/query-fan-out) into narrower searches, so a page that wins one sub-query can be cited even when you don't rank for the head term.",
            "**Build official pages for facts.** Pricing, integrations and comparison pages on your own domain are what engines check before they recommend you.",
            "**Earn off-site mentions.** In Ahrefs' study of 75,000 brands in Google AI Overviews, branded web mentions correlated with AI visibility at 0.664, against 0.326 for Domain Rating and 0.218 for backlinks. See [brand mentions](/glossary/brand-mentions).",
            "**Re-run the same panel.** Compare month over month, so you can see which change moved the share.",
          ],
        },
        {
          kind: "p",
          text: "Each engine has its own route in — different crawlers, indexes and citation habits. The [AI SEO guides](/ai-seo) compare them side by side.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with AI share of voice",
      answer:
        "The most common AI share-of-voice mistakes are weighting brands by list position, counting prompts that contain your own name, and comparing numbers from different prompt panels — each one moves the metric for reasons that have nothing to do with buyers.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Being listed first should count for more.",
              reality:
                "Order almost never repeats — SparkToro put the odds of the same order twice at about 1 in 1,000. Position weighting adds noise, not signal. Count presence.",
            },
            {
              myth: "One screenshot shows where we stand.",
              reality:
                "A single run is one draw from a shifting distribution. Use dozens of prompts, run more than once, before quoting a number.",
            },
            {
              myth: "A vendor's share-of-voice score can be compared with ours.",
              reality:
                "Only if the prompts, engines, runs and competitor list are identical. Different panels produce different numbers for the same market.",
            },
            {
              myth: "Mentions and citations are the same win.",
              reality:
                "A mention builds awareness; a citation can send a visit. Track both, especially on engines like Gemini that name brands far more often than they link them.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Share-of-Voice Ledger",
    summary:
      "A step-by-step count that turns a month of prompt runs into a visibility rate, a share of voice and a citation split. The inputs are illustrative, for a fictional project management tool called Plannora and two fictional rivals, Loopcraft and Taskwell — swap in your own panel.",
    items: [
      {
        label: "Build the answer set",
        body: "30 buyer prompts with no brand names in them × 3 engines × 2 runs each.",
        value: "180 answers",
      },
      {
        label: "Count the answers that include Plannora",
        body: "Named in the text or linked as a source, counted once per answer: 54 answers. 54 ÷ 180 is Plannora's visibility rate.",
        value: "30%",
      },
      {
        label: "Count every tracked brand the same way",
        body: "Loopcraft 90 · Taskwell 72 · Plannora 54 · every other brand named, combined, 24.",
        value: "240 appearances",
      },
      {
        label: "Split citations from mentions",
        body: "Plannora was linked in 18 of its 54 appearances; Loopcraft in 60 of its 90.",
        value: "33% vs 67% linked",
      },
      {
        label: "Share of voice",
        body: "54 ÷ 240 — Plannora's slice of all brand appearances in the panel. Loopcraft holds 90 ÷ 240, or 37.5%.",
        value: "22.5%",
      },
    ],
    outcome:
      "Plannora appears in 30% of answers but holds 22.5% of the conversation, against Loopcraft's 37.5% — and only a third of its appearances carry a link. The engines know the name but cite rivals' pages when they explain the category, so the gap is citable pages, not awareness. The next moves are official pricing, comparison and how-to pages, then the same 30 prompts again next month.",
  },

  related: [
    "prompt-tracking",
    "ai-visibility",
    "ai-citation",
    "brand-mentions",
    "generative-engine-optimization",
    "ai-referral-traffic",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation — so you know which pages to build on while you work to raise your share.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "How ChatGPT, Google AI Overviews, Gemini, Claude and Perplexity each find and cite sources, side by side.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description:
        "The content playbook for earning ChatGPT citations, including building a prompt panel.",
    },
  ],
  sources: [
    {
      title: "AIs are highly inconsistent when recommending brands or products",
      publisher: "SparkToro",
      href: "https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "An analysis of AI Overview brand visibility factors (75K brands studied)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-brand-correlation/",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
  ],
};
