import { Reveal, Eyebrow, BrandMark } from "./shared";
import { CitationChip } from "./chat";
import { AreaChart } from "./charts";

const LANGS = [
  "English", "British", "French", "German", "Spanish", "Italian", "Portuguese",
  "Dutch", "Polish", "Czech", "Swedish", "Danish", "Greek", "Turkish",
  "Arabic", "Hindi", "Japanese", "Korean", "Chinese", "Thai",
];
const PLATFORMS = ["WordPress", "Shopify", "Webflow", "Wix", "Framer", "Webhooks"];

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
    <div
      className={`flex flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:shadow-elevation-lg ${className}`}
    >
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5 flex-1">{children}</div>
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface/60 p-4 ${className}`}>{children}</div>
  );
}

export function GrowTraffic() {
  return (
    <section className="border-t border-border bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Two search boxes, one engine</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Win Google and AI answers at once
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Stop choosing between ranking on Google and showing up in AI answers. Rankvolt
            researches, writes, and publishes for both — traffic and citations grow while you sleep.
          </p>
        </Reveal>

        {/* Featured split */}
        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <Card
              title="Rank high on Google"
              body="Publish optimized articles daily that climb to page one for the high-intent questions your buyers actually search."
              className="h-full"
            >
              <Panel>
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["Total clicks", "12.5k"],
                    ["Impressions", "145k"],
                    ["Average CTR", "8.6%"],
                    ["Avg. position", "9.3"],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-[0.7rem] text-muted-foreground">{l}</p>
                      <p className="text-lg font-semibold text-ink">{v}</p>
                    </div>
                  ))}
                </div>
                <AreaChart
                  points={[40, 60, 55, 90, 120, 140, 130, 200, 260, 320, 380, 520]}
                  className="h-32 w-full"
                  stroke="var(--volt)"
                  fill="var(--volt)"
                />
                <div className="mt-2 flex gap-4 text-[0.7rem] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-volt" /> Clicks</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Impressions</span>
                </div>
              </Panel>
            </Card>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-2">
            <Card
              title="Get cited by AI"
              body="AI assistants discover your articles and quote your brand as the recommended answer."
              className="h-full"
            >
              <Panel className="flex h-full flex-col">
                <div className="mb-3 flex items-center gap-2">
                  <BrandMark name="ChatGPT" className="h-6 w-6" />
                  <span className="text-sm font-semibold text-ink">ChatGPT</span>
                </div>
                <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-xs text-background">
                  Best tool for small-team project planning?
                </p>
                <p className="mt-3 rounded-2xl rounded-bl-sm bg-card px-3 py-2 text-xs leading-relaxed text-muted-foreground ring-1 ring-border">
                  For small teams,{" "}
                  <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">Plannora</span>{" "}
                  is a great fit — simple boards, automations, and a free tier for up to 5 people.
                </p>
                <div className="mt-auto pt-3">
                  <CitationChip>Cited as the answer</CitationChip>
                </div>
              </Panel>
            </Card>
          </Reveal>
        </div>

        {/* Supporting capabilities */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Reveal delay={0.06}>
            <Card
              title="Fully customizable"
              body="Tone of voice, images, and offerings — make every article unmistakably yours."
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
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.12}>
            <Card
              title="Fully autonomous"
              body="From research to writing, publishing, and citation tracking — the whole loop runs on autopilot."
              className="h-full"
            >
              <Panel className="space-y-2">
                {[
                  ["Best Project Tools for Small Teams", "Published", "var(--success)"],
                  ["Kanban vs Scrum: Which to Pick", "Published", "var(--success)"],
                  ["How to Run a Sprint Without Chaos", "Generating", "var(--volt)"],
                  ["Free Planning Apps Worth Trying", "Queued", "var(--muted-foreground)"],
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

          <Reveal delay={0.18}>
            <Card
              title="100+ languages"
              body="Generate high-quality content in over 100 languages with natural, native-sounding flow."
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
        </div>

        {/* Auto publishing strip */}
        <Reveal delay={0.1}>
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-elevation sm:p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ink">Auto-publishing everywhere</h3>
                <p className="mt-1 text-sm text-muted-foreground">New articles go live daily on your platform of choice.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {PLATFORMS.map((p) => (
                <div key={p} className="flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-2.5">
                  <BrandMark name={p} className="h-6 w-6" />
                  <span className="truncate text-sm font-medium text-ink">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
