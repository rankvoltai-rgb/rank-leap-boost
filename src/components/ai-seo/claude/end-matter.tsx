/**
 * Everything after the reading column: the questions (answers always open, so
 * they're in the server HTML that crawlers and the FAQPage schema read), the
 * sources, the other engines' guides, and the closing band.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpenCheck, HelpCircle } from "lucide-react";
import { EngineMark, Md } from "@/components/ai-seo/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  Pill,
  Spacer,
} from "@/components/landing/frame";
import { MarkDither } from "@/components/landing/hero-dither";
import { UrlForm } from "@/components/landing/Hero";
import { ENGINES, type Engine } from "@/data/ai-seo/engines";
import type { Faq, Source } from "@/data/ai-seo/types";
import { formatDate } from "@/lib/format-date";
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/* ---------- questions ---------- */

export function FaqBand({ faqs, engine }: { faqs: Faq[]; engine: Engine }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div
            className={cn(
              "border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-28">
              <Pill icon={HelpCircle}>FAQ</Pill>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
              >
                What site owners ask about <Accent>{engine.name}</Accent>
              </h2>
            </div>
          </div>
          <dl className="divide-y divide-ink/[0.07] [&_code]:whitespace-nowrap px-5 py-2 sm:px-10 lg:px-12 lg:py-6">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-display text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                  {plainText(f.q)}
                </dt>
                <dd className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-ink/70">
                  <Md text={f.a} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}

/* ---------- sources ---------- */

function host(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function SourcesBand({ sources, checked }: { sources: Source[]; checked: string }) {
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-5 py-9 sm:px-10 lg:px-12">
        <div>
          <Pill icon={BookOpenCheck}>Sources</Pill>
          <h2
            id="sources-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Every claim, <Accent>back to its source</Accent>
          </h2>
        </div>
        <p className="text-[0.85rem] text-muted-foreground">
          Last checked <span className="font-medium text-ink">{formatDate(checked)}</span>
        </p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s, i) => (
            <li key={s.href} className={CELL}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full gap-3 px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-6"
              >
                <span className="w-5 shrink-0 pt-px text-right text-[0.78rem] font-semibold tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.88rem] font-medium leading-snug text-ink group-hover:text-cta">
                    {s.title}
                  </span>
                  <span className="mt-1 block text-[0.75rem] text-muted-foreground">
                    {s.publisher}
                    <span className="mx-1.5 text-ink/20">/</span>
                    {host(s.href)}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-cta"
                />
              </a>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- the other engines ---------- */

export function OtherEngines({ current }: { current: Engine }) {
  const others = ENGINES.filter((e) => e.tier === current.tier && e.slug !== current.slug);
  return (
    <section aria-labelledby="other-engines-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-5 py-8 sm:px-10 lg:px-12">
        <h2
          id="other-engines-title"
          className="font-display text-[1.45rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.7rem]"
        >
          The same question, <Accent>other engines</Accent>
        </h2>
        <Link to="/ai-seo" className={cn(GHOST_BUTTON, "group/btn shrink-0")}>
          All {ENGINES.length} guides
          <ArrowRight
            aria-hidden
            className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5"
          />
        </Link>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {others.map((e) => (
            <li key={e.slug} className={CELL}>
              <Link
                to="/ai-seo/$engine"
                params={{ engine: e.slug }}
                className="group flex h-full flex-col gap-3 p-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-6"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white">
                    <EngineMark mark={e.mark} className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-ink group-hover:text-cta">{e.name}</span>
                </span>
                <span className="text-[0.85rem] leading-relaxed text-muted-foreground">
                  {e.tagline}
                </span>
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- closing ---------- */

export function ClosingBand() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="claude-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2
            id="claude-cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Publish the pages Claude can quote
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white/85 sm:text-[1.05rem]">
            Rankbox finds the questions your buyers ask, writes source-backed, answer-first
            articles, scores each one and publishes on your schedule.
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <UrlForm url={url} onChange={setUrl} />
            <p className="text-[0.82rem] text-white/85">{TRIAL_NOTE}</p>
          </div>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
