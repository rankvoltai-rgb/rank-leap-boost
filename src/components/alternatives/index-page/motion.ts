/**
 * The hub's one moving picture runs only while it is about half on screen,
 * starts over when it comes back, and holds its finished frame for visitors
 * who asked for less motion.
 *
 * SSR-safe: the server and the first client paint both draw the finished
 * frame (so a page without scripts still reads correctly); only effects move
 * it, and only once the picture is off screen.
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
 * `placed` is true while the picture should show its finished frame: on the
 * server, for reduced motion, and while it is in view. Leaving the screen
 * clears it, so the next visit plays the arrival again.
 */
export function useArrival<T extends Element>(amount = 0.5) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const still = useStill();
  const [placed, setPlaced] = useState(true);

  useEffect(() => {
    setPlaced(still || inView);
  }, [inView, still]);

  return { ref, placed, still };
}
