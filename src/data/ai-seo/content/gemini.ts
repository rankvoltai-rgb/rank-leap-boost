import type { EngineGuide } from "../types";

export const gemini: EngineGuide = {
  slug: "gemini",
  metaTitle: "Gemini SEO: The Technical Guide to Google Gemini Citations",
  metaDescription:
    "How the Gemini app grounds answers in Google Search, what Google-Extended really blocks, why the Search Console AI opt-out doesn't cover Gemini, and how to track Gemini traffic.",
  keywords: [
    "Gemini SEO",
    "Google Gemini optimization",
    "get cited by Gemini",
    "Google-Extended Gemini",
    "Gemini grounding",
    "Gemini app citations",
  ],
  headline: { lead: "Gemini SEO:", accent: "the technical guide to Gemini citations" },
  subhead:
    "Gemini grounds its answers in the Google Search index — but it has its own opt-out, its own citation habits and no Search Console report. Here's how the Gemini app finds, cites and sends traffic to your pages.",

  shortAnswer:
    "To get cited by Gemini, your page must be indexed by Google (Gemini grounds its answers in the Google Search index), and your robots.txt must not disallow **Google-Extended**, which Google says controls grounding in the Gemini app as well as training. From there, Gemini favors the same helpful, non-commodity content as Google Search — but cites only about three sources per answer and names brands far more often than it links them.",

  takeaways: [
    "Gemini's grounding is retrieval from the Google Search index. Not indexed by Googlebot means not citable by Gemini.",
    "Disallowing `Google-Extended` opts you out of Gemini-app grounding and training — without affecting Search or AI Overviews.",
    "The new Search Console AI opt-out covers AI Overviews, AI Mode and Discover — not the Gemini app.",
    "Gemini cites about 3 sources per response, and mentions brands in text far more often than it links them.",
    "Ahrefs found only 6–9% of assistant citations rank in Google's top 10 for the prompt: fan-out decides what's retrieved.",
    "The Gemini app isn't in Search Console. Track it in GA4 — its AI Assistant channel names Gemini — and in logs.",
  ],

  facts: [
    { label: "Gemini app monthly users (Q2 2026)", value: "950M" },
    { label: "Grounded in", value: "Google's index" },
    { label: "The token that controls grounding", value: "Google-Extended", mono: true },
    { label: "Sources cited per answer", value: "~3" },
  ],

  preview: {
    prompt: "Which project management apps work best with Google Workspace?",
    status: "Grounded with Google Search",
    answer:
      "**Plannora** is a strong fit if your team lives in Google Workspace: it syncs tasks with Google Calendar, attaches Drive files natively, and has a free tier for up to five people.",
    sources: [
      { domain: "plannora.io", title: "Plannora for Google Workspace" },
      { domain: "stackreview.co", title: "Best Workspace-friendly PM tools" },
      { domain: "founderforum.net", title: "PM tools that don't fight Google Docs" },
    ],
  },

  profile: {
    retrieval: "The Google Search index, via Grounding with Google Search",
    searchCrawler: "Googlebot",
    trainingCrawler: "Google-Extended — also ends Gemini-app grounding",
    rendersJs: "Yes — Google renders JavaScript that isn't blocked",
    referrer: "gemini.google.com (AI Assistant channel)",
    citationStyle: "A Sources button and inline links; many answers carry none",
    biggestLever: "Be the indexed, non-commodity answer — and present on YouTube and forums",
  },

  sections: [
    {
      id: "how-gemini-grounds",
      title: "How Gemini grounds answers in Google Search",
      blocks: [
        {
          kind: "p",
          text: "Google defines grounding as \"providing content from the Google Search index to the model at prompt time to improve factuality and relevancy\" — in the Gemini app and in Grounding with Google Search on Vertex AI ([Google's crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)). There's no separate Gemini index to get into. If Googlebot hasn't indexed a page, Gemini can't ground on it.",
        },
        {
          kind: "p",
          text: 'How the consumer app decides when to search isn\'t published. The Gemini API describes the pattern: the model "analyzes the prompt and determines if a Google Search can improve the answer," then generates "one or multiple search queries" — the same fan-out Google uses in AI Mode.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Gemini decides whether Search would help",
              body: 'Time-sensitive, specific and factual questions trigger grounding; many creative or conversational ones don\'t. Google notes that "not all responses include related links or sources."',
            },
            {
              title: "It writes one or more search queries",
              body: "Like AI Mode, Gemini fans a question out into related searches. Ahrefs found over 80% of assistant citations don't rank at all for the original prompt — they rank for the sub-queries.",
              lever:
                "Cover the sub-questions around your topic with depth, not one thin page per variant.",
            },
            {
              title: "Google's ranking systems retrieve pages",
              body: "Candidates come from the Search index via Google's core ranking systems — the same systems behind AI Overviews. Pages blocked from `Google-Extended` are excluded from Gemini-app grounding.",
              lever:
                "Be indexed, and leave `Google-Extended` allowed if you want Gemini citations.",
            },
            {
              title: "Gemini answers and attaches sources",
              body: 'Sources appear behind a "Sources" button or as inline links, opening a side panel. When Gemini quotes a large amount of text from a page, it always links to that page.',
              lever:
                "Write specific, quotable passages — they're the ones that carry a guaranteed link.",
            },
            {
              title: "Deep Research and agents go further",
              body: "Deep Research \"can automatically browse up to hundreds of websites\" and is powered by Gemini 3. Agents that browse from Google's servers on a user's behalf identify as `Google-Agent`; Gemini in Chrome's auto browse works inside the user's own browser.",
              lever:
                "Keep pages agent-friendly: real buttons and links, labeled forms, no overlays.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "950M",
              label:
                "monthly active users of the Gemini app, with daily users tripling year on year",
              source: {
                name: "Alphabet Q2 2026",
                href: "https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/",
              },
            },
            {
              value: "13.2%",
              label:
                "of AI referral traffic came from Gemini in April 2026, up from 4.3% — second only to ChatGPT",
              source: {
                name: "BrightEdge, May 2026",
                href: "https://www.brightedge.com/news/press-releases/brightedge-data-gemini-second-largest-ai-referral-source-q1-2026",
              },
            },
            {
              value: "21.4%",
              label: "of Gemini's brand appearances carried a link — 83.7% were text mentions",
              source: {
                name: "Semrush × Growth Memo, Jun 2026",
                href: "https://www.semrush.com/blog/the-ghost-citations-study/",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Gemini reaches well beyond the Gemini app",
          text: "Gemini runs in Chrome (with auto browse for AI Pro and Ultra), on Android as the default assistant, and in Workspace. Apple's next Foundation Models are \"based on Google's Gemini models,\" powering the new Siri — but they run on Apple's own infrastructure, and there's no documented path from Siri answers to cited web pages. Don't count Siri as a Gemini citation channel yet.",
        },
      ],
    },
    {
      id: "controls",
      title: "Google-Extended and the other controls",
      blocks: [
        {
          kind: "p",
          text: 'This is where Gemini differs most from Google\'s Search features, and where most advice is wrong. `Google-Extended` isn\'t a crawler — "crawling is done with existing Google user agent strings" — it\'s a robots.txt token. Google says it controls training of future Gemini models **and** "grounding in Gemini Apps and Grounding with Google Search on Vertex AI," and that it "does not impact a site\'s inclusion in Google Search nor is it used as a ranking signal."',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "Googlebot",
              role: "search",
              purpose:
                "Builds the Search index Gemini grounds on. Blocking it removes you from Search, AI Overviews, AI Mode and Gemini alike.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Google-Extended",
              role: "training",
              purpose:
                "A robots.txt token governing Gemini training and grounding in the Gemini app and Vertex AI. Disallowing it costs you Gemini citations, not Search.",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "Google-Agent",
              role: "user",
              purpose:
                "Agents running on Google's infrastructure that act on a user's request. IPs in `user-triggered-agents.json`; Google is testing Web Bot Auth signing.",
              robots: "no",
              robotsNote: "User-triggered, so it generally ignores robots.txt.",
              advice: "allow",
            },
            {
              token: "Google-GeminiNotebook",
              role: "user",
              purpose:
                "Fetches URLs users add to Gemini Notebook (formerly NotebookLM). The old `Google-NotebookLM` agent was retired in August 2026.",
              robots: "no",
              robotsNote: "User-triggered, so it ignores robots.txt.",
              advice: "allow",
            },
          ],
        },
        {
          kind: "h3",
          text: "What each control switches off",
        },
        {
          kind: "table",
          head: ["Control", "Gemini app", "AI Overviews & AI Mode", "Google Search"],
          rows: [
            [
              "`Google-Extended` disallowed",
              "**Grounding & training off**",
              "Unaffected",
              "Unaffected",
            ],
            [
              "Search Console → Search generative AI: Exclude",
              "**Not covered**",
              "Removed",
              "Unaffected",
            ],
            [
              "`nosnippet` / `max-snippet`",
              "Not documented",
              "Input removed / capped",
              "Snippet removed / capped",
            ],
            ["`noindex`", "Removed", "Removed", "Removed"],
            ["Googlebot disallowed", "Removed", "Removed", "Removed"],
          ],
        },
        {
          kind: "p",
          text: "So the two AI opt-outs are mirror images: the Search Console control (live worldwide since 31 August 2026) takes you out of AI Overviews and AI Mode but not Gemini; `Google-Extended` takes you out of Gemini but not AI Overviews. To stay in Search and its AI features while leaving Gemini:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Search, AI Overviews and AI Mode\nUser-agent: Googlebot\nAllow: /\n\n# Opts out of Gemini-app grounding AND Gemini training.\n# Leave this out if you want to be cited by Gemini.\nUser-agent: Google-Extended\nDisallow: /",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Robots.txt can't stop Gemini's agents",
          text: "`Google-Agent` and the Gemini Notebook fetcher act for a user and generally ignore robots.txt. To control them, verify and filter at the WAF by Google's published IP ranges — which moved to `developers.google.com/crawling/ipranges/` in March 2026; the old paths redirect for six months, so update allowlists now.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "Because grounding rides on the Search index, Gemini's technical bar is Google's. Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) is written for AI Overviews and AI Mode, but nothing suggests the Gemini app differs on these points.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Indexed by Google",
              status: "required",
              note: "Confirm in Search Console's URL Inspection. There's no other way into Gemini's grounding pool.",
            },
            {
              label: "Google-Extended allowed",
              status: "required",
              note: 'For Gemini-app grounding specifically. Check robots.txt on every subdomain, and any "block AI" presets your CDN adds.',
            },
            {
              label: "Key content in the first 2 MB",
              status: "required",
              note: 'Googlebot fetches the first 2 MB of HTML; anything after is "not fetched… not rendered… not indexed." Put head tags and main content early; avoid huge inline scripts and base64 images.',
            },
            {
              label: "JavaScript rendering",
              status: "helps",
              note: "Google's renderer runs JavaScript \"similar to a modern browser,\" but it's stateless and slower than HTML. Server-render critical text, and don't rely on local storage.",
            },
            {
              label: "Merchant Center feed",
              status: "helps",
              note: "Gemini shops from the Shopping Graph with agentic checkout. UCP checkout needs Merchant Center and the `native_commerce` attribute (US, CA, AU; early access).",
            },
            {
              label: "Google Business Profile",
              status: "helps",
              note: 'Google says Business Profile and Merchant Center "can help your products and services to be visible in… AI responses."',
            },
            {
              label: "Agent-friendly markup",
              status: "helps",
              note: "Real `<button>` and `<a>` elements, labeled fields, stable layouts, no invisible overlays — agents read the DOM and accessibility tree.",
            },
            {
              label: "Structured data",
              status: "no-effect",
              note: 'Google: "not required… no special schema.org markup" for AI features. Keep it valid and matching the page for rich results.',
            },
            {
              label: "llms.txt",
              status: "no-effect",
              note: 'Google Search "doesn\'t use them" and says they "neither harm nor help." Nothing suggests the Gemini app differs.',
            },
            {
              label: "Snippet controls",
              status: "unconfirmed",
              note: "`nosnippet` and `max-snippet` are documented for AI Overviews and AI Mode only. Their effect on the Gemini app isn't stated.",
            },
          ],
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What Gemini cites",
      blocks: [
        {
          kind: "p",
          text: "Studies of Gemini's sources disagree more than for any other engine — largely because they use different prompt sets. Read them together and a consistent picture emerges: Google's quality systems pick the candidates, Gemini cites few of them, and the ones it cites lean either towards institutions or towards forums and video depending on the kind of question.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Google's core ranking",
              body: "Grounding retrieves from the Search index via core ranking systems. Helpful, reliable, people-first content and E-E-A-T apply unchanged.",
              evidence: "official",
            },
            {
              title: "Non-commodity content",
              body: "Google calls first-hand, unique content the biggest long-run factor for its AI features. Generic answers are what the model already knows.",
              evidence: "official",
            },
            {
              title: "Forums and video",
              body: "In Ahrefs' 3M-query study, Reddit took 28.5% of Gemini's top-50-domain citations, YouTube 14.6% and Wikipedia 8.8%.",
              evidence: "observed",
            },
            {
              title: "Institutions",
              body: "BrightEdge found the opposite mix on its prompts: authority sources 26% of citations and user-generated content 0.2%. Health, finance and B2B queries lean this way.",
              evidence: "observed",
            },
            {
              title: "Few links, many mentions",
              body: "Gemini cites about 3 sources per response against ChatGPT's 15, and names brands in text far more than it links them. Being mentioned is half the game.",
              evidence: "observed",
            },
            {
              title: "Freshness and entities",
              body: "Freshness weighting and Knowledge Graph strength plausibly drive Gemini's unlinked brand mentions, but neither is documented or measured directly.",
              evidence: "our-read",
            },
          ],
        },
      ],
    },
    {
      id: "measurement",
      title: "Tracking Gemini traffic",
      blocks: [
        {
          kind: "p",
          text: "The Gemini app doesn't appear in Search Console at all — the new Generative AI report covers AI Overviews and AI Mode only. Gemini is measured in analytics. Since 13 May 2026, GA4's default **AI Assistant** channel groups Gemini referrals automatically (Google names Gemini in the definition). Before that date, and as a backstop, look for `gemini.google.com / referral` — or `bard.google.com` in older data.",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — Gemini app\n^(gemini\\.google\\.com|bard\\.google\\.com)$\n\n# All major AI assistants\ngemini\\.google\\.com|chatgpt\\.com|perplexity\\.ai|copilot\\.microsoft\\.com|claude\\.ai",
        },
        {
          kind: "list",
          items: [
            "**Some Gemini traffic loses its referrer** — practitioners report it when Gemini runs as the Android assistant or inside Google apps — and lands in Direct or Organic.",
            "**AI Overviews and AI Mode clicks are not in this channel.** They arrive from google.com as Organic Search; see the [AI Overviews guide](/ai-seo/google-ai-overviews) for those.",
            "**Mentions need their own tracking.** With links on barely a fifth of brand appearances, a prompt panel that records unlinked mentions shows far more of your Gemini visibility than analytics can.",
            "**In logs**, watch for `Google-Agent` and `Google-GeminiNotebook` and verify them against Google's new IP-range files.",
          ],
        },
      ],
    },
    {
      id: "myths",
      title: "Myths worth dropping",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking Google-Extended hurts rankings or removes you from AI Overviews.",
              reality:
                'It does neither. It governs Gemini-app and Vertex grounding plus Gemini training, and Google says it "is not used as a ranking signal."',
            },
            {
              myth: "The Search Console AI opt-out keeps you out of Gemini.",
              reality:
                "It covers AI Overviews, AI Mode and generative AI in Discover only. For the Gemini app, the lever is `Google-Extended`.",
            },
            {
              myth: "Gemini just cites the top organic results.",
              reality:
                "Ahrefs found only 6–9% of Gemini-, ChatGPT- and Copilot-cited links rank in Google's top 10 for the prompt. Fan-out sub-queries decide it.",
            },
            {
              myth: "Gemini clicks show up in Search Console.",
              reality:
                "They don't. Use GA4's AI Assistant channel and a `gemini.google.com` source filter.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "indexed",
      title: "Confirm Googlebot can crawl and index key URLs",
      detail: "robots.txt, CDN/WAF bot rules and URL Inspection on your top pages.",
      impact: "high",
    },
    {
      id: "extended",
      title: "Decide on Google-Extended deliberately",
      detail:
        "Disallowing it opts you out of Gemini-app grounding as well as training. Leave it allowed if you want Gemini citations.",
      impact: "high",
    },
    {
      id: "sc-include",
      title: "Keep Search Console's Search generative AI setting on Include",
      detail:
        "It doesn't affect Gemini, but it does affect AI Overviews and AI Mode — the same content, the same index.",
      impact: "medium",
    },
    {
      id: "snippets",
      title: "Remove accidental nosnippet and tiny max-snippet values",
      detail: "Use `data-nosnippet` surgically, on passages you truly don't want quoted.",
      impact: "medium",
    },
    {
      id: "2mb",
      title: "Keep head tags and main content in the first 2 MB",
      detail: "Server-render critical text; avoid huge inline JS/CSS and base64 images.",
      impact: "medium",
    },
    {
      id: "non-commodity",
      title: "Publish first-hand, non-commodity content",
      detail:
        "Clear H2/H3 sections that cover the sub-questions naturally — no scaled page variants.",
      impact: "high",
    },
    {
      id: "presence",
      title: "Build real presence where Gemini draws sources",
      detail:
        "Reddit, YouTube, review sites and Wikipedia where you're notable — never fake mentions.",
      impact: "medium",
    },
    {
      id: "youtube",
      title: "Make YouTube videos that stand alone",
      detail: "Accurate titles, descriptions, chapters and transcripts.",
      impact: "medium",
    },
    {
      id: "merchant",
      title: "E-commerce: complete your Merchant Center feed",
      detail: "Apply for UCP checkout (`native_commerce`) if you're eligible.",
      impact: "medium",
    },
    {
      id: "gbp",
      title: "Local: maintain your Google Business Profile",
      detail: "Hours, categories, attributes and reviews.",
      impact: "medium",
    },
    {
      id: "schema",
      title: "Keep structured data valid and matching the page",
      detail:
        "Product, Organization, LocalBusiness and Article markup — for rich results, not for AI eligibility.",
      impact: "low",
    },
    {
      id: "agents",
      title: "Make pages agent-friendly",
      detail:
        "Semantic controls, labeled forms, no overlays. Don't block verified `Google-Agent` traffic at the WAF.",
      impact: "low",
    },
    {
      id: "ipranges",
      title: "Update WAF allowlists to Google's new IP-range paths",
      detail: "`developers.google.com/crawling/ipranges/` — before the old paths stop redirecting.",
      impact: "medium",
    },
    {
      id: "measure",
      title: "Set up measurement",
      detail:
        "GA4's AI Assistant channel plus the `gemini.google.com` regex, log monitoring, and a prompt panel that records mentions separately from citations.",
      impact: "high",
    },
  ],

  faqs: [
    {
      q: "Does blocking Google-Extended remove me from Gemini?",
      a: "Per Google's crawler documentation, disallowing `Google-Extended` stops your content being used for grounding in the Gemini app and for training future Gemini models. It doesn't affect your inclusion or ranking in Google Search.",
    },
    {
      q: "Does blocking Google-Extended remove me from AI Overviews or AI Mode?",
      a: "No. Those are governed by Googlebot and by Search Console's Search generative AI setting, plus `nosnippet`, `max-snippet` and `noindex`.",
    },
    {
      q: "Does the Search Console AI opt-out cover the Gemini app?",
      a: "No. It covers AI Overviews, AI Mode and generative AI features in Discover. For the Gemini app, the control is `Google-Extended`.",
    },
    {
      q: "How do I get my website cited by Gemini?",
      a: "Be indexed by Google, leave `Google-Extended` allowed, and publish first-hand content that answers the sub-questions around your topic. Because Gemini cites only about three sources and mentions brands more than it links them, presence on YouTube, forums and review sites helps too.",
    },
    {
      q: "Do I need to rank #1 to be cited by Gemini?",
      a: "No. Ahrefs found only 6–9% of links cited by Gemini, ChatGPT and Copilot rank in Google's top 10 for the prompt — they rank for the related sub-queries Gemini generates instead.",
    },
    {
      q: "How do I see traffic from Gemini?",
      a: "In GA4's AI Assistant channel, added in May 2026, or with a session source filter on `gemini.google.com`. The Gemini app isn't reported in Search Console, and some app traffic arrives without a referrer.",
    },
    {
      q: "Can I block Gemini's browsing agents with robots.txt?",
      a: "No. `Google-Agent` and the Gemini Notebook fetcher are user-triggered and generally ignore robots.txt. Filter them at the WAF using Google's published IP ranges or Web Bot Auth instead.",
    },
    {
      q: "Does Gemini use llms.txt or schema markup?",
      a: "Google Search ignores llms.txt and requires no special schema for AI features, and nothing official says the Gemini app differs. Keep structured data for rich results.",
    },
  ],

  sources: [
    {
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
    },
    {
      title: "Google user-triggered fetchers (Google-Agent)",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/google-user-triggered-fetchers",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Search generative AI control",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/16908024",
    },
    {
      title: "Grounding with Google Search",
      publisher: "Gemini API",
      href: "https://ai.google.dev/gemini-api/docs/google-search",
    },
    {
      title: "View related sources in Gemini Apps",
      publisher: "Gemini Apps Help",
      href: "https://support.google.com/gemini/answer/14143489",
    },
    {
      title: "Gemini Deep Research",
      publisher: "Google",
      href: "https://gemini.google/overview/deep-research/",
    },
    {
      title: "Googlebot's 2 MB fetch limit and rendering",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/03/crawler-blog-post",
    },
    {
      title: "Google crawler IP ranges have moved",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/03/crawler-ip-ranges",
    },
    {
      title: "Alphabet Q2 2026 earnings remarks",
      publisher: "Alphabet",
      href: "https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/",
    },
    {
      title: "Joint statement from Google and Apple",
      publisher: "Google",
      href: "https://blog.google/company-news/inside-google/company-announcements/joint-statement-google-apple/",
    },
    {
      title: "UCP checkout eligibility",
      publisher: "Merchant Center Help",
      href: "https://support.google.com/merchants/answer/16837055",
    },
    {
      title: "Building agent-friendly websites",
      publisher: "web.dev",
      href: "https://web.dev/articles/ai-agent-site-ux",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "AI search overlap with Google's top 10",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "The most-cited domains in Gemini",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/most-cited-domains-gemini/",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "Same brands, different sources",
      publisher: "BrightEdge",
      href: "https://www.brightedge.com/resources/weekly-ai-search-insights/ai-search-same-brands-different-sources",
    },
    {
      title: "Gemini becomes the second-largest AI referral source",
      publisher: "BrightEdge",
      href: "https://www.brightedge.com/news/press-releases/brightedge-data-gemini-second-largest-ai-referral-source-q1-2026",
    },
  ],

  sameAs: ["https://en.wikipedia.org/wiki/Google_Gemini", "https://gemini.google.com"],

  furtherReading: [
    {
      title: "Google AI Overviews & AI Mode SEO guide",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Same index, different controls: the eligibility switches, snippet rules and Search Console report for Google's AI in Search.",
    },
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Make a deliberate call on Google-Extended — and every other AI token — without touching Googlebot.",
    },
  ],
};
