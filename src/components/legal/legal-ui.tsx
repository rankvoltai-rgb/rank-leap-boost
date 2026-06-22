import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export const LEGAL_ENTITY = "Autusus LLC";
export const LEGAL_BRAND = "Rankvolt";
export const LEGAL_CONTACT = "Rankvoltai@gmail.com";
export const LEGAL_UPDATED = "June 22, 2026";

export const LEGAL_LINKS = [
  { to: "/legal/privacy", label: "Privacy Policy" },
  { to: "/legal/terms", label: "Terms of Service" },
  { to: "/legal/refunds", label: "Refund & Cancellation" },
  { to: "/legal/cookies", label: "Cookie Policy" },
  { to: "/legal/acceptable-use", label: "Acceptable Use" },
  { to: "/legal/dpa", label: "Data Processing Addendum" },
] as const;

/** Page shell: eyebrow, title, summary, last-updated line, content, cross-links. */
export function LegalPage({
  current,
  title,
  summary,
  children,
}: {
  current: string;
  title: string;
  summary?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
      <Link
        to="/"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
      >
        ← Back to home
      </Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-volt">Legal</p>
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-ink">{title}</h1>
      {summary && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{summary}</p>
      )}
      <p className="mt-5 text-sm text-muted-foreground">
        Last updated {LEGAL_UPDATED} · Maintained by {LEGAL_ENTITY} (operator of {LEGAL_BRAND})
      </p>

      <div className="mt-10 space-y-9 text-[0.975rem] leading-relaxed text-muted-foreground">
        {children}
      </div>

      <CrossLinks current={current} />
    </article>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function Ul({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground/50">{children}</ul>;
}

export function Li({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function B({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

export function MailLink() {
  return (
    <a
      href={`mailto:${LEGAL_CONTACT}`}
      className="font-medium text-ink underline decoration-border underline-offset-2 hover:decoration-ink"
    >
      {LEGAL_CONTACT}
    </a>
  );
}

/** Inline link to another legal page. */
export function PolicyLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="font-medium text-ink underline decoration-border underline-offset-2 hover:decoration-ink"
    >
      {children}
    </Link>
  );
}

/** A clearly-marked placeholder for facts the owner must confirm. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-warning/15 px-1 font-medium text-ink">{children}</span>
  );
}

function CrossLinks({ current }: { current: string }) {
  return (
    <nav className="mt-14 border-t border-border pt-8">
      <p className="text-sm font-semibold text-ink">More legal & policy pages</p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {LEGAL_LINKS.filter((l) => l.to !== current).map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted-foreground">
        Questions about any policy? Contact us at <MailLink />.
      </p>
    </nav>
  );
}