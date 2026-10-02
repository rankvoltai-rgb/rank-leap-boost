import { Link, createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { DocsIcon } from "@/components/docs/DocsIcon";
import { DocsNotFound } from "@/components/docs/DocsNotFound";
import { DOCS_SITE, docsMarkdownPath, docsPath, getDocsSection } from "@/data/docs";
import { docsNavQuery } from "@/lib/docs/queries";

/** A section's overview: what it covers and every page in it, in reading order. */
export const Route = createFileRoute("/docs/$section/")({
  head: ({ params }) => {
    const section = getDocsSection(params.section);
    if (!section) return { meta: [{ title: "Page not found | Rankbox Docs" }] };
    const url = `${DOCS_SITE}${docsPath(section.slug)}`;
    const title = `${section.title} | Rankbox Docs`;
    return {
      meta: [
        { title },
        { name: "description", content: section.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: section.blurb },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "canonical", href: url },
        {
          rel: "alternate",
          type: "text/markdown",
          href: `${DOCS_SITE}${docsMarkdownPath(section.slug)}`,
        },
      ],
    };
  },
  component: SectionPage,
});

function SectionPage() {
  const { section: slug } = Route.useParams();
  const { data } = useSuspenseQuery(docsNavQuery);
  const section = data.sections.find((s) => s.slug === slug);
  if (!section) return <DocsNotFound />;

  return (
    <div className="max-w-[46rem] pb-20 pt-8 lg:pt-10">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm">
        <Link to="/docs" className="text-muted-foreground transition-colors hover:text-ink">
          Docs
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden />
        <span className="font-medium text-ink">{section.title}</span>
      </nav>
      <header className="flex items-start gap-4 border-b border-border pb-7">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cta/25 bg-cta-soft text-cta">
          <DocsIcon name={section.icon} className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.35rem]">
            {section.title}
          </h1>
          <p className="mt-2 text-[1.075rem] leading-relaxed text-muted-foreground">
            {section.blurb}
          </p>
        </div>
      </header>

      <ol className="mt-4 divide-y divide-border">
        {section.pages.map((page, i) => (
          <li key={page.slug}>
            <Link
              to={page.path}
              className="group flex items-start gap-4 rounded-lg px-2 py-5 transition-colors hover:bg-secondary/60"
            >
              <span className="mt-0.5 w-6 shrink-0 text-right text-sm font-medium tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink group-hover:text-cta">
                  {page.title}
                </span>
                <span className="mt-1 block text-[0.95rem] leading-relaxed text-muted-foreground">
                  {page.description}
                </span>
              </span>
              <ChevronRight
                className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-cta"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
