/**
 * How fast the blog publishes.
 *
 * Posts are written in batches (a phase of the content roadmap is 10–20 posts
 * in a day) but released a few at a time. Google has no rule against volume;
 * the risk is how a young domain looks when it gains 100 pages in two days,
 * which is the pattern its scaled-content policy describes. It also can't
 * crawl and judge them any faster. A steady weekday cadence lets each post be
 * indexed and judged on its own. It also keeps a reserve to release while the
 * next phase is being written.
 *
 * `npm run blog:schedule` fills the calendar with POSTS_PER_WEEKDAY, and
 * blog-schedule.test.ts holds every scheduled date to the caps below. The
 * caps leave a little room over the pattern for a timely post dated by hand.
 *
 * This module is read by scripts/blog-schedule.ts under plain Node, so it
 * must not import anything.
 */

/** Scheduled dates start here; posts dated before it went live before the scheduler existed. */
export const SCHEDULE_START = "2026-10-01";

/**
 * Posts per day of the week (UTC), Sunday first: 2–3 a weekday, 12 a week,
 * none at weekends. Raised from 7 a week on 2026-10-02 at the user's request.
 */
export const POSTS_PER_WEEKDAY = [0, 2, 3, 2, 3, 2, 0] as const;

/** The most posts on one day. */
export const MAX_PER_DAY = 3;

/** The most posts in any seven consecutive days. */
export const MAX_PER_WEEK = 14;

/**
 * Days between two posts from one cluster (a hub and its standalones), so a
 * topic arrives over weeks instead of as a wall of near-neighbours.
 */
export const CLUSTER_GAP_DAYS = 3;

/** A post that waits longer than this between writing and release gets its facts re-checked first. */
export const STALE_AFTER_DAYS = 30;
