/**
 * The rest of /alternatives/rankpill, after the hero: the quotable answer
 * with the at-a-glance table, the three places the products differ (the
 * first worked as a credit calculator), when RankPill is the better buy, the
 * questions, the paper trail, the other comparisons, and the closing band.
 *
 * All copy about either product is read from the data. The headings added
 * here are structural and make no claim of their own.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookCheck,
  Check,
  Handshake,
  HelpCircle,
  MessageSquareQuote,
  Scale,
  Shuffle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { COMPANY } from "@/data/company";
import { getFeature } from "@/data/features";
import { PLAN, formatUsd } from "@/data/pricing";
import {
  COMPETITORS,
  KIND_LABEL,
  RANKBOX_SNAPSHOT,
  formatCheckedOn,
  formatCheckedOnShort,
  type Battleground,
  type Competitor,
  type Fact,
} from "@/data/alternatives";
import { CreditSplit } from "./credits";
import { StateMark } from "./parts";
import { CARD, RANKBOX_TINT, displayUrl, splitTail, theirCredits } from "./lib";

/* ---------- The short answer, and the facts at a glance ---------- */

type Glance = string | Fact;

function glanceRows(c: Competitor): { label: string; rankbox: Glance; them: Glance }[] {
  return [
    { label: "Best for", rankbox: RANKBOX_SNAPSHOT.bestFor, them: c.snapshot.bestFor },
    {
      label: "Price",
      rankbox: `${formatUsd(PLAN.monthly)}/mo`,
      them: `${formatUsd(c.pricing.monthly)}/mo · ${c.pricing.plan}`,
    },
    {
      label: "Articles included",
      rankbox: `${PLAN.articlesPerMonth} a month`,
      them: c.pricing.articles ? `${c.pricing.articles} a month` : "Not sold per article",
    },
    { label: "Publishing", rankbox: RANKBOX_SNAPSHOT.publishing, them: c.snapshot.publishing },
    { label: "Backlinks", rankbox: RANKBOX_SNAPSHOT.backlinks, them: c.snapshot.backlinks },
    {
      label: "AI visibility",
      rankbox: RANKBOX_SNAPSHOT.aiVisibility,
      them: c.snapshot.aiVisibility,
    },
    { label: "Keyword data", rankbox: RANKBOX_SNAPSHOT.keywordData, them: c.snapshot.keywordData },
  ];
}

function GlanceValue({ value, rankbox = false }: { value: Glance; rankbox?: boolean }) {
  if (typeof value === "string") {
    return (
      <span
        className={cn(
          "text-[0.84rem] leading-snug",
          rankbox ? "font-medium text-ink" : "text-ink/75",
        )}
      >
        {value}
      </span>
    );
  }
  return (
    <span className="flex items-start gap-2">
      <StateMark state={value.state} rankbox={rankbox} />
      <span
        className={cn(
          "text-[0.84rem] leading-snug",
          rankbox ? "font-medium text-ink" : "text-ink/75",
        )}
      >
        {value.short}
      </span>
    </span>
  );
}

export function ShortAnswer({ competitor: c }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="short-answer-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <Reveal className="px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
            <Pill icon={MessageSquareQuote}>Rankbox vs {c.name}</Pill>
            <h2
              id="short-answer-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
            >
              The short <Accent>answer</Accent>
            </h2>
            <p className="mt-5 text-[1.02rem] leading-[1.75] text-ink/85 sm:text-[1.1rem]">
              {c.shortAnswer}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className={cn("flex gap-3 rounded-xl border border-cta/20 p-4", RANKBOX_TINT)}>
                <RankboxMark className="h-8 w-8" />
                <div className="min-w-0">
                  <p className="text-[0.85rem] font-semibold text-ink">Rankbox</p>
                  <p className="mt-0.5 text-[0.84rem] leading-snug text-muted-foreground">
                    {c.verdict.rankbox}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-ink/[0.08] bg-white p-4">
                <CompetitorMark competitor={c} className="h-8 w-8" />
                <div className="min-w-0">
                  <p className="text-[0.85rem] font-semibold text-ink">{c.name}</p>
                  <p className="mt-0.5 text-[0.84rem] leading-snug text-muted-foreground">
                    {c.verdict.them}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className={cn("border-t lg:border-l lg:border-t-0", LINE)}>
            <table role="table" className="w-full border-collapse text-left max-sm:block">
              <caption className="px-5 pb-4 pt-6 text-left sm:px-8 lg:pt-10">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[0.95rem] font-semibold text-ink">At a glance</span>
                  <span className="rounded-md bg-ink/[0.04] px-2 py-0.5 text-[0.68rem] font-medium text-muted-foreground">
                    Checked {formatCheckedOnShort(c.pricing.checkedOn)}
                  </span>
                </span>
              </caption>
              <thead role="rowgroup" className="max-sm:block">
                <tr role="row" className={cn("border-t max-sm:grid max-sm:grid-cols-2", LINE)}>
                  <th
                    role="columnheader"
                    scope="col"
                    className="w-[28%] px-5 py-3 max-sm:hidden sm:pl-8"
                  >
                    <span className="sr-only">Fact</span>
                  </th>
                  <th
                    role="columnheader"
                    scope="col"
                    className={cn("border-l px-4 py-3 max-sm:border-l-0", LINE, RANKBOX_TINT)}
                  >
                    <span className="flex items-center gap-2 text-[0.82rem] font-semibold text-cta">
                      <RankboxMark className="h-5 w-5" />
                      Rankbox
                    </span>
                  </th>
                  <th
                    role="columnheader"
                    scope="col"
                    className={cn("border-l px-4 py-3 sm:pr-8", LINE)}
                  >
                    <span className="flex items-center gap-2 text-[0.82rem] font-semibold text-ink">
                      <CompetitorMark competitor={c} className="h-5 w-5 text-[0.45rem]" />
                      {c.name}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup" className="max-sm:block">
                {glanceRows(c).map((r) => (
                  <tr
                    key={r.label}
                    role="row"
                    className={cn("border-t max-sm:grid max-sm:grid-cols-2", LINE)}
                  >
                    <th
                      role="rowheader"
                      scope="row"
                      className="px-5 pt-3 align-top text-[0.72rem] font-medium uppercase tracking-[0.1em] text-muted-foreground max-sm:col-span-2 max-sm:pb-0 sm:py-3.5 sm:pl-8"
                    >
                      {r.label}
                    </th>
                    <td
                      role="cell"
                      className={cn(
                        "border-l px-4 py-3 align-top max-sm:border-l-0 sm:py-3.5",
                        LINE,
                        RANKBOX_TINT,
                      )}
                    >
                      <GlanceValue value={r.rankbox} rankbox />
                    </td>
                    <td
                      role="cell"
                      className={cn("border-l px-4 py-3 align-top sm:py-3.5 sm:pr-8", LINE)}
                    >
                      <GlanceValue value={r.them} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p
              className={cn(
                "border-t px-5 py-4 text-[0.75rem] leading-relaxed text-muted-foreground sm:px-8",
                LINE,
              )}
            >
              {c.name} facts from its own pages; Rankbox facts are what ships today.{" "}
              <a
                href="#rows"
                className="font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
              >
                Every row
              </a>{" "}
              and{" "}
              <a
                href="#sources"
                className="font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
              >
                the sources
              </a>{" "}
              are below.
            </p>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Where the two differ ---------- */

function Deep({ b, index, className }: { b: Battleground; index: number; className?: string }) {
  const Icon = b.icon;
  const feature = getFeature(b.featureSlug);
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-[0.75rem] font-semibold tabular-nums text-cta">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-5 text-balance font-display text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.55rem]">
        {b.title}
      </h3>
      <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">{b.body}</p>
      <ul className="mt-5 space-y-2.5">
        {b.points.map((pt) => (
          <li key={pt} className="flex gap-3 text-[0.88rem] leading-snug text-ink">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
            </span>
            {pt}
          </li>
        ))}
      </ul>
      {feature && (
        <Link
          to="/features/$slug"
          params={{ slug: feature.slug }}
          className={cn(GHOST_BUTTON, "group mt-6")}
        >
          How {feature.name} works
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Differences({ competitor: c }: { competitor: Competitor }) {
  const title = c.battlegroundsTitle ?? `Where Rankbox and ${c.name} differ`;
  const [lead, tail] = splitTail(title, 2);
  /* The credits deep dive gets the calculator; the others share a row. */
  const creditsAt =
    theirCredits(c) !== null
      ? c.battlegrounds.findIndex((b) => b.featureSlug === "authority-backlinks")
      : -1;
  const rest = c.battlegrounds.map((b, i) => ({ b, i })).filter(({ i }) => i !== creditsAt);

  return (
    <section
      id="differences"
      aria-labelledby="diff-title"
      className="scroll-mt-[var(--top-chrome)]"
    >
      <Spacer />
      <SectionHead
        icon={Scale}
        eyebrow="Where it's decided"
        title={
          <span id="diff-title">
            {lead}
            <Accent>{tail}</Accent>
          </span>
        }
        subtitle={c.battlegroundsIntro}
      />

      {creditsAt !== -1 && (
        <Band>
          <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <Reveal className="px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
              <Deep b={c.battlegrounds[creditsAt]} index={creditsAt} />
            </Reveal>
            <div
              className={cn(
                "flex items-center border-t px-4 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-10",
                LINE,
                PANEL,
              )}
            >
              <Reveal delay={0.08} className="mx-auto w-full max-w-[30rem]">
                <CreditSplit competitor={c} />
              </Reveal>
            </div>
          </div>
        </Band>
      )}

      {rest.length > 0 && (
        <Band>
          <CellGrid className={rest.length > 1 ? "md:grid-cols-2" : undefined}>
            {rest.map(({ b, i }, k) => (
              <li key={b.title} className={cn(CELL, "px-5 py-10 sm:px-10 lg:px-12 lg:py-12")}>
                <Reveal delay={k * 0.06}>
                  <Deep b={b} index={i} />
                </Reveal>
              </li>
            ))}
          </CellGrid>
        </Band>
      )}
    </section>
  );
}

/* ---------- When they're the better buy ---------- */

export function BetterWhen({ competitor: c }: { competitor: Competitor }) {
  return (
    <section aria-labelledby="better-title">
      <Spacer />
      <SectionHead
        icon={Handshake}
        eyebrow="The honest part"
        title={
          <span id="better-title">
            When {c.name} is <Accent>the better buy</Accent>
          </span>
        }
        subtitle={`We'd rather you picked the right tool than churned in a month. In these cases, ${c.name} is the better choice.`}
      />
      <Band inner={cn(PANEL, "px-4 py-10 sm:px-8 lg:px-10 lg:py-12")}>
        <ol className="grid gap-4 md:grid-cols-3">
          {c.betterWhen.map((w, i) => (
            <li key={w.title}>
              <Reveal delay={i * 0.06} className={cn(CARD, "flex h-full flex-col p-6")}>
                <div className="flex items-center justify-between">
                  <CompetitorMark competitor={c} className="h-8 w-8" />
                  <span className="text-[0.75rem] font-semibold tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-[1.02rem] font-semibold leading-snug tracking-tight text-ink">
                  {w.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
                  {w.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* ---------- Questions ---------- */

/* Every answer is open, plain text in the server HTML: the route's FAQPage
   JSON-LD is built from the same strings. */
export function Questions({ competitor: c }: { competitor: Competitor }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <Band inner="px-5 py-10 sm:px-10 lg:px-12 lg:py-12">
        <Pill icon={HelpCircle}>FAQ</Pill>
        <h2
          id="faq-title"
          className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
        >
          Rankbox vs {c.name}, <Accent>answered</Accent>
        </h2>
        <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          The questions people ask before switching from {c.name}.
        </p>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-2">
          {c.faqs.map((f, i) => (
            <li key={f.q} className={cn(CELL, "px-5 py-7 sm:px-10 lg:px-12")}>
              <Reveal delay={(i % 2) * 0.05}>
                <h3 className="flex gap-3 text-[1rem] font-semibold leading-snug tracking-tight text-ink">
                  <span className="mt-px text-[0.75rem] font-semibold tabular-nums text-cta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.q}
                </h3>
                <p className="mt-2.5 pl-[1.85rem] text-[0.9rem] leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Sources ---------- */

export function Sources({ competitor: c }: { competitor: Competitor }) {
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-[var(--top-chrome)]">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal
            className={cn(
              "min-w-0 border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={BookCheck}>Sources</Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            >
              How this comparison <Accent>was checked</Accent>
            </h2>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-muted-foreground">
              Every {c.name} fact on this page comes from {c.name}&rsquo;s own public pages, read on{" "}
              {formatCheckedOn(c.pricing.checkedOn)}. Anything we could not confirm there is left
              out. Rankbox facts describe what ships today, not what is planned.
            </p>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-muted-foreground">
              Spotted something out of date?{" "}
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Correction: Rankbox vs ${c.name}`)}`}
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                Email {COMPANY.email}
              </a>{" "}
              and we will fix the row.
            </p>
          </Reveal>

          <ol className="min-w-0 divide-y divide-ink/[0.07] self-center">
            {c.sources.map((src, i) => (
              <li key={src.url}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] sm:px-8 lg:px-10"
                >
                  <span className="w-5 shrink-0 text-[0.75rem] font-semibold tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9rem] font-medium text-ink">{src.label}</span>
                    <span className="block truncate font-mono text-[0.72rem] text-muted-foreground">
                      {displayUrl(src.url)}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- The other comparisons ---------- */

/* The same kind of tool first: someone weighing RankPill is most likely
   weighing another autopilot next. */
export function OtherComparisons({ competitor: c }: { competitor: Competitor }) {
  const others = COMPETITORS.filter((o) => o.slug !== c.slug).sort(
    (a, b) => Number(b.kind === c.kind) - Number(a.kind === c.kind),
  );
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="flex flex-col gap-5 px-5 py-10 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-12">
        <div>
          <Pill icon={Shuffle}>More comparisons</Pill>
          <h2
            id="others-title"
            className="mt-5 font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
          >
            Comparing <Accent>something else?</Accent>
          </h2>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            The same questions, asked of the other tools founders shortlist.
          </p>
        </div>
        <Link to="/alternatives" className={cn(GHOST_BUTTON, "group w-fit shrink-0")}>
          All comparisons
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <li key={o.slug} className={CELL}>
              <Link
                to="/alternatives/$slug"
                params={{ slug: o.slug }}
                className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
              >
                <span className="flex items-center justify-between gap-3">
                  <CompetitorMark competitor={o} className="h-9 w-9" />
                  {o.kind === c.kind ? (
                    <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
                      {KIND_LABEL[o.kind]}
                    </span>
                  ) : (
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                    />
                  )}
                </span>
                <span className="mt-4 text-[0.98rem] font-semibold tracking-tight text-ink">
                  Rankbox vs {o.name}
                </span>
                <span className="mt-1 text-[0.82rem] leading-relaxed text-muted-foreground">
                  {o.oneLiner}
                </span>
              </Link>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Closing band ---------- */

/* Blue band, white type, the URL field in a white tray so the blue button
   still reads. A Rankbox receipt rises from the band's foot, cut off by it:
   the hero's picture, settled on one side. */
export function ClosingBand({ competitor: c }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  const lines = [
    `${PLAN.articlesPerMonth} articles a month`,
    `${PLAN.sites} ${PLAN.sites === 1 ? "website" : "websites"}`,
    `${PLAN.backlinkCreditsPerMonth} backlink credits`,
  ];
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <div className="relative px-5 pt-14 text-center sm:px-8 sm:pt-20">
          <Reveal>
            <div aria-hidden className="mb-6 flex items-center justify-center gap-2.5">
              <RankboxMark className="h-9 w-9" onDark />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/75">
                vs
              </span>
              <CompetitorMark competitor={c} className="h-9 w-9" onDark />
            </div>
            <h2
              id="cta-title"
              className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              {c.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {c.ctaBody}
            </p>
            <div className="mx-auto mt-8 max-w-[37rem] rounded-xl bg-white p-2 text-left shadow-[0_1px_2px_rgba(4,24,72,0.2),0_16px_40px_-20px_rgba(4,24,72,0.6)]">
              <UrlForm url={url} onChange={setUrl} variant="split" />
            </div>
            <p className="mt-3.5 text-[0.85rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>

          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[11rem] max-w-[22rem] overflow-hidden text-left sm:mt-14 sm:h-[12.5rem]"
          >
            <div
              aria-hidden
              className="rounded-t-xl bg-white px-5 pb-8 pt-5 shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[0.85rem] font-semibold text-ink">
                  <RankboxMark className="h-6 w-6" />
                  Rankbox
                </span>
                <span className="text-[0.72rem] text-muted-foreground">{PLAN.name}</span>
              </div>
              <ul className="mt-4 space-y-2 border-t border-dashed border-ink/[0.14] pt-3">
                {lines.map((l) => (
                  <li key={l} className="flex items-center justify-between text-[0.8rem] text-ink">
                    {l}
                    <StateMark state="yes" rankbox />
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-baseline justify-between border-t border-dashed border-ink/[0.14] pt-3">
                <span className="text-[0.66rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Per month
                </span>
                <span className="font-display text-[1.6rem] font-medium tracking-[-0.03em] text-cta tabular-nums">
                  {formatUsd(PLAN.monthly)}
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
