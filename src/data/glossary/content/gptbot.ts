import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "gptbot",
  metaTitle: "What Is GPTBot? OpenAI's Training Crawler, and Whether to Block It",
  metaDescription:
    "GPTBot is OpenAI's crawler for model training, not ChatGPT search. What it does, whether to block it, the robots.txt to copy, and how to spot it in your logs.",
  keywords: [
    "GPTBot",
    "what is GPTBot",
    "OpenAI crawler",
    "block GPTBot",
    "GPTBot robots.txt",
    "should I block GPTBot",
    "GPTBot user agent",
  ],

  whyItMatters:
    "GPTBot is the bot most sites block first, and often for the wrong reason: it only collects training data, so blocking it neither protects nor costs you anything in ChatGPT search. For a small team the real decision is narrower and more strategic — whether you want the next OpenAI model to know your product exists — and it deserves five minutes of thought rather than a default someone else set.",

  questions: [
    {
      id: "what-it-does",
      question: "What is GPTBot used for?",
      answer:
        "GPTBot is used to collect public web content that may be used to train OpenAI's generative AI foundation models, and for nothing else: it doesn't decide what appears in ChatGPT search, which is the job of a separate crawler, OAI-SearchBot.",
      blocks: [
        {
          kind: "p",
          text: 'OpenAI\'s [crawler documentation](https://developers.openai.com/api/docs/bots) describes GPTBot as the bot that crawls "content that may be used in training our generative AI foundation models," and gives the opt-out in one line: "Disallowing GPTBot indicates a site\'s content should not be used in training generative AI foundation models." It identifies itself with this user agent:',
        },
        {
          kind: "code",
          lang: "text",
          code: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot",
        },
        {
          kind: "list",
          items: [
            "**Honors robots.txt:** yes, and OpenAI says changes take about 24 hours to reach its systems.",
            "**IP ranges:** published at `openai.com/gptbot.json`, so you can tell real GPTBot traffic from imitators.",
            "**Scale:** GPTBot generated 7.5% of all verified bot traffic Cloudflare saw in 2025, more than Bingbot's 6%.",
            "**Forward-looking only:** a block covers future crawls. OpenAI's documentation doesn't describe removing content collected before it.",
          ],
        },
      ],
    },
    {
      id: "should-i-block",
      question: "Should I block GPTBot?",
      answer:
        "Block GPTBot only if keeping your content out of future OpenAI models matters more to you than having those models know your brand; blocking it has no effect on ChatGPT search, so for a business that wants to be recommended, allowing it is usually the better trade.",
      blocks: [
        {
          kind: "table",
          head: ["Lean toward blocking if…", "Lean toward allowing if…"],
          rows: [
            [
              "Your content is the product: paywalled research, original datasets, courses",
              "Your content markets a product: guides, docs, comparisons, pricing",
            ],
            [
              "You're negotiating, or planning to negotiate, licensing deals with AI companies",
              "You want future models to describe your category with you in it",
            ],
            [
              "Legal or client obligations restrict reuse of what you publish",
              "You have no specific reason to object to training",
            ],
          ],
        },
        {
          kind: "p",
          text: "The case for allowing rests on the answers that never search. [Semrush's clickstream data](https://www.semrush.com/blog/chatgpt-search-insights/) found ChatGPT searched the web on about a third of prompts in February 2026; the rest came from what the model learned in training, which is where [LLM training data](/glossary/llm-training-data) decides whether your brand comes up at all. A GPTBot block is also only partial: Common Crawl's `CCBot` builds an open archive that has been a major source of LLM training data, so blocking GPTBot alone doesn't opt you out of training in general.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Either way, keep OAI-SearchBot allowed",
          text: "Whatever you decide about training, `OAI-SearchBot` is the crawler that decides whether ChatGPT search can cite you. See [OAI-SearchBot](/glossary/oai-searchbot).",
        },
      ],
    },
    {
      id: "gptbot-vs-oai-searchbot",
      question: "GPTBot vs OAI-SearchBot: what's the difference?",
      answer:
        "GPTBot collects content for training OpenAI's models, while OAI-SearchBot crawls pages so they can be shown and cited in ChatGPT search — two independent robots.txt settings, so you can block training and still appear in search.",
      blocks: [
        {
          kind: "crawlers",
          bots: [
            {
              token: "OAI-SearchBot",
              role: "search",
              purpose:
                'Surfaces websites in ChatGPT search. Sites that opt out "will not be shown in ChatGPT search answers." IPs: `openai.com/searchbot.json`.',
              robots: "yes",
              advice: "allow",
            },
            {
              token: "ChatGPT-User",
              role: "user",
              purpose:
                "Fetches pages for user actions in ChatGPT and custom GPTs; OpenAI says it isn't used to decide what appears in search. IPs: `openai.com/chatgpt-user.json`.",
              robots: "partial",
              robotsNote: 'OpenAI: "robots.txt rules may not apply" to user-initiated fetches.',
              advice: "allow",
            },
            {
              token: "GPTBot",
              role: "training",
              purpose:
                "Collects content that may be used to train OpenAI's models. Blocking it has no effect on search. IPs: `openai.com/gptbot.json`.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: 'OpenAI puts the independence in writing: "a webmaster can allow OAI-SearchBot in order to appear in search results while disallowing GPTBot." When both are allowed, OpenAI "may use the results from just one crawl for both use cases," so allowing both doesn\'t double your crawl load. A fourth bot, `OAI-AdsBot`, only checks landing pages submitted as ChatGPT ads. See [AI crawlers](/glossary/ai-crawlers) for every vendor\'s equivalents.',
        },
      ],
    },
    {
      id: "how-to-block",
      question: "How do I block GPTBot?",
      answer:
        "To block GPTBot, add a `User-agent: GPTBot` group with `Disallow: /` to the robots.txt of every host you want covered; OpenAI applies it within about 24 hours, and you can opt out only part of a site by disallowing specific paths instead.",
      blocks: [
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Opt out of OpenAI model training\nUser-agent: GPTBot\nDisallow: /\n\n# Stay in ChatGPT search\nUser-agent: OAI-SearchBot\nAllow: /",
        },
        {
          kind: "p",
          text: "To keep only premium sections out of training, disallow just those paths:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "User-agent: GPTBot\nDisallow: /research/\nDisallow: /courses/",
        },
        {
          kind: "list",
          items: [
            "**Repeat it per host.** robots.txt applies only to the host that serves it, so `blog.example.com` needs its own file.",
            "**Named groups don't inherit `*` rules.** Once GPTBot has its own group, it ignores everything under `User-agent: *`, so copy across any paths you also need kept private.",
            "**For a hard block, add a firewall rule** on the ranges in `openai.com/gptbot.json`. GPTBot honors robots.txt, but a firewall rule doesn't depend on any bot's good behavior.",
            "**Read the file as served before editing it.** CDN features such as Cloudflare's managed robots.txt can prepend AI training rules you never wrote, so your decision may already have been made for you.",
          ],
        },
      ],
    },
    {
      id: "check-visits",
      question: "How do I check whether GPTBot visits my site?",
      answer:
        "To check whether GPTBot visits your site, search your access logs for the `GPTBot` user-agent token, then confirm the requesting IPs fall inside OpenAI's published ranges at `openai.com/gptbot.json`, since anyone can copy the user agent.",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: "# GPTBot hits by IP, then by URL\ngrep \"GPTBot\" access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head\ngrep \"GPTBot\" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head",
        },
        {
          kind: "p",
          text: "Check the IPs against `gptbot.json` before drawing conclusions, because scrapers borrow well-known user agents. Expect some GPTBot requests for `/robots.txt` itself: that's the bot rechecking your rules, not ignoring them. If you've blocked GPTBot and still see verified hits on disallowed pages after a day, check that the rule sits on the right host and that the token is spelled as a group of its own. GPTBot hits only tell you about training crawls. For ChatGPT search, look for `OAI-SearchBot`; for live conversations, `ChatGPT-User` — and for whether ChatGPT actually cites you, run a fixed prompt panel, which is [prompt tracking](/glossary/prompt-tracking).",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Training Opt-Out Test",
    summary:
      "Four questions that turn the GPTBot decision from a reflex into a policy. Answer them once, in order, and apply the result to every training crawler, not just OpenAI's.",
    items: [
      {
        label: "Is the content itself what you sell?",
        body: "Paywalled research, datasets, courses and premium reporting lose value when a model can reproduce them. **Yes → lean block.**",
      },
      {
        label: "Do you want the next model to recommend you?",
        body: "If your pages exist to market a product, being in training data helps future models describe your category with you in it. **Yes → lean allow.**",
      },
      {
        label: "Are you closing every training route, or one?",
        body: "Blocking `GPTBot` alone leaves `CCBot`, `ClaudeBot`, `Google-Extended` and others open. **Decide for all training tokens at once**, or accept that the block is symbolic.",
      },
      {
        label: "Is search access untouched?",
        body: "After any change, confirm `OAI-SearchBot` is still allowed in robots.txt and at your CDN. **If it isn't, fix that first** — it costs you ChatGPT search today.",
      },
    ],
    outcome:
      "A yes to the first question and a no to the second points to blocking all training tokens together; anything else points to allowing. Write the decision down, so a CDN preset or plugin update doesn't quietly make it for you.",
  },

  related: [
    "oai-searchbot",
    "ai-crawlers",
    "robots-txt",
    "llm-training-data",
    "claudebot",
    "google-extended",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Whatever you decide about training, Rankbox tracks whether ChatGPT, Perplexity, Claude and Google AI Overviews actually cite your brand — and which article earned each citation.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "All four OpenAI bots, how ChatGPT search picks sources, and the CDN settings that override robots.txt.",
    },
    {
      title: "How to get cited by ChatGPT",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description:
        "The content playbook for earning ChatGPT citations once the crawlers can reach you.",
    },
  ],
  sources: [
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
    {
      title: "2025 Cloudflare Radar Year in Review",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/radar-2025-year-in-review/",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
    {
      title: "How Google interprets the robots.txt specification",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt",
    },
    {
      title: "CCBot",
      publisher: "Common Crawl",
      href: "https://commoncrawl.org/ccbot",
    },
    {
      title: "Training data for the price of a sandwich: Common Crawl's impact on generative AI",
      publisher: "Mozilla Foundation",
      href: "https://www.mozillafoundation.org/en/research/library/generative-ai-training-data/common-crawl/",
    },
  ],
};
