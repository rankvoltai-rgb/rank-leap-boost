import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * True when the visitor asks for reduced motion, but only after mount. The
 * server can't know the preference, so the first client render must match
 * the server's moving version; the still version follows straight after.
 */
export function useStill() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduce);
}
