import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "click-through-rate",
  metaTitle: "What Is Click-Through Rate (CTR)? Formula & the AI Overviews Effect",
  metaDescription:
    "Click-through rate is clicks divided by impressions. How to calculate CTR in Search Console, what a good organic CTR is now, and how AI Overviews change it.",
  keywords: [
    "click-through rate",
    "CTR",
    "organic CTR",
    "how to calculate click-through rate",
    "what is a good CTR for SEO",
    "AI Overviews CTR",
  ],

  whyItMatters:
    "Click-through rate is where rankings turn into visits, so it decides whether the pages you fought to rank actually feed the pipeline. It's also where AI Overviews hit hardest, and for a small team, knowing whether a falling CTR means a weak title or an AI answer sitting above you saves weeks of rewriting the wrong thing.",

  questions: [
    {
      id: "how-to-calculate",
      question: "How do you calculate click-through rate?",
      answer:
        "Calculate click-through rate by dividing clicks by impressions and multiplying by 100: a page with 150 clicks from 6,000 impressions has a 2.5% CTR. Google Search Console calculates it for you for every query, page, country and device.",
      blocks: [
        {
          kind: "code",
          lang: "formula",
          code: "CTR = clicks ÷ impressions × 100\n\n150 clicks ÷ 6,000 impressions × 100 = 2.5%",
        },
        {
          kind: "p",
          text: "What counts as an impression and a click is set by the platform. In [Google Search Console](/glossary/google-search-console), an impression means a user saw, or potentially saw, a link to your site, and a click is any click that takes the user to a page outside Google Search. Three rules matter now that AI answers share the page:",
        },
        {
          kind: "list",
          items: [
            "**AI Overviews** occupy a single position, and every link inside one is assigned that position. Clicking a link in the Overview counts as a click.",
            "**AI Mode** counts positions, impressions and clicks the same way as a regular results page.",
            "**The generative AI report** shows impressions only, with no clicks — so Search Console can't give you an AI-only CTR, and the web report blends AI features into its totals.",
          ],
        },
      ],
    },
    {
      id: "good-ctr",
      question: "What is a good click-through rate for organic search?",
      answer:
        "A good organic click-through rate depends on your position, the query and what else is on the results page, so the useful benchmark is your own CTR for the same position and SERP type. In Seer Interactive's 2026 study, informational queries without an AI Overview averaged about 3.4%.",
      blocks: [
        {
          kind: "p",
          text: "Averages hide the drivers. CTR falls steeply with position, and falls again when ads, a [featured snippet](/glossary/featured-snippet) or an AI Overview sit above the organic results. Branded queries usually click through far more than non-branded ones, because the searcher already wants you. Compare like with like:",
        },
        {
          kind: "list",
          items: [
            "**By query type:** branded against non-branded, and question-shaped queries against short head terms.",
            "**By position band:** 1–3, 4–10 and 11–20 behave like different channels.",
            "**By SERP:** queries that show an AI Overview against those that don't — the benchmark further down gives reference points for each.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Branded CTR hides everything",
          text: "A handful of branded queries with very high CTR can mask a slide across hundreds of non-branded ones. Filter them out before you judge a trend.",
        },
      ],
    },
    {
      id: "ai-overviews-effect",
      question: "How do AI Overviews affect click-through rate?",
      answer:
        "AI Overviews lower click-through rate for the pages below them: Ahrefs measured a 58% lower average CTR for the top-ranking page when an Overview appears. Being cited inside the Overview softens the loss, and Seer found cited brands earn about 120% more clicks per impression than uncited ones.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "8% vs 15%",
              label:
                "of visits clicked a classic result with an AI summary present, versus without one",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
            {
              value: "1%",
              label:
                "of visits to results pages with an AI summary included a click on a link inside it",
              source: {
                name: "Pew Research, Jul 2025",
                href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
              },
            },
            {
              value: "68%",
              label: "of US Google searches ended without a click in January–April 2026",
              source: {
                name: "SparkToro, Jun 2026",
                href: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "The effect isn't evenly spread. Pew found AI summaries on 60% of searches that begin with a question word, against 8% of one- or two-word searches, so informational content feels it first. Seer's figures show why citation is now a defensive goal: per million informational impressions, roughly 33,500 clicks with no Overview, 20,700 when the brand is cited and 9,400 when it isn't. Seer is clear this is correlation — stronger brands are also more likely to be cited.",
        },
        {
          kind: "p",
          text: "The wider trend is the rise of [zero-click search](/glossary/zero-click-search): SparkToro puts it at about 45% of Google searches a decade ago and 68% today.",
        },
      ],
    },
    {
      id: "how-to-improve",
      question: "How do you improve click-through rate?",
      answer:
        "Improve click-through rate by finding queries where you rank well but earn few clicks, then rewriting the title and meta description to match what that searcher wants — and, where an AI Overview sits above you, by becoming a source it cites.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Find the gap.** In Search Console, filter to non-branded queries in positions 1–10 and sort by impressions. High impressions with a CTR well below similar queries make the shortlist.",
            "**Check the SERP first.** If an AI Overview, ads or a featured snippet sit above you, a new title won't restore the old CTR. Read the [SERP](/glossary/serp) before rewriting anything.",
            "**Rewrite the [title tag](/glossary/title-tag).** Make it descriptive, specific and matched to intent. Google may still rewrite it: it builds title links from the title element, headings, prominent text and even the anchor text of links to the page.",
            '**Rewrite the [meta description](/glossary/meta-description).** Google says snippets are "primarily created from the page content itself" and uses the meta description when it describes the page more accurately, so make it specific to that page.',
            "**Earn the citation.** On AI Overview queries, the cited page keeps more of the clicks. Answer the likely sub-questions early and directly — see [answer-first content](/glossary/answer-first-content).",
          ],
        },
        {
          kind: "p",
          text: "Give each change about four weeks, then compare the same queries in the same position band — not the sitewide average.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with click-through rate",
      answer:
        "The most common click-through rate mistakes are judging a sitewide average, rewriting titles when an AI Overview is the real cause, and reading CTR without engagement — each one sends effort to a problem you don't have.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Our average CTR fell, so our titles got worse.",
              reality:
                "Sitewide CTR moves with the query mix. A new page ranking on page two for thousands of impressions drags the average down while every existing page holds steady.",
            },
            {
              myth: "A falling CTR always needs a new title.",
              reality:
                "If an AI Overview appeared above you, the ceiling moved. Check the results page and whether you're cited before rewriting.",
            },
            {
              myth: "Search Console shows my AI Overview CTR.",
              reality:
                "The generative AI report has impressions but no clicks, and the web report blends AI and classic results. There is no first-party AI-only CTR yet.",
            },
            {
              myth: "A higher CTR is always better.",
              reality:
                "A title that overpromises can lift CTR and send visitors straight back. Judge CTR alongside engaged sessions and conversions in analytics.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The AI Overview CTR Ladder",
    summary:
      "Four published reference points for organic click-through rate on today's Google, from Seer Interactive's 2026 study of 53 brands and Ahrefs' 300,000-keyword analysis. Use them to read a query's CTR against the results page it actually has.",
    items: [
      {
        label: "Informational query, no AI Overview",
        body: "About 33,500 organic clicks per million impressions (Seer Interactive, 2026 update).",
        value: "3.4%",
      },
      {
        label: "AI Overview shown, your brand cited",
        body: "About 20,700 clicks per million informational impressions; 2.07% averaged across 2025 (Seer).",
        value: "2.1%",
      },
      {
        label: "AI Overview shown, your brand not cited",
        body: "About 9,400 clicks per million informational impressions; 0.94% averaged across 2025 (Seer).",
        value: "0.9%",
      },
      {
        label: "Position 1 when an AI Overview appears",
        body: "The top-ranking page's average CTR against what it would have been without the Overview, comparing December 2023 with December 2025 (Ahrefs, 300,000 keywords).",
        value: "−58%",
      },
    ],
    outcome:
      "Read a query's CTR against the row that matches its results page, not against your sitewide average. A page at 0.9% on an AI Overview query where you aren't cited is performing about as expected — the fix is earning the citation, not rewriting the title. These are cross-brand averages and correlational, so treat them as reference points rather than targets.",
  },

  related: [
    "zero-click-search",
    "ai-overviews",
    "serp",
    "title-tag",
    "meta-description",
    "google-search-console",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web and writes source-backed articles in your brand's voice, with clear definitions and answer-first sections — the kind of passage an AI Overview can quote.",
  },
  tool: "serp-snippet-preview",
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "How Google picks the sources it cites, and what the 2026 click data shows for cited and uncited pages.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "The step-by-step playbook for becoming the page an Overview cites.",
    },
  ],
  sources: [
    {
      title: "How Search Console counts position, clicks and impressions",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/7042828",
    },
    {
      title: "How to write meta descriptions",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/snippet",
    },
    {
      title: "Influencing title links in Google Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/title-link",
    },
    {
      title: "AIO impact on Google CTR: 2026 update",
      publisher: "Seer Interactive",
      href: "https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update",
    },
    {
      title: "AI Overviews reduce clicks by 58%",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/",
    },
    {
      title: "Google users are less likely to click on links when an AI summary appears",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
    {
      title: "In 2026, less than one third of Google searches still send a click",
      publisher: "SparkToro",
      href: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
    },
  ],
};
