/**
 * The hero headline's moving part: each AI engine's logo and name in turn.
 *
 * Every change is a small moment rather than a scroll. The outgoing name
 * dissolves letter by letter (rising, blurring, fading) while the next one
 * assembles letter by letter from below, a beat behind. The logo tile turns
 * like the face of a cube to show the next engine. The name's width springs
 * to fit the new word, so "on autopilot" after it glides instead of jumping.
 *
 * Decorative (aria-hidden): the headline's screen-reader text names the
 * engines. A click on the name opens that engine's SEO guide, and hovering
 * holds it so the name under the pointer is the one the click follows. It
 * stays out of the tab order; the "Cited across" logos under the hero carry
 * the same links for keyboard users. With reduced motion it shows the first
 * engine and never changes.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { engineForMark } from "@/data/ai-seo/engines";
import { AI_MARKS } from "./ai-logos";

/* How long each engine holds before the next one arrives. */
const HOLD_MS = 2600;

const ITEMS = AI_MARKS.map(({ name, Mark }) => {
  const engine = engineForMark(name);
  return { name, label: engine?.shortName ?? name, slug: engine?.slug, Mark };
});

/* useLayoutEffect warns during SSR; the measuring only matters in the browser. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* The word: its letters stagger in and out. The old word peels away left to
   to right and is gone in about a third of a second; the new one starts
   building just as it clears, so the two never sit on top of each other. */
const WORD: Variants = {
  enter: {},
  shown: { transition: { staggerChildren: 0.032, delayChildren: 0.2 } },
  gone: { transition: { staggerChildren: 0.012 } },
};

const LETTER: Variants = {
  enter: { opacity: 0, y: "0.42em", filter: "blur(10px)" },
  shown: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.7 },
  },
  gone: {
    opacity: 0,
    y: "-0.32em",
    filter: "blur(8px)",
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

export function EngineTicker({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [widths, setWidths] = useState<number[] | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const still = useReducedMotion();

  // Every name's width, measured once laid out and again whenever the set
  // resizes, which covers the web font arriving after first paint.
  useIsoLayoutEffect(() => {
    const box = measureRef.current;
    if (!box) return;
    const measure = () =>
      setWidths(Array.from(box.children, (el) => (el as HTMLElement).offsetWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (still || paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % ITEMS.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [still, paused]);

  const item = ITEMS[index];
  const { Mark } = item;

  return (
    <span
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "relative inline-flex h-[1.18em] shrink-0 items-center gap-[0.2em] whitespace-nowrap align-middle",
        className,
      )}
    >
      {/* The logo tile: turns about its horizontal axis, like a cube showing
          its next face. */}
      <span className="relative inline-flex h-[0.84em] w-[0.84em] shrink-0 [perspective:28em]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={item.name}
            className="absolute inset-0 flex items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] [backface-visibility:hidden]"
            style={{ transformOrigin: "50% 50% -0.42em" }}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 210, damping: 24, mass: 0.8 }}
          >
            <Mark className="h-[58%] w-[58%]" />
          </motion.span>
        </AnimatePresence>
      </span>

      {/* The name. Its box springs to the new word's width; the words inside
          sit on top of one another while one leaves and the next arrives. */}
      {/* A CSS transition rather than a motion value: the first measured
          width snaps in (auto can't be tweened), so the box never opens from
          zero on load, and every later change glides. It waits for the old
          word to clear before resizing, and clips sideways, so a fading
          letter is trimmed at the edge rather than drifting over the words
          after it. */}
      <span
        className="relative inline-flex h-[1.18em] items-center overflow-x-clip transition-[width] delay-[160ms] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={widths ? { width: widths[index] } : undefined}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={item.name}
            variants={WORD}
            initial="enter"
            animate="shown"
            exit="gone"
            className="absolute left-0 flex font-bold text-brand-blue"
          >
            {Array.from(item.label, (ch, i) => (
              <motion.span key={i} variants={LETTER} className="inline-block">
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
        {/* Gives the box its width before the names are measured (on the
            server and the first paint). */}
        {!widths && <span className="invisible font-bold">{ITEMS[0].label}</span>}
      </span>

      {/* Every name laid out once, out of sight, to read its width. */}
      <span
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0 flex flex-col font-bold"
      >
        {ITEMS.map((it) => (
          <span key={it.name} className="w-max whitespace-nowrap">
            {it.label}
          </span>
        ))}
      </span>

      {item.slug && (
        <Link
          to="/ai-seo/$engine"
          params={{ engine: item.slug }}
          tabIndex={-1}
          className="absolute inset-0"
        />
      )}
    </span>
  );
}
