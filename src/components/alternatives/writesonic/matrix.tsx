/**
 * The side-by-side table: every row of the entry's matrix with both notes, as
 * one hairline table. Rankbox's column carries a soft blue key from top to
 * bottom; the groups read as chapters.
 *
 * One DOM at every width. From md up it is a plain three-column table with a
 * header that sticks under the navbar; below md the same rows stack, and each
 * cell shows its product's name, so nothing is rendered twice.
 */
import { Rows3 } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { formatCheckedOn, type Cell, type Competitor } from "@/data/alternatives";
import { cn } from "@/lib/utils";
import { type Side } from "./lib";
import { StateLegend, StateMark } from "./ui";

const TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

function CellNote({ cell, side, who }: { cell: Cell; side: Side; who: string }) {
  return (
    <>
      <span
        className={cn(
          "mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] md:hidden",
          side === "rankbox" ? "text-cta" : "text-muted-foreground",
        )}
      >
        {who}
      </span>
      <span className="flex gap-2.5">
        <StateMark state={cell.state} side={side} />
        <span
          className={cn(
            "text-[0.86rem] leading-snug",
            cell.state === "no" ? "text-muted-foreground" : "text-ink/85",
          )}
        >
          {cell.note}
        </span>
      </span>
    </>
  );
}

export function WritesonicMatrix({ competitor: c }: { competitor: Competitor }) {
  const rowCount = c.matrix.reduce((n, g) => n + g.rows.length, 0);
  const headCell = "sticky top-[var(--top-chrome)] z-10 py-4 align-middle";

  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <SectionHead
        icon={Rows3}
        eyebrow="Side by side"
        title={
          <span id="compare-title">
            Rankbox vs {c.name}, <Accent>in {rowCount} rows</Accent>
          </span>
        }
        subtitle={`Every row is something a growth programme needs. Where ${c.name} isn't built for one, we say what it is built for instead.`}
      >
        <StateLegend className="mt-6" />
      </SectionHead>

      <Band>
        <table className="w-full border-collapse text-left max-md:block">
          <caption className="sr-only">
            Rankbox and {c.name} compared, row by row, with a note on each
          </caption>
          <thead className="max-md:hidden">
            <tr>
              <th scope="col" className={cn(headCell, "w-[34%] bg-white px-6 lg:px-8")}>
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Capability
                </span>
              </th>
              <th scope="col" className={cn(headCell, "w-[33%] border-l px-5", LINE, TINT)}>
                <span className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-cta">
                  <RankboxMark className="h-7 w-7" />
                  Rankbox
                </span>
              </th>
              <th scope="col" className={cn(headCell, "w-[33%] border-l bg-white px-5", LINE)}>
                <span className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-ink">
                  <CompetitorMark competitor={c} className="h-7 w-7" />
                  {c.name}
                </span>
              </th>
            </tr>
          </thead>
          {c.matrix.map((g) => {
            const Icon = g.icon;
            return (
              <tbody key={g.group} className="max-md:block">
                <tr className={cn("border-t max-md:block", LINE)}>
                  <th
                    colSpan={3}
                    scope="colgroup"
                    className={cn("px-6 py-3 max-md:block lg:px-8", PANEL)}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-brand-blue">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink">
                        {g.group}
                      </span>
                    </span>
                  </th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.label} className={cn("border-t max-md:block", LINE)}>
                    <th
                      scope="row"
                      className="px-6 py-5 align-top font-normal max-md:block max-md:pb-3 lg:px-8"
                    >
                      <span className="block text-[0.95rem] font-medium text-ink">{r.label}</span>
                      <span className="mt-1 block text-[0.8rem] leading-snug text-muted-foreground">
                        {r.detail}
                      </span>
                    </th>
                    <td
                      className={cn(
                        "border-l px-5 py-5 align-top max-md:mx-6 max-md:mb-2 max-md:block max-md:rounded-lg max-md:border-l-0 max-md:px-4 max-md:py-3.5",
                        LINE,
                        TINT,
                      )}
                    >
                      <CellNote cell={r.rankbox} side="rankbox" who="Rankbox" />
                    </td>
                    <td
                      className={cn(
                        "border-l px-5 py-5 align-top max-md:mx-6 max-md:mb-5 max-md:block max-md:rounded-lg max-md:border max-md:px-4 max-md:py-3.5",
                        LINE,
                      )}
                    >
                      <CellNote cell={r.them} side="them" who={c.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </Band>

      <Band inner="px-6 py-4 text-center">
        <p className="mx-auto max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Compiled from {c.name}&rsquo;s public documentation and pricing pages, last reviewed{" "}
          {formatCheckedOn(c.pricing.checkedOn)}. Products change, so check theirs before you
          decide, and{" "}
          <a href="#sources" className="font-medium text-ink underline underline-offset-2">
            tell us
          </a>{" "}
          if we have a row wrong.
        </p>
      </Band>
    </section>
  );
}
