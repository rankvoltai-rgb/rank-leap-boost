/**
 * The /use-cases/ai-built-websites sections below the hero, in the landing's
 * frame. Every word comes from the page's data file
 * (src/data/persona-pages/ai-built-websites.ts); the labels here are
 * structural. Nothing below animates: the hero's visual is the one thing that
 * moves on this page.
 */
import type { ComponentType, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  Check,
  CircleAlert,
  Compass,
  FileCode2,
  GitBranch,
  HelpCircle,
  KeyRound,
  Layers,
  Minus,
  MessageSquareText,
  Plug,
  Plus,
  ScanSearch,
  Scale,
  Tag,
  Wrench,
} from "lucide-react";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  Spacer,
} from "@/components/landing/frame";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import { Mark } from "@/components/brand/Mark";
import { getAiTool } from "@/data/ai-integrations";
import type { Connector } from "@/data/connectors";
import { getFeature } from "@/data/features";
import { personasIn, type Persona } from "@/data/personas";
import { PLAN, TRIAL_CTA, TRIAL_NOTE, formatUsd } from "@/data/pricing";
import { BUILDER_TOOL_IDS, page } from "@/data/persona-pages/ai-built-websites";
import { cn } from "@/lib/utils";
import { CODE, SOLID_BUTTON, TITLE } from "./tokens";

type Icon = ComponentType<{ className?: string }>;

/* A section's heading block, flush left: pill, title, and the intro beside it
   on wide screens. */
function Head({
  id,
  icon,
  pill,
  title,
  intro,
  children,
}: {
  id: string;
  icon: Icon;
  pill: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Band inner="px-5 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-12">
        <div>
          <Pill icon={icon}>{pill}</Pill>
          <h2 id={id} className={cn(TITLE, "mt-5 max-w-xl text-balance")}>
            {title}
          </h2>
        </div>
        {(intro || children) && (
          <div>
            {intro && (
              <p className="max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.04rem]">
                {intro}
              </p>
            )}
            {children}
          </div>
        )}
      </div>
    </Band>
  );
}

/* ---------- Check this first: rendering ---------- */

const STATE_TONES = [
  { chip: "bg-[#fdf4e4] text-[#b45309]", icon: CircleAlert },
  { chip: "bg-cta-soft text-cta", icon: Layers },
  { chip: "bg-success/12 text-success", icon: Check },
] as const;

/* What each build hands a crawler, drawn as the body of the HTML. */
function RenderSketch({ index }: { index: number }) {
  const line = (indent: number, children: ReactNode) => (
    <span className="block truncate" style={{ paddingLeft: `${indent * 0.8}rem` }}>
      {children}
    </span>
  );
  const t = (v: string) => <span className={CODE.tag}>{v}</span>;
  const bar = (w: string) => (
    <span
      className="inline-block h-1.5 rounded-full bg-ink/[0.1] align-middle"
      style={{ width: w }}
    />
  );
  return (
    <div
      aria-hidden
      className="rounded-lg border border-ink/[0.07] bg-white px-3 py-2.5 font-mono text-[0.64rem] leading-[1.35rem] shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      {line(0, t("<body>"))}
      {index === 0 && (
        <>
          {line(
            1,
            <>
              {t("<div")}
              <span className={CODE.attr}> id=</span>
              <span className={CODE.text}>&quot;root&quot;</span>
              {t("></div>")}
            </>,
          )}
          {line(1, <span className={CODE.dim}>&nbsp;</span>)}
          {line(1, <span className={CODE.dim}>&nbsp;</span>)}
        </>
      )}
      {index === 1 && (
        <>
          {line(1, <>{t("<article>")}</>)}
          {line(
            2,
            <>
              {t("<h1>")} {bar("4.5rem")} {t("</h1>")}
            </>,
          )}
          {line(
            2,
            <>
              {t("<p>")} {bar("6rem")}
            </>,
          )}
        </>
      )}
      {index === 2 && (
        <>
          {line(1, <>{t("<article>")}</>)}
          {line(
            2,
            <>
              {t("<h1>")} {bar("4.5rem")} {t("</h1>")}
            </>,
          )}
          {line(
            2,
            <>
              {t("<p>")} {bar("7rem")} {t("</p>")}
            </>,
          )}
        </>
      )}
      {line(0, t("</body>"))}
    </div>
  );
}

export function AiBuiltRendering() {
  const r = page.rendering;
  return (
    <section aria-labelledby="rendering-title">
      <Spacer />
      <Head
        id="rendering-title"
        icon={ScanSearch}
        pill={r.eyebrow}
        title={
          <>
            {r.title} <Accent>{r.accent}</Accent>
          </>
        }
        intro={r.intro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] lg:grid-cols-3">
          {r.modes.map((m, i) => {
            const tone = STATE_TONES[i];
            const StateIcon = tone.icon;
            return (
              <li
                key={m.name}
                className={cn(CELL, "flex flex-col gap-4 px-6 py-7 sm:px-8 lg:py-9")}
              >
                <RenderSketch index={i} />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-[1.12rem] font-medium tracking-[-0.015em] text-ink">
                    {m.name}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.68rem] font-semibold",
                      tone.chip,
                    )}
                  >
                    <StateIcon className="h-3 w-3" />
                    {m.state}
                  </span>
                </div>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground">{m.body}</p>
                <p className="mt-auto text-[0.72rem] text-ink/45">{m.source}</p>
              </li>
            );
          })}
        </CellGrid>
      </Band>
      <Band inner={cn("px-5 py-7 sm:px-10 lg:px-12", PANEL)}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="flex max-w-2xl gap-3 text-[0.95rem] leading-relaxed text-ink/80">
            <Wrench aria-hidden className="mt-1 h-4 w-4 shrink-0 text-brand-blue" />
            <span>{r.limit}</span>
          </p>
          <Link
            to="/tools/$slug"
            params={{ slug: r.tool.slug }}
            className={cn(GHOST_BUTTON, "group/btn w-fit shrink-0 py-2 text-[0.84rem]")}
          >
            {r.tool.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </Band>
    </section>
  );
}

/* ---------- What the builder didn't build ---------- */

export function AiBuiltPains({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="pains-title">
      <Spacer />
      <Head
        id="pains-title"
        icon={GitBranch}
        pill="After launch"
        title={persona.painsTitle}
        intro={persona.painsIntro}
      />
      <Band>
        <div
          aria-hidden
          className={cn(
            "hidden grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] border-b text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:grid",
            LINE,
          )}
        >
          <span className="px-6 py-3" />
          <span className={cn("border-l px-8 py-3", LINE)}>Where it stalls</span>
          <span className={cn("border-l px-8 py-3", LINE)}>What Rankbox adds</span>
        </div>
        <ol className="overflow-hidden">
          {persona.pains.map((p, i) => (
            <li
              key={p.pain}
              className={cn(
                "-mb-px grid grid-cols-[minmax(0,1fr)] border-b lg:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)]",
                LINE,
              )}
            >
              <span className="px-6 pt-6 font-mono text-[0.78rem] tabular-nums text-ink/35 sm:px-10 lg:px-6 lg:py-7">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className={cn(
                  "px-6 pt-2 text-[1rem] font-medium leading-snug text-ink sm:px-10 lg:border-l lg:px-8 lg:py-7",
                  LINE,
                )}
              >
                {p.pain}
              </p>
              <p
                className={cn(
                  "flex gap-2.5 px-6 pb-6 pt-3 text-[0.94rem] leading-relaxed text-muted-foreground sm:px-10 lg:border-l lg:bg-[color-mix(in_oklab,var(--cta-soft)_45%,white)] lg:px-8 lg:py-7",
                  LINE,
                )}
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta text-white"
                >
                  <Mark className="h-3 w-3" />
                </span>
                <span>{p.fix}</span>
              </p>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- Inside your tools: MCP and the API ---------- */

export function AiBuiltTools() {
  const b = page.builder;
  const tools = BUILDER_TOOL_IDS.map((id) => getAiTool(id)).filter(
    (t): t is Connector => t !== undefined,
  );
  return (
    <section aria-labelledby="tools-title">
      <Spacer />
      <Head
        id="tools-title"
        icon={Plug}
        pill={b.eyebrow}
        title={
          <>
            {b.title} <Accent>{b.accent}</Accent>
          </>
        }
        intro={b.intro}
      />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
          {/* MCP */}
          <div
            className={cn(
              "flex flex-col border-b px-6 py-9 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12",
              LINE,
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                <MessageSquareText className="h-4 w-4" />
              </span>
              <h3 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                {b.mcp.title}
              </h3>
            </div>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              {b.mcp.body}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {tools.map((t) => (
                <li key={t.id}>
                  <Link
                    to="/integrations/$slug"
                    params={{ slug: t.id }}
                    className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.18]"
                  >
                    <span aria-hidden>
                      <ConnectorLogo connector={t} className="h-6 w-6" />
                    </span>
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/integrations"
                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[0.8rem] font-medium text-brand-blue hover:underline"
                >
                  {b.mcp.all}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>

            <ul className="mt-6 space-y-2">
              {b.mcp.prompts.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2.5 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-3 py-2.5 text-[0.84rem] leading-snug text-ink/80"
                >
                  <span aria-hidden className="mt-px font-mono text-[0.78rem] text-brand-blue">
                    &gt;
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.82rem] leading-relaxed text-muted-foreground">
              {b.mcp.note}
            </p>
          </div>

          {/* API */}
          <div className="flex flex-col px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                <Braces className="h-4 w-4" />
              </span>
              <h3 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                {b.api.title}
              </h3>
            </div>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              {b.api.body}
            </p>

            <pre
              aria-label="Sample request for finished articles"
              className="mt-6 overflow-x-auto rounded-lg border border-ink/[0.07] bg-white px-3.5 py-3 font-mono text-[0.68rem] leading-[1.35rem] text-ink/75 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              {b.api.snippet.map((l, i) => (
                <span key={i} className={cn("block", i === 0 && CODE.dim)}>
                  {l}
                </span>
              ))}
            </pre>

            <p className="mt-5 flex gap-2.5 rounded-lg bg-[#fdf4e4] px-3.5 py-3 text-[0.84rem] leading-relaxed text-[#7c3a06]">
              <KeyRound aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              {b.api.note}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/integrations/$slug"
                params={{ slug: "api" }}
                className={cn(GHOST_BUTTON, "group/btn")}
              >
                <FileCode2 className="h-3.5 w-3.5" />
                {b.api.page}
              </Link>
              <a href="/docs/publishing/custom-sites" className={cn(GHOST_BUTTON, "group/btn")}>
                <BookOpen className="h-3.5 w-3.5" />
                {b.api.docs}
              </a>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Two places, four steps ---------- */

/* The lanes, in the order the steps first visit them. */
function lanesOf(persona: Persona): string[] {
  return [...new Set(persona.steps.map((s) => s.when))];
}

export function AiBuiltLanes({ persona }: { persona: Persona }) {
  const lanes = lanesOf(persona);
  const n = persona.steps.length;
  /* The path between the step cards, in a 0–100 box over the step columns:
     each card's centre, joined with right angles. */
  const points = persona.steps.map((s, i) => ({
    x: ((i + 0.5) / n) * 100,
    y: ((lanes.indexOf(s.when) + 0.5) / lanes.length) * 100,
  }));
  const path = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const mid = (prev.x + p.x) / 2;
      return `H ${mid} V ${p.y} H ${p.x}`;
    })
    .join(" ");

  return (
    <section aria-labelledby="lanes-title">
      <Spacer />
      <Head
        id="lanes-title"
        icon={Compass}
        pill="How it fits"
        title={persona.workflowTitle}
        intro={persona.workflowIntro}
      />
      <Band>
        {/* Wide: two lanes, the steps placed on the lane they happen in. */}
        <div className="hidden lg:grid lg:grid-cols-[10.5rem_minmax(0,1fr)]">
          <div
            className={cn("grid border-r", LINE)}
            style={{ gridTemplateRows: `repeat(${lanes.length}, minmax(0, 1fr))` }}
          >
            {lanes.map((l, i) => (
              <p
                key={l}
                className={cn(
                  "flex items-center px-6 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
                  i > 0 && "border-t",
                  LINE,
                )}
              >
                {l}
              </p>
            ))}
          </div>
          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {lanes.slice(1).map((l, i) => (
                <span
                  key={l}
                  className={cn("absolute inset-x-0 border-t", LINE)}
                  style={{ top: `${((i + 1) / lanes.length) * 100}%` }}
                />
              ))}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <path
                  d={path}
                  fill="none"
                  stroke="var(--cta)"
                  strokeOpacity={0.45}
                  strokeWidth={1.5}
                  strokeDasharray="4 5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <ol
              className="relative grid"
              style={{
                gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${lanes.length}, minmax(0, 1fr))`,
              }}
            >
              {persona.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="flex items-center px-3 py-6 xl:px-4"
                  style={{ gridColumn: i + 1, gridRow: lanes.indexOf(s.when) + 1 }}
                >
                  <div className="w-full rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_14px_30px_-22px_rgba(16,24,40,0.3)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta text-[0.7rem] font-semibold text-white">
                      {i + 1}
                    </span>
                    <h3 className="mt-3 font-display text-[1.02rem] font-medium leading-snug tracking-[-0.01em] text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Narrow: one column, each step tagged with its lane. */}
        <ol className="px-5 py-8 sm:px-10 lg:hidden">
          {persona.steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-4 pb-7 last:pb-0">
              {i < n - 1 && (
                <span
                  aria-hidden
                  className="absolute left-3 top-7 h-[calc(100%-1.5rem)] border-l border-dashed border-cta/40"
                />
              )}
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta text-[0.7rem] font-semibold text-white">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {s.when}
                </p>
                <h3 className="mt-1 font-display text-[1.05rem] font-medium leading-snug text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 break-words text-[0.9rem] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- Who does what ---------- */

export function AiBuiltHandoff({ persona }: { persona: Persona }) {
  const { runsTitle, runs, keepsTitle, keeps } = persona.handoff;
  const column = (title: string, lines: typeof runs, ours: boolean) => (
    <div className="px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
      <h3
        className={cn(
          "flex items-center gap-2 text-[0.74rem] font-semibold uppercase tracking-[0.14em]",
          ours ? "text-brand-blue" : "text-ink",
        )}
      >
        <span aria-hidden>
          {ours ? <Mark className="h-3.5 w-3.5" /> : <Wrench className="h-3.5 w-3.5" />}
        </span>
        {title}
      </h3>
      <ul className="mt-6 space-y-5">
        {lines.map((l) => (
          <li key={l.label} className="flex gap-3">
            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
                ours ? "bg-cta-soft text-cta" : "border border-ink/[0.1] bg-white text-ink/60",
              )}
            >
              {ours ? (
                <Check className="h-3 w-3" strokeWidth={2.6} />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[0.98rem] font-medium text-ink">{l.label}</p>
              <p className="mt-0.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                {l.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section aria-labelledby="handoff-title">
      <Spacer />
      <Head
        id="handoff-title"
        icon={Scale}
        pill="Who does what"
        title={
          <>
            {page.handoffTitle} <Accent>{page.handoffAccent}</Accent>
          </>
        }
      />
      <Band>
        <div className="relative grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
          {column(runsTitle, runs, true)}
          <div className={cn("border-t lg:border-l lg:border-t-0", LINE, PANEL)}>
            {column(keepsTitle, keeps, false)}
          </div>
          {/* The seam between the two, echoing the hero's two views. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.1] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.06),0_8px_18px_-10px_rgba(16,24,40,0.3)] lg:flex"
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The four features ---------- */

export function AiBuiltPicks({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="picks-title">
      <Spacer />
      <Head
        id="picks-title"
        icon={Tag}
        pill="Features"
        title={persona.picksTitle}
        intro={persona.picksIntro}
      />
      <Band>
        <ul className="overflow-hidden">
          {persona.picks.map((p) => {
            const f = getFeature(p.featureSlug);
            if (!f) return null;
            const FIcon = f.icon;
            return (
              <li key={p.featureSlug} className={cn("-mb-px border-b", LINE)}>
                <Link
                  to="/features/$slug"
                  params={{ slug: f.slug }}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-2 px-6 py-6 transition-colors hover:bg-[color-mix(in_oklab,var(--cta-soft)_40%,white)] sm:px-10 lg:grid-cols-[17rem_minmax(0,1fr)_auto] lg:px-12"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                      <FIcon className="h-4 w-4" />
                    </span>
                    <span className="font-display text-[1.08rem] font-medium tracking-[-0.015em] text-ink">
                      {f.name}
                    </span>
                  </span>
                  <span className="col-span-2 row-start-2 text-[0.92rem] leading-relaxed text-muted-foreground lg:col-span-1 lg:row-start-auto">
                    {p.why}
                  </span>
                  <ArrowUpRight className="col-start-2 row-start-1 h-4 w-4 text-ink/40 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue lg:col-start-auto lg:row-start-auto" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

/* ---------- What it replaces, and the price ---------- */

export function AiBuiltStackPrice({ persona }: { persona: Persona }) {
  const pr = page.price;
  return (
    <section aria-labelledby="stack-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Layers}>What it replaces</Pill>
            <h2 id="stack-title" className={cn(TITLE, "mt-5 max-w-lg text-balance")}>
              {persona.stackTitle}
            </h2>
            <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-muted-foreground">
              {persona.stackIntro}
            </p>
            <ul className={cn("mt-8 divide-y border-y", LINE)}>
              {persona.stack.map((s) => (
                <li
                  key={s.label}
                  className={cn(
                    "grid gap-1 py-3.5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-5",
                    LINE,
                  )}
                >
                  <span className="flex items-center gap-2 text-[0.94rem] font-medium text-ink">
                    <Minus aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink/35" />
                    {s.label}
                  </span>
                  <span className="pl-[1.375rem] text-[0.88rem] leading-relaxed text-muted-foreground sm:pl-0">
                    {s.detail}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-lg text-[0.9rem] leading-relaxed text-ink/75">
              {persona.stackNote}
            </p>
          </div>

          {/* The price, from pricing.ts. */}
          <div
            id="pricing"
            className={cn(
              "flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14",
              PANEL,
            )}
          >
            <div className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-30px_rgba(16,24,40,0.3)] sm:p-8">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {PLAN.name} · {pr.title}
              </p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-[2.9rem] font-medium leading-none tracking-[-0.04em] text-ink">
                  {formatUsd(PLAN.monthly)}
                </span>
                <span className="text-[0.9rem] text-muted-foreground">{pr.per}</span>
              </p>
              <ul className="mt-6 space-y-2.5">
                {pr.includes.map((x) => (
                  <li key={x} className="flex gap-2.5 text-[0.9rem] leading-snug text-ink/80">
                    <Check
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue"
                      strokeWidth={2.4}
                    />
                    {x}
                  </li>
                ))}
              </ul>
              {pr.studio && (
                <p
                  className={cn(
                    "mt-6 border-t pt-4 text-[0.84rem] leading-relaxed text-muted-foreground",
                    LINE,
                  )}
                >
                  {pr.studio}
                </p>
              )}
              <a href="/auth" className={cn(SOLID_BUTTON, "mt-6 w-full")}>
                {TRIAL_CTA}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p className="mt-3 text-center text-[0.78rem] text-muted-foreground">{TRIAL_NOTE}</p>
              <p className="mt-4 text-center">
                <Link
                  to="/pricing"
                  className="text-[0.84rem] font-medium text-brand-blue hover:underline"
                >
                  {pr.pricing}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Questions ---------- */

export function AiBuiltFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <Pill icon={HelpCircle}>FAQ</Pill>
              <h2 id="faq-title" className={cn(TITLE, "mt-5 text-balance")}>
                {page.faqTitle}
              </h2>
              <a href="/docs" className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
                {page.faqDocs}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </div>
          </div>
          {/* Native disclosure: every answer is in the server HTML. */}
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            {persona.faqs.map((f, i) => (
              <details
                key={f.q}
                open={i === 0}
                className={cn("group border-b last:border-b-0", LINE)}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 [&::-webkit-details-marker]:hidden">
                  <h3>{f.q}</h3>
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[background-color,color,border-color] duration-300 group-open:border-brand-blue group-open:bg-brand-blue group-open:text-white"
                  >
                    <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-45" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-5 pr-10 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Sources ---------- */

export function AiBuiltSources() {
  return (
    <section aria-labelledby="sources-title">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="sources-title"
            className="font-display text-[1.35rem] font-medium tracking-[-0.02em] text-ink sm:text-[1.5rem]"
          >
            {page.sourcesTitle}
          </h2>
          <p className="text-[0.84rem] text-muted-foreground">{page.sourcesIntro}</p>
        </div>
      </Band>
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-3">
          {page.sources.map((s) => (
            <li key={s.href} className={cn(CELL, "flex flex-col gap-2 px-6 py-6 sm:px-8")}>
              <p className="text-[0.72rem] font-medium text-muted-foreground">
                {s.publisher} · {s.date}
              </p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-start gap-1 text-[0.98rem] font-medium leading-snug text-ink hover:text-brand-blue"
              >
                {s.title}
                <ArrowUpRight
                  aria-hidden
                  className="mt-1 h-3.5 w-3.5 shrink-0 text-ink/35 group-hover:text-brand-blue"
                />
              </a>
              <p className="text-[0.86rem] leading-relaxed text-muted-foreground">{s.fact}</p>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- The other situations ---------- */

export function AiBuiltOthers({ persona }: { persona: Persona }) {
  const others = personasIn(persona.group).filter((p) => p.slug !== persona.slug);
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="px-6 pt-10 pb-2 sm:px-10 lg:px-12">
        <h2
          id="others-title"
          className="font-display text-[1.35rem] font-medium tracking-[-0.02em] text-ink sm:text-[1.5rem]"
        >
          {page.othersTitle}
        </h2>
      </Band>
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2">
          {others.map((p) => {
            const PIcon = p.icon;
            return (
              <li key={p.slug} className={CELL}>
                <Link
                  to="/use-cases/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full items-start gap-4 px-6 py-7 transition-colors hover:bg-[color-mix(in_oklab,var(--cta-soft)_40%,white)] sm:px-10 lg:px-12"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                    <PIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[1.05rem] font-medium tracking-[-0.015em] text-ink">
                      Rankbox for {p.nameLower}
                    </span>
                    <span className="mt-1 block text-[0.88rem] leading-relaxed text-muted-foreground">
                      {p.tagline}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink/35 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                </Link>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* The landing's closing band: --cta blue inside the rails, white type and a
   white button. Behind it, faint tags of the article a crawler can read. */
export function AiBuiltCTA({ persona }: { persona: Persona }) {
  const Icon = persona.icon;
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 select-none overflow-hidden font-mono text-[0.8rem] leading-[1.9rem] text-white/[0.07] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,transparent_25%,#000_80%)]"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i} className="whitespace-nowrap" style={{ paddingLeft: `${(i % 4) * 2.5}rem` }}>
              {"<article> <h1>…</h1> <p>…</p> <h2>…</h2> <p>…</p> </article> ".repeat(4)}
            </p>
          ))}
        </div>
        <div className="relative px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)]">
            <Icon className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <h2
            id="cta-title"
            className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
          >
            {persona.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            {persona.ctaBody}
          </p>
          <a
            href="/auth"
            className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            {TRIAL_CTA}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
