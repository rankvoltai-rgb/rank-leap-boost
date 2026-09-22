import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "answer-engine-optimization",
  metaTitle: "What Is Answer Engine Optimization (AEO)? Definition & Guide",
  metaDescription:
    "AEO is the practice of writing content as direct, extractable answers that featured snippets, voice assistants and AI chatbots use as the answer itself.",
  keywords: [
    "answer engine optimization",
    "AEO",
    "what is AEO",
    "AEO vs GEO",
    "AEO vs SEO",
    "how to optimize for answer engines",
  ],

  whyItMatters:
    "When an answer engine returns one answer, there is no page two: either your sentence is the answer or a competitor's is. For a small team that can't outspend bigger brands on links, AEO is a lever you control completely — how clearly each section answers its own question — and it makes the page better for the people reading it too.",

  questions: [
    {
      id: "how-it-works",
      question: "How does answer engine optimization work?",
      answer:
        "Answer engine optimization works by giving each question on a page its own heading and a direct answer in the first sentence beneath it, so a system that returns one answer can lift that passage whole without rewriting it or reading the rest of the page.",
      blocks: [
        {
          kind: "p",
          text: "Answer engines don't read pages the way people do. Google's [featured snippets](/glossary/featured-snippet) lift one passage from a ranking page; AI engines split pages into chunks ([content chunking](/glossary/content-chunking)), score each chunk against the question and quote the best ones. The page doesn't win — the passage does. AEO is the writing discipline that makes passages easy to pick.",
        },
        {
          kind: "list",
          items: [
            "**A question-shaped heading** phrased the way buyers ask it: “How much does onboarding take?” rather than “Our onboarding philosophy.”",
            "**The answer in the first sentence**, naming the subject instead of opening with “It” or “This,” so it still makes sense when lifted alone. See [answer-first content](/glossary/answer-first-content).",
            "**Evidence after the answer:** the numbers, steps, sources and caveats that make it trustworthy.",
            "**Structure a parser can read:** real HTML lists for steps and tables for specs and comparisons.",
          ],
        },
        {
          kind: "p",
          text: "There is no markup shortcut. Asked how to get a featured snippet, Google's [documentation](https://developers.google.com/search/docs/appearance/featured-snippets) answers \"You can't\" — its systems decide. Structure helps a good answer get picked; it can't make a weak one worth picking.",
        },
      ],
    },
    {
      id: "aeo-vs-geo",
      question: "AEO vs GEO: what's the difference?",
      answer:
        "AEO focuses on the answer itself — writing passages clean enough to be used as the single response — while [GEO](/glossary/generative-engine-optimization) covers the whole route into AI answers, including crawler access, retrieval from each engine's index and off-site trust.",
      blocks: [
        {
          kind: "table",
          head: ["", "AEO", "GEO"],
          rows: [
            [
              "**Roots**",
              "Featured snippets and voice search",
              "Generative engines, named in a 2023 research paper",
            ],
            [
              "**Core question**",
              "Is this passage the best extractable answer?",
              "Will the engine fetch, retrieve, quote and trust this page?",
            ],
            [
              "**Main levers**",
              "Question headings, answer-first sentences, lists and tables",
              "Crawler access, indexing, fan-out coverage, brand mentions",
            ],
            [
              "**Surfaces**",
              "Featured snippets, voice assistants, AI chatbots",
              "ChatGPT, Perplexity, Claude, Gemini, AI Overviews",
            ],
          ],
        },
        {
          kind: "p",
          text: "The terms overlap so heavily that most practitioners use them interchangeably, along with [LLM SEO](/glossary/llm-seo). A useful way to hold them apart: AEO is the part of GEO that lives entirely on the page. If a page is blocked from crawlers or missing from the index, no amount of AEO will get it quoted — that's [search engine optimization](/glossary/search-engine-optimization) work.",
        },
      ],
    },
    {
      id: "how-to-write",
      question: "How do you write content for answer engines?",
      answer:
        "Write for answer engines by putting a direct, self-contained answer in the first one or two sentences of each section, keeping facts specific — a name, a number, a date — and placing the page's core answers early, where studies find most citations come from.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "44.2%",
              label: "of ChatGPT citations came from the first 30% of a page's content",
              source: {
                name: "Growth Memo via Search Engine Land, 2026",
                href: "https://searchengineland.com/chatgpt-citations-content-study-469483",
              },
            },
            {
              value: "2.7 → 5.7",
              label:
                "average ChatGPT citations as sections grow from under 50 words to over 180 words between headings",
              source: {
                name: "SE Ranking",
                href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
              },
            },
            {
              value: "150",
              label: "characters: the most of a source that each Claude web-search citation quotes",
              source: {
                name: "Anthropic docs",
                href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
              },
            },
          ],
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Lead with the answer.** One or two sentences that answer the heading on their own. Growth Memo found definitional sentences (“X is…”) about twice as likely to be cited.",
            "**Be specific.** Replace “affordable” with the price, “fast” with the time, “recently” with the date.",
            "**One question per section.** Split any section that tries to answer two.",
            "**Front-load the page.** Put the summary answer near the top, not after a long introduction.",
            "**Use honest structure.** Numbered steps for processes, HTML tables for comparisons.",
          ],
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure AEO?",
      answer:
        "Measure AEO by checking whether your passage is the answer for a fixed set of target questions — the featured snippet in Google, and the cited or quoted source in AI engines — and by noting which section of the page each engine used.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Featured snippets:** most rank trackers flag which queries show a snippet and whose page it quotes.",
            "**AI answers:** run the same questions through ChatGPT, Perplexity, Claude and Gemini and record whether your page is cited. This is [prompt tracking](/glossary/prompt-tracking).",
            "**Passage check:** when you are cited, note which section was used. Sections that never get picked are the rewrite list.",
            "**Google's AI features:** Search Console's Generative AI report shows impressions in AI Overviews and AI Mode by page.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Answers move between runs",
          text: "Attrifast's 2026 study of 14,400 prompt runs found roughly a third to a half of cited sources change when the same prompt is repeated. Judge AEO on trends across many questions, never one check.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with answer engine optimization",
      answer:
        "The most common AEO mistakes are burying the answer under an introduction, writing sections that depend on the paragraph before them, and assuming FAQ schema or special markup will get content picked.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "FAQ schema gets you into AI answers.",
              reality:
                "Google says its AI features need no special markup, and SE Ranking found pages with FAQ schema averaged 3.6 ChatGPT citations against 4.2 without. Use [schema markup](/glossary/schema-markup) for rich results, not as an AEO tactic.",
            },
            {
              myth: "Longer pages get picked more.",
              reality:
                'Google says there is "no ideal page length." Engines lift passages, so length only helps when every section still answers its own question.',
            },
            {
              myth: "AEO means short, robotic answers.",
              reality:
                "The first sentence answers; the rest of the section explains. Readers still need the reasoning, and engines still need the evidence that makes the answer trustworthy.",
            },
            {
              myth: "One FAQ page covers every question.",
              reality:
                "Thirty one-line answers give an engine little evidence to trust. Important questions deserve their own section with proof behind the answer.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Extraction Audit",
    summary:
      "A 20-minute test of how many sections on a page an answer engine could lift and use as they stand. The inputs are illustrative, for a fictional project-management tool called Plannora — run the same three checks on your own page.",
    items: [
      {
        label: "Pick a page and count its sections",
        body: "Plannora's guide “How to plan a product launch” has eight H2 sections.",
        value: "8 sections",
      },
      {
        label: "Check 1: question-shaped headings",
        body: "Is each heading phrased the way a buyer would ask? “Launch timeline template” fails; “How far ahead should you plan a launch?” passes.",
        value: "3 of 8",
      },
      {
        label: "Check 2: the first sentence answers alone",
        body: "Cover everything except each section's first sentence. Does it answer the heading without context? Five sections open with scene-setting.",
        value: "3 of 8",
      },
      {
        label: "Check 3: a specific fact in the answer",
        body: "Does the answer carry a name, number or date rather than “it depends”?",
        value: "2 of 8",
      },
      {
        label: "Extraction score",
        body: "(3 + 3 + 2) passes ÷ 24 possible checks.",
        value: "33%",
      },
    ],
    outcome:
      "Rewriting headings and opening sentences alone — no new research — takes this page to 22 of 24 (92%). The two remaining misses need a number Plannora hasn't published yet, which is a content gap, not a writing fix. Audit your ten highest-traffic pages first: they're already indexed, so they're closest to being picked.",
  },

  related: [
    "answer-first-content",
    "featured-snippet",
    "generative-engine-optimization",
    "content-chunking",
    "search-engine-optimization",
    "ai-citation",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web and writes 2,000–3,500-word articles in your brand's voice with answer-first structure, clear definitions and cited sources, so each section is written to be lifted as the answer.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "The content playbook: finding buyer questions and writing answer-first pages.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description: "Why Claude's 150-character citations reward short, self-contained facts.",
    },
  ],
  sources: [
    {
      title: "Featured snippets and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/featured-snippets",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
    {
      title: "44% of ChatGPT citations come from the first third of content: Study",
      publisher: "Search Engine Land",
      href: "https://searchengineland.com/chatgpt-citations-content-study-469483",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
    {
      title: "GEO: Generative Engine Optimization",
      publisher: "Aggarwal et al., KDD 2024",
      href: "https://arxiv.org/abs/2311.09735",
    },
  ],
};
