import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "knowledge-graph",
  metaTitle: "What Is Google's Knowledge Graph? Knowledge Panels and AI Search",
  metaDescription:
    "Google's Knowledge Graph stores facts about entities and powers knowledge panels. How it works, how brands get in, how to check, and why it matters for AI answers.",
  keywords: [
    "Knowledge Graph",
    "Google Knowledge Graph",
    "what is the Knowledge Graph",
    "knowledge panel",
    "how to get a knowledge panel",
    "Knowledge Graph SEO",
    "Knowledge Graph AI search",
  ],

  whyItMatters:
    "When a buyer searches your brand, the Knowledge Graph is the difference between Google showing a confident panel of facts about you and a page of guesses — and Google says AI Mode draws on the same store of facts. For a small company, getting in depends less on budget than on being described consistently by sources Google trusts, which is work a founder can start this week.",

  questions: [
    {
      id: "how-it-works",
      question: "How does Google's Knowledge Graph work?",
      answer:
        "Google's Knowledge Graph stores entities — people, organizations, places, products — with their facts and relationships, compiled automatically from hundreds of web and licensed sources, and Google uses it to interpret queries, tell namesakes apart and fill knowledge panels.",
      blocks: [
        {
          kind: "p",
          text: 'Google launched it in [May 2012](https://blog.google/products/search/introducing-knowledge-graph-things-not/) with more than 500 million objects and 3.5 billion facts, under the slogan "things, not strings." By [May 2020](https://blog.google/products/search/about-knowledge-graph-and-knowledge-panels/) it held over 500 billion facts about five billion entities, drawn from "hundreds of sources from across the web," including licensed data.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Sources describe an entity",
              body: "Reference sites such as Wikipedia, official websites, licensed databases and [structured data](/glossary/schema-markup) all contribute facts.",
              lever: "State your own facts clearly on your site, with Organization markup.",
            },
            {
              title: "Google reconciles them into one entity",
              body: "Mentions of the same thing across sources are matched to a single entity with its own machine ID, and facts attach to it.",
              lever: "Use the same name, category and facts everywhere, so the sources agree.",
            },
            {
              title: "The entity powers search features",
              body: 'Knowledge panels, disambiguation between namesakes, and direct answers to factual queries. Panels are "updated automatically as information changes on the web."',
            },
            {
              title: "Google's AI draws on it",
              body: 'Google says AI Mode can "tap into fresh, real-time sources like the Knowledge Graph" alongside web content.',
            },
          ],
        },
      ],
    },
    {
      id: "vs-knowledge-panel",
      question: "Knowledge Graph vs knowledge panel: what's the difference?",
      answer:
        "The Knowledge Graph is Google's underlying database of entities and facts; a knowledge panel is the information box Google shows in results when someone searches for an entity in that database — so every panel comes from the graph, but the graph holds far more than panels show.",
      blocks: [
        {
          kind: "table",
          head: ["", "Knowledge Graph", "Knowledge panel"],
          rows: [
            [
              "**What it is**",
              "A database of entities, facts and relationships",
              "An information box in search results",
            ],
            [
              "**Who sees it**",
              "No one directly — Google's systems use it",
              "Searchers, for queries about a known entity",
            ],
            [
              "**Can you edit it?**",
              "No direct access",
              "Verified representatives can suggest changes",
            ],
            [
              "**How to check**",
              "The Knowledge Graph Search API",
              "Search your brand name on Google",
            ],
          ],
        },
        {
          kind: "p",
          text: "Google's [knowledge panel help](https://support.google.com/knowledgepanel/answer/9163198) says panel information comes from \"various sources across the web,\" from partnerships with data providers, and from verified entities who suggest edits. If you're the subject of a panel or its official representative, you can claim it through [Get verified on Google](https://support.google.com/knowledgepanel/answer/7534902), though Google notes not every panel is claimable yet. Local businesses manage their panel through Google Business Profile.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "There's no form to request a panel",
          text: "Google documents a way to claim an existing panel, not to apply for one. Panels appear when Google has enough information about an entity — which is why the work happens on your site and across the web, not in a settings page.",
        },
      ],
    },
    {
      id: "how-to-get-in",
      question: "How do you get your brand into the Knowledge Graph?",
      answer:
        "Get your brand into the Knowledge Graph by making its facts easy to verify: state them on your own site with Organization markup, keep every official profile consistent, and earn coverage from independent, reputable sources — Google documents no application, and inclusion is decided automatically.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            '**State your facts on your own site.** An About page with name, category, founders, founding date and location, plus [Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization) with your logo and `sameAs` links — which Google says helps it "disambiguate your organization in search results."',
            "**Keep official profiles identical.** The same name and description on LinkedIn, YouTube, review sites and directories — each one a source that either confirms or contradicts the others. See [entity SEO](/glossary/entity-seo).",
            "**Earn independent coverage.** Trade press, industry publications and reviews describe you in terms Google can check against your own claims. See [digital PR](/glossary/digital-pr).",
            '**Use reference sites honestly.** [Wikidata](https://www.wikidata.org/wiki/Wikidata:Notability) accepts items for entities that "can be described using serious and publicly available references." Wikipedia requires notability and strongly discourages editing articles about your own company. Neither is a shortcut if the coverage isn\'t there.',
            "**Local business?** Verify and complete your Google Business Profile, which manages the local panel.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Wikidata isn't a confirmed input",
          text: "Wikidata is widely used as a reference by knowledge graphs, but Google hasn't documented how much it relies on it. Add an item only if you meet Wikidata's notability rules; a thin, self-sourced item may simply be deleted.",
        },
      ],
    },
    {
      id: "how-to-check",
      question: "How do you check if you're in the Knowledge Graph?",
      answer:
        "Check with Google's Knowledge Graph Search API: query your brand name, and if an entity with the right type and description comes back with an ID, you're in the graph; a knowledge panel for a search of your brand is the visible confirmation.",
      blocks: [
        {
          kind: "p",
          text: 'The [Knowledge Graph Search API](https://developers.google.com/knowledge-graph) "lets you find entities in the Google Knowledge Graph." It needs a free Google Cloud API key and returns matching entities with an ID, type, description and relevance score:',
        },
        {
          kind: "code",
          lang: "bash",
          code: 'curl "https://kgsearch.googleapis.com/v1/entities:search?query=plannora&types=Organization&limit=3&key=YOUR_API_KEY"\n\n# In each result, look for:\n#   "@id": "kg:/m/..."          the entity\'s machine ID\n#   "@type": ["Organization"]   the type Google assigned\n#   "description"               Google\'s short label for it\n#   "resultScore"               how strong the match is',
        },
        {
          kind: "list",
          items: [
            "**No result** for a distinctive name usually means Google hasn't reconciled you into an entity yet. Start with the steps above.",
            "**The wrong entity** for a shared name means disambiguation is your job: pair your name with your category everywhere.",
            "**Right entity, wrong facts:** if you have a panel, claim it and suggest changes.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Fine for spot checks, not monitoring",
          text: 'Google says the API "is not suitable for use as a production-critical service" and is migrating it to Cloud Enterprise Knowledge Graph. It also returns single entities, not the relationships between them.',
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does the Knowledge Graph matter for AI search?",
      answer:
        "The Knowledge Graph matters directly for Google's AI features, since Google says AI Mode draws on it, and indirectly everywhere else, because the consistent, well-sourced facts that get a brand into the graph are the same ones other AI models learn from and retrieve.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "AI Mode uses it",
              body: 'Google: AI Mode can "tap into fresh, real-time sources like the Knowledge Graph, info about the real world, and shopping data for billions of products."',
              evidence: "official",
            },
            {
              title: "Gemini names more than it links",
              body: "When Gemini includes a brand, it names it in the text 83.7% of the time and links a source only 21.4% of the time (Semrush, June 2026).",
              evidence: "observed",
            },
            {
              title: "Entity strength behind those mentions",
              body: "Knowledge Graph strength plausibly contributes to Gemini's unlinked brand mentions, but neither Google nor any study has shown it directly.",
              evidence: "our-read",
            },
            {
              title: "Other engines use other indexes",
              body: "ChatGPT draws on Bing and OpenAI's own index, Claude on Brave Search, Perplexity on its own. Nothing suggests they query Google's graph — they learn entities from the same web sources it does.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "p",
          text: "The practical takeaway: don't chase a panel for its own sake. Chase what produces one — being described consistently by sources engines trust — and the same work shows up in [brand mentions](/glossary/brand-mentions) and [AI visibility](/glossary/ai-visibility) on every engine.",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Knowledge Panel Ladder",
    summary:
      "Five rungs that take a brand from unknown to a verified entity, in the order Google can confirm them. Climb in order: each rung gives the next one something to check against.",
    items: [
      {
        label: "Say it yourself",
        body: "One canonical description and a fact-rich About page on your own domain: name, category, founders, founding date, location. Google starts from what you state, then checks it.",
      },
      {
        label: "Mark it up",
        body: "Organization structured data with name, logo, URL, description and `sameAs` links to every official profile. The free [schema generator](/tools/schema-generator) builds it.",
      },
      {
        label: "Make every profile agree",
        body: "LinkedIn, YouTube, review sites, marketplaces and directories: identical name, category and facts. Each contradiction gives Google a reason to hesitate.",
      },
      {
        label: "Get described by others",
        body: "Independent coverage — trade press, reviews, podcasts, genuine community threads — that repeats your facts in its own words.",
      },
      {
        label: "Reference sites and verification",
        body: "A Wikidata item if you meet its notability rules, Wikipedia only once independent coverage makes you notable, and claiming your panel once it appears.",
      },
    ],
    outcome:
      "Rungs one to three are entirely in your control and fit in a week. Rung four is slow and can't be faked — and it's the one that confirms everything above it, for Google and for every model that learns from the web.",
  },

  related: [
    "entity-seo",
    "schema-markup",
    "brand-mentions",
    "ai-mode",
    "digital-pr",
    "ai-visibility",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation — a direct view of whether engines recognize you for the topics you want.",
  },
  tool: "schema-generator",
  further: [
    {
      title: "Gemini SEO: the technical guide",
      href: "/ai-seo/gemini",
      description:
        "How Gemini grounds answers in Google's index, and why it names brands more than it links them.",
    },
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description: "Eligibility, controls and citation data for Google's AI features.",
    },
  ],
  sources: [
    {
      title: "Introducing the Knowledge Graph: things, not strings",
      publisher: "Google",
      href: "https://blog.google/products/search/introducing-knowledge-graph-things-not/",
    },
    {
      title: "Google's Knowledge Graph and knowledge panels",
      publisher: "Google",
      href: "https://blog.google/products/search/about-knowledge-graph-and-knowledge-panels/",
    },
    {
      title: "About knowledge panels",
      publisher: "Knowledge Panel Help",
      href: "https://support.google.com/knowledgepanel/answer/9163198",
    },
    {
      title: "Get verified on Google",
      publisher: "Knowledge Panel Help",
      href: "https://support.google.com/knowledgepanel/answer/7534902",
    },
    {
      title: "Knowledge Graph Search API",
      publisher: "Google for Developers",
      href: "https://developers.google.com/knowledge-graph",
    },
    {
      title: "Organization structured data",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/structured-data/organization",
    },
    {
      title: "Expanding AI Overviews and introducing AI Mode",
      publisher: "Google",
      href: "https://blog.google/products/search/ai-mode-search/",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "Wikidata: Notability",
      publisher: "Wikidata",
      href: "https://www.wikidata.org/wiki/Wikidata:Notability",
    },
  ],
};
