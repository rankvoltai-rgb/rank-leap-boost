import type { EngineGuide } from "../types";

export const grok: EngineGuide = {
  slug: "grok",
  metaTitle: "Grok SEO: The Technical Guide to Getting Cited by Grok",
  metaDescription:
    "How Grok searches the web and X, why it has no documented crawler, what it cites, what Grokipedia does and doesn't do, and how to measure Grok when referrers are stripped.",
  keywords: [
    "Grok SEO",
    "get cited by Grok",
    "Grok web search",
    "Grok user agent",
    "Grok X search citations",
    "how does Grok choose sources",
  ],
  headline: { lead: "Grok SEO:", accent: "the technical guide to getting cited by Grok" },
  subhead:
    "Grok searches two live sources — the open web and X — and cites both inline. xAI publishes no crawler, no index provider and no robots.txt token, so the playbook differs from every other engine. Here's what's documented, what's been measured, and what to do.",

  shortAnswer:
    "To get cited by Grok, serve your key pages as plain server-rendered HTML, keep bot challenges off them, and be present in both places Grok searches: the open web and **X**. xAI documents a web search tool that browses pages and an X search tool that finds posts by keyword, meaning, account and thread — but no crawler user agent or robots.txt token, so there's nothing to allow by name. The work is crawlable first-party pages, mentions on the community sites Grok cites most, and an active X account that states your facts in text.",

  takeaways: [
    "Grok has two live sources: web search with page browsing, and X search by keyword, meaning, account and thread. Both are cited inline.",
    'xAI publishes no crawler documentation. Cloudflare says Grok\'s fetcher "does not self-identify at all," and tests saw only browser-like user agents.',
    "`GrokBot`, `xAI-Grok` and `Grok-DeepSearch` come from third-party bot lists, not xAI. A robots.txt rule naming them may never match a request.",
    "Reddit (16.3%), YouTube (15.1%) and Facebook (13.9%) lead Grok's 50 most-cited domains in Ahrefs' June 2026 data. x.com is 12th, at 1.4%.",
    "In a June 2026 test, Grok answered from a page's raw HTML even though one of its fetch nodes ran the JavaScript. Server-render.",
    "grok.com's citation links carry `noreferrer`, so many Grok clicks land in Direct — where GA4's new AI Assistant channel can't see them.",
  ],

  facts: [
    { label: "Monthly users of Grok's AI features (Mar 2026)", value: "117M" },
    { label: "Live sources Grok searches", value: "Web + X" },
    { label: "Crawler user agent xAI documents", value: "None" },
    { label: "Reddit's share of Grok's top-50 cited domains", value: "16.3%" },
  ],

  preview: {
    prompt: "Is Plannora or Loopcraft better for a five-person startup right now?",
    status: "Thought for 11s",
    answer:
      "**Plannora** is the stronger pick for a five-person team today: its free plan now covers five seats, and recent posts from small teams praise its automations. Loopcraft starts at $8 per seat.",
    sources: [
      { domain: "plannora.io", title: "Plannora pricing: free for teams of up to 5" },
      { domain: "x.com", title: "@plannora: Our free plan now covers 5 seats" },
      { domain: "stackreview.co", title: "Plannora vs Loopcraft: 2026 comparison" },
      { domain: "founderforum.net", title: "Loopcraft or Plannora for a tiny team?" },
    ],
  },

  profile: {
    retrieval:
      "Live web search plus X search (keyword, semantic, user, thread); web index undisclosed",
    searchCrawler: "None documented — fetches use browser user agents",
    trainingCrawler: "None documented for websites; X posts via X's Grok setting",
    rendersJs: "Not documented — a June 2026 test found answers used raw HTML",
    referrer: "grok.com when kept; citation links strip it, so often Direct",
    citationStyle: "Inline site-name and @handle pills, plus an “N sources” favicon stack",
    biggestLever: "Crawlable first-party pages plus an X account that states your facts",
  },

  sections: [
    {
      id: "how-grok-searches",
      title: "How Grok searches the web and X",
      blocks: [
        {
          kind: "p",
          text: 'Grok answers from training when it can and searches when a question needs something current. SpaceX\'s [May 2026 S-1](https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm) describes Grok Chat as offering "real-time integration of web search, X data, code execution, and multimodal analysis" on grok.com, the Grok apps, inside X and through the API. xAI — acquired by SpaceX effective 2 February 2026 and now branded SpaceXAI — gives its API the same two search tools, and their documentation is the clearest public description of what Grok can do.',
        },
        {
          kind: "p",
          text: 'The [Web Search tool](https://docs.x.ai/developers/tools/web-search) lets Grok "search the web in real-time and browse web pages." The [X Search tool](https://docs.x.ai/developers/tools/x-search) performs "keyword search, semantic search, user search, and thread fetch on X." What the docs leave out matters as much: xAI names no search provider, publishes no index size and documents no crawler. Where Grok\'s web results come from is not public.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Grok decides whether to search",
              body: 'The model "decides what to do next: make a tool call, or provide a final answer," per xAI\'s [tools overview](https://docs.x.ai/developers/tools/overview), and can chain several tools per question. Stable knowledge comes from pre-training, which the [Grok 4 model card](https://data.x.ai/2025-08-20-grok-4-model-card.pdf) says includes "publicly available Internet data."',
              lever:
                "Be in the training data: public, crawlable pages are the only route, since xAI gives websites no documented opt-in or opt-out token.",
            },
            {
              title: "It searches the web and X, often in parallel",
              body: 'xAI\'s published prompt for @grok says "parallel search should be used to find diverse viewpoints." The chat prompt tells Grok to "search for a distribution of sources that represents all parties/stakeholders" on controversial questions, and not to "shy away from deeper and wider searches" on X.',
              lever:
                "Be one of the viewpoints it finds: a first-party page for the facts, and posts on X that state them.",
            },
            {
              title: "An undisclosed web index returns candidates",
              body: "xAI doesn't name the index or say how it ranks results. There's no webmaster console, no URL submission and no IndexNow participation.",
              lever:
                "Keep your own pages crawlable, and earn mentions where Grok's citations already concentrate: Reddit, YouTube, review sites.",
            },
            {
              title: "Grok opens the pages it needs",
              body: 'Grok 4 Fast "hops through links, ingests media (including images and videos on X)," per [xAI\'s September 2025 launch post](https://x.ai/news/grok-4-fast). The fetches carry browser-like user agents from datacenter IPs, and in a June 2026 test the answer came from raw HTML.',
              lever: "Server-render, and don't put a bot challenge in front of content pages.",
            },
            {
              title: "It answers with inline citations",
              body: "The API inserts numbered links like `[[1]](https://x.ai/news)`. grok.com renders citations as small pills showing the site's name or an X `@handle`, and an “N sources” pill under the answer opens the full list. Presenc AI counted an average of 4.7 sources per answer in 2026.",
              lever:
                "Write facts that stand on their own, on pages whose titles read well on a source card.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "117M",
              label:
                "monthly active users used Grok's AI features at 31 March 2026, out of about 550M across Grok and X",
              source: {
                name: "SpaceX S-1, May 2026",
                href: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm",
              },
            },
            {
              value: "16.3%",
              label:
                "of citations among Grok's 50 most-cited domains go to Reddit — YouTube 15.1%, Facebook 13.9%",
              source: {
                name: "Ahrefs, Jun 2026",
                href: "https://ahrefs.com/blog/most-cited-domains-grok/",
              },
            },
            {
              value: "1.4%",
              label: "for x.com in the same ranking — 12th, although Grok is built into X",
              source: {
                name: "Ahrefs, Jun 2026",
                href: "https://ahrefs.com/blog/most-cited-domains-grok/",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Grok also answers inside X, in public",
          text: 'Two X features run on Grok: the Explain button on posts and replies from the @grok account. xAI\'s [published system prompts](https://github.com/xai-org/grok-prompts) (last updated November 2025) tell @grok to use real-time search to "fetch primary sources for current events" and that it "must use the browse page to verify all points of information," in replies under 550 characters with no markdown. Explain is told to "prioritize peer-reviewed research." Those replies are public posts in the thread, not private chats.',
        },
      ],
    },
    {
      id: "crawlers",
      title: "Crawlers and access: nothing to allow by name",
      blocks: [
        {
          kind: "p",
          text: "OpenAI, Anthropic, Google and Perplexity all publish their [AI crawlers](/glossary/ai-crawlers). xAI doesn't: there's no crawler page, no user-agent token, no IP list and no statement on robots.txt for Grok's search or live fetches. Cloudflare wrote in [September 2025](https://blog.cloudflare.com/building-a-better-internet-with-responsible-ai-bot-principles/) that \"xAI's bot, grok, does not self-identify at all, making it impossible for website operators to block it.\" A February 2026 [controlled test by StackFox](https://stackfox.co/research/grok-user-agent) found the same: asked to fetch test URLs, Grok sent 30 requests in under a second from datacenter IPs, with user agents like `Chrome/139.0.0.0` and `Go-http-client/1.1`. \"The word 'Grok' never appears. Neither does 'xAI.'\"",
        },
        {
          kind: "table",
          head: ["User agent", "Source", "What it is", "robots.txt"],
          rows: [
            [
              "`GrokBot`, `xAI-Grok`, `Grok-DeepSearch`",
              "Third-party bot lists",
              "Claimed training, search and DeepSearch bots — not in xAI's documentation",
              "Unknown; StackFox's test never saw them",
            ],
            [
              "Browser strings, e.g. `Chrome/139.0.0.0`",
              "Observed by StackFox, Feb 2026",
              "Live fetches when a user asks Grok to read a URL",
              "Not documented",
            ],
            [
              "`Go-http-client/1.1`",
              "Observed by StackFox, Feb 2026",
              "The Go HTTP library's default, seen in the same bursts",
              "Not documented",
            ],
            [
              "`GrokAgent`",
              "Cloudflare Radar's bot directory",
              "Grok Bot, xAI's always-on agent product, launched 11 August 2026",
              "Listed as not following it",
            ],
          ],
        },
        {
          kind: "p",
          text: "The consequence: [robots.txt](/glossary/robots-txt) can't target Grok, and neither can a CDN's \"block AI bots\" switch, because nothing in the request says it's Grok. Nothing documents whether Grok's fetcher reads robots.txt at all. Adding the unverified tokens does no harm, but don't mistake them for control:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# xAI documents no user agent for Grok's search or fetches.\n# These names come from third-party lists and are unverified:\n# a rule for them may never match a real request.\nUser-agent: GrokBot\nUser-agent: xAI-Grok\nUser-agent: Grok-DeepSearch\nAllow: /\n\n# Grok's browser-like fetches fall under your default group\nUser-agent: *\nAllow: /\nDisallow: /account/",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Your bot defenses are the real Grok setting",
          text: "Grok's fetches look like bursts of browser traffic from datacenter IPs, so the rules that stop them are JavaScript challenges, CAPTCHAs, datacenter-IP blocks and per-second rate limits — not robots.txt. If those sit in front of your pricing, docs or product pages, Grok gets a challenge page instead of your content. Decide per path: keep defenses on logins, carts and APIs, and keep content pages answerable to a plain HTTP request.",
        },
        { kind: "h3", text: "Training: no website opt-out, one X setting" },
        {
          kind: "p",
          text: 'The Grok 4 model card lists "publicly available Internet data" among Grok\'s pre-training sources. With no documented crawler token, site owners have no robots.txt line that xAI says it honors for training. X posts are different: X\'s [privacy policy](https://x.com/en/privacy), effective 15 January 2026, says X may use what it collects "and publicly available information to help train our machine learning or artificial intelligence models." Account holders can opt out under Settings and privacy → Privacy and safety → Grok & Third-party Collaborators, which [PCMag describes](https://tech.yahoo.com/ai/articles/posts-x-being-used-train-195730547.html) as covering public posts, engagements and profile data. As far as xAI documents, that setting governs training, not whether X search can find and cite your public posts.',
        },
      ],
    },
    {
      id: "x-second-index",
      title: "X is Grok's second index",
      blocks: [
        {
          kind: "p",
          text: "Grok's second source is X itself. Its X search runs keyword and semantic search over posts, looks up accounts and fetches whole threads, with filters for handles and date ranges and optional image and video understanding. Cited posts come back as `x.com/<handle>/status/<id>` URLs, per xAI's [citations docs](https://docs.x.ai/developers/tools/citations), and grok.com shows them as `@handle` pills and profile photos in the sources stack.",
        },
        {
          kind: "p",
          text: "How much of Grok's citing goes to X depends on who's counting. [Presenc AI](https://presenc.ai/research/grok-citation-patterns-2026) sampled 4,400 prompts in March–April 2026 and found about **45%** of Grok's citations were X posts: \"The mix shifts toward X heavily for current-events queries and toward web for definitional or how-to queries.\" Ahrefs' Brand Radar, across 1.9 million broad US queries, put x.com at **1.4%** of the citations among Grok's top 50 domains. Both can be right — a product question gets answered from the web, a what's-happening question from X — so plan for both.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "~45%",
              label: "of Grok's citations were X posts across 4,400 prompts in March–April 2026",
              source: {
                name: "Presenc AI, May 2026",
                href: "https://presenc.ai/research/grok-citation-patterns-2026",
              },
            },
            {
              value: "2.8x",
              label:
                "the citation rate of posts from verified accounts versus equally-engaged posts from unverified ones",
              source: {
                name: "Presenc AI, May 2026",
                href: "https://presenc.ai/research/grok-citation-patterns-2026",
              },
            },
          ],
        },
        {
          kind: "list",
          items: [
            "**State the fact in the post's text.** X search matches keywords and meaning. Grok can read images and video, but a claim that lives only in a screenshot or a link preview is the harder one to find.",
            '**Link the post to the canonical page.** Grok\'s system prompt says it can "analyze individual X user profiles, X posts and their links" — a post is a route to your page.',
            "**Answer recurring questions in threads.** Thread fetch reads a whole conversation in one call, so a thread that settles a question completely is a ready-made source.",
            "**Make the account unambiguous.** User search is a documented capability. Put the brand name in the handle or display name, and say what you do in the bio.",
            "**Consider verification for the brand account.** Presenc AI found verified accounts' posts cited at 2.8x the rate of equally-engaged unverified ones.",
            "**Post on X the day your facts change.** The X tool filters by date and Grok leans on X for current events. A price change or launch that exists only on your blog is easier to miss.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Grok is told to discount spin",
          text: 'xAI\'s chat prompt tells Grok to "assume subjective viewpoints sourced from media are biased" on contested questions and to represent "all parties/stakeholders." Read practically: on anything disputed, a press release or one friendly article carries little weight. Evidence — data, documentation, named primary sources — is what survives that instruction.',
        },
      ],
    },
    {
      id: "grokipedia",
      title: "Grokipedia: worth checking, not a Grok lever",
      blocks: [
        {
          kind: "p",
          text: "Grokipedia launched on 27 October 2025 with 885,279 articles and passed 6 million by January 2026, per [its own article](https://grokipedia.com/page/grokipedia). Some articles are generated by Grok and others were forked from Wikipedia. Nobody edits directly: logged-in users highlight text, click Suggest Edit and submit a correction with supporting evidence, which Grok reviews before anything changes.",
        },
        {
          kind: "p",
          text: "Its documented reach has been outside Grok. In January 2026 [TechCrunch reported](https://techcrunch.com/2026/01/25/chatgpt-is-pulling-answers-from-elon-musks-grokipedia/) the Guardian's finding that GPT-5.2 cited Grokipedia nine times across more than a dozen questions. Ahrefs' [March 2026 comparison](https://ahrefs.com/blog/wikipedia-vs-grokipedia) counted 356,200 AI citations for Grokipedia against 24.9 million for Wikipedia, and found its organic traffic had fallen to half its peak. For Grok itself, xAI doesn't document any use of Grokipedia in answers, and grokipedia.com isn't among the 50 domains Grok cites most in Ahrefs' June 2026 data.",
        },
        {
          kind: "list",
          items: [
            "**Search Grokipedia for your brand, products and founders.** Generated pages can exist without anyone having asked for them.",
            "**Correct what's wrong, with a primary source.** Link your own documentation, a filing or a dated announcement in the suggestion form.",
            "**Don't build a Grok strategy on it.** Its documented citations are in ChatGPT and other assistants, not in Grok's top cited domains.",
          ],
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "Nothing about Grok's fetcher is documented — not its user agent, rendering, timeouts or size limits. What's known comes from tests, and it points the same way as every other engine: plain HTML, reachable without a challenge.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Server-rendered HTML",
              status: "required",
              note: "In Search Engine World's [June 2026 test](https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test), one Grok fetch node ran the page's JavaScript, but the answer still quoted the raw-HTML decoy. Put the content in the HTML response — see [server-side rendering](/glossary/server-side-rendering).",
            },
            {
              label: "No challenge on content pages",
              status: "required",
              note: "Grok's fetches arrive as browser bursts from datacenter IPs. A JavaScript challenge, CAPTCHA or datacenter block hands them a page with none of your content.",
            },
            {
              label: "Tolerant rate limits",
              status: "helps",
              note: "StackFox logged 30 requests in under a second when Grok fetched its test pages. Per-second limits tuned for human visitors will cut some of them off.",
            },
            {
              label: "Descriptive titles",
              status: "helps",
              note: "grok.com's source cards show the page title in bold over a three-line preview, and inline pills show the site's display name. The title is what a reader sees before clicking.",
            },
            {
              label: "Links from X posts",
              status: "helps",
              note: "Grok can follow the links in the X posts it reads, so posts that link your canonical URL are a second path to the page.",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "xAI has said nothing about schema.org. Keep every fact that matters in visible text as well.",
            },
            {
              label: "Sitemaps",
              status: "unconfirmed",
              note: "Not documented for Grok. Keep one with honest `lastmod` values for the engines that do use them.",
            },
            {
              label: "Canonicals and redirects",
              status: "unconfirmed",
              note: "Undocumented. Keep one clean URL per page and avoid redirect chains, so whichever copy Grok finds is the right one.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "xAI hasn't said Grok reads [llms.txt](/glossary/llms-txt), and no test has shown it requested.",
            },
            {
              label: "robots.txt rules naming Grok",
              status: "no-effect",
              note: "There's no documented token to name. A rule for `GrokBot` or `xAI-Grok` may never match a request.",
            },
            {
              label: "IndexNow",
              status: "no-effect",
              note: "xAI isn't on IndexNow's [list of participating engines](https://www.indexnow.org/searchengines.json), so pings don't reach Grok.",
            },
          ],
        },
        {
          kind: "p",
          text: "Test pages the way Grok's fetcher appears to see them — a browser user agent, no JavaScript — ideally from a cloud VM, since that's where its requests come from:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# A browser user agent and no JavaScript, like Grok\'s fetches\ncurl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n\n# 0 = the text needs JavaScript, or your WAF served a challenge page',
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What Grok cites",
      blocks: [
        {
          kind: "p",
          text: "Ahrefs' [June 2026 ranking](https://ahrefs.com/blog/most-cited-domains-grok/) of the 50 domains Grok cites most, built from 1.9 million US queries, is dominated by user-generated platforms: Reddit 16.3%, YouTube 15.1% and Facebook 13.9% — about 45% between them — then Instagram, Quora, Amazon, TikTok and Wikipedia. Retail and review sites fill much of the rest: eBay, Walmart, Consumer Reports, Yelp, Tripadvisor and Trustpilot.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Community platforms",
              body: "Reddit, YouTube and Facebook are Grok's top three cited domains. Being discussed there is a route in that doesn't depend on your own rankings — see [Reddit SEO](/glossary/reddit-seo).",
              evidence: "observed",
            },
            {
              title: "Marketplaces and reviews",
              body: "Amazon (5.0%), eBay, Walmart, Consumer Reports and Trustpilot all make Grok's top 50. Product questions get answered from listings and reviews.",
              evidence: "observed",
            },
            {
              title: "X posts, by query type",
              body: "About 45% of citations in Presenc AI's sample, 1.4% in Ahrefs'. The share is heaviest for current events and lightest for how-to questions.",
              evidence: "observed",
            },
            {
              title: "Verified accounts",
              body: "Posts from verified accounts were cited at 2.8x the rate of equally-engaged unverified posts in Presenc AI's 2026 sample.",
              evidence: "observed",
            },
            {
              title: "Primary sources",
              body: '@grok is told to "fetch primary sources for current events" and to verify search results by opening pages. Your own announcement page is the primary source for your news.',
              evidence: "official",
            },
            {
              title: "A spread of viewpoints",
              body: 'On contested questions Grok is told to search for "all parties/stakeholders" and to treat media viewpoints as biased. Expect your page to be cited next to others, not alone.',
              evidence: "official",
            },
          ],
        },
        {
          kind: "p",
          text: "Paid placement isn't a route yet. Elon Musk told advertisers in [August 2025](https://techcrunch.com/2025/08/07/elon-musk-says-x-plans-to-introduce-ads-in-groks-responses/) that X planned ads in Grok's responses. SpaceX's May 2026 S-1 still described advertising in the stand-alone Grok product as a possible \"incremental monetization opportunity,\" and said it doesn't sell advertisers placement on the Grok API.",
        },
      ],
    },
    {
      id: "measurement",
      title: "Measuring Grok traffic",
      blocks: [
        {
          kind: "p",
          text: "Expect little Grok [referral traffic](/glossary/ai-referral-traffic) in your analytics — and some of the shortfall is measurement. SE Ranking's study of 101,574 sites found Grok's share of all website traffic peaked at 0.0019% in August 2025 before falling back toward zero. Goodie's B2B panel saw \"effectively zero attributable referrals\" from Grok while Similarweb counted 904 million visits to it in January–April 2026.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "0.0019%",
              label:
                "Grok's peak share of total website traffic across 101,574 sites (August 2025)",
              source: {
                name: "SE Ranking, Jun 2026",
                href: "https://seranking.com/blog/ai-traffic-research-study/",
              },
            },
            {
              value: "904M",
              label:
                "visits to Grok in January–April 2026, with effectively zero attributable referrals in a B2B GA4 panel",
              source: {
                name: "Goodie, May 2026",
                href: "https://higoodie.com/blog/ai-search-traffic-report-2026/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Part of that is how grok.com links out. Its web client, as shipped on 21 September 2026, renders citation pills and source cards with `rel=\"noopener noreferrer nofollow\"` and adds no UTM tags, so the browser sends no referrer and those visits land in **Direct**. Links without that attribute inherit the site's `Referrer-Policy: origin-when-cross-origin` and arrive as `grok.com`. GA4's AI Assistant channel, added in May 2026, names Grok — Google's [channel documentation](https://support.google.com/analytics/answer/9756891) lists \"ChatGPT, Gemini, Deepseek, Copilot, or Grok\" — but it can only classify visits that carry a referrer. How clicks from Grok inside the X app are attributed isn't documented.",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — Grok's web client, when a referrer survives\n^(.*\\.)?grok\\.com$\n\n# X itself: t.co is the link wrapper on X posts\n^(t\\.co|x\\.com)$",
        },
        {
          kind: "p",
          text: "Server logs are the better instrument, with one catch: you can't filter Grok by user agent. Two things work instead. Look for its signature — bursts of requests for one URL within a second, browser user agents, no referrer — and run a controlled test: publish a URL nobody knows, ask Grok to read it, and see exactly what arrives.",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Bursts: 10+ no-referrer requests for one URL in one second (combined log format)\nawk \'$11=="\\"-\\"" {print substr($4,2,20), $7}\' access.log \\\n  | sort | uniq -c | awk \'$1 >= 10\' | sort -rn | head -20\n\n# Controlled test: ask Grok to summarize https://yoursite.com/grok-test-7f3a, then\ngrep "/grok-test-7f3a" access.log',
        },
        {
          kind: "p",
          text: "For visibility itself, run a fixed [prompt panel](/glossary/prompt-tracking) through Grok on a schedule. Mix current-events prompts, where X dominates, with product and how-to prompts, where the web does, and record which domains and `@handles` get cited. Answers vary between runs, so compare across repeats rather than trusting one screenshot. Rankbox's free [AI visibility prompt kit](/tools/ai-visibility-prompt-generator) gives you a starting set.",
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
              myth: "Allowing GrokBot in robots.txt gets you into Grok.",
              reality:
                "xAI documents no such token, and a February 2026 test never saw it in a request. Grok's fetches arrive as ordinary browsers, so what matters is that your default rules and WAF let them through.",
            },
            {
              myth: "A CDN's block-AI-bots switch keeps Grok out.",
              reality:
                'Those switches match declared bots, and Grok\'s fetcher "does not self-identify at all" (Cloudflare). Only behavioral rules — challenges, datacenter blocks, rate limits — catch it, and they catch real users too.',
            },
            {
              myth: "Grok mostly cites X posts.",
              reality:
                "It depends on the question. Ahrefs' June 2026 data put x.com at 1.4% of top-50 citations, behind Reddit, YouTube and Facebook; Presenc AI's sample put X posts near 45%, heaviest on current events.",
            },
            {
              myth: "Grokipedia is the way into Grok.",
              reality:
                "xAI doesn't document Grok using it, and it isn't among the 50 domains Grok cites most. Its documented citations are in ChatGPT and other assistants.",
            },
            {
              myth: "Grok runs JavaScript, so a client-rendered site is fine.",
              reality:
                "In a June 2026 test one Grok node ran the script, yet the answer quoted the raw HTML. Treat Grok like every other engine and server-render.",
            },
            {
              myth: "GA4's AI Assistant channel shows your Grok traffic.",
              reality:
                "Only visits that carry a referrer. grok.com's citation links use `noreferrer`, so those clicks arrive as Direct.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "ssr",
      title: "Server-render every page you want cited",
      detail:
        "Check with `curl` and a browser user agent that the answer is in the raw HTML, not added by JavaScript.",
      impact: "high",
    },
    {
      id: "no-challenge",
      title: "Keep bot challenges off content pages",
      detail:
        "JavaScript challenges, CAPTCHAs and datacenter-IP blocks stop Grok's browser-like fetches. Keep them on logins, carts and APIs.",
      impact: "high",
    },
    {
      id: "rate-limits",
      title: "Let short bursts through",
      detail:
        "Grok sent 30 requests in under a second in StackFox's test. Loosen per-second limits on public pages.",
      impact: "medium",
    },
    {
      id: "robots-default",
      title: "Keep your default robots.txt group open",
      detail:
        "Grok has no documented token, so `User-agent: *` is the group that applies. Named `GrokBot` rules are optional and unverified.",
      impact: "medium",
    },
    {
      id: "x-account",
      title: "Run an active, clearly named X account",
      detail:
        "Brand name in the handle or display name, a bio that says what you do, and posts Grok's user search can find.",
      impact: "high",
    },
    {
      id: "x-facts",
      title: "Post your key facts on X as text, with a link",
      detail:
        "Prices, launches and specs stated in the post itself, linking the canonical page — on the day they change.",
      impact: "high",
    },
    {
      id: "x-threads",
      title: "Answer recurring questions in threads",
      detail:
        "Grok can fetch a whole thread in one call. A complete answer in one thread is a ready source.",
      impact: "medium",
    },
    {
      id: "verification",
      title: "Consider verifying the brand account",
      detail:
        "Verified accounts' posts were cited at 2.8x the rate of equally-engaged unverified posts (Presenc AI).",
      impact: "medium",
    },
    {
      id: "community",
      title: "Earn mentions on Reddit, YouTube and review sites",
      detail:
        "Reddit, YouTube and Facebook lead Grok's cited domains; marketplaces and review sites fill much of the top 50.",
      impact: "high",
    },
    {
      id: "first-party",
      title: "Keep primary facts on your own crawlable pages",
      detail:
        "Pricing, specs, policies and announcements — Grok is told to fetch primary sources and verify claims by opening pages.",
      impact: "high",
    },
    {
      id: "titles",
      title: "Write titles that work on a source card",
      detail:
        "grok.com shows the title in bold over a three-line preview. Make it say what the page answers.",
      impact: "medium",
    },
    {
      id: "evidence",
      title: "Back contested claims with evidence",
      detail:
        "Grok is told to treat media viewpoints as biased and seek all sides. Data and documentation outlast spin.",
      impact: "medium",
    },
    {
      id: "grokipedia",
      title: "Check your Grokipedia page and correct it",
      detail:
        "Highlight the wrong text, click Suggest Edit and attach a primary source. Grok reviews every suggestion.",
      impact: "low",
    },
    {
      id: "x-training",
      title: "Decide on X's Grok training setting",
      detail:
        "Settings and privacy → Privacy and safety → Grok & Third-party Collaborators controls training on your public posts.",
      impact: "low",
    },
    {
      id: "measure",
      title: "Measure beyond referrers",
      detail:
        "A GA4 channel for `grok.com`, Direct traffic on pages Grok cites, a log check for bursts, and a scheduled prompt panel.",
      impact: "medium",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Grok?",
      a: "Serve key pages as server-rendered HTML without bot challenges, earn mentions on the platforms Grok cites most — Reddit, YouTube, review sites — and run an X account that states your facts in text and links to your pages. There's no crawler to allow by name.",
    },
    {
      q: "What search engine does Grok use?",
      a: "xAI doesn't say. Its documentation describes a web search tool that searches and browses pages and an X search tool for posts, accounts and threads, but names no provider, index or ranking method.",
    },
    {
      q: "What is Grok's user agent?",
      a: "None is documented. `GrokBot`, `xAI-Grok` and `Grok-DeepSearch` circulate on third-party lists but aren't in xAI's docs, and a February 2026 test saw only browser user agents such as `Chrome/139.0.0.0` plus `Go-http-client/1.1`, from datacenter IPs. Cloudflare Radar lists `GrokAgent` for Grok Bot, xAI's agent product.",
    },
    {
      q: "Can I block Grok with robots.txt?",
      a: "Not reliably. There's no documented token, and xAI hasn't said its fetcher reads robots.txt. Cloudflare says Grok's fetches don't self-identify, so only behavioral WAF rules catch them. For training, xAI offers websites no documented opt-out.",
    },
    {
      q: "How much do X posts matter for Grok?",
      a: "A lot for current events, less for product and how-to questions. Presenc AI found about 45% of Grok's citations were X posts in a March–April 2026 sample; Ahrefs' June 2026 data put x.com at 1.4% of top-50 citations across broad US queries.",
    },
    {
      q: "Can Grok read JavaScript-rendered pages?",
      a: "xAI doesn't document it. In Search Engine World's June 2026 test one Grok node executed the JavaScript, but the answer still came from the raw HTML. Server-render anything you want cited.",
    },
    {
      q: "Does Grok use Grokipedia?",
      a: "xAI hasn't documented Grok citing Grokipedia, and grokipedia.com isn't among Grok's 50 most-cited domains in Ahrefs' June 2026 data. ChatGPT has been found citing it, so check your brand's page and suggest corrections.",
    },
    {
      q: "How do I track Grok traffic in GA4?",
      a: "GA4's AI Assistant channel includes Grok, but only visits with a referrer get classified, and grok.com's citation links use `noreferrer`. Add a custom channel for `grok.com`, watch Direct on pages Grok cites, and use server logs plus a controlled fetch test.",
    },
    {
      q: "Can I pay to appear in Grok's answers?",
      a: "Not as of SpaceX's May 2026 S-1, which called ads in the stand-alone Grok product a possible future opportunity and said advertisers can't buy placement on the Grok API. Elon Musk said in August 2025 that ads in Grok's responses were planned.",
    },
  ],

  sources: [
    {
      title: "Web Search",
      publisher: "SpaceXAI Docs",
      href: "https://docs.x.ai/developers/tools/web-search",
    },
    {
      title: "X Search",
      publisher: "SpaceXAI Docs",
      href: "https://docs.x.ai/developers/tools/x-search",
    },
    {
      title: "Citations",
      publisher: "SpaceXAI Docs",
      href: "https://docs.x.ai/developers/tools/citations",
    },
    {
      title: "Grok 4 Fast",
      publisher: "xAI",
      href: "https://x.ai/news/grok-4-fast",
    },
    {
      title: "Grok 4 model card",
      publisher: "xAI",
      href: "https://data.x.ai/2025-08-20-grok-4-model-card.pdf",
    },
    {
      title: "Grok prompts: system prompts for Grok chat and the @grok bot on X",
      publisher: "xAI on GitHub",
      href: "https://github.com/xai-org/grok-prompts",
    },
    {
      title: "Grok release notes",
      publisher: "grok.com",
      href: "https://grok.com/release-notes",
    },
    {
      title: "Space Exploration Technologies Corp. Form S-1",
      publisher: "U.S. SEC",
      href: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm",
    },
    {
      title: "To build a better Internet in the age of AI, we need responsible AI bot principles",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/building-a-better-internet-with-responsible-ai-bot-principles/",
    },
    {
      title: "Grok bot user agent: why you can't block xAI's crawler",
      publisher: "StackFox",
      href: "https://stackfox.co/research/grok-user-agent",
    },
    {
      title:
        "Do AI assistants actually render your JavaScript when grounding? We put it to the test",
      publisher: "Search Engine World",
      href: "https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test",
    },
    {
      title: "The 50 most-cited websites in Grok (June 2026)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/most-cited-domains-grok/",
    },
    {
      title: "Grok citation patterns 2026: how xAI Grok selects sources",
      publisher: "Presenc AI",
      href: "https://presenc.ai/research/grok-citation-patterns-2026",
    },
    {
      title: "Wikipedia vs Grokipedia",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/wikipedia-vs-grokipedia",
    },
    {
      title: "Grokipedia",
      publisher: "Grokipedia",
      href: "https://grokipedia.com/page/grokipedia",
    },
    {
      title: "ChatGPT is pulling answers from Elon Musk's Grokipedia",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2026/01/25/chatgpt-is-pulling-answers-from-elon-musks-grokipedia/",
    },
    {
      title: "Analysis of top AI search engines: who is catching up to ChatGPT?",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/ai-traffic-research-study/",
    },
    {
      title: "ChatGPT's AI referral share fell from 89% to 63%",
      publisher: "Goodie",
      href: "https://higoodie.com/blog/ai-search-traffic-report-2026/",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "X Privacy Policy",
      publisher: "X",
      href: "https://x.com/en/privacy",
    },
  ],

  sameAs: [
    "https://www.wikidata.org/wiki/Q123361035",
    "https://en.wikipedia.org/wiki/Grok_(chatbot)",
    "https://grok.com",
  ],

  furtherReading: [
    {
      title: "Reddit Presence",
      href: "/features/reddit-presence",
      description:
        "Reddit is the domain Grok cites most. Find the threads worth joining and reply helpfully, under your own name.",
    },
    {
      title: "Free AI search readiness check",
      href: "/tools/ai-search-readiness-check",
      description:
        "Scan a page's crawler access, title, canonical and social tags — the basics every engine's fetcher depends on.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Compare Grok with ChatGPT, Claude, Perplexity and Gemini: indexes, crawlers, rendering and referrers, side by side.",
    },
  ],
};
