import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PixelField } from "@/components/landing/Hero";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { BlogCta } from "@/components/blog/ArticleChrome";
import { EngineMark, Md } from "@/components/ai-seo/kit";
import { plainText } from "@/lib/inline-md";
import { FaqList, GuideCard, ShortAnswer } from "@/components/ai-seo/sections";
import { ENGINES, TIERS, enginesInTier, getEngine, type EngineTier } from "@/data/ai-seo/engines";
import { loadGuides } from "@/data/ai-seo/guides";
import { OVERVIEW, PROFILE_ROWS } from "@/data/ai-seo/overview";
import { formatDate } from "@/lib/format-date";

const SITE = "https://rankbox.xyz";
const PAGE_URL = `${SITE}/ai-seo`;
const UPDATED = ENGINES.map((e) => e.updated)
  .sort()
  .at(-1)!;
const FRONTIER = enginesInTier("frontier");
const MORE = enginesInTier("more");

export const Route = createFileRoute("/ai-seo/")({
  /* Only the matrix rows travel: the hub never needs a guide's body text. */
  loader: async () => ({
    profiles: (await loadGuides()).map((g) => ({ slug: g.slug, profile: g.profile })),
  }),
  head: () => ({
    meta: [
      { title: OVERVIEW.metaTitle },
      { name: "description", content: OVERVIEW.metaDescription },
      { name: "keywords", content: OVERVIEW.keywords.join(", ") },
      { property: "og:title", content: OVERVIEW.metaTitle },
      { property: "og:description", content: OVERVIEW.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: OVERVIEW.metaTitle },
      { name: "twitter:description", content: OVERVIEW.metaDescription },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${PAGE_URL}#webpage`,
              url: PAGE_URL,
              name: OVERVIEW.metaTitle,
              description: OVERVIEW.metaDescription,
              abstract: plainText(OVERVIEW.shortAnswer),
              dateModified: UPDATED,
              inLanguage: "en",
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: { "@id": `${PAGE_URL}#list` },
              publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
            },
            {
              "@type": "ItemList",
              "@id": `${PAGE_URL}#list`,
              itemListElement: ENGINES.map((e, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${e.name} SEO guide`,
                url: `${PAGE_URL}/${e.slug}`,
              })),
            },
            {
              "@type": "FAQPage",
              "@id": `${PAGE_URL}#faq`,
              mainEntity: OVERVIEW.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "AI SEO guides", item: PAGE_URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: AiSeoIndex,
});

/* ---------- hero: the engine picker is the page's primary action ---------- */

function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="ai-seo-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-14 text-center sm:pb-20 sm:pt-20">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {ENGINES.length} engine guides · Updated {formatDate(UPDATED)}
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <h1
            id="ai-seo-title"
            className="mx-auto max-w-4xl font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
          >
            {OVERVIEW.h1}
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
            {OVERVIEW.subhead}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-12 w-full">
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/65">
            Pick your engine
          </p>
          <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {FRONTIER.map((e, i) => (
              <li
                key={e.slug}
                className={i === FRONTIER.length - 1 ? "col-span-2 sm:col-span-1" : ""}
              >
                <Link
                  to="/ai-seo/$engine"
                  params={{ engine: e.slug }}
                  className="group flex h-full flex-col items-center rounded-2xl border border-white/20 bg-white/10 px-4 pb-5 pt-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-105">
                    <EngineMark mark={e.mark} className="h-7 w-7" />
                  </span>
                  <span className="mt-4 font-display text-[0.98rem] font-semibold leading-tight">
                    {e.shortName}
                  </span>
                  <span className="mt-1 text-xs text-white/65 transition-colors group-hover:text-muted-foreground">
                    {e.vendor}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-white/85 transition-colors group-hover:text-volt">
                    Read guide
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="#compare"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            Or compare all five side by side
            <ArrowDown className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- the matrix ---------- */

/* Every cell comes from the engine's own guide, so this table can't drift from
   the pages it summarises. First column sticks on narrow screens so a row
   never loses its label while scrolling across engines. One table per tier:
   eleven columns would be unreadable, and the frontier five read as a set. */
function MatrixTable({ tier }: { tier: EngineTier }) {
  const { profiles } = Route.useLoaderData();
  const rows = profiles.filter((g) => getEngine(g.slug)?.tier === tier);
  return (
    <>
      <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card shadow-2">
        <table
          className={`w-full table-fixed border-collapse text-left text-[0.86rem] ${
            rows.length > 5 ? "min-w-[70rem]" : "min-w-[60rem]"
          }`}
        >
          <caption className="sr-only">{TIERS[tier].label}, compared</caption>
          <thead>
            <tr className="border-b border-border">
              <th
                scope="col"
                className="sticky left-0 z-10 w-44 bg-card px-4 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
              >
                <span className="sr-only">Attribute</span>
              </th>
              {rows.map((g) => {
                const e = getEngine(g.slug)!;
                return (
                  <th key={g.slug} scope="col" className="px-4 py-4 align-bottom">
                    <Link
                      to="/ai-seo/$engine"
                      params={{ engine: g.slug }}
                      className="group inline-flex items-center gap-2 font-semibold text-ink"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white">
                        <EngineMark mark={e.mark} className="h-4 w-4" />
                      </span>
                      <span className="group-hover:text-volt">{e.shortName}</span>
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PROFILE_ROWS.map((row) => (
              <tr key={row.key}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card px-4 py-4 align-top text-[0.8rem] font-semibold text-ink shadow-[1px_0_0_var(--color-border)]"
                >
                  {row.label}
                </th>
                {rows.map((g) => (
                  <td
                    key={g.slug}
                    className={
                      row.mono
                        ? "px-4 py-4 align-top font-mono text-[0.8rem] font-medium text-ink"
                        : "px-4 py-4 align-top leading-relaxed text-ink/75"
                    }
                  >
                    {g.profile[row.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Sourced from each vendor&rsquo;s documentation where it exists; each guide lists its
        sources.
      </p>
    </>
  );
}

function Matrix() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Side by side</Eyebrow>
          <h2
            id="compare-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            How the five engines find and cite sources
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Different indexes, different crawlers, different ways of showing a citation. The
            differences below decide what you have to do for each.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <MatrixTable tier="frontier" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- beyond the frontier ---------- */

/* The engines that aren't in the hero: smaller audiences, but each with
   plumbing different enough to need its own guide. Cards first (the way in),
   then the same matrix, so they're compared on exactly the frontier's terms. */
function MoreEngines() {
  return (
    <section
      id="more-engines"
      aria-labelledby="more-engines-title"
      className="scroll-mt-20 border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">{OVERVIEW.more.eyebrow}</Eyebrow>
          <h2
            id="more-engines-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {OVERVIEW.more.title}
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            <Md text={OVERVIEW.more.intro} />
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MORE.map((e, i) => (
            <li key={e.slug}>
              <Reveal delay={(i % 3) * 0.05} className="h-full">
                <GuideCard engine={e} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.08} className="mt-20">
          <h3 className="text-center font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
            {OVERVIEW.more.compareTitle}
          </h3>
          <MatrixTable tier="more" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- principles ---------- */

function Principles() {
  return (
    <section aria-labelledby="principles-title" className="border-y border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">True everywhere</Eyebrow>
          <h2
            id="principles-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {OVERVIEW.principlesTitle}
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            {OVERVIEW.principlesIntro}
          </p>
        </Reveal>
        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {OVERVIEW.principles.map((p, i) => (
            <li key={p.title}>
              <Reveal
                delay={(i % 3) * 0.05}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-1"
              >
                <span className="font-mono text-xs font-semibold text-volt">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-semibold leading-snug text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <Md text={p.body} />
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AiSeoIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />

        <section aria-label="What AI SEO is" className="border-b border-border bg-card">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
            <ShortAnswer text={OVERVIEW.shortAnswer} />
          </div>
        </section>

        <Matrix />
        <MoreEngines />
        <Principles />

        <section aria-labelledby="faq-title" className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5">
            <Reveal className="text-center">
              <Eyebrow className="mb-4">FAQ</Eyebrow>
              <h2
                id="faq-title"
                className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                AI SEO questions, answered
              </h2>
            </Reveal>
            <FaqList faqs={OVERVIEW.faqs} />
          </div>
        </section>

        <BlogCta title="See which engines cite you today" />
      </main>
      <Footer />
    </div>
  );
}
