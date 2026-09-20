/**
 * Step 3 — Content plan.
 *
 * Turns the Step 2 keywords into content-gap articles — one per keyword,
 * covering what the site doesn't answer yet — in publishing order. The list is
 * split the way confirming splits it: the first few land on the dashboard as
 * ideas, the rest go into the autopilot queue a day apart. The projected
 * traffic they earn is totalled in the rail (TrafficProjection), labelled as
 * modeled.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarClock, LayoutDashboard, Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { planArticles, type ContentPlanInput, type DraftTitle } from "@/lib/data";
import { DASHBOARD_IDEAS } from "@/lib/site-meta";
import { reducedMotion } from "./constants";
import { ActionBar, PRIMARY_BUTTON, StepHeader } from "./shell";

function Group({
  icon: Icon,
  title,
  note,
  children,
}: {
  icon: LucideIcon;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-1">
      <header className="flex items-center gap-3 border-b border-border bg-surface/60 px-4 py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-card text-brand-blue ring-1 ring-border">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          <p className="truncate text-xs text-muted-foreground">{note}</p>
        </div>
      </header>
      <ol className="divide-y divide-border/70">{children}</ol>
    </section>
  );
}

function ArticleRow({ t, when }: { t: DraftTitle; when: string }) {
  return (
    <li className="flex items-start gap-3.5 px-4 py-3.5">
      <span className="mt-0.5 w-12 shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
        {when}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.92rem] font-medium leading-snug text-ink">{t.title}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{t.keyword}</p>
      </div>
      <span className="mt-0.5 shrink-0 text-right">
        <span className="block text-sm font-semibold tabular-nums text-ink">
          +{t.traffic_estimate.toLocaleString()}
        </span>
        <span className="block text-[0.65rem] text-muted-foreground">visits/mo</span>
      </span>
    </li>
  );
}

function Building() {
  return (
    <div aria-live="polite">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-1">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-blue" />
        <p className="text-sm text-ink">
          Finding your content gaps and drafting an article for each keyword…
        </p>
      </div>
      <div
        aria-hidden
        className="mt-4 overflow-hidden rounded-2xl border border-border/70 bg-card opacity-70"
      >
        {[78, 64, 84, 58, 70, 62].map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border/60 px-4 py-4 last:border-0"
          >
            <span className="h-2.5 w-10 rounded-full bg-shimmer" />
            <span className="h-3 rounded-full bg-shimmer" style={{ width: `${w * 0.7}%` }} />
            <span className="ml-auto h-3 w-10 rounded-full bg-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Part3Forecast({
  plan,
  titles,
  onTitles,
  onConfirm,
  onBack,
  confirming,
}: {
  plan: ContentPlanInput;
  titles: DraftTitle[];
  onTitles: (t: DraftTitle[]) => void;
  onConfirm: () => void;
  onBack: () => void;
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

  const ideas = titles.slice(0, DASHBOARD_IDEAS);
  const queue = titles.slice(DASHBOARD_IDEAS);

  return (
    <div>
      <StepHeader
        n={3}
        title={status === "ready" ? "Your first month of content" : "Building your content plan"}
        subtitle="One article per keyword, filling the gaps your site doesn't answer yet, in the order we'll publish them."
      />

      {status === "building" && <Building />}

      {status === "failed" && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-1">
          <p className="text-sm text-ink">We couldn't build your content plan.</p>
          <button
            type="button"
            onClick={() => void build()}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-ink transition-colors hover:bg-secondary"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
        </div>
      )}

      {status === "ready" && (
        <motion.div
          initial={reducedMotion() ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {ideas.length > 0 && (
            <Group
              icon={LayoutDashboard}
              title="Ready on your dashboard"
              note={`${ideas.length} ideas to write first, whenever you like`}
            >
              {ideas.map((t) => (
                <ArticleRow key={t.id} t={t} when="Idea" />
              ))}
            </Group>
          )}
          {queue.length > 0 && (
            <Group
              icon={CalendarClock}
              title="Autopilot queue"
              note={`${queue.length} articles, published one a day once your trial starts`}
            >
              {queue.map((t, i) => (
                <ArticleRow key={t.id} t={t} when={`Day ${i + 1}`} />
              ))}
            </Group>
          )}
        </motion.div>
      )}

      <ActionBar
        onBack={onBack}
        note={
          <span className="hidden sm:inline">
            Nothing publishes until you start your trial. Edit or remove any article later.
          </span>
        }
      >
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirming || status !== "ready" || titles.length === 0}
          className={PRIMARY_BUTTON}
        >
          {confirming && <Loader2 className="h-4 w-4 animate-spin" />}
          {confirming ? "Setting up…" : "Confirm plan"}
          {!confirming && <ArrowRight className="h-4 w-4" />}
        </button>
      </ActionBar>
    </div>
  );
}
