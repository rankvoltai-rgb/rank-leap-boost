/**
 * The rounds, as a tug of war: Jasper's case on the left, Writesonic's on the
 * right, and the round and its call in the middle — the same sides as the
 * fork above. The winner's half of each row carries the soft blue tint, so
 * scrolling down the section you watch the rounds fall to one side or the
 * other. On a phone the call comes first, then each side's case.
 *
 * Each row keeps its round's id: the route's JSON-LD links every round by it.
 */
import { ArrowLeft, ArrowRight, Equal, Trophy } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { ProductMark } from "@/components/compare/kit";
import { tallyOf } from "@/data/compare/entries";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Round, Side, Winner } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { Md } from "./atoms";
import { SIDES, WIN_TINT, plural } from "./lib";

function Call({ winner, sides }: { winner: Winner; sides: Record<Side, Product> }) {
  if (winner === "draw") {
    return (
      <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/[0.1] bg-white px-3 text-[0.78rem] font-semibold text-muted-foreground">
        <Equal aria-hidden className="h-3.5 w-3.5" />
        Draw
      </span>
    );
  }
  const p = sides[winner];
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full bg-cta py-1 pl-1 pr-3 text-[0.78rem] font-semibold text-white shadow-[0_1px_2px_rgba(16,24,40,0.14)]">
      {winner === "a" && (
        <ArrowLeft aria-hidden className="ml-1 hidden h-3.5 w-3.5 text-white/80 lg:block" />
      )}
      <ProductMark product={p} className="h-6 w-6 border-white/40 text-[0.6rem]" />
      {p.name} wins
      {winner === "b" && (
        <ArrowRight aria-hidden className="hidden h-3.5 w-3.5 text-white/80 lg:block" />
      )}
    </span>
  );
}

function RoundRow({
  round,
  index,
  sides,
}: {
  round: Round;
  index: number;
  sides: Record<Side, Product>;
}) {
  return (
    <Band id={round.id} className="scroll-mt-20">
      <Reveal y={14}>
        <article
          aria-labelledby={`${round.id}-title`}
          className="grid lg:grid-cols-[1fr_1.12fr_1fr]"
        >
          <header
            className={cn(
              "border-b px-6 py-8 sm:px-10 lg:col-start-2 lg:row-start-1 lg:flex lg:flex-col lg:items-center lg:border-x lg:border-b-0 lg:px-9 lg:py-10 lg:text-center",
              LINE,
            )}
          >
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-cta tabular-nums">
              Round {index + 1}
            </p>
            <h3
              id={`${round.id}-title`}
              className="mt-2 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.6rem]"
            >
              {round.title}
            </h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/80">
              <Md text={round.verdict} />
            </p>
            <div className="mt-5">
              <Call winner={round.winner} sides={sides} />
            </div>
          </header>

          {SIDES.map((side) => {
            const won = round.winner === side;
            return (
              <div
                key={side}
                className={cn(
                  "px-6 py-7 sm:px-10 lg:row-start-1 lg:px-8 lg:py-10",
                  side === "a" ? "lg:col-start-1" : "border-t lg:col-start-3 lg:border-t-0",
                  LINE,
                  won && WIN_TINT,
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <ProductMark product={sides[side]} className="h-6 w-6 text-[0.6rem]" />
                    <span className="text-sm font-semibold text-ink">{sides[side].name}</span>
                  </span>
                  {won && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-cta-soft px-2 py-0.5 text-[0.7rem] font-medium text-cta-hover">
                      <Trophy aria-hidden className="h-3 w-3" />
                      Round winner
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-3 text-[0.9rem] leading-relaxed",
                    won ? "text-ink/80" : "text-muted-foreground",
                  )}
                >
                  <Md text={round[side]} />
                </p>
              </div>
            );
          })}
        </article>
      </Reveal>
    </Band>
  );
}

export function Rounds({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const tally = tallyOf(entry.rounds);
  const [lead, trail]: Side[] = tally.b > tally.a ? ["b", "a"] : ["a", "b"];
  const draws = tally.draw ? `and ${plural(tally.draw, "draw")}` : "with no draws";

  return (
    <section id="rounds" aria-labelledby="rounds-title" className="scroll-mt-20">
      <Spacer />
      <SectionHead
        icon={Trophy}
        eyebrow="Round by round"
        title={
          <span id="rounds-title">
            {plural(entry.rounds.length, "round")}, <Accent>one call each</Accent>
          </span>
        }
        subtitle={`${sides[lead].name} takes ${tally[lead]}, ${sides[trail].name} ${tally[trail]}, ${draws}. Every round names a winner and says why.`}
      />

      {/* Column heads, on wide screens where the sides sit left and right. */}
      <div className="hidden lg:block">
        <Band inner={cn("grid grid-cols-[1fr_1.12fr_1fr]", PANEL)}>
          {SIDES.map((side) => (
            <div
              key={side}
              className={cn(
                "flex items-center gap-2.5 px-8 py-4",
                side === "a" ? "col-start-1" : "col-start-3 flex-row-reverse",
              )}
            >
              <ProductMark product={sides[side]} className="h-7 w-7 text-xs" />
              <span className="text-[0.95rem] font-semibold text-ink">{sides[side].name}</span>
              <span
                className={cn(
                  "rounded-md bg-white px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-muted-foreground ring-1 ring-ink/[0.07]",
                  side === "a" ? "ml-auto" : "mr-auto",
                )}
              >
                {tally[side]} won
              </span>
            </div>
          ))}
          <p
            className={cn(
              "col-start-2 row-start-1 flex items-center justify-center border-x px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted-foreground",
              LINE,
            )}
          >
            The round and the call
          </p>
        </Band>
      </div>

      {entry.rounds.map((r, i) => (
        <RoundRow key={r.id} round={r} index={i} sides={sides} />
      ))}
    </section>
  );
}
