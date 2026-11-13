/**
 * What the landing's workspace window plays, and when.
 *
 * Three recent runs for one fictional site, each ending in a different
 * panel: an article written, a keyword gap planned, an article published.
 * Everything here follows the product as documented (src/content/docs):
 * one score out of 100 from 11 checks, research that costs no article
 * credit, articles collected through the publishing API, and no images in
 * drafts. The site, its questions and its numbers are a sample.
 *
 * The timeline is plain arithmetic on elapsed milliseconds, so the window is
 * a pure function of (run, t): easy to hold still, restart, or test.
 */
import {
  CalendarDays,
  FileText,
  Gauge,
  Globe,
  Link2,
  ListTree,
  PenLine,
  Send,
  type LucideIcon,
} from "lucide-react";

export const SITE = {
  name: "Driftmoor Coffee",
  domain: "driftmoor.example",
  initial: "D",
  /** The sample site's own brand colour, used only on its mark and its page. */
  color: "#7a4a2b",
};

export type PanelKind = "article" | "plan" | "live";

export interface Run {
  id: string;
  /** In the sidebar and the top bar. */
  title: string;
  /** Where the request came from, above the bubble. */
  source: string;
  /** The request itself: a question from the plan, or a gap to plan. */
  request: string;
  /** What happened, in one or two short paragraphs. Streams in word by word. */
  prose: string[];
  /** Steps listed one by one under the prose. Optional. */
  steps?: { icon: LucideIcon; label: string }[];
  /** The part of Rankbox that did the work. */
  ran: { icon: LucideIcon; label: string };
  card: { icon: LucideIcon; title: string; meta: string };
  panel: PanelKind;
  /** Articles left this cycle, before and after the run. */
  quota: [number, number];
  /** Articles waiting in the autopilot queue, before and after. */
  queue: [number, number];
  next: { title: string; when: string };
}

export const RUNS: Run[] = [
  {
    id: "caffeine",
    title: "Cold brew caffeine",
    source: "Content plan · Tue 9:00",
    request: "Does cold brew have more caffeine than drip coffee?",
    prose: [
      "Buyers put this question to Google and to AI assistants, and Driftmoor has no page that answers it. Nine sources cover it well, and the draft keeps the five that settle it.",
      "It opens with the answer, then works through ratio, dilution and roast in Driftmoor's voice. Two revision passes took the score from 81 to 94.",
    ],
    ran: { icon: PenLine, label: "Citation-Ready Writer" },
    card: {
      icon: FileText,
      title: "Does cold brew have more caffeine?",
      meta: "Article · 2,460 words",
    },
    panel: "article",
    quota: [13, 12],
    queue: [9, 8],
    next: { title: "Pour-over vs French press", when: "Thu 9:00" },
  },
  {
    id: "freshness",
    title: "Bean freshness",
    source: "Rank · keyword gap",
    request: "Plan articles for the gap around coffee bean freshness.",
    prose: [
      "Fourteen questions sit around bean freshness, most of them about storage and roast dates. Driftmoor's site answers none of them yet.",
      "Four are now planned as articles, two a week, starting with the one searched most. The other ten are saved as ideas.",
    ],
    ran: { icon: ListTree, label: "Answer-Space Research" },
    card: {
      icon: CalendarDays,
      title: "Bean freshness plan",
      meta: "4 articles scheduled · 10 ideas",
    },
    panel: "plan",
    // Research never costs an article credit; the queue grows by the four planned.
    quota: [12, 12],
    queue: [8, 12],
    next: { title: "Pour-over vs French press", when: "Thu 9:00" },
  },
  {
    id: "press",
    title: "Pour-over vs French press",
    source: "Content plan · Thu 9:00",
    request: "Pour-over or French press: which is easier for a beginner?",
    prose: [
      "The draft passed all eleven checks, so nothing held it back. Driftmoor's site collects finished articles through the publishing API.",
    ],
    steps: [
      { icon: Gauge, label: "Scoring the final draft" },
      { icon: Send, label: "Handing it to driftmoor.example" },
      { icon: Link2, label: "Recording the live URL" },
    ],
    ran: { icon: Send, label: "Publishing API" },
    card: { icon: Globe, title: "Pour-over vs French press", meta: "Live on driftmoor.example" },
    panel: "live",
    quota: [12, 11],
    queue: [12, 11],
    next: { title: "How long do whole beans stay fresh?", when: "Mon 9:00" },
  },
];

/* ---------- Pacing ---------- */

/** Milliseconds. One place to retime the whole piece. */
export const PACE = {
  /** The "Working" clock appears. */
  working: 450,
  /** The first paragraph starts to stream. */
  prose: 950,
  /** Per word. */
  word: 46,
  /** Pause between paragraphs. */
  paragraph: 280,
  /** Per listed step. */
  step: 950,
  /** From the last word or step to "Worked for". */
  settle: 500,
  /** Then the "Ran" line, the card, and the panel. */
  ran: 220,
  card: 420,
  open: 1150,
  /** How long the open panel is held. */
  hold: 6800,
  /** The fade before the next run. */
  leave: 520,
} as const;

export interface Marks {
  paragraphs: { start: number; words: number }[];
  steps: number[];
  done: number;
  ran: number;
  card: number;
  open: number;
  leave: number;
  end: number;
}

const wordsIn = (text: string) => text.split(" ").length;

/** When each beat of a run lands, in ms from its start. */
export function marksFor(run: Run): Marks {
  let t: number = PACE.prose;
  const paragraphs = run.prose.map((p) => {
    const start = t;
    const words = wordsIn(p);
    t += words * PACE.word + PACE.paragraph;
    return { start, words };
  });
  const steps = (run.steps ?? []).map(() => {
    const start = t;
    t += PACE.step;
    return start;
  });
  const done = t + PACE.settle;
  const ran = done + PACE.ran;
  const card = ran + PACE.card;
  const open = card + PACE.open;
  const leave = open + PACE.hold;
  return { paragraphs, steps, done, ran, card, open, leave, end: leave + PACE.leave };
}

export const MARKS = RUNS.map(marksFor);

export type StepState = "idle" | "active" | "done";

export interface View {
  working: boolean;
  /** Whole seconds on the clock. Stops when the run is done. */
  seconds: number;
  /** Words shown in each paragraph. */
  shown: number[];
  steps: StepState[];
  done: boolean;
  ran: boolean;
  card: boolean;
  open: boolean;
  leaving: boolean;
  quota: number;
  queue: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Everything the window shows for run `index` at `t` ms. */
export function viewAt(index: number, t: number): View {
  const run = RUNS[index];
  const m = MARKS[index];
  const done = t >= m.done;
  return {
    working: t >= PACE.working,
    seconds: Math.max(1, Math.ceil((Math.min(t, m.done) - PACE.working) / 1000)),
    shown: m.paragraphs.map((p) => clamp(Math.floor((t - p.start) / PACE.word), 0, p.words)),
    steps: m.steps.map((start) => (t < start ? "idle" : t < start + PACE.step ? "active" : "done")),
    done,
    ran: t >= m.ran,
    card: t >= m.card,
    open: t >= m.open && t < m.leave,
    leaving: t >= m.leave,
    quota: run.quota[done ? 1 : 0],
    queue: run.queue[done ? 1 : 0],
  };
}

/** The frame held under reduced motion: the first run, finished, panel open. */
export const STILL = { run: 0, t: MARKS[0].open + 3000 };

/* ---------- The window's measures, in px at full size ---------- */

/** Matched to the reference: a 1320 × 720 window with a 240 sidebar. */
export const SIZE = { w: 1320, h: 720 } as const;

export const SIDEBAR_W = 240;
export const MAIN_W = 1080;
export const PANEL_W = 540;
