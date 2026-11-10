/**
 * The studio page's focal scene: a studio's client roster over six months.
 * Each row is a site the studio built. Before launch the lane is the build
 * (hatched, the studio's own project); after launch it either goes quiet
 * (dashed, the usual handoff) or turns into a retainer, where Rankbox's
 * weekly articles stack up as small blue bars. The footer adds up the Studio
 * line from STUDIO.monthlyPerSite as each site joins.
 *
 * Every name is fictional and every week's bar stays inside the plan's
 * allowance; the window says Sample. It renders its last frame on the server
 * and under reduced motion (the whole half-year, four sites on retainer), and
 * only replays the half-year while at least half of it is on screen.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Flag, LayoutList, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUDIO, formatUsd } from "@/data/pricing";
import { studiosPage, type RosterClient } from "@/data/persona-pages/web-design-studios";
import { PlatformMark, SampleTag } from "./parts";
import { useHalfOnScreen } from "./helpers";

const R = studiosPage.roster;
const CLIENTS: readonly RosterClient[] = R.clients;

const WEEKS = 24;
/** The still frame: the whole window has passed. */
const END = WEEKS;
/** Where a replay starts: a month in, one site already on retainer. */
const START = 4;
const STEP_MS = 560;
/** Ticks held on the finished frame before the replay starts over. */
const HOLD = 6;

/* Bar heights for a retainer's weeks, as a share of the lane: a steady
   rhythm, roughly seven articles a week at the tallest, never past the plan. */
const RHYTHM = [0.62, 0.86, 0.72, 1, 0.68, 0.9, 0.78, 0.94];

function useRosterClock(run: boolean, reduce: boolean) {
  const [t, setT] = useState(END);
  useEffect(() => {
    if (reduce || !run) {
      setT(END);
      return;
    }
    let n = START;
    setT(n);
    const id = window.setInterval(() => {
      n = n >= END + HOLD ? START : n + 1;
      setT(Math.min(n, END));
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [run, reduce]);
  return t;
}

type Kind = "build" | "quiet" | "retainer" | "none";

function kindAt(c: RosterClient, w: number): Kind {
  if (c.build && w >= c.build.from && w <= c.build.to) return "build";
  if (c.retainerFrom !== undefined && w >= c.retainerFrom) return "retainer";
  if (c.quietFrom !== undefined && w >= c.quietFrom) return "quiet";
  return "none";
}

type Status = "retainer" | "build" | "quiet";

function statusAt(c: RosterClient, t: number): Status {
  if (c.retainerFrom !== undefined && c.retainerFrom < t) return "retainer";
  if (c.quietFrom !== undefined) return "quiet";
  return "build";
}

const STATUS_STYLE: Record<Status, string> = {
  retainer: "bg-cta-soft text-cta",
  build: "bg-ink/[0.05] text-ink/70",
  quiet: "border border-dashed border-ink/[0.18] text-muted-foreground",
};

function StatusChip({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.64rem] font-semibold transition-colors duration-500",
        STATUS_STYLE[status],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "retainer" ? "bg-cta" : status === "build" ? "bg-ink/40" : "bg-ink/20",
        )}
      />
      {R.status[status]}
    </span>
  );
}

/* A label over part of a lane, placed by week. */
function SegmentLabel({
  from,
  to,
  className,
  pill = false,
  children,
}: {
  from: number;
  to: number;
  className?: string;
  /** Set on the blue bars, whose tops vary: the label rides on white. */
  pill?: boolean;
  children: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-y-0 flex items-center overflow-hidden whitespace-nowrap px-1.5 text-[0.6rem] font-semibold sm:text-[0.64rem]",
        className,
      )}
      style={{ left: `${(from / WEEKS) * 100}%`, width: `${((to - from) / WEEKS) * 100}%` }}
    >
      {pill ? (
        <span className="truncate rounded-[4px] bg-white/95 px-1 py-px shadow-[0_1px_2px_rgba(4,24,72,0.18)]">
          {children}
        </span>
      ) : (
        children
      )}
    </span>
  );
}

function Lane({ client, t, reduce }: { client: RosterClient; t: number; reduce: boolean }) {
  const weeks = Array.from({ length: WEEKS }, (_, w) => w);
  const build = client.build;
  const launchAt = build && build.to + 1 < WEEKS ? build.to + 1 : null;
  const retainerPast = client.retainerFrom !== undefined ? Math.max(0, t - client.retainerFrom) : 0;
  const quietEnd = client.retainerFrom ?? WEEKS;
  const quietPast =
    client.quietFrom !== undefined ? Math.max(0, Math.min(t, quietEnd) - client.quietFrom) : 0;

  return (
    <div className="relative h-8">
      <div aria-hidden className="grid h-full grid-cols-[repeat(24,minmax(0,1fr))] gap-[2px]">
        {weeks.map((w) => {
          const kind = kindAt(client, w);
          const past = w < t;
          if (kind === "build") {
            return (
              <span
                key={w}
                className={cn(
                  "rounded-[3px] bg-ink/[0.05] bg-[repeating-linear-gradient(135deg,rgba(16,24,40,0.11)_0_1.5px,transparent_1.5px_5px)] transition-opacity duration-500",
                  !past && "opacity-45",
                )}
              />
            );
          }
          if (kind === "retainer") {
            const h = RHYTHM[w % RHYTHM.length];
            return (
              <span
                key={w}
                className={cn(
                  "flex items-end overflow-hidden rounded-[3px] transition-colors duration-500",
                  past ? "bg-cta-soft" : "bg-ink/[0.025]",
                )}
              >
                <span
                  className={cn(
                    "block w-full origin-bottom rounded-[2px] bg-cta",
                    !reduce &&
                      "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  )}
                  style={{ height: `${h * 100}%`, transform: `scaleY(${past ? 1 : 0})` }}
                />
              </span>
            );
          }
          if (kind === "quiet" && past) {
            return (
              <span key={w} className="rounded-[3px] border border-dashed border-ink/[0.16]" />
            );
          }
          return <span key={w} className="rounded-[3px] bg-ink/[0.025]" />;
        })}
      </div>

      {/* Segment names, where a segment is long enough to hold one. */}
      {build && build.to - build.from >= 5 && (
        <SegmentLabel from={build.from} to={build.to + 1} className="text-ink/60">
          {R.segments.build}
        </SegmentLabel>
      )}
      {quietPast >= 7 && client.quietFrom !== undefined && (
        <SegmentLabel
          from={client.quietFrom}
          to={client.quietFrom + quietPast}
          className="text-muted-foreground"
        >
          {R.segments.quiet}
        </SegmentLabel>
      )}
      {retainerPast >= 6 && client.retainerFrom !== undefined && (
        <SegmentLabel
          from={client.retainerFrom}
          to={client.retainerFrom + retainerPast}
          className="text-cta"
          pill
        >
          {R.segments.retainer}
        </SegmentLabel>
      )}

      {/* Launch flag, at the end of the build. */}
      {launchAt !== null && (
        <span
          aria-hidden
          className="absolute -top-1 bottom-0 w-px bg-ink/30"
          style={{ left: `calc(${(launchAt / WEEKS) * 100}% - 1px)` }}
        >
          <span
            className={cn(
              "absolute -left-[6px] -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/15 transition-colors duration-500",
              launchAt < t && "bg-ink text-white ring-ink",
            )}
          >
            <Flag className="h-2 w-2" strokeWidth={2.6} />
          </span>
        </span>
      )}

      {/* Today, per lane, so the line never crosses the labels. */}
      {t < END && (
        <span
          aria-hidden
          className={cn(
            "absolute -inset-y-1 w-[2px] rounded-full bg-cta/70",
            !reduce && "transition-[left] duration-500 ease-linear",
          )}
          style={{ left: `calc(${(t / WEEKS) * 100}% - 1px)` }}
        />
      )}
    </div>
  );
}

export function RosterScene() {
  const reduce = useReducedMotion() ?? false;
  const [ref, on] = useHalfOnScreen<HTMLElement>();
  const t = useRosterClock(on, reduce);

  const onRetainer = CLIENTS.filter((c) => c.retainerFrom !== undefined && c.retainerFrom < t);
  const n = onRetainer.length;
  const event = CLIENTS.find(
    (c) =>
      c.event &&
      c.retainerFrom !== undefined &&
      t > c.retainerFrom &&
      t - c.retainerFrom <= 4 &&
      t < END,
  );

  return (
    <figure ref={ref} className="relative mx-auto w-full max-w-5xl">
      {/* The event, floating over the window's corner. */}
      <div className="pointer-events-none absolute -top-3.5 right-3 z-10 sm:right-6">
        <AnimatePresence>
          {event && !reduce && (
            <motion.span
              key={event.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.7rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05),0_10px_24px_-14px_rgba(16,24,40,0.35)] sm:text-[0.74rem]"
            >
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-cta text-white">
                <Plus className="h-3 w-3" strokeWidth={2.6} />
              </span>
              {event.event}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-30px_rgba(16,24,40,0.3)]">
        {/* Window bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink/[0.07] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
              <LayoutList className="h-3.5 w-3.5" />
            </span>
            <span className="text-[0.86rem] font-semibold text-ink">{R.title}</span>
            <SampleTag />
          </div>
          <ul className="flex items-center gap-3 text-[0.66rem] text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-3.5 rounded-[3px] bg-ink/[0.05] bg-[repeating-linear-gradient(135deg,rgba(16,24,40,0.16)_0_1.5px,transparent_1.5px_4px)]" />
              {R.legend.build}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-3.5 rounded-[3px] border border-dashed border-ink/[0.22]" />
              {R.legend.quiet}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-3.5 rounded-[3px] bg-cta" />
              {R.legend.retainer}
            </li>
          </ul>
        </div>

        <div className="px-4 pb-2 pt-3 sm:px-5">
          {/* Month axis, over the lanes' column. */}
          <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[12.5rem_minmax(0,1fr)_7rem] md:gap-x-5">
            <span className="hidden md:block" />
            <div
              aria-hidden
              className="grid grid-cols-6 text-[0.62rem] font-medium uppercase tracking-[0.08em] text-muted-foreground"
            >
              {R.months.map((m, i) => (
                <span
                  key={m}
                  className={cn(
                    "border-l border-ink/[0.07] pl-1.5 transition-colors duration-300",
                    t < END && Math.floor(t / 4) === i && "text-cta",
                  )}
                >
                  {m}
                </span>
              ))}
            </div>
            <span className="hidden md:block" />
          </div>

          <ul className="mt-1">
            {CLIENTS.map((c) => (
              <li
                key={c.domain}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 border-b border-ink/[0.06] py-3 last:border-b-0 md:grid-cols-[12.5rem_minmax(0,1fr)_7rem] md:gap-x-5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <PlatformMark id={c.platform} className="h-6 w-6" />
                  <div className="min-w-0">
                    <p className="truncate text-[0.82rem] font-semibold leading-tight text-ink">
                      {c.name}
                    </p>
                    <p className="truncate text-[0.66rem] leading-tight text-muted-foreground">
                      {c.niche}
                      <span className="hidden font-mono sm:inline"> · {c.domain}</span>
                    </p>
                  </div>
                </div>
                <div className="order-3 col-span-2 md:order-none md:col-span-1">
                  <Lane client={c} t={t} reduce={reduce} />
                </div>
                <div className="justify-self-end md:justify-self-start">
                  <StatusChip status={statusAt(c, t)} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* The Studio line, added up from the sites on retainer. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-3 sm:px-5">
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {R.totalLabel}
          </span>
          <span className="text-[0.82rem] text-ink">
            <span className="font-semibold tabular-nums">
              {n} {n === 1 ? R.site : R.sites} × {formatUsd(STUDIO.monthlyPerSite)} ={" "}
              {formatUsd(n * STUDIO.monthlyPerSite)}
            </span>{" "}
            {R.perMonth}
            <span className="text-muted-foreground">, {R.planNote}</span>
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[0.72rem] text-muted-foreground">
        {R.caption}
      </figcaption>
    </figure>
  );
}
