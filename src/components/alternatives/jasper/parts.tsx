/**
 * Small pieces the /alternatives/jasper layout shares between its sections:
 * the three-state token (drawn the same for both products, so neither side
 * gets the friendlier glyph), the legend that explains it, and a title that
 * sets the closing phrase of data copy in the brand accent without rewriting
 * it.
 */
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent } from "@/components/landing/frame";
import type { CellState } from "@/data/alternatives";
import { STATE_LABEL } from "./helpers";

const TOKEN_SIZE = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

/**
 * Filled for included, half-filled for partly, a dashed ring for "not its
 * focus". Shape carries the meaning as well as colour, so it reads in
 * greyscale too.
 */
export function StateToken({
  state,
  size = "md",
  className,
}: {
  state: CellState;
  size?: keyof typeof TOKEN_SIZE;
  className?: string;
}) {
  return (
    <span
      title={STATE_LABEL[state]}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        TOKEN_SIZE[size],
        state === "yes" && "bg-cta text-white shadow-[0_1px_2px_rgba(22,111,229,0.35)]",
        state === "partial" &&
          "border-[1.5px] border-cta bg-[linear-gradient(90deg,var(--cta)_50%,white_50%)]",
        state === "no" && "border-[1.5px] border-dashed border-ink/25 bg-white",
        className,
      )}
    >
      {state === "yes" && <Check aria-hidden className="h-[62%] w-[62%]" strokeWidth={3.2} />}
      <span className="sr-only">{STATE_LABEL[state]}</span>
    </span>
  );
}

export function Legend({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.78rem] text-muted-foreground",
        className,
      )}
    >
      {(Object.keys(STATE_LABEL) as CellState[]).map((s) => (
        <li key={s} className="flex items-center gap-2">
          <span aria-hidden className="flex">
            <StateToken state={s} size="sm" />
          </span>
          {STATE_LABEL[s]}
        </li>
      ))}
    </ul>
  );
}

/**
 * "Jasper speeds up writers. Rankbox replaces the process." → the last
 * sentence in the accent. A one-sentence title gets its last `words` words
 * instead. The text itself is never changed.
 */
export function AccentTail({ text, words = 3 }: { text: string; words?: number }) {
  const sentence = text.match(/^(.*[.!?])\s+(\S.*)$/);
  if (sentence) {
    return (
      <>
        {sentence[1]} <Accent>{sentence[2]}</Accent>
      </>
    );
  }
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}
