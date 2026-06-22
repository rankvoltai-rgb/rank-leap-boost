import { Link } from "@tanstack/react-router";
import { Logo } from "./shared";

const COLS = [
  { title: "Product", links: [{ label: "How It Works" }, { label: "Sample Articles" }, { label: "Pricing" }, { label: "Proof" }] },
  { title: "Features", links: [{ label: "Growth Automation" }, { label: "Citation-Ready Writer" }, { label: "Answer-Space Research" }, { label: "Backlinks" }] },
  { title: "Company", links: [{ label: "About" }, { label: "Blog" }, { label: "Careers" }, { label: "Contact" }] },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/legal/privacy" },
      { label: "Terms", to: "/legal/terms" },
      { label: "Refunds", to: "/legal/refunds" },
      { label: "Cookies", to: "/legal/cookies" },
      { label: "Acceptable Use", to: "/legal/acceptable-use" },
      { label: "DPA", to: "/legal/dpa" },
      { label: "Trust & Security", to: "/trust" },
    ],
  },
];

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
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-ink">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {"to" in l && l.to ? (
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href="#top"
                        className="text-sm text-muted-foreground transition-colors hover:text-ink"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 Rankvolt. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built to be the answer on Google &amp; AI search.</p>
        </div>
      </div>
    </footer>
  );
}