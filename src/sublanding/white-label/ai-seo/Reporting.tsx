import { ArrowRight, ArrowUpRight } from "lucide-react";
import { READ_ON, REPORTING, SOURCES } from "./content";
import { Heading } from "./Heading";
import { PageLink } from "./PageLink";
import { PromptPlanner } from "./PromptPlanner";

const linkClass =
  "rounded-sm text-[0.82rem] font-medium text-cta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta";

/**
 * Section 4: where every number in the client report comes from, said
 * plainly because Rankbox doesn't track citations. Four sources as plain
 * columns (no tiles), then the planner as the section's one interactive.
 */
export function Reporting() {
  return (
    <section
      id="reporting"
      aria-labelledby="reporting-title"
      className="scroll-mt-24 border-t border-border bg-surface/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Heading id="reporting" kicker={REPORTING.kicker} intro={REPORTING.intro} />

        <ul className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {REPORTING.sources.map((s) => {
            const source = "source" in s && s.source ? SOURCES[s.source] : undefined;
            return (
              <li key={s.id} className="border-t border-muted-foreground/30 pt-5">
                <h3 className="font-semibold tracking-tight text-ink">{s.name}</h3>
                <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {REPORTING.showsLabel}
                </p>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-ink/85">{s.shows}</p>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {s.since}
                </p>
                <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {REPORTING.missesLabel}
                </p>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {s.misses}
                </p>
                <div className="mt-3">
                  {source && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {source.label}
                      {"\u00a0"}
                      <ArrowUpRight aria-hidden className="inline h-3 w-3 align-[-1px]" />
                    </a>
                  )}
                  {source && (
                    <p className="mt-0.5 text-[0.75rem] text-muted-foreground">{READ_ON}</p>
                  )}
                  {"link" in s && s.link && (
                    <PageLink target={s.link.target} className={linkClass}>
                      {s.link.label}
                      {"\u00a0"}
                      <ArrowRight aria-hidden className="inline h-3 w-3 align-[-1px]" />
                    </PageLink>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-16">
          <PromptPlanner />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {REPORTING.more.lead}{" "}
          <PageLink
            target={REPORTING.more.target}
            className="rounded-sm font-medium text-cta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
          >
            {REPORTING.more.label}
          </PageLink>
          .
        </p>
      </div>
    </section>
  );
}
