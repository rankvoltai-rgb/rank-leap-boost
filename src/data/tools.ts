/**
 * The free-tools catalog: one entry per tool page under /tools.
 *
 * Copy lives here; the interactive part of each tool is a component in
 * src/components/tools, matched by slug in registry.tsx. Everything a crawler
 * needs (title, intro, how-to, FAQ) is in this file so the pages render whole
 * on the server.
 */

export type ToolKind = "instant" | "ai" | "live";

export type ToolCategoryId = "crawlers" | "markup" | "content" | "links" | "visibility";

export type ToolIcon =
  | "file-text"
  | "bot"
  | "shield-check"
  | "scroll-text"
  | "radar"
  | "braces"
  | "share"
  | "languages"
  | "map"
  | "search"
  | "quote"
  | "percent"
  | "list-tree"
  | "link"
  | "pencil-line"
  | "clipboard-list"
  | "message-square"
  | "help-circle"
  | "heading"
  | "arrow-right-left"
  | "tag"
  | "user-check"
  | "sparkles";

export interface ToolFAQ {
  q: string;
  a: string;
}

export interface Tool {
  slug: string;
  name: string;
  category: ToolCategoryId;
  kind: ToolKind;
  icon: ToolIcon;
  /** One line under the name on cards. */
  tagline: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  /** Words people search for; matched by the hub's search box. */
  keywords: string[];
  howto: string[];
  faqs: ToolFAQ[];
  /** Shown first on the hub. */
  featured?: boolean;
}

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  description: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "crawlers",
    name: "AI crawlers",
    description: "Control which AI bots read your site, and check they can.",
  },
  {
    id: "markup",
    name: "Schema & tags",
    description: "Structured data and the meta tags engines read first.",
  },
  {
    id: "content",
    name: "Content & on-page",
    description: "Write, check and tighten pages so they rank and get quoted.",
  },
  {
    id: "links",
    name: "URLs & links",
    description: "Redirects, tracking links and clean URLs.",
  },
  {
    id: "visibility",
    name: "AI visibility",
    description: "Find out whether AI recommends you, and fix it if not.",
  },
];

export const KIND_LABEL: Record<ToolKind, { label: string; note: string }> = {
  instant: { label: "Instant", note: "Runs in your browser" },
  ai: { label: "AI-powered", note: "Generated fresh each run" },
  live: { label: "Live check", note: "Fetches your site" },
};

export const TOOLS: Tool[] = [
  /* ------------------------------------------------------------------ */
  /* AI crawlers                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "llms-txt-generator",
    name: "llms.txt Generator",
    category: "crawlers",
    kind: "instant",
    icon: "file-text",
    featured: true,
    tagline: "Write the llms.txt file AI assistants read first.",
    h1: "llms.txt Generator",
    intro:
      "Build a valid llms.txt in a minute: your site in one line, the pages that matter grouped by section, and an optional block for content AI engines can skip. Copy it, drop it at the root of your domain, done.",
    metaTitle: "Free llms.txt Generator — Valid, Sectioned, Ready to Upload | Rankbox",
    metaDescription:
      "Generate a valid llms.txt file with sections, page descriptions and an Optional block so ChatGPT, Claude and Perplexity understand your site. Free, no signup.",
    keywords: ["llms.txt", "llms-full.txt", "ai crawlers", "markdown", "site map for ai"],
    howto: [
      "Enter your site name and a one-sentence summary of what it does.",
      "Add sections (Docs, Product, Blog) and list the pages in each with a short note.",
      "Move anything low-priority into the Optional section so engines can skip it.",
      "Copy or download the file and upload it to yoursite.com/llms.txt.",
    ],
    faqs: [
      {
        q: "What is llms.txt?",
        a: "llms.txt is a Markdown file at the root of a domain that gives AI assistants a curated map of the site: a title, a one-line summary, and lists of the most important pages with a note on each. It was proposed by Jeremy Howard in 2024 and is now published by thousands of docs sites.",
      },
      {
        q: "What format does llms.txt use?",
        a: "An H1 with the site name, an optional blockquote summary, then H2 sections that each hold a Markdown list of links, written `- [Title](url): description`. A final section titled Optional marks pages that can be skipped when context is tight. This tool writes exactly that structure.",
      },
      {
        q: "Do AI engines actually read llms.txt?",
        a: "Adoption is uneven. Anthropic, Cloudflare, Stripe and many docs platforms publish one, and some assistants fetch it when a user points them at a site, but none of the big engines has committed to crawling it as they do robots.txt. It costs nothing to publish and helps any agent that looks, so it belongs in the same setup pass as robots.txt and schema.",
      },
      {
        q: "What is the difference between llms.txt and llms-full.txt?",
        a: "llms.txt is the index: links and one-line notes. llms-full.txt is the full text of those pages concatenated into one Markdown file, for tools that want to load everything at once. Start with llms.txt; add llms-full.txt if you have docs.",
      },
    ],
  },
  {
    slug: "ai-robots-txt-generator",
    name: "AI Crawler robots.txt Generator",
    category: "crawlers",
    kind: "instant",
    icon: "bot",
    featured: true,
    tagline: "Allow search bots, decide on training bots, one file.",
    h1: "AI Crawler robots.txt Generator",
    intro:
      "Every AI vendor runs separate bots for training, search indexing and live page fetches, each with its own robots.txt token. Pick a preset or decide bot by bot, and get a clean robots.txt that keeps you in AI answers while you choose what trains the next model.",
    metaTitle: "Free AI Crawler robots.txt Generator — GPTBot, ClaudeBot, PerplexityBot | Rankbox",
    metaDescription:
      "Generate a robots.txt that allows or blocks GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and more, grouped by what each bot does. Free.",
    keywords: [
      "robots.txt",
      "gptbot",
      "claudebot",
      "perplexitybot",
      "google-extended",
      "block ai crawlers",
      "oai-searchbot",
    ],
    howto: [
      "Choose a preset: Recommended keeps you in AI search and lets you decide on training.",
      "Adjust individual bots — they are grouped by job: search index, live fetch, training.",
      "Add your sitemap URL and any paths that should stay private.",
      "Copy the file and upload it to yoursite.com/robots.txt.",
    ],
    faqs: [
      {
        q: "Should I block AI crawlers?",
        a: "Only the training bots, and only if keeping your content out of future models matters more than being known by them. The search bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot) and the user-triggered fetchers are what get you cited, so blocking those removes you from that engine's answers.",
      },
      {
        q: "Does blocking GPTBot remove me from ChatGPT?",
        a: "No. GPTBot collects training data; ChatGPT search uses OAI-SearchBot, and live page reads use ChatGPT-User. You can block GPTBot and stay fully visible in ChatGPT search, which is what the Recommended preset does when you turn training off.",
      },
      {
        q: "What is Google-Extended?",
        a: "A robots.txt token, not a crawler. It controls whether Google can use your pages to train Gemini and to ground Gemini app answers. It has no effect on Google Search, AI Overviews or AI Mode, which all ride on ordinary Googlebot.",
      },
      {
        q: "How long until a robots.txt change takes effect?",
        a: "Each crawler re-reads robots.txt on its own schedule, usually within a day. Some user-triggered fetchers (ChatGPT-User, Perplexity-User) state that they may not honor robots.txt at all, because a person asked for the page.",
      },
    ],
  },
  {
    slug: "robots-txt-tester",
    name: "robots.txt Tester",
    category: "crawlers",
    kind: "instant",
    icon: "shield-check",
    tagline: "Check whether a URL is blocked for any bot before you ship.",
    h1: "robots.txt Tester for AI & Search Crawlers",
    intro:
      "Paste your robots.txt, enter a URL and pick a user agent. The tester applies the same longest-match rules Google and the AI vendors use and tells you exactly which line allowed or blocked the request, so you catch a bad rule before a crawler does.",
    metaTitle: "Free robots.txt Tester — Test GPTBot, Googlebot & Any User Agent | Rankbox",
    metaDescription:
      "Test whether a URL is allowed or blocked in your robots.txt for Googlebot, GPTBot, ClaudeBot, PerplexityBot or any user agent. See the matching rule. Free.",
    keywords: ["robots.txt tester", "robots.txt validator", "disallow", "user-agent", "crawl"],
    howto: [
      "Paste the contents of your robots.txt (or use the sample).",
      "Enter the full URL or path you want to test.",
      "Pick a user agent, or type a custom one.",
      "Read the verdict and the exact rule that decided it; fix and re-test.",
    ],
    faqs: [
      {
        q: "How does robots.txt decide between Allow and Disallow?",
        a: "The crawler picks the group whose User-agent line best matches its name (a specific name beats *), then within that group applies the most specific rule — the longest matching path. When an Allow and a Disallow are equally long, Allow wins. That is the algorithm in RFC 9309 and Google's documentation, and the one this tester uses.",
      },
      {
        q: "Does a bot that isn't named fall back to the * group?",
        a: "Yes. A bot uses its own group if one exists, otherwise the * group. It never combines the two, which is a common surprise: rules under * do not apply to GPTBot if GPTBot has its own group.",
      },
      {
        q: "Do wildcards work in robots.txt?",
        a: "Google, Bing and the major AI crawlers support * (any characters) and $ (end of URL) in paths. This tester supports both. Some smaller crawlers only support prefix matching.",
      },
    ],
  },
  {
    slug: "ai-crawler-log-analyzer",
    name: "AI Crawler Log Analyzer",
    category: "crawlers",
    kind: "instant",
    icon: "scroll-text",
    tagline: "See which AI bots visit your site, and which pages they want.",
    h1: "AI Crawler Log Analyzer",
    intro:
      "Paste lines from your server or CDN access log and see every AI crawler that visited, how often, and the URLs each one fetched most. Everything runs in your browser; nothing is uploaded.",
    metaTitle:
      "Free AI Crawler Log Analyzer — Find GPTBot, ClaudeBot & Perplexity Visits | Rankbox",
    metaDescription:
      "Paste your access logs to see which AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…) visit your site and what they fetch. Private, in-browser.",
    keywords: ["access log", "server log", "ai bot traffic", "crawler analytics", "user agent"],
    howto: [
      "Export or copy recent lines from your access log (Apache, Nginx, Cloudflare, Vercel all work).",
      "Paste them into the box — the analyzer only needs the user agent and the request path.",
      "Read the per-bot breakdown: hits, share, and the pages each bot fetched most.",
      "Watch the user-triggered bots: each hit is a live conversation that needed your page.",
    ],
    faqs: [
      {
        q: "Which log formats does it read?",
        a: "Any line that contains a request path and a user agent string: Apache combined, Nginx default, Cloudflare Logpush lines and most CDN exports. It matches bots by their user-agent tokens, so column order doesn't matter.",
      },
      {
        q: "Is my log data uploaded anywhere?",
        a: "No. Parsing happens in your browser tab and nothing leaves it. Reload the page and it's gone.",
      },
      {
        q: "Can a user agent be faked?",
        a: "Yes, easily. Treat this as a first pass. To verify a hit, check the source IP against the vendor's published ranges (openai.com/gptbot.json, claude.com/crawling/bots.json, perplexity.com/perplexitybot.json).",
      },
    ],
  },
  {
    slug: "ai-search-readiness-check",
    name: "AI Search Readiness Check",
    category: "crawlers",
    kind: "live",
    icon: "radar",
    featured: true,
    tagline: "Scan any site for the 12 things AI engines need to cite it.",
    h1: "AI Search Readiness Check",
    intro:
      "Enter a URL and we fetch the page, its robots.txt and its llms.txt, then grade the basics every AI engine depends on: crawler access, a readable title and description, one H1, structured data, social tags and a canonical. You get a score and a fix list in about ten seconds.",
    metaTitle: "Free AI Search Readiness Check — Is Your Site Citable by ChatGPT? | Rankbox",
    metaDescription:
      "Scan any URL for AI crawler access, llms.txt, schema, title, meta, H1, canonical and Open Graph tags. Get a readiness score and a fix list in seconds. Free.",
    keywords: ["ai seo audit", "site checker", "geo audit", "crawlability", "ai readiness"],
    howto: [
      "Enter your homepage or any page URL.",
      "Wait a few seconds while we fetch the page, robots.txt and llms.txt.",
      "Read the score and work through the failed checks first — each explains the fix.",
      "Re-run after changes to confirm.",
    ],
    faqs: [
      {
        q: "What does the check look at?",
        a: "Twelve signals: whether robots.txt allows the AI search bots and Googlebot, whether llms.txt exists, title and meta description presence and length, exactly one H1, JSON-LD structured data, canonical tag, Open Graph tags, a language attribute, viewport tag, and whether the page returned real HTML content.",
      },
      {
        q: "Why does it say my page has no content?",
        a: "AI crawlers don't run JavaScript, and neither does this check. If your page renders on the client only, crawlers see an empty shell. Server-side rendering or prerendering fixes it.",
      },
      {
        q: "Is a high score a guarantee of citations?",
        a: "No. These are the entry requirements — an engine has to be able to read and understand your page before it can quote it. Winning the citation still comes down to content that answers the question better than the alternatives.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Schema & tags                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "schema-generator",
    name: "Schema Markup Generator",
    category: "markup",
    kind: "instant",
    icon: "braces",
    featured: true,
    tagline: "JSON-LD for 10 schema types, with field-level guidance.",
    h1: "Schema Markup (JSON-LD) Generator",
    intro:
      "Pick the type that matches your page, fill in the fields, and copy a ready-to-paste JSON-LD block. Covers Organization, Article, FAQ, Product, HowTo, LocalBusiness, Person, SoftwareApplication, BreadcrumbList and WebSite, with notes on what Google requires for rich results.",
    metaTitle: "Free Schema Markup Generator — JSON-LD for 10 Types | Rankbox",
    metaDescription:
      "Generate valid JSON-LD for Article, FAQ, Product, HowTo, LocalBusiness, Organization, Person, SoftwareApplication, Breadcrumb and WebSite schema. Copy and paste.",
    keywords: [
      "schema",
      "json-ld",
      "structured data",
      "rich results",
      "faq schema",
      "howto schema",
    ],
    howto: [
      "Choose the schema type that matches the page.",
      "Fill in the fields — required ones are marked.",
      "Copy the script tag from the output pane.",
      "Paste it into the <head> of the page and validate with Google's Rich Results Test.",
    ],
    faqs: [
      {
        q: "What is JSON-LD and why does Google prefer it?",
        a: "JSON-LD is structured data written as a JSON object inside a script tag, separate from your visible HTML. Google recommends it over Microdata because it's easier to add, maintain and generate, and it can be injected without touching the page layout.",
      },
      {
        q: "Can I combine several schema types on one page?",
        a: "Yes. Either add several script tags, or put multiple objects in one @graph array. A typical article page carries Article, BreadcrumbList and Organization together.",
      },
      {
        q: "Does structured data help with AI search?",
        a: "It helps engines extract facts, authorship, dates and Q&A pairs without guessing, which makes a page easier to cite accurately. It isn't a ranking factor in the classic sense, but it removes ambiguity, and ambiguity is what gets a source skipped.",
      },
    ],
  },
  {
    slug: "open-graph-generator",
    name: "Open Graph & Social Tags Generator",
    category: "markup",
    kind: "instant",
    icon: "share",
    tagline: "Meta tags plus a live preview for X, LinkedIn and Slack.",
    h1: "Open Graph & Twitter Card Generator",
    intro:
      "Fill in a title, description, image and URL, watch how the link unfurls on X, LinkedIn, Slack and iMessage, and copy the complete set of Open Graph and Twitter Card tags.",
    metaTitle: "Free Open Graph Generator with Social Preview | Rankbox",
    metaDescription:
      "Generate Open Graph and Twitter Card meta tags and preview how your link looks on X, LinkedIn, Slack and iMessage. Copy the tags into your head. Free.",
    keywords: ["open graph", "og:image", "twitter card", "social preview", "link preview"],
    howto: [
      "Enter the page title, description and canonical URL.",
      "Paste the absolute URL of a 1200×630 image.",
      "Check the previews for truncation on each platform.",
      "Copy the tags into your page's <head>.",
    ],
    faqs: [
      {
        q: "What size should an og:image be?",
        a: "1200×630 pixels (1.91:1) works everywhere and is the size most platforms request. Keep it under 5 MB and use an absolute HTTPS URL.",
      },
      {
        q: "Do I need both Open Graph and Twitter Card tags?",
        a: "X falls back to Open Graph when its own tags are missing, but twitter:card is needed to choose the large-image layout. Include both; the tool writes both.",
      },
      {
        q: "Why isn't my preview updating on LinkedIn or Slack?",
        a: "They cache the first fetch. Use LinkedIn's Post Inspector or re-share with a query string (?v=2) to force a refresh.",
      },
    ],
  },
  {
    slug: "hreflang-generator",
    name: "Hreflang Tag Generator",
    category: "markup",
    kind: "instant",
    icon: "languages",
    tagline: "Correct hreflang tags for every language and region pair.",
    h1: "Hreflang Tag Generator",
    intro:
      "List each language or region version of a page and get the full reciprocal set of hreflang link tags, including x-default, as HTML for the head or as an XML sitemap block. Language and region codes are validated as you type.",
    metaTitle: "Free Hreflang Tag Generator — HTML & Sitemap Output | Rankbox",
    metaDescription:
      "Generate correct hreflang link tags for every language and region version of a page, with x-default, as HTML or XML sitemap markup. Codes validated. Free.",
    keywords: ["hreflang", "international seo", "x-default", "language tags", "multilingual"],
    howto: [
      "Add one row per version: language code, optional region, and the URL.",
      "Choose which URL should be the x-default fallback.",
      "Switch between HTML link tags and sitemap XML output.",
      "Paste the same complete set into every language version of the page.",
    ],
    faqs: [
      {
        q: "What is hreflang?",
        a: "An attribute that tells search engines which language and region each version of a page targets, so a French searcher gets the French page instead of the English one. Every version must list all the others, including itself.",
      },
      {
        q: "What is x-default?",
        a: "The version to show when no language matches. Usually your language selector page or the English version.",
      },
      {
        q: "Which codes are valid?",
        a: "ISO 639-1 language codes (en, fr, de) optionally followed by an ISO 3166-1 alpha-2 region (en-GB, fr-CA). Region alone (just GB) is invalid, and so are three-letter codes like eng.",
      },
    ],
  },
  {
    slug: "sitemap-generator",
    name: "XML Sitemap Generator",
    category: "markup",
    kind: "instant",
    icon: "map",
    tagline: "Turn a list of URLs into a valid sitemap.xml.",
    h1: "XML Sitemap Generator",
    intro:
      "Paste your URLs one per line, set a default change frequency and priority, and get a valid sitemap.xml with lastmod dates. Handy for static sites, landing-page sets and anything a CMS won't generate for you.",
    metaTitle: "Free XML Sitemap Generator from a URL List | Rankbox",
    metaDescription:
      "Paste a list of URLs and generate a valid sitemap.xml with lastmod, changefreq and priority. Free, runs in your browser.",
    keywords: ["sitemap.xml", "xml sitemap", "sitemap generator", "lastmod", "indexing"],
    howto: [
      "Paste one URL per line (relative paths are fine if you set a base URL).",
      "Set the lastmod date and default changefreq and priority.",
      "Optionally override priority per line with `url | 0.8`.",
      "Download sitemap.xml, upload it, and reference it in robots.txt.",
    ],
    faqs: [
      {
        q: "How many URLs can one sitemap hold?",
        a: "Up to 50,000 URLs and 50 MB uncompressed. Beyond that, split into several files and list them in a sitemap index.",
      },
      {
        q: "Do changefreq and priority matter?",
        a: "Google says it ignores both; lastmod is the field it uses, and only when it's kept accurate. Other engines still read them, so the tool includes them.",
      },
      {
        q: "Where do I reference the sitemap?",
        a: "Add `Sitemap: https://yoursite.com/sitemap.xml` to robots.txt and submit the URL in Google Search Console and Bing Webmaster Tools.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Content & on-page                                                   */
  /* ------------------------------------------------------------------ */
  {
    slug: "serp-snippet-preview",
    name: "SERP Snippet Preview",
    category: "content",
    kind: "instant",
    icon: "search",
    featured: true,
    tagline: "Pixel-accurate desktop and mobile previews with truncation.",
    h1: "SERP Snippet Preview & Title Length Checker",
    intro:
      "See your title and description exactly as Google shows them on desktop and mobile, measured in pixels rather than characters, with the cut-off point marked. Includes an AI Overview citation preview so you can check how the same page reads as a source.",
    metaTitle: "Free SERP Snippet Preview — Pixel-Accurate Title & Meta Checker | Rankbox",
    metaDescription:
      "Preview your Google snippet on desktop and mobile with pixel-width truncation, plus an AI Overview citation preview. Fix titles and descriptions before publishing.",
    keywords: [
      "serp preview",
      "title tag length",
      "meta description length",
      "pixel width",
      "snippet",
    ],
    howto: [
      "Enter your page title, URL and meta description.",
      "Switch between desktop and mobile to check both truncation points.",
      "Keep the title under ~580px and the description under ~920px on desktop.",
      "Check the AI citation card: does the first line read as a complete claim?",
    ],
    faqs: [
      {
        q: "Why measure in pixels instead of characters?",
        a: "Google truncates at a width, not a count: 'WWW' takes far more room than 'iii'. A 60-character title of wide letters can be cut while a 65-character one of narrow letters survives. The preview measures the actual rendered width in Google's font.",
      },
      {
        q: "What is the ideal title length?",
        a: "Around 50–60 characters, or under roughly 580 pixels on desktop. Put the distinctive words first so the cut-off never removes them.",
      },
      {
        q: "Does Google always use my meta description?",
        a: "No — it rewrites descriptions for most queries, using page text that matches the search. A strong description still wins the cases where it fits, and it is what social and AI tools show.",
      },
    ],
  },
  {
    slug: "ai-citation-readiness-checker",
    name: "AI Citation Readiness Checker",
    category: "content",
    kind: "instant",
    icon: "quote",
    featured: true,
    tagline: "Score a draft on how quotable it is for AI answers.",
    h1: "AI Citation Readiness Checker",
    intro:
      "Paste a draft and get a score for how easily an AI engine can lift an answer from it: does the opening answer the question, are the sentences short enough to quote, are there numbers and named sources, are the headings phrased as questions? Each check comes with a fix.",
    metaTitle: "Free AI Citation Readiness Checker — Is Your Content Quotable? | Rankbox",
    metaDescription:
      "Paste a draft and score its citation readiness for ChatGPT, Perplexity and AI Overviews: answer-first opening, sentence length, specificity, question headings and more.",
    keywords: ["geo checker", "content score", "quotable", "answer first", "ai content audit"],
    howto: [
      "Paste the article text or Markdown, headings included.",
      "Optionally enter the question the page is meant to answer.",
      "Read the score and the checks — red first, then amber.",
      "Edit and paste again; the score updates instantly.",
    ],
    faqs: [
      {
        q: "What makes content easy for AI to cite?",
        a: "A direct answer in the first 40–60 words, sentences that stand alone out of context, concrete numbers and named sources, headings that mirror real questions, and passages of 100–300 words that each cover one idea. Those are the checks this tool runs.",
      },
      {
        q: "Is this the same as a readability score?",
        a: "Readability is one input. Citation readiness also measures specificity (numbers, entities), structure (question headings, chunk length) and whether the answer comes first, which readability scores ignore.",
      },
      {
        q: "Does it send my draft anywhere?",
        a: "No. The analysis is deterministic and runs in your browser. Nothing is stored or sent.",
      },
    ],
  },
  {
    slug: "keyword-density-checker",
    name: "Keyword Density Checker",
    category: "content",
    kind: "instant",
    icon: "percent",
    tagline: "Word count, density, and the phrases you actually use most.",
    h1: "Keyword Density & Phrase Frequency Checker",
    intro:
      "Paste any text to get the word count, reading time and the density of your target keyword, plus the one-, two- and three-word phrases that appear most. Useful for spotting stuffing, and for checking that the terms you meant to cover are really there.",
    metaTitle: "Free Keyword Density Checker with Phrase Frequency | Rankbox",
    metaDescription:
      "Check keyword density, word count and the most frequent 1–3 word phrases in any text. Spot keyword stuffing and missing terms. Free, in-browser.",
    keywords: ["keyword density", "word count", "n-grams", "phrase frequency", "keyword stuffing"],
    howto: [
      "Paste the page text.",
      "Enter the target keyword (optional) to see its count and density.",
      "Scan the phrase tables for terms you over- or under-use.",
      "Aim for natural use — around 0.5–2% for a primary keyword is typical.",
    ],
    faqs: [
      {
        q: "What is a good keyword density?",
        a: "There's no target number Google publishes. Most well-ranking pages land between 0.5% and 2% for the main term, with related phrases spread through the page. Above 3% starts to read as stuffing.",
      },
      {
        q: "Are stop words excluded?",
        a: "Yes, from the phrase tables — 'the', 'and', 'of' and similar words are filtered so the tables show meaningful phrases. Word count includes them.",
      },
    ],
  },
  {
    slug: "heading-structure-checker",
    name: "Heading Structure Checker",
    category: "content",
    kind: "instant",
    icon: "list-tree",
    tagline: "Outline your H1–H6 and catch skipped levels and duplicate H1s.",
    h1: "Heading Structure (H1–H6) Checker",
    intro:
      "Paste a page's HTML or Markdown and see its heading outline as a tree, with the problems flagged: missing or multiple H1s, skipped levels, empty headings, and headings that aren't phrased as anything a reader would search.",
    metaTitle: "Free Heading Structure Checker — H1 to H6 Outline & Issues | Rankbox",
    metaDescription:
      "Paste HTML or Markdown to see your H1–H6 outline as a tree and catch missing H1s, duplicates, skipped levels and empty headings. Free, runs in-browser.",
    keywords: ["heading tags", "h1 checker", "heading hierarchy", "outline", "html structure"],
    howto: [
      "Paste the page source (HTML) or the Markdown draft.",
      "Read the outline tree — indentation shows nesting.",
      "Fix any issues listed: one H1, no skipped levels, no empties.",
      "Turn key H2s into questions to match how people ask.",
    ],
    faqs: [
      {
        q: "How many H1 tags should a page have?",
        a: "One. HTML5 technically allows more, but Google's guidance and every AI extraction pipeline treat the H1 as the page's title. Two H1s means a coin toss.",
      },
      {
        q: "Do skipped heading levels hurt SEO?",
        a: "Not directly as a ranking factor, but a jump from H2 to H4 breaks the outline that screen readers and content extractors build, and AI engines use that outline to decide which passage answers what.",
      },
    ],
  },
  {
    slug: "url-slug-generator",
    name: "URL Slug Generator",
    category: "content",
    kind: "instant",
    icon: "link",
    tagline: "Turn any title into a short, clean, keyword-first slug.",
    h1: "URL Slug Generator",
    intro:
      "Paste a title and get a clean URL slug: lowercase, hyphenated, stop words removed, accents transliterated, and trimmed to a sensible length. Compare the automatic slug with a keyword-first version and copy the one you want.",
    metaTitle: "Free URL Slug Generator — Clean, Short, SEO-Friendly Slugs | Rankbox",
    metaDescription:
      "Convert any title into a clean SEO-friendly URL slug: lowercase, hyphens, stop words removed, accents handled, length trimmed. Free, instant.",
    keywords: ["url slug", "slugify", "permalink", "seo url", "clean url"],
    howto: [
      "Paste the page title or headline.",
      "Choose whether to strip stop words and the maximum word count.",
      "Add the target keyword to see a keyword-first alternative.",
      "Copy the slug into your CMS.",
    ],
    faqs: [
      {
        q: "How long should a URL slug be?",
        a: "Three to five meaningful words. Shorter slugs are easier to read in results and in AI citations, and they age better than slugs that repeat the whole headline.",
      },
      {
        q: "Should I remove stop words from slugs?",
        a: "Usually, unless removing one changes the meaning ('how-to-rank' vs 'rank'). The tool lets you toggle it and shows both.",
      },
    ],
  },
  {
    slug: "meta-description-writer",
    name: "Meta Description Writer",
    category: "content",
    kind: "ai",
    icon: "pencil-line",
    tagline: "Three click-worthy, length-safe descriptions in one run.",
    h1: "AI Meta Description Writer",
    intro:
      "Describe the page, or paste its opening, and get three meta descriptions written to earn the click: active voice, a concrete benefit, and a length that survives Google's cut-off. Each is measured in pixels and ready to copy.",
    metaTitle: "Free AI Meta Description Generator — 3 Options, Length-Checked | Rankbox",
    metaDescription:
      "Generate three compelling, length-safe meta descriptions for any page in seconds, each measured in pixels so nothing is truncated. Free AI tool.",
    keywords: ["meta description generator", "ai meta description", "snippet copy", "ctr"],
    howto: [
      "Describe the page or paste its main content.",
      "Optionally add the primary keyword and the audience.",
      "Generate three options and check their pixel width.",
      "Copy the winner into your page's meta description tag.",
    ],
    faqs: [
      {
        q: "How long should a meta description be?",
        a: "Around 120–160 characters, or under about 920 pixels on desktop. Every option this tool generates is checked against that width.",
      },
      {
        q: "Will a meta description improve rankings?",
        a: "Not directly. It changes click-through rate, and on competitive results that difference compounds. It's also what social tools and many AI assistants show as your page summary.",
      },
    ],
  },
  {
    slug: "content-brief-generator",
    name: "Content Brief Generator",
    category: "content",
    kind: "ai",
    icon: "clipboard-list",
    tagline: "A keyword in, a full outline with questions and entities out.",
    h1: "AI Content Brief Generator",
    intro:
      "Enter a target keyword and get a ready-to-write brief: a working title, a heading-by-heading outline with talking points, the questions the article must answer, and the entities and terms to cover so it reads as authoritative to Google and AI engines alike.",
    metaTitle: "Free AI Content Brief Generator — Outline, Questions & Entities | Rankbox",
    metaDescription:
      "Turn any keyword into a complete content brief: title, H2 outline with points, questions to answer and entities to cover for SEO and AI search. Free AI tool.",
    keywords: ["content brief", "outline generator", "seo brief", "content planning"],
    howto: [
      "Enter your target keyword or topic.",
      "Generate a full brief with outline, questions and entities.",
      "Copy it as Markdown and hand it to your writer, or start drafting.",
      "Run the finished draft through the Citation Readiness Checker.",
    ],
    faqs: [
      {
        q: "What's in a content brief?",
        a: "A working title, a heading-by-heading outline, the key questions to answer and the entities and terms to mention so the page reads as complete to search and AI engines.",
      },
      {
        q: "Can I edit the brief?",
        a: "Yes — treat it as a strong starting point and adapt the outline to your angle, audience and what you actually know that competitors don't.",
      },
    ],
  },
  {
    slug: "ai-question-generator",
    name: "AI Question Generator",
    category: "content",
    kind: "ai",
    icon: "message-square",
    tagline: "The real questions people ask AI about your topic, by intent.",
    h1: "AI Question Generator",
    intro:
      "Enter a topic and get the questions buyers actually ask ChatGPT, Perplexity and Gemini about it, grouped by intent. Use them as H2s, as FAQ entries, or as the prompts you test your own visibility with.",
    metaTitle: "Free AI Question Generator — Questions People Ask AI, by Intent | Rankbox",
    metaDescription:
      "Generate the real questions people ask AI engines about any topic, grouped by informational, commercial, comparison and transactional intent. Free AI tool.",
    keywords: ["people also ask", "question research", "ai prompts", "search intent", "faq ideas"],
    howto: [
      "Enter a topic, product, or keyword.",
      "Generate a grouped list of questions people ask AI.",
      "Copy the ones you can answer better than anyone else.",
      "Answer each directly, in its own section, on your page.",
    ],
    faqs: [
      {
        q: "Why target questions instead of keywords?",
        a: "AI engines answer questions. Structuring content around the exact questions people ask makes your page the easiest source to quote, and the same sections earn People-Also-Ask results on Google.",
      },
      {
        q: "Is this tool free?",
        a: "Yes. It runs on AI, so results are generated fresh each time and may differ between runs.",
      },
    ],
  },
  {
    slug: "ai-faq-generator",
    name: "AI FAQ Generator",
    category: "content",
    kind: "ai",
    icon: "help-circle",
    tagline: "A ready FAQ section with answers and FAQPage schema.",
    h1: "AI FAQ Generator with Schema",
    intro:
      "Give it a topic or a page and it writes a full FAQ section: six to eight real questions with concise, quotable answers, plus the matching FAQPage JSON-LD. Paste the text into the page and the schema into the head.",
    metaTitle: "Free AI FAQ Generator — Questions, Answers & FAQPage Schema | Rankbox",
    metaDescription:
      "Generate a complete FAQ section for any topic with concise answers and ready-to-paste FAQPage JSON-LD schema. Free AI tool for SEO and AI search.",
    keywords: ["faq generator", "faq schema", "faqpage", "question and answer", "ai faq"],
    howto: [
      "Describe the page or topic — a product, a service, a how-to.",
      "Generate the FAQ and read through the answers for accuracy.",
      "Copy the Markdown into your page and the JSON-LD into its head.",
      "Edit any answer that needs your specifics; the schema updates live.",
    ],
    faqs: [
      {
        q: "Does FAQ schema still show rich results?",
        a: "Google restricted FAQ rich results to government and health sites in 2023, so most sites won't see the dropdowns. The schema still helps AI engines pull clean question–answer pairs, which is the reason to keep adding it.",
      },
      {
        q: "How long should FAQ answers be?",
        a: "Two to four sentences: a direct answer first, then one supporting detail. That's the length AI engines quote whole.",
      },
    ],
  },
  {
    slug: "blog-title-generator",
    name: "Blog Title Generator",
    category: "content",
    kind: "ai",
    icon: "heading",
    tagline: "Ten titles across five proven angles, length-checked.",
    h1: "AI Blog Title & Headline Generator",
    intro:
      "Enter your topic and target keyword and get ten headline options across different angles — how-to, listicle, question, contrarian, data-led — each measured against Google's title width so nothing gets cut off.",
    metaTitle: "Free AI Blog Title Generator — 10 Headlines, Length-Checked | Rankbox",
    metaDescription:
      "Generate ten SEO blog titles across how-to, list, question, contrarian and data angles, each checked against Google's title width. Free AI headline tool.",
    keywords: ["blog title generator", "headline generator", "title tag ideas", "h1 ideas"],
    howto: [
      "Enter the topic and, if you have one, the primary keyword.",
      "Pick a tone — plain, bold or expert.",
      "Generate ten options and check the width meter on each.",
      "Copy the one that promises what the article delivers.",
    ],
    faqs: [
      {
        q: "Should the title tag match the H1?",
        a: "They can differ, but keep the same promise. Many sites use a shorter title tag and a fuller H1; AI engines read both, so don't contradict yourself.",
      },
      {
        q: "Do numbers in titles help?",
        a: "Listicle titles reliably earn higher click-through in most studies, but only if the article really is a list. Match the format to the content.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* URLs & links                                                        */
  /* ------------------------------------------------------------------ */
  {
    slug: "redirect-generator",
    name: "301 Redirect Generator",
    category: "links",
    kind: "instant",
    icon: "arrow-right-left",
    tagline: "Old → new URL lists into Apache, Nginx, Vercel, Netlify or Next.js.",
    h1: "301 Redirect Generator",
    intro:
      "Paste pairs of old and new URLs and get the redirect rules for your platform: .htaccess, Nginx, Vercel, Netlify, Cloudflare or Next.js. Handles domain changes, trailing slashes and wildcards, so a site migration doesn't leak the rankings you built.",
    metaTitle: "Free 301 Redirect Generator — htaccess, Nginx, Vercel, Netlify, Next.js | Rankbox",
    metaDescription:
      "Generate 301 redirect rules from a list of old and new URLs for Apache .htaccess, Nginx, Vercel, Netlify, Cloudflare and Next.js. Free, instant.",
    keywords: [
      "301 redirect",
      "htaccess",
      "nginx redirect",
      "vercel.json",
      "netlify _redirects",
      "site migration",
    ],
    howto: [
      "Paste one redirect per line as `old-path -> new-url` (or comma / tab separated).",
      "Choose your platform.",
      "Copy the rules into the right file: .htaccess, nginx.conf, vercel.json, _redirects or next.config.js.",
      "Test a few in a browser and re-crawl in Search Console.",
    ],
    faqs: [
      {
        q: "301 or 308?",
        a: "Both are permanent. 308 additionally preserves the request method, which matters for form posts and APIs. Next.js and Vercel use 308 by default for permanent redirects; search engines treat them the same.",
      },
      {
        q: "Do redirects pass ranking signals?",
        a: "Google has said since 2016 that 301, 302 and 307 all pass PageRank. Use 301 for permanent moves so the new URL replaces the old one in the index.",
      },
    ],
  },
  {
    slug: "utm-link-builder",
    name: "UTM Link Builder",
    category: "links",
    kind: "instant",
    icon: "tag",
    tagline: "Consistent campaign URLs with presets and bulk mode.",
    h1: "UTM Link Builder",
    intro:
      "Build tracking links with source, medium, campaign, term and content, from presets for the channels you use most. Paste several URLs at once to tag a whole batch with the same parameters, and copy them as a list or CSV.",
    metaTitle: "Free UTM Link Builder with Presets & Bulk Mode | Rankbox",
    metaDescription:
      "Build UTM campaign URLs with source, medium, campaign, term and content. Channel presets, lowercase enforcement and bulk tagging of many URLs. Free.",
    keywords: ["utm builder", "campaign url", "utm_source", "utm_medium", "tracking links"],
    howto: [
      "Paste the destination URL (or several, one per line).",
      "Pick a preset — newsletter, LinkedIn, X, paid search — or fill in the parameters.",
      "Keep everything lowercase so reports don't split.",
      "Copy the tagged URL, the list, or the CSV.",
    ],
    faqs: [
      {
        q: "What do utm_source, utm_medium and utm_campaign mean?",
        a: "Source is where the traffic comes from (newsletter, linkedin), medium is the channel type (email, social, cpc), and campaign is the specific push (spring-launch). Term and content are optional for keyword and creative variants.",
      },
      {
        q: "Do UTM parameters affect SEO?",
        a: "Not if the tagged URL has a canonical pointing at the clean version. Never use UTM links in internal navigation, and never in sitemaps.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* AI visibility                                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "get-recommended-by-chatgpt",
    name: "Get Recommended by ChatGPT",
    category: "visibility",
    kind: "ai",
    icon: "user-check",
    featured: true,
    tagline: "A personal plan so AI knows who you are and suggests you.",
    h1: "Get Yourself Recommended by ChatGPT",
    intro:
      "People used to Google you. Now they ask ChatGPT. Tell us your name and what you do, and we'll generate a personalized plan — new LinkedIn headlines, a quotable About-Me, and a step-by-step checklist — so AI engines know who you are and recommend you.",
    metaTitle: "Get Recommended by ChatGPT — Free Personal AI Visibility Plan | Rankbox",
    metaDescription:
      "Free tool: get a personalized LinkedIn + About-Me plan so ChatGPT and other AI engines find, understand, and recommend you. No jargon, built for any professional.",
    keywords: ["personal branding", "linkedin headline", "about me", "chatgpt recommendation"],
    howto: [
      "Enter your name and a line about what you do.",
      "Generate your personalized AI visibility plan.",
      "Enter your email to unlock the full checklist and About-Me draft.",
      "Work through the checklist and paste in your new headline.",
    ],
    faqs: [
      {
        q: "Why does showing up in ChatGPT matter?",
        a: "More people now ask AI assistants for recommendations instead of searching Google. If ChatGPT can't find a clear, consistent picture of who you are, it can't recommend you. This tool helps you become that clear source.",
      },
      {
        q: "Do I need a website?",
        a: "No. A well-optimized LinkedIn profile is enough to start. A simple About-Me page helps even more by giving AI engines a canonical source to cite — the checklist walks you through both.",
      },
      {
        q: "Is this really free?",
        a: "Yes. The plan is generated by AI and free to use. We only ask for your email to unlock the full checklist so we can send you your results and occasional tips.",
      },
    ],
  },
  {
    slug: "ai-visibility-prompt-generator",
    name: "AI Visibility Prompt Kit",
    category: "visibility",
    kind: "instant",
    icon: "sparkles",
    tagline: "30 prompts to test whether ChatGPT recommends your brand.",
    h1: "AI Visibility Prompt Kit",
    intro:
      "Enter your brand, category and a competitor or two, and get thirty prompts across the buying journey — best-of lists, comparisons, alternatives, 'is it worth it' — to paste into ChatGPT, Perplexity and Gemini. Track which ones mention you in the built-in scorecard.",
    metaTitle: "Free AI Visibility Prompt Kit — Test If ChatGPT Recommends You | Rankbox",
    metaDescription:
      "Generate 30 prompts to test whether ChatGPT, Perplexity and Gemini recommend your brand, across best-of, comparison and alternative queries. Free, instant.",
    keywords: [
      "ai visibility",
      "share of voice",
      "prompt tracking",
      "brand mentions",
      "chatgpt test",
    ],
    howto: [
      "Enter your brand name, what you sell, who it's for, and a competitor.",
      "Copy the prompts one at a time into ChatGPT, Perplexity and Gemini.",
      "Tick the ones that mention you to get a share-of-voice score.",
      "Write for the prompts you lost: those are your next articles.",
    ],
    faqs: [
      {
        q: "How do I know if ChatGPT recommends my brand?",
        a: "Ask it the questions your buyers ask — 'best X for Y', 'X vs Z', 'alternatives to Z' — and see whether you appear. This kit generates those questions systematically so you test the whole journey, not one lucky prompt.",
      },
      {
        q: "Why do answers differ between runs?",
        a: "AI engines are probabilistic and often search the web live, so the same prompt can return different sources. Run each prompt two or three times and count how often you appear; that's your real share of voice.",
      },
      {
        q: "Can this be automated?",
        a: "Yes — Rankbox tracks prompts across engines daily and shows your share of voice against competitors. This kit is the manual version so you can see the gap first.",
      },
    ],
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolCategory(id: ToolCategoryId): ToolCategory {
  return TOOL_CATEGORIES.find((c) => c.id === id) ?? TOOL_CATEGORIES[0];
}

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

export const INSTANT_TOOLS = TOOLS.filter((t) => t.kind === "instant");
export const AI_TOOLS = TOOLS.filter((t) => t.kind === "ai");
export const FEATURED_TOOLS = TOOLS.filter((t) => t.featured);

/**
 * Same category, starting after the tool itself and wrapping round, then
 * featured tools from other categories. Starting from the tool's own position
 * spreads the links: every tool in a category is suggested by the ones before
 * it, where always taking the first few left the tail of the list linked from
 * nowhere but /tools.
 */
export function relatedTools(tool: Tool, limit = 3): Tool[] {
  const category = TOOLS.filter((t) => t.category === tool.category);
  const at = category.findIndex((t) => t.slug === tool.slug);
  const same = [...category.slice(at + 1), ...category.slice(0, at)];
  const others = TOOLS.filter((t) => t.category !== tool.category && t.featured);
  return [...same, ...others].slice(0, limit);
}

/**
 * Curated reading paths: a job to be done, and the tools that do it in order.
 */
export interface Toolkit {
  id: string;
  title: string;
  description: string;
  steps: { slug: string; why: string }[];
}

export const TOOLKITS: Toolkit[] = [
  {
    id: "readable",
    title: "Make your site readable by AI",
    description: "The one-time setup that decides whether anything you publish can be cited.",
    steps: [
      { slug: "ai-search-readiness-check", why: "See what's missing today" },
      { slug: "ai-robots-txt-generator", why: "Let the search bots in" },
      { slug: "llms-txt-generator", why: "Hand engines a map" },
      { slug: "schema-generator", why: "Remove the guesswork" },
    ],
  },
  {
    id: "citable",
    title: "Ship a page that gets quoted",
    description: "From keyword to a draft that AI engines can lift an answer from.",
    steps: [
      { slug: "ai-question-generator", why: "Find the questions" },
      { slug: "content-brief-generator", why: "Plan the outline" },
      { slug: "ai-citation-readiness-checker", why: "Score the draft" },
      { slug: "serp-snippet-preview", why: "Nail the snippet" },
    ],
  },
  {
    id: "measure",
    title: "Find out if AI recommends you",
    description: "Test it by hand, then read the logs to see which bots already visit.",
    steps: [
      { slug: "ai-visibility-prompt-generator", why: "Test 30 buyer prompts" },
      { slug: "ai-crawler-log-analyzer", why: "See who's reading you" },
      { slug: "get-recommended-by-chatgpt", why: "Fix your personal footprint" },
    ],
  },
];
