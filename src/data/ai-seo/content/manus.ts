import type { EngineGuide } from "../types";

export const manus: EngineGuide = {
  slug: "manus",
  metaTitle: "Manus SEO: The Technical Guide to Being Used and Cited by an AI Agent",
  metaDescription:
    "How Manus researches in a cloud Chromium browser, the Manus-User agent and its Web Bot Auth signature, why robots.txt won't stop it, and how to track agent traffic.",
  keywords: [
    "Manus SEO",
    "Manus AI agent",
    "Manus-User user agent",
    "optimize website for AI agents",
    "agent-ready website",
    "Manus Wide Research",
  ],
  headline: {
    lead: "Manus SEO:",
    accent: "the technical guide to being used and cited by an AI agent",
  },
  subhead:
    "Manus doesn't answer from an index. It opens your page in a real Chromium browser, reads what it can extract, and cites what it used in a report, deck or website. Here's how it identifies itself, what stops it, and what makes a page an agent can finish a task on.",

  shortAnswer:
    "To be used and cited by Manus, let its agent in and make your page usable by it. Manus's cloud browser identifies as **Manus-User**, signs its requests with Web Bot Auth, and — per Cloudflare's bot directory — doesn't follow robots.txt, so your WAF and bot settings decide access, not robots.txt. It runs a real Chromium browser, so JavaScript isn't the blocker; CAPTCHAs, overlays and facts locked in images are. Put prices, specs and answers in visible text on stable URLs, and Manus can list you as a numbered reference in what it delivers.",

  takeaways: [
    "Manus is an agent, not an index: it runs a search tool, then opens pages in a Chromium browser inside a per-task cloud VM — over 80 million of them created by December 2025.",
    "Its cloud browser sends a Chrome user agent ending in `Manus-User/1.0` and signs requests with Web Bot Auth. Cloudflare lists it as a verified AI Assistant bot.",
    "Manus doesn't document robots.txt handling, and Cloudflare's directory marks it as not following it. Your WAF and bot rules decide whether it gets in.",
    "It renders JavaScript, but it reads through extraction: facts in visible text reach the report more reliably than facts in images, PDFs or hover states.",
    "Wide Research sends hundreds of parallel agents, one per item. Browser Operator runs inside the user's own Chrome, with their logins and their IP.",
    'Links inside a Manus task open with `rel="noopener noreferrer"`, so those clicks arrive with no referrer. Measure Manus in your server logs, not GA4.',
  ],

  facts: [
    { label: "Where it reads your page", value: "Cloud Chromium" },
    { label: "The token in its user agent", value: "Manus-User", mono: true },
    { label: "Follows robots.txt (per Cloudflare)", value: "No" },
    { label: "Virtual computers created by Dec 2025", value: "80M+" },
  ],

  preview: {
    prompt:
      "Compare the top 5 project management tools for a 10-person agency and build me a shortlist with pricing",
    status: "Manus is using Browser",
    answer:
      "**Plannora** tops the shortlist for a 10-person agency: client portals and time tracking are included on its $9-per-seat Team plan, where the other four charge for them as add-ons.",
    sources: [
      { domain: "plannora.io", title: "Plannora pricing and plans" },
      { domain: "stackreview.co", title: "Best project management tools for agencies (2026)" },
      { domain: "loopcraft.app", title: "Loopcraft pricing" },
      { domain: "founderforum.net", title: "What our agency switched to after Loopcraft" },
    ],
  },

  profile: {
    retrieval: "An undisclosed search tool, then live visits in a cloud Chromium browser",
    searchCrawler: "Manus-User (live task visits; no index crawler)",
    trainingCrawler: "None documented",
    rendersJs: "Yes — it drives a real Chromium browser",
    referrer: "Usually none (links open noreferrer); *.manus.space from Manus-built sites",
    citationStyle: "Numbered reference pills in the deliverable, plus a [n] list at the end",
    biggestLever: "Let the verified agent in, then put the facts in visible text on stable URLs",
  },

  sections: [
    {
      id: "how-manus-works",
      title: "How Manus researches a task",
      blocks: [
        {
          kind: "p",
          text: "Manus describes itself as \"a virtual colleague with its own computer,\" and that's literal. Every task gets [a fully isolated cloud virtual machine](https://manus.im/blog/manus-sandbox) with networking, a file system and a browser. By December 2025 Manus had created more than **80 million** of them. The output isn't a chat reply you might click through from — it's a report, slide deck, spreadsheet or website, and your page is either a numbered reference in it or absent.",
        },
        {
          kind: "p",
          text: "That changes the question you're optimizing for. With ChatGPT or Claude the question is whether a crawler can read your HTML. With Manus it's whether an agent can finish its sub-task on your page: find the price, open the plan table, read the limits, and move on.",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "It turns the task into a plan",
              body: 'Manus breaks a request into steps and keeps rewriting a to-do list as it works — "reciting its objectives into the end of the context," per [its engineering write-up](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) (July 2025). A typical task takes around **50 tool calls**.',
              lever:
                "Answer the sub-questions a plan will contain — pricing, limits, integrations, alternatives — each on a page of its own.",
            },
            {
              title: "It searches with a tool, one attribute at a time",
              body: 'Manus doesn\'t document which search engine backs its search tool. Its system prompt, as extracted in March 2025, told it to prefer that tool over search-results pages and to "search multiple attributes of single entity separately." Its task view still tallies them, in steps labeled like "Searched 6 queries."',
              lever:
                "Make each attribute findable on its own: a pricing page, a limits page, an integrations page, each titled for the query that would find it.",
            },
            {
              title: "It opens pages in a cloud Chromium browser",
              body: 'The browser runs inside the task\'s VM — [E2B](https://e2b.dev/customers/how-manus-uses-e2b-to-provide-agents-with-virtual-computers), whose microVMs Manus used in 2025, lists Chromium among its tools. It works from "data center IP addresses, not residential IPs," identifies as `Manus-User`, and signs its requests.',
              lever:
                "Don't challenge it. A CAPTCHA stops the task until the user takes over the browser by hand.",
            },
            {
              title: "It reads what the browser extracts",
              body: 'The 2025 prompt described page content extracted "in Markdown format" that "omits links and images," alongside the interactive elements in the visible viewport. Search snippets "are not valid sources" — it must open the page. Once used, page content can be dropped from context "as long as the URL is preserved."',
              lever:
                "Keep the fact in text, near the top, on a stable URL — where a screenshot, an extraction and a later revisit all find it.",
            },
            {
              title: "It writes the deliverable and lists what it used",
              body: 'The prompt told Manus to "provide a reference list with URLs at the end." In the 2026 app, references show as small numbered pills; hovering one opens a card with the source\'s title and hostname, and the list at the end reads `[1] Title`.',
              lever:
                "Give pages a `<title>` that says exactly what they are. It's the most likely text for the reference line.",
            },
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "$100M+",
              label:
                "annual recurring revenue eight months after launch, with 80M+ virtual computers created",
              source: {
                name: "Manus, Dec 2025",
                href: "https://manus.im/blog/manus-100m-arr",
              },
            },
            {
              value: "~50",
              label: "tool calls in a typical Manus task",
              source: {
                name: "Manus, Jul 2025",
                href: "https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus",
              },
            },
            {
              value: "<5%",
              label:
                "of observed agentic traffic came from ManusAI and five other agents combined in April 2026; agentic browsers led",
              source: {
                name: "HUMAN Security, May 2026",
                href: "https://www.humansecurity.com/learn/blog/state-of-agentic-traffic-april-26/",
              },
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Manus is independent again",
          text: "Meta announced it was acquiring Manus in December 2025. On 27 April 2026 China's National Development and Reform Commission [blocked the deal](https://techcrunch.com/2026/04/27/china-vetoes-metas-2b-manus-deal-after-months-long-probe/) and ordered it withdrawn. Meta began unwinding it in June, and on 11 August Manus said it would [return to independent operation](https://technode.com/2026/08/12/manus-says-it-will-resume-operating-as-an-independent-company/), serving \"millions of users worldwide.\" In September it was [reported](https://techcrunch.com/2026/09/18/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops/) to be raising $500M at a $4B valuation. Its agent identity — the `Manus-User` token and the signing keys on `api.manus.im` — is Manus's own.",
        },
      ],
    },
    {
      id: "at-your-server",
      title: "How Manus shows up at your server",
      blocks: [
        {
          kind: "p",
          text: "Manus reaches your site three ways, and only one of them is distinguishable from a person. Most tasks use the cloud browser. [Wide Research](https://manus.im/docs/features/wide-research) runs many of those at once. [Browser Operator](https://manus.im/docs/integrations/manus-browser-operator) is an extension that drives the user's own Chrome or Edge.",
        },
        {
          kind: "table",
          head: ["Route", "Where it runs", "How it identifies", "What you control"],
          rows: [
            [
              "**Cloud browser** (default)",
              "Chromium in a per-task cloud VM, on data-center IPs",
              "Chrome user agent ending `Manus-User/1.0`; Web Bot Auth signature",
              "WAF and bot rules; verified-bot allowlists",
            ],
            [
              "**Wide Research**",
              "Hundreds of parallel agents, each a full Manus instance",
              "The same as the cloud browser, many at once",
              "Rate limits, and whether verified bots are exempt",
            ],
            [
              "**Browser Operator**",
              "An extension in the user's own Chrome or Edge",
              "The user's browser, IP address and cookies",
              "Nothing that wouldn't also block the user",
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
                "Manus's cloud browser, opening and operating pages for a user's task. Observed as a Linux Chrome user agent with `Manus-User/1.0` appended, and signed with Web Bot Auth keys published on `api.manus.im`.",
              robots: "no",
              robotsNote:
                "Manus doesn't document it; Cloudflare's directory lists it as not following robots.txt.",
              advice: "allow",
            },
          ],
        },
        {
          kind: "p",
          text: "Manus hasn't published its user agent string; its help page for the bot, linked from Cloudflare's directory, returned a 404 in September 2026. [Known Agents](https://knownagents.com/agents/manus-user) records it as `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36; Manus-User/1.0` — the Chrome version moves with each release, so match on the token.",
        },
        {
          kind: "p",
          text: 'Because any client can send that string, the identity that matters is the signature. Cloudflare Radar\'s verified-bot directory ([mirrored as open data](https://github.com/microlinkhq/cloudflare-bot-directory)) lists **Manus Bot** in the AI Assistant category, verified by Web Bot Auth — HTTP message signatures checked against a public key directory. [Fingerprint](https://fingerprint.com/blog/web-bot-auth-guide/) (March 2026) likewise names Manus among operators "signing their requests today." The directory is public:',
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Manus\'s Web Bot Auth key directory (as served in September 2026)\ncurl -s https://api.manus.im/.well-known/http-message-signatures-directory\n{"keys":[{"crv":"Ed25519","kty":"OKP","x":"KcGM6sqzNes25V0hn96KsrIwL6pbut1KQMGmyFwpboM"}]}\n\n# The response is itself signed (tag="http-message-signatures-directory").\n# Keys rotate: verify against the live directory, never a hard-coded key.',
        },
        {
          kind: "p",
          text: '[robots.txt](/glossary/robots-txt) still has a use: stating your policy. Just don\'t expect it to enforce anything. Known Agents says a disallow "only communicates your preference," and reports that **9%** of top websites block `Manus-User` there (September 2026). If you want Manus in, say so and keep private paths out:',
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Manus's cloud browser. Cloudflare lists it as not following\n# robots.txt: this states your policy, it doesn't enforce it.\nUser-agent: Manus-User\nAllow: /\nDisallow: /account/\nDisallow: /checkout/",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Your CDN decides, not robots.txt",
          text: 'Cloudflare\'s [new defaults](https://blog.cloudflare.com/content-independence-day-ai-options/) block "Agent" bots on pages that show ads for domains added from 15 September 2026. Its Agent category covers automated behavior "acting, usually in real time, on a person\'s behalf" — which describes Manus\'s cloud browser. Manus\'s own [docs](https://manus.im/docs/features/cloud-browser) warn that its data-center IPs "may trigger additional verification," and a CAPTCHA stops the task until the user takes over. To be used, allow [verified bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/) through challenges; on Enterprise plans, write rules on `cf.bot_management.verified_bot`.',
        },
      ],
    },
    {
      id: "agent-readiness",
      title: "Agent-readiness: pages an agent can use",
      blocks: [
        {
          kind: "p",
          text: "Manus hasn't published guidance for site owners, so the clearest spec comes from Google. Its [web.dev guide to agent-friendly sites](https://web.dev/articles/ai-agent-site-ux) (April 2026) says: \"Prefer `<button>` and `<a>` tags over modified `<div>` and `<span>` elements,\" link labels to inputs, keep layouts stable, and \"avoid 'ghost' elements or transparent overlays.\" Manus confirmed in 2025 that it used [Browser Use](https://the-decoder.com/chinese-ai-agent-manus-uses-claude-sonnet-and-open-source-technology/), open-source software that extracts a page's buttons and widgets for the model — the same accessibility-first reading.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Reachable without a challenge",
              status: "required",
              note: "The cloud browser runs from data-center IPs. CAPTCHAs, interstitial checks, 403s and 429s stop the task until the user takes over. Allow the verified bot.",
            },
            {
              label: "Facts in visible text",
              status: "helps",
              note: 'Manus\'s extraction "omits links and images." Prices in a graphic, specs only in a PDF, or copy drawn on a canvas may never reach the report.',
            },
            {
              label: "Real links, buttons and labels",
              status: "helps",
              note: 'Native `<a href>`, `<button>` and labeled form fields are what DOM-reading agents detect reliably. Manus\'s 2025 prompt admits that "not all interactive elements may be identified."',
            },
            {
              label: "No overlays or interstitials",
              status: "helps",
              note: "Cookie walls, newsletter modals and app-install banners cost the agent steps, and transparent overlays can hide the control it needs.",
            },
            {
              label: "Stable layout",
              status: "helps",
              note: 'Google: "Agents that take screenshots will likely be confused if your website layout is constantly shifting." Reserve space for late-loading elements.',
            },
            {
              label: "Stable, specific URLs",
              status: "helps",
              note: "Manus keeps the URL when it drops a page from context, then revisits it. A plan, filter or tab that has its own URL can be reopened and cited; a state reached only by clicks can't.",
            },
            {
              label: "Server-side rendering",
              status: "helps",
              note: "Not required for Manus, whose browser runs JavaScript. It still makes the first extraction complete — and ChatGPT, Claude and Perplexity don't render at all. See [server-side rendering](/glossary/server-side-rendering).",
            },
            {
              label: "Structured data",
              status: "unconfirmed",
              note: "Manus hasn't said whether it reads JSON-LD. Extraction works on visible content, so keep every fact from your [schema markup](/glossary/schema-markup) in the copy too.",
            },
            {
              label: "Markdown for agents",
              status: "unconfirmed",
              note: "Its browser is Chrome, which asks for HTML. Whether any other Manus fetch path sends `Accept: text/markdown` isn't documented.",
            },
            {
              label: "llms.txt",
              status: "unconfirmed",
              note: "Manus publishes an [llms.txt](/glossary/llms-txt) for its own docs, but hasn't said its agent reads other sites' files.",
            },
            {
              label: "robots.txt rules",
              status: "no-effect",
              note: "Cloudflare's directory lists `Manus-User` as not following robots.txt. Use it to state policy; enforce policy at the edge.",
            },
          ],
        },
        {
          kind: "p",
          text: "The quickest check is whether your edge turns the user agent away. It can't reproduce Manus's IP reputation or its signature, so a pass here is necessary rather than sufficient:",
        },
        {
          kind: "code",
          lang: "bash",
          code: '# Does a UA or bot rule turn Manus away?\ncurl -s -o /dev/null -w "%{http_code}\\n" \\\n  -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36; Manus-User/1.0" \\\n  https://yoursite.com/pricing\n\n# 403, 429 or 503 = your edge blocks agents by user agent.\n# 200 doesn\'t prove the real agent gets in: IP and signature\n# checks only apply to real Manus traffic.',
        },
        {
          kind: "h3",
          text: "What an agent needs from a pricing page",
        },
        {
          kind: "list",
          items: [
            "Every plan's **name, price, currency and billing period** as text, in a real HTML `<table>`.",
            "What each plan includes and its **limits** — seats, usage caps, overage rates — on the same page, not behind tabs that change nothing in the URL.",
            'A visible **"last updated" date**, because agents run the same comparison again next month.',
            "Links to docs, changelog and comparison pages as plain `<a href>` elements.",
            'No "contact sales" wall in front of numbers you are willing to publish. An agent can\'t book the call.',
          ],
        },
      ],
    },
    {
      id: "what-gets-used",
      title: "What Manus uses and cites",
      blocks: [
        {
          kind: "p",
          text: 'There\'s no public study of which domains Manus cites as of September 2026, so treat citation statistics from ChatGPT or Perplexity as irrelevant here. What is known comes from Manus\'s docs, from its system prompt as extracted in March 2025 — whose tools and architecture co-founder Yichao "Peak" Ji confirmed at the time — and from how its app renders references. Manus says it has "rebuilt our agent framework four times" (July 2025), so read the prompt-based signals as direction, not current rules.',
        },
        {
          kind: "signals",
          items: [
            {
              title: "Pages it opened, not snippets",
              body: 'The prompt: "Snippets in search results are not valid sources; must access original pages via browser." A page that blocks or stalls the browser can\'t be the source, however well it ranks.',
              evidence: "observed",
            },
            {
              title: "Cross-checked facts",
              body: 'Manus was told to "access multiple URLs from search results for comprehensive information or cross-validation." When your site, review sites and profiles disagree on a price, the agent has to pick — and may not pick you.',
              evidence: "observed",
            },
            {
              title: "Data providers before the open web",
              body: 'Manus has [built-in data sources](https://manus.im/docs/integrations/data-sources) for company profiles, financial data and SEC filings, and its prompt ranked "datasource API > web search > model\'s internal knowledge." Your profiles on those providers may be read before your site.',
              evidence: "official",
            },
            {
              title: "Text the extraction can see",
              body: "Extracted page text leaves out images and links, and only viewport elements are listed for interaction. Facts that live in visible copy near the top travel best.",
              evidence: "observed",
            },
            {
              title: "Pages that load for a data-center browser",
              body: "Manus documents that its cloud browser's data-center IPs can trigger verification. Sites that challenge them lose the visit unless the user steps in.",
              evidence: "official",
            },
            {
              title: "Sources inside the user's subscriptions",
              body: "With Browser Operator, Manus reads Crunchbase, PitchBook, SimilarWeb, the Financial Times, Semrush and Ahrefs through the user's own logins. Your presence on those platforms is part of your footprint.",
              evidence: "official",
            },
            {
              title: "One complete page per item",
              body: "Wide Research gives each item — a product, a company, a location — its own agent. A dedicated page that covers the item completely is what that agent lands on and quotes.",
              evidence: "our-read",
            },
            {
              title: "Titles that name the page",
              body: "Each reference is listed as `[n]` plus a title, with your hostname on the hover card. A precise `<title>` is the likeliest text for that line.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "p",
          text: "Being read isn't the same as being cited. Manus opens far more pages than it references, so the pages that earn the reference are the ones that supplied a fact the deliverable actually uses — a price, a limit, a date — stated plainly enough to copy into a table.",
        },
      ],
    },
    {
      id: "wide-research-and-browser-operator",
      title: "Wide Research, Browser Operator and scheduled tasks",
      blocks: [
        {
          kind: "h3",
          text: "Wide Research: hundreds of agents, one item each",
        },
        {
          kind: "p",
          text: '[Wide Research](https://manus.im/blog/introducing-wide-research) launched on 31 July 2025, for Pro users first. It deploys "hundreds of independent agents that work in parallel," each "a fully capable, general-purpose Manus instance" with its own context. Manus says it has been tested up to **250 items** and takes "minutes for 50-100 items." Its own examples are comparisons: 100 sneaker models, 250 AI researchers, Fortune 500 companies.',
        },
        {
          kind: "list",
          items: [
            "**Expect bursts.** A comparison that includes you can send many agents to your site within minutes. Rate limits keyed on IP bursts can turn most of them away.",
            "**Publish one page per entity.** Each subagent researches one item; a complete page for each product, plan or location gives it one place to finish.",
            "**Keep facts table-ready.** Results are assembled into tables and decks. Consistent plan names, units and currencies across your pages survive that merge.",
          ],
        },
        {
          kind: "h3",
          text: "Browser Operator: the agent in your visitor's browser",
        },
        {
          kind: "p",
          text: "Browser Operator is an extension for Chrome and Edge that runs Manus in a dedicated tab, grouped under the task's name, in the user's own browser. Manus says it has been available to all users since 22 November 2025, though its docs still describe a beta for paid plans. Because it uses the user's sessions and local IP, \"there are no unfamiliar login attempts. No CAPTCHA interruptions.\"",
        },
        {
          kind: "p",
          text: "For you, that traffic is your visitor. It carries their cookies, their IP and their browser's user agent, so you can't see it separately or block it without blocking them. It also reaches logged-in areas: if your customers ask Manus to pull data from your app or gated docs, it works there with their permissions.",
        },
        {
          kind: "h3",
          text: "Scheduled tasks: agents that come back",
        },
        {
          kind: "p",
          text: 'Manus can [run tasks on a schedule](https://manus.im/docs/features/scheduled-tasks) — daily, weekly, monthly or custom. Its documented examples include "weekly checks for product updates, pricing changes, and new blog posts" and competitor price tracking. Your pricing page, changelog and blog index are the pages those tasks revisit; a visible date on each tells the agent what changed.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Don't write hidden instructions for agents",
          text: "Manus's own [Browser Operator page](https://manus.im/my-browser) warns users that malicious actors can hide commands in unverified content to manipulate the agent. Text hidden from people but aimed at agents is exactly what prompt-injection defenses look for. Put what you want an agent to know in the visible page.",
        },
      ],
    },
    {
      id: "measurement",
      title: "Measuring Manus traffic",
      blocks: [
        {
          kind: "p",
          text: 'Your server logs are the reliable view. `Manus-User` hits show which pages tasks open, and weekly spikes on the same URLs suggest scheduled monitoring. Known Agents warns that "any bot can claim to be Manus-User," so for decisions, rely on your CDN\'s verified-bot flag — which checks the signature — rather than the string.',
        },
        {
          kind: "code",
          lang: "bash",
          code: "# Pages Manus's cloud browser opened, most-visited first\ngrep \"Manus-User\" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20\n\n# Hits per day: the same pages every week suggests scheduled tasks\ngrep \"Manus-User\" access.log | awk '{print substr($4,2,11)}' | sort | uniq -c",
        },
        {
          kind: "p",
          text: "Analytics sees less than you'd hope. As shipped in September 2026, Manus's web app opens links in a task — in-line references, the reference list, plain links — with `rel=\"noopener noreferrer\"`, so the browser sends no referrer and those visits land in Direct. Websites Manus builds are published on `manus.space` subdomains, with sandbox previews on `manus.computer`; clicks from those carry their origin. Google's [AI Assistant channel](https://support.google.com/analytics/answer/9756891) names ChatGPT, Gemini, DeepSeek, Copilot and Grok — not Manus — so give it a custom channel:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source — pages Manus built or hosts, linking to you\n(^|\\.)manus\\.(space|computer|im)$\n\n# Clicks from inside a Manus task carry no referrer: they land in Direct",
        },
        {
          kind: "p",
          text: "The agent's own visits can pollute analytics too. The cloud browser runs JavaScript, so your analytics tags may fire for `Manus-User` visits and record them as sessions. Compare log hits with GA4 sessions on your most-visited pages before trusting engagement numbers there.",
        },
        {
          kind: "p",
          text: "Citations need a panel of your own. Run a fixed set of buyer tasks in Manus each month — the comparisons your customers would delegate — and record whether you appear in the reference list, and which of your pages it used. Tasks cost credits, so keep the set small and identical from month to month. See [AI referral traffic](/glossary/ai-referral-traffic) for the wider picture.",
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
              myth: "Manus is part of Meta now.",
              reality:
                "Meta announced the deal in December 2025, China blocked it on 27 April 2026, and on 11 August Manus said it would return to independent operation.",
            },
            {
              myth: "A robots.txt disallow keeps Manus out.",
              reality:
                "Cloudflare lists `Manus-User` as not following robots.txt, and Browser Operator is the user's own browser. Block at the WAF if you must — or, better, let the verified bot in.",
            },
            {
              myth: "Agents can't handle JavaScript, so SSR is mandatory for Manus.",
              reality:
                "Manus drives a real Chromium browser, so client-side rendering doesn't hide you from it. Server-rendering still matters for [Claude](/ai-seo/claude), [ChatGPT](/ai-seo/chatgpt) and [Perplexity](/ai-seo/perplexity), whose fetchers don't run scripts.",
            },
            {
              myth: "Manus clicks show up as manus.im referrals.",
              reality:
                'Links inside a Manus task open with `rel="noopener noreferrer"`, so they arrive with no referrer. Only pages Manus hosts, like `*.manus.space` sites, pass one.',
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
      id: "verified-bot",
      title: "Let verified Manus traffic through your WAF",
      detail:
        "Allow verified bots (Manus signs with Web Bot Auth) and exempt them from challenges on the pages you want used.",
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
      id: "cloudflare-defaults",
      title: "Check Cloudflare's Agent defaults",
      detail:
        "Domains added from 15 September 2026 block Agent bots on pages with ads. Decide deliberately and set it in Cloudflare's AI bot settings.",
      impact: "high",
    },
    {
      id: "facts-in-text",
      title: "Put prices, specs and answers in visible text",
      detail:
        "Not in images, canvases or PDF-only downloads. Use real HTML tables for plans and limits.",
      impact: "high",
    },
    {
      id: "no-overlays",
      title: "Remove overlays in front of content",
      detail:
        "Cookie walls, modals and install banners cost agents steps; transparent overlays can hide controls entirely.",
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
      detail: "Plans, filters and tabs with their own URLs can be revisited and cited.",
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
        "Manus cross-checks sources and reads data providers. Align prices and specs everywhere they appear.",
      impact: "medium",
    },
    {
      id: "dates",
      title: "Date your pricing, changelog and blog index",
      detail: "Scheduled tasks revisit them weekly. A visible date shows what changed.",
      impact: "medium",
    },
    {
      id: "titles",
      title: "Write page titles that say what the page is",
      detail: "They're the likeliest text for the `[n]` line in Manus's reference list.",
      impact: "low",
    },
    {
      id: "rate-limits",
      title: "Rate-limit by identity, not by burst",
      detail:
        "Wide Research sends many agents at once. Exempt verified bots rather than blocking the burst.",
      impact: "medium",
    },
    {
      id: "robots-policy",
      title: "State a Manus-User policy in robots.txt",
      detail:
        "It communicates intent, not enforcement. Keep private paths disallowed and enforce at the edge.",
      impact: "low",
    },
    {
      id: "logs",
      title: "Track Manus-User in your server logs",
      detail:
        "Weekly: which pages it opens, how often, and whether requests are verified. GA4 won't show you this.",
      impact: "medium",
    },
    {
      id: "task-panel",
      title: "Run your own Manus task panel monthly",
      detail:
        "A small, fixed set of buyer tasks; record whether you're in the reference list and which page it used.",
      impact: "medium",
    },
  ],

  faqs: [
    {
      q: "How do I get my website cited by Manus?",
      a: "Make sure its verified agent can load your pages without a challenge, then put the facts a task needs — prices, limits, specs, dates — in visible text on stable URLs. Manus cites the pages it actually opened and used, so the page that supplies a fact to the deliverable earns the reference.",
    },
    {
      q: "What user agent does Manus use?",
      a: "Its cloud browser sends a Chrome user agent with `Manus-User/1.0` appended, observed as a Linux Chrome string. It also signs requests with Web Bot Auth, with keys published at `api.manus.im`. Browser Operator uses the user's own browser and user agent.",
    },
    {
      q: "Does Manus respect robots.txt?",
      a: "Manus doesn't document it. Cloudflare's verified-bot directory lists Manus as not following robots.txt, and Known Agents says a disallow only communicates your preference. Enforce access with WAF or bot rules instead.",
    },
    {
      q: "Can Manus read JavaScript-rendered pages?",
      a: "Yes. Manus drives a real Chromium browser in a cloud VM, so client-side content renders. What stops it is a CAPTCHA, an overlay, or a fact that only exists in an image.",
    },
    {
      q: "What search engine does Manus use?",
      a: "Manus doesn't say. It has its own search tools — including web, image and scholar search — but hasn't named the provider behind them. It then opens the results in its own browser rather than relying on snippets.",
    },
    {
      q: "Should I block Manus?",
      a: "Only if you don't want agents using your pages for people's tasks. Blocking takes a WAF rule, because robots.txt isn't followed, and it can't touch Browser Operator, which runs in the user's own browser. If you sell to people who delegate research, let the verified bot in.",
    },
    {
      q: "How does Manus traffic show up in Google Analytics?",
      a: "Mostly as Direct. Links clicked inside a Manus task open with `rel=\"noopener noreferrer\"`, so no referrer is sent. Sites Manus builds on `*.manus.space` do pass their origin. GA4's AI Assistant channel doesn't list Manus, so use a custom channel and your server logs.",
    },
    {
      q: "Is Manus owned by Meta?",
      a: "No longer. Meta announced the acquisition in December 2025, China's NDRC blocked it on 27 April 2026, and Manus said on 11 August 2026 that it would operate independently again. In September it was reported to be raising at a $4B valuation.",
    },
    {
      q: "What is Wide Research, and why does it matter for my site?",
      a: "It's Manus's mode for large comparisons: hundreds of parallel agents, one per item, tested up to 250 items. For you it means bursts of agent visits and a premium on having one complete page for each product or plan.",
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
      title: "Scheduled tasks",
      publisher: "Manus Documentation",
      href: "https://manus.im/docs/features/scheduled-tasks",
    },
    {
      title: "Introducing Wide Research",
      publisher: "Manus",
      href: "https://manus.im/blog/introducing-wide-research",
    },
    {
      title: "Introducing Manus Browser Operator",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-browser-operator",
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
      title: "Manus update: $100M ARR, $125M revenue run-rate",
      publisher: "Manus",
      href: "https://manus.im/blog/manus-100m-arr",
    },
    {
      title: "How Manus uses E2B to provide agents with virtual computers",
      publisher: "E2B",
      href: "https://e2b.dev/customers/how-manus-uses-e2b-to-provide-agents-with-virtual-computers",
    },
    {
      title: "Manus system prompt (extracted March 2025)",
      publisher: "GitHub (jujumilk3/leaked-system-prompts)",
      href: "https://github.com/jujumilk3/leaked-system-prompts/blob/main/manus_20250310.md",
    },
    {
      title: "Manus-User user agent",
      publisher: "Known Agents",
      href: "https://knownagents.com/agents/manus-user",
    },
    {
      title: "Cloudflare Radar verified-bot directory as open data",
      publisher: "Microlink (GitHub)",
      href: "https://github.com/microlinkhq/cloudflare-bot-directory",
    },
    {
      title: "Manus Web Bot Auth key directory",
      publisher: "Manus",
      href: "https://api.manus.im/.well-known/http-message-signatures-directory",
    },
    {
      title: "Verified bots",
      publisher: "Cloudflare Docs",
      href: "https://developers.cloudflare.com/bots/concepts/bot/verified-bots/",
    },
    {
      title: "Content Independence Day: new AI options",
      publisher: "Cloudflare",
      href: "https://blog.cloudflare.com/content-independence-day-ai-options/",
    },
    {
      title: "Building agent-friendly websites",
      publisher: "web.dev (Google)",
      href: "https://web.dev/articles/ai-agent-site-ux",
    },
    {
      title: "State of Agentic Traffic — April 2026",
      publisher: "HUMAN Security",
      href: "https://www.humansecurity.com/learn/blog/state-of-agentic-traffic-april-26/",
    },
    {
      title: "China blocks Meta's $2B Manus deal after months-long probe",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2026/04/27/china-vetoes-metas-2b-manus-deal-after-months-long-probe/",
    },
    {
      title: "Manus says it will resume operating as an independent company",
      publisher: "TechNode",
      href: "https://technode.com/2026/08/12/manus-says-it-will-resume-operating-as-an-independent-company/",
    },
  ],

  sameAs: [
    "https://www.wikidata.org/wiki/Q133102805",
    "https://en.wikipedia.org/wiki/Manus_(AI_agent)",
    "https://manus.im",
  ],

  furtherReading: [
    {
      title: "Gemini SEO",
      href: "/ai-seo/gemini",
      description:
        "Google-Agent, Gemini in Chrome's auto browse, and how Google's own agents identify themselves.",
    },
    {
      title: "Perplexity SEO",
      href: "/ai-seo/perplexity",
      description:
        "Perplexity's index and bots — and Comet, the agentic browser that led agentic traffic in 2026.",
    },
    {
      title: "Free AI search readiness check",
      href: "/tools/ai-search-readiness-check",
      description:
        "Grade crawler access, titles, headings, structured data and canonicals on any page in seconds.",
    },
    {
      title: "AI crawlers, explained",
      href: "/glossary/ai-crawlers",
      description:
        "Training, search and user-triggered bots: what each does and how to allow or block it.",
    },
  ],
};
