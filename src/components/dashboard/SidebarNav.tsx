/**
 * The dashboard navigation list, shared by the fixed sidebar and the mobile
 * drawer so both stay identical.
 *
 * Items are grouped under quiet section labels, and the current one is marked
 * by a filled pill plus an accent bar on its leading edge — the eye finds the
 * bar before it reads the label.
 */
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, type NavItem } from "./nav";

export function NavLink({
  item,
  active,
  collapsed,
  badge,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed?: boolean;
  /** A live count, e.g. how many articles are queued. Hidden when zero. */
  badge?: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      title={collapsed ? item.title : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center rounded-lg text-sm font-medium transition-colors",
        collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
        active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
      )}
    >
      {active && (
        // Sits on the rail's own edge, outside the pill's padding, the way the
        // eye scans for "you are here".
        <span
          aria-hidden
          className={cn(
            // White, not the volt accent: volt is itself a blue in this theme
            // and vanishes against the rail.
            "absolute inset-y-1.5 w-[3px] rounded-r bg-white",
            collapsed ? "-left-2" : "-left-3",
          )}
        />
      )}
      <item.icon className={cn("h-[1.05rem] w-[1.05rem] shrink-0", !active && "opacity-80")} />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.title}</span>}
      {!collapsed && badge ? (
        <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[0.7rem] font-semibold tabular-nums text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function NavSections({
  isActive,
  collapsed,
  queued,
  onNavigate,
}: {
  isActive: (item: NavItem) => boolean;
  collapsed?: boolean;
  /** Articles waiting in the autopilot queue. */
  queued?: number;
  onNavigate?: () => void;
}) {
  return (
    <div className={cn("space-y-5", collapsed ? "px-2" : "px-3")}>
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          {collapsed ? (
            <div className="mx-2 mb-2 border-t border-white/15" aria-hidden />
          ) : (
            <p className="px-3 pb-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/50">
              {section.label}
            </p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <NavLink
                key={item.title}
                item={item}
                active={isActive(item)}
                collapsed={collapsed}
                badge={item.showsQueueCount ? queued : undefined}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
