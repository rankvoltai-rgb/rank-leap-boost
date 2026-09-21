/**
 * Reading a subreddit's rules, pure and shared by the scorer and the
 * compliance checker so the two can never disagree about what a rule says.
 *
 * This is pattern matching over moderators' prose, so it is deliberately
 * conservative in one direction only: it would rather refuse a subreddit that
 * would have tolerated a reply than draft for one that bans them. A missed
 * opportunity costs nothing. A reply posted where self-promotion is banned gets
 * a real person's account actioned.
 */

export interface RuleReading {
  /** The subreddit explicitly bans self-promotion. Rankbox will not draft for it. */
  promoBanned: boolean;
  /** Links in comments are banned or restricted. */
  linksBanned: boolean;
  /**
   * A ratio rule (9:1, "10% of your activity"). We cannot see the member's
   * posting history, so this is something only they can check — it becomes an
   * `unknown` compliance result, never a pass.
   */
  ratioRule: boolean;
  /** Self-promotion is mentioned at all, banned or merely limited. */
  promoMentioned: boolean;
  /** 0–1. How likely a reply that names a product is to be unwelcome here. */
  risk: number;
  /** The rule text that triggered `promoBanned`, quoted back to the member. */
  bannedBy: string | null;
}

/** An outright ban. Each pattern has to say NO, not merely mention the subject. */
const BAN_PATTERNS: RegExp[] = [
  /\bno\s+(?:self[-\s]?)?promot(?:ion|ing|ional)/i,
  /\bno\s+advertis(?:ing|ements?|ers?)\b/i,
  /\bno\s+(?:spam|solicit(?:ing|ation)|marketing|shilling|plugging)\b/i,
  /\bself[-\s]?promot(?:ion|ing|ional)\b[^.]{0,40}\b(?:is|are)?\s*(?:not\s+allowed|not\s+permitted|prohibited|banned|forbidden|disallowed|will\s+be\s+removed)/i,
  /\b(?:do\s+not|don['’]?t|never)\s+(?:self[-\s]?)?promot/i,
  /\b(?:do\s+not|don['’]?t|never)\s+(?:advertis|shill|plug|pitch)/i,
  /\bno\s+(?:vendors?|sales\s+pitch(?:es)?|affiliate\s+links?|referral\s+links?)\b/i,
  /\bpromotional\s+(?:content|posts?|comments?)\b[^.]{0,30}\b(?:not\s+allowed|prohibited|banned|removed)/i,
];

/**
 * Wording that carves an exception back out of a ban-shaped sentence:
 * "No self-promotion outside the weekly thread". Where one of these sits in the
 * same rule, the rule limits promotion rather than banning it.
 */
const EXCEPTION_PATTERNS: RegExp[] = [
  /\b(?:outside|except|unless|other\s+than|only\s+in|limited\s+to|restricted\s+to)\b/i,
  /\b(?:weekly|monthly|daily|megathread|designated|dedicated)\b[^.]{0,30}\bthread/i,
  /\bwith(?:out)?\s+(?:mod(?:erator)?s?['’]?\s+)?(?:approval|permission)\b/i,
  /\b(?:excessive|blatant|low[-\s]?effort|unsolicited|pure|only)\b/i,
];

const RATIO_PATTERNS: RegExp[] = [
  /\b9\s*[:/]\s*1\b/,
  /\b10\s*%/,
  /\b1\s*(?:in|out\s+of)\s*10\b/i,
  /\bone\s+(?:in|out\s+of)\s+ten\b/i,
  /\bratio\b/i,
];

const LINK_BAN_PATTERNS: RegExp[] = [
  /\bno\s+(?:external\s+)?links?\b/i,
  /\blinks?\b[^.]{0,30}\b(?:not\s+allowed|prohibited|banned|removed|forbidden)/i,
  /\b(?:do\s+not|don['’]?t)\s+(?:post|include|drop|share)\s+links?\b/i,
  /\bno\s+(?:url|urls|link\s+drops?|blog\s*spam)\b/i,
];

/**
 * Deliberately broad — bare "promotion" counts, not only "self-promotion".
 * Over-reading a rule as being about promotion costs a little score. Under-
 * reading one costs a member their account.
 */
const PROMO_MENTION = /\b(?:(?:self[-\s]?)?promot|advertis|solicit|shill|affiliate|vendor)/i;

function anyMatch(patterns: RegExp[], text: string): boolean {
  return patterns.some((p) => p.test(text));
}

/**
 * Reads a subreddit's rules. An empty list reads as "nothing found" — the
 * caller is responsible for knowing whether that is because the rules are
 * permissive or because we never managed to fetch them, and must not treat
 * the second as the first.
 */
export function readRules(rules: ReadonlyArray<string | null | undefined>): RuleReading {
  let promoBanned = false;
  let bannedBy: string | null = null;
  let linksBanned = false;
  let ratioRule = false;
  let promoMentioned = false;

  for (const raw of rules) {
    const rule = (raw ?? "").trim();
    if (!rule) continue;

    if (PROMO_MENTION.test(rule)) promoMentioned = true;
    if (anyMatch(RATIO_PATTERNS, rule) && PROMO_MENTION.test(rule)) ratioRule = true;
    if (anyMatch(LINK_BAN_PATTERNS, rule)) linksBanned = true;

    // A ratio or a carve-out means promotion is limited, not banned: the rule
    // itself describes a way to do it acceptably.
    const carvedOut = anyMatch(EXCEPTION_PATTERNS, rule) || anyMatch(RATIO_PATTERNS, rule);
    if (!promoBanned && anyMatch(BAN_PATTERNS, rule) && !carvedOut) {
      promoBanned = true;
      bannedBy = rule.length > 220 ? `${rule.slice(0, 217)}...` : rule;
    }
  }

  let risk = 0;
  if (promoBanned) risk = 1;
  else {
    // A subreddit that LIMITS promotion is the normal, welcoming case — most
    // large ones carry a 9:1 rule — so these stay modest. Together they are
    // about what unread rules cost, and far short of a ban.
    if (promoMentioned) risk += 0.25;
    if (ratioRule) risk += 0.15;
    if (linksBanned) risk += 0.1;
    risk = Math.min(0.9, risk);
  }

  return { promoBanned, linksBanned, ratioRule, promoMentioned, risk, bannedBy };
}

/** Subreddit names as Reddit stores them: no "r/", no slashes, lowercase. */
export function normalizeSubreddit(name: string | null | undefined): string {
  return (name ?? "")
    .trim()
    .replace(/^\/?r\//i, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}
