import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { FEATURES } from "@/data/features";

export const Route = createFileRoute("/features/")({
  head: () => ({
    meta: [
      { title: "Features — The AI Search Growth Engine | Rankvolt" },
      {
        name: "description",
        content:
          "Explore every Rankvolt feature: answer-space research, citation-ready writing, auto-publishing, citation tracking, authority backlinks, and more.",
      },
      { property: "og:title", content: "Features — The AI Search Growth Engine | Rankvolt" },
      {
        property: "og:description",
        content:
          "Everything Rankvolt does to get your brand cited by ChatGPT, Perplexity, and Google AI Overviews — and ranked on Google.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rankvolt.top/features" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/features" }],
  }),
  component: FeaturesIndex,
});

function FeaturesIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-hero-glow" />
          <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-16 text-center sm:pt-24">
            <Reveal>
              <Eyebrow className="mb-5">Features</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                One agent, built to get you cited
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
                From answer-space research to writing, publishing, and tracking citations — explore
                everything Rankvolt does to grow your brand across AI search and Google.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal key={f.slug} delay={(i % 3) * 0.06}>
                    <Link
                      to="/features/$slug"
                      params={{ slug: f.slug }}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:p-7"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-background">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="mt-5 text-base font-semibold text-ink">{f.name}</h2>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {f.tagline}
                      </p>
                      <span className="mt-4 text-sm font-semibold text-volt transition-colors group-hover:text-ink">
                        Learn more →
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}