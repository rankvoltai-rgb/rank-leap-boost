import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "crawl-budget",
  metaTitle: "What Is Crawl Budget? When It Matters, and What AI Crawlers Add",
  metaDescription:
    "Crawl budget is how many URLs a search engine will crawl on your site. Google's rough thresholds, what wastes it, and how AI crawler traffic changes the picture.",
  keywords: [
    "crawl budget",
    "what is crawl budget",
    "crawl budget SEO",
    "crawl rate",
    "Discovered - currently not indexed",
    "AI crawler load",
    "crawl capacity limit",
  ],

  whyItMatters:
    "For most small sites, crawl budget is a problem you don't have — Google says sites whose new pages are crawled the day they're published can skip the topic. It becomes yours when a CMS, faceted filters or tag archives quietly turn a few hundred real pages into thousands of URLs, or when AI crawlers add enough load to slow down the server every bot depends on.",

  questions: [
    {
      id: "how-it-works",
      question: "How does crawl budget work?",
      answer:
        "Crawl budget is set by two things: the crawl capacity limit, meaning how many connections a crawler can use without straining your server, and crawl demand, meaning how much it wants your URLs based on popularity, freshness and quality. Google defines a site's budget as the set of URLs it can and wants to crawl.",
      blocks: [
        {
          kind: "table",
          head: ["Part", "What raises it", "What lowers it"],
          rows: [
            [
              "**Crawl capacity limit** (hostload)",
              "Fast, stable responses and time to first byte",
              "Slower responses, 5xx server errors, 429 rate-limiting",
            ],
            [
              "**Crawl demand**",
              "Popular URLs, content that changes, site moves",
              "Duplicate and unimportant URLs, stale pages nobody links to",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Three details from Google\'s guide matter. Budget is set per hostname, so `www.example.com` and `shop.example.com` are budgeted separately. Every site starts at the same conservative capacity limit, which rises only if the site stays healthy under more crawling. And that limit "is shared across all crawlers," so heavy demand from one Google crawler, such as Shopping or AdsBot, leaves less for Googlebot.',
        },
        {
          kind: "p",
          text: "Crawled doesn't mean indexed: after crawling, each page is still evaluated and consolidated before it earns a place — see [indexing](/glossary/indexing).",
        },
      ],
    },
    {
      id: "when-it-matters",
      question: "When does crawl budget matter?",
      answer:
        'Crawl budget matters for sites with more than about a million unique pages that change weekly, sites with 10,000 or more pages that change daily, and sites where Search Console lists many URLs as "Discovered - currently not indexed"; Google says everyone else can simply keep their sitemap current.',
      blocks: [
        {
          kind: "table",
          head: ["Site profile, per Google's rough guide", "Crawl budget a concern?"],
          rows: [
            ["1 million+ unique pages, changing about weekly", "Yes"],
            ["10,000+ unique pages, changing daily", "Yes"],
            [
              'A large share of URLs in "Discovered - currently not indexed"',
              "Yes — Google wanted to crawl them but expected to overload the site",
            ],
            [
              "New pages crawled the day they're published",
              "No — keep the sitemap current and watch the Page indexing report",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Google calls these numbers rough estimates, "not exact thresholds." The third row is the one small sites run into. Search Console defines "Discovered - currently not indexed" as a URL Google found but postponed because crawling it "was expected to overload the site" — on a small site, that often points to a slow server or a URL explosion rather than too little budget.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Check Crawl stats first",
          text: "Search Console → Settings → Crawl stats shows Google's requests per day, average response time and the split of fetches by response code. Rising response times alongside falling requests often means the capacity limit is backing off.",
        },
      ],
    },
    {
      id: "what-wastes-it",
      question: "What wastes crawl budget?",
      answer:
        "Crawl budget is wasted on URLs that shouldn't be crawled at all — faceted filters, sort orders, session and tracking parameters, endless calendars, soft 404s, long redirect chains and duplicate versions of one page — because every fetch spent on them is one not spent on new or updated content.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Consolidate duplicates** with redirects and [canonical tags](/glossary/canonical-tag), so crawlers spend time on unique content rather than unique URLs.",
            "**Block true junk in [robots.txt](/glossary/robots-txt)** — endless filter combinations, internal search results. Google advises against `noindex` for this, because it still requests the page before dropping it.",
            "**Return 404 or 410 for pages that are gone.** A 404 is a strong signal not to crawl again; a blocked URL stays in the queue much longer.",
            "**Fix soft 404s**, error pages that return 200 and keep getting crawled.",
            "**Keep your [XML sitemap](/glossary/xml-sitemap) current**, with `lastmod`, and avoid long redirect chains.",
            "**Make pages cheap to fetch**: fast responses, plus `304 Not Modified` for unchanged pages, which lets Google reuse its cached copy.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "robots.txt doesn't move budget around",
          text: 'Google says blocking pages to "temporarily reallocate crawl budget for other pages" doesn\'t work: it won\'t shift the freed budget elsewhere "unless Google is already hitting your site\'s crawl capacity limit." Block only what you never want crawled.',
        },
      ],
    },
    {
      id: "ai-crawlers",
      question: "How do AI crawlers affect crawl budget?",
      answer:
        "AI crawlers don't draw on Google's crawl budget, but they share your server: in Vercel's network data, OpenAI's, Anthropic's, Apple's and Perplexity's bots together made about 28% as many fetches as Googlebot, and when load slows responses or triggers errors, Google lowers its own crawl capacity for your site.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "569M",
              label:
                "GPTBot fetches in one month across Vercel's network, against 4.5 billion for Googlebot",
              source: {
                name: "Vercel & MERJ, Dec 2024",
                href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
              },
            },
            {
              value: "370M",
              label: "fetches by Anthropic's crawler over the same month",
              source: {
                name: "Vercel & MERJ, Dec 2024",
                href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
              },
            },
            {
              value: "34.82%",
              label: "of ChatGPT's crawler fetches hit 404 pages (Claude's: 34.16%)",
              source: {
                name: "Vercel & MERJ, Dec 2024",
                href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
              },
            },
          ],
        },
        {
          kind: "table",
          head: ["Crawler owner", "Rate controls it honors"],
          rows: [
            [
              "Google — `Googlebot`",
              "No `Crawl-delay`; slows down on its own when responses slow or return 5xx and 429 errors",
            ],
            [
              "Anthropic — `ClaudeBot`, `Claude-SearchBot`, `Claude-User`",
              "robots.txt, including the non-standard `Crawl-delay`",
            ],
            [
              "Perplexity — `PerplexityBot`",
              "robots.txt rate limits, and backs off when a site struggles",
            ],
            [
              "OpenAI — `GPTBot`, `OAI-SearchBot`",
              "robots.txt per bot; when both are allowed, one crawl may serve search and training",
            ],
          ],
        },
        {
          kind: "p",
          text: "Mind the trade-off. Blocking search bots such as [OAI-SearchBot](/glossary/oai-searchbot) or [PerplexityBot](/glossary/perplexitybot) to save load also removes you from those engines' answers, while training-only bots like [GPTBot](/glossary/gptbot) and [ClaudeBot](/glossary/claudebot) can be blocked without that cost. Before blocking anything, fix the 404s and parameter URLs the bots are wasting fetches on — that helps every crawler at once.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with crawl budget",
      answer:
        "The most common crawl budget mistakes are worrying about it on a small site, using `noindex` or robots.txt as a budget-shifting trick, leaving parameter and tag URLs crawlable by the thousand, and blocking AI search crawlers to cut load when the real drain is 404s and duplicates.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Every site needs to optimize its crawl budget.",
              reality:
                "Google's guide targets very large or fast-changing sites. If new pages are crawled the day they're published, keep your sitemap current and move on.",
            },
            {
              myth: "noindex saves crawl budget.",
              reality:
                "Google still requests a `noindex` page before dropping it. Use robots.txt for URLs you never want crawled, and 404 or 410 for pages that are gone.",
            },
            {
              myth: "Submitting more URLs gets more of them crawled.",
              reality:
                "Sitemaps and [IndexNow](/glossary/indexnow) pings suggest; they don't raise capacity. Every IndexNow submission counts toward your crawl quota, so ping only what changed.",
            },
            {
              myth: "More crawling can be requested or bought.",
              reality:
                'Google "doesn\'t accept payment to crawl a site more frequently." The two levers it names are more server capacity and better content — popularity, uniqueness and user value.',
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Crawl Waste Ratio",
    summary:
      "An estimate of how much crawler attention goes to URLs you never wanted crawled, from one month of server logs. The inputs are illustrative, for a fictional project-management app called Plannora — the same steps work on any access log.",
    items: [
      {
        label: "Count the URLs you want crawled",
        body: "Plannora's sitemap: product pages, blog posts, docs and a public gallery of 300 project templates.",
        value: "900 URLs",
      },
      {
        label: "Count the URLs crawlers requested",
        body: "One month of access logs, filtered to Googlebot, GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot, deduplicated by URL.",
        value: "7,400 URLs",
      },
      {
        label: "Sort the extras",
        body: "Gallery filter and sort combinations (`?category=`, `?sort=`, `?page=`): 5,100. Old docs URLs returning 404 after a migration: 1,050. Tag archives and `utm` duplicates: 350.",
        value: "6,500 unwanted",
      },
      {
        label: "Crawl waste ratio",
        body: "6,500 ÷ 7,400 — the share of distinct URLs crawled that Plannora never wanted crawled.",
        value: "88%",
      },
    ],
    outcome:
      "An 88% ratio on a 900-page site isn't a budget crisis yet, but it's a warning: one more filter or a second migration could make it one, and meanwhile every bot burns fetches on dead ends. The fixes are cheap — disallow the filter parameters, 301 the migrated docs to their new URLs or return 410 for the ones that are gone, and canonicalize the tag duplicates. Re-run the ratio a month later.",
  },

  related: ["indexing", "xml-sitemap", "canonical-tag", "robots-txt", "ai-crawlers", "indexnow"],
  product: {
    feature: "auto-publishing",
    pitch:
      "Crawl demand follows useful, changing pages, not URL count. Rankbox adds a new optimized article every day to WordPress, Webflow, Shopify, Wix or Framer, or to any stack through the Rankbox API, so your inventory grows with pages worth crawling.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Which crawler each AI engine sends, and which ones you can block without leaving its answers.",
    },
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description: "How Perplexity's crawler predicts when each URL needs a revisit.",
    },
  ],
  sources: [
    {
      title: "Crawl budget management",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawl-budget",
    },
    {
      title: "Page indexing report",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7440203",
    },
    {
      title: "How Google interprets the robots.txt specification",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec",
    },
    {
      title: "In-depth guide to how Google Search works",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/how-search-works",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "Does Anthropic crawl data from the web, and how can site owners block the crawler?",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    {
      title: "Perplexity crawlers",
      publisher: "Perplexity Docs",
      href: "https://docs.perplexity.ai/guides/bots",
    },
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
  ],
};
