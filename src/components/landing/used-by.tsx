/**
 * "Used by" brand logos, in two placements:
 *
 * - `band` (default): a labelled row on the page background, directly under
 *   the hero. This is the logo strip.
 * - `badge`: a translucent frosted pill for use *inside* the dark hero. It is
 *   deliberately not solid white: a white card was the brightest block in the
 *   hero and competed with the headline and the URL input. Its corner radius
 *   matches that input.
 *
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { brandIconUrl } from "@/lib/brand-icon";
import { BRANDS, type Brand } from "@/data/brands";

const TINTS = [
  "from-rose-400 to-orange-300",
  "from-sky-400 to-indigo-400",
  "from-emerald-400 to-teal-300",
  "from-violet-400 to-fuchsia-300",
  "from-amber-400 to-yellow-300",
  "from-cyan-400 to-blue-400",
];

const TILE =
  "flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm transition-transform hover:-translate-y-0.5";

/** `className` carries the size and ring, which differ per placement. */
export function BrandTile({ brand, className }: { brand: Brand; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = brand.src ?? (brand.domain ? brandIconUrl(brand.domain) : null);

  if (!src || failed) {
    const tint = TINTS[[...brand.name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % TINTS.length];
    return (
      <span className={cn(TILE, className)} title={brand.name}>
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br text-[0.62rem] font-bold text-white",
            tint,
          )}
        >
          {brand.name.charAt(0).toUpperCase()}
        </span>
      </span>
    );
  }
  // Uploaded logos are full-bleed square marks with their own background, so
  // they fill the tile edge to edge. Domain favicons have no background of
  // their own, so they sit contained on the white tile.
  if (brand.src) {
    return (
      <img
        src={src}
        alt={brand.name}
        title={brand.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(
          "shrink-0 rounded-lg object-cover shadow-sm transition-transform hover:-translate-y-0.5",
          className,
        )}
      />
    );
  }
  return (
    <span className={cn(TILE, className)} title={brand.name}>
      <img
        src={src}
        alt={brand.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-5 w-5 object-contain"
      />
    </span>
  );
}

export function UsedBy({
  className,
  variant = "band",
}: {
  className?: string;
  variant?: "band" | "badge";
}) {
  if (variant === "badge") {
    return (
      <div
        className={cn(
          "inline-flex w-fit items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-md",
          className,
        )}
      >
        <span className="whitespace-nowrap text-sm font-medium text-white/85">Used by</span>
        <span className="flex items-center gap-1.5">
          {BRANDS.map((brand) => (
            <BrandTile key={brand.name} brand={brand} className="h-9 w-9 ring-1 ring-white/25" />
          ))}
        </span>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Used by teams at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        {BRANDS.map((brand) => (
          <BrandTile
            key={brand.name}
            brand={brand}
            className="h-12 w-12 rounded-xl ring-1 ring-ink/10"
          />
        ))}
      </div>
    </div>
  );
}
