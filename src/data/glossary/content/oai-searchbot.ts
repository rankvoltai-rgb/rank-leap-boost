import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "oai-searchbot",
  metaTitle: "What Is OAI-SearchBot? The Crawler Behind ChatGPT Search",
  metaDescription:
    "OAI-SearchBot is the OpenAI crawler that decides whether ChatGPT search can show and cite your site. How it differs from GPTBot, and how to allow and verify it.",
  keywords: [
    "OAI-SearchBot",
    "what is OAI-SearchBot",
    "ChatGPT search crawler",
    "OAI-SearchBot robots.txt",
    "OAI-SearchBot vs GPTBot",
    "allow OAI-SearchBot",
    "OAI-SearchBot user agent",
  ],

  whyItMatters:
    "OAI-SearchBot is the one OpenAI crawler that decides whether ChatGPT search can cite you, and a forgotten robots.txt line or CDN setting shuts it out without any error you'd notice. For a small team competing with bigger brands for a place in ChatGPT's shortlists, confirming it can reach your pages is a ten-minute check that every other piece of AI-search work depends on.",

  questions: [
    {
      id: "what-it-does",
      question: "What does OAI-SearchBot do?",
      answer:
        "OAI-SearchBot crawls web pages so OpenAI can surface them in ChatGPT's search features, which makes it the crawler that decides whether ChatGPT search answers can show and cite your site.",
      blocks: [
        {
          kind: "p",
          text: 'OpenAI\'s [crawler documentation](https://developers.openai.com/api/docs/bots) says OAI-SearchBot is used to "surface websites in search results in ChatGPT\'s search features," and spells out what blocking it costs: "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links." OpenAI recommends allowing both the bot and requests from its published IP ranges. Its current user agent:',
        },
        {
          kind: "code",
          lang: "text",
          code: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot",
        },
        {
          kind: "p",
          text: "Match on the `OAI-SearchBot` token rather than the full string, which changes between versions. ChatGPT search also draws on third-party providers — OpenAI names Microsoft — so being indexed by Bing matters too. But OAI-SearchBot feeds OpenAI's own index, and allowing it is the only inclusion rule OpenAI documents. The [ChatGPT SEO guide](/ai-seo/chatgpt) covers the rest of the pipeline.",
        },
      ],
    },
    {
      id: "vs-gptbot",
      question: "OAI-SearchBot vs GPTBot: what's the difference?",
      answer:
        "OAI-SearchBot crawls for ChatGPT search, so blocking it removes you from ChatGPT's cited answers, while GPTBot crawls for model training, so blocking it only opts you out of training; OpenAI treats the two as independent settings.",
      blocks: [
        {
          kind: "table",
          head: ["", "OAI-SearchBot", "GPTBot", "ChatGPT-User"],
          rows: [
            [
              "**Job**",
              "Index pages for ChatGPT search",
              "Collect content for model training",
              "Fetch a page for a user's conversation or custom GPT",
            ],
            [
              "**Block it and…**",
              "You're not shown in ChatGPT search answers",
              "Your content shouldn't be used in training",
              "ChatGPT can't read your page mid-conversation",
            ],
            ["**Honors robots.txt**", "Yes", "Yes", 'Not always: rules "may not apply"'],
            [
              "**IP list**",
              "`openai.com/searchbot.json`",
              "`openai.com/gptbot.json`",
              "`openai.com/chatgpt-user.json`",
            ],
            ["**Advice**", "Allow", "Your call", "Allow"],
          ],
        },
        {
          kind: "p",
          text: "Confusing the two is the most expensive robots.txt mistake in AI search: a site that blocks OAI-SearchBot to avoid training disappears from ChatGPT's answers and gains nothing, because training runs on a different bot. If training is your concern, the bot to block is [GPTBot](/glossary/gptbot). When both are allowed, OpenAI says it may use one crawl for both jobs, so allowing both doesn't double your server load.",
        },
      ],
    },
    {
      id: "how-to-allow",
      question: "How do I allow OAI-SearchBot?",
      answer:
        "Allow OAI-SearchBot by giving it its own `Allow: /` group in robots.txt, then making sure your CDN, firewall and bot-protection settings let its published IP ranges through — robots.txt alone isn't enough if a security layer blocks the request first.",
      blocks: [
        {
          kind: "code",
          lang: "robots.txt",
          code: "# ChatGPT search: required to be cited\nUser-agent: OAI-SearchBot\nAllow: /\nDisallow: /account/\nDisallow: /checkout/",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Check for blanket blocks.** A `User-agent: *` group with `Disallow: /` shuts OAI-SearchBot out unless it has a group of its own.",
            "**Copy your private paths.** A named group ignores the `*` group entirely, so repeat any `Disallow` lines you still need, as above.",
            "**Open the CDN.** Allowlist the IPs in `openai.com/searchbot.json` and don't serve them challenges. From 15 September 2026, new Cloudflare domains block Training and Agent bots by default on pages with ads while allowing Search bots — check what your own plan and settings actually do.",
            "**Wait about 24 hours.** That's how long OpenAI says robots.txt changes take to reach its systems.",
            "**Serve the answer in HTML.** OpenAI documents no JavaScript rendering, and Vercel's crawler study saw OpenAI's crawler fetch scripts without running them. See [server-side rendering](/glossary/server-side-rendering).",
          ],
        },
      ],
    },
    {
      id: "check-visits",
      question: "How do I check whether OAI-SearchBot visits my site?",
      answer:
        "Check whether OAI-SearchBot visits your site by searching your access logs for its token, verifying the IPs against `openai.com/searchbot.json`, and requesting a key page with its user agent to confirm your server returns the real content rather than a challenge.",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: '# OpenAI bot hits by type\ngrep -oE "OAI-SearchBot|ChatGPT-User|GPTBot|OAI-AdsBot" access.log | sort | uniq -c\n\n# Does the bot get your real content?\ncurl -s -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n\n# 0 = the text is rendered by JavaScript, or a WAF is serving a challenge',
        },
        {
          kind: "p",
          text: "No hits at all usually means one of three things: the bot is blocked (look for 403s in your CDN's firewall log), the site is new and hasn't been discovered, or requests are dropped before they reach your logs. Remember that a `curl` from your own machine only tests user-agent rules; an IP-based bot rule can still treat the real bot differently. Logs prove access, not citations. To see whether ChatGPT actually cites you, run a fixed set of buyer prompts on a schedule, which is [prompt tracking](/glossary/prompt-tracking), and watch [AI referral traffic](/glossary/ai-referral-traffic) from `chatgpt.com`.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with OAI-SearchBot",
      answer:
        "The most common OAI-SearchBot mistakes are blocking it while trying to block training, leaving a CDN or bot-fight setting that challenges it, and using a robots.txt Disallow to hide a page that needs a `noindex` instead.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking GPTBot keeps me out of ChatGPT.",
              reality:
                "`GPTBot` is training only. ChatGPT search visibility is OAI-SearchBot, and the two settings are independent.",
            },
            {
              myth: "A Disallow removes a page from ChatGPT.",
              reality:
                "A disallowed URL can still surface as a navigational link. To keep a page out, allow the crawler and use `noindex` — it has to fetch the page to see the tag. See [robots.txt](/glossary/robots-txt).",
            },
            {
              myth: "robots.txt is the only setting that matters.",
              reality:
                "CDN bot protection, block-AI toggles and rate limits act before robots.txt is ever consulted. Allowlist OpenAI's published IPs and check your firewall log for challenges.",
            },
            {
              myth: "Allowing both OpenAI bots doubles the crawl load.",
              reality:
                "OpenAI says that when both are allowed, it may use the results from one crawl for both search and training.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The ChatGPT Reachability Audit",
    summary:
      "A way to measure how much of your site OAI-SearchBot can actually read, gate by gate. The inputs are illustrative, for a fictional project management company called Plannora — run the same steps on your own sitemap.",
    items: [
      {
        label: "Start with the pages you want cited",
        body: "Every URL in Plannora's XML sitemap.",
        value: "180 URLs",
      },
      {
        label: "robots.txt lets OAI-SearchBot in",
        body: "A leftover `Disallow: /blog/` under `User-agent: *` blocks the blog, because OAI-SearchBot has no group of its own. 60 URLs fail.",
        value: "120 URLs",
      },
      {
        label: "The CDN lets it through",
        body: "A rate-limit rule challenges bot traffic on `/docs/`, and the bot's requests get a 403 on 25 URLs.",
        value: "95 URLs",
      },
      {
        label: "The answer is in the raw HTML",
        body: "The pricing and integration pages build their tables with JavaScript; `grep` finds the key sentence missing on 15 URLs.",
        value: "80 URLs",
      },
      {
        label: "Reachable share",
        body: "80 ÷ 180: the share of the site ChatGPT search can currently read and cite.",
        value: "44%",
      },
    ],
    outcome:
      "Each gate has a known fix: give OAI-SearchBot its own group, exempt OpenAI's published IPs from the rate limit, and server-render the two templates. That lifts Plannora to all 180 URLs without writing a word of new content — which is why access is the first thing to audit.",
  },

  related: [
    "gptbot",
    "ai-crawlers",
    "robots-txt",
    "server-side-rendering",
    "ai-referral-traffic",
    "indexing",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Once OAI-SearchBot can reach you, Rankbox tracks whether ChatGPT — along with Perplexity, Claude and Google AI Overviews — actually cites your brand, and which article earned each citation.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "How ChatGPT search fans out queries, which sources it pulls from, and how to track the traffic.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description: "The step-by-step content playbook, starting with allowing OAI-SearchBot.",
    },
  ],
  sources: [
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      title: "How Google interprets the robots.txt specification",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt",
    },
    {
      title: "Your site, your rules: new AI traffic options for all customers",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/content-independence-day-ai-options/",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
  ],
};
