/**
 * Shapes shared by Reddit Presence's server functions, the dashboard and the
 * mock store. Client-safe: nothing here imports a server module.
 *
 * Three rules are encoded in these types rather than left to discipline, and
 * every one of them exists because the alternative is a lie on screen:
 *
 *   1. A measurement carries its own date, and the query/place it was taken
 *      in. `SerpMeasurement` has no shape that lets you render a position
 *      without saying when it was true.
 *   2. "Not checked" is not "checked, and not cited". `RedditThreadView` has
 *      BOTH `aiChecked` and `aiCitations`, because a thread we could not
 *      afford to look at must never render the same as one we looked at and
 *      found nothing in.
 *   3. A compliance check can be `unknown`. Where we could not read a
 *      subreddit's rules we say so; we never pass a check we did not run.
 *
 * Rankbox never authenticates to Reddit and never posts. There is deliberately
 * no type here for a Reddit credential, and `RedditReply` describes something
 * the MEMBER did, which is why `claimed` is one of its states.
 */

/**
 * Whether Reddit Presence is open to this account, and if not, why. Mirrors
 * `ExchangeAccess` — it is the same paid gate, for a related reason: a
 * throwaway trial must not mint reputational output under a real person's
 * name in threads that outlive it.
 *   paid    — an active paid plan; sweeps and drafts are open
 *   trial   — trialing; opens with the first paid invoice
 *   lapsed  — took part before, no longer paying; history stays readable
 *   none    — no plan at all
 */
export type RedditAccess = "paid" | "trial" | "lapsed" | "none";

export type RedditOpportunityStatus =
  | "new"
  | "saved"
  | "drafted"
  | "posted"
  | "dismissed"
  /** The thread can no longer be replied to — archived, locked or removed. */
  | "dead"
  /** Surfaced long enough ago that acting on it now would be odd. */
  | "stale";

/**
 * What the member did, and what we could confirm about it.
 *   claimed    they said they posted but gave no permalink. Unverifiable, and
 *              labelled as such everywhere. Never counted in a measured total.
 *   posted     a permalink was given, not yet confirmed by a check
 *   confirmed  the comment was found at that permalink
 *   removed    it was found and then disappeared, or the body reads [removed]
 *   not_found  three checks in a row could not find it
 */
export type RedditReplyStatus = "claimed" | "posted" | "confirmed" | "removed" | "not_found";

export type RedditAiEngine = "chatgpt" | "perplexity" | "gemini" | "google_ai_overview";

export type RedditLedgerKind = "grant" | "spend" | "refund" | "bonus" | "adjust";

export type RedditSweepStatus = "running" | "ok" | "partial" | "failed";

/**
 * Why an opportunity cannot be acted on. Always surfaced verbatim in the
 * Blocked filter — a thread the member can see we found, and can see why we
 * will not touch, is more trustworthy than one we quietly dropped.
 */
export type RedditBlockedReason =
  | "archived"
  /** Old enough that Reddit has probably archived it — inferred, not measured. */
  | "likely_archived"
  | "locked"
  | "removed"
  | "subreddit_denied"
  | "promo_banned"
  | "off_topic";

export const REDDIT_BLOCKED_COPY: Record<RedditBlockedReason, string> = {
  archived: "Archived — Reddit locks replies after about 6 months.",
  likely_archived:
    "Probably archived — it's over 6 months old. We couldn't confirm it, so open the thread to check.",
  locked: "Locked by a moderator, so nobody can reply.",
  removed: "The post was removed.",
  subreddit_denied: "This subreddit is on your deny list.",
  promo_banned: "This subreddit bans self-promotion, so Rankbox won't draft for it.",
  off_topic: "Too far from what you write about to say anything useful.",
};

export const REDDIT_AI_ENGINE_LABELS: Record<RedditAiEngine, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Gemini",
  google_ai_overview: "Google AI Overview",
};

/**
 * A Google position we actually measured. Every field is load-bearing: a
 * position is only true for the query, the country, the device and the moment
 * it was taken in, so the type refuses to let you carry the number alone.
 */
export interface SerpMeasurement {
  query: string;
  position: number;
  country: string;
  device: string;
  checkedAt: string;
}

/**
 * One AI-engine answer we asked for. `cited: false` is a real result and is
 * stored — it is the difference between "we asked and it didn't" and "we never
 * asked", which the UI must render differently.
 */
export interface AiCitationMeasurement {
  engine: RedditAiEngine;
  query: string;
  cited: boolean;
  snippet: string;
  checkedAt: string;
}

export interface RedditTopComment {
  author: string;
  body: string;
  score: number;
}

export interface RedditThreadView {
  id: string;
  redditId: string;
  subreddit: string;
  permalink: string;
  title: string;
  body: string;
  author: string;
  upVotes: number;
  numComments: number;
  postedAt: string | null;
  isLocked: boolean;
  /**
   * Null when the scraper did not say. Subreddits can switch archiving off, so
   * an absent flag is not the same as `false` — the scorer falls back to the
   * age heuristic and says "probably", rather than claiming to know.
   */
  isArchived: boolean | null;
  isRemoved: boolean;
  topComments: RedditTopComment[];
  /** The most recent measured position, or null when we have never had one. */
  googlePosition: SerpMeasurement | null;
  /** Every AI answer we asked for on this thread, cited or not. */
  aiCitations: AiCitationMeasurement[];
  /**
   * Whether an AI engine was ever asked about this thread at all. False means
   * "not checked" and must render as such — never as "not cited".
   */
  aiChecked: boolean;
  /**
   * True when we found the thread but could not afford to hydrate it, so the
   * engagement numbers are absent rather than zero. Surfaced, not hidden.
   */
  partialData: boolean;
  hydratedAt: string | null;
}

export interface RedditSubredditView {
  name: string;
  title: string;
  publicDescription: string;
  subscribers: number | null;
  /** Three-valued on purpose: null means we could not read the rules. */
  allowsSelfPromo: boolean | null;
  promoBanned: boolean;
  rules: string[];
  rulesSource: "api" | "scrape" | "unavailable";
  rulesCheckedAt: string | null;
}

export interface RedditOpportunity {
  id: string;
  threadId: string;
  thread: RedditThreadView;
  subredditInfo: RedditSubredditView | null;
  matchedKeyword: string;
  channel: "serp" | "search" | "both";
  status: RedditOpportunityStatus;
  score: number;
  /** Every term of the score, so the detail panel can show its work. */
  breakdown: Record<string, number>;
  blockedReason: RedditBlockedReason | null;
  dismissReason: string;
  firstSeenAt: string;
  lastScoredAt: string;
}

/**
 * A compliance check's verdict. `unknown` is first-class and is the whole
 * reason this is not a boolean: where we could not read a subreddit's rules we
 * say so, and a grey dash is an honest answer where a green tick would not be.
 */
export type ComplianceState = "pass" | "fail" | "unknown";

export interface ComplianceCheck {
  id: string;
  label: string;
  state: ComplianceState;
  detail: string;
}

export interface ComplianceReport {
  checks: ComplianceCheck[];
  /** True when nothing failed. `unknown` does not block — it warns. */
  pass: boolean;
  failures: number;
  unknowns: number;
}

export interface RedditDraft {
  id: string;
  opportunityId: string;
  /** What the model wrote. */
  body: string;
  /** What the member edited it to, if they did. */
  editedBody: string | null;
  model: string;
  compliance: ComplianceReport;
  creditsSpent: number;
  regenCount: number;
  createdAt: string;
  updatedAt: string;
}

/** What the member copies: their edit if they made one, otherwise the draft. */
export function draftText(draft: Pick<RedditDraft, "body" | "editedBody">): string {
  const edited = draft.editedBody?.trim();
  return edited ? edited : draft.body;
}

export interface RedditReplyCheck {
  checkedAt: string;
  outcome: "found" | "missing" | "removed" | "unreachable" | "blocked";
  score: number | null;
  detail: string;
}

export interface RedditReply {
  id: string;
  opportunityId: string;
  threadId: string;
  draftId: string | null;
  permalink: string | null;
  redditCommentId: string | null;
  status: RedditReplyStatus;
  score: number | null;
  postedAt: string;
  confirmedAt: string | null;
  removedAt: string | null;
  lastCheckedAt: string | null;
  consecutiveFailures: number;
  checks: RedditReplyCheck[];
}

/** One re-measurement of a thread we have a reply in. Append-only, dated. */
export interface ThreadActivityPoint {
  checkedAt: string;
  numComments: number;
  upVotes: number;
}

/**
 * A reply and everything we have measured about its thread since. The
 * Mentions timeline is drawn from these series and from nothing else — there
 * is no projected line and no estimate in it.
 */
export interface RedditMention {
  reply: RedditReply;
  thread: RedditThreadView;
  subreddit: string;
  /** Oldest first. Every Google position we recorded for this thread. */
  serpHistory: SerpMeasurement[];
  /** Oldest first. Comment and vote counts each time we looked. */
  activity: ThreadActivityPoint[];
}

/** One opportunity with its drafts and the reply, if there is one. */
export interface RedditOpportunityDetail {
  opportunity: RedditOpportunity;
  drafts: RedditDraft[];
  reply: RedditReply | null;
}

/** A sweep that did not start is a normal outcome, not an error. */
export type RedditSweepResult =
  | { started: true; sweep: RedditSweep }
  | {
      started: false;
      reason:
        | "already_running"
        | "too_soon"
        | "not_paid"
        | "not_enabled"
        | "no_keywords"
        | "unconfigured";
    };

/**
 * Open means "still something to do here": found or drafted, and not blocked.
 * One definition, used by the overview's tile, the table's filter and the
 * mock, so the number on the tile and the number on the chip cannot disagree.
 */
export function isOpenOpportunity(o: {
  status: RedditOpportunityStatus;
  blockedReason: string | null;
}): boolean {
  return !o.blockedReason && (o.status === "new" || o.status === "saved" || o.status === "drafted");
}

/** Reply states that still stand — and so still hold the thread's one slot. */
export const STANDING_REPLY_STATUSES: ReadonlyArray<RedditReplyStatus> = [
  "claimed",
  "posted",
  "confirmed",
];

/** A reply only counts toward anything we present as measured once confirmed. */
export function isMeasuredReply(reply: Pick<RedditReply, "status">): boolean {
  return reply.status === "confirmed" || reply.status === "removed";
}

export interface RedditSettings {
  enabled: boolean;
  sweepEnabled: boolean;
  niche: string | null;
  topicTags: string[];
  /** Mandatory in every draft. There is no code path that removes it. */
  disclosureLine: string;
  tone: string;
  maxLinksPerReply: number;
  allowSubreddits: string[];
  denySubreddits: string[];
  keywordsPerSweep: number;
  lastSweepAt: string | null;
  sweepCount: number;
}

export interface RedditSettingsPatch {
  enabled?: boolean;
  sweepEnabled?: boolean;
  niche?: string;
  topicTags?: string[];
  disclosureLine?: string;
  tone?: string;
  maxLinksPerReply?: number;
  allowSubreddits?: string[];
  denySubreddits?: string[];
  keywordsPerSweep?: number;
}

export interface RedditSweep {
  id: string;
  status: RedditSweepStatus;
  trigger: "cron" | "manual";
  keywordsUsed: string[];
  threadsSeen: number;
  opportunitiesCreated: number;
  error: string;
  startedAt: string;
  finishedAt: string | null;
}

export interface RedditBalance {
  balance: number;
  lifetimeSpent: number;
  periodEnd: string | null;
}

export interface RedditLedgerEntry {
  id: string;
  kind: RedditLedgerKind;
  credits: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
}

export interface RedditOverview {
  access: RedditAccess;
  /**
   * Whether a discovery provider is configured at all. False renders an
   * explicit "not switched on" card — never an empty table, which would read
   * as "we looked and found nothing".
   */
  providerConfigured: boolean;
  settings: RedditSettings | null;
  balance: RedditBalance;
  counts: {
    open: number;
    drafted: number;
    posted: number;
    liveMentions: number;
    blocked: number;
  };
  lastSweep: RedditSweep | null;
}

/**
 * Reddit archives posts at roughly six months, and an archived post cannot be
 * replied to. Subreddits can disable archiving, so a scraped `isArchived` flag
 * always wins over this number — it is the fallback, not the rule.
 */
export const ARCHIVE_DAYS = 180;

/**
 * Below this, the brand has nothing true to say in the thread. Like the
 * exchange's TOPICAL_FLOOR, "no opportunity" is a perfectly good outcome and
 * relaxing this to fill a table is the one thing this must never do.
 */
export const ANSWERABLE_FLOOR = 0.15;

/**
 * A reply shorter than this is a drive-by; longer than this is a blog post.
 * The floor is low on purpose — a good Reddit answer is often three sentences,
 * and padding one to clear a bar is how replies start reading like ads.
 */
export const MIN_DRAFT_CHARS = 120;
export const MAX_DRAFT_CHARS = 2500;

/** What one draft costs. Sweeps are free to the member; drafting is not. */
export const REDDIT_DRAFT_COST = 1;

/** Hard ceiling on re-asks for one draft, so a bad thread cannot drain a balance. */
export const MAX_DRAFT_REGENS = 3;
