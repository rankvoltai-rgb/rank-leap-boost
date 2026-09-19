import { createContext } from "react";

/**
 * What the block renderer needs from the article around it: heading anchors
 * (shared with the table of contents) and figure numbers. ArticleBody fills it.
 */
export interface BlockContextValue {
  anchors: Map<string, string>;
  figureNumbers: Map<string, number>;
}

export const BlockContext = createContext<BlockContextValue>({
  anchors: new Map(),
  figureNumbers: new Map(),
});
