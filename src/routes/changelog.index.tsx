import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BlogCta } from "@/components/blog/ArticleChrome";
import { ChangelogHero, FilterBar, Timeline } from "@/components/changelog/hub";
import { SITE, entryUrl } from "@/components/changelog/kit";
import {
  CHANGELOG,
  CHANGELOG_FEED_PATH,
  CHANGELOG_UPDATED,
  isKind,
  type ChangeKind,
} from "@/data/changelog";

const PAGE_URL = `${SITE}/changelog`;
const TITLE = "Changelog — What's new in Rankbox";
const DESCRIPTION =
  "Every release to Rankbox, dated: new features, improvements and resources, each marked live, rolling out or coming soon.";

export const Route = createFileRoute("/changelog/")({
  validateSearch: (search: Record<string, unknown>): { type?: ChangeKind } =>
    isKind(search.type) ? { type: search.type } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    /* Filtered views (?type=) are the same log narrowed, so they all point here. */
    links: [
      { rel: "canonical", href: PAGE_URL },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Rankbox changelog",
        href: `${SITE}${CHANGELOG_FEED_PATH}`,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Blog",
              "@id": `${PAGE_URL}#blog`,
              url: PAGE_URL,
              name: "Rankbox changelog",
              description: DESCRIPTION,
              dateModified: CHANGELOG_UPDATED,
              inLanguage: "en",
              isPartOf: { "@id": `${SITE}/#website` },
              publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
              blogPost: CHANGELOG.map((e) => ({
                "@type": "BlogPosting",
                "@id": `${entryUrl(e.slug)}#post`,
                headline: e.title,
                description: e.summary,
                datePublished: e.date,
                url: entryUrl(e.slug),
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "Changelog", item: PAGE_URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: ChangelogIndex,
});

function ChangelogIndex() {
  const { type } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ChangelogHero />
        <FilterBar
          kind={type}
          onKind={(k) => {
            void navigate({ search: k ? { type: k } : {}, replace: true, resetScroll: false });
            // Filtering from deep in the log would leave you somewhere arbitrary
            // in the shorter list, so go back to its top.
            const timeline = document.getElementById("timeline");
            if (timeline && timeline.getBoundingClientRect().top < 0) {
              timeline.scrollIntoView({ block: "start" });
            }
          }}
        />
        <Timeline kind={type} />
        <BlogCta title="See what Rankbox would publish for your site" />
      </main>
      <Footer />
    </div>
  );
}
