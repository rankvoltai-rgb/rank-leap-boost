import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PACKAGING } from "./content";
import { FOCUS, Lead, Section, SectionTitle, TEXT_LINK } from "./parts";

/**
 * Three ways to sell the same site, as rows of one sheet: how it's sold and
 * where its margin leaks. The cost is the same in every row, so it's said once
 * in the header rather than repeated down a column.
 */
export function Packaging() {
  return (
    <Section id="packaging">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <SectionTitle id="packaging" />
          <Lead>{PACKAGING.intro}</Lead>
        </div>
        <p className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-muted-foreground">
          {PACKAGING.columns.cost}
          <span aria-hidden className="mx-2 text-ink/20">
            |
          </span>
          <span className="font-semibold tabular-nums text-ink">{PACKAGING.cost}</span>
        </p>
      </div>

      <div className="mt-12 border-t border-ink/10">
        <div
          aria-hidden
          className="hidden grid-cols-[3rem_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] gap-8 border-b border-border py-3 text-xs font-medium text-muted-foreground md:grid"
        >
          <span />
          <span />
          <span>{PACKAGING.columns.how}</span>
          <span>{PACKAGING.columns.watch}</span>
        </div>
        <ol>
          {PACKAGING.packages.map((p, i) => (
            <li
              key={p.name}
              className="grid gap-3 border-b border-border py-7 md:grid-cols-[3rem_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-8"
            >
              <span aria-hidden className="text-sm tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[1.05rem] font-semibold leading-snug tracking-tight text-ink">
                {p.name}
              </h3>
              <div>
                <p className="text-xs font-medium text-muted-foreground md:sr-only">
                  {PACKAGING.columns.how}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink/80 md:mt-0">{p.how}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground md:sr-only">
                  {PACKAGING.columns.watch}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink/80 md:mt-0">{p.watch}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
            {PACKAGING.notCovered.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {PACKAGING.notCovered.intro}
          </p>
          <ul className="mt-5 space-y-3">
            {PACKAGING.notCovered.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                <Minus aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface/60 p-5">
            <p className="text-sm leading-relaxed text-ink/80">{PACKAGING.guarantee.text}</p>
            <Link
              to={PACKAGING.guarantee.link.href}
              className={cn("mt-3 inline-block text-sm", TEXT_LINK)}
            >
              {PACKAGING.guarantee.link.label}
            </Link>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{PACKAGING.across.lead}</p>
            <ul className="mt-3 space-y-2">
              {PACKAGING.across.links.map((l) => (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    className={cn(
                      "group inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-ink transition-colors hover:text-cta",
                      FOCUS,
                    )}
                  >
                    {l.label}
                    <ArrowUpRight
                      aria-hidden
                      className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-cta"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
