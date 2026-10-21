/**
 * The hero's backdrop: dotted rings around the headline, like a scope, with a
 * faint beam turning slowly through them. On wide screens the four engines the
 * page tracks sit out on the rings, and each gives a soft ping as the beam
 * passes. The closing band reuses the rings in white, without the engines.
 *
 * Purely decorative and aria-hidden. Rings are static SVG, so the server
 * renders them; with reduced motion the beam and the pings are left out.
 */
import { motion } from "motion/react";
import { useStill } from "./use-still";
import { cn } from "@/lib/utils";
import { ENGINES } from "./sample";

/* One turn of the beam, in seconds. Slow enough to read as ambient. */
const TURN_S = 16;
const RINGS = [130, 235, 345, 470, 600];

/* Where each engine sits: its angle (clockwise from twelve o'clock) and its
   distance from the centre, in px. Kept to the sides, clear of the copy. */
const SPOTS = [
  { deg: 296, r: 470 },
  { deg: 66, r: 470 },
  { deg: 240, r: 470 },
  { deg: 116, r: 470 },
];

function spot(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.round(Math.sin(rad) * r), y: Math.round(-Math.cos(rad) * r) };
}

export function RadarRings({
  tone = "blue",
  className,
}: {
  tone?: "blue" | "white";
  /** Places the centre: an absolutely positioned point. */
  className?: string;
}) {
  const reduce = useStill();
  const beam =
    tone === "white"
      ? "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg 290deg, rgba(255,255,255,0.1) 354deg, rgba(255,255,255,0) 360deg)"
      : "conic-gradient(from 0deg, rgba(24,119,242,0) 0deg 290deg, rgba(24,119,242,0.065) 354deg, rgba(24,119,242,0) 360deg)";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute h-0 w-0", className)}>
      <svg
        viewBox="-640 -640 1280 1280"
        className={cn(
          "absolute -left-[640px] -top-[640px] h-[1280px] w-[1280px]",
          tone === "white" ? "text-white/30" : "text-brand-blue/30",
        )}
      >
        {RINGS.map((r) => (
          <circle
            key={r}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeDasharray="0 7.5"
          />
        ))}
        <g stroke="currentColor" strokeWidth={1} strokeDasharray="1.5 7" opacity={0.6}>
          <line x1={-640} x2={640} y1={0} y2={0} />
          <line x1={0} x2={0} y1={-640} y2={640} />
        </g>
      </svg>
      {!reduce && (
        <motion.div
          className="absolute -left-[600px] -top-[600px] h-[1200px] w-[1200px] rounded-full"
          style={{ background: beam }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: TURN_S, ease: "linear", repeat: Infinity }}
        />
      )}
    </div>
  );
}

/** The four engines out on the rings. Shares the rings' centre and clock. */
export function RadarEngines({ className }: { className?: string }) {
  const reduce = useStill();
  return (
    <div aria-hidden className={cn("pointer-events-none absolute h-0 w-0", className)}>
      {ENGINES.map((engine, i) => {
        const { deg, r } = SPOTS[i];
        const { x, y } = spot(deg, r);
        const Mark = engine.Mark;
        return (
          <span
            key={engine.name}
            className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_10px_24px_-14px_rgba(16,24,40,0.3)]"
            style={{ left: x, top: y }}
          >
            {!reduce && (
              <motion.span
                className="absolute inset-0 rounded-xl border-2 border-cta/50"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.08, 1.75], opacity: [0, 0.7, 0] }}
                transition={{
                  duration: 1.4,
                  times: [0, 0.12, 1],
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: TURN_S - 1.4,
                  // The beam is brightest at 354deg before it turns.
                  delay: (((deg + 6) % 360) / 360) * TURN_S,
                }}
              />
            )}
            <Mark className="h-5 w-5" />
          </span>
        );
      })}
    </div>
  );
}
