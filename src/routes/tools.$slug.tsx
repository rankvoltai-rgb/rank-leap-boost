import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, ListOrdered, Lock, Zap } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/shared";
import { BlogCta } from "@/components/blog/ArticleChrome";
import { ExploreMore } from "@/components/ExploreMore";
import {
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  PANEL,
  Pill,
  Spacer,
} from "@/components/landing/frame";
import { KindBadge, ToolCard, ToolFaq, ToolIconTile } from "@/components/tools/hub";
import { cn } from "@/lib/utils";
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

/* The landing page's frame around one tool: its name and promise, the tool
   itself on the soft panel, the tools that pair with it, then how to use it
   and the questions people ask. */
function ToolPage() {
  const { slug } = Route.useParams();
  const tool = getTool(slug)!;
  const category = getToolCategory(tool.category);
  const ToolComponent = TOOL_COMPONENTS[slug];
  const related = relatedTools(tool, 3);
  const kind = KIND_LABEL[tool.kind];

  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        {/* Header */}
        <section className="relative bg-white">
          <div className={cn("mx-auto max-w-6xl border-x px-5 pb-10 pt-8 sm:px-10 sm:pt-10", LINE)}>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-muted-foreground"
            >
              <Link to="/tools" className="py-1 transition-colors hover:text-ink">
                Free Tools
              </Link>
              <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
              <Link
                to="/tools"
                search={{ category: tool.category }}
                hash="all-tools"
                className="py-1 transition-colors hover:text-ink"
              >
                {category.name}
              </Link>
              <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
              <span className="text-ink">{tool.name}</span>
            </nav>
            <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="flex items-start gap-5">
                <ToolIconTile
                  tool={tool}
                  className="hidden h-14 w-14 rounded-xl bg-cta-soft text-cta sm:flex"
                />
                <div className="min-w-0">
                  <h1 className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.6rem]">
                    {tool.h1}
                  </h1>
                  <p className="mt-4 max-w-2xl text-balance text-[1.02rem] leading-relaxed text-muted-foreground">
                    {tool.intro}
                  </p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2 text-xs text-muted-foreground lg:justify-end">
                <li className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white px-2.5">
                  <KindBadge kind={tool.kind} className="h-auto border-0 bg-transparent p-0" />
                  <span className="text-muted-foreground/60">·</span>
                  {kind.note}
                </li>
                <li className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white px-2.5">
                  <Lock className="h-3.5 w-3.5 text-cta" />
                  No signup
                </li>
                <li className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white px-2.5">
                  <Zap className="h-3.5 w-3.5 text-cta" />
                  Free
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Workbench */}
        <section aria-label={tool.name}>
          <Band inner={cn("px-5 py-8 sm:px-8 sm:py-10", PANEL)}>
            {ToolComponent ? (
              <ToolComponent />
            ) : (
              <p className="rounded-xl border border-dashed border-ink/[0.12] bg-white px-6 py-12 text-center text-muted-foreground">
                This tool is coming soon.
              </p>
            )}
          </Band>
        </section>

        {/* Related */}
        <section aria-labelledby="related-title">
          <Spacer />
          <Band inner="flex flex-col gap-3 px-6 py-7 sm:flex-row sm:items-end sm:justify-between sm:px-10">
            <div>
              <p className="text-[0.78rem] font-medium text-cta">Next step</p>
              <h2
                id="related-title"
                className="mt-1 font-display text-[1.6rem] font-medium tracking-[-0.025em] text-ink"
              >
                Tools that pair with this one
              </h2>
            </div>
            <Link to="/tools" className={cn(GHOST_BUTTON, "group/btn w-fit")}>
              All tools
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Band>
          <Band>
            <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <li key={t.slug} className={CELL}>
                  <ToolCard tool={t} />
                </li>
              ))}
            </CellGrid>
          </Band>
        </section>

        {/* How-to */}
        <section aria-labelledby="howto-title">
          <Spacer />
          <Band>
            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
              <Reveal
                className={cn(
                  "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
                  LINE,
                )}
              >
                <Pill icon={ListOrdered} className="w-fit">
                  {tool.howto.length} steps
                </Pill>
                <h2
                  id="howto-title"
                  className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]"
                >
                  How to use it
                </h2>
              </Reveal>
              <ol className="divide-y divide-ink/[0.07] px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
                {tool.howto.map((step, i) => (
                  <li key={step} className="flex gap-4 py-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cta-soft text-[0.78rem] font-semibold tabular-nums text-cta">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[0.95rem] leading-relaxed text-ink/85">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Band>
        </section>

        <ToolFaq title="Frequently asked" faqs={tool.faqs} />
        <ExploreMore path={`/tools/${tool.slug}`} framed />
        <BlogCta framed title="Want this on autopilot?" />
      </main>
      <Footer />
    </div>
  );
}

function ToolNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-5 text-center">
      <h1 className="font-display text-3xl font-medium tracking-[-0.025em] text-ink">
        Tool not found
      </h1>
      <p className="text-muted-foreground">That tool doesn't exist.</p>
      <Link
        to="/tools"
        className="rounded-lg bg-cta px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
      >
        Browse all tools
      </Link>
    </div>
  );
}

function ToolError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-5 text-center">
      <h1 className="font-display text-3xl font-medium tracking-[-0.025em] text-ink">
        Something went wrong
      </h1>
      <Link
        to="/tools"
        className="rounded-lg bg-cta px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
      >
        Browse all tools
      </Link>
    </div>
  );
}
