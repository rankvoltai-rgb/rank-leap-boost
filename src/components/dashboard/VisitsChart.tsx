import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import type { TrajectoryPoint } from "@/components/dashboard/rank-model";
import { parseDateKey } from "@/components/dashboard/queue-plan";

const HEIGHT = 232;
const PAD = { top: 30, right: 18, bottom: 26, left: 46 };

function compact(n: number): string {
  if (n >= 10_000) return `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return n.toLocaleString();
}

/** A round axis ceiling just above the max, so the line uses the height it's given. */
function niceCeil(n: number): number {
  if (n <= 0) return 10;
  const exp = 10 ** Math.floor(Math.log10(n));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * exp >= n) return m * exp;
  return 10 * exp;
}

/**
 * Projected monthly visits over time — one series, so no legend box: solid is
 * what's already published, dashed is what the schedule adds. A crosshair
 * reads any day; arrow keys do the same from the keyboard.
 */
export function VisitsChart({ points }: { points: TrajectoryPoint[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = points.length;
  const todayIdx = Math.max(0, points.findIndex((p) => p.future) - 1);
  const lastPastIdx = points.some((p) => p.future) ? todayIdx : n - 1;
  const hasFuture = lastPastIdx < n - 1;
  const max = points[n - 1]?.value ?? 0;
  const yMax = niceCeil(max * 1.12);

  const innerW = Math.max(0, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (n > 1 ? (i / (n - 1)) * innerW : innerW / 2);
  const y = (v: number) => PAD.top + innerH - (v / yMax) * innerH;
  const base = PAD.top + innerH;

  const paths = useMemo(() => {
    if (!width || n < 2) return null;
    const line = (from: number, to: number) =>
      points
        .slice(from, to + 1)
        .map((p, k) => `${k === 0 ? "M" : "L"}${x(from + k).toFixed(1)},${y(p.value).toFixed(1)}`)
        .join("");
    const area = (from: number, to: number) =>
      `${line(from, to)}L${x(to).toFixed(1)},${base}L${x(from).toFixed(1)},${base}Z`;
    return {
      pastLine: line(0, lastPastIdx),
      pastArea: area(0, lastPastIdx),
      futureLine: hasFuture ? line(lastPastIdx, n - 1) : "",
      futureArea: hasFuture ? area(lastPastIdx, n - 1) : "",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, width, yMax]);

  const months = useMemo(
    () =>
      points
        .map((p, i) => ({ p, i }))
        .filter(({ p, i }) => i > 0 && p.day.endsWith("-01"))
        .map(({ p, i }) => ({ i, label: format(parseDateKey(p.day), "MMM") })),
    [points],
  );

  if (n < 2) return null;

  const today = points[lastPastIdx];
  const end = points[n - 1];
  const active = hover !== null ? points[hover] : null;

  function indexAt(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || innerW <= 0) return null;
    const ratio = (clientX - rect.left - PAD.left) / innerW;
    return Math.max(0, Math.min(n - 1, Math.round(ratio * (n - 1))));
  }

  return (
    <div
      ref={wrapRef}
      className="relative select-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      tabIndex={0}
      role="group"
      aria-label={`Projected monthly visits: ${today.value.toLocaleString()} today${
        hasFuture
          ? `, ${end.value.toLocaleString()} by ${format(parseDateKey(end.day), "MMM d")}`
          : ""
      }. Use the arrow keys to read each day.`}
      onPointerMove={(e) => setHover(indexAt(e.clientX))}
      onPointerLeave={() => setHover(null)}
      onFocus={() => setHover((h) => h ?? lastPastIdx)}
      onBlur={() => setHover(null)}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const step = e.shiftKey ? 7 : 1;
        setHover((h) =>
          Math.max(
            0,
            Math.min(n - 1, (h ?? lastPastIdx) + (e.key === "ArrowRight" ? step : -step)),
          ),
        );
      }}
    >
      <svg width="100%" height={HEIGHT} aria-hidden className="block overflow-visible">
        {/* Recessive grid: three hairlines, round values. */}
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={PAD.left + innerW}
              y1={y(yMax * t)}
              y2={y(yMax * t)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={y(yMax * t)}
              dy="0.32em"
              textAnchor="end"
              className="fill-muted-foreground text-[11px] tabular-nums"
            >
              {compact(yMax * t)}
            </text>
          </g>
        ))}
        {months.map((m) => (
          <text
            key={m.i}
            x={x(m.i)}
            y={HEIGHT - 6}
            textAnchor="middle"
            className="fill-muted-foreground text-[11px]"
          >
            {m.label}
          </text>
        ))}

        {paths && (
          <>
            <path d={paths.pastArea} fill="var(--volt)" fillOpacity={0.1} />
            {hasFuture && <path d={paths.futureArea} fill="var(--volt)" fillOpacity={0.05} />}
            <path
              d={paths.pastLine}
              fill="none"
              stroke="var(--volt)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {hasFuture && (
              <path
                d={paths.futureLine}
                fill="none"
                stroke="var(--volt)"
                strokeWidth={2}
                strokeDasharray="5 5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
          </>
        )}

        {/* Today: where the solid line ends. */}
        {hasFuture && (
          <>
            <line
              x1={x(lastPastIdx)}
              x2={x(lastPastIdx)}
              y1={PAD.top - 12}
              y2={base}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={x(lastPastIdx)}
              y={PAD.top - 18}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-medium"
            >
              Today
            </text>
          </>
        )}

        {/* Direct labels: today's value and the plan's end — nothing in between. */}
        <circle
          cx={x(lastPastIdx)}
          cy={y(today.value)}
          r={4}
          fill="var(--volt)"
          stroke="var(--card)"
          strokeWidth={2}
        />
        {hasFuture && (
          <>
            <circle
              cx={x(n - 1)}
              cy={y(end.value)}
              r={4}
              fill="var(--volt)"
              stroke="var(--card)"
              strokeWidth={2}
            />
            <text
              x={x(n - 1)}
              y={y(end.value) - 12}
              textAnchor="end"
              className="fill-ink text-[12px] font-semibold tabular-nums"
            >
              {end.value.toLocaleString()}/mo
            </text>
          </>
        )}

        {active && hover !== null && (
          <>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={base}
              stroke="var(--ink)"
              strokeOpacity={0.25}
              strokeWidth={1}
            />
            <circle
              cx={x(hover)}
              cy={y(active.value)}
              r={4.5}
              fill="var(--volt)"
              stroke="var(--card)"
              strokeWidth={2}
            />
          </>
        )}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 w-max rounded-lg border border-border bg-card px-3 py-2 shadow-elevation-lg"
          style={{
            left: Math.min(Math.max(x(hover) - 70, 0), Math.max(0, width - 150)),
          }}
        >
          <p className="text-sm font-semibold tabular-nums text-ink">
            {active.value.toLocaleString()}
            <span className="font-normal text-muted-foreground"> visits/mo</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg width="14" height="2" aria-hidden className="shrink-0">
              <line
                x1="0"
                x2="14"
                y1="1"
                y2="1"
                stroke="var(--volt)"
                strokeWidth={2}
                strokeDasharray={active.future ? "4 3" : undefined}
              />
            </svg>
            {format(parseDateKey(active.day), "EEE, MMM d")} ·{" "}
            {active.future ? "if the schedule holds" : `${active.articles} live`}
          </p>
        </div>
      )}

      {/* The same numbers without the chart. */}
      <table className="sr-only">
        <caption>Projected monthly visits by day an article goes live</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Projected visits per month</th>
            <th>Articles live</th>
          </tr>
        </thead>
        <tbody>
          {points
            .filter((p, i) => i === 0 || p.value !== points[i - 1].value)
            .map((p) => (
              <tr key={p.day}>
                <td>{p.day}</td>
                <td>{p.value}</td>
                <td>{p.articles}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
