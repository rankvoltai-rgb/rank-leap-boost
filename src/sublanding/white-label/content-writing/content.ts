/**
 * /white-label/content-writing — every word on the page.
 *
 * Prices, the trial and the plan's allowances come from facts.ts; the pace
 * options from data/auto-publishing (the dashboard's own list); which
 * publishing apps are still waiting on a marketplace from data/platforms. The
 * product facts were read in src/content/docs on the date below. The sample
 * clients (Sablewood Dental, Driftmoor Coffee, Mossbark BBQ) are fictional,
 * on .example domains, and labelled as samples wherever they render.
 *
 * This page's lane: the article production line for client sites. The
 * program overview, AI search as a service, and pricing maths live on the
 * hub, /white-label/ai-seo and /white-label/pricing.
 */
import {
  PLAN,
  STUDIO,
  TRIAL,
  TRIAL_ARTICLE_CREDITS,
  TRIAL_TERMS,
  formatUsd,
} from "@/sublanding/_shared/facts";
import { PACE_OPTIONS, paceOptionLabel } from "@/data/auto-publishing";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { listNames } from "@/data/competitors/shared";

export const PATH = "/white-label/content-writing";

/** The breadcrumb's last crumb and the registry name. */
export const NAME = "Content writing";

/** When the product facts and the outside sources were last read. */
export const CHECKED_ON = "2026-10-29";

/* ------------------------------------------------------------------ */
/* Links                                                               */
/* ------------------------------------------------------------------ */

/** An internal link from the copy. PageLink renders it; the page test resolves it. */
export type Target =
  | { kind: "feature"; slug: "citation-ready-writer" | "brand-voice" | "seo-geo-score" }
  | { kind: "tool"; slug: string }
  | { kind: "doc"; section: string; page: string }
  | { kind: "static"; to: "/pricing" | "/white-label" }
  /** Sibling white-label pages, built alongside this one. */
  | { kind: "sibling"; href: "/white-label/ai-seo" | "/white-label/pricing" };

export interface LinkItem {
  label: string;
  target: Target;
}

/* ------------------------------------------------------------------ */
/* Facts this page derives                                             */
/* ------------------------------------------------------------------ */

/** The Webflow and Shopify apps, while they still wait on their marketplaces. */
const APPS_PENDING = PUBLISH_PLATFORMS.filter(
  (p) => (p.id === "webflow" || p.id === "shopify") && !p.addonLive,
).map((p) => p.name);

/** "Every day, 5 a week, 3 a week, 2 a week or 1 a week", from the dashboard's list. */
const PACE_LIST = (() => {
  const labels = PACE_OPTIONS.map((p) => paceOptionLabel(p));
  return `${labels.slice(0, -1).join(", ")} or ${labels.at(-1)}`;
})();

const ARTICLES = PLAN.articlesPerMonth;
const SITE_PRICE = formatUsd(STUDIO.monthlyPerSite);

/* ------------------------------------------------------------------ */
/* Contract: META, FAQS, OUTLINE                                       */
/* ------------------------------------------------------------------ */

export const META = {
  query: "white label content writing",
  title: "White Label Content Writing for Agency Clients | Rankbox",
  description:
    "Researched, scored articles for every client site, each in that client's voice. Your editor reviews them and they go live under the client's name. No writer pool.",
  h1: "White label content writing without a writer pool",
  keywords: [
    "white label content writing",
    "white label blog writing",
    "white label article writing",
    "white label seo content",
    "white label content for agencies",
    "ai content writing for agencies",
  ],
};

export const OUTLINE = [
  { id: "stations", h2: "Six stations from a client's homepage to a live article" },
  { id: "voice", h2: "A separate writer's brief for every client" },
  { id: "anatomy", h2: "The spec each client article is written to" },
  { id: "checks", h2: "What the checks catch and what your editor reads for" },
  { id: "sign-off", h2: "Two points where a client can say yes" },
  { id: "pace", h2: "Articles per client and the editing hours behind them" },
  { id: "scope", h2: "What the line writes and what stays with your team" },
  { id: "faq", h2: "Content writing questions from agencies" },
  { id: "next", h2: "Start the line on your own site first" },
] as const;

export type SectionId = (typeof OUTLINE)[number]["id"];

/** The H2 for a section, as OUTLINE spells it. */
export function h2(id: SectionId): string {
  return OUTLINE.find((s) => s.id === id)!.h2;
}

/** The small index beside each section on wide screens. */
export const INDEX: Record<SectionId, { n: string; label: string }> = {
  stations: { n: "01", label: "Stations" },
  voice: { n: "02", label: "Voice" },
  anatomy: { n: "03", label: "Spec" },
  checks: { n: "04", label: "Checks" },
  "sign-off": { n: "05", label: "Sign-off" },
  pace: { n: "06", label: "Volume" },
  scope: { n: "07", label: "Scope" },
  faq: { n: "08", label: "Questions" },
  next: { n: "09", label: "Start" },
};

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Who writes the articles if there's no writer pool?",
    a: "A large language model, run from Rankbox's servers, working from live research on each article's keyword and from the client's own brief. No freelancers or staff writers are involved. Your editor is the person on the line: they read and correct each article before the client's readers see it.",
  },
  {
    q: "How long is each white label article?",
    a: "Typically 2,000 to 3,500 words. The writer aims for 2,750 on every article and the target can't be changed; real length moves with the topic and the revision pass. The score's depth check passes at 1,500 words.",
  },
  {
    q: "Can a client approve articles before they go live?",
    a: "Yes, outside Rankbox. There's no approve step inside it, and clients don't get a login. Have the client's integration save finished articles as drafts in their CMS, where the client reviews them, or agree the topics with the client before anything is written.",
  },
  {
    q: "Can I publish an article my own team wrote to a client site?",
    a: "Yes. Open a planned topic, click Start writing, paste or type the article and publish it. It's scored on the same 11 checks, reaches the client's site the same way, and spends no article credit.",
  },
  {
    q: "Does Rankbox fact-check what it writes?",
    a: "No. The writer cites the pages its research read and is told to use real sources, but nothing checks the facts afterwards. Your editor should confirm claims, numbers and quotes, and open each reference, before the article goes live.",
  },
  {
    q: "Does Google allow AI-written articles on a client's site?",
    a: "Google's guidance says appropriate use of AI or automation isn't against its guidelines. Its spam policies target pages generated in bulk to manipulate rankings without adding value, however they were made. Rankbox makes no ranking promises, so an editor's pass on every article is the sound way to run client content.",
  },
  {
    q: "Whose name goes on a white label article?",
    a: "The client's. Rankbox sends no author with the article, so the client's own blog template sets the byline. Google suggests accurate bylines where readers expect one, and advises against naming AI as the author. Whether to mention AI help is for you and the client to agree.",
  },
  {
    q: "How many articles can one client site get a month?",
    a: `Up to ${ARTICLES}, at a pace you set for that site: ${PACE_LIST}. Each site's credits are its own and reset with the billing period, and unused ones don't carry over.`,
  },
  {
    q: "Does the line add images and internal links?",
    a: "Not images. The writer marks where two or three would help, and those notes are removed before the article leaves Rankbox, so the client's own images go in through their CMS. Internal links arrive as suggestions that turn into plain anchor text on the way out, for your editor to link.",
  },
];

/** What Rankbox does, for SoftwareApplication.featureList. Shipped features only. */
export const FEATURE_LIST = [
  "Per-site research of the searches and questions buyers ask",
  `A content plan of up to ${ARTICLES} topics for each site`,
  "Long-form articles drafted from live web research in each site's brand voice",
  "One SEO and GEO score from 11 checks on every article, with a revision pass",
  "An article editor with AI rewrites in the site's voice",
  "Delivery through a REST API, with keys that belong to one site",
  "Studio: several sites on one account and one invoice",
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const HERO = {
  crumbs: { home: "Home", section: "White label" },
  eyebrow: "For agencies, on Studio",
  sub: "Rankbox runs a writing line for each client site. It researches the client's market, drafts long-form articles in that client's voice, and scores every one before it's finished. Your editor reviews them, and they go live on the client's site under the client's name.",
  cta: "Start your Studio",
  secondary: "Follow one article down the line",
  note: `${TRIAL} on your own site. Card required. Client sites open in Studio once the plan is paid.`,
};

export const SHORT_ANSWER = {
  label: "The short answer",
  q: "What is white label content writing?",
  a: `White label content writing is content an agency delivers to clients as its own work, with whoever produced it kept out of sight. The usual service is a network of freelance writers: you brief each piece, a draft comes back days later, and you send edits. Rankbox takes the writers out. Each client site gets its own planned topics, its own voice brief and up to ${ARTICLES} long-form articles a month, each scored against 11 SEO and GEO checks. Your editor reads every one, and it publishes on the client's site with the client's byline.`,
};

/* ------------------------------------------------------------------ */
/* Who works each station                                              */
/* ------------------------------------------------------------------ */

export type Owner = "rankbox" | "agency" | "client";

export const OWNERS: Record<Owner, string> = {
  rankbox: "Rankbox",
  agency: "Your agency",
  client: "The client",
};

/* ------------------------------------------------------------------ */
/* The hero's ticket: one sample article                               */
/* ------------------------------------------------------------------ */

/**
 * One article for a fictional client. The score is the editor's own
 * arithmetic: every check passes except the meta description, a warning
 * worth half its weight (the page test runs the real scorer to confirm).
 */
export const TICKET = {
  sample: "Sample",
  sampleNote: "Fictional client",
  client: "Sablewood Dental",
  domain: "sablewood-dental.example",
  next: "Driftmoor Coffee",
  title: "How often should kids see the dentist?",
  keywordLabel: "Keyword",
  keyword: "how often should kids see the dentist",
  score: 96,
  passed: 10,
  checks: 11,
  scoreLabel: "SEO and GEO score",
  openCheck: "Open: meta description at 168 characters",
  stations: [
    {
      name: "Read the site",
      owner: "rankbox" as Owner,
      out: "Done once, when the site was added: brand profile and 25 buyer searches",
    },
    {
      name: "Plan",
      owner: "agency" as Owner,
      out: "Topic agreed with the client, scheduled for Thursday",
    },
    {
      name: "Research and draft",
      owner: "rankbox" as Owner,
      out: "5 ranking pages read. Friendly tone, for parents",
    },
    {
      name: "Score and revise",
      owner: "rankbox" as Owner,
      out: "10 of 11 checks passed after one rewrite",
    },
    {
      name: "Editor's pass",
      owner: "agency" as Owner,
      out: "Claims checked against the references, 3 passages edited",
    },
    {
      name: "Deliver",
      owner: "client" as Owner,
      out: "Pulled in as a draft, approved by the practice, then published",
    },
  ],
  bylineLabel: "Published as",
  byline: "Sablewood Dental team",
  bylineNote: "Set by the client's blog template",
};

/* ------------------------------------------------------------------ */
/* 01 Stations                                                         */
/* ------------------------------------------------------------------ */

const APPS_LINE = APPS_PENDING.length
  ? `The ${listNames(APPS_PENDING)} apps are built and waiting for marketplace approval. Until they're live, a client's site connects through the REST API, which a developer sets up once per site.`
  : "Webflow and Shopify sites can connect with the Rankbox apps; any other client site connects through the REST API, which a developer sets up once.";

export const STATIONS = {
  intro:
    "Every article for every client passes the same six stations. Rankbox does the work at the first four, with your say at the first two. Your editor owns the fifth, and the client's site finishes the job.",
  nothing: "Nothing to do",
  rows: [
    {
      name: "Read the site",
      when: "Once per client",
      rankbox:
        "Reads the page you enter, usually the homepage, and drafts the brand name, a plain description and up to 25 searches the client's buyers make.",
      agency: "Corrects the brand profile and picks the searches worth winning.",
      client: "Tells you what they sell and the words they never use, if you ask.",
    },
    {
      name: "Plan",
      when: "Once, then as you like",
      rankbox: `Turns each search into a topic, up to ${ARTICLES}, quick wins first, and lays them out on a calendar.`,
      agency:
        "Reorders, deletes and adds topics. Sends the list for sign-off if your contract includes it.",
      client: "Approves topics, where you've agreed to that.",
    },
    {
      name: "Research and draft",
      when: "Every article",
      rankbox:
        "Searches the live web for the keyword, reads the top 10 results and writes from the 5 best, citing only those, in the client's brief.",
      agency: "Sets the client's brief once: tone, audience, style and house rules.",
      client: "",
    },
    {
      name: "Score and revise",
      when: "Every article",
      rankbox:
        "Scores the draft on 11 checks and rewrites only what fails, keeping its depth, structure and citations.",
      agency: "Reads the score and the checklist in the editor.",
      client: "",
    },
    {
      name: "Editor's pass",
      when: "Every article",
      rankbox:
        "Rewrites any passage you select in the client's voice: Improve SEO, Rewrite, Expand or Shorten, with no credit spent.",
      agency:
        "Checks facts, numbers, quotes and sources, the client's required wording, and adds images and real internal links.",
      client: "",
    },
    {
      name: "Deliver",
      when: "Every article",
      rankbox:
        "Makes the finished article available on that client site's own API key, with the writer's notes removed.",
      agency: "Has a developer connect the client's site, once.",
      client:
        "Their site pulls new articles on its own schedule and its template sets the byline. Held articles wait as drafts.",
    },
  ],
  apps: APPS_LINE,
  links: [
    {
      label: "How publishing works",
      target: { kind: "doc", section: "publishing", page: "overview" },
    },
    {
      label: "How articles are written",
      target: { kind: "doc", section: "content", page: "writing" },
    },
  ] satisfies LinkItem[],
};

/* ------------------------------------------------------------------ */
/* 02 Voice: the brief composer                                        */
/* ------------------------------------------------------------------ */

/** The dashboard's tone and style options (Settings → How autopilot writes). */
export const TONES = [
  "Professional",
  "Friendly",
  "Confident",
  "Conversational",
  "Authoritative",
  "Playful",
] as const;
export const STYLES = [
  "Balanced",
  "Concise and actionable",
  "In-depth and data-driven",
  "Story-led",
  "Step-by-step",
] as const;

export interface VoicePreset {
  brand: string;
  domain: string;
  product: string;
  tone: string;
  style: string;
  audience: string;
  rules: string;
}

export const VOICE = {
  intro:
    "Each client site in Studio has its own brand and writing settings. Rankbox turns them into a short brief and puts it at the top of every draft, every revision and every AI rewrite for that client. This is the exact text, built by the same code the writer uses. Pick a sample client, or type over it.",
  tabsLabel: "Sample clients",
  sample: "Sample",
  edited: "Edited",
  reset: "Reset",
  fields: {
    brand: "Brand name",
    product: "What they sell",
    tone: "Tone",
    style: "Writing style",
    audience: "Who they write for",
    rules: "House rules",
    rulesHint: "One rule per line",
    own: "Your own",
    ownTone: "Describe the tone",
    ownStyle: "Describe the style",
  },
  outputLabel: "What the writer reads",
  outputNote: "Blank fields fall back to the writer's defaults.",
  presets: [
    {
      brand: "Sablewood Dental",
      domain: "sablewood-dental.example",
      product:
        "A family dental practice offering checkups, cleanings and braces for children and adults.",
      tone: "Friendly",
      style: "Step-by-step",
      audience: "Parents booking a child's first checkup",
      rules:
        'Don\'t give medical advice; tell readers to ask their dentist.\nSay "checkup", not "exam".\nUse US spelling.',
    },
    {
      brand: "Driftmoor Coffee",
      domain: "driftmoor-coffee.example",
      product: "A small-batch roaster selling whole-bean coffee by subscription.",
      tone: "Conversational",
      style: "Concise and actionable",
      audience: "Home brewers moving past supermarket coffee",
      rules:
        'Give brew ratios in grams.\nNever call a coffee "the best".\nPoint readers to the subscription in the conclusion.',
    },
    {
      brand: "Mossbark BBQ",
      domain: "mossbark-bbq.example",
      product: "A barbecue restaurant that also caters weddings and office events.",
      tone: "Playful",
      style: "Balanced",
      audience: "People planning food for 20 to 200 guests",
      rules:
        'Never quote prices; send readers to the catering form.\nKeep jokes out of the FAQ.\nWrite "barbecue" in full in headings.',
    },
  ] satisfies VoicePreset[],
  notesTitle: "Three things to know before you set a brief",
  notes: [
    "Research and the content plan don't read the brief. They work from the client's website, so the brief changes how articles sound, not what they're about.",
    "House rules guide the model; they don't filter what it writes. For clients with regulated wording, such as dental, legal or financial practices, your editor reads every article for it.",
    "A change applies from the next article. Articles already written keep the old voice until you rewrite passages in the editor.",
  ],
  links: [
    { label: "Brand Voice", target: { kind: "feature", slug: "brand-voice" } },
    {
      label: "Writing settings, field by field",
      target: { kind: "doc", section: "content", page: "brand-voice" },
    },
  ] satisfies LinkItem[],
};

/* ------------------------------------------------------------------ */
/* 03 Anatomy: the article spec                                        */
/* ------------------------------------------------------------------ */

export type BlockKind =
  | "meta"
  | "title"
  | "intro"
  | "video"
  | "sections"
  | "list"
  | "takeaways"
  | "conclusion"
  | "faq"
  | "refs";

export const ANATOMY = {
  intro:
    "The writer follows one blueprint for every client, so you know what you're delivering before the first draft. Length moves with the topic: typically 2,000 to 3,500 words, against a target of 2,750.",
  schematic: "Schematic, not to scale",
  blocks: [
    {
      kind: "meta",
      label: "Meta description",
      spec: "120 to 160 characters, with the keyword. Up to 4 tags travel with it.",
    },
    { kind: "title", label: "Title", spec: "Under 60 characters, and it contains the keyword." },
    {
      kind: "intro",
      label: "Opening answer",
      spec: "150 to 200 words that open with a direct answer of two or three sentences, written to stand on its own when quoted.",
    },
    {
      kind: "video",
      label: "Video",
      spec: "One relevant YouTube video under the opening section, when a suitable one exists. Promotional titles are skipped.",
    },
    {
      kind: "sections",
      label: "Body sections",
      spec: "At least 15 headings in all. Each H2 section runs 300 to 500 words, with examples and at least one point the ranking pages miss.",
    },
    {
      kind: "list",
      label: "Lists",
      spec: "Two or more lists, plus a comparison or step-by-step section where the topic suits one.",
    },
    { kind: "takeaways", label: "Key takeaways", spec: "Five to seven bullets." },
    {
      kind: "conclusion",
      label: "Conclusion",
      spec: "200 to 250 words, ending on a next step for the reader.",
    },
    {
      kind: "faq",
      label: "FAQ",
      spec: "Exactly five questions, each a sub-heading ending in a question mark, answered in two to four sentences.",
    },
    {
      kind: "refs",
      label: "References",
      spec: "Inline citations, and a closing list of the pages the research read.",
    },
  ] satisfies { kind: BlockKind; label: string; spec: string }[],
  outTitle: "On the way to the client's site",
  out: [
    {
      title: "Image notes are removed",
      body: "The writer marks where images would help. Those notes never reach the live page, and no images are generated or sent, so the client's own photos go in through their CMS.",
    },
    {
      title: "Link suggestions become plain text",
      body: "Rankbox doesn't know the client's URLs, so suggested internal links arrive as anchor text for your editor to link.",
    },
    {
      title: "No author is sent",
      body: "The API carries the title, body, description, tags and score, and no byline. The client's blog template supplies it.",
    },
  ],
  links: [
    { label: "Citation-Ready Writer", target: { kind: "feature", slug: "citation-ready-writer" } },
    { label: "The full blueprint", target: { kind: "doc", section: "content", page: "writing" } },
  ] satisfies LinkItem[],
};

/* ------------------------------------------------------------------ */
/* 04 Checks                                                           */
/* ------------------------------------------------------------------ */

export const CHECKS = {
  intro:
    "Every draft is scored and rewritten against the checks the editor shows. They measure how an article is built. They can't tell whether it's true, which is why the editor's pass stays with your team.",
  autoTitle: "Checked on every draft",
  autoLead:
    "One score from 0 to 100, from 11 checks. A draft that fails some is rewritten to fix only those, then scored again.",
  auto: [
    "Keyword in the title",
    "Keyword in the first 100 words",
    "Keyword density of 0.5% to 2.5%",
    "1,500 words or more",
    "Three or more H2 sections",
    "Two or more H3 sub-headings",
    "Three or more list items",
    "An FAQ section",
    "A meta description of 120 to 160 characters",
    "Two or more links",
    "Readability of Flesch 55 or higher",
  ],
  autoNote:
    "Six of these are the GEO signals: the answer up front, the FAQ, clear sections, linked sources, depth and readability. A high score is a build check. It doesn't forecast rankings or citations.",
  editorTitle: "Read by your editor",
  editorLead: "What no score can check. Copy it into your own process.",
  editor: [
    "Every claim, number and quote matches a source. Rankbox doesn't fact-check.",
    "Each reference opens and says what the article says it does.",
    "The client's required or regulated wording is right. House rules guide the writer but don't filter its output.",
    "Images and a featured image are added in the client's CMS.",
    "Internal links point at real pages on the client's site.",
    "Image notes or link suggestions left in after an edit are deleted.",
    "The byline, and any note about AI help, follow the client's policy.",
  ],
  copyTitle: "Editor's pass, before a client article goes live",
  copy: "Copy checklist",
  copied: "Copied",
  copyFailed: "Couldn't copy. Select the list and copy it by hand.",
  googleTitle: "What Google says about AI-written content",
  google: [
    {
      quote: "Appropriate use of AI or automation is not against our guidelines.",
      source: "Google Search Central, guidance about AI-generated content, 8 February 2023",
      href: "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content",
    },
    {
      quote:
        "Using generative AI tools or other similar tools to generate many pages without adding value for users",
      source: "Listed as scaled content abuse in Google's spam policies, updated 28 August 2026",
      href: "https://developers.google.com/search/docs/essentials/spam-policies#scaled-content",
    },
  ],
  googleTake:
    "At agency volume, the editor's pass is what keeps a content service on the right side of that line. Both pages read on 29 October 2026.",
  links: [
    { label: "SEO / GEO Score", target: { kind: "feature", slug: "seo-geo-score" } },
    {
      label: "Every check and its weight",
      target: { kind: "doc", section: "content", page: "scoring" },
    },
    {
      label: "Check a live client page",
      target: { kind: "tool", slug: "ai-citation-readiness-checker" },
    },
  ] satisfies LinkItem[],
};

/* ------------------------------------------------------------------ */
/* 05 Sign-off                                                         */
/* ------------------------------------------------------------------ */

const APPS_HOLD = APPS_PENDING.length
  ? `Once the ${listNames(APPS_PENDING)} apps are approved, they can hold articles as drafts or hidden posts with no code.`
  : "The Webflow app can send articles as drafts and the Shopify app as hidden posts, with no code.";

export const SIGN_OFF = {
  intro:
    "Rankbox has no approve button, and clients don't get a login, so you choose where sign-off happens. There are two natural points: before a topic is written, and before a finished article goes live.",
  track: {
    plan: "Plan",
    work: "Write, score, edit",
    live: "Live on the client's site",
    gate: "Gate",
  },
  gates: [
    {
      n: "1",
      short: "Topics",
      title: "Topics, before anything is written",
      steps: [
        "Pause autopilot on that client's site in Settings. Ideas and scheduled topics stay where they are.",
        "Send the client the planned titles and briefs, in whatever format you already use with them.",
        "Schedule the approved topics, or write them now. Delete the rest.",
      ],
      note: "Nothing is spent until a topic is written.",
    },
    {
      n: "2",
      short: "Articles",
      title: "Articles, before readers see them",
      steps: [
        "Have the client's integration save each finished article as a draft. With the REST API, the client's code decides draft or live.",
        "The client reads it in their own CMS, where they already work.",
        "Make agreed changes in the Rankbox editor and click Publish changes. The client's next sync picks them up.",
      ],
      note: APPS_HOLD,
    },
  ],
  links: [
    {
      label: "Autopilot and pausing",
      target: { kind: "doc", section: "content", page: "autopilot" },
    },
    {
      label: "Drafts, edits and deletions by destination",
      target: { kind: "doc", section: "publishing", page: "overview" },
    },
  ] satisfies LinkItem[],
};

/* ------------------------------------------------------------------ */
/* 06 Pace: the roster planner                                         */
/* ------------------------------------------------------------------ */

export const PACE = {
  intro: `Each client site has its own pace and its own allowance of up to ${ARTICLES} articles a month. Add your roster to see the month's volume and what it asks of your editor.`,
  label: "Roster planner",
  cols: { client: "Client", pace: "Pace", month: "A month" },
  clientField: "Client name",
  paceField: "Pace for",
  newClient: "Client",
  add: "Add a client",
  remove: "Remove",
  minutes: "Editing minutes per article",
  minutesHint: "Your own estimate",
  minutesError: "Enter whole minutes from 1 to 600.",
  empty: "Add a client to start the count.",
  totals: {
    sites: "Client sites",
    articles: "Articles a month",
    hours: "Editing hours a month",
  },
  upTo: "up to",
  capped: `Capped at the ${ARTICLES} a month each site's plan allows.`,
  defaults: [
    { name: "Sablewood Dental", pace: 3 },
    { name: "Driftmoor Coffee", pace: 5 },
    { name: "Mossbark BBQ", pace: 2 },
  ],
  defaultMinutes: 30,
  maxRows: 25,
  notes: [
    "Pace sets the most autopilot writes for a site. Any planned topic can also be written on demand.",
    "A site added part-way through a billing period starts with a share of its allowance, and gets the full one at renewal.",
    `During the ${TRIAL}, one site gets ${TRIAL_ARTICLE_CREDITS} articles. Client sites come with the paid plan.`,
    "Unused credits don't roll over, and they never move between client sites.",
  ],
  links: [
    { label: "What this roster costs", target: { kind: "sibling", href: "/white-label/pricing" } },
    { label: "Studio, site by site", target: { kind: "doc", section: "account", page: "studio" } },
  ] satisfies LinkItem[],
};

/* ------------------------------------------------------------------ */
/* 07 Scope                                                            */
/* ------------------------------------------------------------------ */

export const SCOPE = {
  intro:
    "The line writes one kind of thing: long-form answer articles for a client's blog. Everything around them is yours, and so is the client.",
  writesTitle: "Rankbox writes",
  writes: [
    "Long-form answer articles for the client's blog or resource section",
    "A title, a meta description and up to 4 tags for each one",
    "Key takeaways, a five-question FAQ and a reference list",
    "Suggested internal links, as anchor text for your editor",
    "Rewrites of any passage you select, in the client's voice",
  ],
  yoursTitle: "Your team handles",
  yours: [
    "Images, featured images and alt text",
    "Fact-checking, and anything a licensed professional must sign off",
    "Service pages, landing pages, emails and social posts",
    "The client relationship: calls, reporting and invoices",
    "Connecting each client's site once, through the API",
    "What the byline says, and whether to mention AI help",
  ],
};

/* ------------------------------------------------------------------ */
/* 08 FAQ (FAQS above) and 09 the close                                */
/* ------------------------------------------------------------------ */

export const CLOSE = {
  body: "Set up your agency's own site, read the articles it writes, and put them through your editor. When the line meets your bar, start the paid plan and add your first client in Studio.",
  terms: TRIAL_TERMS,
  studio: `The trial covers one site. In Studio, Start paid plan now ends the trial and charges the first month, and from then on each client site is ${SITE_PRICE} a month.`,
  cta: "Start your Studio",
  pricing: "Plans and billing",
  deepTitle: "The rest of the white label program",
  deep: [
    {
      title: "The white label program",
      body: "How one agency account runs every client site, and what isn't white label yet.",
      target: { kind: "static", to: "/white-label" },
    },
    {
      title: "AI search as a client service",
      body: "Selling GEO work to clients, and what you can honestly report back.",
      target: { kind: "sibling", href: "/white-label/ai-seo" },
    },
    {
      title: "Pricing client content",
      body: "Your fixed cost per client site, and how to build a retainer on it.",
      target: { kind: "sibling", href: "/white-label/pricing" },
    },
  ] satisfies { title: string; body: string; target: Target }[],
};

/** Every internal link the page renders, for the page test. */
export const ALL_LINKS: Target[] = [
  ...STATIONS.links,
  ...VOICE.links,
  ...ANATOMY.links,
  ...CHECKS.links,
  ...SIGN_OFF.links,
  ...PACE.links,
]
  .map((l): Target => l.target)
  .concat(
    CLOSE.deep.map((d): Target => d.target),
    [{ kind: "static", to: "/pricing" }],
  );
