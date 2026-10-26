/**
 * The guide's one picture: the same question asked with DeepSeek's Search
 * toggle off and on. Off, the model answers from training — no sources. On,
 * a router sends the question to DeepSeek's own index, the index scores every
 * result (authority tier, rerank score, date), and only then does the answer
 * pick up its numbered citations.
 *
 * The left panel is what a user sees; the right is what DeepSeek's documented
 * pipeline did to get there (V4 encoding tokens, Search API fields). The
 * Search pill in the composer is a real toggle, so a reader can flip it.
 *
 * Motion: the server and a reduced-motion visitor get the finished "Search
 * on" frame. On screen, it holds that frame, flips Search off, then rebuilds
 * the search step by step; off screen it resets to the finished frame.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUp, Atom, CornerDownRight, Globe, Search } from "lucide-react";
import { DeepSeekMark } from "@/components/landing/ai-logos";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/* Illustrative values for the four results in the guide's preview, in the
   Search API's own ranges: authority 0–4, rerank_score 0–3 (1.5 = "high
   quality"), date or null. */
const RESULTS: { date: string | null; authority: number; rerank: number; cite: number | null }[] = [
  { date: "2026-09-30", authority: 3, rerank: 2.6, cite: 1 },
  { date: "2026-08-12", authority: 2, rerank: 2.1, cite: 2 },
  { date: null, authority: 1, rerank: 0.9, cite: null },
  { date: "2026-05-03", authority: 3, rerank: 1.7, cite: null },
];
const QUERY = "free invoicing app 3 users";
const AUTHORITY_NEED = "moderate";
const OFF_ANSWER =
  "Several invoicing apps have free tiers for small teams, but the limits change often. Check each vendor's pricing page for the current terms.";

/* DeepSeek's own UI blue, only inside the mock. */
const DS = "#4d6bfe";

type Frame = { on: boolean; step: number };
/* step, while Search is on: 1 routed · 2 queried · 3 results in · 4 answered */
const DONE: Frame = { on: true, step: 4 };
const HOLD_DONE = 6200;
const HOLD_OFF = 3600;
const STEP_MS = [0, 750, 750, 1400];

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-[0.55rem] font-semibold uppercase text-ink/55 ring-1 ring-white",
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

function Badge({ n, lit }: { n: number; lit?: boolean }) {
  return (
    <span
      className={cn(
        "ml-1 inline-flex h-[1.05rem] min-w-[1.05rem] translate-y-[-1px] items-center justify-center rounded-full px-1 align-middle text-[0.6rem] font-semibold transition-colors",
        lit ? "bg-cta text-white" : "bg-ink/[0.1] text-ink/70",
      )}
    >
      {n}
    </span>
  );
}

function AnswerText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) =>
        s.bold ? (
          <span
            key={i}
            className="font-semibold text-ink underline decoration-cta decoration-2 underline-offset-[3px]"
          >
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

/* ---------- left: what the user sees ---------- */

function ChatPanel({
  p,
  frame,
  pages,
  onToggle,
}: {
  p: AnswerPreview;
  frame: Frame;
  pages: string;
  onToggle: () => void;
}) {
  const state = !frame.on ? "off" : frame.step < 4 ? "searching" : "answered";
  return (
    <div className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(4,24,72,0.35)]">
      <div className="flex items-center gap-2 border-b border-ink/[0.06] px-4 py-2.5">
        <DeepSeekMark className="h-4 w-4" />
        <span className="text-[0.78rem] font-semibold text-ink">DeepSeek</span>
      </div>

      <div className="space-y-4 px-4 py-5 sm:px-5">
        <div className="flex justify-end">
          <p className="max-w-[88%] rounded-2xl bg-[#eef2ff] px-3.5 py-2.5 text-[0.86rem] leading-relaxed text-ink">
            {p.prompt}
          </p>
        </div>

        <div className="flex gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dbe3ff] bg-white">
            <DeepSeekMark className="h-4 w-4" />
          </span>
          <div className="min-h-[9.5rem] min-w-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                {state === "off" && (
                  <>
                    <p className="text-[0.9rem] leading-relaxed text-ink/80">{OFF_ANSWER}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-ink/20 px-2.5 py-1 text-[0.68rem] font-medium text-muted-foreground">
                      No sources · answered from training data
                    </span>
                  </>
                )}
                {state === "searching" && (
                  <div aria-hidden>
                    <p className="flex items-center gap-1.5 text-[0.72rem] font-medium text-muted-foreground">
                      <Search className="h-3.5 w-3.5 animate-pulse motion-reduce:animate-none" />
                      Searching…
                    </p>
                    <div className="mt-3 space-y-2">
                      {[92, 100, 64].map((w) => (
                        <span
                          key={w}
                          className="block h-2.5 rounded-full bg-ink/[0.06]"
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {state === "answered" && (
                  <>
                    <p className="flex items-center gap-1.5 text-[0.72rem] font-medium text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" style={{ color: DS }} aria-hidden />
                      {p.status}
                    </p>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/85">
                      <AnswerText text={p.answer} />
                      <Badge n={1} lit />
                      <Badge n={2} lit />
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-ink/[0.1] px-2.5 py-1 text-[0.7rem] font-medium text-ink/70">
                      <span className="flex -space-x-1">
                        {p.sources.map((s) => (
                          <Favicon key={s.domain} domain={s.domain} className="h-4 w-4" />
                        ))}
                      </span>
                      {pages} web pages
                    </span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* The composer: DeepThink and Search, as DeepSeek labels them. Search
          is the real toggle. */}
      <div className="border-t border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_45%,white)] px-3 py-3 sm:px-4">
        <div className="rounded-xl border border-ink/[0.08] bg-white px-3 pb-2.5 pt-2">
          <p className="text-[0.78rem] text-muted-foreground">Message DeepSeek</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-flex h-7 items-center gap-1 rounded-full border border-ink/[0.1] px-2.5 text-[0.7rem] font-medium text-ink/60">
              <Atom className="h-3.5 w-3.5" aria-hidden />
              DeepThink
            </span>
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={frame.on}
              aria-label="Search"
              className={cn(
                "inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border px-2.5 text-[0.7rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                frame.on
                  ? "border-[#c7d2fe] bg-[#e0e7ff] text-[#3d5afe]"
                  : "border-ink/[0.1] bg-white text-ink/60 hover:border-ink/25",
              )}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden />
              Search
            </button>
            <span
              aria-hidden
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-white"
              style={{ background: DS }}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- right: what DeepSeek's pipeline did ---------- */

function Step({
  n,
  token,
  label,
  value,
  live,
}: {
  n: number;
  token: string;
  label: string;
  value: string;
  live: boolean;
}) {
  return (
    <li
      className={cn(
        "grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-x-2.5 py-2 transition-opacity duration-300 motion-reduce:transition-none",
        !live && "opacity-35",
      )}
    >
      <span className="font-mono text-[0.68rem] font-semibold text-muted-foreground">0{n}</span>
      <span className="min-w-0">
        <code className="font-mono text-[0.74rem] font-semibold text-cta">{token}</code>
        <span className="ml-2 text-[0.76rem] text-ink/65">{label}</span>
      </span>
      <span
        className={cn(
          "max-w-[9.5rem] truncate rounded-md sm:max-w-[15rem] px-2 py-0.5 font-mono text-[0.7rem] font-medium",
          live ? "bg-cta-soft text-cta" : "bg-ink/[0.04] text-ink/40",
        )}
      >
        {live ? value : "—"}
      </span>
    </li>
  );
}

function AuthorityDots({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-[3px]" title={`authority ${value} of 4`}>
      {[1, 2, 3, 4].map((d) => (
        <span
          key={d}
          className={cn("h-1.5 w-1.5 rounded-full", d <= value ? "bg-cta" : "bg-ink/[0.12]")}
        />
      ))}
    </span>
  );
}

function RerankBar({ value, grow, delay }: { value: number; grow: boolean; delay: number }) {
  const pct = (value / 3) * 100;
  return (
    <span className="flex items-center gap-2">
      <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-ink/[0.08]">
        <motion.span
          className={cn(
            "absolute inset-y-0 left-0 origin-left rounded-full",
            value >= 1.5 ? "bg-cta" : "bg-ink/30",
          )}
          style={{ width: `${pct}%` }}
          initial={grow ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
        {/* 1.5: DeepSeek's "high-quality" line */}
        <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-ink/40" />
      </span>
      <span className="w-6 font-mono text-[0.68rem] tabular-nums text-ink/70">
        {value.toFixed(1)}
      </span>
    </span>
  );
}

function EnginePanel({
  p,
  frame,
  pages,
  grow,
}: {
  p: AnswerPreview;
  frame: Frame;
  pages: string;
  grow: boolean;
}) {
  const at = (step: number) => frame.on && frame.step >= step;
  const answered = at(4);
  return (
    <div>
      <ol className="divide-y divide-ink/[0.06] border-y border-ink/[0.06]">
        <Step
          n={1}
          token="action"
          label="search or answer?"
          value={frame.on ? "Search" : "Answer"}
          live
        />
        <Step n={2} token="query" label="queries written" value={QUERY} live={at(2)} />
        <Step
          n={3}
          token="authority"
          label="authority needed"
          value={AUTHORITY_NEED}
          live={at(2)}
        />
      </ol>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span className="font-mono text-[0.68rem] tracking-normal">04</span>
          DeepSeek's index
        </p>
        {at(3) && (
          <p className="text-[0.7rem] text-muted-foreground">
            top {p.sources.length} of {pages} results
          </p>
        )}
      </div>

      {at(3) ? (
        <>
          <div className="mt-2 hidden grid-cols-[minmax(0,1fr)_4.6rem_3.6rem_6.4rem_3.9rem] gap-x-2.5 px-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:grid">
            <span>Result</span>
            <span className="font-mono normal-case tracking-normal">date</span>
            <span className="font-mono normal-case tracking-normal">authority</span>
            <span className="font-mono normal-case tracking-normal">rerank_score</span>
            <span className="text-right">Answer</span>
          </div>
          <ul className="mt-1.5 space-y-1">
            {p.sources.map((s, i) => {
              const r = RESULTS[i % RESULTS.length];
              const cited = r.cite !== null && answered;
              return (
                <motion.li
                  key={s.domain}
                  initial={grow ? { opacity: 0, y: 6 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: grow ? i * 0.14 : 0 }}
                  className={cn(
                    "grid grid-cols-[minmax(0,1fr)_auto] gap-x-2.5 gap-y-1.5 rounded-lg px-2.5 py-2 transition-colors duration-300 sm:grid-cols-[minmax(0,1fr)_4.6rem_3.6rem_6.4rem_3.9rem] sm:items-center",
                    cited ? "bg-cta-soft" : "bg-transparent",
                    r.rerank < 1.5 && "opacity-60",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Favicon domain={s.domain} className="h-4 w-4" />
                    <span className="min-w-0">
                      <span className="block truncate text-[0.74rem] font-medium text-ink">
                        {s.domain}
                      </span>
                      <span className="block truncate text-[0.68rem] text-muted-foreground">
                        {s.title}
                      </span>
                    </span>
                  </span>
                  <span className="justify-self-end sm:order-last">
                    {answered ? (
                      r.cite !== null ? (
                        <span className="inline-flex items-center gap-1 text-[0.66rem] font-semibold text-cta">
                          cited <Badge n={r.cite} lit />
                        </span>
                      ) : (
                        <span className="text-[0.66rem] font-medium text-muted-foreground">
                          {r.rerank < 1.5 ? "dropped" : "listed"}
                        </span>
                      )
                    ) : (
                      <span className="text-[0.66rem] text-muted-foreground">…</span>
                    )}
                  </span>
                  <span className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:contents">
                    <span
                      className={cn(
                        "font-mono text-[0.68rem] tabular-nums",
                        r.date ? "text-ink/70" : "text-[oklch(0.55_0.13_65)]",
                      )}
                    >
                      {r.date ?? "null"}
                    </span>
                    <AuthorityDots value={r.authority} />
                    <RerankBar value={r.rerank} grow={grow} delay={grow ? 0.1 + i * 0.14 : 0} />
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="mt-2 flex min-h-[10.5rem] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-ink/15 px-4 text-center">
          <CornerDownRight className="h-4 w-4 text-ink/30" aria-hidden />
          <p className="text-[0.78rem] font-medium text-ink/55">
            {frame.on ? "Searching DeepSeek's index…" : "No search call"}
          </p>
          <p className="text-[0.7rem] text-muted-foreground">
            {frame.on
              ? "Results are scored before the model sees them"
              : "Nothing retrieved, nothing to cite"}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- the whole figure ---------- */

export function SearchToggle({ preview }: { preview: AnswerPreview }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState<Frame>(DONE);
  const [manual, setManual] = useState(false);
  /* Rows and bars animate in only when a build put them there — never on the
     server-rendered finished frame. */
  const [grow, setGrow] = useState(false);
  const pages = preview.status.match(/\d+/)?.[0] ?? String(preview.sources.length);
  const run = inView && !reduce;

  // Off screen: back to the finished frame and to autoplay.
  useEffect(() => {
    if (!inView) {
      setFrame(DONE);
      setManual(false);
      setGrow(false);
    }
  }, [inView]);

  // A search, once started, builds itself step by step.
  useEffect(() => {
    if (!frame.on || frame.step >= 4) return;
    if (reduce) {
      setFrame(DONE);
      return;
    }
    const id = window.setTimeout(
      () => setFrame((f) => ({ on: true, step: f.step + 1 })),
      STEP_MS[frame.step],
    );
    return () => window.clearTimeout(id);
  }, [frame, reduce]);

  // Autoplay: hold the answer, switch Search off, then search again.
  useEffect(() => {
    if (!run || manual) return;
    const done = frame.on && frame.step >= 4;
    if (!done && frame.on) return;
    const id = window.setTimeout(
      () => {
        if (done) setFrame({ on: false, step: 0 });
        else {
          setGrow(true);
          setFrame({ on: true, step: 1 });
        }
      },
      done ? HOLD_DONE : HOLD_OFF,
    );
    return () => window.clearTimeout(id);
  }, [run, manual, frame]);

  const toggle = () => {
    setManual(true);
    if (frame.on) setFrame({ on: false, step: 0 });
    else if (reduce) setFrame(DONE);
    else {
      setGrow(true);
      setFrame({ on: true, step: 1 });
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="border-b border-ink/[0.07] p-4 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <p className="mb-4 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            What the user sees
            <span
              className={cn(
                "rounded-md px-2 py-0.5 font-mono text-[0.66rem] tracking-normal",
                frame.on ? "bg-cta-soft text-cta" : "bg-ink/[0.05] text-ink/55",
              )}
            >
              Search {frame.on ? "on" : "off"}
            </span>
          </p>
          <ChatPanel p={preview} frame={frame} pages={pages} onToggle={toggle} />
        </div>
        <div className="p-4 sm:p-8 lg:p-10">
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            What DeepSeek did
          </p>
          <EnginePanel p={preview} frame={frame} pages={pages} grow={grow} />
        </div>
      </div>
    </MotionConfig>
  );
}
