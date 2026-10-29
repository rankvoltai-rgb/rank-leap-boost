/**
 * /white-label/ai-seo: every word on the page.
 *
 * Prices, the trial and the state of the publishing add-ons come from
 * facts.ts, so a plan or shipping change updates this page with no edit here.
 * Outside facts carry their source and the date they were read (SOURCES).
 * The agency (Brindlework), the client (Plotbright) and plotbright.example are
 * fictional and labelled as a sample wherever they render.
 */
import {
  LIVE_ADDONS,
  PLAN,
  STUDIO,
  TRIAL,
  TRIAL_TERMS,
  formatUsd,
} from "@/sublanding/_shared/facts";
import { listNames } from "@/data/competitors/shared";
import { ENGINES, type EngineSlug } from "@/data/ai-seo/engines";

export const PATH = "/white-label/ai-seo";

/** The breadcrumb's last crumb and the registry name. */
export const NAME = "White label AI SEO";

/** When the outside facts below were last read on their own pages. */
export const CHECKED_ON = "2026-10-29";
const CHECKED = "29 October 2026";

/** Printed after a source's name wherever one is cited. */
export const READ_ON = `read ${CHECKED}`;

const SITE_PRICE = formatUsd(STUDIO.monthlyPerSite);

/* ------------------------------------------------------------------ */
/* Links                                                               */
/* ------------------------------------------------------------------ */

/** Routes on this site the copy links to by path, including the hub and its two other deep dives. */
export type StaticPath =
  | "/white-label"
  | "/white-label/content-writing"
  | "/white-label/pricing"
  | "/pricing"
  | "/ai-seo"
  | "/solutions/autonomous-geo";

/** An internal link from the copy. PageLink renders it; ai-seo.test.ts resolves it. */
export type Target =
  | { kind: "page"; to: StaticPath }
  | { kind: "tool"; slug: string }
  | { kind: "blog"; slug: string }
  | { kind: "feature"; slug: string }
  | { kind: "engine"; slug: EngineSlug }
  | { kind: "anchor"; id: string };

/** A primary source for an outside fact, with the date it was read. */
export interface Source {
  label: string;
  url: string;
  checked: string;
}

export const SOURCES = {
  openai: {
    label: "OpenAI: Overview of OpenAI crawlers",
    url: "https://developers.openai.com/api/docs/bots",
    checked: CHECKED_ON,
  },
  anthropic: {
    label: "Anthropic: how site owners can block the crawler",
    url: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    checked: CHECKED_ON,
  },
  perplexity: {
    label: "Perplexity: Perplexity crawlers",
    url: "https://docs.perplexity.ai/guides/bots",
    checked: CHECKED_ON,
  },
  googleCrawlers: {
    label: "Google: common crawlers and Google-Extended",
    url: "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers",
    checked: CHECKED_ON,
  },
  googleAiFeatures: {
    label: "Google Search Central: AI features and your website",
    url: "https://developers.google.com/search/docs/appearance/ai-features",
    checked: CHECKED_ON,
  },
  searchConsole: {
    label: "Google: generative AI performance reports in Search Console",
    url: "https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports",
    checked: CHECKED_ON,
  },
  bing: {
    label: "Bing: AI Performance in Bing Webmaster Tools",
    url: "https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview",
    checked: CHECKED_ON,
  },
  copilotIndex: {
    label: "Microsoft Advertising: content in AI search answers",
    url: "https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers",
    checked: CHECKED_ON,
  },
  ga4Channel: {
    label: "Google Analytics: default channel group",
    url: "https://support.google.com/analytics/answer/9756891",
    checked: CHECKED_ON,
  },
  ga4Release: {
    label: "Google Analytics: what's new, 13 May 2026",
    url: "https://support.google.com/analytics/answer/9164320",
    checked: CHECKED_ON,
  },
  sparktoro: {
    label: "SparkToro: AIs are highly inconsistent when recommending brands",
    url: "https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/",
    checked: CHECKED_ON,
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

/* ------------------------------------------------------------------ */
/* Contract: META, FAQS, OUTLINE                                       */
/* ------------------------------------------------------------------ */

export const META = {
  query: "white label ai seo",
  title: "White Label AI SEO: Sell GEO Under Your Agency's Name | Rankbox",
  description:
    "Turn the ChatGPT question into a monthly deliverable: Rankbox researches and writes cited answers for each client site, and you run the checks and the report.",
  h1: "Sell white label AI SEO to clients asking about ChatGPT",
  keywords: [
    "white label ai seo",
    "white label geo",
    "white label generative engine optimization",
    "white label aeo services",
    "ai seo for agencies",
    "geo service for agencies",
  ],
};

export const OUTLINE = [
  { id: "scope", h2: "One AI search retainer, line by line" },
  { id: "prospect", h2: "Check a prospect's site before the pitch" },
  { id: "explain", h2: "How to explain AI search to a client" },
  { id: "reporting", h2: "Reporting without a citation tracker" },
  { id: "engines", h2: "Engine notes for client sites" },
  { id: "more", h2: "More for agencies selling AI search" },
  { id: "faq", h2: "White label AI SEO questions" },
  { id: "start", h2: "Put AI search on your next proposal" },
] as const;

export type SectionId = (typeof OUTLINE)[number]["id"];

/** The H2 for a section, as OUTLINE spells it. */
export function h2(id: SectionId): string {
  return OUTLINE.find((s) => s.id === id)!.h2;
}

export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is white label AI SEO?",
    a: "It's generative engine optimization that an agency sells under its own brand while the work runs on someone else's system. On Rankbox, the agency gives each client a Studio site: Rankbox researches that client's buyer questions, then writes and scores the answer articles. The agency handles the access checks, the reporting and the relationship. The client never gets a Rankbox login and never hears from Rankbox.",
  },
  {
    q: "Is white label GEO the same as white label AEO?",
    a: "In practice, yes. GEO (generative engine optimization) and AEO (answer engine optimization) are two names for getting a brand into AI-written answers, and agencies sell both under either label. The deliverable doesn't change: a site the engines can read, pages that answer buyer questions with sources, and an honest monthly check of what the engines say.",
  },
  {
    q: "Can I guarantee a client they'll be cited by ChatGPT?",
    a: "You shouldn't. No one controls what an engine quotes, and the same question gets different answers from one run to the next. Promise the work instead: crawler access fixed, a set number of answer articles published each month, and a report built from Search Console, Bing Webmaster Tools, GA4 and your own prompt checks.",
  },
  {
    q: "Does Rankbox show whether ChatGPT mentions my clients?",
    a: "Not yet. Rankbox doesn't run prompts through AI engines or record citations. Run the checks by hand with the free AI Visibility Prompt Kit, which writes the questions and keeps a scorecard, or add a dedicated tracker if a client wants daily numbers.",
  },
  {
    q: "Can the monthly AI search report carry my agency's branding?",
    a: "Yes, because you write it. Rankbox doesn't produce client reports, so the report is your own document: numbers from the client's Search Console, Bing Webmaster Tools and GA4, the results of your prompt check, and the list of articles that went live that month.",
  },
  {
    q: "Which free tools help with an AI search audit for a client?",
    a: "Start with the AI Search Readiness Check for crawler access and page basics, then the robots.txt Tester for any rule it flags. The AI Citation Readiness Checker scores an existing page on how easy it is to quote, and the AI Visibility Prompt Kit writes the buyer questions for your monthly check. They're all free at rankbox.xyz/tools and need no account.",
  },
  {
    q: "Is AI SEO an extra charge on a Studio site?",
    a: `No. Each Studio site is ${SITE_PRICE} a month and comes with the full plan: answer research, ${PLAN.articlesPerMonth} articles a month with SEO and GEO scores, and its own publishing key. There's no separate AI search add-on to buy.`,
  },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO = {
  crumbs: { home: "Home", hub: "White label", here: "AI SEO" },
  kicker: "For agencies, studios and freelancers",
  answer:
    "White label AI SEO is generative engine optimization sold under your agency's name. Rankbox runs a site for each of your clients in Studio: it finds the questions their buyers ask AI, writes cited answer articles in their voice and scores each one for SEO and GEO. You run the checks, send the report and keep the relationship.",
  cta: "Start your Studio",
  pending: "Opening…",
  note: `${TRIAL} for your own site · Card required · Client sites open once the plan is paid`,
};

/** The sample email in the hero: the question the page answers. */
export const EMAIL = {
  sample: "Sample",
  label: "A sample email from a fictional client to a fictional agency",
  from: "Plotbright marketing",
  initial: "P",
  to: "to Brindlework",
  subject: "Why aren't we in ChatGPT?",
  body: "A customer told us she asked ChatGPT for the best garden planner app. It listed three apps, and none of them were ours. Is this something you can help with?",
  reply: "Brindlework's reply is the scope below",
};

/* ------------------------------------------------------------------ */
/* The scope sheet (the focal visual)                                  */
/* ------------------------------------------------------------------ */

export type View = "client" | "who";
export type Doer = "rankbox" | "team" | "developer";
export type Cadence = "once" | "monthly";

export interface ScopeLine {
  id: string;
  cadence: Cadence;
  title: string;
  /** The line as the client reads it: the agency's words, no Rankbox. */
  client: string;
  doer: Doer;
  /** Your team runs this line with one of the free tools at /tools. */
  withTool?: boolean;
  /** How the line actually gets done. */
  how: string;
  link?: { label: string; target: Target };
}

/** How articles reach a client's site today, from which add-ons have shipped. */
const PUBLISHING_HOW =
  LIVE_ADDONS.length === 0
    ? "The client's developer connects their site to the Rankbox publishing API once, using that site's own key. None of the CMS add-ons is live yet, so every site connects through the API for now."
    : `On ${listNames(LIVE_ADDONS)}, the client installs the Rankbox add-on. Any other site is connected once by its developer through the Rankbox publishing API, using that site's own key.`;

export const SCOPE = {
  intro:
    "White-label GEO offers usually list three things: an audit, content work and a monthly visibility report. This sample scope shows what each one turns into when Rankbox works behind your agency. Switch the view to see who does each line.",
  switchLabel: "Show the scope as",
  views: { client: "Your client's copy", who: "Who does each line" } satisfies Record<View, string>,
  sheet: {
    agency: "Brindlework",
    agencyInitial: "B",
    title: "AI search programme",
    preparedFor: "Prepared for Plotbright",
    domain: "plotbright.example",
    sample: "Sample",
  },
  cadence: { once: "At the start, once", monthly: "Every month" } satisfies Record<Cadence, string>,
  columns: { line: "Line", owner: "Owner" },
  /** The owner column as the client reads it: the agency, or their own developer. */
  clientOwner: { agency: "Brindlework", developer: "Your developer" },
  count: (once: number, monthly: number) =>
    `${once + monthly} lines · ${once} at the start, ${monthly} every month`,
  legendLabel: "Who runs each line",
  doers: {
    rankbox: "Rankbox",
    team: "Your team",
    developer: "Client's developer",
  } satisfies Record<Doer, string>,
  /** The owner chip for a line your team runs with a free tool. */
  withTool: "Your team + free tool",
  footer: {
    client: "Prepared by Brindlework. Nothing on this page names the software behind it.",
    who: "No line promises a citation. Nobody controls what an engine quotes, so the scope sells the work and an honest count.",
  } satisfies Record<View, string>,
  caption:
    "Sample scope. Brindlework and Plotbright are fictional, and plotbright.example isn't a real site.",
};

export const SCOPE_LINES: ScopeLine[] = [
  {
    id: "access",
    cadence: "once",
    title: "Crawler access review",
    client:
      "We make sure the search crawlers behind ChatGPT, Claude, Perplexity, Copilot and Google can read your site, and fix whatever is stopping them.",
    doer: "team",
    withTool: true,
    how: "Run the free AI Search Readiness Check on the client's homepage, then the robots.txt Tester on any rule it flags. The fixes go to whoever manages the client's site.",
    link: {
      label: "AI Search Readiness Check",
      target: { kind: "tool", slug: "ai-search-readiness-check" },
    },
  },
  {
    id: "questions",
    cadence: "once",
    title: "Question map",
    client:
      "The questions your buyers put to AI assistants about planning a garden, grouped by what they're trying to do, with an estimate of how often each comes up.",
    doer: "rankbox",
    how: "Rankbox reads the client's site when you add it in Studio and maps the questions around it. Demand and difficulty are AI estimates, not keyword-database figures. You choose which searches to target.",
    link: {
      label: "How the question map is built",
      target: { kind: "feature", slug: "answer-space-research" },
    },
  },
  {
    id: "connect",
    cadence: "once",
    title: "Publishing to your site",
    client: "New articles appear on your own blog, at your own addresses, under your name.",
    doer: "developer",
    how: PUBLISHING_HOW,
  },
  {
    id: "articles",
    cadence: "monthly",
    title: "Answer articles",
    client: `Up to ${PLAN.articlesPerMonth} researched articles a month, each answering one question your buyers ask and citing its sources.`,
    doer: "rankbox",
    how: "Rankbox drafts each article in the voice you set for this client, on a schedule you set. You can edit any of them in the editor before or after they publish.",
    link: {
      label: "The article production line",
      target: { kind: "page", to: "/white-label/content-writing" },
    },
  },
  {
    id: "score",
    cadence: "monthly",
    title: "SEO and GEO check",
    client: "Every article is checked for Google and for AI answers before it goes live.",
    doer: "rankbox",
    how: "Each article carries two scores, one for search and one for how easily an AI engine can quote it, so your review starts with the weakest.",
    link: { label: "What the scores check", target: { kind: "feature", slug: "seo-geo-score" } },
  },
  {
    id: "prompts",
    cadence: "monthly",
    title: "AI answer check",
    client:
      "We ask ChatGPT, Perplexity and Gemini the questions your buyers ask, more than once each, and note whether you're named, linked or missing.",
    doer: "team",
    withTool: true,
    how: "Build the question list once with the free AI Visibility Prompt Kit, then run it by hand each month and fill in its scorecard. Rankbox doesn't run prompts for you.",
    link: {
      label: "AI Visibility Prompt Kit",
      target: { kind: "tool", slug: "ai-visibility-prompt-generator" },
    },
  },
  {
    id: "visits",
    cadence: "monthly",
    title: "Visits from AI assistants",
    client:
      "How many visits reached your site from AI assistants, taken from your own Google Analytics.",
    doer: "team",
    how: "Read the AI Assistant channel in the client's GA4, and check Referral for perplexity.ai, which Google's channel doesn't name.",
    link: {
      label: "Setting up GA4 for AI traffic",
      target: { kind: "blog", slug: "how-to-track-ai-referral-traffic-in-ga4" },
    },
  },
  {
    id: "impressions",
    cadence: "monthly",
    title: "Appearances in Google and Bing AI answers",
    client:
      "How often your pages appeared in Google's AI Overviews and AI Mode, and how often Copilot cited them.",
    doer: "team",
    how: "Read the generative AI view in the client's Search Console and the AI Performance report in Bing Webmaster Tools. The client adds you as a user on both.",
  },
  {
    id: "note",
    cadence: "monthly",
    title: "Monthly note",
    client: "What we published, what moved, and the questions we'll answer next month.",
    doer: "team",
    how: "Your document, on your letterhead. Rankbox doesn't produce client reports, so this one is yours to write, with the month's live article links in it.",
  },
];

/** Lines per doer, in the order the legend shows them. */
export const DOER_ORDER: Doer[] = ["rankbox", "team", "developer"];

export function countByDoer(lines: ScopeLine[]): Record<Doer, number> {
  const counts: Record<Doer, number> = { rankbox: 0, team: 0, developer: 0 };
  for (const l of lines) counts[l.doer] += 1;
  return counts;
}

/** The sheet's summary in "who does each line", computed from the lines. */
export function scopeSummary(lines: ScopeLine[]): string {
  const c = countByDoer(lines);
  return `Rankbox runs ${c.rankbox} of ${lines.length} lines: the research, the writing and the scoring. Your team runs ${c.team}, with free tools and the client's own dashboards. The client's developer connects the site once.`;
}

/* ------------------------------------------------------------------ */
/* Check a prospect's site                                             */
/* ------------------------------------------------------------------ */

export const PROSPECT = {
  intro:
    "The first line of that scope works as a sales tool too. Enter a prospect's homepage and this runs the same live check as the free tool: it fetches the page, its robots.txt and its llms.txt once, the way a crawler would, without running JavaScript.",
  label: "Prospect's site",
  placeholder: "theirsite.com",
  run: "Check the site",
  running: "Checking",
  empty: "Enter a site address first.",
  idleTitle: "What comes back",
  idle: [
    "Which AI search crawlers its robots.txt lets in",
    "How many words a crawler sees without JavaScript",
    "Structured data, title, description and H1",
    "A score out of 100, with the fixes worst first",
  ],
  loading: (site: string) => `Fetching ${site} as a crawler would…`,
  scoreLabel: "Readiness",
  passed: (n: number, total: number) => `${n} of ${total} checks pass`,
  botsLabel: "Search and live-fetch crawlers",
  allowed: "allowed",
  blocked: "blocked",
  openingsLabel: "Openings for your pitch",
  noOpenings:
    "Nothing failed. Engines can read this site, so the pitch is about what it publishes.",
  full: "Open the full report in the free tool",
  error: "The check didn't finish. Try again in a minute.",
  retry: "Try again",
  /** The one-line read of a result, for the top of the panel. */
  headline: (score: number, blocked: string[]) =>
    blocked.length
      ? `robots.txt blocks ${listNames(blocked)}. Any engine that relies on ${blocked.length === 1 ? "that crawler" : "those crawlers"} can't read this site.`
      : score >= 85
        ? "Engines can read this site. The gap to sell is answers to its buyers' questions."
        : score >= 60
          ? "The basics are mostly there. The failed checks below are quick fixes to put in the first month."
          : "Engines will struggle to read this site. Fixing access is the first month's work.",
};

/* ------------------------------------------------------------------ */
/* How to explain AI search to a client                                */
/* ------------------------------------------------------------------ */

export interface TalkItem {
  q: string;
  a: string;
  source?: SourceId;
  link?: { label: string; target: Target };
}

export const EXPLAIN = {
  kicker: "In the meeting",
  intro:
    "Clients rarely need the mechanics. They want to know why a competitor shows up, whether you can change that, and how they'll know. These answers work in a meeting, and each comes with a source you can forward.",
  sourceLead: "Source:",
  items: [
    {
      q: "Why does ChatGPT recommend other apps and not us?",
      a: "When ChatGPT searches the web, it can only show pages its search crawler is allowed to read, and it favours pages that answer the question asked. OpenAI's crawler documentation puts it bluntly: sites opted out of OAI-SearchBot are left out of ChatGPT search answers. So we check access first, then publish pages that answer your buyers' questions directly.",
      source: "openai",
    },
    {
      q: "Can you guarantee we'll show up?",
      a: "No, and be wary of anyone who does. AI answers shift from one run to the next. When SparkToro and Gumshoe had 600 volunteers run the same 12 prompts nearly 3,000 times, they put the chance of ChatGPT or Google's AI giving the same list of brands twice at less than 1 in 100. We work on what raises the odds and count across many runs, never one screenshot.",
      source: "sparktoro",
    },
    {
      q: "Is this separate from the SEO we already pay for?",
      a: "It sits on the same foundation. For a page to appear as a link in AI Overviews or AI Mode, Google asks only that it's indexed and eligible to show with a snippet. What changes is the content: pages that answer one question directly and cite their sources, so an engine can lift the answer.",
      source: "googleAiFeatures",
    },
    {
      q: "Do we need an llms.txt file or special markup?",
      a: "Not for Google. Its guidance says you don't need new machine-readable files, AI text files or special markup to appear in its AI features. Some sites add an llms.txt anyway because it's cheap, and we won't present it as a result.",
      source: "googleAiFeatures",
    },
    {
      q: "How will we know it's working?",
      a: "Each month you'll get three numbers and a note: how often Google and Bing showed your pages in their AI answers, how many visits came from AI assistants, and what our check of the main engines found when we asked your buyers' questions.",
      link: { label: "Where each number comes from", target: { kind: "anchor", id: "reporting" } },
    },
  ] satisfies TalkItem[],
};

/* ------------------------------------------------------------------ */
/* Reporting without a citation tracker                                */
/* ------------------------------------------------------------------ */

export interface ReportSource {
  id: string;
  name: string;
  shows: string;
  since: string;
  misses: string;
  source?: SourceId;
  link?: { label: string; target: Target };
}

export const REPORTING = {
  kicker: "In the report",
  intro:
    "Rankbox doesn't track citations, mentions or rankings in AI engines yet. The monthly report is built from dashboards your client already has, plus a check your team runs by hand. Here's what each one can tell a client, and where it goes quiet.",
  showsLabel: "Shows",
  missesLabel: "Leaves out",
  sources: [
    {
      id: "search-console",
      name: "Google Search Console",
      shows:
        "Its generative AI view counts how often the client's pages appeared in AI Overviews and AI Mode, by page, country and date.",
      since: "Introduced 3 June 2026, and open to every site since 31 August 2026.",
      misses:
        "It counts impressions. It doesn't show which passage was used or who else was named.",
      source: "searchConsole",
    },
    {
      id: "bing",
      name: "Bing Webmaster Tools",
      shows:
        "The AI Performance report counts citations across Copilot and Bing's AI summaries, with the cited pages and a sample of the queries behind them.",
      since: "In public preview since 10 February 2026.",
      misses: "Microsoft's own surfaces and select partners only.",
      source: "bing",
    },
    {
      id: "ga4",
      name: "Google Analytics 4",
      shows:
        "The AI Assistant channel groups visits from assistants such as ChatGPT, Gemini, Claude, Copilot, DeepSeek and Grok.",
      since: "Added to the default channel group on 13 May 2026.",
      misses:
        "Clicks from AI Overviews and AI Mode stay in Organic Search, and Google's channel doesn't name Perplexity.",
      source: "ga4Channel",
    },
    {
      id: "hand",
      name: "Your prompt check",
      shows:
        "The same buyer questions asked in each engine more than once a month, each answer logged as named, linked or missing.",
      since: `The only view of ChatGPT, Claude and Perplexity answers: as of ${CHECKED}, none of the three offers site owners a citation report.`,
      misses: "It's a sample, and it costs your team time each month.",
      link: {
        label: "AI Visibility Prompt Kit",
        target: { kind: "tool", slug: "ai-visibility-prompt-generator" },
      },
    },
  ] satisfies ReportSource[],
  more: {
    lead: "Panel sizes, run counts and a control test are covered in",
    label: "our guide to measuring GEO",
    target: { kind: "blog", slug: "how-to-measure-geo" } as Target,
  },
};

/* The prompt-check planner: arithmetic on the visitor's own numbers. */

export type PlannerEngine = "chatgpt" | "perplexity" | "gemini" | "claude" | "copilot" | "ai-mode";

export const PLANNER = {
  title: "Plan the monthly prompt check",
  intro:
    "One run per question isn't enough when answers shift between runs. Put in your own numbers to see how many answers your team will read each month.",
  fields: {
    sites: { label: "Client sites", min: 1, max: 500, initial: 5 },
    prompts: { label: "Buyer questions per client", min: 1, max: 200, initial: 20 },
    runs: { label: "Runs per question", min: 1, max: 10, initial: 2 },
    minutes: {
      label: "Minutes to log one answer",
      hint: "Your estimate",
      min: 1,
      max: 30,
      initial: 1,
    },
  },
  enginesLabel: "Engines to check",
  engines: [
    { id: "chatgpt", label: "ChatGPT" },
    { id: "perplexity", label: "Perplexity" },
    { id: "gemini", label: "Gemini" },
    { id: "claude", label: "Claude" },
    { id: "copilot", label: "Copilot" },
    { id: "ai-mode", label: "Google AI Mode" },
  ] satisfies { id: PlannerEngine; label: string }[],
  initialEngines: ["chatgpt", "perplexity", "gemini"] satisfies PlannerEngine[],
  perClient: "answers per client, each month",
  formula: (prompts: number, engines: number, runs: number) =>
    `${prompts} questions × ${engines} ${engines === 1 ? "engine" : "engines"} × ${runs} ${runs === 1 ? "run" : "runs"}`,
  total: (n: string) => `${n} answers across all clients`,
  hours: (h: string) => `About ${h} hours of checking a month, at your estimate`,
  invalid: (min: number, max: number) => `Use a whole number from ${min} to ${max}.`,
  noEngines: "Pick at least one engine.",
  footnote:
    "Rankbox doesn't run these prompts. The free AI Visibility Prompt Kit writes the questions and keeps the scorecard while you work.",
};

/* ------------------------------------------------------------------ */
/* Engine notes                                                        */
/* ------------------------------------------------------------------ */

export interface EngineNote {
  slug: EngineSlug;
  /** The robots.txt tokens a client's site has to leave open for this engine's answers. */
  allow: string[];
  /** What the vendor shows a site owner. */
  report: string;
  sources: SourceId[];
}

export const ENGINE_NOTES = {
  intro:
    "Each engine reads the web through its own crawler and tells site owners a different amount. For every client, this is what to let in and what you can read, with the full guide a click away.",
  columns: {
    engine: "Engine",
    allow: "Let in",
    report: "What the site owner can see",
    guide: "Guide",
  },
  guide: "Read the guide",
  rows: [
    {
      slug: "chatgpt",
      allow: ["OAI-SearchBot"],
      report: "No citation report. Visits arrive in GA4's AI Assistant channel.",
      sources: ["openai", "ga4Channel"],
    },
    {
      slug: "google-ai-overviews",
      allow: ["Googlebot"],
      report:
        "Impressions in Search Console's generative AI view. Clicks count as Organic Search in GA4.",
      sources: ["googleAiFeatures", "searchConsole", "ga4Channel"],
    },
    {
      slug: "gemini",
      allow: ["Googlebot", "Google-Extended"],
      report:
        "No citation report. Blocking Google-Extended also ends grounding in the Gemini app. Visits arrive in GA4's AI Assistant channel.",
      sources: ["googleCrawlers", "ga4Channel"],
    },
    {
      slug: "claude",
      allow: ["Claude-SearchBot"],
      report:
        "No citation report. Google's release note names Claude among the assistants its AI channel picks up.",
      sources: ["anthropic", "ga4Release"],
    },
    {
      slug: "perplexity",
      allow: ["PerplexityBot"],
      report:
        "No citation report. Google's channel doesn't name Perplexity, so look in Referral too.",
      sources: ["perplexity", "ga4Channel"],
    },
    {
      slug: "copilot",
      allow: ["Bingbot"],
      report:
        "Citations, cited pages and sample queries in Bing Webmaster Tools' AI Performance report.",
      sources: ["copilotIndex", "bing"],
    },
  ] satisfies EngineNote[],
  moreLabel: "Guides for the other engines",
  footnote: `Crawler names and reports from each vendor's own documentation, read on ${CHECKED}.`,
};

/** Engines with a guide but no row above, in ENGINES order. */
export const OTHER_ENGINES = ENGINES.filter(
  (e) => !ENGINE_NOTES.rows.some((r) => r.slug === e.slug),
);

/* ------------------------------------------------------------------ */
/* More for agencies                                                   */
/* ------------------------------------------------------------------ */

export const MORE = {
  intro: "The rest of the white label kit, and where the AI search work goes deeper.",
  items: [
    {
      label: "The white label program",
      blurb: "How Studio runs a site per client, and what your clients and their readers see.",
      target: { kind: "page", to: "/white-label" },
    },
    {
      label: "White label content writing",
      blurb: "How each client's articles are researched, drafted, scored and reviewed.",
      target: { kind: "page", to: "/white-label/content-writing" },
    },
    {
      label: "White label pricing",
      blurb: "The cost of each client site, and how to build a retainer around it.",
      target: { kind: "page", to: "/white-label/pricing" },
    },
    {
      label: "AI SEO guides by engine",
      blurb: `${ENGINES.length} engines, each with its crawler, its sources and its quirks.`,
      target: { kind: "page", to: "/ai-seo" },
    },
    {
      label: "Autonomous GEO",
      blurb: "The same engine, pointed at a single site you own.",
      target: { kind: "page", to: "/solutions/autonomous-geo" },
    },
    {
      label: "Answer-space research",
      blurb: "Where each client's question map comes from.",
      target: { kind: "feature", slug: "answer-space-research" },
    },
  ] satisfies { label: string; blurb: string; target: Target }[],
};

/* ------------------------------------------------------------------ */
/* FAQ section and the close                                           */
/* ------------------------------------------------------------------ */

export const FAQ_SECTION = {
  intro: "Including the ones about what Rankbox can't measure for you.",
};

export const CLOSING = {
  body: `Set up your agency's own site first. Once the plan is paid, each client site is ${SITE_PRICE} a month on the same invoice, with its own question map, articles and publishing key.`,
  terms: TRIAL_TERMS,
  cta: HERO.cta,
  pending: HERO.pending,
  links: [
    { label: "The per-client maths", target: { kind: "page", to: "/white-label/pricing" } },
    { label: "Plan details", target: { kind: "page", to: "/pricing" } },
  ] satisfies { label: string; target: Target }[],
};

/** SoftwareApplication.featureList: shipped features only. */
export const FEATURE_LIST = [
  "Runs a separate site for each client under one account, billed per site (Studio)",
  "Researches the questions a site's buyers ask AI, with estimated demand",
  "Writes long-form answer articles with cited sources, in each site's brand voice",
  "Scores every article for SEO and GEO",
  "Delivers finished articles through the Rankbox publishing API",
];
