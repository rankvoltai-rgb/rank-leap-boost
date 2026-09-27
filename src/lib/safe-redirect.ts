/**
 * The page to return to after sign-in, taken from /auth?redirect=. Only a path
 * on this site is accepted: "//evil.com", "/\evil.com", "https://evil.com" and
 * paths with control characters (browsers strip a tab or newline, which can
 * turn "/\t/evil.com" into "//evil.com") all give undefined, so the parameter
 * can't be used to bounce someone to another site after they sign in.
 */
export function safeRedirectPath(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("/")) return undefined;
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code < 0x20 || code === 0x7f || ch === "\\") return undefined;
  }
  const base = "https://rankbox.invalid";
  try {
    if (new URL(value, base).origin !== base) return undefined;
  } catch {
    return undefined;
  }
  return value;
}
