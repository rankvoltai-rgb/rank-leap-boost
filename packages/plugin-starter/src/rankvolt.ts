import { RankvoltClient } from "@rankvolt/api-client";

// Shared connection + sync state for any plugin built on this starter. A fork
// keeps this file as-is and only changes where the articles get written (the
// platform CMS).
const KEY_STORAGE = "rankvolt.apiKey";
const BASE_STORAGE = "rankvolt.baseUrl";
const CURSOR_STORAGE = "rankvolt.since";

export const DEFAULT_BASE_URL = "https://rankvolt.top";

export function loadConnection(): { apiKey: string; baseUrl: string } {
  return {
    apiKey: localStorage.getItem(KEY_STORAGE) ?? "",
    baseUrl: localStorage.getItem(BASE_STORAGE) ?? DEFAULT_BASE_URL,
  };
}

export function saveConnection(apiKey: string, baseUrl: string): void {
  localStorage.setItem(KEY_STORAGE, apiKey.trim());
  localStorage.setItem(BASE_STORAGE, baseUrl.trim() || DEFAULT_BASE_URL);
}

export function clearConnection(): void {
  localStorage.removeItem(KEY_STORAGE);
}

/** Incremental-sync cursor: the `next_since` returned by the last article poll. */
export function loadCursor(): string | undefined {
  return localStorage.getItem(CURSOR_STORAGE) ?? undefined;
}
export function saveCursor(since: string | null): void {
  if (since) localStorage.setItem(CURSOR_STORAGE, since);
}

export function makeClient(apiKey: string, baseUrl: string): RankvoltClient {
  return new RankvoltClient({ apiKey, baseUrl });
}
