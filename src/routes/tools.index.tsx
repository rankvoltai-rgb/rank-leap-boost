import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { INSTANT_TOOLS, AI_TOOLS, type Tool } from "@/data/tools";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "Free SEO & AI Search Tools | Rankvolt" },
      {
        name: "description",
        content:
          "Free tools for SEO and AI search: llms.txt generator, AI crawler robots.txt, schema markup, SERP preview, AI question generator, content briefs, and meta writer.",
      },
      { property: "og:title", content: "Free SEO & AI Search Tools | Rankvolt" },
      {
        property: "og:description",
        content:
          "A free toolkit to get found on Google and cited by AI engines — llms.txt, robots.txt, schema, SERP preview, and AI content tools.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/tools" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/tools" }],
  }),
  component: ToolsIndex,
});

function ToolRow({ tool }: { tool: Tool }) {
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className="group flex items-center justify-between gap-6 border-b border-border py-5 transition-colors hover:bg-secondary/40"
    >
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-ink">{tool.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tool.tagline}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-volt transition-colors group-hover:text-ink">
        Open →
      </span>
    </Link>
  );
}

function ToolGroupSection({
  label,
  note,
  tools,
}: {
  label: string;
  note: string;
  tools: Tool[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{label}</h2>
        <span className="text-xs text-muted-foreground">{note}</span>
      </div>
      <div className="mt-2 border-t border-border">
        {tools.map((tool) => (
          <ToolRow key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function ToolsIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-5 pb-12 pt-16 sm:pt-24">
            <Reveal>
              <Eyebrow className="mb-5">Free Tools</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Free tools to win Google &amp; AI search
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
                A small, focused toolkit for getting found. Generate the files AI crawlers look for,
                preview your search snippet, and plan content that becomes the answer AI engines
                cite. No signup required.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl space-y-14 px-5">
            <ToolGroupSection
              label="Instant tools"
              note="No signup · Runs in your browser"
              tools={INSTANT_TOOLS}
            />
            <ToolGroupSection label="AI-powered tools" note="Free · Powered by AI" tools={AI_TOOLS} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}