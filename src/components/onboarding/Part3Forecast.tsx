/**
 * Step 3 — Content plan.
 *
 * Turns the Step 2 keywords into content-gap articles — one per keyword,
 * covering what the site doesn't answer yet — in publishing order. Each row
 * says where confirming sends it: the first few become dashboard ideas, the
 * rest go into the autopilot queue a day apart. The projected traffic they
 * earn is shown in the right column (TrafficProjection), labelled as modeled.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { planArticles, type ContentPlanInput, type DraftTitle } from "@/lib/data";
import { DASHBOARD_IDEAS } from "@/lib/site-meta";
import { reducedMotion } from "./constants";

function destination(index: number): string {
  return index < DASHBOARD_IDEAS
    ? "Dashboard idea"
    : `Autopilot · day ${index - DASHBOARD_IDEAS + 1}`;
}

export function Part3Forecast({
  plan,
  titles,
  onTitles,
  onConfirm,
  confirming,
}: {
  plan: ContentPlanInput;
  titles: DraftTitle[];
  onTitles: (t: DraftTitle[]) => void;
  onConfirm: () => void;
  confirming: boolean;
}) {
  const [status, setStatus] = useState<"building" | "ready" | "failed">(
    titles.length ? "ready" : "building",
  );
  const started = useRef(false);
  // See the note in Part2Analysis: the mount/unmount/remount cycle would leave
  // a per-effect cancelled flag set while the ref-guarded fetch runs only once.
  const alive = useRef(true);

  async function build() {
    setStatus("building");
    try {
      const planned = await planArticles(plan);
      if (!alive.current) return;
      onTitles(planned);
      setStatus("ready");
    } catch {
      if (alive.current) setStatus("failed");
    }
  }

  useEffect(() => {
    alive.current = true;
    if (titles.length > 0 || started.current) return;
    started.current = true;
    void build();
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "building") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3.5">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-blue" />
        <p className="text-sm text-ink">
          Finding your content gaps and drafting an article for each keyword…
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3.5">
        <p className="text-sm text-ink">We couldn't build your content plan.</p>
        <button
          type="button"
          onClick={() => void build()}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-ink transition-colors hover:bg-secondary"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={reducedMotion() ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-1">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/30 px-4 py-2.5">
          <p className="text-sm font-semibold text-ink">{titles.length} articles</p>
          <p className="text-xs text-muted-foreground">Est. monthly visits</p>
        </div>
        <ol className="max-h-[30rem] divide-y divide-border overflow-y-auto">
          {titles.map((t, i) => (
            <li key={t.id} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-0.5 w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-ink">{t.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {t.keyword} · {destination(i)}
                </p>
              </div>
              <span className="mt-0.5 shrink-0 text-xs font-semibold tabular-nums text-ink">
                +{t.traffic_estimate.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-x-5 gap-y-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {["Nothing publishes until you start your trial", "Edit or remove any article later"].map(
            (line) => (
              <li key={line} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3 w-3 shrink-0 text-success" />
                {line}
              </li>
            ),
          )}
        </ul>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirming || titles.length === 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 text-sm font-semibold text-white shadow-2 transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 disabled:translate-y-0 disabled:opacity-60"
        >
          {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {confirming ? "Setting up…" : "Confirm and open dashboard"}
          {!confirming && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
}
