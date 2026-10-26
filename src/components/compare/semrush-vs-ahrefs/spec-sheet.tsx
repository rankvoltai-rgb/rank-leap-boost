/**
 * The spec sheet: the tale of the tape and the feature matrix as one hairline
 * table, each group a row band of its own. A real table, with a caption and
 * scoped headers, because that's what it is and what answer engines parse.
 * Neither column is tinted: on this page there is no home team.
 */
import { Check, Minus, Table2 } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { CELL_LEGEND, ProductMark } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { CellState, MatchupEntry, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";

const SIDES: Side[] = ["a", "b"];

const LABEL: Record<CellState, string> = Object.fromEntries(
  CELL_LEGEND.map((l) => [l.state, l.label]),
) as Record<CellState, string>;

function StateMark({ state }: { state: CellState }) {
  return (
    <span title={LABEL[state]} className="mt-px shrink-0">
      {state === "yes" ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cta-soft text-cta">
          <Check className="h-3 w-3" strokeWidth={3.2} aria-hidden />
        </span>
      ) : state === "partial" ? (
        // Half a disc: part of it, or part of it for more money.
        <svg viewBox="0 0 20 20" className="h-5 w-5 text-cta" aria-hidden>
          <circle
            cx="10"
            cy="10"
            r="8.25"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <path d="M10 1.75a8.25 8.25 0 0 1 0 16.5z" fill="currentColor" fillOpacity="0.35" />
        </svg>
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink/[0.12] text-muted-foreground">
          <Minus className="h-3 w-3" aria-hidden />
        </span>
      )}
      <span className="sr-only">{LABEL[state]}: </span>
    </span>
  );
}

const ROW_HEAD =
  "sticky left-0 z-10 bg-white px-5 py-4 text-left align-top text-[0.88rem] font-normal text-ink sm:px-8";
const CELL_PAD = "px-5 py-4 align-top sm:px-6";

export function SpecSheet({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const rowCount = entry.matrix.reduce((n, g) => n + g.rows.length, 0);

  const groupRow = (label: string) => (
    <tr className={cn("border-t", LINE)}>
      <th
        scope="rowgroup"
        colSpan={3}
        className={cn(
          PANEL,
          "px-5 py-2.5 text-left text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink/70 sm:px-8",
        )}
      >
        {label}
      </th>
    </tr>
  );

  return (
    <section id="spec-sheet" aria-labelledby="spec-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Table2}
        eyebrow="Spec sheet"
        title={
          <span id="spec-title">
            Every detail, <Accent>side by side</Accent>
          </span>
        }
        subtitle={`${entry.tape.length} facts at a glance, then ${rowCount} capabilities. Where a product isn't built for something, the cell says what it's built for instead.`}
      >
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {CELL_LEGEND.map((l) => (
            <li
              key={l.state}
              className="flex items-center gap-2 text-[0.8rem] text-muted-foreground"
            >
              <span aria-hidden>
                <StateMark state={l.state} />
              </span>
              {l.label}
            </li>
          ))}
        </ul>
      </SectionHead>

      <Band>
        {/* Scrolls inside its own box on a phone; the row labels stay pinned. */}
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[620px] table-fixed border-collapse">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name}, fact by fact and feature by feature
            </caption>
            <colgroup>
              <col className="w-[30%] sm:w-[28%]" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className={cn(ROW_HEAD, "py-5")}>
                  <span className="sr-only">Capability</span>
                  <span aria-hidden className="text-[0.76rem] font-medium text-muted-foreground">
                    {entry.tape.length + rowCount} rows
                  </span>
                </th>
                {SIDES.map((s) => (
                  <th
                    key={s}
                    scope="col"
                    className={cn("border-l px-5 py-5 text-left sm:px-6", LINE)}
                  >
                    <span className="flex items-center gap-2.5">
                      <ProductMark product={sides[s]} className="h-8 w-8 text-xs" />
                      <span>
                        <span className="block text-[0.95rem] font-semibold text-ink">
                          {sides[s].name}
                        </span>
                        <span className="block text-[0.74rem] font-normal text-muted-foreground">
                          {sides[s].kind}
                        </span>
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {groupRow("At a glance")}
              {entry.tape.map((row) => (
                <tr key={row.label} className={cn("border-t", LINE)}>
                  <th scope="row" className={ROW_HEAD}>
                    {row.label}
                  </th>
                  {SIDES.map((s) => (
                    <td
                      key={s}
                      className={cn(
                        "border-l text-[0.88rem] font-medium leading-snug text-ink",
                        CELL_PAD,
                        LINE,
                      )}
                    >
                      {row[s]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            {entry.matrix.map((g) => (
              <tbody key={g.group}>
                {groupRow(g.group)}
                {g.rows.map((row) => (
                  <tr key={row.label} className={cn("border-t", LINE)}>
                    <th scope="row" className={ROW_HEAD}>
                      {row.label}
                    </th>
                    {SIDES.map((s) => (
                      <td key={s} className={cn("border-l", CELL_PAD, LINE)}>
                        <span className="flex gap-2.5">
                          <StateMark state={row[s].state} />
                          <span
                            className={cn(
                              "text-[0.86rem] leading-snug",
                              row[s].state === "no" ? "text-muted-foreground" : "text-ink/80",
                            )}
                          >
                            {row[s].note}
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Band>
    </section>
  );
}
