/**
 * The smaller product pictures on /features/citation-tracking: the benefit
 * cards, the step pictures and the closing band's list. All of them read
 * from the same sample as the tracker (sample.ts), so the numbers agree from
 * one picture to the next, and none shows anything the tracker doesn't.
 *
 * Decorative: the sections that use them mark them aria-hidden. Each runs
 * once when it scrolls into view; with reduced motion it starts finished.
 */
import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTypewriter } from "@/components/features/showcase/kit";
import {
  ARTICLES,
  ENGINES,
  PROMPTS,
  SITE,
  TOTAL_ANSWERS,
  TREND,
  citationsByArticle,
  citedFor,
  isCited,
} from "./sample";
import { CARD, Checking, CitedPill, EASE, MarkTile, NotCitedPill, SampleTag } from "./parts";
import { useStill } from "./use-still";

/** Runs once on view; `go` is true straight away with reduced motion. */
function useOnce<T extends Element>(amount = 0.4) {
  const ref = useRef<T>(null);
  const seen = useInView(ref, { once: true, amount });
  const still = useStill();
  return { ref, go: seen || still, instant: still };
}

/* A white screen inside a tinted panel, cut off by the panel's foot. */
export function CroppedScreen({
  title,
  meta,
  children,
  className,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        CARD,
        "absolute inset-x-4 top-6 mx-auto max-w-[26rem] p-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-8 sm:top-8 sm:p-5",
        className,
      )}
    >
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <p className="text-[0.8rem] font-semibold text-ink">{title}</p>
        {meta}
      </div>
      {children}
    </div>
  );
}

/* ---------- Benefits ---------- */

/** Multi-engine coverage: each engine's share of the tracked prompts. */
export function CoverageScreen() {
  const { ref, go, instant } = useOnce<HTMLDivElement>();
  return (
    <CroppedScreen title="Cited, by engine" meta={<SampleTag />}>
      <div ref={ref} className="space-y-2">
        {ENGINES.map((engine, e) => {
          const n = citedFor(e, PROMPTS.length);
          return (
            <div
              key={engine.name}
              className="flex items-center gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2"
            >
              <MarkTile Mark={engine.Mark} />
              <span className="w-[6.5rem] shrink-0 truncate text-[0.74rem] font-medium text-ink sm:w-32">
                {engine.name}
              </span>
              <span className="block h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
                <motion.span
                  className="block h-full rounded-full bg-cta"
                  initial={instant ? false : { width: 0 }}
                  animate={{ width: go ? `${(n / PROMPTS.length) * 100}%` : 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + e * 0.1, ease: EASE }}
                />
              </span>
              <span className="w-8 shrink-0 text-right text-[0.72rem] font-semibold text-ink tabular-nums">
                {n}/{PROMPTS.length}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[0.68rem] text-muted-foreground">
        Share of {PROMPTS.length} tracked prompts that cite {SITE}
      </p>
    </CroppedScreen>
  );
}

/** Know what works: which articles the citations point at. */
export function ArticlesScreen() {
  const { ref, go, instant } = useOnce<HTMLDivElement>();
  const rows = citationsByArticle();
  return (
    <CroppedScreen
      title="Citations, by article"
      meta={<span className="text-[0.68rem] text-muted-foreground">Citations</span>}
    >
      <div ref={ref} className="space-y-1.5">
        {rows.map((a, i) => (
          <motion.div
            key={a.key}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-3 py-2",
              i === 0 ? "border-cta/25 bg-cta-soft" : "border-ink/[0.07] bg-white",
            )}
            initial={instant ? false : { opacity: 0, x: -8 }}
            animate={go ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
          >
            <span className="w-3 shrink-0 text-[0.64rem] font-semibold text-muted-foreground tabular-nums">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.74rem] font-medium text-ink">
              {a.title}
            </span>
            <span className="flex -space-x-1">
              {a.engines.map((e) => (
                <MarkTile
                  key={e}
                  Mark={ENGINES[e].Mark}
                  className="h-[1.15rem] w-[1.15rem] rounded-[4px]"
                  markClassName="h-2.5 w-2.5"
                />
              ))}
            </span>
            <span className="w-4 shrink-0 text-right text-[0.74rem] font-semibold text-ink tabular-nums">
              {a.engines.length}
            </span>
          </motion.div>
        ))}
      </div>
    </CroppedScreen>
  );
}

/** Prove the impact: cited answers, check by check. */
export function TrendScreen() {
  const { ref, go, instant } = useOnce<HTMLDivElement>();
  const now = TREND[TREND.length - 1];
  const ticks = [0, 5, 10];
  const top = 10;
  return (
    <div ref={ref} className={cn(CARD, "p-4 sm:p-5")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.8rem] font-semibold text-ink">Cited answers over time</p>
          <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
            Of {TOTAL_ANSWERS} tracked answers · {SITE}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-right">
            <span className="block text-[1.35rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
              {now}
              <span className="text-[0.8rem] font-medium text-muted-foreground">
                {" "}
                / {TOTAL_ANSWERS}
              </span>
            </span>
            <span className="text-[0.66rem] text-muted-foreground">Latest check</span>
          </p>
          <SampleTag />
        </div>
      </div>

      <div className="relative mt-5 h-36 sm:h-40">
        {/* Gridlines */}
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute inset-x-0 flex items-center gap-2"
            style={{ bottom: `${(t / top) * 100}%` }}
          >
            <span className="w-4 -translate-y-px text-right text-[0.6rem] text-muted-foreground tabular-nums">
              {t}
            </span>
            <span className="h-px flex-1 border-t border-dashed border-ink/[0.08]" />
          </div>
        ))}
        <div className="absolute inset-y-0 left-6 right-0 flex items-end gap-2 sm:gap-3">
          {TREND.map((v, i) => {
            const last = i === TREND.length - 1;
            return (
              <div key={i} className="flex h-full flex-1 flex-col justify-end">
                <motion.div
                  className={cn(
                    "w-full origin-bottom rounded-t-[5px]",
                    last ? "bg-cta" : "bg-[color-mix(in_oklab,var(--cta)_24%,white)]",
                  )}
                  style={{ height: `${(v / top) * 100}%` }}
                  initial={instant ? false : { scaleY: 0 }}
                  animate={{ scaleY: go ? 1 : 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="ml-6 mt-2 flex justify-between text-[0.62rem] text-muted-foreground">
        <span>Earlier</span>
        <span>Latest check</span>
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */

/** Set your prompts: the list of buyer questions, with one being added. */
export function PromptsPicture() {
  const { ref, go } = useOnce<HTMLDivElement>();
  const adding = PROMPTS[PROMPTS.length - 1].q;
  const { typed, typing } = useTypewriter(adding, { speed: 38, hold: 3600, run: go });
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-cta/30 bg-white px-2.5 py-2 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_8%,transparent)]">
        <span className="min-w-0 flex-1 truncate text-[0.74rem] text-ink">
          {typed}
          <span
            className={cn(
              "ml-px inline-block h-3 w-px translate-y-0.5 bg-cta",
              typing ? "opacity-100" : "motion-safe:animate-pulse",
            )}
          />
        </span>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta text-white">
          <Plus className="h-3 w-3" strokeWidth={2.75} />
        </span>
      </div>
      {PROMPTS.slice(0, 3).map((p) => (
        <div
          key={p.q}
          className="flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-2.5 py-2"
        >
          <span className="min-w-0 truncate text-[0.72rem] text-ink">{p.q}</span>
          <span className="flex shrink-0 -space-x-1">
            {ENGINES.map((engine) => (
              <MarkTile
                key={engine.name}
                Mark={engine.Mark}
                className="h-4 w-4 rounded-[4px]"
                markClassName="h-2.5 w-2.5"
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Track citations: one prompt checked on every engine. */
export function CheckPicture() {
  const { ref, go, instant } = useOnce<HTMLDivElement>();
  const p = PROMPTS.length - 1;
  const cites = ENGINES.filter((_, e) => isCited(p, e)).length;
  return (
    <div ref={ref}>
      <p className="ml-auto w-fit max-w-full truncate rounded-lg rounded-br-sm border border-ink/[0.07] bg-white px-2.5 py-1.5 text-[0.72rem] font-medium text-ink">
        {PROMPTS[p].q}?
      </p>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        {ENGINES.map((engine, e) => (
          <div
            key={engine.name}
            className="flex items-center justify-between gap-2 rounded-lg border border-ink/[0.07] bg-white px-2 py-1.5"
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <MarkTile
                Mark={engine.Mark}
                className="h-[1.1rem] w-[1.1rem] rounded-[4px]"
                markClassName="h-2.5 w-2.5"
              />
              <span className="truncate text-[0.66rem] font-medium text-ink">{engine.short}</span>
            </span>
            <span className="relative flex h-5 items-center">
              {!go ? (
                <Checking />
              ) : (
                <motion.span
                  className="flex"
                  initial={instant ? false : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + e * 0.22,
                    type: "spring",
                    stiffness: 480,
                    damping: 24,
                  }}
                >
                  {isCited(p, e) ? <CitedPill compact /> : <NotCitedPill compact />}
                </motion.span>
              )}
            </span>
          </div>
        ))}
      </div>
      <motion.div
        className="mt-2.5 flex items-center justify-between gap-3 rounded-lg border border-cta/20 bg-cta-soft px-2.5 py-2"
        initial={instant ? false : { opacity: 0, y: 6 }}
        animate={go ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ delay: 0.5 + ENGINES.length * 0.22, duration: 0.45, ease: EASE }}
      >
        <span className="min-w-0 truncate text-[0.68rem] font-medium text-ink">
          {cites} of {ENGINES.length} engines cite {SITE}
        </span>
        <span className="flex w-14 shrink-0 gap-0.5">
          {ENGINES.map((engine, e) => (
            <span
              key={engine.name}
              className={cn("h-1 flex-1 rounded-full", e < cites ? "bg-cta" : "bg-cta/20")}
            />
          ))}
        </span>
      </motion.div>
    </div>
  );
}

/** Double down: the prompts most engines cite you for, and the gap. */
export function DoubleDownPicture() {
  const rows = PROMPTS.map((p, r) => ({
    q: p.q,
    n: ENGINES.filter((_, e) => isCited(r, e)).length,
    gap: p.article === null,
  }))
    .filter((r) => r.n >= 3 || r.gap)
    .sort((x, y) => y.n - x.n);
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div
          key={r.q}
          className={cn(
            "rounded-lg border px-2.5 py-2",
            r.gap ? "border-dashed border-[#f2c98a] bg-[#fffaf1]" : "border-ink/[0.07] bg-white",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[0.72rem] font-medium text-ink">{r.q}</span>
            {r.gap ? (
              <span className="shrink-0 rounded-md bg-[#fdf4e4] px-1.5 py-0.5 text-[0.6rem] font-semibold text-[#b45309]">
                Gap
              </span>
            ) : (
              <span className="shrink-0 text-[0.64rem] font-semibold text-cta tabular-nums">
                {r.n} of {ENGINES.length}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex gap-1">
            {ENGINES.map((engine, e) => (
              <span
                key={engine.name}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  e < r.n ? "bg-cta" : r.gap ? "bg-[#f6dcb3]" : "bg-ink/[0.07]",
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Closing ---------- */

/** The closing band's list: every answer that cites the site. */
export function CitationLog() {
  const { ref, go, instant } = useOnce<HTMLDivElement>(0.2);
  const rows = PROMPTS.flatMap((p, r) =>
    p.answers.flatMap((ans, e) => (ans.cite ? [{ r, e, cite: ans.cite }] : [])),
  )
    .reverse()
    .slice(0, 5);
  return (
    <div ref={ref} className={cn(CARD, "rounded-b-none border-b-0 p-4 sm:p-5")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[0.82rem] font-semibold text-ink">Answers citing {SITE}</p>
        <SampleTag />
      </div>
      <div className="space-y-1.5">
        {rows.map(({ r, e, cite }, i) => {
          const engine = ENGINES[e];
          return (
            <motion.div
              key={`${r}-${e}`}
              className="flex items-center gap-2.5 rounded-lg border border-ink/[0.07] bg-white px-3 py-2"
              initial={instant ? false : { opacity: 0, y: 10 }}
              animate={go ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.09, ease: EASE }}
            >
              <MarkTile Mark={engine.Mark} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.74rem] font-medium text-ink">
                  {PROMPTS[r].q}
                </span>
                <span className="block truncate text-[0.66rem] text-muted-foreground">
                  {engine.name} · {ARTICLES[cite].path}
                </span>
              </span>
              <CitedPill />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
