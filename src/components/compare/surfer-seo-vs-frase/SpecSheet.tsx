/**
 * The full spec sheet: the tale of the tape (short facts, mirrored across the
 * label like a fight card) and then every row of the feature matrix as a
 * hairline table, grouped as the data groups it. Neither product column is
 * tinted: this page has no home team.
 */
import { ListChecks } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { ProductMark } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { CellState, MatchupEntry } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { StateGlyph } from "./parts";
import { SIDES, STATE_LABEL } from "./util";

export function SpecSheet({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const rowCount = entry.matrix.reduce((n, g) => n + g.rows.length, 0);

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={ListChecks}
        eyebrow="Spec sheet"
        title={
          <span id="features-title">
            The facts, then <Accent>every feature</Accent>
          </span>
        }
        subtitle={`${entry.tape.length} facts at a glance, then ${rowCount} capabilities. Where a product isn't built for something, the cell says what it does instead.`}
      />

      {/* The tale of the tape. */}
      <Band>
        <Reveal>
          <table id="tape" className="w-full table-fixed border-collapse">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name} at a glance
            </caption>
            <thead>
              <tr className={cn("border-b", LINE)}>
                <th scope="col" className="px-4 py-4 text-right sm:px-8">
                  <span className="inline-flex items-center gap-2.5">
                    <span className="text-[0.88rem] font-semibold text-ink sm:text-[0.95rem]">
                      {sides.a.name}
                    </span>
                    <ProductMark product={sides.a} className="h-8 w-8 text-xs" />
                  </span>
                </th>
                <th
                  scope="col"
                  className={cn("w-[6.5rem] border-x px-2 py-4 sm:w-48", LINE, PANEL)}
                >
                  <span className="sr-only">Fact</span>
                </th>
                <th scope="col" className="px-4 py-4 text-left sm:px-8">
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
                  <td className="px-4 py-3.5 text-right align-middle text-[0.84rem] leading-snug text-ink sm:px-8 sm:text-[0.92rem]">
                    {row.a}
                  </td>
                  <th
                    scope="row"
                    className={cn(
                      "border-x px-2 py-3.5 text-center align-middle text-[0.64rem] font-medium uppercase leading-snug tracking-[0.1em] text-muted-foreground sm:text-[0.68rem]",
                      LINE,
                      PANEL,
                    )}
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-3.5 text-left align-middle text-[0.84rem] leading-snug text-ink sm:px-8 sm:text-[0.92rem]">
                    {row.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Band>

      {/* The key for the matrix. */}
      <Band
        inner={cn("flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-4", PANEL)}
      >
        {(Object.keys(STATE_LABEL) as CellState[]).map((s) => (
          <span key={s} className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
            <span aria-hidden>
              <StateGlyph state={s} />
            </span>
            {STATE_LABEL[s]}
          </span>
        ))}
      </Band>

      {/* Every capability. */}
      <Band>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[34rem] table-fixed border-collapse text-left">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name}, feature by feature
            </caption>
            <colgroup>
              <col className="w-[30%] lg:w-[28%]" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-white px-4 py-4 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:px-8"
                >
                  Capability
                </th>
                {SIDES.map((side) => (
                  <th key={side} scope="col" className={cn("border-l px-4 py-4 sm:px-6", LINE)}>
                    <span className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-ink">
                      <ProductMark product={sides[side]} className="h-7 w-7 text-[0.65rem]" />
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
                    scope="colgroup"
                    colSpan={3}
                    className="px-4 py-2.5 text-left text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink sm:px-8"
                  >
                    {g.group}
                  </th>
                </tr>
                {g.rows.map((row) => (
                  <tr
                    key={row.label}
                    className={cn("border-t transition-colors hover:bg-ink/[0.012]", LINE)}
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-4 py-4 align-top text-[0.86rem] font-medium text-ink sm:px-8"
                    >
                      {row.label}
                    </th>
                    {SIDES.map((side) => {
                      const cell = row[side];
                      return (
                        <td key={side} className={cn("border-l px-4 py-4 align-top sm:px-6", LINE)}>
                          <span className="flex gap-2.5">
                            <StateGlyph state={cell.state} className="mt-[3px]" />
                            <span
                              className={cn(
                                "text-[0.84rem] leading-snug",
                                cell.state === "no" ? "text-muted-foreground" : "text-ink/85",
                              )}
                            >
                              {cell.note}
                            </span>
                          </span>
                        </td>
                      );
                    })}
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
