/**
 * The page's focal visual: one blog page on a sample app, seen twice. On the
 * left, the AI builder's window, its chat and its preview, which look the
 * same however the page is built. On the right, the first response a crawler
 * that doesn't run JavaScript gets for the same URL: an empty shell when the
 * page renders in the browser, the whole article when it renders on the
 * server. The builder's chat shows what was asked for each.
 *
 * It flips between the two builds only while half of it is on screen, goes
 * back to the first when it leaves, and never moves under reduced motion. A
 * click on either label stops the loop and holds that build. The first render
 * is always the browser build, so server and client agree.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUp, Check, CircleAlert, WandSparkles } from "lucide-react";
import { page, type RenderMode } from "@/data/persona-pages/ai-built-websites";
import { cn } from "@/lib/utils";
import { CODE, WINDOW } from "./tokens";

const S = page.sample;
const EASE = [0.16, 1, 0.3, 1] as const;
/* How long each build holds before the loop flips to the other. */
const HOLD_MS: Record<RenderMode["id"], number> = { browser: 5600, server: 7200 };

/* One line of the raw HTML: an indent and its coloured runs. */
type Run = [keyof typeof CODE, string];
type Line = { indent: number; runs: Run[] };

const tag = (v: string): Run => ["tag", v];
const txt = (v: string): Run => ["text", v];
const dim = (v: string): Run => ["dim", v];
const attr = (name: string, value: string): Run[] => [
  ["attr", ` ${name}=`],
  ["text", `"${value}"`],
];

function htmlFor(mode: RenderMode["id"]): Line[] {
  const a = S.article;
  const head: Line[] = [
    { indent: 0, runs: [dim("<!doctype html>")] },
    { indent: 0, runs: [tag("<html"), ...attr("lang", "en"), tag(">")] },
    { indent: 1, runs: [tag("<head>")] },
  ];
  if (mode === "browser") {
    return [
      ...head,
      { indent: 2, runs: [tag("<title>"), txt(S.brand), tag("</title>")] },
      {
        indent: 2,
        runs: [
          tag("<script"),
          ...attr("type", "module"),
          ...attr("src", "/assets/index-8f3c1a.js"),
          tag("></script>"),
        ],
      },
      { indent: 1, runs: [tag("</head>")] },
      { indent: 1, runs: [tag("<body>")] },
      { indent: 2, runs: [tag("<div"), ...attr("id", "root"), tag("></div>")] },
      { indent: 1, runs: [tag("</body>")] },
      { indent: 0, runs: [tag("</html>")] },
    ];
  }
  return [
    ...head,
    { indent: 2, runs: [tag("<title>"), txt(`${a.title} · ${S.brand}`), tag("</title>")] },
    { indent: 2, runs: [tag("<meta"), ...attr("name", "description"), tag(" …>")] },
    { indent: 1, runs: [tag("</head>")] },
    { indent: 1, runs: [tag("<body>")] },
    { indent: 2, runs: [tag("<article>")] },
    { indent: 3, runs: [tag("<h1>"), txt(a.title), tag("</h1>")] },
    { indent: 3, runs: [tag("<p>"), txt(a.lede), tag("</p>")] },
    { indent: 3, runs: [tag("<h2>"), txt(a.heading), tag("</h2>")] },
    { indent: 3, runs: [tag("<p>"), txt(a.body), tag("</p>")] },
    { indent: 3, runs: [tag("<h2>"), txt(a.heading2), tag("</h2>")] },
    { indent: 3, runs: [dim("…")] },
  ];
}

/* Height of the code pane, fixed at the longer build so a flip never moves
   the page: 15 lines. */
const CODE_HEIGHT = "h-[19.5rem] sm:h-[21rem]";

function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

function Dots() {
  return (
    <span aria-hidden className="flex shrink-0 gap-1.5">
      <span className="h-2 w-2 rounded-full bg-ink/[0.12]" />
      <span className="h-2 w-2 rounded-full bg-ink/[0.12]" />
      <span className="h-2 w-2 rounded-full bg-ink/[0.12]" />
    </span>
  );
}

/* The builder: its chat on the left, the page's preview on the right. */
function BuilderWindow({ mode, run }: { mode: RenderMode; run: boolean }) {
  const a = S.article;
  return (
    <div className={cn(WINDOW, "flex min-w-0 flex-col overflow-hidden")}>
      <div className="flex items-center gap-3 border-b border-ink/[0.07] px-3.5 py-2.5">
        <Dots />
        <span className="flex min-w-0 flex-1 items-center justify-center">
          <span className="min-w-0 truncate rounded-md bg-ink/[0.04] px-2.5 py-1 font-mono text-[0.62rem] text-ink/60">
            {S.domain}
            {S.path}
          </span>
        </span>
        <SampleTag />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] sm:grid-cols-[12.5rem_minmax(0,1fr)]">
        {/* The chat */}
        <div className="flex flex-col gap-3 border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_60%,white)] p-3.5 sm:border-b-0 sm:border-r">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Chat
          </p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={mode.id}
              initial={run ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col gap-2.5"
            >
              <p className="ml-6 rounded-lg rounded-br-sm bg-white px-2.5 py-2 text-[0.7rem] leading-snug text-ink shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-ink/[0.06]">
                {mode.ask}
              </p>
              <div className="flex gap-2">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-ink/[0.06] text-ink/60"
                >
                  <WandSparkles className="h-3 w-3" />
                </span>
                <p className="text-[0.7rem] leading-snug text-ink/70">{mode.reply}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-auto hidden items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-2.5 py-1.5 sm:flex">
            <span className="flex-1 truncate text-[0.66rem] text-muted-foreground">
              Ask the builder…
            </span>
            <span
              aria-hidden
              className="flex h-5 w-5 items-center justify-center rounded-md bg-ink/[0.06] text-ink/50"
            >
              <ArrowUp className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* The preview: the same in both builds, which is the point. */}
        <div className="min-w-0 p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] pb-2.5">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                aria-hidden
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#0f766e] text-[0.6rem] font-bold text-white"
              >
                {S.brand[0]}
              </span>
              <span className="truncate text-[0.74rem] font-semibold text-ink">{S.brand}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2.5">
              {S.nav.map((n) => (
                <span
                  key={n}
                  className={cn(
                    "hidden text-[0.62rem] min-[420px]:inline",
                    n === "Blog" ? "font-semibold text-ink" : "text-muted-foreground",
                  )}
                >
                  {n}
                </span>
              ))}
              <span className="rounded-md bg-[#0f766e] px-2 py-1 text-[0.6rem] font-semibold text-white">
                {S.signup}
              </span>
            </span>
          </div>

          <div className="pt-4">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
              {a.kicker}
            </p>
            <p className="mt-1.5 text-balance font-display text-[1.02rem] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[1.15rem]">
              {a.title}
            </p>
            <p className="mt-2 text-[0.7rem] leading-relaxed text-ink/65">{a.lede}</p>
            <p className="mt-3 text-[0.76rem] font-semibold text-ink">{a.heading}</p>
            <p className="mt-1 text-[0.7rem] leading-relaxed text-ink/65">{a.body}</p>
            <div aria-hidden className="mt-2.5 space-y-1.5">
              <span className="block h-1.5 w-[92%] rounded-full bg-ink/[0.06]" />
              <span className="block h-1.5 w-[78%] rounded-full bg-ink/[0.06]" />
            </div>
            <p className="mt-3 text-[0.76rem] font-semibold text-ink">{a.heading2}</p>
            <div aria-hidden className="mt-2 space-y-1.5">
              <span className="block h-1.5 w-[88%] rounded-full bg-ink/[0.06]" />
              <span className="block h-1.5 w-[64%] rounded-full bg-ink/[0.06]" />
            </div>
            <p className="mt-3 text-[0.6rem] text-muted-foreground">{a.sources}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* The crawler: the first response for the same path, before any JavaScript. */
function CrawlerWindow({ mode, run }: { mode: RenderMode; run: boolean }) {
  const lines = htmlFor(mode.id);
  const empty = mode.id === "browser";
  return (
    <div className={cn(WINDOW, "flex min-w-0 flex-col overflow-hidden")}>
      <div className="flex items-center gap-2 border-b border-ink/[0.07] px-3.5 py-2.5 font-mono text-[0.62rem]">
        <span className="rounded bg-cta-soft px-1.5 py-0.5 font-semibold text-cta">GET</span>
        <span className="min-w-0 flex-1 truncate text-ink/65">{S.path}</span>
        <span className="shrink-0 rounded-md border border-ink/[0.08] px-1.5 py-px font-sans text-[0.58rem] font-semibold text-muted-foreground">
          No JavaScript
        </span>
      </div>

      <div className={cn("relative overflow-hidden px-3.5 py-3 font-mono", CODE_HEIGHT)}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={mode.id}
            initial={run ? "hidden" : false}
            animate="shown"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={{ shown: { transition: { staggerChildren: 0.06 } } }}
            className="text-[0.62rem] leading-[1.38rem] sm:text-[0.66rem]"
          >
            {lines.map((l, i) => (
              <motion.li
                key={i}
                variants={{ hidden: { opacity: 0, x: -6 }, shown: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex min-w-0 gap-3"
              >
                <span aria-hidden className="w-4 shrink-0 text-right tabular-nums text-ink/25">
                  {i + 1}
                </span>
                <span className="min-w-0 truncate" style={{ paddingLeft: `${l.indent * 0.9}rem` }}>
                  {l.runs.map(([kind, v], j) => (
                    <span key={j} className={CODE[kind]}>
                      {v}
                    </span>
                  ))}
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/[0.07] px-3.5 py-2.5">
        <span className="min-w-0 truncate text-[0.66rem] text-muted-foreground">
          {mode.verdict}
        </span>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.64rem] font-semibold tabular-nums",
            empty ? "bg-[#fdf4e4] text-[#b45309]" : "bg-success/12 text-success",
          )}
        >
          {empty ? (
            <CircleAlert className="h-3 w-3" strokeWidth={2.4} />
          ) : (
            <Check className="h-3 w-3" strokeWidth={2.6} />
          )}
          {mode.words} words
        </span>
      </div>
    </div>
  );
}

export function TwoViews() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [at, setAt] = useState(0);
  /* A click on a label holds that build for good. */
  const [held, setHeld] = useState(false);

  const run = inView && !reduce && !held;

  // Off screen, the loop starts over from the browser build.
  useEffect(() => {
    if (!inView && !held) setAt(0);
  }, [inView, held]);

  useEffect(() => {
    if (!run) return;
    const id = window.setTimeout(
      () => setAt((i) => (i + 1) % S.modes.length),
      HOLD_MS[S.modes[at].id],
    );
    return () => window.clearTimeout(id);
  }, [at, run]);

  const mode = S.modes[at];

  return (
    <figure ref={ref} className="relative mx-auto w-full max-w-[64rem]">
      <div className="flex justify-center">
        <div
          role="group"
          aria-label="How the sample blog is built"
          className="inline-flex max-w-full gap-1 rounded-xl border border-ink/[0.08] bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
        >
          {S.modes.map((m, i) => {
            const on = i === at;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setHeld(true);
                  setAt(i);
                }}
                className={cn(
                  "relative overflow-hidden rounded-lg px-3 py-1.5 text-[0.74rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 sm:px-3.5 sm:text-[0.8rem]",
                  on ? "bg-cta-soft text-cta" : "text-muted-foreground hover:text-ink",
                )}
              >
                {m.label}
                {on && run && (
                  <motion.span
                    key={`${m.id}-${at}`}
                    aria-hidden
                    className="absolute inset-x-2 bottom-0.5 h-px origin-left bg-cta/50"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: HOLD_MS[m.id] / 1000, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="img"
        aria-label={`Sample: the builder's preview shows the ${S.brand} article as people see it, and a crawler that doesn't run JavaScript gets ${mode.verdict.toLowerCase()}, ${mode.words} words of text.`}
        className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 sm:mt-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-4"
      >
        <BuilderWindow mode={mode} run={run} />
        <CrawlerWindow mode={mode} run={run} />
      </div>

      <figcaption className="mx-auto mt-4 max-w-2xl text-balance text-center text-[0.76rem] leading-relaxed text-muted-foreground">
        {S.caption}
      </figcaption>
    </figure>
  );
}
