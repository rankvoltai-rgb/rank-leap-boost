import type { EngineGuide } from "../types";

/* Facts re-verified 2026-10-26 against OpenAI's docs and help center, and the
   studies linked in `sources`. The illustrative brand (Plotbright) and review
   site (reviewloft.com) are invented; neither domain resolves. */

export const chatgpt: EngineGuide = {
  slug: "chatgpt",
  metaTitle: "ChatGPT SEO (2026): Fan-Out Queries, OAI-SearchBot and Citations",
  metaDescription:
    "How ChatGPT search finds and cites pages after its August 2026 change: fan-out queries, OAI-SearchBot vs GPTBot, shopping feeds, agents, and ChatGPT traffic in GA4.",
  keywords: [
    "ChatGPT SEO",
    "ChatGPT search optimization",
    "how to get cited by ChatGPT",
    "OAI-SearchBot",
    "ChatGPT fan-out queries",
    "ChatGPT referral traffic",
  ],
  headline: { lead: "ChatGPT SEO:", accent: "from fan-out query to citation to click" },
  subhead:
    "What happens between a buyer's question and a citation pill in ChatGPT: the searches it writes, the pages it reads but never cites, the OpenAI crawler behind each step, and how the click lands in your analytics.",

  shortAnswer:
    "To get cited in ChatGPT search, let **OAI-SearchBot** crawl your site (in robots.txt and at your CDN), put your facts in server-rendered HTML, and publish an official page for every fact a buyer checks: price, plans, specs, policies. Since ChatGPT's 8 August 2026 change it reads about twice as many pages per answer and runs far more `site:` searches of brand domains, but it cites only part of what it reads. Pages whose titles and first lines match its rewritten queries are the ones that get the citation.",

  takeaways: [
    "`OAI-SearchBot` is the only OpenAI crawler that decides search inclusion. `GPTBot` is training-only: block it and you stay in search.",
    "On 8 August 2026 pages consulted per answer roughly doubled (11.6 to 22.5 in Searchable's 266,182-prompt test), and `site:` searches of brand domains jumped.",
    "How far it fans out depends on the prompt: 7.61 searches per commercial prompt in Nectiv's API test, but fan-outs in only 14.4% of 66.6M logged-out answers in Ahrefs' data.",
    "Reading isn't citing. Ahrefs found ChatGPT cites about half the URLs it retrieves, and retrieved Reddit pages just 1.93% of the time.",
    "Product answers come from feeds: Shopify Catalog, or a direct Agentic Commerce Protocol feed for approved merchants.",
    "ChatGPT visits land in GA4's AI Assistant channel (since 13 May 2026) with source `chatgpt.com`. The `utm_source=chatgpt.com` tag is still seen on clicks, but OpenAI no longer documents it.",
  ],

  facts: [
    {
      label: "The OpenAI crawler that controls search inclusion",
      value: "OAI-SearchBot",
      mono: true,
    },
    { label: "Pages consulted per answer, before and after 8 Aug 2026", value: "11.6 → 22.5" },
    { label: "Share of retrieved URLs that end up cited (Ahrefs)", value: "~50%" },
    { label: "GA4 default channel for ChatGPT visits", value: "AI Assistant" },
  ],

  preview: {
    prompt: "Does Plotbright have a free plan, and what does the Team plan cost?",
    status: "Searched the web · 22 pages",
    answer:
      "Yes. **Plotbright** is free for up to three people with unlimited projects. The Team plan is $9 per user a month billed annually, or $11 month to month, and adds timelines and guest access.",
    sources: [
      { domain: "plotbright.com", title: "Pricing: Free, Team and Business plans" },
      { domain: "help.plotbright.com", title: "What's included in the Free plan" },
      { domain: "reviewloft.com", title: "Plotbright review: two months on Team" },
    ],
  },

  profile: {
    retrieval:
      "Search partners (Microsoft, Shopify named) plus OpenAI's own crawler, OAI-SearchBot",
    searchCrawler: "OAI-SearchBot",
    trainingCrawler: "GPTBot — blocking it doesn't affect search",
    rendersJs: "Not documented; Vercel saw OpenAI's bots fetch JS files without running them",
    referrer: "chatgpt.com, GA4 AI Assistant channel; links seen with utm_source=chatgpt.com",
    citationStyle: "Inline citation pills, a Sources panel, inline brand links",
    biggestLever:
      "Official first-party pages for prices, specs and policies that match its site: searches",
  },

  sections: [
    {
      id: "fan-out",
      title: "One prompt, many searches: how ChatGPT rewrites the question",
      blocks: [
        {
          kind: "p",
          text: 'ChatGPT decides prompt by prompt whether to search the web, and users can force a search from the tools menu. When it searches, OpenAI says it "typically rewrites your query into one or more targeted queries" and, after reviewing the first results, "may send additional, more specific queries" ([OpenAI Help](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt)). OpenAI\'s own example turns a researcher\'s question about drugs that target CCR8 into `CCR8 immunotherapy drug development 2025`, then follows up with `CHS-114 conference 2025`. Saved memories and approximate location can shape the rewrite.',
        },
        {
          kind: "p",
          text: "Not every prompt searches. Semrush's US clickstream panel put web search at **34.5% of ChatGPT prompts in February 2026**, down from 46% in late 2024. Everything below is about that searched share, which skews toward current, commercial and local questions.",
        },
        {
          kind: "p",
          text: 'These rewritten searches are called [query fan-out](/glossary/query-fan-out). For a pricing question about a product, they now tend to name the brand\'s own domain, the current year and the word "official". For the sample prompt at the top of this page, they would look something like this:',
        },
        {
          kind: "code",
          lang: "fan-out",
          code: "site:plotbright.com pricing\nPlotbright Team plan price per user 2026\nPlotbright free plan limits official",
        },
        { kind: "h3", text: "What changed on 8 August 2026" },
        {
          kind: "p",
          text: "ChatGPT's retrieval changed overnight on 8 August 2026, as GPT-5.6 became the default model for Free and Go users. Four independent datasets agree on the direction and differ on the size:",
        },
        {
          kind: "table",
          head: ["Study", "Sample", "What it measured"],
          rows: [
            [
              "[Searchable](https://www.searchable.com/blog/chatgpt-research-depth-study), Aug 2026",
              "266,182 paired prompts, before and after 8 August",
              "Pages consulted per answer 11.58 → 22.54. Inline citations per answer 0.49 → 0.82. `site:` share of sub-queries 0.2% → 18%.",
            ],
            [
              "[Peec AI](https://docs.peec.ai/research/gpt-56-retrieval-changes), Aug 2026",
              "GPT-5.5 vs GPT-5.6 (sample size not published)",
              "Sources retrieved per prompt ~12 → ~24. Prompts needing a single fan-out 94.0% → 43.5%. `site:` in 23% of fan-outs, up from 0.3%.",
            ],
            [
              "[Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study), Aug 2026",
              "About 4,000 commercial prompts via the API, rerun from 2025",
              '7.61 fan-out queries per prompt, up from 2.17. `site:` in 64% of fan-outs. "Official" the second most common word.',
            ],
            [
              "[Ahrefs](https://ahrefs.com/blog/query-fan-out-chatgpt/), Oct 2026",
              "66.6M free, logged-out answers, Aug–Sep 2026",
              "Fan-outs in 14.4% of answers, about 1.6 each. `site:` in 6.8% of fan-outs; 75.9% of the most-searched targets were brand sites.",
            ],
          ],
        },
        {
          kind: "p",
          text: 'The spread comes from the prompts, not from error. Nectiv used commercial "best X" prompts on a reasoning model, which trigger brand lookups; Ahrefs sampled broad prompts in free, logged-out sessions, which search less. For a buying question in your category, plan for the Nectiv end of the range. For informational questions, expect the Ahrefs end.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "What the rewritten queries ask for",
          text: 'In Ahrefs\' data, "official" rose from 10.1% to 13.1% of English fan-outs between August and September, "price" from 6.0% to 8.9%, and "2026" appeared in 22.9%. "Specifications" entered the top 50 for the first time. A `site:` search lands on pricing, spec, support and policy pages on your own domain, so those are the pages to make complete and current.',
        },
      ],
    },
    {
      id: "read-not-cited",
      title: "Read isn't cited: why most pages ChatGPT opens never get the pill",
      blocks: [
        {
          kind: "p",
          text: "Behind every searched answer are two lists: the pages ChatGPT consulted and the few it cites. Ahrefs' study of 1.4 million prompts found it cites only about half of what it retrieves, **16.57 cited URLs against 16.58 uncited per prompt** ([Ahrefs](https://ahrefs.com/blog/why-chatgpt-cites-pages/), Apr 2026). Searchable's August data shows the gap inside the answer text: 22.5 pages consulted, 0.82 inline citations. Getting read is the easy part.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Titles that match a rewritten query",
              body: "Ahrefs compared each cited page's title with every fan-out query and kept the closest match: **0.656** cosine similarity. Against the original prompt, cited titles scored 0.602 and uncited ones 0.484. Title pages for the query ChatGPT writes, not only for the prompt.",
              evidence: "observed",
            },
            {
              title: "Readable URL slugs",
              body: "Retrieved URLs with natural-language slugs were cited 89.78% of the time, against 81.11% for those without (Ahrefs, Apr 2026).",
              evidence: "observed",
            },
            {
              title: "The answer in the first third",
              body: 'Kevin Indig\'s analysis of 1.2 million ChatGPT results found about 44% of citations came from the first third of a page and 24.7% from the last. Definitional "X is…" sentences were about twice as likely to be cited (Growth Memo, Feb 2026).',
              evidence: "observed",
            },
            {
              title: "Your own domain, since August",
              body: "After 8 August, brand-owned pages' citation share rose 1.80× while their reading share barely moved (0.95×), and 85.9% of 1,665 brands were cited on their own domain more often (Searchable).",
              evidence: "observed",
            },
            {
              title: "Sections with substance",
              body: "SE Ranking's 129,000-domain study found sections under 50 words averaged 2.7 citations, 120–180 words 4.6, and over 180 words 5.7 (Nov 2025).",
              evidence: "observed",
            },
            {
              title: "Fresh pages",
              body: "Pages updated in the past three months averaged 6.0 citations against 3.6 (SE Ranking), and ChatGPT's citations averaged 458 days newer than Google's organic results across 17 million citations (Ahrefs, Jul 2025).",
              evidence: "observed",
            },
            {
              title: "Being talked about",
              body: "Across 75,000 brands, branded web mentions correlated with ChatGPT visibility at 0.664, domain rating at just 0.266 (Ahrefs, Dec 2025). Mentions beat link metrics.",
              evidence: "observed",
            },
            {
              title: "Reddit: read often, cited rarely",
              body: "Reddit has its own retrieval type in ChatGPT, yet retrieved Reddit pages were cited 1.93% of the time (Ahrefs, Apr 2026). Its citation share then fell 86% after 8 August (Promptwatch, via Semrush).",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Our read on the drop-off",
          text: 'A `site:` search on your domain is usually after one fact. A page whose title names that fact and states it in the first lines is easy to cite. A page that buries it under an introduction gets read, counted in "pages consulted" and dropped.',
        },
      ],
    },
    {
      id: "openai-user-agents",
      title: "OAI-SearchBot, GPTBot, ChatGPT-User: three switches, not one",
      blocks: [
        {
          kind: "p",
          text: 'OpenAI\'s [crawler documentation](https://developers.openai.com/api/docs/bots) is explicit: "Each setting is independent of the others." The one that decides search inclusion is `OAI-SearchBot`. Sites that block it stay out of ChatGPT\'s search answers, though they can still appear as "navigational links". OpenAI\'s help center adds that eligibility also means letting its published IP ranges through your host or CDN, and that "placement is not guaranteed."',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "OAI-SearchBot",
              role: "search",
              purpose:
                "Crawls pages to surface them in ChatGPT search. The user agent ends `compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot`; IPs are in `openai.com/searchbot.json`. Robots changes take about 24 hours to reach search.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "ChatGPT-User",
              role: "user",
              purpose:
                "Visits a page when a user's question, a custom GPT or a GPT Action needs it. Not used for automatic crawling or to decide search inclusion. IPs are in `openai.com/chatgpt-user.json`.",
              robots: "partial",
              robotsNote:
                "OpenAI: because users start these actions, robots.txt rules may not apply.",
              advice: "allow",
            },
            {
              token: "GPTBot",
              role: "training",
              purpose:
                "Crawls content that may be used to train OpenAI's foundation models. Disallowing it signals your content shouldn't be used for training and has no effect on search. IPs are in `openai.com/gptbot.json`.",
              robots: "yes",
              advice: "your-call",
            },
            {
              token: "OAI-AdsBot",
              role: "other",
              purpose:
                "Visits only landing pages submitted as ChatGPT ads, to check safety and policy compliance and judge relevance. Not used for training. IPs are in `openai.com/adsbot.json`.",
              robots: "yes",
              robotsNote: "OpenAI's advertiser guidance says advertisers must allow it.",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "A robots.txt that stays in ChatGPT search, opts out of training, and lets ad review through if you advertise:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# ChatGPT search: required to be cited\nUser-agent: OAI-SearchBot\nAllow: /\n\n# Model training: your call, independent of search\nUser-agent: GPTBot\nDisallow: /\n\n# Only if you run ChatGPT ads\nUser-agent: OAI-AdsBot\nAllow: /",
        },
        {
          kind: "list",
          items: [
            "**One crawl can serve two bots.** If you allow both `OAI-SearchBot` and `GPTBot`, OpenAI says it may use the results of just one crawl for both, to avoid duplicate crawling.",
            "**Blocking isn't hiding.** A Disallow keeps pages out of answers, not out of navigational links. OpenAI doesn't document whether its crawlers honor `noindex`, so don't rely on it alone.",
            '**Your WAF outranks robots.txt.** Bot-fight modes and "block AI" toggles stop `OAI-SearchBot` before it reads a single rule. Allowlist the IPs in OpenAI\'s JSON files and serve them no challenges.',
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Cloudflare's 15 September 2026 default",
          text: 'Domains newly onboarded to Cloudflare since 15 September 2026 block its "Training" and "Agent" bot categories by default on pages that display ads, while "Search" stays allowed. Cloudflare counts chat fetchers such as `ChatGPT-User` as Agent, so live fetches for a conversation can fail on ad-supported pages even when `OAI-SearchBot` gets through ([Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/)). Existing zones aren\'t switched automatically; check the setting after any migration.',
        },
      ],
    },
    {
      id: "what-oai-searchbot-gets",
      title: "What OAI-SearchBot actually receives from your page",
      blocks: [
        {
          kind: "p",
          text: "Access is the only inclusion rule OpenAI documents. The rest of this spec sheet comes from Microsoft's role as a search partner and from correlation studies, graded by how sure anyone can be.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "OAI-SearchBot allowed, its IPs unchallenged",
              status: "required",
              note: "In robots.txt and at the CDN or WAF, per OpenAI's help center. The one rule OpenAI states.",
            },
            {
              label: "Facts in the initial HTML",
              status: "required",
              note: "OpenAI documents no JavaScript rendering, and Vercel's crawler study saw OpenAI's bots (`OAI-SearchBot`, `ChatGPT-User`, `GPTBot`) fetch JavaScript files without executing them (Dec 2024). Treat client-rendered text as missing.",
            },
            {
              label: "Indexed by Bing",
              status: "helps",
              note: "OpenAI links Microsoft's privacy statement as a search provider. Verify the site in Bing Webmaster Tools and submit sitemaps. Bing's AI Performance report covers Copilot and Bing, not ChatGPT.",
            },
            {
              label: "IndexNow",
              status: "helps",
              note: 'Microsoft recommends it to keep content fresh "across search and AI experiences." Ping on every publish and substantive update.',
            },
            {
              label: "Fast first paint",
              status: "helps",
              note: "SE Ranking: pages with first contentful paint under 0.4s averaged 6.7 citations, pages over 1.13s just 2.1. Correlation, but live fetches don't wait forever.",
            },
            {
              label: "Visible, honest dates",
              status: "helps",
              note: "Fan-outs carry the year, and recently updated pages earn more citations. Change the content when you change the date.",
            },
            {
              label: "Sitemaps and canonicals",
              status: "unconfirmed",
              note: "OpenAI doesn't say whether `OAI-SearchBot` reads sitemaps or honors `rel=canonical`. Keep both correct for Bing.",
            },
            {
              label: "noindex",
              status: "unconfirmed",
              note: "Not documented for OpenAI's crawlers. Use it, but don't count on it alone to keep a page out of ChatGPT.",
            },
            {
              label: "FAQ schema",
              status: "no-effect",
              note: "SE Ranking found pages with FAQ schema averaged 3.6 citations against 4.2 without.",
            },
            {
              label: "llms.txt",
              status: "no-effect",
              note: "OpenAI has never said ChatGPT reads it, and SE Ranking's model got more accurate when the variable was removed.",
            },
          ],
        },
        {
          kind: "p",
          text: "To check what the crawler gets, request the page with its user agent and count the sentence you want cited in the raw HTML:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'curl -s -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot" \\\n  https://yoursite.com/pricing | grep -c "per user a month"\n\n# 0 = the sentence is rendered client-side, or your WAF served a challenge',
        },
        {
          kind: "p",
          text: "A WAF that verifies OpenAI's IP ranges may answer your spoofed request differently from the real crawler, so confirm with real `OAI-SearchBot` hits in your logs too.",
        },
      ],
    },
    {
      id: "pill-to-pageview",
      title: "From citation pill to pageview: reading ChatGPT in your analytics",
      blocks: [
        {
          kind: "p",
          text: "In the answer, cited pages appear as inline citations that open the source (on desktop, hovering previews it) and in a **Sources** button that lists cited sources and other relevant links ([OpenAI Help](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt)). Since 7 May 2026 ChatGPT also links brand names inline far more often: Profound saw the share of responses containing a URL jump from about 4.5% to 20–24% in a day, and OpenAI referrals to the brands it monitors rise 60–65%, with homepages taking a much bigger share ([Profound](https://www.tryprofound.com/blog/chatgpt-referrals-branded-links)).",
        },
        { kind: "h3", text: "What a ChatGPT click looks like on arrival" },
        {
          kind: "code",
          lang: "text",
          code: "Landing URL     https://plotbright.com/pricing?utm_source=chatgpt.com\nReferrer        https://chatgpt.com/\nGA4 source      chatgpt.com\nGA4 channel     AI Assistant",
        },
        {
          kind: "list",
          items: [
            "**The tag is undocumented now.** OpenAI used to state in a publisher FAQ that ChatGPT adds `utm_source=chatgpt.com` to its links. That article has since been rewritten as the [ChatGPT Atlas retirement notice](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), so treat the tag as observed behaviour that can change, and build reports on the referrer too.",
            "**GA4 groups it for you.** On 13 May 2026 Google Analytics added an **AI Assistant** default channel: visits with a recognised AI-assistant referrer get the medium `ai-assistant` and the campaign `(ai-assistant)` ([Google](https://support.google.com/analytics/answer/9164320)). It covers ChatGPT, Gemini, DeepSeek, Copilot and Grok, and excludes Google's own AI Overviews and AI Mode.",
            "**Keep a backstop.** A custom channel on the `chatgpt.com` source catches visits the default rules miss, such as an app that strips the referrer while the tag survives.",
          ],
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: '# Custom channel group: "ChatGPT", placed above Referral\n# Condition: Session source matches regex\n^(chatgpt\\.com|chat\\.openai\\.com)$',
        },
        {
          kind: "p",
          text: "Keep paid and feed clicks out of the organic number: tag ChatGPT ad landing pages with your own `utm_medium` (such as `cpc`), and add `utm_medium=feed` to product-feed URLs, as OpenAI's commerce docs suggest. Then add the server-side view, where `ChatGPT-User` hits are pages being fetched live for a conversation:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# OpenAI hits by agent\ngrep -oE "OAI-SearchBot|ChatGPT-User|GPTBot|OAI-AdsBot" access.log | sort | uniq -c\n\n# Pages fetched live for ChatGPT conversations, most first\ngrep "ChatGPT-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
        },
        {
          kind: "p",
          text: "User agents are easy to fake, so check hits against OpenAI's IP files. OpenAI offers publishers no citation dashboard, so the citations themselves need a fixed panel of buyer prompts, run on a schedule, recording which domains appear in the Sources list.",
        },
      ],
    },
    {
      id: "shopping-feeds",
      title: "Product answers run on feeds, not on your product pages",
      blocks: [
        {
          kind: "p",
          text: 'When a question is about buying something, ChatGPT can show a product carousel, and selecting a product can list the merchants that sell it. OpenAI says product results "are not ads" and come from structured metadata from first- and third-party providers, and that merchants are ranked on availability, price, quality and whether they\'re the maker or primary seller ([OpenAI Help](https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search)).',
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Shopify stores: nothing to do.** Product data flows in through Shopify Catalog.",
            '**Everyone else: apply for a direct feed.** OpenAI\'s [commerce docs](https://developers.openai.com/commerce) say product-feed onboarding is "currently available to approved partners". Feeds go in by API or SFTP upload, following the Agentic Commerce Protocol (ACP) specs.',
            "**Checkout can stay yours.** Since 24 March 2026 merchants can send buyers to their own checkout; Instant Checkout inside ChatGPT remains only for some eligible products ([OpenAI](https://openai.com/index/powering-product-discovery-in-chatgpt/)).",
            "**Let the crawler see your images.** OpenAI's [advertiser guidance](https://help.openai.com/en/articles/20001243-advertiser-guidance-for-allowing-openai-web-crawlers) asks product-feed merchants to let `OAI-SearchBot` crawl product image URLs.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Our read on the merchant ranking",
          text: 'Availability and price are feed fields, so a stale feed loses to a competitor\'s fresh one even when your site is current. "Maker or primary seller" favours brands that sell direct, which is one more reason to keep official product pages complete.',
        },
      ],
    },
    {
      id: "agents-after-atlas",
      title: "Agents after Atlas: cloud browser, desktop browser and WebMCP",
      blocks: [
        {
          kind: "p",
          text: 'OpenAI\'s agent surfaces changed through 2026. ChatGPT Atlas, the browser launched in October 2025, "has since been deprecated" ([OpenAI](https://openai.com/index/introducing-chatgpt-atlas/)). The standalone ChatGPT agent "is no longer available", and OpenAI points users to **ChatGPT Work** and its cloud browser instead ([OpenAI Help](https://help.openai.com/en/articles/11752874-chatgpt-agent)). What reaches your server now:',
        },
        {
          kind: "table",
          head: ["Surface", "Where it runs", "How your server sees it"],
          rows: [
            [
              "Cloud browser (ChatGPT Work, paid plans except Free and Go)",
              "A browser on OpenAI's computers",
              'Requests signed with Web Bot Auth (RFC 9421), header `Signature-Agent: "https://chatgpt.com"`',
            ],
            [
              "Built-in browser (ChatGPT desktop app)",
              "The user's own Mac or Windows PC",
              "Not documented by OpenAI",
            ],
            [
              "`ChatGPT-User` fetches",
              "OpenAI's servers",
              "Declared user agent, IPs in `chatgpt-user.json`",
            ],
          ],
        },
        {
          kind: "code",
          lang: "http",
          code: 'Signature-Agent: "https://chatgpt.com"\nSignature-Input: sig1=(...)\nSignature: sig1=:...:\n\n# Public keys: https://chatgpt.com/.well-known/http-message-signatures-directory',
        },
        {
          kind: "p",
          text: 'Verify the signature rather than blocking the whole agent category. OpenAI\'s [allowlisting guide](https://help.openai.com/en/articles/11845367-chatgpt-works-cloud-browser-allowlisting) notes that Akamai, HUMAN and Vercel already recognise it by name. In the desktop app, websites can also offer **site tools** through WebMCP, which OpenAI describes as "a proposed web standard that lets websites make tools available directly to AI agents" ([OpenAI Help](https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app)). OpenAI publishes no developer guide for it yet, so a clean, server-rendered sign-up and checkout flow matters more today.',
        },
      ],
    },
    {
      id: "beliefs-2026-broke",
      title: "ChatGPT beliefs the 2026 data broke",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking GPTBot takes you out of ChatGPT.",
              reality:
                "`GPTBot` is training-only. Search inclusion is `OAI-SearchBot`, and OpenAI keeps the two settings independent.",
            },
            {
              myth: "ChatGPT just repeats Google's or Bing's top 10.",
              reality:
                "In Ahrefs' 15,000-query test about 8% of ChatGPT's citations ranked in either top 10 for the same prompt. An October 2026 paper found Google results and OpenAI's search API together recovered only about a quarter of the URLs ChatGPT cited ([arXiv](https://arxiv.org/abs/2610.15382)).",
            },
            {
              myth: "Reddit threads are the shortcut into answers.",
              reality:
                "Retrieved Reddit pages were cited 1.93% of the time, and Ahrefs measured an 88% fall in Reddit citations from March to September 2026. Brand-owned pages gained.",
            },
            {
              myth: "Ads or shopping deals buy recommendations.",
              reality:
                'OpenAI: "Ads do not influence the answers ChatGPT gives you." Ads are labelled sponsored and sit apart from the answer, and product results "are not ads" ([OpenAI](https://openai.com/index/testing-ads-in-chatgpt/)).',
            },
            {
              myth: "llms.txt and FAQ schema get you cited.",
              reality:
                "Neither showed a lift in SE Ranking's ChatGPT data, and OpenAI has never said ChatGPT reads llms.txt.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "searchbot-robots",
      title: "Allow OAI-SearchBot, and decide on GPTBot separately",
      detail: "Look for blanket `User-agent: *` blocks that catch it by accident.",
      impact: "high",
    },
    {
      id: "waf-ips",
      title: "Allowlist OpenAI's IP files at the CDN and WAF",
      detail:
        "`searchbot.json` and `chatgpt-user.json`. On Cloudflare, review the AI bot categories, especially on pages with ads.",
      impact: "high",
    },
    {
      id: "raw-html",
      title: "Confirm key facts are in the raw HTML",
      detail:
        "Run the `curl` test on pricing, spec and policy pages, then check logs for real `OAI-SearchBot` hits.",
      impact: "high",
    },
    {
      id: "official-pages",
      title: "Publish one official page per fact buyers check",
      detail:
        "Pricing, plans, specs, integrations, security, returns, support: the pages `site:` fan-outs land on.",
      impact: "high",
    },
    {
      id: "titles-slugs",
      title: "Title and slug each page for the query ChatGPT writes",
      detail:
        'Name the product and the fact, like "Plotbright pricing: Free, Team and Business plans", with a readable slug.',
      impact: "high",
    },
    {
      id: "first-third",
      title: "State the answer in the first third",
      detail:
        "A definitional first sentence, then the numbers. Give sections enough words (120+) to carry their context.",
      impact: "high",
    },
    {
      id: "current-year",
      title: "Keep prices, specs and dates current",
      detail:
        "Fan-outs add the year. Update the page and its visible date together, never the date alone.",
      impact: "medium",
    },
    {
      id: "bing-indexnow",
      title: "Verify in Bing Webmaster Tools and turn on IndexNow",
      detail: "Submit sitemaps, fix unindexed URLs, and ping IndexNow on every publish and update.",
      impact: "medium",
    },
    {
      id: "product-feed",
      title: "E-commerce: get your catalog into ChatGPT",
      detail:
        "Shopify is automatic. Otherwise apply for a direct ACP feed and tag feed URLs `utm_medium=feed`.",
      impact: "medium",
    },
    {
      id: "mentions",
      title: "Earn mentions where buyers research",
      detail:
        "Trade press, review sites and YouTube. Branded mentions track AI visibility far better than domain rating.",
      impact: "medium",
    },
    {
      id: "cloud-browser",
      title: "Verify ChatGPT's cloud browser instead of blocking it",
      detail:
        "Check Web Bot Auth signatures against chatgpt.com's key directory rather than blanket-blocking agents.",
      impact: "low",
    },
    {
      id: "analytics",
      title: "Wire ChatGPT into analytics",
      detail:
        "GA4's AI Assistant channel plus a `chatgpt.com` custom channel, log monitoring of all four OpenAI agents, and a scheduled prompt panel.",
      impact: "high",
    },
  ],

  faqs: [
    {
      q: "Does ChatGPT use Google or Bing to search?",
      a: "Neither alone. OpenAI says ChatGPT search partners with other search providers and links Microsoft's and Shopify's privacy policies, and it runs its own crawler, `OAI-SearchBot`. Being indexed by Bing and crawlable by `OAI-SearchBot` covers both paths.",
    },
    {
      q: "Can I stay in ChatGPT search but opt out of AI training?",
      a: "Yes. Allow `OAI-SearchBot` and disallow `GPTBot` in robots.txt. OpenAI treats the two as independent settings, and changes take about 24 hours to reach search.",
    },
    {
      q: "Why does ChatGPT read my page but not cite it?",
      a: "It reads far more than it cites: Ahrefs found about half of retrieved URLs go uncited. Pages whose titles match the rewritten query and state the fact in their first lines are the ones that make the cut.",
    },
    {
      q: "What changed in ChatGPT search in August 2026?",
      a: "On 8 August, as GPT-5.6 became the default, ChatGPT began consulting about twice as many pages per answer and running far more `site:` searches of brand and official domains. Brand-owned pages gained citations, and Reddit's share fell about 86%.",
    },
    {
      q: "How do I see ChatGPT traffic in Google Analytics 4?",
      a: "Check the AI Assistant default channel, added on 13 May 2026, and the session source `chatgpt.com`. Add a custom channel on `chatgpt.com` as a backstop, and tag your own ads and product feeds so they don't inflate it.",
    },
    {
      q: "Does ChatGPT render JavaScript?",
      a: "OpenAI doesn't document rendering, and Vercel's crawler study found OpenAI's bots fetch JavaScript files without running them. Put anything you want cited in the server-rendered HTML.",
    },
    {
      q: "How do products get into ChatGPT shopping results?",
      a: "Shopify merchants are included through Shopify Catalog. Other merchants apply for a direct product feed under the Agentic Commerce Protocol, which is open to approved partners. Product results aren't ads, and checkout can stay on your own site.",
    },
    {
      q: "Is ChatGPT Atlas still worth optimizing for?",
      a: "No. OpenAI has deprecated Atlas and retired the standalone ChatGPT agent. Agent browsing now runs through ChatGPT Work's cloud browser, which signs its requests with Web Bot Auth, and the built-in browser in the ChatGPT desktop app.",
    },
  ],

  sources: [
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
    {
      title: "Searching the web with ChatGPT",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt",
    },
    {
      title: "Shopping with ChatGPT Search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search",
    },
    {
      title: "Powering product discovery in ChatGPT",
      publisher: "OpenAI",
      href: "https://openai.com/index/powering-product-discovery-in-chatgpt/",
    },
    {
      title: "Commerce: Agentic Commerce Protocol and product feeds",
      publisher: "OpenAI Developers",
      href: "https://developers.openai.com/commerce",
    },
    {
      title: "Advertiser guidance for allowing OpenAI web crawlers",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/20001243-advertiser-guidance-for-allowing-openai-web-crawlers",
    },
    {
      title: "Testing ads in ChatGPT",
      publisher: "OpenAI",
      href: "https://openai.com/index/testing-ads-in-chatgpt/",
    },
    {
      title: "ChatGPT Atlas retirement (formerly the publishers and developers FAQ)",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/12627856-publishers-and-developers-faq",
    },
    {
      title: "Introducing ChatGPT Atlas",
      publisher: "OpenAI",
      href: "https://openai.com/index/introducing-chatgpt-atlas/",
    },
    {
      title: "ChatGPT agent",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/11752874-chatgpt-agent",
    },
    {
      title: "Using cloud browser in ChatGPT",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt",
    },
    {
      title: "ChatGPT Work's cloud browser allowlisting",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/11845367-chatgpt-works-cloud-browser-allowlisting",
    },
    {
      title: "Using site tools in the ChatGPT desktop app",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app",
    },
    {
      title: "ChatGPT's research depth doubled",
      publisher: "Searchable",
      href: "https://www.searchable.com/blog/chatgpt-research-depth-study",
    },
    {
      title: "GPT-5.6 retrieval changes",
      publisher: "Peec AI",
      href: "https://docs.peec.ai/research/gpt-56-retrieval-changes",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
    {
      title: "How ChatGPT does query fan-out (15 million queries studied)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/query-fan-out-chatgpt/",
    },
    {
      title: "Why ChatGPT cites the pages it does",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
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
      title: "AI brand visibility correlations (75,000 brands)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
    {
      title: "Understanding ChatGPT citations: evidence from production web search",
      publisher: "arXiv",
      href: "https://arxiv.org/abs/2610.15382",
    },
    {
      title: "How to optimize for ChatGPT (129,000-domain study)",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
    {
      title: "The science of how AI pays attention",
      publisher: "Growth Memo",
      href: "https://www.growth-memo.com/p/the-science-of-how-ai-pays-attention",
    },
    {
      title: "Reddit's citations in ChatGPT fall",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/reddits-citations-in-chatgpt-fall/",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
    {
      title: "The branded link update",
      publisher: "Profound",
      href: "https://www.tryprofound.com/blog/chatgpt-referrals-branded-links",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "Your site, your rules: new AI traffic options",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/content-independence-day-ai-options/",
    },
    {
      title: "AI Performance in Bing Webmaster Tools",
      publisher: "Microsoft Bing",
      href: "https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview",
    },
    {
      title: "What's new in Google Analytics (AI Assistant traffic)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9164320",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
  ],

  sameAs: ["https://en.wikipedia.org/wiki/ChatGPT", "https://chatgpt.com"],

  furtherReading: [
    {
      title: "How to get cited by ChatGPT: the 2026 playbook",
      href: "/blog/how-to-get-cited-by-chatgpt",
      description:
        "The content side, step by step: finding buyer questions, writing answer-first pages, and building a prompt panel.",
    },
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Allow OAI-SearchBot, make a deliberate call on GPTBot, and cover every other AI crawler in one file.",
    },
    {
      title: "AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "Paste an access log and see which AI crawlers, OpenAI's included, fetched which pages, without writing the grep yourself.",
    },
    {
      title: "Query fan-out, explained",
      href: "/glossary/query-fan-out",
      description:
        "The glossary entry for the rewritten searches behind every AI answer, across engines.",
    },
  ],
};
