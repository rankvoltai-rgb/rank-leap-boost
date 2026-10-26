/**
 * The comparison's prose fields are written in the /ai-seo inline markup —
 * **bold**, `code` and [text](href). This renders them for this page alone,
 * with the page's own emphasis: bold reads as ink on muted copy.
 */
import type { ReactNode } from "react";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

export function Md({ text, strong }: { text: string; strong?: string }) {
  return (
    <>
      {parseInline(text).map((s, i) => {
        let node: ReactNode = s.text;
        if (s.code) {
          node = (
            <code className="rounded border border-ink/[0.08] bg-ink/[0.03] px-1 py-px font-mono text-[0.86em] text-ink">
              {node}
            </code>
          );
        }
        if (s.bold) node = <strong className={cn("font-semibold text-ink", strong)}>{node}</strong>;
        if (s.href) {
          const external = /^https?:\/\//.test(s.href);
          node = (
            <a
              href={s.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
