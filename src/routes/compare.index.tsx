import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CompareIndexPage } from "@/components/compare/index-page/CompareIndexPage";
import { COMPARE_UPDATED, MATCHUPS, matchupTitle } from "@/data/compare/matchups";

const SITE = "https://rankbox.xyz";
const TITLE = "SEO & AI Search Tools, Compared Head to Head (2026)";
const DESCRIPTION =
  "Surfer SEO vs Clearscope, Semrush vs Ahrefs, Profound vs Peec AI and more — each run through the same rounds, with a winner per round, dated pricing, and a picker that tells you which one fits.";

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

/* The page body lives in components/compare/index-page, in the landing
   page's style: white, framed between hairline rails from the navbar down. */
function CompareHub() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <CompareIndexPage />
      </main>
      <Footer />
    </div>
  );
}
