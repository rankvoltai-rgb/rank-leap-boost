import {
  ArrowUpRight,
  Gauge,
  ListChecks,
  Mic,
  PauseCircle,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTROL, SOURCES } from "./content";
import { Go } from "./Go";
import { SectionHead } from "./SectionHead";
import { CARD, SECTION, TEXT_LINK, WRAP } from "./ui";

/** One icon per lever, in CONTROL.levers order. */
const ICONS: LucideIcon[] = [Mic, ListChecks, PenLine, Gauge, ShieldCheck, PauseCircle];

/**
 * The levers an agency keeps on every client site, one line each, and the
 * line about whose job review is. The production detail lives on the content
 * writing deep dive; this stays at the level of the program.
 */
export function Controls() {
  const google = SOURCES[0];
  return (
    <section
      id="control"
      aria-labelledby="control-title"
      className={cn(SECTION, "border-t border-border")}
    >
      <div className={WRAP}>
        <SectionHead id="control" kicker={CONTROL.kicker} intro={CONTROL.intro} />

        <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {CONTROL.levers.map((l, i) => {
            const Icon = ICONS[i] ?? ListChecks;
            return (
              <li key={l.title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-cta">
                  <Icon aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                </span>
                <h3 className="mt-4 text-[1rem] font-semibold tracking-tight text-ink">
                  {l.title}
                </h3>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {l.body}
                </p>
              </li>
            );
          })}
        </ul>

        <div
          className={cn(
            CARD,
            "mt-14 grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12",
          )}
        >
          <div>
            <h3 className="text-[1.05rem] font-semibold text-ink">{CONTROL.duty.title}</h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">
              {CONTROL.duty.body}
            </p>
            <Go href="/legal/terms" className={cn(TEXT_LINK, "mt-3 inline-block text-[0.88rem]")}>
              {CONTROL.duty.terms}
            </Go>
          </div>
          <figure className="m-0 border-l-2 border-cta pl-5">
            <blockquote
              cite={google.url}
              className="text-balance font-display text-[1.25rem] font-medium leading-snug tracking-[-0.01em] text-ink sm:text-[1.4rem]"
            >
              “{CONTROL.duty.quote}”
            </blockquote>
            <figcaption className="mt-3 text-[0.8rem] text-muted-foreground">
              <a href={google.url} rel="noopener" target="_blank" className={TEXT_LINK}>
                {google.label}
              </a>
              <span className="block">{CONTROL.duty.source}</span>
            </figcaption>
          </figure>
        </div>

        <Go
          href="/white-label/content-writing"
          className={cn(TEXT_LINK, "mt-8 inline-flex items-center gap-1.5 text-[0.92rem]")}
        >
          {CONTROL.deeper}
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </Go>
      </div>
    </section>
  );
}
