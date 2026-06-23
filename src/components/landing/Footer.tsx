import { Link } from "@tanstack/react-router";
import { Logo } from "./shared";

const PLACEHOLDER_COLS = [
  { title: "Product", links: ["How It Works", "Sample Articles", "Pricing", "Proof"] },
  { title: "Features", links: ["Growth Automation", "Citation-Ready Writer", "Answer-Space Research", "Backlinks"] },
];

const TOOL_LINKS = [
  { label: "llms.txt Generator", slug: "llms-txt-generator" },
  { label: "AI robots.txt Generator", slug: "ai-robots-txt-generator" },
  { label: "Schema Generator", slug: "schema-generator" },
  { label: "SERP Snippet Preview", slug: "serp-snippet-preview" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy", to: "/legal/privacy" },
  { label: "Terms", to: "/legal/terms" },
  { label: "Refunds", to: "/legal/refunds" },
  { label: "Cookies", to: "/legal/cookies" },
  { label: "Acceptable Use", to: "/legal/acceptable-use" },
  { label: "DPA", to: "/legal/dpa" },
  { label: "Trust & Security", to: "/trust" },
] as const;

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-ink";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The AI search growth engine for founders. Daily published articles engineered
              to get you cited by AI and ranked on Google.
            </p>
          </div>
          {PLACEHOLDER_COLS.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-ink">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map((label) => (
                  <li key={label}>
                    <a href="#top" className={linkClass}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold text-ink">Free Tools</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/tools" className={linkClass}>
                  All Free Tools
                </Link>
              </li>
              {TOOL_LINKS.map((t) => (
                <li key={t.slug}>
                  <Link to="/tools/$slug" params={{ slug: t.slug }} className={linkClass}>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Legal</p>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 Rankvolt. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built to be the answer on Google &amp; AI search.</p>
        </div>
      </div>
    </footer>
  );
}