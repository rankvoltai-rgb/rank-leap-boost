/**
 * The solo founders page's focal scene: the founder's own code editor, with
 * Rankbox working in the corner of the screen. Rebuilt from the old hero's
 * EditorScene (personas/hero-scenes.tsx) in the landing's language: a white
 * window on hairlines, soft-blue selection, the blue status bar, and white
 * notification cards that arrive one at a time.
 *
 * The point it makes is the page's headline: the founder never leaves the
 * code, and the blog still ships. So the editor is busy with billing code,
 * nothing in it is about content, and every Rankbox event lands as a quiet
 * notification rather than a task.
 *
 * Motion: runs only while at least half the stage is on screen, and starts
 * over from the first frame each time it comes back. The first render is a
 * fixed frame, so server and client agree. Under reduced motion it holds the
 * most telling frame: three notifications in, the line typed, today's post
 * published.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { FileCode2, Folder, GitBranch, GitCommitHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";

/* ---------- Motion helpers ---------- */

/** True while at least half of the element is on screen. */
function useHalfOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.intersectionRatio >= 0.5), {
      threshold: [0, 0.5, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

/**
 * Counts up from `start` every `ms` while `run`; drops back to `start` the
 * moment it stops, so the scene replays from its first frame. Reduced motion
 * parks on `rest`.
 */
function useTicker(ms: number, run: boolean, start: number, rest: number) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(start);
  useEffect(() => {
    if (reduce) {
      setN(rest);
      return;
    }
    if (!run) {
      setN(start);
      return;
    }
    const id = window.setInterval(() => setN((v) => v + 1), ms);
    return () => window.clearInterval(id);
  }, [ms, run, start, rest, reduce]);
  return n;
}

/** Types `text` out, holds, and starts again; resets when it stops running. */
function useTyping(text: string, run: boolean, { speed = 55, hold = 2600 } = {}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) {
      setN(text.length);
      return;
    }
    if (!run) {
      setN(0);
      return;
    }
    let alive = true;
    let id = 0;
    const step = (i: number) => {
      if (!alive) return;
      setN(i);
      id = window.setTimeout(
        () => step(i < text.length ? i + 1 : 0),
        i < text.length ? speed : hold,
      );
    };
    // A beat before the first keystroke, so the line doesn't start mid-scroll.
    id = window.setTimeout(() => step(1), 700);
    return () => {
      alive = false;
      window.clearTimeout(id);
    };
  }, [text, run, speed, hold, reduce]);
  return { typed: text.slice(0, n), done: n >= text.length };
}

/* ---------- The founder's code ---------- */

type Tok = [string, string?];
/* Light-theme syntax colours, dark enough to read on white. */
const KW = "text-[#7c3aed]";
const FN = "text-[#1663d1]";
const STR = "text-[#15803d]";
const DIM = "text-ink/40";

/* Kept under ~44 characters a line so the window holds at phone width. */
const CODE: Tok[][] = [
  [["import", KW], [" { meter } "], ["from", KW], [' "./usage"', STR], [";"]],
  [],
  [["export async function", KW], [" invoice", FN], ["(team: Team) {"]],
  [["  const", KW], [" usage = "], ["await", KW], [" meter."], ["read", FN], ["(team.id);"]],
  [["  const", KW], [" total = "], ["price", FN], ["(usage, team.plan);"]],
  [["  return", KW], [" billing."], ["charge", FN], ["(team, total);"]],
  [["}"]],
  [],
  [["export function", KW], [" price", FN], ["(u: Usage, p: Plan) {"]],
  [["  const", KW], [" over = "], ["Math", FN], ["."], ["max", FN], ["(0, u.calls - p.cap);"]],
  [["  return", KW], [" p.monthly + over * p.perCall;"]],
  [["}"]],
  [],
  [["// annual plans: two months free", DIM]],
];
const TYPING = "const annual = (p: Plan) => p.monthly * 10;";

const FILES = [
  { name: "billing.ts", open: true },
  { name: "pricing.tsx" },
  { name: "usage.ts" },
  { name: "plans.ts" },
];

/* ---------- Rankbox, in the corner ---------- */

type Kind = "published" | "draft" | "map";

interface Note {
  kind: Kind;
  title: string;
  meta: string;
  /** What the status bar says while this is the latest event. */
  status: string;
}

/* Generic sample content: a developer tool's blog at yoursite.com. */
const NOTES: Note[] = [
  {
    kind: "published",
    title: "How to price a developer tool",
    meta: "yoursite.com/blog · 9:00 AM",
    status: "Published today",
  },
  {
    kind: "draft",
    title: "Usage-based pricing, explained",
    meta: "Scored 93 · waiting for your OK",
    status: "1 draft waiting",
  },
  {
    kind: "published",
    title: "Webhooks vs polling: which to use?",
    meta: "yoursite.com/blog · 9:00 AM",
    status: "Published today",
  },
  {
    kind: "map",
    title: "8 new buyer questions found",
    meta: "Approve them whenever you surface",
    status: "8 questions to review",
  },
];

const KIND_CHIP: Record<Kind, { label: string; className: string }> = {
  published: { label: "Published", className: "bg-cta text-white" },
  draft: { label: "Draft ready", className: "bg-cta-soft text-cta" },
  map: { label: "Topic map", className: "border border-ink/[0.08] bg-white text-muted-foreground" },
};

const SHOWN = 3;
const START = 1;
const REST = 2;

function NoteCard({ note, age }: { note: Note; age: number }) {
  const chip = KIND_CHIP[note.kind];
  return (
    <div className="flex gap-2.5 rounded-xl border border-ink/[0.08] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_32px_-18px_rgba(16,24,40,0.28)]">
      {/* Older notes dim their content, never the card: a see-through card
          would let the code behind it tangle with the text. */}
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-brand-blue transition-opacity duration-700",
          age > 0 && "opacity-60",
        )}
      >
        <Mark className="h-4 w-4" />
      </span>
      <div
        className={cn(
          "min-w-0 flex-1 transition-opacity duration-700",
          age === 1 && "opacity-75",
          age >= 2 && "opacity-50",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.62rem] font-semibold text-muted-foreground">
            Rankbox · {age === 0 ? "now" : `${age * 3}h ago`}
          </span>
          <span
            className={cn(
              "rounded-md px-1.5 py-px text-[0.58rem] font-semibold transition-colors duration-500",
              chip.className,
            )}
          >
            {chip.label}
          </span>
        </div>
        <p className="mt-1 truncate text-[0.78rem] font-semibold text-ink">{note.title}</p>
        <p className="truncate text-[0.64rem] text-muted-foreground">{note.meta}</p>
      </div>
    </div>
  );
}

const DAYS = 14;

/** Fourteen days of the blog's publishing in one row, today last. */
function CadenceRow({ todayDone, className }: { todayDone: boolean; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[repeat(14,minmax(0,1fr))] gap-[3px]", className)}>
      {Array.from({ length: DAYS }).map((_, i) => {
        const today = i === DAYS - 1;
        const done = !today || todayDone;
        return (
          <span
            key={i}
            className={cn(
              "aspect-square rounded-[3px] transition-[background-color,box-shadow] duration-500",
              done
                ? today
                  ? "bg-cta"
                  : "bg-cta/75"
                : "bg-white ring-1 ring-inset ring-cta/50 motion-safe:animate-pulse",
            )}
          />
        );
      })}
    </div>
  );
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ink/[0.08] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_32px_-18px_rgba(16,24,40,0.28)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- The scene ---------- */

export function FounderEditorScene() {
  const [ref, on] = useHalfOnScreen<HTMLDivElement>();
  const n = useTicker(3200, on, START, REST);
  const { typed, done } = useTyping(TYPING, on);
  const reduce = useReducedMotion();

  const latest = NOTES[n % NOTES.length];
  const shown = Array.from({ length: Math.min(n + 1, SHOWN) }, (_, age) => n - age);

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        role="img"
        aria-label="Sample: a founder's code editor, open on billing code, while Rankbox notifications arrive in the corner as articles are drafted and published to their blog."
        className="relative h-[38rem] w-full sm:h-[29rem] lg:h-[30rem]"
      >
        {/* The founder's own window: white, busy, and nothing to do with content. */}
        <div className="absolute inset-x-0 top-0 flex h-[23rem] flex-col overflow-hidden rounded-xl border border-ink/[0.09] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_28px_60px_-32px_rgba(16,24,40,0.35)] sm:inset-y-6 sm:right-24 sm:h-auto lg:right-[11.5rem]">
          {/* Title bar and tabs */}
          <div className="flex items-center border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_60%,white)] pl-3.5">
            <span className="flex gap-1.5 pr-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full border border-ink/[0.12] bg-white"
                />
              ))}
            </span>
            <span className="flex items-center gap-1.5 border-x border-ink/[0.07] bg-white px-3 py-2.5 font-mono text-[0.64rem] text-ink shadow-[inset_0_2px_0_var(--cta)]">
              <FileCode2 className="h-3 w-3 text-brand-blue" />
              billing.ts
            </span>
            <span className="hidden px-3 font-mono text-[0.64rem] text-muted-foreground min-[400px]:inline">
              pricing.tsx
            </span>
            <span className="ml-auto mr-3 rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Sample
            </span>
          </div>

          <div className="flex min-h-0 flex-1">
            {/* Explorer, on wide screens only */}
            <div className="hidden w-[10.5rem] shrink-0 border-r border-ink/[0.07] px-2 py-3 lg:block">
              <p className="px-2 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Explorer
              </p>
              <p className="mt-2.5 flex items-center gap-1.5 px-2 font-mono text-[0.64rem] text-ink/70">
                <Folder className="h-3 w-3" /> src
              </p>
              <ul className="mt-1 space-y-px">
                {FILES.map((f) => (
                  <li
                    key={f.name}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md py-1 pl-6 pr-2 font-mono text-[0.64rem]",
                      f.open ? "bg-cta-soft text-cta" : "text-muted-foreground",
                    )}
                  >
                    <FileCode2 className="h-3 w-3 shrink-0" />
                    {f.name}
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 flex items-center gap-1.5 px-2 font-mono text-[0.64rem] text-ink/70">
                <Folder className="h-3 w-3" /> tests
              </p>
            </div>

            {/* The code */}
            <pre className="min-w-0 flex-1 overflow-hidden py-3 font-mono text-[0.62rem] leading-[1.8] text-ink/80 min-[400px]:text-[0.66rem] sm:py-4 sm:text-[0.7rem]">
              {CODE.map((line, i) => (
                <div key={i} className="flex whitespace-pre px-3 sm:px-4">
                  <span className="mr-3 inline-block w-4 shrink-0 select-none text-right text-ink/25 sm:mr-4">
                    {i + 1}
                  </span>
                  <span>
                    {line.map(([text, cls], j) => (
                      <span key={j} className={cls}>
                        {text}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
              {/* The line being written: soft blue, as the editor marks it. */}
              <div className="flex whitespace-pre bg-cta-soft px-3 sm:px-4">
                <span className="mr-3 inline-block w-4 shrink-0 select-none text-right text-cta/60 sm:mr-4">
                  {CODE.length + 1}
                </span>
                <span>
                  <span className={KW}>{typed.slice(0, 5)}</span>
                  {typed.slice(5)}
                  <motion.span
                    className="ml-px inline-block h-3 w-[2px] translate-y-0.5 bg-cta"
                    animate={done && !reduce ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
                    transition={
                      done && !reduce
                        ? { duration: 1.1, repeat: Infinity, ease: "linear" }
                        : { duration: 0 }
                    }
                  />
                </span>
              </div>
            </pre>
          </div>

          {/* Status bar, in the editor's own blue. Its last item is Rankbox. */}
          <div className="flex items-center justify-between gap-3 bg-cta px-3.5 py-1.5 font-mono text-[0.6rem] text-white">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" /> main
              </span>
              <span className="hidden items-center gap-1 min-[400px]:flex">
                <GitCommitHorizontal className="h-3 w-3" /> 4 commits today
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <Mark className="h-3 w-3" />
              <span className="font-sans font-semibold">Blog:</span>
              <span className="font-sans">{latest.status}</span>
            </span>
          </div>
        </div>

        {/* Rankbox, arriving in the corner of the founder's screen. */}
        <ul className="absolute inset-x-2 top-[23.75rem] flex flex-col gap-2 sm:inset-x-auto sm:right-0 sm:top-0 sm:w-[17.5rem] lg:w-[19rem]">
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((k) => {
              const age = n - k;
              return (
                <motion.li
                  key={k}
                  layout
                  initial={{ opacity: 0, y: -14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 - age * 0.02 }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35 } }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  style={{ zIndex: 10 - age, transformOrigin: "50% 0%" }}
                >
                  <NoteCard note={NOTES[k % NOTES.length]} age={age} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        {/* The cadence, under the notifications: the whole point for a team
            of one. Clear of the status bar, whose last item is Rankbox's. */}
        <Panel className="absolute right-0 top-[16.6rem] hidden w-[17.5rem] sm:block lg:w-[19rem]">
          <div className="flex items-center justify-between">
            <p className="text-[0.66rem] font-semibold text-ink">Blog cadence</p>
            <p className="text-[0.6rem] text-muted-foreground">Last 14 days</p>
          </div>
          <CadenceRow todayDone={latest.kind === "published"} className="mt-2.5" />
          <p className="mt-2.5 text-[0.64rem] text-muted-foreground">
            <span className="font-semibold text-ink">Published daily</span> · you opened it twice
          </p>
        </Panel>
      </div>
    </MotionConfig>
  );
}
