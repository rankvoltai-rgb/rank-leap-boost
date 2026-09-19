/**
 * Sign-up, sign-in and session for the app.
 *
 * Mock mode (VITE_MOCK_DATA=1) uses local accounts stored in this browser —
 * see src/lib/mock/auth.ts. Otherwise Supabase, with Google and Apple through
 * Supabase's own OAuth. Screens import from here, never from either directly.
 */
import { IS_MOCK } from "@/lib/mock/mode";
import * as mockAuth from "@/lib/mock/auth";
import { hasSavedState, seedMockAccount } from "@/lib/mock/store";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

/**
 * What the app calls someone: the first word of the name given at sign-up —
 * "Aiden Rigali" and "Aiden" both give "Aiden". Empty when no name was given.
 */
export function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

export async function getSessionUser(): Promise<AuthUser | null> {
  if (IS_MOCK) return mockAuth.getSessionUser();
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    fullName: (data.user.user_metadata?.full_name as string | undefined) ?? "",
  };
}

export async function signUpWithPassword(input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<void> {
  if (IS_MOCK) {
    await mockAuth.signUp(input);
    return;
  }
  const { supabase } = await import("@/integrations/supabase/client");
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${window.location.origin}/onboarding`,
      data: { full_name: input.fullName },
    },
  });
  if (error) throw error;
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
}): Promise<void> {
  if (IS_MOCK) {
    const user = await mockAuth.signIn(input);
    // The demo account lands on a populated dashboard the first time.
    if (user.email === mockAuth.DEMO_EMAIL && !hasSavedState()) seedMockAccount();
    return;
  }
  const { supabase } = await import("@/integrations/supabase/client");
  const { error } = await supabase.auth.signInWithPassword(input);
  if (error) throw error;
}

/** "redirected" means the browser is leaving for the provider's sign-in page. */
export async function signInWithProvider(
  provider: "google" | "apple",
  redirectUri: string,
): Promise<"redirected" | "signed-in"> {
  if (IS_MOCK) {
    await mockAuth.signInWithProvider(provider);
    return "signed-in";
  }
  // Supabase's own OAuth rather than Lovable's broker, which only exists on
  // Lovable-hosted domains. The provider has to be enabled in the Supabase
  // project, and redirectUri has to be on its redirect allow list.
  const { supabase } = await import("@/integrations/supabase/client");
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectUri },
  });
  if (error) throw error;
  return "redirected";
}

export async function signOut(): Promise<void> {
  if (IS_MOCK) return mockAuth.signOut();
  const { supabase } = await import("@/integrations/supabase/client");
  await supabase.auth.signOut();
}
