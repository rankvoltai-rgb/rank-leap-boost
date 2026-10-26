import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AlternativesHubPage } from "@/components/alternatives/index-page/AlternativesHubPage";
import { ALTERNATIVES_UPDATED, COMPETITORS, listNames } from "@/data/alternatives";

const SITE = "https://rankbox.xyz";
const TITLE = "Rankbox Alternatives & Comparisons (2026) | Honest Side-by-Sides";
const DESCRIPTION = `How Rankbox compares to ${listNames(COMPETITORS.map((c) => c.name))}: checked against each tool's own pages, with cost per article and when each is the better choice.`;

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

function AlternativesIndex() {
  return (
    // Pure white, like the landing: the page frame's hairlines are drawn for it.
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <AlternativesHubPage />
      </main>
      <Footer />
    </div>
  );
}
