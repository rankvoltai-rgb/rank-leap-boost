import { Reveal, SectionHeading, BrandMark } from "./shared";

const TAGS = [
  "Personal Growth Plan", "Auto Keywords", "Auto Research", "Internal Linking",
  "External Linking", "Auto Images", "Featured Images", "Humanized Content",
  "Brand Voice", "Custom Instructions", "AI Article Editor", "Content Calendar",
  "Product Promotion", "Meta Descriptions", "Plagiarism-Free", "SEO/GEO Score",
  "Domain Tracking", "Multi Sites", "Team Members", "SEO Assistant",
];

function Tile({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
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
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="Everything You Need to Get Traffic"
          subtitle="One platform for keyword research, AI-written articles, backlinks, and auto-publishing. Get found by customers searching on Google, ChatGPT, Perplexity, and beyond."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <Tile title="SEO Automation" body="Automate research, writing, linking, and publishing. Set it once and watch traffic grow.">
              <div className="space-y-1.5">
                <Step label="Searching Google" value="24 sources" />
                <Step label="Scraping content" value="18 pages" />
                <Step label="Writing content" value="3,247 words" />
                <Step label="Adding links" value="20 links" />
                <Step label="Publishing" value="9:00 AM" />
              </div>
            </Tile>
          </Reveal>

          <Reveal delay={0.06}>
            <Tile title="SEO Content Writer" body="AI writer drafts long-form articles in your brand voice. Optimized for Google and AI search.">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Article Score</span>
                <span className="text-2xl font-bold text-success">100<span className="text-sm text-muted-foreground">/100</span></span>
              </div>
              <div className="space-y-1.5">
                <Step label="Word count" value="3,247 / 3,000" />
                <Step label="Keyword density" value="0.8% optimal" />
                <Step label="Headings" value="8 added" />
                <Step label="Images" value="6 added" />
              </div>
            </Tile>
          </Reveal>

          <Reveal delay={0.12}>
            <Tile title="Keyword Research" body="Find high-volume, low-competition keywords for your niche. Sorted by volume and intent.">
              <p className="mb-2 text-xs font-medium text-ink">460 keywords found</p>
              <div className="space-y-1.5">
                {[
                  ["dentist near me", "18,100", "24"],
                  ["teeth whitening cost", "9,900", "19"],
                  ["invisalign vs braces", "6,600", "31"],
                ].map(([k, v, d]) => (
                  <div key={k} className="rounded-lg bg-card px-2.5 py-1.5 ring-1 ring-border">
                    <p className="text-xs font-medium text-ink">{k}</p>
                    <p className="text-[0.65rem] text-muted-foreground">Volume: {v} | Difficulty: {d}</p>
                  </div>
                ))}
              </div>
            </Tile>
          </Reveal>

          <Reveal delay={0.06}>
            <Tile title="Backlink Exchange" body="Get high-quality backlinks with verified sites in your niche. Grow domain authority fast.">
              <div className="space-y-1.5">
                {[
                  ["Verified", "10 Best Dentists in Austin", "88"],
                  ["Verified", "Teeth Whitening Cost Guide", "81"],
                  ["Pending", "Family Dentists on Weekends", "76"],
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

          <Reveal delay={0.12}>
            <Tile title="Reddit Marketing" body="Reply on Reddit threads ranking in Google and AI search. Boost brand mentions everywhere.">
              <div className="rounded-lg bg-card p-2.5 ring-1 ring-border">
                <div className="mb-1 flex items-center gap-1.5">
                  <BrandMark name="Reddit" className="h-5 w-5 text-[0.6rem]" />
                  <span className="text-[0.7rem] font-semibold text-ink">r/startups</span>
                </div>
                <p className="text-xs font-semibold text-ink">What's the best CRM for a small startup?</p>
                <p className="text-[0.65rem] text-muted-foreground">124 upvotes · 37 comments</p>
                <p className="mt-2 rounded-md bg-surface px-2 py-1.5 text-[0.65rem] text-muted-foreground">
                  <span className="font-semibold text-ink">Rankvolt reply:</span> Most small teams use Acme CRM. Free for up to 5 users and quick to set up.
                </p>
              </div>
            </Tile>
          </Reveal>

          <Reveal delay={0.18}>
            <Tile title="AI Visibility" body="Track brand mentions across ChatGPT, Perplexity, Claude, and Google AI Overviews.">
              <span className="mb-2 inline-block rounded-full bg-warning/20 px-2 py-0.5 text-[0.6rem] font-semibold text-ink">Coming soon</span>
              <div className="rounded-lg bg-card p-2.5 ring-1 ring-border">
                <p className="text-[0.65rem] text-muted-foreground">User asked: "Best CRM for a small startup?"</p>
                <p className="mt-1 text-[0.7rem] text-ink">For small teams, <span className="font-semibold">Acme CRM</span> is hard to beat.</p>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {["ChatGPT", "Perplexity", "Google", "Claude", "Grok"].map((b) => (
                  <BrandMark key={b} name={b} className="h-5 w-5 text-[0.55rem]" />
                ))}
                <span className="text-[0.65rem] text-muted-foreground">+61 more</span>
              </div>
            </Tile>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-2xl border border-border bg-surface/40 p-6">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
              Plus everything else you need to scale your content
            </p>
            <div className="flex flex-wrap justify-center gap-2">
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