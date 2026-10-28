/**
 * The facts a sublanding page may state about Rankbox, read from their
 * sources so a price, trial or shipping change updates every page at once.
 * Pages import from here; they never type a price, a trial length or a
 * feature that hasn't shipped.
 */
import { PLAN, STUDIO, TRIAL_DAYS, TRIAL_ARTICLE_CREDITS, formatUsd } from "@/data/pricing";
import { RANKBOX_PUBLISHING, SHIPPED } from "@/data/competitors/shared";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { setPendingSiteUrl } from "@/lib/pending-site";

export { PLAN, STUDIO, TRIAL_DAYS, TRIAL_ARTICLE_CREDITS, SHIPPED, RANKBOX_PUBLISHING, formatUsd };

/** "$49.50" */
export const PRICE = formatUsd(PLAN.monthly);

/** "$49.50 a month" */
export const PRICE_MONTHLY = `${PRICE} a month`;

/** "7-day free trial" */
export const TRIAL = `${TRIAL_DAYS}-day free trial`;

/**
 * How the trial starts, in plain sentences. A card is required: adding one is
 * the last step of setup, and Rankbox can't be used without it.
 */
export const TRIAL_TERMS = `A card is required to start the ${TRIAL}, as the last step of setup. You're charged ${PRICE_MONTHLY} ${TRIAL_DAYS} days after you start, unless you cancel first.`;

/** Platform add-ons that have actually shipped (empty until an addonLive flips). */
export const LIVE_ADDONS = PUBLISH_PLATFORMS.filter((p) => p.addonLive).map((p) => p.name);

/** Platform add-ons built but not yet live. */
export const PENDING_ADDONS = PUBLISH_PLATFORMS.filter((p) => !p.addonLive).map((p) => p.name);

/** One sentence on how articles reach a site today. */
export const PUBLISHING_TODAY = RANKBOX_PUBLISHING.sentence;

/**
 * Send a visitor to signup, carrying their site URL through auth the same way
 * the landing hero does (the URL must survive the OAuth round trip).
 */
export function startSignup(siteUrl?: string) {
  const trimmed = siteUrl?.trim() ?? "";
  if (trimmed) setPendingSiteUrl(trimmed);
  const q = trimmed ? `?url=${encodeURIComponent(trimmed)}` : "";
  window.location.href = `/auth${q}`;
}
