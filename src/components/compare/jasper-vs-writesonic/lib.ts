/**
 * Constants and hooks shared by the sections of /compare/jasper-vs-writesonic:
 * the button and card styles, the hero's entrance stagger, and the clock
 * behind the moving pictures. Components live in ./atoms.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "motion/react";
import type { CellState, Side } from "@/data/compare/types";

export const SIDES: Side[] = ["a", "b"];

export const EASE = [0.16, 1, 0.3, 1] as const;

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
export const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

export const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** A white card with a hairline edge and a soft shadow: how product screens sit. */
export const CARD =
  "rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.22)]";

/** The faint dot grid some panels sit on. */
export const DOTS: CSSProperties = {
  backgroundImage:
    "radial-gradient(color-mix(in oklab, var(--ink) 9%, transparent) 1px, transparent 1px)",
  backgroundSize: "16px 16px",
};

/** The soft blue tint a round's winner and the spec sheet's group rows carry. */
export const WIN_TINT = "bg-[color-mix(in_oklab,var(--cta)_5%,white)]";

/** A count with its noun: "1 round", "7 rounds". */
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

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
 * Plays a short story once, phase by phase, while the element is about half
 * on screen. `steps[i]` is how long phase i holds before phase i + 1, so the
 * story ends on phase `steps.length` and stays there. Leaving the screen
 * sends it back to phase 0; reduced motion parks it on the last phase.
 *
 * SSR-safe: the server and the first client paint both render phase 0, and
 * only effects move it on.
 */
export function useStory<T extends Element>(steps: readonly number[], amount = 0.5) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const still = useStill();
  const last = steps.length;
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
      if (i >= steps.length) return;
      id = window.setTimeout(() => {
        i += 1;
        setPhase(i);
        tick();
      }, steps[i]);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [steps, inView, still, last]);

  return { ref, phase, last, still };
}

export const STATE_LABEL: Record<CellState, string> = {
  yes: "Included",
  partial: "Partly, or as an add-on",
  no: "Not what it's built for",
};
