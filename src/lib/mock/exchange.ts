/**
 * The backlink exchange in mock mode (VITE_MOCK_DATA=1).
 *
 * A twelve-site synthetic network, ranked by the SAME scoring the server
 * uses, with placements that move through their lifecycle on a fast clock so
 * the whole settlement story is demoable offline: a hosted link goes live a
 * minute after it is written, an inbound one arrives once a target exists.
 *
 * State lives in localStorage per local account, like the rest of the mock.
 * Nothing here touches Supabase.
 */
import { getSessionUser } from "./auth";
import { hasActiveTrial } from "./store";
import { ensureOutboundLink } from "@/lib/exchange/link-insert";
import { normalizeDomain, isOnDomain } from "@/lib/exchange/domain";
import { rankCandidates, type Candidate } from "@/lib/exchange/scoring";
import { tierCost } from "@/lib/exchange/types";
import type {
  ExchangeAccess,
  ExchangeBalance,
  ExchangeBlock,
  ExchangeOverview,
  ExchangeSettingsPatch,
  ExchangeSite,
  ExchangeTarget,
  HostedPlacement,
  InboundPlacement,
  LedgerEntry,
  LedgerKind,
  NetworkPulse,
  TargetInput,
  VerificationResult,
} from "@/lib/exchange/types";

const STORAGE_PREFIX = "rankvolt.mock.exchange.v1";

/** Simulated time: how long each stage takes in the demo. */
const RESERVED_TO_PLACED_MS = 45_000;
const PLACED_TO_LIVE_MS = 60_000;

interface SyntheticSite {
  domain: string;
  niche: string;
  topicTags: string[];
  tier: number;
  target: { path: string; anchors: string[]; topicTags: string[] };
}

/** The other members, as the demo sees them. */
const NETWORK: SyntheticSite[] = [
  {
    domain: "sprintlog.io",
    niche: "agile project management",
    topicTags: ["sprint planning", "agile", "scrum", "remote teams"],
    tier: 2,
    target: {
      path: "/guides/sprint-planning",
      anchors: ["sprint planning guide", "how to run sprint planning", "sprint planning template"],
      topicTags: ["sprint planning", "agile"],
    },
  },
  {
    domain: "teamcadence.com",
    niche: "remote team productivity",
    topicTags: ["remote work", "productivity", "async communication"],
    tier: 1,
    target: {
      path: "/async-standups",
      anchors: ["async standup template", "asynchronous standups", "running standups async"],
      topicTags: ["async", "standups", "remote teams"],
    },
  },
  {
    domain: "kanbanhq.app",
    niche: "kanban software",
    topicTags: ["kanban", "workflow", "project management"],
    tier: 1,
    target: {
      path: "/kanban-board-guide",
      anchors: ["kanban board guide", "setting up a kanban board", "kanban basics"],
      topicTags: ["kanban", "workflow"],
    },
  },
  {
    domain: "founderdesk.co",
    niche: "startup operations",
    topicTags: ["startups", "founders", "operations", "hiring"],
    tier: 2,
    target: {
      path: "/first-ops-hire",
      anchors: ["first operations hire", "hiring an ops lead", "when to hire operations"],
      topicTags: ["hiring", "startups", "operations"],
    },
  },
  {
    domain: "okrpath.com",
    niche: "goal setting for teams",
    topicTags: ["okrs", "goals", "planning", "leadership"],
    tier: 1,
    target: {
      path: "/okr-examples",
      anchors: ["OKR examples", "sample OKRs for product teams", "writing good OKRs"],
      topicTags: ["okrs", "planning"],
    },
  },
  {
    domain: "retrolab.dev",
    niche: "engineering team rituals",
    topicTags: ["retrospectives", "engineering", "agile", "team health"],
    tier: 1,
    target: {
      path: "/retro-formats",
      anchors: ["retrospective formats", "sprint retro ideas", "running a retrospective"],
      topicTags: ["retrospectives", "agile"],
    },
  },
  {
    domain: "clientflow.studio",
    niche: "agency project delivery",
    topicTags: ["agencies", "client work", "project management", "scoping"],
    tier: 2,
    target: {
      path: "/scope-creep",
      anchors: [
        "managing scope creep",
        "scope creep in client projects",
        "how agencies control scope",
      ],
      topicTags: ["scoping", "agencies"],
    },
  },
  {
    domain: "docsmith.app",
    niche: "internal documentation",
    topicTags: ["documentation", "knowledge base", "onboarding"],
    tier: 1,
    target: {
      path: "/team-wiki",
      anchors: ["building a team wiki", "internal wiki guide", "team documentation basics"],
      topicTags: ["documentation", "onboarding"],
    },
  },
  {
    domain: "growthledger.co",
    niche: "saas growth marketing",
    topicTags: ["saas", "growth", "marketing", "seo"],
    tier: 3,
    target: {
      path: "/plg-metrics",
      anchors: [
        "product-led growth metrics",
        "PLG metrics that matter",
        "measuring product-led growth",
      ],
      topicTags: ["saas", "growth", "metrics"],
    },
  },
  {
    domain: "meetingless.com",
    niche: "meeting productivity",
    topicTags: ["meetings", "productivity", "async", "calendar"],
    tier: 1,
    target: {
      path: "/fewer-meetings",
      anchors: ["how to have fewer meetings", "cutting meetings in half", "meeting-free days"],
      topicTags: ["meetings", "productivity"],
    },
  },
  {
    domain: "shipfast.blog",
    niche: "software delivery",
    topicTags: ["shipping", "engineering", "release management", "devops"],
    tier: 2,
    target: {
      path: "/release-checklist",
      anchors: ["release checklist", "software release checklist", "pre-release checklist"],
      topicTags: ["releases", "engineering"],
    },
  },
  {
    domain: "bakersbench.co",
    niche: "home baking",
    topicTags: ["baking", "sourdough", "recipes"],
    tier: 1,
    target: {
      path: "/sourdough-starter",
      anchors: ["sourdough starter guide", "keeping a sourdough starter", "sourdough basics"],
      topicTags: ["sourdough", "baking"],
    },
  },
];

interface MockExchangeState {
  site: ExchangeSite | null;
  /** Mock stand-in for the first paid invoice. */
  paid: boolean;
  targets: ExchangeTarget[];
  inbound: InboundPlacement[];
  hosted: HostedPlacement[];
  balance: ExchangeBalance;
  ledger: LedgerEntry[];
  blocks: ExchangeBlock[];
}

function currentUserId(): string {
  return getSessionUser()?.id ?? "guest";
}

function storageKey(): string {
  return `${STORAGE_PREFIX}:${currentUserId()}`;
}

function emptyState(): MockExchangeState {
  return {
    site: null,
    paid: false,
    targets: [],
    inbound: [],
    hosted: [],
    balance: { balance: 0, escrowed: 0, lifetimeEarned: 0, lifetimeSpent: 0, periodEnd: null },
    ledger: [],
    blocks: [],
  };
}

let cache: { key: string; state: MockExchangeState } | null = null;

function load(): MockExchangeState {
  const key = storageKey();
  if (cache?.key === key) return cache.state;
  let state = emptyState();
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = { ...emptyState(), ...(JSON.parse(raw) as MockExchangeState) };
    } catch {
      /* unreadable — start empty */
    }
  }
  cache = { key, state };
  return state;
}

function save() {
  if (typeof window === "undefined" || !cache) return;
  try {
    window.localStorage.setItem(cache.key, JSON.stringify(cache.state));
  } catch {
    /* quota or private mode — the mock still works in memory */
  }
}

function mutate(fn: (s: MockExchangeState) => void) {
  const s = load();
  fn(s);
  save();
}

function delay<T>(value: T, ms = 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function ledger(s: MockExchangeState, kind: LedgerKind, credits: number, note: string) {
  s.ledger.unshift({
    id: uid("led"),
    kind,
    credits,
    balanceAfter: s.balance.balance,
    note,
    createdAt: nowIso(),
  });
  s.ledger = s.ledger.slice(0, 100);
}

/* ── The clock ──────────────────────────────────────────────────── */

/**
 * Advances every placement that has waited long enough, and settles credits
 * as the server would: escrow on reserve, movement only on live.
 */
function tick(s: MockExchangeState) {
  const now = Date.now();
  const age = (iso: string | null) => (iso ? now - Date.parse(iso) : 0);

  for (const p of s.hosted) {
    if (p.status === "placed" && age(p.placedAt) > PLACED_TO_LIVE_MS) {
      p.status = "live";
      p.liveAt = nowIso();
      p.lastCheckedAt = p.liveAt;
      p.hostUrl = `https://${s.site?.domain ?? "example.com"}/blog/${slug(p.blogTitle ?? "article")}`;
      s.balance.balance += p.credits;
      s.balance.lifetimeEarned += p.credits;
      if (s.site) s.site.liveHostedCount += 1;
      ledger(s, "settle_earn", p.credits, "hosted link verified live");
    }
  }
  for (const p of s.inbound) {
    if (p.status === "reserved" && age(p.reservedAt) > RESERVED_TO_PLACED_MS) {
      p.status = "placed";
      p.placedAt = nowIso();
    } else if (p.status === "placed" && age(p.placedAt) > PLACED_TO_LIVE_MS) {
      p.status = "live";
      p.liveAt = nowIso();
      p.hostUrl = `https://${p.hostDomain}/blog/${slug(p.anchor)}-and-more`;
      s.balance.escrowed = Math.max(0, s.balance.escrowed - p.credits);
      s.balance.lifetimeSpent += p.credits;
      const t = s.targets.find((t) => t.id === p.targetId);
      if (t) {
        t.liveCount += 1;
        t.queuedSince = nowIso();
      }
      ledger(s, "settle_spend", 0, "link verified live");
    }
  }

  // Demand gets served: a synthetic host in a matching niche picks up each
  // waiting target, one link at a time, as long as credits cover it.
  if (s.site?.optedIn && s.site.status === "verified" && s.paid) {
    for (const t of s.targets.filter((t) => t.active)) {
      const open = s.inbound.filter(
        (p) =>
          p.targetId === t.id &&
          p.status !== "expired" &&
          p.status !== "cancelled" &&
          p.status !== "lost",
      );
      if (open.length >= Math.min(t.maxNewLinksPerMonth, 3)) continue;
      if (open.some((p) => p.status !== "live")) continue;
      const used = new Set(open.map((p) => p.hostDomain));
      const host = NETWORK.find(
        (n) =>
          !used.has(n.domain) &&
          !s.blocks.some((b) => b.domain === n.domain) &&
          n.topicTags.some((tag) =>
            t.topicTags.map((x) => x.toLowerCase()).includes(tag.toLowerCase()),
          ),
      );
      if (!host) continue;
      const credits = tierCost(host.tier);
      if (s.balance.balance < credits) continue;
      s.balance.balance -= credits;
      s.balance.escrowed += credits;
      const anchor = t.anchors[open.length % t.anchors.length];
      s.inbound.unshift({
        id: uid("pl"),
        targetId: t.id,
        targetUrl: t.url,
        anchor,
        hostDomain: host.domain,
        hostTier: host.tier,
        status: "reserved",
        credits,
        hostUrl: null,
        reservedAt: nowIso(),
        placedAt: null,
        liveAt: null,
        endReason: null,
      });
      ledger(s, "escrow", -credits, `reserved on ${host.domain}`);
    }
  }
}

function slug(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "post"
  );
}

function access(s: MockExchangeState): ExchangeAccess {
  if (s.paid) return "paid";
  if (hasActiveTrial()) return "trial";
  return s.site ? "lapsed" : "none";
}

function pulse(s: MockExchangeState): NetworkPulse {
  const mine = new Set(
    [...(s.site?.topicTags ?? []), ...(s.site?.niche?.split(/\s+/) ?? [])].map((x) =>
      x.toLowerCase(),
    ),
  );
  const inNiche = NETWORK.filter((n) => n.topicTags.some((t) => mine.has(t.toLowerCase()))).length;
  const self = s.site?.status === "verified" && s.site.optedIn && s.paid ? 1 : 0;
  return {
    verifiedSites: NETWORK.length + (s.site?.status === "verified" ? 1 : 0),
    eligibleSites: NETWORK.length + self,
    sitesInYourNiche: inNiche,
    openTargets: NETWORK.length + s.targets.filter((t) => t.active).length,
    liveLinks:
      41 +
      s.inbound.filter((p) => p.status === "live").length +
      s.hosted.filter((p) => p.status === "live").length,
    medianDaysToFirstLink: 6,
  };
}

/* ── Reads ──────────────────────────────────────────────────────── */

export async function getExchangeOverview(): Promise<ExchangeOverview> {
  mutate(tick);
  const s = load();
  const pending = (list: Array<{ status: string }>) =>
    list.filter((p) => p.status === "reserved" || p.status === "placed").length;
  const live = (list: Array<{ status: string }>) => list.filter((p) => p.status === "live").length;
  return delay({
    access: access(s),
    site: s.site,
    balance: { ...s.balance },
    pulse: pulse(s),
    counts: {
      inboundLive: live(s.inbound),
      inboundPending: pending(s.inbound),
      hostedLive: live(s.hosted),
      hostedPending: pending(s.hosted),
      activeTargets: s.targets.filter((t) => t.active).length,
    },
  });
}

export async function listTargets(): Promise<ExchangeTarget[]> {
  return delay(load().targets.map((t) => ({ ...t })));
}

export async function listInboundPlacements(): Promise<InboundPlacement[]> {
  mutate(tick);
  return delay(load().inbound.map((p) => ({ ...p })));
}

export async function listHostedPlacements(): Promise<HostedPlacement[]> {
  mutate(tick);
  return delay(load().hosted.map((p) => ({ ...p })));
}

export async function listExchangeLedger(): Promise<LedgerEntry[]> {
  return delay(load().ledger.map((e) => ({ ...e })));
}

export async function listExchangeBlocks(): Promise<ExchangeBlock[]> {
  return delay(load().blocks.map((b) => ({ ...b })));
}

/* ── Writes ─────────────────────────────────────────────────────── */

function requirePaid(s: MockExchangeState) {
  if (!s.paid)
    throw new Error(
      "The backlink exchange is part of the paid plan. It unlocks with your first invoice.",
    );
}

/**
 * Whether this mock account has had its first paid invoice. Reddit Presence
 * sits behind the same gate, so it reads this rather than keeping a second
 * flag that could disagree with this one.
 */
export function isMockPaid(): boolean {
  return load().paid;
}

/** Mock-only: stands in for the first paid invoice, and grants the month's credits. */
export async function simulatePaidPlan(): Promise<void> {
  mutate((s) => {
    if (s.paid) return;
    s.paid = true;
    s.balance.balance += 30;
    s.balance.periodEnd = new Date(Date.now() + 30 * 86_400_000).toISOString();
    if (s.site) s.site.paidActive = true;
    ledger(s, "grant", 30, "monthly plan grant");
  });
  return delay(undefined, 500);
}

export async function startDomainVerification(data: { domain: string }): Promise<ExchangeSite> {
  const s = load();
  requirePaid(s);
  const domain = normalizeDomain(data.domain);
  if (!domain) throw new Error("Enter the domain you publish to, like example.com.");
  mutate((st) => {
    if (st.site && st.site.domain === domain) return;
    st.site = {
      id: st.site?.id ?? uid("site"),
      domain,
      status: "unverified",
      verifyMethod: null,
      verifyToken: Math.random().toString(16).slice(2).padEnd(32, "0"),
      verifiedAt: null,
      optedIn: false,
      paidActive: st.paid,
      authorityScore: 0,
      tier: 1,
      reputation: 100,
      niche: st.site?.niche ?? null,
      topicTags: st.site?.topicTags ?? [],
      blockedCategories: st.site?.blockedCategories ?? [],
      maxLinksPerArticle: 1,
      liveHostedCount: 0,
      lostHostedCount: 0,
      createdAt: nowIso(),
    };
  });
  return delay(load().site as ExchangeSite, 400);
}

export async function checkDomainVerification(): Promise<VerificationResult> {
  const s = load();
  requirePaid(s);
  if (!s.site) return { ok: false, reason: "Add the domain you publish to first." };
  // The demo passes on the first check — there is no page to read.
  mutate((st) => {
    if (!st.site) return;
    st.site.status = "verified";
    st.site.verifyMethod = "meta_tag";
    st.site.verifiedAt = nowIso();
    st.site.authorityScore = 34;
  });
  return delay({ ok: true, method: "meta_tag" }, 1200);
}

export async function updateExchangeSettings(patch: ExchangeSettingsPatch): Promise<ExchangeSite> {
  const s = load();
  requirePaid(s);
  if (!s.site) throw new Error("Add the domain you publish to first.");
  if (patch.optedIn && s.site.status !== "verified")
    throw new Error("Verify your domain before opting in.");
  mutate((st) => {
    if (!st.site) return;
    if (patch.optedIn !== undefined) st.site.optedIn = patch.optedIn;
    if (patch.maxLinksPerArticle !== undefined)
      st.site.maxLinksPerArticle = patch.maxLinksPerArticle;
    if (patch.niche !== undefined) st.site.niche = patch.niche || null;
    if (patch.topicTags !== undefined) st.site.topicTags = patch.topicTags;
    if (patch.blockedCategories !== undefined) st.site.blockedCategories = patch.blockedCategories;
  });
  return delay(load().site as ExchangeSite, 300);
}

export async function createTarget(input: TargetInput): Promise<ExchangeTarget> {
  const s = load();
  requirePaid(s);
  if (!s.site || s.site.status !== "verified") throw new Error("Verify your domain first.");
  if (!isOnDomain(input.url, s.site.domain))
    throw new Error(`Targets must be pages on ${s.site.domain}.`);
  const target: ExchangeTarget = {
    id: uid("tgt"),
    url: input.url,
    anchors: input.anchors,
    topicTags: input.topicTags,
    priority: input.priority,
    active: input.active,
    maxNewLinksPerMonth: input.maxNewLinksPerMonth,
    liveCount: 0,
    queuedSince: nowIso(),
    createdAt: nowIso(),
  };
  mutate((st) => {
    st.targets.push(target);
  });
  return delay({ ...target }, 400);
}

export async function updateTarget(data: {
  id: string;
  patch: Partial<TargetInput>;
}): Promise<ExchangeTarget> {
  requirePaid(load());
  mutate((st) => {
    const t = st.targets.find((t) => t.id === data.id);
    if (t) Object.assign(t, data.patch);
  });
  const t = load().targets.find((t) => t.id === data.id);
  if (!t) throw new Error("Target not found.");
  return delay({ ...t }, 300);
}

export async function deleteTarget(data: { id: string }): Promise<{ deleted: boolean }> {
  let deleted = true;
  mutate((st) => {
    for (const p of st.inbound) {
      if (p.targetId !== data.id) continue;
      if (p.status === "reserved" || p.status === "placed") {
        p.status = "cancelled";
        p.endReason = "target removed by its owner";
        st.balance.balance += p.credits;
        st.balance.escrowed = Math.max(0, st.balance.escrowed - p.credits);
        ledger(st, "refund", p.credits, "target removed by its owner");
      }
    }
    if (st.inbound.some((p) => p.targetId === data.id && p.status === "live")) {
      const t = st.targets.find((t) => t.id === data.id);
      if (t) t.active = false;
      deleted = false;
    } else {
      st.targets = st.targets.filter((t) => t.id !== data.id);
    }
  });
  return delay({ deleted }, 300);
}

export async function blockDomain(data: {
  domain: string;
  reason?: string;
}): Promise<ExchangeBlock> {
  const domain = normalizeDomain(data.domain);
  if (!domain) throw new Error("Enter a domain like example.com.");
  const block: ExchangeBlock = {
    id: uid("blk"),
    domain,
    reason: data.reason ?? "",
    createdAt: nowIso(),
  };
  mutate((st) => {
    st.blocks = [block, ...st.blocks.filter((b) => b.domain !== domain)];
  });
  return delay(block, 250);
}

export async function unblockDomain(data: { domain: string }): Promise<{ ok: true }> {
  mutate((st) => {
    st.blocks = st.blocks.filter((b) => b.domain !== normalizeDomain(data.domain));
  });
  return delay({ ok: true as const }, 250);
}

export async function removeHostedPlacement(data: { id: string }): Promise<{ ok: true }> {
  mutate((st) => {
    const p = st.hosted.find((p) => p.id === data.id);
    if (!p) return;
    if (p.status === "live") {
      p.status = "lost";
      p.endReason = "removed by the host";
      st.balance.balance = Math.max(0, st.balance.balance - p.credits);
      st.balance.lifetimeEarned = Math.max(0, st.balance.lifetimeEarned - p.credits);
      if (st.site) {
        st.site.reputation = Math.max(0, st.site.reputation - 10);
        st.site.liveHostedCount = Math.max(0, st.site.liveHostedCount - 1);
        st.site.lostHostedCount += 1;
      }
      ledger(st, "clawback", -p.credits, "removed by the host");
    } else if (p.status === "reserved" || p.status === "placed") {
      p.status = "cancelled";
      p.endReason = "removed by the host";
    }
  });
  return delay({ ok: true as const }, 300);
}

export async function setPublishedUrl(_data: {
  blogId: string;
  url: string;
}): Promise<{ ok: true }> {
  return delay({ ok: true as const }, 250);
}

/* ── The hook the mock writer calls ─────────────────────────────── */

/**
 * After a mock article is written: if this member hosts links, pick the best
 * synthetic target for it exactly as the server would, put the link in the
 * body, and record the placement. Returns the body to store.
 */
export function hostLinkForArticle(blog: {
  id: string;
  title: string;
  keyword: string | null;
  tags: string[];
  body: string;
}): string {
  const s = load();
  const site = s.site;
  if (!site || site.status !== "verified" || !site.optedIn || !s.paid) return blog.body;
  if (s.hosted.some((p) => p.blogId === blog.id && p.status !== "cancelled")) return blog.body;

  const candidates: Candidate[] = NETWORK.filter(
    (n) => !s.blocks.some((b) => b.domain === n.domain),
  ).map((n, i) => ({
    targetId: `net-${i}`,
    requesterSiteId: `net-site-${i}`,
    requesterOwnerId: `net-owner-${i}`,
    requesterDomain: n.domain,
    url: `https://${n.domain}${n.target.path}`,
    anchors: n.target.anchors,
    topicTags: n.target.topicTags,
    niche: n.niche,
    priority: 5,
    tier: n.tier,
    reputation: 100,
    queuedSince: new Date(Date.now() - (i + 1) * 3 * 86_400_000).toISOString(),
    lastPlacedAt: null,
    liveCount: 0,
    everLinkedFromHost: s.hosted.some((p) => p.targetDomain === n.domain),
    requesterKeywords: n.topicTags,
    usedAnchors: s.hosted.filter((p) => p.targetDomain === n.domain).map((p) => p.anchor),
  }));

  const ranked = rankCandidates(candidates, {
    hostSiteId: site.id,
    hostTier: site.tier,
    hostNiche: site.niche,
    hostTopicTags: site.topicTags,
    blockedCategories: site.blockedCategories,
    articleTitle: blog.title,
    articleKeyword: blog.keyword ?? blog.title,
    articleTags: blog.tags,
  });
  const pick = ranked[0];
  if (!pick) return blog.body;

  const result = ensureOutboundLink(blog.body, {
    url: pick.candidate.url,
    anchor: pick.anchor,
    topic: pick.candidate.topicTags.join(", "),
  });
  if (!result.ok) return blog.body;

  mutate((st) => {
    st.hosted.unshift({
      id: uid("pl"),
      blogId: blog.id,
      blogTitle: blog.title,
      anchor: pick.anchor,
      targetDomain: pick.candidate.requesterDomain,
      targetUrl: pick.candidate.url,
      status: "placed",
      credits: pick.credits,
      hostUrl: null,
      reservedAt: nowIso(),
      placedAt: nowIso(),
      liveAt: null,
      lastCheckedAt: null,
      consecutiveFailures: 0,
      endReason: null,
    });
  });
  return result.body;
}

export function resetMockExchange() {
  cache = { key: storageKey(), state: emptyState() };
  save();
}
