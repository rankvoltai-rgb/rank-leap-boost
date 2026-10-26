/**
 * Rankbox's tile, hidden from assistive tech: everywhere the hub draws it, the
 * name "Rankbox" is written beside it, and the mark's own label would read it
 * twice.
 */
import { RankboxMark } from "@/components/alternatives/kit";

export function UsMark({ className }: { className?: string }) {
  return (
    <span aria-hidden className="inline-flex shrink-0">
      <RankboxMark className={className} />
    </span>
  );
}
