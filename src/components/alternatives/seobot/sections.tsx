/**
 * The rest of /alternatives/seobot, in the landing page's frame: the short
 * answer and where each tool differs, the three deep dives, when SEObot is
 * the better buy, switching, the FAQ, the sources, the other comparisons,
 * and the closing band. All copy is the competitor's entry in
 * src/data/competitors/seobot.ts; these only decide how it's set.
 */
import { useState, type ComponentType, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  FileSearch,
  HelpCircle,
  LayoutGrid,
  Quote,
  Swords,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { getFeature } from "@/data/features";
import { COMPANY } from "@/data/company";
import { COMPETITORS, KIND_LABEL, formatCheckedOn, type Competitor } from "@/data/alternatives";
import { CARD_SHADOW, RANKBOX_TINT } from "./tokens";
import { displayUrl } from "./math";
import { CreditsPicture, DraftPicture, Handoff, MonthCard, RedditPicture } from "./pictures";

/** A title with its closing `words` words in the blue accent. */
function withAccent(text: string, words = 2): ReactNode {
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

/* ---------- The short answer, and where each differs ---------- */

/* Written to be lifted: the paragraph that names both products and draws
   the distinction, set large, with each product's one-line job beside it.
   Then the two lists of where each one differs, ruled side by side. */
export function ShortAnswer({ competitor }: { competitor: Competitor }) {
  const p = competitor.positioning;
  return (
    <section aria-labelledby="short-answer-title">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <Reveal
            className={cn(
              "border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <h2 id="short-answer-title">
              <Pill icon={Quote}>The short answer</Pill>
            </h2>
            <p className="mt-6 text-pretty text-[1.08rem] leading-[1.7] text-ink sm:text-[1.2rem]">
              {competitor.shortAnswer}
            </p>
          </Reveal>

          <div className="flex flex-col">
            <Reveal
              delay={0.06}
              className={cn(
                "flex flex-1 items-center gap-4 border-b px-5 py-8 sm:px-10 lg:px-10",
                LINE,
                RANKBOX_TINT,
              )}
            >
              <RankboxMark className="h-10 w-10" />
              <div className="min-w-0">
                <p className="text-[0.95rem] font-semibold text-ink">Rankbox</p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/80">
                  {competitor.verdict.rankbox}
                </p>
              </div>
            </Reveal>
            <Reveal
              delay={0.1}
              className="flex flex-1 items-center gap-4 px-5 py-8 sm:px-10 lg:px-10"
            >
              <CompetitorMark competitor={competitor} className="h-10 w-10" />
              <div className="min-w-0">
                <p className="text-[0.95rem] font-semibold text-ink">{competitor.name}</p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink/80">
                  {competitor.verdict.them}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Band>

      <Band>
        <div className="grid md:grid-cols-2">
          <Reveal className={cn("px-5 py-9 sm:px-10 lg:px-12 lg:py-12", RANKBOX_TINT)}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <div>
                <h3 className="text-[1.05rem] font-medium tracking-tight text-ink">
                  {p.rankboxTitle}
                </h3>
                <p className="text-[0.8rem] text-cta-hover">
                  {p.rankboxTag ?? "An engine, not an editor"}
                </p>
              </div>
            </div>
            <ul className="mt-7 space-y-3.5">
              {p.rankbox.map((item) => (
                <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink">
                  <span className="mt-0.5 flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-full bg-cta text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3.2} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.06}
            className={cn(
              "border-t px-5 py-9 sm:px-10 md:border-l md:border-t-0 lg:px-12 lg:py-12",
              LINE,
            )}
          >
            <div className="flex items-center gap-3">
              <CompetitorMark competitor={competitor} className="h-9 w-9" />
              <div>
                <h3 className="text-[1.05rem] font-medium tracking-tight text-ink">
                  {p.themTitle}
                </h3>
                <p className="text-[0.8rem] text-muted-foreground">{competitor.category}</p>
              </div>
            </div>
            <ul className="mt-7 space-y-3.5">
              {p.them.map((item) => (
                <li key={item} className="flex gap-3 text-[0.92rem] leading-snug text-ink/80">
                  <span
                    aria-hidden
                    className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Where it's decided ---------- */

const PICTURES: Record<string, ComponentType> = {
  "authority-backlinks": CreditsPicture,
  "seo-geo-score": DraftPicture,
  "reddit-presence": RedditPicture,
};

export function Decided({ competitor }: { competitor: Competitor }) {
  const title =
    competitor.battlegroundsTitle ??
    `Three things Rankbox does that ${competitor.name} doesn't set out to`;
  return (
    <section aria-labelledby="decided-title">
      <Spacer />
      <SectionHead
        icon={Swords}
        eyebrow="Where it's decided"
        title={<span id="decided-title">{withAccent(title)}</span>}
        subtitle={
          competitor.battlegroundsIntro ??
          "Not a longer list of features — the three that change what actually happens on your site."
        }
      />
      <Band>
        <CellGrid className="lg:grid-cols-3">
          {competitor.battlegrounds.map((b, i) => {
            const feature = getFeature(b.featureSlug);
            const Picture = PICTURES[b.featureSlug];
            const Icon = b.icon;
            return (
              <li key={b.title} className={cn(CELL, "flex flex-col bg-white")}>
                {Picture && (
                  <div
                    className={cn(
                      "flex min-h-[15.5rem] items-center justify-center border-b px-6 py-8 lg:h-[19.5rem]",
                      LINE,
                      PANEL,
                    )}
                  >
                    <Reveal delay={i * 0.06} y={16} className="flex w-full justify-center">
                      <Picture />
                    </Reveal>
                  </div>
                )}
                <div className="flex flex-1 flex-col px-6 py-7 sm:px-8">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-brand-blue shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[0.72rem] font-semibold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[1.08rem] font-semibold leading-snug tracking-tight text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
                    {b.body}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {b.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-[0.84rem] leading-snug text-ink">
                        <Check
                          aria-hidden
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue"
                          strokeWidth={3}
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {feature && (
                    <Link
                      to="/features/$slug"
                      params={{ slug: feature.slug }}
                      className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-[0.85rem] font-medium text-ink transition-colors hover:text-brand-blue"
                    >
                      How {feature.name} works
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- When SEObot is the better choice ---------- */

/* Plain on purpose: no blue, no ticks. It reads as a note from us. */
export function BetterWhen({ competitor }: { competitor: Competitor }) {
  return (
    <section id="better-when" aria-labelledby="better-when-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={ThumbsUp}
        eyebrow="The honest part"
        title={
          <span id="better-when-title">
            When {competitor.name} is <Accent>the better choice</Accent>
          </span>
        }
        subtitle={`We'd rather you picked the right tool than churned in a month. ${competitor.name} is genuinely the better buy in these cases.`}
      />
      <Band>
        <ol>
          {competitor.betterWhen.map((w, i) => (
            <li
              key={w.title}
              className={cn(
                i > 0 && "border-t",
                LINE,
                i % 2 === 1 && "bg-[color-mix(in_oklab,var(--surface)_40%,white)]",
              )}
            >
              <Reveal
                delay={i * 0.05}
                className="grid gap-3 px-5 py-8 sm:px-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-10 lg:px-12"
              >
                <div className="flex items-start gap-3.5">
                  <CompetitorMark competitor={competitor} className="h-8 w-8 text-[0.6rem]" />
                  <h3 className="pt-1 text-[1.05rem] font-medium leading-snug tracking-tight text-ink">
                    {w.title}
                  </h3>
                </div>
                <p className="text-[0.92rem] leading-relaxed text-muted-foreground md:pt-1">
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

/* ---------- Switching ---------- */

export function Switching({ competitor }: { competitor: Competitor }) {
  const m = competitor.migration;
  return (
    <section aria-labelledby="switch-title">
      <Spacer />
      <SectionHead
        icon={ArrowLeftRight}
        eyebrow="Switching"
        title={<span id="switch-title">{withAccent(m.title, 1)}</span>}
        subtitle={m.body}
      />
      <Band inner={cn("px-3 py-10 sm:px-8 sm:py-14 lg:px-12", PANEL)}>
        <Reveal y={20}>
          <Handoff competitor={competitor} steps={m.steps} />
        </Reveal>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-3">
          {m.steps.map((s, i) => (
            <li key={s.title} className={cn(CELL, "bg-white")}>
              <Reveal delay={i * 0.06} className="h-full px-6 py-8 sm:px-8">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta text-[0.8rem] font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[1.02rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Every answer open, two to a row: these are the page's most quotable
   lines, and the route's FAQPage schema reads the same text. */
export function SeobotFAQ({ competitor }: { competitor: Competitor }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={HelpCircle}
        eyebrow="FAQ"
        title={
          <span id="faq-title">
            Rankbox vs {competitor.name}, <Accent>answered</Accent>
          </span>
        }
        subtitle={`The questions people ask before switching from ${competitor.name}.`}
      />
      <Band>
        <CellGrid className="md:grid-cols-2">
          {competitor.faqs.map((f, i) => (
            <li key={f.q} className={cn(CELL, "bg-white")}>
              <Reveal delay={(i % 2) * 0.05} className="h-full px-6 py-8 sm:px-10">
                <h3 className="flex gap-3 text-[1rem] font-medium leading-snug tracking-tight text-ink">
                  <span className="mt-px text-[0.75rem] font-semibold tabular-nums text-brand-blue">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.q}
                </h3>
                <p className="mt-3 pl-[1.85rem] text-[0.9rem] leading-relaxed text-muted-foreground">
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

/* The paper trail: every page the facts came from, the date they were read,
   and an address to report a stale row. */
export function Sources({ competitor }: { competitor: Competitor }) {
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal
            className={cn(
              "min-w-0 border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={FileSearch}>Sources</Pill>
            <h2
              id="sources-title"
              className="mt-5 font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2rem]"
            >
              How this comparison <Accent>was checked</Accent>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Every {competitor.name} fact on this page comes from {competitor.name}&rsquo;s own
              public pages, read on {formatCheckedOn(competitor.pricing.checkedOn)}. Anything we
              could not confirm there is left out. Rankbox facts describe what ships today, not what
              is planned.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Spotted something out of date?{" "}
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(`Correction: Rankbox vs ${competitor.name}`)}`}
                className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
              >
                Email {COMPANY.email}
              </a>{" "}
              and we will fix the row.
            </p>
          </Reveal>

          <ol className="min-w-0">
            {competitor.sources.map((src, i) => (
              <li key={src.url} className={cn(i > 0 && "border-t", LINE)}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:px-10 lg:px-10"
                >
                  <span className="w-5 shrink-0 text-[0.72rem] font-semibold tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9rem] font-medium text-ink">{src.label}</span>
                    <span className="block truncate text-[0.75rem] text-muted-foreground">
                      {displayUrl(src.url)}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-muted-foreground/70 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
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

/* ---------- Other comparisons ---------- */

export function OtherComparisons({ competitor }: { competitor: Competitor }) {
  const others = COMPETITORS.filter((c) => c.slug !== competitor.slug);
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="others-title">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <Pill icon={LayoutGrid}>More comparisons</Pill>
        <h2
          id="others-title"
          className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
        >
          Comparing something else?
        </h2>
        <p className="mt-2 text-[0.95rem] text-muted-foreground">
          The same questions, asked of the other tools founders shortlist.
        </p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <li key={c.slug} className={CELL}>
              <Link
                to="/alternatives/$slug"
                params={{ slug: c.slug }}
                className="group flex h-full items-center gap-4 px-6 py-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-7"
              >
                <CompetitorMark competitor={c} className="h-10 w-10" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.72rem] text-muted-foreground">
                    {KIND_LABEL[c.kind]}
                  </span>
                  <span className="mt-0.5 block text-[0.95rem] font-semibold text-ink">
                    Rankbox vs {c.name}
                  </span>
                  <span className="block truncate text-[0.78rem] text-muted-foreground">
                    {c.category}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                />
              </Link>
            </li>
          ))}
          <li className={CELL}>
            <Link
              to="/alternatives"
              className="group flex h-full items-center justify-between gap-4 px-6 py-5 text-[0.95rem] font-medium text-ink transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-7"
            >
              All comparisons
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Closing band ---------- */

/* Blue, inside the rails, with a month of articles rising from its foot:
   the plan's whole promise as one picture. */
export function ClosingBand({ competitor }: { competitor: Competitor }) {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_40%,#000_30%,transparent_100%)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1.3px)] [background-size:18px_18px]" />
        </div>
        <div className="relative px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
            <span aria-hidden className="mb-6 flex items-center gap-2">
              <RankboxMark className="h-9 w-9" onDark />
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                vs
              </span>
              <CompetitorMark competitor={competitor} className="h-9 w-9 text-[0.6rem]" onDark />
            </span>
            <h2
              id="cta-title"
              className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
            >
              {competitor.ctaTitle}
            </h2>
            <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {competitor.ctaBody}
            </p>
            <div className="mt-8 flex w-full justify-center">
              <UrlForm url={url} onChange={setUrl} />
            </div>
            <p className="mt-4 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>
          <Reveal
            delay={0.12}
            y={40}
            className={cn(
              "mx-auto mt-12 h-[12.5rem] max-w-xl overflow-hidden sm:mt-14 sm:h-[11rem]",
              CARD_SHADOW,
            )}
          >
            <MonthCard />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
