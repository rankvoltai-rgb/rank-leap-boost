import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "snippet-controls",
  metaTitle: "What Are Snippet Controls? nosnippet, max-snippet & AI Overviews",
  metaDescription:
    "Snippet controls limit how much of a page search engines may quote. How nosnippet, max-snippet and data-nosnippet affect AI Overviews, Bing and other AI answers.",
  keywords: [
    "snippet controls",
    "nosnippet",
    "max-snippet",
    "data-nosnippet",
    "opt out of AI Overviews",
    "robots meta tag",
    "noarchive nocache Bing",
  ],

  whyItMatters:
    "One stray `nosnippet` in a template can quietly remove every page it touches from Google's AI Overviews and AI Mode, and most teams only notice when AI referrals dry up. Used on purpose, the same controls let you keep a sensitive passage — a negotiated price, a gated excerpt — out of AI answers without taking the page out of search.",

  questions: [
    {
      id: "how-they-work",
      question: "How do snippet controls work?",
      answer:
        "Snippet controls work as robots rules in a meta tag or `X-Robots-Tag` header — `nosnippet` and `max-snippet:[n]` apply to the whole page — or as a `data-nosnippet` attribute on individual elements, telling search engines how much text they may show or quote from that page.",
      blocks: [
        {
          kind: "code",
          lang: "html",
          code: '<!-- No text snippet anywhere, and no input to AI Overviews or AI Mode -->\n<meta name="robots" content="nosnippet">\n\n<!-- Cap snippets and AI input at 150 characters -->\n<meta name="robots" content="max-snippet:150">\n\n<!-- Let Google choose the snippet length and allow large image previews -->\n<meta name="robots" content="max-snippet:-1, max-image-preview:large">\n\n<!-- Keep one passage out while the rest of the page stays quotable -->\n<p>Plans start at $29 a month.</p>\n<div data-nosnippet>Enterprise pricing is negotiated per contract.</div>',
        },
        {
          kind: "code",
          lang: "http",
          code: "# The same rules as response headers, for PDFs and other non-HTML files\nX-Robots-Tag: nosnippet\nX-Robots-Tag: googlebot: max-snippet:150",
        },
        {
          kind: "list",
          items: [
            "**The strictest rule wins.** If a page carries both `max-snippet:50` and `nosnippet`, Google applies `nosnippet`.",
            "**`data-nosnippet` works only on `span`, `div` and `section` elements**, and an unclosed element hides everything after it. Don't add or remove it with JavaScript: Google may read it before or after rendering.",
            "**The crawler has to see the rule.** A page blocked in [robots.txt](/glossary/robots-txt) never has its meta tags read, so its snippet rules are ignored.",
            "**The same rules govern [featured snippets](/glossary/featured-snippet).** `nosnippet` or `data-nosnippet` keeps text out of them; a low `max-snippet` alone doesn't guarantee it.",
          ],
        },
      ],
    },
    {
      id: "ai-overviews",
      question: "Do snippet controls affect AI Overviews and AI Mode?",
      answer:
        "Snippet controls directly govern Google's AI Overviews and AI Mode: `nosnippet` stops a page being used as a direct input to them, `max-snippet` limits how much they may use, and `data-nosnippet` removes a passage. Google also requires a page to be snippet-eligible before it can appear as a supporting link at all.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s robots meta specification names the AI features outright. `nosnippet` "applies to all forms of search results (at Google: web search, Google Images, Discover, AI Overviews, AI Mode) and will also prevent the content from being used as a direct input for AI Overviews and AI Mode." `max-snippet` "will also limit how much of the content may be used as a direct input" to both.',
        },
        {
          kind: "table",
          head: ["Control", "AI Overviews & AI Mode", "Classic results", "Gemini app"],
          rows: [
            ["`nosnippet`", "Not used as input", "No text snippet", "Not documented"],
            [
              "`max-snippet:[n]`",
              "Input capped at n characters",
              "Snippet capped",
              "Not documented",
            ],
            ["`data-nosnippet`", "That passage excluded", "Passage excluded", "Not documented"],
            [
              "Search Console: Search generative AI → **Exclude**",
              "Removed",
              "Unaffected",
              "Not covered",
            ],
            ["`noindex`", "Removed", "Removed", "Removed"],
            [
              "`Google-Extended` disallowed",
              "Unaffected",
              "Unaffected",
              "Grounding and training off",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "A tiny max-snippet starves the model",
          text: "A value like `max-snippet:50` leaves Google's AI features almost nothing to ground a claim on. If you want AI visibility, use `max-snippet:-1` or no rule at all, and exclude sensitive passages with `data-nosnippet` instead.",
        },
      ],
    },
    {
      id: "opt-out",
      question: "How do you opt out of AI Overviews without leaving Google Search?",
      answer:
        "To opt out of AI Overviews without leaving Google Search, set Search Console's Search generative AI setting to Exclude, which since 31 August 2026 removes a property from AI Overviews, AI Mode and Discover's AI features while leaving regular results untouched. `nosnippet` also works, but strips your snippets everywhere.",
      blocks: [
        {
          kind: "table",
          head: ["Goal", "Best control", "Trade-off"],
          rows: [
            [
              "Leave AI Overviews and AI Mode, keep classic listings",
              "Search Console → Settings → Search generative AI: **Exclude**",
              "Per property; takes a few days; doesn't cover the Gemini app",
            ],
            [
              "Keep one passage out of every snippet and AI answer",
              "`data-nosnippet` on that element",
              "None for the rest of the page",
            ],
            [
              "Keep a page's text out of all Google snippets",
              "`nosnippet`",
              "A bare blue link in classic results too",
            ],
            [
              "Keep content out of Gemini-app grounding and training",
              "Disallow `Google-Extended` in robots.txt",
              "No effect on AI Overviews or Search",
            ],
            ["Remove the page from Google entirely", "`noindex`", "Gone from every Google surface"],
          ],
        },
        {
          kind: "p",
          text: "Google's caveat applies to all of them: the crawler has to see the change, and recrawling \"can take anywhere from several days to several months.\" Check what Googlebot received with URL Inspection in [Search Console](/glossary/google-search-console), and request a recrawl for pages that can't wait. See [Google-Extended](/glossary/google-extended) for the Gemini side and [AI Overviews](/glossary/ai-overviews) for how the feature picks sources.",
        },
      ],
    },
    {
      id: "other-engines",
      question: "Do Bing, ChatGPT, Claude and Perplexity honor snippet controls?",
      answer:
        "Bing has its own AI controls — `noarchive` keeps a page out of its AI chat answers and `nocache` limits them to the URL, title and snippet — while OpenAI, Anthropic and Perplexity document no snippet controls at all; for them, the levers are robots.txt and `noindex`.",
      blocks: [
        {
          kind: "table",
          head: ["Engine", "Control", "What it does"],
          rows: [
            [
              "Bing — Copilot",
              "`noarchive`",
              "Not included in or linked from Bing's AI chat answers, and not used to train Microsoft's generative models",
            ],
            [
              "Bing — Copilot",
              "`nocache`",
              "May appear in AI chat answers, but only as URL, title and snippet",
            ],
            ["Bing — Copilot", "Both together", "Treated as `nocache`"],
            [
              "ChatGPT search",
              "None documented",
              "OpenAI says to use `noindex` to keep a page out; a disallowed URL can still surface as a link and title",
            ],
            ["Claude", "None documented", "Each citation quotes up to 150 characters of the page"],
            [
              "Perplexity",
              "None documented",
              "Even with PerplexityBot blocked, it may show the domain, headline and a brief summary",
            ],
          ],
        },
        {
          kind: "p",
          text: "Bing announced its two controls in September 2023 for what was then Bing Chat. Note the split with Google, whose robots specification lists `noarchive` and `nocache` among rules it no longer uses — so a single robots meta tag can mean different things to different engines. For the AI engines with no snippet controls, crawler access is the real switch: see [AI crawlers](/glossary/ai-crawlers).",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with snippet controls",
      answer:
        "The most common snippet control mistakes are a `nosnippet` or tiny `max-snippet` left in a site-wide template, blocking a page in robots.txt so its rules are never read, relying on `Google-Extended` to leave AI Overviews, and wrapping so much in `data-nosnippet` that nothing quotable is left.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking Google-Extended keeps me out of AI Overviews.",
              reality:
                "It governs Gemini training and Gemini-app grounding only. For AI Overviews, use the Search Console setting, `nosnippet` or `noindex`.",
            },
            {
              myth: "A robots.txt Disallow is the safest way to hide content.",
              reality:
                "Google can index a blocked URL without its content, and it can't read snippet rules on a page it can't crawl. Allow the crawl and use `nosnippet` or `noindex`.",
            },
            {
              myth: "noarchive still controls Google's cached copies.",
              reality:
                "Google retired cached links and ignores `noarchive`. Bing, by contrast, uses it to keep pages out of its AI chat answers.",
            },
            {
              myth: "Snippet rules are set-and-forget.",
              reality:
                "Search your templates for `nosnippet`, low `max-snippet` values and `data-nosnippet` after every redesign. Each one throttles what AI features can use.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Snippet Control Ladder",
    summary:
      "Five controls ordered from the narrowest to the widest. Start at the lowest rung that solves the problem — each step up removes more of your content from answers you may still want to be in.",
    items: [
      {
        label: "Rung 1: data-nosnippet",
        body: "Hides one passage from snippets and AI input while the rest of the page stays quotable. For negotiated prices, internal notes and gated excerpts.",
      },
      {
        label: "Rung 2: max-snippet",
        body: "Caps how much text Google may quote or feed to its AI features. For licensed text where a short preview is fine — keep the number generous if you want to be cited.",
      },
      {
        label: "Rung 3: Search generative AI → Exclude",
        body: "Removes a property from AI Overviews, AI Mode and Discover's AI features but keeps classic results and snippets. A URL-prefix property can scope it to one folder.",
      },
      {
        label: "Rung 4: nosnippet",
        body: "No text snippet anywhere in Google and no AI input — the page becomes a bare link. On Bing, the AI-specific equivalents are `nocache` and `noarchive`.",
      },
      {
        label: "Rung 5: noindex",
        body: "Out of search entirely. The only rung documented to work beyond Google and Bing: OpenAI tells sites to use it to stay out of ChatGPT search, and it keeps pages out of Brave, Claude's search provider.",
      },
    ],
    outcome:
      "Most teams that need snippet controls at all need only rung 1. If an audit finds rung 2 or rung 4 in a site-wide template, treat it as a bug until someone can name the answer engine it was meant to keep out.",
  },

  related: [
    "ai-overviews",
    "google-extended",
    "featured-snippet",
    "robots-txt",
    "ai-mode",
    "google-search-console",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Snippet rules change what AI engines can quote, so check the result: Rankbox tracks where your brand is cited across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation.",
  },
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description: "Every Google control side by side, and what each one really switches off.",
    },
    {
      title: "Gemini SEO: the technical guide",
      href: "/ai-seo/gemini",
      description:
        "Why the Gemini app follows Google-Extended rather than the Search Console opt-out.",
    },
  ],
  sources: [
    {
      title: "Robots meta tag, data-nosnippet, and X-Robots-Tag specifications",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
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
      title: "Featured snippets and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/featured-snippets",
    },
    {
      title: "Announcing new options for webmasters to control usage of their content in Bing Chat",
      publisher: "Microsoft Bing",
      href: "https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat",
    },
    {
      title: "Publishers and developers FAQ",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/12627856-publishers-and-developers-faq",
    },
  ],
};
