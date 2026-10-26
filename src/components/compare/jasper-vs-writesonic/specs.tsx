/**
 * The spec sheet: one hairline table, the tale of the tape first ("At a
 * glance", plain facts) and then every capability row, grouped, each cell a
 * state mark and the note that says what the product does instead. Both
 * products get the same marks and the same column weight; nothing here is
 * scored.
 *
 * One DOM, two shapes: a three-column table on wide screens; on a phone each
 * row becomes its label over two side-by-side cells, each naming its product.
 */
import { ListChecks } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { ProductMark } from "@/components/compare/kit";
import { matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { CellState, MatchupEntry } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { StateMark } from "./atoms";
import { SIDES, STATE_LABEL } from "./lib";

const ROW = cn("border-t md:table-row", LINE, "max-md:grid max-md:grid-cols-2");
const LABEL =
  "px-5 pb-1 pt-4 text-left align-top text-[0.88rem] font-medium text-ink max-md:col-span-2 sm:px-8 md:w-[30%] md:py-4 lg:px-10";
const CELL_BASE =
  "align-top px-5 pb-4 pt-2 text-[0.84rem] leading-snug sm:px-8 md:border-l md:py-4 lg:px-8";

/* The product's name inside a cell, for phones, where the column heads are gone. */
function CellName({ product }: { product: Product }) {
  return (
    <span className="mb-1.5 flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground md:hidden">
      <ProductMark product={product} className="h-4 w-4 text-[0.45rem]" />
      {product.name}
    </span>
  );
}

function GroupRow({ name }: { name: string }) {
  return (
    <tr className={cn("border-t max-md:block", LINE, PANEL)}>
      <th
        colSpan={3}
        scope="colgroup"
        className="px-5 py-2.5 text-left text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink/70 max-md:block sm:px-8 lg:px-10"
      >
        {name}
      </th>
    </tr>
  );
}

export function Specs({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const rows = entry.tape.length + entry.matrix.reduce((n, g) => n + g.rows.length, 0);
  const present = (["yes", "partial", "no"] as CellState[]).filter((s) =>
    entry.matrix.some((g) => g.rows.some((r) => r.a.state === s || r.b.state === s)),
  );

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20">
      <Spacer />
      <SectionHead
        icon={ListChecks}
        eyebrow="Feature by feature"
        title={
          <span id="features-title">
            The spec sheet, <Accent>{rows} rows</Accent>
          </span>
        }
        subtitle="Where a product isn't built for something, the cell says what it's built for instead."
      >
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {present.map((s) => (
            <li key={s} className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
              <span aria-hidden>
                <StateMark state={s} />
              </span>
              {STATE_LABEL[s]}
            </li>
          ))}
        </ul>
      </SectionHead>

      <Band>
        <Reveal>
          <table className="w-full border-collapse max-md:block">
            <caption className="sr-only">{matchupTitle(matchup)}, feature by feature</caption>
            <thead className="max-md:hidden">
              <tr>
                <th
                  scope="col"
                  className="px-5 py-5 text-left text-[0.75rem] font-medium text-muted-foreground sm:px-8 lg:px-10"
                >
                  Capability
                </th>
                {SIDES.map((side) => (
                  <th
                    key={side}
                    scope="col"
                    className={cn("border-l px-5 py-5 text-left sm:px-8 lg:px-8", LINE)}
                  >
                    <span className="flex items-center gap-2.5">
                      <ProductMark product={sides[side]} className="h-8 w-8 text-xs" />
                      <span className="text-[0.95rem] font-semibold text-ink">
                        {sides[side].name}
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="max-md:block">
              <GroupRow name="At a glance" />
              {entry.tape.map((t) => (
                <tr key={t.label} className={ROW}>
                  <th scope="row" className={LABEL}>
                    {t.label}
                  </th>
                  {SIDES.map((side) => (
                    <td
                      key={side}
                      className={cn(CELL_BASE, LINE, side === "b" && "max-md:border-l")}
                    >
                      <CellName product={sides[side]} />
                      <span className="font-medium text-ink">{t[side]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            {entry.matrix.map((g) => (
              <tbody key={g.group} className="max-md:block">
                <GroupRow name={g.group} />
                {g.rows.map((r) => (
                  <tr
                    key={r.label}
                    className={cn(ROW, "transition-colors md:hover:bg-ink/[0.015]")}
                  >
                    <th scope="row" className={LABEL}>
                      {r.label}
                    </th>
                    {SIDES.map((side) => (
                      <td
                        key={side}
                        className={cn(CELL_BASE, LINE, side === "b" && "max-md:border-l")}
                      >
                        <CellName product={sides[side]} />
                        <span className="flex gap-2.5">
                          <StateMark state={r[side].state} className="mt-px" />
                          <span
                            className={
                              r[side].state === "no" ? "text-muted-foreground" : "text-ink/85"
                            }
                          >
                            {r[side].note}
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </Reveal>
      </Band>
    </section>
  );
}
