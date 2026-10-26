/**
 * The seven rounds. A scoreboard band first — one hairline cell per round,
 * each a jump link with its winner — then every round as a band of its own:
 * the call on the left, each product's case on the right, the winner's cell
 * on the soft blue. Every word is the round's entry in the data.
 */
import { Swords } from "lucide-react";
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
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Round, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { SIDES, WIN_TINT, spelled } from "./tokens";
import { Md, RoundWinnerLabel, WinnerTag } from "./ui";

function Scoreboard({ rounds, sides }: { rounds: Round[]; sides: Record<Side, Product> }) {
  return (
    <Band>
      <nav aria-label="Rounds">
        <CellGrid className="grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {rounds.map((r, i) => (
            <li key={r.id} className={CELL}>
              <a
                href={`#${r.id}`}
                className="group flex h-full flex-col justify-between gap-4 px-4 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_45%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-5 sm:py-5"
              >
                <span>
                  <span className="block text-[0.68rem] font-medium tabular-nums text-muted-foreground">
                    Round {i + 1}
                  </span>
                  <span className="mt-1 block text-[0.86rem] font-medium leading-snug text-ink group-hover:text-cta">
                    {r.title}
                  </span>
                </span>
                {r.winner === "draw" ? (
                  <span className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-[26%] border border-dashed border-ink/25 text-[0.7rem]">
                      =
                    </span>
                    Draw
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[0.75rem] font-medium text-cta">
                    <ProductMark product={sides[r.winner]} className="h-5 w-5 text-[0.5rem]" />
                    {sides[r.winner].name}
                  </span>
                )}
              </a>
            </li>
          ))}
        </CellGrid>
      </nav>
    </Band>
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
      <article aria-labelledby={`${round.id}-title`} className="grid lg:grid-cols-[1.05fr_1fr_1fr]">
        <Reveal
          className={cn("border-b px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:py-10", LINE)}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[0.95rem] font-medium tabular-nums text-ink/40">
              {String(index + 1).padStart(2, "0")}
            </p>
            <WinnerTag winner={round.winner} sides={sides} />
          </div>
          <h3
            id={`${round.id}-title`}
            className="mt-4 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.6rem]"
          >
            {round.title}
          </h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/85">
            <Md text={round.verdict} />
          </p>
        </Reveal>

        {SIDES.map((side, i) => {
          const won = round.winner === side;
          return (
            <div
              key={side}
              className={cn(
                "px-5 py-7 sm:px-8 lg:py-10",
                i === 0 && cn("border-b lg:border-b-0 lg:border-r", LINE),
                won && WIN_TINT,
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-[0.88rem] font-semibold text-ink">
                  <ProductMark product={sides[side]} className="h-6 w-6 text-[0.6rem]" />
                  {sides[side].name}
                </p>
                {won && <RoundWinnerLabel />}
              </div>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
                <Md text={round[side]} strong="font-semibold text-ink/90" />
              </p>
            </div>
          );
        })}
      </article>
    </Band>
  );
}

export function RoundsSection({
  sides,
  entry,
}: {
  sides: Record<Side, Product>;
  entry: MatchupEntry;
}) {
  const tally = tallyOf(entry.rounds);
  const draws =
    tally.draw === 0 ? "" : tally.draw === 1 ? " and a draw" : ` and ${tally.draw} draws`;
  return (
    <section id="rounds" aria-labelledby="rounds-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Swords}
        eyebrow="Round by round"
        title={
          <span id="rounds-title">
            {spelled(entry.rounds.length)} rounds, scored{" "}
            <Accent>
              {tally.a}–{tally.b}
              {draws}
            </Accent>
          </span>
        }
        subtitle="Every round names a winner and says why. Where the gap is too small to decide anything, it's a draw."
      />
      <Scoreboard rounds={entry.rounds} sides={sides} />
      <Spacer />
      {entry.rounds.map((r, i) => (
        <RoundBand key={r.id} round={r} index={i} sides={sides} />
      ))}
    </section>
  );
}
