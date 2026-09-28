/**
 * The four conditions an answer engine checks before it names a brand, and
 * the job of measuring whether it does. Both /solutions pages are built on
 * this list, so "readable, answered, liftable, corroborated" means the same
 * thing wherever a visitor meets it.
 *
 * Every slug here is checked by solutions.test.ts: tools against TOOLS,
 * features against FEATURES. The sample answer uses made-up brands (Plannora,
 * Loopcraft), the same ones the landing and integration pages use.
 */
import { CHANGELOG } from "@/data/changelog";

export type GateId = "readable" | "answered" | "liftable" | "corroborated";
export type JobId = GateId | "measured";

export interface Job {
  id: JobId;
  /** One word, used as the gate's name everywhere. */
  name: string;
  /** The question the engine (or the owner) is effectively asking. */
  question: string;
  /** Why it decides the citation, in two sentences a reader could quote. */
  why: string;
  /** Free tools that check or fix it, most useful first. Slugs in TOOLS. */
  tools: string[];
  /** Feature pages that do it inside Rankbox. Empty when free tools cover it. */
  features: string[];
  /** What Rankbox does for this job, stated as what ships. */
  rankbox: string;
}

export interface Gate extends Job {
  id: GateId;
  /** What the sample answer's "why" line says when this gate fails. */
  fail: string;
}

export const GATES: Gate[] = [
  {
    id: "readable",
    name: "Readable",
    question: "Can AI crawlers fetch and read the page?",
    why: "An engine can only cite a page its bot was allowed to fetch and could read without running JavaScript. A blocked crawler or a page that renders blank ends it before content matters.",
    tools: [
      "ai-search-readiness-check",
      "ai-robots-txt-generator",
      "robots-txt-tester",
      "llms-txt-generator",
      "sitemap-generator",
    ],
    features: [],
    rankbox:
      "A one-time setup, so the free tools are enough: check crawler access, fix robots.txt, and hand engines a sitemap.",
    fail: "robots.txt blocks OAI-SearchBot, so ChatGPT never read plannora.io.",
  },
  {
    id: "answered",
    name: "Answered",
    question: "Is there a page that answers this exact question?",
    why: "Engines break a prompt into several searches and cite pages that answer one of them directly. With no page for the question, there is nothing of yours to cite.",
    tools: [
      "ai-question-generator",
      "content-brief-generator",
      "ai-faq-generator",
      "blog-title-generator",
    ],
    features: ["answer-space-research", "citation-ready-writer"],
    rankbox:
      "Maps the questions your buyers ask from your site and category, then writes an article for each one from live web research.",
    fail: "No Plannora page answers this question, so there was nothing of theirs to cite.",
  },
  {
    id: "liftable",
    name: "Liftable",
    question: "Can an engine lift the answer in one piece?",
    why: "Engines quote passages, not pages. The answer that gets lifted sits in the first lines, under a heading that matches the question, with its sources linked.",
    tools: [
      "ai-citation-readiness-checker",
      "heading-structure-checker",
      "schema-generator",
      "serp-snippet-preview",
      "meta-description-writer",
    ],
    features: ["seo-geo-score"],
    rankbox:
      "Scores every draft for AI-answer readiness before it goes out: answer up front, FAQ, clear sections, cited sources, depth and readability.",
    fail: "Plannora's answer was buried in paragraph nine. The engine quoted a page that led with it.",
  },
  {
    id: "corroborated",
    name: "Corroborated",
    question: "Do other sites vouch for you?",
    why: "Engines lean toward brands that other sources mention too: links, reviews, forum threads. One site calling itself the best is a claim; several independent sites saying so is a consensus.",
    tools: ["get-recommended-by-chatgpt"],
    features: ["authority-backlinks", "reddit-presence"],
    rankbox:
      "Trades backlinks with member sites in your niche and drafts replies for the Reddit threads your buyers read. You approve and post every reply.",
    fail: "Only plannora.io says Plannora is good. The engine named the brand other sites recommend.",
  },
];

export const MEASURE_JOB: Job = {
  id: "measured",
  name: "Measured",
  question: "Does AI name you today, and is it working?",
  why: "AI answers vary between runs, so one lucky prompt proves nothing. Visibility is a share: how often you're named across a fixed set of buyer questions, run more than once.",
  tools: ["ai-visibility-prompt-generator", "ai-crawler-log-analyzer", "utm-link-builder"],
  features: [],
  rankbox:
    "Shows how much of your market you've answered and how every article scores for AI readiness. Live citation monitoring isn't available yet, so test answers with the free prompt kit.",
};

export const JOBS: Job[] = [...GATES, MEASURE_JOB];

/**
 * The six checks behind the AI-readiness score, in the dashboard's words.
 * solutions.test.ts holds this to AI_SIGNALS in the Rank page's model, which
 * is too heavy to import from a marketing page.
 */
export const READINESS_SIGNALS = [
  "Answers up front",
  "FAQ section",
  "Clear sections",
  "Cites sources",
  "Depth",
  "Easy to read",
] as const;

/** Features the changelog still lists as rolling out, so the pages can say so. */
const CHANGELOG_FOR_FEATURE: Record<string, string> = {
  "reddit-presence": "reddit-presence",
  "authority-backlinks": "backlink-exchange",
};

export function rollingOut(featureSlug: string): boolean {
  const entry = CHANGELOG.find((e) => e.slug === CHANGELOG_FOR_FEATURE[featureSlug]);
  return entry !== undefined && entry.status !== "live";
}

/** The sample exchange the gate lab and the hero both show. */
export const SAMPLE = {
  engine: "ChatGPT" as const,
  prompt: "What's the best project management tool for a five-person startup?",
  brand: "Plannora",
  domain: "plannora.io",
  rival: "Loopcraft",
  rivalDomain: "loopcraft.ai",
  /** Sources when every gate passes; the brand's own page leads. */
  sources: ["plannora.io/blog/pm-tools-small-teams", "reddit.com/r/startups", "yardstick.team"],
  rivalSources: ["loopcraft.ai/compare", "yardstick.team"],
};
