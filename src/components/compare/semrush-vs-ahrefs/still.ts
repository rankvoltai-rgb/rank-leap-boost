import { useEffect, useState } from "react";

/**
 * True for visitors who prefer reduced motion. False on the server and on the
 * first client paint, so both render the same frame; it settles in an effect.
 */
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
