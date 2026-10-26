/**
 * The spec sheet: the "tale of the tape" as hairline fact cells (each fact
 * with both answers under it), then every capability as a hairline table —
 * groups as tinted rows, each cell a state glyph and the data's own note.
 * The table keeps its row headers and caption, and scrolls inside its own
 * box on a phone.
 */
import { Check, ListTree, Minus, X } from "lucide-react";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CELL_LEGEND, ProductMark } from "@/components/compare/kit";
import type { Product } from "@/data/compare/products";
import type { Cell, CellState, MatchupEntry, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { KICKER, SIDES } from "./tokens";

const GLYPH: Record<CellState, { icon: typeof Check; className: string }> = {
  yes: { icon: Check, className: "bg-cta-soft text-cta" },
  partial: { icon: Minus, className: "border border-dashed border-cta/45 bg-white text-cta" },
  no: { icon: X, className: "bg-ink/[0.05] text-ink/45" },
};

function StateGlyph({ state }: { state: CellState }) {
  const g = GLYPH[state];
  const Icon = g.icon;
  const label = CELL_LEGEND.find((l) => l.state === state)?.label ?? state;
  return (
    <span
      title={label}
      className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full", g.className)}
    >
      <Icon className="h-3 w-3" strokeWidth={3} aria-hidden />
      <span className="sr-only">{label}:</span>
    </span>
  );
}

function CellNote({ cell }: { cell: Cell }) {
  return (
    <span className="flex gap-2.5">
      <StateGlyph state={cell.state} />
      <span
        className={cn(
          "text-[0.84rem] leading-snug",
          cell.state === "no" ? "text-muted-foreground" : "text-ink/85",
        )}
      >
        {cell.note}
      </span>
    </span>
  );
}

function Tape({ entry, sides }: { entry: MatchupEntry; sides: Record<Side, Product> }) {
  return (
    <Band>
      <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
        {entry.tape.map((row) => (
          <li key={row.label} className={cn(CELL, "px-5 py-6 sm:px-7")}>
            <dl>
              <dt className={KICKER}>{row.label}</dt>
              {SIDES.map((side) => (
                <dd key={side} className="mt-3 flex items-start gap-2.5">
                  <ProductMark product={sides[side]} className="mt-px h-5 w-5 text-[0.5rem]" />
                  <span className="sr-only">{sides[side].name}:</span>
                  <span className="text-[0.92rem] leading-snug text-ink">{row[side]}</span>
                </dd>
              ))}
            </dl>
          </li>
        ))}
      </CellGrid>
    </Band>
  );
}

function Matrix({ entry, sides }: { entry: MatchupEntry; sides: Record<Side, Product> }) {
  return (
    <Band>
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-5 py-4 sm:px-7",
          LINE,
        )}
      >
        {CELL_LEGEND.map((l) => (
          <span
            key={l.state}
            className="flex items-center gap-2 text-[0.78rem] text-muted-foreground"
          >
            <span aria-hidden>
              <StateGlyph state={l.state} />
            </span>
            {l.label}
          </span>
        ))}
      </div>
      <Reveal>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name}, capability by capability
            </caption>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 w-[30%] bg-white px-5 py-4 sm:px-7">
                  <span className={KICKER}>Capability</span>
                </th>
                {SIDES.map((side) => (
                  <th key={side} scope="col" className={cn("border-l px-5 py-4", LINE)}>
                    <span className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-ink">
                      <ProductMark product={sides[side]} className="h-7 w-7 text-xs" />
                      {sides[side].name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {entry.matrix.map((g) => (
              <tbody key={g.group}>
                <tr className={cn("border-t", LINE)}>
                  <th
                    scope="colgroup"
                    colSpan={3}
                    className={cn(
                      "px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink sm:px-7",
                      PANEL,
                    )}
                  >
                    {g.group}
                  </th>
                </tr>
                {g.rows.map((row) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-t transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_30%,white)]",
                      LINE,
                    )}
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-5 py-4 text-[0.88rem] font-medium text-ink sm:px-7"
                    >
                      {row.label}
                    </th>
                    {SIDES.map((side) => (
                      <td key={side} className={cn("border-l px-5 py-4 align-top", LINE)}>
                        <CellNote cell={row[side]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Reveal>
    </Band>
  );
}

export function SpecSection({
  sides,
  entry,
}: {
  sides: Record<Side, Product>;
  entry: MatchupEntry;
}) {
  const rowCount = entry.matrix.reduce((n, g) => n + g.rows.length, 0);
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={ListTree}
        eyebrow="Feature by feature"
        title={
          <span id="features-title">
            The facts first, then <Accent>{rowCount} capabilities</Accent>
          </span>
        }
        subtitle="Where a product isn't built for something, the cell says what it's built for instead."
      />
      <Tape entry={entry} sides={sides} />
      <Spacer />
      <Matrix entry={entry} sides={sides} />
    </section>
  );
}
