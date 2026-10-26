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
      <header className="flex items-start gap-4 border-b border-ink/[0.07] pb-7">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cta-soft text-cta">
          <DocsIcon name={section.icon} className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-[2rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
            {section.title}
          </h1>
          <p className="mt-2 text-[1.075rem] leading-relaxed text-muted-foreground">
            {section.blurb}
          </p>
        </div>
      </header>

      <ol className="mt-4 divide-y divide-ink/[0.07]">
        {section.pages.map((page, i) => (
          <li key={page.slug}>
            <Link
              to={page.path}
              className="group flex items-start gap-4 rounded-lg px-2 py-5 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)]"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink/[0.045] text-xs font-medium tabular-nums text-ink/70 transition-colors group-hover:bg-cta-soft group-hover:text-cta">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink group-hover:text-cta">
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
