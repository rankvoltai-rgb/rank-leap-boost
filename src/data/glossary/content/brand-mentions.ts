import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "brand-mentions",
  metaTitle: "What Are Brand Mentions? Why They Drive AI Search Visibility",
  metaDescription:
    "Brand mentions are references to your brand across the web, linked or not. Why they track AI visibility more closely than backlinks, and how to earn them honestly.",
  keywords: [
    "brand mentions",
    "unlinked brand mentions",
    "what are brand mentions",
    "brand mentions SEO",
    "brand mentions AI search",
    "brand mentions vs backlinks",
    "implied links",
  ],

  whyItMatters:
    "AI assistants recommend the brands the web talks about: in Ahrefs' study of 75,000 brands, how often a brand was mentioned tracked its AI visibility far more closely than its backlinks or domain strength did. That's good news if you compete with bigger players on a small budget: a mention in a niche YouTube review, a customer's forum post or a trade newsletter is easier to earn than a link from a top publication, and it may count for more.",

  questions: [
    {
      id: "vs-backlinks",
      question: "Brand mentions vs backlinks: what's the difference?",
      answer:
        "A backlink is a clickable link to your site that passes ranking authority; a brand mention is any reference to your name, linked or not — and in Ahrefs' 75,000-brand study, mentions correlated far more strongly with AI visibility than backlinks did.",
      blocks: [
        {
          kind: "table",
          head: ["", "Backlinks", "Brand mentions"],
          rows: [
            [
              "**What it is**",
              "A hyperlink to your site",
              "Your name in text, video, audio or a review — link optional",
            ],
            [
              "**Role in Google Search**",
              "Part of core ranking through link analysis and PageRank",
              "Reputation evidence raters are told to look for; no confirmed direct ranking role",
            ],
            [
              "**Correlation with AI visibility**",
              "Very weak (Ahrefs)",
              "Branded web mentions 0.66–0.71; YouTube mentions ~0.74",
            ],
            [
              "**How AI answers show it**",
              "As a cited source link",
              "As your name in the answer text",
            ],
            [
              "**Visible in analytics?**",
              "Yes, as referral traffic",
              "Mostly not — it needs prompt tracking",
            ],
          ],
        },
        {
          kind: "p",
          text: 'The two overlap: a linked mention is both. Branded anchors — links whose text is your brand name — correlated between 0.51 and 0.63 with AI visibility, well above raw link counts, which suggests being named matters whether or not the name is clickable. In classic search, Google\'s [rater guidelines](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf) tell raters to look for "independent reviews, references, recommendations by experts, news articles," and note that "forum discussions" can be great sources of reputation information. See [backlinks](/glossary/backlinks).',
        },
      ],
    },
    {
      id: "ai-search",
      question: "Why do brand mentions matter for AI search?",
      answer:
        "Brand mentions matter for AI search because models learn which brands belong to which topics from how often and where they're discussed, and because many AI answers name brands without linking them — so being talked about is often the visibility itself.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "~0.74",
              label:
                "correlation between YouTube mentions and AI brand visibility — the strongest of any factor studied",
              source: {
                name: "Ahrefs, 75K brands",
                href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
              },
            },
            {
              value: "83.7%",
              label:
                "of Gemini's brand appearances named the brand in the text; only 21.4% carried a link",
              source: {
                name: "Semrush, Jun 2026",
                href: "https://www.semrush.com/blog/the-ghost-citations-study/",
              },
            },
            {
              value: "25.1%",
              label: "of brand appearances across AI engines were mentions with no citation at all",
              source: {
                name: "Semrush, Jun 2026",
                href: "https://www.semrush.com/blog/the-ghost-citations-study/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Engines differ in how they show you. ChatGPT links far more than it names — an 87% citation rate against a 20.7% mention rate in Semrush's data — while Gemini does the reverse. Google says its AI features \"can show what's being said about products and services across the web, including in blogs, videos, and forum discussions.\" Being discussed in those places is how you end up in the sentence, not just the source list. See [AI citation](/glossary/ai-citation).",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Correlation, not proof",
          text: 'Ahrefs is explicit that "correlation isn\'t causation," and its sample was established brands with Domain Rating above 40. Mentions and AI visibility may both follow from simply being well known. Use the data to decide where effort pays off, not as a guarantee.',
        },
      ],
    },
    {
      id: "how-to-earn",
      question: "How do you get more brand mentions?",
      answer:
        "Get more brand mentions by giving people something worth naming you for — original data, expert comment, a genuinely useful answer — and by showing up, openly, where your buyers already talk: YouTube, podcasts, review sites, communities and trade press.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Start with YouTube.** It was the strongest signal in Ahrefs' data, and the number of mentions correlated slightly more than their impressions (~0.74 vs ~0.72) — so several small creators reviewing your product may matter as much as one big one.",
            "**Publish something citable.** Original numbers, benchmarks or a clear framework give journalists and bloggers a reason to name you. See [digital PR](/glossary/digital-pr) and [information gain](/glossary/information-gain).",
            "**Offer your expertise.** Podcast guest spots, expert quotes for trade publications, talks at industry events.",
            "**Make reviews easy.** Ask real customers to review you on the sites buyers in your category check. Never pay for, script or fake them.",
            "**Join communities as yourself.** Answer questions on Reddit and forums under your own name, with your affiliation disclosed. See [Reddit SEO](/glossary/reddit-seo).",
            "**Request links selectively.** When a relevant article names you without a link, asking for one is fine — but the mention is already doing part of the work.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Fake mentions backfire",
          text: "Google's AI guide warns that \"seeking inauthentic 'mentions' across the web isn't as helpful as it might seem,\" because its generative AI features depend on ranking systems that focus on quality and on systems that block spam. In the US, the FTC's 2024 rule also bans fake reviews and undisclosed reviews by company insiders.",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure brand mentions?",
      answer:
        "Measure brand mentions in two places: across the web, with a monitoring or backlink tool that counts unlinked references, and inside AI answers, with a fixed prompt panel that records when engines name you — because analytics only sees mentions that come with a clicked link.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Web mentions:** set alerts for your brand and product names and count new mentions each month. Separate owned (your own profiles) from earned (everyone else).",
            "**AI mentions:** run the same buyer prompts weekly in each engine and record three outcomes — named and cited, named only, cited only. This is [prompt tracking](/glossary/prompt-tracking).",
            "**Share of voice:** the percentage of answers that name you against each competitor — your [AI share of voice](/glossary/ai-share-of-voice).",
            "**Downstream signals:** branded search volume and direct traffic are worth watching alongside mentions, though neither proves cause.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Count mentions separately from citations",
          text: "Semrush found 62% of AI citations never name the brand in the answer. A tracker that only counts links overstates how often ChatGPT users actually see your name, and misses most of your visibility on Gemini.",
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Mention Signal Ladder",
    summary:
      "Six brand and site signals ranked by how closely they tracked AI brand visibility across ChatGPT, Google AI Mode and AI Overviews in Ahrefs' study of 75,000 brands. Values are Spearman correlations from that published study, not Rankbox measurements: 1 is a perfect match, 0 is none.",
    items: [
      {
        label: "YouTube mentions",
        body: "How often creators name your brand on YouTube. The strongest signal on all three engines, slightly ahead of the impressions those mentions earned (~0.72).",
        value: "~0.74",
      },
      {
        label: "Branded web mentions",
        body: "Your name on other websites, linked or not. Highest in AI Mode (0.709), lowest in AI Overviews (0.656).",
        value: "0.66–0.71",
      },
      {
        label: "Branded anchors",
        body: "Links whose anchor text is your brand name — a mention and a link at once. Strongest in AI Mode. See [anchor text](/glossary/anchor-text).",
        value: "0.51–0.63",
      },
      {
        label: "Branded search volume",
        body: "How many people search for you by name — a proxy for demand you already have.",
        value: "0.35–0.47",
      },
      {
        label: "Domain Rating",
        body: "Ahrefs' backlink-strength score, shown for ChatGPT; a mid-tier factor everywhere, strongest in AI Overviews. Raw backlink counts correlated very weakly.",
        value: "0.27",
      },
      {
        label: "Pages on your site",
        body: "Content volume. Ahrefs found “almost no relationship” with AI visibility.",
        value: "~0.19",
      },
    ],
    outcome:
      "Read it top down as a guide to where effort pays off, not a formula. Signals near the top come from being talked about; signals near the bottom are what you can build alone. The sample was established brands and correlation isn't causation, but the direction is clear enough for a small team: publishing more pages alone won't move AI visibility, so getting discussed has to be part of the plan.",
  },

  related: [
    "digital-pr",
    "backlinks",
    "reddit-seo",
    "ai-share-of-voice",
    "entity-seo",
    "ai-citation",
  ],
  product: {
    feature: "reddit-presence",
    pitch:
      "Rankbox finds the Reddit threads that rank on Google and feed AI answers, and drafts a genuinely useful reply that says who you are for you to post under your own name — one honest way to be mentioned where buyers and models read.",
  },
  further: [
    {
      title: "Gemini SEO: the technical guide",
      href: "/ai-seo/gemini",
      description:
        "Why Gemini names brands far more often than it links them — and how to track it.",
    },
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description: "What ChatGPT cites, including the brand-mention signals behind its answers.",
    },
  ],
  sources: [
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Search Quality Rater Guidelines",
      publisher: "Google",
      href: "https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf",
    },
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title:
        "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews (75K brands studied)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "Federal Trade Commission announces final rule banning fake reviews and testimonials",
      publisher: "US Federal Trade Commission",
      href: "https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials",
    },
  ],
};
