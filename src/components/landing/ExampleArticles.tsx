import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./shared";

const ARTICLES = [
  {
    title: "What Does a Mortgage Banker Do? A Seattle Expert Guide",
    body: "How mortgage bankers differ from brokers, when each makes sense, and how Seattle tech-professional income affects approval.",
    domain: "themortgagereel.com",
  },
  {
    title: "Flood Damage Cleanup Services: What to Do in 24 Hours",
    body: "The first 24 hours determine whether you face a manageable cleanup or months of mold remediation. Step-by-step actions before pros arrive.",
    domain: "clarketon.com",
  },
  {
    title: "How CBD Works for Pain Relief: The Science Explained",
    body: "Discover how CBD works for pain relief through the endocannabinoid system, inflammation reduction, and nerve signaling — evidence-based.",
    domain: "reclaimlabs.com",
  },
  {
    title: "PS5 Controller Fix Near Me: Expert Repair Solutions",
    body: "Stick drift, button failures, charging issues — typical repair costs in 2026, what to expect, and when replacement wins.",
    domain: "videogame911.com",
  },
  {
    title: "Beard Dandruff Shampoo: How to Pick One That Works",
    body: "Active ingredients that fight Malassezia yeast, the right wash routine, and complementary habits to keep flakes from coming back.",
    domain: "onesociety.co.uk",
  },
  {
    title: "Commercial Roofing Systems: A Complete 2026 Guide",
    body: "Explore commercial roofing systems, materials, installation, and maintenance. Learn how to choose the right system for your building.",
    domain: "texcoreconstruction.com",
  },
];

export function ExampleArticles() {
  return (
    <section id="examples" className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="AI Articles That Get Traffic"
          subtitle="Nobody will ever tell these were written by AI. Packed with images, internal links, real data, and the depth Google rewards. Scan a few and see for yourself."
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