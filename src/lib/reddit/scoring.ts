/**
 * Opportunity scoring, pure and shared: the live sweep and the mock store rank
 * threads with this exact function, so what the dashboard demonstrates offline
 * is what the server does for real.
 *
 * An opportunity is a Reddit thread being considered for one reply from one
 * brand. The score answers "is this worth a person's time and good name, right
 * now" — and below the answerable floor, or behind any hard gate, the answer is
 * "this is not an opportunity at all", with the reason attached.
 *
 * Signals come in two kinds and the distinction is kept all the way to the UI:
 *   MEASURED  googlePosition, aiCited, upVotes, numComments, postedAt, the
 *             locked/archived/removed flags, the subreddit's rules
 *   DERIVED   ageDays, velocity, engagement, freshness, subredditFit,
 *             answerable, selfPromoRisk
 * Only measured signals may ever be shown to a member as a fact about a thread.
 */
import { overlap, termSet } from "@/lib/exchange/scoring";
import { normalizeSubreddit, readRules } from "./rules";
import { ANSWERABLE_FLOOR, ARCHIVE_DAYS, type RedditBlockedReason } from "./types";

/** Who is replying: the brand, and the limits the member has set. */
export interface ScoreContext {
  niche: string | null;
  topicTags: string[];
  /** The member's tracked keywords — their topical profile. */
  keywords: string[];
  productDescription: string;
  /** Non-empty means allowlist-only. */
  allowSubreddits: string[];
  denySubreddits: string[];
}

export interface ScoreInput {
  redditId: string;
  subreddit: string;
  title: string;
  body: string;
  upVotes: number;
  numComments: number;
  postedAt: string | null;
  isLocked: boolean;
  /** Null when the scraper did not say — see `blockedReasonFor`. */
  isArchived: boolean | null;
  isRemoved: boolean;
  /** Found but never hydrated: engagement is absent, not zero. */
  partialData: boolean;
  /** Measured Google position for a tracked keyword, or null if we have none. */
  googlePosition: number | null;
  /** Whether any AI engine was ever asked about this thread. */
  aiChecked: boolean;
  aiCited: boolean;
  subredditTitle: string;
  subredditDescription: string;
  subredditTags: string[];
  /** The subreddit's rule text. Empty when unread — see `rulesKnown`. */
  subredditRules: string[];
  /** False when we could not fetch the rules, as opposed to there being none. */
  rulesKnown: boolean;
  /** An operator override: never draft here, whatever the rules parse as. */
  promoBanned: boolean;
}

export interface ScoreBreakdown {
  googleRank: number;
  aiCited: number;
  answerable: number;
  subredditFit: number;
  engagement: number;
  velocity: number;
  freshness: number;
  selfPromoRisk: number;
  /** -1 when a hard gate applies and the thread must not be drafted for. */
  score: number;
}

export interface RankedOpportunity {
  input: ScoreInput;
  breakdown: ScoreBreakdown;
  blockedReason: RedditBlockedReason | null;
}

/**
 * Positive weights sum to 1. Two of these are arguments, not tuning:
 *
 *   googleRank (0.22) far outweighs freshness (0.08). A year-old thread sitting
 *   at #2 is worth more than a four-hour-old thread nobody will ever find. The
 *   whole premise of this feature is that Reddit threads keep being read for
 *   months; scoring that rewarded newness would contradict it.
 *
 *   aiCited is 0.18, and NOT CHECKED contributes zero — never a penalty. A
 *   thread we could not afford to look at must not rank below one we looked at
 *   and found nothing in, or the ranking becomes a function of our own budget.
 */
export const WEIGHTS = {
  googleRank: 0.22,
  aiCited: 0.18,
  answerable: 0.2,
  subredditFit: 0.12,
  engagement: 0.1,
  velocity: 0.1,
  freshness: 0.08,
} as const;

export const SELF_PROMO_PENALTY = 0.35;

/** A position past this earns nothing: page three is not visibility. */
const RANK_HORIZON = 30;
/** Freshness half-decays on roughly a month and a half. */
const FRESHNESS_TAU_DAYS = 45;
/** Comments per day at which a thread is as lively as this term can express. */
const VELOCITY_CEILING = 5;
const ENGAGEMENT_CEILING = 500;
const QUESTION_BONUS = 0.15;

const DAY_MS = 24 * 60 * 60 * 1000;

const QUESTION_SHAPE =
  /\?|\b(?:best|which|what|how|why|vs\.?|versus|alternatives?|recommend(?:ation|ations|ed)?|suggest(?:ion|ions)?|anyone\s+(?:use|using|tried|know)|looking\s+for|should\s+i|worth\s+it|advice|help\s+(?:me\s+)?(?:choos|pick|decid))\b/i;

/** Days since a timestamp. Null when we have no usable date, never a guess. */
export function ageInDays(iso: string | null | undefined, now: number): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  return Math.max(0, (now - t) / DAY_MS);
}

/** How topically close the thread is to what this brand can speak to. */
export function answerableFit(input: ScoreInput, ctx: ScoreContext): number {
  const threadTerms = termSet(input.title, input.body);
  const brandTerms = termSet(ctx.keywords, ctx.productDescription, ctx.niche, ctx.topicTags);
  return overlap(threadTerms, brandTerms);
}

/** How close the subreddit itself is to the brand's space. */
export function subredditFit(input: ScoreInput, ctx: ScoreContext): number {
  const subTerms = termSet(
    input.subreddit,
    input.subredditTitle,
    input.subredditDescription,
    input.subredditTags,
  );
  const brandTerms = termSet(ctx.niche, ctx.topicTags, ctx.keywords);
  return overlap(subTerms, brandTerms);
}

/**
 * Why this thread cannot be drafted for, or null if it can. Ordered so the
 * most final reason wins: a removed post is removed whatever else is true.
 *
 * Archiving is the careful one. Reddit archives at about six months by default
 * but subreddits can switch it off, so a scraped flag — true OR false — is
 * trusted over the age heuristic. Only when the flag is absent do we infer,
 * and then the reason is `likely_archived`, which the UI words as a
 * probability. We do not claim to know what we inferred.
 */
export function blockedReasonFor(
  input: ScoreInput,
  ctx: ScoreContext,
  now = Date.now(),
): RedditBlockedReason | null {
  if (input.isRemoved) return "removed";
  if (input.isLocked) return "locked";
  if (input.isArchived === true) return "archived";
  if (input.isArchived === null) {
    const age = ageInDays(input.postedAt, now);
    if (age !== null && age >= ARCHIVE_DAYS) return "likely_archived";
  }

  if (input.promoBanned || readRules(input.subredditRules).promoBanned) return "promo_banned";

  const sub = normalizeSubreddit(input.subreddit);
  const deny = ctx.denySubreddits.map(normalizeSubreddit);
  const allow = ctx.allowSubreddits.map(normalizeSubreddit).filter(Boolean);
  if (deny.includes(sub)) return "subreddit_denied";
  if (allow.length > 0 && !allow.includes(sub)) return "subreddit_denied";

  // The floor is tested on the raw topical overlap, never on the question
  // bonus: a well-phrased question about something else is still off-topic.
  if (answerableFit(input, ctx) < ANSWERABLE_FLOOR) return "off_topic";
  return null;
}

export function scoreOpportunity(
  input: ScoreInput,
  ctx: ScoreContext,
  now = Date.now(),
): ScoreBreakdown {
  const age = ageInDays(input.postedAt, now);

  const googleRank =
    input.googlePosition == null || input.googlePosition < 1
      ? 0
      : Math.max(0, 1 - Math.log2(input.googlePosition) / Math.log2(RANK_HORIZON));
  // Cited counts only when it was actually checked. Unchecked is zero, which
  // is also what checked-and-uncited scores — deliberately indistinguishable
  // HERE, and deliberately distinguishable in the UI.
  const aiCited = input.aiChecked && input.aiCited ? 1 : 0;

  const topical = answerableFit(input, ctx);
  const looksLikeQuestion = QUESTION_SHAPE.test(`${input.title} ${input.body.slice(0, 280)}`);
  const answerable = Math.min(1, topical + (looksLikeQuestion ? QUESTION_BONUS : 0));

  const fit = subredditFit(input, ctx);

  // A thread we never hydrated has no engagement numbers, not zero of them.
  // It scores nothing on these terms rather than being guessed at.
  const engagement = input.partialData
    ? 0
    : Math.min(
        1,
        Math.log10(1 + Math.max(0, input.upVotes) + 2 * Math.max(0, input.numComments)) /
          Math.log10(ENGAGEMENT_CEILING),
      );
  const velocity =
    input.partialData || age === null
      ? 0
      : Math.min(1, Math.max(0, input.numComments) / Math.max(age, 1) / VELOCITY_CEILING);
  const freshness = age === null ? 0 : Math.exp(-age / FRESHNESS_TAU_DAYS);

  // Unread rules are not evidence of a welcoming subreddit. They carry a
  // modest risk of their own so an unknown does not outrank a known-good one.
  const selfPromoRisk = input.rulesKnown ? readRules(input.subredditRules).risk : 0.25;

  const blocked = blockedReasonFor(input, ctx, now) !== null;
  const score = blocked
    ? -1
    : WEIGHTS.googleRank * googleRank +
      WEIGHTS.aiCited * aiCited +
      WEIGHTS.answerable * answerable +
      WEIGHTS.subredditFit * fit +
      WEIGHTS.engagement * engagement +
      WEIGHTS.velocity * velocity +
      WEIGHTS.freshness * freshness -
      SELF_PROMO_PENALTY * selfPromoRisk;

  return {
    googleRank,
    aiCited,
    answerable,
    subredditFit: fit,
    engagement,
    velocity,
    freshness,
    selfPromoRisk,
    score,
  };
}

/**
 * Ranks threads for one brand. Unlike the exchange's matcher this DROPS
 * NOTHING: a blocked thread is returned with score -1 and its reason, because
 * the dashboard shows the member what was found and why it was refused. Sorted
 * by score, then by measured position, then by id so the order is stable.
 */
export function rankOpportunities(
  inputs: ScoreInput[],
  ctx: ScoreContext,
  now = Date.now(),
): RankedOpportunity[] {
  const ranked = inputs.map((input) => ({
    input,
    breakdown: scoreOpportunity(input, ctx, now),
    blockedReason: blockedReasonFor(input, ctx, now),
  }));
  ranked.sort(
    (a, b) =>
      b.breakdown.score - a.breakdown.score ||
      (a.input.googlePosition ?? Number.POSITIVE_INFINITY) -
        (b.input.googlePosition ?? Number.POSITIVE_INFINITY) ||
      a.input.redditId.localeCompare(b.input.redditId),
  );
  return ranked;
}

/** The score as the 0–100 "fit" the dashboard shows. Blocked threads show none. */
export function fitPercent(score: number): number | null {
  if (score < 0) return null;
  return Math.round(Math.min(1, Math.max(0, score)) * 100);
}
