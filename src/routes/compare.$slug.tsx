import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  CompareCta,
  FeatureMatrix,
  Finder,
  MatchupFaq,
  MatchupHero,
  PricingFaceOff,
  RelatedMatchups,
  Rounds,
  TaleOfTheTape,
  ThirdOption,
} from "@/components/compare/sections";
import { hasEntry, loadEntry, tallyOf } from "@/data/compare/entries";
import {
  canonicalSlug,
  getCategory,
  getMatchup,
  matchupTitle,
  sidesOf,
  type Matchup,
} from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { ExploreMore } from "@/components/ExploreMore";
import { plainText } from "@/lib/inline-md";
import { AUTHOR_ORG } from "@/data/company";

const SITE = "https://rankbox.xyz";

export const Route = createFileRoute("/compare/$slug")({
  /* The body is its own chunk, fetched here; the head and the hub only need
     the light index. People type a pair in either order, so the reverse slug
     is a permanent redirect rather than a 404 or a duplicate page. */
  loader: async ({ params }) => {
    const matchup = getMatchup(params.slug);
    if (!matchup || !hasEntry(matchup.slug)) {
      const canonical = canonicalSlug(params.slug);
      if (canonical) {
        throw redirect({ to: "/compare/$slug", params: { slug: canonical }, statusCode: 301 });
      }
      throw notFound();
    }
    return { entry: await loadEntry(matchup.slug) };
  },
  head: ({ params, loaderData }) => {
    const entry = loaderData?.entry;
    const matchup = getMatchup(params.slug);
    if (!entry || !matchup) return { meta: [{ title: "Comparison not found — Rankbox" }] };

    const url = `${SITE}/compare/${matchup.slug}`;
    const sides = sidesOf(matchup);
    const title = matchupTitle(matchup);
    const tally = tallyOf(entry.rounds);
    const software = (side: "a" | "b") => ({
      "@type": "SoftwareApplication",
      "@id": `${url}#${side}`,
      name: sides[side].name,
      url: `https://${sides[side].domain}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: sides[side].kind,
    });

    return {
      meta: [
        { title: entry.metaTitle },
        { name: "description", content: entry.metaDescription },
        { name: "keywords", content: entry.keywords.join(", ") },
        { property: "og:title", content: entry.metaTitle },
        { property: "og:description", content: entry.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { property: "article:published_time", content: matchup.published },
        { property: "article:modified_time", content: matchup.updated },
        { property: "article:section", content: "Comparisons" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: entry.metaTitle },
        { name: "twitter:description", content: entry.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `${url}#article`,
                headline: title,
                name: entry.metaTitle,
                description: entry.metaDescription,
                /* The quotable verdict, handed to answer engines directly
                   rather than left to be scraped out of the layout. */
                abstract: plainText(entry.shortAnswer),
                about: [{ "@id": `${url}#a` }, { "@id": `${url}#b` }],
                articleSection: getCategory(matchup.category).name,
                keywords: entry.keywords.join(", "),
                datePublished: matchup.published,
                dateModified: matchup.updated,
                inLanguage: "en",
                mainEntityOfPage: { "@id": `${url}#webpage` },
                /* Comparisons are opinion, so the page says whose. */
                author: AUTHOR_ORG,
                publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
                hasPart: entry.rounds.map((r, i) => ({
                  "@type": "CreativeWork",
                  name: `Round ${i + 1}: ${r.title}`,
                  description: plainText(r.verdict),
                  url: `${url}#${r.id}`,
                })),
                /* The score as a sentence too, for engines that ignore hasPart. */
                disambiguatingDescription: `Rounds won — ${sides.a.name} ${tally.a}, ${sides.b.name} ${tally.b}, draws ${tally.draw}.`,
                citation: entry.sources.map((s) => ({
                  "@type": "CreativeWork",
                  name: s.title,
                  url: s.href,
                  publisher: { "@type": "Organization", name: s.publisher },
                })),
              },
              software("a"),
              software("b"),
              {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: entry.metaTitle,
                inLanguage: "en",
                isPartOf: { "@id": `${SITE}/#website` },
                breadcrumb: { "@id": `${url}#breadcrumb` },
                mainEntity: { "@id": `${url}#article` },
              },
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: entry.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
                })),
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE}/compare` },
                  { "@type": "ListItem", position: 3, name: title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: MatchupPage,
  notFoundComponent: MatchupNotFound,
});

function MatchupPage() {
  const { entry } = Route.useLoaderData();
  const matchup = getMatchup(entry.slug)!;
  // Keyed so moving between matchups starts each page fresh (picker, scroll-spy).
  return <MatchupView key={entry.slug} matchup={matchup} entry={entry} />;
}

function MatchupView({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <MatchupHero matchup={matchup} entry={entry} />
        <TaleOfTheTape matchup={matchup} entry={entry} />
        <Rounds matchup={matchup} entry={entry} />
        <Finder matchup={matchup} entry={entry} />
        <FeatureMatrix matchup={matchup} entry={entry} />
        <PricingFaceOff matchup={matchup} entry={entry} />
        <ThirdOption matchup={matchup} entry={entry} />
        <MatchupFaq matchup={matchup} entry={entry} />
        <RelatedMatchups matchup={matchup} />
        <ExploreMore path={`/compare/${matchup.slug}`} />
        <CompareCta />
      </main>
      <Footer />
    </div>
  );
}

function MatchupNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Comparison not found</h1>
      <p className="text-muted-foreground">We haven&rsquo;t run that head-to-head yet.</p>
      <Link
        to="/compare"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        See every head-to-head
      </Link>
    </div>
  );
}
