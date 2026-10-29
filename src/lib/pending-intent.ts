/**
 * Remembers where a sign-up should land once onboarding is done, when it
 * started somewhere that wants more than the dashboard — today only the
 * white-label page, which sends agencies on to Studio to add client sites.
 *
 * Kept in localStorage for the same reasons as pending-site.ts: OAuth and
 * email confirmation both drop the query string, and onboarding (with its
 * trial step) sits between the sign-up and the destination. The ?intent=
 * param on /auth only seeds it.
 */
export type PendingIntent = "studio";

const KEY = "rankvolt.pending_intent";

/** Where each intent lands after onboarding. */
export const INTENT_DESTINATION: Record<PendingIntent, "/dashboard/studio"> = {
  studio: "/dashboard/studio",
};

export function parseIntent(value: unknown): PendingIntent | undefined {
  return value === "studio" ? value : undefined;
}

export function setPendingIntent(intent: PendingIntent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, intent);
  } catch {
    /* private mode: the sign-up still works, it just lands on the dashboard */
  }
}

/** Reads and clears it, so it steers exactly one landing. */
export function takePendingIntent(): PendingIntent | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const intent = parseIntent(window.localStorage.getItem(KEY));
    window.localStorage.removeItem(KEY);
    return intent;
  } catch {
    return undefined;
  }
}

/** The dashboard, or wherever a pending intent says to go instead. */
export function landingAfterOnboarding(): "/dashboard" | "/dashboard/studio" {
  const intent = takePendingIntent();
  return intent ? INTENT_DESTINATION[intent] : "/dashboard";
}
