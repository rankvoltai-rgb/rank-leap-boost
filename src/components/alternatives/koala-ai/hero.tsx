/**
 * The hero of /alternatives/koala-ai: the promise and the URL form on the
 * left, and on the right the two price tags this whole comparison turns on —
 * one sold by the article, one sold by the word. A strip of the four specs
 * closes the frame, the way the landing's proof band closes its hero.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight, FileText, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, CELL, CellGrid, LINE, PANEL, Pill } from "@/components/landing/frame";
import { UrlForm } from "@/components/landing/Hero";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark, VsLockup } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import { formatCheckedOn, type Competitor } from "@/data/alternatives";
import { RulerTicks } from "./parts";
import { displayUrl, rise } from "./tokens";

function PriceTag({
  mark,
  name,
  plan,
  price,
  unitIcon: UnitIcon,
  unit,
  covers,
  footer,
  keyed = false,
}: {
  mark: React.ReactNode;
  name: string;
  plan: string;
  price: string;
  unitIcon: typeof FileText;
  unit: string;
  covers: string;
  footer?: React.ReactNode;
  /** Rankbox's tag carries the page's soft blue key. */
  keyed?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_36px_-20px_rgba(16,24,40,0.22)] sm:p-6",
        keyed ? "border-cta/30" : "border-ink/[0.07]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {mark}
          <p className="truncate text-[0.95rem] font-semibold text-ink">{name}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-[0.72rem] font-medium",
            keyed
              ? "bg-cta-soft text-cta"
              : "bg-[color-mix(in_oklab,var(--ink)_5%,white)] text-ink",
          )}
        >
          {plan}
        </span>
      </div>
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.03em] text-ink">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">/month</span>
      </p>
      <div className="mt-4 border-t border-ink/[0.07] pt-4">
        <p
          className={cn(
            "flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
            keyed ? "text-cta" : "text-muted-foreground",
          )}
        >
          <UnitIcon className="h-3.5 w-3.5" aria-hidden />
          {unit}
        </p>
        <p className="mt-1.5 text-[0.9rem] leading-snug text-ink">{covers}</p>
      </div>
      {footer}
    </div>
  );
}

export function KoalaHero({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  const c = competitor;
  const pricingSource = c.sources.find((s) => /pricing/.test(s.url));

  return (
    <section id="top" aria-labelledby="koala-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          {/* The promise. */}
          <div className="relative overflow-hidden px-5 pb-14 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-20 lg:pl-14 lg:pr-12">
            <RulerTicks
              edge="bottom"
              className="[mask-image:linear-gradient(to_right,#000_0%,#000_55%,transparent_100%)]"
            />
            <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                <li>
                  <Link to="/" className="py-2 transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <Link to="/alternatives" className="py-2 transition-colors hover:text-ink">
                    Alternatives
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li aria-current="page" className="font-medium text-ink">
                  {c.name}
                </li>
              </ol>
            </nav>

            <div
              className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise sm:mt-12"
              style={rise(0.05)}
            >
              <VsLockup competitor={c} size="sm" />
              <Pill icon={Type}>{c.eyebrow}</Pill>
            </div>

            <h1
              id="koala-title"
              className="mt-6 font-display text-[2.25rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.2rem] lg:text-[3.3rem] xl:text-[3.55rem]"
              style={rise(0.12)}
            >
              <span className="block">{c.headline.lead}</span>{" "}
              <span className="mt-[0.04em] block font-bold text-brand-blue">
                {c.headline.accent}
              </span>
            </h1>

            <p
              className="mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
              style={rise(0.22)}
            >
              {c.subhead}
            </p>

            <div
              className="mt-9 w-full max-w-[35rem] motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          {/* The two price tags. */}
          <div
            className={cn(
              "border-t px-5 py-10 motion-safe:animate-hero-rise sm:px-10 lg:border-l lg:border-t-0 lg:px-9 lg:py-12",
              LINE,
              PANEL,
            )}
            style={rise(0.42)}
          >
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              What each plan sells
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 lg:max-w-none">
              <PriceTag
                keyed
                mark={<RankboxMark className="h-8 w-8" />}
                name="Rankbox"
                plan={PLAN.name}
                price={formatUsd(PLAN.monthly)}
                unitIcon={FileText}
                unit="Sold by the article"
                covers={`${PLAN.articlesPerMonth} articles a month`}
              />
              <PriceTag
                mark={<CompetitorMark competitor={c} className="h-8 w-8" />}
                name={c.name}
                plan={c.pricing.plan}
                price={formatUsd(c.pricing.monthly)}
                unitIcon={Type}
                unit="Sold by the word"
                covers={c.pricing.covers}
                footer={
                  <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.75rem] text-muted-foreground">
                    Checked {formatCheckedOn(c.pricing.checkedOn)}
                    {pricingSource && (
                      <>
                        <span aria-hidden>·</span>
                        <a
                          href={pricingSource.url}
                          target="_blank"
                          rel="noopener nofollow"
                          className="inline-flex items-center gap-0.5 font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
                        >
                          {displayUrl(pricingSource.url)}
                          <ArrowUpRight className="h-3 w-3" aria-hidden />
                        </a>
                      </>
                    )}
                  </p>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* The four specs, closing the frame. */}
      <Band>
        <div style={rise(0.5)} className="motion-safe:animate-hero-rise">
          <CellGrid className="grid-cols-2 lg:grid-cols-4">
            {c.specs.map((s) => (
              <li key={s.label} className={cn(CELL, "flex flex-col-reverse px-5 py-6 sm:px-8")}>
                <span className="mt-1.5 text-balance text-[0.8rem] leading-snug text-muted-foreground">
                  {s.label}
                </span>
                <span className="font-display text-[1.45rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.65rem]">
                  {s.value}
                </span>
              </li>
            ))}
          </CellGrid>
        </div>
      </Band>
    </section>
  );
}
