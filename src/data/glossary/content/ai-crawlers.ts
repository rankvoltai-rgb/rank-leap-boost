import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "ai-crawlers",
  metaTitle: "What Are AI Crawlers? Every AI Bot, What It Does, How to Control It",
  metaDescription:
    "AI crawlers are the bots AI companies use to train models, build AI search indexes and fetch pages live. Which is which, which to allow, and how to check your logs.",
  keywords: [
    "AI crawlers",
    "AI bots",
    "AI user agents",
    "list of AI crawlers",
    "should I block AI crawlers",
    "LLM crawlers",
    "AI crawler robots.txt",
  ],

  whyItMatters:
    "Every AI engine that could recommend you has to fetch your pages first, and the bots that do it are easy to shut out by accident: one CDN toggle or one blanket robots.txt rule can remove a small site from ChatGPT, Claude and Perplexity answers within a day. For a founder without a technical team, getting crawler access right is the cheapest AI-visibility work there is, a one-time setup that decides whether anything else you publish can be cited at all.",

  questions: [
    {
      id: "main-ai-crawlers",
      question: "What are the main AI crawlers?",
      answer:
        "The main AI crawlers belong to OpenAI (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`), Anthropic (`ClaudeBot`, `Claude-SearchBot`, `Claude-User`) and Perplexity (`PerplexityBot`, `Perplexity-User`), plus Google, whose AI features ride on Googlebot with a separate `Google-Extended` token for Gemini.",
      blocks: [
        {
          kind: "p",
          text: "Each vendor splits its bots by job, and each job has its own robots.txt token, so you can make a separate decision for each. These are the bots that decide whether you appear in the major AI answer engines, as each vendor documents them in September 2026:",
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "OAI-SearchBot",
              role: "search",
              purpose:
                "OpenAI's search crawler, the bot behind ChatGPT search. See [OAI-SearchBot](/glossary/oai-searchbot).",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "ChatGPT-User",
              role: "user",
              purpose: "Fetches a page when a ChatGPT conversation or a custom GPT needs it.",
              robots: "partial",
              robotsNote: 'OpenAI: "robots.txt rules may not apply" to user-initiated fetches.',
              advice: "allow",
            },
            {
              token: "GPTBot",
              role: "training",
              purpose:
                "Collects content that may be used to train OpenAI's models. Blocking it leaves ChatGPT search untouched. See [GPTBot](/glossary/gptbot).",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "Claude-SearchBot",
              role: "search",
              purpose: "Indexes pages to improve Claude's search results.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Claude-User",
              role: "user",
              purpose:
                "Fetches a page when a Claude user's question needs it — and, unusually, honors robots.txt.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "ClaudeBot",
              role: "training",
              purpose:
                "Collects content that may be used to train Claude models. See [ClaudeBot](/glossary/claudebot).",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "PerplexityBot",
              role: "search",
              purpose:
                "Builds Perplexity's own search index; Perplexity says it isn't used for training. See [PerplexityBot](/glossary/perplexitybot).",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Perplexity-User",
              role: "user",
              purpose: "Fetches a page live when a Perplexity user's question needs it.",
              robots: "no",
              robotsNote: 'Perplexity: "this fetcher generally ignores robots.txt rules."',
              advice: "allow",
            },
            {
              token: "Googlebot",
              role: "search",
              purpose:
                "Crawls for Google Search, including AI Overviews and AI Mode, and builds the index the Gemini app grounds on.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Google-Extended",
              role: "training",
              purpose:
                "A robots.txt token, not a crawler: governs Gemini training and Gemini-app grounding. See [Google-Extended](/glossary/google-extended).",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "Applebot-Extended",
              role: "training",
              purpose:
                "A token, not a crawler: opts content out of training Apple's foundation models, while pages stay in Apple's search features.",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "CCBot",
              role: "training",
              purpose:
                "Common Crawl's crawler. Its open web archive has been a major source of LLM training data, so blocking only the vendors' own training bots leaves this route open.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "Two things no table of user agents can show. Brave Search, the index behind Claude's web search, has no user agent of its own and won't crawl what Googlebot is blocked from. And agentic browsers such as Perplexity's Comet and ChatGPT's agent arrive with ordinary Chrome user agents, so they look like people.",
        },
      ],
    },
    {
      id: "should-i-block",
      question: "Should I block AI crawlers?",
      answer:
        "Blocking AI crawlers makes sense only for the training bots, and only if keeping your content out of future models matters more to you than being in them; the search and user-triggered bots are the ones that get you cited, so block those and you drop out of that engine's answers.",
      blocks: [
        {
          kind: "table",
          head: ["Job", "Examples", "If you block it"],
          rows: [
            [
              "**Training**",
              "`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`",
              "Future models learn less about you. Search answers are unaffected, except Gemini, where `Google-Extended` also ends grounding",
            ],
            [
              "**Search index**",
              "`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot`",
              "You drop out of that engine's cited answers",
            ],
            [
              "**Live fetch**",
              "`ChatGPT-User`, `Claude-User`, `Perplexity-User`",
              "The engine can't read your page mid-conversation, though some of these ignore robots.txt anyway",
            ],
          ],
        },
        {
          kind: "p",
          text: "The training decision is a real trade-off, not a free win. ChatGPT searched the web on about a third of prompts in early 2026, per [Semrush's clickstream data](https://www.semrush.com/blog/chatgpt-search-insights/); the rest were answered from what the model learned in training. Opting out protects your content from reuse, and it also means the next model knows less about your brand and your category. See [LLM training data](/glossary/llm-training-data).",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "The default that costs nothing",
          text: "For a business that wants to be recommended, allow every search and user-triggered bot, then make one deliberate call on the training tokens as a group. The [AI robots.txt generator](/tools/ai-robots-txt-generator) writes the file; [robots.txt](/glossary/robots-txt) explains the rules it follows.",
        },
      ],
    },
    {
      id: "check-visits",
      question: "How do I check which AI crawlers visit my site?",
      answer:
        "To see which AI crawlers visit your site, search your server or CDN access logs for each bot's user-agent token, then verify the source IPs against the vendor's published list, because user agents are trivial to fake.",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: '# Hits per AI bot in this log\ngrep -oE "GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|CCBot" access.log \\\n  | sort | uniq -c | sort -rn',
        },
        {
          kind: "table",
          head: ["Vendor", "How to verify a hit"],
          rows: [
            [
              "OpenAI",
              "`openai.com/searchbot.json`, `openai.com/gptbot.json`, `openai.com/chatgpt-user.json`",
            ],
            ["Anthropic", "`claude.com/crawling/bots.json`, shared by all three bots"],
            [
              "Perplexity",
              "`perplexity.com/perplexitybot.json`, `perplexity.com/perplexity-user.json`",
            ],
            [
              "Google",
              "Reverse DNS to `googlebot.com`, `google.com` or `googleusercontent.com`, or Google's published IP-range files",
            ],
          ],
        },
        {
          kind: "p",
          text: "Hits from the user-triggered bots are the most useful signal: each `ChatGPT-User`, `Claude-User` or `Perplexity-User` request is a live conversation that needed your page, and Cloudflare saw this kind of user-action crawling grow more than 15-fold across its network in 2025. Watch which URLs they fetch most, because those are the pages real questions are pulling into answers. Two gaps remain. `Google-Extended` never appears in logs because it isn't a crawler, and Comet sends a standard Chrome user agent from the user's own IP. Logs show who read you; to see who cited you, you need [prompt tracking](/glossary/prompt-tracking).",
        },
      ],
    },
    {
      id: "ai-vs-search-crawlers",
      question: "AI crawlers vs search engine crawlers: what's the difference?",
      answer:
        "Search engine crawlers such as Googlebot and Bingbot index pages to rank them as links, while AI crawlers fetch pages to train models, feed an AI answer index or read a page live for one user — and unlike Googlebot, the major AI crawlers don't run JavaScript.",
      blocks: [
        {
          kind: "table",
          head: ["", "Search engine crawlers", "AI crawlers"],
          rows: [
            [
              "**Examples**",
              "`Googlebot`, `Bingbot`",
              "`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`",
            ],
            [
              "**Jobs**",
              "One: index pages for search results",
              "Up to three per vendor, each with its own token: training, search index, live fetch",
            ],
            [
              "**JavaScript**",
              "Googlebot renders it",
              "Not rendered — Vercel found none of the major AI crawlers ran it",
            ],
            [
              "**robots.txt**",
              "Honored",
              "Honored by training and search bots; some live fetchers ignore it",
            ],
            [
              "**What comes back**",
              "Rankings and clicks",
              "Citations and mentions — and far fewer visits per crawl",
            ],
          ],
        },
        {
          kind: "p",
          text: "The last row is why the distinction matters. Cloudflare's [2025 Year in Review](https://blog.cloudflare.com/radar-2025-year-in-review/) found that crawling for model training made up the overwhelming majority of AI crawler traffic, and measured crawl-to-referral ratios as high as 500,000 to 1 for Anthropic and 3,700 to 1 for OpenAI, with Perplexity lowest of the major platforms. Training crawls send no visitors by design; search-type AI bots can. Because AI crawlers read raw HTML, [server-side rendering](/glossary/server-side-rendering) matters more for them than for Google.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with AI crawlers",
      answer:
        "The most common AI crawler mistakes are blocking a search bot when you meant to block training, trusting robots.txt while a CDN setting blocks the bots anyway, and assuming an AI-bot block can't touch Googlebot.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking GPTBot or ClaudeBot keeps me out of ChatGPT and Claude.",
              reality:
                "Both are training-only. ChatGPT search uses `OAI-SearchBot`; Claude's search uses `Claude-SearchBot` and `Claude-User`. They're separate rules, and blocking the training bots leaves you in both engines' answers.",
            },
            {
              myth: "If robots.txt allows a bot, it can reach my site.",
              reality:
                "CDN and firewall settings override robots.txt. From 15 September 2026, new Cloudflare domains block Training and Agent bots by default on pages that show ads, and Cloudflare's example of an Agent bot is `ChatGPT-User`.",
            },
            {
              myth: "A block-AI-training switch can't touch Googlebot.",
              reality:
                "Cloudflare says that from 15 September 2026, multi-purpose crawlers such as Googlebot, Applebot and Bingbot are blocked for customers who choose to block Training. That takes you out of Google Search and its AI features together.",
            },
            {
              myth: "Blocking Googlebot only costs me Google.",
              reality:
                "Brave Search, the index behind Claude's web search, won't crawl what Googlebot is disallowed from. A Googlebot block costs you Claude too. See the [Claude SEO guide](/ai-seo/claude).",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Three-Job Crawler Policy",
    summary:
      "Every AI bot does one of three jobs, and each job deserves one rule. Write your crawler policy job by job rather than bot by bot, and new bots slot into it without a rethink.",
    items: [
      {
        label: "Search index: allow",
        body: "`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` and `Googlebot` build the indexes answers are drawn from; blocking one removes you from that engine. **Rule:** allow in robots.txt and at the CDN, and verify hits against the vendor's IP list.",
      },
      {
        label: "Live fetch: allow",
        body: "`ChatGPT-User`, `Claude-User` and `Perplexity-User` read a page because a real person's question needed it. **Rule:** allow. If you must stop one, do it at the firewall, since OpenAI and Perplexity say robots.txt may not apply.",
      },
      {
        label: "Training: decide once, deliberately",
        body: "`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended` and `Applebot-Extended` shape what future models know. **Rule:** make one business decision and apply it to all of them, remembering that `Google-Extended` also switches off Gemini-app grounding.",
      },
      {
        label: "Access check: beyond robots.txt",
        body: "Rules count only if requests get through. **Rule:** after any change, request a key page with each search bot's user agent, confirm your key sentence is in the response, and recheck CDN bot settings after every plan or provider change.",
      },
    ],
    outcome:
      "Review the policy each quarter. Vendors keep adding bots — OpenAI's `OAI-AdsBot` for ad landing pages, Google's user-triggered `Google-Agent` — and each new one should land in an existing job, not an ad-hoc rule.",
  },

  related: [
    "robots-txt",
    "gptbot",
    "oai-searchbot",
    "claudebot",
    "perplexitybot",
    "google-extended",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Once the bots can reach you, Rankbox tracks whether ChatGPT, Perplexity, Claude and Google AI Overviews actually cite your brand — and which article earned each citation.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "Each engine's crawlers, index and robots.txt setup, compared side by side.",
    },
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "OpenAI's four bots, the robots.txt to copy, and the CDN settings that override it.",
    },
  ],
  sources: [
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
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
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
    },
    {
      title: "About Applebot",
      publisher: "Apple Support",
      href: "https://support.apple.com/en-us/119829",
    },
    {
      title: "CCBot",
      publisher: "Common Crawl",
      href: "https://commoncrawl.org/ccbot",
    },
    {
      title: "Your site, your rules: new AI traffic options for all customers",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/content-independence-day-ai-options/",
    },
    {
      title: "2025 Cloudflare Radar Year in Review",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/radar-2025-year-in-review/",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "Brave Search crawler",
      publisher: "Brave",
      href: "https://search.brave.com/help/brave-search-crawler",
    },
    {
      title: "Training data for the price of a sandwich: Common Crawl's impact on generative AI",
      publisher: "Mozilla Foundation",
      href: "https://www.mozillafoundation.org/en/research/library/generative-ai-training-data/common-crawl/",
    },
  ],
};
