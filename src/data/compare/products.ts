/**
 * Every product that appears in a head-to-head, once. Matchups refer to
 * products by slug, so a tool that shows up in three comparisons is named,
 * spelled and linked the same way in all three.
 */

export interface Product {
  slug: string;
  /** Spelled the way they spell it. */
  name: string;
  /** Their site; also where the mark is fetched from. */
  domain: string;
  /** Lettermark fallback for when the logo fetch fails. One or two characters. */
  monogram: string;
  /** Their brand colour, used only as a faint tint behind the fallback. */
  accent: string;
  /** What it is, in a few words and close to their own terms. */
  kind: string;
}

export const PRODUCTS = {
  "surfer-seo": {
    slug: "surfer-seo",
    name: "Surfer SEO",
    domain: "surferseo.com",
    monogram: "S",
    accent: "#18b3a8",
    kind: "Content optimization platform",
  },
  clearscope: {
    slug: "clearscope",
    name: "Clearscope",
    domain: "clearscope.io",
    monogram: "C",
    accent: "#2563eb",
    kind: "Content optimization platform",
  },
  frase: {
    slug: "frase",
    name: "Frase",
    domain: "frase.io",
    monogram: "F",
    accent: "#7c3aed",
    kind: "SEO & GEO content platform",
  },
  jasper: {
    slug: "jasper",
    name: "Jasper",
    domain: "jasper.ai",
    monogram: "J",
    accent: "#8b5cf6",
    kind: "Marketing agents platform",
  },
  writesonic: {
    slug: "writesonic",
    name: "Writesonic",
    domain: "writesonic.com",
    monogram: "W",
    accent: "#6d28d9",
    kind: "AI search visibility platform",
  },
  "koala-ai": {
    slug: "koala-ai",
    name: "Koala AI",
    domain: "koala.sh",
    monogram: "K",
    accent: "#16a34a",
    kind: "AI SEO article writer",
  },
  byword: {
    slug: "byword",
    name: "Byword",
    domain: "byword.ai",
    monogram: "B",
    accent: "#111827",
    kind: "AI SEO article writer",
  },
  profound: {
    slug: "profound",
    name: "Profound",
    domain: "tryprofound.com",
    monogram: "P",
    accent: "#0f172a",
    kind: "AI visibility platform",
  },
  "peec-ai": {
    slug: "peec-ai",
    name: "Peec AI",
    domain: "peec.ai",
    monogram: "P",
    accent: "#4f46e5",
    kind: "AI search analytics",
  },
  semrush: {
    slug: "semrush",
    name: "Semrush",
    domain: "semrush.com",
    monogram: "S",
    accent: "#ff642d",
    kind: "Online visibility platform",
  },
  ahrefs: {
    slug: "ahrefs",
    name: "Ahrefs",
    domain: "ahrefs.com",
    monogram: "A",
    accent: "#054ada",
    kind: "SEO & marketing platform",
  },
} as const satisfies Record<string, Product>;

export type ProductSlug = keyof typeof PRODUCTS;

export function getProduct(slug: ProductSlug): Product {
  return PRODUCTS[slug];
}
