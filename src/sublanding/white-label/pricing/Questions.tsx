import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQS, QUESTIONS } from "./content";
import { FOCUS, Lead, Section, SectionTitle, TEXT_LINK } from "./parts";

/**
 * The FAQ, as native disclosures: every answer is in the server HTML (and in
 * the FAQPage JSON-LD from head.ts), opened without JavaScript.
 */
export function Questions() {
  return (
    <Section id="faq" className="border-t border-border/70">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionTitle id="faq" />
          <Lead>{QUESTIONS.intro}</Lead>
          <Link to={QUESTIONS.hubLink.href} className={cn("mt-4 inline-block text-sm", TEXT_LINK)}>
            {QUESTIONS.hubLink.label}
          </Link>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-start justify-between gap-6 rounded-md py-5 text-left [&::-webkit-details-marker]:hidden",
                  FOCUS,
                )}
              >
                <h3 className="text-[0.98rem] font-semibold leading-snug text-ink">{f.q}</h3>
                <Plus
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground motion-safe:transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="-mt-1 pb-6 pr-10 text-sm leading-relaxed text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
