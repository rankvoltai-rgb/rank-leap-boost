import type { EngineGuide } from "../types";

/*
 * Facts verified against Google's own documentation, the Search Central blog,
 * Search Console Help and the studies cited below on 2026-10-26.
 *
 * The figure at the top of the page reads three things from here: `preview`
 * (the results page and its AI Overview), and the first list in the
 * "query-fan-out" section (the sub-queries, in the same order as
 * `preview.sources`). Keep those two in step if either changes.
 */
export const googleAiOverviews: EngineGuide = {
  slug: "google-ai-overviews",
  metaTitle: "Google AI Overviews & AI Mode SEO: How Pages Get Cited (2026)",
  metaDescription:
    "How Google AI Overviews and AI Mode choose sources: query fan-out, the three eligibility switches, every opt-out control, the 2026 citation data and Search Console's AI report.",
  keywords: [
    "AI Overviews SEO",
    "AI Mode SEO",
    "how to appear in Google AI Overviews",
    "Google AI Overviews optimization",
    "query fan-out",
    "Search generative AI control",
  ],
  headline: { lead: "Google AI Overviews & AI Mode SEO:", accent: "how a page earns the link" },
  subhead:
    "Google grounds both features in its own Search index and fans every question out into related searches. Here is how that decides who gets cited, the switches that make a page eligible, the controls that take it out, and what Search Console now reports.",

  shortAnswer:
    "Google AI Overviews and AI Mode cite pages from Google's own Search index, so the bar is ordinary SEO plus three switches: the page is indexed, it is allowed a snippet, and the site is set to **Include** under Search Console → Settings → Search generative AI. `Google-Extended` controls neither feature. Because Google fans each question out into related searches, pages that win a sub-question get cited too: in Ahrefs' March 2026 data only 37.9% of cited pages ranked in the top 10 for the query that was typed.",

  takeaways: [
    'Both features are built on Google Search: no separate AI crawler, no special file, no AI-only schema. Google\'s own guide calls the work "still SEO."',
    "Eligibility comes down to three switches: indexed, snippet-eligible, and **Include** in Search Console's Search generative AI setting.",
    "`Google-Extended` governs Gemini training and grounding in the Gemini app and Vertex AI. It does not remove you from AI Overviews or AI Mode.",
    "Fan-out spreads citations beyond the typed query: Ahrefs found 37.9% of cited pages in its top 10 in March 2026, against 76.1% in July 2025.",
    "AI Overviews and AI Mode cited the same URL only 13.7% of the time in Ahrefs' 540,000-pair study, so win subtopics rather than chase one slot.",
    "Search Console's Generative AI report counts impressions only. Clicks stay blended into the Web performance report and GA4's Organic Search.",
  ],

  facts: [
    { label: "AI Overviews monthly users (May 2026)", value: "2.5B+" },
    { label: "Cited pages in the typed query's top 10 (Ahrefs, Mar 2026)", value: "37.9%" },
    { label: "Crawler that governs both", value: "Googlebot", mono: true },
    { label: "Search Console's AI report shows", value: "Impressions only" },
  ],

  preview: {
    prompt: "how to fix a lawn that's full of weeds",
    status: "AI Overview",
    answer:
      "Clear the weeds you have, then fix what let them in: hand-pull or spot-treat, mow higher, water deeply but less often, and overseed thin patches in early autumn so grass crowds weeds out. A step-by-step from **Fescuely** covers clearing clover and dandelions without chemicals.",
    sources: [
      { domain: "fescuely.com", title: "How to get rid of lawn weeds without chemicals" },
      { domain: "sodfolio.org", title: "Selective lawn herbicides compared: what kills what" },
      { domain: "thatchtalk.net", title: "Overseeded in September, barely a weed by spring" },
    ],
  },

  profile: {
    retrieval: "Google's Search index via core ranking, widened by query fan-out",
    searchCrawler: "Googlebot",
    trainingCrawler: "Google-Extended (a token) — no effect on AI Overviews or AI Mode",
    rendersJs: "Yes — Google renders JavaScript that isn't blocked",
    referrer: "google.com in Organic Search; GA4's AI Assistant channel excludes it",
    citationStyle: "Inline links beside claims, link cards, an 'Explore new angles' list",
    biggestLever: "Be the best page for a sub-question Google fans out to",
  },

  sections: [
    {
      id: "two-surfaces",
      title: "AI Overviews and AI Mode: two surfaces, one index",
      blocks: [
        {
          kind: "p",
          text: 'An **AI Overview** is a generated summary at the top of an ordinary results page. Google shows one "only when our systems determine that it is additive to classic Search," so many queries never get one. **AI Mode** is the conversational mode you open on purpose, or reach by asking a follow-up from an Overview: since [27 January 2026](https://blog.google/products-and-platforms/products/search/ai-mode-ai-overviews-updates/) that hand-off works globally on mobile, with the Overview\'s context carried into the chat.',
        },
        {
          kind: "p",
          text: "They share everything a site owner controls — eligibility, the opt-out and the reporting — and differ in almost everything a site owner sees.",
        },
        {
          kind: "table",
          head: ["", "AI Overviews", "AI Mode"],
          rows: [
            [
              "**When it appears**",
              'Above the classic results, only when judged "additive"',
              "When the user opens it, or asks a follow-up from an Overview",
            ],
            [
              "**Default model (as last announced)**",
              "Gemini 3, from January 2026",
              "Gemini 3.5 Flash, from I/O in May 2026",
            ],
            [
              "**Answer size**",
              "Short; 1.3 brands or people named on average",
              "About 4× longer; 3.3 brands or people named",
            ],
            ["**Answers with no citation**", "11%", "3%"],
            [
              "**Eligibility and opt-out**",
              "Indexed, snippet-eligible, set to Include",
              "The same three switches",
            ],
            [
              "**Search Console position**",
              "The whole Overview takes one position",
              "Counted like a results page; each follow-up is a new query",
            ],
          ],
        },
        {
          kind: "p",
          text: "The answer-size and citation rows come from [Ahrefs' comparison of 540,000 query pairs](https://ahrefs.com/blog/ai-overviews-vs-ai-mode/) (US data, September 2025). Its headline finding is the one that matters for planning: the two features' answers were 86% similar in meaning on average, yet they **cited the same URLs only 13.7% of the time**. Google says as much — the two \"may use different models and techniques, so the set of responses and links they show will vary.\" You can't optimise for one slot in one feature; you win by being a strong source across the subtopics both of them search.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "2.5B+",
              label: "monthly active users of AI Overviews, announced at Google I/O on 19 May 2026",
              source: {
                name: "Google, May 2026",
                href: "https://blog.google/innovation-and-ai/sundar-pichai-io-2026/",
              },
            },
            {
              value: "1B+",
              label:
                "monthly users of AI Mode, where queries have more than doubled every quarter since launch",
              source: {
                name: "Google, May 2026",
                href: "https://blog.google/products-and-platforms/products/search/search-io-2026/",
              },
            },
            {
              value: "13.7%",
              label: "of query pairs where AI Mode and AI Overviews cited the same URLs",
              source: {
                name: "Ahrefs, Dec 2025",
                href: "https://ahrefs.com/blog/ai-overviews-vs-ai-mode/",
              },
            },
          ],
        },
      ],
    },
    {
      id: "query-fan-out",
      title: "Query fan-out: the typed query is only the first search",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s [guide to optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), added on 15 May 2026, names the two techniques behind both features. **Retrieval-augmented generation** ("also known as grounding") uses Google\'s "core Search ranking systems to retrieve relevant, up-to-date web pages from our Search index." **Query fan-out** is "a set of concurrent, related queries generated by the model to request more information."',
        },
        {
          kind: "p",
          text: "Google's own example: for `how to fix a lawn that's full of weeds`, the fan-out queries might include these three. Each is a separate search with its own winners, and any of them can put a link in the answer — which is what the figure at the top of this page shows.",
        },
        {
          kind: "list",
          items: [
            "`remove weeds without chemicals`",
            "`best herbicides for lawns`",
            "`how to prevent weeds in lawn`",
          ],
        },
        {
          kind: "pipeline",
          steps: [
            {
              title: "Google decides whether an AI answer is worth showing",
              body: "Overviews are reserved for queries where Google thinks they add something. Question-shaped and longer queries trigger far more often: in Pew's March 2025 browsing data, 60% of searches starting with who, what, when or why produced a summary, against 8% of one- or two-word searches and 53% of searches of ten words or more.",
              lever:
                "Aim at the longer, question-shaped searches your buyers actually make. Short head terms rarely trigger an Overview.",
            },
            {
              title: "The model fans the question out",
              body: "It issues several related searches at once, across subtopics and data sources. Google says this lets it surface a wider set of links than a classic results page would.",
              lever:
                "Cover the sub-questions around your topic in depth — in one strong page or a tight, linked cluster.",
            },
            {
              title: "Core ranking answers each sub-query",
              body: "Every fan-out search is answered from the Search index by the normal ranking and quality systems. Pages that aren't indexed, or can't show a snippet, never enter the pool.",
              lever: "Pass the three switches in the next section.",
            },
            {
              title: "Gemini writes an answer grounded in those pages",
              body: "Google made Gemini 3 the default model for AI Overviews in January 2026, and Gemini 3.5 Flash the default for AI Mode at I/O in May 2026.",
              lever:
                "Give it passages worth grounding a claim on: specific, first-hand, and clearly attributable to you.",
            },
            {
              title: "Links attach to the claims they support",
              body: 'Since May 2026, links sit inline beside the text they back, show the site name or page title on hover (desktop), and many answers end with an "Explore new angles" list of in-depth articles. In October 2026 Google said it was showing inline links higher, adding thumbnails to related-article links, and testing a block of official sites at the top of some answers.',
            },
          ],
        },
        {
          kind: "h3",
          text: "What the citation studies show",
        },
        {
          kind: "table",
          head: ["Study", "Sample", "Where cited pages ranked for the typed query"],
          rows: [
            [
              "[Ahrefs, Jul 2025](https://ahrefs.com/blog/search-rankings-ai-citations)",
              "1.9M citations from 1M AI Overviews (the 3 most visible per answer)",
              "76.1% top 10 · 9.5% positions 11–100 · 14.4% beyond 100",
            ],
            [
              "[BrightEdge, Sep 2025](https://www.brightedge.com/resources/weekly-ai-search-insights/rank-overlap-after-16-months-of-aio)",
              "9 industries, May 2024 – Sep 2025",
              "54.5% ranked organically at all; 16.7% in the top 10",
            ],
            [
              "[Ahrefs, Mar 2026](https://ahrefs.com/blog/ai-overview-citations-top-10/)",
              "863K keyword SERPs, 4M cited URLs",
              "37.9% top 10 · 31.2% positions 11–100 · 31.0% beyond 100",
            ],
          ],
        },
        {
          kind: "p",
          text: "Read these as a direction, not one true number. The methods differ: Ahrefs' 2025 run counted only the three most visible citations per answer, and Ahrefs says its 2026 parser detects more citations, so the two runs aren't strictly comparable. Ahrefs' explanation, which it hedges, is more aggressive fan-out after Gemini 3 took over AI Overviews; Google hasn't confirmed any change. What every study agrees on is that ranking for the typed query is one way in, not the only one.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Fan-out is not a licence for doorway pages",
          text: 'Google\'s guide says content made "primarily to manipulate rankings or generative AI responses" breaks its scaled content abuse policy, and since 15 May 2026 the [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) name "attempting to manipulate generative AI responses in Google Search" outright. One thin page per fan-out variant is exactly what that describes. Build depth instead.',
        },
      ],
    },
    {
      id: "citable-switches",
      title: "The three switches that make a page citable",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s [AI features documentation](https://developers.google.com/search/docs/appearance/ai-features) sets the bar: a page must be "indexed and eligible to be shown in Google Search with a snippet," and "there are no additional technical requirements." The 2026 optimization guide adds one more: "a site must be included in Search generative AI features in Search Console." Include is the default, but owners can change it per property, so check rather than assume.',
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Indexed",
              status: "required",
              note: "Confirm with URL Inspection in Search Console. A page Google hasn't indexed can't be retrieved for any fan-out query, and indexing \"isn't guaranteed,\" so internal links and sitemaps still do work here.",
            },
            {
              label: "Snippet-eligible",
              status: "required",
              note: 'No `nosnippet`, and no `max-snippet` value so small it starves the model. Google\'s robots meta spec says both limit what may be used as "direct input for AI Overviews and AI Mode." Google also honours robots meta tags placed in the body, so a stray tag injected by a plugin counts.',
            },
            {
              label: "Search generative AI: Include",
              status: "required",
              note: 'Search Console → Settings → Search generative AI. Child properties follow their parent by default but can override it, and owners can switch it. Excluded sites "won\'t receive any traffic or impressions from these features."',
            },
            {
              label: "Crawlable end to end",
              status: "required",
              note: 'Google asks you to make sure crawling is allowed "in robots.txt, and by any CDN or hosting infrastructure." A bot-management rule that challenges Googlebot takes you out of Search and its AI features together.',
            },
            {
              label: "Content inside the first 2 MB",
              status: "required",
              note: "Googlebot crawls the first 2 MB of each HTML, CSS or JavaScript file (uncompressed) and indexes only what it fetched; PDFs get 64 MB. Keep the main content early and avoid inlining huge scripts or images.",
            },
            {
              label: "JavaScript that renders",
              status: "helps",
              note: "Google renders JavaScript that isn't blocked. Check the rendered HTML in URL Inspection; server-rendered text remains the safest choice.",
            },
          ],
        },
        {
          kind: "h3",
          text: "A two-minute eligibility check",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "Open **Search Console → Settings → Search generative AI** on every property you own, including URL-prefix properties that may override the domain property, and read the value.",
            "Run **URL Inspection → Test live URL** on a key page. You want indexing allowed and a successful page fetch.",
            "In the source and the rendered HTML, search for `nosnippet`, `max-snippet`, `data-nosnippet` and `noindex`, and account for each one.",
            "Check your CDN or firewall logs for challenges or blocks served to verified Googlebot, not just your robots.txt.",
          ],
        },
      ],
    },
    {
      id: "opt-out-levers",
      title: "Every control, and what else it switches off",
      blocks: [
        {
          kind: "p",
          text: "There is no separate AI crawler for Google Search. Google's documentation says robots.txt rules for Googlebot are the control for crawling, for Search and its AI features alike. The token most people reach for, `Google-Extended`, does something else: per Google's [crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) it governs training of future Gemini models and grounding in the Gemini app and Vertex AI, it \"does not impact a site's inclusion in Google Search,\" and it has no user agent of its own.",
        },
        {
          kind: "table",
          head: ["Control", "AI Overviews & AI Mode", "Classic results", "Gemini training"],
          rows: [
            [
              "Search Console → Search generative AI: **Exclude**",
              "Out within 1–2 days (Discover's AI features too)",
              "Unaffected",
              "Not affected — Google points to `Google-Extended`",
            ],
            ["`nosnippet`", "Not used as direct input", "No snippet anywhere", "Not its job"],
            [
              "`max-snippet:[n]`",
              "Direct input capped at n characters",
              "Snippet capped",
              "Not its job",
            ],
            [
              "`data-nosnippet` on an element",
              "That passage left out",
              "That passage left out",
              "Not its job",
            ],
            ["`noindex`", "Gone", "Gone", "Not its job"],
            ["`Google-Extended` disallowed", "**No effect**", "No effect", "Opted out"],
            [
              "`Googlebot` disallowed",
              "Not eligible: no crawl, no snippet",
              "Content can't be crawled; at best a bare URL",
              "Not its job",
            ],
          ],
        },
        {
          kind: "p",
          text: "So a robots.txt that opts out of Gemini training while staying fully eligible for AI Overviews and AI Mode looks like this:",
        },
        {
          kind: "code",
          lang: "robots.txt",
          code: "# Google Search, including AI Overviews and AI Mode. Never block this.\nUser-agent: Googlebot\nAllow: /\n\n# Optional: opt out of Gemini training and Gemini-app / Vertex AI grounding.\n# No effect on AI Overviews or AI Mode.\nUser-agent: Google-Extended\nDisallow: /",
        },
        {
          kind: "p",
          text: 'The [Search Console control](https://support.google.com/webmasters/answer/16908024), live for all sites worldwide since 31 August 2026, is the only lever built for this job. It works per property — domain, subdomain or URL-prefix, so a URL-prefix property can carve out a folder — and Google says content is excluded "within 1-2 days," though caching can stretch that. It "isn\'t used as a ranking or inclusion signal affecting other parts of Search," doesn\'t override Merchant Center or Ads participation, and doesn\'t stop Google using your pages to "power Google Search as a whole," such as understanding queries.',
        },
        {
          kind: "p",
          text: "To keep a single passage out of AI answers without losing the page — a price you don't want quoted out of context, say — wrap it in `data-nosnippet`:",
        },
        {
          kind: "code",
          lang: "html",
          code: "<p>Plans start at $29 a month.</p>\n<div data-nosnippet>\n  Enterprise pricing is agreed per contract.\n</div>",
        },
        {
          kind: "callout",
          tone: "note",
          title: "In the UK, finer controls are on the way",
          text: 'On 3 June 2026 the [Competition and Markets Authority](https://www.gov.uk/government/news/cma-secures-fairer-deal-for-publishers-and-improves-google-search-services-in-uk) required Google to give publishers "effective tools to prevent their content being used to power AI features in search," an opt-out from fine-tuning, and clear attribution links, with nine months to comply. Google hasn\'t documented page-level mechanics yet.',
        },
      ],
    },
    {
      id: "earning-the-card",
      title: "What earns the link card once you're eligible",
      blocks: [
        {
          kind: "p",
          text: "Eligibility gets a page into the pool. Being chosen is ranking and quality — applied not just to the typed query but to every search Google fans out to. These are the signals worth working on, with how sure anyone can be about each.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Core ranking, applied per sub-query",
              body: "Grounding runs on the same ranking and quality systems as Search, so helpful, reliable, people-first content and E-E-A-T apply unchanged — once for each fan-out search.",
              evidence: "official",
            },
            {
              title: "Non-commodity, first-hand content",
              body: 'Google contrasts "7 Tips for First-Time Homebuyers" with "Why We Waived the Inspection & Saved Money: A Look Inside the Sewer Line." Experience and original material are what a generic answer can\'t supply.',
              evidence: "official",
            },
            {
              title: "Owning a sub-question",
              body: "Most cited pages no longer rank top 10 for the typed query (Ahrefs, March 2026). Being the best result for one sub-question is a route in that doesn't require beating the head-term leaders.",
              evidence: "observed",
            },
            {
              title: "Video beside the text",
              body: "Google's guide recommends supporting text with high-quality images and video. In Ahrefs' March 2026 data YouTube was the most-cited domain in AI Overviews, at 5.6% of cited URLs.",
              evidence: "observed",
            },
            {
              title: "Real discussion, not manufactured mentions",
              body: 'Answers now preview "Community Perspectives" from forums and social posts, with the creator named. Google also warns that "seeking inauthentic \'mentions\' across the web isn\'t as helpful as it might seem."',
              evidence: "official",
            },
            {
              title: "Clear paragraphs and sections",
              body: "Google: people \"appreciate it when web pages are organized by paragraphs and sections,\" and there's no need to chunk text for AI. Opening each section with its direct answer is a practitioner habit Google hasn't endorsed.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "h3",
          text: "Mapping the sub-questions, step by step",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "Write down one buyer question you want to be cited for, in the words a buyer would type.",
            "List the searches Google would plausibly fan it out to. People Also Ask, related searches and AI Mode's own follow-up suggestions are good prompts.",
            "Search each sub-question in a private window and note who wins it and how strong those pages are.",
            "Pick the sub-question where the winners are weakest and you hold first-hand material — data, tests, photos, a process only you run.",
            "Build or improve the page that answers it best, and link to it from the hub page for the main question.",
          ],
        },
      ],
    },
    {
      id: "labels-and-badges",
      title: "Preferred, Subscribed, Highly Cited: labels you can earn",
      blocks: [
        {
          kind: "p",
          text: "2026 gave publishers ways to stand out in Google's AI search that don't depend on rank alone. Each label appears only for some users or some links, but each is something you can act on.",
        },
        {
          kind: "table",
          head: ["Label", "When it shows", "What you can do"],
          rows: [
            [
              "**Preferred**",
              "The user picked your site in source preferences. Shown in AI Overviews and AI Mode since 27 May 2026",
              "Ask loyal readers to add you, with Google's button or a deep link. Your site must be set to Include, at domain or subdomain level",
            ],
            [
              "**Subscribed**",
              "The user linked a news subscription to their Google account (May 2026)",
              "Join Google's subscription linking through its publisher form",
            ],
            [
              "**Highly Cited**",
              "Other stories cite your article as original reporting (May 2026)",
              "Publish reporting and data that others reference",
            ],
          ],
        },
        {
          kind: "p",
          text: "The [preferred sources guide](https://developers.google.com/search/docs/appearance/preferred-sources) documents a JavaScript button and a plain deep link. The link needs no script and works in newsletters and social posts as well as on your site:",
        },
        {
          kind: "code",
          lang: "html",
          code: '<a href="https://www.google.com/preferences/source?q=example.com">\n  Add us as a preferred source on Google\n</a>',
        },
        {
          kind: "p",
          text: "Google says people are \"twice as likely to click through\" to a Preferred Source, that more than 345,000 sources had been selected by May 2026, and in October that use had grown more than 7× since January. Those are Google's own figures. Google doesn't describe preferred sources as a ranking signal: the label shows when your page is already in the answer.",
        },
      ],
    },
    {
      id: "skip-list",
      title: "What Google says you can skip",
      blocks: [
        {
          kind: "p",
          text: "A lot of 2026 GEO advice is aimed at engines other than Google. For Google's AI features, its own guide has a mythbusting section, and the 15 June 2026 documentation update made the llms.txt answer explicit.",
        },
        {
          kind: "myths",
          items: [
            {
              myth: "You need llms.txt or a Markdown copy of your pages.",
              reality:
                'Google: "You don\'t need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search." Doing so "will neither harm nor help."',
            },
            {
              myth: "Content has to be chunked into short passages for AI.",
              reality:
                '"There\'s no requirement to break your content into tiny pieces," and there\'s "no ideal page length." Write sections that read well to people.',
            },
            {
              myth: "FAQ schema gets you into AI answers.",
              reality:
                "There's no special schema for AI features, and FAQ markup no longer earns FAQ rich results either: Google stopped showing them on 7 May 2026 and removed the documentation on 15 June. Keep structured data that matches the page for the rich results still supported.",
            },
            {
              myth: "Blocking Google-Extended keeps you out of AI Overviews.",
              reality:
                "It doesn't. Use the Search Console control, `nosnippet` or `noindex` — each with the side effects in the table above.",
            },
            {
              myth: "GEO for Google is a separate discipline with its own tricks.",
              reality:
                'Google: "optimizing for generative AI search is optimizing for the search experience, and thus still SEO." It tells site owners to prioritise effective SEO over "AEO/GEO hacks."',
            },
          ],
        },
      ],
    },
    {
      id: "click-math",
      title: "The click math: cited, uncited and no Overview",
      blocks: [
        {
          kind: "p",
          text: "For pages that aren't cited, AI Overviews cost clicks. For pages that are, they cost less. That makes earning the citation a defensive move as much as a growth one.",
        },
        {
          kind: "stats",
          items: [
            {
              value: "8% vs 15%",
              label:
                "of visits that clicked a classic result with an AI summary on the page, versus without",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
            {
              value: "−58%",
              label: "click-through for the top-ranking page when an AI Overview appears",
              source: {
                name: "Ahrefs, Feb 2026",
                href: "https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/",
              },
            },
            {
              value: "+120%",
              label:
                "organic clicks per impression for brands cited in the Overview, versus not cited",
              source: {
                name: "Seer Interactive, Apr 2026",
                href: "https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update",
              },
            },
          ],
        },
        {
          kind: "table",
          head: ["Informational query, 1M impressions", "Organic clicks"],
          rows: [
            ["No AI Overview", "≈ 33,500"],
            ["AI Overview, your brand cited", "≈ 20,700"],
            ["AI Overview, your brand not cited", "≈ 9,400"],
          ],
        },
        {
          kind: "p",
          text: "The table is Seer Interactive's 2026 update: 53 brands, 2.43 billion organic impressions, January 2025 to February 2026. Seer is explicit that it shows correlation, not cause — higher-authority brands are also more likely to be cited — and one account makes up 47% of the uncited impressions. Ahrefs' −58% is modelled from desktop Search Console data. Google, for its part, says clicks from results pages with AI Overviews are \"higher quality,\" without publishing numbers.",
        },
      ],
    },
    {
      id: "search-console-ga4",
      title: "Reading it in Search Console and GA4",
      blocks: [
        {
          kind: "p",
          text: "On 3 June 2026 Google introduced [Search generative AI performance reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports), first for a subset of sites and for all sites worldwide by 31 August. It's the first first-party view of AI visibility, with one large gap: no clicks.",
        },
        {
          kind: "table",
          head: ["Where", "What you get", "What you don't"],
          rows: [
            [
              "Search Console → **Generative AI report**",
              "Impressions in AI Overviews and AI Mode by page, country, device and date; separate text and multimodal (Lens, Circle to Search) views",
              "Clicks, CTR, position, queries",
            ],
            [
              "Search Console → **Performance → Web**",
              "Clicks and impressions, AI features included",
              "Any split between AI and classic results",
            ],
            [
              "Search Console → **Discover's AI report**",
              "Impressions in Discover's generative AI features",
              "Anything from Search",
            ],
            [
              "**GA4**",
              "Sessions and conversions from google / organic, in the Organic Search channel",
              "Which visits came from an AI answer — the AI Assistant channel excludes AI Overviews and AI Mode",
            ],
          ],
        },
        {
          kind: "list",
          items: [
            "**AI Overviews** take one position on the page, and every link inside gets that same position. A click on an external link counts as a click.",
            "**AI Mode** positions follow the normal results-page method, and each follow-up question is logged as a new query.",
            "**Impressions** in the report's chart are aggregated by property: two of your links in one answer count once. The page table counts by page.",
            "**Gaps:** Search Labs experiments aren't counted, and the report may not appear at all for sites with too few AI impressions or set to Exclude.",
          ],
        },
        {
          kind: "p",
          text: 'A workable routine: each month, list the pages gaining AI impressions and compare their Search clicks and GA4 conversions with the month before. Each week, run a fixed set of 20–30 buyer questions in a private window and note which pages Google cites — by hand, the same questions every time. Google\'s caveat applies to any tool that promises more: "No third-party tool has access to our internal ranking or AI systems."',
        },
      ],
    },
    {
      id: "products-local-agents",
      title: "Products, local businesses and agents",
      blocks: [
        {
          kind: "p",
          text: "AI answers on Google also carry product listings, product details and local business information, and those come from Google's own data sources as much as from your pages. Google's guide points to three of them.",
        },
        {
          kind: "list",
          items: [
            "**Merchant Center:** keep feeds complete — prices, availability, shipping, returns and attributes — so products can appear in AI responses and other results.",
            "**Google Business Profile:** hours, categories, photos and reviews feed local answers. Agentic booking for local experiences and services was rolling out to everyone in the US from summer 2026.",
            "**Business Agent:** Google suggests considering its conversational brand agent, depending on your business type and goals.",
            "**Agents on your site:** browser agents may read pages through screenshots, the DOM and the accessibility tree. Google links to web.dev's agent-friendly website practices and notes the emerging Universal Commerce Protocol.",
          ],
        },
      ],
    },
  ],

  checklist: [
    {
      id: "sc-include",
      title: "Read the Search generative AI setting on every property",
      detail:
        "Search Console → Settings → Search generative AI. Check domain, subdomain and URL-prefix properties, since a child can override its parent.",
      impact: "high",
    },
    {
      id: "inspect-live",
      title: "Run URL Inspection's live test on your top pages",
      detail:
        "Confirm indexing is allowed and the fetch succeeds, then fix any stray `noindex` before anything else.",
      impact: "high",
    },
    {
      id: "snippet-audit",
      title: "Account for every snippet control in your templates",
      detail:
        "Search source and rendered HTML for `nosnippet`, `max-snippet` and `data-nosnippet`, including tags a plugin injects into the body.",
      impact: "high",
    },
    {
      id: "edge-access",
      title: "Let verified Googlebot through your CDN and firewall",
      detail:
        "robots.txt isn't the only gate. Check bot-management rules and logs for challenges served to Googlebot.",
      impact: "high",
    },
    {
      id: "first-2mb",
      title: "Keep the main content rendered and inside the first 2 MB",
      detail:
        "Use URL Inspection → View crawled page. Don't block JS or CSS, and avoid inlining large scripts or images ahead of the content.",
      impact: "medium",
    },
    {
      id: "map-subquestions",
      title: "Map the sub-questions behind your top five buyer questions",
      detail: "For each, list the searches Google is likely to fan out to and who wins them today.",
      impact: "high",
    },
    {
      id: "own-one",
      title: "Pick one sub-question you can win outright, and build that page",
      detail:
        "Choose where the current winners are weakest and you hold first-hand material. Link it from the hub page.",
      impact: "high",
    },
    {
      id: "first-hand",
      title: "Add evidence a generic answer can't supply",
      detail:
        "Original data, tests, photos, worked examples and named expertise, on the pages you most want cited.",
      impact: "high",
    },
    {
      id: "video",
      title: "Pair key pages with a short original video",
      detail:
        "YouTube is the most-cited domain in AI Overviews in Ahrefs' 2026 data; a video can give you a second way into the answer.",
      impact: "medium",
    },
    {
      id: "preferred-source",
      title: "Add a preferred-source link where loyal readers see it",
      detail:
        "Use Google's button or the `google.com/preferences/source?q=` deep link in your footer, newsletter and social profiles.",
      impact: "medium",
    },
    {
      id: "structured-data",
      title: "Stop maintaining FAQ markup for rich results",
      detail:
        "FAQ rich results ended on 7 May 2026. Keep structured data that matches the visible page and still earns a supported rich result.",
      impact: "low",
    },
    {
      id: "commerce-local",
      title: "Commerce or local: keep Merchant Center and Business Profile complete",
      detail:
        "Prices, availability, shipping, returns, hours and categories feed AI answers directly.",
      impact: "medium",
    },
    {
      id: "measure",
      title: "Set a monthly report read and a weekly question check",
      detail:
        "Monthly: pages gaining AI impressions against their clicks and conversions. Weekly: the same 20–30 buyer questions, checked by hand.",
      impact: "high",
    },
  ],

  faqs: [
    {
      q: "Why does my page rank first but not appear in the AI Overview?",
      a: "Ranking for the typed query is one route in, not a guarantee. The Overview is built from several fan-out searches, so pages that win a sub-question compete for the same few links; in Ahrefs' March 2026 data only 37.9% of cited pages ranked top 10 for the typed query. Also check that the page has no `nosnippet` or tight `max-snippet`, and remember Google shows Overviews only when it judges them useful, and changes the cited links between answers.",
    },
    {
      q: "How long does the Search Console opt-out take, and does it hurt my rankings?",
      a: "Google says content is excluded within 1–2 days of switching to Exclude, though caching can delay some pages. The setting isn't used as a ranking or inclusion signal for the rest of Search, so classic results are unaffected; you simply stop receiving impressions and traffic from AI Overviews, AI Mode and Discover's AI features.",
    },
    {
      q: "Does nosnippet remove a page from AI Overviews and AI Mode?",
      a: "It stops the page being used as direct input for both, according to Google's robots meta specification. The catch is that it also removes your snippet from every other kind of result. To leave AI features while keeping normal snippets, use the Search Console control; to protect one passage, use `data-nosnippet`.",
    },
    {
      q: "What does Google-Extended actually control?",
      a: "Whether content Google crawls may be used to train future Gemini models and to ground answers in the Gemini app and Vertex AI. It's a robots.txt token with no user agent of its own, and Google states it doesn't affect inclusion or ranking in Google Search, which covers AI Overviews and AI Mode.",
    },
    {
      q: "Can I see which queries triggered my AI Overview impressions?",
      a: "Not in the Generative AI report: it breaks impressions down by page, country, device and date, with no query dimension and no clicks. Query-level data still exists in the main Performance report, but there AI features are blended with classic results.",
    },
    {
      q: "Is FAQ schema still worth adding for Google's AI answers?",
      a: "Not for Google. FAQ rich results stopped appearing on 7 May 2026, and Google says no special schema is needed for its AI features. FAQPage is still valid schema.org, so existing markup does no harm. Write questions and answers on the page because they help readers.",
    },
    {
      q: "Does GA4 separate AI Mode visits from ordinary Google search?",
      a: "No. Clicks from AI Overviews and AI Mode arrive as google / organic in the Organic Search channel. GA4's AI Assistant channel covers assistants such as ChatGPT, Gemini, DeepSeek, Copilot and Grok, and explicitly excludes Google's AI Overviews and AI Mode.",
    },
    {
      q: "Should I publish a page for every query Google fans out to?",
      a: "No. Google's guide calls content created primarily to manipulate generative AI responses scaled content abuse, and its spam policies cover attempts to manipulate those responses. Cover sub-questions in depth, in a strong page or a small linked cluster, and add first-hand material.",
    },
  ],

  sources: [
    {
      title: "Google's guide to optimizing for generative AI features on Google Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Search generative AI control",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/16908024",
    },
    {
      title: "Generative AI performance report (Search)",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/16984139",
    },
    {
      title: "Introducing Search Generative AI performance reports in Search Console",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports",
    },
    {
      title: "What are impressions, position, and clicks?",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7042828",
    },
    {
      title: "Robots meta tag, data-nosnippet and X-Robots-Tag specifications",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag",
    },
    {
      title: "Control the content you share on Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/control-what-you-share",
    },
    {
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google Crawling Infrastructure",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
    },
    {
      title: "What is Googlebot (file size limits)",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/googlebot",
    },
    {
      title: "Spam policies for Google web search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/essentials/spam-policies",
    },
    {
      title: "Latest Google Search documentation updates (FAQ rich result deprecation, llms.txt)",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/updates",
    },
    {
      title: "Guide to preferred sources in Google Search for web publishers",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/preferred-sources",
    },
    {
      title: "Default channel group (AI Assistant channel)",
      publisher: "Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "New opportunities, control and insights for website owners",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/new-opportunities-control-and-insights-for-website-owners/",
    },
    {
      title: "New ways to find your favorite sources and original content in AI Search",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/original-high-quality-content-search/",
    },
    {
      title: "How AI Mode and AI Overviews help you explore the web",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/",
    },
    {
      title: "AI Mode and AI Overviews updates to explore the web",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/updates-ai-mode-overviews-explore-web/",
    },
    {
      title: "AI Mode in Google Search and AI Overviews get Gemini upgrades",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/ai-mode-ai-overviews-updates/",
    },
    {
      title: "Google Search's I/O 2026 updates",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/search-io-2026/",
    },
    {
      title: "Sundar Pichai's I/O 2026 keynote",
      publisher: "Google",
      href: "https://blog.google/innovation-and-ai/sundar-pichai-io-2026/",
    },
    {
      title: "CMA secures fairer deal for publishers and improves Google Search services in UK",
      publisher: "UK Competition and Markets Authority",
      href: "https://www.gov.uk/government/news/cma-secures-fairer-deal-for-publishers-and-improves-google-search-services-in-uk",
    },
    {
      title: "Update: 38% of AI Overview citations pull from the top 10",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title: "76% of AI Overview citations pull from the top 10",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/search-rankings-ai-citations",
    },
    {
      title: "Are AI Mode and AI Overviews just different versions of the same answer?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overviews-vs-ai-mode/",
    },
    {
      title: "Update: AI Overviews reduce clicks by 58%",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/",
    },
    {
      title: "AI Overview citations now 54% from organic rankings",
      publisher: "BrightEdge",
      href: "https://www.brightedge.com/resources/weekly-ai-search-insights/rank-overlap-after-16-months-of-aio",
    },
    {
      title: "AIO impact on Google CTR: 2026 update",
      publisher: "Seer Interactive",
      href: "https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update",
    },
    {
      title:
        "Google users are less likely to click on links when an AI summary appears in the results",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
  ],

  sameAs: [],

  furtherReading: [
    {
      title: "How to show up in Google AI Overviews: the 2026 playbook",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description:
        "The content side in depth: picking questions, writing passages worth citing, and keeping pages current.",
    },
    {
      title: "Query fan-out, defined",
      href: "/glossary/query-fan-out",
      description: "The glossary entry for the mechanism behind most of this guide.",
    },
    {
      title: "The Gemini guide",
      href: "/ai-seo/gemini",
      description:
        "Where Google-Extended does apply: getting grounded into answers in the Gemini app.",
    },
    {
      title: "Answer-Space Research",
      href: "/features/answer-space-research",
      description:
        "How Rankbox maps the questions buyers ask Google and AI assistants, before it writes for them.",
    },
  ],
};
