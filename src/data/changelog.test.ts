/**
 * The changelog's rules, enforced. A changelog is only worth reading if every
 * line in it is true, so these fail the build rather than a reader's trust:
 * a status that runs ahead of the product, a release with no reason it isn't
 * live, a link to a page that doesn't exist, or copy in a voice we'd refuse
 * in a Reddit reply.
 */
import { describe, expect, it } from "vitest";
import { MARKETING_VOICE } from "@/lib/reddit/compliance";
import { buildChangelogFeed, escapeXml, rfc822 } from "@/lib/changelog-feed";
import { plainText } from "@/lib/inline-md";
import { STUDIO } from "@/data/pricing";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { INTEGRATION_SLUGS } from "@/data/integrations";
import { AI_TOOL_SLUGS } from "@/data/ai-integrations";
import { TOOL_SLUGS } from "@/data/tools";
import { TERMS } from "@/data/glossary/terms";
import { ENGINES } from "@/data/ai-seo/engines";
import { MATCHUPS } from "@/data/compare/matchups";
import { COMPETITORS } from "@/data/alternatives";
import { PERSONA_SLUGS } from "@/data/personas";
import { FEATURE_SLUGS } from "@/data/features";
import { CHANGELOG, getEntry, groupByDate, neighbours, type ChangelogEntry } from "./changelog";

function allText(e: ChangelogEntry): string[] {
  return [
    e.title,
    e.summary,
    e.statusNote ?? "",
    ...e.body,
    ...(e.points ?? []).flatMap((p) => [p.title, p.text]),
  ];
}

function internalHrefs(md: string): string[] {
  return [...md.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
}

function isKnownPath(href: string): boolean {
  const path = href.split("#")[0];
  if (path === "/") return true;
  const [, section, slug, extra] = path.split("/");
  if (extra !== undefined) return false;
  const has = (list: readonly string[]) => slug === undefined || list.includes(slug);
  switch (section) {
    case "integrations":
      return has([...INTEGRATION_SLUGS, ...AI_TOOL_SLUGS]);
    case "tools":
      return has(TOOL_SLUGS);
    case "glossary":
      return has(TERMS.map((t) => t.slug));
    case "ai-seo":
      return has(ENGINES.map((e) => e.slug));
    case "compare":
      return has(MATCHUPS.map((m) => m.slug));
    case "alternatives":
      return has(COMPETITORS.map((c) => c.slug));
    case "use-cases":
      return has(PERSONA_SLUGS);
    case "features":
      return has(FEATURE_SLUGS);
    case "changelog":
      return has(CHANGELOG.map((e) => e.slug));
    case "pricing":
      return slug === undefined;
    default:
      return false;
  }
}

describe("changelog entries", () => {
  it("has unique, kebab-case slugs", () => {
    const slugs = CHANGELOG.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s, s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    // "rss.xml" is the feed's own route under /changelog.
    expect(slugs).not.toContain("rss");
  });

  it("dates are real days, never in the future, newest first", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const e of CHANGELOG) {
      expect(e.date, e.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${e.date}T00:00:00Z`).toISOString().slice(0, 10), e.slug).toBe(e.date);
      expect(e.date <= today, `${e.slug} is dated ${e.date}, after today`).toBe(true);
    }
    const dates = CHANGELOG.map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("says why anything that isn't live isn't, and only then", () => {
    for (const e of CHANGELOG) {
      if (e.status === "live") expect(e.statusNote, e.slug).toBeUndefined();
      else expect(e.statusNote?.trim(), e.slug).toBeTruthy();
    }
  });

  it("reads status from the product's own switches", () => {
    expect(getEntry("studio")?.status).toBe(STUDIO.live ? "live" : "coming-soon");
    const framer = PUBLISH_PLATFORMS.find((p) => p.id === "framer");
    expect(getEntry("framer-plugin")?.status).toBe(framer?.addonLive ? "live" : "coming-soon");
  });

  it("never tells people to use something that isn't live", () => {
    const nowWords =
      /\b(?:now available|available (?:now|today)|install (?:it )?(?:now|today)|try it (?:now|today))\b/i;
    for (const e of CHANGELOG.filter((x) => x.status !== "live")) {
      for (const t of allText(e)) expect(plainText(t), e.slug).not.toMatch(nowWords);
    }
  });

  it("keeps summaries short enough to be the meta description", () => {
    for (const e of CHANGELOG) {
      expect(plainText(e.summary).length, e.slug).toBeLessThanOrEqual(200);
      expect(e.body.length, e.slug).toBeGreaterThan(0);
    }
  });

  it("is written plainly, with no marketing voice", () => {
    for (const e of CHANGELOG) {
      for (const t of allText(e)) {
        const hits = MARKETING_VOICE.filter((m) => m.pattern.test(plainText(t))).map((m) => m.word);
        expect(hits, `${e.slug}: "${t}"`).toEqual([]);
      }
    }
  });

  it("links only to pages that exist", () => {
    for (const e of CHANGELOG) {
      const hrefs = [...allText(e).flatMap(internalHrefs), ...(e.links ?? []).map((l) => l.to)];
      for (const h of hrefs) expect(isKnownPath(h), `${e.slug} → ${h}`).toBe(true);
    }
  });
});

describe("changelog helpers", () => {
  it("groups by day without losing or reordering anything", () => {
    const groups = groupByDate(CHANGELOG);
    expect(groups.flatMap((g) => g.entries)).toEqual(CHANGELOG);
    expect(new Set(groups.map((g) => g.date)).size).toBe(groups.length);
  });

  it("links each release to the ones either side", () => {
    const first = CHANGELOG[0].slug;
    const last = CHANGELOG[CHANGELOG.length - 1].slug;
    expect(neighbours(first).newer).toBeUndefined();
    expect(neighbours(first).older?.slug).toBe(CHANGELOG[1].slug);
    expect(neighbours(last).older).toBeUndefined();
    expect(neighbours("no-such-release")).toEqual({});
  });
});

describe("changelog feed", () => {
  const feed = buildChangelogFeed();

  it("lists every release, newest first, at its own URL", () => {
    const links = [...feed.matchAll(/<guid isPermaLink="true">([^<]+)<\/guid>/g)].map((m) => m[1]);
    expect(links).toEqual(CHANGELOG.map((e) => `https://rankbox.xyz/changelog/${e.slug}`));
  });

  it("escapes everything, so the XML stays well formed", () => {
    expect(escapeXml(`a & b <c> "d" 'e'`)).toBe("a &amp; b &lt;c&gt; &quot;d&quot; &apos;e&apos;");
    // Every & in the output starts an entity; no raw < inside a text node.
    expect(feed).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
    for (const m of feed.matchAll(/<description>([\s\S]*?)<\/description>/g)) {
      expect(m[1]).not.toMatch(/[<>]/);
    }
  });

  it("dates items in RFC 822", () => {
    expect(rfc822("2026-09-23")).toBe("Wed, 23 Sep 2026 12:00:00 GMT");
    const dates = [...feed.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((m) => m[1]);
    expect(dates).toHaveLength(CHANGELOG.length);
    for (const d of dates) expect(Number.isNaN(Date.parse(d))).toBe(false);
  });

  it("carries the status of anything that isn't live", () => {
    for (const e of CHANGELOG.filter((x) => x.status !== "live")) {
      expect(feed).toContain(escapeXml(plainText(e.statusNote ?? "")));
    }
  });
});
