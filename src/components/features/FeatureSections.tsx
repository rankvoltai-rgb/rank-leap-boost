/**
 * Feature pages are sub-landing pages: the landing's design language (blue
 * pixel hero, URL capture, bordered cards, alternating surfaces, dark closing
 * CTA) with a body that is entirely about one feature. Each section here takes
 * the feature and renders its own copy and product UI; the route stitches them
 * together with the landing's Pricing.
 */
import { useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Reveal,
  Eyebrow,
  Avatar,
  Stars,
  StatCard,
  PrimaryButton,
} from "@/components/landing/shared";
import { PixelField, CARD_PIXELS, UrlForm, TrustRow } from "@/components/landing/Hero";
import { ChatAnswerCard } from "@/components/landing/chat";
import { TESTIMONIALS } from "@/components/landing/Testimonials";
import { cn } from "@/lib/utils";
import { ENGINE_ORDER, getFeature, type Feature } from "@/data/features";
import { SHOWCASES } from "./showcase";

/* ---------- shared bits ---------- */

function Heading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {intro && <p className="mt-4 text-balance text-lg text-muted-foreground">{intro}</p>}
    </Reveal>
  );
}

/* The feature's icon on a white tile, sized in em so it sits inside the H1 the
   way the landing's rotating engine tile does. Decorative: the H1's text alone
   carries the meaning. */
function IconTile({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex h-[1em] w-[1em] shrink-0 -translate-y-[0.08em] items-center justify-center rounded-[0.24em] bg-white align-middle shadow-elevation ring-1 ring-border",
        className,
      )}
    >
      <Icon className="h-[50%] w-[50%] text-brand-blue" strokeWidth={2.4} />
    </span>
  );
}

/* ---------- 1. Hero ---------- */

export function FeatureHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");
  const Icon = feature.icon;
  const Showcase = SHOWCASES[feature.slug]?.Hero;
  const [firstAccent, ...restAccent] = feature.headline.accent.split(" ");

  return (
    <section
      id="top"
      aria-labelledby="feature-title"
      className="relative flex min-h-[calc(100svh-var(--top-chrome))] items-center overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12 lg:py-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch xl:gap-16">
          {/* LEFT — the promise */}
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:text-left">
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
                    <Link to="/features" className="transition-colors hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li aria-current="page" className="text-white">
                    {feature.name}
                  </li>
                </ol>
              </nav>
            </Reveal>

            <Reveal delay={0.05}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Icon className="h-3.5 w-3.5" />
                {feature.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.12}>
              <h1
                id="feature-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight text-white sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                <span className="lg:block">{feature.headline.lead}</span>{" "}
                <span className="whitespace-nowrap">
                  <IconTile icon={Icon} className="mr-[0.22em]" />
                  {firstAccent}
                </span>
                {restAccent.length > 0 && ` ${restAccent.join(" ")}`}
              </h1>
            </Reveal>

            <Reveal delay={0.19}>
              <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                {feature.subhead}
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                <UrlForm url={url} onChange={setUrl} />
                <p className="text-sm text-white/70">No credit card required · Free 7-day trial</p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — the feature, live */}
          <Reveal delay={0.34} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:mx-0 lg:h-full">
            <div className="flex flex-col lg:h-full">
              <div className="relative flex flex-col lg:flex-1">
                <div className="pointer-events-none absolute -inset-12">
                  <PixelField pixels={CARD_PIXELS} seed={7} />
                </div>
                {Showcase && (
                  <Showcase className="relative flex-1 lg:min-h-[min(34rem,calc((100svh-var(--top-chrome)-4rem)*0.86))]" />
                )}
              </div>
              <div className="mt-8 flex justify-center lg:justify-start">
                <TrustRow />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. At a glance ---------- */

export function FeatureSpecs({ feature }: { feature: Feature }) {
  return (
    <section aria-label={`${feature.name} at a glance`} className="border-b border-border bg-card">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4 md:py-12">
        {feature.specs.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.05}
            className={cn(
              "flex flex-col-reverse px-3 text-center md:px-6",
              i % 2 === 1 && "border-l border-border",
              i > 0 && "md:border-l md:border-border",
            )}
          >
            <dt className="mt-1.5 text-balance text-sm leading-snug text-muted-foreground">
              {s.label}
            </dt>
            <dd className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
              {s.value}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/* ---------- 3. The problem ---------- */

export function FeatureProblem({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section aria-labelledby="problem-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="problem-title"
          eyebrow="Why it matters"
          title={feature.problem.title}
          intro={feature.problem.body}
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2 lg:gap-6">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame/10 text-flame">
                  <X className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">The old way</p>
                  <p className="text-xs text-muted-foreground">Manual, slow, and easy to skip</p>
                </div>
              </div>
              <ul className="mt-7 space-y-4">
                {feature.problem.before.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-[0.95rem] leading-snug text-muted-foreground"
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-flame/70" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-volt/40 bg-card p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)] ring-1 ring-volt/20 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">With Rankbox</p>
                  <p className="text-xs text-muted-foreground">{feature.name}, on autopilot</p>
                </div>
              </div>
              <ul className="mt-7 space-y-4">
                {feature.problem.after.map((a) => (
                  <li key={a} className="flex gap-3 text-[0.95rem] leading-snug text-ink">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Benefits bento ---------- */

function BenefitText({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <>
      <span className="text-xs font-semibold tabular-nums text-volt">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-2 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </>
  );
}

export function FeatureBenefits({ feature }: { feature: Feature }) {
  const visuals: (ComponentType | undefined)[] = SHOWCASES[feature.slug]?.benefits ?? [];
  const [a, b, c] = feature.benefits;
  const [VA, VB, VC] = visuals;

  return (
    <section
      aria-labelledby="benefits-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="benefits-title"
          eyebrow={`Inside ${feature.name}`}
          title={feature.benefitsTitle}
          intro={feature.benefitsIntro}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          {a && (
            <Reveal className="min-w-0 lg:col-span-3">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-shadow hover:shadow-elevation-lg sm:p-7">
                <BenefitText index={0} {...a} />
                {VA && (
                  <div className="mt-6 flex-1">
                    <VA />
                  </div>
                )}
              </article>
            </Reveal>
          )}
          {b && (
            <Reveal delay={0.06} className="min-w-0 lg:col-span-2">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-shadow hover:shadow-elevation-lg sm:p-7">
                <BenefitText index={1} {...b} />
                {VB && (
                  <div className="mt-6 flex flex-1 flex-col [&>*]:flex-1">
                    <VB />
                  </div>
                )}
              </article>
            </Reveal>
          )}
          {c && (
            <Reveal delay={0.1} className="min-w-0 lg:col-span-5">
              <article className="grid h-full gap-6 rounded-2xl border border-border bg-card p-6 shadow-elevation transition-shadow hover:shadow-elevation-lg sm:p-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-10">
                <div>
                  <BenefitText index={2} {...c} />
                </div>
                {VC && (
                  <div className="min-w-0">
                    <VC />
                  </div>
                )}
              </article>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. How it works ---------- */

export function FeatureHowItWorks({ feature }: { feature: Feature }) {
  return (
    <section aria-labelledby="steps-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading id="steps-title" eyebrow="How it works" title={feature.stepsTitle} />

        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* dashed rail behind the step numbers */}
          <div
            aria-hidden
            className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-px bg-[linear-gradient(to_right,var(--border)_55%,transparent_55%)] bg-[length:12px_1px] md:block"
          />
          <ol className="grid gap-12 md:grid-cols-3 md:gap-6">
            {feature.steps.map((s, i) => (
              <li key={s.title} className="relative">
                <Reveal delay={i * 0.08} className="flex flex-col items-center text-center">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-base font-semibold text-white shadow-sm ring-8 ring-background">
                    {i + 1}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={0.1} className="mt-14 flex flex-col items-center gap-3">
          <PrimaryButton>
            Start your free trial <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
          <p className="text-xs text-muted-foreground">
            No credit card required · Free 7-day trial
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 6. One engine ---------- */

export function FeatureEngine({ feature }: { feature: Feature }) {
  return (
    <section
      aria-labelledby="engine-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="engine-title"
          eyebrow="One engine"
          title="Better with the whole engine"
          intro={feature.connects}
        />

        <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {ENGINE_ORDER.map((slug, i) => {
            const f = getFeature(slug);
            if (!f) return null;
            const Icon = f.icon;
            const step = String(i + 1).padStart(2, "0");
            const current = slug === feature.slug;
            return (
              <li key={slug}>
                <Reveal delay={(i % 4) * 0.05} className="h-full">
                  {current ? (
                    <div
                      aria-current="page"
                      className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-brand-blue p-5 text-white shadow-elevation-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-blue">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em]">
                          You&rsquo;re here
                        </span>
                      </div>
                      <p className="mt-4 text-[0.65rem] font-semibold tabular-nums text-white/60">
                        {step}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold">{f.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/75">{f.tagline}</p>
                    </div>
                  ) : (
                    <Link
                      to="/features/$slug"
                      params={{ slug }}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevation-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-background transition-colors group-hover:bg-brand-blue">
                          <Icon className="h-4 w-4" />
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
                      </div>
                      <p className="mt-4 text-[0.65rem] font-semibold tabular-nums text-muted-foreground">
                        {step}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-ink">{f.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {f.tagline}
                      </p>
                    </Link>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal delay={0.1} className="mt-10 text-center">
          <Link
            to="/features"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
          >
            Explore all features <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 7. Proof ---------- */

export function FeatureProof({ feature }: { feature: Feature }) {
  const picks = feature.proof
    .map((name) => TESTIMONIALS.find((t) => t.n === name))
    .filter((t): t is (typeof TESTIMONIALS)[number] => Boolean(t));
  const [lead, ...rest] = picks;

  return (
    <section id="proof" aria-labelledby="proof-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="proof-title"
          eyebrow="Loved by founders"
          title="Founders growing on autopilot"
          intro="Teams across SaaS, e-commerce, and services use Rankbox to grow search traffic and get their brand cited by AI."
        />

        {lead && (
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <figure className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-brand-blue p-8 text-white sm:p-10">
                <PixelField seed={3} />
                <div className="relative">
                  <Stars />
                  <blockquote className="mt-6 text-balance font-display text-2xl font-semibold leading-snug tracking-tight sm:text-[2rem] sm:leading-[1.25]">
                    &ldquo;{lead.q}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="relative mt-10 flex items-center gap-3">
                  <Avatar name={lead.n} src={lead.a} className="h-11 w-11 ring-white/30" />
                  <div>
                    <p className="text-sm font-semibold">{lead.n}</p>
                    <p className="text-xs text-white/70">
                      {lead.r} · {lead.c}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>

            <div className="flex flex-col gap-6">
              {rest.map((t, i) => (
                <Reveal key={t.n} delay={0.06 * (i + 1)} className="flex-1">
                  <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
                    <Stars className="mb-3" />
                    <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-ink">
                      &ldquo;{t.q}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                      <Avatar name={t.n} src={t.a} className="h-10 w-10" />
                      <div>
                        <p className="text-sm font-semibold text-ink">{t.n}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.r} · {t.c}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard value="400+" label="Active founders" />
            <StatCard value="4.8/5" label="Average rating" />
            <StatCard value="60K+" label="Articles published" />
            <StatCard value="Daily" label="Auto-published content" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 8. FAQ ---------- */

export function FeatureFAQ({ feature }: { feature: Feature }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <Heading
          id="faq-title"
          eyebrow="FAQ"
          title={`${feature.name} questions`}
          intro={`Everything you need to know about ${feature.name} and how it fits into Rankbox.`}
        />
        <Reveal delay={0.08} className="mt-14">
          <Accordion
            type="single"
            collapsible
            className="divide-y divide-border rounded-2xl border border-border bg-card px-5"
          >
            {feature.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent forceMount className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Questions about pricing or setup?{" "}
          <a
            href="/#faq"
            className="font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
          >
            Read the full FAQ
          </a>
        </p>
      </div>
    </section>
  );
}

/* ---------- 9. Closing CTA ---------- */

export function FeatureCTA({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");
  const Icon = feature.icon;
  return (
    <section aria-labelledby="cta-title" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-gridlines opacity-[0.07]" />
            <div className="relative">
              <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-elevation">
                <Icon className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <h2
                id="cta-title"
                className="font-display mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-background sm:text-4xl"
              >
                {feature.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
                {feature.ctaBody}
              </p>
              <div className="mt-8 flex justify-center">
                <UrlForm url={url} onChange={setUrl} />
              </div>
              <p className="mt-3 text-sm text-background/60">
                No credit card required · Free 7-day trial · Cancel anytime
              </p>
              <div className="mx-auto mt-12 max-w-xl text-left [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
                <ChatAnswerCard
                  engine="Perplexity"
                  prompt="Which tool should a lean startup use to plan work?"
                  meta="Searched 31 sources · writing answer"
                  answer={
                    <>
                      Most lean teams start with{" "}
                      <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">
                        Plannora
                      </span>{" "}
                      — it&rsquo;s fast to set up, automates the busywork, and stays free for small
                      teams.
                    </>
                  }
                  sources={["plannora.io", "yardstick.team"]}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
