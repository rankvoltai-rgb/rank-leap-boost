/**
 * The clock behind /alternatives/outrank's month card.
 *
 * The card's story is one month of daily articles on both plans: the days
 * fill in lockstep, then the month holds, then it starts over. It plays only
 * while the card is about half on screen. Off screen, and for visitors who
 * asked for less motion, it rests on the finished month, which is also what
 * the server renders, so the first paint and the still frame are the same
 * meaningful picture rather than an empty calendar.
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

/** How long each part of the month takes, in ms. */
const FIRST_HOLD = 1300;
const HOLD = 3800;
const CLEAR = 520;
const STEP = 95;

/**
 * Counts `days` up from 0, one per STEP, holds the full month, and starts
 * again. Returns `days` itself whenever the story isn't playing.
 */
export function useMonth<T extends Element>(days: number, amount = 0.5) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const still = useStill();
  const [day, setDay] = useState(days);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (still || !inView) {
      setDay(days);
      setPlaying(false);
      return;
    }
    setPlaying(true);
    let d = days;
    let first = true;
    let id = 0;
    const tick = () => {
      let wait: number;
      if (d === days) {
        wait = first ? FIRST_HOLD : HOLD;
        first = false;
      } else {
        wait = d === 0 ? CLEAR : STEP;
      }
      id = window.setTimeout(() => {
        d = d === days ? 0 : d + 1;
        setDay(d);
        tick();
      }, wait);
    };
    setDay(days);
    tick();
    return () => window.clearTimeout(id);
  }, [days, inView, still]);

  return { ref, day, playing, still };
}
