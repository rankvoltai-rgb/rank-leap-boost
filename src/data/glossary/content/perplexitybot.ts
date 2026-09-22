import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "perplexitybot",
  metaTitle: "What Is PerplexityBot? Perplexity's Crawler and Perplexity-User",
  metaDescription:
    "PerplexityBot indexes pages for Perplexity's answers and isn't used for training; Perplexity-User fetches live. What each does, whether to block, how to verify.",
  keywords: [
    "PerplexityBot",
    "what is PerplexityBot",
    "Perplexity crawler",
    "Perplexity-User",
    "block PerplexityBot",
    "PerplexityBot robots.txt",
    "PerplexityBot user agent",
  ],

  whyItMatters:
    "Perplexity runs its own index rather than borrowing Google's, so PerplexityBot is how your pages get into it — block it and a whole answer engine, plus the apps and browser built on the same index, loses your full text. And because Perplexity says the bot isn't used for model training, there's no training trade-off to weigh, which makes it the easiest AI crawler decision a small team will make.",

  questions: [
    {
      id: "what-it-does",
      question: "What does PerplexityBot do?",
      answer:
        "PerplexityBot crawls web pages to surface and link them in Perplexity's search results, feeding Perplexity's own index of more than 200 billion URLs; Perplexity says it is not used to crawl content for training AI foundation models.",
      blocks: [
        {
          kind: "p",
          text: 'Perplexity\'s [bot documentation](https://docs.perplexity.ai/guides/bots) describes PerplexityBot as "designed to surface and link websites in search results on Perplexity" and says it is "not used to crawl content for AI foundation models." Its crawls feed the index Perplexity built after leaving third-party search APIs, which, per its [architecture write-up](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api), "tracks over 200 billion unique URLs" and splits each page into passages that are retrieved and ranked individually. Its user agent:',
        },
        {
          kind: "code",
          lang: "text",
          code: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
        },
        {
          kind: "list",
          items: [
            "**Honors robots.txt:** yes, with changes taking up to 24 hours to apply.",
            "**IP ranges:** published at `perplexity.com/perplexitybot.json`.",
            "**No JavaScript:** Vercel's crawler study found none of the major AI crawlers render it, so client-rendered text is invisible. See [server-side rendering](/glossary/server-side-rendering).",
            "**Reach beyond perplexity.ai:** the same index powers Perplexity's APIs and its Comet browser.",
          ],
        },
      ],
    },
    {
      id: "vs-perplexity-user",
      question: "PerplexityBot vs Perplexity-User: what's the difference?",
      answer:
        "PerplexityBot crawls ahead of time to build Perplexity's search index and honors robots.txt, while Perplexity-User fetches a page live when a user's question needs it and, by Perplexity's own account, generally ignores robots.txt because a person initiated the request.",
      blocks: [
        {
          kind: "crawlers",
          bots: [
            {
              token: "PerplexityBot",
              role: "search",
              purpose:
                'Surfaces and links websites in Perplexity\'s search results; "not used to crawl content for AI foundation models." IPs: `perplexity.com/perplexitybot.json`.',
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Perplexity-User",
              role: "user",
              purpose:
                "Fetches a page live when a user's question needs it; not used for crawling or training. IPs: `perplexity.com/perplexity-user.json`.",
              robots: "no",
              robotsNote: 'Perplexity: "this fetcher generally ignores robots.txt rules."',
              advice: "allow",
            },
          ],
        },
        {
          kind: "p",
          text: "The split matters if you ever want to limit Perplexity. A robots.txt rule stops the indexing crawler but not the live fetcher; a hard block needs a firewall rule on `Perplexity-User`'s user agent and IP ranges. Comet, Perplexity's browser, isn't a bot at all: it sends a standard Chrome user agent from the user's own IP and can't be told apart in logs.",
        },
        {
          kind: "p",
          text: "There's history here too. In August 2025 [Cloudflare reported](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) Perplexity fetching pages with undeclared user agents when its declared bots were blocked; Perplexity [disputed the account](https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web). The practical lesson either way: set your Perplexity policy explicitly rather than trusting a CDN default to get it right.",
        },
      ],
    },
    {
      id: "should-i-block",
      question: "Should I block PerplexityBot?",
      answer:
        "Blocking PerplexityBot rarely makes sense for a business that wants to be found: the bot isn't used for model training, so a block buys no training opt-out, and it strips your full text from the index Perplexity's answers cite — though your domain, headline and a short summary may still appear.",
      blocks: [
        {
          kind: "p",
          text: "Perplexity's help center says that if a page disallows PerplexityBot, \"we may still index the domain, headline, and a brief factual summary.\" Blocking doesn't make you invisible; it makes you a thinner, less citable entry. The remaining reason to block is server load, and PerplexityBot honors robots.txt rate limits and backs off when a site struggles, so throttling usually solves that without leaving the index.",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Eligible for Perplexity search and live fetches\nUser-agent: PerplexityBot\nAllow: /\nDisallow: /account/\nDisallow: /cart/\n\nUser-agent: Perplexity-User\nAllow: /\n\nSitemap: https://example.com/sitemap.xml",
        },
        {
          kind: "p",
          text: "Perplexity is also the AI engine where classic SEO carries over best: 28.6% of its citations ranked in Google's top 10 in [Ahrefs' 2025 study](https://ahrefs.com/blog/ai-search-overlap/), the highest of any assistant. A block throws that overlap away. See the [Perplexity SEO guide](/ai-seo/perplexity) for what its ranking rewards.",
        },
      ],
    },
    {
      id: "check-visits",
      question: "How do I check whether PerplexityBot visits my site?",
      answer:
        "Check whether PerplexityBot visits your site by searching your access logs for `PerplexityBot` and `Perplexity-User`, then verifying the IPs against `perplexity.com/perplexitybot.json` and `perplexity.com/perplexity-user.json`, since both user agents are easy to spoof.",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: 'grep -oE "PerplexityBot|Perplexity-User" access.log | sort | uniq -c\n\n# Pages Perplexity fetched live for users\ngrep "Perplexity-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
        },
        {
          kind: "p",
          text: "`Perplexity-User` hits are the most telling: each one is a live question that needed your page, so the URLs it fetches most are the pages Perplexity is pulling into answers right now. Give any new rule a day before judging it, since Perplexity says robots.txt changes can take up to 24 hours. Requests claiming to be PerplexityBot from IPs outside the published list aren't Perplexity's crawler, and blocking them at the firewall costs you nothing. Compare verified `Perplexity-User` hits with visits from `perplexity.ai` in analytics to see how often a fetch turns into a click. Perplexity adds no UTM tags, so its traffic usually lands in Referral unless you give it a custom channel. See [AI referral traffic](/glossary/ai-referral-traffic), and for citations themselves, [prompt tracking](/glossary/prompt-tracking).",
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Perplexity Crawl-to-Click Ratio",
    summary:
      "A way to see what Perplexity's crawling returns to you, borrowing the crawl-to-referral ratio Cloudflare uses to compare AI platforms. The inputs are illustrative, for a fictional company called Plannora — pull 30 days of your own logs and analytics.",
    items: [
      {
        label: "Count verified PerplexityBot hits",
        body: "Log lines with the `PerplexityBot` token whose IPs match `perplexitybot.json`, over 30 days.",
        value: "2,400 hits",
      },
      {
        label: "Count verified Perplexity-User hits",
        body: "Live fetches for real questions, verified against `perplexity-user.json`, over the same 30 days.",
        value: "300 fetches",
      },
      {
        label: "Count Perplexity referral sessions",
        body: "Analytics sessions with the source `perplexity.ai` in the same window.",
        value: "120 sessions",
      },
      {
        label: "Crawl-to-click ratio",
        body: "2,700 bot requests ÷ 120 sessions: how many Perplexity requests it takes to earn one visit.",
        value: "22.5 : 1",
      },
    ],
    outcome:
      "For context, Cloudflare measured about 195 crawls per referred visitor for Perplexity across its network in July 2025, against about 1,091 for OpenAI and 38,066 for Anthropic. One site's number isn't directly comparable to a network average, so watch your own trend: rising `Perplexity-User` fetches with flat referrals mean you're being read but not clicked, often a sign another page is winning the citation.",
  },

  related: [
    "ai-crawlers",
    "robots-txt",
    "ai-referral-traffic",
    "server-side-rendering",
    "claudebot",
    "oai-searchbot",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Once PerplexityBot can reach you, Rankbox tracks whether Perplexity — and ChatGPT, Claude and Google AI Overviews — actually cites your brand, and which article earned each citation.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "How Perplexity's own index crawls, parses and ranks passages, and what gets cited.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "Every engine's crawlers, index and robots.txt setup, side by side.",
    },
  ],
  sources: [
    {
      title: "Perplexity crawlers",
      publisher: "Perplexity Docs",
      href: "https://docs.perplexity.ai/guides/bots",
    },
    {
      title: "How does Perplexity follow robots.txt?",
      publisher: "Perplexity Help Center",
      href: "https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "The crawl-to-click gap: Cloudflare data on AI bots, training, and referrals",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/crawlers-click-ai-bots-training/",
    },
    {
      title: "Perplexity is using stealth, undeclared crawlers",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/",
    },
    {
      title: "Agents or bots? Making sense of AI on the open web",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web",
    },
    {
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
  ],
};
