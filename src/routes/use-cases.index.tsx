import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, UserRound } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { PixelField, UrlForm, TrustRow } from "@/components/landing/Hero";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Pricing } from "@/components/landing/Pricing";
import { PERSONAS, PERSONA_GROUPS, personasIn, type Persona } from "@/data/personas";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";

const SITE = "https://rankbox.xyz";
const TITLE = "Who Rankbox Is For: Use Cases by Role and Business";
const DESCRIPTION =
  "The same AI search growth engine, written for your seat or your business: marketers, solo founders, SEO agencies, e-commerce stores, SaaS companies, and local businesses.";

/** The claim the index makes once, rather than on every card. */
const PILLARS = [
  {
    title: "The same engine, every time",
    body: "There is one product and one plan. These pages differ in what they emphasise, never in what you get.",
  },
  {
    title: "What stays your job, stated",
    body: "Every page names the work Rankbox does not do. Strategy, approvals, and the final edit never leave your desk.",
  },
  {
    title: "No promised numbers",
    body: "We quote what the product does — articles published, platforms supported, engines tracked — not traffic we can't guarantee.",
  },
];

export const Route = createFileRoute("/use-cases/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/use-cases` },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}/use-cases` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${SITE}/use-cases#webpage`,
              url: `${SITE}/use-cases`,
              name: TITLE,
              description: DESCRIPTION,
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: { "@id": `${SITE}/use-cases#list` },
            },
            {
              "@type": "ItemList",
              "@id": `${SITE}/use-cases#list`,
              itemListElement: PERSONAS.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `Rankbox for ${p.nameLower}`,
                url: `${SITE}/use-cases/${p.slug}`,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "Use cases", item: `${SITE}/use-cases` },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: UseCasesIndex,
});

function UseCasesHero() {
  const [url, setUrl] = useState("");
  return (
    <section
      id="top"
      aria-labelledby="use-cases-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-16 text-center sm:pb-24 sm:pt-24">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            One engine · {PERSONAS.length} very different weeks
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="use-cases-title"
            className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
          >
            Who Rankbox is for
          </h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
            A marketer with no writers, a founder with no team, an agency with a client book. A
            store, a software product, a shop on the high street. Same engine, very different weeks.
            Find yours by the seat you sit in or the business you run.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 flex w-full flex-col items-center gap-3">
          <UrlForm url={url} onChange={setUrl} />
          <p className="text-sm text-white/70">
            No credit card required · Free {TRIAL_DAYS}-day trial
          </p>
        </Reveal>
        <Reveal delay={0.26} className="mt-10">
          <TrustRow />
        </Reveal>
      </div>
    </section>
  );
}

/** A label as it reads mid-list: "The final edit" → "the final edit", with
 *  names left alone ("Your Google Business Profile" → "your Google Business
 *  Profile"). Only the first letter moves, and only on an ordinary word. */
function midSentence(label: string): string {
  return /^[A-Z][a-z]/.test(label) ? label[0].toLowerCase() + label.slice(1) : label;
}

/* A preview of the page behind it: the persona's own handoff lines, so the
   card can never drift from what it links to. */
function PersonaCard({ persona }: { persona: Persona }) {
  const Icon = persona.icon;
  return (
    <Link
      to="/use-cases/$slug"
      params={{ slug: persona.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:p-7"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-background transition-colors group-hover:bg-brand-blue">
          <Icon className="h-4 w-4" />
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>

      <h4 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
        Rankbox for {persona.nameLower}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{persona.tagline}</p>

      <p className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {persona.handoff.runsTitle}
      </p>
      <ul className="mt-3 space-y-2 border-t border-border pt-3">
        {persona.handoff.runs.slice(0, 3).map((r) => (
          <li key={r.label} className="flex items-center gap-2.5 text-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
            </span>
            <span className="flex-1 truncate text-ink">{r.label}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-surface/70 p-3 text-xs leading-snug text-muted-foreground">
        <UserRound className="mt-px h-3.5 w-3.5 shrink-0 text-volt" aria-hidden />
        <span>
          <span className="font-semibold text-ink">Still yours: </span>
          {persona.handoff.keeps.map((k) => midSentence(k.label)).join(", ")}.
        </span>
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-ink">
        See the full page
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function UseCasesIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <UseCasesHero />

        {/* How we write these */}
        <section aria-labelledby="method-title" className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="mb-4">How we write these</Eyebrow>
              <h2
                id="method-title"
                className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                {PERSONAS.length} pages, one honest product
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.06}>
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
                    <span className="text-xs font-semibold tabular-nums text-volt">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-base font-semibold text-ink">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* The seats */}
        <section aria-labelledby="list-title" className="py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow className="mb-4">Pick your seat</Eyebrow>
              <h2
                id="list-title"
                className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Which of these is your week?
              </h2>
              <p className="mt-4 text-balance text-lg text-muted-foreground">
                Each page runs the same four questions: what you hand over, what stays yours, how it
                lands in your week, and what it takes off the invoice. Business pages add what it
                would write for you, and where it would publish.
              </p>
            </Reveal>
            <div className="mt-14 space-y-14">
              {PERSONA_GROUPS.map((g) => (
                <div key={g.id} aria-labelledby={`group-${g.id}`} role="group">
                  <Reveal className="mb-5 flex items-center gap-4">
                    <h3
                      id={`group-${g.id}`}
                      className="shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink"
                    >
                      {g.label}
                    </h3>
                    <span aria-hidden className="h-px flex-1 bg-border" />
                    <p className="shrink-0 text-xs text-muted-foreground">{g.blurb}</p>
                  </Reveal>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {personasIn(g.id).map((p, i) => (
                      <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                        <PersonaCard persona={p} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
                In a seat we haven&rsquo;t written up?{" "}
                <a
                  href="/auth"
                  className="font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
                >
                  Start a trial
                </a>{" "}
                — it&rsquo;s the same engine either way.
              </p>
            </Reveal>
          </div>
        </section>

        {/* The one-line answer for people who skim */}
        <section aria-labelledby="summary-title" className="border-t border-border bg-surface/40">
          <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-24">
            <Reveal>
              <h2
                id="summary-title"
                className="font-display text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                What Rankbox is, in one line
              </h2>
              <p className="mx-auto mt-5 text-balance text-lg leading-relaxed text-muted-foreground">
                Rankbox is an AI search growth engine: it finds the questions your buyers ask
                ChatGPT, Perplexity, and Google, writes source-backed articles in your brand voice,
                scores them for search and for AI answers, publishes them to your site daily, and
                tracks which answers now cite you — {formatUsd(PLAN.monthly)} a month for{" "}
                {PLAN.articlesPerMonth} published articles on {PLAN.sites} site.
              </p>
              <Link
                to="/features"
                className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
              >
                See how the engine works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </section>

        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
