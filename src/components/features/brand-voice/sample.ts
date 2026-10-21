/**
 * The sample the pictures on /features/brand-voice are drawn from: one voice,
 * set for "yoursite.com", an invoicing app for freelancers, and the articles
 * written in it.
 *
 * Invented on purpose and labelled "Sample" where it shows. No brand name
 * stands in as a customer (the site is "yoursite.com" and speaks as "we"),
 * and nothing here is a result we promise: no traffic, no scores.
 *
 * The voice's fields follow the brief the writer reads before every article
 * (lib/style-brief.ts): tone, audience, product, and free-form instructions.
 */

export type RuleKey = "tone" | "audience" | "product" | "always" | "never";

export const SITE = "yoursite.com";

export const VOICE = {
  tone: ["Plain-spoken", "Practical", "Warm"],
  audience: "Freelancers and solo consultants",
  product: "Invoicing for freelancers, with a free solo plan",
  always: ["Open on the reader's problem", "Advice before the pitch"],
  never: ["revolutionary", "empower", "unlock", "!"],
} as const;

/** The article whose opening paragraph the main picture writes twice. */
export const ARTICLE_TITLE = "How much should a freelancer set aside for tax?";

/**
 * The opening paragraph, in three pieces. Each piece is written once as
 * generic AI writes it and once in the voice above; `flag` names what's wrong
 * with the first, `fix` what the second does instead, and `rules` the parts
 * of the voice that drive the change.
 */
export const SEGMENTS: {
  generic: string;
  voiced: string;
  flag: string;
  fix: string;
  source: string;
  rules: RuleKey[];
}[] = [
  {
    generic:
      "In today’s fast-paced world, managing your finances as a freelancer has never been more important!",
    voiced:
      "Most freelancers don’t need more software. They need to know how much of each payment is really theirs.",
    flag: "Stock opener",
    fix: "Opens on the reader’s problem",
    source: "Always",
    rules: ["always", "audience"],
  },
  {
    generic: "Our revolutionary platform empowers you to unlock seamless invoicing",
    voiced: "Put the tax share aside the day the money lands,",
    flag: "Words on your never list",
    fix: "Practical advice first",
    source: "Tone + never list",
    rules: ["never", "tone"],
  },
  {
    generic: "and take your business to the next level.",
    voiced: "and our invoices can work that share out for you.",
    flag: "Vague promise",
    fix: "Product, where it helps",
    source: "Product",
    rules: ["product"],
  },
];

/** Articles in the same voice: the closing band's stack and the step screens. */
export const ARTICLES = [
  {
    title: "How much should a freelancer set aside for tax?",
    lead: "Most freelancers don’t need more software. They need to know how much of each payment is really theirs.",
  },
  {
    title: "Late invoice fees: what’s fair to charge",
    lead: "A late fee isn’t a punishment. It’s the price of a client paying you last, and it should say so plainly.",
  },
  {
    title: "Quarterly taxes, explained without the jargon",
    lead: "Four dates a year, one rule: pay on what you earned, not on what you hope to earn.",
  },
  {
    title: "How to price your first freelance project",
    lead: "Start from what the work is worth to the client, then check it against the hours.",
  },
] as const;
