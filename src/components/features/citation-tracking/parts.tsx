/**
 * Small pieces the citation-tracking pictures share: engine tiles, the
 * cited / not-cited pills, the numbered pins that tie the tracker to the
 * facts band under it, and a figure that glides between values.
 */
import { useEffect, type ComponentType } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** The white card every product picture sits in. */
export const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_18px_40px_-24px_rgba(16,24,40,0.28)]";

/** An engine's mark in a small white tile. */
export function MarkTile({
  Mark,
  className,
  markClassName,
}: {
  Mark: ComponentType<{ className?: string }>;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        className,
      )}
    >
      <Mark className={cn("h-3.5 w-3.5", markClassName)} />
    </span>
  );
}

/** A numbered pin: the same number marks a part of the tracker and its fact. */
export function Pin({ n, className }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-full bg-cta text-[0.6rem] font-semibold leading-none text-white shadow-[0_0_0_2px_white,0_2px_6px_-1px_rgba(22,111,229,0.5)] tabular-nums",
        className,
      )}
    >
      {n}
    </span>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

export function CitedPill({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cta text-white">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.66rem] font-semibold text-cta shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_16%,transparent)]">
      <Check className="h-3 w-3" strokeWidth={2.75} />
      Cited
    </span>
  );
}

export function NotCitedPill({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="block h-[0.85rem] w-[0.85rem] rounded-full border-[1.5px] border-ink/[0.16]" />
    );
  }
  return (
    <span className="inline-flex whitespace-nowrap rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.66rem] font-medium text-muted-foreground">
      Not cited
    </span>
  );
}

/** A small ring that turns while an answer is being checked. */
export function Checking() {
  return (
    <span className="block h-3 w-3 rounded-full border-[1.5px] border-cta/25 border-t-cta motion-safe:animate-spin" />
  );
}

/** A figure that glides to its value; `run` false jumps straight there. */
export function Num({ value, run }: { value: number; run: boolean }) {
  const spring = useSpring(value, { stiffness: 90, damping: 20, mass: 0.7 });
  const text = useTransform(spring, (v) => String(Math.round(v)));
  useEffect(() => {
    if (run) spring.set(value);
    else spring.jump(value);
  }, [run, value, spring]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}
