import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "anchor-text",
  metaTitle: "What Is Anchor Text? Types, Best Practices and AI Search",
  metaDescription:
    "Anchor text is the clickable text of a link. The types, what Google says good anchors look like, when exact-match anchors turn risky, and why branded anchors matter.",
  keywords: [
    "anchor text",
    "what is anchor text",
    "anchor text SEO",
    "types of anchor text",
    "exact match anchor text",
    "anchor text best practices",
    "branded anchor text",
  ],

  whyItMatters:
    "Anchor text is one of the few link signals you control directly: on every internal link you write, and in how you ask for coverage elsewhere. Get it right and each link tells Google, readers and AI engines exactly what the page behind it is about. Get it wrong by pushing one commercial keyword across dozens of placements, and you build the very pattern Google's link spam systems look for.",

  questions: [
    {
      id: "good-anchor-text",
      question: "What makes good anchor text?",
      answer:
        "Good anchor text is descriptive, reasonably concise and relevant to both the page it's on and the page it points to; Google's own tip is to read the anchor alone and check that it still makes sense out of context.",
      blocks: [
        {
          kind: "table",
          head: ["Anchor", "Verdict", "Why"],
          rows: [
            ["“click here”, “read more”", "Weak", "Says nothing about the destination"],
            ["“our pricing page”", "Good", "Short, specific and accurate"],
            [
              "“Plannora's guide to sprint planning for small teams”",
              "Good",
              "Describes the page in natural language",
            ],
            [
              "“best project management software cheap project management tool”",
              "Spam",
              "Keyword stuffing, which Google's spam policies prohibit",
            ],
            [
              'An image link with `alt="add enchiladas to your cart"`',
              "Good",
              "Google uses a linked image's alt text as its anchor",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Google\'s [link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) say good anchor text "provides context for the link, and sets the expectation for your readers," and warn you to "resist the urge to cram every keyword that\'s related to the page," because keyword stuffing violates its spam policies. The text has to sit inside a crawlable `<a href>` element. For image links, Google reads the `alt` attribute as the anchor, so an empty `alt` is an empty anchor.',
        },
        {
          kind: "p",
          text: "The same rules serve readers. A descriptive anchor tells people where a click leads before they make it, and it keeps a sentence meaningful when an AI engine lifts the passage without the page around it.",
        },
      ],
    },
    {
      id: "types",
      question: "What are the types of anchor text?",
      answer:
        "The main types of anchor text are branded, naked URL, descriptive or partial-match, exact-match, generic and image anchors; a natural link profile is mostly branded, URL and descriptive anchors, because that's how people link when nobody asks them to.",
      blocks: [
        {
          kind: "table",
          head: ["Type", "Example", "Where it shows up naturally"],
          rows: [
            ["**Branded**", "Plannora", "Reviews, press coverage, tool roundups"],
            ["**Naked URL**", "plannora.io", "Citations, resource lists, forum posts"],
            [
              "**Descriptive / partial-match**",
              "a simple Gantt chart tool for startups",
              "Editorial links inside a sentence",
            ],
            [
              "**Exact-match**",
              "project management software",
              "Rarely, unless someone is optimizing for it",
            ],
            ["**Generic**", "this guide, here", "Casual links everywhere"],
            ["**Image**", "The `alt` text of a linked image", "Logos, badges, screenshots"],
          ],
        },
        {
          kind: "p",
          text: "No published percentage defines a safe mix, and tools that promise one are estimating. The more useful check is simpler: would an editor who had never spoken to you have chosen these words? Branded and URL anchors pass that test by default, and descriptive anchors usually do. A cluster of identical exact-match commercial phrases almost never does, which is why it stands out.",
        },
      ],
    },
    {
      id: "exact-match-risk",
      question: "Is exact-match anchor text bad for SEO?",
      answer:
        "Exact-match anchor text isn't bad in itself, but the same commercial keyword repeated across links from many sites is a classic link-scheme pattern; internal links are treated differently, and Google's Gary Illyes has said there's no over-optimization penalty for them.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s concern is patterns. Its [guidance on large-scale article campaigns](https://developers.google.com/search/blog/2017/05/a-reminder-about-links-in-large-scale) lists "stuffing keyword-rich links to your site in your articles" as a sign of a link scheme, alongside publishing the same articles across many sites. Its [link spam policy](https://developers.google.com/search/docs/essentials/spam-policies) adds keyword-rich links embedded in widgets and forum comments with optimized links in the post or signature. A few exact-match anchors that editors chose is normal; dozens you requested is a footprint.',
        },
        { kind: "h3", text: "Internal anchors are a different case" },
        {
          kind: "p",
          text: 'On your own site you\'re describing your own pages. Asked whether there\'s an internal-linking over-optimization penalty, Google\'s Gary Illyes [replied](https://www.seroundtable.com/google-no-internal-linking-overoptimization-penalty-27092.html): "you can abuse your internal links as much as you want AFAIK." John Mueller has [said](https://www.searchenginejournal.com/googles-internal-anchor-text/372827/) Google gets context "from the anchor text from the internal linking," but that tuning it beyond reasonable wording isn\'t "something where you would see a visible effect in search." Descriptive and varied still reads better than one phrase repeated on every page.',
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Don't dictate anchors on coverage you arranged",
          text: "If you contribute an article or pitch a story, let the publisher link with your brand name or their own words. Requested keyword anchors on placements you set up are exactly the footprint Google's guidance describes, and Google recommends qualifying links in sponsored and guest posts with the appropriate `rel` value.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does anchor text matter for AI search?",
      answer:
        "Anchor text matters for AI search mainly through branded anchors: in Ahrefs' 75,000-brand study, links whose text is the brand name correlated at 0.51–0.63 with AI visibility, well above Domain Rating or raw backlink counts.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "0.628",
              label:
                "correlation between branded anchors and brand visibility in Google AI Mode, the only platform where it reached strong territory",
              source: {
                name: "Ahrefs, Dec 2025",
                href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
              },
            },
            {
              value: "0.51–0.53",
              label: "the same correlation in ChatGPT and Google AI Overviews",
              source: {
                name: "Ahrefs, Dec 2025",
                href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
              },
            },
            {
              value: "0.27–0.33",
              label: "Domain Rating's correlation across the same three platforms, for comparison",
              source: {
                name: "Ahrefs, Dec 2025",
                href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "A branded anchor is a link and a [brand mention](/glossary/brand-mentions) in the same few words, which is one plausible reason it tracks AI visibility better than link metrics do. Ahrefs is clear that these are correlations, not causes. But they fit how answer engines work: they retrieve and quote text, and an anchor reading “Plannora” inside a sentence about sprint planning ties the brand to the topic in words a model can use.",
        },
        {
          kind: "p",
          text: "Generic anchors waste that chance. “Click here” in a quoted passage tells neither the reader nor the model what sits behind the link. Engines are moving toward brand-name links themselves: since May 2026 ChatGPT has added branded inline links to its answers, and [Profound](https://www.tryprofound.com/blog/chatgpt-referrals-branded-links) saw the share of responses containing them rise from about 4.5% to over 20%.",
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Anchor Profile Audit",
    summary:
      "A 20-minute check of whether your inbound anchors look earned or arranged. The inputs are illustrative, for a fictional project-management startup called Plannora; export your own from a backlink tool or the top linking text in Search Console's Links report.",
    items: [
      {
        label: "Export anchors by referring domain",
        body: "One row per linking site, using its main anchor to you, so a site with 40 footer links counts once.",
        value: "60 domains",
      },
      {
        label: "Sort them into types",
        body: "Branded 31 · naked URL 9 · descriptive 11 · generic 3 · exact-match (“project management software”) 6.",
        value: "5 types",
      },
      {
        label: "Add up the anchors an editor would choose unprompted",
        body: "Branded, URL, descriptive and generic: (31 + 9 + 11 + 3) ÷ 60.",
        value: "90%",
      },
      {
        label: "Trace every exact-match anchor to its source",
        body: "All six came from guest posts placed in a single campaign, on sites that don't cover project management.",
        value: "6 of 6",
      },
      {
        label: "Result",
        body: "The exact-match share is small, but every one of those anchors has the same arranged origin — one commercial phrase, one campaign, off-topic hosts — which is the footprint Google's guest-post guidance describes.",
        value: "10%, one source",
      },
    ],
    outcome:
      "The percentage isn't the problem; the single arranged origin is. Plannora's fix is to stop requesting anchors, ask the six hosts to switch the links to the brand name or qualify them with a `rel` value, and let future coverage link however editors choose. Google's [disavow guidance](https://support.google.com/webmasters/answer/2648487) says most sites never need that tool; it's meant for a considerable number of spammy links that have caused, or are likely to cause, a manual action.",
  },

  related: ["backlinks", "internal-linking", "brand-mentions", "domain-authority", "digital-pr"],
  product: {
    feature: "seo-geo-score",
    pitch:
      "The anchor text you fully control is on your own site. Rankbox scores every article before it publishes — structure, headings, internal links, keyword use and citation-readiness — with specific fixes, so internal links go out descriptive and in place.",
  },
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "How ChatGPT chooses sources, including branded inline links and the brand signals behind them.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "How each answer engine finds, reads and cites pages, side by side.",
    },
  ],
  sources: [
    {
      title: "SEO link best practices for Google",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
    },
    {
      title: "Spam policies for Google web search (link spam)",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/essentials/spam-policies",
    },
    {
      title: "A reminder about links in large-scale article campaigns",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2017/05/a-reminder-about-links-in-large-scale",
    },
    {
      title: "A reminder on qualifying links and our link spam update",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2021/07/link-tagging-and-link-spam-update",
    },
    {
      title: "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
    {
      title: "Google's John Mueller on internal anchor text",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/googles-internal-anchor-text/372827/",
    },
    {
      title: "Google: there is no internal linking over-optimization penalty",
      publisher: "Search Engine Roundtable",
      href: "https://www.seroundtable.com/google-no-internal-linking-overoptimization-penalty-27092.html",
    },
    {
      title: "Disavow links to your site",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/2648487",
    },
  ],
};
