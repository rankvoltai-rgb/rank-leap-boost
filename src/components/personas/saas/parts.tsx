/**
 * Small components the /use-cases/saas sections share: the intent chip that
 * colours the sample topic map everywhere it appears, the Sample tag every
 * product screen carries, and the sample site's tile.
 */
import type { ReactNode } from "react";
import { Accent } from "@/components/landing/frame";
import { cn } from "@/lib/utils";
import { stageTint } from "./tokens";

/** A title with its last `words` words set in the blue accent. */
export function Accented({ text, words }: { text: string; words: number }) {
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

/** An intent label in its stage's tint. */
export function IntentChip({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const tint = stageTint(index);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
        className,
      )}
      style={{ background: tint.panel, color: tint.ink }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tint.dot }} />
      {children}
    </span>
  );
}

/** Every product screen on this page is a sample, and says so. */
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

/** A plain letter tile for the sample site. */
export function SiteTile({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-[0.68rem] font-bold text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
        className,
      )}
    >
      Y
    </span>
  );
}
