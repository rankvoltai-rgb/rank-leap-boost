import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FlameIcon } from "@/components/dashboard/icons";

/**
 * Shared signal primitives — small data-viz glyphs reused across Articles,
 * Calendar, Keyword Lab, Insights and the Overview so every surface speaks the
 * same visual language.
 */

/** AI opportunity signal rendered as charged flames (1–3). */
export function AiSignalFlames({ signal, label = true }: { signal: number; label?: boolean }) {
  const filled = signal >= 80 ? 3 : signal >= 55 ? 2 : 1;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1"
      title={`AI opportunity signal: ${signal}/100`}
      aria-label={`AI opportunity signal ${filled} of 3`}
    >
      {[0, 1, 2].map((i) => (
        <FlameIcon
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < filled ? "fill-flame text-flame" : "fill-muted text-muted-foreground/30",
          )}
        />
      ))}
      {label && (
        <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
          AI
        </span>
      )}
    </span>
  );
}

/** Competition / difficulty rendered as a three-segment meter. */
export function DifficultyBar({ label }: { label: string | null }) {
  const l = (label ?? "Medium").toLowerCase();
  const filled = l.includes("high") ? 3 : l.includes("low") ? 1 : 2;
  const tone = filled === 1 ? "bg-success" : filled === 2 ? "bg-warning" : "bg-destructive";
  return (
    <span className="inline-flex items-center gap-1.5" title={`Competition: ${label ?? "Medium"}`}>
      <span className="flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "w-1 rounded-full",
              i === 0 ? "h-2" : i === 1 ? "h-2.5" : "h-3",
              i < filled ? tone : "bg-border",
            )}
          />
        ))}
      </span>
      <span className="text-[0.65rem] font-medium text-muted-foreground">{label ?? "Medium"}</span>
    </span>
  );
}

/** Lightweight inline-SVG sparkline / area chart. */
export function Sparkline({
  data,
  className,
  stroke = "var(--volt)",
  fill = true,
  width = 120,
  height = 36,
}: {
  data: number[];
  className?: string;
  stroke?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pad = 3;
  const inner = height - pad * 2;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = pad + (inner - ((d - min) / range) * inner);
    return [x, y] as const;
  });
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      {fill && <path d={area} fill={stroke} opacity={0.12} />}
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A labelled horizontal meter bar (0–100). */
export function MeterBar({
  value,
  max = 100,
  tone = "volt",
  className,
  children,
}: {
  value: number;
  max?: number;
  tone?: "volt" | "success" | "warning" | "flame";
  className?: string;
  children?: ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, max > 0 ? (value / max) * 100 : 0));
  const bg = {
    volt: "bg-volt",
    success: "bg-success",
    warning: "bg-warning",
    flame: "bg-flame",
  }[tone];
  return (
    <div className={cn("space-y-1", className)}>
      {children}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all duration-700", bg)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}