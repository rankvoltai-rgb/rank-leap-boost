import { SITE, sublandingHead } from "@/sublanding/_shared/head";
import { STUDIO } from "@/sublanding/_shared/facts";
import { FAQS, FEATURE_LIST, META, NAME, OFFER, PATH } from "./content";

/**
 * The route's <head>: meta, canonical and one JSON-LD graph, all from
 * content.ts, plus the per-site price as its own Offer.
 */
export const head = () =>
  sublandingHead({
    path: PATH,
    name: NAME,
    title: META.title,
    description: META.description,
    headline: META.h1,
    keywords: META.keywords,
    faqs: FAQS,
    featureList: FEATURE_LIST,
    graph: [
      {
        "@type": "Offer",
        "@id": `${SITE}${PATH}#client-site`,
        name: OFFER.name,
        url: `${SITE}${PATH}`,
        price: String(STUDIO.monthlyPerSite),
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(STUDIO.monthlyPerSite),
          priceCurrency: "USD",
          unitText: OFFER.unitText,
          billingDuration: "P1M",
        },
        seller: { "@id": `${SITE}/#organization` },
        itemOffered: { "@id": `${SITE}${PATH}#software` },
      },
    ],
  });
