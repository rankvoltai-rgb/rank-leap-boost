import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "information-gain",
  metaTitle: "What Is Information Gain in SEO? The Patent, the Proof, the Practice",
  metaDescription:
    "Information gain is what a page adds beyond what other pages already say. What Google's patent really claims, why AI engines reward it, and how to add it.",
  keywords: [
    "information gain",
    "information gain SEO",
    "information gain score",
    "Google information gain patent",
    "is information gain a ranking factor",
    "non-commodity content",
  ],

  whyItMatters:
    "If your article says what the top five results already say, an AI engine has no reason to cite you instead of them, and in a tie the bigger brand wins. Information gain is how a small team competes without a bigger budget: one number, test or first-hand lesson that nobody else has published gives Google and AI engines something they can only get from you.",

  questions: [
    {
      id: "ranking-factor",
      question: "Is information gain a Google ranking factor?",
      answer:
        "Information gain is not a confirmed Google ranking factor: the term comes from a Google patent, granted in 2022, that scores documents by what they add beyond pages a user has already seen — but Google has never said it uses that system, and a patent shows an invention, not a deployment.",
      blocks: [
        {
          kind: "p",
          text: "The patent is US11354342B2, “Contextual estimation of link information gain,” filed by Google in October 2018 and granted in June 2022. Its first claim describes an **automated assistant** that has already presented a user with information from some documents on a topic. It scores new documents on the same topic for the “additional information that would be gained by the user” beyond what they've already seen, and presents information from the one it selects. The description adds that documents can be re-ranked as the user views more of them.",
        },
        {
          kind: "list",
          items: [
            "**The score is relative to one user.** It compares a document with the documents that user has already been shown, not with every page on the web.",
            "**It's framed around an assistant.** The claims describe a system answering free-form natural-language questions — closer to today's AI search than to ten blue links.",
            "**It's unconfirmed.** Google hasn't said whether, or where, this system runs. Treat claims of an “information gain score” in Google's rankings as speculation.",
          ],
        },
        {
          kind: "p",
          text: "What Google does confirm is the principle. Its helpful-content guidance asks whether a page provides “original information, reporting, research, or analysis” and whether it avoids “simply copying or rewriting” its sources, and its ranking systems include original content systems that show original reporting “ahead of those who merely cite it.”",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Why does information gain matter more in AI search?",
      answer:
        "Information gain matters more in AI search because a language model can already write the consensus answer from its training data and a few sources, so the pages worth citing are the ones that supply what it can't generate: a figure, a test result, a first-hand account or a primary source.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Non-commodity content",
              body: "Google's AI features guide contrasts commodity content like “7 Tips for First-Time Homebuyers” with “Why We Waived the Inspection & Saved Money,” which offers “unique expert or experienced takes that go beyond common knowledge.”",
              evidence: "official",
            },
            {
              title: "Primary sources over content farms",
              body: "Anthropic says early agents behind Claude's Research mode “consistently chose SEO-optimized content farms over authoritative but less highly-ranked sources.” It fixed that with source-quality rules, and now grades the system on whether it used “primary sources over lower-quality secondary sources.”",
              evidence: "official",
            },
            {
              title: "Evidence raises visibility",
              body: "In the 2023 research paper that named [generative engine optimization](/glossary/generative-engine-optimization), adding statistics, quotations and citations raised a source's visibility in generated answers by up to about 40%.",
              evidence: "observed",
            },
            {
              title: "Undercovered topics stay hot",
              body: "Perplexity says its index keeps documents from “undercovered topics” and authoritative domains fresh — a structural reward for covering what others haven't.",
              evidence: "official",
            },
          ],
        },
        {
          kind: "p",
          text: "The flip side is [scaled content abuse](/glossary/scaled-content-abuse): pages mass-produced to restate what already exists add nothing, and Google's spam policies target exactly that purpose, whether the pages were written by people or by AI.",
        },
      ],
    },
    {
      id: "how-to-add",
      question: "How do you add information gain to a page?",
      answer:
        "Add information gain by finding what the top results and the AI answer already agree on, then contributing what they lack: numbers only your company has, a test you ran, a lesson from doing the work, an expert's specific view, or a worked example with real inputs.",
      blocks: [
        {
          kind: "table",
          head: ["Source of gain", "Example for a SaaS team", "Why engines can use it"],
          rows: [
            [
              "**First-party numbers**",
              "Median setup time from your onboarding calls; the share of trial users who invite a teammate",
              "A specific, quotable figure no other page can supply",
            ],
            [
              "**A test or teardown**",
              "Timing five tools importing the same 500-task spreadsheet",
              "First-hand evidence — what Google calls non-commodity",
            ],
            [
              "**Experience**",
              "What broke when you migrated your own team, and the fix",
              "The first E in [E-E-A-T](/glossary/e-e-a-t)",
            ],
            [
              "**A named expert view**",
              "Your lead engineer on when not to use a feature",
              "An attributable claim with a source",
            ],
            [
              "**A worked example**",
              "The actual cost for a 10-person team, line by line",
              "Specific enough to answer a narrow sub-query",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Gain isn't novelty for its own sake",
          text: "A contrarian claim with no evidence adds risk, not information. The addition has to be true, checkable and relevant to the question the section answers — and stated where it will be read, which means in the section's opening lines.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with information gain",
      answer:
        "The most common information gain mistakes are treating a longer article as a more original one, rewriting the top results in new words, and burying the one genuinely new finding deep in the page where neither readers nor AI engines reach it.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "More words means more information.",
              reality:
                "Length isn't gain. A 3,000-word page that restates the consensus adds less than one section with a new, sourced number.",
            },
            {
              myth: "Paraphrasing the top results makes content original.",
              reality:
                "Google's guidance asks for “substantial additional value and originality” when a page draws on other sources. New wording isn't new information.",
            },
            {
              myth: "Only big companies have original data.",
              reality:
                "Small teams have what big ones rarely publish: onboarding timings, support-ticket patterns, real quotes, mistakes made and fixed. One specific figure is enough to separate a page from the pack.",
            },
            {
              myth: "Save the original insight for the end.",
              reality:
                "Engines weight the top of a page. Growth Memo found 44.2% of ChatGPT citations came from the first 30% of the text, so lead with the new fact — the [answer-first](/glossary/answer-first-content) rule applied to your best material.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Consensus Diff",
    summary:
      "A pre-publish check that turns information gain from an abstract idea into a count. Build the consensus the engines already have, subtract it from your draft, and see what's left — if nothing is, the page is a rewrite.",
    items: [
      {
        label: "Build the consensus list",
        body: "Read the top five Google results and the AI answer to the page's main question in ChatGPT or Perplexity. Write down every claim they share, one line each. This is what an engine can say without you.",
      },
      {
        label: "Diff your draft",
        body: "Mark every claim in your draft that's already on the list. What stays unmarked is your gain. **Zero unmarked claims means the page is a rewrite**, however well it's written.",
      },
      {
        label: "Fill the gap from what only you have",
        body: "Add at least one item to each major section from the five sources: first-party numbers, a test, first-hand experience, a named expert view, a worked example with real inputs.",
      },
      {
        label: "Lead with the gain",
        body: "Move the new fact into the first sentence of the section it belongs to, with a name, a number and a date, so it's the part an engine lifts.",
      },
      {
        label: "Make it checkable",
        body: "Say how you know: the sample, the method, the date. An unsourced claim is easy to dismiss — for a reader, and for an engine choosing between sources.",
      },
    ],
    outcome:
      "Aim for at least one unmarked, checkable claim in every major section. A section that can't get one should be merged into another page or cut: it's the part of the page with the least reason to be cited.",
  },

  related: [
    "e-e-a-t",
    "scaled-content-abuse",
    "generative-engine-optimization",
    "answer-first-content",
    "topical-authority",
    "digital-pr",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web before it drafts, so each article starts from the current state of the topic and cites its sources instead of rewriting one top result — leaving your team free to add the first-hand detail only you have.",
  },
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description: "Google's non-commodity content guidance and what the 2026 citation data shows.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "Why Claude's Research mode is tuned to prefer primary sources over content farms.",
    },
  ],
  sources: [
    {
      title: "Contextual estimation of link information gain (US11354342B2)",
      publisher: "Google Patents",
      href: "https://patents.google.com/patent/US11354342B2/en",
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
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title: "How we built our multi-agent research system",
      publisher: "Anthropic Engineering",
      href: "https://www.anthropic.com/engineering/multi-agent-research-system",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "GEO: Generative Engine Optimization",
      publisher: "Aggarwal et al., KDD 2024",
      href: "https://arxiv.org/abs/2311.09735",
    },
    {
      title: "The science of how AI pays attention",
      publisher: "Growth Memo (Kevin Indig)",
      href: "https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention",
    },
  ],
};
