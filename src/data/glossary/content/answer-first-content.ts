import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "answer-first-content",
  metaTitle: "What Is Answer-First Content? How to Write Sections AI Can Quote",
  metaDescription:
    "Answer-first content puts the direct answer in each section's first sentence. Why AI engines cite it, how to write it, and a before-and-after rewrite.",
  keywords: [
    "answer-first content",
    "answer-first writing",
    "BLUF writing",
    "inverted pyramid SEO",
    "how to write for AI search",
    "what is answer-first content",
  ],

  whyItMatters:
    "Busy experts tend to open with context and save the answer for later, and both readers and AI engines move on before they reach it. Answer-first structure is the cheapest fix a small team has: it costs nothing, works on pages you've already published, and turns each section into a passage an AI engine can lift and cite on its own.",

  questions: [
    {
      id: "why-it-works",
      question: "Why does answer-first content get cited by AI?",
      answer:
        "Answer-first content gets cited because AI engines retrieve and quote passages, not whole pages: a section whose first sentence answers its heading can be lifted intact, while an answer buried in the third paragraph depends on context the engine may never read.",
      blocks: [
        {
          kind: "p",
          text: "Engines say this in their own documentation. Perplexity splits every page into “self-contained spans” that are “individually retrieved and ranked at query time.” Google's ranking systems include passage ranking, “an AI system we use to identify individual sections or ‘passages’ of a web page.” Claude's web search citations quote at most 150 characters of the source. Each one reads your page in pieces — see [content chunking](/glossary/content-chunking).",
        },
        {
          kind: "stats",
          items: [
            {
              value: "44.2%",
              label: "of ChatGPT citations came from the first 30% of a page's text",
              source: {
                name: "Growth Memo, Feb 2026",
                href: "https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention",
              },
            },
            {
              value: "~2×",
              label: "more citations for definitional “X is” sentences than for vaguer framing",
              source: {
                name: "Growth Memo, Feb 2026",
                href: "https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention",
              },
            },
            {
              value: "150",
              label: "characters: the most a Claude web search citation quotes from its source",
              source: {
                name: "Anthropic docs",
                href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "What Google says",
          text: "Google recommends pages “organized by paragraphs and sections, along with headings,” and says there's “no requirement to break your content into tiny pieces for AI.” It doesn't endorse answer-first formatting by name. The evidence for it comes from how engines retrieve passages and from citation studies, which is why it's framed here as practice rather than a Google rule.",
        },
      ],
    },
    {
      id: "how-to-write",
      question: "How do you write answer-first content?",
      answer:
        "Write answer-first content by phrasing each heading as the question a reader asks, answering it in the first sentence with the subject named and the key figure or condition included, then adding the evidence, steps and caveats underneath.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Make the heading a real question**, worded the way a buyer types it into Google or asks ChatGPT. “Pricing” becomes “How much does Plannora cost for a 10-person team?”",
            "**Answer in the first sentence, in under 60 words.** Name the subject instead of opening with “It” or “This”, and include the number, date or condition that makes the answer specific.",
            "**Make that sentence stand alone.** Read it without the heading. If it still answers the question, an engine can quote it; if it leans on the paragraph above, rewrite it.",
            "**Expand with evidence.** Follow with the reasoning, steps, a table or an example, and a source. SE Ranking found sections of 120–180 words between headings averaged 4.6 ChatGPT citations, against 2.7 for sections under 50 words.",
            "**Repeat for every section.** A summary box at the top doesn't help the sections below it, and each section is a separate candidate for citation.",
          ],
        },
        {
          kind: "p",
          text: "The same pattern serves the classic formats: a direct answer under a question-shaped heading is also what a [featured snippet](/glossary/featured-snippet) lifts, and what [answer engine optimization](/glossary/answer-engine-optimization) is built around.",
        },
      ],
    },
    {
      id: "vs-inverted-pyramid",
      question: "Answer-first content vs the inverted pyramid: what's the difference?",
      answer:
        "The inverted pyramid puts the most important information at the top of a whole article; answer-first content applies the same rule to every section, so each heading-and-answer pair works as a standalone passage wherever a search engine or AI system cuts the page.",
      blocks: [
        {
          kind: "table",
          head: ["", "Inverted pyramid", "BLUF", "Answer-first content"],
          rows: [
            [
              "**Comes from**",
              "News writing",
              "Military and business writing",
              "Web and AI search writing",
            ],
            ["**Unit**", "The article", "The memo or email", "Every section"],
            [
              "**First line holds**",
              "The most important facts",
              "The conclusion or the request",
              "The direct answer to the heading's question",
            ],
            [
              "**Built for**",
              "Readers who stop early",
              "Busy decision-makers",
              "Skimming readers and engines that extract passages",
            ],
          ],
        },
        {
          kind: "p",
          text: "Nielsen Norman Group defines the inverted pyramid as a structure where “the most important information (or what might even be considered the conclusion) is presented first,” because web readers skim and may stop at any point. Answer-first content keeps that logic and adds one assumption: the reader may be a retrieval system that sees only the section it pulled. That makes the heading the question and the first sentence the answer.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with answer-first content",
      answer:
        "The most common answer-first mistakes are opening with a pronoun or a preamble, answering a different question from the one the heading asks, and stripping out the evidence so the answer is quotable but not credible enough to be chosen.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "A TL;DR box at the top makes the page answer-first.",
              reality:
                "Engines extract sections. A summary helps readers, but every section below still needs its own first-sentence answer.",
            },
            {
              myth: "Answer-first means short, thin content.",
              reality:
                "The answer comes first; the depth follows. SE Ranking found sections under 50 words averaged fewer ChatGPT citations than 120–180-word sections, and pages over 2,900 words averaged more than pages under 800.",
            },
            {
              myth: "FAQ schema does the same job.",
              reality:
                "The structure has to be in the visible text. SE Ranking found pages with FAQ schema averaged 3.6 ChatGPT citations against 4.2 without, and Google says its AI features need no special schema.",
            },
            {
              myth: "Every sentence should be a quotable sound bite.",
              reality:
                "Only the first one. The rest should carry the reasoning, sources and specifics — the [information gain](/glossary/information-gain) that makes your answer worth citing over a rival's.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Buried-Answer Rewrite",
    summary:
      "One section rewritten answer-first, step by step. The company, prices and copy are illustrative — Plannora is a fictional project management tool — but the steps work on any section of any site.",
    items: [
      {
        label: "The heading",
        body: "“How much does Plannora cost for a 10-person team?” A question buyers ask word for word, and close to a sub-query an engine would search, such as “Plannora pricing per user”.",
        value: "1 question",
      },
      {
        label: "The original opening",
        body: "“Choosing a project management tool is a big decision, and price is only one part of the picture. Growing teams need room to scale, and hidden fees can add up. We've always believed in transparent pricing. That's why the Team plan is $10 per user.”",
        value: "36 words first",
      },
      {
        label: "Find the answer",
        body: "It's the fourth sentence, and it leans on context: “That's why” points back to a sentence an engine may never see, and “the Team plan” never says whose. Lifted alone, it names neither Plannora nor the 10-person team.",
        value: "Sentence 4",
      },
      {
        label: "Rewrite the first sentence",
        body: "“A 10-person team pays $100 a month for Plannora's Team plan ($10 per user, billed annually), and teams of up to five can use Plannora free.” Subject named, number stated, condition included — in 139 characters, short enough to be quoted whole.",
        value: "0 words first",
      },
      {
        label: "Add the evidence underneath",
        body: "Monthly versus annual price, what Team adds over Free, a link to the official pricing page and the date the prices were checked. The section lands inside the 120–180-word range SE Ranking found performs best.",
        value: "~150 words",
      },
      {
        label: "Words before the answer",
        body: "The answer moved from sentence four to sentence one, and it now survives being read with nothing around it — the test every section should pass.",
        value: "36 → 0",
      },
    ],
    outcome:
      "The rewrite added no new facts. It moved one sentence, named its subject and made it self-contained — a few minutes' work per section, and one of the cheapest changes you can make to pages you've already published.",
  },

  related: [
    "content-chunking",
    "answer-engine-optimization",
    "featured-snippet",
    "generative-engine-optimization",
    "information-gain",
    "search-intent",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web and writes 2,000–3,500-word articles in your brand voice with sources, definitions and answer-first structure, so every section opens with an answer an engine can quote.",
  },
  tool: "content-brief-generator",
  further: [
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "Writing answer-first pages and building a prompt panel to see what gets cited.",
    },
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "How Perplexity splits pages into self-contained passages and reranks them for every question.",
    },
  ],
  sources: [
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
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
      title: "The science of how AI pays attention",
      publisher: "Growth Memo (Kevin Indig)",
      href: "https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
    {
      title: "Inverted pyramid: writing for comprehension",
      publisher: "Nielsen Norman Group",
      href: "https://www.nngroup.com/articles/inverted-pyramid/",
    },
  ],
};
