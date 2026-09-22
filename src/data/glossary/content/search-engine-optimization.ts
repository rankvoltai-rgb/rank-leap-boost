import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "search-engine-optimization",
  metaTitle: "What Is SEO? Search Engine Optimization in the AI Search Era",
  metaDescription:
    "SEO is how pages get crawled, indexed and ranked by search engines, and the foundation of AI visibility. How it works, how to measure it, and what changed.",
  keywords: [
    "search engine optimization",
    "SEO",
    "what is SEO",
    "how does SEO work",
    "is SEO still worth it",
    "SEO vs GEO",
  ],

  whyItMatters:
    "For a founder without a content team, SEO is still the one acquisition channel that compounds: a page written this quarter can keep bringing in buyers for years without a media budget. It now pays twice, because ChatGPT, Gemini, Claude and Google's AI Overviews all retrieve their sources from a search index, so the pages you get indexed and ranked are the pages AI can cite. Skip it and you're missing from both places at once.",

  questions: [
    {
      id: "how-it-works",
      question: "How does search engine optimization work?",
      answer:
        "Search engine optimization works on the three stages every search engine runs — crawling, indexing and ranking — by making each page easy to fetch, easy to understand, and more useful and trusted than the alternatives for its query.",
      blocks: [
        {
          kind: "p",
          text: 'Google lays out the stages in its [guide to how Search works](https://developers.google.com/search/docs/fundamentals/how-search-works) — crawling, indexing and serving results ranked by "hundreds of factors" — and notes it "doesn\'t accept payment to crawl a site more frequently, or rank it higher." SEO is the work at each stage.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Crawling: the engine finds and fetches the page",
              body: "Crawlers follow links and sitemaps to discover URLs, then download them — if robots.txt, the server and any firewall let them in.",
              lever:
                "Link to every important page, keep an honest [XML sitemap](/glossary/xml-sitemap), and never block the search bot in [robots.txt](/glossary/robots-txt).",
            },
            {
              title: "Indexing: the page is analyzed and stored",
              body: "The engine renders the page, works out what it's about and picks a canonical version. Crawled doesn't mean indexed: thin or duplicate pages are often left out.",
              lever:
                "Serve the main content in the HTML, consolidate duplicates with a [canonical tag](/glossary/canonical-tag), and check [indexing](/glossary/indexing) in Search Console.",
            },
            {
              title: "Ranking: the best answers are ordered for each query",
              body: "Relevance to the [search intent](/glossary/search-intent), content quality, links and mentions from other sites, and page experience decide the order.",
              lever:
                "Write the most useful page for one clear question, and earn [backlinks](/glossary/backlinks) from sites in your niche.",
            },
            {
              title: "Retrieval for AI answers",
              body: "AI answer engines search the same kind of index and cite the pages they retrieve, so indexed, well-ranked pages form the candidate pool for [AI citations](/glossary/ai-citation).",
            },
          ],
        },
      ],
    },
    {
      id: "still-worth-it",
      question: "Is SEO still worth it with AI search?",
      answer:
        "SEO is still worth it because nearly every AI answer engine retrieves its sources from a search index — Google's, Bing's, Brave's or its own — so a page that can't be crawled, indexed and ranked can't be cited either.",
      blocks: [
        {
          kind: "table",
          head: ["AI engine", "Where it retrieves sources from"],
          rows: [
            [
              "Google AI Overviews and AI Mode",
              "Google's Search index, through its core ranking systems",
            ],
            ["Gemini app", "Google's Search index (Grounding with Google Search)"],
            ["ChatGPT search", "Third-party providers (Microsoft named) plus OpenAI's own index"],
            ["Claude", "Brave Search"],
            ["Perplexity", "Its own index of more than 200 billion URLs"],
          ],
        },
        {
          kind: "p",
          text: 'Google says its generative AI features "are rooted in our core Search ranking and quality systems," so "the best practices for SEO continue to be relevant." What changed is that ranking is necessary but no longer sufficient. Engines split each prompt into narrower sub-queries ([query fan-out](/glossary/query-fan-out)): Ahrefs found only **37.9%** of pages cited in AI Overviews rank top 10 for the typed query, and about **8%** of ChatGPT\'s citations rank in Google\'s or Bing\'s top 10 for the original prompt.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "The click math changed too",
          text: "Pew Research measured an 8% click rate on classic results when an AI summary appeared, against 15% without. SEO now has two jobs: rank, and be the page the summary cites. See [zero-click search](/glossary/zero-click-search).",
        },
      ],
    },
    {
      id: "seo-vs-geo-vs-aeo",
      question: "SEO vs GEO vs AEO: what's the difference?",
      answer:
        "SEO earns a ranked link on a results page, [AEO](/glossary/answer-engine-optimization) earns the single extracted answer, and [GEO](/glossary/generative-engine-optimization) earns a named citation inside an AI-written response — three goals built on the same crawlable, indexed, trustworthy pages.",
      blocks: [
        {
          kind: "table",
          head: ["", "SEO", "AEO", "GEO"],
          rows: [
            [
              "**Wins**",
              "A ranked position",
              "The one answer shown or spoken",
              "A citation or mention in a generated answer",
            ],
            [
              "**Typical surface**",
              "Blue links on a [SERP](/glossary/serp)",
              "Featured snippets, voice assistants, chatbots",
              "ChatGPT, Perplexity, Claude, AI Overviews",
            ],
            [
              "**Unit that competes**",
              "The page",
              "The passage that answers",
              "The passage, across many sub-queries",
            ],
            [
              "**Main metric**",
              "Rankings and clicks",
              "Snippet and answer ownership",
              "Citation rate and AI share of voice",
            ],
          ],
        },
        {
          kind: "p",
          text: "In practice they're layers, not rivals. GEO and AEO can't work on a page search engines never indexed, and the habits they add — answering in the first sentence, covering follow-up questions, earning mentions off-site — are good practice for classic search too. Treat SEO as the foundation and the other two as how you write and distribute on top of it.",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure SEO?",
      answer:
        "Measure SEO in Google Search Console — impressions, clicks, average position and indexing status per page and query — then follow those visits into analytics to see which pages produce signups or pipeline, not just traffic.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Indexing first:** the page indexing report and URL Inspection in [Google Search Console](/glossary/google-search-console) show whether key pages are in the index at all. Nothing else counts until they are.",
            "**Visibility:** impressions and average position by query show where you're close to page one — usually the fastest wins.",
            "**Clicks and [click-through rate](/glossary/click-through-rate):** a falling CTR at a steady position usually means an AI Overview or another feature is answering on the results page.",
            "**Business outcome:** organic sessions, signups and pipeline by landing page in your analytics.",
            "**The AI layer:** Search Console's Generative AI report, rolled out worldwide by 31 August 2026, shows impressions in AI Overviews and AI Mode by page — but no clicks. Pair it with [prompt tracking](/glossary/prompt-tracking).",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Give changes weeks, not days",
          text: 'Google\'s [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) says you "likely want to wait a few weeks" to judge whether a change helped. Compare four-week windows and annotate site changes and Google updates.',
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with SEO",
      answer:
        "The most common SEO mistakes for small teams are chasing head terms they can't win, publishing many thin pages instead of fewer useful ones, and hiding content behind JavaScript or the wrong robots.txt rule.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Go after the biggest keyword in the category.",
              reality:
                "A young site rarely wins high-[difficulty](/glossary/keyword-difficulty) head terms. Specific [long-tail](/glossary/long-tail-keywords) questions are where small teams rank first — and where AI fan-out searches too.",
            },
            {
              myth: "More pages and more keywords means more traffic.",
              reality:
                "Google treats pages made mainly to manipulate rankings as [scaled content abuse](/glossary/scaled-content-abuse), whether written by AI or by hand. A tight [topic cluster](/glossary/topic-cluster) of useful pages beats a pile of thin ones.",
            },
            {
              myth: "Keyword stuffing and a keywords meta tag still help.",
              reality:
                'Google "doesn\'t use the keywords meta tag," and keyword stuffing is against its spam policies. The original GEO research paper found stuffing did little for AI visibility either.',
            },
            {
              myth: "If it looks fine in my browser, crawlers see it too.",
              reality:
                "Google renders JavaScript, but OpenAI's, Anthropic's and Perplexity's fetchers read raw HTML. Use [server-side rendering](/glossary/server-side-rendering) for anything you want ranked and cited.",
            },
            {
              myth: "Google is the only index that matters.",
              reality:
                "ChatGPT draws on Bing and OpenAI's own index, Claude on Brave, Perplexity on its own. Verify your site in Bing Webmaster Tools and check that non-Google crawlers can read your pages.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The SEO Hard-Limits Sheet",
    summary:
      "The handful of SEO thresholds search engines actually publish — lines where crossing them means content is ignored or a page experience is rated poor. Every value comes from Google's own documentation; popular rules like ideal word counts or keyword density have no published threshold at all.",
    items: [
      {
        label: "Googlebot HTML fetch",
        value: "First 2 MB",
        body: "Googlebot fetches the first 2 MB of a URL, headers included; anything past the cut-off is not fetched, rendered or indexed. Keep the title, canonical and main content early. Source: Google Search Central Blog, March 2026.",
      },
      {
        label: "Largest Contentful Paint",
        value: "≤ 2.5 s",
        body: "Loading: the main content should render within 2.5 seconds, measured at the 75th percentile of real page loads on mobile and desktop. Source: web.dev.",
      },
      {
        label: "Interaction to Next Paint",
        value: "≤ 200 ms",
        body: "Responsiveness: the page should react to taps, clicks and key presses within 200 milliseconds, at the same 75th percentile. See [Core Web Vitals](/glossary/core-web-vitals).",
      },
      {
        label: "Cumulative Layout Shift",
        value: "≤ 0.1",
        body: "Visual stability: content shouldn't jump around as the page loads. A CLS of 0.1 or less counts as good. Source: web.dev.",
      },
      {
        label: "XML sitemap file size",
        value: "50,000 URLs / 50 MB",
        body: "Per sitemap file, uncompressed; larger sites split into several files under a sitemap index. Google uses `lastmod` only when it's consistently accurate and ignores `priority` and `changefreq`.",
      },
      {
        label: "robots.txt size and cache",
        value: "500 KiB / 24 h",
        body: "Google ignores anything past 500 KiB and generally caches the file for up to 24 hours, so a fix can take a day to apply. OpenAI and Perplexity quote about 24 hours as well.",
      },
    ],
    outcome:
      "Treat these as floors, not goals. Passing them doesn't earn rankings, but failing the fetch, sitemap or robots.txt limits means content simply isn't read, and failing Core Web Vitals marks the page experience as poor. Check the mechanical limits once per template; watch Core Web Vitals monthly in Search Console.",
  },

  related: [
    "generative-engine-optimization",
    "answer-engine-optimization",
    "indexing",
    "search-intent",
    "backlinks",
    "ai-overviews",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox maps the questions your buyers ask Google, ChatGPT and Perplexity, scores each for volume, difficulty and intent, and turns the winnable ones into articles — so a small team's SEO effort goes where it has a realistic chance.",
  },
  tool: "serp-snippet-preview",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Which index each AI engine searches, which crawler to allow, and how each one cites sources, side by side.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "Where classic SEO ends and AI Overview optimization begins, step by step.",
    },
  ],
  sources: [
    {
      title: "In-depth guide to how Google Search works",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/how-search-works",
    },
    {
      title: "Search Engine Optimization (SEO) Starter Guide",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Inside Googlebot: demystifying crawling, fetching, and the bytes we process",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/03/crawler-blog-post",
    },
    {
      title: "Web Vitals",
      publisher: "web.dev",
      href: "https://web.dev/articles/vitals",
    },
    {
      title: "Build and submit a sitemap",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    },
    {
      title: "How Google interprets the robots.txt specification",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "Google users are less likely to click on links when an AI summary appears",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
  ],
};
