/**
 * The rounds, each on a hairline band of its own: the call on the left (title,
 * winner, verdict and the running score after it), then the case for each
 * side. The side that took the round sits on a soft blue tint; a draw leaves
 * both white. The band above them is the final score.
 */
import { Equal, Gavel, Trophy } from "lucide-react";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { ProductMark } from "@/components/compare/kit";
import { tallyOf } from "@/data/compare/entries";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Side, Winner } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { CallTag, Rich } from "./parts";
import { SIDES, WIN_TINT, plural } from "./util";

function RunningScore({
  tally,
  sides,
}: {
  tally: Record<Winner, number>;
  sides: Record<Side, Product>;
}) {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] text-muted-foreground">
      <span>Score after this round</span>
      <span className="sr-only">
        {sides.a.name} {tally.a}, {sides.b.name} {tally.b}, {plural(tally.draw, "draw")}
      </span>
      <span aria-hidden className="flex items-center gap-2.5 text-ink">
        {SIDES.map((side) => (
          <span key={side} className="flex items-center gap-1">
            <ProductMark product={sides[side]} className="h-3.5 w-3.5 text-[0.4rem]" />
            <span className="font-semibold tabular-nums">{tally[side]}</span>
          </span>
        ))}
        <span className="flex items-center gap-0.5 text-muted-foreground">
          <Equal className="h-3 w-3" />
          <span className="font-semibold tabular-nums">{tally.draw}</span>
        </span>
      </span>
    </p>
  );
}

export function Rounds({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const tally = tallyOf(entry.rounds);
  const finals: { key: Winner; label: string }[] = [
    { key: "a", label: tally.a === 1 ? "round won" : "rounds won" },
    { key: "draw", label: tally.draw === 1 ? "draw" : "draws" },
    { key: "b", label: tally.b === 1 ? "round won" : "rounds won" },
  ];

  return (
    <section id="rounds" aria-labelledby="rounds-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Gavel}
        eyebrow="Round by round"
        title={
          <span id="rounds-title">
            {entry.rounds.length} rounds, <Accent>a call in each</Accent>
          </span>
        }
        subtitle="Each round names a winner or calls a draw, winner first, then gives the case for both sides. The tinted cell is the side that took it."
      />

      {/* The final score. */}
      <Band>
        <CellGrid className="grid-cols-3">
          {finals.map(({ key, label }) => (
            <li key={key} className={cn(CELL, "px-3 py-6 text-center sm:px-6 sm:py-8")}>
              <div className="flex items-center justify-center gap-2">
                {key === "draw" ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/[0.1] bg-white text-muted-foreground">
                    <Equal className="h-3.5 w-3.5" aria-hidden />
                  </span>
                ) : (
                  <ProductMark product={sides[key]} className="h-7 w-7 text-[0.65rem]" />
                )}
                <span className="hidden text-[0.88rem] font-medium text-ink sm:inline">
                  {key === "draw" ? "Draws" : sides[key].name}
                </span>
              </div>
              <p className="mt-3 font-display text-[2.4rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums sm:text-[3rem]">
                {tally[key]}
              </p>
              <p className="mt-2 text-[0.75rem] text-muted-foreground">
                <span className="sm:hidden">{key === "draw" ? "" : `${sides[key].name} · `}</span>
                {label}
              </p>
            </li>
          ))}
        </CellGrid>
      </Band>

      {entry.rounds.map((r, i) => {
        const after = tallyOf(entry.rounds.slice(0, i + 1));
        return (
          <Band key={r.id}>
            <article
              id={r.id}
              aria-labelledby={`${r.id}-title`}
              className="grid scroll-mt-20 md:grid-cols-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)]"
            >
              <div
                className={cn(
                  "border-b px-5 py-7 sm:px-8 md:col-span-2 lg:col-span-1 lg:border-b-0 lg:border-r lg:py-9",
                  LINE,
                )}
              >
                <Reveal>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[0.72rem] font-medium tabular-nums text-muted-foreground">
                      Round {String(i + 1).padStart(2, "0")}
                    </p>
                    <CallTag winner={r.winner} sides={sides} />
                  </div>
                  <h3
                    id={`${r.id}-title`}
                    className="mt-3 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]"
                  >
                    {r.title}
                  </h3>
                  <p className="mt-3 text-[0.94rem] leading-relaxed text-ink/85">
                    <Rich text={r.verdict} />
                  </p>
                  <RunningScore tally={after} sides={sides} />
                </Reveal>
              </div>

              {SIDES.map((side) => {
                const won = r.winner === side;
                return (
                  <div
                    key={side}
                    className={cn(
                      "px-5 py-6 sm:px-8 lg:py-9",
                      side === "b" && cn("border-t md:border-l md:border-t-0", LINE),
                      won && WIN_TINT,
                    )}
                  >
                    <Reveal delay={side === "a" ? 0.05 : 0.1}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="flex items-center gap-2 text-[0.88rem] font-semibold text-ink">
                          <ProductMark product={sides[side]} className="h-6 w-6 text-[0.6rem]" />
                          {sides[side].name}
                        </p>
                        {won && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-cta px-1.5 py-0.5 text-[0.66rem] font-semibold text-white">
                            <Trophy className="h-3 w-3" aria-hidden />
                            Took this round
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
                        <Rich text={r[side]} />
                      </p>
                    </Reveal>
                  </div>
                );
              })}
            </article>
          </Band>
        );
      })}
    </section>
  );
}
