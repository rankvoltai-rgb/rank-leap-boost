/**
 * The smaller pictures on /features/reddit-presence: the hand-off lanes, the
 * path a thread takes into an AI answer, the bento screens and the closing
 * thread. All decorative (their sections carry the words), all drawn from
 * sample.ts, and none of them shows Rankbox posting: where a reply goes out,
 * it goes out from "You", and Rankbox only finds it afterwards.
 */
import { Check, Copy, ExternalLink, Link2, Minus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleMark, PerplexityMark, RedditMark } from "@/components/landing/ai-logos";
import { AiChip, CARD, GoogleChip, SampleTag, Skeleton, SubLine } from "./atoms";
import {
  CREDITS,
  DISCLOSURE,
  RECORD,
  REPLY,
  REPORT_SUMMARY,
  RULES,
  THREADS,
  type RuleSample,
} from "./sample";

const ANSWER_START = REPLY.slice(DISCLOSURE.length + 1);

/** The reply as the pictures show it: the disclosure marked, then the answer. */
function ReplyText({ className }: { className?: string }) {
  return (
    <p className={cn("text-[0.72rem] leading-relaxed text-ink", className)}>
      <span className="rounded-[3px] bg-cta-soft font-medium [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
        {DISCLOSURE}
      </span>{" "}
      <span className="text-ink/80">{ANSWER_START}</span>
    </p>
  );
}

/* ---------- The hand-off lanes ---------- */

export function SurfacedMini() {
  return (
    <div className={cn(CARD, "space-y-1.5 p-2.5")}>
      {THREADS.slice(0, 3).map((t) => (
        <div
          key={t.title}
          className="flex items-center gap-2 rounded-lg border border-ink/[0.06] bg-white px-2.5 py-2"
        >
          <div className="min-w-0 flex-1">
            <SubLine sub={t.sub} />
            <p className="mt-0.5 truncate text-[0.7rem] font-medium text-ink">{t.title}</p>
          </div>
          {t.google ? (
            <GoogleChip google={t.google} />
          ) : (
            <span className="whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.62rem] font-medium text-muted-foreground ring-1 ring-ink/[0.07]">
              Not measured
            </span>
          )}
          <span className="w-6 text-right text-[0.68rem] font-semibold tabular-nums text-cta">
            {t.fit}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PickMini() {
  const t = THREADS[0];
  return (
    <div className={cn(CARD, "p-3")}>
      <SubLine sub={t.sub} meta={t.age} />
      <p className="mt-1 text-[0.74rem] font-semibold leading-snug text-ink">{t.title}</p>
      <span className="mt-2.5 inline-flex h-7 items-center rounded-md bg-cta px-2.5 text-[0.68rem] font-semibold text-white">
        Draft a reply · 1 credit
      </span>
      <p className="mt-1.5 text-[0.64rem] text-muted-foreground">
        {CREDITS} credits left this cycle
      </p>
    </div>
  );
}

export function DraftMini() {
  return (
    <div className={cn(CARD, "p-3")}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.68rem] font-semibold text-ink">Suggested reply</span>
        <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-cta">
          Draft · you review
        </span>
      </div>
      <ReplyText className="mt-2 line-clamp-3" />
      <p className="mt-2 border-t border-ink/[0.06] pt-2 text-[0.62rem] text-muted-foreground">
        {REPORT_SUMMARY}
      </p>
    </div>
  );
}

export function PostMini() {
  return (
    <div className={cn(CARD, "p-3")}>
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex h-7 items-center gap-1 rounded-md bg-cta px-2.5 text-[0.68rem] font-semibold text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
          Copied
        </span>
        <span className="inline-flex h-7 items-center gap-1 rounded-md border border-ink/[0.1] bg-white px-2.5 text-[0.68rem] font-medium text-ink">
          Open thread <ExternalLink className="h-3 w-3" />
        </span>
      </div>
      <p className="mt-2.5 flex items-start gap-1.5 text-[0.66rem] leading-snug text-muted-foreground">
        <Copy className="mt-px h-3 w-3 shrink-0" />
        Edited if you like, then posted from your own Reddit account.
      </p>
    </div>
  );
}

export function LinkMini() {
  return (
    <div className={cn(CARD, "p-3")}>
      <p className="text-[0.68rem] font-medium text-ink">
        Posted it? Paste the link to your comment
      </p>
      <div className="mt-2 flex h-8 items-center gap-1.5 rounded-md border border-ink/[0.1] bg-white px-2 text-[0.66rem] text-muted-foreground">
        <Link2 className="h-3 w-3 shrink-0" />
        <span className="truncate">reddit.com/r/{THREADS[0].sub}/comments/…</span>
      </div>
    </div>
  );
}

export function RecheckMini() {
  const rows = [RECORD.events[1], RECORD.events[3], RECORD.events[4]];
  return (
    <div className={cn(CARD, "p-3")}>
      <ul className="space-y-2">
        {rows.map((e) => (
          <li key={e.text} className="flex items-start gap-2">
            <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.68rem] font-medium text-ink">
                {e.text.replace(/ for “.*”$/, "")}
              </span>
              <span className="block text-[0.6rem] text-muted-foreground">{e.when}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- The path: a thread, on Google, in an answer ---------- */

const PATH_THREAD = THREADS[1];

export function PathThread() {
  const t = PATH_THREAD;
  return (
    <div className={cn(CARD, "min-h-[13rem] p-3.5")}>
      <div className="flex items-center justify-between gap-2">
        <SubLine sub={t.sub} meta={t.age} />
        <SampleTag className="shrink-0" />
      </div>
      <p className="mt-1.5 text-[0.8rem] font-semibold leading-snug text-ink">{t.title}</p>
      <p className="mt-1.5 text-[0.64rem] text-muted-foreground">
        ▲ {t.upvotes} · {t.comments} comments
      </p>
      <div className="mt-3 space-y-2.5 border-l-2 border-ink/[0.07] pl-3">
        <div className="space-y-1.5">
          <Skeleton className="w-14" />
          <Skeleton className="w-[90%]" />
          <Skeleton className="w-[70%]" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="w-12" />
          <Skeleton className="w-[80%]" />
        </div>
      </div>
    </div>
  );
}

export function PathSerp() {
  const t = PATH_THREAD;
  return (
    <div className={cn(CARD, "min-h-[13rem] p-3.5")}>
      <div className="flex items-center gap-2 rounded-full border border-ink/[0.1] px-3 py-1.5">
        <GoogleMark className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate text-[0.7rem] text-ink">{t.google!.query}</span>
        <Search className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
      </div>
      <ol className="mt-3 space-y-2">
        <li className="space-y-1.5 px-1 py-1">
          <Skeleton className="w-24" />
          <Skeleton className="h-2.5 w-[80%] bg-brand-blue/15" />
        </li>
        <li className="rounded-lg border border-cta/25 bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-2.5 py-2">
          <p className="flex items-center gap-1.5 text-[0.62rem] text-muted-foreground">
            <RedditMark className="h-3 w-3" />
            reddit.com › r/{t.sub}
          </p>
          <p className="mt-0.5 truncate text-[0.72rem] font-medium text-[#1a0dab]">{t.title}</p>
        </li>
        <li className="space-y-1.5 px-1 py-1">
          <Skeleton className="w-20" />
          <Skeleton className="h-2.5 w-[70%] bg-brand-blue/15" />
        </li>
      </ol>
    </div>
  );
}

export function PathAnswer() {
  return (
    <div className={cn(CARD, "min-h-[13rem] p-3.5")}>
      <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-ink">
        <PerplexityMark className="h-3.5 w-3.5" />
        Answer
      </p>
      <div className="mt-2.5 space-y-1.5">
        <Skeleton className="w-full" />
        <Skeleton className="w-[92%]" />
        <Skeleton className="w-[64%]" />
      </div>
      <p className="mt-3 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
        Sources
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.64rem] font-semibold text-cta ring-1 ring-cta/20">
          <RedditMark className="h-3 w-3" />
          reddit.com
        </span>
        <span className="h-[1.15rem] w-14 rounded-md ring-1 ring-ink/[0.08]" />
        <span className="h-[1.15rem] w-12 rounded-md ring-1 ring-ink/[0.08]" />
      </div>
    </div>
  );
}

/* ---------- Bento screens ---------- */

/** A white screen in a tinted panel, cropped by the panel's foot. */
function Screen({
  title,
  meta,
  children,
  className,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-4 top-6 mx-auto max-w-[30rem] rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-8 sm:top-8",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[0.78rem] font-semibold text-ink">{title}</p>
        {meta}
      </div>
      {children}
    </div>
  );
}

export function EvidenceScreen() {
  return (
    <Screen title="What we measured" meta={<SampleTag />}>
      <div className="space-y-1.5">
        {THREADS.slice(0, 3).map((t) => (
          <div key={t.title} className="rounded-lg border border-ink/[0.07] px-3 py-2">
            <SubLine sub={t.sub} meta={t.age} />
            <p className="mt-0.5 truncate text-[0.74rem] font-medium text-ink">{t.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <GoogleChip google={t.google} />
              {t.google && (
                <span className="text-[0.62rem] text-muted-foreground">
                  for “{t.google.query}” · {t.google.when}
                </span>
              )}
              <AiChip ai={t.ai} />
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

const VERDICT_STYLE: Record<RuleSample["state"], string> = {
  fail: "bg-[#e11d48]/10 text-[#be123c]",
  unknown: "bg-ink/[0.06] text-muted-foreground",
  pass: "bg-success/12 text-success",
};

const VERDICT_ICON = { fail: X, unknown: Minus, pass: Check } as const;

export function RulesScreen() {
  return (
    <Screen title="Subreddit rules, as read" meta={<SampleTag />}>
      <ul className="divide-y divide-ink/[0.06]">
        {RULES.map((r) => {
          const Icon = VERDICT_ICON[r.state];
          return (
            <li key={r.rule ?? "unread"} className="py-2 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <p
                  className={cn(
                    "text-[0.72rem] leading-snug",
                    r.rule ? "font-medium text-ink" : "italic text-muted-foreground",
                  )}
                >
                  {r.rule ? `“${r.rule}”` : "Rules couldn’t be read"}
                </p>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.6rem] font-semibold",
                    VERDICT_STYLE[r.state],
                  )}
                >
                  <Icon className="h-2.5 w-2.5" strokeWidth={3} />
                  {r.verdict}
                </span>
              </div>
              {r.state !== "pass" && (
                <p className="mt-0.5 line-clamp-2 text-[0.62rem] leading-snug text-muted-foreground">
                  {r.detail}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </Screen>
  );
}

const TONE: Record<(typeof RECORD.events)[number]["tone"], string> = {
  ink: "bg-ink/70",
  success: "bg-success",
  muted: "bg-ink/25",
};

/** Comment counts as dots on a line: only the readings, nothing projected. */
function Readings({ points }: { points: number[] }) {
  const W = 220;
  const H = 72;
  const max = Math.max(...points) * 1.1;
  const min = Math.min(...points) * 0.8;
  const xy = points.map((p, i) => [
    8 + (i * (W - 16)) / (points.length - 1),
    H - 8 - ((p - min) / (max - min)) * (H - 16),
  ]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[4.5rem] w-full" aria-hidden>
      <polyline
        points={xy.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        className="stroke-cta"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {xy.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" className="fill-white stroke-cta" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

export function RecordScreen() {
  return (
    <div className="absolute inset-x-4 top-6 mx-auto grid max-w-[44rem] gap-3 rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-8 sm:top-8 sm:grid-cols-[1.35fr_1fr] sm:gap-5">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <SubLine sub={RECORD.sub} />
            <p className="mt-0.5 truncate text-[0.76rem] font-semibold text-ink">{RECORD.title}</p>
          </div>
          <SampleTag className="shrink-0" />
        </div>
        <ol className="relative mt-3 space-y-2 border-l border-ink/[0.1] pl-4">
          {RECORD.events.map((e) => (
            <li key={e.text} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.29rem] top-1 h-2 w-2 rounded-full ring-4 ring-white",
                  TONE[e.tone],
                )}
              />
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {e.when}
              </p>
              <p className="text-[0.7rem] font-medium leading-snug text-ink">{e.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="hidden min-w-0 flex-col sm:flex">
        <div className="rounded-lg border border-ink/[0.07] p-3">
          <p className="text-[0.64rem] font-medium text-muted-foreground">Comments on the thread</p>
          <Readings points={RECORD.comments} />
          <p className="text-[0.6rem] text-muted-foreground">
            {RECORD.comments.length} readings, each dated
          </p>
        </div>
        <div className="mt-2.5 rounded-lg border border-ink/[0.07] p-3">
          <p className="text-[0.64rem] font-medium text-muted-foreground">Google position</p>
          <p className="mt-1 flex items-baseline gap-2 text-[1.1rem] font-semibold tabular-nums text-ink">
            #6
            <span className="text-[0.7rem] font-medium text-muted-foreground">→</span>
            <span className="text-success">#4</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- The closing thread ---------- */

/** The payoff: your reply, in the thread, posted by you. Rankbox only found it. */
export function ThreadPeek() {
  const t = THREADS[0];
  return (
    <div className="rounded-t-xl bg-white p-4 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <SubLine sub={t.sub} meta={t.age} />
        <SampleTag className="shrink-0" />
      </div>
      <p className="mt-1.5 text-[0.9rem] font-semibold leading-snug text-ink">{t.title}</p>
      <p className="mt-1 text-[0.72rem] leading-relaxed text-muted-foreground">{t.body}</p>
      <p className="mt-2 text-[0.64rem] text-muted-foreground">
        ▲ {t.upvotes} · {t.comments} comments
      </p>
      <div className="mt-3 border-l-2 border-cta/40 pl-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[0.6rem] font-semibold text-white">
            Y
          </span>
          <span className="text-[0.7rem] font-semibold text-ink">You</span>
          <span className="text-[0.64rem] text-muted-foreground">from your own account</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-success/12 px-1.5 py-0.5 text-[0.6rem] font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Live · we found your comment
          </span>
        </div>
        <ReplyText className="mt-2" />
      </div>
    </div>
  );
}
