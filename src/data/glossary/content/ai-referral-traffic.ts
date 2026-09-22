import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "ai-referral-traffic",
  metaTitle: "What Is AI Referral Traffic? How to Track It in GA4 (2026)",
  metaDescription:
    "AI referral traffic is visits from links in ChatGPT, Perplexity, Gemini, Claude and Copilot. How to track it in GA4, the regex to use, and why it's undercounted.",
  keywords: [
    "AI referral traffic",
    "AI traffic in GA4",
    "how to track ChatGPT traffic in Google Analytics",
    "GA4 AI Assistant channel",
    "AI referral traffic regex",
    "LLM traffic",
  ],

  whyItMatters:
    "AI referral traffic is the one part of AI visibility that lands in the analytics you already report on, which makes it the easiest way to show a founder or a board that AI answers send real people. It's also easy to get wrong: GA4 groups only some assistants by default and some AI clicks arrive with no referrer at all, so an untuned setup undercounts the very channel you're trying to grow.",

  questions: [
    {
      id: "how-to-track-in-ga4",
      question: "How do you track AI referral traffic in GA4?",
      answer:
        "Track AI referral traffic in GA4 with the AI Assistant default channel, added on 13 May 2026, plus a custom channel group whose regex rule, placed above Referral, catches the assistants the default list doesn't name — Claude and Perplexity above all.",
      blocks: [
        {
          kind: "p",
          text: "GA4's **AI Assistant** channel covers sessions whose medium is `ai-assistant`, which GA4 sets when the referrer matches Google's list of assistants. Google's [channel documentation](https://support.google.com/analytics/answer/9756891) names ChatGPT, Gemini, DeepSeek, Copilot and Grok — not Claude or Perplexity, whose visits typically still land in Referral. The channel isn't retroactive, and it excludes Google's own AI Overviews and AI Mode, which stay in Organic Search.",
        },
        {
          kind: "p",
          text: "The default channel group can't be edited, so create a custom one under Admin → Data display → Channel groups, keep the default rules, and add an AI rule above Referral with a condition on source — GA4 assigns each session to the first channel it matches, so order matters:",
        },
        {
          kind: "code",
          lang: "GA4 regex",
          code: '# Custom channel "AI assistants", placed above Referral\n# Condition: Source matches regex\n^(.*\\.)?(chatgpt\\.com|openai\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com)$',
        },
        {
          kind: "list",
          items: [
            "**Know what's tagged.** OpenAI's publisher FAQ says ChatGPT adds `utm_source=chatgpt.com` to its referral links. Tag your own AI ads and product feeds with their own mediums, so paid clicks don't inflate the organic count.",
            "**Extend the rule as assistants appear.** Check Referral once a month for AI domains the regex misses, and add them.",
          ],
        },
      ],
    },
    {
      id: "how-each-assistant-shows-up",
      question: "How does each AI assistant show up in analytics?",
      answer:
        "Each AI assistant shows up differently: ChatGPT arrives from chatgpt.com with a UTM tag, Gemini and Copilot fall into GA4's AI Assistant channel, Claude and Perplexity arrive as untagged referrals, and clicks from Google's AI Overviews are folded into Organic Search.",
      blocks: [
        {
          kind: "table",
          head: ["Engine", "Referrer", "Tagged?", "Default GA4 channel"],
          rows: [
            ["**ChatGPT**", "`chatgpt.com`", "`utm_source=chatgpt.com`", "AI Assistant"],
            ["**Gemini**", "`gemini.google.com`", "Not documented", "AI Assistant"],
            ["**Copilot**", "`copilot.microsoft.com`", "Not documented", "AI Assistant"],
            ["**Perplexity**", "`perplexity.ai`", "No", "Referral — needs a custom rule"],
            ["**Claude**", "`claude.ai`", "No", "Referral — needs a custom rule"],
            [
              "**Google AI Overviews & AI Mode**",
              "`google.com`",
              "No",
              "Organic Search — can't be separated",
            ],
          ],
        },
        {
          kind: "stats",
          items: [
            {
              value: "13.2%",
              label:
                "of AI referral traffic came from Gemini in April 2026, up from 4.3% — second only to ChatGPT",
              source: {
                name: "BrightEdge, May 2026",
                href: "https://www.brightedge.com/news/press-releases/brightedge-data-gemini-second-largest-ai-referral-source-q1-2026",
              },
            },
            {
              value: "60%",
              label:
                "of AI-referred visits land on homepages, against 17% of organic search visits",
              source: {
                name: "SE Ranking, Jul 2026",
                href: "https://seranking.com/blog/chatgpt-referral-traffic-may-2026/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "The homepage skew matters for reporting. Since May 2026 ChatGPT has made brand names clickable inside its answers, so many AI visits arrive at the front door rather than on the article that earned the citation. Judge AI traffic by channel, not only by which blog posts it lands on. The engine guides cover each referrer in detail — start with [ChatGPT](/ai-seo/chatgpt).",
        },
      ],
    },
    {
      id: "why-undercounted",
      question: "Why is AI referral traffic undercounted?",
      answer:
        "AI referral traffic is undercounted because some AI clicks arrive without a referrer and land in Direct, clicks from Google's AI answers are counted as Organic Search, and many buyers see your name in an answer, don't click, and come back later through search or by typing your URL.",
      blocks: [
        {
          kind: "list",
          items: [
            "**Missing referrers.** Seer Interactive notes that when AI links carry no UTM or referral data, the visit \"will likely appear as 'Direct' in GA4.\" Practitioners report it for app traffic, and for Gemini running as the Android assistant.",
            "**Google's AI features.** Clicks from [AI Overviews](/glossary/ai-overviews) and [AI Mode](/glossary/ai-mode) arrive from google.com as Organic Search. [Search Console](/glossary/google-search-console)'s generative AI report shows their impressions, but their clicks are blended into ordinary web totals.",
            "**Mentions without links.** In Semrush's June 2026 study, Gemini named brands in 83.7% of their appearances but linked them in only 21.4%. A buyer who reads your name and searches for it later shows up as branded search or Direct.",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Use server logs as a demand signal",
          text: "Hits from `ChatGPT-User`, `Claude-User` and `Perplexity-User` mean a live conversation fetched your page. They aren't visits, but a rising count on one URL is early evidence the page is being used in answers.",
        },
      ],
    },
    {
      id: "traffic-vs-visibility",
      question: "AI referral traffic vs AI visibility: what's the difference?",
      answer:
        "AI referral traffic counts the visits AI answers send to your site; AI visibility counts how often those answers name or cite you at all — so visibility is the larger number, and referral traffic is the lagging proof that it pays.",
      blocks: [
        {
          kind: "p",
          text: "They measure different steps of one journey. [AI visibility](/glossary/ai-visibility) comes from [prompt tracking](/glossary/prompt-tracking); referral traffic comes from analytics. The gap between them can be wide: on Google searches that showed an AI summary, Pew Research found users clicked a link inside the summary on just 1% of visits. A brand can be cited constantly and still see little direct traffic from it.",
        },
        {
          kind: "table",
          head: ["", "AI visibility", "AI referral traffic"],
          rows: [
            [
              "**What it counts**",
              "Answers that name or cite you",
              "Sessions that arrive from an AI link",
            ],
            [
              "**Where it's measured**",
              "A prompt panel; Search Console's AI report for Google",
              "GA4 or your analytics tool",
            ],
            ["**Catches unlinked mentions**", "Yes", "No"],
            ["**Ties to revenue**", "Indirectly", "Directly, through conversions"],
          ],
        },
        {
          kind: "p",
          text: "Report them side by side. Visibility says whether you're on the shortlist; referral traffic and its conversions say whether being on the shortlist is paying off.",
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Four-Net AI Traffic Setup",
    summary:
      "No single report catches every AI click, so set four nets of decreasing precision and report the result as a range: a floor you can prove and a signal you can defend.",
    items: [
      {
        label: "The default net",
        body: "GA4's AI Assistant channel, which has grouped ChatGPT, Gemini, Copilot, DeepSeek and Grok since 13 May 2026. **Check:** the Traffic acquisition report, filtered to AI Assistant.",
      },
      {
        label: "The regex net",
        body: "A custom channel group with an AI rule above Referral, catching `claude.ai`, `perplexity.ai` and anything else the default list misses. **Check:** once it's live, Referral should hold no AI domains.",
      },
      {
        label: "The landing-page net",
        body: "Direct sessions on deep pages nobody types from memory — a comparison page, a long how-to — especially once the page starts appearing in your prompt panel. **Check:** Direct landings on a page before and after it's cited.",
      },
      {
        label: "The self-reported net",
        body: "A “How did you hear about us?” field on sign-up and demo forms with ChatGPT and other assistants as options. **Check:** the share naming an assistant against what the first two nets show.",
      },
    ],
    outcome:
      "The first two nets are your floor — AI traffic you can prove. The last two are the evidence that the true figure is higher. Report both, and the conversation moves from “AI sends us almost nothing” to “AI sends at least this much, and here's why it's more.”",
  },

  related: [
    "ai-visibility",
    "prompt-tracking",
    "ai-citation",
    "zero-click-search",
    "google-search-console",
    "ai-share-of-voice",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Analytics shows the clicks that arrive. Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews, and which article earned each citation — the visibility behind the visits.",
  },
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "ChatGPT's referrer and UTM tagging, the GA4 setup, and the server-log view of ChatGPT-User hits.",
    },
    {
      title: "Claude SEO: the technical guide",
      href: "/ai-seo/claude",
      description:
        "Why claude.ai traffic lands in Referral, the regex that fixes it, and how to read Claude-User hits.",
    },
  ],
  sources: [
    {
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      title: "Custom channel groups",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/13051316",
    },
    {
      title: "Publishers and developers FAQ",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/12627856-publishers-and-developers-faq",
    },
    {
      title: "Generative AI performance report",
      publisher: "Search Console Help",
      href: "https://support.google.com/webmasters/answer/16984139",
    },
    {
      title: "Your AI traffic is hiding: a practical guide to tracking ChatGPT, Claude and more",
      publisher: "Seer Interactive",
      href: "https://www.seerinteractive.com/insights/are-ai-sites-like-chatgpt-sending-your-website-traffic",
    },
    {
      title: "Referral traffic from ChatGPT hit an all-time high in May 2026",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/chatgpt-referral-traffic-may-2026/",
    },
    {
      title: "Gemini becomes the second-largest AI referral source",
      publisher: "BrightEdge",
      href: "https://www.brightedge.com/news/press-releases/brightedge-data-gemini-second-largest-ai-referral-source-q1-2026",
    },
    {
      title: "Google users are less likely to click on links when an AI summary appears",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
    {
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
  ],
};
