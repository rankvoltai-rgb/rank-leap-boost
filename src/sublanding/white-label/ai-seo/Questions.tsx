import { FAQS, FAQ_SECTION } from "./content";
import { Heading } from "./Heading";

/**
 * Section 7: the FAQ, every answer open. The same text feeds the FAQPage
 * JSON-LD, so nothing is hidden behind a toggle: two columns on wide screens,
 * one on a phone.
 */
export function Questions() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-24 border-t border-border bg-surface/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Heading id="faq" intro={FAQ_SECTION.intro} />
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-10 md:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="border-t border-border pt-5">
              <h3 className="text-pretty text-[1.02rem] font-semibold leading-snug text-ink">
                {f.q}
              </h3>
              <p className="mt-2.5 text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
