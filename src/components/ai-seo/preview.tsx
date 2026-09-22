/**
 * The hero's right-hand panel on an engine guide: an illustrative answer, laid
 * out the way that engine actually presents citations. It's the page's thesis
 * in one picture — "this is the spot you're competing for" — and it differs by
 * engine because the spot does: an inline pill in ChatGPT, a numbered source
 * card in Perplexity, a link card beside Google's AI Overview.
 *
 * Built in the site's own card language rather than as a screenshot, so it
 * stays crisp, themeable and obviously a diagram. The brand is fictional.
 */
import type { ReactNode } from "react";
import { ChevronDown, Globe, Search } from "lucide-react";
import { GeminiMark, GoogleMark } from "@/components/landing/ai-logos";
import type { Engine } from "@/data/ai-seo/engines";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { parseInline } from "@/lib/inline-md";
import { EngineMark } from "./kit";

/* The answer with its cited brand picked out — the one thing the eye should land on. */
function Answer({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {parseInline(text).map((s, i) =>
        s.bold ? (
          <span
            key={i}
            className={cn(
              "font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2",
              className,
            )}
          >
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-secondary text-[0.55rem] font-semibold uppercase text-muted-foreground ring-1 ring-card",
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

function Frame({
  engine,
  children,
  bodyClassName,
}: {
  engine: Engine;
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card text-left text-ink shadow-elevation-lg ring-1 ring-ink/5">
      <div className="relative flex items-center gap-2 border-b border-border bg-surface/70 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-border" />
          ))}
        </span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[0.7rem] font-medium text-muted-foreground">
          <EngineMark mark={engine.mark} className="h-3.5 w-3.5" />
          {engine.shortName}
        </span>
      </div>
      <div className={cn("space-y-4 p-5 sm:p-6", bodyClassName)}>{children}</div>
    </div>
  );
}

/* ---------- ChatGPT: inline source pills, a Sources button ---------- */

function ChatGPTPreview({ engine, p }: { engine: Engine; p: AnswerPreview }) {
  return (
    <Frame engine={engine}>
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-3xl bg-secondary px-4 py-2.5 text-sm leading-relaxed">
          {p.prompt}
        </p>
      </div>
      <p className="flex items-center gap-1.5 text-[0.72rem] font-medium text-muted-foreground">
        <Globe className="h-3.5 w-3.5" aria-hidden />
        {p.status}
      </p>
      <p className="text-[0.95rem] leading-relaxed">
        <Answer text={p.answer} />{" "}
        <span className="inline-flex translate-y-[-1px] items-center rounded-full bg-secondary px-2 py-0.5 align-middle text-[0.68rem] font-medium text-ink/80 ring-2 ring-volt/40">
          {p.sources[0].domain}
          <span className="ml-1 text-muted-foreground">+{p.sources.length - 1}</span>
        </span>
      </p>
      <div className="flex items-center gap-2 pt-1">
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[0.72rem] font-medium">
          <span className="flex -space-x-1.5">
            {p.sources.map((s) => (
              <Favicon key={s.domain} domain={s.domain} className="h-4 w-4" />
            ))}
          </span>
          Sources
        </span>
      </div>
    </Frame>
  );
}

/* ---------- Claude: a collapsible search step, inline citation chips ---------- */

function ClaudePreview({ engine, p }: { engine: Engine; p: AnswerPreview }) {
  return (
    <Frame engine={engine} bodyClassName="bg-[#faf9f5]">
      <div className="flex">
        <p className="max-w-[88%] rounded-xl bg-[#f0eee6] px-4 py-2.5 text-sm leading-relaxed">
          {p.prompt}
        </p>
      </div>
      <p className="flex items-center justify-between rounded-lg border border-[#e5e1d6] bg-white/70 px-3 py-2 text-[0.72rem] font-medium text-ink/70">
        <span className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5" aria-hidden />
          {p.status}
        </span>
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </p>
      <p className="font-serif text-[1rem] leading-relaxed text-ink/90">
        <Answer text={p.answer} />{" "}
        <span className="inline-flex translate-y-[-1px] items-center rounded-md border border-[#e5e1d6] bg-white px-1.5 py-0.5 align-middle font-sans text-[0.66rem] font-medium text-ink/75 ring-2 ring-volt/40">
          {p.sources[0].domain}
        </span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {p.sources.slice(1).map((s) => (
          <span
            key={s.domain}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#e5e1d6] bg-white px-2 py-1 text-[0.66rem] font-medium text-ink/70"
          >
            <Favicon domain={s.domain} className="h-3.5 w-3.5" />
            {s.domain}
          </span>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- Perplexity: numbered source cards first, superscripts in text ---------- */

function PerplexityPreview({ engine, p }: { engine: Engine; p: AnswerPreview }) {
  return (
    <Frame engine={engine}>
      <p className="font-display text-[1.15rem] font-semibold leading-snug tracking-tight">
        {p.prompt}
      </p>
      <div>
        <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Sources
        </p>
        <div className="grid grid-cols-3 gap-2">
          {p.sources.slice(0, 3).map((s, i) => (
            <div
              key={s.domain}
              className={cn(
                "flex min-w-0 flex-col justify-between gap-2 rounded-lg border bg-surface/60 p-2.5",
                i === 0 ? "border-volt/50 ring-2 ring-volt/25" : "border-border",
              )}
            >
              <p className="line-clamp-2 text-[0.68rem] font-medium leading-snug">{s.title}</p>
              <p className="flex items-center gap-1 text-[0.6rem] text-muted-foreground">
                <Favicon domain={s.domain} className="h-3 w-3" />
                <span className="truncate">{s.domain}</span>
                <span className="ml-auto shrink-0 font-semibold">{i + 1}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <EngineMark mark="Perplexity" className="h-3.5 w-3.5" />
          Answer
        </p>
        <p className="text-[0.95rem] leading-relaxed">
          <Answer text={p.answer} />
          {[1, 2].map((n) => (
            <sup
              key={n}
              className={cn(
                "ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded px-1 text-[0.6rem] font-semibold",
                n === 1 ? "bg-volt/15 text-volt" : "bg-secondary text-muted-foreground",
              )}
            >
              {n}
            </sup>
          ))}
        </p>
      </div>
    </Frame>
  );
}

/* ---------- Gemini: sparkle avatar, source chips under the answer ---------- */

function GeminiPreview({ engine, p }: { engine: Engine; p: AnswerPreview }) {
  return (
    <Frame engine={engine}>
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#e9eef6] px-4 py-2.5 text-sm leading-relaxed">
          {p.prompt}
        </p>
      </div>
      <div className="flex gap-3">
        <GeminiMark className="mt-0.5 h-6 w-6 shrink-0" />
        <div className="min-w-0 space-y-3">
          <p className="text-[0.72rem] font-medium text-muted-foreground">{p.status}</p>
          <p className="text-[0.95rem] leading-relaxed">
            <Answer text={p.answer} />
          </p>
          <div className="flex flex-wrap gap-1.5">
            {p.sources.map((s, i) => (
              <span
                key={s.domain}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-medium",
                  i === 0 ? "border-volt/50 bg-volt/[0.07] text-ink" : "border-border text-ink/70",
                )}
              >
                <Favicon domain={s.domain} className="h-3.5 w-3.5" />
                {s.domain}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- Google: the AI Overview block above the links, link cards beside it ---------- */

function GooglePreview({ engine, p }: { engine: Engine; p: AnswerPreview }) {
  return (
    <Frame engine={engine}>
      <div className="flex items-center gap-2.5 rounded-full border border-border px-4 py-2 shadow-1">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm">{p.prompt}</span>
        <GoogleMark className="h-4 w-4 shrink-0" />
      </div>
      <div className="rounded-xl border border-border bg-surface/40 p-4">
        <p className="flex items-center gap-1.5 text-[0.78rem] font-semibold">
          <GeminiMark className="h-4 w-4" />
          {p.status}
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
          <p className="text-[0.9rem] leading-relaxed">
            <Answer text={p.answer} />
          </p>
          <div className="space-y-1.5">
            {p.sources.slice(0, 3).map((s, i) => (
              <div
                key={s.domain}
                className={cn(
                  "rounded-lg border bg-card p-2",
                  i === 0 ? "border-volt/50 ring-2 ring-volt/25" : "border-border",
                )}
              >
                <p className="line-clamp-2 text-[0.64rem] font-medium leading-snug">{s.title}</p>
                <p className="mt-1 flex items-center gap-1 text-[0.58rem] text-muted-foreground">
                  <Favicon domain={s.domain} className="h-3 w-3" />
                  <span className="truncate">{s.domain}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-1 px-1" aria-hidden>
        <div className="h-2 w-1/3 rounded-full bg-secondary" />
        <div className="h-2 w-2/3 rounded-full bg-secondary" />
      </div>
    </Frame>
  );
}

export function CitationPreview({ engine, preview }: { engine: Engine; preview: AnswerPreview }) {
  const body = {
    chatgpt: ChatGPTPreview,
    claude: ClaudePreview,
    perplexity: PerplexityPreview,
    gemini: GeminiPreview,
    "google-ai-overviews": GooglePreview,
  }[engine.slug];
  const Body = body;
  return (
    <figure>
      <Body engine={engine} p={preview} />
      <figcaption className="mt-3 text-center text-[0.72rem] text-white/60 lg:text-left">
        Illustration: where a citation appears in {engine.name}. Brands are fictional.
      </figcaption>
    </figure>
  );
}
