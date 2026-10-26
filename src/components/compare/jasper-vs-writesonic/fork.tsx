/**
 * The page's focal picture: the fork.
 *
 * What's most telling about Jasper vs Writesonic is that they stopped being
 * the same kind of product — both began as AI writers, then one grew into a
 * marketing-agents platform and the other into an AI search visibility tool.
 * The seven rounds split along that same line. So the picture is a tree: one
 * origin, two branches, and every round hung on the branch of the product
 * that won it.
 *
 * The story, while the card is about half on screen: the branches light up,
 * then the rounds are scored one at a time in their order on the page, each
 * bead lighting on its winner's branch, and the card ends on the tally.
 * Leaving the screen resets it. The first paint (and the server render) is
 * the whole tree in outline, so it reads before any motion; reduced motion
 * shows the scored tree, still.
 */
import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GitFork } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import { tallyOf } from "@/data/compare/entries";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Round, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { CARD, EASE, SIDES, plural, useStory } from "./lib";

/* A dashed outline that a solid blue line draws over. */
function Line({
  on,
  axis,
  className,
  delay = 0,
  progress = 1,
}: {
  on: boolean;
  axis: "x" | "y";
  className?: string;
  delay?: number;
  /** How far the solid line has drawn, 0–1. */
  progress?: number;
}) {
  const v = axis === "y";
  return (
    <span aria-hidden className={cn("absolute block", className)}>
      <span
        className={cn(
          "absolute border-dashed border-ink/[0.16]",
          v ? "inset-y-0 left-1/2 w-0 -translate-x-1/2 border-l" : "inset-x-0 top-0 h-0 border-t",
        )}
      />
      <motion.span
        className={cn(
          "absolute bg-cta/70",
          v ? "inset-y-0 left-1/2 w-px -translate-x-1/2 origin-top" : "inset-x-0 top-0 h-px",
        )}
        initial={false}
        animate={v ? { scaleY: on ? progress : 0 } : { scaleX: on ? progress : 0 }}
        transition={{ duration: 0.6, delay: on ? delay : 0, ease: EASE }}
      />
    </span>
  );
}

function Bead({
  round,
  index,
  on,
  current,
}: {
  round: Round;
  index: number;
  on: boolean;
  current: boolean;
}) {
  return (
    <motion.span
      initial={false}
      animate={{ scale: current ? [1, 1.07, 1] : 1 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={cn(
        "relative z-10 inline-flex max-w-full items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-[0.72rem] leading-tight transition-[background-color,border-color,color,box-shadow] duration-500 sm:text-[0.76rem]",
        on
          ? "border-cta/25 bg-cta-soft font-medium text-ink"
          : "border-dashed border-ink/[0.16] bg-white text-muted-foreground",
        current && "shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)]",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.64rem] font-semibold tabular-nums transition-colors duration-500",
          on ? "bg-cta text-white" : "bg-ink/[0.05] text-muted-foreground",
        )}
      >
        {index + 1}
      </span>
      <span className="text-left">{round.title}</span>
    </motion.span>
  );
}

function Branch({
  product,
  founded,
  won,
  indexOf,
  lit,
  linesOn,
  currentId,
}: {
  product: Product;
  founded?: string;
  won: Round[];
  indexOf: (r: Round) => number;
  /** How many of the page's rounds have been scored so far. */
  lit: number;
  linesOn: boolean;
  currentId: string | null;
}) {
  const scored = won.filter((r) => indexOf(r) < lit).length;
  return (
    <div className="relative flex h-full flex-col items-center px-1.5 pt-6 sm:px-3">
      {/* The drop from the split bar to the product. */}
      <Line on={linesOn} axis="y" delay={0.35} className="inset-x-0 top-0 h-6" />

      <ProductMark product={product} className="h-11 w-11 text-base shadow-sm" />
      <p className="mt-2 text-[0.95rem] font-semibold tracking-tight text-ink">{product.name}</p>
      <p className="mt-0.5 max-w-[11rem] text-balance text-center text-[0.72rem] leading-snug text-muted-foreground">
        {product.kind}
      </p>
      {founded && (
        <p className="mt-1 text-center text-[0.66rem] leading-snug text-muted-foreground/80">
          {founded}
        </p>
      )}

      {/* The branch: the rounds this product won, in page order. */}
      <div className="relative mt-3 flex w-full flex-1 flex-col items-center gap-2.5 py-3">
        <Line
          on={linesOn && scored > 0}
          axis="y"
          progress={won.length ? scored / won.length : 0}
          className="inset-x-0 inset-y-0"
        />
        {won.map((r) => (
          <Bead
            key={r.id}
            round={r}
            index={indexOf(r)}
            on={indexOf(r) < lit}
            current={r.id === currentId}
          />
        ))}
      </div>

      <div className="relative z-10 mt-1 flex flex-col items-center bg-white px-2">
        <span className="font-display text-[2.3rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
          {won.length}
        </span>
        <span className="mt-1 text-[0.7rem] text-muted-foreground">
          {won.length === 1 ? "round won" : "rounds won"}
        </span>
        <span className="mt-2 flex gap-1">
          {won.map((r, i) => (
            <span
              key={r.id}
              className={cn(
                "h-1.5 w-4 rounded-full transition-colors duration-500",
                i < scored ? "bg-cta" : "bg-ink/[0.1]",
              )}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export function ForkCard({
  matchup,
  entry,
  className,
}: {
  matchup: Matchup;
  entry: MatchupEntry;
  className?: string;
}) {
  const sides = sidesOf(matchup);
  const rounds = entry.rounds;
  const n = rounds.length;
  const tally = tallyOf(rounds);
  const won: Record<Side, Round[]> = {
    a: rounds.filter((r) => r.winner === "a"),
    b: rounds.filter((r) => r.winner === "b"),
  };
  const draws = rounds.filter((r) => r.winner === "draw");
  const indexOf = (r: Round) => rounds.indexOf(r);

  /* The first sentence of the subhead is where both began. */
  const origin = entry.subhead.split(/(?<=\.)\s+/)[0];
  const founded = entry.tape.find((t) => t.label === "Founded");

  /* Phase 0: the tree in outline. 1: the branches draw. 2…n+1: round k is
     scored. n+2: the tally. */
  const steps = useMemo(() => [900, 800, ...rounds.map(() => 780), 900], [rounds]);
  const { ref, phase, last } = useStory<HTMLDivElement>(steps);
  const linesOn = phase >= 1;
  const lit = Math.max(0, Math.min(n, phase - 1));
  const done = phase >= last;
  const current = lit > 0 && !done ? rounds[lit - 1] : null;

  const nameOf = (r: Round) => (r.winner === "draw" ? "Draw" : sides[r.winner].name);
  const drawLine = tally.draw ? plural(tally.draw, "draw") : "no draws";
  const label = [
    `Rounds won. ${sides.a.name} ${tally.a}: ${won.a.map((r) => r.title).join(", ")}.`,
    `${sides.b.name} ${tally.b}: ${won.b.map((r) => r.title).join(", ")}.`,
    draws.length ? `Draws: ${draws.map((r) => r.title).join(", ")}.` : "No draws.",
  ].join(" ");

  const caption = done
    ? `${sides.a.name} ${tally.a} – ${tally.b} ${sides.b.name} · ${drawLine}`
    : current
      ? `Round ${lit} · ${current.title} → ${nameOf(current)}`
      : `${plural(n, "round")}, scored in order`;

  return (
    <div ref={ref} role="img" aria-label={label} className={cn(CARD, "overflow-hidden", className)}>
      <div
        aria-hidden
        className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3"
      >
        <span className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
            <GitFork className="h-3 w-3" />
          </span>
          Rounds won
        </span>
        <span className="text-[0.74rem] text-muted-foreground tabular-nums">
          {plural(n, "round")} · {drawLine}
        </span>
      </div>

      <div aria-hidden className="px-2 pb-6 pt-6 sm:px-4">
        {/* Where both began. */}
        <div className="flex justify-center">
          <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-ink/[0.09] bg-white py-1 pl-1 pr-3 text-[0.76rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
            <span className="flex -space-x-1.5">
              <ProductMark product={sides.a} className="h-6 w-6 text-[0.6rem] ring-2 ring-white" />
              <ProductMark product={sides.b} className="h-6 w-6 text-[0.6rem] ring-2 ring-white" />
            </span>
            {origin}
          </span>
        </div>

        <div className="relative h-6">
          <Line on={linesOn} axis="y" className="inset-0" />
        </div>

        <div className="relative grid grid-cols-2">
          {/* The split, between the two column centres. */}
          <Line on={linesOn} axis="x" delay={0.15} className="left-1/4 right-1/4 top-0 h-px" />
          {SIDES.map((side) => (
            <Branch
              key={side}
              product={sides[side]}
              founded={founded?.[side]}
              won={won[side]}
              indexOf={indexOf}
              lit={lit}
              linesOn={linesOn}
              currentId={current?.id ?? null}
            />
          ))}
        </div>

        {draws.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {draws.map((r) => (
              <Bead
                key={r.id}
                round={r}
                index={indexOf(r)}
                on={indexOf(r) < lit}
                current={r.id === current?.id}
              />
            ))}
          </div>
        )}
      </div>

      <div
        aria-hidden
        className="flex h-11 items-center justify-center overflow-hidden border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-4"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={cn(
              "truncate text-[0.8rem] tabular-nums",
              done ? "font-semibold text-ink" : "text-muted-foreground",
            )}
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
