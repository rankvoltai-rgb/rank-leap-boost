import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "grounding",
  metaTitle: "What Is Grounding in AI? How AI Answers Tie Claims to Sources",
  metaDescription:
    "Grounding ties an AI answer to sources retrieved at the moment of the question. How grounding works in Gemini, Claude and ChatGPT, and how to be the cited source.",
  keywords: [
    "grounding",
    "AI grounding",
    "what is grounding in AI",
    "grounded generation",
    "grounding with Google Search",
    "grounding vs RAG",
  ],

  whyItMatters:
    "A grounded answer has to point at a source for its claims, and the page it points at gets the citation, the link and sometimes the click. For a small team competing with bigger brands, grounding is the most level part of AI search: the citation goes to the passage that states a fact most clearly and checkably, which is something you can write this week.",

  questions: [
    {
      id: "how-grounding-works",
      question: "How does grounding work in AI search?",
      answer:
        "Grounding works by retrieving sources at the moment of the question, placing them in the model's context, and attaching each claim in the answer to the source that supports it — so every citation marks where a fact came from.",
      blocks: [
        {
          kind: "p",
          text: 'Google defines grounding as "providing content from the Google Search index to the model at prompt time to improve factuality and relevancy" ([Google\'s crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)). The [Gemini API documentation](https://ai.google.dev/gemini-api/docs/google-search) lays out the loop: the model decides whether a Google Search would improve the answer, writes one or more queries, and returns an answer whose citations each link a span of text to a source URL. Google\'s stated aim is to "reduce model hallucinations by basing responses on real-world information."',
        },
        {
          kind: "list",
          items: [
            "**Claude** always cites when it searches, and each citation carries up to 150 characters of the text it relied on, per [Anthropic's documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool).",
            "**Gemini** grounds in the Google Search index, and Google says that when it quotes a large amount of text from a page, it always links to that page. Disallowing [Google-Extended](/glossary/google-extended) opts you out of Gemini-app grounding.",
            "**Google AI Overviews** use core ranking to retrieve pages, and a Gemini model writes an answer that links to them — [retrieval-augmented generation](/glossary/retrieval-augmented-generation) under Search's quality systems.",
            "**Perplexity** shows numbered source cards above every answer, built from the passages its rerankers selected.",
          ],
        },
      ],
    },
    {
      id: "grounding-vs-rag",
      question: "Grounding vs RAG: what's the difference?",
      answer:
        "RAG is the mechanism — retrieve documents, then generate — while grounding is the result: an answer whose claims are tied to specific sources a reader can check. Most grounding in AI search is done with RAG, but retrieving a page doesn't guarantee citing it.",
      blocks: [
        {
          kind: "table",
          head: ["", "Retrieval-augmented generation", "Grounding"],
          rows: [
            [
              "**What it is**",
              "An architecture: a retriever plus a generator",
              "A property of the answer: claims tied to sources",
            ],
            [
              "**Question it answers**",
              "Where did the model get extra context?",
              "Which source supports this sentence?",
            ],
            [
              "**Visible to users as**",
              "Nothing directly",
              "Citations, source cards, inline links",
            ],
            [
              "**What you optimize**",
              "Being retrieved into the pool",
              "Being the source a claim is attached to",
            ],
          ],
        },
        {
          kind: "p",
          text: "The distinction matters when you measure. A page can be retrieved and read without being cited, because the model attaches citations only to the passages it actually relied on — usually the ones that stated the fact most directly. Retrieval puts you in the room; grounding is the moment the answer points at you and becomes an [AI citation](/glossary/ai-citation).",
        },
        {
          kind: "p",
          text: "Grounding also has a scope beyond web search. A user can ground an answer in a document they upload, and enterprise tools ground in internal files. In AI search, though, grounding sources come from the web, which is why the engine's index and crawler rules decide who can be cited at all.",
        },
      ],
    },
    {
      id: "make-content-groundable",
      question: "How do you make content easy for AI to ground on?",
      answer:
        "Make content easy to ground on by stating each important fact in one self-contained sentence that names the subject, gives the specific figure or detail, and can be checked against a source — the shape a model can attach a citation to.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**One fact, one sentence.** Claude's citations quote at most 150 characters. \"Plannora's Team plan costs $8 per user per month\" can be cited; a paragraph that builds up to the price can't be cited cleanly.",
            '**Name the subject every time.** A grounded sentence travels without its neighbors, so "It costs $8" grounds nothing.',
            "**Show where your facts come from.** Link primary sources and date your data. The original GEO study found that adding citations, quotations and statistics raised a source's visibility in generated answers by up to about 40% ([Aggarwal et al.](https://arxiv.org/abs/2311.09735)).",
            "**Be the primary source for your own facts.** Pricing, specs, policies and integrations belong on clearly titled pages on your domain. Anthropic tunes Claude's Research mode to prefer primary sources over content farms.",
            "**Keep facts in the visible text.** Facts that exist only in JSON-LD may never reach a model that reads page text, so state them in the copy as well as in [schema markup](/glossary/schema-markup).",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Models ground what they can't already say",
          text: 'Google\'s guidance contrasts commodity content, "often based on common knowledge," with content that "provides unique expert or experienced takes." A model doesn\'t need a source for what it already knows. Original data, first-hand tests and your own product facts are what it has to cite someone for — see [information gain](/glossary/information-gain).',
        },
      ],
    },
    {
      id: "check-grounding",
      question: "How do you check whether an AI answer is grounded in your page?",
      answer:
        "Check grounding by running the buyer prompt, opening each citation, and matching every claim about your brand to the passage it points at — then noting which claims rest on your pages, which on third parties, and which have no source at all.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Run the prompt in each engine** you care about, with search on, and save the answer with its citations.",
            "**Split the answer into claims** about your brand: price, features, who it's for, how it compares.",
            "**Match each claim to its citation.** Claude's citations quote the text they rely on; in Gemini and ChatGPT, open the link and find the passage.",
            "**Tag each claim** as grounded on your page, grounded on a third party, or ungrounded. Ungrounded claims about you are where [AI hallucinations](/glossary/ai-hallucination) live.",
            "**Repeat on a schedule.** Citations shift between runs — in Attrifast's 2026 study, only about half of Claude's cited domains repeated across three runs of the same prompt — so judge trends, not one screenshot. That's [prompt tracking](/glossary/prompt-tracking).",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Third-party grounding is a lead, not a loss",
          text: "When a claim about you is grounded on a review site, a directory or a competitor's comparison page, that page is where the engine goes for facts about you. Make sure it's accurate, and publish your own official page for the same fact so the next answer has a first-party source to choose.",
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Citation Slot Benchmarks",
    summary:
      "How many sources each engine grounds a typical answer on, and how stable those sources are from run to run. Use it to size the prize: an engine with few slots and low repeatability rewards being the single clearest source for a fact.",
    items: [
      {
        label: "Perplexity",
        body: "Median domains cited per answer, with 67% of citations repeating across three runs of the same prompt — the most stable of the four.",
        value: "6.4 domains",
      },
      {
        label: "Claude",
        body: "Median domains cited per answer, with 49% overlap across runs — the least stable of the four.",
        value: "3.6 domains",
      },
      {
        label: "ChatGPT",
        body: "Median domains cited per answer, with 58% overlap across runs.",
        value: "3.1 domains",
      },
      {
        label: "Gemini",
        body: "Median domains cited per answer, with 54% overlap across runs. Gemini also names brands in text far more often than it links them.",
        value: "2.4 domains",
      },
      {
        label: "Claude quote length",
        body: "The most text a Claude web-search citation quotes from your page, per Anthropic's documentation.",
        value: "150 characters",
      },
    ],
    outcome:
      "The four engine figures come from Attrifast's May 2026 study of 1,200 buyer-intent prompts, each run three times; the quote length is Anthropic's documented limit. Read together: with two to six slots per answer and a third to half of them changing between runs, measure over weeks and dozens of prompts, and write so that a single sentence can carry each fact on its own.",
  },

  related: [
    "retrieval-augmented-generation",
    "ai-citation",
    "ai-hallucination",
    "information-gain",
    "answer-first-content",
    "google-extended",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web and writes articles with sources cited inline, clear definitions and answer-first sections, so each key fact sits in a sentence an engine can attach a citation to.",
  },
  further: [
    {
      title: "Gemini SEO: the technical guide",
      href: "/ai-seo/gemini",
      description:
        "How the Gemini app grounds answers in the Google Search index, and what Google-Extended really controls.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "Mandatory citations, 150-character quotes and why Claude prefers primary sources.",
    },
  ],
  sources: [
    {
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
    },
    {
      title: "Grounding with Google Search",
      publisher: "Gemini API",
      href: "https://ai.google.dev/gemini-api/docs/google-search",
    },
    {
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
    {
      title: "View related sources in Gemini Apps",
      publisher: "Gemini Apps Help",
      href: "https://support.google.com/gemini/answer/14143489",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "How we built our multi-agent research system",
      publisher: "Anthropic Engineering",
      href: "https://www.anthropic.com/engineering/multi-agent-research-system",
    },
    {
      title: "GEO: Generative Engine Optimization",
      publisher: "Aggarwal et al., KDD 2024",
      href: "https://arxiv.org/abs/2311.09735",
    },
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
  ],
};
