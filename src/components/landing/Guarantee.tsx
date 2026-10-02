import { ShieldCheck } from "lucide-react";
import { Reveal, Stars } from "./shared";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";

export function Guarantee() {
  return (
    <section className="border-t border-border bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card px-6 py-12 shadow-elevation sm:px-12 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cta-soft text-cta ring-1 ring-cta/15">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Try it with zero risk
              </h2>
              <p className="mt-4 text-balance text-lg text-muted-foreground">
                Cancel anytime, with no hidden fees and no long-term contract. Your access stays
                active until the end of your billing period.
              </p>
            </div>

            {/* Real customers only: BRANDS is the same list the hero and the
                logo band read from. */}
            <ul
              aria-label="Brands growing with Rankbox"
              className="mx-auto mt-12 grid max-w-3xl divide-x divide-border overflow-hidden rounded-2xl border border-border bg-surface/50"
              style={{ gridTemplateColumns: `repeat(${BRANDS.length}, minmax(0, 1fr))` }}
            >
              {BRANDS.map((brand) => (
                <li key={brand.name} className="flex items-center justify-center py-6 sm:py-8">
                  <BrandTile brand={brand} className="h-10 w-10 sm:h-12 sm:w-12" />
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <Stars />
                <span className="text-lg font-semibold text-ink">4.8/5</span>
              </div>
              <p className="text-balance text-sm text-muted-foreground">
                60,000+ articles published for 400+ founders
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
