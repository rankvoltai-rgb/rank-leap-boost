/**
 * A glossary entry reads like a dictionary entry that keeps going. The top is
 * the dictionary: the term, what else it's called, and the one-sentence
 * definition set in a card on the brand-blue field. Below it the page becomes
 * an article — why it matters, the real questions answered in order, the
 * Rankbox original, and the way out to related terms and the product.
 *
 * Every section answers on its own, because answer engines lift chunks, not
 * pages: the definition is the first paragraph after the H1, each question
 * section opens with its answer, and the original element carries its name.
 */
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Compass,
  FlaskConical,
  Gauge,
  Target,
  Wrench,
} from "lucide-react";
import { GuideBlocks } from "@/components/ai-seo/blocks";
import { Md } from "@/components/ai-seo/kit";
import { GuideHeading } from "@/components/ai-seo/sections";
import { PixelField } from "@/components/landing/Hero";
import { Reveal } from "@/components/landing/shared";
import { getFeature } from "@/data/features";
import { getTool } from "@/data/tools";
import type { GlossaryEntry, GlossaryQuestion, Original } from "@/data/glossary/types";
import { TERMS_AZ, getCategory, getTerm, type GlossaryTerm } from "@/data/glossary/terms";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { CiteActions, TermCard } from "./shared";

/* ---------- hero ---------- */

export function TermHero({
  term,
  entry,
  readingMinutes,
}: {
  term: GlossaryTerm;
  entry: GlossaryEntry;
  readingMinutes: number;
}) {
  const category = getCategory(term.category);
  return (
    <section
      id="top"
      aria-labelledby="term-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 pb-14 pt-10 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 lg:pb-20 lg:pt-12">
        <div className="min-w-0">
          <div className="max-w-3xl">
            <Reveal>
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/65">
                  <li>
                    <Link to="/" className="transition-colors hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li>
                    <Link to="/glossary" className="transition-colors hover:text-white">
                      Glossary
                    </Link>
                  </li>
                  <li aria-hidden>
                    <ChevronRight className="h-3 w-3" />
                  </li>
                  <li>
                    <Link
                      to="/glossary"
                      search={{ category: category.id }}
                      className="transition-colors hover:text-white"
                    >
                      {category.name}
                    </Link>
                  </li>
                </ol>
              </nav>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="term-title"
                className="mt-8 font-display text-balance text-[2.5rem] font-bold leading-[1.04] tracking-tight sm:text-[3.4rem] xl:text-[3.75rem]"
              >
                {term.term}
                {term.abbr && (
                  <span className="ml-3 align-middle font-mono text-[0.42em] font-semibold tracking-normal text-white/60">
                    {term.abbr}
                  </span>
                )}
              </h1>
            </Reveal>

            {/* The dictionary line: what it is grammatically, and what else
              people call it — the aliases searchers actually type. */}
            <Reveal delay={0.1}>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/75">
                <span className="font-serif italic text-white/90">noun</span>
                {term.aliases && term.aliases.length > 0 && (
                  <>
                    <span aria-hidden className="mx-2 text-white/40">
                      ·
                    </span>
                    also called{" "}
                    {term.aliases.map((a, i) => (
                      <span key={a}>
                        {i > 0 && (i === term.aliases!.length - 1 ? " or " : ", ")}
                        <span className="text-white">{a}</span>
                      </span>
                    ))}
                  </>
                )}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.16} y={24}>
            <figure className="relative mt-8 max-w-3xl rounded-2xl bg-card p-6 text-ink shadow-2xl shadow-brand-blue-deep/40 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <figcaption className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-volt">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Definition
                </figcaption>
                <CiteActions term={term} />
              </div>
              <p className="mt-4 text-[1.15rem] font-medium leading-[1.65] text-ink sm:text-[1.3rem]">
                <Md text={term.definition} />
              </p>
            </figure>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem] font-medium text-white/65">
              <span>
                Updated{" "}
                <time dateTime={term.updated} className="text-white">
                  {formatDate(term.updated)}
                </time>
              </span>
              <span aria-hidden>·</span>
              <span>{readingMinutes} min read</span>
              <span aria-hidden>·</span>
              <a href="#sources" className="underline-offset-4 hover:text-white hover:underline">
                {entry.sources.length} cited sources
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.26} className="hidden lg:mb-12 lg:block lg:self-end">
          <AtAGlance term={term} entry={entry} />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- at a glance ---------- */

/* Sits in the same column as the table-of-contents rail below, so the page
   keeps one right-hand axis. It puts the entry's exits — its topic, its
   original, its neighbours, the product — above the fold for skimmers. */
function AtAGlance({ term, entry }: { term: GlossaryTerm; entry: GlossaryEntry }) {
  const category = getCategory(term.category);
  const feature = getFeature(entry.product.feature);
  const original = ORIGINAL[entry.original.kind];
  const related = entry.related
    .slice(0, 3)
    .map(getTerm)
    .filter((t): t is GlossaryTerm => Boolean(t));
  const label = "text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/55";
  const link = "font-semibold text-white decoration-white/30 underline-offset-4 hover:underline";
  return (
    <aside
      aria-label="At a glance"
      className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm backdrop-blur-md"
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/75">
        At a glance
      </p>
      <dl className="mt-4 space-y-4">
        <div>
          <dt className={label}>Topic</dt>
          <dd className="mt-1">
            <Link to="/glossary" search={{ category: category.id }} className={link}>
              {category.name}
            </Link>
          </dd>
        </div>
        <div>
          <dt className={label}>{original.label}</dt>
          <dd className="mt-1">
            <a href={`#${original.id}`} className={link}>
              {entry.original.name}
            </a>
          </dd>
        </div>
        {related.length > 0 && (
          <div>
            <dt className={label}>Related</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  to="/glossary/$term"
                  params={{ term: t.slug }}
                  className="rounded-lg border border-white/25 bg-white/10 px-2 py-1 text-[0.78rem] font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-brand-blue"
                >
                  {t.abbr ?? t.term}
                </Link>
              ))}
            </dd>
          </div>
        )}
        {feature && (
          <div>
            <dt className={label}>Put it to work</dt>
            <dd className="mt-1">
              <Link
                to="/features/$slug"
                params={{ slug: feature.slug }}
                className={cn(link, "inline-flex items-center gap-1")}
              >
                {feature.name}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

/* ---------- why it matters ---------- */

export function WhyItMatters({ id, text }: { id: string; text: string }) {
  return (
    <section
      aria-labelledby={id}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2 sm:p-7"
    >
      <div className="pointer-events-none absolute inset-0 volt-glow" aria-hidden />
      <div className="relative">
        <h2
          id={id}
          className="flex scroll-mt-28 items-center gap-2.5 font-display text-[1.2rem] font-bold tracking-tight text-ink sm:text-[1.3rem]"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-volt text-white">
            <Target className="h-4 w-4" aria-hidden />
          </span>
          Why it matters for founders and small teams
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.1rem]">
          <Md text={text} />
        </p>
      </div>
    </section>
  );
}

/* ---------- a question ---------- */

/* The answer is set apart — larger, darker, on a rule — because it's the
   sentence an engine lifts when this section is the chunk it retrieves. */
export function QuestionSection({ q }: { q: GlossaryQuestion }) {
  return (
    <section aria-labelledby={q.id}>
      <GuideHeading id={q.id}>{q.question}</GuideHeading>
      <p className="mt-5 border-l-2 border-volt pl-4 text-[1.1rem] font-medium leading-[1.7] text-ink sm:text-[1.18rem]">
        <Md text={q.answer} />
      </p>
      <GuideBlocks blocks={q.blocks} idPrefix={q.id} />
    </section>
  );
}

/* ---------- the Rankbox original ---------- */

const ORIGINAL: Record<Original["kind"], { label: string; id: string; Icon: LucideIcon }> = {
  framework: { label: "Rankbox framework", id: "rankbox-framework", Icon: Compass },
  "worked-example": { label: "Worked example", id: "worked-example", Icon: FlaskConical },
  benchmark: { label: "Rankbox benchmark", id: "benchmark", Icon: Gauge },
};

export function originalAnchor(o: Original): string {
  return ORIGINAL[o.kind].id;
}

/**
 * The one part of the entry that isn't the consensus, so it's built to be
 * named: a labelled band with the original's name as the heading, then its
 * parts in the layout that suits the kind — numbered gates for a framework, a
 * running calculation for a worked example, thresholds for a benchmark.
 */
export function OriginalBlock({ original, slug }: { original: Original; slug: string }) {
  const meta = ORIGINAL[original.kind];
  const id = meta.id;
  return (
    <section
      aria-labelledby={id}
      className="mt-16 overflow-hidden rounded-3xl border border-border bg-card shadow-3"
    >
      <div className="relative overflow-hidden bg-brand-blue px-6 py-7 text-white sm:px-8 sm:py-8">
        <PixelField seed={11} />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
            <meta.Icon className="h-3.5 w-3.5" aria-hidden />
            {meta.label}
          </p>
          <h2
            id={id}
            className="mt-4 scroll-mt-28 font-display text-balance text-[1.6rem] font-bold leading-tight tracking-tight sm:text-[1.9rem]"
          >
            {original.name}
          </h2>
          <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-white/85">
            <Md text={original.summary} />
          </p>
        </div>
      </div>

      {original.kind === "framework" && <FrameworkItems original={original} />}
      {original.kind === "worked-example" && <WorkedItems original={original} />}
      {original.kind === "benchmark" && <BenchmarkItems original={original} />}

      {original.outcome && (
        <div className="border-t border-border bg-surface/60 px-6 py-5 sm:px-8">
          <p className="text-[0.98rem] leading-relaxed text-ink/85">
            <span className="font-semibold text-ink">
              {original.kind === "worked-example"
                ? "The result: "
                : original.kind === "benchmark"
                  ? "How to read it: "
                  : "How to use it: "}
            </span>
            <Md text={original.outcome} />
          </p>
        </div>
      )}
      <p className="border-t border-border px-6 py-3 text-[0.75rem] text-muted-foreground sm:px-8">
        Free to use and adapt. If you cite it, link to{" "}
        <a
          href={`#${id}`}
          className="font-medium text-ink/80 underline decoration-ink/20 underline-offset-4 hover:decoration-ink/60"
        >
          rankbox.xyz/glossary/{slug}
        </a>
        .
      </p>
    </section>
  );
}

function FrameworkItems({ original }: { original: Original }) {
  return (
    <ol className="grid gap-px bg-border sm:grid-cols-2">
      {original.items.map((item, i) => (
        <li key={item.label} className="bg-card p-6 sm:p-7">
          <span className="font-mono text-[0.72rem] font-semibold text-volt">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="mt-1.5 font-display text-[1.08rem] font-semibold leading-snug tracking-tight text-ink">
            {item.label}
          </p>
          <p className="mt-2 text-[0.93rem] leading-relaxed text-ink/75">
            <Md text={item.body} />
          </p>
        </li>
      ))}
    </ol>
  );
}

/* A running calculation: each step's figure sits in a right-hand column so
   the numbers read down like a ledger; the last row is the answer. */
function WorkedItems({ original }: { original: Original }) {
  const last = original.items.length - 1;
  return (
    <ol className="divide-y divide-border">
      {original.items.map((item, i) => (
        <li
          key={item.label}
          className={cn(
            "grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 gap-y-2 px-6 py-5 sm:grid-cols-[1.75rem_minmax(0,1fr)_auto] sm:px-8",
            i === last && "bg-volt/[0.05]",
          )}
        >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[0.72rem] font-semibold",
              i === last ? "border-volt bg-volt text-white" : "border-border text-ink",
            )}
          >
            {i === last ? "=" : i + 1}
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-ink">{item.label}</p>
            <p className="mt-1 text-[0.93rem] leading-relaxed text-ink/75">
              <Md text={item.body} />
            </p>
          </div>
          {item.value && (
            <p
              className={cn(
                "col-start-2 font-display font-bold tabular-nums tracking-tight sm:col-start-3 sm:row-start-1 sm:text-right",
                i === last ? "text-[1.6rem] text-volt" : "text-[1.15rem] text-ink",
              )}
            >
              {item.value}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

function BenchmarkItems({ original }: { original: Original }) {
  return (
    <dl className="divide-y divide-border">
      {original.items.map((item) => (
        <div
          key={item.label}
          className="grid gap-x-6 gap-y-1.5 px-6 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:px-8"
        >
          <dt className="order-2 sm:order-none">
            <span className="block font-display text-[1.5rem] font-bold leading-none tracking-tight text-ink">
              {item.value}
            </span>
          </dt>
          <dd className="order-1 min-w-0 sm:order-none">
            <p className="font-semibold leading-snug text-ink">{item.label}</p>
            <p className="mt-1 text-[0.93rem] leading-relaxed text-ink/75">
              <Md text={item.body} />
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- product ---------- */

export function ProductCard({ entry }: { entry: GlossaryEntry }) {
  const feature = getFeature(entry.product.feature);
  const tool = entry.tool ? getTool(entry.tool) : undefined;
  if (!feature) return null;
  const Icon = feature.icon;
  return (
    <aside
      aria-label={`Rankbox ${feature.name}`}
      className="relative mt-16 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2 sm:p-7"
    >
      <div className="pointer-events-none absolute inset-0 volt-glow" aria-hidden />
      <div className="relative">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Put it to work
        </p>
        <div className="mt-4 flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white shadow-sm">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[1.2rem] font-bold leading-tight tracking-tight text-ink">
              {feature.name}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{feature.tagline}</p>
          </div>
        </div>
        <p className="mt-4 text-[1rem] leading-relaxed text-ink/80">
          <Md text={entry.product.pitch} />
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            to="/features/$slug"
            params={{ slug: feature.slug }}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            See how {feature.name} works
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {tool && (
            <Link
              to="/tools/$slug"
              params={{ slug: tool.slug }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/25"
            >
              <Wrench className="h-4 w-4 text-muted-foreground" aria-hidden />
              Free tool: {tool.name}
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ---------- related terms ---------- */

export function RelatedTerms({ id, slugs }: { id: string; slugs: string[] }) {
  const terms = slugs.map(getTerm).filter((t): t is GlossaryTerm => Boolean(t));
  if (!terms.length) return null;
  return (
    <section aria-labelledby={id}>
      <GuideHeading id={id}>Related terms</GuideHeading>
      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {terms.map((t) => (
          <li key={t.slug}>
            <TermCard term={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- further reading ---------- */

export function FurtherReading({ items }: { items: NonNullable<GlossaryEntry["further"]> }) {
  if (!items.length) return null;
  return (
    <div className="mt-12">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Go deeper
      </p>
      <ul className="mt-4 grid gap-3">
        {items.map((r) => (
          <li key={r.href}>
            <a
              href={r.href}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-ink/20"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-ink">{r.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {r.description}
                </span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- A–Z pager ---------- */

/* Previous and next in alphabetical order, wrapping at the ends: a reader
   browsing the glossary never hits a dead end, and neither does a crawler. */
export function AzPager({ slug }: { slug: string }) {
  const i = TERMS_AZ.findIndex((t) => t.slug === slug);
  if (i < 0) return null;
  const prev = TERMS_AZ[(i - 1 + TERMS_AZ.length) % TERMS_AZ.length];
  const next = TERMS_AZ[(i + 1) % TERMS_AZ.length];
  const cell =
    "group flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-ink/20";
  return (
    <nav aria-label="Browse the glossary A to Z" className="mt-10 flex flex-col gap-3 sm:flex-row">
      <Link to="/glossary/$term" params={{ term: prev.slug }} className={cell}>
        <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Previous
        </span>
        <span className="mt-1.5 truncate font-semibold text-ink">{prev.term}</span>
      </Link>
      <Link to="/glossary/$term" params={{ term: next.slug }} className={cn(cell, "sm:text-right")}>
        <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:justify-end">
          Next
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
        <span className="mt-1.5 truncate font-semibold text-ink">{next.term}</span>
      </Link>
    </nav>
  );
}
