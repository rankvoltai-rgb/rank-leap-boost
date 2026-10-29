import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLOSING } from "./content";
import { FOCUS, Section, SectionTitle, StudioCta, TEXT_LINK } from "./parts";

/** The close: one action, the trial terms, and the rest of the program one click away. */
export function Closing() {
  return (
    <Section
      id="start"
      className="border-t border-border/70 bg-gradient-to-b from-background to-surface/80"
    >
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle id="start" className="mx-auto" />
        <p className="mx-auto mt-4 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground">
          {CLOSING.body}
        </p>
        <StudioCta label={CLOSING.cta} className="mt-8" />
        <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-muted-foreground">
          {CLOSING.note}
        </p>
      </div>

      <nav aria-labelledby="related-title" className="mx-auto mt-16 max-w-4xl">
        <p id="related-title" className="text-center text-xs font-medium text-muted-foreground">
          {CLOSING.relatedTitle}
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {CLOSING.related.map((r) => (
            <li key={r.href}>
              <Link
                to={r.href}
                className={cn(
                  "group flex h-full flex-col rounded-xl border border-border bg-white p-5 transition-colors hover:border-cta/40",
                  FOCUS,
                )}
              >
                <span className="flex items-center justify-between gap-3 text-sm font-semibold text-ink">
                  {r.label}
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-cta"
                  />
                </span>
                <span className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {r.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {CLOSING.single.lead}{" "}
          <Link to={CLOSING.single.href} className={TEXT_LINK}>
            {CLOSING.single.label}
          </Link>
        </p>
      </nav>
    </Section>
  );
}
