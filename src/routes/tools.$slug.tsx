import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, Zap } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/shared";
import { BlogCta } from "@/components/blog/ArticleChrome";
import { FaqList } from "@/components/ai-seo/sections";
import { KindBadge, ToolCard, ToolIconTile } from "@/components/tools/hub";
import { KIND_LABEL, getTool, getToolCategory, relatedTools } from "@/data/tools";
import { TOOL_COMPONENTS } from "@/components/tools/registry";

const SITE = "https://rankbox.xyz";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    if (!getTool(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const url = `${SITE}/tools/${params.slug}`;
    const tool = getTool(params.slug);
    if (!tool) {
      return { meta: [{ title: "Tool not found — Rankbox" }] };
    }
    return {
      meta: [
        { title: tool.metaTitle },
        { name: "description", content: tool.metaDescription },
        { name: "keywords", content: tool.keywords.join(", ") },
        { property: "og:title", content: tool.metaTitle },
        { property: "og:description", content: tool.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: tool.metaTitle },
        { name: "twitter:description", content: tool.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "@id": `${url}#app`,
                name: tool.name,
                description: tool.metaDescription,
                url,
                applicationCategory: "BusinessApplication",
                applicationSubCategory: "SEO",
                operatingSystem: "Web",
                isAccessibleForFree: true,
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
              },
              {
                "@type": "HowTo",
                "@id": `${url}#howto`,
                name: `How to use the ${tool.name}`,
                step: tool.howto.map((text, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  text,
                })),
              },
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: tool.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  { "@type": "ListItem", position: 2, name: "Free Tools", item: `${SITE}/tools` },
                  { "@type": "ListItem", position: 3, name: tool.name, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: ToolNotFound,
  errorComponent: ToolError,
});

function ToolPage() {
  const { slug } = Route.useParams();
  const tool = getTool(slug)!;
  const category = getToolCategory(tool.category);
  const ToolComponent = TOOL_COMPONENTS[slug];
  const related = relatedTools(tool, 3);
  const kind = KIND_LABEL[tool.kind];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Header */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:pt-14">
            <Reveal>
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Link to="/tools" className="transition-colors hover:text-ink">
                  Free Tools
                </Link>
                <span aria-hidden>/</span>
                <Link
                  to="/tools"
                  search={{ category: tool.category }}
                  hash="all-tools"
                  className="transition-colors hover:text-ink"
                >
                  {category.name}
                </Link>
                <span aria-hidden>/</span>
                <span className="text-ink">{tool.name}</span>
              </nav>
            </Reveal>
            <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="flex items-start gap-5">
                <Reveal delay={0.04}>
                  <ToolIconTile
                    tool={tool}
                    className="hidden h-16 w-16 rounded-2xl shadow-1 sm:flex"
                  />
                </Reveal>
                <div className="min-w-0">
                  <Reveal delay={0.06}>
                    <h1 className="font-display text-balance text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
                      {tool.h1}
                    </h1>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-4 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-muted-foreground">
                      {tool.intro}
                    </p>
                  </Reveal>
                </div>
              </div>
              <Reveal delay={0.14}>
                <ul className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground lg:justify-end">
                  <li className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3">
                    <KindBadge kind={tool.kind} className="h-auto border-0 bg-transparent p-0" />
                    <span className="text-muted-foreground/70">·</span>
                    {kind.note}
                  </li>
                  <li className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3">
                    <Lock className="h-3.5 w-3.5" />
                    No signup
                  </li>
                  <li className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3">
                    <Zap className="h-3.5 w-3.5" />
                    Free
                  </li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Workbench */}
        <section aria-label={tool.name} className="bg-surface/50">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:py-12">
            {ToolComponent ? (
              <ToolComponent />
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-muted-foreground">
                This tool is coming soon.
              </p>
            )}
          </div>
        </section>

        {/* Related */}
        <section aria-labelledby="related-title" className="border-y border-border">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-volt">
                  Next step
                </p>
                <h2
                  id="related-title"
                  className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink"
                >
                  Tools that pair with this one
                </h2>
              </div>
              <Link
                to="/tools"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
              >
                All tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <li key={t.slug}>
                  <ToolCard tool={t} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How-to + FAQ */}
        <section aria-labelledby="howto-title" className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <h2
                id="howto-title"
                className="font-display text-2xl font-semibold tracking-tight text-ink"
              >
                How to use it
              </h2>
              <ol className="mt-6 space-y-5">
                {tool.howto.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[0.72rem] font-bold text-background">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[0.95rem] leading-relaxed text-ink/85">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Frequently asked
              </h2>
              <FaqList faqs={tool.faqs} />
            </div>
          </div>
        </section>

        <BlogCta title="Want this on autopilot?" />
      </main>
      <Footer />
    </div>
  );
}

function ToolNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Tool not found</h1>
      <p className="text-muted-foreground">That tool doesn't exist.</p>
      <Link
        to="/tools"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        Browse all tools
      </Link>
    </div>
  );
}

function ToolError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <Link
        to="/tools"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        Browse all tools
      </Link>
    </div>
  );
}
