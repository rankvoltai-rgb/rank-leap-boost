/**
 * The spec sheet: the short facts mirrored across a spine, then every
 * capability in a hairline table, grouped. Both are real tables, captioned,
 * with row and column headers, because that's what they are and what
 * answer engines parse best. Neither column is tinted: this page has no home
 * team.
 */
import { Check, ListChecks, Minus, X } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { CELL_LEGEND, ProductMark } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { CellState, MatchupEntry } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { SIDES } from "./util";

const LABEL: Record<CellState, string> = Object.fromEntries(
  CELL_LEGEND.map((l) => [l.state, l.label]),
) as Record<CellState, string>;

function StateMark({ state }: { state: CellState }) {
  const Icon = state === "yes" ? Check : state === "partial" ? Minus : X;
  return (
    <span
      title={LABEL[state]}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
        state === "yes" && "bg-cta text-white",
        state === "partial" && "bg-cta-soft text-cta ring-1 ring-inset ring-cta/25",
        state === "no" && "border border-ink/[0.14] bg-white text-muted-foreground",
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={3} aria-hidden />
      <span className="sr-only">{LABEL[state]}</span>
    </span>
  );
}

export function SpecSheet({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const rows = entry.matrix.reduce((n, g) => n + g.rows.length, 0);

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={ListChecks}
        eyebrow="Spec sheet"
        title={
          <span id="features-title">
            The facts, <Accent>side by side</Accent>
          </span>
        }
        subtitle={`${entry.tape.length} facts at a glance, then ${rows} capabilities. Where a product isn't built for something, the cell says what it's built for instead.`}
      />

      {/* The tale of the tape: each value faces the other across the label. */}
      <Band>
        <Reveal>
          <table className="w-full table-fixed border-collapse">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name} at a glance
            </caption>
            <thead>
              <tr className={cn("border-b", LINE)}>
                <th scope="col" className="px-3 py-5 text-right sm:px-8">
                  <span className="inline-flex items-center gap-2.5">
                    <span className="text-[0.88rem] font-semibold text-ink sm:text-[0.95rem]">
                      {sides.a.name}
                    </span>
                    <ProductMark product={sides.a} className="h-8 w-8 text-xs" />
                  </span>
                </th>
                <th scope="col" className={cn("w-[6.5rem] border-x sm:w-48", LINE, PANEL)}>
                  <span className="sr-only">Fact</span>
                </th>
                <th scope="col" className="px-3 py-5 text-left sm:px-8">
                  <span className="inline-flex items-center gap-2.5">
                    <ProductMark product={sides.b} className="h-8 w-8 text-xs" />
                    <span className="text-[0.88rem] font-semibold text-ink sm:text-[0.95rem]">
                      {sides.b.name}
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {entry.tape.map((row, i) => (
                <tr key={row.label} className={cn(i > 0 && "border-t", LINE)}>
                  <td className="px-3 py-4 text-right align-middle text-[0.84rem] leading-snug text-ink sm:px-8 sm:text-[0.95rem]">
                    {row.a}
                  </td>
                  <th
                    scope="row"
                    className={cn(
                      "border-x px-1.5 py-4 text-center align-middle text-[0.68rem] font-medium leading-snug text-muted-foreground sm:text-[0.75rem]",
                      LINE,
                      PANEL,
                    )}
                  >
                    {row.label}
                  </th>
                  <td className="px-3 py-4 text-left align-middle text-[0.84rem] leading-snug text-ink sm:px-8 sm:text-[0.95rem]">
                    {row.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Band>

      {/* The legend. */}
      <Band inner="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-4">
        {CELL_LEGEND.map((l) => (
          <span
            key={l.state}
            className="flex items-center gap-2 text-[0.78rem] text-muted-foreground"
          >
            <span aria-hidden>
              <StateMark state={l.state} />
            </span>
            {l.label}
          </span>
        ))}
      </Band>

      {/* Every capability. Scrolls in its own box on a phone, labels pinned. */}
      <Band>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name}, capability by capability
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-[30%] bg-white px-5 py-4 text-[0.75rem] font-medium text-muted-foreground sm:px-8"
                >
                  Capability
                </th>
                {SIDES.map((side) => (
                  <th key={side} scope="col" className={cn("border-l px-5 py-4", LINE)}>
                    <span className="flex items-center gap-2.5 text-[0.88rem] font-semibold text-ink">
                      <ProductMark product={sides[side]} className="h-7 w-7 text-xs" />
                      {sides[side].name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {entry.matrix.map((g) => (
              <tbody key={g.group}>
                <tr className={cn("border-t", LINE, PANEL)}>
                  <th
                    scope="rowgroup"
                    colSpan={3}
                    className="px-5 py-2.5 text-[0.75rem] font-semibold text-ink sm:px-8"
                  >
                    {g.group}
                  </th>
                </tr>
                {g.rows.map((row) => (
                  <tr key={row.label} className={cn("border-t", LINE)}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-5 py-4 align-top text-[0.88rem] font-medium text-ink sm:px-8"
                    >
                      {row.label}
                    </th>
                    {SIDES.map((side) => (
                      <td key={side} className={cn("border-l px-5 py-4 align-top", LINE)}>
                        <span className="flex gap-2.5">
                          <StateMark state={row[side].state} />
                          <span
                            className={cn(
                              "text-[0.84rem] leading-snug",
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
            ))}
          </table>
        </div>
      </Band>
    </section>
  );
}
