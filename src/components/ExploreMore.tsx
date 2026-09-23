import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { crossLinks } from "@/data/link-graph";
import { cn } from "@/lib/utils";

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
}: {
  path: string;
  exclude?: readonly string[];
  className?: string;
}) {
  const links = crossLinks(path, exclude);
  if (!links || links.cards.length + links.terms.length === 0) return null;
  const { topic, cards, terms } = links;
  return (
    <section aria-labelledby="explore-title" className={cn("border-t border-border", className)}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-volt">
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
