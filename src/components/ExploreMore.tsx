import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Compass } from "lucide-react";
import { crossLinks } from "@/data/link-graph";
import { cn } from "@/lib/utils";
import { Band, LINE, Pill, Spacer } from "@/components/landing/frame";

/**
 * "Keep exploring": the links from a page into the other sections of its
 * topic — the feature that solves the problem, the guide that explains it,
 * the free tool, the comparison — with the glossary terms as a row of chips.
 *
 * Every section's own "related" block stays within the section; this is the
 * one that crosses them. Which pages it picks, and why, is in
 * src/data/link-graph.ts. Plain server-rendered links, so crawlers that never
 * run JavaScript follow them too.
 *
 * `exclude` takes the paths the page already links to, so the block only adds
 * new places to go.
 */
export function ExploreMore({
  path,
  exclude,
  className,
  framed = false,
}: {
  path: string;
  exclude?: readonly string[];
  className?: string;
  /** Drawn in the landing page's frame (hairline rails and bands). */
  framed?: boolean;
}) {
  const links = crossLinks(path, exclude);
  if (!links || links.cards.length + links.terms.length === 0) return null;
  const { topic, cards, terms } = links;
  if (framed) {
    return (
      <section aria-labelledby="explore-title" className={className}>
        <Spacer />
        <Band inner="px-6 py-10 sm:px-10 lg:px-12">
          <Pill icon={Compass}>Keep exploring</Pill>
          <h2
            id="explore-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            {topic.title}
          </h2>
        </Band>

        {cards.length > 0 && (
          <Band>
            {/* Hairline cells: each draws its right and bottom edge, and the
                grid overhangs by a pixel so the outer ones fall under the
                rails, clipped, whatever the number of cards. */}
            <div className="overflow-hidden">
              <ul className="-mb-px -mr-px grid sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                  <li key={card.href} className={cn("border-b border-r", LINE)}>
                    <Link
                      to={card.href}
                      className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-7"
                    >
                      <span className="flex items-center justify-between gap-3 text-[0.75rem] font-medium text-muted-foreground">
                        {card.label}
                        <ArrowUpRight
                          aria-hidden
                          className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                        />
                      </span>
                      <span className="mt-2 text-[1rem] font-semibold leading-snug tracking-tight text-ink">
                        {card.title}
                      </span>
                      {card.blurb && (
                        <span className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                          {card.blurb}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Band>
        )}

        {terms.length > 0 && (
          <Band inner="flex flex-wrap items-center gap-2 px-6 py-6 sm:px-10 lg:px-12">
            <h3 className="mr-1 text-sm font-medium text-ink">Key terms</h3>
            <ul className="contents">
              {terms.map((term) => (
                <li key={term.href}>
                  <Link
                    to={term.href}
                    className="inline-flex items-center rounded-lg border border-ink/[0.08] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-ink/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-brand-blue/40 hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
                  >
                    {term.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Band>
        )}
      </section>
    );
  }
  return (
    <section aria-labelledby="explore-title" className={cn("border-t border-border", className)}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cta">
          Keep exploring
        </p>
        <h2
          id="explore-title"
          className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
        >
          {topic.title}
        </h2>

        {cards.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <li key={card.href}>
                <Link
                  to={card.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-1 transition-all hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt"
                >
                  <span className="flex items-center justify-between gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {card.label}
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-volt"
                    />
                  </span>
                  <span className="mt-2 font-display text-[1.02rem] font-semibold leading-snug tracking-tight text-ink">
                    {card.title}
                  </span>
                  {card.blurb && (
                    <span className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                      {card.blurb}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {terms.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <h3 className="mr-1 text-sm font-semibold text-ink">Key terms</h3>
            <ul className="contents">
              {terms.map((term) => (
                <li key={term.href}>
                  <Link
                    to={term.href}
                    className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:border-ink/25 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt"
                  >
                    {term.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
