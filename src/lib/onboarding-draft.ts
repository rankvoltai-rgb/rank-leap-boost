/**
 * Onboarding progress for real mode, kept in this browser's localStorage.
 *
 * Mock mode keeps the draft in its per-account store. Real mode had no draft at
 * all, so a refresh, the back button, or the email-confirmation round trip
 * threw away the site scan and the keyword analysis and made the user wait
 * through both again.
 *
 * The draft records which account it belongs to once one is known, so a
 * different account signing in on the same browser starts clean instead of
 * inheriting someone else's brand.
 */
import type { OnboardingDraft } from "@/lib/mock/store";

const KEY = "rankbox.onboarding.draft.v1";

interface Stored {
  owner: string | null;
  draft: OnboardingDraft;
}

function read(): Stored | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function write(value: Stored | null) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(KEY, JSON.stringify(value));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* quota or private mode — onboarding still works, it just won't resume */
  }
}

export function loadLocalDraft(): OnboardingDraft | null {
  return read()?.draft ?? null;
}

export function saveLocalDraft(patch: Partial<OnboardingDraft>) {
  const current = read();
  // The first write is always a full draft (see Onboarding's patch), so a
  // partial patch with nothing to merge into is dropped rather than stored
  // as a malformed draft.
  if (!current && !("url" in patch)) return;
  write({
    owner: current?.owner ?? null,
    draft: { ...(current?.draft as OnboardingDraft), ...patch },
  });
}

/**
 * Binds the saved draft to the signed-in account. Returns false, and drops the
 * draft, when it belongs to a different account.
 */
export function claimLocalDraft(userId: string): boolean {
  const current = read();
  if (!current || !userId) return true;
  if (current.owner && current.owner !== userId) {
    write(null);
    return false;
  }
  if (!current.owner) write({ ...current, owner: userId });
  return true;
}

export function clearLocalDraft() {
  write(null);
}
