import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "llm-seo",
  metaTitle: "What Is LLM SEO? Getting Your Brand Into ChatGPT, Claude & Gemini",
  metaDescription:
    "LLM SEO makes your brand visible in ChatGPT, Claude and Gemini answers: both what models remember from training and what they cite from the live web.",
  keywords: [
    "LLM SEO",
    "LLM optimization",
    "LLMO",
    "AI SEO",
    "what is LLM SEO",
    "how to rank in ChatGPT and Claude",
  ],

  whyItMatters:
    "Most answers from ChatGPT and Claude never touch the web: in 2026 studies ChatGPT searched on about a third of prompts and Claude on 36.6%, so the rest came from what the model already believed about your category. If you're a young brand, that memory probably doesn't include you yet — LLM SEO is how you get into both the model's memory and its live searches, instead of hoping one covers for the other.",

  questions: [
    {
      id: "how-it-works",
      question: "How does LLM SEO work?",
      answer:
        "LLM SEO works on two routes into a model's answer: its training data, which shapes what it says without searching, and live retrieval, which decides what it cites when it does search — each with different levers and very different timescales.",
      blocks: [
        {
          kind: "table",
          head: ["", "Training memory", "Live retrieval"],
          rows: [
            [
              "**What it is**",
              "What the model learned before release — its [training data](/glossary/llm-training-data)",
              "Pages fetched at question time — [retrieval-augmented generation](/glossary/retrieval-augmented-generation)",
            ],
            [
              "**When it's used**",
              "Most answers: ChatGPT searched on 34.5% of prompts in February 2026",
              "Current, specific, local and comparison questions",
            ],
            [
              "**Crawlers involved**",
              "`GPTBot`, `ClaudeBot`, `Google-Extended`",
              "`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, Googlebot",
            ],
            [
              "**How fast changes land**",
              "Only in the next model, trained after a new [knowledge cutoff](/glossary/knowledge-cutoff)",
              "Days to weeks, once pages are recrawled",
            ],
            [
              "**What you control**",
              "Being described widely and consistently across the web",
              "Crawlable, indexed, answer-first pages",
            ],
          ],
        },
        {
          kind: "p",
          text: "Most advice covers only the second column, because it's the one you can test this week. But the first column decides what a model says about your category whenever it doesn't search. OpenAI, Anthropic and Google each let you opt out of training separately from search, so blocking training crawlers is a trade-off, not a free privacy win.",
        },
      ],
    },
    {
      id: "llm-seo-vs-geo",
      question: "LLM SEO vs GEO: what's the difference?",
      answer:
        "LLM SEO and [GEO](/glossary/generative-engine-optimization) describe nearly the same work, but LLM SEO puts the model at the center — including what it says from training data with no search at all — while GEO focuses on being retrieved and cited inside generated answers.",
      blocks: [
        {
          kind: "p",
          text: "The labels multiply because the field is young: [AEO](/glossary/answer-engine-optimization), GEO, LLMO, AI SEO. The tactics overlap almost entirely. The distinction worth keeping is the training-data route: a GEO checklist rarely asks whether a model knows your brand when it doesn't search, and an LLM SEO checklist should.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Test both routes",
          text: "Ask a model about your category with web search turned off where the app allows it, or through an API call with no search tool. Then ask again with search on. The first answer shows its memory; the second shows its retrieval. Different gaps need different fixes.",
        },
      ],
    },
    {
      id: "influence-training",
      question: "How do you influence what an LLM knows about your brand?",
      answer:
        "Influencing what an LLM knows about your brand means being described consistently and often across the public web it learns from — your own pages, reviews, forums, videos and press — allowing the training crawlers you're comfortable with, and then waiting for the next model.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Brand mentions, especially on YouTube",
              body: "Across 75,000 brands, Ahrefs found YouTube mentions correlated most with AI visibility (about 0.74) and branded web mentions next (0.66–0.71), while backlink counts correlated at about 0.19. See [brand mentions](/glossary/brand-mentions).",
              evidence: "observed",
            },
            {
              title: "Training crawlers allowed",
              body: "OpenAI, Anthropic and Google document `GPTBot`, `ClaudeBot` and `Google-Extended` as training controls, separate from search. Disallow them and future content stays out of future models.",
              evidence: "official",
            },
            {
              title: "Consistent entity facts",
              body: "The same name, category, pricing model and founding facts on your site, profiles and directories plausibly help a model tie you to the right topics — no vendor documents how. See [entity SEO](/glossary/entity-seo).",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "p",
          text: "Correcting a model's mistakes follows the same logic. If ChatGPT states an old price or a feature you dropped, publish the correct fact clearly on your own site and in the places that discuss you. The next search-triggered answer can pick it up within weeks; the model's memory changes only when a new model ships. See [AI hallucination](/glossary/ai-hallucination).",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure LLM SEO?",
      answer:
        "Measure LLM SEO with a fixed panel of buyer prompts run on a schedule across ChatGPT, Claude, Gemini and Perplexity, recording whether each answer mentions you, cites you and describes you accurately — then confirm the effect in AI referral traffic.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Build a prompt panel** of 25–50 real buyer questions — category, comparison and problem prompts, not your brand name. See [prompt tracking](/glossary/prompt-tracking).",
            "**Record mentions and citations separately.** A Semrush and Growth Memo study found 87% of ChatGPT's brand appearances carried a link but only 21.4% of Gemini's — count links alone and you miss most of Gemini.",
            "**Score accuracy.** Is the price, category and positioning right? A mention with a wrong fact is a problem to fix, not a win.",
            "**Track [AI referral traffic](/glossary/ai-referral-traffic)** from `chatgpt.com`, `claude.ai`, `perplexity.ai` and `gemini.google.com` in analytics.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Run every prompt more than once",
          text: "Answers vary between runs: in Attrifast's 2026 study, roughly a third to a half of cited sources changed when the same prompt was repeated, and Claude was the least stable. Judge trends over weeks, not single answers.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with LLM SEO",
      answer:
        "The most common LLM SEO mistakes are optimizing only for live search while ignoring what models already say, blocking training crawlers by reflex, and trusting single screenshots or shortcut files like llms.txt.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "An llms.txt file tells LLMs about my brand.",
              reality:
                "No major engine has confirmed reading other sites' [llms.txt](/glossary/llms-txt) files, and Ahrefs found 97% of such files get no requests at all.",
            },
            {
              myth: "Blocking GPTBot costs me nothing in ChatGPT.",
              reality:
                "True for ChatGPT search, which uses `OAI-SearchBot`. But ChatGPT searched on only about a third of prompts in early 2026; the rest drew on training, which [GPTBot](/glossary/gptbot) feeds.",
            },
            {
              myth: "One screenshot shows where I stand.",
              reality:
                "Answers change between runs, users and locations. Use a repeated prompt panel and read the trend.",
            },
            {
              myth: "LLM SEO replaces SEO.",
              reality:
                "Every engine's live search runs on a search index, so crawlable, indexed pages remain the base. See [search engine optimization](/glossary/search-engine-optimization).",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Memory-and-Search Matrix",
    summary:
      "A two-by-two for diagnosing where a brand stands with one model: does it know you from training, and does it find you when it searches? Ask each buyer prompt twice — search off, then search on — and place yourself in one of four quadrants.",
    items: [
      {
        label: "Invisible: not remembered, not found",
        body: "The model doesn't know you and doesn't retrieve you. **Fix first:** crawler access, indexing, and one answer-first page per core buyer question — retrieval is the faster route in.",
      },
      {
        label: "Found, not remembered",
        body: "You're cited when the model searches but absent whenever it answers from memory, which is most of the time. **Next:** earn mentions on the review sites, forums, videos and press that shape future training.",
      },
      {
        label: "Remembered, not found",
        body: "The model describes you from training but cites competitors when it searches, and its facts may be out of date. **Next:** publish current official pages — pricing, features, comparisons — titled to match the sub-queries it runs.",
      },
      {
        label: "Default answer: remembered and found",
        body: "The model names you from memory and confirms it with your pages. **Protect it:** keep facts consistent everywhere, refresh pages before they go stale, and check accuracy in every run.",
      },
    ],
    outcome:
      "Run the test across your top ten buyer prompts on each engine you care about, and fix the quadrant that holds the most prompts. A young brand usually starts in Invisible; work the retrieval side first, because it pays off in weeks, while training pays off only when the next model ships.",
  },

  related: [
    "generative-engine-optimization",
    "llm-training-data",
    "large-language-model",
    "retrieval-augmented-generation",
    "brand-mentions",
    "ai-visibility",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews for the prompts your buyers ask, and shows which article earned each citation — so you can see which answers you're missing from.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Training crawlers, search crawlers and indexes for ChatGPT, Claude, Gemini, Perplexity and Google, compared.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description: "Why most Claude answers never search, and what that means for ClaudeBot.",
    },
  ],
  sources: [
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
    {
      title: "Does Anthropic crawl data from the web, and how can site owners block the crawler?",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    {
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
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
      title: "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews (75k brands)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
    {
      title: "llms.txt study",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/llmstxt-study/",
    },
  ],
};
