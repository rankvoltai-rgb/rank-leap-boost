/**
 * The middle of /alternatives/surfer-seo: the price ladder per article, the
 * matrix as one hairline table, the three deep dives with a small picture
 * each, where Surfer is the better buy, and how to run the two side by side.
 * All copy comes from src/data/competitors/surfer.ts; these only set it.
 */
import { Fragment, type ReactElement, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Columns2,
  Link2,
  Receipt,
  RotateCcw,
  Route,
  Scale,
  Target,
} from "lucide-react";
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
import { RedditMark } from "@/components/landing/ai-logos";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { getFeature } from "@/data/features";
import { PLAN, formatUsd } from "@/data/pricing";
import { cn } from "@/lib/utils";
import {
  RANKBOX_COST,
  formatCheckedOn,
  type Battleground,
  type Cell,
  type Competitor,
  type PricePlan,
} from "@/data/alternatives";
import { Kicker, StateLegend, StateMark } from "./ui";
import { accentTail } from "./text";

const TINT = "bg-[color-mix(in_oklab,var(--cta)_4%,white)]";

/* The matrix header sticks under the navbar from lg, opaque so rows pass
   cleanly beneath it. */
const HEAD = cn(
  "px-6 py-4 lg:sticky lg:top-[var(--top-chrome)] lg:z-10 lg:shadow-[inset_0_-1px_0_rgba(16,24,40,0.07)]",
  LINE,
);

/* ---------- Cost: every plan, per article ---------- */

function perArticle(p: PricePlan): number | null {
  return p.monthly !== null && p.articles ? Math.round((p.monthly / p.articles) * 100) / 100 : null;
}

/* Picking the plan is the easiest place for a comparison to cheat, so the
   whole ladder is here, with the compared plan marked rather than chosen
   for the reader. */
export function CostSection({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const pr = c.pricing;
  return (
    <section aria-labelledby="cost-title">
      <Spacer />
      <SectionHead
        icon={Receipt}
        eyebrow="What it costs"
        title={
          <span id="cost-title">
            Every {c.name} plan, <Accent>per article</Accent>
          </span>
        }
        subtitle={`A monthly price only means something next to what it produces. Here is every plan on ${c.name}'s pricing page, beside Rankbox's one.`}
      />
      <Band>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Rankbox and every {c.name} plan, with the price per article where a plan is sold that
            way
          </caption>
          <thead>
            <tr className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <th scope="col" className="px-5 py-4 font-semibold sm:px-8">
                Plan
              </th>
              <th scope="col" className="px-3 py-4 text-right font-semibold">
                Monthly
              </th>
              <th scope="col" className="hidden px-3 py-4 text-right font-semibold sm:table-cell">
                A month
              </th>
              <th scope="col" className="px-5 py-4 text-right font-semibold sm:px-8">
                Per article
              </th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className={cn("border-t", LINE, TINT)}>
              <th scope="row" className="px-5 py-4 font-normal sm:px-8">
                <span className="flex items-start gap-3">
                  <RankboxMark className="mt-0.5 h-7 w-7" />
                  <span className="min-w-0">
                    <span className="block text-[0.92rem] font-semibold text-ink">
                      Rankbox {PLAN.name}
                    </span>
                    <span className="block text-[0.78rem] text-muted-foreground">
                      {PLAN.articlesPerMonth} articles · {PLAN.backlinkCreditsPerMonth} backlink
                      credits · {PLAN.sites} site
                    </span>
                  </span>
                </span>
              </th>
              <td className="px-3 py-4 text-right text-[0.92rem] font-semibold text-ink">
                {formatUsd(PLAN.monthly)}
              </td>
              <td className="hidden px-3 py-4 text-right text-[0.92rem] text-ink sm:table-cell">
                {PLAN.articlesPerMonth}
              </td>
              <td className="px-5 py-4 text-right font-display text-[1.15rem] font-medium text-brand-blue sm:px-8">
                {formatUsd(RANKBOX_COST.perArticle)}
              </td>
            </tr>
            {pr.plans.map((p) => {
              const each = perArticle(p);
              const compared = p.name === pr.plan;
              return (
                <tr key={p.name} className={cn("border-t", LINE)}>
                  <th scope="row" className="px-5 py-4 font-normal sm:px-8">
                    <span className="flex items-start gap-3">
                      <CompetitorMark competitor={c} className="mt-0.5 h-7 w-7" />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2 text-[0.92rem] font-medium text-ink">
                          {p.name}
                          {compared && (
                            <span className="rounded-md border border-ink/[0.1] bg-white px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                              Compared
                            </span>
                          )}
                        </span>
                        {p.note && (
                          <span className="block text-[0.78rem] text-muted-foreground">
                            {p.note}
                          </span>
                        )}
                      </span>
                    </span>
                  </th>
                  <td className="px-3 py-4 text-right text-[0.92rem] text-ink">
                    {p.monthly === null ? "Custom" : formatUsd(p.monthly)}
                  </td>
                  <td className="hidden px-3 py-4 text-right text-[0.92rem] text-muted-foreground sm:table-cell">
                    {p.articles ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-right text-[0.92rem] text-ink sm:px-8">
                    {each !== null ? (
                      formatUsd(each)
                    ) : (
                      <span className="text-muted-foreground">Not per article</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Band>

      <Band>
        <div className="grid md:grid-cols-2">
          <div className="px-5 py-7 sm:px-8">
            <Kicker>
              {c.name} {pr.plan} covers
            </Kicker>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ink">{pr.covers}</p>
          </div>
          <div className={cn("border-t px-5 py-7 sm:px-8 md:border-l md:border-t-0", LINE)}>
            <Kicker>Worth knowing</Kicker>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/80">{pr.caveat}</p>
          </div>
        </div>
      </Band>
      <Band inner="px-5 py-4 text-center sm:px-8">
        <p className="mx-auto max-w-3xl text-[0.76rem] leading-relaxed text-muted-foreground">
          {pr.ladderNote ? `${pr.ladderNote} ` : ""}List prices from {c.name}&rsquo;s pricing page,
          checked {formatCheckedOn(pr.checkedOn)}, billed monthly; annual billing and promotions may
          lower them.
        </p>
      </Band>
    </section>
  );
}

/* ---------- The matrix ---------- */

function MobileLabel({ mark, name }: { mark: ReactNode; name: string }) {
  return (
    <span aria-hidden className="mb-2 flex items-center gap-2 lg:hidden">
      {mark}
      <span className="text-[0.75rem] font-semibold text-ink">{name}</span>
    </span>
  );
}

function CellNote({ cell, keyed }: { cell: Cell; keyed?: boolean }) {
  return (
    <span className="flex items-start gap-2.5">
      <StateMark state={cell.state} keyed={keyed} />
      <span
        className={cn(
          "text-[0.85rem] leading-snug",
          cell.state === "no" ? "text-muted-foreground" : "text-ink/85",
        )}
      >
        {cell.note}
      </span>
    </span>
  );
}

/* One table, two shapes. From lg it's a three-column hairline table with a
   sticky header; below that each row stacks (label, then Rankbox, then the
   competitor), with the explicit roles keeping it a table to assistive tech
   once the display changes. Nothing is rendered twice. */
export function MatrixSection({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const rowCount = c.matrix.reduce((n, g) => n + g.rows.length, 0);
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Columns2}
        eyebrow="Side by side"
        title={
          <span id="compare-title">
            Rankbox vs {c.name}, <Accent>in {rowCount} rows</Accent>
          </span>
        }
        subtitle={
          <>
            Every row is something a growth programme needs. Where {c.name} isn&rsquo;t built for
            one, we say what it <em>is</em> built for instead.
          </>
        }
      >
        <StateLegend className="mt-7" />
      </SectionHead>
      <Band>
        <table
          role="table"
          className="w-full border-separate border-spacing-0 text-left max-lg:block"
        >
          <caption className="sr-only">
            Rankbox and {c.name} compared, capability by capability
          </caption>
          <thead role="rowgroup" className="max-lg:sr-only">
            <tr role="row">
              <th role="columnheader" scope="col" className={cn(HEAD, "w-[34%] bg-white lg:pl-8")}>
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Capability
                </span>
              </th>
              <th
                role="columnheader"
                scope="col"
                className={cn(
                  HEAD,
                  "w-[33%] border-l bg-[color-mix(in_oklab,var(--cta)_5%,white)]",
                )}
              >
                <span className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-ink">
                  <RankboxMark className="h-7 w-7" />
                  Rankbox
                </span>
              </th>
              <th role="columnheader" scope="col" className={cn(HEAD, "w-[33%] border-l bg-white")}>
                <span className="flex items-center gap-2.5 text-[0.9rem] font-semibold text-ink">
                  <CompetitorMark competitor={c} className="h-7 w-7" />
                  {c.name}
                </span>
              </th>
            </tr>
          </thead>
          {c.matrix.map((g) => {
            const Icon = g.icon;
            return (
              <tbody key={g.group} role="rowgroup" className="max-lg:block">
                <tr role="row" className="max-lg:block">
                  <th
                    role="rowheader"
                    scope="colgroup"
                    colSpan={3}
                    className={cn("border-t px-5 py-2.5 max-lg:block sm:px-8", LINE, PANEL)}
                  >
                    <span className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink">
                      <Icon aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
                      {g.group}
                    </span>
                  </th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.label} role="row" className="align-top max-lg:block">
                    <th
                      role="rowheader"
                      scope="row"
                      className={cn(
                        "border-t px-5 pb-2 pt-5 font-normal max-lg:block sm:px-8 lg:py-5",
                        LINE,
                      )}
                    >
                      <span className="block text-[0.95rem] font-medium text-ink">{r.label}</span>
                      <span className="mt-1 block text-[0.8rem] leading-snug text-muted-foreground">
                        {r.detail}
                      </span>
                    </th>
                    <td
                      role="cell"
                      className={cn(
                        "max-lg:mx-5 max-lg:mt-2 max-lg:block max-lg:rounded-lg max-lg:px-3.5 max-lg:py-3 sm:max-lg:mx-8",
                        "lg:border-l lg:border-t lg:px-6 lg:py-5",
                        LINE,
                        TINT,
                      )}
                    >
                      <MobileLabel mark={<RankboxMark className="h-5 w-5" />} name="Rankbox" />
                      <CellNote cell={r.rankbox} keyed />
                    </td>
                    <td
                      role="cell"
                      className={cn(
                        "max-lg:mx-5 max-lg:mb-5 max-lg:mt-2 max-lg:block max-lg:rounded-lg max-lg:border max-lg:px-3.5 max-lg:py-3 sm:max-lg:mx-8",
                        "lg:border-l lg:border-t lg:px-6 lg:py-5",
                        LINE,
                      )}
                    >
                      <MobileLabel
                        mark={<CompetitorMark competitor={c} className="h-5 w-5" />}
                        name={c.name}
                      />
                      <CellNote cell={r.them} />
                    </td>
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </Band>
      <Band inner="px-5 py-4 text-center sm:px-8">
        <p className="mx-auto max-w-3xl text-[0.76rem] leading-relaxed text-muted-foreground">
          Compiled from {c.name}&rsquo;s public documentation and pricing pages, last reviewed{" "}
          {formatCheckedOn(c.pricing.checkedOn)}. Rankbox&rsquo;s column is what ships today.
          Products change, so check theirs before you decide, and tell us if a row is wrong.
        </p>
      </Band>
    </section>
  );
}

/* ---------- Battlegrounds ---------- */

/* Small still pictures, one per deep dive, keyed by the feature it links to.
   Generic on purpose: a sample site, no numbers that aren't in the plan. */
function WriterPicture() {
  return (
    <div className="rounded-lg border border-ink/[0.08] bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[0.68rem] text-muted-foreground">yoursite.com/blog</span>
        <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
          Ready
        </span>
      </div>
      <div className="mt-3 h-2 w-4/5 rounded-full bg-ink/70" />
      <div className="mt-3 space-y-1.5">
        {[92, 86, 70].map((w, i) => (
          <div key={w} className="flex items-center gap-1.5">
            <span className="h-1.5 rounded-full bg-ink/[0.1]" style={{ width: `${w - 12}%` }} />
            <span className="rounded-sm bg-cta-soft px-1 text-[0.55rem] font-semibold leading-tight text-cta">
              {i + 1}
            </span>
          </div>
        ))}
      </div>
      <div className={cn("mt-3 border-t pt-2.5", LINE)}>
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          References
        </span>
        <div className="mt-1.5 space-y-1">
          <div className="h-1.5 w-3/5 rounded-full bg-ink/[0.08]" />
          <div className="h-1.5 w-2/5 rounded-full bg-ink/[0.08]" />
        </div>
      </div>
    </div>
  );
}

function GatePicture() {
  const steps = ["Draft", "Checks", "Rewrite", "Ready"];
  return (
    <div className="rounded-lg border border-ink/[0.08] bg-white px-3 py-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between gap-1">
        {steps.map((s, i) => (
          <Fragment key={s}>
            {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-ink/30" />}
            <span
              className={cn(
                "rounded-md px-2 py-1 text-[0.68rem] font-medium",
                i === steps.length - 1
                  ? "bg-cta text-white"
                  : i === 2
                    ? "bg-cta-soft text-cta"
                    : "border border-ink/[0.1] bg-white text-ink",
              )}
            >
              {s}
            </span>
          </Fragment>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[0.66rem] text-muted-foreground">
        <RotateCcw className="h-3 w-3 text-cta" />
        Failing checks go back for a rewrite
      </div>
    </div>
  );
}

function LinksPicture() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5 rounded-lg border border-ink/[0.08] bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-cta">
          <Link2 className="h-3.5 w-3.5" />
        </span>
        <span className="text-[0.75rem] text-ink">Backlink credits</span>
        <span className="ml-auto text-[0.75rem] font-semibold tabular-nums text-brand-blue">
          {PLAN.backlinkCreditsPerMonth} / mo
        </span>
      </div>
      <div className="flex items-center gap-2.5 rounded-lg border border-ink/[0.08] bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
          <RedditMark className="h-3.5 w-3.5" />
        </span>
        <span className="text-[0.75rem] text-ink">Reddit reply</span>
        <span className="ml-auto rounded-md border border-ink/[0.1] px-1.5 py-0.5 text-[0.62rem] font-semibold text-muted-foreground">
          Draft
        </span>
      </div>
    </div>
  );
}

const PICTURES: Record<string, () => ReactElement> = {
  "citation-ready-writer": WriterPicture,
  "seo-geo-score": GatePicture,
  "authority-backlinks": LinksPicture,
};

function DeepDive({ b, i }: { b: Battleground; i: number }) {
  const feature = getFeature(b.featureSlug);
  const Picture = PICTURES[b.featureSlug];
  const Icon = b.icon;
  return (
    <li className={CELL}>
      <Reveal delay={i * 0.06} className="flex h-full flex-col">
        <div
          aria-hidden
          className={cn("flex h-52 items-center border-b px-6 sm:px-8", LINE, PANEL)}
        >
          <div className="mx-auto w-full max-w-[17rem]">
            {Picture ? (
              <Picture />
            ) : (
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-ink/[0.08] bg-white text-brand-blue">
                <Icon className="h-5 w-5" />
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col px-6 py-7 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
              <Icon aria-hidden className="h-3.5 w-3.5" />
            </span>
            <span className="text-[0.75rem] font-medium tabular-nums text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-4 text-[1.15rem] font-semibold tracking-tight text-ink">{b.title}</h3>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{b.body}</p>
          <ul className="mt-5 space-y-2">
            {b.points.map((pt) => (
              <li key={pt} className="flex gap-2.5 text-[0.84rem] leading-snug text-ink">
                <span
                  aria-hidden
                  className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue"
                />
                {pt}
              </li>
            ))}
          </ul>
          {feature && (
            <div className="mt-auto pt-6">
              <Link to="/features/$slug" params={{ slug: feature.slug }} className={GHOST_BUTTON}>
                How {feature.name} works
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </Reveal>
    </li>
  );
}

export function BattlegroundsSection({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section aria-labelledby="decided-title">
      <Spacer />
      <SectionHead
        icon={Target}
        eyebrow="Where it's decided"
        title={
          <span id="decided-title">
            {c.battlegroundsTitle ? (
              accentTail(c.battlegroundsTitle, 3)
            ) : (
              <>
                Three things Rankbox does that {c.name} <Accent>doesn&rsquo;t set out to</Accent>
              </>
            )}
          </span>
        }
        subtitle={
          c.battlegroundsIntro ??
          "Not a longer list of features — the three that change what actually happens on your site."
        }
      />
      <Band>
        <CellGrid className="lg:grid-cols-3">
          {c.battlegrounds.map((b, i) => (
            <DeepDive key={b.title} b={b} i={i} />
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- When they win ---------- */

/* Styled plainly on purpose: no blue ticks, the competitor's own mark, and
   the cases written straight from the data. */
export function BetterWhenSection({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section aria-labelledby="better-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Scale} className="w-fit">
              The honest part
            </Pill>
            <h2
              id="better-title"
              className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              When {c.name} is <Accent>the better choice</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              We&rsquo;d rather you picked the right tool than churned in a month. {c.name} is
              genuinely the better buy in these cases.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <CompetitorMark competitor={c} className="h-10 w-10" />
              <div>
                <p className="text-[0.9rem] font-semibold text-ink">{c.name}</p>
                <p className="text-[0.78rem] text-muted-foreground">{c.oneLiner}</p>
              </div>
            </div>
          </Reveal>
          <ol className={cn("divide-y", "divide-ink/[0.07]")}>
            {c.betterWhen.map((w, i) => (
              <li key={w.title}>
                <Reveal delay={i * 0.06} className="flex gap-5 px-5 py-8 sm:px-10 lg:px-12">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-[0.78rem] font-semibold tabular-nums text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                      {w.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                      {w.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Alongside, not instead ---------- */

export function AlongsideSection({ competitor }: { competitor: Competitor }) {
  const m = competitor.migration;
  return (
    <section aria-labelledby="alongside-title">
      <Spacer />
      <SectionHead
        icon={Route}
        eyebrow="Using both"
        title={<span id="alongside-title">{accentTail(m.title, 2)}</span>}
        subtitle={m.body}
      />
      <Band>
        <CellGrid className="md:grid-cols-3">
          {m.steps.map((s, i) => (
            <li key={s.title} className={cn(CELL, "relative")}>
              <Reveal delay={i * 0.07} className="h-full px-6 py-8 sm:px-8 sm:py-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cta text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)]">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
              {i < m.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-[3.1rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-ink/[0.1] bg-white text-ink/60 md:flex sm:top-[3.6rem]"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}
