/**
 * The contents of the navbar's two mega menus, and the navigation data the
 * mobile sheet shares with them. The shell (triggers, hover intent, the
 * morphing panel behind these) lives in Navbar.tsx.
 *
 * Every menu is two-tone: primary links sit on the white panel, and the
 * secondary zone (a right rail, a footer band) sits on a soft grey, the
 * landing page's panel tone, so the eye lands on the product first and the
 * extras second. Hover and the page you're on pick up the soft blue key.
 */
import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURES, FEATURE_GROUPS } from "@/data/features";
import { NAV_COMPETITORS } from "@/data/alternatives";
import { PERSONA_GROUPS, personasIn, type Persona } from "@/data/personas";
import { PUBLISH_PLATFORMS } from "@/data/platforms";
import { TOOLS } from "@/data/tools";
import { TIERS, enginesInTier, type Engine } from "@/data/ai-seo/engines";
import {
  COMPARE_LINKS,
  LEARN_LINKS,
  NAV_TOOLKIT,
  NAV_TOOLKIT_TOOLS,
  TOOL_CHIP_LABELS,
  type NavEntry,
  type NavTarget,
} from "@/data/nav";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import { CompetitorMark } from "@/components/alternatives/kit";
import { TOOL_ICONS } from "@/components/tools/icons";
import { ENGINE_MARKS } from "./ai-logos";

/** The secondary zone inside a menu: rails and footer bands. */
const MENU_RAIL = "bg-[color-mix(in_oklab,var(--surface)_55%,white)]";

/* ---------- Primitives ---------- */

export function NavLink({
  target,
  className,
  children,
  ...rest
}: {
  target: NavTarget;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  title?: string;
  onPointerEnter?: () => void;
  onFocus?: () => void;
}) {
  if ("href" in target) {
    return (
      <a href={target.href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={target.to} params={target.params} className={className} {...rest}>
      {children}
    </Link>
  );
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-0";

function ColumnLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex h-7 items-center justify-between px-2.5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/85">
        {children}
      </p>
      {action}
    </div>
  );
}

/** The "see all" link that sits at the right of a column's label. */
function LabelLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={cn(
        "group -mr-1 inline-flex items-center gap-1 rounded-md px-1 text-xs font-semibold text-cta transition-colors hover:text-cta-hover",
        FOCUS_RING,
      )}
    >
      {children}
      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </Link>
  );
}

/** The primary row: icon tile, name, one line of what it does. The tile turns
 *  soft blue on hover and on the page you're already on. */
function MenuItem({ icon: Icon, title, description, target }: NavEntry) {
  return (
    <NavLink
      target={target}
      className={cn(
        "group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-ink/[0.035] data-[status=active]:bg-ink/[0.035]",
        FOCUS_RING,
      )}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-inset ring-ink/[0.08] transition-colors group-hover:bg-cta-soft group-hover:text-cta group-hover:ring-cta/20 group-focus-visible:bg-cta-soft group-focus-visible:text-cta group-data-[status=active]:bg-cta-soft group-data-[status=active]:text-cta group-data-[status=active]:ring-cta/20">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-sm font-semibold text-ink">
          {title}
          <ArrowRight
            aria-hidden
            className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
          />
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
    </NavLink>
  );
}

/** A secondary row: the destination, no description. */
function CompactItem({
  icon,
  title,
  meta,
  target,
}: {
  icon: ReactNode;
  title: string;
  meta?: string;
  target: NavTarget;
}) {
  return (
    <NavLink
      target={target}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-ink/[0.035] data-[status=active]:bg-ink/[0.035]",
        FOCUS_RING,
      )}
    >
      {icon}
      <span className="shrink-0 text-sm font-semibold text-ink">{title}</span>
      {/* The meta gives way first: the destination's name never truncates. */}
      {meta && (
        <span className="ml-auto min-w-0 truncate pl-2 text-right text-xs text-muted-foreground">
          {meta}
        </span>
      )}
    </NavLink>
  );
}

function MoreLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-cta transition-colors hover:bg-cta-soft",
        FOCUS_RING,
        className,
      )}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </Link>
  );
}

function MenuFooter({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-t border-ink/[0.07] px-3 py-2.5",
        MENU_RAIL,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Features ---------- */

/** The rail's closing card: a sample read plus the way in. The sample carries
 *  the pitch, so the card needs no paragraph. */
function ScoreCard() {
  return (
    <div className="mt-auto hidden rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-inset ring-ink/[0.08] lg:block">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">Score your site</p>
        <span className="shrink-0 rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Sample
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="truncate text-muted-foreground">yoursite.com · GEO Score</span>
        <span className="shrink-0 font-semibold text-ink">87 · A</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
        <div className="h-full w-[87%] rounded-full bg-cta" />
      </div>
      <a
        href="/auth"
        className={cn(
          "group mt-3.5 flex items-center justify-center gap-1.5 rounded-lg bg-cta px-3 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover",
          FOCUS_RING,
        )}
      >
        Start free
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </a>
    </div>
  );
}

/** A rail row: the page's short name under its group's heading. The full
 *  name rides on the link for screen readers and on hover. */
function PersonaItem({ persona }: { persona: Persona }) {
  const Icon = persona.icon;
  return (
    <NavLink
      target={{ to: "/use-cases/$slug", params: { slug: persona.slug } }}
      aria-label={`Rankbox for ${persona.nameLower}`}
      title={persona.name}
      className={cn(
        "group flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-ink/[0.04] data-[status=active]:bg-ink/[0.04]",
        FOCUS_RING,
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-ink/70 ring-1 ring-inset ring-ink/[0.08] transition-colors group-hover:bg-cta-soft group-hover:text-cta group-hover:ring-cta/20 group-data-[status=active]:bg-cta-soft group-data-[status=active]:text-cta">
        <Icon className="h-3 w-3" />
      </span>
      <span className="truncate text-[0.8rem] font-semibold text-ink">{persona.shortName}</span>
    </NavLink>
  );
}

export function FeaturesMenu() {
  return (
    <>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid grid-cols-2 gap-x-2 p-3">
          {FEATURE_GROUPS.map((group) => (
            <div key={group}>
              <ColumnLabel>{group}</ColumnLabel>
              {FEATURES.filter((f) => f.group === group).map((f) => (
                <MenuItem
                  key={f.slug}
                  icon={f.icon}
                  title={f.name}
                  description={f.tagline}
                  target={{ to: "/features/$slug", params: { slug: f.slug } }}
                />
              ))}
            </div>
          ))}
        </div>
        <div
          className={cn(
            "flex flex-col gap-0.5 border-t border-ink/[0.07] p-3 lg:border-l lg:border-t-0",
            MENU_RAIL,
          )}
        >
          <ColumnLabel action={<LabelLink to="/use-cases">All use cases</LabelLink>}>
            Who it&rsquo;s for
          </ColumnLabel>
          {/* Two short columns, one per group, so six pages stay as tall as
              three did and the rail never outgrows the feature columns. */}
          <div className="mb-3 grid grid-cols-2 gap-x-0.5">
            {PERSONA_GROUPS.map((g) => (
              <div key={g.id} className="min-w-0">
                <p className="px-2 pb-1 pt-1.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/75">
                  {g.label}
                </p>
                {personasIn(g.id).map((p) => (
                  <PersonaItem key={p.slug} persona={p} />
                ))}
              </div>
            ))}
          </div>
          <ScoreCard />
        </div>
      </div>
      <MenuFooter>
        <Link
          to="/integrations"
          className={cn(
            "group flex min-w-0 items-center gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-ink/[0.04]",
            FOCUS_RING,
          )}
        >
          <span aria-hidden className="flex shrink-0 gap-1">
            {PUBLISH_PLATFORMS.map((p) => (
              <IntegrationLogo
                key={p.id}
                id={p.id}
                title={false}
                className="h-5 w-5 ring-ink/[0.08] transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none"
              />
            ))}
          </span>
          <span className="shrink-0 text-sm font-semibold text-ink">Integrations</span>
          <span className="hidden truncate text-xs text-muted-foreground lg:inline">
            Publish to {PUBLISH_PLATFORMS.map((p) => p.name).join(", ")}, or any site by API
          </span>
        </Link>
        <MoreLink to="/features" className="shrink-0">
          All features
        </MoreLink>
      </MenuFooter>
    </>
  );
}

/* ---------- Resources ---------- */

/** The engines beyond the frontier five, as one row of logo tiles. The label
 *  above names whichever tile is under the pointer, so the row never needs a
 *  tooltip to be read. */
function MoreEngines() {
  const [named, setNamed] = useState<Engine | null>(null);
  return (
    <div className="mt-1.5 px-2.5" onPointerLeave={() => setNamed(null)}>
      <p
        aria-hidden
        className={cn(
          "flex h-7 items-center truncate",
          named
            ? "text-xs font-semibold text-ink"
            : "text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/85",
        )}
      >
        {named ? `${named.shortName} SEO · ${named.vendor}` : TIERS.more.label}
      </p>
      <div className="grid grid-cols-6 gap-1.5">
        {enginesInTier("more").map((e) => {
          const Mark = ENGINE_MARKS[e.mark];
          return (
            <NavLink
              key={e.slug}
              target={{ to: "/ai-seo/$engine", params: { engine: e.slug } }}
              aria-label={`${e.shortName} SEO guide`}
              onPointerEnter={() => setNamed(e)}
              onFocus={() => setNamed(e)}
              className={cn(
                "group flex aspect-square items-center justify-center rounded-lg bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-inset ring-ink/[0.08] transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none",
                FOCUS_RING,
                "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              )}
            >
              <Mark className="h-4 w-4" />
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @param primed Set once someone first reaches for this menu. The competitor
 *   marks are fetched by domain, so they only start loading then, instead of
 *   on every page view by someone who never opens Resources.
 */
export function ResourcesMenu({ primed }: { primed: boolean }) {
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_17.5rem]">
        <div className="p-3">
          <ColumnLabel>Learn</ColumnLabel>
          {LEARN_LINKS.map((l) => (
            <MenuItem key={l.title} {...l} />
          ))}
        </div>
        <div className="p-3 pl-0">
          <ColumnLabel>Compare</ColumnLabel>
          {COMPARE_LINKS.map((l) => (
            <MenuItem key={l.title} {...l} />
          ))}
          <div className="mx-2.5 my-1.5 h-px bg-ink/[0.07]" />
          {NAV_COMPETITORS.map((c) => (
            <CompactItem
              key={c.slug}
              icon={
                primed ? (
                  <CompetitorMark competitor={c} className="h-6 w-6 text-[0.6rem]" />
                ) : (
                  <span aria-hidden className="h-6 w-6 shrink-0 rounded-[26%] bg-ink/[0.06]" />
                )
              }
              title={`vs ${c.name}`}
              target={{ to: "/alternatives/$slug", params: { slug: c.slug } }}
            />
          ))}
        </div>
        <div className={cn("flex flex-col border-l border-ink/[0.07] p-3", MENU_RAIL)}>
          <ColumnLabel action={<LabelLink to="/ai-seo">Compare all</LabelLink>}>
            AI SEO guides
          </ColumnLabel>
          {enginesInTier("frontier").map((e) => {
            const Mark = ENGINE_MARKS[e.mark];
            return (
              <CompactItem
                key={e.slug}
                icon={
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-inset ring-ink/[0.08] transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none">
                    <Mark className="h-3.5 w-3.5" />
                  </span>
                }
                title={`${e.shortName} SEO`}
                meta={e.vendor}
                target={{ to: "/ai-seo/$engine", params: { engine: e.slug } }}
              />
            );
          })}
          <MoreEngines />
        </div>
      </div>
      <MenuFooter>
        <div className="flex min-w-0 items-center gap-2 px-2.5">
          {/* Below lg the path alone fits, and reads without its heading. */}
          <span className="hidden shrink-0 text-xs font-semibold text-ink lg:inline">
            {NAV_TOOLKIT.title}
          </span>
          <span aria-hidden className="hidden text-ink/30 lg:inline">
            ·
          </span>
          <ol aria-label={NAV_TOOLKIT.title} className="flex min-w-0 items-center gap-1">
            {NAV_TOOLKIT_TOOLS.map((t, i) => {
              const Icon = TOOL_ICONS[t.icon];
              return (
                <li key={t.slug} className="flex min-w-0 items-center gap-1">
                  {i > 0 && <ArrowRight aria-hidden className="h-3 w-3 shrink-0 text-ink/30" />}
                  <Link
                    to="/tools/$slug"
                    params={{ slug: t.slug }}
                    title={t.name}
                    className={cn(
                      "flex min-w-0 items-center gap-1.5 rounded-md bg-white py-1 pl-1.5 pr-2.5 text-xs font-medium text-ink ring-1 ring-inset ring-ink/[0.1] transition-colors hover:bg-cta-soft hover:text-cta hover:ring-cta/20",
                      FOCUS_RING,
                    )}
                  >
                    <Icon aria-hidden className="h-3 w-3 shrink-0" />
                    <span className="truncate">{TOOL_CHIP_LABELS[t.slug] ?? t.name}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
        <MoreLink to="/tools" className="shrink-0">
          All {TOOLS.length} tools
        </MoreLink>
      </MenuFooter>
    </>
  );
}
