/**
 * The replies the member has posted, and what we have measured about their
 * threads since. Everything on this tab is a dated observation. There is no
 * projected line, no estimate, and no "views" — Reddit shows a thread's view
 * count to nobody but its author, so it is not a number we can ever have.
 *
 * A trend is drawn only once there are enough points to be one. Before that
 * the tab says how many measurements it has, which is the true state of things.
 */
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { EmptyState, Panel } from "@/components/dashboard/primitives";
import { ThreadIcon } from "@/components/dashboard/icons";
import {
  isMeasuredReply,
  listRedditMentions,
  REDDIT_AI_ENGINE_LABELS,
  type RedditMention,
} from "@/lib/data";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { plural, timeAgo } from "./format";
import { ReplyStatusPill, SubredditLine } from "./shared";

/** Fewer points than this is a handful of readings, not a trend. */
const MIN_POINTS_FOR_TREND = 4;

interface TimelineEvent {
  at: string;
  text: string;
  tone: "ink" | "success" | "danger" | "muted";
}

function timelineOf(m: RedditMention): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const verified = m.reply.status !== "claimed";
  events.push({
    at: m.reply.postedAt,
    text: verified
      ? `You replied in r/${m.subreddit}`
      : `You told us you replied in r/${m.subreddit}`,
    tone: "ink",
  });
  if (m.reply.confirmedAt)
    events.push({ at: m.reply.confirmedAt, text: "We found your comment", tone: "success" });

  // Only changes are events: eight readings of "#2" are one fact, not eight.
  let last: number | null = null;
  for (const p of m.serpHistory) {
    if (p.position === last) continue;
    events.push({
      at: p.checkedAt,
      text:
        last === null
          ? `Thread measured at #${p.position} on Google for “${p.query}”`
          : `Thread moved from #${last} to #${p.position} on Google`,
      tone: last !== null && p.position < last ? "success" : "muted",
    });
    last = p.position;
  }

  for (const c of m.thread.aiCitations)
    if (c.cited)
      events.push({
        at: c.checkedAt,
        text: `${REDDIT_AI_ENGINE_LABELS[c.engine]} cited the thread for “${c.query}”`,
        tone: "success",
      });

  if (m.reply.removedAt)
    events.push({ at: m.reply.removedAt, text: "Your comment was removed", tone: "danger" });

  return events.sort((a, b) => a.at.localeCompare(b.at));
}

export function MentionsTab({ onOpen }: { onOpen: (opportunityId: string) => void }) {
  const { data: mentions } = useQuery({
    queryKey: ["reddit", "mentions"],
    queryFn: listRedditMentions,
    refetchInterval: 15_000,
  });

  if (!mentions) return <div className="skeleton h-64 w-full" />;

  if (mentions.length === 0)
    return (
      <EmptyState
        icon={<ThreadIcon className="h-5 w-5" />}
        title="Nothing posted yet"
        description="When you post a reply and give us the link to your comment, we re-check the thread every week and keep the dated record here."
      />
    );

  return (
    <div className="space-y-4">
      {mentions.map((m) => (
        <MentionCard key={m.reply.id} mention={m} onOpen={() => onOpen(m.reply.opportunityId)} />
      ))}
    </div>
  );
}

function MentionCard({ mention: m, onOpen }: { mention: RedditMention; onOpen: () => void }) {
  const events = timelineOf(m);
  const measured = isMeasuredReply(m.reply);
  const points = m.activity.length;

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <SubredditLine subreddit={m.subreddit} />
          <button
            type="button"
            onClick={onOpen}
            className="mt-1 text-left text-sm font-semibold leading-snug text-ink hover:underline"
          >
            {m.thread.title}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {m.reply.permalink && (
            <a
              href={m.reply.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-ink"
            >
              Your comment <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <ReplyStatusPill status={m.reply.status} />
        </div>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ol className="space-y-3 border-l border-border pl-4">
          {events.map((e, i) => (
            <li key={`${e.at}-${i}`} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.3rem] top-1.5 h-2 w-2 rounded-full ring-4 ring-card",
                  e.tone === "success" && "bg-success",
                  e.tone === "danger" && "bg-destructive",
                  e.tone === "ink" && "bg-ink",
                  e.tone === "muted" && "bg-border",
                )}
              />
              <p className="text-[0.7rem] text-muted-foreground" title={timeAgo(e.at)}>
                {formatShortDate(e.at)}
              </p>
              <p className="text-[13px] leading-snug text-ink">{e.text}</p>
            </li>
          ))}
        </ol>

        <div>
          {!measured ? (
            <Note>
              This reply is your word, not something we saw, so it stays out of every measured
              total. Add the link to your comment and we&rsquo;ll start tracking the thread.
            </Note>
          ) : points >= MIN_POINTS_FOR_TREND ? (
            <CommentsTrend mention={m} />
          ) : (
            <Note>
              We&rsquo;ve measured this thread {plural(points, "time")} since you posted. A trend
              needs a few more weeks — until then, a line here would be a guess.
            </Note>
          )}
        </div>
      </div>
    </Panel>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

/** Comments on the thread, at each date we looked. Points are joined, never smoothed. */
function CommentsTrend({ mention: m }: { mention: RedditMention }) {
  const pts = m.activity;
  const w = 320;
  const h = 84;
  const pad = 6;
  const t0 = Date.parse(pts[0].checkedAt);
  const t1 = Date.parse(pts[pts.length - 1].checkedAt);
  const max = Math.max(...pts.map((p) => p.numComments), 1);
  const x = (iso: string) => pad + ((Date.parse(iso) - t0) / Math.max(1, t1 - t0)) * (w - 2 * pad);
  const y = (n: number) => h - pad - (n / max) * (h - 2 * pad);
  const line = pts
    .map((p, i) => `${i ? "L" : "M"}${x(p.checkedAt).toFixed(1)},${y(p.numComments).toFixed(1)}`)
    .join(" ");
  const first = pts[0];
  const latest = pts[pts.length - 1];

  return (
    <figure>
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-ink">Comments on the thread</span>
        <span className="text-xs text-muted-foreground">{plural(pts.length, "measurement")}</span>
      </figcaption>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-2 h-auto w-full"
        role="img"
        aria-label={`Comments on the thread rose from ${first.numComments} to ${latest.numComments} across ${pts.length} measurements.`}
      >
        <path
          d={`${line} L${x(latest.checkedAt).toFixed(1)},${h - pad} L${pad},${h - pad} Z`}
          fill="#ff4500"
          opacity={0.08}
        />
        <path d={line} fill="none" stroke="#ff4500" strokeWidth={1.75} strokeLinejoin="round" />
        {pts.map((p) => (
          <circle
            key={p.checkedAt}
            cx={x(p.checkedAt)}
            cy={y(p.numComments)}
            r={2.25}
            fill="#ff4500"
          >
            <title>{`${p.numComments} comments · ${formatShortDate(p.checkedAt)}`}</title>
          </circle>
        ))}
      </svg>
      <p className="mt-1 flex justify-between text-[0.7rem] text-muted-foreground">
        <span>
          {first.numComments} · {formatShortDate(first.checkedAt)}
        </span>
        <span>
          {latest.numComments} · {formatShortDate(latest.checkedAt)}
        </span>
      </p>
    </figure>
  );
}
