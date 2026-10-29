import { SITE, sublandingHead } from "@/sublanding/_shared/head";
import { STUDIO } from "@/sublanding/_shared/facts";
import { DEEP, FAQS, FEATURE_LIST, META, NAME, PATH, STUDIO_OFFER_NAME } from "./content";

const URL = `${SITE}${PATH}`;

/**
 * The route's <head>: a CollectionPage (the hub lists the three deep dives),
 * with the deep dives as an ItemList and one more client site as an Offer
 * priced per site per month, all from content.ts and pricing.ts.
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
    pageType: "CollectionPage",
    graph: [
      {
        "@type": "ItemList",
        "@id": `${URL}#deep-dives`,
        name: "White-label deep dives",
        itemListElement: DEEP.pages.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}${p.href}`,
          name: p.title,
        })),
      },
      {
        "@type": "Offer",
        "@id": `${URL}#studio-site`,
        name: STUDIO_OFFER_NAME,
        url: URL,
        seller: { "@id": `${SITE}/#organization` },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: STUDIO.monthlyPerSite,
          priceCurrency: "USD",
          unitText: "site per month",
          billingDuration: "P1M",
        },
      },
    ],
  });
