import { ArrowUpRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./shared";
import { Accent, Band, LINE, SectionHead, Spacer } from "./frame";

const ARTICLES = [
  {
    title: "Kanban vs Scrum: Which Framework Fits Your Team?",
    body: "A practical breakdown of when each framework wins, how to switch without chaos, and the signals that tell you it's time to change.",
    domain: "plannora.io",
  },
  {
    title: "Heat Pump vs Furnace: The Real 2026 Cost Comparison",
    body: "Upfront price, running costs, and climate factors that decide which system actually saves you money over ten years.",
    domain: "summithvac.co",
  },
  {
    title: "How AI Answer Engines Decide Who to Cite",
    body: "What ChatGPT and Perplexity actually look for when sourcing answers — structure, clarity, and authority signals you can build.",
    domain: "loopcraft.ai",
  },
  {
    title: "Remote Standups That Don't Waste Everyone's Time",
    body: "Async formats, time-boxing, and the templates lean teams use to keep daily standups under ten minutes.",
    domain: "yardstick.team",
  },
  {
    title: "Plastic-Free Kitchen Swaps That Actually Last",
    body: "Durable, genuinely useful alternatives — what's worth buying, what to skip, and how to tell quality from greenwashing.",
    domain: "verduregoods.com",
  },
  {
    title: "Facility Compliance Checklists Every Ops Lead Needs",
    body: "The recurring safety and compliance tasks that keep buildings audit-ready — organized into checklists you can actually run.",
    domain: "safeguardfm.com",
  },
];

/* An index of the sample articles, one hairline row each, like a published
   feed: number, the site it ran on, the headline and standfirst, its format. */
export function ExampleArticles() {
  return (
    <section id="examples" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={FileText}
        eyebrow="Sample output"
        title={
          <>
            AI articles <Accent>that get cited</Accent>
          </>
        }
        subtitle="Nobody will guess these were written by AI. Packed with images, internal links, real data, and the structure both Google and AI answer engines reward."
      />
      <Band>
        <ol className={cn("divide-y", "divide-ink/[0.07]")}>
          {ARTICLES.map((a, i) => (
            <li key={a.title}>
              <Reveal delay={(i % 3) * 0.04}>
                <article className="group grid gap-3 px-6 py-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] sm:px-8 md:grid-cols-[3rem_13rem_1fr_auto] md:items-center md:gap-6 lg:px-10">
                  <span className="hidden font-mono text-xs text-muted-foreground/70 tabular-nums md:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-2.5 text-[0.8rem] font-medium text-muted-foreground">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-[0.7rem] font-semibold uppercase text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                      {a.domain[0]}
                    </span>
                    {a.domain}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[1.02rem] font-semibold leading-snug tracking-tight text-ink">
                      {a.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {a.body}
                    </p>
                  </div>
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex w-fit items-center rounded-md border bg-white px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap text-muted-foreground",
                        LINE,
                      )}
                    >
                      Article · 5 min read
                    </span>
                    <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue md:block" />
                  </span>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}
