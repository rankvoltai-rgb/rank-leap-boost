import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CLOSE } from "./content";
import { PageLink } from "./PageLink";
import { SectionShell } from "./SectionShell";
import { StartButton } from "./StartButton";

/**
 * 09. The close: one paragraph, the trial terms from facts.ts, how Studio
 * opens, and the page's one blue action. Then the three other white label
 * pages, so the visitor can step up to the program or across to its other
 * two deep dives.
 */
export function Close() {
  return (
    <SectionShell id="next">
      <div className="max-w-2xl">
        <p className="text-[1.05rem] leading-relaxed text-ink/80">{CLOSE.body}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <StartButton label={CLOSE.cta} />
          <Link
            to="/pricing"
            className="rounded text-[0.9rem] font-medium text-ink/80 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            {CLOSE.pricing}
          </Link>
        </div>
        <p className="mt-5 text-[0.8rem] leading-relaxed text-muted-foreground">{CLOSE.terms}</p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">{CLOSE.studio}</p>
      </div>

      <h3 className="mt-14 text-[0.82rem] font-medium text-muted-foreground">{CLOSE.deepTitle}</h3>
      <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-ink/[0.08] bg-ink/[0.07] md:grid-cols-3">
        {CLOSE.deep.map((d) => (
          <li key={d.title} className="bg-white">
            <PageLink
              target={d.target}
              className="group flex h-full flex-col p-5 transition-colors hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-6"
            >
              <span className="flex items-center justify-between gap-3 text-[0.95rem] font-semibold tracking-tight text-ink">
                {d.title}
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue motion-reduce:transition-none"
                />
              </span>
              <span className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                {d.body}
              </span>
            </PageLink>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
