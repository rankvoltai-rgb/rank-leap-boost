import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "knowledge-cutoff",
  metaTitle: "What Is a Knowledge Cutoff? Why AI Doesn't Know Your Latest News",
  metaDescription:
    "A knowledge cutoff is the date an AI model's training data ends. What it means for your launches and price changes, and how new facts still reach AI answers.",
  keywords: [
    "knowledge cutoff",
    "training cutoff",
    "what is a knowledge cutoff",
    "training data cutoff",
    "AI knowledge cutoff date",
    "ChatGPT knowledge cutoff",
  ],

  whyItMatters:
    "Anything your company did after a model's cutoff — the launch, the new pricing, the pivot — doesn't exist in that model's memory, and it reaches an answer only if the engine searches and finds a page that says it. For a small team shipping fast, the most important facts about you are often the newest ones, and the newest facts are only as visible as the pages that state them.",

  questions: [
    {
      id: "what-happens-after-cutoff",
      question: "What happens to information published after a knowledge cutoff?",
      answer:
        "Information published after a knowledge cutoff is absent from the model's built-in knowledge, so it reaches an AI answer only when the engine runs a web search and retrieves a page containing it; without a search, the model answers from older data or guesses.",
      blocks: [
        {
          kind: "p",
          text: 'Vendors say this plainly. Anthropic describes web search as the way Claude answers "with up-to-date information beyond its knowledge cutoff," and lists what triggers a search: recent events, current prices and "information about specific organizations, people, or products that might have changed" ([Anthropic](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)). Stable, general questions are answered from memory.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "A buyer asks about your product",
              body: '"Does Plannora have a Slack integration?" The integration launched after the model\'s cutoff.',
            },
            {
              title: "The engine decides whether to search",
              body: "Product-specific and time-sensitive questions usually trigger a search. Independent tests found ChatGPT and Claude searched on roughly a third of all prompts.",
              lever:
                "Target the questions that trigger search — they're where a new fact can win this month.",
            },
            {
              title: "If it searches, retrieval finds a page — or doesn't",
              body: "The new fact reaches the answer only if a crawlable, indexed page states it clearly. See [retrieval-augmented generation](/glossary/retrieval-augmented-generation).",
              lever:
                "Publish the fact on a clearly titled, server-rendered page, linked from pages that already rank.",
            },
            {
              title: "If it doesn't search, the model answers from memory",
              body: "It may say the integration doesn't exist, or guess — an [AI hallucination](/glossary/ai-hallucination) built on stale training data.",
            },
          ],
        },
      ],
    },
    {
      id: "find-cutoff",
      question: "How do you find a model's knowledge cutoff?",
      answer:
        "Find a model's knowledge cutoff in the vendor's model documentation — OpenAI lists a cutoff for each API model and Anthropic lists two dates per model — rather than by asking the chatbot, whose description of its own training is generated text like any other answer.",
      blocks: [
        {
          kind: "p",
          text: 'OpenAI\'s [model comparison page](https://developers.openai.com/api/docs/models/compare) shows a "Knowledge Cutoff" for every API model. Anthropic\'s [models overview](https://platform.claude.com/docs/en/models/overview) lists a **reliable knowledge cutoff** — "the date through which the model\'s knowledge is most extensive and reliable" — next to a broader **training data cutoff**. For one model on that list as of September 2026, Claude Haiku 4.5, the two dates are five months apart: February and July 2025.',
        },
        {
          kind: "p",
          text: 'Even the published date is approximate. A 2024 study, [Dated Data](https://arxiv.org/abs/2403.12958), found that "effective cutoffs often differ from reported cutoffs," in part because new web crawls contain a lot of old pages. The two-date convention reflects the same reality: the last months before a training cutoff are thinly covered, likely because the web hadn\'t finished writing about them when the data was collected.',
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Don't plan around a single date",
          text: "Cutoffs move with every model release, and chat apps route questions between models. Check the vendor's model page when a date matters, and assume any answer given without citations may be working from data that is many months old.",
        },
      ],
    },
    {
      id: "cutoff-vs-real-time-search",
      question: "Knowledge cutoff vs real-time search: what's the difference?",
      answer:
        "The knowledge cutoff limits what a model remembers, while real-time search fetches current pages at answer time — so the same engine can be months out of date in one answer and current to the day in the next, depending on whether it searched.",
      blocks: [
        {
          kind: "table",
          head: ["", "From training (before the cutoff)", "From real-time search"],
          rows: [
            ["**Freshness**", "Fixed at the cutoff date", "As fresh as the page retrieved"],
            ["**Citations**", "None", "Links to the pages used"],
            [
              "**Can you update it?**",
              "No — only the next model can learn it",
              "Yes — publish or fix the page",
            ],
            [
              "**Where you compete**",
              "Web-wide presence built over years",
              "One page, one passage, this month",
            ],
            [
              "**Triggered by**",
              "Stable, general questions",
              "Current, specific, product-level questions",
            ],
          ],
        },
        {
          kind: "p",
          text: "When engines do search, they lean hard on freshness. Claude added the current year to 94% of its search queries in Profound's 2026 test, [Perplexity filters stale pages](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api) before ranking, and Ahrefs found ChatGPT's citations run hundreds of days newer than Google's organic results. A visible, honest updated date is how a page tells the engine it knows something the model doesn't. See [content freshness](/glossary/content-freshness).",
        },
      ],
    },
    {
      id: "get-new-facts-into-ai",
      question: "How do you get new information into AI answers after the cutoff?",
      answer:
        "Get new information into AI answers after the knowledge cutoff by publishing it where retrieval looks: an official, clearly titled, server-rendered page for each new fact, indexed in Google and Bing, linked from your existing pages, and repeated in places engines cite, such as review sites and forums.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Update the page that already ranks** before creating a new one. Since August 2026 most ChatGPT fan-out searches use `site:` to check specific domains, often the vendor's own — and a `site:` search for pricing lands on a pricing page, not a press release.",
            '**Title for the question.** "Plannora Slack integration" beats "Big news from the Plannora team."',
            "**Get recrawled quickly.** Submit sitemaps to Google Search Console and Bing Webmaster Tools, and ping Bing with [IndexNow](/glossary/indexnow) — Bing is one of ChatGPT's named search providers.",
            "**Retire the old fact everywhere you control** — old blog posts, help docs, comparison pages — so retrieval doesn't find two versions.",
            "**Repeat it where engines look.** Update review profiles and directories, and answer relevant community threads. See [brand mentions](/glossary/brand-mentions).",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "The next model will learn it too",
          text: "Pages published today are candidates for future training data, so the fact you publish for retrieval now is also the fact the next model can learn. Keeping one consistent version across the web serves both. See [LLM training data](/glossary/llm-training-data).",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Fact Freshness Triage",
    summary:
      "Sort every fact about your company by when it became true relative to current models' cutoffs, because each group needs a different fix. Run it after any launch, price change or rebrand.",
    items: [
      {
        label: "Stable facts",
        body: "True before and after the cutoff: what you do, who you serve, where you're based. Models usually know these if the web states them consistently. **Action:** keep them identical everywhere, and don't churn the wording.",
      },
      {
        label: "Changed facts",
        body: "True once, wrong now: old prices, renamed plans, a previous company name. These are the most dangerous, because the model remembers the old version with confidence. **Action:** state the new fact on the official page, redirect or update the old pages, and correct third-party listings.",
      },
      {
        label: "New facts",
        body: "Didn't exist before the cutoff: new features, integrations, customers, locations. The model has no memory of them at all. **Action:** publish a clearly titled page for each, get it indexed, and link it from pages that already rank.",
      },
      {
        label: "Retired facts",
        body: "Things that stopped being true: discontinued products, ended partnerships, closed offices. Models may still recommend them. **Action:** keep a page that says clearly what changed and what replaced it, rather than deleting the URL.",
      },
    ],
    outcome:
      "Changed and retired facts do the most damage, because a model states them confidently and a buyer has no reason to doubt it. Fix those first, publish the new facts next, and use a monthly prompt panel to see which version each engine repeats.",
  },

  related: [
    "llm-training-data",
    "large-language-model",
    "content-freshness",
    "retrieval-augmented-generation",
    "ai-hallucination",
    "indexnow",
  ],
  product: {
    feature: "auto-publishing",
    pitch:
      "Rankbox publishes a new optimized article every day to WordPress, Webflow, Shopify, Wix or Framer, or to any stack through its API — a steady supply of fresh, dated pages on the live web, where search-enabled engines look for anything newer than their cutoff.",
  },
  further: [
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "When Claude answers from training and when it searches — and why it adds the current year to almost every query.",
    },
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "How ChatGPT decides to search, and the official pages its site: fan-outs look for.",
    },
  ],
  sources: [
    {
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
    {
      title: "Models overview",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/models/overview",
    },
    {
      title: "Compare models",
      publisher: "OpenAI API",
      href: "https://developers.openai.com/api/docs/models/compare",
    },
    {
      title: "Dated Data: Tracing Knowledge Cutoffs in Large Language Models",
      publisher: "Cheng et al., 2024",
      href: "https://arxiv.org/abs/2403.12958",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
    {
      title: "Do AI assistants prefer to cite fresh content?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
    },
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
  ],
};
