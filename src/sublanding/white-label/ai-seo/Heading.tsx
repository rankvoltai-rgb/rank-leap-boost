import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { h2, type SectionId } from "./content";

/** This page's section heading: an optional kicker, the H2 from OUTLINE, and its intro. */
export function Heading({
  id,
  kicker,
  intro,
  className,
  children,
}: {
  id: SectionId;
  kicker?: string;
  intro?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {kicker && <p className="text-[0.8rem] font-medium text-brand-blue">{kicker}</p>}
      <h2
        id={`${id}-title`}
        className={cn(
          "text-balance font-display text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.35rem]",
          kicker && "mt-3",
        )}
      >
        {h2(id)}
      </h2>
      {intro && (
        <p className="mt-4 text-pretty text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}
