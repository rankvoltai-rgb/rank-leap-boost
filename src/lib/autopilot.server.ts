// Server-only autopilot engine. Generates the next due article for each SITE
// that has autopilot enabled, paced by that site's weekly cadence. Runs from
// the public cron route with the service-role client (RLS bypassed).
import { hasGenerationEntitlement, type SiteScope } from "./entitlement.server";

type AnyClient = {
  from: (t: string) => any;
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: any; error: any }>;
};

async function loadStyle(supabase: AnyClient, siteId: string): Promise<string> {
  const [{ data: settings }, { data: profile }] = await Promise.all([
    supabase.from("content_settings").select("*").eq("site_id", siteId).maybeSingle(),
    supabase.from("profiles").select("*").eq("id", siteId).maybeSingle(),
  ]);
  // The same composer the dashboard's writer and the Settings preview use, so
  // autopilot reads exactly the brief Settings shows.
  const { composeStyleBrief } = await import("./style-brief");
  return composeStyleBrief({
    brand: profile?.brand_name,
    product: profile?.product_description,
    tone: settings?.tone,
    style: settings?.writing_style,
    audience: settings?.audience,
    voice: settings?.brand_voice,
  });
}

/** Generate a full, source-backed article for one queued blog row of a site. */
async function generateArticle(
  supabase: AnyClient,
  scope: SiteScope,
  blog: { id: string; title: string; keyword: string | null; description: string | null },
) {
  const style = await loadStyle(supabase, scope.siteId);
  const { writeArticle } = await import("./article.server");
  // The backlink exchange, exactly as in generateBlogContent: reserve before,
  // confirm after, release on failure, never fail the article.
  const { reserveForArticle, settleReservations, releaseReservations } =
    await import("./exchange/engine.server");
  const reserved = await reserveForArticle(scope, {
    id: blog.id,
    title: blog.title,
    keyword: blog.keyword,
    tags: [],
  });
  let article;
  try {
    article = await writeArticle(
      {
        title: blog.title,
        keyword: blog.keyword ?? blog.title,
        description: blog.description ?? undefined,
      },
      style,
      { outboundLinks: reserved.map((r) => r.link) },
    );
  } catch (err) {
    await releaseReservations(reserved, "generation failed");
    throw err;
  }
  await settleReservations(reserved, article.outboundLinks, blog.id);
  const { video, outboundLinks, ...content } = article;
  void video;
  void outboundLinks;
  return content;
}

interface SettingsRow {
  site_id: string;
  user_id: string;
  weekly_cadence: number;
  last_autopilot_run: string | null;
}

/** Returns true if this site is due for a new autopilot article right now. */
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

  // One content_settings row per site, so each site runs on its own cadence
  // and spends its own credits.
  const { data: rows } = await client
    .from("content_settings")
    .select("site_id, user_id, weekly_cadence, last_autopilot_run")
    .eq("autopilot_enabled", true);

  const settings = (rows ?? []) as SettingsRow[];
  let processed = 0;
  let skipped = 0;

  for (const row of settings) {
    if (!isDue(row)) {
      skipped += 1;
      continue;
    }

    const scope: SiteScope = { userId: row.user_id, siteId: row.site_id };

    // autopilot_enabled defaults to true, so without this the cron generates
    // paid articles for accounts that never started a trial. It also skips a
    // Studio site that is pending, archived or past its removal date. Checked
    // before the credit is reserved so a blocked site is not charged one.
    if (!(await hasGenerationEntitlement(client, scope))) {
      skipped += 1;
      continue;
    }

    // Reserve one of the site's credits atomically. Skips the site if its
    // monthly cap is hit.
    const { data: reserved } = await client.rpc("consume_article_credit", {
      _site_id: row.site_id,
    });
    if (!reserved) {
      skipped += 1;
      continue;
    }

    // Next due article: scheduled, lowest queue position then soonest date.
    const { data: nextRows } = await client
      .from("blogs")
      .select("*")
      .eq("site_id", row.site_id)
      .eq("user_id", row.user_id)
      .eq("status", "scheduled")
      .order("queue_position", { ascending: true, nullsFirst: false })
      .order("scheduled_date", { ascending: true })
      .limit(1);
    const blog = (nextRows ?? [])[0];
    if (!blog) {
      // Nothing to write — give the reserved credit back.
      await client.rpc("refund_article_credit", { _site_id: row.site_id });
      skipped += 1;
      continue;
    }

    try {
      await client.from("blogs").update({ status: "generating" }).eq("id", blog.id);
      const content = await generateArticle(client, scope, blog);
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
        .eq("site_id", row.site_id);
      processed += 1;
    } catch {
      // Roll the article back to scheduled and refund the reserved credit.
      await client.from("blogs").update({ status: "scheduled" }).eq("id", blog.id);
      await client.rpc("refund_article_credit", { _site_id: row.site_id });
      skipped += 1;
    }
  }

  return { processed, skipped };
}
