import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BILLING } from "./content";
import { Go } from "./Go";
import { SectionHead } from "./SectionHead";
import { SECTION, TEXT_LINK, WRAP } from "./ui";

/**
 * Billing in brief: one number and five rules. The maths (cost per client,
 * packaging, margin) is the pricing deep dive's job, so this section points
 * there instead of computing anything.
 */
export function Billing() {
  return (
    <section id="billing" aria-labelledby="billing-title" className={SECTION}>
      <div
        className={cn(WRAP, "grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-16")}
      >
        <div>
          <SectionHead id="billing" kicker={BILLING.kicker} />
          <p className="mt-10 font-display text-[3.4rem] font-semibold leading-none tracking-[-0.04em] text-ink sm:text-[4.2rem]">
            {BILLING.figure}
          </p>
          <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-muted-foreground">
            {BILLING.figureLabel}
          </p>
        </div>

        <div className="lg:pt-14">
          <ul className="divide-y divide-border border-y border-border">
            {BILLING.rules.map((r) => (
              <li key={r} className="py-4 text-[0.95rem] leading-relaxed text-ink/85">
                {r}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <Go
              href="/white-label/pricing"
              className={cn(TEXT_LINK, "inline-flex items-center gap-1.5 text-[0.95rem]")}
            >
              {BILLING.pricingLink}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Go>
            <Go href="/pricing" className={cn(TEXT_LINK, "text-[0.9rem]")}>
              {BILLING.planLink}
            </Go>
            <Go href="/docs/account/studio" className={cn(TEXT_LINK, "text-[0.9rem]")}>
              {BILLING.guideLink}
            </Go>
          </div>
        </div>
      </div>
    </section>
  );
}
