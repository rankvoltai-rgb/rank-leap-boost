/**
 * The body of /use-cases/losing-traffic-to-ai-overviews, in the landing
 * page's frame. Each section is set for a reader looking at a falling clicks
 * line: the studies as dated, linked evidence cards; the pains as symptoms
 * and what changes; the first month as a track that says who does each step;
 * the handoff ending on where the result is measured; the stack beside what
 * it doesn't replace; a price block of its own; and the questions laid open,
 * every answer in the server HTML. All copy is the page's data file.
 */
import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Check,
  Clock3,
  CornerDownRight,
  Gauge,
  Handshake,
  HelpCircle,
  Info,
  Layers,
  LineChart,
  Minus,
  Quote,
  Search,
  Send,
  Sparkles,
  ShieldCheck,
  SquarePen,
  Stethoscope,
  Tag,
  User,
  Wrench,
  X,
} from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { getFeature } from "@/data/features";
import { crossLinks } from "@/data/link-graph";
import { page } from "@/data/persona-pages/losing-traffic-to-ai-overviews";
import type { Persona } from "@/data/personas";
import { TRIAL_CTA } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { exploreExclude } from "./explore";
import { RUNS_TINT, SOLID_BUTTON } from "./tokens";

type Icon = ComponentType<{ className?: string }>;

/** A title with its last `words` words set in the blue accent. */
function Accented({ text, words }: { text: string; words: number }) {
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

/** A figure with its unit in the accent: "58" and a blue "%". */
function Figure({ value }: { value: string }) {
  const m = value.match(/^([\d.,]+)(.*)$/);
  if (!m) return <>{value}</>;
  return (
    <>
      {m[1]}
      <span className="text-brand-blue">{m[2]}</span>
    </>
  );
}

const H2 =
  "font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]";

/* ---------- What the studies say ---------- */

export function LosingTrafficEvidence() {
  const E = page.evidence;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={BarChart3}
        eyebrow={E.eyebrow}
        title={<Accented text={E.title} words={E.accentWords} />}
        subtitle={E.intro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] lg:grid-cols-3">
          {E.studies.map((s) => (
            <li key={s.source} className={cn(CELL, "flex flex-col px-6 py-9 sm:px-10 lg:px-9")}>
              <p className="font-display text-[3.1rem] font-medium leading-none tracking-[-0.045em] text-ink sm:text-[3.5rem]">
                <Figure value={s.figure} />
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/80">{s.claim}</p>
              <div className={cn("mt-auto border-t pt-5", LINE, "mt-7")}>
                <p className="text-[0.86rem] font-semibold text-ink">
                  {s.source} <span className="font-normal text-muted-foreground">· {s.date}</span>
                </p>
                <p className="mt-1 text-[0.78rem] leading-snug text-muted-foreground">{s.sample}</p>
                {"caveat" in s && s.caveat && (
                  <p className="mt-2 flex gap-1.5 text-[0.78rem] leading-snug text-muted-foreground">
                    <Info aria-hidden className="mt-px h-3.5 w-3.5 shrink-0" />
                    {s.caveat}
                  </p>
                )}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(GHOST_BUTTON, "mt-5")}
                >
                  Read the study
                  <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                </a>
              </div>
            </li>
          ))}
        </CellGrid>
      </Band>
      <Band inner={cn("px-6 py-4 sm:px-10 lg:px-12", PANEL)}>
        <p className="flex gap-2 text-[0.84rem] leading-relaxed text-muted-foreground">
          <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink/50" />
          {E.note}
        </p>
      </Band>
    </section>
  );
}

/* ---------- Pains, as symptoms ---------- */

export function LosingTrafficPains({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Stethoscope}
        eyebrow={page.heads.pains}
        title={<Accented text={persona.painsTitle} words={2} />}
        subtitle={persona.painsIntro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] md:grid-cols-2">
          {persona.pains.map((p, i) => (
            <li key={p.pain} className={cn(CELL, "row-span-2 grid grid-rows-subgrid")}>
              <div className="px-6 pb-6 pt-8 sm:px-10 lg:px-12 lg:pt-10">
                <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Symptom {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-balance font-display text-[1.2rem] font-medium leading-snug tracking-[-0.015em] text-ink sm:text-[1.3rem]">
                  {p.pain}
                </h3>
              </div>
              <div
                className={cn(
                  "border-t border-dashed px-6 pb-8 pt-5 sm:px-10 lg:px-12 lg:pb-10",
                  LINE,
                  RUNS_TINT,
                )}
              >
                <p className="flex items-center gap-1.5 text-[0.74rem] font-semibold text-cta">
                  <CornerDownRight aria-hidden className="h-3.5 w-3.5" />
                  What changes
                </p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/85">{p.fix}</p>
              </div>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- The parts aimed at the overview ---------- */

export function LosingTrafficPicks({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="lt-picks">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <Pill icon={Quote}>{page.heads.picks}</Pill>
              <h2 id="lt-picks" className={cn("mt-5 text-balance", H2)}>
                <Accented text={persona.picksTitle} words={2} />
              </h2>
              <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">
                {persona.picksIntro}
              </p>
            </div>
          </div>
          <ul className="divide-y divide-ink/[0.07]">
            {persona.picks.map((pick, i) => {
              const feature = getFeature(pick.featureSlug);
              if (!feature) return null;
              const FeatureIcon = feature.icon;
              return (
                <li key={pick.featureSlug}>
                  <Link
                    to="/features/$slug"
                    params={{ slug: pick.featureSlug }}
                    className="group flex gap-4 px-6 py-7 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:gap-5 sm:px-10 lg:px-12 lg:py-8"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                      <FeatureIcon className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[0.68rem] tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[1.02rem] font-semibold tracking-tight text-ink">
                          {feature.name}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[0.92rem] leading-relaxed text-muted-foreground">
                        {pick.why}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The first month, with who does each step ---------- */

function Owner({ who }: { who: "You" | "Rankbox" }) {
  if (who === "Rankbox") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-cta px-1.5 py-0.5 text-[0.66rem] font-semibold text-white">
        <Mark className="h-3 w-3" />
        Rankbox
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-ink/[0.1] bg-white px-1.5 py-0.5 text-[0.66rem] font-semibold text-ink">
      <User aria-hidden className="h-3 w-3" />
      You
    </span>
  );
}

export function LosingTrafficMonth({ persona }: { persona: Persona }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={CalendarRange}
        eyebrow={page.heads.workflow}
        title={<Accented text={persona.workflowTitle} words={2} />}
        subtitle={persona.workflowIntro}
      />
      <Band>
        <CellGrid className="grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4">
          {persona.steps.map((s, i) => {
            const who = page.stepOwners[i] ?? "Rankbox";
            return (
              <li key={s.title} className={cn(CELL, "relative flex flex-col")}>
                {/* The track: blue where Rankbox works, grey where you do. */}
                <span
                  aria-hidden
                  className={cn("h-1 w-full", who === "Rankbox" ? "bg-cta" : "bg-ink/[0.09]")}
                />
                <div className="flex flex-1 flex-col px-6 pb-8 pt-6 sm:px-8 lg:px-7 lg:pb-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.72rem] font-medium text-muted-foreground">
                      {s.when}
                    </span>
                    <Owner who={who} />
                  </div>
                  <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Who does what, ending on where it's measured ---------- */

const RUN_ICONS: Icon[] = [Search, SquarePen, Gauge, Send];
const KEEP_ICONS: Icon[] = [LineChart, ShieldCheck, Quote, Wrench];

function Line({
  icon: LineIcon,
  label,
  detail,
  solid,
}: {
  icon: Icon;
  label: string;
  detail: string;
  solid: boolean;
}) {
  return (
    <li className="flex gap-3.5">
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          solid
            ? "bg-cta text-white"
            : "border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        )}
      >
        <LineIcon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.98rem] font-semibold tracking-tight text-ink">{label}</span>
        <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-muted-foreground">
          {detail}
        </span>
      </span>
    </li>
  );
}

export function LosingTrafficHandoff({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  const H = page.heads.handoff;
  const M = page.measure;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Handshake}
        eyebrow={H.eyebrow}
        title={
          <>
            {H.title} <Accent>{H.accent}</Accent>
          </>
        }
        subtitle={H.intro}
      />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12",
              LINE,
              RUNS_TINT,
            )}
          >
            <h3 className="flex items-center gap-2.5 text-[1.1rem] font-semibold tracking-tight text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta text-white">
                <Mark className="h-3.5 w-3.5" />
              </span>
              {handoff.runsTitle}
            </h3>
            <ul className="mt-7 space-y-6">
              {handoff.runs.map((r, i) => (
                <Line
                  key={r.label}
                  icon={RUN_ICONS[i % RUN_ICONS.length]}
                  label={r.label}
                  detail={r.detail}
                  solid
                />
              ))}
            </ul>
          </div>

          <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
            <h3 className="flex items-center gap-2.5 text-[1.1rem] font-semibold tracking-tight text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink">
                <User aria-hidden className="h-3.5 w-3.5" />
              </span>
              {handoff.keepsTitle}
            </h3>
            <ul className="mt-7 space-y-6">
              {handoff.keeps.map((k, i) => (
                <Line
                  key={k.label}
                  icon={KEEP_ICONS[i % KEEP_ICONS.length]}
                  label={k.label}
                  detail={k.detail}
                  solid={false}
                />
              ))}
            </ul>

            {/* Where the result is read, since Rankbox doesn't read it. */}
            <div className="mt-9 overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <p className="flex items-center gap-2 border-b border-ink/[0.07] px-4 py-2.5 text-[0.76rem] font-semibold text-ink">
                <LineChart aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
                {M.title}
              </p>
              <ul className="divide-y divide-ink/[0.07]">
                {M.items.map((item) => {
                  const body = (
                    <>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.86rem] font-semibold text-ink">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-[0.78rem] leading-snug text-muted-foreground">
                          {item.detail}
                        </span>
                      </span>
                      {"href" in item && (
                        <ArrowUpRight
                          aria-hidden
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                        />
                      )}
                    </>
                  );
                  const row = "group flex gap-3 px-4 py-3";
                  if (!("href" in item)) {
                    return (
                      <li key={item.label} className={row}>
                        {body}
                      </li>
                    );
                  }
                  const external = item.href.startsWith("http");
                  return (
                    <li key={item.label}>
                      {external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            row,
                            "transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40",
                          )}
                        >
                          {body}
                        </a>
                      ) : (
                        <Link
                          to={item.href as string}
                          className={cn(
                            row,
                            "transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40",
                          )}
                        >
                          {body}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The stack, beside what it doesn't replace ---------- */

export function LosingTrafficStack({ persona }: { persona: Persona }) {
  const L = page.limits;
  return (
    <section aria-labelledby="lt-stack">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Layers}>{page.heads.stack}</Pill>
            <h2 id="lt-stack" className={cn("mt-5 max-w-lg text-balance", H2)}>
              <Accented text={persona.stackTitle} words={3} />
            </h2>
            <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-muted-foreground">
              {persona.stackIntro}
            </p>
            <ul className={cn("mt-8 divide-y border-y", LINE, "divide-ink/[0.07]")}>
              {persona.stack.map((s) => (
                <li key={s.label} className="flex items-start gap-3.5 py-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft text-cta">
                    <Check aria-hidden className="h-3 w-3" strokeWidth={2.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.96rem] font-semibold tracking-tight text-ink">
                      {s.label}
                    </span>
                    <span className="mt-0.5 block text-[0.86rem] leading-relaxed text-muted-foreground">
                      {s.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn("flex flex-col px-6 py-10 sm:px-10 lg:px-12 lg:py-14", PANEL)}>
            <h3 className="text-[1.1rem] font-semibold tracking-tight text-ink">{L.title}</h3>
            <ul className="mt-6 space-y-3.5">
              {L.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.94rem] text-ink/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-ink/[0.1] bg-white text-ink/55">
                    <X aria-hidden className="h-3 w-3" strokeWidth={2.6} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[0.86rem] leading-relaxed text-muted-foreground">
              {persona.stackNote}
            </p>

            {/* For the pages already on the site, which Rankbox doesn't touch. */}
            <Link
              to={L.tool.href as string}
              className="group mt-8 flex gap-3.5 rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-brand-blue/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 lg:mt-auto"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                <Quote aria-hidden className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9rem] font-semibold text-ink">{L.tool.label}</span>
                <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted-foreground">
                  {L.tool.detail}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-brand-blue"
              />
            </Link>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The price, from pricing.ts ---------- */

export function LosingTrafficPrice() {
  const P = page.price;
  return (
    <section aria-labelledby="lt-price">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Tag}>{P.eyebrow}</Pill>
            <h2 id="lt-price" className={cn("mt-5", H2)}>
              {P.title}
            </h2>
            <p className="mt-7 flex items-baseline gap-2">
              <span className="font-display text-[3.4rem] font-medium leading-none tracking-[-0.045em] text-ink">
                {P.amount}
              </span>
              <span className="text-[0.95rem] text-muted-foreground">{P.per}</span>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="/auth" className={SOLID_BUTTON}>
                {TRIAL_CTA}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link to="/pricing" className={GHOST_BUTTON}>
                See pricing
              </Link>
            </div>
            <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{P.note}</p>
            <p className="mt-1 text-[0.82rem] text-muted-foreground">{P.trial}</p>
          </div>

          <div className="flex flex-col px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <p className="text-[0.76rem] font-medium text-muted-foreground">
              Every site&rsquo;s plan
            </p>
            <ul className="mt-4 space-y-3">
              {P.includes.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[0.96rem] text-ink">
                  <Check
                    aria-hidden
                    className="mt-1 h-4 w-4 shrink-0 text-brand-blue"
                    strokeWidth={2.6}
                  />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex gap-2.5 text-[0.86rem] leading-relaxed text-muted-foreground">
              <Clock3 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink/45" />
              {P.rollingOut}
            </p>
            <p
              className={cn(
                "mt-6 flex gap-2.5 border-t pt-6 text-[0.86rem] leading-relaxed text-ink/80 lg:mt-auto",
                LINE,
              )}
            >
              <Layers aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              {P.studio}
            </p>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ, laid open ---------- */

export function LosingTrafficFAQ({ persona }: { persona: Persona }) {
  // Further reading, less anything the Keep exploring block below already shows.
  const explore = crossLinks(`/use-cases/${persona.slug}`, exploreExclude(persona));
  const shown = new Set([...(explore?.cards ?? []), ...(explore?.terms ?? [])].map((c) => c.href));
  const reading = page.reading.items.filter((r) => !shown.has(r.href));

  return (
    <section id="faq" aria-labelledby="lt-faq" className="scroll-mt-16">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
        <Pill icon={HelpCircle}>FAQ</Pill>
        <h2 id="lt-faq" className={cn("mt-5", H2)}>
          <Accented text={page.faqTitle} words={2} />
        </h2>
      </Band>
      <Band>
        <dl>
          {persona.faqs.map((f, i) => (
            <div
              key={f.q}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)] gap-2 px-6 py-7 sm:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:px-12 lg:py-8",
                i > 0 && "border-t",
                LINE,
              )}
            >
              <dt className="flex gap-3 text-[1rem] font-semibold leading-snug tracking-tight text-ink">
                <Minus
                  aria-hidden
                  className="mt-1 hidden h-3.5 w-3.5 shrink-0 text-brand-blue lg:block"
                />
                {f.q}
              </dt>
              <dd className="text-[0.94rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
      {reading.length > 0 && (
        <Band inner={cn("px-6 py-7 sm:px-10 lg:px-12", PANEL)}>
          <h3 className="text-[0.86rem] font-semibold text-ink">{page.reading.title}</h3>
          <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-1 md:grid-cols-2">
            {reading.map((r) => (
              <li key={r.href}>
                <Link
                  to={r.href as string}
                  className="group inline-flex items-start gap-2 py-1.5 text-[0.9rem] text-ink/80 transition-colors hover:text-brand-blue"
                >
                  <ArrowRight
                    aria-hidden
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-blue transition-transform group-hover:translate-x-0.5"
                  />
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </Band>
      )}
    </section>
  );
}

/* ---------- Closing ---------- */

/* Faint results-page lines behind the closing band: an overview block above
   three links, drawn in white. */
function ClosingSketch() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex h-[9.5rem] max-w-xl flex-col gap-3 px-6 opacity-[0.3] [mask-image:linear-gradient(180deg,#000_15%,transparent_95%)]"
    >
      <div className="space-y-1.5 rounded-xl border border-white/80 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-white" />
          <div className="h-1.5 w-16 rounded-full bg-white" />
        </div>
        <div className="h-1.5 w-[92%] rounded-full bg-white/70" />
        <div className="h-1.5 w-[78%] rounded-full bg-white/70" />
      </div>
      {[0.7, 0.55, 0.62].map((w) => (
        <div key={w} className="space-y-1.5">
          <div className="h-2 rounded-full bg-white" style={{ width: `${w * 100}%` }} />
          <div className="h-1.5 w-[85%] rounded-full bg-white/60" />
        </div>
      ))}
    </div>
  );
}

export function LosingTrafficCTA({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="lt-cta">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <ClosingSketch />
        <div className="relative px-5 pb-44 pt-16 text-center sm:px-8 sm:pb-48 sm:pt-20">
          <h2
            id="lt-cta"
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
          <p className="mt-3 text-[0.82rem] text-white">{page.price.note}</p>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
