import { SOLUTIONS } from "@/data/solutions";
import { SITE, sublandingHead } from "@/sublanding/_shared/head";
import { FAQS, FEATURE_LIST, HERO, LIST_NAME, META } from "./content";
import { buildGroups } from "./model";

export const PATH = "/solutions";

/** The index as JSON-LD, in the order the panel shows it. Descriptive only. */
export function itemList() {
  const lines = buildGroups(SOLUTIONS).flatMap((g) => g.lines);
  return {
    "@type": "ItemList",
    "@id": `${SITE}${PATH}#list`,
    name: LIST_NAME,
    numberOfItems: lines.length,
    itemListElement: lines.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.title,
      url: `${SITE}${l.path}`,
    })),
  };
}

export const head = () =>
  sublandingHead({
    path: PATH,
    name: HERO.crumbHere,
    title: META.title,
    description: META.description,
    headline: META.h1,
    keywords: META.keywords,
    faqs: FAQS.map(({ q, a }) => ({ q, a })),
    featureList: FEATURE_LIST,
    pageType: "CollectionPage",
    graph: [itemList()],
  });
