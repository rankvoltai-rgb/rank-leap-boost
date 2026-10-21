/**
 * The sample world every picture on /features/citation-tracking draws from,
 * so the tracker, the benefit cards and the closing band all agree: one site
 * ("yoursite.com", as on the landing's dashboard), the four engines the
 * feature's copy names, five buyer prompts, and the four articles the
 * landing's dashboard shows yoursite.com publishing.
 *
 * Every figure is illustrative and the main screen is labelled "Sample". No
 * real company stands in as the customer, no brand is invented, and the
 * answers name no other product: a prompt that doesn't cite yoursite.com is
 * shown as "Not cited", never as a named rival.
 */
import type { ComponentType } from "react";
import { ChatGPTMark, ClaudeMark, GoogleMark, PerplexityMark } from "@/components/landing/ai-logos";

export const SITE = "yoursite.com";

export interface Engine {
  name: string;
  /** The column label, where the full name won't fit. */
  short: string;
  Mark: ComponentType<{ className?: string }>;
}

/** The four engines the feature's copy names, in the order its subhead does. */
export const ENGINES: Engine[] = [
  { name: "ChatGPT", short: "ChatGPT", Mark: ChatGPTMark },
  { name: "Perplexity", short: "Perplexity", Mark: PerplexityMark },
  { name: "Claude", short: "Claude", Mark: ClaudeMark },
  { name: "Google AI Overviews", short: "AI Overviews", Mark: GoogleMark },
];

export const ARTICLES = {
  tools: {
    title: "Best Project Management Tools for Small Teams",
    path: "/blog/best-project-management-tools",
  },
  kanban: {
    title: "Kanban vs Scrum: A Complete Guide for Founders",
    path: "/blog/kanban-vs-scrum",
  },
  standups: {
    title: "Async vs Live Standups: What's the Difference",
    path: "/blog/async-vs-live-standups",
  },
  sprint: {
    title: "Top 10 Sprint Planning Techniques for Beginners",
    path: "/blog/sprint-planning-techniques",
  },
} as const;
export type ArticleKey = keyof typeof ARTICLES;

/**
 * One engine's answer to one prompt. When it cites the site, the answer reads
 * `a` + "yoursite.com" + `b`; otherwise it is `a` alone.
 */
export interface Answer {
  a: string;
  cite?: ArticleKey;
  b?: string;
}

export interface Prompt {
  q: string;
  /** The article that answers this prompt, if the site has one. */
  article: ArticleKey | null;
  /** One answer per engine, in ENGINES order. */
  answers: [Answer, Answer, Answer, Answer];
}

/* Scanned top to bottom. The gap sits mid-list and the run ends on a prompt
   most engines cite, so the still frame shows both kinds of row. */
export const PROMPTS: Prompt[] = [
  {
    q: "best project management tool for a small team",
    article: "tools",
    answers: [
      {
        a: "For a small team, favour simple boards and a free tier. ",
        cite: "tools",
        b: " compares the main picks side by side.",
      },
      {
        a: "Most small teams start with a board-based tool. A clear roundup is on ",
        cite: "tools",
        b: " [1].",
      },
      { a: "Look for simple boards, light automation and room to grow as the team does." },
      {
        a: "Small teams usually want boards, due dates and a free plan. ",
        cite: "tools",
        b: " lists options by team size.",
      },
    ],
  },
  {
    q: "how to run async standups",
    article: "standups",
    answers: [
      {
        a: "Ask everyone to post what they did, what's next and any blockers at a set time each day.",
      },
      {
        a: "Async standups swap the daily call for a short written update. ",
        cite: "standups",
        b: " [1] covers the format.",
      },
      {
        a: "Keep updates to three lines, post them in one channel, and save live calls for blockers.",
      },
      {
        a: "Written check-ins replace the call. ",
        cite: "standups",
        b: " compares async and live standups.",
      },
    ],
  },
  {
    q: "free planning apps for lean teams",
    article: null,
    answers: [
      {
        a: "Look for a free tier that covers the whole team, with boards, lists and a calendar view.",
      },
      {
        a: "Several planning apps offer free plans for small teams. Compare user limits first [1].",
      },
      {
        a: "Free plans differ most in user limits and integrations, so check both before you commit.",
      },
      {
        a: "Free planning apps usually cap users or projects. Check the limits against your team size.",
      },
    ],
  },
  {
    q: "sprint planning techniques for beginners",
    article: "sprint",
    answers: [
      {
        a: "Start with a fixed sprint length, one clear goal, and only the work the team can finish.",
      },
      {
        a: "Common techniques include story points, capacity planning and a short backlog review [1].",
      },
      {
        a: "Keep the first sprints short, size work roughly, and adjust after each retrospective.",
      },
      {
        a: "Beginners can start with timeboxing and simple estimates. ",
        cite: "sprint",
        b: " lists ten techniques.",
      },
    ],
  },
  {
    q: "kanban vs scrum for a five-person team",
    article: "kanban",
    answers: [
      {
        a: "Kanban is the lighter start for five people. ",
        cite: "kanban",
        b: " explains when sprints start to pay off.",
      },
      {
        a: "Kanban suits continuous work; Scrum suits fixed cycles. A side-by-side guide: ",
        cite: "kanban",
        b: " [1].",
      },
      {
        a: "For five people, Kanban usually wins on overhead. The comparison on ",
        cite: "kanban",
        b: " lays out the trade-offs.",
      },
      {
        a: "Kanban limits work in progress and keeps tasks flowing, while Scrum plans work in fixed sprints.",
      },
    ],
  },
];

export const TOTAL_ANSWERS = PROMPTS.length * ENGINES.length;

export function isCited(p: number, e: number) {
  return Boolean(PROMPTS[p].answers[e].cite);
}

/** How many of the first `rows` prompts engine `e` cites the site for. */
export function citedFor(e: number, rows: number) {
  let n = 0;
  for (let p = 0; p < Math.min(rows, PROMPTS.length); p++) if (isCited(p, e)) n++;
  return n;
}

/** Citations per article, across every prompt and engine, most first. */
export function citationsByArticle() {
  const counts = new Map<ArticleKey, number[]>();
  PROMPTS.forEach((p) =>
    p.answers.forEach((ans, e) => {
      if (!ans.cite) return;
      counts.set(ans.cite, [...(counts.get(ans.cite) ?? []), e]);
    }),
  );
  return [...counts.entries()]
    .map(([key, engines]) => ({ key, ...ARTICLES[key], engines }))
    .sort((x, y) => y.engines.length - x.engines.length);
}

/** Cited answers at each of the last few checks, of TOTAL_ANSWERS tracked, latest last. */
export const TREND = [2, 3, 3, 4, 5, 6, 8, 9];
