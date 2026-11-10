/**
 * The hub's one picture: Rankbox in the middle with its two jobs either side.
 * To the left, the sites it publishes to (articles go out); to the right, the
 * AI tools its research runs inside (answers go back). A dot runs each line
 * while the picture is at least half on screen, so the two directions read
 * without a caption. Still under reduced motion, and in the server HTML.
 *
 * The marks are the real connector logos; the rows are the connectors
 * themselves, so a name here is always a page that exists.
 */
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Mark } from "@/components/brand/Mark";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import { getConnector, type Connector } from "@/data/connectors";
import { publicSlug } from "@/data/ai-integrations";
import { cn } from "@/lib/utils";

const pick = (ids: string[]) =>
  ids.map((id) => getConnector(id)).filter((c): c is Connector => c !== undefined);

const OUT = pick(["wordpress", "shopify", "webflow", "framer", "api"]);
const IN = pick(["claude", "chatgpt", "cursor", "lovable", "n8n"]);

function Chip({ c, align }: { c: Connector; align: "left" | "right" }) {
  return (
    <Link
      to="/integrations/$slug"
      params={{ slug: publicSlug(c) }}
      className={cn(
        "group flex h-9 min-w-0 items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-1.5 text-[0.78rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors hover:border-cta/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
        align === "right" ? "flex-row-reverse pl-2.5 text-right" : "pr-2.5",
      )}
    >
      <ConnectorLogo connector={c} className="h-6 w-6 shrink-0" />
      <span className="truncate">{c.id === "api" ? "Any site (API)" : c.name}</span>
    </Link>
  );
}

/** A hairline from a chip to the hub, with a dot running toward `toward`. */
function Wire({
  toward,
  running,
  delay,
}: {
  toward: "left" | "right";
  running: boolean;
  delay: number;
}) {
  return (
    <span aria-hidden className="relative block h-px flex-1 bg-ink/[0.12]">
      {running && (
        <motion.span
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-cta"
          initial={{ left: toward === "left" ? "100%" : "0%", opacity: 0 }}
          animate={{
            left: toward === "left" ? ["100%", "0%"] : ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.6,
            delay,
            repeat: Infinity,
            repeatDelay: 1.4,
            ease: "easeInOut",
          }}
        />
      )}
    </span>
  );
}

function Lane({
  items,
  side,
  label,
  running,
}: {
  items: Connector[];
  side: "left" | "right";
  label: string;
  running: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={cn(
          "mb-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
          side === "right" && "text-right",
        )}
      >
        {label}
      </p>
      <ul
        className={cn(
          "relative space-y-2",
          // The bus: one vertical hairline every wire joins, at the hub's edge.
          side === "left"
            ? "after:absolute after:inset-y-4 after:right-0 after:w-px after:bg-ink/[0.12]"
            : "after:absolute after:inset-y-4 after:left-0 after:w-px after:bg-ink/[0.12]",
        )}
      >
        {items.map((c, i) => (
          <li
            key={c.id}
            className={cn("flex items-center", side === "right" && "flex-row-reverse")}
          >
            <div className="w-[8.25rem] shrink-0 sm:w-[8.75rem]">
              <Chip c={c} align={side} />
            </div>
            {/* Articles leave the hub for sites; research leaves it for tools. */}
            <Wire toward={side === "left" ? "left" : "right"} running={running} delay={i * 0.35} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Switchboard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const running = inView && !reduce;

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {/* Wide: lane · hub · lane. Narrow: hub, then the lanes as plain chips. */}
      <div className="hidden items-center gap-0 sm:grid sm:grid-cols-[minmax(0,1fr)_7.5rem_minmax(0,1fr)]">
        <Lane items={OUT} side="left" label="Articles out" running={running} />
        <Hub />
        <Lane items={IN} side="right" label="Research in" running={running} />
      </div>

      <div className="sm:hidden">
        <Hub />
        <div className="mt-5 grid grid-cols-2 gap-4">
          {[
            { label: "Articles out", items: OUT },
            { label: "Research in", items: IN },
          ].map((col) => (
            <div key={col.label} className="min-w-0">
              <p className="mb-2 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {col.label}
              </p>
              <ul className="space-y-2">
                {col.items.map((c) => (
                  <li key={c.id}>
                    <Chip c={c} align="left" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hub() {
  return (
    <div className="mx-auto flex w-[7.5rem] flex-col items-center rounded-2xl border border-ink/[0.08] bg-white px-3 py-4 text-center shadow-[0_1px_2px_rgba(16,24,40,0.05),0_20px_44px_-24px_rgba(16,24,40,0.4)]">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cta-soft">
        <Mark className="h-6 w-6 text-brand-blue" />
      </span>
      <span className="mt-2 text-[0.82rem] font-semibold text-ink">Rankbox</span>
      <span className="mt-0.5 text-[0.62rem] leading-tight text-muted-foreground">
        One key per site, one URL for AI tools
      </span>
    </div>
  );
}
