import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "e-e-a-t",
  metaTitle: "What Is E-E-A-T? How Google and AI Engines Judge Trust",
  metaDescription:
    "E-E-A-T is the framework Google's raters use to judge experience, expertise, authority and trust. Why it isn't a ranking factor, and what it means for AI answers.",
  keywords: [
    "E-E-A-T",
    "EEAT",
    "what is E-E-A-T",
    "E-E-A-T SEO",
    "is E-E-A-T a ranking factor",
    "E-E-A-T AI search",
    "Google quality rater guidelines",
  ],

  whyItMatters:
    "When your article competes with one from a brand ten times your size, E-E-A-T describes what can still tip it your way: real experience, a named expert and claims a reader can check. Small teams have more of that than they think — first-hand product knowledge, customer conversations and results no competitor can copy — and none of it costs budget. It matters in AI answers too, because Google builds AI Overviews on the same quality systems and other engines are increasingly tuned toward primary sources.",

  questions: [
    {
      id: "ranking-factor",
      question: "Is E-E-A-T a ranking factor?",
      answer:
        "E-E-A-T is not a single ranking factor: Google says its systems use “a mix of factors” that identify content with good E-E-A-T, and the human raters who apply the framework have no control over how pages rank.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s [helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) is explicit: "While E-E-A-T itself isn\'t a specific ranking factor, using a mix of factors that can identify content with good E-E-A-T is useful." The framework itself lives in the [Search Quality Rater Guidelines](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf), a 182-page manual for the people Google pays to evaluate search results. Their ratings measure whether ranking changes are working; per the guidelines, "no single rating can directly impact how a particular webpage, website, or result appears in Google Search."',
        },
        {
          kind: "signals",
          items: [
            {
              title: "Not a score of its own",
              body: "E-E-A-T \"isn't a specific ranking factor.\" Google's systems use many signals that tend to line up with it.",
              evidence: "official",
            },
            {
              title: "Raters don't move pages",
              body: '"Search raters have no control over how pages rank. Rater data is not used directly in our ranking algorithms."',
              evidence: "official",
            },
            {
              title: "Extra weight on YMYL topics",
              body: 'Google gives "even more weight" to strong E-E-A-T on topics that could significantly affect health, financial stability or safety — what it calls "Your Money or Your Life" topics.',
              evidence: "official",
            },
          ],
        },
        {
          kind: "p",
          text: "Treat E-E-A-T as a description of the target, not a checklist to game: an author box or trust badge scores nothing on its own.",
        },
      ],
    },
    {
      id: "four-parts",
      question: "What do experience, expertise, authoritativeness and trust mean?",
      answer:
        "In Google's rater guidelines, experience is first-hand or life experience of the topic, expertise is the knowledge or skill it needs, authoritativeness is being a go-to source for it, and trust — the center of the framework — is whether the page is accurate, honest, safe and reliable.",
      blocks: [
        {
          kind: "table",
          head: ["", "What raters are asked", "What it looks like on a B2B site"],
          rows: [
            [
              "**Experience**",
              "Does the creator have first-hand or life experience of the topic?",
              "Screenshots from your own account, a migration you actually ran, results from your own tests",
            ],
            [
              "**Expertise**",
              "Does the creator have the knowledge or skill the topic needs?",
              "A named author whose background matches the subject; specific, accurate detail",
            ],
            [
              "**Authoritativeness**",
              "Is the creator or site known as a go-to source for the topic?",
              "Your own docs and pricing for your product; coverage and citations from others for your category",
            ],
            [
              "**Trust**",
              "Is the page accurate, honest, safe and reliable?",
              "Sourced claims, visible dates, clear ownership and contact details, honest comparisons",
            ],
          ],
        },
        {
          kind: "p",
          text: 'The guidelines\' own test for experience: "which would you trust: a product review from someone who has personally used the product or a \'review\' by someone who has not?" Trust outranks the rest, because "untrustworthy pages have low E-E-A-T no matter how Experienced, Expert, or Authoritative they may seem." Google added the first E, for experience, in [December 2022](https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t); the current guidelines are dated September 2025.',
        },
        {
          kind: "callout",
          tone: "tip",
          title: "On your own product, you are the authority",
          text: "Most topics have no single authoritative source, the guidelines note, but when one exists it is often the most reliable — their example is the official passport renewal page. For your product's pricing, features and integrations, that source should be your own clearly titled page.",
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does E-E-A-T matter for AI search?",
      answer:
        "E-E-A-T matters for AI search in two ways: Google grounds AI Overviews and AI Mode in the same ranking and quality systems as Search, and engines outside Google independently favor official, primary and first-hand sources — the qualities the framework describes.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Google's AI features",
              body: 'Google says [AI Overviews](/glossary/ai-overviews) and [AI Mode](/glossary/ai-mode) "are rooted in our core Search ranking and quality systems," so the signals that stand in for E-E-A-T carry over unchanged.',
              evidence: "official",
            },
            {
              title: "Non-commodity content",
              body: 'Google\'s AI guide asks for "unique, expert-led content that provides value beyond common knowledge," and contrasts a first-hand review with a summary that "simply restates information already available elsewhere."',
              evidence: "official",
            },
            {
              title: "Claude's research agents",
              body: 'Anthropic says early versions "consistently chose SEO-optimized content farms over authoritative but less highly-ranked sources," and were retuned to prefer "primary sources over lower-quality secondary sources."',
              evidence: "official",
            },
            {
              title: "ChatGPT's turn to official sources",
              body: 'Since August 2026, most ChatGPT fan-out searches use `site:` to query brand, vendor and .gov domains directly, and "official" became one of the most common words in them.',
              evidence: "observed",
            },
            {
              title: "Perplexity's authoritative domains",
              body: "Perplexity says documents from authoritative domains get crawl and storage priority in its index.",
              evidence: "official",
            },
            {
              title: "Reputation is read off-site",
              body: "An engine can't verify a bio, but it can see whether other sources describe you the same way. That makes [brand mentions](/glossary/brand-mentions) the closest thing AI has to reputation research.",
              evidence: "our-read",
            },
          ],
        },
        {
          kind: "p",
          text: 'The rater guidelines tell humans that when a site and independent sources disagree, "trust the independent sources." Answer engines, which compare many pages before writing one answer, appear to reward the same habit: specific, verifiable claims that other sources corroborate. See [grounding](/glossary/grounding).',
        },
      ],
    },
    {
      id: "how-to-improve",
      question: "How do you improve E-E-A-T?",
      answer:
        "Improve E-E-A-T by showing proof instead of claiming it: publish what only your team has done or tested, name a qualified author, source every factual claim, and earn independent reviews and coverage that confirm who you are.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Lead with first-hand material.** Your own screenshots, workflows, test results and customer questions — the parts a competitor or a model can't restate. See [information gain](/glossary/information-gain).",
            '**Put a real person on it.** A byline linked to an author page with relevant background. Google\'s own "Who, How, and Why" questions start with whether it is self-evident who created the content.',
            "**Source every claim.** Link statistics and quotes to where they came from, show when the page was last substantively updated, and keep it current. See [content freshness](/glossary/content-freshness).",
            "**Make ownership obvious.** An About page, contact details, and clear pricing and policies. Raters are told to find out who is responsible for a site before judging it.",
            '**Earn outside confirmation.** Reviews, press, podcasts and genuine community participation, because raters must look up "what reputable independent sources say." See [digital PR](/glossary/digital-pr).',
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "AI-assisted content isn't disqualified",
          text: 'Google rewards "high-quality content, however it is produced," and its rater guidelines say generative AI alone "does not determine the level of effort or Page Quality rating." What fails is content made with "little to no effort, little to no originality, and little to no added value" — by any method. See [scaled content abuse](/glossary/scaled-content-abuse).',
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with E-E-A-T",
      answer:
        "The most common E-E-A-T mistakes are treating it as a checklist of trust badges, inventing author personas, and publishing summaries of other people's content with no first-hand input — each one signals exactly the low trust the framework exists to catch.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Adding author bios boosts E-E-A-T.",
              reality:
                "A bio helps readers and raters check who wrote a page, but E-E-A-T isn't a scored field. A bio with no real link to the topic adds nothing, and a fabricated persona is the kind of deceptive creator information the guidelines place in their lowest rating.",
            },
            {
              myth: "E-E-A-T only matters for health and finance sites.",
              reality:
                'Google adds weight on YMYL topics, but the guidelines say experience "is valuable for almost any topic" — from appliance reviews to software comparisons.',
            },
            {
              myth: "Big brands automatically win on authority.",
              reality:
                "Authority is topic-specific. On questions about your own product, your official page is the authoritative source, and ChatGPT's `site:` fan-outs now go looking for exactly that page.",
            },
            {
              myth: "E-E-A-T is a Google concept, irrelevant to ChatGPT or Perplexity.",
              reality:
                "The label is Google's; the preference isn't. Anthropic tuned Claude's research agents toward primary sources, and Perplexity gives authoritative domains crawl priority.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The 60-Second Verification Test",
    summary:
      "An E-E-A-T audit from the point of view that matters: a skeptical stranger who lands on your page from an AI citation. Can they confirm five things within a minute? Each answer has to be visible on the page or one click away — not implied.",
    items: [
      {
        label: "Who wrote this?",
        body: "A named person or team, linked to a page that shows relevant background. **Pass:** the byline leads somewhere that explains why this person is qualified for this topic.",
      },
      {
        label: "How do they know?",
        body: "Evidence of first-hand involvement: screenshots, data, a described process, a real example with specifics. **Pass:** at least one element a competitor couldn't write without doing the work.",
      },
      {
        label: "Where does each claim come from?",
        body: "Statistics, quotes and definitions link to their source, and the page shows when it was last substantively updated. **Pass:** every number can be traced in one click.",
      },
      {
        label: "Who else vouches for them?",
        body: "Search the brand and the author off-site: reviews, press, community threads, talks. **Pass:** independent sources describe you the way you describe yourself.",
      },
      {
        label: "Who's accountable?",
        body: "Ownership, contact details, policies and, on commercial pages, honest pricing and comparisons. **Pass:** a reader knows who to contact if something is wrong.",
      },
    ],
    outcome:
      "Score each check pass or fail and fix failures in order. Checks two and four take longest, because they can't be written in an afternoon — which is exactly why they separate a small, credible team from a better-funded competitor.",
  },

  related: [
    "information-gain",
    "topical-authority",
    "brand-mentions",
    "scaled-content-abuse",
    "digital-pr",
    "entity-seo",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox researches the live web and writes articles in your brand's voice with every claim sourced, key terms defined and answers up front — the checkable foundation E-E-A-T rests on — leaving room for the first-hand detail only your team can add.",
  },
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "How Google's quality systems pick the sources behind its AI answers, and what the citation data shows.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "The content playbook for first-hand, citable pages, step by step.",
    },
  ],
  sources: [
    {
      title: "Search Quality Rater Guidelines",
      publisher: "Google",
      href: "https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf",
    },
    {
      title: "Creating helpful, reliable, people-first content",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title:
        "Our latest update to the quality rater guidelines: E-A-T gets an extra E for Experience",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t",
    },
    {
      title: "Google Search's guidance about AI-generated content",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "How we built our multi-agent research system",
      publisher: "Anthropic",
      href: "https://www.anthropic.com/engineering/multi-agent-research-system",
    },
    {
      title: "Architecting and evaluating an AI-first search API",
      publisher: "Perplexity Research",
      href: "https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api",
    },
    {
      title: "ChatGPT tripled its fan-out queries",
      publisher: "Nectiv",
      href: "https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study",
    },
  ],
};
