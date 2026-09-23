/**
 * The reply checker, pure. It runs on the model's draft, again on every edit
 * the member makes, and in the mock — one function, so the verdict a member
 * sees never depends on which path produced the text.
 *
 * It is kept out of the writer on purpose. The model that wrote a reply is the
 * wrong judge of whether it is spam; these are mechanical rules a person can
 * read, and a test can pin.
 *
 * A check has three states, not two. `unknown` means we could not run it —
 * we never read the subreddit's rules, or the rule is about the member's
 * posting history, which we cannot see. It renders as a grey dash with the
 * thing to go and check. It is never rounded up to a pass, because a tick we
 * did not earn teaches the member to stop reading the checklist.
 */
import { readRules } from "./rules";
import {
  MAX_DRAFT_CHARS,
  MIN_DRAFT_CHARS,
  type ComplianceCheck,
  type ComplianceReport,
} from "./types";

export interface ComplianceContext {
  brandName: string;
  /** The member's disclosure line. May contain the literal `{brand}`. */
  disclosureLine: string;
  maxLinksPerReply: number;
  subreddit: string;
  rules: string[];
  /** False when the rules could not be fetched — distinct from there being none. */
  rulesKnown: boolean;
  /** Named competitors, so a reply can be checked for running them down. */
  competitors: string[];
}

const BRAND_TOKEN = /\{brand\}/gi;
/** Non-global twin for `.test()` — a /g regex carries `lastIndex` between calls. */
const HAS_BRAND_TOKEN = /\{brand\}/i;

/** The disclosure line as it will appear in a reply. */
export function resolveDisclosure(line: string, brandName: string): string {
  return line.replace(BRAND_TOKEN, brandName.trim()).replace(/\s+/g, " ").trim();
}

/**
 * Whether a disclosure line is acceptable as a setting. Enforced on the server
 * as well as in the form: the checker validates drafts against a string the
 * member controls, so a line of "." would make the mandatory check meaningless.
 */
export function isValidDisclosureLine(line: string, brandName: string): boolean {
  const text = line.trim();
  if (text.length < 10 || text.length > 200) return false;
  const brand = brandName.trim().toLowerCase();
  const namesBrand =
    HAS_BRAND_TOKEN.test(text) || (brand.length > 0 && text.toLowerCase().includes(brand));
  return namesBrand && DISCLOSURE_PHRASE.test(text);
}

/** Wording that actually says "I am connected to this", in the first person. */
const DISCLOSURE_PHRASE =
  /\b(?:full\s+disclosure|disclosure|disclaimer|i\s+work\s+(?:on|at|for|with)|i\s*['’]?m\s+(?:the\s+|a\s+|one\s+of\s+the\s+)?(?:co[-\s]?)?(?:founder|developer|dev|maker|creator|builder|owner|ceo|cto|employee|engineer)|i\s+am\s+(?:the\s+|a\s+|one\s+of\s+the\s+)?(?:co[-\s]?)?(?:founder|developer|dev|maker|creator|builder|owner|ceo|cto|employee|engineer)|i\s+(?:built|made|created|founded|run|started|co[-\s]?founded)|i\s*['’]?m\s+(?:with|from|affiliated)|i\s+am\s+(?:with|from|affiliated)|affiliated\s+with|my\s+(?:company|product|startup|tool|app|team|employer)|we\s+(?:built|make|made)|biased)\b/i;

export const MARKETING_VOICE: Array<{ pattern: RegExp; word: string }> = [
  { pattern: /\bgame[-\s]?chang(?:er|ing)\b/i, word: "game-changer" },
  { pattern: /\brevolution(?:ary|i[sz]e[sd]?|i[sz]ing)\b/i, word: "revolutionary" },
  { pattern: /\b(?:10|ten)\s*x\b/i, word: "10x" },
  { pattern: /\bcutting[-\s]?edge\b/i, word: "cutting-edge" },
  { pattern: /\bbest[-\s]in[-\s]class\b/i, word: "best-in-class" },
  { pattern: /\bworld[-\s]class\b/i, word: "world-class" },
  { pattern: /\bseamless(?:ly)?\b/i, word: "seamless" },
  { pattern: /\bsupercharge[sd]?\b/i, word: "supercharge" },
  {
    pattern: /\bunlock(?:s|ing)?\s+(?:the\s+)?(?:power|potential|growth)\b/i,
    word: "unlock the power",
  },
  { pattern: /\bnext[-\s]level\b/i, word: "next-level" },
  { pattern: /\ball[-\s]in[-\s]one\s+solution\b/i, word: "all-in-one solution" },
  {
    pattern:
      /\b(?:sign\s+up|try\s+it|get\s+started|book\s+a\s+demo|start\s+your\s+free\s+trial)\s+(?:today|now)\b/i,
    word: "a call to action",
  },
  {
    pattern:
      /\b(?:limited\s+time|act\s+now|don['’]?t\s+miss\s+out|special\s+offer|discount\s+code|promo\s+code)\b/i,
    word: "an offer",
  },
  { pattern: /\bleverage[sd]?\b/i, word: "leverage" },
  { pattern: /\bsynerg(?:y|ies|istic)\b/i, word: "synergy" },
  { pattern: /!{2,}/, word: "stacked exclamation marks" },
];

const SMEAR =
  /\b(?:sucks?|terrible|awful|garbage|trash|worst|scam|scammy|useless|junk|joke|crap|horrible|avoid|stay\s+away|never\s+use|don['’]?t\s+use|waste\s+of|rip[-\s]?off|dead|dying)\b/i;

const URL_PATTERN = /\bhttps?:\/\/[^\s)\]>]+|\bwww\.[^\s)\]>]+/gi;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Links in a reply. A markdown link and its URL are one link, not two. */
export function countLinks(body: string): number {
  return (body.match(URL_PATTERN) ?? []).length;
}

function containsBrand(text: string, brandName: string): boolean {
  const brand = normalize(brandName);
  if (!brand) return false;
  return ` ${normalize(text)} `.includes(` ${brand} `);
}

function hasDisclosure(body: string, ctx: ComplianceContext): boolean {
  const line = normalize(resolveDisclosure(ctx.disclosureLine, ctx.brandName));
  // Padded so the match is on whole words: "plannora" must not be satisfied
  // by "plannorama".
  if (line && ` ${normalize(body)} `.includes(` ${line} `)) return true;
  // The member may reword it. What matters is that one sentence both names the
  // brand and says, in the first person, that they are connected to it.
  return sentences(body).some((s) => containsBrand(s, ctx.brandName) && DISCLOSURE_PHRASE.test(s));
}

function check(
  id: string,
  label: string,
  state: ComplianceCheck["state"],
  detail: string,
): ComplianceCheck {
  return { id, label, state, detail };
}

export function checkReply(rawBody: string, ctx: ComplianceContext): ComplianceReport {
  const body = rawBody.trim();
  const parts = sentences(body);
  const links = countLinks(body);
  const sub = ctx.subreddit ? `r/${ctx.subreddit.replace(/^r\//i, "")}` : "this subreddit";
  const checks: ComplianceCheck[] = [];

  /* 1. Disclosure. Mandatory, and there is no setting that turns it off. */
  checks.push(
    hasDisclosure(body, ctx)
      ? check("disclosure", "Discloses that you work there", "pass", "Says who you are up front.")
      : check(
          "disclosure",
          "Discloses that you work there",
          "fail",
          `Add your disclosure line — "${resolveDisclosure(ctx.disclosureLine, ctx.brandName)}". Undisclosed promotion is what gets replies removed and accounts banned.`,
        ),
  );

  /* 2. Answers first. The disclosure sentence is allowed — encouraged — to
        open the reply. What may not come first is the pitch. */
  const substantive = parts.filter(
    (s) => !(containsBrand(s, ctx.brandName) && DISCLOSURE_PHRASE.test(s)),
  );
  let lead = 0;
  let pitchAt = -1;
  for (let i = 0; i < substantive.length; i += 1) {
    if (containsBrand(substantive[i], ctx.brandName)) {
      pitchAt = i;
      break;
    }
    lead += substantive[i].length;
  }
  if (substantive.length === 0)
    checks.push(
      check(
        "answers_first",
        "Answers the question first",
        "fail",
        "There's no answer here yet — only the disclosure.",
      ),
    );
  else if (pitchAt === -1 || (pitchAt >= 1 && lead >= 60))
    checks.push(
      check("answers_first", "Answers the question first", "pass", "Helps before it mentions you."),
    );
  else
    checks.push(
      check(
        "answers_first",
        "Answers the question first",
        "fail",
        `${ctx.brandName} comes up before the reply has answered anything. Lead with something useful to the person who asked.`,
      ),
    );

  /* 3. Link budget. */
  const budget = Math.max(0, ctx.maxLinksPerReply);
  const firstHasLink = parts.length > 0 && countLinks(parts[0]) > 0;
  const textWithoutLinks = body.replace(URL_PATTERN, "").trim();
  if (links > budget)
    checks.push(
      check(
        "link_budget",
        "No bare link drops",
        "fail",
        budget === 0
          ? "You've set replies to carry no links. Remove it, or describe where to find the thing instead."
          : `${links} links — your limit is ${budget}. More than one reads as a link drop.`,
      ),
    );
  else if (firstHasLink)
    checks.push(
      check(
        "link_budget",
        "No bare link drops",
        "fail",
        "The reply opens with a link. Say something first.",
      ),
    );
  else if (links > 0 && textWithoutLinks.length < 80)
    checks.push(
      check(
        "link_budget",
        "No bare link drops",
        "fail",
        "This is mostly a link. A reply has to stand on its own without it.",
      ),
    );
  else
    checks.push(
      check(
        "link_budget",
        "No bare link drops",
        "pass",
        links === 0 ? "No links." : "One link, after the answer.",
      ),
    );

  /* 4. The subreddit's own rules — the check with a third state. */
  if (!ctx.rulesKnown)
    checks.push(
      check(
        "subreddit_rules",
        `Follows ${sub} rules`,
        "unknown",
        `We couldn't read ${sub}'s rules, so we haven't checked this. Read the sidebar yourself before you post.`,
      ),
    );
  else {
    const reading = readRules(ctx.rules);
    if (reading.promoBanned)
      checks.push(
        check(
          "subreddit_rules",
          `Follows ${sub} rules`,
          "fail",
          `${sub} bans self-promotion${reading.bannedBy ? ` — "${reading.bannedBy}"` : ""}. Don't post this here.`,
        ),
      );
    else if (reading.linksBanned && links > 0)
      checks.push(
        check(
          "subreddit_rules",
          `Follows ${sub} rules`,
          "fail",
          `${sub} doesn't allow links in comments. Remove the link.`,
        ),
      );
    else if (reading.ratioRule)
      checks.push(
        check(
          "subreddit_rules",
          `Follows ${sub} rules`,
          "unknown",
          `${sub} limits promotion to a small share of your activity. We can't see your posting history — only you know whether this fits.`,
        ),
      );
    else
      checks.push(
        check(
          "subreddit_rules",
          `Follows ${sub} rules`,
          "pass",
          reading.promoMentioned
            ? `${sub} allows this with limits, and the reply stays inside them.`
            : "Nothing in the rules this trips.",
        ),
      );
  }

  /* 5. Length. */
  if (body.length < MIN_DRAFT_CHARS)
    checks.push(
      check(
        "length",
        "A real answer, not a drive-by",
        "fail",
        `${body.length} characters. Too short to have helped anyone — say a little more.`,
      ),
    );
  else if (body.length > MAX_DRAFT_CHARS)
    checks.push(
      check(
        "length",
        "A real answer, not a drive-by",
        "fail",
        `${body.length} characters. That's an article, not a reply — cut it to under ${MAX_DRAFT_CHARS}.`,
      ),
    );
  else
    checks.push(
      check("length", "A real answer, not a drive-by", "pass", `${body.length} characters.`),
    );

  /* 6. Marketing voice. */
  const voice = MARKETING_VOICE.filter((m) => m.pattern.test(body)).map((m) => m.word);
  checks.push(
    voice.length === 0
      ? check("no_marketing_voice", "Sounds like a person", "pass", "No ad copy.")
      : check(
          "no_marketing_voice",
          "Sounds like a person",
          "fail",
          `Reads like an ad: ${voice.slice(0, 3).join(", ")}. Say it the way you would to a colleague.`,
        ),
  );

  /* 7. Running down a competitor. */
  const smeared = ctx.competitors
    .map((c) => c.trim())
    .filter(Boolean)
    .find((c) => parts.some((s) => containsBrand(s, c) && SMEAR.test(s)));
  checks.push(
    smeared
      ? check(
          "no_competitor_smear",
          "Fair to the alternatives",
          "fail",
          `Runs down ${smeared}. Say what it's good at and where you differ — Redditors punish trash talk from a vendor.`,
        )
      : check(
          "no_competitor_smear",
          "Fair to the alternatives",
          "pass",
          ctx.competitors.length === 0
            ? "No named competitors on file to check against."
            : "Doesn't run anyone down.",
        ),
  );

  const failures = checks.filter((c) => c.state === "fail").length;
  const unknowns = checks.filter((c) => c.state === "unknown").length;
  return { checks, pass: failures === 0, failures, unknowns };
}

/**
 * The one-line verdict under the checklist. Never says "all checks pass" when
 * some could not be run.
 */
export function complianceSummary(report: ComplianceReport): string {
  const total = report.checks.length;
  const passed = total - report.failures - report.unknowns;
  const tail = report.unknowns > 0 ? ` · ${report.unknowns} we couldn't run` : "";
  return `${passed} of ${total} checks pass${tail}`;
}

/** Failures a second ask of the model can plausibly fix on its own. */
export function mechanicalFailures(report: ComplianceReport): string[] {
  const fixable = new Set([
    "disclosure",
    "length",
    "link_budget",
    "no_marketing_voice",
    "answers_first",
  ]);
  return report.checks.filter((c) => c.state === "fail" && fixable.has(c.id)).map((c) => c.id);
}
