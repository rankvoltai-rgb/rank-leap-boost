import { ShieldCheck } from "lucide-react";
import { Reveal, Stars } from "./shared";

const LOGOS = ["Plannora", "Loopcraft", "Yardstick", "Verdure", "Northlight", "Claystone", "Safeguard", "Briefly"];

export function Guarantee() {
  return (
    <section className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-background">
            <ShieldCheck className="h-8 w-8" />
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Try It With Zero Risk</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start growing with Rankvolt and cancel anytime — no hidden fees, no long-term
            contracts. Your access stays active until the end of your billing period.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {LOGOS.map((l) => (
              <div
                key={l}
                className="flex items-center justify-center rounded-xl border border-border bg-card py-5 text-sm font-bold uppercase tracking-widest text-muted-foreground"
              >
                {l}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <Stars />
              <span className="text-lg font-bold text-ink">4.8/5</span>
            </div>
            <p className="text-sm text-muted-foreground">
              60,000+ articles published for 400+ founders
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}