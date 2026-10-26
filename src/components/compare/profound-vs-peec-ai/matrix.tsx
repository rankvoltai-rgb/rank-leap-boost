/**
 * Feature by feature, as one hairline table grouped by what the rows are
 * about. Most of an AI-visibility tracker is the same on both sides, so the
 * table can narrow itself to the rows whose marks differ; the rest stay one
 * click away. Rows that differ carry a faint blue tint in the full view.
 */
import { useState } from "react";
import { Check, Grid3x3, Minus, X } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import { Accent, Band, LINE, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { CellState, MatchupEntry, MatrixRow } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { SIDES } from "./util";

const STATE: Record<CellState, { label: string; className: string; Icon: typeof Check }> = {
  yes: { label: "Included", className: "bg-cta-soft text-cta", Icon: Check },
  partial: {
    label: "Partly, or as an add-on",
    className: "border border-dashed border-cta/45 bg-white text-cta",
    Icon: Minus,
  },
  no: { label: "Not what it's built for", className: "bg-ink/[0.05] text-ink/45", Icon: X },
};

function StateMark({ state }: { state: CellState }) {
  const { className, Icon, label } = STATE[state];
  return (
    <span
      className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full", className)}
    >
      <Icon className="h-3 w-3" strokeWidth={3} aria-hidden />
      <span className="sr-only">{label}.</span>
    </span>
  );
}

const differs = (r: MatrixRow) => r.a.state !== r.b.state;

export function Matrix({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const [onlyDiff, setOnlyDiff] = useState(false);
  const rows = entry.matrix.flatMap((g) => g.rows);
  const diffCount = rows.filter(differs).length;

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Grid3x3}
        eyebrow="Feature by feature"
        title={
          <span id="features-title">
            Everything else, <Accent>in {rows.length} rows</Accent>
          </span>
        }
        subtitle="Where a product isn't built for something, the cell says what it's built for instead."
      >
        <div className="mt-7 flex flex-col items-center gap-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {(Object.keys(STATE) as CellState[]).map((s) => (
              <li key={s} className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
                <span aria-hidden>
                  <StateMark state={s} />
                </span>
                {STATE[s].label}
              </li>
            ))}
          </ul>
          <div
            role="group"
            aria-label="Rows to show"
            className="flex rounded-lg border border-ink/[0.08] bg-ink/[0.02] p-0.5"
          >
            {[
              { on: false, label: `All ${rows.length} rows` },
              { on: true, label: `Where the marks differ (${diffCount})` },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={onlyDiff === o.on}
                onClick={() => setOnlyDiff(o.on)}
                className={cn(
                  "h-8 rounded-md px-3 text-[0.8rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                  onlyDiff === o.on
                    ? "bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                    : "text-muted-foreground hover:text-ink",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </SectionHead>

      <Band>
        <Reveal>
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name}, feature by feature
              {onlyDiff ? " (rows where the marks differ)" : ""}
            </caption>
            <colgroup>
              <col className="w-[31%] sm:w-[28%]" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky top-[var(--top-chrome)] z-10 bg-white/95 px-4 py-4 text-[0.75rem] font-normal text-muted-foreground backdrop-blur sm:px-8 lg:px-12"
                >
                  Capability
                </th>
                {SIDES.map((side) => (
                  <th
                    key={side}
                    scope="col"
                    className={cn(
                      "sticky top-[var(--top-chrome)] z-10 border-l bg-white/95 px-3 py-4 backdrop-blur sm:px-6 lg:px-8",
                      LINE,
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <ProductMark product={sides[side]} className="h-7 w-7 text-[0.6rem]" />
                      <span className="text-[0.85rem] font-medium text-ink sm:text-[0.95rem]">
                        {sides[side].name}
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {entry.matrix.map((g) => {
              const shown = onlyDiff ? g.rows.filter(differs) : g.rows;
              if (shown.length === 0) return null;
              return (
                <tbody key={g.group}>
                  <tr className={cn("border-t", LINE)}>
                    <th
                      scope="rowgroup"
                      colSpan={3}
                      className="bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-2.5 text-[0.78rem] font-medium text-ink sm:px-8 lg:px-12"
                    >
                      {g.group}
                    </th>
                  </tr>
                  {shown.map((row) => (
                    <tr
                      key={row.label}
                      className={cn(
                        "border-t",
                        LINE,
                        !onlyDiff &&
                          differs(row) &&
                          "bg-[color-mix(in_oklab,var(--cta)_3.5%,white)]",
                      )}
                    >
                      <th
                        scope="row"
                        className="px-4 py-4 align-top text-[0.84rem] font-medium leading-snug text-ink sm:px-8 sm:text-[0.9rem] lg:px-12"
                      >
                        {row.label}
                      </th>
                      {SIDES.map((side) => (
                        <td
                          key={side}
                          className={cn("border-l px-3 py-4 align-top sm:px-6 lg:px-8", LINE)}
                        >
                          <span className="flex flex-col gap-1.5 sm:flex-row sm:gap-2.5">
                            <StateMark state={row[side].state} />
                            <span
                              className={cn(
                                "text-[0.8rem] leading-snug sm:text-[0.86rem]",
                                row[side].state === "no" ? "text-muted-foreground" : "text-ink/85",
                              )}
                            >
                              {row[side].note}
                            </span>
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              );
            })}
          </table>
        </Reveal>
      </Band>
    </section>
  );
}
