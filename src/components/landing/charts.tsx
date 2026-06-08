/* Lightweight inline-SVG charts — no chart library. */

function buildPath(points: number[], w: number, h: number, pad = 4) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = (w - pad * 2) / (points.length - 1);
  return points
    .map((p, i) => {
      const x = pad + i * step;
      const y = h - pad - ((p - min) / span) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function AreaChart({
  points,
  className,
  stroke = "var(--info)",
  fill = "var(--info)",
  w = 320,
  h = 110,
}: {
  points: number[];
  className?: string;
  stroke?: string;
  fill?: string;
  w?: number;
  h?: number;
}) {
  const line = buildPath(points, w, h);
  const id = `g${stroke.replace(/[^a-z]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.25" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w - 4},${h - 4} L4,${h - 4} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MiniLine({
  points,
  className,
  stroke = "var(--success)",
  w = 120,
  h = 44,
}: {
  points: number[];
  className?: string;
  stroke?: string;
  w?: number;
  h?: number;
}) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <path
        d={buildPath(points, w, h, 3)}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}