import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./shared";

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

export function ExampleArticles() {
  return (
    <section id="examples" className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="AI Articles That Get Cited"
          subtitle="Nobody will guess these were written by AI. Packed with images, internal links, real data, and the structure that both Google and AI answer engines reward. Scan a few and see for yourself."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 0.06}>
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug text-ink">{a.title}</h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                <p className="mt-4 text-xs font-medium text-muted-foreground">{a.domain}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}