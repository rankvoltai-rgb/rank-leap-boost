/**
 * Small pieces shared by the /ai-seo pages: the inline-markup renderer, engine
 * marks and tiles, and the evidence badge.
 */
import { Rich } from "@/components/blog/NotionBlocks";
import { AI_MARKS } from "@/components/landing/ai-logos";
import type { Engine, EngineMarkName } from "@/data/ai-seo/engines";
import type { Evidence, Md as MdText } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/* ---------- inline markup ---------- */

export function Md({ text }: { text: MdText }) {
  return <Rich spans={parseInline(text)} />;
}

/* ---------- engine marks ---------- */

export function EngineMark({ mark, className }: { mark: EngineMarkName; className?: string }) {
  const found = AI_MARKS.find((m) => m.name === mark) ?? AI_MARKS[0];
  const Mark = found.Mark;
  return <Mark className={className} />;
}

/** The engine's logo on a white tile, which reads on the blue field and on cards alike. */
export function EngineTile({
  engine,
  className,
  markClassName,
}: {
  engine: Engine;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-1",
        className,
      )}
    >
      <EngineMark mark={engine.mark} className={cn("h-[55%] w-[55%]", markClassName)} />
    </span>
  );
}

/* ---------- evidence ---------- */

const EVIDENCE: Record<Evidence, { label: string; title: string; className: string }> = {
  official: {
    label: "Official",
    title: "Stated in the vendor's own documentation",
    className: "border-success/30 bg-success/10 text-success",
  },
  observed: {
    label: "Observed",
    title: "Measured in independent studies, not confirmed by the vendor",
    className: "border-volt/30 bg-volt/10 text-volt",
  },
  "our-read": {
    label: "Our read",
    title: "Our interpretation of the evidence — weigh it accordingly",
    className: "border-border bg-secondary text-muted-foreground",
  },
};

export function EvidenceBadge({ evidence, className }: { evidence: Evidence; className?: string }) {
  const e = EVIDENCE[evidence];
  return (
    <span
      title={e.title}
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full border px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
        e.className,
        className,
      )}
    >
      {e.label}
    </span>
  );
}
