import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, BrandMark } from "./shared";
import { AreaChart } from "./charts";
import { ChatGPTMark } from "./ai-logos";
import { Accent, Band, LINE, LINE_FILL, PANEL, SectionHead, Spacer } from "./frame";

const LANGS = [
  "English",
  "British",
  "French",
  "German",
  "Spanish",
  "Italian",
  "Portuguese",
  "Dutch",
  "Polish",
  "Czech",
  "Swedish",
  "Danish",
  "Greek",
  "Turkish",
  "Arabic",
  "Hindi",
  "Japanese",
  "Korean",
  "Chinese",
  "Thai",
];
const PLATFORMS = ["WordPress", "Shopify", "Webflow", "Wix", "Framer", "Webhooks"];

/* The two headline promises, as Rankaria shows its tracking tools: white
   cards on a grey panel, each half ruled off by a hairline. */
function PanelCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[28rem] rounded-xl border border-ink/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)] sm:p-6">
      <h3 className="text-[1.15rem] font-medium tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

/* A supporting capability, as one cell of a hairline grid. */
function Cell({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-6 flex-1">{children}</div>
    </div>
  );
}

const ROW =
  "flex items-center justify-between rounded-lg border border-ink/[0.07] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.03)]";

export function GrowTraffic() {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Search}
        eyebrow="Two search boxes, one engine"
        title={
          <>
            Win Google and <Accent>AI answers</Accent> at once
          </>
        }
        subtitle="Stop choosing between ranking on Google and showing up in AI answers. Rankbox researches, writes, and publishes for both — traffic and citations grow while you sleep."
      />

      {/* The two promises, side by side on the grey panel. */}
      <Band inner={PANEL}>
        <div className="grid lg:grid-cols-2">
          <Reveal className="flex items-center px-5 py-10 sm:px-10 sm:py-14">
            <PanelCard
              title="Rank high on Google"
              body="Publish optimized articles daily that climb to page one for the high-intent questions your buyers actually search."
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                {[
                  ["Total clicks", "12.5k"],
                  ["Impressions", "145k"],
                  ["Average CTR", "8.6%"],
                  ["Avg. position", "9.3"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[0.68rem] text-muted-foreground">{l}</p>
                    <p className="text-lg font-semibold tracking-tight text-ink tabular-nums">
                      {v}
                    </p>
                  </div>
                ))}
              </div>
              <div className={cn("mt-4 rounded-lg border px-2 pt-2", LINE)}>
                <AreaChart
                  points={[40, 60, 55, 90, 120, 140, 130, 200, 260, 320, 380, 520]}
                  className="h-28 w-full"
                  stroke="var(--brand-blue)"
                  fill="var(--brand-blue)"
                />
              </div>
              <div className="mt-3 flex gap-4 text-[0.7rem] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-blue" /> Clicks
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" /> Impressions
                </span>
              </div>
            </PanelCard>
          </Reveal>

          <Reveal
            delay={0.08}
            className={cn(
              "flex items-center border-t px-5 py-10 sm:px-10 sm:py-14 lg:border-l lg:border-t-0",
              LINE,
            )}
          >
            <PanelCard
              title="Get cited by AI"
              body="AI assistants discover your articles and quote your brand as the recommended answer."
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
                  <ChatGPTMark className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-semibold text-ink">ChatGPT</span>
              </div>
              <p className="ml-auto mt-3 w-fit max-w-[85%] rounded-lg border border-ink/[0.07] bg-white px-3 py-2 text-[0.8rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                Best tool for small-team project planning?
              </p>
              <div className="mt-3 flex gap-2.5">
                <ChatGPTMark className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-[0.8rem] leading-relaxed text-muted-foreground">
                  For small teams, <span className="font-semibold text-ink">Plannora</span> is a
                  great fit — simple boards, automations, and a free tier for up to 5 people.
                </p>
              </div>
              {/* Rankaria marks the winning brand as a highlighted #1 row. */}
              <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-brand-blue/40 bg-cta-soft px-3 py-2">
                <span className="text-[0.7rem] font-semibold text-muted-foreground">#1</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-[0.65rem] font-bold text-brand-blue ring-1 ring-brand-blue/20">
                  P
                </span>
                <span className="text-[0.8rem] font-semibold text-ink">Plannora</span>
                <span className="ml-auto text-[0.68rem] font-semibold text-brand-blue">
                  Cited as the answer
                </span>
              </div>
            </PanelCard>
          </Reveal>
        </div>
      </Band>

      {/* Supporting capabilities: one row of hairline cells. White sits on
          still wrappers so a fading cell never shows the fill behind it. */}
      <Band>
        <div className={cn("grid gap-px lg:grid-cols-3", LINE_FILL)}>
          <div className="bg-white">
            <Reveal className="h-full">
              <Cell
                title="Fully customizable"
                body="Tone of voice, images, and offerings — make every article unmistakably yours."
              >
                <div className="space-y-2">
                  <div className={ROW}>
                    <span className="text-xs text-muted-foreground">Tone of Voice</span>
                    <span className="rounded-md bg-cta-soft px-2 py-0.5 text-xs font-medium text-brand-blue">
                      Conversational
                    </span>
                  </div>
                  <div className={cn(ROW, "block")}>
                    <span className="text-xs text-muted-foreground">Image Style</span>
                    <div className="mt-2 flex gap-1.5">
                      {["Photo", "3D", "Custom"].map((style, i) => (
                        <span
                          key={style}
                          className={cn(
                            "rounded-md px-2 py-1 text-xs font-medium",
                            i === 0
                              ? "bg-cta text-white"
                              : "border border-ink/[0.08] bg-white text-ink",
                          )}
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Cell>
            </Reveal>
          </div>

          <div className="bg-white">
            <Reveal delay={0.06} className="h-full">
              <Cell
                title="Fully autonomous"
                body="From research to writing, publishing, and citation tracking — the whole loop runs on autopilot."
              >
                <div className="space-y-1.5">
                  {[
                    ["Best Project Tools for Small Teams", "Published", "var(--success)"],
                    ["Kanban vs Scrum: Which to Pick", "Published", "var(--success)"],
                    ["How to Run a Sprint Without Chaos", "Generating", "var(--brand-blue)"],
                    ["Free Planning Apps Worth Trying", "Queued", "var(--muted-foreground)"],
                  ].map(([t, st, c]) => (
                    <div key={t} className={cn(ROW, "py-1.5")}>
                      <span className="truncate pr-2 text-[0.72rem] font-medium text-ink">{t}</span>
                      <span
                        className="flex shrink-0 items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-wide"
                        style={{ color: c }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} /> {st}
                      </span>
                    </div>
                  ))}
                </div>
              </Cell>
            </Reveal>
          </div>

          <div className="bg-white">
            <Reveal delay={0.12} className="h-full">
              <Cell
                title="100+ languages"
                body="Generate high-quality content in over 100 languages with natural, native-sounding flow."
              >
                <div className="flex flex-wrap gap-1.5">
                  {LANGS.map((l) => (
                    <span
                      key={l}
                      className="rounded-md border border-ink/[0.07] bg-white px-2 py-1 text-[0.7rem] text-muted-foreground"
                    >
                      {l}
                    </span>
                  ))}
                  <span className="rounded-md bg-cta px-2 py-1 text-[0.7rem] font-medium text-white">
                    +82 more
                  </span>
                </div>
              </Cell>
            </Reveal>
          </div>
        </div>
      </Band>

      {/* Auto-publishing: a label cell, then one cell per platform, the way
          Rankaria lists the engines it tracks. */}
      <Band>
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-[1.6fr_repeat(6,1fr)]">
          <div
            className={cn(
              "col-span-3 flex flex-col justify-center border-b px-6 py-6 sm:col-span-6 sm:px-8 lg:col-span-1 lg:border-b-0 lg:border-r",
              LINE,
            )}
          >
            <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
              Auto-publishing everywhere
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              New articles go live daily on your platform of choice.
            </p>
          </div>
          {PLATFORMS.map((p, i) => (
            <div
              key={p}
              className={cn(
                "group flex flex-col items-center justify-center gap-2.5 py-6 sm:py-8",
                // Hairlines between cells: every cell but the row's last gets
                // a right edge; on phones the first row gets a bottom edge.
                i % 3 !== 2 && "border-r",
                "sm:border-r sm:last:border-r-0",
                i < 3 && "border-b sm:border-b-0",
                LINE,
              )}
            >
              <BrandMark
                name={p}
                className="h-9 w-9 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span className="text-[0.8rem] font-medium text-ink/80">{p}</span>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}
