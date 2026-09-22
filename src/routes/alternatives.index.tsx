import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { PixelField, UrlForm } from "@/components/landing/Hero";
import { CompetitorMark, FactDot, RankboxMark } from "@/components/alternatives/kit";
import {
  ALTERNATIVES_UPDATED,
  COMPETITORS,
  KIND_BLURB,
  KIND_LABEL,
  RANKBOX_COST,
  RANKBOX_PUBLISHING,
  RANKBOX_SNAPSHOT,
  SHIPPED,
  costPerArticle,
  formatCheckedOn,
  getCompetitor,
  listNames,
  type Competitor,
  type CompetitorKind,
  type Fact,
} from "@/data/alternatives";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { cn } from "@/lib/utils";

const SITE = "https://rankbox.xyz";
const TITLE = "Rankbox Alternatives & Comparisons (2026) | Honest Side-by-Sides";
const DESCRIPTION = `How Rankbox compares to ${listNames(COMPETITORS.map((c) => c.name))}: checked against each tool's own pages, with cost per article and when each is the better choice.`;

const TRIAL_LINE = `Build your content plan free, no card · ${TRIAL_DAYS}-day trial · Cancel anytime`;

/** The claim the index makes, once, rather than on every card. */
const PILLARS = [
  {
    title: "Every row, not the flattering ones",
    body: "Each comparison asks the same questions of both products, including the rows Rankbox loses and the features it hasn't shipped yet.",
  },
  {
    title: "Checked, dated, and sourced",
    body: "Every competitor fact comes from their own pricing page or docs, carries the date we read it, and links to where it came from.",
  },
  {
    title: "When to pick them instead",
    body: "Every page says where the other tool is genuinely the better buy. We'd rather you picked right than churned in a month.",
  },
];

/** Kinds in the order the hub lists them: closest to Rankbox first. */
const KIND_ORDER: CompetitorKind[] = ["autopilot", "writer", "optimizer", "visibility"];

export const Route = createFileRoute("/alternatives/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/alternatives` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}/alternatives` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${SITE}/alternatives#webpage`,
              url: `${SITE}/alternatives`,
              name: TITLE,
              description: DESCRIPTION,
              dateModified: ALTERNATIVES_UPDATED,
              isPartOf: { "@id": `${SITE}/#website` },
              publisher: { "@id": `${SITE}/#organization` },
              mainEntity: { "@id": `${SITE}/alternatives#list` },
            },
            {
              "@type": "ItemList",
              "@id": `${SITE}/alternatives#list`,
              itemListElement: COMPETITORS.map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `Rankbox vs ${c.name}`,
                url: `${SITE}/alternatives/${c.slug}`,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Alternatives",
                  item: `${SITE}/alternatives`,
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: AlternativesIndex,
});

/* ---------- hero ---------- */

function AlternativesHero() {
  const [url, setUrl] = useState("");
  return (
    <section
      id="top"
      aria-labelledby="alternatives-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-16 text-center sm:pb-24 sm:pt-24">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {COMPETITORS.length} comparisons · checked {formatCheckedOn(ALTERNATIVES_UPDATED)}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="alternatives-title"
            className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
          >
            How Rankbox compares, including where it loses
          </h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
            Most tools on this list are good at what they were built for. These pages say what that
            is, check every fact against the tool&rsquo;s own pages, show the cost per article, and
            name the cases where you should pick them over us.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 flex w-full flex-col items-center gap-3">
          <UrlForm url={url} onChange={setUrl} />
          <p className="text-sm text-white/70">{TRIAL_LINE}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- the field, in one table ---------- */

interface FieldRow {
  key: string;
  name: string;
  mark: React.ReactNode;
  href?: { slug: string };
  bestFor: string;
  price: string;
  plan: string;
  perArticle: string;
  publishing: Fact;
  backlinks: Fact;
  aiVisibility: Fact;
  us?: boolean;
}

function fieldRows(): FieldRow[] {
  const rankbox: FieldRow = {
    key: "rankbox",
    name: "Rankbox",
    mark: <RankboxMark className="h-8 w-8" />,
    bestFor: RANKBOX_SNAPSHOT.bestFor,
    price: `${formatUsd(PLAN.monthly)}/mo`,
    plan: `${PLAN.name} · ${PLAN.articlesPerMonth} articles`,
    perArticle: formatUsd(RANKBOX_COST.perArticle),
    publishing: RANKBOX_SNAPSHOT.publishing,
    backlinks: RANKBOX_SNAPSHOT.backlinks,
    aiVisibility: RANKBOX_SNAPSHOT.aiVisibility,
    us: true,
  };
  const them = COMPETITORS.map((c): FieldRow => {
    const each = costPerArticle(c);
    return {
      key: c.slug,
      name: c.name,
      mark: <CompetitorMark competitor={c} className="h-8 w-8" />,
      href: { slug: c.slug },
      bestFor: c.snapshot.bestFor,
      price: `${formatUsd(c.pricing.monthly)}/mo`,
      plan: c.pricing.articles
        ? `${c.pricing.plan} · ${c.pricing.articles} articles`
        : c.pricing.plan,
      perArticle: each !== null ? formatUsd(each) : "Not per article",
      publishing: c.snapshot.publishing,
      backlinks: c.snapshot.backlinks,
      aiVisibility: c.snapshot.aiVisibility,
    };
  });
  return [rankbox, ...them];
}

const FIELD_COLS =
  "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)_minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";

/* The label a cell carries on a phone, where the header row isn't shown.
   Hidden from screen readers, which already get the column header. */
function MobileLabel({ children }: { children: string }) {
  return (
    <span
      aria-hidden
      className="mb-1 block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:hidden"
    >
      {children}
    </span>
  );
}

function FactCell({ label, fact }: { label: string; fact: Fact }) {
  return (
    <div role="cell" className="min-w-0">
      <MobileLabel>{label}</MobileLabel>
      <span className="flex items-start gap-2 text-[0.8rem] leading-snug text-ink/85">
        <FactDot state={fact.state} />
        <span className="min-w-0">{fact.short}</span>
      </span>
    </div>
  );
}

/**
 * Every tool on one screen, answering the questions that decide a shortlist.
 * One DOM for both layouts, like the per-page matrix: a real table at desktop
 * width, a stack of cards on a phone. The Rankbox row is pinned first and
 * tinted; everything in it comes from the same "what ships today" layer the
 * comparison pages use.
 */
function FieldTable() {
  const rows = fieldRows();
  const headers = ["Tool", "Price", "Per article", "Publishing", "Backlinks", "AI visibility"];
  return (
    <section
      id="field"
      aria-labelledby="field-title"
      className="scroll-mt-[var(--top-chrome)] border-b border-border py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">The field at a glance</Eyebrow>
          <h2
            id="field-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {COMPETITORS.length + 1} tools, the same five questions
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            What it costs, what one article works out at, how it reaches your site, whether it
            builds links, and whether it tracks AI answers.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-12">
          <div
            role="table"
            aria-label="AI SEO tools compared"
            className="lg:rounded-2xl lg:border lg:border-border lg:bg-card"
          >
            <div role="rowgroup" className="hidden lg:block">
              <div
                role="row"
                className={cn(
                  "grid items-center gap-4 border-b border-border px-6 py-3.5",
                  FIELD_COLS,
                )}
              >
                {headers.map((h) => (
                  <span
                    key={h}
                    role="columnheader"
                    className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div role="rowgroup" className="space-y-3 lg:space-y-0 lg:divide-y lg:divide-border">
              {rows.map((r) => (
                <div
                  key={r.key}
                  role="row"
                  className={cn(
                    "grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl border p-5 lg:items-center lg:gap-4 lg:rounded-none lg:border-0 lg:px-6 lg:py-4",
                    FIELD_COLS,
                    r.us
                      ? "border-volt/40 bg-brand-blue/[0.06] ring-1 ring-volt/15 lg:ring-0"
                      : "border-border bg-card lg:bg-transparent",
                  )}
                >
                  <div
                    role="cell"
                    className="col-span-2 flex min-w-0 items-center gap-3 lg:col-span-1"
                  >
                    {r.mark}
                    <div className="min-w-0">
                      {r.href ? (
                        <Link
                          to="/alternatives/$slug"
                          params={r.href}
                          className="group inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-volt"
                        >
                          {r.name}
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-volt" />
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-ink">{r.name}</span>
                      )}
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                        {r.bestFor}
                      </p>
                    </div>
                  </div>
                  <div role="cell" className="min-w-0">
                    <MobileLabel>Price</MobileLabel>
                    <span className="block text-sm font-semibold tabular-nums text-ink">
                      {r.price}
                    </span>
                    <span className="block text-xs text-muted-foreground">{r.plan}</span>
                  </div>
                  <div role="cell" className="min-w-0">
                    <MobileLabel>Per article</MobileLabel>
                    <span
                      className={cn(
                        "text-sm tabular-nums",
                        r.perArticle.startsWith("$")
                          ? "font-semibold text-ink"
                          : "text-muted-foreground",
                      )}
                    >
                      {r.perArticle}
                    </span>
                  </div>
                  <FactCell label="Publishing" fact={r.publishing} />
                  <FactCell label="Backlinks" fact={r.backlinks} />
                  <FactCell label="AI visibility" fact={r.aiVisibility} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          Prices are monthly list prices on the plan closest to 30 articles a month for one site,
          taken from each tool&rsquo;s pricing page; every page links its sources. Rankbox rows
          describe what ships today. {RANKBOX_PUBLISHING.sentence}.
        </p>
      </div>
    </section>
  );
}

/* ---------- which one fits ---------- */

interface Fit {
  need: string;
  picks: string[];
  /** Rankbox belongs in the answer. */
  rankbox?: boolean;
}

/* The honest routing table, and the thing most "best tools" roundups won't
   print: which of the others to buy for each job. Rankbox appears only where
   it is actually the answer, and joins the tracking row when tracking ships. */
const FITS: Fit[] = [
  { need: "30 articles a month on one site, at the lowest cost", picks: [], rankbox: true },
  {
    need: "Native publishing to Shopify, Wix, or Webflow today",
    picks: ["outrank", "rankpill", "seobot"],
  },
  {
    need: "Tracking whether AI engines cite you",
    picks: ["frase", "writesonic"],
    rankbox: SHIPPED.citationTracking,
  },
  { need: "Hundreds of articles, or programmatic pages", picks: ["byword", "seobot"] },
  { need: "SEO data, affiliate roundups, or many languages", picks: ["koala-ai", "outrank"] },
  { need: "Writers who hand-edit drafts against the SERP", picks: ["surfer-seo", "frase"] },
  { need: "Copy for ads, email, and social, not just articles", picks: ["jasper"] },
];

function WhichFits() {
  return (
    <section
      aria-labelledby="fits-title"
      className="border-b border-border bg-surface/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Which one fits</Eyebrow>
          <h2
            id="fits-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Start from the job, not the tool
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            The short version of every page below, including the jobs where we&rsquo;d send you
            somewhere else.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {FITS.map((f) => (
              <div
                key={f.need}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-6 sm:px-6"
              >
                <dt className="text-sm font-medium text-ink">{f.need}</dt>
                <dd className="flex flex-wrap gap-2">
                  {f.rankbox && (
                    <Link
                      to="/pricing"
                      className="inline-flex items-center gap-2 rounded-full border border-volt/40 bg-brand-blue/[0.06] py-1 pl-1 pr-3 text-xs font-semibold text-ink transition-colors hover:border-volt"
                    >
                      <RankboxMark className="h-5 w-5" />
                      Rankbox
                    </Link>
                  )}
                  {f.picks
                    .map((slug) => getCompetitor(slug))
                    .filter((c): c is Competitor => Boolean(c))
                    .map((c) => (
                      <Link
                        key={c.slug}
                        to="/alternatives/$slug"
                        params={{ slug: c.slug }}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 text-xs font-semibold text-ink transition-colors hover:border-ink/30"
                      >
                        <CompetitorMark competitor={c} className="h-5 w-5 text-[0.5rem]" />
                        {c.name}
                      </Link>
                    ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- cards, grouped by kind ---------- */

/* A preview of the page: the rows where the two genuinely differ, drawn from
   the competitor's own matrix so the card can never drift from the page. */
function ComparisonCard({ competitor }: { competitor: Competitor }) {
  const diffs = competitor.matrix
    .flatMap((g) => g.rows)
    .filter((r) => r.rankbox.state !== r.them.state)
    .slice(0, 3);

  return (
    <Link
      to="/alternatives/$slug"
      params={{ slug: competitor.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:p-7"
    >
      <div className="flex items-center gap-2.5">
        <RankboxMark className="h-10 w-10" />
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          vs
        </span>
        <CompetitorMark competitor={competitor} className="h-10 w-10" />
      </div>

      <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
        Rankbox vs {competitor.name}
      </h3>
      <p className="mt-1 text-xs font-medium text-volt">{competitor.category}</p>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{competitor.oneLiner}</p>

      {diffs.length > 0 && (
        <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
          <li
            aria-hidden
            className="grid grid-cols-[minmax(0,1fr)_1.25rem_1.25rem] items-center gap-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            <span>Where they differ</span>
            <RankboxMark className="h-5 w-5" />
            <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.5rem]" />
          </li>
          {diffs.map((r) => (
            <li
              key={r.label}
              className="grid grid-cols-[minmax(0,1fr)_1.25rem_1.25rem] items-center gap-2.5 text-xs"
            >
              <span className="truncate text-ink">{r.label}</span>
              <FactDot state={r.rankbox.state} className="mt-0 h-5 w-5" />
              <FactDot state={r.them.state} className="mt-0 h-5 w-5" />
            </li>
          ))}
        </ul>
      )}

      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-ink">
        Read the full comparison
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function ComparisonGroups() {
  const groups = KIND_ORDER.map((kind) => ({
    kind,
    items: COMPETITORS.filter((c) => c.kind === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <section aria-labelledby="list-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Side by side</Eyebrow>
          <h2
            id="list-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Pick the tool you&rsquo;re weighing us against
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Each page runs the full matrix, every plan they sell, and the honest case for the other
            side.
          </p>
        </Reveal>

        <div className="mt-16 space-y-16">
          {groups.map((g) => (
            <div key={g.kind}>
              <Reveal className="mb-6 flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-sm font-semibold text-ink">{KIND_LABEL[g.kind]}</h3>
                <p className="text-sm text-muted-foreground">{KIND_BLURB[g.kind]}</p>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {g.items.map((c, i) => (
                  <Reveal key={c.slug} delay={(i % 3) * 0.06}>
                    <ComparisonCard competitor={c} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- close ---------- */

function HubCTA() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="hub-cta-title" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-gridlines opacity-[0.07]" />
            <div className="relative">
              <h2
                id="hub-cta-title"
                className="font-display mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-background sm:text-4xl"
              >
                The fastest comparison is your own site
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
                Paste your URL. Rankbox builds your content plan free, then writes your first
                articles on a {TRIAL_DAYS}-day trial, so you can compare real output side by side.
              </p>
              <div className="mt-8 flex justify-center">
                <UrlForm url={url} onChange={setUrl} />
              </div>
              <p className="mt-3 text-sm text-background/60">{TRIAL_LINE}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AlternativesIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <AlternativesHero />

        {/* How we write these */}
        <section aria-labelledby="method-title" className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="mb-4">How we write these</Eyebrow>
              <h2
                id="method-title"
                className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                A comparison you can check
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.06}>
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
                    <span className="text-xs font-semibold tabular-nums text-volt">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-base font-semibold text-ink">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <FieldTable />
        <WhichFits />
        <ComparisonGroups />

        {/* The one-line answer for people who skim */}
        <section aria-labelledby="summary-title" className="border-t border-border bg-surface/40">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-24">
            <Reveal>
              <h2
                id="summary-title"
                className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                What Rankbox is, in one line
              </h2>
              <p className="mx-auto mt-5 text-balance text-lg leading-relaxed text-muted-foreground">
                Rankbox is an AI search growth engine for one site: it finds the questions your
                buyers ask ChatGPT, Perplexity, and Google, writes source-backed articles in your
                brand voice, checks them for SEO, delivers them on your cadence, trades backlinks,
                and drafts your Reddit replies, for {formatUsd(PLAN.monthly)} a month and{" "}
                {PLAN.articlesPerMonth} articles, about {formatUsd(RANKBOX_COST.perArticle)} each.
              </p>
              <Link
                to="/features"
                className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
              >
                See how the engine works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </section>

        <div className="pt-24 sm:pt-32">
          <HubCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
