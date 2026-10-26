/**
 * The sources behind the hub's own claims, split into the vendors' own word
 * and independent studies and reporting. Plain external links, numbered, so
 * a reader can check any figure on the page. The matrix cells are sourced in
 * each guide, not here.
 */
import { ArrowUpRight, Library } from "lucide-react";
import { Accent, Band, LINE } from "@/components/landing/frame";
import { OVERVIEW, type HubSource } from "@/data/ai-seo/overview";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { HubHead } from "./shared";

const GROUPS: { kind: HubSource["kind"]; title: string }[] = [
  { kind: "vendor", title: "Vendor documentation and announcements" },
  { kind: "study", title: "Studies, data and reporting" },
];

export function HubSources() {
  let n = 0;
  return (
    <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
      <HubHead
        id="sources-title"
        icon={Library}
        eyebrow="Sources"
        title={
          <>
            Where these facts <Accent>come from</Accent>
          </>
        }
        subtitle={
          <>
            Checked on <time dateTime={OVERVIEW.updated}>{formatDate(OVERVIEW.updated)}</time>. The
            matrix cells are sourced in each engine&rsquo;s guide.
          </>
        }
      />
      <Band>
        <div className="grid lg:grid-cols-2">
          {GROUPS.map((g, gi) => (
            <div
              key={g.kind}
              className={cn(
                "px-6 py-8 sm:px-10 lg:px-12 lg:py-10",
                gi === 0 && "border-b lg:border-b-0 lg:border-r",
                LINE,
              )}
            >
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cta">
                {g.title}
              </h3>
              <ol className="mt-4">
                {OVERVIEW.sources
                  .filter((s) => s.kind === g.kind)
                  .map((s) => {
                    n += 1;
                    return (
                      <li key={s.href} className={cn("border-t first:border-t-0", LINE)}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-x-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
                        >
                          <span className="font-mono text-[0.72rem] text-muted-foreground">
                            {String(n).padStart(2, "0")}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.88rem] font-medium leading-snug text-ink transition-colors group-hover:text-cta">
                              {s.title}
                            </span>
                            <span className="mt-0.5 block text-[0.76rem] text-muted-foreground">
                              {s.publisher}
                            </span>
                          </span>
                          <ArrowUpRight
                            aria-hidden
                            className="h-3.5 w-3.5 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cta motion-reduce:transition-none"
                          />
                        </a>
                      </li>
                    );
                  })}
              </ol>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}
