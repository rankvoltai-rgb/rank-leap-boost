import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "keyword-cannibalization",
  metaTitle: "What Is Keyword Cannibalization? How to Find and Fix It",
  metaDescription:
    "Keyword cannibalization is when your own pages compete for one query. How to find it in Search Console, how to fix it, and why AI engines cite only one page.",
  keywords: [
    "keyword cannibalization",
    "content cannibalization",
    "SEO cannibalization",
    "what is keyword cannibalization",
    "how to fix keyword cannibalization",
    "keyword cannibalization AI search",
  ],

  whyItMatters:
    "Small teams publish in bursts, and after a year of blogging it's common to find three articles quietly answering the same buyer question, each weaker than one page would be. Every overlap splits the links and attention you worked to earn, and AI engines make it worse: Microsoft says they cluster near-duplicate pages and pick one to represent the set, which may not be the one you'd choose. Fixing cannibalization is often the cheapest ranking gain available, because it needs no new content at all.",

  questions: [
    {
      id: "is-it-bad",
      question: "Is keyword cannibalization bad for SEO?",
      answer:
        "Keyword cannibalization is bad when two pages chase the same intent: links and relevance split, Google rotates which URL it shows, and neither ranks as well as one consolidated page would. Two of your pages ranking for one query is not automatically a problem, and it is never a penalty.",
      blocks: [
        {
          kind: "p",
          text: 'The harm is dilution, not punishment. Google\'s [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) says duplicate content on your own site "is not a violation of our spam policies, but it can be a bad user experience." Microsoft\'s Bing team describes the cost precisely: duplication "doesn\'t trigger search penalties on its own, but it does reduce visibility by diluting authority, confusing intent, and slowing how updates reach both search engines and AI-powered discovery systems."',
        },
        {
          kind: "table",
          head: ["Situation", "Cannibalization?", "Why"],
          rows: [
            [
              'Two blog posts both built around "sprint planning template"',
              "**Yes**",
              "Same query, same intent, same answer — one page would be stronger",
            ],
            [
              "The ranking URL for a query swaps between two pages week to week",
              "**Likely**",
              "Google can't settle on which page answers best",
            ],
            [
              "A how-to guide and a product page both rank for one feature query",
              "**Usually not**",
              "Different intents, and Google often shows two listings from one site",
            ],
            [
              'A pricing page and a "which plan is right for me" post',
              "**Check**",
              "Fine if each answers its own question; a problem if both answer both",
            ],
          ],
        },
        {
          kind: "p",
          text: "Two listings can be a win. Google's [ranking systems guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide) says its site diversity system \"generally won't show more than two web page listings from the same site in our top results.\" The losing pattern is three or four pages with the same [search intent](/glossary/search-intent) fighting over those slots.",
        },
      ],
    },
    {
      id: "how-to-find",
      question: "How do you find keyword cannibalization?",
      answer:
        "Find keyword cannibalization in Google Search Console: filter the Performance report to one query, open the Pages tab, and look for two or more of your URLs sharing meaningful impressions — especially if the top URL changes from week to week.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Start from queries that matter.** Export your top 50 queries by impressions from [Google Search Console](/glossary/google-search-console), not every keyword you've ever touched.",
            "**Filter one query, then open Pages.** Two or more URLs with real impressions for the same query is the signal. One URL with nearly all the impressions and a stray second one is noise.",
            "**Check stability.** Compare the last four weeks one at a time. If the leading URL swaps, Google is unsure which page answers best.",
            '**Run a site search.** `site:yourdomain.com "sprint planning"` lists every page Google associates with the phrase, including old posts you forgot about.',
            '**Scan your titles.** Near-identical [title tags](/glossary/title-tag) are the fastest tell. Bing Webmaster Tools\' Recommendations tab flags "too many pages with identical titles" and exports the list.',
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Check the AI answers too",
          text: "Ask the same buyer question in ChatGPT, Perplexity and Google AI Mode. If an older, weaker page of yours is cited instead of the one you'd pick, that's cannibalization inside the answer, not just in the rankings. Watching this over time is [prompt tracking](/glossary/prompt-tracking).",
        },
      ],
    },
    {
      id: "how-to-fix",
      question: "How do you fix keyword cannibalization?",
      answer:
        "Fix keyword cannibalization by merging pages that answer the same question into the strongest URL and permanently redirecting the rest, or by retargeting one page to a clearly different question. Use a canonical tag only when both versions must stay live.",
      blocks: [
        {
          kind: "table",
          head: ["Fix", "When to use it", "How"],
          rows: [
            [
              "**Merge + 301**",
              "Same intent, same answer, both pages worth something",
              "Move the weaker page's unique material into the stronger one, then add a permanent redirect. Google treats it as a signal that the target should be canonical.",
            ],
            [
              "**Differentiate**",
              "Same topic, but each page could own a distinct question",
              'Retitle and rewrite one page for its own intent — "sprint planning template" versus "how long should sprint planning take" — and link between them.',
            ],
            [
              "**Canonicalize**",
              "Near-duplicates that must stay live, like campaign or filtered versions",
              "Point a [canonical tag](/glossary/canonical-tag) on each variant at the main URL. It's a strong hint, not a command.",
            ],
            [
              "**Leave it**",
              "Both pages rank well for genuinely different intents",
              "Nothing to do. Two listings from one site is normal.",
            ],
            [
              "**Retire**",
              "No traffic, no links, nothing unique",
              "Remove it, or redirect it if anything still links to it.",
            ],
          ],
        },
        {
          kind: "p",
          text: "Pick the keeper on evidence, not age: the URL with more referring links, more conversions and the cleaner, natural-language slug. After the merge, update your [internal links](/glossary/internal-linking) to point straight at the keeper rather than through the redirect, and make sure it appears in your [topic cluster](/glossary/topic-cluster) navigation.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does keyword cannibalization affect AI search?",
      answer:
        "Keyword cannibalization affects AI search even more directly than rankings: Microsoft says AI systems group near-duplicate pages, choose one to represent the set and may pick an outdated version, so overlapping pages can hand an answer engine the wrong page to cite.",
      blocks: [
        {
          kind: "p",
          text: 'Microsoft, one of ChatGPT\'s named search providers, spelled it out in a [December 2025 Bing post](https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility): "LLMs group near-duplicate URLs into a single cluster and then choose one page to represent the set. If the differences between pages are minimal, the model may select a version that is outdated or not the one you intended to highlight."',
        },
        {
          kind: "signals",
          items: [
            {
              title: "Near-duplicates collapse into one",
              body: 'When pages share wording, structure and metadata, Bing says AI systems "cannot easily determine which version aligns best with the user\'s intent," which lowers the odds your preferred page becomes the grounding source.',
              evidence: "official",
            },
            {
              title: "One page per variant can breach spam policy",
              body: 'Google\'s [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) warns that separate content for every variation of a search, fan-out queries included, made "primarily to manipulate rankings or generative AI responses" violates its scaled content abuse policy.',
              evidence: "official",
            },
            {
              title: "Your pages compete in one pool",
              body: "With [query fan-out](/glossary/query-fan-out), candidates from every sub-query are reranked together. Two of your pages saying the same thing fight for one slot; two pages answering different sub-questions can both be cited.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "p",
          text: "The rule that works for both kinds of search is simple: one question, one page, with distinct pages around it for the follow-up questions a buyer asks next.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with keyword cannibalization",
      answer:
        "The most common keyword cannibalization mistakes are treating every shared keyword as a problem, deleting pages instead of merging them, and reaching for a canonical tag where a merge was needed — each either wastes effort or throws away links the site already earned.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Any two pages ranking for the same keyword are cannibalizing.",
              reality:
                "Only pages that serve the same intent compete. A guide and a product page can rank side by side, and Google's site diversity system often shows two results from one site.",
            },
            {
              myth: "Cannibalization gets a site penalized.",
              reality:
                "There's no penalty. Google says duplicate content on your own site isn't a spam violation; the cost is split signals and an unstable ranking URL.",
            },
            {
              myth: "Just delete the weaker page.",
              reality:
                "Deleting throws away its links and whatever traffic it still earns. Merge its useful parts into the keeper and redirect the old URL.",
            },
            {
              myth: "A canonical tag fixes every overlap.",
              reality:
                "A [canonical tag](/glossary/canonical-tag) is a hint for true duplicates, and Google can ignore one it disagrees with. For two different articles answering the same question, merging is cleaner.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Same-Answer Test",
    summary:
      "Five checks, in order, for deciding whether two of your pages are really cannibalizing each other and what to do about it. The first check that fails tells you which fix you need.",
    items: [
      {
        label: "Same query",
        body: "Do both URLs earn meaningful impressions for the same query in Search Console? **If no:** there's no overlap to fix. Stop here.",
      },
      {
        label: "Same intent",
        body: "Would one searcher be satisfied landing on either page? Look at what Google ranks for the query: guides, product pages, comparisons. **If no:** the pages serve different intents. Sharpen their titles and keep both.",
      },
      {
        label: "Same answer",
        body: "Read the first 100 words of each page. Do they answer the question in substantially the same way? **If yes:** merge. **If they're close but distinct:** retarget the weaker page to its own follow-up question.",
      },
      {
        label: "Clear keeper",
        body: "Which URL has more referring links, more conversions and the cleaner slug? That page survives. The other's unique material moves in and its URL gets a permanent redirect.",
      },
      {
        label: "Watch the result",
        body: "For four to eight weeks after the change, check that one URL now holds the query in Search Console and that the right page is the one cited for your tracked buyer prompts.",
      },
    ],
    outcome:
      "Most genuine cannibalization passes the first three checks — same query, same intent, same answer — and the fix is a merge. A pair that fails the intent check isn't cannibalization at all; it's two pages that need clearer titles and a link between them.",
  },

  related: [
    "search-intent",
    "canonical-tag",
    "topic-cluster",
    "internal-linking",
    "content-decay",
    "query-fan-out",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox's Answer-Space Research maps the questions your buyers ask ChatGPT, Perplexity and Google, scores each for volume, difficulty and intent, and turns the winnable ones into articles — so your plan starts from distinct questions, one article each, rather than overlapping keywords.",
  },
  tool: "content-brief-generator",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "How Google fans queries out, and why it warns against one page per query variant.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "How ChatGPT, Google AI Overviews, Gemini, Claude and Perplexity each retrieve and cite pages.",
    },
  ],
  sources: [
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title: "SEO Starter Guide",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    },
    {
      title: "Redirects and Google Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/301-redirects",
    },
    {
      title: "How to specify a canonical URL",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Does duplicate content hurt SEO and AI search visibility?",
      publisher: "Microsoft Bing Webmaster Blog",
      href: "https://blogs.bing.com/webmaster/December-2025/Does-Duplicate-Content-Hurt-SEO-and-AI-Search-Visibility",
    },
  ],
};
