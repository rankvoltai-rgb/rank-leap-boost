import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "programmatic-seo",
  metaTitle: "What Is Programmatic SEO? When Template Pages Work and Fail",
  metaDescription:
    "Programmatic SEO builds many pages from a template and a dataset. When it works, when it becomes scaled content abuse, and how AI engines treat template pages.",
  keywords: [
    "programmatic SEO",
    "pSEO",
    "what is programmatic SEO",
    "programmatic SEO examples",
    "is programmatic SEO spam",
    "programmatic SEO for AI search",
  ],

  whyItMatters:
    "Programmatic SEO is tempting for a small team because it promises hundreds of pages for the effort of one template. It pays off when you hold data buyers actually want — integrations, locations, specs, prices — and backfires when the template does the talking, because Google treats pages made mainly to rank as spam and AI engines collapse near-identical pages into one. The first question isn't how many pages you can generate but how many you can make genuinely different.",

  questions: [
    {
      id: "how-it-works",
      question: "How does programmatic SEO work?",
      answer:
        "Programmatic SEO works by pairing a page template with a structured dataset, so each row — an integration, a city, a currency pair — becomes its own URL aimed at one long-tail query, such as “Plannora Slack integration” or “coworking spaces in Lisbon.”",
      blocks: [
        {
          kind: "pipeline",
          steps: [
            {
              title: "Find a repeatable query pattern",
              body: "A head term plus a modifier with many values: “[tool] integration”, “[service] in [city]”, “[X] vs [Y]”, “convert [A] to [B]”. Each value has small demand; together they add up.",
              lever:
                "Confirm people really search the pattern. [Long-tail keywords](/glossary/long-tail-keywords) nobody types are just crawl load.",
            },
            {
              title: "Build or license the dataset",
              body: "One row per page, with the fields a buyer needs: what syncs, prices, opening hours, specs, reviews, availability.",
              lever:
                "The dataset is the product. If you can't name three facts per row that competitors don't show, stop here.",
            },
            {
              title: "Design the template",
              body: "Fixed layout, variable data. The template decides how the facts are presented; it can't supply them.",
            },
            {
              title: "Publish, link and prune",
              body: "Generate the pages, link them from a browsable hub, and remove rows that never earn impressions.",
              lever:
                "Link from category hubs, not just an [XML sitemap](/glossary/xml-sitemap), so readers and crawlers can reach every page through [internal links](/glossary/internal-linking).",
            },
          ],
        },
        {
          kind: "p",
          text: 'Automation itself isn\'t the problem. Google points out that "automation has long been used to generate helpful content, such as sports scores, weather forecasts, and transcripts," and its [snippet documentation](https://developers.google.com/search/docs/appearance/snippet) says programmatic meta descriptions "can be appropriate and are encouraged" on large database-driven sites.',
        },
      ],
    },
    {
      id: "is-it-spam",
      question: "Is programmatic SEO against Google's guidelines?",
      answer:
        "Programmatic SEO is not against Google's guidelines in itself, but it becomes spam when pages exist mainly to rank: Google's policies name scaled content abuse, many pages made without adding value for users, and doorway abuse, pages built for similar queries that funnel people elsewhere.",
      blocks: [
        {
          kind: "table",
          head: ["Legitimate programmatic page", "Doorway or scaled content abuse"],
          rows: [
            [
              "Each page shows data unique to its row: prices, specs, setup steps, reviews",
              "Pages differ only by the keyword swapped into the template",
            ],
            [
              "A visitor landing directly gets what they came for",
              "The page funnels visitors on to the page that has the real content",
            ],
            [
              "Pages sit in a browsable hierarchy: hub, category, item",
              'Pages are "closer to search results than a clearly defined, browseable hierarchy"',
            ],
            [
              "Location pages describe a real presence or service in that place",
              '"Pages targeted at specific regions or cities that funnel users to one page"',
            ],
            [
              "Rows without enough data never become pages",
              "Every row becomes a page because the template allows it",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Google\'s [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) define scaled content abuse as pages "generated for the primary purpose of manipulating search rankings and not helping users," and apply it "no matter how it\'s created." Google detects violations "through automated systems and, as needed, human review," and violating sites "may rank lower in results or not appear in results at all." See [scaled content abuse](/glossary/scaled-content-abuse).',
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does programmatic SEO work for AI search?",
      answer:
        "Programmatic SEO works for AI search only when each page holds a fact an engine can't find elsewhere. Near-identical template pages tend to be grouped and cited once or not at all, while a page with unique, specific data can answer a fan-out sub-query outright.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Near-duplicates collapse into one",
              body: 'Microsoft\'s Bing team says LLMs "group near-duplicate URLs into a single cluster and then choose one page to represent the set," and counts localized pages that are "nearly identical" as duplicates.',
              evidence: "official",
            },
            {
              title: "Per-variant pages can be spam",
              body: 'Google\'s AI optimization guide says separate content for every variation of a search, fan-out queries included, made "primarily to manipulate rankings or generative AI responses" breaches its scaled content abuse policy — and that "a high quantity of pages doesn\'t make a website higher quality."',
              evidence: "official",
            },
            {
              title: "Engines are tuned against content farms",
              body: 'Anthropic reports that its early research agents "consistently chose SEO-optimized content farms" over authoritative sources, and it added source-quality heuristics to correct that.',
              evidence: "official",
            },
            {
              title: "Specific facts match specific sub-queries",
              body: "Since August 2026 most ChatGPT fan-outs run `site:` searches of specific domains ([Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)), and cited pages' titles closely match the sub-query ([Ahrefs](https://ahrefs.com/blog/why-chatgpt-cites-pages/)). A real integration or pricing page with its own data is what those searches find.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Test one page before you generate hundreds",
          text: "Build your strongest row by hand, get it indexed, then ask the questions it should answer in ChatGPT and Perplexity. If a hand-built page with your best data isn't worth citing, a thousand thinner copies won't be. See [query fan-out](/glossary/query-fan-out).",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with programmatic SEO",
      answer:
        "The most common programmatic SEO mistakes are publishing every row of a dataset whether or not it has data worth a page, letting template boilerplate outweigh the unique content, and leaving thousands of pages unmaintained after launch.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "More pages means more traffic.",
              reality:
                "Google's own words: \"a high quantity of pages doesn't make a website higher quality or more relevant to users.\" Thin rows add crawl load and risk, not reach. See [crawl budget](/glossary/crawl-budget).",
            },
            {
              myth: "Rewording the template text makes each page unique.",
              reality:
                "Google's scaled content abuse examples name \"automated transformations like synonymizing, translating, or other obfuscation techniques.\" Unique data makes a page unique; reworded boilerplate doesn't.",
            },
            {
              myth: "AI can fill in rows where the dataset is empty.",
              reality:
                'Generating filler for rows with no real data is the pattern the policy describes: generative AI used "to generate many pages without adding value for users."',
            },
            {
              myth: "Programmatic pages look after themselves once they're live.",
              reality:
                "Prices, integrations and opening hours change. A stale page is a wrong answer an AI engine may repeat, so budget for updates or publish fewer pages. See [content decay](/glossary/content-decay).",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Row-Worthiness Funnel",
    summary:
      "A way to decide how many programmatic pages you should actually publish: start from every row the template could generate, then cut each row that fails a reality, demand or unique-data check. The figures are illustrative, for a fictional project-management tool called Plannora planning integration pages.",
    items: [
      {
        label: "Rows the template could generate",
        body: "Every app in a public directory of 400 SaaS tools, one “Plannora + [app]” page each.",
        value: "400",
      },
      {
        label: "Rows with a real integration",
        body: "Native or documented API integrations Plannora actually supports. A page for an integration that doesn't exist is a doorway.",
        value: "140",
      },
      {
        label: "Rows with demand",
        body: "Integrations with measurable search demand, or that come up when buyers ask AI assistants about Plannora.",
        value: "90",
      },
      {
        label: "Rows with enough unique data",
        body: "At least three page-specific facts: what syncs and in which direction, triggers and actions, setup steps, plan limits. The rest would share boilerplate.",
        value: "55",
      },
      {
        label: "Pages worth publishing",
        body: "55 of the 400 candidate rows pass every check. The 35 with demand but thin data are listed together on one integrations hub page.",
        value: "55 (14%)",
      },
    ],
    outcome:
      "Plannora publishes 55 integration pages instead of 400, each with facts a buyer or an AI engine can use, plus one hub that covers the rest. The cut isn't a loss: the other 345 pages would have been the same template with a different logo, the pattern Google's scaled content and doorway policies describe.",
  },

  related: [
    "scaled-content-abuse",
    "long-tail-keywords",
    "information-gain",
    "canonical-tag",
    "query-fan-out",
    "crawl-budget",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox's Answer-Space Research maps the questions buyers ask ChatGPT, Perplexity and Google and scores each for volume, difficulty and intent — the demand check that tells you which long-tail questions deserve a page before you build it.",
  },
  tool: "ai-question-generator",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Why Google tells site owners to build depth as clusters rather than pages for every fan-out variant.",
    },
  ],
  sources: [
    {
      title: "Spam policies for Google web search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/essentials/spam-policies",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Google Search's guidance about AI-generated content",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content",
    },
    {
      title: "How to write meta descriptions",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/snippet",
    },
    {
      title: "Does duplicate content hurt SEO and AI search visibility?",
      publisher: "Microsoft Bing Webmaster Blog",
      href: "https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility",
    },
    {
      title: "How we built our multi-agent research system",
      publisher: "Anthropic",
      href: "https://www.anthropic.com/engineering/multi-agent-research-system",
    },
  ],
};
