import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appear } from "./Appear";
import { PageLink } from "./PageLink";
import { STOPS, TRACKER_NOTE, h2, type Kind, type StageId } from "./content";

/**
 * The category in one chart: each kind of tool drawn as a bar across the
 * stages its main job covers. Rankbox's bar is the long blue one, and it has
 * a gap under "see who AI names", which the H3 below answers plainly.
 */
export function WhereToolsStop() {
  return (
    <section
      id="where-tools-stop"
      aria-labelledby="where-tools-stop-title"
      className="border-t border-border py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-5">
        <Appear className="max-w-2xl">
          <h2
            id="where-tools-stop-title"
            className="text-balance font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.6rem]"
          >
            {h2("where-tools-stop")}
          </h2>
          <p className="mt-5 text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
            {STOPS.intro}
          </p>
          <p className="mt-4 text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">
            {STOPS.google.lead} <q className="text-ink">{STOPS.google.quote}</q>.{" "}
            {STOPS.google.after}{" "}
            <a
              href={STOPS.google.url}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-cta hover:decoration-cta"
            >
              {STOPS.google.source}
            </a>
          </p>
        </Appear>

        <Appear delay={0.05} className="mt-14">
          <StopChart />
        </Appear>

        <TrackerNote />
      </div>
    </section>
  );
}

/* ---------- The chart ---------- */

const COLS = "grid-cols-5";

function StopChart() {
  const stages = STOPS.stages;
  return (
    <figure className="m-0">
      {/* Phones: the column labels don't fit, so they become a numbered key. */}
      <ol
        aria-hidden
        className="mb-5 grid grid-cols-1 gap-1.5 text-xs text-muted-foreground sm:hidden"
      >
        {stages.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span className="w-3 font-mono tabular-nums text-ink">{i + 1}</span>
            {s.label}
          </li>
        ))}
      </ol>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-1">
        <div
          aria-hidden
          className="hidden border-b border-border px-6 sm:grid sm:grid-cols-[15.5rem_minmax(0,1fr)]"
        >
          <span className="py-3 text-xs font-medium text-muted-foreground">{STOPS.kindLabel}</span>
          <div className={cn("relative grid", COLS)}>
            <Guides />
            {stages.map((s) => (
              <span key={s.id} className="px-3 py-3 text-xs font-medium text-muted-foreground">
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-border">
          {STOPS.kinds.map((k, i) => (
            <KindRow key={k.id} kind={k} index={i} />
          ))}
        </ul>
      </div>

      <figcaption className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
        {STOPS.footnote} {STOPS.guide.lead}{" "}
        <PageLink
          target={STOPS.guide.target}
          className="font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-cta hover:decoration-cta"
        >
          {STOPS.guide.label}
        </PageLink>
        .
      </figcaption>
    </figure>
  );
}

function KindRow({ kind, index }: { kind: Kind; index: number }) {
  const ours = kind.id === "rankbox";
  const order = STOPS.stages.map((s) => s.id);
  const first = order.indexOf(kind.covers[0]);
  const last = order.indexOf(kind.covers[kind.covers.length - 1]);
  const labels = STOPS.stages.filter((s) => kind.covers.includes(s.id)).map((s) => s.label);

  return (
    <li
      className={cn(
        "grid grid-cols-[minmax(0,1fr)] gap-4 px-5 py-5 sm:grid-cols-[15.5rem_minmax(0,1fr)] sm:gap-0 sm:px-6 sm:py-0",
        ours && "bg-cta-soft/60",
      )}
    >
      <div className="sm:py-5 sm:pr-6">
        <p className={cn("text-sm font-semibold", ours ? "text-cta" : "text-ink")}>{kind.name}</p>
        <p className="mt-1 text-[0.82rem] leading-snug text-muted-foreground">{kind.note}</p>
        <span className="sr-only">{STOPS.covered(labels)}</span>
      </div>

      <div aria-hidden className="relative sm:flex sm:flex-col sm:justify-center">
        <Guides />
        <div className={cn("relative grid h-8 items-center", COLS)}>
          {/* Phones have no column guides, so a faint track shows the run. */}
          <span className="absolute inset-x-1 top-1/2 border-t border-dashed border-border sm:hidden" />
          {STOPS.stages.map((s, col) =>
            kind.gaps?.[s.id as StageId] ? (
              <span
                key={s.id}
                style={{ gridColumn: `${col + 1} / span 1`, gridRow: 1 }}
                className="relative z-10 justify-self-center rounded-full border border-border bg-card px-2 py-0.5 text-[0.68rem] font-medium text-muted-foreground"
              >
                {kind.gaps[s.id as StageId]}
              </span>
            ) : null,
          )}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ gridColumn: `${first + 1} / ${last + 2}`, gridRow: 1, originX: 0 }}
            className={cn(
              "relative mx-3 h-2.5 rounded-full",
              ours ? "bg-cta" : "bg-[color-mix(in_oklab,var(--muted-foreground)_45%,var(--card))]",
            )}
          />
        </div>
        {/* Phones: column numbers under the track, matching the key above. */}
        <div className={cn("mt-1.5 grid sm:hidden", COLS)}>
          {STOPS.stages.map((s, i) => (
            <span key={s.id} className="text-center font-mono text-[0.65rem] text-muted-foreground">
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}

/** Hairlines down the five stage columns, wide screens only. */
function Guides() {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 hidden sm:grid", COLS)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="border-l border-border/70" />
      ))}
    </div>
  );
}

/* ---------- The straight answer for tracker searches ---------- */

const LINK =
  "font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-cta hover:decoration-cta";

function TrackerNote() {
  return (
    <div className="mt-20 grid grid-cols-[minmax(0,1fr)] gap-10 border-t border-border pt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <Appear>
        <h3 className="text-balance font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {TRACKER_NOTE.h3}
        </h3>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          {TRACKER_NOTE.honest}
        </p>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          {TRACKER_NOTE.when}
        </p>
        <ul className="mt-4 space-y-2">
          {TRACKER_NOTE.links.map((l) => (
            <li key={l.label}>
              <PageLink
                target={l.target}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cta"
              >
                <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-cta">
                  {l.label}
                </span>
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </PageLink>
            </li>
          ))}
        </ul>
      </Appear>

      <Appear delay={0.06}>
        <p className="text-sm font-medium text-ink">{TRACKER_NOTE.vendorsLead}</p>
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
          {TRACKER_NOTE.trackers.map((t) => (
            <li key={t.name} className="px-5 py-4">
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(LINK, "text-sm")}
              >
                {t.name}
              </a>
              <blockquote
                cite={t.url}
                className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground"
              >
                <q>{t.quote}</q>
              </blockquote>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">{TRACKER_NOTE.checked}</p>
      </Appear>
    </div>
  );
}
