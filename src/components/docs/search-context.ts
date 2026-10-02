import { createContext, useContext } from "react";

export const SearchContext = createContext<() => void>(() => {});

/** Opens docs search from anywhere under the docs layout. */
export const useOpenDocsSearch = () => useContext(SearchContext);
