import type { EngineGuide } from "../types";

/* Facts verified 2026-10-26 against Anthropic's help center, developer docs,
   Trust Center and the Claude Code changelog. Observed behaviour comes from
   the dated studies in `sources`. */
export const claude: EngineGuide = {
  slug: "claude",
  metaTitle: "Claude SEO: How Claude Searches, Reads and Quotes Your Pages (2026)",
  metaDescription:
    "How Claude finds and cites pages in 2026: its three bots, the Brave, TurboPuffer and Parallel search vendors, a fetcher that skips JavaScript, and the 150-character citation.",
  keywords: [
    "Claude SEO",
    "get cited by Claude",
    "Claude web search",
    "what search engine does Claude use",
    "Claude-SearchBot",
    "Claude-User",
    "ClaudeBot robots.txt",
  ],
  headline: { lead: "Claude SEO:", accent: "how to get found, read and quoted by Claude" },
  subhead:
    "Claude searches through vendors Anthropic names but doesn't explain, reads your page as plain text, and quotes at most 150 characters of it. Here's each step, what you control at it, and how to see the result in your logs.",

  shortAnswer:
    "To get cited by Claude, let **Claude-SearchBot** and **Claude-User** through your robots.txt and firewall, and serve the answer in server-rendered HTML, because Claude's fetcher doesn't run JavaScript. Be findable in the indexes behind its search: Anthropic lists **Brave Search**, TurboPuffer and Parallel as web-search vendors, and Claude's citations have tracked Brave's top 10 most closely. Then state key facts in sentences short enough to quote, since each citation carries at most **150 characters**.",

  takeaways: [
    "Anthropic runs three bots with three jobs: `ClaudeBot` collects training data, `Claude-SearchBot` indexes for search and `Claude-User` fetches pages for a live conversation. Each takes its own robots.txt rule.",
    "All three honor robots.txt, `Claude-User` included. A `Disallow` stops Claude reading your page even when a user pastes the link, and Claude Code's fetcher identifies as `Claude-User` too.",
    "Anthropic's subprocessor list names three web-search vendors: Brave Search (since March 2025), TurboPuffer (May 2026) and Parallel Web Systems (October 2026). It doesn't say which does what.",
    "The best public evidence still points at Brave: 79.2% of the URLs Claude cited ranked in Brave's top 10 in Profound's July 2026 study, which predates Parallel's arrival.",
    "Claude's fetcher reads text, HTML and PDF without running JavaScript. Anything your page builds client-side never reaches it.",
    "Every web-search citation carries up to 150 characters of quoted text. Sentences that state a fact on their own are the ones that survive the cut.",
    "Clicks arrive from `claude.ai` with no UTM tags, when they carry a referrer at all. GA4's AI Assistant channel definition doesn't list Claude, so check where those sessions land.",
  ],

  facts: [
    { label: "Web-search vendors Anthropic lists", value: "Brave · TurboPuffer · Parallel" },
    { label: "The most text one citation quotes", value: "150 characters" },
    { label: "The bot that indexes for Claude's search", value: "Claude-SearchBot", mono: true },
    { label: "Runs your JavaScript when it fetches", value: "No" },
  ],

  preview: {
    prompt: "Which project management tool has the best API for a five-person dev team?",
    status: "Searched the web · 10 results",
    answer:
      "**Plotbright** has the most complete public API of the tools a small team is likely to shortlist: REST and webhooks on every plan, including the free tier for up to five users.",
    sources: [
      { domain: "plotbright.io", title: "Plotbright API reference" },
      { domain: "apiroundup.dev", title: "Project tools with the best APIs, 2026" },
      { domain: "plotbright.io", title: "Plotbright pricing and plans" },
    ],
  },

  profile: {
    retrieval:
      "Search vendors Brave, TurboPuffer and Parallel (roles undisclosed), plus live page fetches",
    searchCrawler: "Claude-SearchBot (index) + Claude-User (live fetches)",
    trainingCrawler: "ClaudeBot — blocking it leaves search untouched",
    rendersJs: "No — the fetch tool reads text, HTML and PDF only",
    referrer: "claude.ai referral with no UTM; some clicks arrive as Direct",
    citationStyle: "Inline citations with source links, each quoting up to 150 characters",
    biggestLever: "Server-rendered, quotable first-party pages that rank in Brave",
  },

  sections: [
    {
      id: "who-searches",
      title: "When Claude searches, and whose index it searches",
      blocks: [
        {
          kind: "p",
          text: "Claude answers from what it learned in training unless the question needs something current. Anthropic's [web search documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) lists what triggers a search: recent events, current prices and statistics, organizations, people or products that might have changed, and explicit requests to look something up. Settled facts, maths, coding concepts and creative work are answered directly. In Profound's July 2026 test, Claude searched on **36.6%** of prompts, and words like “best”, “near me” or a year made a search more likely.",
        },
        {
          kind: "p",
          text: "In the Claude apps that decision is increasingly Claude's alone. Since 16 September 2026 Anthropic has been folding Cowork into every conversation on Pro and Max, and its [web search help article](https://support.claude.com/en/articles/10684626-enable-and-use-web-search) says that on this new experience “there's no web search toggle. Claude searches the web when it helps.”",
        },
        { kind: "h3", text: "Three vendors carry the label “Web Search”" },
        {
          kind: "p",
          text: "Anthropic's product docs never name a search provider. Its [subprocessor list](https://trust.anthropic.com/subprocessors) does, and as of 26 October 2026 three companies sit under the purpose “Web Search”:",
        },
        {
          kind: "table",
          head: ["Vendor", "Listed since", "What it is", "What you can control"],
          rows: [
            [
              "**Brave Search**",
              "March 2025",
              "An independent search engine with its own index",
              "Nothing by name: its crawler follows Googlebot's robots.txt rules, and `noindex` removes a page",
            ],
            [
              "**TurboPuffer**",
              "6 May 2026",
              "A vector and full-text search database",
              "Nothing directly. It's infrastructure, not a crawler",
            ],
            [
              "**Parallel Web Systems**",
              "14 October 2026",
              "A web search API for AI agents with its own index",
              "Its crawler, `ShapBot`, which robots.txt can allow or block",
            ],
          ],
        },
        {
          kind: "p",
          text: "Anthropic hasn't said which vendor serves which query or how results are combined. The public record is the timeline. [Simon Willison](https://simonwillison.net/2025/Mar/21/anthropic-use-brave/) spotted Brave on the list in March 2025, found a `BraveSearchParams` schema in Claude's search tool, and saw Claude's ten citations for a test query exactly match Brave's results. The Trust Center's [update log](https://trust.anthropic.com/updates) describes TurboPuffer (6 May 2026) and Parallel (14 October 2026) in the same words: each “provides web search for all Anthropic products except Claude for Government.”",
        },
        {
          kind: "stats",
          items: [
            {
              value: "79.2%",
              label:
                "of URLs Claude cited also ranked in Brave's top 10 for the query, across about 35,000 URLs from 400 queries",
              source: {
                name: "Profound, Jul 2026",
                href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
              },
            },
            {
              value: "34%",
              label:
                "overlap between the domains Claude cited and Google's top 10 (64% against Google's top 50)",
              source: {
                name: "Profound, Jul 2026",
                href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
              },
            },
            {
              value: "94%",
              label:
                "of Claude's search fan-out queries included the year, against 17% for ChatGPT",
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
          title: "Put a date on the Brave numbers",
          text: "Profound published on 22 July 2026, nearly three months before Parallel joined the subprocessor list, and Profound itself calls the Brave overlap an observed match, not proof of cause. Brave rankings are still the best public predictor of Claude citations. They're no longer the whole picture, so check your visibility in more than one index.",
        },
        { kind: "h3", text: "One search turn, step by step" },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Claude decides a search would help",
              body: "Current, changing or specific questions trigger one; settled knowledge doesn't. Developers building on Claude can cap searches per request with `max_uses`.",
              lever:
                "Cover the things that make Claude search, such as prices, specs, comparisons and recent changes, not only evergreen explainers.",
            },
            {
              title: "It writes its own queries",
              body: "Anthropic says simple questions take one to three searches and comparisons ten or more. In Profound's data, 94% of Claude's queries carried a year.",
              lever: "Use an honest year in titles and headings wherever freshness matters.",
            },
            {
              title: "Results come back with a page age",
              body: "Each result carries a URL, a title and `page_age`, which Anthropic describes as when the site was last updated. Newer tool versions let Claude run code that filters results before it reads them.",
              lever:
                "Keep a visible updated date and an accurate `dateModified`, so the age Claude sees is the real one.",
            },
            {
              title: "Claude fetches the pages it needs",
              body: "Full pages arrive through web fetch as text, HTML or PDF. No JavaScript runs, and Claude can only fetch URLs that already appeared in the conversation or its search results.",
              lever: "Put the answer in the server-rendered HTML, near the top.",
            },
            {
              title: "It answers with citations attached",
              body: "Citations are always on for web search. Each one carries the source URL, its title and up to 150 characters of cited text.",
              lever: "State key facts in sentences that still make sense when lifted out alone.",
            },
          ],
        },
      ],
    },
    {
      id: "three-bots",
      title: "ClaudeBot, Claude-SearchBot, Claude-User: three bots, three switches",
      blocks: [
        {
          kind: "p",
          text: "Anthropic's [crawler article](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) names three user agents, each tied to a different outcome. Block the wrong one and you lose something you meant to keep. Flip them below to see the robots.txt each choice produces.",
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "Claude-SearchBot",
              role: "search",
              purpose:
                "Crawls “to improve search result quality for users.” Blocking it stops indexing for search, which Anthropic says “may reduce your site's visibility and accuracy in user search results.”",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Claude-User",
              role: "user",
              purpose:
                "Fetches a page when a user's question needs it, including links users paste, and Claude Code's `WebFetch` since version 2.1.83. Blocking it stops Claude retrieving your content for those requests.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "ClaudeBot",
              role: "training",
              purpose:
                "Collects public web content that could contribute to model training. Blocking it excludes your future content from training datasets. It doesn't remove you from search.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "Two rules hold whatever you choose. A group that names a bot overrides `User-agent: *`, so a blanket block stops applying once the bot is named. And Anthropic asks for the rules on every subdomain you want covered, since each serves its own robots.txt.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Slow a bot down instead of shutting it out",
          text: "Anthropic supports the non-standard `Crawl-delay` directive, so `Crawl-delay: 1` under a Claude user agent eases server load without losing the visibility that bot brings.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Your firewall can overrule robots.txt",
          text: "CDN and WAF “block AI bots” settings stop these bots before they read robots.txt at all. Anthropic publishes its crawler IPs at [claude.com/crawling/bots.json](https://claude.com/crawling/bots.json) so you can verify a request is really Anthropic's, but it advises against blocking by IP, which “may not work correctly or persistently guarantee an opt-out.”",
        },
        {
          kind: "p",
          text: "Older templates still list `anthropic-ai` and `Claude-Web`. Anthropic's current article names neither, so rules for them don't govern the three bots above. Make sure your file names the current tokens.",
        },
      ],
    },
    {
      id: "upstream-indexes",
      title: "The indexes behind Claude's search, and how to get into each",
      blocks: [
        {
          kind: "p",
          text: "Allowing Anthropic's bots gets you read. Getting found also depends on the vendors' own indexes, and two of the three run crawlers you can influence.",
        },
        { kind: "h3", text: "Brave Search" },
        {
          kind: "p",
          text: "Brave's [crawler page](https://search.brave.com/help/brave-search-crawler) says its bot “does not advertise a differentiated user agent”, and that “if a domain or page is not crawlable by Googlebot, then Brave Search's bot will not crawl it either.” There's no Brave line to add to robots.txt, so a rule or WAF setting that blocks Googlebot quietly costs you Brave as well. Brave also notes that robots.txt doesn't stop indexing: use `noindex` and ask for a re-fetch.",
        },
        {
          kind: "p",
          text: "Brave finds new pages partly through its opt-in Web Discovery Project, where Brave browser users report pages anonymously. [MERJ's July 2026 teardown](https://merj.com/blog/how-brave-search-discovers-new-pages) of the reporting client turns its rules into a hygiene list:",
        },
        {
          kind: "list",
          items: [
            "**Rank somewhere else first.** One opted-in user who sees your URL in another engine's results can report it. A page found only by browsing needs reports from 20 different users on different networks.",
            "**Keep URLs clean.** Without a qualifying canonical, a second query parameter or a query string over 22 characters marks the URL private.",
            '**Put canonical and noindex in the HTML.** The client reads `<link rel="canonical">` and `noindex` from the page itself, never from the `Link` or `X-Robots-Tag` headers.',
            "**Skip the redirects.** Any redirect counts as private. The page must answer 200 at exactly the URL reported.",
            "**Stay light.** The check gives up after 10 seconds and refuses responses over 2 MB.",
            "**Request a re-crawl after big changes.** Brave's [submission form](https://search.brave.com/submit-url) asks for a re-fetch. It doesn't guarantee indexing.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "These are the discovery client's rules",
          text: "MERJ points out that Brave's server-side crawler may behave differently, and it can't be observed from the client code. Treat the list as eligibility hygiene, not a ranking formula.",
        },
        { kind: "h3", text: "Parallel Web Systems" },
        {
          kind: "p",
          text: "[Parallel](https://parallel.ai/) says it runs “our own web-scale index with billions of pages.” Its [crawler docs](https://docs.parallel.ai/resources/crawler) name `ShapBot`, which “helps discover and index websites for Parallel's web APIs”, and its [bot overview](https://parallel.ai/parallel-web-systems-bots) warns that restricting it “may reduce your site's visibility and discoverability.” A separate `Shap-User` agent fetches pages on behalf of users. Anthropic hasn't said what it uses Parallel for, but with Parallel on the list as a web-search vendor, allowing `ShapBot` is a cheap hedge.",
        },
        { kind: "h3", text: "TurboPuffer" },
        {
          kind: "p",
          text: "[TurboPuffer](https://turbopuffer.com/) describes itself as “vector and full-text search built on object storage” and lists Anthropic as a customer. It's a database, not a crawler: there's nothing to allow or block, and nothing public about what it stores for Claude.",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Brave has no user agent of its own: it follows Googlebot's rules\nUser-agent: Googlebot\nAllow: /\n\n# Parallel Web Systems, one of Claude's listed web-search vendors\nUser-agent: ShapBot\nAllow: /",
        },
        {
          kind: "p",
          text: "Then check where you stand. Search your target questions on [search.brave.com](https://search.brave.com) with the year added, the way Claude writes them. A top-10 Brave result is the nearest thing to a public test of whether Claude can find you.",
        },
      ],
    },
    {
      id: "what-the-fetcher-sees",
      title: "What Claude's fetcher actually receives from your page",
      blocks: [
        {
          kind: "p",
          text: "When Claude reads a page it uses web fetch, and Anthropic's [fetch documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool) is plain about it: the tool “currently does not support websites dynamically rendered with JavaScript.” It accepts text, HTML and PDF, refuses anything else, and hands Claude the page's text. Vercel's crawler study saw the same on the crawling side: ClaudeBot downloaded JavaScript files, 23.84% of its requests, without executing them.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "The answer in the HTML response",
              status: "required",
              note: "Server-side rendering, static generation or pre-rendering. A client-rendered app shows Claude an empty shell.",
            },
            {
              label: "Robots.txt that allows Claude-User",
              status: "required",
              note: "Web fetch refuses URLs that robots.txt blocks, returning a `url_not_allowed` error, and Claude carries on without you.",
            },
            {
              label: "No wall in front of the answer",
              status: "required",
              note: "Anthropic's bots don't try to bypass CAPTCHAs, and a login or interstitial ends the fetch at the door.",
            },
            {
              label: "The answer near the top",
              status: "helps",
              note: "Anthropic sizes an average 10 kB page at about 2,500 tokens. Developers cap fetches with `max_content_tokens`, and anything past the cap is truncated.",
            },
            {
              label: "Clear headings and real tables",
              status: "helps",
              note: "Newer fetch versions let Claude run code to filter a page before reading it. Our read: descriptive headings and HTML tables make the relevant part easier to keep.",
            },
            {
              label: "Markdown on request",
              status: "helps",
              note: "Cloudflare reports that Claude Code sends `Accept` headers asking for markdown. Serving it, as Cloudflare's Markdown for Agents does, gives coding agents a cleaner read.",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "Anthropic has said nothing about schema. Fetch returns page text, so facts that live only in JSON-LD may never reach the model. Repeat them in visible copy.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "Anthropic hasn't said Claude reads other sites' llms.txt. Ahrefs found 97% of the files it tracked got no requests in May 2026. Among the requests that did come in, Claude Code out-fetched every AI search bot and assistant.",
            },
            {
              label: "IndexNow",
              status: "no-effect",
              note: "Brave isn't an IndexNow participant; the protocol's list is Amazon, Bing, Naver, Seznam, Yandex and Yep. It still helps you with Bing.",
            },
          ],
        },
        {
          kind: "p",
          text: "Fetch results are also cached, so Anthropic warns the copy Claude reads “might not always reflect the latest version.” The quickest test is to request a page the way Claude does and look for the sentence you want quoted. If it isn't there, Claude can't see it either:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Does your server (and WAF) give Claude the real content?\ncurl -s -A "Claude-User" https://yoursite.com/pricing \\\n  | grep -c "Plans start at"\n\n# 0 means the text is rendered by JavaScript, or the request was blocked',
        },
      ],
    },
    {
      id: "browsing-agents",
      title: "When Claude opens a real browser: Chrome, Cowork and Research",
      blocks: [
        {
          kind: "p",
          text: "Web fetch is Claude's default reader, not its only one. Three surfaces go further, and they change what “visible to Claude” means.",
        },
        {
          kind: "list",
          items: [
            "**Claude in Chrome** is a browser extension on paid plans (Pro, Max, Team and Enterprise). Anthropic's [setup guide](https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome) says it lets Claude “read, click, and navigate websites alongside you”, typing, filling in forms and running scheduled browser tasks. It works inside the user's own Chrome, so pages render as they would for that user.",
            "**Research** “runs multiple searches that build on each other and decides what to look into next”, according to Anthropic's [Research guide](https://support.claude.com/en/articles/11088861-use-research-on-claude). Its [engineering write-up](https://www.anthropic.com/engineering/multi-agent-research-system) says complex questions can use more than 10 subagents, and that early versions “consistently chose SEO-optimized content farms over authoritative but less highly-ranked sources” until the evaluation asked for “primary sources over lower-quality secondary sources.”",
            "**Cowork in every conversation.** Anthropic's [release notes](https://support.claude.com/en/articles/12138966-release-notes) date the merge of chat and Cowork, its mode for longer multi-step tasks, to 16 September 2026 for Pro and Max. Agent-style work increasingly starts in an ordinary chat.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Browser agents don't announce themselves like crawlers do",
          text: "Anthropic documents user agents for its three bots, not for Claude in Chrome. Our read: because it drives the user's own browser, its visits look like that user's browsing. Robots.txt rules for Claude's bots probably don't apply, and analytics may count the visit as a person.",
        },
        {
          kind: "p",
          text: "For an agent, a page has to work as well as read well. Our read: the pages an agent is sent to act on, like pricing, sign-up, booking and comparisons, should load without a CAPTCHA wall, keep key facts in text rather than images, and use buttons and form fields with clear labels.",
        },
      ],
    },
    {
      id: "quotable",
      title: "Writing for a citation that quotes 150 characters",
      blocks: [
        {
          kind: "p",
          text: "Claude's citations are built into the search tool, not added afterwards. Anthropic's [API docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) say citations “are always enabled for web search”, and each carries the source's URL, its title and `cited_text`: “up to 150 characters of the cited content.” In the apps, Anthropic's [help article](https://support.claude.com/en/articles/10684626-enable-and-use-web-search) promises that “every response includes citations”, with direct citations to sources, links for further reading and relevant quotes.",
        },
        {
          kind: "p",
          text: "That 150-character window is the unit you're competing for. A sentence that names its subject and carries its own number can be quoted whole. One that leans on the paragraph before it gets cut mid-thought, or skipped for a page that says it more plainly.",
        },
        {
          kind: "table",
          head: ["Hard to quote", "Easy to quote"],
          rows: [
            [
              "“As mentioned above, it's included on all of them, even the free one.”",
              "“Plotbright includes REST API access and webhooks on every plan, including Free.”",
            ],
            [
              "“Pricing depends on your needs, so get in touch for a quote.”",
              "“Plotbright costs $8 per user per month, billed annually. Free covers up to five users.”",
            ],
            [
              "“Our latest update brings big improvements to sync speed.”",
              "“Since its October 2026 release, Plotbright syncs boards in under a second.”",
            ],
          ],
        },
        {
          kind: "list",
          items: [
            "**One fact per sentence, subject named.** Use the product or company name instead of “it” or “we” in the sentences you most want quoted.",
            "**Answer first.** Put the direct answer straight under each heading, then the context.",
            "**Numbers with units and dates.** “$8 per user per month” beats “affordable”, and “as of October 2026” beats “recently”.",
            "**Comparisons in real HTML tables.** Specs and prices in a table are text Claude can read. The same numbers in an image aren't.",
            "**An honest updated date.** Claude's queries usually carry a year and every result arrives with a `page_age`, so a visible, accurate date is part of the answer.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Your sentence travels beyond claude.ai",
          text: "Apps built on Claude's API receive the same `cited_text` with every web-search citation, and Anthropic requires that citations to the original source be shown when outputs go straight to end users. A quotable sentence keeps working inside products you'll never see.",
        },
      ],
    },
    {
      id: "what-it-cites",
      title: "What Claude tends to cite, study by study",
      blocks: [
        {
          kind: "p",
          text: "No study sees inside Claude's selection, and they don't all agree. These are the patterns with the most support, each marked with how strong the evidence is.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Pages that rank in Brave",
              body: "79.2% of cited URLs sat in Brave's top 10 for the query in Profound's July 2026 study, measured before Parallel joined the vendor list.",
              evidence: "observed",
            },
            {
              title: "Your own domain",
              body: "Brand and company sites took 64% of 379,321 Claude citations in Otterly's June 2026 study of SaaS and tech queries. Pricing, docs and spec pages are citable assets.",
              evidence: "observed",
            },
            {
              title: "Primary sources",
              body: "Anthropic's Research evaluation rewards primary sources over lower-quality secondary ones. Original data and first-hand documentation are what it's tuned to find.",
              evidence: "official",
            },
            {
              title: "Fresh lists and comparisons",
              body: "Listicles were 36.4% of Claude's classified citations against 19.7% for ChatGPT, per Profound. Being named in current “best X” lists is a second way in.",
              evidence: "observed",
            },
            {
              title: "A separate race from ChatGPT",
              body: "Claude and ChatGPT shared 8% of cited domains in Profound's data and 13% in Otterly's. Winning one says little about the other.",
              evidence: "observed",
            },
            {
              title: "Forums: the studies disagree",
              body: "Profound put forums and UGC at 0.9% of Claude's citations and Otterly counted no Reddit citations in SaaS and tech, but Attrifast's 12-vertical panel had Reddit at 7.9%. Check your own category first.",
              evidence: "observed",
            },
            {
              title: "Volatile from run to run",
              body: "Attrifast found a median of 3.6 domains per Claude answer, and only 33% of citations appeared in all three runs of the same prompt. Judge visibility over repeated runs.",
              evidence: "observed",
            },
            {
              title: "Placement can't be bought",
              body: "Anthropic's February 2026 pledge says Claude will stay ad-free, with no sponsored links and no advertiser influence on its responses.",
              evidence: "official",
            },
          ],
        },
      ],
    },
    {
      id: "claude-in-analytics",
      title: "Finding Claude in GA4 and your server logs",
      blocks: [
        {
          kind: "p",
          text: "When a click from Claude carries a referrer, it's `claude.ai`, with no UTM tags. Analytics vendors [report](https://www.terminusapp.com/blog/tracking-ai-referral-traffic/) that many clicks carry none, app traffic especially, and those land in Direct. Treat your Referral count as a floor.",
        },
        {
          kind: "p",
          text: "GA4 added a default **AI Assistant** channel on 13 May 2026. Google's [launch note](https://support.google.com/analytics/answer/9164320) names Claude, but the [channel definition](https://support.google.com/analytics/answer/9756891) lists “ChatGPT, Gemini, Deepseek, Copilot, or Grok.” Check where your `claude.ai` sessions actually land. If they're still in Referral, add a custom channel group above Referral with a session-source rule:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source matches regex: Claude only\n^(.*\\.)?claude\\.ai$\n\n# Every major assistant in one channel\n(chatgpt\\.com|claude\\.ai|perplexity\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com)",
        },
        {
          kind: "p",
          text: "Your server logs show the reading side, and each user agent answers a different question:",
        },
        {
          kind: "table",
          head: ["In your logs", "What it means", "What to do with it"],
          rows: [
            [
              "`Claude-User`",
              "A conversation needed this page, right then",
              "Your live-demand list: keep these pages fast, current and unwalled",
            ],
            [
              "`Claude-SearchBot`",
              "Anthropic is indexing the page for search",
              "Check it reaches the pages you want found, not just the homepage",
            ],
            [
              "`ClaudeBot`",
              "Content collected for possible training",
              "Use `Crawl-delay` if load matters. Block only by choice",
            ],
            [
              "`ShapBot`",
              "Parallel is indexing the page for its search API",
              "Leave it allowed while Anthropic lists Parallel as a vendor",
            ],
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Anthropic and Parallel bot hits, by user agent\ngrep -oE "ClaudeBot|Claude-SearchBot|Claude-User|ShapBot" access.log | sort | uniq -c\n\n# The pages Claude fetched for users: your live-demand list\ngrep "Claude-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
        },
        {
          kind: "p",
          text: "Verify crawler hits against Anthropic's published [IP ranges](https://claude.com/crawling/bots.json), and expect one exception: Claude Code's `WebFetch` runs wherever Claude Code runs, often a developer's own machine, so those `Claude-User` requests won't come from Anthropic's addresses. Rankbox's free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) groups these hits by bot and page.",
        },
      ],
    },
    {
      id: "dead-ends",
      title: "Five shortcuts that don't work on Claude",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking ClaudeBot hides you from Claude.",
              reality:
                "It only opts your future content out of training. Search indexing is `Claude-SearchBot` and live reading is `Claude-User`, each with its own rule.",
            },
            {
              myth: "Claude searches Google, so Google rankings are enough.",
              reality:
                "Anthropic's listed web-search vendors are Brave, TurboPuffer and Parallel. Google still matters indirectly: Brave won't crawl what Googlebot can't, and a Google ranking helps Brave discover the URL.",
            },
            {
              myth: "Claude will render my JavaScript app.",
              reality:
                "Its fetch tool doesn't run JavaScript. Only browser surfaces like Claude in Chrome render pages, and they act for one user at a time, not for search.",
            },
            {
              myth: "An llms.txt file gets you cited.",
              reality:
                "Anthropic has never said Claude reads other sites' llms.txt. It can help coding agents that read developer docs. There's no evidence it's a search signal.",
            },
            {
              myth: "Placement in Claude's answers can be bought.",
              reality:
                "Anthropic's February 2026 pledge rules out sponsored links and advertiser influence on Claude's responses.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "robots",
      title: "Allow Claude-SearchBot and Claude-User by name",
      detail:
        "Named groups override `User-agent: *`. Put the same rules on every subdomain you want covered.",
      impact: "high",
    },
    {
      id: "waf",
      title: "Check your CDN and WAF bot rules",
      detail:
        "Turn off blanket “block AI bots” settings for these two, and verify requests against `claude.com/crawling/bots.json`.",
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
      detail: 'Check with `curl -A "Claude-User"` that the key sentence is in the raw HTML.',
      impact: "high",
    },
    {
      id: "unwall",
      title: "Take the walls off citable pages",
      detail: "No CAPTCHA, login or interstitial in front of pricing, docs or comparisons.",
      impact: "high",
    },
    {
      id: "brave-check",
      title: "Search your target questions on Brave, with the year",
      detail: "A top-10 Brave result is the nearest public test of whether Claude can find you.",
      impact: "high",
    },
    {
      id: "brave-hygiene",
      title: "Make your URLs easy for Brave to discover",
      detail:
        "Canonical and `noindex` in the HTML head, no redirects, clean URLs and pages under 2 MB.",
      impact: "medium",
    },
    {
      id: "shapbot",
      title: "Allow ShapBot",
      detail: "Parallel is on Anthropic's web-search vendor list, and ShapBot builds its index.",
      impact: "medium",
    },
    {
      id: "quotable",
      title: "Rewrite key facts as standalone sentences",
      detail: "Name the subject, include the number and keep it under 150 characters.",
      impact: "high",
    },
    {
      id: "first-party",
      title: "Publish the primary source yourself",
      detail: "Pricing, specs, docs and original data on your own domain.",
      impact: "high",
    },
    {
      id: "freshness",
      title: "Show an honest updated date",
      detail: "Visible on the page and matched by `dateModified`.",
      impact: "medium",
    },
    {
      id: "lists",
      title: "Get named in current “best X” lists",
      detail: "Listicles were over a third of Claude's classified citations in Profound's study.",
      impact: "medium",
    },
    {
      id: "agent-ready",
      title: "Make key flows usable by a browser agent",
      detail:
        "Pricing, sign-up and booking pages that load without a CAPTCHA and use labelled controls.",
      impact: "low",
    },
    {
      id: "claudebot",
      title: "Decide on ClaudeBot deliberately",
      detail:
        "Claude answered 63.4% of prompts without searching in Profound's test. Blocking training trades future presence for control.",
      impact: "medium",
    },
    {
      id: "measure",
      title: "Set up a Claude channel and a log check",
      detail: "A GA4 custom channel on `claude.ai`, plus a weekly look at `Claude-User` hits.",
      impact: "medium",
    },
  ],

  faqs: [
    {
      q: "What search engine does Claude use?",
      a: "Anthropic doesn't name one in its product docs. Its subprocessor list names three web-search vendors: Brave Search (listed since March 2025), TurboPuffer (May 2026) and Parallel Web Systems (October 2026), without saying which does what. Independent tests have matched Claude's citations most closely to Brave's results. Image search in the Claude apps is powered by Bing.",
    },
    {
      q: "How do I get my website cited by Claude?",
      a: "Allow `Claude-SearchBot` and `Claude-User`, serve your content as server-rendered HTML, and make sure you can be found in Brave, where 79.2% of Claude-cited URLs ranked top 10 in Profound's July 2026 study. Then publish first-party pages that state key facts in short, standalone sentences.",
    },
    {
      q: "Should I block ClaudeBot?",
      a: "Only if you don't want future content used for training. Blocking `ClaudeBot` doesn't affect Claude's search, which runs on `Claude-SearchBot` and `Claude-User`. The trade-off is that Claude answered 63.4% of prompts without searching in Profound's test, so training data shapes most of what it says.",
    },
    {
      q: "Does Claude respect robots.txt?",
      a: "Yes. Anthropic says its bots honor robots.txt, support the non-standard `Crawl-delay` and don't try to bypass CAPTCHAs. Its web fetch tool refuses URLs that robots.txt blocks, and Claude Code's `WebFetch` identifies as `Claude-User`, so the same rule covers it.",
    },
    {
      q: "Can Claude read JavaScript-rendered pages?",
      a: "Not with its fetch tool, which Anthropic says doesn't support pages rendered with JavaScript. Claude in Chrome works inside a real browser and does see rendered pages, but that's one user's session, not Claude's search.",
    },
    {
      q: "How many characters does a Claude citation quote?",
      a: "Up to 150. Each web-search citation carries the source URL, its title and `cited_text`, which Anthropic caps at 150 characters of the cited content.",
    },
    {
      q: "How do I track traffic from Claude?",
      a: "Look for the referrer `claude.ai`, which comes with no UTM tags, and expect some clicks to land in Direct. GA4's AI Assistant channel definition doesn't list Claude, so add a custom channel if `claude.ai` sessions sit in Referral, and watch `Claude-User` hits in your server logs.",
    },
    {
      q: "Can I pay to appear in Claude's answers?",
      a: "No. Anthropic's February 2026 pledge says Claude will remain ad-free, with no sponsored links and no advertiser influence on its responses.",
    },
  ],

  sources: [
    {
      title: "Does Anthropic crawl data from the web, and how can site owners block the crawler?",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    {
      title: "Subprocessors",
      publisher: "Anthropic Trust Center",
      href: "https://trust.anthropic.com/subprocessors",
    },
    {
      title: "Trust Center updates (subprocessor changes, May and October 2026)",
      publisher: "Anthropic Trust Center",
      href: "https://trust.anthropic.com/updates",
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
      title: "Release notes",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/12138966-release-notes",
    },
    {
      title: "Get started with Claude in Chrome",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome",
    },
    {
      title: "Use Research on Claude",
      publisher: "Anthropic Help Center",
      href: "https://support.claude.com/en/articles/11088861-use-research-on-claude",
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
      title: "Anthropic crawler IP ranges",
      publisher: "Anthropic",
      href: "https://claude.com/crawling/bots.json",
    },
    {
      title: "Claude Code changelog (2.1.83: WebFetch identifies as Claude-User)",
      publisher: "Anthropic on GitHub",
      href: "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md",
    },
    {
      title: "Anthropic Trust Center: Brave Search added as a subprocessor",
      publisher: "Simon Willison",
      href: "https://simonwillison.net/2025/Mar/21/anthropic-use-brave/",
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
      title: "ShapBot crawler",
      publisher: "Parallel Web Systems docs",
      href: "https://docs.parallel.ai/resources/crawler",
    },
    {
      title: "Overview of Parallel Web Systems' bots",
      publisher: "Parallel Web Systems",
      href: "https://parallel.ai/parallel-web-systems-bots",
    },
    {
      title: "Parallel: where agents find answers",
      publisher: "Parallel Web Systems",
      href: "https://parallel.ai/",
    },
    {
      title: "turbopuffer: search every byte",
      publisher: "turbopuffer",
      href: "https://turbopuffer.com/",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal, Jasman Singh)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
    {
      title: "Claude citation study",
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
      title: "Introducing Markdown for Agents",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/markdown-for-agents/",
    },
    {
      title: "llms.txt study",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/llmstxt-study/",
    },
    {
      title: "IndexNow FAQ",
      publisher: "IndexNow",
      href: "https://www.indexnow.org/faq",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "What's new in Google Analytics (New AI Assistant traffic measurement)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9164320",
    },
    {
      title: "How to track referral traffic from ChatGPT, Claude and Perplexity",
      publisher: "Terminus",
      href: "https://www.terminusapp.com/blog/tracking-ai-referral-traffic/",
    },
  ],

  sameAs: ["https://en.wikipedia.org/wiki/Claude_(language_model)", "https://claude.ai"],

  furtherReading: [
    {
      title: "AI crawler robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Build a robots.txt that allows Claude-SearchBot and Claude-User and makes a deliberate call on ClaudeBot.",
    },
    {
      title: "AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "Paste your access log and see which Claude bots visit, and which pages they read.",
    },
    {
      title: "ClaudeBot, defined",
      href: "/glossary/claudebot",
      description: "Anthropic's training crawler, and how it differs from the bots behind search.",
    },
  ],
};
