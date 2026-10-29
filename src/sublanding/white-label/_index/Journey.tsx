import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { JOURNEY } from "./content";
import { rankboxVisible } from "./visibility";
import { SectionHead } from "./SectionHead";
import { CARD, SECTION, WRAP } from "./ui";

/**
 * The client's side, as a timeline of touchpoints. Each one says who's
 * involved, what they see and whether the Rankbox name is in view; the one
 * place it is gets the page's blue, and the count beside the heading is
 * worked out from the steps, so it can't drift from them.
 */
export function Journey() {
  const { visible, total } = rankboxVisible(JOURNEY.steps);
  return (
    <section id="journey" aria-labelledby="journey-title" className={SECTION}>
      <div
        className={cn(WRAP, "grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-16")}
      >
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHead id="journey" kicker={JOURNEY.kicker} intro={JOURNEY.intro} />
          <div className={cn(CARD, "mt-8 p-6")}>
            <p className="text-[0.86rem] text-muted-foreground">{JOURNEY.countLead}</p>
            <p className="mt-2 flex items-baseline gap-2 font-display text-ink">
              <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.03em] text-cta">
                {visible}
              </span>
              <span className="text-[1.05rem] font-medium">
                {JOURNEY.countOf} {total}
              </span>
            </p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
              {JOURNEY.countTail}
            </p>
          </div>
        </div>

        <ol className="relative">
          {JOURNEY.steps.map((s, i) => {
            const shown = s.visibility !== "hidden";
            return (
              <li key={s.title} className="relative pb-10 pl-12 last:pb-0">
                {i < JOURNEY.steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-[0.9rem] top-9 w-px bg-border"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-0.5 flex h-[1.8rem] w-[1.8rem] items-center justify-center rounded-full border text-[0.74rem] font-semibold tabular-nums",
                    shown
                      ? "border-cta bg-cta text-white"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.72rem] font-medium",
                      shown ? "bg-cta-soft text-cta" : "bg-surface text-muted-foreground",
                    )}
                  >
                    {shown ? (
                      <Eye aria-hidden className="h-3 w-3" />
                    ) : (
                      <EyeOff aria-hidden className="h-3 w-3" />
                    )}
                    {JOURNEY.badge[s.visibility]}
                  </span>
                </div>
                <dl className="mt-3 grid gap-1.5 text-[0.92rem] leading-relaxed sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-x-4">
                  <dt className="text-muted-foreground">{JOURNEY.whoLabel}</dt>
                  <dd className="text-ink/85">{s.who}</dd>
                  <dt className="mt-1 text-muted-foreground sm:mt-0">{JOURNEY.seesLabel}</dt>
                  <dd className="text-ink/85">{s.sees}</dd>
                </dl>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
