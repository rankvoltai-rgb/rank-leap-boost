import { ArrowRight } from "lucide-react";
import { MORE } from "./content";
import { Heading } from "./Heading";
import { PageLink } from "./PageLink";

/**
 * Section 6: up to the white label hub, across to its other two deep dives,
 * and out to the AI search pages this one leans on. A plain list of rows.
 */
export function More() {
  return (
    <section
      id="more"
      aria-labelledby="more-title"
      className="scroll-mt-24 border-t border-border py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Heading id="more" intro={MORE.intro} />
        <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] border-t border-border md:grid-cols-2 md:gap-x-10">
          {MORE.items.map((item) => (
            <li key={item.label} className="border-b border-border">
              <PageLink
                target={item.target}
                className="group flex items-start justify-between gap-6 rounded-sm py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-ink transition-colors group-hover:text-cta">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-pretty text-sm leading-relaxed text-muted-foreground">
                    {item.blurb}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-cta motion-reduce:transition-none"
                />
              </PageLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
