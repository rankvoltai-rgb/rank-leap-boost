/**
 * The seven rounds, each a band of its own: the round and its winner in a
 * left column, the call set large on the right, and each side's case under
 * it in two equal cells. The winning side's cell carries the soft blue key,
 * which is the only emphasis on the page — earned per round, not per product.
 */
import { Equal, Swords, Trophy } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import { Accent, Band, LINE, LINE_FILL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { tallyOf } from "@/data/compare/entries";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Round, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { Md } from "./parts";
import { SIDES } from "./util";

export function Rounds({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const tally = tallyOf(entry.rounds);
  return (
    <section id="rounds" aria-labelledby="rounds-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Swords}
        eyebrow="Round by round"
        title={
          <span id="rounds-title">
            {entry.rounds.length} rounds, <Accent>one call each</Accent>
          </span>
        }
        subtitle="Every round names a winner and says why. Where the gap is too small to decide anything, it's a draw."
      >
        <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.85rem] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ProductMark product={sides.a} className="h-5 w-5 text-[0.5rem]" />
            {sides.a.name} <span className="font-semibold tabular-nums text-ink">{tally.a}</span>
          </span>
          <span aria-hidden className="text-ink/20">
            /
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Equal className="h-3.5 w-3.5" aria-hidden />
            Draw <span className="font-semibold tabular-nums text-ink">{tally.draw}</span>
          </span>
          <span aria-hidden className="text-ink/20">
            /
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ProductMark product={sides.b} className="h-5 w-5 text-[0.5rem]" />
            {sides.b.name} <span className="font-semibold tabular-nums text-ink">{tally.b}</span>
          </span>
        </p>
      </SectionHead>

      {entry.rounds.map((r, i) => (
        <RoundBand key={r.id} round={r} index={i} total={entry.rounds.length} sides={sides} />
      ))}
    </section>
  );
}

function WinnerBadge({ round, sides }: { round: Round; sides: Record<Side, Product> }) {
  if (round.winner === "draw") {
    return (
      <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-2.5 text-[0.8rem] font-medium text-muted-foreground">
        <Equal className="h-3.5 w-3.5" aria-hidden />
        Draw
      </span>
    );
  }
  const p = sides[round.winner];
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-lg bg-cta-soft py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-cta">
      <ProductMark product={p} className="h-6 w-6 text-[0.55rem]" />
      {p.name} wins
    </span>
  );
}

function RoundBand({
  round,
  index,
  total,
  sides,
}: {
  round: Round;
  index: number;
  total: number;
  sides: Record<Side, Product>;
}) {
  return (
    <Band id={round.id} className="scroll-mt-16">
      <article aria-labelledby={`${round.id}-title`} className="grid lg:grid-cols-[17rem_1fr]">
        <header
          className={cn(
            "flex flex-row flex-wrap items-center justify-between gap-3 border-b px-6 py-6 sm:px-10 lg:flex-col lg:items-start lg:justify-start lg:border-b-0 lg:border-r lg:px-10 lg:py-10",
            LINE,
          )}
        >
          <div>
            <p className="text-[0.75rem] tabular-nums text-muted-foreground">
              Round {index + 1} of {total}
            </p>
            <h3
              id={`${round.id}-title`}
              className="mt-1.5 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]"
            >
              {round.title}
            </h3>
          </div>
          <div className="lg:mt-5">
            <WinnerBadge round={round} sides={sides} />
          </div>
        </header>

        <div className="min-w-0">
          <Reveal className="px-6 py-7 sm:px-10 lg:px-12 lg:py-10">
            <p className="max-w-3xl text-pretty text-[1.04rem] leading-relaxed text-ink sm:text-[1.12rem]">
              <Md text={round.verdict} />
            </p>
          </Reveal>
          <div className={cn("grid gap-px border-t sm:grid-cols-2", LINE, LINE_FILL)}>
            {SIDES.map((side) => {
              const won = round.winner === side;
              return (
                <div
                  key={side}
                  className={cn(
                    "px-6 py-6 sm:px-8 lg:px-10",
                    won ? "bg-[color-mix(in_oklab,var(--cta)_5%,white)]" : "bg-white",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-[0.88rem] font-medium text-ink">
                      <ProductMark product={sides[side]} className="h-6 w-6 text-[0.55rem]" />
                      {sides[side].name}
                    </p>
                    {won && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-cta px-1.5 py-0.5 text-[0.66rem] font-semibold text-white">
                        <Trophy className="h-3 w-3" aria-hidden />
                        Round winner
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
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
