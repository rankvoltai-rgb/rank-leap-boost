import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "entity-seo",
  metaTitle: "What Is Entity SEO? Help Search Engines and AI Know Your Brand",
  metaDescription:
    "Entity SEO makes search engines and AI models recognize your brand as a distinct thing tied to the right topics. How it works, schema's role, and how to audit it.",
  keywords: [
    "entity SEO",
    "entity optimization",
    "what is entity SEO",
    "entities in SEO",
    "semantic SEO",
    "brand entity",
    "entity SEO for AI search",
  ],

  whyItMatters:
    "If AI engines can't tell what your company is — or confuse it with a similarly named one — they can't recommend it, however good your content is. For a young brand with a thin web history, entity SEO is how you make that footprint unambiguous: the same name, category and facts everywhere buyers and models look. It's mostly consistency work, which suits a small team better than a budget contest.",

  questions: [
    {
      id: "what-is-an-entity",
      question: "What is an entity in SEO?",
      answer:
        "An entity in SEO is a distinct, identifiable thing — a company, person, product, place or concept — that a search engine understands through its attributes and relationships rather than the words used to name it, an idea Google summed up as “things, not strings.”",
      blocks: [
        {
          kind: "p",
          text: "Google made the shift public in [May 2012](https://blog.google/products/search/introducing-knowledge-graph-things-not/), launching its [Knowledge Graph](/glossary/knowledge-graph) with more than 500 million objects and 3.5 billion facts about them. By 2020 Google said the graph held [over 500 billion facts about five billion entities](https://blog.google/products/search/about-knowledge-graph-and-knowledge-panels/). Entities can be told apart even when they share a name: a search engine that knows which Mercury you mean — the planet, the element or the band — can answer instead of matching keywords.",
        },
        {
          kind: "p",
          text: "For a business, the entity is the brand plus its facts: its category, what it makes, who founded it, where it's based and which topics it's associated with. Entity SEO is making those facts easy to find, identical everywhere, and connected to the subjects you want to be recommended for.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Ambiguous names need extra help",
          text: "If your brand shares a name with a common word or another company, disambiguation is most of the job. Pair the name with your category everywhere — “Plannora, the project management tool for agencies” — until engines stop guessing.",
        },
      ],
    },
    {
      id: "ai-models",
      question: "How do AI models understand entities?",
      answer:
        "AI models understand entities through the text they're trained on and the pages they retrieve: a brand described consistently across many independent sources becomes a clear association a model can recall and name, while scattered or conflicting descriptions leave it vague.",
      blocks: [
        {
          kind: "p",
          text: "Most language models don't look brands up in a curated database the way Google Search uses its Knowledge Graph. What a model says about you without searching comes from its [training data](/glossary/llm-training-data); what it says when it searches comes from the pages it retrieves. Both reward the same thing: the same facts, in similar words, across sources the model trusts.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Mentions track AI visibility",
              body: "Across 75,000 brands, YouTube mentions (~0.74) and branded web mentions (0.66–0.71) correlated most with how often AI assistants mention a brand; Domain Rating correlated 0.27 in ChatGPT (Ahrefs).",
              evidence: "observed",
            },
            {
              title: "Named, not linked",
              body: "When Gemini includes a brand, it names it in the text 83.7% of the time but links a source only 21.4% of the time (Semrush). Recognition is half of Gemini visibility.",
              evidence: "observed",
            },
            {
              title: "Google's AI draws on the Knowledge Graph",
              body: 'Google says AI Mode can "tap into fresh, real-time sources like the Knowledge Graph" alongside web content.',
              evidence: "official",
            },
            {
              title: "Consistency beats volume",
              body: "A model can only repeat the description it has seen most. Three different category labels across your site, directories and reviews dilute the one association you want.",
              evidence: "our-read",
            },
          ],
        },
      ],
    },
    {
      id: "schema",
      question: "Does schema markup help entity SEO?",
      answer:
        "Schema markup helps Google disambiguate your organization and connect your official profiles through `sameAs`, but Google says no special schema is needed for its AI features, and evidence that markup earns citations in other AI engines is thin — so treat schema as a clarifier, not a shortcut.",
      blocks: [
        {
          kind: "p",
          text: "Google's [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization) documentation says the markup \"can help Google better understand your organization's administrative details and disambiguate your organization in search results.\" Its `sameAs` property lists your profiles on other sites — an explicit statement that they all describe the same entity. There are no required properties.",
        },
        {
          kind: "code",
          lang: "html",
          code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Plannora",\n  "url": "https://plannora.io",\n  "logo": "https://plannora.io/logo.png",\n  "description": "Project management software for small agencies.",\n  "foundingDate": "2023",\n  "sameAs": [\n    "https://www.linkedin.com/company/plannora",\n    "https://www.youtube.com/@plannora",\n    "https://www.g2.com/products/plannora"\n  ]\n}\n</script>',
        },
        {
          kind: "p",
          text: "What schema won't do: Google's AI guide says \"structured data isn't required for generative AI search, and there's no special schema.org markup you need to add.\" Markup that contradicts the visible page undermines trust rather than building it. See [schema markup](/glossary/schema-markup), or build a valid block with the free [schema generator](/tools/schema-generator).",
        },
      ],
    },
    {
      id: "how-to-do-it",
      question: "How do you do entity SEO?",
      answer:
        "Do entity SEO by writing one canonical description of your company, publishing it on a fact-rich About page with Organization markup, repeating the same name, category and facts on every profile you control, and earning independent sources that describe you the same way.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Write the canonical description.** One sentence: name, category, who it's for, what makes it different. Use it word for word on your homepage, About page and profiles.",
            "**Build an About page that states facts.** Founders, founding year, location, what you make, who you serve — the details that separate you from namesakes.",
            "**Align every profile you control.** LinkedIn, YouTube, review sites, app marketplaces and directories: same name, same category, same one-liner, each linked back to your site and listed in `sameAs`.",
            "**Give your people pages too.** Founders and authors are entities; bylines linked to author pages tie their expertise to your brand. See [E-E-A-T](/glossary/e-e-a-t).",
            "**Earn independent descriptions.** Reviews, press, podcasts and community threads that describe you in your category's words. See [brand mentions](/glossary/brand-mentions).",
            "**Check what engines say.** Ask ChatGPT, Perplexity and Gemini “What is [your brand]?” every quarter and compare the answer with your canonical description.",
          ],
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with entity SEO",
      answer:
        "The most common entity SEO mistakes are describing the company differently on every profile, relying on schema markup while the visible web says something else, and chasing a Wikipedia article before the brand has the independent coverage to justify one.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Schema markup makes us an entity.",
              reality:
                "Markup states facts; it can't create recognition. Google uses it to disambiguate organizations, and says no special schema is needed for its AI features.",
            },
            {
              myth: "We need a Wikipedia article first.",
              reality:
                "Wikipedia requires independent coverage for notability, [strongly discourages](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) editing articles about your own company, and requires paid editors to disclose. Earn the coverage first — it strengthens your entity whether or not an article follows.",
            },
            {
              myth: "Updating our own site is enough after a rebrand.",
              reality:
                "Old descriptions live on in directories, reviews and models' training data. Update every profile you control, and expect models to lag until they retrain or retrieve the new facts. See [knowledge cutoff](/glossary/knowledge-cutoff).",
            },
            {
              myth: "Entity SEO is only for big brands.",
              reality:
                "Small brands need it more. With few sources describing you, one inconsistent directory listing is a much larger share of what engines see.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Entity Consistency Score",
    summary:
      "A quick audit of how consistently the web describes your company: check your core facts against every profile you control or that ranks for your name, and count the matches. The inputs below are illustrative, for a fictional project management tool called Plannora.",
    items: [
      {
        label: "Core facts to check",
        body: "Name spelling, category one-liner, founding year, headquarters city, founders.",
        value: "5 facts",
      },
      {
        label: "Profiles to check",
        body: "Homepage, About page, LinkedIn, YouTube, G2, Capterra, Crunchbase, Product Hunt.",
        value: "8 profiles",
      },
      {
        label: "Total checks",
        body: "5 facts × 8 profiles — each one either matches the canonical version or doesn't.",
        value: "40",
      },
      {
        label: "Mismatches found",
        body: "The category line is the weak spot — “task manager” on two profiles, “team collaboration app” on two more — plus an old HQ city on two directories, no founding year on two, and no founders on one.",
        value: "9",
      },
      {
        label: "Entity Consistency Score",
        body: "(40 − 9) ÷ 40 — the share of checks where the web agrees with you.",
        value: "78%",
      },
    ],
    outcome:
      "Fixing the nine mismatches is an afternoon of profile edits and takes the score to 100%. Start with the category line: it's the phrase that ties the brand to the questions buyers ask, so it should read the same everywhere. Re-run the check after every rebrand, pricing change or move.",
  },

  related: [
    "knowledge-graph",
    "brand-mentions",
    "schema-markup",
    "e-e-a-t",
    "llm-training-data",
    "digital-pr",
  ],
  product: {
    feature: "brand-voice",
    pitch:
      "Rankbox's Brand Voice learns your tone, audience and product once, so every article it writes describes your company the same way — the consistent, repeated description that entity recognition depends on.",
  },
  tool: "get-recommended-by-chatgpt",
  further: [
    {
      title: "Gemini SEO: the technical guide",
      href: "/ai-seo/gemini",
      description:
        "Why Gemini names brands far more often than it links them, and what that means for entities.",
    },
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "How Perplexity retrieves passages, and the checklist for making your brand unambiguous.",
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
      title: "Organization structured data",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/structured-data/organization",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Expanding AI Overviews and introducing AI Mode",
      publisher: "Google",
      href: "https://blog.google/products/search/ai-mode-search/",
    },
    {
      title:
        "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews (75K brands studied)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "Wikipedia: Conflict of interest",
      publisher: "Wikipedia",
      href: "https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest",
    },
  ],
};
