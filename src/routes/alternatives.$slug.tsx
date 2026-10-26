import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import type { ComponentType } from "react";
import { SurferSeoAlternativePage } from "@/components/alternatives/surfer-seo/SurferSeoAlternativePage";
import { BywordAlternativePage } from "@/components/alternatives/byword/BywordAlternativePage";
import { RankpillAlternativePage } from "@/components/alternatives/rankpill/RankpillAlternativePage";
import { JasperAlternativePage } from "@/components/alternatives/jasper/JasperAlternativePage";
import { FraseAlternativePage } from "@/components/alternatives/frase/FraseAlternativePage";
import { OutrankAlternativePage } from "@/components/alternatives/outrank/OutrankAlternativePage";
import { WritesonicAlternativePage } from "@/components/alternatives/writesonic/WritesonicAlternativePage";
import { KoalaAiAlternativePage } from "@/components/alternatives/koala-ai/KoalaAiAlternativePage";
import { SeobotAlternativePage } from "@/components/alternatives/seobot/SeobotAlternativePage";
import { competitorH1, getCompetitor, type Competitor } from "@/data/alternatives";
import { PLAN } from "@/data/pricing";

const SITE = "https://rankbox.xyz";

/* Every comparison has a layout of its own, drawn in the landing page's
   frame, so no two are one template with the names swapped. The head below
   stays shared. */
const LAYOUTS: Record<string, ComponentType<{ competitor: Competitor }>> = {
  "surfer-seo": SurferSeoAlternativePage,
  byword: BywordAlternativePage,
  rankpill: RankpillAlternativePage,
  jasper: JasperAlternativePage,
  frase: FraseAlternativePage,
  outrank: OutrankAlternativePage,
  writesonic: WritesonicAlternativePage,
  "koala-ai": KoalaAiAlternativePage,
  seobot: SeobotAlternativePage,
};

export const Route = createFileRoute("/alternatives/$slug")({
  loader: ({ params }) => {
    // A competitor without a layout yet 404s rather than rendering blank.
    if (!getCompetitor(params.slug) || !LAYOUTS[params.slug]) throw notFound();
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
                  url: `https://${c.domain}`,
                  applicationCategory: "BusinessApplication",
                },
                /* Comparisons are opinion, so the page says whose, and what
                   it was checked against. */
                publisher: { "@id": `${SITE}/#organization` },
                dateModified: c.pricing.checkedOn,
                citation: c.sources.map((src) => ({
                  "@type": "CreativeWork",
                  name: src.label,
                  url: src.url,
                })),
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

/* The landing's rhythm, rebuilt around one comparison, in the order a
   buyer's objections arrive. There is one pricing story (the cost section),
   not a second copy of the landing's pricing block, and the page closes on
   its sources: the thing that makes a comparison believable is that it can
   be checked. */
function AlternativePage() {
  const { slug } = Route.useParams();
  const competitor = getCompetitor(slug)!;
  const Layout = LAYOUTS[slug];
  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <Layout competitor={competitor} />
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
        className="rounded-lg bg-cta px-5 py-3 text-sm font-semibold text-white hover:bg-cta-hover"
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
        className="rounded-lg bg-cta px-5 py-3 text-sm font-semibold text-white hover:bg-cta-hover"
      >
        See all comparisons
      </Link>
    </div>
  );
}
