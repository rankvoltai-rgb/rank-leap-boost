import { ArrowRight, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { GAPS } from "./content";
import { Go } from "./Go";
import { SectionHead } from "./SectionHead";
import { CARD, SECTION, TEXT_LINK, WRAP } from "./ui";

/**
 * What isn't white-label yet, as a two-column list: the missing piece in
 * dashed outline, and what agencies do instead. The rows are built from
 * SHIPPED and addonLive, so a piece leaves the list the day it ships.
 */
export function Gaps() {
  return (
    <section id="gaps" aria-labelledby="gaps-title" className={cn(SECTION, "bg-surface")}>
      <div className={WRAP}>
        <SectionHead id="gaps" kicker={GAPS.kicker} intro={GAPS.intro} />

        <div className={cn(CARD, "mt-12 overflow-hidden")}>
          <div
            aria-hidden
            className="hidden grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] border-b border-border bg-surface/60 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:grid"
          >
            <span className="px-6 py-3">{GAPS.missingLabel}</span>
            <span className="border-l border-border px-6 py-3">{GAPS.insteadLabel}</span>
          </div>
          <dl>
            {GAPS.rows.map((g) => (
              <div
                key={g.missing}
                className="grid border-b border-border last:border-b-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]"
              >
                <dt className="flex items-start gap-2.5 px-5 pb-2 pt-5 text-[0.95rem] font-semibold text-ink sm:px-6 md:pb-5">
                  <CircleDashed
                    aria-hidden
                    className="mt-[0.2em] h-4 w-4 shrink-0 text-muted-foreground"
                  />
                  {g.missing}
                </dt>
                <dd className="px-5 pb-5 pl-[3.1rem] text-[0.92rem] leading-relaxed text-muted-foreground sm:px-6 sm:pl-[3.35rem] md:border-l md:border-border md:pl-6 md:pt-5">
                  {g.instead}
                  {g.link && (
                    <Go
                      href={g.link.href}
                      className={cn(
                        TEXT_LINK,
                        "mt-1.5 flex w-fit items-center gap-1 text-[0.86rem]",
                      )}
                    >
                      {g.link.label}
                      <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                    </Go>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
