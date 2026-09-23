/**
 * The clock every hero scene runs on. A scene tells one short story:
 *
 *   ask     the request is typed (or the workflow is started)
 *   call    the tool calls Rankbox
 *   result  Rankbox's research comes back
 *   apply   the tool puts it to work: builds, edits, sends, answers
 *   done    the finished frame, held
 *   out     a short fade before it plays again
 *
 * It starts on `done`, the whole story, so the server render, crawlers and
 * reduced motion all get the finished frame. Playback starts from `ask` once
 * the scene is on screen, and pauses while it's scrolled away or the tab is
 * hidden.
 */
import { useEffect, useRef, useState } from "react";
import type { Connector } from "@/data/connectors";
import type { RankboxTool, ToolSample } from "@/data/ai-integration-samples";
import type { ToolHero } from "@/data/tool-heroes";

export const ASK = 0;
export const CALL = 1;
export const RESULT = 2;
export const APPLY = 3;
export const DONE = 4;
export const OUT = 5;

export type Phase = 0 | 1 | 2 | 3 | 4 | 5;

/** Everything a stage needs to draw its frame. */
export interface Scene {
  tool: Connector;
  hero: ToolHero;
  task: RankboxTool;
  sample: ToolSample;
  /** What the user asks, in the tool. */
  prompt: string;
  phase: Phase;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True while the element is on screen and the tab is in front. */
export function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    const update = () => setOn(visible && document.visibilityState === "visible");
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return [ref, on] as const;
}

/**
 * Steps through the phases, holding each for its duration. `durations` is
 * indexed by phase and must be stable (memoise it).
 */
export function useStory(durations: readonly number[], playing: boolean) {
  const [state, setState] = useState<{ phase: Phase; loop: number }>({ phase: DONE, loop: 0 });
  const started = useRef(false);
  useEffect(() => {
    if (!playing || prefersReducedMotion()) return;
    if (!started.current) {
      started.current = true;
      setState({ phase: ASK, loop: 1 });
      return;
    }
    const id = window.setTimeout(() => {
      setState((s) =>
        s.phase === OUT
          ? { phase: ASK, loop: s.loop + 1 }
          : { phase: (s.phase + 1) as Phase, loop: s.loop },
      );
    }, durations[state.phase]);
    return () => window.clearTimeout(id);
  }, [playing, state.phase, state.loop, durations]);
  return state;
}

/** Characters per second the prompts are typed at. */
export const TYPE_MS = 24;

/** How long the ask phase holds: long enough to type the prompt and read it. */
export function askDuration(prompt: string) {
  return Math.max(1300, prompt.length * TYPE_MS + 650);
}

/**
 * Types `text` out while `active`, one character at a time. Anything else
 * (the server render, reduced motion, a finished phase) shows it whole.
 */
export function useTyped(text: string, active: boolean, ms = TYPE_MS) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, ms);
    return () => window.clearInterval(id);
  }, [text, active, ms]);
  return { typed: text.slice(0, n), typing: active && n < text.length };
}
