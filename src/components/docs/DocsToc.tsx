import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { DocHeading } from "@/lib/docs/render";

/** The heading the reader is in: the last one scrolled past the top band. */
function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    if (!ids.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = 120;
      let current: string | null = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // At the very bottom the last sections can't reach the top band.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

export function DocsToc({ headings }: { headings: DocHeading[] }) {
  const [ids] = useState(() => headings.map((h) => h.id));
  const active = useActiveHeading(ids);
  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page">
      <p className="mb-3 text-[0.8rem] font-semibold text-ink">On this page</p>
      <ol className="border-l border-border">
        {headings.map((h) => {
          const on = active === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-[0.3rem] pr-2 text-[0.8rem] leading-snug transition-colors",
                  h.depth === 3 ? "pl-7" : "pl-4",
                  on
                    ? "border-cta font-semibold text-ink"
                    : "border-transparent text-muted-foreground hover:border-ink/20 hover:text-ink",
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
