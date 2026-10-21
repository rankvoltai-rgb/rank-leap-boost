/**
 * The page's one focal picture: Reddit Presence, running, with its four facts
 * annotated on the screen.
 *
 * A sweep lands threads ranked by fit, then the best one opens and the screen
 * walks through what the feature promises, in the order it happens: the
 * measured Google position (1), the AI engines asked (2), a draft that leads
 * with its disclosure (3), and the hand-off, where Rankbox stops and the
 * person posts from their own account (4). The numbers on the screen match the
 * legend under it, which is the feature's `specs`, and the legend's cell
 * lights up as the screen reaches it.
 *
 * Nothing here posts. The last frame is a "Copy reply" button and an "Open
 * thread" link, because that is all the product has: Rankbox holds no Reddit
 * login. It runs only while about half of it is on screen, starts over once
 * it leaves, and with reduced motion shows the finished frame, still.
 */
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Check, ChevronDown, Copy, ExternalLink, Loader2, Lock, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatGPTMark, GoogleMark, RedditMark } from "@/components/landing/ai-logos";
import { Band, LINE_FILL } from "@/components/landing/frame";
import type { Feature } from "@/data/features";
import { AiChip, EASE, FitRing, GoogleChip, Marker, SampleTag, Skeleton, SubLine } from "./atoms";
import {
  BLOCKED,
  CREDITS,
  DISCLOSURE_WORDS,
  REPLY_WORDS,
  REPORT,
  REPORT_SUMMARY,
  SITE,
  SWEEP,
  THREADS,
} from "./sample";

/* ---------- The timeline ---------- */

interface Frame {
  /** Threads landed so far; the last one is the blocked thread. */
  rows: number;
  /** 0 sweeping, 1 measured, 2 AI-checked, 3 drafted, 4 handed off. */
  step: number;
  drafting: boolean;
  words: number;
  checks: boolean;
}

const ROW_COUNT = THREADS.length + 1;
const START: Frame = { rows: 0, step: 0, drafting: false, words: 0, checks: false };
const END: Frame = {
  rows: ROW_COUNT,
  step: 4,
  drafting: false,
  words: REPLY_WORDS.length,
  checks: true,
};

const SWEEP_MS = 1700;
const ROW_AT = [450, 750, 1050, 1350, 1750];
const MEASURED_AT = 2500;
const AI_AT = 4300;
const DRAFT_AT = 6100;
const TYPE_AT = 6900;
const WORD_MS = 38;
const CHECKS_AT = TYPE_AT + REPLY_WORDS.length * WORD_MS + 300;
const HANDOFF_AT = CHECKS_AT + 1100;
const LOOP_AT = HANDOFF_AT + 5200;

function useMonitor(active: boolean, reduce: boolean) {
  const [frame, setFrame] = useState<Frame>(START);
  const [cycle, setCycle] = useState(0);
  const sweep = useMotionValue(0);

  useEffect(() => {
    if (reduce) {
      sweep.jump(1);
      setFrame(END);
      return;
    }
    // Off screen: back to the start, so the next visit sees the sweep.
    sweep.jump(0);
    setFrame(START);
    if (!active) return;

    const timers: number[] = [];
    let typer = 0;
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const counting = animate(sweep, 1, { duration: SWEEP_MS / 1000, ease: [0.33, 0, 0.2, 1] });

    ROW_AT.forEach((ms, i) => at(ms, () => setFrame((f) => ({ ...f, rows: i + 1 }))));
    at(MEASURED_AT, () => setFrame((f) => ({ ...f, step: 1 })));
    at(AI_AT, () => setFrame((f) => ({ ...f, step: 2 })));
    at(DRAFT_AT, () => setFrame((f) => ({ ...f, step: 3, drafting: true })));
    at(TYPE_AT, () => {
      let n = 0;
      setFrame((f) => ({ ...f, drafting: false }));
      typer = window.setInterval(() => {
        n += 1;
        setFrame((f) => ({ ...f, words: n }));
        if (n >= REPLY_WORDS.length) window.clearInterval(typer);
      }, WORD_MS);
    });
    at(CHECKS_AT, () => setFrame((f) => ({ ...f, checks: true })));
    at(HANDOFF_AT, () => setFrame((f) => ({ ...f, step: 4 })));
    at(LOOP_AT, () => setCycle((c) => c + 1));

    return () => {
      counting.stop();
      timers.forEach((t) => window.clearTimeout(t));
      window.clearInterval(typer);
    };
  }, [active, reduce, cycle, sweep]);

  return { frame, sweep };
}

/* ---------- Pieces of the screen ---------- */

function Count({ sweep, to }: { sweep: MotionValue<number>; to: number }) {
  const text = useTransform(sweep, (p) => Math.round(p * to).toLocaleString("en-US"));
  return <motion.span>{text}</motion.span>;
}

function Figure({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-white px-4 py-3 lg:px-5", className)}>
      <p className="text-[0.68rem] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex h-7 items-baseline gap-1 text-[1.35rem] font-semibold leading-7 tracking-tight text-ink tabular-nums">
        {children}
      </div>
    </div>
  );
}

const FILTERS = [
  { label: "All open", n: SWEEP.open },
  { label: "Ranks on Google", n: SWEEP.ranked },
  { label: "AI-cited", n: SWEEP.cited },
  { label: "Blocked", n: SWEEP.blocked },
];

function ThreadRow({
  t,
  selected,
  grow,
}: {
  t: (typeof THREADS)[number];
  selected: boolean;
  grow: boolean;
}) {
  return (
    <motion.div
      initial={grow ? { opacity: 0, y: 8, filter: "blur(3px)" } : false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: EASE }}
      className={cn(
        "flex h-[4.7rem] items-center gap-3 rounded-lg border px-3 transition-[background-color,border-color,box-shadow] duration-500",
        selected
          ? "border-cta/25 bg-[color-mix(in_oklab,var(--cta)_6%,white)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_8%,transparent)]"
          : "border-ink/[0.07] bg-white",
      )}
    >
      <div className="min-w-0 flex-1">
        <SubLine sub={t.sub} meta={t.age} />
        <p className="mt-1 truncate text-[0.76rem] font-medium leading-snug text-ink">{t.title}</p>
        <div className="mt-1.5 flex gap-1 overflow-hidden">
          <GoogleChip google={t.google} />
          <AiChip ai={t.ai} />
        </div>
      </div>
      <FitRing value={t.fit} grow={grow} />
    </motion.div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex h-[4.7rem] items-center gap-3 rounded-lg border border-dashed border-ink/[0.08] px-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="w-20" />
        <Skeleton className="w-[85%]" />
        <Skeleton className="w-28" />
      </div>
      <span className="h-[34px] w-[34px] rounded-full border-[3.5px] border-ink/[0.05]" />
    </div>
  );
}

/** A labelled block of the detail pane, numbered to match the legend. */
function Block({
  n,
  label,
  on,
  pulse,
  children,
  className,
}: {
  n: number;
  label: string;
  on: boolean;
  pulse: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-white px-3.5 py-3", className)}>
      <div className="flex items-center gap-2">
        <Marker n={n} on={on} pulse={pulse} />
        <p className="text-[0.68rem] font-medium text-muted-foreground">{label}</p>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Appear({
  show,
  grow,
  children,
}: {
  show: boolean;
  grow: boolean;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <motion.div
      initial={grow ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const CHECK_IDS = ["disclosure", "answers_first", "link_budget", "subreddit_rules"];
const SHOWN_CHECKS = REPORT.checks.filter((c) => CHECK_IDS.includes(c.id));
const VERDICT =
  REPORT.failures > 0
    ? "Fix this before you post"
    : REPORT.unknowns > 0
      ? "Ready — after you check the rest yourself"
      : "Ready for you to post";

/* ---------- The window ---------- */

function ThreadMonitor({
  frame,
  sweep,
  still,
}: {
  frame: Frame;
  sweep: MotionValue<number>;
  still: boolean;
}) {
  const grow = !still;
  const swept = frame.rows >= ROW_COUNT;
  const t = THREADS[0];
  const typed = frame.words >= REPLY_WORDS.length;
  const credits = frame.step >= 3 ? CREDITS - 1 : CREDITS;
  const reached = (n: number) => frame.step >= n;
  const current = (n: number) => !still && frame.step === n;

  return (
    <div
      role="img"
      aria-label={`Sample Reddit Presence screen for ${SITE}: a sweep ranks Reddit threads by fit, each with its measured Google position and whether AI engines cite it. The top thread opens, Rankbox drafts a reply that starts by disclosing who you work for and checks it, and hands it to you to copy and post from your own account. Rankbox never posts.`}
      className="overflow-hidden rounded-xl bg-white text-left shadow-[0_2px_4px_rgba(16,24,40,0.05),0_40px_80px_-36px_rgba(16,24,40,0.38)] ring-1 ring-ink/[0.07]"
    >
      {/* Title bar */}
      <div className="flex h-12 items-center gap-2.5 border-b border-ink/[0.06] px-4">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fff1eb]">
          <RedditMark className="h-4 w-4" />
        </span>
        <span className="text-[0.82rem] font-semibold text-ink">Reddit Presence</span>
        <span className="hidden items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.7rem] font-medium text-ink sm:flex">
          {SITE}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </span>
        <span className="ml-auto flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              {!swept && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-1.5 w-1.5 rounded-full transition-colors duration-300",
                  swept ? "bg-success" : "bg-cta",
                )}
              />
            </span>
            <span className="hidden min-[420px]:inline">
              {swept ? "Swept just now" : `Sweeping Google + Reddit · ${SWEEP.keywords} keywords`}
            </span>
          </span>
          <SampleTag />
        </span>
      </div>

      {/* The sweep's figures */}
      <div className="grid grid-cols-2 gap-px border-b border-ink/[0.06] bg-ink/[0.06] md:grid-cols-4">
        <Figure label="Threads seen">
          <Count sweep={sweep} to={SWEEP.seen} />
        </Figure>
        <Figure label="Open threads" className="hidden md:block">
          <Count sweep={sweep} to={SWEEP.open} />
        </Figure>
        <Figure label="Ranks on Google" className="hidden md:block">
          <Count sweep={sweep} to={SWEEP.ranked} />
        </Figure>
        <Figure label="Reply credits">
          <motion.span
            key={credits}
            initial={grow && credits < CREDITS ? { opacity: 0, y: -6 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {credits}
          </motion.span>
          <span className="text-[0.75rem] font-medium text-muted-foreground">/ {CREDITS}</span>
        </Figure>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,20.5rem)_minmax(0,1fr)] lg:grid-cols-[22.5rem_minmax(0,1fr)]">
        {/* The ranked threads */}
        <div className="border-b border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] p-3 md:border-b-0 md:border-r">
          <div className="mb-2.5 flex gap-1 overflow-hidden [mask-image:linear-gradient(to_right,#000_85%,transparent)]">
            {FILTERS.map((f, i) => (
              <span
                key={f.label}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium",
                  i === 0
                    ? "border-cta bg-cta text-white"
                    : "border-ink/[0.08] bg-white text-muted-foreground",
                )}
              >
                {f.label}
                <span className={cn("tabular-nums", i !== 0 && "text-muted-foreground/70")}>
                  {swept ? f.n : "–"}
                </span>
              </span>
            ))}
          </div>

          <div className="space-y-1.5">
            {THREADS.map((th, i) => (
              <div key={th.title} className={i === 1 || i === 3 ? "hidden sm:block" : undefined}>
                {frame.rows > i ? (
                  <ThreadRow t={th} selected={i === 0 && reached(1)} grow={grow} />
                ) : (
                  <RowSkeleton />
                )}
              </div>
            ))}
          </div>

          {/* What the sweep set aside, and why: shown, never quietly dropped. */}
          <div className="mt-3 border-t border-ink/[0.07] pt-2.5">
            <p className="px-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Blocked
            </p>
            <div className="mt-1.5 min-h-[3.4rem]">
              {frame.rows >= ROW_COUNT ? (
                <motion.div
                  initial={grow ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex gap-2.5 rounded-lg border border-ink/[0.06] bg-white/60 px-3 py-2"
                >
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-[0.7rem] text-muted-foreground">
                      <span className="font-semibold text-ink/70">r/{BLOCKED.sub}</span> ·{" "}
                      {BLOCKED.title}
                    </p>
                    <p className="mt-0.5 text-[0.66rem] leading-snug text-muted-foreground">
                      {BLOCKED.reason}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-[3.4rem] items-center rounded-lg border border-dashed border-ink/[0.08] px-3">
                  <Skeleton className="w-[70%]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The thread that's open */}
        <div className="min-w-0 p-4 sm:p-5">
          <div className="min-h-[5.6rem]">
            {reached(1) ? (
              <Appear show grow={grow}>
                <div className="flex items-center justify-between gap-3">
                  <SubLine
                    sub={t.sub}
                    meta={`${t.upvotes} upvotes · ${t.comments} comments · ${t.age}`}
                  />
                  <span className="hidden shrink-0 items-center gap-1 rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.66rem] font-medium text-ink sm:inline-flex">
                    Open thread <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
                <p className="mt-1.5 text-[0.95rem] font-semibold leading-snug tracking-tight text-ink">
                  {t.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[0.74rem] leading-relaxed text-muted-foreground">
                  {t.body}
                </p>
              </Appear>
            ) : (
              <div className="space-y-2.5 pt-1">
                <Skeleton className="w-40" />
                <Skeleton className="h-3 w-[75%]" />
                <Skeleton className="w-[90%]" />
              </div>
            )}
          </div>

          {/* What we know about it, and how */}
          <div className="mt-3 grid gap-px overflow-hidden rounded-lg border border-ink/[0.07] bg-ink/[0.06] sm:grid-cols-2">
            <Block n={1} label="Measured on Google" on={reached(1)} pulse={current(1)}>
              <div className="min-h-[2.4rem]">
                <Appear show={reached(1)} grow={grow}>
                  <p className="flex items-center gap-1.5 text-[0.76rem] font-semibold text-ink">
                    <GoogleMark className="h-3.5 w-3.5" />#{t.google!.pos}
                    <span className="truncate font-normal text-muted-foreground">
                      for “{t.google!.query}”
                    </span>
                  </p>
                  <p className="mt-0.5 text-[0.66rem] text-muted-foreground">
                    US · desktop · measured {t.google!.when}
                  </p>
                </Appear>
              </div>
            </Block>
            <Block n={2} label="Asked of AI engines" on={reached(2)} pulse={current(2)}>
              <div className="min-h-[2.4rem] space-y-1">
                <Appear show={reached(2)} grow={grow}>
                  <div className="flex flex-wrap items-center gap-1">
                    <AiChip ai={t.ai} />
                    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.66rem] font-medium text-muted-foreground ring-1 ring-ink/[0.07]">
                      <ChatGPTMark className="h-3 w-3 opacity-70" />
                      Asked — not cited
                    </span>
                  </div>
                  <p className="mt-1 text-[0.66rem] text-muted-foreground">
                    Checked {t.ai.state === "cited" ? t.ai.when : ""} for your top keywords
                  </p>
                </Appear>
              </div>
            </Block>
          </div>

          {/* The draft */}
          <div className="mt-3 rounded-lg border border-ink/[0.07] bg-white">
            <div className="flex items-center justify-between gap-2 px-3.5 pt-3">
              <div className="flex items-center gap-2">
                <Marker n={3} on={reached(3)} pulse={current(3)} />
                <p className="text-[0.68rem] font-medium text-muted-foreground">Suggested reply</p>
              </div>
              {reached(3) && !frame.drafting && (
                <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
                  Draft · you review
                </span>
              )}
            </div>

            <div className="relative px-3.5 pb-3 pt-2">
              {/* The full reply, invisible, holds the height while it types. */}
              <p aria-hidden className="invisible text-[0.76rem] leading-relaxed">
                {REPLY_WORDS.join(" ")}
              </p>
              <div className="absolute inset-x-3.5 top-2">
                {!reached(3) || frame.drafting ? (
                  <div className="flex flex-col items-start gap-2 pt-1">
                    <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-cta px-3 text-[0.72rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                      {frame.drafting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 motion-safe:animate-spin" />
                          Writing…
                        </>
                      ) : (
                        "Draft a reply · 1 credit"
                      )}
                    </span>
                    <span className="text-[0.66rem] leading-snug text-muted-foreground">
                      {CREDITS} credits left this cycle. You review it before anything leaves this
                      page.
                    </span>
                  </div>
                ) : (
                  <p className="text-[0.76rem] leading-relaxed text-ink">
                    {/* The disclosure line comes first, and is always there. */}
                    <span className="rounded-[3px] bg-cta-soft font-medium text-ink [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                      {REPLY_WORDS.slice(0, Math.min(frame.words, DISCLOSURE_WORDS)).join(" ")}
                    </span>{" "}
                    {REPLY_WORDS.slice(
                      DISCLOSURE_WORDS,
                      Math.max(frame.words, DISCLOSURE_WORDS),
                    ).join(" ")}
                    {!typed && (
                      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] rounded-full bg-cta motion-safe:animate-pulse" />
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* The checker's verdict, from the product's own checker */}
            <div className="flex min-h-[3.3rem] flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-ink/[0.06] px-3.5 py-2">
              {frame.checks ? (
                <Appear show grow={grow}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {SHOWN_CHECKS.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 text-[0.64rem] font-medium text-ink"
                      >
                        <span
                          className={cn(
                            "flex h-3.5 w-3.5 items-center justify-center rounded-full",
                            c.state === "pass"
                              ? "bg-success/15 text-success"
                              : c.state === "unknown"
                                ? "bg-ink/[0.07] text-muted-foreground"
                                : "bg-[#e11d48]/15 text-[#e11d48]",
                          )}
                        >
                          {c.state === "pass" ? (
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          ) : (
                            <Minus className="h-2.5 w-2.5" strokeWidth={3} />
                          )}
                        </span>
                        {c.label}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-[0.64rem] text-muted-foreground">
                    {REPORT_SUMMARY} · <span className="font-medium text-ink">{VERDICT}</span>
                  </p>
                </Appear>
              ) : (
                <Skeleton className="w-[60%]" />
              )}
            </div>
          </div>

          {/* The hand-off: where Rankbox stops */}
          <div
            className={cn(
              "mt-3 flex min-h-[3.4rem] items-center gap-2.5 rounded-lg border px-3 py-2 transition-[border-color,background-color] duration-500",
              reached(4)
                ? "border-cta/20 bg-[color-mix(in_oklab,var(--cta)_4%,white)]"
                : "border-dashed border-ink/[0.1]",
            )}
          >
            <Marker n={4} on={reached(4)} pulse={current(4)} />
            {reached(4) ? (
              <Appear show grow={grow}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="flex gap-1.5">
                    <span className="inline-flex h-7 items-center gap-1 rounded-md bg-cta px-2.5 text-[0.68rem] font-semibold text-white">
                      <Copy className="h-3 w-3" />
                      Copy reply
                    </span>
                    <span className="inline-flex h-7 items-center gap-1 rounded-md border border-ink/[0.1] bg-white px-2.5 text-[0.68rem] font-medium text-ink">
                      Open thread <ExternalLink className="h-3 w-3" />
                    </span>
                  </span>
                  <span className="text-[0.66rem] leading-snug text-muted-foreground">
                    Rankbox can&rsquo;t post for you. Post it from your own account.
                  </span>
                </div>
              </Appear>
            ) : (
              <Skeleton className="w-[55%]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- The section ---------- */

/**
 * The monitor on a dotted panel, between a Reddit-orange glow and a blue one,
 * with the feature's four facts as the legend under it.
 */
export function RedditShowcase({ feature }: { feature: Feature }) {
  const ref = useRef<HTMLDivElement>(null);
  // It runs while about half of it is on screen. On a phone the stacked
  // window is taller than the screen, so "half" would stop it while you read
  // its lower half; there it runs from when its top passes the screen's
  // lower 40% until it has scrolled off.
  const half = useInView(ref, { amount: 0.45 });
  const through = useInView(ref, { margin: "0px 0px -40% 0px" });
  const [tall, setTall] = useState(false);
  useEffect(() => {
    const check = () => setTall((ref.current?.offsetHeight ?? 0) > window.innerHeight * 0.9);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  // Read after mount: the server can't know the setting, so the first client
  // render must match it (moving), or the legend keeps the server's classes.
  const reduce = useReducedMotion();
  const [still, setStill] = useState(false);
  useEffect(() => setStill(Boolean(reduce)), [reduce]);
  const { frame, sweep } = useMonitor(tall ? through : half, still);

  return (
    <section aria-label={`${feature.name}, running`}>
      <Band inner="overflow-hidden">
        <div className="relative bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-3 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(16,24,40,0.1)_1px,transparent_0)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_30%,transparent_100%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#ff4500]/[0.07] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-brand-blue/[0.1] blur-3xl"
          />
          <div ref={ref} className="relative mx-auto max-w-5xl">
            <ThreadMonitor frame={frame} sweep={sweep} still={still} />
          </div>
        </div>
      </Band>

      {/* The legend: the feature's facts, numbered to match the screen. */}
      <Band>
        <dl
          aria-label={`${feature.name} at a glance`}
          className={cn("grid grid-cols-2 gap-px lg:grid-cols-4", LINE_FILL)}
        >
          {feature.specs.map((s, i) => {
            const n = i + 1;
            const on = still || frame.step >= n;
            const now = !still && frame.step === n;
            return (
              <div
                key={s.label}
                className={cn(
                  "relative flex gap-3 px-4 py-5 transition-colors duration-500 sm:px-6 sm:py-6",
                  now ? "bg-[color-mix(in_oklab,var(--cta)_5%,white)]" : "bg-white",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 origin-left bg-cta transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    now ? "scale-x-100" : "scale-x-0",
                  )}
                />
                <span aria-hidden className="mt-1">
                  <Marker n={n} on={on} />
                </span>
                <div className="flex min-w-0 flex-col-reverse justify-end">
                  <dt className="mt-1 text-balance text-[0.8rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="font-display text-[1.3rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.5rem]">
                    {s.value}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </Band>
    </section>
  );
}
