import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./shared";
import { FEATURES } from "@/data/features";

const LINKS = [
  { label: "Proof", href: "#proof" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex shrink-0 items-center gap-3">
          <a href="#top">
            <Logo />
          </a>
        </div>
        <div className="hidden items-center gap-6 md:flex lg:gap-7">
          <div
            className="relative"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
            onFocus={() => setFeaturesOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setFeaturesOpen(false);
            }}
          >
            <Link
              to="/features"
              aria-haspopup="menu"
              aria-expanded={featuresOpen}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              Features
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`}
              />
            </Link>
            {/* hover bridge so the menu stays open across the gap */}
            <div className="absolute left-1/2 top-full h-3 w-full -translate-x-1/2" aria-hidden />
            <div
              role="menu"
              className={`absolute left-1/2 top-[calc(100%+0.5rem)] w-[34rem] -translate-x-1/2 rounded-2xl border border-border bg-card p-3 shadow-elevation-lg transition-all duration-200 ${
                featuresOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-1">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <Link
                      key={f.slug}
                      to="/features/$slug"
                      params={{ slug: f.slug }}
                      role="menuitem"
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-secondary"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-ink transition-colors group-hover:bg-ink group-hover:text-background">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink">{f.name}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                          {f.tagline}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/features"
                role="menuitem"
                className="mt-1 flex items-center justify-center rounded-xl border-t border-border px-2.5 py-3 text-sm font-semibold text-volt transition-colors hover:text-ink"
              >
                View all features →
              </Link>
            </div>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
            onFocus={() => setResourcesOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setResourcesOpen(false);
            }}
          >
            <Link
              to="/blog"
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              Resources
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
              />
            </Link>
            <div className="absolute left-1/2 top-full h-3 w-full -translate-x-1/2" aria-hidden />
            <div
              role="menu"
              className={`absolute left-1/2 top-[calc(100%+0.5rem)] w-56 -translate-x-1/2 rounded-2xl border border-border bg-card p-2 shadow-elevation-lg transition-all duration-200 ${
                resourcesOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <Link
                to="/blog"
                role="menuitem"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-secondary"
              >
                Blog
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  Guides & GEO playbooks
                </span>
              </Link>
              <Link
                to="/tools"
                role="menuitem"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-secondary"
              >
                Free Tools
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  llms.txt, schema & more
                </span>
              </Link>
              <a
                href="#examples"
                role="menuitem"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-secondary"
              >
                Sample Output
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  Example AI articles
                </span>
              </a>
            </div>
          </div>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/auth"
            className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-secondary md:inline-flex"
          >
            Sign In
          </a>
          <a
            href="/auth"
            className="hidden rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:inline-flex"
          >
            Get Started Free
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setMobileFeaturesOpen((v) => !v)}
              aria-expanded={mobileFeaturesOpen}
              className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-ink"
            >
              Features
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${mobileFeaturesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileFeaturesOpen && (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-3">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <Link
                      key={f.slug}
                      to="/features/$slug"
                      params={{ slug: f.slug }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-ink"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {f.name}
                    </Link>
                  );
                })}
                <Link
                  to="/features"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-semibold text-volt hover:bg-secondary"
                >
                  View all features →
                </Link>
              </div>
            )}
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/auth"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-ink px-4 py-2.5 text-center text-sm font-semibold text-background"
            >
              Get Started Free
            </a>
            <a
              href="/auth"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-ink"
            >
              Sign In
            </a>
          </div>
        </div>
      )}
    </header>
  );
}