import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "scaled-content-abuse",
  metaTitle: "What Is Scaled Content Abuse? Google's Spam Policy Explained",
  metaDescription:
    "Scaled content abuse is Google's spam policy against mass-produced pages made to rank. What it covers, why AI content isn't banned, and where the line really is.",
  keywords: [
    "scaled content abuse",
    "Google scaled content abuse policy",
    "is AI content against Google guidelines",
    "mass-produced content",
    "AI content spam",
    "scaled content abuse examples",
  ],

  whyItMatters:
    "If you use AI to publish more than your team could write by hand, this is the policy that decides whether that volume helps or hurts you. Google says it judges why and how well content was made, not whether a model wrote it, so the risk sits in thin, interchangeable pages rather than in the tool. Knowing exactly where the line is lets a small team publish steadily without betting the domain on it.",

  questions: [
    {
      id: "what-counts",
      question: "What counts as scaled content abuse?",
      answer:
        "Scaled content abuse covers producing many pages “for the primary purpose of manipulating search rankings and not helping users,” in Google's words, whether they come from generative AI, scraping, templates or human writers. The test is purpose and value, not method.",
      blocks: [
        {
          kind: "p",
          text: 'Google introduced the policy in March 2024, expanding its older rule on automatically generated content so it could act "no matter whether content is produced through automation, human efforts, or some combination of human and automated processes." Its [spam policies](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) describe the practice as "typically focused on creating large amounts of unoriginal content that provides little to no value to users, no matter how it\'s created," and list examples that include, but aren\'t limited to:',
        },
        {
          kind: "list",
          items: [
            "Using generative AI or similar tools to generate many pages without adding value for users",
            "Scraping feeds, search results or other content to generate many pages, including through automated synonymizing, translating or other obfuscation, where little value is added",
            "Stitching or combining content from different web pages without adding value",
            "Creating multiple sites to hide the scaled nature of the content",
            "Creating many pages that make little or no sense to a reader but contain search keywords",
          ],
        },
        {
          kind: "p",
          text: "Every example pairs volume with missing value. Neither publishing a lot nor using AI is the offense; producing pages in bulk that add nothing new is. Template-driven sites cross the same line when rows have no real data — see [programmatic SEO](/glossary/programmatic-seo).",
        },
      ],
    },
    {
      id: "ai-content",
      question: "Is AI-generated content against Google's guidelines?",
      answer:
        "AI-generated content is not against Google's guidelines: Google says “appropriate use of AI or automation is not against our guidelines” and rewards quality however content is produced. Using AI to produce content mainly to manipulate rankings is a violation, exactly as it would be by hand.",
      blocks: [
        {
          kind: "p",
          text: 'Google\'s February 2023 [guidance on AI-generated content](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content) puts the emphasis on "the quality of content, rather than how content is produced," and notes that "automation has long been used to generate helpful content, such as sports scores, weather forecasts, and transcripts." Its [generative AI documentation](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) says AI "can be particularly useful when researching a topic, and to add structure to original content."',
        },
        {
          kind: "p",
          text: 'The same documents draw the line: "If you use automation, including AI-generation, to produce content for the primary purpose of manipulating search rankings, that\'s a violation of our spam policies." Google\'s January 2025 search quality rater guidelines, as [reported by Search Engine Roundtable](https://www.seroundtable.com/google-search-quality-rater-guidelines-generative-ai-38842.html), say "Generative AI can be a helpful tool for content creation, but like any tool, it can also be misused," and give the lowest rating to pages made with "little to no effort, little to no originality, and little to no added value."',
        },
        {
          kind: "callout",
          tone: "note",
          title: "Disclosure is encouraged, not required",
          text: "Google's [helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) says AI or automation disclosures \"are useful for content where someone might think 'How was this created?'\" and to consider adding them \"when it would be reasonably expected.\" A disclosure doesn't make a thin page acceptable, and leaving one off doesn't make a useful page spam.",
        },
      ],
    },
    {
      id: "enforcement",
      question: "How does Google enforce the scaled content abuse policy?",
      answer:
        "Google enforces the scaled content abuse policy mainly through automated spam systems such as SpamBrain, backed by human reviewers who can issue a manual action. Sites that violate it “may rank lower in results or not appear in results at all.”",
      blocks: [
        {
          kind: "list",
          items: [
            '**Algorithmic demotion.** Google detects violations "both through automated systems and, as needed, human review," and periodic spam updates improve SpamBrain, its AI-based spam-prevention system.',
            '**Manual actions.** A reviewer\'s finding appears in Search Console\'s Manual Actions report. Google\'s description of the "Major spam problems" action names scaled content abuse among the "aggressive spam techniques" it covers.',
            '**Recovery.** For a manual action, fix or remove the offending pages and file a reconsideration request. After a spam update, Google says changes "may help a site improve if our automated systems learn over a period of months that the site complies with our spam policies."',
          ],
        },
        {
          kind: "p",
          text: 'When the policy launched, Google expected the changes to cut "low-quality, unoriginal content in search results by 40%," and in April 2024 it reported reaching 45%, per its [announcement](https://blog.google/products/search/google-search-update-march-2024/). Bing moved in the same direction: its February 2026 webmaster guidelines warn that "large-scale content generated without oversight, quality control, or editorial review often lacks usefulness, accuracy, and originality," per [Search Engine Journal](https://www.searchenginejournal.com/bing-adds-geo-to-official-guidelines-expands-ai-abuse-definitions/568442/).',
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does scaled content abuse matter for AI search?",
      answer:
        "Scaled content abuse matters at least as much in AI search as in classic results: AI Overviews and AI Mode draw on the same ranking and spam systems as Search, Google applies the policy to pages built to manipulate “generative AI responses,” and other engines are tuned to skip content farms.",
      blocks: [
        {
          kind: "signals",
          items: [
            {
              title: "Same systems, same demotions",
              body: 'Google says its AI features "are rooted in our core Search ranking and quality systems." A page demoted for spam starts far back in the pool [AI Overviews](/glossary/ai-overviews) draw from.',
              evidence: "official",
            },
            {
              title: "Pages per fan-out variant are named",
              body: 'Google\'s [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says separate content "for every possible variation of how people might search," fan-out queries included, made "primarily to manipulate rankings or generative AI responses" violates this policy.',
              evidence: "official",
            },
            {
              title: "Engines filter content farms",
              body: 'Anthropic found its early research agents "consistently chose SEO-optimized content farms over authoritative but less highly-ranked sources" and added source-quality heuristics to correct it.',
              evidence: "official",
            },
            {
              title: "Near-copies compete with each other",
              body: "Microsoft's Bing team says LLMs cluster near-duplicate pages and choose one to represent the set, so hundreds of similar pages mostly crowd each other out.",
              evidence: "official",
            },
          ],
        },
        {
          kind: "p",
          text: "The route into AI answers is the opposite of volume for its own sake: fewer pages, each the best available answer to a distinct [fan-out](/glossary/query-fan-out) sub-question, with [information gain](/glossary/information-gain) a generic page can't match.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with scaled content abuse",
      answer:
        "The most common mistakes about scaled content abuse are assuming AI content is banned, assuming human-written content is automatically safe, and treating volume, rewording or word count as a substitute for value — Google's policy ignores the method and judges purpose and value.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "Google penalizes AI-written content.",
              reality:
                "Google judges purpose and quality, not authorship. AI-assisted content that helps readers is within its guidelines; AI content mass-produced to rank is not.",
            },
            {
              myth: "Human-written content can't be scaled content abuse.",
              reality:
                'The policy covers content produced "through automation, human efforts, or some combination." A freelancer farm rewriting the top results fits the definition too.',
            },
            {
              myth: "Rewording AI output makes it original.",
              reality:
                "Automated synonymizing and translating are named examples. Originality comes from what a page adds — data, experience, analysis — not from how its sentences are phrased.",
            },
            {
              myth: "Longer articles look higher quality.",
              reality:
                "Google asks, \"Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)\"",
            },
            {
              myth: "Using a reputable tool keeps a site safe.",
              reality:
                "No tool, Rankbox included, makes content compliant by itself. The policy judges each page's purpose and value, so every page needs to give readers something real.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Five-Question Scale Audit",
    summary:
      "A pre-publish check that turns Google's own questions — its Who, How and Why guidance and its search-engine-first warning signs — into five tests for any page produced at volume, by AI or by hand. It lowers risk; it can't guarantee how Google judges a site.",
    items: [
      {
        label: "Why does it exist?",
        body: "Would you publish this page if search engines didn't exist — for customers, sales or a newsletter? Google calls the “why” “perhaps the most important question,” and the right answer is content made “primarily to help people.”",
      },
      {
        label: "What does it add?",
        body: "Name one thing on the page that today's top results lack: original numbers, first-hand experience, a worked example, a clearer answer. If you can't, it's commodity content. See [information gain](/glossary/information-gain).",
      },
      {
        label: "Who stands behind it?",
        body: "Is it clear who is responsible — a named author, reviewer or company with relevant experience? Google ties the “Who” directly to [E-E-A-T](/glossary/e-e-a-t).",
      },
      {
        label: "How was it checked?",
        body: "Did someone who knows the subject verify the facts, sources and claims before it went live? Explain how automation was used where a reader would reasonably wonder.",
      },
      {
        label: "Does volume match review?",
        body: "Are you publishing faster than anyone can check? Google flags “using extensive automation to produce content on many topics” and “producing lots of content on many different topics in hopes that some of it might perform well.” Stay on topics your business genuinely knows.",
      },
    ],
    outcome:
      "Run it on a sample of pages every month, not once at launch. A page that fails the first or second question should be improved or left unpublished, whatever tool wrote it; a process that keeps failing the fifth needs a slower cadence, not better prompts.",
  },

  related: [
    "programmatic-seo",
    "information-gain",
    "e-e-a-t",
    "query-fan-out",
    "ai-overviews",
    "keyword-cannibalization",
  ],
  product: {
    feature: "citation-ready-writer",
    pitch:
      "Rankbox's Citation-Ready Writer researches the live web for every article and writes it with sources, definitions and an answer-first structure in your brand's voice. That's a starting point, not a safe harbor: what keeps any page on the right side of this policy is what it adds for readers, so review drafts and add your own data and experience.",
  },
  further: [
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description:
        "What Google says about non-commodity content and per-variant pages in its AI features.",
    },
    {
      title: "How to show up in Google AI Overviews",
      href: "/blog/how-to-show-up-in-google-ai-overviews",
      description: "The content playbook for earning citations with depth rather than volume.",
    },
  ],
  sources: [
    {
      title: "Spam policies for Google web search: scaled content abuse",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/essentials/spam-policies#scaled-content",
    },
    {
      title: "What web creators should know about our March 2024 core update and new spam policies",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2024/03/core-update-spam-policies",
    },
    {
      title: "Google Search's guidance about AI-generated content",
      publisher: "Google Search Central Blog",
      href: "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content",
    },
    {
      title: "Google Search's guidance on generative AI content on your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content",
    },
    {
      title: "Creating helpful, reliable, people-first content",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    },
    {
      title: "Google Search spam updates and your site",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/updates/spam-updates",
    },
    {
      title: "New updates to address spam and low-quality results",
      publisher: "Google",
      href: "https://blog.google/products/search/google-search-update-march-2024/",
    },
    {
      title: "Google's updated search quality rater guidelines mention generative AI",
      publisher: "Search Engine Roundtable",
      href: "https://www.seroundtable.com/google-search-quality-rater-guidelines-generative-ai-38842.html",
    },
    {
      title: "Bing adds GEO to official guidelines, expands AI abuse definitions",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/bing-adds-geo-to-official-guidelines-expands-ai-abuse-definitions/568442/",
    },
  ],
};
