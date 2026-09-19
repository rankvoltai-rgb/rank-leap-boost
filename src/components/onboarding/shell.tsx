/**
 * Onboarding chrome: a header carrying step progress, then three columns —
 * proof on the left, the steps as an accordion in the middle, the live traffic
 * projection on the right. Below lg the columns stack in priority order:
 * steps, projection, proof.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/landing/shared";
import { PARTS, reducedMotion } from "./constants";

export type Step = 1 | 2 | 3;

const COLLAPSE_MS = 220;
type StepState = "done" | "active" | "upcoming";

/** A short celebratory particle burst anchored to its parent. */
export function Burst() {
  if (reducedMotion()) return null;
  const particles = Array.from({ length: 10 });
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 22 + (i % 3) * 8;
        const tones = ["bg-success", "bg-volt", "bg-ink"];
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: 0.4,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className={cn("absolute h-1.5 w-1.5 rounded-full", tones[i % tones.length])}
          />
        );
      })}
    </span>
  );
}

function StepDot({ n, state, large }: { n: number; state: StepState; large?: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold tabular-nums transition-colors",
        large ? "h-8 w-8 text-sm" : "h-5 w-5 text-[0.7rem]",
        state === "done" && "bg-brand-blue text-white",
        state === "active" && "border-[1.5px] border-brand-blue text-brand-blue",
        state === "upcoming" && "border border-border text-muted-foreground",
      )}
    >
      {state === "done" ? <Check className={large ? "h-4 w-4" : "h-3 w-3"} strokeWidth={3} /> : n}
    </span>
  );
}

/** Completed steps are links back; the current and later ones are not. */
function HeaderSteps({ active, onStep }: { active: Step; onStep: (step: Step) => void }) {
  return (
    <ol className="hidden h-full items-stretch md:flex">
      {PARTS.map((part, i) => {
        const state: StepState =
          part.n < active ? "done" : part.n === active ? "active" : "upcoming";
        return (
          <li key={part.n} className="flex h-full items-center">
            {i > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground/50" aria-hidden />
            )}
            <button
              type="button"
              disabled={state !== "done"}
              onClick={() => onStep(part.n)}
              aria-current={state === "active" ? "step" : undefined}
              className={cn(
                "relative flex h-full items-center gap-2 px-1 text-sm transition-colors disabled:cursor-default",
                state === "active" && "font-semibold text-ink",
                state === "done" && "text-ink hover:text-brand-blue",
                state === "upcoming" && "text-muted-foreground",
              )}
            >
              <StepDot n={part.n} state={state} />
              {part.title}
              {state === "active" && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-blue" />
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function OnboardingShell({
  active,
  onStep,
  proof,
  projection,
  children,
}: {
  active: Step;
  onStep: (step: Step) => void;
  proof: ReactNode;
  projection: ReactNode;
  children: ReactNode;
}) {
  const current = PARTS.find((p) => p.n === active);
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 lg:px-8">
          <a href="/" className="justify-self-start">
            <Logo />
          </a>
          <HeaderSteps active={active} onStep={onStep} />
          <p className="col-start-3 justify-self-end text-xs font-medium text-muted-foreground md:hidden">
            Step {active} of {PARTS.length} &middot; {current?.title}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-6 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[17rem_minmax(0,1fr)_21rem] lg:gap-0 lg:p-0">
        <aside className="order-3 lg:order-1 lg:border-r lg:border-border lg:px-8 lg:py-10">
          <div className="lg:sticky lg:top-26">{proof}</div>
        </aside>
        <main className="order-1 min-w-0 lg:order-2 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-3xl space-y-4">{children}</div>
        </main>
        <aside className="order-2 lg:order-3 lg:border-l lg:border-border lg:px-8 lg:py-10">
          <div className="lg:sticky lg:top-26">{projection}</div>
        </aside>
      </div>
    </div>
  );
}

/**
 * One step of the accordion. Only the active step is open; a finished one
 * collapses to a one-line summary with an Edit action, and later steps show
 * their title only, so the page always reads top to bottom as done → now → next.
 */
export function StepSection({
  n,
  title,
  subtitle,
  summary,
  state,
  onEdit,
  children,
}: {
  n: Step;
  title: string;
  subtitle: string;
  summary?: ReactNode;
  state: StepState;
  onEdit?: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const wasActive = useRef(state === "active");
  const reduced = reducedMotion();

  // When a step opens because the one above it closed, the page jumps; bring
  // the new step's header into view. Not on first render — that opens at top.
  // Waits out the collapse above, which would otherwise shift the target
  // mid-scroll.
  useEffect(() => {
    const opened = state === "active" && !wasActive.current;
    wasActive.current = state === "active";
    if (!opened) return;
    const timer = window.setTimeout(
      () => ref.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" }),
      reduced ? 0 : COLLAPSE_MS + 20,
    );
    return () => window.clearTimeout(timer);
  }, [state, reduced]);

  const open = state === "active";
  return (
    <section
      ref={ref}
      aria-labelledby={`onboarding-step-${n}`}
      className={cn(
        "scroll-mt-24 rounded-xl border transition-shadow duration-200",
        open ? "border-border bg-card shadow-2" : "border-border/70 bg-card/70",
      )}
    >
      <div className="flex items-center gap-4 px-5 py-5 sm:px-8">
        <StepDot n={n} state={state} large />
        <div className="min-w-0 flex-1">
          <h2
            id={`onboarding-step-${n}`}
            className={cn(
              "text-base font-semibold tracking-tight sm:text-lg",
              state === "upcoming" ? "text-muted-foreground" : "text-ink",
            )}
          >
            {title}
          </h2>
          {state === "active" && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
          {state === "done" && summary && (
            <div className="mt-0.5 truncate text-sm text-muted-foreground">{summary}</div>
          )}
        </div>
        {state === "done" && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : COLLAPSE_MS / 1000, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 pb-7 pt-6 sm:px-8 sm:pb-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
