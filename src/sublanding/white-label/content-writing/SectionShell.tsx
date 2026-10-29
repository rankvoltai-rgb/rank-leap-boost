import type { ReactNode } from "react";
import { INDEX, h2, type SectionId } from "./content";

/**
 * Every section's frame on this page: a narrow index column on wide screens
 * (number and label, held in view while the section scrolls), then the H2,
 * the intro and the section's one visual. The page reads like a spec sheet,
 * one station of the line at a time.
 */
export function SectionShell({
  id,
  intro,
  children,
}: {
  id: SectionId;
  intro?: string;
  children: ReactNode;
}) {
  const index = INDEX[id];
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 border-t border-ink/[0.07]"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-24">
        <div className="mb-5 lg:mb-0">
          <p className="flex items-center gap-2 text-[0.78rem] font-medium text-muted-foreground lg:sticky lg:top-28">
            <span className="font-mono text-brand-blue">{index.n}</span>
            <span aria-hidden className="h-px w-4 bg-ink/15" />
            {index.label}
          </p>
        </div>
        <div className="min-w-0">
          <h2
            id={`${id}-title`}
            className="max-w-3xl text-balance font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.15rem]"
          >
            {h2(id)}
          </h2>
          {intro && (
            <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
              {intro}
            </p>
          )}
          <div className="mt-10 sm:mt-12">{children}</div>
        </div>
      </div>
    </section>
  );
}
