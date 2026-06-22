import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { generateBlogContent } from "@/lib/ai.functions";
import {
  consumeArticleCredit,
  ensureCreditAccount,
  purchaseCreditPackage,
} from "@/lib/credits.functions";
import { getStripeEnvironment } from "@/lib/stripe";

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
  name: string;
  tag: string | null;
  search_volume: number;
  traffic_estimate: number;
  intent: string | null;
  trend: string;
  source: "library" | "discovered";
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  brand_name: string | null;
  website_url: string | null;
  product_description: string | null;
  avatar_url: string | null;
}

export interface ContentSettings {
  id: string;
  user_id: string;
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
  credits_used: number;
  credits_total: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: string;
  price_id: string;
  product_id: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  environment: string;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  package: string | null;
  credits: number;
  amount_cents: number;
  created_at: string;
}

async function uid(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not authenticated");
  return data.user.id;
}

/* ---------------- Reads ---------------- */
export async function getProfile(): Promise<Profile | null> {
  const user_id = await uid();
  const { data } = await supabase.from("profiles").select("*").eq("user_id", user_id).maybeSingle();
  return data as Profile | null;
}

export async function getSettings(): Promise<ContentSettings | null> {
  const user_id = await uid();
  const { data } = await supabase.from("content_settings").select("*").eq("user_id", user_id).maybeSingle();
  return data as ContentSettings | null;
}

export async function getCredits(): Promise<CreditAccount | null> {
  const user_id = await uid();
  const { data } = await supabase.from("credit_accounts").select("*").eq("user_id", user_id).maybeSingle();
  return data as CreditAccount | null;
}

/** Thrown when a user has used all their monthly article credits. */
export class CreditsExhaustedError extends Error {
  constructor(message = "You've used all 30 articles this month.") {
    super(message);
    this.name = "CreditsExhaustedError";
  }
}

/** True when the account still has at least one article credit left. */
export function hasCreditsRemaining(credits: CreditAccount | null | undefined): boolean {
  if (!credits) return false;
  return credits.credits_used < credits.credits_total;
}

/** Credits left this cycle (never negative). */
export function creditsRemaining(credits: CreditAccount | null | undefined): number {
  if (!credits) return 0;
  return Math.max(0, credits.credits_total - credits.credits_used);
}

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

export async function listBlogs(status?: BlogStatus): Promise<Blog[]> {
  const user_id = await uid();
  let q = supabase.from("blogs").select("*").eq("user_id", user_id);
  if (status) q = q.eq("status", status);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Blog[];
}

export async function getBlog(id: string): Promise<Blog | null> {
  const { data } = await supabase.from("blogs").select("*").eq("id", id).maybeSingle();
  return data as Blog | null;
}

export async function listKeywords(source?: "library" | "discovered"): Promise<Keyword[]> {
  const user_id = await uid();
  let q = supabase.from("keywords").select("*").eq("user_id", user_id);
  if (source) q = q.eq("source", source);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Keyword[];
}

export async function listCreditTransactions(): Promise<CreditTransaction[]> {
  const user_id = await uid();
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as CreditTransaction[];
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

export async function createBlog(blog: Partial<Blog>): Promise<Blog> {
  const user_id = await uid();
  const { data, error } = await supabase
    .from("blogs")
    .insert({ ...blog, user_id } as TablesInsert<"blogs">)
    .select()
    .single();
  if (error) throw error;
  return data as Blog;
}

export async function prioritizeBlog(id: string): Promise<void> {
  const user_id = await uid();
  const { data } = await supabase
    .from("blogs")
    .select("id, queue_position")
    .eq("user_id", user_id)
    .eq("status", "scheduled");
  const min = Math.min(1, ...((data ?? []).map((b) => b.queue_position ?? 999)));
  await supabase.from("blogs").update({ queue_position: min - 1 }).eq("id", id);
}

export async function addOpportunityToQueue(opp: Blog): Promise<number> {
  const user_id = await uid();
  await supabase
    .from("blogs")
    .update({ status: "scheduled", scheduled_date: nextDate(), queue_position: 1 })
    .eq("id", opp.id);
  // return new estimated traffic increment
  const { data } = await supabase
    .from("credit_accounts")
    .select("id")
    .eq("user_id", user_id)
    .maybeSingle();
  void data;
  return opp.traffic_estimate;
}

export async function addKeyword(name: string, source: "library" | "discovered" = "library", extra: Partial<Keyword> = {}): Promise<Keyword> {
  const user_id = await uid();
  const { data, error } = await supabase
    .from("keywords")
    .insert({ user_id, name, source, ...extra })
    .select()
    .single();
  if (error) throw error;
  return data as Keyword;
}

export async function deleteKeyword(id: string): Promise<void> {
  const { error } = await supabase.from("keywords").delete().eq("id", id);
  if (error) throw error;
}

export async function updateSettings(patch: Partial<ContentSettings>): Promise<void> {
  const user_id = await uid();
  const { error } = await supabase.from("content_settings").update(patch).eq("user_id", user_id);
  if (error) throw error;
}

export async function updateProfile(patch: Partial<Profile>): Promise<void> {
  const user_id = await uid();
  const existing = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user_id)
    .maybeSingle();
  if (existing.data) {
    const { error } = await supabase.from("profiles").update(patch).eq("user_id", user_id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("profiles").insert({ ...patch, user_id });
    if (error) throw error;
  }
}

export async function purchaseCredits(pkg: string, credits: number, amountCents: number): Promise<void> {
  // Amounts and credit grants are validated and applied server-side; the
  // client cannot influence how many credits are added beyond the package id.
  void credits;
  void amountCents;
  await purchaseCreditPackage({ data: { packageId: pkg as "starter" | "growth" | "scale" } });
}

function nextDate(offsetDays = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/* ---------------- Onboarding (Rankvolt flow) ---------------- */

async function ensureAccountBase(
  user_id: string,
  profileInput: { brand_name: string; website_url: string; product_description: string },
  settingsInput: { tone: string; audience: string; brand_voice: string },
) {
  const existingProfile = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user_id)
    .maybeSingle();
  if (existingProfile.data) {
    await supabase.from("profiles").update(profileInput).eq("user_id", user_id);
  } else {
    await supabase.from("profiles").insert({ user_id, ...profileInput });
  }

  const existingSettings = await supabase
    .from("content_settings")
    .select("id")
    .eq("user_id", user_id)
    .maybeSingle();
  if (existingSettings.data) {
    await supabase.from("content_settings").update(settingsInput).eq("user_id", user_id);
  } else {
    await supabase.from("content_settings").insert({ user_id, ...settingsInput });
  }

  // Credit accounts are write-protected; create via the server function.
  await ensureCreditAccount();
}

function oppToBlogRow(o: OpportunityInput, user_id: string): TablesInsert<"blogs"> {
  return {
    user_id,
    title: o.title,
    description: o.description,
    keyword: o.keyword,
    traffic_estimate: Math.round(o.traffic_estimate),
    competition: o.competition,
    ai_signal: Math.round(o.ai_signal),
    status: "opportunity",
    tags: [],
  };
}

/** Step 2-4: persist the AI analysis and the inferred blog opportunities. */
export async function persistOnboarding(input: {
  full_name: string;
  business_name: string;
  website_url: string;
  analysis: WebsiteAnalysis;
}): Promise<Blog[]> {
  const user_id = await uid();
  const a = input.analysis;

  if (input.full_name.trim()) {
    await supabase.auth.updateUser({ data: { full_name: input.full_name.trim() } });
  }

  const productDescription = `${a.niche}. Services: ${a.services.join(", ")}. Audience: ${a.audience}.`;
  await ensureAccountBase(
    user_id,
    {
      brand_name: input.business_name.trim(),
      website_url: input.website_url.trim(),
      product_description: productDescription,
    },
    { tone: a.brand_tone, audience: a.audience, brand_voice: `Niche: ${a.niche}. Geo: ${a.geo}.` },
  );

  // Replace any prior discovered keywords / opportunity blogs for a clean slate.
  await supabase.from("keywords").delete().eq("user_id", user_id).eq("source", "discovered");
  if (a.keywords.length) {
    await supabase.from("keywords").insert(
      a.keywords.map((k) => ({
        user_id,
        name: k.name,
        source: "discovered" as const,
        tag: k.intent,
        search_volume: Math.round(k.search_volume),
        intent: k.intent,
        trend: k.trend,
      })),
    );
  }

  await supabase.from("blogs").delete().eq("user_id", user_id).eq("status", "opportunity");
  const rows = a.opportunities.map((o) => oppToBlogRow(o, user_id));
  const { data, error } = await supabase.from("blogs").insert(rows).select();
  if (error) throw error;
  return (data ?? []) as Blog[];
}

/**
 * Step 5: trial activation — turn the AI strategy into a fully scheduled
 * autopilot queue. Articles are auto-scheduled one per day so the engine has a
 * running plan the moment the user lands on the dashboard. Users can still
 * pause, reorder, or remove anything later.
 */
export async function activateTrial(opportunities: OpportunityInput[]): Promise<void> {
  const user_id = await uid();
  if (!opportunities.length) return;
  const rows = opportunities.map((o, i) => ({
    ...oppToBlogRow(o, user_id),
    status: "scheduled" as const,
    queue_position: i + 1,
    scheduled_date: nextDate(i + 1),
  }));
  const { error } = await supabase.from("blogs").insert(rows);
  if (error) throw error;
}

/** Toggle autopilot on/off and set how many articles it writes per week. */
export async function updateAutopilot(patch: {
  autopilot_enabled?: boolean;
  weekly_cadence?: number;
}): Promise<void> {
  const user_id = await uid();
  const { error } = await supabase.from("content_settings").update(patch).eq("user_id", user_id);
  if (error) throw error;
}

/* ---------------- Blog engine ---------------- */

/** Generate full article content for a blog and mark it finished. */
export async function generateBlogArticle(blog: Blog): Promise<Blog> {
  // Block up front if the monthly cap is already reached.
  const user_id = await uid();
  const credits = await getCredits();
  if (!hasCreditsRemaining(credits)) throw new CreditsExhaustedError();
  await updateBlog(blog.id, { status: "generating" });
  try {
    const result = await generateBlogContent({
      data: { title: blog.title, keyword: blog.keyword ?? undefined, description: blog.description },
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
    // Count the credit only after a successful generation. The DB function
    // enforces the hard cap atomically and never lets the total exceed 30.
    await supabase.rpc("consume_article_credit", { _user_id: user_id });
    return { ...blog, ...patch } as Blog;
  } catch (err) {
    await updateBlog(blog.id, { status: blog.status });
    throw err;
  }
}

/* ---------------- Seeding ---------------- */
export async function seedAccount(profileInput: {
  brand_name: string;
  website_url: string;
  product_description: string;
  keywords?: string[];
}): Promise<void> {
  const user_id = await uid();
  const existing = await supabase.from("profiles").select("id").eq("user_id", user_id).maybeSingle();
  if (existing.data) {
    await supabase
      .from("profiles")
      .update({
        brand_name: profileInput.brand_name,
        website_url: profileInput.website_url,
        product_description: profileInput.product_description,
      })
      .eq("user_id", user_id);
    return;
  }

  await supabase.from("profiles").insert({
    user_id,
    brand_name: profileInput.brand_name,
    website_url: profileInput.website_url,
    product_description: profileInput.product_description,
  });
  await supabase.from("content_settings").insert({ user_id });
  await supabase.from("credit_accounts").insert({ user_id, credits_used: 0, credits_total: 30 });

  const libraryKw = profileInput.keywords?.length
    ? profileInput.keywords
    : ["SEO automation", "AI content", "blog engine", "keyword research", "organic traffic"];
  await supabase.from("keywords").insert(
    libraryKw.map((name) => ({ user_id, name, source: "library", tag: "Library", trend: "Medium" })),
  );

  const discovered = SEED_KEYWORDS.map((k) => ({ ...k, user_id, source: "discovered" as const }));
  await supabase.from("keywords").insert(discovered);

  const opportunities = SEED_OPPORTUNITIES.map((o) => ({ ...o, user_id, status: "opportunity" as const }));
  const scheduled = SEED_SCHEDULED.map((s, i) => ({
    ...s,
    user_id,
    status: "scheduled" as const,
    queue_position: i + 1,
    scheduled_date: nextDate(i + 1),
  }));
  const finished = SEED_FINISHED.map((f) => ({ ...f, user_id, status: "finished" as const }));
  await supabase
    .from("blogs")
    .insert([...opportunities, ...scheduled, ...finished] as TablesInsert<"blogs">[]);
}

const SEED_KEYWORDS = [
  { name: "ai seo tools", tag: "High Competition", search_volume: 18000, traffic_estimate: 2400, intent: "Transactional", trend: "High" },
  { name: "content automation software", tag: "Medium Competition", search_volume: 9100, traffic_estimate: 1200, intent: "High Intent", trend: "High" },
  { name: "how to rank on chatgpt", tag: "Low Competition", search_volume: 4400, traffic_estimate: 980, intent: "Informational", trend: "High" },
  { name: "programmatic seo guide", tag: "Low Competition", search_volume: 3200, traffic_estimate: 720, intent: "Informational", trend: "Medium" },
  { name: "best ai blog writer", tag: "High Competition", search_volume: 12000, traffic_estimate: 1500, intent: "Transactional", trend: "High" },
  { name: "seo content calendar", tag: "Medium Competition", search_volume: 5400, traffic_estimate: 860, intent: "Informational", trend: "Medium" },
  { name: "long tail keyword strategy", tag: "Low Competition", search_volume: 2900, traffic_estimate: 640, intent: "Informational", trend: "Medium" },
  { name: "automated link building", tag: "High Competition", search_volume: 7600, traffic_estimate: 1100, intent: "High Intent", trend: "Low" },
];

const SEED_OPPORTUNITIES = [
  { title: "How AI Is Changing SEO in 2026", description: "Cover the shift to AI-cited search.", keyword: "ai seo 2026", traffic_estimate: 2400, competition: "Medium", ai_signal: 92 },
  { title: "The Complete Guide to Programmatic SEO", description: "Scale content with templates.", keyword: "programmatic seo", traffic_estimate: 1800, competition: "Low", ai_signal: 88 },
  { title: "Getting Cited by ChatGPT: A Playbook", description: "Optimize for AI answer engines.", keyword: "rank on chatgpt", traffic_estimate: 1500, competition: "Low", ai_signal: 95 },
  { title: "10 Keyword Research Tools Compared", description: "Roundup with pros and cons.", keyword: "keyword research tools", traffic_estimate: 3200, competition: "High", ai_signal: 79 },
  { title: "Building a Content Engine That Scales", description: "Systems for consistent output.", keyword: "content engine", traffic_estimate: 1100, competition: "Medium", ai_signal: 84 },
  { title: "Internal Linking Strategies That Work", description: "Boost rankings with structure.", keyword: "internal linking", traffic_estimate: 900, competition: "Low", ai_signal: 81 },
];

const SAMPLE_BODY = `## Introduction\n\nSearch is changing faster than ever. In this guide we break down exactly what works today and how to put it on autopilot.\n\n## Why It Matters\n\nOrganic traffic compounds. Every article you publish becomes a long-term asset that keeps bringing visitors.\n\n- Lower acquisition costs over time\n- Compounding authority\n- Citations from AI answer engines\n\n## The Strategy\n\nStart with intent-rich keywords, build a clear heading structure, and interlink related content so search engines understand your topical authority.\n\n## Conclusion\n\nConsistency wins. Ship quality content on a predictable cadence and the rankings follow.`;

const SEED_FINISHED = [
  { title: "Why Organic Traffic Beats Paid Ads", description: "The long-term case for SEO over paid acquisition.", body: SAMPLE_BODY, tags: ["High Traffic", "Low Competition"], keyword: "organic vs paid", seo_score: 91, traffic_estimate: 2100 },
  { title: "A Founder's Guide to SEO", description: "Everything early-stage founders need to know.", body: SAMPLE_BODY, tags: ["Evergreen"], keyword: "founder seo guide", seo_score: 88, traffic_estimate: 1400 },
  { title: "How to Structure a Blog Post for Rankings", description: "Heading hierarchy and on-page basics.", body: SAMPLE_BODY, tags: ["How-To", "High Intent"], keyword: "blog post structure", seo_score: 93, traffic_estimate: 1750 },
  { title: "Keyword Clustering Explained", description: "Group keywords for topical authority.", body: SAMPLE_BODY, tags: ["Advanced"], keyword: "keyword clustering", seo_score: 86, traffic_estimate: 980 },
  { title: "The Anatomy of a High-Converting Article", description: "Turn readers into customers.", body: SAMPLE_BODY, tags: ["Conversion"], keyword: "high converting article", seo_score: 90, traffic_estimate: 1300 },
  { title: "AI Writing Tools: A Practical Review", description: "What to use and when.", body: SAMPLE_BODY, tags: ["Tools", "High Traffic"], keyword: "ai writing tools", seo_score: 84, traffic_estimate: 2600 },
  { title: "Measuring SEO ROI the Right Way", description: "Metrics that actually matter.", body: SAMPLE_BODY, tags: ["Analytics"], keyword: "seo roi", seo_score: 87, traffic_estimate: 1120 },
  { title: "Topical Authority in Plain English", description: "Become the go-to source in your niche.", body: SAMPLE_BODY, tags: ["Strategy"], keyword: "topical authority", seo_score: 92, traffic_estimate: 1680 },
  { title: "From Zero to 10k Monthly Visitors", description: "A repeatable growth playbook.", body: SAMPLE_BODY, tags: ["Case Study", "High Traffic"], keyword: "grow blog traffic", seo_score: 89, traffic_estimate: 3100 },
];

const SEED_SCHEDULED = [
  { title: "The Future of Search Engines", description: "Where discovery is heading next.", tags: ["Trend"], keyword: "future of search", traffic_estimate: 1900 },
  { title: "Local SEO for Small Businesses", description: "Win your neighborhood searches.", tags: ["Local"], keyword: "local seo", traffic_estimate: 1400 },
  { title: "Schema Markup Made Simple", description: "Rich results without the headache.", tags: ["Technical"], keyword: "schema markup", traffic_estimate: 880 },
  { title: "Content Refreshing for Rankings", description: "Update old posts to climb the SERP.", tags: ["Maintenance"], keyword: "content refresh", traffic_estimate: 760 },
  { title: "Voice Search Optimization", description: "Optimize for spoken queries.", tags: ["Emerging"], keyword: "voice search", traffic_estimate: 1020 },
  { title: "E-E-A-T for Modern SEO", description: "Experience, expertise, authority, trust.", tags: ["Quality"], keyword: "eeat seo", traffic_estimate: 1320 },
  { title: "Building Backlinks Without Spam", description: "White-hat link strategies.", tags: ["Off-Page"], keyword: "white hat backlinks", traffic_estimate: 1150 },
  { title: "Mobile-First Indexing Checklist", description: "Make sure mobile is covered.", tags: ["Technical"], keyword: "mobile first indexing", traffic_estimate: 670 },
  { title: "Search Intent Decoded", description: "Match content to what users want.", tags: ["Strategy"], keyword: "search intent", traffic_estimate: 1480 },
  { title: "The Pillar-Cluster Model", description: "Organize content for authority.", tags: ["Structure"], keyword: "pillar cluster", traffic_estimate: 940 },
  { title: "SEO Copywriting Fundamentals", description: "Write for humans and bots.", tags: ["Writing"], keyword: "seo copywriting", traffic_estimate: 1260 },
  { title: "Featured Snippets Strategy", description: "Win position zero.", tags: ["SERP"], keyword: "featured snippets", traffic_estimate: 1390 },
  { title: "International SEO Basics", description: "Go global with hreflang.", tags: ["Global"], keyword: "international seo", traffic_estimate: 720 },
  { title: "Page Speed and Core Web Vitals", description: "Faster pages, better rankings.", tags: ["Technical"], keyword: "core web vitals", traffic_estimate: 1010 },
  { title: "Content Gap Analysis Guide", description: "Find what competitors rank for.", tags: ["Research"], keyword: "content gap analysis", traffic_estimate: 850 },
  { title: "Evergreen vs Trending Content", description: "Balance your content mix.", tags: ["Planning"], keyword: "evergreen content", traffic_estimate: 990 },
];