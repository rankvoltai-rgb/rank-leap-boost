import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "backlinks",
  metaTitle: "What Are Backlinks? How Links Work in Google and AI Search",
  metaDescription:
    "Backlinks are links from other sites to yours. How Google uses them, dofollow vs nofollow, how to judge link quality, and why mentions matter more in AI search.",
  keywords: [
    "backlinks",
    "what are backlinks",
    "backlinks SEO",
    "do backlinks still matter",
    "dofollow vs nofollow",
    "backlinks for AI search",
    "inbound links",
  ],

  whyItMatters:
    "A small site competing with category leaders usually loses on links first: their pages have years of citations from other sites, and yours have a handful. Chasing volume is the trap, because bought and traded links get neutralized, and in AI answers being talked about correlates with visibility far more than raw link counts do. The work that pays is a small number of relevant links from sites your buyers already read, plus the mentions that come with them.",

  questions: [
    {
      id: "how-backlinks-work",
      question: "How do backlinks work in SEO?",
      answer:
        "Backlinks work as discovery routes and as endorsements: Google finds most new pages by following links, reads a link from a relevant, prominent site as a sign the page is trustworthy, and uses the words in the link to understand what the page is about.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s own documentation describes three jobs links do. They\'re how pages get found: "the vast majority of the new pages Google finds every day are through links," per the [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). They explain what a page is about, through the [anchor text](/glossary/anchor-text) and the context around it. And they\'re a quality signal: Google says it looks at whether "other prominent websites link or refer to the content," which "is generally a good sign that the information is trustworthy."',
        },
        {
          kind: "p",
          text: "PageRank, the link-analysis algorithm Google launched with, is still one of its core ranking systems, though Google says the implementation has changed a lot since. The logic hasn't: a link is worth roughly what the linking page is worth to its readers. That's why the four things below decide a link's value far more than the count does.",
        },
        {
          kind: "list",
          items: [
            "**Relevance:** the linking page covers your topic, so its readers are plausibly your readers.",
            "**Editorial choice:** someone linked because it helps their reader, not because they were paid or asked to trade.",
            "**Placement:** a link inside a relevant paragraph carries context. Widely distributed footer, template and widget links are on Google's link spam list.",
            '**Qualification:** a link with no `rel` value can pass ranking credit; `rel="nofollow"`, `"sponsored"` and `"ugc"` tell Google not to treat it as a full endorsement.',
          ],
        },
      ],
    },
    {
      id: "ai-search",
      question: "Do backlinks still matter for AI search?",
      answer:
        "Backlinks still matter for AI search, but mostly indirectly: they help pages get crawled and rank in the indexes AI engines retrieve from, while the direct correlation between link counts and being named in AI answers is weak and brand mentions correlate far more strongly.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "0.664",
              label:
                "correlation between branded web mentions and brand visibility in Google AI Overviews",
              source: {
                name: "Ahrefs, May 2025",
                href: "https://ahrefs.com/blog/ai-overview-brand-correlation/",
              },
            },
            {
              value: "0.218",
              label: "correlation for the number of backlinks, about a third as strong",
              source: {
                name: "Ahrefs, May 2025",
                href: "https://ahrefs.com/blog/ai-overview-brand-correlation/",
              },
            },
            {
              value: "0.27–0.33",
              label: "correlation for Domain Rating across ChatGPT, AI Mode and AI Overviews",
              source: {
                name: "Ahrefs, Dec 2025",
                href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Those are correlations across 75,000 brands, and Ahrefs stresses they don't prove cause. The mechanics point the same way, though. [Google AI Overviews](/glossary/ai-overviews) are grounded in Google's core ranking systems, which include link analysis, so links help a page become a candidate. [Perplexity's crawler](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api) keeps documents from \"authoritative domains\" fresher in its index. Brave, the index behind [Claude's web search](/ai-seo/claude), discovers pages by crawling links from sites it already knows, plus reports from opted-in Brave users. Links get you into the pool; being discussed is what gets you named.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Mentions without links count too",
          text: "Gemini names brands in text far more often than it links them: in a [Semrush and Growth Memo study](https://www.semrush.com/blog/the-ghost-citations-study/), only 21.4% of Gemini's brand appearances carried a link. A review, podcast transcript or trade-press quote that names you without linking still builds your [brand mentions](/glossary/brand-mentions).",
        },
      ],
    },
    {
      id: "dofollow-vs-nofollow",
      question: "Dofollow vs nofollow backlinks: what's the difference?",
      answer:
        'A dofollow backlink is simply a link with no qualifying attribute, which can pass ranking credit; a nofollow link carries `rel="nofollow"`, and since 2019 Google treats nofollow, `sponsored` and `ugc` as hints it may weigh, not commands to ignore the link.',
      blocks: [
        {
          kind: "table",
          head: ["Link", "What it signals", "Use it for"],
          rows: [
            [
              "No `rel` value (“dofollow”)",
              "An endorsement that may pass ranking credit",
              "Editorial links you vouch for",
            ],
            [
              '`rel="sponsored"`',
              "Ads, sponsorships or other compensation",
              "Any link that was paid for or given in exchange for something",
            ],
            ['`rel="ugc"`', "User-generated content", "Links in comments and forum posts"],
            [
              '`rel="nofollow"`',
              "No endorsement implied",
              "Links you don't trust, when no other value fits",
            ],
          ],
        },
        {
          kind: "p",
          text: '"Dofollow" isn\'t a real attribute; it\'s shorthand for a link without one. When Google [introduced](https://developers.google.com/search/blog/2019/09/evolving-nofollow-new-ways-to-identify) `sponsored` and `ugc` in September 2019, it said all three values are "treated as hints about which links to consider or exclude within Search," and nofollow became a hint for crawling and indexing too from March 1, 2020. Values can be combined, as in `rel="nofollow ugc"`.',
        },
        {
          kind: "p",
          text: "For AI visibility the distinction matters less than it does for rankings. A nofollowed link in a well-read article still sends readers, still names your brand, and still puts you in a page AI engines can retrieve and quote.",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure backlink quality?",
      answer:
        "Measure backlink quality by counting referring domains rather than raw links, then judging each linking site on relevance, real audience and editorial placement; third-party scores like Domain Rating are useful for comparison, but Google doesn't use them.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Count referring domains, not links.** Fifty links from one site is one relationship; ten links from ten relevant sites is ten. Every major backlink tool reports both.",
            "**Check relevance.** Would the linking page's readers plausibly buy from you? Relevance is what makes a link look earned.",
            "**Check for a real audience.** A page that ranks and gets visitors can send you visitors too. A page with no traffic is usually a page nobody chose to read.",
            "**Read the anchors.** A natural profile is mostly your brand name, bare URLs and descriptive phrases. See [anchor text](/glossary/anchor-text).",
            "**Watch the trend.** New and lost referring domains per month say more than any single score. Use [domain authority](/glossary/domain-authority) and DR only to compare yourself with competitors.",
          ],
        },
        {
          kind: "p",
          text: "Google's own view is free. The [Links report](https://support.google.com/webmasters/answer/9049606) in [Google Search Console](/glossary/google-search-console) shows your top linking sites, top linked pages and top linking text. It's a sample, capped at 1,000 rows per table, and it doesn't say which links are nofollowed, but it's the only link data that comes from Google itself.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with backlinks",
      answer:
        "The most common backlink mistakes are buying or trading followed links, chasing a third-party score instead of relevance, and running paid placements without qualifying them — each one risks Google neutralizing the links, or a manual action, while doing little for AI visibility.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Any link from a high-DA site is worth getting.",
              reality:
                "Google doesn't use DA or DR. A relevant link from a small, well-read site in your niche beats an irrelevant one from a big domain, and sites selling “high-DA links” are exactly what Google's spam systems look for.",
            },
            {
              myth: "Buying links is fine if nobody finds out.",
              reality:
                "Google's [link spam policy](https://developers.google.com/search/docs/essentials/spam-policies) covers exchanging money, goods or services for links, and excessive link exchanges. Since its [December 2022 update](https://developers.google.com/search/blog/2022/12/december-22-link-spam-update), SpamBrain detects “both sites buying links, and sites used for the purpose of passing outgoing links,” and neutralized links pass no credit.",
            },
            {
              myth: "Sponsored links break Google's rules.",
              reality:
                'Paid links are fine as long as they carry `rel="sponsored"` or `rel="nofollow"`, Google says. The violation is the unqualified, followed link that was paid for.',
            },
            {
              myth: "Nofollow links are worthless.",
              reality:
                "Google treats nofollow as a hint, and a nofollowed mention in a well-read article still sends readers and names your brand where AI engines can find it.",
            },
            {
              myth: "More links always help.",
              reality:
                "Low-quality directory links, sitewide footer links and keyword-rich widget links are all on Google's link spam list. Volume without relevance is a pattern, not an asset.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Earned-Link Test",
    summary:
      "Five questions to ask of any link before you spend time pursuing it. A link that passes all five is worth having even if it's nofollowed; a link that fails the second or fourth is a liability whatever its authority score.",
    items: [
      {
        label: "Relevance",
        body: "Is the linking page about your topic, and would its readers plausibly become your buyers? **Test:** read the page as a customer. If the link would surprise them, it will look odd to Google too.",
      },
      {
        label: "Editorial choice",
        body: "Would this link exist if search engines didn't? Google defines link spam as links created “primarily for the purpose of manipulating search rankings.” **Test:** could the author explain the link to a reader without mentioning SEO?",
      },
      {
        label: "Audience",
        body: "Does the page have readers who could click? **Test:** check whether it ranks for anything or shows signs of engagement. A link that can send a real visitor is almost always worth having.",
      },
      {
        label: "Clean terms",
        body: 'Did money, goods or services change hands for the link? Then Google\'s policy says it must carry `rel="sponsored"` or `rel="nofollow"`. **Test:** if you\'d be uncomfortable disclosing the arrangement to readers, don\'t make it.',
      },
      {
        label: "Named context",
        body: "Does the surrounding sentence name your brand and say what you do? That sentence is a [brand mention](/glossary/brand-mentions) as well as a link, and it's the part an AI engine can lift. **Test:** read the sentence with the link removed.",
      },
    ],
    outcome:
      "Score each opportunity pass or fail before you pitch it. Pursue anything that passes all five, including nofollowed coverage, and walk away from anything that fails Editorial choice or Clean terms, however high its DR.",
  },

  related: [
    "domain-authority",
    "anchor-text",
    "brand-mentions",
    "digital-pr",
    "internal-linking",
    "e-e-a-t",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "The links that pass the Earned-Link Test go to pages worth citing. Rankbox researches the live web and writes source-backed articles with clear definitions and cited evidence — the kind of reference page other writers link to without being asked.",
  },
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "How each answer engine finds sources, and why off-site mentions are a second route into AI answers.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "How Claude searches Brave's index, and why links from established sites are Brave's main route to you.",
    },
  ],
  sources: [
    {
      title: "Spam policies for Google web search (link spam)",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/essentials/spam-policies",
    },
    {
      title: "SEO link best practices for Google",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
    },
    {
      title: "Qualify your outbound links to Google",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links",
    },
    {
      title: "Evolving “nofollow”: new ways to identify the nature of links",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2019/09/evolving-nofollow-new-ways-to-identify",
    },
    {
      title: "How Search works: ranking results",
      publisher: "Google",
      href: "https://www.google.com/search/howsearchworks/how-search-works/ranking-results/",
    },
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title: "An analysis of AI Overview brand visibility factors (75K brands)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-brand-correlation/",
    },
    {
      title: "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
  ],
};
