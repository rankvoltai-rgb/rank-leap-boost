import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A celebratory confetti burst. Mount it with a unique `fireKey` to replay —
 * change the key (e.g. a counter) whenever a reward moment happens.
 */
export function Confetti({ fireKey }: { fireKey: number | string }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (reducedMotion()) return;
    if (fireKey === 0 || fireKey === "") return;
    setActive(true);
    const id = setTimeout(() => setActive(false), 1400);
    return () => clearTimeout(id);
  }, [fireKey]);

  if (!active) return null;
  const pieces = Array.from({ length: 28 });
  const tones = ["bg-volt", "bg-success", "bg-warning", "bg-flame", "bg-info"];
  return (
    <span className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center overflow-hidden">
      {pieces.map((_, i) => {
        const x = (Math.random() - 0.5) * 520;
        const rot = Math.random() * 540;
        const delay = Math.random() * 0.12;
        return (
          <motion.span
            key={`${fireKey}-${i}`}
            initial={{ opacity: 1, y: -20, x: 0, rotate: 0 }}
            animate={{ opacity: 0, y: 360 + Math.random() * 160, x, rotate: rot }}
            transition={{ duration: 1.1 + Math.random() * 0.4, delay, ease: "easeOut" }}
            className={cn("absolute h-2 w-1.5 rounded-[1px]", tones[i % tones.length])}
          />
        );
      })}
    </span>
  );
}

/** A circular progress ring with a value rendered in the middle. */
export function ProgressRing({
  value,
  max,
  size = 64,
  stroke = 6,
  children,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-secondary" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="fill-none stroke-volt"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - c * pct }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/** Publishing streak indicator (consecutive days with a published article). */
export function StreakBadge({ days }: { days: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-flame/25 bg-flame/10 px-2.5 py-1 text-xs font-semibold text-ink"
      title={`${days}-day publishing streak`}
    >
      <Flame className="h-3.5 w-3.5 fill-flame text-flame" />
      {days} day{days === 1 ? "" : "s"}
    </span>
  );
}