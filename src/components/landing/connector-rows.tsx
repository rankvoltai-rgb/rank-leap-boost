/**
 * Three rows of connector chips rolling under the dashboard showcase, after
 * Rankaria's strip of directory domains. Ours are the real connector library
 * (data/connectors.ts): every place Rankbox publishes to or plugs into, each
 * with its own icon, category and how it connects.
 *
 * The rows drift at different speeds, the middle one the other way. Hovering
 * a row holds it and lifts the chip under the pointer. Each row's track holds
 * its chips twice, so sliding it by half loops without a seam; the copy is
 * hidden from screen readers. With reduced motion the rows sit still and
 * scroll sideways.
 */
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, CONNECTORS, type Connector } from "@/data/connectors";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";

const CATEGORY_LABEL: Record<string, string> = {
  website: "Website",
  assistant: "AI assistant",
  builder: "AI app builder",
  coding: "Coding agent",
  automation: "Automation",
  developer: "Developer",
};

/* How it connects, as the chip's badge: Rankaria's DR pill, in our terms. */
const KIND = {
  site: { label: "Auto-publish", className: "bg-success/10 text-success ring-success/20" },
  mcp: { label: "MCP", className: "bg-cta-soft text-cta ring-cta/20" },
  api: { label: "API", className: "bg-violet-500/10 text-violet-600 ring-violet-500/20" },
} as const;

function Chip({ c, copy }: { c: Connector; copy: boolean }) {
  const kind = KIND[c.kind];
  return (
    <li
      aria-hidden={copy || undefined}
      className="group/chip flex h-16 w-[16.5rem] shrink-0 items-center gap-3 rounded-lg border border-ink/[0.08] bg-white px-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow,transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-cta/60 hover:bg-[color-mix(in_oklab,var(--cta-soft)_45%,white)] hover:shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_12%,transparent),0_12px_24px_-16px_rgba(16,24,40,0.35)]"
    >
      <ConnectorLogo connector={c} className="h-8 w-8" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.92rem] font-medium leading-tight text-ink">
          {c.name}
        </span>
        <span className="block truncate text-[0.72rem] text-muted-foreground">
          {CATEGORY_LABEL[c.category] ?? c.category}
        </span>
      </span>
      <span
        className={cn(
          "shrink-0 rounded-md px-1.5 py-0.5 text-[0.66rem] font-semibold ring-1 ring-inset",
          kind.className,
        )}
      >
        {kind.label}
      </span>
    </li>
  );
}

function Row({
  items,
  duration,
  reverse = false,
}: {
  items: Connector[];
  duration: number;
  reverse?: boolean;
}) {
  return (
    <div className="group/row overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className={cn(
          "flex w-max motion-safe:animate-marquee group-hover/row:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {/* Spacing inside each copy, so half the track is exactly one copy. */}
        <ul className="flex gap-3 py-1.5 pr-3">
          {items.map((c) => (
            <Chip key={c.id} c={c} copy={false} />
          ))}
        </ul>
        <ul aria-hidden className="flex gap-3 py-1.5 pr-3 motion-reduce:hidden">
          {items.map((c) => (
            <Chip key={c.id} c={c} copy />
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Deal the library across three rows so each mixes categories, websites
   first so the publishing platforms lead the top row. */
const ORDERED = CATEGORIES.flatMap((cat) => CONNECTORS.filter((c) => c.category === cat.id));
const ROWS: Connector[][] = [[], [], []];
ORDERED.forEach((c, i) => ROWS[i % 3].push(c));

export function ConnectorRows() {
  return (
    <div
      aria-label="Where Rankbox connects"
      role="region"
      className="space-y-1.5 py-4 [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]"
    >
      <Row items={ROWS[0]} duration={95} />
      <Row items={ROWS[1]} duration={115} reverse />
      <Row items={ROWS[2]} duration={85} />
    </div>
  );
}
