import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "meta-description",
  metaTitle: "What Is a Meta Description? Length, Rewrites and AI Search",
  metaDescription:
    "A meta description summarizes a page for search results. Why Google rewrites most of them, the lengths that display in full, and what they do for AI search.",
  keywords: [
    "meta description",
    "meta description tag",
    "meta description length",
    "what is a meta description",
    "does Google rewrite meta descriptions",
    "meta description SEO",
  ],

  whyItMatters:
    "For a small team, the meta description is one of the few places you get to pitch a searcher directly before they choose between you and a bigger brand. It won't move rankings, and Google replaces most descriptions with text from the page, so the skill is knowing which pages deserve a hand-written one and making each page's opening do the rest. Microsoft now says descriptions also help its AI systems understand what a page is for, so a clear one does double duty.",

  questions: [
    {
      id: "ranking-factor",
      question: "Is the meta description a ranking factor?",
      answer:
        "The meta description is not a Google ranking factor: Google said in 2009 that it doesn't use the description meta tag in ranking, and its documentation treats the tag only as a possible source for the snippet shown under your title.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s 2009 [statement](https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag) is still the clearest: "Even though we sometimes use the description meta tag for the snippets we show, we still don\'t use the description meta tag in our ranking." Its current [meta description guide](https://developers.google.com/search/docs/appearance/snippet) describes the tag as "like a pitch that convince the user that the page is exactly what they\'re looking for."',
        },
        {
          kind: "p",
          text: 'So its job is the click, not the position. Google says high-quality descriptions "can go a long way to improving the quality and quantity of your search traffic." The measured effect is modest, though: in Seer Interactive\'s 2025 tests, manually written, GPT-written and blank descriptions landed within 2 percentage points of each other on [click-through rate](/glossary/click-through-rate). A description helps most on pages where Google actually shows it.',
        },
      ],
    },
    {
      id: "rewrites",
      question: "How often does Google rewrite meta descriptions?",
      answer:
        "Google rewrites most meta descriptions: Ahrefs found it showed something other than the tag about 63% of the time in a 2020 study, Portent measured 68% on desktop and 71% on mobile the same year, and Seer Interactive saw about 70% in 2025.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "62.78%",
              label:
                "of snippets differed from the page's meta description, across 20,000 keywords",
              source: {
                name: "Ahrefs, Oct 2020",
                href: "https://ahrefs.com/blog/meta-description-study/",
              },
            },
            {
              value: "71%",
              label:
                "of meta descriptions were ignored on mobile, 68% on desktop, across 30,000 keywords",
              source: {
                name: "Portent, Sep 2020",
                href: "https://portent.com/blog/seo/how-often-google-ignores-our-meta-descriptions.htm",
              },
            },
            {
              value: "70%",
              label: "of tracked queries showed Google-written descriptions in April 2025",
              source: {
                name: "Seer Interactive, May 2025",
                href: "https://www.seerinteractive.com/insights/do-you-need-to-write-meta-descriptions-anymore-probably-not",
              },
            },
          ],
        },
        {
          kind: "p",
          text: 'The reason is in Google\'s own documentation: "Snippets are primarily created from the page content itself," chosen to match each search, so "Google Search might show different snippets for different searches." Seer saw individual pages display 2 to 11 different snippets in a single month. Rewrites are rarer on high-volume queries — Ahrefs measured 59.65% for "fat-head" keywords against 65.62% for long-tail ones, and Portent found the same pattern.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Hand-write where it will show",
          text: 'Spend your time on the pages that win high-volume queries: the homepage, pricing, product and top category pages. On long-tail articles, Google will usually quote the page instead, so a strong opening paragraph matters more than the tag. For large database-driven sites, Google says programmatic descriptions "can be appropriate and are encouraged."',
        },
      ],
    },
    {
      id: "length",
      question: "How long should a meta description be?",
      answer:
        "A meta description has no length limit in Google, which truncates snippets to fit the screen, so a practical target is roughly 150–160 characters for desktop and under about 120 for mobile, per Portent's SERP analysis — with the key message in the first 100 characters.",
      blocks: [
        {
          kind: "p",
          text: "Google puts it plainly: \"There's no limit on how long a meta description can be, but the snippet is truncated in Google Search results as needed, typically to fit the device width.\" Display space is really measured in pixels, but Portent chose character counts because they're easier to work with, and a date in the snippet takes some of the room. The full thresholds are in the benchmark below.",
        },
        {
          kind: "p",
          text: "Length decides whether a description is cut off, not whether it's used. Ahrefs found descriptions of a sensible length were rewritten about as often as overlong ones — 63.69% against 61.46% — because relevance to the query is what Google weighs. Check both lengths at once with the [SERP snippet preview](/tools/serp-snippet-preview), next to your [title tag](/glossary/title-tag).",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Do meta descriptions matter for AI search?",
      answer:
        "Meta descriptions matter a little for AI search: Microsoft says the title, description and H1 are important signals its AI systems use to interpret a page's purpose, but no AI engine has documented using descriptions to decide what gets cited, and answers quote the page itself.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Microsoft: a signal of purpose",
              body: 'Microsoft\'s October 2025 guidance says "your page title, description, and H1 tag" are "important signals AI systems use to interpret purpose and scope," and that descriptions should "explain value or outcome" rather than stuff keywords.',
              evidence: "official",
            },
            {
              title: "Google: the page does the work",
              body: "Google grounds AI Overviews and AI Mode in indexed, snippet-eligible pages, and its AI optimization guide doesn't mention meta descriptions. What limits AI use of a page is its [snippet controls](/glossary/snippet-controls), such as `nosnippet` and `max-snippet`.",
              evidence: "official",
            },
            {
              title: "Chat engines read titles and passages",
              body: "Claude's documented search tool hands the model each result's URL, title and page age, with no separate description field, then fetches the page to quote from it.",
              evidence: "official",
            },
            {
              title: "The opening paragraph is the real snippet",
              body: "Because engines cite passages, the page's first paragraph does the job a description does in classic search. Write the two as the same promise.",
              evidence: "our-read",
            },
          ],
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with meta descriptions",
      answer:
        "The most common meta description mistakes are reusing one description across many pages, stuffing it with keywords, promising something the page doesn't deliver, and hand-writing thousands of long-tail descriptions that Google will usually replace anyway.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "A keyword-rich description helps rankings.",
              reality:
                'It isn\'t a ranking factor, and Google says descriptions made of long strings of keywords "are less likely to be displayed as a snippet."',
            },
            {
              myth: "The same description on every page beats none.",
              reality:
                'Google: "Identical or similar descriptions on every page of a site aren\'t helpful when individual pages appear in search results." Use a site-level description on the homepage and page-specific ones elsewhere.',
            },
            {
              myth: "If it fits the character limit, Google will use it.",
              reality:
                "Length only prevents truncation. Google swaps in page text whenever it judges that text a better match for the query.",
            },
            {
              myth: "A clever description makes up for a thin page.",
              reality:
                "A snippet that oversells earns a click and a quick bounce. The description should promise exactly what the first screen delivers.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Snippet Display Budget",
    summary:
      "How many characters of a meta description Google tended to show before truncating, by device and by whether a date appears in the snippet. The thresholds come from Portent's September 2020 analysis of 30,000 keywords, measured in characters rather than pixels; Google's layout has changed since, so treat them as rules of thumb.",
    items: [
      {
        label: "Desktop, no date in the snippet",
        body: "Portent found fully displayed desktop descriptions ran 150 to 160 characters, occasionally up to 165.",
        value: "150–160",
      },
      {
        label: "Desktop, with a date",
        body: "A publish date takes part of the line; Portent's safe target was 138 to 148 characters.",
        value: "138–148",
      },
      {
        label: "Mobile, no date in the snippet",
        body: "Portent's safe target for mobile results without a date was under about 120 characters.",
        value: "<120",
      },
      {
        label: "Mobile, with a date",
        body: "The tightest case, common on blog posts: most snippets displayed about 95 to 105 characters.",
        value: "95–105",
      },
    ],
    outcome:
      "Write to the tightest budget you care about. Put the page's promise and the searcher's key term in the first 95 characters or so, and use the rest for supporting detail that can be cut without loss. Then remember what the budget can't do: a description that fits is still replaced whenever Google finds page text that matches the query better.",
  },

  related: [
    "title-tag",
    "click-through-rate",
    "snippet-controls",
    "serp",
    "featured-snippet",
    "zero-click-search",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Google builds most snippets from a page's own text, and Rankbox's Citation-Ready Writer opens each section with a direct, source-backed answer — a specific opening that reads well whether Google shows your description or quotes the page.",
  },
  tool: "meta-description-writer",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Which snippet controls switch off AI Overviews and AI Mode, and which change nothing.",
    },
  ],
  sources: [
    {
      title: "How to write meta descriptions",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/snippet",
    },
    {
      title: "Google does not use the keywords meta tag in web ranking",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag",
    },
    {
      title: "How often does Google rewrite meta descriptions?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/meta-description-study/",
    },
    {
      title: "How often Google ignores our meta descriptions",
      publisher: "Portent",
      href: "https://portent.com/blog/seo/how-often-google-ignores-our-meta-descriptions.htm",
    },
    {
      title: "Do you need to write meta descriptions anymore? Probably not.",
      publisher: "Seer Interactive",
      href: "https://www.seerinteractive.com/insights/do-you-need-to-write-meta-descriptions-anymore-probably-not",
    },
    {
      title: "Optimizing your content for inclusion in AI search answers",
      publisher: "Microsoft Advertising Blog",
      href: "https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers",
    },
    {
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
  ],
};
