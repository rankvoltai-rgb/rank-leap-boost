/**
 * The sync ledger: what this plugin believes it has already written.
 *
 * It lives in the collection's plugin data rather than the browser, because a
 * teammate's first sync must not conclude that every item is unowned. It holds
 * no secrets — only article ids, content hashes and slugs.
 */

export const LEDGER_KEY = "rankbox:state";
export const LEDGER_VERSION = 1;

export interface LedgerEntry {
  /** Hash of the content actually written. See `contentHash`. */
  h: string;
  /** The slug this item was created with, so live URLs stay stable. */
  slug: string;
}

export interface Ledger {
  v: number;
  items: Record<string, LedgerEntry>;
  lastFullAt: string | null;
  cursor: string | null;
}

export function emptyLedger(): Ledger {
  return { v: LEDGER_VERSION, items: {}, lastFullAt: null, cursor: null };
}

/** Never throw on malformed or foreign data — treat it as "no ledger yet". */
export function parseLedger(raw: string | null): Ledger {
  if (!raw) return emptyLedger();
  try {
    const parsed = JSON.parse(raw) as Partial<Ledger> | null;
    if (!parsed || typeof parsed !== "object") return emptyLedger();
    if (parsed.v !== LEDGER_VERSION) return emptyLedger();
    const items = parsed.items && typeof parsed.items === "object" ? parsed.items : {};
    return {
      v: LEDGER_VERSION,
      items: items as Record<string, LedgerEntry>,
      lastFullAt: typeof parsed.lastFullAt === "string" ? parsed.lastFullAt : null,
      cursor: typeof parsed.cursor === "string" ? parsed.cursor : null,
    };
  } catch {
    return emptyLedger();
  }
}

export function serializeLedger(ledger: Ledger): string {
  return JSON.stringify(ledger);
}
