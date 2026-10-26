/**
 * The Google guide's page furniture, drawn in the landing page's frame: the
 * hero, the spec band, the figure band, the reading column's pieces, and the
 * bands that close the page (FAQ, sources, the other guides, the offer).
 */
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  HelpCircle,
  Layers,
  ListChecks,
  Plus,
  Zap,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  Pill,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { EngineMark, Md } from "@/components/ai-seo/kit";
import { EngineRail } from "@/components/ai-seo/engine-rail";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { ENGINES, type Engine } from "@/data/ai-seo/engines";
import type { ChecklistItem, EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/* ---------- hero ---------- */

export function Hero({
  engine,
  guide,
  minutes,
  meta,
}: {
  engine: Engine;
  guide: EngineGuide;
  minutes: number;
  /** Share buttons, beside the dates. */
  meta?: ReactNode;
}) {
  return (
    <header id="top" className="relative scroll-mt-16 bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="px-5 pb-10 pt-7 motion-safe:animate-hero-rise sm:px-10 sm:pb-12 lg:px-12 lg:pb-14 lg:pt-9">
          <EngineRail active={guide.slug} />

          <nav aria-label="Breadcrumb" className="mt-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-muted-foreground">
              <li>
                <Link to="/ai-seo" className="py-2 transition-colors hover:text-ink">
                  AI SEO guides
                </Link>
              </li>
              <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
              <li className="font-medium text-cta">{engine.name}</li>
            </ol>
          </nav>

          <h1 className="mt-4 max-w-[58rem] text-balance font-display text-[2.1rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink min-[420px]:text-[2.4rem] sm:text-[3rem] lg:text-[3.4rem]">
            {guide.headline.lead} <Accent>{guide.headline.accent}</Accent>
          </h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
            <div className="flex flex-col">
              <p className="text-[1.05rem] leading-relaxed text-muted-foreground sm:text-[1.12rem]">
                {guide.subhead}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
                  <span className="font-medium text-ink">Updated {formatDate(engine.updated)}</span>
                  <span aria-hidden> · </span>
                  {minutes} min read
                  <span aria-hidden> · </span>
                  {guide.sources.length} sources
                </p>
                {meta}
              </div>
            </div>

            <div className="relative rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.25)] sm:p-6">
              <span
                aria-hidden
                className="absolute inset-y-5 left-0 w-[3px] rounded-r-full bg-cta"
              />
              <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cta">
                <Zap aria-hidden className="h-3.5 w-3.5" />
                The short answer
              </p>
              <p className="mt-3 text-[1rem] leading-[1.75] text-ink sm:text-[1.04rem]">
                <Md text={guide.shortAnswer} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- figure band ---------- */

export function FigureBand({ children }: { children: ReactNode }) {
  return <Band inner={cn("px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12", PANEL)}>{children}</Band>;
}

/* ---------- spec band ---------- */

export function FactBand({ facts }: { facts: EngineGuide["facts"] }) {
  return (
    <Band>
      <CellGrid className="grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <li key={f.label} className={cn(CELL, "flex flex-col justify-between gap-3 p-5 sm:p-6")}>
            <p className="text-[0.7rem] font-medium uppercase leading-snug tracking-[0.12em] text-muted-foreground">
              {f.label}
            </p>
            <p
              className={cn(
                "text-ink",
                f.mono
                  ? "font-mono text-[1.15rem] font-semibold sm:text-[1.3rem]"
                  : "font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] sm:text-[1.75rem]",
              )}
            >
              {f.value}
            </p>
          </li>
        ))}
      </CellGrid>
    </Band>
  );
}

/* ---------- reading column ---------- */

export function SectionHeading({
  id,
  index,
  children,
}: {
  id: string;
  index: number;
  children: ReactNode;
}) {
  return (
    <div className="mt-16 sm:mt-20">
      <div aria-hidden className="flex items-center gap-3">
        <span className="font-mono text-[0.72rem] font-semibold text-cta">
          {String(index).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-ink/[0.07]" />
      </div>
      <h2
        id={id}
        className="mt-4 scroll-mt-28 text-balance font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.95rem]"
      >
        {children}
      </h2>
    </div>
  );
}

export function Takeaways({ id, items }: { id: string; items: string[] }) {
  return (
    <section aria-labelledby={id} className="rounded-xl border border-ink/[0.08] bg-white">
      <h2
        id={id}
        className={cn(
          "scroll-mt-28 border-b px-5 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:px-6",
          LINE,
        )}
      >
        What to know first
      </h2>
      <ul className="divide-y divide-ink/[0.06]">
        {items.map((t) => (
          <li
            key={t}
            className="flex gap-3 px-5 py-3.5 text-[0.98rem] leading-relaxed text-ink/85 sm:px-6"
          >
            <Check
              aria-hidden
              className="mt-[0.3rem] h-4 w-4 shrink-0 text-cta"
              strokeWidth={2.5}
            />
            <span className="min-w-0">
              <Md text={t} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const IMPACT: Record<ChecklistItem["impact"], { label: string; className: string }> = {
  high: { label: "High impact", className: "bg-cta-soft text-cta" },
  medium: { label: "Medium", className: "bg-ink/[0.05] text-ink/70" },
  low: { label: "Low", className: "bg-ink/[0.04] text-muted-foreground" },
};

/* The checklist as a runbook: in order, tickable, with progress kept in this
   browser only. Storage can fail (private windows, blocked site data), so
   every read and write is guarded and the list works without it. */
export function Runbook({ slug, items }: { slug: string; items: ChecklistItem[] }) {
  const storageKey = `rankbox.ai-seo.checklist.${slug}`;
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const saved = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(saved)) {
        const ids = new Set(items.map((i) => i.id));
        setDone(saved.filter((id): id is string => typeof id === "string" && ids.has(id)));
      }
    } catch {
      /* storage unavailable: start empty */
    }
  }, [storageKey, items]);

  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
    setDone(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* the ticks still work for this visit */
    }
  };

  return (
    <div className="mt-7 overflow-hidden rounded-xl border border-ink/[0.09] bg-white">
      <div
        className={cn(
          "flex items-center justify-between gap-4 border-b px-5 py-3 text-[0.78rem] text-muted-foreground",
          LINE,
          PANEL,
        )}
      >
        <span>
          <span className="font-semibold text-ink">{done.length}</span> of {items.length} done
        </span>
        <span aria-hidden className="h-1.5 w-28 overflow-hidden rounded-full bg-ink/[0.08]">
          <span
            className="block h-full rounded-full bg-cta transition-[width] duration-300"
            style={{ width: `${(done.length / items.length) * 100}%` }}
          />
        </span>
      </div>
      <ol className="divide-y divide-ink/[0.06]">
        {items.map((c, i) => {
          const on = done.includes(c.id);
          const impact = IMPACT[c.impact];
          return (
            <li key={c.id} id={`step-${c.id}`} className="flex gap-3.5 px-5 py-4">
              <button
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={on}
                aria-label={`Mark "${c.title}" as ${on ? "not done" : "done"}`}
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                  on
                    ? "border-cta bg-cta text-white"
                    : "border-ink/20 bg-white hover:border-cta/50",
                )}
              >
                {on && <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="grid items-start gap-x-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <p
                    className={cn(
                      "font-medium leading-snug transition-colors",
                      on ? "text-muted-foreground line-through decoration-ink/25" : "text-ink",
                    )}
                  >
                    <span className="mr-2 font-mono text-[0.75rem] text-ink/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {plainText(c.title)}
                  </p>
                  <span
                    className={cn(
                      "mt-1.5 justify-self-start whitespace-nowrap rounded-full px-2 py-0.5 text-[0.64rem] font-semibold sm:mt-0.5",
                      impact.className,
                    )}
                  >
                    {impact.label}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink/70">
                  <Md text={c.detail} />
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function FurtherReading({ items }: { items: EngineGuide["furtherReading"] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Go deeper
      </p>
      <ul className="mt-3 grid gap-px overflow-hidden rounded-xl border border-ink/[0.08] bg-ink/[0.07] sm:grid-cols-2">
        {items.map((r) => (
          <li key={r.href} className="bg-white">
            <Link
              to={r.href}
              className="group flex h-full flex-col p-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)]"
            >
              <span className="flex items-start justify-between gap-3 font-medium leading-snug text-ink">
                {r.title}
                <ArrowUpRight
                  aria-hidden
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40 transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-cta"
                />
              </span>
              <span className="mt-1 text-[0.84rem] leading-relaxed text-muted-foreground">
                {r.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* The side rail's offer. Only what Rankbox ships: research, writing,
   scoring and scheduled publishing. */
export function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-cta">
        <Layers aria-hidden className="h-4 w-4" />
      </span>
      <p className="mt-4 font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        Cover the sub-questions, on a schedule
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
        Rankbox researches the questions your buyers ask, writes source-backed articles for them,
        scores each one and publishes on your schedule.
      </p>
      <a
        href="/auth"
        className="group mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover"
      >
        Start free trial
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
      <p className="mt-2.5 text-center text-[0.7rem] text-muted-foreground">{TRIAL_NOTE}</p>
    </div>
  );
}

/* ---------- FAQ band ---------- */

export function FaqBand({ faqs, title }: { faqs: Faq[]; title: string }) {
  return (
    <section aria-labelledby="faq" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "flex flex-col border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2
              id="faq"
              className="mt-5 scroll-mt-28 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              {plainText(title)}
            </h2>
          </div>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="divide-y divide-ink/[0.07]"
            >
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {plainText(f.q)}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        <Plus aria-hidden className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  {/* Force-mounted: every answer is in the server HTML, to
                      match the FAQPage schema the route emits. */}
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-[0.94rem] leading-relaxed text-muted-foreground"
                  >
                    <Md text={f.a} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- sources band ---------- */

function isGoogle(href: string) {
  try {
    const host = new URL(href).hostname;
    return host === "blog.google" || host.endsWith(".google.com") || host === "google.com";
  } catch {
    return false;
  }
}

function host(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function SourceColumn({
  title,
  sources,
  start,
  split = false,
}: {
  title: string;
  sources: Source[];
  start: number;
  /** Flow the list into two columns on wide screens. */
  split?: boolean;
}) {
  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title} <span className="text-ink/40">· {sources.length}</span>
      </p>
      <ol className={cn("mt-4", split && "lg:columns-2 lg:gap-x-10")} start={start}>
        {sources.map((s, i) => (
          <li key={s.href} className="flex break-inside-avoid gap-3 pb-3.5">
            <span className="w-6 shrink-0 pt-0.5 text-right font-mono text-[0.72rem] text-ink/35">
              {start + i}
            </span>
            <div className="min-w-0">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline text-[0.9rem] font-medium leading-snug text-ink decoration-cta/40 underline-offset-[3px] transition-colors hover:text-cta hover:underline"
              >
                {/* The no-break space keeps the arrow on the title's last line. */}
                {plainText(s.title)}
                {"\u00a0"}
                <ArrowUpRight
                  aria-hidden
                  className="inline h-3 w-3 -translate-y-px text-ink/35 group-hover:text-cta"
                />
              </a>
              <p className="mt-0.5 text-[0.76rem] text-muted-foreground">
                {s.publisher} · {host(s.href)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SourcesBand({ sources }: { sources: Source[] }) {
  const google = sources.filter((s) => isGoogle(s.href));
  const other = sources.filter((s) => !isGoogle(s.href));
  return (
    <section aria-labelledby="sources" className="scroll-mt-16">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <Pill icon={BookOpen}>Sources</Pill>
        <h2
          id="sources"
          className="mt-4 scroll-mt-28 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          Google&rsquo;s word first, <Accent>then the data</Accent>
        </h2>
      </Band>
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <SourceColumn
            title="Google's documentation and announcements"
            sources={google}
            start={1}
            split
          />
          <div className={cn("border-t lg:border-l lg:border-t-0", LINE)}>
            <SourceColumn
              title="Independent studies and regulators"
              sources={other}
              start={google.length + 1}
            />
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- the other guides ---------- */

export function OtherGuidesBand({ current }: { current: Engine }) {
  const others = ENGINES.filter((e) => e.slug !== current.slug);
  return (
    <section aria-labelledby="other-guides">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <div>
          <Pill icon={Compass}>More engines</Pill>
          <h2
            id="other-guides"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            The same question, asked elsewhere
          </h2>
        </div>
        <Link
          to="/ai-seo"
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.18]"
        >
          All AI SEO guides
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-5">
          {others.map((e) => (
            <li key={e.slug} className={CELL}>
              <Link
                to="/ai-seo/$engine"
                params={{ engine: e.slug }}
                className="group flex h-full items-start gap-3 p-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  <EngineMark mark={e.mark} className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-medium text-ink group-hover:text-cta">
                    {e.shortName}
                  </span>
                  <span className="mt-0.5 block text-[0.76rem] leading-snug text-muted-foreground">
                    {e.tagline}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- closing band ---------- */

export function ClosingBand() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="closing-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-[0_1px_2px_rgba(4,24,72,0.2)]">
            <ListChecks aria-hidden className="h-5 w-5 text-cta" />
          </span>
          <h2
            id="closing-title"
            className="mt-6 text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Publish the answers Google fans out to
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Rankbox researches the questions your buyers ask, writes a source-backed article for
            each, scores it before it ships and publishes on your schedule.
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <UrlForm url={url} onChange={setUrl} />
            <p className="text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </div>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
