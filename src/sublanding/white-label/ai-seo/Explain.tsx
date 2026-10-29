import { ArrowUpRight } from "lucide-react";
import { EXPLAIN, READ_ON, SOURCES } from "./content";
import { Heading } from "./Heading";
import { PageLink } from "./PageLink";

const linkClass =
  "rounded-sm text-[0.82rem] font-medium text-cta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta";

/**
 * Section 3: the client meeting. The heading holds still on wide screens
 * while five questions a client actually asks run down the right, each answer
 * written to be said out loud and each with a source the agency can forward.
 */
export function Explain() {
  return (
    <section
      id="explain"
      aria-labelledby="explain-title"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <Heading
            id="explain"
            kicker={EXPLAIN.kicker}
            intro={EXPLAIN.intro}
            className="lg:sticky lg:top-28"
          />
        </div>

        <ol className="space-y-12">
          {EXPLAIN.items.map((item, i) => {
            const source = "source" in item && item.source ? SOURCES[item.source] : undefined;
            return (
              <li key={item.q} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4">
                <span
                  aria-hidden
                  className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card font-mono text-[0.72rem] text-muted-foreground"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-pretty text-[1.12rem] font-semibold leading-snug tracking-tight text-ink">
                    “{item.q}”
                  </h3>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{item.a}</p>
                  {source && (
                    <p className="mt-3 text-[0.82rem] text-muted-foreground">
                      {EXPLAIN.sourceLead}{" "}
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
                      {`, ${READ_ON}`}
                    </p>
                  )}
                  {"link" in item && item.link && (
                    <PageLink
                      target={item.link.target}
                      className={`mt-3 inline-block ${linkClass}`}
                    >
                      {item.link.label}
                    </PageLink>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
