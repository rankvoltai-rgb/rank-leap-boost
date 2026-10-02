import { ArrowUpRight } from "lucide-react";
import { Appear } from "./Appear";
import { PageLink } from "./PageLink";
import { YOURS, h2 } from "./content";

/**
 * The payoff to the hero: the to-do list again, this time with Rankbox on.
 * Three items, two of them once. Same empty checkbox as the month above, so
 * the two lists read as before and after without saying so.
 */
export function StillYours() {
  return (
    <section id="still-yours" aria-labelledby="still-yours-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <Appear>
          <h2
            id="still-yours-title"
            className="text-balance font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.6rem]"
          >
            {h2("still-yours")}
          </h2>
          <p className="mt-5 text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
            {YOURS.intro}
          </p>
        </Appear>

        <Appear delay={0.05} className="mt-10">
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-1">
            {YOURS.items.map((item) => (
              <li
                key={item.title}
                className="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-x-4 px-5 py-6 sm:px-7"
              >
                <span
                  aria-hidden
                  className="mt-[3px] h-[1.125rem] w-[1.125rem] rounded-[5px] border border-muted-foreground/35 bg-card"
                />
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-snug text-ink">{item.title}</h3>
                    <span className="mt-px shrink-0 whitespace-nowrap rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {item.when}
                    </span>
                  </div>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                    {"source" in item && item.source && (
                      <>
                        {" "}
                        <a
                          href={item.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whitespace-nowrap text-ink underline decoration-border underline-offset-4 transition-colors hover:text-cta hover:decoration-cta"
                        >
                          {item.source.label}
                        </a>
                      </>
                    )}
                  </p>
                  {"link" in item && item.link && (
                    <PageLink
                      target={item.link.target}
                      className="group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cta"
                    >
                      <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-cta">
                        {item.link.label}
                      </span>
                      <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                    </PageLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Appear>

        <p className="mt-6 text-sm text-muted-foreground">
          {YOURS.diy.lead}{" "}
          <PageLink
            target={YOURS.diy.target}
            className="font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-cta hover:decoration-cta"
          >
            {YOURS.diy.label}
          </PageLink>
        </p>
      </div>
    </section>
  );
}
