/**
 * The pieces of a changelog entry, shared by the hub and each entry's own
 * page: its labels, the note that says why it isn't live yet, its body, and
 * the blue band that closes both pages. Drawn in the landing's frame:
 * hairline cells, soft-blue marks, CTAs in blue.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Link2 } from "lucide-react";
import { Md } from "@/components/ai-seo/kit";
import { Band, CELL, CellGrid, Spacer } from "@/components/landing/frame";
import { MarkDither } from "@/components/landing/hero-dither";
import { UrlForm } from "@/components/landing/Hero";
import { Reveal } from "@/components/landing/shared";
import { TRIAL_NOTE } from "@/data/pricing";
import { cn } from "@/lib/utils";
import {
  KINDS,
  STATUSES,
  type ChangeKind,
  type ChangeStatus,
  type ChangelogEntry,
} from "@/data/changelog";

export const SITE = "https://rankbox.xyz";

export function entryPath(slug: string) {
  return `/changelog/${slug}`;
}

export function entryUrl(slug: string) {
  return `${SITE}${entryPath(slug)}`;
}

/** "Tuesday" — UTC, like formatDate, so server and client agree. */
export function weekday(iso: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(
    new Date(iso),
  );
}

/* ---------- Labels ---------- */

const KIND_STYLE: Record<ChangeKind, string> = {
  feature: "bg-cta text-white",
  improvement: "bg-cta-soft text-cta",
  resources: "border border-ink/[0.08] bg-white text-ink",
  announcement: "bg-ink/[0.05] text-ink",
};

export function KindLabel({ kind, className }: { kind: ChangeKind; className?: string }) {
  const label = KINDS.find((k) => k.id === kind)?.label ?? kind;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md px-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em]",
        KIND_STYLE[kind],
        className,
      )}
    >
      {label}
    </span>
  );
}

const STATUS_DOT: Record<ChangeStatus, string> = {
  live: "bg-success",
  "rolling-out": "bg-warning",
  "coming-soon": "bg-muted-foreground/60",
};

export function StatusDot({ status, className }: { status: ChangeStatus; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
        STATUS_DOT[status],
        className,
      )}
    />
  );
}

export function StatusBadge({ status }: { status: ChangeStatus }) {
  return (
    <span
      title={STATUSES[status].meaning}
      className="inline-flex h-6 items-center gap-1.5 rounded-md border border-ink/[0.08] bg-white px-2 text-xs font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      <StatusDot status={status} />
      {STATUSES[status].label}
    </span>
  );
}

export function EntryLabels({ entry, className }: { entry: ChangelogEntry; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <KindLabel kind={entry.kind} />
      <StatusBadge status={entry.status} />
      {entry.audience && (
        <span className="text-xs font-medium text-muted-foreground">{entry.audience}</span>
      )}
    </div>
  );
}

/** Why an entry isn't live yet. Never shown for a live one. */
export function StatusNote({ entry, className }: { entry: ChangelogEntry; className?: string }) {
  if (entry.status === "live" || !entry.statusNote) return null;
  return (
    <p
      className={cn(
        "flex gap-3 rounded-xl border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-3 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <StatusDot status={entry.status} className="mt-[0.45rem]" />
      <span>
        <strong className="font-semibold text-ink">{STATUSES[entry.status].label}.</strong>{" "}
        {entry.statusNote}
      </span>
    </p>
  );
}

/* ---------- Body ---------- */

const PROSE =
  "space-y-4 text-[1rem] leading-[1.75] text-ink/75 [&_a]:font-medium [&_a]:text-cta [&_a]:underline [&_a]:decoration-cta/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-cta [&_code]:rounded [&_code]:bg-ink/[0.05] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.88em]";

/** The release's paragraphs. */
export function EntryProse({ entry, className }: { entry: ChangelogEntry; className?: string }) {
  return (
    <div className={cn(PROSE, className)}>
      {entry.body.map((p, i) => (
        <p key={i}>
          <Md text={p} />
        </p>
      ))}
    </div>
  );
}

/**
 * The release's points, as hairline cells. Each cell carries its own edges,
 * so an odd count leaves the last row white rather than a grey gap.
 */
export function EntryPoints({ entry, className }: { entry: ChangelogEntry; className?: string }) {
  if (!entry.points?.length) return null;
  return (
    <div className={cn("overflow-hidden rounded-xl border border-ink/[0.07] bg-white", className)}>
      <CellGrid className="sm:grid-cols-2">
        {entry.points.map((pt) => (
          <li key={pt.title} className={cn(CELL, "min-w-0 px-5 py-5")}>
            <p className="flex items-center gap-2 text-[0.93rem] font-semibold text-ink">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-cta-soft text-cta">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {pt.title}
            </p>
            <p className="mt-1.5 pl-7 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-cta hover:[&_a]:underline [&_code]:rounded [&_code]:bg-ink/[0.05] [&_code]:px-1">
              <Md text={pt.text} />
            </p>
          </li>
        ))}
      </CellGrid>
    </div>
  );
}

/** Paragraphs, then points: the whole release. */
export function EntryBody({ entry }: { entry: ChangelogEntry }) {
  return (
    <>
      <EntryProse entry={entry} />
      <EntryPoints entry={entry} className="mt-8" />
    </>
  );
}

export function EntryLinks({ entry, className }: { entry: ChangelogEntry; className?: string }) {
  if (!entry.links?.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {entry.links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cta transition-colors hover:text-cta-hover"
        >
          {l.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      ))}
    </div>
  );
}

/** Copies the entry's own URL, so a release can be shared on its own. */
export function CopyLink({ slug, className }: { slug: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(entryUrl(slug));
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the title is a link too, so nothing is lost.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white px-2.5 text-xs font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Link2 className="h-3.5 w-3.5" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}

/* ---------- Closing ---------- */

/**
 * The blue band that ends both changelog pages: the landing's closing motif
 * (white mark dithered behind), with the URL field on a white card so the
 * next step is the product, not another page.
 */
export function ChangelogClosing() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="changelog-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_90%_at_50%_50%,#000_35%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto max-w-2xl px-6 py-14 text-center sm:px-10 sm:py-16">
          <h2
            id="changelog-cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            See what Rankbox would publish for your site
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white">
            Enter your site. Rankbox reads it, finds the questions your buyers ask AI, and plans the
            articles that answer them.
          </p>
          <div className="mx-auto mt-8 max-w-[34rem] rounded-xl bg-white p-2 text-left shadow-[0_1px_2px_rgba(4,24,72,0.2),0_16px_40px_-16px_rgba(4,24,72,0.55)]">
            <UrlForm url={url} onChange={setUrl} variant="split" />
          </div>
          <p className="mt-3.5 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
