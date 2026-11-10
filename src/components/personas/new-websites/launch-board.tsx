/**
 * The focal picture of /use-cases/new-websites: a brand-new site's launch
 * plan, counted down to launch day and a few weeks past it.
 *
 * Three parts, in one window labelled Sample. The site map is what the site
 * has: four pages that aren't public yet, then a /guides/ folder that fills
 * as answers are written. The answer queue is the same articles with their
 * dates, scores and state: written ahead before launch, live from launch
 * day, scheduled after it. The runway under both is the page's honest line
 * drawn as a picture: Rankbox's lane is dots on dates you set, and Google's
 * lane is a hatched band from launch day on, crawling on its own schedule,
 * with no number on it, because there isn't one we can show.
 *
 * The site is fictional (Sprigwell, on a reserved .example domain) and the
 * scores are sample numbers. Nothing here is a ranking, a visit or a
 * citation.
 *
 * Motion: one step per date. It runs only while about half the window is on
 * screen, starts over when it leaves, and holds its most telling frame
 * under reduced motion. The first render is always the opening frame, so the
 * server and the client agree.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CalendarClock, Check, FileText, Flag, Folder, FolderOpen } from "lucide-react";
import { NEW_SITES, type LaunchAnswer } from "@/data/persona-pages/new-websites";
import { cn } from "@/lib/utils";
import { SampleTag, SiteTile } from "./parts";
import { EASE, HATCH, RUNWAY_FROM, RUNWAY_TO, SCREEN, runwayX } from "./tokens";

const SAMPLE = NEW_SITES.sample;

/* One entry per date the loop stops on: "today", in days from launch, and
   how long it holds there. */
const STEPS = [
  { today: -10, ms: 1500 },
  { today: -9, ms: 1500 },
  { today: -7, ms: 1400 },
  { today: -5, ms: 1400 },
  { today: -2, ms: 1700 },
  { today: 0, ms: 2800 },
  { today: 4, ms: 1700 },
  { today: 9, ms: 1700 },
  { today: 16, ms: 4400 },
] as const;
/* The frame held under reduced motion: nine days after launch, the early
   answers live and the last one still scheduled, so every state shows. */
const REST = 7;

type State = "planned" | "written" | "live" | "scheduled";

interface Row extends LaunchAnswer {
  state: State;
  /** Changed on this step: held in soft blue. */
  fresh: boolean;
}

/* Every answer is on the plan from the first frame, so the queue never
   jumps: research has found the questions, and the loop only moves each
   one along. Written ahead before launch, live from launch day; the later
   ones are scheduled at launch and go live on their dates. */
function stateAt(a: LaunchAnswer, today: number): State {
  if (a.phase === "pre") return today < a.day ? "planned" : today < 0 ? "written" : "live";
  return today < 0 ? "planned" : today < a.day ? "scheduled" : "live";
}

function rowsAt(step: number): Row[] {
  const today = STEPS[step].today;
  const before = step > 0 ? STEPS[step - 1].today : null;
  return SAMPLE.answers.map((a) => {
    const state = stateAt(a, today);
    return { ...a, state, fresh: before !== null && stateAt(a, before) !== state };
  });
}

/** "Day −9", "Launch", "Day 4": the minus is a real one. */
function dayLabel(day: number) {
  if (day === 0) return "Launch";
  return `Day ${day < 0 ? "−" : "+"}${Math.abs(day)}`;
}

function countdown(today: number) {
  if (today < 0) return `Launch in ${-today} days`;
  if (today === 0) return "Launch day";
  return `${today} days after launch`;
}

function StateChip({ state }: { state: State }) {
  if (state === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-success/12 px-1.5 py-0.5 text-[0.62rem] font-semibold text-success">
        <Check className="h-3 w-3" strokeWidth={2.6} />
        Live
      </span>
    );
  }
  if (state === "scheduled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
        <CalendarClock className="h-3 w-3" />
        Scheduled
      </span>
    );
  }
  if (state === "written") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.62rem] font-medium text-ink/75">
        <FileText className="h-3 w-3" />
        Written
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-ink/[0.14] px-1.5 py-0.5 text-[0.62rem] font-medium text-muted-foreground">
      Planned
    </span>
  );
}

/* ---------- The site map ---------- */

function SiteMap({ today, rows: all }: { today: number; rows: Row[] }) {
  const isPublic = today >= 0;
  const rows = all.filter((r) => r.state !== "planned");
  const live = rows.filter((r) => r.state === "live").length;
  const pages = (isPublic ? SAMPLE.pages.length : 0) + live;
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-baseline justify-between gap-3 px-4 pb-2 pt-3.5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Site map
        </p>
        <p className="text-[0.68rem] tabular-nums text-muted-foreground">
          <span className="font-semibold text-ink">{pages}</span> public{" "}
          {pages === 1 ? "page" : "pages"}
        </p>
      </div>
      <ul className="px-2 pb-3 font-mono text-[0.7rem] leading-none">
        {SAMPLE.pages.map((p) => (
          <li key={p.path} className="flex items-center gap-2 rounded-md px-2 py-[0.45rem]">
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500",
                isPublic ? "bg-success" : "bg-ink/20",
              )}
            />
            <span className="text-ink/80">{p.path}</span>
            <span className="ml-auto font-sans text-[0.66rem] text-muted-foreground">
              {isPublic ? p.label : "Not public"}
            </span>
          </li>
        ))}
        <li className="mt-0.5 flex items-center gap-2 rounded-md px-2 py-[0.45rem]">
          {rows.length > 0 ? (
            <FolderOpen className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
          ) : (
            <Folder className="h-3.5 w-3.5 shrink-0 text-ink/35" />
          )}
          <span className="text-ink">/guides/</span>
          <span className="ml-auto rounded bg-ink/[0.04] px-1 py-0.5 font-sans text-[0.62rem] font-semibold tabular-nums text-ink/70">
            {rows.length}
          </span>
        </li>
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.li
              key={r.slug}
              layout="position"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className={cn(
                "relative ml-[0.95rem] flex items-center gap-2 border-l border-ink/[0.1] py-[0.4rem] pl-3 pr-2 transition-colors duration-500",
                r.fresh && "rounded-r-md bg-cta-soft/70",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500",
                  r.state === "live"
                    ? "bg-success"
                    : r.state === "scheduled"
                      ? "border border-cta bg-white"
                      : "bg-ink/25",
                )}
              />
              <span className="truncate text-ink/70">{r.slug}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* ---------- The answer queue ---------- */

function Queue({ rows }: { rows: Row[] }) {
  const written = rows.filter((r) => r.state === "written" || r.state === "live").length;
  const queued = rows.filter((r) => r.state === "scheduled").length;
  const planned = rows.filter((r) => r.state === "planned").length;
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-baseline justify-between gap-3 px-4 pb-2 pt-3.5 sm:px-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Answer queue
        </p>
        <p className="text-[0.68rem] tabular-nums text-muted-foreground">
          <span className="font-semibold text-ink">{written}</span> written
          {queued > 0 && (
            <>
              {" "}
              · <span className="font-semibold text-ink">{queued}</span> scheduled
            </>
          )}
          {planned > 0 && (
            <>
              {" "}
              · <span className="font-semibold text-ink">{planned}</span> planned
            </>
          )}
        </p>
      </div>
      <ul className="px-2 pb-2">
        {rows.map((r) => {
          const planned = r.state === "planned";
          return (
            <li
              key={r.slug}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg px-2 py-2 transition-colors duration-500 sm:grid-cols-[3.9rem_minmax(0,1fr)_6.6rem_5.6rem] sm:px-3 sm:py-2.5",
                r.fresh ? "bg-cta-soft/70" : "bg-transparent",
              )}
            >
              <span
                className={cn(
                  "hidden text-[0.66rem] font-medium tabular-nums sm:block",
                  r.day < 0 ? "text-ink/55" : "text-ink/80",
                )}
              >
                {dayLabel(r.day)}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "line-clamp-2 text-[0.78rem] font-medium leading-snug transition-colors duration-500 sm:line-clamp-1 sm:text-[0.8rem]",
                    planned ? "text-ink/45" : "text-ink",
                  )}
                >
                  {r.title}
                </span>
                <span className="mt-0.5 block text-[0.62rem] tabular-nums text-muted-foreground sm:hidden">
                  {dayLabel(r.day)} · {r.intent}
                  {!planned && ` · SEO ${r.seo} · GEO ${r.geo}`}
                </span>
              </span>
              <span className="hidden text-[0.64rem] tabular-nums text-muted-foreground sm:block">
                {planned ? (
                  r.intent
                ) : (
                  <>
                    SEO <span className="font-semibold text-ink/80">{r.seo}</span> · GEO{" "}
                    <span className="font-semibold text-ink/80">{r.geo}</span>
                  </>
                )}
              </span>
              <span className="flex justify-end">
                <StateChip state={r.state} />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- The runway ---------- */

const TICKS = [RUNWAY_FROM, -5, 0, 5, 10, 15, RUNWAY_TO];

function Runway({ today, rows, run }: { today: number; rows: Row[]; run: boolean }) {
  const launchX = runwayX(0);
  const lane = "text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground";
  return (
    <div className="px-4 pb-3 pt-3 sm:px-5">
      {/* On a phone the lane names sit above, as a legend. */}
      <div className="mb-5 flex items-center gap-4 sm:hidden">
        <span className={cn(lane, "inline-flex items-center gap-1.5")}>
          <span className="h-2 w-2 rounded-full bg-success" />
          Rankbox
        </span>
        <span className={cn(lane, "inline-flex items-center gap-1.5")}>
          <span className={cn("h-2 w-3 rounded-sm border border-ink/[0.12]", HATCH)} />
          Google
        </span>
      </div>

      <div className="flex gap-3">
        <div className="hidden w-[5.5rem] shrink-0 flex-col sm:flex">
          <p className={cn(lane, "flex h-7 items-center")}>Rankbox</p>
          <p className={cn(lane, "mt-1.5 flex h-7 items-center")}>Google</p>
        </div>

        <div className="relative min-w-0 flex-1">
          {/* Rankbox's lane: one dot per answer, on its date. */}
          <div className="relative h-7">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/[0.1]" />
            {rows.map((r) => (
              <span
                key={r.slug}
                className={cn(
                  "absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[background-color,border-color,transform] duration-500",
                  r.state === "planned" && "border-ink/20 bg-white",
                  r.state === "written" && "border-ink/40 bg-ink/40",
                  r.state === "scheduled" && "border-cta bg-white",
                  r.state === "live" && "border-success bg-success",
                  r.fresh && "scale-125",
                )}
                style={{ left: `${runwayX(r.day)}%` }}
              />
            ))}
          </div>

          {/* Google's lane: nothing public before launch, its own clock after. */}
          <div className="relative mt-1.5 h-7 overflow-hidden rounded-md">
            <div
              className="absolute inset-y-0 left-0 flex items-center pr-2 text-[0.6rem] text-ink/45"
              style={{ width: `${launchX}%` }}
            >
              <span className="truncate">Nothing public to crawl</span>
            </div>
            <div
              className={cn(
                "absolute inset-y-0 right-0 flex items-center rounded-md border border-ink/[0.08] pl-2 transition-opacity duration-700",
                HATCH,
                today >= 0 ? "opacity-100" : "opacity-45",
              )}
              style={{ left: `${launchX}%` }}
            >
              <span className="truncate rounded bg-white/90 px-1 text-[0.62rem] font-medium text-ink/70">
                Crawls on its own schedule
              </span>
            </div>
          </div>

          {/* The axis, with launch day flagged. */}
          <div className="relative mt-1.5 h-4">
            {TICKS.map((t) => (
              <span
                key={t}
                className={cn(
                  "absolute top-0 whitespace-nowrap text-[0.58rem] tabular-nums",
                  t === 0 ? "font-semibold text-ink" : "text-muted-foreground",
                  (t === -5 || t === 15) && "hidden sm:block",
                  t === RUNWAY_FROM
                    ? ""
                    : t === RUNWAY_TO
                      ? "-translate-x-full"
                      : "-translate-x-1/2",
                )}
                style={{ left: `${runwayX(t)}%` }}
              >
                {t === 0 ? (
                  <span className="inline-flex items-center gap-0.5">
                    <Flag className="h-2.5 w-2.5 text-brand-blue" />
                    Launch
                  </span>
                ) : (
                  `${t < 0 ? "\u2212" : "+"}${Math.abs(t)}d`
                )}
              </span>
            ))}
          </div>

          {/* Today: a hairline across both lanes, moving date to date. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 h-[3.875rem] w-px bg-brand-blue/70"
            initial={false}
            animate={{ left: `${runwayX(today)}%` }}
            transition={run ? { duration: 0.8, ease: EASE } : { duration: 0 }}
          >
            <span
              className={cn(
                "absolute -top-0.5 -translate-y-full whitespace-nowrap rounded bg-brand-blue px-1 py-px text-[0.52rem] font-semibold uppercase tracking-[0.08em] text-white",
                today <= RUNWAY_FROM ? "left-0 -translate-x-[3px]" : "left-1/2 -translate-x-1/2",
              )}
            >
              Today
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ---------- The window ---------- */

export function LaunchBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  // Reduced motion: the REST frame, still. Off screen: back to the start.
  useEffect(() => {
    if (reduce) setStep(REST);
    else if (!inView) setStep(0);
  }, [reduce, inView]);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEPS[step].ms);
    return () => window.clearTimeout(id);
  }, [step, inView, reduce]);

  const run = inView && !reduce;
  const today = STEPS[step].today;
  const rows = rowsAt(step);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`A sample launch plan for ${SAMPLE.domain}, a fictional new site: four pages that go public on launch day, four answers written before it, and three more scheduled after, while Google crawls on its own schedule.`}
      className={cn(SCREEN, "relative w-full overflow-hidden")}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-ink/[0.07] px-4 py-3 sm:px-5">
        <SiteTile letter={SAMPLE.brand[0]} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.85rem] font-semibold text-ink">{SAMPLE.domain}</p>
          <p className="flex items-center gap-2 text-[0.68rem] text-muted-foreground">
            <span className="truncate">Launch plan · first month</span>
            <SampleTag className="sm:hidden" />
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[0.66rem] font-semibold tabular-nums transition-colors duration-500",
            today === 0
              ? "bg-cta text-white"
              : today < 0
                ? "bg-ink/[0.04] text-ink/75"
                : "bg-cta-soft text-cta",
          )}
        >
          <Flag className="h-3 w-3" />
          {countdown(today)}
        </span>
        <SampleTag className="hidden sm:inline-block" />
      </div>

      {/* Site map beside the queue */}
      <div className="grid md:min-h-[21.75rem] md:grid-cols-[15.5rem_minmax(0,1fr)]">
        <div className="hidden border-r border-ink/[0.07] md:block">
          <SiteMap today={today} rows={rows} />
        </div>
        <Queue rows={rows} />
      </div>

      {/* The runway */}
      <div className="border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_45%,white)]">
        <Runway today={today} rows={rows} run={run} />
      </div>
    </div>
  );
}
