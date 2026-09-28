/**
 * /solutions/ai-search-visibility — the product page for "AI search
 * visibility". Buyers searching the term mostly find trackers, which report
 * whether ChatGPT names you. Rankbox doesn't track citations yet
 * (SHIPPED.citationTracking), so this page sells the other half honestly:
 * building the pages, answers and mentions that engines cite.
 *
 * Numbers come from PLAN and the claims helpers, never typed in, so a plan or
 * shipping change updates the page. solutions.test.ts holds the rules.
 */
import { PLAN, TRIAL_DAYS, TRIAL_ARTICLE_CREDITS, formatUsd } from "@/data/pricing";
import { RANKBOX_PUBLISHING, SHIPPED } from "@/data/competitors/shared";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import type { Faq } from "@/data/ai-seo/types";

/** A step in the build loop, linked to the feature or integration that does it. */
interface LoopStep {
  title: string;
  body: string;
  feature?: string;
  integration?: string;
}

const price = formatUsd(PLAN.monthly);

export const VISIBILITY = {
  slug: "ai-search-visibility",
  metaTitle: "AI Search Visibility Software That Gets You Cited | Rankbox",
  metaDescription:
    "Build AI search visibility on autopilot. Rankbox maps what buyers ask AI, writes a cited answer for each question, and earns the mentions engines trust.",
  keywords: [
    "ai search visibility",
    "ai search visibility software",
    "ai search visibility platform",
    "improve ai search visibility",
    "ai visibility",
  ],
  eyebrow: "AI search visibility",
  h1: { lead: "Earn AI search", accent: "visibility every day" },
  subhead:
    "AI engines only name brands they can read, find an answer from, quote cleanly, and see vouched for elsewhere. Rankbox builds all four for you, one article a day.",

  /** Product facts under the hero. Facts, not outcomes. */
  specs: [
    { value: `${PLAN.articlesPerMonth}`, label: "answers written a month, one per buyer question" },
    { value: "6", label: "AI-readiness checks on every article" },
    { value: `${PLAN.backlinkCreditsPerMonth}`, label: "backlink credits a month" },
    { value: `${PLAN.redditRepliesPerMonth}`, label: "Reddit reply drafts a month" },
  ],

  gatesTitle: "AI engines name you only when all four are true",
  gatesIntro:
    "AI search visibility isn't a score you raise a point at a time. Each condition is a gate: fail any one and the answer goes to someone else. Switch one off and watch.",

  trackerTitle: "Trackers show the gap. Rankbox closes it.",
  trackerIntro:
    "Most AI visibility tools are trackers: they run your buyer prompts through the engines and report who got named. That's worth knowing. It doesn't write the page that changes the answer.",

  loopTitle: "How Rankbox builds AI search visibility",
  loopIntro: "The same loop every day, so the number of questions you answer only goes up.",
  loop: [
    {
      title: "Map the questions",
      body: "Rankbox reads your site and category and lists the questions your buyers ask AI and Google, with estimated demand and intent.",
      feature: "answer-space-research",
    },
    {
      title: "Write the answer",
      body: "One long-form article per question, researched on the live web, sources cited, in your brand voice.",
      feature: "citation-ready-writer",
    },
    {
      title: "Score it before it ships",
      body: "Every draft is graded for Google and for AI answers, with the fix for each check it fails.",
      feature: "seo-geo-score",
    },
    {
      title: "Publish on schedule",
      body: `${RANKBOX_PUBLISHING.sentence}.`,
      // The one-click publishing page describes plugins; until one ships, the
      // step points at the path that works today.
      ...(PUBLISH_PLATFORMS.some((p) => p.addonLive)
        ? { feature: "auto-publishing" }
        : { integration: "api" }),
    },
    {
      title: "Earn the mentions",
      body: "Backlinks from member sites in your niche, and reply drafts for the Reddit threads engines read.",
      feature: "authority-backlinks",
    },
  ] as LoopStep[],

  measureTitle: "Check your AI search visibility for free",
  measureIntro:
    "You don't need a tracker to find out where you stand. Test the prompts, read your logs, and watch AI referrals in analytics.",

  ctaTitle: "Become the brand AI search recommends",
  ctaBody: `Connect your site and Rankbox starts mapping questions and writing answers today. ${TRIAL_DAYS}-day free trial.`,
};

export const VISIBILITY_FAQS: Faq[] = [
  {
    q: "What is AI search visibility?",
    a: "AI search visibility is how often AI answer engines such as ChatGPT, Perplexity, Claude, Gemini and Google AI Overviews name or cite your brand when people ask questions in your category. It's measured as a share of answers across a fixed set of buyer prompts, not as a ranking position, because the same prompt can return different answers from one run to the next.",
  },
  {
    q: "How do I improve my AI search visibility?",
    a: "Pass four gates on the questions that matter. Let AI crawlers read your site. Publish a page that answers each buyer question directly. Put the answer in the first lines, under a matching heading, with sources linked. Then get other sites to mention you through links, reviews and forum threads. Rankbox does the second, third and fourth on a daily schedule; free tools cover the first.",
  },
  {
    q: "Does Rankbox track AI citations?",
    a: SHIPPED.citationTracking
      ? "Yes. Rankbox checks your buyer prompts across AI engines and ties each citation back to the article that earned it."
      : "Not yet. Rankbox shows how much of your market you've answered and whether each article passes six AI-readiness checks. To see who AI names today, run the free AI Visibility Prompt Kit, or pair Rankbox with a tracker such as Peec AI or Profound.",
  },
  {
    q: "How is AI search visibility measured?",
    a: "Run a fixed panel of buyer prompts through each engine two or three times and count how often you're named: that's your share of voice. Add two signals you already own: AI crawler visits in your server logs, and visits from ChatGPT, Perplexity, Gemini and Copilot in analytics. Our guide to measuring GEO walks through the control test.",
  },
  {
    q: "How long does it take to show up in AI answers?",
    a: "It depends on how the engine finds sources. Engines that search the web live, like ChatGPT search, Perplexity and Google AI Overviews, can cite a page once it's indexed and ranks for one of their sub-searches. What a model knows without searching changes only when it's retrained. Nobody can promise a date, and anyone who does is guessing.",
  },
  {
    q: "Is AI search visibility different from SEO?",
    a: "They overlap more than they differ. Most AI engines ground answers in a search index (Google, Bing or Brave), so a page that can't rank rarely gets cited. What changes is the unit: engines lift a passage rather than send a click to a page, and they weigh what other sites say about you more heavily.",
  },
  {
    q: "What does Rankbox cost?",
    a: `${price} a month for one site: ${PLAN.articlesPerMonth} articles, ${PLAN.backlinkCreditsPerMonth} backlink credits and ${PLAN.redditRepliesPerMonth} Reddit reply drafts. The ${TRIAL_DAYS}-day free trial includes ${TRIAL_ARTICLE_CREDITS} articles.`,
  },
];
