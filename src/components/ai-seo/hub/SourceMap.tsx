/**
 * The hub's focal visual: all eleven engines on the left, the places their
 * search results come from on the right, and a line for every documented
 * (solid) or reported (dashed) link between them. Only the hub can draw this:
 * each guide covers one engine's plumbing, this shows which engines share it.
 *
 * Motion is calm and earns its keep: while the map is at least half on
 * screen it steps through the engines one at a time, lighting that engine's
 * lines and sending a pulse from each source back to it. It stops and resets
 * when the map leaves the screen, pauses on hover or focus, has a pause
 * button, and under reduced motion (and on the server) shows the still
 * frame: every link at once.
 *
 * Below lg the same data is a list, source by source, with no motion.
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  AtSign,
  BookOpen,
  Database,
  EyeOff,
  Link2,
  MousePointerClick,
  Pause,
  Play,
  Search,
} from "lucide-react";
import { BingMark, GoogleMark } from "@/components/landing/ai-logos";
import { EngineMark, Md } from "@/components/ai-seo/kit";
import { CELL, CellGrid, LINE } from "@/components/landing/frame";
import { ENGINES, TIERS, getEngine, type EngineSlug } from "@/data/ai-seo/engines";
import { OVERVIEW, type SourceWellId } from "@/data/ai-seo/overview";
import { cn } from "@/lib/utils";

const MAP = OVERVIEW.sourceMap;

/* ---------- geometry, in viewBox units (1000 × 600) ---------- */

const VB_W = 1000;
const VB_H = 600;
/** Engine tiles end here (their right edge); lines start just past it. */
const ENGINE_X = 250;
/** Source tiles start here (their left edge); lines end just before it. */
const SOURCE_X = 675;
const ROW = 46;
const FRONTIER_Y0 = 54;
const MORE_Y0 = 318;
const WELL_Y0 = 72;
const WELL_Y1 = 528;
const STEP_MS = 2800;
/** The hairline between the two tiers, in the engine column. */
const DIVIDER_Y = 266;

const FRONTIER = ENGINES.filter((e) => e.tier === "frontier");
const MORE = ENGINES.filter((e) => e.tier === "more");

function engineY(slug: EngineSlug): number {
  const f = FRONTIER.findIndex((e) => e.slug === slug);
  if (f !== -1) return FRONTIER_Y0 + f * ROW;
  return MORE_Y0 + MORE.findIndex((e) => e.slug === slug) * ROW;
}

function wellY(id: SourceWellId): number {
  const i = MAP.wells.findIndex((w) => w.id === id);
  return WELL_Y0 + (i * (WELL_Y1 - WELL_Y0)) / (MAP.wells.length - 1);
}

function curve(y1: number, y2: number): string {
  const x1 = ENGINE_X + 10;
  const x2 = SOURCE_X - 10;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/* Every link, in engine order, with its path precomputed. */
const LINKS = MAP.engines.flatMap((e) =>
  e.links.map((l) => ({
    slug: e.slug,
    to: l.to,
    reported: !!l.reported,
    d: curve(engineY(e.slug), wellY(l.to)),
  })),
);

const ORDER = MAP.engines.map((e) => e.slug);

/* ---------- source icons (structural, not copy) ---------- */

const WELL_ICON: Record<SourceWellId, ComponentType<{ className?: string }>> = {
  "own-index": Database,
  google: GoogleMark,
  brave: Search,
  bing: BingMark,
  undisclosed: EyeOff,
  x: AtSign,
  browser: MousePointerClick,
};

function WellIcon({ id, lit }: { id: SourceWellId; lit?: boolean }) {
  const Icon = WELL_ICON[id];
  return (
    <span
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-300",
        lit ? "border-cta/25 bg-cta-soft text-cta" : "border-ink/[0.08] bg-white text-ink/60",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

const usersOf = (id: SourceWellId) => MAP.engines.filter((e) => e.links.some((l) => l.to === id));

/* ---------- the diagram (lg and up) ---------- */

function Diagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState<number | null>(null);
  const [pinned, setPinned] = useState<EngineSlug | null>(null);
  const [paused, setPaused] = useState(false);

  const playing = inView && !reduce && !paused && !pinned;

  /* Step through the engines while playing; reset to the still frame when
     the map leaves the screen. */
  useEffect(() => {
    if (!inView) {
      setStep(null);
      return;
    }
    if (!playing) return;
    const first = window.setTimeout(() => setStep((s) => s ?? 0), 500);
    const id = window.setInterval(() => setStep((s) => ((s ?? -1) + 1) % ORDER.length), STEP_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [inView, playing]);

  const active: EngineSlug | null = pinned ?? (step === null ? null : ORDER[step]);
  const activeData = active ? MAP.engines.find((e) => e.slug === active) : undefined;
  const lit = new Set(activeData?.links.map((l) => l.to) ?? []);
  const activeEngine = active ? getEngine(active) : undefined;

  return (
    <div ref={ref} className="hidden lg:block">
      <div className="mb-5 flex items-center justify-between gap-4 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <span>The engines</span>
        <Legend />
        <span>Where results come from</span>
      </div>

      <div className="relative aspect-[1000/600]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          {/* The tier divider, through the engine column only. */}
          <line
            x1={0}
            x2={ENGINE_X}
            y1={DIVIDER_Y}
            y2={DIVIDER_Y}
            className="stroke-ink/[0.08]"
            strokeWidth={1}
          />
          {LINKS.map((l) => {
            const on = active === l.slug;
            const dim = active !== null && !on;
            return (
              <path
                key={`${l.slug}-${l.to}`}
                d={l.d}
                fill="none"
                strokeWidth={on ? 2 : 1.25}
                strokeDasharray={l.reported ? "5 5" : undefined}
                strokeLinecap="round"
                className={cn(
                  "transition-[stroke,stroke-width] duration-500",
                  on ? "stroke-cta" : dim ? "stroke-ink/[0.07]" : "stroke-ink/[0.22]",
                )}
              />
            );
          })}
          {/* Endpoints. */}
          {LINKS.map((l) => (
            <circle
              key={`dot-${l.slug}-${l.to}`}
              cx={SOURCE_X - 10}
              cy={wellY(l.to)}
              r={3}
              className={cn(
                "transition-colors duration-500",
                active === l.slug ? "fill-cta" : "fill-ink/20",
              )}
            />
          ))}
          {ENGINES.map((e) => (
            <circle
              key={`edot-${e.slug}`}
              cx={ENGINE_X + 10}
              cy={engineY(e.slug)}
              r={3}
              className={cn(
                "transition-colors duration-500",
                active === e.slug ? "fill-cta" : "fill-ink/20",
              )}
            />
          ))}
          {/* The pulse: from each source back to the engine that asked. */}
          {playing &&
            active &&
            LINKS.filter((l) => l.slug === active).map((l) => (
              <motion.path
                key={`pulse-${l.slug}-${l.to}-${step}`}
                d={l.d}
                fill="none"
                strokeWidth={3.5}
                strokeLinecap="round"
                className="stroke-cta"
                /* A short drawn segment (motion's pathLength) slid from the
                   source end back to the engine (pathOffset 1 → 0). */
                initial={{ pathLength: 0.08, pathOffset: 1, opacity: 0 }}
                animate={{ pathOffset: -0.08, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.25 }}
              />
            ))}
        </svg>

        {/* Tier labels. */}
        <span
          className="absolute -translate-y-1/2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
          style={{ left: 0, top: pct(FRONTIER_Y0 - 32, VB_H) }}
        >
          {TIERS.frontier.label}
        </span>
        <span
          className="absolute -translate-y-1/2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
          style={{ left: 0, top: pct(MORE_Y0 - 30, VB_H) }}
        >
          {TIERS.more.label}
        </span>

        {/* Engines: links to their guides. */}
        {ENGINES.map((e) => {
          const on = active === e.slug;
          return (
            <Link
              key={e.slug}
              to="/ai-seo/$engine"
              params={{ engine: e.slug }}
              aria-label={`${e.name} SEO guide`}
              onMouseEnter={() => setPinned(e.slug)}
              onMouseLeave={() => setPinned(null)}
              onFocus={() => setPinned(e.slug)}
              onBlur={() => setPinned(null)}
              className={cn(
                "group absolute flex h-9 -translate-y-1/2 items-center gap-2.5 rounded-lg border py-1 pl-1 pr-3 transition-[background-color,border-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                on
                  ? "border-cta/30 bg-cta-soft text-cta shadow-[0_6px_18px_-10px_color-mix(in_oklab,var(--cta)_60%,transparent)]"
                  : "border-ink/[0.08] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-ink/[0.16]",
              )}
              style={{ right: pct(VB_W - ENGINE_X, VB_W), top: pct(engineY(e.slug), VB_H) }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/[0.06] bg-white">
                <EngineMark mark={e.mark} className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap text-[0.85rem] font-medium">{e.shortName}</span>
              <span
                className={cn(
                  "hidden whitespace-nowrap text-[0.75rem] xl:inline",
                  on ? "text-cta/70" : "text-muted-foreground",
                )}
              >
                {e.vendor}
              </span>
            </Link>
          );
        })}

        {/* Sources. */}
        {MAP.wells.map((w) => {
          const on = lit.has(w.id);
          const users = usersOf(w.id).length;
          return (
            <div
              key={w.id}
              className={cn(
                "absolute flex -translate-y-1/2 items-start gap-3 rounded-xl border bg-white px-3 py-2.5 transition-[border-color,box-shadow] duration-300",
                on
                  ? "border-cta/30 shadow-[0_8px_24px_-14px_color-mix(in_oklab,var(--cta)_55%,transparent)]"
                  : "border-ink/[0.08] shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
              )}
              style={{ left: pct(SOURCE_X, VB_W), right: 0, top: pct(wellY(w.id), VB_H) }}
            >
              <WellIcon id={w.id} lit={on} />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-[0.86rem] font-medium leading-tight transition-colors duration-300",
                    on ? "text-cta" : "text-ink",
                  )}
                >
                  {w.label}
                </p>
                <p className="mt-0.5 flex items-baseline gap-2 text-[0.76rem] text-muted-foreground">
                  <span className="min-w-0 flex-1 truncate">{w.detail}</span>
                  <span className="shrink-0 font-mono text-[0.68rem]">
                    {users} {users === 1 ? "engine" : "engines"}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* The caption: what the lit lines mean, or how to use the map. */}
      <div
        className={cn(
          "mt-6 flex min-h-[4.25rem] items-center justify-between gap-6 rounded-xl border px-4 py-3",
          LINE,
          activeEngine ? "bg-[color-mix(in_oklab,var(--cta-soft)_60%,white)]" : "bg-white",
        )}
      >
        {activeEngine && activeData ? (
          <>
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white">
                <EngineMark mark={activeEngine.mark} className="h-4.5 w-4.5" />
              </span>
              <p className="text-[0.92rem] leading-snug text-ink">
                <span className="font-semibold">{activeEngine.name}.</span>{" "}
                <span className="text-ink/75">
                  <Md text={activeData.note} />
                </span>
              </p>
            </div>
            <Link
              to="/ai-seo/$engine"
              params={{ engine: activeEngine.slug }}
              className="group inline-flex shrink-0 items-center gap-1.5 text-[0.85rem] font-semibold text-cta hover:text-cta-hover"
            >
              Read the guide
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </>
        ) : (
          <p className="text-[0.9rem] text-muted-foreground">
            Every line is one link between an engine and a source. Hover an engine to trace it.
          </p>
        )}
        {!reduce && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink/60 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
            aria-label={paused ? "Play the source map" : "Pause the source map"}
            aria-pressed={paused}
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* The same map in words, for screen readers. */}
      <ul className="sr-only">
        {MAP.engines.map((e) => {
          const engine = getEngine(e.slug);
          return (
            <li key={e.slug}>
              {engine?.name}:{" "}
              {e.links
                .map(
                  (l) =>
                    `${MAP.wells.find((w) => w.id === l.to)?.label}${l.reported ? " (reported)" : ""}`,
                )
                .join(", ")}
              . <Md text={e.note} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Legend({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-1.5 normal-case tracking-normal",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 text-[0.78rem] font-normal text-muted-foreground">
        <svg aria-hidden width="26" height="6" className="shrink-0">
          <line x1="1" x2="25" y1="3" y2="3" className="stroke-ink/40" strokeWidth="1.5" />
        </svg>
        {MAP.legend.documented}
      </span>
      <span className="inline-flex items-center gap-2 text-[0.78rem] font-normal text-muted-foreground">
        <svg aria-hidden width="26" height="6" className="shrink-0">
          <line
            x1="1"
            x2="25"
            y1="3"
            y2="3"
            className="stroke-ink/40"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
        {MAP.legend.reported}
      </span>
    </span>
  );
}

/* ---------- the list (below lg) ---------- */

function SourceList() {
  return (
    <div className="lg:hidden">
      <Legend className="mb-5" />
      <ul className="space-y-3">
        {MAP.wells.map((w) => (
          <li key={w.id} className={cn("rounded-xl border bg-white p-4", LINE)}>
            <div className="flex items-start gap-3">
              <WellIcon id={w.id} />
              <div className="min-w-0">
                <p className="text-[0.92rem] font-medium leading-tight text-ink">{w.label}</p>
                <p className="mt-0.5 text-[0.8rem] text-muted-foreground">{w.detail}</p>
              </div>
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {usersOf(w.id).map((u) => {
                const engine = getEngine(u.slug)!;
                const reported = u.links.find((l) => l.to === w.id)?.reported;
                return (
                  <li key={u.slug}>
                    <Link
                      to="/ai-seo/$engine"
                      params={{ engine: u.slug }}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-lg border bg-white py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-ink transition-colors hover:border-cta/40 hover:text-cta",
                        reported ? "border-dashed border-ink/25" : "border-ink/[0.1]",
                      )}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink/[0.03]">
                        <EngineMark mark={engine.mark} className="h-3.5 w-3.5" />
                      </span>
                      {engine.shortName}
                      {reported && (
                        <span className="text-[0.68rem] font-normal text-muted-foreground">
                          reported
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- what sits under every engine ---------- */

const LAYER_ICON = [Link2, BookOpen];

export function SourceLayers() {
  return (
    <CellGrid className="md:grid-cols-2">
      {MAP.layers.map((layer, i) => {
        const Icon = LAYER_ICON[i] ?? Link2;
        return (
          <li key={layer.title} className={cn(CELL, "p-6 sm:p-8 lg:px-10")}>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-[0.98rem] font-semibold tracking-tight text-ink">
                {layer.title}
              </h3>
            </div>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground [&_code]:text-[0.8rem]">
              <Md text={layer.body} />
            </p>
          </li>
        );
      })}
    </CellGrid>
  );
}

export function SourceMap() {
  return (
    <>
      <Diagram />
      <SourceList />
    </>
  );
}
