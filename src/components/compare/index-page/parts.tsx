/**
 * Small pieces the hub draws more than once: the pair of product marks, the
 * tally as text, and the round strip — every round on a page as one square,
 * each side's wins running outward from a centre line with the draws on it.
 *
 * The strip is the hub's own picture of "a call in every round". Both sides
 * get the same blue for a round won, so nothing favours a product; who is
 * ahead reads from how far the blue runs on each side of the line.
 */
import type { CSSProperties } from "react";
import { motion, type Variants } from "motion/react";
import { Equal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductMark } from "@/components/compare/kit";
import { MATCHUPS, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import { plural } from "./copy";

/* ---------- pair ---------- */

/** Two marks and a quiet "vs" between them. */
export function Pair({
  a,
  b,
  size = "md",
  className,
}: {
  a: Product;
  b: Product;
  size?: "sm" | "md";
  className?: string;
}) {
  const tile = size === "md" ? "h-10 w-10 text-sm" : "h-7 w-7 text-[0.65rem]";
  return (
    <span aria-hidden className={cn("flex items-center gap-1.5", className)}>
      <ProductMark product={a} className={tile} />
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-[0.55rem] font-bold tracking-[0.08em] text-muted-foreground">
        VS
      </span>
      <ProductMark product={b} className={tile} />
    </span>
  );
}

/* ---------- tally ---------- */

/** "4–1 · 2 draws", with the full count in the title. */
export function Tally({ matchup, className }: { matchup: Matchup; className?: string }) {
  const { a, b, draw } = matchup.tally;
  const sides = sidesOf(matchup);
  return (
    <span
      title={`Rounds won: ${sides.a.name} ${a}, ${sides.b.name} ${b}${draw ? `, ${plural(draw, "draw")}` : ""}`}
      className={cn("whitespace-nowrap text-[0.82rem] tabular-nums", className)}
    >
      <span className="font-semibold text-ink">
        {a}&ndash;{b}
      </span>
      {draw > 0 && <span className="text-muted-foreground"> · {plural(draw, "draw")}</span>}
    </span>
  );
}

/* ---------- round strip ---------- */

/* The zones are as wide as the largest count on the hub, so the centre line
   falls in the same place on every row and the strips read as one board. */
const MAX_WINS = Math.max(...MATCHUPS.flatMap((m) => [m.tally.a, m.tally.b]));
const MAX_DRAWS = Math.max(...MATCHUPS.map((m) => m.tally.draw));
const zone = (n: number): CSSProperties => ({
  width: `calc(${n} * var(--slot) + ${Math.max(n - 1, 0)} * var(--gap))`,
});

/* The corner scales with the square, so a small strip keeps square slots. */
const SLOT =
  "relative block h-[var(--slot)] w-[var(--slot)] shrink-0 rounded-[calc(var(--slot)*0.26)]";
const EMPTY = "border border-ink/[0.12] bg-white";
const WON =
  "bg-brand-blue shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(4,24,72,0.18)]";
const DRAWN = "flex items-center justify-center border border-ink/[0.1] bg-[#eef1f5] text-ink/45";

/** Each slot fills on its own beat: `custom` is its delay, or -1 for "now". */
const FILL: Variants = {
  off: { opacity: 0, scale: 0.35, transition: { duration: 0.18 } },
  on: (d: number) => ({
    opacity: 1,
    scale: 1,
    transition: d < 0 ? { duration: 0 } : { delay: d, duration: 0.36, ease: [0.34, 1.5, 0.64, 1] },
  }),
};

export interface StripPlay {
  /** On screen: the rounds get called. Off: back to empty slots. */
  on: boolean;
  /** Reduced motion: every round called at once, no movement. */
  reduce: boolean;
  /** When this row's first round is called, in seconds. */
  start: number;
}

function Slot({ kind, seq, play }: { kind: "won" | "draw"; seq: number; play?: StripPlay }) {
  const fill = kind === "won" ? WON : DRAWN;
  const glyph = kind === "draw" && <Equal className="h-[62%] w-[62%]" strokeWidth={2.5} />;

  // Static: the cards' strips, already called.
  if (!play) return <span className={cn(SLOT, fill)}>{glyph}</span>;

  return (
    <span className={cn(SLOT, EMPTY)}>
      <motion.span
        className={cn("absolute -inset-px rounded-[inherit]", fill)}
        initial="off"
        animate={play.on || play.reduce ? "on" : "off"}
        variants={FILL}
        custom={play.reduce ? -1 : play.start + seq * 0.07}
      >
        {glyph}
      </motion.span>
    </span>
  );
}

/**
 * One page's rounds. Draws are called first, on the line; then the wins,
 * one each side in turn, working outward.
 */
export function RoundStrip({
  matchup,
  play,
  className,
}: {
  matchup: Matchup;
  /** Leave out for the still, fully called strip. */
  play?: StripPlay;
  className?: string;
}) {
  const { a, b, draw } = matchup.tally;
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center gap-2 [--gap:4px] [--slot:18px] md:gap-2.5 md:[--slot:20px]",
        className,
      )}
    >
      <span className="flex justify-end gap-[var(--gap)]" style={zone(MAX_WINS)}>
        {Array.from({ length: a }, (_, i) => (
          // DOM order runs outside-in, so the slot nearest the line is last.
          <Slot key={i} kind="won" seq={draw + 2 * (a - 1 - i)} play={play} />
        ))}
      </span>
      <span className="relative flex justify-center gap-[var(--gap)]" style={zone(MAX_DRAWS)}>
        <span className="absolute -inset-y-2 left-1/2 w-px -translate-x-1/2 bg-ink/[0.12]" />
        {Array.from({ length: draw }, (_, i) => (
          <Slot key={i} kind="draw" seq={i} play={play} />
        ))}
      </span>
      <span className="flex justify-start gap-[var(--gap)]" style={zone(MAX_WINS)}>
        {Array.from({ length: b }, (_, i) => (
          <Slot key={i} kind="won" seq={draw + 2 * i + 1} play={play} />
        ))}
      </span>
    </span>
  );
}

/** The strip's key: what a filled square and a marked one mean. */
export function StripLegend({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-4 text-[0.75rem] text-muted-foreground", className)}>
      <span className="flex items-center gap-1.5">
        <span aria-hidden className={cn(SLOT, WON, "[--slot:12px]")} />
        Round won
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden className={cn(SLOT, DRAWN, "[--slot:12px]")} />
        Draw
      </span>
    </span>
  );
}
