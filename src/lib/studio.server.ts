/**
 * Studio billing: adding, removing, keeping and restoring sites. Each is one
 * change to the Studio line on the member's single Stripe subscription —
 * never a second subscription, so there is still one invoice and one card.
 *
 * The rules, most important first:
 *  - A site exists only once it is paid for. It is created `pending`, the
 *    prorated share of its first month is charged at once (`always_invoice`
 *    with `error_if_incomplete`), and only a charge that went through makes it
 *    live. A declined card leaves no site behind.
 *  - Removing never refunds and never cuts a site off early. The Studio line
 *    drops by one from the next invoice, and the site runs to the end of the
 *    period already paid for; changing your mind before then costs nothing.
 *  - One change at a time per owner (studio_acquire_lock): each reads the
 *    quantity Stripe bills and writes it back, and two interleaved would lose
 *    a site's billing.
 *  - The plan must be paid, current and not ending (studioBlockFor). A trial
 *    can be converted on the spot (activatePlanNow) — never extended to more
 *    sites.
 *
 * Every change finishes by running the same sync the webhook runs, so the
 * site is live, credited and in the paid pools before the dialog closes.
 */
import type Stripe from "stripe";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";
import { STUDIO, STUDIO_PRICE_LOOKUP_KEY } from "@/data/pricing";
import { normalizeDomain } from "@/lib/exchange/domain";
import { loadOwnedSite } from "@/lib/sites.server";
import { createStripeClient, getServerStripeEnv, type StripeEnv } from "@/lib/stripe.server";
import {
  allowanceFor,
  monthlyTotal,
  periodRemaining,
  STUDIO_BLOCK_COPY,
  studioBlockFor,
  type Allowance,
  type StudioBlock,
} from "@/lib/studio";
import {
  itemFacts,
  syncSubscriptionFromCheckout,
  type SubscriptionLike,
} from "@/lib/subscriptions.server";

/** A refusal meant for the member, worded to be shown as it is. */
export class StudioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudioError";
  }
}

const NOT_CONFIGURED =
  "Studio isn't switched on for this account yet. Contact support and we'll set it up.";

/** Long enough for a Stripe charge; short enough that a crashed request doesn't block the owner. */
const LOCK_SECONDS = 90;

/** How old a quoted proration date may be and still be honored at checkout. */
const QUOTE_TTL_SECONDS = 30 * 60;

type SubscriptionRow = Tables<"subscriptions">;

async function withStudioLock<T>(userId: string, fn: () => Promise<T>): Promise<T> {
  const { data, error } = await supabaseAdmin.rpc("studio_acquire_lock", {
    _user_id: userId,
    _seconds: LOCK_SECONDS,
  });
  if (error) throw new Error(error.message);
  if (!data) {
    throw new StudioError(
      "Another change to your sites is still going through. Try again in a moment.",
    );
  }
  try {
    return await fn();
  } finally {
    await supabaseAdmin.rpc("studio_release_lock", { _user_id: userId });
  }
}

async function latestRow(userId: string, env: StripeEnv): Promise<SubscriptionRow | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("environment", env)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

interface Billing {
  env: StripeEnv;
  stripe: Stripe;
  subscription: SubscriptionLike;
  facts: ReturnType<typeof itemFacts>;
  /** Null when no Studio price exists in this Stripe account yet. */
  studioPrice: Stripe.Price | null;
  /** From Stripe itself, which can be fresher than our row. */
  block: StudioBlock | null;
}

/** The member's live subscription and the Studio price, straight from Stripe. */
async function loadBilling(userId: string): Promise<Billing> {
  const env = getServerStripeEnv();
  const row = await latestRow(userId, env);
  if (!row) throw new StudioError(STUDIO_BLOCK_COPY.no_plan);
  const stripe = createStripeClient(env);
  const [subscription, prices] = await Promise.all([
    stripe.subscriptions.retrieve(row.stripe_subscription_id, {
      expand: ["default_payment_method"],
    }),
    stripe.prices.list({ lookup_keys: [STUDIO_PRICE_LOOKUP_KEY], active: true, limit: 1 }),
  ]);
  return {
    env,
    stripe,
    subscription: subscription as SubscriptionLike,
    facts: itemFacts(subscription as SubscriptionLike),
    studioPrice: prices.data[0] ?? null,
    block: studioBlockFor(subscription),
  };
}

/** Throws unless the plan can take a new or returning site right now. */
function requireOpen(billing: Billing): Stripe.Price {
  if (billing.block) throw new StudioError(STUDIO_BLOCK_COPY[billing.block]);
  if (!billing.studioPrice) throw new StudioError(NOT_CONFIGURED);
  return billing.studioPrice;
}

/** The Studio line set to `quantity`: updated in place, added, or removed at zero. */
function studioItems(billing: Billing, quantity: number) {
  const item = billing.facts.studioItem;
  if (item) return quantity > 0 ? [{ id: item.id, quantity }] : [{ id: item.id, deleted: true }];
  if (quantity <= 0 || !billing.studioPrice) return [];
  return [{ price: billing.studioPrice.id, quantity }];
}

const isoOf = (seconds: number | null | undefined) =>
  seconds ? new Date(seconds * 1000).toISOString() : null;

/**
 * The moment prorations are computed from. A quote's own date is honored for
 * half an hour, so the charge is exactly the amount the member was shown;
 * anything older, or outside the current period, is recomputed from now.
 */
function prorationDateFor(requested: number | undefined, billing: Billing): number {
  const now = Math.floor(Date.now() / 1000);
  const start = billing.facts.periodStart ?? 0;
  if (!requested || requested > now || now - requested > QUOTE_TTL_SECONDS || requested < start) {
    return now;
  }
  return requested;
}

/** A failure Stripe has definitely decided: the card, or the request itself. Nothing was charged. */
function isDefinitive(err: unknown): boolean {
  const e = err as { type?: string; statusCode?: number } | null;
  return (
    e?.type === "StripeCardError" ||
    e?.type === "StripeInvalidRequestError" ||
    e?.statusCode === 402 ||
    e?.statusCode === 400
  );
}

function declineMessage(err: unknown): string {
  const e = err as { type?: string; message?: string; raw?: { message?: string } } | null;
  const detail = e?.raw?.message ?? e?.message;
  if (e?.type === "StripeCardError" || /card|payment/i.test(detail ?? "")) {
    return `Your card was declined${detail ? `: ${detail.replace(/\.$/, "")}` : ""}. Update it in billing and try again.`;
  }
  return detail ?? "Stripe refused the change. Nothing was charged.";
}

/**
 * Adds one unit to the Studio line and charges its prorated share now. The
 * idempotency key is the site and the moment its billing began, so a retried
 * request can never charge twice, and a later restore of the same site is a
 * new charge rather than a replay of an old one.
 */
async function chargeForOneMore(
  billing: Billing,
  siteId: string,
  billedFrom: string,
  prorationDate: number | undefined,
  undo: () => Promise<void>,
): Promise<SubscriptionLike> {
  try {
    const updated = await billing.stripe.subscriptions.update(
      billing.subscription.id,
      {
        items: studioItems(billing, billing.facts.studioSites + 1),
        proration_behavior: "always_invoice",
        proration_date: prorationDateFor(prorationDate, billing),
        payment_behavior: "error_if_incomplete",
      },
      { idempotencyKey: `studio-add-${siteId}-${Date.parse(billedFrom)}` },
    );
    return updated as SubscriptionLike;
  } catch (err) {
    if (isDefinitive(err)) {
      await undo();
      throw new StudioError(declineMessage(err));
    }
    // A timeout or a Stripe outage: the charge may or may not have happened.
    // The site is left pending — Stripe's webhook brings it up if it was paid
    // for, and the next sync discards it if it wasn't.
    console.error("[studio] charge outcome unknown for site", siteId, err);
    throw new StudioError(
      "We couldn't confirm the payment. If it went through, the site will appear in Studio within a few minutes.",
    );
  }
}

/** The card the next charge lands on, for the confirm step to name. */
async function cardOf(billing: Billing): Promise<{ brand: string; last4: string } | null> {
  const fromPm = (pm: unknown) => {
    const card = (pm as Stripe.PaymentMethod | null)?.card;
    return card ? { brand: card.brand, last4: card.last4 } : null;
  };
  const own = fromPm(billing.subscription.default_payment_method);
  if (own) return own;
  const customerId =
    typeof billing.subscription.customer === "string"
      ? billing.subscription.customer
      : billing.subscription.customer.id;
  try {
    const customer = await billing.stripe.customers.retrieve(customerId, {
      expand: ["invoice_settings.default_payment_method"],
    });
    if ("deleted" in customer && customer.deleted) return null;
    return fromPm((customer as Stripe.Customer).invoice_settings?.default_payment_method);
  } catch {
    return null;
  }
}

/* ── Quote ──────────────────────────────────────────────────────────── */

export interface StudioQuote {
  /** Why a site can't be added right now; null when it can. */
  block: StudioBlock | "not_configured" | null;
  message: string | null;
  pricePerSite: number;
  /** What adding one site charges today, from Stripe's own preview. */
  dueToday: number | null;
  /** Pass back when adding, so the charge matches this quote to the cent. */
  prorationDate: number | null;
  renewsAt: string | null;
  /** What the new site gets for the rest of this period. */
  allowance: Allowance;
  /** Studio sites billed today. */
  studioSites: number;
  /** The monthly bill once this site is added. */
  monthlyAfter: number;
  card: { brand: string; last4: string } | null;
}

/**
 * What adding one site costs today and from next month, previewed by Stripe
 * rather than computed here, so the number shown is the number charged.
 */
export async function getStudioQuote(userId: string): Promise<StudioQuote> {
  const blocked = (block: StudioQuote["block"], message: string, studioSites = 0): StudioQuote => ({
    block,
    message,
    pricePerSite: STUDIO.monthlyPerSite,
    dueToday: null,
    prorationDate: null,
    renewsAt: null,
    allowance: allowanceFor(1),
    studioSites,
    monthlyAfter: monthlyTotal(studioSites + 1),
    card: null,
  });

  const row = await latestRow(userId, getServerStripeEnv());
  const rowBlock = studioBlockFor(row);
  if (rowBlock) return blocked(rowBlock, STUDIO_BLOCK_COPY[rowBlock], row?.studio_sites ?? 0);

  const billing = await loadBilling(userId);
  const studioSites = billing.facts.studioSites;
  if (billing.block) {
    return blocked(billing.block, STUDIO_BLOCK_COPY[billing.block], studioSites);
  }
  if (!billing.studioPrice) return blocked("not_configured", NOT_CONFIGURED, studioSites);

  const prorationDate = Math.floor(Date.now() / 1000);
  const customer =
    typeof billing.subscription.customer === "string"
      ? billing.subscription.customer
      : billing.subscription.customer.id;
  const [preview, card] = await Promise.all([
    billing.stripe.invoices.createPreview({
      customer,
      subscription: billing.subscription.id,
      subscription_details: {
        items: studioItems(billing, studioSites + 1),
        proration_behavior: "always_invoice",
        proration_date: prorationDate,
      },
    }),
    cardOf(billing),
  ]);
  // Only the proration lines are charged today; the rest is next month's invoice.
  const prorationCents = (preview.lines?.data ?? [])
    .filter(
      (l) =>
        l.parent?.subscription_item_details?.proration || l.parent?.invoice_item_details?.proration,
    )
    .reduce((sum, l) => sum + (l.amount ?? 0), 0);

  const unit = billing.studioPrice.unit_amount;
  const periodStart = isoOf(billing.facts.periodStart);
  const renewsAt = isoOf(billing.facts.periodEnd);
  const pricePerSite = unit != null ? unit / 100 : STUDIO.monthlyPerSite;
  return {
    block: null,
    message: null,
    pricePerSite,
    dueToday: Math.max(0, prorationCents) / 100,
    prorationDate,
    renewsAt,
    allowance: allowanceFor(periodRemaining(periodStart, renewsAt, prorationDate * 1000)),
    studioSites,
    monthlyAfter: monthlyTotal(studioSites + 1),
    card,
  };
}

/* ── Add ────────────────────────────────────────────────────────────── */

export interface NewSiteInput {
  url: string;
  brandName: string;
  description: string;
  logoUrl: string | null;
  prorationDate?: number;
}

/** A domain already on the account, live or archived, can't be added twice. */
async function assertDomainFree(userId: string, domain: string, exceptSiteId?: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, website_url, status")
    .eq("user_id", userId)
    .neq("status", "pending");
  if (error) throw new Error(error.message);
  const clash = (data ?? []).find(
    (s) => s.id !== exceptSiteId && s.website_url && normalizeDomain(s.website_url) === domain,
  );
  if (!clash) return;
  throw new StudioError(
    clash.status === "archived"
      ? `${domain} is in your archived sites. Restore it from Studio to keep its articles.`
      : `${domain} is already one of your sites.`,
  );
}

export async function addStudioSite(
  userId: string,
  input: NewSiteInput,
): Promise<{ siteId: string }> {
  const domain = normalizeDomain(input.url);
  if (!domain) throw new StudioError("Enter the site's address, like example.com.");
  if (!input.brandName.trim()) throw new StudioError("Give the site a brand name.");

  return withStudioLock(userId, async () => {
    const billing = await loadBilling(userId);
    requireOpen(billing);
    await assertDomainFree(userId, domain);

    const billedFrom = new Date().toISOString();
    const { data: site, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        user_id: userId,
        kind: "studio",
        status: "pending",
        billed_from: billedFrom,
        brand_name: input.brandName.trim(),
        website_url: input.url.trim(),
        product_description: input.description.trim(),
        avatar_url: input.logoUrl,
      })
      .select("id")
      .single();
    if (error || !site) throw new Error(error?.message ?? "Couldn't create the site.");

    const updated = await chargeForOneMore(
      billing,
      site.id,
      billedFrom,
      input.prorationDate,
      async () => {
        await supabaseAdmin.from("profiles").delete().eq("id", site.id).eq("status", "pending");
      },
    );

    await supabaseAdmin.from("profiles").update({ status: "active" }).eq("id", site.id);
    await syncSubscriptionFromCheckout(updated, billing.env);
    return { siteId: site.id };
  });
}

/* ── Restore ────────────────────────────────────────────────────────── */

/** Brings an archived site back, with everything it had. Charged like a new one. */
export async function restoreStudioSite(
  userId: string,
  siteId: string,
  prorationDate?: number,
): Promise<{ siteId: string }> {
  return withStudioLock(userId, async () => {
    const site = await loadOwnedSite(userId, siteId);
    if (site.kind !== "studio" || site.status !== "archived") {
      throw new StudioError("Only an archived Studio site can be restored.");
    }
    const billing = await loadBilling(userId);
    requireOpen(billing);
    const domain = site.website_url ? normalizeDomain(site.website_url) : "";
    if (domain) await assertDomainFree(userId, domain, site.id);

    const billedFrom = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ status: "pending", billed_from: billedFrom, removes_at: null, archived_at: null })
      .eq("id", site.id)
      .eq("status", "archived");
    if (error) throw new Error(error.message);

    const updated = await chargeForOneMore(
      billing,
      site.id,
      billedFrom,
      prorationDate,
      async () => {
        await supabaseAdmin
          .from("profiles")
          .update({
            status: "archived",
            billed_from: site.billed_from,
            archived_at: site.archived_at ?? new Date().toISOString(),
          })
          .eq("id", site.id)
          .eq("status", "pending");
      },
    );

    await supabaseAdmin.from("profiles").update({ status: "active" }).eq("id", site.id);
    await syncSubscriptionFromCheckout(updated, billing.env);
    return { siteId: site.id };
  });
}

/* ── Remove / keep ──────────────────────────────────────────────────── */

/**
 * Schedules a Studio site to leave at the end of the period already paid for.
 * The Studio line drops now, with no proration, so the next invoice is one
 * site lighter and nothing is refunded.
 */
export async function removeStudioSite(
  userId: string,
  siteId: string,
): Promise<{ removesAt: string }> {
  return withStudioLock(userId, async () => {
    const site = await loadOwnedSite(userId, siteId);
    if (site.kind !== "studio") {
      throw new StudioError(
        "This site is your plan itself. To stop it, cancel your plan in billing.",
      );
    }
    if (site.status !== "active") throw new StudioError("This site isn't active.");
    if (site.removes_at) return { removesAt: site.removes_at };

    const billing = await loadBilling(userId);
    const removesAt = isoOf(billing.facts.periodEnd) ?? new Date().toISOString();

    // Ours first, so a webhook racing this change sees exactly this site leaving.
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ removes_at: removesAt })
      .eq("id", site.id)
      .is("removes_at", null);
    if (error) throw new Error(error.message);

    let updated = billing.subscription;
    if (billing.facts.studioSites > 0) {
      try {
        updated = (await billing.stripe.subscriptions.update(billing.subscription.id, {
          items: studioItems(billing, billing.facts.studioSites - 1),
          proration_behavior: "none",
        })) as SubscriptionLike;
      } catch (err) {
        await supabaseAdmin.from("profiles").update({ removes_at: null }).eq("id", site.id);
        throw new StudioError(declineMessage(err));
      }
    }
    await syncSubscriptionFromCheckout(updated, billing.env);
    return { removesAt };
  });
}

/**
 * Takes back a scheduled removal. The period is already paid for, so the
 * Studio line goes back up with no proration: nothing is charged until the
 * next invoice, exactly as if the site had never been removed.
 */
export async function keepStudioSite(userId: string, siteId: string): Promise<{ ok: true }> {
  return withStudioLock(userId, async () => {
    const site = await loadOwnedSite(userId, siteId);
    if (site.kind !== "studio" || site.status !== "active" || !site.removes_at) {
      throw new StudioError("This site isn't scheduled to leave.");
    }
    if (Date.parse(site.removes_at) <= Date.now()) {
      throw new StudioError("This site has already left Studio. Restore it instead.");
    }
    const billing = await loadBilling(userId);
    if (billing.block) throw new StudioError(STUDIO_BLOCK_COPY[billing.block]);
    if (!billing.facts.studioItem && !billing.studioPrice) throw new StudioError(NOT_CONFIGURED);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ removes_at: null })
      .eq("id", site.id);
    if (error) throw new Error(error.message);

    let updated: SubscriptionLike;
    try {
      updated = (await billing.stripe.subscriptions.update(billing.subscription.id, {
        items: studioItems(billing, billing.facts.studioSites + 1),
        proration_behavior: "none",
      })) as SubscriptionLike;
    } catch (err) {
      await supabaseAdmin
        .from("profiles")
        .update({ removes_at: site.removes_at })
        .eq("id", site.id);
      throw new StudioError(declineMessage(err));
    }
    await syncSubscriptionFromCheckout(updated, billing.env);
    return { ok: true };
  });
}

/* ── Trial → paid ───────────────────────────────────────────────────── */

/**
 * Ends the trial now and takes the first payment, for a member who wants
 * Studio before the trial would have ended. Nothing changes unless the
 * payment goes through.
 */
export async function activatePlanNow(userId: string): Promise<{ status: string }> {
  return withStudioLock(userId, async () => {
    const billing = await loadBilling(userId);
    if (billing.subscription.status !== "trialing") {
      return { status: billing.subscription.status };
    }
    let updated: SubscriptionLike;
    try {
      updated = (await billing.stripe.subscriptions.update(billing.subscription.id, {
        trial_end: "now",
        payment_behavior: "error_if_incomplete",
      })) as SubscriptionLike;
    } catch (err) {
      if (isDefinitive(err)) throw new StudioError(declineMessage(err));
      throw new StudioError(
        "We couldn't confirm the payment. Check Plan & Billing in a few minutes before trying again.",
      );
    }
    await syncSubscriptionFromCheckout(updated, billing.env);
    return { status: updated.status };
  });
}
