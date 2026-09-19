/**
 * The auth page's right-hand panel: what Rankbox sees.
 *
 * A buyer asks an AI search engine for a recommendation, and the engine
 * answers with an AI Overview that names the brand. Two sequences, looping:
 *
 *   1. Search   the bar sits centred, the question types in, the engine reads
 *               its sources, and the bar leaves.
 *   2. Answer   the AI Overview pops up from the bottom to half the panel's
 *               height, writes itself out, and the brand is picked out in it.
 *
 * The brands are fictional. The loop only runs while the scene is on screen,
 * and reduced motion shows the finished answer.
 */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowUp, Mic } from "lucide-react";
import { GeminiMark } from "@/components/landing/ai-logos";
import { cn } from "@/lib/utils";

/* ---------- script ---------- */

const QUESTION = "What's the best Fintech tool?";
const BRAND = "Ledgerline";
const LEAD = "For most growing businesses, ";
/* The answer, in two paragraphs, written out as one continuous run. */
const PARAGRAPHS = [
  `${LEAD}${BRAND} is the top-rated fintech tool. It brings invoicing, spend management, and real-time cash-flow forecasting into one platform, with bank-grade security built in.`,
  "Reviewers single out its fast setup and native accounting integrations, and finance teams say it shortens their month-end close. Clearbook is a strong choice for bookkeeping alone, while Vaultly suits teams that mainly need business banking and cards.",
];
const ANSWER_LENGTH = PARAGRAPHS.reduce((n, p) => n + p.length, 0);
/* Where the brand sits in the first paragraph. */
const BRAND_START = LEAD.length;
const BRAND_END = BRAND_START + BRAND.length;
const SOURCES = 38;

/* ---------- the brands' logos ---------- */

/* Each is its own tile (background included), so one mark serves the result
   rows, the domain chips and the source dots at any size. */
type LogoProps = { className?: string };

/* Ledgerline: an L built from ledger lines. */
function LedgerlineLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#0b1324" />
      <rect x="5.5" y="5" width="3" height="14" rx="1.5" fill="#fff" />
      <rect x="5.5" y="16" width="13" height="3" rx="1.5" fill="#fff" />
      <rect x="11" y="6.4" width="7.5" height="2.5" rx="1.25" fill="#5eead4" />
      <rect x="11" y="11" width="5" height="2.5" rx="1.25" fill="#5eead4" opacity="0.65" />
    </svg>
  );
}

/* Clearbook: a C closing around a reconciled check. */
function ClearbookLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#0f9f76" />
      <path
        d="M16.6 7.4A6.5 6.5 0 1 0 16.6 16.6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M9.4 12.2l2 2.1 3.9-4.3"
        fill="none"
        stroke="#bbf7d0"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Vaultly: a vault door's dial. */
function VaultlyLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#6d4ae0" />
      <circle cx="12" cy="12" r="6.6" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="2" fill="#fff" />
      <path
        d="M12 7.7v1.9M12 14.4v1.9M7.7 12h1.9M14.4 12h1.9"
        stroke="#ddd6fe"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TOOLS = [
  {
    name: "Ledgerline",
    note: "All-in-one finance ops",
    domain: "ledgerline.com",
    Logo: LedgerlineLogo,
  },
  { name: "Clearbook", note: "Automated bookkeeping", domain: "clearbook.io", Logo: ClearbookLogo },
  { name: "Vaultly", note: "Business banking and cards", domain: "vaultly.co", Logo: VaultlyLogo },
] as const;

type Phase =
  | "idle" // sequence 1: the bar arrives, empty
  | "typing"
  | "analyzing"
  | "handoff" // the bar leaves
  | "overview" // sequence 2: the answer pops up and writes itself
  | "highlight" // the brand is picked out
  | "reset"; // the answer drops away before the next loop

/* Expo-out: a quick move that spends most of its time settling. */
const SETTLE = [0.16, 1, 0.3, 1] as const;
/* For the answer dropping away before the next loop. */
const SINK = [0.7, 0, 0.84, 0] as const;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- the pixel field ---------- */

/* Seeded PRNG (mulberry32): the field is identical on server and client. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Pixels sit on an invisible 24px lattice, centred in the panel, so they line
   up with one another the way the hero's pixel field does. */
const CELL = 24;
const COLS = 32;
const rand = seeded(918);

/* Scattered pixels that brighten and fade on their own clocks. */
const PIXELS = Array.from({ length: 46 }, () => ({
  col: Math.floor(rand() * COLS),
  row: Math.floor(rand() * 44),
  peak: 0.07 + rand() * 0.15,
  duration: 4 + rand() * 5,
  delay: rand() * 7,
  accent: rand() < 0.25,
}));

/* Columns a packet of light travels up, pixel by pixel: data moving through. */
const STREAMS = [
  { col: 4, from: 14, length: 10, delay: 0 },
  { col: 11, from: 1, length: 8, delay: 1.7 },
  { col: 20, from: 3, length: 9, delay: 3.2 },
  { col: 27, from: 17, length: 11, delay: 0.9 },
  { col: 29, from: 2, length: 8, delay: 2.4 },
];
const STREAM_CYCLE = 4.6;
const STREAM_STEP = 0.09;

const SPECKS = Array.from({ length: 18 }, () => ({
  left: rand() * 96,
  top: 35 + rand() * 65,
  size: 2 + Math.round(rand()),
  travel: 120 + rand() * 140,
  duration: 9 + rand() * 8,
  delay: rand() * 10,
  opacity: 0.3 + rand() * 0.45,
}));

function PixelField({ busy }: { busy: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-brand-blue">
      {/* Pixels brighten while the engine reads its sources. */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 transition-opacity duration-700"
        style={{ width: COLS * CELL, opacity: busy ? 1 : 0.75 }}
      >
        {PIXELS.map((p, i) => (
          <span
            key={i}
            className={cn("absolute animate-cell-pulse", p.accent ? "bg-[#9cc2ff]" : "bg-white")}
            style={
              {
                left: p.col * CELL + 1,
                top: p.row * CELL + 1,
                width: CELL - 1,
                height: CELL - 1,
                "--cell-opacity": p.accent ? p.peak * 1.8 : p.peak,
                "--cell-duration": `${p.duration.toFixed(1)}s`,
                "--cell-delay": `${p.delay.toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
        {STREAMS.flatMap((s) =>
          Array.from({ length: s.length }, (_, k) => (
            <span
              key={`${s.col}-${k}`}
              className="absolute animate-cell-flow bg-[#9cc2ff]"
              style={
                {
                  left: s.col * CELL + 1,
                  top: (s.from + s.length - 1 - k) * CELL + 1,
                  width: CELL - 1,
                  height: CELL - 1,
                  // Brightest mid-column, dimmer where it enters and leaves.
                  "--cell-opacity": 0.12 + 0.22 * Math.sin((Math.PI * (k + 0.5)) / s.length),
                  "--cell-duration": `${STREAM_CYCLE}s`,
                  "--cell-delay": `${(s.delay + k * STREAM_STEP).toFixed(2)}s`,
                } as CSSProperties
              }
            />
          )),
        )}
      </div>
      {SPECKS.map((p, i) => (
        <span
          key={i}
          className="absolute animate-particle-rise bg-white"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              "--particle-opacity": p.opacity,
              "--particle-travel": `-${Math.round(p.travel)}px`,
              "--particle-duration": `${p.duration.toFixed(1)}s`,
              "--particle-delay": `${p.delay.toFixed(2)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ---------- small pieces ---------- */

/* The Gemini mark, turning while the engine works. */
function SpinningSpark({ spinning, className }: { spinning: boolean; className?: string }) {
  return (
    <motion.span
      className={cn("inline-flex shrink-0", className)}
      animate={{ rotate: spinning ? 360 : 0 }}
      transition={
        spinning
          ? { repeat: Infinity, duration: 2.2, ease: "linear" }
          : { duration: 0.5, ease: SETTLE }
      }
    >
      <GeminiMark className="h-full w-full" />
    </motion.span>
  );
}

function Caret({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "ml-px inline-block h-[1.1em] w-[2px] translate-y-[0.2em] animate-pulse rounded-full",
        className,
      )}
    />
  );
}

/* Counts up to `to` whenever `run` turns on; back to zero when it turns off. */
function useCount(to: number, run: boolean, ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) {
      setN(0);
      return;
    }
    if (prefersReducedMotion()) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);
  return n;
}

/* ---------- sequence 1: the search ---------- */

function SearchBar({
  text,
  showCaret,
  working,
  ready,
  pressed,
}: {
  text: string;
  showCaret: boolean;
  working: boolean;
  ready: boolean;
  pressed: boolean;
}) {
  return (
    <div className="relative rounded-full p-[1.5px]">
      {/* The multicolour ring an AI search bar wears while it works. */}
      <div
        className={cn(
          "absolute inset-0 animate-gradient-pan rounded-full bg-[linear-gradient(90deg,#3b82f6,#8b5cf6,#22d3ee,#3b82f6)] transition-opacity duration-500",
          working ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="relative flex h-14 items-center gap-3 rounded-full bg-white pl-4 pr-2 shadow-[0_18px_40px_-16px_rgb(3_22_70/0.55)]">
        <SpinningSpark spinning={working && !showCaret} className="h-5 w-5" />
        <div className="min-w-0 flex-1 truncate text-[0.95rem] font-medium text-ink">
          {text ? (
            <>
              {text}
              {showCaret && <Caret className="bg-brand-blue" />}
            </>
          ) : (
            <>
              {showCaret && <Caret className="-ml-0.5 mr-1 bg-brand-blue" />}
              <span className="font-normal text-muted-foreground">Ask anything</span>
            </>
          )}
        </div>
        <Mic className="hidden h-[1.1rem] w-[1.1rem] shrink-0 text-muted-foreground sm:block" />
        <motion.span
          animate={{ scale: pressed ? [1, 0.84, 1] : 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
            ready ? "bg-brand-blue text-white" : "bg-secondary text-muted-foreground",
          )}
        >
          <ArrowUp className="h-[1.1rem] w-[1.1rem]" strokeWidth={2.5} />
        </motion.span>
      </div>
    </div>
  );
}

function Analyzing({ active }: { active: boolean }) {
  const count = useCount(SOURCES, active, 1300);
  return (
    <div className="absolute inset-x-0 top-full mt-3 flex h-5 justify-center">
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: SETTLE }}
            className="flex items-center gap-1.5 text-[0.75rem] font-medium text-white/85"
          >
            <span className="flex h-[1.15rem] w-[1.15rem] items-center justify-center rounded-full bg-white">
              <SpinningSpark spinning className="h-3 w-3" />
            </span>
            <span>
              Analyzing <span className="tabular-nums">{count}</span> sources
            </span>
            <span className="ml-1 flex -space-x-1">
              {TOOLS.map((t, i) => (
                <motion.span
                  key={t.name}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.25, duration: 0.35, ease: SETTLE }}
                  className="flex h-4 w-4 overflow-hidden rounded-full ring-[1.5px] ring-brand-blue"
                >
                  <t.Logo className="h-full w-full" />
                </motion.span>
              ))}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- sequence 2: the AI Overview ---------- */

/* The first paragraph, with the brand set in bold and underlined once marked. */
function LeadParagraph({ shown, marked }: { shown: number; marked: boolean }) {
  const text = PARAGRAPHS[0];
  const before = text.slice(0, Math.min(shown, BRAND_START));
  const brand = shown > BRAND_START ? text.slice(BRAND_START, Math.min(shown, BRAND_END)) : "";
  const after = shown > BRAND_END ? text.slice(BRAND_END, shown) : "";
  return (
    <>
      {before}
      {brand && (
        <span
          className={cn(
            "font-semibold text-ink underline decoration-2 underline-offset-[3px] transition-[text-decoration-color] duration-700",
            marked ? "decoration-volt" : "decoration-transparent",
          )}
        >
          {brand}
        </span>
      )}
      {after}
    </>
  );
}

/* Both paragraphs, revealed `chars` characters in. The caret rides at the
   end of whichever paragraph is being written. */
function StreamedAnswer({
  chars,
  streaming,
  marked,
}: {
  chars: number;
  streaming: boolean;
  marked: boolean;
}) {
  let start = 0;
  return (
    <div className="mt-3 space-y-2.5 text-[0.9rem] leading-[1.65] text-ink/80">
      {PARAGRAPHS.map((text, i) => {
        const from = start;
        start += text.length;
        const shown = Math.max(0, Math.min(chars - from, text.length));
        const writing = streaming && chars >= from && chars < from + text.length;
        if (i > 0 && !shown && !writing) return null;
        return (
          <p key={i}>
            {i === 0 ? <LeadParagraph shown={shown} marked={marked} /> : text.slice(0, shown)}
            {writing && <Caret className="bg-volt" />}
          </p>
        );
      })}
    </div>
  );
}

function ToolRow({
  tool,
  rank,
  highlight,
}: {
  tool: (typeof TOOLS)[number];
  rank: number;
  highlight: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: SETTLE }}
      className={cn(
        "flex items-center gap-3 rounded-xl px-2.5 py-1.5 ring-1 transition-[background-color,box-shadow] duration-500",
        highlight ? "bg-volt/[0.07] ring-volt/35" : "ring-transparent",
      )}
    >
      <span className="w-2.5 text-[0.7rem] font-semibold tabular-nums text-muted-foreground">
        {rank}
      </span>
      <tool.Logo className="h-7 w-7 shrink-0 drop-shadow-[0_1px_1px_rgb(0_0_0/0.12)]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[0.82rem] font-semibold text-ink">{tool.name}</span>
          <AnimatePresence>
            {highlight && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: SETTLE, delay: 0.15 }}
                className="shrink-0 rounded-full bg-volt px-1.5 py-px text-[0.58rem] font-bold uppercase tracking-wide text-white"
              >
                Your brand
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="truncate text-[0.7rem] text-muted-foreground">{tool.note}</p>
      </div>
      <span className="hidden shrink-0 items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[0.62rem] font-medium text-muted-foreground sm:inline-flex">
        <tool.Logo className="h-3 w-3" />
        {tool.domain}
      </span>
    </motion.div>
  );
}

function Overview({
  chars,
  streaming,
  rows,
  highlight,
}: {
  chars: number;
  streaming: boolean;
  rows: number;
  highlight: boolean;
}) {
  return (
    <div className="px-5 pt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SpinningSpark spinning={streaming} className="h-[1.2rem] w-[1.2rem]" />
          <span className="text-[0.95rem] font-semibold text-ink">AI Overview</span>
        </div>
        <span className="text-[0.7rem] font-medium text-muted-foreground">{SOURCES} sources</span>
      </div>

      <StreamedAnswer chars={chars} streaming={streaming} marked={highlight} />
      {streaming && <div className="mt-2 h-2 w-2/5 rounded-full bg-shimmer" />}

      {rows > 0 && (
        <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Top recommended
        </p>
      )}
      <div className="mt-1.5 space-y-0.5">
        {TOOLS.slice(0, rows).map((tool, i) => (
          <ToolRow key={tool.name} tool={tool} rank={i + 1} highlight={highlight && i === 0} />
        ))}
      </div>
    </div>
  );
}

/* ---------- the scene ---------- */

export function AiSearchScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [chars, setChars] = useState(0);
  const [rows, setRows] = useState(0);

  // Only animate while visible: the loop re-renders per character.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen) return;
    if (prefersReducedMotion()) {
      setTyped(QUESTION.length);
      setChars(ANSWER_LENGTH);
      setRows(TOOLS.length);
      setPhase("highlight");
      return;
    }

    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    async function run() {
      let first = true;
      while (alive) {
        // Clear the stage. After the first pass the answer drops away first.
        if (!first) {
          setPhase("reset");
          await wait(750);
          if (!alive) return;
        }
        first = false;
        setTyped(0);
        setChars(0);
        setRows(0);
        setPressed(false);

        // Sequence 1: the search. The bar arrives, centred, and a buyer types
        // the question at a person's uneven pace.
        setPhase("idle");
        await wait(1000);
        if (!alive) return;
        setPhase("typing");
        for (let i = 1; i <= QUESTION.length; i++) {
          if (!alive) return;
          setTyped(i);
          const ch = QUESTION[i - 1];
          await wait(46 + Math.random() * 60 + (ch === " " ? 50 : 0));
        }
        await wait(450);
        if (!alive) return;
        setPressed(true);
        await wait(280);
        setPhase("analyzing");
        await wait(1600);

        // End of sequence 1: the bar leaves.
        if (!alive) return;
        setPhase("handoff");
        await wait(800);

        // Sequence 2: the answer pops up and starts writing as it lands.
        if (!alive) return;
        setPhase("overview");
        await wait(450);
        for (let i = 1; i <= ANSWER_LENGTH; i++) {
          if (!alive) return;
          setChars(i);
          await wait(10);
        }
        await wait(240);
        for (let r = 1; r <= TOOLS.length; r++) {
          if (!alive) return;
          setRows(r);
          await wait(220);
        }
        await wait(450);

        // The brand is picked out, then the answer holds.
        if (!alive) return;
        setPhase("highlight");
        await wait(5200);
      }
    }

    void run();
    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [onScreen]);

  const searching = phase === "idle" || phase === "typing" || phase === "analyzing";
  const answerUp = phase === "overview" || phase === "highlight";
  const streaming = phase === "overview" && chars < ANSWER_LENGTH;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={ref}
        role="img"
        aria-label={`An AI search for "${QUESTION}" returns an AI Overview that recommends ${BRAND} first.`}
        className={cn("relative isolate overflow-hidden", className)}
      >
        <PixelField busy={phase === "analyzing"} />

        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 w-[min(86%,34rem)] -translate-x-1/2"
        >
          {/* Sequence 1: the search bar, centred in the panel. */}
          <AnimatePresence>
            {searching && (
              <motion.div
                key="search"
                className="absolute inset-x-0 top-1/2"
                initial={{ opacity: 0, y: "-30%", scale: 0.96 }}
                animate={{ opacity: 1, y: "-50%", scale: 1 }}
                exit={{
                  opacity: 0,
                  y: "-80%",
                  scale: 0.96,
                  filter: "blur(6px)",
                  // Even-paced, so the exit reads as the end of the scene
                  // rather than a flicker.
                  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
                }}
                transition={{ duration: 0.6, ease: SETTLE }}
              >
                <SearchBar
                  text={QUESTION.slice(0, typed)}
                  showCaret={phase === "idle" || phase === "typing"}
                  working={phase === "typing" || phase === "analyzing"}
                  ready={typed === QUESTION.length}
                  pressed={pressed}
                />
                <Analyzing active={phase === "analyzing"} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sequence 2: the AI Overview pops up from below the panel and
              settles with its top at half height. A spring gives it the pop,
              blur-to-sharp brings it into focus; it runs 2rem past the bottom
              edge so the overshoot never shows a gap beneath it. */}
          <motion.div
            className="absolute inset-x-0 -bottom-8 top-1/2 overflow-hidden rounded-t-[24px] bg-card shadow-[0_-24px_60px_-24px_rgb(3_22_70/0.5)] ring-1 ring-black/5"
            initial={false}
            animate={
              answerUp ? { y: "0%", filter: "blur(0px)" } : { y: "108%", filter: "blur(6px)" }
            }
            transition={
              answerUp
                ? {
                    y: { type: "spring", bounce: 0.28, duration: 1.1 },
                    filter: { duration: 0.7, ease: SETTLE },
                  }
                : { duration: 0.65, ease: SINK }
            }
          >
            <Overview
              chars={chars}
              streaming={streaming}
              rows={rows}
              highlight={phase === "highlight"}
            />
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
