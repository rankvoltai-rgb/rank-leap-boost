import type { EngineGuide } from "../types";

/* Facts verified 26 October 2026. Manus is an agent, not an index, so the
   guide is built around a task's path through a page — search, open, read,
   extract, cite — rather than a crawler-and-ranking skeleton. */
export const manus: EngineGuide = {
  slug: "manus",
  metaTitle: "Manus SEO: Get Your Pages Opened, Read and Cited by the Manus Agent",
  metaDescription:
    "How the Manus agent searches, opens and cites pages: the Manus-User agent, Web Bot Auth, Cloudflare's Agent defaults, extraction, Wide Research and the missing referrer.",
  keywords: [
    "Manus SEO",
    "Manus AI agent",
    "Manus-User user agent",
    "optimize website for AI agents",
    "Manus Wide Research",
    "Manus cloud browser",
  ],
  headline: {
    lead: "Manus SEO:",
    accent: "be the page its agent opens, reads and cites",
  },
  subhead:
    "Manus doesn't answer from an index. Each task gets its own cloud computer, whose browser searches, opens your page, extracts what it can and lists what it used in a report, deck or spreadsheet. Here's how that agent identifies itself, what turns it away, what it can't read, and how to see it in your logs.",

  shortAnswer:
    "To be used and cited by Manus, let its agent in and make your facts extractable. Manus's cloud browser identifies as **Manus-User**, signs its requests with Web Bot Auth and runs from data-center IPs. Manus doesn't document robots.txt support, so your CDN and bot rules decide access. It renders JavaScript, but its page extraction drops images and links, so put prices, limits and answers in visible text on stable URLs. The pages that supply a fact to the finished report are the ones it lists as sources.",

  takeaways: [
    "Manus is an agent, not an index: a task plans, runs short keyword searches, then opens results in a browser inside its own cloud computer. Search snippets alone don't count as sources.",
    "Its cloud browser sends a Linux Chrome user agent ending in `Manus-User/1.0` and signs requests with Web Bot Auth. Cloudflare Radar lists it as a verified **Agent** with intermediary access.",
    "Manus doesn't document robots.txt handling. Since 15 September 2026, Cloudflare blocks Agent traffic by default on ad-showing pages of newly onboarded domains, so check your edge, not just robots.txt.",
    "Its extractor returns page text as Markdown and omits images and links. A price in a graphic or a spec in a hover state may never reach the report.",
    "Wide Research runs one full Manus instance per item, in parallel. Browser Operator and Manus 2.0's computer use act inside the user's own browser, where you can't tell them from the user.",
    'Links in Manus task views open with `rel="noopener noreferrer"`, so clicks land in Direct. Count `Manus-User` in your server logs instead.',
  ],

  facts: [
    { label: "Reads your page in", value: "Its own cloud browser" },
    { label: "User-agent token", value: "Manus-User", mono: true },
    { label: "Proves identity with", value: "Web Bot Auth" },
    { label: "Referrer on task clicks", value: "None (noreferrer)" },
  ],

  preview: {
    prompt:
      "Shortlist five bookkeeping tools for a 12-person design agency, with per-seat pricing, in a spreadsheet",
    status: "Manus is using Browser",
    answer:
      "**Coinwren** leads the shortlist: invoicing, multi-currency and payroll all sit on its $14-per-seat Studio plan, while the other four charge extra for payroll.",
    sources: [
      { domain: "coinwren.com", title: "Coinwren pricing: plans for agencies" },
      {
        domain: "opsledgerreview.com",
        title: "Bookkeeping software for agencies, compared (2026)",
      },
      { domain: "pennymoth.com", title: "Pennymoth pricing" },
      { domain: "agencyopsweekly.com", title: "What we moved our books to this year" },
    ],
  },

  profile: {
    retrieval:
      "An undisclosed search tool, then live visits in its own cloud browser; data APIs like Similarweb too",
    searchCrawler: "Manus-User (cloud browser on live tasks; there's no index crawler)",
    trainingCrawler: "None documented",
    rendersJs: "Yes — a full browser runs your scripts",
    referrer: "None from task views (noreferrer); *.manus.space when Manus-built sites link out",
    citationStyle:
      "Sources listed in the deliverable (report, deck or sheet), usually a numbered list",
    biggestLever:
      "Let the signed agent past your edge, then put facts in visible text on stable URLs",
  },

  sections: [
    {
      id: "inside-a-manus-task",
      title: "Inside a Manus task: six moments your page wins or loses",
      blocks: [
        {
          kind: "p",
          text: "Manus works like a colleague with its own computer, and that's close to literal. Every task gets [a fully isolated cloud virtual machine](https://manus.im/blog/manus-sandbox) with networking, a file system and a browser, and the output is a file — a report, a slide deck, a spreadsheet, a website — rather than a chat reply. A typical task takes [around 50 tool calls](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus). Your page is either one of the sources behind that file or it isn't.",
        },
        {
          kind: "p",
          text: "That changes what you optimize. With a chat engine the question is whether a crawler can read your HTML. With Manus it's whether an agent can finish a sub-task on your page: find the price, read the limits, copy them into a table and move on. Here is a task's path, and what you control at each step.",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "It writes a plan, then keeps rewriting it",
              body: 'Manus breaks the request into steps and keeps a `todo.md` up to date, "reciting its objectives into the end of the context," as co-founder Yichao "Peak" Ji put it in [July 2025](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus). A shortlist request becomes sub-tasks: find candidates, then price, limits and integrations for each.',
              lever:
                "Answer the sub-questions a plan will contain — pricing, limits, integrations, alternatives — each on a page that stands on its own.",
            },
            {
              title: "It searches in short keyword queries",
              body: 'The search tool in Manus\'s March 2025 system prompt took queries "in Google search style, using 3-5 keywords," with an optional date range from past hour to past year, and told the agent to "search multiple attributes of single entity separately." Manus has never named the provider behind that tool.',
              lever:
                "Title pages for the attribute queries a plan will run (`Coinwren pricing`, `Coinwren payroll limits`), and show a visible date so date-filtered searches keep you.",
            },
            {
              title: "It opens pages instead of trusting snippets",
              body: 'The same prompt ruled that "snippets in search results are not valid sources; must access original pages via browser," and told Manus to open several results "for comprehensive information or cross-validation."',
              lever:
                "Ranking isn't enough. The page has to load for the agent: a blocked or challenged page can't become the source.",
            },
            {
              title: "It reads through a browser on data-center IPs",
              body: 'Manus\'s [cloud browser](https://manus.im/docs/features/cloud-browser) "operates from data center IP addresses, not residential IPs," so some sites "may trigger additional verification," and a CAPTCHA pauses the task until the user takes over. [E2B](https://e2b.dev/customers/how-manus-uses-e2b-to-provide-agents-with-virtual-computers), whose microVMs Manus ran on in 2025, describes those agents visiting URLs in Chromium.',
              lever:
                "Don't challenge the verified agent on the pages you want used. Every human check is a point where the task can stall or skip you.",
            },
            {
              title: "It extracts text and drops the rest",
              body: 'Per the 2025 prompt, the browser returned page content "in Markdown format," including "text beyond viewport but omits links and images," while clickable elements were listed only for the visible viewport. Once used, a page can be dropped from context "as long as the URL is preserved," and reopened later.',
              lever:
                "Put the fact in text, near the top, on a URL that shows the same thing when the agent comes back to it.",
            },
            {
              title: "It writes the deliverable and lists its sources",
              body: 'Manus was told to "actively cite original text with sources and provide a reference list with URLs at the end." The table, deck or report is where your reader finally sees your name — or a competitor\'s.',
              lever:
                "Give every page a `<title>` that names exactly what it is. It's the likeliest text for a reference line.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "~50",
              label: "tool calls in a typical Manus task",
              source: {
                name: "Manus, Jul 2025",
                href: "https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus",
              },
            },
            {
              value: "250",
              label: "items Wide Research has been tested on, with one agent per item",
              source: {
                name: "Manus docs, 2026",
                href: "https://manus.im/docs/features/wide-research",
              },
            },
            {
              value: "9%",
              label: "of the top sites Known Agents tracks have robots.txt rules for Manus-User",
              source: {
                name: "Known Agents, Oct 2026",
                href: "https://knownagents.com/agents/manus-user",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "The 2025 prompt is a snapshot, not a spec",
          text: 'Manus\'s system prompt was [extracted and published](https://github.com/jujumilk3/leaked-system-prompts/blob/main/manus_20250310.md) in March 2025, and Ji [confirmed the architecture](https://the-decoder.com/chinese-ai-agent-manus-uses-claude-sonnet-and-open-source-technology/) at the time. Manus has since "rebuilt our agent framework four times" (July 2025) and shipped [Manus 2.0](https://manus.im/blog/introducing-manus-2-0) on a new harness, Cascade, in September 2026. Treat the quoted rules as direction; the docs cited here are current.',
        },
      ],
    },
    {
      id: "five-routes-to-your-site",
      title: "Five routes from Manus to your site, and the one you can identify",
      blocks: [
        {
          kind: "p",
          text: "Manus reaches the web in more than one way, and only the cloud browser announces itself. The other routes arrive as your visitor, or never touch your site at all.",
        },
        {
          kind: "table",
          head: ["Route", "What runs", "What you see", "What you control"],
          rows: [
            [
              "**Cloud browser** (default)",
              "A browser in the task's cloud computer, on data-center IPs",
              "A Chrome user agent ending in `Manus-User/1.0`, plus a Web Bot Auth signature",
              "WAF, bot and rate-limit rules",
            ],
            [
              "**Wide Research**",
              "Parallel sub-agents, each a full Manus instance with its own connection",
              "The same agent, many sessions within minutes",
              "Rate limits, and whether verified agents are exempt",
            ],
            [
              "**Browser Operator**",
              "An extension in the user's Chrome or Edge; [Preferred Browser](https://manus.im/blog/manus-preferred-browser) (May 2026) pins one always-on Chrome",
              "The user's own browser, IP address and cookies",
              "Nothing that wouldn't also block the user",
            ],
            [
              "**Computer use** (Manus 2.0)",
              "Manus in a visible workspace on the user's computer, using the apps and browser they approve",
              "The user's own machine",
              "Nothing distinct",
            ],
            [
              "**Data sources**",
              "Built-in data APIs: [Similarweb](https://manus.im/blog/manus-similarweb-upgrade) traffic, keywords, referrals and top pages for Pro users, plus company and financial data",
              "Nothing: it never visits your site",
              "Your profile and numbers on those providers",
            ],
          ],
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "Manus-User",
              role: "user",
              purpose:
                "Manus's cloud browser, opening and operating pages during a user's task. Observed as a Linux Chrome user agent with `Manus-User/1.0` appended; requests are signed with Web Bot Auth keys published on `api.manus.im`.",
              robots: "no",
              robotsNote:
                "Manus doesn't document it; Known Agents lists it as not expected to follow robots.txt.",
              advice: "allow",
            },
          ],
        },
        {
          kind: "p",
          text: "Manus hasn't published its user agent string, and the help page Cloudflare links to for the bot (`manus.im/help/Manus-user`) returned a 404 on 26 October 2026. [Known Agents](https://knownagents.com/agents/manus-user) records it like this; the Chrome version moves with each browser release, so match on the token, never the whole string:",
        },
        {
          kind: "code",
          lang: "text",
          code: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36; Manus-User/1.0",
        },
        {
          kind: "p",
          text: "Because any client can send that string, identity comes from the signature. [Cloudflare Radar](https://radar.cloudflare.com/bots/directory/manus-bot) lists **Manus Bot** as verified, in the **Agent** category, with **intermediary** access — Cloudflare's label for a bot that many end users drive — and links its key directory. [Fingerprint](https://fingerprint.com/blog/web-bot-auth-guide/) (March 2026) names Manus among operators \"signing their requests today.\" Signed requests carry `Signature`, `Signature-Input` and `Signature-Agent` headers, checked against Manus's public key:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Manus\'s Web Bot Auth key directory, as served on 26 October 2026\ncurl -s https://api.manus.im/.well-known/http-message-signatures-directory\n{"keys":[{"crv":"Ed25519","kty":"OKP","x":"KcGM6sqzNes25V0hn96KsrIwL6pbut1KQMGmyFwpboM"}]}\n\n# The response is itself signed (tag="http-message-signatures-directory")\n# and cached for a day (max-age=86400). Keys rotate: verify against\n# the live directory, never a hard-coded key.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Intermediary means many hands",
          text: "Cloudflare's [bot categories](https://developers.cloudflare.com/bots/reference/verified-bot-categories/) note that with an intermediary you may trust the operator without trusting every end user behind it. Allowing `Manus-User` means allowing whatever Manus's users ask it to do, so keep account, checkout and admin paths behind a login, as you would for people.",
        },
      ],
    },
    {
      id: "your-edge-decides",
      title: "Robots.txt states a policy; your edge enforces it",
      blocks: [
        {
          kind: "p",
          text: "[robots.txt](/glossary/robots-txt) still has a job with Manus: putting your policy in writing. It just isn't a lock. Manus doesn't say whether its agent reads the file, and [Known Agents](https://knownagents.com/agents/manus-user) lists `Manus-User` as not expected to follow it. If you want Manus in, say so, and keep private paths out:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Manus's cloud browser. Manus doesn't document robots.txt support:\n# this states your policy; your WAF is what enforces it.\nUser-agent: Manus-User\nAllow: /\nDisallow: /account/\nDisallow: /checkout/",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Cloudflare's 15 September defaults block Agents on ad pages",
          text: "Cloudflare's [new AI defaults](https://blog.cloudflare.com/content-independence-day-ai-options/) apply to domains onboarded from 15 September 2026: on pages that show ads, Training and Agent bots are blocked by default while Search stays allowed. Agent means automated behavior \"acting, usually in real time, on a person's behalf\" — the category Radar gives Manus. If your zone is newer than that, or someone has changed its AI settings, check what Agent is set to. Search, Agent and Training are [presets on every plan](https://developers.cloudflare.com/bots/reference/verified-bot-categories/).",
        },
        {
          kind: "p",
          text: "Three more edge settings decide whether the agent finishes its sub-task on your page:",
        },
        {
          kind: "list",
          items: [
            "**Challenges.** A CAPTCHA, JavaScript challenge or interstitial pauses the task until a person takes over. Exempt [verified bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/) from challenges on the pages you want used; since 1 July 2026 Cloudflare counts signed agents like Manus as verified.",
            "**Rate limits.** Wide Research can open many sessions in minutes. Limits keyed on bursts from one network turn most of them away; key them on identity instead, or exempt verified agents.",
            "**Data-center IP rules.** Blocking cloud hosting networks blocks Manus's cloud browser outright, whatever its signature says.",
          ],
        },
        {
          kind: "p",
          text: "The quickest self-test is whether your edge turns the user agent away. It can't reproduce Manus's IP reputation or its signature, so a pass is necessary, not sufficient:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Does a user-agent or bot rule turn Manus away?\ncurl -s -o /dev/null -w "%{http_code}\\n" \\\n  -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36; Manus-User/1.0" \\\n  https://yoursite.com/pricing\n\n# 403, 429 or 503: your edge blocks agents by user agent.\n# 200 doesn\'t prove the real agent gets in: IP and signature\n# checks only apply to real Manus traffic.',
        },
      ],
    },
    {
      id: "pages-that-survive-extraction",
      title: "Pages that survive extraction",
      blocks: [
        {
          kind: "p",
          text: "Manus hasn't published guidance for site owners. The closest spec is Google's [Build agent-friendly websites](https://web.dev/articles/ai-agent-site-ux) (updated 1 April 2026), which notes that agents read sites through screenshots, raw HTML and the accessibility tree. Its rules line up with what Manus's extractor is known to keep and drop.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Reachable without a challenge",
              status: "required",
              note: "The cloud browser runs from data-center IPs. CAPTCHAs, interstitials, 403s and 429s stop the task until the user takes over, and the user may simply move on to the next result.",
            },
            {
              label: "Facts in visible text",
              status: "helps",
              note: 'Extraction "omits links and images." Prices in a graphic, specs only in a PDF, or copy drawn on a canvas may never reach the report.',
            },
            {
              label: "Native links, buttons and labels",
              status: "helps",
              note: 'Google: "use `<button>` and `<a>` tags over modified `<div>` and `<span>` elements," and link each `<label>` to its input with `for`. Manus\'s 2025 prompt admits "not all interactive elements may be identified."',
            },
            {
              label: "No overlays in front of content",
              status: "helps",
              note: 'Google: "Avoid transparent overlays that hide interactive elements." Cookie walls, newsletter modals and install banners also cost the agent steps.',
            },
            {
              label: "Stable layout and real-sized targets",
              status: "helps",
              note: "Screenshot-reading agents are confused by shifting layouts, and Google says controls an action needs should be visible and larger than 8 square pixels.",
            },
            {
              label: "Stable, specific URLs",
              status: "helps",
              note: "Manus keeps a page's URL when it drops the content, then reopens it. A plan, filter or tab with its own URL can be revisited and cited; a state reached only by clicks can't.",
            },
            {
              label: "Server-side rendering",
              status: "helps",
              note: "Not required for Manus, whose browser runs JavaScript, but it makes the first extraction complete — and many other AI fetchers don't render at all. See [server-side rendering](/glossary/server-side-rendering).",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "Manus hasn't said whether it reads JSON-LD. Extraction works on visible content, so repeat every fact from your [schema markup](/glossary/schema-markup) in the copy.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "Manus publishes an [llms.txt](/glossary/llms-txt) for its own docs, but hasn't said its agent reads other sites' files.",
            },
            {
              label: "robots.txt as access control",
              status: "no-effect",
              note: "Not documented as honored. Use the file to state policy; enforce policy at the edge.",
            },
          ],
        },
        {
          kind: "h3",
          text: "What an agent needs from a pricing page",
        },
        {
          kind: "list",
          items: [
            "Every plan's **name, price, currency and billing period** as text, in a real HTML `<table>`.",
            "What each plan includes and its **limits** — seats, usage caps, overage rates — on the same page, not behind tabs that leave the URL unchanged.",
            'A visible **"last updated" date**, because the same comparison gets rerun next month.',
            "Links to docs, changelog and comparison pages as plain `<a href>` elements.",
            "No \"contact sales\" wall in front of numbers you're willing to publish. An agent can't take the call.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Write for the visible page, never hidden instructions",
          text: 'Manus\'s own [Browser Operator page](https://manus.im/my-browser) warns users that "malicious actors can hide commands in emails or documents to trick AI." Text hidden from people but aimed at agents is exactly what prompt-injection defenses look for. Put what you want an agent to know where a person can read it too.',
        },
      ],
    },
    {
      id: "from-opened-to-cited",
      title: "From opened to cited: what earns a line in the deliverable",
      blocks: [
        {
          kind: "p",
          text: "There's no public study of which domains Manus cites as of October 2026, so citation statistics from ChatGPT or Perplexity don't transfer. What is known comes from Manus's docs, its 2025 system prompt and how its task views present work. And being opened isn't being cited: Manus reads more pages than it lists, and the one that supplies a fact the deliverable actually uses is the one that earns the reference.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Original pages, not snippets",
              body: "The 2025 prompt made opening the page a requirement for using it. A page that blocks or stalls the browser can't be the source, however well it ranks.",
              evidence: "observed",
            },
            {
              title: "Facts that survive cross-checking",
              body: "Manus was told to open several results for cross-validation. When your site, review sites and profiles disagree on a price, the agent has to pick, and it may not pick you.",
              evidence: "observed",
            },
            {
              title: "Data providers before the open web",
              body: 'Manus has built-in [data sources](https://manus.im/docs/integrations/data-sources) for company, financial and social data, and Pro users get Similarweb traffic, keywords and top pages without their own account. The 2025 prompt ranked "datasource API > web search > model\'s internal knowledge."',
              evidence: "official",
            },
            {
              title: "Text the extractor can see",
              body: "Extracted page text leaves out images and links, and only viewport elements are listed for interaction. Facts in visible copy near the top travel best.",
              evidence: "observed",
            },
            {
              title: "Pages that load for a data-center browser",
              body: "Manus documents that its cloud browser's IPs can trigger verification. Sites that challenge them lose the visit unless the user steps in.",
              evidence: "official",
            },
            {
              title: "Your presence inside paid tools",
              body: "Browser Operator reads Crunchbase, PitchBook, SimilarWeb, the Financial Times, Semrush and Ahrefs through the user's own logins. Your profiles there are part of what the agent sees.",
              evidence: "official",
            },
            {
              title: "One complete page per item",
              body: "Wide Research gives each product, company or location its own agent. A dedicated page that covers the item completely is where that agent can finish.",
              evidence: "our-read",
            },
            {
              title: "Titles that say what the page is",
              body: "References are listed by title and URL. A precise `<title>` is the likeliest text for the line a reader sees.",
              evidence: "our-read",
            },
            {
              title: "Visible dates",
              body: "Searches can be filtered to the past day, week, month or year, and recurring tasks rerun the same comparison. A dated page tells the agent its facts are current.",
              evidence: "our-read",
            },
          ],
        },
      ],
    },
    {
      id: "wide-research-and-automations",
      title: "Wide Research, Automations and Browser Operator",
      blocks: [
        {
          kind: "h3",
          text: "Wide Research: one agent per item",
        },
        {
          kind: "p",
          text: '[Wide Research](https://manus.im/docs/features/wide-research) handles tasks with many similar items — "analyzing 100 products, researching 50 companies" — by deploying "hundreds of independent agents that work in parallel." [Each sub-agent](https://manus.im/blog/manus-wide-research-solve-context-problem) is a "full-featured Manus instance" with search, browsing and "an independent internet connection," and the main agent assembles their results into a table, report or dataset. Manus says it has been tested up to **250 items** and takes "minutes for 50-100 items."',
        },
        {
          kind: "p",
          text: "You can watch the fan-out on a [public Manus replay](https://manus.im/share/GajPnKzrpM4pEbpcrKDmx0): the plan lists one row per person researched, ticks off `20 / 20`, and only then compiles the chart and the files.",
        },
        {
          kind: "list",
          items: [
            "**Expect bursts.** A comparison that includes you can send many sessions within minutes. Rate limits keyed on bursts can turn most of them away.",
            "**Publish one page per entity.** Each sub-agent researches one item; a complete page for each product, plan or location gives it one place to finish.",
            "**Keep facts table-ready.** Results are merged into tables and decks. Consistent plan names, units and currencies across your pages survive that merge.",
          ],
        },
        {
          kind: "h3",
          text: "Automations: agents that come back",
        },
        {
          kind: "p",
          text: "Manus [Automations](https://manus.im/docs/automations) run a task on a schedule or when an event fires. Trigger sources include Gmail, Notion, GitHub, Shopify, **RSS** and webhooks, and scheduled tasks, rebuilt as [Scheduled Tasks 2.0](https://manus.im/blog/manus-schedules) in May 2026, now live inside Automations. A competitor-monitoring task can come back to your pricing page every Monday, or start the moment your feed publishes.",
        },
        {
          kind: "list",
          items: [
            "Keep a valid RSS or Atom feed for your blog and changelog: RSS is a documented trigger.",
            "Date your pricing page and changelog so a returning agent can tell what changed.",
            "Read weekly spikes on the same URLs in your logs as a schedule, not a crawl.",
          ],
        },
        {
          kind: "h3",
          text: "Browser Operator and computer use: Manus as your visitor",
        },
        {
          kind: "p",
          text: "[Browser Operator](https://manus.im/docs/integrations/manus-browser-operator) is a Chrome and Edge extension that runs Manus in a dedicated tab of the user's own browser, \"complete with your existing logins, sessions, and local IP address\" — its docs still describe a beta for Pro, Plus and Team users. Manus 2.0 adds computer use, where Manus works in a visible workspace on the user's computer with the files, browser and apps they approve.",
        },
        {
          kind: "p",
          text: "For you, that traffic is your visitor. It carries their cookies, IP address and browser, so you can't measure it separately or block it without blocking them. It also reaches logged-in areas: if customers ask Manus to pull data from your app or gated docs, it works there with their permissions.",
        },
      ],
    },
    {
      id: "who-runs-manus",
      title: "Who runs Manus in October 2026",
      blocks: [
        {
          kind: "p",
          text: "Manus is an independent company again. Its short spell inside Meta is the most-repeated story about it, and the most often garbled, so here is the sequence as the primary sources tell it:",
        },
        {
          kind: "table",
          head: ["Date", "What happened"],
          rows: [
            [
              "29 Dec 2025",
              "Manus [announces it is joining Meta](https://manus.im/blog/manus-joins-meta-for-next-era-of-innovation) and says it will keep operating from Singapore. The price was reported at about $2 billion.",
            ],
            [
              "27 Apr 2026",
              "China's National Development and Reform Commission [prohibits the deal](https://techcrunch.com/2026/04/27/china-vetoes-metas-2b-manus-deal-after-months-long-probe/) and requires the parties to withdraw it.",
            ],
            [
              "Jun 2026",
              "Meta [begins unwinding](https://techcrunch.com/2026/06/13/meta-reportedly-moves-to-unwind-2b-manus-deal-after-beijings-demand/) the acquisition and cuts Manus off from its internal systems.",
            ],
            [
              "11 Aug 2026",
              "Manus [tells users](https://manus.im/blog/a-note-to-our-users) it will operate independently again. Data some users generated after 29 December 2025 is deleted on 23–24 August (SGT), with a backup and restore window.",
            ],
            [
              "1 Sep 2026",
              "Manus [formally resumes independent operations](https://manus.im/blog/manus-resumes-independent-operations); its founding team continues to lead it.",
            ],
            [
              "28 Sep 2026",
              "[Manus 2.0](https://manus.im/blog/introducing-manus-2-0) ships: a new agent harness (Cascade), Cloud Computer, event-triggered automations and computer use on the desktop.",
            ],
            [
              "8 Oct 2026",
              "Parent company Butterfly Effect [raises more than $500 million](https://techcrunch.com/2026/10/08/chinas-manus-raises-over-500m-in-first-funding-round-since-split-with-meta/), led by Boyu Capital and IDG Capital. No valuation was disclosed.",
            ],
          ],
        },
        {
          kind: "p",
          text: "For site owners the point is continuity. The agent's identity — the `Manus-User` token and the signing keys on `api.manus.im` — is Manus's own and didn't change through any of this, and Manus says its data is stored in the US and Singapore.",
        },
      ],
    },
    {
      id: "measuring-manus",
      title: "Measuring Manus: logs, a custom channel and a task panel",
      blocks: [
        {
          kind: "p",
          text: 'Your server logs are the reliable view. `Manus-User` hits show which pages tasks open, and weekly spikes on the same URLs suggest automations. Known Agents warns that a user-agent match "is not proof," since any bot can claim the name, so for decisions rely on your CDN\'s verified-bot flag, which checks the signature.',
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Pages Manus's cloud browser opened, most-visited first\ngrep \"Manus-User\" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20\n\n# Hits per day: the same pages every week suggests a scheduled task\ngrep \"Manus-User\" access.log | awk '{print substr($4,2,11)}' | sort | uniq -c",
        },
        {
          kind: "p",
          text: 'Analytics sees little. On Manus\'s task pages, links open in a new tab with `rel="noopener noreferrer"` (as checked on a [public replay](https://manus.im/share/3zvs5smekSmn4lS14n9QNg) on 26 October 2026), so the browser sends no referrer and those visits land in Direct. Sites Manus builds are published on `manus.space` subdomains, and clicks from them normally pass that origin. Google\'s [AI Assistant channel](https://support.google.com/analytics/answer/9756891) covers "sources like ChatGPT, Gemini, Deepseek, Copilot, or Grok" — not Manus — so add a custom channel:',
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source: Manus-built sites and Manus pages linking to you\n(^|\\.)manus\\.(space|computer|im)$\n\n# Clicks from inside a Manus task carry no referrer: they land in Direct",
        },
        {
          kind: "p",
          text: "The agent's own visits can also inflate analytics. The cloud browser runs JavaScript, so your analytics tags may fire on `Manus-User` visits and count them as sessions. Compare log hits with sessions on your most-visited pages before trusting engagement numbers there.",
        },
        {
          kind: "p",
          text: "Citations need a panel of your own. Run a fixed set of buyer tasks in Manus each month — the comparisons your customers would delegate — and record whether you appear among the sources and which of your pages it used. Tasks cost credits, so keep the set small and identical from month to month. See [AI referral traffic](/glossary/ai-referral-traffic) for the wider picture.",
        },
      ],
    },
    {
      id: "manus-myths",
      title: "Five Manus claims to stop repeating",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Manus is part of Meta.",
              reality:
                "Meta announced the deal in December 2025, China prohibited it on 27 April 2026, and Manus resumed independent operations on 1 September 2026.",
            },
            {
              myth: "A robots.txt disallow keeps Manus out.",
              reality:
                "Manus doesn't document robots.txt support, and Browser Operator is the user's own browser. Block at the edge if you must — or, better, let the verified agent in.",
            },
            {
              myth: "Agents can't run JavaScript, so SSR is mandatory for Manus.",
              reality:
                "Manus drives a full browser, so client-side rendering doesn't hide you from it. Server rendering still matters for [Claude](/ai-seo/claude), [ChatGPT](/ai-seo/chatgpt) and [Perplexity](/ai-seo/perplexity).",
            },
            {
              myth: "Manus clicks show up as manus.im referrals.",
              reality:
                'Links in Manus task views open with `rel="noopener noreferrer"`, so they arrive with no referrer. Only pages Manus hosts, like `*.manus.space` sites, normally pass one.',
            },
            {
              myth: "Hidden text aimed at AI agents helps them choose you.",
              reality:
                "It looks exactly like prompt injection, which Manus warns its own users about. Agents read the visible page; write for that.",
            },
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "verified-agent",
      title: "Let verified Manus traffic through your WAF",
      detail:
        "Manus signs with Web Bot Auth and Cloudflare lists it as verified. Exempt verified bots from challenges on the pages you want used.",
      impact: "high",
    },
    {
      id: "agent-preset",
      title: "Check what your CDN does with Agent traffic",
      detail:
        "On Cloudflare, domains onboarded from 15 September 2026 block Agent bots on pages with ads by default. Decide deliberately.",
      impact: "high",
    },
    {
      id: "no-captcha",
      title: "Don't CAPTCHA data-center browsers on citable pages",
      detail:
        "Pricing, docs, specs and comparison pages should load for a cloud browser without a human check.",
      impact: "high",
    },
    {
      id: "facts-in-text",
      title: "Put prices, specs and answers in visible text",
      detail:
        "Extraction omits images and links. Use real HTML tables for plans and limits, not graphics or PDF-only downloads.",
      impact: "high",
    },
    {
      id: "no-overlays",
      title: "Clear overlays from in front of content",
      detail:
        "Cookie walls, modals and install banners cost the agent steps; transparent overlays can hide the controls it needs.",
      impact: "high",
    },
    {
      id: "semantic-controls",
      title: "Use real links, buttons and labeled fields",
      detail:
        "`<a href>`, `<button>` and `<label for>` instead of clickable `<div>`s, per Google's agent-friendly guidance.",
      impact: "medium",
    },
    {
      id: "stable-urls",
      title: "Give every entity and view a stable URL",
      detail: "Plans, filters and tabs with their own URLs can be reopened and cited.",
      impact: "medium",
    },
    {
      id: "per-item-pages",
      title: "Publish one complete page per product, plan or location",
      detail: "Wide Research assigns one agent per item; give each a single page to finish on.",
      impact: "medium",
    },
    {
      id: "consistent-facts",
      title: "Keep facts identical across your site and profiles",
      detail:
        "Manus cross-checks sources and reads data providers like Similarweb. Align prices and specs everywhere they appear.",
      impact: "medium",
    },
    {
      id: "rate-limits",
      title: "Rate-limit by identity, not by burst",
      detail:
        "Wide Research opens many sessions at once. Exempt verified agents rather than blocking the burst.",
      impact: "medium",
    },
    {
      id: "dates-and-feeds",
      title: "Date your pricing and changelog, and keep a valid feed",
      detail:
        "Automations rerun comparisons and can trigger on RSS. A visible date shows what changed.",
      impact: "medium",
    },
    {
      id: "logs",
      title: "Track Manus-User in your server logs",
      detail:
        "Weekly: which pages it opens, how often, and whether requests are verified. Analytics won't show you this.",
      impact: "medium",
    },
    {
      id: "task-panel",
      title: "Run a small Manus task panel monthly",
      detail:
        "A fixed set of buyer tasks; record whether you're among the sources and which page it used.",
      impact: "medium",
    },
    {
      id: "titles",
      title: "Write page titles that say what the page is",
      detail: "They're the likeliest text for the line in Manus's source list.",
      impact: "low",
    },
    {
      id: "robots-policy",
      title: "State a Manus-User policy in robots.txt",
      detail:
        "It communicates intent, not enforcement. Keep private paths disallowed and enforce at the edge.",
      impact: "low",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Manus?",
      a: "Make sure its verified agent can load your pages without a challenge, then put the facts a task needs — prices, limits, specs, dates — in visible text on stable URLs. Manus cites the pages it opened and used, so the page that supplies a fact to the deliverable earns the reference.",
    },
    {
      q: "What user agent does Manus use?",
      a: "Its cloud browser sends a Linux Chrome user agent with `Manus-User/1.0` appended. It also signs requests with Web Bot Auth, with its public key published at `api.manus.im`. Browser Operator and computer use run in the user's own browser, with the user's own user agent.",
    },
    {
      q: "Does Manus respect robots.txt?",
      a: "Manus doesn't document it, and Known Agents lists `Manus-User` as not expected to follow robots.txt. Use the file to state your policy, and enforce access with WAF or bot rules.",
    },
    {
      q: "Can Manus read JavaScript-rendered pages?",
      a: "Yes. Manus drives a full browser in a cloud computer, so client-side content renders. What stops it is a CAPTCHA, an overlay, or a fact that exists only in an image, since its extraction leaves images out.",
    },
    {
      q: "What search engine does Manus use?",
      a: "Manus doesn't say. Its search tool takes short keyword queries with optional date filters, and then Manus opens the results in its own browser rather than relying on snippets. Built-in data sources such as Similarweb sit alongside it.",
    },
    {
      q: "Should I block Manus?",
      a: "Only if you don't want agents using your pages for people's tasks. Blocking takes a WAF rule, because robots.txt support isn't documented, and it can't touch Browser Operator, which runs in the user's own browser. If you sell to people who delegate research, let the verified agent in.",
    },
    {
      q: "How does Manus traffic show up in Google Analytics?",
      a: "Mostly as Direct. Links clicked in a Manus task view open with `rel=\"noopener noreferrer\"`, so no referrer is sent. Sites Manus builds on `*.manus.space` normally pass their origin. GA4's AI Assistant channel doesn't include Manus, so use a custom channel and your server logs.",
    },
    {
      q: "Who owns Manus now?",
      a: "Manus is independent. Meta announced an acquisition in December 2025, China's NDRC prohibited it on 27 April 2026, and Manus resumed independent operations on 1 September 2026 under its founding team. Its parent, Butterfly Effect, raised more than $500 million in October 2026.",
    },
    {
      q: "What is Wide Research, and why does it matter for my site?",
      a: "It's Manus's mode for large comparisons: parallel sub-agents, one full Manus instance per item, tested up to 250 items. For you it means bursts of agent visits and a premium on one complete page for each product or plan.",
    },
    {
      q: "What changed for site owners with Manus 2.0?",
      a: "Manus 2.0, released on 28 September 2026, added event-triggered automations and computer use on the user's own desktop. The cloud browser and its `Manus-User` identity carry on, but more Manus work now runs in places that look like ordinary visitors.",
    },
  ],

  sources: [
    {
      title: "Cloud browser",
      publisher: "Manus Documentation",
      href: "https://manus.im/docs/features/cloud-browser",
    },
    {
      title: "Manus Browser Operator",
      publisher: "Manus Documentation",
      href: "https://manus.im/docs/integrations/manus-browser-operator",
    },
    {
      title: "Wide Research",
      publisher: "Manus Documentation",
      href: "https://manus.im/docs/features/wide-research",
    },
    {
      title: "Automations",
      publisher: "Manus Documentation",
      href: "https://manus.im/docs/automations",
    },
    {
      title: "Data Sources",
      publisher: "Manus Documentation",
      href: "https://manus.im/docs/integrations/data-sources",
    },
    {
      title: "Introducing Manus 2.0",
      publisher: "Manus",
      href: "https://manus.im/blog/introducing-manus-2-0",
    },
    {
      title: "Wide Research: beyond the context window",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-wide-research-solve-context-problem",
    },
    {
      title: "Introducing Preferred Browser",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-preferred-browser",
    },
    {
      title: "Introducing Scheduled Tasks 2.0",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-schedules",
    },
    {
      title: "Manus goes deeper with Similarweb",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-similarweb-upgrade",
    },
    {
      title: "My Browser",
      publisher: "Manus",
      href: "https://manus.im/my-browser",
    },
    {
      title: "Understanding Manus sandbox — your cloud computer",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-sandbox",
    },
    {
      title: "Context engineering for AI agents: lessons from building Manus",
      publisher: "Manus",
      href: "https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus",
    },
    {
      title: "Manus joins Meta for next era of innovation",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-joins-meta-for-next-era-of-innovation",
    },
    {
      title: "A note to our users",
      publisher: "Manus",
      href: "https://manus.im/blog/a-note-to-our-users",
    },
    {
      title: "Manus resumes independent operations",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-resumes-independent-operations",
    },
    {
      title: "Manus Web Bot Auth key directory",
      publisher: "Manus",
      href: "https://api.manus.im/.well-known/http-message-signatures-directory",
    },
    {
      title: "Public task replay: comparing 100 sneaker models (Wide Research)",
      publisher: "Manus",
      href: "https://manus.im/share/3zvs5smekSmn4lS14n9QNg",
    },
    {
      title: "Public task replay: projected AGI timelines (Wide Research, 20 items)",
      publisher: "Manus",
      href: "https://manus.im/share/GajPnKzrpM4pEbpcrKDmx0",
    },
    {
      title: "Manus system prompt (extracted March 2025)",
      publisher: "GitHub (jujumilk3/leaked-system-prompts)",
      href: "https://github.com/jujumilk3/leaked-system-prompts/blob/main/manus_20250310.md",
    },
    {
      title: "Chinese AI agent Manus uses Claude Sonnet and open-source technology",
      publisher: "The Decoder",
      href: "https://the-decoder.com/chinese-ai-agent-manus-uses-claude-sonnet-and-open-source-technology/",
    },
    {
      title: "How Manus uses E2B to provide agents with virtual computers",
      publisher: "E2B",
      href: "https://e2b.dev/customers/how-manus-uses-e2b-to-provide-agents-with-virtual-computers",
    },
    {
      title: "Manus Bot",
      publisher: "Cloudflare Radar",
      href: "https://radar.cloudflare.com/bots/directory/manus-bot",
    },
    {
      title: "Verified bots",
      publisher: "Cloudflare Docs",
      href: "https://developers.cloudflare.com/bots/concepts/bot/verified-bots/",
    },
    {
      title: "Verified bot categories",
      publisher: "Cloudflare Docs",
      href: "https://developers.cloudflare.com/bots/reference/verified-bot-categories/",
    },
    {
      title: "Content Independence Day: new AI options",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/content-independence-day-ai-options/",
    },
    {
      title: "Manus-User user agent",
      publisher: "Known Agents",
      href: "https://knownagents.com/agents/manus-user",
    },
    {
      title: "A guide to Web Bot Auth",
      publisher: "Fingerprint",
      href: "https://fingerprint.com/blog/web-bot-auth-guide/",
    },
    {
      title: "Build agent-friendly websites",
      publisher: "web.dev (Google)",
      href: "https://web.dev/articles/ai-agent-site-ux",
    },
    {
      title: "[GA4] Default channel group",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "China blocks Meta's $2B Manus deal after months-long probe",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2026/04/27/china-vetoes-metas-2b-manus-deal-after-months-long-probe/",
    },
    {
      title: "Meta reportedly moves to unwind $2B Manus deal after Beijing's demand",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2026/06/13/meta-reportedly-moves-to-unwind-2b-manus-deal-after-beijings-demand/",
    },
    {
      title: "China's Manus raises over $500M in first funding round since split with Meta",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2026/10/08/chinas-manus-raises-over-500m-in-first-funding-round-since-split-with-meta/",
    },
  ],

  sameAs: [
    "https://www.wikidata.org/wiki/Q133102805",
    "https://en.wikipedia.org/wiki/Manus_(AI_agent)",
    "https://manus.im",
  ],

  furtherReading: [
    {
      title: "Perplexity SEO",
      href: "/ai-seo/perplexity",
      description:
        "Another engine that reads the live web for every answer, and how its fetchers identify themselves.",
    },
    {
      title: "Gemini SEO",
      href: "/ai-seo/gemini",
      description:
        "Google's assistant, its grounding in Search, and the agents Google runs on users' behalf.",
    },
    {
      title: "Free AI search readiness check",
      href: "/tools/ai-search-readiness-check",
      description:
        "Scan any site for the things AI engines need before they can read and cite a page.",
    },
    {
      title: "AI crawlers, explained",
      href: "/glossary/ai-crawlers",
      description:
        "Training, search and user-triggered bots: what each does and how to allow or block it.",
    },
  ],
};
