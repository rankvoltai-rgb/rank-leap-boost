import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TRIAL_DAYS } from "@/lib/data";
import { Button } from "@/components/dashboard/primitives";
import { CheckIcon, VoltMark } from "@/components/dashboard/icons";

/**
 * A page that comes with the plan, shown to someone without one: the real page
 * stays in view — blurred and out of reach — under a frosted card that says
 * what it's for and starts the trial. Seeing the value beats reading about it.
 *
 * Pass `locked` only once the subscription is known, so paying users never see
 * the gate flash on load.
 */
export function SubscriptionGate({
  locked,
  title,
  description,
  points,
  onStartTrial,
  className,
  children,
}: {
  locked: boolean;
  /** Spacing for the page's sections — the same whether gated or not. */
  className?: string;
  title: string;
  description: string;
  points: string[];
  onStartTrial: () => void;
  children: ReactNode;
}) {
  if (!locked) return <div className={className}>{children}</div>;

  return (
    <div className="relative">
      {/* The page as a preview: blurred, faded out, and inert — no focus, no clicks,
          nothing read aloud. It's capped in height, since there's nothing to scroll to. */}
      <div
        aria-hidden
        inert
        className={cn(
          "pointer-events-none max-h-[40rem] select-none overflow-hidden blur-[5px] [mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)]",
          className,
        )}
      >
        {children}
      </div>

      <div className="absolute inset-0 flex justify-center px-4 pt-10 sm:pt-20">
        <section
          aria-labelledby="gate-title"
          className="glass h-fit w-full max-w-md rounded-card p-7 text-center shadow-elevation-lg"
        >
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-card bg-brand-blue text-white">
            <VoltMark className="h-5 w-5" />
          </span>
          <h2 id="gate-title" className="mt-4 text-lg font-semibold tracking-tight text-ink">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          <ul className="mt-5 space-y-2 text-left">
            {points.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-ink">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {p}
              </li>
            ))}
          </ul>
          <Button variant="brand" className="mt-6 w-full" onClick={onStartTrial}>
            Start {TRIAL_DAYS}-day free trial
          </Button>
          <p className="mt-2.5 text-xs text-muted-foreground">No charge today.</p>
        </section>
      </div>
    </div>
  );
}
