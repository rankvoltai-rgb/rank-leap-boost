import { useEffect, useState } from "react";
import { AI_MARKS } from "./ai-logos";

/**
 * A square glass card that cycles through AI engine logos.
 * Purely decorative (aria-hidden) — the real engine names live as
 * crawler/screen-reader text inside the hero <h1>.
 */
export function RotatingEngine({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % AI_MARKS.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  const { name, Mark } = AI_MARKS[index];

  return (
    <span
      aria-hidden
      className={
        "relative inline-flex h-[1em] w-[1em] shrink-0 -translate-y-[0.08em] items-center justify-center rounded-xl align-middle glass shadow-elevation ring-1 ring-ink/5 " +
        (className ?? "")
      }
    >
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-volt/10 opacity-60 blur-[6px]" />
      <Mark key={name} className="relative h-[58%] w-[58%] animate-engine-swap" />
    </span>
  );
}
