/**
 * The words on the /ai-seo hub: what AI SEO is, where each engine looks things
 * up, the labels for the cross-engine matrix, the shared foundation, where to
 * start, the FAQ and the sources behind all of it.
 *
 * The matrix cells themselves come from each guide's `profile`, never from
 * here, so the hub can't drift from the guides. Everything else on the hub is
 * cross-engine and sourced in `sources` below (facts verified 2026-10-26).
 */
import type { EngineSlug } from "./engines";
import type { EngineProfile, Evidence, Faq, Md, Source } from "./types";

/** The matrix rows, in reading order: find it, let it in, read it, measure it, win it. */
export const PROFILE_ROWS: {
  key: keyof EngineProfile;
  label: string;
  /** Why the row matters, in a few words: the hint under the label. */
  why: string;
  mono?: boolean;
}[] = [
  { key: "retrieval", label: "Where answers come from", why: "The index you need to be in" },
  {
    key: "searchCrawler",
    label: "Crawler to allow",
    why: "Block it and you can't be cited",
    mono: true,
  },
  { key: "trainingCrawler", label: "Training opt-out", why: "What you can block and stay in" },
  { key: "rendersJs", label: "Runs your JavaScript?", why: "If not, scripted text is invisible" },
  { key: "referrer", label: "Shows up in analytics as", why: "Where to find the visits" },
  { key: "citationStyle", label: "How citations look", why: "What a reader sees and clicks" },
  { key: "biggestLever", label: "Biggest lever", why: "The one move to make first" },
];

/* ---------- where each engine looks things up ---------- */

export type SourceWellId =
  "own-index" | "google" | "brave" | "bing" | "undisclosed" | "x" | "browser";

export interface SourceWell {
  id: SourceWellId;
  label: string;
  /** One short line: who fills it, or what it is. */
  detail: string;
}

export interface EngineSourcing {
  slug: EngineSlug;
  /** `reported`: stated in 2023–2025 but not in the vendor's current docs. */
  links: { to: SourceWellId; reported?: boolean }[];
  /** The one-sentence why, shown when the engine is picked. */
  note: Md;
}

/** A hub source, sorted into the vendors' own word and independent evidence. */
export interface HubSource extends Source {
  kind: "vendor" | "study";
}

export const OVERVIEW: {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** When the hub's own copy was last verified. */
  updated: string;
  headline: { lead: string; accent: string };
  subhead: string;
  shortAnswer: Md;
  sourceMap: {
    title: { lead: string; accent: string };
    intro: Md;
    legend: { documented: string; reported: string };
    wells: SourceWell[];
    engines: EngineSourcing[];
    /** What sits under every engine, searched or not. */
    layers: { title: string; body: Md }[];
  };
  matrix: { title: { lead: string; accent: string }; intro: Md; note: Md };
  foundations: {
    title: { lead: string; accent: string };
    intro: Md;
    onceTitle: string;
    once: { title: string; body: Md; evidence: Evidence }[];
    perEngineTitle: string;
    perEngineIntro: Md;
  };
  start: {
    title: { lead: string; accent: string };
    intro: Md;
    steps: { title: string; body: Md }[];
    /** One robots.txt for every engine that documents a token. */
    robots: { caption: string; code: string; note: Md };
    reach: {
      slug: EngineSlug;
      value: string;
      label: string;
      source: { name: string; href: string };
    }[];
    referrals: {
      title: string;
      note: Md;
      rows: { slug: EngineSlug; share: number }[];
      source: { name: string; href: string };
    };
    situations: { slug: EngineSlug; when: string; why: Md }[];
    rankbox: { title: string; body: string };
  };
  faqs: Faq[];
  sources: HubSource[];
  cta: { title: string; body: string };
} = {
  metaTitle: "AI SEO Guides: ChatGPT, Google AI, Gemini, Claude & 7 More",
  metaDescription:
    "How 11 AI engines find, cite and send traffic, compared: ChatGPT, Google AI Overviews, Gemini, Claude, Perplexity, Copilot, Grok, Meta AI, DeepSeek, Mistral Vibe, Manus.",
  keywords: [
    "AI SEO",
    "AI SEO guide",
    "generative engine optimization",
    "GEO",
    "answer engine optimization",
    "LLM SEO",
    "AI search optimization",
  ],
  updated: "2026-10-26",
  headline: { lead: "AI SEO guides,", accent: "engine by engine" },
  subhead:
    "Eleven AI engines, and no two find pages the same way. Google's answers come from Google's index and Copilot's from Bing's, while ChatGPT, Claude, Perplexity, Meta AI and Mistral Vibe each send a crawler of their own. Do the shared work once, then look up what each engine needs.",
  shortAnswer:
    '**AI SEO** (also called generative engine optimization, GEO, or answer engine optimization, AEO) is the work of getting your pages found, quoted and linked when an AI engine answers a question. The base is ordinary SEO: Google says optimizing for its AI features is "still SEO". What changes from engine to engine is the plumbing. Each searches a different index, sends a different crawler and shows citations its own way. So let every engine\'s search crawler in, put the answer in plain HTML, and write passages that answer the sub-questions engines search for.',

  sourceMap: {
    title: { lead: "Where each engine", accent: "looks things up" },
    intro:
      "When an engine searches before it answers, the results come from an index. Two engines use Google's and Copilot uses Bing's, five build their own with a crawler, and several won't name their source. Pick an engine to trace it, or open its guide.",
    legend: {
      documented: "Stated in the vendor's current docs",
      reported: "Implied, reported, or stated before 2026",
    },
    wells: [
      {
        id: "own-index",
        label: "Its own crawler's index",
        detail: "Built by a search bot you allow",
      },
      { id: "google", label: "Google's Search index", detail: "Crawled by Googlebot" },
      { id: "brave", label: "Brave Search", detail: "Brave's index, through its API" },
      { id: "bing", label: "Bing's index", detail: "Crawled by Bingbot" },
      {
        id: "undisclosed",
        label: "An undisclosed source",
        detail: "The vendor doesn't name it",
      },
      { id: "x", label: "Posts on X", detail: "Keyword and semantic search" },
      { id: "browser", label: "A live browser session", detail: "Clicks through pages itself" },
    ],
    engines: [
      {
        slug: "chatgpt",
        links: [{ to: "own-index" }, { to: "bing", reported: true }],
        note: "OpenAI says ChatGPT search partners with other search providers and links Microsoft's and Shopify's privacy policies for them. `OAI-SearchBot` builds its own index.",
      },
      {
        slug: "google-ai-overviews",
        links: [{ to: "google" }],
        note: "AI Overviews and AI Mode draw on Google's Search index, and may fan one question out into many related searches.",
      },
      {
        slug: "gemini",
        links: [{ to: "google" }],
        note: "The Gemini app grounds answers in Google's Search index. Blocking `Google-Extended` also ends that grounding.",
      },
      {
        slug: "claude",
        links: [{ to: "own-index" }, { to: "brave" }],
        note: "`Claude-SearchBot` indexes pages for Claude's search. Anthropic's subprocessor list names Brave Search, TurboPuffer and Parallel for web search, without saying which does what.",
      },
      {
        slug: "perplexity",
        links: [{ to: "own-index" }],
        note: "`PerplexityBot` builds Perplexity's own index; `Perplexity-User` fetches a page live when someone asks.",
      },
      {
        slug: "copilot",
        links: [{ to: "bing" }],
        note: "Copilot sends Bing a few words generated from the prompt and grounds its answer in what comes back.",
      },
      {
        slug: "grok",
        links: [{ to: "undisclosed" }, { to: "x" }],
        note: "Grok searches the live web, with no provider named, and searches posts, users and threads on X.",
      },
      {
        slug: "meta-ai",
        links: [{ to: "own-index" }, { to: "undisclosed" }, { to: "bing", reported: true }],
        note: 'Meta says allowing `Meta-WebIndexer` helps Meta AI cite and link you. Its 2026 AI terms mention "select partners, like search engines"; in 2023 it named Bing.',
      },
      {
        slug: "deepseek",
        links: [{ to: "undisclosed" }],
        note: 'DeepSeek\'s privacy policy says it uses "third-party APIs to provide search services". It documents no crawler.',
      },
      {
        slug: "mistral",
        links: [{ to: "own-index" }, { to: "brave", reported: true }],
        note: "`MistralAI-Index` builds Mistral's own search index. Mistral Vibe (formerly Le Chat) got live web results from Brave's API in 2025.",
      },
      {
        slug: "manus",
        links: [{ to: "undisclosed" }, { to: "browser" }],
        note: 'Manus opens pages in a cloud browser it operates "like a real person". It documents no search source or user agent.',
      },
    ],
    layers: [
      {
        title: "On request: a live fetch",
        body: "When someone shares a link or an engine opens a result, a separate fetcher reads the page: `ChatGPT-User`, `Claude-User`, `Perplexity-User`, `MistralAI-User`, `Meta-ExternalFetcher`. Several of them don't follow robots.txt on these user-triggered visits.",
      },
      {
        title: "No search at all: training data",
        body: "When an engine answers without searching, it relies on what the model learned in training, which is what `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `Meta-ExternalAgent` and `Google-Extended` govern. Opting out leaves OpenAI, Anthropic and Mistral search untouched; `Google-Extended` also ends Gemini-app grounding.",
      },
    ],
  },

  matrix: {
    title: { lead: "Eleven engines,", accent: "side by side" },
    intro:
      "Seven things that change from engine to engine. Every cell is written in that engine's guide, so the table can't drift from the pages it summarizes.",
    note: "Cells are summaries. Each guide carries the detail and cites its sources.",
  },

  foundations: {
    title: { lead: "Do it once,", accent: "then per engine" },
    intro:
      "Most AI SEO is shared work. Six things hold on every engine; the rest is a lookup in the matrix.",
    onceTitle: "True on every engine",
    once: [
      {
        title: "Let each search crawler in, separately",
        body: "Vendors split search from training. Allow `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Meta-WebIndexer`, `MistralAI-Index`, Googlebot and Bingbot, then decide on the training bots on their own merits. Check your CDN as well: from September 15, 2026, Cloudflare's defaults for new domains block Training and Agent bots on pages that show ads.",
        evidence: "official",
      },
      {
        title: "Put the answer in the HTML",
        body: "In Vercel's tests, none of the major AI crawlers ran JavaScript; Gemini, riding on Googlebot, was the one that rendered pages fully. Google processes JavaScript that isn't blocked and Manus drives a real browser, but most engines read only what your server sends.",
        evidence: "observed",
      },
      {
        title: "Compete for the sub-questions",
        body: "Engines turn one prompt into several searches; Google calls it query fan-out. Ahrefs found only 12% of the links ChatGPT, Gemini and Copilot cite rank in Google's top 10 for the prompt itself (Perplexity: 28.6%). Depth across a topic beats one page per keyword.",
        evidence: "observed",
      },
      {
        title: "Write passages that stand alone",
        body: "Citations point at sentences, not whole articles. Lead each section with its answer, and make that answer make sense out of context, with the name, number or date it depends on.",
        evidence: "our-read",
      },
      {
        title: "Date it, and update for real",
        body: "Ahrefs measured AI assistants citing content 25.7% fresher than Google's organic results, with ChatGPT skewing newest. Show a real updated date, and change the substance when you change it.",
        evidence: "observed",
      },
      {
        title: "Get discussed off your site",
        body: "Engines lean on third-party pages: Wikipedia led ChatGPT's most-cited sources and Reddit led Perplexity's in Profound's 2024–25 data. Gemini named brands in 83.7% of appearances but linked them in 21.4% (Semrush, June 2026). Mentions elsewhere put your name in answers you don't own.",
        evidence: "observed",
      },
    ],
    perEngineTitle: "Different on every engine",
    perEngineIntro:
      "Look these up before you touch robots.txt, rendering or analytics. Each is a row in the matrix.",
  },

  start: {
    title: { lead: "Where to", accent: "start" },
    intro:
      "Reach and measurable referrals rank the engines differently. Do the shared work first, then follow your buyers.",
    steps: [
      {
        title: "Fix the shared foundation",
        body: "Crawler access, server-rendered answers and dated pages help on all eleven at once. Access is the fast part: OpenAI says robots.txt changes reach ChatGPT search in about 24 hours, and Perplexity says up to 24.",
      },
      {
        title: "Then the frontier five",
        body: "Google's AI surfaces reach the most people, but their clicks count as Organic Search. ChatGPT sends most of the AI referrals you can see in analytics.",
      },
      {
        title: "Add the other six where your buyers are",
        body: "Each has one job worth doing if your audience uses it.",
      },
    ],
    robots: {
      caption: "robots.txt · every documented search crawler",
      code: `# Search and citation: let these in
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Meta-WebIndexer
User-agent: MistralAI-Index
User-agent: MistralAI-User
User-agent: Googlebot
User-agent: Bingbot
Allow: /

# Training only: your call. Search stays on,
# but Google-Extended also covers Gemini grounding.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: MistralAI-Training
User-agent: Google-Extended
Disallow: /`,
      note: "A named group replaces your `User-agent: *` rules for those bots, so copy any `Disallow` lines you rely on into it. Grok, DeepSeek and Manus document no token to add.",
    },
    reach: [
      {
        slug: "google-ai-overviews",
        value: "2.5B+",
        label: "monthly users of AI Overviews; AI Mode has passed 1B",
        source: {
          name: "Google, May 2026",
          href: "https://blog.google/innovation-and-ai/sundar-pichai-io-2026/",
        },
      },
      {
        slug: "chatgpt",
        value: "1.2B+",
        label: "people use ChatGPT each week",
        source: {
          name: "OpenAI, Oct 2026",
          href: "https://openai.com/index/chatgpt-ads-expands-26-new-countries/",
        },
      },
      {
        slug: "gemini",
        value: "1B+",
        label: "people use the Gemini app each month",
        source: {
          name: "Google, Aug 2026",
          href: "https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/",
        },
      },
      {
        slug: "claude",
        value: "#3",
        label: "AI chatbot site by worldwide visits",
        source: {
          name: "Similarweb, Sep 2026",
          href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
        },
      },
      {
        slug: "perplexity",
        value: "#8",
        label: "AI chatbot site by worldwide visits",
        source: {
          name: "Similarweb, Sep 2026",
          href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
        },
      },
    ],
    referrals: {
      title: "Share of AI referral visits, Jan–Apr 2026",
      note: "Across 101,574 sites. All AI platforms together sent 0.32% of their traffic. Google's AI Overviews aren't here: those clicks count as Organic Search.",
      rows: [
        { slug: "chatgpt", share: 74.78 },
        { slug: "gemini", share: 11.56 },
        { slug: "perplexity", share: 7.23 },
        { slug: "copilot", share: 3.51 },
        { slug: "claude", share: 2.62 },
      ],
      source: { name: "SE Ranking", href: "https://seranking.com/blog/ai-traffic-research-study/" },
    },
    situations: [
      {
        slug: "copilot",
        when: "Your buyers work in Microsoft 365 or search with Bing",
        why: "Copilot grounds in Bing, so the work is Bing's: Webmaster Tools, IndexNow, and no `noarchive` on pages you want quoted.",
      },
      {
        slug: "grok",
        when: "Your category gets argued about on X",
        why: "Grok searches X posts and threads alongside the web, so an account that states your facts plainly is part of the job.",
      },
      {
        slug: "meta-ai",
        when: "Your customers live in WhatsApp, Instagram or Facebook",
        why: "Meta AI sits inside all three. Allow `Meta-WebIndexer`: Meta says it helps Meta AI cite and link your pages.",
      },
      {
        slug: "deepseek",
        when: "Your buyers use DeepSeek",
        why: "It's the #4 AI chatbot site by visits yet sends almost no referrals. There's no crawler to allow, so clear, server-rendered pages are the whole job.",
      },
      {
        slug: "mistral",
        when: "Your buyers use Mistral Vibe (formerly Le Chat)",
        why: "One robots.txt token, `MistralAI-Index`, feeds Mistral's own search index. The training opt-out is a separate token.",
      },
      {
        slug: "manus",
        when: "Agents do research or buying tasks for your buyers",
        why: "Manus opens your pages in a cloud browser from data-center IPs, which bot rules can block. Keep the facts in visible text on stable URLs.",
      },
    ],
    rankbox: {
      title: "The writing is the part Rankbox does",
      body: "Rankbox finds the questions your buyers ask, writes source-backed, answer-first articles, scores every draft and publishes on your schedule.",
    },
  },

  faqs: [
    {
      q: "What is AI SEO?",
      a: "AI SEO is optimizing your site so AI engines retrieve, quote and link it in their answers: ChatGPT, Google AI Overviews and AI Mode, Gemini, Claude, Perplexity and the rest. It also goes by generative engine optimization (GEO), answer engine optimization (AEO) and LLM SEO. The names differ; the work is the same.",
    },
    {
      q: "Is AI SEO different from regular SEO?",
      a: 'Less than the labels suggest. Google\'s own guide says optimizing for generative AI search "is optimizing for the search experience, and thus still SEO", and that AI Overviews and AI Mode have "no additional requirements". The differences show up outside Google: separate crawlers to allow, other indexes (Bing, Brave and the engines\' own) and little JavaScript rendering.',
    },
    {
      q: "Which AI engine should I optimize for first?",
      a: "Start with the shared foundation, then follow your buyers. By reach, Google leads: AI Overviews has over 2.5 billion monthly users, and ChatGPT over 1.2 billion weekly. By referrals you can measure, ChatGPT sent about 75% of AI referral visits in early 2026, Gemini about 12% and Perplexity about 7% (SE Ranking). AI Overviews clicks count as Organic Search, so they aren't in that split.",
    },
    {
      q: "Does ChatGPT use Bing?",
      a: "Partly, by implication. OpenAI says ChatGPT search \"sometimes partners with other search providers\" and links Microsoft's and Shopify's privacy policies for them, without naming Bing outright, and it builds its own index with `OAI-SearchBot`. Allow `OAI-SearchBot`, the step OpenAI documents, and get indexed in Bing too: it covers that path and [Copilot](/ai-seo/copilot) depends on it.",
    },
    {
      q: "Does blocking AI training crawlers hurt my AI visibility?",
      a: "Usually not. `GPTBot`, `ClaudeBot` and `MistralAI-Training` are training-only, and blocking them leaves you in ChatGPT, Claude and Mistral Vibe search. Two exceptions: disallowing `Google-Extended` also removes you from Gemini-app grounding, and a `noarchive` tag keeps your content out of Copilot's answers.",
    },
    {
      q: "Is there a Search Console setting for Google's AI features?",
      a: "Yes. Since August 31, 2026, every Search Console property has a Search generative AI control under Settings. Inclusion is the default. Choosing exclude keeps your links and content out of AI Overviews, AI Mode and Discover's generative features, usually within a day or two. It doesn't affect training (that's `Google-Extended`) and isn't a ranking signal.",
    },
    {
      q: "Do I need an llms.txt file for AI SEO?",
      a: "Not for Google: its AI optimization guide says Google Search doesn't use llms.txt and you can ignore it there. None of the other engines' crawler docs listed below mention it either. SE Ranking found about 10% of nearly 300,000 domains had one, and no link between having one and being cited. It does no harm, but it isn't a priority.",
    },
    {
      q: "How do I track traffic from AI engines?",
      a: "Since May 2026, GA4 has a default AI Assistant channel for visits from assistants such as ChatGPT, Gemini, DeepSeek, Copilot and Grok. Google's AI Overviews and AI Mode stay in Organic Search. ChatGPT tags most cited links with `utm_source=chatgpt.com`, but visits that arrive without a referrer, common from apps and agents, still land in Direct. Analytics shows clicks, not citations, so pair it with a fixed set of test prompts you rerun.",
    },
    {
      q: "How long does AI SEO take to work?",
      a: "Access fixes are fast: OpenAI says robots.txt changes take about 24 hours to reach ChatGPT search, and Perplexity says up to 24 hours. Content changes take longer, because pages have to be recrawled and weighed against other sources. Plan in weeks, and test with the same prompts each time so you can see the shift.",
    },
    {
      q: "Should I optimize for Copilot, Grok, Meta AI, DeepSeek, Mistral Vibe or Manus too?",
      a: "If your buyers use them, and each has one main job. [Copilot](/ai-seo/copilot) runs on Bing, so Bing Webmaster Tools and IndexNow cover it; [Meta AI](/ai-seo/meta-ai) needs `Meta-WebIndexer`; [Mistral Vibe](/ai-seo/mistral) needs `MistralAI-Index`; [Grok](/ai-seo/grok) also searches X; [DeepSeek](/ai-seo/deepseek) names no crawler, so server-rendered HTML is the job; and [Manus](/ai-seo/manus) visits in a cloud browser your bot rules can block.",
    },
  ],

  sources: [
    {
      kind: "vendor",
      title: "Optimizing your website for generative AI features on Google Search",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    },
    {
      kind: "vendor",
      title: "AI features and your website",
      publisher: "Google Search Central",
      href: "https://developers.google.com/search/docs/appearance/ai-features",
    },
    {
      kind: "vendor",
      title: "Search generative AI control",
      publisher: "Google Search Console Help",
      href: "https://support.google.com/webmasters/answer/16908024",
    },
    {
      kind: "vendor",
      title: "Google's common crawlers (Google-Extended)",
      publisher: "Google",
      href: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers",
    },
    {
      kind: "vendor",
      title: "Expanding AI Mode (query fan-out)",
      publisher: "Google",
      href: "https://blog.google/products/search/google-search-ai-mode-update/",
    },
    {
      kind: "vendor",
      title: "Default channel group (AI Assistant)",
      publisher: "Google Analytics Help",
      href: "https://support.google.com/analytics/answer/9756891",
    },
    {
      kind: "vendor",
      title: "Overview of OpenAI crawlers",
      publisher: "OpenAI",
      href: "https://developers.openai.com/api/docs/bots",
    },
    {
      kind: "vendor",
      title: "Introducing ChatGPT search",
      publisher: "OpenAI",
      href: "https://openai.com/index/introducing-chatgpt-search/",
    },
    {
      kind: "vendor",
      title: "Searching the web with ChatGPT (search providers)",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      kind: "vendor",
      title: "Anthropic's crawlers: ClaudeBot, Claude-User, Claude-SearchBot",
      publisher: "Claude Help Center",
      href: "https://support.claude.com/en/articles/8896518",
    },
    {
      kind: "vendor",
      title: "Subprocessors (Web Search: Brave Search, TurboPuffer, Parallel)",
      publisher: "Anthropic Trust Center",
      href: "https://trust.anthropic.com/subprocessors",
    },
    {
      kind: "vendor",
      title: "Perplexity crawlers",
      publisher: "Perplexity",
      href: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers",
    },
    {
      kind: "vendor",
      title: "Copilot Chat privacy and protections (web grounding via Bing)",
      publisher: "Microsoft Learn",
      href: "https://learn.microsoft.com/en-us/copilot/privacy-and-protections",
    },
    {
      kind: "vendor",
      title: "New options for webmasters to control usage of their content in Bing Chat",
      publisher: "Bing Webmaster Blog",
      href: "https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat",
    },
    {
      kind: "vendor",
      title: "Web Search tool",
      publisher: "xAI",
      href: "https://docs.x.ai/developers/tools/web-search",
    },
    {
      kind: "vendor",
      title: "X Search tool",
      publisher: "xAI",
      href: "https://docs.x.ai/developers/tools/x-search",
    },
    {
      kind: "vendor",
      title: "Meta web crawlers",
      publisher: "Meta for Developers",
      href: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers",
    },
    {
      kind: "vendor",
      title: "Introducing new AI experiences across our family of apps (2023)",
      publisher: "Meta",
      href: "https://about.fb.com/news/2023/09/introducing-ai-powered-assistants-characters-and-creative-tools/",
    },
    {
      kind: "vendor",
      title: "Meta AI terms (search partners), effective May 13, 2026",
      publisher: "Meta",
      href: "https://www.facebook.com/legal/ai-terms",
    },
    {
      kind: "vendor",
      title: "DeepSeek privacy policy",
      publisher: "DeepSeek",
      href: "https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html",
    },
    {
      kind: "vendor",
      title: "Mistral AI crawlers (robots)",
      publisher: "Mistral AI",
      href: "https://docs.mistral.ai/robots",
    },
    {
      kind: "vendor",
      title: "Cloud Browser",
      publisher: "Manus",
      href: "https://manus.im/docs/features/cloud-browser.md",
    },
    {
      kind: "vendor",
      title: "Block AI bots (new defaults from September 15, 2026)",
      publisher: "Cloudflare Docs",
      href: "https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/",
    },
    {
      kind: "vendor",
      title: "Google I/O 2026 keynote (AI Overviews and AI Mode users)",
      publisher: "Google",
      href: "https://blog.google/innovation-and-ai/sundar-pichai-io-2026/",
    },
    {
      kind: "vendor",
      title: "The Gemini app passes 1 billion monthly users",
      publisher: "Google",
      href: "https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/",
    },
    {
      kind: "vendor",
      title: "ChatGPT ads expand to 26 new countries (weekly users)",
      publisher: "OpenAI",
      href: "https://openai.com/index/chatgpt-ads-expands-26-new-countries/",
    },
    {
      kind: "study",
      title: "Anthropic appears to be using Brave to power web searches for its Claude chatbot",
      publisher: "TechCrunch",
      href: "https://techcrunch.com/2025/03/21/anthropic-appears-to-be-using-brave-to-power-web-searches-for-its-claude-chatbot/",
    },
    {
      kind: "study",
      title: "The rise of the AI crawler",
      publisher: "Vercel",
      href: "https://vercel.com/blog/the-rise-of-the-ai-crawler",
    },
    {
      kind: "study",
      title: "Only 12% of AI-cited URLs rank in Google's top 10",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/ai-search-overlap/",
    },
    {
      kind: "study",
      title: "Do AI assistants prefer to cite fresh content?",
      publisher: "Ahrefs",
      href: "https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/",
    },
    {
      kind: "study",
      title: "AI platform citation patterns",
      publisher: "Profound",
      href: "https://www.tryprofound.com/blog/ai-platform-citation-patterns",
    },
    {
      kind: "study",
      title: "The ghost citations study",
      publisher: "Semrush",
      href: "https://www.semrush.com/blog/the-ghost-citations-study/",
    },
    {
      kind: "study",
      title: "AI traffic research study, 2026",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/ai-traffic-research-study/",
    },
    {
      kind: "study",
      title: "Does llms.txt impact AI visibility and citations?",
      publisher: "SE Ranking",
      href: "https://seranking.com/blog/llms-txt/",
    },
    {
      kind: "study",
      title: "Top AI chatbots and tools websites, September 2026",
      publisher: "Similarweb",
      href: "https://www.similarweb.com/top-websites/ai-chatbots-and-tools/",
    },
    {
      kind: "study",
      title: "ChatGPT UTM tracking",
      publisher: "LLM Pulse",
      href: "https://llmpulse.ai/data-studies/chatgpt-utm-tracking",
    },
  ],

  cta: {
    title: "Write the pages every engine can cite",
    body: "Rankbox researches the questions your buyers ask, writes source-backed, answer-first articles, scores each draft and publishes on your schedule.",
  },
};
