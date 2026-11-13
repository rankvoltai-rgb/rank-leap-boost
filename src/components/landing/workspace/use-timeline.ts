/**
 * The window's clock: which run is playing and how far into it we are.
 *
 * It runs only while `active` (the window is on screen), starts over from
 * the first run when it becomes active again, and under reduced motion it
 * never ticks: it holds one finished frame. `pick` jumps to a run, which is
 * how the sidebar's recent articles work.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { MARKS, RUNS, STILL } from "./script";

export interface Timeline {
  run: number;
  t: number;
  pick: (run: number) => void;
}

const TICK_MS = 50;

export function useTimeline(active: boolean, reduce: boolean | null): Timeline {
  const [state, setState] = useState({ run: 0, t: 0 });
  const last = useRef(0);

  useEffect(() => {
    if (reduce) {
      setState(STILL);
      return;
    }
    if (!active) {
      setState({ run: 0, t: 0 });
      return;
    }
    last.current = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      // A background tab throttles timers; never jump more than a few frames.
      const dt = Math.min(now - last.current, TICK_MS * 4);
      last.current = now;
      setState((s) => {
        const t = s.t + dt;
        return t >= MARKS[s.run].end ? { run: (s.run + 1) % RUNS.length, t: 0 } : { run: s.run, t };
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [active, reduce]);

  const pick = useCallback(
    (run: number) => setState(reduce ? { run, t: MARKS[run].open + 3000 } : { run, t: 0 }),
    [reduce],
  );

  return { ...state, pick };
}
