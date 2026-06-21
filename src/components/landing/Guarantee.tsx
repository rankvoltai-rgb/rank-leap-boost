import { ShieldCheck } from "lucide-react";
import { Reveal, Stars } from "./shared";

const LOGOS = ["Plannora", "Loopcraft", "Yardstick", "Verdure", "Northlight", "Claystone", "Safeguard", "Briefly"];

export function Guarantee() {
  return (
    <section className="border-t border-border bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-elevation sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-volt/30 bg-volt/10 text-ink">
                <ShieldCheck className="h-7 w-7" />
              </span>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Try it with zero risk
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start growing with Rankvolt and cancel anytime — no hidden fees, no long-term
                contracts. Your access stays active until the end of your billing period.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {LOGOS.map((l) => (
                <div
                  key={l}
                  className="flex items-center justify-center rounded-xl border border-border bg-surface/60 py-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {l}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-border pt-8 text-center">
              <div className="flex items-center gap-2">
                <Stars />
                <span className="text-lg font-semibold text-ink">4.8/5</span>
              </div>
              <p className="text-sm text-muted-foreground">
                60,000+ articles published for 400+ founders
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}