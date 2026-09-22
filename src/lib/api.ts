import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { generateBlogContent } from "@/lib/ai.functions";
import { ensureCreditAccount } from "@/lib/credits.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { DASHBOARD_IDEAS, TRACKED_KEYWORDS } from "@/lib/site-meta";
import type { OnboardingDraft } from "@/lib/mock/store";

export type BlogStatus = "opportunity" | "scheduled" | "generating" | "finished";

export interface OpportunityInput {
  title: string;
  description: string;
  keyword: string;
  traffic_estimate: number;
  competition: string;
  ai_signal: number;
}

export interface WebsiteAnalysis {
  niche: string;
  services: string[];
  audience: string;
  geo: string;
  brand_tone: string;
  competitors: string[];
  existing_content: string;
  internal_linking: string;
  missing_opportunities: string[];
  semantic_clusters: string[];
  ai_visibility: string[];
  keywords: { name: string; search_volume: number; intent: string; trend: string }[];
  opportunities: OpportunityInput[];
}

export interface Blog {
  id: string;
  user_id: string;
  site_id: string;
  title: string;
  description: string;
  body: string;
  status: BlogStatus;
  tags: string[];
  keyword: string | null;
  seo_score: number;
  traffic_estimate: number;
  competition: string | null;
  ai_signal: number;
  scheduled_date: string | null;
  queue_position: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Keyword {
  id: string;
  user_id: string;
  site_id: string;
  name: string;
  tag: string | null;
  search_volume: number;
  traffic_estimate: number;
  intent: string | null;
  trend: string;
  source: "library" | "discovered";
  created_at: string;
}

/**
 * One site on the account: its brand, its website, and where it stands with
 * billing. Stored in `profiles` — see the Studio migration for why.
 */
export interface Site {
  id: string;
  user_id: string;
  brand_name: string | null;
  website_url: string | null;
  product_description: string | null;
  avatar_url: string | null;
  /** `primary` came from onboarding; `studio` sites are billed one by one. */
  kind: "primary" | "studio";
  status: "pending" | "active" | "archived";
  billed_from: string | null;
  /** A scheduled removal: the site runs until then. */
  removes_at: string | null;
  archived_at: string | null;
  created_at: string;
}

/** The brand fields a member may edit on a site. */
export type SiteDetails = Pick<
  Site,
  "brand_name" | "website_url" | "product_description" | "avatar_url"
>;

/** @deprecated A site is what a profile always was; prefer `Site`. */
export type Profile = Site;

export interface ContentSettings {
  id: string;
  user_id: string;
  site_id: string;
  tone: string;
  writing_style: string;
  audience: string;
  brand_voice: string;
  status_online: boolean;
  autopilot_enabled: boolean;
  weekly_cadence: number;
  last_autopilot_run: string | null;
}

export interface CreditAccount {
  id: string;
  user_id: string;
  site_id: string;
  credits_used: number;
  credits_total: number;
  period_end?: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: string;
  price_id: string;
  product_id: string;
  current_period_start?: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  /** Units on the Studio line: the sites billed on top of the plan. */
  studio_sites: number;
  environment: string;
  created_at: string;
}

async function uid(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");
  return data.user.id;
}

/* ---------------- Sites ---------------- */

/** Every site on the account, whatever its state. RLS limits it to the caller's own. */
export async function listSites(): Promise<Site[]> {
  const user_id = await uid();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Site[];
}

export async function getSite(siteId: string): Promise<Site | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", siteId).maybeSingle();
  return data as Site | null;
}

/** Brand fields only: kind, status and billing dates belong to Studio's server side. */
export async function updateSite(siteId: string, patch: Partial<SiteDetails>): Promise<void> {
  const { error } = await supabase.from("profiles").update(patch).eq("id", siteId);
  if (error) throw error;
}

/**
 * The account's first site, created on the spot the first time onboarding
 * commits. A member can create exactly one site this way — the primary — and
 * the database refuses a second; every other site comes through Studio.
 */
async function ensurePrimarySite(details: SiteDetails): Promise<string> {
  const user_id = await uid();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user_id)
    .eq("kind", "primary")
    .maybeSingle();
  if (existing) {
    await updateSite(existing.id, details);
    return existing.id;
  }
  const { data, error } = await supabase
    .from("profiles")
    .insert({ user_id, ...details })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

/* ---------------- Reads ---------------- */

export async function getSettings(siteId: string): Promise<ContentSettings | null> {
  const { data } = await supabase
    .from("content_settings")
    .select("*")
    .eq("site_id", siteId)
    .maybeSingle();
  return data as ContentSettings | null;
}

export async function getCredits(siteId: string): Promise<CreditAccount | null> {
  const { data } = await supabase
    .from("credit_accounts")
    .select("*")
    .eq("site_id", siteId)
    .maybeSingle();
  return data as CreditAccount | null;
}

/** Every site's credit account at once, for Studio's overview. */
export async function listCreditAccounts(): Promise<CreditAccount[]> {
  const user_id = await uid();
  const { data, error } = await supabase.from("credit_accounts").select("*").eq("user_id", user_id);
  if (error) throw error;
  return (data ?? []) as CreditAccount[];
}

/** Thrown when a site has used all its monthly article credits. */
export class CreditsExhaustedError extends Error {
  constructor(message = "You've used all 30 articles this month.") {
    super(message);
    this.name = "CreditsExhaustedError";
  }
}

/** True when the site still has at least one article credit left. */
export function hasCreditsRemaining(credits: CreditAccount | null | undefined): boolean {
  if (!credits) return false;
  return credits.credits_used < credits.credits_total;
}

/** Credits left this cycle (never negative). */
export function creditsRemaining(credits: CreditAccount | null | undefined): number {
  if (!credits) return 0;
  return Math.max(0, credits.credits_total - credits.credits_used);
}

/** The account's subscription. One per account, however many sites it pays for. */
export async function getSubscription(): Promise<Subscription | null> {
  const user_id = await uid();
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .eq("environment", getStripeEnvironment())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as Subscription | null;
}

export async function listBlogs(siteId: string, status?: BlogStatus): Promise<Blog[]> {
  let q = supabase.from("blogs").select("*").eq("site_id", siteId);
  if (status) q = q.eq("status", status);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Blog[];
}

/** Status of every article on the account, for Studio's per-site counts. */
export async function listBlogStatuses(): Promise<
  Array<Pick<Blog, "site_id" | "status" | "updated_at">>
> {
  const user_id = await uid();
  const { data, error } = await supabase
    .from("blogs")
    .select("site_id, status, updated_at")
    .eq("user_id", user_id);
  if (error) throw error;
  return (data ?? []) as Array<Pick<Blog, "site_id" | "status" | "updated_at">>;
}

/** Every site's content settings, for Studio's autopilot column. */
export async function listSettings(): Promise<ContentSettings[]> {
  const user_id = await uid();
  const { data, error } = await supabase
    .from("content_settings")
    .select("*")
    .eq("user_id", user_id);
  if (error) throw error;
  return (data ?? []) as ContentSettings[];
}

export async function getBlog(id: string): Promise<Blog | null> {
  const { data } = await supabase.from("blogs").select("*").eq("id", id).maybeSingle();
  return data as Blog | null;
}

export async function listKeywords(
  siteId: string,
  source?: "library" | "discovered",
): Promise<Keyword[]> {
  let q = supabase.from("keywords").select("*").eq("site_id", siteId);
  if (source) q = q.eq("source", source);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Keyword[];
}

/* ---------------- Writes ---------------- */
export async function updateBlog(id: string, patch: Partial<Blog>): Promise<void> {
  const { error } = await supabase.from("blogs").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteBlog(id: string): Promise<void> {
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw error;
}

export async function createBlog(siteId: string, blog: Partial<Blog>): Promise<Blog> {
  const user_id = await uid();
  const { data, error } = await supabase
    .from("blogs")
    .insert({ ...blog, user_id, site_id: siteId } as TablesInsert<"blogs">)
    .select()
    .single();
  if (error) throw error;
  return data as Blog;
}

export async function prioritizeBlog(siteId: string, id: string): Promise<void> {
  const { data } = await supabase
    .from("blogs")
    .select("id, queue_position")
    .eq("site_id", siteId)
    .eq("status", "scheduled");
  const min = Math.min(1, ...(data ?? []).map((b) => b.queue_position ?? 999));
  await supabase
    .from("blogs")
    .update({ queue_position: min - 1 })
    .eq("id", id);
}

/** Moves an idea into the autopilot queue. Returns the traffic it adds to the plan. */
export async function addOpportunityToQueue(opp: Blog): Promise<number> {
  await supabase
    .from("blogs")
    .update({ status: "scheduled", scheduled_date: nextDate(), queue_position: 1 })
    .eq("id", opp.id);
  return opp.traffic_estimate;
}

export async function addKeyword(
  siteId: string,
  name: string,
  source: "library" | "discovered" = "library",
  extra: Partial<Keyword> = {},
): Promise<Keyword> {
  const user_id = await uid();
  const { data, error } = await supabase
    .from("keywords")
    .insert({ ...extra, user_id, site_id: siteId, name, source })
    .select()
    .single();
  if (error) throw error;
  return data as Keyword;
}

export async function deleteKeyword(id: string): Promise<void> {
  const { error } = await supabase.from("keywords").delete().eq("id", id);
  if (error) throw error;
}

export async function updateSettings(
  siteId: string,
  patch: Partial<ContentSettings>,
): Promise<void> {
  const { error } = await supabase.from("content_settings").update(patch).eq("site_id", siteId);
  if (error) throw error;
}

function nextDate(offsetDays = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/* ---------------- Onboarding (Rankbox flow) ---------------- */

/**
 * Saves a confirmed plan onto a site — brand, content settings, the keyword
 * set and the content-gap articles — so the dashboard and autopilot run on it.
 *
 * Onboarding calls it without a site: the account's primary site is created
 * (or updated) on the way. Studio calls it with the site its server side has
 * just paid for, so a new client site starts with a plan exactly like the
 * first one did.
 *
 * The first DASHBOARD_IDEAS articles become dashboard opportunities; the rest
 * are queued as `scheduled`, one a day in plan order, which is exactly what
 * runAutopilot writes from. Mirrors commitOnboarding in src/lib/mock/store.ts.
 *
 * Safe to retry: keywords and not-yet-written articles for the same keywords
 * are replaced rather than duplicated, and nothing else on the site is
 * touched. autopilot_enabled is left as is — the engine already skips sites
 * without an entitlement. Returns the site it wrote to.
 */
export async function commitOnboardingDraft(d: OnboardingDraft, siteId?: string): Promise<string> {
  const user_id = await uid();
  const details: SiteDetails = {
    brand_name: d.brandName.trim(),
    website_url: d.url.trim(),
    product_description: d.description.trim(),
    avatar_url: d.logoUrl,
  };
  let site_id: string;
  if (siteId) {
    await updateSite(siteId, details);
    site_id = siteId;
  } else {
    site_id = await ensurePrimarySite(details);
  }

  const settings = {
    ...(d.brandTone.trim() ? { tone: d.brandTone.trim() } : {}),
    ...(d.audience.trim() ? { audience: d.audience.trim() } : {}),
    brand_voice: `Niche: ${d.niche}. Geo: ${d.geo}.`,
  };
  const existingSettings = await supabase
    .from("content_settings")
    .select("id")
    .eq("site_id", site_id)
    .maybeSingle();
  const settingsWrite = existingSettings.data
    ? await supabase.from("content_settings").update(settings).eq("site_id", site_id)
    : await supabase.from("content_settings").insert({ user_id, site_id, ...settings });
  if (settingsWrite.error) throw settingsWrite.error;
  // Credit accounts are write-protected; the primary's is created by the
  // server, and a Studio site's by the billing sync that made it live.
  if (!siteId) await ensureCreditAccount({ data: { siteId: site_id } });

  const keywordNames = d.keywords.map((k) => k.name);
  if (keywordNames.length) {
    const cleared = await supabase
      .from("keywords")
      .delete()
      .eq("site_id", site_id)
      .in("name", keywordNames);
    if (cleared.error) throw cleared.error;
    const inserted = await supabase.from("keywords").insert(
      d.keywords.map((k, i) => ({
        user_id,
        site_id,
        name: k.name,
        source: i < TRACKED_KEYWORDS ? ("library" as const) : ("discovered" as const),
        tag: k.intent,
        search_volume: Math.round(k.search_volume),
        traffic_estimate: Math.round(k.search_volume * 0.14),
        intent: k.intent,
        trend: k.trend,
      })),
    );
    if (inserted.error) throw inserted.error;
  }

  const plannedKeywords = [...new Set(d.titles.map((t) => t.keyword))];
  if (plannedKeywords.length) {
    // Only unwritten articles: anything generated keeps its body.
    const cleared = await supabase
      .from("blogs")
      .delete()
      .eq("site_id", site_id)
      .in("status", ["opportunity", "scheduled"])
      .eq("body", "")
      .in("keyword", plannedKeywords);
    if (cleared.error) throw cleared.error;
    const rows: TablesInsert<"blogs">[] = d.titles.map((t, i) => {
      const slot = i - DASHBOARD_IDEAS + 1;
      const queued = slot >= 1;
      return {
        user_id,
        site_id,
        title: t.title,
        description: t.description,
        keyword: t.keyword,
        traffic_estimate: Math.round(t.traffic_estimate),
        competition: t.competition,
        ai_signal: Math.round(t.ai_signal),
        tags: [],
        status: queued ? "scheduled" : "opportunity",
        queue_position: queued ? slot : null,
        scheduled_date: queued ? nextDate(slot) : null,
      };
    });
    const inserted = await supabase.from("blogs").insert(rows);
    if (inserted.error) throw inserted.error;
  }
  return site_id;
}

/** Toggle autopilot on/off and set how many articles it writes per week. */
export async function updateAutopilot(
  siteId: string,
  patch: {
    autopilot_enabled?: boolean;
    weekly_cadence?: number;
  },
): Promise<void> {
  const { error } = await supabase.from("content_settings").update(patch).eq("site_id", siteId);
  if (error) throw error;
}

/* ---------------- Blog engine ---------------- */

/**
 * Generate full article content for a blog and mark it finished.
 *
 * The credit is spent by the server, in the same call that writes the
 * article — reserved before, refunded if the writing fails — so there is no
 * path that writes without spending. The check here only spares a round trip
 * when the site is already out.
 */
export async function generateBlogArticle(siteId: string, blog: Blog): Promise<Blog> {
  const credits = await getCredits(siteId);
  if (!hasCreditsRemaining(credits)) throw new CreditsExhaustedError();
  await updateBlog(blog.id, { status: "generating" });
  try {
    const result = await generateBlogContent({
      data: {
        siteId,
        title: blog.title,
        keyword: blog.keyword ?? undefined,
        description: blog.description,
        blogId: blog.id,
      },
    });
    const patch: Partial<Blog> = {
      title: result.title || blog.title,
      body: result.body,
      description: result.description || blog.description,
      seo_score: result.seo_score,
      traffic_estimate: result.traffic_estimate || blog.traffic_estimate,
      tags: result.tags ?? [],
      status: "finished",
    };
    await updateBlog(blog.id, patch);
    return { ...blog, ...patch } as Blog;
  } catch (err) {
    await updateBlog(blog.id, { status: blog.status });
    throw err;
  }
}
