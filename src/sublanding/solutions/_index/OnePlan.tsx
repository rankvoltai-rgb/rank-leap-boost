import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { startSignup } from "@/sublanding/_shared/facts";
import { PLAN_BAND, h2 } from "./content";

/**
 * The one sales moment on the hub, kept flat: no card, no shadow. Left, what
 * every solutions page is selling (the same product). Right, the price, the
 * trial terms and the single blue button.
 */
export function OnePlan() {
  return (
    <section
      id="plan"
      aria-labelledby="plan-title"
      className="border-t border-border py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-0">
        <div className="lg:pr-14">
          <h2
            id="plan-title"
            className="max-w-xl text-balance font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]"
          >
            {h2("plan")}
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {PLAN_BAND.body}
          </p>

          <h3 className="sr-only">{PLAN_BAND.allowancesLabel}</h3>
          <dl className="mt-8 grid grid-cols-3 divide-x divide-border border-y border-border">
            {PLAN_BAND.allowances.map((a) => (
              <div
                key={a.unit}
                className="flex flex-col-reverse gap-1 px-3 py-4 first:pl-0 sm:px-5"
              >
                <dt className="text-xs leading-snug text-muted-foreground">{a.unit}</dt>
                <dd className="font-display text-2xl font-semibold tracking-tight text-ink tabular-nums sm:text-3xl">
                  {a.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {PLAN_BAND.trialNote} {PLAN_BAND.publishing}
          </p>
        </div>

        <div className="flex flex-col justify-center lg:border-l lg:border-border lg:pl-14">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-bold tracking-tight text-ink tabular-nums">
              {PLAN_BAND.price}
            </span>
            <span className="text-sm text-muted-foreground">{PLAN_BAND.per}</span>
          </p>
          <button
            type="button"
            onClick={() => startSignup()}
            className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cta px-6 text-[0.98rem] font-semibold text-white shadow-2 transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:w-auto sm:self-start"
          >
            {PLAN_BAND.cta}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </button>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
            {PLAN_BAND.terms}
          </p>
          <Link
            to="/pricing"
            className="mt-5 inline-flex w-fit items-center gap-1 rounded-sm text-sm font-medium text-cta hover:text-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
          >
            {PLAN_BAND.pricingLink}
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
