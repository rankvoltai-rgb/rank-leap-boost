import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow, PrimaryButton } from "@/components/landing/shared";

const URL = "https://rankvolt.top/blog/measuring-geo-success";
const TITLE = "How to Measure the Success of GEO Campaigns | Rankvolt";
const DESCRIPTION =
  "A practical framework for measuring generative engine optimization success: track citations in ChatGPT, Perplexity, and Google AI Overviews and prove the ROI of your GEO campaigns.";
const PUBLISHED = "2026-06-24";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do you measure the success of generative engine optimization campaigns?",
    a: "Measure GEO success across four layers: citation share (how often AI engines name your brand for target prompts), citation quality (whether you're the primary source or a passing mention), referral traffic from AI assistants, and downstream conversions from that traffic. Track each on a fixed prompt set and review the trend monthly rather than chasing a single number.",
  },
  {
    q: "What is a citation in AI search?",
    a: "A citation is any time an AI engine — ChatGPT, Perplexity, Google AI Overviews, Claude, Copilot — names your brand, quotes your content, or links to your page inside its generated answer. Citations are the GEO equivalent of a ranking: they're the visible proof your content is being used to answer real questions.",
  },
  {
    q: "Which metrics prove GEO ROI to a CEO or client?",
    a: "Lead with citation share for your priority prompts, then connect it to assistant referral sessions and the pipeline or revenue those sessions produce. A simple 'we're now cited in 38% of buyer prompts, up from 6%, driving X assistant-referred signups' line ties an AI-search metric to a business outcome.",
  },
  {
    q: "How is GEO measurement different from traditional SEO?",
    a: "Traditional SEO has a stable, rankable SERP you can scrape for positions. GEO answers are generated, personalized, and vary run-to-run, so you measure citation frequency across repeated samples instead of a fixed rank. You also can't rely on Search Console — assistant referrals show up inconsistently in analytics, so a defined prompt panel is your source of truth.",
  },
];

export const Route = createFileRoute("/blog/measuring-geo-success")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: "How to Measure the Success of Your GEO Campaigns",
              description: DESCRIPTION,
              datePublished: PUBLISHED,
              dateModified: PUBLISHED,
              author: { "@type": "Organization", name: "Rankvolt" },
              publisher: { "@type": "Organization", name: "Rankvolt" },
              mainEntityOfPage: URL,
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://rankvolt.top/" },
                { "@type": "ListItem", position: 2, name: "Guides", item: "https://rankvolt.top/blog" },
                { "@type": "ListItem", position: 3, name: "Measuring GEO Success", item: URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: GuidePage,
});

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-14 scroll-mt-24 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">{children}</p>;
}

const METRICS = [
  {
    name: "Citation share",
    what: "Of your tracked prompts, the % where an AI engine names your brand.",
    why: "The closest GEO equivalent to keyword rankings — your visible footprint in answers.",
  },
  {
    name: "Citation quality",
    what: "Whether you're the primary cited source vs. a passing mention.",
    why: "Being the answer beats being a footnote. Primary citations drive far more trust and clicks.",
  },
  {
    name: "Assistant referrals",
    what: "Sessions arriving from ChatGPT, Perplexity, Copilot, and AI Overviews.",
    why: "Turns visibility into measurable traffic you can attribute and grow.",
  },
  {
    name: "Downstream conversions",
    what: "Signups, demos, or revenue from assistant-referred sessions.",
    why: "The line that proves ROI to a CEO or client — visibility tied to pipeline.",
  },
];

const STEPS = [
  {
    title: "Build a fixed prompt panel",
    body: "Write 30–50 prompts your buyers actually ask AI — problem questions, comparison questions, and branded questions. Freeze the list. This panel is your measurement instrument; changing it mid-campaign breaks your trend line.",
  },
  {
    title: "Sample each engine on a schedule",
    body: "Run the panel against ChatGPT, Perplexity, and Google AI Overviews weekly. Because answers vary run-to-run, sample each prompt 3–5 times and record how often you appear — frequency, not a one-off snapshot, is the signal.",
  },
  {
    title: "Score citations consistently",
    body: "For every appearance, log the engine, the prompt, whether you were the primary source or a mention, and the competitors cited alongside you. A simple spreadsheet or a tool that automates the sampling both work — consistency matters more than tooling.",
  },
  {
    title: "Connect citations to traffic",
    body: "Tag assistant referrers in your analytics (referrer contains chatgpt.com, perplexity.ai, etc.) and watch whether rising citation share tracks rising assistant sessions. The correlation is your proof the work compounds.",
  },
  {
    title: "Report the trend, not the noise",
    body: "Review monthly. Lead with citation share movement on priority prompts, then assistant referrals, then conversions. One clean trend line — 'cited in 38% of buyer prompts, up from 6%' — communicates ROI better than a wall of numbers.",
  },
];

function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <article className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:pt-32">
          <Reveal>
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-ink">
                Home
              </Link>
              <span className="mx-1.5">/</span>
              <span>Guides</span>
            </nav>
            <Eyebrow className="mt-5">GEO Playbook</Eyebrow>
            <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem] sm:leading-[1.08]">
              How to Measure the Success of Your GEO Campaigns
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              A practical framework for tracking citations across ChatGPT, Perplexity, and Google AI
              Overviews — so you can prove the ROI of generative engine optimization instead of
              guessing at it.
            </p>
            <p className="mt-5 text-xs font-medium text-muted-foreground">
              Rankvolt · {new Date(PUBLISHED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · 8 min read
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <P>
              Generative engine optimization works — but it only earns budget if you can measure it.
              The hardest question every founder and SEO lead now faces is simple to ask and hard to
              answer: <em>how do you measure the success of generative engine optimization
              campaigns</em> when the "search results" are generated on the fly and look different
              every time? This guide gives you a repeatable framework to answer it.
            </P>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-10 rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-semibold text-ink">What you'll learn</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#why-hard" className="transition-colors hover:text-ink">
                    1. Why GEO is harder to measure than SEO
                  </a>
                </li>
                <li>
                  <a href="#metrics" className="transition-colors hover:text-ink">
                    2. The four metrics that actually matter
                  </a>
                </li>
                <li>
                  <a href="#framework" className="transition-colors hover:text-ink">
                    3. A 5-step measurement framework
                  </a>
                </li>
                <li>
                  <a href="#roi" className="transition-colors hover:text-ink">
                    4. Turning citations into a ROI story
                  </a>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-ink">
                    5. FAQ
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <H2 id="why-hard">1. Why GEO is harder to measure than SEO</H2>
            <P>
              Traditional SEO gives you a stable artifact to measure: a ranked list of ten blue links
              you can scrape for positions, impressions, and clicks. Generative engine optimization
              has no such artifact. ChatGPT, Perplexity, and Google AI Overviews <em>synthesize</em> a
              fresh answer for every query, personalize it, and phrase it differently each run. There
              is no fixed "position 3" to track.
            </P>
            <P>
              That changes the unit of measurement. In SEO you measure rank. In GEO you measure{" "}
              <strong className="text-ink">citation frequency</strong> — how often, across many
              samples, an engine chooses to name or quote you when answering the questions your
              buyers ask. Search Console won't help here either: assistant referrals land in
              analytics inconsistently and many AI answers drive zero clicks while still shaping a
              buyer's shortlist. Your own defined prompt panel becomes the source of truth.
            </P>
          </Reveal>

          <Reveal>
            <H2 id="metrics">2. The four metrics that actually matter</H2>
            <P>
              Resist the urge to track everything. Four metrics, layered from visibility to revenue,
              tell the whole story of a GEO campaign.
            </P>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {METRICS.map((m) => (
                <div key={m.name} className="rounded-2xl border border-border bg-card p-5">
                  <p className="font-display text-lg font-semibold text-ink">{m.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.what}</p>
                  <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-medium text-ink">Why it matters: </span>
                    {m.why}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <H2 id="framework">3. A 5-step measurement framework</H2>
            <P>
              This is the exact loop we run inside Rankvolt to quantify whether AI-search work is
              paying off. It works whether you track it in a spreadsheet or automate it.
            </P>
            <ol className="mt-6 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-volt/10 text-sm font-semibold text-volt">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-ink">{s.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <H2 id="roi">4. Turning citations into a ROI story</H2>
            <P>
              A citation count is interesting; a revenue line is fundable. Bridge the two by tracing
              the path: rising citation share → more assistant-referred sessions → conversions from
              those sessions. When you can say{" "}
              <em>
                "we're now cited in 38% of buyer prompts, up from 6% in March, and assistant referrals
                drove 47 trial signups last month"
              </em>
              , you've turned an abstract AI-search metric into a business outcome any stakeholder
              understands.
            </P>
            <P>
              Keep the report boring and consistent. The same prompt panel, the same engines, the
              same monthly cadence. GEO compounds slowly and then quickly — a stable measurement
              system is what lets you see the inflection coming and defend the budget that gets you
              there.
            </P>
          </Reveal>

          <Reveal>
            <div className="mt-14 rounded-3xl border border-border bg-card p-8 text-center">
              <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                Let Rankvolt track your citations for you
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Rankvolt publishes citation-ready articles daily and monitors where ChatGPT,
                Perplexity, and Google AI Overviews mention your brand — so the measurement loop runs
                on autopilot.
              </p>
              <PrimaryButton className="mt-6">Start getting cited</PrimaryButton>
            </div>
          </Reveal>

          <Reveal>
            <H2 id="faq">5. Frequently asked questions</H2>
            <div className="mt-6 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                  <p className="font-display text-base font-semibold text-ink">{f.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </article>
      </main>
      <Footer />
    </div>
  );
}