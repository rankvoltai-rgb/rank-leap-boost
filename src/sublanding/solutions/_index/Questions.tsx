import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FAQS, h2 } from "./content";

/**
 * Every answer open on the page: six short ones read faster than six
 * accordions, and the text is what answer engines quote. The same questions
 * feed the FAQPage JSON-LD in head.ts.
 */
export function Questions() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-14">
        <div>
          <h2
            id="faq-title"
            className="text-balance font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem] lg:sticky lg:top-24"
          >
            {h2("faq")}
          </h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <div key={f.q} className="py-6">
              <h3 className="text-[1.02rem] font-semibold leading-snug tracking-tight text-ink">
                {f.q}
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{f.a}</p>
              {f.link && (
                <Link
                  to={f.link.to}
                  className="mt-3 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-cta hover:text-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
                >
                  {f.link.label}
                  <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
