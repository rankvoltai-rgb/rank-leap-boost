/**
 * /solutions/autonomous-geo — every word on the page.
 *
 * Prices, the trial and how articles reach a site come from facts.ts, so a
 * plan or shipping change updates this page with no edit here. Vendor lines
 * are quoted from each vendor's own page and carry the date they were read.
 * The sample month belongs to a fictional company (Tallyfold) on an .example
 * domain and is labelled as a sample wherever it renders.
 */
import {
  PLAN,
  PRICE_MONTHLY,
  PUBLISHING_TODAY,
  TRIAL,
  TRIAL_ARTICLE_CREDITS,
  TRIAL_TERMS,
} from "@/sublanding/_shared/facts";

export const PATH = "/solutions/autonomous-geo";

/** The breadcrumb's last crumb and the registry name. */
export const NAME = "Autonomous GEO";

/** When the vendor and platform facts below were last read on their own pages. */
export const CHECKED_ON = "2026-10-02";
const CHECKED = "2 October 2026";

/** One row per day of the sample month, one answer per row. */
const DAYS = PLAN.articlesPerMonth;

/** An internal link from the copy. PageLink renders it; the page test resolves it. */
export type Target =
  | { kind: "tool"; slug: string }
  | { kind: "blog"; slug: string }
  | { kind: "integration"; slug: string }
  | { kind: "feature"; slug: string }
  | { kind: "solution"; to: "/solutions/aeo-tools" | "/solutions/ai-search-visibility" };

/* ------------------------------------------------------------------ */
/* Contract: META, FAQS, OUTLINE                                       */
/* ------------------------------------------------------------------ */

export const META = {
  query: "ai search optimization tools",
  title: "AI Search Optimization Tool That Does the Work | Rankbox",
  description:
    "Most AI search optimization tools end in a to-do list. Rankbox ends with the pages written: buyer questions found, answered with sources, delivered up to one a day.",
  h1: "The AI search optimization tool that does the homework",
  keywords: [
    "ai search optimization tools",
    "ai search optimization tool",
    "llm seo tool",
    "ai visibility tracker",
    "ai rank tracking",
    "autonomous geo",
  ],
};

export const OUTLINE = [
  { id: "where-tools-stop", h2: "Where each kind of tool stops" },
  { id: "finished-answer", h2: "What a finished answer looks like" },
  { id: "still-yours", h2: "The homework that's still yours" },
  { id: "hand-over", h2: "Hand over the homework" },
  { id: "faq", h2: "Questions about AI search optimization tools" },
] as const;

export type SectionId = (typeof OUTLINE)[number]["id"];

/** The H2 for a section, as OUTLINE spells it. */
export function h2(id: SectionId): string {
  return OUTLINE.find((s) => s.id === id)!.h2;
}

export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is an AI search optimization tool?",
    a: "Software that helps your pages get used in the answers ChatGPT, Perplexity, Gemini, Claude and Google's AI Overviews give. Some measure how often an engine names you, some audit your site or grade a draft, and a few do the content work itself. Rankbox is one of the few: it picks the questions, writes the answers and delivers them to your site.",
  },
  {
    q: "What is an LLM SEO tool?",
    a: "Another name for the same category, used by people who think of ChatGPT, Claude and Gemini as large language models first. The aim is the same: get your pages read, quoted and recommended when those models search the web for an answer. Rankbox works on that by writing answer pages. It can't change what a model learned in training.",
  },
  {
    q: "Can Rankbox track my AI visibility or AI rankings?",
    a: "Not yet. Rankbox doesn't run prompts through AI engines or report where you're named. For that number, use a tracker such as Semrush's AI Visibility Toolkit, Ahrefs Brand Radar or Surfer's AI Tracker, or start with the free AI Visibility Prompt Kit on this site. Rankbox is for what comes after the report: writing the pages it asks for.",
  },
  {
    q: "What does autonomous GEO mean?",
    a: "Generative engine optimization where software runs the whole loop: it chooses the questions, writes and checks the answers, and delivers them on a schedule. You set it up once, read whatever you want to, and pause it whenever you like. Rankbox runs that loop for one site per plan.",
  },
  {
    q: "Does Rankbox publish straight to my CMS?",
    a: `${PUBLISHING_TODAY}. Once that's connected, each article is available to your site as soon as Rankbox finishes it.`,
  },
  {
    q: "Will Rankbox replace my SEO suite?",
    a: "Probably not, and it isn't trying to. Suites hold keyword databases, backlink indexes and rank tracking, which Rankbox doesn't have; its demand figures for each topic are AI estimates. Keep the suite for research and reporting, and let Rankbox write the pages the research points to.",
  },
  {
    q: "What does Rankbox cost, and what's in the trial?",
    a: `One site costs ${PRICE_MONTHLY} and gets ${PLAN.articlesPerMonth} articles a month. ${TRIAL_TERMS} The trial covers up to ${TRIAL_ARTICLE_CREDITS} articles.`,
  },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO = {
  crumbs: { home: "Home", section: "Solutions" },
  /** Where the H1 breaks onto its second line on wide screens. */
  h1Break: " that ",
  sub: "Most tools in this category end with a to-do list. Rankbox ends with the page written: it works out which questions your buyers put to AI that your site doesn't answer yet, then writes and delivers a cited answer to each, up to one a day.",
  note: `Signup and your first content plan are free. Add a card when you start the ${TRIAL}.`,
};

/** The URL form, used in the hero and again at the close. */
export const START = {
  label: "Your website",
  placeholder: "yoursite.com",
  cta: "Plan my first month",
  ctaShort: "Plan my month",
  pending: "Opening…",
};

/* ------------------------------------------------------------------ */
/* The month switch (the focal visual)                                 */
/* ------------------------------------------------------------------ */

export type Mode = "homework" | "done";

/** Where a to-do item came from, as an audit export or a tracker would label it. */
export type TaskSource = "gap" | "named" | "cited";

export interface MonthRow {
  day: number;
  source: TaskSource;
  /** The item as a to-do list hands it over. */
  task: string;
  /** The article Rankbox delivered for it. */
  title: string;
}

export const MONTH = {
  site: "tallyfold.example",
  initial: "T",
  period: "October · sample month",
  month: "Oct",
  switchLabel: "Show the month as",
  modes: { homework: "Homework", done: "Done" } satisfies Record<Mode, string>,
  count: {
    homework: { label: "items on your list", sub: "the way an audit or a tracker hands them over" },
    done: { label: "answers, written and delivered", sub: "one a day, by Rankbox" },
  } satisfies Record<Mode, { label: string; sub: string }>,
  owner: { homework: "Assigned to you", done: "Delivered" } satisfies Record<Mode, string>,
  sources: {
    gap: "Content gap",
    named: "Not named",
    cited: "Competitor cited",
  } satisfies Record<TaskSource, string>,
  more: (hidden: number) => `Show the other ${hidden} days`,
  less: "Show the first week",
  sample: "Sample data",
  caption: `The same ${DAYS} days for a sample invoicing app. Flip between the month as a to-do list, the way audits and trackers hand it over, and the same month as answers Rankbox has written and delivered.`,
};

/** Rows shown before "show the other days". */
export const FIRST_WEEK = 7;

const row = (day: number, source: TaskSource, task: string, title: string): MonthRow => ({
  day,
  source,
  task,
  title,
});

export const MONTH_ROWS: MonthRow[] = [
  row(
    1,
    "gap",
    "Write a page for “how do I chase a late invoice?”",
    "How to Chase a Late Invoice Without Losing the Client",
  ),
  row(
    2,
    "named",
    "Write a comparison for “best invoicing app for freelancers”",
    "The Best Invoicing Apps for Freelancers, Compared",
  ),
  row(
    3,
    "gap",
    "Answer “net 30 or net 15: which gets paid sooner?”",
    "Net 30 vs Net 15: Which Terms Get You Paid Sooner?",
  ),
  row(
    4,
    "gap",
    "Explain “what a freelance invoice must include”",
    "What Every Freelance Invoice Must Include",
  ),
  row(
    5,
    "cited",
    "Write a guide to “invoicing a client abroad”",
    "How to Invoice a Client in Another Country",
  ),
  row(
    6,
    "gap",
    "Explain “deposit invoice vs final invoice”",
    "Deposit Invoices vs Final Invoices, Explained",
  ),
  row(
    7,
    "named",
    "Answer “can I add a late fee to an invoice?”",
    "Can You Charge a Late Fee? How to Word It",
  ),
  row(
    8,
    "gap",
    "Publish a template for “contractor invoice”",
    "A Contractor Invoice Template, Line by Line",
  ),
  row(
    9,
    "gap",
    "Answer “how should I number my invoices?”",
    "How to Number Invoices So Tax Time Stays Simple",
  ),
  row(
    10,
    "cited",
    "Explain “what is a pro forma invoice?”",
    "What Is a Pro Forma Invoice, and When to Send One",
  ),
  row(
    11,
    "gap",
    "Write a setup guide for “recurring invoices for retainers”",
    "Recurring Invoices for Retainer Clients",
  ),
  row(
    12,
    "gap",
    "Answer “how do I write payment terms?”",
    "How to Write Payment Terms Clients Read",
  ),
  row(13, "named", "Explain “invoice vs receipt”", "Invoice vs Receipt: What's the Difference?"),
  row(
    14,
    "gap",
    "Answer “how long before I chase a payment?”",
    "How Long to Wait Before Chasing a Payment",
  ),
  row(
    15,
    "gap",
    "Write a page for “invoicing hourly work”",
    "How to Invoice Hourly Work Without Disputes",
  ),
  row(
    16,
    "named",
    "Compare “ways freelancers get paid”",
    "Bank Transfer, Card or App: How Freelancers Get Paid",
  ),
  row(17, "cited", "Answer “what if a client won't pay?”", "What to Do When a Client Won't Pay"),
  row(18, "gap", "Explain “invoicing a partial payment”", "How to Invoice for a Partial Payment"),
  row(19, "gap", "Explain “credit note vs refund”", "Credit Notes vs Refunds: Which to Issue"),
  row(
    20,
    "gap",
    "Answer “can I bill expenses on an invoice?”",
    "How to Add Expenses to a Client Invoice",
  ),
  row(
    21,
    "cited",
    "Write a guide to “milestone billing”",
    "Milestone Billing for Freelance Projects",
  ),
  row(
    22,
    "named",
    "Publish templates for “invoice reminder emails”",
    "Three Invoice Reminder Emails, Friendly to Firm",
  ),
  row(
    23,
    "gap",
    "Answer “do I need an invoice for every payment?”",
    "Do You Need an Invoice for Every Payment?",
  ),
  row(
    24,
    "gap",
    "Answer “can I invoice before registering a business?”",
    "Invoicing Before You Register a Business",
  ),
  row(
    25,
    "named",
    "Compare “invoicing app vs spreadsheet”",
    "Invoicing App or Spreadsheet? When to Switch",
  ),
  row(26, "gap", "Explain “early payment discounts”", "How to Offer an Early Payment Discount"),
  row(
    27,
    "cited",
    "Answer “which currency should I invoice in?”",
    "Which Currency to Invoice Overseas Clients In",
  ),
  row(28, "gap", "Explain “how to void an invoice”", "How to Void an Invoice Cleanly"),
  row(29, "gap", "Answer “how do I bill a rush job?”", "How to Price and Bill a Rush Job"),
  row(
    30,
    "named",
    "Compare “invoicing software with time tracking”",
    "Invoicing Software With Time Tracking: What to Look For",
  ),
].slice(0, DAYS);

/* ------------------------------------------------------------------ */
/* Where each kind of tool stops                                       */
/* ------------------------------------------------------------------ */

export type StageId = "measure" | "find" | "write" | "check" | "deliver";

export interface Kind {
  id: string;
  name: string;
  note: string;
  /** The stages this kind's main job covers, in order. */
  covers: StageId[];
  /** Shown in an uncovered stage where it matters, e.g. Rankbox and measuring. */
  gaps?: Partial<Record<StageId, string>>;
}

export const STOPS = {
  intro:
    "AI search optimization tools help your pages get used in the answers from ChatGPT, Perplexity, Gemini, Claude and Google's AI Overviews. Each kind of tool has one main job, and most of those jobs end in advice. The pages the advice asks for are left to you.",
  google: {
    lead: "Google's guidance is plain about it:",
    quote: "There are no additional requirements to appear in AI Overviews or AI Mode",
    after:
      "The usual SEO practice applies, which brings it back to a good page for each question your buyers ask.",
    source: "Google Search Central",
    url: "https://developers.google.com/search/docs/appearance/ai-features",
  },
  stagesLabel: "Stages",
  kindLabel: "Kind of tool",
  stages: [
    { id: "measure", label: "See who AI names" },
    { id: "find", label: "Pick the questions" },
    { id: "write", label: "Write the answer" },
    { id: "check", label: "Check it" },
    { id: "deliver", label: "Get it on your site" },
  ] as { id: StageId; label: string }[],
  kinds: [
    {
      id: "trackers",
      name: "AI visibility trackers",
      note: "Report which prompts name you and who gets named instead, often with suggestions.",
      covers: ["measure"],
    },
    {
      id: "suites",
      name: "SEO suites",
      note: "Keyword data, site audits and content gaps. Several now add AI tracking.",
      covers: ["find"],
    },
    {
      id: "graders",
      name: "Content graders",
      note: "Score a draft you wrote against the pages that rank.",
      covers: ["check"],
    },
    {
      id: "rankbox",
      name: "Rankbox",
      note: "Runs from the question to the delivered article.",
      covers: ["find", "write", "check", "deliver"],
      gaps: { measure: "Not yet" },
    },
  ] as Kind[],
  /** Read by screen readers in place of the bars. */
  covered: (stages: string[]) => `Main job: ${stages.join(", ")}.`,
  footnote:
    "Each kind is drawn by its main job. Plenty of products reach into the next stage: suites add AI tracking, some graders draft for you.",
  guide: {
    lead: "Every type, with dated prices and a way to score them:",
    label: "our guide to AI search optimization tools",
    target: { kind: "blog", slug: "ai-search-optimization-tools" } as Target,
  },
};

export interface Tracker {
  name: string;
  quote: string;
  url: string;
}

export const TRACKER_NOTE = {
  h3: "Came here for an AI visibility tracker?",
  honest:
    "Rankbox doesn't track AI visibility or rankings yet. It doesn't run prompts through ChatGPT or Perplexity, and it can't tell you how often you're named. That number comes from a tracker.",
  vendorsLead: "Semrush, Ahrefs and Surfer each sell one. In their own words:",
  trackers: [
    {
      name: "Semrush AI Visibility Toolkit",
      quote: "shows you how brands appear in AI-generated answers",
      url: "https://www.semrush.com/kb/1493-ai-visibility-toolkit",
    },
    {
      name: "Ahrefs Brand Radar",
      quote: "Track and grow your brand's visibility across AI answers, YouTube, and Reddit.",
      url: "https://ahrefs.com/brand-radar",
    },
    {
      name: "Surfer AI Tracker",
      quote:
        "See exactly how Gemini, ChatGPT, Google AI Overviews, AI Mode, and Perplexity talk about your brand",
      url: "https://surferseo.com/ai-tracker/",
    },
  ] as Tracker[],
  checked: `Quoted from each product's own page on ${CHECKED}.`,
  when: "A tracker earns its place once you're publishing and want to watch the effect. To see where you stand today, for free, start here:",
  links: [
    {
      label: "AI Visibility Prompt Kit",
      target: { kind: "tool", slug: "ai-visibility-prompt-generator" },
    },
    { label: "How to measure GEO", target: { kind: "blog", slug: "how-to-measure-geo" } },
    {
      label: "What engines check before naming a brand",
      target: { kind: "solution", to: "/solutions/ai-search-visibility" },
    },
  ] as { label: string; target: Target }[],
};

/* ------------------------------------------------------------------ */
/* What a finished answer looks like                                   */
/* ------------------------------------------------------------------ */

export const FINISHED = {
  intro:
    "Every answer Rankbox writes has the same shape: the reader gets the answer at once, and an engine can quote it without rewriting it. Each one is researched from the pages that rank for the question today and written in the voice Rankbox reads from your site.",
  doc: {
    url: "tallyfold.example/blog/chase-a-late-invoice",
    sample: "Sample",
    label: "Sample article for a fictional invoicing app",
    title: MONTH_ROWS[0].title,
    answer:
      "Send a friendly reminder the day after the due date, a firmer note a week later, and pick up the phone at two weeks. Keep every message short, attach the invoice again, and give one clear way to pay.",
    takeawaysLabel: "Key takeaways",
    takeaways: [
      "Remind early: the day after it's due",
      "Each note gets firmer, never ruder",
      "Make paying the easiest next step",
    ],
    referencesLabel: "References",
    faqLabel: "FAQ",
    faq: ["What if the client ignores every reminder?", "Can I charge interest on a late invoice?"],
    status: "SEO checks run · delivered to tallyfold.example",
  },
  notes: [
    {
      title: "The answer comes first",
      body: "Two or three sentences answer the question outright, before any background.",
    },
    {
      title: "Takeaways that stand alone",
      body: "A short list under the answer, so the main points survive being quoted on their own.",
    },
    {
      title: "Sources, cited where they're used",
      body: "What the research found is cited inline and listed again at the end.",
    },
    {
      title: "The next questions, answered",
      body: "An FAQ of what buyers ask after the first question, a few lines each.",
    },
    {
      title: "Checked, then delivered",
      body: "Scored against SEO checks and redrafted where it falls short, then handed to your site.",
      link: {
        label: "How auto-publishing works",
        target: { kind: "feature", slug: "auto-publishing" } as Target,
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* The homework that's still yours                                     */
/* ------------------------------------------------------------------ */

export const YOURS = {
  intro:
    "Handing over the writing doesn't hand over everything. Three things stay on your list, and two of them you do once.",
  items: [
    {
      title: "Let the AI crawlers in",
      when: "Once",
      body: "Engines cite what their bots can read. OpenAI, for one, says sites that opt out of OAI-SearchBot will not be shown in ChatGPT search answers. A free check shows in under a minute whether your robots.txt blocks any of them.",
      source: { label: "Source: OpenAI", url: "https://developers.openai.com/api/docs/bots" },
      link: {
        label: "Run the AI Search Readiness Check",
        target: { kind: "tool", slug: "ai-search-readiness-check" } as Target,
      },
    },
    {
      title: "Connect your site",
      when: "Once",
      body: `${PUBLISHING_TODAY}.`,
      link: {
        label: "Read about the publishing API",
        target: { kind: "integration", slug: "api" } as Target,
      },
    },
    {
      title: "Read what you want to",
      when: "When you like",
      body: "Every answer sits in your Rankbox editor, where you can rewrite any section as often as you like. Autopilot writes on the cadence you set and pauses whenever you switch it off.",
    },
  ],
  diy: {
    lead: "Would rather run every job yourself?",
    label: "Free AEO tools, one for each job",
    target: { kind: "solution", to: "/solutions/aeo-tools" } as Target,
  },
};

/* ------------------------------------------------------------------ */
/* Hand over the homework                                              */
/* ------------------------------------------------------------------ */

export const HAND_OVER = {
  body: `${PRICE_MONTHLY} for one site buys ${PLAN.articlesPerMonth} answers a month, each one researched, written, checked and delivered on the cadence you set.`,
  terms: TRIAL_TERMS,
  pricing: "See everything in the plan",
};

/* ------------------------------------------------------------------ */
/* FAQ section                                                         */
/* ------------------------------------------------------------------ */

export const FAQ_SECTION = {
  aside: "Straight answers, including the ones about what Rankbox doesn't do.",
};

/** SoftwareApplication.featureList: shipped features only. */
export const FEATURE_LIST = [
  "Finds the questions buyers ask AI that a site doesn't answer yet",
  "Writes long-form answer articles from live research, with cited sources",
  "Checks each draft against SEO rules and redrafts where it fails",
  "Writes on a weekly cadence, up to one article a day",
  "Delivers finished articles through the Rankbox publishing API",
];
