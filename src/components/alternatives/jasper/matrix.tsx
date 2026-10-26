/**
 * Every row of the comparison, as one hairline table: the capability and why
 * it matters, then Rankbox's cell on a soft blue column and Jasper's on
 * white. Groups are spanning header rows, so the table reads as chapters.
 *
 * One table at every width. On a phone each row re-flows into a two-up (the
 * capability across the top, the two cells side by side under it, each
 * carrying its product's mark), so nothing scrolls sideways and nothing is
 * printed twice. The column heads stick under the navbar on desktop.
 */
import { Fragment, type ReactNode } from "react";
import { Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { formatCheckedOn, type Cell, type Competitor } from "@/data/alternatives";
import { Legend, StateToken } from "./parts";

const TINT = "bg-[color-mix(in_oklab,var(--cta)_4%,white)]";

function CellNote({ cell, who, mark }: { cell: Cell; who: string; mark: ReactNode }) {
  return (
    <>
      <span className="mb-2 flex items-center gap-1.5 md:hidden" aria-hidden>
        {mark}
        <span className="text-[0.7rem] font-semibold text-ink">{who}</span>
      </span>
      <span className="flex gap-2.5">
        <StateToken state={cell.state} size="md" className="mt-px" />
        <span
          className={cn(
            "text-[0.82rem] leading-snug",
            cell.state === "no" ? "text-muted-foreground" : "text-ink/85",
          )}
        >
          {cell.note}
        </span>
      </span>
    </>
  );
}

export function FullMatrix({ competitor }: { competitor: Competitor }) {
  const rowCount = competitor.matrix.reduce((n, g) => n + g.rows.length, 0);
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Columns2}
        eyebrow="Side by side"
        title={
          <span id="compare-title">
            Rankbox vs {competitor.name}, <Accent>in {rowCount} rows</Accent>
          </span>
        }
        subtitle={
          <>
            Every row is something a growth programme needs. Where {competitor.name} isn&rsquo;t
            built for one, we say what it <em>is</em> built for instead.
          </>
        }
      >
        <Legend className="mt-7" />
      </SectionHead>

      <Band>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Rankbox compared with {competitor.name}, capability by capability
          </caption>
          <thead className="hidden md:table-header-group">
            <tr>
              <th
                scope="col"
                className="sticky top-[var(--top-chrome)] z-10 w-[34%] border-b border-ink/[0.07] bg-white/95 px-8 py-4 text-[0.75rem] font-medium text-muted-foreground backdrop-blur lg:px-10"
              >
                Capability
              </th>
              <th
                scope="col"
                className={cn(
                  "sticky top-[var(--top-chrome)] z-10 w-[33%] border-b border-l px-6 py-4 backdrop-blur",
                  LINE,
                  "bg-[color-mix(in_oklab,var(--cta)_6%,white)]",
                )}
              >
                <span className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-cta">
                  <RankboxMark className="h-7 w-7" />
                  Rankbox
                </span>
              </th>
              <th
                scope="col"
                className={cn(
                  "sticky top-[var(--top-chrome)] z-10 w-[33%] border-b border-l bg-white/95 px-6 py-4 backdrop-blur",
                  LINE,
                )}
              >
                <span className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-ink">
                  <CompetitorMark competitor={competitor} className="h-7 w-7" />
                  {competitor.name}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {competitor.matrix.map((g) => {
              const Icon = g.icon;
              return (
                <Fragment key={g.group}>
                  <tr className={cn("block border-t md:table-row", LINE, PANEL)}>
                    <th
                      scope="colgroup"
                      colSpan={3}
                      className="block px-5 py-2.5 sm:px-8 md:table-cell lg:px-10"
                    >
                      <span className="flex items-center gap-2 text-[0.78rem] font-semibold text-ink">
                        <Icon aria-hidden className="h-3.5 w-3.5 text-cta" />
                        {g.group}
                      </span>
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr
                      key={r.label}
                      className={cn(
                        "grid grid-cols-2 gap-2 border-t px-5 pb-5 sm:px-8 md:table-row md:p-0",
                        LINE,
                      )}
                    >
                      <th
                        scope="row"
                        className="col-span-2 pb-1.5 pt-5 align-top font-normal md:py-5 md:pl-8 md:pr-6 lg:pl-10"
                      >
                        <span className="block text-[0.92rem] font-medium text-ink">{r.label}</span>
                        <span className="mt-1 block text-[0.8rem] leading-snug text-muted-foreground">
                          {r.detail}
                        </span>
                      </th>
                      <td
                        className={cn(
                          "rounded-lg p-3 align-top md:rounded-none md:border-l md:px-6 md:py-5",
                          LINE,
                          TINT,
                        )}
                      >
                        <CellNote
                          cell={r.rankbox}
                          who="Rankbox"
                          mark={<RankboxMark className="h-5 w-5" />}
                        />
                      </td>
                      <td
                        className={cn(
                          "rounded-lg border p-3 align-top md:rounded-none md:border-0 md:border-l md:px-6 md:py-5",
                          LINE,
                        )}
                      >
                        <CellNote
                          cell={r.them}
                          who={competitor.name}
                          mark={
                            <CompetitorMark
                              competitor={competitor}
                              className="h-5 w-5 text-[0.5rem]"
                            />
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Band>
      <Band inner="px-6 py-4 text-center sm:px-10">
        <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
          Compiled from {competitor.name}&rsquo;s public documentation and pricing pages, last
          reviewed {formatCheckedOn(competitor.pricing.checkedOn)}. Products change — check theirs
          before you decide, and tell us if we have a row wrong.
        </p>
      </Band>
    </section>
  );
}
