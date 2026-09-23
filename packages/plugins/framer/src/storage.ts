/**
 * Where the plugin keeps things.
 *
 * The API key lives in this browser's local storage and is deliberately NOT
 * written into the Framer project. Plugin data travels with the project and is
 * readable by every collaborator, and an `rv_live_` key is not low-value: it
 * reads every article's full body and can set `published_url` on any of them,
 * which is what the backlink exchange verifies links against. Rankbox's own
 * dashboard tells users to "store it where your site's secrets live", and a
 * shared project document is not that.
 *
 * The cost is that a teammate pastes the key again. That is the right trade for
 * a credential, and the README says so plainly.
 */

const KEY_PREFIX = "rankbox.apiKey";
const BASE_URL_KEY = "rankbox.baseUrl";

export const DEFAULT_BASE_URL = "https://rankbox.xyz";

/** Plugin-data keys. Non-secret only. */
export const DATA_KEYS = {
  owner: "rankbox:owner",
  brandName: "rankbox:brandName",
  keyPrefix: "rankbox:keyPrefix",
  blogPath: "rankbox:blogPath",
  autoReport: "rankbox:autoReport",
  seoEnabled: "rankbox:seoEnabled",
  followSlugRenames: "rankbox:followSlugRenames",
  lastSyncAt: "rankbox:lastSyncAt",
  siteFingerprint: "rankbox:siteFingerprint",
  collectionId: "rankbox:collectionId",
} as const;

/**
 * Storage can be partitioned or blocked in the plugin sandbox. Every access is
 * guarded so the plugin degrades to an in-memory key for the session rather
 * than crashing.
 */
let memoryFallback: Record<string, string> = {};
let storageBlocked = false;

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    storageBlocked = true;
    return memoryFallback[key] ?? null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    storageBlocked = true;
    if (value === null) delete memoryFallback[key];
    else memoryFallback[key] = value;
  }
}

/** True once any access has failed — the UI warns the user about re-entry. */
export function isStorageBlocked(): boolean {
  return storageBlocked;
}

/**
 * Scope the key per collection so one browser can drive two Framer projects
 * pointing at two different Rankbox sites.
 */
function keyName(scope: string): string {
  return scope ? `${KEY_PREFIX}.${scope}` : KEY_PREFIX;
}

export function loadApiKey(scope: string): string {
  return read(keyName(scope)) ?? read(KEY_PREFIX) ?? "";
}

export function saveApiKey(scope: string, apiKey: string): void {
  write(keyName(scope), apiKey.trim());
}

export function clearApiKey(scope: string): void {
  write(keyName(scope), null);
  write(KEY_PREFIX, null);
  memoryFallback = {};
}

export function loadBaseUrl(): string {
  return read(BASE_URL_KEY) ?? DEFAULT_BASE_URL;
}

export function saveBaseUrl(baseUrl: string): void {
  write(BASE_URL_KEY, baseUrl.trim() || DEFAULT_BASE_URL);
}

/** Rankbox keys are `rv_live_` + 48 hex characters. */
export function isRankboxKey(raw: string): boolean {
  const key = raw.trim();
  return key.startsWith("rv_live_") && key.length >= "rv_live_".length + 24;
}

/** The safe-to-display form of a key, matching what Rankbox itself shows. */
export function keyPrefixOf(raw: string): string {
  const key = raw.trim();
  return `${key.slice(0, "rv_live_".length + 6)}…`;
}
