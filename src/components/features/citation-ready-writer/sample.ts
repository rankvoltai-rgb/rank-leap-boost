/**
 * The one sample article every picture on /features/citation-ready-writer
 * shows, so the live draft, the benefit screens, the steps and the closing
 * card all tell the same story.
 *
 * The customer is "yoursite.com", as everywhere on the site, so no real
 * company stands in as a customer. The topic (WCAG 2.2) was picked because
 * its sources are public standards bodies and government pages, not
 * companies, and every claim in the sample is true and attributed to the
 * source that says it:
 *   [1] w3.org: WCAG 2.2 became a W3C Recommendation on 5 October 2023, adds
 *       nine success criteria to 2.1 (incl. 2.4.11 Focus Not Obscured, 2.5.8
 *       Target Size (Minimum) at 24 by 24 CSS pixels, 3.3.7 Redundant Entry),
 *       and content that conforms to 2.2 also conforms to 2.1 and 2.0.
 *   [2] ada.gov: the Justice Department's April 2024 Title II rule for state
 *       and local governments adopts WCAG 2.1 Level AA.
 *   [3] access-board.gov: the Revised 508 Standards incorporate WCAG 2.0.
 * Re-check these if the sample is ever reused after a new WCAG version ships.
 */

export const SITE = "yoursite.com";

/** The query the draft is written for, from the answer-space map. */
export const TOPIC = "what changed in wcag 2.2";

export const TITLE = "WCAG 2.2: What Changed and What Your Site Needs to Do";

/** Other topics on the sample map, for the "pick a topic" step. */
export const MORE_TOPICS = ["how to test color contrast", "what is alt text"];

export interface Source {
  /** The citation number, for a source the draft cites. */
  n?: number;
  domain?: string;
  title: string;
  kind: string;
  skipped?: boolean;
}

export const SOURCES: Source[] = [
  { n: 1, domain: "w3.org", title: "WCAG 2.2 Recommendation", kind: "Standard" },
  { n: 2, domain: "ada.gov", title: "Title II web rule, fact sheet", kind: "Government" },
  { n: 3, domain: "access-board.gov", title: "Revised 508 Standards", kind: "Government" },
  { title: "Roundup post, no primary source", kind: "Thin page", skipped: true },
];

/** The searches the writer runs before it reads anything. */
export const QUERIES = [
  "wcag 2.2 new success criteria",
  "title ii web accessibility rule 2024",
  "section 508 wcag version",
];

/** A run of prose with citation markers in it. */
export type Token = string | { cite: number };

/** The quotable block at the top of the draft. */
export const ANSWER: Token[] = [
  "WCAG 2.2 is the W3C's web accessibility standard, published as a Recommendation in October 2023.",
  { cite: 1 },
  " It adds nine success criteria to WCAG 2.1, including a minimum target size of 24 by 24 CSS pixels.",
  { cite: 1 },
];

export const NEW_IN_22: { term: string; body: string; cite: number }[] = [
  {
    term: "Focus Not Obscured",
    body: "a focused control can't be fully hidden by a sticky header.",
    cite: 1,
  },
  {
    term: "Target Size",
    body: "targets at least 24 by 24 CSS pixels, or spaced apart.",
    cite: 1,
  },
  {
    term: "Redundant Entry",
    body: "don't ask for the same details twice in one process.",
    cite: 1,
  },
];

export const WHO_HEADING = "Who must comply?";

export const WHO: Token[] = [
  "In the US, the Justice Department's 2024 rule for state and local governments adopts WCAG 2.1 Level AA.",
  { cite: 2 },
  " Federal agencies follow the Revised 508 Standards, which incorporate WCAG 2.0.",
  { cite: 3 },
  " Content that meets 2.2 also meets both earlier versions.",
  { cite: 1 },
];

/** The draft's outline, in the order the sections appear. */
export const OUTLINE: { tag: string; label: string }[] = [
  { tag: "H1", label: "Title + meta" },
  { tag: "TL;DR", label: "Answer block" },
  { tag: "H2", label: "What's new in 2.2" },
  { tag: "H2", label: WHO_HEADING },
  { tag: "H2", label: "How to test" },
  { tag: "H2", label: "FAQ" },
];

/** What ships with the finished sample draft (see the feature's FAQ). */
export const WORDS = 2840;
export const IMAGES = 4;
export const INTERNAL_LINKS = 6;

/** The sample's plain text, for places that set it without markers. */
export function plain(tokens: Token[]) {
  return tokens.map((t) => (typeof t === "string" ? t : "")).join("");
}
