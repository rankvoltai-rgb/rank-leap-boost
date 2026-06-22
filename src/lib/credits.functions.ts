import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Server-authoritative credit operations. Credit tables are SELECT-only for
 * users under RLS, and the underlying SECURITY DEFINER functions are no longer
 * executable by signed-in users. All writes flow through these functions, which
 * authenticate the caller (requireSupabaseAuth) and act with the service role —
 * so a user can never grant themselves credits via the Data API.
 */

const CREDIT_PACKAGES: Record<string, { credits: number; amountCents: number }> = {
  starter: { credits: 500, amountCents: 1900 },
  growth: { credits: 1500, amountCents: 4900 },
  scale: { credits: 5000, amountCents: 14900 },
};

/** Reserve one article credit for the signed-in user. Returns whether one was available. */
export const consumeArticleCredit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ ok: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("consume_article_credit", {
      _user_id: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: Boolean(data) };
  });

/** Idempotently create the signed-in user's credit account (used at onboarding). */
export const ensureCreditAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("credit_accounts")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!existing) {
      const { error } = await supabaseAdmin
        .from("credit_accounts")
        .insert({ user_id: context.userId, credits_used: 0, credits_total: 30 });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/** Add a server-validated credit package to the signed-in user's balance. */
export const purchaseCreditPackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { packageId: string }) =>
    z.object({ packageId: z.enum(["starter", "growth", "scale"]) }).parse(data),
  )
  .handler(async ({ data, context }): Promise<{ ok: true; credits: number }> => {
    const pkg = CREDIT_PACKAGES[data.packageId];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: txErr } = await supabaseAdmin.from("credit_transactions").insert({
      user_id: context.userId,
      package: data.packageId,
      credits: pkg.credits,
      amount_cents: pkg.amountCents,
    });
    if (txErr) throw new Error(txErr.message);

    const { data: acct } = await supabaseAdmin
      .from("credit_accounts")
      .select("credits_total")
      .eq("user_id", context.userId)
      .maybeSingle();
    const currentTotal = (acct?.credits_total as number | undefined) ?? 30;

    const { error: updErr } = await supabaseAdmin
      .from("credit_accounts")
      .update({ credits_total: currentTotal + pkg.credits })
      .eq("user_id", context.userId);
    if (updErr) throw new Error(updErr.message);

    return { ok: true, credits: pkg.credits };
  });
