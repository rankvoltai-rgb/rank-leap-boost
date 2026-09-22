/**
 * Seed data for mock mode (VITE_MOCK_DATA=1).
 *
 * Shapes mirror the real Supabase rows in src/lib/api.ts exactly, so the
 * screens built against the mock render identically once phase 2 swaps the
 * real data layer back in.
 */
import type { SiteMeta } from "@/lib/site-meta";
import type {
  Blog,
  ContentSettings,
  CreditAccount,
  Keyword,
  Profile,
  Subscription,
} from "@/lib/api";

export const MOCK_USER_ID = "mock-user-0001";
/** The demo account's one site. Studio sites added in mock mode get their own ids. */
export const MOCK_SITE_ID = "mock-site-1";
export const MOCK_USER_EMAIL = "founder@plannora.io";
export const MOCK_USER_NAME = "Alex Rivera";

/** Re-exported so fixtures and the real scraper describe the same shape. */
export type { SiteMeta } from "@/lib/site-meta";

/** A keyword row before it is persisted — what Part 2 edits. */
export interface DraftKeyword {
  id: string;
  name: string;
  search_volume: number;
  intent: string;
  trend: string;
  /** true when the user typed it rather than the analysis finding it. */
  manual?: boolean;
}

/** One proposed article — what Part 3 previews. */
export interface DraftTitle {
  id: string;
  title: string;
  description: string;
  keyword: string;
  traffic_estimate: number;
  competition: string;
  ai_signal: number;
}

export const MOCK_SITE_META: SiteMeta = {
  url: "https://plannora.io",
  domain: "plannora.io",
  brandName: "Plannora",
  title: "Plannora — Simple project management for small teams",
  description:
    "Plannora is a lightweight project management tool for small startup teams. Simple boards, built-in automations, and a free tier for up to 5 people.",
  logoUrl: null,
  faviconUrl: null,
  themeColor: "#1877f2",
  logoSource: "og:image",
  via: "mock",
};

export const MOCK_PROFILE: Profile = {
  id: MOCK_SITE_ID,
  user_id: MOCK_USER_ID,
  kind: "primary",
  status: "active",
  billed_from: null,
  removes_at: null,
  archived_at: null,
  created_at: "2026-06-01T00:00:00.000Z",
  brand_name: "Plannora",
  website_url: "https://plannora.io",
  product_description:
    "Project management SaaS. Services: task boards, automations, team planning, reporting. Audience: startup founders and small product teams.",
  avatar_url: null,
};

export const MOCK_SETTINGS: ContentSettings = {
  id: "mock-settings-1",
  user_id: MOCK_USER_ID,
  site_id: MOCK_SITE_ID,
  tone: "Confident, practical",
  writing_style: "Balanced",
  audience: "Startup founders and small product teams (2–20 people)",
  brand_voice:
    "Niche: project management SaaS. Geo: North America & Europe. Plain-spoken, specific, no hype.",
  status_online: true,
  autopilot_enabled: false,
  weekly_cadence: 7,
  last_autopilot_run: null,
};

export const MOCK_CREDITS: CreditAccount = {
  id: "mock-credits-1",
  user_id: MOCK_USER_ID,
  site_id: MOCK_SITE_ID,
  credits_used: 0,
  credits_total: 30,
};

/** No subscription until the mock trial is started from the dashboard. */
export const MOCK_SUBSCRIPTION: Subscription | null = null;

export const MOCK_ANALYSIS = {
  niche: "Project management software for small teams",
  services: ["Task boards", "Workflow automations", "Team planning", "Reporting & dashboards"],
  audience: "Startup founders and small product teams (2–20 people)",
  geo: "North America & Europe",
  brand_tone: "Confident, practical, plain-spoken",
  competitors: ["Asana", "Trello", "Linear", "ClickUp", "Notion"],
  existing_content:
    "12 published pages, mostly product and pricing. Two blog posts, neither targeting a buying question.",
  internal_linking: "Weak — no topic hubs, and the blog posts do not link into the product pages.",
  missing_opportunities: [
    "No comparison pages against the tools buyers already shortlist",
    "No pricing-intent content, despite a free tier that is a genuine differentiator",
    "Nothing addressing team size, which is how buyers actually self-select",
  ],
  semantic_clusters: [
    "Project management for small teams",
    "Tool comparisons & alternatives",
    "Team workflow automation",
    "Free-tier & pricing evaluation",
  ],
  ai_visibility: [
    "Cited by ChatGPT for 2 of 18 tracked buying questions",
    "Absent from Perplexity answers on 'best PM tool for startups'",
    "Google AI Overviews cite competitors for pricing comparisons",
  ],
};

const KEYWORD_SEED: Array<[string, number, string, string]> = [
  ["best project management tool for small teams", 8100, "Commercial", "Rising"],
  ["project management software for startups", 6600, "Commercial", "Rising"],
  ["free project management tools", 14800, "Commercial", "Steady"],
  ["asana alternatives", 5400, "Commercial", "Rising"],
  ["trello vs asana", 4400, "Commercial", "Steady"],
  ["simple task management app", 3600, "Commercial", "Rising"],
  ["how to organize a small team", 2900, "Informational", "Steady"],
  ["project management for 5 person team", 1900, "Commercial", "Rising"],
  ["linear vs jira", 2400, "Commercial", "Rising"],
  ["workflow automation for small business", 3300, "Commercial", "Rising"],
  ["kanban board software", 9900, "Commercial", "Steady"],
  ["clickup alternatives", 2900, "Commercial", "Rising"],
  ["team collaboration tools 2026", 4800, "Commercial", "Rising"],
  ["project tracking spreadsheet template", 6600, "Informational", "Declining"],
  ["agile tools for non technical teams", 1600, "Informational", "Rising"],
  ["notion vs trello for project management", 2100, "Commercial", "Steady"],
  ["cheapest project management software", 1300, "Commercial", "Steady"],
  ["startup productivity stack", 1100, "Informational", "Rising"],
  ["how to run a sprint with a small team", 880, "Informational", "Steady"],
  ["project management onboarding checklist", 720, "Informational", "Rising"],
  ["remote team project management", 3900, "Commercial", "Steady"],
  ["best free kanban app", 2600, "Commercial", "Rising"],
  ["task management vs project management", 1900, "Informational", "Steady"],
  ["pm tool with free tier", 590, "Commercial", "Rising"],
];

export const MOCK_DRAFT_KEYWORDS: DraftKeyword[] = KEYWORD_SEED.map(
  ([name, search_volume, intent, trend], i) => ({
    id: `kw-${i + 1}`,
    name,
    search_volume,
    intent,
    trend,
  }),
);

export const MOCK_KEYWORDS: Keyword[] = MOCK_DRAFT_KEYWORDS.map((k, i) => ({
  id: k.id,
  user_id: MOCK_USER_ID,
  site_id: MOCK_SITE_ID,
  name: k.name,
  tag: k.intent,
  search_volume: k.search_volume,
  traffic_estimate: Math.round(k.search_volume * 0.14),
  intent: k.intent,
  trend: k.trend,
  source: i < 4 ? "library" : "discovered",
  created_at: "2026-09-01T10:00:00.000Z",
}));

const TITLE_SEED: Array<[string, string, number, string, number]> = [
  [
    "The Best Project Management Tools for Small Teams in 2026",
    "best project management tool for small teams",
    2400,
    "Medium",
    88,
  ],
  ["Asana Alternatives That Actually Fit a 5-Person Team", "asana alternatives", 1850, "Low", 84],
  [
    "Free Project Management Tools: What You Really Get",
    "free project management tools",
    3100,
    "High",
    79,
  ],
  ["Trello vs Asana vs Plannora: An Honest Comparison", "trello vs asana", 1620, "Medium", 82],
  [
    "Project Management Software for Startups: A Buyer's Guide",
    "project management software for startups",
    2050,
    "Medium",
    86,
  ],
  [
    "How to Organize a Small Team Without Drowning in Process",
    "how to organize a small team",
    1180,
    "Low",
    74,
  ],
  [
    "Kanban Board Software: Which One Fits Your Workflow?",
    "kanban board software",
    2780,
    "High",
    77,
  ],
  [
    "Workflow Automation for Small Business: Start Here",
    "workflow automation for small business",
    1340,
    "Low",
    81,
  ],
  [
    "ClickUp Alternatives for Teams Who Want Less Software",
    "clickup alternatives",
    1090,
    "Low",
    80,
  ],
  ["Linear vs Jira: Which Suits a Small Product Team?", "linear vs jira", 940, "Medium", 78],
  [
    "The Startup Productivity Stack That Doesn't Overwhelm",
    "startup productivity stack",
    620,
    "Low",
    72,
  ],
  [
    "Remote Team Project Management: What Actually Works",
    "remote team project management",
    1520,
    "Medium",
    76,
  ],
  ["Simple Task Management Apps Worth Your Time", "simple task management app", 1410, "Medium", 75],
  [
    "Notion vs Trello for Project Management",
    "notion vs trello for project management",
    880,
    "Medium",
    73,
  ],
  [
    "Project Management for a 5-Person Team: A Practical Setup",
    "project management for 5 person team",
    760,
    "Low",
    83,
  ],
  [
    "Team Collaboration Tools in 2026: The Shortlist",
    "team collaboration tools 2026",
    1690,
    "High",
    71,
  ],
  [
    "Best Free Kanban Apps (And Where the Free Tier Ends)",
    "best free kanban app",
    1020,
    "Medium",
    79,
  ],
  [
    "Task Management vs Project Management: The Real Difference",
    "task management vs project management",
    690,
    "Low",
    70,
  ],
  ["Agile Tools for Non-Technical Teams", "agile tools for non technical teams", 540, "Low", 74],
  [
    "How to Run a Sprint With a Small Team",
    "how to run a sprint with a small team",
    410,
    "Low",
    69,
  ],
  [
    "The Cheapest Project Management Software That's Still Good",
    "cheapest project management software",
    580,
    "Medium",
    72,
  ],
  [
    "A Project Management Onboarding Checklist for New Teams",
    "project management onboarding checklist",
    330,
    "Low",
    68,
  ],
  ["PM Tools With a Real Free Tier (Not a Trial)", "pm tool with free tier", 290, "Low", 81],
  [
    "Why Project Tracking Spreadsheets Break at 5 People",
    "project tracking spreadsheet template",
    2150,
    "High",
    66,
  ],
  [
    "Choosing a PM Tool by Team Size, Not Feature Count",
    "project management for 5 person team",
    470,
    "Low",
    77,
  ],
  [
    "What Small Teams Get Wrong About Workflow Automation",
    "workflow automation for small business",
    610,
    "Low",
    75,
  ],
  [
    "The Hidden Cost of Free Project Management Tools",
    "free project management tools",
    1240,
    "Medium",
    78,
  ],
  ["Migrating From Trello Without Losing Your Board History", "trello vs asana", 520, "Low", 73],
  [
    "Sprint Planning for Teams That Don't Do Scrum",
    "how to run a sprint with a small team",
    380,
    "Low",
    70,
  ],
  [
    "The Small-Team Guide to Reporting Without Busywork",
    "startup productivity stack",
    340,
    "Low",
    67,
  ],
];

export const MOCK_DRAFT_TITLES: DraftTitle[] = TITLE_SEED.map(
  ([title, keyword, traffic_estimate, competition, ai_signal], i) => ({
    id: `title-${i + 1}`,
    title,
    description: `A source-backed article targeting "${keyword}", written to be quotable by AI answer engines.`,
    keyword,
    traffic_estimate,
    competition,
    ai_signal,
  }),
);

function isoDaysFromNow(days: number): string {
  // Fixed base date keeps mock rows stable between renders.
  const base = new Date("2026-09-05T09:00:00.000Z").getTime();
  return new Date(base + days * 86_400_000).toISOString();
}

export function draftTitleToBlog(t: DraftTitle, index: number): Blog {
  return {
    id: t.id,
    user_id: MOCK_USER_ID,
    site_id: MOCK_SITE_ID,
    title: t.title,
    description: t.description,
    body: "",
    status: index < 4 ? "opportunity" : "scheduled",
    tags: [],
    keyword: t.keyword,
    seo_score: 0,
    traffic_estimate: t.traffic_estimate,
    competition: t.competition,
    ai_signal: t.ai_signal,
    scheduled_date: index < 4 ? null : isoDaysFromNow(index - 3).slice(0, 10),
    queue_position: index < 4 ? null : index - 3,
    notes: "",
    created_at: "2026-09-01T10:00:00.000Z",
    updated_at: "2026-09-01T10:00:00.000Z",
  };
}

export const MOCK_BLOGS: Blog[] = MOCK_DRAFT_TITLES.map(draftTitleToBlog);
