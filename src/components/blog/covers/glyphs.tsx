/* Small marks the cover scenes share, all in canvas units. */
import { GEMINI_SRC } from "@/components/landing/ai-logos";
import { MARK_PATH } from "@/components/brand/mark-path";
import type { Engine } from "./kit";

export interface Node {
  x: number;
  y: number;
  r: number;
}

/* A straight line between two circles, trimmed to their edges. */
export function Wire({
  a,
  b,
  className,
  width = 4,
  dash,
}: {
  a: Node;
  b: Node;
  className: string;
  width?: number;
  dash?: string;
}) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  return (
    <line
      x1={a.x + (dx / d) * a.r}
      y1={a.y + (dy / d) * a.r}
      x2={b.x - (dx / d) * b.r}
      y2={b.y - (dy / d) * b.r}
      className={className}
      strokeWidth={width}
      strokeDasharray={dash}
      strokeLinecap="round"
    />
  );
}

/* The Rankbox mark. className sets both fill and stroke. */
export function BrandGlyph({
  cx,
  cy,
  size,
  className,
}: {
  cx: number;
  cy: number;
  size: number;
  className: string;
}) {
  return (
    <svg x={cx - size / 2} y={cy - size / 2} width={size} height={size} viewBox="0 0 24 24">
      <path d={MARK_PATH} className={className} strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}

/* An engine's logo. Gemini's mark is a raster, so it goes in as an <image>;
   the rest are SVGs that fill a nested viewport. */
export function EngineGlyph({
  engine,
  cx,
  cy,
  size,
}: {
  engine: Engine;
  cx: number;
  cy: number;
  size: number;
}) {
  const box = { x: cx - size / 2, y: cy - size / 2, width: size, height: size };
  if (engine.name === "Gemini") return <image href={GEMINI_SRC} {...box} />;
  const Mark = engine.Mark;
  return (
    <svg {...box}>
      <Mark />
    </svg>
  );
}

/* An engine's logo on a white disc. */
export function EngineBadge({
  engine,
  cx,
  cy,
  r,
  ring = "stroke-ink/10",
}: {
  engine: Engine;
  cx: number;
  cy: number;
  r: number;
  ring?: string;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} className={`fill-white ${ring}`} strokeWidth={2} />
      <EngineGlyph engine={engine} cx={cx} cy={cy} size={r * 1.15} />
    </>
  );
}

export function Check({ cx, cy, className }: { cx: number; cy: number; className: string }) {
  return (
    <path
      d={`M${cx - 15} ${cy + 1} L${cx - 4} ${cy + 12} L${cx + 16} ${cy - 11}`}
      fill="none"
      className={className}
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/* A crawler: a brand-blue disc with two eyes. */
export function BotFace({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} className="fill-brand-blue" />
      <circle cx={cx - r * 0.36} cy={cy - r * 0.1} r={r * 0.17} className="fill-white" />
      <circle cx={cx + r * 0.36} cy={cy - r * 0.1} r={r * 0.17} className="fill-white" />
    </>
  );
}
