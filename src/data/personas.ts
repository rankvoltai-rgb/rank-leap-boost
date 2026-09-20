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
 */
import { Megaphone, Rocket, Building2, type LucideIcon } from "lucide-react";
import { PLAN, TRIAL_DAYS, formatUsd } from "./pricing";

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
  /** Singular, for mid-sentence use: "a marketer". */
  role: string;
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

  /** Names from the landing TESTIMONIALS, closest seat first. */
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
    role: "marketer",
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
    role: "solo founder",
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
    role: "agency",
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
      { value: "1 plan", label: "per client site, priced the same each time" },
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
        body: "One plan per client site. Point it at their domain and it learns their category and their voice.",
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
    stackNote: `Plans cover ${PLAN.sites} site each, so a book of clients is one plan per client site. Running several accounts? Email us and we'll work out the right setup with you.`,

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
        a: `No, and we'd rather say so plainly: each plan covers ${PLAN.sites} website, with its own research, topic map, voice, and publishing schedule. A book of clients means one plan per client site. If you're running several, email us and we'll work out the right setup with you.`,
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
];

export function getPersona(slug: string): Persona | undefined {
  return PERSONAS.find((p) => p.slug === slug);
}

/** The H1 as one plain string, for schema and anywhere the lockup can't run. */
export function personaH1(p: Persona): string {
  return `${p.headline.lead} ${p.headline.accent}`;
}

export const PERSONA_SLUGS = PERSONAS.map((p) => p.slug);
