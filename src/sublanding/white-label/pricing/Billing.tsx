import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BILLING } from "./content";
import { FirstCharge } from "./FirstCharge";
import { FOCUS, Lead, Section, SectionTitle } from "./parts";

/**
 * The invoice over a client's life: the first charge as an interaction, then
 * every event on one rule, then what to write into client terms because of it.
 */
export function Billing() {
  return (
    <Section id="billing" className="border-t border-border/70">
      <SectionTitle id="billing" />
      <Lead>{BILLING.intro}</Lead>

      <div className="mt-12">
        <FirstCharge />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
        <div>
          <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
            {BILLING.eventsTitle}
          </h3>
          <dl className="mt-6 border-l border-ink/10">
            {BILLING.events.map((e) => (
              <div key={e.when} className="relative pb-7 pl-7 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[4.5px] top-[0.4rem] h-2 w-2 rounded-full border-2 border-white bg-cta ring-1 ring-cta/30"
                />
                <dt className="text-sm font-semibold text-ink">{e.when}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink/75">{e.what}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside aria-labelledby="billing-advice" className="lg:pt-1">
          <div className="rounded-xl border border-border bg-surface/60 p-6">
            <h3
              id="billing-advice"
              className="text-[1.05rem] font-semibold tracking-tight text-ink"
            >
              {BILLING.adviceTitle}
            </h3>
            <ol className="mt-4 space-y-3.5">
              {BILLING.advice.map((a, i) => (
                <li key={a} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                  <span aria-hidden className="w-4 shrink-0 tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ol>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {BILLING.docs.map((d) => (
              <li key={d.href}>
                <Link
                  to={d.href}
                  className={cn(
                    "group inline-flex items-center gap-1 rounded-sm text-sm font-medium text-ink transition-colors hover:text-cta",
                    FOCUS,
                  )}
                >
                  {d.label}
                  <ArrowUpRight
                    aria-hidden
                    className="h-3.5 w-3.5 text-muted-foreground group-hover:text-cta"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
