import type { EngineGuide } from "../types";

/* Facts verified against Google's own docs and the cited studies on
   2026-10-26. The sample brand and source domains in `preview` are invented
   (no live site at any of them on that date). */
export const gemini: EngineGuide = {
  slug: "gemini",
  metaTitle: "Gemini SEO: How to Get Cited in the Gemini App (2026 Guide)",
  metaDescription:
    "How the Gemini app grounds answers in Google Search, why Google-Extended is its only dedicated opt-out, how it differs from AI Mode, and how to find Gemini traffic in GA4.",
  keywords: [
    "Gemini SEO",
    "how to get cited by Gemini",
    "Google Gemini optimization",
    "Google-Extended",
    "Gemini grounding with Google Search",
    "Gemini vs AI Mode",
    "Gemini app citations",
  ],
  headline: { lead: "Gemini SEO:", accent: "get cited when the Gemini app searches Google" },
  subhead:
    "The Gemini app answers from the same Google index as Search, but it has its own opt-out, links to fewer sources than the other big assistants, and sends traffic Search Console never sees. Here's how to earn its links, and how to tell when you have.",

  shortAnswer:
    "To be cited by the Gemini app, a page has to be in Google's Search index and must not be disallowed for **Google-Extended**, the robots.txt token Google says controls grounding in Gemini Apps as well as Gemini training. Search Console's AI opt-out doesn't reach the app. Gemini also links to few sources (a median of 2.4 domains per answer in one 1,200-prompt study, against 3.1 for ChatGPT) and names brands far more often than it links them, so being named on the pages it does cite matters as much as being one of them.",

  takeaways: [
    "Gemini has no index of its own. Grounding means \"providing content from the Google Search index to the model at prompt time,\" so a page Google hasn't indexed can't be cited.",
    "`Google-Extended` is the app's only dedicated opt-out, and it's bundled: disallowing it drops your pages from Gemini grounding **and** future Gemini training. Cloudflare's managed robots.txt, set to disallow training, writes that line for you.",
    "Search Console's generative AI control lists AI Overviews, AI Mode and Discover; the Gemini app isn't on it, and Gemini clicks never appear in Search Console.",
    "Gemini cites few domains: a median of 2.4 per answer against ChatGPT's 3.1 and Perplexity's 6.4 in Attrifast's spring 2026 study. One agency panel found any source at all on only 68.4% of Gemini answers.",
    "It names brands far more than it links them (83.7% vs 21.4% of appearances in Semrush's study), so earning mentions on the pages Gemini already cites is half the job.",
    "Gemini's most-cited domains overlap only 27% with AI Mode's (BrightEdge). Winning AI Overviews doesn't mean winning Gemini.",
    "Measure it in GA4's AI Assistant channel (since 13 May 2026) and by `gemini.google.com` referrals. Clicks from the mobile apps often arrive with no referrer at all.",
  ],

  facts: [
    { label: "Gemini app monthly users (Aug 2026)", value: "1B+" },
    { label: "Answers grounded in", value: "Google's Search index" },
    { label: "The opt-out that reaches the app", value: "Google-Extended", mono: true },
    { label: "Median domains cited per answer (Attrifast)", value: "2.4" },
  ],

  preview: {
    prompt: "Which project management apps work best with Google Workspace?",
    status: "Answer grounded in Google Search",
    answer:
      "For a team that lives in Workspace, **Tallowpine** is a strong pick: tasks sync both ways with Google Calendar, Drive files attach natively, and its free tier covers up to five people.",
    sources: [
      { domain: "tallowpine.app", title: "Tallowpine for Google Workspace" },
      { domain: "toolbenchnotes.com", title: "Workspace-friendly PM tools, tested" },
      { domain: "opsforumhub.net", title: "Which PM app doesn't fight Google Docs?" },
    ],
  },

  profile: {
    retrieval: "The Google Search index, fetched at prompt time (Grounding with Google Search)",
    searchCrawler: "Googlebot (there's no separate Gemini crawler)",
    trainingCrawler: "Google-Extended token, which also ends Gemini-app grounding",
    rendersJs: "Via Google's index (Googlebot renders JavaScript)",
    referrer: "gemini.google.com, in GA4's AI Assistant channel; app clicks often land in Direct",
    citationStyle: "Inline source chips and a Sources side panel; many answers show none",
    biggestLever:
      "Stay indexed with Google-Extended allowed, and get named on the few pages Gemini cites",
  },

  sections: [
    {
      id: "prompt-to-source",
      title: "From prompt to source chip: how Gemini grounds an answer",
      blocks: [
        {
          kind: "p",
          text: 'Google defines grounding as "providing content from the Google Search index to the model at prompt time to improve factuality and relevancy," and names the Gemini app as one place it happens ([Google\'s common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)). So there is no Gemini index to submit to and no Gemini crawler to court. The candidates are pages Googlebot has already crawled and indexed.',
        },
        {
          kind: "p",
          text: "Google doesn't publish how the consumer app decides when to search. Its [developer documentation](https://ai.google.dev/gemini-api/docs/google-search) for the same capability describes the loop, and it matches what users see in the app:",
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Gemini decides whether a search would help",
              body: 'The model "analyzes the prompt and determines if a Google Search can improve the answer." Fresh, factual and comparison questions usually trigger it; drafting, brainstorming and small talk often don\'t, which is why Google warns that "not all responses include related links or sources."',
              lever:
                "Target questions that need current facts: prices, specs, comparisons, how-tos with versions and dates.",
            },
            {
              title: "It writes its own searches",
              body: 'If needed, the model "automatically generates one or multiple search queries and executes them." They split the prompt into sub-questions, which is why Ahrefs found only 12% of links cited by ChatGPT, Gemini and Copilot ranked in Google\'s top 10 for the original prompt (2025 data).',
              lever:
                "Cover the sub-questions around a topic on pages that each answer one well, rather than one thin page per keyword variant.",
            },
            {
              title: "Google's index supplies the pages",
              body: "Results come from the Search index, with one filter Search itself doesn't apply: pages whose robots.txt disallows `Google-Extended` can't be used for grounding in Gemini Apps.",
              lever:
                "Be indexed (check URL Inspection) and leave `Google-Extended` allowed on anything you want cited.",
            },
            {
              title: "The answer is written and its sources attached",
              body: 'Sources sit "in-line throughout the response" or behind a **Sources** button at the bottom, which opens a side panel of links. If Gemini quotes a large amount of text from a page, that page is always listed. With Workspace connected, the list can include the user\'s own Docs and emails too.',
              lever:
                "Write passages specific enough to quote: a number, a named method, a dated fact. Paraphrased common knowledge rarely earns a chip.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "The API shows the plumbing the app hides",
          text: "Call Gemini with the `google_search` tool and you get back the searches it actually ran (`google_search_call`) and `url_citation` annotations that tie each span of the answer to a URL. It's the clearest public view of how a grounded Gemini answer is assembled, and a cheap way to see which sub-questions a buyer's prompt turns into.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "The double-check button is no longer documented",
          text: 'Gemini used to offer **Double-check response**, which re-searched Google and highlighted statements green (similar content found) or orange (different or nothing found). As of October 2026, the help page that explained it covers only the Sources button, and the old "Double-check responses" link lands there. Its links came from a fresh search after the answer was written, so they never showed what Gemini used. Don\'t plan around it.',
        },
      ],
    },
    {
      id: "google-extended",
      title: "Google-Extended: the one switch that's Gemini's alone",
      blocks: [
        {
          kind: "p",
          text: '`Google-Extended` isn\'t a crawler. Google says it "doesn\'t have a separate HTTP request user agent string": Googlebot does the crawling, and the token only tells Google what it may do with what it fetched. Disallow it and your content can\'t be used to train future Gemini models **or** for "grounding … in Gemini Apps and Grounding with Google Search on Vertex AI." It "does not impact a site\'s inclusion in Google Search nor is it used as a ranking signal."',
        },
        {
          kind: "p",
          text: "That bundling is the decision every Gemini strategy starts with. A publisher who blocks the token to keep content out of training also leaves the Gemini app's citations, and there's no setting that keeps one and drops the other.",
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "Googlebot",
              role: "search",
              purpose:
                "Crawls and renders the pages in the Search index that Gemini grounds on. Blocking it removes you from Search, AI Overviews, AI Mode and Gemini alike.",
              robots: "yes",
              advice: "allow",
            },
            {
              token: "Google-Extended",
              role: "training",
              purpose:
                "A robots.txt token you'll never see in logs. Governs Gemini training and grounding in the Gemini app and on Vertex AI; no effect on Search or rankings.",
              robots: "yes",
              advice: "your-call",
            },
          ],
        },
        {
          kind: "h3",
          text: "Setting it: all, nothing, or by folder",
        },
        {
          kind: "p",
          text: "Saying nothing is a choice too: with no `Google-Extended` group, Gemini may ground on, and train on, anything Googlebot can crawl. To leave Gemini entirely while staying in Search:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Out of Gemini-app citations AND Gemini training.\n# Search, AI Overviews and AI Mode are unaffected.\nUser-agent: Google-Extended\nDisallow: /",
        },
        {
          kind: "p",
          text: "The token takes path rules like any other group (Google's own example allows one archive page and disallows the rest), so you can keep public guides citable and withhold the content you sell:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "User-agent: Google-Extended\nAllow: /guides/\nDisallow: /members/\nDisallow: /reports/",
        },
        {
          kind: "callout",
          tone: "warning",
          title: 'A "block AI training" toggle can take you out of Gemini',
          text: "With Bot Preference Sync on and Training set to Disallow, Cloudflare prepends managed rules to your robots.txt, and its documented example includes `User-agent: Google-Extended` / `Disallow: /`. Meant as a training opt-out, it also ends Gemini-app grounding. Fetch `/robots.txt` on every hostname and read the group that applies to `Google-Extended`.",
        },
        {
          kind: "h3",
          text: "What each Google control switches off",
        },
        {
          kind: "table",
          head: ["Control", "Gemini app", "AI Overviews & AI Mode", "Google Search results"],
          rows: [
            [
              "`Google-Extended` disallowed",
              "**Grounding and training off**",
              "Unaffected",
              "Unaffected",
            ],
            [
              "Search Console generative AI control: Exclude",
              "Not listed",
              "**Removed** in 1–2 days",
              "Unaffected",
            ],
            [
              "`nosnippet` / `max-snippet`",
              "Not documented",
              "Limits what's shown",
              "Limits snippet",
            ],
            ["`noindex`", "Removed", "Removed", "Removed"],
            ["Googlebot disallowed", "Removed", "Removed", "Removed"],
          ],
        },
        {
          kind: "p",
          text: "The two AI opt-outs are mirror images. The [Search Console control](https://support.google.com/webmasters/answer/16908024), rolled out to every site on 31 August 2026, removes pages from AI Overviews, AI Mode and Discover's generative features and doesn't mention Gemini. `Google-Extended` removes them from Gemini and leaves AI Overviews alone. Google's help page sends you to `Google-Extended` only to limit the training of the models behind Search's AI features, not their answers.",
        },
      ],
    },
    {
      id: "three-google-surfaces",
      title: "Gemini, AI Overviews and AI Mode: one index, three products",
      blocks: [
        {
          kind: "p",
          text: 'All three are Google products that ground answers in the same index, which is why advice for one gets pasted onto the others. They differ in where they live, which controls reach them and where their clicks land. Google has "brought together AI Overviews and AI Mode into one seamless Search experience"; the Gemini app is a separate product at gemini.google.com, in the mobile apps and in Chrome. For Search\'s AI features, read the [AI Overviews & AI Mode guide](/ai-seo/google-ai-overviews); this one stays with the app.',
        },
        {
          kind: "table",
          head: ["", "Gemini app", "AI Overviews & AI Mode"],
          rows: [
            [
              "Where it lives",
              "gemini.google.com, the Gemini apps, Gemini in Chrome",
              "Google Search results and the AI Mode tab",
            ],
            ["Grounded in", "Google Search index", "Google Search index, with query fan-out"],
            [
              "Opt-out",
              "`Google-Extended`",
              "Search Console generative AI control; snippet controls",
            ],
            [
              "Reporting",
              "None in Search Console",
              "Search Console Performance (Web) and the Generative AI performance report",
            ],
            [
              "Clicks in GA4",
              "**AI Assistant** channel; referral from `gemini.google.com`",
              "**Organic Search**: Google excludes both from AI Assistant",
            ],
            [
              "Sources shown",
              "Inline chips or a Sources panel; often none",
              "Links attached to the answer",
            ],
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "27%",
              label:
                "overlap between the 100 domains Gemini cites most and AI Mode's, below Gemini's 39% overlap with ChatGPT",
              source: {
                name: "BrightEdge, Apr 2026",
                href: "https://www.brightedge.com/resources/weekly-ai-search-insights/ai-search-same-brands-different-sources",
              },
            },
            {
              value: "1B+",
              label: "people use the Gemini app every month, up from 950M at the end of July",
              source: {
                name: "Google, Aug 2026",
                href: "https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/",
              },
            },
            {
              value: "13.2%",
              label:
                "of AI referral traffic came from Gemini in April 2026, up from 4.3% in late 2025",
              source: {
                name: "BrightEdge, May 2026",
                href: "https://www.brightedge.com/news/press-releases/brightedge-data-gemini-second-largest-ai-referral-source-q1-2026",
              },
            },
          ],
        },
        {
          kind: "myths",
          items: [
            {
              myth: "Blocking Google-Extended takes you out of AI Overviews.",
              reality:
                "It doesn't. Search's AI features answer to Googlebot, the Search Console control and snippet controls, and Google says `Google-Extended` isn't a Search ranking signal either.",
            },
            {
              myth: "Excluding your site from Search generative AI keeps you out of Gemini.",
              reality:
                "That control lists AI Overviews, AI Mode and Discover. The Gemini app's lever is `Google-Extended`.",
            },
            {
              myth: "Win AI Overviews and Gemini follows.",
              reality:
                "BrightEdge found Gemini's top cited domains overlap 27% with AI Mode's and 34% with AI Overviews'. Same index, different picks.",
            },
          ],
        },
      ],
    },
    {
      id: "mentions-over-links",
      title: "Fewer links, more names: what Gemini actually cites",
      blocks: [
        {
          kind: "p",
          text: "Gemini is the most sparing linker among the big assistants. In [Attrifast's study](https://attrifast.com/blog/ai-search-citations-by-vertical-2026) of 1,200 buyer-intent prompts, each run three times on gemini.google.com (April–May 2026, logged out, mostly Gemini 2.5 Pro), Gemini cited a median of **2.4** unique domains per answer, against 3.1 for ChatGPT search, 3.6 for Claude and 6.4 for Perplexity. An agency panel of 11,028 answers per engine (July–October 2026, from tracked projects mostly in French) found Gemini attached any source to 68.4% of answers, against 96.3% for ChatGPT.",
        },
        {
          kind: "p",
          text: "Semrush and Growth Memo measured the other side of that. Across 3,981 domain appearances from 115 prompts in 14 countries, Gemini named brands in 83.7% of appearances and linked them in 21.4%. It still recommends companies; it just doesn't always say where it read about them.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "2.4",
              label:
                "median unique domains cited per Gemini answer; ChatGPT 3.1, Claude 3.6, Perplexity 6.4",
              source: {
                name: "Attrifast, May 2026",
                href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
              },
            },
            {
              value: "68.4%",
              label: "of Gemini answers cited at least one source, against 96.3% for ChatGPT",
              source: {
                name: "Archipel, Oct 2026",
                href: "https://www.archipelmarketing.com/en/observatory/comparisons/chatgpt-vs-gemini",
              },
            },
            {
              value: "21.4%",
              label: "of Gemini's brand appearances carried a link; 83.7% named the brand in text",
              source: {
                name: "Semrush × Growth Memo, Jun 2026",
                href: "https://www.semrush.com/blog/the-ghost-citations-study/",
              },
            },
          ],
        },
        {
          kind: "h3",
          text: "Which sources win depends on the question",
        },
        {
          kind: "p",
          text: "The studies disagree about Gemini's favourite sources, and the disagreement is useful: each sampled a different kind of question.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Forums and video, on everyday questions",
              body: "Across 3M+ US queries on all topics (Ahrefs Brand Radar, September 2026), Reddit held 28.5% of the citation share among Gemini's top 50 domains, YouTube 14.6% and Wikipedia 8.8%.",
              evidence: "observed",
            },
            {
              title: "Institutions, on industry questions",
              body: "On BrightEdge's industry prompts (finance, healthcare, B2B tech and more), 26% of Gemini's citations went to government, academic and institutional sources (about 13% to .gov alone) and 0.2% to user-generated content.",
              evidence: "observed",
            },
            {
              title: "Vendor pages and YouTube, on buying questions",
              body: "On buyer-intent prompts, Attrifast found vendor sites took 14.1% of Gemini's citations, Wikipedia 12.1%, YouTube 9.7% and Reddit 8.4%. YouTube was cited about 2.5 times as often as on the other three engines.",
              evidence: "observed",
            },
            {
              title: "A concentrated pool",
              body: "Gemini's top 100 domains took 58.7% of its citations in the same study. The few links it gives keep going to the same sites, so a mention on one of them travels further than another page of your own.",
              evidence: "observed",
            },
            {
              title: "Google's quality bar decides who's in the pool",
              body: "Grounding draws on Google's index, so the candidates are pages Google's systems surface. Google's advice for its AI features, unique non-commodity content with first-hand insight, is written for Search, but nothing suggests the app's pool differs.",
              evidence: "our-read",
            },
            {
              title: "Why it names more than it links",
              body: "Unlinked mentions plausibly come from what the model already knows and from third-party pages that discuss you. Google documents neither, but both point the same way: review sites, comparisons and YouTube are where to be named.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Turning that into work",
          text: "Find the pages Gemini already cites for your category (review roundups, comparison posts, YouTube reviews, active forum threads) and earn a place on them by being worth including: send review units, publish real benchmarks, answer the questions you're expert in. Never fake mentions.",
        },
      ],
    },
    {
      id: "beyond-the-chat",
      title: "Deep Research, Chrome and agents: when Gemini reads your page itself",
      blocks: [
        {
          kind: "p",
          text: "Not every Gemini visit is a grounded chat answer. Other paths reach your site, and they identify themselves differently, which matters for robots.txt, your WAF and your logs. Two have user agents of their own:",
        },
        {
          kind: "crawlers",
          bots: [
            {
              token: "Google-Agent",
              role: "user",
              purpose:
                'Used "by agents hosted on Google infrastructure to navigate the web and perform actions upon user request." IPs are published in `user-triggered-agents.json`, and Google is testing Web Bot Auth with the `agent.bot.goog` identity.',
              robots: "no",
              robotsNote: "User-triggered, so it generally ignores robots.txt.",
              advice: "allow",
            },
            {
              token: "Google-GeminiNotebook",
              role: "user",
              purpose:
                "Fetches URLs a user adds as sources in Gemini Notebook, called NotebookLM until July 2026. The old `Google-NotebookLM` token was supported until August 2026.",
              robots: "no",
              robotsNote: "User-triggered, so it generally ignores robots.txt.",
              advice: "allow",
            },
          ],
        },
        {
          kind: "p",
          text: "The rest arrive without a Gemini label:",
        },
        {
          kind: "list",
          items: [
            '**Deep Research** can "browse up to hundreds of websites" for one report, on Gemini 3, from a research plan the user can edit. Google doesn\'t document its fetcher, so the safest assumption is the same index-plus-`Google-Extended` rule as chat.',
            "**Gemini in Chrome** sits in a side panel beside whatever tab is open and answers questions about that page. It reads what's already in the user's browser, so robots.txt never comes into it.",
            "**Auto browse** clicks, fills in forms and shops inside the user's own Chrome, pausing for confirmation before purchases or posts. It launched for AI Pro and Ultra subscribers in the US in January 2026 and began reaching Android in the US at the end of June. Google documents no separate identifier, so expect it to look like that user's browser.",
            "**Gemini Spark**, Google's always-on personal agent, browsed in a remote browser at launch and since July 2026 can drive the user's desktop Chrome through auto browse.",
            '**Developers** who pass your URL with the API\'s URL context tool get the page "from an internal index cache" first, with a live fetch only as a fallback.',
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Don't let bot rules break agents",
          text: "Agents work from the DOM and the accessibility tree. Google's [web.dev guidance](https://web.dev/articles/ai-agent-site-ux): native `<button>` and `<a>` elements, labels tied to their inputs, no transparent overlays on controls, targets bigger than 8 square pixels, and key controls that stay in the same place from page to page. If your WAF challenges automation, verify `Google-Agent` before you block it.",
        },
        {
          kind: "code",
          lang: "Verify a Google-Agent request",
          code: "# 1. The user agent contains the token\nGoogle-Agent\n\n# 2. The IP is in Google's published list\nhttps://developers.google.com/static/crawling/ipranges/user-triggered-agents.json\n\n# 3. Or: reverse DNS ends in google.com or googleusercontent.com,\n#    and a forward lookup returns the same IP\nhost <ip-from-your-logs>",
        },
      ],
    },
    {
      id: "products-and-places",
      title: "Products and places: the feeds behind Gemini's shopping and local answers",
      blocks: [
        {
          kind: "p",
          text: "For shopping and local questions, Gemini can lean on Google's own data stores as much as on web pages, and those are fed directly, not crawled. Here's what helps, what doesn't, and what nobody has confirmed:",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Indexed by Google",
              status: "required",
              note: "The baseline for every grounded citation. Confirm with URL Inspection in Search Console.",
            },
            {
              label: "Google-Extended allowed",
              status: "required",
              note: "For Gemini-app grounding specifically. Check every hostname and any CDN-managed rules.",
            },
            {
              label: "Merchant Center feed",
              status: "helps",
              note: 'Google says Merchant Center and Business Profile "can help your products and services to be visible in both AI responses and other Google Search results." Keep titles, GTINs, prices, availability and images complete.',
            },
            {
              label: "UCP checkout",
              status: "helps",
              note: "With the Universal Commerce Protocol, eligible listings can show a Buy button on Gemini and AI Mode, paid through Google Pay while you stay merchant of record. Select merchants in the US, Canada and Australia; only listings with `native_commerce` show it.",
            },
            {
              label: "Google Business Profile",
              status: "helps",
              note: 'Gemini\'s Maps grounding draws on "places, reviews, photos, addresses, opening hours" across 250M+ places. Keep hours, categories and attributes current, and reply to reviews.',
            },
            {
              label: "Structured data",
              status: "no-effect",
              note: "Google says no special schema.org markup is needed for its AI features. Keep it valid for rich results; it isn't a Gemini switch.",
            },
            {
              label: "llms.txt",
              status: "no-effect",
              note: 'Google Search "doesn\'t use them," and nothing documents the Gemini app reading one.',
            },
            {
              label: "Snippet controls",
              status: "unconfirmed",
              note: "`nosnippet` and `max-snippet` are documented for Search features. Whether the Gemini app honours them isn't stated.",
            },
          ],
        },
      ],
    },
    {
      id: "measuring-gemini",
      title: "Finding Gemini in GA4, your logs and a prompt panel",
      blocks: [
        {
          kind: "p",
          text: "Search Console won't help here: its Generative AI performance report covers Google Search and Discover, and the Gemini app is neither. Gemini is measured where its clicks land.",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**GA4's AI Assistant channel.** Since 13 May 2026, GA4 sets medium `ai-assistant` and campaign `(ai-assistant)` when the referrer matches a recognised assistant, and Google names Gemini among them. For sessions before that date, filter on session source instead.",
            "**The referrer.** Clicks from the web app arrive as `gemini.google.com / referral` (`bard.google.com` in older data). Google files AI Overviews and AI Mode clicks under Organic Search instead.",
            "**UTM tags.** Since late September 2026, practitioners have seen `utm_source=gemini` on some outbound links. Google hasn't documented it, so treat it as a bonus signal, and never add Gemini UTMs to your own URLs.",
            "**Direct traffic.** Clicks from the mobile apps and the Android assistant often lose the referrer; one practitioner put mobile pass-through at around 9%, unverified. Watch for Direct sessions landing deep on the pages Gemini cites.",
            "**Logs.** Count verified `Google-Agent` and `Google-GeminiNotebook` hits. Googlebot hits tell you nothing Gemini-specific.",
          ],
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: "# Session source / medium: the Gemini web app\n^(gemini\\.google\\.com|bard\\.google\\.com) / referral$\n\n# Session source: also catches UTM-tagged links\n^(gemini\\.google\\.com|bard\\.google\\.com|gemini)$",
        },
        {
          kind: "h3",
          text: "A prompt panel for what analytics can't see",
        },
        {
          kind: "p",
          text: "With links on barely a fifth of brand appearances, most of your Gemini visibility never becomes a click. A small panel you can repeat shows it:",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            'Write 20–30 prompts a buyer would actually type: comparisons ("Tallowpine vs Asana for Workspace"), recommendations ("best PM app for a five-person team on Google Workspace") and how-tos.',
            "Run each in a fresh signed-out session, then signed in. With Workspace connected, sources can include the user's own Docs and emails, which changes the answer.",
            "Record three things separately: whether you're **named**, whether you're **linked** (a chip or a Sources entry), and which domains were cited instead.",
            "Run the panel at least three times over a week. Attrifast ran every prompt three times, 48 hours apart, because one run proves little.",
            "Send the same prompts through the API's `google_search` tool to see the searches Gemini wrote, and cover the sub-questions you're missing.",
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "index",
      title: "Confirm Google has indexed the pages you want cited",
      detail:
        "URL Inspection on your top pages. There's no other way into Gemini's grounding pool.",
      impact: "high",
    },
    {
      id: "extended-decision",
      title: "Decide on Google-Extended on purpose",
      detail:
        "Allowed keeps you citable in the Gemini app; disallowed drops grounding and training together. Use path rules if only some content should be withheld.",
      impact: "high",
    },
    {
      id: "robots-audit",
      title: "Read robots.txt on every hostname",
      detail:
        "Look for a `Google-Extended` group a CDN toggle or plugin added. Check the apex, `www` and every subdomain.",
      impact: "high",
    },
    {
      id: "sub-questions",
      title: "Map the sub-questions behind your buyers' prompts",
      detail:
        "Run them through the API's `google_search` tool to see the searches Gemini writes, then answer each one well on a page of its own.",
      impact: "high",
    },
    {
      id: "quotable",
      title: "Make key passages quotable",
      detail:
        "Specific numbers, named methods, dated facts and short definitions near the top of each section.",
      impact: "medium",
    },
    {
      id: "be-named",
      title: "Earn mentions on the pages Gemini already cites",
      detail:
        "Review roundups, comparison posts, YouTube reviews and forum threads in your category. Earn them; never fake them.",
      impact: "high",
    },
    {
      id: "youtube",
      title: "Publish YouTube videos that answer real questions",
      detail:
        "Accurate titles, chapters and descriptions. YouTube turns up far more in Gemini's citations than in other assistants'.",
      impact: "medium",
    },
    {
      id: "feeds",
      title: "Keep Merchant Center and Business Profile complete",
      detail:
        "Products: a full feed, plus UCP checkout if you're eligible. Places: hours, categories, attributes and review replies.",
      impact: "medium",
    },
    {
      id: "agents",
      title: "Keep pages usable by agents",
      detail:
        "Native buttons and links, labelled inputs, no overlays, stable layouts. Verify `Google-Agent` before your WAF blocks it.",
      impact: "medium",
    },
    {
      id: "ga4",
      title: "Set up Gemini measurement in GA4",
      detail:
        "The AI Assistant channel, a `gemini.google.com` source filter and a check for `utm_source=gemini`.",
      impact: "high",
    },
    {
      id: "panel",
      title: "Run a monthly Gemini prompt panel",
      detail:
        "Signed out and signed in, three runs per prompt. Record named, linked, and who was cited instead.",
      impact: "medium",
    },
  ],

  faqs: [
    {
      q: "Does blocking Google-Extended remove me from Gemini?",
      a: "From its grounded answers, yes. Google says the token controls whether crawled content is used for grounding in Gemini Apps and for training future Gemini models. The app can still mention you from what it already knows or from other sites, but it can't ground on your pages, so they shouldn't appear among its sources.",
    },
    {
      q: "Does blocking Google-Extended affect my rankings or AI Overviews?",
      a: "No. Google says it \"does not impact a site's inclusion in Google Search nor is it used as a ranking signal.\" AI Overviews and AI Mode answer to Googlebot, Search Console's generative AI control and snippet controls.",
    },
    {
      q: "Is optimizing for Gemini different from optimizing for AI Mode?",
      a: "The foundations are shared: the same index and the same quality bar. The controls, reporting and picks differ. Gemini's opt-out is `Google-Extended`, its clicks land in GA4's AI Assistant channel rather than Organic Search, and BrightEdge found only 27% overlap between the domains Gemini and AI Mode cite most.",
    },
    {
      q: "How many sources does Gemini cite?",
      a: "Fewer than the other major assistants. Attrifast measured a median of 2.4 unique domains per Gemini answer in spring 2026, against 3.1 for ChatGPT and 6.4 for Perplexity, and an agency panel found any source at all on 68.4% of Gemini answers.",
    },
    {
      q: "How do I see traffic from Gemini?",
      a: "In GA4's AI Assistant channel (added 13 May 2026), as `gemini.google.com / referral`, and since late September 2026 on some links as `utm_source=gemini`. Search Console doesn't report the Gemini app, and clicks from the mobile apps often arrive as Direct.",
    },
    {
      q: "Does the Gemini app have its own crawler?",
      a: "No. Grounding uses pages Googlebot has already crawled, and `Google-Extended` is only a robots.txt token. Separate fetchers appear when a user adds your URL to Gemini Notebook (`Google-GeminiNotebook`) or a Google-hosted agent visits (`Google-Agent`); both generally ignore robots.txt.",
    },
    {
      q: "What happened to Gemini's double-check button?",
      a: "As of October 2026, Gemini Apps Help no longer documents it; the page that described its green and orange highlights now covers only the Sources button. If it still appears for you, its links come from a fresh Google search, not from the sources Gemini used.",
    },
    {
      q: "Does Siri now cite Gemini's sources?",
      a: "Nothing documents that. Apple's next Foundation Models are \"based on Google's Gemini models,\" but they run on Apple devices and Private Cloud Compute. That isn't the Gemini app, and no documented path connects Siri's answers to Gemini grounding or to `Google-Extended`.",
    },
    {
      q: "Does Gemini read llms.txt or need schema markup?",
      a: "Nothing documents either. Google Search says it doesn't use llms.txt and needs no special schema for its AI features, and Gemini grounds on that same index. Keep structured data valid for rich results.",
    },
  ],

  sources: [
    {
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
    },
    {
      title: "Google's user-triggered fetchers (Google-Agent, Google-GeminiNotebook)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers",
    },
    {
      title: "Verifying Google's crawlers and fetchers",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests",
    },
    {
      title: "View related sources from Gemini Apps",
      publisher: "Gemini Apps Help",
      href: "https://support.google.com/gemini/answer/14143489",
    },
    {
      title: "Regenerate or modify responses from Gemini Apps",
      publisher: "Gemini Apps Help",
      href: "https://support.google.com/gemini/answer/14262426",
    },
    {
      title: "Grounding with Google Search",
      publisher: "Gemini API",
      href: "https://ai.google.dev/gemini-api/docs/google-search",
    },
    {
      title: "URL context",
      publisher: "Gemini API",
      href: "https://ai.google.dev/gemini-api/docs/url-context",
    },
    {
      title: "Grounding with Google Maps",
      publisher: "Gemini API",
      href: "https://ai.google.dev/gemini-api/docs/maps-grounding",
    },
    {
      title: "Search generative AI control",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/16908024",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "What's new in Google Analytics: AI Assistant traffic (13 May 2026)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9164320",
    },
    {
      title: "The Gemini app passes 1 billion monthly users",
      publisher: "Google",
      href: "https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/",
    },
    {
      title: "Alphabet Q2 2026 earnings remarks",
      publisher: "Alphabet",
      href: "https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/",
    },
    {
      title: "Gemini Deep Research",
      publisher: "Google",
      href: "https://gemini.google/overview/deep-research/",
    },
    {
      title: "The new era of browsing: putting Gemini to work in Chrome",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/chrome/gemini-3-auto-browse/",
    },
    {
      title: "Gemini in Chrome with auto browse comes to Android",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/chrome/bringing-chrome-ai-to-android/",
    },
    {
      title: "NotebookLM is now Gemini Notebook",
      publisher: "Google Workspace Updates",
      href: "https://workspaceupdates.googleblog.com/2026/07/notebooklm-now-gemini-notebook.html",
    },
    {
      title: "About the Universal Commerce Protocol and UCP-powered checkout",
      publisher: "Merchant Center Help",
      href: "https://support.google.com/merchants/answer/16837055",
    },
    {
      title: "Build agent-friendly websites",
      publisher: "web.dev",
      href: "https://web.dev/articles/ai-agent-site-ux",
    },
    {
      title: "Managed robots.txt",
      publisher: "Cloudflare Docs",
      href: "https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/",
    },
    {
      title: "Joint statement from Google and Apple",
      publisher: "Google",
      href: "https://blog.google/company-news/inside-google/company-announcements/joint-statement-google-apple/",
    },
    {
      title: "AI citation rates by industry 2026: a 1,200-prompt study",
      publisher: "Attrifast",
      href: "https://attrifast.com/blog/ai-search-citations-by-vertical-2026",
    },
    {
      title: "ChatGPT vs Gemini: sources and citations compared",
      publisher: "Archipel",
      href: "https://www.archipelmarketing.com/en/observatory/comparisons/chatgpt-vs-gemini",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      title: "The most-cited domains in Gemini",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/most-cited-domains-gemini/",
    },
    {
      title: "AI search overlap with Google's top 10",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "Same brands, different sources",
      publisher: "BrightEdge",
      href: "https://www.brightedge.com/resources/weekly-ai-search-insights/ai-search-same-brands-different-sources",
    },
    {
      title: "Gemini becomes the second-largest AI referral source",
      publisher: "BrightEdge",
      href: "https://www.brightedge.com/news/press-releases/brightedge-data-gemini-second-largest-ai-referral-source-q1-2026",
    },
    {
      title: "Gemini Spark can now use Chrome to auto browse",
      publisher: "9to5Google",
      href: "https://9to5google.com/2026/07/30/gemini-spark-chrome-auto-browse/",
    },
    {
      title: "Google Gemini adds UTM parameters for referral attribution",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/google-gemini-adds-utm-parameters-for-referral-attribution/591754/",
    },
  ],

  sameAs: ["https://en.wikipedia.org/wiki/Google_Gemini", "https://gemini.google.com"],

  furtherReading: [
    {
      title: "Google AI Overviews & AI Mode SEO guide",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Same index, different switches: the eligibility controls, snippet rules and Search Console reporting for Google's AI in Search.",
    },
    {
      title: "Free AI robots.txt generator",
      href: "/tools/ai-robots-txt-generator",
      description:
        "Make a deliberate call on Google-Extended, and every other AI token, without touching Googlebot.",
    },
    {
      title: "AI crawler log analyzer",
      href: "/tools/ai-crawler-log-analyzer",
      description:
        "See which Google fetchers and agents actually hit your pages, separated from Googlebot.",
    },
  ],
};
