/**
 * The focal picture of /use-cases/marketers: a content calendar that fills as
 * the reader approves scored drafts, until the backlog is empty. It plays the
 * page's own headline, "Fill the calendar, not the backlog", on the surface a
 * marketer already plans in.
 *
 * Drawn the way the landing draws Rankbox: a white window with hairline
 * borders and a soft shadow, soft blue for whatever was just placed, solid
 * blue only on the one button that is the reader's to press.
 *
 * Every title and score is a sample, and the window says so. The site is
 * "yoursite.com", as on the landing's dashboard, so no real company stands in
 * as a customer. Nothing here is an outcome: no traffic, rankings, or
 * citations, only drafts, scores, and dates.
 *
 * Motion: the loop runs only while about half the scene is on screen, and
 * starts over from its first frame when it comes back. The first render is
 * always that first frame, so server and client agree. Under reduced motion
 * it holds the most telling frame: the calendar nearly full, one draft
 * waiting on the reader's call.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, MousePointer2, PenLine, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";

const EASE = [0.16, 1, 0.3, 1] as const;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
/* Two working weeks: Mon 12 to Fri 23. */
const DATES = [12, 13, 14, 15, 16, 19, 20, 21, 22, 23];
/** Wednesday the 14th. Slots up to today are live; the rest are queued. */
const TODAY = 2;

/* A sample site's queue. Generic topics, no brand: the reader's own map
   would be built from their site. */
const DRAFTS = [
  { title: "How to run payroll for a remote team", score: 94 },
  { title: "Contractor or employee: what changes", score: 91 },
  { title: "An onboarding checklist for new hires", score: 96 },
  { title: "How to write a leave policy", score: 92 },
  { title: "PTO accrual, explained simply", score: 95 },
  { title: "Payroll software pricing, compared", score: 90 },
  { title: "A year-end payroll checklist", score: 93 },
  { title: "How to switch payroll providers", score: 94 },
  { title: "Benefits basics for small teams", score: 91 },
  { title: "Running payroll in two countries", score: 96 },
];

/** Already on the calendar when the scene opens. */
const START = 3;
const PLACING = (DRAFTS.length - START) * 2;
/* Two steps a draft (waiting, then pressed), a beat on the full calendar,
   a held beat, and a last step that fades the new slots before the loop. */
const STEPS = PLACING + 3;
/** The reduced-motion frame: one draft left, waiting on the reader. */
const REST = PLACING - 2;

function durationOf(t: number) {
  if (t === PLACING) return 1700;
  if (t === PLACING + 1) return 1500;
  if (t === PLACING + 2) return 700;
  return t % 2 === 0 ? 1450 : 650;
}

function useCalendarTimeline(run: boolean, reduce: boolean | null) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduce) {
      setT(REST);
      return;
    }
    if (!run) {
      // Off screen: start over from the first frame next time.
      setT(0);
      return;
    }
    let cur = 0;
    let id = 0;
    const tick = () => {
      id = window.setTimeout(() => {
        cur = (cur + 1) % STEPS;
        setT(cur);
        tick();
      }, durationOf(cur));
    };
    tick();
    return () => window.clearTimeout(id);
  }, [run, reduce]);
  return t;
}

/* ---------- Parts ---------- */

function SampleTag() {
  return (
    <span className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      Sample
    </span>
  );
}

/** A score ring, green: the draft cleared the pre-publish bar. */
function ScoreRing({ value, size = 40 }: { value: number; size?: number }) {
  const stroke = 3.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-ink/[0.07]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          className="stroke-success transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[0.72rem] font-semibold tabular-nums text-ink">
        {value}
      </span>
    </span>
  );
}

function BacklogChip({ backlog }: { backlog: number }) {
  return backlog > 0 ? (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#fdf4e4] px-2 py-1 text-[0.68rem] font-semibold tabular-nums text-[#b45309]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
      Backlog {backlog}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-[0.68rem] font-semibold text-success">
      <Check className="h-3 w-3" strokeWidth={3} />
      Backlog clear
    </span>
  );
}

/* One slot on the calendar: a draft with a date, or an open day. */
function Slot({
  index,
  filled,
  latest,
  fading,
  still,
}: {
  index: number;
  filled: boolean;
  latest: boolean;
  fading: boolean;
  still: boolean;
}) {
  const draft = DRAFTS[index];
  const live = index <= TODAY;
  const today = index === TODAY;
  return (
    <div
      className={cn(
        "relative flex min-h-0 min-w-0 flex-col rounded-lg p-1 transition-[background-color,border-color] duration-500 sm:p-1.5",
        filled ? "border border-ink/[0.06] bg-[#f7f9fc]" : "border border-dashed border-ink/[0.12]",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-semibold tabular-nums sm:h-[1.1rem] sm:w-[1.1rem]",
          today ? "bg-cta text-white" : "text-muted-foreground",
        )}
      >
        {DATES[index]}
      </span>
      {filled ? (
        <motion.div
          // Drafts on the calendar from the start render in place, so the
          // server's markup is already the first frame.
          initial={index < START || still ? false : { opacity: 0, scale: 0.86, y: 6 }}
          animate={{ opacity: fading ? 0 : 1, scale: 1, y: 0 }}
          transition={{ duration: fading ? 0.5 : 0.55, ease: EASE }}
          className={cn(
            "mt-1 flex min-h-0 flex-1 flex-col rounded-md border bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[border-color,box-shadow,background-color] duration-700 sm:p-1.5",
            latest
              ? "border-cta/40 bg-cta-soft shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_10%,transparent)]"
              : "border-ink/[0.07]",
          )}
        >
          <span className="hidden text-[0.6rem] font-medium leading-[1.3] text-ink sm:line-clamp-3">
            {draft.title}
          </span>
          <span className="mt-0.5 flex flex-col gap-1 sm:hidden">
            <span className="h-1 w-full rounded-full bg-ink/[0.08]" />
            <span className="h-1 w-2/3 rounded-full bg-ink/[0.08]" />
          </span>
          <span className="mt-auto flex items-center justify-between gap-1 pt-1">
            <span
              className={cn(
                "flex items-center gap-1 text-[0.5rem] font-semibold uppercase tracking-[0.06em] sm:text-[0.54rem]",
                live ? "text-success" : "text-cta",
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-success" : "bg-cta")}
                aria-hidden
              />
              <span className="hidden min-[440px]:inline">{live ? "Live" : "Queued"}</span>
            </span>
            <span className="hidden text-[0.56rem] font-semibold tabular-nums text-muted-foreground sm:inline">
              {draft.score}
            </span>
          </span>
        </motion.div>
      ) : (
        <span className="flex flex-1 items-center justify-center text-ink/20">
          <Plus className="h-3 w-3" />
        </span>
      )}
    </div>
  );
}

/** The calendar window. `filled` slots carry a draft; the rest are open. */
export function CalendarWindow({
  filled,
  latest = -1,
  fading = false,
  room = false,
  still = false,
  className,
}: {
  filled: number;
  /** The slot that was just placed, shown selected. */
  latest?: number;
  /** Fade the slots placed during the loop, before it starts over. */
  fading?: boolean;
  /** Leave a foot under the grid for a card laid over the window's edge. */
  room?: boolean;
  /** Place drafts without the pop-in: reduced motion, or a still picture. */
  still?: boolean;
  className?: string;
}) {
  const backlog = DRAFTS.length - filled;
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.28)]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-3.5 py-2.5 sm:px-4">
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta text-white">
            <Mark className="h-3.5 w-3.5" />
          </span>
          <span className="truncate text-[0.8rem] font-semibold text-ink">Content calendar</span>
          <SampleTag />
        </span>
        <span className="hidden shrink-0 rounded-md border border-ink/[0.07] px-2 py-0.5 text-[0.68rem] text-muted-foreground min-[440px]:inline">
          yoursite.com/blog
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3.5 pt-3 sm:px-4">
        <span className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] text-muted-foreground">
            <ChevronLeft className="h-3.5 w-3.5" />
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] text-muted-foreground">
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
          <span className="ml-1 text-[0.82rem] font-semibold tabular-nums text-ink">
            Oct 12 – 23
          </span>
        </span>
        <span className="hidden items-center rounded-md border border-ink/[0.08] p-0.5 text-[0.66rem] font-medium md:flex">
          <span className="px-2 py-0.5 text-muted-foreground">Week</span>
          <span className="rounded bg-cta-soft px-2 py-0.5 text-cta">2 weeks</span>
          <span className="px-2 py-0.5 text-muted-foreground">Month</span>
        </span>
        <BacklogChip backlog={backlog} />
      </div>

      {/* Grid */}
      <div className="flex min-h-0 flex-1 flex-col px-3.5 pt-2.5 sm:px-4">
        <div className="grid grid-cols-5 gap-1 text-center text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:gap-1.5">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-1.5 grid flex-1 grid-cols-5 grid-rows-2 gap-1 sm:gap-1.5">
          {DATES.map((date, i) => (
            <Slot
              key={date}
              index={i}
              filled={i < filled}
              latest={i === latest}
              fading={fading && i >= START}
              still={still}
            />
          ))}
        </div>
      </div>

      {/* Foot: the key, right-aligned, clear of any card laid over the left. */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-end gap-3 px-3.5 text-[0.62rem] text-muted-foreground sm:px-4",
          room ? "h-12 sm:h-14" : "h-10",
        )}
      >
        <span className={cn("items-center gap-1.5", room ? "hidden sm:flex" : "flex")}>
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Live
        </span>
        <span className={cn("items-center gap-1.5", room ? "hidden sm:flex" : "flex")}>
          <span className="h-1.5 w-1.5 rounded-full bg-cta" />
          Queued
        </span>
        <span className={cn("items-center gap-1.5", room ? "hidden" : "flex")}>
          <span className="h-2 w-2 rounded-[3px] border border-dashed border-ink/25" />
          Open
        </span>
      </div>
    </div>
  );
}

/* The approve queue: the one thing in the picture that waits for the reader. */
function ApproveCard({
  filled,
  pressing,
  still,
}: {
  filled: number;
  pressing: boolean;
  still: boolean;
}) {
  const backlog = DRAFTS.length - filled;
  const next = DRAFTS[filled];
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_18px_40px_-18px_rgba(16,24,40,0.35)] sm:p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {next ? "Draft ready · your call" : "Approve queue"}
        </span>
        {backlog > 0 && (
          <span className="text-[0.62rem] font-medium tabular-nums text-muted-foreground">
            {backlog} waiting
          </span>
        )}
      </div>
      {next ? (
        <motion.div
          key={filled}
          initial={filled === START || still ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="mt-2.5 flex items-center gap-3"
        >
          <ScoreRing value={next.score} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.8rem] font-semibold text-ink">{next.title}</p>
            <p className="mt-0.5 truncate text-[0.64rem] text-muted-foreground">
              SEO + GEO scored · sourced · your voice
            </p>
          </div>
          <span
            title="Edit"
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md border border-ink/[0.1] bg-white text-ink min-[440px]:inline-flex"
          >
            <PenLine className="h-3 w-3" />
          </span>
          <span className="relative shrink-0">
            <span
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-md bg-cta px-2.5 text-[0.68rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[transform,background-color] duration-200",
                pressing && "scale-[0.92] bg-cta-hover",
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
              Approve
            </span>
            <MousePointer2
              aria-hidden
              strokeWidth={1.5}
              className={cn(
                "absolute -bottom-3 right-0.5 h-4 w-4 fill-ink text-white drop-shadow transition-transform duration-300 ease-out",
                pressing
                  ? "translate-x-0 translate-y-0 scale-90"
                  : "translate-x-2.5 translate-y-2.5",
              )}
            />
          </span>
        </motion.div>
      ) : (
        <motion.div
          initial={still ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="mt-2.5 flex items-center gap-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.8rem] font-semibold text-ink">Every draft has a date</p>
            <p className="mt-0.5 text-[0.64rem] text-muted-foreground">
              Nothing went on the calendar you didn&rsquo;t approve.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- The scene ---------- */

export function CalendarScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const t = useCalendarTimeline(inView, reduce);

  const filled = Math.min(DRAFTS.length, START + Math.floor(t / 2));
  const fading = t === STEPS - 1;
  const pressing = t % 2 === 1 && filled < DRAFTS.length;
  const latest = t > 0 && filled > START && !fading ? filled - 1 : -1;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Sample content calendar for yoursite.com: each scored draft you approve takes the next open publishing slot, until the backlog is empty."
      className={cn("relative", className)}
    >
      <CalendarWindow
        filled={filled}
        latest={latest}
        fading={fading}
        room
        still={!!reduce}
        className="h-[20rem] sm:ml-6 sm:h-[24rem]"
      />
      {/* Overlaps the window's foot and steps out past its left edge. */}
      <div className="relative z-10 -mt-9 ml-2 mr-2 sm:-mt-11 sm:ml-0 sm:mr-0 sm:w-[24rem]">
        <ApproveCard filled={filled} pressing={pressing} still={!!reduce} />
      </div>
    </div>
  );
}

/** The calendar with every slot taken, for the closing band. Still. */
export function CalendarFull({ className }: { className?: string }) {
  return <CalendarWindow filled={DRAFTS.length} still className={className} />;
}
