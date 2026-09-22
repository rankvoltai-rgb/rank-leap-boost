/**
 * robots.txt: the bot catalog, a parser, and the RFC 9309 matcher.
 *
 * Pure and dependency-free so the same code runs in the browser (tester,
 * generator, log analyzer) and on the server (readiness check).
 */

export type BotRole = "search" | "user" | "training";

export interface Bot {
  /** The User-agent token as the vendor documents it. */
  token: string;
  vendor: string;
  role: BotRole;
  purpose: string;
  /** Whether it is a real crawler, or a robots.txt token that governs another one. */
  tokenOnly?: boolean;
  /** Vendor says it may not honor robots.txt. */
  ignoresRobots?: boolean;
}

export const BOT_ROLES: Record<BotRole, { label: string; blurb: string }> = {
  search: {
    label: "AI search index",
    blurb:
      "Builds the index an engine cites from. Block it and you drop out of that engine's answers.",
  },
  user: {
    label: "Live fetch",
    blurb: "Reads a page mid-conversation because a person asked. Each hit is a real question.",
  },
  training: {
    label: "Model training",
    blurb:
      "Collects text for future models. Your call: opting out protects content, and the next model knows less about you.",
  },
};

/** The bots that matter for AI visibility, as documented in September 2026. */
export const AI_BOTS: Bot[] = [
  { token: "OAI-SearchBot", vendor: "OpenAI", role: "search", purpose: "ChatGPT search index" },
  {
    token: "ChatGPT-User",
    vendor: "OpenAI",
    role: "user",
    purpose: "ChatGPT reads a page for a user",
    ignoresRobots: true,
  },
  {
    token: "GPTBot",
    vendor: "OpenAI",
    role: "training",
    purpose: "Training data for OpenAI models",
  },
  {
    token: "Claude-SearchBot",
    vendor: "Anthropic",
    role: "search",
    purpose: "Claude search index",
  },
  {
    token: "Claude-User",
    vendor: "Anthropic",
    role: "user",
    purpose: "Claude reads a page for a user",
  },
  {
    token: "ClaudeBot",
    vendor: "Anthropic",
    role: "training",
    purpose: "Training data for Claude",
  },
  {
    token: "PerplexityBot",
    vendor: "Perplexity",
    role: "search",
    purpose: "Perplexity search index",
  },
  {
    token: "Perplexity-User",
    vendor: "Perplexity",
    role: "user",
    purpose: "Perplexity reads a page for a user",
    ignoresRobots: true,
  },
  {
    token: "Google-Extended",
    vendor: "Google",
    role: "training",
    purpose: "Gemini training & grounding",
    tokenOnly: true,
  },
  {
    token: "Applebot-Extended",
    vendor: "Apple",
    role: "training",
    purpose: "Apple foundation model training",
    tokenOnly: true,
  },
  {
    token: "CCBot",
    vendor: "Common Crawl",
    role: "training",
    purpose: "Open archive used to train many models",
  },
  {
    token: "Bytespider",
    vendor: "ByteDance",
    role: "training",
    purpose: "TikTok / Doubao training",
  },
  { token: "meta-externalagent", vendor: "Meta", role: "training", purpose: "Meta AI training" },
  { token: "Amazonbot", vendor: "Amazon", role: "search", purpose: "Alexa answers" },
  {
    token: "DuckAssistBot",
    vendor: "DuckDuckGo",
    role: "search",
    purpose: "DuckDuckGo AI answers",
  },
];

/** Classic search crawlers, for comparison in the log analyzer and tester. */
export const SEARCH_BOTS: Bot[] = [
  {
    token: "Googlebot",
    vendor: "Google",
    role: "search",
    purpose: "Google Search, AI Overviews, AI Mode",
  },
  { token: "Bingbot", vendor: "Microsoft", role: "search", purpose: "Bing and Copilot" },
];

export const ALL_BOTS = [...SEARCH_BOTS, ...AI_BOTS];

/* ---------- parser ---------- */

export interface RobotsRule {
  type: "allow" | "disallow";
  path: string;
  line: number;
}

export interface RobotsGroup {
  agents: string[];
  rules: RobotsRule[];
  /** First line of the group, for diagnostics. */
  line: number;
}

export interface RobotsFile {
  groups: RobotsGroup[];
  sitemaps: string[];
}

export function parseRobots(text: string): RobotsFile {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  // A run of User-agent lines opens one group; the first rule closes the run.
  let collecting = false;

  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) return;
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) return;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    const n = i + 1;

    if (key === "user-agent") {
      if (!current || !collecting) {
        current = { agents: [], rules: [], line: n };
        groups.push(current);
        collecting = true;
      }
      current.agents.push(value.toLowerCase());
    } else if (key === "allow" || key === "disallow") {
      if (!current) return;
      collecting = false;
      current.rules.push({ type: key, path: value, line: n });
    } else if (key === "sitemap") {
      if (value) sitemaps.push(value);
    } else {
      collecting = false;
    }
  });
  return { groups, sitemaps };
}

/* ---------- matcher ---------- */

export interface RobotsVerdict {
  allowed: boolean;
  /** The group that applied: its agents, or null when no group matched. */
  group: RobotsGroup | null;
  /** The rule that decided it, or null when the group had no matching rule. */
  rule: RobotsRule | null;
  reason: string;
}

function patternToRegex(pattern: string): RegExp {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`);
}

/** Path + query of a URL or a bare path, as a crawler would match it. */
export function pathOf(input: string): string {
  const t = input.trim();
  if (!t) return "/";
  try {
    const u = new URL(/^[a-z]+:\/\//i.test(t) ? t : `https://${t}`);
    return `${u.pathname}${u.search}` || "/";
  } catch {
    return t.startsWith("/") ? t : `/${t}`;
  }
}

/**
 * Chooses the group whose agent best matches `userAgent` (longest token that
 * is a prefix of the product token wins; `*` only if nothing else matched), then
 * the longest matching rule; Allow wins a tie.
 */
export function checkRobots(file: RobotsFile, userAgent: string, path: string): RobotsVerdict {
  const ua = userAgent.toLowerCase();
  let group: RobotsGroup | null = null;
  let best = -1;
  for (const g of file.groups) {
    for (const a of g.agents) {
      if (a === "*") continue;
      if ((ua.startsWith(a) || a.startsWith(ua)) && a.length > best) {
        best = a.length;
        group = g;
      }
    }
  }
  if (!group) group = file.groups.find((g) => g.agents.includes("*")) ?? null;
  if (!group) {
    return {
      allowed: true,
      group: null,
      rule: null,
      reason: "No group applies to this bot, so everything is allowed.",
    };
  }

  let rule: RobotsRule | null = null;
  for (const r of group.rules) {
    if (!r.path) continue; // "Disallow:" (empty) allows everything
    if (!patternToRegex(r.path).test(path)) continue;
    if (
      !rule ||
      r.path.length > rule.path.length ||
      (r.path.length === rule.path.length && r.type === "allow" && rule.type === "disallow")
    ) {
      rule = r;
    }
  }
  if (!rule) {
    return {
      allowed: true,
      group,
      rule: null,
      reason: "No rule in the group matches this path, so it is allowed.",
    };
  }
  return {
    allowed: rule.type === "allow",
    group,
    rule,
    reason: `Line ${rule.line}: ${rule.type === "allow" ? "Allow" : "Disallow"}: ${rule.path} is the most specific match.`,
  };
}

/** A friendly label for a group's agents. */
export function agentsLabel(group: RobotsGroup): string {
  return group.agents.map((a) => (a === "*" ? "* (all bots)" : a)).join(", ");
}
