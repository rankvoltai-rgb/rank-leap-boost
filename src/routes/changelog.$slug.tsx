import type { ReactNode } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronRight, Rss } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Band, CELL, CellGrid, LINE, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import {
  ChangelogClosing,
  CopyLink,
  EntryLinks,
  EntryPoints,
  EntryProse,
  KindLabel,
  SITE,
  StatusBadge,
  StatusNote,
  entryUrl,
  weekday,
} from "@/components/changelog/kit";
import { EntryVisual } from "@/components/changelog/visuals";
import {
  CHANGELOG_FEED_PATH,
  STATUSES,
  getEntry,
  neighbours,
  type ChangelogEntry,
} from "@/data/changelog";
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

function ReleasePage() {
  const { slug } = Route.useLoaderData();
  const entry = getEntry(slug)!;
  // Keyed so moving between releases starts each page fresh (copy state, reveals).
  return <ReleaseView key={entry.slug} entry={entry} />;
}

function ReleaseView({ entry }: { entry: ChangelogEntry }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <header id="top" className="relative scroll-mt-16 bg-white">
          <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
            <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0 px-5 pb-12 pt-7 sm:px-8 lg:py-14 lg:pl-12 lg:pr-10">
                <nav aria-label="Breadcrumb">
                  <ol className="flex min-w-0 items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                    <li>
                      <Link to="/" className="py-2 transition-colors hover:text-ink">
                        Home
                      </Link>
                    </li>
                    <li aria-hidden>
                      <ChevronRight className="h-3 w-3" />
                    </li>
                    <li>
                      <Link to="/changelog" className="py-2 transition-colors hover:text-ink">
                        Changelog
                      </Link>
                    </li>
                    <li aria-hidden>
                      <ChevronRight className="h-3 w-3 shrink-0" />
                    </li>
                    <li aria-current="page" className="min-w-0 truncate font-medium text-ink">
                      {entry.title}
                    </li>
                  </ol>
                </nav>

                <Reveal className="mt-9 lg:mt-12">
                  <p className="flex items-center gap-2 text-[0.85rem] text-muted-foreground">
                    <time dateTime={entry.date} className="font-semibold text-ink">
                      {formatDate(entry.date)}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{weekday(entry.date)}</span>
                  </p>
                  <h1 className="mt-4 text-balance font-display text-[2.3rem] font-medium leading-[1.07] tracking-[-0.035em] text-ink sm:text-[3.1rem]">
                    {entry.title}
                  </h1>
                  <p className="mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-muted-foreground">
                    {entry.summary}
                  </p>
                  <StatusNote entry={entry} className="mt-6 max-w-2xl" />
                </Reveal>
              </div>

              <ReleaseSheet entry={entry} />
            </div>
          </div>
        </header>

        {entry.visual && (
          <Band inner="px-3 py-3 sm:px-3">
            <Reveal y={22}>
              <EntryVisual visual={entry.visual} />
            </Reveal>
          </Band>
        )}

        <Band>
          <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-14">
            <EntryProse entry={entry} />
            <EntryPoints entry={entry} className="mt-9" />
            <EntryLinks entry={entry} className="mt-8" />
          </div>
        </Band>

        <Spacer />
        <Neighbours slug={entry.slug} />
        <ChangelogClosing />
      </main>
      <Footer />
    </div>
  );
}

/** The release's facts, as hairline rows beside the title. */
function ReleaseSheet({ entry }: { entry: ChangelogEntry }) {
  const rows: { label: string; value: ReactNode }[] = [
    {
      label: "Shipped",
      value: <time dateTime={entry.date}>{formatDate(entry.date)}</time>,
    },
    { label: "Type", value: <KindLabel kind={entry.kind} /> },
    {
      label: "Status",
      value: (
        <span className="flex flex-col items-start gap-1.5">
          <StatusBadge status={entry.status} />
          <span className="text-[0.78rem] leading-snug text-muted-foreground">
            {STATUSES[entry.status].meaning}
          </span>
        </span>
      ),
    },
    { label: "For", value: entry.audience ?? "Everyone" },
  ];
  return (
    <aside
      aria-label="About this release"
      className={cn(
        "border-t bg-[color-mix(in_oklab,var(--surface)_70%,white)] lg:border-l lg:border-t-0",
        LINE,
      )}
    >
      <dl className="divide-y divide-ink/[0.07]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-4 px-5 py-4 sm:px-8 lg:px-7">
            <dt className="w-16 shrink-0 pt-0.5 text-[0.78rem] text-muted-foreground">{r.label}</dt>
            <dd className="min-w-0 text-[0.88rem] font-medium text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div
        className={cn("flex flex-wrap items-center gap-2 border-t px-5 py-4 sm:px-8 lg:px-7", LINE)}
      >
        <CopyLink slug={entry.slug} />
        <a
          href={CHANGELOG_FEED_PATH}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink"
        >
          <Rss className="h-3.5 w-3.5" />
          RSS
        </a>
      </div>
    </aside>
  );
}

/** The releases either side, so the log can be read one page at a time. */
function Neighbours({ slug }: { slug: string }) {
  const { newer, older } = neighbours(slug);
  const cells = [
    { entry: older, label: "Previous release", Icon: ArrowLeft, align: "left" as const },
    { entry: newer, label: "Next release", Icon: ArrowRight, align: "right" as const },
  ];
  return (
    <nav aria-label="More releases">
      <Band>
        <CellGrid className="sm:grid-cols-2">
          {cells.map(({ entry, label, Icon, align }) => (
            <li key={label} className={cn(CELL, "min-w-0")}>
              {entry ? (
                <Link
                  to="/changelog/$slug"
                  params={{ slug: entry.slug }}
                  className={cn(
                    "group flex h-full flex-col px-5 py-7 transition-colors hover:bg-ink/[0.02] sm:px-8 lg:px-12",
                    align === "right" && "sm:items-end sm:text-right",
                  )}
                >
                  <span className="flex items-center gap-1.5 text-[0.78rem] font-medium text-muted-foreground">
                    {align === "left" && <Icon className="h-3.5 w-3.5" />}
                    {label} · {formatDate(entry.date)}
                    {align === "right" && <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className="mt-2 text-[1rem] font-semibold leading-snug text-ink transition-colors group-hover:text-cta">
                    {entry.title}
                  </span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex h-full flex-col px-5 py-7 text-[0.85rem] text-muted-foreground sm:px-8 lg:px-12",
                    align === "right" && "sm:items-end sm:text-right",
                  )}
                >
                  {align === "right"
                    ? "This is the latest release."
                    : "This is where the log starts."}
                </span>
              )}
            </li>
          ))}
        </CellGrid>
      </Band>
      <Band inner="flex justify-center px-5 py-6">
        <Link
          to="/changelog"
          hash={slug}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cta transition-colors hover:text-cta-hover"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
          All releases
        </Link>
      </Band>
    </nav>
  );
}

function ReleaseNotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <Band inner="flex flex-col items-center gap-4 px-5 py-28 text-center">
          <h1 className="font-display text-3xl font-medium tracking-[-0.02em] text-ink">
            Release not found
          </h1>
          <p className="max-w-md text-muted-foreground">
            There&rsquo;s no release at this address. Every one we&rsquo;ve shipped is in the log.
          </p>
          <Link
            to="/changelog"
            className="inline-flex h-11 items-center rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
          >
            See the changelog
          </Link>
        </Band>
        <Spacer closing />
      </main>
      <Footer />
    </div>
  );
}
