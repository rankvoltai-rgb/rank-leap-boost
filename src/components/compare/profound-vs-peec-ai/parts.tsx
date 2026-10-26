/**
 * Small components the Profound vs Peec AI page shares between its sections.
 * Nothing here favours a side; both contenders always get the same mark,
 * the same weight and the same surface.
 */
import type { ReactNode } from "react";
import { parseInline } from "@/lib/inline-md";
import type { Product } from "@/data/compare/products";
import { ProductMark } from "@/components/compare/kit";
import { cn } from "@/lib/utils";

/** The data's inline markup: **bold**, `code` and [text](href). */
export function Md({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) => {
        let node: ReactNode = s.code ? (
          <code className="rounded bg-ink/[0.05] px-1 py-0.5 text-[0.9em]">{s.text}</code>
        ) : (
          s.text
        );
        if (s.bold) node = <strong className="font-semibold text-ink">{node}</strong>;
        if (s.href) {
          const external = /^https?:/.test(s.href);
          node = (
            <a
              href={s.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
              className="font-medium text-cta underline decoration-cta/30 underline-offset-2 hover:decoration-cta"
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

/** Both marks, overlapped, for cards that name a pair. */
export function PairMarks({ a, b, className }: { a: Product; b: Product; className?: string }) {
  return (
    <span aria-hidden className={cn("flex -space-x-1.5", className)}>
      <ProductMark product={a} className="h-8 w-8 text-xs ring-2 ring-white" />
      <ProductMark product={b} className="h-8 w-8 text-xs ring-2 ring-white" />
    </span>
  );
}
