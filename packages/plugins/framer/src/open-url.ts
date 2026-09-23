/**
 * Opening an external link from inside the plugin.
 *
 * The Framer plugin API has no link-opening method, and the plugin runs in a
 * sandboxed iframe, so this goes through `window.open` with `noopener` and
 * falls back to a synthetic anchor if a popup blocker intervenes.
 */
export function openExternal(url: string): void {
  try {
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (opened) return;
  } catch {
    // Fall through to the anchor.
  }
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();
  } catch {
    // Nothing more we can do; the UI still shows the URL.
  }
}
