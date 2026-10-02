import { Plus } from "lucide-react";
import { Appear } from "./Appear";
import { FAQS, FAQ_SECTION, h2 } from "./content";

/**
 * The FAQ as native <details>, so every answer is in the server HTML (the
 * same text feeds the FAQPage JSON-LD) and works without JavaScript. The
 * heading sits beside the questions on wide screens.
 */
export function Questions() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-10 px-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Appear>
          <h2
            id="faq-title"
            className="text-balance font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
          >
            {h2("faq")}
          </h2>
          <p className="mt-4 max-w-sm text-pretty leading-relaxed text-muted-foreground">
            {FAQ_SECTION.aside}
          </p>
        </Appear>

        <Appear delay={0.05}>
          <div className="divide-y divide-border border-y border-border">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-md py-5 text-left font-semibold leading-snug text-ink transition-colors hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[1rem]">{f.q}</h3>
                  <Plus
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                  />
                </summary>
                <p className="-mt-1 pb-6 pr-10 text-pretty leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Appear>
      </div>
    </section>
  );
}
