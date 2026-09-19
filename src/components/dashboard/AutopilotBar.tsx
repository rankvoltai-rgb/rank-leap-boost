import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  getSettings,
  updateAutopilot,
  TRIAL_DAYS,
  type Blog,
  type CreditAccount,
  type Subscription,
} from "@/lib/data";
import { Button, Panel } from "@/components/dashboard/primitives";
import { isOverdue } from "@/components/dashboard/article-stages";
import { engineState, type EngineState } from "@/components/dashboard/autopilot-state";
import {
  paceLabel,
  parseDateKey,
  planFromTomorrow,
  todayKey,
  type QueuePatch,
} from "@/components/dashboard/queue-plan";
import { cn } from "@/lib/utils";

/** "today", "tomorrow", "on Mon, Sep 21", or "was due Sep 6". */
function whenLabel(day: string | null): string {
  if (!day) return "soon";
  const today = todayKey();
  if (day < today) return `was due ${format(parseDateKey(day), "MMM d")}`;
  if (day === today) return "today";
  if (day === format(addDays(new Date(), 1), "yyyy-MM-dd")) return "tomorrow";
  return `on ${format(parseDateKey(day), "EEE, MMM d")}`;
}

const DOT: Record<EngineState, string> = {
  running: "bg-success",
  paused: "bg-muted-foreground/50",
  "needs-trial": "bg-brand-blue",
  "out-of-credits": "bg-destructive",
};

/**
 * The engine's status in one line — the thing an autopilot customer actually
 * wants to know: is it running, and what happens next? When it isn't running,
 * the one action that starts it again sits right here.
 */
export function AutopilotBar({
  articles,
  subscription,
  credits,
  remaining,
  onStartTrial,
  onUpgrade,
  onCommitQueue,
}: {
  articles: Blog[];
  subscription: Subscription | null | undefined;
  credits: CreditAccount | null | undefined;
  remaining: number;
  onStartTrial: () => void;
  onUpgrade: () => void;
  onCommitQueue: (patches: QueuePatch[], message: string) => Promise<void>;
}) {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const [busy, setBusy] = useState<"toggle" | "replan" | null>(null);

  const perWeek = settings?.weekly_cadence ?? 7;
  const queue = articles
    .filter((b) => b.status === "scheduled")
    .sort(
      (a, b) =>
        (a.queue_position ?? 1e9) - (b.queue_position ?? 1e9) ||
        (a.scheduled_date ?? "9999").localeCompare(b.scheduled_date ?? "9999"),
    );
  const next = queue[0] ?? null;
  const overdue = queue.filter(isOverdue).length;

  const state = engineState({
    subscription,
    remaining,
    enabled: settings?.autopilot_enabled !== false,
  });

  async function setEnabled(enabled: boolean, { quiet = false } = {}) {
    setBusy("toggle");
    try {
      await updateAutopilot({ autopilot_enabled: enabled });
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      if (quiet) return;
      if (enabled) toast.success("Autopilot is back on.");
      else
        toast.success("Autopilot paused.", {
          action: { label: "Undo", onClick: () => void setEnabled(true, { quiet: true }) },
        });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update autopilot.");
    } finally {
      setBusy(null);
    }
  }

  async function catchUp() {
    setBusy("replan");
    try {
      await onCommitQueue(
        planFromTomorrow(articles, perWeek),
        `Schedule re-planned from tomorrow, ${paceLabel(perWeek)}.`,
      );
    } finally {
      setBusy(null);
    }
  }

  if (isLoading || queue.length === 0) return null;

  const nextLine = next ? ` Next up: “${next.title}”, ${whenLabel(next.scheduled_date)}.` : "";
  const copy: Record<EngineState, { title: string; detail: string }> = {
    "needs-trial": {
      title: "Autopilot is ready when you are",
      detail: `${queue.length} ${queue.length === 1 ? "article is" : "articles are"} planned. Start your ${TRIAL_DAYS}-day free trial and it begins${next ? ` with “${next.title}”` : ""}.`,
    },
    "out-of-credits": {
      title: "Autopilot has used this month's articles",
      detail: `All ${credits?.credits_total ?? ""} are written. It picks up again when your plan renews — or upgrade to keep going now.`,
    },
    paused: {
      title: "Autopilot is paused",
      detail: "Nothing is written until you resume." + nextLine,
    },
    running: {
      title: "Autopilot is on",
      detail: `Writes ${paceLabel(perWeek)}.` + nextLine,
    },
  };

  // Overdue only needs its own fix once the engine can run; before that, the
  // fix is the trial or the upgrade.
  const canCatchUp = overdue > 0 && (state === "running" || state === "paused");

  return (
    <Panel className="flex flex-wrap items-start gap-x-4 gap-y-3 px-5 py-4">
      <span className="relative mt-[5px] flex h-2.5 w-2.5 shrink-0" aria-hidden>
        {state === "running" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:animate-none" />
        )}
        <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", DOT[state])} />
      </span>
      <div className="min-w-0 flex-1 basis-60" role="status">
        <p className="text-sm font-semibold text-ink">{copy[state].title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {copy[state].detail}
          {canCatchUp && (
            <span className="font-medium text-ink">
              {" "}
              {overdue} {overdue === 1 ? "article is" : "articles are"} overdue.
            </span>
          )}
        </p>
      </div>
      <div className="ml-[1.625rem] flex shrink-0 items-center gap-2 self-center sm:ml-0">
        {canCatchUp && (
          <Button
            variant="ghost"
            onClick={() => void catchUp()}
            disabled={busy !== null}
            title={`Keeps their order and lays them out from tomorrow, ${paceLabel(perWeek)}.`}
          >
            {busy === "replan" && <Loader2 className="h-4 w-4 animate-spin" />}
            Re-plan from tomorrow
          </Button>
        )}
        {state === "needs-trial" && (
          <Button variant="brand" onClick={onStartTrial}>
            Start free trial
          </Button>
        )}
        {state === "out-of-credits" && (
          <Button variant="brand" onClick={onUpgrade}>
            Upgrade
          </Button>
        )}
        {state === "paused" && (
          <Button variant="brand" onClick={() => void setEnabled(true)} disabled={busy !== null}>
            {busy === "toggle" && <Loader2 className="h-4 w-4 animate-spin" />}
            Resume
          </Button>
        )}
        {state === "running" && (
          <Button variant="ghost" onClick={() => void setEnabled(false)} disabled={busy !== null}>
            {busy === "toggle" && <Loader2 className="h-4 w-4 animate-spin" />}
            Pause
          </Button>
        )}
      </div>
    </Panel>
  );
}
