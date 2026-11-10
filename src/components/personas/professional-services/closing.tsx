/**
 * The close of /use-cases/professional-services: what the firm's articles
 * cost in time today, entered as a timesheet; the four features a firm leans
 * on; the price as a fee schedule read from pricing.ts; every question
 * answered in the open, in the server's HTML; and the closing band, which
 * ends on a sign-off block with the reviewer's line left blank.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, HelpCircle, Layers, Receipt } from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { Band, LINE, PANEL, Pill, SectionHead, Spacer } from "@/components/landing/frame";
import { getFeature } from "@/data/features";
import { FAQ_TITLE, FEES } from "@/data/persona-pages/professional-services";
import type { Persona } from "@/data/personas";
import { TRIAL_CTA, TRIAL_NOTE } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { Title } from "./parts";
import { FIELD, SHEET, SOLID_BUTTON, splitTitle } from "./tokens";

/* ---------- The stack, as a timesheet ---------- */

export function ProTimesheet({ persona }: { persona: Persona }) {
  const title = splitTitle(persona.stackTitle, 3);
  return (
    <section aria-labelledby="timesheet-title">
      <Spacer />
      <Band inner="px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
          <div>
            <Pill icon={Clock3}>Timesheet</Pill>
            <Title id="timesheet-title" lead={title.lead} accent={title.accent} className="mt-5" />
          </div>
          <p className="max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
            {persona.stackIntro}
          </p>
        </div>
      </Band>

      <Band inner={cn("px-3 py-6 sm:px-8 sm:py-10 lg:px-12", PANEL)}>
        <div className={cn(SHEET, "overflow-hidden")}>
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">{persona.stackTitle}</caption>
            <thead>
              <tr className="border-b border-ink/[0.07]">
                <th scope="col" className={cn(FIELD, "w-[3.25rem] px-4 py-3 sm:w-16 sm:px-5")}>
                  #
                </th>
                <th scope="col" className={cn(FIELD, "px-2 py-3 sm:w-[30%]")}>
                  Entry
                </th>
                <th scope="col" className={cn(FIELD, "hidden px-2 py-3 sm:table-cell")}>
                  Narrative
                </th>
                <th
                  scope="col"
                  className={cn(FIELD, "w-[7rem] px-3 py-3 text-right sm:w-36 sm:px-5")}
                >
                  Billing
                </th>
              </tr>
            </thead>
            <tbody>
              {persona.stack.map((s, i) => (
                <tr key={s.label} className="border-b border-ink/[0.06] align-top last:border-b-0">
                  <td className="px-4 py-4 font-mono text-[0.72rem] text-muted-foreground sm:px-5">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <th scope="row" className="px-2 py-4 font-normal">
                    <span className="block text-[0.9rem] font-semibold text-ink">{s.label}</span>
                    <span className="mt-1 block text-[0.82rem] leading-relaxed text-muted-foreground sm:hidden">
                      {s.detail}
                    </span>
                  </th>
                  <td className="hidden px-2 py-4 text-[0.88rem] leading-relaxed text-muted-foreground sm:table-cell">
                    {s.detail}
                  </td>
                  <td className="px-3 py-4 text-right sm:px-5">
                    <span className="inline-flex whitespace-nowrap rounded-md border border-ink/[0.1] bg-white px-1.5 py-0.5 text-[0.64rem] font-semibold text-ink/60">
                      Non-billable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-start gap-3 border-t border-ink/[0.07] bg-cta-soft px-4 py-4 sm:px-5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta text-white">
              <Mark className="h-3.5 w-3.5" />
            </span>
            <p className="text-[0.88rem] leading-relaxed text-ink/85">{persona.stackNote}</p>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The four features ---------- */

export function ProPicks({ persona }: { persona: Persona }) {
  const title = splitTitle(persona.picksTitle, 2);
  return (
    <section aria-labelledby="picks-title">
      <Spacer />
      <SectionHead
        icon={Layers}
        eyebrow="Features"
        title={
          <span id="picks-title">
            {title.lead} <span className="font-bold text-brand-blue">{title.accent}</span>
          </span>
        }
        subtitle={persona.picksIntro}
      />
      <Band>
        <div className="overflow-hidden">
          <ul className="-mb-px -mr-px grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4">
            {persona.picks.map((p, i) => {
              const feature = getFeature(p.featureSlug);
              if (!feature) return null;
              const Icon = feature.icon;
              return (
                <li key={p.featureSlug} className={cn("border-b border-r", LINE)}>
                  <Link
                    to="/features/$slug"
                    params={{ slug: p.featureSlug }}
                    className="group flex h-full flex-col px-6 py-7 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-7"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-[0.66rem] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="mt-5 font-display text-[1.1rem] font-medium tracking-[-0.015em] text-ink">
                      {feature.name}
                    </span>
                    <span className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                      {p.why}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[0.8rem] font-medium text-brand-blue">
                      How it works
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The price, as a fee schedule ---------- */

export function ProFees() {
  return (
    <section aria-labelledby="fees-title">
      <Spacer />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div
            className={cn(
              "flex flex-col border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Receipt} className="w-fit">
              {FEES.eyebrow}
            </Pill>
            <Title id="fees-title" lead={FEES.title} accent={FEES.accent} className="mt-5" />
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              {FEES.intro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="/auth" className={SOLID_BUTTON}>
                {TRIAL_CTA}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/pricing"
                className="inline-flex h-11 items-center rounded-lg px-3 text-[0.9rem] font-medium text-ink transition-colors hover:text-brand-blue"
              >
                Full pricing
              </Link>
            </div>
            <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{FEES.trial}</p>
          </div>

          <div className={cn("px-3 py-6 sm:px-8 sm:py-10 lg:px-10", PANEL)}>
            <div className={cn(SHEET, "overflow-hidden")}>
              <div className="flex items-center justify-between border-b border-ink/[0.07] px-5 py-3">
                <p className={FIELD}>Fee schedule</p>
                <p className={FIELD}>USD</p>
              </div>
              <ul>
                {FEES.rows.map((r) => (
                  <li
                    key={r.item}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-ink/[0.06] px-5 py-5 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-[0.95rem] font-semibold text-ink">{r.item}</p>
                      <p className="mt-1 text-[0.84rem] leading-relaxed text-muted-foreground">
                        {r.detail}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-[1.35rem] font-medium leading-none tracking-[-0.02em] text-ink">
                        {r.fee}
                      </p>
                      <p className="mt-1.5 text-[0.72rem] text-muted-foreground">{r.per}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Questions, all answered in the open ---------- */

export function ProFAQ({ persona }: { persona: Persona }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={HelpCircle}>FAQ</Pill>
        <Title id="faq-title" lead={FAQ_TITLE.lead} accent={FAQ_TITLE.accent} className="mt-5" />
      </Band>
      <Band>
        <div className="overflow-hidden">
          <dl className="-mb-px -mr-px grid grid-cols-[minmax(0,1fr)] md:grid-cols-2">
            {persona.faqs.map((f, i) => (
              <div key={f.q} className={cn("border-b border-r px-6 py-7 sm:px-10 lg:px-12", LINE)}>
                <dt className="flex gap-3">
                  <span className="pt-0.5 font-mono text-[0.72rem] text-brand-blue">Q{i + 1}</span>
                  <span className="font-display text-[1.05rem] font-medium leading-snug tracking-[-0.01em] text-ink">
                    {f.q}
                  </span>
                </dt>
                <dd className="mt-3 pl-[2.1rem] text-[0.9rem] leading-relaxed text-muted-foreground">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

export function ProCTA({ persona }: { persona: Persona }) {
  const lines = [
    { role: "Prepared", who: "Rankbox" },
    { role: "Reviewed", who: "" },
    { role: "Published", who: "" },
  ];
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:px-14">
          <div className="text-center lg:text-left">
            <h2
              id="cta-title"
              className="mx-auto max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem] lg:mx-0"
            >
              {persona.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem] lg:mx-0">
              {persona.ctaBody}
            </p>
            <a
              href="/auth"
              className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              {TRIAL_CTA}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </div>

          {/* The sign-off block, with the reviewer's line left to the firm. */}
          <div aria-hidden className="mx-auto w-full max-w-sm">
            <div className="rounded-lg border border-white/25 bg-white/[0.07] p-5 sm:p-6">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/80">
                Article sign-off
              </p>
              <div className="mt-4 space-y-4">
                {lines.map((l) => (
                  <div
                    key={l.role}
                    className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-end gap-3"
                  >
                    <span className="text-[0.78rem] text-white/80">{l.role}</span>
                    <span className="flex h-7 items-end border-b border-white/50 pb-1">
                      {l.who && (
                        <span className="flex items-center gap-1.5 font-display text-[0.95rem] italic text-white">
                          <Mark className="h-3.5 w-3.5" />
                          {l.who}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
