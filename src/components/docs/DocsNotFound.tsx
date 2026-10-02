import { Link } from "@tanstack/react-router";
import { useOpenDocsSearch } from "./search-context";

/** A missing section or page, shown inside the docs chrome so search is one click away. */
export function DocsNotFound() {
  const openSearch = useOpenDocsSearch();
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-sm font-semibold text-cta">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
        There's no docs page at this address
      </h1>
      <p className="mt-3 text-muted-foreground">
        It may have moved when a section was reorganised. Search for what you were after, or start
        from the docs home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={openSearch}
          className="inline-flex h-10 items-center rounded-lg bg-cta px-4 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
        >
          Search the docs
        </button>
        <Link
          to="/docs"
          className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm font-semibold text-ink transition-colors hover:bg-secondary"
        >
          Docs home
        </Link>
      </div>
    </main>
  );
}
