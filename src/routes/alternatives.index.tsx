import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Minus, X } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { PixelField, UrlForm, TrustRow } from "@/components/landing/Hero";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Pricing } from "@/components/landing/Pricing";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { COMPETITORS, RANKBOX_COST, type Competitor } from "@/data/alternatives";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";

const SITE = "https://rankbox.xyz";
const TITLE = "Rankbox Alternatives & Comparisons | Honest Side-by-Sides";
const DESCRIPTION =
  "How Rankbox compares to Jasper, Surfer SEO, and the other tools founders shortlist — full feature matrices, real cost per published article, and when each competitor is the better choice.";

/** The claim the index makes, once, rather than on every card. */
const PILLARS = [
  {
    title: "Every row, not the flattering ones",
    body: "Each comparison runs the same twenty-odd capabilities a growth programme needs, including the ones we lose.",
  },
  {
    title: "Cost per published article",
    body: "Monthly price is meaningless without output. We show the arithmetic and date every figure we quote.",
  },
  {
    title: "When to pick them instead",
    body: "Every page has a section on where the other tool is genuinely the better buy. We'd rather you didn't churn.",
  },
];

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
              isPartOf: { "@id": `${SITE}/#website` },
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
            {COMPETITORS.length} comparisons · updated as products change
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="alternatives-title"
            className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
          >
            How Rankbox compares — including where it loses
          </h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
            Most tools on this list are good at what they were built for. These pages say what that
            is, run the same feature matrix against each, show the cost per published article, and
            name the cases where you should pick them over us.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 flex w-full flex-col items-center gap-3">
          <UrlForm url={url} onChange={setUrl} />
          <p className="text-sm text-white/70">
            No credit card required · Free {TRIAL_DAYS}-day trial
          </p>
        </Reveal>
        <Reveal delay={0.26} className="mt-10">
          <TrustRow />
        </Reveal>
      </div>
    </section>
  );
}

/* A preview of the matrix: the three rows that decide most shortlists, drawn
   straight from each competitor's own data so the card can never drift from
   the page it links to. */
function ComparisonCard({ competitor }: { competitor: Competitor }) {
  const highlights = competitor.matrix
    .flatMap((g) => g.rows)
    .filter((r) => r.rankbox.state === "yes" && r.them.state !== "yes")
    .slice(0, 3);
  const StateIcon = { yes: Check, partial: Minus, no: X };

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

      <ul className="mt-5 space-y-2 border-t border-border pt-5">
        {highlights.map((r) => {
          const Icon = StateIcon[r.them.state];
          return (
            <li key={r.label} className="flex items-center gap-2.5 text-xs">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
              <span className="flex-1 truncate text-ink">{r.label}</span>
              <span
                className={
                  r.them.state === "partial"
                    ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning/30 text-ink"
                    : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                }
                title={`${competitor.name}: ${r.them.note}`}
              >
                <Icon className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
            </li>
          );
        })}
      </ul>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        Read the full comparison
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
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

        {/* The comparisons */}
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
                Each page runs the full matrix, the cost maths, and the honest case for the other
                side.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {COMPETITORS.map((c, i) => (
                <Reveal key={c.slug} delay={(i % 3) * 0.06}>
                  <ComparisonCard competitor={c} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
                Weighing us against something not listed here?{" "}
                <a
                  href="/auth"
                  className="font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
                >
                  Tell us which
                </a>{" "}
                and we&rsquo;ll write it.
              </p>
            </Reveal>
          </div>
        </section>

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
                Rankbox is an AI search growth engine: it finds the questions your buyers ask
                ChatGPT, Perplexity, and Google, writes source-backed articles in your brand voice,
                scores them for search and for AI answers, publishes them to your site daily, and
                tracks which answers now cite you — {formatUsd(PLAN.monthly)} a month for{" "}
                {PLAN.articlesPerMonth} published articles, about{" "}
                {formatUsd(RANKBOX_COST.perArticle)} each.
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

        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
