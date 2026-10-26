/**
 * The tale of the tape as a spec sheet: one hairline table, the attribute
 * down the left and each tracker in its own column, the way a buyer lays
 * two vendors side by side in a procurement doc. It fits a phone without
 * scrolling: the columns are fixed and the values wrap.
 */
import { ClipboardList } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import { Accent, Band, LINE, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { SIDES } from "./util";

export function FactSheet({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section id="facts" aria-labelledby="facts-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={ClipboardList}
        eyebrow="Tale of the tape"
        title={
          <span id="facts-title">
            {entry.tape.length} facts, <Accent>side by side</Accent>
          </span>
        }
      />
      <Band>
        <Reveal>
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">
              {sides.a.name} and {sides.b.name} at a glance
            </caption>
            <colgroup>
              <col className="w-[30%] sm:w-[26%]" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="px-4 py-4 sm:px-8 lg:px-12">
                  <span className="sr-only">Attribute</span>
                </th>
                {SIDES.map((side) => (
                  <th
                    key={side}
                    scope="col"
                    className={cn("border-l px-3 py-4 sm:px-6 lg:px-8", LINE)}
                  >
                    <span className="flex items-center gap-2.5">
                      <ProductMark
                        product={sides[side]}
                        className="h-7 w-7 text-[0.6rem] sm:h-8 sm:w-8"
                      />
                      <span className="text-[0.85rem] font-medium text-ink sm:text-[0.95rem]">
                        {sides[side].name}
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entry.tape.map((row, i) => (
                <tr
                  key={row.label}
                  className={cn("border-t", LINE, i % 2 === 1 && "bg-ink/[0.012]")}
                >
                  <th
                    scope="row"
                    className="px-4 py-4 align-top text-[0.78rem] font-normal leading-snug text-muted-foreground sm:px-8 sm:text-[0.85rem] lg:px-12"
                  >
                    {row.label}
                  </th>
                  {SIDES.map((side) => (
                    <td
                      key={side}
                      className={cn(
                        "border-l px-3 py-4 align-top text-[0.84rem] leading-snug text-ink sm:px-6 sm:text-[0.95rem] lg:px-8",
                        LINE,
                      )}
                    >
                      {row[side]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Band>
    </section>
  );
}
