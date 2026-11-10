/**
 * Small pieces the /use-cases/professional-services sections share: the
 * Sample tag every mock carries, the signal chip the hero, the research and
 * the sample map all use, the sample firm's letter tile, and the section
 * title with its blue accent.
 */
import type { ReactNode } from "react";
import { Accent } from "@/components/landing/frame";
import { SIGNALS, type SignalId } from "@/data/persona-pages/professional-services";
import { cn } from "@/lib/utils";
import { SIGNAL_ICONS } from "./tokens";

/** Every mock screen on this page is a sample, and says so. */
export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

/** One of the four signals, with its icon. `label` overrides the signal's name. */
export function SignalChip({
  id,
  label,
  muted = false,
  className,
}: {
  id: SignalId;
  label?: string;
  muted?: boolean;
  className?: string;
}) {
  const Icon = SIGNAL_ICONS[id];
  const name = label ?? SIGNALS.find((s) => s.id === id)?.label ?? id;
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.66rem] font-semibold",
        muted
          ? "border border-ink/[0.08] bg-white text-muted-foreground"
          : "bg-cta-soft text-brand-blue-deep",
        className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{name}</span>
    </span>
  );
}

/** A plain letter tile for a sample firm. */
export function FirmTile({ letter, className }: { letter: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white font-display text-[0.7rem] font-bold text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
        className,
      )}
    >
      {letter}
    </span>
  );
}

/** A section title: the lead in ink, the close in the bold blue accent. */
export function Title({
  lead,
  accent,
  id,
  className,
}: {
  lead: ReactNode;
  accent: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]",
        className,
      )}
    >
      {lead} <Accent>{accent}</Accent>
    </h2>
  );
}
