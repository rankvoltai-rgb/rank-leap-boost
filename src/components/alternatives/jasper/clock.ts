/**
 * The clock behind the relay board on /alternatives/jasper.
 *
 * The board tells its story in phases: one per step of the article loop,
 * then the finished article, then the one row that sits outside the loop.
 * It runs only while the board is about half on screen, starts over from the
 * first step when the board comes back, and for visitors who asked for less
 * motion it does not run at all (the board then shows its finished frame).
 *
 * SSR-safe: the server and the first client paint both render phase 0, and
 * the phase only moves inside effects.
 */
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/** True for visitors who prefer reduced motion. False on the server and the first paint. */
export function useStill() {
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return still;
}

/**
 * Steps through `durations` (ms per phase) while the element is at least
 * `amount` on screen, wrapping at the end. Leaving the screen sends it back to
 * phase 0.
 */
export function usePhases<T extends Element>(durations: readonly number[], amount = 0.5) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const still = useStill();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setPhase(0);
    if (still || !inView) return;
    let i = 0;
    let id = 0;
    const tick = () => {
      id = window.setTimeout(() => {
        i = (i + 1) % durations.length;
        setPhase(i);
        tick();
      }, durations[i]);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [durations, inView, still]);

  return { ref, phase, still };
}
