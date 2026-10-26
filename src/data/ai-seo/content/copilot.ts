import type { EngineGuide } from "../types";

/*
 * Facts re-verified against Microsoft's own pages (Bing Webmaster Tools help
 * and blogs, Copilot help, Microsoft Learn) and IndexNow.org on 2026-10-26.
 * Brands in the illustration (Pipefolk, Quotaloft and the four domains) are
 * invented; none of the domains is registered.
 */
export const copilot: EngineGuide = {
  slug: "copilot",
  metaTitle: "Microsoft Copilot SEO: How to Get Cited Through Bing's Index",
  metaDescription:
    "How Microsoft Copilot picks sources from Bing's index: Bingbot, noarchive and nocache, IndexNow, Bing's AI Performance report and Copilot referrals in GA4. Checked October 2026.",
  keywords: [
    "Microsoft Copilot SEO",
    "get cited by Copilot",
    "Copilot citations",
    "does Copilot use Bing",
    "Bing AI Performance report",
    "Copilot noarchive nocache",
    "Bing AI Mode Copilot Search",
  ],
  headline: {
    lead: "Microsoft Copilot SEO:",
    accent: "the citation is decided in Bing's index",
  },
  subhead:
    "Copilot doesn't crawl your site. It asks Bing a few words at a time and cites what Bing's index can back up. This guide follows that path from prompt to citation, shows which meta tags switch Copilot off, and explains how to read the citations Microsoft reports back to you.",

  shortAnswer:
    "To get cited by Microsoft Copilot, get indexed and stay fresh in **Bing**. Copilot has no crawler of its own: it turns each question into a few-word Bing query and cites what Bing's index returns. Allow **Bingbot**, verify your site in Bing Webmaster Tools, ping **IndexNow** on every change, keep `noarchive` and `nocache` off the pages you want quoted, and put a self-contained answer near the top of each page.",

  takeaways: [
    "Copilot has no crawler of its own. It sends a few-word query to Bing and cites from Bing's index, so `Bingbot` and Bing indexing decide whether you're eligible.",
    "`noarchive` keeps a page out of Copilot answers and Microsoft's AI training while it stays in Bing search. `nocache` cuts Copilot to your URL, title and snippet.",
    "Copilot cites pages that answer its short grounding queries, not pages that rank for the user's sentence: only 16.6% of its citations ranked in Bing's top 10 for the prompt (Ahrefs, 2025).",
    "IndexNow is the fast lane. Bing says streaming IndexNow pings reduce outdated or incorrect URL references in Copilot responses.",
    "Bing Webmaster Tools' AI Performance report shows Copilot citations and the grounding queries behind them, with Topics Portfolio added in October 2026. It still shows no clicks.",
    "Clicks arrive from `copilot.microsoft.com` or `copilot.com`, host only. Copilot Search, now labelled AI Mode in Bing, sends traffic that looks like `bing.com` organic.",
  ],

  facts: [
    { label: "Where Copilot gets its web answers", value: "Bing's index" },
    { label: "The only crawler that matters", value: "Bingbot", mono: true },
    { label: "Out of Copilot, still in Bing search", value: "noarchive", mono: true },
    { label: "Microsoft's report of your Copilot citations", value: "AI Performance" },
  ],

  preview: {
    prompt: "Which CRM is easiest to set up for a five-person sales team?",
    status: "Searching the web",
    answer:
      "**Pipefolk** is the quickest to set up for a team of five: it imports contacts from a spreadsheet in one step, and its Starter plan covers five seats. Quotaloft forecasts in more depth but takes longer to configure.",
    sources: [
      {
        domain: "pipefolk.io",
        title: "Pipefolk pricing: the Starter plan for teams of up to five",
      },
      {
        domain: "crmfieldnotes.com",
        title: "The easiest CRMs to set up, tested on a real pipeline",
      },
      { domain: "crmbench.net", title: "Pipefolk vs Quotaloft for small sales teams" },
      { domain: "salesdeskguide.com", title: "CRM software for small teams, compared" },
    ],
  },

  profile: {
    retrieval:
      "Bing's index: Copilot sends a few-word grounding query to Bing and cites what comes back",
    searchCrawler: "Bingbot (Microsoft documents no Copilot user agent)",
    trainingCrawler: "None separate: noarchive opts out of training and Copilot answers together",
    rendersJs:
      "Bingbot renders with current Edge, but Bing says not to rely on client-side rendering",
    referrer:
      "copilot.microsoft.com or copilot.com, host only; Bing AI Mode clicks arrive as bing.com",
    citationStyle:
      "Clickable citations in the answer, sources listed below, Show all for every reference",
    biggestLever:
      "Be indexed and fresh in Bing: Webmaster Tools, IndexNow, no noarchive or nocache",
  },

  sections: [
    {
      id: "three-surfaces",
      title: "Three places Copilot answers, one index behind them",
      blocks: [
        {
          kind: "p",
          text: "Microsoft Copilot reaches people in three places a site owner should care about. Each shows sources a little differently and sends clicks under a different name, but all three take their web answers from the same place: Bing.",
        },
        {
          kind: "table",
          head: ["Surface", "Where it runs", "Sign-in", "How sources show", "Clicks arrive as"],
          rows: [
            [
              "**Copilot app**",
              "`copilot.com`, `copilot.microsoft.com` and the Windows, Mac and mobile apps",
              "Required since late August 2026",
              "Clickable citations in the answer, sources listed below it, **Show all** for the full list",
              "`copilot.microsoft.com` or `copilot.com` referral; the desktop and mobile apps are undocumented",
            ],
            [
              "**Copilot Search in Bing**",
              "`bing.com/copilotsearch`, now labelled **AI Mode** in Bing's tabs",
              "Not required",
              "Whole sentences or passages linked to their source, plus a list of every link used",
              "`bing.com`, indistinguishable from organic Bing clicks",
            ],
            [
              "**Copilot Chat** (work and school)",
              "Microsoft 365 apps and the Copilot app, signed in with a work account",
              "Work account",
              "Linked citations, plus the exact queries Copilot sent to Bing",
              "Not documented",
            ],
          ],
        },
        {
          kind: "p",
          text: "The consumer app now takes personal and work accounts in one place ([Microsoft Support, August 2026](https://support.microsoft.com/en-us/microsoft-365-copilot/learning/changes-microsoft-copilot-app)), and since the end of August Microsoft requires everyone using it to sign in, while Copilot Search on Bing still doesn't, per Microsoft staff quoted by [Search Engine Roundtable](https://www.seroundtable.com/microsoft-copilot-login-41975.html). Copilot Search itself launched on April 4, 2025, linking \"the entire sentence or passage\" to its source ([Bing](https://blogs.bing.com/search/April-2025/Introducing-Copilot-Search-in-Bing)). Since late September 2026 Bing's search tab and the page's own title read **AI Mode** instead, a change [first spotted as a test](https://www.seroundtable.com/bing-ai-mode-search-tabs-42165.html) and since seen everywhere. Microsoft hasn't announced the rename, and the page's description still calls it Copilot Search, so expect both names in reports and docs.",
        },
        {
          kind: "p",
          text: 'Underneath, Microsoft\'s documents agree. Copilot\'s [transparency note](https://support.microsoft.com/en-us/privacy/microsoft-copilot/transparency-note), updated August 18, 2026: "For certain conversations where users seek information, Copilot is grounded in web search results," and it "centers its response on high-ranking content from the web." The work-account docs name the service: the query goes to "the Bing search service." And Bing\'s [Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a): "Bing and Copilot search experiences rely on the same core crawling, indexing, and ranking foundation as traditional search."',
        },
        {
          kind: "stats",
          items: [
            {
              value: "1B",
              label:
                "Bing monthly active users, reached for the first time, per Microsoft's April 2026 earnings call",
              source: {
                name: "Microsoft, Apr 2026",
                href: "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q3",
              },
            },
            {
              value: "5.12%",
              label:
                "of US AI referral traffic came from Copilot in Jan–Apr 2026, fourth among assistants (3.51% worldwide)",
              source: {
                name: "SE Ranking, Jun 2026",
                href: "https://seranking.com/blog/ai-traffic-research-study/",
              },
            },
            {
              value: "3.13",
              label:
                "links per answer for Bing's Copilot, the fewest of four engines tested on 2,000 keywords (Feb–Mar 2025)",
              source: {
                name: "SE Ranking, Apr 2025",
                href: "https://seranking.com/blog/chatgpt-vs-perplexity-vs-google-vs-bing-comparison-research/",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Work done for Bing pays out beyond Copilot",
          text: '"Microsoft grounding powers nearly every major AI assistant in the market," Bing\'s Jordi Ribas wrote in [February 2026](https://blogs.bing.com/search/February-2026/Elevating-the-Role-of-Grounding-on-the-AI-Web), and in June Microsoft launched [Web IQ](https://blogs.bing.com/search/2026/6/Announcing-Microsoft-Web-IQ/), "a search engine for AI systems" built on "the Bing global index" that honors robots rules and publisher controls. Bing\'s AI Performance report counts citations from "select partner AI integrations" too. For how Bing figures in ChatGPT search, see the [ChatGPT guide](/ai-seo/chatgpt).',
        },
      ],
    },
    {
      id: "grounding-queries",
      title: "From prompt to grounding query: what Copilot actually searches",
      blocks: [
        {
          kind: "p",
          text: "Copilot doesn't paste the user's question into Bing. Microsoft's [web search documentation](https://learn.microsoft.com/en-us/microsoft-365/copilot/manage-public-web-access) says the query it sends \"consists of a few words informed by the user's prompt,\" and the full prompt goes only \"if the prompt is very short (for example, 'local weather').\" Those few words are what Bing calls a [grounding](/glossary/grounding) query, and they decide which pages Copilot can cite.",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Copilot decides the answer needs the web",
              body: "Information-seeking conversations are grounded in web search. Copilot also has a **Search** mode, and on work accounts IT can switch web search off for a whole tenant, while each user has a Web content toggle.",
            },
            {
              title: "It writes a few-word Bing query",
              body: 'Drawn from the prompt, shortened, sometimes several per answer. On work accounts, Copilot Chat\'s citation section shows "the exact web search queries" it sent to Bing.',
              lever:
                "Use the plain words such a query would contain in your titles and opening lines: the category, the task, the team size, the comparison.",
            },
            {
              title: "Bing retrieves content it can ground on",
              body: 'Grounding uses "the same crawlers, the same quality signals" as search, Bing wrote in [May 2026](https://blogs.bing.com/search/May-2026/Evolving-role-of-the-index-From-ranking-pages-to-supporting-answers), but asks a different question: "what information can an AI system responsibly use to construct a response?"',
              lever:
                "Be indexed, canonical and fresh in Bing: a sitemap with honest `lastmod`, and IndexNow on every change.",
            },
            {
              title: "Your robots meta tags set the depth",
              body: "`noarchive` keeps the page out of Copilot responses and grounding results. `nocache` limits Copilot to your URL, title and snippet.",
              lever: "Keep both off every page you want quoted.",
            },
            {
              title: "The answer links its sources",
              body: 'The transparency note says Copilot "provides hyperlinked citations following generated text responses." Since November 2025, **Show all** opens the full list of references.',
              lever:
                "Write titles that still say who you are and what the page answers when they appear alone in a source list.",
            },
          ],
        },
        {
          kind: "h3",
          text: "Why ranking for the prompt isn't the goal",
        },
        {
          kind: "p",
          text: "In [Ahrefs' study](https://ahrefs.com/blog/ai-search-overlap/) of 15,000 long-tail prompts (July 2025), 16.6% of the URLs Copilot cited ranked in Bing's top 10 for the prompt, 6.3% ranked lower, and 77.1% didn't rank for it at all. That's still the closest match to Bing of any assistant tested; Perplexity's unranked share was 80.5% and Gemini's 92.9%. Copilot cites pages that rank for its own short queries, not for the user's sentence.",
        },
        {
          kind: "p",
          text: "Here's the shape of it, with an invented CRM brand. The queries are illustrative; the format of the report row is Bing's.",
        },
        {
          kind: "code",
          lang: "text",
          code: "PROMPT (what the user typed)\n  Which CRM is easiest to set up for a five-person sales team?\n\nGROUNDING QUERIES (a few words each, written by Copilot)\n  easy crm setup small team\n  crm pricing 5 users\n  pipefolk vs quotaloft\n\nAI PERFORMANCE, LATER (Bing Webmaster Tools)\n  Grounding query   crm pricing 5 users\n  Cited page        https://pipefolk.io/pricing\n  Citations         +1",
        },
        {
          kind: "p",
          text: 'You can read real ones in two places. AI Performance\'s Grounding queries tab lists them as "grouped representations" that "are not full user questions or prompts." And if you have a work account, Copilot Chat prints the exact queries under its answers. One agency that published three months of its own AI Performance data (19,717 citations) found the queries "read like machine-generated retrieval queries" ([Search Influence](https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/), February 2026).',
        },
      ],
    },
    {
      id: "bingbot-only-door",
      title: "Bingbot is the only door in",
      blocks: [
        {
          kind: "p",
          text: 'Bing\'s [crawler list](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0) names five bots: `Bingbot`, `AdIdxBot`, `BingPreview`, `MicrosoftPreview` and `BingVideoPreview`. None of them is a Copilot fetcher. Vercel had to leave Copilot out of its [December 2024 crawler study](https://vercel.com/blog/the-rise-of-the-ai-crawler) because it "lacks a unique user agent for tracking," and Bing\'s removal help describes Copilot as experiences "that rely on Bing\'s index." Block Bingbot and you leave Bing and Copilot together.',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "Bingbot",
              role: "search",
              purpose:
                "Bing's standard crawler. It feeds the index behind Bing search, Copilot, Bing's AI summaries and its grounding partners, and renders pages with the latest stable Microsoft Edge.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "BingPreview",
              role: "other",
              purpose:
                "Generates page snapshots for Bing. Its documented user-agent strings are Bingbot's own, so the two can't be told apart in logs.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "MicrosoftPreview",
              role: "other",
              purpose:
                "Generates page snapshots for other Microsoft products, under its own `MicrosoftPreview` token.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "AdIdxBot",
              role: "other",
              purpose:
                "Microsoft Advertising's crawler, which checks ad landing pages. It matters only if you advertise, and Microsoft's ads can appear inside Copilot answers.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: 'One Bing quirk in [robots.txt](/glossary/robots-txt) catches people: "On finding a specific set of instructions for itself, Bingbot will ignore the directives listed in the generic section" ([Bing](https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec)). A `bingbot` group replaces `User-agent: *` for Bing, so repeat every generic rule in it. Changes "can take a few hours" to apply because Bing caches the file.',
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Bing's crawler: the only route into Copilot\nUser-agent: bingbot\nAllow: /\nDisallow: /cart/\nDisallow: /account/\n\n# A bingbot group replaces the * group for Bing,\n# so every generic rule is repeated above.\nUser-agent: *\nDisallow: /cart/\nDisallow: /account/\n\nSitemap: https://www.example.com/sitemap.xml",
        },
        {
          kind: "p",
          text: 'Rendering is less of a worry than with most AI engines: Bing says it updates its rendering engine "to the most recent stable version of Microsoft Edge." Its guidelines still tell you to avoid "hiding critical content behind client-side rendering," though, and warn that "content that cannot be reliably rendered may not be indexed or selected for grounding results." Treat JavaScript-only text as a risk, not a blocker.',
        },
        {
          kind: "p",
          text: 'Firewalls are the more common failure. Since [September 15, 2026](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/), Cloudflare\'s **Block** setting for AI crawlers also stops Bingbot, "search included." Before you allowlist Bingbot anywhere, [verify it](https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26): reverse-resolve the IP to a host ending in `search.msn.com`, then resolve that host back to the same IP, or match against [bingbot.json](https://www.bing.com/toolbox/bingbot.json), which Bing says to refresh daily.',
        },
        {
          kind: "code",
          lang: "bash",
          code: '# 1. Is the key sentence in the HTML Bingbot downloads?\ncurl -s -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \\\n  https://yoursite.com/pricing | grep -c "Starter plan"\n\n# 2. Is anything telling Copilot to stay away?\ncurl -sI https://yoursite.com/pricing | grep -i "x-robots-tag"\ncurl -s https://yoursite.com/pricing | grep -ioE \'<meta[^>]+(robots|bingbot)[^>]*>\'\n\n# 3. Is that "Bingbot" in your logs real? Expect *.search.msn.com,\n#    then check the host resolves back to the same IP.\nhost 157.55.39.1\n\n# 0 in step 1 = client-rendered text or a WAF challenge. Fix it.',
        },
      ],
    },
    {
      id: "meta-tag-dial",
      title: "noarchive, nocache and the other dials on Copilot",
      blocks: [
        {
          kind: "p",
          text: 'Robots.txt decides whether Bingbot fetches a page. What Copilot may do with a page Bing has indexed is set by Bing\'s [robots meta tags](https://www.bing.com/webmasters/help/robots-meta-tags-and-attributes-that-bing-supports-5198d240). Each works as a meta tag or an `X-Robots-Tag` header, and writing `name="bingbot"` instead of `name="robots"` scopes it to Bing alone. Bing documents a Copilot effect for most of them:',
        },
        {
          kind: "table",
          head: ["Directive", "Bing search", "Copilot answers", "Microsoft AI training"],
          rows: [
            ["`noindex`", "Removed", "Removed", "Not used"],
            [
              "`noarchive`",
              "Stays; no cached copy",
              '"Do not link in Chat and Copilot"',
              "Not used",
            ],
            [
              "`nocache`",
              "Stays; no cached copy",
              "URL, title and snippet only",
              "URL, title and snippet only",
            ],
            [
              "`nosnippet`",
              "No description shown",
              '"May limit Copilot citation quality"',
              "Not documented",
            ],
            [
              "`data-nosnippet`",
              "Marked text still indexed and ranked",
              "Marked text left out of AI summaries",
              "Not documented",
            ],
          ],
        },
        {
          kind: "code",
          lang: "html",
          code: '<!-- Out of Copilot answers and Microsoft AI training; stays in Bing search -->\n<meta name="bingbot" content="noarchive">\n\n<!-- Copilot may show only your URL, title and snippet -->\n<meta name="bingbot" content="nocache">\n\n<!-- Keep one passage out of snippets and AI summaries -->\n<div data-nosnippet>Internal pricing notes</div>\n\n<!-- The same rule as a response header, for PDFs and other files -->\nX-Robots-Tag: bingbot: noarchive',
        },
        {
          kind: "p",
          text: 'Three details trip people up. A page with both `nocache` and `noarchive` "will be treated as NOCACHE," so it stays in Copilot at snippet depth. `noindex` only works if Bingbot can read it, so "do not block access to the page" in robots.txt. And the `data-nosnippet` rows come from Bing\'s [October 2025 announcement](https://blogs.bing.com/webmaster/2025/10/Bing-Introduces-Support-for-the-data-nosnippet-HTML-Attribute/): marked text "will be excluded from snippets and AI summaries" but is "still indexed normally." See [snippet controls](/glossary/snippet-controls) for how these compare with Google\'s.',
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Opting out of training currently means opting out of Copilot",
          text: "Bing has no training-only crawler, so no robots.txt line separates training from search. Today's opt-out is `noarchive`, which also removes the page from Copilot answers. Per [Cloudflare's September 15, 2026 post](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/), Microsoft is building a robots.txt \"no training\" preference, \"targeted for early 2027,\" and until it ships, Cloudflare's **Disallow AI Training** setting conveys nothing to Bing. Microsoft hasn't published that timeline itself.",
        },
        {
          kind: "p",
          text: "Audit templates, not just pages. Paywalls, member areas and some CMS themes add `noarchive` site-wide, and a header set at the CDN won't show up in your page source. Check both before assuming Copilot has simply passed you over.",
        },
      ],
    },
    {
      id: "indexnow-fast-lane",
      title: "IndexNow: the fast lane between your CMS and Copilot",
      blocks: [
        {
          kind: "p",
          text: 'Freshness matters more to Copilot than to a results page. "In grounding, a stale fact produces a misleading response," Bing wrote in May 2026, and its guidelines say timely [IndexNow](/glossary/indexnow) submissions "reduce outdated or incorrect URL references in Copilot responses and grounding results." They add a detail most setups miss: "Avoid batch submissions when possible. Streaming submissions provide faster updates." Ping as each change happens, not in a nightly job.',
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Verify your site in [Bing Webmaster Tools](https://www.bing.com/webmasters).** You can import sites already verified in Google Search Console. AI Performance, URL Inspection and the IndexNow report all live there.",
            '**Submit a sitemap with honest `lastmod`.** Bing wants ISO 8601 date and time reflecting "the true last modification time of the page content," revisits sitemaps "at least once per day," and takes up to 50,000 URLs per file ([Bing, July 2025](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)). List canonical URLs only.',
            "**Host an IndexNow key and ping on every add, update and delete.** Many CMSs and CDNs have it built in; otherwise it's one POST per change, shown below.",
            "**Read the IndexNow report.** It shows URLs submitted, crawled and indexed, and lists **Important URLs Missed**: pages Bing indexed that never came through IndexNow ([Bing](https://www.bing.com/webmasters/help/indexnow-0z209wby)).",
            "**Check key pages in URL Inspection.** Confirm the answer is in what Bingbot fetches, not behind a tab, a click or a script.",
            '**Send freshness signals too.** Bing says accurate `lastmod` values and HTTP validators such as ETags "help Bing detect content changes more reliably."',
          ],
        },
        {
          kind: "p",
          text: 'IndexNow is an open protocol, not a Bing API. A submission is "automatically shared with all other participating search engines" ([IndexNow](https://www.indexnow.org/documentation)), currently Bing, Yandex, Seznam, Naver, Yep, the Internet Archive and Amazonbot. Host the key as a text file at your root, then POST changes as they happen:',
        },
        {
          kind: "code",
          lang: "http",
          code: 'POST https://www.bing.com/indexnow\nContent-Type: application/json; charset=utf-8\n\n{\n  "host": "www.example.com",\n  "key": "3f6c9a1e2b7d4c58",\n  "keyLocation": "https://www.example.com/3f6c9a1e2b7d4c58.txt",\n  "urlList": [\n    "https://www.example.com/pricing",\n    "https://www.example.com/blog/new-post"\n  ]\n}\n\n# Up to 10,000 URLs per POST. A single URL can go as a GET:\n# https://www.bing.com/indexnow?url=<url>&key=<key>\n# 200 = OK, 202 = key validation pending, 403 = key not valid,\n# 422 = URL not on this host, 429 = too many requests.',
        },
        {
          kind: "h3",
          text: "Correcting or removing a page Copilot cites",
        },
        {
          kind: "p",
          text: 'Wrong facts in a Copilot answer usually trace back to a stale page. Fix the page, update `lastmod`, and send it through IndexNow. To take a page out entirely, return a 404 or 410 or add `noindex`, then ping it. Bing\'s [Block URLs](https://www.bing.com/webmasters/help/block-urls-264e560b) tool hides a URL "for 90 days" while that takes effect, and its [removal help](https://www.bing.com/webmasters/help/how-to-permanently-remove-a-url-or-page-from-bing-or-copilot-37c07477) covers Copilot experiences "that rely on Bing\'s index."',
        },
      ],
    },
    {
      id: "groundable-pages",
      title: "Writing pages Bing will ground on",
      blocks: [
        {
          kind: "p",
          text: 'Microsoft is unusually specific about what grounding prefers. Its guidelines devote a run of sections to content that is "easy to understand without external context," and its advertising team published a [companion guide](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers) in October 2025. The independent data adds a twist: Copilot\'s citations lean hard toward retailers and reference sites.',
        },
        {
          kind: "signals",
          items: [
            {
              title: "Facts that stand on their own",
              body: '"URLs are more likely to be selected for grounding queries and citations when content stands on its own." Microsoft Advertising adds that assistants like Copilot break pages into "smaller, structured pieces" and favor "sentences that make sense even when pulled out of context."',
              evidence: "official",
            },
            {
              title: "Answer first, one topic per URL",
              body: '"Place essential information near the top" and avoid "long introductions." URLs "focused on a primary topic are more likely to be selected for grounding results."',
              evidence: "official",
            },
            {
              title: "Unambiguous entities",
              body: '"Clear entity definition improves grounding visibility and citation accuracy." Name the same product, company and people the same way in text, image alt text and schema. More in [entity SEO](/glossary/entity-seo).',
              evidence: "official",
            },
            {
              title: "Nothing hidden that matters",
              body: 'Microsoft Advertising warns "AI systems may not render hidden content" in tabs and expanders, and thin, "ad heavy, or affiliate-only URLs may lose ranking eligibility and grounding visibility."',
              evidence: "official",
            },
            {
              title: "Titles and descriptions count",
              body: '"Missing, duplicate, or overly short title tags and meta descriptions may reduce" eligibility for grounding results and citations. Duplicate URLs "reduce Bing\'s confidence in selecting a URL for grounding results or citations."',
              evidence: "official",
            },
            {
              title: "Retail and reference sites dominate",
              body: "In [Ahrefs' September 2026 snapshot](https://ahrefs.com/blog/most-cited-domains-copilot/) of 3M+ US queries, Amazon took 16.8% of the citations shared among Copilot's 50 most-cited domains, Walmart 12.6% and Wikipedia 7.6%. YouTube had 1.9%; Reddit wasn't in the top 50.",
              evidence: "observed",
            },
            {
              title: "Small sites still get in",
              body: "Three of those 50 domains have an Ahrefs Domain Rating under 10. Matching the grounding query seems to count for more than domain strength, which is good news for a focused site.",
              evidence: "our-read",
            },
            {
              title: "A different race from Google",
              body: "Bing's Copilot shared just 9.81% of its cited domains with Google's AI Overviews, the lowest overlap SE Ranking measured in early 2025. Winning in Google doesn't carry over by default.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "h3",
          text: "What gets a site demoted",
        },
        {
          kind: "p",
          text: 'Bing\'s guidelines, [rewritten in February 2026](https://www.searchenginejournal.com/bing-adds-geo-to-official-guidelines-expands-ai-abuse-definitions/568442/), now carry a "Prompt Injection and AI Manipulation" section: "Attempts to add content designed to manipulate or interfere with language models used by Bing or Copilot may result in reduced visibility or removal from search experiences." Content made "to manipulate ranking systems or trigger citations or AI responses," large-scale content without oversight, and cloaking are on the same list. Bing also says plainly that "GEO does not guarantee grounding or citations in AI experiences."',
        },
      ],
    },
    {
      id: "ai-performance-report",
      title: "Bing's AI Performance report: Copilot's citation receipts",
      blocks: [
        {
          kind: "p",
          text: 'Most AI engines never tell you when they cite you. Microsoft does. Bing Webmaster Tools\' [AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) report launched in public preview on [February 10, 2026](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview), gained Intents, Topics, Citation Share and Compare on [June 16](https://blogs.bing.com/search/June-2026/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare), and added a **Topics Portfolio** beta on [October 13](https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/). It covers "Microsoft Copilot; AI-generated summaries in Bing; Select partner AI integrations," pooled together.',
        },
        {
          kind: "table",
          head: ["View", "What it shows", "Read it with care"],
          rows: [
            [
              "**Citations and pages**",
              "Total citations, cited pages and average cited pages per day, over 7 days, 30 days, 3 months or a custom range. Refreshed daily; CSV and Excel export.",
              '"The data shown represents a sample." Very low activity may not surface, and totals can differ between views.',
            ],
            [
              "**Grounding queries**",
              "The phrases Copilot searched when it retrieved a page it cited, mapped both ways: query to pages, page to queries.",
              "Grouped phrases, not prompts. You can filter by one query or one page at a time, not both.",
            ],
            [
              "**Intents, Topics, Compare** (preview)",
              "Each grounding query labelled by intent (Informational, Commercial, Comparison, Local and more), clustered into topics, and compared across periods.",
              "Labels are Microsoft's classification, not the user's words.",
            ],
            [
              "**Citation Share** (preview)",
              "Your relative presence among the sites cited for a grounding query.",
              'It "does not expose competitor domain names" and isn\'t traffic share.',
            ],
            [
              "**Topics Portfolio** (beta)",
              'Topic Size (approximate citations across all sites), Sites Cited, Queries, and **Top Opportunity Queries** where "other sites appear and yours does not."',
              '"Directional signals for planning, not as a precise ledger." Shown only with enough data for your site.',
            ],
          ],
        },
        {
          kind: "p",
          text: 'What it never shows is traffic. A citation "does not represent traffic, clicks, or user engagement," says the help page, and you can\'t tell whether Copilot, a Bing AI summary or a partner cited you.',
        },
        {
          kind: "h3",
          text: "A monthly routine with the report",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Export grounding queries and pages** for the last 30 days, and keep each month's file. Sampling makes month-to-month comparisons more useful than any single number.",
            "**Map each query to the page you want cited.** Where Copilot cites a weaker page for a query, strengthen the right one and link it from the weaker one.",
            "**Work the Opportunity Queries.** For each, check you have one page whose opening lines answer it in the query's own words. If not, that's your next brief.",
            "**Republish and ping IndexNow** for every page you change, then watch whether it appears under the target query over the next few weeks.",
            "**Read Citation Share on the queries that matter commercially**, not on everything. Intent labels help you find them.",
          ],
        },
        {
          kind: "p",
          text: "Expect swings. In the Search Influence data, one page earned 69% of all citations, and daily citations fell from about 1,520 in early December to 34 by February. That's one site, but it's a fair warning against reading a single week as a trend.",
        },
      ],
    },
    {
      id: "copilot-referrals",
      title: "Copilot clicks in GA4, Clarity and your logs",
      blocks: [
        {
          kind: "p",
          text: "Copilot has passed a `copilot.microsoft.com` referrer [since at least March 2024](https://www.seroundtable.com/google-august-2024-core-update-37133.html). As of October 2026 the web app also runs at `copilot.com`, which `copilot.microsoft.com` names as its canonical host, and both send a host-only referrer (`origin-when-cross-origin` and `strict-origin-when-cross-origin` policies). Expect either hostname as the source, never the conversation URL. Clicks from Bing's AI Mode, Copilot Search, carry `bing.com` and land with your organic Bing traffic.",
        },
        {
          kind: "table",
          head: ["Where to look", "What you can see", "What you can't"],
          rows: [
            [
              "**GA4**",
              'The AI Assistant channel, defined as visits "from sources like ChatGPT, Gemini, Deepseek, Copilot, or Grok," with medium `ai-assistant`.',
              "Google hasn't published which referrer hosts it matches. Copilot Search clicks show up as Bing organic.",
            ],
            [
              "**Bing Webmaster Tools, Search Performance**",
              'Clicks from "Learn more links in the Chat response," counted in the **Web and Chat** source since March 24, 2023.',
              "Whether that covers today's Copilot app; Microsoft doesn't say. No keyword or page detail for Chat.",
            ],
            [
              "**Microsoft Clarity**, AI Visibility › Citations",
              "Page citations, share of authority, the share of sessions from AI assistants, and grounding queries. Generally available since May 13, 2026.",
              "Which AI surfaces are counted. It may require verifying the domain in Bing Webmaster Tools or Search Console.",
            ],
            [
              "**Server logs**",
              "How often Bingbot recrawls the pages you want cited, and whether it gets clean 200s.",
              "Any Copilot-specific request. There's no Copilot user agent to look for.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Check where `copilot` sessions land in GA4. If any sit in Referral, add a custom channel above it that matches both hosts. Clicks from the Windows and mobile apps aren't documented, so expect some in Direct. More on reading [AI referral traffic](/glossary/ai-referral-traffic).",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source: Copilot, either host\n^(www\\.)?copilot\\.(microsoft\\.)?com$\n\n# Session source: the major AI assistants together\ncopilot\\.microsoft\\.com|copilot\\.com|chatgpt\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com",
        },
        {
          kind: "p",
          text: 'Clicks will understate Copilot. Bing\'s guidelines say content "may appear as impressions, citations, or grounding references in Copilot responses," and that "a decline in clicks does not always indicate a loss of visibility." Read GA4 next to AI Performance, and use your logs to confirm the plumbing: a fresh Bingbot hit after an IndexNow ping means Copilot\'s source of truth has your update.',
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Bingbot hits per page, most-crawled first\ngrep -i "bingbot" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20\n\n# When did Bingbot last fetch the page you just pinged?\ngrep -i "bingbot" access.log | grep " /pricing " | tail -1',
        },
      ],
    },
    {
      id: "copilot-misconceptions",
      title: "Six Copilot assumptions that cost people citations",
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
              myth: "Ranking in Bing for the question is what gets you cited.",
              reality:
                "Only 16.6% of Copilot's cited URLs ranked in Bing's top 10 for the original prompt in Ahrefs' data. Copilot searches its own short queries, and AI Performance shows you which.",
            },
            {
              myth: "noarchive is a harmless AI-training opt-out.",
              reality:
                "It also keeps the page out of Copilot answers and grounding results. Until Microsoft's robots.txt no-training preference arrives, reportedly in early 2027, you can't opt out of training and stay in Copilot.",
            },
            {
              myth: "Copilot Search is gone now that Bing's tab says AI Mode.",
              reality:
                "The page still runs at `bing.com/copilotsearch`, and its own description still calls it Copilot Search. The label changed; the Bing grounding behind it didn't, and its clicks still arrive as `bing.com`.",
            },
            {
              myth: "AI Performance tells you how much traffic Copilot sends.",
              reality:
                'It counts citations, sampled and pooled across Copilot, Bing\'s AI summaries and partners. Microsoft says a citation "does not represent traffic, clicks, or user engagement." Traffic lives in GA4.',
            },
            {
              myth: "Buying Microsoft ads gets you cited.",
              reality:
                "Ads in Copilot are separate placements \"automatically created using your campaign's existing assets,\" and advertisers can't opt out of them ([Microsoft Learn](https://learn.microsoft.com/en-us/advertising/msa-help/hlp_ba_conc_adsforcopilot)). Nothing Microsoft publishes describes a paid route into organic citations.",
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
      title: "Check CDN and firewall rules for Bingbot",
      detail:
        "Cloudflare's **Block** setting now stops Bingbot, search included. Verify hits by reverse DNS to `search.msn.com` or against `bingbot.json`.",
      impact: "high",
    },
    {
      id: "verify-bwt",
      title: "Verify your site in Bing Webmaster Tools",
      detail:
        "Import from Google Search Console if you're verified there. AI Performance, URL Inspection and the IndexNow report all depend on it.",
      impact: "high",
    },
    {
      id: "meta-audit",
      title: "Audit noarchive and nocache, including headers",
      detail:
        "Remove them from every page you want quoted, including paywall and CMS templates that add them by default, and `X-Robots-Tag` headers set at the CDN.",
      impact: "high",
    },
    {
      id: "indexnow",
      title: "Turn on IndexNow, streaming",
      detail:
        "Ping each publish, update and deletion as it happens rather than in batches. One submission reaches every participating engine.",
      impact: "high",
    },
    {
      id: "sitemap-lastmod",
      title: "Submit a sitemap with honest lastmod",
      detail:
        "Canonical URLs only, ISO 8601 date and time, and the real last change to the content, not the last deploy.",
      impact: "medium",
    },
    {
      id: "live-url",
      title: "Inspect your key pages as Bingbot sees them",
      detail:
        "Confirm the answer is in the fetched HTML, not only after client-side rendering, a tab or a click.",
      impact: "high",
    },
    {
      id: "answer-first",
      title: "Lead each page with a self-contained answer",
      detail:
        "One topic per URL, the key fact in the opening lines, in the words a few-word Bing query would use.",
      impact: "high",
    },
    {
      id: "entities-titles",
      title: "Fix titles, descriptions and entity names",
      detail:
        "Unique titles and meta descriptions, one canonical URL per page, and the same product and company names everywhere.",
      impact: "medium",
    },
    {
      id: "training-decision",
      title: "Decide on AI training deliberately",
      detail:
        "`noarchive` opts out of Microsoft's training and Copilot together. Use it only where leaving Copilot is acceptable, and revisit when the robots.txt preference ships.",
      impact: "medium",
    },
    {
      id: "test-prompts",
      title: "Run your buyers' questions in Copilot and Bing's AI Mode",
      detail:
        "Signed in, in both places. Note who gets cited and which page of yours, if any. With a work account, read the exact queries Copilot Chat prints.",
      impact: "medium",
    },
    {
      id: "ai-performance",
      title: "Review AI Performance monthly",
      detail:
        "Export grounding queries, map each to a target page, and turn Topics Portfolio's Opportunity Queries into briefs.",
      impact: "medium",
    },
    {
      id: "ga4-channel",
      title: "Set up Copilot measurement in GA4",
      detail:
        "Confirm `copilot.microsoft.com` and `copilot.com` sessions land in AI Assistant; if not, add a custom channel above Referral.",
      impact: "medium",
    },
    {
      id: "bing-places",
      title: "Local businesses: keep Bing Places current",
      detail:
        "Microsoft points local businesses to Bing Places for Business to keep address, hours and contact details eligible for AI answers.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Microsoft Copilot?",
      a: "Get indexed and stay fresh in Bing: allow `Bingbot`, verify your site in Bing Webmaster Tools, submit a sitemap and ping IndexNow on every change. Keep `noarchive` and `nocache` off pages you want quoted, and open each page with a self-contained answer in the plain words a short search query would use.",
    },
    {
      q: "Does Microsoft Copilot use Bing?",
      a: "Yes. Microsoft's documentation says Copilot sends a query of a few words to the Bing search service, and Bing's guidelines say Copilot relies on the same crawling, indexing and ranking foundation as Bing search. That covers the Copilot app, Copilot Chat for work and Copilot Search in Bing.",
    },
    {
      q: "Does Copilot have its own crawler or user agent?",
      a: "Not one Microsoft documents. Bing's crawler list has no Copilot bot, and Vercel's crawler study excluded Copilot because it lacks a unique user agent. Allowing `Bingbot` is what makes you eligible.",
    },
    {
      q: "What's the difference between noarchive and nocache for Copilot?",
      a: "`noarchive` keeps a page out of Copilot answers entirely while it stays in Bing search. `nocache` lets Copilot use only your URL, title and snippet. A page with both is treated as `nocache`. `noindex` removes it from Bing and Copilot altogether.",
    },
    {
      q: "Can I opt out of Microsoft's AI training but stay in Copilot?",
      a: "Not today. The current training opt-out is `noarchive`, which also removes the page from Copilot. Cloudflare reported in September 2026 that Microsoft is building a robots.txt no-training preference targeted for early 2027.",
    },
    {
      q: "Is Copilot Search in Bing now called AI Mode?",
      a: "Bing's search tab and the page title have read AI Mode since late September 2026, while the page at bing.com/copilotsearch still describes itself as Copilot Search. Microsoft hasn't announced a rename. Either way, it's grounded in Bing and its clicks arrive as bing.com.",
    },
    {
      q: "How do I see when Copilot cites my site?",
      a: "Use the AI Performance report in Bing Webmaster Tools. It shows citations, cited pages and the grounding queries behind them across Copilot, Bing's AI summaries and select partners, plus Citation Share and, since October 2026, a Topics Portfolio beta with opportunity queries.",
    },
    {
      q: "Does Bing Webmaster Tools show clicks from Copilot?",
      a: "Not as a Copilot report. AI Performance counts citations, which Microsoft says don't represent clicks. Search Performance has counted Learn more links in Chat under Web and Chat since 2023, but Microsoft doesn't say whether that includes today's Copilot app. Use GA4 for clicks.",
    },
    {
      q: "How do I track Copilot traffic in GA4?",
      a: "Copilot clicks arrive with a `copilot.microsoft.com` or `copilot.com` referrer, host only, and GA4's AI Assistant channel names Copilot among its sources. Check where those sessions land and add a custom channel if they're in Referral. Clicks from Copilot Search in Bing look like Bing organic traffic.",
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
      title: "How to create a robots.txt file",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec",
    },
    {
      title: "IndexNow in Bing Webmaster Tools",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/indexnow-0z209wby",
    },
    {
      title: "Block URLs",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/block-urls-264e560b",
    },
    {
      title: "How to permanently remove a URL or page from Bing or Copilot",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/how-to-permanently-remove-a-url-or-page-from-bing-or-copilot-37c07477",
    },
    {
      title: "Search Performance",
      publisher: "Bing Webmaster Tools",
      href: "https://www.bing.com/webmasters/help/search-performance-c680da36",
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
      title: "Introducing Topics Portfolio (Beta) in AI Performance",
      publisher: "Bing Webmaster Blog",
      href: "https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/",
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
      title: "Announcing Microsoft Web IQ",
      publisher: "Bing Search Blog",
      href: "https://blogs.bing.com/search/2026/6/Announcing-Microsoft-Web-IQ/",
    },
    {
      title: "Bing introduces support for the data-nosnippet HTML attribute",
      publisher: "Bing Webmaster Blog",
      href: "https://blogs.bing.com/webmaster/2025/10/Bing-Introduces-Support-for-the-data-nosnippet-HTML-Attribute/",
    },
    {
      title: "Keeping content discoverable with sitemaps in AI-powered search",
      publisher: "Bing Webmaster Blog",
      href: "https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/",
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
      title: "Copilot app updates for personal, work, and school accounts",
      publisher: "Microsoft Support",
      href: "https://support.microsoft.com/en-us/microsoft-365-copilot/learning/changes-microsoft-copilot-app",
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
      title: "Citations now generally available",
      publisher: "Microsoft Clarity",
      href: "https://clarity.microsoft.com/blog/?p=10305",
    },
    {
      title: "Earnings release FY26 Q3",
      publisher: "Microsoft Investor Relations",
      href: "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q3",
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
      title: "ChatGPT vs Perplexity vs Google vs Bing: comparison research",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/chatgpt-vs-perplexity-vs-google-vs-bing-comparison-research/",
    },
    {
      title: "Inside Bing's new AI Performance report: what 20,000 Copilot citations taught us",
      publisher: "Search Influence",
      href: "https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "Bing adds GEO to official guidelines, expands AI abuse definitions",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/bing-adds-geo-to-official-guidelines-expands-ai-abuse-definitions/568442/",
    },
    {
      title: "Microsoft Copilot gets AI search with better links and citations",
      publisher: "Search Engine Roundtable",
      href: "https://www.seroundtable.com/microsoft-coplilot-ai-search-citations-40400.html",
    },
    {
      title: "Bing tests replacing Copilot with AI Mode in search tabs",
      publisher: "Search Engine Roundtable",
      href: "https://www.seroundtable.com/bing-ai-mode-search-tabs-42165.html",
    },
    {
      title: "Microsoft forcing Copilot users to login but not for Copilot Search answers",
      publisher: "Search Engine Roundtable",
      href: "https://www.seroundtable.com/microsoft-copilot-login-41975.html",
    },
    {
      title: "New Microsoft Copilot referrer data in Google Analytics",
      publisher: "Search Engine Roundtable",
      href: "https://www.seroundtable.com/google-august-2024-core-update-37133.html",
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
        "Build a robots.txt that keeps Bingbot in, repeats your generic rules in its group and makes a deliberate call on every other AI crawler.",
    },
    {
      title: "AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "Paste a slice of your access log to see which bots fetch which pages, including how often Bingbot comes back after an update.",
    },
    {
      title: "ChatGPT SEO guide",
      href: "/ai-seo/chatgpt",
      description:
        "Bing indexing and IndexNow matter for ChatGPT search too. Here's how OpenAI's own crawlers and query fan-out fit in.",
    },
    {
      title: "What is IndexNow?",
      href: "/glossary/indexnow",
      description:
        "The open protocol behind Copilot's fast lane: how a single ping reaches Bing and the other participating engines.",
    },
  ],
};
