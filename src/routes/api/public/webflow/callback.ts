import { createFileRoute } from "@tanstack/react-router";

/**
 * Webflow OAuth redirect URI: https://rankbox.xyz/api/public/webflow/callback
 * (must match the app's settings exactly).
 *
 * A plain browser navigation back from webflow.com, so it carries no Rankbox
 * session. Who is connecting comes from the signed `state`, and the nonce
 * cookie set when the flow started proves it's the same browser. Both are
 * checked before the code is touched. Codes are single-use and are never
 * logged. The result goes back to the dashboard as a `webflow=` flag.
 */

const COOKIE = "rb_wf_oauth";
const CLEAR_COOKIE = `${COOKIE}=; Path=/api/public/webflow; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;

type Outcome = "connected" | "denied" | "expired" | "failed" | "unavailable";

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function backToDashboard(request: Request, outcome: Outcome, siteId?: string): Response {
  const url = new URL("/dashboard/integrations", new URL(request.url).origin);
  url.searchParams.set("connector", "webflow");
  url.searchParams.set("webflow", outcome);
  if (siteId) url.searchParams.set("site", siteId);
  return new Response(null, {
    status: 302,
    headers: [
      ["Location", url.toString()],
      ["Cache-Control", "no-store"],
      // Both forms: the nonce is domain-scoped when the flow began on www.
      ["Set-Cookie", CLEAR_COOKIE],
      ["Set-Cookie", `${CLEAR_COOKIE}; Domain=${new URL(request.url).hostname}`],
    ],
  });
}

export const Route = createFileRoute("/api/public/webflow/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const { webflowConfig, exchangeCode, WebflowNotConfiguredError } =
          await import("@/lib/webflow/api.server");
        const { verifyState, encryptToken } = await import("@/lib/webflow/crypto");

        let config;
        try {
          config = webflowConfig();
        } catch (err) {
          if (err instanceof WebflowNotConfiguredError)
            return backToDashboard(request, "unavailable");
          throw err;
        }

        const state = await verifyState(
          params.get("state"),
          readCookie(request, COOKIE),
          config.encryptionKey,
        );
        // The user pressed Cancel on Webflow's consent screen. Nothing to
        // exchange, so this needs no valid state to report.
        if (params.get("error")) return backToDashboard(request, "denied", state?.siteId);

        // No valid state: don't exchange the code. Could be an expired or
        // forged link, or an install started from Webflow's side, which
        // Rankbox's install URL avoids by starting from the dashboard.
        if (!state) return backToDashboard(request, "expired");

        const code = params.get("code");
        if (!code) return backToDashboard(request, "failed", state.siteId);

        try {
          const { requireLiveSite } = await import("@/lib/sites.server");
          await requireLiveSite(state.userId, state.siteId);

          const { token, scope } = await exchangeCode(config, code);
          const accessTokenEnc = await encryptToken(token, config.encryptionKey);

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: existing } = await supabaseAdmin
            .from("webflow_connections")
            .select("id, collection_id, webflow_site_id")
            .eq("site_id", state.siteId)
            .eq("user_id", state.userId)
            .maybeSingle();

          // A reconnect may tick different sites, or be another Webflow
          // account. Only resume publishing if the saved site is still in
          // reach; otherwise send them back through choosing a collection.
          let resumable = false;
          if (existing?.collection_id && existing.webflow_site_id) {
            const { listSites } = await import("@/lib/webflow/api.server");
            const sites = await listSites(token).catch(() => []);
            resumable = sites.some((s) => s.id === existing.webflow_site_id);
          }

          // Reconnecting keeps the same row, so the item ledger carries over
          // and articles already in Webflow are updated, not duplicated.
          const { error } = existing
            ? await supabaseAdmin
                .from("webflow_connections")
                .update({
                  access_token_enc: accessTokenEnc,
                  scope,
                  status: resumable ? "active" : "setup",
                  last_error: null,
                })
                .eq("id", existing.id)
            : await supabaseAdmin.from("webflow_connections").insert({
                user_id: state.userId,
                site_id: state.siteId,
                access_token_enc: accessTokenEnc,
                scope,
                status: "setup",
              });
          if (error) throw new Error(error.message);
          return backToDashboard(request, "connected", state.siteId);
        } catch (err) {
          // The message only: never the code or a token.
          console.error(
            "webflow oauth callback failed",
            err instanceof Error ? err.message : "unknown",
          );
          return backToDashboard(request, "failed", state.siteId);
        }
      },
    },
  },
});
