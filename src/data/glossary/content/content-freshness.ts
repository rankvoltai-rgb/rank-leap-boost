import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "content-freshness",
  metaTitle: "What Is Content Freshness? How Google and AI Engines Weigh Recency",
  metaDescription:
    "Content freshness is how recently a page was substantively updated. How Google's freshness systems work, which AI engines favor new pages, and when to update.",
  keywords: [
    "content freshness",
    "freshness SEO",
    "query deserves freshness",
    "QDF",
    "how often should you update content",
    "do AI engines prefer fresh content",
  ],

  whyItMatters:
    "Your best article from last year loses ground as newer pages appear, and AI engines notice sooner than Google does: ChatGPT's citations average more than a year newer than Google's organic results. For a small team that's leverage as well as risk — updating five pages that already rank is faster than writing five new ones, and a competitor's stale page is one of the few openings a bigger brand leaves.",

  questions: [
    {
      id: "google",
      question: "Does content freshness affect Google rankings?",
      answer:
        "Content freshness affects Google rankings for queries where recent information is expected — news, events, new releases, fast-changing topics — through what Google calls “query deserves freshness” systems, while for stable topics an older page that answers better can still outrank a newer one.",
      blocks: [
        {
          kind: "p",
          text: "Google's ranking systems guide describes “various ‘query deserves freshness’ systems designed to show fresher content for queries where it would be expected.” Its examples: someone searching for a movie that's just been released probably wants recent reviews, and a search for “earthquake” normally returns preparation guides — until an earthquake happens, when news and fresher pages appear.",
        },
        {
          kind: "p",
          text: "The idea is old. Google's 2011 freshness update, which it said affected about 35% of searches, targeted recent events and hot topics, regularly recurring events and subjects that change often. Google weighs freshness query by query, not as a blanket bonus for new pages.",
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Changing the date isn't updating",
          text: "Google's helpful-content guidance asks directly: “Are you changing the date of pages to make them seem fresh when the content has not substantially changed?” Its byline-date documentation says dates must describe the page's publication or update. Show a visible “Last updated” date and keep `dateModified` in step with it.",
        },
      ],
    },
    {
      id: "ai-engines",
      question: "Do AI engines prefer fresh content?",
      answer:
        "Most AI engines cite noticeably fresher pages than Google ranks: across about 17 million citations, Ahrefs found AI assistants cited content 25.7% newer than organic results, with ChatGPT leaning hardest and Google AI Overviews showing no freshness premium at all.",
      blocks: [
        {
          kind: "table",
          head: [
            "Where the page was cited",
            "Average age of cited pages",
            "Compared with Google organic",
          ],
          rows: [
            ["**ChatGPT**", "958 days", "458 days newer"],
            ["**Copilot**", "1,056 days", "360 days newer"],
            ["**Gemini**", "1,118 days", "298 days newer"],
            ["**Perplexity**", "1,166 days", "250 days newer"],
            ["**Google AI Overviews**", "1,432 days", "16 days older"],
            ["**Google organic results**", "1,416 days", "—"],
          ],
        },
        {
          kind: "p",
          text: "Figures from [Ahrefs' July 2025 study](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/), which also found ChatGPT and Perplexity tend to place newer sources earlier in their citations. The engines' own documentation explains part of the gap:",
        },
        {
          kind: "signals",
          items: [
            {
              title: "Perplexity filters stale pages",
              body: "Its index stores published and last-updated dates, and prefilters remove “clearly non-responsive or stale content” before ranking begins.",
              evidence: "official",
            },
            {
              title: "Claude sees each page's age",
              body: "Every Claude web search result reaches the model with a `page_age` field — when the page was last updated — alongside its URL and title.",
              evidence: "official",
            },
            {
              title: "ChatGPT rewards recent updates",
              body: "SE Ranking found pages updated within the past three months averaged 6.0 ChatGPT citations against 3.6.",
              evidence: "observed",
            },
            {
              title: "Google applies Search's rules",
              body: "AI Overviews run on Google's core ranking systems, so freshness likely matters where query-deserves-freshness systems expect it — consistent with Ahrefs finding no overall premium.",
              evidence: "our-read",
            },
          ],
        },
      ],
    },
    {
      id: "how-often",
      question: "How often should you update content?",
      answer:
        "Update content whenever its facts change, and review pages you want cited at least quarterly: SE Ranking found pages updated within the past three months averaged nearly double the ChatGPT citations (6.0 vs 3.6) across 129,000 domains.",
      blocks: [
        {
          kind: "p",
          text: "What counts is a substantive update — one a returning reader would notice:",
        },
        {
          kind: "list",
          ordered: true,
          items: [
            "**Re-check every number, price and date** against its source, and replace anything superseded.",
            "**Answer the questions that appeared since you published** — new features, new competitors, new rules — as new sections.",
            "**Cut what's wrong or dead**: outdated screenshots, broken links, advice that no longer applies.",
            "**Update the visible date and `dateModified` together**, and only after the content changed.",
            "**Keep the URL.** Update in place so the page keeps its links and history; a new URL has to earn both again.",
          ],
        },
        {
          kind: "p",
          text: "Then help engines notice: an accurate `lastmod` in your [XML sitemap](/glossary/xml-sitemap), and an [IndexNow](/glossary/indexnow) ping for Bing — Microsoft is one of ChatGPT's named search providers. Pages that no longer match any live question aren't refresh candidates at all — they're [content decay](/glossary/content-decay) to consolidate or retire.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with content freshness",
      answer:
        "The most common content freshness mistakes are changing the date without changing the content, putting the current year in titles of pages that weren't updated, and publishing a new post on a topic an existing page already covers, which splits signals instead of renewing them.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Bumping the date makes a page fresh.",
              reality:
                "Google asks outright whether you change dates “when the content has not substantially changed,” and Perplexity's index stores both dates. A fake refresh spends trust for nothing.",
            },
            {
              myth: "Adding this year to the title is enough.",
              reality:
                "Claude writes the year into nearly every search, so a dated title helps you match — but only if the page behind it was actually updated that year.",
            },
            {
              myth: "Freshness matters equally everywhere.",
              reality:
                "Ahrefs found Google AI Overviews cite pages about as old as organic results, while ChatGPT's cited pages ran 458 days newer. Weigh freshness by engine and by query.",
            },
            {
              myth: "A newer page always beats a better one.",
              reality:
                "Freshness is one signal among many. A recent page that doesn't answer the question still loses — to an older page that does, or to one with more [information gain](/glossary/information-gain).",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The Freshness Clock",
    summary:
      "Five reference points for deciding when a page needs a real update. The first four come from published citation studies; the last is a rule of thumb, labelled as one.",
    items: [
      {
        label: "The ChatGPT refresh window",
        value: "≤ 90 days",
        body: "Pages updated within the past three months averaged 6.0 ChatGPT citations against 3.6 (SE Ranking, 129,000 domains). Keep the pages you most want cited inside this window.",
      },
      {
        label: "ChatGPT's recency gap",
        value: "458 days",
        body: "ChatGPT's cited pages averaged 958 days old, against 1,416 for Google's organic results (Ahrefs, July 2025). A page that is only as fresh as what ranks is still old by ChatGPT's standards.",
      },
      {
        label: "Perplexity's recency gap",
        value: "250 days",
        body: "Perplexity's citations averaged 1,166 days old, and its index prefilters stale content before ranking. Give it an honest updated date to read.",
      },
      {
        label: "Google AI Overviews' premium",
        value: "≈ 0",
        body: "AI Overviews cited pages 16 days older than organic results on average (Ahrefs). For Google, freshness matters where its query-deserves-freshness systems expect it, not everywhere.",
      },
      {
        label: "The dated-page rule (rule of thumb)",
        value: "12 months",
        body: "Any page with a year in its title, a “best” list or prices gets a substantive review at least every 12 months, sooner if its facts change. With the year in 94% of Claude's sub-queries (Profound), a stale year is a visible mismatch.",
      },
    ],
    outcome:
      "Sort your pages by last substantive update. Anything that ranks or gets cited and sits past its window goes to the top of the refresh queue; anything past 12 months with no traffic or citations is a consolidation candidate, not a refresh.",
  },

  related: [
    "content-decay",
    "knowledge-cutoff",
    "xml-sitemap",
    "indexnow",
    "retrieval-augmented-generation",
    "information-gain",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation, so you can see which pages are still being cited and decide which to update first.",
  },
  further: [
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description: "How Perplexity stores page dates and filters stale content before ranking.",
    },
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description: "Freshness, IndexNow and the other signals behind ChatGPT's citations.",
    },
  ],
  sources: [
    {
      title: "A guide to Google Search ranking systems",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ranking-systems-guide",
    },
    {
      title: "Creating helpful, reliable, people-first content",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title: "Influence your byline dates in Google Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/publication-dates",
    },
    {
      title: "Giving you fresher, more recent search results",
      publisher: "Google",
      href: "https://googleblog.blogspot.com/2011/11/giving-you-fresher-more-recent-search.html",
    },
    {
      title: "Do AI assistants prefer to cite fresh content?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
    },
    {
      title: "How to optimize for ChatGPT",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/how-to-optimize-for-chatgpt/",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "Web search tool",
      publisher: "Claude Developer Platform",
      href: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
  ],
};
