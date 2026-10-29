import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQS, FAQ_SECTION } from "./content";
import { SectionHead } from "./SectionHead";
import { SECTION, WRAP } from "./ui";

/**
 * The FAQ as native <details>: every answer is in the server HTML (matching
 * the FAQPage JSON-LD), opens without JavaScript, and works with the keyboard.
 */
export function Questions() {
  return (
    <section id="faq" aria-labelledby="faq-title" className={cn(SECTION, "bg-surface")}>
      <div
        className={cn(WRAP, "grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16")}
      >
        <SectionHead id="faq" kicker={FAQ_SECTION.kicker} intro={FAQ_SECTION.intro} />
        <div className="divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/45 [&::-webkit-details-marker]:hidden">
                <h3 className="font-medium">{f.q}</h3>
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-card transition-[transform,background-color,color,border-color] duration-200 group-open:rotate-45 group-open:border-cta group-open:bg-cta group-open:text-white motion-reduce:transition-none"
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </summary>
              <p className="max-w-2xl pb-5 pr-10 text-[0.92rem] leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
