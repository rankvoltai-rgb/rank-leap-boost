import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANSWER, CTA, HERO, META, OUTLINE } from "./content";
import { StudioButton } from "./StudioButton";
import { TwoSides } from "./TwoSides";
import { FOCUS, TEXT_LINK, WRAP } from "./ui";

/**
 * Left-aligned hero: breadcrumb, H1 with the query, one sentence of what the
 * program is, one action and a link to the gaps. The picture sits on a quiet
 * dotted panel to the right and paints with the page, no entrance wait.
 * Under it, the answer in plain text and the page's own index.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative">
      <div className={cn(WRAP, "pt-8 sm:pt-12")}>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
            <li>
              <Link to="/" className={cn("rounded transition-colors hover:text-ink", FOCUS)}>
                {HERO.crumbs.home}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              {HERO.crumbs.here}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid items-center gap-12 lg:mt-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[0.76rem] font-medium text-ink">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
              {HERO.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="mt-5 text-balance font-display text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.035em] text-ink min-[400px]:text-[2.5rem] sm:text-[3.1rem] lg:text-[3rem] xl:text-[3.3rem]"
            >
              {META.h1}
            </h1>
            <p className="mt-5 max-w-[35rem] text-[1.04rem] leading-relaxed text-muted-foreground sm:text-[1.1rem]">
              {HERO.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <StudioButton />
              <a href="#gaps" className={cn(TEXT_LINK, "text-[0.92rem]")}>
                {HERO.gapsLink}
              </a>
            </div>
            <p className="mt-3.5 max-w-[34rem] text-[0.82rem] leading-relaxed text-muted-foreground">
              {CTA.note}
            </p>
          </div>

          <div className="relative min-w-0">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-4 py-10 sm:px-10 sm:py-14">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--brand-blue)_24%,transparent)_1px,transparent_1.2px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,var(--ink)_25%,transparent_80%)]"
              />
              <TwoSides className="relative mx-auto max-w-[26rem]" />
            </div>
          </div>
        </div>
      </div>

      {/* The answer, quotable on its own, then the page's index. */}
      <div className={cn(WRAP, "mt-16 sm:mt-20")}>
        <div className="grid gap-10 border-y border-border py-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-cta">
              {ANSWER.label}
            </p>
            <p className="mt-3 text-[1.02rem] leading-relaxed text-ink/85 sm:text-[1.06rem]">
              {ANSWER.body}
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              {ANSWER.scope}
            </p>
          </div>
          <nav aria-labelledby="toc-title">
            <p
              id="toc-title"
              className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              {ANSWER.tocLabel}
            </p>
            <ol className="mt-3 grid grid-cols-1 gap-x-6 min-[400px]:grid-cols-2">
              {OUTLINE.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cn(
                      "group flex items-baseline gap-2.5 rounded py-1.5 text-[0.88rem] text-ink/80 transition-colors hover:text-cta",
                      FOCUS,
                    )}
                  >
                    <span className="font-mono text-[0.68rem] text-muted-foreground group-hover:text-cta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.nav}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
