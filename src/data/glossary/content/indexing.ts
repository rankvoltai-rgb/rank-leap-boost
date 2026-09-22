import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "indexing",
  metaTitle: "What Is Indexing in SEO? Google, Bing and the AI Search Indexes",
  metaDescription:
    "Indexing is when a search engine stores a crawled page so it can rank or feed AI answers. How it works, why pages get skipped, and the four indexes that matter.",
  keywords: [
    "indexing",
    "search indexing",
    "Google indexing",
    "what is indexing in SEO",
    "crawled - currently not indexed",
    "how to get a page indexed",
    "AI search index",
  ],

  whyItMatters:
    "Every AI answer engine your buyers use retrieves from an index — Google's, Bing's, Brave's, or one the engine built itself — so a page that isn't indexed can't be cited, however good it is. For a small team publishing steadily, checking indexing is the cheapest way to find out why a strong article is getting nothing, before rewriting a word of it.",

  questions: [
    {
      id: "how-it-works",
      question: "How does indexing work?",
      answer:
        "Indexing works in stages after a URL is discovered: the engine crawls the page, processes it — rendering it, reading the text, title and links, and grouping duplicates to pick a canonical — and then decides whether to store it in its index, the database it searches when someone asks a question.",
      blocks: [
        {
          kind: "pipeline",
          steps: [
            {
              title: "Discovery",
              body: "The engine learns the URL exists — from a link on a page it already knows, from a sitemap, or from a push such as [IndexNow](/glossary/indexnow).",
              lever:
                "Link new pages from pages that already get crawled, and list them in your sitemap.",
            },
            {
              title: "Crawling",
              body: "A bot fetches the page, if robots.txt allows it and the server answers. Googlebot reads only the first 2 MB of the HTML.",
              lever: "Keep the page fast, unblocked and light.",
            },
            {
              title: "Processing",
              body: "Google renders JavaScript and analyzes the text, title and alt attributes; most AI crawlers skip rendering. Duplicates are clustered and one canonical is chosen.",
              lever:
                "Serve the main content in the HTML — see [server-side rendering](/glossary/server-side-rendering) — and send one clear [canonical tag](/glossary/canonical-tag).",
            },
            {
              title: "The index decision",
              body: "The page is stored, or it isn't. Google: \"Indexing isn't guaranteed; not every page that Google processes will be indexed.\" Low quality, `noindex` rules and duplication are the usual reasons.",
              lever: "Give every page a job no other page on your site already does.",
            },
            {
              title: "Serving",
              body: "Only indexed pages can rank, or be retrieved when an AI engine grounds an answer. For Google's AI features the page must also be eligible to show a snippet.",
            },
          ],
        },
        {
          kind: "p",
          text: 'None of it can be bought. Google says it "doesn\'t accept payment to crawl a site more frequently, or rank it higher," and "doesn\'t guarantee that it will crawl, index, or serve your page" even when the page follows every guideline.',
        },
      ],
    },
    {
      id: "not-indexed",
      question: "Why is my page not indexed?",
      answer:
        "A page usually isn't indexed for one of five reasons: crawlers can't reach it, it carries a `noindex`, Google treats it as a duplicate of another URL, it adds too little unique value, or Google hasn't got to it yet. Search Console's Page indexing report says which one applies.",
      blocks: [
        {
          kind: "table",
          head: ["Page indexing status", "What it means", "What to do"],
          rows: [
            [
              "Discovered - currently not indexed",
              "Found but not crawled yet; Google expected crawling to overload the site",
              "Check server speed and URL bloat; link the page from pages that get crawled",
            ],
            [
              "Crawled - currently not indexed",
              "Crawled and evaluated but not stored; it may be indexed later",
              "Improve or merge the page — Google says there's no need to resubmit",
            ],
            [
              "Duplicate, Google chose different canonical than user",
              "Google prefers another URL as the canonical",
              "Make the pages distinct, or accept Google's choice and link to it",
            ],
            [
              "URL marked ‘noindex’",
              "A `noindex` rule was found",
              "Remove it if the page should rank",
            ],
            [
              "URL blocked by robots.txt",
              "Crawling is disallowed",
              "Allow it if the page matters; a blocked URL can still be indexed without its content",
            ],
            [
              "Soft 404",
              "Returns 200 but looks like an error page",
              "Return a real 404 or 410, or add real content",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Google adds that you "should not expect all URLs on your site to be indexed, only the canonical pages" — so a report full of alternates, redirects and parameter URLs is normal. Focus on the pages you\'d be upset to lose, and on patterns: a whole template stuck in one status is a site problem, not a page problem. If the pattern is URL bloat, see [crawl budget](/glossary/crawl-budget).',
        },
      ],
    },
    {
      id: "check-indexing",
      question: "How do you check if a page is indexed?",
      answer:
        "Check indexing with each engine's own tools: URL Inspection in Google Search Console shows whether a URL is on Google and which canonical Google chose, and Bing Webmaster Tools does the same job for Bing. A `site:` search is only a rough spot check, not a complete list.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Google:** URL Inspection in [Search Console](/glossary/google-search-console) shows the indexing status, the Google-selected canonical and the rendered HTML, and its live test shows what Googlebot gets right now. Request indexing there for your most important URLs; it's rate-limited.",
            "**Bing:** verify the site in Bing Webmaster Tools, inspect key URLs and submit your sitemap. Bing's index feeds Copilot, and Microsoft is a named ChatGPT search provider.",
            "**Brave:** there's no console. Search your page title on search.brave.com, and after big changes use the re-fetch form at search.brave.com/submit-url, which asks Brave to re-crawl a page without guaranteeing it.",
            "**Perplexity:** no console and no submission. Discovery runs through its own crawler and links from sites it already trusts.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Status code and any X-Robots-Tag header\ncurl -sI https://www.example.com/blog/launch-checklist | grep -i -E \"^HTTP|x-robots-tag\"\n\n# A stray robots meta tag in the HTML (a leftover staging noindex is common)\ncurl -s https://www.example.com/blog/launch-checklist | grep -i -o '<meta[^>]*robots[^>]*>'\n\n# Google spot check, incomplete by design:\n#   site:example.com/blog/launch-checklist",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does indexing matter for AI search?",
      answer:
        "Indexing is the entry ticket to AI search: AI Overviews, AI Mode and Gemini ground answers in Google's index, ChatGPT draws on Bing and OpenAI's own index, Claude on Brave's and Perplexity on its own — so a page missing from an engine's index can't be cited by that engine.",
      blocks: [
        {
          kind: "table",
          head: ["AI engine", "Index it retrieves from", "Your way in"],
          rows: [
            [
              "[AI Overviews](/glossary/ai-overviews) and AI Mode",
              "Google's Search index",
              "Indexed, snippet-eligible, and set to Include in Search Console's Search generative AI setting",
            ],
            [
              "Gemini app",
              "Google's Search index",
              "Indexed, with `Google-Extended` not disallowed",
            ],
            [
              "ChatGPT search",
              "Bing, a named provider, plus OpenAI's own index",
              "Indexed in Bing, with `OAI-SearchBot` allowed",
            ],
            ["Microsoft Copilot", "Bing", "Indexed in Bing; IndexNow speeds up changes"],
            [
              "Claude",
              "Brave Search",
              "Crawlable by Googlebot, whose rules Brave's crawler follows, and ranking in Brave",
            ],
            [
              "Perplexity",
              "Its own index of 200B+ URLs",
              "`PerplexityBot` allowed and server-rendered HTML",
            ],
          ],
        },
        {
          kind: "p",
          text: "Being indexed isn't the same as being cited. In Ahrefs' March 2026 data only 37.9% of pages cited in AI Overviews ranked in the top 10 for the typed query, because the engine retrieved them for narrower [fan-out](/glossary/query-fan-out) sub-queries. But every one of those pages had to be in the index first: [retrieval-augmented generation](/glossary/retrieval-augmented-generation) can only retrieve what's stored.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with indexing",
      answer:
        "The most common indexing mistakes are blocking a page in robots.txt to keep it out of the index, leaving a staging `noindex` in place after launch, resubmitting pages Google has already crawled and declined, and publishing near-identical pages that get folded into one.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "robots.txt keeps a page out of the index.",
              reality:
                "It stops crawling, not indexing. Google can index a blocked URL without its content — use `noindex`, and let the crawler in to see it.",
            },
            {
              myth: "Requesting indexing again and again forces a page in.",
              reality:
                'For "Crawled - currently not indexed," Google says there\'s "no need to resubmit." Improve the page, or merge it into a stronger one.',
            },
            {
              myth: "Every URL on my site should be indexed.",
              reality:
                "Google expects only canonical pages to be indexed. Alternates, redirects and parameter URLs showing as not indexed is normal.",
            },
            {
              myth: "If Google indexed it, every AI engine can use it.",
              reality:
                "ChatGPT leans on Bing and OpenAI's own index, Claude on Brave and Perplexity on its own crawler. Check the index each engine actually uses.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Four-Index Check",
    summary:
      "AI answers draw on four families of index, and a page can be in one and missing from another. Check each key page against all four, in this order: the first failure tells you which engines can't cite it and what to fix.",
    items: [
      {
        label: "Google — AI Overviews, AI Mode, Gemini",
        body: "**Test:** URL Inspection reports the URL is on Google, the Google-selected canonical is yours, and the page carries no `nosnippet`. Fix `noindex`, duplicates and thin content here first.",
      },
      {
        label: "Bing — Copilot, and ChatGPT's Bing path",
        body: "**Test:** Bing Webmaster Tools shows the URL indexed. Submit your sitemap there and turn on IndexNow so changes reach Bing quickly.",
      },
      {
        label: "Brave — Claude's search",
        body: "**Test:** search the page's title on search.brave.com. Brave's crawler follows Googlebot's robots rules, so fix Google access first, then earn links from sites Brave already knows.",
      },
      {
        label: "Engines' own crawlers — Perplexity and OpenAI",
        body: "**Test:** your server logs show `PerplexityBot` and `OAI-SearchBot` fetching the page with a 200, and `curl` with their user agents returns the full text.",
      },
    ],
    outcome:
      "Score each index pass or fail for your ten most important pages. A page that passes Google but fails Bing is missing from Copilot and from one of ChatGPT's paths; a page that fails Brave is missing from Claude's search — and each failure has a different fix.",
  },

  related: [
    "crawl-budget",
    "xml-sitemap",
    "canonical-tag",
    "google-search-console",
    "retrieval-augmented-generation",
    "indexnow",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Indexing gets a page into the pool; it doesn't get it cited. Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "The index each AI engine searches, and the crawler that gets you into it, compared side by side.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description:
        "From indexed to cited: mapping fan-out and writing passages Google's AI can lift.",
    },
  ],
  sources: [
    {
      title: "In-depth guide to how Google Search works",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/how-search-works",
    },
    {
      title: "Page indexing report",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7440203",
    },
    {
      title: "URL Inspection tool",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/9012289",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Brave Search crawler",
      publisher: "Brave",
      href: "https://search.brave.com/help/brave-search-crawler",
    },
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
  ],
};
