import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { engineForMark } from "@/data/ai-seo/engines";
import { AI_MARKS } from "./ai-logos";

/**
 * A square glass card that cycles through AI engine logos.
 * Visually decorative (aria-hidden) — the real engine names live as
 * crawler/screen-reader text inside the hero <h1>.
 *
 * It is also a shortcut: a click opens the SEO guide for whichever engine is
 * showing. Hovering pauses the cycle so the logo under the pointer is the one
 * the click follows. It stays out of the tab order — the "Cited across" badge
 * above the headline carries the same five links for keyboard and screen
 * reader users.
 */
export function RotatingEngine({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % AI_MARKS.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, [paused]);

  const { name, Mark } = AI_MARKS[index];
  const engine = engineForMark(name);

  return (
    <span
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={
        // Solid white, not `glass`: the translucent variant picked up whatever
        // sat behind it, so the tile read differently on every field.
        "relative inline-flex h-[1em] w-[1em] shrink-0 -translate-y-[0.08em] items-center justify-center rounded-xl bg-white align-middle shadow-elevation ring-1 ring-border transition-transform duration-200 hover:-translate-y-[0.12em] hover:scale-105 " +
        (className ?? "")
      }
    >
      <Mark key={name} className="relative h-[58%] w-[58%] animate-engine-swap" />
      {engine && (
        <Link
          to="/ai-seo/$engine"
          params={{ engine: engine.slug }}
          tabIndex={-1}
          className="absolute inset-0 rounded-xl"
        />
      )}
    </span>
  );
}
