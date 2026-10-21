/**
 * The product pictures on /features/answer-space-research, drawn the way the
 * landing draws Rankbox: white screens with hairline borders, soft blue for
 * whatever is selected, real engine marks.
 *
 * Every number here is a sample, and the main window says so. The site is
 * "yoursite.com", as on the landing's dashboard, so no real company stands in
 * as a customer. The questions name real tools only as things buyers search
 * for.
 */
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ArrowRight, Check, ChevronDown, Globe, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import {
  ChatGPTMark,
  ClaudeMark,
  GeminiMark,
  GoogleMark,
  PerplexityMark,
} from "@/components/landing/ai-logos";

const ENGINES = {
  ChatGPT: ChatGPTMark,
  Google: GoogleMark,
  Perplexity: PerplexityMark,
  Gemini: GeminiMark,
  Claude: ClaudeMark,
} as const;
type Engine = keyof typeof ENGINES;

const EASE = [0.16, 1, 0.3, 1] as const;

export function EngineStack({ engines, className }: { engines: Engine[]; className?: string }) {
  return (
    <span className={cn("flex -space-x-1", className)}>
      {engines.map((e) => {
        const M = ENGINES[e];
        return (
          <span
            key={e}
            title={e}
            className="flex h-5 w-5 items-center justify-center rounded-md border border-ink/[0.08] bg-white"
          >
            <M className="h-3 w-3" />
          </span>
        );
      })}
    </span>
  );
}

/* Difficulty, coloured the way SEO tools colour it: easy green, mid amber,
   hard rose. Bars only; the number beside each carries the value. */
function kdColor(kd: number) {
  return kd < 20 ? "bg-success" : kd < 30 ? "bg-[#f59e0b]" : "bg-[#f43f5e]";
}

function KdMeter({ kd, grow = true }: { kd: number; grow?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="block h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
        <motion.span
          className={cn("block h-full rounded-full", kdColor(kd))}
          initial={grow ? { width: 0 } : false}
          animate={{ width: `${Math.min(100, kd * 1.4)}%` }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
        />
      </span>
      <span className="w-5 shrink-0 text-right text-[0.7rem] font-semibold tabular-nums text-ink">
        {kd}
      </span>
    </span>
  );
}

/* ---------- The research window ---------- */

interface Topic {
  q: string;
  volume: string;
  kd: number;
  engines: Engine[];
}

/* Winnable first: each cluster's questions are listed easiest first, the
   order Rankbox sorts them in. */
const CLUSTERS: { name: string; intent: string; size: number; topics: Topic[] }[] = [
  {
    name: "Best tools",
    intent: "Commercial",
    size: 46,
    topics: [
      {
        q: "project tool for a 5-person startup",
        volume: "1,300",
        kd: 12,
        engines: ["Perplexity", "Claude"],
      },
      {
        q: "best free kanban app for startups",
        volume: "6,600",
        kd: 19,
        engines: ["ChatGPT", "Gemini"],
      },
      {
        q: "best project management tool for small teams",
        volume: "18,100",
        kd: 24,
        engines: ["ChatGPT", "Google", "Perplexity"],
      },
      {
        q: "best task app for remote teams",
        volume: "3,600",
        kd: 33,
        engines: ["Google", "Gemini"],
      },
    ],
  },
  {
    name: "Comparisons",
    intent: "Comparison",
    size: 31,
    topics: [
      {
        q: "trello vs asana for a small team",
        volume: "2,400",
        kd: 14,
        engines: ["Google", "ChatGPT"],
      },
      {
        q: "kanban vs scrum for small teams",
        volume: "9,900",
        kd: 19,
        engines: ["Google", "ChatGPT", "Claude"],
      },
      {
        q: "asana alternatives for startups",
        volume: "4,400",
        kd: 27,
        engines: ["Perplexity", "Gemini", "ChatGPT"],
      },
      {
        q: "notion vs clickup for project planning",
        volume: "8,100",
        kd: 38,
        engines: ["Google", "Perplexity"],
      },
    ],
  },
  {
    name: "How-to",
    intent: "Informational",
    size: 58,
    topics: [
      {
        q: "how to run async standups",
        volume: "1,900",
        kd: 11,
        engines: ["Perplexity", "ChatGPT"],
      },
      {
        q: "how to run a sprint without a scrum master",
        volume: "2,900",
        kd: 15,
        engines: ["ChatGPT", "Claude"],
      },
      {
        q: "how to prioritize a product backlog",
        volume: "3,200",
        kd: 22,
        engines: ["Google", "Gemini", "ChatGPT"],
      },
      {
        q: "how to plan a product roadmap",
        volume: "5,400",
        kd: 31,
        engines: ["Google", "Gemini"],
      },
    ],
  },
  {
    name: "Pricing",
    intent: "Transactional",
    size: 17,
    topics: [
      {
        q: "project management tool with a free plan",
        volume: "2,100",
        kd: 13,
        engines: ["ChatGPT", "Perplexity"],
      },
      {
        q: "cheapest kanban tool for startups",
        volume: "880",
        kd: 16,
        engines: ["Perplexity", "Claude"],
      },
      {
        q: "is jira free for small teams",
        volume: "4,400",
        kd: 26,
        engines: ["Google", "ChatGPT"],
      },
      {
        q: "project software pricing comparison",
        volume: "1,600",
        kd: 34,
        engines: ["Google", "Gemini"],
      },
    ],
  },
];

const FOUND = 460;
const CLUSTER_TOTAL = 38;
const WINNABLE = 112;
const APPROVED_BASE = 12;
/* How long a cluster stays up, and when in that time its best topic is approved. */
const CLUSTER_MS = 4600;
const APPROVE_MS = 1700;

function Figure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white px-4 py-3.5 lg:px-5">
      <p className="text-[0.7rem] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex h-7 items-center text-[1.4rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
        {children}
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn("block h-2.5 rounded-full bg-ink/[0.06] motion-safe:animate-pulse", className)}
    />
  );
}

/**
 * Answer-Space Research, running: it scans yoursite.com's space, the counts
 * climb, the map fills in, then it walks the clusters one by one and approves
 * each cluster's most winnable question for the writer.
 *
 * Runs only while half of it is on screen and starts over once it leaves, so
 * every visit sees the scan. With reduced motion it shows the finished map.
 */
export function AnswerSpaceWindow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();

  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [approved, setApproved] = useState(false);
  const [approvals, setApprovals] = useState(0);

  const progress = useMotionValue(0);
  const found = useTransform(progress, (p) => Math.round(p * FOUND).toLocaleString("en-US"));
  const clusters = useTransform(progress, (p) => Math.round(p * CLUSTER_TOTAL));
  const winnable = useTransform(progress, (p) => Math.round(p * WINNABLE));

  // Reduced motion: the finished map, still.
  useEffect(() => {
    if (!reduce) return;
    progress.jump(1);
    setReady(true);
    setApproved(true);
  }, [reduce, progress]);

  // Off screen: back to the start, so the next visit sees the scan.
  useEffect(() => {
    if (reduce || inView) return;
    progress.jump(0);
    setReady(false);
    setActive(0);
    setApproved(false);
    setApprovals(0);
  }, [inView, reduce, progress]);

  // The scan.
  useEffect(() => {
    if (reduce || !inView || ready) return;
    const controls = animate(progress, 1, {
      duration: 2,
      ease: [0.33, 0, 0.2, 1],
      onComplete: () => setReady(true),
    });
    return () => controls.stop();
  }, [inView, reduce, ready, progress]);

  // The walk through the clusters.
  useEffect(() => {
    if (reduce || !inView || !ready) return;
    const approve = window.setTimeout(() => {
      setApproved(true);
      setApprovals((n) => n + 1);
    }, APPROVE_MS);
    const next = window.setTimeout(() => {
      setApproved(false);
      setActive((i) => (i + 1) % CLUSTERS.length);
    }, CLUSTER_MS);
    return () => {
      window.clearTimeout(approve);
      window.clearTimeout(next);
    };
  }, [inView, reduce, ready, active]);

  const cluster = CLUSTERS[active];

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Sample answer-space map: hundreds of buyer questions grouped into clusters, each scored for volume and difficulty, with the most winnable sent to the writer."
      className={cn(
        "overflow-hidden rounded-xl bg-white text-left shadow-[0_2px_4px_rgba(4,24,72,0.08),0_32px_80px_-24px_rgba(4,24,72,0.55)] ring-1 ring-black/5",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex h-12 items-center gap-3 border-b border-ink/[0.06] px-4">
        <Mark className="h-5 w-5 shrink-0 text-brand-blue" />
        <span className="text-[0.82rem] font-semibold text-ink">Answer space</span>
        <span className="hidden items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.7rem] font-medium text-ink sm:flex">
          yoursite.com
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </span>
        <span className="ml-auto flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              {!ready && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-1.5 w-1.5 rounded-full transition-colors duration-300",
                  ready ? "bg-success" : "bg-cta",
                )}
              />
            </span>
            {ready ? "Map ready" : "Scanning Google + AI answers"}
          </span>
          <span className="hidden rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:inline">
            Sample
          </span>
        </span>
      </div>

      {/* The figures, climbing while it scans */}
      <div className="grid grid-cols-2 gap-px border-b border-ink/[0.06] bg-ink/[0.06] md:grid-cols-4">
        <Figure label="Questions found">
          <motion.span>{found}</motion.span>
        </Figure>
        <Figure label="Clusters">
          <motion.span>{clusters}</motion.span>
        </Figure>
        <Figure label="Winnable now">
          <motion.span>{winnable}</motion.span>
        </Figure>
        <Figure label="Engines mapped">
          <EngineStack
            engines={["ChatGPT", "Google", "Perplexity", "Gemini", "Claude"]}
            className="[&>span]:h-6 [&>span]:w-6 [&_svg]:h-3.5 [&_svg]:w-3.5"
          />
        </Figure>
      </div>

      <div className="grid md:grid-cols-[13rem_1fr]">
        {/* Clusters rail */}
        <aside className="hidden border-r border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] p-3 md:block">
          <p className="px-2 pb-1.5 pt-1 text-[0.65rem] font-medium text-muted-foreground">
            Clusters
          </p>
          <ul className="space-y-0.5">
            {CLUSTERS.map((c, i) => {
              const on = ready && i === active;
              return (
                <li
                  key={c.name}
                  className={cn(
                    "relative flex items-center justify-between rounded-lg px-2 py-1.5 text-[0.78rem] font-medium transition-colors duration-300",
                    on ? "text-cta" : "text-ink/75",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="answer-space-cluster"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="absolute inset-0 rounded-lg bg-cta-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_16%,transparent)]"
                    />
                  )}
                  <span className="relative">{c.name}</span>
                  <span
                    className={cn(
                      "relative text-[0.68rem] tabular-nums",
                      on ? "text-cta" : "text-muted-foreground",
                    )}
                  >
                    {ready ? c.size : "–"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 px-2 text-[0.68rem] text-muted-foreground">
            + {CLUSTER_TOTAL - CLUSTERS.length} more clusters
          </p>
        </aside>

        {/* The questions in the cluster that's open */}
        <div className="min-w-0 p-4 lg:p-5">
          {/* On phones the rail becomes tabs */}
          <div className="mb-3 flex gap-1 overflow-hidden rounded-lg bg-ink/[0.04] p-1 md:hidden">
            {CLUSTERS.map((c, i) => (
              <span
                key={c.name}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-md px-1.5 py-1 text-center text-[0.68rem] font-medium transition-colors",
                  ready && i === active
                    ? "bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                    : "text-muted-foreground",
                )}
              >
                {c.name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.82rem] font-semibold text-ink">
              {ready ? cluster.name : "Mapping your space"}
            </p>
            {ready && (
              <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta">
                {cluster.intent}
              </span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-[1fr_3.5rem_5.5rem] items-center gap-3 px-3 text-[0.65rem] font-medium text-muted-foreground sm:grid-cols-[1fr_4rem_6.5rem_4.5rem] lg:grid-cols-[1fr_4rem_7rem_4.5rem_6rem]">
            <span>Buyer question</span>
            <span className="text-right">Volume</span>
            <span>Difficulty</span>
            <span className="hidden sm:block">Engines</span>
            <span className="hidden lg:block" />
          </div>

          <div className="relative mt-1.5 h-[12.1rem]">
            <AnimatePresence initial={false} mode="popLayout">
              {ready ? (
                <motion.ul
                  key={cluster.name}
                  className="space-y-1.5"
                  initial="enter"
                  animate="shown"
                  exit="gone"
                  variants={{
                    shown: { transition: { staggerChildren: 0.07 } },
                    gone: { opacity: 0, transition: { duration: 0.2 } },
                  }}
                >
                  {cluster.topics.map((t, i) => {
                    const best = i === 0;
                    return (
                      <motion.li
                        key={t.q}
                        variants={{
                          enter: { opacity: 0, y: 10, filter: "blur(4px)" },
                          shown: {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: { duration: 0.45, ease: EASE },
                          },
                        }}
                        className={cn(
                          "grid grid-cols-[1fr_3.5rem_5.5rem] items-center gap-3 rounded-lg border bg-white px-3 py-2.5 transition-[border-color,background-color] duration-500 sm:grid-cols-[1fr_4rem_6.5rem_4.5rem] lg:grid-cols-[1fr_4rem_7rem_4.5rem_6rem]",
                          best && approved
                            ? "border-cta/30 bg-[color-mix(in_oklab,var(--cta)_4%,white)]"
                            : "border-ink/[0.07]",
                        )}
                      >
                        <span className="truncate text-[0.78rem] font-medium text-ink">{t.q}</span>
                        <span className="text-right text-[0.72rem] tabular-nums text-muted-foreground">
                          {t.volume}
                        </span>
                        <KdMeter kd={t.kd} grow={!reduce} />
                        <EngineStack engines={t.engines} className="hidden sm:flex" />
                        <span className="hidden justify-end lg:flex">
                          {best && approved ? (
                            <motion.span
                              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 520, damping: 24 }}
                              className="inline-flex items-center gap-1 rounded-md bg-cta px-1.5 py-0.5 text-[0.65rem] font-semibold text-white"
                            >
                              <Check className="h-3 w-3" strokeWidth={3} />
                              Approved
                            </motion.span>
                          ) : t.kd < 25 ? (
                            <span className="text-[0.68rem] font-medium text-success">
                              Winnable
                            </span>
                          ) : (
                            <span className="text-[0.68rem] text-muted-foreground">Later</span>
                          )}
                        </span>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              ) : (
                <motion.ul
                  key="scanning"
                  className="space-y-1.5"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  {[0.72, 0.58, 0.8, 0.5].map((w, i) => (
                    <li
                      key={i}
                      className="flex h-[2.6rem] items-center gap-4 rounded-lg border border-ink/[0.05] px-3"
                    >
                      <Skeleton className="flex-none" />
                      <span className="block flex-1">
                        <Skeleton className="w-full" />
                      </span>
                      <span style={{ width: `${w * 40}%` }} className="block">
                        <Skeleton className="w-full" />
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* The hand-off */}
      <div className="flex items-center justify-between gap-3 border-t border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-4 py-3">
        <span className="flex items-center gap-2 text-[0.75rem] font-medium text-ink">
          <Sparkles className="h-3.5 w-3.5 text-cta" />
          <span className="relative inline-flex overflow-hidden tabular-nums">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={approvals}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {APPROVED_BASE + approvals}
              </motion.span>
            </AnimatePresence>
          </span>
          topics approved for this week
        </span>
        <span className="flex items-center gap-1 text-[0.75rem] font-semibold text-cta">
          Send to writer <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

/* ---------- Benefit screens ---------- */

/* The white card inside a benefit's tinted panel. It runs past the panel's
   foot and is cropped there, as on the landing's feature rows. */
export function ScreenCard({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-x-5 top-8 mx-auto max-w-[27rem] rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-10 sm:top-10 sm:p-5">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <p className="text-[0.8rem] font-semibold text-ink">{title}</p>
        {meta}
      </div>
      {children}
    </div>
  );
}

const ROW =
  "flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2";

const INTENT_ROWS = [
  { q: "best project tool for small teams", intent: "Commercial", on: true },
  { q: "project tool pricing for startups", intent: "Transactional", on: true },
  { q: "kanban vs scrum", intent: "Comparison", on: true },
  { q: "what is a gantt chart", intent: "Informational", on: false },
] as const;

function BuyerIntentScreen() {
  return (
    <ScreenCard
      title="Filter by intent"
      meta={
        <span className="flex rounded-md bg-ink/[0.04] p-0.5 text-[0.68rem] font-medium">
          <span className="rounded-[5px] bg-white px-2 py-0.5 text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]">
            High intent
          </span>
          <span className="px-2 py-0.5 text-muted-foreground">All</span>
        </span>
      }
    >
      <div className="space-y-2">
        {INTENT_ROWS.map((r) => (
          <div key={r.q} className={cn(ROW, !r.on && "opacity-40")}>
            <span className="truncate text-xs font-medium text-ink">{r.q}</span>
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold",
                r.on ? "bg-cta-soft text-cta" : "bg-ink/[0.05] text-muted-foreground",
              )}
            >
              {r.intent}
            </span>
          </div>
        ))}
      </div>
    </ScreenCard>
  );
}

const SCORED = [
  { q: "project tool for a 5-person startup", v: "1,300", kd: 12 },
  { q: "kanban vs scrum for small teams", v: "9,900", kd: 19 },
  { q: "best project management tool", v: "18,100", kd: 24 },
  { q: "project management software", v: "74,000", kd: 71 },
];

function ScoringScreen() {
  return (
    <ScreenCard
      title="Scored topics"
      meta={<span className="text-[0.68rem] text-muted-foreground">Winnable first</span>}
    >
      <div className="mb-1.5 grid grid-cols-[1fr_3.5rem_5.5rem] gap-3 px-3 text-[0.62rem] font-medium text-muted-foreground">
        <span>Topic</span>
        <span className="text-right">Volume</span>
        <span>Difficulty</span>
      </div>
      <div className="space-y-2">
        {SCORED.map((s, i) => (
          <div
            key={s.q}
            className={cn(
              "grid grid-cols-[1fr_3.5rem_5.5rem] items-center gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2",
              i === 3 && "opacity-45",
            )}
          >
            <span className="truncate text-xs font-medium text-ink">{s.q}</span>
            <span className="text-right text-[0.7rem] tabular-nums text-muted-foreground">
              {s.v}
            </span>
            <KdMeter kd={s.kd} grow={false} />
          </div>
        ))}
      </div>
    </ScreenCard>
  );
}

function BuiltForAIScreen() {
  return (
    <ScreenCard title="One topic, two ways in">
      <ol className="relative space-y-3 before:absolute before:bottom-6 before:left-[0.6rem] before:top-6 before:w-px before:bg-ink/[0.1]">
        <li className="relative flex items-start gap-3">
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
            <GoogleMark className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-medium text-muted-foreground">Google sees</p>
            <p className="mt-1 w-fit rounded-md border border-ink/[0.07] bg-ink/[0.02] px-2 py-1 font-mono text-[0.72rem] text-ink">
              kanban vs scrum
            </p>
          </div>
        </li>
        <li className="relative flex items-start gap-3">
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
            <ChatGPTMark className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-medium text-muted-foreground">Buyers ask AI</p>
            <p className="mt-1 w-fit rounded-lg border border-ink/[0.07] bg-white px-2.5 py-1.5 text-[0.75rem] leading-snug text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              Should a five-person team use Kanban or Scrum?
            </p>
          </div>
        </li>
        <li className="relative flex items-start gap-3">
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta text-white">
            <Mark className="h-3 w-3" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-medium text-muted-foreground">Rankbox targets</p>
            <p className="mt-1 rounded-lg border border-cta/25 bg-cta-soft px-2.5 py-1.5 text-[0.75rem] font-medium leading-snug text-ink">
              One article that answers both, with a quotable verdict up top.
            </p>
          </div>
        </li>
      </ol>
    </ScreenCard>
  );
}

/** The three benefit screens, in the order the feature's benefits are listed. */
export const BENEFIT_SCREENS: ComponentType[] = [
  BuyerIntentScreen,
  ScoringScreen,
  BuiltForAIScreen,
];

/* ---------- Step pictures ---------- */

function AnalyzeStep() {
  return (
    <div className="space-y-2">
      <div className={ROW}>
        <span className="flex items-center gap-2 text-xs font-medium text-ink">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          yoursite.com
        </span>
        <span className="text-[0.65rem] font-medium text-cta">Analyzing</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["Your category", "Competitors", "Live SERPs", "AI answers"].map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 rounded-md border border-ink/[0.07] bg-white px-2 py-1 text-[0.68rem] font-medium text-ink"
          >
            <Check className="h-3 w-3 text-success" strokeWidth={3} />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function ClusterStep() {
  return (
    <div className="space-y-2">
      {CLUSTERS.slice(0, 3).map((c, i) => (
        <div key={c.name} className={ROW}>
          <span className="flex items-center gap-2 text-xs font-medium text-ink">
            <span
              className={cn("h-2 w-2 rounded-full", ["bg-cta", "bg-[#7c3aed]", "bg-success"][i])}
            />
            {c.name}
          </span>
          <span className="text-[0.68rem] tabular-nums text-muted-foreground">
            {c.size} questions
          </span>
        </div>
      ))}
    </div>
  );
}

function HandOffStep() {
  return (
    <div className="space-y-2">
      <div className={ROW}>
        <span className="truncate text-xs font-medium text-ink">
          kanban vs scrum for small teams
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cta px-1.5 py-0.5 text-[0.62rem] font-semibold text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
          Approved
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-cta/25 bg-cta-soft px-3 py-2 text-xs font-medium text-ink">
        <ArrowRight className="h-3.5 w-3.5 text-cta" />
        Queued for the Citation-Ready Writer
      </div>
    </div>
  );
}

/** One small picture per step, in the order the feature's steps are listed. */
export const STEP_PICTURES: ComponentType[] = [AnalyzeStep, ClusterStep, HandOffStep];

/* ---------- The closing band's screen ---------- */

/** The top of a finished map, rising out of the closing band. */
export function MapPeek({ className }: { className?: string }) {
  const rows = [CLUSTERS[0].topics[0], CLUSTERS[1].topics[1], CLUSTERS[2].topics[0]];
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-t-xl border border-b-0 border-white/20 bg-white p-4 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)] sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
          <Mark className="h-4 w-4 text-brand-blue" />
          Buyer questions
        </span>
        <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {FOUND} found
        </span>
      </div>
      <div className="mt-3.5 space-y-2">
        {rows.map((t) => (
          <div key={t.q} className={ROW}>
            <span className="truncate text-xs font-medium text-ink">{t.q}</span>
            <EngineStack engines={t.engines} />
          </div>
        ))}
      </div>
    </div>
  );
}
