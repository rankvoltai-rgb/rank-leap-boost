import { sublandingHead } from "@/sublanding/_shared/head";
import { FAQS, FEATURE_LIST, META, NAME, PATH } from "./content";

/** The route's <head>: meta, canonical and one JSON-LD graph, all from content.ts. */
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
  });
