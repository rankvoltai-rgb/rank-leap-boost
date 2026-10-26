/**
 * The middle of /alternatives/koala-ai: what each product is, where Koala is
 * the better buy, the three places the two really part ways, and how to
 * switch. All copy is the competitor's entry in src/data/competitors/koala.ts;
 * these only decide how it's set.
 */
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  FileText,
  Link2,
  MessageSquare,
  Route,
  Scale,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  LINE_FILL,
  PANEL,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { getFeature } from "@/data/features";
import { PLAN, formatUsd } from "@/data/pricing";
import { RANKBOX_COST, type Battleground, type Competitor } from "@/data/alternatives";
import { AccentTail } from "./parts";
import { CARD, RANKBOX_TINT } from "./tokens";

/* ---------- What each one is ---------- */

export function Positioning({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const p = c.positioning;
  return (
    <section aria-labelledby="difference-title">
      <Spacer />
      <SectionHead
        icon={Scale}
        eyebrow="The real difference"
        title={
          <span id="difference-title">
            <AccentTail text={p.title} words={4} />
          </span>
        }
        subtitle={p.body}
      />
      <Band>
        <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          <Reveal className={cn("h-full", RANKBOX_TINT)}>
            <div className="flex h-full flex-col px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex items-center gap-3">
                <RankboxMark className="h-10 w-10" />
                <div>
                  <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                    {p.rankboxTitle}
                  </h3>
                  {p.rankboxTag && (
                    <p className="text-[0.8rem] text-muted-foreground">{p.rankboxTag}</p>
                  )}
                </div>
              </div>
              <ul className="mt-6">
                {p.rankbox.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex gap-3 border-t py-3.5 text-[0.93rem] leading-snug text-ink",
                      LINE,
                    )}
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.06} className="h-full bg-white">
            <div className="flex h-full flex-col px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex items-center gap-3">
                <CompetitorMark competitor={c} className="h-10 w-10" />
                <div>
                  <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
                    {p.themTitle}
                  </h3>
                  <p className="text-[0.8rem] text-muted-foreground">{c.category}</p>
                </div>
              </div>
              <ul className="mt-6">
                {p.them.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "flex gap-3 border-t py-3.5 text-[0.93rem] leading-snug text-ink/80",
                      LINE,
                    )}
                  >
                    <span
                      aria-hidden
                      className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[color-mix(in_oklab,var(--ink)_35%,white)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Where Koala wins ---------- */

export function BetterWhen({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section id="better-when" aria-labelledby="better-title">
      <Spacer />
      <SectionHead
        icon={ThumbsUp}
        eyebrow={`Where ${c.name} wins`}
        title={
          <span id="better-title">
            When {c.name} is <Accent>the better choice</Accent>
          </span>
        }
        subtitle={`If one of these describes you, ${c.name} is the better buy.`}
      />
      <Band>
        <CellGrid className="md:grid-cols-3">
          {c.betterWhen.map((w, i) => (
            <li key={w.title} className={CELL}>
              <Reveal delay={i * 0.06} className="flex h-full flex-col px-6 py-8 sm:px-8 sm:py-10">
                <div className="flex items-center justify-between">
                  <CompetitorMark competitor={c} className="h-9 w-9" />
                  <span className="font-display text-[1.6rem] font-medium leading-none tracking-[-0.03em] text-ink/15 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-[1.05rem] font-semibold leading-snug tracking-tight text-ink">
                  {w.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
                  {w.body}
                </p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Where they part ways ---------- */

/* Small, still pictures of what each difference looks like in the product.
   Every number is read from the pricing data; the Reddit thread is drawn
   as blank lines rather than invented words. */

function PerArticleReceipt() {
  return (
    <div className={cn(CARD, "mx-auto w-full max-w-sm p-5 sm:p-6")}>
      <div className="flex items-center gap-2.5">
        <RankboxMark className="h-7 w-7" />
        <p className="text-[0.9rem] font-semibold text-ink">Rankbox {PLAN.name}</p>
      </div>
      <dl className="mt-5 space-y-2.5 text-[0.85rem]">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Price a month</dt>
          <dd className="font-medium tabular-nums text-ink">{formatUsd(PLAN.monthly)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Articles</dt>
          <dd className="font-medium tabular-nums text-ink">{PLAN.articlesPerMonth}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Word meter</dt>
          <dd className="font-medium text-ink">None</dd>
        </div>
        <div
          className={cn(
            "flex items-end justify-between border-t border-dashed pt-3.5",
            "border-ink/[0.12]",
          )}
        >
          <dt className="text-muted-foreground">Per article</dt>
          <dd className="font-display text-[1.9rem] font-medium leading-none tracking-[-0.03em] text-cta tabular-nums">
            {formatUsd(RANKBOX_COST.perArticle)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function EscrowTrack() {
  const stages = ["Held in escrow", "Published", "Verified"];
  return (
    <div className={cn(CARD, "mx-auto w-full max-w-sm p-5 sm:p-6")}>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[0.9rem] font-semibold text-ink">
          <Link2 className="h-4 w-4 text-brand-blue" aria-hidden />
          Backlink credits
        </p>
        <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-cta">
          {PLAN.backlinkCreditsPerMonth} this month
        </span>
      </div>
      <div aria-hidden className="mt-4 grid grid-cols-10 gap-1">
        {Array.from({ length: PLAN.backlinkCreditsPerMonth }, (_, i) => (
          <span key={i} className={cn("h-2 rounded-full", i < 3 ? "bg-cta" : "bg-cta/[0.14]")} />
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-ink/[0.07] bg-white p-3.5">
        <p className="text-[0.8rem] font-medium text-ink">A link in a member&rsquo;s article</p>
        <ol className="mt-3 flex items-center gap-1.5">
          {stages.map((s, i) => (
            <li key={s} className="flex min-w-0 flex-1 items-center gap-1.5">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  i < 2 ? "bg-cta text-white" : "border border-cta/40 bg-white text-cta",
                )}
              >
                {i < 2 ? (
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                ) : (
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                )}
              </span>
              <span className="truncate text-[0.7rem] font-medium text-ink/80">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ReplyDraft() {
  const Lines = ({ widths }: { widths: string[] }) => (
    <span aria-hidden className="mt-2.5 block space-y-1.5">
      {widths.map((w, i) => (
        <span key={i} className="block h-1.5 rounded-full bg-ink/[0.08]" style={{ width: w }} />
      ))}
    </span>
  );
  return (
    <div className={cn(CARD, "mx-auto w-full max-w-sm p-5 sm:p-6")}>
      <div className="rounded-lg border border-ink/[0.07] bg-white p-3.5">
        <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          Thread found
        </p>
        <Lines widths={["92%", "78%", "54%"]} />
      </div>
      <div className="ml-5 mt-2.5 rounded-lg border border-cta/30 bg-cta-soft/60 p-3.5">
        <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-cta">
          <FileText className="h-3.5 w-3.5" aria-hidden />
          Reply drafted
        </p>
        <Lines widths={["88%", "95%", "70%", "40%"]} />
      </div>
      <p className="ml-5 mt-3 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ink/70">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-ink/20">
          <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
        </span>
        You post it
      </p>
    </div>
  );
}

const PICTURES: Partial<Record<string, () => React.ReactElement>> = {
  "answer-space-research": PerArticleReceipt,
  "authority-backlinks": EscrowTrack,
  "reddit-presence": ReplyDraft,
};

function Difference({ b, i }: { b: Battleground; i: number }) {
  const feature = getFeature(b.featureSlug);
  const Picture = PICTURES[b.featureSlug];
  const Icon = b.icon;
  const flip = i % 2 === 1;
  return (
    <Band>
      <div className={cn("grid", Picture && "lg:grid-cols-2")}>
        <Reveal
          className={cn(
            "flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14",
            flip && "lg:order-2",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-[0.78rem] font-semibold tabular-nums text-brand-blue">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-5 font-display text-[1.45rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.7rem]">
            {b.title}
          </h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{b.body}</p>
          <ul className="mt-6 space-y-2.5">
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
              className={cn(GHOST_BUTTON, "group mt-7 w-fit")}
            >
              How {feature.name} works
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          )}
        </Reveal>
        {Picture && (
          <div
            className={cn(
              "flex items-center border-t px-5 py-10 sm:px-10 lg:border-t-0 lg:py-14",
              LINE,
              PANEL,
              flip ? "lg:order-1 lg:border-r" : "lg:border-l",
            )}
          >
            <Reveal delay={0.08} y={24} className="w-full">
              <Picture />
            </Reveal>
          </div>
        )}
      </div>
    </Band>
  );
}

export function Battlegrounds({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  return (
    <section id="differences" aria-labelledby="differences-title">
      <Spacer />
      <SectionHead
        icon={Route}
        eyebrow="Where Rankbox differs"
        title={
          <span id="differences-title">
            <AccentTail
              text={
                c.battlegroundsTitle ??
                `Three things Rankbox does that ${c.name} doesn't set out to`
              }
              words={2}
            />
          </span>
        }
        subtitle={c.battlegroundsIntro}
      />
      {c.battlegrounds.map((b, i) => (
        <Difference key={b.title} b={b} i={i} />
      ))}
    </section>
  );
}

/* ---------- Switching ---------- */

export function Migration({ competitor }: { competitor: Competitor }) {
  const c = competitor;
  const m = c.migration;
  return (
    <section id="switching" aria-labelledby="switching-title">
      <Spacer />
      <SectionHead
        icon={ArrowRight}
        eyebrow="Switching"
        title={
          <span id="switching-title">
            <AccentTail text={m.title} words={3} />
          </span>
        }
        subtitle={m.body}
      >
        <div
          aria-hidden
          className="mx-auto mt-7 flex w-fit items-center gap-3 rounded-xl border border-ink/[0.08] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
        >
          <CompetitorMark competitor={c} className="h-7 w-7" />
          <span className="h-px w-10 border-t border-dashed border-ink/25 sm:w-16" />
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="h-px w-10 border-t border-dashed border-cta/50 sm:w-16" />
          <RankboxMark className="h-7 w-7" />
        </div>
      </SectionHead>
      <Band>
        <div className="overflow-hidden">
          <ol className="-mb-px -mr-px grid lg:grid-cols-3">
            {m.steps.map((s, i) => (
              <li key={s.title} className={cn(CELL, "relative")}>
                <Reveal delay={i * 0.07} className="h-full px-6 py-9 sm:px-10 lg:py-12">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cta text-[0.9rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </Reveal>
                {i < m.steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.1] bg-white text-muted-foreground lg:flex"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </section>
  );
}
