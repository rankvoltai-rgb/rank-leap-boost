import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "robots-txt",
  metaTitle: "What Is robots.txt? How It Works for Search and AI Crawlers",
  metaDescription:
    "robots.txt tells crawlers which paths they may fetch, per user agent. How it works under RFC 9309, the AI crawler setup to copy, and mistakes that cost visibility.",
  keywords: [
    "robots.txt",
    "what is robots.txt",
    "robots.txt for AI crawlers",
    "robots.txt example",
    "robots exclusion protocol",
    "robots.txt vs noindex",
    "RFC 9309",
  ],

  whyItMatters:
    "robots.txt is the one file every search and AI engine checks before reading your site, and a single wrong line in it can remove you from Google, ChatGPT or Claude without any error message. For a small team, it's also the cheapest place to make deliberate choices — search yes, training your call — instead of inheriting whatever a CMS plugin or CDN default decided for you.",

  questions: [
    {
      id: "how-it-works",
      question: "How does robots.txt work?",
      answer:
        "robots.txt works by listing groups of rules, each starting with one or more `User-agent` lines, that tell a named crawler which URL paths it may or may not fetch; a crawler reads the file at the site's root before crawling and follows the single group that best matches its name.",
      blocks: [
        {
          kind: "p",
          text: "The format was first proposed by Martijn Koster in 1994 and became an internet standard, [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), in September 2022. The rules that matter most in practice:",
        },
        {
          kind: "list",
          items: [
            "**One file per host.** It must sit at `/robots.txt` and covers only that protocol, host and port, so `blog.example.com` needs its own.",
            "**The most specific group wins.** A crawler follows the group that names it and ignores `User-agent: *` entirely. Google never merges a named group with the `*` group.",
            "**The longest matching path wins** within a group. When an `Allow` and a `Disallow` match equally, the RFC and Google both favor the `Allow`.",
            "**Matching rules:** user-agent names are case-insensitive, paths are case-sensitive, `*` matches any run of characters and `$` anchors the end of a URL.",
            "**It's cached.** The RFC says crawlers shouldn't rely on a cached copy for more than 24 hours; OpenAI and Perplexity say changes take up to about a day to apply.",
          ],
        },
        {
          kind: "p",
          text: 'One rule sits above the rest: robots.txt is a request, not a lock. The RFC says its rules "are not a form of access authorization," and Google notes that while reputable crawlers obey them, "other crawlers might not." See [AI crawlers](/glossary/ai-crawlers) for which AI bots honor it.',
        },
      ],
    },
    {
      id: "ai-crawler-setup",
      question: "How do I set up robots.txt for AI crawlers?",
      answer:
        "Set up robots.txt for AI crawlers by giving each search and user-triggered bot an explicit `Allow`, making one deliberate decision for all the training tokens, and keeping Googlebot allowed, since Google's AI features and Claude's search index both depend on it.",
      blocks: [
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Search engines and AI search indexes: allow\nUser-agent: Googlebot\nUser-agent: Bingbot\nUser-agent: OAI-SearchBot\nUser-agent: Claude-SearchBot\nUser-agent: PerplexityBot\nAllow: /\nDisallow: /account/\n\n# Live fetches for a user's question: allow\nUser-agent: ChatGPT-User\nUser-agent: Claude-User\nUser-agent: Perplexity-User\nAllow: /\nDisallow: /account/\n\n# Model training: your call (change Allow to Disallow to opt out)\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: CCBot\nUser-agent: Google-Extended\nUser-agent: Applebot-Extended\nAllow: /\nDisallow: /account/\n\n# Everyone else\nUser-agent: *\nDisallow: /account/\n\nSitemap: https://example.com/sitemap.xml",
        },
        {
          kind: "list",
          items: [
            "**One group can name several bots.** RFC 9309 allows multiple `User-agent` lines above one set of rules, which keeps the file short.",
            "**Every group repeats your private paths,** because a named group doesn't inherit anything from `*`.",
            "**Disallowing `Google-Extended` also ends Gemini-app grounding,** not just training. It's the one training token with a search-side cost. See [Google-Extended](/glossary/google-extended).",
            "**`ChatGPT-User` and `Perplexity-User` may ignore robots.txt anyway,** by their vendors' own account. Use a firewall rule if you need a hard block.",
            "**Then check the CDN.** A bot-management rule can block a bot that robots.txt allows.",
          ],
        },
        {
          kind: "p",
          text: "The [AI robots.txt generator](/tools/ai-robots-txt-generator) produces a starting file you can adapt.",
        },
      ],
    },
    {
      id: "vs-noindex",
      question: "robots.txt vs noindex: what's the difference?",
      answer:
        "robots.txt controls whether a crawler may fetch a URL, while a `noindex` directive controls whether a fetched page may appear in results — so a URL blocked in robots.txt can still be indexed from links elsewhere, and the crawler must be allowed in to see a `noindex` at all.",
      blocks: [
        {
          kind: "p",
          text: 'Google says robots.txt "is not a mechanism for keeping a web page out of Google": a disallowed URL "can still be indexed if linked to from other sites," appearing with its address but no description. OpenAI says the same of ChatGPT, where a site opted out of OAI-SearchBot "can still appear as navigational links," and Brave notes that "robots.txt is not used to prevent a page from being indexed."',
        },
        {
          kind: "table",
          head: ["You want…", "Use", "Not"],
          rows: [
            [
              "A bot to stop fetching a path",
              "A robots.txt `Disallow`",
              "`noindex` (the bot must fetch the page to see it)",
            ],
            [
              "A page out of search results",
              "`noindex`, with crawling allowed",
              "robots.txt alone",
            ],
            [
              "Text kept out of Google's AI answers",
              "`nosnippet` or `data-nosnippet`",
              "robots.txt",
            ],
            [
              "Content that's actually private",
              "Authentication",
              "Either one: both are public requests",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Listing a path in robots.txt also advertises it: the RFC warns that doing so "exposes them publicly." Never use it to hide anything sensitive. See [indexing](/glossary/indexing) and [snippet controls](/glossary/snippet-controls).',
        },
      ],
    },
    {
      id: "how-to-test",
      question: "How do I test robots.txt?",
      answer:
        "Test robots.txt by fetching the live file from every host, checking which group each crawler you care about actually matches, and confirming in Search Console's robots.txt report that Google fetched it without errors, then request a key page with each bot's user agent to catch CDN blocks.",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: '# 1. The file as crawlers see it (repeat for every host)\ncurl -s https://example.com/robots.txt\ncurl -s https://blog.example.com/robots.txt\n\n# 2. The status code changes the meaning (see below)\ncurl -s -o /dev/null -w "%{http_code}\\n" https://example.com/robots.txt\n\n# 3. Can a bot actually get a page? Catches user-agent blocks at the CDN\ncurl -s -o /dev/null -w "%{http_code}\\n" -A "Claude-SearchBot" https://example.com/pricing',
        },
        {
          kind: "list",
          items: [
            "**Status codes change everything.** Under RFC 9309, a 4xx on robots.txt means crawlers may fetch anything, and a 5xx means they must assume everything is disallowed. Google stops crawling for 12 hours after a 5xx, then falls back to a cached copy for up to 30 days.",
            "**Search Console's robots.txt report** lists the files Google found for your top hosts, when it last fetched them, and any parse errors. See [Google Search Console](/glossary/google-search-console).",
            "**A `curl` with a bot's user agent tests user-agent rules only.** IP-based bot management can still treat the real bot differently, so check your CDN's firewall log for challenges too.",
          ],
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with robots.txt",
      answer:
        "The most common robots.txt mistakes are a leftover `Disallow: /` from staging, blocking a search bot instead of a training bot, forgetting that named groups ignore the `*` rules, and assuming the file you wrote is the file being served.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "The staging Disallow came off at launch.",
              reality:
                "Check. One `Disallow: /` under `User-agent: *` blocks every search and AI bot that doesn't have a group of its own.",
            },
            {
              myth: "Blocking GPTBot or ClaudeBot hides me from their chatbots.",
              reality:
                "Both are training-only. Search is `OAI-SearchBot`, `Claude-SearchBot` and `PerplexityBot`. See [GPTBot](/glossary/gptbot).",
            },
            {
              myth: "My robots.txt is exactly what I wrote.",
              reality:
                "Cloudflare's managed robots.txt prepends rules to your file, including disallows for `Google-Extended` and `Applebot-Extended`, which opts you out of Gemini-app grounding. Read the file as served.",
            },
            {
              myth: "robots.txt is the only gate.",
              reality:
                "From 15 September 2026, Cloudflare blocks multi-purpose crawlers such as Googlebot for customers who choose to block Training, whatever robots.txt says.",
            },
            {
              myth: "A Crawl-delay line slows every bot.",
              reality:
                "It isn't part of the standard. Google ignores `Crawl-delay`; Anthropic supports it. Check each vendor.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The robots.txt Limits Sheet",
    summary:
      "The hard numbers that decide how crawlers read your file, from the standard and the vendors' own documentation. Check your setup against each row.",
    items: [
      {
        label: "File size read",
        value: "500 KiB",
        body: "RFC 9309 requires crawlers to parse at least 500 kibibytes, and Google ignores anything past its 500 KiB limit. Keep the file small and the important rules near the top.",
      },
      {
        label: "Cache lifetime",
        value: "24 hours",
        body: "The RFC says crawlers shouldn't use a cached copy for more than 24 hours, and Google generally caches for up to 24 hours.",
      },
      {
        label: "AI vendor pickup",
        value: "~24 hours",
        body: "OpenAI says changes take about 24 hours to reach its systems; Perplexity says up to 24 hours. Make changes a day before you need them.",
      },
      {
        label: "Redirects followed",
        value: "5 hops",
        body: "The RFC says crawlers should follow at least five consecutive redirects to reach the file. Serve it directly with a 200 instead.",
      },
      {
        label: "File returns 4xx",
        value: "Crawl all",
        body: "A missing file means crawlers may fetch anything, under both the RFC and Google's rules.",
      },
      {
        label: "File returns 5xx",
        value: "Crawl none",
        body: "The RFC treats an unreachable file as a complete disallow; Google pauses crawling for 12 hours, then uses its cached copy for up to 30 days.",
      },
    ],
    outcome:
      "The last row is the one that surprises people: a robots.txt that errors under load can make crawlers back off the whole site. Serve it as a static file that returns a 200 on every host, and recheck it after any migration or CDN change.",
  },

  related: ["ai-crawlers", "indexing", "snippet-controls", "xml-sitemap", "gptbot", "llms-txt"],
  product: {
    feature: "citation-tracking",
    pitch:
      "Once your robots.txt lets the right bots in, Rankbox tracks whether ChatGPT, Perplexity, Claude and Google AI Overviews actually cite your brand, and which article earned each citation.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "The robots.txt tokens and CDN settings for each engine, compared side by side.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "The playbook that starts with one robots.txt line: allowing OAI-SearchBot.",
    },
  ],
  sources: [
    {
      title: "RFC 9309: Robots Exclusion Protocol",
      publisher: "IETF",
      href: "https://www.rfc-editor.org/rfc/rfc9309.html",
    },
    {
      title: "Introduction to robots.txt",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
    },
    {
      title: "How Google interprets the robots.txt specification",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt",
    },
    {
      title: "robots.txt report",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/6062598",
    },
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
    {
      title: "Perplexity crawlers",
      publisher: "Perplexity Docs",
      href: "https://docs.perplexity.ai/guides/bots",
    },
    {
      title: "Control content use for AI training with Cloudflare's managed robots.txt",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/control-content-use-for-ai-training/",
    },
    {
      title: "Your site, your rules: new AI traffic options for all customers",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/content-independence-day-ai-options/",
    },
  ],
};
