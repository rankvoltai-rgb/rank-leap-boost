/**
 * The clock behind the loops picture. It steps through its phases only while
 * the picture is about half on screen, and rests on the last phase (both
 * loops drawn) everywhere else: on the server, on the first paint, off
 * screen, and for visitors who asked for less motion. So the still frame is
 * always the complete one.
 *
 * A visitor can pick a phase; the pick holds until the picture leaves the
 * screen, then the story starts over next time it comes back.
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

export function useLoopStory<T extends Element>(durations: readonly number[], amount = 0.4) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const still = useStill();
  const rest = durations.length - 1;
  const [running, setRunning] = useState(rest);
  const [pinned, setPinned] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) setPinned(null);
  }, [inView]);

  useEffect(() => {
    if (still || !inView) {
      setRunning(rest);
      return;
    }
    setRunning(0);
    let i = 0;
    let id = 0;
    const tick = () => {
      id = window.setTimeout(() => {
        i = (i + 1) % durations.length;
        setRunning(i);
        tick();
      }, durations[i]);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [durations, inView, still, rest]);

  const phase = pinned ?? (still ? rest : running);
  /** Moving parts (the travelling dash) run only while the story does. */
  const moving = !still && inView && pinned === null;
  return { ref, phase, still, moving, pin: setPinned, pinned };
}
