/**
 * The clocks behind the moving pictures on /features/seo-geo-score.
 *
 * Every picture tells a short story in phases (a draft is flagged, the fixes
 * land one by one, the article is ready). The story runs only while the
 * picture is about half on screen, starts over from the top when it comes
 * back, and for visitors who asked for less motion it parks on its last,
 * most telling frame.
 *
 * SSR-safe: both hooks start from the same first frame on the server and the
 * client, and only move in effects.
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
 * Steps through `durations` (ms per phase) while the element is in view and
 * wraps at the end. Leaving the screen sends it back to phase 0; reduced
 * motion holds it on the last phase.
 */
export function useStory<T extends Element>(durations: readonly number[], amount = 0.45) {
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
      id = window.setTimeout(() => {
        i = (i + 1) % durations.length;
        setPhase(i);
        tick();
      }, durations[i]);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [durations, inView, still, last]);

  return { ref, phase, still, inView };
}
