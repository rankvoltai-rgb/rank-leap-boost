/**
 * The sample every picture on /features/reddit-presence draws from.
 *
 * The site is "yoursite.com", as on the landing's dashboard, so no real
 * company stands in as a customer, and nobody is named: no Reddit usernames,
 * no real thread titles. The subreddits are generic, real places; nothing here
 * says anything about their rules.
 *
 * The draft's checklist and the rule verdicts are not written by hand. They
 * come from the product's own pure checker (lib/reddit/compliance and rules),
 * run on the sample at module load, so the page shows exactly what the
 * dashboard would say about this reply, including the check it couldn't run.
 */
import { checkReply, complianceSummary, resolveDisclosure } from "@/lib/reddit/compliance";
import { REDDIT_BLOCKED_COPY, type ComplianceCheck } from "@/lib/reddit/types";
import { PLAN } from "@/data/pricing";

export const SITE = "yoursite.com";

/** Reply credits a paid plan gets each cycle; one draft costs one. */
export const CREDITS = PLAN.redditRepliesPerMonth;

export type AiEvidence =
  | { state: "cited"; engine: "Perplexity" | "ChatGPT" | "Gemini"; when: string }
  | { state: "checked"; when: string }
  | { state: "unchecked" };

export interface SampleThread {
  sub: string;
  title: string;
  body: string;
  age: string;
  upvotes: number;
  comments: number;
  /** A measured Google position, with the query and when, or none. */
  google: { pos: number; query: string; when: string } | null;
  ai: AiEvidence;
  /** The 0–100 fit the dashboard shows: Rankbox's estimate, not a prediction. */
  fit: number;
}

/** The open threads a sweep surfaces for an invoicing site, best fit first. */
export const THREADS: SampleThread[] = [
  {
    sub: "freelance",
    title: "What do you all use to send invoices?",
    body: "Spreadsheet invoicing is getting messy now that I have six clients. What do you use, and is it worth paying for?",
    age: "4 months old",
    upvotes: 212,
    comments: 86,
    google: { pos: 3, query: "invoicing app for freelancers", when: "2 days ago" },
    ai: { state: "cited", engine: "Perplexity", when: "5 days ago" },
    fit: 82,
  },
  {
    sub: "smallbusiness",
    title: "Clients keep paying late. How do you chase invoices?",
    body: "",
    age: "7 weeks old",
    upvotes: 148,
    comments: 64,
    google: { pos: 5, query: "how to chase unpaid invoices", when: "2 days ago" },
    ai: { state: "checked", when: "5 days ago" },
    fit: 71,
  },
  {
    sub: "sidehustle",
    title: "Simple invoicing for a one-person business?",
    body: "",
    age: "3 days old",
    upvotes: 39,
    comments: 22,
    google: null,
    ai: { state: "unchecked" },
    fit: 58,
  },
  {
    sub: "digitalnomad",
    title: "Best way to bill clients in other currencies?",
    body: "",
    age: "5 weeks old",
    upvotes: 96,
    comments: 41,
    google: { pos: 8, query: "invoice clients in another currency", when: "2 days ago" },
    ai: { state: "unchecked" },
    fit: 49,
  },
];

/** A thread the sweep found and set aside, with the product's own reason. */
export const BLOCKED = {
  sub: "accounting",
  title: "Invoice template for a new contractor?",
  reason: REDDIT_BLOCKED_COPY.locked,
};

/** What the sweep's header counts while it runs. */
export const SWEEP = { seen: 214, open: 12, ranked: 7, cited: 3, blocked: 5, keywords: 6 };

/* ---------- The draft ---------- */

const DISCLOSURE_LINE = "Full disclosure: I work on {brand}, so I'm biased.";
export const DISCLOSURE = resolveDisclosure(DISCLOSURE_LINE, SITE);

const ANSWER =
  "With six clients, a spreadsheet stops scaling. Whatever you pick, look for three things: recurring invoices, an automatic reminder when a payment is late, and a way for clients to pay by card from the invoice itself. Most dedicated tools cover all three, and at your volume the free tiers are usually enough.";

export const REPLY = `${DISCLOSURE} ${ANSWER}`;
export const REPLY_WORDS = REPLY.split(" ");
/** The first words are the disclosure line, which the pictures mark out. */
export const DISCLOSURE_WORDS = DISCLOSURE.split(" ").length;

/** The checker's verdict on the sample reply in r/freelance, whose rules the
 *  sample never read: six passes and one honest "couldn't check". */
export const REPORT = checkReply(REPLY, {
  brandName: SITE,
  disclosureLine: DISCLOSURE_LINE,
  maxLinksPerReply: 1,
  subreddit: THREADS[0].sub,
  rules: [],
  rulesKnown: false,
  competitors: [],
});
export const REPORT_SUMMARY = complianceSummary(REPORT);

/* ---------- Rules, as the checker reads them ---------- */

export interface RuleSample {
  /** Sample rule wording, or null for a subreddit whose rules couldn't be read. */
  rule: string | null;
  state: ComplianceCheck["state"];
  verdict: string;
  detail: string;
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function readRule(rule: string | null): RuleSample {
  const check = checkReply(REPLY, {
    brandName: SITE,
    disclosureLine: DISCLOSURE_LINE,
    maxLinksPerReply: 1,
    subreddit: "",
    rules: rule ? [rule] : [],
    rulesKnown: rule !== null,
    competitors: [],
  }).checks.find((c) => c.id === "subreddit_rules")!;
  if (check.state === "fail")
    return {
      rule,
      state: "fail",
      verdict: "Won't draft",
      detail: REDDIT_BLOCKED_COPY.promo_banned,
    };
  if (check.state === "unknown")
    return { rule, state: "unknown", verdict: "You check", detail: capitalise(check.detail) };
  return { rule, state: "pass", verdict: "Passes", detail: capitalise(check.detail) };
}

/** Generic rule wording, not any real subreddit's. */
export const RULES: RuleSample[] = [
  "No self-promotion of any kind.",
  "Self-promotion is fine if you follow the 9:1 ratio.",
  "Be civil. Stay on topic.",
  null,
].map(readRule);

/* ---------- A thread you joined, re-measured ---------- */

export const RECORD = {
  sub: "Bookkeeping",
  title: "Do clients pay faster when the invoice has a pay button?",
  query: "do online invoices get paid faster",
  /** Oldest first. Only changes are events, as in the dashboard's Mentions tab. */
  events: [
    { when: "3 weeks ago", text: "You replied in r/Bookkeeping", tone: "ink" },
    { when: "3 weeks ago", text: "We found your comment", tone: "success" },
    {
      when: "3 weeks ago",
      text: "Thread measured at #6 on Google for “do online invoices get paid faster”",
      tone: "muted",
    },
    { when: "8 days ago", text: "Thread moved from #6 to #4 on Google", tone: "success" },
    {
      when: "This week",
      text: "Perplexity cited the thread for “do online invoices get paid faster”",
      tone: "success",
    },
  ] as const,
  /** Comment counts, each time the thread was looked at. Readings, no projection. */
  comments: [31, 38, 44, 47, 52, 55],
};
