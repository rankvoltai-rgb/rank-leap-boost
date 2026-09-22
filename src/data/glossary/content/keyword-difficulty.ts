import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "keyword-difficulty",
  metaTitle: "What Is Keyword Difficulty? How KD Works and When to Trust It",
  metaDescription:
    "Keyword difficulty is a third-party 0–100 estimate of how hard a query is to rank for. How Ahrefs and Semrush calculate it, what a good score is, and AI search.",
  keywords: [
    "keyword difficulty",
    "KD",
    "what is keyword difficulty",
    "what is a good keyword difficulty score",
    "keyword difficulty Ahrefs vs Semrush",
    "keyword difficulty for AI search",
  ],

  whyItMatters:
    "Keyword difficulty is how a small team avoids spending three months on a topic it was never going to win. Used well, it points a young site at the questions where today's ranking pages are beatable; used badly, it steers you away from the specific, low-competition questions that AI engines increasingly search on your buyer's behalf.",

  questions: [
    {
      id: "how-calculated",
      question: "How is keyword difficulty calculated?",
      answer:
        "Keyword difficulty is calculated mostly from the backlink strength of the pages in Google's top 10 today: Ahrefs counts how many sites link to each of them, while Semrush blends referring domains, link types, authority scores and SERP features — so each tool gives the same keyword a different score.",
      blocks: [
        {
          kind: "table",
          head: ["Score", "Main inputs", "Output"],
          rows: [
            [
              "**Ahrefs KD**",
              "How many websites link to each of the top 10 ranking pages",
              "0–100, read as a rough link budget",
            ],
            [
              "**Semrush KD%**",
              "Median referring domains to the top 10, median dofollow-to-nofollow ratio, median Authority Score of the ranking domains, and SERP features",
              "0–100, in six bands from very easy to very hard",
            ],
            [
              "**Semrush Personal KD**",
              "Adds your own domain's topical relevance and metrics against the competitors on the results page",
              "A score for your site specifically",
            ],
          ],
        },
        {
          kind: "p",
          text: "Ahrefs frames its score as roughly how many referring domains a page needs to reach the first page. At the bottom of the scale the top pages have few backlinks; around KD 50 they have a couple of hundred; above 90, thousands. None of these tools reads Google's ranking systems. Keyword difficulty is a model of the current results page built largely from [backlink](/glossary/backlinks) data — not a Google metric.",
        },
        {
          kind: "callout",
          tone: "note",
          title: "Scores don't transfer between tools",
          text: "Each tool uses its own inputs and scale, so the same keyword gets different numbers. Pick one tool and compare keywords only inside it.",
        },
      ],
    },
    {
      id: "good-score",
      question: "What is a good keyword difficulty score?",
      answer:
        "A good keyword difficulty score is one at or below what your site already ranks for. Semrush labels 0–14 very easy and 30–49 possible, but a young site with few backlinks should start far lower than an established one, because the score ignores who is trying.",
      blocks: [
        {
          kind: "table",
          head: ["Semrush KD%", "Band", "What Semrush says it takes"],
          rows: [
            [
              "0–14",
              "Very easy",
              "The best chance to rank new pages quickly, with the least effort",
            ],
            [
              "15–29",
              "Easy",
              "Achievable even for a new domain, with quality content focused on intent",
            ],
            [
              "30–49",
              "Possible",
              "Quality, well-structured content properly optimized for the keyword",
            ],
            [
              "50–69",
              "Difficult",
              "Some quality backlinks plus well-structured, optimized content",
            ],
            ["70–84", "Hard", "Better-quality backlinks supporting well-optimized, unique content"],
            [
              "85–100",
              "Very hard",
              "High-quality content and link building, plus on-page SEO and promotion",
            ],
          ],
        },
        {
          kind: "p",
          text: "The bands describe an average site. Ahrefs is explicit that its score doesn't account for your own site's authority, content quality, [search intent](/glossary/search-intent) match or freshness. The practical fix is to calibrate the score against yourself — the worked example below shows how.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does keyword difficulty matter for AI search?",
      answer:
        "Keyword difficulty matters less for AI search than for Google rankings, because AI engines rewrite each prompt into narrower sub-queries and often cite pages outside the top 10 — so a high-difficulty head term can still be reached through the easier questions around it.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "37.9%",
              label:
                "of pages cited in Google AI Overviews rank in the top 10 for the query the user typed",
              source: {
                name: "Ahrefs, Mar 2026",
                href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
              },
            },
            {
              value: "~8%",
              label:
                "of ChatGPT's citations rank in Google's or Bing's top 10 for the original prompt",
              source: {
                name: "Ahrefs, Aug 2025",
                href: "https://ahrefs.com/blog/ai-search-overlap/",
              },
            },
            {
              value: "0.218",
              label:
                "correlation between backlinks and brand visibility in AI Overviews, against 0.664 for branded web mentions",
              source: {
                name: "Ahrefs, 75K brands",
                href: "https://ahrefs.com/blog/ai-overview-brand-correlation/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Keyword difficulty measures the links behind one results page; AI engines [fan the question out](/glossary/query-fan-out) and pick passages from many. That makes KD a weaker guide to who gets cited, and it means [long-tail keywords](/glossary/long-tail-keywords) with low volume and low difficulty often match the sub-queries an engine writes. Claude adds a twist: it searches Brave, not Google, so a Google-based score says little about [Claude](/ai-seo/claude) at all.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Use KD to choose, not to rule out",
          text: "Low difficulty is still a good sign a question is winnable in Google and in AI Overviews, which are built on Google's index. A high score on a head term is a reason to target its sub-questions first, not to abandon the topic.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with keyword difficulty",
      answer:
        "The most common keyword difficulty mistakes are comparing scores across tools, treating KD as a Google metric, ignoring the results page and skipping zero-volume questions — each picks topics by something the number was never designed to measure.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "KD is how Google rates the keyword.",
              reality:
                "Google doesn't publish any difficulty score. KD is a vendor's model, built mostly from backlink data about the pages ranking today.",
            },
            {
              myth: "A low KD means I'll rank.",
              reality:
                "Ahrefs notes KD ignores content quality, intent and freshness. If the top results are a different page type from yours — tools, product pages, forum threads — the score won't save you. Read the [SERP](/glossary/serp) first.",
            },
            {
              myth: "Zero volume means zero value.",
              reality:
                "Specific buyer questions often show little or no volume in keyword tools, yet they can be exactly what buyers ask AI assistants. Judge them by intent.",
            },
            {
              myth: "A high-KD topic is off-limits.",
              reality:
                "It's off-limits as a head term for now. Its sub-questions usually aren't, and a [topic cluster](/glossary/topic-cluster) built from them earns the links and relevance to compete later.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "worked-example",
    name: "The KD Ceiling Test",
    summary:
      "A way to turn a generic difficulty score into a personal one: find the hardest keywords your site already ranks for and treat that as your ceiling. The inputs are illustrative, for a fictional project management tool called Plannora, and the 10-point stretch is a rule of thumb, not a vendor standard.",
    items: [
      {
        label: "Pull the queries you already rank for",
        body: "Search Console, last three months: non-branded queries with an average position of 10 or better.",
        value: "38 queries",
      },
      {
        label: "Find your ceiling",
        body: "Run all 38 through one keyword tool. The hardest queries Plannora holds in the top 10 score KD 21, 22 and 24.",
        value: "KD 24",
      },
      {
        label: "Set the target band",
        body: "The ceiling plus about 10 points of stretch.",
        value: "KD ≤ 34",
      },
      {
        label: "Filter the candidate list",
        body: "Of 50 candidate buyer questions from research, 19 fall inside the band.",
        value: "19 of 50",
      },
      {
        label: "Winnable topics",
        body: "Drop the questions whose top results are a different page type — tools, product pages, forum threads — from the article Plannora would write.",
        value: "12 topics",
      },
    ],
    outcome:
      "Twelve topics Plannora can realistically win now, instead of fifty ranked by a score built for an average site. Recalculate the ceiling each quarter: as the site earns links, the ceiling rises and the next band opens. Semrush's Personal Keyword Difficulty automates a version of the same idea inside its tool.",
  },

  related: [
    "long-tail-keywords",
    "search-intent",
    "backlinks",
    "domain-authority",
    "topical-authority",
    "serp",
  ],
  product: {
    feature: "answer-space-research",
    pitch:
      "Rankbox maps the questions your buyers ask ChatGPT, Perplexity and Google, scores each one for volume, difficulty and intent, and turns the winnable ones into articles.",
  },
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "Why most AI Overview citations now come from outside the top 10, and what that means for choosing topics.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "Which index each AI engine searches — and so which difficulty scores are relevant to it.",
    },
  ],
  sources: [
    {
      title: "Keyword difficulty: how to estimate your chances to rank",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/keyword-difficulty/",
    },
    {
      title: "Keyword Difficulty score",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/1158-what-is-kd",
    },
    {
      title: "How is Personal Keyword Difficulty calculated?",
      publisher: "Semrush Knowledge Base",
      href: "https://www.semrush.com/kb/1434-how-is-personal-keyword-difficulty-calculated",
    },
    {
      title: "How many AI Overview citations rank in the top 10?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-citations-top-10/",
    },
    {
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "An analysis of AI Overview brand visibility factors (75K brands studied)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overview-brand-correlation/",
    },
  ],
};
