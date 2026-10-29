import { ArrowRight, Check } from "lucide-react";
import { SCOPE } from "./content";
import { SectionShell } from "./SectionShell";

/**
 * 07. The ledger: what comes off the line, and what stays with the agency.
 * Two plain columns meeting at one hairline; the line's side is marked in
 * blue, the team's side in ink.
 */
export function Scope() {
  return (
    <SectionShell id="scope" intro={SCOPE.intro}>
      <div className="grid overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] md:grid-cols-2">
        <div className="p-5 sm:p-7">
          <h3 className="text-[1rem] font-semibold tracking-tight text-ink">{SCOPE.writesTitle}</h3>
          <ul className="mt-4 grid gap-3">
            {SCOPE.writes.map((w) => (
              <li
                key={w}
                className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-ink/80"
              >
                <Check
                  aria-hidden
                  className="mt-[0.3rem] h-3.5 w-3.5 shrink-0 text-brand-blue"
                  strokeWidth={2.5}
                />
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-ink/[0.07] bg-surface/50 p-5 sm:p-7 md:border-l md:border-t-0">
          <h3 className="text-[1rem] font-semibold tracking-tight text-ink">{SCOPE.yoursTitle}</h3>
          <ul className="mt-4 grid gap-3">
            {SCOPE.yours.map((y) => (
              <li
                key={y}
                className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-ink/80"
              >
                <ArrowRight aria-hidden className="mt-[0.3rem] h-3.5 w-3.5 shrink-0 text-ink/40" />
                {y}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
