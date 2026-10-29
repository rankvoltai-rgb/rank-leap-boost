import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEEP } from "./content";
import { Go } from "./Go";
import { SectionHead } from "./SectionHead";
import { CARD, FOCUS, SECTION, WRAP } from "./ui";

/**
 * The map to the three deep dives: each card is one link, with the questions
 * that page answers, so the visitor picks by the question they have.
 */
export function DeepDives() {
  return (
    <section
      id="deep-dives"
      aria-labelledby="deep-dives-title"
      className={cn(SECTION, "border-t border-border")}
    >
      <div className={WRAP}>
        <SectionHead id="deep-dives" kicker={DEEP.kicker} intro={DEEP.intro} />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {DEEP.pages.map((p) => (
            <li key={p.href}>
              <Go
                href={p.href}
                className={cn(
                  CARD,
                  FOCUS,
                  "group flex h-full flex-col p-6 transition-[border-color,box-shadow] duration-200 hover:border-cta/40 hover:shadow-[0_18px_40px_-28px_color-mix(in_oklab,var(--cta)_45%,transparent)] sm:p-7",
                )}
              >
                <span className="flex items-center justify-between text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-cta">
                  {p.label}
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 text-muted-foreground transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cta motion-reduce:transition-none"
                  />
                </span>
                <h3 className="mt-3 text-[1.15rem] font-semibold leading-snug tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{p.body}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-4">
                  {p.asks.map((a) => (
                    <li key={a} className="text-[0.86rem] text-ink/80">
                      {a}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto pt-6 text-[0.86rem] font-semibold text-cta">
                  {DEEP.open}
                </span>
              </Go>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
