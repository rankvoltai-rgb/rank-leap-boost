import { Link, createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookMarked, Check, Copy, Search } from "lucide-react";
import { DocsIcon } from "@/components/docs/DocsIcon";
import { Accent, Pill } from "@/components/landing/frame";
import { MarkDither } from "@/components/landing/hero-dither";
import { useOpenDocsSearch } from "@/components/docs/search-context";
import { DOCS_SITE, docsMarkdownPath } from "@/data/docs";
import type { DocsNavSection } from "@/lib/docs/content.server";
import { docsNavQuery } from "@/lib/docs/queries";
import { formatDate } from "@/lib/format-date";

const TITLE = "Rankbox Docs: guides, API reference and agent access";
const DESCRIPTION =
  "How Rankbox works and how to set it up: research, writing, publishing to Webflow, Shopify, Framer or any site, the REST API, the MCP server, and agent access.";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${DOCS_SITE}/docs` },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: `${DOCS_SITE}/docs` },
      { rel: "alternate", type: "text/markdown", href: `${DOCS_SITE}/docs/llms.txt` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Rankbox Docs",
          description: DESCRIPTION,
          url: `${DOCS_SITE}/docs`,
          isPartOf: { "@type": "WebSite", name: "Rankbox", url: DOCS_SITE },
          publisher: { "@type": "Organization", name: "Rankbox", url: DOCS_SITE },
        }),
      },
    ],
  }),
  component: DocsHome,
});

/* The three ways in. Each names the pages that path reads, in order. */
const PATHS: { title: string; body: string; links: [label: string, to: string][] }[] = [
  {
    title: "Set up Rankbox",
    body: "From sign-up to your first published article, then autopilot.",
    links: [
      ["Quickstart", "/docs/get-started/quickstart"],
      ["How Rankbox works", "/docs/get-started/how-it-works"],
      ["How publishing works", "/docs/publishing/overview"],
    ],
  },
  {
    title: "Build on the API",
    body: "Pull finished articles into any CMS and report where they went live.",
    links: [
      ["API overview", "/docs/api/overview"],
      ["Articles endpoints", "/docs/api/articles"],
      ["Build a CMS integration", "/docs/api/build-an-integration"],
    ],
  },
  {
    title: "Run Rankbox from an agent",
    body: "Let an AI agent create the account and operate everything for a project.",
    links: [
      ["Agent access", "/docs/agents/overview"],
      ["Quickstart for agents", "/docs/agents/quickstart"],
      ["Agent API reference", "/docs/agents/api-reference"],
    ],
  },
];

const AGENT_PROMPT =
  "Read https://rankbox.xyz/docs/llms.txt, then follow https://rankbox.xyz/docs/agents/quickstart.md to set up Rankbox for this project.";

function DocsHome() {
  const { data } = useSuspenseQuery(docsNavQuery);
  const openSearch = useOpenDocsSearch();
  const pageCount = data.sections.reduce((n, s) => n + s.pages.length, 0);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-ink/[0.07]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-full opacity-[0.28] [mask-image:radial-gradient(ellipse_55%_80%_at_25%_50%,#000_40%,transparent_100%)] lg:w-[60%]"
        >
          <MarkDither />
        </div>
        <div className="relative mx-auto grid max-w-[90rem] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-center lg:py-20">
          <div className="max-w-xl">
            <Pill icon={BookMarked}>
              {data.sections.length} sections · {pageCount} pages
            </Pill>
            <h1 className="mt-6 font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.035em] text-ink sm:text-[3.4rem]">
              Rankbox <Accent>documentation</Accent>
            </h1>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground sm:text-lg">
              How the engine researches, writes and publishes, how to connect your site, and the
              APIs behind it. Written for the people who run Rankbox and for the AI agents working
              alongside them.
            </p>
            <button
              type="button"
              onClick={openSearch}
              className="mt-8 flex h-12 w-full max-w-md items-center gap-3 rounded-lg border border-ink/[0.1] bg-white px-4 text-left text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] hover:border-ink/[0.18] focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)]"
            >
              <Search className="h-[1.1rem] w-[1.1rem]" aria-hidden />
              <span className="flex-1">Search {pageCount} pages</span>
              <kbd className="rounded border border-ink/[0.1] bg-white px-1.5 py-0.5 font-sans text-xs font-medium">
                /
              </kbd>
            </button>
            {data.updated && (
              <p className="mt-4 text-sm text-muted-foreground">
                Updated <time dateTime={data.updated}>{formatDate(data.updated)}</time>
              </p>
            )}
          </div>
          <AgentPanel sections={data.sections} />
        </div>
      </section>

      <section aria-labelledby="paths" className="mx-auto max-w-[90rem] px-4 pt-14 sm:px-6">
        <h2 id="paths" className="sr-only">
          Where to start
        </h2>
        <div className="grid overflow-hidden rounded-xl border border-ink/[0.08] bg-white md:grid-cols-3 md:divide-x md:divide-ink/[0.07] max-md:divide-y max-md:divide-ink/[0.07]">
          {PATHS.map((p) => (
            <div key={p.title} className="p-6 lg:p-7">
              <h3 className="text-[1.08rem] font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">
                {p.body}
              </p>
              <ol className="mt-5 space-y-2.5">
                {p.links.map(([label, to], i) => (
                  <li key={to} className="flex items-center gap-3 text-[0.95rem]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft text-[0.7rem] font-semibold tabular-nums text-cta">
                      {i + 1}
                    </span>
                    <Link
                      to={to}
                      className="font-medium text-ink underline decoration-ink/15 underline-offset-4 transition-colors hover:text-cta hover:decoration-cta/40"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="all-docs" className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6">
        <h2
          id="all-docs"
          className="font-display text-[1.75rem] font-medium tracking-[-0.025em] text-ink sm:text-[2rem]"
        >
          Every page, <Accent>by section</Accent>
        </h2>
        <p className="mt-2 text-muted-foreground">
          {data.sections.length} sections, {pageCount} pages. Each section lists its pages in
          reading order.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-ink/[0.08] bg-ink/[0.07] sm:grid-cols-2 xl:grid-cols-3">
          {data.sections.map((s) => (
            <SectionBlock key={s.slug} section={s} />
          ))}
          {/* Fill the last row so no grey cell shows through the hairlines. */}
          {Array.from({ length: (3 - (data.sections.length % 3)) % 3 }, (_, i) => (
            <div key={`pad-${i}`} aria-hidden className="hidden bg-white xl:block" />
          ))}
          {data.sections.length % 2 === 1 && (
            <div aria-hidden className="hidden bg-white sm:block xl:hidden" />
          )}
        </div>
      </section>
    </main>
  );
}

function SectionBlock({ section }: { section: DocsNavSection }) {
  return (
    <div className="bg-white p-6 sm:p-7">
      <Link to={section.path} className="group flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink/[0.045] text-ink/70 transition-colors group-hover:bg-cta-soft group-hover:text-cta">
          <DocsIcon name={section.icon} className="h-[1.05rem] w-[1.05rem]" />
        </span>
        <span className="text-[1.05rem] font-semibold tracking-tight text-ink group-hover:text-cta">
          {section.title}
        </span>
      </Link>
      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted-foreground">{section.blurb}</p>
      <ul className="mt-4 space-y-2 border-l border-ink/[0.08] pl-4">
        {section.pages.map((p) => (
          <li key={p.slug}>
            <Link
              to={p.path}
              className="text-[0.92rem] text-ink/85 transition-colors hover:text-cta hover:underline"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The page's one visual: what an agent sees when it reads these docs. The
 * lines are the real head of /docs/llms.txt, built from the same nav. Drawn
 * as a light code card, like the product screens on the landing.
 */
function AgentPanel({ sections }: { sections: DocsNavSection[] }) {
  const [copied, setCopied] = useState(false);
  const first = sections[0];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the prompt is visible to copy by hand.
    }
  };

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white text-[0.82rem] leading-relaxed text-ink/80 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)]">
        <div className="flex items-center justify-between border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-4 py-2.5">
          <span className="flex items-center gap-2.5">
            <span className="flex gap-1" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-ink/[0.1]" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/[0.1]" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/[0.1]" />
            </span>
            <span className="font-medium text-muted-foreground">What an agent reads</span>
          </span>
          <a
            href="/docs/llms.txt"
            className="rounded-md border border-ink/[0.1] bg-white px-2 py-0.5 text-xs font-medium text-ink/75 transition-colors hover:border-cta/30 hover:text-cta"
          >
            Open llms.txt
          </a>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono">
          <code>
            <span className="text-ink/35">$ </span>
            <span className="text-cta">curl</span> {DOCS_SITE}/docs/llms.txt
            {"\n\n"}
            <span className="font-semibold text-ink"># Rankbox Docs</span>
            {"\n"}
            <span className="text-ink/50">
              {"> Documentation for Rankbox, the AI search growth engine…"}
            </span>
            {"\n\n"}
            {first && (
              <>
                <span className="font-semibold text-ink">## {first.title}</span>
                {"\n"}
                {first.pages.slice(0, 4).map((p) => (
                  <span key={p.slug}>
                    {"- ["}
                    <span className="text-[#b45309]">{p.navTitle}</span>
                    {"]("}
                    <span className="text-[#15803d]">…{docsMarkdownPath(first.slug, p.slug)}</span>
                    {")\n"}
                  </span>
                ))}
              </>
            )}
            <span className="text-ink/35">…</span>
          </code>
        </pre>
      </div>
      <div className="mt-4 rounded-xl border border-ink/[0.08] bg-white p-4">
        <p className="text-sm font-medium text-ink">Point your agent here</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{AGENT_PROMPT}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-cta px-3 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy prompt"}
          </button>
          <span className="text-xs text-muted-foreground">
            Any page works as Markdown too: add <code className="font-mono">.md</code> to its URL.
          </span>
        </div>
      </div>
    </div>
  );
}
