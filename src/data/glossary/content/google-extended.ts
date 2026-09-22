import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "google-extended",
  metaTitle: "What Is Google-Extended? What It Blocks, and What It Doesn't",
  metaDescription:
    "Google-Extended is a robots.txt token that opts content out of Gemini training and Gemini-app grounding. It doesn't affect Search, AI Overviews or AI Mode.",
  keywords: [
    "Google-Extended",
    "what is Google-Extended",
    "Google-Extended robots.txt",
    "block Google-Extended",
    "Google-Extended AI Overviews",
    "Google-Extended Gemini",
    "opt out of Gemini training",
  ],

  whyItMatters:
    "Google-Extended is the most misunderstood line in robots.txt: people add it to stay out of AI Overviews, which it doesn't do, and don't realize it takes them out of the Gemini app's answers, which it does. For a small team, one wrong assumption here either leaves you in the AI feature you meant to leave or quietly costs you citations in an app with hundreds of millions of monthly users.",

  questions: [
    {
      id: "what-it-controls",
      question: "What does Google-Extended control?",
      answer:
        "Google-Extended controls whether content Google crawls from your site may be used to train future Gemini models and to ground answers in the Gemini app and Vertex AI; it does not affect Google Search, AI Overviews or AI Mode, and Google says it isn't a ranking signal.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s [crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) calls it "a standalone product token" for managing whether content "may be used for training future generations of Gemini models that power Gemini Apps and Vertex AI API for Gemini and for grounding in Gemini Apps and Grounding with Google Search on Vertex AI." The same page is explicit about Search: "Google-Extended does not impact a site\'s inclusion in Google Search nor is it used as a ranking signal in Google Search."',
        },
        {
          kind: "table",
          head: ["Disallow Google-Extended and…", "Effect"],
          rows: [
            ["Training of future Gemini models", "**Opted out**"],
            ["Grounding in the Gemini app (its cited sources)", "**Opted out**"],
            ["Grounding with Google Search on Vertex AI", "**Opted out**"],
            ["Google Search inclusion and rankings", "Unaffected"],
            ["AI Overviews and AI Mode", "Unaffected"],
          ],
        },
        {
          kind: "p",
          text: "Grounding is the part people miss. The Gemini app answers current questions by retrieving pages from Google's index, and a page behind a Google-Extended block can't be one of them. See [grounding](/glossary/grounding) and the [Gemini SEO guide](/ai-seo/gemini).",
        },
      ],
    },
    {
      id: "ai-overviews",
      question: "Does blocking Google-Extended remove you from AI Overviews?",
      answer:
        "Blocking Google-Extended does not remove you from AI Overviews or AI Mode, because Google's AI features in Search are governed by Googlebot; to leave them, use Search Console's Search generative AI setting, `nosnippet` or `noindex`.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s [AI features documentation](https://developers.google.com/search/docs/appearance/ai-features) explains why: "AI is built into Search and integral to how Search functions, which is why robots.txt directives for Googlebot is the control." Blocking Googlebot would take you out of Search entirely, so the narrower switches below are the ones to use.',
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
          text: "The two AI opt-outs are mirror images. The Search Console control, live worldwide since 31 August 2026, removes a property from AI Overviews and AI Mode but not the Gemini app; Google-Extended removes you from the Gemini app but not AI Overviews. See [AI Overviews](/glossary/ai-overviews) and [snippet controls](/glossary/snippet-controls).",
        },
      ],
    },
    {
      id: "vs-googlebot",
      question: "Google-Extended vs Googlebot: what's the difference?",
      answer:
        "Google-Extended is only a robots.txt token with no user agent of its own, while Googlebot is the crawler that actually fetches your pages for Search and its AI features; Google-Extended just tells Google how content Googlebot already crawled may be used for Gemini.",
      blocks: [
        {
          kind: "crawlers",
          bots: [
            {
              token: "Googlebot",
              role: "search",
              purpose:
                "Builds the Search index behind Google Search, AI Overviews, AI Mode and Gemini grounding. Blocking it removes you from all four.",
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
          ],
        },
        {
          kind: "p",
          text: "Google says so directly: \"Google-Extended doesn't have a separate HTTP request user agent string. Crawling is done with existing Google user agent strings; the robots.txt user-agent token is used in a control capacity.\" Two practical consequences follow. You will never see Google-Extended in your server logs. And blocking it doesn't reduce crawl load, because Googlebot keeps visiting either way — the token only changes what Google may do with what it fetched.",
        },
      ],
    },
    {
      id: "should-i-block",
      question: "Should I block Google-Extended?",
      answer:
        "Block Google-Extended only if keeping your content out of Gemini training matters more than being cited in the Gemini app, because Google ties the two together: one token opts you out of both, while Search, AI Overviews and AI Mode are unaffected either way.",
      blocks: [
        {
          kind: "p",
          text: "The Gemini app had 950 million monthly users in the second quarter of 2026, per Alphabet, and studies find it cites only about three sources per answer, so each citation is scarce. For a business that wants to be recommended, a Google-Extended block trades those citations for a training opt-out. For a publisher whose content is the product, that trade can be worth it.",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Search, AI Overviews and AI Mode\nUser-agent: Googlebot\nAllow: /\n\n# Opts out of Gemini-app grounding AND Gemini training.\n# Leave this out if you want to be cited by Gemini.\nUser-agent: Google-Extended\nDisallow: /",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Check what your * group says",
          text: "Google-Extended is matched like any other robots.txt token, so without a group of its own it falls back to `User-agent: *`. Under standard matching, a site that disallows everything under `*` and allows only Googlebot by name has opted out of Gemini as well. Give Google-Extended an explicit group so the choice is deliberate.",
        },
      ],
    },
    {
      id: "check",
      question: "How do I check whether Google-Extended is working?",
      answer:
        "Google-Extended can't be checked in server logs because it never visits — Googlebot does the crawling — so the check is reading your robots.txt the way Google does: find the group the `Google-Extended` token matches on every host, and confirm it allows or disallows what you intend.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Open `/robots.txt` on every host**, including `www`, the bare domain and each subdomain. Rules apply only to the host that serves them.",
            "**Find the group that matches `Google-Extended`:** its own group if one exists, otherwise `User-agent: *`. Google never combines a named group with the `*` group.",
            "**Read the file as served, not as committed.** Cloudflare's managed robots.txt prepends rules to your file, including a disallow for `Google-Extended` — which opts you out of Gemini-app grounding, not just training.",
            "**Check the effect where it lands.** Run your key buyer questions in the Gemini app and see whether your pages appear among its sources. That's the only visible result of the token.",
          ],
        },
        {
          kind: "p",
          text: "Changes aren't instant: Google generally caches robots.txt for up to 24 hours. And because the token covers only future training and grounding, it won't pull your pages out of models trained before the change. See [robots.txt](/glossary/robots-txt) for how groups are matched.",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Google AI Control Map",
    summary:
      "Google gives site owners four separate switches, and each covers a different surface. Decide which surface you want to leave, then use the one switch that covers it and nothing more.",
    items: [
      {
        label: "Googlebot: everything",
        body: "Disallowing it removes you from Search, AI Overviews, AI Mode and Gemini grounding at once. **Use:** almost never.",
      },
      {
        label: "Search Console Exclude: AI in Search",
        body: "Search Console → Settings → Search generative AI removes a property from AI Overviews, AI Mode and Discover's AI features, with regular results untouched. **Use:** to leave AI answers in Search without leaving Search.",
      },
      {
        label: "Snippet controls: specific passages",
        body: "`nosnippet`, `max-snippet` and `data-nosnippet` limit what AI Overviews and AI Mode may quote, and limit your classic snippets too. **Use:** to keep particular text out of answers.",
      },
      {
        label: "Google-Extended: Gemini",
        body: "Opts out of Gemini training and of grounding in the Gemini app and Vertex AI, with Search and its AI features untouched. **Use:** to keep content out of Gemini specifically.",
      },
    ],
    outcome:
      "Most sites need none of the four. If you do, write down which surface you're leaving before touching a file: the classic mistake is reaching for Google-Extended to solve an AI Overviews problem, or for the Search Console control to solve a Gemini one.",
  },

  related: [
    "ai-overviews",
    "robots-txt",
    "snippet-controls",
    "grounding",
    "ai-crawlers",
    "google-search-console",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Google-Extended decides the Gemini app, but AI Overviews run on Googlebot. Rankbox tracks whether Google AI Overviews, ChatGPT, Perplexity and Claude cite your brand, and which article earned each citation.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "Gemini SEO: the technical guide",
      href: "/ai-seo/gemini",
      description:
        "How the Gemini app grounds answers in Google Search, and what Google-Extended really switches off.",
    },
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "The eligibility switches, the Search Console AI control and the snippet rules for Google's AI in Search.",
    },
  ],
  sources: [
    {
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
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
      title: "How Google interprets the robots.txt specification",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt",
    },
    {
      title: "Control content use for AI training with Cloudflare's managed robots.txt",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/control-content-use-for-ai-training/",
    },
    {
      title: "Alphabet Q2 2026 earnings remarks",
      publisher: "Alphabet",
      href: "https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/",
    },
  ],
};
