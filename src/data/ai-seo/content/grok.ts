import type { EngineGuide } from "../types";

/*
 * Facts checked 2026-10-26 against xAI's developer docs, the SpaceX S-1,
 * grok.com's live response headers and shipped web client, and the studies
 * listed in `sources`. Re-check the fetcher, referrer and Grokipedia sections
 * first: they move fastest.
 */
export const grok: EngineGuide = {
  slug: "grok",
  metaTitle: "Grok SEO (2026): How to Get Cited From the Web and From X",
  metaDescription:
    "How Grok sources answers from web search and X posts, why its fetcher has no user agent, why grok.com clicks land in Direct, and what to change. Checked October 2026.",
  keywords: [
    "Grok SEO",
    "get cited by Grok",
    "Grok web search",
    "Grok X search",
    "Grok user agent",
    "grok.com referrer",
    "Grokipedia",
  ],
  headline: { lead: "Grok SEO: get cited from", accent: "the web and from X" },
  subhead:
    "One Grok answer can draw on two live sources at once — pages from the open web and posts from X — and it labels each differently. xAI documents no crawler and no index, and grok.com strips its own referrer, so the usual playbook needs rewiring. This guide is checked against xAI's docs and grok.com's shipped code as of October 2026.",

  shortAnswer:
    "To get cited by Grok, be findable in both places it searches. For the **web half**, publish your facts as server-rendered HTML that a datacenter request with a browser user agent can read without a challenge — xAI documents no crawler name to allow. For the **X half**, run a clearly named X account that states the same facts in post text and links to the page, because Grok's X search matches keywords, meaning, handles and whole threads. Then measure with server logs and repeated prompts, because grok.com's citation links send no referrer.",

  takeaways: [
    'Grok has two search tools: **Web Search**, which searches and browses pages, and **X Search**, which runs keyword, semantic, account and thread lookups. grok.com shows them as "Searching the web" and "Searching 𝕏" and cites both inline.',
    "Which half wins depends on the question. Ahrefs' June 2026 data put x.com at 1.4% of Grok's top-50 citations; a vendor panel found X posts in about 45% of citations, weighted toward current events.",
    "xAI documents no crawler, fetcher or robots.txt token. Tests saw Chrome-like user agents from datacenter IPs, so your WAF, not robots.txt, decides whether Grok can read a page.",
    "grok.com's citation chips carry `rel=\"noopener noreferrer nofollow\"` (checked 26 October 2026), so most clicks land in Direct, out of reach of GA4's AI Assistant channel.",
    "Grok 4.7's training data stops at May 2026. Anything newer reaches an answer only through search — which is where X, with its date filters, earns its place.",
    "Grokipedia is live (v0.3 shipped 30 September 2026), but its documented citations come mostly from other assistants, not Grok.",
  ],

  facts: [
    { label: "Live sources in one answer", value: "Web + X" },
    { label: "Crawler user agent xAI documents", value: "None" },
    { label: "rel on grok.com citation links", value: "noreferrer", mono: true },
    { label: "Grok 4.7 knowledge cutoff", value: "May 2026" },
  ],

  preview: {
    prompt: "Did YourBrand cut the price of its Pro plan this week?",
    status: "Thought for 9s",
    answer:
      "**YourBrand** lowered Pro from $24 to $19 a month on Tuesday, and its pricing page now lists the new rate. A follow-up thread says existing subscribers move to the lower price automatically.",
    sources: [
      { domain: "x.com", title: "@yourbrand: Pro is now $19/mo, starting today" },
      { domain: "yourbrand.com", title: "Pricing — YourBrand" },
      { domain: "x.com", title: "@yourbrandhelp: What changes for existing plans (thread)" },
      { domain: "reddit.com", title: "Anyone else see YourBrand's new Pro price?" },
    ],
  },

  profile: {
    retrieval:
      "Web Search tool plus X Search (keyword, semantic, user, thread); web index provider undisclosed",
    searchCrawler: "None documented; fetches seen with Chrome-like user agents from datacenter IPs",
    trainingCrawler: "None documented for websites; X posts via X's Grok training setting",
    rendersJs: "Undocumented; a June 2026 test saw one node run JS but the answer used raw HTML",
    referrer: "grok.com citation links are noreferrer, so most clicks arrive as Direct",
    citationStyle:
      "Inline chips naming the site or linking the post, grouped as +N, plus a sources list",
    biggestLever: "Facts in server-rendered HTML, repeated as text posts on X that link the page",
  },

  sections: [
    {
      id: "two-indexes",
      title: "One answer, two indexes: the web and X",
      blocks: [
        {
          kind: "p",
          text: "Grok answers from its training when it can and searches when a question needs something newer. Its current flagship, Grok 4.7, has a knowledge cutoff of May 2026, per xAI's [models page](https://docs.x.ai/developers/models), so a price change, launch or incident after that reaches an answer only through search. SpaceX's [May 2026 S-1](https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm) describes Grok Chat as offering \"real-time integration of web search, X data, code execution, and multimodal analysis\" on grok.com, the Grok apps, inside X and through the API.",
        },
        {
          kind: "p",
          text: 'xAI\'s API exposes the same two search tools, and their documentation is the clearest public account of how Grok gathers sources. The model works in a loop: at each step it "decides what to do next" — call a tool or answer — and "continues until sufficient information is gathered," per the [tools overview](https://docs.x.ai/developers/tools/overview). Nothing stops it calling both tools for one question, and the side-by-side below is what each one does.',
        },
        {
          kind: "table",
          head: ["", "Web Search", "X Search"],
          rows: [
            [
              "**Reads**",
              'Web pages: it can "search the web in real-time and browse web pages"',
              "Posts, accounts and threads on X",
            ],
            [
              "**Lookups**",
              "Search, then open the pages it needs",
              "`x_keyword_search`, `x_semantic_search`, `x_user_search`, `x_thread_fetch`",
            ],
            [
              "**API filters**",
              "`allowed_domains` or `excluded_domains`, up to 5",
              "`allowed_x_handles` or `excluded_x_handles`, up to 20; `from_date` and `to_date`",
            ],
            [
              "**Media**",
              "Optional image understanding and image search",
              "Optional image and video understanding",
            ],
            [
              "**On grok.com**",
              '"Searching the web", then chips naming the site',
              '"Searching 𝕏" or "Reading thread", then chips that link the posts',
            ],
            ["**Cited as**", "The page URL", "`x.com/<handle>/status/<id>`"],
            [
              "**You control**",
              "Crawlable HTML, no challenge page, titles that read well on a source card",
              "Handle, bio, post text, links and threads",
            ],
          ],
        },
        {
          kind: "p",
          text: 'On grok.com both kinds of citation sit inline in the answer. The web client, as served on 26 October 2026, types every citation as `web` or `x_post`, labels each web chip with the site\'s name taken from its domain — `reddit.com` shows as Reddit — and folds several sources behind one chip as "+N". Through the API, the `citations` field lists every URL the agent encountered, and inline citations mark the ones it used; xAI\'s [citations docs](https://docs.x.ai/developers/tools/citations) warn that "not every URL in this list will necessarily be directly referenced in the final answer."',
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
              value: "1.4%",
              label:
                "of citations among Grok's 50 most-cited domains went to x.com, 12th place, across 1.9M US queries",
              source: {
                name: "Ahrefs, Jun 2026",
                href: "https://ahrefs.com/blog/most-cited-domains-grok/",
              },
            },
            {
              value: "~45%",
              label:
                "of Grok's citations were X posts across 4,400 prompts run in March and April 2026",
              source: {
                name: "Presenc AI, May 2026",
                href: "https://presenc.ai/research/grok-citation-patterns-2026",
              },
            },
          ],
        },
        {
          kind: "p",
          text: 'The two studies measure different things. Ahrefs\' Brand Radar counted every domain Grok cited across 1.9 million broad US queries. Presenc AI, which sells Grok monitoring, ran 4,400 prompts and classified each citation as an X post or a web page; it reports that the mix "shifts toward X heavily for current-events queries and toward web for definitional or how-to queries." Read together: a question about what happened this week leans on X, and a question about what something is or how to do it leans on the web. Work out which kind your buyers ask, and weight the next two sections accordingly.',
        },
      ],
    },
    {
      id: "x-search-levers",
      title: "The X half: posts written for four lookups",
      blocks: [
        {
          kind: "p",
          text: "X Search is four lookups, and each rewards something specific about how a brand posts. None of this is a ranking secret: it's the capabilities in xAI's [X Search docs](https://docs.x.ai/developers/tools/x-search), mapped to what an account owner can change.",
        },
        {
          kind: "table",
          head: ["Lookup", "What it finds", "What to post"],
          rows: [
            [
              "`x_keyword_search`",
              "Posts that contain the query's words",
              "The fact itself in the text — product name, number, date — not only inside an image or a link card",
            ],
            [
              "`x_semantic_search`",
              "Posts that mean the same thing in other words",
              "Complete sentences that answer the question a person would type into Grok",
            ],
            [
              "`x_user_search`",
              "Accounts, by name",
              "The brand name in the display name or handle, and a bio that says what you do",
            ],
            [
              "`x_thread_fetch`",
              "A whole conversation in one call",
              "One thread that settles a recurring question from start to finish",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Two more documented behaviours shape what gets picked. Grok\'s published chat prompt says it "can analyze individual X user profiles, X posts and their links," so a post that links your canonical page is also a route to the page. And the `from_date` and `to_date` filters let the agent restrict X results to a window, which suits the current-events questions X is cited for most: post on the day a fact changes, not a week later.',
        },
        {
          kind: "list",
          items: [
            '**One fact, one post.** "Pro is now $19 a month, from today" can be matched by keyword and by meaning; a launch-day meme can\'t.',
            "**Link the page that proves it.** The post gets the speed; the page holds the detail Grok's web search can open and quote.",
            "**Keep one thread per question you get every week.** Pricing, availability, migration steps — one thread, kept current, is a ready-made source for `x_thread_fetch`.",
            "**Keep the handle and bio boring.** Searchable beats clever when a lookup runs by account name.",
            "**Correct in public.** If @grok answers wrongly about you under a post, reply with the primary source. The next search has something to find.",
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "2.8x",
              label:
                "the citation rate of posts from verified accounts versus equally engaged unverified posts",
              source: {
                name: "Presenc AI, May 2026",
                href: "https://presenc.ai/research/grok-citation-patterns-2026",
              },
            },
            {
              value: "4.7",
              label:
                "sources cited per Grok answer on average, rising to 6.3 for current-events prompts",
              source: {
                name: "Presenc AI, May 2026",
                href: "https://presenc.ai/research/grok-citation-patterns-2026",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Treat the verification number as a lead, not a law",
          text: "Presenc AI's multiplier ranges from 1.4x in sports and entertainment to 4.7x in finance and regulation. It comes from one panel run by a company that sells Grok monitoring, with no raw data published. It's a reason to test verification on the brand account, not proof that it works.",
        },
        { kind: "h3", text: "When Grok answers in public: @grok and Explain" },
        {
          kind: "p",
          text: 'Grok also answers inside X itself: people tag @grok under a post, and the Explain button summarises one. xAI\'s [published system prompts](https://github.com/xai-org/grok-prompts) — last updated in November 2025, so they may lag the current models — tell @grok to use search "to confirm facts and fetch primary sources for current events," that "parallel search should be used to find diverse viewpoints," and that it "must use the browse page to verify all points of information you get from search." Replies are capped under 550 characters with no markdown. Explain is told to "prioritize peer-reviewed research." Both are public posts in the thread, so a wrong answer about your brand is visible to everyone reading it.',
        },
      ],
    },
    {
      id: "web-half",
      title: "The web half: an undisclosed index that leans on communities",
      blocks: [
        {
          kind: "p",
          text: "xAI names no search provider for Grok's web results, publishes no index size and offers no webmaster console or URL submission. It isn't on IndexNow's [list of participating engines](https://www.indexnow.org/searchengines.json) either. What is visible is the output: Ahrefs' [June 2026 ranking](https://ahrefs.com/blog/most-cited-domains-grok/) of the 50 domains Grok cites most, built from Brand Radar data, is led by user-generated platforms.",
        },
        {
          kind: "table",
          head: ["Rank", "Domain", "Share of top-50 citations"],
          rows: [
            ["1", "reddit.com", "16.3%"],
            ["2", "youtube.com", "15.1%"],
            ["3", "facebook.com", "13.9%"],
            ["4", "instagram.com", "5.9%"],
            ["5", "quora.com", "5.5%"],
            ["6", "amazon.com", "5.0%"],
            ["7", "tiktok.com", "4.8%"],
            ["8", "en.wikipedia.org", "3.4%"],
            ["9", "ebay.com", "1.5%"],
            ["10", "walmart.com", "1.5%"],
            ["11", "pinterest.com", "1.4%"],
            ["12", "x.com", "1.4%"],
          ],
        },
        {
          kind: "signals",
          items: [
            {
              title: "Community platforms carry most of it",
              body: "Reddit, YouTube, Facebook, Instagram, Quora and TikTok together take about 61% of the top-50 citation share. Being discussed there is a route that doesn't depend on your own pages ranking anywhere — see [Reddit SEO](/glossary/reddit-seo).",
              evidence: "observed",
            },
            {
              title: "Product questions go to listings",
              body: "Amazon (5.0%), eBay and Walmart (1.5% each) all make the top ten. For anything people buy, a complete, accurate marketplace listing is a web page Grok already reads.",
              evidence: "observed",
            },
            {
              title: "News goes to primary sources",
              body: '@grok\'s prompt tells it to "fetch primary sources for current events" and to verify search results by opening pages. For news about your company, your own dated announcement page is the primary source.',
              evidence: "official",
            },
            {
              title: "Contested topics get a spread",
              body: 'On a controversial query, Grok\'s chat prompt says to "search for a distribution of sources that represents all parties/stakeholders" and to "assume subjective viewpoints sourced from media are biased." Expect to be cited next to critics; evidence holds up better than adjectives.',
              evidence: "official",
            },
            {
              title: "There's no paid route yet",
              body: 'SpaceX\'s S-1 says it does "not currently sell or offer advertisers the ability to place ads on the Grok API," and calls ads in the stand-alone Grok product a possible "incremental monetization opportunity."',
              evidence: "official",
            },
            {
              title: "Your own rankings don't transfer by default",
              body: "With no known index behind the web tool, a strong Google position is not a documented path into Grok. The pages that get cited are the ones its searches surface and its fetcher can open.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "p",
          text: "So the web half is two jobs: make your own pages openable by a fetcher that doesn't announce itself (next section), and be part of the conversations on the platforms Grok already cites. Rankbox's [Reddit Presence](/features/reddit-presence) finds the threads worth joining and drafts replies posted under your own name.",
        },
      ],
    },
    {
      id: "nameless-fetcher",
      title: "The fetcher with no name: robots.txt, WAFs and bursts",
      blocks: [
        {
          kind: "p",
          text: "OpenAI, Anthropic, Google and Perplexity publish their [AI crawlers](/glossary/ai-crawlers). xAI publishes no crawler page, user-agent token, IP list or robots.txt statement for Grok's search or its live page fetches. Cloudflare wrote in [September 2025](https://blog.cloudflare.com/building-a-better-internet-with-responsible-ai-bot-principles/) that \"xAI's bot, grok, does not self-identify at all, making it impossible for website operators to block it.\" A [controlled test by StackFox](https://stackfox.co/research/grok-user-agent) on 6 February 2026 found the same: asked to read a news site, 30 requests hit the server within a second — 19 from one datacenter IP, 10 from another in a third of a second — all claiming to be an ordinary browser, desktop Chrome on both main IPs. \"The word 'Grok' never appears. Neither does 'xAI.'\"",
        },
        {
          kind: "table",
          head: ["User agent", "Where it comes from", "Status"],
          rows: [
            [
              "`GrokBot`, `xAI-Grok`, `Grok-DeepSearch`",
              "Third-party bot directories",
              "Not in xAI's docs; StackFox's test never saw them",
            ],
            [
              "`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36`",
              "StackFox controlled test, February 2026",
              "Seen from both main IPs in the test, on M247 and Datacamp datacenter ranges",
            ],
            [
              "`Go-http-client/1.1`, iPhone Safari strings",
              "StackFox, general Grok traffic",
              "Reported, but not from the controlled test",
            ],
          ],
        },
        {
          kind: "p",
          text: "The consequence: [robots.txt](/glossary/robots-txt) can't target Grok, and neither can a CDN's \"block AI bots\" switch, because nothing in the request says it's Grok. Nothing documents whether Grok's fetcher reads robots.txt at all. Naming the unverified tokens does no harm, but don't mistake it for control — your default group is what applies:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# xAI documents no user agent for Grok's search or page fetches.\n# These names come from third-party lists and are unverified:\n# a rule for them may never match a real request.\nUser-agent: GrokBot\nUser-agent: xAI-Grok\nUser-agent: Grok-DeepSearch\nAllow: /\n\n# Grok's browser-like fetches fall under the default group\nUser-agent: *\nAllow: /\nDisallow: /account/",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Your bot defences are the real Grok setting",
          text: "Grok's fetches look like bursts of desktop Chrome from datacenter IPs, so what stops them is JavaScript challenges, CAPTCHAs, datacenter-IP blocks and per-second rate limits — not robots.txt. If those sit in front of pricing, docs or product pages, Grok reads a challenge page instead of your content. Decide per path: keep the defences on logins, carts and APIs, and keep content pages answerable to a plain HTTP request.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Server-rendered HTML",
              status: "required",
              note: "In Search Engine World's [June 2026 test](https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test), one node of Grok's fetch pipeline ran the page's script, but the answer still quoted the raw-HTML decoy: \"The machinery ran the script; the answer ignored what it found.\" Put the content in the HTML response — see [server-side rendering](/glossary/server-side-rendering).",
            },
            {
              label: "No challenge on content pages",
              status: "required",
              note: "A JavaScript challenge, CAPTCHA or datacenter block hands Grok's fetcher a page with none of your content on it.",
            },
            {
              label: "Rate limits that allow bursts",
              status: "helps",
              note: "StackFox logged 19 requests in about a second from one IP. Per-second limits tuned for people will cut some of them off.",
            },
            {
              label: "Titles that work on a source card",
              status: "helps",
              note: "grok.com's chips show only the site's name; the card behind each one shows the page title and a short preview. The title is what a reader weighs before clicking.",
            },
            {
              label: "Links from your X posts",
              status: "helps",
              note: "Grok can analyse the links in the posts it reads, so a post that links the canonical URL is a second path to the page.",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "xAI says nothing about schema.org. Keep every fact that matters in visible text as well.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "xAI hasn't said Grok reads [llms.txt](/glossary/llms-txt), and no published test has shown it requested.",
            },
            {
              label: "robots.txt rules naming Grok",
              status: "no-effect",
              note: "There's no documented token to name. A rule for `GrokBot` or `xAI-Grok` may never match a request.",
            },
            {
              label: "IndexNow pings",
              status: "no-effect",
              note: "xAI isn't a participating engine, so pings never reach Grok.",
            },
          ],
        },
        {
          kind: "p",
          text: "Test pages the way Grok's fetcher appears to see them — the exact user agent StackFox logged, no JavaScript — ideally from a cloud VM, since that's where its requests come from:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# The user agent StackFox logged from Grok, and no JavaScript\ncurl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36" \\\n  https://yoursite.com/pricing | grep -c "Pro is \\$19"\n\n# 0 = the text needs JavaScript, or your WAF served a challenge page',
        },
        { kind: "h3", text: "Training: no website opt-out, one X setting" },
        {
          kind: "p",
          text: 'The [Grok 4 model card](https://data.x.ai/2025-08-20-grok-4-model-card.pdf) says Grok 4 is pre-trained on a recipe that "includes publicly available Internet data." With no documented crawler token, a website has no robots.txt line xAI says it honours for training. X posts are different: X\'s [privacy policy](https://x.com/en/privacy), effective 15 January 2026, says X may use what it collects "and publicly available information to help train our machine learning or artificial intelligence models." Account holders can switch that off under Settings and privacy → Privacy and safety → Grok & Third-party Collaborators, per [Roboin\'s 2026 walkthrough](https://roboin.io/article/en/2026/01/01/how-to-opt-out-of-grok-training-on-your-posts/). As far as anything documents, that setting governs training, not whether X Search can find and cite your public posts.',
        },
      ],
    },
    {
      id: "missing-referrer",
      title: "Why Grok's clicks show up as Direct",
      blocks: [
        {
          kind: "p",
          text: "Expect little Grok [referral traffic](/glossary/ai-referral-traffic) in analytics, and know that some of the shortfall is measurement, not absence. Two facts about grok.com, both checked on 26 October 2026, explain most of it.",
        },
        {
          kind: "table",
          head: ["Where the click happens", "What reaches your site", "Basis"],
          rows: [
            [
              "A citation chip or source card on grok.com",
              "No referrer, so the visit lands in **Direct**",
              'grok.com\'s web client renders these links with `rel="noopener noreferrer nofollow"` and adds no UTM tags',
            ],
            [
              "Any other grok.com link without that attribute",
              "`https://grok.com/` — the origin only",
              "grok.com sends `Referrer-Policy: origin-when-cross-origin`",
            ],
            [
              "Grok inside x.com or the X app",
              "Undocumented",
              "No published test; check your own logs",
            ],
            [
              "The Grok iOS and Android apps",
              "Undocumented",
              "App link-outs often carry no referrer at all, so assume Direct until you see otherwise",
            ],
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "0.0019%",
              label:
                "Grok's peak share of total website traffic across 101,574 sites, in August 2025, before falling back to near zero",
              source: {
                name: "SE Ranking, Jun 2026",
                href: "https://seranking.com/blog/ai-traffic-research-study/",
              },
            },
            {
              value: "904M",
              label:
                'visits to Grok in January–April 2026, against "effectively zero attributable referrals" in a B2B GA4 panel',
              source: {
                name: "Goodie, May 2026",
                href: "https://higoodie.com/blog/ai-search-traffic-report-2026/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: 'GA4\'s AI Assistant channel won\'t rescue the Direct visits. Google\'s [channel definitions](https://support.google.com/analytics/answer/9756891) describe it as traffic "from sources like ChatGPT, Gemini, Deepseek, Copilot, or Grok," and classify a session there when the medium is `ai-assistant` — which GA4 sets only "if the referrer matches a list of AI Assistants." No referrer, no match. Catch the visits that do carry one with a custom channel, and treat a Direct spike on a page Grok cites as a lead worth checking:',
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source: grok.com, when a referrer survives\n^(.*\\.)?grok\\.com$\n\n# X itself: t.co wraps links in X posts\n^(t\\.co|x\\.com)$",
        },
        {
          kind: "p",
          text: "Server logs are the better instrument, with a catch: you can't filter Grok by user agent. Two methods work instead. Look for its signature — a burst of requests for one URL within a second, a desktop Chrome user agent, a datacenter IP, no referrer — and run a controlled test: publish a URL nobody knows, ask Grok to read it, and see exactly what arrives. Rankbox's free [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) handles the named bots; the bursts below are the part only a query like this finds.",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Bursts: 10+ no-referrer requests for one URL in one second (combined log format)\nawk \'$11=="\\"-\\"" {print substr($4,2,20), $7}\' access.log \\\n  | sort | uniq -c | awk \'$1 >= 10\' | sort -rn | head -20\n\n# Controlled test: ask Grok to summarise https://yoursite.com/grok-test-7f3a, then\ngrep "/grok-test-7f3a" access.log',
        },
        {
          kind: "p",
          text: "For visibility itself, run a fixed [prompt panel](/glossary/prompt-tracking) through Grok on a schedule. Mix current-events prompts, where X dominates, with how-to and product prompts, where the web does, and record which domains and `@handles` get cited. Answers vary between runs, so compare across repeats rather than trusting one screenshot. The free [AI visibility prompt generator](/tools/ai-visibility-prompt-generator) gives you a starting set.",
        },
      ],
    },
    {
      id: "grokipedia",
      title: "Grokipedia: Grok's encyclopedia, cited mostly by other AIs",
      blocks: [
        {
          kind: "p",
          text: 'Grokipedia launched on 27 October 2025 with about 885,000 machine-generated articles, and its homepage now lists more than six million. Nobody edits it directly: readers submit suggestions through a form, and Grok is meant to review each one. That review stalled for months — [Lawfare found](https://www.lawfaremedia.org/article/grokipedia-stopped-reviewing-edits-in-april.-it-didn-t-tell-anyone) no article updated after 24 April 2026 and 13,002 suggestions stuck "in review" as of August. [Grokipedia v0.3](https://teslanorth.com/2026/09/30/spacexai-grokipedia-v03-launch/) shipped on 30 September 2026 with a redesign; whether the backlog has cleared isn\'t documented.',
        },
        {
          kind: "p",
          text: "Its documented reach is mostly outside Grok. Ahrefs' [March 2026 comparison](https://ahrefs.com/blog/wikipedia-vs-grokipedia) counted 356,200 AI citations of Grokipedia against 24.9 million for Wikipedia, with the most coming from ChatGPT and Google's AI Mode, then Copilot and Gemini. grokipedia.com isn't among the 50 domains Grok cites most in Ahrefs' June 2026 data, and xAI doesn't document Grok using it in answers.",
        },
        {
          kind: "list",
          items: [
            "**Search [Grokipedia](https://grokipedia.com/) for your brand, products and founders.** Generated pages can exist without anyone asking for them.",
            "**Suggest corrections with a primary source attached** — your documentation, a filing or a dated announcement — then check back on the suggestion's status rather than assuming it was applied.",
            "**Don't build a Grok strategy on it.** Its citations show up in ChatGPT and Google's AI answers far more than in Grok's.",
          ],
        },
      ],
    },
    {
      id: "company-and-ads",
      title: "Who runs Grok in 2026, and whether you can buy a spot",
      blocks: [
        {
          kind: "p",
          text: 'Grok was built by xAI, which SpaceX acquired effective 2 February 2026, according to its S-1. The AI business has carried SpaceX branding since: SpaceXAI, and then SpaceX Super Intelligence. Musk said on 4 October 2026 that SpaceXAI would be renamed SpaceXSI, [Reuters reported](https://www.thestar.com.my/tech/tech-news/2026/10/05/musk-says-he-will-rename-spacexai-to-spacexsi), and the company\'s X account [became @SpaceXSI](https://teslanorth.com/2026/10/10/spacexai-spacexsi-x-rename/) around 10 October. The developer docs still live at docs.x.ai under the xAI API name, and some pages already credit "SpaceXSI." None of the renaming changed how Grok searches — but search for all three names when you look for documentation.',
        },
        {
          kind: "p",
          text: 'Paid placement isn\'t a route. The S-1 says SpaceX does "not currently sell or offer advertisers the ability to place ads on the Grok API," and describes ads in the stand-alone Grok product only as something there "might be" an opportunity for. Until that changes, a citation in Grok is earned through the two halves above.',
        },
      ],
    },
    {
      id: "grok-folklore",
      title: "Grok folklore, checked",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Allowing GrokBot in robots.txt gets you into Grok.",
              reality:
                "xAI documents no such token, and a February 2026 controlled test never saw it in a request. Grok's fetches arrive as desktop Chrome, so what matters is that your default rules and your WAF let them through.",
            },
            {
              myth: "A CDN's block-AI-bots switch keeps Grok out.",
              reality:
                'Those switches match declared bots, and Grok\'s fetcher "does not self-identify at all" (Cloudflare). Only behavioural rules — challenges, datacenter blocks, rate limits — catch it, and they catch real people too.',
            },
            {
              myth: "Grok mostly cites X posts.",
              reality:
                "It depends on the question. Ahrefs' June 2026 data put x.com at 1.4% of top-50 citations, behind Reddit, YouTube and Facebook; Presenc AI's panel put X posts near 45%, heaviest on current events.",
            },
            {
              myth: "Ranking on Google means ranking in Grok.",
              reality:
                "xAI names no index provider for its web search. Google rankings may help indirectly by making you easy to find and discuss, but there's no documented link.",
            },
            {
              myth: "GA4's AI Assistant channel shows your Grok traffic.",
              reality:
                "Only visits that carry a referrer. grok.com's citation chips use `noreferrer`, so those clicks arrive as Direct.",
            },
            {
              myth: "Grokipedia is the way into Grok.",
              reality:
                "xAI doesn't document Grok using it, and it isn't among the 50 domains Grok cites most. Its documented citations are in ChatGPT and Google's AI answers.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "ssr",
      title: "Put every fact you want cited in the raw HTML",
      detail:
        "Check with `curl`, the Chrome user agent StackFox logged and no JavaScript that the answer is in the response.",
      impact: "high",
    },
    {
      id: "no-challenge",
      title: "Take bot challenges off content pages",
      detail:
        "JavaScript challenges, CAPTCHAs and datacenter-IP blocks stop Grok's browser-like fetches. Keep them on logins, carts and APIs.",
      impact: "high",
    },
    {
      id: "bursts",
      title: "Let one-second bursts through",
      detail:
        "Grok sent 19 requests in about a second from one IP in StackFox's test. Loosen per-second limits on public pages.",
      impact: "medium",
    },
    {
      id: "robots-default",
      title: "Keep your default robots.txt group open",
      detail:
        "With no documented token, `User-agent: *` is the group that applies. Named `GrokBot` rules are optional and unverified.",
      impact: "medium",
    },
    {
      id: "x-account",
      title: "Make the brand account findable by name",
      detail:
        "Brand name in the handle or display name and a bio that says what you do — `x_user_search` looks accounts up by name.",
      impact: "high",
    },
    {
      id: "x-facts",
      title: "Post key facts as text, linking the page, the day they change",
      detail:
        "Prices, launches and specs in the post itself, so keyword and semantic search can match them, with a link to the canonical page.",
      impact: "high",
    },
    {
      id: "x-threads",
      title: "Keep one current thread per recurring question",
      detail:
        "`x_thread_fetch` reads a whole conversation in one call. A complete thread is a ready source.",
      impact: "medium",
    },
    {
      id: "verification",
      title: "Test verification on the brand account",
      detail:
        "A vendor panel saw verified posts cited at 2.8x the rate of equally engaged unverified ones. Measure before and after.",
      impact: "low",
    },
    {
      id: "communities",
      title: "Earn mentions on Reddit, YouTube and the marketplaces",
      detail:
        "Six community platforms take about 61% of Grok's top-50 citation share, and Amazon, eBay and Walmart make the top ten.",
      impact: "high",
    },
    {
      id: "primary-pages",
      title: "Publish dated primary sources for your own news",
      detail:
        "@grok is told to fetch primary sources for current events and verify them by opening pages. Give it one on your domain.",
      impact: "high",
    },
    {
      id: "titles",
      title: "Write titles that read well on a source card",
      detail:
        "The card behind each grok.com citation chip shows the page title. Say what the page answers.",
      impact: "medium",
    },
    {
      id: "measure",
      title: "Measure without the referrer",
      detail:
        "A GA4 channel for `grok.com`, Direct traffic on cited pages, a log query for bursts, a controlled fetch test and a scheduled prompt panel.",
      impact: "medium",
    },
    {
      id: "grokipedia",
      title: "Check your Grokipedia page and suggest fixes",
      detail:
        "Attach a primary source to each suggestion and check its status later — the review queue stalled for months in 2026.",
      impact: "low",
    },
    {
      id: "x-training",
      title: "Decide on X's Grok training setting",
      detail:
        "Privacy and safety → Grok & Third-party Collaborators controls training on your public posts, not whether X Search can cite them.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Grok?",
      a: "Serve your key facts as server-rendered HTML that a datacenter request with a browser user agent can read without a challenge, earn mentions on the platforms Grok cites most — Reddit, YouTube, Facebook, marketplaces — and run an X account that states the same facts in post text and links to the page. There's no crawler to allow by name.",
    },
    {
      q: "Does Grok use X posts or web pages?",
      a: "Both, often in the same answer. Grok has a Web Search tool that searches and browses pages and an X Search tool that runs keyword, semantic, account and thread lookups. Current-events questions lean on X; how-to and definitional questions lean on the web.",
    },
    {
      q: "What search engine does Grok use for the web?",
      a: "xAI doesn't say. Its documentation describes a tool that searches the web in real time and browses pages, but names no provider, index or ranking method, and xAI offers no webmaster console or URL submission.",
    },
    {
      q: "What is Grok's user agent?",
      a: "None is documented. `GrokBot`, `xAI-Grok` and `Grok-DeepSearch` circulate on third-party lists but aren't in xAI's docs. A February 2026 controlled test saw only a desktop Chrome user agent (`Chrome/139.0.0.0`) from datacenter IPs, and Cloudflare says Grok's fetcher doesn't self-identify.",
    },
    {
      q: "Can I block Grok with robots.txt?",
      a: "Not reliably. There's no documented token, xAI hasn't said its fetcher reads robots.txt, and its requests look like ordinary browsers. Only behavioural WAF rules — challenges, datacenter-IP blocks, rate limits — catch them, and those affect real visitors too. For training, websites have no documented opt-out.",
    },
    {
      q: "Why doesn't Grok traffic show up in Google Analytics?",
      a: "grok.com's citation links use `rel=\"noopener noreferrer nofollow\"`, so the browser sends no referrer and the visit lands in Direct. GA4's AI Assistant channel only classifies visits whose referrer matches its list. Use server logs, a controlled fetch test and a custom channel for `grok.com` instead.",
    },
    {
      q: "Can Grok read JavaScript-rendered pages?",
      a: "xAI doesn't document it. In Search Engine World's June 2026 test, one Grok fetch node executed the page's JavaScript, but the answer still came from the raw HTML. Server-render anything you want cited.",
    },
    {
      q: "Does Grok use Grokipedia?",
      a: "xAI hasn't documented Grok citing Grokipedia, and grokipedia.com isn't among Grok's 50 most-cited domains in Ahrefs' June 2026 data. ChatGPT and Google's AI Mode cite it most, so check your brand's page and suggest corrections with a primary source.",
    },
    {
      q: "Can I pay to appear in Grok's answers?",
      a: "Not as of SpaceX's May 2026 S-1, which says it doesn't sell advertisers placement on the Grok API and describes ads in the stand-alone Grok product only as a possible future opportunity.",
    },
    {
      q: "Who owns Grok now?",
      a: "SpaceX, which acquired xAI effective 2 February 2026. The AI business has since been branded SpaceXAI and, from October 2026, SpaceX Super Intelligence (SpaceXSI); the developer docs remain at docs.x.ai.",
    },
  ],

  sources: [
    {
      title: "Web Search",
      publisher: "xAI Docs",
      href: "https://docs.x.ai/developers/tools/web-search",
    },
    {
      title: "X Search",
      publisher: "xAI Docs",
      href: "https://docs.x.ai/developers/tools/x-search",
    },
    {
      title: "Citations",
      publisher: "xAI Docs",
      href: "https://docs.x.ai/developers/tools/citations",
    },
    {
      title: "Tools overview",
      publisher: "xAI Docs",
      href: "https://docs.x.ai/developers/tools/overview",
    },
    {
      title: "Models and pricing (Grok 4.7 knowledge cutoff)",
      publisher: "xAI Docs",
      href: "https://docs.x.ai/developers/models",
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
      title: "Grok prompts: system prompts for Grok chat, @grok and Explain",
      publisher: "xAI on GitHub",
      href: "https://github.com/xai-org/grok-prompts",
    },
    {
      title: "grok.com response headers and web client (checked 26 October 2026)",
      publisher: "grok.com",
      href: "https://grok.com/",
    },
    {
      title: "Space Exploration Technologies Corp. Form S-1",
      publisher: "U.S. SEC",
      href: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm",
    },
    {
      title: "Musk says he will rename SpaceXAI to SpaceXSI (Reuters)",
      publisher: "The Star",
      href: "https://www.thestar.com.my/tech/tech-news/2026/10/05/musk-says-he-will-rename-spacexai-to-spacexsi",
    },
    {
      title: "SpaceXAI's X account is now SpaceXSI",
      publisher: "TeslaNorth",
      href: "https://teslanorth.com/2026/10/10/spacexai-spacexsi-x-rename/",
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
      title: "Analysis of top AI search engines: who is catching up to ChatGPT?",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/ai-traffic-research-study/",
    },
    {
      title: "AI search traffic report 2026",
      publisher: "Goodie",
      href: "https://higoodie.com/blog/ai-search-traffic-report-2026/",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "IndexNow participating search engines",
      publisher: "IndexNow",
      href: "https://www.indexnow.org/searchengines.json",
    },
    {
      title: "X Privacy Policy (effective 15 January 2026)",
      publisher: "X",
      href: "https://x.com/en/privacy",
    },
    {
      title: "How to opt out of Grok training on your posts",
      publisher: "Roboin",
      href: "https://roboin.io/article/en/2026/01/01/how-to-opt-out-of-grok-training-on-your-posts/",
    },
    {
      title: "Grokipedia stopped reviewing edits in April. It didn't tell anyone",
      publisher: "Lawfare",
      href: "https://www.lawfaremedia.org/article/grokipedia-stopped-reviewing-edits-in-april.-it-didn-t-tell-anyone",
    },
    {
      title: "SpaceXAI launches Grokipedia v0.3",
      publisher: "TeslaNorth",
      href: "https://teslanorth.com/2026/09/30/spacexai-grokipedia-v03-launch/",
    },
    {
      title: "Wikipedia vs Grokipedia",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/wikipedia-vs-grokipedia",
    },
    {
      title: "Grokipedia",
      publisher: "Grokipedia",
      href: "https://grokipedia.com/",
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
      title: "Free AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "Sort the named AI bots in your access logs — then look for the unnamed bursts that Grok's fetcher leaves.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Compare Grok with ChatGPT, Claude, Perplexity and Gemini: indexes, crawlers, rendering and referrers, side by side.",
    },
  ],
};
