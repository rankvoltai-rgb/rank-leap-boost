// Server-only autopilot engine. Generates the next due article for each user
// who has autopilot enabled, paced by their weekly cadence. Runs from the
// public cron route with the service-role client (RLS bypassed).
import { hasGenerationEntitlement } from "./entitlement.server";

type AnyClient = {
  from: (t: string) => any;
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: any; error: any }>;
};

async function loadStyle(supabase: AnyClient, userId: string): Promise<string> {
  const [{ data: settings }, { data: profile }] = await Promise.all([
    supabase.from("content_settings").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
  ]);
  const tone = settings?.tone ?? "Professional";
  const style = settings?.writing_style ?? "Balanced";
  const audience = settings?.audience ?? "Founders / Entrepreneurs";
  const voice = settings?.brand_voice ?? "";
  const brand = profile?.brand_name ?? "the brand";
  const product = profile?.product_description ?? "";
  return `Brand: ${brand}\nProduct context: ${product}\nTone: ${tone}\nWriting style: ${style}\nTarget audience: ${audience}\nBrand voice: ${voice}`;
}

/** Generate a full, source-backed article for one queued blog row. */
async function generateArticle(
  supabase: AnyClient,
  userId: string,
  blog: { title: string; keyword: string | null; description: string | null },
) {
  const style = await loadStyle(supabase, userId);
  const { writeArticle } = await import("./article.server");
  const article = await writeArticle(
    {
      title: blog.title,
      keyword: blog.keyword ?? blog.title,
      description: blog.description ?? undefined,
    },
    style,
  );
  const { video, ...content } = article;
  void video;
  return content;
}

interface SettingsRow {
  user_id: string;
  weekly_cadence: number;
  last_autopilot_run: string | null;
}

/** Returns true if this user is due for a new autopilot article right now. */
function isDue(row: SettingsRow): boolean {
  const cadence = Math.max(1, Math.min(7, row.weekly_cadence ?? 7));
  const intervalMs = (7 / cadence) * 24 * 60 * 60 * 1000;
  if (!row.last_autopilot_run) return true;
  const last = new Date(row.last_autopilot_run).getTime();
  // 1h tolerance so a daily cron reliably fires.
  return Date.now() - last >= intervalMs - 60 * 60 * 1000;
}

export async function runAutopilot(): Promise<{ processed: number; skipped: number }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const client = supabaseAdmin as unknown as AnyClient;

  const { data: rows } = await client
    .from("content_settings")
    .select("user_id, weekly_cadence, last_autopilot_run, autopilot_enabled")
    .eq("autopilot_enabled", true);

  const settings = (rows ?? []) as Array<SettingsRow & { autopilot_enabled: boolean }>;
  let processed = 0;
  let skipped = 0;

  for (const row of settings) {
    if (!isDue(row)) {
      skipped += 1;
      continue;
    }

    // autopilot_enabled defaults to true, so without this the cron generates
    // paid articles for accounts that never started a trial. Checked before
    // the credit is reserved so a blocked user is not charged one.
    if (!(await hasGenerationEntitlement(client, row.user_id))) {
      skipped += 1;
      continue;
    }

    // Reserve one credit atomically. Skips the user if their monthly cap is hit.
    const { data: reserved } = await client.rpc("consume_article_credit", {
      _user_id: row.user_id,
    });
    if (!reserved) {
      skipped += 1;
      continue;
    }

    // Next due article: scheduled, lowest queue position then soonest date.
    const { data: nextRows } = await client
      .from("blogs")
      .select("*")
      .eq("user_id", row.user_id)
      .eq("status", "scheduled")
      .order("queue_position", { ascending: true, nullsFirst: false })
      .order("scheduled_date", { ascending: true })
      .limit(1);
    const blog = (nextRows ?? [])[0];
    if (!blog) {
      // Nothing to write — give the reserved credit back.
      await client.rpc("refund_article_credit", { _user_id: row.user_id });
      skipped += 1;
      continue;
    }

    try {
      await client.from("blogs").update({ status: "generating" }).eq("id", blog.id);
      const content = await generateArticle(client, row.user_id, blog);
      await client
        .from("blogs")
        .update({
          ...content,
          traffic_estimate: content.traffic_estimate || blog.traffic_estimate,
          status: "finished",
        })
        .eq("id", blog.id);
      await client
        .from("content_settings")
        .update({ last_autopilot_run: new Date().toISOString() })
        .eq("user_id", row.user_id);
      processed += 1;
    } catch {
      // Roll the article back to scheduled and refund the reserved credit.
      await client.from("blogs").update({ status: "scheduled" }).eq("id", blog.id);
      await client.rpc("refund_article_credit", { _user_id: row.user_id });
      skipped += 1;
    }
  }

  return { processed, skipped };
}
