/**
 * The pieces around the ChatGPT guide's text: the fact strip under the hero,
 * the brief, headings, the working checklist, the FAQ, the sources, the side
 * offer, the way on to other guides, and the closing band.
 */
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, Layers, RotateCcw } from "lucide-react";
import { Band, CELL, CellGrid, GHOST_BUTTON, LINE, Pill, Spacer } from "@/components/landing/frame";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Reveal } from "@/components/landing/shared";
import { EngineMark, Md } from "@/components/ai-seo/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { ENGINES, type Engine } from "@/data/ai-seo/engines";
import type { ChecklistItem, EngineGuide, Faq, Source } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";

/* ---------- fact strip ---------- */

export function FactStrip({ guide }: { guide: EngineGuide }) {
  return (
    <Band>
      <CellGrid className="grid-cols-2 lg:grid-cols-4">
        {guide.facts.map((f) => (
          <li
            key={f.label}
            className={cn(
              CELL,
              "flex min-w-0 flex-col-reverse justify-end px-5 py-6 sm:px-8 sm:py-7",
            )}
          >
            <p className="mt-2 text-balance text-[0.8rem] leading-snug text-muted-foreground">
              {f.label}
            </p>
            <p
              className={cn(
                "flex min-h-[2.2rem] items-end tracking-[-0.02em] text-ink [overflow-wrap:anywhere]",
                f.mono
                  ? "font-mono text-[1.05rem] font-semibold text-cta sm:text-[1.15rem]"
                  : "font-display text-[1.7rem] font-medium sm:text-[1.9rem]",
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

/* ---------- headings ---------- */

export function Heading({
  id,
  kicker,
  children,
}: {
  id: string;
  /** The small numbered label above, e.g. "03". */
  kicker?: string;
  children: string;
}) {
  return (
    <div className="mt-16">
      {kicker && (
        <p className="font-mono text-[0.7rem] font-semibold tracking-[0.12em] text-cta">{kicker}</p>
      )}
      <h2
        id={id}
        className="group mt-2 scroll-mt-28 text-balance font-display text-[1.65rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2rem]"
      >
        {/* Hyphenated names (ChatGPT-User, OAI-SearchBot) stay whole. */}
        {children.split(/(\S+-\S+)/).map((part, i) =>
          i % 2 ? (
            <span key={i} className="whitespace-nowrap">
              {part}
            </span>
          ) : (
            part
          ),
        )}
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 text-[0.6em] text-transparent transition-colors hover:!text-cta focus-visible:text-cta group-hover:text-ink/25"
        >
          #
        </a>
      </h2>
    </div>
  );
}

/* ---------- the brief ---------- */

export function Brief({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="takeaways" className={cn("rounded-xl border bg-white", LINE)}>
      <h2
        id="takeaways"
        className={cn(
          "scroll-mt-28 border-b px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:px-6",
          LINE,
        )}
      >
        In brief
      </h2>
      <ol className="divide-y divide-ink/[0.06]">
        {items.map((t, i) => (
          <li key={t} className="flex gap-4 px-5 py-3.5 sm:px-6">
            <span className="shrink-0 font-mono text-[0.72rem] font-semibold leading-[1.9] tabular-nums text-cta">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.98rem] leading-relaxed text-ink/85">
              <Md text={t} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- checklist ---------- */

const IMPACT: Record<ChecklistItem["impact"], { label: string; className: string }> = {
  high: { label: "High impact", className: "bg-cta-soft text-cta" },
  medium: { label: "Medium", className: "bg-ink/[0.05] text-ink/65" },
  low: { label: "When you can", className: "bg-ink/[0.04] text-ink/50" },
};

/**
 * The fixes as a working list. Ticks live in this browser only: a convenience
 * for someone working through it over a few sittings, so every storage call
 * is guarded and the list works without it.
 */
export function WorkOrder({ items }: { items: ChecklistItem[] }) {
  const key = "rankbox.ai-seo.checklist.chatgpt";
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(key) ?? "null") as unknown;
      if (Array.isArray(saved)) setDone(saved.filter((x): x is string => typeof x === "string"));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const save = (next: string[]) => {
    setDone(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* storage unavailable: ticks still work for this visit */
    }
  };

  const count = items.filter((i) => done.includes(i.id)).length;

  return (
    <div className={cn("mt-8 overflow-hidden rounded-xl border bg-white", LINE)}>
      <div className={cn("flex items-center gap-4 border-b bg-ink/[0.02] px-5 py-3 sm:px-6", LINE)}>
        <p className="text-[0.82rem] font-medium text-ink" aria-live="polite">
          {count} of {items.length} done
        </p>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/[0.07]" aria-hidden>
          <div
            className="h-full rounded-full bg-cta transition-[width] duration-300"
            style={{ width: `${(count / items.length) * 100}%` }}
          />
        </div>
        {count > 0 && (
          <button
            type="button"
            onClick={() => save([])}
            className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-muted-foreground hover:text-ink"
          >
            <RotateCcw aria-hidden className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
      <ol className="divide-y divide-ink/[0.06]">
        {items.map((item, i) => {
          const checked = done.includes(item.id);
          const impact = IMPACT[item.impact];
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer gap-4 px-5 py-4 transition-colors hover:bg-ink/[0.015] sm:px-6">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    save(checked ? done.filter((d) => d !== item.id) : [...done, item.id])
                  }
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-cta/40",
                    checked ? "border-cta bg-cta text-white" : "border-ink/20 bg-white",
                  )}
                >
                  {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="shrink-0 font-mono text-[0.7rem] font-semibold tabular-nums text-ink/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-medium leading-snug",
                        checked ? "text-ink/45 line-through decoration-ink/25" : "text-ink",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
                        impact.className,
                      )}
                    >
                      {impact.label}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.92rem] leading-relaxed text-ink/70">
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

/* Open, in the server HTML: the crawlers this page is about don't click. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <dl className={cn("mt-8 divide-y overflow-hidden rounded-xl border bg-white", LINE)}>
      {faqs.map((f) => (
        <div key={f.q} className="px-5 py-5 sm:px-6">
          <dt className="font-display text-[1.08rem] font-medium leading-snug tracking-[-0.015em] text-ink">
            {f.q}
          </dt>
          <dd className="mt-2 text-[0.98rem] leading-relaxed text-ink/75">
            <Md text={f.a} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- sources ---------- */

function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function SourceGroup({
  title,
  sources,
  start,
}: {
  title: string;
  sources: Source[];
  start: number;
}) {
  return (
    <div>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <ol className="mt-3 space-y-2.5" start={start}>
        {sources.map((s, i) => (
          <li key={s.href} className="flex gap-3 text-[0.9rem] leading-snug">
            <span className="w-6 shrink-0 text-right font-mono text-[0.75rem] tabular-nums leading-[1.5] text-ink/35">
              {start + i}
            </span>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group min-w-0 [overflow-wrap:anywhere]"
            >
              <span className="font-medium text-ink decoration-cta/40 underline-offset-4 group-hover:text-cta group-hover:underline">
                {s.title}
              </span>
              <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">
                {s.publisher} · {hostOf(s.href)}
                <ArrowUpRight aria-hidden className="ml-0.5 inline h-3 w-3" />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* OpenAI's own word first, then everyone measuring it. */
export function SourceList({ sources }: { sources: Source[] }) {
  const vendor = sources.filter((s) => s.publisher.startsWith("OpenAI"));
  const rest = sources.filter((s) => !s.publisher.startsWith("OpenAI"));
  return (
    <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-8">
      <SourceGroup title="OpenAI documentation" sources={vendor} start={1} />
      <SourceGroup title="Studies and platform docs" sources={rest} start={vendor.length + 1} />
    </div>
  );
}

/* ---------- side offer ---------- */

/* What Rankbox does, and nothing it doesn't: no monitoring claim. */
export function RailOffer() {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]",
        LINE,
      )}
    >
      <p className="flex gap-3 font-display text-[1.02rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white">
          <EngineMark mark="ChatGPT" className="h-3.5 w-3.5" />
        </span>
        Publish the pages ChatGPT&rsquo;s searches land on
      </p>
      <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">
        Rankbox researches your buyers&rsquo; questions, writes source-backed answer pages, scores
        them, and publishes on a schedule.
      </p>
      <a
        href="/auth"
        className="group mt-4 flex h-10 items-center justify-center gap-2 rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover"
      >
        Start free trial
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
      <p className="mt-2.5 text-center text-[0.7rem] text-muted-foreground">{TRIAL_NOTE}</p>
    </div>
  );
}

/* ---------- onward ---------- */

/* Deeper reading on ChatGPT, then every other engine's guide — each one
   retrieves differently, so a reader working across engines goes on from here. */
export function Onward({ engine, guide }: { engine: Engine; guide: EngineGuide }) {
  const others = ENGINES.filter((e) => e.slug !== engine.slug);
  return (
    <section aria-labelledby="onward-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <div>
          <Pill icon={Layers}>Go deeper</Pill>
          <h2
            id="onward-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            More on ChatGPT, then the other engines
          </h2>
        </div>
        <Link to="/ai-seo" className={cn(GHOST_BUTTON, "group/btn shrink-0")}>
          Compare all engines
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
      {guide.furtherReading.length > 0 && (
        <Band>
          <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
            {guide.furtherReading.map((r) => (
              <li key={r.href} className={CELL}>
                <a
                  href={r.href}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-ink/[0.015]"
                >
                  <span className="font-medium leading-snug text-ink group-hover:text-cta">
                    {r.title}
                  </span>
                  <span className="mt-2 flex-1 text-[0.86rem] leading-relaxed text-muted-foreground">
                    {r.description}
                  </span>
                  <ArrowRight className="mt-4 h-4 w-4 text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:text-cta" />
                </a>
              </li>
            ))}
          </CellGrid>
        </Band>
      )}
      <Band>
        <nav aria-label="Other AI SEO guides">
          <CellGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {others.map((e) => (
              <li key={e.slug} className={CELL}>
                <Link
                  to="/ai-seo/$engine"
                  params={{ engine: e.slug }}
                  className="group flex h-full items-start gap-3 p-4 transition-colors hover:bg-ink/[0.015] sm:p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                    <EngineMark mark={e.mark} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.88rem] font-medium leading-snug text-ink group-hover:text-cta">
                      {e.shortName}
                    </span>
                    <span className="mt-0.5 hidden text-[0.76rem] leading-snug text-muted-foreground sm:block">
                      {e.tagline}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </CellGrid>
        </nav>
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
            <EngineMark mark="ChatGPT" className="h-5 w-5" />
          </span>
          <h2
            id="closing-title"
            className="mt-6 text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Be the official page ChatGPT&rsquo;s searches find
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Rankbox researches the questions your buyers ask, writes source-backed, answer-first
            articles, scores each one, and publishes them to your site on a schedule.
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
