/**
 * Small components the Surfer SEO vs Clearscope page shares between its
 * bands: the inline-markup renderer, the winner tag, the paired marks.
 */
import type { ReactNode } from "react";
import { Equal } from "lucide-react";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import { ProductMark } from "@/components/compare/kit";
import type { Product } from "@/data/compare/products";
import type { Side, Winner } from "@/data/compare/types";

/** The data's inline markup — **bold**, `code`, [text](href) — as page text. */
export function Md({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) => {
        let node: ReactNode = s.text;
        if (s.code) {
          node = (
            <code className="rounded bg-ink/[0.05] px-1 py-0.5 font-mono text-[0.9em]">{node}</code>
          );
        }
        if (s.bold) node = <strong className="font-semibold text-ink">{node}</strong>;
        if (s.href) {
          const external = /^https?:/.test(s.href);
          node = (
            <a
              href={s.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-medium text-cta underline decoration-cta/30 underline-offset-4 hover:decoration-cta"
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

/** Who took a round, as a small label: the winner's mark and name, or an equals sign. */
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
          "inline-flex h-7 items-center gap-1.5 rounded-md border border-ink/[0.1] bg-white px-2 text-[0.75rem] font-medium text-muted-foreground",
          className,
        )}
      >
        <Equal className="h-3.5 w-3.5" aria-hidden />
        Draw
      </span>
    );
  }
  const p = sides[winner];
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md bg-cta-soft py-1 pl-1 pr-2 text-[0.75rem] font-semibold text-cta",
        className,
      )}
    >
      <ProductMark product={p} className="h-5 w-5 text-[0.55rem]" />
      {p.name} wins
    </span>
  );
}

/** The two marks, overlapped: the page's emblem for "both of them". */
export function PairMarks({
  sides,
  className,
}: {
  sides: Record<Side, Product>;
  className?: string;
}) {
  return (
    <span className="flex -space-x-1.5" aria-hidden>
      <ProductMark product={sides.a} className={cn("ring-2 ring-white", className)} />
      <ProductMark product={sides.b} className={cn("ring-2 ring-white", className)} />
    </span>
  );
}
