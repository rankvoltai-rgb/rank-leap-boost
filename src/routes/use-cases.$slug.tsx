import type { ComponentType } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MarketersPage } from "@/components/personas/marketers/MarketersPage";
import { SoloFoundersPage } from "@/components/personas/solo-founders/SoloFoundersPage";
import { SeoAgenciesPage } from "@/components/personas/seo-agencies/SeoAgenciesPage";
import { EcommercePage } from "@/components/personas/ecommerce/EcommercePage";
import { SaasPage } from "@/components/personas/saas/SaasPage";
import { LocalBusinessesPage } from "@/components/personas/local-businesses/LocalBusinessesPage";
import { getPersona, personaH1, type Persona } from "@/data/personas";
import { PLAN } from "@/data/pricing";

const SITE = "https://rankbox.xyz";

/* Every use case has a layout of its own, drawn in the landing page's frame
   (white page, hairline rails the navbar starts), so no two pages are one
   template with the words swapped. The head below stays shared. */
const LAYOUTS: Record<string, ComponentType<{ persona: Persona }>> = {
  marketers: MarketersPage,
  "solo-founders": SoloFoundersPage,
  "seo-agencies": SeoAgenciesPage,
  ecommerce: EcommercePage,
  saas: SaasPage,
  "local-businesses": LocalBusinessesPage,
};

export const Route = createFileRoute("/use-cases/$slug")({
  loader: ({ params }) => {
    // A persona without a layout yet 404s rather than rendering blank.
    if (!getPersona(params.slug) || !LAYOUTS[params.slug]) throw notFound();
  },
  head: ({ params }) => {
    const url = `${SITE}/use-cases/${params.slug}`;
    const p = getPersona(params.slug);
    if (!p) return { meta: [{ title: "Use case not found — Rankbox" }] };

    return {
      meta: [
        { title: p.metaTitle },
        { name: "description", content: p.metaDescription },
        { property: "og:title", content: p.metaTitle },
        { property: "og:description", content: p.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.metaTitle },
        { name: "twitter:description", content: p.metaDescription },
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
                name: p.metaTitle,
                headline: personaH1(p),
                description: p.metaDescription,
                /* The quotable paragraph, handed to answer engines directly
                   rather than left to be scraped out of the layout. */
                abstract: p.shortAnswer,
                inLanguage: "en",
                isPartOf: { "@id": `${SITE}/#website` },
                breadcrumb: { "@id": `${url}#breadcrumb` },
                about: { "@id": `${url}#software` },
                audience: {
                  "@type": "Audience",
                  audienceType: p.name,
                  name: p.name,
                },
                publisher: { "@id": `${SITE}/#organization` },
              },
              {
                "@type": "SoftwareApplication",
                "@id": `${url}#software`,
                name: "Rankbox",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url: SITE,
                description: p.shortAnswer,
                featureList: p.handoff.runs.map((r) => `${r.label}: ${r.detail}`),
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
                    name: "Use cases",
                    item: `${SITE}/use-cases`,
                  },
                  { "@type": "ListItem", position: 3, name: p.name, item: url },
                ],
              },
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: p.faqs.map((f) => ({
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
  component: PersonaPage,
  notFoundComponent: PersonaNotFound,
  errorComponent: PersonaError,
});

function PersonaPage() {
  const { slug } = Route.useParams();
  const persona = getPersona(slug)!;
  const Layout = LAYOUTS[slug];
  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <Layout persona={persona} />
      </main>
      <Footer />
    </div>
  );
}

function PersonaNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Use case not found</h1>
      <p className="text-muted-foreground">We haven&rsquo;t written that one yet.</p>
      <Link
        to="/use-cases"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        See all use cases
      </Link>
    </div>
  );
}

function PersonaError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <Link
        to="/use-cases"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        See all use cases
      </Link>
    </div>
  );
}
