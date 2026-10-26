import type { EngineGuide } from "../types";

/* Facts verified against Meta's own docs and the reporting cited in `sources`
   on 2026-10-26. Meta documents less about Meta AI's retrieval than any other
   major assistant, so every inference is labelled as one. */
export const metaAi: EngineGuide = {
  slug: "meta-ai",
  metaTitle: "Meta AI SEO: How to Get Cited in WhatsApp, Instagram and Facebook",
  metaDescription:
    "How Meta AI finds and shows sources across WhatsApp, Facebook, Instagram, the Meta AI app and glasses: the crawler to allow, its post index, and how to measure the clicks.",
  keywords: [
    "Meta AI SEO",
    "get cited by Meta AI",
    "Meta-WebIndexer",
    "Meta-ExternalAgent robots.txt",
    "Meta AI sources WhatsApp",
    "what search engine does Meta AI use",
  ],
  headline: {
    lead: "Meta AI SEO:",
    accent: "getting cited inside WhatsApp, Instagram and Facebook",
  },
  subhead:
    "Meta AI answers in chat threads more often than on a results page, and WhatsApp is where most of those chats happen. It searches the open web through partners Meta no longer names and an index its own crawler is building — and public Facebook, Instagram and Threads posts too.",

  shortAnswer:
    "To get cited by Meta AI, allow `meta-webindexer` in robots.txt — Meta says doing so \"helps us cite and link to your content in Meta AI's responses\" — and keep `meta-externalfetcher` unblocked at your CDN. Put the answer in server-rendered HTML, near the top of the page. Then show up in Meta AI's second index: public Facebook, Instagram and Threads posts, which it searches by their captions, transcripts and what's on screen.",

  takeaways: [
    '`meta-webindexer` is the one Meta crawler tied to citations: allowing it "helps us cite and link to your content," per Meta. `meta-externalagent` collects training data, and blocking it is a separate decision.',
    'Meta named Bing in 2023 and Google in 2024 as search partners. Its AI terms, effective May 13, 2026, say only "select partners, like search engines" — ranking in both is the hedge.',
    "Meta AI's tool list includes a semantic search over Facebook, Instagram and Threads posts from January 1, 2025, built from captions, visual analysis and transcripts. Say your product's name, show it and caption it.",
    "Meta documents one source pattern — a **Sources** list under the response — and no layout per app. In a WhatsApp thread, being named in the sentence does work a link can't.",
    "There's no Meta AI console, and GA4's AI Assistant channel doesn't list Meta AI. Expect `meta.ai` referrals from the website, Facebook link-shim referrals from the app, and a lot of Direct.",
  ],

  facts: [
    { label: "Its leading surface (Meta, Jul 2026)", value: "WhatsApp" },
    { label: "The crawler tied to citations", value: "meta-webindexer", mono: true },
    { label: "Post search reaches back to", value: "Jan 1, 2025" },
    { label: "Search partners Meta names today", value: "None" },
  ],

  preview: {
    prompt: "What's a good carry-on backpack for a week in Lisbon?",
    status: "Sources",
    answer:
      "**Wrenfold's 28L Carry** is a common pick: it fits most European airlines' cabin limits, opens flat like a suitcase, and travelers in public posts say it held a week of clothes without checking a bag.",
    sources: [
      { domain: "wrenfold.co", title: "28L Carry: dimensions and airline fit" },
      { domain: "instagram.com", title: "Reel: one week in Lisbon, one 28L bag" },
      { domain: "facebook.com", title: "Public Group post: which pack fits under the seat?" },
    ],
  },

  profile: {
    retrieval:
      "Unnamed search partners, Meta-WebIndexer's own index, licensed news, and Meta's own posts",
    searchCrawler: "meta-webindexer, plus meta-externalfetcher for user-requested fetches",
    trainingCrawler: "meta-externalagent; Meta doesn't say whether blocking it changes answers",
    rendersJs: "Not documented; Meta-ExternalAgent was seen not running JavaScript (Vercel, 2024)",
    referrer: "Undocumented; meta.ai on the web, Facebook link shim or Direct in-app (our read)",
    citationStyle: "A Sources list under the response; layouts per app aren't documented",
    biggestLever:
      "Allow meta-webindexer, then get named in public Facebook, Instagram and Threads posts",
  },

  sections: [
    {
      id: "inside-the-chat",
      title: "Meta AI answers inside chats, not on a results page",
      blocks: [
        {
          kind: "p",
          text: 'Meta AI is one assistant behind many doors: its own app and website, Facebook, Instagram, Messenger, WhatsApp and Meta\'s glasses. The busiest door is a messenger. In July 2026 Mark Zuckerberg called WhatsApp "the leading surface where people engage with Meta AI" ([Q2 2026 call](https://s21.q4cdn.com/399680738/files/doc_financials/2026/q2/META-Q2-2026-Earnings-Call-Transcript.pdf)); six months earlier Meta\'s CFO had added that "in the U.S., Facebook is a stronger driver of engagement." Since April 8, 2026 the assistant runs on **Muse Spark**, the first model from Meta Superintelligence Labs, which [Meta says](https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/) launched in the Meta AI app and on meta.ai before spreading to the other apps and, gradually, to Ray-Ban Meta and Oakley Meta glasses in the US and Canada.',
        },
        {
          kind: "stats",
          items: [
            {
              value: "1B+",
              label: "monthly actives already used Meta AI by October 2025, per Mark Zuckerberg",
              source: {
                name: "Meta Q3 2025 call",
                href: "https://s21.q4cdn.com/399680738/files/doc_financials/2025/q3/META-Q3-2025-Earnings-Call-Transcript.pdf",
              },
            },
            {
              value: "+60%",
              label:
                "more people interacting with Meta AI each day since Meta rebuilt it on Muse Spark",
              source: {
                name: "Meta Q2 2026 call",
                href: "https://s21.q4cdn.com/399680738/files/doc_financials/2026/q2/META-Q2-2026-Earnings-Call-Transcript.pdf",
              },
            },
          ],
        },
        {
          kind: "p",
          text: 'What a source looks like depends on the door, and Meta documents only one pattern. Its [help center](https://www.meta.com/help/artificial-intelligence/578066098711082/) says Meta AI "may use sources and links from the internet to inform its responses" and that you see them "by selecting Sources under its response." Everything else in this table is what Meta has said about each surface — and, as often, what it hasn\'t:',
        },
        {
          kind: "table",
          head: ["Surface", "How people reach Meta AI", "What Meta documents about sources"],
          rows: [
            [
              "Meta AI app and meta.ai",
              'A chat with Instant and Thinking modes; a shopping mode that searches Marketplace "alongside options from across the internet"',
              "A **Sources** list you open under the response",
            ],
            [
              "WhatsApp",
              'The Meta AI chat, the "Ask Meta AI or Search" bar, or `@Meta AI` in a group; a dedicated Meta AI tab reached beta testers in March 2026',
              "Web search is a setting with its own [help page](https://faq.whatsapp.com/1493496052558860/?cms_platform=web); no WhatsApp-specific source layout",
            ],
            [
              "Facebook",
              'AI Mode in search (June 2026), with answers "grounded in what people are saying publicly" in Groups and Reels',
              "Not documented",
            ],
            [
              "Instagram and Messenger",
              "Meta AI in chats and in each app's search",
              "Not documented",
            ],
            [
              "Ray-Ban Meta and Oakley Meta glasses",
              'By voice, with "Hey Meta"; Meta Ray-Ban Display can "show you answers and step-by-step how-tos" in the lens',
              "Not documented; a conversation started on glasses can be picked up in the Meta AI app's history tab",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Two things follow. First, the answer arrives as a message — read on a phone, often in a group, sometimes forwarded. The brand named in the sentence is what everyone in the thread sees; the link sits one tap away in a sheet most people never open. Second, private chats still search. Incognito chats, which Meta launched on WhatsApp and the Meta AI app in Q2 2026 as conversations "even Meta can\'t see," start with web search on: the [help center](https://www.meta.com/help/artificial-intelligence/1510309990445305/) says it "begins toggled on" and sends "the search query to select search engines without connecting it to your account." Part of your audience is conversations nobody can observe, Meta included.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Write the sentence you want forwarded",
          text: "Our read: because Meta AI's answers live in threads, the unit that travels is a sentence, not a page. Put your key facts in short, self-contained sentences that carry your brand name — \"Wrenfold's 28L Carry measures 40 × 30 × 20 cm\" — so a model can lift one whole, with the name attached.",
        },
      ],
    },
    {
      id: "two-indexes",
      title: "Two indexes: the open web and Meta's own apps",
      blocks: [
        {
          kind: "p",
          text: "Meta AI doesn't search every time. Meta's [search grounding docs](https://dev.meta.ai/docs/search-grounding), written for developers using the same models, say the model \"skips the search when it can answer confidently from its training data,\" and that simple factual questions \"typically do not trigger a search.\" When it does search, it has more than one place to look. On Muse Spark's launch day, Meta AI listed its tools to [Simon Willison](https://simonwillison.net/2026/Apr/8/muse-spark/), and a Meta engineer confirmed they belong to the new harness. Read in order, they're the path of a searched answer:",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "browser.search writes a main query and alternatives",
              body: "The tool takes a `primary_query`, a list of `alternative_queries`, an optional `since` date, and verticals for news, sports, weather, finance, datetime and local. Willison's write-up lists the engine behind it as undisclosed.",
              lever:
                "Title pages and open them with the words people actually ask in: product names, places, and the year where freshness matters.",
            },
            {
              title: "meta_1p.content_search searches posts on Meta's apps",
              body: '"Semantic search across Instagram, Threads, and Facebook posts," built from "captions, visual analysis, transcripts," over public posts and private ones the asker can see, from January 1, 2025. It filters by author, platform, place and date.',
              lever:
                "Name your brand and products in captions, on screen and out loud: those are the three things the index is built from.",
            },
            {
              title: "meta_1p.meta_catalog_search looks up products",
              body: 'Shopping questions can "search for products in Meta\'s product catalog," and the app\'s shopping mode searches Facebook Marketplace "alongside options from across the internet."',
              lever:
                "If you sell on Facebook or Instagram, keep your catalog's names, prices and stock consistent with your site.",
            },
            {
              title: "browser.open and browser.find read the page",
              body: "`browser.open` loads a result; `browser.find` looks for exact matches of a pattern inside it. Meta doesn't document which user agent does the reading or whether it runs JavaScript.",
              lever:
                "Put the answer in the raw HTML, early, in plain words an exact-match search can land on.",
            },
            {
              title: "The answer cites a subset of what it read",
              body: 'In Meta\'s Model API the retrieved results are "every source the model considered" and the citations "the subset it actually cited." In the apps, sources sit under the response.',
              lever: "State one fact per sentence, so a citation has something whole to attach to.",
            },
          ],
        },
        {
          kind: "table",
          head: ["Where a source can come from", "What's on the record", "Your way in"],
          rows: [
            [
              "Search partners",
              "Bing (2023) and Google (2024) were announced; the 2026 terms name no engine",
              "Rank in Google and Bing",
            ],
            [
              "Meta's own web index",
              '`meta-webindexer` crawls "to improve Meta AI search result quality"',
              "Allow it; serve the answer in HTML",
            ],
            [
              "Licensed news",
              "Reuters since October 2024; CNN, Fox News, USA Today, Le Monde and others since December 2025",
              "Publishers: a licensing deal",
            ],
            [
              "Posts and products on Meta's apps",
              "Post search from January 2025; the product catalog; Marketplace; AI Mode's Groups and Reels",
              "Publish, and get talked about, on Facebook, Instagram and Threads",
            ],
          ],
        },
        { kind: "h3", text: "The web side: partners Meta stopped naming" },
        {
          kind: "p",
          text: 'Microsoft announced in [September 2023](https://blogs.bing.com/search/september-2023/Expanding-Our-AI-Partnership-with-Meta-%281%29) that Bing would give Meta AI "more timely and up-to-date answers with access to real-time search information," and Ray-Ban Meta\'s [release notes](https://www.meta.com/help/ai-glasses/1809764829519902/) described glasses answers in January 2024 as "powered in part by Bing." In April 2024 Google joined, though [Search Engine Journal](https://www.searchenginejournal.com/meta-integrates-google-bing-search-results-into-ai-assistant/514291/) "could only get Meta AI to search using Bing" in its tests. Since then Meta has stopped naming names. Its [AI terms](https://www.facebook.com/legal/ai-terms), effective May 13, 2026, say Meta "may share certain information with select partners, like search engines," and that in private chats "search terms based on your chat may be sent to these search partners." You can\'t optimize for a partner you can\'t see, so being indexed and ranking well in both Google and Bing remains the broadest way into the candidate pool.',
        },
        { kind: "h3", text: "Meta's own crawler is building an index" },
        {
          kind: "p",
          text: "The Information reported in October 2024 that Meta was \"working on a search engine that crawls the web to provide conversational answers\" ([Social Media Today's summary](https://www.socialmediatoday.com/news/meta-is-developing-a-search-engine-to-power-its-ai-chatbot/731272/)). `meta-webindexer` is the documented piece of it. In [Promptwatch's crawler logs](https://promptwatch.com/data/meta-web-indexer) it sat around 2% of AI crawler requests until July 17, 2026, then climbed to 37.8% on August 9 — about 17 times higher in under a month. On August 6 Pieter Levels posted that Meta staff had told him Meta is building its own index so its AI's searches stay off Google; [Search Engine Roundtable](https://www.seroundtable.com/meta-facebook-search-engine-41840.html) carried no comment from Meta. Treat the motive as unconfirmed. The crawl is real, and it's the one Meta ties to citations.",
        },
        { kind: "h3", text: "Licensed news is linked by contract" },
        {
          kind: "p",
          text: 'Meta\'s first AI news deal, with Reuters in October 2024, came with each such answer "expected to include a link to the Reuters story on which it\'s based" ([SiliconANGLE](https://siliconangle.com/2024/10/25/meta-inks-multiyear-ai-content-licensing-deal-reuters/)). In December 2025 Meta added CNN, Fox News, Fox Sports, Le Monde Group, People Inc., The Daily Caller, The Washington Examiner and USA Today, whose answers "will also include links to articles" ([TechCrunch](https://techcrunch.com/2025/12/05/meta-signs-commercial-ai-data-agreements-with-publishers-to-offer-real-time-news-on-meta-ai)). For a news publisher, a deal is the documented route to linked answers; for everyone else, those outlets are the competition on current-events questions.',
        },
      ],
    },
    {
      id: "meta-user-agents",
      title: "Five Meta user agents, and the one tied to citations",
      blocks: [
        {
          kind: "p",
          text: 'Meta\'s [crawler page](https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers) lists five agents, each sending a lowercase token such as `meta-webindexer/1.1`. It prefers "industry-standard practices like robots.txt" over "non-standard formats like NoAI tags," and warns that its crawlers "may cache the contents of robots.txt for up to 24 hours." There\'s no `FacebookBot` on the current page, so an old rule naming it no longer maps to a documented Meta crawler. Flip each agent below to see the [robots.txt](/glossary/robots-txt) group it needs and what you trade away:',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "meta-webindexer",
              role: "search",
              purpose:
                'Navigates the web "to improve Meta AI search result quality for users." Meta: allowing it "helps us cite and link to your content in Meta AI\'s responses."',
              robots: "yes",
              robotsNote: "Meta lists robots.txt exceptions only for two other agents",
              advice: "allow",
            },
            {
              token: "meta-externalfetcher",
              role: "user",
              purpose:
                "Fetches individual links at a user's request and supports Meta's agentic AI features. Blocking it means an answer about your page is built from someone else's.",
              robots: "partial",
              robotsNote: "May bypass robots.txt, because a user asked for the fetch",
              advice: "allow",
            },
            {
              token: "meta-externalagent",
              role: "training",
              purpose:
                'Crawls "for use cases such as training foundation AI models or improving products by indexing content directly." Meta doesn\'t say what blocking it does to answers.',
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "facebookexternalhit",
              role: "other",
              purpose:
                "Builds the title, description and thumbnail when your link is shared in Meta's apps, such as Facebook, Instagram or Messenger.",
              robots: "partial",
              robotsNote: "May bypass robots.txt for security or integrity checks",
              advice: "allow",
            },
            {
              token: "meta-externalads",
              role: "other",
              purpose:
                'Crawls "for use cases such as improving advertising and other business-related products and services." Meta doesn\'t connect it to Meta AI.',
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "Two mechanics catch people out. A named group replaces your `User-agent: *` group for that agent rather than adding to it, so repeat any paths you still want blocked. And robots.txt is per host: `shop.yoursite.com` needs its own file.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Blocking meta-externalagent is a bet, not a switch",
          text: 'Meta describes `meta-externalagent` as crawling for training "or improving products by indexing content directly," and says nothing about what a block does to answers. What it does document is that `meta-webindexer` feeds Meta AI search — so keep that one open whatever you decide. Then check your CDN and WAF: a blanket "block AI bots" rule can stop every `meta-*` agent at once, whatever robots.txt says.',
        },
        {
          kind: "p",
          text: "Meta's crawlers are heavy, which makes them tempting to throttle. [Fastly](https://www.fastly.com/press/press-releases/new-fastly-threat-research-reveals-ai-crawlers-make-up-almost-80-of-ai-bot) attributed **52%** of the AI crawler traffic it saw from mid-April to mid-July 2025 to Meta, against 23% for Google and 20% for OpenAI. Rate-limit if you must, but a `429` to `meta-webindexer` is a page Meta AI can't cite.",
        },
        {
          kind: "p",
          text: "To catch impostors, Meta's page calls allowlisting by IP address \"more secure\" than by user agent, but links to no IP list. Meta's network is [AS32934](https://ipinfo.io/AS32934). Meta doesn't promise every crawler request comes from it, but it's the first check when a `meta-*` user agent looks spoofed:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Routes announced by Meta's network (AS32934)\nwhois -h whois.radb.net -- '-i origin AS32934' | grep ^route | head\n\n# Who owns the address behind a suspicious hit?\nwhois 157.240.0.1 | grep -iE 'orgname|origin'",
        },
      ],
    },
    {
      id: "readable-to-meta",
      title: "What Meta's fetchers need from a page",
      blocks: [
        {
          kind: "p",
          text: "Meta publishes no rendering, freshness or structured-data guidance for Meta AI. What's documented is crawler access, the link-preview rules for `facebookexternalhit`, and how the search tool behaves in the API. The rest of this list is inference, marked as such.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "meta-webindexer allowed",
              status: "required",
              note: "In robots.txt and at the WAF. It's the one agent Meta ties to citing and linking your content in Meta AI.",
            },
            {
              label: "The answer in raw HTML",
              status: "required",
              note: "Undocumented for `meta-webindexer`, but Vercel saw `Meta-ExternalAgent` fetch pages without running JavaScript. Treat client-rendered text as invisible — see [server-side rendering](/glossary/server-side-rendering).",
            },
            {
              label: "meta-externalfetcher not WAF-blocked",
              status: "helps",
              note: "It fetches at a user's request and may bypass robots.txt anyway. A WAF block only means the answer gets built from someone else's page.",
            },
            {
              label: "The answer near the top",
              status: "helps",
              note: "`browser.find` looks for exact matches inside an opened page. A plain sentence that repeats the question's key words, early on, is the easiest thing to land on.",
            },
            {
              label: "Fast, error-free responses",
              status: "helps",
              note: "A `429`, `5xx` or timeout to a Meta agent drops that page from the answer it was fetched for.",
            },
            {
              label: "Open Graph in the first 1 MB",
              status: "helps",
              note: 'Documented for `facebookexternalhit`: Open Graph tags "before the first 1 MB," gzip and deflate support, and a page that can be crawled "within a few seconds." It governs your card whenever the URL is shared on Facebook, Instagram or Messenger.',
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "No statement from Meta. Its tools hand the model page text, so keep every fact in visible copy, not only in JSON-LD.",
            },
            {
              label: "Linked social profiles",
              status: "unconfirmed",
              note: "Post search filters by author. `sameAs` links from your Organization schema to your Facebook, Instagram and Threads accounts can't hurt; Meta doesn't document entity matching.",
            },
            {
              label: "Sitemaps",
              status: "unconfirmed",
              note: "Not documented for `meta-webindexer`. Keep one with honest `lastmod` values, referenced from robots.txt.",
            },
            {
              label: "IndexNow",
              status: "no-effect",
              note: "Meta isn't on [IndexNow's list](https://www.indexnow.org/searchengines.json) of participating engines. It still reaches Bing, a past Meta AI partner.",
            },
            {
              label: "NoAI meta tags",
              status: "no-effect",
              note: 'Meta says it uses robots.txt "rather than non-standard formats like NoAI tags."',
            },
          ],
        },
        {
          kind: "p",
          text: "Test the two agents that matter with the user-agent strings Meta documents. The second command is the link-preview check from Meta's own page:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Does Meta\'s search crawler get your real content?\ncurl -s -A "meta-webindexer/1.1 (+/documentation/sharing/webmasters/web-crawlers)" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n# 0 = the text is rendered by JavaScript, or a WAF blocked the request\n\n# Meta\'s link-preview simulation\ncurl -v --compressed -H "Range: bytes=0-524288" -H "Connection: close" \\\n  -A "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" "$URL"',
        },
      ],
    },
    {
      id: "post-index",
      title: "Getting into the post index: captions, transcripts, Groups",
      blocks: [
        {
          kind: "p",
          text: 'Most assistants can only find you on the open web. Meta AI can also find you in posts on its own apps — Grok does the same with X, but Meta\'s index spans three apps. At the Muse Spark launch Meta promised "Reels, photos, and posts woven directly into your answers, with credit back to the content creators," and local answers showing "public posts from locals who know the area." In June 2026 Facebook added [AI Mode](https://about.fb.com/news/2026/06/new-ai-tools-to-help-you-make-things-happen-on-facebook/), whose answers are "grounded in what people are saying publicly across our apps like in Groups and Reels." And on its Q4 2025 call Meta said it is "identifying the most relevant content across our platform to pull into responses." Your posts, and other people\'s posts about you, are retrieval candidates. Here\'s what the tool definition and Meta\'s announcements say about getting picked up:',
        },
        {
          kind: "signals",
          items: [
            {
              title: "Say it, show it, caption it",
              body: 'The post index is built from "captions, visual analysis, transcripts." A Reel that says the product\'s name, shows it on screen and names it in the caption gives all three something to match.',
              evidence: "observed",
            },
            {
              title: "Concrete words beat generic ones",
              body: 'The tool definition warns that generic terms like "posts" or "updates" "degrade retrieval." Captions with the product, the place and the use case give a semantic search something to grab.',
              evidence: "observed",
            },
            {
              title: "Only 2025 onward, only what the asker can see",
              body: "Coverage starts January 1, 2025, and spans public posts plus private ones the asker has access to. A private account's posts can only surface for people who follow it.",
              evidence: "observed",
            },
            {
              title: "Locals and Groups carry local and trending answers",
              body: "Meta says local answers show public posts from people who live there, and Facebook's AI Mode answers from Groups and Reels. Genuine public recommendations from customers are the input.",
              evidence: "official",
            },
            {
              title: "Shoppers can @-mention you",
              body: "In shopping mode, people can @-mention brands or creators to browse their public content, and refine Marketplace results by price, style or distance. A complete, current profile is what they land on.",
              evidence: "official",
            },
            {
              title: "A handle that matches your name",
              body: "The search filters by author. When someone asks about your brand by name, an account whose handle and display name match it is the easiest one to resolve.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Retrieval, not ranking",
          text: "Everything above is about being findable. Meta hasn't published how it ranks posts against each other or against web pages, and the tool list is a snapshot from April 2026, not documentation. Don't buy engagement to game a ranking nobody has described; earn the posts a real customer would write.",
        },
      ],
    },
    {
      id: "measuring-meta-ai",
      title: "Measuring Meta AI without a console or a referrer",
      blocks: [
        {
          kind: "p",
          text: "Meta publishes no webmaster console for Meta AI and doesn't document the referrer its answer links carry. GA4's AI Assistant channel covers \"sources like ChatGPT, Gemini, Deepseek, Copilot, or Grok,\" per Google's [channel documentation](https://support.google.com/analytics/answer/9756891) — not Meta AI. So measurement is three partial views stitched together: analytics, logs and a prompt panel. Here's what to expect in analytics, by where the click starts. All of it is our read:",
        },
        {
          kind: "table",
          head: ["Where the click starts", "What analytics is likely to show"],
          rows: [
            ["meta.ai in a browser", "`meta.ai` as the referring source"],
            [
              "Facebook app (AI Mode, Meta AI in Feed)",
              "Facebook's link shim — `l.facebook.com` on desktop, `lm.facebook.com` on mobile, per [Loves Data](https://www.lovesdata.com/blog/facebook-referrals-in-google-analytics/) — mixed in with ordinary social clicks",
            ],
            [
              "WhatsApp, Messenger, Instagram chats",
              "Often no referrer at all, so the visit lands in Direct",
            ],
            ["Glasses", "No click, unless the person opens the conversation later in the app"],
          ],
        },
        {
          kind: "p",
          text: "Give Meta AI a custom channel, placed above Referral so it claims sessions first. The first rule is clean; the second will over-count, because most link-shim traffic is ordinary Facebook sharing, so report it as a ceiling, not a number:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source: Meta AI website\n(^|\\.)meta\\.ai$\n\n# Session source: Facebook link shims (Meta AI mixed with social)\n^(l|lm|m)\\.facebook\\.com$",
        },
        {
          kind: "p",
          text: "Your server logs are more honest. `meta-webindexer` hits show what Meta is indexing; `meta-externalfetcher` hits are pages fetched because a person asked about them — the closest thing to a live-demand signal Meta gives you. The [AI crawler log analyzer](/tools/ai-crawler-log-analyzer) does this in the browser; on a server:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Meta agent hits, by agent\ngrep -oiE \"meta-webindexer|meta-externalfetcher|meta-externalagent|meta-externalads|facebookexternalhit\" access.log \\\n  | tr 'A-Z' 'a-z' | sort | uniq -c\n\n# The pages people asked Meta AI to fetch\ngrep -i \"meta-externalfetcher\" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20",
        },
        {
          kind: "p",
          text: "Then test retrieval directly. Meta's Model API has a `web_search` tool, and its docs show how to return every result the model considered alongside the subset it cited. Run your target questions through it on a schedule — knowing the apps' prompts, personalization and partners may differ from the API's:",
        },
        {
          kind: "code",
          lang: "python",
          code: 'import os\nfrom openai import OpenAI\n\nclient = OpenAI(base_url="https://api.meta.ai/v1", api_key=os.environ["MODEL_API_KEY"])\n\nr = client.responses.create(\n    model="muse-spark-1.3",\n    input="What\'s a good carry-on backpack for a week in Lisbon?",\n    tools=[{"type": "web_search"}],\n    include=["web_search_call.results"],\n)\n\n# web_search_call.results = every URL retrieved\n# url_citation annotations on output_text = the URLs cited',
        },
        { kind: "h3", text: "A manual panel, across surfaces" },
        {
          kind: "p",
          text: "The API can't show you the WhatsApp answer, so check a short list of prompts by hand once a month, in the same account, in WhatsApp and the Meta AI app, and note who is named and which sources appear:",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            'Your brand as a question: "What is [brand] and is it any good?"',
            'Your category with a constraint: "Best [category] for [use case] under [price]"',
            'A comparison: "[brand] vs [competitor] for [use case]"',
            'A local or situational ask, if it fits: "Where can I get [product] in [city]?"',
            "A shopping ask in shopping mode, with and without an `@` mention of your account",
          ],
        },
      ],
    },
    {
      id: "unanswered",
      title: "What Meta hasn't said, and how to hedge each gap",
      blocks: [
        {
          kind: "p",
          text: "Meta documents less about how its assistant retrieves and cites than OpenAI, Google or Perplexity do. These are the gaps that change what you'd do, and the move that holds up whichever way each one resolves:",
        },
        {
          kind: "table",
          head: ["Open question", "Why it matters", "The hedge"],
          rows: [
            [
              "Which search engines supply web results",
              "You can't target one partner",
              "Rank in Google and Bing; allow `meta-webindexer`",
            ],
            [
              "Whether blocking `meta-externalagent` changes answers",
              'Meta describes it as training "or improving products by indexing content directly"',
              "Decide on training grounds alone; keep `meta-webindexer` open either way",
            ],
            [
              "Whether its fetchers run JavaScript",
              "Client-rendered text may never reach the model",
              "Server-render, then test with `curl`",
            ],
            [
              "How sources appear in WhatsApp, Instagram and Facebook",
              "You can't design for a layout you can't see",
              "Win the sentence: your name next to the fact",
            ],
            [
              "Whether answers on glasses carry sources",
              "A spoken answer has no visible link",
              "The same: be the brand that gets named",
            ],
            [
              "Which browser Meta's Muse agent uses",
              'Muse "can open a browser, fill out forms, and negotiate" from its own virtual machine, and Meta doesn\'t name its user agent',
              "Keep key flows usable by automated browsers — see the [Manus guide](/ai-seo/manus)",
            ],
            [
              "What referrer answer links carry",
              "Meta AI traffic hides in Social and Direct",
              "Custom channel, log checks and a prompt panel together",
            ],
          ],
        },
        {
          kind: "p",
          text: "One more agent to plan for: Meta launched [Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), a personal agent people can talk to in its own app or in WhatsApp, in the US on September 8, 2026, and it also owns Manus, [acquired in December 2025](https://www.theregister.com/2025/12/30/meta_acquires_manus/). Neither is Meta AI, but both browse for people — and the pages that serve an agent well are the same answer-first, server-rendered pages this guide asks for.",
        },
      ],
    },
  ],

  checklist: [
    {
      id: "allow-webindexer",
      title: "Allow meta-webindexer in robots.txt",
      detail:
        "Give it a named group, make sure no `User-agent: *` rule catches it, and repeat the rules on every subdomain.",
      impact: "high",
    },
    {
      id: "cdn-waf",
      title: "Let Meta's agents through your CDN and WAF",
      detail:
        "Blanket AI-bot rules can stop `meta-webindexer` and `meta-externalfetcher` whatever robots.txt says. Rate-limit rather than block.",
      impact: "high",
    },
    {
      id: "externalagent",
      title: "Decide on meta-externalagent deliberately",
      detail:
        "It collects training data. Blocking it is a training choice; Meta hasn't said it changes answers.",
      impact: "medium",
    },
    {
      id: "raw-html",
      title: "Serve the answer in raw HTML",
      detail:
        "Fetch your key pages with `curl` and the `meta-webindexer` user agent, and check your key sentences are in the response.",
      impact: "high",
    },
    {
      id: "named-sentence",
      title: "Put your name next to every key fact",
      detail:
        "Short, self-contained sentences that carry the brand name, near the top of the page — the unit a chat answer lifts and forwards.",
      impact: "high",
    },
    {
      id: "rank-classic",
      title: "Rank in Google and Bing",
      detail: "Meta names no search partner today; both have powered Meta AI before.",
      impact: "high",
    },
    {
      id: "captions",
      title: "Caption, say and show product names in posts",
      detail:
        "The post index is built from captions, transcripts and visual analysis. Use concrete words: the product, the place, the use case.",
      impact: "high",
    },
    {
      id: "public-accounts",
      title: "Keep business accounts public and handles consistent",
      detail:
        "Post search covers public posts plus what the asker can see, and filters by author. Match handles to your brand name.",
      impact: "medium",
    },
    {
      id: "community",
      title: "Earn public posts in Groups and from locals",
      detail:
        "Local, shopping and AI Mode answers draw on what real people say publicly in Groups, Reels and posts.",
      impact: "high",
    },
    {
      id: "catalog",
      title: "Keep your Meta product catalog in sync",
      detail:
        "If you sell on Facebook or Instagram, shopping answers can query Meta's catalog. Names, prices and stock should match your site.",
      impact: "medium",
    },
    {
      id: "link-previews",
      title: "Keep facebookexternalhit previews working",
      detail:
        "Open Graph tags in the first 1 MB, gzip and deflate, responses within a few seconds. Check with Meta's Sharing Debugger.",
      impact: "medium",
    },
    {
      id: "ga4",
      title: "Add a Meta AI channel in GA4",
      detail:
        "Match `meta.ai` above Referral; track Facebook link-shim sources separately, as a ceiling.",
      impact: "medium",
    },
    {
      id: "logs",
      title: "Watch Meta's agents in your logs",
      detail:
        "Track `meta-webindexer` coverage and `meta-externalfetcher` hits — fetches made because a person asked.",
      impact: "medium",
    },
    {
      id: "panel",
      title: "Run a monthly prompt panel",
      detail:
        "The same five prompts in WhatsApp and the Meta AI app, plus the Model API's `web_search` with results included.",
      impact: "medium",
    },
    {
      id: "publishers",
      title: "Publishers: ask about licensing",
      detail: "Linked news answers come from partners such as Reuters, CNN and USA Today.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Meta AI?",
      a: "Allow `meta-webindexer`, which Meta says helps Meta AI cite and link to your content, keep your answers in server-rendered HTML, and rank in Google and Bing. Then build a presence on Facebook, Instagram and Threads, whose public posts Meta AI also searches.",
    },
    {
      q: "What search engine does Meta AI use?",
      a: 'Meta doesn\'t say anymore. It announced Bing in 2023 and Google in 2024; its AI terms, effective May 13, 2026, mention only "select partners, like search engines." It also runs its own crawler, `meta-webindexer`, and searches posts on its own apps.',
    },
    {
      q: "What's the difference between Meta-WebIndexer and Meta-ExternalAgent?",
      a: 'Meta-WebIndexer "navigates the web to improve Meta AI search result quality," and Meta says allowing it helps Meta AI cite and link to you. Meta-ExternalAgent crawls for "training foundation AI models or improving products by indexing content directly." Allow the first; decide on the second.',
    },
    {
      q: "Should I block Meta-ExternalAgent?",
      a: "Only if you don't want your content used for training. Meta doesn't say what blocking it does to answers, so keep `meta-webindexer` allowed either way, and check your WAF isn't blocking every Meta agent at once.",
    },
    {
      q: "Does Meta AI respect robots.txt?",
      a: "`meta-webindexer`, `meta-externalagent` and `meta-externalads` are controlled by it. `meta-externalfetcher`, which fetches links at a user's request, \"may bypass robots.txt,\" and `facebookexternalhit` may bypass it for security checks. Meta's crawlers may cache robots.txt for up to 24 hours.",
    },
    {
      q: "How does Meta AI show sources in WhatsApp?",
      a: "Meta documents one pattern for Meta AI: sources you open by selecting Sources under the response. It publishes no WhatsApp-specific layout. Because answers arrive in a chat thread, often a group, your brand name in the sentence matters as much as the link.",
    },
    {
      q: "Does Meta AI use Facebook and Instagram posts as sources?",
      a: "Yes. Its tool list includes a semantic search over Facebook, Instagram and Threads posts from January 2025 on, built from captions, transcripts and visual analysis. Meta says answers weave in posts and Reels with credit to their creators, and Facebook's AI Mode answers from public Groups and Reels.",
    },
    {
      q: "Can Meta AI read JavaScript-rendered pages?",
      a: "Meta doesn't document it. Vercel's 2024 crawler study found `Meta-ExternalAgent` doesn't render JavaScript, so treat text that only appears after scripts run as invisible to Meta AI.",
    },
    {
      q: "Do Ray-Ban Meta glasses cite sources?",
      a: "Meta doesn't say. On audio-only glasses the answer is spoken, and a conversation started there can be picked up later in the Meta AI app's history tab. Meta Ray-Ban Display can show answers in the lens, but Meta hasn't described sources there either.",
    },
    {
      q: "How do I track traffic from Meta AI?",
      a: "Build a GA4 custom channel for `meta.ai`, since GA4's AI Assistant channel doesn't list Meta AI. In-app clicks may arrive through Facebook's link shim or as Direct, so pair analytics with log checks for `meta-webindexer` and `meta-externalfetcher` and a monthly prompt panel.",
    },
  ],

  sources: [
    {
      title: "Meta web crawlers",
      publisher: "Meta for Developers",
      href: "https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers",
    },
    {
      title: "Report a source or link used in a response by Meta AI",
      publisher: "Meta Help Center",
      href: "https://www.meta.com/help/artificial-intelligence/578066098711082/",
    },
    {
      title: "Toggle web search for incognito chats with Meta AI on or off",
      publisher: "Meta Help Center",
      href: "https://www.meta.com/help/artificial-intelligence/1510309990445305/",
    },
    {
      title: "How to turn Meta AI web search on or off",
      publisher: "WhatsApp Help Center",
      href: "https://faq.whatsapp.com/1493496052558860/?cms_platform=web",
    },
    {
      title: "Meta AI in WhatsApp",
      publisher: "WhatsApp",
      href: "https://www.whatsapp.com/meta-ai",
    },
    {
      title: "Meta AIs Terms of Service",
      publisher: "Meta",
      href: "https://www.facebook.com/legal/ai-terms",
    },
    {
      title: "Search grounding",
      publisher: "Meta Model API docs",
      href: "https://dev.meta.ai/docs/search-grounding",
    },
    {
      title: "Introducing Muse Spark",
      publisher: "Meta Newsroom",
      href: "https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs/",
    },
    {
      title: "New AI tools to help you make things happen on Facebook",
      publisher: "Meta Newsroom",
      href: "https://about.fb.com/news/2026/06/new-ai-tools-to-help-you-make-things-happen-on-facebook/",
    },
    {
      title: "Introducing the Meta AI app",
      publisher: "Meta Newsroom",
      href: "https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/",
    },
    {
      title: "Meet your new assistant: Meta AI, built with Llama 3",
      publisher: "Meta Newsroom",
      href: "https://about.fb.com/news/2024/04/meta-ai-assistant-built-with-llama-3/",
    },
    {
      title: "Meta Ray-Ban Display: AI glasses with an EMG wristband",
      publisher: "Meta Newsroom",
      href: "https://about.fb.com/news/2025/09/meta-ray-ban-display-ai-glasses-emg-wristband/",
    },
    {
      title: "Introducing Muse: a personal AI agent",
      publisher: "Meta Newsroom",
      href: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/",
    },
    {
      title: "AI glasses release notes",
      publisher: "Meta AI Glasses Help",
      href: "https://www.meta.com/help/ai-glasses/1809764829519902/",
    },
    {
      title: "Second quarter 2026 earnings call transcript",
      publisher: "Meta Investor Relations",
      href: "https://s21.q4cdn.com/399680738/files/doc_financials/2026/q2/META-Q2-2026-Earnings-Call-Transcript.pdf",
    },
    {
      title: "Fourth quarter 2025 earnings call transcript",
      publisher: "Meta Investor Relations",
      href: "https://s21.q4cdn.com/399680738/files/doc_financials/2025/q4/META-Q4-2025-Earnings-Call-Transcript.pdf",
    },
    {
      title: "Third quarter 2025 earnings call transcript",
      publisher: "Meta Investor Relations",
      href: "https://s21.q4cdn.com/399680738/files/doc_financials/2025/q3/META-Q3-2025-Earnings-Call-Transcript.pdf",
    },
    {
      title: "Expanding our AI partnership with Meta",
      publisher: "Microsoft Bing Blog",
      href: "https://blogs.bing.com/search/september-2023/Expanding-Our-AI-Partnership-with-Meta-(1)",
    },
    {
      title: "Meta integrates Google and Bing search results into AI assistant",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/meta-integrates-google-bing-search-results-into-ai-assistant/514291/",
    },
    {
      title: "Meta's new model is Muse Spark, and meta.ai chat has some interesting tools",
      publisher: "Simon Willison",
      href: "https://simonwillison.net/2026/Apr/8/muse-spark/",
    },
    {
      title: "Meta AI tool definitions (transcript)",
      publisher: "Simon Willison, GitHub Gist",
      href: "https://gist.github.com/simonw/e1ce0acd70443f93dcd6481e716c4304",
    },
    {
      title: "Meta Web Indexer: Meta's crawling surge in AI crawler logs",
      publisher: "Promptwatch",
      href: "https://promptwatch.com/data/meta-web-indexer",
    },
    {
      title: "Meta (Facebook) allegedly building its own search engine",
      publisher: "Search Engine Roundtable",
      href: "https://www.seroundtable.com/meta-facebook-search-engine-41840.html",
    },
    {
      title: "Meta is developing a search engine to power its AI chatbot",
      publisher: "Social Media Today",
      href: "https://www.socialmediatoday.com/news/meta-is-developing-a-search-engine-to-power-its-ai-chatbot/731272/",
    },
    {
      title: "Meta inks multiyear AI content licensing deal with Reuters",
      publisher: "SiliconANGLE",
      href: "https://siliconangle.com/2024/10/25/meta-inks-multiyear-ai-content-licensing-deal-reuters/",
    },
    {
      title: "Meta signs commercial AI data agreements with publishers",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2025/12/05/meta-signs-commercial-ai-data-agreements-with-publishers-to-offer-real-time-news-on-meta-ai",
    },
    {
      title: "WhatsApp is rolling out a Meta AI tab",
      publisher: "WABetaInfo",
      href: "https://wabetainfo.com/whatsapp-is-rolling-out-meta-ai-tab-to-centralize-ai-powered-tools/",
    },
    {
      title: "AI crawlers make up almost 80% of AI bot traffic",
      publisher: "Fastly",
      href: "https://www.fastly.com/press/press-releases/new-fastly-threat-research-reveals-ai-crawlers-make-up-almost-80-of-ai-bot",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "[GA4] Default channel group",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "Facebook referrals in Google Analytics",
      publisher: "Loves Data",
      href: "https://www.lovesdata.com/blog/facebook-referrals-in-google-analytics/",
    },
    {
      title: "IndexNow participating search engines",
      publisher: "IndexNow",
      href: "https://www.indexnow.org/searchengines.json",
    },
    {
      title: "Meta acquires Manus",
      publisher: "The Register",
      href: "https://www.theregister.com/2025/12/30/meta_acquires_manus/",
    },
  ],

  sameAs: [
    "https://www.wikidata.org/wiki/Q136002360",
    "https://en.wikipedia.org/wiki/Meta_AI_(chatbot)",
    "https://www.meta.ai",
  ],

  furtherReading: [
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Allow meta-webindexer and meta-externalfetcher, and make a deliberate call on meta-externalagent, alongside every other AI crawler.",
    },
    {
      title: "Open Graph generator",
      href: "/tools/open-graph-generator",
      description:
        "Build the tags facebookexternalhit reads for your preview card when a page is shared on Facebook, Instagram or Messenger.",
    },
    {
      title: "Manus SEO guide",
      href: "/ai-seo/manus",
      description:
        "The agent Meta acquired: how to be the page an AI agent reads, uses and cites when it browses for someone.",
    },
  ],
};
