import type { MouseEvent, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { STUDIO_SIGNUP_HREF, startStudioSignup } from "@/sublanding/_shared/facts";
import { cn } from "@/lib/utils";
import { h2, type SectionId } from "./content";

/**
 * This page's own small pieces: the section shell, the H2, the ledger row the
 * whole page is drawn with, and the one call to action.
 */

export const CONTAINER = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export const CARD =
  "rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-32px_rgba(16,24,40,0.2)]";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const TEXT_LINK = cn(
  "font-medium text-cta underline decoration-cta/30 underline-offset-4 transition-colors hover:decoration-cta rounded-sm",
  FOCUS,
);

export function Section({
  id,
  className,
  children,
}: {
  id: SectionId;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-20 py-20 sm:py-28", className)}
    >
      <div className={CONTAINER}>{children}</div>
    </section>
  );
}

export function SectionTitle({ id, className }: { id: SectionId; className?: string }) {
  return (
    <h2
      id={`${id}-title`}
      className={cn(
        "max-w-3xl text-balance font-display text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.35rem]",
        className,
      )}
    >
      {h2(id)}
    </h2>
  );
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-muted-foreground sm:text-[1.08rem]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Label, dotted leader, amount: one line of a cost sheet. */
export function LedgerRow({
  label,
  value,
  swatch,
  strong = false,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  /** A colour key, when the row also names a segment of a bar. */
  swatch?: string;
  strong?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <dt
        className={cn(
          "flex min-w-0 items-center gap-2 text-sm",
          strong ? "font-semibold text-ink" : "text-muted-foreground",
        )}
      >
        {swatch && <span aria-hidden className={cn("h-2 w-2 shrink-0 rounded-[2px]", swatch)} />}
        <span className="min-w-0">{label}</span>
      </dt>
      <span
        aria-hidden
        className="min-w-4 flex-1 -translate-y-[0.2em] border-b border-dotted border-ink/20"
      />
      <dd
        className={cn(
          "shrink-0 text-sm tabular-nums text-ink",
          strong ? "font-semibold" : "font-medium",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * The page's one action: sign up as an agency and land on Studio. A real link,
 * so it works before JavaScript loads; with it, the intent is set first.
 */
export function StudioCta({ label, className }: { label: string; className?: string }) {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startStudioSignup();
  };
  return (
    <a
      href={STUDIO_SIGNUP_HREF}
      onClick={go}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-medium text-white shadow-[0_1px_2px_rgba(16,24,40,0.1)] transition-colors hover:bg-cta-hover",
        FOCUS,
        className,
      )}
    >
      {label}
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5"
      />
    </a>
  );
}
