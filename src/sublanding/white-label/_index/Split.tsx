import { EyeOff, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPLIT } from "./content";
import { SectionHead } from "./SectionHead";
import { CARD, LIFT, SECTION, WRAP } from "./ui";

/**
 * The ledger: seven stages of client work, your side and Rankbox's, with a
 * dashed seam between them that the client never sees past. On a phone each
 * stage stacks, your line above Rankbox's, and the seam runs between them.
 */
export function Split() {
  return (
    <section id="split" aria-labelledby="split-title" className={cn(SECTION, "bg-surface")}>
      <div className={WRAP}>
        <SectionHead id="split" kicker={SPLIT.kicker} intro={SPLIT.intro} />

        <div className={cn(CARD, LIFT, "relative mt-12 overflow-hidden")}>
          {/* Column heads. */}
          <div className="grid border-b border-border md:grid-cols-[9.5rem_minmax(0,1fr)_minmax(0,1fr)]">
            <span aria-hidden className="hidden md:block" />
            <p className="flex items-center gap-2 px-5 py-4 text-[0.86rem] font-semibold text-ink sm:px-6">
              <Handshake aria-hidden className="h-4 w-4 text-cta" />
              {SPLIT.yoursLabel}
            </p>
            <p className="hidden items-center gap-2 border-l border-dashed border-border px-6 py-4 text-[0.86rem] font-semibold text-muted-foreground md:flex">
              <EyeOff aria-hidden className="h-4 w-4" />
              {SPLIT.oursLabel}
            </p>
          </div>

          <dl>
            {SPLIT.rows.map((r) => (
              <div
                key={r.stage}
                className="grid border-b border-border last:border-b-0 md:grid-cols-[9.5rem_minmax(0,1fr)_minmax(0,1fr)]"
              >
                <dt className="px-5 pb-1 pt-5 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:px-6 md:pb-5">
                  {r.stage}
                </dt>
                <dd className="px-5 pb-4 text-[0.95rem] leading-relaxed text-ink sm:px-6 md:py-5">
                  {r.yours}
                </dd>
                <dd className="mx-5 border-t border-dashed border-border pb-5 pt-4 text-[0.95rem] leading-relaxed text-muted-foreground sm:mx-6 md:mx-0 md:border-l md:border-t-0 md:px-6 md:py-5">
                  <span className="mb-1 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] md:hidden">
                    <EyeOff aria-hidden className="h-3 w-3" />
                    {SPLIT.oursLabel}
                  </span>
                  {r.ours}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-4 text-[0.82rem] text-muted-foreground">{SPLIT.seam}</p>
      </div>
    </section>
  );
}
