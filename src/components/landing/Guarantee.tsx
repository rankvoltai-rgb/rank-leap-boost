import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, Stars } from "./shared";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";
import { Accent, Band, LINE_FILL, SectionHead, Spacer } from "./frame";

/* The section's original shape (shield, promise, the real customers' logos,
   the rating), set into the page frame: the logos become a row of hairline
   cells, like Rankaria's engine strip. */
export function Guarantee() {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={ShieldCheck}
        title={
          <>
            Try it with <Accent>zero risk</Accent>
          </>
        }
        subtitle="Cancel anytime, with no hidden fees and no long-term contract. Your access stays active until the end of your billing period."
      />

      {/* Real customers only: BRANDS is the same list the hero and the logo
          band read from. */}
      <Band>
        <ul
          aria-label="Brands growing with Rankbox"
          className={cn("grid gap-px", LINE_FILL)}
          style={{ gridTemplateColumns: `repeat(${BRANDS.length}, minmax(0, 1fr))` }}
        >
          {BRANDS.map((brand, i) => (
            <li key={brand.name} className="bg-white">
              <Reveal
                delay={i * 0.05}
                className="group flex items-center justify-center py-8 sm:py-10"
              >
                {/* Logos only: three of the names are still placeholders
                    (see data/brands.ts), so none are printed here. */}
                <BrandTile
                  brand={brand}
                  label={null}
                  className="h-10 w-10 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-12 sm:w-12"
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </Band>

      <Band inner="flex flex-col items-center gap-2 px-5 py-8 text-center">
        <div className="flex items-center gap-2">
          <Stars />
          <span className="text-lg font-semibold text-ink">4.8/5</span>
        </div>
        <p className="text-balance text-sm text-muted-foreground">
          60,000+ articles published for 400+ founders
        </p>
      </Band>
    </section>
  );
}
