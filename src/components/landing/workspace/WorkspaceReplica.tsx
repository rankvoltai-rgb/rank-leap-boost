/**
 * The landing's product shot: a Rankbox workspace in white, after the app
 * window in Profound's hero. Same size (1320 × 720, with a 240 sidebar),
 * same anatomy (sidebar, a working thread, a panel that opens on the right,
 * a bar along the bottom), same type scale. What it shows is ours: an
 * article from the content plan being written, a keyword gap being planned,
 * and an article going live on the site (script.ts).
 *
 * One layout at every width, as theirs: the full window, drawn at 1320 × 720
 * and scaled to a set width. From lg up that's the column, so the whole
 * window shows. Below it the window keeps a size that stays readable (1320px
 * on tablets, 700px on phones), starts at the column's left edge and runs
 * off the right side of the screen: a piece of the real thing rather than a
 * shrunken copy. The section clips it.
 *
 * It plays only while enough of it is on screen, starts over when it comes
 * back, and under reduced motion holds one finished frame. The whole figure
 * is a sample (the site is fictional) and is hidden from assistive tech,
 * with one sentence describing it instead.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_W, PANEL_W, RUNS, SIZE, viewAt } from "./script";
import { useTimeline, type Timeline } from "./use-timeline";
import { Sidebar } from "./sidebar";
import { Composer, Thread } from "./thread";
import { Panel } from "./panels";

const EASE = [0.16, 1, 0.3, 1] as const;

/* The shadow's tint comes from the stage (--ws-shade, an "r g b" triple), so
   it reads as navy on blue and grey on white. */
const WINDOW =
  "bg-white shadow-[0_0_0_1px_rgb(var(--ws-shade,16_24_40)/0.1),0_1px_1px_rgb(var(--ws-shade,16_24_40)/0.05),0_10px_20px_-8px_rgb(var(--ws-shade,16_24_40)/0.1),0_40px_80px_-32px_rgb(var(--ws-shade,16_24_40)/0.3)]";

/* ---------- Scaling ---------- */

/**
 * Draws its child at a fixed size and scales it to the width it's given. The
 * first paint is scaled in CSS (a length ratio through atan2/tan), so there's
 * no jump before the observer reports; the measured value takes over after.
 */
function Canvas({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / w)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div
      ref={ref}
      className="relative w-full [container-type:inline-size]"
      style={{ maxWidth: w, aspectRatio: `${w} / ${h}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: w,
          height: h,
          transform:
            scale === null ? `scale(min(1, tan(atan2(100cqw, ${w}px))))` : `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- The window ---------- */

function TopBar({ title }: { title: string }) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between px-4">
      <span className="flex items-center gap-1 text-[13px] font-medium leading-[18px] text-ink">
        {title}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
      </span>
      <MoreHorizontal className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
    </div>
  );
}

function Window({ tl, animate }: { tl: Timeline; animate: boolean }) {
  const run = RUNS[tl.run];
  const view = viewAt(tl.run, tl.t);
  return (
    <div className={cn("flex h-full w-full overflow-hidden rounded-[10px] text-left", WINDOW)}>
      <Sidebar run={tl.run} queue={view.queue} onPick={tl.pick} />
      <div className="flex min-w-0 flex-1">
        {/* The thread has the whole main area until a panel opens, then half. */}
        <motion.div
          className="flex shrink-0 flex-col"
          initial={false}
          animate={{ width: view.open ? MAIN_W - PANEL_W : MAIN_W }}
          transition={{ duration: animate ? 0.6 : 0, ease: EASE }}
        >
          <TopBar title={run.title} />
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mx-auto w-full max-w-[672px] px-7 pt-5">
              <Thread key={run.id} run={run} view={view} />
            </div>
            <div className="mx-auto mt-auto w-full max-w-[676px] px-[18px] pb-5">
              <Composer run={run} view={view} />
            </div>
          </div>
        </motion.div>
        <AnimatePresence initial={false}>
          {view.open && (
            <motion.div
              key={run.id}
              className="h-full shrink-0 border-l border-ink/[0.07]"
              style={{ width: PANEL_W }}
              initial={animate ? { opacity: 0, x: 28 } : false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28, transition: { duration: 0.3, ease: "easeIn" } }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Panel kind={run.panel} animate={animate} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- The figure ---------- */

export function WorkspaceReplica() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Below lg only part of the window is on screen, so the bar is lower.
  const inView = useInView(ref, { amount: 0.2 });
  const tl = useTimeline(inView, reduce);
  const { w, h } = SIZE;
  return (
    <figure aria-label="A sample Rankbox workspace for a fictional coffee roaster. Rankbox takes a question from the content plan, writes and scores the article, plans the questions around a keyword gap, and hands a finished article to the site.">
      {/* The window's width: a set size below lg, running off the screen's
          right edge; the column from lg up. */}
      <div ref={ref} aria-hidden className="w-[700px] md:w-[1320px] lg:w-full">
        <Canvas w={w} h={h}>
          <Window tl={tl} animate={!reduce} />
        </Canvas>
      </div>
    </figure>
  );
}
