/**
 * Onboarding chrome.
 *
 * One step on screen at a time, in a single reading column, with the running
 * summary (projection, what's been confirmed, one customer quote) in a rail on
 * the right. Progress is shown once, in the header; the previous layout showed
 * it three times (header, stacked accordion cards, a percentage bar) and put
 * testimonials, the form and the projection in three competing columns.
 *
 * Each step ends in an ActionBar that sticks to the bottom of the viewport, so
 * the primary action stays in reach however long the keyword list or plan is.
 */
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, CloudCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/landing/shared";
import { PARTS, reducedMotion } from "./constants";

export type Step = 1 | 2 | 3;

/** A short celebratory particle burst anchored to its parent. */
export function Burst() {
  if (reducedMotion()) return null;
  const particles = Array.from({ length: 10 });
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 26 + (i % 3) * 10;
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
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute h-1.5 w-1.5 rounded-full bg-white"
          />
        );
      })}
    </span>
  );
}

/**
 * Three segments that fill as steps complete. Finished steps are links back;
 * the current and later ones are not, so nobody skips ahead of the analysis.
 */
function Progress({ active, onStep }: { active: Step; onStep: (step: Step) => void }) {
  return (
    <nav aria-label="Setup progress">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {PARTS.map((part) => {
          const done = part.n < active;
          const current = part.n === active;
          return (
            <li key={part.n}>
              <button
                type="button"
                disabled={!done}
                onClick={() => onStep(part.n)}
                aria-current={current ? "step" : undefined}
                aria-label={`Step ${part.n}: ${part.title}${done ? " (done, edit)" : ""}`}
                className="group flex w-12 flex-col gap-1.5 text-left disabled:cursor-default sm:w-24"
              >
                <span
                  className={cn(
                    "h-1 w-full rounded-full transition-colors duration-300",
                    done || current ? "bg-brand-blue" : "bg-border",
                    done && "group-hover:bg-brand-blue/70",
                  )}
                />
                <span
                  className={cn(
                    "hidden items-center gap-1 text-xs transition-colors sm:flex",
                    current && "font-semibold text-ink",
                    done && "font-medium text-ink group-hover:text-brand-blue",
                    !done && !current && "text-muted-foreground",
                  )}
                >
                  {done && <Check className="h-3 w-3 text-brand-blue" strokeWidth={3} />}
                  {part.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function OnboardingShell({
  active,
  onStep,
  rail,
  children,
}: {
  active: Step;
  onStep: (step: Step) => void;
  /** Desktop right rail. Below lg the steps carry a compact summary instead. */
  rail: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 lg:px-8">
          <a href="/" className="justify-self-start" aria-label="Rankbox home">
            <Logo />
          </a>
          <Progress active={active} onStep={onStep} />
          <p className="flex items-center gap-1.5 justify-self-end text-xs text-muted-foreground">
            <span className="sm:hidden">
              {active} of {PARTS.length}
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <CloudCheck className="h-3.5 w-3.5" />
              Progress saved
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1180px] gap-12 px-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:gap-20">
        <main className="min-w-0 pt-8 sm:pt-12 lg:pt-14">
          <div className="mx-auto max-w-[42rem] lg:mx-0">{children}</div>
        </main>
        <aside className="hidden pt-14 lg:block">
          <div className="sticky top-[5.5rem]">{rail}</div>
        </aside>
      </div>
    </div>
  );
}

/** The heading every step opens with. */
export function StepHeader({
  n,
  title,
  subtitle,
}: {
  n: Step;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <header className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">
        Step {n} of {PARTS.length}
      </p>
      <h1 className="font-display mt-2.5 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.125rem]">
        {title}
      </h1>
      <p className="mt-2.5 max-w-[36rem] text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    </header>
  );
}

export const PRIMARY_BUTTON =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 text-sm font-semibold text-white shadow-2 transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 active:translate-y-0 disabled:translate-y-0 disabled:opacity-50 sm:px-6";

/**
 * The step's footer: Back on the left, a short reassurance, the primary action
 * on the right. Sticks to the bottom of the viewport while the step scrolls.
 */
export function ActionBar({
  onBack,
  note,
  children,
}: {
  onBack?: () => void;
  note?: ReactNode;
  /** The primary action. */
  children: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-5 mt-10 border-t border-border/70 bg-background/90 px-5 py-4 backdrop-blur-md sm:mx-0 sm:px-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
        <div className="min-w-0 flex-1 text-xs leading-snug text-muted-foreground">{note}</div>
        {children}
      </div>
    </div>
  );
}
