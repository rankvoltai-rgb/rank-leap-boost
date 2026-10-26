/**
 * The guide's focal visual: one Gemini answer with the grounding that sits
 * behind it laid open. The prompt becomes Google searches, the searches pull
 * pages from Google's index, and the answer carries source chips and a
 * Sources panel, the way the Gemini app shows them.
 *
 * The switch under it is the mechanic only Gemini has: disallow
 * Google-Extended and your page drops out of the grounding, while the answer
 * can still name you from someone else's page. That's the guide's two big
 * points (the bundled opt-out, and mentions outnumbering links) in one
 * picture.
 *
 * Motion: the steps light up in order only while the card is at least half
 * on screen, and reset when it leaves. The server HTML and reduced motion get
 * the finished frame, so the still is complete.
 */
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Check, PanelRight, Search, X } from "lucide-react";
import { GeminiMark } from "@/components/landing/ai-logos";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

/* 0 prompt · 1 searches · 2 index · 3 answer · 4 sources */
const FINAL = 4;
const STEP_AT = [700, 1900, 3100, 4200];

function Favicon({ domain, muted = false }: { domain: string; muted?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.55rem] font-semibold uppercase",
        muted ? "bg-ink/[0.06] text-ink/40" : "bg-cta-soft text-cta",
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

export function GroundingVisual({
  preview,
  className,
}: {
  preview: AnswerPreview;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(FINAL);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (reduce) {
      setPhase(FINAL);
      return;
    }
    setPhase(0);
    if (!inView) return;
    const timers = STEP_AT.map((ms, i) => window.setTimeout(() => setPhase(i + 1), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce]);

  const spans = parseInline(preview.answer);
  const brand = spans.find((s) => s.bold)?.text ?? "";
  const [own, ...others] = preview.sources;
  const cited = blocked ? others : preview.sources;
  const lead = cited[0];

  /* The searches Gemini might write for this prompt. Illustrative, like the
     brand: the real ones come back from the API's google_search tool. */
  const queries = [
    "pm apps for google workspace",
    `${brand.toLowerCase()} calendar sync`,
    "free pm app small team",
  ];

  const step = (n: number) =>
    cn(
      "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
      phase >= n ? "opacity-100" : "translate-y-1 opacity-25",
    );

  return (
    <figure ref={ref} className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.28)]">
        {/* app bar */}
        <div className="flex items-center justify-between border-b border-ink/[0.07] px-4 py-2.5">
          <span className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
            <GeminiMark className="h-4 w-4" />
            Gemini
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink/40">
            Illustrative
          </span>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {/* the prompt */}
          <div className={cn("flex justify-end", step(0))}>
            <p className="max-w-[88%] rounded-2xl rounded-tr-md bg-[#e9eef6] px-3.5 py-2 text-[0.86rem] leading-snug text-ink">
              {preview.prompt}
            </p>
          </div>

          {/* behind the answer: searches, then pages from the index */}
          <div className="rounded-xl border border-dashed border-ink/[0.14] p-3 sm:p-3.5">
            <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink/45">
              <Search aria-hidden className="h-3 w-3" />
              Behind the answer
            </p>

            <div className={cn("mt-2.5", step(1))}>
              <p className="text-[0.68rem] font-medium text-ink/50">Searches Google</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {queries.map((q, i) => (
                  <li
                    key={q}
                    style={{ transitionDelay: phase === 1 ? `${i * 140}ms` : "0ms" }}
                    className={cn(
                      "rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 font-mono text-[0.66rem] text-ink/75 transition-opacity duration-300 motion-reduce:transition-none",
                      phase >= 1 ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div className={cn("mt-3", step(2))}>
              <p className="text-[0.68rem] font-medium text-ink/50">
                Pages from Google&rsquo;s index
              </p>
              <ul className="mt-1.5 divide-y divide-ink/[0.06] rounded-lg border border-ink/[0.07] bg-white">
                {preview.sources.map((s) => {
                  const out = blocked && s.domain === own.domain;
                  return (
                    <li
                      key={s.domain}
                      className="flex min-w-0 items-center gap-2 px-2.5 py-1.5 text-[0.72rem]"
                    >
                      <Favicon domain={s.domain} muted={out} />
                      <span
                        className={cn(
                          "min-w-0 truncate font-medium transition-colors duration-300",
                          out ? "text-ink/35 line-through decoration-ink/30" : "text-ink/80",
                        )}
                      >
                        {s.domain}
                      </span>
                      {s.domain === own.domain && (
                        <span
                          className={cn(
                            "ml-auto shrink-0 rounded px-1.5 py-px font-mono text-[0.58rem] font-medium",
                            out
                              ? "border border-dashed border-ink/25 text-ink/55"
                              : "bg-cta-soft text-cta",
                          )}
                        >
                          {out ? "Google-Extended: disallow" : "your page"}
                        </span>
                      )}
                      {out ? (
                        <X aria-hidden className="h-3 w-3 shrink-0 text-ink/40" strokeWidth={2.5} />
                      ) : (
                        <Check
                          aria-hidden
                          className={cn(
                            "h-3 w-3 shrink-0 text-cta",
                            s.domain !== own.domain && "ml-auto",
                          )}
                          strokeWidth={2.5}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* the answer, with its inline chip */}
          <div className={cn("flex gap-2.5", step(3))}>
            <GeminiMark className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[0.68rem] font-medium text-ink/50">{preview.status}</p>
              <p className="mt-1 text-[0.88rem] leading-relaxed text-ink/85">
                {spans.map((s, i) =>
                  s.bold ? (
                    <span
                      key={i}
                      className="font-semibold text-ink underline decoration-cta decoration-2 underline-offset-2"
                    >
                      {s.text}
                    </span>
                  ) : (
                    <span key={i}>{s.text}</span>
                  ),
                )}{" "}
                {lead && (
                  <span className="inline-flex translate-y-[-1px] items-center gap-1 rounded-full border border-ink/[0.1] bg-white py-px pl-0.5 pr-2 align-middle text-[0.64rem] font-medium text-ink/70">
                    <Favicon domain={lead.domain} />
                    {lead.domain}
                    {cited.length > 1 && <span className="text-ink/40">+{cited.length - 1}</span>}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* the Sources panel the button opens */}
          <div className={cn("rounded-xl border border-ink/[0.08]", step(4))}>
            <p className="flex items-center justify-between border-b border-ink/[0.07] px-3 py-1.5 text-[0.7rem] font-semibold text-ink">
              Sources
              <PanelRight aria-hidden className="h-3.5 w-3.5 text-ink/40" />
            </p>
            <ul>
              {cited.map((s) => (
                <li
                  key={s.domain}
                  className="flex min-w-0 items-center gap-2 border-b border-ink/[0.05] px-3 py-1.5 last:border-b-0"
                >
                  <Favicon domain={s.domain} />
                  <span className="min-w-0 truncate text-[0.72rem] text-ink/80">
                    <span className="font-medium text-ink">{s.title}</span>
                    <span className="text-ink/45"> · {s.domain}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* the switch */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-2.5">
          <span className="font-mono text-[0.68rem] text-ink/60">robots.txt · Google-Extended</span>
          <div
            role="group"
            aria-label="Google-Extended in robots.txt"
            className="inline-flex rounded-lg border border-ink/[0.1] bg-white p-0.5"
          >
            {[
              { label: "Allowed", value: false },
              { label: "Disallowed", value: true },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={blocked === o.value}
                onClick={() => setBlocked(o.value)}
                className={cn(
                  "h-7 rounded-md px-2.5 text-[0.72rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                  blocked === o.value ? "bg-cta text-white" : "text-ink/65 hover:text-ink",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <figcaption
        aria-live="polite"
        className="mt-3 px-1 text-[0.76rem] leading-relaxed text-ink/55"
      >
        {blocked
          ? `Disallowed: Gemini can't ground on ${own.domain}, so it isn't a source. The answer can still name ${brand} from other pages.`
          : `Allowed: ${own.domain} is in the grounding pool and can earn a chip. Try disallowing it.`}
      </figcaption>
    </figure>
  );
}
