/**
 * The navbar below md: a full-height sheet under the bar. It scrolls on its
 * own and pins the sign-up actions to its foot, so they stay reachable however
 * far the sections are opened — a sheet inside the sticky header can't scroll,
 * and anything below the fold of a tall one was simply out of reach.
 *
 * Mounted only while open, so each opening starts with every section closed.
 */
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURES, FEATURE_GROUPS } from "@/data/features";
import { NAV_COMPETITORS } from "@/data/alternatives";
import { PERSONAS } from "@/data/personas";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { enginesInTier } from "@/data/ai-seo/engines";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import { CompetitorMark } from "@/components/alternatives/kit";
import { ENGINE_MARKS } from "./ai-logos";
import { COMPARE_LINKS, LEARN_LINKS, type MenuId, type NavTarget } from "@/data/nav";
import { NavLink } from "./nav-menus";

export interface TopLink {
  label: string;
  to: string;
  hash?: string;
}

const ENGINES_IN_ORDER = [...enginesInTier("frontier"), ...enginesInTier("more")];

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-2 pb-1 pt-4 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/65 first:pt-1">
      {children}
    </p>
  );
}

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-inset ring-white/20">
      <Icon className="h-4 w-4" />
    </span>
  );
}

function Row({
  target,
  icon,
  meta,
  children,
}: {
  target: NavTarget;
  icon?: ReactNode;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <NavLink
      target={target}
      className="flex min-h-11 items-center gap-3 rounded-xl px-2 py-1.5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-white/10 active:bg-white/15 data-[status=active]:bg-white/10"
    >
      {icon}
      <span className={meta ? "shrink-0" : "min-w-0 truncate"}>{children}</span>
      {meta && (
        <span className="ml-auto min-w-0 truncate pl-2 text-right text-xs text-white/65">
          {meta}
        </span>
      )}
    </NavLink>
  );
}

function MoreRow({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="mt-1 flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-[0.9375rem] font-semibold text-white hover:bg-white/10 active:bg-white/15"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

/** An accordion section. Closed sections are inert, so their links drop out of
 *  the tab order and the accessibility tree while they're folded away. */
function Section({
  id,
  label,
  open,
  onToggle,
  children,
}: {
  id: MenuId;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-white/15">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`mobile-nav-${id}`}
        className="flex min-h-14 w-full items-center justify-between text-base font-semibold text-white"
      >
        {label}
        <ChevronDown
          className={cn(
            "h-5 w-5 text-white/70 transition-transform duration-300 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        id={`mobile-nav-${id}`}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function MobileNav({ links, onClose }: { links: readonly TopLink[]; onClose: () => void }) {
  const [section, setSection] = useState<MenuId | null>(null);
  const toggle = (id: MenuId) => setSection((s) => (s === id ? null : id));

  // Lock the page behind the sheet, and close on Escape or on widening past
  // the breakpoint where the desktop menus take over.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const desktop = window.matchMedia("(min-width: 768px)");
    const onWiden = () => desktop.matches && onClose();
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWiden);
    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWiden);
    };
  }, [onClose]);

  return (
    <div
      id="mobile-nav"
      // Any link closes the sheet, including hash links to the page you're on.
      onClick={(e) => (e.target as HTMLElement).closest("a") && onClose()}
      className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col border-t border-white/15 bg-brand-blue duration-200 animate-in fade-in slide-in-from-top-1 motion-reduce:animate-none md:hidden"
    >
      <nav aria-label="Main" className="flex-1 overflow-y-auto overscroll-contain px-5">
        <Section
          id="features"
          label="Features"
          open={section === "features"}
          onToggle={() => toggle("features")}
        >
          {FEATURE_GROUPS.map((group) => (
            <div key={group}>
              <GroupLabel>{group}</GroupLabel>
              {FEATURES.filter((f) => f.group === group).map((f) => (
                <Row
                  key={f.slug}
                  target={{ to: "/features/$slug", params: { slug: f.slug } }}
                  icon={<IconTile icon={f.icon} />}
                >
                  {f.name}
                </Row>
              ))}
            </div>
          ))}
          <GroupLabel>Who it&rsquo;s for</GroupLabel>
          {PERSONAS.map((p) => (
            <Row
              key={p.slug}
              target={{ to: "/use-cases/$slug", params: { slug: p.slug } }}
              icon={<IconTile icon={p.icon} />}
            >
              For {p.nameLower}
            </Row>
          ))}
          <GroupLabel>Publish anywhere</GroupLabel>
          <Row
            target={{ to: "/integrations" }}
            icon={
              <span aria-hidden className="flex shrink-0 gap-1">
                {PUBLISH_PLATFORMS.map((p) => (
                  <IntegrationLogo
                    key={p.id}
                    id={p.id}
                    title={false}
                    className="h-6 w-6 ring-white/25"
                  />
                ))}
              </span>
            }
          >
            Integrations
          </Row>
          <MoreRow to="/features">All features</MoreRow>
        </Section>

        <Section
          id="resources"
          label="Resources"
          open={section === "resources"}
          onToggle={() => toggle("resources")}
        >
          <GroupLabel>Learn</GroupLabel>
          {LEARN_LINKS.map((l) => (
            <Row key={l.title} target={l.target} icon={<IconTile icon={l.icon} />}>
              {l.title}
            </Row>
          ))}
          <GroupLabel>Compare</GroupLabel>
          {COMPARE_LINKS.map((l) => (
            <Row key={l.title} target={l.target} icon={<IconTile icon={l.icon} />}>
              {l.title}
            </Row>
          ))}
          {NAV_COMPETITORS.map((c) => (
            <Row
              key={c.slug}
              target={{ to: "/alternatives/$slug", params: { slug: c.slug } }}
              meta={c.category}
              icon={
                // Fetched by domain, so only once the section is opened.
                section === "resources" ? (
                  <CompetitorMark competitor={c} onDark className="h-8 w-8 text-xs" />
                ) : (
                  <span aria-hidden className="h-8 w-8 shrink-0 rounded-[26%] bg-white/15" />
                )
              }
            >
              vs {c.name}
            </Row>
          ))}
          <GroupLabel>AI SEO guides</GroupLabel>
          <div className="flex flex-wrap gap-1.5 px-2 pt-1">
            {ENGINES_IN_ORDER.map((e) => {
              const Mark = ENGINE_MARKS[e.mark];
              return (
                <NavLink
                  key={e.slug}
                  target={{ to: "/ai-seo/$engine", params: { engine: e.slug } }}
                  aria-label={`${e.shortName} SEO guide`}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3.5 text-sm font-medium text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 active:bg-white/25"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                    <Mark className="h-3.5 w-3.5" />
                  </span>
                  {e.shortName}
                </NavLink>
              );
            })}
          </div>
          <MoreRow to="/ai-seo">Compare all engines</MoreRow>
        </Section>

        {links.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            hash={l.hash}
            className="flex min-h-14 items-center border-b border-white/15 text-base font-semibold text-white last:border-b-0"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="grid grid-cols-2 gap-2 border-t border-white/15 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <a
          href="/auth"
          className="flex h-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-sm font-semibold text-white"
        >
          Sign In
        </a>
        <a
          href="/auth"
          className="flex h-11 items-center justify-center rounded-xl bg-white text-sm font-semibold text-brand-blue shadow-sm"
        >
          Get Started Free
        </a>
      </div>
    </div>
  );
}
