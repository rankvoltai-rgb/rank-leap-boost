import type { EngineGuide } from "../types";

/* Facts verified 2026-10-26 against DeepSeek's API docs (changelog, Search &
   Fetch guide, release notes), its EU training-content summaries, the V4
   encoding notes on Hugging Face, and the independent sources listed below. */

const CHANGELOG = "https://api-docs.deepseek.com/updates";
const SEARCH_GUIDE = "https://api-docs.deepseek.com/guides/search";
const V41_SUMMARY =
  "https://cdn.deepseek.com/policies/DeepSeek-V4.1-public-summary-of-training-content.pdf";
const ENCODING = "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/encoding/README.md";
const STUDY = "https://arxiv.org/abs/2607.15771";

export const deepseek: EngineGuide = {
  slug: "deepseek",
  metaTitle: "DeepSeek SEO: How to Get Cited by DeepSeek's Own Search Engine",
  metaDescription:
    "DeepSeek now searches its own index. How it scores pages (authority tier, rerank score, date), what DeepseekBot is, and how to test your site against its Search API.",
  keywords: [
    "DeepSeek SEO",
    "get cited by DeepSeek",
    "DeepSeek search engine",
    "DeepSeek Search API",
    "DeepseekBot robots.txt",
    "what search engine does DeepSeek use",
    "DeepSeek citations",
  ],
  headline: {
    lead: "DeepSeek SEO:",
    accent: "how to get cited by the search engine DeepSeek built",
  },
  subhead:
    "In October 2026 DeepSeek said its web search runs on an in-house engine, and published the scores every result carries. Here's what that engine rewards, what DeepseekBot is, and how to check your pages against the same index.",

  shortAnswer:
    "To get cited by DeepSeek, get your pages into **DeepSeek's own search engine** and give it reasons to rank them: dated, authoritative, first-party pages in the language your DeepSeek users ask in, with the facts in server-rendered HTML and no bot challenge in front of them. Since October 2026 DeepSeek says its web search runs on an in-house index that scores each result for relevance, authority and freshness and filters out SEO spam and “GEO manipulation.” Its training crawler is **DeepseekBot**; no crawler is named for search. Its users are concentrated in China, Russia and parts of Africa, so decide by market how much to invest.",

  takeaways: [
    "DeepSeek's web search runs on its own engine. Its [October 17, 2026 changelog](https://api-docs.deepseek.com/updates) says the index covers “hundreds of billions of web pages”; in 2025 the app reportedly used the Chinese search API Bocha.",
    "Every result is scored: an `authority` tier from 0 to 4, a `rerank_score` from 0 to 3 that blends relevance, authority and freshness, and a publication `date`. DeepSeek publishes the fields, not the formula.",
    "DeepSeek says the engine filters “SEO spam, GEO manipulation, and low-quality AIGC.” It's the first assistant to name GEO manipulation, and it hasn't defined it.",
    "The training crawler now has a name: DeepSeek's EU training summaries list **DeepseekBot** and say it respects robots.txt “where applicable.” No user-agent string, IP ranges or search crawler are published.",
    "You can query the same engine. The Search API ($0.75 per 1,000 calls) shows whether your pages are indexed and with what date and tier; Fetch shows what DeepSeek extracts from a URL.",
    "Answers cite with numbered `[citation:N]` markers. In a June–July 2026 study of Chinese queries, DeepSeek averaged 9.2 citations per answer, spread across the widest range of domains of four engines.",
  ],

  facts: [
    { label: "Search engine behind DeepSeek's web search", value: "In-house" },
    { label: "Training crawler DeepSeek names", value: "DeepseekBot", mono: true },
    { label: "Authority tiers on every search result", value: "0–4", mono: true },
    { label: "chat.deepseek.com among AI chatbot sites (Sep 2026)", value: "#4" },
  ],

  preview: {
    prompt: "Which invoicing app has the best free plan for a three-person studio?",
    status: "Search · 10 web pages",
    answer:
      "**YourBrand** has the most generous free plan for a three-person studio: unlimited invoices for up to three users, with no time limit on the free tier.",
    sources: [
      { domain: "yourbrand.example", title: "Pricing: free for teams of up to 3" },
      { domain: "invoice-reviews.example", title: "The best free invoicing apps in 2026" },
      { domain: "studio-forum.example", title: "What does your studio use for invoices?" },
      { domain: "smallbiz-news.example", title: "Free plans compared: five invoicing apps" },
    ],
  },

  profile: {
    retrieval:
      "DeepSeek's in-house search engine (announced Oct 2026); the agent then reads chosen pages",
    searchCrawler: "None named for the search index; Fetch publishes no user agent",
    trainingCrawler: "DeepseekBot, named in EU training summaries; no UA string or IPs published",
    rendersJs: "Not documented; a June 2026 test saw its fetcher run JavaScript on a pasted URL",
    referrer:
      "Undocumented; GA4's AI Assistant channel names DeepSeek; referrals near zero since Sep 2025",
    citationStyle:
      "Numbered inline markers (its [citation:N] format) plus a list of the pages found",
    biggestLever:
      "Dated, authoritative first-party pages in the language your DeepSeek users ask in",
  },

  sections: [
    {
      id: "deepseek-search-engine",
      title: "DeepSeek now searches its own index",
      blocks: [
        {
          kind: "p",
          text: `On October 17, 2026, DeepSeek's [API changelog](${CHANGELOG}) put on record what had never been public: “DeepSeek's web and API search capabilities are powered by our in-house DeepSeek search engine.” It describes “an AI-native general-purpose search engine that indexes hundreds of billions of web pages, supports multilingual search,” handling “hundreds of millions of search requests from around the world every day.” The same day DeepSeek opened that engine to developers as the [Search and Fetch APIs](${SEARCH_GUIDE}).`,
        },
        {
          kind: "p",
          text: "That replaces what site owners worked from in 2025. In March 2025 Weng Rouying, CTO of the Hangzhou search-API company Bocha, told [Daily Economic News](https://www.nbd.com.cn/articles/2025-03-07/3779901.html) that DeepSeek had connected to Bocha's Search API before its January 2025 surge; DeepSeek never confirmed it. DeepSeek's [privacy policy](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html), last updated February 10, 2026, still says “We integrate third-party APIs to provide search services.” Nothing public dates the switch, so treat DeepSeek citation data from before October 2026 as possibly describing the old setup.",
        },
        {
          kind: "table",
          head: ["", "2025", "Since October 2026"],
          rows: [
            [
              "**Who runs the index**",
              "Third-party APIs (Bocha, per its CTO)",
              "DeepSeek's own engine, per its changelog",
            ],
            [
              "**Ranking fields published**",
              "None",
              "`authority` tier, `rerank_score`, publication `date`",
            ],
            [
              "**Spam policy**",
              "None stated",
              "Filters “SEO spam, GEO manipulation, and low-quality AIGC”",
            ],
            [
              "**Where it's used**",
              "DeepSeek web and app",
              "DeepSeek web and API, including coding agents pointed at DeepSeek",
            ],
            ["**Crawler for the index**", "The provider's own", "Not named"],
          ],
        },
        {
          kind: "p",
          text: "The engine also travels beyond DeepSeek's chat. Its [Claude Code guide](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code) says that when the model decides a question needs the web, Claude Code connected to DeepSeek will “perform the search through the API provided by DeepSeek.” The [Search & Fetch guide](https://api-docs.deepseek.com/guides/search) says the same server-side calls happen in Codex and DeepSeek Harness, and become billable on November 1, 2026 (Beijing time).",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "What this changes for you",
          text: "Our read: ranking in Bing or Google no longer gets you into DeepSeek by proxy. You're in DeepSeek's index or you aren't — and, unlike with any other assistant, you can check, because the index answers API calls. How to run the checks follows the scorecard below.",
        },
      ],
    },
    {
      id: "search-on-off",
      title: "Search on, search off: two answers to one question",
      blocks: [
        {
          kind: "p",
          text: "DeepSeek's composer has two toggles, **DeepThink** and **Search**, as the [deepseek.com](https://www.deepseek.com/en) homepage shows them (the Chinese interface says 深度思考 and 智能搜索, “smart search”). Web search arrived on chat.deepseek.com on December 10, 2024 — “toggle ‘Internet Search’ for real-time answers,” said the [release note](https://api-docs.deepseek.com/news/news1210). Since October 17, 2026 the web and app answer with **DeepSeek-V4.1-Flash-1017** ([release note](https://api-docs.deepseek.com/news/news261017)); the app's September 11 update had already merged its Instant, Expert and Vision modes into one ([App Store](https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349)).",
        },
        {
          kind: "p",
          text: `With Search off, the answer can only come from what the model learned in training, and it carries no sources. With Search on, DeepSeek runs a search agent. Its [V4 encoding notes](${ENCODING}) document the special tokens of “the internal search agent pipeline” — written like \`<｜action｜>\`, shortened to \`action\` below — and they read like a map of the steps:`,
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "A router picks Search or Answer",
              body: "An `action` step “determines whether the user prompt requires a web search or can be answered directly,” returning a decision such as “Search” or “Answer.” A question the model thinks it knows may be answered from memory even with the toggle on.",
              lever:
                "Be in the training data too: consistent facts about your brand on public, crawlable pages.",
            },
            {
              title: "It writes queries and rates how authoritative sources must be",
              body: "`query` generates the search queries. `authority` “classifies the user prompt's demand for source authoritativeness,” and `domain` identifies the topic area. The Search API also takes the user's original question (`ori_question`) and an IP address to localize results.",
              lever:
                "Use the words buyers type — product, category and place names — in titles and headings, in their language.",
            },
            {
              title: "DeepSeek's index returns scored results",
              body: "Each result carries a title, URL, a 100–200 character `snippet` for display, a 600–800 character `summary` “intended to be read by a model,” a publication `date`, an `authority` tier and a `rerank_score`.",
              lever:
                "Front-load a summary worth reading, and give the page a date a machine can parse.",
            },
            {
              title: "It decides which pages to open",
              body: "`extracted_url` and `read_url` decide “whether each URL in the user prompt should be fetched and read.” DeepSeek's Fetch returns a page as Markdown and is “subject to the target site's availability and access policies.”",
              lever:
                "Keep public pages free of logins, bot challenges and JavaScript-only content.",
            },
            {
              title: "The answer cites with numbered markers",
              body: "DeepSeek's published search prompt ([R1 repository](https://github.com/deepseek-ai/DeepSeek-R1)) wraps each result as `[webpage X begin]...[webpage X end]` and tells the model to cite with `[citation:X]` at the end of the sentence, filter irrelevant results, “avoid repeatedly citing the same webpage,” and answer in the user's language.",
              lever:
                "Write sentences that carry one fact each, so a marker can sit right after them.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Labels, not a wiring diagram",
          text: "DeepSeek documents these tokens for its V4 search agent but hasn't said the app runs every step in this order, and it hasn't published a search prompt newer than R1's. Read the pipeline as the closest public description. The July 2026 study below still saw `[citation:N]` labels in DeepSeek's answers, and V3.2 (December 2025) was DeepSeek's first model to “integrate thinking directly into tool-use,” so it can reason between searches ([release note](https://api-docs.deepseek.com/news/news251201)).",
        },
      ],
    },
    {
      id: "result-scorecard",
      title: "The scorecard behind every DeepSeek result",
      blocks: [
        {
          kind: "p",
          text: `DeepSeek is the only major assistant that publishes the ranking fields its search returns. They're in the [Search & Fetch guide](${SEARCH_GUIDE}), for an API the changelog says runs on the same engine as DeepSeek's web search. Users never see these numbers; the model does.`,
        },
        {
          kind: "table",
          head: ["Field", "What DeepSeek says", "What you control"],
          rows: [
            [
              "`rerank_score`",
              "“A relevance score from 0 to 3 that combines signals such as relevance, authority, and freshness”; 1.5 or above counts as high quality",
              "Relevance to the query, plus the two signals below",
            ],
            [
              "`authority`",
              "“The authority tier of the page, 0 to 4 (-1 means unknown)”; 3 or above means “highly authoritative”",
              "Being the official or expert source on the topic. How tiers are assigned isn't published",
            ],
            [
              "`date`",
              "“The publication time in UTC… or null when unknown”",
              "A visible date plus `datePublished` in your Article markup",
            ],
            [
              "`summary`",
              "600–800 characters, “intended to be read by a model”",
              "An answer in the first paragraphs, not after a long intro",
            ],
            [
              "`snippet`",
              "100–200 characters, “intended for display in a UI”",
              "A specific title and opening sentence",
            ],
            [
              "`site_name`, `site_icon`",
              "Either can be null",
              "A consistent site name and a favicon (our read)",
            ],
          ],
        },
        {
          kind: "signals",
          items: [
            {
              title: "Freshness is scored, and dates are filterable",
              body: "Freshness is one of the three named inputs to `rerank_score`, and queries accept `after:` and `before:` publication-date operators. A date the engine can read is part of how it ranks you.",
              evidence: "official",
            },
            {
              title: "An undated page may drop out of date-filtered searches",
              body: "When DeepSeek can't find a publication date, `date` is null. A page with no date can't satisfy “published after 2026-01-01,” so it's likely left out whenever the agent filters by recency.",
              evidence: "our-read",
            },
            {
              title: "Authority is a tier, and the query sets the bar",
              body: "Pages get a tier from 0 to 4, and the agent separately rates how much authority a question demands. Health, money and legal questions plausibly demand higher tiers than a product comparison.",
              evidence: "our-read",
            },
            {
              title: "Language is a filter",
              body: "The engine “supports multilingual search,” queries accept a `lang:` operator such as `lang:zh,en`, and DeepSeek's search prompt answers in the user's language.",
              evidence: "official",
            },
            {
              title: "Results can depend on location",
              body: "The Search API's `localization` field takes an IP address “used to localize search results.” Expect a buyer in Moscow and one in Shanghai to see different sources for the same question.",
              evidence: "official",
            },
            {
              title: "The model may read a summary, not your page",
              body: "Full page `content` is returned only on request, while the `summary` is built for the model. If your answer sits below a long preamble, the summary may miss it.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Fields, not a formula",
          text: "DeepSeek doesn't say how tiers are assigned or how the three signals are weighted, as [Search Engine Journal](https://www.searchenginejournal.com/deepseek-opens-its-in-house-search-engine-to-developers/593526/) also noted. Use the fields to diagnose your pages, not to reverse-engineer the ranking.",
        },
      ],
    },
    {
      id: "check-your-pages",
      title: "Check your pages against DeepSeek's index",
      blocks: [
        {
          kind: "p",
          text: "Because the engine answers API calls, you can see roughly what DeepSeek's agent sees. Search and Fetch each cost $0.75 per 1,000 successful requests; failed and empty searches aren't billed. You need an API key from [platform.deepseek.com](https://platform.deepseek.com). Run these five checks in order:",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Are you indexed?** Search `site:yourdomain.com` with a topic word. No results for pages that rank in Google or Bing means DeepSeek's index hasn't picked them up.",
            "**What date does it hold?** Compare each result's `date` with the page's real publication date. `null` means it found none.",
            "**What tier are you?** Note your `authority` against competitors' on the same queries. It's a relative signal; the scale isn't explained.",
            "**Who wins your buyers' questions?** Run the questions they ask, in their language, with `lang:` and with `localization` set to an IP address in your market.",
            "**What does it extract?** Fetch your key URLs and read the Markdown. The prices, specs and dates should be there — not a cookie banner or an empty app shell.",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: '# 1–3. Is the page in DeepSeek\'s index, with what date and tier?\ncurl -s https://api.deepseek.com/v1/tools/search \\\n  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"query": "free plan site:yourbrand.com", "count": 10}\' \\\n  | jq \'.results[] | {url, date, authority, rerank_score}\'\n\n# 4. A buyer question, in Chinese, published this year\n#    -d \'{"query": "免费 发票 软件 推荐 lang:zh after:2026-01-01", "count": 20}\'\n\n# 5. What does DeepSeek extract from the page?\ncurl -s https://api.deepseek.com/v1/tools/fetch \\\n  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"url": "https://yourbrand.com/pricing"}\' \\\n  | jq -r \'.content\' | head -40',
        },
        {
          kind: "table",
          head: ["What you see", "Likely cause", "What to do"],
          rows: [
            [
              "No results for `site:` queries",
              "Not indexed yet, or the crawler was refused",
              "Check robots.txt and CDN bot rules; keep the pages linked and in your sitemap",
            ],
            [
              "`date: null`",
              "No publication date it could detect",
              "Show the date on the page and in `datePublished`",
            ],
            [
              "Fetch returns 404",
              "Per the docs: an unavailable URL, “a URL blocked by site policy,” an error, an unsupported type, or no extractable Markdown",
              "Test with your bot rules off for one URL; make sure the content is in the HTML",
            ],
            [
              "Fetch returns a banner or a shell",
              "Content behind JavaScript or an interstitial",
              "[Server-render](/glossary/server-side-rendering) the facts; don't gate them",
            ],
            [
              "Lower `authority` than competitors",
              "Tier rules unpublished",
              "Our read: be the primary source — original data, named experts, cited documentation",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "The API is the index, not the answer",
          text: "Our read: in the app the agent writes its own queries, may localize to the user, chooses what to open and decides what to cite. API results tell you whether you can be found and how you're scored — not whether a given answer will cite you. Pair them with the prompt panel described under analytics.",
        },
      ],
    },
    {
      id: "deepseekbot",
      title: "DeepseekBot, Common Crawl and the crawler nobody has named",
      blocks: [
        {
          kind: "p",
          text: `DeepSeek now names its training crawler. Its EU [public summary of training content for DeepSeek-V4.1](${V41_SUMMARY}), last updated September 24, 2026, lists it as **DeepseekBot**, used “to collect publicly available online content for training” and to “verify existing data by cross-referencing multiple sources and fact-checking information.” It says the crawler “is designed to respect robots.txt instructions and other standard web protocols, where applicable” and is “not designed to circumvent captchas, paywalls, or password-protected websites.” The V4 and V3.1/V3.2 summaries say the same.`,
        },
        {
          kind: "p",
          text: "What DeepSeek doesn't publish is a user-agent string, IP ranges or a way to verify a request. Bot directories fill the gap with their own observations: [Known Agents](https://knownagents.com/agents/deepseekbot) lists `Mozilla/5.0 (compatible; DeepSeekBot/1.0; +https://www.deepseek.com/)`, measures 79.8% robots.txt compliance, and warns that any client can claim the name. Cloudflare's [AI Crawl Control list](https://developers.cloudflare.com/ai-crawl-control/reference/bots/) has no DeepSeek entry.",
        },
        {
          kind: "p",
          text: "Two more paths matter. The same summary lists **Common Crawl** among V4.1's training data, and the [V4.1 tech report](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf) says DeepSeek “re-bootstrapped” its own crawling system from Common Crawl — so `CCBot` feeds DeepSeek models as well as many others. And nothing at all is named for the search index, or as Fetch's user agent.",
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "DeepseekBot",
              role: "training",
              purpose:
                "DeepSeek's own crawler, named in its EU training summaries: collects public content for model training and cross-checks facts.",
              robots: "yes",
              robotsNote:
                "“Where applicable,” per DeepSeek; no user-agent string or IPs to verify it.",
              advice: "your-call",
            },
            {
              token: "CCBot",
              role: "training",
              purpose:
                "Common Crawl's crawler. DeepSeek lists Common Crawl in V4.1's training data, as do many other model makers.",
              robots: "yes",
              robotsNote: "Verifiable: Common Crawl publishes IP ranges and reverse DNS.",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: '# Opt out of DeepSeek model training (its own crawler).\n# Matching is case-insensitive (RFC 9309), so this also covers\n# the "DeepSeekBot" spelling that bot directories report.\nUser-agent: DeepseekBot\nDisallow: /\n\n# Optional: Common Crawl, which DeepSeek also trains on.\nUser-agent: CCBot\nDisallow: /\n\n# No DeepSeek search crawler exists to allow by name,\n# so keep public pages open to everyone else.\nUser-agent: *\nAllow: /',
        },
        {
          kind: "callout",
          tone: "warning",
          title: "A DeepseekBot block is a training decision — probably",
          text: "DeepSeek describes DeepseekBot only as a training and fact-checking crawler and names nothing for search. Our read: blocking it shouldn't remove you from DeepSeek's search results, but DeepSeek doesn't say either way. If DeepSeek visibility matters to you, rerun the `site:` check above after any robots.txt change.",
        },
        {
          kind: "p",
          text: "On JavaScript the evidence is one test. In June 2026 [Search Engine World](https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test) pasted unlinked URLs into a set of assistants: DeepSeek executed the page's script and reported the rendered value, while ChatGPT, Claude and Gemini read the raw HTML. That covers the user-pasted path only, not the index. Server-render anyway, then confirm with a Fetch call.",
        },
        {
          kind: "p",
          text: "Fetch also documents how it fails: HTTP 403 when DeepSeek's own “security policy” rejects a request, 404 for “a URL blocked by site policy” among other causes, and a per-domain rate limit. Our read: a CDN rule that challenges unknown clients turns your pages into 404s for DeepSeek's agent.",
        },
      ],
    },
    {
      id: "spam-filters",
      title: "What DeepSeek says it filters out",
      blocks: [
        {
          kind: "p",
          text: `The [changelog](${CHANGELOG}) is blunt: the engine “filters SEO spam, GEO manipulation, and low-quality AIGC through strict detection mechanisms, ensuring authoritative and trustworthy information for users and LLMs.” DeepSeek is the first assistant maker to name GEO manipulation as something it removes. It hasn't defined the term or described the detection, so the table below is our read of what's most exposed.`,
        },
        {
          kind: "table",
          head: ["Tactic", "Why it's exposed (our read)"],
          rows: [
            [
              "Hidden text or instructions addressed to AI models",
              "The plainest reading of “GEO manipulation”: content written for the model, not the reader",
            ],
            [
              "Hundreds of near-identical AI-written pages",
              "“Low-quality AIGC” is named outright; templated pages are what [scaled content abuse](/glossary/scaled-content-abuse) means",
            ],
            [
              "Dates bumped without real changes",
              "Freshness feeds `rerank_score`, which makes faked freshness an obvious target",
            ],
            [
              "Doorway pages and keyword stuffing",
              "Classic SEO spam, which DeepSeek filters by name",
            ],
            [
              "Seeded forum posts and paid mentions",
              "Coordinated third-party mentions are the off-site version of the same manipulation",
            ],
          ],
        },
        {
          kind: "p",
          text: `The positive version is visible in DeepSeek's citations: in the [July 2026 study](${STUDY}), DeepSeek relied most heavily on official sources — government and corporate sites — for business details. A first-party page that states the facts plainly is both hard to classify as spam and what DeepSeek already leans on.`,
        },
        {
          kind: "callout",
          tone: "tip",
          title: "AI-assisted isn't the same as low-quality AIGC",
          text: "DeepSeek's wording targets low-quality AI-generated content, not AI involvement. Our read: a page drafted with AI that adds original facts, names who stands behind it and cites real sources is a different thing from a batch of templated pages — keep your output on the right side of that line.",
        },
      ],
    },
    {
      id: "citation-evidence",
      title: "What DeepSeek's answers cite: the 2026 evidence",
      blocks: [
        {
          kind: "p",
          text: `The largest look at DeepSeek's citations is an [arXiv study](${STUDY}) (July 2026) that sent 614 controlled Chinese-language queries — dining, hotels, beauty, health, legal and finance among them — to the web and app interfaces of DeepSeek, Doubao, Tencent Yuanbao and Qwen, three times each, in June and July 2026, and analyzed 160,860 citations. Read it as Chinese local search measured before DeepSeek's October announcement; it may not transfer to English B2B questions.`,
        },
        {
          kind: "stats",
          items: [
            {
              value: "9.2",
              label: "citations per DeepSeek answer, on web and app alike",
              source: { name: "arXiv study, Jul 2026", href: STUDY },
            },
            {
              value: "~5%",
              label:
                "of citations went to DeepSeek's most-cited domain — the widest spread of four engines",
              source: { name: "arXiv study, Jul 2026", href: STUDY },
            },
            {
              value: "55 days",
              label:
                "typical age of pages DeepSeek Web cited for time-sensitive queries, against 181 days for evergreen ones",
              source: { name: "arXiv study, Jul 2026", href: STUDY },
            },
          ],
        },
        {
          kind: "signals",
          items: [
            {
              title: "Many slots per answer",
              body: "With about nine citations per answer, a page doesn't need to be the best source — one of the useful ones is enough.",
              evidence: "observed",
            },
            {
              title: "A long tail of domains",
              body: "DeepSeek's cited pages had the lowest average 5118-Baidu quality score of the four engines. Big domains don't own the slots.",
              evidence: "observed",
            },
            {
              title: "Official sources for business facts",
              body: "For contact details and similar facts, DeepSeek leaned most on government and corporate official sites.",
              evidence: "observed",
            },
            {
              title: "Strong recency on time-sensitive questions",
              body: "Doubao and DeepSeek showed the strongest recency response; Tencent Yuanbao cited the oldest pages.",
              evidence: "observed",
            },
            {
              title: "Listed isn't cited",
              body: "On DeepSeek and Yuanbao, answers listed about 10.5 sources but put about 6.9 into the text; 39.3% of listed sources never appeared in the answer body.",
              evidence: "observed",
            },
            {
              title: "Brands without a source",
              body: "16.9% of brand mentions in DeepSeek Web answers matched no page it cited — the highest rate of the four. What the wider web says about you still speaks for you.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "p",
          text: "Web and app don't cite the same pages. DeepSeek was the most consistent of the four engines, and still its web and app answers shared only about half their domains (a Jaccard similarity of 0.51) and 48% of their top three sources. A page cited in the browser may be missing in the app, so test both.",
        },
      ],
    },
    {
      id: "markets",
      title: "Where DeepSeek answers reach buyers",
      blocks: [
        {
          kind: "p",
          text: "DeepSeek's reach is large and lopsided. Microsoft's AI Economy Institute ([January 2026](https://www.microsoft.com/en-us/research/wp-content/uploads/2026/01/Microsoft-AI-Diffusion-Report-January-2026.pdf)) put its market share at 89% in China, 56% in Belarus, 49% in Cuba and 43% in Russia, estimated usage across Africa at 2 to 4 times other regions, and found that “Adoption remained low in North America and Europe.”",
        },
        {
          kind: "stats",
          items: [
            {
              value: "#4",
              label:
                "chat.deepseek.com among AI chatbot sites, behind chatgpt.com, gemini.google.com and claude.ai",
              source: {
                name: "Similarweb, Sep 2026",
                href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
              },
            },
            {
              value: "89%",
              label:
                "DeepSeek's share of AI use in China, against low adoption in North America and Europe",
              source: {
                name: "Microsoft, Jan 2026",
                href: "https://www.microsoft.com/en-us/research/wp-content/uploads/2026/01/Microsoft-AI-Diffusion-Report-January-2026.pdf",
              },
            },
            {
              value: "50.5%",
              label: "of deepseek.com's desktop traffic came from China; Russia 9.0%, the US 5.8%",
              source: {
                name: "Similarweb, Sep 2026",
                href: "https://www.similarweb.com/website/deepseek.com/",
              },
            },
          ],
        },
        { kind: "h3", text: "Language decides which pages compete" },
        {
          kind: "p",
          text: "The engine filters by language and DeepSeek answers in the user's language. Our read: a question asked in Chinese or Russian is matched mostly against pages in that language, so an English-only site competes poorly for it. If those buyers matter, publish real localized pages — a machine-translated stub is exactly what a low-quality AIGC filter is built to catch.",
        },
        { kind: "h3", text: "Restrictions to factor in" },
        {
          kind: "list",
          items: [
            "**Italy:** the [Garante](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10097450) ordered an immediate limitation on processing Italian users' data on January 30, 2025.",
            "**US federal agencies:** a Homeland Security order published October 20, 2026 requires civilian agencies to remove DeepSeek products, including third-party products built with DeepSeek technology ([TechCrunch](https://techcrunch.com/2026/10/20/us-orders-federal-agencies-to-remove-chinas-deepseek-ai-from-their-systems/)). It doesn't cover consumers or companies.",
            "**Government devices elsewhere:** Australia, Canada, South Korea and the Czech state administration, among others, restricted it on official systems in 2025 ([Wikipedia summary](https://en.wikipedia.org/wiki/DeepSeek_%28chatbot%29)).",
            "**Data location:** DeepSeek's privacy policy says it collects, processes and stores personal data in the People's Republic of China — the point most regulators cite.",
          ],
        },
        { kind: "h3", text: "Hosted DeepSeek models search elsewhere" },
        {
          kind: "p",
          text: "DeepSeek publishes its model weights, so other companies run DeepSeek models inside their own assistants. Our read: those products bring their own retrieval, so a citation there is won in that product's search, not DeepSeek's. Test them separately if your market uses them.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Decide by market",
          text: "If your customers are in China, Russia or Africa, DeepSeek deserves its own checks and pages in their language. If they're in the US or Western Europe, the work that wins other assistants — public, dated, server-rendered first-party pages — covers DeepSeek too; a quick `site:` check against its index is enough.",
        },
      ],
    },
    {
      id: "analytics",
      title: "Finding DeepSeek in your analytics",
      blocks: [
        {
          kind: "p",
          text: "DeepSeek documents nothing about how its links open or what referrer they send. Google's [channel definitions](https://support.google.com/analytics/answer/9756891) name it: GA4's **AI Assistant** channel covers “sources like ChatGPT, Gemini, Deepseek, Copilot, or Grok.” But Google [hasn't published](https://www.searchenginejournal.com/google-analytics-adds-ai-assistant-as-default-channel-group/574974/) the referrer list behind the channel, which arrived on May 14, 2026.",
        },
        {
          kind: "p",
          text: "There may be little to catch. [SE Ranking](https://seranking.com/blog/ai-traffic-research-study/), using GA4 data from 101,574 sites between January 2025 and April 2026, found DeepSeek held 0.37% of AI referral traffic — the fourth-largest source — and that “from September 2025 onward, DeepSeek's referral traffic dropped to essentially zero across all regions.” SE Ranking's explanation is that users were still trying many AI tools in 2025. Our read: app-to-browser clicks often arrive with no referrer and land in Direct, so check there before concluding DeepSeek sends you nothing.",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source: DeepSeek, when a referrer arrives\n(^|\\.)deepseek\\.com$\n\n# A custom channel for the major assistants, placed above Referral\nchatgpt\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com|deepseek\\.com",
        },
        {
          kind: "p",
          text: "Server logs are harder. A `DeepseekBot` match is a training crawler and can be spoofed, and Fetch's user agent isn't published. You can learn what DeepSeek's fetcher looks like on your own stack: create an unlinked page, request it through the Fetch API, and log every hit on that path.",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Ask DeepSeek to fetch a page nobody else knows about\ncurl -s https://api.deepseek.com/v1/tools/fetch \\\n  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"url": "https://yoursite.com/dsk-canary-7f3k2"}\' > /dev/null\n\n# Then read who came for it: time, IP and user agent\ngrep "/dsk-canary-7f3k2" access.log | awk -F\'"\' \'{print $1, $6}\'',
        },
        {
          kind: "p",
          text: "For citations, run a [prompt panel](/glossary/prompt-tracking) the way the July 2026 study did: a fixed set of buyer questions, Search on, three runs each, on web and app. Record whether you're cited in the text, listed without a citation, or named with no source at all.",
        },
      ],
    },
    {
      id: "out-of-date",
      title: "Six DeepSeek assumptions that are now out of date",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "DeepSeek searches Bing, Google or Bocha.",
              reality:
                "DeepSeek says its web and API search run on its own engine. Bocha's CTO claimed the 2025 integration; DeepSeek never confirmed it, and its privacy policy still mentions third-party search APIs.",
            },
            {
              myth: "DeepSeek documents no crawler.",
              reality:
                "Its EU training summaries name **DeepseekBot**. What's still missing is a user-agent string, IP ranges and any crawler for the search index.",
            },
            {
              myth: "Blocking DeepseekBot takes you out of DeepSeek's answers.",
              reality:
                "DeepSeek describes it as a training and fact-checking crawler. Nothing says it feeds search; check with a `site:` query after you change robots.txt.",
            },
            {
              myth: "There's no way to see how DeepSeek ranks pages.",
              reality:
                "The Search API returns each result's `authority` tier, `rerank_score` and `date`. The weighting is unpublished, but you can see where you stand.",
            },
            {
              myth: "GA4's AI Assistant channel will show your DeepSeek traffic.",
              reality:
                "Google names DeepSeek in the channel, but SE Ranking measured DeepSeek referrals at essentially zero from September 2025. Check Direct, and track citations in the answers.",
            },
            {
              myth: "Anything running a DeepSeek model searches the way DeepSeek does.",
              reality:
                "Products that host DeepSeek's open weights bring their own retrieval. Only DeepSeek's web, app and API use DeepSeek's index.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "indexed",
      title: "Check your key pages are in DeepSeek's index",
      detail:
        "Run `site:yourdomain.com` queries through the Search API. Missing pages are the first thing to fix.",
      impact: "high",
    },
    {
      id: "fetch-check",
      title: "Fetch your money pages and read the Markdown",
      detail:
        "Prices, specs and dates should come back as text — not a cookie wall, a challenge page or an empty shell.",
      impact: "high",
    },
    {
      id: "bot-rules",
      title: "Stop challenging unknown fetchers on public pages",
      detail:
        "DeepSeek's index crawler and Fetch publish no user agent, so they can't be allowlisted by name. Keep CDN bot modes off public pages.",
      impact: "high",
    },
    {
      id: "dates",
      title: "Give every page a date DeepSeek can read",
      detail:
        "A visible date plus `datePublished` / `dateModified`, so `date` isn't null. Update substantively; never fake a refresh.",
      impact: "high",
    },
    {
      id: "official-pages",
      title: "Publish first-party fact pages",
      detail:
        "Pricing, specs, locations and contact details on your own domain — the official sources DeepSeek leaned on most in the 2026 study.",
      impact: "high",
    },
    {
      id: "language",
      title: "Publish in your DeepSeek market's language",
      detail:
        "Real localized pages for buyers who ask in Chinese, Russian or Portuguese — not machine-translated stubs.",
      impact: "high",
    },
    {
      id: "summary-first",
      title: "Put the answer in the first 800 characters",
      detail:
        "The model reads a 600–800 character summary of each result. Lead with the fact, then explain.",
      impact: "medium",
    },
    {
      id: "citable-sentences",
      title: "Write sentences that can carry a citation",
      detail:
        "Names, numbers and units inside the sentence, so a `[citation:N]` marker can sit right after it.",
      impact: "medium",
    },
    {
      id: "no-manipulation",
      title: "Drop anything that looks like GEO manipulation",
      detail:
        "No hidden text for AI, no templated page batches, no fake freshness, no seeded mentions. DeepSeek says it filters SEO spam, GEO manipulation and low-quality AIGC.",
      impact: "medium",
    },
    {
      id: "analytics",
      title: "Add a DeepSeek channel and watch Direct",
      detail:
        "A custom channel on `deepseek.com` above Referral, plus an eye on unexplained Direct lifts from your DeepSeek markets.",
      impact: "medium",
    },
    {
      id: "prompt-panel",
      title: "Run a prompt panel on web and app",
      detail:
        "Search on, three runs per question, both interfaces — they share only about half their sources.",
      impact: "medium",
    },
    {
      id: "robots",
      title: "Decide on DeepseekBot and CCBot deliberately",
      detail:
        "Both are training crawlers. Blocking them is an opt-out from model training; recheck your `site:` results afterwards.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "What search engine does DeepSeek use?",
      a: "Its own. DeepSeek's October 17, 2026 changelog says its web and API search are “powered by our in-house DeepSeek search engine,” which indexes “hundreds of billions of web pages.” In 2025 the CTO of the Chinese search-API company Bocha said DeepSeek used Bocha's API; DeepSeek never confirmed it, and its February 2026 privacy policy still mentions third-party search APIs.",
    },
    {
      q: "What is DeepseekBot?",
      a: "DeepSeek's training crawler. Its EU training-content summaries name it, say it collects public web content for model training and fact-checking, and say it respects robots.txt “where applicable.” DeepSeek publishes no user-agent string or IP ranges for it; bot directories report the string `DeepSeekBot/1.0`.",
    },
    {
      q: "Will blocking DeepseekBot remove my site from DeepSeek's answers?",
      a: "Probably not, but DeepSeek doesn't say. It describes DeepseekBot only as a training crawler and names no crawler for its search index. After any robots.txt change, run a `site:yourdomain.com` query through DeepSeek's Search API to confirm your pages are still indexed.",
    },
    {
      q: "How do I get my website cited by DeepSeek?",
      a: "Make sure DeepSeek's index has your pages and can read them: public, unchallenged, server-rendered and clearly dated. Then publish authoritative first-party pages in the language your DeepSeek users ask in, with the answer near the top. DeepSeek cites about nine sources per answer, so being one useful source is enough.",
    },
    {
      q: "Can I check whether DeepSeek has indexed my site?",
      a: "Yes. DeepSeek's Search API runs on the same engine as its web search. A `site:yourdomain.com` query returns your indexed pages with each one's publication `date`, `authority` tier and `rerank_score`, and the Fetch API shows what DeepSeek extracts from any URL. Each costs $0.75 per 1,000 successful calls.",
    },
    {
      q: "Can DeepSeek read JavaScript-rendered pages?",
      a: "DeepSeek doesn't document it. In a June 2026 Search Engine World test, DeepSeek executed JavaScript on a pasted URL while ChatGPT, Claude and Gemini read the raw HTML. That was one test of one path; server-render anything you want cited and check it with a Fetch call.",
    },
    {
      q: "How does DeepSeek show citations?",
      a: "DeepSeek's published search prompt has the model cite with numbered `[citation:N]` markers at the end of the sentence they support, and a 2026 study saw those labels in its answers. Answers also list the pages found; in that study, across DeepSeek and Tencent Yuanbao, about four in ten listed sources never appeared in the answer text.",
    },
    {
      q: "What does DeepSeek mean by “GEO manipulation”?",
      a: "It hasn't said. The October 2026 changelog says DeepSeek's engine filters “SEO spam, GEO manipulation, and low-quality AIGC” without defining them. The safest reading: content written to steer AI models rather than inform readers, mass-produced AI pages, faked freshness and seeded mentions.",
    },
    {
      q: "How do I track DeepSeek traffic in GA4?",
      a: "GA4's AI Assistant channel names DeepSeek, but Google doesn't publish its referrer list, and SE Ranking measured DeepSeek referrals at essentially zero from September 2025. Add a custom channel on `deepseek.com`, watch Direct for your DeepSeek markets, and track citations with a prompt panel.",
    },
    {
      q: "Is DeepSeek banned?",
      a: "Not generally. Italy's data protection authority has limited it since January 30, 2025, a US order published October 20, 2026 removes it from federal civilian agencies, and several governments restrict it on official devices. Consumer use is open in most markets; its heaviest use is in China, Russia and parts of Africa.",
    },
    {
      q: "Can I pay to be recommended by DeepSeek?",
      a: "There's no documented paid placement. DeepSeek's January 2025 app launch note promised “No ads, no in-app purchases,” and its February 2026 privacy policy says it doesn't engage in targeted advertising.",
    },
  ],

  sources: [
    {
      title: "Change Log: opening up the in-house search API (2026-10-17)",
      publisher: "DeepSeek API Docs",
      href: CHANGELOG,
    },
    {
      title: "Search & Fetch API guide",
      publisher: "DeepSeek API Docs",
      href: SEARCH_GUIDE,
    },
    {
      title: "DeepSeek-V4.1-Flash-1017 release",
      publisher: "DeepSeek API Docs",
      href: "https://api-docs.deepseek.com/news/news261017",
    },
    {
      title: "DeepSeek-V2.5-1210 release: Internet Search goes live",
      publisher: "DeepSeek API Docs",
      href: "https://api-docs.deepseek.com/news/news1210",
    },
    {
      title: "DeepSeek-V3.2 release: thinking in tool-use",
      publisher: "DeepSeek API Docs",
      href: "https://api-docs.deepseek.com/news/news251201",
    },
    {
      title: "Introducing DeepSeek App (no ads, no in-app purchases)",
      publisher: "DeepSeek API Docs",
      href: "https://api-docs.deepseek.com/news/news250115",
    },
    {
      title: "Claude Code integration: using Web Search",
      publisher: "DeepSeek API Docs",
      href: "https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code",
    },
    {
      title: "DeepSeek homepage (DeepThink and Search toggles)",
      publisher: "DeepSeek",
      href: "https://www.deepseek.com/en",
    },
    {
      title: "Public summary of training content for DeepSeek-V4.1",
      publisher: "DeepSeek",
      href: V41_SUMMARY,
    },
    {
      title: "DeepSeek-V4.1-Flash technical report",
      publisher: "DeepSeek on Hugging Face",
      href: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf",
    },
    {
      title: "DeepSeek-V4 encoding: quick instruction special tokens",
      publisher: "DeepSeek on Hugging Face",
      href: ENCODING,
    },
    {
      title: "DeepSeek-R1: official prompts for web search",
      publisher: "DeepSeek on GitHub",
      href: "https://github.com/deepseek-ai/DeepSeek-R1",
    },
    {
      title: "DeepSeek Privacy Policy (updated Feb 10, 2026)",
      publisher: "DeepSeek",
      href: "https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html",
    },
    {
      title: "DeepSeek - AI Assistant: version history",
      publisher: "Apple App Store",
      href: "https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349",
    },
    {
      title: "DeepSeek opens its in-house search engine to developers",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/deepseek-opens-its-in-house-search-engine-to-developers/593526/",
    },
    {
      title: "AI search engine gets a 'real-time brain': Bocha and DeepSeek",
      publisher: "Daily Economic News (NBD)",
      href: "https://www.nbd.com.cn/articles/2025-03-07/3779901.html",
    },
    {
      title: "DeepSeekBot",
      publisher: "Known Agents",
      href: "https://knownagents.com/agents/deepseekbot",
    },
    {
      title: "AI Crawl Control bot reference",
      publisher: "Cloudflare",
      href: "https://developers.cloudflare.com/ai-crawl-control/reference/bots/",
    },
    {
      title: "CCBot",
      publisher: "Common Crawl",
      href: "https://commoncrawl.org/ccbot",
    },
    {
      title: "RFC 9309: Robots Exclusion Protocol",
      publisher: "IETF",
      href: "https://www.rfc-editor.org/rfc/rfc9309.html",
    },
    {
      title: "Do AI assistants actually render your JavaScript when grounding?",
      publisher: "Search Engine World",
      href: "https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test",
    },
    {
      title: "What do Chinese-language generative search engines cite and surface?",
      publisher: "arXiv (Zhen et al.)",
      href: STUDY,
    },
    {
      title: "Global AI adoption in 2025: a widening digital divide",
      publisher: "Microsoft AI Economy Institute",
      href: "https://www.microsoft.com/en-us/research/wp-content/uploads/2026/01/Microsoft-AI-Diffusion-Report-January-2026.pdf",
    },
    {
      title: "deepseek.com traffic and engagement",
      publisher: "Similarweb",
      href: "https://www.similarweb.com/website/deepseek.com/",
    },
    {
      title: "Top AI chatbots and tools websites ranking",
      publisher: "Similarweb",
      href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
    },
    {
      title: "Analysis of top AI search engines: who is catching up to ChatGPT?",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/ai-traffic-research-study/",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "Google Analytics adds AI Assistant as a default channel group",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/google-analytics-adds-ai-assistant-as-default-channel-group/574974/",
    },
    {
      title: "Limitation on processing ordered against DeepSeek",
      publisher: "Garante per la protezione dei dati personali",
      href: "https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10097450",
    },
    {
      title: "US orders federal agencies to remove China's DeepSeek AI from their systems",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2026/10/20/us-orders-federal-agencies-to-remove-chinas-deepseek-ai-from-their-systems/",
    },
    {
      title: "DeepSeek (chatbot)",
      publisher: "Wikipedia",
      href: "https://en.wikipedia.org/wiki/DeepSeek_(chatbot)",
    },
  ],

  sameAs: [
    "https://www.wikidata.org/wiki/Q132324293",
    "https://en.wikipedia.org/wiki/DeepSeek_(AI)",
    "https://www.wikidata.org/wiki/Q131577453",
    "https://en.wikipedia.org/wiki/DeepSeek",
  ],

  furtherReading: [
    {
      title: "AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Write the DeepseekBot and CCBot rules you decide on, alongside every other AI crawler, in one file.",
    },
    {
      title: "Free AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "See which AI bots read which pages — and spot hits that claim DeepSeekBot but come from somewhere else.",
    },
    {
      title: "AI visibility prompt kit",
      href: "/tools/ai-visibility-prompt-generator",
      description:
        "Generate the buyer questions to run through DeepSeek with Search on, on web and app, three times each.",
    },
    {
      title: "AI SEO: every engine compared",
      href: "/ai-seo",
      description:
        "DeepSeek next to ChatGPT, Claude, Perplexity and the rest: indexes, crawlers, JavaScript and referrers side by side.",
    },
  ],
};
