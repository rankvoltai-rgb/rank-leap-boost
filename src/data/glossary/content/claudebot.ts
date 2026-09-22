import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "claudebot",
  metaTitle: "What Is ClaudeBot? Anthropic's Three Crawlers Explained",
  metaDescription:
    "ClaudeBot is Anthropic's training crawler; Claude's search uses Claude-SearchBot and Claude-User. What each does, whether to block ClaudeBot, and the robots.txt.",
  keywords: [
    "ClaudeBot",
    "what is ClaudeBot",
    "Anthropic crawler",
    "block ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "ClaudeBot robots.txt",
  ],

  whyItMatters:
    "ClaudeBot is the Anthropic bot people know by name, so it's the one they block — but it only collects training data, while Claude's search runs on two other bots and on an index, Brave's, that you can't allow by name at all. For a small team that wants Claude to recommend them, getting three Anthropic rules right, and not breaking Googlebot along the way, takes minutes and protects a channel that runs on different rules from Google.",

  questions: [
    {
      id: "what-it-does",
      question: "What is ClaudeBot used for?",
      answer:
        "ClaudeBot is used to collect public web content that may contribute to training Anthropic's Claude models; blocking it signals that your site's future content should be excluded from training, and it does not remove you from Claude's search results.",
      blocks: [
        {
          kind: "p",
          text: 'Anthropic\'s [help center](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) says ClaudeBot "helps enhance the utility and safety of our generative AI models by collecting web content that could potentially contribute to their training." Disallowing it "signals that the site\'s future materials should be excluded from our AI model training datasets" — future, not past.',
        },
        {
          kind: "list",
          items: [
            "**Honors robots.txt:** yes, including the non-standard `Crawl-delay` extension, and it won't try to bypass CAPTCHAs.",
            "**IP ranges:** published at `claude.com/crawling/bots.json`, shared by all three Anthropic bots.",
            "**Doesn't run JavaScript:** Vercel's crawler study saw Anthropic's crawler download script files without executing them, so client-rendered text never reaches it.",
            "**Old tokens:** `anthropic-ai` and `Claude-Web` aren't in Anthropic's current documentation. Leaving them in robots.txt is harmless but does nothing.",
          ],
        },
        {
          kind: "p",
          text: "ClaudeBot is one of three bots with separate jobs, and the other two decide whether Claude can cite you. See [AI crawlers](/glossary/ai-crawlers) for how every vendor splits the same three roles.",
        },
      ],
    },
    {
      id: "three-bots",
      question: "ClaudeBot vs Claude-SearchBot vs Claude-User: what's the difference?",
      answer:
        "ClaudeBot collects training data, Claude-SearchBot indexes pages to improve Claude's search results, and Claude-User fetches a page when a person's conversation needs it — three separate robots.txt tokens, so you can opt out of training while staying fully visible in Claude's answers.",
      blocks: [
        {
          kind: "crawlers",
          bots: [
            {
              token: "Claude-SearchBot",
              role: "search",
              purpose:
                "Indexes content to improve Claude's search results. Anthropic warns that blocking it \"may reduce your site's visibility and accuracy in user search results.\"",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Claude-User",
              role: "user",
              purpose:
                "Fetches a page when a user's conversation needs it. Also used by Claude Code, whose requests come from the user's own machine and IP.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "ClaudeBot",
              role: "training",
              purpose:
                "Collects public content that may be used to train future models. Blocking it excludes future content from training, not from search.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: 'Unusually, all three honor robots.txt, `Claude-User` included; OpenAI, Perplexity and Google all say their user-triggered fetchers may ignore it. So a `Claude-User` block really does work: Anthropic says it "prevents our system from retrieving your content in response to a user query." That makes it easy to switch off Claude\'s live reading by mistake with a broad rule.',
        },
      ],
    },
    {
      id: "should-i-block",
      question: "Should I block ClaudeBot?",
      answer:
        "Block ClaudeBot only if keeping your future content out of Claude's training matters more than having future Claude models know your brand; ClaudeBot has no effect on Claude's web search, so leave Claude-SearchBot and Claude-User allowed either way.",
      blocks: [
        {
          kind: "p",
          text: "The trade-off is sharper for Claude than it looks. In [Profound's 2026 testing](https://www.joshblyskal.com/research/state-of-aeo-2026), Claude searched the web on 36.6% of prompts; the other 63.4% were answered from what the model already knew. Blocking ClaudeBot keeps your future content out of the model that answers most questions without searching. See [LLM training data](/glossary/llm-training-data).",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Claude search index and live fetches: allow\nUser-agent: Claude-SearchBot\nAllow: /\n\nUser-agent: Claude-User\nAllow: /\n\n# Model training: your call\nUser-agent: ClaudeBot\nDisallow: /",
        },
        {
          kind: "p",
          text: "Anthropic asks you to repeat the rules on every subdomain you want covered. If server load is the worry rather than training, slow ClaudeBot down instead of blocking it: Anthropic supports `Crawl-delay`, for example `Crawl-delay: 1` under `User-agent: ClaudeBot`. And whatever you choose, make the same call for the other training tokens — `GPTBot`, `Google-Extended`, `CCBot` — or the opt-out is mostly symbolic.",
        },
      ],
    },
    {
      id: "check-visits",
      question: "How do I check whether ClaudeBot visits my site?",
      answer:
        "Check whether ClaudeBot visits your site by searching your access logs for the `ClaudeBot` token and verifying the source IPs against `claude.com/crawling/bots.json`; count `Claude-SearchBot` and `Claude-User` separately, because they tell you about search, not training.",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: '# Anthropic bot hits by type\ngrep -oE "ClaudeBot|Claude-SearchBot|Claude-User" access.log | sort | uniq -c\n\n# Pages Claude fetched for users: your live-demand list\ngrep "Claude-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
        },
        {
          kind: "p",
          text: "Requests for `/robots.txt` itself are the bots checking your rules, and Anthropic says all three follow them, so verified hits on disallowed paths a day after a change usually mean a typo in the token or a rule on the wrong host. Use the IP list to verify, and robots.txt to decide. Anthropic warns that blocking by IP \"may not work correctly or persistently guarantee an opt-out,\" because it stops the bot reading your robots.txt. Claude Code is the exception to IP checks, since its `Claude-User` requests come from each user's own machine. And one crawler that matters for Claude won't show up under any Anthropic name: Brave's, which builds the index behind Claude's web search and doesn't advertise a user agent of its own.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with ClaudeBot",
      answer:
        "The most common ClaudeBot mistakes are treating it as Claude's search crawler, blocking Googlebot without realizing Claude's search index follows Googlebot's rules, and forgetting that robots.txt rules must be repeated on every subdomain.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking ClaudeBot hides me from Claude's search.",
              reality:
                "It only stops future training. Search indexing is `Claude-SearchBot`, and live fetches are `Claude-User`.",
            },
            {
              myth: "Only Anthropic's bots matter for Claude.",
              reality:
                "Claude's web search runs on Brave Search, whose crawler won't crawl what Googlebot is disallowed from. Block Googlebot and you lose Claude too. See the [Claude SEO guide](/ai-seo/claude).",
            },
            {
              myth: "One robots.txt covers my whole domain.",
              reality:
                "Rules apply per host, and Anthropic asks for them on every subdomain you want opted in or out. See [robots.txt](/glossary/robots-txt).",
            },
            {
              myth: "Claude will render my JavaScript.",
              reality:
                "Anthropic's fetch tool doesn't support JavaScript-rendered sites. Server-render what you want quoted. See [server-side rendering](/glossary/server-side-rendering).",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Claude Access Chain",
    summary:
      "Claude can cite a page only if four links hold, and none of them is ClaudeBot. Check them in order: a break early in the chain makes the later links irrelevant.",
    items: [
      {
        label: "Googlebot allowed",
        body: "Brave Search, Claude's search provider, won't crawl what Googlebot can't. **Test:** no `Disallow` for Googlebot or `*` on pages you want cited, and no CDN rule that catches Googlebot.",
      },
      {
        label: "Claude-SearchBot and Claude-User allowed",
        body: "The index and the live fetcher. **Test:** neither is blocked on any subdomain, and the CDN lets the IPs in `claude.com/crawling/bots.json` through without a challenge.",
      },
      {
        label: "Content in the raw HTML",
        body: "Claude's fetcher doesn't run JavaScript. **Test:** request a key page with `curl -A \"Claude-User\"` and find your key sentence in the response.",
      },
      {
        label: "Ranked in Brave",
        body: "79.2% of Claude's cited URLs sat in Brave's top 10 for the query in Profound's 2026 study. **Test:** search your target questions on search.brave.com with the year added, the way Claude writes them.",
      },
      {
        label: "Outside the chain: ClaudeBot",
        body: "Training access has no effect on the four links above. **Decide** it separately, on whether you want future Claude models to know your brand.",
      },
    ],
    outcome:
      "The ClaudeBot decision is the one people debate, but it sits outside the chain. The links that break silently are the Googlebot rule and JavaScript rendering, because nothing warns you when they fail.",
  },

  related: [
    "ai-crawlers",
    "gptbot",
    "robots-txt",
    "server-side-rendering",
    "llm-training-data",
    "perplexitybot",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Once Claude's bots can reach you, Rankbox tracks whether Claude — along with ChatGPT, Perplexity and Google AI Overviews — cites your brand, and which article earned each citation.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "Brave Search, the three-bot split, why JavaScript kills visibility, and how to track Claude traffic.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "How each engine's crawlers and robots.txt tokens compare, side by side.",
    },
  ],
  sources: [
    {
      title: "Does Anthropic crawl data from the web, and how can site owners block the crawler?",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    {
      title: "Anthropic crawler IP ranges",
      publisher: "Anthropic",
      href: "https://claude.com/crawling/bots.json",
    },
    {
      title: "Web fetch tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool",
    },
    {
      title: "Brave Search crawler",
      publisher: "Brave",
      href: "https://search.brave.com/help/brave-search-crawler",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
  ],
};
