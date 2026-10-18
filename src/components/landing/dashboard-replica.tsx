/**
 * A replica of the Rankbox dashboard's Overview, for the landing showcase.
 *
 * Built from the app's own navigation (NAV_SECTIONS) and icons, and laid out
 * like the real page: the greeting and autopilot status, four numbers in a
 * hairline panel, then the autopilot queue. Labels follow the app's wording
 * ("Projected traffic", "of 30 left this cycle", Writing / Scheduled), so the
 * picture matches what a new customer sees after signing up.
 *
 * Once it's on screen it runs: the article being written publishes, the
 * queue moves up a row, and the figures above follow, until the month's 30
 * articles are out. It holds still off screen, and with reduced motion it
 * shows its first frame and never moves.
 */
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { NAV_SECTIONS } from "@/components/dashboard/nav";
import {
  CardIcon,
  ChartIcon,
  CheckIcon,
  ConnectIcon,
  TargetIcon,
} from "@/components/dashboard/icons";

const GOAL = 30;
const START = 18;
/* Projected visits per published article, so traffic follows the count. */
const VISITS_PER_ARTICLE = 268;
/* How long each article takes to "write" before it publishes. */
const CYCLE_MS = 3400;
const EASE = [0.16, 1, 0.3, 1] as const;

const QUEUE = [
  {
    t: "Best Project Management Tools for Small Teams",
    k: "best project management tools",
    v: 1230,
  },
  { t: "Kanban vs Scrum: A Complete Guide for Founders", k: "kanban vs scrum", v: 810 },
  { t: "Async vs Live Standups: What's the Difference", k: "async vs live standups", v: 590 },
  { t: "Top 10 Sprint Planning Techniques for Beginners", k: "sprint planning techniques", v: 340 },
  { t: "Startup Onboarding Ideas That Actually Work", k: "startup onboarding ideas", v: 290 },
  { t: "How to Run a Remote-First Team", k: "remote first team", v: 420 },
  { t: "Best Free Planning Apps for Lean Teams", k: "free planning apps", v: 670 },
  { t: "How to Write a Product Roadmap People Follow", k: "product roadmap template", v: 510 },
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* A figure that counts to its value, and glides when the value changes. */
function Count({ value, run }: { value: number; run: boolean }) {
  const spring = useSpring(0, { stiffness: 60, damping: 18, mass: 0.8 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    if (run) spring.set(value);
    else spring.jump(value);
  }, [run, value, spring]);
  return <motion.span>{text}</motion.span>;
}

function Meter({ pct }: { pct: number }) {
  return (
    <span className="block h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
      <span
        className="block h-full rounded-full bg-cta transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}

function Stat({
  label,
  icon: Icon,
  value,
  meter,
  hint,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  meter?: React.ReactNode;
  hint: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 bg-white p-4 lg:p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[0.75rem] font-medium">{label}</span>
      </div>
      <div className="text-[1.55rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
        {value}
      </div>
      {meter}
      <p className="text-[0.7rem] text-muted-foreground">{hint}</p>
    </div>
  );
}

type Stage = "published" | "writing" | "scheduled";

function StageBadge({ stage, run }: { stage: Stage; run: boolean }) {
  if (stage === "published") {
    return (
      <motion.span
        key="published"
        initial={run ? { scale: 0.6, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 24 }}
        className="inline-flex items-center gap-1 rounded-md bg-success/12 px-1.5 py-0.5 text-[0.65rem] font-semibold text-success"
      >
        <CheckIcon className="h-3 w-3" />
        Published
      </motion.span>
    );
  }
  if (stage === "writing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta" />
        </span>
        Writing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
      Scheduled
    </span>
  );
}

export function DashboardReplica() {
  const ref = useRef<HTMLDivElement>(null);
  // Half the card on screen before it starts, so it doesn't run down while
  // only its top edge peeks over the fold.
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [done, setDone] = useState(0);

  const published = START + done;
  const run = inView && !reduce;
  const live = run && published < GOAL;

  // Off screen, start the month over, so the next visit sees it from the top.
  useEffect(() => {
    if (!inView) setDone(0);
  }, [inView]);

  // One article per cycle, only while the card is on screen.
  useEffect(() => {
    if (!live) return;
    const id = window.setTimeout(() => setDone((d) => d + 1), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [live, done]);

  const left = GOAL - published;
  const rows = Array.from({ length: 5 }, (_, i) => {
    const n = done + i;
    const stage: Stage =
      i === 0 ? "published" : i === 1 && published < GOAL ? "writing" : "scheduled";
    return { n, item: QUEUE[n % QUEUE.length], stage };
  });

  return (
    <div
      ref={ref}
      className="flex overflow-hidden rounded-xl bg-white text-left shadow-[0_2px_4px_rgba(4,24,72,0.08),0_32px_80px_-24px_rgba(4,24,72,0.55)] ring-1 ring-black/5"
    >
      {/* Sidebar — the app's own navigation, Overview selected. */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] p-3 md:flex lg:w-56">
        <div className="flex items-center justify-between px-1.5 pb-4 pt-1">
          <Mark className="h-5 w-5 text-brand-blue" />
          <span className="flex items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.68rem] font-medium text-ink">
            yoursite.com
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </span>
        </div>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mt-2 first-of-type:mt-0">
            <p className="px-2 pb-1.5 pt-2 text-[0.65rem] font-medium text-muted-foreground">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ title, icon: Icon, showsQueueCount }) => {
                const active = title === "Overview";
                return (
                  <li
                    key={title}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[0.78rem] font-medium",
                      active
                        ? "bg-cta-soft font-semibold text-cta shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_16%,transparent)]"
                        : "text-ink/70",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-cta" : "text-ink/55")} />
                    {title}
                    {showsQueueCount && (
                      <span className="ml-auto rounded-md bg-ink/[0.06] px-1.5 text-[0.62rem] font-semibold text-ink/70 tabular-nums">
                        {Math.max(0, GOAL - published)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      {/* Overview */}
      <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.72rem] text-muted-foreground">Overview</p>
            <h3 className="mt-0.5 font-display text-[1.35rem] font-semibold tracking-tight text-ink sm:text-[1.5rem]">
              Good morning
            </h3>
            <p className="mt-0.5 text-[0.75rem] text-muted-foreground">
              Your articles are working for you — <span className="tabular-nums">{published}</span>{" "}
              published so far.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-3 py-1.5 text-[0.75rem] font-medium text-ink">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cta" />
            </span>
            Autopilot <span className="font-semibold text-cta">On</span>
          </span>
        </header>

        {/* The numbers, in one hairline-divided panel, as in the app. */}
        <div className="overflow-hidden rounded-xl border border-ink/[0.07]">
          <div className="grid grid-cols-2 gap-px bg-ink/[0.07] lg:grid-cols-4">
            <Stat
              label="Projected traffic"
              icon={ChartIcon}
              value={<Count value={published * VISITS_PER_ARTICLE} run={run} />}
              hint="Est. monthly organic visitors"
            />
            <Stat
              label="Published"
              icon={TargetIcon}
              value={
                <>
                  <span className="tabular-nums">{published}</span>
                  <span className="text-[1rem] font-medium text-muted-foreground"> / {GOAL}</span>
                </>
              }
              meter={<Meter pct={(published / GOAL) * 100} />}
              hint={`${Math.round((published / GOAL) * 100)}% of monthly goal`}
            />
            <Stat
              label="Your site"
              icon={ConnectIcon}
              value={
                <span className="inline-flex items-center gap-2 text-[1.15rem]">
                  <span className="h-2 w-2 rounded-full bg-cta" />
                  <span className="text-cta">Live</span>
                </span>
              }
              hint={done > 0 ? "Webflow · last article just now" : "Webflow · last article 2h ago"}
            />
            <Stat
              label="Article credits"
              icon={CardIcon}
              value={<span className="tabular-nums">{left}</span>}
              meter={<Meter pct={(left / GOAL) * 100} />}
              hint={`of ${GOAL} left this cycle`}
            />
          </div>
        </div>

        {/* The queue: what autopilot writes next, in order. */}
        <div className="overflow-hidden rounded-xl border border-ink/[0.07]">
          <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3">
            <p className="text-[0.85rem] font-semibold text-ink">Autopilot queue</p>
            <div className="flex gap-1 text-[0.68rem] font-medium">
              <span className="rounded-md bg-ink/[0.06] px-2 py-0.5 text-ink">All</span>
              <span className="px-2 py-0.5 text-muted-foreground">Scheduled</span>
              <span className="px-2 py-0.5 text-muted-foreground">Writing</span>
            </div>
          </div>
          <div className="hidden grid-cols-[1fr_5.5rem_6.5rem] gap-4 lg:grid-cols-[1fr_10rem_5.5rem_6.5rem] border-b border-ink/[0.06] px-4 py-2 text-[0.65rem] font-medium text-muted-foreground sm:grid">
            <span>Article</span>
            <span className="hidden lg:block">Keyword</span>
            <span>Est. traffic</span>
            <span>Status</span>
          </div>
          <ul className="relative">
            <AnimatePresence initial={false} mode="popLayout">
              {rows.map(({ n, item, stage }, i) => (
                <motion.li
                  key={n}
                  layout={run ? "position" : false}
                  initial={run ? { opacity: 0, y: 14 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14, transition: { duration: 0.35 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="relative grid grid-cols-[1fr_auto] items-center gap-4 border-b border-ink/[0.05] px-4 py-2.5 last:border-b-0 sm:grid-cols-[1fr_5.5rem_6.5rem] lg:grid-cols-[1fr_10rem_5.5rem_6.5rem]"
                >
                  <span className="min-w-0 truncate text-[0.78rem] font-medium text-ink">
                    {item.t}
                  </span>
                  <span className="hidden truncate text-[0.72rem] text-muted-foreground lg:block">
                    {item.k}
                  </span>
                  <span className="hidden text-[0.72rem] text-ink/80 tabular-nums sm:block">
                    {item.v.toLocaleString("en-US")}/mo
                  </span>
                  <span className="flex items-center gap-2">
                    <StageBadge stage={stage} run={run} />
                    {stage === "scheduled" && (
                      <span className="hidden text-[0.62rem] text-muted-foreground lg:inline">
                        {WEEKDAYS[(n + 1) % 7]}
                      </span>
                    )}
                  </span>
                  {/* The article being written fills a hairline as it goes. */}
                  {stage === "writing" && (
                    <motion.span
                      key={`progress-${n}`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-cta/70"
                      initial={{ scaleX: run ? 0 : 0.6 }}
                      animate={{ scaleX: live ? 1 : 0.6 }}
                      transition={{ duration: live ? CYCLE_MS / 1000 : 0, ease: "linear" }}
                    />
                  )}
                  {i === 0 && stage === "published" && run && done > 0 && (
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-success/[0.07]"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 1.6, ease: "easeOut" }}
                    />
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
