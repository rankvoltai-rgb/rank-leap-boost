/**
 * The hero headline's moving part: each AI engine's logo and name in turn,
 * rolling up like a slot reel.
 *
 * The reel's width eases to fit whichever name is showing, so the words
 * after it glide into place instead of jumping. A copy of the first engine
 * sits at the end of the reel; on reaching it the reel snaps back to the
 * real first engine with the transition off, so the loop never rewinds
 * through every name.
 *
 * Decorative (aria-hidden): the headline's screen-reader text names the
 * engines. A click on the name opens that engine's SEO guide, and hovering
 * holds the reel so the name under the pointer is the one the click follows.
 * It stays out of the tab order; the "Cited across" logos under the hero
 * carry the same links for keyboard users.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { engineForMark } from "@/data/ai-seo/engines";
import { AI_MARKS } from "./ai-logos";

const HOLD_MS = 2400;
/* Matches Rankaria's reel: a standard ease-in-out, a touch over half a
   second, so the roll reads as deliberate rather than snappy. */
const ROLL = "duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)]";

const ITEMS = AI_MARKS.map(({ name, Mark }) => {
  const engine = engineForMark(name);
  return { name, label: engine?.shortName ?? name, slug: engine?.slug, Mark };
});
const REEL = [...ITEMS, ITEMS[0]];

/* useLayoutEffect warns during SSR; the measuring only matters in the browser. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function Item({ item }: { item: (typeof ITEMS)[number] }) {
  const { Mark, label } = item;
  return (
    <span className="flex h-[1.18em] w-max items-center gap-[0.2em] whitespace-nowrap">
      <span className="flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
        <Mark className="h-[58%] w-[58%]" />
      </span>
      <span className="font-bold text-brand-blue">{label}</span>
    </span>
  );
}

export function EngineTicker({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [snap, setSnap] = useState(false);
  const [paused, setPaused] = useState(false);
  const [widths, setWidths] = useState<number[] | null>(null);
  const reelRef = useRef<HTMLSpanElement>(null);

  // Measure every name once laid out, and again whenever the reel resizes,
  // which covers the web font arriving after first paint.
  useIsoLayoutEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    const measure = () =>
      setWidths(Array.from(reel.children, (el) => (el as HTMLElement).offsetWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(reel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    const id = window.setInterval(() => setIndex((i) => Math.min(i + 1, ITEMS.length)), HOLD_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  // On the copy of the first engine: let the roll finish, then jump back to
  // the real one without animating.
  useEffect(() => {
    if (index !== ITEMS.length) return;
    const id = window.setTimeout(() => {
      setSnap(true);
      setIndex(0);
    }, 700);
    return () => window.clearTimeout(id);
  }, [index]);

  // Re-enable the transition on the frame after the snap has painted.
  useEffect(() => {
    if (!snap) return;
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setSnap(false)),
    );
    return () => window.cancelAnimationFrame(id);
  }, [snap]);

  const current = ITEMS[index % ITEMS.length];
  const width = widths?.[index];

  return (
    <span
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "group/ticker relative inline-flex h-[1.18em] shrink-0 overflow-hidden align-middle",
        !snap && `transition-[width] ${ROLL}`,
        className,
      )}
      style={width ? ({ width } as CSSProperties) : undefined}
    >
      {/* Sizes the reel before it has been measured (on the server and the
          first paint), so the line lays out at the first name's width. */}
      <span className="invisible">
        <Item item={ITEMS[0]} />
      </span>
      <span
        ref={reelRef}
        className={cn(
          "absolute left-0 top-0 flex flex-col items-start",
          !snap && `transition-transform ${ROLL}`,
        )}
        style={{ transform: `translateY(${-index * 1.18}em)` }}
      >
        {REEL.map((item, i) => (
          <span
            key={`${item.name}-${i}`}
            className={cn(
              "block w-max",
              !snap && "transition-[opacity,filter] duration-500",
              i === index ? "opacity-100 blur-0" : "opacity-0 blur-[2px]",
            )}
          >
            <Item item={item} />
          </span>
        ))}
      </span>
      {current.slug && (
        <Link
          to="/ai-seo/$engine"
          params={{ engine: current.slug }}
          tabIndex={-1}
          className="absolute inset-0"
        />
      )}
    </span>
  );
}
