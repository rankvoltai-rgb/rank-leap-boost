import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "xml-sitemap",
  metaTitle: "What Is an XML Sitemap? Rules, Limits and What AI Search Uses",
  metaDescription:
    "An XML sitemap lists your canonical URLs so engines can find and recrawl them. The 50,000-URL limit, why lastmod matters, and what AI crawlers do with it.",
  keywords: [
    "XML sitemap",
    "sitemap.xml",
    "what is an XML sitemap",
    "sitemap lastmod",
    "do I need a sitemap",
    "sitemap for AI search",
    "sitemap index",
  ],

  whyItMatters:
    "A new site with few backlinks is exactly the case where search engines won't find every page by following links, and a sitemap is how you hand them the list. It takes an afternoon at most — many CMSs generate one automatically — and its `lastmod` dates are now one of the main signals Bing uses to decide what to recrawl for its AI-powered answers.",

  questions: [
    {
      id: "what-it-contains",
      question: "What goes in an XML sitemap?",
      answer:
        "An XML sitemap should list every canonical, indexable URL you want in search — each in a `<loc>` tag, with an optional `<lastmod>` date of its last significant change — and nothing else: no redirects, no `noindex` pages and no parameter duplicates.",
      blocks: [
        {
          kind: "code",
          lang: "xml",
          code: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://www.example.com/pricing</loc>\n    <lastmod>2026-09-18T09:30:00+00:00</lastmod>\n  </url>\n  <url>\n    <loc>https://www.example.com/blog/launch-checklist</loc>\n    <lastmod>2026-09-02T14:05:00+00:00</lastmod>\n  </url>\n</urlset>',
        },
        {
          kind: "list",
          items: [
            '**Absolute, canonical URLs.** Google crawls URLs "exactly as listed" and treats sitemap inclusion as a weak canonical signal, so list the version your [canonical tag](/glossary/canonical-tag) points to.',
            "**`lastmod` only when it's true.** Google uses it only when it's \"consistently and verifiably\" accurate, and means the last significant change — main text, structured data or links, not a footer tweak.",
            "**Skip `priority` and `changefreq`.** Google and Bing both say they ignore them.",
            "**Point engines to it** with a `Sitemap:` line in [robots.txt](/glossary/robots-txt), and submit it in Google Search Console and Bing Webmaster Tools.",
          ],
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Any crawler that reads robots.txt can find the sitemap here\nSitemap: https://www.example.com/sitemap.xml",
        },
      ],
    },
    {
      id: "limits",
      question: "How big can an XML sitemap be?",
      answer:
        "An XML sitemap can hold up to 50,000 URLs or 50 MB uncompressed, whichever comes first; larger sites split their URLs across several files and list them in a sitemap index, which can reference up to 50,000 child sitemaps.",
      blocks: [
        {
          kind: "code",
          lang: "xml",
          code: '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>https://www.example.com/sitemap-pages.xml</loc>\n    <lastmod>2026-09-18T09:30:00+00:00</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>https://www.example.com/sitemap-blog.xml</loc>\n    <lastmod>2026-09-20T07:00:00+00:00</lastmod>\n  </sitemap>\n</sitemapindex>',
        },
        {
          kind: "p",
          text: "Splitting by section — pages, blog, docs, products — pays off even below the limits. Search Console's Page indexing report can be filtered by submitted sitemap, so a blog sitemap with half its URLs unindexed points you straight at the problem.",
        },
        {
          kind: "p",
          text: "Placement matters too: a sitemap only covers URLs under its own directory, which is why Google recommends putting it at the site root. Bing's 2025 guidance adds that one index can reference 50,000 child sitemaps, enough for 2.5 billion URLs — a ceiling no small site will meet.",
        },
      ],
    },
    {
      id: "do-you-need",
      question: "Do you need an XML sitemap?",
      answer:
        "Google says a well-linked site of about 500 pages or fewer may not need an XML sitemap, but new sites with few external links, large sites and media-heavy sites benefit — and because a sitemap costs almost nothing, most sites should keep one anyway.",
      blocks: [
        {
          kind: "table",
          head: ["Your site", "Sitemap?", "Why"],
          rows: [
            [
              "New, with few backlinks",
              "Yes",
              "Crawlers discover pages through links from pages they already know, and you have few of those",
            ],
            [
              "Large, or with pages that are hard to reach by links",
              "Yes",
              "Size is the first reason Google gives",
            ],
            ["Heavy on video, images or news", "Yes", "Media and news sitemaps carry extra detail"],
            [
              "About 500 pages or fewer, fully linked",
              "Optional for Google",
              "Still useful: Bing relies on `lastmod` to prioritize recrawls",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "A sitemap is a hint, not a guarantee",
          text: "Google says a sitemap \"doesn't guarantee that all the items in your sitemap will be crawled and indexed.\" Listing a thin or duplicate page doesn't earn it a place in the index — see [indexing](/glossary/indexing).",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Do AI search engines use XML sitemaps?",
      answer:
        "Among AI search engines, Bing is the most explicit about XML sitemaps: it calls `lastmod` a key signal for deciding what to recrawl for AI-powered search. Google uses sitemaps for the index behind AI Overviews and Gemini, while OpenAI, Anthropic and Perplexity haven't said whether their crawlers read them.",
      blocks: [
        {
          kind: "requirements",
          items: [
            {
              label: "Bing — Copilot, and ChatGPT's Bing path",
              status: "helps",
              note: 'Bing\'s July 2025 guidance: "The lastmod field in your sitemap remains a key signal," helping it prioritize URLs for recrawling — or skip them when nothing changed. It asks for full date-and-time values.',
            },
            {
              label: "Google — AI Overviews, AI Mode, Gemini",
              status: "helps",
              note: "Sitemaps aid discovery and recrawl scheduling for the Search index all three draw on. Google trusts `lastmod` once it proves accurate.",
            },
            {
              label: "OpenAI — OAI-SearchBot",
              status: "unconfirmed",
              note: "OpenAI doesn't say whether its search crawler reads sitemaps.",
            },
            {
              label: "Anthropic and Brave — Claude",
              status: "unconfirmed",
              note: "Not documented. Brave discovers pages through its crawler and browser users' visits, so ranking on Google and Bing feeds it indirectly.",
            },
            {
              label: "Perplexity",
              status: "unconfirmed",
              note: "Not documented; its crawler schedules revisits by predicted importance and update frequency. A sitemap referenced from robots.txt costs nothing.",
            },
          ],
        },
        {
          kind: "p",
          text: "The upshot: one honest sitemap serves every engine that reads it and harms none that don't. For Bing, pair it with [IndexNow](/glossary/indexnow) — Microsoft describes the two as complements, sitemaps for full coverage and pings for URL-level changes. Honest dates matter beyond Bing too: AI answers lean on [content freshness](/glossary/content-freshness), and a `lastmod` that matches the visible updated date keeps your signals consistent.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with XML sitemaps",
      answer:
        "The most common XML sitemap mistakes are listing URLs that redirect, return 404 or carry `noindex`, stamping every `lastmod` with today's date, and forgetting the file after a migration so it keeps advertising old URLs.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Setting every lastmod to today makes the site look fresh.",
              reality:
                "Google: if a page \"changed 7 years ago, but you're telling us in the lastmod element that it changed yesterday, eventually we're not going to believe you anymore.\" Update `lastmod` only on significant changes.",
            },
            {
              myth: "Pinging Google's sitemap endpoint speeds up indexing.",
              reality:
                "Google retired the sitemaps ping endpoint in 2023, and requests to it now return a 404. Submit through Search Console or the `Sitemap:` line in robots.txt.",
            },
            {
              myth: "More URLs in the sitemap means more pages indexed.",
              reality:
                "Sitemaps suggest; they don't guarantee. Listing filters, tag pages and duplicates points crawlers at URLs you don't want — see [crawl budget](/glossary/crawl-budget).",
            },
            {
              myth: "A priority of 1.0 tells engines what matters most.",
              reality:
                "Google and Bing ignore `priority` and `changefreq`. Internal links and accurate `lastmod` values do that job.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Sitemap Spec Sheet",
    summary:
      "The published limits and rules that decide whether engines can use your sitemap, drawn from Google's and Bing's documentation and the sitemaps.org protocol. Check each sitemap against every row.",
    items: [
      {
        label: "URLs per sitemap file",
        body: "The cap in the sitemaps.org protocol, applied by Google and Bing. Split larger sets and list the files in a sitemap index.",
        value: "50,000",
      },
      {
        label: "File size",
        body: "Google's limit, measured uncompressed.",
        value: "50 MB",
      },
      {
        label: "Child sitemaps per index file",
        body: "The ceiling in the sitemaps.org protocol and Bing's documentation.",
        value: "50,000",
      },
      {
        label: "lastmod format",
        body: "W3C Datetime, a profile of ISO 8601. Bing asks for the date and time with a time zone, such as `2026-09-18T09:30:00+00:00`.",
        value: "ISO 8601",
      },
      {
        label: "priority and changefreq",
        body: "Ignored by both Google and Bing. Leaving them out changes nothing.",
        value: "Ignored",
      },
      {
        label: "Small-site threshold",
        body: "Below roughly this size, with thorough internal linking, Google says you might not need a sitemap at all.",
        value: "~500 pages",
      },
    ],
    outcome:
      "Read it as pass or fail per row. The size limits rarely bite a small site; the rows that do are the last three — honest `lastmod` values in the right format, no reliance on `priority`, and keeping a sitemap even where Google calls it optional, because Bing leans on it to schedule recrawls.",
  },

  related: [
    "indexnow",
    "indexing",
    "crawl-budget",
    "canonical-tag",
    "robots-txt",
    "google-search-console",
  ],
  product: {
    feature: "auto-publishing",
    pitch:
      "A sitemap's `lastmod` is only worth reading if pages actually change. Rankbox publishes a new optimized article every day as a native post on WordPress, Webflow, Shopify, Wix or Framer, or to any other stack through the Rankbox API.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "How each AI engine discovers pages, and what's documented versus assumed.",
    },
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "How Perplexity's crawler decides when to revisit a URL, and why honest dates matter there.",
    },
  ],
  sources: [
    {
      title: "Build and submit a sitemap",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    },
    {
      title: "What is a sitemap",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview",
    },
    {
      title: "Sitemaps ping endpoint is going away",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping",
    },
    {
      title: "Keeping content discoverable with sitemaps in AI powered search",
      publisher: "Microsoft Bing",
      href: "https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search",
    },
    {
      title: "Sitemaps XML format",
      publisher: "sitemaps.org",
      href: "https://www.sitemaps.org/protocol.html",
    },
  ],
};
