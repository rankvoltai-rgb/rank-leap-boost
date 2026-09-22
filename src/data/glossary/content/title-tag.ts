import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "title-tag",
  metaTitle: "What Is a Title Tag? Length, Rewrites and AI Search Matching",
  metaDescription:
    "A title tag names a page for search results and AI retrieval. Why and how often Google rewrites titles, the lengths that survive, and how to title for AI answers.",
  keywords: [
    "title tag",
    "SEO title",
    "page title",
    "title tag length",
    "what is a title tag",
    "why does Google rewrite my title",
  ],

  whyItMatters:
    "The title tag is the one line that works everywhere your buyers look: Google's results, browser tabs and the result lists AI engines scan before deciding which pages to read. For a small team up against bigger brands, a specific, honest title that names the question a buyer is asking is often the cheapest improvement available, with no new content or links required. Get it wrong and Google rewrites it for you, while an AI engine may pass over your page for one whose title says exactly what it answers.",

  questions: [
    {
      id: "why-rewritten",
      question: "Why does Google rewrite title tags?",
      answer:
        "Google rewrites title tags when it judges the tag a poor description of the page — too long or too short, stuffed with keywords, repeated across pages, out of date or at odds with the main heading — and builds the displayed title link from other text instead.",
      blocks: [
        {
          kind: "p",
          text: "Google's [title link documentation](https://developers.google.com/search/docs/appearance/title-link) says the process is \"completely automated and takes into account both the content of a page and references to it that appear on the web.\" Besides the `<title>` element, it draws on the page's main visual title, headings such as the H1, `og:title`, other prominent text, anchor text in links to the page, and `WebSite` structured data.",
        },
        {
          kind: "table",
          head: ["Trigger", "Example"],
          rows: [
            ["**Half-empty title**", "“Home” or a bare brand name with nothing about the page"],
            ["**Obsolete title**", "“Best CRM tools 2024” on a page updated for 2026"],
            ["**Boilerplate**", "The same pattern on every page, or on a whole section"],
            ["**Keyword stuffing**", "“CRM Software | Best CRM | CRM Tools | Free CRM”"],
            ["**No clear main title**", "Several equally large headings, none matching the tag"],
            [
              "**Brackets and pipes**",
              "Zyppy saw 77.6% of titles with [brackets] rewritten and pipes removed or replaced 41.0% of the time",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "AI-written headlines are being tested",
          text: 'In March 2026 Google confirmed a "small and narrow" test of AI-rewritten headlines in regular search results, aimed at finding "content on a page that would be a useful and relevant title to a users\' query," per [Search Engine Journal](https://www.searchenginejournal.com/google-ai-headlines-in-search/570208/). The same idea in Discover went from experiment to feature in about a month.',
        },
      ],
    },
    {
      id: "how-often",
      question: "How often does Google rewrite title tags?",
      answer:
        "How often Google rewrites title tags depends on who's counting: Google said in 2021 it uses the title element about 87% of the time, while independent studies that count any change found rates from 33% (Ahrefs, 2021) to 61.6% (Zyppy, 2022) and 76% in early 2025.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "87%",
              label: "of the time, Google says, the HTML title element is used as the title link",
              source: {
                name: "Google, Sep 2021",
                href: "https://developers.google.com/search/blog/2021/09/more-info-about-titles",
              },
            },
            {
              value: "61.6%",
              label: "of 80,959 titles across 2,370 sites were rewritten on desktop",
              source: {
                name: "Zyppy, Q1 2022",
                href: "https://zyppy.com/seo/google-title-rewrite-study/",
              },
            },
            {
              value: "76%",
              label: "of title tags were changed in John McAlpin's study of thousands of keywords",
              source: {
                name: "Search Engine Land, Q1 2025",
                href: "https://searchengineland.com/google-changed-76-of-title-tags-in-q1-2025-heres-what-that-means-454847",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "The gap is mostly method. Google counts titles used substantially as written; the studies count any edit, including a trimmed brand name or a swapped separator, and Zyppy notes many rewrites are minor. When Google replaces a title outright, Ahrefs found it pulls from the H1 50.76% of the time — which is why keeping the title and H1 in agreement is one of the best defenses against a rewrite.",
        },
      ],
    },
    {
      id: "length",
      question: "How long should a title tag be?",
      answer:
        "A title tag has no length limit in Google, but titles are cut to fit the screen — roughly 600 pixels on desktop — and in Zyppy's study titles of 51–60 characters were rewritten least, while titles over 70 characters were rewritten 99.9% of the time.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s wording: "While there\'s no limit on how long a `<title>` element can be, the title link is truncated in Google Search results as needed, typically to fit the device width." Zyppy puts the desktop limit at about 600 pixels, "often a bit more for mobile results," and Ahrefs found titles wider than 600 pixels rewritten 46.12% of the time.',
        },
        {
          kind: "p",
          text: "Short titles aren't safe either: Zyppy saw titles of five characters or fewer rewritten 96.6% of the time, usually by adding words. The full length bands are in the benchmark below. Characters are a proxy for pixels, so a title full of wide letters can clip early; preview it with the [SERP snippet preview](/tools/serp-snippet-preview) alongside your [meta description](/glossary/meta-description).",
        },
      ],
    },
    {
      id: "ai-search",
      question: "How should you write title tags for AI search?",
      answer:
        "Write title tags for AI search as a plain statement of what the page answers: Ahrefs found titles of pages ChatGPT cited were closer to the prompt than those it skipped, and Microsoft says titles should use natural language that aligns with search intent.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Titles that match the question get cited",
              body: "In [Ahrefs' study](https://ahrefs.com/blog/why-chatgpt-cites-pages/) of ChatGPT retrieval, prompt-to-title similarity averaged 0.602 for cited pages against 0.484 for uncited ones, the best [fan-out](/glossary/query-fan-out) sub-query match reached 0.656, and natural-language URL slugs had an 89.78% citation rate against 81.11%.",
              evidence: "observed",
            },
            {
              title: "Natural language, echoed by the H1",
              body: 'Microsoft\'s [October 2025 guidance](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers) says titles "should clearly summarize what the content delivers, using natural language that aligns with search intent," and the H1 should "match (or closely reflect) the page title."',
              evidence: "official",
            },
            {
              title: "The title is what the model sees first",
              body: "Claude's [web search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) returns each result as a URL, a title and a page age before Claude decides which pages to fetch.",
              evidence: "official",
            },
            {
              title: "An honest year helps where freshness matters",
              body: "[Profound](https://www.joshblyskal.com/research/state-of-aeo-2026) found 94% of Claude's search sub-queries include the current year. Add the year only when the page is genuinely current; Google treats a stale one as a reason to rewrite. See [content freshness](/glossary/content-freshness).",
              evidence: "observed",
            },
          ],
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with title tags",
      answer:
        "The most common title tag mistakes are repeating a keyword or a boilerplate pattern across pages, letting the title and H1 drift apart, leaving an outdated year in place, and writing a clever headline instead of the plain question a buyer actually searches.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Repeating the keyword makes a title stronger.",
              reality:
                "Google lists keyword stuffing among title practices to avoid, and Zyppy found using the same keyword more than once among the common rewrite triggers.",
            },
            {
              myth: "The title and H1 should differ to cover more keywords.",
              reality:
                "Matching them cuts rewrites. Where both contained a number, Zyppy saw Google keep a number in the displayed title 97.3% of the time.",
            },
            {
              myth: "Brackets make a title stand out.",
              reality:
                "Google deleted the bracketed text 32.9% of the time in Zyppy's data, against 19.7% for text in parentheses. Use parentheses if you need emphasis.",
            },
            {
              myth: "A clever headline beats a plain one.",
              reality:
                "Search engines and AI retrieval match titles to what people ask. Describe the page's topic and the question it answers, then add your angle; a matching [search intent](/glossary/search-intent) earns the click.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Title Rewrite Risk Bands",
    summary:
      "How likely Google was to rewrite a title tag, by length, from Zyppy's published study of 80,959 titles across 2,370 sites (Q1 2022). A 2025 study found a higher overall rewrite rate, so read the bands as relative risk, not exact odds.",
    items: [
      {
        label: "1–5 characters",
        body: "Titles like “Home” or a bare brand name were almost always rewritten, usually by adding words.",
        value: "96.6%",
      },
      {
        label: "20 characters or fewer",
        body: "Any title this short had a better-than-even chance of being rewritten.",
        value: ">50%",
      },
      {
        label: "51–60 characters",
        body: "The lowest rewrite rates in the study: the band to aim for.",
        value: "39–42%",
      },
      {
        label: "Over 60 characters",
        body: "Past 60 characters, the chance of a rewrite rose above three in four.",
        value: ">76%",
      },
      {
        label: "Over 70 characters",
        body: "Virtually every title this long was rewritten, and anything past about 600 pixels is truncated on desktop anyway.",
        value: "99.9%",
      },
    ],
    outcome:
      "Aim for 51–60 characters that name the page's subject and the question it answers, keep the H1 close to the title, and check the pixel width before publishing. A title in the safest band can still be rewritten if it doesn't match the page: length lowers the risk, and relevance removes the reason.",
  },

  related: [
    "meta-description",
    "query-fan-out",
    "search-intent",
    "click-through-rate",
    "content-freshness",
    "serp",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox's Answer-Space Research maps the questions your buyers actually ask ChatGPT, Perplexity and Google and turns the winnable ones into articles — so each page is built around a real buyer question, which is exactly what a natural-language title should say.",
  },
  tool: "serp-snippet-preview",
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description: "How ChatGPT's fan-out sub-queries decide which titles and slugs get cited.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description: "Why Claude adds the year to its searches and what it reads from each result.",
    },
  ],
  sources: [
    {
      title: "Influencing title links in Google Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/title-link",
    },
    {
      title: "More information on how Google generates titles for web page results",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2021/09/more-info-about-titles",
    },
    {
      title: "Google rewrites 61% of page title tags",
      publisher: "Zyppy",
      href: "https://zyppy.com/seo/google-title-rewrite-study/",
    },
    {
      title: "6 important insights about title tags (953,276 pages studied)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/title-tags-study/",
    },
    {
      title: "Google changed 76% of title tags in Q1 2025",
      publisher: "Search Engine Land",
      href: "https://searchengineland.com/google-changed-76-of-title-tags-in-q1-2025-heres-what-that-means-454847",
    },
    {
      title: "Why ChatGPT cites the pages it does",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
    },
    {
      title: "Optimizing your content for inclusion in AI search answers",
      publisher: "Microsoft Advertising Blog",
      href: "https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers",
    },
    {
      title: "Google tested AI headlines in Discover. Now it's testing them in Search",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/google-ai-headlines-in-search/570208/",
    },
  ],
};
