import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ENGINE_MARKS } from "@/components/landing/ai-logos";
import { getEngine } from "@/data/ai-seo/engines";
import { ENGINE_NOTES, OTHER_ENGINES, SOURCES, type SourceId } from "./content";
import { Heading } from "./Heading";
import { PageLink } from "./PageLink";

const COLS = ENGINE_NOTES.columns;

/** Every source the rows rest on, once each, in the order they first appear. */
function rowSources(): SourceId[] {
  return [...new Set(ENGINE_NOTES.rows.flatMap((r) => r.sources))];
}

/**
 * Section 5: one line per engine, the two things an agency sets up for each
 * client: the crawler to let in, and what the vendor shows the site owner.
 * Everything else lives in that engine's guide, linked from the row. A real
 * table on wide screens; each row stacks into a block on a phone.
 */
export function EngineNotes() {
  return (
    <section
      id="engines"
      aria-labelledby="engines-title"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Heading id="engines" intro={ENGINE_NOTES.intro} />

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full border-collapse text-left max-md:block">
            <thead className="max-md:sr-only">
              <tr className="border-b border-border bg-surface/60 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  {COLS.engine}
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  {COLS.allow}
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold">
                  {COLS.report}
                </th>
                <th scope="col" className="px-6 py-3.5 text-right font-semibold">
                  <span className="sr-only">{COLS.guide}</span>
                </th>
              </tr>
            </thead>
            <tbody className="max-md:block">
              {ENGINE_NOTES.rows.map((row) => {
                const engine = getEngine(row.slug)!;
                const Mark = ENGINE_MARKS[engine.mark];
                return (
                  <tr
                    key={row.slug}
                    className="border-b border-border last:border-b-0 max-md:block max-md:px-5 max-md:py-5"
                  >
                    <th
                      scope="row"
                      className="px-6 py-5 align-top font-normal max-md:block max-md:p-0"
                    >
                      <span className="flex items-center gap-2.5">
                        <Mark className="h-5 w-5 shrink-0" />
                        <span className="font-semibold text-ink">{engine.name}</span>
                      </span>
                    </th>
                    <td className="px-6 py-5 align-top max-md:mt-3 max-md:block max-md:p-0">
                      <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:hidden">
                        {COLS.allow}
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {row.allow.map((token) => (
                          <code
                            key={token}
                            className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.78rem] text-ink"
                          >
                            {token}
                          </code>
                        ))}
                      </span>
                    </td>
                    <td className="max-w-md px-6 py-5 align-top text-pretty text-sm leading-relaxed text-muted-foreground max-md:mt-3 max-md:block max-md:max-w-none max-md:p-0">
                      <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.08em] md:hidden">
                        {COLS.report}
                      </span>
                      {row.report}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-right align-top max-md:mt-3 max-md:block max-md:p-0 max-md:text-left">
                      <PageLink
                        target={{ kind: "engine", slug: row.slug }}
                        className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-cta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
                      >
                        {ENGINE_NOTES.guide}
                        <span className="sr-only">: {engine.name}</span>
                        <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                      </PageLink>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-semibold text-ink">{ENGINE_NOTES.moreLabel}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {OTHER_ENGINES.map((e) => {
              const Mark = ENGINE_MARKS[e.mark];
              return (
                <li key={e.slug}>
                  <PageLink
                    target={{ kind: "engine", slug: e.slug }}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-sm text-ink transition-colors hover:border-cta/40 hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
                  >
                    <Mark className="h-4 w-4 shrink-0" />
                    {e.name}
                  </PageLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">{ENGINE_NOTES.footnote}</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {rowSources().map((id) => (
              <li key={id}>
                <a
                  href={SOURCES[id].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm text-xs text-muted-foreground underline-offset-2 hover:text-cta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
                >
                  {SOURCES[id].label}
                  {"\u00a0"}
                  <ArrowUpRight aria-hidden className="inline h-3 w-3 align-[-1px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
