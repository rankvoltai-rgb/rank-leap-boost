import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "ai-search-engine",
  metaTitle: "What Is an AI Search Engine? How Answer Engines Pick Sources",
  metaDescription:
    "An AI search engine answers with an LLM-written response grounded in pages it retrieves. How ChatGPT, Perplexity, Claude and Google AI find and cite sources.",
  keywords: [
    "AI search engine",
    "answer engine",
    "generative search engine",
    "what is an AI search engine",
    "how do AI search engines work",
    "AI search vs Google search",
  ],

  whyItMatters:
    "Your buyers increasingly get a written answer with a handful of sources instead of ten links, and each AI search engine picks those sources from a different index with a different crawler. For a small team, knowing which index feeds which engine turns “optimize for AI” from a vague worry into a short list of concrete checks — and shows that most of the work is shared across all of them.",

  questions: [
    {
      id: "how-it-works",
      question: "How does an AI search engine work?",
      answer:
        "An AI search engine works in five steps: it decides whether a question needs the web, rewrites it into several searches, retrieves candidate pages from an index, reranks passages from those pages, and has a large language model write an answer citing the passages it used.",
      blocks: [
        {
          kind: "pipeline",
          steps: [
            {
              title: "Decide whether to search",
              body: "Stable facts come from the model's training; current, specific or comparison questions trigger retrieval. ChatGPT searched on 34.5% of prompts in February 2026 (Semrush) and Claude on 36.6% (Profound).",
            },
            {
              title: "Fan the question out",
              body: "The engine writes narrower sub-queries — [query fan-out](/glossary/query-fan-out). ChatGPT averaged about 7.6 per prompt after August 2026 ([Nectiv](https://nectivdigital.com/blog/chatgpt-tripled-fan-out-queries-data-study)); Deep Search in Google's AI Mode can run hundreds.",
              lever:
                "Cover the follow-up questions a buyer would check, each with a clearly titled page or section.",
            },
            {
              title: "Retrieve candidates from an index",
              body: "Each engine searches its own source: Google's index, Bing plus OpenAI's own, Brave, or Perplexity's.",
              lever: "Be crawlable by that engine's search bot and indexed where it looks.",
            },
            {
              title: "Rerank passages",
              body: "Pages are split into chunks and a more precise model re-scores them against the query — [reranking](/glossary/reranking). Perplexity documents this step: cross-encoders score “self-contained spans.”",
              lever: "Answer each section's question in its first sentence.",
            },
            {
              title: "Generate and cite",
              body: "A [large language model](/glossary/large-language-model) writes the answer from the top passages and links the ones it relied on — the step called [grounding](/glossary/grounding).",
            },
          ],
        },
      ],
    },
    {
      id: "main-engines",
      question: "What are the main AI search engines?",
      answer:
        "The main AI search engines in 2026 are ChatGPT search, Google AI Overviews and AI Mode, the Gemini app, Perplexity and Claude — each retrieving from a different index, which is why the same question can cite different sources on each.",
      blocks: [
        {
          kind: "table",
          head: ["Engine", "Retrieves from", "Crawler to allow", "Worth knowing"],
          rows: [
            [
              "ChatGPT search",
              "Third-party providers (Microsoft named) plus OpenAI's own index",
              "`OAI-SearchBot`",
              "[900M weekly ChatGPT users](https://openai.com/index/accelerating-the-next-phase-ai/); about 8% of citations rank top 10 in Google or Bing",
            ],
            [
              "Google AI Overviews",
              "Google's Search index",
              "Googlebot",
              "[2.5B+ monthly users](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/); [37.9%](https://ahrefs.com/blog/ai-overview-citations-top-10/) of cited pages rank top 10 for the query",
            ],
            [
              "Google AI Mode",
              "Google's Search index, with heavy fan-out",
              "Googlebot",
              "1B+ monthly users; cites the same URL as AI Overviews [13.7% of the time](https://ahrefs.com/blog/ai-overviews-vs-ai-mode/)",
            ],
            [
              "Gemini app",
              "Google's Search index, via grounding",
              "Googlebot, with `Google-Extended` allowed",
              "950M monthly users; [links only about a fifth](https://www.semrush.com/blog/the-ghost-citations-study/) of the brands it names",
            ],
            [
              "Perplexity",
              "Its own index of 200B+ URLs",
              "`PerplexityBot`",
              "28.6% of citations rank in Google's top 10, the most of any assistant",
            ],
            [
              "Claude",
              "Brave Search",
              "`Claude-SearchBot`, plus Googlebot for Brave",
              "79.2% of cited URLs rank in Brave's top 10",
            ],
          ],
        },
        {
          kind: "p",
          text: "Microsoft Copilot is reported in Bing Webmaster Tools' [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview), alongside Bing — the same Bing indexing that feeds ChatGPT's providers. Because the indexes differ, overlap between engines is low: Claude and ChatGPT shared only 8% of cited domains in Profound's 2026 study. Being cited by one says little about the others.",
        },
      ],
    },
    {
      id: "vs-traditional-search",
      question: "AI search engine vs traditional search engine: what's the difference?",
      answer:
        "A traditional search engine returns a ranked list of links for the user to open, while an AI search engine reads those pages itself and returns a written answer with a few citations — so the competition shifts from ranking a page to being quoted in a passage.",
      blocks: [
        {
          kind: "table",
          head: ["", "Traditional search engine", "AI search engine"],
          rows: [
            [
              "**Output**",
              "Ranked links, plus features",
              "A written answer with a handful of cited sources",
            ],
            [
              "**Query handled**",
              "The words the user typed",
              "Several sub-queries the engine writes",
            ],
            ["**Unit that competes**", "The page", "The passage"],
            [
              "**Who reads the page**",
              "The user, after a click",
              "The model, before the user sees anything",
            ],
            ["**Clicks**", "The point of the result", "Optional — many answers end without one"],
          ],
        },
        {
          kind: "p",
          text: 'The two are converging. Google puts [AI Overviews](/glossary/ai-overviews) above classic results and, [since I/O 2026](https://blog.google/products-and-platforms/products/search/search-io-2026/), runs AI Overviews and [AI Mode](/glossary/ai-mode) as "one seamless Search experience." The cost of the shift shows in the clicks: Pew found users clicked a classic result on 8% of visits when an AI summary appeared, against 15% without. See [zero-click search](/glossary/zero-click-search).',
        },
      ],
    },
    {
      id: "how-to-get-cited",
      question: "How do you get cited by an AI search engine?",
      answer:
        "Getting cited by an AI search engine takes four things: its search crawler can fetch your pages, the content is in plain HTML, the page is indexed where that engine looks, and each section answers one sub-question in its first sentence — backed by mentions on sites engines already trust.",
      blocks: [
        {
          kind: "requirements",
          items: [
            {
              label: "Search crawler allowed",
              status: "required",
              note: "`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` and Googlebot, in robots.txt and at the CDN. Training bots are a separate decision. See [AI crawlers](/glossary/ai-crawlers).",
            },
            {
              label: "Content in the initial HTML",
              status: "required",
              note: "Only Google runs your JavaScript; OpenAI's, Anthropic's and Perplexity's fetchers read raw HTML. See [server-side rendering](/glossary/server-side-rendering).",
            },
            {
              label: "Indexed where the engine looks",
              status: "required",
              note: "Google for AI Overviews, AI Mode and Gemini; Bing for ChatGPT's providers; Brave for Claude; Perplexity's own crawler for Perplexity.",
            },
            {
              label: "Answer-first passages",
              status: "helps",
              note: "Engines rerank passages, not pages. See [answer-first content](/glossary/answer-first-content).",
            },
            {
              label: "Visible freshness",
              status: "helps",
              note: "Claude adds the current year to 94% of its sub-queries, and Perplexity filters stale pages out before ranking.",
            },
            {
              label: "llms.txt or AI-specific markup",
              status: "no-effect",
              note: "No major engine has confirmed using [llms.txt](/glossary/llms-txt), and Google says its AI features need no special files or schema.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Four-Index Map",
    summary:
      "Six AI search surfaces draw on just four indexes. Map each engine to its index, and “optimize for AI search” becomes four concrete checks you can run in an afternoon.",
    items: [
      {
        label: "Google's index",
        body: "**Feeds:** AI Overviews, AI Mode and the Gemini app. **Get in:** allow Googlebot everywhere, stay snippet-eligible, keep Search Console's Search generative AI setting on Include, and leave `Google-Extended` allowed for Gemini. **Check:** URL Inspection in Search Console.",
      },
      {
        label: "Bing plus OpenAI's index",
        body: "**Feeds:** ChatGPT search, with Microsoft named as a provider. **Get in:** verify in Bing Webmaster Tools, submit sitemaps, allow `OAI-SearchBot`. **Check:** Bing's indexing report, plus a `curl` with the OAI-SearchBot user agent.",
      },
      {
        label: "Brave's index",
        body: "**Feeds:** Claude's web search. **Get in:** never block Googlebot (Brave follows its robots rules), earn links from sites Brave already crawls, allow `Claude-SearchBot` and `Claude-User`. **Check:** search your target questions on search.brave.com with the year appended.",
      },
      {
        label: "Perplexity's own index",
        body: "**Feeds:** Perplexity, its Comet browser and its APIs. **Get in:** allow `PerplexityBot`, server-render every page, show honest dates. **Check:** `curl` with the PerplexityBot user agent and look for your key sentence.",
      },
    ],
    outcome:
      "Fix whichever index you're missing from first — an engine can't cite a page it can't retrieve. The content work (answer-first sections, fan-out coverage, off-site mentions) is shared across all four, so you only do it once.",
  },

  related: [
    "retrieval-augmented-generation",
    "ai-overviews",
    "generative-engine-optimization",
    "query-fan-out",
    "ai-crawlers",
    "ai-citation",
  ],
  product: {
    feature: "citation-tracking",
    pitch:
      "Rankbox tracks where your brand shows up across ChatGPT, Perplexity, Claude and Google AI Overviews — each drawing on a different index — and ties every citation to the article that earned it.",
  },
  tool: "ai-robots-txt-generator",
  further: [
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description:
        "The full cross-engine matrix: index, crawler, JavaScript rendering, referrer and citation style for each engine.",
    },
    {
      title: "Perplexity SEO: the technical guide",
      href: "/ai-seo/perplexity",
      description: "The most openly documented AI search pipeline, stage by stage.",
    },
  ],
  sources: [
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
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
      title: "Optimizing your website for generative AI features",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      title: "Brave Search crawler",
      publisher: "Brave",
      href: "https://search.brave.com/help/brave-search-crawler",
    },
    {
      title: "ChatGPT search insights",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/chatgpt-search-insights/",
    },
    {
      title: "State of AEO 2026",
      publisher: "Profound (Josh Blyskal)",
      href: "https://www.joshblyskal.com/research/state-of-aeo-2026",
    },
    {
      title: "AI search overlap with Google and Bing",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      title: "Alphabet Q2 2026 earnings remarks",
      publisher: "Alphabet",
      href: "https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/",
    },
    {
      title: "Google users are less likely to click on links when an AI summary appears",
      publisher: "Pew Research Center",
      href: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/",
    },
  ],
};
