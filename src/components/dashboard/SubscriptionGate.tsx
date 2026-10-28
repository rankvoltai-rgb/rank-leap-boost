import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/dashboard/primitives";
import { CheckIcon, VoltMark } from "@/components/dashboard/icons";
import { BILLING_FIX_LABEL, useBilling } from "@/components/dashboard/billing-context";

/**
 * A page that comes with the plan, shown while billing stops the account: the
 * real page stays in view — blurred and out of reach — under a frosted card
 * that says what it's for and the one fix that unlocks it. Seeing the value
 * beats reading about it.
 *
 * Pass `locked` only once the subscription is known, so paying users never see
 * the gate flash on load.
 */
export function SubscriptionGate({
  locked,
  title,
  description,
  points,
  className,
  children,
}: {
  locked: boolean;
  /** Spacing for the page's sections — the same whether gated or not. */
  className?: string;
  title: string;
  description: string;
  points: string[];
  children: ReactNode;
}) {
  const billing = useBilling();
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
          <Button
            variant="brand"
            className="mt-6 w-full"
            onClick={billing.fix}
            disabled={billing.busy}
          >
            {billing.issue ? BILLING_FIX_LABEL[billing.issue] : "Fix billing"}
          </Button>
          <p className="mt-2.5 text-xs text-muted-foreground">
            Everything here unlocks as soon as billing is sorted.
          </p>
        </section>
      </div>
    </div>
  );
}
