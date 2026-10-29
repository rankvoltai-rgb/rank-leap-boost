import { cn } from "@/lib/utils";
import { OWNERS, type Owner } from "./content";

/**
 * Who works a station. Rankbox is the one lane in brand blue; your agency is
 * ink on a faint tint; the client is an outline. The same three marks run
 * through the ticket and the stations matrix.
 */
const TONE: Record<Owner, string> = {
  rankbox: "bg-cta-soft text-brand-blue",
  agency: "bg-ink/[0.05] text-ink",
  client: "border border-ink/[0.12] text-muted-foreground",
};

const DOT: Record<Owner, string> = {
  rankbox: "bg-brand-blue",
  agency: "bg-ink",
  client: "border border-ink/40 bg-white",
};

export function OwnerChip({ owner, className }: { owner: Owner; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[0.72rem] font-medium",
        TONE[owner],
        className,
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", DOT[owner])} />
      {OWNERS[owner]}
    </span>
  );
}
