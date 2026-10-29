import { FAQS } from "./content";
import { SectionShell } from "./SectionShell";

/**
 * 08. The questions, always open: each one an H3 with its answer under it,
 * so the page and its FAQPage JSON-LD say the same thing in plain view.
 */
export function Questions() {
  return (
    <SectionShell id="faq">
      <div className="grid max-w-3xl divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
        {FAQS.map((f) => (
          <div key={f.q} className="py-6">
            <h3 className="text-[1rem] font-semibold leading-snug tracking-tight text-ink">
              {f.q}
            </h3>
            <p className="mt-2 text-[0.94rem] leading-relaxed text-ink/75">{f.a}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
