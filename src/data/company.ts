/**
 * Who is behind Rankbox, in one place. The /about page, its fact card, the
 * Organization markup on the homepage, and every "written by Rankbox" credit
 * read from here, so what people read and what AI engines read can't drift.
 *
 * Only facts the company stands behind go in. Leave a field empty rather than
 * guess: an empty field hides its row and drops out of the markup, while a
 * wrong one is exactly what this page exists to prevent.
 */
import { LEGAL_CONTACT, LEGAL_ENTITY } from "@/components/legal/legal-ui";

export const SITE = "https://rankbox.xyz";
export const ORG_ID = `${SITE}/#organization`;

/** Bump whenever a fact below changes. Shown on /about and in its markup. */
export const ABOUT_UPDATED = "2026-11-12";

/**
 * Pages elsewhere that are unmistakably about this Rankbox: they feed `sameAs`
 * in the Organization markup on every page and the profile links in the
 * footer. Another AI SEO tool is also called Rankbox, so these are what tell
 * search engines which one rankbox.xyz is. Only add a page the company owns or
 * that names rankbox.xyz, and open it first: one wrong link here is worse than
 * none. Checked 2026-11-12.
 */
export const PROFILES: { name: string; url: string }[] = [
  { name: "LinkedIn", url: "https://www.linkedin.com/company/rankboxai/" },
  { name: "Trustpilot", url: "https://www.trustpilot.com/review/rankbox.xyz" },
  { name: "PeerPush", url: "https://peerpush.com/p/rankbox-gblk" },
  { name: "Fazier", url: "https://fazier.com/launches/rankbox" },
];

export const COMPANY = {
  name: "Rankbox",
  category: "AI search growth engine",
  legalName: LEGAL_ENTITY,
  /** Work on the product began in June 2026. Rankvolt (rankvolt.top) is a
   *  separate sister brand: don't present it as Rankbox's former name. */
  foundingYear: "2026",
  domain: "rankbox.xyz",
  email: LEGAL_CONTACT,
  /** 512×512 PNG. Google wants a raster logo of at least 112px for Organization. */
  logo: `${SITE}/apple-touch-icon.png`,
  /** The one canonical description, reused wherever the company is described. */
  description:
    "Rankbox is an AI search growth engine for founders and small teams. It researches the questions buyers ask AI, writes a source-backed article every day, and publishes it to your site, so ChatGPT, Perplexity, Gemini and Google can cite you.",
  /** Official profiles for `sameAs`. Edit PROFILES above, not this. */
  sameAs: PROFILES.map((p) => p.url),
};

/**
 * DRAFT for the founder to rewrite in their own words. It says only what the
 * product does and when it started, with no claims about the people. Keep it
 * that way until a named founder is added.
 */
export const STORY = [
  "Buyers used to search, scan ten links and pick one. Now more of them ask ChatGPT, Perplexity, Gemini or Google's AI Mode, and get a single answer that cites a handful of sources. Being one of those sources is the new first page.",
  "Large companies have content teams working on that. Most founders and small teams don't, so the answers AI gives in their market get written from someone else's pages.",
  "Rankbox is the content team they can't hire yet. It finds the questions buyers in your market ask AI, writes a source-backed article on one of them every day, publishes it to your site, and trades backlinks with other sites in the network.",
  "We started building it in 2026.",
];

/** Posts signed by the brand rather than a person. Posts written before the
 *  rename still carry the old name. */
export function isTeamAuthor(author: string): boolean {
  return /^(rankbox|rankvolt)( team)?$/i.test(author.trim());
}

/** The Organization node, exactly as the homepage and /about publish it. */
export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.name,
    // No alternateName: Rankvolt now runs as a separate sister brand at
    // rankvolt.top, and naming it here would tell search engines the two
    // companies are one.
    legalName: COMPANY.legalName,
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: COMPANY.logo, width: 512, height: 512 },
    description: COMPANY.description,
    ...(COMPANY.foundingYear ? { foundingDate: COMPANY.foundingYear } : {}),
    email: COMPANY.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: COMPANY.email,
    },
    ...(COMPANY.sameAs.length ? { sameAs: COMPANY.sameAs } : {}),
  };
}

/** How a page credits Rankbox as its author: the company, pointing at the page
 *  that says who that is. */
export const AUTHOR_ORG = {
  "@type": "Organization",
  name: COMPANY.name,
  url: `${SITE}/about`,
} as const;
