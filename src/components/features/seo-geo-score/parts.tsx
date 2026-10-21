/**
 * Small parts the /features/seo-geo-score pictures share: the score ring and
 * the checklist icons as the Rankbox editor draws them, the numbered flags
 * that tie a check to its spot in the draft, and the page's two backdrops
 * (the proofing table's dot grid and the dial).
 */
import { useEffect } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { AlertTriangle, Check, CheckCircle2, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { scoreTone } from "./bands";

export type Status = "pass" | "warn" | "fail";

/** A darker amber for text, so a warning still reads on white. */
export const AMBER_TEXT = "text-[oklch(0.52_0.13_68)]";

/**
 * The score gauge: the ring fills and the number counts as the score moves,
 * and the colour follows the editor's bands.
 */
export function ScoreRing({
  score,
  size = 64,
  still = false,
  className,
}: {
  score: number;
  size?: number;
  /** Jump to the value instead of gliding (reduced motion). */
  still?: boolean;
  className?: string;
}) {
  const spring = useSpring(score, { stiffness: 64, damping: 18, mass: 0.8 });
  useEffect(() => {
    if (still) spring.jump(score);
    else spring.set(score);
  }, [score, still, spring]);

  const r = 33;
  const circ = 2 * Math.PI * r;
  const offset = useTransform(spring, (v) => circ * (1 - Math.max(0, Math.min(100, v)) / 100));
  const text = useTransform(spring, (v) => String(Math.round(v)));

  return (
    <div
      className={cn("relative grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border)" strokeWidth="7" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={scoreTone(score)}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          style={{ strokeDashoffset: offset }}
          className="transition-[stroke] duration-500"
        />
      </svg>
      <motion.span
        className="absolute font-semibold leading-none tracking-tight text-ink tabular-nums"
        style={{ fontSize: Math.round(size * 0.29) }}
      >
        {text}
      </motion.span>
    </div>
  );
}

/** The checklist icons, as the editor's Checklist shows them. */
export function StatusIcon({
  status,
  className,
  animate = true,
}: {
  status: Status;
  className?: string;
  animate?: boolean;
}) {
  const Icon = status === "pass" ? CheckCircle2 : status === "warn" ? AlertTriangle : CircleDashed;
  const tone =
    status === "pass" ? "text-success" : status === "warn" ? "text-warning" : "text-destructive";
  return (
    <span className={cn("relative grid h-4 w-4 shrink-0 place-items-center", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={status}
          className="grid place-items-center"
          initial={animate ? { scale: 0.4, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 26 }}
        >
          <Icon className={cn("h-4 w-4", tone)} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export type FlagState = "open" | "active" | "done";

/**
 * A numbered flag: the same number marks the check in the scorecard and the
 * spot in the draft its fix changes. Amber while open, blue while the fix
 * lands, green once it's done.
 */
export function Flag({ n, state, className }: { n: number; state: FlagState; className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-full text-[0.6rem] font-semibold tabular-nums transition-[background-color,color,box-shadow] duration-300",
        state === "open" && cn("bg-white shadow-[inset_0_0_0_1.5px_var(--warning)]", AMBER_TEXT),
        state === "active" && "bg-cta text-white shadow-[0_0_0_3px_rgba(22,111,229,0.16)]",
        state === "done" && "bg-success/[0.12] text-success",
        className,
      )}
    >
      {state === "active" && (
        <span className="absolute inset-0 animate-ping rounded-full bg-cta/40 motion-reduce:animate-none" />
      )}
      {state === "done" ? <Check className="h-2.5 w-2.5" strokeWidth={3.2} /> : n}
    </span>
  );
}

/** A line of body text, drawn as a bar. */
export function TextBar({ w, className }: { w: string; className?: string }) {
  return (
    <span
      className={cn("block h-[7px] rounded-full bg-ink/[0.07]", className)}
      style={{ width: w }}
    />
  );
}

/** The proofing table: a fine dot grid. */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(16,24,40,0.11)_1px,transparent_1.3px)] [background-size:18px_18px]",
        className,
      )}
    />
  );
}

/* Trig differs in the last digits between server and browser, so the
   coordinates are rounded to keep the markup identical. */
const round = (v: number) => Math.round(v * 100) / 100;

/**
 * The page's motif: a dial's concentric arcs and ticks, centred on the
 * bottom edge. Drawn in the current colour.
 */
export function DialArcs({ className }: { className?: string }) {
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 800 420"
      fill="none"
      aria-hidden
      className={cn("pointer-events-none", className)}
      preserveAspectRatio="xMidYMax meet"
    >
      {[390, 330, 270, 210].map((r, i) => (
        <path
          key={r}
          d={`M ${400 - r} 410 A ${r} ${r} 0 0 1 ${400 + r} 410`}
          stroke="currentColor"
          strokeWidth={i === 1 ? 10 : 1.2}
          strokeOpacity={i === 1 ? 0.5 : 1}
          strokeLinecap="round"
          strokeDasharray={i === 1 ? `${Math.PI * r * 0.96} ${Math.PI * r}` : undefined}
        />
      ))}
      {ticks.map((i) => {
        const a = Math.PI - (i / 40) * Math.PI;
        const long = i % 5 === 0;
        const r1 = 390 + 8;
        const r2 = r1 + (long ? 16 : 8);
        return (
          <line
            key={i}
            x1={round(400 + r1 * Math.cos(a))}
            y1={round(410 - r1 * Math.sin(a))}
            x2={round(400 + r2 * Math.cos(a))}
            y2={round(410 - r2 * Math.sin(a))}
            stroke="currentColor"
            strokeWidth={long ? 1.6 : 1}
          />
        );
      })}
    </svg>
  );
}

/**
 * The hero's icon tile: a small two-ring dial, the outer ring for Google and
 * the inner one for AI answers. Decorative.
 */
export function DualDial({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.16" strokeWidth="2.4" />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 9 * 0.82} ${2 * Math.PI * 9}`}
        transform="rotate(-90 12 12)"
      />
      <circle
        cx="12"
        cy="12"
        r="4.6"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="2.2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 4.6 * 0.66} ${2 * Math.PI * 4.6}`}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
