import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "prompt-tracking",
  metaTitle: "What Is Prompt Tracking? How to Monitor Your Brand in AI Answers",
  metaDescription:
    "Prompt tracking runs a fixed set of buyer questions through ChatGPT, Perplexity and Gemini on a schedule. How to build a panel, what to record and how often.",
  keywords: [
    "prompt tracking",
    "AI prompt tracking",
    "LLM tracking",
    "AI rank tracking",
    "how to track your brand in ChatGPT",
    "prompt tracking vs rank tracking",
  ],

  whyItMatters:
    "Buyers now ask ChatGPT and Perplexity for recommendations, and none of those conversations reach your analytics unless someone clicks. Prompt tracking is how a founder finds out whether the shortlist names them, a competitor or nobody — and you can start by hand with a spreadsheet and thirty questions.",

  questions: [
    {
      id: "how-to-build",
      question: "How do you build a prompt tracking panel?",
      answer:
        "Build a prompt tracking panel by collecting 25–50 questions your buyers really ask, written without your brand name, then running them on the same engines, on the same schedule and under the same conditions every time.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Source prompts from buyers, not keyword tools.** Sales-call notes, support tickets, demo-form answers and the question-shaped queries in [Search Console](/glossary/google-search-console) are the best raw material. The [AI question generator](/tools/ai-question-generator) can fill gaps.",
            "**Write two or three phrasings of your key questions.** People phrase the same need very differently: in SparkToro's 2026 study, prompts volunteers wrote for the same intent had a semantic similarity of just 0.081. Several phrasings stop you tracking one lucky wording.",
            "**Pick engines by where your buyers ask.** ChatGPT, Google AI Overviews and AI Mode, Perplexity, Gemini and Claude search different indexes, so track each one separately rather than as a blended score.",
            "**Freeze the conditions.** Use a clean session with memory and personalization off, and keep the location constant. OpenAI says ChatGPT infers location and may use memories when it rewrites a query.",
            "**Run every prompt more than once per cycle.** Answers vary from run to run, and two or three runs per prompt smooth out the noise.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Start small, stay fixed",
          text: "A 30-prompt panel you run every week beats a 300-prompt panel you run once. Add prompts in batches and keep the old ones, so the trend line stays comparable.",
        },
      ],
    },
    {
      id: "what-to-record",
      question: "What should you record for each prompt?",
      answer:
        "For every answer, record whether the engine searched the web, which brands it named, which pages it linked, whether your brand was named or cited, and whether what it said about you was accurate.",
      blocks: [
        {
          kind: "code",
          lang: "csv",
          code: 'date,engine,prompt_id,run,searched,brands_named,your_brand,cited_urls,accurate\n2026-09-21,chatgpt,cat-03,1,yes,"Loopcraft; Plannora; Taskwell",named+cited,"plannora.io/pricing; stackreview.co/best-pm",yes\n2026-09-21,gemini,cat-03,1,yes,"Loopcraft; Taskwell",absent,"loopcraft.ai/features",-',
        },
        {
          kind: "list",
          items: [
            "**Searched or not.** An answer written from training data won't change because you published a page this month; one built from a live search can. Semrush put ChatGPT's search rate at 34.5% of prompts in February 2026.",
            "**Named vs cited.** Keep mentions and links in separate columns. In Semrush's June 2026 study, Gemini named brands in 83.7% of their appearances but linked them in only 21.4%. See [AI citation](/glossary/ai-citation).",
            "**The cited URL.** Which of your pages earned the citation shows what to build more of, and the rival's cited page shows what to beat.",
            "**Accuracy.** A wrong price or a retired feature is an [AI hallucination](/glossary/ai-hallucination) worth fixing at the page the engine is reading.",
          ],
        },
      ],
    },
    {
      id: "how-often",
      question: "How often should you run prompt tracking?",
      answer:
        "Run prompt tracking weekly for the engines that matter most and monthly for the rest, with each prompt run more than once per cycle — AI answers vary so much between runs that one check a week can't separate a trend from chance.",
      blocks: [
        {
          kind: "p",
          text: "SparkToro and Gumshoe found less than a 1-in-100 chance that ChatGPT or Google's AI returns the same list of brands twice for one prompt, and Attrifast found about half of the domains Claude cites change between runs. What stays stable is frequency — how often a brand appears across many runs — so repetition is part of the method, not an extra.",
        },
        {
          kind: "table",
          head: ["Cadence", "Use it for"],
          rows: [
            ["**Weekly, 2–3 runs per prompt**", "Your primary engines and your core 25–50 prompts"],
            ["**Monthly**", "Secondary engines and an extended prompt set"],
            [
              "**Weekly for four weeks after a change**",
              "The prompts a new or rewritten page should affect",
            ],
            [
              "**Quarterly**",
              "Retire dead prompts, add new buyer questions, update the competitor list",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Access fixes show fast, content slowly",
          text: "OpenAI and Perplexity apply robots.txt changes within about 24 hours, but a new page has to be crawled, indexed and weighed against other sources first. Expect content changes to show in the panel over weeks, not days.",
        },
      ],
    },
    {
      id: "prompt-vs-rank-tracking",
      question: "Prompt tracking vs rank tracking: what's the difference?",
      answer:
        "Rank tracking records where your page sits for a keyword on a results page; prompt tracking records whether an AI answer names or cites your brand for a question — so it measures presence across repeated runs instead of one stable position.",
      blocks: [
        {
          kind: "table",
          head: ["", "Rank tracking", "Prompt tracking"],
          rows: [
            ["**Input**", "A keyword", "A full buyer question"],
            ["**Output**", "A position from 1 to 100", "Brands named, pages cited, accuracy"],
            ["**Stability**", "Fairly stable day to day", "Changes on almost every run"],
            ["**Success**", "Your page ranks", "Your brand is named or your page is cited"],
            [
              "**Official data**",
              "Search Console positions",
              "Search Console counts AI Overviews and AI Mode impressions; other engines publish nothing",
            ],
            [
              "**Summary metric**",
              "Average position",
              "[AI share of voice](/glossary/ai-share-of-voice) and visibility rate",
            ],
          ],
        },
        {
          kind: "p",
          text: "The two overlap less than you'd expect. Ahrefs found only about 8% of ChatGPT's citations rank in Google's or Bing's top 10 for the original prompt, because the engine searched [narrower sub-queries](/glossary/query-fan-out) than the one the user typed. A page can hold position one and still miss the answer.",
        },
        {
          kind: "p",
          text: "Google's own caveat applies to every tracker: \"No third-party tool has access to our internal ranking or AI systems.\" Prompt tracking samples what users see. It can't read the engine's scoring, which is why the sample has to be large and consistent.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with prompt tracking",
      answer:
        "The most common prompt tracking mistakes are putting your brand name in the prompts, treating one run as a result, checking from a personalized account and counting only links — each one makes the numbers look better or worse than buyers actually experience.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Our brand name belongs in the panel.",
              reality:
                "A prompt that names you gets an answer that names you. Keep branded prompts in a separate accuracy check and the main panel unbranded.",
            },
            {
              myth: "One run a week is enough.",
              reality:
                "A single run is one draw from a shifting distribution. Run each prompt two or three times per cycle and judge trends over a month.",
            },
            {
              myth: "Checking from my own logged-in account is fine.",
              reality:
                "Memory, chat history and location shape answers. Use clean sessions with fixed settings, or you are tracking yourself.",
            },
            {
              myth: "If we're not linked, we're not visible.",
              reality:
                "Mentions without links still shape shortlists, and engines like Gemini name brands far more often than they link them. Record both.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Four-Lens Prompt Panel",
    summary:
      "A way to build a prompt panel that covers every moment a buyer might meet your brand in an AI answer, instead of thirty variations of one question. The prompt counts are a rule of thumb for a 30-prompt panel, not a published standard.",
    items: [
      {
        label: "Category lens",
        body: "The shortlist moment: “best [category] for [segment]” prompts. **Example:** “best project management tool for a 10-person agency.” **Share:** about 10 prompts.",
      },
      {
        label: "Problem lens",
        body: "The pain before the buyer knows your category exists. **Example:** “how do I stop client projects slipping past deadlines?” **Share:** about 8 prompts.",
      },
      {
        label: "Comparison lens",
        body: "Head-to-head and switching prompts between named competitors, with or without you. **Example:** “Loopcraft vs Taskwell for client work” or “cheaper alternatives to Loopcraft.” **Share:** about 8 prompts.",
      },
      {
        label: "Validation lens",
        body: "Prompts that name you, scored for accuracy rather than presence: pricing, features, fit. **Example:** “does Plannora integrate with Slack?” **Share:** about 4 prompts.",
      },
    ],
    outcome:
      "Report the first three lenses as your share of voice and the fourth as an accuracy score. An empty lens shows where to publish next: problem-lens gaps call for how-to guides, comparison gaps for honest comparison pages, and validation errors for fixing the official page the engine is misreading.",
  },

  related: [
    "ai-share-of-voice",
    "ai-visibility",
    "ai-citation",
    "ai-referral-traffic",
    "query-fan-out",
    "generative-engine-optimization",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews for the buyer prompts you choose, and ties each citation back to the article that earned it.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description:
        "The content side, step by step: finding buyer questions, writing answer-first pages and building a prompt panel.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "How each engine searches and cites — the context you need to read a prompt panel engine by engine.",
    },
  ],
  sources: [
    {
      title: "AIs are highly inconsistent when recommending brands or products",
      publisher: "SparkToro",
      href: "https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
  ],
};
