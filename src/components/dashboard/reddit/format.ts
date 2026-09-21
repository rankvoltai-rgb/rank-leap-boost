/**
 * Plain values and helpers the Reddit tabs share. Kept apart from the
 * components in shared.tsx so fast refresh keeps working on both.
 */
import { isOpenOpportunity } from "@/lib/reddit/types";
import type { RedditOpportunity, RedditReplyStatus } from "@/lib/data";

export { inputClass } from "@/components/dashboard/exchange/format";

type Tone = "neutral" | "success" | "warning" | "info" | "danger" | "ink";

/**
 * A reply's status, in words that never claim more than we know. `claimed` is
 * the member's word and says so; only `confirmed` means we saw the comment.
 */
export const REPLY_STATUS: Record<RedditReplyStatus, { label: string; tone: Tone; hint: string }> =
  {
    claimed: {
      label: "Posted — unverified",
      tone: "neutral",
      hint: "You told us you posted this. Without a link to your comment we can't check it.",
    },
    posted: {
      label: "Checking",
      tone: "info",
      hint: "You gave us the link. We haven't confirmed the comment is there yet.",
    },
    confirmed: {
      label: "Live",
      tone: "success",
      hint: "We found your comment at the link you gave us.",
    },
    removed: {
      label: "Removed",
      tone: "danger",
      hint: "Your comment was there and no longer is — removed by a moderator, or deleted.",
    },
    not_found: {
      label: "Not found",
      tone: "warning",
      hint: "Three checks in a row couldn't find a comment at that link.",
    },
  };

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "3 days ago", "14 months ago". Coarse on purpose — these are not live counters. */
export function timeAgo(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const diff = Math.max(0, now - t);
  if (diff < HOUR) return diff < 2 * MINUTE ? "just now" : `${Math.floor(diff / MINUTE)} min ago`;
  if (diff < DAY) return plural(Math.floor(diff / HOUR), "hour") + " ago";
  const days = Math.floor(diff / DAY);
  if (days < 45) return plural(days, "day") + " ago";
  if (days < 548) return plural(Math.round(days / 30.44), "month") + " ago";
  return plural(Math.round(days / 365.25), "year") + " ago";
}

/** "3 days old" — for a thread's age. */
export function threadAge(iso: string | null | undefined, now = Date.now()): string {
  const ago = timeAgo(iso, now);
  if (!ago) return "age unknown";
  return ago === "just now" ? "just posted" : ago.replace(/ ago$/, " old");
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

/** The filters above the opportunities table. */
export type OpportunityFilter = "open" | "ranked" | "cited" | "fresh" | "drafted" | "blocked";

const FRESH_DAYS = 7;

export function matchesFilter(o: RedditOpportunity, filter: OpportunityFilter): boolean {
  const open = isOpenOpportunity(o);
  switch (filter) {
    case "open":
      return open;
    case "ranked":
      return open && o.thread.googlePosition !== null;
    case "cited":
      return open && o.thread.aiCitations.some((c) => c.cited);
    case "fresh": {
      const t = o.thread.postedAt ? Date.parse(o.thread.postedAt) : Number.NaN;
      return open && Number.isFinite(t) && Date.now() - t < FRESH_DAYS * DAY;
    }
    case "drafted":
      return open && o.status === "drafted";
    case "blocked":
      return Boolean(o.blockedReason) && o.status !== "posted" && o.status !== "dismissed";
  }
}
