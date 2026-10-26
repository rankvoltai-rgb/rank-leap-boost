/**
 * The rounds, scored as they go.
 *
 * A track of every round opens the section, each cell a jump link carrying
 * the round's winner. Then one ruled band per round: on the left the round's
 * name, its call and the running score after it, so the reader watches the
 * tally build; on the right the verdict and each product's case, the
 * winner's case washed soft blue. The emphasis is earned per round, never
 * given to a product.
 */
import { Equal, Swords, Trophy } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  LINE_FILL,
  PANEL,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { ProductMark, jumpTo, useActiveSection } from "@/components/compare/kit";
import { tallyOf } from "@/data/compare/entries";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Round, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { Md, WinnerTag } from "./parts";
import { SIDES, WON_TINT, plural } from "./util";

const two = (i: number) => String(i + 1).padStart(2, "0");

function Track({
  rounds,
  sides,
  active,
}: {
  rounds: Round[];
  sides: Record<Side, Product>;
  active: string | null;
}) {
  return (
    <nav aria-label="Rounds">
      <CellGrid className="grid-cols-7">
        {rounds.map((r, i) => {
          const on = active === r.id;
          return (
            <li key={r.id} className={CELL}>
              <a
                href={`#${r.id}`}
                onClick={(e) => jumpTo(e, r.id)}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "group flex h-full flex-col items-center gap-2 px-1 py-4 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 md:items-start md:px-4 md:py-5 md:text-left",
                  on ? "bg-cta-soft" : "hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)]",
                )}
              >
                <span
                  className={cn(
                    "text-[0.72rem] font-medium tabular-nums",
                    on ? "text-cta" : "text-muted-foreground",
                  )}
                >
                  {two(i)}
                </span>
                <span className="hidden min-h-[2.5em] text-[0.8rem] font-medium leading-snug text-ink md:block">
                  {r.title}
                </span>
                <span className="md:mt-auto">
                  {r.winner === "draw" ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-[26%] border border-ink/[0.1] bg-white text-muted-foreground">
                      <Equal className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  ) : (
                    <ProductMark product={sides[r.winner]} className="h-6 w-6 text-[0.6rem]" />
                  )}
                  <span className="sr-only">
                    {r.title}: {r.winner === "draw" ? "draw" : `${sides[r.winner].name} wins`}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </CellGrid>
    </nav>
  );
}

/** The score after a round, as two numerals facing each other. */
function RunningScore({
  upTo,
  rounds,
  sides,
  index,
}: {
  upTo: Round[];
  rounds: number;
  sides: Record<Side, Product>;
  index: number;
}) {
  const t = tallyOf(upTo);
  const last = index === rounds - 1;
  return (
    <div className="mt-6 rounded-xl border border-ink/[0.08] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <p className="text-[0.7rem] font-medium text-muted-foreground">
        {last ? "Final score" : `Score after round ${index + 1}`}
      </p>
      <p className="sr-only">
        {sides.a.name} {t.a}, {sides.b.name} {t.b}, {plural(t.draw, "draw")}
      </p>
      <div aria-hidden className="mt-1.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <ProductMark product={sides.a} className="h-6 w-6 text-[0.6rem]" />
          <span className="font-display text-[1.6rem] font-medium leading-none tabular-nums text-ink">
            {t.a}
          </span>
        </span>
        <span className="text-[0.7rem] tabular-nums text-muted-foreground">
          {plural(t.draw, "draw")}
        </span>
        <span className="flex items-center gap-2">
          <span className="font-display text-[1.6rem] font-medium leading-none tabular-nums text-ink">
            {t.b}
          </span>
          <ProductMark product={sides.b} className="h-6 w-6 text-[0.6rem]" />
        </span>
      </div>
    </div>
  );
}

function RoundBand({
  round,
  index,
  rounds,
  sides,
}: {
  round: Round;
  index: number;
  rounds: Round[];
  sides: Record<Side, Product>;
}) {
  return (
    <Band id={round.id} className="scroll-mt-16">
      <article
        aria-labelledby={`${round.id}-title`}
        className="grid lg:grid-cols-[17.5rem_minmax(0,1fr)]"
      >
        <header
          className={cn(
            "border-b px-5 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-10",
            LINE,
            PANEL,
          )}
        >
          <div className="flex items-center justify-between gap-3 lg:block">
            <p className="text-[0.75rem] font-medium tabular-nums text-cta">Round {two(index)}</p>
            <WinnerTag winner={round.winner} sides={sides} className="lg:hidden" />
          </div>
          <h3
            id={`${round.id}-title`}
            className="mt-2 font-display text-[1.4rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.55rem]"
          >
            {round.title}
          </h3>
          <WinnerTag winner={round.winner} sides={sides} className="mt-4 hidden lg:inline-flex" />
          <div className="hidden lg:block">
            <RunningScore
              upTo={rounds.slice(0, index + 1)}
              rounds={rounds.length}
              sides={sides}
              index={index}
            />
          </div>
        </header>

        <div className="px-5 py-7 sm:px-10 lg:px-10 lg:py-10">
          <Reveal>
            <p className="max-w-3xl text-[1.02rem] leading-relaxed text-ink sm:text-[1.08rem]">
              <Md text={round.verdict} />
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <div
              className={cn(
                "mt-6 grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2",
                LINE,
                LINE_FILL,
              )}
            >
              {SIDES.map((side) => {
                const won = round.winner === side;
                return (
                  <div key={side} className={cn("p-4 sm:p-5", won ? WON_TINT : "bg-white")}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <ProductMark product={sides[side]} className="h-6 w-6 text-[0.6rem]" />
                        <span className="text-[0.88rem] font-semibold text-ink">
                          {sides[side].name}
                        </span>
                      </span>
                      {won && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-cta px-1.5 py-0.5 text-[0.66rem] font-semibold text-white">
                          <Trophy className="h-3 w-3" aria-hidden />
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
          </Reveal>
          <div className="lg:hidden">
            <RunningScore
              upTo={rounds.slice(0, index + 1)}
              rounds={rounds.length}
              sides={sides}
              index={index}
            />
          </div>
        </div>
      </article>
    </Band>
  );
}

export function Rounds({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const active = useActiveSection(entry.rounds.map((r) => r.id));

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
      />
      <Band>
        <Track rounds={entry.rounds} sides={sides} active={active} />
      </Band>
      {entry.rounds.map((r, i) => (
        <RoundBand key={r.id} round={r} index={i} rounds={entry.rounds} sides={sides} />
      ))}
    </section>
  );
}
