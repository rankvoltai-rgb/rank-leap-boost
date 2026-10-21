/**
 * The /use-cases/saas hero: copy on the left, set flush rather than centred,
 * and the shipping scene on a soft blue panel held to the right rail by a
 * hairline of white, the way the landing's feature rows hold their screens.
 * The product facts close the hero as a band of hairline cells, and the
 * quotable short answer follows as a question and its answer.
 */
import { useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { AlignLeft, Braces, ChevronRight, FileText, LayoutTemplate, Plug } from "lucide-react";
import { UrlForm } from "@/components/landing/Hero";
import { Band, LINE, LINE_FILL, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import type { Persona } from "@/data/personas";
import { cn } from "@/lib/utils";
import { rise } from "./tokens";
import { ShippingScene } from "./scene";

/* One icon per product fact, in the order the facts are listed. */
const SPEC_ICONS: ComponentType<{ className?: string }>[] = [
  FileText,
  LayoutTemplate,
  Braces,
  Plug,
];

export function SaasHero({ persona }: { persona: Persona }) {
  const [url, setUrl] = useState("");
  const Icon = persona.icon;

  return (
    <section id="top" aria-labelledby="saas-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1fr_1.02fr]">
          <div className="flex flex-col justify-center px-5 pb-12 pt-7 sm:px-10 sm:pb-16 lg:py-14 lg:pl-12 lg:pr-6 xl:pl-14">
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

            <div className="mt-10 motion-safe:animate-hero-rise lg:mt-12" style={rise(0.05)}>
              <Pill icon={Icon}>{persona.eyebrow}</Pill>
            </div>

            <h1
              id="saas-title"
              className="mt-6 font-display text-[2.3rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.45rem] sm:text-[3.3rem] lg:text-[3rem] xl:text-[3.4rem]"
              style={rise(0.12)}
            >
              <span className="block">{persona.headline.lead}</span>{" "}
              <span className="mt-[0.04em] inline-flex items-center gap-[0.2em] whitespace-nowrap">
                <span
                  aria-hidden
                  className="inline-flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                >
                  <Icon className="h-[48%] w-[48%] text-brand-blue" strokeWidth={2.4} />
                </span>
                <span className="font-bold text-brand-blue">{persona.headline.accent}</span>
              </span>
            </h1>

            <p
              className="mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.22)}
            >
              {persona.subhead}
            </p>

            <div
              className="mt-8 w-full max-w-[34rem] motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <UrlForm url={url} onChange={setUrl} variant="split" />
              <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          {/* The scene, on its own tint, flush to the right rail. */}
          <div className="px-3 pb-3 lg:py-3 lg:pl-0 lg:pr-3">
            <div className="relative flex h-full items-center overflow-hidden bg-[#eaf2fe] px-3 py-10 sm:px-10 sm:py-14 lg:px-9">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(22,111,229,0.16)_1px,transparent_0)] bg-[length:18px_18px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_30%,transparent_100%)]"
              />
              <div className="relative w-full motion-safe:animate-hero-rise" style={rise(0.4)}>
                {persona.topics && <ShippingScene clusters={persona.topics.clusters} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The product facts. Top hairline only: the band below draws the next. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.48)}>
        <dl
          aria-label={`Rankbox for ${persona.nameLower} at a glance`}
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-2 gap-px border-x lg:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {persona.specs.map((s, i) => {
            const SpecIcon = SPEC_ICONS[i % SPEC_ICONS.length];
            return (
              <div
                key={s.label}
                className="flex flex-col gap-3 bg-white px-5 py-5 sm:flex-row sm:items-start sm:gap-3.5 sm:px-8 sm:py-6"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                  <SpecIcon className="h-4 w-4" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <dt className="order-2 mt-1 text-[0.8rem] leading-snug text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-display text-[1.3rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.45rem]">
                    {s.value}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

/* The paragraph answer engines lift, under the question it answers. */
export function SaasShortAnswer({ persona }: { persona: Persona }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.7fr]">
          <div
            className={cn(
              "border-b px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12",
              LINE,
            )}
          >
            <Pill icon={AlignLeft}>In short</Pill>
            <h2
              id="short-answer-title"
              className="mt-4 max-w-xs text-balance font-display text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.5rem]"
            >
              What is Rankbox for {persona.nameLower}?
            </h2>
          </div>
          <div className="px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
            <p className="max-w-[46rem] text-[1.02rem] leading-[1.75] text-ink/80 sm:text-[1.12rem]">
              {persona.shortAnswer}
            </p>
          </div>
        </div>
      </Band>
    </section>
  );
}
