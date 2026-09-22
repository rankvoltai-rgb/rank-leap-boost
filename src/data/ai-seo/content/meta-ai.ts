import type { EngineGuide } from "../types";

export const metaAi: EngineGuide = {
  slug: "meta-ai",
  metaTitle: "Meta AI SEO: The Technical Guide to Getting Cited by Meta AI",
  metaDescription:
    "How Meta AI finds and cites sources in WhatsApp, Facebook, Instagram and meta.ai: Meta-WebIndexer vs Meta-ExternalAgent, post search, and tracking Meta AI traffic.",
  keywords: [
    "Meta AI SEO",
    "get cited by Meta AI",
    "Meta-WebIndexer",
    "Meta-ExternalAgent robots.txt",
    "Meta AI web search",
    "Meta AI sources WhatsApp",
  ],
  headline: { lead: "Meta AI SEO:", accent: "the technical guide to getting cited by Meta AI" },
  subhead:
    "Meta AI reaches more than a billion people a month, with WhatsApp its leading surface. It searches the web through partners Meta no longer names and a fast-growing index of its own, and it searches Facebook, Instagram and Threads posts too. Here's which crawler to let in, what it cites, and how to measure it.",

  shortAnswer:
    "To get cited by Meta AI, allow **Meta-WebIndexer** in robots.txt — Meta says doing so \"helps us cite and link to your content in Meta AI's responses\" — and keep `Meta-ExternalFetcher` unblocked at your CDN. Serve the answer in server-rendered HTML, since Meta documents no JavaScript rendering. Then cover both places Meta AI looks: the open web, reached through unnamed search partners and Meta's own index, and public posts on Facebook, Instagram and Threads, which it searches directly.",

  takeaways: [
    '`Meta-WebIndexer` is Meta AI\'s search crawler: allowing it "helps us cite and link to your content," per Meta. `Meta-ExternalAgent` crawls for training.',
    'Meta no longer names its search partners. It announced Bing in 2023 and Google in 2024; its May 2026 terms say only "select partners, like search engines."',
    "Meta AI also runs a semantic search over Facebook, Instagram and Threads posts from January 2025 on. Your social presence is part of your index.",
    "Licensed publishers get linked news answers: Reuters since October 2024, and CNN, Fox News, USA Today, Le Monde and others since December 2025.",
    "`Meta-WebIndexer` went from about 2.2% to 37.8% of AI crawler requests in Promptwatch's logs between mid-July and August 9, 2026.",
    "GA4's AI Assistant channel doesn't name Meta AI, and Meta doesn't document the referrer its links carry. Measure with a custom channel, logs and an API panel.",
  ],

  facts: [
    { label: "Monthly Meta AI users (Oct 2025)", value: "1B+" },
    { label: "The crawler to allow for search", value: "Meta-WebIndexer", mono: true },
    { label: "Its leading surface (Meta, Jul 2026)", value: "WhatsApp" },
    { label: "Web-search partners Meta names today", value: "None" },
  ],

  preview: {
    prompt: "What's the best project management tool for a five-person team?",
    status: "Searched the web",
    answer:
      "**Plannora** is a strong pick for a five-person team: its free plan covers up to five users, and reviewers rate it the quickest of the popular tools to set up.",
    sources: [
      { domain: "plannora.io", title: "Plannora pricing: free for teams of up to 5" },
      { domain: "stackreview.co", title: "Best project management tools for small teams (2026)" },
      { domain: "founderforum.net", title: "What PM tool does your startup actually use?" },
    ],
  },

  profile: {
    retrieval: "Unnamed search partners, Meta's own web index, licensed news and Meta's posts",
    searchCrawler: "Meta-WebIndexer + Meta-ExternalFetcher",
    trainingCrawler: "Meta-ExternalAgent — Meta doesn't say whether answers change",
    rendersJs: "Not documented — Meta-ExternalAgent was seen not running JS",
    referrer: "Undocumented; GA4's AI Assistant channel doesn't name Meta AI",
    citationStyle: "Links in the answer and a Sources list under the response",
    biggestLever:
      "Allow Meta-WebIndexer and get discussed in public Facebook, Instagram, Threads posts",
  },

  sections: [
    {
      id: "how-meta-ai-answers",
      title: "How Meta AI answers with the web",
      blocks: [
        {
          kind: "p",
          text: 'Meta AI answers from the model when it can and searches when a question needs something current or specific. Meta\'s [Search grounding documentation](https://dev.meta.ai/docs/search-grounding), written for developers using the same model family, says the model "skips the search when it can answer confidently from its training data" and that simple factual questions "typically do not trigger a search." Since April 8, 2026 that model is **Muse Spark**, the first release from Meta Superintelligence Labs. It launched in the Meta AI app and on meta.ai, and on May 12, 2026 Meta said it was starting to bring it to Meta AI in WhatsApp, Instagram, Facebook, Messenger and Threads.',
        },
        {
          kind: "p",
          text: "What it searches is less documented than on any other major assistant. Meta announced Bing in 2023 and Google in 2024, but its current terms name no engine. Alongside those partners sit Meta's own crawler, `Meta-WebIndexer`, and a separate search over posts on Meta's apps. The tool names below come from Meta's API docs and from a tool list Meta AI returned to [Simon Willison](https://simonwillison.net/2026/Apr/8/muse-spark/) on launch day, which a Meta engineer confirmed belongs to the new harness.",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Meta AI decides whether to search",
              body: 'News, sports, prices, local and product questions search; stable knowledge comes from the model. Web search is a setting users can turn off; in incognito chats it "begins toggled on."',
              lever:
                "Decide on `Meta-ExternalAgent` deliberately: it collects training data, and unsearched answers come from what the model learned.",
            },
            {
              title: "It writes a main query plus alternatives",
              body: '`browser.search` takes a `primary_query`, a list of `alternative_queries`, an optional `since` date, and verticals for news, sports, weather, finance and local. For incognito chats, Meta\'s help center says the query goes to "select search engines without connecting it to your account."',
              lever:
                "Title pages the way people ask — product names, places, and the year where freshness matters.",
            },
            {
              title: "Partners and Meta's own index return results",
              body: 'Willison\'s tool dump describes the engine as undisclosed. `Meta-WebIndexer` exists "to improve Meta AI search result quality," and Meta ties it directly to citations and links.',
              lever:
                "Allow `Meta-WebIndexer`, and keep ranking in Google and Bing, the partners Meta has used before.",
            },
            {
              title: "Meta's own posts are searched too",
              body: "`meta_1p.content_search` runs semantic search over Facebook, Instagram and Threads posts from 2025 onward, and shopping questions can query Meta's product catalog and Marketplace.",
              lever:
                "Post on your own accounts and earn public posts from customers; both are retrievable.",
            },
            {
              title: "It opens and reads the pages it needs",
              body: "`browser.open` loads a full result and `browser.find` pattern-matches inside it. Meta doesn't document which user agent does the reading or whether it runs JavaScript.",
              lever:
                "Put the answer in the raw HTML, near the top, and don't block `Meta-ExternalFetcher` at your WAF.",
            },
            {
              title: "The answer cites a subset of what it read",
              body: 'Links appear in the response, with a **Sources** list under it. In the API, the retrieved results are "every source the model considered" and the citations "the subset it actually cited."',
              lever: "State each fact in one self-contained sentence a link can attach to.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "1B+",
              label:
                "monthly actives already use Meta AI, per Mark Zuckerberg — the latest MAU figure in Meta's earnings calls",
              source: {
                name: "Meta, Oct 2025",
                href: "https://s21.q4cdn.com/399680738/files/doc_financials/2025/q3/META-Q3-2025-Earnings-Call-Transcript.pdf",
              },
            },
            {
              value: "+60%",
              label:
                "more people interacting with Meta AI each day since Meta rebuilt it on Muse Spark",
              source: {
                name: "Meta, Jul 2026",
                href: "https://s21.q4cdn.com/399680738/files/doc_financials/2026/q2/META-Q2-2026-Earnings-Call-Transcript.pdf",
              },
            },
            {
              value: "37.8%",
              label:
                "of AI crawler requests in Promptwatch's logs came from Meta-WebIndexer on Aug 9, 2026, up from ~2.2% in mid-July",
              source: {
                name: "Promptwatch, Aug 2026",
                href: "https://promptwatch.com/data/meta-web-indexer",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Optimize for a chat, not a search page",
          text: 'Meta calls WhatsApp "the leading surface where people engage with Meta AI" (July 2026). In January 2026 its CFO [said](https://s21.q4cdn.com/399680738/files/doc_financials/2025/q4/META-Q4-2025-Earnings-Call-Transcript.pdf) usage is "primarily WhatsApp driven" in markets such as India and Indonesia, while in the US "Facebook is a stronger driver of engagement." These answers are read in a message thread, on a phone, often mid-conversation — so being named in the sentence matters as much as the link beside it.',
        },
      ],
    },
    {
      id: "crawlers",
      title: "Meta's five crawlers and robots.txt",
      blocks: [
        {
          kind: "p",
          text: 'Meta [documents five crawlers](https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers), each identified by a lowercase token such as `meta-webindexer/1.1`. Meta says it prefers "industry-standard practices like robots.txt rather than non-standard formats like NoAI tags," and that its crawlers may cache robots.txt "for up to 24 hours." There\'s no `FacebookBot` on the current page, so an old rule targeting it no longer maps to a documented Meta crawler.',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "Meta-WebIndexer",
              role: "search",
              purpose:
                'Navigates the web "to improve Meta AI search result quality for users." Meta: allowing it "helps us cite and link to your content in Meta AI\'s responses." Token: `meta-webindexer`.',
              robots: "yes",
              robotsNote: "Implied: Meta names only two agents that may bypass robots.txt",
              advice: "allow",
            },
            {
              token: "Meta-ExternalFetcher",
              role: "user",
              purpose:
                'Fetches individual links at a user\'s request and supports agentic features, "including helping AI navigate websites to complete tasks for users."',
              robots: "partial",
              robotsNote: 'Meta: "this crawler may bypass robots.txt rules."',
              advice: "allow",
            },
            {
              token: "Meta-ExternalAgent",
              role: "training",
              purpose:
                'Crawls "for use cases such as training foundation AI models or improving products by indexing content directly." Meta doesn\'t say what blocking it does to Meta AI answers.',
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "FacebookExternalHit",
              role: "other",
              purpose:
                'Builds the title, description and thumbnail preview when a link is shared in Meta\'s apps, "such as Facebook, Instagram, or Messenger."',
              robots: "partial",
              robotsNote: "May bypass robots.txt for security or integrity checks",
              advice: "allow",
            },
            {
              token: "Meta-ExternalAds",
              role: "other",
              purpose:
                'Crawls "for use cases such as improving advertising and other business-related products and services." Meta doesn\'t connect it to Meta AI answers.',
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "A [robots.txt](/glossary/robots-txt) that keeps you in Meta AI search and in link previews while opting out of training looks like this. Named groups override a `User-agent: *` block, and the rules must be repeated on every subdomain:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Meta AI search index: allow\nUser-agent: meta-webindexer\nAllow: /\n\n# User-requested fetches (may bypass robots.txt anyway)\nUser-agent: meta-externalfetcher\nAllow: /\n\n# Link previews in Meta's apps\nUser-agent: facebookexternalhit\nAllow: /\n\n# Model training: your call\nUser-agent: meta-externalagent\nDisallow: /\n\n# Ads and business products: your call\nUser-agent: meta-externalads\nDisallow: /",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Blocking Meta-ExternalAgent is a bet, not a switch",
          text: 'Meta\'s description of `Meta-ExternalAgent` covers training "or improving products by indexing content directly," and Meta doesn\'t say what a block does to answers. What it does document is that `Meta-WebIndexer` feeds Meta AI search, so keep that one open whatever you decide. Then check your CDN and WAF: a blanket "block AI bots" rule can stop every `meta-*` agent at once, whatever robots.txt says.',
        },
        {
          kind: "p",
          text: "Meta's crawlers are also heavy. [Fastly](https://www.fastly.com/press/press-releases/new-fastly-threat-research-reveals-ai-crawlers-make-up-almost-80-of-ai-bot) attributed **52%** of the AI crawler traffic it saw from mid-April to mid-July 2025 to Meta — more than Google (23%) or OpenAI (20%). Rate-limit if you must, but a `429` to `meta-webindexer` is a page Meta AI can't cite.",
        },
        {
          kind: "p",
          text: "Meta's page calls allowlisting by IP address \"more secure\" than by user agent, but the current version publishes no ranges. Meta's own network is [AS32934](https://ipinfo.io/AS32934); Meta doesn't document that every crawler request comes from it, but it's the first check when a `meta-*` user agent looks spoofed:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Routes announced by Meta's network (AS32934)\nwhois -h whois.radb.net -- '-i origin AS32934' | grep ^route | head",
        },
      ],
    },
    {
      id: "where-results-come-from",
      title: "Where Meta AI's results come from",
      blocks: [
        {
          kind: "p",
          text: "Meta AI draws on four pools. You can influence all four, but each has a different door:",
        },
        {
          kind: "table",
          head: ["Source", "What it supplies", "What's documented", "Your way in"],
          rows: [
            [
              "Search partners",
              "Web results for current questions",
              "Bing (Sept 2023) and Google (Apr 2024) were announced; the 2026 terms name no engine",
              "Rank in Google and Bing",
            ],
            [
              "Meta's own index",
              "Pages crawled by `Meta-WebIndexer`",
              'Meta says it improves Meta AI search and helps it "cite and link"',
              "Allow the crawler; serve clean HTML",
            ],
            [
              "Licensed news",
              "Real-time news with links to the publisher",
              "Reuters (Oct 2024); CNN, Fox News, USA Today, Le Monde and others (Dec 2025)",
              "Publishers: a licensing deal",
            ],
            [
              "Meta's platforms",
              "Public posts, Reels, Groups, Marketplace, the product catalog",
              "Post search from Jan 2025 on (per its tool list); Facebook's AI Mode (June 2026)",
              "Publish, and get discussed, on Facebook, Instagram and Threads",
            ],
          ],
        },
        { kind: "h3", text: "Search partners: named once, unnamed now" },
        {
          kind: "p",
          text: 'Microsoft announced in September 2023 that Bing would give Meta AI "more timely and up-to-date answers." In April 2024 Meta added Google, though [Search Engine Journal](https://www.searchenginejournal.com/meta-integrates-google-bing-search-results-into-ai-assistant/514291/) "could only get Meta AI to search using Bing" in its tests, and Ray-Ban Meta\'s [release notes](https://www.meta.com/help/ai-glasses/1809764829519902/) described glasses search as "powered in part by Bing." Since then Meta has stopped naming names. Its [AI terms](https://www.facebook.com/legal/ai-terms), effective May 13, 2026, say only that Meta "may share certain information with select partners, like search engines." You can\'t optimize for one partner, so being indexed and ranking in both Google and Bing remains the broadest route into the candidate pool.',
        },
        { kind: "h3", text: "Meta's own index is growing fast" },
        {
          kind: "p",
          text: "The Information reported in October 2024 that Meta was building a search engine that crawls the web, to reduce its reliance on Google and Bing ([Social Media Today's summary](https://www.socialmediatoday.com/news/meta-is-developing-a-search-engine-to-power-its-ai-chatbot/731272/)). `Meta-WebIndexer` is the visible result. In Promptwatch's logs it sat near 2.2% of AI crawler requests in mid-July 2026, then became the heaviest AI crawler it tracks, at 37.8% on August 9. Days earlier, Pieter Levels posted that Meta staff told him Meta is \"ALLEGEDLY\" building its own index so its AI searches don't end up at Google; [Search Engine Roundtable's report](https://www.seroundtable.com/meta-facebook-search-engine-41840.html) carried no comment from Meta. Treat it as unconfirmed — but the crawl volume is real.",
        },
        { kind: "h3", text: "Licensed news gets links" },
        {
          kind: "p",
          text: 'Meta\'s first AI news deal, with Reuters in October 2024, came with each such answer expected to "include a link to the Reuters story on which it\'s based" ([SiliconANGLE](https://siliconangle.com/2024/10/25/meta-inks-multiyear-ai-content-licensing-deal-reuters/)). In December 2025 Meta added CNN, Fox News, Fox Sports, Le Monde Group, People Inc., The Daily Caller, The Washington Examiner and USA Today; [TechCrunch](https://techcrunch.com/2025/12/05/meta-signs-commercial-ai-data-agreements-with-publishers-to-offer-real-time-news-on-meta-ai) reported those responses "will also include links to articles." For a publisher, a deal is the documented route to linked news answers.',
        },
        { kind: "h3", text: "Meta's own platforms are a second index" },
        {
          kind: "p",
          text: 'This is what makes Meta AI different. Its [tool list](https://gist.github.com/simonw/e1ce0acd70443f93dcd6481e716c4304) includes a "semantic search across Instagram, Threads, and Facebook posts," built from captions, visual analysis and transcripts, with "Data coverage: posts since 2025-01-01." At the Muse Spark launch Meta promised "Reels, photos, and posts woven directly into your answers, with credit back to the content creators," and local answers showing "public posts from locals who know the area." In June 2026 Facebook added [AI Mode](https://about.fb.com/news/2026/06/new-ai-tools-to-help-you-make-things-happen-on-facebook/), a search tab with answers "grounded in what people are saying publicly across our apps like in Groups and Reels." Shopping mode searches Facebook Marketplace "alongside options from across the internet."',
        },
      ],
    },
    {
      id: "surfaces",
      title: "Answers inside WhatsApp, Instagram, Facebook and glasses",
      blocks: [
        {
          kind: "p",
          text: "Meta AI isn't one interface. The same assistant answers in a standalone app, a website, three social apps, a messenger and a pair of glasses. Meta's [help center](https://www.meta.com/help/artificial-intelligence/578066098711082/) documents one constant: Meta AI \"may use sources and links from the internet to inform its responses,\" and you can review them by selecting **Sources** under the response. Beyond that, Meta publishes little about how each surface lays citations out.",
        },
        {
          kind: "table",
          head: ["Surface", "How people ask", "What sources look like"],
          rows: [
            [
              "Meta AI app and meta.ai",
              "A chat with Instant and Thinking modes, plus shopping mode",
              "Links in the answer and a **Sources** list under the response",
            ],
            [
              "WhatsApp",
              "The Meta AI chat, the search bar above your chats, or by mentioning Meta AI in a group",
              "Documented only generically; Meta publishes no WhatsApp-specific layout",
            ],
            [
              "Facebook",
              "AI Mode in search, and Meta AI on posts in Feed",
              "Answers grounded in public Groups and Reels; web links in AI Mode aren't documented",
            ],
            [
              "Instagram and Threads",
              "DMs and search; `@meta.ai` mentions in Threads are being tested",
              "Not separately documented",
            ],
            [
              "Ray-Ban Meta and Oakley Meta glasses",
              'By voice, with "Hey Meta"',
              "Spoken answers; the conversation continues in the app's history tab",
            ],
          ],
        },
        {
          kind: "p",
          text: "Two details matter for visibility. Incognito chats, launched on WhatsApp and the Meta AI app in Q2 2026, still search — Meta's [help center](https://www.meta.com/help/artificial-intelligence/1510309990445305/) says web search in them \"begins toggled on\" — so conversations even Meta can't see are part of your audience. On glasses, the answer is heard, not read: since April 2025 the Meta AI app has been the glasses' companion app, where a conversation started on glasses can be picked up from the history tab. Meta doesn't document whether sources appear there for spoken answers.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Meta's agents fetch pages too",
          text: 'On September 8, 2026 Meta launched [Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), a personal agent in its own app and in WhatsApp that "can open a browser, fill out forms, and negotiate" for people, starting in the US. Meta doesn\'t say which user agent that browser sends. Meta also owns Manus, [acquired in December 2025](https://www.theregister.com/2025/12/30/meta_acquires_manus/); the [Manus guide](/ai-seo/manus) covers making pages usable by agents.',
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "Meta publishes no rendering, freshness or structured-data guidance for Meta AI. What's documented is crawler access, link-preview requirements for `facebookexternalhit`, and how the search tool behaves in the API. The rest is inference, marked as such.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Meta-WebIndexer allowed",
              status: "required",
              note: "In robots.txt and at the WAF. It's the one agent Meta ties to citing and linking your content in Meta AI.",
            },
            {
              label: "Content in the raw HTML",
              status: "required",
              note: "Undocumented for `Meta-WebIndexer`, but Vercel saw `Meta-ExternalAgent` fetch pages without running JavaScript. Treat client-rendered text as invisible — see [server-side rendering](/glossary/server-side-rendering).",
            },
            {
              label: "Meta-ExternalFetcher not WAF-blocked",
              status: "helps",
              note: "It fetches at a user's request and may bypass robots.txt anyway. A WAF block only means the answer is built from someone else's page.",
            },
            {
              label: "Fast, error-free responses",
              status: "helps",
              note: "Meta's crawl volume makes aggressive rate limits tempting. A `429`, `5xx` or timeout to a Meta agent removes that page from the answer.",
            },
            {
              label: "The answer near the top",
              status: "helps",
              note: "The tool pattern-matches inside opened pages and passes extracted snippets to the model. A clear sentence early in the page is the easiest thing to find.",
            },
            {
              label: "Open Graph in the first 1 MB",
              status: "helps",
              note: 'Documented for `facebookexternalhit`: OG tags before the first 1 MB, gzip and deflate support, and a response "within a few seconds." It governs your preview card whenever the URL is shared in Meta\'s apps.',
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "No statement from Meta. The API hands the model extracted page text, so keep every fact in visible copy, not only in JSON-LD.",
            },
            {
              label: "Linked social profiles",
              status: "unconfirmed",
              note: "Meta AI's post search filters by author. `sameAs` links from your Organization schema to your Facebook, Instagram and Threads accounts can't hurt; Meta doesn't document entity matching.",
            },
            {
              label: "Sitemaps",
              status: "unconfirmed",
              note: "Not documented for `Meta-WebIndexer`. Keep one with honest `lastmod` values, referenced from robots.txt.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "Meta publishes llms.txt files for its own developer docs, but hasn't said its crawlers read other sites' files.",
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
          text: "Test the two agents that matter with Meta's own documented user-agent strings. The second command is the crawler simulation from Meta's page:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Does Meta\'s search crawler get your real content?\ncurl -s -A "meta-webindexer/1.1 (+/documentation/sharing/webmasters/web-crawlers)" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n# 0 = text rendered by JavaScript, or a WAF block\n\n# Meta\'s link-preview simulation\ncurl -v --compressed -H "Range: bytes=0-524288" -H "Connection: close" \\\n  -A "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" "$URL"',
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What Meta AI cites",
      blocks: [
        {
          kind: "p",
          text: "Independent citation research on Meta AI barely exists. The large AI-referral panels — [SE Ranking's](https://seranking.com/blog/ai-traffic-research-study/) (101,574 sites, June 2026) and [Similarweb's](https://aisearch.similarweb.com/blog/ai-referral-traffic-by-industry/) (September 2026) — don't break it out at all. The signals below lean on Meta's own documentation, and say so where they're our read.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Crawl permission",
              body: 'Meta says allowing `Meta-WebIndexer` "helps us cite and link to your content in Meta AI\'s responses" — the only ranking-adjacent statement it has made.',
              evidence: "official",
            },
            {
              title: "Public talk on Meta's apps",
              body: 'Meta says local, trending and shopping answers draw on public posts and creators across its apps, with "credit back to the content creators." Facebook\'s AI Mode answers from what people say publicly.',
              evidence: "official",
            },
            {
              title: "Licensed news",
              body: "Partner publishers' articles are linked in news answers by agreement: Reuters, CNN, Fox News, USA Today, Le Monde and others.",
              evidence: "official",
            },
            {
              title: "Pages that match the rewrite",
              body: "Each search sends a main query plus alternatives, with an optional date filter. Pages whose titles and opening lines match those phrasings, with a real date, are easier to retrieve.",
              evidence: "our-read",
            },
            {
              title: "Classic search rankings",
              body: "With partners unnamed and a history of Bing and Google, strong rankings in both are the broadest way into the candidate pool.",
              evidence: "our-read",
            },
            {
              title: "A trust gap to close",
              body: "In the Reuters Institute's six-country survey (Oct 2025), 12% trusted Meta AI against 29% for ChatGPT, and more people distrusted it than trusted it.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "p",
          text: "The practical upshot: Meta AI rewards the same answer-first, dated pages as other engines, plus something only Meta can search — [brand mentions](/glossary/brand-mentions) in public posts on Meta's own apps. A brand nobody discusses on Facebook, Instagram or Threads is missing from the part of Meta AI's retrieval no other engine has.",
        },
      ],
    },
    {
      id: "measurement",
      title: "Measuring Meta AI",
      blocks: [
        {
          kind: "p",
          text: "Meta publishes no webmaster console for Meta AI and doesn't document the referrer its answer links carry. GA4's AI Assistant channel names ChatGPT, Gemini, DeepSeek, Copilot and Grok in Google's [channel documentation](https://support.google.com/analytics/answer/9756891) — not Meta AI. Our read: clicks from the meta.ai website should show `meta.ai`, while links opened inside Facebook can pass through Meta's link shim, which [reports](https://www.lovesdata.com/blog/facebook-referrals-in-google-analytics/) as `l.facebook.com` on desktop and `lm.facebook.com` on mobile — mixed in with ordinary social clicks. Give Meta AI a custom channel, placed above Referral:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — Meta AI website\n(^|\\.)meta\\.ai$\n\n# Meta link shims — Meta AI mixed with ordinary Facebook clicks\n^(l|lm|m)\\.facebook\\.com$",
        },
        {
          kind: "p",
          text: "Your logs are more reliable. `meta-webindexer` hits show what Meta is indexing; `meta-externalfetcher` hits are pages fetched for a person's request — the closest thing to a live-demand signal Meta gives you:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Meta agent hits by type\ngrep -oiE \"meta-webindexer|meta-externalfetcher|meta-externalagent|meta-externalads|facebookexternalhit\" access.log \\\n  | tr 'A-Z' 'a-z' | sort | uniq -c\n\n# Pages Meta fetched on a user's request\ngrep -i \"meta-externalfetcher\" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20",
        },
        {
          kind: "p",
          text: "Finally, test retrieval directly. Meta's Model API offers a `web_search` tool whose internals carry the same `browser.search`, `browser.open` and `browser.find` names as the consumer app's tools, and it can return every result the model considered alongside the subset it cited. Run your target questions through it on a schedule — with the caveat that the app's prompts, personalization and partners may differ:",
        },
        {
          kind: "code",
          lang: "python",
          code: 'import os\nfrom openai import OpenAI\n\nclient = OpenAI(base_url="https://api.meta.ai/v1", api_key=os.environ["MODEL_API_KEY"])\n\nr = client.responses.create(\n    model="muse-spark-1.3",\n    input="What\'s the best project management tool for a five-person team?",\n    tools=[{"type": "web_search"}],\n    include=["web_search_call.results"],\n)\n\n# web_search_call.results = every URL retrieved\n# url_citation annotations on output_text = the URLs cited',
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
              myth: "Blocking Meta-ExternalAgent removes you from Meta AI.",
              reality:
                "Meta ties search citations to `Meta-WebIndexer`. A `Meta-ExternalAgent` block stops training collection; what it does to answers isn't documented.",
            },
            {
              myth: "Meta AI is just Bing.",
              reality:
                "Bing was the first partner in 2023 and Google joined in 2024, but Meta names neither today — and it runs its own crawler and searches its own platforms.",
            },
            {
              myth: "Allowing facebookexternalhit covers Meta AI.",
              reality:
                "It only builds link previews. Meta AI search uses `Meta-WebIndexer`, a separate token.",
            },
            {
              myth: "NoAI meta tags keep Meta out.",
              reality:
                'Meta says it follows robots.txt "rather than non-standard formats like NoAI tags." Put your rules in robots.txt.',
            },
            {
              myth: "Meta AI only cites websites.",
              reality:
                "It searches Facebook, Instagram and Threads posts too, and Facebook's AI Mode answers from public Groups and Reels.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "allow-webindexer",
      title: "Allow Meta-WebIndexer in robots.txt",
      detail:
        "Use the token `meta-webindexer`, make sure no `User-agent: *` rule catches it, and repeat the rules on every subdomain.",
      impact: "high",
    },
    {
      id: "cdn-waf",
      title: "Let Meta's agents through your CDN and WAF",
      detail:
        "Blanket AI-bot rules can block `meta-webindexer` and `meta-externalfetcher` regardless of robots.txt.",
      impact: "high",
    },
    {
      id: "externalagent",
      title: "Decide on Meta-ExternalAgent deliberately",
      detail:
        "It collects training data. Blocking it is a training choice; Meta hasn't said it changes answers.",
      impact: "medium",
    },
    {
      id: "ssr",
      title: "Serve the answer in raw HTML",
      detail:
        "Check with `curl` and the `meta-webindexer` user agent that your key sentences are in the response.",
      impact: "high",
    },
    {
      id: "rate-limits",
      title: "Rate-limit Meta's crawlers with care",
      detail:
        "Their volume is high, but a `429` to a search or fetch request is a page Meta AI can't cite.",
      impact: "medium",
    },
    {
      id: "link-previews",
      title: "Keep facebookexternalhit working",
      detail:
        "Open Graph tags in the first 1 MB, gzip and deflate, fast responses. Check with Meta's Sharing Debugger.",
      impact: "medium",
    },
    {
      id: "classic-seo",
      title: "Rank in Google and Bing",
      detail: "Meta names no search partner today; both have powered Meta AI before.",
      impact: "high",
    },
    {
      id: "answer-first",
      title: "Write answer-first, dated pages",
      detail:
        "One self-contained sentence per fact, a visible updated date, and titles that match how people ask.",
      impact: "high",
    },
    {
      id: "own-accounts",
      title: "Publish on Facebook, Instagram and Threads",
      detail:
        "Meta AI searches posts from January 2025 on. Your own accounts are citable, searchable surfaces.",
      impact: "high",
    },
    {
      id: "community",
      title: "Earn public posts about you",
      detail:
        "Local, trending and AI Mode answers draw on what people say in Groups, Reels and public posts.",
      impact: "high",
    },
    {
      id: "entity",
      title: "Link your site and social accounts",
      detail:
        "Organization schema with `sameAs` to your Facebook, Instagram and Threads profiles, and one consistent brand name.",
      impact: "medium",
    },
    {
      id: "publishers",
      title: "Publishers: ask about licensing",
      detail: "Linked news answers come from partners such as Reuters, CNN and USA Today.",
      impact: "low",
    },
    {
      id: "ga4",
      title: "Add a Meta AI channel in GA4",
      detail: "Match `meta.ai`, above Referral — GA4's AI Assistant channel doesn't name Meta AI.",
      impact: "medium",
    },
    {
      id: "logs",
      title: "Watch Meta's agents in your logs",
      detail:
        "Track `meta-webindexer` coverage and `meta-externalfetcher` hits, which are fetches made for a user.",
      impact: "medium",
    },
    {
      id: "api-panel",
      title: "Run a Muse Spark retrieval panel",
      detail:
        "Send your target questions through the Model API's `web_search` with results included, and log retrieved versus cited URLs.",
      impact: "medium",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Meta AI?",
      a: "Allow `Meta-WebIndexer`, which Meta says helps Meta AI cite and link to your content, keep your answers in server-rendered HTML, and rank in the classic search engines. Then build a presence on Facebook, Instagram and Threads, whose posts Meta AI also searches.",
    },
    {
      q: "What search engine does Meta AI use?",
      a: 'Meta doesn\'t say anymore. It announced Bing in 2023 and Google in 2024; its May 2026 terms mention only "select partners, like search engines." It also runs its own crawler, `Meta-WebIndexer`, and reportedly its own index.',
    },
    {
      q: "What is Meta-WebIndexer?",
      a: 'Meta\'s crawler for Meta AI search. Meta says it "navigates the web to improve Meta AI search result quality" and that allowing it helps Meta AI cite and link to your content. Its robots.txt token is `meta-webindexer`.',
    },
    {
      q: "Should I block Meta-ExternalAgent?",
      a: "Only if you don't want your content used for training. Meta describes it as crawling for \"training foundation AI models or improving products,\" and doesn't say what blocking it does to answers. Keep `Meta-WebIndexer` allowed either way.",
    },
    {
      q: "Does Meta AI respect robots.txt?",
      a: 'Mostly. `Meta-WebIndexer`, `Meta-ExternalAgent` and `Meta-ExternalAds` are controlled by it. `Meta-ExternalFetcher`, which fetches links at a user\'s request, "may bypass robots.txt rules," and `facebookexternalhit` may bypass it for security checks. Changes can take 24 hours to apply.',
    },
    {
      q: "Can Meta AI read JavaScript-rendered pages?",
      a: "Meta doesn't document it. Vercel's 2024 crawler study found `Meta-ExternalAgent` doesn't render JavaScript, so treat text that only appears after scripts run as invisible to Meta AI.",
    },
    {
      q: "How does Meta AI show sources in WhatsApp?",
      a: "Meta's help center describes one pattern for Meta AI: sources you review by selecting Sources under the response. It publishes no WhatsApp-specific layout. Because answers arrive in a chat thread, often a group, your brand name in the sentence matters as much as the link.",
    },
    {
      q: "Does Meta AI use Facebook and Instagram posts as sources?",
      a: "Yes. Its tool list includes a semantic search over Facebook, Instagram and Threads posts from January 2025 on, and Meta says answers weave in posts and Reels with credit to their creators. Facebook's AI Mode answers from public Groups and Reels.",
    },
    {
      q: "How do I track traffic from Meta AI?",
      a: "Build a GA4 custom channel for `meta.ai`, since GA4's AI Assistant channel doesn't name Meta AI. In-app clicks may arrive through Facebook's link shims, mixed with social traffic, so pair analytics with log checks for `meta-webindexer` and `meta-externalfetcher`.",
    },
  ],

  sources: [
    {
      title: "Meta web crawlers",
      publisher: "Meta for Developers",
      href: "https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers",
    },
    {
      title: "Search grounding",
      publisher: "Meta Model API Docs",
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
      title: "Meta AIs Terms of Service",
      publisher: "Meta",
      href: "https://www.facebook.com/legal/ai-terms",
    },
    {
      title: "Report a source or link used in a response by Meta AI",
      publisher: "Meta Help Center",
      href: "https://www.meta.com/help/artificial-intelligence/578066098711082/",
    },
    {
      title: "Toggle web search for incognito chats with Meta AI",
      publisher: "Meta Help Center",
      href: "https://www.meta.com/help/artificial-intelligence/1510309990445305/",
    },
    {
      title: "Q2 2026 earnings call transcript",
      publisher: "Meta Investor Relations",
      href: "https://s21.q4cdn.com/399680738/files/doc_financials/2026/q2/META-Q2-2026-Earnings-Call-Transcript.pdf",
    },
    {
      title: "Q3 2025 earnings call transcript",
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
      title: "Meta Web Indexer: Meta's crawling surge in AI crawler logs",
      publisher: "Promptwatch",
      href: "https://promptwatch.com/data/meta-web-indexer",
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
      title: "Meta signs commercial AI data agreements with publishers",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2025/12/05/meta-signs-commercial-ai-data-agreements-with-publishers-to-offer-real-time-news-on-meta-ai",
    },
    {
      title: "Meta inks multiyear AI content licensing deal with Reuters",
      publisher: "SiliconANGLE",
      href: "https://siliconangle.com/2024/10/25/meta-inks-multiyear-ai-content-licensing-deal-reuters/",
    },
    {
      title: "Generative AI and News Report 2025",
      publisher: "Reuters Institute",
      href: "https://reutersinstitute.politics.ox.ac.uk/sites/default/files/2025-10/Gen_AI_and_News_Report_2025.pdf",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
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
        "Allow meta-webindexer and meta-externalfetcher, and make a deliberate call on Meta-ExternalAgent, alongside every other AI crawler.",
    },
    {
      title: "AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "See how often Meta-WebIndexer and Meta-ExternalFetcher reach your pages — and which ones they skip.",
    },
    {
      title: "Manus SEO guide",
      href: "/ai-seo/manus",
      description:
        "The Meta-owned agent: how to be the page an AI agent reads, uses and cites when it browses for someone.",
    },
  ],
};
