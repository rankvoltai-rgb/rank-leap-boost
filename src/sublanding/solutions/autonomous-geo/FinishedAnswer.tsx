import { useState, type ReactNode } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appear } from "./Appear";
import { PageLink } from "./PageLink";
import { FINISHED, h2 } from "./content";

/**
 * One finished answer, annotated like an editor's proof: the sample article
 * on the left, five margin notes on the right, numbered to match. Pointing
 * at a note lights up the part of the article it describes.
 */
export function FinishedAnswer() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="finished-answer"
      aria-labelledby="finished-answer-title"
      className="border-y border-border bg-surface/60 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-5">
        <Appear className="max-w-2xl">
          <h2
            id="finished-answer-title"
            className="text-balance font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.6rem]"
          >
            {h2("finished-answer")}
          </h2>
          <p className="mt-5 text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
            {FINISHED.intro}
          </p>
        </Appear>

        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
          <Appear>
            <SampleArticle active={active} />
          </Appear>

          <Appear delay={0.06} className="lg:sticky lg:top-28">
            <ol className="space-y-7">
              {FINISHED.notes.map((note, i) => (
                <li
                  key={note.title}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="flex gap-4"
                >
                  <Marker n={i + 1} on={active === i} />
                  <div className="min-w-0">
                    <h3 className="text-[0.95rem] font-semibold leading-snug text-ink">
                      {note.title}
                    </h3>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {note.body}
                    </p>
                    {"link" in note && note.link && (
                      <PageLink
                        target={note.link.target}
                        className="group mt-2 inline-flex items-center gap-1 text-sm font-semibold text-cta"
                      >
                        <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-cta">
                          {note.link.label}
                        </span>
                        <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                      </PageLink>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Appear>
        </div>
      </div>
    </section>
  );
}

function Marker({ n, on, className }: { n: number; on?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[0.7rem] font-semibold tabular-nums transition-colors motion-reduce:transition-none",
        on ? "border-cta bg-cta text-white" : "border-cta/40 bg-card text-cta",
        className,
      )}
    >
      {n}
    </span>
  );
}

/** A part of the sample article that a margin note points at. */
function Part({ n, active, children }: { n: number; active: number | null; children: ReactNode }) {
  const on = active === n;
  return (
    <div
      className={cn(
        "relative -mx-3 rounded-xl px-3 py-2.5 transition-colors duration-200 motion-reduce:transition-none",
        on && "bg-cta-soft",
      )}
    >
      <Marker n={n + 1} on={on} className="absolute -left-7 top-2.5" />
      {children}
    </div>
  );
}

/** Placeholder lines for body copy the sample doesn't need to spell out. */
function Lines({ widths }: { widths: string[] }) {
  return (
    <div aria-hidden className="space-y-2">
      {widths.map((w, i) => (
        <span key={i} className="block h-2 rounded-full bg-border/80" style={{ width: w }} />
      ))}
    </div>
  );
}

function Cite({ n }: { n: number }) {
  return (
    <span className="ml-0.5 rounded-[4px] bg-cta-soft px-1 align-[2px] font-mono text-[0.62rem] font-semibold text-cta">
      {n}
    </span>
  );
}

function SampleArticle({ active }: { active: number | null }) {
  const d = FINISHED.doc;
  return (
    <article aria-label={d.label} className="rounded-2xl border border-border bg-card shadow-3">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 sm:px-6">
        <span className="truncate font-mono text-[0.72rem] text-muted-foreground">{d.url}</span>
        <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[0.68rem] font-medium text-muted-foreground">
          {d.sample}
        </span>
      </div>

      <div className="space-y-5 py-7 pl-11 pr-5 sm:px-12 sm:py-10">
        <Part n={0} active={active}>
          <p className="text-balance font-display text-xl font-semibold leading-snug tracking-tight text-ink sm:text-[1.4rem]">
            {d.title}
          </p>
          <p className="mt-3 text-pretty text-[0.92rem] leading-relaxed text-ink/85">{d.answer}</p>
        </Part>

        <Part n={1} active={active}>
          <div className="rounded-lg border border-border bg-surface/70 px-4 py-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {d.takeawaysLabel}
            </p>
            <ul className="mt-2 space-y-1.5">
              {d.takeaways.map((t) => (
                <li key={t} className="flex gap-2 text-[0.85rem] leading-snug text-ink/85">
                  <span
                    aria-hidden
                    className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-ink/40"
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Part>

        <Part n={2} active={active}>
          <div className="space-y-2">
            <Lines widths={["100%", "94%"]} />
            <p aria-hidden className="flex items-center">
              <span className="block h-2 w-[58%] rounded-full bg-border/80" />
              <Cite n={1} />
            </p>
            <Lines widths={["97%", "72%"]} />
            <p aria-hidden className="flex items-center">
              <span className="block h-2 w-[41%] rounded-full bg-border/80" />
              <Cite n={2} />
            </p>
          </div>
          <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {d.referencesLabel}
          </p>
          <ol aria-hidden className="mt-2 space-y-1.5">
            {["62%", "48%"].map((w, i) => (
              <li key={w} className="flex items-center gap-2">
                <span className="font-mono text-[0.62rem] font-semibold text-cta">{i + 1}</span>
                <span className="block h-2 rounded-full bg-border/80" style={{ width: w }} />
              </li>
            ))}
          </ol>
        </Part>

        <Part n={3} active={active}>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {d.faqLabel}
          </p>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
            {d.faq.map((q) => (
              <li
                key={q}
                className="flex items-center justify-between gap-3 px-3 py-2.5 text-[0.85rem] text-ink"
              >
                {q}
                <ChevronDown aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </Part>

        <Part n={4} active={active}>
          <p className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cta text-white">
              <Check aria-hidden strokeWidth={3} className="h-2.5 w-2.5" />
            </span>
            {d.status}
          </p>
        </Part>
      </div>
    </article>
  );
}
