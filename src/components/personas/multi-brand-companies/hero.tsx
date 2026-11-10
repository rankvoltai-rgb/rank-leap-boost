/**
 * The hero: the promise centred over the frame, the Studio sign-up under it,
 * then the account window across the full column, where a split hero would
 * squeeze it. The other use-case pages put their scene beside the copy; a
 * portfolio needs the room to show four brands in one account.
 */
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, LINE, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/data/pricing";
import type { Persona } from "@/data/personas";
import { multiBrand } from "@/data/persona-pages/multi-brand-companies";
import { PortfolioSwitcher } from "./switcher-scene";
import { StudioForm } from "./ui";

/* Staggers the CSS entrance (animate-hero-rise in styles.css), which
   motion-safe: turns off under reduced motion. */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

export function MultiBrandHero({ persona }: { persona: Persona }) {
  const Icon = persona.icon;
  const { cta } = multiBrand;

  return (
    <section id="top" aria-labelledby="persona-title" className="bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <nav
          aria-label="Breadcrumb"
          className="px-5 pt-6 motion-safe:animate-hero-rise sm:px-8 lg:px-12"
          style={rise(0)}
        >
          <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
            <li>
              <Link to="/" className="py-2 transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link to="/use-cases" className="py-2 transition-colors hover:text-ink">
                Use cases
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              {persona.name}
            </li>
          </ol>
        </nav>

        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-12 pt-8 text-center sm:px-8 sm:pt-10">
          <div className="motion-safe:animate-hero-rise" style={rise(0.05)}>
            <Pill icon={Icon}>{persona.eyebrow}</Pill>
          </div>

          <h1
            id="persona-title"
            className="mt-5 text-balance font-display text-[2.35rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.5rem] lg:text-[3.85rem]"
            style={rise(0.12)}
          >
            <span className="block">{persona.headline.lead}</span>{" "}
            <span className="block font-bold text-brand-blue">{persona.headline.accent}</span>
          </h1>

          <p
            className="mt-5 max-w-[45rem] text-balance text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
            style={rise(0.22)}
          >
            {persona.subhead}
          </p>

          <div
            className="mt-8 w-full max-w-[36rem] motion-safe:animate-hero-rise"
            style={rise(0.3)}
          >
            <StudioForm />
            <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            <p className="mt-1 text-[0.82rem] text-muted-foreground">
              {cta.trialLine}{" "}
              <a
                href="#pricing"
                className="group/link inline-flex items-center gap-1 whitespace-nowrap font-medium text-brand-blue underline-offset-4 hover:underline"
              >
                {cta.secondary}
                <ArrowDown
                  aria-hidden
                  className="h-3 w-3 transition-transform group-hover/link:translate-y-0.5"
                />
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* The account window, on a wash that runs from white into soft blue,
          ruled like the dashboard's own grid. */}
      <Band inner="overflow-hidden p-3">
        <div
          className="relative overflow-hidden bg-[linear-gradient(180deg,#f4f8ff_0%,#e8f0fe_100%)] px-3 pb-8 pt-8 motion-safe:animate-hero-rise sm:px-8 sm:pb-10 sm:pt-12 lg:px-14"
          style={rise(0.42)}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(24,119,242,0.16)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_25%,transparent_100%)]"
          />
          <PortfolioSwitcher className="relative mx-auto max-w-5xl" />
        </div>
      </Band>
    </section>
  );
}
