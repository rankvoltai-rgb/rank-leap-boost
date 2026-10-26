/**
 * The questions, the method and the sources. The FAQ follows the landing's
 * shape (title and method on the left, questions down the right), with every
 * answer force-mounted so it's in the server HTML the FAQPage schema quotes.
 * The sources close the section as a numbered hairline list, every link real.
 */
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowUpRight, BookOpen, HelpCircle, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Accent, Band, CELL, CellGrid, LINE, Pill, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Rich } from "./parts";

const hostOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
};

export function Faq({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <>
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
        <Spacer />
        <Band>
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <Reveal
              className={cn(
                "flex flex-col border-b px-5 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
                LINE,
              )}
            >
              <Pill icon={HelpCircle} className="w-fit">
                FAQ
              </Pill>
              <h2
                id="faq-title"
                className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
              >
                {matchupTitle(matchup)}, <Accent>answered</Accent>
              </h2>
              <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
                The questions people ask about this pair, each answered in its first sentence.
              </p>

              <aside
                aria-label="How this comparison was made"
                className={cn("mt-8 border-t pt-6 text-[0.84rem] leading-relaxed", LINE)}
              >
                <p className="font-medium text-ink">How we compared</p>
                <p className="mt-2 text-muted-foreground">
                  From {sides.a.name}&rsquo;s and {sides.b.name}&rsquo;s own pricing pages,
                  documentation and changelogs, plus dated third-party reporting, last read on{" "}
                  {formatDate(entry.pricing.checkedOn)}. We haven&rsquo;t benchmarked either product
                  ourselves, so where a round turns on judgment the verdict says so, and every
                  factual claim traces to a{" "}
                  <a
                    href="#sources"
                    className="text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink/60"
                  >
                    source below
                  </a>
                  . Rankbox makes a product in this space; it appears once, as the third option, and
                  nowhere in the scoring.
                </p>
              </aside>
            </Reveal>

            <Reveal delay={0.06} className="px-5 py-4 sm:px-10 lg:px-12 lg:py-8">
              <Accordion
                type="single"
                collapsible
                defaultValue="item-0"
                className="divide-y divide-ink/[0.07]"
              >
                {entry.faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                    <AccordionPrimitive.Header className="flex">
                      <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                        {f.q}
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionContent
                      forceMount
                      className="max-w-2xl pb-5 pr-10 text-[0.9rem] leading-relaxed text-muted-foreground"
                    >
                      <Rich text={f.a} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </Band>
      </section>

      <section id="sources" aria-labelledby="sources-title" className="scroll-mt-16">
        <Band inner="flex flex-wrap items-end justify-between gap-3 px-5 py-8 sm:px-10 lg:px-12">
          <div>
            <Pill icon={BookOpen}>Sources</Pill>
            <h2
              id="sources-title"
              className="mt-4 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.75rem]"
            >
              {entry.sources.length} sources, <Accent>all linked</Accent>
            </h2>
          </div>
          <p className="text-[0.8rem] text-muted-foreground">
            Pricing pages read on{" "}
            <time dateTime={entry.pricing.checkedOn} className="text-ink">
              {formatDate(entry.pricing.checkedOn)}
            </time>
          </p>
        </Band>
        <Band>
          <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
            {entry.sources.map((s, i) => (
              <li key={s.href} className={CELL}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full gap-3 px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-6"
                >
                  <span className="w-5 shrink-0 pt-px text-[0.7rem] font-medium tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.72rem] text-muted-foreground">
                      {s.publisher} · {hostOf(s.href)}
                    </span>
                    <span className="mt-0.5 block text-[0.86rem] font-medium leading-snug text-ink group-hover:text-cta">
                      {s.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cta"
                  />
                </a>
              </li>
            ))}
          </CellGrid>
        </Band>
      </section>
    </>
  );
}
