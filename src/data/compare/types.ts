/**
 * The shape of a head-to-head page — /compare/$slug, "Surfer SEO vs
 * Clearscope".
 *
 * These are not the /alternatives pages. Those put Rankbox against one tool.
 * These compare two tools that are not ours, for the buyer who has already
 * shortlisted both, and Rankbox appears once, near the end, as a disclosed
 * third option. The page earns its place by being the most useful answer to
 * "A or B?", so the rules are strict:
 *
 * 1. Every round names a winner or calls a draw. A comparison that never
 *    picks is a spec sheet, and answer engines have no sentence to lift.
 * 2. Neither product is described as unable to do something. Say what it is
 *    built for instead, or what it does and doesn't include — the same rule as
 *    /alternatives.
 * 3. Every price is a published list price, and `checkedOn` goes on the page.
 * 4. No first-party testing claims. Rankbox hasn't run either product through
 *    a benchmark, so nothing here says "we tested" or "in our testing" — the
 *    evidence is the vendors' own documentation, pricing pages and dated
 *    third-party reporting, and every source is listed.
 * 5. The third option claims only what Rankbox ships today (see
 *    RANKBOX_SHIPS in ./matchups).
 *
 * Prose fields typed `Md` take the /ai-seo guides' inline markup — **bold**,
 * `code` and [text](href).
 */
import type { Faq, Md, Source } from "@/data/ai-seo/types";

export type { Faq, Md, Source };

/** The two contenders, always in slug order: "a" is the first name in "A vs B". */
export type Side = "a" | "b";
export type Winner = Side | "draw";

export type CellState = "yes" | "partial" | "no";

export interface Cell {
  state: CellState;
  /** A description, never a verdict: "Add-on, from $95/mo", "Not its focus". */
  note: string;
}

export interface MatrixRow {
  label: string;
  a: Cell;
  b: Cell;
}

export interface MatrixGroup {
  group: string;
  rows: MatrixRow[];
}

/** One line of the "tale of the tape": short facts, set mirrored. */
export interface TapeRow {
  label: string;
  a: string;
  b: string;
}

export interface Round {
  /** Anchor id, also the scorecard's jump target. */
  id: string;
  /** What's being judged, as a noun phrase: "Content scoring". */
  title: string;
  winner: Winner;
  /**
   * The call, in one or two sentences, winner first: "Clearscope, narrowly —
   * its grade is simpler to hit and harder to game." Written to stand alone
   * when lifted.
   */
  verdict: Md;
  /** The case for each side in this round: what it does, with specifics. */
  a: Md;
  b: Md;
}

export interface Plan {
  /** Named exactly as the vendor names it. */
  name: string;
  /** USD per month, billed monthly. null when the plan is quote-only. */
  monthly: number | null;
  /** Effective USD per month when billed annually, where it differs. */
  annual?: number;
  /** The limits that decide the plan: seats, credits, reports, prompts. */
  includes: string;
  /**
   * Sold to agencies rather than brands. Listed on the card under its own
   * label and never used as the "Starts at" price, which would otherwise
   * quote a brand an agency number.
   */
  forAgencies?: boolean;
}

export interface ProductPricing {
  plans: Plan[];
  /** How it's sold, in a phrase: "Per seat, metered by credits". */
  model: string;
  /** Trial or free-plan terms, stated plainly — "No free trial" is an answer. */
  trial: string;
  /** Their pricing page. */
  url: string;
}

export interface FinderOption {
  label: string;
  /** How far this answer leans toward each pick. */
  points: Partial<Record<Side | "rankbox", number>>;
  /** Shown in the result as the reason: "You have writers who need one clear target." */
  because: string;
}

export interface FinderQuestion {
  id: string;
  question: string;
  options: FinderOption[];
}

export interface MatchupEntry {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  /** The head term plus close variants and question forms. */
  keywords: string[];
  /** One or two sentences under the H1: what the choice is really between. */
  subhead: string;
  /**
   * The quotable paragraph: names both products, draws the distinction in one
   * sentence, then says who each is for. No marketing adjectives.
   */
  shortAnswer: Md;
  /** "Choose A if…" — three situations each, in the reader's words. */
  picks: Record<Side, string[]>;
  tape: TapeRow[];
  rounds: Round[];
  matrix: MatrixGroup[];
  pricing: {
    a: ProductPricing;
    b: ProductPricing;
    /** ISO date both pricing pages were last read. */
    checkedOn: string;
    /** What the list prices leave out: add-ons, overages, annual-only plans. */
    note: Md;
  };
  /** Three questions for the "Which one fits you?" picker. */
  finder: FinderQuestion[];
  /**
   * Rankbox, disclosed. The situation in which neither contender is the
   * right buy, and what Rankbox does instead — within RANKBOX_SHIPS.
   */
  thirdOption: { title: string; body: Md };
  faqs: Faq[];
  sources: Source[];
}
