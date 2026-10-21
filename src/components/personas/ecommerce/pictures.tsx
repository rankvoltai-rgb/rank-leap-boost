/**
 * The product pictures on /use-cases/ecommerce, drawn the way the landing
 * draws Rankbox: white screens, hairline borders, soft blue for what's
 * selected. Every one is a sample on "your store", never a real shop.
 *
 * The sample topic map is the page's centrepiece after the hero: the
 * persona's four question clusters laid out as an order tracker, because a
 * shopper's questions run in the same order an order does (before they buy,
 * while they compare, after it arrives, when something goes wrong). It shows
 * questions only: a volume or a score beside them would be invented data.
 */
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import {
  Check,
  ChevronDown,
  FileText,
  MessageCircleQuestion,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { LINE, LINE_FILL } from "@/components/landing/frame";
import { PLAN, formatUsd } from "@/data/pricing";
import type { PersonaTopics, StackItem } from "@/data/personas";

/* Each stage's chip, from the landing's feature-row tints. */
export const STAGE_TINTS = [
  { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1767d6" },
  { panel: "#f1eefd", tile: "#e3ddfb", ink: "#6d32d9" },
  { panel: "#e9f6ee", tile: "#d6efdf", ink: "#13853f" },
  { panel: "#fdf4e4", tile: "#fbe7c4", ink: "#a85a05" },
] as const;

const SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_56px_-28px_rgba(16,24,40,0.28)]";

function SampleChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

/** The store's tile: a bag on soft blue, standing in for any shop's favicon. */
function StoreTile({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-cta-soft text-cta",
        className,
      )}
    >
      <ShoppingBag className="h-[45%] w-[45%]" />
    </span>
  );
}

/* ---------- The sample topic map ---------- */

const STAGE_MS = 3200;

/**
 * Which stage the tracker has reached. It walks the four stages while the map
 * is on screen and starts over when it leaves; hovering a stage holds it
 * there. Reduced motion shows the whole route complete.
 */
function useTrackerStage(ref: React.RefObject<HTMLElement | null>, count: number) {
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [held, setHeld] = useState<number | null>(null);

  useEffect(() => {
    if (reduce || !inView) {
      setStage(0);
      return;
    }
    if (held !== null) return;
    const id = window.setInterval(() => setStage((s) => (s + 1) % count), STAGE_MS);
    return () => window.clearInterval(id);
  }, [inView, reduce, held, count]);

  return {
    active: reduce ? null : (held ?? stage),
    complete: !!reduce,
    hold: setHeld,
  };
}

export function TopicTracker({ topics }: { topics: PersonaTopics }) {
  const ref = useRef<HTMLDivElement>(null);
  const { clusters } = topics;
  const { active, complete, hold } = useTrackerStage(ref, clusters.length);
  const count = clusters.reduce((n, c) => n + c.questions.length, 0);

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden rounded-xl border border-ink/[0.07] bg-white", SHADOW)}
    >
      {/* The window's bar: what this is, and that it's a sample. */}
      <div
        className={cn(
          "flex items-center gap-2 border-b bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-4 py-2.5",
          LINE,
        )}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft text-cta">
          <Search className="h-3 w-3" />
        </span>
        <span className="text-[0.75rem] font-medium text-ink">Answer-space research</span>
        <SampleChip className="ml-auto" />
      </div>

      {/* Whose map it is. */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-4 py-4 sm:px-6",
          LINE,
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <StoreTile className="h-9 w-9" />
          <div className="min-w-0">
            <p className="truncate text-[0.9rem] font-semibold text-ink">Your store</p>
            <p className="truncate font-mono text-[0.7rem] text-muted-foreground">yourstore.com</p>
          </div>
        </div>
        <p className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
          <span className="tabular-nums">
            {count} questions · {clusters.length} stages
          </span>
          <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.68rem] font-semibold text-cta">
            Awaiting your approval
          </span>
        </p>
      </div>

      {/* The route. On a phone it runs down the page, like an order's status
          history; from lg up it runs across. */}
      <ol className={cn("grid gap-px lg:grid-cols-4", LINE_FILL)}>
        {clusters.map((c, i) => {
          const tint = STAGE_TINTS[i % STAGE_TINTS.length];
          const done = complete || (active !== null && i < active);
          const current = !complete && active === i;
          const last = i === clusters.length - 1;
          const reached = complete || (active !== null && i < active);
          const arrived = complete || (active !== null && i <= active);
          return (
            <li
              key={c.stage}
              onMouseEnter={() => hold(i)}
              onMouseLeave={() => hold(null)}
              className={cn(
                "relative flex gap-4 px-4 pb-5 pt-5 transition-colors duration-500 sm:px-6 lg:flex-col lg:gap-0 lg:px-5 lg:pb-6",
                current ? "bg-[color-mix(in_oklab,var(--cta)_4%,white)]" : "bg-white",
              )}
            >
              {/* The node, and the leg of the route that leaves it. */}
              <div className="relative flex shrink-0 flex-col items-center lg:flex-row">
                <span
                  className={cn(
                    "relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[0.7rem] font-semibold tabular-nums transition-[background-color,color,box-shadow] duration-500",
                    done
                      ? "bg-cta text-white"
                      : current
                        ? "bg-white text-cta shadow-[0_0_0_2px_var(--cta),0_0_0_6px_color-mix(in_oklab,var(--cta)_14%,transparent)]"
                        : "bg-white text-muted-foreground shadow-[0_0_0_1px_rgba(16,24,40,0.12)]",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                {!last && (
                  <span
                    aria-hidden
                    className="mt-1.5 w-[2px] flex-1 overflow-hidden rounded-full bg-ink/[0.08] lg:hidden"
                  >
                    <span
                      className={cn(
                        "block w-full bg-cta transition-[height] duration-700",
                        reached ? "h-full" : "h-0",
                      )}
                    />
                  </span>
                )}
              </div>
              {/* From lg up, each stage draws the leg arriving from the one
                  before, so the later cell paints it over the earlier one. */}
              {i > 0 && (
                <span
                  aria-hidden
                  className="absolute left-[calc(-100%+3.25rem)] right-[calc(100%-1rem)] top-[2.15rem] hidden h-[2px] overflow-hidden rounded-full bg-ink/[0.08] lg:block"
                >
                  <span
                    className={cn(
                      "block h-full bg-cta transition-[width] duration-700",
                      arrived ? "w-full" : "w-0",
                    )}
                  />
                </span>
              )}

              <div className="min-w-0 flex-1 lg:mt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[0.95rem] font-semibold tracking-tight text-ink">
                    {c.stage}
                  </h3>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[0.68rem] font-semibold"
                    style={{ background: tint.tile, color: tint.ink }}
                  >
                    {c.intent}
                  </span>
                </div>
                <ul className="mt-3.5 space-y-2">
                  {c.questions.map((q) => (
                    <li
                      key={q}
                      className={cn(
                        "flex gap-2.5 rounded-lg border bg-white px-3 py-2.5 text-[0.82rem] leading-snug text-ink transition-[border-color,box-shadow] duration-500",
                        current
                          ? "border-cta/25 shadow-[0_6px_16px_-10px_rgba(22,111,229,0.35)]"
                          : "border-ink/[0.07]",
                      )}
                    >
                      <MessageCircleQuestion
                        aria-hidden
                        className={cn(
                          "mt-px h-3.5 w-3.5 shrink-0 transition-colors duration-500",
                          current ? "text-cta" : "text-muted-foreground",
                        )}
                      />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Setup steps, one small picture each ---------- */

function MiniRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border border-ink/[0.07] bg-white px-2.5 py-2 text-[0.72rem] shadow-[0_1px_2px_rgba(16,24,40,0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Step 1: where posts land, and how. */
function PickBlog() {
  return (
    <div className="space-y-2">
      <MiniRow>
        <span className="text-muted-foreground">Posts land in</span>
        <span className="flex items-center gap-1 rounded-md border border-ink/[0.08] px-1.5 py-0.5 font-medium text-ink">
          Journal
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </span>
      </MiniRow>
      <MiniRow>
        <span className="text-muted-foreground">New posts</span>
        <span className="flex rounded-md border border-ink/[0.08] p-0.5 text-[0.66rem] font-medium">
          <span className="rounded px-1.5 py-0.5 text-muted-foreground">Visible</span>
          <span className="rounded bg-cta-soft px-1.5 py-0.5 text-cta">Hidden</span>
        </span>
      </MiniRow>
    </div>
  );
}

/** Step 2: the first stage's questions, two kept and one still to decide. */
function ApproveQuestions({ questions }: { questions: string[] }) {
  return (
    <div className="space-y-1.5">
      {questions.slice(0, 3).map((q, i) => {
        const kept = i < 2;
        return (
          <MiniRow key={q} className="justify-start gap-2.5">
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded",
                kept ? "bg-cta text-white" : "border border-ink/[0.18] bg-white",
              )}
            >
              {kept && <Check className="h-2.5 w-2.5" strokeWidth={3.2} />}
            </span>
            <span
              className={cn(
                "line-clamp-2 leading-snug",
                kept ? "text-ink" : "text-muted-foreground",
              )}
            >
              {q}
            </span>
          </MiniRow>
        );
      })}
    </div>
  );
}

/** Step 3: today's guide on the blog, hidden until it's been read. */
function GuideArrives() {
  return (
    <div className="space-y-1.5">
      <MiniRow>
        <span className="flex min-w-0 items-center gap-2">
          <FileText className="h-3.5 w-3.5 shrink-0 text-cta" />
          <span className="truncate font-medium text-ink">Cold brew beans</span>
        </span>
        <span className="shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
          Hidden
        </span>
      </MiniRow>
      <MiniRow>
        <span className="flex min-w-0 items-center gap-2">
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-muted-foreground">Light vs dark roast</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-[0.62rem] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-cta motion-safe:animate-pulse" />
          Writing
        </span>
      </MiniRow>
    </div>
  );
}

/** Step 4: a new collection's questions in, a discontinued line out. */
function ReshapeMap() {
  return (
    <div className="space-y-1.5">
      <MiniRow className="border-cta/25">
        <span className="flex min-w-0 items-center gap-2">
          <Plus className="h-3.5 w-3.5 shrink-0 text-cta" />
          <span className="truncate font-medium text-ink">Cold brew kits</span>
        </span>
        <span className="shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
          New
        </span>
      </MiniRow>
      <MiniRow>
        <span className="flex min-w-0 items-center gap-2">
          <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-muted-foreground line-through decoration-ink/30">
            Holiday blend
          </span>
        </span>
        <span className="shrink-0 rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.62rem] font-medium text-muted-foreground">
          Cut
        </span>
      </MiniRow>
    </div>
  );
}

export function StepPicture({ index, topics }: { index: number; topics?: PersonaTopics }) {
  if (index === 0) return <PickBlog />;
  if (index === 1)
    return topics ? <ApproveQuestions questions={topics.clusters[0].questions} /> : null;
  if (index === 2) return <GuideArrives />;
  if (index === 3) return <ReshapeMap />;
  return null;
}

/* ---------- The receipt ---------- */

/**
 * What a store blog usually runs on, rung up and struck off. There is no
 * price beside any of it: the only number on the slip is our own plan.
 */
export function StackReceipt({ items }: { items: StackItem[] }) {
  return (
    <div className="relative mx-auto w-full max-w-[25rem]">
      <div className={cn("rounded-t-xl border border-b-0 border-ink/[0.07] bg-white", SHADOW)}>
        <div className="flex items-center justify-between px-5 pb-3 pt-5 sm:px-6">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            The store blog, itemised
          </span>
          <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <ul className={cn("mx-5 border-t border-dashed sm:mx-6", "border-ink/[0.14]")}>
          {items.map((s) => (
            <li
              key={s.label}
              className="flex items-start justify-between gap-4 border-b border-dashed border-ink/[0.1] py-3 last:border-b-0"
            >
              <span className="min-w-0">
                <span className="block text-[0.88rem] font-medium text-muted-foreground line-through decoration-[#e11d48]/50 decoration-[1.5px]">
                  {s.label}
                </span>
                <span className="mt-0.5 block text-[0.75rem] leading-snug text-muted-foreground/80">
                  {s.detail}
                </span>
              </span>
              <X aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e11d48]/60" />
            </li>
          ))}
        </ul>
        <div className={cn("mx-5 mt-1 border-t-2 border-dashed pb-5 pt-4 sm:mx-6", LINE)}>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta text-white">
                <Mark className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block text-[0.9rem] font-semibold text-ink">Rankbox</span>
                <span className="block text-[0.7rem] text-muted-foreground">
                  {PLAN.name} plan · {PLAN.sites} store
                </span>
              </span>
            </span>
            <span className="text-right">
              <span className="block font-display text-[1.5rem] font-medium leading-none tracking-[-0.02em] text-ink tabular-nums">
                {formatUsd(PLAN.monthly)}
              </span>
              <span className="text-[0.7rem] text-muted-foreground">a month</span>
            </span>
          </div>
        </div>
      </div>
      {/* The slip's torn foot. */}
      <svg
        aria-hidden
        viewBox="0 0 400 12"
        preserveAspectRatio="none"
        className="block h-3 w-full drop-shadow-[0_8px_8px_rgba(16,24,40,0.06)]"
      >
        <path
          d={`M0 0 ${Array.from({ length: 20 }, (_, i) => `L${i * 20 + 10} 11 L${i * 20 + 20} 0`).join(" ")} Z`}
          fill="white"
          stroke="rgba(16,24,40,0.07)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

/* ---------- The closing band's peek ---------- */

/** The first stage of the map, rising from the closing band's foot. */
export function QuestionPeek({ topics }: { topics: PersonaTopics }) {
  const first = topics.clusters[0];
  return (
    <div className="rounded-t-xl border border-b-0 border-white/40 bg-white p-4 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)] sm:p-5">
      <div className="flex items-center gap-2">
        <StoreTile className="h-6 w-6" />
        <span className="text-[0.78rem] font-semibold text-ink">Your store</span>
        <span className="text-[0.72rem] text-muted-foreground">· {first.stage}</span>
        <SampleChip className="ml-auto" />
      </div>
      <ul className="mt-3.5 space-y-2">
        {first.questions.map((q) => (
          <li
            key={q}
            className="flex gap-2.5 rounded-lg border border-ink/[0.07] bg-white px-3 py-2.5 text-[0.8rem] leading-snug text-ink"
          >
            <MessageCircleQuestion className="mt-px h-3.5 w-3.5 shrink-0 text-cta" />
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
}
