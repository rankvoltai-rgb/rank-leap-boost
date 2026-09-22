import { useState, type MouseEvent } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Wrench,
  FileText,
  GitCompare,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./shared";
import { FEATURES, FEATURE_GROUPS } from "@/data/features";
import { COMPETITORS } from "@/data/alternatives";
import { PERSONAS } from "@/data/personas";
import { ENGINES, type Engine } from "@/data/ai-seo/engines";
import { AI_MARKS } from "./ai-logos";

/* Sections of the landing page. The navbar is shared by every public page,
   so these always target "/" rather than a bare hash on the current page.
   Pricing is the exception: it has its own page. */
const LINKS = [
  { label: "Proof", to: "/", hash: "proof" },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "/", hash: "faq" },
] as const;

/* On the landing page itself the router treats "/" → "/" as a no-op, so the
   logo scrolls back to the top instead. */
function scrollHomeToTop(e: MouseEvent) {
  if (window.location.pathname !== "/" || window.location.hash) return;
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Menu primitives (shared by both dropdowns) ---------- */

function MenuColumnLabel({ children }: { children: string }) {
  return (
    <p className="px-2.5 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60">
      {children}
    </p>
  );
}

function MenuItem({
  icon: Icon,
  title,
  description,
  ...link
}: {
  icon: LucideIcon;
  title: string;
  description: string;
} & ({ to: string; params?: Record<string, string> } | { href: string })) {
  const className =
    "group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/10";
  const body = (
    <>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-brand-blue">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-xs leading-snug text-white/70">{description}</span>
      </span>
    </>
  );
  if ("href" in link) {
    return (
      <a href={link.href} role="menuitem" className={className}>
        {body}
      </a>
    );
  }
  return (
    <Link to={link.to} params={link.params} role="menuitem" className={className}>
      {body}
    </Link>
  );
}

/* A guide row: the engine's own logo on a white tile, since a line icon would
   say nothing about which engine it is. */
function EngineMenuItem({ engine }: { engine: Engine }) {
  const Mark = AI_MARKS.find((m) => m.name === engine.mark)?.Mark;
  return (
    <Link
      to="/ai-seo/$engine"
      params={{ engine: engine.slug }}
      role="menuitem"
      className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/10"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm transition-transform group-hover:scale-105">
        {Mark && <Mark className="h-4 w-4" />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-white">
          {engine.shortName} SEO
        </span>
        <span className="block truncate text-xs text-white/70">{engine.vendor}</span>
      </span>
    </Link>
  );
}

/* A promo panel closing out the menu: a sample read plus a way in. */
function MenuFeaturePanel() {
  return (
    <div className="hidden flex-col rounded-xl border border-white/20 bg-white/10 p-4 lg:flex">
      <p className="text-sm font-semibold text-white">Score your site</p>
      <p className="mt-1.5 text-xs leading-relaxed text-white/70">
        See how often AI answers cite your brand today — and exactly what to publish next.
      </p>
      <div className="mt-4 rounded-lg border border-white/20 bg-white/10 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold text-white">yoursite.com</span>
          <span className="shrink-0 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-white/60">
            Sample
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[0.7rem] text-white/70">
          <span>GEO Score</span>
          <span className="font-semibold text-white">87 · A</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[87%] rounded-full bg-white" />
        </div>
      </div>
      <a
        href="/auth"
        role="menuitem"
        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white"
      >
        Start free
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const menuOpen = featuresOpen || resourcesOpen;
  return (
    <header className="sticky top-0 z-50 bg-brand-blue">
      {/* Frosted scrim over the page while a menu is open: the menus share the
          hero's blue, so blurring and deepening what's behind them is what
          lifts them off the hero. Purely visual — never takes the pointer. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 bottom-0 top-16 hidden bg-brand-blue-deep/30 backdrop-blur-sm transition-opacity duration-200 md:block ${
          menuOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex shrink-0 items-center gap-3">
          <Link to="/" onClick={scrollHomeToTop}>
            <Logo inverted />
          </Link>
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
              className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              Features
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`}
              />
            </Link>
            {/* hover bridge so the menu stays open across the gap */}
            <div className="absolute left-1/2 top-full h-7 w-full -translate-x-1/2" aria-hidden />
            <div
              role="menu"
              className={`fixed left-1/2 top-[4.25rem] w-[min(64rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/25 bg-brand-blue p-4 shadow-2xl shadow-brand-blue-deep/50 transition-all duration-200 ${
                featuresOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 lg:grid-cols-[1fr_1fr_1fr_15rem]">
                {FEATURE_GROUPS.map((group) => (
                  <div key={group}>
                    <MenuColumnLabel>{group}</MenuColumnLabel>
                    {FEATURES.filter((f) => f.group === group).map((f) => (
                      <MenuItem
                        key={f.slug}
                        icon={f.icon}
                        title={f.name}
                        description={f.tagline}
                        to="/features/$slug"
                        params={{ slug: f.slug }}
                      />
                    ))}
                  </div>
                ))}
                <div>
                  <MenuColumnLabel>Who it&rsquo;s for</MenuColumnLabel>
                  {PERSONAS.map((p) => (
                    <MenuItem
                      key={p.slug}
                      icon={p.icon}
                      title={p.name}
                      description={p.tagline}
                      to="/use-cases/$slug"
                      params={{ slug: p.slug }}
                    />
                  ))}
                  <Link
                    to="/use-cases"
                    role="menuitem"
                    className="block rounded-xl px-2.5 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    All use cases →
                  </Link>
                </div>
                <MenuFeaturePanel />
              </div>
              <Link
                to="/features"
                role="menuitem"
                className="mt-2 flex items-center justify-center rounded-xl border-t border-white/20 px-2.5 py-3 text-sm font-semibold text-white transition-colors hover:text-white/75"
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
              className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              Resources
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
              />
            </Link>
            <div className="absolute left-1/2 top-full h-3 w-full -translate-x-1/2" aria-hidden />
            <div
              role="menu"
              className={`absolute left-1/2 top-[calc(100%+0.5rem)] w-[min(52rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/25 bg-brand-blue p-3 shadow-2xl shadow-brand-blue-deep/50 transition-all duration-200 ${
                resourcesOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <div className="grid grid-cols-3 gap-x-3">
                <div>
                  <MenuColumnLabel>Learn</MenuColumnLabel>
                  <MenuItem
                    icon={BookOpen}
                    title="Blog"
                    description="Guides & GEO playbooks"
                    to="/blog"
                  />
                  <MenuItem
                    icon={Wrench}
                    title="Free Tools"
                    description="llms.txt, schema & more"
                    to="/tools"
                  />
                  <MenuItem
                    icon={FileText}
                    title="Sample Output"
                    description="Example AI articles"
                    href="/#examples"
                  />
                </div>
                <div>
                  <MenuColumnLabel>Compare</MenuColumnLabel>
                  <MenuItem
                    icon={GitCompare}
                    title="All comparisons"
                    description="Honest side-by-sides"
                    to="/alternatives"
                  />
                  {COMPETITORS.map((c) => (
                    <MenuItem
                      key={c.slug}
                      icon={GitCompare}
                      title={`vs ${c.name}`}
                      description={c.category}
                      to="/alternatives/$slug"
                      params={{ slug: c.slug }}
                    />
                  ))}
                </div>
                <div>
                  <MenuColumnLabel>AI SEO guides</MenuColumnLabel>
                  {ENGINES.map((e) => (
                    <EngineMenuItem key={e.slug} engine={e} />
                  ))}
                  <Link
                    to="/ai-seo"
                    role="menuitem"
                    className="mt-1 block rounded-xl px-2.5 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Compare all engines →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={"hash" in l ? l.hash : undefined}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/auth"
            className="hidden rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 md:inline-flex"
          >
            Sign In
          </a>
          <a
            href="/auth"
            className="hidden rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-blue shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md md:inline-flex"
          >
            Get Started Free
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-white md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-white/15 bg-brand-blue px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setMobileFeaturesOpen((v) => !v)}
              aria-expanded={mobileFeaturesOpen}
              className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              Features
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${mobileFeaturesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileFeaturesOpen && (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-white/20 pl-3">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <Link
                      key={f.slug}
                      to="/features/$slug"
                      params={{ slug: f.slug }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {f.name}
                    </Link>
                  );
                })}
                <Link
                  to="/features"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  View all features →
                </Link>
                {/* Labelled, or "For marketers" reads as a ninth feature. */}
                <p className="mt-3 px-2 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                  Who it&rsquo;s for
                </p>
                {PERSONAS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <Link
                      key={p.slug}
                      to="/use-cases/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      For {p.nameLower}
                    </Link>
                  );
                })}
                <Link
                  to="/use-cases"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  All use cases →
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMobileResourcesOpen((v) => !v)}
              aria-expanded={mobileResourcesOpen}
              className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              Resources
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${mobileResourcesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileResourcesOpen && (
              <div className="mb-1 ml-2 flex flex-col gap-0.5 border-l border-white/20 pl-3">
                <Link
                  to="/blog"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Blog
                </Link>
                <Link
                  to="/tools"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Free Tools
                </Link>
                <a
                  href="/#examples"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Sample Output
                </a>
                <Link
                  to="/alternatives"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Comparisons
                </Link>
                {COMPETITORS.map((c) => (
                  <Link
                    key={c.slug}
                    to="/alternatives/$slug"
                    params={{ slug: c.slug }}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-2 pl-4 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    vs {c.name}
                  </Link>
                ))}
                <Link
                  to="/ai-seo"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  AI SEO guides
                </Link>
                {ENGINES.map((e) => (
                  <Link
                    key={e.slug}
                    to="/ai-seo/$engine"
                    params={{ engine: e.slug }}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-2 pl-4 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    {e.shortName} SEO
                  </Link>
                ))}
              </div>
            )}
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                hash={"hash" in l ? l.hash : undefined}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/auth"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-brand-blue"
            >
              Get Started Free
            </a>
            <a
              href="/auth"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Sign In
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
