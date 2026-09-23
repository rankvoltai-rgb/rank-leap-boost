/**
 * The pieces of a changelog entry, shared by the hub and each entry's own
 * page: its labels, the note that says why it isn't live yet, and its body.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Link2 } from "lucide-react";
import { Md } from "@/components/ai-seo/kit";
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
  resources: "bg-secondary text-ink",
  announcement: "bg-ink/[0.06] text-ink",
};

export function KindLabel({ kind, className }: { kind: ChangeKind; className?: string }) {
  const label = KINDS.find((k) => k.id === kind)?.label ?? kind;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md px-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em]",
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
      className="inline-flex h-6 items-center gap-1.5 rounded-md border border-border bg-card px-2 text-xs font-medium text-ink"
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
        "flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-muted-foreground",
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

export function EntryBody({ entry }: { entry: ChangelogEntry }) {
  return (
    <>
      <div className="space-y-4 text-[0.99rem] leading-[1.75] text-foreground/80 [&_a]:font-medium [&_a]:text-cta [&_a]:underline [&_a]:decoration-cta/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-cta">
        {entry.body.map((p, i) => (
          <p key={i}>
            <Md text={p} />
          </p>
        ))}
      </div>

      {entry.points && (
        <dl className="mt-8 grid gap-x-10 gap-y-6 border-t border-border pt-7 sm:grid-cols-2">
          {entry.points.map((pt) => (
            <div key={pt.title} className="min-w-0">
              <dt className="flex items-center gap-2 text-[0.95rem] font-semibold text-ink">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cta-soft text-cta">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {pt.title}
              </dt>
              <dd className="mt-1.5 pl-7 text-sm leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-cta hover:[&_a]:underline">
                <Md text={pt.text} />
              </dd>
            </div>
          ))}
        </dl>
      )}
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
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Link2 className="h-3.5 w-3.5" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
