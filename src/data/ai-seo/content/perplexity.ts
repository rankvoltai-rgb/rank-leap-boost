import type { EngineGuide } from "../types";

/*
 * Facts verified against Perplexity's own docs, help center and blog, and the
 * cited studies, on 2026-10-26. The answer UI described in "citation-anatomy"
 * (claim chips, the paging source card, the Links tab) and the referrer policy
 * in "analytics" were checked in the live web app on the same day.
 */
export const perplexity: EngineGuide = {
  slug: "perplexity",
  metaTitle: "Perplexity SEO (2026): How Perplexity Picks and Cites Sources",
  metaDescription:
    "How Perplexity's own index ranks passages, what PerplexityBot and Perplexity-User obey, source labels, Comet agents, shopping, publisher pay and the referrer you'll see.",
  keywords: [
    "Perplexity SEO",
    "how does Perplexity choose sources",
    "get cited by Perplexity",
    "PerplexityBot robots.txt",
    "Perplexity-User",
    "Perplexity source labels",
    "Perplexity referral traffic GA4",
  ],
  headline: { lead: "Perplexity SEO:", accent: "how pages get cited, sentence by sentence" },
  subhead:
    "Perplexity runs its own index, ranks passages rather than pages, and pins every claim in an answer to the sources behind it. Here's what decides which passage earns the citation, checked against Perplexity's own docs in October 2026.",

  shortAnswer:
    "To get cited by Perplexity, allow **PerplexityBot** in robots.txt, serve your text as server-rendered HTML, and write sections that answer one question in their first sentence, with names, numbers and a real date. Perplexity searches its own index of more than 200 billion URLs, splits pages into self-contained passages, reranks them for each question, and attaches every claim in its answer to the passages it drew on.",

  takeaways: [
    "Perplexity searches **its own index** of 200B+ URLs, not Google's, and retrieves and ranks **passages**. One strong section can be cited even when the rest of the page isn't.",
    "Each claim in an answer carries a source chip, and hovering it pages through the sources behind that claim. The API keeps the numbering: `[1][3]` markers point at search results that each carry a `date` and `last_updated`.",
    '`PerplexityBot` obeys robots.txt. `Perplexity-User`, which fetches a page when someone asks, "generally ignores" it, and a blocked page can still appear as its domain, headline and a brief summary.',
    "Some citations now carry a shield: **Government**, **Academic** or **Trusted**. Labels apply to whole domains, come from a review of corrections, bylines and ad separation, and can't be bought.",
    "Clicks arrive with the bare `https://www.perplexity.ai/` origin as referrer and no UTM tags. GA4's AI Assistant channel doesn't name Perplexity; its Source group dimension does.",
    "Comet's assistant works inside the user's own browser, shopping checks out through PayPal with the retailer as merchant of record, and publishers are paid through Comet Plus while Perplexity winds its ads down.",
  ],

  facts: [
    { label: "URLs tracked by its own index", value: "200B+" },
    { label: "The crawler to allow for search", value: "PerplexityBot", mono: true },
    { label: "The referrer your analytics receives", value: "perplexity.ai", mono: true },
    { label: "Of its cited URLs also rank in Google's top 10", value: "28.6%" },
  ],

  /* The answer carries the same [n] markers the Agent API returns, so the
     page can map each claim to its numbered sources. Real sources, real
     facts: this is what Perplexity's own docs say. */
  preview: {
    prompt: "Can I stop Perplexity from using my site?",
    status: "Finished 6s",
    answer:
      "Disallow **PerplexityBot** in robots.txt and Perplexity won't index your page text, though it may still show your domain, headline and a brief summary.[2][1] Live fetches work differently: Perplexity-User acts for the person asking and generally ignores robots.txt.[3][1]",
    sources: [
      { domain: "docs.perplexity.ai", title: "Perplexity Crawlers" },
      { domain: "perplexity.ai", title: "How does Perplexity follow robots.txt?" },
      {
        domain: "blog.cloudflare.com",
        title: "Perplexity is using stealth, undeclared crawlers to evade no-crawl directives",
      },
    ],
  },

  profile: {
    retrieval:
      "Its own 200B+ URL index: keyword and semantic retrieval, then passage-level reranking",
    searchCrawler: "PerplexityBot; Perplexity-User fetches pages live for users",
    trainingCrawler: "None: Perplexity says PerplexityBot isn't used to train foundation models",
    rendersJs: "No: independent tests found client-rendered pages unreadable",
    referrer: "www.perplexity.ai, origin only, no UTM; usually Referral in GA4",
    citationStyle:
      "A source chip after each claim (site name, +N) and a sources panel; API uses [1] markers",
    biggestLever:
      "Self-contained, dated passages in server-rendered HTML, each answering one question",
  },

  sections: [
    {
      id: "own-index",
      title: "Perplexity searches its own index, one passage at a time",
      blocks: [
        {
          kind: "p",
          text: 'Perplexity began on third-party search APIs and replaced them, its September 2025 [architecture write-up](https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api) explains, because they were costly, stale or slow, and returned whole documents when a model needs the one paragraph that answers. Its own index now tracks "over 200 billion unique URLs" and serves Perplexity\'s apps, Comet and its developer APIs alike. Each stage below comes from that document, with what you control at each one.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "A model decides when each URL is recrawled",
              body: "An ML model predicts whether a URL needs indexing and when, weighing how important it is and how often it's likely to change. Documents from authoritative domains and under-covered topics get priority for fast storage.",
              lever:
                "Update pages on a real cadence and cover the questions competitors skip: importance and change frequency are what the scheduler weighs.",
            },
            {
              title: "Pages are parsed into self-contained spans",
              body: "A content-understanding module extracts the meaningful text with rules adapted per site; list- and table-heavy sites get more formulaic parsing. Each document is then split into spans that are retrieved and ranked on their own at query time.",
              lever:
                "Make every section make sense in isolation, and put specs, prices and comparisons in real HTML tables.",
            },
            {
              title: "Keyword and semantic retrieval run together",
              body: "The index is queried lexically and by embeddings in parallel, and the two result sets merge into one broad candidate pool.",
              lever:
                "Use the exact terms buyers type, such as product names, model numbers and units, inside natural explanation.",
            },
            {
              title: "Stale and off-topic candidates are dropped",
              body: "Prefilters remove clearly non-responsive or stale content before any expensive scoring. Every result Perplexity's API returns carries a `date` and a `last_updated` field, and developers can filter on both.",
              lever:
                "Show a visible published and updated date, mirror them in `datePublished` and `dateModified`, and change them only when the content changes.",
            },
            {
              title: "Cross-encoders make the final cut",
              body: "Fast lexical and embedding scorers narrow the pool, then cross-encoder rerankers score what's left at both document and sub-document level. The rankers keep training on signal from the millions of requests Perplexity serves every hour.",
              lever: "Put the answer in the first sentence of the section that owns the question.",
            },
            {
              title: "The answer pins each claim to its sources",
              body: 'The model writes from the passages that survive and attaches sources claim by claim. A standard answer cites a handful; Research mode "performs dozens of searches" and reads hundreds of sources before it writes.',
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "One index, several front doors",
          text: "The same search answers in the Perplexity apps, the Comet browser and the Search and Agent APIs. Since February 2026 it also powers the Perplexity assistant preloaded on Samsung's Galaxy S26 and Bixby's real-time answers, and Samsung is adding Perplexity's APIs to Samsung Browser with Perplexity as an optional default search engine ([Perplexity](https://www.perplexity.ai/hub/blog/perplexity-apis-deliver-powerful-ai-to-the-world-s-largest-android-device-maker)).",
        },
      ],
    },
    {
      id: "citation-anatomy",
      title: "How an answer sentence maps to its sources",
      blocks: [
        {
          kind: "p",
          text: "Perplexity's [help center](https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work) says every answer includes numbered citations linking to the original sources. In the web app, as of October 2026, that numbering is folded into a compact chip at the end of a claim. Four pieces make up the citation UI:",
        },
        {
          kind: "list",
          items: [
            "**The claim chip.** After a sentence or clause: the first source's site name, plus `+N` when more sources back the same claim.",
            "**The source card.** Hover or tap the chip and a card pages through that claim's sources (`1/4`, `2/4`), each with its title, the snippet Perplexity read and, for rated domains, a shield label.",
            '**The sources panel.** The full list for the answer, opened from the favicon row under it ("10 sources") or the panel beside it.',
            "**The Links tab.** The same sources as a plain list of results, next to Answer and Images.",
          ],
        },
        {
          kind: "p",
          text: "Underneath, the numbering is literal. In the [Agent API](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview), which took over when support for Sonar Chat Completions ended on September 27, 2026, the answer text carries markers such as `[1][3]`, and each number is the `id` of a search result with its own `title`, `url`, `snippet`, `date` and `last_updated`. Abridged, with illustrative values:",
        },
        {
          kind: "code",
          lang: "Agent API response",
          code: '"output": [\n  {\n    "type": "search_results",\n    "results": [\n      { "id": 1, "title": "Pricing: free for up to five users",\n        "url": "https://www.example.com/pricing",\n        "date": "2026-03-02", "last_updated": "2026-10-01",\n        "snippet": "The free plan covers up to five users…", "source": "web" }\n      // …\n    ]\n  },\n  {\n    "type": "message",\n    "content": [\n      { "type": "output_text", "text": "Its free plan covers teams of up to five[1][3]." }\n    ]\n  }\n]',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Compete at the size of a claim",
          text: "Because each claim is pinned to the passages behind it, the thing you compete with is a sentence-sized fact: a price, a limit, a version, a date, a definition. A section that states it plainly gives the model something to attach a chip to. That's our read of the mechanics, not a Perplexity statement.",
        },
      ],
    },
    {
      id: "source-labels",
      title: "The shield: Government, Academic and Trusted labels",
      blocks: [
        {
          kind: "p",
          text: "Some citations now carry a small shield icon. Perplexity's [help center](https://www.perplexity.ai/help-center/en/articles/20260806-understanding-source-labels) explains that a source review process rates whole websites, not individual pages, and gives the ones that clearly pass one of three labels. Hover the citation and the card shows the label with one line on what the site is known for.",
        },
        {
          kind: "table",
          head: ["Label", "What it marks", "Perplexity's examples"],
          rows: [
            [
              "**Government**",
              "Official websites of government organizations; useful for legal, financial and public-service questions",
              "`nasa.gov`, `epa.gov`",
            ],
            [
              "**Academic**",
              "Scientific sites; useful for medicine, biology, physics and mathematics",
              "`science.org`, `journals.plos.org`",
            ],
            [
              "**Trusted**",
              "Sites that appear often enough in results and publish within their own area of expertise",
              "`reuters.com`, `mayoclinic.org`",
            ],
          ],
        },
        {
          kind: "p",
          text: "The review asks objective questions: whether a site corrects its mistakes, whether it says who wrote each piece, and whether it keeps news apart from advertising and opinion. Perplexity says partnerships and payments don't affect labels, that most domains have none, and that having none is not a negative judgment.",
        },
        {
          kind: "p",
          text: "Perplexity doesn't say labels change ranking, so treat them as a trust cue for readers rather than a ranking factor. The checks are cheap to pass anyway: a public corrections policy with dated correction notes, a byline and author page on every article, and sponsored content clearly marked and kept apart.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Questions about your own label",
          text: "Perplexity asks website owners to raise label questions through Help > Contact Support in the app. Every source card also has a Rate this source link for feedback on the domain.",
        },
      ],
    },
    {
      id: "robots-control",
      title: "What robots.txt controls on Perplexity, and what it can't",
      blocks: [
        {
          kind: "p",
          text: "Perplexity [documents two user agents](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), each with its own published IP list. Each setting works independently, and changes can take up to 24 hours to reach Perplexity's systems.",
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "PerplexityBot",
              role: "search",
              purpose:
                "Surfaces and links websites in Perplexity's search results. Perplexity says it isn't used to crawl content for AI foundation models, follows robots.txt rate limits and backs off when a site is struggling. IPs: `perplexitybot.json`.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Perplexity-User",
              role: "user",
              purpose:
                "Visits a page when a user's question needs it, for example to check a detail live. Not used for crawling or for training. IPs: `perplexity-user.json`.",
              robots: "no",
              robotsNote: 'Perplexity: "this fetcher generally ignores robots.txt rules."',
              advice: "allow",
            },
          ],
        },
        {
          kind: "table",
          head: ["If you…", "What happens"],
          rows: [
            [
              "Disallow `PerplexityBot`",
              "Your page text stays out of the index, but Perplexity may still index the domain, headline and a brief factual summary ([help center](https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt)).",
            ],
            [
              "Disallow `Perplexity-User`",
              "The crawler docs describe it as the control for user requests, yet also say the fetcher generally ignores robots.txt because a person asked for the page. Don't rely on it alone.",
            ],
            [
              "Block both at the WAF",
              "The only hard stop: match the user agents and the published IPs. Cloudflare reported in August 2025 that blocked content was still fetched by an undeclared Chrome user agent; Perplexity attributed that traffic to a third-party browser service.",
            ],
            [
              "Want to block Comet",
              "robots.txt has no say: Comet is the visitor's own browser, and its assistant acts inside their session.",
            ],
            [
              "Want to opt out of training",
              "Nothing to set. Perplexity says it doesn't build foundation models and doesn't use your content for pre-training.",
            ],
          ],
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Perplexity: search index and live fetches\nUser-agent: PerplexityBot\nAllow: /\nDisallow: /cart/\nDisallow: /account/\n\nUser-agent: Perplexity-User\nAllow: /\n\nSitemap: https://www.example.com/sitemap.xml",
        },
        {
          kind: "p",
          text: "Outside crawlers feed the index too. The help center says Perplexity partners with third-party crawlers and has updated those agreements so they also respect robots.txt, particularly on news publishers' sites.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Your CDN's defaults may decide for you",
          text: "In August 2025 [Cloudflare](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/) delisted Perplexity as a verified bot and added signatures for the undeclared crawler it attributed to Perplexity to the managed AI-crawler block rule, which is available on every plan; Perplexity [disputed the findings](https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web). If you want Perplexity's traffic, check that rule and Bot Fight Mode, then allow the two published IP lists explicitly.",
        },
      ],
    },
    {
      id: "fetchable",
      title: "Make every passage fetchable",
      blocks: [
        {
          kind: "p",
          text: "Perplexity has no webmaster console, takes no URL submissions and isn't an IndexNow participant. Whether a passage gets to compete comes down to the crawler receiving clean HTML, quickly, with the text already in it.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Text in the server HTML",
              status: "required",
              note: "Vercel's December 2024 crawler study found that none of the major AI crawlers, PerplexityBot included, render JavaScript. Glenn Gabe's August 2025 test found Perplexity failed to find the content on every client-rendered URL he tried.",
            },
            {
              label: "Both IP lists allowed",
              status: "required",
              note: "As of October 2026, `perplexitybot.json` lists 8 addresses and `perplexity-user.json` lists 4. Let them through bot-fight modes, managed AI rules and rate limits, and refresh from the JSON instead of hard-coding.",
            },
            {
              label: "Fast, clean responses",
              status: "helps",
              note: "`Perplexity-User` fetches while someone waits. A timeout, 403, 429 or challenge page means the answer gets written from another site's passage.",
            },
            {
              label: "Honest dates",
              status: "helps",
              note: "Visible published and updated dates, plus `datePublished` and `dateModified`. The API exposes both dates per result, and stale content is filtered before ranking.",
            },
            {
              label: "HTML tables and lists",
              status: "helps",
              note: "List- and table-heavy content gets more formulaic parsing, so the facts survive extraction intact.",
            },
            {
              label: "Canonicals on syndicated copies",
              status: "helps",
              note: "In Columbia's Tow Center test (March 2025), Perplexity Pro cited syndicated copies of Texas Tribune articles for three of ten queries. Make partners canonicalize to your original.",
            },
            {
              label: "XML sitemap",
              status: "unconfirmed",
              note: "Perplexity doesn't document sitemap use. Keep one with honest `lastmod` values, referenced from robots.txt.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "Perplexity hasn't said PerplexityBot reads other sites' llms.txt files or ranks with them.",
            },
            {
              label: "IndexNow",
              status: "no-effect",
              note: "Perplexity isn't on IndexNow's list of participating search engines.",
            },
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: "# 1. Is the text in the raw HTML PerplexityBot receives?\ncurl -s -A \"Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)\" \\\n  https://www.example.com/pricing | grep -c \"free for up to five users\"\n# 0 means client-rendered text, or a WAF challenge\n\n# 2. The current IP allowlists (the files redirect, hence -L)\ncurl -sL https://www.perplexity.com/perplexitybot.json | jq -r '.prefixes[].ipv4Prefix'\ncurl -sL https://www.perplexity.com/perplexity-user.json | jq -r '.prefixes[].ipv4Prefix'",
        },
      ],
    },
    {
      id: "liftable-passages",
      title: "Write passages Perplexity can lift",
      blocks: [
        {
          kind: "p",
          text: "Perplexity's citations overlap with Google's results more than any other assistant's, so classic SEO carries over. What's specific to Perplexity is the unit: it scores spans, filters for freshness and pins claims to sources. Write for that.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Self-contained sections",
              body: "Spans are retrieved and ranked on their own. A section that names its subject and answers in its first sentence competes even when the page around it is long.",
              evidence: "official",
            },
            {
              title: "Sentence-sized facts",
              body: "Chips attach to claims, so concrete statements (a price, a limit, a version, a date) are the easiest things to cite. A vague summary gives the model nothing to pin.",
              evidence: "our-read",
            },
            {
              title: "Freshness",
              body: "Stale content is prefiltered. Ahrefs found Perplexity's citations average about 250 days newer than Google's organic results, and that newer pages tend to be cited first.",
              evidence: "observed",
            },
            {
              title: "Classic rankings",
              body: "28.6% of Perplexity's cited URLs rank in Google's top 10 for the same query, the highest share of the assistants Ahrefs tested.",
              evidence: "observed",
            },
            {
              title: "Authoritative domains",
              body: "Documents from authoritative domains get priority for fast storage and recrawl, so coverage on those sites gives Perplexity a second page to cite you from.",
              evidence: "official",
            },
            {
              title: "Reddit and YouTube",
              body: "They lead Perplexity's most-cited domains. Threads and videos that genuinely answer your category's questions are another route into the answer.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "28.6%",
              label: "of Perplexity's cited URLs also rank in Google's top 10 (15,000 queries)",
              source: {
                name: "Ahrefs, Aug 2025",
                href: "https://ahrefs.com/blog/ai-search-overlap/",
              },
            },
            {
              value: "~250 days",
              label: "newer, on average, than the pages in Google's organic results",
              source: {
                name: "Ahrefs, Jul 2025",
                href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
              },
            },
            {
              value: "21.6%",
              label:
                "Reddit's share of citations among Perplexity's top 50 domains; YouTube follows at 20.8% (3.1M US queries)",
              source: {
                name: "Ahrefs, Sep 2026",
                href: "https://ahrefs.com/blog/most-cited-domains-perplexity/",
              },
            },
          ],
        },
        { kind: "h3", text: "The same facts, before and after" },
        {
          kind: "table",
          head: ["Hard to cite", "Easy to cite"],
          rows: [
            [
              "Our flexible plans scale with your team, with options for every stage of growth.",
              "The free plan covers up to **five users** and **three projects**. Team costs **$8 per user a month**, billed yearly (prices checked October 2026).",
            ],
            [
              "Setting up SSO is quick and easy from your dashboard.",
              "To turn on SSO, open **Settings → Security → SAML**, paste your identity provider's metadata URL, then test with one account. SSO is on the Business plan.",
            ],
          ],
        },
      ],
    },
    {
      id: "comet-agents",
      title: "Comet, Computer and agents in the user's browser",
      blocks: [
        {
          kind: "p",
          text: "Perplexity runs agents in four places, its [September 2026 security post](https://www.perplexity.ai/hub/blog/how-we-engineer-safer-agents) says: Computer in the cloud, Comet in the browser, Portable Computer on the user's own device, and coding agents on its engineers' laptops. The first two can land on your site, alongside the answer engine's own live fetches.",
        },
        {
          kind: "table",
          head: ["Surface", "What it does", "How it reaches you"],
          rows: [
            [
              "**Comet** browser",
              "Free worldwide since October 2025, on Android since November 2025 and on iOS since March 2026. The Comet Assistant reads pages, compares options and fills forms across tabs, and blocks ads by default.",
              "As the user's own browser. Perplexity documents no separate user agent for it.",
            ],
            [
              "**Computer**",
              "Cloud agent for multi-step research, analysis and file building; each task runs in its own sandboxed microVM with outbound traffic controlled.",
              "Perplexity hasn't published a user agent for it.",
            ],
            [
              "**Answer engine**",
              "Fetches a page live when the index isn't enough to answer.",
              "`Perplexity-User/1.0` from the published IPs.",
            ],
            [
              "**Samsung Galaxy S26**",
              "The Perplexity assistant and Bixby's real-time answers run on Perplexity's APIs.",
              "Through the same index and fetchers.",
            ],
          ],
        },
        {
          kind: "p",
          text: "So robots.txt governs Perplexity's index and its live fetcher, not the person browsing with an AI assistant. Perplexity says the November 2025 [Comet Assistant](https://www.perplexity.ai/hub/blog/the-new-comet-assistant) got new tools for perceiving and interacting with complex websites. What helps it finish a task is mostly what helps people: real `<button>` and `<label>` elements, prices and stock in the HTML, no CAPTCHA in front of public information, and nothing that only works on hover.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Don't write instructions for agents into your pages",
          text: "Comet screens retrieved content with prompt-injection classifiers, marks it as untrusted and asks the user to confirm sensitive actions such as placing an order. Hidden text aimed at the assistant is exactly what those layers are built to catch.",
        },
      ],
    },
    {
      id: "shopping",
      title: "Product cards and checkout inside the answer",
      blocks: [
        {
          kind: "p",
          text: "Shopping questions get product cards built around what matters for the question asked, with the relevant specs and reviews. Since November 25, 2025 that experience is free for all US users, and checkout runs through PayPal without leaving the conversation ([Perplexity](https://www.perplexity.ai/hub/blog/shopping-that-puts-you-first)). The retailer stays merchant of record: it sees the customer, handles returns and keeps the relationship.",
        },
        {
          kind: "p",
          text: "Perplexity said in 2024 that its product cards aren't sponsored. Products reach them through:",
        },
        {
          kind: "list",
          items: [
            "**Your own product pages**, crawled like any other page, with specs, price and availability in the HTML.",
            "**Shopify**, whose product data powered Perplexity's shopping discovery from its November 2024 launch for stores that sell and ship to the US.",
            "**The Merchant Program**, free for large retailers that share product specs directly. Perplexity says fuller product data raises the chance of being a recommended product; members also get a dashboard of search and shopping trends ([Perplexity](https://www.perplexity.ai/hub/blog/shop-like-a-pro)).",
            "**PayPal**, which lets shoppers buy from participating retailers inside the answer.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Make product facts extractable",
          text: "Put price, currency, stock, dimensions and compatibility in visible text and in `Product` and `Offer` schema, keep them in sync with your feed, and answer comparison questions on the product page itself. The schema advice is our read; Perplexity hasn't documented which markup it uses.",
        },
      ],
    },
    {
      id: "publishers",
      title: "Getting paid: the Publishers' Program and Comet Plus",
      blocks: [
        {
          kind: "p",
          text: "Perplexity has paid publishers two ways. The [Publishers' Program](https://www.perplexity.ai/hub/blog/introducing-the-perplexity-publishers-program), launched in July 2024 with TIME, Der Spiegel, Fortune and others and joined by [Gannett](https://www.perplexity.ai/hub/blog/welcoming-gannett-to-the-perplexity-publisher-program) in July 2025, shared revenue from sponsored follow-up questions. That ad business is going: in February 2026 Perplexity executives told the Financial Times it would wind advertising down by the end of 2026 over trust concerns ([Campaign](https://www.campaignlive.com/article/perplexity-pulls-plug-ads-citing-trust-concerns-ai/1949142)).",
        },
        {
          kind: "p",
          text: "[Comet Plus](https://www.perplexity.ai/hub/blog/introducing-comet-plus) is the newer model: a $5-a-month subscription, included in Pro and Max, whose revenue goes to participating publishers minus a small share for Perplexity's compute. It pays on three kinds of traffic, so a citation can earn money even when nobody clicks. Launch partners announced in October 2025 include Condé Nast, Fortune, Le Figaro, Le Monde, the Los Angeles Times and The Washington Post. Publishers apply by emailing `publishers@perplexity.ai`.",
        },
        {
          kind: "table",
          head: ["Pays on", "Perplexity's own example"],
          rows: [
            ["**Human visits**", "Reading a partner's article on the web over morning coffee"],
            [
              "**Search citations**",
              "Asking Perplexity to synthesize recent coverage of an industry trend",
            ],
            [
              "**Agent actions**",
              "The Comet Assistant scanning your calendar and suggesting articles for the day's meetings",
            ],
          ],
        },
        {
          kind: "p",
          text: "For everyone else the lesson is simpler. The ad product Perplexity built was sponsored follow-up questions, not paid spots in the answer, and it's being wound down. The organic path in this guide is the way in.",
        },
      ],
    },
    {
      id: "analytics",
      title: "Reading Perplexity in your analytics and logs",
      blocks: [
        {
          kind: "p",
          text: "As of October 2026, citations in Perplexity's web app link straight to the cited URL, with no redirect and typically no UTM parameters, and its pages send `Referrer-Policy: strict-origin`. Your analytics receives the bare origin, `https://www.perplexity.ai/`, never the thread or the question. Two consequences: you can't see which prompt sent a visit, and a page still served over `http://` gets no referrer at all, so the visit counts as Direct.",
        },
        {
          kind: "table",
          head: ["Where", "What you'll see"],
          rows: [
            ["GA4 session source", "`perplexity.ai / referral`, sometimes with `www.`"],
            [
              "GA4 default channel",
              "Usually Referral. The AI Assistant channel added on May 13, 2026 names ChatGPT, Gemini, Claude, DeepSeek, Copilot and Grok as examples, not Perplexity ([Google](https://support.google.com/analytics/answer/9756891)).",
            ],
            [
              "GA4 Source group",
              "The dimension added on June 11, 2026 includes built-in grouping for Perplexity and fills in retroactively ([Google](https://support.google.com/analytics/answer/9164320)).",
            ],
            [
              "Server logs",
              "`PerplexityBot/1.0` for indexing and `Perplexity-User/1.0` for live fetches; check the IPs against the JSON lists.",
            ],
            ["Comet visits", "Ordinary Chrome traffic, with no documented way to tell it apart."],
          ],
        },
        {
          kind: "code",
          lang: "GA4 custom channel",
          code: '# Admin → Data display → Channel groups → copy the default group\n# New channel "Perplexity", placed above Referral\n# Condition: Session source matches regex\n^(www\\.)?perplexity\\.ai$\n\n# Or one channel for AI answers, Perplexity included\n(^|\\.)(perplexity\\.ai|chatgpt\\.com|gemini\\.google\\.com|copilot\\.microsoft\\.com|claude\\.ai)$',
        },
        {
          kind: "p",
          text: "In logs, `Perplexity-User` requests are the best evidence that a page is being pulled into live answers, and `PerplexityBot` shows what's being indexed. User agents are trivial to fake, so match the source IP against the published lists before trusting either.",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Hits per Perplexity agent\ngrep -oE "PerplexityBot|Perplexity-User" access.log | sort | uniq -c\n\n# Pages fetched live for users, most requested first\ngrep "Perplexity-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Check answers by hand, as a set",
          text: "Pick 20 questions your buyers ask, run them monthly in a logged-out window, and note which of your URLs sit behind each chip. Answers vary between runs, so read the trend across the set rather than any single answer.",
        },
      ],
    },
    {
      id: "misconceptions",
      title: "What Perplexity doesn't offer",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Perplexity runs on Google's results.",
              reality:
                "It runs its own crawler and an index of 200B+ URLs. Google rankings correlate with its citations (28.6% top-10 overlap) but aren't what it searches.",
            },
            {
              myth: "You can pay for a place in the answer.",
              reality:
                "Its ad product was sponsored follow-up questions, not spots in the answer, and it's being wound down. Source labels can't be bought either.",
            },
            {
              myth: "There's a console for submitting URLs.",
              reality:
                "There's no webmaster console, no URL submission and no IndexNow. Discovery runs on its crawler, partner crawlers and links.",
            },
            {
              myth: "Blocking PerplexityBot removes you completely.",
              reality:
                "Your domain, headline and a short summary may still appear, `Perplexity-User` generally ignores robots.txt, and syndicated copies can be cited instead.",
            },
            {
              myth: "You need a shield label to be cited.",
              reality:
                "Most domains have no label, Perplexity says no label isn't a negative judgment, and it hasn't said labels affect ranking.",
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
        "In robots.txt, then at your CDN: Cloudflare's managed AI-crawler rule, Bot Fight Mode and rate limits.",
      impact: "high",
    },
    {
      id: "ssr",
      title: "Put the text in the server HTML",
      detail:
        "Check with `curl` and the PerplexityBot user agent that body copy, prices and tables are in the raw response.",
      impact: "high",
    },
    {
      id: "sections",
      title: "Make each section answer one question",
      detail:
        "A descriptive heading, the answer in the first sentence, names and numbers with units.",
      impact: "high",
    },
    {
      id: "facts",
      title: "State facts at sentence size",
      detail: "Prices, limits, versions and dates in plain sentences a source chip can attach to.",
      impact: "high",
    },
    {
      id: "dates",
      title: "Show honest published and updated dates",
      detail:
        "On the page and in `datePublished` / `dateModified`; change them only when the content changes.",
      impact: "high",
    },
    {
      id: "seo",
      title: "Keep ranking in Google",
      detail: "Perplexity's citations overlap Google's top 10 more than any other assistant's.",
      impact: "high",
    },
    {
      id: "analytics",
      title: "Give Perplexity its own GA4 channel",
      detail: "A custom channel above Referral, plus the Source group dimension for history.",
      impact: "high",
    },
    {
      id: "ips",
      title: "Allowlist the two published IP lists",
      detail:
        "Refresh `perplexitybot.json` and `perplexity-user.json` on a schedule instead of hard-coding addresses.",
      impact: "medium",
    },
    {
      id: "tables",
      title: "Use real HTML tables and lists",
      detail:
        "For specs, comparisons and steps: Perplexity parses structured content formulaically.",
      impact: "medium",
    },
    {
      id: "labels",
      title: "Pass the source-label checks",
      detail:
        "A public corrections policy, bylines with author pages, and sponsored content clearly separated.",
      impact: "medium",
    },
    {
      id: "canonical",
      title: "Canonicalize syndicated copies to you",
      detail: "Make it a condition of every syndication deal.",
      impact: "medium",
    },
    {
      id: "community",
      title: "Answer your category's questions on Reddit and YouTube",
      detail:
        "They lead Perplexity's most-cited domains, so useful threads and videos are a second route in.",
      impact: "medium",
    },
    {
      id: "logs",
      title: "Watch Perplexity-User in your logs",
      detail: "IP-verified hits show which pages are being pulled into live answers.",
      impact: "medium",
    },
    {
      id: "products",
      title: "Retailers: expose product facts and look at the Merchant Program",
      detail:
        "Specs, price and stock in the HTML and in `Product` schema; PayPal for in-answer checkout.",
      impact: "medium",
    },
    {
      id: "agents",
      title: "Keep key flows usable by agents",
      detail:
        "Labelled forms, real buttons, no CAPTCHA in front of public information, and no hidden instructions for assistants.",
      impact: "low",
    },
    {
      id: "comet-plus",
      title: "Publishers: apply to Comet Plus",
      detail: "Paid on visits, citations and agent actions. Email publishers@perplexity.ai.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "How does Perplexity choose which sources to cite?",
      a: "It retrieves candidates from its own index with keyword and semantic search together, drops stale or off-topic pages, then reranks individual passages with cross-encoder models. The answer cites the passages it used, attached to the claims they support.",
    },
    {
      q: "Does Perplexity use Google or Bing results?",
      a: "No. It runs its own crawler, PerplexityBot, and an index of more than 200 billion URLs, with partner crawlers that must respect robots.txt. Pages that rank well in Google still get cited often: Ahrefs found 28.6% of Perplexity's cited URLs rank in Google's top 10.",
    },
    {
      q: "Why do Perplexity's citations show a site name instead of a number?",
      a: "In the web app, numbered citations are folded into a chip after each claim: the first source's site name, plus `+N` for the others. Hover or tap it to page through them. The API keeps the numbers as `[1][3]` markers that point at search-result IDs.",
    },
    {
      q: "What do the shield icons on Perplexity citations mean?",
      a: "They're source labels (Government, Academic or Trusted) that Perplexity's source review gives to whole domains. The review checks things like corrections, bylines and keeping news apart from ads. Perplexity says payments and partnerships don't affect labels, and most sites have none.",
    },
    {
      q: "If I block PerplexityBot, will Perplexity stop using my content?",
      a: "It stops indexing your page text but may still show your domain, headline and a brief summary. `Perplexity-User`, which fetches pages when a user asks, generally ignores robots.txt, so a hard block needs a WAF rule on its user agent and published IPs.",
    },
    {
      q: "Can Perplexity read JavaScript-rendered pages?",
      a: "Independent tests say no. Vercel found that none of the major AI crawlers render JavaScript, PerplexityBot included, and Glenn Gabe's 2025 test found Perplexity couldn't find the content on any client-rendered URL he tried. Server-render anything you want cited.",
    },
    {
      q: "How do I see Perplexity traffic in GA4?",
      a: "Look for `perplexity.ai / referral` in Traffic acquisition. Perplexity sends only its origin as the referrer and adds no UTM tags, and GA4's AI Assistant channel doesn't name it, so create a custom channel matching `perplexity\\.ai` above Referral. The Source group dimension groups it too, retroactively.",
    },
    {
      q: "Does Comet follow robots.txt?",
      a: "Perplexity documents robots.txt controls only for PerplexityBot and Perplexity-User. Comet is the user's own browser, and the Comet Assistant acts inside their session, so expect its visits to look like ordinary Chrome traffic.",
    },
    {
      q: "How do I get my products into Perplexity shopping?",
      a: "Crawlable product pages with specs, price and stock in the HTML are the base. Large retailers can join the free Merchant Program to share product data directly, and retailers that take PayPal can be bought from inside the answer while staying merchant of record.",
    },
    {
      q: "Does Perplexity pay publishers or sell ads?",
      a: "Comet Plus passes its subscription revenue, minus a compute share, to participating publishers, paying on visits, citations and agent actions. The older ad revenue share is ending: Perplexity told the Financial Times in February 2026 it would wind ads down by the end of the year. Perplexity hasn't offered paid placement inside answers.",
    },
  ],

  sources: [
    {
      title: "Perplexity Crawlers",
      publisher: "Perplexity Docs",
      href: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers",
    },
    {
      title: "How does Perplexity follow robots.txt?",
      publisher: "Perplexity Help Center",
      href: "https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt",
    },
    {
      title: "How does Perplexity work?",
      publisher: "Perplexity Help Center",
      href: "https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work",
    },
    {
      title: "Understanding source labels",
      publisher: "Perplexity Help Center",
      href: "https://www.perplexity.ai/help-center/en/articles/20260806-understanding-source-labels",
    },
    {
      title: "Architecting and evaluating an AI-first Search API",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "Migrating from Sonar to the Agent API",
      publisher: "Perplexity Docs",
      href: "https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview",
    },
    {
      title: "Search date and time filters",
      publisher: "Perplexity Docs",
      href: "https://docs.perplexity.ai/docs/search/filters/date-time-filters",
    },
    {
      title: "Agents or bots? Making sense of AI on the open web",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/agents-or-bots-making-sense-of-ai-on-the-open-web",
    },
    {
      title: "How we engineer safer agents",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/how-we-engineer-safer-agents",
    },
    {
      title: "The internet is better on Comet",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/comet-is-now-available-to-everyone-worldwide",
    },
    {
      title: "Comet for Android is here",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/comet-for-android-is-here",
    },
    {
      title: "Comet is now available on iOS",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/meet-comet-for-ios",
    },
    {
      title: "The new Comet Assistant",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/the-new-comet-assistant",
    },
    {
      title: "Perplexity APIs deliver powerful AI to the world's largest Android device maker",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/perplexity-apis-deliver-powerful-ai-to-the-world-s-largest-android-device-maker",
    },
    {
      title: "Shopping that puts you first",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/shopping-that-puts-you-first",
    },
    {
      title: "Shop like a pro: Perplexity's new AI-powered shopping assistant",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/shop-like-a-pro",
    },
    {
      title: "Introducing the Perplexity Publishers' Program",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/introducing-the-perplexity-publishers-program",
    },
    {
      title: "Welcoming Gannett to the Perplexity Publisher Program",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/welcoming-gannett-to-the-perplexity-publisher-program",
    },
    {
      title: "Introducing Comet Plus",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/introducing-comet-plus",
    },
    {
      title: "Announcing Comet Plus launch partners",
      publisher: "Perplexity",
      href: "https://www.perplexity.ai/hub/blog/announcing-comet-plus-launch-partners",
    },
    {
      title: "Perplexity pulls the plug on ads, citing trust concerns for AI",
      publisher: "Campaign",
      href: "https://www.campaignlive.com/article/perplexity-pulls-plug-ads-citing-trust-concerns-ai/1949142",
    },
    {
      title:
        "Perplexity is using stealth, undeclared crawlers to evade website no-crawl directives",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/",
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
      title: "The 50 most-cited websites in Perplexity (September 2026)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/most-cited-domains-perplexity/",
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
    {
      title: "What's new in Google Analytics (Source group)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9164320",
    },
  ],

  sameAs: ["https://en.wikipedia.org/wiki/Perplexity_AI", "https://www.perplexity.ai"],

  furtherReading: [
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Write PerplexityBot and Perplexity-User rules alongside every other AI crawler, with deliberate training choices.",
    },
    {
      title: "AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "Paste an access log to see which AI bots, PerplexityBot included, visit your site and which pages they want.",
    },
    {
      title: "Content chunking, explained",
      href: "/glossary/content-chunking",
      description: "Why a section, not the whole page, is the unit that competes for a citation.",
    },
    {
      title: "Citation-Ready Writer",
      href: "/features/citation-ready-writer",
      description:
        "How Rankbox researches the live web and writes source-backed articles built from self-contained sections.",
    },
  ],
};
