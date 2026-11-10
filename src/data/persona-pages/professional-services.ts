/**
 * /use-cases/professional-services: the page's words and data. Written to
 * accounting and CPA firms, B2B law firms, consultancies and IT service
 * providers: firms that sell expertise, where every published page carries a
 * licence or a reputation, and a qualified person signs it off.
 *
 * Facts checked 2026-11-10. The research block quotes one source, Accounting
 * Today (Oct 7, 2026), which reports two studies of AI recommendations for
 * accounting firms; every figure below is as that article gives it.
 *
 * Besides `persona`, this file keeps the words for the page's own pieces that
 * the Persona type has no field for: the hero's sample AI answer, the research
 * exhibits, the scope exclusions and the fee schedule. All of it is sample or
 * sourced, never invented results.
 */
import { Briefcase } from "lucide-react";
import type { Persona } from "@/data/personas";
import { RANKBOX_PUBLISHING } from "@/data/competitors/shared";
import { PLAN, STUDIO, TRIAL_DAYS, TRIAL_NOTE, formatUsd } from "@/data/pricing";

/* The shared publishing line, kept in step with the platform flags. The page
   never says "one-click", so that word is dropped from it here. */
const PUBLISHING = RANKBOX_PUBLISHING.sentence.replace(/one-click /gi, "");

export const persona: Persona = {
  slug: "professional-services",
  name: "Professional services",
  nameLower: "professional services firms",
  shortName: "Services",
  role: "professional services firm",
  group: "business",
  icon: Briefcase,
  tagline: "Specific, sourced answers to client questions, signed off by your own people.",

  eyebrow: "AI search content for professional services firms",
  headline: { lead: "Answer the client", accent: "before they call" },
  subhead:
    "When a prospect asks ChatGPT or Google's AI Overviews which firm to use, the answer names a few firms and quotes their pages. Rankbox finds the questions your clients ask about your industry, service and region, writes sourced, in-depth articles in your firm's voice, and scores each one, so your reviewer starts from a finished draft.",
  metaTitle: "Rankbox for Professional Services Firms: AI Search Content",
  metaDescription:
    "Sourced, in-depth articles for accounting, law and consulting firms on the questions clients ask AI about their industry, service and region, ready for a licensed reviewer.",

  shortAnswer:
    "Rankbox is an AI search growth engine for professional services firms: accounting and CPA firms, B2B law firms, consultancies and IT service providers. It finds the questions clients ask ChatGPT, Perplexity, Gemini and Google's AI Overviews about a firm's industry, service and region, writes long-form, source-backed articles in the firm's voice, and scores each one for SEO and for readiness to be quoted in AI answers. It doesn't fact-check, track citations or manage directory listings, so a licensed professional at the firm reviews every article before it goes out.",

  specs: [
    { value: "2,000–3,500", label: "words in a typical sourced article" },
    { value: `${PLAN.articlesPerMonth}/mo`, label: "articles per site, on the schedule you set" },
    { value: "2 scores", label: "SEO and GEO, on every draft before review" },
    { value: "REST API", label: "your import decides when each article goes live" },
  ],

  handoff: {
    runsTitle: "Rankbox prepares",
    runs: [
      {
        label: "The question research",
        detail: "What clients ask AI engines about your industry, your service and your region.",
      },
      {
        label: "The first draft",
        detail: "Long-form and source-backed, in the voice and practice details you set.",
      },
      {
        label: "The pre-review score",
        detail: "SEO and GEO checks on every draft, so review can start on the substance.",
      },
      {
        label: "The delivery",
        detail: "Finished articles over the REST API, on the schedule you set.",
      },
    ],
    keepsTitle: "The firm keeps",
    keeps: [
      {
        label: "Professional sign-off",
        detail:
          "A licensed reviewer checks every claim, figure and citation. Rankbox doesn't fact-check.",
      },
      {
        label: "What the firm may say",
        detail:
          "Bar rules on lawyer advertising, the professional code for CPAs. That call is yours.",
      },
      {
        label: "Listings and reviews",
        detail: "Directory profiles, association pages and reviews. Rankbox doesn't manage them.",
      },
      {
        label: "Checking the answers",
        detail: "Rankbox doesn't track citations. Run the prompts yourself, with the free kit.",
      },
    ],
  },

  painsTitle: "Findings from the firm's own website",
  painsIntro:
    "Review your site the way you'd review a client's file, and these are the findings you'd expect to write up. Each comes with what changes.",
  pains: [
    {
      pain: "The site lists services. It doesn't answer the questions clients ask about them.",
      fix: "Each question a client asks about a service becomes its own sourced article, not a line on the services page.",
    },
    {
      pain: "Nobody who bills has time to write, and nobody who writes knows the work.",
      fix: "Research and the first draft arrive finished, so a partner's hour goes on review instead of a blank page.",
    },
    {
      pain: "The site speaks to everyone. AI answers lean on firms known for something specific.",
      fix: "Research is aimed at one industry, one service and one region at a time, the depth both studies linked to smaller firms being named.",
    },
    {
      pain: "The last article went up before the rules changed.",
      fix: "Edit a published article in Rankbox and publish the change. Your site's next sync picks it up with a new updated date.",
    },
  ],

  workflowTitle: "Prepared, reviewed, then published",
  workflowIntro:
    "Like any workpaper: one party prepares it, a qualified one reviews it, and only then does it leave the firm.",
  steps: [
    {
      when: "Week 1",
      title: "Describe the practice",
      body: "Paste your site, then set the voice: tone, the clients you serve, and the industries, services and region you're known for.",
    },
    {
      when: "Week 1",
      title: "Strike what you don't advise on",
      body: "Research returns the questions clients ask. Keep the ones the firm would stand behind, and put them on the schedule.",
    },
    {
      when: "Each article",
      title: "Prepared, then reviewed",
      body: "Finished articles reach your site through the API. Set the import to save drafts, and a licensed reviewer publishes each one.",
    },
    {
      when: "When rules move",
      title: "Update, don't pile up",
      body: "Edit the published article and publish the change. The API returns it again, so the page on your site carries the new date.",
    },
  ],

  stackTitle: "Logged the way your time is",
  stackIntro:
    "The usual ways a firm's articles get written, entered as a timesheet would enter them. None of it bills.",
  stack: [
    {
      label: "The partner's weekend",
      detail: "The firm's deepest expertise, spent on a first draft",
    },
    {
      label: "A marketing coordinator",
      detail: "Writing outside their field, then waiting weeks for review",
    },
    {
      label: "A content agency",
      detail: "Briefing generalists on your practice, every month",
    },
    {
      label: "A syndicated newsletter",
      detail: "The same article other firms publish under their own logo",
    },
    {
      label: "A general AI chat tool",
      detail: "Quick drafts with no research, sources or scoring",
    },
  ],
  stackNote: `One plan is ${PLAN.articlesPerMonth} articles a month for one site at ${formatUsd(PLAN.monthly)} a month. It prepares the drafts; it doesn't review them, so keep the people who sign things off.`,

  picksTitle: "The parts a firm leans on",
  picksIntro:
    "The whole engine runs either way. These four matter most when a licence stands behind every page.",
  picks: [
    {
      featureSlug: "answer-space-research",
      why: "Finds the questions clients put to AI about your industry, service and region, before anyone writes a word.",
    },
    {
      featureSlug: "citation-ready-writer",
      why: "Long-form drafts that carry their sources, so the reviewer checks citations instead of hunting for them.",
    },
    {
      featureSlug: "brand-voice",
      why: "Set once per site: the firm's tone, the clients it serves, the practice details only it would name.",
    },
    {
      featureSlug: "seo-geo-score",
      why: "A score on every draft before review, so a partner's time goes on substance rather than structure.",
    },
  ],

  topics: {
    title: "What it would research for a firm like yours",
    intro:
      "The questions that set a firm apart sit where one industry, one service and one region meet. Here is that map for an accounting firm that serves contractors.",
    brand: "Tallyfold CPAs",
    domain: "tallyfold.example",
    clusters: [
      {
        stage: "Choosing a firm",
        intent: "Shortlisting",
        questions: [
          "What should a contractor look for in a CPA firm?",
          "When does a contractor need audited financial statements?",
          "How far ahead should a contractor book a first audit?",
        ],
      },
      {
        stage: "Weighing options",
        intent: "Comparing",
        questions: [
          "Reviewed or audited statements: which will a surety accept?",
          "Cash or accrual: which suits a growing contractor?",
          "Outsourced controller or in-house bookkeeper?",
        ],
      },
      {
        stage: "Getting ready",
        intent: "How-to",
        questions: [
          "How do you build a work-in-progress schedule?",
          "What does a surety ask for at bond renewal?",
          "How should a contractor prepare for its first audit?",
        ],
      },
      {
        stage: "When rules move",
        intent: "Explaining",
        questions: [
          "How does percentage-of-completion revenue work?",
          "Which contractors can use the completed-contract method?",
          "What is the look-back rule on long-term contracts?",
        ],
      },
    ],
    note: "A sample map for Tallyfold CPAs, a fictional Ohio firm that serves construction contractors. Yours is built from your own site and practice, and you choose what gets written.",
    platformsTitle: "Where the articles go",
    platforms: [
      {
        slug: "api",
        why: "Works today. Your site pulls finished articles, and your import decides when each one publishes.",
      },
      {
        slug: "wordpress",
        why: "The WordPress plugin is in development. Until it ships, a WordPress site uses the API.",
      },
      {
        slug: "webflow",
        why: "The Webflow app is built and waiting for Marketplace approval. The API works now.",
      },
    ],
  },

  proof: [],
  proofTitle: "Firms running it",

  faqs: [
    {
      q: "Can a lawyer or CPA publish what Rankbox writes as it is?",
      a: "No. Rankbox researches and drafts from sources, but it doesn't fact-check, and it doesn't know your jurisdiction, your engagement terms or your clients' facts. Have a licensed professional review every article before it goes out. Lawyers should read it against their bar's rules on advertising; CPAs against their own professional code.",
    },
    {
      q: "Is there an approval step inside Rankbox?",
      a: "Not one of its own. A finished article is marked Published in Rankbox, and only finished articles are returned by the API. Make review your step: have your import save each one as a draft in your CMS, and your reviewer publishes it. There are no separate reviewer seats yet; an account has one login.",
    },
    {
      q: "Will this get our firm named in ChatGPT or Google's AI Overviews?",
      a: "Nobody can promise that, and Rankbox can't show you whether it happens, because it doesn't track citations. What it does is write the specific, in-depth pages that both studies reported by Accounting Today on October 7, 2026 linked to smaller firms being named. To check, run your clients' questions in the AI tools yourself; the free AI Visibility Prompt Kit gives you thirty to start with.",
    },
    {
      q: "Does it manage our directory profiles and reviews?",
      a: "No. Directory profiles, association listings and review sites stay with you. They matter: one of those studies found AI answers citing directories, associations and public records alongside firms' own sites. Rankbox writes and delivers the articles on your website, and nothing else.",
    },
    {
      q: "What kinds of firms is this for?",
      a: "Firms that sell expertise to other businesses: accounting and CPA firms, B2B law firms, management and IT consultancies, and managed IT service providers. The more specific the practice, by industry, service or region, the more specific the questions Rankbox can research for it.",
    },
    {
      q: "How do articles reach our website?",
      a: `${PUBLISHING}. Only finished articles are returned, and your import decides whether each one arrives as a draft or goes live, so a reviewer can hold anything back.`,
    },
    {
      q: "Can we run the research from Claude or ChatGPT?",
      a: "Yes. Add Rankbox's MCP server, at rankbox.xyz/mcp, to Claude, ChatGPT, Cursor or another AI tool that takes one, and ask from inside the chat for the questions people put to AI about a topic, an article brief, or meta descriptions. Writing the full articles, scoring them and delivering them happen in Rankbox itself.",
    },
    {
      q: "We run a separate site for each office or practice. How is that billed?",
      a: `Each site has a plan of its own. Once your plan is paid, ${STUDIO.name} adds each extra site for ${formatUsd(STUDIO.monthlyPerSite)} a month on the same invoice, with its own research, voice and ${PLAN.articlesPerMonth} articles a month. The ${TRIAL_DAYS}-day trial covers one site.`,
    },
  ],
  ctaTitle: "Put the practice in writing",
  ctaBody: "Paste your firm's website and see the questions clients ask about the work you do.",

  hideFromNav: true,
};

/* ------------------------------------------------------------------ */
/* The hero's sample: one client question, the AI answer it gets, and   */
/* the sample firm's site against the same question. Every firm here is */
/* fictional, on a reserved .example domain.                            */
/* ------------------------------------------------------------------ */

/** The four things the two studies tied to firms being named. */
export type SignalId = "industry" | "service" | "region" | "updated";

export const SIGNALS: { id: SignalId; label: string }[] = [
  { id: "industry", label: "Industry" },
  { id: "service", label: "Service" },
  { id: "region", label: "Region" },
  { id: "updated", label: "Updated" },
];

export const SHORTLIST = {
  question: "Which CPA firm should an Ohio contractor use for its first audit?",
  lead: "Three firms come up for contractor audits in Ohio:",
  tail: "Before you choose, ask each one how many contractor audits it ran last year, and who would lead yours.",
  firms: [
    {
      name: "Kestrelyn LLP",
      short: "Kestrelyn",
      why: "a national firm with a construction practice",
      url: "kestrelyn.example/industries/construction",
      signals: ["industry"] as SignalId[],
    },
    {
      name: "Brindlework CPAs",
      short: "Brindlework",
      why: "a Columbus firm with a guide to the audits sureties ask for",
      url: "brindlework.example/guides/surety-audits",
      signals: ["industry", "service", "region"] as SignalId[],
    },
    {
      name: "Plotbright Advisors",
      short: "Plotbright",
      why: "explains percentage-of-completion revenue, updated last month",
      url: "plotbright.example/insights/poc-revenue",
      signals: ["industry", "service", "updated"] as SignalId[],
    },
  ],
  signalsTitle: "What each cited page shows",
  signalsNote: "The signals both studies tied to firms being named",
  yoursTitle: "Same question, your site",
  yoursEmpty: "No page answers it yet",
  /** One of the sample map's own questions, so the hero and the map agree. */
  draft: "How should a contractor prepare for its first audit?",
  progress: [
    "Found in research",
    "Sourced draft prepared",
    "Scored · SEO 94 · GEO 91",
    "With your reviewer",
  ],
  description:
    "Sample: a client asks an AI assistant which CPA firm an Ohio contractor should use for a first audit. The answer names three fictional firms and cites one page from each; a table shows which of those pages name an industry, a service, a region, or a recent update. Below, the fictional Tallyfold CPAs has no page for the question yet, and Rankbox finds it, prepares a sourced draft, scores it, and hands it to the firm's reviewer.",
};

/** Under the H1: the firms the page is written to. */
export const WRITTEN_FOR = {
  label: "Written for",
  firms: ["Accounting and CPA firms", "B2B law firms", "Consultancies", "IT service providers"],
};

/** The sample firm's practice, as the map's header shows it. */
export const PRACTICE = [
  { signal: "industry" as SignalId, value: "Construction contractors" },
  { signal: "service" as SignalId, value: "Audit and tax" },
  { signal: "region" as SignalId, value: "Ohio" },
];

/* ------------------------------------------------------------------ */
/* The research, as reported. Figures are the article's own.            */
/* ------------------------------------------------------------------ */

export const EVIDENCE = {
  eyebrow: "The research",
  title: "Two studies of AI answers,",
  accent: "one pattern",
  intro:
    "On October 7, 2026, Accounting Today reported two studies of which accounting firms AI assistants recommend. Size counted. So did being specific.",
  exhibits: [
    {
      tag: "Exhibit A",
      by: "Expert Press",
      figure: "87.2%",
      figureLabel: "of AI search results were concentrated in 25 firms from the Top 100",
      method:
        "100 buyer questions on tax, audit, advisory and risk management, put to seven AI engines five times each: 3,480 responses.",
      finding:
        "Smaller firms that out-performed their size had an established association with a particular industry, service, locale or type of problem.",
    },
    {
      tag: "Exhibit B",
      by: "AIWorthy",
      figure: "184 vs 24",
      figureLabel: "recommendations for the panel's six least busy firms, against its four busiest",
      method:
        "Ten Research Triangle firms that perform single audits. Ten buyer questions, five AI models, five runs each, in August and September 2026.",
      finding:
        "Often-cited firm sites named their region, described the buyer's kind of work at length, and had been updated recently.",
    },
  ],
  caveat:
    "Neither study says a website is enough. In the second, the firm named second most often had no website at all, and directories, associations and public records were cited too. Rankbox writes the pages on your site; the rest of the firm's footprint stays with the firm.",
  source: {
    publisher: "Accounting Today",
    title: "AI recommendations favoring narrow band of big firms",
    date: "October 7, 2026",
    url: "https://www.accountingtoday.com/news/ai-recommendations-favoring-narrow-band-of-big-firms",
  },
};

/* ------------------------------------------------------------------ */
/* What the engagement leaves out, said plainly under the scope.        */
/* ------------------------------------------------------------------ */

export const SCOPE = {
  eyebrow: "Scope of services",
  lead: "What Rankbox prepares, and what",
  accent: "stays with the firm",
  excludedTitle: "Not in scope",
};

export const NOT_IN_SCOPE = [
  "Fact-checking or legal and tax review",
  "Tracking whether AI answers cite you",
  "Directory, listing or review management",
  "Separate logins for reviewers",
  "Rank tracking, technical audits or outreach",
  "Any guaranteed result",
];

export const FAQ_TITLE = { lead: "Questions partners", accent: "ask first" };

export const CHECK_IT_YOURSELF = {
  title: "Check the answers yourself",
  body: "Ask the AI tools your clients' questions once a month and note who they name. The free prompt kit writes thirty such questions for your practice.",
  tool: "AI Visibility Prompt Kit",
  guide: "How to measure GEO",
};

/* ------------------------------------------------------------------ */
/* The fee schedule. Our own prices only, read from pricing.ts.         */
/* ------------------------------------------------------------------ */

export const FEES = {
  eyebrow: "Fees",
  title: "One fee per site,",
  accent: "billed monthly",
  intro: "No retainer, no setup fee and no per-article charge.",
  rows: [
    {
      item: "Rankbox plan",
      detail: `One site: research, up to ${PLAN.articlesPerMonth} sourced articles a month, SEO and GEO scoring, and delivery through the API.`,
      fee: formatUsd(PLAN.monthly),
      per: "a month",
    },
    {
      item: `Each extra site, with ${STUDIO.name}`,
      detail: `For a second office or practice site: the full plan of its own, on the same invoice. Added once the first plan is paid.`,
      fee: formatUsd(STUDIO.monthlyPerSite),
      per: "a month",
    },
    {
      item: "Plan allowances, rolling out",
      detail:
        "A backlink-exchange allowance and Reddit reply drafts, which Rankbox drafts with disclosure and you post yourself.",
      fee: "Included",
      per: "on paid plans",
    },
  ],
  trial: TRIAL_NOTE,
};
