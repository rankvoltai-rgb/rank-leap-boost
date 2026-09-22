import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "llms-txt",
  metaTitle: "What Is llms.txt? What It Does, and Whether AI Engines Use It",
  metaDescription:
    "llms.txt is a proposed Markdown file that points AI models to a site's key pages. How it works, how it differs from robots.txt, and what the evidence says in 2026.",
  keywords: [
    "llms.txt",
    "what is llms.txt",
    "llms.txt file",
    "llms-full.txt",
    "does llms.txt work",
    "llms.txt vs robots.txt",
    "llms.txt SEO",
  ],

  whyItMatters:
    "llms.txt is the AI-search tactic most often sold as a quick win, and for a small team with limited hours, time spent on a file no major AI search engine has confirmed reading is time not spent on crawler access and answer-first pages. It isn't useless — it helps coding agents read developer documentation — so the real question is whether your buyers reach you through those agents or through AI search.",

  questions: [
    {
      id: "do-engines-use-it",
      question: "Do AI search engines use llms.txt?",
      answer:
        "No major AI search engine has confirmed using llms.txt to find, rank or cite content as of September 2026: Google says Search doesn't use it, and OpenAI, Anthropic and Perplexity publish llms.txt files for their own developer docs without saying their crawlers read anyone else's.",
      blocks: [
        {
          kind: "stats",
          items: [
            {
              value: "97%",
              label: "of llms.txt files received zero requests in May 2026, across 137,210 domains",
              source: { name: "Ahrefs, Jun 2026", href: "https://ahrefs.com/blog/llmstxt-study/" },
            },
            {
              value: "10.13%",
              label:
                "of about 300,000 domains had an llms.txt file, with no correlation to AI citations",
              source: {
                name: "SE Ranking, Nov 2025",
                href: "https://seranking.com/blog/llms-txt/",
              },
            },
          ],
        },
        {
          kind: "signals",
          items: [
            {
              title: "Google Search ignores it",
              body: 'Google\'s AI optimization guide says "Google Search itself doesn\'t use them," and that creating one "will neither harm nor help your site\'s visibility or rankings in Google Search."',
              evidence: "official",
            },
            {
              title: "AI search bots barely fetch it",
              body: "In Ahrefs' study, the search crawlers of OpenAI, Perplexity and Anthropic combined made only a couple of hundred llms.txt fetches across the whole sample.",
              evidence: "observed",
            },
            {
              title: "Coding agents do read it",
              body: "The proposal's August 2026 revision says \"coding agents use them reliably.\" That is its authors' report rather than an independent measurement, but it matches where the file was designed to help.",
              evidence: "observed",
            },
          ],
        },
        {
          kind: "p",
          text: "Google's John Mueller put the skeptical case in 2025, calling llms.txt [\"comparable to the keywords meta tag\"](https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/): a site owner's claim about itself, which a crawler could check by reading the site directly.",
        },
      ],
    },
    {
      id: "vs-robots-txt",
      question: "llms.txt vs robots.txt: what's the difference?",
      answer:
        "llms.txt is a reading guide that suggests which pages a language model should read first and grants or blocks nothing, while robots.txt is a set of access rules telling crawlers which paths they may fetch, which reputable search and AI bots obey.",
      blocks: [
        {
          kind: "table",
          head: ["", "llms.txt", "robots.txt"],
          rows: [
            [
              "**Purpose**",
              "Point language models to a site's most useful pages",
              "Tell crawlers which paths they may fetch",
            ],
            [
              "**Format**",
              "Markdown: an H1, a short summary, sections of links",
              "Plain-text rules grouped by user agent",
            ],
            [
              "**Status**",
              "Community proposal (2024, revised August 2026)",
              "Internet standard, RFC 9309 (2022)",
            ],
            ["**Controls access?**", "No", "Yes, for bots that honor it"],
            [
              "**Used by AI search engines?**",
              "Not confirmed by any major engine",
              "Yes: every major vendor documents its tokens",
            ],
            [
              "**Location**",
              "`/llms.txt`, or a subpath such as `/docs/llms.txt`",
              "`/robots.txt` at the root of each host",
            ],
          ],
        },
        {
          kind: "p",
          text: "The practical consequence runs both ways. If you want to keep AI bots out, llms.txt can't do it; if you want them in, robots.txt and your CDN decide that, whatever llms.txt says. The two files don't interact, and neither replaces an [XML sitemap](/glossary/xml-sitemap), which lists every canonical URL rather than a curated few. See [robots.txt](/glossary/robots-txt) and [AI crawlers](/glossary/ai-crawlers).",
        },
      ],
    },
    {
      id: "how-to-create",
      question: "How do you create an llms.txt file?",
      answer:
        "Create an llms.txt file by writing a Markdown document with an H1 naming the site, a one-paragraph blockquote summary, and H2 sections listing your most useful pages as links with a short note on each, then serving it at `/llms.txt`.",
      blocks: [
        {
          kind: "code",
          lang: "markdown",
          code: "# Plannora\n\n> Plannora is project management software for small teams: boards,\n> automations and a free plan for up to five users.\n\n## Product\n- [Pricing](https://plannora.io/pricing): plans, limits and what's free\n- [Integrations](https://plannora.io/integrations): Slack, Google Workspace, GitHub\n\n## Docs\n- [API reference](https://plannora.io/docs/api): REST endpoints and webhooks\n\n## Optional\n- [Changelog](https://plannora.io/changelog)",
        },
        {
          kind: "list",
          items: [
            "**Only the H1 is required.** The summary, detail and link sections are optional in the [spec](https://llmstxt.org).",
            "**`Optional` is a convention** for secondary links that a model short on context can skip.",
            "**Markdown versions of pages help agents.** The proposal suggests serving a clean `.md` copy of each page at the same URL with `.md` added or swapped in, and its 2026 revision adds link relations so agents can find them.",
            "**`llms-full.txt` is a companion convention:** documentation platforms such as [Mintlify](https://www.mintlify.com/blog/simplifying-docs-with-llms-txt) generate one that compiles all docs text into a single Markdown file.",
          ],
        },
        {
          kind: "p",
          text: "The [llms.txt generator](/tools/llms-txt-generator) builds the file from a short form. Keep it curated, not exhaustive, and update it when key pages move.",
        },
      ],
    },
    {
      id: "should-i-add",
      question: "Should I add an llms.txt file?",
      answer:
        "Add an llms.txt file if you publish developer docs, an API or anything coding agents read, since that's where the file is reported to be used; for AI search visibility, treat it as harmless but optional, and fix crawler access and answer-first pages first.",
      blocks: [
        {
          kind: "requirements",
          items: [
            {
              label: "Developer docs, APIs, SDKs",
              status: "helps",
              note: "Coding agents fetch llms.txt and Markdown page versions to load documentation efficiently, the use the 2026 revision reports as reliable.",
            },
            {
              label: "Google AI Overviews & AI Mode",
              status: "no-effect",
              note: "Google says Search doesn't use llms.txt; it neither helps nor hurts.",
            },
            {
              label: "ChatGPT, Claude and Perplexity search",
              status: "unconfirmed",
              note: "None has said its search crawler reads other sites' llms.txt, and log studies show almost no fetches.",
            },
            {
              label: "Replacing robots.txt or a sitemap",
              status: "no-effect",
              note: "It controls no access and lists only a curated subset of pages.",
            },
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Low cost, low stakes",
          text: "An llms.txt file takes under an hour and does no harm. The risk is opportunity cost: treating it as an AI-visibility fix while [OAI-SearchBot](/glossary/oai-searchbot) is blocked at the CDN or your key pages only render in JavaScript. See [server-side rendering](/glossary/server-side-rendering).",
        },
      ],
    },
    {
      id: "how-to-measure",
      question: "How do you measure whether llms.txt is used?",
      answer:
        "Measure llms.txt use from your server logs: count requests to `/llms.txt` by user agent, verify any big names against their published IP ranges, and compare AI citations before and after publishing the file.",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          code: "# Who requests llms.txt, by user agent (combined log format)\ngrep '\"GET /llms.txt' access.log | awk -F'\"' '{print $6}' | sort | uniq -c | sort -rn | head -20",
        },
        {
          kind: "p",
          text: "Expect mostly SEO tools and unidentified bots: in Ahrefs' study, audit tools were the largest group of requesters and AI search crawlers barely appeared. A request isn't proof of use either — a fetch shows a bot read the file, not that any answer drew on it. Citations are the outcome that matters, and they're measured by running a fixed set of buyer prompts on a schedule, which is [prompt tracking](/glossary/prompt-tracking), not by reading logs. If you publish a file, give it a fair test: note the date, keep the prompt set fixed, and compare the months before and after. AI answers vary from run to run, so judge the trend across dozens of prompts, never a single answer.",
        },
      ],
    },
  ],

  original: {
    kind: "benchmark",
    name: "The llms.txt Evidence Scorecard",
    summary:
      "The published evidence on llms.txt as of September 2026, one line per claim, so you can weigh it before spending time on the file. Every value comes from the source named in its row.",
    items: [
      {
        label: "Google Search use",
        value: "None",
        body: "Google's AI optimization guide says Search doesn't use llms.txt and that it \"will neither harm nor help\" visibility.",
      },
      {
        label: "Files never requested",
        value: "97%",
        body: "Share of llms.txt files with zero requests in May 2026, across 137,210 domains (Ahrefs, June 2026).",
      },
      {
        label: "Adoption",
        value: "10.13%",
        body: "Share of about 300,000 domains with an llms.txt file (SE Ranking, November 2025).",
      },
      {
        label: "Effect on AI citations",
        value: "No correlation",
        body: "SE Ranking found no link between having the file and AI citations; removing it as a variable made their model more accurate.",
      },
      {
        label: "Coding-agent use",
        value: "Reported",
        body: "The proposal's August 2026 revision says coding agents use llms.txt reliably, a claim by its authors rather than an independent study.",
      },
    ],
    outcome:
      "Read it as: no evidence of benefit for AI search, some for coding agents, no evidence of harm. Publish one if developers are your buyers; otherwise it's a low-priority tidy-up, not a visibility lever. Recheck the scorecard when an engine publishes a statement, because that is the row that would change the answer.",
  },

  related: [
    "robots-txt",
    "ai-crawlers",
    "xml-sitemap",
    "generative-engine-optimization",
    "schema-markup",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rather than betting on a file no engine has confirmed reading, Rankbox tracks where ChatGPT, Perplexity, Claude and Google AI Overviews actually cite your brand, and which article earned each citation.",
  },
  tool: "llms-txt-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "Crawlers, rendering and the files that do and don't matter, engine by engine.",
    },
    {
      title: "Google AI Overviews & AI Mode SEO",
      href: "/ai-seo/google-ai-overviews",
      description: "What Google says is and isn't required for its AI features, llms.txt included.",
    },
  ],
  sources: [
    {
      title: "The /llms.txt file",
      publisher: "llmstxt.org",
      href: "https://llmstxt.org/",
    },
    {
      title: "Changes since v1",
      publisher: "llmstxt.org",
      href: "https://llmstxt.org/changes.html",
    },
    {
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "llms.txt study",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/llmstxt-study/",
    },
    {
      title: "LLMs.txt: why brands rely on it and why it doesn't work",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/llms-txt/",
    },
    {
      title: "Google says LLMs.txt comparable to keywords meta tag",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/",
    },
  ],
};
