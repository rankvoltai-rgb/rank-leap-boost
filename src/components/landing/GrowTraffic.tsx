import { Reveal, SectionHeading, BrandMark } from "./shared";
import { AreaChart } from "./charts";

const LANGS = [
  "English", "British", "French", "German", "Spanish", "Italian", "Portuguese",
  "Dutch", "Polish", "Czech", "Swedish", "Danish", "Greek", "Turkish",
  "Arabic", "Hindi", "Japanese", "Korean", "Chinese", "Thai",
];
const PLATFORMS = ["WordPress", "Shopify", "Webflow", "Wix", "Framer", "Webhooks"];

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface/60 p-4 ${className}`}>{children}</div>
  );
}

function Card({
  title,
  body,
  children,
  className = "",
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border border-border bg-card p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5 flex-1">{children}</div>
    </div>
  );
}

export function GrowTraffic() {
  return (
    <section className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="Grow Traffic While You Sleep"
          subtitle="Stop spending hours writing, paying agencies, or juggling expensive SEO tools. Our AI agent handles everything, bringing traffic and sales while you sleep."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {/* Rank high on Google */}
          <Reveal className="lg:col-span-2">
            <Card
              title="Rank High on Google"
              body="Publish SEO-optimized articles daily that climb to page one. Target high-intent keywords your customers actually search for."
              className="h-full"
            >
              <Panel>
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["Total clicks", "12.5k"],
                    ["Total impressions", "145k"],
                    ["Average CTR", "8.6%"],
                    ["Average position", "9.3"],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-[0.7rem] text-muted-foreground">{l}</p>
                      <p className="text-lg font-bold text-ink">{v}</p>
                    </div>
                  ))}
                </div>
                <AreaChart
                  points={[40, 60, 55, 90, 120, 140, 130, 200, 260, 320, 380, 520]}
                  className="h-28 w-full"
                  stroke="var(--info)"
                  fill="var(--info)"
                />
                <div className="mt-2 flex gap-4 text-[0.7rem] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-info" /> Clicks</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Impressions</span>
                </div>
              </Panel>
            </Card>
          </Reveal>

          {/* Get mentioned by AI */}
          <Reveal delay={0.06}>
            <Card
              title="Get Mentioned by AI"
              body="AI assistants discover your articles and recommend your business."
              className="h-full"
            >
              <Panel>
                <div className="mb-3 flex items-center gap-2">
                  <BrandMark name="ChatGPT" className="h-6 w-6" />
                  <span className="text-sm font-semibold text-ink">ChatGPT</span>
                </div>
                <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-xs text-background">
                  What's the best CRM for small businesses?
                </p>
                <p className="mt-3 rounded-2xl rounded-bl-sm bg-card px-3 py-2 text-xs leading-relaxed text-muted-foreground ring-1 ring-border">
                  I'd recommend <span className="font-semibold text-ink">Acme CRM</span>. Built for small teams with simple pipelines, email automation, and a free plan for up to 5 users. Trusted by 10,000+ small businesses.
                </p>
              </Panel>
            </Card>
          </Reveal>

          {/* Fully customizable */}
          <Reveal delay={0.06}>
            <Card
              title="Fully Customizable"
              body="Tone of voice, images, offerings. Make every article yours."
              className="h-full"
            >
              <div className="space-y-2.5">
                <Panel className="flex items-center justify-between p-3">
                  <span className="text-xs text-muted-foreground">Tone of Voice</span>
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-ink">Conversational</span>
                </Panel>
                <Panel className="p-3">
                  <span className="text-xs text-muted-foreground">Image Style</span>
                  <div className="mt-2 flex gap-2">
                    {["Photo", "3D", "Custom"].map((s, i) => (
                      <span
                        key={s}
                        className={`rounded-md px-2 py-1 text-xs font-medium ${i === 0 ? "bg-ink text-background" : "bg-secondary text-ink"}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Panel>
                <Panel className="p-3">
                  <span className="text-xs text-muted-foreground">Instructions</span>
                  <p className="mt-1 text-[0.7rem] leading-relaxed text-ink">
                    Use numbered lists instead of bullets. Always include pricing comparisons.
                  </p>
                </Panel>
              </div>
            </Card>
          </Reveal>

          {/* Fully autonomous */}
          <Reveal delay={0.06}>
            <Card
              title="Fully Autonomous"
              body="From keyword research to writing, publishing, and building backlinks. RankPill does everything on autopilot."
              className="h-full"
            >
              <Panel className="space-y-2">
                {[
                  ["Best Espresso Machines for Cafes", "Published", "var(--success)"],
                  ["How to Choose Coffee Beans", "Published", "var(--success)"],
                  ["Why Single Origin Is Worth It", "Generating", "var(--info)"],
                  ["Coffee Shop Interior on a Budget", "Queued", "var(--muted-foreground)"],
                ].map(([t, st, c]) => (
                  <div key={t} className="flex items-center justify-between rounded-lg bg-card px-2.5 py-1.5 ring-1 ring-border">
                    <span className="truncate pr-2 text-[0.7rem] font-medium text-ink">{t}</span>
                    <span className="flex shrink-0 items-center gap-1 text-[0.6rem] font-semibold uppercase" style={{ color: c }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} /> {st}
                    </span>
                  </div>
                ))}
              </Panel>
            </Card>
          </Reveal>

          {/* 100+ languages */}
          <Reveal delay={0.06}>
            <Card
              title="100+ Languages"
              body="Generate high-quality content in over 100 languages with perfect grammar and natural flow."
              className="h-full"
            >
              <div className="flex flex-wrap gap-1.5">
                {LANGS.map((l) => (
                  <span key={l} className="rounded-md border border-border bg-surface px-2 py-1 text-[0.7rem] text-muted-foreground">
                    {l}
                  </span>
                ))}
                <span className="rounded-md bg-ink px-2 py-1 text-[0.7rem] font-medium text-background">+82 more</span>
              </div>
            </Card>
          </Reveal>

          {/* Auto publishing */}
          <Reveal delay={0.06}>
            <Card
              title="Auto Publishing"
              body="Get new articles published daily to your website automatically."
              className="h-full"
            >
              <div className="space-y-2">
                {PLATFORMS.map((p) => (
                  <div key={p} className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-ink">
                      <BrandMark name={p} className="h-6 w-6" /> {p}
                    </span>
                    <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">Connect</span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}