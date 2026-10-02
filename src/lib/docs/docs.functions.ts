import { createServerFn } from "@tanstack/react-start";
import {
  docsNav,
  docsSearchIndex,
  docsUpdated,
  getDoc,
  type DocPageData,
  type DocsNavSection,
  type DocsSearchEntry,
} from "./content.server";

/** Every section and its pages, in order: the sidebar, hub and section pages. */
export const getDocsNav = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ sections: DocsNavSection[]; updated: string | null }> => ({
    sections: docsNav(),
    updated: docsUpdated(),
  }),
);

/** One page, rendered, or null when there's no such page. */
export const getDocPage = createServerFn({ method: "GET" })
  .validator((data: { section: string; page: string }) => data)
  .handler(async ({ data }): Promise<DocPageData | null> => getDoc(data.section, data.page));

/** Titles, descriptions and section headings of every page, for search. */
export const getDocsSearchIndex = createServerFn({ method: "GET" }).handler(
  async (): Promise<DocsSearchEntry[]> => docsSearchIndex(),
);
