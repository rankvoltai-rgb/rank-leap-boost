/**
 * Shapes shared by the backlink exchange's server functions, the dashboard and
 * the mock store. Client-safe: nothing here imports a server module.
 *
 * Two words are used consistently across the feature:
 *   HOST      — the member whose article carries the link. They earn.
 *   REQUESTER — the member whose URL is linked to. They spend.
 */

export type ExchangeSiteStatus = "unverified" | "verifying" | "verified" | "suspended";
export type ExchangeVerifyMethod = "dns_txt" | "meta_tag" | "well_known";
export type PlacementStatus = "reserved" | "placed" | "live" | "lost" | "expired" | "cancelled";
export type LedgerKind =
  | "grant"
  | "escrow"
  | "settle_spend"
  | "settle_earn"
  | "refund"
  | "clawback"
  | "bonus"
  | "adjust";

/**
 * Whether the exchange is open to this account, and if not, why.
 *   paid    — an active paid plan; the exchange is open
 *   trial   — trialing; the exchange unlocks with the first paid invoice
 *   lapsed  — took part before, no longer paying; links stay live, credits held
 *   none    — no plan at all
 */
export type ExchangeAccess = "paid" | "trial" | "lapsed" | "none";

export interface ExchangeSite {
  id: string;
  domain: string;
  status: ExchangeSiteStatus;
  verifyMethod: ExchangeVerifyMethod | null;
  /** The token to publish — as a DNS TXT record, a meta tag, or a file. */
  verifyToken: string;
  verifiedAt: string | null;
  optedIn: boolean;
  paidActive: boolean;
  authorityScore: number;
  tier: number;
  reputation: number;
  niche: string | null;
  topicTags: string[];
  blockedCategories: string[];
  maxLinksPerArticle: number;
  liveHostedCount: number;
  lostHostedCount: number;
  createdAt: string;
}

/** A page of the member's own site they want links pointed at. */
export interface ExchangeTarget {
  id: string;
  url: string;
  anchors: string[];
  topicTags: string[];
  priority: number;
  active: boolean;
  maxNewLinksPerMonth: number;
  liveCount: number;
  queuedSince: string;
  createdAt: string;
}

/** A backlink the member is receiving. Names the host by domain only. */
export interface InboundPlacement {
  id: string;
  targetId: string;
  targetUrl: string;
  anchor: string;
  hostDomain: string;
  hostTier: number;
  status: PlacementStatus;
  credits: number;
  hostUrl: string | null;
  reservedAt: string;
  placedAt: string | null;
  liveAt: string | null;
  endReason: string | null;
}

/** A link the member is hosting in one of their own articles. */
export interface HostedPlacement {
  id: string;
  blogId: string | null;
  blogTitle: string | null;
  anchor: string;
  targetDomain: string;
  targetUrl: string;
  status: PlacementStatus;
  credits: number;
  hostUrl: string | null;
  reservedAt: string;
  placedAt: string | null;
  liveAt: string | null;
  lastCheckedAt: string | null;
  /** Checks in a row that couldn't find the link. Three over 72 hours is a chargeback. */
  consecutiveFailures: number;
  endReason: string | null;
}

/** A domain the member refuses to link to or be linked from. */
export interface ExchangeBlock {
  id: string;
  domain: string;
  reason: string;
  createdAt: string;
}

export interface ExchangeBalance {
  balance: number;
  escrowed: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  periodEnd: string | null;
}

export interface LedgerEntry {
  id: string;
  kind: LedgerKind;
  credits: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
}

/** The network as it actually is — the honesty surface. Counts eligible sites only. */
export interface NetworkPulse {
  verifiedSites: number;
  /** Verified, opted in AND paying: the sites that can actually trade. */
  eligibleSites: number;
  sitesInYourNiche: number;
  openTargets: number;
  liveLinks: number;
  /** Across the network, from a target's creation to its first live link. */
  medianDaysToFirstLink: number | null;
}

export interface ExchangeOverview {
  access: ExchangeAccess;
  site: ExchangeSite | null;
  balance: ExchangeBalance;
  pulse: NetworkPulse;
  counts: {
    inboundLive: number;
    inboundPending: number;
    hostedLive: number;
    hostedPending: number;
    activeTargets: number;
  };
}

export interface ExchangeSettingsPatch {
  optedIn?: boolean;
  maxLinksPerArticle?: number;
  niche?: string;
  topicTags?: string[];
  blockedCategories?: string[];
}

export interface TargetInput {
  url: string;
  anchors: string[];
  topicTags: string[];
  priority: number;
  maxNewLinksPerMonth: number;
  active: boolean;
}

export interface VerificationResult {
  ok: boolean;
  method?: ExchangeVerifyMethod;
  /** What we actually saw, so the member can fix it. */
  reason?: string;
}

/** Credits a link costs, by the HOST site's tier. Index by tier; tier 0 is unused. */
export const EXCHANGE_TIER_COST = [0, 1, 1, 2, 3] as const;

export function tierCost(tier: number): number {
  const t = Math.min(4, Math.max(1, Math.trunc(Number(tier) || 1)));
  return EXCHANGE_TIER_COST[t] ?? 1;
}

/** Days a placed link has to be published and verified before its escrow is returned. */
export const PLACEMENT_WINDOW_DAYS = 30;

/**
 * Categories a host may refuse to link to. Matched against the requester
 * site's niche and topic tags by these terms.
 */
export const EXCHANGE_CATEGORIES: ReadonlyArray<{ id: string; label: string; terms: string[] }> = [
  {
    id: "gambling",
    label: "Gambling & betting",
    terms: ["gambling", "casino", "betting", "poker", "sportsbook", "lottery"],
  },
  {
    id: "adult",
    label: "Adult content",
    terms: ["adult", "porn", "escort", "xxx", "nsfw", "onlyfans"],
  },
  {
    id: "crypto",
    label: "Crypto & NFTs",
    terms: ["crypto", "bitcoin", "nft", "defi", "blockchain", "altcoin", "memecoin"],
  },
  {
    id: "cannabis",
    label: "Cannabis & CBD",
    terms: ["cbd", "cannabis", "marijuana", "weed", "thc", "dispensary"],
  },
  { id: "loans", label: "Payday loans & lending", terms: ["payday", "loan", "lending", "lender"] },
  {
    id: "pharma",
    label: "Pharmaceuticals & supplements",
    terms: ["pharma", "pharmacy", "viagra", "supplement", "steroid", "nootropic"],
  },
  { id: "weapons", label: "Weapons", terms: ["gun", "firearm", "weapon", "ammo", "ammunition"] },
  {
    id: "tobacco",
    label: "Tobacco & vaping",
    terms: ["vape", "vaping", "tobacco", "cigarette", "nicotine"],
  },
  {
    id: "politics",
    label: "Politics",
    terms: ["politic", "election", "partisan", "campaign finance"],
  },
  { id: "dating", label: "Dating", terms: ["dating", "hookup", "matchmaking"] },
];

/** Placement statuses that still hold escrow or count against caps. */
export const ACTIVE_PLACEMENT_STATUSES: ReadonlyArray<PlacementStatus> = [
  "reserved",
  "placed",
  "live",
];
