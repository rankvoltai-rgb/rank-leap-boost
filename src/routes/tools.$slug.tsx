import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { getTool } from "@/data/tools";
import { TOOL_COMPONENTS } from "@/components/tools/registry";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    if (!getTool(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const url = `https://rankvolt.top/tools/${params.slug}`;
    const tool = getTool(params.slug);
    if (!tool) {
      return { meta: [{ title: "Tool not found — Rankvolt" }] };
    }
    return {
      meta: [
        { title: tool.metaTitle },
        { name: "description", content: tool.metaDescription },
        { property: "og:title", content: tool.metaTitle },
        { property: "og:description", content: tool.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "FAQPage",
                mainEntity: tool.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://rankvolt.top/" },
                  { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://rankvolt.top/tools" },
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
  const ToolComponent = TOOL_COMPONENTS[slug];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-14 sm:pt-20">
            <Reveal>
              <nav className="mb-5 text-sm text-muted-foreground">
                <Link to="/tools" className="transition-colors hover:text-ink">
                  Free Tools
                </Link>
                <span className="mx-2">/</span>
                <span className="text-ink">{tool.name}</span>
              </nav>
            </Reveal>
            <Reveal delay={0.04}>
              <Eyebrow className="mb-4">{tool.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="font-display text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl">
                {tool.h1}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
                {tool.intro}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-5">
            {ToolComponent ? (
              <ToolComponent />
            ) : (
              <p className="text-muted-foreground">This tool is coming soon.</p>
            )}
          </div>
        </section>

        <section className="border-t border-border py-14 sm:py-20">
          <div className="mx-auto grid max-w-4xl gap-12 px-5 md:grid-cols-2">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                How to use it
              </h2>
              <ol className="mt-5 space-y-4">
                {tool.howto.map((step, i) => (
                  <li key={step} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-ink">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                Frequently asked
              </h2>
              <div className="mt-5 space-y-5">
                {tool.faqs.map((faq) => (
                  <div key={faq.q}>
                    <p className="text-sm font-medium text-ink">{faq.q}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-20">
            <h2 className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Want this on autopilot?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
              Rankvolt researches, writes, and publishes citation-ready articles daily — so you
              become the answer AI recommends and rank on Google.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                See how Rankvolt works
              </Link>
              <Link
                to="/tools"
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-secondary"
              >
                Browse all tools
              </Link>
            </div>
          </div>
        </section>
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
      <Link to="/tools" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background">
        Browse all tools
      </Link>
    </div>
  );
}

function ToolError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <Link to="/tools" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background">
        Browse all tools
      </Link>
    </div>
  );
}