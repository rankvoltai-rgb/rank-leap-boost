/**
 * The changelog as RSS 2.0, served at /changelog/rss.xml. A pure function of
 * the entries, so the feed is tested like the rest of the changelog.
 */
import {
  CHANGELOG,
  CHANGELOG_FEED_PATH,
  CHANGELOG_UPDATED,
  KINDS,
  STATUSES,
  type ChangelogEntry,
} from "@/data/changelog";
import { plainText } from "@/lib/inline-md";

const SITE = "https://rankbox.xyz";

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822, as RSS wants it. Midday UTC, so no reader's time zone moves the day. */
export function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toUTCString();
}

/** The entry as readable text: summary, status if not live, body, then points. */
export function feedDescription(e: ChangelogEntry): string {
  const parts = [plainText(e.summary)];
  if (e.status !== "live" && e.statusNote) {
    parts.push(`${STATUSES[e.status].label}: ${plainText(e.statusNote)}`);
  }
  parts.push(...e.body.map(plainText));
  for (const p of e.points ?? []) parts.push(`${p.title}: ${plainText(p.text)}`);
  return parts.join("\n\n");
}

export function buildChangelogFeed(entries: ChangelogEntry[] = CHANGELOG): string {
  const items = entries.map((e) => {
    const url = `${SITE}/changelog/${e.slug}`;
    const kind = KINDS.find((k) => k.id === e.kind)?.plural ?? e.kind;
    return [
      "    <item>",
      `      <title>${escapeXml(e.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${rfc822(e.date)}</pubDate>`,
      `      <category>${escapeXml(kind)}</category>`,
      `      <description>${escapeXml(feedDescription(e))}</description>`,
      "    </item>",
    ].join("\n");
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    "  <channel>",
    "    <title>Rankbox changelog</title>",
    `    <link>${SITE}/changelog</link>`,
    `    <atom:link href="${SITE}${CHANGELOG_FEED_PATH}" rel="self" type="application/rss+xml" />`,
    "    <description>Every release to Rankbox, dated, and marked live, rolling out or coming soon.</description>",
    "    <language>en</language>",
    `    <lastBuildDate>${rfc822(CHANGELOG_UPDATED)}</lastBuildDate>`,
    ...items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
