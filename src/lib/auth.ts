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
  /** Where the confirmation email's link lands. Defaults to onboarding. */
  returnPath?: string;
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
      emailRedirectTo: `${window.location.origin}${input.returnPath ?? "/onboarding"}`,
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

/**
 * An app (Claude, ChatGPT, Cursor…) asking to use someone's Rankbox account
 * through Supabase's OAuth server. Supabase sends the browser to
 * /oauth/consent?authorization_id=… and the page reads the request from here.
 * "done" means this person already approved this app, so there is nothing to
 * ask: the browser just goes back to the app.
 */
export type OAuthRequest =
  | {
      kind: "consent";
      /** Chosen by whoever registered the app; Rankbox doesn't verify it. */
      appName: string;
      /** Where the browser goes after a decision — the one part an impostor can't fake. */
      redirectUri: string;
      email: string;
      scopes: string[];
    }
  | { kind: "done"; redirectUrl: string };

const NO_MOCK_OAUTH = "Connecting an app needs a real Rankbox account, not mock mode.";

export async function getOAuthRequest(authorizationId: string): Promise<OAuthRequest> {
  if (IS_MOCK) throw new Error(NO_MOCK_OAUTH);
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
  if (error) throw error;
  if (!("authorization_id" in data)) return { kind: "done", redirectUrl: data.redirect_url };
  return {
    kind: "consent",
    appName: data.client.name.trim() || "An app",
    redirectUri: data.redirect_uri,
    email: data.user.email,
    scopes: data.scope.split(/\s+/).filter(Boolean),
  };
}

/** Records the decision and returns the URL that takes the browser back to the app. */
export async function answerOAuthRequest(
  authorizationId: string,
  decision: "approve" | "deny",
): Promise<string> {
  if (IS_MOCK) throw new Error(NO_MOCK_OAUTH);
  const { supabase } = await import("@/integrations/supabase/client");
  const options = { skipBrowserRedirect: true };
  const { data, error } =
    decision === "approve"
      ? await supabase.auth.oauth.approveAuthorization(authorizationId, options)
      : await supabase.auth.oauth.denyAuthorization(authorizationId, options);
  if (error) throw error;
  return data.redirect_url;
}
