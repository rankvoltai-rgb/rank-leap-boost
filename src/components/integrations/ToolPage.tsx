/**
 * The AI tool pages (/integrations/lovable, /integrations/cursor…), each built
 * as a landing page for one audience: people who already live in that tool.
 *
 * The page answers, in order, the questions that audience arrives with:
 *   hero          what is this, for me, in one line
 *   how it works  what actually happens when I use it
 *   try it        is the output any good (the real tools, on my own topic)
 *   use cases     what would I use it for, in this kind of tool
 *   setup         how exactly do I connect it (the verified steps)
 *   the rest      what Rankbox does beyond this, and what it costs
 *   privacy       what can it see
 *   faq, related, cta
 *
 * Facts come from src/data/connectors.ts (verified setup) and
 * src/data/ai-integrations.ts; examples from ai-integration-samples.ts.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Copy,
  EyeOff,
  FileText,
  Globe,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { PixelField, CARD_PIXELS } from "@/components/landing/Hero";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import { StepSnippet } from "@/components/dashboard/connector-library";
import { useCopied } from "@/components/tools/shared";
import { cn } from "@/lib/utils";
import { CONNECTORS, CONNECTORS_CHECKED, MCP_URL, type Connector } from "@/data/connectors";
import {
  aiCategoryOf,
  anotherLabel,
  categoryLabel,
  kindWithArticle,
  publicSlug,
  relatedAiTools,
  type AiToolPage,
} from "@/data/ai-integrations";
import { SAMPLES, SCENARIOS, TOOL_NAMES } from "@/data/ai-integration-samples";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { formatShortDate } from "@/lib/format-date";
import {
  Breadcrumb,
  Heading,
  HeroButtons,
  TRIAL_NOTE,
  heroPrimary,
  heroSecondary,
} from "./IntegrationSections";
import { Connector as FlowLine, RankboxTile } from "./visuals";
import { ToolHeroVisual } from "./stages";
import { Playground } from "./Playground";
import { SubNav } from "./SubNav";

const CHECKED = formatShortDate(`${CONNECTORS_CHECKED}T12:00:00`);

/** Rankbox → the tool: the integration pages' signature lockup. */
export function ToolLockup({ tool, size = "h-11 w-11" }: { tool: Connector; size?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-white">
      <RankboxTile className={cn(size, "shadow-elevation-lg")} />
      <FlowLine />
      <span aria-hidden className="rounded-[25%] shadow-elevation-lg">
        <ConnectorLogo connector={tool} className={cn(size, "ring-white/30")} />
      </span>
    </span>
  );
}

/** The tool page's own section links, in page order. */
export const TOOL_SECTIONS = [
  { id: "how-it-works", label: "How it works" },
  { id: "try-it", label: "Try it" },
  { id: "use-cases", label: "Use cases" },
  { id: "setup", label: "Setup" },
  { id: "faq", label: "FAQ" },
];

export function ToolSubNav({ tool }: { tool: Connector }) {
  return (
    <SubNav
      title={`Rankbox for ${tool.name}`}
      mark={<ConnectorLogo connector={tool} className="h-6 w-6" />}
      links={TOOL_SECTIONS}
    />
  );
}

/* ---------- 1. Hero ---------- */

export function ToolHero({ tool, page }: { tool: Connector; page: AiToolPage }) {
  return (
    <section
      id="top"
      aria-labelledby="integration-title"
      className="relative flex min-h-[calc(100svh-var(--top-chrome)-3rem)] items-center overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12 lg:py-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <Breadcrumb current={tool.name} />
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mb-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <ToolLockup tool={tool} />
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {page.eyebrow}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <h1
                id="integration-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight text-white sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                <span className="lg:block">{page.headline.lead}</span>{" "}
                <span className="lg:block">{page.headline.accent}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.19}>
              <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                {page.subhead}
              </p>
            </Reveal>
            <Reveal delay={0.26} className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <HeroButtons
                primary={
                  <a href="/auth" className={heroPrimary}>
                    Get started free <ArrowRight className="h-4 w-4" />
                  </a>
                }
                secondary={
                  <a href="#try-it" className={heroSecondary}>
                    Try it here
                  </a>
                }
              />
              <p className="text-sm text-white/70">
                {TRIAL_NOTE} · Setup checked {CHECKED}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.34} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:mx-0">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-12">
                <PixelField pixels={CARD_PIXELS} seed={7} />
              </div>
              <ToolHeroVisual tool={tool} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. How it works ---------- */

export function ToolHowItWorks({ tool }: { tool: Connector }) {
  const category = aiCategoryOf(tool);
  const sample = SAMPLES[category];
  const first = SCENARIOS[category].find((s) => s.tool === "questions") ?? SCENARIOS[category][0];
  const prompt = first.prompt.replaceAll("{name}", tool.name);
  const topic = sample.input.questions;
  const steps = [
    {
      n: "01",
      title: `You ask ${tool.name}`,
      body: "In plain words, the way you already work. No commands to learn.",
      visual: (
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground ring-1 ring-border"
          >
            You
          </span>
          <p className="rounded-xl rounded-tl-md bg-secondary px-3 py-2 text-[13px] leading-snug text-ink">
            {prompt}
          </p>
        </div>
      ),
    },
    {
      n: "02",
      title: `${tool.name} calls Rankbox`,
      body: "It picks the right Rankbox tool and sends only what the tool needs.",
      visual: (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
          <RankboxTile tone="brand" className="h-7 w-7" />
          <code className="min-w-0 truncate font-mono text-[12px] text-ink">
            generate_ai_questions(&ldquo;{topic}&rdquo;)
          </code>
        </div>
      ),
    },
    {
      n: "03",
      title: "The research comes back",
      body: `${tool.name} works with it right away: plans, writes, or builds from it.`,
      visual: (
        <ul className="space-y-1.5">
          {sample.questions.slice(1, 3).flatMap((g) =>
            g.questions.slice(0, 1).map((q) => (
              <li
                key={q}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-ink"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                <span className="truncate">{q}</span>
              </li>
            )),
          )}
        </ul>
      ),
    },
  ];

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-28 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="how-title"
          eyebrow="How it works"
          title={`Ask ${tool.name}. Rankbox does the research.`}
          intro={`Rankbox runs as an MCP server, the open standard ${tool.name} uses to call outside tools. You connect it once.`}
        />
        <ol className="relative mt-16 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.n} className="relative">
              <Reveal delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation">
                  <div className="min-h-[5.5rem]">{s.visual}</div>
                  <p className="mt-6 font-mono text-xs font-semibold text-cta">{s.n}</p>
                  <h3 className="mt-1.5 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-[1.1rem] top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground lg:flex"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 3. Try it ---------- */

export function ToolTryIt({ tool }: { tool: Connector }) {
  return (
    <section
      id="try-it"
      aria-labelledby="try-title"
      className="scroll-mt-28 border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-32">
          <Heading
            id="try-title"
            eyebrow="Try it"
            title={`See exactly what ${tool.name} gets back`}
            intro={`These are the three tools ${tool.name} can call once you connect Rankbox. Each one opens on a sample; run it on your own topic to see a live answer.`}
            align="left"
          />
          <ul className="mt-8 space-y-4">
            {(Object.keys(TOOL_NAMES) as (keyof typeof TOOL_NAMES)[]).map((k) => (
              <li key={k} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                <div>
                  <p className="text-sm font-semibold text-ink">{TOOL_NAMES[k].label}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {TOOL_NAMES[k].mcp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Reveal delay={0.08} className="min-w-0">
          <Playground category={aiCategoryOf(tool)} toolName={tool.name} />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 4. Use cases ---------- */

export function ToolUseCases({ tool }: { tool: Connector }) {
  const scenarios = SCENARIOS[aiCategoryOf(tool)];
  const fill = (s: string) => s.replaceAll("{name}", tool.name);
  return (
    <section id="use-cases" aria-labelledby="uses-title" className="scroll-mt-28 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="uses-title"
          eyebrow="Use cases"
          title={`What people use Rankbox for in ${tool.name}`}
          intro={`Three jobs it does well in ${kindWithArticle(tool)}. Ask in your own words; ${tool.name} picks the tool.`}
        />
        <div className="mt-16 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {scenarios.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation">
                <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                <div className="mt-5 flex flex-1 flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-[4.25rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      You
                    </span>
                    <p className="rounded-xl rounded-tl-md bg-secondary px-3 py-2 text-[13px] leading-snug text-ink">
                      {fill(s.prompt)}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-[4.25rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Rankbox
                    </span>
                    <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2">
                      <p className="font-mono text-[11px] text-cta">{TOOL_NAMES[s.tool].mcp}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-ink">{s.returns}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-start gap-2.5 border-t border-border pt-3">
                    <span className="mt-0.5 w-[4.25rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Then
                    </span>
                    <p className="text-[13px] leading-snug text-muted-foreground">{fill(s.then)}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. Setup ---------- */

export function ToolSetup({ tool }: { tool: Connector }) {
  const sample = SAMPLES[aiCategoryOf(tool)];
  const check = `Use Rankbox to find what people ask AI about ${sample.input.questions}.`;
  const alt = tool.alternative;
  const altLabel =
    alt?.snippet?.kind === "config"
      ? "Config file"
      : alt?.snippet?.kind === "command"
        ? "Command"
        : "Other way";
  const [method, setMethod] = useState<"steps" | "alt">("steps");
  const [copied, copy] = useCopied();
  const steps = tool.steps;

  return (
    <section
      id="setup"
      aria-labelledby="setup-title"
      className="scroll-mt-28 border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div className="min-w-0">
          <Heading
            id="setup-title"
            eyebrow="Setup"
            title={`Connect Rankbox to ${tool.name}`}
            intro={`Verified against ${tool.maker}'s own docs on ${CHECKED}.`}
            align="left"
          />

          {alt && (
            <div
              role="tablist"
              aria-label="Setup method"
              className="mt-8 inline-flex rounded-xl border border-border bg-card p-1 shadow-1"
            >
              {(
                [
                  ["steps", "Step by step"],
                  ["alt", altLabel],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={method === id}
                  onClick={() => setMethod(id)}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                    method === id ? "bg-cta text-white" : "text-muted-foreground hover:text-ink",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {method === "alt" && alt ? (
            <div className="mt-8 space-y-3">
              <p className="text-base text-ink">{alt.text}</p>
              {alt.snippet && <StepSnippet snippet={alt.snippet} />}
            </div>
          ) : (
            <ol className="relative mt-10">
              {steps.map((s, i) => (
                <li key={s.text} className="relative pb-8">
                  <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px bg-border" />
                  <Reveal delay={i * 0.05} className="flex gap-5">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white ring-8 ring-surface">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 space-y-3 pt-2">
                      <p className="text-base text-ink">{s.text}</p>
                      {s.snippet && <StepSnippet snippet={s.snippet} />}
                    </div>
                  </Reveal>
                </li>
              ))}
              {/* The last step is always the same: prove it works. */}
              <li className="relative">
                <Reveal delay={steps.length * 0.05} className="flex gap-5">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-white ring-8 ring-surface">
                    <Check className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-3 pt-2">
                    <p className="text-base text-ink">Check it works. Ask {tool.name}:</p>
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 pl-3.5">
                      <p className="min-w-0 flex-1 text-sm text-ink">{check}</p>
                      <button
                        type="button"
                        onClick={() => copy("check", check)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-secondary"
                      >
                        {copied === "check" ? (
                          <Check className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copied === "check" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </Reveal>
              </li>
            </ol>
          )}
        </div>

        <Reveal delay={0.1} y={24} className="min-w-0 lg:sticky lg:top-32">
          <div className="rounded-2xl border border-border bg-card shadow-elevation">
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <ConnectorLogo connector={tool} className="h-9 w-9" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{tool.name}</p>
                <p className="text-xs text-muted-foreground">
                  {categoryLabel(tool).replace(/s$/, "")} · by {tool.maker}
                </p>
              </div>
            </div>
            <dl className="divide-y divide-border text-sm">
              <Row label="Server URL">
                <span className="break-all font-mono text-[13px] text-ink">{MCP_URL}</span>
              </Row>
              <Row label="Transport">Streamable HTTP</Row>
              {tool.plan && <Row label={`${tool.name} plan`}>{tool.plan}</Row>}
              <Row label="Rankbox plan">{TRIAL_NOTE}</Row>
            </dl>
            {tool.note && (
              <p className="mx-6 mb-5 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5 text-sm text-ink">
                {tool.note}
              </p>
            )}
            <div className="border-t border-border px-6 py-4">
              <a
                href={tool.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
              >
                {tool.maker}&rsquo;s MCP docs <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <a
            href="/auth"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-md"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 px-6 py-3.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

/* ---------- 6. The rest of Rankbox ---------- */

const PUBLISH_LINE: Record<string, string> = {
  builder:
    "Built your site with {name}? Rankbox publishes to it through the REST API, or to WordPress, Shopify, Webflow, Framer, and Square Online directly.",
  coding:
    "Publishing from your own codebase? Pull finished articles from the REST API at build time, or publish to WordPress, Shopify, Webflow, Framer, or Square Online.",
  assistant:
    "Publishes to WordPress, Shopify, Webflow, Framer, and Square Online, or to any site through the REST API.",
  automation:
    "Publishes to WordPress, Shopify, Webflow, Framer, and Square Online, or to any site through the REST API.",
};

export function ToolBiggerPicture({ tool }: { tool: Connector }) {
  const category = aiCategoryOf(tool);
  const cols = [
    {
      icon: PenLine,
      title: "Writes every day",
      body: `Up to ${PLAN.articlesPerMonth} researched articles a month in your brand's voice, planned around the questions your buyers ask.`,
    },
    {
      icon: Globe,
      title: "Publishes to your site",
      body: PUBLISH_LINE[category].replaceAll("{name}", tool.name),
    },
    {
      icon: BarChart3,
      title: "Tracks AI search",
      body: "See where ChatGPT, Perplexity, and Google's AI answers cite you, and which questions to win next.",
    },
  ];
  return (
    <section aria-labelledby="rest-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="rest-title"
          eyebrow="Beyond the connector"
          title={`Research in ${tool.name}. Autopilot does the rest.`}
          intro="The MCP tools are for planning by hand. Rankbox's autopilot researches, writes, and publishes on its own."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-3 md:gap-6">
          {cols.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={i * 0.07} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-elevation">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-cta/20 bg-cta-soft px-6 py-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-base font-semibold text-ink">
                {formatUsd(PLAN.monthly)} a month, after a {TRIAL_DAYS}-day free trial
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                One plan with everything: autopilot, publishing, AI search tracking, and the MCP
                server in {tool.name}.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                to="/pricing"
                className="text-sm font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
              >
                See pricing
              </Link>
              <a
                href="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
              >
                Start free trial <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 7. Privacy ---------- */

const WORK: Record<string, string> = {
  assistant: "chats and files",
  builder: "projects and code",
  coding: "code and repositories",
  automation: "workflows and connected apps",
};

export function ToolPrivacy({ tool }: { tool: Connector }) {
  const work = WORK[aiCategoryOf(tool)];
  const gets = [
    "Which of the three tools to run",
    "The topic, keyword, or page summary it runs on",
  ];
  const never = [
    `Your ${tool.name} ${work}`,
    "Your conversation history",
    `Your ${tool.name} login or password`,
    `Other tools you've connected to ${tool.name}`,
  ];
  return (
    <section
      aria-labelledby="privacy-title"
      className="border-t border-border bg-surface/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Heading
            id="privacy-title"
            eyebrow="Privacy"
            title="It sees the request, not your work"
            intro={`You control it from ${tool.name}: remove the connector and it stops, straight away.`}
            align="left"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <ShieldCheck className="h-4 w-4 text-success" /> Rankbox receives
              </p>
              <ul className="mt-3 space-y-2">
                {gets.map((g) => (
                  <li key={g} className="text-sm leading-snug text-muted-foreground">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <EyeOff className="h-4 w-4 text-muted-foreground" /> Rankbox never sees
              </p>
              <ul className="mt-3 space-y-2">
                {never.map((n) => (
                  <li key={n} className="text-sm leading-snug text-muted-foreground">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. Related tools and the closing CTA ---------- */

export function ToolCard({ tool }: { tool: Connector }) {
  return (
    <Link
      to="/integrations/$slug"
      params={{ slug: publicSlug(tool) }}
      className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-elevation transition-all hover:-translate-y-0.5 hover:border-cta/30 hover:shadow-elevation-lg sm:p-5"
    >
      <ConnectorLogo connector={tool} className="h-11 w-11" />
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold leading-snug text-ink">{tool.name}</h3>
        <p className="mt-1 line-clamp-1 text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
          {tool.tagline}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-cta" />
    </Link>
  );
}

export function ToolRelated({ tool }: { tool: Connector }) {
  const related = relatedAiTools(tool);
  if (!related.length) return null;
  return (
    <section aria-labelledby="related-title" className="border-t border-border py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="related-title"
          eyebrow={categoryLabel(tool)}
          title={`Using another ${anotherLabel(tool)}?`}
          intro="Same server, same three tools. Each one has its own setup guide."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r, i) => (
            <li key={r.id}>
              <Reveal delay={i * 0.04} className="h-full">
                <ToolCard tool={r} />
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal delay={0.1} className="mt-10 text-center">
          <Link
            to="/integrations"
            hash="directory"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-cta"
          >
            See all {CONNECTORS.length} integrations <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function ToolCTA({ tool }: { tool: Connector }) {
  return (
    <section aria-labelledby="cta-title" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-blue px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <PixelField />
            <div className="relative">
              <div className="mb-7 flex justify-center">
                <ToolLockup tool={tool} />
              </div>
              <h2
                id="cta-title"
                className="font-display mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Bring Rankbox into {tool.name}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-white/80">
                Connect it in {tool.steps.length === 1 ? "one step" : `${tool.steps.length} steps`},
                ask in your own words, and let autopilot publish the rest.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="/auth" className={heroPrimary}>
                  Get started free <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#setup" className={heroSecondary}>
                  <FileText className="h-4 w-4" /> Setup steps
                </a>
              </div>
              <p className="mt-4 text-sm text-white/70">{TRIAL_NOTE}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
