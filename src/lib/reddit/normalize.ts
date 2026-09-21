/**
 * Turning scraper output into our shapes. Pure.
 *
 * The scraping actor is swappable by env var, and actors disagree about what
 * to call things: `upVotes` / `score` / `ups`, `numberOfComments` /
 * `num_comments`, `communityName: "r/startups"` / `subreddit: "startups"`. This
 * file is where that disagreement is absorbed, so nothing downstream knows
 * which actor ran.
 *
 * It is tolerant about NAMES and strict about MEANING. A field we cannot find
 * stays unknown — `isArchived` is null, not false, when no actor said — because
 * defaulting an absent fact to a convenient value is how a guess ends up on
 * screen looking like a measurement.
 */
import { parsePermalink } from "./permalink";
import type { RedditTopComment } from "./types";

export interface NormalizedPost {
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
  /** Null when the actor did not say. Never defaulted. */
  isArchived: boolean | null;
  isRemoved: boolean;
  topComments: RedditTopComment[];
}

export interface NormalizedComment {
  commentId: string;
  postId: string | null;
  author: string;
  body: string;
  score: number;
  isRemoved: boolean;
}

export interface SerpRedditHit {
  redditId: string;
  subreddit: string;
  permalink: string;
  title: string;
  position: number;
}

type Raw = Record<string, unknown>;

function isRecord(v: unknown): v is Raw {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function pick(raw: Raw, ...keys: string[]): unknown {
  for (const k of keys) if (raw[k] !== undefined && raw[k] !== null) return raw[k];
  return undefined;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
}

function int(v: unknown): number {
  const n =
    typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/[, ]/g, "")) : NaN;
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
}

/** True/false when the actor said so; null when it did not. */
function triState(v: unknown): boolean | null {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === 1) return true;
  if (v === "false" || v === 0) return false;
  return null;
}

function isoDate(v: unknown): string | null {
  if (typeof v === "number" && Number.isFinite(v)) {
    // Reddit's own `created_utc` is in seconds; some actors convert to ms.
    const ms = v < 1e12 ? v * 1000 : v;
    return new Date(ms).toISOString();
  }
  if (typeof v === "string" && v) {
    const t = Date.parse(v);
    if (Number.isFinite(t)) return new Date(t).toISOString();
  }
  return null;
}

const REMOVED_BODY = /^\[(?:removed|deleted)(?: by [^\]]+)?\]$/i;

function cleanSubreddit(v: unknown): string {
  return str(v)
    .replace(/^\/?r\//i, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

/** "t3_1abc23" → "1abc23". Reddit prefixes ids with their kind. */
function bareId(v: unknown): string {
  return str(v)
    .replace(/^t[0-9]_/i, "")
    .toLowerCase();
}

function canonicalPermalink(subreddit: string, redditId: string): string {
  return `https://www.reddit.com/r/${subreddit}/comments/${redditId}/`;
}

/**
 * One post from a scraper item, or null if it is not a post we can use. The
 * id and subreddit are taken from the URL when the item has one, because a URL
 * is the one field every actor agrees on.
 */
export function toRedditPost(raw: unknown): NormalizedPost | null {
  if (!isRecord(raw)) return null;
  const kind = str(pick(raw, "dataType", "type", "kind")).toLowerCase();
  if (kind && kind !== "post" && kind !== "t3" && kind !== "submission" && kind !== "link")
    return null;

  const parsed = parsePermalink(str(pick(raw, "url", "permalink", "postUrl", "link")));
  // A comment's URL parses too; an item that is really a comment is not a post.
  if (parsed?.commentId && !kind) return null;

  const redditId = parsed?.postId ?? bareId(pick(raw, "parsedId", "postId", "id", "name"));
  const subreddit =
    parsed?.subreddit ??
    cleanSubreddit(pick(raw, "parsedCommunityName", "communityName", "subreddit", "community"));
  if (!/^[a-z0-9]{2,12}$/.test(redditId) || !subreddit) return null;

  const title = str(pick(raw, "title"));
  const body = str(pick(raw, "body", "selftext", "text", "content"));
  const comments = pick(raw, "comments", "topComments");

  return {
    redditId,
    subreddit,
    permalink: canonicalPermalink(subreddit, redditId),
    title,
    body: REMOVED_BODY.test(body) ? "" : body,
    author: str(pick(raw, "username", "author", "authorName")).replace(/^u\//i, ""),
    upVotes: int(pick(raw, "upVotes", "score", "ups", "upvotes")),
    numComments: int(pick(raw, "numberOfComments", "num_comments", "numComments", "commentsCount")),
    postedAt: isoDate(pick(raw, "createdAt", "created_utc", "created", "postedAt", "date")),
    isLocked: triState(pick(raw, "locked", "isLocked")) ?? false,
    isArchived: triState(pick(raw, "archived", "isArchived")),
    isRemoved:
      (triState(pick(raw, "removed", "isRemoved")) ?? false) ||
      REMOVED_BODY.test(title) ||
      REMOVED_BODY.test(body) ||
      str(pick(raw, "removed_by_category", "removedByCategory")) !== "",
    topComments: Array.isArray(comments) ? toTopComments(comments) : [],
  };
}

/** A comment from a scraper item, or null. */
export function toRedditComment(raw: unknown): NormalizedComment | null {
  if (!isRecord(raw)) return null;
  const kind = str(pick(raw, "dataType", "type", "kind")).toLowerCase();
  if (kind && kind !== "comment" && kind !== "t1") return null;

  const parsed = parsePermalink(str(pick(raw, "url", "permalink", "commentUrl")));
  const commentId = parsed?.commentId ?? bareId(pick(raw, "parsedId", "commentId", "id", "name"));
  if (!/^[a-z0-9]{2,12}$/.test(commentId)) return null;

  const body = str(pick(raw, "body", "text", "content"));
  const author = str(pick(raw, "username", "author")).replace(/^u\//i, "");
  return {
    commentId,
    postId: parsed?.postId ?? (bareId(pick(raw, "postId", "parentId", "link_id")) || null),
    author,
    body,
    score: int(pick(raw, "upVotes", "score", "ups")),
    isRemoved: REMOVED_BODY.test(body) || author === "[deleted]",
  };
}

/** The few highest-voted comments worth showing a writer as context. */
export function toTopComments(items: unknown[], limit = 5): RedditTopComment[] {
  const out: RedditTopComment[] = [];
  for (const item of items) {
    const c = toRedditComment(item);
    if (!c || c.isRemoved || c.body.length < 12) continue;
    out.push({ author: c.author, body: c.body.slice(0, 600), score: c.score });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Splits one actor run's mixed items into posts, with each post's comments
 * attached. Actors return comments as separate items alongside their post.
 */
export function groupScrape(items: unknown[]): NormalizedPost[] {
  const posts = new Map<string, NormalizedPost>();
  const comments = new Map<string, unknown[]>();
  for (const item of items) {
    const post = toRedditPost(item);
    if (post) {
      if (!posts.has(post.redditId)) posts.set(post.redditId, post);
      continue;
    }
    const c = toRedditComment(item);
    if (c?.postId) comments.set(c.postId, [...(comments.get(c.postId) ?? []), item]);
  }
  for (const [postId, list] of comments) {
    const post = posts.get(postId);
    if (post && post.topComments.length === 0) post.topComments = toTopComments(list);
  }
  return [...posts.values()];
}

/**
 * The Reddit THREADS in one Google results page, with their measured
 * positions. A subreddit's front page or a user profile is not a thread and is
 * dropped; so is anything that only looks like Reddit.
 */
export function redditResultsOf(organic: unknown): SerpRedditHit[] {
  if (!Array.isArray(organic)) return [];
  const hits = new Map<string, SerpRedditHit>();
  organic.forEach((item, index) => {
    if (!isRecord(item)) return;
    const parsed = parsePermalink(str(pick(item, "url", "link")));
    if (!parsed?.subreddit) return;
    const position = int(pick(item, "position", "rank")) || index + 1;
    if (position < 1 || position > 100) return;
    // A thread can appear twice (the post and a deep-linked comment). Keep the
    // better position: that is where a searcher meets it first.
    const prev = hits.get(parsed.postId);
    if (prev && prev.position <= position) return;
    hits.set(parsed.postId, {
      redditId: parsed.postId,
      subreddit: parsed.subreddit,
      permalink: canonicalPermalink(parsed.subreddit, parsed.postId),
      title: str(pick(item, "title"))
        .replace(/\s*[:|-]\s*r\/\S+\s*$/i, "")
        .replace(/\s*-\s*Reddit\s*$/i, ""),
      position,
    });
  });
  return [...hits.values()].sort((a, b) => a.position - b.position);
}

/** Every reddit.com thread URL mentioned in an AI engine's answer or its sources. */
export function redditIdsCitedIn(answer: unknown): Set<string> {
  const found = new Set<string>();
  const visit = (v: unknown, depth: number) => {
    if (depth > 6) return;
    if (typeof v === "string") {
      for (const m of v.matchAll(/https?:\/\/(?:[a-z0-9-]+\.)?reddit\.com\/[^\s"'<>)\]]+/gi)) {
        const p = parsePermalink(m[0]);
        if (p) found.add(p.postId);
      }
    } else if (Array.isArray(v)) v.forEach((x) => visit(x, depth + 1));
    else if (isRecord(v)) Object.values(v).forEach((x) => visit(x, depth + 1));
  };
  visit(answer, 0);
  return found;
}

/* ── AI engine answers ──────────────────────────────────────────── */

export type AiEngineName = "chatgpt" | "perplexity" | "gemini" | "google_ai_overview";

function engineFrom(label: string): AiEngineName | null {
  const s = label.toLowerCase();
  if (/chat\s*gpt|openai/.test(s)) return "chatgpt";
  if (/perplexity/.test(s)) return "perplexity";
  if (/gemini/.test(s)) return "gemini";
  if (/overview|ai\s*_?mode|aimode/.test(s)) return "google_ai_overview";
  return null;
}

/**
 * The AI-engine answers inside one SERP item. Found by SHAPE — an object with
 * answer text or a sources list — rather than by key name, because the add-ons'
 * output keys are the least settled part of the actor. An answer we cannot
 * attribute to an engine is dropped: a citation with no named source is not
 * something we would show.
 */
export function aiResultsOf(item: unknown): Array<{ engine: AiEngineName; payload: Raw }> {
  if (!isRecord(item)) return [];
  const out = new Map<AiEngineName, Raw>();
  for (const [key, value] of Object.entries(item)) {
    if (!isRecord(value)) continue;
    const looksLikeAnswer =
      typeof value.text === "string" ||
      typeof value.content === "string" ||
      Array.isArray(value.sources);
    if (!looksLikeAnswer) continue;
    const engine =
      engineFrom(str(value.engine)) ?? engineFrom(str(value.provider)) ?? engineFrom(key);
    if (engine && !out.has(engine)) out.set(engine, value);
  }
  return [...out].map(([engine, payload]) => ({ engine, payload }));
}

/** A short excerpt of an answer, for the tooltip on a citation badge. */
export function answerSnippet(payload: unknown, max = 240): string {
  if (!isRecord(payload)) return "";
  const text = str(pick(payload, "text", "content", "answer")).replace(/\s+/g, " ");
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** The query a SERP item answers, and which results page it is. */
export function serpQueryOf(item: unknown): { term: string; page: number } {
  if (!isRecord(item) || !isRecord(item.searchQuery)) return { term: "", page: 1 };
  return { term: str(item.searchQuery.term), page: Math.max(1, int(item.searchQuery.page) || 1) };
}

/**
 * A result's position across pages. Some actors number each page from 1; a
 * "position 3" on page 2 is really 13. A position already past the page's
 * start is taken as absolute and left alone.
 */
export function absolutePosition(position: number, page: number, perPage = 10): number {
  const start = (page - 1) * perPage;
  return position > start ? position : start + position;
}

/* ── Subreddits ─────────────────────────────────────────────────── */

export interface NormalizedSubreddit {
  name: string;
  title: string;
  publicDescription: string;
  subscribers: number | null;
  over18: boolean;
  rules: string[];
  /** False when the scrape came back without any rules we could read. */
  rulesFound: boolean;
}

function ruleText(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (!isRecord(v)) return "";
  const name = str(pick(v, "short_name", "shortName", "title", "name", "violation_reason"));
  const detail = str(pick(v, "description", "body", "text"));
  return [name, detail].filter(Boolean).join(" — ").slice(0, 600);
}

/**
 * A subreddit from a scrape. `rulesFound` is the honest part: an actor that
 * returns a community with no rules field has NOT told us the subreddit has no
 * rules, and the caller must store that as "unavailable", never as "none".
 */
export function toSubredditInfo(items: unknown[], name: string): NormalizedSubreddit | null {
  const wanted = cleanSubreddit(name);
  let best: NormalizedSubreddit | null = null;
  for (const item of items) {
    if (!isRecord(item)) continue;
    const kind = str(pick(item, "dataType", "type", "kind")).toLowerCase();
    const itemName = cleanSubreddit(
      pick(item, "parsedCommunityName", "communityName", "displayName", "display_name", "name"),
    );
    const rawRules = pick(item, "rules", "communityRules");
    const isCommunity = kind === "community" || kind === "subreddit" || kind === "t5";
    if (!isCommunity && !Array.isArray(rawRules)) continue;
    if (itemName && itemName !== wanted) continue;

    const rules = Array.isArray(rawRules) ? rawRules.map(ruleText).filter(Boolean) : [];
    const members = pick(item, "numberOfMembers", "subscribers", "members", "membersCount");
    const info: NormalizedSubreddit = {
      name: wanted,
      title: str(pick(item, "title", "displayName")),
      publicDescription: str(
        pick(item, "description", "public_description", "publicDescription"),
      ).slice(0, 1000),
      subscribers: members === undefined ? null : int(members),
      over18: triState(pick(item, "over18", "over_18", "isNsfw")) ?? false,
      rules,
      rulesFound: rules.length > 0,
    };
    if (!best || (info.rulesFound && !best.rulesFound)) best = info;
  }
  return best;
}

/* ── Keyword attribution ────────────────────────────────────────── */

/**
 * Which tracked keyword a thread most plausibly answers. Reddit-search results
 * come back without the query that found them, so this recovers it from the
 * title. Falls back to the first keyword: the sweep only ran for these.
 */
export function bestKeywordFor(title: string, keywords: string[]): string {
  const words = new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3),
  );
  let best = keywords[0] ?? "";
  let bestScore = 0;
  for (const k of keywords) {
    const parts = k
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3);
    if (parts.length === 0) continue;
    const score = parts.filter((w) => words.has(w)).length / parts.length;
    if (score > bestScore) {
      best = k;
      bestScore = score;
    }
  }
  return best;
}
