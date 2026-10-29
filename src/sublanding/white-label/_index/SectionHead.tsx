import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { OUTLINE, h2, type SectionId } from "./content";
import { H2, INTRO } from "./ui";

/**
 * A section's heading: its place in the page as a small index, a kicker, the
 * H2 from OUTLINE and an optional intro. Left-aligned, like a chapter.
 */
export function SectionHead({
  id,
  kicker,
  intro,
  className,
  children,
}: {
  id: SectionId;
  kicker: string;
  intro?: string;
  className?: string;
  children?: ReactNode;
}) {
  const n = OUTLINE.findIndex((s) => s.id === id) + 1;
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="flex items-center gap-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <span className="font-mono text-[0.72rem] font-medium tracking-normal text-cta">
          {String(n).padStart(2, "0")}
        </span>
        <span aria-hidden className="h-px w-5 bg-border" />
        {kicker}
      </p>
      <h2 id={`${id}-title`} className={cn(H2, "mt-4")}>
        {h2(id)}
      </h2>
      {intro && <p className={INTRO}>{intro}</p>}
      {children}
    </div>
  );
}
