/**
 * The clock behind /alternatives/byword's month strip.
 *
 * The strip tells one story in steps (an empty month, Byword's batch, thirty
 * days passing, what comes next). It runs only while the strip is about half
 * on screen, starts again from the top when it comes back, and for visitors
 * who asked for less motion it holds the last, most telling step.
 *
 * SSR-safe: the server and the first client paint both render `initial`, and
 * the step only moves inside effects.
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
 * Walks through `durations` (ms per step) while the element is in view, then
 * wraps. Out of view it parks on step 0; with reduced motion it parks on the
 * last step. `initial` is what the server renders, so a reader without
 * JavaScript gets the finished picture rather than an empty one.
 */
export function useSteps<T extends Element>(
  durations: readonly number[],
  { amount = 0.5, initial = durations.length - 1 }: { amount?: number; initial?: number } = {},
) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const still = useStill();
  const last = durations.length - 1;
  const [step, setStep] = useState(initial);

  useEffect(() => {
    if (still) {
      setStep(last);
      return;
    }
    setStep(0);
    if (!inView) return;
    let i = 0;
    let id = 0;
    const tick = () => {
      id = window.setTimeout(() => {
        i = (i + 1) % durations.length;
        setStep(i);
        tick();
      }, durations[i]);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [durations, inView, still, last]);

  return { ref, step, still };
}
