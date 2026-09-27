import { createFileRoute } from "@tanstack/react-router";
import { OAuthConsent } from "@/components/auth/OAuthConsent";

/**
 * Supabase's OAuth server sends people here when an app — Claude, ChatGPT,
 * Cursor — asks to use their Rankbox account through the MCP server. The path
 * is set in Supabase under Authentication → OAuth Server → Authorization Path,
 * so renaming this route breaks every connection until that is changed too.
 */
export const Route = createFileRoute("/oauth/consent")({
  // Client-only: the session lives in this browser's storage.
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { authorization_id?: string } => ({
    authorization_id:
      typeof search.authorization_id === "string" ? search.authorization_id : undefined,
  }),
  head: () => ({
    meta: [{ title: "Connect an app — Rankbox" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: ConsentRoute,
});

function ConsentRoute() {
  const { authorization_id } = Route.useSearch();
  return <OAuthConsent authorizationId={authorization_id} />;
}
