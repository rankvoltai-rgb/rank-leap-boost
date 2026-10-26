/**
 * The row of engine marks at the top of every AI SEO guide: the way between
 * guides. The engine you're reading opens out into a labelled soft-blue pill;
 * the others in its tier sit beside it as marks, and the other tier follows
 * after a hairline, smaller, so all eleven guides are one click away without
 * the row turning into a menu. On the hub, with nothing active, it's simply
 * every engine in order.
 *
 * Shared by every guide on purpose: it's navigation, like the navbar, and it
 * should behave the same on every page.
 */
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { enginesInTier, getEngine, type Engine, type EngineSlug } from "@/data/ai-seo/engines";
import { EngineMark } from "./kit";

function Tile({ engine, small = false }: { engine: Engine; small?: boolean }) {
  return (
    <li>
      <Link
        to="/ai-seo/$engine"
        params={{ engine: engine.slug }}
        aria-label={`${engine.name} SEO guide`}
        className={cn(
          "group relative flex items-center justify-center rounded-lg transition-colors hover:bg-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
          small ? "h-8 w-8" : "h-9 w-9",
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-md border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none",
            small ? "h-6 w-6" : "h-7 w-7",
          )}
        >
          <EngineMark mark={engine.mark} className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.7rem] font-medium text-ink opacity-0 shadow-[0_8px_24px_-12px_rgba(16,24,40,0.3)] transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          {engine.shortName}
        </span>
      </Link>
    </li>
  );
}

function Current({ engine }: { engine: Engine }) {
  return (
    <li>
      <span
        aria-current="page"
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-cta-soft py-1 pl-1 pr-3 text-[0.85rem] font-medium text-cta"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <EngineMark mark={engine.mark} className="h-4 w-4" />
        </span>
        {engine.shortName} SEO guide
      </span>
    </li>
  );
}

export function EngineRail({ active, className }: { active?: EngineSlug; className?: string }) {
  const current = active ? getEngine(active) : undefined;
  const tier = current?.tier ?? "frontier";
  const other = tier === "frontier" ? "more" : "frontier";
  return (
    <nav
      aria-label="SEO guides by answer engine"
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-ink/[0.08] bg-white/90 p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)] backdrop-blur",
        className,
      )}
    >
      <ul className="flex flex-wrap items-center gap-0.5">
        {enginesInTier(tier).map((e) =>
          e.slug === active ? (
            <Current key={e.slug} engine={e} />
          ) : (
            <Tile key={e.slug} engine={e} />
          ),
        )}
      </ul>
      <span aria-hidden className="mx-1 h-5 w-px bg-ink/[0.1]" />
      <ul className="flex flex-wrap items-center gap-0.5">
        {enginesInTier(other).map((e) => (
          <Tile key={e.slug} engine={e} small />
        ))}
      </ul>
    </nav>
  );
}
