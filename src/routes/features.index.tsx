import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { PixelField, UrlForm, TrustRow } from "@/components/landing/Hero";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Pricing } from "@/components/landing/Pricing";
import { ENGINE_ORDER, FEATURE_GROUPS, getFeature, type Feature } from "@/data/features";

const SITE = "https://rankbox.xyz";
const TITLE = "Features — The AI Search Growth Engine | Rankbox";
const DESCRIPTION =
  "Explore every Rankbox feature: answer-space research, a citation-ready AI writer, brand voice, SEO/GEO scoring, auto-publishing, backlinks, Reddit presence, and AI citation tracking.";

/* In the order the engine runs, so the page reads as one pipeline. */
const ORDERED = ENGINE_ORDER.map((slug) => getFeature(slug)).filter((f): f is Feature =>
  Boolean(f),
);

export const Route = createFileRoute("/features/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/features` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}/features` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${SITE}/features#webpage`,
              url: `${SITE}/features`,
              name: TITLE,
              description: DESCRIPTION,
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: { "@id": `${SITE}/features#list` },
            },
            {
              "@type": "ItemList",
              "@id": `${SITE}/features#list`,
              itemListElement: ORDERED.map((f, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: f.name,
                url: `${SITE}/features/${f.slug}`,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "Features", item: `${SITE}/features` },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: FeaturesIndex,
});

function FeaturesHero() {
  const [url, setUrl] = useState("");
  return (
    <section
      id="top"
      aria-labelledby="features-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-16 text-center sm:pb-24 sm:pt-24">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {ORDERED.length} features · one autopilot engine
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="features-title"
            className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
          >
            Everything it takes to get cited by AI
          </h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
            From finding the questions your buyers ask, to writing, scoring, and publishing the
            answers, to earning links and tracking every citation. Explore each part of the Rankbox
            engine.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 flex w-full flex-col items-center gap-3">
          <UrlForm url={url} onChange={setUrl} />
          <p className="text-sm text-white/70">No credit card required · Free 7-day trial</p>
        </Reveal>
        <Reveal delay={0.26} className="mt-10">
          <TrustRow />
        </Reveal>
      </div>
    </section>
  );
}

function FeatureCard({ feature, step }: { feature: Feature; step: number }) {
  const Icon = feature.icon;
  return (
    <Link
      to="/features/$slug"
      params={{ slug: feature.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:p-7"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-background transition-colors group-hover:bg-brand-blue">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
          {String(step).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-5 text-base font-semibold text-ink">{feature.name}</h3>
      <p className="mt-1 text-xs font-medium text-volt">{feature.eyebrow}</p>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {feature.tagline}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

const GROUP_COPY: Record<(typeof FEATURE_GROUPS)[number], { title: string; body: string }> = {
  Create: {
    title: "Create content AI wants to quote",
    body: "Research the questions, write the answers in your voice, and score every draft before it ships.",
  },
  Grow: {
    title: "Grow reach, authority, and citations",
    body: "Publish daily, earn links and mentions, and see exactly where AI engines recommend you.",
  },
};

function FeaturesIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <FeaturesHero />

        {FEATURE_GROUPS.map((group, gi) => {
          const items = ORDERED.filter((f) => f.group === group);
          return (
            <section
              key={group}
              aria-labelledby={`group-${group}`}
              className={
                gi % 2 === 1
                  ? "border-t border-border bg-surface/40 py-24 sm:py-28"
                  : "py-24 sm:py-28"
              }
            >
              <div className="mx-auto max-w-6xl px-5">
                <Reveal className="mx-auto max-w-2xl text-center">
                  <Eyebrow className="mb-4">{group}</Eyebrow>
                  <h2
                    id={`group-${group}`}
                    className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
                  >
                    {GROUP_COPY[group].title}
                  </h2>
                  <p className="mt-4 text-balance text-lg text-muted-foreground">
                    {GROUP_COPY[group].body}
                  </p>
                </Reveal>
                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                  {items.map((f, i) => (
                    <Reveal key={f.slug} delay={(i % 4) * 0.06}>
                      <FeatureCard feature={f} step={ORDERED.indexOf(f) + 1} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
