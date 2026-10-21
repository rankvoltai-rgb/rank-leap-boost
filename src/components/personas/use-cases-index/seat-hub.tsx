/**
 * The index's focal scene: one engine with the six seats around it. The
 * Rankbox mark sits in the middle, the "By role" pages on its left and the
 * "By business" pages on its right, each tied to it by a hairline.
 *
 * While the hub is at least half on screen, a blue line runs out from the
 * engine to one seat at a time, the seat lights up soft blue, and the card
 * under the hub names it. Pointing at (or tabbing to) a seat takes over the
 * cycle. Off screen it resets to the first seat; with reduced motion it holds
 * that frame, fully drawn. The first render is fixed, so server and client
 * agree.
 *
 * The seats are real links: the hub doubles as a quick index for readers who
 * already know where they sit.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { PERSONA_GROUPS, personasIn, type Persona } from "@/data/personas";

/* The board is drawn on a 520 × 420 grid; HTML pieces sit on it by
   percentage, so the SVG lines meet them at any width. */
const W = 520;
const H = 420;
const CORE = { x: 260, y: 231 };
const ROWS = [113, 231, 349];
/* Each column of seats spans a third of the board. */
const LEFT_EDGE = 180;
const RIGHT_EDGE = 340;

const STEP_MS = 2800;

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

/** The line from the engine out to a seat, drawn core-first. */
function wire(side: "left" | "right", y: number) {
  return side === "left"
    ? `M ${CORE.x} ${CORE.y} C ${CORE.x - 46} ${CORE.y}, ${LEFT_EDGE + 46} ${y}, ${LEFT_EDGE} ${y}`
    : `M ${CORE.x} ${CORE.y} C ${CORE.x + 46} ${CORE.y}, ${RIGHT_EDGE - 46} ${y}, ${RIGHT_EDGE} ${y}`;
}

interface Seat {
  persona: Persona;
  side: "left" | "right";
  y: number;
  groupLabel: string;
}

const SEATS: Seat[] = PERSONA_GROUPS.flatMap((g, gi) =>
  personasIn(g.id)
    .slice(0, ROWS.length)
    .map((persona, i) => ({
      persona,
      side: gi === 0 ? ("left" as const) : ("right" as const),
      y: ROWS[i],
      groupLabel: g.label,
    })),
);

/** True while at least half of the element is on screen; false again once it leaves. */
function useHalfInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

export function SeatHub({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [ref, inView] = useHalfInView<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const [pointed, setPointed] = useState<number | null>(null);

  const running = inView && !reduce && pointed === null;

  useEffect(() => {
    if (!inView) {
      setStep(0);
      return;
    }
    if (!running) return;
    const id = window.setInterval(() => setStep((n) => (n + 1) % SEATS.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [inView, running]);

  const active = pointed ?? step;
  const seat = SEATS[active];
  /* Draw the line only when the cycle moves it on; a pointed seat or a still
     frame shows it whole. Keyed by seat alone, so starting the cycle doesn't
     redraw the line already there. */
  const animateLine = running;

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <nav
        aria-label="Use cases"
        className="relative mx-auto aspect-[52/42] w-full max-w-[32.5rem]"
      >
        {/* The wiring. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${W} ${H}`}
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          {SEATS.map((s) => (
            <path
              key={s.persona.slug}
              d={wire(s.side, s.y)}
              fill="none"
              stroke="rgba(16,24,40,0.14)"
              strokeWidth={1.25}
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <motion.path
            key={active}
            d={wire(seat.side, seat.y)}
            fill="none"
            stroke="var(--cta)"
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: animateLine ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
          {SEATS.map((s, i) => (
            <circle
              key={s.persona.slug}
              cx={s.side === "left" ? LEFT_EDGE : RIGHT_EDGE}
              cy={s.y}
              r={3.5}
              fill={i === active ? "var(--cta)" : "white"}
              stroke={i === active ? "var(--cta)" : "rgba(16,24,40,0.2)"}
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
              className="transition-[fill,stroke] duration-300"
            />
          ))}
        </svg>

        {/* Group captions over each column. */}
        {PERSONA_GROUPS.map((g, gi) => (
          <span
            key={g.id}
            aria-hidden
            className="absolute top-0 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80 sm:text-[0.66rem]"
            style={
              gi === 0
                ? { left: 0, width: pct(LEFT_EDGE, W) }
                : { left: pct(RIGHT_EDGE, W), width: pct(W - RIGHT_EDGE, W) }
            }
          >
            <span className="block text-center">{g.label}</span>
          </span>
        ))}

        {/* The engine. */}
        <div
          aria-hidden
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: pct(CORE.x, W), top: pct(CORE.y, H) }}
        >
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_14px_32px_-16px_rgba(22,111,229,0.45)] sm:h-[4.5rem] sm:w-[4.5rem]">
            {/* A soft ring that breathes out each time a line leaves. */}
            {running && (
              <motion.span
                key={active}
                className="absolute inset-0 rounded-2xl border border-cta/40"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{ opacity: 0, scale: 1.35 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            )}
            <Mark className="h-7 w-7 text-brand-blue sm:h-9 sm:w-9" />
          </span>
          <span className="absolute top-full mt-2 whitespace-nowrap text-[0.66rem] font-medium text-muted-foreground sm:text-[0.72rem]">
            One engine
          </span>
        </div>

        {/* The seats. */}
        {SEATS.map((s, i) => {
          const Icon = s.persona.icon;
          const on = i === active;
          return (
            <Link
              key={s.persona.slug}
              to="/use-cases/$slug"
              params={{ slug: s.persona.slug }}
              onMouseEnter={() => setPointed(i)}
              onMouseLeave={() => setPointed(null)}
              onFocus={() => setPointed(i)}
              onBlur={() => setPointed(null)}
              aria-label={`Rankbox for ${s.persona.nameLower}`}
              className={cn(
                "absolute flex -translate-y-1/2 items-center gap-1.5 rounded-lg border bg-white px-1.5 py-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color,box-shadow,color] duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 sm:gap-2 sm:px-2 sm:py-2",
                on
                  ? "border-cta/30 bg-cta-soft text-cta shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_8%,transparent),0_10px_24px_-16px_rgba(22,111,229,0.5)]"
                  : "border-ink/[0.08] text-ink hover:border-ink/[0.16]",
                on && pointed === null && "delay-300",
              )}
              style={
                s.side === "left"
                  ? { left: 0, width: pct(LEFT_EDGE, W), top: pct(s.y, H) }
                  : { left: pct(RIGHT_EDGE, W), width: pct(W - RIGHT_EDGE, W), top: pct(s.y, H) }
              }
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors duration-300 min-[400px]:h-6 min-[400px]:w-6 sm:h-7 sm:w-7",
                  on ? "bg-cta text-white" : "bg-cta-soft text-brand-blue",
                  on && pointed === null && "delay-300",
                )}
              >
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
              <span className="min-w-0 truncate text-[0.74rem] font-medium sm:text-[0.84rem]">
                {s.persona.shortName}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* The seat in focus, named. A repeat of the card text below, so it's
          hidden from assistive tech rather than announced every few seconds. */}
      <div
        aria-hidden
        className="mx-auto mt-5 w-full max-w-[32.5rem] rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)] sm:mt-6 sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {seat.groupLabel}
          </span>
          {/* Six segments; the one in focus fills while it's held. */}
          <span className="flex items-center gap-1">
            {SEATS.map((s, i) => (
              <span
                key={s.persona.slug}
                className="relative h-1 w-4 overflow-hidden rounded-full bg-ink/[0.08] sm:w-5"
              >
                {i === active && (
                  <motion.span
                    key={`${active}-${running}`}
                    className="absolute inset-0 origin-left rounded-full bg-cta"
                    initial={{ scaleX: running ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: running ? STEP_MS / 1000 : 0, ease: "linear" }}
                  />
                )}
              </span>
            ))}
          </span>
        </div>
        <div className="relative mt-2 min-h-[3.4rem] sm:min-h-[3.1rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={seat.persona.slug}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
            >
              <p className="flex items-center gap-1.5 text-[0.98rem] font-medium tracking-tight text-ink">
                Rankbox for {seat.persona.nameLower}
                <ArrowUpRight className="h-3.5 w-3.5 text-brand-blue" />
              </p>
              <p className="mt-0.5 text-[0.84rem] leading-snug text-muted-foreground">
                {seat.persona.tagline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
