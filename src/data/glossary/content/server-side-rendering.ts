import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "server-side-rendering",
  metaTitle: "What Is Server-Side Rendering (SSR)? Why AI Crawlers Need It",
  metaDescription:
    "Server-side rendering puts a page's full HTML in the first response. Why most AI crawlers can't read client-rendered pages, and how to test yours in a minute.",
  keywords: [
    "server-side rendering",
    "SSR",
    "what is server-side rendering",
    "SSR vs CSR",
    "do AI crawlers render JavaScript",
    "JavaScript SEO",
    "prerendering",
  ],

  whyItMatters:
    "If your site is a JavaScript app, Google may still read your content while ChatGPT, Claude and Perplexity see an empty page — and nothing gets cited from an empty page. For a small team this is the rare technical fix with an outsized payoff: one rendering change can make every article you've already published readable to the AI engines your buyers ask.",

  questions: [
    {
      id: "how-it-works",
      question: "How does server-side rendering work?",
      answer:
        "Server-side rendering works by running the page's code on the server, per request or at build time, so the HTML that arrives already contains the text, links and metadata — instead of an empty shell that JavaScript fills in later in the browser.",
      blocks: [
        {
          kind: "p",
          text: "In a client-side rendered (CSR) app, the server sends a near-empty HTML document plus a bundle of JavaScript; the browser runs the script, fetches the data and builds the page. A person never notices. A crawler that reads only the first response sees the shell. Server rendering moves that work to the server, and the browser then **hydrates** the page — attaches the JavaScript that makes it interactive — without changing what the HTML already said.",
        },
        {
          kind: "table",
          head: ["Approach", "When the HTML is built", "What a non-rendering crawler sees"],
          rows: [
            [
              "**Client-side rendering (CSR)**",
              "In the browser, after JavaScript runs",
              "An empty shell, often a single `<div>`",
            ],
            ["**Server-side rendering (SSR)**", "On the server, for each request", "The full page"],
            ["**Static generation (SSG)**", "At build time, served as files", "The full page"],
            [
              "**Incremental regeneration**",
              "At build time, then rebuilt on a schedule or on change",
              "The full page, as of the last rebuild",
            ],
            [
              "**Prerendering for bots**",
              "By a headless browser, cached and served to crawlers",
              "The full page, if the cache is current",
            ],
          ],
        },
        {
          kind: "p",
          text: "Frameworks such as Next.js, Nuxt, SvelteKit, Astro and Remix support server rendering or static generation out of the box, and traditional platforms like WordPress and Shopify build HTML on the server. The risk sits mainly with single-page apps built on plain React, Vue or Angular, and with pages that load their main copy through a widget or API call after the page arrives.",
        },
      ],
    },
    {
      id: "ai-crawlers-javascript",
      question: "Do AI crawlers render JavaScript?",
      answer:
        "Most AI crawlers do not render JavaScript: OpenAI's, Anthropic's and Perplexity's bots read the raw HTML response, so text that appears only after scripts run is invisible to them. Googlebot, which also feeds Gemini and AI Overviews, does render JavaScript, and so does Applebot.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "None",
              label:
                "of the major AI crawlers executed JavaScript in a study of Vercel's network — OpenAI, Anthropic, Meta, ByteDance and Perplexity included",
              source: {
                name: "Vercel & MERJ, Dec 2024",
                href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
              },
            },
            {
              value: "23.84%",
              label:
                "of Claude's crawler requests downloaded JavaScript files it then didn't run (ChatGPT's: 11.50%)",
              source: {
                name: "Vercel & MERJ, Dec 2024",
                href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
              },
            },
            {
              value: "~28%",
              label:
                "GPTBot, Claude, Applebot and PerplexityBot's combined fetches as a share of Googlebot's volume",
              source: {
                name: "Vercel & MERJ, Dec 2024",
                href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
              },
            },
          ],
        },
        {
          kind: "table",
          head: ["Engine", "Crawler that reads your page", "Runs JavaScript?"],
          rows: [
            [
              "Google Search, [AI Overviews](/glossary/ai-overviews), AI Mode, Gemini",
              "`Googlebot`",
              "Yes — queued, with a 2 MB HTML limit",
            ],
            [
              "ChatGPT search",
              "`OAI-SearchBot`, `ChatGPT-User`",
              "No — undocumented by OpenAI, none observed",
            ],
            [
              "Claude",
              "`Claude-SearchBot`, `Claude-User`",
              "No — Anthropic's fetch tool doesn't support JavaScript-rendered sites",
            ],
            [
              "Perplexity",
              "`PerplexityBot`, `Perplexity-User`",
              "No — failed on client-rendered pages in tests",
            ],
            ["Apple", "`Applebot`", "Yes — a browser-based crawler"],
          ],
        },
        {
          kind: "p",
          text: 'In August 2025 [Glenn Gabe tested](https://www.gsqi.com/marketing-blog/ai-search-javascript-rendering/) ChatGPT, Claude and Perplexity against client-rendered URLs and all three failed to read them, while server-rendered pages worked. Google hedges too: its own JavaScript guide says server-side or pre-rendering "is still a great idea" because "not all bots can run JavaScript." See [AI crawlers](/glossary/ai-crawlers) for what each bot is for.',
        },
      ],
    },
    {
      id: "ssr-vs-csr",
      question: "Server-side rendering vs client-side rendering: what's the difference for SEO?",
      answer:
        "Client-side rendering asks every crawler to execute JavaScript before it can read the page, while server-side rendering hands over finished HTML. For Google the gap is speed and reliability, because rendering is queued; for most AI engines it is the difference between being readable and not existing.",
      blocks: [
        {
          kind: "p",
          text: 'Googlebot crawls a URL, then queues it for rendering in an evergreen, headless Chromium. Google says a page "may stay on this queue for a few seconds, but it can take longer than that," and the renderer is stateless: it clears local storage and session data between requests. Copy that depends on a cookie-banner click, a logged-in state or a scroll event may never appear to it.',
        },
        {
          kind: "p",
          text: 'Two limits apply even to Google. Googlebot fetches only the first **2 MB** of a page\'s HTML, and bytes past the cut-off are "not fetched… not rendered… not indexed." And a `noindex` in the initial HTML can stop rendering entirely, so JavaScript written to remove it may never run.',
        },
        {
          kind: "p",
          text: "The practical split: keep interactive widgets client-side if you like, but make sure the server HTML already carries everything a crawler needs — the [title tag](/glossary/title-tag), meta description, [canonical tag](/glossary/canonical-tag), robots meta, the main text, internal links as real `<a href>` elements, visible dates and any JSON-LD.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Bot-only prerendering is a stopgap",
          text: 'Serving prerendered HTML only to crawlers, chosen by user agent, is what Google calls dynamic rendering. Its documentation now describes it as "a workaround and not a long-term solution" and recommends server-side rendering, static rendering or hydration instead — one version of the page for everyone.',
        },
      ],
    },
    {
      id: "how-to-test",
      question: "How do you check whether a page is server-side rendered?",
      answer:
        "Check server-side rendering by fetching the raw HTML the way a non-rendering crawler does — with `curl` or View Source, not the browser's inspector — and searching it for a sentence from the page's main content. If the sentence is missing, AI crawlers can't see it either.",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: '# What ChatGPT\'s search crawler receives. Use a real bot user agent:\n# a firewall can serve bots something different from browsers.\ncurl -s -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n\n# The same check as Claude\'s live fetcher\ncurl -s -A "Claude-User" https://yoursite.com/pricing | grep -c "Plans start at"\n\n# 0 = the text is rendered client-side, or a WAF served a challenge',
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Use View Source, not Inspect.** The element inspector shows the page after JavaScript ran; `view-source:` shows what a crawler receives.",
            "**Disable JavaScript** in your browser's developer tools and reload. What's left is roughly what a non-rendering bot reads.",
            "**Compare with Google's view** in [Search Console](/glossary/google-search-console): URL Inspection → View crawled page shows the rendered HTML Googlebot indexed.",
            "**Test each template, not one page.** Blog posts, pricing, docs and comparison pages often take different rendering paths.",
          ],
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with server-side rendering",
      answer:
        "The most common server-side rendering mistakes are assuming Google's rendering covers every engine, serving prerendered pages only to bots, and server-rendering the body while still injecting canonicals, schema and links with JavaScript.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Google renders JavaScript, so SSR no longer matters.",
              reality:
                "Google does, with a queue and a 2 MB limit. ChatGPT, Claude and Perplexity don't — so a client-rendered page can rank on Google and still never be cited by them.",
            },
            {
              myth: "If the body text is in the HTML, the job is done.",
              reality:
                "Canonicals, robots meta, JSON-LD and navigation added by a script or tag manager are just as invisible to non-rendering bots. Google can read injected JSON-LD; a bot that runs no scripts can't.",
            },
            {
              myth: "A server-rendered page is always what the bot gets.",
              reality:
                "A CDN challenge or bot-protection rule can hand AI crawlers an interstitial instead. Test with their user agents, and check your firewall's AI-bot settings.",
            },
            {
              myth: "Rendering fixes are a one-time project.",
              reality:
                "A redesign, a new CMS block or a framework upgrade can quietly move copy back to the client. Re-run the raw-HTML check after every front-end release.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Raw-HTML Visibility Ratio",
    summary:
      "A quick way to put a number on how much of a page non-rendering AI crawlers can read: compare the words in the raw HTML with the words a reader sees, then check the facts that matter. The inputs below are illustrative, for a fictional project-management app called Plannora — run the same steps on your own templates.",
    items: [
      {
        label: "Count the words a reader sees",
        body: "Open Plannora's pricing page in a browser and count the visible body copy: plan names, prices, the feature list and the FAQ.",
        value: "1,200 words",
      },
      {
        label: "Count the words in the raw HTML",
        body: "Fetch the page with `curl` and strip the tags. The shell holds the navigation, the footer and a loading message; the pricing table and FAQ arrive by JavaScript after load.",
        value: "180 words",
      },
      {
        label: "Check the facts a buyer verifies",
        body: "Search the raw HTML for five facts: starting price, free-tier limit, per-seat price, trial length and refund policy. Only the refund policy, linked in the footer, is there.",
        value: "1 of 5 facts",
      },
      {
        label: "Visibility ratio",
        body: "180 ÷ 1,200 — the share of the page ChatGPT, Claude and Perplexity can read. The fact ratio is 20%.",
        value: "15%",
      },
    ],
    outcome:
      "Anything under 100% on a page you want cited is a rendering bug, not a content problem. Moving Plannora's pricing template to server rendering lifts both ratios to 100% without changing a word of copy — and only then does the page compete on what it says. Run the check once per template, and again after every front-end release.",
  },

  related: [
    "ai-crawlers",
    "indexing",
    "oai-searchbot",
    "claudebot",
    "perplexitybot",
    "core-web-vitals",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Once your key pages serve full HTML, Rankbox tracks whether ChatGPT, Perplexity, Claude and Google AI Overviews cite them, and which article earned each citation — so you can tell whether the rendering fix changed anything.",
  },
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Which engines run your JavaScript, which crawler to allow for each, and how their indexes differ.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "Why Claude's fetcher reads raw HTML and PDF only, and how to test what it receives.",
    },
  ],
  sources: [
    {
      title: "Understand the JavaScript SEO basics",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
    },
    {
      title: "Dynamic rendering as a workaround",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering",
    },
    {
      title: "Inside Googlebot: demystifying crawling, fetching, and the bytes we process",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/03/crawler-blog-post",
    },
    {
      title: "Web fetch tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "AI search and JavaScript rendering",
      publisher: "GSQi (Glenn Gabe)",
      href: "https://www.gsqi.com/marketing-blog/ai-search-javascript-rendering/",
    },
  ],
};
