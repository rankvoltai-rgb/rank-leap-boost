/**
 * The middle of /use-cases/professional-services, each set as a document a
 * firm already works with: the sample answer library for a fictional CPA
 * firm, the workflow as a workpaper sign-off sheet (prepared, reviewed, then
 * released), and the handoff as an engagement letter's scope, with what is
 * not in scope spelled out under it.
 */
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  FileSignature,
  Library,
  PenLine,
  ScrollText,
  X,
} from "lucide-react";
import { Band, LINE, PANEL, Pill, SectionHead, Spacer } from "@/components/landing/frame";
import { IntegrationGlyph } from "@/components/integrations/visuals";
import { Mark } from "@/components/brand/Mark";
import { getIntegration } from "@/data/integrations";
import {
  CHECK_IT_YOURSELF,
  NOT_IN_SCOPE,
  PRACTICE,
  SCOPE,
  SHORTLIST,
} from "@/data/persona-pages/professional-services";
import type { Persona } from "@/data/personas";
import { cn } from "@/lib/utils";
import { FirmTile, SampleTag, SignalChip, Title } from "./parts";
import { FIELD, SCREEN, SHEET, splitTitle } from "./tokens";

/* ---------- The sample answer library ---------- */

export function ProTopics({ persona }: { persona: Persona }) {
  const topics = persona.topics;
  if (!topics) return null;
  const title = splitTitle(topics.title, 3);

  return (
    <section aria-labelledby="topics-title">
      <Spacer />
      <SectionHead
        icon={Library}
        eyebrow="Sample map"
        title={
          <span id="topics-title">
            {title.lead} <span className="font-bold text-brand-blue">{title.accent}</span>
          </span>
        }
        subtitle={topics.intro}
      />

      <Band inner={cn("px-3 py-6 sm:px-8 sm:py-10 lg:px-12", PANEL)}>
        <div className={cn(SCREEN, "overflow-hidden")}>
          {/* The library's header: the sample firm and its practice. */}
          <div className="flex flex-col gap-3 border-b border-ink/[0.07] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <FirmTile letter={topics.brand[0]} className="h-7 w-7 text-[0.78rem]" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[0.86rem] font-semibold text-ink">{topics.brand}</p>
                <p className="truncate text-[0.68rem] text-muted-foreground">
                  {topics.domain} · answer library
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRACTICE.map((p) => (
                <SignalChip key={p.signal} id={p.signal} label={p.value} />
              ))}
              <SampleTag className="ml-1" />
            </div>
          </div>

          <div className="overflow-hidden">
            <ol className="-mb-px -mr-px grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 xl:grid-cols-4">
              {topics.clusters.map((c, i) => (
                <li
                  key={c.stage}
                  className="flex flex-col border-b border-r border-ink/[0.07] px-4 py-5 sm:px-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.66rem] font-medium text-brand-blue">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.62rem] font-semibold text-ink/70">
                      {c.intent}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-[1.08rem] font-medium tracking-[-0.015em] text-ink">
                    {c.stage}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {c.questions.map((q) => {
                      const inHero = q === SHORTLIST.draft;
                      return (
                        <li
                          key={q}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-[0.82rem] leading-snug",
                            inHero
                              ? "border-cta/25 bg-cta-soft text-ink"
                              : "border-ink/[0.06] bg-white text-ink/80",
                          )}
                        >
                          {q}
                          {inHero && (
                            <span className="mt-1.5 flex items-center gap-1 text-[0.62rem] font-semibold text-cta">
                              <PenLine className="h-3 w-3" />
                              With the reviewer, in the hero above
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-center text-[0.82rem] leading-relaxed text-muted-foreground">
          {topics.note}
        </p>
      </Band>

      {/* Where the articles go. */}
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)]">
          <div
            className={cn(
              "flex items-center border-b px-6 py-6 sm:px-10 lg:border-b-0 lg:border-r lg:px-12",
              LINE,
            )}
          >
            <h3 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
              {topics.platformsTitle}
            </h3>
          </div>
          <div className="overflow-hidden">
            <ul className="-mb-px -mr-px grid grid-cols-[minmax(0,1fr)] sm:grid-cols-3">
              {topics.platforms.map((p) => {
                const integration = getIntegration(p.slug);
                if (!integration) return null;
                return (
                  <li key={p.slug} className={cn("border-b border-r", LINE)}>
                    <Link
                      to="/integrations/$slug"
                      params={{ slug: p.slug }}
                      className="group flex h-full flex-col px-6 py-6 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
                    >
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden>
                          <IntegrationGlyph integration={integration} className="h-6 w-6" />
                        </span>
                        <span className="text-[0.92rem] font-semibold text-ink">
                          {integration.name}
                        </span>
                        <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/70 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                      </span>
                      <span className="mt-2.5 text-[0.84rem] leading-relaxed text-muted-foreground">
                        {p.why}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The workflow, as a sign-off sheet ---------- */

/* Who signs each step. The third is the only one Rankbox touches, and even
   there the release is the reviewer's. */
const SIGNERS: { role: string; who: string; rankbox?: boolean }[][] = [
  [{ role: "Set by", who: "The firm" }],
  [{ role: "Chosen by", who: "The firm" }],
  [
    { role: "Prepared by", who: "Rankbox", rankbox: true },
    { role: "Reviewed by", who: "Licensed reviewer" },
  ],
  [{ role: "Updated by", who: "The firm" }],
];

export function ProSignOff({ persona }: { persona: Persona }) {
  const title = splitTitle(persona.workflowTitle, 2);
  return (
    <section aria-labelledby="signoff-title">
      <Spacer />
      <Band inner="px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
          <div>
            <Pill icon={FileSignature}>Sign-off</Pill>
            <Title id="signoff-title" lead={title.lead} accent={title.accent} className="mt-5" />
          </div>
          <p className="max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
            {persona.workflowIntro}
          </p>
        </div>
      </Band>

      <Band inner={cn("px-3 py-6 sm:px-8 sm:py-10 lg:px-12", PANEL)}>
        <div className={cn(SHEET, "overflow-hidden")}>
          <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-5 py-3">
            <p className={FIELD}>Workpaper · article sign-off</p>
            <p className="hidden font-mono text-[0.64rem] text-muted-foreground sm:block">WP-01</p>
          </div>
          <div className="overflow-hidden">
            <ol className="-mb-px -mr-px grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 lg:grid-cols-4">
              {persona.steps.map((s, i) => (
                <li
                  key={s.title}
                  className="flex flex-col border-b border-r border-ink/[0.07] px-5 py-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft font-mono text-[0.68rem] font-semibold text-brand-blue">
                      {i + 1}
                    </span>
                    <span className={FIELD}>{s.when}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[1.12rem] font-medium leading-snug tracking-[-0.015em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>

                  {/* The sign-off box. */}
                  <dl className="mt-auto space-y-2.5 pt-6">
                    {(SIGNERS[i] ?? []).map((sig) => (
                      <div key={sig.role} className="border-t border-dashed border-ink/15 pt-2">
                        <dt className={FIELD}>{sig.role}</dt>
                        <dd className="mt-1 flex items-center gap-1.5">
                          {sig.rankbox && (
                            <span className="flex h-4 w-4 items-center justify-center rounded bg-cta text-white">
                              <Mark className="h-2.5 w-2.5" />
                            </span>
                          )}
                          <span
                            className={cn(
                              "font-display text-[0.95rem] italic tracking-[-0.01em]",
                              sig.rankbox ? "text-brand-blue" : "text-ink",
                            )}
                          >
                            {sig.who}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The handoff, as an engagement letter's scope ---------- */

export function ProScope({ persona }: { persona: Persona }) {
  const { handoff } = persona;
  const columns = [
    { n: 1, title: handoff.runsTitle, lines: handoff.runs, rankbox: true },
    { n: 2, title: handoff.keepsTitle, lines: handoff.keeps, rankbox: false },
  ];

  return (
    <section aria-labelledby="scope-title">
      <Spacer />
      <Band inner={cn("px-3 py-10 sm:px-8 sm:py-14 lg:px-16", PANEL)}>
        <article className={cn(SHEET, "mx-auto max-w-5xl overflow-hidden")}>
          <header className="border-b border-ink/[0.07] px-5 py-6 sm:px-10 sm:py-8">
            <Pill icon={ScrollText}>{SCOPE.eyebrow}</Pill>
            <Title
              id="scope-title"
              lead={SCOPE.lead}
              accent={SCOPE.accent}
              className="mt-5 max-w-2xl text-[1.7rem] leading-[1.14] sm:text-[2.1rem] sm:leading-[1.12]"
            />
          </header>

          <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2">
            {columns.map((col) => (
              <div
                key={col.n}
                className={cn(
                  "px-5 py-7 sm:px-10",
                  col.n === 1 && "border-b border-ink/[0.07] md:border-b-0 md:border-r",
                  !col.rankbox && "bg-[color-mix(in_oklab,var(--cta-soft)_45%,white)]",
                )}
              >
                <h3 className="flex items-center gap-2.5 font-display text-[1.1rem] font-medium text-ink">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md font-mono text-[0.7rem] font-semibold",
                      col.rankbox
                        ? "bg-cta text-white"
                        : "border border-ink/[0.1] bg-white text-ink",
                    )}
                  >
                    {col.n}
                  </span>
                  {col.title}
                </h3>
                <ol className="mt-5 space-y-4">
                  {col.lines.map((l, j) => (
                    <li key={l.label} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-1">
                      <span className="pt-px font-mono text-[0.72rem] text-muted-foreground">
                        {col.n}.{j + 1}
                      </span>
                      <div>
                        <p className="text-[0.92rem] font-semibold text-ink">{l.label}</p>
                        <p className="mt-0.5 text-[0.86rem] leading-relaxed text-muted-foreground">
                          {l.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* What the engagement leaves out. */}
          <div className="border-t border-ink/[0.07] px-5 py-7 sm:px-10">
            <h3 className="flex items-center gap-2.5 font-display text-[1.1rem] font-medium text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.1] bg-white font-mono text-[0.7rem] font-semibold text-ink">
                3
              </span>
              {SCOPE.excludedTitle}
            </h3>
            <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {NOT_IN_SCOPE.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[0.86rem] text-ink/80">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40" strokeWidth={2.4} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Measuring it, by hand, since Rankbox doesn't. */}
          <div className="flex flex-col gap-4 border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-5 py-6 sm:px-10 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="max-w-xl">
              <p className="text-[0.92rem] font-semibold text-ink">{CHECK_IT_YOURSELF.title}</p>
              <p className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">
                {CHECK_IT_YOURSELF.body}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to="/tools/$slug"
                params={{ slug: "ai-visibility-prompt-generator" }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-2 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-brand-blue/30 hover:text-brand-blue"
              >
                {CHECK_IT_YOURSELF.tool}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/blog/$slug"
                params={{ slug: "how-to-measure-geo" }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-2 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-brand-blue/30 hover:text-brand-blue"
              >
                {CHECK_IT_YOURSELF.guide}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </article>
      </Band>
    </section>
  );
}
