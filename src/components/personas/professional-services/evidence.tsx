/**
 * Two sections of /use-cases/professional-services that make the case before
 * the product does. The research, as two exhibits with their method under
 * each figure and the caveat the studies themselves give; then the firm's own
 * website reviewed the way a firm reviews a file, as numbered findings, each
 * with its response.
 */
import { ArrowUpRight, ClipboardCheck, FileSearch, Info } from "lucide-react";
import { Band, LINE, Pill, Spacer } from "@/components/landing/frame";
import { EVIDENCE, SIGNALS } from "@/data/persona-pages/professional-services";
import type { Persona } from "@/data/personas";
import { cn } from "@/lib/utils";
import { SignalChip, Title } from "./parts";
import { FIELD, splitTitle } from "./tokens";

/* ---------- The research ---------- */

export function ProEvidence() {
  const { source } = EVIDENCE;
  return (
    <section aria-labelledby="evidence-title">
      <Spacer />
      <Band inner="px-5 py-12 text-center sm:px-8 sm:py-16">
        <Pill icon={FileSearch}>{EVIDENCE.eyebrow}</Pill>
        <Title
          id="evidence-title"
          lead={EVIDENCE.title}
          accent={EVIDENCE.accent}
          className="mx-auto mt-5 max-w-3xl"
        />
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
          {EVIDENCE.intro}
        </p>
      </Band>

      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
          {EVIDENCE.exhibits.map((x, i) => (
            <figure
              key={x.tag}
              className={cn(
                "flex flex-col px-6 py-9 sm:px-10 sm:py-12 lg:px-12",
                i === 0 && cn("border-b lg:border-b-0 lg:border-r", LINE),
              )}
            >
              <p className={FIELD}>
                {x.tag} <span className="text-ink/30">·</span>{" "}
                <span className="text-ink/70">{x.by}</span>
              </p>
              <p className="mt-5 font-display text-[3rem] font-medium leading-none tracking-[-0.04em] text-brand-blue sm:text-[3.6rem]">
                {x.figure}
              </p>
              <figcaption className="mt-3 max-w-sm text-[0.98rem] leading-snug text-ink">
                {x.figureLabel}
              </figcaption>
              <dl className={cn("mt-7 space-y-4 border-t pt-5", LINE)}>
                <div>
                  <dt className={FIELD}>Method</dt>
                  <dd className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                    {x.method}
                  </dd>
                </div>
                <div>
                  <dt className={FIELD}>Finding</dt>
                  <dd className="mt-1.5 text-[0.92rem] leading-relaxed text-ink/85">{x.finding}</dd>
                </div>
              </dl>
            </figure>
          ))}
        </div>
      </Band>

      {/* Read across both: the four signals the hero's table checks. */}
      <Band inner="px-6 py-5 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <p className={cn(FIELD, "shrink-0")}>Read across both</p>
          <ul className="flex flex-wrap gap-1.5">
            {SIGNALS.map((s) => (
              <li key={s.id}>
                <SignalChip id={s.id} className="text-[0.72rem]" />
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div
            className={cn(
              "flex gap-3.5 border-b px-6 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-12",
              LINE,
            )}
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
            <p className="text-[0.92rem] leading-relaxed text-ink/80">{EVIDENCE.caveat}</p>
          </div>
          <div className="px-6 py-7 sm:px-10 lg:px-10">
            <p className={FIELD}>Source</p>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex items-start gap-1.5 text-[0.9rem] font-medium leading-snug text-ink transition-colors hover:text-brand-blue"
            >
              <span>
                {source.publisher}, &ldquo;{source.title}&rdquo;, {source.date}
              </span>
              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-brand-blue" />
            </a>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The firm's own site, as findings ---------- */

export function ProFindings({ persona }: { persona: Persona }) {
  const title = splitTitle(persona.painsTitle, 3);
  return (
    <section aria-labelledby="findings-title">
      <Spacer />
      <Band inner="px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
          <div>
            <Pill icon={ClipboardCheck}>Site review</Pill>
            <Title id="findings-title" lead={title.lead} accent={title.accent} className="mt-5" />
          </div>
          <p className="max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
            {persona.painsIntro}
          </p>
        </div>
      </Band>

      {/* Column heads, once, on wide screens. */}
      <Band inner="hidden px-12 py-3 lg:block">
        <div className="grid grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] gap-10">
          <span className={FIELD}>Ref</span>
          <span className={FIELD}>Finding</span>
          <span className={FIELD}>Response</span>
        </div>
      </Band>

      <ol>
        {persona.pains.map((p, i) => (
          <li key={p.pain}>
            <Band inner="px-6 py-7 sm:px-10 lg:px-12 lg:py-8">
              <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
                <span className="font-mono text-[0.78rem] font-medium text-brand-blue">
                  F-{String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className={cn(FIELD, "lg:hidden")}>Finding</p>
                  <p className="mt-1.5 font-display text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink lg:mt-0 lg:text-[1.2rem]">
                    {p.pain}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 hidden h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft text-brand-blue lg:flex"
                  >
                    <ClipboardCheck className="h-3 w-3" />
                  </span>
                  <div>
                    <p className={cn(FIELD, "lg:hidden")}>Response</p>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground lg:mt-0">
                      {p.fix}
                    </p>
                  </div>
                </div>
              </div>
            </Band>
          </li>
        ))}
      </ol>
    </section>
  );
}
