import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "domain-authority",
  metaTitle: "What Is Domain Authority? DA, DR and Why Google Doesn't Use Them",
  metaDescription:
    "Domain Authority is Moz's 1–100 link-based score. What it measures, DA vs DR, what a good score is, how to raise it, and why it barely predicts AI visibility.",
  keywords: [
    "domain authority",
    "what is domain authority",
    "domain rating",
    "DA vs DR",
    "does Google use domain authority",
    "good domain authority score",
    "how to increase domain authority",
  ],

  whyItMatters:
    "Domain authority is the number most founders use to judge whether they can compete, and the number link sellers use to set their prices, so it pays to know exactly what it is. Used well, it tells you which queries are winnable today and how far behind the sites outranking you really are. Used badly, it becomes a score to buy your way toward, with links Google's spam systems are built to neutralize and a metric that only weakly predicts AI visibility.",

  questions: [
    {
      id: "does-google-use-it",
      question: "Does Google use domain authority?",
      answer:
        "Google does not use Domain Authority, Domain Rating or any other third-party authority score; Moz, which created DA, says it is not a Google ranking factor and has no effect on search results.",
      blocks: [
        {
          kind: "p",
          text: "DA is Moz's model of Google, not part of Google. Moz's [own documentation](https://moz.com/learn/seo/domain-authority) is explicit: \"Domain Authority is not a Google ranking factor and has no effect on the SERPs.\" It's a machine-learning prediction of how likely a site is to rank, built mostly from link data such as the number of linking root domains and the quality of those links.",
        },
        {
          kind: "p",
          text: 'What Google does use is link analysis. Its [ranking systems guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide) says PageRank "continues to be part of our core ranking systems," and that "site-wide signals and classifiers" contribute to how it understands pages. That\'s why DA often tracks rankings: both sit downstream of the same links. But Google\'s systems judge pages against specific queries, from its own index, using far more than links — so a site with a lower score can outrank a higher one on a question it answers better.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Use it for comparison, not as a goal",
          text: "DA is most useful side by side: your score against the sites ranking for a query you want. It tells you whether the gap is five points or fifty, not whether a particular page of yours can win.",
        },
      ],
    },
    {
      id: "da-vs-dr",
      question: "Domain Authority vs Domain Rating: what's the difference?",
      answer:
        "Domain Authority is Moz's 1–100 prediction of ranking ability built from link data, while Domain Rating is Ahrefs' 0–100 measure of backlink-profile strength; Semrush's Authority Score also blends in organic traffic and spam signals, and Google uses none of the three.",
      blocks: [
        {
          kind: "table",
          head: ["", "Domain Authority (DA)", "Domain Rating (DR)", "Authority Score (AS)"],
          rows: [
            ["**Made by**", "Moz", "Ahrefs", "Semrush"],
            ["**Scale**", "1–100", "0–100", "1–100"],
            [
              "**What it models**",
              "How likely a site is to rank, via a machine-learning model",
              "The strength of a site's backlink profile",
              "Overall quality of a domain",
            ],
            [
              "**Main inputs**",
              "Linking root domains, link quality and other ranking correlates",
              "Linking domains weighted by their own DR, each splitting its rating across the sites it links to",
              "Link power, estimated organic traffic and spam factors",
            ],
            ["**Used by Google**", "No", "No", "No"],
          ],
        },
        {
          kind: "p",
          text: 'All three are relative. Moz notes that it\'s "easier to grow your score from 20 to 30 than it is to grow it from 70 to 80," and [Ahrefs](https://help.ahrefs.com/en/articles/1409408-what-is-domain-rating-dr) calls DR "a relative metric by definition," which can fall even when you lose no links because other sites gained more. Scores from different tools aren\'t interchangeable, so pick one and compare like with like.',
        },
      ],
    },
    {
      id: "good-score",
      question: "What is a good domain authority score?",
      answer:
        "A good domain authority score is one close to the scores of the sites ranking for the queries you want; Moz says there's no universally good score, because the metric is relative and a 30 can be strong in one niche and weak in another.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Pick five queries you want to win.** Real buyer questions, not your brand name.",
            "**Note the DA or DR of every page-one result.** Look across the whole top ten, not just the first result.",
            "**Find the lowest score that ranks.** If sites near your score already appear, the query is winnable on content. If every result is 40 points above you, it probably isn't yet.",
            "**Re-check every quarter.** Scores move as the web's link graph changes, even when nothing changes on your side.",
          ],
        },
        {
          kind: "p",
          text: "This is roughly how [keyword difficulty](/glossary/keyword-difficulty) scores work under the hood: mostly the link strength of the pages already ranking. The useful question isn't whether your DA is good, but which questions you can win with the authority you have. For a young site that usually means specific, [long-tail](/glossary/long-tail-keywords) questions the big domains answer poorly or not at all.",
        },
      ],
    },
    {
      id: "how-to-increase",
      question: "How do you increase domain authority?",
      answer:
        "Domain authority rises when more relevant, established sites link to you, so the durable way to increase it is to earn those links — with content worth citing, digital PR and real relationships — rather than to buy links aimed at the score.",
      blocks: [
        {
          kind: "p",
          text: "Because DA and DR are computed mostly from linking domains, any tactic that adds linking domains moves them, including tactics that break Google's rules. That's why \"DA 50+ links\" are sold, and why the score alone makes a bad target. Google's [link spam policy](https://developers.google.com/search/docs/essentials/spam-policies) covers buying links and exchanging goods or services for them, and its SpamBrain system is built to detect \"both sites buying links, and sites used for the purpose of passing outgoing links.\" A link Google has neutralized can still lift a third-party score, so a rising DA isn't proof your links count.",
        },
        {
          kind: "list",
          items: [
            "**Publish things worth linking to:** original data, useful tools and clear definitions others want to cite. See [information gain](/glossary/information-gain).",
            "**Run [digital PR](/glossary/digital-pr):** give journalists a story or a number they can't get anywhere else.",
            "**Get listed where you genuinely belong:** partner and integration directories, customers' case studies, industry associations.",
            "**Keep what you've earned:** redirect old URLs that still attract links, and ask sites that mention you without a link whether they'd add one.",
          ],
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does domain authority matter for AI search?",
      answer:
        "Domain authority matters only weakly for AI search: in Ahrefs' 75,000-brand study, Domain Rating correlated at 0.27–0.33 with how often ChatGPT, AI Mode and AI Overviews mentioned a brand, while branded web mentions correlated at 0.66–0.71.",
      blocks: [
        {
          kind: "p",
          text: "AI engines don't read an authority score either. They retrieve from search indexes — Google's for AI Overviews and Gemini, Bing plus OpenAI's own for ChatGPT, Brave for Claude, Perplexity's own for Perplexity — and links help pages get crawled and rank in those indexes. So authority helps a page become a candidate. Whether the answer names you depends more on what the rest of the web says about you. The [AI SEO guides](/ai-seo) cover each engine's index in detail.",
        },
        {
          kind: "p",
          text: "Ahrefs' numbers put that in order. Across ChatGPT, AI Mode and AI Overviews, YouTube mentions (about 0.74) and branded web mentions led, branded [anchor text](/glossary/anchor-text) came next, and Domain Rating sat in the bottom half. DR's correlation was highest in AI Overviews, the product built most directly on Google's rankings. That fits the idea that authority works through search ranking rather than around it.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Correlation, not a recipe",
          text: "Ahrefs stresses that correlation isn't causation: big brands have high DR and lots of mentions at the same time. The practical read is to spend less effort on the score and more on being discussed where your buyers look. See [brand mentions](/glossary/brand-mentions).",
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The AI Visibility Signal Ladder",
    summary:
      "Where domain authority sits among the signals that correlate with how often AI engines name a brand. Every value is a Spearman correlation from Ahrefs' 75,000-brand studies of ChatGPT, AI Mode and AI Overviews; Rankbox arranged them into a ladder, but the numbers are Ahrefs'.",
    items: [
      {
        label: "YouTube mentions",
        value: "0.71–0.74",
        body: "The brand named in video titles, descriptions or transcripts. The strongest single signal on all three platforms.",
      },
      {
        label: "Branded web mentions",
        value: "0.66–0.71",
        body: "Your name on other sites, linked or not. See [brand mentions](/glossary/brand-mentions).",
      },
      {
        label: "Branded anchors",
        value: "0.51–0.63",
        body: "Links whose visible text is your brand name, a mention and a link at once. Strongest in AI Mode.",
      },
      {
        label: "Branded search volume",
        value: "0.35–0.47",
        body: "How many people search for you by name — demand that PR and word of mouth create.",
      },
      {
        label: "Domain Rating",
        value: "0.27–0.33",
        body: "Ahrefs' link-strength score, the counterpart to Moz's DA. Highest in AI Overviews, the platform built most directly on search rankings.",
      },
      {
        label: "Number of backlinks",
        value: "0.22",
        body: "Raw link count, from Ahrefs' earlier 75,000-brand analysis of AI Overviews. Volume on its own barely registers.",
      },
      {
        label: "Pages on the site",
        value: "~0.19",
        body: "Publishing more pages, by itself, correlates least of all.",
      },
    ],
    outcome:
      "Read it top to bottom as a priority order for effort, not a formula. Ahrefs treats 0.6 and up as strong and the 0.5 range as moderate; everything from Domain Rating down is weak by the usual reading. The values are correlations, and Ahrefs is explicit that they don't prove cause — so treat the ladder as a guide to where effort is likeliest to show up, and confirm it with your own citation data.",
  },

  related: [
    "backlinks",
    "keyword-difficulty",
    "brand-mentions",
    "anchor-text",
    "topical-authority",
    "ai-visibility",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Domain authority estimates how well you might rank; Rankbox's citation tracking shows where your brand actually shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation.",
  },
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "What ChatGPT cites, including the brand-mention signals that outweigh domain rating.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "Which index each answer engine searches, and how to get into it.",
    },
  ],
  sources: [
    {
      title: "Domain Authority: what is it and how is it calculated",
      publisher: "Moz",
      href: "https://moz.com/learn/seo/domain-authority",
    },
    {
      title: "What is Domain Rating (DR)?",
      publisher: "Ahrefs Help Center",
      href: "https://help.ahrefs.com/en/articles/1409408-what-is-domain-rating-dr",
    },
    {
      title: "Authority Score",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/747-authority-score",
    },
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title: "Spam policies for Google web search (link spam)",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/essentials/spam-policies",
    },
    {
      title: "December 2022 link spam update",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2022/12/december-22-link-spam-update",
    },
    {
      title: "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
    {
      title: "An analysis of AI Overview brand visibility factors (75K brands)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-brand-correlation/",
    },
  ],
};
