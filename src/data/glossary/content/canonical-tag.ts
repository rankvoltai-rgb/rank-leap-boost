import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "canonical-tag",
  metaTitle: "What Is a Canonical Tag? rel=canonical for Google and AI Search",
  metaDescription:
    "A canonical tag tells search engines which URL is the preferred version of a page. How rel=canonical works, when Google overrides it, and why AI engines care.",
  keywords: [
    "canonical tag",
    "rel=canonical",
    "canonical URL",
    "what is a canonical tag",
    "self-referencing canonical",
    "canonical vs noindex",
    "Google chose different canonical than user",
  ],

  whyItMatters:
    "Every page you publish can be reached at more addresses than you think — with tracking parameters, with and without www, through a syndication partner — and each copy splits the links and attention one page should get. A correct canonical tag is a one-line fix that keeps your best page credited as the source, in Google's results and in the AI answers built on its index.",

  questions: [
    {
      id: "how-it-works",
      question: "How does a canonical tag work?",
      answer:
        'A canonical tag works by placing `<link rel="canonical" href="…">` in a page\'s `<head>` to name the URL you want indexed; when Google clusters duplicate or near-duplicate pages, it weighs that hint alongside redirects, sitemaps and other signals to choose the one version it crawls most, ranks and shows.',
      blocks: [
        {
          kind: "code",
          lang: "html",
          code: '<!-- On every version of the page, including the canonical itself -->\n<head>\n  <title>Plannora pricing: plans for teams of every size</title>\n  <link rel="canonical" href="https://www.plannora.io/pricing" />\n</head>\n\n<!-- For a PDF or other non-HTML file, send an HTTP header instead -->\nLink: <https://www.plannora.io/guides/launch-plan.pdf>; rel="canonical"',
        },
        {
          kind: "p",
          text: 'Google ranks its canonicalization signals by strength: **redirects** (strong), **`rel="canonical"` annotations** (strong) and **sitemap inclusion** (weak), and they stack when they agree. The chosen canonical "will be crawled most regularly; duplicates are crawled less frequently," it becomes "the main source to evaluate content and quality," and links pointing at the duplicates are consolidated onto it.',
        },
        {
          kind: "list",
          items: [
            "**Use absolute URLs.** Google supports relative paths but recommends against them.",
            "**Put it in the `<head>`.** Google only accepts the element there, so keep the `<head>` valid HTML.",
            "**Add a self-referencing canonical** to the canonical page itself, as Google recommends.",
            "**One method, one answer.** Never declare a different URL in the HTTP header, the HTML and the [XML sitemap](/glossary/xml-sitemap).",
          ],
        },
      ],
    },
    {
      id: "hint-not-directive",
      question: "Why does Google ignore my canonical tag?",
      answer:
        "Google ignores a canonical tag when other signals disagree with it — the pages aren't really duplicates, internal links point elsewhere, or the target redirects — because a canonical is a strong hint, not a command, and Google picks whichever version it judges most useful to searchers.",
      blocks: [
        {
          kind: "p",
          text: 'Search Console shows the verdict. URL Inspection lists the user-declared and Google-selected canonical side by side, and the Page indexing report flags "Duplicate, Google chose different canonical than user" when "Google thinks another URL makes a better canonical." That\'s different from "Alternate page with proper canonical tag," which means everything worked and needs no action.',
        },
        {
          kind: "table",
          head: ["Likely cause", "Fix"],
          rows: [
            [
              "The pages aren't truly duplicates",
              "Make them clearly distinct, or merge them — Google clusters on the main content",
            ],
            [
              "Internal links point at another version",
              "Link to the canonical URL everywhere, navigation included — see [internal linking](/glossary/internal-linking)",
            ],
            ["Header, HTML and sitemap disagree", "Declare the same URL in every method"],
            [
              "The target redirects, 404s or is `noindex`",
              "Point the tag at a live, indexable page",
            ],
            [
              "HTTP and HTTPS both resolve",
              "Redirect to HTTPS; Google prefers it unless signals conflict",
            ],
            ["JavaScript rewrites the tag", "Set it in the server HTML and leave it unchanged"],
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Give it two weeks",
          text: 'Google\'s troubleshooting guide says that even after you fix the underlying issue, it "might hold pages in a duplicate cluster for up to two weeks." Request indexing for your most important URLs — the feature has quotas — then wait.',
        },
      ],
    },
    {
      id: "canonical-vs-noindex",
      question: "Canonical tag vs noindex vs redirect: which should you use?",
      answer:
        "Use a redirect when the duplicate URL should stop existing for people too, a canonical tag when both versions must stay reachable, and `noindex` only when a page shouldn't appear in search at all — Google advises against `noindex` for choosing a canonical within a site, because it removes the page entirely.",
      blocks: [
        {
          kind: "table",
          head: ["Situation", "Use", "Why"],
          rows: [
            [
              "An old URL replaced by a new one",
              "301 redirect",
              "The strongest signal; people and bots both land on the new page",
            ],
            [
              "Tracking parameters, sort orders, print views",
              '`rel="canonical"`',
              "Every URL keeps working while signals consolidate on one",
            ],
            [
              "Your article republished by a partner",
              "The partner adds `noindex`, or a canonical to you",
              "Google now prefers the partner blocking indexing for syndication",
            ],
            [
              "Cart, account and internal search pages",
              "`noindex`, or keep them out of crawling",
              "They shouldn't be in search at all",
            ],
            [
              "Duplicates you'd like to hide",
              "Not robots.txt",
              "A blocked URL can still be indexed without its content, and the crawler never sees your canonical",
            ],
          ],
        },
        {
          kind: "p",
          text: "Syndication is the case that matters most for AI search. Google's troubleshooting guide says the canonical element \"is not recommended for those who want to avoid duplication by syndication partners,\" and that the most effective fix is for partners to block indexing of your content. Write one or the other into every syndication deal: Columbia's Tow Center caught Perplexity citing republished copies of articles instead of the originals.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Do AI search engines respect canonical tags?",
      answer:
        "Google's AI features inherit its canonicalization, because AI Overviews, AI Mode and Gemini ground answers in a Search index where duplicates are already folded into one canonical. OpenAI and Perplexity haven't documented whether they honor `rel=canonical`, and Brave's discovery client, which feeds Claude's search provider, reads it only from the HTML head.",
      blocks: [
        {
          kind: "requirements",
          items: [
            {
              label: "Google — AI Overviews, AI Mode, Gemini",
              status: "helps",
              note: "Grounding retrieves from the Search index, so the Google-selected canonical is the URL that can be cited. Google's AI optimization guide lists reducing duplicate content among its technical best practices.",
            },
            {
              label: "Brave — Claude's search provider",
              status: "helps",
              note: "Brave's discovery client drops URLs with more than one query parameter unless a canonical points to a clean version, and it reads canonicals from the `<head>`, not HTTP headers.",
            },
            {
              label: "OpenAI — ChatGPT search",
              status: "unconfirmed",
              note: "OpenAI doesn't say whether `OAI-SearchBot` honors `rel=canonical`. Keep canonicals right for Bing, a named ChatGPT search provider.",
            },
            {
              label: "Perplexity",
              status: "unconfirmed",
              note: "Not documented, and it has been caught citing syndicated copies over originals — so control duplicates at the source.",
            },
          ],
        },
        {
          kind: "p",
          text: "One rule covers every engine that doesn't run JavaScript: a canonical injected by a script doesn't exist for it, exactly like any other head tag. Put the tag in the server HTML — see [server-side rendering](/glossary/server-side-rendering) — so the same answer reaches Google, Bing, Brave and the AI crawlers alike.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with canonical tags",
      answer:
        "The most common canonical tag mistakes are pointing every paginated page at page one, canonicalizing to URLs that redirect or carry `noindex`, letting a theme and a plugin each emit a conflicting tag, and using canonicals to paper over different pages that should be merged.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "A canonical tag is a command.",
              reality:
                'It\'s a hint. Google says it "may choose a different page as canonical than you do" — check URL Inspection rather than assuming.',
            },
            {
              myth: "Every paginated page should point to page 1.",
              reality:
                "Google says not to use the first page of a sequence as the canonical. Page 2 isn't a duplicate of page 1; give each page its own self-referencing canonical.",
            },
            {
              myth: "A canonical fixes two articles competing for one keyword.",
              reality:
                "Different articles aren't duplicates, so Google may ignore the hint. Merge them and redirect — see [keyword cannibalization](/glossary/keyword-cannibalization).",
            },
            {
              myth: "Two canonical tags are fine as long as one is right.",
              reality:
                'Google warns that multiple or conflicting canonicals "may lead to unexpected results." Themes and SEO plugins often both add one — view source and count.',
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The URL Variant Multiplier",
    summary:
      "A way to count how many addresses one page really has before deciding where canonicals and redirects are needed. The inputs are illustrative, for the pricing page of a fictional app called Plannora — count your own variants the same way, from your server logs.",
    items: [
      {
        label: "Protocol and host",
        body: "`http` and `https`, with and without `www` — four combinations when the server answers on all of them.",
        value: "4",
      },
      {
        label: "Trailing slash",
        body: "`/pricing` and `/pricing/` both return 200 instead of one redirecting to the other.",
        value: "× 2 = 8",
      },
      {
        label: "Tracking parameters",
        body: "The clean URL plus three parameters that show up in the logs from newsletters and ads: `?utm_source=`, `?ref=` and `?gclid=`.",
        value: "× 4 = 32",
      },
      {
        label: "Syndicated copy",
        body: "A partner republished Plannora's pricing explainer on its own domain.",
        value: "+ 1 = 33",
      },
      {
        label: "Result",
        body: "33 crawlable URLs for one page, each able to collect links and split signals. Redirecting `http` and the non-`www` host to one version, enforcing one slash rule and adding a self-referencing canonical collapse the 32 on-site variants into one; the partner's copy needs `noindex` or a canonical back.",
        value: "33 → 1",
      },
    ],
    outcome:
      "Run the same count across a site and it doubles as a [crawl budget](/glossary/crawl-budget) estimate: every variant a crawler can reach is a fetch not spent on a new page. Fix protocol and host with redirects first, since they're the strongest signal, then let canonicals handle the parameters you can't avoid.",
  },

  related: [
    "keyword-cannibalization",
    "indexing",
    "crawl-budget",
    "xml-sitemap",
    "internal-linking",
    "server-side-rendering",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand is cited across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation — so after consolidating duplicates you can confirm the canonical page is the one engines credit.",
  },
  further: [
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "How Brave, Claude's search provider, discovers pages — and why canonicals belong in the HTML head.",
    },
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description:
        "Why syndicated copies can be cited instead of your original, and how to prevent it.",
    },
  ],
  sources: [
    {
      title: 'How to specify a canonical URL with rel="canonical" and other methods',
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
    },
    {
      title: "What is canonicalization",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
    },
    {
      title: "Fix canonicalization issues",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting",
    },
    {
      title: "Page indexing report",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7440203",
    },
    {
      title: "How Brave Search discovers new pages",
      publisher: "MERJ",
      href: "https://merj.com/blog/how-brave-search-discovers-new-pages",
    },
    {
      title: "We compared eight AI search engines. They're all bad at citing news",
      publisher: "Columbia Journalism Review",
      href: "https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php",
    },
  ],
};
