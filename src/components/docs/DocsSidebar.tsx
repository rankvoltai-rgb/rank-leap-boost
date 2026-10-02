import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocsNavSection } from "@/lib/docs/content.server";
import { DocsIcon } from "./DocsIcon";

/**
 * The docs tree. Every section is listed; the one you're in starts open, and
 * any other opens with a click on its chevron. The section name itself links
 * to the section's overview page.
 */
export function DocsSidebar({
  sections,
  pathname,
  onNavigate,
}: {
  sections: DocsNavSection[];
  pathname: string;
  /** Called after a link is followed (the mobile sheet closes on it). */
  onNavigate?: () => void;
}) {
  const current = sections.find((s) => pathname === s.path || pathname.startsWith(`${s.path}/`));
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const isOpen = (slug: string) => open[slug] ?? slug === current?.slug;

  return (
    <nav aria-label="Documentation" className="text-[0.9rem]">
      <ul className="space-y-1">
        {sections.map((section) => {
          const expanded = isOpen(section.slug);
          const here = section.slug === current?.slug;
          return (
            <li key={section.slug}>
              <div className="flex items-center gap-1">
                <Link
                  to={section.path}
                  onClick={onNavigate}
                  aria-current={pathname === section.path ? "page" : undefined}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5 font-semibold transition-colors",
                    here ? "text-ink" : "text-ink/80 hover:bg-secondary hover:text-ink",
                    pathname === section.path && "bg-cta-soft text-cta",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                      here
                        ? "border-cta/30 bg-cta-soft text-cta"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    <DocsIcon name={section.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate">{section.title}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [section.slug]: !expanded }))}
                  aria-expanded={expanded}
                  aria-controls={`docs-nav-${section.slug}`}
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${section.title}`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      expanded && "rotate-90",
                    )}
                  />
                </button>
              </div>
              <ul
                id={`docs-nav-${section.slug}`}
                hidden={!expanded}
                className="mb-2 ml-[1.15rem] mt-1 border-l border-border"
              >
                {section.pages.map((page) => {
                  const active = pathname === page.path;
                  return (
                    <li key={page.slug}>
                      <Link
                        to={page.path}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "-ml-px block border-l-2 py-1.5 pl-3.5 pr-2 leading-snug transition-colors",
                          active
                            ? "border-cta font-semibold text-cta"
                            : "border-transparent text-muted-foreground hover:border-ink/25 hover:text-ink",
                        )}
                      >
                        {page.navTitle}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
