import type { EngineGuide } from "../types";

export const deepseek: EngineGuide = {
  slug: "deepseek",
  metaTitle: "DeepSeek SEO: The Technical Guide to Getting Cited by DeepSeek",
  metaDescription:
    "How DeepSeek's Smart Search finds and cites pages: an undisclosed search API, no documented crawler, a fetcher that may run JavaScript, and how to measure it.",
  keywords: [
    "DeepSeek SEO",
    "get cited by DeepSeek",
    "DeepSeek web search",
    "DeepSeek Smart Search",
    "DeepSeekBot robots.txt",
    "what search engine does DeepSeek use",
  ],
  headline: { lead: "DeepSeek SEO:", accent: "the technical guide to getting cited by DeepSeek" },
  subhead:
    "DeepSeek documents less about its search than any other major assistant: no crawler, no named search provider, no referrer spec. Here's what is on record, what independent tests show, and what you can still control.",

  shortAnswer:
    "To get cited by DeepSeek, make sure its **Smart Search** can find and read your page: publish official, dated, answer-first pages in the language your DeepSeek users ask in, keep the facts in server-rendered HTML, and put no login or bot challenge in front of them. DeepSeek documents no crawler to allow and names no search provider — its privacy policy says only that it uses third-party search APIs — and about half of its web traffic comes from China, so decide by market how much to invest.",

  takeaways: [
    "DeepSeek documents no crawler. There's no user agent to allow for search and no robots.txt token for a training opt-out; `DeepSeekBot` rules are unverifiable.",
    "Search runs on third-party APIs DeepSeek doesn't name. In March 2025 the CTO of Chinese search-API startup Bocha said DeepSeek used its API; DeepSeek never confirmed it.",
    "Answers come from a search agent: it searches (**Found 18 web pages**), opens a few (**Read 4 pages**), then cites with small numbered badges.",
    "In a June–July 2026 study of Chinese queries, DeepSeek averaged 9.2 citations per answer, spread across the widest range of domains of four engines tested.",
    "A June 2026 test saw DeepSeek execute JavaScript on a pasted URL, where ChatGPT, Claude and Gemini read raw HTML. Server-render anyway.",
    "Referrals are hard to see: SE Ranking measured DeepSeek's referral traffic at essentially zero from September 2025, though GA4's AI Assistant channel names DeepSeek.",
  ],

  facts: [
    { label: "Crawler user agent DeepSeek documents", value: "None" },
    { label: "chat.deepseek.com among AI chatbot sites (Aug 2026)", value: "#4" },
    { label: "DeepSeek's share of China's AI market (Jan 2026)", value: "89%" },
    { label: "Citations per answer, web and app (2026 study)", value: "9.2" },
  ],

  preview: {
    prompt: "Which project management tool has the best free plan for a five-person team?",
    status: "Found 18 web pages · Read 4 pages",
    answer:
      "**Plannora** has the most generous free plan for a five-person team: unlimited boards and projects for up to five users, with no time limit on the free tier.",
    sources: [
      { domain: "plannora.io", title: "Plannora pricing: free for teams of up to 5" },
      { domain: "stackreview.co", title: "Best free project management tools (2026)" },
      { domain: "teamtoolsweekly.com", title: "Plannora vs Loopcraft: free plans compared" },
      { domain: "founderforum.net", title: "Which PM tool is your small team using?" },
    ],
  },

  profile: {
    retrieval: "An undisclosed third-party search API; an agent then opens a few pages",
    searchCrawler: "None documented — no DeepSeek user agent to allow",
    trainingCrawler: "None documented — no robots.txt opt-out token",
    rendersJs: "Not documented — a June 2026 test saw it run JavaScript",
    referrer: "Near-zero referrals since Sep 2025; GA4's AI Assistant channel names it",
    citationStyle: "Gray numbered badges inline, a favicon “N web pages” pill below",
    biggestLever: "Official, dated, answer-first pages in your audience's language",
  },

  sections: [
    {
      id: "how-deepseek-searches",
      title: "How DeepSeek's Smart Search finds and cites pages",
      blocks: [
        {
          kind: "p",
          text: "DeepSeek added web search to chat.deepseek.com on December 10, 2024, telling users to toggle **Internet Search** \"for real-time answers\" ([release note](https://api-docs.deepseek.com/news/news1210)), and shipped it in the mobile apps on January 15, 2025. Today it's the **Smart Search** toggle beside **Deep thinking** in the composer (some builds label them **Search** and **DeepThink**). The model behind it has been **DeepSeek-V4.1-Flash** since [September 10, 2026](https://api-docs.deepseek.com/news/news260910), and the app's September 11 update unified the Instant, Expert and Vision modes into one.",
        },
        {
          kind: "p",
          text: "Which index it searches is not documented. DeepSeek's [privacy policy](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html), last updated February 10, 2026, says only: \"We integrate third-party APIs to provide search services, and we will share your input keywords to provide these services.\" It names no provider. The one public claim came from outside: in March 2025 Weng Rouying, CTO of the Hangzhou search-API startup Bocha (博查), told [Daily Economic News](https://www.nbd.com.cn/articles/2025-03-07/3779901.html) that DeepSeek had integrated Bocha's Search API before its January 2025 surge. DeepSeek hasn't confirmed it, and nothing public says whether it still holds in 2026. DeepSeek's own [V3.1 model card](https://huggingface.co/deepseek-ai/DeepSeek-V3.1) adds one clue: its search-agent benchmarks run on \"a commercial search API + webpage filter + 128K context window.\"",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Search is on — but the model still decides",
              body: "Search runs only when the user turns on Smart Search, and even then the model chooses whether to call it; users report answers that skipped the search despite the toggle ([GitHub, May 2026](https://github.com/deepseek-ai/DeepSeek-V3/issues/1381)). Everything else comes from training: V4 was pre-trained on public web data plus licensed datasets.",
              lever:
                "Be worth remembering: consistent, widely published facts about your brand reach the answers that never search.",
            },
            {
              title: "An agent searches, reasons and searches again",
              body: 'V3.1 (August 2025) brought "Stronger multi-step reasoning for complex search tasks," per its [release note](https://api-docs.deepseek.com/news/news250821). In the app each round shows as a step like **Found 18 web pages**, with the favicons of the hits. The official prompt passes the date alongside the results: "Today is {cur_date}."',
              lever:
                "Use the words your buyers type — product names, category terms, places — in titles and headings.",
            },
            {
              title: "A third-party search API returns candidates",
              body: "The provider is undisclosed. On DeepSeek's API-side search — the one Claude Code uses — each result carries a URL, a title and a `page_age`, per DeepSeek's own [harness docs](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/web/web-search-deepseek).",
              lever: "Be indexed widely, and show a real publish date an index can read.",
            },
            {
              title: "The agent opens a handful of pages",
              body: "A **Read 4 pages** step lists the pages it opened as linked titles. Who fetches them is undocumented — no user agent, no IP ranges. In a June 2026 test DeepSeek executed JavaScript on a page a user pasted in.",
              lever:
                "Keep the page public, fast and free of bot challenges, with the answer in the HTML.",
            },
            {
              title: "The model filters, combines and cites",
              body: 'The official template tells it to filter irrelevant results, cite with `[citation:X]` at the end of the relevant sentence, "synthesize information from multiple relevant webpages," and reply in the user\'s language. The UI renders each marker as a small numbered badge.',
              lever:
                "Write sentences that carry one fact on their own, so they can be cited mid-paragraph.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "9.2",
              label:
                "citations per DeepSeek answer, on web and app alike, across 614 Chinese-language queries",
              source: { name: "arXiv study, Jul 2026", href: "https://arxiv.org/abs/2607.15771" },
            },
            {
              value: "~5%",
              label:
                "of DeepSeek's citations went to its most-cited domain — the widest spread of four engines",
              source: { name: "arXiv study, Jul 2026", href: "https://arxiv.org/abs/2607.15771" },
            },
            {
              value: "55 days",
              label:
                "publication age of pages DeepSeek Web cited for time-sensitive queries — 181 days for evergreen ones",
              source: { name: "arXiv study, Jul 2026", href: "https://arxiv.org/abs/2607.15771" },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "DeepSeek's search prompt is public",
          text: 'With R1 in January 2025, DeepSeek [published the prompt](https://github.com/deepseek-ai/DeepSeek-R1) its web and app wrap around search results. Each result is formatted as `[webpage X begin]...[webpage X end]`; the model is told to "avoid repeatedly citing the same webpage" and, for list questions, to "limit the answer to 10 key points and inform the user that they can refer to the search sources for complete information." DeepSeek hasn\'t published a newer version, so treat it as a baseline, not the current spec.',
        },
      ],
    },
    {
      id: "crawlers",
      title: "Crawlers and access: what DeepSeek documents (almost nothing)",
      blocks: [
        {
          kind: "p",
          text: "DeepSeek publishes no crawler documentation: no user agent, no IP ranges, no robots.txt guidance for search or for training. Cloudflare's [AI Crawl Control bot reference](https://developers.cloudflare.com/ai-crawl-control/reference/bots/) lists no DeepSeek bot, and none of the 705 entries in Cloudflare Radar's bots directory — in a [mirror synced on September 21, 2026](https://github.com/microlinkhq/cloudflare-bot-directory) — belongs to DeepSeek.",
        },
        {
          kind: "p",
          text: "Some bot directories do list a `DeepSeekBot` token. [Known Agents](https://knownagents.com/agents/deepseekbot) gives the string `Mozilla/5.0 (compatible; DeepSeekBot/1.0; +https://www.deepseek.com/bot)` and notes that DeepSeek publishes no way to verify it. The deepseek.com/bot page in that string returned a 404 when we checked on September 21, 2026. Treat `DeepSeekBot` as unconfirmed.",
        },
        {
          kind: "table",
          head: [
            "What reaches your site",
            "Documented user agent",
            "robots.txt",
            "What you can do",
          ],
          rows: [
            [
              "Search index (the third-party provider)",
              "Provider not named",
              "Unknown",
              "Stay open to mainstream crawlers; you can't target this one by name",
            ],
            [
              "Live page reads (**Read N pages**)",
              "None published",
              "Not documented",
              "Run a canary test; keep bot challenges off public pages",
            ],
            [
              "Training-data collection",
              "None published",
              '2023 docs: data "respecting robots.txt"',
              "No opt-out token exists to use",
            ],
            [
              "`DeepSeekBot` (bot directories)",
              "Listed by third parties only",
              "Unverified",
              "A rule is harmless but proves nothing",
            ],
          ],
        },
        {
          kind: "p",
          text: 'On training, DeepSeek describes collection but offers no opt-out. The 2023 [DeepSeek-LLM README](https://github.com/deepseek-ai/DeepSeek-LLM) says its corpus included "self-collected data respecting robots.txt." The [V4 model card](https://fe-static.deepseek.com/chat/transparency/deepseek-V4-model-card-EN.pdf) (April 2026) says only "We use publicly available information on the internet" and "technical methods to acquire and filter these freely accessible data," alongside licensed third-party datasets. Neither names a crawler.',
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# DeepSeek documents no crawler. This token comes from third-party\n# bot directories and is unconfirmed: harmless, but unverifiable.\nUser-agent: DeepSeekBot\nDisallow: /\n\n# DeepSeek's search visibility depends on not blocking the unknown:\n# keep public pages open to well-behaved agents.\nUser-agent: *\nAllow: /\nDisallow: /account/",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Blanket bot blocking may be what hides you",
          text: "DeepSeek's page reads don't announce themselves, and in one test its fetcher executed JavaScript like a browser. CDN \"block AI bots\" toggles and bot-fight modes can't allow them by name — and a challenge page is all they'll read. Our read: if DeepSeek finds your page but never lists it under **Read**, check your bot rules before your content.",
        },
        {
          kind: "p",
          text: "The only way to learn what DeepSeek's fetcher looks like on your stack is to catch it. Borrow [Search Engine World's method](https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test): publish a page at an unguessable, unlinked URL, paste it into DeepSeek with a request to summarize it, and log the full headers of every hit that follows.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Every request for the canary page: time, IP and user agent\ngrep \"/dsk-canary-7f3k2\" access.log \\\n  | awk -F'\"' '{print $1, $6}'\n\n# Then check whether that IP or user agent reads your real pages\ngrep \"203.0.113.42\" access.log | awk '{print $7}' | sort | uniq -c | sort -rn",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "None of DeepSeek's documents say what a page needs. The list below is built from what it does publish — the search template, the API's result fields — and from independent tests, with the confidence marked on each row.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Public, unchallenged pages",
              status: "required",
              note: "The agent can only cite what search returns and what it can open. A login, paywall, CAPTCHA or bot challenge in front of the facts means it reads nothing — or someone else's page.",
            },
            {
              label: "Facts in server-rendered HTML",
              status: "helps",
              note: "DeepSeek ran JavaScript in one June 2026 test, but that was one fetch on one site, the search provider's crawler is unknown, and ChatGPT, Claude and Gemini read raw HTML in the same test. [Server-render](/glossary/server-side-rendering) anyway.",
            },
            {
              label: "Visible, accurate dates",
              status: "helps",
              note: "Results carry `page_age`, the official prompt injects today's date, and DeepSeek showed one of the strongest recency responses of four engines in the July 2026 study.",
            },
            {
              label: "Self-contained sentences",
              status: "helps",
              note: "Citations land at the end of individual sentences, and the model must combine several pages. A sentence that states its fact without the paragraph around it is easier to cite.",
            },
            {
              label: "The user's language",
              status: "helps",
              note: "The template answers in the user's language. Our read: queries are searched in it too, so an English-only page competes badly for questions asked in Chinese or Russian.",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "No statement from DeepSeek. Results expose a URL, a title and a date; keep every fact in visible copy as well.",
            },
            {
              label: "robots.txt rules",
              status: "unconfirmed",
              note: "No documented token for search or training. A `DeepSeekBot` group may never match a real request.",
            },
            {
              label: "Sitemaps and IndexNow",
              status: "unconfirmed",
              note: "They help the engines you can name. Whether DeepSeek's undisclosed provider reads either isn't known.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "DeepSeek's docs never mention it, and nothing suggests its search reads it.",
            },
          ],
        },
        {
          kind: "p",
          text: "Two quick checks cover what you can control: the answer is in the raw HTML, and a plain client isn't refused. If either fails, an unidentified fetcher is likely to fail too:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# 1. Is the answer in the raw HTML?\ncurl -s https://yoursite.com/pricing | grep -c "Plans start at"\n\n# 2. Does your CDN or WAF refuse a non-browser client?\ncurl -s -o /dev/null -w "%{http_code}\\n" https://yoursite.com/pricing\n\n# 0 matches, or a 403, 429 or challenge page = fix before anything else',
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What DeepSeek cites",
      blocks: [
        {
          kind: "p",
          text: "We found no DeepSeek citation study from the big Western SEO platforms. The best evidence is an [arXiv study](https://arxiv.org/abs/2607.15771) (July 2026) that sent 614 controlled Chinese-language queries — including dining, hotels, beauty and health services — to the web and app interfaces of DeepSeek, Doubao, Tencent Yuanbao and Qwen, three times each, in June and July 2026, and analyzed 160,860 citations. Read it as Chinese local-search behavior; it may not transfer to English B2B questions.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Many sources per answer",
              body: "DeepSeek averaged 9.2 citations per answer on both web and app. With that many slots, a page doesn't need to be the best source — just one of the useful ones.",
              evidence: "observed",
            },
            {
              title: "A long tail of domains",
              body: "Its most-cited domain took only about 5% of citations, and its cited pages had the lowest average 5118-Baidu quality score of the four engines. Domain authority isn't the gate.",
              evidence: "observed",
            },
            {
              title: "Official sources",
              body: "In the study's analysis of business contact details, DeepSeek relied most heavily on official sources, particularly government and corporate official sites. Your own site is a citable asset.",
              evidence: "observed",
            },
            {
              title: "Freshness on time-sensitive queries",
              body: "Pages DeepSeek Web cited for time-sensitive queries were about 55 days old, against 181 days for evergreen ones — among the strongest recency responses measured.",
              evidence: "observed",
            },
            {
              title: "Spread, don't repeat",
              body: 'The official template tells the model to synthesize several pages, "avoid repeatedly citing the same webpage," and cap list answers at 10 points while pointing users to the sources for the full list.',
              evidence: "official",
            },
            {
              title: "Brands without a source",
              body: "16.9% of brand mentions in DeepSeek Web answers couldn't be matched to any page it cited — most plausibly they came from training. What the web says about you consistently matters.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "p",
          text: "The same study found DeepSeek's web and app cite overlapping but different sources: a domain-level Jaccard similarity of 0.51, the most consistent of the four engines and still only about half. A page cited in the browser may not be cited in the app, so test both.",
        },
      ],
    },
    {
      id: "audience",
      title: "Who actually sees DeepSeek answers",
      blocks: [
        {
          kind: "p",
          text: "DeepSeek's reach is large but lopsided. Microsoft's AI Economy Institute ([January 2026](https://www.microsoft.com/en-us/research/wp-content/uploads/2026/01/Microsoft-AI-Diffusion-Report-2025-H2.pdf)) put DeepSeek's market share at 89% in China, 56% in Belarus, 49% in Cuba and 43% in Russia, estimated usage in Africa at 2 to 4× other regions, and found that \"Adoption remained low in North America and Europe.\" Similarweb's [August 2026 data](https://www.similarweb.com/website/deepseek.com/) puts China at 51.43% of deepseek.com's traffic, Russia at 8.27% and the US at 5.86%.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "#4",
              label:
                "chat.deepseek.com among AI chatbot websites — behind chatgpt.com, gemini.google.com and claude.ai",
              source: {
                name: "Similarweb, Aug 2026",
                href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
              },
            },
            {
              value: "89%",
              label:
                "DeepSeek's market share in China, against low adoption in North America and Europe",
              source: {
                name: "Microsoft, Jan 2026",
                href: "https://www.microsoft.com/en-us/research/wp-content/uploads/2026/01/Microsoft-AI-Diffusion-Report-2025-H2.pdf",
              },
            },
            {
              value: "5.86%",
              label: "of deepseek.com's traffic comes from the US; 51.43% comes from China",
              source: {
                name: "Similarweb, Aug 2026",
                href: "https://www.similarweb.com/website/deepseek.com/",
              },
            },
          ],
        },
        { kind: "h3", text: "Where it's restricted" },
        {
          kind: "list",
          items: [
            "**Italy:** the [Garante](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10097450) ordered an immediate limitation on processing Italian users' data on January 30, 2025. [MIAI](https://ai-regulation.com/deepseek-one-year-later-regulatory-storm-global-surge/) reported the ban still in force in January 2026.",
            "**South Korea:** DeepSeek pulled its app from local stores on February 15, 2025, and resumed service on April 28, 2025, after notifying the privacy regulator of its compliance.",
            "**Germany:** Berlin's data protection commissioner asked Apple and Google to delist the app on [June 27, 2025](https://techcrunch.com/2025/06/27/germany-tells-apple-google-to-remove-deepseek-from-the-countrys-app-stores/). The notices were non-binding, and per MIAI the app stayed available.",
            "**Government devices:** the US Navy, NASA, the House of Representatives and several US states, plus government bodies in Australia, Japan, Canada, Belgium, the Netherlands, the Czech Republic and Denmark, restrict it on official systems.",
            "**Data location:** DeepSeek's privacy policy says it collects, processes and stores personal data in the People's Republic of China — the point most regulators cite.",
          ],
        },
        { kind: "h3", text: "Third-party hosts use their own search" },
        {
          kind: "p",
          text: "DeepSeek's weights are MIT-licensed, so many products run DeepSeek models on someone else's retrieval. Tencent's Yuanbao added DeepSeek-R1 in February 2025 with web search that draws on WeChat official accounts ([CLS](https://www.cls.cn/detail/1942156)), and Tencent Cloud's DeepSeek API connected Sogou's search API ([IT Home](https://www.ithome.com/0/829/413.htm)). A citation there is won in Tencent's search, not DeepSeek's. The reverse holds too: DeepSeek's own search now travels beyond its app. Its [API docs](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code) say Claude Code pointed at DeepSeek will \"perform the search through the API provided by DeepSeek.\"",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Decide by market",
          text: "If your customers are in China, Russia or Africa, DeepSeek deserves a prompt panel of its own, in their language. If they're in the US or Western Europe, the work that wins ChatGPT and Perplexity — public, dated, server-rendered first-party pages — covers DeepSeek too. Don't build a separate DeepSeek program on a few percent of traffic.",
        },
      ],
    },
    {
      id: "measurement",
      title: "Measuring DeepSeek",
      blocks: [
        {
          kind: "p",
          text: "DeepSeek documents nothing about how its links open or what referrer they send. Google's [channel definitions](https://support.google.com/analytics/answer/9756891) do name it: GA4's **AI Assistant** channel, added in May 2026, covers \"sources like ChatGPT, Gemini, Deepseek, Copilot, or Grok.\" But Google [hasn't published](https://www.searchenginejournal.com/google-analytics-adds-ai-assistant-as-default-channel-group/574974/) the referrer list behind it, and there may be little to catch. [SE Ranking](https://seranking.com/blog/ai-traffic-research-study/) found DeepSeek held 0.37% of AI referral traffic in early 2025 — the fourth-largest source — and that \"from September 2025 onward, DeepSeek's referral traffic dropped to essentially zero across all regions.\"",
        },
        {
          kind: "p",
          text: "SE Ranking offers no explanation. Our read: either DeepSeek users rarely click out, or their clicks arrive without a referrer and land in Direct, as app-to-browser clicks often do. Check both before concluding DeepSeek sends you nothing — and if `deepseek.com` sessions still sit in Referral, give them a custom channel above it:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — DeepSeek, when a referrer arrives\n(^|\\.)deepseek\\.com$\n\n# All major AI assistants, DeepSeek included\nchatgpt\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com|deepseek\\.com",
        },
        {
          kind: "p",
          text: "Server logs can't be filtered by a DeepSeek user agent, because none is published. Use the canary test in the crawlers section to learn what its reads look like on your stack, then watch for that pattern on real pages. Remember that a page can be found without being read: only pages listed under **Read** were opened.",
        },
        {
          kind: "p",
          text: "For [prompt tracking](/glossary/prompt-tracking), copy the July 2026 study's design: a fixed set of buyer questions, Smart Search on, three runs each, on both web and app. Record whether your pages appear in the answer's sources pill (it reads like **10 web pages**) and in the inline badges, and whether competitors are named with no source at all.",
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
              myth: "Add DeepSeekBot to robots.txt and DeepSeek stops using your site.",
              reality:
                "DeepSeek has never documented `DeepSeekBot` or any other crawler. The URL in the directory-listed user agent returns a 404, and there's no way to verify a request is DeepSeek's.",
            },
            {
              myth: "DeepSeek searches Google (or Bing, or Baidu).",
              reality:
                "DeepSeek says only that it integrates third-party search APIs. The one public claim — Bocha's CTO in March 2025 — is unconfirmed by DeepSeek and may be out of date.",
            },
            {
              myth: "Like every AI assistant, DeepSeek can't read JavaScript.",
              reality:
                "In a June 2026 test it did execute JavaScript on a pasted URL, unlike ChatGPT, Claude or Gemini. That's one test on one path — server-render anyway, because its search provider's crawler is unknown.",
            },
            {
              myth: "Anything running a DeepSeek model searches the way DeepSeek does.",
              reality:
                "Hosts bring their own retrieval: Tencent Yuanbao searches WeChat and the web, Tencent Cloud used Sogou. And DeepSeek's own Responses API ignores the built-in `web_search` tool.",
            },
            {
              myth: "GA4's AI Assistant channel will show your DeepSeek traffic.",
              reality:
                "Google names DeepSeek in the channel, but SE Ranking measured DeepSeek referrals at essentially zero from September 2025. Check Direct, and track citations in the answers themselves.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "unwalled",
      title: "Keep citable pages public",
      detail:
        "No login, paywall, CAPTCHA or interstitial in front of pricing, specs, docs or contact details.",
      impact: "high",
    },
    {
      id: "bot-rules",
      title: "Audit CDN and WAF bot rules",
      detail:
        "DeepSeek's reads can't be allowlisted by name. Make sure \"block AI bots\" and bot-fight modes don't challenge public pages.",
      impact: "high",
    },
    {
      id: "ssr",
      title: "Put the facts in server-rendered HTML",
      detail:
        "Check with `curl` that the key sentence is in the raw response. Don't rely on DeepSeek running your JavaScript.",
      impact: "high",
    },
    {
      id: "canary",
      title: "Run a canary fetch test",
      detail:
        "Paste an unlinked URL into DeepSeek and log every hit, so you know what its reads look like on your stack.",
      impact: "medium",
    },
    {
      id: "official-pages",
      title: "Publish official, first-party fact pages",
      detail:
        "Pricing, specs, locations and contact details on your own domain — the sources DeepSeek leaned on most in the 2026 study.",
      impact: "high",
    },
    {
      id: "dates",
      title: "Show real published and updated dates",
      detail:
        "Visible on the page and in `datePublished` / `dateModified`. Update substantively; never fake a refresh.",
      impact: "high",
    },
    {
      id: "language",
      title: "Publish in your DeepSeek audience's language",
      detail:
        "If your market asks in Chinese, Russian or Portuguese, give them pages in that language, not only English.",
      impact: "high",
    },
    {
      id: "self-contained",
      title: "Write self-contained, citable sentences",
      detail:
        "Names, numbers and units in the sentence itself, so a citation badge can sit right after it.",
      impact: "medium",
    },
    {
      id: "complete-lists",
      title: "Publish the complete list",
      detail:
        "DeepSeek caps list answers at 10 points and points users to its sources for the rest. Be the source with the full list.",
      impact: "medium",
    },
    {
      id: "coverage",
      title: "Earn coverage across many sites",
      detail:
        "DeepSeek spreads citations across a long tail of domains. Mentions on smaller, relevant sites count.",
      impact: "medium",
    },
    {
      id: "entity",
      title: "Keep brand facts consistent everywhere",
      detail:
        "About a sixth of DeepSeek Web's brand mentions had no matching source. Training data speaks for you too.",
      impact: "medium",
    },
    {
      id: "robots-decision",
      title: "Don't count on robots.txt for a training opt-out",
      detail:
        "No documented token exists. A `DeepSeekBot` rule is harmless, but treat it as a gesture, not a control.",
      impact: "low",
    },
    {
      id: "ga4",
      title: "Set up DeepSeek measurement in GA4",
      detail:
        "Check the AI Assistant channel, add a custom channel on `deepseek.com`, and watch Direct for unexplained lifts.",
      impact: "medium",
    },
    {
      id: "prompt-panel",
      title: "Track a prompt panel on web and app",
      detail:
        "Smart Search on, three runs per prompt, both interfaces — their sources overlap only about half.",
      impact: "medium",
    },
    {
      id: "hosts",
      title: "Test third-party hosts separately",
      detail:
        "Products that run DeepSeek models, like Tencent Yuanbao, cite from their own search.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by DeepSeek?",
      a: "Make sure Smart Search can find and read your page: public, unchallenged, server-rendered, and clearly dated. Then publish official, answer-first pages in the language your DeepSeek users ask in. DeepSeek cites about nine sources per answer across a long tail of domains, so being one useful source is enough.",
    },
    {
      q: "What search engine does DeepSeek use?",
      a: "DeepSeek doesn't say. Its privacy policy states only that it integrates third-party search APIs and shares users' keywords with them. In March 2025 the CTO of Chinese search-API company Bocha said DeepSeek used Bocha's API; DeepSeek has never confirmed that.",
    },
    {
      q: "What user agent does DeepSeek use?",
      a: "None is documented. Some bot directories list `DeepSeekBot`, but DeepSeek has never published it, the URL in that user-agent string returns a 404, and there's no verification method. To see what DeepSeek's page reads look like, run a canary test with an unlinked URL.",
    },
    {
      q: "Can I stop DeepSeek from training on my content?",
      a: "Not through a documented mechanism. DeepSeek's V4 model card says it trains on publicly available internet data and licensed datasets, but names no crawler and no opt-out. A 2023 DeepSeek README said its self-collected data respected robots.txt, without naming a user agent.",
    },
    {
      q: "Can DeepSeek read JavaScript-rendered pages?",
      a: "DeepSeek doesn't document it. In a June 2026 Search Engine World test, DeepSeek executed JavaScript on a pasted URL and reported the script-rendered value, while ChatGPT, Claude and Gemini read raw HTML. That was one test; server-render anything you want cited.",
    },
    {
      q: "How does DeepSeek show citations?",
      a: "Inline, as small gray numbered badges at the end of the sentence or table cell they support, with a pill under the answer showing favicons and a count such as **10 web pages**. The thinking trace shows the search steps: **Found N web pages**, then **Read N pages** with links to the pages opened.",
    },
    {
      q: "How do I track DeepSeek traffic in GA4?",
      a: "GA4's AI Assistant channel names DeepSeek, but Google doesn't publish its referrer list, and SE Ranking measured DeepSeek referrals at essentially zero from September 2025. Add a custom channel on `deepseek.com`, check Direct, and track citations with a prompt panel.",
    },
    {
      q: "Is DeepSeek banned?",
      a: "Not generally. Italy's data protection authority has limited it since January 30, 2025, and many governments restrict it on official devices. In South Korea new downloads were suspended from February to April 2025; Germany's 2025 delisting request was not acted on. Its heaviest use is in China, Russia and parts of Africa.",
    },
    {
      q: "Can I pay to be recommended by DeepSeek?",
      a: "There's no documented paid placement. DeepSeek's January 2025 app launch note promised \"No ads, no in-app purchases,\" and its February 2026 privacy policy says it doesn't engage in targeted advertising.",
    },
  ],

  sources: [
    {
      title: "DeepSeek Privacy Policy",
      publisher: "DeepSeek",
      href: "https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html",
    },
    {
      title: "DeepSeek V4 technical documentation (model card)",
      publisher: "DeepSeek",
      href: "https://fe-static.deepseek.com/chat/transparency/deepseek-V4-model-card-EN.pdf",
    },
    {
      title: "DeepSeek-R1: official prompts for web search and file upload",
      publisher: "DeepSeek on GitHub",
      href: "https://github.com/deepseek-ai/DeepSeek-R1",
    },
    {
      title: "DeepSeek-V3.1 model card: search agent",
      publisher: "DeepSeek on Hugging Face",
      href: "https://huggingface.co/deepseek-ai/DeepSeek-V3.1",
    },
    {
      title: "DeepSeek-V2.5-1210 release: Internet Search goes live",
      publisher: "DeepSeek API Docs",
      href: "https://api-docs.deepseek.com/news/news1210",
    },
    {
      title: "DeepSeek-V4.1-Flash release",
      publisher: "DeepSeek API Docs",
      href: "https://api-docs.deepseek.com/news/news260910",
    },
    {
      title: "Claude Code integration: using Web Search",
      publisher: "DeepSeek API Docs",
      href: "https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code",
    },
    {
      title: "dsh-web-search-deepseek: native DeepSeek web search",
      publisher: "DeepSeek Harness on GitHub",
      href: "https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/web/web-search-deepseek",
    },
    {
      title: "DeepSeek - AI Assistant: version history",
      publisher: "Apple App Store",
      href: "https://apps.apple.com/us/app/deepseek-ai-assistant/id6737597349",
    },
    {
      title: "AI Crawl Control bot reference",
      publisher: "Cloudflare",
      href: "https://developers.cloudflare.com/ai-crawl-control/reference/bots/",
    },
    {
      title: "DeepSeekBot",
      publisher: "Known Agents",
      href: "https://knownagents.com/agents/deepseekbot",
    },
    {
      title: "AI search engine gets a 'real-time brain': Bocha and DeepSeek",
      publisher: "Daily Economic News (NBD)",
      href: "https://www.nbd.com.cn/articles/2025-03-07/3779901.html",
    },
    {
      title: "Do AI assistants actually render your JavaScript when grounding?",
      publisher: "Search Engine World",
      href: "https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test",
    },
    {
      title: "What do Chinese-language generative search engines cite and surface?",
      publisher: "arXiv (Zhen et al.)",
      href: "https://arxiv.org/abs/2607.15771",
    },
    {
      title: "Analysis of top AI search engines: who is catching up to ChatGPT?",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/ai-traffic-research-study/",
    },
    {
      title: "Top AI chatbots and tools websites ranking",
      publisher: "Similarweb",
      href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
    },
    {
      title: "Global AI adoption in 2025: a widening digital divide",
      publisher: "Microsoft AI Economy Institute",
      href: "https://www.microsoft.com/en-us/research/wp-content/uploads/2026/01/Microsoft-AI-Diffusion-Report-2025-H2.pdf",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "Limitation on processing ordered against DeepSeek",
      publisher: "Garante per la protezione dei dati personali",
      href: "https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10097450",
    },
    {
      title: "DeepSeek one year later: regulatory storm, global surge",
      publisher: "MIAI (AI-Regulation.com)",
      href: "https://ai-regulation.com/deepseek-one-year-later-regulatory-storm-global-surge/",
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
      title: "Free AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "See which AI bots read which pages — and spot the hits no documented user agent explains, like DeepSeek's.",
    },
    {
      title: "AI visibility prompt kit",
      href: "/tools/ai-visibility-prompt-generator",
      description:
        "Generate the buyer prompts to run through DeepSeek's Smart Search on web and app, three times each.",
    },
    {
      title: "AI SEO: every engine compared",
      href: "/ai-seo",
      description:
        "DeepSeek next to ChatGPT, Claude, Perplexity and the rest: crawlers, retrieval, JavaScript and referrers side by side.",
    },
  ],
};
