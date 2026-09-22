import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "generative-engine-optimization",
  metaTitle: "What Is Generative Engine Optimization (GEO)? Definition & Guide",
  metaDescription:
    "GEO is the practice of getting cited inside AI answers from ChatGPT, Perplexity and Google AI Overviews. How it works, GEO vs SEO, and how to measure it.",
  keywords: [
    "generative engine optimization",
    "GEO",
    "what is GEO",
    "GEO vs SEO",
    "GEO marketing",
    "how to do generative engine optimization",
  ],

  whyItMatters:
    "Your buyers now ask ChatGPT or Perplexity for a shortlist before they ever see a search result, and the answer names three or four brands, not ten links. If you have no content team, GEO is the difference between being one of those names and being invisible at the moment the shortlist is made. The good news for small teams: engines cite pages that answer one question clearly, and that rewards focus more than budget.",

  questions: [
    {
      id: "how-it-works",
      question: "How does generative engine optimization work?",
      answer:
        "GEO works by making each page easy to fetch, easy to match to the sub-questions an AI engine searches for, and easy to quote in one passage — then earning enough mentions elsewhere that the engine trusts it.",
      blocks: [
        {
          kind: "p",
          text: "Almost every AI answer engine builds its answer the same way: it rewrites the question into several searches ([query fan-out](/glossary/query-fan-out)), retrieves candidate pages from a search index, splits them into passages, and writes an answer from the passages that best match — citing them. GEO is the work of being picked at each of those steps.",
        },
        {
          kind: "list",
          items: [
            "**Access:** the engine's crawler can fetch the page and read it without running JavaScript. See [AI crawlers](/glossary/ai-crawlers) and [server-side rendering](/glossary/server-side-rendering).",
            "**Retrieval:** the page is in the index the engine searches — Google's for AI Overviews and Gemini, Bing plus OpenAI's own for ChatGPT, Brave for Claude, Perplexity's own for Perplexity — and its titles match the sub-queries.",
            "**Extraction:** a single section answers a single question in its first sentence, so it can be lifted whole. See [answer-first content](/glossary/answer-first-content).",
            "**Trust:** the brand is mentioned, reviewed and linked across the web, and the page is current. See [brand mentions](/glossary/brand-mentions) and [content freshness](/glossary/content-freshness).",
          ],
        },
        {
          kind: "p",
          text: 'Google puts it bluntly in its own guidance: optimizing for its AI features "is still SEO." GEO doesn\'t replace the fundamentals — it changes which ones decide the outcome.',
        },
      ],
    },
    {
      id: "geo-vs-seo",
      question: "GEO vs SEO: what's the difference?",
      answer:
        "SEO competes for a ranked position on a results page; GEO competes to be quoted and named inside a generated answer — so GEO is judged passage by passage, and off-site mentions matter more than raw link counts.",
      blocks: [
        {
          kind: "table",
          head: ["", "SEO", "GEO"],
          rows: [
            ["**Goal**", "Rank a page for a query", "Be cited or named in the answer"],
            ["**Unit that competes**", "The page", "The passage — often one section"],
            [
              "**Query you optimize for**",
              "The keyword the user typed",
              "The sub-queries the engine writes (fan-out)",
            ],
            [
              "**Strongest authority signal**",
              "Backlinks",
              "Brand mentions across the web, then links",
            ],
            ["**Success metric**", "Position, clicks", "Citation rate, share of voice"],
            [
              "**Shared foundation**",
              "Crawlable, indexed, fast, helpful",
              "The same — without it, nothing else counts",
            ],
          ],
        },
        {
          kind: "p",
          text: "The overlap is larger than the differences: every major AI engine retrieves from a search index, so a page that can't be indexed can't be cited. But ranking isn't enough on its own. Ahrefs found only about **8%** of ChatGPT's citations rank in Google's or Bing's top 10 for the original prompt, and just **37.9%** of pages cited in Google AI Overviews rank top 10 for the typed query — because the engine searched for something narrower than what the user typed.",
        },
      ],
    },
    {
      id: "origin",
      question: "Where does the term GEO come from?",
      answer:
        "The term comes from a November 2023 research paper, “GEO: Generative Engine Optimization,” by researchers at Princeton, Georgia Tech, the Allen Institute for AI and IIT Delhi, later published at KDD 2024.",
      blocks: [
        {
          kind: "p",
          text: "The paper tested content changes against a benchmark of 10,000 queries and measured how visible a source became inside generated answers. Adding **citations, quotations from relevant sources and statistics** raised visibility by up to about 40%, while **keyword stuffing** — a classic SEO tactic — did little or made things worse. The lesson has held up in later industry studies: engines quote pages that sound like evidence.",
        },
        {
          kind: "p",
          text: "Related names describe the same work from different angles: [answer engine optimization (AEO)](/glossary/answer-engine-optimization) stresses the extractable answer, and [LLM SEO](/glossary/llm-seo) stresses the model. In practice the tactics overlap almost entirely.",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure GEO?",
      answer:
        "Measure GEO with a fixed panel of buyer prompts run on a schedule, recording how often each engine cites or names you versus competitors, then confirm the effect in AI referral traffic.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Pick 25–50 prompts** a buyer would really ask — category, comparison and problem questions, not your brand name.",
            "**Run them weekly** in each engine that matters to you and record who is cited and who is merely named. This is [prompt tracking](/glossary/prompt-tracking).",
            "**Compute your [AI share of voice](/glossary/ai-share-of-voice)**: the share of answers that cite or name you, against each competitor.",
            "**Check the downstream signal**: [AI referral traffic](/glossary/ai-referral-traffic) in analytics, and Google's generative AI report in [Search Console](/glossary/google-search-console) for AI Overviews impressions.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Expect volatility",
          text: "AI answers vary from run to run, even for the same prompt. Judge trends across weeks and dozens of prompts, never a single screenshot.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with generative engine optimization",
      answer:
        "The costliest GEO mistakes are blocking the wrong crawler, hiding content behind JavaScript, and writing sections that only make sense in context — each one removes a page from the answer before quality is even judged.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking GPTBot keeps my content out of ChatGPT.",
              reality:
                "`GPTBot` is training only. ChatGPT search uses `OAI-SearchBot` — block the wrong one and you vanish from answers while still being trained on. See [GPTBot](/glossary/gptbot).",
            },
            {
              myth: "An llms.txt file or special schema gets me cited.",
              reality:
                "No major engine has confirmed using [llms.txt](/glossary/llms-txt), and Google says there's no AI-specific markup. Crawlable, answer-first pages do the work.",
            },
            {
              myth: "GEO is a trick layered on top of content.",
              reality:
                "Engines cite pages that are the best available answer to a sub-question. Formatting helps a good answer get lifted; it can't make a thin one worth citing.",
            },
            {
              myth: "If I rank #1 on Google, I'll be cited.",
              reality:
                "Ranking helps, but fan-out means the engine often searched for something else. Cover the follow-up questions, not just the head term.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Four-Gate Citation Model",
    summary:
      "A page reaches an AI answer only by passing four gates in order, and failing an early gate zeroes everything after it. Audit a page gate by gate, and fix the first failure before touching anything downstream.",
    items: [
      {
        label: "Access",
        body: "Can the engine's crawler fetch the page? Check robots.txt for the search bot (not the training bot), CDN and firewall rules, and whether the text is in the raw HTML. **Test:** `curl` the page with the bot's user agent and search for your key sentence.",
      },
      {
        label: "Retrieval",
        body: "Is the page in the index the engine searches, and does it match the sub-queries? **Test:** confirm indexing in Google and Bing, then check that the title and H2s read like the narrow questions a buyer would ask next.",
      },
      {
        label: "Extraction",
        body: "Can one passage be lifted whole? **Test:** read each section's first sentence alone. If it doesn't answer the heading's question without the paragraph before it, rewrite it.",
      },
      {
        label: "Trust",
        body: "Would the engine choose you over the alternatives? **Test:** search your brand plus the topic on Reddit, YouTube, review sites and trade press, and check the page's last substantive update. No mentions and a stale date lose close calls.",
      },
    ],
    outcome:
      "Score each gate pass or fail and work on the first failure only. Access and Extraction are the cheapest gates to fix — an afternoon of robots.txt, rendering and rewriting opening sentences — so check them before spending months on Trust.",
  },

  related: [
    "answer-engine-optimization",
    "llm-seo",
    "search-engine-optimization",
    "query-fan-out",
    "ai-citation",
    "ai-share-of-voice",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web and writes source-backed articles built to pass all four gates — answer-first sections, clear definitions and cited evidence — then scores each one for GEO before it publishes.",
  },
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
      description: "The content playbook for earning ChatGPT citations, step by step.",
    },
  ],
  sources: [
    {
      title: "GEO: Generative Engine Optimization",
      publisher: "Aggarwal et al., KDD 2024",
      href: "https://arxiv.org/abs/2311.09735",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
  ],
};
