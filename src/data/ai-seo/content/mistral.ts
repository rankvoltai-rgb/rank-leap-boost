import type { EngineGuide } from "../types";

/* Facts checked 2026-10-26 against Mistral's docs (docs.mistral.ai/robots,
   /vibe, /vibe/work/web-search-open-url), the help center, the open-source
   Vibe Code client, Brave's crawler page and the studies cited below. */
export const mistral: EngineGuide = {
  slug: "mistral",
  metaTitle: "Mistral Vibe & Le Chat SEO: How to Get Cited by Mistral",
  metaDescription:
    "How Mistral Vibe, formerly Le Chat, picks sources: Brave results, the MistralAI-Index, -User and -Training bots, AFP and AP news, snippet paraphrasing and referrals.",
  keywords: [
    "Mistral Vibe SEO",
    "Le Chat SEO",
    "get cited by Mistral Vibe",
    "MistralAI-User",
    "MistralAI-Index robots.txt",
    "what search engine does Mistral Vibe use",
    "Mistral Le Chat web search",
  ],
  headline: { lead: "Mistral Vibe SEO:", accent: "how Le Chat's successor picks its sources" },
  subhead:
    "Vibe, the assistant Mistral called Le Chat until May 2026, answers from Brave Search results. It rewrites your buyer's question on the way out and paraphrases the snippets that come back. Here's what to allow, what to rank for, what to write and how to find its visits.",

  shortAnswer:
    "To get cited by **Mistral Vibe** (called Le Chat until 28 May 2026), be findable in **Brave Search** and let Mistral's bots in. Allow `MistralAI-Index` and `MistralAI-User` in robots.txt, and keep Googlebot unblocked, because Brave only crawls what Googlebot may. Then make each page's title, description and first lines answer the question on their own: Vibe paraphrases Brave's snippets, often after adding the current year and translating generic terms into English. `MistralAI-Training` is a separate bot, and blocking it doesn't affect search.",

  takeaways: [
    "Le Chat became **Vibe** on 28 May 2026, and its Chat tab merged into **Work** on 22 September. The `chat.mistral.ai` address, the crawler names and the search backend stayed the same.",
    'Web results come from **Brave**. Brave said so in February 2025, Mistral\'s API docs tag results `"source": "brave"`, and the open-source Vibe Code client still expects Brave-tagged results in October 2026.',
    "Mistral runs three user agents: `MistralAI-Index` (its search index, new in spring 2026), `MistralAI-User` (live fetches for users) and `MistralAI-Training` (new that summer). Only the last is about training.",
    "In a May 2026 capture of nine prompts, every answer paraphrased Brave snippets, and the model didn't follow Brave's order: one answer led with the result at rank 9.",
    "News answers draw on **AFP** and **AP** and carry a news icon. Mistral's AFP deal covers about 2,300 stories a day in six languages.",
    "The referrer is `chat.mistral.ai`. GA4's AI Assistant channel doesn't name it, and Cloudflare Radar has logged almost no Mistral referrals since July 2026, so watch Direct and your logs too.",
  ],

  facts: [
    { label: "Web results come from", value: "Brave Search" },
    { label: "The crawler to allow for search", value: "MistralAI-Index", mono: true },
    { label: "News partners named in the docs", value: "AFP + AP" },
    { label: "Renamed from Le Chat", value: "28 May 2026" },
  ],

  /* An illustration of the pipeline in the May 2026 capture: a French
     prompt, the mixed query Vibe sends Brave (bold: the term switched to
     English, and the year it adds), the answer in French. Reserved example
     domains only; "Votre marque" stands for the reader's own brand. */
  preview: {
    prompt: "Un logiciel de facturation hébergé en France pour une agence de cinq personnes ?",
    status: "**invoicing software** hébergé en France agence cinq personnes **2026**",
    answer:
      "**Votre marque** ressort en premier : ses factures sont stockées à Paris et son offre Équipe couvre jusqu'à cinq utilisateurs.",
    sources: [
      { domain: "example.com", title: "Votre marque : facturation hébergée en France (2026)" },
      {
        domain: "example.org",
        title: "Comparatif 2026 des logiciels de facturation hébergés en France",
      },
      { domain: "example.net", title: "Best invoicing software for small agencies (2026)" },
    ],
  },

  profile: {
    retrieval:
      "Brave Search API results, Mistral's own MistralAI-Index since 2026, AFP and AP for news",
    searchCrawler: "MistralAI-Index + MistralAI-User (and Googlebot rules, for Brave)",
    trainingCrawler: "MistralAI-Training — blocking it doesn't affect search",
    rendersJs:
      "Undocumented; ran a pasted URL's JS in a June 2026 test. Search answers use snippets",
    referrer: "chat.mistral.ai, no UTM; near zero on Cloudflare Radar since July 2026",
    citationStyle: "Globe icon, inline links and a Sources panel; a news icon for AFP and AP",
    biggestLever:
      "Rank in Brave for the exact question, with the answer in the title and first lines",
  },

  sections: [
    {
      id: "le-chat-to-vibe",
      title: "Le Chat is Vibe now: what moved and what didn't",
      blocks: [
        {
          kind: "p",
          text: 'Mistral [renamed Le Chat to Vibe](https://mistral.ai/news/vibe-agent/) on 28 May 2026, announcing "one agent and one licence across work and code" at its AI Now Summit. The name came from Mistral\'s coding agent: [heise](https://heise.de/-11311685) notes that "Vibe" previously referred to that tool. For everything a site owner cares about, the [help center](https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe) puts it in four words: "Same URL, same login." Accounts, plans and conversations carried over.',
        },
        {
          kind: "p",
          text: 'The second change came on 22 September. Vibe used to split quick questions (Chat) from multi-step tasks (Work) into two tabs. [Since 22 September](https://docs.mistral.ai/vibe) "they\'re merged into a single experience," with a fast/think toggle in place of the tab choice. Self-serve Free, Pro and Teams accounts moved first, and Enterprise organizations get a six-month migration window. Web search now lives under **Tools** in Work, and Deep Research, once a Chat mode, is a Skill.',
        },
        {
          kind: "table",
          head: ["Before", "Now (October 2026)", "What it means for you"],
          rows: [
            [
              "Le Chat",
              "**Vibe**, still at `chat.mistral.ai`",
              "Same referrer hostname, same audience",
            ],
            [
              "The Chat tab",
              "**Work**, with a fast/think toggle",
              "Web search is a tool the user switches on",
            ],
            [
              "Deep Research mode",
              "The **Deep Research** Skill in Work",
              "Long reports that cite many sources",
            ],
            [
              "Vibe, the coding CLI",
              "**Vibe Code**: a CLI, a VS Code extension and Vibe Code Web",
              "A second way Mistral reads developer docs",
            ],
            [
              "`MistralAI-User` only",
              "`MistralAI-User`, `MistralAI-Index` and `MistralAI-Training`",
              "Two newer robots.txt tokens to decide on",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Which name to use on your own pages",
          text: 'Searchers still type "Le Chat". [Wikipedia](https://en.wikipedia.org/wiki/Mistral_Vibe) lists the product as Mistral Vibe with Le Chat as its other name, and the iPhone app\'s App Store address still reads `le-chat-by-mistral-ai`. Our read: on pages that compare assistants, write "Mistral Vibe (formerly Le Chat)" once, then Vibe.',
        },
      ],
    },
    {
      id: "brave-layer",
      title: "The Brave layer under every web answer",
      blocks: [
        {
          kind: "p",
          text: "Mistral's Vibe docs never name a search provider. Four other records do, and they span from launch to this month:",
        },
        {
          kind: "list",
          items: [
            '**Brave announced it.** When the Le Chat apps launched on 6 February 2025, [Brave posted](https://x.com/brave/status/1887612739779965265) that "this AI assistant utilizes Brave Search API for its live web results."',
            '**Mistral\'s API docs show it.** In the [Websearch tool documentation](https://docs.mistral.ai/studio/agents/agent-tools/websearch), every citation in the example output is a `tool_reference` chunk with `"source": "brave"`. The premium tier, `web_search_premium`, adds news articles "via integrated news provider verification."',
            '**A live capture confirmed it.** Logging Le Chat\'s response stream on 5 May 2026, [Nicolas Sitter](https://www.nicolassitter.com/research/how-mistral-searches-hotels-2026) found `"source": "brave"` on every result, each with a title, URL, description, an array of snippets, a date and a language code.',
            '**Mistral\'s client code still expects it.** The [web connector test](https://github.com/mistralai/mistral-vibe/blob/dd2c04ce717c417731ab89c333cd0a72541e33ba/client-e2e/scenarios/conversation/web_connector.py) in the open-source Vibe Code client, current in October 2026, models each search result with a rank, snippets, a `can_open` flag and `"source": "brave"`. It\'s a test fixture, not live traffic, but it\'s the shape Mistral built its client around.',
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "And then there's MistralAI-Index",
          text: 'Since spring 2026 Mistral has run a crawler of its own, which "indexes content for Mistral search, which helps answer user questions in Vibe." Mistral hasn\'t said whether that index supplements Brave or will replace it. Plan for both: rank in Brave, and let `MistralAI-Index` in.',
        },
        { kind: "h3", text: "Getting into Brave's index" },
        {
          kind: "list",
          ordered: true,
          items: [
            '**Keep Googlebot unblocked.** Brave\'s [crawler page](https://search.brave.com/help/brave-search-crawler) says its bot "does not advertise a differentiated user agent" and that "if a domain or page is not crawlable by Googlebot, then Brave Search\'s bot will not crawl it either." A Googlebot block takes you out of Vibe\'s main source.',
            "**Ask for a crawl.** The same page points to Brave's [Submit URL](https://search.brave.com/submit-url) form for re-fetching a page. Use it after a launch or a major rewrite.",
            '**Delist with noindex, not robots.txt.** Brave says robots.txt "is not used to prevent a page from being indexed." To keep a page out of Brave, and therefore out of Vibe, use a `noindex` directive.',
            "**Search Brave the way Vibe does.** Run the query on `search.brave.com` as Vibe would write it: the specific intent, the year appended, generic terms in English. Our read: if you're not in Brave's top ten for that query, Vibe is unlikely to see you.",
          ],
        },
      ],
    },
    {
      id: "who-fetches",
      title: "Five fetchers, three Mistral user agents",
      blocks: [
        {
          kind: "p",
          text: "Mistral [documents three bots](https://docs.mistral.ai/robots), each with its own [robots.txt](/glossary/robots-txt) token. Two more things fetch your pages on Vibe's behalf: Brave's crawler, which builds the results Vibe searches, and Vibe Code's fetch tool, which runs on a developer's own machine. Each one answers to a different rule.",
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "MistralAI-Index",
              role: "search",
              purpose:
                'Automated crawling "for indexing purposes only," for the Mistral search that helps answer questions in Vibe. "Not used for generative AI training of any kind." IPs: `mistral.ai/mistralai-index-ips.json`, two addresses as of 26 October 2026.',
              robots: "yes",
              robotsNote:
                "Listed as a robots.txt tag; Mistral doesn't spell out how each rule is applied.",
              advice: "allow",
            },
            {
              token: "MistralAI-User",
              role: "user",
              purpose:
                'Fetches a page when a user\'s request needs it, including a URL pasted into Work, and links the source in the answer. "Not used for crawling the web in any automatic fashion." IPs: `mistral.ai/mistralai-user-ips.json`, four addresses.',
              robots: "yes",
              robotsNote:
                "Mistral says the token governs which sites these user requests can be made to.",
              advice: "allow",
            },
            {
              token: "MistralAI-Training",
              role: "training",
              purpose:
                'Crawls the web to build datasets for training Mistral\'s models. "Not used for search indexing or to answer live user queries in Vibe." No IP list is published.',
              robots: "yes",
              robotsNote: "Mistral: webmasters can disallow it in robots.txt.",
              advice: "your-call",
            },
            {
              token: "Brave crawler",
              role: "search",
              purpose:
                "Builds the Brave index that Vibe's web search queries. It has no token of its own and doesn't identify itself, so you can't allow or block it by name.",
              robots: "partial",
              robotsNote: "It follows whatever you set for Googlebot.",
              advice: "allow",
            },
            {
              token: "Vibe Code web_fetch",
              role: "user",
              purpose:
                "The coding agent's fetch tool, run from the developer's machine. In the open-source CLI (v2.25.5, September 2026) it sends a desktop Chrome user agent, retries once as `vibe-cli` if Cloudflare challenges it, converts the HTML to Markdown and keeps the first 120,000 bytes.",
              robots: "no",
              robotsNote: "The code requests the URL directly and never reads robots.txt.",
              advice: "allow",
            },
          ],
        },
        {
          kind: "p",
          text: "Both newer tokens arrived in 2026. The crawler page listed only `MistralAI-User` as late as [11 March](https://web.archive.org/web/20260311070503/https://docs.mistral.ai/robots). `MistralAI-Index` was there by early April, and its IP file is dated 19 April 2026. `MistralAI-Training` was added after [4 July](https://web.archive.org/web/20260704080622/https://docs.mistral.ai/robots) and before 3 August. A robots.txt written before then names neither, so only your `User-agent: *` group applies to them.",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Mistral's search index and live fetches: let them in\nUser-agent: MistralAI-Index\nUser-agent: MistralAI-User\nAllow: /\n\n# Training: your call. Search is unaffected either way.\nUser-agent: MistralAI-Training\nDisallow: /\n\n# Brave has no token of its own and follows your Googlebot rules\nUser-agent: Googlebot\nAllow: /",
        },
        {
          kind: "p",
          text: 'robots.txt is only half the job. Blanket "block AI bots" rules at a CDN or WAF override it, so allowlist Mistral\'s published IPs rather than the user-agent strings, which anyone can copy. When a page refuses, Mistral\'s client is built to move on: its test fixture renders "This page could not be read: the site blocked automated access" and the answer is written from other sources. Check what Mistral\'s fetcher actually receives:',
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Does your server (and WAF) give Mistral\'s fetcher the real page?\ncurl -s -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-User/1.0; +https://docs.mistral.ai/robots)" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n\n# Repeat with MistralAI-Index/1.0. A 0 means blocked, challenged,\n# or the sentence only appears after JavaScript runs.',
        },
      ],
    },
    {
      id: "answer-assembly",
      title: "How Vibe turns a Brave results page into an answer",
      blocks: [
        {
          kind: "p",
          text: "The clearest look inside is Sitter's capture: nine hotel prompts in English, French and Italian, logged from one account on 5 May 2026, three weeks before the rename. It's a small sample in one category, so treat each step below as something to test in yours, not a law.",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "With web search on, it searches",
              body: 'Web search is a tool the user enables from the `+` menu. With it on, Sitter saw a search on every prompt, even "is the Ritz Paris worth the price," which the model could have answered from memory.',
              lever:
                "With search off, answers come from training data. That's the one place blocking `MistralAI-Training` costs you.",
            },
            {
              title: "It rewrites the question",
              body: "One `web_search` call per prompt, or one per brand when the user compares two. Most queries got the current year appended unprompted, and generic terms were translated into English while place names stayed as typed.",
              lever:
                "Match the query Vibe writes: the specific intent, an honest year in the title, and the English category term on local-language pages.",
            },
            {
              title: "Brave returns snippets, not pages",
              body: "Each result arrives as a title, URL, description, extra snippets, a date and a language code. No ratings, prices or other structured fields reached the model; star tiers were read out of page titles.",
              lever:
                "Put the facts you want repeated in the title, the meta description and the first lines: the text most likely to become a snippet.",
            },
            {
              title: "The model picks, out of order",
              body: "Vibe didn't paraphrase in Brave's order. One answer led with the result at rank 9; another cited ranks 1, 2, 4 and 7. Ranking first doesn't guarantee a mention, and ranking lower doesn't rule one out.",
              lever:
                "Be on the page that ranks for the exact intent. On niche prompts, specialist sites won over generic aggregators.",
            },
            {
              title: "It paraphrases, with references",
              body: "The answer streams as a paraphrase of the snippets, with reference markers tied to the source URLs. In Work, Mistral's [docs](https://docs.mistral.ai/vibe/work/web-search-open-url) describe a globe icon, inline links and a **Sources** button that opens a panel listing every reference.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Vibe repeats what the snippets say, wrong parts included",
          text: 'Sitter logged four kinds of "authority laundering." One review became "a significant number of reviews." A hotel\'s own marketing became "known for." An editorial placeholder was presented as a hotel name. And a "Mama Shelter Vienna" was described from Prague review snippets, though the chain has no Vienna property. The defence sits in your snippet: state the correct fact plainly, with names and numbers, on the page that ranks.',
        },
      ],
    },
    {
      id: "snippet-ready",
      title: "Pages Vibe can paraphrase without getting wrong",
      blocks: [
        {
          kind: "p",
          text: 'Mistral documents almost nothing about what it prefers. Its docs make three admissions: pages "behind a login or paywall can\'t be accessed," "some highly interactive websites may not load fully," and web search "can return outdated or incomplete content depending on what the source page exposes." The rest of this list is inference from the Brave layer and the May 2026 capture, graded accordingly.',
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Crawlable by Googlebot",
              status: "required",
              note: "Brave follows your Googlebot rules and has no token of its own. Block Googlebot and you leave Vibe's main source.",
            },
            {
              label: "Mistral's search bots allowed",
              status: "required",
              note: "`MistralAI-Index` and `MistralAI-User`, in robots.txt and through the WAF, including bot-fight modes and managed AI-bot rules.",
            },
            {
              label: "No wall before the answer",
              status: "required",
              note: "Mistral says login and paywalled pages can't be read. Our read: cookie walls and interstitials in front of the main text do the same damage.",
            },
            {
              label: "The answer in the snippet zone",
              status: "helps",
              note: "Every captured answer paraphrased snippets. A title and an opening paragraph that state the fact are what survive the trip.",
            },
            {
              label: "An honest year and a visible date",
              status: "helps",
              note: "Brave results carry a date, and Vibe added the year to most queries. Show a real updated date, keep `dateModified` accurate, and only put a year in a title you'll maintain.",
            },
            {
              label: "Both vocabularies on local pages",
              status: "helps",
              note: 'Generic terms reached Brave in English. A French page that also says "invoicing software" or "boutique hotel" matches the prompt and the rewritten query.',
            },
            {
              label: "Server-rendered HTML",
              status: "helps",
              note: "Open URL may run JavaScript, but search answers come from Brave's snippets and Vibe Code's fetcher strips scripts. [Server-render](/glossary/server-side-rendering) the facts.",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "No statement from Mistral, and no structured fields reached the model in the capture. Keep every fact that matters in visible copy too.",
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
        { kind: "h3", text: "One opening, written for the snippet" },
        {
          kind: "p",
          text: "Here is the head of a French product page set up for both halves of the rewritten query. Every line states something a model can lift: where, how much, for whom, and when it was last true.",
        },
        {
          kind: "code",
          lang: "html",
          code: '<!-- A French page that also carries the English category term -->\n<title>Logiciel de facturation (invoicing software) hébergé en France, tarifs 2026</title>\n<meta name="description" content="Factures stockées à Paris. À partir de 9 € par mois, gratuit pour un utilisateur.">\n\n<h1>Logiciel de facturation hébergé en France</h1>\n<p>Mis à jour le 20 octobre 2026. Toutes les factures sont stockées à Paris.\n  Les offres commencent à 9 € par mois ; un utilisateur est gratuit.</p>',
        },
      ],
    },
    {
      id: "language-and-europe",
      title: "French in, French out: the language rule and Vibe's audience",
      blocks: [
        {
          kind: "p",
          text: 'Vibe answers in the prompt\'s language: "Italian in, Italian out. French in, French out," as Sitter puts it. The query it sends to Brave is a mix, decided term by term:',
        },
        {
          kind: "table",
          head: ["In the prompt", "In the Brave query", "Why"],
          rows: [
            [
              "un hôtel boutique à Bordeaux mais pas Saint Pierre",
              "`boutique hotel Bordeaux hors quartier Saint Pierre`",
              '"Boutique hotel" has richer English results; the place name and "hors quartier" stay French',
            ],
            [
              "… pour deux nuits ce week-end",
              "`… pour deux nuits ce week-end 10-11 mai 2026`",
              "A relative date is resolved to a calendar date (here, a day off)",
            ],
            [
              "Hotel Costes … recent guest reviews",
              "`Hotel Costes Paris recent guest reviews 2026`",
              '"Recent" turns into the current year',
            ],
          ],
        },
        {
          kind: "list",
          items: [
            "**Publish where your buyers prompt.** A French buyer gets a French answer built from whatever Brave returns for the mixed query. A page in their language that also carries the English category term matches both halves.",
            "**Write named entities exactly as locals do.** Place names, neighbourhoods and product names were never translated.",
            "**Check Brave per market.** Run the query as Vibe would write it in each language you sell in, with the year added, and note who ranks.",
          ],
        },
        {
          kind: "p",
          text: "Is it worth the effort? Vibe is a small referrer overall and a real one in France. [SE Ranking's study](https://seranking.com/blog/mistral-ai-traffic-research/) of 101,574 sites with Google Analytics found Mistral sent 0.85% of AI-referred visits in France and 0.24% across the EU from January to May 2026, sixth among AI referrers in the EU. Mistral's [product page](https://mistral.ai/products/vibe) names ASML, BNP Paribas, CMA CGM, Stellantis, SNCF and the Government of Luxembourg among its customers. If you sell to French or European organizations, Vibe matters more than its global numbers suggest.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "0.85%",
              label: "of AI-referred visits in France came from Mistral, January to May 2026",
              source: {
                name: "SE Ranking, Jun 2026",
                href: "https://seranking.com/blog/mistral-ai-traffic-research/",
              },
            },
            {
              value: "0.24%",
              label:
                "of AI-referred visits across the EU in the same period, sixth among AI referrers",
              source: {
                name: "SE Ranking, Jun 2026",
                href: "https://seranking.com/blog/mistral-ai-traffic-research/",
              },
            },
            {
              value: "#34",
              label: "chat.mistral.ai's rank among AI chatbot and tool websites in September 2026",
              source: {
                name: "Similarweb, Sep 2026",
                href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
              },
            },
          ],
        },
      ],
    },
    {
      id: "news-wires",
      title: "News answers lean on AFP and AP",
      blocks: [
        {
          kind: "p",
          text: 'For news queries, Mistral\'s [Work docs](https://docs.mistral.ai/vibe/work/web-search-open-url) say Vibe "draws from professional news partners" Agence France-Presse and Associated Press. A news icon appears beside the globe icon, and "sources link directly to the original agency reporting."',
        },
        {
          kind: "p",
          text: "The AFP side is a signed deal. Mistral [announced it](https://mistral.ai/news/mistral-afp/) on 16 January 2025, its first of the kind according to [TechCrunch](https://techcrunch.com/2025/01/16/mistral-signs-deal-with-afp-to-offer-up-to-date-answers-in-le-chat): a multi-year agreement covering AFP's text output, around 2,300 stories a day in French, English, Spanish, Portuguese, German and Arabic, plus its archive back to 1983. Photos and video aren't included. We found no Mistral announcement of an AP deal; AP is named in the docs only.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "For publishers: compete where the wires don't",
          text: "On breaking news, a site loses to an agency the assistant has a contract with. Our read: get cited for what AFP and AP don't carry, such as primary data, specialist analysis, local detail and explainers that stay useful after the news cycle. Those pages reach Vibe through Brave, like any other.",
        },
      ],
    },
    {
      id: "full-page-reads",
      title: "When Mistral reads the whole page: Open URL, Deep Research and Vibe Code",
      blocks: [
        {
          kind: "p",
          text: "A search answer works from snippets. Three paths fetch the page itself, and each has its own limits:",
        },
        {
          kind: "table",
          head: ["Path", "What it reads", "What to check"],
          rows: [
            [
              "**Open URL** in Work",
              'The single page a user pastes, or a linked PDF, shown with a link icon and an "Opened Page" mention. No login or paywalled pages',
              "`MistralAI-User` allowed, and the answer readable without a wall",
            ],
            [
              "**Deep Research** Skill",
              "A search plan the user can edit, many sources, then a report with inline citations and a full source list, exportable as PDF",
              "Depth and primary sources: pages that hold up to a closer read",
            ],
            [
              "**Vibe Code** web tools",
              "Docs and pages a developer's agent fetches, converted to Markdown with scripts stripped, up to 120,000 bytes",
              "Server-rendered docs, key facts early, no bot challenge on docs pages",
            ],
          ],
        },
        {
          kind: "p",
          text: "On JavaScript, the evidence splits by path. In a [June 2026 test](https://www.searchengineworld.com/do-ai-assistants-actually-render-your-javascript-when-grounding-we-put-it-to-the-test) that pasted a URL into 12 assistants, Mistral was one of five that ran the page's script and reported the value it produced; the other four were Chinese assistants. That is the Open URL path. Search answers are built from Brave's snippets, Mistral itself warns that \"some highly interactive websites may not load fully,\" and the Vibe Code CLI fetches raw HTML with no browser at all.",
        },
        { kind: "h3", text: "If you publish developer docs" },
        {
          kind: "p",
          text: "Vibe Code reaches your docs two ways. The CLI's own `web_fetch` tool runs on the developer's machine. Per its [source code](https://github.com/mistralai/mistral-vibe/blob/c069ffa1e12fb5f2487b489217c40ab97721d553/vibe/core/tools/builtins/web_fetch.py) (v2.25.5, September 2026), it sends a desktop Chrome user agent, retries once as `vibe-cli` when Cloudflare answers with a challenge, converts the HTML to Markdown with scripts, styles, iframes and `noscript` removed, and hands the model the first 120,000 bytes. Since v3.0 (15 October 2026) the client can also route searches and page opens through Mistral's server-side web connector, and Mistral doesn't say which user agent that uses.",
        },
        {
          kind: "list",
          items: [
            "**robots.txt doesn't reach the local tool.** It doesn't identify as `MistralAI-User`, doesn't come from Mistral's IPs and doesn't read robots.txt. Treat it like a developer's browser.",
            "**Don't challenge docs pages.** A Cloudflare challenge costs one retry under the `vibe-cli` user agent. Anything stricter and the agent works without your docs.",
            "**Put the reference before the chrome.** Navigation and boilerplate count toward the 120,000-byte budget once converted. Our read: a lean docs template keeps the part developers need inside it.",
          ],
        },
      ],
    },
    {
      id: "measuring-vibe",
      title: "Finding Vibe in GA4, on Cloudflare and in your logs",
      blocks: [
        {
          kind: "p",
          text: "Mistral documents no UTM tagging on outbound links. When a click carries a referrer, it's the app's hostname: [Patrick Stox's attribution table](https://patrickstox.com/ai-search/measurement-and-reporting/ai-traffic-attribution/) records `chat.mistral.ai` passing its referrer in every instance tested, in a May 2025 test. GA4's default **AI Assistant** channel, [added on 13 May 2026](https://support.google.com/analytics/answer/9164320), doesn't name Mistral: Google's [channel definition](https://support.google.com/analytics/answer/9756891) gives \"ChatGPT, Gemini, Deepseek, Copilot, or Grok\" as examples and doesn't publish its full list. Check where your `chat.mistral.ai` sessions land. If they sit in Referral, add a custom channel above it:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: '# Custom channel "Mistral Vibe": Session source matches regex\n^chat\\.mistral\\.ai$\n\n# One channel for every assistant hostname you want grouped\nchat\\.mistral\\.ai|chatgpt\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com',
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Mistral referrals all but vanished from Cloudflare Radar after July 2026",
          text: "In June 2025 [Cloudflare measured](https://blog.cloudflare.com/ai-search-crawl-refer-ratio-on-radar/) Mistral sending ten referrals for every crawl. By June 2026 Radar showed 178 crawls per referral, and [TechnologyChecker's analysis](https://technologychecker.io/blog/robots-txt-ai-crawlers-blocking-report) of Radar (updated 1 October 2026) found zero Mistral referrals in four of July's five weeks and too few in September to compute a ratio. Mistral hasn't explained it. Cloudflare counts only clicks that carry a `Referer`, and it notes that native apps send none, so visits from the Vibe mobile apps arrive as Direct regardless. Compare your own `chat.mistral.ai` sessions before and after the 28 May rename, and watch Direct traffic to the pages Vibe cites.",
        },
        {
          kind: "p",
          text: "Server logs show what referrers can't. `MistralAI-User` hits are real conversations that needed your page, and `MistralAI-Index` hits show what Mistral's own index has picked up:",
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Mistral bot hits by type\ngrep -oE \"MistralAI-(User|Index|Training)\" access.log | sort | uniq -c\n\n# Pages fetched for Vibe users: your live-demand list\ngrep \"MistralAI-User\" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20\n\n# Vibe Code's fetch tool after a Cloudflare challenge (its first try looks like Chrome)\ngrep '\"vibe-cli\"' access.log | awk '{print $7}' | sort | uniq -c",
        },
        {
          kind: "p",
          text: "Verify hits against the two IP files. `MistralAI-Training` has no list, and Brave's crawler doesn't identify itself at all. For the citations themselves, run a fixed [prompt panel](/glossary/prompt-tracking) in Vibe with web search on, in every language you sell in, and repeat it monthly: with answers this variable, one screenshot proves little.",
        },
      ],
    },
    {
      id: "wrong-assumptions",
      title: "Five assumptions that cost Vibe citations",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking Mistral's training crawler hides you from Vibe.",
              reality:
                '`MistralAI-Training` is "not used for search indexing or to answer live user queries." Search runs on Brave, `MistralAI-Index` and `MistralAI-User`, each with its own rule.',
            },
            {
              myth: "Vibe searches Google.",
              reality:
                "Its web results come from Brave's Search API. Google matters only indirectly: Brave won't crawl what you've closed to Googlebot.",
            },
            {
              myth: "Ranking first in Brave guarantees the citation.",
              reality:
                "Captured answers cited out of order, one leading with the result at rank 9. Rank for the exact intent, then make your snippet the one worth picking.",
            },
            {
              myth: "Le Chat is gone, so there's nothing left to optimize.",
              reality:
                "It was renamed, not retired. Vibe runs at the same `chat.mistral.ai` address, and the crawlers and search backend didn't change.",
            },
            {
              myth: "Allowing MistralAI-User covers every Mistral fetch.",
              reality:
                "Brave follows your Googlebot rules, and Vibe Code's local fetch tool sends a Chrome user agent and never reads robots.txt. Three different rules reach three different fetchers.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "robots",
      title: "Name MistralAI-Index and MistralAI-User in robots.txt",
      detail:
        "A file written before April 2026 can't mention `MistralAI-Index`. Add both tokens explicitly, on every subdomain you want cited.",
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
      title: "Keep Googlebot unblocked on every page you want in Vibe",
      detail:
        "Brave, Vibe's result source, follows your Googlebot rules and has no token you could allow instead.",
      impact: "high",
    },
    {
      id: "brave-check",
      title: "Search Brave the way Vibe writes queries",
      detail:
        "The specific intent, the year appended and generic terms in English, in each language you sell in. Note who ranks in the top ten.",
      impact: "high",
    },
    {
      id: "snippet",
      title: "Put the answer in the title, description and first lines",
      detail:
        "Vibe paraphrases snippets. State the fact, with names and numbers, where a snippet will pick it up.",
      impact: "high",
    },
    {
      id: "brave-submit",
      title: "Get new and changed pages into Brave",
      detail:
        "Use Brave's Submit URL form after launches and rewrites, and earn links from pages Brave already ranks.",
      impact: "medium",
    },
    {
      id: "dates",
      title: "Show an honest updated date and year",
      detail:
        "A visible updated date, an accurate `dateModified`, and the current year in a title only where it's true and maintained.",
      impact: "medium",
    },
    {
      id: "languages",
      title: "Publish in your buyers' languages, with the English category term",
      detail:
        "Answers follow the prompt's language, while generic terms reach Brave in English. Cover both on local pages.",
      impact: "medium",
    },
    {
      id: "ssr",
      title: "Server-render the facts you want cited",
      detail:
        "Don't lean on one test of Open URL running JavaScript. Brave's snippets and Vibe Code's fetcher work from raw HTML.",
      impact: "medium",
    },
    {
      id: "walls",
      title: "Keep logins, paywalls and cookie walls off citable pages",
      detail:
        "Mistral can't read login or paywalled pages, and Open URL fetches only the one page it's given.",
      impact: "medium",
    },
    {
      id: "training",
      title: "Decide on MistralAI-Training on purpose",
      detail:
        "Blocking it doesn't touch search, but every answer given with web search off comes from training data.",
      impact: "medium",
    },
    {
      id: "docs",
      title: "Developer docs: no bot challenges, lean templates",
      detail:
        "Vibe Code's fetch tool looks like Chrome, retries once as `vibe-cli`, and reads only the first 120,000 bytes of Markdown.",
      impact: "medium",
    },
    {
      id: "measure",
      title: "Give chat.mistral.ai its own GA4 channel and watch Direct",
      detail:
        "GA4's AI Assistant channel doesn't name Mistral, app visits carry no referrer, and Radar shows referrals collapsing after July 2026.",
      impact: "medium",
    },
    {
      id: "panel",
      title: "Re-run a fixed prompt panel in Vibe every month",
      detail:
        "The same prompts, web search on, in every market language. Record who's cited and what the answer says about you.",
      impact: "medium",
    },
    {
      id: "news",
      title: "Publishers: offer what AFP and AP don't",
      detail:
        "News answers lean on the wires. Primary data, specialist analysis and local detail are how an outlet gets cited beside them.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "Is Le Chat the same as Mistral Vibe?",
      a: "Yes. Mistral renamed Le Chat to Vibe on 28 May 2026. It still runs at `chat.mistral.ai`, accounts and conversations carried over, and since 22 September its Chat and Work tabs are one experience. Mistral's crawlers and its search backend didn't change.",
    },
    {
      q: "What search engine does Mistral Vibe use?",
      a: 'Brave. Brave announced in February 2025 that Le Chat uses its Search API for live web results, Mistral\'s API docs tag web results `"source": "brave"`, an independent capture in May 2026 found that tag on every result, and Mistral\'s open-source client still models results that way in October 2026. Mistral also runs its own index crawler, `MistralAI-Index`, in an undisclosed role.',
    },
    {
      q: "How do I get my website cited by Mistral Vibe?",
      a: "Allow `MistralAI-Index` and `MistralAI-User`, keep Googlebot unblocked so Brave can crawl you, and rank in Brave for the specific questions your buyers ask. Then make each page's title, description and opening lines state the answer, with an honest date, in your buyers' language and with the English category term.",
    },
    {
      q: "What's the difference between MistralAI-User, MistralAI-Index and MistralAI-Training?",
      a: "`MistralAI-Index` crawls automatically to build Mistral's search index. `MistralAI-User` fetches a page only when a user's request needs it, such as a pasted URL. `MistralAI-Training` collects data to train Mistral's models. Mistral says the first two aren't used for training and the third isn't used for search.",
    },
    {
      q: "Does blocking MistralAI-Training remove my site from Vibe?",
      a: "No. Mistral says `MistralAI-Training` isn't used for search indexing or live answers, so web search still finds you through Brave and `MistralAI-Index`. What you give up is a place in training data, which answers draw on when web search is off.",
    },
    {
      q: "How does Vibe show its sources?",
      a: 'When it uses web search, Vibe shows a globe icon next to the response, inline links back to the sources, and a Sources button that opens a panel listing every reference. News results add a news icon and link to the original AFP or AP report. A pasted URL shows a link icon and an "Opened Page" mention.',
    },
    {
      q: "Can Mistral Vibe read JavaScript-rendered pages?",
      a: "Mistral doesn't document it. In a June 2026 test Mistral ran a pasted page's JavaScript, but that's the Open URL path: search answers come from Brave's snippets, Mistral warns that interactive sites may not load fully, and Vibe Code's fetcher strips scripts. Server-render anything you want cited.",
    },
    {
      q: "How do I track traffic from Mistral Vibe in GA4?",
      a: "Look for session source `chat.mistral.ai` and give it a custom channel, since GA4's AI Assistant channel doesn't name Mistral and Mistral documents no UTM tags. App visits send no referrer and land in Direct, and Cloudflare Radar logged almost no Mistral referrals after July 2026, so compare before and after 28 May 2026 and check your server logs for `MistralAI-User`.",
    },
    {
      q: "Which news sources does Mistral Vibe use?",
      a: "Mistral's docs name Agence France-Presse and the Associated Press as its professional news partners. The AFP deal, announced in January 2025, covers about 2,300 stories a day in six languages and AFP's archive back to 1983. Mistral hasn't announced an AP deal separately.",
    },
    {
      q: "Does Vibe Code respect robots.txt when it reads my docs?",
      a: "The CLI's own fetch tool doesn't read robots.txt. It runs on the developer's machine, sends a desktop Chrome user agent and retries as `vibe-cli` if Cloudflare challenges it, per the open-source code. Treat it like a browser: keep docs unchallenged and server-rendered.",
    },
  ],

  sources: [
    {
      title: "Mistral crawlers",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/robots",
    },
    {
      title: "Mistral crawlers (archived 11 March 2026, before MistralAI-Index)",
      publisher: "Internet Archive",
      href: "https://web.archive.org/web/20260311070503/https://docs.mistral.ai/robots",
    },
    {
      title: "Mistral crawlers (archived 4 July 2026, before MistralAI-Training)",
      publisher: "Internet Archive",
      href: "https://web.archive.org/web/20260704080622/https://docs.mistral.ai/robots",
    },
    {
      title: "MistralAI-Index IP addresses",
      publisher: "Mistral AI",
      href: "https://mistral.ai/mistralai-index-ips.json",
    },
    {
      title: "MistralAI-User IP addresses",
      publisher: "Mistral AI",
      href: "https://mistral.ai/mistralai-user-ips.json",
    },
    {
      title: "Search the web (Web search and Open URL)",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/vibe/work/web-search-open-url",
    },
    { title: "Vibe overview", publisher: "Mistral Docs", href: "https://docs.mistral.ai/vibe" },
    {
      title: "Choose Work or Code",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/vibe/choose-chat-work-code",
    },
    {
      title: "Deep Research",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/vibe/chat-legacy/deep-research",
    },
    {
      title: "Vibe Code",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/vibe/code/overview",
    },
    {
      title: "Websearch (Agents API)",
      publisher: "Mistral Docs",
      href: "https://docs.mistral.ai/studio/agents/agent-tools/websearch",
    },
    {
      title: "Le Chat is now Vibe",
      publisher: "Mistral Help Center",
      href: "https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe",
    },
    {
      title: "Vibe gets to work",
      publisher: "Mistral AI",
      href: "https://mistral.ai/news/vibe-agent/",
    },
    { title: "Mistral Vibe", publisher: "Mistral AI", href: "https://mistral.ai/products/vibe" },
    { title: "Pricing", publisher: "Mistral AI", href: "https://mistral.ai/pricing" },
    {
      title: "Mistral's chatbot is now called Vibe",
      publisher: "heise online",
      href: "https://heise.de/-11311685",
    },
    {
      title: "Mistral Vibe",
      publisher: "Wikipedia",
      href: "https://en.wikipedia.org/wiki/Mistral_Vibe",
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
      title: "web_fetch.py, Vibe Code CLI v2.25.5",
      publisher: "Mistral AI on GitHub",
      href: "https://github.com/mistralai/mistral-vibe/blob/c069ffa1e12fb5f2487b489217c40ab97721d553/vibe/core/tools/builtins/web_fetch.py",
    },
    {
      title: "Web connector test scenario, Vibe Code v3.0.1",
      publisher: "Mistral AI on GitHub",
      href: "https://github.com/mistralai/mistral-vibe/blob/dd2c04ce717c417731ab89c333cd0a72541e33ba/client-e2e/scenarios/conversation/web_connector.py",
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
      title: "AI traffic attribution",
      publisher: "Patrick Stox",
      href: "https://patrickstox.com/ai-search/measurement-and-reporting/ai-traffic-attribution/",
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
    {
      title: "IndexNow participating search engines",
      publisher: "IndexNow",
      href: "https://www.indexnow.org/searchengines.json",
    },
  ],

  sameAs: [
    "https://www.wikidata.org/wiki/Q132323422",
    "https://en.wikipedia.org/wiki/Mistral_Vibe",
  ],

  furtherReading: [
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Allow MistralAI-Index and MistralAI-User, make a deliberate call on MistralAI-Training, and cover every other AI crawler in one file.",
    },
    {
      title: "robots.txt tester",
      href: "/tools/robots-txt-tester",
      description:
        "Check that your Googlebot and Mistral rules say what you meant before Brave or Vibe acts on them.",
    },
    {
      title: "AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "See which pages Mistral's bots fetch, and whether MistralAI-Index has found you yet.",
    },
    {
      title: "SERP snippet preview",
      href: "/tools/serp-snippet-preview",
      description:
        "Test whether your title and description state the answer on their own, the way a Brave snippet needs to.",
    },
    {
      title: "hreflang generator",
      href: "/tools/hreflang-generator",
      description:
        "Vibe answers in the prompt's language. Link your language versions so each market finds the right page.",
    },
  ],
};
