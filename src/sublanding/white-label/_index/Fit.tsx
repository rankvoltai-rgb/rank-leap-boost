import { Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIT } from "./content";
import { SectionHead } from "./SectionHead";
import { CARD, SECTION, WRAP } from "./ui";

/**
 * Who runs client content this way: four kinds of team as a roster, each
 * with what they sell and where Rankbox sits. Then the honest exit for a
 * visitor who came for full-service SEO.
 */
export function Fit() {
  return (
    <section id="fit" aria-labelledby="fit-title" className={SECTION}>
      <div className={WRAP}>
        <SectionHead id="fit" kicker={FIT.kicker} intro={FIT.intro} />

        <div className="mt-12 border-t border-border">
          <div
            aria-hidden
            className="hidden grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1.35fr)] gap-8 border-b border-border py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:grid"
          >
            <span />
            <span>{FIT.sellsLabel}</span>
            <span>{FIT.fitsLabel}</span>
          </div>
          <ul>
            {FIT.teams.map((t) => (
              <li
                key={t.who}
                className="grid gap-3 border-b border-border py-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1.35fr)] md:gap-8"
              >
                <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">{t.who}</h3>
                <p className="text-[0.93rem] leading-relaxed text-ink/80">
                  <span className="mb-0.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:hidden">
                    {FIT.sellsLabel}
                  </span>
                  {t.sells}
                </p>
                <p className="text-[0.93rem] leading-relaxed text-muted-foreground">
                  <span className="mb-0.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:hidden">
                    {FIT.fitsLabel}
                  </span>
                  {t.fits}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className={cn(CARD, "mt-10 bg-surface p-6 sm:p-8")}>
          <h3 className="text-[1rem] font-semibold text-ink">{FIT.notFit.title}</h3>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {FIT.notFit.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[0.92rem] text-ink/80">
                <Minus
                  aria-hidden
                  className="mt-[0.3em] h-3.5 w-3.5 shrink-0 text-muted-foreground"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.88rem] leading-relaxed text-muted-foreground">
            {FIT.notFit.note}
          </p>
        </div>
      </div>
    </section>
  );
}
