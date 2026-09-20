import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import {
  AlternativeHero,
  ShortAnswer,
  AlternativeSpecs,
  Positioning,
  CostComparison,
  Battlegrounds,
  BetterWhen,
  Migration,
  AlternativeProof,
  AlternativeFAQ,
  OtherComparisons,
  AlternativeCTA,
} from "@/components/alternatives/AlternativeSections";
import { ComparisonMatrix } from "@/components/alternatives/ComparisonMatrix";
import { competitorH1, getCompetitor } from "@/data/alternatives";
import { PLAN } from "@/data/pricing";

const SITE = "https://rankbox.xyz";

export const Route = createFileRoute("/alternatives/$slug")({
  loader: ({ params }) => {
    if (!getCompetitor(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const url = `${SITE}/alternatives/${params.slug}`;
    const c = getCompetitor(params.slug);
    if (!c) return { meta: [{ title: "Comparison not found — Rankbox" }] };

    return {
      meta: [
        { title: c.metaTitle },
        { name: "description", content: c.metaDescription },
        { property: "og:title", content: c.metaTitle },
        { property: "og:description", content: c.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: c.metaTitle },
        { name: "twitter:description", content: c.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: c.metaTitle,
                headline: competitorH1(c),
                description: c.metaDescription,
                /* The quotable paragraph, handed to answer engines directly
                   rather than left to be scraped out of the layout. */
                abstract: c.shortAnswer,
                inLanguage: "en",
                isPartOf: { "@id": `${SITE}/#website` },
                breadcrumb: { "@id": `${url}#breadcrumb` },
                about: { "@id": `${url}#software` },
                mentions: {
                  "@type": "SoftwareApplication",
                  name: c.name,
                  applicationCategory: "BusinessApplication",
                },
                /* Comparisons are opinion, so the page says whose. */
                publisher: { "@id": `${SITE}/#organization` },
                dateModified: c.pricing.checkedOn,
              },
              {
                "@type": "SoftwareApplication",
                "@id": `${url}#software`,
                name: "Rankbox",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url: SITE,
                description: c.verdict.rankbox,
                featureList: c.matrix.flatMap((g) =>
                  g.rows
                    .filter((r) => r.rankbox.state === "yes")
                    .map((r) => `${r.label}: ${r.rankbox.note}`),
                ),
                publisher: { "@id": `${SITE}/#organization` },
                offers: {
                  "@type": "Offer",
                  price: String(PLAN.monthly),
                  priceCurrency: "USD",
                  url: `${SITE}/pricing`,
                },
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Alternatives",
                    item: `${SITE}/alternatives`,
                  },
                  { "@type": "ListItem", position: 3, name: `vs ${c.name}`, item: url },
                ],
              },
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: c.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: AlternativePage,
  notFoundComponent: AlternativeNotFound,
  errorComponent: AlternativeError,
});

/* The landing's rhythm, rebuilt around one comparison. Section ids (top,
   compare, proof, pricing, faq) match the landing so the shared navbar's
   anchors keep working here. */
function AlternativePage() {
  const { slug } = Route.useParams();
  const competitor = getCompetitor(slug)!;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <AlternativeHero competitor={competitor} />
        <ShortAnswer competitor={competitor} />
        <AlternativeSpecs competitor={competitor} />
        <Positioning competitor={competitor} />
        <ComparisonMatrix competitor={competitor} />
        <CostComparison competitor={competitor} />
        <Battlegrounds competitor={competitor} />
        <BetterWhen competitor={competitor} />
        <Migration competitor={competitor} />
        <AlternativeProof competitor={competitor} />
        <div className="border-t border-border bg-surface/40">
          <Pricing />
        </div>
        <AlternativeFAQ competitor={competitor} />
        <OtherComparisons competitor={competitor} />
        <AlternativeCTA competitor={competitor} />
      </main>
      <Footer />
    </div>
  );
}

function AlternativeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Comparison not found</h1>
      <p className="text-muted-foreground">We haven&rsquo;t written that comparison yet.</p>
      <Link
        to="/alternatives"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        See all comparisons
      </Link>
    </div>
  );
}

function AlternativeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <Link
        to="/alternatives"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        See all comparisons
      </Link>
    </div>
  );
}
