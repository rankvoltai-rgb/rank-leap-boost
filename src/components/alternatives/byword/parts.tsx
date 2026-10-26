/**
 * Small pieces the /alternatives/byword sections share: the three-state mark
 * for matrix cells, the title splitter that gives a data title its blue
 * closing phrase, and a few formatting helpers.
 */
import type { CSSProperties, ReactNode } from "react";
import { Check, Minus } from "lucide-react";
import { Accent } from "@/components/landing/frame";
import { cn } from "@/lib/utils";
import type { CellState, Competitor, MatrixRow } from "@/data/alternatives";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** The white product card: hairline edge, soft shadow. */
export const SCREEN =
  "rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_44px_-24px_rgba(16,24,40,0.28)]";

/** The soft blue tint that marks Rankbox's column. */
export const RANKBOX_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or via an add-on",
  no: "Not its focus",
};

/**
 * A cell's state as a small round mark. Rankbox's column gets the solid blue
 * tick, the other column a neutral one, so the eye follows one column down
 * the table without the other reading as "worse".
 */
export function StateMark({
  state,
  rankbox = false,
  className,
}: {
  state: CellState;
  rankbox?: boolean;
  className?: string;
}) {
  return (
    <span
      title={STATE_LABEL[state]}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
        state === "yes" && (rankbox ? "bg-cta text-white" : "bg-ink/[0.07] text-ink/75"),
        state === "partial" && "border border-dashed border-ink/25 bg-white text-ink/70",
        state === "no" && "text-muted-foreground/60",
        className,
      )}
    >
      {state === "yes" ? (
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
      ) : (
        <Minus className="h-3 w-3" strokeWidth={state === "partial" ? 3 : 2.5} aria-hidden />
      )}
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}

/**
 * Splits a title from the data so its closing phrase can carry the blue
 * accent: after the last comma when there is one ("A bulk engine, | or a
 * daily one"), otherwise the last two words. The words stay exactly as the
 * data has them.
 */
export function splitTitle(text: string): [string, string] {
  const comma = text.lastIndexOf(", ");
  if (comma > 0) return [text.slice(0, comma + 1), text.slice(comma + 2)];
  const words = text.split(" ");
  if (words.length < 3) return ["", text];
  return [words.slice(0, -2).join(" "), words.slice(-2).join(" ")];
}

export function AccentTitle({ text }: { text: string }) {
  const [head, tail] = splitTitle(text);
  return (
    <>
      {head && `${head} `}
      <Accent>{tail}</Accent>
    </>
  );
}

/** A matrix row by its label, for the few places a section quotes one. */
export function findRow(c: Competitor, label: string): MatrixRow | undefined {
  return c.matrix.flatMap((g) => g.rows).find((r) => r.label === label);
}

/** "https://byword.ai/learn/docs/x/" → "byword.ai/learn/docs/x". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "")}`;
  } catch {
    return url;
  }
}

/** A short uppercase label, for card headers and table group rows. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
