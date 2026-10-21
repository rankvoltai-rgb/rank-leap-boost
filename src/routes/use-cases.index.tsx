import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { UseCasesIndexPage } from "@/components/personas/use-cases-index/UseCasesIndexPage";
import { PERSONAS } from "@/data/personas";

const SITE = "https://rankbox.xyz";
const TITLE = "Who Rankbox Is For: Use Cases by Role and Business";
const DESCRIPTION =
  "The same AI search growth engine, written for your seat or your business: marketers, solo founders, SEO agencies, e-commerce stores, SaaS companies, and local businesses.";

export const Route = createFileRoute("/use-cases/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/use-cases` },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}/use-cases` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${SITE}/use-cases#webpage`,
              url: `${SITE}/use-cases`,
              name: TITLE,
              description: DESCRIPTION,
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: { "@id": `${SITE}/use-cases#list` },
            },
            {
              "@type": "ItemList",
              "@id": `${SITE}/use-cases#list`,
              itemListElement: PERSONAS.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `Rankbox for ${p.nameLower}`,
                url: `${SITE}/use-cases/${p.slug}`,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "Use cases", item: `${SITE}/use-cases` },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: UseCasesIndex,
});

/* White, like the landing: the framed bar's rails run on into the page's. The
   body is its own layout, in src/components/personas/use-cases-index/. */
function UseCasesIndex() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <UseCasesIndexPage />
      </main>
      <Footer />
    </div>
  );
}
