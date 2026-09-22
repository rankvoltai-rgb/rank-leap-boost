import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "ai-hallucination",
  metaTitle: "What Is an AI Hallucination? Why AI Gets Your Brand Wrong",
  metaDescription:
    "An AI hallucination is a confident, false claim from ChatGPT, Gemini or Claude. Why models hallucinate about brands, how to find the errors and how to fix them.",
  keywords: [
    "AI hallucination",
    "LLM hallucination",
    "what is an AI hallucination",
    "why does AI hallucinate",
    "ChatGPT wrong information about my company",
    "fix AI hallucinations about my brand",
  ],

  whyItMatters:
    "When an AI assistant tells a buyer your product lacks a feature it has, or quotes last year's price, you lose the deal without ever knowing it happened. Small brands are the most exposed, because the facts a model is most likely to invent are the ones that appear rarely on the web — which describes most facts about a young company.",

  questions: [
    {
      id: "why-ai-hallucinates",
      question: "Why do AI models hallucinate?",
      answer:
        "AI models hallucinate because a large language model generates the most plausible next words rather than looking facts up, and training and evaluation reward a confident guess over admitting uncertainty — so rare facts get filled in with fluent fiction.",
      blocks: [
        {
          kind: "p",
          text: 'OpenAI researchers made the case in a September 2025 paper, [Why Language Models Hallucinate](https://arxiv.org/abs/2509.04664): "Like students facing hard exam questions, large language models sometimes guess when uncertain, producing plausible yet incorrect statements instead of admitting uncertainty." Benchmarks that score only right or wrong answers teach models that a guess beats "I don\'t know."',
        },
        {
          kind: "p",
          text: 'The paper\'s most useful point for brands is about **rare facts**. Facts with no learnable pattern — a birthday, a founding date, a price — can only be memorized, and the authors estimate that "if 20% of birthday facts appear exactly once in the pretraining data, then one expects base models to hallucinate on at least 20% of birthday facts." A fact about your company that appears on one page of the web is a fact a model is likely to get wrong.',
        },
        {
          kind: "callout",
          tone: "note",
          title: "Search reduces hallucination — it doesn't end it",
          text: "[Grounding](/glossary/grounding) an answer in retrieved pages cuts errors, but engines still misread, mix up and misattribute sources. When Columbia's Tow Center asked eight AI search tools to identify the source of 1,600 news excerpts, they answered more than 60% of queries incorrectly — and usually with confidence rather than a caveat.",
        },
      ],
    },
    {
      id: "hallucinations-about-brands",
      question: "Can AI hallucinate about my company?",
      answer:
        "AI can hallucinate about any company, and the most common brand hallucinations are outdated prices, invented or missing features, wrong integrations, confusion with similarly named companies and fabricated citations — usually when the model answers from memory or from a thin, ambiguous source.",
      blocks: [
        {
          kind: "table",
          head: ["Type", "Example", "Usual cause"],
          rows: [
            [
              "**Stale fact**",
              "Quotes a price you changed in March",
              "Answering from training data older than the change — see [knowledge cutoff](/glossary/knowledge-cutoff)",
            ],
            [
              "**Invented detail**",
              "Says you offer a free plan you've never had",
              "A rare fact filled in with a plausible guess",
            ],
            [
              "**Entity confusion**",
              "Mixes you up with a similarly named company",
              "Weak or inconsistent entity signals — see [entity SEO](/glossary/entity-seo)",
            ],
            [
              "**Misattribution**",
              "Cites a reseller's outdated page for your specs",
              "Retrieval found a third-party copy before your page",
            ],
            [
              "**Fabricated source**",
              "Links to a URL that doesn't exist",
              "The model generating a citation instead of retrieving one",
            ],
          ],
        },
        {
          kind: "p",
          text: "Fabricated sources are not rare: the [Tow Center study](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php) found that more than half of Gemini's and Grok 3's responses cited fabricated or broken URLs. And because Gemini names brands in text far more often than it links them — only 21.4% of its brand appearances carried a link in a June 2026 Semrush study — an unlinked claim about you may have no source you can trace.",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure AI hallucinations about your brand?",
      answer:
        "Measure brand hallucinations with a fixed panel of prompts about your company, run in each engine on a schedule, with every factual claim checked against a single source of truth — then track the share of brand mentions that contain at least one false claim.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Write your fact sheet first:** pricing, plans, core features, integrations, founding date, locations and who the product is for. This is the answer key.",
            '**Build 20–30 prompts** buyers really ask: "How much does Plannora cost?", "Does Plannora integrate with Slack?", "Plannora vs Loopcraft for a small team."',
            "**Run them in each engine**, with search on and off where the product lets you. The difference shows whether an error comes from training or from a retrieved page.",
            "**Score each answer** against the fact sheet, and log the cited source behind every wrong claim.",
            "**Repeat monthly** and after every price or product change. Answers vary from run to run, so trends across several runs matter more than any single error. This is [prompt tracking](/glossary/prompt-tracking) with an accuracy column.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Search on vs search off",
          text: "If an error appears only without search, it lives in the model's [training data](/glossary/llm-training-data), and the fix is making the right answer easy to retrieve for the questions that trigger a search. If it appears with search on, a live page is feeding it — find that page, then fix it or outrank it.",
        },
      ],
    },
    {
      id: "how-to-fix",
      question: "How do you fix AI hallucinations about your brand?",
      answer:
        "Fix brand hallucinations by publishing the correct facts where retrieval will find them — clearly titled, dated pages on your own domain, stated in plain sentences — and by correcting the third-party pages engines cite, since nobody can edit a model's memory directly.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Publish an official page for every checkable fact:** pricing, plans, integrations, security, comparisons. Since August 2026 most ChatGPT fan-out searches use `site:` to check specific domains, often the vendor's own, so an official page is frequently the first place it looks.",
            "**State facts in citable sentences.** \"Plannora's Team plan costs $8 per user per month, billed annually\" beats a pricing grid rendered by JavaScript that no AI fetcher except Google's can read.",
            "**Date and update honestly.** Show a visible updated date and change it only with real changes. See [content freshness](/glossary/content-freshness).",
            "**Fix the sources engines cite.** Ask review sites, directories and resellers to update stale listings, and require canonicals on syndicated copies of your content.",
            "**Make the entity unambiguous.** Consistent naming, a clear About page, and Organization schema with `sameAs` links help engines tell you apart from similarly named companies.",
            "**Flag wrong answers** with each engine's feedback buttons. Vendors don't say how that feedback is used, so treat it as a supplement, not a fix.",
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Brand Accuracy Audit",
    summary:
      'A way to turn "ChatGPT says weird things about us" into a number you can track and a short list of fixes. The inputs are illustrative, for a fictional project tool called Plannora.',
    items: [
      {
        label: "Prompts in the panel",
        body: "25 buyer questions about Plannora: pricing, features, integrations and comparisons.",
        value: "25 prompts",
      },
      {
        label: "Engines and runs",
        body: "Each prompt run once in ChatGPT, Perplexity, Claude and Gemini.",
        value: "100 answers",
      },
      {
        label: "Answers that mention Plannora",
        body: "Only answers that talk about the brand can be wrong about it.",
        value: "72 answers",
      },
      {
        label: "Answers with at least one false claim",
        body: "Scored against the fact sheet: 9 quote the old $12 price, 4 invent a free plan, 3 miss the Slack integration launched in June.",
        value: "16 answers",
      },
      {
        label: "Brand error rate",
        body: "16 ÷ 72 — the share of brand mentions that carry a false claim.",
        value: "22%",
      },
    ],
    outcome:
      "The audit points at fixes, not just a score. In this example, 9 of the 16 errors trace back to one reseller's pricing page cited by two engines, so one email and a clearer official pricing page address more than half the problem. Re-run the same panel once the corrected pages have been recrawled and compare the rate.",
  },

  related: [
    "grounding",
    "knowledge-cutoff",
    "llm-training-data",
    "large-language-model",
    "entity-seo",
    "prompt-tracking",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation — so you know which prompts and engines to spot-check for wrong claims.",
  },
  tool: "schema-generator",
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "How ChatGPT searches, why it now checks official domains with site: queries, and how to track what it cites.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "The content playbook for becoming the source ChatGPT quotes, step by step.",
    },
  ],
  sources: [
    {
      title: "Why Language Models Hallucinate",
      publisher: "Kalai et al., OpenAI, 2025",
      href: "https://arxiv.org/abs/2509.04664",
    },
    {
      title: "We compared eight AI search engines. They're all bad at citing news",
      publisher: "Columbia Journalism Review, Tow Center",
      href: "https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
    {
      title: "Web fetch tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool",
    },
  ],
};
