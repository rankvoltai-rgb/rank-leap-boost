import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "ai-citation",
  metaTitle: "What Is an AI Citation? How AI Engines Choose Sources to Cite",
  metaDescription:
    "An AI citation is a clickable source link an AI engine attaches to its answer. How ChatGPT, Perplexity, Claude and Google cite, and how to earn citations.",
  keywords: [
    "AI citation",
    "LLM citation",
    "AI source citation",
    "what is an AI citation",
    "how to get cited by AI",
    "AI citation vs mention",
  ],

  whyItMatters:
    "An AI citation is the one part of an AI answer that can send a buyer to your site, and each answer has only a few slots — a median of roughly two to six domains, depending on the engine. For a small team that scarcity cuts both ways: there's little room in each answer, but engines pick passages rather than whole sites, so one precise section can earn a slot that a bigger competitor's vaguer page doesn't.",

  questions: [
    {
      id: "citation-vs-mention",
      question: "AI citation vs brand mention: what's the difference?",
      answer:
        "An AI citation is a clickable link to a specific page the answer relied on, while a brand mention is your name in the answer text, with or without a link — and engines differ sharply in which they give, so you need to track both.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "62%",
              label:
                "of AI citations were “ghost citations”: the page was linked but the brand never named",
              source: {
                name: "Semrush × Growth Memo, Jun 2026",
                href: "https://www.semrush.com/blog/the-ghost-citations-study/",
              },
            },
            {
              value: "87%",
              label: "of ChatGPT's brand appearances carried a citation link",
              source: {
                name: "Semrush × Growth Memo, Jun 2026",
                href: "https://www.semrush.com/blog/the-ghost-citations-study/",
              },
            },
            {
              value: "21.4%",
              label: "of Gemini's brand appearances carried a link — 83.7% were text mentions",
              source: {
                name: "Semrush × Growth Memo, Jun 2026",
                href: "https://www.semrush.com/blog/the-ghost-citations-study/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "The two do different jobs. A citation can send traffic and tells you which page earned the slot; a mention shapes what the buyer believes even when nobody clicks. The same study found almost no overlap between the brands ChatGPT cites and the brands Gemini names for the same prompt — being strong on one engine says little about another. See [brand mentions](/glossary/brand-mentions).",
        },
      ],
    },
    {
      id: "how-engines-choose",
      question: "How do AI engines decide what to cite?",
      answer:
        "AI engines cite the passages they used to write the answer: they retrieve candidate pages for several sub-queries, rerank individual passages against the question, and link the few that best support each claim — which is why the cited list rarely matches the classic top ten.",
      blocks: [
        {
          kind: "pipeline",
          steps: [
            {
              title: "Sub-queries retrieve candidates",
              body: "The engine searches several narrower versions of the question and pulls in more pages than it will use: Ahrefs found only about half of the URLs ChatGPT retrieves end up cited.",
              lever: "Match titles and headings to the narrow questions buyers ask next.",
            },
            {
              title: "Passages are scored",
              body: "Perplexity documents splitting pages into “self-contained spans” and reranking them with cross-encoder models. See [reranking](/glossary/reranking).",
              lever: "Answer each section's question in its first sentence.",
            },
            {
              title: "Links attach to claims",
              body: "Google places inline links beside the claims they support; each Claude citation quotes up to 150 characters of its source; Perplexity shows numbered source cards. This is [grounding](/glossary/grounding) made visible.",
              lever: "Put each key fact in one self-contained sentence.",
            },
          ],
        },
        {
          kind: "p",
          text: "Ranking gets a page into the pool but doesn't decide the slot. About 8% of ChatGPT's citations rank in Google's or Bing's top 10 for the original prompt, and 37.9% of AI Overview citations rank top 10 for the typed query (Ahrefs). The rest won a sub-query the user never typed.",
        },
      ],
    },
    {
      id: "how-to-earn",
      question: "How do you get cited by AI?",
      answer:
        "Getting cited by AI takes crawlable pages that each engine's search bot can read as plain HTML, sections that answer one question in their first sentence with a specific fact, visibly current content, and mentions on the sites engines already cite for your topic.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Open the door.** Allow `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` and Googlebot, and serve content in the initial HTML. See [AI crawlers](/glossary/ai-crawlers).",
            "**Write liftable sentences.** Growth Memo found 44.2% of ChatGPT citations came from the first 30% of a page, and Claude quotes at most 150 characters per citation. Lead with the fact. See [answer-first content](/glossary/answer-first-content).",
            "**Publish official pages.** Pricing, specs, integrations and comparisons on your own domain are the targets of `site:` searches — 64% of ChatGPT's fan-outs after August 2026, per Nectiv.",
            "**Stay fresh.** Ahrefs found Perplexity's citations average about 250 days fresher than Google's organic results. Update substantively and show the date.",
            "**Be discussed elsewhere.** Reviews, YouTube, forums and trade press give engines a second route to your name. See [digital PR](/glossary/digital-pr).",
          ],
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure AI citations?",
      answer:
        "Measure AI citations with a fixed panel of buyer prompts run repeatedly in each engine, recording which of your pages are cited, which competitors take the other slots, and which article earned each citation — then confirm clicks in AI referral traffic.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Citation rate:** the share of panel answers that link to your domain. See [prompt tracking](/glossary/prompt-tracking).",
            "**Page attribution:** which URL earned each citation — the pages to protect, refresh and imitate.",
            "**Competing sources:** the domains cited when you aren't. Often a comparison page or review you could be featured on.",
            "**Referral clicks:** ChatGPT links arrive [tagged](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) `utm_source=chatgpt.com`; `claude.ai` and `perplexity.ai` arrive without UTM tags. See [AI referral traffic](/glossary/ai-referral-traffic).",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Citations churn between runs",
          text: "Attrifast's 2026 study measured a Jaccard overlap of only 0.49 to 0.67 between repeated runs of the same prompt, depending on the engine — roughly a third to a half of citations change. Run each prompt several times before drawing conclusions.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with AI citations",
      answer:
        "The most common AI citation mistakes are blocking the search crawler while meaning to block training, burying key facts deep in long pages, and treating one cited answer as a lasting position.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking GPTBot or ClaudeBot stops my citations.",
              reality:
                "Those are training bots. Citations depend on `OAI-SearchBot`, `Claude-SearchBot` and `Claude-User` — block one of those by mistake and you lose the citation while still being trained on.",
            },
            {
              myth: "Citations can be bought.",
              reality:
                "[OpenAI says](https://openai.com/index/testing-ads-in-chatgpt/) ChatGPT ads don't influence answers, [Anthropic has pledged](https://www.anthropic.com/news/claude-is-a-space-to-think) no sponsored links in Claude, and Perplexity sells no placement in answers.",
            },
            {
              myth: "Schema or an llms.txt file earns citations.",
              reality:
                "Google says its AI features need no special markup, and no major engine has confirmed reading [llms.txt](/glossary/llms-txt).",
            },
            {
              myth: "Once cited, always cited.",
              reality:
                "Citations churn between runs and fade as competitors publish fresher answers. See [content decay](/glossary/content-decay).",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Citation Slots Benchmark",
    summary:
      "How many sources each AI engine typically cites per answer — the number of slots you're competing for. Values are median unique domains per answer from Attrifast's study of 14,400 prompt runs across 12 verticals (April–May 2026), plus Claude's documented quote limit.",
    items: [
      {
        label: "Gemini",
        value: "2.4 domains",
        body: "The fewest slots, and Gemini names brands in text far more often than it links them, so unlinked mentions carry much of its visibility.",
      },
      {
        label: "ChatGPT search",
        value: "3.1 domains",
        body: "Few slots per answer, though it retrieves far more pages than it uses — Ahrefs found only about half of retrieved URLs get cited.",
      },
      {
        label: "Claude",
        value: "3.6 domains",
        body: "Also the least stable engine between runs in the same study (0.49 overlap), so single checks mislead most here.",
      },
      {
        label: "Perplexity",
        value: "6.4 domains",
        body: "The most slots and the most stable citations (0.67 overlap) — the easiest engine in which to confirm you're cited.",
      },
      {
        label: "Claude quote length",
        value: "≤ 150 characters",
        body: "Each Claude web-search citation quotes at most 150 characters of the source, per Anthropic's documentation — roughly the size of one fact worth writing.",
      },
    ],
    outcome:
      "Fewer slots leave less room for runners-up: on Gemini and ChatGPT, the fourth-best source often isn't cited at all. Medians vary by vertical and by method — domains versus URLs — so use these to set expectations, not targets, and aim each key page at one sub-question it can win outright.",
  },

  related: [
    "brand-mentions",
    "ai-visibility",
    "generative-engine-optimization",
    "reranking",
    "grounding",
    "prompt-tracking",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews and shows which article earned each citation, so you can see which pages win slots and write more like them.",
  },
  further: [
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "The content playbook for earning ChatGPT citations, step by step.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description: "How Claude picks, quotes and links its sources — and why its citations churn.",
    },
  ],
  sources: [
    {
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
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
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "Why ChatGPT cites the pages it does",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
    {
      title: "44% of ChatGPT citations come from the first third of content: Study",
      publisher: "Search Engine Land",
      href: "https://searchengineland.com/chatgpt-citations-content-study-469483",
    },
    {
      title: "Do AI assistants prefer to cite fresh content?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
    },
  ],
};
