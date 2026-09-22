import type { EngineGuide } from "../types";

export const mistral: EngineGuide = {
  slug: "mistral",
  metaTitle: "Mistral Le Chat SEO: The Technical Guide to Getting Cited (Now Vibe)",
  metaDescription:
    "How Mistral's Le Chat, now Vibe, finds and cites pages: Brave Search results, the MistralAI-Index, -User and -Training bots, snippet paraphrasing, and tracking.",
  keywords: [
    "Mistral Le Chat SEO",
    "get cited by Le Chat",
    "Mistral Vibe web search",
    "MistralAI-User",
    "MistralAI-Index robots.txt",
    "what search engine does Le Chat use",
  ],
  headline: { lead: "Le Chat SEO:", accent: "the technical guide to getting cited by Mistral" },
  subhead:
    "Mistral's assistant, renamed Vibe in May 2026, takes its web results from Brave, paraphrases the snippets in your buyer's language, and runs three crawlers of its own. Here's what to allow, what to rank for and how to measure it.",

  shortAnswer:
    'To get cited by Mistral\'s Le Chat, renamed **Vibe** on 28 May 2026, allow **MistralAI-Index** and **MistralAI-User** in robots.txt, keep Googlebot unblocked, and rank in **Brave Search**. Mistral\'s own API docs tag web results `"source": "brave"`, and a May 2026 capture of Le Chat found the same tag on every reference. Answers paraphrase search snippets in the user\'s language, often with the current year added to the query, so write dated pages whose title and opening lines answer the exact question.',

  takeaways: [
    "Le Chat became **Vibe** on 28 May 2026. The address (`chat.mistral.ai`), accounts and history carried over, and so did web search with citations.",
    "Mistral runs three bots: `MistralAI-Index` builds its search index, `MistralAI-User` fetches pages for users, and `MistralAI-Training` collects training data. Only the last is about training.",
    'Web results come from Brave\'s Search API. Brave said so in February 2025, Mistral\'s docs show `"source": "brave"`, and a May 2026 capture found it on every reference.',
    "In that capture Le Chat showed no sign of opening the pages. It paraphrased Brave's snippets, added the year to most queries and switched generic terms into English.",
    "In a June 2026 test Mistral was the only Western assistant that ran a pasted page's JavaScript. Search answers are built from Brave's snippets, so server-render anyway.",
    "Mistral is a small referrer: 0.85% of AI-referred visits in France and 0.24% across the EU (SE Ranking, Jan–May 2026). GA4's AI Assistant channel doesn't name it.",
  ],

  facts: [
    { label: "Le Chat's web results come from", value: "Brave Search" },
    { label: "The crawler to allow for search", value: "MistralAI-Index", mono: true },
    { label: "Of AI-referred visits in France", value: "0.85%" },
    { label: "Le Chat was renamed Vibe", value: "May 2026" },
  ],

  preview: {
    prompt: "Which project management tool keeps its data in the EU, for a five-person team?",
    status: "Web search",
    answer:
      "**Plannora** is the strongest fit: it hosts all customer data in Frankfurt, and its free tier covers teams of up to five users.",
    sources: [
      { domain: "plannora.io", title: "Plannora security and EU data residency" },
      { domain: "stackreview.co", title: "EU-hosted project management tools compared (2026)" },
      { domain: "equipes-saas.fr", title: "Gestion de projet : les outils hébergés en Europe" },
    ],
  },

  profile: {
    retrieval: "Brave Search API results, plus Mistral's own MistralAI-Index since 2026",
    searchCrawler: "MistralAI-Index + MistralAI-User",
    trainingCrawler: "MistralAI-Training — search unaffected",
    rendersJs: "Undocumented — a June 2026 test saw a pasted URL's JavaScript run",
    referrer: "chat.mistral.ai (referral; no UTM documented)",
    citationStyle: "Inline source links, a globe icon and a Sources panel under the answer",
    biggestLever: "Rank in Brave for the exact query, with snippet-ready, dated pages",
  },

  sections: [
    {
      id: "how-le-chat-searches",
      title: "How Le Chat searches and cites",
      blocks: [
        {
          kind: "p",
          text: 'Le Chat answers from its training data unless web search is switched on and the question needs something current. In Vibe you enable it from the `+` menu under **Tools**, and then, per Mistral\'s [web search docs](https://docs.mistral.ai/vibe/work/web-search-open-url), it "searches the web and weaves the findings into its response" when a question needs up-to-date information. Searches are metered: the Free plan gets "limited messages and web searches" and Pro and Team get "up to 5x" as many, per Mistral\'s [pricing page](https://mistral.ai/pricing).',
        },
        {
          kind: "p",
          text: "Mistral's product docs don't name a search provider. The rest of this pipeline comes from Mistral's API documentation and from the one detailed independent capture of Le Chat's search traffic, which [Nicolas Sitter](https://www.nicolassitter.com/research/how-mistral-searches-hotels-2026) logged across nine prompts from one account in May 2026.",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Vibe decides whether to search",
              body: "With the Web search tool on, it searches when a question needs current information. Otherwise the answer comes from training data, and on the Free plan searches run out.",
              lever:
                "Be in the training data too. Blocking `MistralAI-Training` keeps future content out of every answer that doesn't search.",
            },
            {
              title: "It writes one query, often with the year",
              body: 'Sitter saw one `web_search` call per hotel prompt, and "Mistral attaches the current year to most Brave queries even when the user didn\'t mention it." Brand comparisons got a light [fan-out](/glossary/query-fan-out): one parallel call per brand.',
              lever:
                'Match the literal query: the category, the place or product name, and an honest year in the title and a visible "updated" date.',
            },
            {
              title: "Brave returns results with snippets",
              body: 'Each result arrives with a title, URL, description, an array of snippets and a date, and every reference carries `"source": "brave"`. Since spring 2026 Mistral has also run its own index crawler; it hasn\'t said how the two are blended.',
              lever: "Rank in Brave's top results for the exact intent, not just the head term.",
            },
            {
              title: "It paraphrases, and may open a page",
              body: 'In Sitter\'s captures "Le Chat streams a paraphrase of the snippets," with no sign of it fetching the pages. Mistral says `MistralAI-User` "may visit a web page to help answer," and it opens any URL a user pastes.',
              lever:
                "Make the title, meta description and first paragraph state the answer on their own. That's the text the model is most likely to see.",
            },
            {
              title: "It answers with links and a Sources panel",
              body: "Mistral's docs describe a globe icon next to the response, inline links to the sources, and a **Sources** button at the bottom that opens a panel listing every reference. News answers add a news icon for AFP and AP content.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "0.85%",
              label:
                "of website visits sent by AI tools in France come from Mistral: 3.5x its 0.24% share across the EU",
              source: {
                name: "SE Ranking, Jun 2026",
                href: "https://seranking.com/blog/mistral-ai-traffic-research/",
              },
            },
            {
              value: "#32",
              label:
                "chat.mistral.ai's rank among the most-visited AI chatbot and tool sites in August 2026",
              source: {
                name: "Similarweb, Sep 2026",
                href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
              },
            },
            {
              value: "2,300",
              label: "AFP stories a day, in six languages, feeding Le Chat's news answers",
              source: {
                name: "TechCrunch, Jan 2025",
                href: "https://techcrunch.com/2025/01/16/mistral-signs-deal-with-afp-to-offer-up-to-date-answers-in-le-chat",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Le Chat is now Vibe, and nothing you need to change moved",
          text: "On 28 May 2026 Mistral [renamed Le Chat to Vibe](https://mistral.ai/news/vibe-agent/), \"one agent and one licence across work and code,\" with Work, Code and Chat modes. The [help center](https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe) confirms that `chat.mistral.ai` stays the entry point and that accounts, plans and conversations carried over. Mistral's crawlers kept their names and the address didn't change, so everything below applies under either name. Deep Research has left the Chat tab: it now runs as a Skill in Work.",
        },
      ],
    },
    {
      id: "crawlers",
      title: "Mistral's three crawlers",
      blocks: [
        {
          kind: "p",
          text: 'Mistral [documents three bots](https://docs.mistral.ai/robots), each with its own [robots.txt](/glossary/robots-txt) token. The page says Mistral "uses specific robots.txt tags" to help webmasters manage access. It is explicit about compliance only for training ("Webmasters can disallow this user agent in their robots.txt file"). For `MistralAI-User` it says the token "governs which sites these user requests can be made to." It doesn\'t mention `Crawl-delay`, CAPTCHAs or `X-Robots-Tag`.',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "MistralAI-Index",
              role: "search",
              purpose:
                'Automated crawling "for indexing purposes only." It indexes content for Mistral search, which helps answer questions in Vibe, and is "not used for generative AI training of any kind." IPs: `mistral.ai/mistralai-index-ips.json`.',
              robots: "yes",
              robotsNote:
                "Listed as a robots.txt tag; the page doesn't spell out how it handles each rule.",
              advice: "allow",
            },
            {
              token: "MistralAI-User",
              role: "user",
              purpose:
                'Visits a page when a user\'s question needs it, and links the source in the answer. "Not used for crawling the web in any automatic fashion, nor to crawl content for generative AI training." IPs: `mistral.ai/mistralai-user-ips.json`.',
              robots: "yes",
              robotsNote:
                'Mistral: the token "governs which sites these user requests can be made to."',
              advice: "allow",
            },
            {
              token: "MistralAI-Training",
              role: "training",
              purpose:
                'Crawls web content to build datasets for training Mistral\'s models. "Not used for search indexing or to answer live user queries." Mistral publishes no IP list for it.',
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "Two of the three are new. As late as February 2026 the page listed only `MistralAI-User` ([archived copy](https://web.archive.org/web/20260219043556/https://docs.mistral.ai/robots)). `MistralAI-Index` appeared that spring, and its IP file is dated 19 April 2026. `MistralAI-Training` was added between the page's archived July and August 2026 copies. A robots.txt written before then won't name them, so only your `User-agent: *` rules apply.",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Mistral search index and live fetches: allow\nUser-agent: MistralAI-Index\nAllow: /\n\nUser-agent: MistralAI-User\nAllow: /\n\n# Model training: your call\nUser-agent: MistralAI-Training\nDisallow: /\n\n# Brave (Le Chat's web results) won't crawl what Googlebot can't\nUser-agent: Googlebot\nAllow: /",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "The crawler that matters most isn't Mistral's",
          text: 'Le Chat\'s web results come from Brave, and Brave\'s [crawler documentation](https://search.brave.com/help/brave-search-crawler) says it "does not advertise a differentiated user agent" and that "if a domain or page is not crawlable by Googlebot, then Brave Search\'s bot will not crawl it either." A Googlebot block therefore removes you from Le Chat\'s main source. Brave also says robots.txt "is not used to prevent a page from being indexed." To delist from Brave, use a `noindex` directive.',
        },
        {
          kind: "p",
          text: "Then check your CDN and WAF, since blanket AI-bot rules override robots.txt. Mistral's IP lists are short: four addresses for `MistralAI-User` and two for `MistralAI-Index` as of September 2026. Allowlist them rather than the user-agent strings, which anyone can spoof.",
        },
      ],
    },
    {
      id: "search-backend",
      title: "Where Le Chat's results come from",
      blocks: [
        {
          kind: "p",
          text: "Mistral's product docs don't name Le Chat's search provider. Four pieces of evidence point to Brave, and one points to a change:",
        },
        {
          kind: "list",
          items: [
            '**Brave said so.** When the Le Chat apps launched on 6 February 2025, [Brave posted](https://x.com/brave/status/1887612739779965265) that "this AI assistant utilizes Brave Search API for its live web results."',
            '**Mistral\'s API docs show it.** In the [Websearch tool documentation](https://docs.mistral.ai/studio/agents/agent-tools/websearch), every citation in the example output is a `tool_reference` chunk with `"source": "brave"`. The API has two tiers: `web_search` (a search engine) and `web_search_premium` (a search engine plus news with "integrated news provider verification").',
            '**Le Chat\'s own traffic shows it.** Sitter\'s May 2026 capture of Le Chat\'s response stream found that "every reference carries `"source": "brave"`." It predates the Vibe rename by a few weeks; we found no capture made since.',
            "**The query is Brave-shaped.** In the same capture, generic terms were switched into English for Brave while named places stayed in the user's language. More on that below.",
            '**Mistral is building its own index.** Since spring 2026 `MistralAI-Index` has crawled for "Mistral search." Mistral hasn\'t said whether that index supplements Brave or will replace it. Plan for both: allow the bot, and rank in Brave.',
          ],
        },
        {
          kind: "p",
          text: "Getting into Brave works the same way it does for Claude, which also searches Brave: rank on Google and Bing, earn links from pages Brave already knows, and request a crawl through Brave's [Submit URL](https://search.brave.com/submit-url) form. Our [Claude guide](/ai-seo/claude) covers Brave indexing step by step.",
        },
        {
          kind: "h3",
          text: "News comes from AFP and AP",
        },
        {
          kind: "p",
          text: 'Mistral signed a multi-year deal with Agence France-Presse on 16 January 2025, its first of the kind. It covers "2,300 wires in six languages: French, English, Spanish, Portuguese, German, and Arabic," and [TechCrunch reported](https://techcrunch.com/2025/01/16/mistral-signs-deal-with-afp-to-offer-up-to-date-answers-in-le-chat) that Le Chat can query AFP\'s archive back to 1983. The current docs name AFP and the Associated Press: "for news queries, Work draws from professional news partners," shown with a news icon, and "sources link directly to the original agency reporting." We found no Mistral announcement of an AP deal. For news, then, you compete with the wires. Our read is that the way in is what they don\'t carry: primary data, specialist analysis and local detail.',
        },
        {
          kind: "h3",
          text: "Open URL and Deep Research",
        },
        {
          kind: "table",
          head: ["Mode", "What it reads", "Your lever"],
          rows: [
            [
              "**Web search**",
              "Brave results (titles, snippets, dates), sometimes the page itself",
              "Brave ranking and an opening that answers on its own",
            ],
            [
              "**News**",
              "AFP and AP wires alongside web results",
              "Primary facts and analysis the wires don't have",
            ],
            [
              "**Open URL**",
              "The single page a user pastes, fetched live. No login or paywalled pages",
              "Allow `MistralAI-User` and keep the answer unwalled",
            ],
            [
              "**Deep Research**",
              "A multi-step search plan across many sources, as a Skill in Work",
              "Depth, primary sources and pages that survive scrutiny",
            ],
          ],
        },
        {
          kind: "p",
          text: "[Deep Research](https://docs.mistral.ai/vibe/chat-legacy/deep-research) proposes a search plan the user can edit, runs in the background, and returns a report with a summary, inline citations and a list of every source, which can be saved as a PDF. Mistral doesn't publish how many sources a run reads.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: 'Mistral documents little about how it fetches. Its docs make three admissions: pages "behind a login or paywall can\'t be accessed," "some highly interactive websites may not load fully," and web search "can return outdated or incomplete content depending on what the source page exposes." The rest is inference from Brave\'s behavior and independent tests.',
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Crawlable by Googlebot",
              status: "required",
              note: "Brave mirrors Googlebot's robots rules and has no user agent of its own. Block Googlebot and you leave Le Chat's main source.",
            },
            {
              label: "Mistral's bots allowed",
              status: "required",
              note: "`MistralAI-Index` and `MistralAI-User` in robots.txt, and their published IPs at the WAF, including bot-fight modes and AI-bot managed rules.",
            },
            {
              label: "No walls on citable content",
              status: "required",
              note: "Mistral says login-protected and paywalled pages can't be read. Interstitials and cookie walls in front of the answer do the same damage.",
            },
            {
              label: "Answer in the snippet zone",
              status: "helps",
              note: "Le Chat paraphrased Brave's snippets in the May 2026 capture. The title, meta description and opening lines are what it most likely sees, so they have to carry the fact.",
            },
            {
              label: "Server-rendered HTML",
              status: "helps",
              note: "A June 2026 test saw Mistral run a pasted page's JavaScript, but search answers come from Brave's crawl, and Mistral warns that interactive sites may not load fully. [Server-render](/glossary/server-side-rendering) the answer.",
            },
            {
              label: "Visible, honest dates",
              status: "helps",
              note: "Brave results carry a date, and Le Chat adds the year to most queries. Show a real updated date and keep `dateModified` accurate.",
            },
            {
              label: "Pages in your buyers' language",
              status: "helps",
              note: "Answers always matched the prompt's language in Sitter's captures. A French buyer gets a French answer, built from whatever Brave returns.",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "No statement from Mistral. The model works from snippets and page text, so keep every fact that matters in visible copy too.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "Mistral publishes its own at `docs.mistral.ai/llms.txt` but has never said Vibe reads other sites' files.",
            },
            {
              label: "IndexNow",
              status: "no-effect",
              note: "Neither Brave nor Mistral is on [IndexNow's list](https://www.indexnow.org/searchengines.json) of participating engines. It still helps with Bing.",
            },
          ],
        },
        {
          kind: "p",
          text: "Test what Mistral's fetcher receives. If your key sentence isn't in the response, the bot is blocked, challenged or served a JavaScript shell:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Does your server (and WAF) serve Mistral\'s fetcher the real content?\ncurl -s -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-User/1.0; +https://docs.mistral.ai/robots)" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n\n# Repeat with MistralAI-Index/1.0 in place of MistralAI-User/1.0\n# 0 = blocked, challenged, or the text needs JavaScript',
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What Le Chat cites",
      blocks: [
        {
          kind: "p",
          text: "We found no large-scale independent study of Le Chat's citations. The best evidence is Sitter's nine captures of hotel prompts in May 2026, plus what Mistral documents. Weigh the signals below accordingly, and test in your own category before you act on them.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Brave ranking for the exact intent",
              body: 'Every captured reference was a Brave result. Sitter\'s conclusion: the unlock is being "on the page Brave ranks #1 for the exact intent," not just somewhere in the category.',
              evidence: "observed",
            },
            {
              title: "Snippet-ready openings",
              body: "Answers were paraphrased from Brave's snippets, not from full pages. A page whose title and first lines state the fact is the one whose fact survives.",
              evidence: "observed",
            },
            {
              title: "The current year",
              body: "Mistral added the year to most Brave queries unprompted. Pages that honestly carry it, in titles and visible dates, match those queries.",
              evidence: "observed",
            },
            {
              title: "Specialists win niche questions",
              body: 'Niche prompts surfaced specialist sites. Generic city-and-tier prompts surfaced SEO-spam aggregators, which Mistral paraphrased "without a quality filter." Target the specific questions.',
              evidence: "observed",
            },
            {
              title: "Wire-grade news",
              body: "For news queries Mistral draws on AFP and AP, shown with their own icon and linked to the agency's reporting.",
              evidence: "official",
            },
            {
              title: "Few, visible sources",
              body: "Each answer shows inline links plus one Sources panel. With so little independent data, measure your own citation rate over repeated runs rather than one screenshot.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "p",
          text: 'One warning from the same study: Le Chat made claims its sources didn\'t support. It described a Mama Shelter hotel in Vienna, a city where Sitter notes the chain has no property, using Prague review snippets, and turned one TripAdvisor complaint into "a significant number of reviews." If Le Chat misstates your product, the fix is in the snippet, so make the correct fact explicit where Brave will extract it.',
        },
      ],
    },
    {
      id: "language-europe",
      title: "Language and the European audience",
      blocks: [
        {
          kind: "p",
          text: "Le Chat's audience is concentrated where Mistral is: SE Ranking's study of 101,574 Google Analytics sites found Mistral sends 0.85% of AI-referred visits in France, about 3.5x its share across the EU, where it ranks sixth among AI referrers. Mistral's [product page](https://mistral.ai/products/vibe/) lists ASML, BNP Paribas, CMA CGM, the Government of Luxembourg, Stellantis and SNCF among its customers. If you sell to French or European organizations, Le Chat matters more than its global numbers suggest.",
        },
        {
          kind: "list",
          items: [
            "**Answer in the prompt's language.** In Sitter's captures, \"Italian in, Italian out. French in, French out.\" Publish the pages your European buyers need in their language.",
            '**Expect a code-switched query.** A French prompt for "un hôtel boutique à Bordeaux mais pas Saint Pierre" became the Brave query "boutique hotel Bordeaux hors quartier Saint Pierre." Generic terms with richer English results were switched to English; named places stayed as they were.',
            '**Use both vocabularies where buyers do.** Our read: on local-language pages, keep the English category term that buyers and Brave use ("CRM", "boutique hotel") next to the local one, and write named entities exactly as locals do.',
            "**Rank in Brave per market.** Check the results for the query as Le Chat would write it, in each language, with the year appended.",
          ],
        },
      ],
    },
    {
      id: "measurement",
      title: "Tracking Le Chat traffic and crawls",
      blocks: [
        {
          kind: "p",
          text: "Mistral doesn't document how outbound links are tagged, and we found no evidence of UTM parameters. Cloudflare attributes AI [referrals](/glossary/ai-referral-traffic) by the `Referer` hostname and counts Mistral's, so expect web clicks to carry the app's address, `chat.mistral.ai`. GA4's default **AI Assistant** channel, [added on 13 May 2026](https://support.google.com/analytics/answer/9164320), doesn't name Mistral: Google's [channel documentation](https://support.google.com/analytics/answer/9756891) lists \"ChatGPT, Gemini, Deepseek, Copilot, or Grok,\" and doesn't publish the full list. Check where your `chat.mistral.ai` sessions land. If they're in Referral, add a custom channel above it:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — Mistral's assistant (Le Chat / Vibe)\n^chat\\.mistral\\.ai$\n\n# Session source — all major AI assistants\nchat\\.mistral\\.ai|chatgpt\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Cloudflare saw almost no Mistral referrals in July 2026",
          text: "In late June 2025 [Cloudflare measured](https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/) Mistral sending 10 referrals for every crawl request, a ratio of 0.1:1. By June 2026 the ratio on Cloudflare Radar was 178:1, and in four of July 2026's five weeks Radar recorded no Mistral referrals at all, per [TechnologyChecker's analysis](https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report). That follows the Vibe relaunch and the new crawlers. Mistral hasn't said whether its links now withhold the referrer. Compare your `chat.mistral.ai` sessions before and after 28 May 2026, and watch Direct.",
        },
        {
          kind: "p",
          text: "Server logs show what referrer data can't. `MistralAI-User` hits are real conversations that needed your page, and `MistralAI-Index` hits show what Mistral's own index is picking up:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Mistral bot hits by type\ngrep -oE "MistralAI-(User|Index|Training)" access.log | sort | uniq -c\n\n# Pages Mistral fetched for users: your live-demand list\ngrep "MistralAI-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
        },
        {
          kind: "p",
          text: "Verify hits against `mistral.ai/mistralai-user-ips.json` and `mistral.ai/mistralai-index-ips.json`. `MistralAI-Training` has no published list, and Brave's crawler can't be picked out by user agent at all. For citations themselves, run a fixed [prompt panel](/glossary/prompt-tracking) in Vibe with web search on, in each language you sell in.",
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
              myth: "Blocking Mistral's training crawler hides you from Le Chat.",
              reality:
                '`MistralAI-Training` is "not used for search indexing or to answer live user queries." Search runs on Brave, `MistralAI-Index` and `MistralAI-User`, which are separate rules.',
            },
            {
              myth: "Le Chat searches Google.",
              reality:
                "Its web results come from Brave's Search API: Brave said so, and Mistral's own API output tags results `\"source\": \"brave\"`. Google matters only indirectly, because Brave won't crawl what Googlebot can't.",
            },
            {
              myth: "Le Chat reads your whole page.",
              reality:
                "In the May 2026 capture it paraphrased Brave's snippets, with no sign of opening the pages. It fetches a page when a user pastes the URL or `MistralAI-User` decides to, so your opening lines carry most of the load.",
            },
            {
              myth: "Le Chat is gone, so there's nothing to optimize.",
              reality:
                "It was renamed, not retired. Vibe runs at the same `chat.mistral.ai` address, Mistral's crawlers kept their names, and the Chat tab keeps the old Le Chat features.",
            },
            {
              myth: "Mistral runs JavaScript, so client-side rendering is fine.",
              reality:
                "One June 2026 test saw it render a pasted URL. Search answers are built from Brave's snippets, and Mistral itself warns that interactive sites may not load fully.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "robots",
      title: "Allow MistralAI-Index and MistralAI-User in robots.txt",
      detail:
        "Name them explicitly: `MistralAI-Index` only appeared in spring 2026, so older files won't mention it. Repeat the rules on every subdomain.",
      impact: "high",
    },
    {
      id: "waf",
      title: "Allowlist Mistral's published IPs at the CDN and WAF",
      detail:
        "Use `mistral.ai/mistralai-user-ips.json` and `mistral.ai/mistralai-index-ips.json`, and exempt them from blanket AI-bot and bot-fight rules.",
      impact: "high",
    },
    {
      id: "googlebot",
      title: "Never block Googlebot on pages you want in Le Chat",
      detail:
        "Brave, Le Chat's result source, won't crawl what Googlebot can't, and has no user agent you can allow by name.",
      impact: "high",
    },
    {
      id: "brave-rank",
      title: "Check your Brave rankings for the exact questions",
      detail:
        "Search on search.brave.com the way Le Chat writes queries: specific intent, the year appended, in each buyer language.",
      impact: "high",
    },
    {
      id: "brave-index",
      title: "Get indexed in Brave",
      detail:
        "Rank on Google and Bing, earn links from sites Brave knows, and use Brave's Submit URL form after major changes.",
      impact: "high",
    },
    {
      id: "snippet",
      title: "Put the answer in the title, description and first lines",
      detail:
        "Le Chat paraphrases search snippets. State the fact, with names and numbers, where Brave will extract it.",
      impact: "high",
    },
    {
      id: "dates",
      title: "Show freshness honestly",
      detail:
        "A visible updated date, an accurate `dateModified`, and the current year in titles only where it's true.",
      impact: "medium",
    },
    {
      id: "languages",
      title: "Publish in the languages your buyers prompt in",
      detail:
        "Answers follow the prompt's language. Keep the English category term next to the local one on local pages.",
      impact: "medium",
    },
    {
      id: "ssr",
      title: "Server-render the pages you want cited",
      detail:
        "Don't rely on one test of Mistral running JavaScript. Brave's snippets and most AI fetchers need the answer in raw HTML.",
      impact: "medium",
    },
    {
      id: "walls",
      title: "Keep citable pages free of logins and walls",
      detail:
        "Mistral can't read login-protected or paywalled pages. Keep cookie walls and interstitials out of the way of the answer.",
      impact: "medium",
    },
    {
      id: "training",
      title: "Decide on MistralAI-Training deliberately",
      detail:
        "Blocking it doesn't affect search, but every answer that doesn't search, including Free-plan users out of searches, comes from training data.",
      impact: "medium",
    },
    {
      id: "news",
      title: "Publishers: give Le Chat what the wires don't",
      detail:
        "News answers lean on AFP and AP. Primary data, specialist analysis and local detail are how an outlet gets cited alongside them.",
      impact: "low",
    },
    {
      id: "measure",
      title: "Set up measurement and watch for lost referrers",
      detail:
        "A GA4 custom channel on `chat.mistral.ai`, a before-and-after check around 28 May 2026, and a weekly log count of Mistral bot hits.",
      impact: "medium",
    },
    {
      id: "panel",
      title: "Run a repeated prompt panel in Vibe",
      detail:
        "Fixed prompts, web search on, in every market language, re-run monthly. See [citation tracking](/features/citation-tracking).",
      impact: "medium",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Le Chat?",
      a: "Allow `MistralAI-Index` and `MistralAI-User`, keep Googlebot unblocked, and rank in Brave Search for the specific questions your buyers ask, since Le Chat's web results come from Brave. Then make each page's title, description and opening lines state the answer, with an honest date, in the language your buyers use.",
    },
    {
      q: "Is Le Chat the same as Mistral Vibe?",
      a: "Yes. Mistral renamed Le Chat to Vibe on 28 May 2026 and added Work and Code modes. It still runs at `chat.mistral.ai`, accounts and conversations carried over, and the Chat tab keeps the Le Chat features. The crawlers and search backend didn't change.",
    },
    {
      q: "What search engine does Le Chat use?",
      a: 'Brave. Brave announced in February 2025 that Le Chat uses its Search API for live web results, Mistral\'s API docs tag web results `"source": "brave"`, and an independent capture in May 2026 found that tag on every reference. Since spring 2026 Mistral has also crawled for its own index, `MistralAI-Index`, in an undisclosed role.',
    },
    {
      q: "What's the difference between MistralAI-User, MistralAI-Index and MistralAI-Training?",
      a: "`MistralAI-Index` crawls automatically to build Mistral's search index. `MistralAI-User` fetches a page only when a user's request needs it. `MistralAI-Training` collects data to train Mistral's models. Mistral says the first two aren't used for training and the third isn't used for search.",
    },
    {
      q: "How do I stop Mistral from training on my content?",
      a: "Disallow `MistralAI-Training` in robots.txt, which Mistral's crawler page explicitly supports. Search visibility is unaffected. Robots.txt only governs future crawling, and answers that don't search draw on training data.",
    },
    {
      q: "Can Le Chat read JavaScript-rendered pages?",
      a: "Mistral doesn't document it. In a June 2026 test Mistral was the only Western assistant of 12 that ran a pasted page's JavaScript. But search answers come from Brave's snippets, and Mistral warns that interactive sites may not load fully, so server-render anything you want cited.",
    },
    {
      q: "How do I track traffic from Le Chat?",
      a: "Look for session source `chat.mistral.ai`. Mistral documents no UTM tagging, and Google doesn't name Mistral in GA4's AI Assistant channel, so add a custom channel. Cloudflare Radar recorded almost no Mistral referrals in July 2026, so compare your numbers before and after 28 May 2026 and check Direct.",
    },
    {
      q: "Does Le Chat favor French or European sources?",
      a: "Mistral doesn't say it does. What's observed is that answers follow the prompt's language, Brave queries mix English category terms with local names, and Mistral's audience skews French: 0.85% of AI-referred visits in France, about 3.5x its EU share (SE Ranking, 2026).",
    },
  ],

  sources: [
    {
      title: "Mistral crawlers",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/robots",
    },
    {
      title: "Mistral crawlers (archived, February 2026)",
      publisher: "Internet Archive",
      href: "https://web.archive.org/web/20260219043556/https://docs.mistral.ai/robots",
    },
    {
      title: "Search the web",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/vibe/work/web-search-open-url",
    },
    {
      title: "Deep Research",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/vibe/chat-legacy/deep-research",
    },
    {
      title: "Websearch (Agents API)",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/studio/agents/agent-tools/websearch",
    },
    {
      title: "Vibe gets to work",
      publisher: "Mistral AI",
      href: "https://mistral.ai/news/vibe-agent/",
    },
    {
      title: "Le Chat is now Vibe",
      publisher: "Mistral Help Center",
      href: "https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe",
    },
    {
      title: "Purr-fectly informed: Mistral and AFP",
      publisher: "Mistral AI",
      href: "https://mistral.ai/news/mistral-afp/",
    },
    {
      title: "Mistral signs deal with AFP to offer up-to-date answers in Le Chat",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2025/01/16/mistral-signs-deal-with-afp-to-offer-up-to-date-answers-in-le-chat",
    },
    {
      title: "Pricing",
      publisher: "Mistral AI",
      href: "https://mistral.ai/pricing",
    },
    {
      title: "Le Chat uses Brave Search API for its live web results",
      publisher: "Brave on X",
      href: "https://x.com/brave/status/1887612739779965265",
    },
    {
      title: "Brave Search crawler",
      publisher: "Brave",
      href: "https://search.brave.com/help/brave-search-crawler",
    },
    {
      title: "How Mistral searches hotels (2026): inside the Brave-paraphrase pipeline",
      publisher: "Nicolas Sitter",
      href: "https://www.nicolassitter.com/research/how-mistral-searches-hotels-2026",
    },
    {
      title: "Do AI assistants actually render your JavaScript when grounding?",
      publisher: "Search Engine World",
      href: "https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test",
    },
    {
      title: "Mistral AI to become Europe's new default LLM? [2026 research data]",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/mistral-ai-traffic-research/",
    },
    {
      title: "Top AI chatbots and tools websites ranking",
      publisher: "Similarweb",
      href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
    },
    {
      title: "The crawl before the fall… of referrals",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/",
    },
    {
      title: "We analyzed robots.txt across Cloudflare's network",
      publisher: "TechnologyChecker.io",
      href: "https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "What's new in Google Analytics",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9164320",
    },
  ],

  sameAs: [
    "https://www.wikidata.org/wiki/Q132323422",
    "https://en.wikipedia.org/wiki/Mistral_Vibe",
  ],

  furtherReading: [
    {
      title: "Claude SEO guide",
      href: "/ai-seo/claude",
      description:
        "Claude also searches Brave. The full playbook for getting into Brave's index, which Le Chat relies on too.",
    },
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Allow MistralAI-Index and MistralAI-User, make a deliberate call on MistralAI-Training, and cover every other AI crawler.",
    },
    {
      title: "AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "See which pages Mistral's bots fetch, and whether its index crawler has found you yet.",
    },
    {
      title: "Citation tracking",
      href: "/features/citation-tracking",
      description:
        "Run a fixed prompt panel across Le Chat, ChatGPT, Claude, Perplexity and Google, and see who's cited instead of you.",
    },
  ],
};
