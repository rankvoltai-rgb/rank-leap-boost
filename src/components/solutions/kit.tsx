/**
 * The parts both /solutions pages share: the blue hero chassis, section
 * headings, the facts band, FAQ and closing CTA, and the small links to tools
 * and features. The landing's design language (pixel field, URL capture,
 * bordered cards, dark closing block) so the pages sit inside the site, with
 * each page's own centrepiece in its own module.
 */
import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight, Plug, type LucideIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { PixelField, UrlForm } from "@/components/landing/Hero";
import { ChatAnswerCard } from "@/components/landing/chat";
import { TOOL_ICONS } from "@/components/tools/icons";
import { KIND_LABEL, getTool } from "@/data/tools";
import { getFeature } from "@/data/features";
import { TRIAL_DAYS } from "@/data/pricing";
import type { Faq } from "@/data/ai-seo/types";
import { rollingOut } from "@/data/solutions/gates";
import { cn } from "@/lib/utils";

/* ---------- Hero chassis ---------- */

export function SolutionHero({
  name,
  icon: Icon,
  eyebrow,
  h1,
  subhead,
  actions,
  aside,
}: {
  /** The breadcrumb's last crumb. */
  name: string;
  icon: LucideIcon;
  eyebrow: string;
  h1: { lead: string; accent: string };
  subhead: string;
  /** The CTA block under the subhead. */
  actions: ReactNode;
  /** The right column: the page's centrepiece. */
  aside: ReactNode;
}) {
  return (
    <section
      id="top"
      aria-labelledby="solution-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:pb-20 lg:pb-24 lg:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,31rem)] xl:gap-16">
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:text-left">
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
                  <li aria-current="page" className="text-white">
                    {name}
                  </li>
                </ol>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Icon className="h-3.5 w-3.5" />
                {eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                id="solution-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.05] tracking-tight text-white sm:text-[3.2rem] xl:text-[3.5rem]"
              >
                <span className="lg:block">{h1.lead}</span> <span>{h1.accent}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                {subhead}
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">{actions}</div>
            </Reveal>
          </div>
          <Reveal delay={0.3} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:max-w-none">
            {aside}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The signup line under every URL form: accurate to the pricing FAQ. */
export function StartNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-sm text-white/70", className)}>
      Free to start, no card needed · {TRIAL_DAYS}-day free trial
    </p>
  );
}

export function SignupForm() {
  const [url, setUrl] = useState("");
  return <UrlForm url={url} onChange={setUrl} />;
}

/* ---------- Headings ---------- */

export function Heading({
  id,
  title,
  intro,
  align = "center",
  className,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}
    >
      <h2
        id={id}
        className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl sm:leading-[1.1]"
      >
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{intro}</p>
      )}
    </Reveal>
  );
}

/* ---------- Facts band ---------- */

export function SpecsBand({
  label,
  specs,
}: {
  label: string;
  specs: { value: string; label: string }[];
}) {
  return (
    <section aria-label={label} className="border-b border-border bg-card">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4 md:py-12">
        {specs.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              // The label comes first in the markup, as a <dl> needs; reversing
              // puts the number on top, and justify-end keeps every number on
              // one line when a label wraps.
              "flex flex-col-reverse justify-end px-3 text-center md:px-6",
              i % 2 === 1 && "border-l border-border",
              i > 0 && "md:border-l md:border-border",
            )}
          >
            <dt className="mt-1.5 text-balance text-sm leading-snug text-muted-foreground">
              {s.label}
            </dt>
            <dd className="font-display text-3xl font-semibold tabular-nums tracking-tight text-ink">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Links to tools and features ---------- */

/** A free tool as a compact row: icon, name, what it does, and how it runs. */
export function ToolRow({ slug, className }: { slug: string; className?: string }) {
  const tool = getTool(slug);
  if (!tool) return null;
  const Icon = TOOL_ICONS[tool.icon];
  return (
    <Link
      to="/tools/$slug"
      params={{ slug }}
      className={cn(
        "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface focus-visible:bg-surface",
        className,
      )}
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-brand-blue shadow-sm">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-ink group-hover:text-cta">{tool.name}</span>
          <span className="text-[0.7rem] font-medium text-muted-foreground">
            {KIND_LABEL[tool.kind].label}
          </span>
        </span>
        <span className="mt-0.5 block text-[0.83rem] leading-snug text-muted-foreground">
          {tool.tagline}
        </span>
      </span>
    </Link>
  );
}

const CHIP =
  "group inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-cta/20 bg-cta-soft px-2.5 py-1 text-[0.8rem] font-semibold text-cta transition-colors hover:border-cta/40";

/** An integration page link, in the same chip as a feature. */
export function IntegrationLink({ slug, label }: { slug: string; label: string }) {
  return (
    <Link to="/integrations/$slug" params={{ slug }} className={CHIP}>
      <Plug className="h-3.5 w-3.5" />
      {label}
      <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
    </Link>
  );
}

/** A feature page link, marked when the changelog says it's still rolling out. */
export function FeatureLink({ slug, className }: { slug: string; className?: string }) {
  const feature = getFeature(slug);
  if (!feature) return null;
  const Icon = feature.icon;
  return (
    <Link to="/features/$slug" params={{ slug }} className={cn(CHIP, className)}>
      <Icon className="h-3.5 w-3.5" />
      {feature.name}
      {rollingOut(slug) && (
        <span className="rounded bg-card px-1.5 py-px text-[0.65rem] font-medium text-muted-foreground">
          Rolling out
        </span>
      )}
      <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
    </Link>
  );
}

/* ---------- FAQ ---------- */

export function SolutionFAQ({ title, faqs }: { title: string; faqs: Faq[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <Heading id="faq-title" title={title} />
        <Reveal delay={0.06} className="mt-12">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="divide-y divide-border rounded-2xl border border-border bg-card px-5"
          >
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                {/* Mounted while closed so the answers are in the served HTML. */}
                <AccordionContent
                  forceMount
                  className="text-[0.95rem] leading-relaxed text-muted-foreground data-[state=closed]:hidden"
                >
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

/* ---------- Closing CTA ---------- */

export function SolutionCTA({
  title,
  body,
  icon: Icon,
}: {
  title: string;
  body: string;
  icon: LucideIcon;
}) {
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
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
                {body}
              </p>
              <div className="mt-8 flex justify-center">
                <SignupForm />
              </div>
              <StartNote className="mt-3 text-background/60" />
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
