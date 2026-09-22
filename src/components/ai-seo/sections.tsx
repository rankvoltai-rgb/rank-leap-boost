/**
 * An engine SEO guide is a sub-landing page and a long-form technical article
 * at once. The top of the page is landing (blue pixel hero, URL capture, a
 * spec band); the body is article (the blog's reading column, sticky table of
 * contents, reading progress) because that's what a guide is read as.
 *
 * The order is the order a practitioner needs things in: the answer → how the
 * engine picks sources → the crawlers to let in → what the page needs → what
 * gets cited → how to measure it → what to do, in order → questions.
 */
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, RotateCcw, Zap } from "lucide-react";
import { PixelField, CARD_PIXELS, UrlForm } from "@/components/landing/Hero";
import { Reveal } from "@/components/landing/shared";
import { ENGINES, type Engine, type EngineSlug } from "@/data/ai-seo/engines";
import type { ChecklistItem, EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { TRIAL_DAYS } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { CitationPreview } from "./preview";
import { EngineMark, EngineTile, Md } from "./kit";

/* ---------- engine switcher ---------- */

/**
 * The same five logos as the landing hero's "Cited across" badge: the current
 * engine opens out into a labelled pill, the others stay as tiles that lead to
 * their own guide. Switching engines is one click from the top of every guide.
 */
export function EngineSwitcher({ active, className }: { active?: EngineSlug; className?: string }) {
  return (
    <nav aria-label="SEO guides by answer engine" className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
        {ENGINES.map((e) => {
          if (e.slug === active) {
            return (
              <li key={e.slug}>
                <span
                  aria-current="page"
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3.5 text-sm font-semibold text-ink shadow-sm"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface">
                    <EngineMark mark={e.mark} className="h-4 w-4" />
                  </span>
                  {e.shortName} SEO guide
                </span>
              </li>
            );
          }
          return (
            <li key={e.slug}>
              <Link
                to="/ai-seo/$engine"
                params={{ engine: e.slug }}
                aria-label={`${e.name} SEO guide`}
                className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <EngineMark mark={e.mark} className="h-3.5 w-3.5" />
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[0.68rem] font-semibold text-white opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  {e.shortName}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- hero ---------- */

export function EngineHero({
  engine,
  guide,
  readingMinutes,
}: {
  engine: Engine;
  guide: EngineGuide;
  readingMinutes: number;
}) {
  const [url, setUrl] = useState("");
  return (
    <section
      id="top"
      aria-labelledby="guide-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] xl:gap-16">
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex justify-center lg:justify-start">
                <ol className="flex items-center gap-1.5 text-xs font-medium text-white/65">
                  <li>
                    <Link to="/" className="transition-colors hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li>
                    <Link to="/ai-seo" className="transition-colors hover:text-white">
                      AI SEO guides
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li aria-current="page" className="text-white">
                    {engine.shortName}
                  </li>
                </ol>
              </nav>
            </Reveal>

            <Reveal delay={0.05}>
              <EngineSwitcher active={engine.slug} className="mb-7" />
            </Reveal>

            <Reveal delay={0.1}>
              <h1
                id="guide-title"
                className="font-display text-balance text-[2.15rem] font-bold leading-[1.07] tracking-tight text-white sm:text-[3rem] xl:text-[3.35rem]"
              >
                <span className="lg:block">{guide.headline.lead}</span> {guide.headline.accent}
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                {guide.subhead}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.8rem] font-medium text-white/65 lg:justify-start">
                <span>
                  Updated{" "}
                  <time dateTime={engine.updated} className="text-white">
                    {formatDate(engine.updated)}
                  </time>
                </span>
                <span aria-hidden>·</span>
                <span>{readingMinutes} min read</span>
                <span aria-hidden>·</span>
                <a href="#sources" className="underline-offset-4 hover:text-white hover:underline">
                  {guide.sources.length} cited sources
                </a>
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                <UrlForm url={url} onChange={setUrl} />
                <p className="text-sm text-white/70">
                  See if {engine.shortName} cites you · Free {TRIAL_DAYS}-day trial
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:mx-0">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-12">
                <PixelField pixels={CARD_PIXELS} seed={7} />
              </div>
              <div className="relative">
                <CitationPreview engine={engine} preview={guide.preview} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- spec band ---------- */

export function FactBand({ engine, guide }: { engine: Engine; guide: EngineGuide }) {
  return (
    <section aria-label={`${engine.name} at a glance`} className="border-b border-border bg-card">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4 md:py-12">
        {guide.facts.map((f, i) => (
          <div
            key={f.label}
            className={cn(
              // Reversed so the value reads first while the <dt> stays first in
              // the markup; justify-end pins both to the top, and the value box
              // has a fixed height, so values share a baseline even when a
              // label wraps or a value is set in the smaller mono face.
              "flex min-w-0 flex-col-reverse justify-end px-3 text-center md:px-6",
              i % 2 === 1 && "border-l border-border",
              i > 0 && "md:border-l md:border-border",
            )}
          >
            <dt className="mt-1.5 text-balance text-sm leading-snug text-muted-foreground">
              {f.label}
            </dt>
            <dd
              className={cn(
                "flex min-h-[2.25rem] items-end justify-center font-semibold [overflow-wrap:anywhere] tracking-tight text-ink sm:min-h-[2.6rem]",
                f.mono
                  ? "font-mono text-[1.02rem] sm:text-[1.15rem]"
                  : "font-display text-2xl sm:text-[1.75rem]",
              )}
            >
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- headings ---------- */

export function GuideHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="group relative mt-16 scroll-mt-28 font-display text-[1.6rem] font-bold leading-tight tracking-tight text-ink sm:text-[1.9rem]"
    >
      {children}
      <a
        href={`#${id}`}
        aria-label="Link to this section"
        className="ml-2 inline-flex translate-y-[-0.1em] align-middle text-[0.7em] text-muted-foreground/0 transition-colors hover:!text-volt focus-visible:text-volt group-hover:text-muted-foreground"
      >
        #
      </a>
    </h2>
  );
}

/* ---------- the short answer + takeaways ---------- */

/* Set first and large: an answer engine summarising "how do I rank in X"
   quotes the first self-contained paragraph that answers it. */
export function ShortAnswer({ text }: { text: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-volt/25 bg-volt/[0.05] p-6 sm:p-7">
      <span className="absolute inset-y-0 left-0 w-1 bg-volt" aria-hidden />
      <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-volt">
        <Zap className="h-3.5 w-3.5 fill-current" aria-hidden />
        The short answer
      </p>
      <p className="mt-3 text-[1.1rem] font-medium leading-[1.7] text-ink sm:text-[1.18rem]">
        <Md text={text} />
      </p>
    </div>
  );
}

export function Takeaways({ id, items }: { id: string; items: string[] }) {
  return (
    <section
      aria-labelledby={id}
      className="relative mt-12 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 volt-glow" aria-hidden />
      <div className="relative">
        <h2
          id={id}
          className="scroll-mt-28 font-display text-[1.3rem] font-bold tracking-tight text-ink"
        >
          Key takeaways
        </h2>
        <ul className="mt-5 space-y-3.5">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.3rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-volt text-white">
                <Check className="h-3 w-3" strokeWidth={3.5} aria-hidden />
              </span>
              <span className="text-[1rem] leading-relaxed text-ink/85 sm:text-[1.05rem]">
                <Md text={item} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- checklist ---------- */

const IMPACT: Record<ChecklistItem["impact"], { label: string; className: string }> = {
  high: { label: "High impact", className: "bg-volt/12 text-volt" },
  medium: { label: "Medium impact", className: "bg-secondary text-ink/70" },
  low: { label: "Nice to have", className: "bg-secondary text-muted-foreground" },
};

/**
 * The guide's steps as a working checklist. Ticks are kept in this browser
 * only — a convenience for someone working through it over a few sittings,
 * nothing the page depends on — so every read and write is guarded.
 */
export function Checklist({ slug, items }: { slug: EngineSlug; items: ChecklistItem[] }) {
  const storageKey = `rankbox.ai-seo.checklist.${slug}`;
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const saved = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(saved)) setDone(saved.filter((id) => typeof id === "string"));
    } catch {
      /* storage unavailable: start empty */
    }
  }, [storageKey]);

  const save = (next: string[]) => {
    setDone(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* storage unavailable: the ticks still work for this visit */
    }
  };

  const toggle = (id: string) =>
    save(done.includes(id) ? done.filter((d) => d !== id) : [...done, id]);
  const count = items.filter((i) => done.includes(i.id)).length;
  const pct = Math.round((count / items.length) * 100);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-2">
      <div className="flex items-center gap-4 border-b border-border bg-surface/60 px-5 py-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-ink">
              <span aria-live="polite">
                {count} of {items.length} done
              </span>
            </p>
            {count > 0 && (
              <button
                type="button"
                onClick={() => save([])}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-ink"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                Reset
              </button>
            )}
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Checklist progress"
          >
            <div
              className="h-full rounded-full bg-volt transition-[width] duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
      <ol className="divide-y divide-border">
        {items.map((item, i) => {
          const checked = done.includes(item.id);
          const impact = IMPACT[item.impact];
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer gap-4 px-5 py-4 transition-colors hover:bg-surface/50 sm:px-6">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(item.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-volt peer-focus-visible:ring-offset-2",
                    checked ? "border-volt bg-volt text-white" : "border-border bg-card",
                  )}
                >
                  {checked && <Check className="h-3 w-3" strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="font-mono text-[0.72rem] font-semibold text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-semibold leading-snug transition-colors",
                        checked
                          ? "text-muted-foreground line-through decoration-ink/30"
                          : "text-ink",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
                        impact.className,
                      )}
                    >
                      {impact.label}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[0.93rem] leading-relaxed text-ink/70">
                    <Md text={item.detail} />
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- FAQ ---------- */

/* Every answer is in the page's HTML, open — not behind an accordion that
   only renders on click — because the crawlers this page is about don't
   click, and most of them don't run JavaScript either. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mt-7 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-1">
      {faqs.map((f) => (
        <div key={f.q} className="p-5 sm:p-6">
          <h3 className="flex gap-3 font-display text-[1.08rem] font-semibold leading-snug tracking-tight text-ink">
            <span
              aria-hidden
              className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink text-[0.7rem] font-bold text-background"
            >
              Q
            </span>
            {f.q}
          </h3>
          <p className="mt-2.5 pl-9 text-[1rem] leading-relaxed text-ink/80">
            <Md text={f.a} />
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------- sources ---------- */

function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function SourceList({ id, sources }: { id: string; sources: Source[] }) {
  return (
    <section aria-labelledby={id} className="mt-16 border-t border-border pt-10">
      <h2
        id={id}
        className="scroll-mt-28 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      >
        Sources
      </h2>
      <ol className="mt-5 space-y-3">
        {sources.map((s, i) => (
          <li key={s.href} className="flex gap-3 text-[0.9rem] leading-relaxed">
            <span className="w-5 shrink-0 text-right font-semibold tabular-nums text-muted-foreground">
              {i + 1}.
            </span>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="group min-w-0">
              <span className="font-medium text-ink decoration-ink/30 underline-offset-4 group-hover:underline">
                {s.title}
              </span>
              <span className="ml-2 text-muted-foreground">
                {s.publisher} · {hostOf(s.href)} ↗
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- other guides ---------- */

export function GuideCard({ engine, className }: { engine: Engine; className?: string }) {
  return (
    <Link
      to="/ai-seo/$engine"
      params={{ engine: engine.slug }}
      style={{ "--engine": engine.accent } as CSSProperties}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-1 transition-all hover:-translate-y-1 hover:border-ink/15 hover:shadow-3",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-(--engine) transition-transform duration-300 group-hover:scale-x-100"
      />
      <EngineTile engine={engine} className="h-11 w-11" />
      <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {engine.vendor}
      </p>
      <h3 className="mt-1 text-balance font-display text-lg font-semibold tracking-tight text-ink">
        {engine.name} SEO
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{engine.tagline}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        Read the guide
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function OtherGuides({ current, guide }: { current: Engine; guide: EngineGuide }) {
  const others = ENGINES.filter((e) => e.slug !== current.slug);
  return (
    <section aria-labelledby="other-guides-title" className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="other-guides-title"
              className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              Your buyers use more than {current.shortName}
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Each engine retrieves differently. The guides below cover what changes — and what
              doesn&rsquo;t.
            </p>
          </div>
          <Link
            to="/ai-seo"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
          >
            Compare all five engines
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.05} className="h-full">
              <GuideCard engine={e} />
            </Reveal>
          ))}
        </div>

        {guide.furtherReading.length > 0 && (
          <div className="mt-14">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Go deeper
            </p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {guide.furtherReading.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-ink/20"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug text-ink">{r.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {r.description}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
