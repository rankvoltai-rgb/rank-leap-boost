/**
 * The hub's last band, in the landing's closing style: a blue block inside
 * the rails, the dithered mark in white, the URL field, and a content-plan
 * screen rising from the band's foot, cropped by it. The screen is a
 * skeleton for yoursite.com: it shows the shape of what the visitor gets,
 * not invented results.
 */
import { useState } from "react";
import { ListChecks } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { Band, LINE, Spacer } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { Mark } from "@/components/brand/Mark";
import { TRIAL_DAYS } from "@/data/pricing";
import { cn } from "@/lib/utils";

/* Fixed widths, so the skeleton renders the same on server and client. */
const ROWS = [
  { q: "78%", tag: "w-14" },
  { q: "64%", tag: "w-10" },
  { q: "71%", tag: "w-12" },
  { q: "56%", tag: "w-14" },
];

function PlanSkeleton() {
  return (
    <div
      aria-hidden
      className="rounded-t-xl border border-b-0 border-white/40 bg-white text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
    >
      <div className={cn("flex items-center justify-between gap-3 border-b px-4 py-3", LINE)}>
        <span className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
            <Mark className="h-3.5 w-3.5 text-brand-blue" />
          </span>
          Content plan
        </span>
        <span className="rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.7rem] text-muted-foreground">
          yoursite.com
        </span>
      </div>
      <ul className="space-y-2.5 px-4 py-4">
        {ROWS.map((r, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2.5"
          >
            <ListChecks className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
            <span className="h-2 rounded-full bg-ink/[0.08]" style={{ width: r.q }} />
            <span className={cn("ml-auto h-4 rounded-md bg-cta-soft", r.tag)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HubClosing() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="hub-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <div className="relative px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
            <h2
              id="hub-cta-title"
              className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              The fastest comparison is your own site
            </h2>
            <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              Paste your URL. Rankbox builds your content plan, then writes your first articles on a{" "}
              {TRIAL_DAYS}-day free trial, so you can compare real output side by side.
            </p>
            <div className="mt-8 flex w-full justify-center">
              <UrlForm url={url} onChange={setUrl} />
            </div>
            <p className="mt-4 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[9.5rem] max-w-md overflow-hidden sm:mt-14 sm:h-[10.5rem]"
          >
            <PlanSkeleton />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
