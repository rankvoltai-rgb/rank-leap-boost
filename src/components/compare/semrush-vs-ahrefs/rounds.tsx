/**
 * The rounds as a ledger: one band per round, the call on the left (number,
 * what's judged, who took it) and the reasoning on the right — the verdict in
 * full, then each side's case under it. The winner's case carries the soft
 * blue key; a draw leaves both white.
 */
import { Equal, Gavel } from "lucide-react";
import { Accent, Band, LINE, SectionHead, Spacer } from "@/components/landing/frame";
import { ProductMark } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Round, Side, Winner } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { Md } from "./md";

const SIDES: Side[] = ["a", "b"];

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const spelled = (n: number) => {
  const w = WORDS[n] ?? String(n);
  return w[0].toUpperCase() + w.slice(1);
};

function WinnerBadge({ winner, sides }: { winner: Winner; sides: Record<Side, Product> }) {
  if (winner === "draw") {
    return (
      <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-2.5 text-[0.8rem] font-medium text-muted-foreground">
        <Equal className="h-3.5 w-3.5" aria-hidden />
        Draw
      </span>
    );
  }
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-lg bg-cta-soft py-1 pl-1 pr-2.5 text-[0.8rem] font-semibold text-cta">
      <ProductMark product={sides[winner]} className="h-6 w-6 text-[0.55rem]" />
      {sides[winner].name} wins
    </span>
  );
}

function RoundBand({
  round,
  index,
  sides,
}: {
  round: Round;
  index: number;
  sides: Record<Side, Product>;
}) {
  return (
    <Band id={round.id} className="scroll-mt-16">
      <article aria-labelledby={`${round.id}-title`} className="grid lg:grid-cols-[17.5rem_1fr]">
        <header
          className={cn(
            "flex flex-col border-b px-6 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-9 lg:py-10",
            LINE,
          )}
        >
          <div className="flex items-start justify-between gap-4 lg:flex-col lg:justify-start">
            <div>
              <p
                aria-hidden
                className="font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] text-ink/[0.13] tabular-nums lg:text-[3.2rem]"
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-[0.78rem] font-medium text-muted-foreground">
                Round {index + 1}
              </p>
              <h3
                id={`${round.id}-title`}
                className="mt-1 font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.4rem]"
              >
                {round.title}
              </h3>
            </div>
            <div className="shrink-0 pt-1 lg:mt-5 lg:pt-0">
              <WinnerBadge winner={round.winner} sides={sides} />
            </div>
          </div>
        </header>

        <div className="min-w-0">
          <p className="px-6 py-7 text-[1.04rem] leading-relaxed text-ink sm:px-10 sm:text-[1.1rem] lg:py-10">
            <Md text={round.verdict} />
          </p>
          <div className={cn("grid border-t sm:grid-cols-2", LINE)}>
            {SIDES.map((side) => {
              const won = round.winner === side;
              return (
                <div
                  key={side}
                  className={cn(
                    "px-6 py-6 sm:px-10 sm:py-7",
                    side === "b" && cn("border-t sm:border-l sm:border-t-0", LINE),
                    won && "bg-[color-mix(in_oklab,var(--cta)_5%,white)]",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-[0.88rem] font-semibold text-ink">
                      <ProductMark product={sides[side]} className="h-6 w-6 text-[0.55rem]" />
                      {sides[side].name}
                    </p>
                    {won && (
                      <span className="rounded-md bg-cta px-1.5 py-0.5 text-[0.66rem] font-semibold text-white">
                        Round winner
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                    <Md text={round[side]} />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </Band>
  );
}

export function Rounds({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section id="rounds" aria-labelledby="rounds-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Gavel}
        eyebrow="Round by round"
        title={
          <span id="rounds-title">
            {spelled(entry.rounds.length)} rounds, <Accent>one call each</Accent>
          </span>
        }
        subtitle="Every round names a winner and says why. Where the gap is too small to decide anything, it's a draw."
      />
      {entry.rounds.map((r, i) => (
        <RoundBand key={r.id} round={r} index={i} sides={sides} />
      ))}
    </section>
  );
}
