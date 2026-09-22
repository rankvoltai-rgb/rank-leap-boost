import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PixelField } from "@/components/landing/Hero";
import { Eyebrow, Reveal } from "@/components/landing/shared";
import { CompareCta, MatchupCard } from "@/components/compare/sections";
import { FaceOff } from "@/components/compare/kit";
import {
  CATEGORIES,
  COMPARE_UPDATED,
  MATCHUPS,
  getCategory,
  matchupTitle,
  sidesOf,
} from "@/data/compare/matchups";
import type { CategoryId } from "@/data/compare/matchups";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

const SITE = "https://rankbox.xyz";
const TITLE = "SEO & AI Search Tools, Compared Head to Head (2026)";
const DESCRIPTION =
  "Surfer SEO vs Clearscope, Semrush vs Ahrefs, Profound vs Peec AI and more — each run through the same rounds, with a winner per round, dated pricing, and a picker that tells you which one fits.";

/** How every page is judged — said once here, not repeated on every card. */
const METHOD = [
  {
    title: "A call in every round",
    body: "Each comparison is split into the five to seven things the choice actually turns on, and every round names a winner or, when the gap doesn't matter, a draw.",
  },
  {
    title: "Their sources, not our claims",
    body: "Every fact comes from the vendors' own pricing pages, docs and changelogs, or dated third-party reporting — and every page lists what it read, and when.",
  },
  {
    title: "Rankbox stays out of the scoring",
    body: "We make a product in this space. It appears once per page, at the end, labelled as ours, and never as a contender in the rounds.",
  },
];

export const Route = createFileRoute("/compare/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/compare` },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}/compare` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${SITE}/compare#webpage`,
              url: `${SITE}/compare`,
              name: TITLE,
              description: DESCRIPTION,
              dateModified: COMPARE_UPDATED,
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: { "@id": `${SITE}/compare#list` },
            },
            {
              "@type": "ItemList",
              "@id": `${SITE}/compare#list`,
              itemListElement: MATCHUPS.map((m, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: matchupTitle(m),
                url: `${SITE}/compare/${m.slug}`,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE}/compare` },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: CompareHub,
});

/* Every pairing on the index as a row of face-offs, so the hero doubles as
   the table of contents. */
function HeroPairs() {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
      {MATCHUPS.map((m) => {
        const sides = sidesOf(m);
        return (
          <Link
            key={m.slug}
            to="/compare/$slug"
            params={{ slug: m.slug }}
            aria-label={matchupTitle(m)}
            className="rounded-2xl p-1.5 transition-all hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <FaceOff a={sides.a} b={sides.b} size="sm" onDark />
          </Link>
        );
      })}
    </div>
  );
}

/* One grid, filtered by what the buyer is shopping for. Every card renders in
   the server HTML (the filter starts on "All"), so crawlers see the whole
   library; the chips only narrow it for people. */
function Library() {
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const list = category === "all" ? MATCHUPS : MATCHUPS.filter((m) => m.category === category);
  const chips = [
    { id: "all" as const, name: "All", count: MATCHUPS.length },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      count: MATCHUPS.filter((m) => m.category === c.id).length,
    })).filter((c) => c.count > 0),
  ];
  const chip =
    "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt";

  return (
    <section aria-labelledby="library-title" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="library-title"
              className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]"
            >
              Every head-to-head
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              {category === "all"
                ? "Pick the pair you're deciding between."
                : getCategory(category).blurb}
            </p>
          </div>
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    chip,
                    on
                      ? "border-ink bg-ink text-background"
                      : "border-border bg-card text-ink hover:border-ink/25",
                  )}
                >
                  {c.name}
                  <span
                    className={cn(
                      "tabular-nums text-xs",
                      on ? "text-background/60" : "text-muted-foreground",
                    )}
                  >
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <MatchupCard key={m.slug} matchup={m} showCategory />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareHub() {
  const productCount = new Set(MATCHUPS.flatMap((m) => [m.a, m.b])).size;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section
          id="top"
          aria-labelledby="compare-title"
          className="relative overflow-hidden bg-brand-blue text-white"
        >
          <PixelField />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-16 pt-16 text-center sm:pb-20 sm:pt-24">
            <Reveal>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {MATCHUPS.length} head-to-heads · {productCount} tools · updated{" "}
                {formatDate(COMPARE_UPDATED)}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                id="compare-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                The tools on your shortlist, head to head
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
                SEO and AI search tools, two at a time. Each page runs the same rounds, calls a
                winner in every one, dates every price, and ends with a picker that tells you which
                one fits your situation.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <HeroPairs />
            </Reveal>
          </div>
        </section>

        {/* How every page is judged */}
        <section aria-labelledby="method-title" className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="mb-4">How we judge</Eyebrow>
              <h2
                id="method-title"
                className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                A verdict you can check
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {METHOD.map((p, i) => (
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

        <Library />

        {/* Where the Rankbox-vs pages live */}
        <section aria-labelledby="ours-title" className="border-t border-border bg-surface/40">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center sm:py-20">
            <Reveal>
              <h2
                id="ours-title"
                className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                Weighing Rankbox against one of these?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
                Those comparisons are ours to make, so they live on their own pages — including the
                cases where the other tool is the better buy.
              </p>
              <Link
                to="/alternatives"
                className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
              >
                Rankbox vs the alternatives
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </section>

        <CompareCta />
      </main>
      <Footer />
    </div>
  );
}
