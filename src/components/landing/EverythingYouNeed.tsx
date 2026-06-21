import { Reveal, Eyebrow, BrandMark } from "./shared";

const TAGS = [
  "Answer-Space Map", "Auto Keywords", "Live Web Research", "Internal Linking",
  "Source Citations", "Auto Images", "Featured Images", "Humanized Content",
  "Brand Voice", "Custom Instructions", "AI Article Editor", "Content Calendar",
  "Product Promotion", "Meta Descriptions", "Plagiarism-Free", "SEO/GEO Score",
  "Citation Tracking", "Multi Sites", "Team Members", "AI Assistant",
];

function Tile({
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
      className={`flex flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg sm:p-7 ${className}`}
    >
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5 flex-1 rounded-xl border border-border bg-surface/60 p-3">{children}</div>
    </div>
  );
}

function Step({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-card px-2.5 py-1.5 text-xs ring-1 ring-border">
      <span className="font-medium text-ink">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

export function EverythingYouNeed() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">One platform, end to end</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Everything you need to get cited
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Answer-space research, AI-written articles, citation tracking, and auto-publishing —
            so you get found by buyers searching on Google, ChatGPT, Perplexity, and beyond.
          </p>
        </Reveal>

        <div className="mt-16 grid auto-rows-fr gap-5 md:grid-cols-3 lg:gap-6">
          {/* A — wide */}
          <Reveal className="md:col-span-2">
            <Tile
              title="Growth Automation"
              body="Automate research, writing, linking, and publishing. Set it once and watch traffic and citations compound."
              className="h-full"
            >
              <div className="grid gap-1.5 sm:grid-cols-2">
                <Step label="Searching Google" value="24 sources" />
                <Step label="Scraping content" value="18 pages" />
                <Step label="Writing content" value="3,247 words" />
                <Step label="Adding links" value="20 links" />
                <Step label="Adding images" value="6 images" />
                <Step label="Publishing" value="9:00 AM" />
              </div>
            </Tile>
          </Reveal>

          {/* B — tall */}
          <Reveal delay={0.06} className="md:row-span-2">
            <Tile
              title="Citation-Ready Writer"
              body="AI drafts deeply researched long-form articles in your brand voice — structured for Google and AI answer engines."
              className="h-full"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Article Score</span>
                <span className="text-2xl font-bold text-success">100<span className="text-sm text-muted-foreground">/100</span></span>
              </div>
              <div className="space-y-1.5">
                <Step label="Word count" value="3,247 / 3,000" />
                <Step label="Keyword density" value="0.8% optimal" />
                <Step label="Headings" value="8 added" />
                <Step label="Images" value="6 added" />
                <Step label="Internal links" value="20 added" />
                <Step label="Readability" value="Grade A" />
              </div>
              <div className="mt-3 rounded-lg border border-volt/30 bg-volt/10 px-2.5 py-2 text-[0.7rem] text-ink">
                Optimized for both search rankings and AI citations.
              </div>
            </Tile>
          </Reveal>

          {/* C */}
          <Reveal delay={0.12}>
            <Tile
              title="Answer-Space Research"
              body="Find the high-intent questions your buyers ask AI and search. Sorted by volume and intent."
              className="h-full"
            >
              <p className="mb-2 text-xs font-medium text-ink">460 keywords found</p>
              <div className="space-y-1.5">
                {[
                  ["best project management tool", "18,100", "24"],
                  ["kanban vs scrum", "9,900", "19"],
                  ["free planning apps", "6,600", "31"],
                ].map(([k, v, d]) => (
                  <div key={k} className="rounded-lg bg-card px-2.5 py-1.5 ring-1 ring-border">
                    <p className="text-xs font-medium text-ink">{k}</p>
                    <p className="text-[0.65rem] text-muted-foreground">Volume: {v} | Difficulty: {d}</p>
                  </div>
                ))}
              </div>
            </Tile>
          </Reveal>

          {/* D */}
          <Reveal delay={0.18}>
            <Tile
              title="Authority Backlinks"
              body="Earn high-quality backlinks from verified sites in your niche. Grow domain authority fast."
              className="h-full"
            >
              <div className="space-y-1.5">
                {[
                  ["Verified", "10 Best Tools for Lean Teams", "88"],
                  ["Verified", "Sprint Planning Cost Guide", "81"],
                  ["Pending", "Remote Standup Best Practices", "76"],
                ].map(([st, a, dr]) => (
                  <div key={a} className="flex items-center justify-between gap-2 rounded-lg bg-card px-2.5 py-1.5 ring-1 ring-border">
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold ${st === "Verified" ? "bg-success/15 text-success" : "bg-warning/20 text-warning"}`}>{st}</span>
                    <span className="flex-1 truncate text-[0.7rem] text-ink">{a}</span>
                    <span className="shrink-0 text-[0.7rem] font-semibold text-muted-foreground">DR {dr}</span>
                  </div>
                ))}
              </div>
            </Tile>
          </Reveal>

          {/* E — wide */}
          <Reveal delay={0.12} className="md:col-span-2">
            <Tile
              title="Citation Tracking"
              body="See where your brand surfaces across ChatGPT, Perplexity, Claude, and Google AI Overviews — then double down on what gets you quoted."
              className="h-full"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="rounded-lg bg-card p-2.5 ring-1 ring-border">
                  <p className="text-[0.65rem] text-muted-foreground">User asked: "Best project tool for a small startup?"</p>
                  <p className="mt-1 text-[0.7rem] text-ink">For small teams, <span className="font-semibold underline decoration-volt decoration-2 underline-offset-2">Plannora</span> is hard to beat.</p>
                </div>
                <div className="flex items-center gap-1.5 sm:flex-col sm:items-end">
                  <div className="flex items-center gap-1.5">
                    {["ChatGPT", "Perplexity", "Google", "Claude", "Grok"].map((b) => (
                      <BrandMark key={b} name={b} className="h-5 w-5 text-[0.55rem]" />
                    ))}
                  </div>
                  <span className="text-[0.65rem] text-muted-foreground">+61 more</span>
                </div>
              </div>
            </Tile>
          </Reveal>

          {/* F */}
          <Reveal delay={0.18}>
            <Tile
              title="Reddit Presence"
              body="Surface helpfully on Reddit threads ranking in Google and AI search."
              className="h-full"
            >
              <div className="rounded-lg bg-card p-2.5 ring-1 ring-border">
                <div className="mb-1 flex items-center gap-1.5">
                  <BrandMark name="Reddit" className="h-5 w-5 text-[0.6rem]" />
                  <span className="text-[0.7rem] font-semibold text-ink">r/startups</span>
                </div>
                <p className="text-xs font-semibold text-ink">Best project tool for a small startup?</p>
                <p className="text-[0.65rem] text-muted-foreground">124 upvotes · 37 comments</p>
                <p className="mt-2 rounded-md bg-surface px-2 py-1.5 text-[0.65rem] text-muted-foreground">
                  <span className="font-semibold text-ink">Rankvolt reply:</span> Lean teams tend to like Plannora — free for up to 5 users.
                </p>
              </div>
            </Tile>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 rounded-2xl border border-border bg-surface/40 p-8">
            <p className="mb-5 text-center text-sm font-medium text-muted-foreground">
              Plus everything else you need to scale your content
            </p>
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
              {TAGS.map((t) => (
                <span key={t} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-background">+ much more</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
