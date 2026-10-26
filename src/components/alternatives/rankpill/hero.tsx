/**
 * The hero: the claim on the left, the proof on the right. The headline says
 * "at half the monthly price"; beside it the two receipts print the same four
 * lines and two different totals. The spec band underneath closes the hero
 * in the landing's way, as a row of hairline cells.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UrlForm } from "@/components/landing/Hero";
import { Accent, LINE, LINE_FILL, PANEL } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import type { Competitor } from "@/data/alternatives";
import { TwinInvoices } from "./invoices";
import { rise } from "./lib";

export function RankpillHero({ competitor: c }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section id="top" aria-labelledby="rp-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          {/* The claim */}
          <div className="flex flex-col justify-center px-5 pb-12 pt-10 sm:px-10 sm:pb-14 sm:pt-12 lg:py-16 lg:pl-12 lg:pr-12">
            <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
              <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
                <li>
                  <Link to="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <Link to="/alternatives" className="transition-colors hover:text-ink">
                    Alternatives
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li aria-current="page" className="text-ink">
                  {c.name}
                </li>
              </ol>
            </nav>

            {/* The pill, with the two marks where the landing's pill has its icon. */}
            <div className="mt-7 motion-safe:animate-hero-rise" style={rise(0.06)}>
              <span className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <span aria-hidden className="flex items-center -space-x-1">
                  <RankboxMark className="h-5 w-5 rounded-md" />
                  <CompetitorMark
                    competitor={c}
                    className="h-5 w-5 rounded-md text-[0.45rem] ring-2 ring-white"
                  />
                </span>
                {c.eyebrow}
              </span>
            </div>

            <h1
              id="rp-title"
              className="mt-5 text-balance font-display text-[2.25rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.5rem] sm:text-[3.1rem] lg:text-[3.3rem]"
              style={rise(0.12)}
            >
              {c.headline.lead} <Accent>{c.headline.accent}</Accent>
            </h1>

            <p
              className="mt-5 max-w-xl text-[1rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.2)}
            >
              {c.subhead}
            </p>

            <div className="mt-8 max-w-xl motion-safe:animate-hero-rise" style={rise(0.28)}>
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          {/* The proof */}
          <div
            className={cn(
              "flex items-center justify-center border-t px-4 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:px-10 lg:py-14",
              LINE,
              PANEL,
            )}
          >
            <div className="w-full max-w-[30rem] motion-safe:animate-hero-rise" style={rise(0.34)}>
              <TwinInvoices competitor={c} />
            </div>
          </div>
        </div>
      </div>

      {/* The four numbers, closing the hero. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.42)}>
        <dl
          aria-label={`Rankbox and ${c.name} in four numbers`}
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-2 gap-px border-x md:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {c.specs.map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-white px-5 py-6 sm:px-7 sm:py-7">
              <dt className="mt-1.5 text-[0.8rem] leading-snug text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-[1.6rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums sm:text-[1.85rem]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
