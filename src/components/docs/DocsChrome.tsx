import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { Logo } from "@/components/landing/shared";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { DocsNavSection } from "@/lib/docs/content.server";
import { cn } from "@/lib/utils";
import { DocsSearch, SearchTrigger } from "./DocsSearch";
import { DocsSidebar } from "./DocsSidebar";
import { SearchContext } from "./search-context";

const HEADER_LINKS: { label: string; to: string; match: string }[] = [
  { label: "Guides", to: "/docs/get-started/quickstart", match: "/docs/get-started" },
  { label: "API", to: "/docs/api/overview", match: "/docs/api" },
  { label: "Agents", to: "/docs/agents/overview", match: "/docs/agents" },
  { label: "Changelog", to: "/changelog", match: "/changelog" },
];

export function DocsChrome({
  sections,
  pathname,
  children,
}: {
  sections: DocsNavSection[];
  pathname: string;
  children: ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openSearch = () => setSearchOpen(true);

  return (
    <SearchContext.Provider value={openSearch}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open the docs menu"
            className="-ml-1.5 flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" aria-label="Rankbox home" className="shrink-0">
            <Logo />
          </Link>
          <span aria-hidden className="h-5 w-px bg-border" />
          <Link
            to="/docs"
            className="text-[0.95rem] font-semibold text-ink transition-colors hover:text-cta"
          >
            Docs
          </Link>

          <nav aria-label="Docs sections" className="ml-4 hidden items-center gap-1 md:flex">
            {HEADER_LINKS.map((l) => {
              const on = pathname === l.match || pathname.startsWith(`${l.match}/`);
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                    on ? "text-cta" : "text-muted-foreground hover:text-ink",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <SearchTrigger onOpen={openSearch} className="hidden w-56 sm:flex lg:w-64" />
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search the docs"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-secondary sm:hidden"
            >
              <Search className="h-[1.1rem] w-[1.1rem]" />
            </button>
            <Link
              to="/dashboard"
              className="hidden h-9 items-center rounded-lg bg-cta px-3.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 sm:inline-flex"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </header>

      {children}

      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[19rem] overflow-y-auto p-0">
          <div className="border-b border-border px-5 py-4">
            <SheetTitle className="text-base">Rankbox Docs</SheetTitle>
            <SheetDescription className="sr-only">
              Every section and page of the docs.
            </SheetDescription>
          </div>
          <div className="space-y-4 px-3 py-4">
            <SearchTrigger
              onOpen={() => {
                setMenuOpen(false);
                openSearch();
              }}
              className="w-full"
            />
            <DocsSidebar
              sections={sections}
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </SearchContext.Provider>
  );
}
