import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "digital-pr",
  metaTitle: "What Is Digital PR? How It Earns Links, Mentions and AI Citations",
  metaDescription:
    "Digital PR earns coverage, links and brand mentions with stories journalists want. How it works, how it differs from link building, and how to measure its AI impact.",
  keywords: [
    "digital PR",
    "what is digital PR",
    "digital PR vs link building",
    "digital PR for SEO",
    "digital PR for AI search",
    "link earning",
    "online PR",
  ],

  whyItMatters:
    "Digital PR is how a small company gets its name into the publications that buyers and AI models both read, without a big brand's budget. It's also the kind of link earning Google's own John Mueller has defended, because the coverage exists for readers first. And since AI answers lean heavily on earned media and third-party mentions, one good story now does double duty: it helps you rank, and it helps you get named.",

  questions: [
    {
      id: "how-it-works",
      question: "How does digital PR work?",
      answer:
        "Digital PR works by finding a story journalists and bloggers want to tell — original data, expert comment, a timely angle — packaging it so it's easy to report, and pitching it to the writers who cover that beat, who then link to or mention the source.",
      blocks: [
        {
          kind: "pipeline",
          steps: [
            {
              title: "Find a hook only you can supply",
              body: "Data from your product, a survey, a teardown, or a sharp expert view on a news story. Journalists need something new; a rewrite of what's already published isn't news.",
              lever:
                "Start with data you already collect. Aggregated, anonymized patterns from your own product are often the story.",
            },
            {
              title: "Build the asset",
              body: "A page on your own site with the findings, the method, charts and quotable lines. Coverage links here, so it has to hold up to scrutiny.",
              lever:
                "Put the headline number in the first sentence, with the sample size and date beside it.",
            },
            {
              title: "Pitch the right writers",
              body: "A short, personal email to reporters who cover the beat, with the finding in the subject line. Relevance beats volume.",
              lever: "Read what each writer has covered recently before you pitch them.",
            },
            {
              title: "Coverage links or names you",
              body: "Publishers decide whether to link and how. Some links will carry `nofollow` or be left out entirely; the mention still counts with readers and with AI engines.",
            },
          ],
        },
        {
          kind: "p",
          text: 'Google has no quarrel with this kind of coverage. Its [guidance on contributed articles](https://developers.google.com/search/blog/2017/05/a-reminder-about-links-in-large-scale) says Google doesn\'t discourage them when they "inform users, educate another site\'s audience or bring awareness to your cause or company," and John Mueller has [called](https://www.searchenginejournal.com/john-mueller-praises-digital-pr/393464/) digital PR "just as critical as tech SEO, probably more so in many cases."',
        },
      ],
    },
    {
      id: "digital-pr-vs-link-building",
      question: "Digital PR vs link building: what's the difference?",
      answer:
        "Link building is any effort to get other sites to link to yours, while digital PR is the subset that earns links and mentions through newsworthy stories placed by editors, so it produces fewer but more authoritative links, plus brand mentions, with far less policy risk.",
      blocks: [
        {
          kind: "table",
          head: ["", "Digital PR", "Typical link building"],
          rows: [
            [
              "**What you offer**",
              "A story, data or expert comment",
              "Content, a resource, or sometimes payment",
            ],
            [
              "**Who places the link**",
              "A journalist or editor, for their readers",
              "Often arranged with the site owner",
            ],
            [
              "**Typical targets**",
              "News sites, trade press, industry blogs",
              "Blogs, resource pages, directories",
            ],
            [
              "**Anchor text**",
              "Whatever the writer chooses, usually your brand",
              "Often requested",
            ],
            ["**What you get**", "Links, brand mentions, referral traffic, credibility", "Links"],
            [
              "**Policy risk**",
              "Low, when the coverage is earned",
              "Anywhere from none to link spam, depending on the method",
            ],
          ],
        },
        {
          kind: "p",
          text: 'Google draws the line by intent, not channel: links created "primarily for the purpose of manipulating search rankings" are link spam. Its [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) name paying for links, sending someone a product in exchange for a post with a link, and advertorials with links that pass ranking credit. Each is allowed only when the link is qualified with `rel="sponsored"` or `rel="nofollow"`.',
        },
      ],
    },
    {
      id: "ai-search",
      question: "Why does digital PR matter for AI search?",
      answer:
        "Digital PR matters for AI search because AI answers lean heavily on earned media: Muck Rack's May 2026 analysis of more than 25 million links cited by ChatGPT, Claude and Gemini found 84% came from earned media and 27% from journalism, against 0.3% from paid content.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "84%",
              label:
                "of links cited by ChatGPT, Claude and Gemini came from earned media, across 17 industries",
              source: {
                name: "Muck Rack, May 2026",
                href: "https://www.globenewswire.com/news-release/2026/05/07/3290268/0/en/generative-pulse-earned-media-consistently-drives-ai-citations-holding-at-84.html",
              },
            },
            {
              value: "27%",
              label: "came from journalism specifically; paid and advertorial content was 0.3%",
              source: {
                name: "Muck Rack, May 2026",
                href: "https://muckrack.com/blog/what-is-ai-reading-may-2026",
              },
            },
            {
              value: "0.66–0.71",
              label:
                "correlation between branded web mentions and AI visibility, against 0.27–0.33 for Domain Rating",
              source: {
                name: "Ahrefs, Dec 2025",
                href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
              },
            },
          ],
        },
        {
          kind: "p",
          text: "Muck Rack sells PR software, so read its figures as a vendor's, and note how broadly it defines earned media: journalism, academic research, government sources, encyclopedic sites and third-party corporate content. Ahrefs' 75,000-brand study points the same way from a different angle. The brands AI engines name most are the ones the rest of the web talks about most, and [brand mentions](/glossary/brand-mentions) track AI visibility far more closely than link metrics do.",
        },
        {
          kind: "p",
          text: "Recency matters too. Muck Rack found more than half of cited journalism was published in the previous 12 months, so a single campaign fades. Coverage can last in a second way: articles on crawlable news sites can end up in the [training data](/glossary/llm-training-data) future models learn from, which shapes what they say about you even when they don't search.",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure digital PR?",
      answer:
        "Measure digital PR by what the coverage changed, not how many pitches went out: new referring domains, brand mentions, referral traffic, growth in branded search, and whether AI answers to your buyers' questions start naming you.",
      blocks: [
        {
          kind: "table",
          head: ["Metric", "Where to find it", "What it tells you"],
          rows: [
            [
              "**Coverage and mentions**",
              "Media monitoring, alerts, manual searches",
              "Reach, and whether your name travelled",
            ],
            [
              "**New referring domains**",
              "Search Console's Links report, backlink tools",
              "Link value; count followed and nofollowed separately",
            ],
            [
              "**Referral traffic**",
              "Referrals from the covering sites in analytics",
              "Whether readers cared enough to click",
            ],
            [
              "**Branded search**",
              "Search Console queries containing your brand name",
              "The demand the story created",
            ],
            [
              "**AI share of voice**",
              "A fixed panel of buyer prompts, run weekly",
              "Whether answers now name you",
            ],
          ],
        },
        {
          kind: "p",
          text: "Branded search deserves a place on that list because it's one of the signals that tracks AI visibility: 0.35–0.47 in Ahrefs' study, higher than Domain Rating. For the last row, run the same 25–50 buyer prompts before and after a campaign and record who gets named. [Prompt tracking](/glossary/prompt-tracking) turns that into your [AI share of voice](/glossary/ai-share-of-voice).",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with digital PR",
      answer:
        "The most common digital PR mistakes are pitching stories that aren't news, treating paid placements and wire releases as earned coverage, demanding keyword anchor text, and judging campaigns only by followed links, which ignores the mentions that matter most for AI answers.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "A press release on a wire service is digital PR.",
              reality:
                "A wire release is paid distribution, and Google's link spam policy covers paying for posts that contain links, so don't count on wire links for ranking credit. Muck Rack did find releases cited 3.5 times more often in answers to industry-trend questions than best-of ones, but coverage a journalist chose to write is the goal.",
            },
            {
              myth: "Nofollowed coverage is wasted.",
              reality:
                "Google treats nofollow as a hint, and the coverage still sends readers, lifts branded search and puts your name in the sources AI engines cite. Judge a campaign on all of that, not on link attributes.",
            },
            {
              myth: "Sending products in exchange for links is PR.",
              reality:
                "Google's spam policy lists “sending someone a product in exchange for them writing about it and including a link” as link spam unless the link is qualified. Send products for honest reviews and let reviewers mark links as they should.",
            },
            {
              myth: "Any data makes a story.",
              reality:
                "Journalists need a finding that's new, specific and credible, with a clear sample, date and method. A small survey with a leading question gets ignored or picked apart.",
            },
            {
              myth: "Always ask for your keyword as the anchor.",
              reality:
                "Requested keyword anchors on placements are the footprint Google's guest-post guidance warns about. Let writers link with your brand name, which is also the kind of [anchor text](/glossary/anchor-text) that tracks AI visibility.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Newsworthiness Ladder",
    summary:
      "Five kinds of story a small team can realistically offer journalists, ordered from least to most effort. Start on the lowest rung you can do well, and climb once coverage starts coming back.",
    items: [
      {
        label: "Expert comment",
        body: "A specific, quotable view on news in your field, offered quickly to reporters covering it. **Needs:** a founder or specialist willing to be named, with a real opinion. **Earns:** mentions, and links when publishers cite sources.",
      },
      {
        label: "First-party data",
        body: "Aggregated, anonymized patterns from your own product: how customers actually work, spend or buy. **Needs:** data only you have, checked for privacy. **Earns:** coverage competitors can't copy, because nobody else has the numbers.",
      },
      {
        label: "Original survey or study",
        body: "A question your buyers care about, asked of a sample large enough to hold up, with the method published. **Needs:** the sample, dates and methodology on the page. **Earns:** links to the study page for as long as the finding stays current.",
      },
      {
        label: "Free tool or index",
        body: "A calculator, benchmark or index that writers reference whenever the topic comes up. **Needs:** upkeep, so the numbers stay right. **Earns:** links that can keep arriving long after launch.",
      },
      {
        label: "Recurring report",
        body: "The same study, repeated on a schedule, so each edition is news and the series becomes a reference. **Needs:** a stable method and the discipline to repeat it. **Earns:** fresh coverage every cycle, which matters because AI engines lean toward recent journalism.",
      },
    ],
    outcome:
      "Pick the lowest rung you can deliver this month and do it well; expert comment needs only a named expert and an opinion. Put every finding on a page of your own with the headline number, sample and date in the opening lines, so journalists and AI engines both have a clean passage to quote.",
  },

  related: [
    "brand-mentions",
    "backlinks",
    "e-e-a-t",
    "information-gain",
    "ai-share-of-voice",
    "anchor-text",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox's citation tracking follows where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews for the buyer questions you choose, so you can see whether a campaign changed which answers name you.",
  },
  tool: "get-recommended-by-chatgpt",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "How each answer engine picks sources, and why off-site mentions are a second route into AI answers.",
    },
    {
      title: "Gemini SEO: the technical guide",
      href: "/ai-seo/gemini",
      description: "Why Gemini names brands in text far more often than it links them.",
    },
  ],
  sources: [
    {
      title: "Spam policies for Google web search (link spam)",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/essentials/spam-policies",
    },
    {
      title: "A reminder about links in large-scale article campaigns",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2017/05/a-reminder-about-links-in-large-scale",
    },
    {
      title: "Google's John Mueller praises digital PR",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/john-mueller-praises-digital-pr/393464/",
    },
    {
      title: "Generative Pulse: earned media consistently drives AI citations, holding at 84%",
      publisher: "Muck Rack (GlobeNewswire)",
      href: "https://www.globenewswire.com/news-release/2026/05/07/3290268/0/en/generative-pulse-earned-media-consistently-drives-ai-citations-holding-at-84.html",
    },
    {
      title: "Earned media still drives 84% of AI citations",
      publisher: "Muck Rack",
      href: "https://muckrack.com/blog/what-is-ai-reading-may-2026",
    },
    {
      title: "Top brand visibility factors in ChatGPT, AI Mode and AI Overviews",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-brand-visibility-correlations/",
    },
  ],
};
