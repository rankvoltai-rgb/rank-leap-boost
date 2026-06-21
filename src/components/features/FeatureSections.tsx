import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Eyebrow, PrimaryButton, StatCard } from "@/components/landing/shared";
import type { Feature } from "@/data/features";

export function FeatureHero({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-hero-glow" />
      <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-16 text-center sm:pt-24">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
            <ol className="flex items-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-ink">Home</Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to="/features" className="transition-colors hover:text-ink">Features</Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">{feature.name}</li>
            </ol>
          </nav>
        </Reveal>
        <Reveal delay={0.04}>
          <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-background shadow-elevation">
            <Icon className="h-5 w-5" />
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <Eyebrow className="mb-5">{feature.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            {feature.h1}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            {feature.subhead}
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <PrimaryButton>Start free trial</PrimaryButton>
            <Link
              to="/features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore all features
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card required · Free 7-day trial</p>
        </Reveal>
      </div>
    </section>
  );
}

export function FeatureBenefits({ feature }: { feature: Feature }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Why it matters</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Built to get your brand cited
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {feature.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:p-7">
                <h3 className="text-base font-semibold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureHowItWorks({ feature }: { feature: Feature }) {
  return (
    <section className="border-t border-border bg-surface/40 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">How it works</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            From setup to cited in three steps
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-6">
          {feature.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="relative h-full rounded-2xl border border-border bg-card p-6 shadow-elevation sm:p-7">
                <span className="font-display text-4xl font-bold text-volt/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureProof() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard value="400+" label="Founders growing with Rankvolt" />
            <StatCard value="60K+" label="Articles published" />
            <StatCard value="4.8/5" label="Average customer rating" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FeatureFAQ({ feature }: { feature: Feature }) {
  return (
    <section className="border-t border-border bg-surface/40 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">FAQ</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {feature.name} questions
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <Accordion type="single" collapsible className="divide-y divide-border rounded-2xl border border-border bg-card px-5">
            {feature.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionTrigger className="text-left text-base font-semibold text-ink">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function FeatureCTA({ feature }: { feature: Feature }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-8 py-14 text-center shadow-elevation-lg sm:px-12">
            <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-background sm:text-4xl">
              {feature.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed text-background/70">
              {feature.ctaBody}
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/auth"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Get started free
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}