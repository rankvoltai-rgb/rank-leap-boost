/**
 * Small components the /alternatives/koala-ai sections share: the blue
 * accent split, the state glyphs of the comparison, and the ruler ticks that
 * run through the page. Koala sells by the word, so the page's own motif is a
 * measuring tape: ticks along the edge of the hero, the meter band and the
 * closing band.
 */
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent } from "@/components/landing/frame";
import type { CellState } from "@/data/alternatives";
import { STATE_LABEL } from "./tokens";

/** A title with its closing `words` words in the blue accent. */
export function AccentTail({ text, words }: { text: string; words: number }) {
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

/* ---------- state glyphs ---------- */

/**
 * One cell's state. Rankbox's column draws in blue, the competitor's in a
 * neutral tone, so a column reads as one product all the way down; the shape
 * carries the meaning (tick, half-filled ring, dash) in both.
 */
export function StateGlyph({
  state,
  tone,
  className,
}: {
  state: CellState;
  tone: "rankbox" | "them";
  className?: string;
}) {
  const label = <span className="sr-only">{STATE_LABEL[state]}</span>;
  if (state === "yes") {
    return (
      <span
        title={STATE_LABEL.yes}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          tone === "rankbox"
            ? "bg-cta text-white"
            : "bg-[color-mix(in_oklab,var(--ink)_9%,white)] text-ink",
          className,
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
        {label}
      </span>
    );
  }
  if (state === "partial") {
    const stroke = tone === "rankbox" ? "var(--cta)" : "color-mix(in oklab, var(--ink) 55%, white)";
    return (
      <span title={STATE_LABEL.partial} className={cn("flex h-5 w-5 shrink-0", className)}>
        <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden>
          <circle cx="10" cy="10" r="8.25" fill="white" stroke={stroke} strokeWidth="1.5" />
          <path d="M10 3.5a6.5 6.5 0 0 1 0 13z" fill={stroke} />
        </svg>
        {label}
      </span>
    );
  }
  return (
    <span
      title={STATE_LABEL.no}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dashed border-ink/20 text-muted-foreground",
        className,
      )}
    >
      <Minus className="h-3 w-3" strokeWidth={2.5} aria-hidden />
      {label}
    </span>
  );
}

/* ---------- ruler ticks ---------- */

/**
 * A measuring tape along one edge: a minor tick every 8px and a major one
 * every 40px. Pure CSS, so it costs nothing and renders the same on the
 * server and the client.
 */
export function RulerTicks({
  edge = "top",
  onBlue = false,
  className,
}: {
  edge?: "top" | "bottom";
  onBlue?: boolean;
  className?: string;
}) {
  const minor = onBlue
    ? "rgba(255,255,255,0.32)"
    : "color-mix(in oklab, var(--ink) 14%, transparent)";
  const major = onBlue
    ? "rgba(255,255,255,0.5)"
    : "color-mix(in oklab, var(--ink) 22%, transparent)";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 h-4", className)}
      style={{
        [edge]: 0,
        backgroundImage: `repeating-linear-gradient(to right, ${major} 0 1px, transparent 1px 40px), repeating-linear-gradient(to right, ${minor} 0 1px, transparent 1px 8px)`,
        backgroundSize: "100% 14px, 100% 6px",
        backgroundPosition: `0 ${edge}, 0 ${edge}`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
