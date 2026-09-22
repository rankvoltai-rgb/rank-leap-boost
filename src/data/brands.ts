/**
 * Customer logos shown on the landing page — in the hero's trust row and in
 * the "Used by" band beneath it. Both read from this one list, so a brand is
 * added or removed in a single place.
 *
 * Easiest: give a domain and the logo is fetched automatically.
 *
 *   { name: "Acme", domain: "acme.com" }
 *
 * For a specific asset (higher quality than a favicon), import it and set
 * `src`, which wins over `domain`:
 *
 *   import acme from "@/assets/logos/acme.webp?no-inline";
 *   { name: "Acme", src: acme }
 *
 * Logos are 144px WebP (3x the largest 48px tile). `?no-inline` keeps Vite
 * from base64-ing small files into the main JS bundle and every page's HTML;
 * as separate hashed files they are cached for a year instead.
 *
 * An entry with neither renders a monogram tile, so the layout stays intact.
 *
 * NOTE: this is a public claim that the brand uses Rankbox. Only list real
 * customers.
 */
import laravel from "@/assets/logos/laravel.webp?no-inline";
import brandPill from "@/assets/logos/brand-pill.webp?no-inline";
import mongodb from "@/assets/logos/mongodb.webp?no-inline";
import brandSunburst from "@/assets/logos/brand-sunburst.webp?no-inline";
import brandCheck from "@/assets/logos/brand-check.webp?no-inline";

export interface Brand {
  name: string;
  /** Logo is fetched from this domain, e.g. "acme.com". */
  domain?: string;
  /** Explicit asset or URL. Takes precedence over `domain`. */
  src?: string;
}

// Names are the logo alt text. Laravel and MongoDB are identified; the other
// three still need their real brand names.
export const BRANDS: Brand[] = [
  { name: "Laravel", src: laravel },
  { name: "Brand (pill mark)", src: brandPill },
  { name: "MongoDB", src: mongodb },
  { name: "Brand (sunburst mark)", src: brandSunburst },
  { name: "Brand (check mark)", src: brandCheck },
];
