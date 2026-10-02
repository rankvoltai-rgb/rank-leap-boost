import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DocArticle } from "@/components/docs/DocArticle";
import { DocsNotFound } from "@/components/docs/DocsNotFound";
import { DocsToc } from "@/components/docs/DocsToc";
import { PageActions } from "@/components/docs/PageActions";
import { AUTHOR_ORG } from "@/data/company";
import { DOCS_SITE, docsMarkdownPath, docsPath } from "@/data/docs";
import { formatDate } from "@/lib/format-date";
import type { DocLink, DocPageData } from "@/lib/docs/content.server";
import { docPageQuery } from "@/lib/docs/queries";

export const Route = createFileRoute("/docs/$section/$page")({
  loader: async ({ params, context }) => {
    const page = await context.queryClient.ensureQueryData(
      docPageQuery(params.section, params.page),
    );
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    if (!page) return { meta: [{ title: "Page not found | Rankbox Docs" }] };
    const url = `${DOCS_SITE}${page.path}`;
    const title = `${page.title} | Rankbox Docs`;
    return {
      meta: [
        { title },
        { name: "description", content: page.description },
        { property: "og:title", content: title },
        { property: "og:description", content: page.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        ...(page.updated ? [{ property: "article:modified_time", content: page.updated }] : []),
        { property: "article:section", content: page.sectionTitle },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: page.description },
      ],
      links: [
        { rel: "canonical", href: url },
        // The same page as plain markdown, for agents and LLM tools.
        {
          rel: "alternate",
          type: "text/markdown",
          href: `${DOCS_SITE}${docsMarkdownPath(page.section, page.slug)}`,
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "TechArticle",
                "@id": `${url}#article`,
                headline: page.title,
                description: page.description,
                url,
                inLanguage: "en",
                articleSection: page.sectionTitle,
                wordCount: page.words,
                ...(page.updated ? { dateModified: page.updated } : {}),
                author: AUTHOR_ORG,
                publisher: { "@type": "Organization", name: "Rankbox", url: DOCS_SITE },
                isPartOf: { "@type": "WebSite", name: "Rankbox Docs", url: `${DOCS_SITE}/docs` },
                encoding: {
                  "@type": "MediaObject",
                  encodingFormat: "text/markdown",
                  contentUrl: `${DOCS_SITE}${docsMarkdownPath(page.section, page.slug)}`,
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Docs", item: `${DOCS_SITE}/docs` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: page.sectionTitle,
                    item: `${DOCS_SITE}${docsPath(page.section)}`,
                  },
                  { "@type": "ListItem", position: 3, name: page.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: DocPageRoute,
  notFoundComponent: DocsNotFound,
});

function DocPageRoute() {
  const { section, page: slug } = Route.useParams();
  const { data } = useSuspenseQuery(docPageQuery(section, slug));
  if (!data) return <DocsNotFound />;
  // Keyed so moving between pages starts the outline and scroll-spy fresh.
  return <DocPage key={data.path} page={data} />;
}

function DocPage({ page }: { page: DocPageData }) {
  const outline = page.headings;
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13.5rem] xl:gap-12">
      <article className="min-w-0 max-w-[46rem] pb-16 pt-8 lg:pt-10">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm">
          <Link to="/docs" className="text-muted-foreground transition-colors hover:text-ink">
            Docs
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden />
          <Link
            to={docsPath(page.section)}
            className="font-medium text-cta transition-colors hover:text-cta-hover"
          >
            {page.sectionTitle}
          </Link>
        </nav>

        <header className="border-b border-border pb-7">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-[2rem] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[2.35rem]">
              {page.title}
            </h1>
            <PageActions path={page.path} title={page.title} />
          </div>
          {page.description && (
            <p className="mt-4 text-[1.075rem] leading-relaxed text-muted-foreground">
              {page.description}
            </p>
          )}
        </header>

        {outline.length > 2 && (
          <details className="group mt-6 rounded-xl border border-border bg-card xl:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <ol className="space-y-1 px-4 pb-4 text-sm">
              {outline
                .filter((h) => h.depth === 2)
                .map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-muted-foreground hover:text-ink">
                      {h.text}
                    </a>
                  </li>
                ))}
            </ol>
          </details>
        )}

        <div className="mt-8">
          <DocArticle html={page.html} />
        </div>

        <footer className="mt-14 space-y-6">
          {page.updated && (
            <p className="text-sm text-muted-foreground">
              Last updated <time dateTime={page.updated}>{formatDate(page.updated)}</time>
            </p>
          )}
          <Pager prev={page.prev} next={page.next} />
        </footer>
      </article>

      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] overflow-y-auto py-10 xl:block">
        <DocsToc headings={outline} />
      </aside>
    </div>
  );
}

function Pager({ prev, next }: { prev: DocLink | null; next: DocLink | null }) {
  if (!prev && !next) return null;
  const card =
    "group flex min-w-0 flex-1 flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-cta/40 hover:bg-cta-soft/40";
  return (
    <nav aria-label="Previous and next pages" className="flex flex-col gap-3 sm:flex-row">
      {prev ? (
        <Link to={prev.path} className={card}>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
            Previous
          </span>
          <span className="truncate font-semibold text-ink group-hover:text-cta">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link to={next.path} className={`${card} sm:items-end sm:text-right`}>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="truncate font-semibold text-ink group-hover:text-cta">{next.title}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
