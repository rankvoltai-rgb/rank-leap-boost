import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./shared";

// Client-only TrustBox: the Trustpilot script replaces the div's contents with
// an iframe after load. Rendering it only after mount keeps SSR and client
// markup identical, avoiding a hydration mismatch.
function TrustBox() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ref.current && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(ref.current, true);
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="mt-8 flex justify-center">
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id="rankvolt.top"
        data-style-height="52px"
        data-style-width="100%"
      >
        <a
          href="https://www.trustpilot.com/review/rankvolt.top"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-ink"
        >
          Trustpilot
        </a>
      </div>
    </div>
  );
}

const PRODUCT_LINKS = [
  { label: "How It Works", href: "#top" },
  { label: "Pricing", href: "#pricing" },
  { label: "Proof", href: "#proof" },
] as const;

const FEATURE_LINKS = [
  "Growth Automation",
  "Citation-Ready Writer",
  "Answer-Space Research",
  "Backlinks",
] as const;

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
          <div>
            <p className="text-sm font-semibold text-ink">Product</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/blog" className={linkClass}>
                  Blog
                </Link>
              </li>
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Features</p>
            <ul className="mt-3 space-y-2">
              {FEATURE_LINKS.map((label) => (
                <li key={label}>
                  <a href="#top" className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
        {/* TrustBox widget (client-only) */}
        <TrustBox />
      </div>
    </footer>
  );
}