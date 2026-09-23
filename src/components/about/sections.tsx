/**
 * /about answers the question every byline raises: who is Rankbox?
 *
 *   hero       who we are in one sentence, beside the company's fact card; the
 *              card flips to the Organization markup AI engines read, so the
 *              page does what the glossary tells everyone else to do
 *   story      why Rankbox exists
 *   standards  the rules our guides, glossary and comparisons are written by,
 *              each with a link to where you can check it
 *   library    what we publish, counted from the data that renders it
 *   contact    where to reach the company, by reason
 *
 * Every fact comes from src/data/company.ts.
 */
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookA,
  ChevronRight,
  GitCompare,
  Mail,
  MessageSquare,
  PenLine,
  Scale,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { PixelField } from "@/components/landing/Hero";
import { Mark } from "@/components/brand/Mark";
import { AuthorMark } from "@/components/blog/PostCards";
import {
  Heading,
  HeroButtons,
  heroPrimary,
  heroSecondary,
} from "@/components/integrations/IntegrationSections";
import { ABOUT_UPDATED, COMPANY, SITE, STORY, organizationNode } from "@/data/company";
import { ENGINES } from "@/data/ai-seo/engines";
import { TERMS } from "@/data/glossary/terms";
import { TOOLS } from "@/data/tools";
import { COMPETITORS } from "@/data/alternatives";
import { MATCHUPS } from "@/data/compare/matchups";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

/** A mailto for the company inbox, with the subject started for them. */
function mailto(subject?: string) {
  return `mailto:${COMPANY.email}${subject ? `?subject=${encodeURIComponent(`${subject}: `)}` : ""}`;
}

/** "September 2026" */
function monthYear(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

const LINK = "font-semibold text-cta transition-colors hover:text-cta-hover";

/* ---------- hero ---------- */

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex justify-center lg:justify-start">
      <ol className="flex items-center gap-1.5 text-xs font-medium text-white/65">
        <li>
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="h-3 w-3" />
        </li>
        <li aria-current="page" className="text-white">
          About
        </li>
      </ol>
    </nav>
  );
}

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-12 sm:pb-24 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <Breadcrumb />
            </Reveal>
            <Reveal delay={0.05}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                Made by {COMPANY.legalName} · Since {COMPANY.foundingYear}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                id="about-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                We help small companies become the answer AI gives
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                Rankbox is an {COMPANY.category} made by {COMPANY.legalName}. It finds the questions
                your buyers ask ChatGPT, Perplexity, Gemini and Google, writes a source-backed
                article every day, and publishes it to your site.
              </p>
            </Reveal>
            <Reveal delay={0.22} className="mt-8">
              <HeroButtons
                primary={
                  <a href="#standards" className={heroPrimary}>
                    Read our standards <ArrowRight className="h-4 w-4" />
                  </a>
                }
                secondary={
                  <a href={mailto()} className={heroSecondary}>
                    <Mail className="h-4 w-4" /> Email us
                  </a>
                }
              />
            </Reveal>
          </div>

          <Reveal delay={0.3} y={24} className="min-w-0">
            <EntityCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- the fact card ---------- */

const VIEWS = [
  { id: "people", label: "For people" },
  { id: "engines", label: "For AI engines" },
] as const;
type View = (typeof VIEWS)[number]["id"];

/**
 * The company's facts, and the same facts as the markup in this page's head.
 * Both panels share one cell and the hidden one keeps its space, so the card
 * never changes height when you switch.
 */
function EntityCard() {
  const [view, setView] = useState<View>("people");
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between the two tabs, as the ARIA tabs pattern expects.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = VIEWS.length - 1;
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % VIEWS.length
        : e.key === "ArrowLeft"
          ? (i - 1 + VIEWS.length) % VIEWS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setView(VIEWS[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-card text-left text-ink shadow-4 lg:max-w-none">
      <div className="flex items-center gap-3.5 px-5 pt-5 sm:px-6 sm:pt-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white">
          <Mark className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-bold leading-tight tracking-tight">
            {COMPANY.name}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{COMPANY.category}</p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="How to read these facts"
        className="mx-5 mt-5 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1 sm:mx-6"
      >
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${v.id}`}
            aria-selected={view === v.id}
            aria-controls={`${uid}-panel-${v.id}`}
            tabIndex={view === v.id ? 0 : -1}
            onClick={() => setView(v.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
              view === v.id ? "bg-cta text-white shadow-1" : "text-muted-foreground hover:text-ink",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="relative px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
        <div
          role="tabpanel"
          id={`${uid}-panel-people`}
          aria-labelledby={`${uid}-tab-people`}
          className={cn(view !== "people" && "invisible")}
        >
          <FactList />
        </div>
        <div
          role="tabpanel"
          id={`${uid}-panel-engines`}
          aria-labelledby={`${uid}-tab-engines`}
          className={cn(
            "absolute inset-x-5 bottom-5 top-3 flex flex-col sm:inset-x-6 sm:bottom-6",
            view !== "engines" && "invisible",
          )}
        >
          <MarkupView />
        </div>
      </div>

      <p className="border-t border-border bg-surface/60 px-5 py-3 text-xs text-muted-foreground sm:px-6">
        Facts as of {formatDate(ABOUT_UPDATED)}
      </p>
    </div>
  );
}

function FactList() {
  const facts: { term: string; value: ReactNode }[] = [
    { term: "Made by", value: COMPANY.legalName },
    ...(COMPANY.foundingYear ? [{ term: "Founded", value: COMPANY.foundingYear }] : []),
    {
      term: "Formerly",
      value: `${COMPANY.formerName}, until ${monthYear(COMPANY.renamedOn)}`,
    },
    {
      term: "Website",
      value: (
        <a href={`${SITE}/`} className={LINK}>
          {COMPANY.domain}
        </a>
      ),
    },
    {
      term: "Contact",
      value: (
        <a href={mailto()} className={cn(LINK, "break-all")}>
          {COMPANY.email}
        </a>
      ),
    },
  ];
  return (
    <dl className="divide-y divide-border">
      {facts.map((f) => (
        <div key={f.term} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="shrink-0 text-sm text-muted-foreground">{f.term}</dt>
          <dd className="min-w-0 text-right text-sm font-semibold text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Strings that end in a colon are keys. Anything the pattern skips is
   punctuation or whitespace, and stays muted. */
const JSON_TOKEN = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null|-?\d+(?:\.\d+)?)\b/g;

function JsonTokens({ json }: { json: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of json.matchAll(JSON_TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(json.slice(last, at));
    if (m[1] && m[2]) {
      parts.push(
        <span key={at} className="text-cta">
          {m[1]}
        </span>,
        m[2],
      );
    } else if (m[1]) {
      parts.push(
        <span key={at} className="text-ink">
          {m[1]}
        </span>,
      );
    } else {
      parts.push(
        <span key={at} className="text-success">
          {m[3]}
        </span>,
      );
    }
    last = at + m[0].length;
  }
  parts.push(json.slice(last));
  return <code className="text-muted-foreground">{parts}</code>;
}

function MarkupView() {
  const json = JSON.stringify({ "@context": "https://schema.org", ...organizationNode() }, null, 2);
  return (
    <>
      <pre
        tabIndex={0}
        aria-label="Organization markup, as JSON-LD"
        className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-surface p-3.5 font-mono text-[0.7rem] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
      >
        <JsonTokens json={json} />
      </pre>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        The markup in this page&rsquo;s head. It&rsquo;s how AI engines tell Rankbox apart from
        anything with a similar name.{" "}
        <Link to="/glossary/$term" params={{ term: "entity-seo" }} className={LINK}>
          Why it matters
        </Link>
      </p>
    </>
  );
}

/* ---------- story ---------- */

export function Story() {
  return (
    <section aria-labelledby="story-title" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Heading id="story-title" eyebrow="Our story" title="Why Rankbox exists" align="left" />
        </div>
        <Reveal delay={0.08} className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          {STORY.map((p, i) => (
            <p
              key={p}
              className={cn(i === 0 && "text-xl leading-relaxed text-ink sm:text-[1.4rem]")}
            >
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- standards ---------- */

type Proof = { label: string } & (
  | { to: "/ai-seo" | "/compare" | "/glossary" | "/alternatives" }
  | { to: "/features/$slug"; params: { slug: string } }
);

/** Scoped to what we publish (guides, glossary, comparisons), because that's
 *  what these rules are enforced on. Each links to where a reader can check. */
const STANDARDS: { title: string; body: string; proof: Proof }[] = [
  {
    title: "We date what we check",
    body: "Every AI SEO guide, glossary entry and comparison shows when its facts were last checked. AI engines change monthly, and an undated claim about them is a guess.",
    proof: { label: "See an engine guide", to: "/ai-seo" },
  },
  {
    title: "We link to the source",
    body: "A competitor's price comes from their own pricing page, a crawler's name from the vendor's docs, a statistic from the study that published it. Each one links back there.",
    proof: { label: "See a head-to-head", to: "/compare" },
  },
  {
    title: "We don't dress examples up as data",
    body: "Rankbox doesn't have a proprietary dataset yet, so our guides never quote one. Frameworks and worked examples are presented as frameworks and examples, never as findings.",
    proof: { label: "See the glossary", to: "/glossary" },
  },
  {
    title: "We show the rows we lose",
    body: "Our comparisons ask the same questions of Rankbox and the other tool, including features Rankbox hasn't shipped yet, and say when the other tool is the better buy.",
    proof: { label: "See the comparisons", to: "/alternatives" },
  },
  {
    title: "No shortcuts that backfire",
    body: "Rankbox drafts Reddit replies that say who you are, and you post them yourself. Our Ask AI buttons send a plain question, with no hidden instruction to recommend us.",
    proof: {
      label: "How Reddit replies work",
      to: "/features/$slug",
      params: { slug: "reddit-presence" },
    },
  },
];

function BylineNote() {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-1">
      <AuthorMark className="h-11 w-11" />
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          About our byline
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Posts and guides signed <span className="font-semibold text-ink">{COMPANY.name}</span> are
          published by {COMPANY.legalName}, which answers for them. If something in one is wrong,{" "}
          <a href={mailto("Correction")} className={LINK}>
            tell us
          </a>{" "}
          and we&rsquo;ll fix it.
        </p>
      </div>
    </div>
  );
}

export function Standards() {
  return (
    <section
      id="standards"
      aria-labelledby="standards-title"
      className="scroll-mt-20 border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Heading
            id="standards-title"
            eyebrow="Editorial standards"
            title="How we decide what's true"
            intro="We sell visibility in AI answers, so our own pages have to be ones an AI engine can trust. These are the rules our guides, glossary and comparisons are written by."
            align="left"
          />
          <Reveal delay={0.1} className="mt-8">
            <BylineNote />
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <ol className="divide-y divide-border rounded-2xl border border-border bg-card shadow-1">
            {STANDARDS.map((s, i) => (
              <li key={s.title} className="flex gap-5 p-6 sm:gap-6 sm:p-7">
                <span
                  aria-hidden
                  className="pt-1 font-display text-sm font-bold tabular-nums text-cta"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                  <Link
                    to={s.proof.to}
                    params={"params" in s.proof ? s.proof.params : undefined}
                    className={cn(LINK, "group mt-3 inline-flex items-center gap-1.5 text-sm")}
                  >
                    {s.proof.label}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- library ---------- */

const LIBRARY: {
  icon: LucideIcon;
  value: number;
  unit: string;
  title: string;
  body: string;
  to: "/ai-seo" | "/glossary" | "/tools" | "/alternatives";
}[] = [
  {
    icon: Sparkles,
    value: ENGINES.length,
    unit: "engines covered",
    title: "AI SEO guides",
    body: "How ChatGPT, Perplexity, Gemini, Claude, Google and more find and cite their sources.",
    to: "/ai-seo",
  },
  {
    icon: BookA,
    value: TERMS.length,
    unit: "terms defined",
    title: "AI search glossary",
    body: "SEO, GEO and LLM search terms, each defined in one sentence, then explained.",
    to: "/glossary",
  },
  {
    icon: Wrench,
    value: TOOLS.length,
    unit: "free tools",
    title: "Free tools",
    body: "Readiness checks, robots.txt and llms.txt generators, schema and more.",
    to: "/tools",
  },
  {
    icon: GitCompare,
    value: COMPETITORS.length + MATCHUPS.length,
    unit: "comparisons",
    title: "Comparisons",
    body: "Rankbox beside other tools, and head-to-heads between them. Sourced and dated.",
    to: "/alternatives",
  },
];

export function Library() {
  return (
    <section aria-labelledby="library-title" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="library-title"
          eyebrow="What we publish"
          title="We publish what we learn"
          intro="What we find out about how AI engines choose their sources goes into free guides and tools. No signup, no email gate."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LIBRARY.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.06} className="h-full">
                <Link
                  to={item.to}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-1 transition-all hover:-translate-y-0.5 hover:border-cta/40 hover:shadow-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-soft text-cta">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-cta" />
                  </div>
                  <p className="mt-6 font-display text-4xl font-bold tabular-nums tracking-tight text-ink">
                    {item.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">{item.unit}</p>
                  <h3 className="mt-5 text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.1} className="mt-10 text-center">
          <Link to="/blog" className={cn(LINK, "group inline-flex items-center gap-1.5 text-sm")}>
            Or read the blog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */

const CHANNELS: {
  icon: LucideIcon;
  title: string;
  body: string;
  action: { label: string } & ({ href: string } | { to: "/trust" | "/legal/terms" });
}[] = [
  {
    icon: MessageSquare,
    title: "Questions and sales",
    body: "Anything about Rankbox, its plans, or whether it fits your site.",
    action: { label: "Email us", href: mailto() },
  },
  {
    icon: PenLine,
    title: "Report a mistake",
    body: "Something wrong in a guide, comparison or post? We'll correct it and update its date.",
    action: { label: "Send a correction", href: mailto("Correction") },
  },
  {
    icon: ShieldCheck,
    title: "Security and privacy",
    body: "How accounts and data are protected, and how to report a concern.",
    action: { label: "Trust & Security", to: "/trust" },
  },
  {
    icon: Scale,
    title: "Legal",
    body: `Rankbox is operated by ${COMPANY.legalName}, the party to your agreement.`,
    action: { label: "Terms of Service", to: "/legal/terms" },
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-20 border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="contact-title"
          eyebrow="Contact"
          title="Get in touch"
          intro={`Every message reaches ${COMPANY.legalName} at ${COMPANY.email}. Pick the reason and the subject line is filled in for you.`}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c, i) => {
            const Icon = c.icon;
            const cls = cn(LINK, "group mt-auto inline-flex items-center gap-1.5 pt-5 text-sm");
            const arrow = (
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            );
            return (
              <Reveal key={c.title} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-1">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-soft text-cta">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                  {"href" in c.action ? (
                    <a href={c.action.href} className={cls}>
                      {c.action.label} {arrow}
                    </a>
                  ) : (
                    <Link to={c.action.to} className={cls}>
                      {c.action.label} {arrow}
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
