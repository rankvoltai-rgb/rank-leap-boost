/**
 * Structural stand-ins for the Framer types this plugin touches.
 *
 * The pure modules in `src/lib` import from here and never from
 * `framer-plugin`, which is what lets them run under vitest's `node`
 * environment with no Framer runtime. `src/framer-adapter.ts` is the only
 * place the real `framer` object is bridged onto these shapes.
 */

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "link"
  | "formattedText"
  | "image"
  | "file"
  | "color"
  | "enum"
  | "collectionReference"
  | "multiCollectionReference"
  | "array"
  | "unsupported";

export type ContentType = "auto" | "markdown" | "html";

export interface CollectionFieldLike {
  id: string;
  name: string;
  type: FieldType;
  contentType?: ContentType;
  userEditable?: boolean;
}

export interface FieldDataEntry {
  type: FieldType;
  value: string | number | boolean | null;
  contentType?: ContentType;
}

export interface CollectionItemLike {
  id: string;
  slug: string;
  fieldData: Record<string, FieldDataEntry>;
}

/**
 * The subset of `ManagedCollection` the sync engine uses. Narrow on purpose:
 * everything here is trivial to fake in a test.
 */
export interface ManagedCollectionLike {
  readonly id: string;
  readonly name: string;
  getFields(): Promise<CollectionFieldLike[]>;
  setFields(fields: CollectionFieldLike[]): Promise<void>;
  getItemIds(): Promise<string[]>;
  addItems(items: CollectionItemLike[]): Promise<void>;
  removeItems(itemIds: string[]): Promise<void>;
  getPluginData(key: string): Promise<string | null>;
  setPluginData(key: string, value: string | null): Promise<void>;
}
