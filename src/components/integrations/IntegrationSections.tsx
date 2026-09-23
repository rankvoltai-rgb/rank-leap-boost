/**
 * Integration pages speak the landing's design language (blue pixel hero,
 * bordered cards, alternating surfaces, dark closing CTA) around the one
 * question an integration page has to answer: what happens to my content, on
 * my platform, once I connect. Each section takes an integration and renders
 * its own copy; the routes stitch them together. The directory's own pieces
 * (hub hero, filterable grid, the publishing loop) live at the bottom.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Newspaper,
  FileCheck2,
  KeyRound,
  Link2,
  RefreshCw,
  ShieldCheck,
  Undo2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { PixelField, CARD_PIXELS } from "@/components/landing/Hero";
import { cn } from "@/lib/utils";
import { TRIAL_DAYS } from "@/data/pricing";
import {
  INTEGRATIONS,
  KIND_LABEL,
  ctaLabel,
  isAddon,
  relatedIntegrations,
  type Integration,
  type IntegrationFAQ as FAQ,
  type IntegrationSpec,
} from "@/data/integrations";
import { AI_TOOLS } from "@/data/ai-integrations";
import {
  ConnectionLockup,
  FieldMap,
  HeroVisual,
  IntegrationGlyph,
  Orbit,
  RankboxTile,
  SetupVisual,
  StatusSample,
} from "./visuals";

/* ---------- shared bits ---------- */

export function Heading({
  id,
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
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

export const TRIAL_NOTE = `Included with every plan · Free ${TRIAL_DAYS}-day trial`;

export function HeroButtons({ primary, secondary }: { primary: ReactNode; secondary: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
      {primary}
      {secondary}
    </div>
  );
}

export const heroPrimary =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-blue shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md sm:w-auto";
export const heroSecondary =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto";

export function Breadcrumb({ current }: { current?: string }) {
  return (
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
        {current ? (
          <>
            <li>
              <Link to="/integrations" className="transition-colors hover:text-white">
                Integrations
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="text-white">
              {current}
            </li>
          </>
        ) : (
          <li aria-current="page" className="text-white">
            Integrations
          </li>
        )}
      </ol>
    </nav>
  );
}

/* ---------- 1. Hero ---------- */

export function IntegrationHero({ integration }: { integration: Integration }) {
  const note =
    integration.kind === "mcp" ? "Included with every plan · Nothing to install" : TRIAL_NOTE;
  return (
    <section
      id="top"
      aria-labelledby="integration-title"
      className="relative flex min-h-[calc(100svh-var(--top-chrome))] items-center overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12 lg:py-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          {/* LEFT — the promise */}
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <Breadcrumb current={integration.name} />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mb-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <ConnectionLockup integration={integration} />
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {integration.eyebrow}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <h1
                id="integration-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight text-white sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                <span className="lg:block">{integration.headline.lead}</span>{" "}
                <span className="lg:block">{integration.headline.accent}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.19}>
              <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                {integration.subhead}
              </p>
            </Reveal>

            <Reveal delay={0.26} className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <HeroButtons
                primary={
                  <a href="/auth" className={heroPrimary}>
                    {ctaLabel(integration)} <ArrowRight className="h-4 w-4" />
                  </a>
                }
                secondary={
                  <a href="#setup" className={heroSecondary}>
                    How setup works
                  </a>
                }
              />
              <p className="text-sm text-white/70">{note}</p>
            </Reveal>
          </div>

          {/* RIGHT — the integration, at work */}
          <Reveal delay={0.34} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:mx-0">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-12">
                <PixelField pixels={CARD_PIXELS} seed={7} />
              </div>
              <HeroVisual integration={integration} className="relative lg:min-h-[28.5rem]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. At a glance ---------- */

export function IntegrationSpecs({ specs, label }: { specs: IntegrationSpec[]; label: string }) {
  return (
    <section aria-label={label} className="border-b border-border bg-card">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4 md:py-12">
        {specs.map((s, i) => (
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

/* ---------- 3. What it does, and what lands where ---------- */

export function IntegrationHighlights({ integration }: { integration: Integration }) {
  return (
    <section aria-labelledby="highlights-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="highlights-title"
          eyebrow={`Rankbox for ${integration.name}`}
          title={integration.highlightsTitle}
          intro={integration.tagline}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <ol className="self-start divide-y divide-border border-y border-border">
            {integration.highlights.map((h, i) => (
              <li key={h.title}>
                <Reveal delay={i * 0.06} className="flex gap-5 py-6">
                  <span className="text-xs font-semibold tabular-nums text-volt">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{h.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.1} className="min-w-0">
            <h3 className="text-lg font-semibold text-ink">{integration.fields.title}</h3>
            <p className="mb-5 mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {integration.fields.intro}
            </p>
            <FieldMap integration={integration} />
            {isAddon(integration) && (
              <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted-foreground">
                <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-volt" />
                The live URL tells Rankbox where each article lives, so the backlink exchange knows
                which page to verify links on.
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Setup ---------- */

function setupIntro(integration: Integration): string {
  if (integration.kind === "api")
    return "A few lines in your build step, in any language that can make an HTTPS request.";
  if (integration.kind === "mcp") return "About a minute, in the assistant you already use.";
  return `Install from ${integration.source}. No developer, no code, no passwords shared.`;
}

export function IntegrationSetup({ integration }: { integration: Integration }) {
  return (
    <section
      id="setup"
      aria-labelledby="setup-title"
      className="scroll-mt-20 border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 lg:grid-cols-2 lg:gap-16">
        <div>
          <Heading
            id="setup-title"
            eyebrow="Setup"
            title="Connected in three steps"
            intro={setupIntro(integration)}
            align="left"
          />
          <ol className="relative mt-10">
            {integration.setup.map((s, i) => (
              <li key={s.title} className="relative pb-9 last:pb-0">
                {/* the rail from this step's number down to the next */}
                {i < integration.setup.length - 1 && (
                  <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px bg-border" />
                )}
                <Reveal delay={i * 0.08} className="flex gap-5">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white ring-8 ring-surface">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-base font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-md"
            >
              {ctaLabel(integration)} <ArrowRight className="h-4 w-4" />
            </a>
            {integration.kind !== "mcp" && (
              <span className="text-xs text-muted-foreground">{TRIAL_NOTE}</span>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.12} y={24} className="min-w-0 lg:sticky lg:top-24">
          <SetupVisual integration={integration} />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 5. Connection status ---------- */

const STATUSES = [
  {
    dot: "bg-success",
    name: "Live",
    body: "Your site asked for articles in the last 48 hours. Everything is flowing.",
  },
  {
    dot: "bg-brand-blue",
    name: "Waiting",
    body: "The key is ready and Rankbox is listening. It turns Live the moment your site first calls in.",
  },
  {
    dot: "bg-warning",
    name: "Idle",
    body: "No request for 48 hours. Rankbox flags it, so articles never quietly stop arriving.",
  },
];

export function ConnectionStatus({ integration }: { integration?: Integration }) {
  return (
    <section aria-labelledby="status-title" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal y={24} className="order-2 min-w-0 lg:order-1">
          <StatusSample integration={integration} />
        </Reveal>
        <div className="order-1 lg:order-2">
          <Heading
            id="status-title"
            eyebrow="Delivery status"
            title="Know it's working, not just connected"
            intro="A key existing proves nothing. Rankbox watches for your site's requests and shows exactly which articles have arrived."
            align="left"
          />
          <ul className="mt-8 space-y-5">
            {STATUSES.map((s, i) => (
              <li key={s.name}>
                <Reveal delay={i * 0.06} className="flex gap-3.5">
                  <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", s.dot)} />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-ink">{s.name}.</span> {s.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Keys and security ---------- */

const SAFEGUARDS = [
  {
    icon: ShieldCheck,
    title: "Limited by design",
    body: "A key can fetch your finished articles and report where they went live, on your own domain. Nothing else in your account.",
  },
  {
    icon: KeyRound,
    title: "No passwords shared",
    body: "Rankbox never logs into your site. Your site pulls articles in with a key you can see, replace, and revoke.",
  },
  {
    icon: FileCheck2,
    title: "Stored as a hash",
    body: "A key is shown once. Rankbox keeps only its SHA-256 hash, so a database leak never exposes a usable key.",
  },
  {
    icon: Undo2,
    title: "Revoke in one click",
    body: "Replace a key that may have leaked, or revoke one you no longer use. Syncing with it stops the moment you do.",
  },
];

export function KeySecurity() {
  return (
    <section
      aria-labelledby="security-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="security-title"
          eyebrow="Security"
          title="Your site holds the key"
          intro="Every connection runs on one key per site. Here's everything that key can and can't do."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SAFEGUARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-elevation">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-background">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.1} className="mt-10 text-center">
          <Link
            to="/trust"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
          >
            Read how we handle security <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 7. FAQ ---------- */

export function IntegrationFAQ({
  title,
  intro,
  faqs,
}: {
  title: string;
  intro: string;
  faqs: FAQ[];
}) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <Heading id="faq-title" eyebrow="FAQ" title={title} intro={intro} />
        <Reveal delay={0.08} className="mt-14">
          <Accordion
            type="single"
            collapsible
            className="divide-y divide-border rounded-2xl border border-border bg-card px-5"
          >
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Questions about pricing or plans?{" "}
          <Link
            to="/pricing"
            className="font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
          >
            See pricing
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ---------- 8. Directory card, and related integrations ---------- */

/* A full card from sm up; below that, a compact row (logo, name, one line,
   arrow) so the directory isn't eight screens of cards on a phone. */
export function IntegrationCard({ integration }: { integration: Integration }) {
  const kind = KIND_LABEL[integration.kind];
  return (
    <Link
      to="/integrations/$slug"
      params={{ slug: integration.slug }}
      className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:flex-col sm:items-stretch sm:gap-0 sm:p-6"
    >
      <div className="flex shrink-0 items-start justify-between gap-3">
        <span aria-hidden>
          <IntegrationGlyph
            integration={integration}
            className="h-11 w-11 transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
          />
        </span>
        <span className="hidden rounded-full border border-border px-2.5 py-0.5 text-[0.7rem] font-semibold text-muted-foreground sm:inline">
          {kind}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink sm:mt-5">
          {integration.kind === "api" || integration.kind === "mcp"
            ? `Rankbox ${integration.name}`
            : integration.name}
          <span className="rounded-full border border-border px-2 py-px text-[0.62rem] font-semibold text-muted-foreground sm:hidden">
            {kind}
          </span>
        </h3>
        <p className="mt-1 hidden text-xs font-medium text-volt sm:block">{integration.category}</p>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground sm:mt-2.5">
          {integration.tagline}
        </p>
        <span className="mt-5 hidden items-center justify-between border-t border-border pt-4 text-sm font-semibold text-ink sm:flex">
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:hidden" />
    </Link>
  );
}

export function RelatedIntegrations({ integration }: { integration: Integration }) {
  const related = relatedIntegrations(integration);
  return (
    <section
      aria-labelledby="related-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="related-title"
          eyebrow="More integrations"
          title="Publishing somewhere else too?"
          intro="Every integration runs on the same engine and the same kind of key."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {related.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.06}>
              <IntegrationCard integration={r} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-10 text-center">
          <Link
            to="/integrations"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
          >
            See all integrations <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 9. Closing CTA ---------- */

export function IntegrationCTA({ integration }: { integration?: Integration }) {
  const copy = !integration
    ? {
        title: "Connect your site once. Publish every day.",
        body: "Pick your platform, paste one key, and every article autopilot writes lands on your site as a native post.",
        cta: "Get started free",
      }
    : integration.kind === "api"
      ? {
          title: "Start pulling articles today",
          body: "Create a key, make one request, and your site has every finished article in HTML and Markdown.",
          cta: ctaLabel(integration),
        }
      : integration.kind === "mcp"
        ? {
            title: "Bring Rankbox into your assistant",
            body: "Add one URL and your assistant can find the questions, brief the article, and write the meta descriptions.",
            cta: ctaLabel(integration),
          }
        : {
            title: `Start publishing to ${integration.name}`,
            body: `Connect ${integration.name} once and every article autopilot writes arrives on its own, in your design and on your schedule.`,
            cta: ctaLabel(integration),
          };

  return (
    <section aria-labelledby="cta-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-gridlines opacity-[0.07]" />
            <div className="relative">
              <div className="mb-7 flex justify-center">
                {integration ? (
                  <ConnectionLockup integration={integration} />
                ) : (
                  <span className="flex items-center -space-x-2">
                    <RankboxTile className="relative z-10 h-12 w-12 ring-4 ring-ink" />
                    {INTEGRATIONS.map((i) => (
                      <span key={i.slug} aria-hidden className="rounded-[25%] ring-4 ring-ink">
                        <IntegrationGlyph integration={i} className="h-10 w-10" />
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <h2
                id="cta-title"
                className="font-display mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-background sm:text-4xl"
              >
                {copy.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
                {copy.body}
              </p>
              <a
                href="/auth"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-cta-hover"
              >
                {copy.cta} <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-sm text-background/60">{TRIAL_NOTE}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* The directory (/integrations)                                       */
/* ================================================================== */

export function HubHero() {
  const platforms = INTEGRATIONS.filter(isAddon).length;
  return (
    <section
      id="top"
      aria-labelledby="integrations-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-12 sm:pb-24 lg:pt-16">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <Breadcrumb />
            </Reveal>
            <Reveal delay={0.05}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {platforms} platforms · {AI_TOOLS.length} AI tools · REST API
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                id="integrations-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                Your site and your AI tools, connected
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                Every article autopilot writes publishes to your site as a native post, and
                Rankbox&rsquo;s research works inside Claude, ChatGPT, Lovable, Cursor, and the
                other AI tools you already use.
              </p>
            </Reveal>
            <Reveal delay={0.22} className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <HeroButtons
                primary={
                  <a href="/auth" className={heroPrimary}>
                    Get started free <ArrowRight className="h-4 w-4" />
                  </a>
                }
                secondary={
                  <a href="#directory" className={heroSecondary}>
                    Browse integrations
                  </a>
                }
              />
              <p className="text-sm text-white/70">{TRIAL_NOTE}</p>
            </Reveal>
          </div>

          <Reveal delay={0.3} y={24} className="min-w-0 px-6 pb-6 sm:px-10">
            <Orbit />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const LOOP = [
  {
    icon: FileCheck2,
    title: "Rankbox finishes an article",
    body: "Researched, written in your voice, and scored. Only finished articles are ever sent.",
  },
  {
    icon: RefreshCw,
    title: "Your site asks for it",
    body: "The app or plugin checks in with its key and collects everything new or edited since its last visit.",
  },
  {
    icon: Newspaper,
    title: "It lands as a native post",
    body: "In your theme or template, with its slug, excerpt, and tags set. Live straight away, or held as a draft.",
  },
  {
    icon: Link2,
    title: "The live URL comes back",
    body: "So Rankbox knows where every article lives, and your dashboard shows it arrived.",
  },
];

export function PublishingLoop() {
  return (
    <section
      aria-labelledby="loop-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="loop-title"
          eyebrow="How it works"
          title="One loop, every platform"
          intro="Your site pulls articles in, so Rankbox never needs your login. Here's the whole path an article takes."
        />
        <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {LOOP.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative">
                <Reveal delay={i * 0.07} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
                {i < LOOP.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-[1.625rem] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground lg:flex"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 shrink-0 text-volt" />
            Then it repeats on your schedule. Edits you make in Rankbox travel the same path.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
