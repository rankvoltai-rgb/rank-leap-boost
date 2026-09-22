import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "schema-markup",
  metaTitle: "What Is Schema Markup? Structured Data for Google and AI Search",
  metaDescription:
    "Schema markup labels page content with JSON-LD so search engines can read it. What it still earns in Google, what it does for AI citations, and what to add.",
  keywords: [
    "schema markup",
    "structured data",
    "JSON-LD",
    "what is schema markup",
    "does schema markup help AI search",
    "schema markup for SEO",
    "schema.org",
  ],

  whyItMatters:
    "Schema markup is the most over-promised fix in AI search: it's cheap to add, easy to sell, and the largest test so far found it barely moved AI citations. For a small team the useful version is short — a few accurate types that earn rich results and make your brand unambiguous — which leaves the rest of your week for the visible content engines actually quote.",

  questions: [
    {
      id: "how-it-works",
      question: "How does schema markup work?",
      answer:
        'Schema markup works by adding a block of machine-readable data, usually JSON-LD inside a `<script type="application/ld+json">` tag, that names each thing on a page with Schema.org types and properties — an Article with an author and dates, a Product with a price — so a parser doesn\'t have to infer it from the prose.',
      blocks: [
        {
          kind: "p",
          text: 'Schema.org is a shared vocabulary founded by Google, Microsoft, Yahoo and Yandex. JSON-LD is the format Google recommends, because it sits apart from the visible HTML and is easy to maintain. Google says it uses structured data "to understand the content of the page" and, for supported types, to show rich results such as prices, ratings and event dates in the listing.',
        },
        {
          kind: "code",
          lang: "html",
          code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "How to plan a product launch with a five-person team",\n  "datePublished": "2026-09-01",\n  "dateModified": "2026-09-18",\n  "author": {\n    "@type": "Person",\n    "name": "Jordan Lee",\n    "url": "https://plannora.io/team/jordan-lee"\n  },\n  "publisher": {\n    "@type": "Organization",\n    "name": "Plannora",\n    "url": "https://plannora.io",\n    "logo": "https://plannora.io/logo.png",\n    "sameAs": [\n      "https://www.linkedin.com/company/plannora",\n      "https://www.youtube.com/@plannora"\n    ]\n  }\n}\n</script>',
        },
        {
          kind: "p",
          text: 'Two rules from Google\'s guidelines matter more than which types you pick. Mark up only what readers can see: "don\'t add structured data about information that is not visible to the user, even if the information is accurate." And supply "fewer but complete and accurate" properties rather than every optional one. Validate with the [Rich Results Test](https://search.google.com/test/rich-results) for Google features and the [Schema Markup Validator](https://validator.schema.org/) for the rest.',
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does schema markup help with AI search?",
      answer:
        "Schema markup has no confirmed effect on AI citations: Google says AI Overviews and AI Mode need no special schema, and a 2026 Ahrefs test of 1,885 pages found that adding JSON-LD produced no meaningful lift in ChatGPT, AI Mode or AI Overviews citations.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "+2.2%",
              label:
                "change in ChatGPT citations after 1,885 already-cited pages added JSON-LD — statistically indistinguishable from zero",
              source: {
                name: "Ahrefs, May 2026",
                href: "https://ahrefs.com/blog/schema-ai-citations/",
              },
            },
            {
              value: "−4.6%",
              label:
                "change in Google AI Overview citations for the same pages, measured against 4,000 control pages",
              source: {
                name: "Ahrefs, May 2026",
                href: "https://ahrefs.com/blog/schema-ai-citations/",
              },
            },
            {
              value: "3.6 vs 4.2",
              label: "average ChatGPT citations for pages with FAQ schema versus pages without it",
              source: {
                name: "SE Ranking",
                href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
              },
            },
          ],
        },
        {
          kind: "signals",
          items: [
            {
              title: "Google: not required for AI features",
              body: "Google's AI optimization guide: \"Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add.\" It still recommends schema for rich results.",
              evidence: "official",
            },
            {
              title: "Microsoft: it helps its LLMs understand pages",
              body: "At SMX Munich in March 2025, Bing's Fabrice Canel was reported as saying schema markup helps Microsoft's LLMs understand content. No effect on Copilot citations has been published.",
              evidence: "official",
            },
            {
              title: "Text-only fetchers may never see it",
              body: "Anthropic's web fetch returns page text, so a fact that exists only in JSON-LD may never reach Claude. State every marked-up fact in the visible copy as well.",
              evidence: "our-read",
            },
            {
              title: "The test covered pages already being cited",
              body: "Every page in the Ahrefs sample had 100+ AI Overview citations before adding schema, so the finding applies to pages already in the consideration set — not to pages engines haven't picked up yet.",
              evidence: "observed",
            },
          ],
        },
      ],
    },
    {
      id: "rich-results",
      question: "What does schema markup still get you in Google?",
      answer:
        "Schema markup still makes pages eligible for Google rich results — product prices and ratings, review stars, recipes, events, videos and job postings — which can lift clicks on classic listings, but several once-popular types no longer show, including FAQ rich results since May 2026.",
      blocks: [
        {
          kind: "table",
          head: ["Type", "Status in Google Search, September 2026", "Worth adding for"],
          rows: [
            [
              "`Organization`",
              "Supported — logo, legal name and identifiers can appear in knowledge panels",
              "Every site, on the homepage",
            ],
            [
              "`Article` / `BlogPosting`",
              "Supported — helps Google show the right title, image and dates",
              "Every blog post",
            ],
            [
              "`Product`, `SoftwareApplication`",
              "Supported — price, availability, ratings",
              "What you sell",
            ],
            [
              "`LocalBusiness`",
              "Supported — address, hours, contact details",
              "Businesses serving an area",
            ],
            ["`FAQPage`", "No longer shown since 7 May 2026", "Nothing in Google"],
            ["`HowTo`", "Deprecated in September 2023", "Nothing in Google"],
            [
              "Claim Review, Course Info, Estimated Salary and four others",
              "Phased out from June 2025",
              "Nothing in Google",
            ],
          ],
        },
        {
          kind: "p",
          text: "Google's own case studies report click-through gains from rich results — Rotten Tomatoes measured a 25% higher click-through rate on marked-up pages — though those figures come from the sites themselves. Treat rich results as a way to stand out in classic listings on the [SERP](/glossary/serp), not as a route into AI answers.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Retired markup does no harm",
          text: "When Google cut FAQ and How-to results back in 2023 it said unused structured data \"does not cause problems for Search, but also has no visible effects.\" There's no need to rip out old FAQPage markup — just don't add more expecting a result.",
        },
      ],
    },
    {
      id: "which-types",
      question: "Which schema markup types matter most for a small business site?",
      answer:
        "Most small business sites need only four schema types: `Organization` on the homepage, `Article` or `BlogPosting` on posts, `Product` or `SoftwareApplication` on what you sell, and `LocalBusiness` if you serve an area. Everything else can wait until Google documents a rich result you actually want.",
      blocks: [
        {
          kind: "list",
          items: [
            "**`Organization`** — name, URL, logo and `sameAs` links to your LinkedIn, YouTube, Crunchbase or Wikipedia pages. It's the cheapest [entity SEO](/glossary/entity-seo) signal you control, and it helps systems like Google's [Knowledge Graph](/glossary/knowledge-graph) tell your brand from a similarly named one.",
            "**`Article` / `BlogPosting`** — headline, an author linked to a real author page, `datePublished` and an honest `dateModified`. AI engines weigh dates — Perplexity stores publish and update dates per page, and Claude sees each result's age — so keep the markup, the visible date and your sitemap's `lastmod` in agreement.",
            "**`Product` or `SoftwareApplication`** — price, currency, availability and genuine ratings, identical to what the page shows.",
            "**`LocalBusiness`** — address, hours and phone number, consistent with your Google Business Profile.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Generate it, then validate it",
          text: "The free [schema generator](/tools/schema-generator) outputs ready-to-paste JSON-LD for Organization, Article and Product pages. Put it in the server-rendered HTML, then run the page through the Rich Results Test before you ship.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with schema markup",
      answer:
        "The most common schema markup mistakes are marking up facts the page doesn't show, letting prices and dates drift out of sync with the copy, injecting JSON-LD with JavaScript that AI crawlers never run, and treating markup as a substitute for clear visible content.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "FAQ schema is the shortcut into AI answers.",
              reality:
                "FAQ rich results stopped showing in Google on 7 May 2026, and SE Ranking found pages with FAQ schema averaged fewer ChatGPT citations than pages without. Write the questions as visible headings with [answer-first](/glossary/answer-first-content) text instead.",
            },
            {
              myth: "Markup can describe things the page doesn't show.",
              reality:
                "Google's guidelines say not to mark up information that isn't visible, and its AI features guide asks that structured data match the visible text. Mismatches undermine trust in both.",
            },
            {
              myth: "JSON-LD from a tag manager works everywhere.",
              reality:
                "Google can read JSON-LD injected by JavaScript. Crawlers that don't run scripts — OpenAI's, Anthropic's, Perplexity's — can't. Put it in the HTML; see [server-side rendering](/glossary/server-side-rendering).",
            },
            {
              myth: "More types and properties are always better.",
              reality:
                "Google says it's more important to supply fewer, complete and accurate properties than every possible one. Markup nobody maintains drifts out of date.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Three-Job Schema Test",
    summary:
      "Before adding or keeping any schema type, ask which of three jobs it does. Markup that does none of them is maintenance with no return, and markup that contradicts the page is a liability.",
    items: [
      {
        label: "Job 1: it earns a rich result Google still shows",
        body: "Check the type against Google's current search gallery, not an old blog post. Product, Review snippet, Recipe, Event, Video, Local business and Software app qualify; FAQPage and HowTo no longer do.",
      },
      {
        label: "Job 2: it makes an entity unambiguous",
        body: "`Organization` and `Person` with `sameAs` links tie your brand and authors to profiles engines already know. Microsoft has said schema helps its LLMs understand content; no engine has confirmed an effect on citations.",
      },
      {
        label: "Job 3: it mirrors the visible text exactly",
        body: "Every value in the JSON-LD — price, date, author, rating — appears on the page in the same form. Engines that read only text never see the markup, so the visible copy has to carry each fact on its own.",
      },
    ],
    outcome:
      "Keep a type only if it passes Job 3 and at least one of Jobs 1 and 2. For most small sites that leaves Organization, Article and Product — an afternoon of work — and frees the rest of the week for the visible content AI engines actually quote.",
  },

  related: [
    "entity-seo",
    "knowledge-graph",
    "server-side-rendering",
    "llms-txt",
    "ai-overviews",
    "serp",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "AI engines quote what's on the page, not what's in the markup. Rankbox researches the live web and writes articles that state their facts in the visible copy — clear definitions, cited sources and answer-first sections — so they hold up whether or not a crawler reads your JSON-LD.",
  },
  tool: "schema-generator",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Why Google says there's no special schema for its AI features, and what the eligibility bar really is.",
    },
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "What the correlation studies show about schema, llms.txt and ChatGPT citations.",
    },
  ],
  sources: [
    {
      title: "Introduction to structured data markup in Google Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Latest documentation updates (FAQ rich result deprecation)",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/updates",
    },
    {
      title: "Changes to HowTo and FAQ rich results",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2023/08/howto-faq-changes",
    },
    {
      title: "Schema.org",
      publisher: "Schema.org",
      href: "https://schema.org/",
    },
    {
      title: "We tracked 1,885 pages adding schema. AI citations barely moved.",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/schema-ai-citations/",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
    {
      title: "Schema helps Microsoft's LLMs (Copilot) understand your content",
      publisher: "Search Engine Roundtable",
      href: "https://www.seroundtable.com/schema-llms-copilot-bing-microsoft-39093.html",
    },
  ],
};
