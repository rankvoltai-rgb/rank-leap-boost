import { ArrowUpRight } from "lucide-react";
import type { LinkItem } from "./content";
import { PageLink } from "./PageLink";

/** The quiet row of further reading under a section's visual. */
export function MoreLinks({ links }: { links: readonly LinkItem[] }) {
  return (
    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
      {links.map((l) => (
        <li key={l.label}>
          <PageLink
            target={l.target}
            className="group inline-flex items-center gap-1 rounded text-[0.875rem] font-medium text-ink/80 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-brand-blue hover:decoration-brand-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            {l.label}
            <ArrowUpRight
              aria-hidden
              className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-brand-blue"
            />
          </PageLink>
        </li>
      ))}
    </ul>
  );
}
