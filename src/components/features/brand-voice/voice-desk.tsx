/**
 * The focal picture on /features/brand-voice: a voice set once, and the same
 * opening paragraph written twice with it, first as generic AI writes it,
 * then in that voice.
 *
 * The voice card sits on the draft's edge like a style sheet laid on a page.
 * As the paragraph turns, each line that changes is numbered, struck, and
 * rewritten; its note in the margin says why; and the part of the voice
 * behind it lights up in the card. A waveform runs under both, noisy while
 * the draft is generic and settling into one steady rhythm once it's yours.
 *
 * It plays only while about half of it is on screen and starts over when it
 * leaves, so every visit sees the turn. With reduced motion it shows the
 * finished paragraph, still. The server renders that finished frame too, so
 * the page's HTML carries the good paragraph, not the generic one.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { ARTICLE_TITLE, SEGMENTS, SITE, VOICE, type RuleKey } from "./sample";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROSE = "#e11d48";
const ROSE_SOFT = "#fdedf1";

/*
 * The timeline, one entry per frame: how long the frame holds.
 *   0      the generic paragraph
 *   1–3    its three off-voice lines flagged, one by one
 *   4–9    each struck, then rewritten in the voice
 *   10     the finished paragraph, held, then back to 0
 */
const FRAME_MS = [1500, 850, 850, 1300, 480, 820, 480, 820, 480, 900, 4600];
const LAST = FRAME_MS.length - 1;
const VOICED_FROM = 4;

type SegState = "plain" | "flagged" | "struck" | "fresh" | "settled";

function segState(i: number, frame: number): SegState {
  if (frame >= LAST) return "settled";
  if (frame < 1 + i) return "plain";
  if (frame < VOICED_FROM + 2 * i) return "flagged";
  if (frame === VOICED_FROM + 2 * i) return "struck";
  return "fresh";
}

const isVoiced = (s: SegState) => s === "fresh" || s === "settled";

/** Drives the frames: plays in view, resets out of it, holds the end when reduced. */
function useTimeline(inView: boolean, reduce: boolean | null) {
  const [frame, setFrame] = useState(LAST);

  useEffect(() => {
    if (reduce) {
      setFrame(LAST);
      return;
    }
    if (!inView) {
      setFrame(0);
      return;
    }
    const id = window.setTimeout(() => setFrame((f) => (f >= LAST ? 0 : f + 1)), FRAME_MS[frame]);
    return () => window.clearTimeout(id);
  }, [inView, reduce, frame]);

  return frame;
}

/* ---------- The waveform ---------- */

const BARS = 132;

/* Deterministic noise, so the server and client draw the same bars. */
function noise(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const NOISY = Array.from({ length: BARS }, (_, i) => 0.1 + 0.8 * Math.pow(noise(i), 1.7));
const STEADY = Array.from(
  { length: BARS },
  (_, i) => 0.28 + 0.5 * Math.abs(Math.sin(i * 0.36)) * (0.78 + 0.22 * Math.sin(i * 0.06)),
);

/** A strip of bars: noise while generic, one steady rhythm once voiced. */
export function Waveform({
  voiced,
  tone = "ink",
  className,
}: {
  voiced: boolean;
  /** `white` for a blue band. */
  tone?: "ink" | "white";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none flex items-end justify-between gap-[3px] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]",
        className,
      )}
    >
      {NOISY.map((n, i) => (
        <span
          key={i}
          className={cn(
            "block h-full min-w-[2px] flex-1 origin-bottom rounded-full transition-[transform,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            tone === "white" ? "bg-white/[0.13]" : voiced ? "bg-cta/25" : "bg-ink/[0.09]",
          )}
          style={
            {
              transform: `scaleY(${(voiced ? STEADY[i] : n).toFixed(3)})`,
              transitionDelay: `${Math.round(i * 4)}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ---------- The voice card ---------- */

function Row({ label, lit, children }: { label: string; lit: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative rounded-lg px-2.5 py-2 transition-[background-color,box-shadow] duration-500",
        lit
          ? "bg-cta-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_18%,transparent)]"
          : "bg-transparent",
      )}
    >
      <p
        className={cn(
          "text-[0.66rem] font-medium transition-colors duration-500",
          lit ? "text-cta" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function VoiceCard({ lit, className }: { lit: Set<RuleKey>; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ink/[0.07] bg-white p-3 shadow-[0_2px_4px_rgba(16,24,40,0.05),0_24px_56px_-20px_rgba(16,24,40,0.28)]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-1 pb-3 pt-0.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cta text-white">
          <Mic className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[0.82rem] font-semibold leading-tight text-ink">Brand voice</p>
          <p className="truncate text-[0.68rem] text-muted-foreground">{SITE}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          On
        </span>
      </div>

      <div className="space-y-0.5 border-t border-ink/[0.06] pt-2">
        <Row label="Tone" lit={lit.has("tone")}>
          <div className="flex flex-wrap gap-1">
            {VOICE.tone.map((t) => (
              <span
                key={t}
                className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.68rem] font-medium text-ink"
              >
                {t}
              </span>
            ))}
          </div>
        </Row>
        <Row label="Audience" lit={lit.has("audience")}>
          <p className="text-[0.74rem] font-medium leading-snug text-ink">{VOICE.audience}</p>
        </Row>
        <Row label="Product" lit={lit.has("product")}>
          <p className="text-[0.74rem] font-medium leading-snug text-ink">{VOICE.product}</p>
        </Row>
        <Row label="Always" lit={lit.has("always")}>
          <ul className="space-y-0.5">
            {VOICE.always.map((a) => (
              <li key={a} className="flex items-start gap-1.5 text-[0.72rem] leading-snug text-ink">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" strokeWidth={3} />
                {a}
              </li>
            ))}
          </ul>
        </Row>
        <Row label="Never" lit={lit.has("never")}>
          <div className="flex flex-wrap gap-1">
            {VOICE.never.map((w) => (
              <span
                key={w}
                className="rounded-md px-1.5 py-0.5 text-[0.68rem] font-medium line-through decoration-1"
                style={{ background: ROSE_SOFT, color: ROSE }}
              >
                {w}
              </span>
            ))}
          </div>
        </Row>
      </div>

      <p className="mt-2 flex items-center gap-1.5 border-t border-ink/[0.06] px-1 pt-2.5 text-[0.68rem] font-medium text-muted-foreground">
        <Check className="h-3 w-3 text-cta" strokeWidth={3} />
        Applied to every article
      </p>
    </div>
  );
}

/* ---------- The draft ---------- */

function Marker({ n, state, live }: { n: number; state: SegState; live: boolean }) {
  if (state === "plain") return null;
  const voiced = isVoiced(state);
  return (
    <motion.span
      initial={live ? { opacity: 0, scale: 0.6 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 26 }}
      className={cn(
        "relative -top-[0.1em] ml-1 inline-flex h-[1.05rem] w-[1.05rem] items-center justify-center rounded-full align-middle text-[0.6rem] font-semibold tabular-nums transition-colors duration-300",
        voiced ? "bg-cta text-white" : "text-white",
      )}
      style={voiced ? undefined : { background: ROSE }}
    >
      {n}
    </motion.span>
  );
}

function Segment({ i, state, live }: { i: number; state: SegState; live: boolean }) {
  const seg = SEGMENTS[i];
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {isVoiced(state) ? (
          <motion.span
            key="voiced"
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: EASE }}
            className={cn(
              "rounded-[3px] text-ink transition-[background-color] duration-1000 [box-decoration-break:clone]",
              state === "fresh" ? "bg-cta-soft" : "bg-transparent",
            )}
          >
            {seg.voiced}
          </motion.span>
        ) : (
          <motion.span
            key="generic"
            exit={{ opacity: 0, filter: "blur(2px)", transition: { duration: 0.22 } }}
            className={cn(
              "rounded-[3px] transition-[background-color,color] duration-300 [box-decoration-break:clone]",
              state === "plain" && "text-ink/55",
              state === "flagged" && "text-ink/75",
              state === "struck" && "line-through decoration-[1.5px]",
            )}
            style={
              state === "flagged" || state === "struck"
                ? {
                    background: ROSE_SOFT,
                    color:
                      state === "struck" ? `color-mix(in oklab, ${ROSE} 75%, white)` : undefined,
                    textDecorationColor: state === "struck" ? ROSE : undefined,
                  }
                : undefined
            }
          >
            {seg.generic}
          </motion.span>
        )}
      </AnimatePresence>
      <Marker n={i + 1} state={state} live={live} />
    </>
  );
}

/* Every version of the paragraph, invisible in one grid cell under the live
   one, so the card holds the height of the longest and never jumps. */
function Sizer() {
  const all = (pick: (i: number) => string) =>
    SEGMENTS.map((_, i) => (
      <span key={i}>
        {pick(i)}
        <span className="ml-1 inline-block w-[1.05rem]" />{" "}
      </span>
    ));
  return (
    <>
      <p aria-hidden className="invisible [grid-area:1/1]">
        {all((i) => SEGMENTS[i].generic)}
      </p>
      <p aria-hidden className="invisible [grid-area:1/1]">
        {all((i) => SEGMENTS[i].voiced)}
      </p>
    </>
  );
}

function Note({ i, state, live }: { i: number; state: SegState; live: boolean }) {
  const seg = SEGMENTS[i];
  const voiced = isVoiced(state);
  // Before its line is marked, the slot waits, empty, so the margin never jumps.
  if (state === "plain") {
    return (
      <li className="flex items-center gap-2.5 rounded-lg border border-dashed border-ink/[0.1] px-2.5 py-2">
        <span className="flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-[0.6rem] font-semibold tabular-nums text-muted-foreground">
          {i + 1}
        </span>
        <span className="block min-w-0 flex-1 space-y-1.5 py-0.5">
          <span className="block h-1.5 w-3/4 rounded-full bg-ink/[0.06]" />
          <span className="block h-1.5 w-1/2 rounded-full bg-ink/[0.045]" />
        </span>
      </li>
    );
  }
  return (
    <motion.li
      initial={live ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border bg-white px-2.5 py-2 transition-[border-color] duration-500",
        voiced ? "border-cta/20" : "border-ink/[0.07]",
      )}
    >
      <span
        className={cn(
          "mt-px flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-full text-[0.6rem] font-semibold tabular-nums text-white transition-colors duration-300",
          voiced && "bg-cta",
        )}
        style={voiced ? undefined : { background: ROSE }}
      >
        {i + 1}
      </span>
      <span className="min-w-0">
        <span className="flex items-start gap-1 text-[0.72rem] font-semibold leading-snug text-ink">
          {voiced ? (
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-cta" strokeWidth={3} />
          ) : (
            <X className="mt-0.5 h-3 w-3 shrink-0" style={{ color: ROSE }} strokeWidth={3} />
          )}
          {voiced ? seg.fix : seg.flag}
        </span>
        <span className="mt-0.5 block text-[0.64rem] text-muted-foreground">
          {voiced ? `From your voice: ${seg.source}` : "Generic AI habit"}
        </span>
      </span>
    </motion.li>
  );
}

function Toggle({ voiced }: { voiced: boolean }) {
  return (
    <span className="inline-flex rounded-lg bg-ink/[0.045] p-0.5 text-[0.7rem] font-medium">
      {(["Generic AI", "Your voice"] as const).map((label, i) => {
        const on = (i === 1) === voiced;
        return (
          <span
            key={label}
            className={cn(
              "relative rounded-md px-2.5 py-1 transition-colors duration-300",
              on ? (i === 1 ? "text-cta" : "text-ink") : "text-muted-foreground",
            )}
          >
            {on && (
              <motion.span
                layoutId="brand-voice-toggle"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-md bg-white shadow-[0_1px_2px_rgba(16,24,40,0.1)]"
              />
            )}
            <span className="relative flex items-center gap-1">
              {i === 1 && <Mic className="h-3 w-3" />}
              {label}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function Status({ frame }: { frame: number }) {
  const state =
    frame >= LAST ? "done" : frame >= VOICED_FROM ? "writing" : frame >= 1 ? "marking" : "generic";
  return (
    <span className="relative flex h-5 items-center overflow-hidden text-[0.7rem] font-medium">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={cn(
            "flex items-center gap-1.5",
            state === "done" ? "text-success" : state === "writing" ? "text-cta" : "",
            state === "generic" && "text-muted-foreground",
          )}
          style={state === "marking" ? { color: ROSE } : undefined}
        >
          {state === "done" ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <span className="relative flex h-1.5 w-1.5">
              {state === "writing" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-1.5 w-1.5 rounded-full",
                  state === "writing" ? "bg-cta" : state === "generic" ? "bg-ink/25" : "",
                )}
                style={state === "marking" ? { background: ROSE } : undefined}
              />
            </span>
          )}
          {state === "done"
            ? "Written in your voice"
            : state === "writing"
              ? "Applying your voice"
              : state === "marking"
                ? "Where generic AI shows"
                : "Generic AI draft"}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Draft({
  frame,
  sized,
  className,
}: {
  frame: number;
  /**
   * True once the client has taken over. Until then (the server HTML, and
   * the moment before hydration) the sizer stays out, so the generic
   * paragraph isn't in the page source, and the markers and notes render at
   * their final values instead of their entrance's first frame.
   */
  sized: boolean;
  className?: string;
}) {
  const states = SEGMENTS.map((_, i) => segState(i, frame));
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_2px_4px_rgba(16,24,40,0.05),0_32px_72px_-28px_rgba(16,24,40,0.3)]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex h-11 items-center gap-2.5 border-b border-ink/[0.06] px-4">
        <Mark className="h-4 w-4 shrink-0 text-brand-blue" />
        <span className="truncate text-[0.75rem] font-medium text-muted-foreground">
          {SITE}
          <span className="mx-1.5 text-ink/20">/</span>
          <span className="text-ink">Drafts</span>
        </span>
        <span className="ml-auto rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Sample
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_15rem]">
        <div className="min-w-0 px-4 pb-5 pt-4 sm:px-6 sm:pt-5 lg:pl-12 lg:pr-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Toggle voiced={frame >= VOICED_FROM} />
            <Status frame={frame} />
          </div>

          <p className="mt-5 text-[0.68rem] font-medium text-muted-foreground">Opening paragraph</p>
          <p className="mt-1 font-display text-[1.2rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.35rem]">
            {ARTICLE_TITLE}
          </p>

          <div className="mt-3 grid text-[0.9rem] leading-[1.7] sm:text-[0.95rem]">
            {sized && <Sizer />}
            <p className="[grid-area:1/1]">
              {states.map((s, i) => (
                <span key={i}>
                  <Segment i={i} state={s} live={sized} />{" "}
                </span>
              ))}
            </p>
          </div>

          {/* The rest of the article, sketched */}
          <div className="mt-4 hidden space-y-2 [mask-image:linear-gradient(to_bottom,#000,transparent)] sm:block">
            {[100, 94, 97, 62].map((w, i) => (
              <span
                key={i}
                className="block h-2 rounded-full bg-ink/[0.06]"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>

        {/* The margin: why each line changed */}
        <aside className="border-t border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-4 py-4 sm:px-6 lg:border-l lg:border-t-0 lg:px-4 lg:py-5">
          <p className="mb-2.5 text-[0.66rem] font-medium text-muted-foreground">
            What changed, and why
          </p>
          <ol className="grid gap-1.5 sm:grid-cols-3 lg:grid-cols-1">
            {states.map((s, i) => (
              <Note key={i} i={i} state={s} live={sized} />
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

/* ---------- The whole picture ---------- */

export function VoiceDesk({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  const frame = useTimeline(inView, reduce);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The parts of the voice behind whatever line is being rewritten right now.
  const lit = new Set<RuleKey>();
  SEGMENTS.forEach((seg, i) => {
    const s = segState(i, frame);
    if (s === "struck" || s === "fresh") seg.rules.forEach((r) => lit.add(r));
  });

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Sample: a brand voice set for ${SITE} (plain-spoken, practical and warm, written for freelancers, with rules to always open on the reader's problem and never use hype words) and the same opening paragraph written twice, first as generic AI writes it, then in that voice with a natural mention of the product.`}
      className={cn(
        "relative bg-[linear-gradient(to_bottom,#edf3fe,#f5f8ff)] px-3 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-14 lg:px-12",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gridlines opacity-70 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_30%,transparent_100%)]"
      />
      <Waveform
        voiced={frame >= VOICED_FROM}
        className="absolute inset-x-0 bottom-0 h-28 px-3 sm:h-40 sm:px-8"
      />
      <div className="relative mx-auto grid max-w-[66rem] items-start gap-4 lg:grid-cols-[17.5rem_1fr] lg:gap-0">
        <VoiceCard lit={lit} className="relative z-10 order-2 lg:order-1 lg:-mr-8 lg:mt-16" />
        <Draft frame={frame} sized={mounted} className="order-1 lg:order-2" />
      </div>
    </div>
  );
}
