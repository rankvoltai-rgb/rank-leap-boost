import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/shared";
import { BlogCta } from "@/components/blog/ArticleChrome";
import {
  CopyLink,
  EntryBody,
  EntryLabels,
  EntryLinks,
  SITE,
  StatusNote,
  entryUrl,
  weekday,
} from "@/components/changelog/kit";
import { EntryVisual } from "@/components/changelog/visuals";
import { CHANGELOG_FEED_PATH, getEntry, neighbours, type ChangelogEntry } from "@/data/changelog";
import { AUTHOR_ORG } from "@/data/company";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/changelog/$slug")({
  loader: ({ params }) => {
    const entry = getEntry(params.slug);
    if (!entry) throw notFound();
    return { slug: entry.slug };
  },
  head: ({ params }) => {
    const entry = getEntry(params.slug);
    if (!entry) return { meta: [{ title: "Release not found — Rankbox" }] };
    const url = entryUrl(entry.slug);
    const title = `${entry.title} — Rankbox changelog`;
    return {
      meta: [
        { title },
        { name: "description", content: entry.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: entry.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { property: "article:published_time", content: entry.date },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: entry.summary },
      ],
      links: [
        { rel: "canonical", href: url },
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
                "@type": "BlogPosting",
                "@id": `${url}#post`,
                headline: entry.title,
                description: entry.summary,
                datePublished: entry.date,
                dateModified: entry.date,
                url,
                mainEntityOfPage: url,
                inLanguage: "en",
                author: AUTHOR_ORG,
                publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
                isPartOf: { "@id": `${SITE}/changelog#blog` },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Changelog",
                    item: `${SITE}/changelog`,
                  },
                  { "@type": "ListItem", position: 3, name: entry.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: ReleasePage,
  notFoundComponent: ReleaseNotFound,
});

const GLOW = {
  backgroundImage:
    "radial-gradient(55% 100% at 50% 0%, color-mix(in oklab, var(--brand-blue) 9%, transparent), transparent 75%)",
};

function ReleasePage() {
  const { slug } = Route.useLoaderData();
  const entry = getEntry(slug)!;
  // Keyed so moving between releases starts each page fresh (copy state, reveals).
  return <ReleaseView key={entry.slug} entry={entry} />;
}

function ReleaseView({ entry }: { entry: ChangelogEntry }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-96"
          style={GLOW}
        />
        <header className="relative mx-auto max-w-3xl px-5 pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link to="/changelog" className="transition-colors hover:text-ink">
                  Changelog
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3 shrink-0" />
              </li>
              <li aria-current="page" className="min-w-0 truncate text-ink">
                {entry.title}
              </li>
            </ol>
          </nav>

          <Reveal className="mt-10 sm:mt-12">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={entry.date} className="font-semibold text-ink">
                {formatDate(entry.date)}
              </time>
              <span aria-hidden>·</span>
              <span>{weekday(entry.date)}</span>
            </p>
            <h1 className="mt-4 text-balance font-display text-[2.3rem] font-bold leading-[1.06] tracking-tight text-ink sm:text-[3.25rem]">
              {entry.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{entry.summary}</p>
            <EntryLabels entry={entry} className="mt-7" />
            <StatusNote entry={entry} className="mt-6" />
          </Reveal>
        </header>

        {entry.visual && (
          <Reveal y={22} delay={0.08} className="relative mx-auto mt-10 max-w-4xl px-5 sm:mt-12">
            <EntryVisual visual={entry.visual} />
          </Reveal>
        )}

        <div className="relative mx-auto max-w-3xl px-5 pb-6 pt-10 sm:pt-12">
          <EntryBody entry={entry} />
          <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            <EntryLinks entry={entry} />
            <CopyLink slug={entry.slug} className="-mr-2.5 ml-auto" />
          </div>
          <Neighbours slug={entry.slug} />
        </div>

        <BlogCta title="See what Rankbox would publish for your site" />
      </main>
      <Footer />
    </div>
  );
}

/** The releases either side, so the log can be read one page at a time. */
function Neighbours({ slug }: { slug: string }) {
  const { newer, older } = neighbours(slug);
  return (
    <nav aria-label="More releases" className="mt-14">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { entry: older, label: "Previous release", Icon: ArrowLeft, align: "left" as const },
          { entry: newer, label: "Next release", Icon: ArrowRight, align: "right" as const },
        ].map(({ entry, label, Icon, align }) =>
          entry ? (
            <Link
              key={label}
              to="/changelog/$slug"
              params={{ slug: entry.slug }}
              className={cn(
                "group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-1 transition-all hover:-translate-y-0.5 hover:border-cta/40 hover:shadow-2 motion-reduce:transition-none",
                align === "right" && "sm:items-end sm:text-right",
              )}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {align === "left" && <Icon className="h-3.5 w-3.5" />}
                {label} · {formatDate(entry.date)}
                {align === "right" && <Icon className="h-3.5 w-3.5" />}
              </span>
              <span className="mt-2 text-[0.95rem] font-semibold leading-snug text-ink transition-colors group-hover:text-cta">
                {entry.title}
              </span>
            </Link>
          ) : (
            <span key={label} aria-hidden className="hidden sm:block" />
          ),
        )}
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/changelog"
          hash={slug}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cta transition-colors hover:text-cta-hover"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
          All releases
        </Link>
      </div>
    </nav>
  );
}

function ReleaseNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-5 py-28 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Release not found</h1>
        <p className="text-muted-foreground">
          There&rsquo;s no release at this address. Every one we&rsquo;ve shipped is in the log.
        </p>
        <Link
          to="/changelog"
          className="rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
        >
          See the changelog
        </Link>
      </main>
      <Footer />
    </div>
  );
}
