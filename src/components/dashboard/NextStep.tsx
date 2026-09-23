/**
 * The one thing worth doing next, at the top of the Overview.
 *
 * Every state that used to have its own banner — no trial yet, no site
 * connected, nothing published, out of credits, autopilot paused — resolves
 * here to a single sentence and a single blue button. A screen with one
 * obvious action converts; a screen with four quiet ones doesn't.
 *
 * The launch checklist underneath shows how far along the account is, so the
 * step being asked for reads as progress rather than a nag. It disappears for
 * good once all three steps are done.
 */
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "./primitives";

export interface LaunchStep {
  id: string;
  label: string;
  done: boolean;
}

export function NextStepCard({
  eyebrow,
  title,
  body,
  action,
  note,
  aside,
  steps,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  /** The single primary action. */
  action: ReactNode;
  /** A reassurance line under the action, e.g. "No charge today". */
  note?: ReactNode;
  /** Quiet supporting proof beneath the body, e.g. the AI engines row. */
  aside?: ReactNode;
  steps?: LaunchStep[];
}) {
  const current = steps?.find((s) => !s.done)?.id;
  return (
    <Panel className="overflow-hidden border-cta/25 shadow-[0_1px_2px_color-mix(in_oklab,var(--cta)_8%,transparent),0_12px_32px_-18px_color-mix(in_oklab,var(--cta)_35%,transparent)]">
      <div className="flex flex-col gap-6 bg-[image:var(--gradient-surface)] p-6 sm:p-7 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cta">{eyebrow}</p>
          <h2 className="font-display mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {title}
          </h2>
          {body && <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{body}</p>}
          {aside && <div className="mt-4">{aside}</div>}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {action}
          {note && <p className="text-xs text-muted-foreground sm:text-right">{note}</p>}
        </div>
      </div>

      {steps && (
        <ol
          className="grid border-t border-border bg-card sm:grid-cols-3"
          aria-label="Launch checklist"
        >
          {steps.map((step, i) => {
            const isCurrent = step.id === current;
            return (
              <li
                key={step.id}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-3 px-6 py-3.5 text-sm",
                  i > 0 && "border-t border-border sm:border-l sm:border-t-0",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums",
                    step.done
                      ? "bg-success text-white"
                      : isCurrent
                        ? "bg-cta text-white ring-4 ring-cta/15"
                        : "border border-border bg-card text-muted-foreground",
                  )}
                >
                  {step.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={cn(
                    "truncate",
                    step.done
                      ? "text-muted-foreground"
                      : isCurrent
                        ? "font-medium text-ink"
                        : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}

/** A slim meter under a stat, filled in the CTA blue. */
export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
    >
      <div
        className="h-full rounded-full bg-cta transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
