import type { EngineGuide } from "../types";

export const perplexity: EngineGuide = {
  slug: "perplexity",
  metaTitle: "Perplexity SEO: The Technical Guide to Perplexity Citations",
  metaDescription:
    "How Perplexity's own 200B-URL index crawls, parses and ranks passages; PerplexityBot vs Perplexity-User; why JavaScript and stale pages lose; Comet Plus; and tracking Perplexity traffic.",
  keywords: [
    "Perplexity SEO",
    "how does Perplexity choose sources",
    "get cited by Perplexity",
    "PerplexityBot",
    "Perplexity-User robots.txt",
    "Perplexity AI optimization",
  ],
  headline: { lead: "Perplexity SEO:", accent: "the technical guide to Perplexity citations" },
  subhead:
    "Perplexity runs its own search engine — a 200-billion-URL index that splits pages into passages and reranks them per question. Here's how that pipeline works, which bot to let in, and what it rewards.",

  shortAnswer:
    "To get cited by Perplexity, allow **PerplexityBot** and **Perplexity-User**, serve your content as server-rendered HTML, and keep it visibly current. Perplexity searches its own index of over 200 billion URLs, splits each page into self-contained passages, and reranks those passages for every question — so it cites pages whose individual sections answer a question directly, with names, numbers and a date.",

  takeaways: [
    "Perplexity isn't a Google wrapper: it runs its own index of 200B+ URLs on Vespa, with its own crawler, `PerplexityBot`.",
    'It ranks passages, not pages — documents are split into "self-contained spans" and reranked by cross-encoder models.',
    "Stale content is filtered out before ranking, and citations skew about 250 days fresher than Google's results.",
    '`PerplexityBot` honors robots.txt; `Perplexity-User`, which fetches live for users, "generally ignores" it.',
    "Independent tests found Perplexity fails on client-side-rendered pages. Server-render everything you want cited.",
    "Perplexity sells no ads or placement. Comet Plus pays partner publishers about 80% of its revenue.",
  ],

  facts: [
    { label: "URLs in Perplexity's own index", value: "200B+" },
    { label: "Sources cited per answer, on average", value: "4–8" },
    { label: "The crawler to allow for search", value: "PerplexityBot", mono: true },
    { label: "Of citations rank in Google's top 10", value: "28.6%" },
  ],

  preview: {
    prompt: "Plannora vs Loopcraft for a five-person startup",
    status: "Answer",
    answer:
      "**Plannora** is the better fit for most five-person teams: its free tier covers up to five users, while Loopcraft starts at $8 per seat.",
    sources: [
      { domain: "plannora.io", title: "Plannora pricing: free for teams of up to 5" },
      { domain: "stackreview.co", title: "Plannora vs Loopcraft: 2026 comparison" },
      { domain: "founderforum.net", title: "We switched from Loopcraft to Plannora" },
    ],
  },

  profile: {
    retrieval: "Its own index of 200B+ URLs: hybrid retrieval, then passage reranking",
    searchCrawler: "PerplexityBot + Perplexity-User",
    trainingCrawler: "None — PerplexityBot isn't used for model training",
    rendersJs: "No — tests show client-rendered pages fail",
    referrer: "perplexity.ai (referral, no UTM)",
    citationStyle: "Numbered source cards above the answer, superscripts inline",
    biggestLever: "Self-contained, dated passages in server-rendered HTML",
  },

  sections: [
    {
      id: "how-perplexity-ranks",
      title: "How Perplexity crawls, indexes and ranks",
      blocks: [
        {
          kind: "p",
          text: 'Perplexity is unusually open about its search stack. Its [architecture write-up](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api), published with the Search API in September 2025, explains that it started on third-party search APIs and left them over cost, staleness, latency and "document-level granularity." The replacement — built on Vespa — "tracks over 200 billion unique URLs" and runs "tens of thousands of indexing operations per second." Every stage below is from that document.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "A model decides when to crawl each URL",
              body: 'An ML model predicts whether a URL needs indexing and when, calibrated to "the importance and likely update frequency of the specific URL." Documents from "authoritative domains" and "undercovered topics" are kept hot.',
              lever:
                "Earn links from authoritative sites, update pages substantively, and cover the gaps others don't.",
            },
            {
              title: "Pages are parsed into self-contained spans",
              body: 'A content-understanding module splits each document into spans that are "individually retrieved and ranked at query time." List- and table-heavy sites get "more formulaic parsing."',
              lever:
                "Write sections that make sense on their own, and put specs and comparisons in real HTML tables.",
            },
            {
              title: "Keyword and semantic retrieval run together",
              body: "Lexical and embedding retrieval run in parallel and merge into one candidate set, so both exact terms and meaning count.",
              lever:
                "Use the words buyers use — product names, units, category terms — alongside natural explanation.",
            },
            {
              title: "Stale and non-responsive content is filtered out",
              body: 'Prefilters remove "clearly non-responsive or stale content" before scoring. The index stores publish and last-updated dates per page — the Sonar API even filters on them.',
              lever: "Show a real published and updated date, and keep them honest.",
            },
            {
              title: "Cross-encoders rerank passages",
              body: 'Fast lexical and embedding scorers narrow the set; cross-encoder rerankers make the final cut, scoring at document and sub-document level. Rankers keep training on signals from "millions of user requests… each hour."',
              lever: "Answer the question in the first sentence of the section that covers it.",
            },
            {
              title: "The answer cites its best passages",
              body: 'A standard answer cites 4–8 sources, shown as numbered cards above the text. When the index isn\'t enough, `Perplexity-User` fetches pages live. Research mode "performs dozens of searches, reads hundreds of sources."',
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "200B+",
              label: "unique URLs tracked by Perplexity's own index",
              source: {
                name: "Perplexity, Sep 2025",
                href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
              },
            },
            {
              value: "28.6%",
              label:
                "of Perplexity's citations rank in Google's top 10 — the highest of any assistant (Bing: 14%)",
              source: {
                name: "Ahrefs, Aug 2025",
                href: "https://ahrefs.com/blog/ai-search-overlap/",
              },
            },
            {
              value: "~250 days",
              label: "fresher, on average, than the pages in Google's organic results",
              source: {
                name: "Ahrefs, Jul 2025",
                href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Perplexity reaches further than perplexity.ai",
          text: "Its index powers the Sonar and Search APIs, the Comet browser (free worldwide since October 2025, on iOS since March 2026), and Samsung's Galaxy S26, where the Perplexity app ships preloaded and Bixby uses Perplexity's APIs for real-time answers. Being in Perplexity's index means being in all of them.",
        },
      ],
    },
    {
      id: "crawlers",
      title: "PerplexityBot, Perplexity-User and robots.txt",
      blocks: [
        {
          kind: "p",
          text: 'Perplexity [documents two bots](https://docs.perplexity.ai/guides/bots), with IP ranges published for each. Changes to robots.txt "may take up to 24 hours" to apply.',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "PerplexityBot",
              role: "search",
              purpose:
                'Surfaces and links websites in Perplexity\'s search results; "not used to crawl content for AI foundation models." Honors robots.txt rate limits and backs off when a site struggles. IPs: `perplexity.com/perplexitybot.json`.',
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
          kind: "code",
          lang: "robots.txt",
          code: "# Eligible for Perplexity search and live fetches\nUser-agent: PerplexityBot\nAllow: /\nDisallow: /account/\nDisallow: /cart/\n\nUser-agent: Perplexity-User\nAllow: /\n\nSitemap: https://example.com/sitemap.xml",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Blocking PerplexityBot doesn't make you disappear",
          text: "Perplexity's help center says that if a page disallows PerplexityBot, \"we may still index the domain, headline, and a brief factual summary.\" `Perplexity-User` generally ignores robots.txt, so a hard block needs a WAF rule on its user agent and IPs. And Comet is the user's own browser — it sends a standard Chrome user agent from their IP and can't be told apart in logs.",
        },
        {
          kind: "p",
          text: "It's worth knowing the history. In August 2025 [Cloudflare reported](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) that when its declared bots were blocked, Perplexity fetched pages with an undeclared Chrome user agent from IPs outside its published ranges, and removed it from its verified-bot list. Perplexity [responded](https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web) that user-requested fetches aren't crawling and that Cloudflare had misattributed traffic from a third-party browser service. Practically: if you want Perplexity's traffic, don't rely on Cloudflare's default AI-bot rules to get the policy right — set it explicitly.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "Perplexity has no webmaster console, doesn't take URL submissions and isn't an IndexNow participant. Everything rests on its crawler finding, fetching and parsing your pages cleanly — which puts the weight on rendering, speed and structure.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Server-rendered HTML",
              status: "required",
              note: "PerplexityBot didn't render JavaScript in Vercel's study, and Glenn Gabe found Perplexity \"failed at finding the content for every url I tested\" on client-rendered pages.",
            },
            {
              label: "Bots allowed at the WAF",
              status: "required",
              note: "Allow both published IP ranges through bot-fight modes, AI-bot managed rules and rate limits. Refresh the IP lists automatically.",
            },
            {
              label: "Fast, stable responses",
              status: "helps",
              note: "`Perplexity-User` fetches in real time. Timeouts, 403s or 429s mean the answer is built from someone else's page.",
            },
            {
              label: "Accurate dates",
              status: "helps",
              note: "A visible published/updated date plus `datePublished` and `dateModified`. The index stores dates and prefilters stale content — never fake a refresh.",
            },
            {
              label: "HTML tables & lists",
              status: "helps",
              note: 'Perplexity parses list- and table-heavy content "formulaically" — structure is extracted, not guessed.',
            },
            {
              label: "Canonicals on syndicated copies",
              status: "helps",
              note: "Columbia's Tow Center caught Perplexity citing republished copies instead of originals. Require partners to canonicalize back to you.",
            },
            {
              label: "Sitemaps",
              status: "unconfirmed",
              note: "Not documented. Keep one with honest `lastmod` values, referenced from robots.txt, for general discovery.",
            },
            {
              label: "HTML versions of PDFs",
              status: "unconfirmed",
              note: "Perplexity cites PDFs, but how it handles open-web PDFs isn't documented. Publish key reports as HTML too, and never as scans.",
            },
            {
              label: "IndexNow",
              status: "no-effect",
              note: "Perplexity isn't on IndexNow's list of participating engines.",
            },
            {
              label: "llms.txt",
              status: "no-effect",
              note: "Perplexity publishes its own for developers, but has never said PerplexityBot reads other sites' files or uses them to rank.",
            },
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: 'curl -s -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n\n# 0 = client-rendered text, or a WAF challenge',
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What Perplexity cites",
      blocks: [
        {
          kind: "p",
          text: "Of all the assistants, Perplexity's citations overlap most with classic search — so strong SEO carries over here better than anywhere. On top of that, its passage-level design rewards sections that stand alone, and its freshness filtering rewards pages that stay current.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Passage quality",
              body: "Spans are retrieved and reranked individually. A section that answers in its first sentence — with names, numbers and units — competes on its own.",
              evidence: "official",
            },
            {
              title: "Freshness",
              body: "Stale content is prefiltered, recrawls follow update frequency, and citations are ordered newest-first with an average age well below Google's results.",
              evidence: "official",
            },
            {
              title: "Authoritative domains",
              body: "Documents from authoritative domains get crawl and storage priority — they're kept hot in the index.",
              evidence: "official",
            },
            {
              title: "Classic rankings",
              body: "28.6% of Perplexity's citations rank in Google's top 10, the highest of any assistant. BrightEdge's older data put domain overlap near 60%.",
              evidence: "observed",
            },
            {
              title: "Community and video",
              body: "Reddit is 46.7% of citations among Perplexity's top-10 domains — but 6.6% of all citations. YouTube follows. Useful as a second path, not a strategy.",
              evidence: "observed",
            },
            {
              title: 'The "59 ranking factors" leak',
              body: "Parameter names found by inspecting Perplexity's web app — rerankers, time decay, curated domains — are unconfirmed and several look like Discover feed settings. Don't build tactics on them.",
              evidence: "our-read",
            },
          ],
        },
      ],
    },
    {
      id: "publishers",
      title: "Comet Plus, publishers and ads",
      blocks: [
        {
          kind: "p",
          text: 'Perplexity is the only major answer engine that pays publishers per use. [Comet Plus](https://www.perplexity.ai/hub/blog/introducing-comet-plus) costs $5 a month on its own and is included in Pro and Max; Perplexity says it distributes the revenue "minus a small portion for compute," reported as 80% to publishers from an initial $42.5M pool. It pays on three kinds of traffic: human visits, search citations and agent actions. Partners include Condé Nast, Fortune, Le Monde, the LA Times and The Washington Post; publishers can apply via publishers@perplexity.ai.',
        },
        {
          kind: "p",
          text: "Ads are gone. Sponsored follow-up questions ran from late 2024, new advertisers stopped around October 2025, and in February 2026 executives said Perplexity isn't pursuing ads. There is no paid placement in answers.",
        },
      ],
    },
    {
      id: "measurement",
      title: "Tracking Perplexity traffic",
      blocks: [
        {
          kind: "p",
          text: "Clicks arrive with a `perplexity.ai` referrer and no UTM parameters. GA4's new AI Assistant channel doesn't name Perplexity — Google's documentation lists ChatGPT, Gemini, DeepSeek, Copilot and Grok — and practitioners report its traffic still lands in Referral. Give it a custom channel, placed above Referral:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — Perplexity\n(^|\\.)perplexity\\.ai$\n\n# All major AI assistants\nperplexity\\.ai|chatgpt\\.com|openai\\.com|gemini\\.google\\.com|copilot\\.microsoft\\.com|claude\\.ai",
        },
        {
          kind: "p",
          text: "In your logs, `Perplexity-User` hits on a URL are the best evidence that the page is being pulled into live answers. Verify the source IP against both JSON files — the user agents are trivial to spoof:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'grep -oE "PerplexityBot|Perplexity-User" access.log | sort | uniq -c\n\n# Pages Perplexity fetched live for users\ngrep "Perplexity-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
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
              myth: "Perplexity is just Google with an LLM on top.",
              reality:
                "It runs its own 200B-URL index and crawler. Google rankings correlate — 28.6% top-10 overlap — but they're not what Perplexity searches.",
            },
            {
              myth: "Reddit is half of Perplexity's citations.",
              reality:
                "Reddit is 46.7% of the share held by the top-10 cited domains, but 6.6% of all citations (Profound).",
            },
            {
              myth: "Blocking PerplexityBot keeps you out of Perplexity.",
              reality:
                "Your domain, headline and a short summary may still appear, `Perplexity-User` generally ignores robots.txt, and syndicated copies can be cited instead.",
            },
            {
              myth: "Submit URLs through IndexNow, llms.txt or a webmaster console.",
              reality:
                "None of these exist for Perplexity. Discovery is its crawler and links from sites it already trusts.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "robots",
      title: "Allow PerplexityBot and Perplexity-User",
      detail:
        "In robots.txt, and through Cloudflare's AI-bot rules, bot-fight mode and rate limits.",
      impact: "high",
    },
    {
      id: "ips",
      title: "Automate the published IP allowlists",
      detail:
        "Refresh `perplexitybot.json` and `perplexity-user.json` on a schedule so WAF rules don't go stale.",
      impact: "medium",
    },
    {
      id: "ssr",
      title: "Server-render or statically generate content",
      detail:
        "Confirm with `curl` and the PerplexityBot user agent that the body text is in the raw HTML.",
      impact: "high",
    },
    {
      id: "seo",
      title: "Keep doing strong classic SEO",
      detail: "Perplexity has the highest Google top-10 overlap of any assistant.",
      impact: "high",
    },
    {
      id: "spans",
      title: "Write passage-ready sections",
      detail:
        "A descriptive heading, the answer in the first one or two sentences, named entities and numbers with units.",
      impact: "high",
    },
    {
      id: "tables",
      title: "Use real HTML tables and lists",
      detail: "For specs, prices, comparisons and steps — Perplexity parses these structurally.",
      impact: "medium",
    },
    {
      id: "dates",
      title: "Show accurate dates",
      detail:
        "Visible dates plus `datePublished` / `dateModified`. Update meaningfully; never fake a refresh.",
      impact: "high",
    },
    {
      id: "sitemap",
      title: "Keep an honest XML sitemap",
      detail: "Accurate `lastmod` values, referenced from robots.txt.",
      impact: "low",
    },
    {
      id: "canonical",
      title: "Canonicalize syndicated copies back to you",
      detail: "Make it a condition of every syndication deal.",
      impact: "medium",
    },
    {
      id: "coverage",
      title: "Earn coverage where Perplexity looks",
      detail:
        "Reddit threads, YouTube, LinkedIn, review sites and trade press that already get cited for your topic.",
      impact: "medium",
    },
    {
      id: "entity",
      title: "Make your brand unambiguous",
      detail:
        "Consistent naming, Organization schema with `sameAs`, and clear About and author pages.",
      impact: "medium",
    },
    {
      id: "speed",
      title: "Serve bots fast and error-free",
      detail: "Low TTFB and no 5xx or 429s — failed live fetches fail silently.",
      impact: "medium",
    },
    {
      id: "pdfs",
      title: "Publish HTML versions of key PDFs",
      detail: "At minimum, text-based PDFs rather than scans.",
      impact: "low",
    },
    {
      id: "measure",
      title: "Set up measurement",
      detail:
        "A GA4 custom channel, an IP-verified log view of both bots, and a monthly prompt panel.",
      impact: "high",
    },
    {
      id: "comet-plus",
      title: "Publishers: apply to Comet Plus",
      detail: "Paid on visits, citations and agent actions. Contact publishers@perplexity.ai.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "How does Perplexity choose its sources?",
      a: "It searches its own index with keyword and semantic retrieval together, filters out stale or off-topic pages, then reranks individual passages with cross-encoder models. A standard answer cites the 4–8 passages that best answer the question.",
    },
    {
      q: "Does Perplexity use Google or Bing?",
      a: "No. Since 2025 it has run its own crawler and an index of more than 200 billion URLs, supplemented by third-party crawlers that must respect robots.txt. Pages that rank in Google's top 10 are still cited more often than average — about 29% overlap, per Ahrefs.",
    },
    {
      q: "How do I get my website cited by Perplexity?",
      a: "Allow `PerplexityBot` and `Perplexity-User`, make sure your content is in the server-rendered HTML, and write sections that answer a question in their first sentence with accurate dates. Mentions on sites Perplexity cites heavily for your topic help too.",
    },
    {
      q: "If I block PerplexityBot, will Perplexity stop using my content?",
      a: "It stops indexing your full text, but may still show your domain, headline and a brief summary. `Perplexity-User` generally ignores robots.txt, so a hard block needs a WAF rule.",
    },
    {
      q: "Can Perplexity read JavaScript-rendered sites?",
      a: "Independent tests say no: Vercel's study found PerplexityBot doesn't render JavaScript, and Glenn Gabe's 2025 test found it failed on every client-side-rendered page. Content that only appears after JavaScript runs is effectively invisible.",
    },
    {
      q: "How do I track Perplexity traffic in GA4?",
      a: "Clicks arrive from `perplexity.ai` with no UTM tags and usually land in Referral — Google doesn't list Perplexity in the AI Assistant channel. Build a custom channel with a `perplexity\\.ai` regex above Referral.",
    },
    {
      q: "Does freshness matter for Perplexity?",
      a: "Yes. Perplexity schedules recrawls by update frequency, filters stale content before ranking, and orders citations newest-first. Ahrefs found its citations average about 250 days fresher than Google's organic results.",
    },
    {
      q: "Does Perplexity pay publishers or sell ads?",
      a: "Comet Plus shares about 80% of its revenue with partner publishers, paying on visits, citations and agent actions. Perplexity stopped pursuing ads in February 2026 and sells no placement in answers.",
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
      title: "Sonar search filters",
      publisher: "Perplexity Docs",
      href: "https://docs.perplexity.ai/docs/sonar/filters",
    },
    {
      title: "Perplexity builds AI search at scale on Vespa.ai",
      publisher: "Vespa",
      href: "https://blog.vespa.ai/perplexity-builds-ai-search-at-scale-on-vespa-ai/",
    },
    {
      title: "Introducing Comet Plus",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/introducing-comet-plus",
    },
    {
      title: "Agents or bots? Making sense of AI on the open web",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web",
    },
    {
      title: "Perplexity is using stealth, undeclared crawlers",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/",
    },
    {
      title: "Perplexity APIs on Samsung Galaxy",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/perplexity-apis-deliver-powerful-ai-to-the-world-s-largest-android-device-maker",
    },
    {
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "Do AI assistants prefer to cite fresh content?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
    },
    {
      title: "AI platform citation patterns",
      publisher: "Profound",
      href: "https://www.tryprofound.com/blog/ai-platform-citation-patterns",
    },
    {
      title: "We compared eight AI search engines. They're all bad at citing news",
      publisher: "Columbia Journalism Review",
      href: "https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "AI search and JavaScript rendering",
      publisher: "GSQi (Glenn Gabe)",
      href: "https://www.gsqi.com/marketing-blog/ai-search-javascript-rendering/",
    },
    {
      title: "Participating search engines",
      publisher: "IndexNow",
      href: "https://www.indexnow.org/searchengines.json",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
  ],

  sameAs: ["https://en.wikipedia.org/wiki/Perplexity_AI", "https://www.perplexity.ai"],

  furtherReading: [
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Allow PerplexityBot and Perplexity-User alongside every other AI crawler, with deliberate training choices.",
    },
    {
      title: "Citation tracking",
      href: "/features/citation-tracking",
      description:
        "See which prompts cite you in Perplexity each week — and which passages it pulls instead.",
    },
  ],
};
