import type { EngineGuide } from "../types";

export const chatgpt: EngineGuide = {
  slug: "chatgpt",
  metaTitle: "ChatGPT SEO: The Technical Guide to ChatGPT Search (2026)",
  metaDescription:
    "How ChatGPT search finds and cites sources: query fan-out, OAI-SearchBot vs GPTBot vs ChatGPT-User, Bing and IndexNow, the August 2026 site: shift, and how to track ChatGPT traffic.",
  keywords: [
    "ChatGPT SEO",
    "ChatGPT search optimization",
    "OAI-SearchBot",
    "how to rank in ChatGPT",
    "get cited by ChatGPT",
    "ChatGPT fan-out queries",
  ],
  headline: { lead: "ChatGPT SEO:", accent: "the technical guide to ChatGPT search" },
  subhead:
    "How ChatGPT decides to search, rewrites one question into many, picks which pages to cite, and which OpenAI crawler controls each step — with the robots.txt, analytics and log setup to act on it.",

  shortAnswer:
    "To rank in ChatGPT search, allow **OAI-SearchBot** in robots.txt and at your CDN, serve your content in the initial HTML, and get indexed by Bing. ChatGPT rewrites each question into several targeted searches — since August 2026 often `site:` searches of official domains — so the pages it cites are the ones whose titles and opening answers match those sub-queries: clear, current, first-party pages on your own site.",

  takeaways: [
    "`OAI-SearchBot` controls ChatGPT search visibility. `GPTBot` is training only — block it and you stay in search.",
    "ChatGPT searched on about a third of prompts in early 2026, rewriting each into several targeted queries.",
    "In August 2026 fan-out jumped to about 7.6 searches per prompt, 64% of them `site:` searches aimed at official, brand and .gov domains.",
    "Only about 8% of ChatGPT's citations rank in Google's or Bing's top 10 for the original prompt. Matching the sub-queries matters more.",
    "OpenAI documents no JavaScript rendering, and its crawler was observed not running JS. Server-render what you want cited.",
    "Every ChatGPT link carries `utm_source=chatgpt.com`, and GA4's AI Assistant channel now groups it automatically.",
  ],

  facts: [
    { label: "Weekly ChatGPT users (Feb 2026)", value: "900M" },
    { label: "The crawler to allow for search", value: "OAI-SearchBot", mono: true },
    { label: "Searches per prompt after Aug 2026", value: "~7.6" },
    { label: "Referral source, UTM-tagged", value: "chatgpt.com", mono: true },
  ],

  preview: {
    prompt: "What's the best project management tool for a small startup team?",
    status: "Searched 24 sites",
    answer:
      "For lean startup teams, **Plannora** is widely recommended — simple boards, built-in automations and a free tier for up to five people. It's frequently cited as the easiest tool to set up.",
    sources: [
      { domain: "plannora.io", title: "Plannora pricing and plans" },
      { domain: "stackreview.co", title: "Best project management tools for startups" },
      { domain: "loopcraft.ai", title: "Loopcraft vs Plannora" },
    ],
  },

  profile: {
    retrieval: "Third-party providers (Microsoft named) plus OpenAI's own crawler and index",
    searchCrawler: "OAI-SearchBot",
    trainingCrawler: "GPTBot — search unaffected",
    rendersJs: "Not documented — tests found no JS execution",
    referrer: "chatgpt.com + utm_source=chatgpt.com",
    citationStyle: "Inline source pills, a Sources panel, branded inline links",
    biggestLever: "Official, answer-first pages on your own domain that match fan-out queries",
  },

  sections: [
    {
      id: "how-chatgpt-searches",
      title: "How ChatGPT search finds and chooses sources",
      blocks: [
        {
          kind: "p",
          text: 'ChatGPT "will choose to search the web based on what you ask," per OpenAI\'s [search help article](https://help.openai.com/en/articles/9237897-chatgpt-search), and users can force a search with the Search tool. Semrush\'s clickstream data puts search at **34.5% of prompts** in February 2026. When it does search, ChatGPT "typically rewrites your query into one or more targeted queries" — OpenAI\'s example turns "CCR8 for cancer" into "CCR8 immunotherapy drug development 2025."',
        },
        {
          kind: "p",
          text: 'Those queries go to "third-party search providers, as well as content provided directly by our partners." The current help article names **Microsoft** and **Shopify**. Independent reverse-engineering by [Peec AI](https://peec.ai/blog/chatgpt-built-its-own-search-index) describes a blended stack underneath, including an OpenAI-built index it calls "Labrador" with vertical indexes for news, PDFs, video, local and shopping. OpenAI hasn\'t confirmed the details — but its own crawler, `OAI-SearchBot`, exists to feed ChatGPT search, so plan for both Bing and OpenAI\'s index.',
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "ChatGPT decides whether to search",
              body: "Current, specific or local questions trigger a search; stable knowledge is answered from training. Location is inferred at country, state or city level and memories may shape the rewrite.",
            },
            {
              title: "It fans the question out into targeted queries",
              body: "Until mid-2026 most prompts produced two or three sub-queries. Around 8 August 2026 that jumped: Nectiv measured **7.61 fan-outs per prompt**, 64% using the `site:` operator to search specific brand, vendor and .gov domains directly.",
              lever:
                "Have an official page on your own domain for every fact a buyer checks: pricing, specs, policies, integrations, comparisons.",
            },
            {
              title: "Providers and OpenAI's index return candidates",
              body: "Peec measured sources retrieved per prompt doubling from about 12 to about 24 after the August change. Ahrefs found roughly as many retrieved URLs go uncited as cited.",
              lever:
                "Be indexed by Bing and crawlable by `OAI-SearchBot` — both paths feed the pool.",
            },
            {
              title: "Pages are read, not rendered",
              body: "Indexed pages come from `OAI-SearchBot`; live fetches for a conversation come from `ChatGPT-User`. OpenAI documents no JavaScript rendering, and Vercel's crawler study saw OpenAI's bot download scripts without running them.",
              lever: "Put the answer in the server-rendered HTML.",
            },
            {
              title: "The answer cites the passages it used",
              body: "Citations appear as inline source pills and in a Sources panel. Since May 2026 ChatGPT also adds branded inline links — Profound saw responses with them rise from about 4.5% to over 20%, sending far more clicks to homepages.",
              lever:
                "Match your titles and opening sentences to the sub-query, and state the fact early.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "900M",
              label: 'weekly active ChatGPT users, with search usage "nearly tripled" in a year',
              source: {
                name: "OpenAI, Feb–Mar 2026",
                href: "https://openai.com/index/accelerating-the-next-phase-ai/",
              },
            },
            {
              value: "7.61",
              label: "fan-out searches per prompt after the August 2026 change, up from 2.17",
              source: {
                name: "Nectiv, Aug 2026",
                href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
              },
            },
            {
              value: "~8%",
              label:
                "of ChatGPT citations rank in Google's or Bing's top 10 for the original prompt",
              source: {
                name: "Ahrefs, Aug 2025",
                href: "https://ahrefs.com/blog/ai-search-overlap/",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "What the August 2026 shift means",
          text: '`site:` fan-outs go straight to domains ChatGPT already considers authoritative for a question — the vendor itself, regulators, standards bodies — and "official" became the second most common word in fan-out queries. Third-party roundups still matter, but the fastest route into an answer about your product is now your own clearly titled page. Reddit felt it first: its share of ChatGPT citations fell about 86% in August, per Promptwatch data reported by Semrush.',
        },
      ],
    },
    {
      id: "crawlers",
      title: "OpenAI's crawlers and robots.txt",
      blocks: [
        {
          kind: "p",
          text: 'OpenAI\'s [crawler documentation](https://developers.openai.com/api/docs/bots) lists each bot with its own robots.txt token, and the settings are independent. The one that decides search visibility is `OAI-SearchBot`: "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links."',
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "OAI-SearchBot",
              role: "search",
              purpose:
                "Surfaces websites in ChatGPT search. OpenAI also recommends allowing its published IP ranges at `openai.com/searchbot.json`.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "ChatGPT-User",
              role: "user",
              purpose:
                "Fetches pages when a user's conversation, a GPT or a GPT Action needs them. Not used to decide what appears in search.",
              robots: "partial",
              robotsNote: 'OpenAI: "robots.txt rules may not apply" to user-initiated fetches.',
              advice: "allow",
            },
            {
              token: "GPTBot",
              role: "training",
              purpose:
                "Collects content that may be used to train OpenAI's models. \"Disallowing GPTBot indicates a site's content should not be used in training.\"",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "p",
          text: "A fourth bot, `OAI-AdsBot`, only visits landing pages submitted as ChatGPT ads, to check their safety and relevance. A robots.txt that stays in ChatGPT search while opting out of training:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# ChatGPT search — required to be cited\nUser-agent: OAI-SearchBot\nAllow: /\n\n# Model training — your call, independent of search\nUser-agent: GPTBot\nDisallow: /",
        },
        {
          kind: "list",
          items: [
            "**Changes take about 24 hours** to reach OpenAI's search systems.",
            '**When both bots are allowed**, OpenAI "may use the results from just one crawl for both use cases" — so allowing both doesn\'t double your crawl load.',
            "**To keep a page out entirely, use `noindex`, not Disallow.** A disallowed URL can still surface as a link and title found through providers, and the crawler must be allowed in to read the `noindex`.",
            "**ChatGPT-User needs no rule to work**, and a Disallow for it isn't guaranteed to be honored. Block it at the WAF if you must.",
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Check your CDN — especially on Cloudflare",
          text: 'From 15 September 2026, new Cloudflare domains block "Training" and "Agent" bots by default on pages that show ads, while allowing "Search" bots — and Cloudflare\'s own example of an Agent bot is `ChatGPT-User`. Bot-fight modes and "block AI" toggles override robots.txt. Allowlist the IPs in OpenAI\'s JSON files and don\'t serve challenges to them.',
        },
        {
          kind: "p",
          text: "ChatGPT's agent — now ChatGPT Work's cloud browser — sends a normal Chrome user agent but signs its requests with Web Bot Auth (RFC 9421), so you can verify it rather than block it:",
        },
        {
          kind: "code",
          lang: "http",
          code: 'Signature-Agent: "https://chatgpt.com"\nSignature-Input: sig1=(...);keyid="...";tag="web-bot-auth"\nSignature: sig1=:...:\n\n# Public keys: https://chatgpt.com/.well-known/http-message-signatures-directory',
        },
      ],
    },
    {
      id: "technical",
      title: "Technical requirements",
      blocks: [
        {
          kind: "p",
          text: "OpenAI publishes one hard requirement — don't block `OAI-SearchBot` — and very little else. The rest of this spec sheet comes from Microsoft's documentation (Microsoft is a named search provider) and from large correlation studies, graded accordingly.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "OAI-SearchBot allowed",
              status: "required",
              note: "In robots.txt and at the CDN/WAF layer, including its published IP ranges. This is the only inclusion rule OpenAI documents.",
            },
            {
              label: "Content in the initial HTML",
              status: "required",
              note: "OpenAI doesn't document rendering, and the only direct test (Vercel/MERJ) found no JS execution. Treat client-rendered text as invisible.",
            },
            {
              label: "Indexed by Bing",
              status: "helps",
              note: "Verify in Bing Webmaster Tools and submit sitemaps. Its AI Performance report covers Copilot and Bing, not ChatGPT — but Bing's index still feeds ChatGPT's providers.",
            },
            {
              label: "IndexNow",
              status: "helps",
              note: "Ping on every publish and update so Bing picks up changes in minutes. Microsoft recommends it for freshness.",
            },
            {
              label: "Speed",
              status: "helps",
              note: "SE Ranking found pages with first contentful paint under 0.4s averaged 6.7 citations against 2.1 for pages over 1.13s. Correlation, but consistent with live fetches timing out.",
            },
            {
              label: "Freshness",
              status: "helps",
              note: "Pages updated within three months averaged 6.0 citations against 3.6 (SE Ranking), and ChatGPT's citations run 458 days newer than Google's organic results (Ahrefs).",
            },
            {
              label: "Product feed (ACP)",
              status: "helps",
              note: "For shopping answers. Products come from structured feeds via the Agentic Commerce Protocol and are ranked on availability, price, quality and whether you're the maker or primary seller.",
            },
            {
              label: "Sitemaps & canonicals",
              status: "unconfirmed",
              note: "OpenAI doesn't say whether `OAI-SearchBot` reads sitemaps or honors `rel=canonical`. Keep both correct for Bing and Google.",
            },
            {
              label: "FAQ & other schema",
              status: "no-effect",
              note: "No OpenAI statement for general pages. SE Ranking found pages with FAQ schema averaged 3.6 citations against 4.2 without.",
            },
            {
              label: "llms.txt",
              status: "no-effect",
              note: 'OpenAI has never said ChatGPT uses it; SE Ranking measured a "negligible" effect. Harmless, but not a priority.',
            },
          ],
        },
        {
          kind: "p",
          text: "To check what OpenAI's crawler actually receives, request a page with its user agent and look for your key sentence in the raw HTML:",
        },
        {
          kind: "code",
          lang: "bash",
          code: 'curl -s -A "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot" \\\n  https://yoursite.com/pricing | grep -c "Plans start at"\n\n# 0 = the text is rendered client-side, or your WAF is serving a challenge',
        },
      ],
    },
    {
      id: "what-gets-cited",
      title: "What ChatGPT cites",
      blocks: [
        {
          kind: "p",
          text: "OpenAI says it \"doesn't set a fixed level of visibility for individual sites,\" and there's no inclusion form for web pages. What the large studies do show is consistent: ChatGPT rewards pages that match the sub-query, answer early, stay current, and belong to brands the wider web talks about.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Match the sub-query",
              body: "Cited pages' titles matched fan-out queries at 0.656 cosine similarity, and natural-language URL slugs had an 89.8% citation rate against 81.1% without (Ahrefs, Apr 2026).",
              evidence: "observed",
            },
            {
              title: "Official pages on your own domain",
              body: 'Since August 2026, `site:` fan-outs target brand, vendor and .gov domains, and "official" is the second most common fan-out word.',
              evidence: "observed",
            },
            {
              title: "Answer in the first third",
              body: '44.2% of ChatGPT citations came from the first 30% of a page, and definitional "X is…" sentences were about twice as likely to be cited (Growth Memo, 1.2M responses).',
              evidence: "observed",
            },
            {
              title: "Freshness",
              body: "Cited URLs skew newer than search results, and recently updated pages earn more citations. Update substantively — never just the date.",
              evidence: "observed",
            },
            {
              title: "Brand mentions, especially YouTube",
              body: "Across 75K brands, YouTube mentions correlated most with AI visibility (~0.74), branded web mentions next (0.66–0.71); domain rating was weak (Ahrefs, May 2026).",
              evidence: "observed",
            },
            {
              title: "Sections of 120–180 words",
              body: "SE Ranking found mid-length sections between headings performed best. Short enough to lift, long enough to carry context.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "h3",
          text: "Ads and shopping don't buy citations",
        },
        {
          kind: "p",
          text: 'ChatGPT has run ads since February 2026 — for Free and Go users in the US, then Canada, Australia, New Zealand, the UK, Mexico, Brazil, Japan and South Korea — and OpenAI says ads "do not influence the answers." Shopping results are "not ads": they come from structured product metadata, and since March 2026 merchants supply it through Agentic Commerce Protocol feeds while using their own checkout.',
        },
      ],
    },
    {
      id: "measurement",
      title: "Tracking ChatGPT traffic",
      blocks: [
        {
          kind: "p",
          text: "OpenAI's [publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq) confirms ChatGPT \"automatically includes the UTM parameter utm_source=chatgpt.com in referral URLs,\" and the referrer is `chatgpt.com`. Since 13 May 2026, GA4's default **AI Assistant** channel groups ChatGPT traffic automatically (medium `ai-assistant`). It isn't retroactive, and some app traffic arrives with no referrer, so keep a custom channel as a backstop.",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: '# Custom channel "AI – ChatGPT", placed above Referral\n# Session source matches regex:\n^(chatgpt\\.com|chat\\.openai\\.com|openai\\.com)$\n\n# All major AI assistants\n^(chatgpt\\.com|chat\\.openai\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com)$',
        },
        {
          kind: "p",
          text: "Tag your own ChatGPT ads (`utm_medium=cpc`) and product feeds (`utm_medium=feed`) so paid and feed clicks don't inflate your organic citation numbers. Then add the server-side view — `ChatGPT-User` hits are the closest thing to a live signal that a real prompt pulled your page:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# OpenAI bot hits by type\ngrep -oE "OAI-SearchBot|ChatGPT-User|GPTBot|OAI-AdsBot" access.log | sort | uniq -c\n\n# Pages fetched live for ChatGPT conversations\ngrep "ChatGPT-User" access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -20',
        },
        {
          kind: "p",
          text: "Verify IPs against `searchbot.json`, `chatgpt-user.json` and `gptbot.json` — user agents are easy to spoof. OpenAI offers no publisher analytics dashboard, so citations themselves still need a prompt panel: a fixed set of buyer questions, run weekly, recording who's cited.",
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
              myth: "Blocking GPTBot removes you from ChatGPT.",
              reality:
                "`GPTBot` is training only. Search visibility is `OAI-SearchBot`, and the two settings are independent.",
            },
            {
              myth: "ChatGPT just shows Bing's top 10.",
              reality:
                "Only about 8% of its citations rank in the top 10 for the original prompt. Fan-out, `site:` queries and OpenAI's own index decide who's picked.",
            },
            {
              myth: "Reddit seeding and FAQ schema are shortcuts.",
              reality:
                "Reddit's citation share fell about 86% in August 2026 and retrieved Reddit pages get cited 1.9% of the time. FAQ schema showed no lift in SE Ranking's data.",
            },
            {
              myth: "You can buy your way into answers.",
              reality:
                "Ads are labeled and separate, and OpenAI says they don't influence answers. Product results aren't ads either.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "robots",
      title: "Allow OAI-SearchBot in robots.txt",
      detail: "Check for blanket `User-agent: *` blocks, and decide on `GPTBot` separately.",
      impact: "high",
    },
    {
      id: "cdn",
      title: "Allowlist OpenAI at your CDN and WAF",
      detail:
        "Use the IPs in `searchbot.json`; review Cloudflare's AI crawl settings and its September 2026 defaults.",
      impact: "high",
    },
    {
      id: "html",
      title: "Serve key content in the initial HTML",
      detail:
        "Test with `curl` and the `OAI-SearchBot` user agent. No answers behind JS, cookie walls or interstitials.",
      impact: "high",
    },
    {
      id: "bing",
      title: "Verify in Bing Webmaster Tools and submit sitemaps",
      detail:
        "Microsoft is a named ChatGPT search provider. Fix anything Bing reports as not indexed.",
      impact: "high",
    },
    {
      id: "indexnow",
      title: "Turn on IndexNow",
      detail: "Ping on every publish and substantive update.",
      impact: "medium",
    },
    {
      id: "official-pages",
      title: "Build an official page for every fact buyers check",
      detail:
        "Pricing, specs, integrations, policies, docs and comparisons — the targets of `site:` fan-outs.",
      impact: "high",
    },
    {
      id: "titles",
      title: "Match titles, H2s and slugs to sub-questions",
      detail: "Natural-language titles and slugs that read like the query ChatGPT writes.",
      impact: "high",
    },
    {
      id: "answer-first",
      title: "Put the answer in the first third",
      detail:
        "Definitional opening sentences, question-shaped headings, sections of roughly 120–180 words.",
      impact: "high",
    },
    {
      id: "freshness",
      title: "Refresh top pages at least quarterly",
      detail:
        "Substantive updates with visible dates. Never bump a date without changing the page.",
      impact: "medium",
    },
    {
      id: "noindex",
      title: "Use noindex, not Disallow, for pages that must never surface",
      detail:
        "A disallowed URL can still show as a link and title. The crawler must be allowed in to read `noindex`.",
      impact: "low",
    },
    {
      id: "mentions",
      title: "Earn mentions off-site",
      detail:
        "YouTube, review platforms, trade press, and Wikipedia where you're genuinely notable.",
      impact: "medium",
    },
    {
      id: "acp",
      title: "E-commerce: submit an ACP product feed",
      detail: "Complete variants, prices and availability. Tag URLs with `utm_medium=feed`.",
      impact: "medium",
    },
    {
      id: "speed",
      title: "Keep responses fast for bots",
      detail: "Low TTFB and first contentful paint, no challenges for verified OpenAI IPs.",
      impact: "medium",
    },
    {
      id: "measure",
      title: "Set up measurement",
      detail:
        "GA4 AI Assistant channel plus a custom backstop, log monitoring of the four user agents, and a weekly prompt panel.",
      impact: "high",
    },
  ],

  faqs: [
    {
      q: "How do I get my website to show up in ChatGPT?",
      a: "Allow `OAI-SearchBot` in robots.txt and at your CDN, make sure your content is in the raw HTML, and get indexed by Bing. After that, citations depend on how well your pages match the sub-queries ChatGPT writes, and how authoritative and current they are.",
    },
    {
      q: "Does ChatGPT use Google or Bing?",
      a: "OpenAI names Microsoft and Shopify as search providers, alongside partner content. Independent analysis points to a blended system that also includes OpenAI's own crawler and index, so being indexed by Bing and crawlable by `OAI-SearchBot` covers both paths.",
    },
    {
      q: "Can I appear in ChatGPT search without letting OpenAI train on my content?",
      a: "Yes. Allow `OAI-SearchBot` and disallow `GPTBot`. OpenAI treats them as independent settings, and changes apply within about 24 hours.",
    },
    {
      q: "Does ChatGPT read JavaScript-heavy sites?",
      a: "OpenAI doesn't document JavaScript rendering, and the only direct test found its crawler downloading scripts without running them. Server-render the content you want cited.",
    },
    {
      q: "How do I track traffic from ChatGPT?",
      a: "ChatGPT adds `utm_source=chatgpt.com` to its links, and GA4's AI Assistant channel has grouped that traffic automatically since May 2026. Back it up with a custom channel on the `chatgpt.com` source and check server logs for `ChatGPT-User` hits.",
    },
    {
      q: "Why did my Reddit strategy stop working in ChatGPT?",
      a: "In August 2026 ChatGPT shifted toward `site:` searches of official sources, and Reddit's share of its citations fell about 86% in the weeks that followed. Your own domain's pages now carry more weight.",
    },
    {
      q: "Can I pay to be recommended by ChatGPT?",
      a: "You can buy labeled ads, self-serve since May 2026, but OpenAI says ads don't influence answers and shopping results aren't ads. Organic citations can't be bought.",
    },
    {
      q: "Do I need llms.txt for ChatGPT?",
      a: "No. OpenAI has never said ChatGPT uses it, and a 129,000-domain study found a negligible effect. It does no harm but shouldn't be a priority.",
    },
  ],

  sources: [
    {
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
    {
      title: "Publishers and developers FAQ",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/12627856-publishers-and-developers-faq",
    },
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      title: "Introducing ChatGPT search",
      publisher: "OpenAI",
      href: "https://openai.com/index/introducing-chatgpt-search/",
    },
    {
      title: "Shopping with ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search",
    },
    {
      title: "Powering product discovery in ChatGPT",
      publisher: "OpenAI",
      href: "https://openai.com/index/powering-product-discovery-in-chatgpt/",
    },
    {
      title: "Testing ads in ChatGPT",
      publisher: "OpenAI",
      href: "https://openai.com/index/testing-ads-in-chatgpt/",
    },
    {
      title: "Accelerating the next phase of AI",
      publisher: "OpenAI",
      href: "https://openai.com/index/accelerating-the-next-phase-ai/",
    },
    {
      title: "ChatGPT agent allowlisting (Web Bot Auth)",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/11845367-chatgpt-agent-allowlisting",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
    {
      title: "ChatGPT built its own search index",
      publisher: "Peec AI",
      href: "https://peec.ai/blog/chatgpt-built-its-own-search-index",
    },
    {
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "Why ChatGPT cites the pages it does",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
    },
    {
      title: "Do AI assistants prefer to cite fresh content?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
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
      title: "ChatGPT referrals and branded links",
      publisher: "Profound",
      href: "https://www.tryprofound.com/blog/chatgpt-referrals-branded-links",
    },
    {
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      title: "AI Performance in Bing Webmaster Tools",
      publisher: "Microsoft Bing",
      href: "https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview",
    },
    {
      title: "Content Independence Day: AI crawl options",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/content-independence-day-ai-options/",
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
  ],
};
