import type { EngineGuide } from "../types";

export const copilot: EngineGuide = {
  slug: "copilot",
  metaTitle: "Microsoft Copilot SEO: The Technical Guide to Copilot Citations",
  metaDescription:
    "How Microsoft Copilot grounds answers in Bing's index: Bingbot, the NOARCHIVE and NOCACHE tags, IndexNow, Bing Webmaster Tools' AI Performance report, and tracking Copilot traffic.",
  keywords: [
    "Microsoft Copilot SEO",
    "get cited by Copilot",
    "Copilot citations",
    "does Copilot use Bing",
    "Bing Webmaster Tools AI Performance",
    "Copilot NOARCHIVE NOCACHE",
  ],
  headline: {
    lead: "Copilot SEO:",
    accent: "the technical guide to getting cited by Microsoft Copilot",
  },
  subhead:
    "Copilot has no crawler you can see. It asks Bing, and cites what Bing's index can verify. Here's how that pipeline works, which meta tags switch it off, and how to see your citations in Bing Webmaster Tools.",

  shortAnswer:
    "To get cited by Microsoft Copilot, get your pages crawled, indexed and kept fresh in **Bing**: allow **Bingbot**, verify your site in Bing Webmaster Tools, submit a sitemap and ping **IndexNow** on every change. Copilot turns each question into a few short search queries and grounds its answer in Bing's results, so it cites pages whose facts stand on their own near the top of the HTML, and never pages tagged `noarchive`.",

  takeaways: [
    "Microsoft documents no Copilot crawler. Copilot grounds in Bing's index, so `Bingbot` is the only bot that decides whether you can be cited.",
    "Bing's meta tags control Copilot directly: `noarchive` keeps a page out of Copilot answers, and `nocache` cuts it to URL, title and snippet.",
    "There's no training-only opt-out yet. `noarchive` blocks Microsoft's AI training and Copilot together; a robots.txt no-training rule is targeted for early 2027.",
    "In Ahrefs' 2025 data, 16.6% of Copilot's citations ranked in Bing's top 10 for the original prompt, and 77.1% weren't in the top 100. Copilot searches its own short queries.",
    "Bing Webmaster Tools' AI Performance report shows which pages Copilot cites and the grounding queries behind them. Since June 2026 it adds Citation Share.",
    "Clicks arrive from `copilot.microsoft.com`, and GA4's AI Assistant channel names Copilot. Clicks from Copilot Search in Bing look like Bing organic traffic.",
  ],

  facts: [
    { label: "Where Copilot grounds its web answers", value: "Bing's index" },
    { label: "The crawler to allow", value: "Bingbot", mono: true },
    { label: "Of Copilot citations in Bing's top 10 (2025)", value: "16.6%" },
    { label: "Copilot's citation report, in Bing Webmaster Tools", value: "AI Performance" },
  ],

  preview: {
    prompt: "What's the best project management tool for a five-person startup?",
    status: "Searching the web",
    answer:
      "**Plannora** is a strong fit for a five-person team: its free plan covers up to five users and includes boards, timelines and a public API. Loopcraft has more automation but starts at $8 per seat.",
    sources: [
      { domain: "plannora.io", title: "Plannora pricing: free for teams of up to 5" },
      { domain: "stackreview.co", title: "Best project management tools for startups (2026)" },
      { domain: "teamtoolsguide.com", title: "Plannora vs Loopcraft for small teams" },
      { domain: "saasgrid.net", title: "Project management software compared" },
    ],
  },

  profile: {
    retrieval:
      "Bing's index: Copilot sends short generated queries, Bing returns grounding results",
    searchCrawler: "Bingbot (no separate Copilot user agent)",
    trainingCrawler: "None separate: noarchive opts out of training and Copilot together",
    rendersJs: "Bingbot renders with current Edge, but Bing says not to rely on it",
    referrer: "copilot.microsoft.com referral; Copilot Search clicks arrive as bing.com",
    citationStyle: "Inline source-name pills, source cards under the answer, a References panel",
    biggestLever: "Be indexed and fresh in Bing: Webmaster Tools, IndexNow, no noarchive/nocache",
  },

  sections: [
    {
      id: "how-copilot-cites",
      title: "How Copilot finds and cites sources",
      blocks: [
        {
          kind: "p",
          text: "Microsoft Copilot is one assistant on many surfaces: the web app at `copilot.microsoft.com`, the Windows, Mac and mobile apps, Copilot in Edge, and **Copilot Search** inside Bing, launched on April 4, 2025. From August 18, 2026 Microsoft began rolling out an [updated Copilot app](https://support.microsoft.com/en-us/microsoft-365-copilot/learning/changes-microsoft-copilot-app) that takes personal and work accounts in one place, and its documentation now calls Microsoft 365 Copilot simply Microsoft Copilot. Whatever the surface, web answers are grounded the same way: in Bing.",
        },
        {
          kind: "p",
          text: 'Microsoft\'s documents agree on the mechanism. Copilot\'s [transparency note](https://support.microsoft.com/en-us/privacy/microsoft-copilot/transparency-note), updated August 18, 2026, says that "for certain conversations where users seek information, Copilot is grounded in web search results" and "centers its response on high-ranking content from the web." The work-account docs spell out the query step: Copilot writes a query of "a few words informed by the user\'s prompt" and sends it to "the Bing search service." And Bing\'s [Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) say "Bing and Copilot search experiences rely on the same core crawling, indexing, and ranking foundation as traditional search."',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Copilot decides the answer needs the web",
              body: "Information-seeking conversations are grounded in web search, and a **Search** mode in the composer forces it. On work accounts, IT admins can turn web search off for a whole tenant, and each user has a Web content toggle.",
            },
            {
              title: "It writes a few short Bing queries",
              body: 'The query is a few words drawn from the prompt, not the prompt itself, unless the prompt is very short. Bing Webmaster Tools reports these as [grounding](/glossary/grounding) queries: "grouped representations," not users\' questions.',
              lever:
                "Title and head each page with the plain terms such a query would use: product names, category words, the problem it solves.",
            },
            {
              title: "Bing retrieves groundable information",
              body: 'Grounding runs on "the same crawlers, the same quality signals" as search, per Bing\'s May 2026 post, but asks a different question: "what information can an AI system responsibly use to construct a response?" Pages whose content "stands on its own" are more likely to be selected.',
              lever:
                "Be indexed, canonical and fresh in Bing: a sitemap with honest `lastmod`, and IndexNow on every change.",
            },
            {
              title: "Your meta tags set how much it may use",
              body: '`noarchive` keeps a page out of Copilot responses and grounding results. `nocache` limits Copilot to your URL, title and snippet. `nosnippet` and `data-nosnippet` hide captions and "may limit Copilot citation quality."',
              lever: "Keep all of them off the pages you want quoted.",
            },
            {
              title: "The answer shows its sources",
              body: "Cited sentences end in a pill with the source's name, source cards sit under the answer, and **Show all** opens a References panel. Microsoft Advertising can also place ads in the same response.",
              lever:
                "Make your site name and page title unambiguous. They're what the citation card shows.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "16.6%",
              label:
                "of Copilot's cited URLs ranked in Bing's top 10 for the original prompt; 77.1% weren't in the top 100",
              source: {
                name: "Ahrefs, Aug 2025",
                href: "https://ahrefs.com/blog/ai-search-overlap/",
              },
            },
            {
              value: "5.12%",
              label:
                "of US AI referral traffic came from Copilot in January–April 2026 (3.51% worldwide)",
              source: {
                name: "SE Ranking, Jun 2026",
                href: "https://seranking.com/blog/ai-traffic-research-study/",
              },
            },
            {
              value: "1B",
              label: "Bing monthly active users, a first, reported in April 2026",
              source: {
                name: "Microsoft, Apr 2026",
                href: "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q3",
              },
            },
          ],
        },
        {
          kind: "h3",
          text: "What a Copilot citation looks like",
        },
        {
          kind: "p",
          text: 'In the Copilot app, a cited sentence ends in a small gray pill with the source\'s name, plus a count such as "+2" when several sources back it. Under the answer sit source cards with favicon, site name and page title, and a **Show all** button that opens a References panel with "Related results" below it, as [screenshots from Microsoft\'s November 2025 search update](https://www.seroundtable.com/microsoft-coplilot-ai-search-citations-40400.html) show. In Bing, [Copilot Search](https://blogs.bing.com/search/April-2025/Introducing-Copilot-Search-in-Bing) links "the entire sentence or passage" to its source, per its launch post, though in April 2026 Bing was seen [testing](https://www.seroundtable.com/bing-less-clickable-links-41208.html) links on the citation marker only.',
        },
        {
          kind: "callout",
          tone: "note",
          title: "Bing's grounding reaches past Copilot",
          text: 'Microsoft says its grounding "powers nearly every major AI assistant in the market" ([Jordi Ribas, February 2026](https://blogs.bing.com/search/February-2026/Elevating-the-Role-of-Grounding-on-the-AI-Web)), and the AI Performance report counts citations across Copilot, AI summaries in Bing and "select partner AI integrations." Work done for Bing pays out beyond Copilot. For how Bing figures in ChatGPT search, see the [ChatGPT guide](/ai-seo/chatgpt).',
        },
      ],
    },
    {
      id: "crawlers",
      title: "Bingbot, and the Copilot crawler that doesn't exist",
      blocks: [
        {
          kind: "p",
          text: 'Bing\'s [crawler list](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0) names five bots: `Bingbot`, `AdIdxBot`, `BingPreview`, `MicrosoftPreview` and `BingVideoPreview`. None is a Copilot fetcher, and Vercel had to leave Copilot out of its December 2024 crawler study because it "lacks a unique user agent for tracking." Microsoft doesn\'t document a live, per-conversation fetcher either; its removal help describes Copilot experiences as ones "that rely on Bing\'s index."',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "Bingbot",
              role: "search",
              purpose:
                "Bing's standard crawler, which \"handles most of our crawling needs.\" It feeds the index behind Bing search, Copilot and Bing's grounding partners, and renders pages with the latest stable Microsoft Edge.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "BingPreview",
              role: "other",
              purpose:
                "Generates page snapshots for Bing. Its documented user-agent strings are Bingbot's own, so you can't tell the two apart in logs.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "MicrosoftPreview",
              role: "other",
              purpose:
                "Generates page snapshots for Microsoft products, under its own `MicrosoftPreview/2.0` token. Microsoft doesn't say which products use them.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "AdIdxBot",
              role: "other",
              purpose:
                "Microsoft Advertising's crawler: it follows ads to their landing pages for quality control. Only relevant if you advertise, and ads can serve inside Copilot.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: 'One Bing quirk matters in [robots.txt](/glossary/robots-txt): when Bingbot finds a group addressed to it, it "will ignore the directives listed in the generic section," so every generic rule has to be repeated. Bing also caches robots.txt, so changes "can take a few hours" to apply.',
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Bing's crawler: the only route into Copilot\nUser-agent: bingbot\nAllow: /\nDisallow: /cart/\nDisallow: /account/\n\n# A bingbot group replaces the * group for Bing,\n# so every generic rule is repeated above.\nUser-agent: *\nDisallow: /cart/\nDisallow: /account/\n\nSitemap: https://www.example.com/sitemap.xml",
        },
        {
          kind: "h3",
          text: "The meta tags that control Copilot",
        },
        {
          kind: "p",
          text: 'Robots.txt only controls crawling. What Copilot may do with an indexed page is set by Bing\'s [robots meta tags](https://www.bing.com/webmasters/help/robots-meta-tags-and-attributes-that-bing-supports-5198d240), which also work as an `X-Robots-Tag` header, and can be scoped to Bing alone by writing `name="bingbot"` instead of `name="robots"`. Bing\'s guidelines and tag documentation give each one an explicit Copilot effect:',
        },
        {
          kind: "table",
          head: ["Directive", "Bing search", "Copilot answers", "Microsoft AI training"],
          rows: [
            ["`noindex`", "Removed", "Removed", "Not used"],
            ["`noarchive`", "No cached copy; ranking unaffected", "Not used or linked", "Not used"],
            [
              "`nocache`",
              "No cached copy",
              "URL, title and snippet only",
              "URL, title and snippet only",
            ],
            ["`nosnippet`", "No caption", '"May limit Copilot citation quality"', "Not documented"],
            [
              "`data-nosnippet`",
              "Text still indexed and ranked",
              "Text left out of AI summaries",
              "Not documented",
            ],
          ],
        },
        {
          kind: "code",
          lang: "html",
          code: '<!-- Out of Copilot answers and Microsoft AI training; stays in Bing search -->\n<meta name="bingbot" content="noarchive">\n\n<!-- Copilot may show only URL, title and snippet -->\n<meta name="bingbot" content="nocache">\n\n<!-- Keep one passage out of snippets and AI summaries -->\n<div data-nosnippet>Internal pricing notes</div>',
        },
        {
          kind: "p",
          text: 'Two details trip people up. A page carrying both `nocache` and `noarchive` is treated as `nocache`, so it stays in Copilot at snippet depth. And `noindex` has to be seen to work: Bing says "do not block access to the page" in robots.txt, or the tag is never read. See [snippet controls](/glossary/snippet-controls) for how these compare with Google\'s.',
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Opting out of training currently means opting out of Copilot",
          text: "Bing has no training-only crawler, so no robots.txt rule separates training from search. Today's opt-out is `noarchive`, which also removes the page from Copilot answers. Per [Cloudflare's September 15, 2026 post](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/), Microsoft is building a robots.txt \"no training\" preference \"targeted for early 2027.\" The same post changed Cloudflare's settings: **Block** now stops Bingbot outright, search included, and **Disallow AI Training** doesn't yet convey anything to Bing.",
        },
        {
          kind: "p",
          text: "Before you allowlist Bingbot at a WAF, [verify it](https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26): reverse-resolve the IP to a host ending in `search.msn.com`, then forward-resolve that host back to the same IP. Or match against [bingbot.json](https://www.bing.com/toolbox/bingbot.json), which Bing says to refresh daily because it can change at any time.",
        },
      ],
    },
    {
      id: "bing-gate",
      title: "Bing is the gate: index, IndexNow and Webmaster Tools",
      blocks: [
        {
          kind: "p",
          text: 'Because Copilot draws on Bing\'s index, Bing indexing is the entry ticket that most Copilot advice skips. Bing\'s guidelines, which [Search Engine Journal](https://www.searchenginejournal.com/bing-adds-geo-to-official-guidelines-expands-ai-abuse-definitions/568442/) reported rewritten in February 2026, list "grounding results and citations" next to indexing and ranking as what compliance earns, and warn that ignoring them can mean "reduced eligibility for grounding experiences, or delisting from the Bing index." The setup:',
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Verify your site in [Bing Webmaster Tools](https://www.bing.com/webmasters).** You can import sites already verified in Google Search Console. AI Performance, URL Inspection and IndexNow reporting all live there.",
            '**Submit an XML sitemap with honest `lastmod`.** Bing wants ISO 8601 date and time reflecting "the true last modification time of the page content," reads sitemaps "typically at least once per day," and takes up to 50,000 URLs per file. List only canonical URLs.',
            '**Turn on [IndexNow](/glossary/indexnow).** Ping when a URL is added, updated or removed. Bing says timely pings "reduce outdated or incorrect URL references in Copilot responses," and prefers streaming submissions to batches.',
            '**Check what Bingbot sees.** URL Inspection\'s Live URL tab shows "exactly what the Bingbot sees while downloading a page from your site," including any redirect it stops at.',
            "**Remove pages cleanly.** Return 404 or 410, or add `noindex`, then send the change through IndexNow. The Block URLs tool hides a page for 90 days while that takes effect.",
            "**Local businesses: claim Bing Places.** Microsoft's AI Performance launch post points local businesses to Bing Places for Business to keep their details accurate in AI answers.",
          ],
        },
        {
          kind: "p",
          text: 'IndexNow is a shared protocol, not a Bing API. A submission is "automatically shared with all other participating search engines," currently Bing, Yandex, Seznam, Naver, Yep, the Internet Archive and Amazonbot. Host the key as a text file at your root, then POST changes as they happen (a single URL can also go as a GET):',
        },
        {
          kind: "code",
          lang: "http",
          code: 'POST https://www.bing.com/indexnow\nContent-Type: application/json; charset=utf-8\n\n{\n  "host": "www.example.com",\n  "key": "3f6c9a1e2b7d4c58",\n  "keyLocation": "https://www.example.com/3f6c9a1e2b7d4c58.txt",\n  "urlList": [\n    "https://www.example.com/pricing",\n    "https://www.example.com/blog/new-post"\n  ]\n}\n\n# Up to 10,000 URLs per POST. 200 or 202 = accepted,\n# 403 = key not found, 422 = URL not on this host, 429 = slow down.',
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "Copilot publishes no requirements of its own; Bing's guidelines are the spec, and they now name Copilot and grounding throughout. Everything marked required or helps below comes from Microsoft's own documents.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Bingbot allowed",
              status: "required",
              note: 'In robots.txt and at the CDN or WAF. Bing lists "Blocking Bingbot in your robots.txt file" among things to avoid, and Cloudflare\'s **Block** setting now stops it too.',
            },
            {
              label: "Indexed in Bing",
              status: "required",
              note: "Copilot experiences \"rely on Bing's index.\" Confirm each target page in URL Inspection, not by assuming Google's index carries over.",
            },
            {
              label: "No `noarchive`",
              status: "required",
              note: 'It "prevents content from being used in Copilot responses and grounding results." Check CMS and paywall templates for it.',
            },
            {
              label: "No `nocache` on citable pages",
              status: "helps",
              note: 'It limits Copilot to URL, title and snippet, "reducing citation depth and answer quality."',
            },
            {
              label: "Content in rendered HTML",
              status: "helps",
              note: 'Bingbot renders with current Edge, but Bing says to avoid "hiding critical content behind client-side rendering," and Microsoft Advertising warns "AI systems may not render hidden content" in tabs or expandable menus.',
            },
            {
              label: "Freshness signals",
              status: "helps",
              note: "Accurate `lastmod`, HTTP validators such as ETags, and IndexNow pings. Bing says stale facts matter more in grounding than in search.",
            },
            {
              label: "One canonical URL",
              status: "helps",
              note: 'Duplicates "reduce Bing\'s confidence in selecting a URL for grounding results or citations." Use 301s for moves, not canonical tags.',
            },
            {
              label: "Titles, descriptions, headings",
              status: "helps",
              note: 'Missing, duplicate or overly short titles and meta descriptions "may reduce... eligibility for grounding results and citations."',
            },
            {
              label: "Structured data",
              status: "helps",
              note: 'Bing says it "may support clearer grounding but does not guarantee visibility," and must match visible content.',
            },
            {
              label: "Text for images, video and PDFs",
              status: "helps",
              note: "Media shouldn't be the only source of a fact. Microsoft lists relying on PDFs or images for core information as a visibility risk.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "Not mentioned in Bing's guidelines or any Copilot documentation.",
            },
          ],
        },
        {
          kind: "p",
          text: "Two quick checks from the command line, then the definitive one in URL Inspection's Live URL tab:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# 1. Is the key sentence in the HTML Bingbot downloads?\ncurl -s -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n\n# 2. Is anything telling Copilot to stay away?\ncurl -sI https://yoursite.com/pricing | grep -i "x-robots-tag"\ncurl -s https://yoursite.com/pricing | grep -ioE \'<meta[^>]+(robots|bingbot)[^>]*>\'\n\n# 0 in step 1 = client-rendered text or a WAF challenge. Bingbot renders\n# JavaScript, but Bing says not to rely on it: treat 0 as a fix.',
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What Copilot cites",
      blocks: [
        {
          kind: "p",
          text: 'Microsoft is unusually explicit about what grounding prefers: its guidelines devote a run of sections to content that is "easy to understand without external context." The independent data adds a twist: Copilot\'s citations lean hard toward retailers and reference sites, and overlap little with other engines.',
        },
        {
          kind: "signals",
          items: [
            {
              title: "Bing eligibility first",
              body: 'Crawl efficiency, indexing accuracy, URL consolidation and authority signals "also support" grounding eligibility. Nothing downstream works for a page Bing hasn\'t indexed.',
              evidence: "official",
            },
            {
              title: "Facts that stand on their own",
              body: 'Pages are "more likely to be selected for grounding queries and citations when content stands on its own." Microsoft Advertising says assistants like Copilot parse pages into "smaller, structured pieces" and favors "sentences that make sense even when pulled out of context."',
              evidence: "official",
            },
            {
              title: "Answer early, one topic per URL",
              body: '"Place essential information near the top" and avoid "long introductions." URLs focused on one topic "are more likely to be selected for grounding results."',
              evidence: "official",
            },
            {
              title: "Unambiguous entities",
              body: 'Consistent names for people, organizations, products and places improve "grounding visibility and citation accuracy," per Bing. Describe the same product the same way in text, images and schema.',
              evidence: "official",
            },
            {
              title: "Retail and reference sites dominate",
              body: "In Ahrefs' September 2026 snapshot of 3M+ US queries, Amazon took 16.8% of the citations earned by Copilot's top 50 domains, Walmart 12.6% and Wikipedia 7.6%. YouTube had 1.9%; Reddit wasn't in the top 50.",
              evidence: "observed",
            },
            {
              title: "Low-authority sites still get in",
              body: "Three of Copilot's 50 most-cited domains in that snapshot have an Ahrefs Domain Rating under 10. Relevance to the grounding query appears to count for more than domain strength.",
              evidence: "our-read",
            },
            {
              title: "A different race from other engines",
              body: "Bing's Copilot answers shared 9.81% of cited domains with Google's AI Overviews, 11.97% with Perplexity and 13.95% with ChatGPT, the lowest overlaps tested, and cited 3.13 links per answer, the fewest ([SE Ranking](https://seranking.com/blog/chatgpt-vs-perplexity-vs-google-vs-bing-comparison-research/), Feb–Mar 2025 data).",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "h3",
          text: "What not to try",
        },
        {
          kind: "p",
          text: 'Bing\'s guidelines now carry a "Prompt Injection and AI Manipulation" section: content "designed to manipulate or interfere with language models used by Bing or Copilot may result in reduced visibility or removal." Text written "to manipulate ranking systems or trigger citations," scaled content without editorial review, and cloaking are on the same list. Bing also says plainly that "GEO does not guarantee grounding or citations in AI experiences."',
        },
      ],
    },
    {
      id: "measurement",
      title: "Measuring Copilot: citations, clicks and crawls",
      blocks: [
        {
          kind: "p",
          text: "Copilot is unusual in that its vendor tells you when you're cited. Bing Webmaster Tools' [AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) report launched in public preview on February 10, 2026, and on June 16 added Intents, Topics, Citation Share and Compare, all labeled preview. Here's what each place can and can't show you:",
        },
        {
          kind: "table",
          head: ["Where to look", "What you can see", "What you can't"],
          rows: [
            [
              "**AI Performance** (Bing Webmaster Tools)",
              "Total citations, cited pages, grounding queries and the page-to-query mapping, refreshed daily. Since June 2026: intent labels, topic clusters, Citation Share and period comparison. CSV and Excel export.",
              "Clicks, exact prompts, or which surface cited you: Copilot, Bing's AI summaries and partner integrations are pooled. The data is a sample, and sparse activity may not appear.",
            ],
            [
              "**Search Performance** (Bing Webmaster Tools)",
              'Clicks and impressions from "Learn more links in the Chat response," folded into the Web and Chat source since March 24, 2023.',
              "Whether that covers today's Copilot app; Microsoft doesn't say. Keyword and page detail isn't available for Chat.",
            ],
            [
              "**GA4**",
              "Sessions with a `copilot.microsoft.com` referrer. Google's AI Assistant channel lists Copilot among the assistants it groups.",
              "Which Copilot hostnames Google matches; it hasn't published the list. Copilot Search runs on bing.com, so its clicks look like Bing organic.",
            ],
            [
              "**Microsoft Clarity** Citations",
              "Page citations, a share-of-authority view and AI referral share; generally available since May 13, 2026. It may require verifying the domain through Bing Webmaster Tools or Search Console.",
              "Which AI surfaces are included; Clarity's announcement doesn't name them.",
            ],
            [
              "**Server logs**",
              "How often Bingbot recrawls the pages you want cited, and whether it gets clean 200s.",
              "Any Copilot-specific fetch. There's no Copilot user agent to look for.",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Read AI Performance as a trend line, not a ledger: Microsoft says the data "represents a sample," that "very low or infrequent citation activity may not surface," and that a citation "does not represent traffic, clicks, or user engagement." Its grounding queries are a rare look at the queries behind an AI engine\'s answers. Export them monthly and map each to the page you want cited.',
        },
        {
          kind: "p",
          text: "For clicks, Copilot has passed a `copilot.microsoft.com` referrer since at least March 2024, and its web app sets an `origin-when-cross-origin` referrer policy, so at most you see the host, never the conversation URL. Check where those sessions land in GA4; if any sit in Referral, add a custom channel above it:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — Copilot (copilot.com is now the app's canonical host)\n^(www\\.)?copilot\\.(microsoft\\.)?com$\n\n# Session source — all major AI assistants\ncopilot\\.microsoft\\.com|copilot\\.com|chatgpt\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com",
        },
        {
          kind: "p",
          text: "Microsoft doesn't document how clicks from the Windows and mobile apps are referred, so expect some Copilot visits in Direct. On the server side, watch Bingbot's recrawl rate on your citable pages: after an IndexNow ping, a fresh Bingbot hit is the signal that Copilot's source of truth has your update.",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Bingbot hits per page, most-crawled first\ngrep -i \"bingbot\" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20\n\n# Verify an IP is really Bing: expect a host ending in search.msn.com,\n# then check that host resolves back to the same IP\nhost 157.55.39.1\nhost <hostname-from-above>",
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
              myth: "Copilot has its own crawler you need to allow.",
              reality:
                "Microsoft documents none. Copilot grounds in Bing's index, so `Bingbot` is the whole story, and blocking it removes you from Bing and Copilot at once.",
            },
            {
              myth: "Copilot just cites Bing's top 10.",
              reality:
                "In Ahrefs' data, 16.6% of Copilot's cited URLs ranked in Bing's top 10 for the original prompt and 77.1% weren't in the top 100. Copilot searches its own short queries, which is what AI Performance's grounding queries show.",
            },
            {
              myth: "noarchive is a harmless AI-training opt-out.",
              reality:
                "It also keeps the page out of Copilot answers and grounding results. Until Microsoft's robots.txt no-training preference arrives, targeted for early 2027, there's no way to opt out of training and stay in Copilot.",
            },
            {
              myth: "Copilot can't read JavaScript, like ChatGPT and Claude.",
              reality:
                "Bingbot renders with the latest stable Edge. But Bing still tells sites not to hide critical content behind client-side rendering, and warns unrenderable content may not be selected for grounding.",
            },
            {
              myth: "Buying Microsoft ads gets you cited.",
              reality:
                "Ads in Copilot are separate formats built from your campaign assets, and advertisers can't opt out of them. Nothing Microsoft publishes describes a paid route into organic citations.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "allow-bingbot",
      title: "Allow Bingbot in robots.txt",
      detail:
        "Give it its own group only if you repeat every generic rule there, since a `bingbot` group replaces `User-agent: *` for Bing.",
      impact: "high",
    },
    {
      id: "waf-bingbot",
      title: "Check CDN and WAF rules for Bingbot",
      detail:
        "Cloudflare's **Block** setting now stops Bingbot, search included. Verify hits by reverse DNS to `search.msn.com` or against `bingbot.json`.",
      impact: "high",
    },
    {
      id: "verify-bwt",
      title: "Verify your site in Bing Webmaster Tools",
      detail:
        "Import from Google Search Console if you're verified there. Everything else on this list reports through it.",
      impact: "high",
    },
    {
      id: "sitemap-lastmod",
      title: "Submit a sitemap with honest lastmod",
      detail:
        "Canonical URLs only, ISO 8601 date and time, and deleted or redirected URLs removed promptly.",
      impact: "medium",
    },
    {
      id: "indexnow",
      title: "Turn on IndexNow",
      detail:
        "Ping on every publish, update and deletion, ideally as it happens. One submission reaches every participating engine.",
      impact: "high",
    },
    {
      id: "meta-audit",
      title: "Audit noarchive and nocache",
      detail:
        "Remove them from every page you want quoted, including paywall and CMS templates that add them by default. Check `X-Robots-Tag` headers too.",
      impact: "high",
    },
    {
      id: "training-decision",
      title: "Decide on AI training deliberately",
      detail:
        "`noarchive` opts out of Microsoft's training and Copilot together. Use it only where leaving Copilot is acceptable.",
      impact: "medium",
    },
    {
      id: "live-url",
      title: "Check key pages in URL Inspection's Live URL",
      detail:
        "Confirm the answer is in what Bingbot downloads, not only after client-side rendering, a tab or a click.",
      impact: "high",
    },
    {
      id: "canonicals",
      title: "Consolidate duplicate URLs",
      detail:
        "One canonical URL per piece of content, 301s for moves, and no parameter sprawl eating crawl capacity.",
      impact: "medium",
    },
    {
      id: "answer-first",
      title: "Write self-contained, answer-first pages",
      detail:
        "One topic per URL, the key fact near the top, and sentences that still make sense when lifted out of the page.",
      impact: "high",
    },
    {
      id: "entities",
      title: "Name entities consistently",
      detail:
        "The same product, company and people names across text, alt text and schema, with no ambiguous references.",
      impact: "medium",
    },
    {
      id: "titles",
      title: "Fix missing and duplicate titles",
      detail:
        "Unique titles and meta descriptions, and a logical heading hierarchy. Bing ties all three to grounding eligibility.",
      impact: "medium",
    },
    {
      id: "ai-performance",
      title: "Review AI Performance monthly",
      detail:
        "Export grounding queries, map each to a target page, and watch Citation Share on the queries that matter.",
      impact: "medium",
    },
    {
      id: "ga4-channel",
      title: "Set up Copilot measurement in GA4",
      detail:
        "Confirm `copilot.microsoft.com` sessions land in AI Assistant; if not, add a custom channel above Referral.",
      impact: "medium",
    },
    {
      id: "bing-places",
      title: "Local businesses: claim Bing Places",
      detail:
        "Microsoft points local businesses there to keep their details accurate in AI answers.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Microsoft Copilot?",
      a: "Get indexed and stay fresh in Bing: allow `Bingbot`, verify your site in Bing Webmaster Tools, submit a sitemap and use IndexNow. Keep `noarchive` and `nocache` off pages you want quoted, and write pages whose key facts stand on their own near the top.",
    },
    {
      q: "Does Microsoft Copilot use Bing?",
      a: "Yes. Microsoft's docs say Copilot generates a short query and sends it to the Bing search service, and Bing's guidelines say Copilot relies on the same crawling, indexing and ranking foundation as Bing search. That covers the consumer app, the work app and Copilot Search in Bing.",
    },
    {
      q: "Does Copilot have its own crawler or user agent?",
      a: "Not one Microsoft documents. Bing's crawler list has no Copilot bot, and Vercel's crawler study excluded Copilot because it lacks a unique user agent. Allowing `Bingbot` is what makes you eligible.",
    },
    {
      q: "How do I stop Copilot from using my content?",
      a: "Add `noarchive` to keep a page out of Copilot answers while staying in Bing search, or `nocache` to limit Copilot to your URL, title and snippet. `noindex` removes the page from Bing and Copilot entirely. Blocking `Bingbot` in robots.txt also removes you from Bing search.",
    },
    {
      q: "Can I opt out of Microsoft's AI training but stay in Copilot?",
      a: "Not today. The current training opt-out is `noarchive`, which also removes the page from Copilot. Microsoft is building a robots.txt no-training preference, targeted for early 2027, per Cloudflare's September 2026 announcement.",
    },
    {
      q: "Can Copilot read JavaScript-rendered pages?",
      a: "Bingbot renders pages with the latest stable Microsoft Edge, so it can. But Bing's guidelines tell sites not to hide critical content behind client-side rendering, and say content that can't be reliably rendered may not be indexed or selected for grounding.",
    },
    {
      q: "How do I see when Copilot cites my site?",
      a: "Use the AI Performance report in Bing Webmaster Tools. It shows citations, cited pages and the grounding queries behind them across Copilot, Bing's AI summaries and select partners, and since June 2026 your Citation Share per query. It doesn't show clicks.",
    },
    {
      q: "How do I track Copilot traffic in GA4?",
      a: "Copilot clicks arrive with a `copilot.microsoft.com` referrer, and GA4's AI Assistant channel names Copilot among its sources. Check where those sessions land and add a custom channel if they're in Referral. Clicks from Copilot Search in Bing arrive from bing.com and look like organic search.",
    },
    {
      q: "Can I pay to appear in Copilot's answers?",
      a: "Microsoft Advertising serves ads inside Copilot's responses, built automatically from eligible campaigns. Those are ads, not citations: Microsoft documents no paid route into the sources Copilot cites.",
    },
  ],

  sources: [
    {
      title: "Bing Webmaster Guidelines",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a",
    },
    {
      title: "Robots meta tags and attributes that Bing supports",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/robots-meta-tags-and-attributes-that-bing-supports-5198d240",
    },
    {
      title: "AI Performance in Bing Webmaster Tools",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c",
    },
    {
      title: "Which crawlers does Bing use?",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0",
    },
    {
      title: "How to verify Bingbot",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26",
    },
    {
      title: "Introducing AI Performance in Bing Webmaster Tools public preview",
      publisher: "Bing Webmaster Blog",
      href: "https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview",
    },
    {
      title: "New AI visibility insights: Intents, Topics, Citation Share, Compare",
      publisher: "Bing Search Blog",
      href: "https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare",
    },
    {
      title: "Evolving role of the index: from ranking pages to supporting answers",
      publisher: "Bing Search Blog",
      href: "https://blogs.bing.com/search/May-2026/Evolving-role-of-the-index-From-ranking-pages-to-supporting-answers",
    },
    {
      title: "Elevating the role of grounding on the AI web",
      publisher: "Bing Search Blog",
      href: "https://blogs.bing.com/search/February-2026/Elevating-the-Role-of-Grounding-on-the-AI-Web",
    },
    {
      title: "Introducing Copilot Search in Bing",
      publisher: "Bing Search Blog",
      href: "https://blogs.bing.com/search/April-2025/Introducing-Copilot-Search-in-Bing",
    },
    {
      title: "Transparency Note for Microsoft Copilot (for individuals)",
      publisher: "Microsoft Support",
      href: "https://support.microsoft.com/en-us/privacy/microsoft-copilot/transparency-note",
    },
    {
      title: "Data, privacy, and security for web search in Microsoft Copilot",
      publisher: "Microsoft Learn",
      href: "https://learn.microsoft.com/en-us/microsoft-365/copilot/manage-public-web-access",
    },
    {
      title: "Optimizing your content for inclusion in AI search answers",
      publisher: "Microsoft Advertising",
      href: "https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers",
    },
    {
      title: "About ads in Copilot",
      publisher: "Microsoft Learn",
      href: "https://learn.microsoft.com/en-us/advertising/msa-help/hlp_ba_conc_adsforcopilot",
    },
    {
      title: "IndexNow documentation",
      publisher: "IndexNow",
      href: "https://www.indexnow.org/documentation",
    },
    {
      title: "Have it both ways: stay discoverable in search while disallowing AI training",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/",
    },
    {
      title: "Only 12% of AI cited URLs rank in Google's top 10 for the original prompt",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "The 50 most-cited websites in Copilot",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/most-cited-domains-copilot/",
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
  ],

  sameAs: [
    "https://www.wikidata.org/wiki/Q116793893",
    "https://en.wikipedia.org/wiki/Microsoft_Copilot",
    "https://copilot.microsoft.com",
  ],

  furtherReading: [
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Build a robots.txt that keeps Bingbot in, repeats your generic rules correctly and makes deliberate calls on every other AI crawler.",
    },
    {
      title: "Citation tracking",
      href: "/features/citation-tracking",
      description:
        "Run a fixed prompt panel across Copilot, ChatGPT, Perplexity, Gemini and Google, and see who's cited instead of you.",
    },
    {
      title: "ChatGPT SEO guide",
      href: "/ai-seo/chatgpt",
      description:
        "Bing indexing and IndexNow matter for ChatGPT search too. Here's how ChatGPT's own crawler and fan-out queries fit in.",
    },
  ],
};
