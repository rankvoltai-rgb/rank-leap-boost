/**
 * Copy for the /ai-seo hub: what AI SEO is, the cross-engine matrix, the
 * principles that hold on every engine, and the general FAQ. The matrix cells
 * themselves come from each guide's `profile`, never from here.
 */
import type { EngineProfile, Faq, Md } from "./types";

export const PROFILE_ROWS: { key: keyof EngineProfile; label: string; mono?: boolean }[] = [
  { key: "retrieval", label: "Where answers come from" },
  { key: "searchCrawler", label: "Crawler to allow", mono: true },
  { key: "trainingCrawler", label: "Training opt-out" },
  { key: "rendersJs", label: "Runs your JavaScript?" },
  { key: "referrer", label: "Shows up in analytics as" },
  { key: "citationStyle", label: "How citations look" },
  { key: "biggestLever", label: "Biggest lever" },
];

export const OVERVIEW: {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  subhead: string;
  shortAnswer: Md;
  principlesTitle: string;
  principlesIntro: string;
  principles: { title: string; body: Md }[];
  faqs: Faq[];
} = {
  metaTitle: "AI SEO Guides: Get Cited by ChatGPT, Gemini, Claude & More",
  metaDescription:
    "Technical AI SEO guides for ChatGPT, Google AI Overviews, Gemini, Claude and Perplexity — crawlers, indexes, robots.txt and tracking, compared.",
  keywords: [
    "AI SEO",
    "generative engine optimization",
    "GEO",
    "LLM SEO",
    "AI search optimization",
    "answer engine optimization",
  ],
  h1: "AI SEO guides: how to get cited by every answer engine",
  subhead:
    "ChatGPT, Google AI Overviews, Gemini, Claude and Perplexity each search a different index, send different crawlers and show citations differently. Pick your engine for its technical guide — or compare all five side by side.",
  shortAnswer:
    "**AI SEO** — also called generative engine optimization (GEO) or LLM SEO — is the work of getting your pages retrieved, quoted and linked inside AI-generated answers. The foundation is shared with classic SEO: crawlable, indexed, trustworthy pages. What differs is each engine's plumbing: ChatGPT draws on Bing and OpenAI's own index, Claude on Brave Search, Perplexity on its own 200-billion-URL index, and Gemini and Google AI Overviews on Google's. Get crawler access right per engine, serve server-rendered HTML, and compete passage by passage for the sub-questions each engine searches.",
  principlesTitle: "Six things that hold on every engine",
  principlesIntro:
    "The engines disagree on indexes, crawlers and citation formats. They agree on these — so do them once and every guide gets easier.",
  principles: [
    {
      title: "Crawler access is per engine",
      body: "Each vendor separates search from training: allow `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` and Googlebot, then decide on `GPTBot`, `ClaudeBot` and `Google-Extended` on their own terms. Check your CDN too — its AI-bot toggles override robots.txt.",
    },
    {
      title: "Only Google runs your JavaScript",
      body: "OpenAI, Anthropic and Perplexity's fetchers read raw HTML. If the answer appears only after scripts run, four of five engines can't see it. Server-render or pre-render anything you want cited.",
    },
    {
      title: "Passages compete, not pages",
      body: "Engines lift sentences, not articles. Put the answer in the first lines of each section, in sentences that make sense alone and carry a name, a number or a date.",
    },
    {
      title: "You compete for sub-questions",
      body: "Every engine fans one prompt out into several searches. That's why so few citations rank top-10 for the typed query — and why depth across a topic beats one page per keyword.",
    },
    {
      title: "Freshness is visible — and checked",
      body: "Claude adds the year to 94% of its queries, Perplexity filters stale pages before ranking, and ChatGPT's citations skew newer than search results. Show real dates and update substantively.",
    },
    {
      title: "Off-site mentions are a second route in",
      body: "Forums, YouTube, review sites and trade press get cited heavily — and Gemini names brands far more often than it links them. Being discussed elsewhere puts your name in answers you don't own.",
    },
  ],
  faqs: [
    {
      q: "What is AI SEO?",
      a: "AI SEO is optimizing your site to be retrieved, quoted and linked in AI-generated answers from ChatGPT, Google AI Overviews, Gemini, Claude and Perplexity. It's also called generative engine optimization (GEO), answer engine optimization (AEO) or LLM SEO.",
    },
    {
      q: "Is AI SEO different from regular SEO?",
      a: 'Less than the labels suggest. Google says optimizing for its AI features "is still SEO," and crawlable, indexed, trustworthy pages are the foundation everywhere. The differences are per-engine: separate crawlers to allow, different indexes (Brave for Claude, Perplexity\'s own), and little or no JavaScript rendering outside Google.',
    },
    {
      q: "Which AI engine should I optimize for first?",
      a: "Start with what they share: crawler access, server-rendered HTML and answer-first pages. Then weigh reach — Google's AI Overviews reach over 2.5 billion monthly users and ChatGPT 900 million weekly users — against where your buyers actually ask.",
    },
    {
      q: "Does blocking AI training crawlers hurt my AI visibility?",
      a: "Mostly no: `GPTBot` and `ClaudeBot` are training-only, and blocking them leaves you in ChatGPT and Claude search. The exception is Gemini, where disallowing `Google-Extended` also removes you from Gemini-app grounding.",
    },
    {
      q: "Do I need an llms.txt file for AI SEO?",
      a: "No engine has confirmed using other sites' llms.txt files to find or rank content, and Google says Search ignores them. Studies find most llms.txt files are never requested. It does no harm, but it isn't a priority.",
    },
    {
      q: "How do I track traffic from AI engines?",
      a: "Referrers differ: `chatgpt.com` (tagged `utm_source=chatgpt.com`), `claude.ai`, `perplexity.ai` and `gemini.google.com`. GA4's AI Assistant channel groups some assistants automatically since May 2026, but Google AI Overviews clicks stay in Organic Search. Pair analytics with a weekly prompt panel for citations.",
    },
    {
      q: "How long does AI SEO take to work?",
      a: "Access fixes land fast — OpenAI and Perplexity apply robots.txt changes within about 24 hours. Content changes take weeks, because pages must be recrawled and weighed against other sources. Measure weekly with a fixed prompt set so you can see the shift when it comes.",
    },
  ],
};
