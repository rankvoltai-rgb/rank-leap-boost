/**
 * Small components shared by the sections of /compare/koala-ai-vs-byword:
 * the inline-markup renderer for the data's `Md` fields and the round
 * winner's chip and label. Constants live in ./tokens.
 */
import type { ReactNode } from "react";
import { Equal, Trophy } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import type { Product } from "@/data/compare/products";
import type { Side, Winner } from "@/data/compare/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/**
 * The data's inline markup — **bold**, `code` and [text](href) — set in the
 * page's own type. Links leave the site in a new tab unless they're internal.
 */
export function Md({ text, strong = "font-semibold text-ink" }: { text: string; strong?: string }) {
  const spans = parseInline(text);
  return (
    <>
      {spans.map((s, i) => {
        let node: ReactNode = s.text;
        if (s.code)
          node = (
            <code className="rounded-md border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-1.5 py-0.5 font-mono text-[0.84em] text-ink">
              {node}
            </code>
          );
        if (s.bold) node = <strong className={strong}>{node}</strong>;
        if (s.href) {
          const internal = s.href.startsWith("/") || s.href.startsWith("#");
          node = (
            <a
              href={s.href}
              {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="font-medium text-cta underline decoration-cta/30 underline-offset-[3px] hover:decoration-cta"
            >
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

/** A round's winner as a small chip: the product's mark and name, or "Draw". */
export function WinnerTag({
  winner,
  sides,
  className,
}: {
  winner: Winner;
  sides: Record<Side, Product>;
  className?: string;
}) {
  if (winner === "draw") {
    return (
      <span
        className={cn(
          "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-ink/[0.1] bg-white px-2.5 text-[0.75rem] font-medium text-muted-foreground",
          className,
        )}
      >
        <Equal className="h-3.5 w-3.5" aria-hidden />
        Draw
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-cta-soft py-0.5 pl-1 pr-2.5 text-[0.75rem] font-semibold text-cta",
        className,
      )}
    >
      <ProductMark product={sides[winner]} className="h-5 w-5 text-[0.5rem]" />
      {sides[winner].name} wins
    </span>
  );
}

export function RoundWinnerLabel() {
  return (
    <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cta">
      <Trophy className="h-3 w-3" aria-hidden />
      Round winner
    </span>
  );
}
