/**
 * The shape of an engine SEO guide.
 *
 * Prose fields typed `Md` accept a small inline markup — **bold**, `code` and
 * [text](href) — and nothing else. Block structure (lists, code, tables, the
 * custom diagrams) is expressed as typed blocks rather than markdown, so each
 * one gets its own designed component instead of generic article styling.
 */
import type { EngineSlug } from "./engines";

/** Inline markup: **bold**, `code`, [text](href). */
export type Md = string;

/** How sure we are of a claim — shown beside it, so readers can weigh it. */
export type Evidence = "official" | "observed" | "our-read";

export interface PipelineStep {
  title: string;
  body: Md;
  /** What a site owner can do at this step; omitted where nothing can. */
  lever?: Md;
}

export interface Crawler {
  /** The robots.txt user-agent token. */
  token: string;
  role: "search" | "user" | "training" | "other";
  purpose: Md;
  /** Whether it honors robots.txt. */
  robots: "yes" | "partial" | "no";
  robotsNote?: string;
  advice: "allow" | "your-call" | "block";
}

export interface Requirement {
  label: string;
  status: "required" | "helps" | "no-effect" | "unconfirmed";
  note: Md;
}

export interface Stat {
  value: string;
  label: string;
  source: { name: string; href: string };
}

export interface Myth {
  myth: string;
  reality: Md;
}

export interface Signal {
  title: string;
  body: Md;
  evidence: Evidence;
}

export type GuideBlock =
  | { kind: "p"; text: Md }
  | { kind: "h3"; text: string }
  | { kind: "list"; items: Md[]; ordered?: boolean }
  | { kind: "code"; lang: string; code: string }
  | { kind: "table"; head: string[]; rows: Md[][] }
  | { kind: "callout"; tone: "note" | "warning" | "tip"; title: string; text: Md }
  | { kind: "pipeline"; steps: PipelineStep[] }
  | { kind: "crawlers"; bots: Crawler[] }
  | { kind: "requirements"; items: Requirement[] }
  | { kind: "stats"; items: Stat[] }
  | { kind: "myths"; items: Myth[] }
  | { kind: "signals"; items: Signal[] };

export interface GuideSection {
  /** Anchor id, also the table-of-contents target. */
  id: string;
  title: string;
  blocks: GuideBlock[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  detail: Md;
  impact: "high" | "medium" | "low";
}

export interface Faq {
  q: string;
  a: Md;
}

export interface Source {
  title: string;
  publisher: string;
  href: string;
}

/**
 * One row per attribute of the cross-engine comparison on /ai-seo. Every
 * guide fills the same keys so the matrix can never have a hole.
 */
export interface EngineProfile {
  /** Where answers come from when the engine searches. */
  retrieval: string;
  /** The user agent to allow for search visibility. */
  searchCrawler: string;
  /** The user agent that can be blocked without leaving search. */
  trainingCrawler: string;
  /** Whether the engine's fetcher executes JavaScript. */
  rendersJs: string;
  /** How its referral traffic arrives in analytics. */
  referrer: string;
  /** How citations are shown to the user. */
  citationStyle: string;
  /** The single highest-leverage move. */
  biggestLever: string;
}

/** The mock answer in the hero: what a citation looks like on this engine. */
export interface AnswerPreview {
  prompt: string;
  /** Status line above the answer, in the engine's own words. */
  status: string;
  /** Answer text; **bold** marks the cited brand. */
  answer: Md;
  sources: { domain: string; title: string }[];
}

export interface EngineGuide {
  slug: EngineSlug;
  metaTitle: string;
  metaDescription: string;
  /** The head term the page is built around, plus close variants. */
  keywords: string[];
  headline: { lead: string; accent: string };
  subhead: string;
  /** Written to be quoted: the first self-contained answer on the page. */
  shortAnswer: Md;
  takeaways: Md[];
  /** The spec band under the hero — four facts. */
  facts: { label: string; value: string; mono?: boolean }[];
  preview: AnswerPreview;
  profile: EngineProfile;
  sections: GuideSection[];
  checklist: ChecklistItem[];
  faqs: Faq[];
  sources: Source[];
  /** Entity identifiers for the engine, for schema.org `about.sameAs`. */
  sameAs: string[];
  /** Deeper reading elsewhere on the site. */
  furtherReading: { title: string; href: string; description: string }[];
}
