import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { TRIAL_ARTICLE_CREDITS } from "@/data/pricing";

/**
 * Server-authoritative credit operations. Credit tables are SELECT-only for
 * users under RLS, and the underlying SECURITY DEFINER functions are no longer
 * executable by signed-in users. All writes flow through the server — these
 * functions, generation (which spends as it writes) and the billing sync —
 * which authenticate the caller and act with the service role, so a user can
 * never grant themselves credits via the Data API.
 *
 * The pay-per-pack top-up that used to live here granted credits without a
 * payment behind them and had no caller; it was removed rather than moved
 * onto sites.
 */

/**
 * Idempotently create the account's first credit account, for its primary
 * site, when onboarding commits. Studio sites never come through here: their
 * accounts are opened by the billing sync that made them live, with the
 * allowance they paid for.
 */
export const ensureCreditAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ siteId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { loadOwnedSite } = await import("@/lib/sites.server");
    const site = await loadOwnedSite(context.userId, data.siteId);
    if (site.kind !== "primary") return { ok: true };

    const { data: existing } = await supabaseAdmin
      .from("credit_accounts")
      .select("id")
      .eq("site_id", site.id)
      .maybeSingle();
    if (!existing) {
      const { error } = await supabaseAdmin.from("credit_accounts").insert({
        user_id: context.userId,
        site_id: site.id,
        credits_used: 0,
        // Pre-payment balance. The Stripe webhook sets the real allowance
        // when a trial starts, and the full one on first payment.
        credits_total: TRIAL_ARTICLE_CREDITS,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
