/**
 * Small pieces every Reddit tab shares. The copy button, chip editor and field
 * wrapper are the exchange's — one set of form controls for the dashboard.
 */
import { ArrowBigUp, MessageSquare } from "lucide-react";
import { Pill } from "@/components/dashboard/primitives";
import { BrandMark } from "@/components/landing/shared";
import type { RedditReplyStatus } from "@/lib/data";
import { cn } from "@/lib/utils";
import { compactNumber, REPLY_STATUS, timeAgo } from "./format";

export { ChipInput, CopyButton, Field } from "@/components/dashboard/exchange/shared";

/** r/startups · u/tiny_team_tom — the line that opens every thread. */
export function SubredditLine({
  subreddit,
  author,
  className,
}: {
  subreddit: string;
  author?: string;
  className?: string;
}) {
  return (
    <p className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <BrandMark name="Reddit" className="h-4 w-4 shrink-0 rounded-full text-[0.5rem]" />
      <span className="font-semibold text-ink">r/{subreddit}</span>
      {author && <span className="truncate">· u/{author}</span>}
    </p>
  );
}

/**
 * Votes and comments. The arrow is the one place Reddit's orange appears in
 * the dashboard. When a thread was never hydrated we have no numbers, and we
 * say that instead of printing zeroes that look like a dead thread.
 */
export function ActivityStat({
  upVotes,
  numComments,
  partial,
  className,
}: {
  upVotes: number;
  numComments: number;
  partial?: boolean;
  className?: string;
}) {
  if (partial)
    return (
      <span
        className={cn("text-xs text-muted-foreground", className)}
        title="We found this thread in Google's results but haven't loaded it from Reddit yet."
      >
        Not fully loaded yet
      </span>
    );
  return (
    <span className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)}>
      <span className="flex items-center gap-0.5">
        <ArrowBigUp className="h-4 w-4 text-[#ff4500]" />
        <span className="font-semibold tabular-nums text-ink">{compactNumber(upVotes)}</span>
      </span>
      <span className="flex items-center gap-1">
        <MessageSquare className="h-3.5 w-3.5" />
        <span className="tabular-nums">{compactNumber(numComments)}</span>
      </span>
    </span>
  );
}

/** "· measured 3 days ago". Every piece of evidence carries one. */
export function MeasuredAt({ at, className }: { at: string; className?: string }) {
  return (
    <span className={cn("text-muted-foreground", className)} title={new Date(at).toLocaleString()}>
      · measured {timeAgo(at)}
    </span>
  );
}

export function ReplyStatusPill({ status }: { status: RedditReplyStatus }) {
  const s = REPLY_STATUS[status];
  return (
    <Pill tone={s.tone} className="whitespace-nowrap">
      <span title={s.hint}>{s.label}</span>
    </Pill>
  );
}
