import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SubNavLink {
  id: string;
  label: string;
}

/**
 * The page's own navigation, pinned under the site navbar once the hero is
 * behind you: where you are on a long page, a jump to any section, and the
 * one action, always a thumb away. It sits in the flow right after the hero,
 * so it needs no show/hide logic; position: sticky does the rest.
 *
 * Sections it links to carry `scroll-mt-28` so they land below both bars.
 */
export function SubNav({
  title,
  mark,
  links,
  cta = { href: "/auth", label: "Get started free" },
}: {
  title: string;
  mark: ReactNode;
  links: SubNavLink[];
  cta?: { href: string; label: string };
}) {
  const active = useActiveSection(links.map((l) => l.id));
  return (
    <nav
      aria-label={`${title} sections`}
      className="sticky top-16 z-40 border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75"
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-4 px-5">
        <a
          href="#top"
          className="hidden shrink-0 items-center gap-2.5 text-sm font-semibold text-ink md:flex"
        >
          <span aria-hidden className="flex">
            {mark}
          </span>
          {title}
        </a>
        <ul className="-mx-2 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-2 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
          {links.map((l) => (
            <li key={l.id} className="shrink-0">
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "location" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active === l.id
                    ? "bg-cta-soft text-cta"
                    : "text-muted-foreground hover:bg-secondary hover:text-ink",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={cta.href}
          className="hidden shrink-0 items-center rounded-lg bg-cta px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover sm:inline-flex"
        >
          {cta.label}
        </a>
      </div>
    </nav>
  );
}

/** The section being read: the last one whose top has passed just under the bars. */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    const list = key.split(",");
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);
  return active;
}
