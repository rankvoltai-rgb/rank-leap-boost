import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./shared";
import { PixelField } from "./Hero";
import { FEATURES } from "@/data/features";
import { COMPETITORS } from "@/data/alternatives";
import { PERSONAS } from "@/data/personas";
import { ENGINES } from "@/data/ai-seo/engines";

// Trustpilot's 24-character business unit ID (Trustpilot Business → Integrations
// → TrustBox). The widget rejects anything else — a domain gets a 400 and an
// empty frame — so the TrustBox stays hidden until the real ID is set here.
const TRUSTPILOT_BUSINESS_UNIT_ID = "";

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

  if (!mounted || !/^[a-f0-9]{24}$/.test(TRUSTPILOT_BUSINESS_UNIT_ID)) return null;

  return (
    <div className="mt-8 flex justify-center">
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id={TRUSTPILOT_BUSINESS_UNIT_ID}
        data-style-height="52px"
        data-style-width="100%"
      >
        <a
          href="https://www.trustpilot.com/review/rankbox.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/70 hover:text-white"
        >
          Trustpilot
        </a>
      </div>
    </div>
  );
}

/* Landing-page sections; the footer is shared by every public page. Pricing
   has its own page. */
const PRODUCT_LINKS = [
  { label: "How It Works", to: "/", hash: "top" },
  { label: "Pricing", to: "/pricing" },
  { label: "Proof", to: "/", hash: "proof" },
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

const linkClass = "text-sm text-white/70 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-blue text-white">
      <PixelField seed={5} />
      <div className="relative mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-10 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo inverted />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              The AI search growth engine for founders. Daily published articles engineered to get
              you cited by AI and ranked on Google.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Product</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/blog" className={linkClass}>
                  Blog
                </Link>
              </li>
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} hash={"hash" in l ? l.hash : undefined} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/use-cases" className={linkClass}>
                  Use cases
                </Link>
              </li>
              {PERSONAS.map((p) => (
                <li key={p.slug}>
                  <Link to="/use-cases/$slug" params={{ slug: p.slug }} className={linkClass}>
                    For {p.nameLower}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/alternatives" className={linkClass}>
                  Comparisons
                </Link>
              </li>
              {COMPETITORS.map((c) => (
                <li key={c.slug}>
                  <Link to="/alternatives/$slug" params={{ slug: c.slug }} className={linkClass}>
                    Rankbox vs {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Features</p>
            <ul className="mt-3 space-y-2">
              {FEATURES.map((f) => (
                <li key={f.slug}>
                  <Link to="/features/$slug" params={{ slug: f.slug }} className={linkClass}>
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Free Tools</p>
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
            <p className="text-sm font-semibold text-white">AI SEO Guides</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/ai-seo" className={linkClass}>
                  All engines
                </Link>
              </li>
              {ENGINES.map((e) => (
                <li key={e.slug}>
                  <Link to="/ai-seo/$engine" params={{ engine: e.slug }} className={linkClass}>
                    {e.shortName} SEO
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
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
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 sm:flex-row">
          <p className="text-xs text-white/60">© 2026 Rankbox. All rights reserved.</p>
          <p className="text-xs text-white/60">Built to be the answer on Google &amp; AI search.</p>
        </div>
        {/* TrustBox widget (client-only) */}
        <TrustBox />
      </div>
    </footer>
  );
}
