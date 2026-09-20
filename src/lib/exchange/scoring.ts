/**
 * The matcher's scoring, pure and shared: the live matcher and the mock
 * network rank candidates with this exact function, so what the dashboard
 * demonstrates offline is what the server does for real.
 *
 * A candidate is a REQUESTER's target being considered for a slot in the
 * HOST's article. The score answers "how good a link is this for both sides,
 * right now" — and below the topical floor the answer is "not a link at all".
 */
import { EXCHANGE_CATEGORIES, tierCost } from "./types";

/** Words that say nothing about a topic — including the ones every SEO title uses. */
const STOPWORDS = new Set(
  `a an the and or but if then else of for to in on at by with from as is are was were be been being
   it its this that these those there here your you we our us they them their his her he she i my me
   do does did done not no yes can could should would will shall may might must have has had having
   what which who whom whose when where why how all any each every some more most other such than too very
   just also only even still about above after again against before below between into through during
   over under out up down off once own same so s t re ve ll d
   best top guide guides tip tips ultimate complete beginner beginners review reviews vs versus list
   idea ideas example examples way ways thing things need know using use get make new free online
   year month week day 2023 2024 2025 2026 2027 step steps everything really actually
   tool tools software app apps platform platforms service services company companies product products
   solution solutions business businesses small big website websites site sites page pages post posts
   article articles blog blogs content`
    .split(/\s+/)
    .filter(Boolean),
);

/** A light stem: plurals only, so "tools" and "tool" agree without mangling "business". */
function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** Topic terms in a piece of text: lowercase, stopwords out, plurals folded. */
export function tokens(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
    .map(stem);
}

/** The union of terms across strings and string lists. */
export function termSet(...parts: Array<string | string[] | null | undefined>): Set<string> {
  const out = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    for (const text of Array.isArray(part) ? part : [part])
      for (const t of tokens(text)) out.add(t);
  }
  return out;
}

/**
 * Overlap coefficient: |A∩B| / min(|A|,|B|). Used where the two sides differ
 * a lot in size — a five-term keyword against a forty-term profile — where
 * Jaccard would punish the mismatch in size rather than measure the fit.
 */
export function overlap(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared += 1;
  // One word in common is a coincidence, not a topic, unless a side only has
  // the one word to offer. Score it against the larger set so it stays small.
  if (shared < 2 && Math.min(a.size, b.size) >= 2) return shared / Math.max(a.size, b.size);
  return shared / Math.min(a.size, b.size);
}

/** Jaccard similarity: |A∩B| / |A∪B|. For two sets of comparable size. */
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared += 1;
  return shared / (a.size + b.size - shared);
}

export interface MatchContext {
  hostSiteId: string;
  hostTier: number;
  hostNiche: string | null;
  hostTopicTags: string[];
  blockedCategories: string[];
  articleTitle: string;
  articleKeyword: string;
  articleTags: string[];
}

export interface Candidate {
  targetId: string;
  requesterSiteId: string;
  requesterDomain: string;
  url: string;
  anchors: string[];
  topicTags: string[];
  niche: string | null;
  priority: number;
  tier: number;
  reputation: number;
  queuedSince: string;
  lastPlacedAt: string | null;
  liveCount: number;
  /** The host site already links to this requester's site somewhere. */
  everLinkedFromHost: boolean;
  /** The requester's tracked keywords — their topical profile. */
  requesterKeywords: string[];
  /** Anchors already used for this target across its live placements. */
  usedAnchors: string[];
}

export interface ScoreBreakdown {
  topical: number;
  tierFit: number;
  starve: number;
  novelty: number;
  prio: number;
  rep: number;
  recency: number;
  /** -1 when the candidate is below the topical floor and must not be placed. */
  score: number;
}

export interface RankedCandidate {
  candidate: Candidate;
  breakdown: ScoreBreakdown;
  anchor: string;
  credits: number;
}

/**
 * The hard floor. Below this the link is not relevant enough to exist, and no
 * amount of waiting, priority or reputation buys it a slot — "no match" is a
 * perfectly good outcome, and relaxing this to fill slots is the one thing the
 * exchange must never do.
 */
export const TOPICAL_FLOOR = 0.15;

const DAY_MS = 24 * 60 * 60 * 1000;

function daysSince(iso: string | null | undefined, now: number): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, (now - t) / DAY_MS);
}

/** How topically close the host's article is to what the requester wants linked. */
export function topicalFit(c: Candidate, ctx: MatchContext): number {
  const articleTerms = termSet(ctx.articleKeyword, ctx.articleTitle, ctx.articleTags);
  const targetTerms = termSet(c.topicTags, c.anchors, c.requesterKeywords, c.niche);
  const hostProfile = termSet(ctx.hostTopicTags, ctx.hostNiche);
  const requesterProfile = termSet(c.topicTags, c.niche);
  return 0.7 * overlap(articleTerms, targetTerms) + 0.3 * jaccard(hostProfile, requesterProfile);
}

export function scoreCandidate(c: Candidate, ctx: MatchContext, now = Date.now()): ScoreBreakdown {
  const topical = topicalFit(c, ctx);
  const tierFit = 1 - Math.min(3, Math.abs(ctx.hostTier - c.tier)) / 3;
  // The fair queue: a target that has waited a month is favoured as much as
  // this term allows, so nobody starves behind better-matched neighbours.
  const starve = Math.min(1, daysSince(c.queuedSince, now) / 30);
  // Prefer partners the host has never linked to — the closest cheap proxy
  // for "far apart in the link graph".
  const novelty = c.everLinkedFromHost ? 0.2 : 1;
  const prio = Math.min(10, Math.max(1, c.priority)) / 10;
  const rep = Math.min(100, Math.max(0, c.reputation)) / 100;
  // The velocity brake: a target that just got a link steps back for a week.
  const recency = c.lastPlacedAt ? Math.exp(-daysSince(c.lastPlacedAt, now) / 7) : 0;

  const score =
    topical < TOPICAL_FLOOR
      ? -1
      : 0.4 * topical +
        0.15 * tierFit +
        0.2 * starve +
        0.1 * novelty +
        0.1 * prio +
        0.05 * rep -
        0.3 * recency;

  return { topical, tierFit, starve, novelty, prio, rep, recency, score };
}

/**
 * The anchor used least so far for this target, so no two links to it share
 * wording. Ties go to the earliest variant, which keeps the choice stable.
 */
export function chooseAnchor(anchors: string[], usedAnchors: string[]): string {
  const clean = anchors.map((a) => a.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  const counts = new Map<string, number>();
  for (const used of usedAnchors) {
    const key = used.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let best = clean[0];
  let bestCount = Number.POSITIVE_INFINITY;
  for (const anchor of clean) {
    const n = counts.get(anchor.toLowerCase()) ?? 0;
    if (n < bestCount) {
      best = anchor;
      bestCount = n;
    }
  }
  return best;
}

/** Whether a requester's niche or tags fall into one of the host's blocked categories. */
export function blockedByCategory(
  blockedCategories: string[],
  niche: string | null | undefined,
  topicTags: string[],
): boolean {
  if (blockedCategories.length === 0) return false;
  const haystack = ` ${[niche ?? "", ...topicTags].join(" ").toLowerCase()} `;
  for (const id of blockedCategories) {
    const category = EXCHANGE_CATEGORIES.find((c) => c.id === id);
    if (!category) continue;
    if (category.terms.some((term) => haystack.includes(term))) return true;
  }
  return false;
}

/**
 * Ranks candidates for one article: drops anything below the floor or in a
 * blocked category, sorts by score, and breaks ties by who has waited longest.
 */
export function rankCandidates(
  candidates: Candidate[],
  ctx: MatchContext,
  now = Date.now(),
): RankedCandidate[] {
  const ranked: RankedCandidate[] = [];
  for (const candidate of candidates) {
    if (candidate.requesterSiteId === ctx.hostSiteId) continue;
    if (blockedByCategory(ctx.blockedCategories, candidate.niche, candidate.topicTags)) continue;
    const breakdown = scoreCandidate(candidate, ctx, now);
    if (breakdown.score < 0) continue;
    const anchor = chooseAnchor(candidate.anchors, candidate.usedAnchors);
    if (!anchor) continue;
    ranked.push({ candidate, breakdown, anchor, credits: tierCost(ctx.hostTier) });
  }
  ranked.sort(
    (a, b) =>
      b.breakdown.score - a.breakdown.score ||
      Date.parse(a.candidate.queuedSince) - Date.parse(b.candidate.queuedSince),
  );
  return ranked;
}
