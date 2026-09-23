/**
 * The changelog: what shipped to Rankbox, dated, newest first.
 *
 * One entry per release someone would notice. The hub (/changelog), each
 * entry's own page (/changelog/<slug>), the RSS feed and the sitemap all read
 * this list, so publishing a release is one object at the top of it.
 *
 * The status is the claim. "live" means a customer can use it today, so where
 * the product already has a switch for that (STUDIO.live, a platform's
 * addonLive) the status is read from the switch, and the changelog can't run
 * ahead of the product. The rules are enforced by changelog.test.ts.
 *
 * Prose is inline markup (see src/lib/inline-md): **bold**, `code` and
 * [text](/internal-path).
 */
import { PLAN, STUDIO, formatUsd } from "@/data/pricing";
import { PUBLISH_PLATFORMS } from "@/data/platforms";

export type ChangeKind = "feature" | "improvement" | "resources" | "announcement";

/**
 * - live: in the product, for everyone the entry's audience names.
 * - rolling-out: deployed, but not yet working end to end for customers.
 * - coming-soon: built, and not yet something a customer can install or use.
 */
export type ChangeStatus = "live" | "rolling-out" | "coming-soon";

/** The illustration drawn for an entry, in src/components/changelog/visuals. */
export type ChangeVisual =
  | "connectors"
  | "studio"
  | "framer"
  | "reddit"
  | "exchange"
  | "guides"
  | "tools"
  | "rename";

export interface ChangePoint {
  title: string;
  text: string;
}

export interface ChangelogEntry {
  slug: string;
  /** The day it shipped, YYYY-MM-DD. */
  date: string;
  kind: ChangeKind;
  status: ChangeStatus;
  /** What stands between it and "live", in a sentence. Required unless live. */
  statusNote?: string;
  /** Who gets it, when that isn't everyone. */
  audience?: "Every plan" | "Paid plans";
  title: string;
  /** One or two sentences. Also the meta description and the RSS summary. */
  summary: string;
  body: string[];
  points?: ChangePoint[];
  visual?: ChangeVisual;
  /** Internal pages worth following from the entry. */
  links?: { label: string; to: string }[];
}

export const KINDS: { id: ChangeKind; label: string; plural: string }[] = [
  { id: "feature", label: "New", plural: "New features" },
  { id: "improvement", label: "Improved", plural: "Improvements" },
  { id: "resources", label: "Resources", plural: "Resources" },
  { id: "announcement", label: "Announcement", plural: "Announcements" },
];

export const STATUSES: Record<ChangeStatus, { label: string; meaning: string }> = {
  live: { label: "Live", meaning: "In the product today." },
  "rolling-out": {
    label: "Rolling out",
    meaning: "Deployed, and being switched on for customers.",
  },
  "coming-soon": { label: "Coming soon", meaning: "Built, and not available to use yet." },
};

const framer = PUBLISH_PLATFORMS.find((p) => p.id === "framer");
const studioPrice = formatUsd(STUDIO.monthlyPerSite);

export const CHANGELOG: ChangelogEntry[] = [
  {
    slug: "connector-library",
    date: "2026-09-23",
    kind: "feature",
    status: "live",
    audience: "Every plan",
    title: "Rankbox now works inside 49 AI tools",
    summary:
      "Dashboard → Integrations is now a searchable library of 56 connectors, and every AI tool in it has its own public setup page with a live demo.",
    body: [
      "Rankbox's research now works inside the AI tools you already use. Add one URL, `https://rankbox.xyz/mcp`, to Claude, ChatGPT, Cursor, Lovable, n8n or any of 44 others, then ask for AI search questions, SEO content briefs and meta descriptions without leaving them.",
      "Each connector opens its own setup steps, written with the menu names in that tool's own docs.",
    ],
    points: [
      {
        title: "56 connectors, one search",
        text: "Five publishing platforms, the REST API and 50 MCP connections, grouped by category and searchable by name.",
      },
      {
        title: "A page for every AI tool",
        text: "Each has a [public page](/integrations) with its setup steps and a **Try it** panel that runs real calls, three per visit.",
      },
      {
        title: "Clear about the gaps",
        text: "Tools that can't add a remote MCP server without sign-in, such as Bubble and Webflow AI, are listed with the reason. Searching for one explains why instead of coming up empty.",
      },
      {
        title: "Included with every plan",
        text: "Connectors aren't an add-on. The same URL works in every tool on the list.",
      },
    ],
    visual: "connectors",
    links: [
      { label: "Browse integrations", to: "/integrations" },
      { label: "Set up Claude", to: "/integrations/claude" },
    ],
  },
  {
    slug: "studio",
    date: "2026-09-22",
    kind: "feature",
    status: STUDIO.live ? "live" : "coming-soon",
    statusNote: STUDIO.live ? undefined : "Built, and not on sale yet.",
    audience: "Paid plans",
    title: "Studio: run several sites from one account",
    summary: `Add more sites from your dashboard, each with the full plan of its own, for ${studioPrice} a month on the same invoice.`,
    body: [
      "Agencies, and founders with more than one brand, used to need an account per site. Now one login runs them all: switch sites from the top of the sidebar, and every page, report and schedule follows.",
      `Each extra site is ${studioPrice} a month and comes with ${PLAN.articlesPerMonth} articles, ${PLAN.backlinkCreditsPerMonth} backlink credits and ${PLAN.redditRepliesPerMonth} Reddit replies a month of its own, plus its own research, content plan and publishing schedule.`,
      "Studio opens once your plan is paid. On a trial, you can start your plan early from the same screen.",
    ],
    points: [
      {
        title: "One invoice",
        text: "Every site is a line on the plan you already pay for, charged pro rata from the day you add it. Billing lists each site with its own allowance.",
      },
      {
        title: "Links you can share",
        text: "The site you're on is part of the URL, so a link to a report opens on the right site.",
      },
      {
        title: "Your sites stay separate",
        text: "The backlink exchange never places a link between two sites you own, so your sites never read as one network.",
      },
      {
        title: "Leave any time",
        text: "Removing a site stops it renewing. It keeps working to the end of the period you've paid for, then it's archived with its data kept.",
      },
    ],
    visual: "studio",
    links: [
      { label: "See pricing", to: "/pricing" },
      { label: "Rankbox for agencies", to: "/use-cases/seo-agencies" },
    ],
  },
  {
    slug: "framer-plugin",
    date: "2026-09-22",
    kind: "feature",
    status: framer?.addonLive ? "live" : "coming-soon",
    statusNote: framer?.addonLive
      ? undefined
      : "Built, and not installable yet: it goes live when its Framer Marketplace listing is approved. Until then, Framer sites publish through the API.",
    audience: "Every plan",
    title: "A Rankbox plugin for Framer",
    summary:
      "Sync your Rankbox articles into a Framer CMS collection, add structured data to your site, and report where each article went live.",
    body: [
      "The plugin runs inside the Framer editor. Pick a collection and sync: your Rankbox articles become native CMS items you style like any other page on your site.",
    ],
    points: [
      {
        title: "A full sync, every time",
        text: "New articles are added and edited ones updated. An article deleted in Rankbox is removed only after a complete sync, so an interrupted run never deletes anything.",
      },
      {
        title: "Structured data in the head",
        text: "Adds site-wide JSON-LD to your site's `<head>`, where crawlers that don't run JavaScript can still read it.",
      },
      {
        title: "Live URLs, reported back",
        text: "Each article's published address goes back to Rankbox, so the backlink exchange can verify the links inside it.",
      },
      {
        title: "Slugs that don't move",
        text: "An item keeps the slug it was first synced with, so renaming an article never breaks a live link.",
      },
      {
        title: "Your key stays yours",
        text: "Your API key is kept in your browser, never in the project file every collaborator can read.",
      },
    ],
    visual: "framer",
    links: [{ label: "Framer integration", to: "/integrations/framer" }],
  },
  {
    slug: "dashboard-next-step",
    date: "2026-09-22",
    kind: "improvement",
    status: "live",
    audience: "Every plan",
    title: "A dashboard that leads with one next step",
    summary:
      "A regrouped sidebar, an Overview that opens with the one thing worth doing next, and a billing page that lists every site.",
    body: [
      "The Overview used to greet you with a stack of banners. Now it resolves them to one sentence and one button, whether that's starting your trial, connecting your site or publishing your first article. A launch checklist underneath shows how far along you are, and it disappears once every step is done.",
    ],
    points: [
      {
        title: "New navigation",
        text: "The sidebar is regrouped around the work, with the site switcher at the top and the page you're on as the one thing in blue.",
      },
      {
        title: "Billing, per site",
        text: "Plan & Billing lists every site with its own allowance, on the same invoice and card, with a way to add the next one.",
      },
    ],
  },
  {
    slug: "comparisons-and-engine-guides",
    date: "2026-09-22",
    kind: "resources",
    status: "live",
    title: "Head-to-head comparisons, and six more AI engine guides",
    summary:
      "Side-by-sides of six pairs of tools we don't make, guides for six more AI engines, and rebuilt pages comparing Rankbox with the tools people switch from.",
    body: [
      "The new [head-to-head comparisons](/compare) put two tools side by side, such as [Surfer SEO vs Clearscope](/compare/surfer-seo-vs-clearscope) and [Semrush vs Ahrefs](/compare/semrush-vs-ahrefs). Each names a winner for each use case, with pricing checked and dated. Rankbox appears once on each page, disclosed as a third option, and is never scored.",
    ],
    points: [
      {
        title: "Six more engine guides",
        text: "Microsoft Copilot, Grok, Meta AI, DeepSeek, Mistral Le Chat and Manus join the first five [AI SEO guides](/ai-seo): how each engine finds and cites sources, and what to change for it.",
      },
      {
        title: "Alternatives, rebuilt",
        text: "Nine [Rankbox alternatives](/alternatives) pages, each with dated, sourced pricing, and only the Rankbox features that have shipped.",
      },
    ],
    visual: "guides",
    links: [
      { label: "All comparisons", to: "/compare" },
      { label: "AI SEO guides", to: "/ai-seo" },
    ],
  },
  {
    slug: "free-tools-glossary-engine-guides",
    date: "2026-09-21",
    kind: "resources",
    status: "live",
    title: "15 new free tools, a glossary, and AI engine guides",
    summary:
      "The free tools grew from 8 to 23, the AI search glossary launched with 69 terms, and the first five AI engine guides went up.",
    body: [
      "Every one of the [free tools](/tools) works with no signup. The new ones cover the parts of AI search most sites miss: an [AI crawler log analyzer](/tools/ai-crawler-log-analyzer), a [robots.txt tester](/tools/robots-txt-tester), a [citation readiness checker](/tools/ai-citation-readiness-checker) and an [AI search readiness check](/tools/ai-search-readiness-check).",
    ],
    points: [
      {
        title: "AI search glossary",
        text: "[69 terms](/glossary) of SEO, GEO, AEO and LLM search vocabulary, each defined in one sentence, then explained with sources.",
      },
      {
        title: "AI engine guides",
        text: "[ChatGPT](/ai-seo/chatgpt), [Google AI Overviews](/ai-seo/google-ai-overviews), [Gemini](/ai-seo/gemini), [Claude](/ai-seo/claude) and [Perplexity](/ai-seo/perplexity): how each finds and cites sources, compared side by side.",
      },
      {
        title: "Also new",
        text: "Open Graph, hreflang, sitemap and redirect generators, a heading structure checker, a UTM link builder, and more.",
      },
    ],
    visual: "tools",
    links: [
      { label: "All free tools", to: "/tools" },
      { label: "Glossary", to: "/glossary" },
    ],
  },
  {
    slug: "reddit-presence",
    date: "2026-09-20",
    kind: "feature",
    // Rolling out until APIFY_TOKEN is set in production and the daily
    // /api/public/hooks/reddit-run schedule runs: without the token, thread
    // discovery tells paid members it isn't switched on.
    status: "rolling-out",
    statusNote: "In the dashboard for paid plans. Thread discovery is being switched on.",
    audience: "Paid plans",
    title: "Reddit Presence: answer the threads your buyers read",
    summary:
      "Rankbox finds the Reddit threads where people ask about what you sell, and drafts a reply for each one worth answering. You post it yourself.",
    body: [
      "Reddit is where buyers ask each other what to use. Reddit Presence finds the threads about what you sell, scores them, and drafts a reply that answers the question before it mentions you.",
      `Each draft uses one of ${PLAN.redditRepliesPerMonth} reply credits that come with the plan every month.`,
    ],
    points: [
      {
        title: "You post, we never do",
        text: "Rankbox never posts to Reddit and never asks for your Reddit login. You post from your own account, paste the comment link back, and Rankbox checks it's live.",
      },
      {
        title: "Disclosure built in",
        text: "Every draft carries a line saying you're connected to your brand, and it can't be removed.",
      },
      {
        title: "Subreddit rules respected",
        text: "Subreddits that ban self-promotion are skipped, however good the thread looks.",
      },
      {
        title: "Only verified replies count",
        text: "A reply counts toward your totals once its link is checked. One marked as posted without a link never does.",
      },
    ],
    visual: "reddit",
    links: [
      { label: "How Reddit Presence works", to: "/features/reddit-presence" },
      { label: "See pricing", to: "/pricing" },
    ],
  },
  {
    slug: "backlink-exchange",
    date: "2026-09-20",
    kind: "feature",
    // Rolling out until EXCHANGE_CRON_SECRET is set and the daily
    // /api/public/hooks/exchange-run schedule runs: links are placed today,
    // but only that job verifies them and settles credits.
    status: "rolling-out",
    statusNote:
      "Open to paid plans. The daily check that verifies links and settles credits is being switched on.",
    audience: "Paid plans",
    title: "The backlink exchange",
    summary:
      "Earn credits by hosting relevant links in your Rankbox articles, and spend them on links from other members' sites. No direct swaps.",
    body: [
      `Every paid plan gets ${PLAN.backlinkCreditsPerMonth} backlink credits a month. Spend them to have a link to your site placed in another member's article on a related topic, and earn more by hosting links in yours. Credits are weighted by site strength, so a link from a stronger site costs more.`,
    ],
    points: [
      {
        title: "Never a direct swap",
        text: "Two sites never link to each other, and no link goes between two sites you own. Links run around the network instead of trading back and forth.",
      },
      {
        title: "Topic first",
        text: "A link is placed only where the topics match. If no member site fits yet, none is placed, and the dashboard shows how many sites are actually eligible.",
      },
      {
        title: "Paid on proof",
        text: "Credits move only when a link is verified live on the host's real page, not when an article is written. A link that never goes live is refunded.",
      },
      {
        title: "Kept if you pause",
        text: "If your plan lapses, your live links and your credit balance stay, frozen until you're back.",
      },
    ],
    visual: "exchange",
    links: [
      { label: "How the exchange works", to: "/features/authority-backlinks" },
      { label: "See pricing", to: "/pricing" },
    ],
  },
  {
    slug: "rankvolt-is-now-rankbox",
    date: "2026-09-19",
    kind: "announcement",
    status: "live",
    title: "Rankvolt is now Rankbox",
    summary: "Same product, new name, new home at rankbox.xyz. Also new: sign in with Google.",
    body: [
      "Rankbox is the new name for Rankvolt, and [rankbox.xyz](/) is its new home. The name changed everywhere at once, including the parts only machines read.",
    ],
    points: [
      {
        title: "One name everywhere",
        text: "Our crawler now identifies itself as `RankboxBot`, and the MCP server as `rankbox-mcp`.",
      },
      {
        title: "Sign in with Google",
        text: "Use your Google account, or your email as before.",
      },
    ],
    visual: "rename",
  },
];

export const CHANGELOG_UPDATED = CHANGELOG[0].date;

/** Where the RSS feed is served (src/routes/changelog.rss[.]xml.ts). */
export const CHANGELOG_FEED_PATH = "/changelog/rss.xml";

export const CHANGELOG_SLUGS = CHANGELOG.map((e) => e.slug);

export function getEntry(slug: string): ChangelogEntry | undefined {
  return CHANGELOG.find((e) => e.slug === slug);
}

/** The releases either side of one, by date: `newer` is undefined at the top. */
export function neighbours(slug: string): { newer?: ChangelogEntry; older?: ChangelogEntry } {
  const i = CHANGELOG.findIndex((e) => e.slug === slug);
  if (i < 0) return {};
  return { newer: CHANGELOG[i - 1], older: CHANGELOG[i + 1] };
}

/** Entries grouped by the day they shipped, newest day first. */
export function groupByDate(
  entries: ChangelogEntry[],
): { date: string; entries: ChangelogEntry[] }[] {
  const groups: { date: string; entries: ChangelogEntry[] }[] = [];
  for (const e of entries) {
    const last = groups.at(-1);
    if (last?.date === e.date) last.entries.push(e);
    else groups.push({ date: e.date, entries: [e] });
  }
  return groups;
}

export function isKind(v: unknown): v is ChangeKind {
  return KINDS.some((k) => k.id === v);
}
