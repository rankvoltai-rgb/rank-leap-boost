import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "reddit-seo",
  metaTitle: "What Is Reddit SEO? Earning a Place in Threads Google and AI Read",
  metaDescription:
    "Reddit SEO is earning a genuine, disclosed place in Reddit threads that rank in Google and feed AI answers: what changed in 2026, what works, what gets you banned.",
  keywords: [
    "Reddit SEO",
    "Reddit marketing",
    "Reddit for AI search",
    "Reddit SEO strategy",
    "does Reddit help SEO",
    "Reddit ChatGPT citations",
    "how to market on Reddit",
  ],

  whyItMatters:
    "Reddit threads often rank for exactly the “which tool should I use” questions your buyers ask, and AI engines read them to gauge what real users think — so a competitor's honest recommendation there can outlast any ad. For a small team, one genuinely helpful, disclosed reply in the right thread is cheap to write and can keep being read for months; a fake one can get your account banned and your brand called out in public.",

  questions: [
    {
      id: "still-matters",
      question: "Does Reddit still matter for AI search?",
      answer:
        "Reddit still matters for AI search, but unevenly: it remains one of the most-cited domains in Gemini, Perplexity and Google's AI features, while its share of ChatGPT citations collapsed in August 2026 after ChatGPT shifted toward official sources.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "−86%",
              label:
                "Reddit's share of ChatGPT citations, from 3.8% (July 18–August 7) to 0.5% (August 14–17, 2026)",
              source: {
                name: "Promptwatch via Semrush, Aug 2026",
                href: "https://www.semrush.com/blog/reddits-citations-in-chatgpt-fall/",
              },
            },
            {
              value: "1.93%",
              label:
                "of the Reddit pages ChatGPT retrieved were cited, against 88% of pages from general search",
              source: {
                name: "Ahrefs, Apr 2026",
                href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
              },
            },
            {
              value: "28.5%",
              label:
                "of Gemini's citations among its 50 most-cited domains went to Reddit, the top domain",
              source: {
                name: "Ahrefs, Sep 2026",
                href: "https://ahrefs.com/blog/most-cited-domains-gemini/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "The ChatGPT drop lines up with a change around August 8, when [ChatGPT](/ai-seo/chatgpt) began fanning questions out into `site:` searches of brand, vendor and government domains. Promptwatch calls the size of the fall provisional, and OpenAI says it doesn't set a fixed visibility level for individual sites and still cites Reddit. Elsewhere the dip was far shallower: Reddit's share fell 11% in [AI Overviews](/glossary/ai-overviews) and 31% in [AI Mode](/glossary/ai-mode) over the same period, and it holds 46.7% of citations among Perplexity's top-10 domains, though only 6.6% of its citations overall.",
        },
        {
          kind: "p",
          text: "Ahrefs' data suggests ChatGPT uses Reddit more for context than for credit: Reddit pages made up 67.8% of the URLs it retrieved but didn't cite. See [AI citation](/glossary/ai-citation).",
        },
      ],
    },
    {
      id: "how-it-works",
      question: "How does Reddit SEO work?",
      answer:
        "Reddit SEO works by finding the threads that already rank in Google or get cited by AI engines for your buyers' questions, then adding a reply that genuinely answers the question, says who you are, and follows that subreddit's rules.",
      blocks: [
        {
          kind: "pipeline",
          steps: [
            {
              title: "Find threads that are already visible",
              body: "Search Google for your buyers' comparison and recommendation questions and note which Reddit threads make the [SERP](/glossary/serp); run the same questions through AI engines and note which threads they cite.",
              lever: "Prioritize threads that rank and are still open to replies.",
            },
            {
              title: "Read the rules and the room",
              body: "Check the subreddit's sidebar, wiki and pinned posts. Many communities ban self-promotion or confine it to set threads — respect that and move on.",
            },
            {
              title: "Answer the question first",
              body: "Lead with the most useful answer you can give, including alternatives when they fit better. Mention your product only if it genuinely solves the asker's problem.",
              lever: "Specifics beat pitches: setup steps, real limits, prices and trade-offs.",
            },
            {
              title: "Say who you are",
              body: "State plainly that you work for or founded the company. Communities expect it; finding out later is what turns a helpful reply into a removal and a public call-out.",
            },
            {
              title: "Stay for the follow-ups",
              body: "Answer questions and criticism in the thread. A reply that engages honestly reads as a person, not a campaign.",
            },
          ],
        },
        {
          kind: "p",
          text: 'Google values this kind of content explicitly. Its rater guidelines say forum discussions "are often High quality when they involve people sharing their experience" — see [E-E-A-T](/glossary/e-e-a-t) — and its [2024 partnership](https://blog.google/inside-google/company-announcements/expanded-reddit-partnership/) with Reddit gives it "real-time, structured, unique content" through Reddit\'s Data API. Since May 2026, AI Overviews and AI Mode also quote [forum discussions](https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/) with the community name attached.',
        },
      ],
    },
    {
      id: "rules",
      question: "What are Reddit's rules on self-promotion?",
      answer:
        "Reddit's sitewide rules require you to “participate authentically in communities where you have a personal interest” and not to spam, manipulate content or “intentionally mislead others” — and each subreddit adds its own rules, many of which restrict or ban self-promotion.",
      blocks: [
        {
          kind: "p",
          text: 'The [Reddit Rules](https://redditinc.com/policies/reddit-rules) are short. Rule 2: "Abide by community rules. Participate authentically in communities where you have a personal interest, and do not spam or engage in disruptive behaviors (including content manipulation) that interfere with Reddit communities." Rule 5: "Be authentic. You don\'t have to use your real name, but do not intentionally mislead others or impersonate an individual or entity in a deceptive manner."',
        },
        {
          kind: "p",
          text: "Reddit's [spam guidance](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam) adds that if your contributions consist mostly of links to a business you run or benefit from, you should be thoughtful about how often you post — or use Reddit's advertising platform instead. Moderators enforce each community's own rules on top.",
        },
        {
          kind: "requirements",
          items: [
            {
              label: "Follow each subreddit's rules",
              status: "required",
              note: "Read the sidebar, wiki and pinned posts before replying. If promotion is banned, the thread is off-limits, however perfect it looks.",
            },
            {
              label: "Disclose your affiliation",
              status: "required",
              note: "Rule 5 forbids misleading others. In the US, the FTC's 2024 rule also bans reviews and testimonials by company officers, managers and employees that hide the connection.",
            },
            {
              label: "Use one account: your own",
              status: "required",
              note: "No second accounts, bought accounts, paid posters or requests for upvotes — all content manipulation under Rule 2.",
            },
          ],
        },
      ],
    },
    {
      id: "vs-astroturfing",
      question: "Reddit SEO vs astroturfing: what's the difference?",
      answer:
        "Reddit SEO is genuine, disclosed participation — a real person from the company answering a question under their own name; astroturfing is faking grassroots support with hidden employees, paid posters, bought accounts or coordinated votes, which breaks Reddit's rules and, for fake reviews, US law.",
      blocks: [
        {
          kind: "table",
          head: ["", "Genuine participation", "Astroturfing"],
          rows: [
            [
              "**Who posts**",
              "You or a named teammate, from your own account",
              "Fake “customers,” paid posters, accounts bought for the job",
            ],
            [
              "**Disclosure**",
              "Says who you work for in the reply",
              "Hidden — the point is to look independent",
            ],
            [
              "**Content**",
              "Answers the question and names alternatives when they fit",
              "Plugs the product regardless of the question",
            ],
            [
              "**Votes**",
              "Whatever the reply earns",
              "Coordinated upvotes, or downvotes on rivals",
            ],
            [
              "**When it's discovered**",
              "Nothing to discover",
              "Removals, bans and public call-outs of the brand",
            ],
          ],
        },
        {
          kind: "callout",
          tone: "warning",
          title: "Astroturfing fails on every front",
          text: "Reddit's rules ban content manipulation, the FTC's 2024 rule bans fake reviews and undisclosed insider testimonials, and Google's AI guide warns that \"seeking inauthentic 'mentions' across the web isn't as helpful as it might seem.\" Each shortcut trades a small, temporary gain for a record that stays public. See [brand mentions](/glossary/brand-mentions).",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with Reddit SEO",
      answer:
        "The most common Reddit SEO mistakes are replying with a pitch instead of an answer, hiding the affiliation, posting in communities that ban promotion, and treating Reddit as a ChatGPT shortcut — a tactic whose payoff fell sharply in August 2026.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Reddit is the fastest way into ChatGPT answers.",
              reality:
                "Not since August 2026: Reddit's share of ChatGPT citations fell about 86%, and even before that, retrieved Reddit pages were cited under 2% of the time. Your own clearly titled pages now carry more weight. See [query fan-out](/glossary/query-fan-out).",
            },
            {
              myth: "A fresh account can start recommending the product right away.",
              reality:
                "Communities judge you by your history. An account whose only activity is recommending one product reads as promotion, however polite the replies.",
            },
            {
              myth: "Disclosing who you are kills the reply.",
              reality:
                "Disclosure is usually what lets the reply survive. Communities are used to founders answering questions; what they punish is finding out later.",
            },
            {
              myth: "More replies means more visibility.",
              reality:
                "One strong answer in a thread that ranks beats twenty in threads nobody reads. Choose threads by where they appear in Google and AI answers, not by volume.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Disclosed Reply Test",
    summary:
      "Five checks every Reddit reply should pass before it's posted — whoever drafted it. If any answer is no, don't post: rewrite the reply or move on to another thread.",
    items: [
      {
        label: "Rules: does this community allow it?",
        body: "Read the sidebar, wiki and pinned posts. If self-promotion is banned or limited to set threads, follow that, even when the thread looks perfect.",
      },
      {
        label: "Relevance: would you answer with no product to sell?",
        body: "Reply only where you genuinely know the answer. If the honest answer is a competitor or a spreadsheet, say so.",
      },
      {
        label: "Answer first: does the first paragraph help on its own?",
        body: "The asker should get value even if they never click or buy. Your product, if it appears at all, comes after the useful part.",
      },
      {
        label: "Disclosure: would a reader know who you are?",
        body: "A plain line such as “I'm the founder of Plannora, so I'm biased” — not buried in a username, not implied.",
      },
      {
        label: "Account: is it really you?",
        body: "Your own account with your own history, and nobody asked to upvote it. No second accounts, no paid posters.",
      },
    ],
    outcome:
      "Run the test on every draft, including ones a tool or an agency writes for you. A reply that passes all five is one you'd be happy to see quoted in an AI answer next to your brand name — which, in threads that rank, is exactly what can happen.",
  },

  related: ["brand-mentions", "ai-citation", "digital-pr", "query-fan-out", "e-e-a-t", "serp"],
  product: {
    feature: "reddit-presence",
    pitch:
      "Rankbox finds the Reddit threads that rank on Google and feed AI answers, drafts a genuinely useful reply that says who you are, and hands it to you to review and post under your own name — Rankbox never posts for you.",
  },
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description:
        "The August 2026 shift to site: searches, and what it did to Reddit's citations.",
    },
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description: "How often Perplexity really cites Reddit, and where community threads fit.",
    },
  ],
  sources: [
    {
      title: "Reddit Rules",
      publisher: "Reddit",
      href: "https://redditinc.com/policies/reddit-rules",
    },
    {
      title: "Spam",
      publisher: "Reddit Help",
      href: "https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam",
    },
    {
      title: "Reddit's citations in ChatGPT fall",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/reddits-citations-in-chatgpt-fall/",
    },
    {
      title: "Why ChatGPT cites one page over another (study of 1.4M prompts)",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/why-chatgpt-cites-pages/",
    },
    {
      title: "The 50 most-cited websites in Gemini",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/most-cited-domains-gemini/",
    },
    {
      title: "AI platform citation patterns",
      publisher: "Profound",
      href: "https://www.tryprofound.com/blog/ai-platform-citation-patterns",
    },
    {
      title: "How AI Mode and AI Overviews help you explore the web",
      publisher: "Google",
      href: "https://blog.google/products-and-platforms/products/search/explore-web-generative-ai-search/",
    },
    {
      title: "An expanded partnership with Reddit",
      publisher: "Google",
      href: "https://blog.google/inside-google/company-announcements/expanded-reddit-partnership/",
    },
    {
      title: "Federal Trade Commission announces final rule banning fake reviews and testimonials",
      publisher: "US Federal Trade Commission",
      href: "https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
  ],
};
