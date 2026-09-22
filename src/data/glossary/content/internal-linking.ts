import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "internal-linking",
  metaTitle: "What Is Internal Linking? How It Helps SEO and AI Search",
  metaDescription:
    "Internal linking connects pages on your own site. How it helps Google and AI crawlers find and understand pages, how to audit it, and the mistakes that orphan pages.",
  keywords: [
    "internal linking",
    "internal links",
    "what is internal linking",
    "internal linking SEO",
    "internal links vs backlinks",
    "orphan pages",
    "internal linking strategy",
  ],

  whyItMatters:
    "Internal links are the one link signal you fully control, and they cost nothing but an editing pass. For a small team publishing on a schedule, they decide whether each new article gets found and borrows authority from your strongest pages, or sits orphaned where neither Google nor an AI crawler will reach it. It's also the fastest link fix you can make this week: no outreach and no budget, just links from the pages that already get traffic.",

  questions: [
    {
      id: "how-it-helps",
      question: "How does internal linking help SEO?",
      answer:
        "Internal linking helps SEO in three ways: it lets crawlers discover pages, it carries authority from your strongest pages to weaker ones, and its anchor text and placement tell search engines what each page is about and how your pages relate.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s [link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) set the baseline plainly: "Every page you care about should have a link from at least one other page on your site." Links are how Google finds most new pages, and John Mueller has [said](https://www.searchenginejournal.com/googles-internal-anchor-text/372827/) internal links also help Google "get a bit of context about that specific page," partly from the anchor text and partly from where the page sits in the site.',
        },
        {
          kind: "list",
          items: [
            "**Discovery:** a page with no internal links pointing at it, an orphan, may only be found through a sitemap, if at all. [XML sitemaps](/glossary/xml-sitemap) help discovery but say nothing about which pages matter.",
            "**Authority:** most sites earn [backlinks](/glossary/backlinks) to a few pages. Internal links from those pages are how that authority reaches the product, pricing and comparison pages you need to rank.",
            "**Context:** descriptive [anchor text](/glossary/anchor-text) and links between related pages show which pages form a [topic cluster](/glossary/topic-cluster), and which one is the main page on the subject.",
          ],
        },
        {
          kind: "p",
          text: "Google repeats the point for its AI features. Its [AI features documentation](https://developers.google.com/search/docs/appearance/ai-features) lists \"making your content easily findable through internal links on your website\" among the SEO fundamentals that still apply to AI Overviews and AI Mode, because a page Google hasn't [indexed](/glossary/indexing) can't be retrieved for anything.",
        },
      ],
    },
    {
      id: "internal-vs-backlinks",
      question: "Internal links vs backlinks: what's the difference?",
      answer:
        "Internal links connect pages on the same site and are fully under your control, while backlinks come from other sites and act as outside endorsements; internal links distribute the authority that backlinks bring in, so the two work as a pair.",
      blocks: [
        {
          kind: "table",
          head: ["", "Internal links", "Backlinks"],
          rows: [
            ["**Source**", "Your own site", "Other websites"],
            ["**Who controls them**", "You, completely", "Another site's editor"],
            [
              "**Main job**",
              "Discovery, context, spreading authority around the site",
              "Discovery, endorsement, bringing authority in",
            ],
            [
              "**Anchor text**",
              "Descriptive and consistent is fine",
              "One commercial keyword repeated across sites looks arranged",
            ],
            [
              "**Spam risk**",
              "Low: Google's Gary Illyes has said there's no internal over-optimization penalty",
              "Real: buying or trading followed links breaks Google's link spam policy",
            ],
            ["**Cost**", "An editing pass", "Time, relationships and content worth citing"],
          ],
        },
        {
          kind: "p",
          text: "The practical link between them: a data study or popular guide might earn most of your backlinks, but it's rarely the page that sells. A few contextual internal links from that page to the pages that convert are how outside authority turns into rankings where it counts. Keyword stuffing is still a spam policy violation on either kind of link.",
        },
      ],
    },
    {
      id: "how-to-audit",
      question: "How do you audit internal links?",
      answer:
        "Audit internal links by crawling your site to find orphan pages and pages buried deep, checking that your most important pages get links from your strongest ones, and fixing links that are broken, redirected or built with JavaScript alone.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Crawl the site** with a desktop SEO crawler and export every URL with its count of internal links and its click depth from the homepage.",
            "**Find orphans.** Compare the crawl with your [XML sitemap](/glossary/xml-sitemap) and analytics; URLs that appear there but not in the crawl have no internal links.",
            "**Check your priority pages.** The pages you most want to rank should be among the most linked. Search Console's [Links report](https://support.google.com/webmasters/answer/9049606) shows your top internally-linked pages as Google sees them.",
            "**Fix the plumbing.** Links that point at redirects, 404s or non-canonical URLs waste the link. Point them at the final [canonical](/glossary/canonical-tag) URL.",
            "**Check the raw HTML.** Google says it can only crawl a link that's an `<a>` element with an `href`, and AI crawlers that don't run JavaScript only see links present in the HTML the server sends.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "How many links per page?",
          text: "Google's guidance is that \"there's no magical ideal number of links a given page should contain. However, if you think it's too much, then it probably is.\" Link where a reader would genuinely want to go next, rather than to a quota.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does internal linking matter for AI search?",
      answer:
        "Internal linking matters for AI search because engines can only cite pages their crawlers and indexes reach, and most AI crawlers read raw HTML without running JavaScript, so links need to be plain HTML links on pages those crawlers already visit.",
      blocks: [
        {
          kind: "p",
          text: "Of the major engines, only Google runs your JavaScript; OpenAI's, Anthropic's and Perplexity's fetchers read the HTML they receive, as the [AI SEO guides](/ai-seo) document. A navigation menu or related-articles block injected by client-side scripts may be invisible to them, which leaves deep pages reachable only through a sitemap, if the crawler reads one. OpenAI doesn't say whether `OAI-SearchBot` does. [Server-side rendering](/glossary/server-side-rendering) fixes the links along with the content.",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Internal links aid discovery for AI features",
              body: "Google lists making content easily findable through internal links among the fundamentals for AI Overviews and AI Mode.",
              evidence: "official",
            },
            {
              title: "Non-Google crawlers skip JavaScript",
              body: "Vercel's [crawler study](https://vercel.com/blog/the-rise-of-the-ai-crawler) saw OpenAI's and Anthropic's bots download JavaScript files without running them.",
              evidence: "observed",
            },
            {
              title: "Linked clusters help with fan-out",
              body: "Engines split one question into several searches ([query fan-out](/glossary/query-fan-out)). A cluster whose pages link to each other lets a crawler that reaches one answer find its neighbors: pricing, setup, comparisons. Plausible, but not measured.",
              evidence: "our-read",
            },
          ],
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with internal linking",
      answer:
        "The most common internal linking mistakes are publishing new pages without adding links to them from older pages, relying on JavaScript-only navigation, using generic anchors like “click here,” and pointing links at redirected or non-canonical URLs.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Linking out from a new article is enough.",
              reality:
                "Links from the new page help readers, but the new page needs links pointing at it. Add them from older, already-indexed pages, ideally ones with traffic, on the day you publish.",
            },
            {
              myth: "The sitemap takes care of discovery.",
              reality:
                "A sitemap aids discovery but carries no sense of importance, and it's no substitute for links from relevant pages. Google's rule is that every page you care about needs at least one internal link.",
            },
            {
              myth: "Adding nofollow to internal links focuses authority.",
              reality:
                "Google's guidance reserves `nofollow` for links you'd rather it not associate with your site. Your own pages don't fit that description, and the attribute is only a hint anyway.",
            },
            {
              myth: "Navigation and footer links do the job.",
              reality:
                "Sitewide links help people navigate, but a link inside a relevant paragraph carries far more context: the anchor, the sentence around it, and the topic of the page it sits on.",
            },
            {
              myth: "Exact-match internal anchors will get me penalized.",
              reality:
                "Google's Gary Illyes has said there's no internal over-optimization penalty. Descriptive, varied anchors still read better, and outright keyword stuffing is spam anywhere.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The Cluster Link Count",
    summary:
      "How many internal links a small topic cluster needs, and what each new article costs to wire in. The inputs are illustrative, for a fictional startup called Plannora with one hub page and eight articles on sprint planning.",
    items: [
      {
        label: "The hub links to every article",
        body: "The hub page, “Sprint planning for small teams,” links once to each of the eight articles with a descriptive anchor.",
        value: "8 links",
      },
      {
        label: "Every article links back to the hub",
        body: "One contextual link, anchored with the hub's topic rather than “click here.”",
        value: "8 links",
      },
      {
        label: "Every article links to its two closest siblings",
        body: "“How long should a sprint be?” links to “Sprint velocity, explained” and “Backlog grooming for small teams,” and so on.",
        value: "16 links",
      },
      {
        label: "The homepage or main navigation links to the hub",
        body: "That single link puts every article in the cluster two clicks from the homepage.",
        value: "1 link",
      },
      {
        label: "Total for nine pages",
        body: "8 + 8 + 16 + 1, with a maximum click depth of two and no orphans.",
        value: "33 links",
      },
    ],
    outcome:
      "Wiring in a ninth article costs six links: hub to new, new to hub, new to two siblings, and two older siblings to the new page. Three of those six are edits to pages that already exist, which is the step easiest to skip when you publish on a schedule, and the reason new articles so often end up with links out and none in.",
  },

  related: ["topic-cluster", "anchor-text", "backlinks", "xml-sitemap", "crawl-budget", "indexing"],
  product: {
    feature: "seo-geo-score",
    pitch:
      "Rankbox scores every article before it publishes, one score for SEO and one for GEO, and internal links are part of the check, with specific fixes when a draft falls short.",
  },
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "The eligibility rules for Google's AI features, and why internal links to deep pages still matter.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "Which engines run JavaScript, which read raw HTML, and what each one indexes.",
    },
  ],
  sources: [
    {
      title: "SEO link best practices for Google",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
    },
    {
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      title: "Links report",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/9049606",
    },
    {
      title: "Qualify your outbound links to Google",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links",
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
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
  ],
};
