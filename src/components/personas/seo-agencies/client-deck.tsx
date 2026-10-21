/**
 * The agency page's focal scene: a book of client sites, one account. The
 * Studio rail down the left holds every client; the deck beside it brings
 * each one forward in turn, written in that client's own voice, with its
 * month's articles and the editor's sign-off switch.
 *
 * Rebuilt from the old hero scene (personas/hero-scenes.tsx, ClientDeckScene)
 * in the landing's language: white cards on hairlines, soft blue for
 * whatever is selected, one calm step at a time.
 *
 * The clients are placeholders, not businesses: a niche and a numbered
 * domain ("client-one.com"), so no real company stands in as a customer.
 * Counts are the plan's own allowance (PLAN.articlesPerMonth), never a
 * result. It runs only while at least half of it is on screen, starts over
 * when it leaves, and with reduced motion holds one telling frame: the first
 * client's draft just published.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Layers, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN, STUDIO } from "@/data/pricing";
import { CLIENTS, TINTS, useHalfOnScreen, type Client } from "./clients";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Two steps per client: it comes forward, then its draft in review publishes. */
const STEPS = CLIENTS.length * 2;
const STEP_MS = 1900;
/* The still frame: the first client, its draft just published. */
const REST = 1;

function useDeckStep(run: boolean, reduce: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduce) {
      setT(REST);
      return;
    }
    if (!run) {
      setT(0);
      return;
    }
    const id = window.setInterval(() => setT((n) => (n + 1) % STEPS), STEP_MS);
    return () => window.clearInterval(id);
  }, [run, reduce]);
  return t;
}

/* ---------- Parts ---------- */

export function ClientTile({ client, className }: { client: Client; className?: string }) {
  const tint = TINTS[client.tint];
  const Icon = client.icon;
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-lg", className)}
      style={{ background: tint.tile, color: tint.ink }}
    >
      <Icon className="h-[46%] w-[46%]" />
    </span>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

/** A settings switch, blue when on. */
export function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-500",
        on ? "bg-cta" : "bg-ink/[0.1]",
      )}
    >
      <span
        className={cn(
          "absolute h-3 w-3 rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.2)] transition-transform duration-500",
          on ? "translate-x-3.5" : "translate-x-0.5",
        )}
      />
    </span>
  );
}

type Status = "Published" | "In review" | "Scheduled";

const STATUS_STYLE: Record<Status, string> = {
  Published: "bg-[#e9f6ee] text-success",
  "In review": "bg-ink/[0.05] text-muted-foreground",
  Scheduled: "bg-cta-soft text-cta",
};

export function StatusChip({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
        STATUS_STYLE[status],
      )}
    >
      {status === "Published" ? (
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {status}
    </span>
  );
}

/* Which plan line a site sits on, as the Studio page labels it. */
function siteBadge(index: number) {
  if (!STUDIO.live) return null;
  return index === 0 ? "On your plan" : STUDIO.name;
}

function ClientCard({
  client,
  index,
  fresh,
  reduce,
}: {
  client: Client;
  index: number;
  fresh: boolean;
  reduce: boolean;
}) {
  const count = client.published + (fresh ? 1 : 0);
  const badge = siteBadge(index);
  return (
    <div className="flex h-full flex-col rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.28)] sm:p-5">
      <div className="flex items-center gap-3">
        <ClientTile client={client} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.86rem] font-semibold text-ink">{client.niche}</p>
          <p className="truncate font-mono text-[0.66rem] text-muted-foreground">{client.domain}</p>
        </div>
        {badge && (
          <span
            className={cn(
              "hidden shrink-0 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold min-[400px]:inline",
              index === 0 ? "bg-ink/[0.05] text-ink/70" : "bg-cta-soft text-cta",
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            In their voice
          </span>
          <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
            {client.voice}
          </span>
        </div>
        <p className="mt-1.5 text-[0.8rem] leading-snug text-ink">&ldquo;{client.line}&rdquo;</p>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-[0.7rem]">
          <span className="text-muted-foreground">Articles this cycle</span>
          <span className="font-semibold tabular-nums text-ink">
            {count} / {PLAN.articlesPerMonth}
          </span>
        </div>
        <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
          <span
            className={cn(
              "block h-full rounded-full bg-cta",
              !reduce && "transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            )}
            style={{ width: `${(count / PLAN.articlesPerMonth) * 100}%` }}
          />
        </span>
      </div>

      <div className="mt-4 space-y-1.5">
        {client.articles.map((a, i) => {
          const status: Status =
            i === 2 ? "Scheduled" : i === 1 || fresh ? "Published" : "In review";
          const flipped = i === 0 && fresh;
          return (
            <div
              key={a}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 transition-colors duration-500",
                flipped ? "border-success/25 bg-[#f3faf5]" : "border-ink/[0.07] bg-white",
                i === 2 && "hidden min-[400px]:flex",
              )}
            >
              <span className="min-w-0 truncate text-[0.72rem] font-medium text-ink">{a}</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={status}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex"
                >
                  <StatusChip status={status} />
                </motion.span>
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/[0.07] pt-3">
        <span className="text-[0.68rem] text-muted-foreground">
          Hold for your editor&rsquo;s sign-off
        </span>
        <Switch on />
      </div>
    </div>
  );
}

/* Where each card sits for its depth behind the front one. The card that
   just left drops away before rejoining at the back; cards behind stay
   opaque, so no card's text shows through the one in front. */
function depthPose(d: number, last: number) {
  if (d === 0) return { y: 0, scale: 1, rotate: 0, opacity: 1 };
  if (d <= 2) return { y: -d * 13, scale: 1 - d * 0.045, rotate: 0, opacity: 1 };
  if (d === last) return { y: 26, scale: 0.98, rotate: -2.5, opacity: 0 };
  return { y: -38, scale: 0.86, rotate: 0, opacity: 0 };
}

/* ---------- The scene ---------- */

export function ClientDeck({ className }: { className?: string }) {
  const [ref, on] = useHalfOnScreen<HTMLDivElement>();
  const reduce = useReducedMotion() ?? false;
  const t = useDeckStep(on, reduce);
  const active = Math.floor(t / 2) % CLIENTS.length;
  const fresh = t % 2 === 1;
  const last = CLIENTS.length - 1;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Sample: one agency account holding ${CLIENTS.length} client sites. Each comes forward in turn with its own brand voice, this cycle's articles, and the switch that holds drafts for the editor's sign-off.`}
      className={cn("relative h-[26.5rem] w-full sm:h-[28.5rem]", className)}
    >
      {/* The account's sites, as the Studio rail lists them. */}
      <div className="absolute left-0 top-12 flex w-12 flex-col items-center gap-2 rounded-xl border border-ink/[0.08] bg-white px-1.5 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_12px_28px_-16px_rgba(16,24,40,0.22)] sm:w-14 sm:px-2 sm:py-3">
        <span className="text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {STUDIO.live ? STUDIO.name : "Sites"}
        </span>
        {CLIENTS.map((c, i) => (
          <span
            key={c.domain}
            className={cn(
              "rounded-[0.6rem] p-0.5 transition-[box-shadow,opacity] duration-500",
              i === active
                ? "opacity-100 shadow-[0_0_0_2px_var(--cta)]"
                : "opacity-60 shadow-[0_0_0_1px_rgba(16,24,40,0.06)]",
            )}
          >
            <ClientTile client={c} className="h-7 w-7 sm:h-8 sm:w-8" />
          </span>
        ))}
        {STUDIO.live && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-ink/[0.18] text-muted-foreground sm:h-8 sm:w-8">
            <Plus className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      {/* The deck. */}
      <div className="absolute bottom-0 left-[3.75rem] right-0 top-14 sm:left-[4.5rem]">
        {CLIENTS.map((c, i) => {
          const d = (i - active + CLIENTS.length) % CLIENTS.length;
          return (
            <motion.div
              key={c.domain}
              className="absolute inset-0 origin-top"
              initial={false}
              animate={depthPose(d, last)}
              transition={reduce ? { duration: 0 } : { duration: 0.75, ease: EASE }}
              style={{ zIndex: CLIENTS.length - d }}
              aria-hidden
            >
              <ClientCard client={c} index={i} fresh={d === 0 && fresh} reduce={reduce} />
            </motion.div>
          );
        })}
      </div>

      {/* The account line: how many sites, on how many invoices. */}
      <div className="absolute right-0 top-0 z-10 flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1.5 pl-2 pr-1.5 text-[0.7rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05),0_10px_24px_-14px_rgba(16,24,40,0.25)]">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft text-cta">
          <Layers className="h-3 w-3" />
        </span>
        {STUDIO.live ? `${CLIENTS.length} client sites · one invoice` : "One plan per client site"}
        <SampleTag />
      </div>
    </div>
  );
}
