import { cn } from "@/lib/utils";
import { CLOSING } from "./content";
import { SectionHead } from "./SectionHead";
import { StudioButton } from "./StudioButton";
import { CARD, SECTION, WRAP } from "./ui";

/** The close: one action, and the trial's terms in full. */
export function Closing() {
  return (
    <section id="start" aria-labelledby="start-title" className={SECTION}>
      <div className={WRAP}>
        <div className={cn(CARD, "relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16")}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,var(--cta-soft),transparent_70%)]"
          />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
            <SectionHead id="start" kicker={CLOSING.kicker} intro={CLOSING.body} />
            <div className="lg:justify-self-end">
              <StudioButton />
              <p className="mt-3 max-w-sm text-[0.8rem] leading-relaxed text-muted-foreground">
                {CLOSING.terms}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
