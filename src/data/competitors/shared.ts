/**
 * The shape of a comparison page, and Rankbox's side of every comparison.
 *
 * Each competitor lives in its own file in this folder and is assembled in
 * src/data/alternatives.ts. This file holds only what those entries share, so
 * an entry can import it without importing the registry that imports them.
 *
 * Rules for anything written in this folder, because these pages name other
 * companies:
 *
 * 1. Never state a competitor cannot do something. State what it is *for*.
 *    A `no` cell says "not its focus", never "missing" or "can't".
 * 2. Every competitor fact comes from their own public pages, is dated by
 *    `checkedOn`, and is listed in `sources`. If it could not be confirmed, it
 *    is left out rather than guessed.
 * 3. Rankbox's side describes what ships today, not the roadmap. The cells
 *    below read from SHIPPED and from src/data/platforms.ts, so when a feature
 *    ships, one flag upgrades every page at once.
 */
import type { LucideIcon } from "lucide-react";
import { PLAN, STUDIO, formatUsd } from "../pricing";
import { PUBLISH_PLATFORMS } from "../platforms";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** How a product handles one row of the matrix. */
export type CellState = "yes" | "partial" | "no";

export interface Cell {
  state: CellState;
  /** Shown beside the icon. Always a description, never a verdict. */
  note: string;
}

/** A matrix cell cut down to a few words, for the hero and the hub table. */
export interface Fact {
  state: CellState;
  /** Six words or fewer. */
  short: string;
}

export interface MatrixRow {
  label: string;
  /** The buyer-facing "why this row matters", shown under the label. */
  detail: string;
  rankbox: Cell;
  them: Cell;
}

export interface MatrixGroup {
  group: string;
  icon: LucideIcon;
  rows: MatrixRow[];
}

/**
 * The few facts that decide most shortlists. Drives the hero's "at a glance"
 * card and the hub table, so the two can never disagree with each other.
 */
export interface Snapshot {
  /** Who the product suits best, in eight words or fewer. */
  bestFor: string;
  publishing: Fact;
  backlinks: Fact;
  aiVisibility: Fact;
  keywordData: Fact;
}

export interface Spec {
  value: string;
  label: string;
}

export interface Battleground {
  /** Links the deep dive to the feature page that owns it. */
  featureSlug: string;
  icon: LucideIcon;
  title: string;
  body: string;
  points: string[];
}

export interface Step {
  title: string;
  body: string;
}

export interface FAQ {
  q: string;
  a: string;
}

/** One plan on their pricing page, as they sell it. */
export interface PricePlan {
  name: string;
  /** Monthly list price billed monthly, or null for "contact sales". */
  monthly: number | null;
  /** Articles a month, where the plan is sold that way; null otherwise. */
  articles: number | null;
  /** What else defines the plan, in a few words. */
  note?: string;
}

export interface Source {
  label: string;
  url: string;
}

/**
 * Where a product sits in the market. Groups the hub page, so a visitor sees
 * which tools are really the same kind of thing.
 */
export type CompetitorKind = "autopilot" | "writer" | "optimizer" | "visibility";

export const KIND_LABEL: Record<CompetitorKind, string> = {
  autopilot: "AI SEO autopilots",
  writer: "AI writing platforms",
  optimizer: "SEO and GEO content platforms",
  visibility: "AI visibility platforms",
};

export const KIND_BLURB: Record<CompetitorKind, string> = {
  autopilot: "Tools that research, write, and publish articles on a schedule.",
  writer: "Writers a person runs, from bulk campaigns to marketing copy.",
  optimizer: "Editors that score drafts for search and AI answers, with tracking on top.",
  visibility: "Platforms that track how AI answers mention your brand.",
};

export interface Competitor {
  slug: string;
  /** The competitor's name, spelled the way they spell it. */
  name: string;
  /** Their site, used to fetch the logo shown in the vs-lockup. */
  domain: string;
  /** Lettermark fallback, for when the logo fetch fails. Keep to 1–2 characters. */
  monogram: string;
  /** Their brand colour, used only as a low-opacity tint behind the fallback. */
  accent: string;
  kind: CompetitorKind;
  /** What they are, in their own terms. Used in nav and cards. */
  category: string;
  oneLiner: string;

  eyebrow: string;
  headline: { lead: string; accent: string };
  subhead: string;
  metaTitle: string;
  metaDescription: string;

  /**
   * The quotable paragraph. Written to be lifted whole by an answer engine:
   * names both products, states the distinction in one sentence, then who
   * each is for. No marketing adjectives, which get paraphrased away.
   */
  shortAnswer: string;
  /** The one-line summary of each product's job, shown as a two-up. */
  verdict: { rankbox: string; them: string };

  snapshot: Snapshot;
  specs: Spec[];

  positioning: {
    title: string;
    body: string;
    rankboxTitle: string;
    /** The line under Rankbox's card title. Defaults to "An engine, not an editor". */
    rankboxTag?: string;
    rankbox: string[];
    themTitle: string;
    them: string[];
  };

  matrix: MatrixGroup[];

  pricing: {
    /** The plan we compare against, named exactly as they name it. */
    plan: string;
    monthly: number;
    /** Articles that plan is good for, where the plan is sold that way. */
    articles: number | null;
    /** What the number covers, e.g. "1 seat, 50 AI credits". */
    covers: string;
    /** Anything the headline price does not include. */
    caveat: string;
    /** ISO date the price was last verified against their pricing page. */
    checkedOn: string;
    /** Every self-serve plan they list, cheapest first. */
    plans: PricePlan[];
    /** Shown under the plan ladder, e.g. to explain an estimate marked with *. */
    ladderNote?: string;
  };

  battlegrounds: Battleground[];
  /**
   * Heading and intro for the deep dives. Defaults to "three things Rankbox
   * does that X doesn't set out to", which is only true of a tool built for a
   * different job; a same-category rival needs its own framing.
   */
  battlegroundsTitle?: string;
  battlegroundsIntro?: string;

  /** Where the competitor is genuinely the better buy. Written straight. */
  betterWhen: { title: string; body: string }[];

  migration: { title: string; body: string; steps: Step[] };

  faqs: FAQ[];
  /** Their pages every fact above was checked against. Rendered on the page. */
  sources: Source[];
  ctaTitle: string;
  ctaBody: string;
}

/* ------------------------------------------------------------------ */
/* What Rankbox ships today                                            */
/* ------------------------------------------------------------------ */

/**
 * Features that are designed but not live. Each one is described as missing
 * on every comparison page until it ships; flip it to true on release day and
 * every page states it as included.
 */
export const SHIPPED = {
  /** Monitoring whether ChatGPT, Perplexity, Gemini and AI Overviews cite the brand. */
  citationTracking: false,
  /** Inviting teammates to one account. */
  teamInvites: false,
  /** More than one site per account, billed per site. Follows STUDIO.live. */
  studio: STUDIO.live,
} as const;

/** "A", "A and B", "A, B, and C". */
export function listNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

const PLUGIN_NAMES = PUBLISH_PLATFORMS.map((p) => p.name);
const LIVE_PLUGINS = PUBLISH_PLATFORMS.filter((p) => p.addonLive).map((p) => p.name);

/**
 * How articles reach a site, derived from which add-ons have shipped. Today
 * that is the pull API (/api/public/v1/articles), which a developer wires into
 * any site; each plugin joins the sentence the day its `addonLive` flag flips.
 * MCP is not a publishing path: its tools research and plan, they don't post.
 */
export const RANKBOX_PUBLISHING: { cell: Cell; fact: Fact; sentence: string } =
  LIVE_PLUGINS.length === 0
    ? {
        cell: {
          state: "partial",
          note: `Any site can pull finished articles through the Rankbox publishing API, which a developer sets up once. One-click plugins for ${listNames(PLUGIN_NAMES)} are in development.`,
        },
        fact: { state: "partial", short: "Publishing API; plugins coming" },
        sentence: `Today articles reach your site through the Rankbox publishing API, which a developer sets up once, and one-click plugins for ${listNames(PLUGIN_NAMES)} are in development`,
      }
    : {
        cell: {
          state: "yes",
          note: `Plugins for ${listNames(LIVE_PLUGINS)}; any other site pulls articles through the publishing API`,
        },
        fact: { state: "yes", short: `${listNames(LIVE_PLUGINS)} plugins, plus API` },
        sentence: `Articles publish through the ${listNames(LIVE_PLUGINS)} ${LIVE_PLUGINS.length === 1 ? "plugin" : "plugins"}, or to any other site through the Rankbox API`,
      };

/** Citation tracking, in the state it is actually in. */
export const RANKBOX_TRACKING: { cell: Cell; fact: Fact; shareOfAnswer: Cell } =
  SHIPPED.citationTracking
    ? {
        cell: {
          state: "yes",
          note: "Tracks citations in ChatGPT, Perplexity, Gemini, and AI Overviews",
        },
        fact: { state: "yes", short: "Citations tracked in 4 engines" },
        shareOfAnswer: { state: "yes", note: "Tracked per prompt, per engine, over time" },
      }
    : {
        cell: {
          state: "partial",
          note: "Grades every article for AI-answer readiness. Live citation monitoring is not available yet.",
        },
        fact: { state: "partial", short: "Readiness scoring, no monitoring yet" },
        shareOfAnswer: { state: "no", note: "Not available yet" },
      };

/* Rows every comparison shares, so the matrix reads consistently from page to
   page and a reader comparing two of our pages sees the same questions asked
   twice. Each competitor supplies only its own `them` cell. Every note here
   was checked against the code that does the work. */
export const RANKBOX_CELLS = {
  research: {
    state: "yes",
    note: "Reads your site and builds a plan of the questions your buyers ask, with estimated demand and intent",
  },
  /** Topic volumes and difficulty are the model's estimates, not keyword-database figures. */
  keywordData: {
    state: "partial",
    note: "Demand and competition are AI estimates, not figures from a keyword database",
  },
  writer: {
    state: "yes",
    note: "About 2,750 words by default, drafted from live research of the pages ranking now",
  },
  citations: {
    state: "yes",
    note: "Cites the sources its research found, inline and in a References list",
  },
  voice: {
    state: "yes",
    note: "Tone, audience, and voice read from your site at setup, editable any time",
  },
  score: {
    state: "yes",
    note: "Each draft is re-run against its failing SEO checks until it passes",
  },
  answerStructure: {
    state: "yes",
    note: "Direct answer up top, key takeaways, cited sources, and an FAQ in every article",
  },
  publish: RANKBOX_PUBLISHING.cell,
  autopilot: {
    state: "yes",
    note: "Writes on the weekly cadence you set, up to one article a day",
  },
  backlinks: {
    state: "yes",
    note: `${PLAN.backlinkCreditsPerMonth} backlink credits a month through the Rankbox exchange, on paid plans`,
  },
  reddit: {
    state: "yes",
    note: "Finds the threads your buyers read and drafts a reply for you to post",
  },
  tracking: RANKBOX_TRACKING.cell,
  shareOfAnswer: RANKBOX_TRACKING.shareOfAnswer,
  pricingModel: {
    state: "yes",
    note: `One flat plan: ${PLAN.articlesPerMonth} articles a month for ${formatUsd(PLAN.monthly)}, everything included`,
  },
  rewrites: { state: "yes", note: "Section rewrites in the editor are not metered" },
  seats: SHIPPED.teamInvites
    ? { state: "yes", note: "Invite your whole team at no extra cost" }
    : { state: "partial", note: "One login per account today; team invites are not available yet" },
  sites: SHIPPED.studio
    ? {
        state: "yes",
        note: `One site on the plan; add more with ${STUDIO.name} at ${formatUsd(STUDIO.monthlyPerSite)} a month each, every one with the full plan`,
      }
    : {
        state: "partial",
        note: `${PLAN.sites} website per plan; more than one means talking to us`,
      },
} satisfies Record<string, Cell>;

/** Rankbox's row of the hero card and the hub table. */
export const RANKBOX_SNAPSHOT: Snapshot = {
  bestFor: "Founders with no content team",
  publishing: RANKBOX_PUBLISHING.fact,
  backlinks: { state: "yes", short: `${PLAN.backlinkCreditsPerMonth} credits a month, included` },
  aiVisibility: RANKBOX_TRACKING.fact,
  keywordData: { state: "partial", short: "AI-estimated demand" },
};

/** Rankbox's side of the cost maths, derived so it can never drift. */
export const RANKBOX_COST = {
  monthly: PLAN.monthly,
  articles: PLAN.articlesPerMonth,
  perArticle: Math.round((PLAN.monthly / PLAN.articlesPerMonth) * 100) / 100,
} as const;

/** True once at least one one-click plugin is live. */
export const HAS_LIVE_PLUGIN = LIVE_PLUGINS.length > 0;

/** The not-its-focus cell, written once. */
export function notFocus(detail?: string): Cell {
  return { state: "no", note: detail ? `Not its focus — ${detail}` : "Not its focus" };
}
