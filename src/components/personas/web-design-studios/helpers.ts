/**
 * The studio page's non-visual helpers: the half-on-screen switch that gates
 * every motion, and the slug maker for the sample sitemap's paths.
 */
import { useEffect, useRef, useState } from "react";

/**
 * True while at least about half the element is on screen, false otherwise
 * and on the server, so every scene renders its still frame first.
 */
export function useHalfOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOn(e.intersectionRatio >= 0.45), {
      threshold: [0, 0.45, 0.6],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

/** "How long does…?" → "how-long-does", for the sample sitemap's paths. */
export function slugify(text: string, max = 6): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .join("-");
}
