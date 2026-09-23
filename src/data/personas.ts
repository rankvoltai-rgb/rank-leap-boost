/**
 * Use-case pages — /use-cases/$slug.
 *
 * A feature page answers "what does this do?". A comparison page answers "why
 * you and not them?". These answer the question that actually decides a
 * signup: "is this built for someone in my seat?"
 *
 * Three rules for anything written here:
 *
 * 1. No promised outcomes. Specs are product facts (articles a month, engines
 *    tracked, platforms published to) — never traffic, rankings, or hours
 *    saved. The same rule the comparison pages run on.
 * 2. The handoff is honest. Every page states plainly what stays the reader's
 *    job. A page that implies the work disappears sells a refund.
 * 3. No invented third-party prices. The stack section names what Rankbox
 *    consolidates, and puts a number only on our own plan.
 *
 * Pages come in two groups. "By role" pages are written to a seat (marketer,
 * founder, agency); "By business" pages to what the reader sells and where,
 * and each of those carries a sample topic map and the integrations that fit.
 * The rules above are enforced by personas.test.ts.
 */
import {
  AppWindow,
  Building2,
  Megaphone,
  Rocket,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";
import { PLAN, STUDIO, TRIAL_DAYS, formatUsd } from "./pricing";

/** A product fact in the band under the hero. Facts, never results. */
export interface PersonaSpec {
  value: string;
  label: string;
}

/** One line of the hero's ownership split. */
export interface HandoffLine {
  label: string;
  detail: string;
}

/** A job the reader recognises, paired with what changes. */
export interface PersonaPain {
  pain: string;
  fix: string;
}

/** A step on the onboarding rail. `when` is the timeline label. */
export interface PersonaStep {
  when: string;
  title: string;
  body: string;
}

/** A line item Rankbox absorbs. No price: see rule 3 above. */
export interface StackItem {
  label: string;
  detail: string;
}

/** A feature page, framed for this reader. */
export interface PersonaPick {
  featureSlug: string;
  why: string;
}

export interface PersonaFAQ {
  q: string;
  a: string;
}

/** Which way a page slices the audience: by the reader's seat, or their business. */
export type PersonaGroup = "role" | "business";

export const PERSONA_GROUPS: { id: PersonaGroup; label: string; blurb: string }[] = [
  { id: "role", label: "By role", blurb: "Written to the seat you sit in." },
  { id: "business", label: "By business", blurb: "Written to what you sell, and where." },
];

/** One intent on the sample topic map, with the questions that sit under it. */
export interface TopicCluster {
  /** Where the customer is: "Before they buy". */
  stage: string;
  /** The chip beside it: "Buying". */
  intent: string;
  questions: string[];
}

/**
 * What Rankbox would write for a fictional business of this kind, shown in a
 * window labelled Sample. Questions only: a volume or a score beside them
 * would be invented data. The brands are the ones the integration pages use,
 * so a reader who clicks through meets the same shop on the other side.
 */
export interface PersonaTopics {
  title: string;
  intro: string;
  brand: string;
  domain: string;
  clusters: TopicCluster[];
  /** Under the window: says it's fictional, and whose map yours would be. */
  note: string;
  platformsTitle: string;
  /** Integration slugs (src/data/integrations.ts), best fit first. */
  platforms: { slug: string; why: string }[];
}

export interface Persona {
  slug: string;
  /** Plural, as it appears in nav and cards: "Marketers". */
  name: string;
  /**
   * The same word mid-sentence. Not `name.toLowerCase()`: that turns
   * "SEO agencies" into "seo agencies" on every page that says
   * "Rankbox for <them>".
   */
  nameLower: string;
  /**
   * The navbar rail's label, where two columns leave room for about ten
   * characters: "Founders". Its group heading supplies the rest.
   */
  shortName: string;
  /** Singular, for mid-sentence use: "marketer", read as "a marketer". */
  role: string;
  group: PersonaGroup;
  icon: LucideIcon;
  /** One line under the name in cards and menus. */
  tagline: string;

  /** Pill above the H1 — carries the page's primary keyword. */
  eyebrow: string;
  /**
   * The H1 in two parts: `lead` on the first line, `accent` on the second led
   * by the persona's icon tile. Keep each under ~20 characters so the lockup
   * holds at every breakpoint.
   */
  headline: { lead: string; accent: string };
  subhead: string;
  metaTitle: string;
  metaDescription: string;

  /**
   * The quotable paragraph, written to be lifted whole by an answer engine:
   * names the reader, states what Rankbox does for them, ends on the limit.
   */
  shortAnswer: string;

  specs: PersonaSpec[];

  /** The hero panel: what runs itself, and what never stops being yours. */
  handoff: {
    runsTitle: string;
    runs: HandoffLine[];
    keepsTitle: string;
    keeps: HandoffLine[];
  };

  painsTitle: string;
  painsIntro: string;
  pains: PersonaPain[];

  workflowTitle: string;
  workflowIntro: string;
  steps: PersonaStep[];

  stackTitle: string;
  stackIntro: string;
  stack: StackItem[];
  /** The honest caveat under the stack. */
  stackNote: string;

  picksTitle: string;
  picksIntro: string;
  picks: PersonaPick[];

  /** Business pages only. Rendered between the pains and the workflow. */
  topics?: PersonaTopics;

  /**
   * Names from the landing TESTIMONIALS, closest seat first. Empty hides the
   * section: a quote written about one kind of business is never borrowed to
   * vouch for another.
   */
  proof: string[];
  proofTitle: string;

  faqs: PersonaFAQ[];
  ctaTitle: string;
  ctaBody: string;
}

export const PERSONAS: Persona[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: "marketers",
    name: "Marketers",
    nameLower: "marketers",
    shortName: "Marketers",
    role: "marketer",
    group: "role",
    icon: Megaphone,
    tagline: "Own the content number without owning a content team.",

    eyebrow: "AI content marketing for marketers",
    headline: { lead: "Fill the calendar", accent: "not the backlog" },
    subhead:
      "You carry the pipeline number, not a bench of writers. Rankbox researches the questions your buyers ask AI, drafts source-backed articles in your brand voice, scores them for search and AI answers, publishes them to your CMS, and shows you which answers started citing you.",
    metaTitle: "Rankbox for Marketers: AI Content on Autopilot",
    metaDescription:
      "Run a daily content engine without hiring writers. Rankbox researches, drafts, scores, publishes, and tracks AI citations — so one marketer can hold the whole calendar.",

    shortAnswer:
      "Rankbox is an AI search growth engine built for marketing teams that own a content number without owning a content team. It maps the questions buyers ask ChatGPT, Perplexity, and Google, writes source-backed drafts in your brand voice, scores each one for SEO and for AI citation, publishes to your CMS daily, and reports which AI answers now quote you. Strategy, approvals, and the final edit stay with the marketer.",

    specs: [
      { value: `${PLAN.articlesPerMonth}/mo`, label: "published articles on your site" },
      { value: "6 platforms", label: "WordPress, Webflow, Shopify, Wix, Framer, webhooks" },
      { value: "Unlimited", label: "team members on the plan" },
      { value: "Daily", label: "publishing cadence, hands-free" },
    ],

    handoff: {
      runsTitle: "Rankbox runs this",
      runs: [
        {
          label: "Answer-space research",
          detail: "The questions your buyers put to AI, scored by volume, difficulty, and intent.",
        },
        {
          label: "First drafts, sourced",
          detail: "Every claim carries a citation, written to your brand voice guide.",
        },
        {
          label: "SEO and GEO scoring",
          detail: "Each draft graded for search and for AI citation before it can go live.",
        },
        {
          label: "Publishing and tracking",
          detail: "Live on your CMS on schedule, then monitored for who quotes it.",
        },
      ],
      keepsTitle: "You keep this",
      keeps: [
        { label: "Positioning", detail: "The story the content ladders up to is still yours." },
        {
          label: "The approve queue",
          detail: "Nothing enters the calendar you didn't green-light.",
        },
        { label: "The final edit", detail: "Rewrite any draft as many times as you like." },
        { label: "The report upward", detail: "You present the number. We hand you the evidence." },
      ],
    },

    painsTitle: "The week you're actually having",
    painsIntro:
      "None of this is a workflow problem you can brief your way out of. It's a capacity problem with a deadline attached.",
    pains: [
      {
        pain: "The calendar is agreed. The drafts aren't written.",
        fix: "An approved topic becomes a finished, sourced draft without a brief, a freelancer, or a chase email.",
      },
      {
        pain: "Traffic is flat and nobody can say why.",
        fix: "Citation tracking shows which answers name you, so the report stops being a rankings screenshot.",
      },
      {
        pain: "Buyers ask ChatGPT before they ever see your site.",
        fix: "Research and drafting are aimed at the answer box, not just position four on a SERP.",
      },
      {
        pain: "Everything AI-written sounds like everything else AI-written.",
        fix: "Brand voice is learned from your existing pages, so drafts read like your team wrote them.",
      },
    ],

    workflowTitle: "How it lands in your week",
    workflowIntro:
      "Setup is an afternoon. After that it runs on a cadence you can plan a quarter around.",
    steps: [
      {
        when: "Day 1",
        title: "Point it at your site",
        body: "Rankbox scans your pages, learns your voice, and maps the answer space around your category.",
      },
      {
        when: "Day 1",
        title: "Approve the plan",
        body: "You get a ranked topic map. Cut what's off-strategy, keep what isn't, and that becomes the queue.",
      },
      {
        when: "Every day",
        title: "Drafts arrive scored",
        body: "A sourced article, written to your voice and graded for SEO and GEO, waiting for your edit.",
      },
      {
        when: "Every week",
        title: "Report what moved",
        body: "Rankings, published volume, and which AI answers started citing you — in one place to screenshot.",
      },
    ],

    stackTitle: "What it takes off the line item",
    stackIntro:
      "Most one-marketer content programmes are five tools and two contractors in a trench coat.",
    stack: [
      { label: "Keyword research tool", detail: "Topic discovery, volume, and difficulty scoring" },
      {
        label: "Freelance writers",
        detail: "Briefs, drafts, revisions, and the chasing in between",
      },
      { label: "AI writing subscription", detail: "Drafting that still needs research bolted on" },
      { label: "On-page SEO checker", detail: "Pre-publish grading against a live checklist" },
      {
        label: "Rank and citation monitoring",
        detail: "Where you sit on Google, and who quotes you in AI",
      },
    ],
    stackNote: `One Rankbox plan is ${PLAN.articlesPerMonth} published articles a month on one site, with research, scoring, publishing, and tracking included. What you replace and what you keep is your call — most teams keep their analytics.`,

    picksTitle: "The parts marketers lean on hardest",
    picksIntro: "The whole engine runs either way. These are the four that change the week.",
    picks: [
      {
        featureSlug: "answer-space-research",
        why: "Turns a blank calendar into a ranked queue of questions buyers are already asking — no brainstorm workshop required.",
      },
      {
        featureSlug: "brand-voice",
        why: "Learned from pages you already published, so drafts arrive editable rather than rewritable.",
      },
      {
        featureSlug: "seo-geo-score",
        why: "A defensible pre-publish bar. Nothing ships under it, and you can show the standard to stakeholders.",
      },
      {
        featureSlug: "citation-tracking",
        why: "The evidence for the AI-visibility slide everyone now asks for and nobody can source.",
      },
    ],

    proof: ["Marco Silva", "Priya Raman", "Hannah Whitfield"],
    proofTitle: "Marketers running it as the whole content function",

    faqs: [
      {
        q: "Will this replace my writers?",
        a: "It replaces the drafting and the research, not the editing or the judgement. Teams that keep a writer usually move them onto the pieces that need original interviews, data, or a point of view — and let Rankbox hold the rest of the calendar.",
      },
      {
        q: "Can I keep my existing content calendar?",
        a: "Yes. The topic map is a proposal, not a lock-in. Cut anything off-strategy, add your own topics, and the queue reorders around what you approved.",
      },
      {
        q: "How do articles reach our site?",
        a: "One-click publishing to WordPress, Webflow, Shopify, Wix, and Framer, plus webhooks for anything custom. Turn auto-publish on and articles go live on your schedule; leave it off and they wait in the editor for sign-off.",
      },
      {
        q: "Can my whole team work in it?",
        a: "Yes — team members are unlimited on the plan, so strategy, editing, and approvals can sit with different people without paying per seat.",
      },
      {
        q: "What do I show my boss after a month?",
        a: "Published volume, the SEO and GEO score on every piece, rank movement, and the AI answers that now cite you by name. That last one is the part most stacks can't produce at all.",
      },
    ],
    ctaTitle: "Hold the whole calendar, on your own",
    ctaBody: `Point Rankbox at your site and watch the first topic map build. ${TRIAL_DAYS} days free, no card to start.`,
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "solo-founders",
    name: "Solo founders",
    nameLower: "solo founders",
    shortName: "Founders",
    role: "solo founder",
    group: "role",
    icon: Rocket,
    tagline: "Content marketing that runs while you build the product.",

    eyebrow: "SEO and AI visibility for solo founders",
    headline: { lead: "Content marketing", accent: "without a marketer" },
    subhead:
      "No team, no agency, no writer on retainer. Point Rankbox at your site and it finds what your buyers ask AI, writes it in your voice with sources attached, and publishes daily — while you stay in the codebase.",
    metaTitle: "Rankbox for Solo Founders: SEO Without a Team",
    metaDescription:
      "Run SEO and AI search as a one-person company. Rankbox researches, writes, and publishes daily in your voice, then tracks which AI answers cite you. Free 7-day trial.",

    shortAnswer:
      "Rankbox is an AI search growth engine for founders with no marketing hire. It maps the questions buyers ask ChatGPT, Perplexity, and Google about your category, writes source-backed articles in your voice, scores them for search and AI citation, and publishes them to your site daily. A founder still approves the queue and signs off on claims; everything between research and publish is automatic.",

    specs: [
      { value: "Minutes", label: "from your URL to a topic map" },
      { value: `${PLAN.articlesPerMonth}/mo`, label: "published articles, hands-free" },
      { value: "No card", label: `to start — ${TRIAL_DAYS}-day free trial` },
      { value: "1 site", label: "per plan, research to publishing" },
    ],

    handoff: {
      runsTitle: "Rankbox runs this",
      runs: [
        {
          label: "Figuring out what to write",
          detail:
            "The blank-page problem, solved by scanning your category and the live answers in it.",
        },
        {
          label: "Writing it properly",
          detail:
            "Researched, sourced, structured the way answer engines parse — not 900 words of filler.",
        },
        {
          label: "Getting it live",
          detail: "Published to your CMS on a daily schedule without you opening the dashboard.",
        },
        {
          label: "Building authority",
          detail: "Backlinks and Reddit presence, so a new domain isn't shouting into a void.",
        },
      ],
      keepsTitle: "You keep this",
      keeps: [
        {
          label: "Your point of view",
          detail: "The take that makes the product worth buying is yours to write.",
        },
        {
          label: "What you'll stand behind",
          detail: "You approve every claim before it carries your domain.",
        },
        {
          label: "The queue",
          detail: "Kill any topic that's wrong for where the product is going.",
        },
        { label: "Your afternoons", detail: "The part of this that used to be a second job." },
      ],
    },

    painsTitle: "Why the blog died in month two",
    painsIntro:
      "Every solo founder starts a blog. Almost none of them are still publishing a quarter later, and it's rarely for lack of trying.",
    pains: [
      {
        pain: "You published four posts, then shipped a feature instead.",
        fix: "Cadence stops depending on your week. An article goes live daily whether or not you opened the tab.",
      },
      {
        pain: "You don't know what to write about.",
        fix: "The answer-space map hands you a ranked list of real buyer questions before you write a word.",
      },
      {
        pain: "A writer costs more than the runway allows.",
        fix: `One plan at ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} published articles — no retainer, no per-word rate.`,
      },
      {
        pain: "Nobody has heard of your domain, including ChatGPT.",
        fix: "Authority backlinks and Reddit presence give AI engines something to find when they go looking for you.",
      },
    ],

    workflowTitle: "Your first week, start to published",
    workflowIntro: "You are involved twice. The rest happens whether you show up or not.",
    steps: [
      {
        when: "Minute 1",
        title: "Paste your URL",
        body: "Rankbox reads your site, works out what you sell and to whom, and learns how you write.",
      },
      {
        when: "Minute 10",
        title: "Say yes to the plan",
        body: "A ranked map of buyer questions comes back. Approve the ones you want, bin the rest.",
      },
      {
        when: "Day 1 onward",
        title: "Articles go live",
        body: "A sourced, scored article publishes to your site daily. Auto-publish off if you'd rather read each one first.",
      },
      {
        when: "Week 4",
        title: "Check who's citing you",
        body: "See which ChatGPT, Perplexity, and Google AI answers name your brand, and what earned the mention.",
      },
    ],

    stackTitle: "What you don't have to buy or hire",
    stackIntro:
      "The usual one-person content stack, replaced by one subscription and an approve button.",
    stack: [
      {
        label: "A content marketer",
        detail: "Strategy, calendar, and the discipline to keep to it",
      },
      { label: "A freelance writer", detail: "Per-word rates, briefs, and revision rounds" },
      { label: "An SEO tool subscription", detail: "Keyword research and on-page grading" },
      { label: "A link-building retainer", detail: "The slowest, least fun line on the invoice" },
      { label: "Your evenings", detail: "The hours the blog quietly ate every month it survived" },
    ],
    stackNote: `One plan covers ${PLAN.sites} site: research, writing, scoring, publishing, ${PLAN.backlinkCreditsPerMonth} backlink credits a month, and citation tracking. Cancel in one click and everything already published stays on your site.`,

    picksTitle: "The parts that matter most when it's just you",
    picksIntro: "No team means no handoffs. These four are why that works.",
    picks: [
      {
        featureSlug: "auto-publishing",
        why: "Consistency without discipline. Articles ship on a schedule that survives a launch week and a bad month.",
      },
      {
        featureSlug: "answer-space-research",
        why: "Removes the hardest part of a solo blog: deciding what's worth writing before you've got data.",
      },
      {
        featureSlug: "authority-backlinks",
        why: "A domain nobody links to doesn't get cited. This works on that problem in the background.",
      },
      {
        featureSlug: "citation-tracking",
        why: "The first signal that any of this is working, months before the analytics chart bends.",
      },
    ],

    proof: ["Owen Carter", "Elise Tanaka", "Hannah Whitfield"],
    proofTitle: "Founders who stopped writing the blog themselves",

    faqs: [
      {
        q: "How much time does this actually take me?",
        a: "Setup is minutes: paste your URL and approve the topic map. After that the only recurring job is reviewing drafts, and you can skip that entirely by turning auto-publish on.",
      },
      {
        q: "Will it sound like AI wrote it?",
        a: "It learns your voice from pages you already published, and every article is researched with sources attached rather than generated from a prompt. You can rewrite any draft as many times as you want before it goes live.",
      },
      {
        q: "My site is brand new. Is it too early?",
        a: "New domains are the case this is built around — a thin site is exactly why authority backlinks and Reddit presence are in the plan rather than sold as add-ons. Expect the compounding to take months, not days.",
      },
      {
        q: "What if I'm not technical about SEO?",
        a: "You don't need to be. Every article is scored for search and for AI citation before it publishes, so the standard is enforced for you instead of being something you have to learn first.",
      },
      {
        q: "What does it cost, really?",
        a: `One plan, billed monthly, covering ${PLAN.sites} site and ${PLAN.articlesPerMonth} published articles. No setup fee, no add-ons, no contract, and a ${TRIAL_DAYS}-day free trial before the first charge.`,
      },
    ],
    ctaTitle: "Let the blog run itself",
    ctaBody: `Paste your URL and see the topic map your site is sitting on. ${TRIAL_DAYS} days free, cancel in one click.`,
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "seo-agencies",
    name: "SEO agencies",
    nameLower: "SEO agencies",
    shortName: "Agencies",
    role: "agency",
    group: "role",
    icon: Building2,
    tagline: "Add GEO to every retainer without adding writers.",

    eyebrow: "GEO and content delivery for SEO agencies",
    headline: { lead: "Deliver GEO", accent: "at agency scale" },
    subhead:
      "Your clients are already asking why they've stopped showing up in ChatGPT. Rankbox gives each account a research-to-publish engine and a citation report — so you can answer with delivery instead of a deck.",
    metaTitle: "Rankbox for SEO Agencies: GEO for Every Client",
    metaDescription:
      "Run content and generative engine optimization across your client book without hiring writers. Per-site research, drafting, scoring, publishing, and AI citation reporting.",

    shortAnswer:
      "Rankbox is an AI search growth engine agencies run on a per-client basis. Each client site gets its own plan: answer-space research, source-backed drafts in that client's voice, SEO and GEO scoring, publishing to their CMS, and reporting on which AI answers cite them. Plans cover one site each and team members are unlimited, so a pod can work across every account without per-seat costs.",

    specs: [
      STUDIO.live
        ? {
            value: formatUsd(STUDIO.monthlyPerSite),
            label: "per extra client site, all in one account",
          }
        : { value: "1 plan", label: "per client site, priced the same each time" },
      { value: "Unlimited", label: "team members, no per-seat fee" },
      { value: `${PLAN.articlesPerMonth}/mo`, label: "published articles per account" },
      { value: "Per-client", label: "brand voice, topic map, and reporting" },
    ],

    handoff: {
      runsTitle: "Rankbox runs this",
      runs: [
        {
          label: "Production, per account",
          detail: "Research, drafting, and scoring for each client site, in that client's voice.",
        },
        {
          label: "The publishing pipeline",
          detail:
            "Straight into the client's CMS, or held in the editor for your editor's sign-off.",
        },
        {
          label: "Citation reporting",
          detail: "Which AI answers name the client — the slide nobody else on the pitch has.",
        },
        {
          label: "Off-page groundwork",
          detail: "Backlink credits and Reddit presence included per plan, not quoted separately.",
        },
      ],
      keepsTitle: "You keep this",
      keeps: [
        { label: "The strategy", detail: "What each account is actually trying to win, and why." },
        { label: "The client relationship", detail: "We never talk to them. You do." },
        {
          label: "Editorial standards",
          detail: "Your editor's bar sits on top of the scoring bar.",
        },
        { label: "The margin", detail: "How you package and price delivery is your business." },
      ],
    },

    painsTitle: "The conversation you're now having on every call",
    painsIntro:
      "Clients have noticed that buyers ask AI first. Most agencies can explain it. Far fewer can bill for fixing it.",
    pains: [
      {
        pain: "Clients ask about ChatGPT and you have a slide, not a service.",
        fix: "Per-account citation tracking turns GEO from a talking point into a deliverable with a report attached.",
      },
      {
        pain: "Content margin dies in the writer pool.",
        fix: "Drafting and research come with the plan, so production cost per account stops scaling with headcount.",
      },
      {
        pain: "Quality drifts the moment volume goes up.",
        fix: "Every article is scored for SEO and GEO before it can publish, so the floor is the same on account one and account twenty.",
      },
      {
        pain: "Every client sounds like the same freelancer wrote them.",
        fix: "Brand voice is trained per site from that client's own pages, not shared across your book.",
      },
    ],

    workflowTitle: "Onboarding a client account",
    workflowIntro: "The same four steps every time, which is the point.",
    steps: [
      {
        when: "Kickoff",
        title: "Spin up the account",
        body: STUDIO.live
          ? "Add the client's site in Studio. Point it at their domain and it learns their category and their voice."
          : "One plan per client site. Point it at their domain and it learns their category and their voice.",
      },
      {
        when: "Week 1",
        title: "Shape the map",
        body: "Edit the ranked topic map against the strategy you already sold them. Your approvals set the queue.",
      },
      {
        when: "Ongoing",
        title: "Route the drafts",
        body: "Auto-publish to their CMS, or hold everything in the editor so your editor signs off first.",
      },
      {
        when: "Every month",
        title: "Report on citations",
        body: "Rank movement, published volume, and the AI answers quoting the client, per account.",
      },
    ],

    stackTitle: "What comes off the delivery cost",
    stackIntro: "Per account, every month, for every client on a content retainer.",
    stack: [
      { label: "Writer hours", detail: "Briefs, drafts, and revision rounds per account" },
      { label: "Per-seat SEO tooling", detail: "Research and on-page grading across the book" },
      {
        label: "Link-building vendors",
        detail: "Quoted and invoiced separately on most retainers",
      },
      {
        label: "Manual reporting",
        detail: "The monthly screenshot assembly nobody has ever enjoyed",
      },
      {
        label: "The GEO gap",
        detail: "The service line you can't currently sell because you can't deliver it",
      },
    ],
    stackNote: STUDIO.live
      ? `Your plan covers your first site; every other client site is ${formatUsd(STUDIO.monthlyPerSite)} a month through ${STUDIO.name}, on the same account and the same invoice.`
      : `Plans cover ${PLAN.sites} site each, so a book of clients is one plan per client site. Running several accounts? Email us and we'll work out the right setup with you.`,

    picksTitle: "The parts that carry a client book",
    picksIntro:
      "Repeatability is the product. These four are what makes account twenty look like account one.",
    picks: [
      {
        featureSlug: "seo-geo-score",
        why: "A consistent, explainable quality bar across every account — and a number your client report can point at.",
      },
      {
        featureSlug: "brand-voice",
        why: "Per-site voice training, so scaling production doesn't flatten every client into the same tone.",
      },
      {
        featureSlug: "citation-tracking",
        why: "The GEO deliverable. Proof of AI visibility per client, which is currently very hard to buy anywhere.",
      },
      {
        featureSlug: "authority-backlinks",
        why: `${PLAN.backlinkCreditsPerMonth} credits a month per account, included — one fewer vendor line on the retainer.`,
      },
    ],

    proof: ["Priya Raman", "Aman Desai", "Marco Silva"],
    proofTitle: "Teams delivering content and GEO across accounts",

    faqs: [
      {
        q: "Can one plan cover all my clients?",
        a: STUDIO.live
          ? `One account covers all of them, but not one price: your plan includes one site, and ${STUDIO.name} adds each other client site for ${formatUsd(STUDIO.monthlyPerSite)} a month. Every site gets its own research, topic map, voice, and publishing schedule, and the full ${PLAN.articlesPerMonth} articles a month. Your clients' sites never trade backlinks with each other.`
          : `No, and we'd rather say so plainly: each plan covers ${PLAN.sites} website, with its own research, topic map, voice, and publishing schedule. A book of clients means one plan per client site. If you're running several, email us and we'll work out the right setup with you.`,
      },
      {
        q: "Can my whole team work across accounts?",
        a: "Yes. Team members are unlimited on every plan, so strategists, editors, and account managers can all work in an account without per-seat pricing.",
      },
      {
        q: "Can we review before anything reaches the client's site?",
        a: "Yes. Auto-publish is a switch. Leave it off and every article waits in the editor for your editor, with unlimited rewrites before it goes anywhere near the client's CMS.",
      },
      {
        q: "What do we actually put in the monthly report?",
        a: "Published volume, the SEO and GEO score per article, rank movement, and which AI answers cite the client by name. The citation view is the part most agencies currently can't produce at all.",
      },
      {
        q: "How is this different from giving writers an AI tool?",
        a: "An AI writing tool produces text. This runs the whole line: research scored for volume, difficulty, and intent, source-backed drafting, a pre-publish quality gate, publishing, backlinks, and citation measurement — per account, the same way every time.",
      },
    ],
    ctaTitle: "Put GEO on the retainer",
    ctaBody: `Run one account through it first. ${TRIAL_DAYS} days free, no card to start, cancel in one click.`,
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "ecommerce",
    name: "E-commerce stores",
    nameLower: "e-commerce stores",
    shortName: "E-commerce",
    role: "store owner",
    group: "business",
    icon: ShoppingBag,
    tagline: "Answer the buying questions your product pages can't.",

    eyebrow: "AI SEO and blog content for e-commerce",
    headline: { lead: "Answer the buyer", accent: "before the cart" },
    subhead:
      "Shoppers now ask ChatGPT which one to buy before they reach your store. Rankbox finds those buying questions, writes sourced guides and comparisons in your brand voice, and publishes them as native posts on your Shopify or Square Online blog.",
    metaTitle: "Rankbox for E-commerce: AI SEO for Online Stores",
    metaDescription:
      "Buying guides, comparisons, and how-tos on your Shopify or Square Online blog, every day. Rankbox researches, writes, and scores each for Google and AI answers.",

    shortAnswer:
      "Rankbox is an AI search growth engine for online stores. It maps the buying questions shoppers ask ChatGPT, Perplexity, and Google about your category, writes source-backed guides and comparisons in your brand voice, scores each one for SEO and AI citation, and publishes them as native blog posts on Shopify, Square Online, or WordPress. It writes to your blog and nothing else, and the store owner checks what each article says about their products.",

    specs: [
      { value: "Native", label: "blog posts on Shopify and Square Online" },
      { value: "Blog only", label: "never your products, orders, or customers" },
      { value: `${PLAN.articlesPerMonth}/mo`, label: "buying guides, comparisons, and how-tos" },
      { value: "100+", label: "languages, for every market you ship to" },
    ],

    handoff: {
      runsTitle: "Rankbox runs this",
      runs: [
        {
          label: "Buying-question research",
          detail: "What shoppers ask AI before they pick a product in your category.",
        },
        {
          label: "Guides and comparisons",
          detail: "Sourced articles in your brand voice, not reworded product descriptions.",
        },
        {
          label: "Publishing to your store",
          detail: "Native posts on your Shopify or Square Online blog, in your theme.",
        },
        {
          label: "Authority off the site",
          detail: "Backlink credits and Reddit presence, working on the domain in the background.",
        },
      ],
      keepsTitle: "You keep this",
      keeps: [
        {
          label: "Product truth",
          detail: "Specs, stock, and prices only you can vouch for.",
        },
        {
          label: "Merchandising",
          detail: "Which collections the content should point at this season.",
        },
        {
          label: "The final read",
          detail: "Publish hidden, check it, then switch it on.",
        },
        {
          label: "The storefront",
          detail: "Products, checkout, and orders are never touched.",
        },
      ],
    },

    painsTitle: "Why the store blog stalled",
    painsIntro:
      "Product pages answer “what is it?”. Shoppers now ask AI “which one should I get?”, and a product page was never built to answer that.",
    pains: [
      {
        pain: "The blog is three posts and a holiday announcement.",
        fix: "Posts go live on a schedule that keeps going through launch weeks, sale weeks, and stockouts.",
      },
      {
        pain: "Shoppers ask ChatGPT which one to buy. It names other stores.",
        fix: "Research goes after the buying and comparison questions answer engines field in your category.",
      },
      {
        pain: "You know the range cold, but a proper buying guide eats a whole day.",
        fix: "Drafts arrive researched and sourced. You add what only you know about the products, then approve.",
      },
      {
        pain: "Every content app wants access to your whole store.",
        fix: "The Shopify and Square apps write blog posts and nothing else. They never read your products, customers, or orders.",
      },
    ],

    workflowTitle: "From store URL to first guide",
    workflowIntro: "One setup session. After that it runs beside the store, not inside it.",
    steps: [
      {
        when: "Day 1",
        title: "Add the app",
        body: "Connect Rankbox to your Shopify or Square Online blog and choose where posts land.",
      },
      {
        when: "Day 1",
        title: "Approve the buying questions",
        body: "Rankbox reads your store and category, then ranks what shoppers ask. Keep what fits your range.",
      },
      {
        when: "Every day",
        title: "Guides arrive on the blog",
        body: "A sourced, scored article publishes to your blog, either visible or held back until you've read it.",
      },
      {
        when: "Every season",
        title: "Reshape the map",
        body: "Add a new collection's questions, cut a discontinued line, and the queue reorders around it.",
      },
    ],

    stackTitle: "What the store stops paying for separately",
    stackIntro: "Most store blogs run on a freelancer, an SEO app, and good intentions.",
    stack: [
      {
        label: "Freelance blog writers",
        detail: "Per-post rates, briefs, and a revision round for every guide",
      },
      { label: "An SEO research app", detail: "Keyword and question research for the category" },
      { label: "An on-page SEO checker", detail: "Grading each post before it goes live" },
      {
        label: "Link-building outreach",
        detail: "Chasing mentions for a domain that's mostly product pages",
      },
      {
        label: "Your Sunday afternoons",
        detail: "The blog post that was always next week's job",
      },
    ],
    stackNote: STUDIO.live
      ? `One plan covers ${PLAN.sites} store: ${PLAN.articlesPerMonth} published articles a month, ${PLAN.backlinkCreditsPerMonth} backlink credits, and the Shopify and Square apps. Running a second storefront? ${STUDIO.name} adds each extra site for ${formatUsd(STUDIO.monthlyPerSite)} a month.`
      : `One plan covers ${PLAN.sites} store: ${PLAN.articlesPerMonth} published articles a month, ${PLAN.backlinkCreditsPerMonth} backlink credits, and the Shopify and Square apps.`,

    picksTitle: "The parts a store leans on hardest",
    picksIntro:
      "The engine is the same for everyone. These four do the heavy lifting behind a shop.",
    picks: [
      {
        featureSlug: "answer-space-research",
        why: "Surfaces the “which one should I buy?” questions a product page can't rank for, before you spend a day writing.",
      },
      {
        featureSlug: "citation-ready-writer",
        why: "Buying guides built the way answer engines lift them: a direct answer first, sourced claims underneath.",
      },
      {
        featureSlug: "auto-publishing",
        why: "Native posts in the Shopify or Square Online blog you choose, live or held for review, with no copy-pasting.",
      },
      {
        featureSlug: "reddit-presence",
        why: "Shoppers ask Reddit before they buy, and AI engines read those threads. Rankbox finds them and drafts a helpful reply for you to post.",
      },
    ],

    proof: [],
    proofTitle: "Stores running it as the whole blog",

    topics: {
      title: "What it would write for a store like yours",
      intro:
        "A product page answers one question. The questions around it are where shoppers decide, and each one is an article.",
      brand: "Fernwood Coffee",
      domain: "fernwoodcoffee.com",
      clusters: [
        {
          stage: "Before they buy",
          intent: "Buying",
          questions: [
            "Which roast is best for espresso at home?",
            "What are the best beans for cold brew?",
            "Is single-origin coffee worth the price?",
          ],
        },
        {
          stage: "Weighing options",
          intent: "Comparing",
          questions: [
            "Light vs dark roast: what actually changes?",
            "Whole bean vs pre-ground: how much fresher?",
            "Chemex or V60 for a first pour-over?",
          ],
        },
        {
          stage: "After the order",
          intent: "How-to",
          questions: [
            "How do you dial in a pour-over at home?",
            "How much coffee per cup of water?",
            "How should you store coffee so it stays fresh?",
          ],
        },
        {
          stage: "When it goes wrong",
          intent: "Fixing",
          questions: [
            "Why does my coffee taste sour?",
            "Why is my cold brew bitter?",
            "How long do roasted beans stay fresh?",
          ],
        },
      ],
      note: "A sample map for Fernwood Coffee, a fictional roaster. Yours is built from your own store and category, and nothing is written until you approve it.",
      platformsTitle: "Lands as native posts where you already sell",
      platforms: [
        { slug: "shopify", why: "Posts in the blog you pick, published visible or hidden." },
        { slug: "square", why: "Posts on your Square Online site's blog, live or as drafts." },
        { slug: "wordpress", why: "For WooCommerce stores: native posts in your theme." },
      ],
    },

    faqs: [
      {
        q: "Does Rankbox touch my products or orders?",
        a: "No. The Shopify and Square apps only create and update the blog posts Rankbox sends. They never read your products, customers, or orders.",
      },
      {
        q: "Will it write my product descriptions?",
        a: "No. It writes the articles around them: buying guides, comparisons, how-tos, and care guides. A product page says what an item is. These answer which one to buy and how to get the most from it, which is the question shoppers now ask AI.",
      },
      {
        q: "My store isn't on Shopify or Square. Can I still use it?",
        a: "Yes. The WordPress plugin covers WooCommerce stores, there are apps for Webflow and Framer, and the REST API works with anything custom, including a headless storefront.",
      },
      {
        q: "Can I check posts before customers see them?",
        a: "Yes. On Shopify, publish posts hidden and switch them on when you're ready. On Square Online, hold them as drafts. Either way you can rewrite any article as many times as you like first.",
      },
      {
        q: "What if a guide gets a detail about my products wrong?",
        a: "Drafts are researched and source-backed, but you know your stock, specs, and prices better than any research pass. That's why the final read stays with you. Keep auto-publish off, or publish hidden, and nothing about your products goes live until you've checked it.",
      },
    ],
    ctaTitle: "Give your store a blog that keeps up",
    ctaBody: `Paste your store's URL and see the buying questions it's sitting on. ${TRIAL_DAYS} days free, no card to start.`,
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "saas",
    name: "SaaS companies",
    nameLower: "SaaS companies",
    shortName: "SaaS",
    role: "SaaS team",
    group: "business",
    icon: AppWindow,
    tagline: "Content for buyers who ask AI which tool to use.",

    eyebrow: "AI search and content marketing for SaaS",
    headline: { lead: "Grow on content", accent: "not on ad spend" },
    subhead:
      "Buyers ask ChatGPT for the best tool in your category and get a shortlist before they reach your pricing page. Rankbox maps those questions, writes sourced comparisons and how-tos in your voice, and ships them to Webflow, Framer, WordPress, or your own stack.",
    metaTitle: "Rankbox for SaaS: AI Search & Content Marketing",
    metaDescription:
      "Comparisons, alternatives, and how-tos your buyers ask ChatGPT about, written in your voice and shipped to Webflow, Framer, WordPress, or any stack via API.",

    shortAnswer:
      "Rankbox is an AI search growth engine for SaaS companies that need category content without a content team. It maps the questions buyers ask ChatGPT, Perplexity, and Google, including comparisons, alternatives, use cases, and how-tos. It writes source-backed articles in your product's voice, scores them for SEO and AI citation, and publishes to Webflow, Framer, WordPress, or any stack through a REST API. Positioning, product claims, and the final edit stay with your team.",

    specs: [
      { value: `${PLAN.articlesPerMonth}/mo`, label: "published articles, research included" },
      { value: "3 CMS apps", label: "Webflow, Framer, and WordPress" },
      { value: "REST API", label: "HTML or Markdown for any stack" },
      { value: "MCP", label: "server for the AI tools you already use" },
    ],

    handoff: {
      runsTitle: "Rankbox runs this",
      runs: [
        {
          label: "Category question research",
          detail: "Comparisons, alternatives, and “how do I” questions buyers put to AI.",
        },
        {
          label: "Sourced drafts",
          detail: "Articles on the problem your product solves, written in your voice.",
        },
        {
          label: "Shipping to your stack",
          detail: "Into your CMS collection, or pulled by your own code through the API.",
        },
        {
          label: "Off-site authority",
          detail: "Backlink credits and Reddit presence where your category gets discussed.",
        },
      ],
      keepsTitle: "You keep this",
      keeps: [
        { label: "Positioning", detail: "The category story and what you're built against." },
        {
          label: "Product truth",
          detail: "Features, limits, and roadmap claims only you can vouch for.",
        },
        {
          label: "Competitor claims",
          detail: "Checked by someone who has actually used the other tool.",
        },
        { label: "The final edit", detail: "Rewrite any draft as many times as you like." },
      ],
    },

    painsTitle: "Why content keeps losing to the roadmap",
    painsIntro:
      "Every SaaS team agrees content matters. It's just never more urgent than the next release.",
    pains: [
      {
        pain: "The blog gets a post whenever someone has a free afternoon.",
        fix: "Cadence stops depending on who's free. Articles publish on a schedule the release train can't bump.",
      },
      {
        pain: "Buyers ask ChatGPT for the best tool in your category. You're not in the answer.",
        fix: "Research goes after the comparison and alternatives questions answer engines field about your category.",
      },
      {
        pain: "The docs explain the product. Nothing explains the problem.",
        fix: "Use-case and how-to articles get drafted from the questions buyers actually ask, then wait for your team's edit.",
      },
      {
        pain: "Your site is custom-built, and every content plugin assumes WordPress.",
        fix: "Pull finished articles through the REST API as HTML or Markdown, with slugs and meta, into whatever you built.",
      },
    ],

    workflowTitle: "How it fits a product team's week",
    workflowIntro: "Engineering touches it once, if at all. Marketing owns it from there.",
    steps: [
      {
        when: "Day 1",
        title: "Connect your site",
        body: "Install the Webflow, Framer, or WordPress app, or have an engineer wire up the API in an afternoon.",
      },
      {
        when: "Day 1",
        title: "Approve the map",
        body: "Rankbox reads your product and category, then ranks the comparison, alternative, and how-to questions around it.",
      },
      {
        when: "Every day",
        title: "Drafts arrive scored",
        body: "A sourced article in your voice, graded for SEO and GEO, waiting in the editor or live on your CMS.",
      },
      {
        when: "Every release",
        title: "Feed the map",
        body: "Ship a feature, add its use cases to the topic map, and the queue reorders around them.",
      },
    ],

    stackTitle: "What it takes off the content budget",
    stackIntro: "The usual early-stage SaaS content setup, before anyone is hired to own it.",
    stack: [
      {
        label: "A content agency retainer",
        detail: "Briefs, drafts, and a monthly call about the briefs",
      },
      {
        label: "Freelance technical writers",
        detail: "Per-article rates for how-tos and comparisons",
      },
      {
        label: "SEO research tool seats",
        detail: "Keyword and question research for the category",
      },
      { label: "On-page grading", detail: "A checklist someone runs before each post, sometimes" },
      {
        label: "Copy-paste publishing",
        detail: "Moving drafts from a doc into the CMS, fixing formatting as you go",
      },
    ],
    stackNote: `One plan covers ${PLAN.sites} site with ${PLAN.articlesPerMonth} published articles a month, research, scoring, publishing, and ${PLAN.backlinkCreditsPerMonth} backlink credits. The API and the MCP server are included, not sold as add-ons.`,

    picksTitle: "The parts a SaaS team leans on hardest",
    picksIntro:
      "The engine runs the same either way. These four matter most in a crowded category.",
    picks: [
      {
        featureSlug: "answer-space-research",
        why: "Finds the “X vs Y”, “alternatives to”, and “how do I” questions where buyers build a shortlist, ranked before anyone writes.",
      },
      {
        featureSlug: "citation-ready-writer",
        why: "Structured the way answer engines lift a passage: a direct answer first, sourced claims underneath.",
      },
      {
        featureSlug: "seo-geo-score",
        why: "A pre-publish bar the whole team can see, so quality doesn't depend on who drafted the piece.",
      },
      {
        featureSlug: "reddit-presence",
        why: "Buyers ask Reddit for honest tool picks, and AI engines read those threads. Rankbox finds them and drafts a disclosed reply for you to post.",
      },
    ],

    proof: [],
    proofTitle: "SaaS teams running it as the content function",

    topics: {
      title: "What it would write for a product like yours",
      intro:
        "Buyers build a shortlist long before a demo. These are the questions they build it from, and each one is an article.",
      brand: "Plannora",
      domain: "plannora.io",
      clusters: [
        {
          stage: "Choosing a tool",
          intent: "Buying",
          questions: [
            "What's the best planning tool for a small team?",
            "What should a team planner actually include?",
            "Is a shared calendar enough to plan projects?",
          ],
        },
        {
          stage: "Weighing options",
          intent: "Comparing",
          questions: [
            "Kanban vs Gantt: which fits a small team?",
            "Planning app or spreadsheet: when to switch?",
            "Free vs paid planners: what actually changes?",
          ],
        },
        {
          stage: "Getting it done",
          intent: "How-to",
          questions: [
            "How do you run a weekly planning meeting?",
            "How do you plan a product launch timeline?",
            "How do you estimate a project without guessing?",
          ],
        },
        {
          stage: "When it goes wrong",
          intent: "Fixing",
          questions: [
            "Why do team projects always run late?",
            "How do you stop scope creep mid-project?",
            "What do you do when priorities keep changing?",
          ],
        },
      ],
      note: "A sample map for Plannora, a fictional planning app. Yours is built from your own product and category, and nothing is written until you approve it.",
      platformsTitle: "Ships to the stack you already run",
      platforms: [
        { slug: "webflow", why: "Items in the CMS collection you choose, in your template." },
        { slug: "framer", why: "Items in your Framer CMS, laid out by your own page." },
        { slug: "api", why: "HTML or Markdown with slugs and meta, for any build." },
      ],
    },

    faqs: [
      {
        q: "Our marketing site is custom-built. Does that work?",
        a: "Yes. The REST API returns finished articles as HTML and Markdown with their slug, meta description, and tags, so any build can pull and render them. Webflow, Framer, and WordPress have apps instead, if that's where your marketing site lives.",
      },
      {
        q: "Will it write about our competitors?",
        a: "Comparison and alternatives questions matter a lot in SaaS, so they'll show up on your topic map. You choose which to approve, and anything that makes a claim about another product should be checked by someone who has used it before it publishes.",
      },
      {
        q: "Can it write about our own product?",
        a: "It writes researched, source-backed explainers and how-tos around the problem you solve. It hasn't used your product, so anything that depends on your own UI, API, or roadmap needs a pass from someone who has.",
      },
      {
        q: "Where do articles end up on our site?",
        a: "Wherever you point them. On Webflow and Framer, that's the CMS collection you choose. On WordPress, it's posts. With the API, it's any route you like: a blog, a guides section, or a resource hub.",
      },
      {
        q: "What does the MCP server add?",
        a: "It lets AI assistants like Claude, ChatGPT, and Cursor call Rankbox's research tools directly: questions people ask AI about a topic, content briefs, and meta descriptions. It's included with the plan.",
      },
    ],
    ctaTitle: "Let content ship on its own release train",
    ctaBody: `Paste your product's URL and see the questions buyers ask AI about your category. ${TRIAL_DAYS} days free, no card to start.`,
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "local-businesses",
    name: "Local businesses",
    nameLower: "local businesses",
    shortName: "Local",
    role: "local business",
    group: "business",
    icon: Store,
    tagline: "A blog that answers customers' questions while you work.",

    eyebrow: "Blog content and local SEO for small businesses",
    headline: { lead: "A blog that runs", accent: "while you work" },
    subhead:
      "You're running the business, not a content calendar. Rankbox finds what customers ask Google and ChatGPT about what you do, writes helpful, sourced articles in your voice, and publishes them to your Square Online, WordPress, or Webflow site without costing you an evening.",
    metaTitle: "Rankbox for Local Businesses: A Blog That Runs Itself",
    metaDescription:
      "Helpful articles about what you do, written in your voice and published to your Square Online, WordPress, or Webflow site. For owners with no time to blog.",

    shortAnswer:
      "Rankbox is an AI search growth engine that small local businesses use as their whole blog. It finds the questions customers ask Google and ChatGPT about what the business does, writes sourced, helpful articles in the owner's voice, scores them for search and AI answers, and publishes them to Square Online, WordPress, Webflow, or Framer. It does not manage Google Business Profile listings, reviews, or directory listings; those stay with the owner.",

    specs: [
      { value: "Native", label: "posts on Square Online, WordPress, or Webflow" },
      { value: "Minutes", label: "from your URL to a list of topics" },
      { value: `${PLAN.articlesPerMonth}/mo`, label: "helpful articles, written and published" },
      { value: "No card", label: `to start — ${TRIAL_DAYS}-day free trial` },
    ],

    handoff: {
      runsTitle: "Rankbox runs this",
      runs: [
        {
          label: "Knowing what to write",
          detail: "The questions customers ask about what you do, found for you.",
        },
        {
          label: "Writing it in your voice",
          detail: "Sourced, helpful articles that sound like you, not a template.",
        },
        {
          label: "Posting it",
          detail: "Published to your site's blog on a schedule, or held as drafts.",
        },
        {
          label: "A few good links",
          detail: "Backlink credits, so your site is more than a menu and a map.",
        },
      ],
      keepsTitle: "You keep this",
      keeps: [
        {
          label: "Your Google Business Profile",
          detail: "Hours, photos, and reviews. Rankbox doesn't manage listings.",
        },
        {
          label: "Local knowledge",
          detail: "Your neighbourhood, your regulars, your way of doing things.",
        },
        {
          label: "What you'll stand behind",
          detail: "Prices, promises, and anything about your own service.",
        },
        {
          label: "The day job",
          detail: "Serving customers, the reason the blog never got written.",
        },
      ],
    },

    painsTitle: "Why the website went quiet",
    painsIntro:
      "Nobody opens a bakery, a salon, or a plumbing business to write blog posts. So the site still says what it said the week it launched.",
    pains: [
      {
        pain: "The last blog post is from the week the site launched.",
        fix: "Articles publish on a schedule that doesn't wait for a quiet afternoon.",
      },
      {
        pain: "Customers ask the same questions every day, and the answers only live in your head.",
        fix: "The questions people ask online about what you do become helpful, sourced articles on your own site.",
      },
      {
        pain: "People ask ChatGPT for recommendations now, not just Google.",
        fix: "Every article is written and scored for how AI answers read a page, not only for a search listing.",
      },
      {
        pain: "Agencies and freelance writers are priced for much bigger businesses.",
        fix: `One plan at ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth} published articles. No contract, and you can cancel in one click.`,
      },
    ],

    workflowTitle: "What it asks of you",
    workflowIntro: "About ten minutes once, then a glance whenever you feel like it.",
    steps: [
      {
        when: "Minute 1",
        title: "Paste your website",
        body: "Rankbox reads your site, works out what you do and who you do it for, and learns how you talk about it.",
      },
      {
        when: "Minute 10",
        title: "Pick your topics",
        body: "A list of real customer questions comes back. Tick the ones that fit and skip the rest.",
      },
      {
        when: "Day 1",
        title: "Connect your site",
        body: "Add the Square app, or the plugin for WordPress, Webflow, or Framer. Articles publish from then on.",
      },
      {
        when: "Any time",
        title: "Read, or don't",
        body: "Keep new posts as drafts to check first, or let them publish on their own schedule.",
      },
    ],

    stackTitle: "What you don't have to hire",
    stackIntro: "The usual ways a small business gets a blog, and why most of them end up empty.",
    stack: [
      { label: "A marketing agency", detail: "A monthly retainer and a monthly report" },
      { label: "A freelance writer", detail: "Per-post rates, plus explaining your trade to them" },
      { label: "An SEO plugin", detail: "Settings pages nobody has opened since launch" },
      {
        label: "Canned blog content",
        detail: "Generic posts that could be about any business, anywhere",
      },
      { label: "Doing it yourself", detail: "Late nights after close, until it stops" },
    ],
    stackNote: STUDIO.live
      ? `One plan covers ${PLAN.sites} website: research, writing, publishing, and ${PLAN.backlinkCreditsPerMonth} backlink credits a month. Each location has its own site? ${STUDIO.name} adds each extra site for ${formatUsd(STUDIO.monthlyPerSite)} a month.`
      : `One plan covers ${PLAN.sites} website: research, writing, publishing, and ${PLAN.backlinkCreditsPerMonth} backlink credits a month. Cancel in one click and everything already published stays on your site.`,

    picksTitle: "The parts that matter when you're busy",
    picksIntro: "No marketing team means nobody to hand things to. These four are why that's fine.",
    picks: [
      {
        featureSlug: "auto-publishing",
        why: "The blog keeps going through the busy season without you remembering it exists.",
      },
      {
        featureSlug: "brand-voice",
        why: "Learned from your own site, so posts sound like the person behind the counter, not a template.",
      },
      {
        featureSlug: "answer-space-research",
        why: "Finds the questions customers ask about what you do, so you never have to decide what to write.",
      },
      {
        featureSlug: "authority-backlinks",
        why: "A small local site rarely gets linked to. This works on that in the background.",
      },
    ],

    proof: [],
    proofTitle: "Local businesses running it as the whole blog",

    topics: {
      title: "What it would write for a business like yours",
      intro:
        "Customers ask the same things at the counter every day. They ask Google and ChatGPT too, and each question is an article.",
      brand: "Rye & Rise Bakery",
      domain: "ryeandrise.com",
      clusters: [
        {
          stage: "Before they order",
          intent: "Buying",
          questions: [
            "How far ahead should you order a birthday cake?",
            "How many pastries for an office breakfast?",
            "What should you ask a wedding cake baker?",
          ],
        },
        {
          stage: "Weighing options",
          intent: "Comparing",
          questions: [
            "Rye vs whole wheat: what's the difference?",
            "Sourdough vs yeasted bread: what changes?",
            "Buttercream vs fondant: which travels better?",
          ],
        },
        {
          stage: "At home",
          intent: "How-to",
          questions: [
            "How do you revive a stale loaf?",
            "How should you freeze sourdough?",
            "How do you reheat croissants so they stay flaky?",
          ],
        },
        {
          stage: "Curious customers",
          intent: "Explaining",
          questions: [
            "How long does sourdough keep?",
            "What makes a croissant flaky?",
            "Why does sourdough taste sour?",
          ],
        },
      ],
      note: "A sample map for Rye & Rise, a fictional bakery. Yours is built from your own site and trade, and nothing is written until you approve it.",
      platformsTitle: "Posts to the site you already have",
      platforms: [
        { slug: "square", why: "Posts on your Square Online site's blog, live or as drafts." },
        { slug: "wordpress", why: "Native posts in your theme, published or held as drafts." },
        { slug: "webflow", why: "Items in your blog collection, laid out by your template." },
      ],
    },

    faqs: [
      {
        q: "Does this manage my Google Business Profile or reviews?",
        a: "No. Rankbox writes and publishes articles on your website. Your Google Business Profile, reviews, and directory listings stay with you. They matter a lot for local search, and they need your hand on them.",
      },
      {
        q: "I take payments with Square. Does the app see my sales?",
        a: "No. The Square app only creates and updates blog posts on your Square Online site. It never reads your items, orders, or customers. If your website runs somewhere else, connect that platform instead.",
      },
      {
        q: "I'm not a writer. Will it sound like me?",
        a: "It learns your voice from the pages already on your site, and you can rewrite any article before it goes live, as many times as you like. Keep posts as drafts and nothing publishes until you've read it.",
      },
      {
        q: "How much of my time does this take?",
        a: "About ten minutes to set up. After that, none, unless you want to read drafts before they go live.",
      },
      {
        q: "What kinds of business is this for?",
        a: "Any business whose customers ask questions before they buy: bakeries, cafés, salons, clinics, trades, studios, and shops. If people ask “how”, “how long”, or “which one” about what you do, there's something worth writing.",
      },
    ],
    ctaTitle: "Let the website keep up with you",
    ctaBody: `Paste your website and see the questions your customers are already asking. ${TRIAL_DAYS} days free, no card to start.`,
  },
];

export function getPersona(slug: string): Persona | undefined {
  return PERSONAS.find((p) => p.slug === slug);
}

export function personasIn(group: PersonaGroup): Persona[] {
  return PERSONAS.filter((p) => p.group === group);
}

/** "a marketer", "an agency". */
export function withArticle(role: string): string {
  return `${/^[aeiou]/i.test(role) ? "an" : "a"} ${role}`;
}

/** The H1 as one plain string, for schema and anywhere the lockup can't run. */
export function personaH1(p: Persona): string {
  return `${p.headline.lead} ${p.headline.accent}`;
}

export const PERSONA_SLUGS = PERSONAS.map((p) => p.slug);
