/**
 * Reddit Presence in mock mode (VITE_MOCK_DATA=1).
 *
 * A synthetic set of threads, ranked by the SAME scoring and checked by the
 * SAME compliance rules the server uses, so what the dashboard demonstrates
 * offline is what ships. A pasted permalink is confirmed on a fast clock.
 *
 * The fixtures are chosen for the awkward states, not the pretty ones: a
 * thread that was checked and NOT cited, one never checked at all, one only
 * probably archived, a subreddit whose rules we couldn't read, one that bans
 * self-promotion, one we found but never hydrated. Those are the states this
 * feature's honesty depends on, so they are the ones that have to be buildable
 * and reviewable without a network.
 *
 * State lives in localStorage per local account, like the rest of the mock.
 * Nothing here touches Supabase or Apify.
 */
import { getSessionUser } from "./auth";
import { isMockPaid } from "./exchange";
import { MOCK_ANALYSIS } from "./fixtures";
import { getProfile, getSettings, hasActiveTrial, listKeywords } from "./store";
import {
  checkReply,
  isValidDisclosureLine,
  resolveDisclosure,
  type ComplianceContext,
} from "@/lib/reddit/compliance";
import { parsePermalink, permalinkProblem } from "@/lib/reddit/permalink";
import { normalizeSubreddit, readRules } from "@/lib/reddit/rules";
import {
  blockedReasonFor,
  scoreOpportunity,
  type ScoreContext,
  type ScoreInput,
} from "@/lib/reddit/scoring";
import {
  isOpenOpportunity,
  MAX_DRAFT_REGENS,
  REDDIT_DRAFT_COST,
  type AiCitationMeasurement,
  type RedditAccess,
  type RedditBalance,
  type RedditDraft,
  type RedditLedgerEntry,
  type RedditLedgerKind,
  type RedditMention,
  type RedditOpportunity,
  type RedditOpportunityDetail,
  type RedditOverview,
  type RedditReply,
  type RedditSettings,
  type RedditSettingsPatch,
  type RedditSubredditView,
  type RedditSweep,
  type RedditSweepResult,
  type RedditTopComment,
  type SerpMeasurement,
  type ThreadActivityPoint,
} from "@/lib/reddit/types";

const STORAGE_PREFIX = "rankvolt.mock.reddit.v1";
const MONTHLY_CREDITS = 30;

/** Simulated time. */
const POSTED_TO_CONFIRMED_MS = 45_000;
const MIN_SWEEP_INTERVAL_MS = 60_000;

const DAY = 86_400_000;
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString();

/* ── The synthetic Reddit ───────────────────────────────────────── */

const SUBREDDITS: Record<string, Omit<RedditSubredditView, "name" | "rulesCheckedAt">> = {
  startups: {
    title: "Startups",
    publicDescription:
      "Founders building startups, small product teams and early project planning.",
    subscribers: 1_840_000,
    allowsSelfPromo: true,
    promoBanned: false,
    rules: ["Be civil and constructive.", "No low-effort posts.", "Disclose any affiliation."],
    rulesSource: "scrape",
  },
  projectmanagement: {
    title: "Project Management",
    publicDescription: "Project management practice, tools, planning and team workflow.",
    subscribers: 412_000,
    allowsSelfPromo: true,
    promoBanned: false,
    rules: ["Stay on topic.", "Be respectful.", "No homework questions."],
    rulesSource: "scrape",
  },
  saas: {
    title: "SaaS",
    publicDescription: "Software as a service: building, pricing, and choosing SaaS tools.",
    subscribers: 298_000,
    allowsSelfPromo: true,
    promoBanned: false,
    rules: [
      "Be helpful.",
      "Self-promotion must follow the 9:1 rule — no more than 10% of your activity.",
    ],
    rulesSource: "scrape",
  },
  smallbusiness: {
    title: "Small Business",
    publicDescription: "Running a small business: teams, tasks, operations and tools.",
    subscribers: 1_620_000,
    allowsSelfPromo: true,
    promoBanned: false,
    rules: ["Be civil.", "No surveys.", "Flair your post."],
    rulesSource: "scrape",
  },
  entrepreneur: {
    title: "Entrepreneur",
    publicDescription: "Entrepreneurs discussing business, project planning and software.",
    subscribers: 3_900_000,
    allowsSelfPromo: false,
    promoBanned: true,
    rules: ["No self-promotion of any kind.", "No advertising.", "Be civil."],
    rulesSource: "scrape",
  },
  agile: {
    title: "Agile",
    publicDescription: "Agile practice, sprint planning, scrum and kanban for teams.",
    subscribers: 96_000,
    allowsSelfPromo: null,
    promoBanned: false,
    rules: [],
    rulesSource: "unavailable",
  },
  productivity: {
    title: "Productivity",
    publicDescription: "Getting things done: task management, kanban boards and workflow.",
    subscribers: 2_300_000,
    allowsSelfPromo: true,
    promoBanned: false,
    rules: ["Be kind.", "No links in comments."],
    rulesSource: "scrape",
  },
};

interface Seed {
  redditId: string;
  subreddit: keyof typeof SUBREDDITS;
  title: string;
  body: string;
  author: string;
  upVotes: number;
  numComments: number;
  ageDays: number;
  keyword: string;
  channel: "serp" | "search" | "both";
  isLocked?: boolean;
  isArchived?: boolean | null;
  isRemoved?: boolean;
  partial?: boolean;
  google?: { position: number; checkedDaysAgo: number };
  ai?: Array<Pick<AiCitationMeasurement, "engine" | "cited" | "snippet"> & { daysAgo: number }>;
  comments?: RedditTopComment[];
  /** The useful part of the mock's reply. Never names the brand. */
  answer?: string;
  /** Only surfaced by a later sweep, so "Run a sweep" visibly finds something. */
  wave?: 2;
}

const SEEDS: Seed[] = [
  {
    redditId: "1kq3m8a",
    subreddit: "startups",
    title: "What's the best project tool for a 4-person startup?",
    body: "We've outgrown a shared spreadsheet. Need task boards and maybe simple automations, nothing enterprise. Budget is basically zero until we raise.",
    author: "tiny_team_tom",
    upVotes: 124,
    numComments: 37,
    ageDays: 3,
    keyword: "project management tool for startups",
    channel: "both",
    google: { position: 3, checkedDaysAgo: 2 },
    ai: [
      {
        engine: "perplexity",
        cited: true,
        snippet:
          "Founders on r/startups commonly recommend starting with the lightest board-based tool…",
        daysAgo: 2,
      },
      { engine: "chatgpt", cited: false, snippet: "", daysAgo: 2 },
    ],
    comments: [
      { author: "ops_nina", body: "Honestly Trello until it hurts. Then reassess.", score: 41 },
      {
        author: "pm_dave",
        body: "Linear if you're mostly engineers, otherwise overkill.",
        score: 22,
      },
    ],
    answer:
      "For a team of four I'd start with whatever has the lightest setup, and only add structure once you feel the pain of not having it. At that size the tool matters far less than agreeing on one board everybody actually opens.",
  },
  {
    redditId: "1jx9t2c",
    subreddit: "projectmanagement",
    title: "Trello vs Asana for a small product team?",
    body: "Six people, two of them engineers. We keep bouncing between tools. What actually stuck for teams our size and why?",
    author: "bounce_between",
    upVotes: 89,
    numComments: 52,
    ageDays: 40,
    keyword: "trello vs asana",
    channel: "serp",
    google: { position: 2, checkedDaysAgo: 3 },
    ai: [
      {
        engine: "chatgpt",
        cited: true,
        snippet:
          "A frequently cited r/projectmanagement thread compares the two for teams under ten…",
        daysAgo: 3,
      },
    ],
    comments: [
      {
        author: "kanban_kate",
        body: "Asana's strength is dependencies. If you don't need them, Trello.",
        score: 33,
      },
    ],
    answer:
      "The honest split is dependencies. If work regularly blocks other work, Asana's timeline earns its weight. If it mostly doesn't, a plain board is faster and people actually keep it current.",
  },
  {
    redditId: "1m2p7vd",
    subreddit: "saas",
    title: "Alternatives to ClickUp that aren't overwhelming?",
    body: "ClickUp has every feature and I use four of them. Looking for task boards, a calendar view, and that's about it.",
    author: "feature_fatigue",
    upVotes: 61,
    numComments: 28,
    ageDays: 12,
    keyword: "clickup alternatives",
    channel: "both",
    google: { position: 5, checkedDaysAgo: 2 },
    ai: [{ engine: "gemini", cited: false, snippet: "", daysAgo: 2 }],
    comments: [
      { author: "less_is_more", body: "Same boat. Went back to a plain kanban.", score: 17 },
    ],
    answer:
      "If you're using four features, pick the tool whose defaults are those four rather than one you have to strip down. Turning things off never quite works — the settings pages alone stay overwhelming.",
  },
  {
    redditId: "1n8r4wq",
    subreddit: "productivity",
    title: "Kanban board apps with simple automations?",
    body: "I want a card to move columns when a checklist is done, and that's the extent of my automation needs. Project boards for a small team.",
    author: "checklist_carl",
    upVotes: 44,
    numComments: 19,
    ageDays: 9,
    keyword: "kanban board with automations",
    channel: "serp",
    google: { position: 8, checkedDaysAgo: 4 },
    answer:
      "That exact rule — checklist complete moves the card — is table stakes now, so choose on how the board feels day to day rather than on the automation. Most tools bury it under a 'rules' or 'butler' menu.",
  },
  {
    redditId: "1p5s9kz",
    subreddit: "agile",
    title: "Sprint planning tool for a tiny team — is Jira overkill?",
    body: "Three devs and a designer. We do two-week sprints loosely. Jira feels like filing taxes. What do small teams use for sprint planning and task boards?",
    author: "loosely_agile",
    upVotes: 73,
    numComments: 41,
    ageDays: 6,
    keyword: "sprint planning tool",
    channel: "both",
    google: { position: 11, checkedDaysAgo: 2 },
    answer:
      "At four people, sprint planning is a conversation and the tool is just where you write down what you agreed. Anything with a backlog column and a way to mark a two-week window is enough.",
  },
  {
    redditId: "1q1d6hn",
    subreddit: "entrepreneur",
    title: "Best project management software in 2026?",
    body: "Starting a small agency. What project management software are people actually happy with for client projects and team planning?",
    author: "agency_anna",
    upVotes: 412,
    numComments: 188,
    ageDays: 21,
    keyword: "best project management software",
    channel: "serp",
    google: { position: 1, checkedDaysAgo: 2 },
    ai: [
      {
        engine: "perplexity",
        cited: true,
        snippet:
          "A large r/Entrepreneur discussion surfaces the most-recommended tools for small agencies…",
        daysAgo: 2,
      },
    ],
  },
  {
    redditId: "1c4v8ye",
    subreddit: "startups",
    title: "Project management for early startups — what did you settle on?",
    body: "Pre-seed, five of us. Curious what project tools other founders landed on for task boards and planning after trying a few.",
    author: "preseed_pat",
    upVotes: 230,
    numComments: 96,
    ageDays: 402,
    keyword: "project management for startups",
    channel: "serp",
    isArchived: true,
    google: { position: 4, checkedDaysAgo: 3 },
  },
  {
    redditId: "1r7b2mf",
    subreddit: "projectmanagement",
    title: "Which project tool handles recurring tasks best for a small team?",
    body: "Weekly client reports, monthly invoicing. Need recurring tasks on a team board that don't silently break.",
    author: "recurring_rita",
    upVotes: 38,
    numComments: 24,
    ageDays: 15,
    keyword: "project tool recurring tasks",
    channel: "search",
    isLocked: true,
  },
  {
    redditId: "1d9k3xa",
    subreddit: "saas",
    title: "Is a project management tool worth paying for under 10 people?",
    body: "Free tiers seem to cover small teams. When did paying for project boards and team planning actually become worth it for you?",
    author: "frugal_founder",
    upVotes: 57,
    numComments: 33,
    ageDays: 204,
    keyword: "project management tool pricing",
    channel: "serp",
    isArchived: null,
    google: { position: 7, checkedDaysAgo: 5 },
  },
  {
    redditId: "1s3n5pt",
    subreddit: "productivity",
    title: "Best standing desk under $400?",
    body: "My back is done with this chair. Looking for a desk that doesn't wobble at full height.",
    author: "wobbly_will",
    upVotes: 91,
    numComments: 60,
    ageDays: 4,
    keyword: "team productivity",
    channel: "search",
  },
  {
    redditId: "1t6g1rb",
    subreddit: "smallbusiness",
    title: "Simple project boards for a small business team?",
    body: "",
    author: "",
    upVotes: 0,
    numComments: 0,
    ageDays: 30,
    keyword: "project boards for small business",
    channel: "serp",
    partial: true,
    isArchived: null,
    google: { position: 6, checkedDaysAgo: 1 },
  },
  {
    redditId: "1u2h7qc",
    subreddit: "startups",
    title: "[removed]",
    body: "[removed]",
    author: "[deleted]",
    upVotes: 3,
    numComments: 5,
    ageDays: 8,
    keyword: "project management tool for startups",
    channel: "search",
    isRemoved: true,
  },
  {
    redditId: "1b8w4zj",
    subreddit: "projectmanagement",
    title: "What project tool did you actually stick with after a year?",
    body: "Everyone recommends tools they started last month. I want to hear from small teams who've used the same project board for a year or more — what stuck and why?",
    author: "long_haul_lena",
    upVotes: 318,
    numComments: 141,
    ageDays: 425,
    keyword: "project management tool",
    channel: "serp",
    // This subreddit switched archiving off, so a 14-month-old thread is still
    // open — the case that proves the age heuristic must defer to the flag.
    isArchived: false,
    google: { position: 2, checkedDaysAgo: 3 },
    ai: [
      {
        engine: "chatgpt",
        cited: true,
        snippet: "Long-term users on r/projectmanagement report sticking with simpler board tools…",
        daysAgo: 3,
      },
    ],
  },
  {
    redditId: "1v9c6ls",
    subreddit: "smallbusiness",
    title: "How do you track tasks across a 6 person team?",
    body: "We're using a group chat and it's chaos. Need task boards everyone can see, with some kind of team planning view. What works for a small team?",
    author: "chat_chaos",
    upVotes: 27,
    numComments: 31,
    ageDays: 1,
    keyword: "task tracking for small teams",
    channel: "search",
    wave: 2,
    answer:
      "The group chat is the real problem, not the missing tool — tasks die there because nobody owns them. Whatever you pick, the rule that fixes it is: if it isn't a card with a name on it, it isn't happening.",
  },
];

/** The reply this account already has out in the world, fourteen months deep. */
const VETERAN_THREAD = "1b8w4zj";

/* ── State ──────────────────────────────────────────────────────── */

interface MockRedditState {
  granted: boolean;
  settings: RedditSettings | null;
  opportunities: RedditOpportunity[];
  drafts: RedditDraft[];
  replies: RedditReply[];
  mentions: Record<string, { serpHistory: SerpMeasurement[]; activity: ThreadActivityPoint[] }>;
  balance: RedditBalance;
  ledger: RedditLedgerEntry[];
  sweeps: RedditSweep[];
  /** Mock-only review switches. Null means "as the account really is". */
  accessOverride: RedditAccess | null;
  providerConfigured: boolean;
}

function currentUserId(): string {
  return getSessionUser()?.id ?? "guest";
}

function storageKey(): string {
  return `${STORAGE_PREFIX}:${currentUserId()}`;
}

function emptyState(): MockRedditState {
  return {
    granted: false,
    settings: null,
    opportunities: [],
    drafts: [],
    replies: [],
    mentions: {},
    balance: { balance: 0, lifetimeSpent: 0, periodEnd: null },
    ledger: [],
    sweeps: [],
    accessOverride: null,
    providerConfigured: true,
  };
}

let cache: { key: string; state: MockRedditState } | null = null;

function load(): MockRedditState {
  const key = storageKey();
  if (cache?.key === key) return cache.state;
  let state = emptyState();
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = { ...emptyState(), ...(JSON.parse(raw) as MockRedditState) };
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

function mutate(fn: (s: MockRedditState) => void) {
  const s = load();
  fn(s);
  save();
}

/** Simulated latency, so loading states are visible in the demo. Skipped under test. */
const UNDER_TEST = typeof process !== "undefined" && Boolean(process.env?.VITEST);

function delay<T>(value: T, ms = 260): Promise<T> {
  if (UNDER_TEST) return Promise.resolve(value);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function ledger(s: MockRedditState, kind: RedditLedgerKind, credits: number, note: string) {
  s.ledger.unshift({
    id: uid("rled"),
    kind,
    credits,
    balanceAfter: s.balance.balance,
    note,
    createdAt: nowIso(),
  });
  s.ledger = s.ledger.slice(0, 100);
}

/* ── Access ─────────────────────────────────────────────────────── */

function access(s: MockRedditState): RedditAccess {
  if (s.accessOverride) return s.accessOverride;
  if (isMockPaid()) return "paid";
  if (hasActiveTrial()) return "trial";
  return s.settings?.enabled ? "lapsed" : "none";
}

/** The month's grant lands the first time a paid account is seen — a reset, not a top-up. */
function ensureGrant(s: MockRedditState) {
  if (s.granted || access(s) !== "paid") return;
  s.granted = true;
  s.balance.balance = MONTHLY_CREDITS;
  s.balance.periodEnd = new Date(Date.now() + 30 * DAY).toISOString();
  ledger(s, "grant", MONTHLY_CREDITS, "monthly plan grant");
}

/** The same rule the server enforces: a courtesy gate on the page is not the rule. */
function requirePaid(s: MockRedditState) {
  if (access(s) !== "paid")
    throw new Error(
      "Reddit presence is part of the paid plan. It opens with your first paid invoice.",
    );
}

/* ── Building views from seeds ──────────────────────────────────── */

function subredditView(name: string): RedditSubredditView {
  const sub = SUBREDDITS[name];
  return { name, ...sub, rulesCheckedAt: sub.rulesSource === "unavailable" ? null : ago(6) };
}

async function scoreContext(settings: RedditSettings | null): Promise<ScoreContext> {
  const [profile, keywords] = await Promise.all([getProfile(), listKeywords("library")]);
  return {
    niche: settings?.niche ?? MOCK_ANALYSIS.niche,
    topicTags: settings?.topicTags ?? [],
    keywords: keywords.map((k) => k.name),
    productDescription: profile?.product_description ?? "",
    allowSubreddits: settings?.allowSubreddits ?? [],
    denySubreddits: settings?.denySubreddits ?? [],
  };
}

function scoreInputOf(o: RedditOpportunity): ScoreInput {
  const t = o.thread;
  const sub = o.subredditInfo;
  const cited = t.aiCitations.some((c) => c.cited);
  return {
    redditId: t.redditId,
    subreddit: t.subreddit,
    title: t.title,
    body: t.body,
    upVotes: t.upVotes,
    numComments: t.numComments,
    postedAt: t.postedAt,
    isLocked: t.isLocked,
    isArchived: t.isArchived,
    isRemoved: t.isRemoved,
    partialData: t.partialData,
    googlePosition: t.googlePosition?.position ?? null,
    aiChecked: t.aiChecked,
    aiCited: cited,
    subredditTitle: sub?.title ?? "",
    subredditDescription: sub?.publicDescription ?? "",
    subredditTags: [],
    subredditRules: sub?.rules ?? [],
    rulesKnown: sub ? sub.rulesSource !== "unavailable" : false,
    promoBanned: sub?.promoBanned ?? false,
  };
}

const DEAD_REASONS = new Set(["archived", "likely_archived", "locked", "removed"]);

function rescore(o: RedditOpportunity, ctx: ScoreContext) {
  const input = scoreInputOf(o);
  const { score, ...terms } = scoreOpportunity(input, ctx);
  o.score = score;
  o.breakdown = terms;
  o.blockedReason = blockedReasonFor(input, ctx);
  o.lastScoredAt = nowIso();
  // A reply that is already out there is not un-posted by the thread closing.
  if (o.status === "posted" || o.status === "dismissed") return;
  if (o.blockedReason && DEAD_REASONS.has(o.blockedReason)) o.status = "dead";
  else if (o.status === "dead") o.status = "new";
}

function opportunityFromSeed(seed: Seed): RedditOpportunity {
  const sub = String(seed.subreddit);
  const slug = seed.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return {
    id: `opp-${seed.redditId}`,
    threadId: `thr-${seed.redditId}`,
    thread: {
      id: `thr-${seed.redditId}`,
      redditId: seed.redditId,
      subreddit: sub,
      permalink: `https://www.reddit.com/r/${sub}/comments/${seed.redditId}/${slug}/`,
      title: seed.title,
      body: seed.body,
      author: seed.author,
      upVotes: seed.upVotes,
      numComments: seed.numComments,
      postedAt: ago(seed.ageDays),
      isLocked: seed.isLocked ?? false,
      isArchived: seed.isArchived === undefined ? false : seed.isArchived,
      isRemoved: seed.isRemoved ?? false,
      topComments: seed.comments ?? [],
      googlePosition: seed.google
        ? {
            query: seed.keyword,
            position: seed.google.position,
            country: "us",
            device: "desktop",
            checkedAt: ago(seed.google.checkedDaysAgo),
          }
        : null,
      aiCitations: (seed.ai ?? []).map((a) => ({
        engine: a.engine,
        query: seed.keyword,
        cited: a.cited,
        snippet: a.snippet,
        checkedAt: ago(a.daysAgo),
      })),
      aiChecked: (seed.ai ?? []).length > 0,
      partialData: seed.partial ?? false,
      hydratedAt: seed.partial ? null : ago(1),
    },
    subredditInfo: subredditView(sub),
    matchedKeyword: seed.keyword,
    channel: seed.channel,
    status: "new",
    score: 0,
    breakdown: {},
    blockedReason: null,
    dismissReason: "",
    firstSeenAt: ago(Math.min(seed.ageDays, 5)),
    lastScoredAt: nowIso(),
  };
}

/** Fourteen months of real-shaped measurements for the veteran reply. */
function veteranHistory(): MockRedditState["mentions"][string] {
  const serp: Array<[number, number]> = [
    [418, 14],
    [390, 9],
    [362, 6],
    [330, 4],
    [270, 3],
    [180, 2],
    [90, 2],
    [3, 2],
  ];
  const activity: Array<[number, number, number]> = [
    [420, 22, 61],
    [390, 58, 140],
    [330, 84, 205],
    [270, 103, 251],
    [180, 122, 288],
    [90, 134, 306],
    [3, 141, 318],
  ];
  return {
    serpHistory: serp.map(([d, position]) => ({
      query: "project management tool",
      position,
      country: "us",
      device: "desktop",
      checkedAt: ago(d),
    })),
    activity: activity.map(([d, numComments, upVotes]) => ({
      checkedAt: ago(d),
      numComments,
      upVotes,
    })),
  };
}

function seedAccount(s: MockRedditState, ctx: ScoreContext) {
  s.opportunities = SEEDS.filter((seed) => seed.wave !== 2).map(opportunityFromSeed);

  const veteran = s.opportunities.find((o) => o.thread.redditId === VETERAN_THREAD);
  if (veteran) {
    veteran.status = "posted";
    const commentId = "jx4m9qa";
    s.replies = [
      {
        id: uid("rep"),
        opportunityId: veteran.id,
        threadId: veteran.threadId,
        draftId: null,
        permalink: `https://www.reddit.com/r/projectmanagement/comments/${VETERAN_THREAD}/comment/${commentId}/`,
        redditCommentId: commentId,
        status: "confirmed",
        score: 46,
        postedAt: ago(420),
        confirmedAt: ago(419),
        removedAt: null,
        lastCheckedAt: ago(3),
        consecutiveFailures: 0,
        checks: [
          { checkedAt: ago(3), outcome: "found", score: 46, detail: "" },
          { checkedAt: ago(10), outcome: "found", score: 46, detail: "" },
          { checkedAt: ago(419), outcome: "found", score: 2, detail: "" },
        ],
      },
    ];
    s.mentions[veteran.threadId] = veteranHistory();
  }

  for (const o of s.opportunities) rescore(o, ctx);
}

/* ── The clock ──────────────────────────────────────────────────── */

/** Confirms a pasted permalink after a moment. A bare claim is never confirmed. */
function tick(s: MockRedditState) {
  ensureGrant(s);
  const now = Date.now();
  for (const r of s.replies) {
    if (r.status !== "posted") continue;
    if (now - Date.parse(r.postedAt) < POSTED_TO_CONFIRMED_MS) continue;
    r.status = "confirmed";
    r.confirmedAt = nowIso();
    r.lastCheckedAt = r.confirmedAt;
    r.score = 1;
    r.checks.unshift({ checkedAt: r.confirmedAt, outcome: "found", score: 1, detail: "" });
    const thread = s.opportunities.find((o) => o.threadId === r.threadId)?.thread;
    if (thread && !s.mentions[r.threadId]) {
      s.mentions[r.threadId] = {
        serpHistory: thread.googlePosition ? [thread.googlePosition] : [],
        activity: [
          { checkedAt: r.confirmedAt, numComments: thread.numComments, upVotes: thread.upVotes },
        ],
      };
    }
  }
}

/* ── Reads ──────────────────────────────────────────────────────── */

const isOpen = isOpenOpportunity;

export async function getRedditOverview(): Promise<RedditOverview> {
  mutate(tick);
  const s = load();
  const who = access(s);
  const counts = {
    open: s.opportunities.filter(isOpen).length,
    drafted: s.opportunities.filter((o) => o.status === "drafted").length,
    posted: s.replies.length,
    liveMentions: s.replies.filter((r) => r.status === "confirmed").length,
    blocked: s.opportunities.filter((o) => o.blockedReason && o.status !== "posted").length,
  };
  // The gate is enforced here as well as on the page: an unpaid account gets
  // the shape of the feature and none of its contents.
  const open = who === "paid" || who === "lapsed";
  return delay({
    access: who,
    providerConfigured: s.providerConfigured,
    settings: open ? s.settings : null,
    balance: open ? s.balance : { balance: 0, lifetimeSpent: 0, periodEnd: null },
    counts: open ? counts : { open: 0, drafted: 0, posted: 0, liveMentions: 0, blocked: 0 },
    lastSweep: open ? (s.sweeps[0] ?? null) : null,
  });
}

function readable(s: MockRedditState): boolean {
  const who = access(s);
  return who === "paid" || who === "lapsed";
}

export async function listRedditOpportunities(): Promise<RedditOpportunity[]> {
  mutate(tick);
  const s = load();
  if (!readable(s)) return delay([]);
  return delay(
    [...s.opportunities].sort(
      (a, b) => b.score - a.score || a.thread.redditId.localeCompare(b.thread.redditId),
    ),
  );
}

export async function getRedditOpportunity(data: {
  id: string;
}): Promise<RedditOpportunityDetail | null> {
  mutate(tick);
  const s = load();
  if (!readable(s)) return delay(null);
  const opportunity = s.opportunities.find((o) => o.id === data.id);
  if (!opportunity) return delay(null);
  return delay({
    opportunity,
    drafts: s.drafts
      .filter((d) => d.opportunityId === opportunity.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    reply:
      s.replies.find(
        (r) =>
          r.opportunityId === opportunity.id &&
          (r.status === "claimed" || r.status === "posted" || r.status === "confirmed"),
      ) ??
      s.replies.find((r) => r.opportunityId === opportunity.id) ??
      null,
  });
}

export async function listRedditMentions(): Promise<RedditMention[]> {
  mutate(tick);
  const s = load();
  if (!readable(s)) return delay([]);
  const out: RedditMention[] = [];
  for (const reply of s.replies) {
    const o = s.opportunities.find((x) => x.id === reply.opportunityId);
    if (!o) continue;
    const history = s.mentions[reply.threadId];
    out.push({
      reply,
      thread: o.thread,
      subreddit: o.thread.subreddit,
      serpHistory: history?.serpHistory ?? [],
      activity: history?.activity ?? [],
    });
  }
  return delay(out.sort((a, b) => b.reply.postedAt.localeCompare(a.reply.postedAt)));
}

export async function listRedditLedger(): Promise<RedditLedgerEntry[]> {
  const s = load();
  return delay(readable(s) ? s.ledger : []);
}

/* ── Writes ─────────────────────────────────────────────────────── */

export async function enableReddit(patch: RedditSettingsPatch): Promise<RedditSettings> {
  const [profile, content] = await Promise.all([getProfile(), getSettings()]);
  const brand = profile?.brand_name ?? "my product";
  const line = patch.disclosureLine ?? "Full disclosure: I work on {brand}.";
  if (!isValidDisclosureLine(line, brand))
    throw new Error("Your disclosure line has to name your brand and say you work on it.");

  let out!: RedditSettings;
  mutate((s) => {
    requirePaid(s);
    s.settings = {
      enabled: true,
      sweepEnabled: true,
      niche: patch.niche ?? MOCK_ANALYSIS.niche,
      topicTags: patch.topicTags ?? [],
      disclosureLine: line,
      tone: patch.tone ?? content?.tone ?? "plain",
      maxLinksPerReply: patch.maxLinksPerReply ?? 1,
      allowSubreddits: [],
      denySubreddits: [],
      keywordsPerSweep: 12,
      lastSweepAt: null,
      sweepCount: 0,
    };
    out = s.settings;
  });
  return delay(out, 300);
}

export async function runRedditSweep(): Promise<RedditSweepResult> {
  const s0 = load();
  if (access(s0) !== "paid") return delay({ started: false, reason: "not_paid" as const });
  if (!s0.providerConfigured) return delay({ started: false, reason: "unconfigured" as const });
  if (
    s0.settings?.lastSweepAt &&
    Date.now() - Date.parse(s0.settings.lastSweepAt) < MIN_SWEEP_INTERVAL_MS
  )
    return delay({ started: false, reason: "too_soon" as const });

  const ctx = await scoreContext(s0.settings);
  const keywords = ctx.keywords.slice(0, s0.settings?.keywordsPerSweep ?? 12);
  let sweep!: RedditSweep;

  mutate((s) => {
    const first = s.opportunities.length === 0;
    let created = 0;
    if (first) {
      seedAccount(s, ctx);
      created = s.opportunities.length;
    } else {
      // A later sweep finds what is new since the last one.
      for (const seed of SEEDS) {
        if (s.opportunities.some((o) => o.thread.redditId === seed.redditId)) continue;
        const o = opportunityFromSeed(seed);
        rescore(o, ctx);
        s.opportunities.push(o);
        created += 1;
      }
      for (const o of s.opportunities) rescore(o, ctx);
    }
    sweep = {
      id: uid("swp"),
      status: "ok",
      trigger: "manual",
      keywordsUsed: keywords,
      threadsSeen: s.opportunities.length,
      opportunitiesCreated: created,
      error: "",
      startedAt: nowIso(),
      finishedAt: nowIso(),
    };
    s.sweeps.unshift(sweep);
    s.sweeps = s.sweeps.slice(0, 20);
    if (s.settings) {
      s.settings.lastSweepAt = sweep.startedAt;
      s.settings.sweepCount += 1;
    }
  });
  return delay({ started: true as const, sweep }, 1400);
}

async function complianceContextFor(
  s: MockRedditState,
  o: RedditOpportunity,
): Promise<ComplianceContext> {
  const profile = await getProfile();
  return {
    brandName: profile?.brand_name ?? "my product",
    disclosureLine: s.settings?.disclosureLine ?? "Full disclosure: I work on {brand}.",
    maxLinksPerReply: s.settings?.maxLinksPerReply ?? 1,
    subreddit: o.thread.subreddit,
    rules: o.subredditInfo?.rules ?? [],
    rulesKnown: o.subredditInfo ? o.subredditInfo.rulesSource !== "unavailable" : false,
    competitors: MOCK_ANALYSIS.competitors,
  };
}

/** Stands in for the model. Composed from the same parts the real prompt asks for. */
function composeReply(o: RedditOpportunity, ctx: ComplianceContext, instructions: string): string {
  const seed = SEEDS.find((x) => x.redditId === o.thread.redditId);
  const answer =
    seed?.answer ??
    "The short version is to pick the simplest thing that everybody on the team will actually open every day, and revisit it in three months rather than trying to choose the perfect tool up front.";
  const parts = [
    resolveDisclosure(ctx.disclosureLine, ctx.brandName),
    answer,
    "Our free tier covers up to 5 people with boards and simple automations, so it may be worth a look for where you are now.",
    "Trello is solid too if all you need is boards.",
  ];
  if (/short|brief|concise/i.test(instructions)) parts.splice(3, 1);
  return parts.join(" ");
}

/** Refusals that must happen BEFORE a credit is spent, mirroring the server. */
function draftRefusal(s: MockRedditState, o: RedditOpportunity): string | null {
  if (o.blockedReason === "promo_banned" || readRules(o.subredditInfo?.rules ?? []).promoBanned)
    return `r/${o.thread.subreddit} bans self-promotion, so Rankbox won't draft for it.`;
  if (o.blockedReason) return "This thread can't be replied to any more.";
  if (
    s.replies.some(
      (r) => r.threadId === o.threadId && r.status !== "removed" && r.status !== "not_found",
    )
  )
    return "You've already replied in this thread. One reply per thread.";
  return null;
}

export async function generateRedditDraft(data: {
  opportunityId: string;
  instructions?: string;
}): Promise<RedditDraft> {
  const s0 = load();
  requirePaid(s0);
  const o = s0.opportunities.find((x) => x.id === data.opportunityId);
  if (!o) throw new Error("That thread isn't in your list any more.");
  const refusal = draftRefusal(s0, o);
  if (refusal) throw new Error(refusal);
  if (s0.balance.balance < REDDIT_DRAFT_COST)
    throw new Error("You're out of Reddit reply credits for this cycle.");

  const cctx = await complianceContextFor(s0, o);
  const body = composeReply(o, cctx, data.instructions ?? "");
  let draft!: RedditDraft;
  mutate((s) => {
    s.balance.balance -= REDDIT_DRAFT_COST;
    s.balance.lifetimeSpent += REDDIT_DRAFT_COST;
    ledger(s, "spend", -REDDIT_DRAFT_COST, `reply draft · r/${o.thread.subreddit}`);
    draft = {
      id: uid("drf"),
      opportunityId: o.id,
      body,
      editedBody: null,
      model: "mock-composer",
      compliance: checkReply(body, cctx),
      creditsSpent: REDDIT_DRAFT_COST,
      regenCount: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    s.drafts.unshift(draft);
    const live = s.opportunities.find((x) => x.id === o.id);
    if (live && live.status === "new") live.status = "drafted";
  });
  return delay(draft, 1600);
}

export async function regenerateRedditDraft(data: {
  draftId: string;
  instructions: string;
}): Promise<RedditDraft> {
  const s0 = load();
  requirePaid(s0);
  const prev = s0.drafts.find((d) => d.id === data.draftId);
  if (!prev) throw new Error("That draft no longer exists.");
  if (prev.regenCount >= MAX_DRAFT_REGENS)
    throw new Error("That's the limit for rewrites on one reply. Edit it by hand from here.");
  const o = s0.opportunities.find((x) => x.id === prev.opportunityId);
  if (!o) throw new Error("That thread isn't in your list any more.");

  // The first rewrite of a draft that failed its checks is on us.
  const free = prev.regenCount === 0 && !prev.compliance.pass;
  if (!free && s0.balance.balance < REDDIT_DRAFT_COST)
    throw new Error("You're out of Reddit reply credits for this cycle.");

  const cctx = await complianceContextFor(s0, o);
  const body = composeReply(o, cctx, data.instructions);
  let out!: RedditDraft;
  mutate((s) => {
    if (free) ledger(s, "adjust", 0, "free rewrite — first draft failed its checks");
    else {
      s.balance.balance -= REDDIT_DRAFT_COST;
      s.balance.lifetimeSpent += REDDIT_DRAFT_COST;
      ledger(s, "spend", -REDDIT_DRAFT_COST, `reply rewrite · r/${o.thread.subreddit}`);
    }
    const d = s.drafts.find((x) => x.id === data.draftId);
    if (!d) return;
    d.body = body;
    d.editedBody = null;
    d.compliance = checkReply(body, cctx);
    d.regenCount += 1;
    d.creditsSpent += free ? 0 : REDDIT_DRAFT_COST;
    d.updatedAt = nowIso();
    out = d;
  });
  return delay(out, 1600);
}

/** Free. Re-runs the pure checker on whatever the member typed. */
export async function updateRedditDraft(data: {
  draftId: string;
  body: string;
}): Promise<RedditDraft> {
  const s0 = load();
  requirePaid(s0);
  const prev = s0.drafts.find((d) => d.id === data.draftId);
  if (!prev) throw new Error("That draft no longer exists.");
  const o = s0.opportunities.find((x) => x.id === prev.opportunityId);
  if (!o) throw new Error("That thread isn't in your list any more.");
  const cctx = await complianceContextFor(s0, o);
  let out!: RedditDraft;
  mutate((s) => {
    const d = s.drafts.find((x) => x.id === data.draftId);
    if (!d) return;
    d.editedBody = data.body.trim() === d.body.trim() ? null : data.body;
    d.compliance = checkReply(data.body, cctx);
    d.updatedAt = nowIso();
    out = d;
  });
  return delay(out, 120);
}

export async function markRedditReplyPosted(data: {
  opportunityId: string;
  permalink?: string;
  draftId?: string;
}): Promise<RedditReply> {
  const s0 = load();
  requirePaid(s0);
  const o = s0.opportunities.find((x) => x.id === data.opportunityId);
  if (!o) throw new Error("That thread isn't in your list any more.");

  const link = data.permalink?.trim();
  if (link) {
    const problem = permalinkProblem(link, o.thread.redditId);
    if (problem) throw new Error(problem);
  }
  const parsed = link ? parsePermalink(link) : null;

  let reply!: RedditReply;
  mutate((s) => {
    const existing = s.replies.find((r) => r.opportunityId === o.id && r.status === "claimed");
    if (existing && parsed) {
      // A claim upgraded with a link: now it can be checked.
      existing.permalink = parsed.canonical;
      existing.redditCommentId = parsed.commentId;
      existing.status = "posted";
      existing.postedAt = nowIso();
      reply = existing;
    } else {
      reply = {
        id: uid("rep"),
        opportunityId: o.id,
        threadId: o.threadId,
        draftId: data.draftId ?? null,
        permalink: parsed?.canonical ?? null,
        redditCommentId: parsed?.commentId ?? null,
        status: parsed ? "posted" : "claimed",
        score: null,
        postedAt: nowIso(),
        confirmedAt: null,
        removedAt: null,
        lastCheckedAt: null,
        consecutiveFailures: 0,
        checks: [],
      };
      s.replies.unshift(reply);
    }
    const live = s.opportunities.find((x) => x.id === o.id);
    if (live) live.status = "posted";
  });
  return delay(reply, 400);
}

export async function verifyRedditReply(data: { replyId: string }): Promise<{ outcome: string }> {
  requirePaid(load());
  let outcome = "missing";
  mutate((s) => {
    const r = s.replies.find((x) => x.id === data.replyId);
    if (!r) throw new Error("That reply isn't on file.");
    // A bare claim has no link, so there is nothing to look at.
    if (r.status !== "posted" && r.status !== "confirmed") return;
    const at = nowIso();
    r.status = "confirmed";
    r.confirmedAt = r.confirmedAt ?? at;
    r.lastCheckedAt = at;
    r.score = r.score ?? 1;
    r.checks.unshift({ checkedAt: at, outcome: "found", score: r.score, detail: "" });
    outcome = "found";
  });
  return delay({ outcome }, 900);
}

export async function dismissRedditOpportunity(data: {
  id: string;
  reason?: string;
}): Promise<{ ok: true }> {
  mutate((s) => {
    requirePaid(s);
    const o = s.opportunities.find((x) => x.id === data.id);
    if (o && o.status !== "posted") {
      o.status = "dismissed";
      o.dismissReason = data.reason ?? "";
    }
  });
  return delay({ ok: true as const });
}

export async function restoreRedditOpportunity(data: { id: string }): Promise<{ ok: true }> {
  const s0 = load();
  requirePaid(s0);
  const ctx = await scoreContext(s0.settings);
  mutate((s) => {
    const o = s.opportunities.find((x) => x.id === data.id);
    if (o && o.status === "dismissed") {
      o.status = s.drafts.some((d) => d.opportunityId === o.id) ? "drafted" : "new";
      o.dismissReason = "";
      rescore(o, ctx);
    }
  });
  return delay({ ok: true as const });
}

export async function updateRedditSettings(patch: RedditSettingsPatch): Promise<RedditSettings> {
  const s0 = load();
  requirePaid(s0);
  if (!s0.settings) throw new Error("Set up Reddit presence first.");
  if (patch.disclosureLine !== undefined) {
    const brand = (await getProfile())?.brand_name ?? "my product";
    if (!isValidDisclosureLine(patch.disclosureLine, brand))
      throw new Error("Your disclosure line has to name your brand and say you work on it.");
  }
  const next: RedditSettings = {
    ...s0.settings,
    ...patch,
    niche: patch.niche ?? s0.settings.niche,
    allowSubreddits: (patch.allowSubreddits ?? s0.settings.allowSubreddits)
      .map(normalizeSubreddit)
      .filter(Boolean),
    denySubreddits: (patch.denySubreddits ?? s0.settings.denySubreddits)
      .map(normalizeSubreddit)
      .filter(Boolean),
    maxLinksPerReply: Math.min(
      1,
      Math.max(0, patch.maxLinksPerReply ?? s0.settings.maxLinksPerReply),
    ),
  };
  // Settings change what counts as an opportunity, so everything is re-ranked.
  const ctx = await scoreContext(next);
  mutate((s) => {
    s.settings = next;
    for (const o of s.opportunities) rescore(o, ctx);
  });
  return delay(next, 300);
}

/* ── Mock-only review switches ──────────────────────────────────── */

/** View the page as another kind of account. Null returns to the real state. */
export async function setMockRedditAccess(value: RedditAccess | null): Promise<void> {
  mutate((s) => {
    s.accessOverride = value;
  });
  return delay(undefined, 120);
}

/** Pretend no discovery provider is configured, to review that state. */
export async function setMockRedditProvider(configured: boolean): Promise<void> {
  mutate((s) => {
    s.providerConfigured = configured;
  });
  return delay(undefined, 120);
}

export function getMockRedditSwitches(): { access: RedditAccess | null; provider: boolean } {
  const s = load();
  return { access: s.accessOverride, provider: s.providerConfigured };
}

export function resetMockReddit() {
  cache = { key: storageKey(), state: emptyState() };
  save();
}
