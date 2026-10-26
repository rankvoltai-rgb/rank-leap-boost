/**
 * The clock behind the climb on /alternatives/seobot.
 *
 * The picture tells its story in phases and runs only while it is about half
 * on screen. Leaving the screen sends it back to the first phase, so it
 * starts over when it returns; visitors who asked for less motion get the
 * last, most telling phase and nothing moves.
 *
 * SSR-safe: the server and the first client paint both render phase 0, and
 * only effects move it.
 */
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;

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
 * Steps through `durations` (ms per phase) while the element is in view.
 * With `loop` it wraps at the end; without, it holds on the last phase.
 */
export function useStory<T extends Element>(
  durations: readonly number[],
  { loop = true, amount = 0.5 }: { loop?: boolean; amount?: number } = {},
) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const still = useStill();
  const last = durations.length - 1;
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (still) {
      setPhase(last);
      return;
    }
    setPhase(0);
    if (!inView) return;
    let i = 0;
    let id = 0;
    const tick = () => {
      if (!loop && i === last) return;
      id = window.setTimeout(() => {
        i = (i + 1) % durations.length;
        setPhase(i);
        tick();
      }, durations[i]);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [durations, inView, still, last, loop]);

  return { ref, phase, still, inView };
}
