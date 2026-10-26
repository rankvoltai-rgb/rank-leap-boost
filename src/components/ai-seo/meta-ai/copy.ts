/**
 * The page-level words on /ai-seo/meta-ai that aren't part of the guide's
 * typed content: section labels, the focal visual's per-surface notes and
 * the offer. Kept here, small, so the components hold layout only — and so
 * the route's shared bundle never pulls in the guide text itself.
 *
 * Every claim about a surface is something Meta has said, with the page it
 * said it on; where Meta hasn't documented a layout, the note says so.
 */

export type SurfaceId = "whatsapp" | "app" | "facebook" | "glasses";

export interface SurfaceNote {
  id: SurfaceId;
  /** Tab label. */
  label: string;
  /** The device line in the mock's header. */
  where: string;
  /** Whether Meta documents how sources appear here. */
  documented: boolean;
  /** One sentence: what Meta documents, or that it doesn't. */
  note: string;
  /** The callout beside the spot a source would be. */
  marker: string;
  href: string;
}

export const SURFACES: SurfaceNote[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    where: "Meta AI chat",
    documented: false,
    note: "Meta's leading surface for Meta AI. Web search is a setting, but Meta publishes no WhatsApp-specific source layout.",
    marker: "Name in the sentence",
    href: "https://faq.whatsapp.com/1493496052558860/?cms_platform=web",
  },
  {
    id: "app",
    label: "Meta AI app",
    where: "meta.ai",
    documented: true,
    note: "Documented: you see Meta AI's sources by selecting Sources under its response.",
    marker: "Sources, under the response",
    href: "https://www.meta.com/help/artificial-intelligence/578066098711082/",
  },
  {
    id: "facebook",
    label: "Facebook",
    where: "Search · AI Mode",
    documented: false,
    note: "AI Mode answers are grounded in public Groups and Reels. How posts or links are credited there isn't documented.",
    marker: "Grounded in public posts",
    href: "https://about.fb.com/news/2026/06/new-ai-tools-to-help-you-make-things-happen-on-facebook/",
  },
  {
    id: "glasses",
    label: "Glasses",
    where: "Ray-Ban Meta",
    documented: false,
    note: "The answer is spoken. A conversation started on glasses can be picked up in the Meta AI app's history tab.",
    marker: "No visible link",
    href: "https://about.fb.com/news/2025/04/introducing-meta-ai-app-new-way-access-ai-assistant/",
  },
];

export const LABELS = {
  stage: "One question, four Meta surfaces",
  stageCaption: "Illustration. The brand is fictional; the layouts follow what Meta documents.",
  documented: "Documented by Meta",
  undocumented: "Not documented",
  shortAnswer: "The short answer",
  takeaways: "What to know first",
  checklist: "The Meta AI to-do list",
  checklistIntro:
    "Everything above, in the order to do it. Ticks are saved in this browser, so you can come back to it.",
  faqEyebrow: "FAQ",
  faqTitle: "Meta AI SEO, asked and answered",
  faqIntro:
    "The questions people ask about Meta AI and their site, answered from Meta's own pages.",
  sourcesEyebrow: "Sources",
  sourcesTitle: "Where every claim comes from",
  sourcesFromMeta: "Meta's own pages",
  sourcesElsewhere: "Reporting and studies",
  otherGuides: "The same work, engine by engine",
  otherGuidesLink: "All AI SEO guides",
  verified: "Facts checked",
  furtherReading: "Go further",
  share: "Share it with whoever owns your SEO.",
};

export const OFFER = {
  railTitle: "Be the sentence Meta AI forwards",
  railBody: "Rankbox writes answer-first, source-backed articles and publishes them on a schedule.",
  closingTitle: "Write the pages chat answers quote",
  closingBody:
    "Rankbox researches the questions your buyers ask AI, writes source-backed articles that answer them in the first lines, scores each one before it ships, and publishes on your schedule.",
  button: "Start free trial",
};
