import type { EngineGuide } from "../types";

export const claude: EngineGuide = {
  slug: "claude",
  metaTitle: "Claude SEO: The Technical Guide to Getting Cited by Claude",
  metaDescription:
    "How Claude's web search finds and cites pages: Brave Search, the ClaudeBot / Claude-SearchBot / Claude-User split, why JavaScript kills visibility, and how to track Claude traffic.",
  keywords: [
    "Claude SEO",
    "get cited by Claude",
    "Claude web search",
    "Claude-SearchBot",
    "ClaudeBot robots.txt",
    "what search engine does Claude use",
  ],
  headline: { lead: "Claude SEO:", accent: "the technical guide to getting cited by Claude" },
  subhead:
    "Claude doesn't search Google. It searches Brave, fetches raw HTML without running JavaScript, and quotes passages of 150 characters or less. Here's what that means for your crawlers, your rendering and your content.",

  shortAnswer:
    "To get cited by Claude, allow **Claude-SearchBot** and **Claude-User** in robots.txt, serve your content as server-rendered HTML, and rank in **Brave Search** — the search provider Anthropic lists for Claude's web search, which holds 79% of the URLs Claude cites in its top 10. Then give Claude dated, first-party pages with short, self-contained answers it can quote.",

  takeaways: [
    "Anthropic runs three bots. Blocking `ClaudeBot` only stops training; search uses `Claude-SearchBot`, and live fetches use `Claude-User`.",
    "Claude's web search is powered by Brave Search. In a 2026 study, 79.2% of Claude-cited URLs ranked in Brave's top 10 — versus 34% in Google's.",
    "Claude's fetcher reads raw HTML and PDF only. Content that appears after JavaScript runs is invisible to it.",
    "Brave's crawler has no user agent of its own and won't crawl what Googlebot is blocked from. Blocking Googlebot costs you Claude too.",
    "Claude adds the current year to 94% of its search queries and cites listicles heavily. Freshness is visible, and it matters.",
    "Claude traffic arrives from `claude.ai` with no UTM tags. GA4's AI Assistant channel definition doesn't list Claude, so check where it lands and add a custom channel if needed.",
  ],

  facts: [
    { label: "Claude's web-search provider", value: "Brave Search" },
    { label: "Of Claude's cited URLs rank in Brave's top 10", value: "79%" },
    { label: "The crawler to allow for search", value: "Claude-SearchBot", mono: true },
    { label: "Runs your JavaScript", value: "No" },
  ],

  preview: {
    prompt: "Which project management tool has the best API for a five-person dev team?",
    status: "Searched the web · 10 results",
    answer:
      "**Plannora** has the most complete public API of the tools a small team is likely to shortlist: REST and webhooks on every plan, including the free tier for up to five users.",
    sources: [
      { domain: "plannora.io", title: "Plannora API reference" },
      { domain: "devtoolsweekly.com", title: "PM tools with the best APIs (2026)" },
      { domain: "stackreview.co", title: "Plannora vs Loopcraft for developers" },
    ],
  },

  profile: {
    retrieval: "Brave Search's index (Anthropic's listed provider), plus live page fetches",
    searchCrawler: "Claude-SearchBot + Claude-User",
    trainingCrawler: "ClaudeBot — search unaffected",
    rendersJs: "No — raw HTML and PDF only",
    referrer: "claude.ai (referral, no UTM)",
    citationStyle: "Inline citation chips quoting up to 150 characters",
    biggestLever: "Rank in Brave with server-rendered, dated, first-party pages",
  },

  sections: [
    {
      id: "how-claude-searches",
      title: "How Claude searches and picks sources",
      blocks: [
        {
          kind: "p",
          text: "Claude answers most questions from what it learned in training. It searches when the answer depends on something current or changeable — news, prices, a specific product or company — or when the user asks it to. In Profound's 2026 test of 400+ prompts, Claude searched on **36.6%** of them. When it does search, the results come from a different index than most people assume.",
        },
        {
          kind: "p",
          text: "Anthropic's subprocessor list has named **Brave Search** as its web-search vendor since March 2025, when [Simon Willison](https://simonwillison.net/2025/Mar/21/anthropic-use-brave/) spotted it and found a `BraveSearchParams` parameter in Claude's tool definition. In May 2026 the list reportedly added TurboPuffer, a vector and full-text search database, in an undisclosed web-search role — possibly a re-ranking layer, which would explain why about a fifth of Claude's citations sit outside Brave's top 10.",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Claude decides whether to search",
              body: "Stable facts, code and analysis are answered from training. Anything time-sensitive or specific triggers a search.",
              lever:
                "Be in the training data too: blocking `ClaudeBot` keeps future content out of the roughly two-thirds of answers that never search.",
            },
            {
              title: "It writes its own queries — usually with a year",
              body: "Simple questions take one to three searches; comparisons ten or more. Profound found Claude added the current year to **94%** of its sub-queries, against 17% for ChatGPT.",
              lever:
                'Put an honest year in titles and a visible "updated" date on pages where freshness matters.',
            },
            {
              title: "Brave returns about ten results per search",
              body: "Every result — URL, title and `page_age` — is loaded into Claude's context. Newer tool versions let Claude write code to filter results before reading them.",
              lever: "Rank in Brave's top 10 for the queries Claude writes.",
            },
            {
              title: "Claude fetches the pages it needs",
              body: "Full pages are retrieved by `Claude-User` as raw HTML or PDF. No JavaScript runs, and long pages are truncated to fit the context window.",
              lever:
                "Server-render. Put the answer in the first screen of HTML, not after a script or a click.",
            },
            {
              title: "It answers with mandatory citations",
              body: "Citations are always on in web search, and each quotes the passage it relies on — up to 150 characters of `cited_text`. Claude doesn't sell placement: Anthropic's February 2026 pledge rules out sponsored links and advertiser influence.",
              lever: "Write self-contained sentences that carry a fact in under 150 characters.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "79.2%",
              label:
                "of URLs Claude cites rank in Brave's top 10 for the query — versus 34% in Google's",
              source: {
                name: "Profound, Jul 2026",
                href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
              },
            },
            {
              value: "94%",
              label: "of Claude's search sub-queries include the current year",
              source: {
                name: "Profound, Jul 2026",
                href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
              },
            },
            {
              value: "8%",
              label:
                "of citation domains are shared between Claude and ChatGPT — they're different races",
              source: {
                name: "Profound, Jul 2026",
                href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Research mode reads further — and prefers primary sources",
          text: 'In Research mode (paid plans) Claude runs several agents in parallel, up to 10+ for complex questions. Anthropic\'s [engineering write-up](https://www.anthropic.com/engineering/multi-agent-research-system) says early versions "consistently chose SEO-optimized content farms over authoritative but less highly-ranked sources," and that the fix was to reward "primary sources over lower-quality secondary sources." Original, first-party material is what it\'s tuned to find.',
        },
      ],
    },
    {
      id: "crawlers",
      title: "Anthropic's three crawlers — and the one you can't see",
      blocks: [
        {
          kind: "p",
          text: "Anthropic [documents three bots](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), each with its own job. All three honor robots.txt, including the non-standard `Crawl-delay`, and respect CAPTCHAs. That last part is unusual: OpenAI, Perplexity and Google all say their user-triggered fetchers may ignore robots.txt. Claude's doesn't.",
        },
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
                "Collects public content that may be used to train future models. Blocking it excludes future content from training — and not from search.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "A robots.txt that opts out of training while keeping Claude's search and live fetches looks like this. Named groups override a `User-agent: *` block, and the rules must be repeated on every subdomain:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Claude search index and live fetches: allow\nUser-agent: Claude-SearchBot\nAllow: /\n\nUser-agent: Claude-User\nAllow: /\n\n# Model training: your call\nUser-agent: ClaudeBot\nDisallow: /\n\n# Brave (Claude's search index) won't crawl what Googlebot can't\nUser-agent: Googlebot\nAllow: /",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Brave's crawler has no user agent of its own",
          text: "Brave's [crawler documentation](https://search.brave.com/help/brave-search-crawler) says it \"does not advertise a differentiated user agent\" and won't crawl a page Googlebot is disallowed from. You can't allow Brave by name — so a robots.txt or WAF rule that blocks Googlebot quietly removes you from Claude's search as well. Note too that robots.txt doesn't stop Brave indexing a URL it finds elsewhere; use `noindex` for that.",
        },
        {
          kind: "p",
          text: 'Check your CDN and WAF next: "block AI bots" toggles override robots.txt. Anthropic publishes its crawler IP ranges at [claude.com/crawling/bots.json](https://claude.com/crawling/bots.json) for verification — though it notes that allowing or blocking by IP alone is unreliable. The old `anthropic-ai` and `Claude-Web` tokens are retired; leaving them in robots.txt is harmless.',
        },
      ],
    },
    {
      id: "brave",
      title: "Getting into Brave Search",
      blocks: [
        {
          kind: "p",
          text: "Because Claude's candidate pages come from Brave, Brave indexing is the prerequisite that most Claude advice skips. Brave has no webmaster console and doesn't support IndexNow, so you can't push pages in. It discovers URLs two ways: its own crawler, and the opt-in Web Discovery Project, in which Brave browser users anonymously report pages they visit.",
        },
        {
          kind: "list",
          items: [
            "**Rank on Google and Bing first.** Per [MERJ's analysis](https://merj.com/blog/how-brave-search-discovers-new-pages) of the Web Discovery Project, a single opted-in user who finds your page in a Google, Bing or DuckDuckGo result can report it — otherwise a new URL needs about 20 separate visitors.",
            "**Get linked from pages Brave already knows.** Links from established sites are the crawler's main route to you.",
            "**Use the re-fetch form after changes.** [search.brave.com/submit-url](https://search.brave.com/submit-url) asks Brave to re-crawl a page. It doesn't guarantee indexing.",
            "**Keep URLs clean.** The discovery client drops URLs with more than one query parameter or a long query string, unless a canonical points to a clean version.",
            "**Put canonical and noindex in the HTML head.** The discovery client reads them from `<head>`, not from HTTP headers, and drops pages that redirect.",
            "**Stay fast and light.** Discovery fetches time out after 10 seconds and refuse pages over 2 MB.",
          ],
        },
        {
          kind: "p",
          text: "Then check where you stand: search your target questions on [search.brave.com](https://search.brave.com) — with the year appended, the way Claude writes them — and treat a top-10 Brave position as your Claude eligibility test.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "Anthropic's [web fetch documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool) is blunt: it \"does not support websites dynamically rendered via JavaScript.\" Vercel's crawler study found ClaudeBot downloading JavaScript files without running them. Whatever isn't in the HTML response doesn't exist for Claude.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Server-rendered HTML",
              status: "required",
              note: "The answer must be in the raw HTML — SSR, static generation or pre-rendering. Client-rendered React, Vue or Angular apps show Claude an empty shell.",
            },
            {
              label: "Crawlable by Googlebot",
              status: "required",
              note: "Brave mirrors Googlebot's robots rules, so a Googlebot block removes you from Claude's index source.",
            },
            {
              label: "No walls on citable content",
              status: "required",
              note: "Anthropic's bots respect CAPTCHAs and don't access login-gated pages. Interstitials and gates hide the answer.",
            },
            {
              label: "Answer near the top",
              status: "helps",
              note: "Long pages are truncated to a token budget — about 2,500 tokens per 10 kB of page. The first screens of HTML are the ones that reliably get read.",
            },
            {
              label: "Visible freshness",
              status: "helps",
              note: '`page_age` is passed to the model, and Claude\'s queries include the year. Show a real "updated" date and keep `dateModified` honest.',
            },
            {
              label: "Markdown for agents",
              status: "helps",
              note: "Claude Code sends `Accept: text/markdown`. Serving markdown to that header (Cloudflare's Markdown for Agents, or your own server) gives it a clean read.",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "No statement from Anthropic. Web fetch returns page text, so facts that exist only in JSON-LD may never reach the model — keep them in visible copy too.",
            },
            {
              label: "Sitemaps",
              status: "unconfirmed",
              note: "Not documented for Anthropic or Brave. Keep them for Google and Bing, which feed Brave's discovery indirectly.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "Anthropic publishes its own for developers, but has never said Claude reads other sites' files. Ahrefs found 97% of llms.txt files get zero requests.",
            },
            {
              label: "IndexNow",
              status: "no-effect",
              note: "Brave doesn't support it. It still helps with Bing, and so with ChatGPT.",
            },
          ],
        },
        {
          kind: "p",
          text: "The quickest test is to request a page the way Claude does and check your key sentence is there. If it isn't, neither Claude nor Brave can see it:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Does your server (and WAF) serve Claude the real content?\ncurl -s -A "Claude-User" https://yoursite.com/pricing \\\n  | grep -c "Plans start at"\n\n# 0 means the text is rendered by JavaScript or blocked',
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What Claude cites",
      blocks: [
        {
          kind: "p",
          text: "Claude's citation patterns differ sharply from ChatGPT's — the two share only 8% of cited domains. The studies agree on a few things: Claude leans on first-party and primary sources, likes fresh comparison content, and cites fewer domains per answer than Perplexity.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Brave ranking",
              body: "The strongest predictor found so far: 79.2% of cited URLs sit in Brave's top 10 for the query Claude ran.",
              evidence: "observed",
            },
            {
              title: "First-party sources",
              body: "Brand domains took 64% of Claude's citations in Otterly's June 2026 study of 379K citations in SaaS and tech. Your own pricing, docs and specs pages are citable assets.",
              evidence: "observed",
            },
            {
              title: "Primary over secondary",
              body: "Anthropic tunes Research to prefer primary sources over content farms, and evaluates it on exactly that.",
              evidence: "official",
            },
            {
              title: "Fresh lists and comparisons",
              body: "Listicles were 36.4% of the pages Claude cited, against 19.7% for ChatGPT — and nearly every query carries a year.",
              evidence: "observed",
            },
            {
              title: "Short, quotable facts",
              body: "Each citation quotes up to 150 characters. A sentence that states the fact on its own is easier to cite than one that leans on the paragraph around it.",
              evidence: "official",
            },
            {
              title: "Consistency across runs",
              body: "Claude cites a median of 3.6 domains per answer and about half change between runs (Attrifast, 2026). Measure across repeated runs, not one screenshot.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "p",
          text: "One more thing that doesn't work: buying your way in. Anthropic's [February 2026 pledge](https://www.anthropic.com/news/claude-is-a-space-to-think) says Claude will carry no sponsored links and its answers won't be influenced by advertisers.",
        },
      ],
    },
    {
      id: "measurement",
      title: "Tracking Claude traffic and crawls",
      blocks: [
        {
          kind: "p",
          text: "Clicks from Claude arrive with the referrer `claude.ai` and no UTM parameters. On 13 May 2026 GA4 added a default **AI Assistant** channel for referrers on Google's list of assistants — but Google's [channel documentation](https://support.google.com/analytics/answer/9756891) names ChatGPT, Gemini, DeepSeek, Copilot and Grok, not Claude — even though Google's [launch note](https://support.google.com/analytics/answer/9164320) names it. Check where your `claude.ai` sessions land; if they're still in Referral, add a custom channel above it with the regex below. Some app traffic loses its referrer entirely and lands in Direct.",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — Claude only\n^(.*\\.)?claude\\.ai$\n\n# Session source — all major AI assistants\nchatgpt\\.com|claude\\.ai|perplexity\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com",
        },
        {
          kind: "p",
          text: "Your server logs show the other half: which pages Claude reads. `Claude-User` hits are the best proxy you have for live demand, because each one is a real conversation that needed your page.",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Anthropic bot hits by type\ngrep -oE "ClaudeBot|Claude-SearchBot|Claude-User" access.log | sort | uniq -c\n\n# Pages Claude fetched for users — your live-demand list\ngrep "Claude-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
        },
        {
          kind: "p",
          text: "Verify that hits are genuine against the published IP ranges — except Claude Code, which fetches from users' own machines. Brave's crawler can't be separated out by user agent at all.",
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
              myth: "Blocking ClaudeBot hides you from Claude's search.",
              reality:
                "It only stops future training. Search indexing is `Claude-SearchBot`, and live fetches are `Claude-User` — they're separate rules.",
            },
            {
              myth: "Claude cites whatever ranks on Google.",
              reality:
                "Brave's top 10 predicts Claude's citations far better: 79% versus 34%. But since Brave mirrors Googlebot's access rules, Google crawlability still matters.",
            },
            {
              myth: "Claude will render my React app.",
              reality:
                "Its fetch tool doesn't run JavaScript. Only the agentic browsers — Claude in Chrome and Cowork — render pages, and those act for one user, not the index.",
            },
            {
              myth: "An llms.txt file gets you cited.",
              reality:
                "Anthropic has never said Claude reads other sites' llms.txt, and 97% of such files get no requests. It's useful for developer docs read by coding agents, not for search.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "robots",
      title: "Allow Claude-SearchBot and Claude-User in robots.txt",
      detail:
        "Check that no `User-agent: *` block catches them, and repeat the rules on every subdomain.",
      impact: "high",
    },
    {
      id: "cdn",
      title: "Check CDN, WAF and bot-management rules",
      detail:
        'Turn off blanket "block AI bots" settings for these two, and verify against `claude.com/crawling/bots.json`.',
      impact: "high",
    },
    {
      id: "googlebot",
      title: "Never block Googlebot on pages you want in Claude",
      detail: "Brave's crawler follows Googlebot's rules and has no user agent of its own.",
      impact: "high",
    },
    {
      id: "ssr",
      title: "Server-render every page you want cited",
      detail: 'Test with `curl -A "Claude-User"` that the answer is in the raw HTML.',
      impact: "high",
    },
    {
      id: "brave-rank",
      title: "Check your Brave rankings for target questions",
      detail:
        "Search them on search.brave.com with the year appended, the way Claude does. Top 10 is the bar.",
      impact: "high",
    },
    {
      id: "brave-index",
      title: "Get indexed in Brave",
      detail:
        "Rank on Google and Bing, earn links from sites Brave knows, and use the submit-url form after big changes.",
      impact: "high",
    },
    {
      id: "head-tags",
      title: "Put canonical and noindex in the HTML head",
      detail:
        "Not only in HTTP headers. Avoid redirect chains and keep canonical URLs parameter-free.",
      impact: "medium",
    },
    {
      id: "light",
      title: "Keep pages fast, light and unwalled",
      detail:
        "Under 2 MB, responding well within 10 seconds, with no CAPTCHA, interstitial or login in front of the answer.",
      impact: "medium",
    },
    {
      id: "first-party",
      title: "Publish first-party primary content",
      detail:
        "Pricing, specs, docs and original data on your own domain — the sources Claude is tuned to prefer.",
      impact: "high",
    },
    {
      id: "quotable",
      title: "Write quotable, answer-first sections",
      detail:
        "Explicit names and numbers, real HTML tables, and facts that stand alone in under 150 characters.",
      impact: "high",
    },
    {
      id: "freshness",
      title: "Show freshness honestly",
      detail:
        "A visible updated date, an accurate `dateModified`, and the current year in titles where it's true.",
      impact: "medium",
    },
    {
      id: "lists",
      title: 'Get into the "best X" lists that rank in Brave',
      detail:
        "Listicles are over a third of Claude's citations. Being named in them is a second route in.",
      impact: "medium",
    },
    {
      id: "markdown",
      title: "Serve markdown to Accept: text/markdown",
      detail: "Helps Claude Code and other agents read your docs cleanly.",
      impact: "low",
    },
    {
      id: "claudebot",
      title: "Decide on ClaudeBot deliberately",
      detail:
        "Most Claude answers don't search. Blocking training trades future visibility for control.",
      impact: "medium",
    },
    {
      id: "measure",
      title: "Set up measurement",
      detail:
        "A GA4 custom channel on the `claude.ai` regex, plus a weekly log check of `Claude-User` hits.",
      impact: "medium",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Claude?",
      a: "Allow `Claude-SearchBot` and `Claude-User`, server-render your pages, and rank in Brave Search, which holds about 79% of the URLs Claude cites in its top 10. Then publish first-party pages with fresh, clearly dated, quotable answers.",
    },
    {
      q: "What search engine does Claude use?",
      a: "Anthropic lists Brave Search as its web-search provider, and independent tests match Claude's citations to Brave's results. A second vendor, TurboPuffer, was reportedly added in May 2026 in an undisclosed role; image search in the Claude apps uses Bing.",
    },
    {
      q: "Should I block ClaudeBot?",
      a: "Only if you don't want future content used for training. Blocking `ClaudeBot` doesn't affect Claude's search, which uses `Claude-SearchBot` and `Claude-User`. The trade-off is that most Claude answers come from training data, not search.",
    },
    {
      q: "Does Claude respect robots.txt?",
      a: "Yes. Anthropic says all three of its bots follow robots.txt, including `Crawl-delay`, and respect CAPTCHAs. Unlike OpenAI's, Perplexity's and Google's user-triggered fetchers, `Claude-User` honors it too.",
    },
    {
      q: "Can Claude read JavaScript-rendered pages?",
      a: "No. Anthropic's fetch tool doesn't support JavaScript-rendered sites, and its crawlers have been observed downloading scripts without running them. Only the agentic browsers render pages.",
    },
    {
      q: "How do I track traffic from Claude?",
      a: "Clicks arrive from `claude.ai` with no UTM tags. GA4's AI Assistant channel definition doesn't list Claude, though Google's launch note names it, so check where `claude.ai` sessions land and build a custom channel if they sit in Referral. Server logs show `Claude-User` and `Claude-SearchBot` visits, which you can verify against Anthropic's published IP list.",
    },
    {
      q: "Does llms.txt help with Claude?",
      a: "There's no evidence it does. Anthropic hasn't said Claude reads other sites' llms.txt files, and log studies show they're rarely requested. It's mainly useful for developer documentation read by coding agents.",
    },
    {
      q: "Can I pay to be recommended by Claude?",
      a: "No. Anthropic's February 2026 pledge rules out sponsored links and advertiser influence on Claude's answers.",
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
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
    {
      title: "Web fetch tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool",
    },
    {
      title: "Enable and use web search",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/10684626-enable-and-use-web-search",
    },
    {
      title: "How we built our multi-agent research system",
      publisher: "Anthropic Engineering",
      href: "https://www.anthropic.com/engineering/multi-agent-research-system",
    },
    {
      title: "Claude is a space to think",
      publisher: "Anthropic",
      href: "https://www.anthropic.com/news/claude-is-a-space-to-think",
    },
    {
      title: "Brave Search crawler",
      publisher: "Brave",
      href: "https://search.brave.com/help/brave-search-crawler",
    },
    {
      title: "How Brave Search discovers new pages",
      publisher: "MERJ",
      href: "https://merj.com/blog/how-brave-search-discovers-new-pages",
    },
    {
      title: "Anthropic uses Brave for web search",
      publisher: "Simon Willison",
      href: "https://simonwillison.net/2025/Mar/21/anthropic-use-brave/",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
    {
      title: "Claude AI citation study",
      publisher: "Otterly.AI",
      href: "https://otterly.ai/blog/claude-ai-citation-study/",
    },
    {
      title: "AI search citations by vertical, 2026",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "Markdown for Agents",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/markdown-for-agents/",
    },
    {
      title: "llms.txt study",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/llmstxt-study/",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
  ],

  sameAs: ["https://en.wikipedia.org/wiki/Claude_(language_model)", "https://claude.ai"],

  furtherReading: [
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Build a robots.txt that allows Claude-SearchBot and Claude-User and makes a deliberate call on ClaudeBot.",
    },
    {
      title: "Citation tracking",
      href: "/features/citation-tracking",
      description:
        "Run a fixed prompt panel across Claude, ChatGPT, Perplexity, Gemini and Google — and see who's cited instead of you.",
    },
  ],
};
