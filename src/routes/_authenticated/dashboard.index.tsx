import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  CheckIcon,
  AddIcon,
  TrendIcon,
  VoltMark,
  RemoveIcon,
  PublishIcon,
  RocketIcon,
  AutopilotIcon,
  ArticleIcon,
  ChartIcon,
  TargetIcon,
  FlameIcon,
  CardIcon,
} from "@/components/dashboard/icons";
import {
  listBlogs,
  getCredits,
  getSettings,
  addOpportunityToQueue,
  updateAutopilot,
  generateBlogArticle,
  prioritizeBlog,
  deleteBlog,
  getSubscription,
  creditsRemaining,
  CreditsExhaustedError,
  type Blog,
} from "@/lib/api";
import {
  Panel,
  StatCard,
  MetricStat,
  Pill,
  Button,
  PageHeader,
} from "@/components/dashboard/primitives";
import { MeterBar, DifficultyBar } from "@/components/dashboard/signals";
import { DataTable, Tr, Td, TdActions, type Column } from "@/components/dashboard/data-table";
import { AI_ALGORITHM_MARKS } from "@/components/landing/ai-logos";
import { Confetti } from "@/components/dashboard/rewards";
import { CreditPaywallDialog } from "@/components/dashboard/CreditPaywallDialog";
import { Switch } from "@/components/ui/switch";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: SystemConsole,
});

const CADENCE_OPTIONS = [1, 3, 5, 7];
const MONTHLY_GOAL = 30; // articles per month target

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function AlgorithmLogos() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {AI_ALGORITHM_MARKS.map(({ name, Mark }) => (
        <span
          key={name}
          title={name}
          aria-label={name}
          className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card"
        >
          <Mark className="h-5 w-5" />
        </span>
      ))}
    </div>
  );
}

function RadarRow({ opp, action }: { opp: Blog; action?: React.ReactNode }) {
  return (
    <Panel hover className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 sm:p-5">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-ink">{opp.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Pill tone="neutral">{opp.keyword}</Pill>
          <Pill tone="success">
            <TrendIcon className="h-3 w-3" />
            {opp.traffic_estimate.toLocaleString()}/mo
          </Pill>
          <AiSignalFlames signal={opp.ai_signal ?? 0} />
          <Pill tone="neutral">{opp.competition ?? "—"} comp.</Pill>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </Panel>
  );
}

function RadarSection({
  label,
  count,
  empty,
  children,
}: {
  label: string;
  count: number;
  empty: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</h3>
        <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <Panel className="p-6 text-center text-sm text-muted-foreground">{empty}</Panel>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </section>
  );
}

/** Consecutive-day publishing streak based on finished-article dates. */
function computeStreak(finished: Blog[]): number {
  const days = new Set(finished.map((b) => (b.updated_at ?? b.created_at).slice(0, 10)));
  if (days.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  // Allow the streak to start from today or yesterday.
  if (!days.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function SystemConsole() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [savingAutopilot, setSavingAutopilot] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const prevFinished = useRef<number | null>(null);
  const armed = useRef(false);

  // Only start celebrating after the page has settled, so initial data
  // loading never triggers a false "published" celebration.
  useEffect(() => {
    const id = setTimeout(() => {
      armed.current = true;
    }, 3500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast.success("You're all set — autopilot is live and your trial is active! 🚀");
      setConfettiKey((k) => k + 1);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const { data: allBlogs = [] } = useQuery({ queryKey: ["blogs", "all"], queryFn: () => listBlogs() });
  const { data: opportunities = [] } = useQuery({
    queryKey: ["blogs", "opportunity"],
    queryFn: () => listBlogs("opportunity"),
  });
  const { data: scheduled = [] } = useQuery({
    queryKey: ["blogs", "scheduled"],
    queryFn: () => listBlogs("scheduled"),
  });
  const { data: generating = [] } = useQuery({
    queryKey: ["blogs", "generating"],
    queryFn: () => listBlogs("generating"),
  });
  const finishedQuery = useQuery({
    queryKey: ["blogs", "finished"],
    queryFn: () => listBlogs("finished"),
  });
  const finished = finishedQuery.data ?? [];
  const { data: credits } = useQuery({ queryKey: ["credits"], queryFn: getCredits });
  const { data: firstName = "" } = useQuery({
    queryKey: ["auth", "first-name"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      const full = (data.user?.user_metadata?.full_name as string | undefined) ?? "";
      return full.trim().split(/\s+/)[0] ?? "";
    },
  });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const [paywallOpen, setPaywallOpen] = useState(false);

  const autopilotOn = settings?.autopilot_enabled ?? true;
  const cadence = settings?.weekly_cadence ?? 7;

  const estimatedTraffic = allBlogs.reduce((sum, b) => sum + (b.traffic_estimate ?? 0), 0);
  const queue = [...generating, ...scheduled];
  const streak = computeStreak(finished);
  const remainingCredits = credits ? creditsRemaining(credits) : null;
  const outOfCredits = remainingCredits !== null && remainingCredits <= 0;

  // Celebrate every new published article during the session.
  useEffect(() => {
    if (!finishedQuery.isSuccess) return;
    if (!armed.current || prevFinished.current === null) {
      prevFinished.current = finished.length;
      return;
    }
    if (finished.length > prevFinished.current) {
      setConfettiKey((k) => k + 1);
      const total = finished.length;
      if (total === 1) toast.success("🎉 Your first article is live!");
      else if (total % 10 === 0) toast.success(`🎉 ${total} articles published — you're on fire!`);
      else toast.success("✅ A new article just published.");
    }
    prevFinished.current = finished.length;
  }, [finishedQuery.isSuccess, finished.length]);

  const nextScheduled = [...scheduled]
    .filter((b) => b.scheduled_date)
    .sort((a, b) => (a.scheduled_date! < b.scheduled_date! ? -1 : 1))[0];
  const writing = generating[0];
  const lastPublished = [...finished].sort((a, b) =>
    (a.updated_at ?? a.created_at) > (b.updated_at ?? b.created_at) ? -1 : 1,
  )[0];

  async function setAutopilot(enabled: boolean) {
    setSavingAutopilot(true);
    try {
      await updateAutopilot({ autopilot_enabled: enabled });
      queryClient.setQueryData(["settings"], (s: typeof settings) => (s ? { ...s, autopilot_enabled: enabled } : s));
      toast.success(enabled ? "Autopilot resumed." : "Autopilot paused — you're in manual control.");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update autopilot.");
    } finally {
      setSavingAutopilot(false);
    }
  }

  async function setCadence(value: number) {
    try {
      await updateAutopilot({ weekly_cadence: value });
      queryClient.setQueryData(["settings"], (s: typeof settings) => (s ? { ...s, weekly_cadence: value } : s));
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update cadence.");
    }
  }

  async function addToQueue(opp: Blog) {
    setBusyId(opp.id);
    try {
      const gained = await addOpportunityToQueue(opp);
      toast.success(`Added to queue · +${gained.toLocaleString()} est. traffic`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add to queue.");
    } finally {
      setBusyId(null);
    }
  }

  async function generateNow(blog: Blog) {
    if (outOfCredits) {
      setPaywallOpen(true);
      return;
    }
    setBusyId(blog.id);
    try {
      await generateBlogArticle(blog);
      toast.success(`"${blog.title}" is ready.`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      navigate({ to: "/dashboard/editor/$blogId", params: { blogId: blog.id } });
    } catch (err) {
      if (err instanceof CreditsExhaustedError) {
        setPaywallOpen(true);
        return;
      }
      toast.error(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function prioritize(blog: Blog) {
    setBusyId(blog.id);
    try {
      await prioritizeBlog(blog.id);
      toast.success(`"${blog.title}" moved to the top.`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not prioritize.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(blog: Blog) {
    setBusyId(blog.id);
    try {
      await deleteBlog(blog.id);
      toast.success("Removed from queue.");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Confetti fireKey={confettiKey} />
      <CreditPaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        credits={credits}
        subscription={subscription}
      />
      <PageHeader
        title={`${timeGreeting()}${firstName ? `, ${firstName}` : ""}`}
        description={
          finished.length > 0
            ? `Your articles are ready — ${finished.length} published and working for you.`
            : "Your autopilot engine is building your traffic — sit back and watch it grow."
        }
      />

      {outOfCredits && (
        <Panel className="flex flex-wrap items-center justify-between gap-3 border-destructive/30 bg-destructive/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <RocketIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">You're out of article credits</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                You've used all 30 articles this month. Upgrade to keep publishing today.
              </p>
            </div>
          </div>
          <Button onClick={() => setPaywallOpen(true)}>
            <RocketIcon className="h-4 w-4" /> Upgrade
          </Button>
        </Panel>
      )}

      {/* Autopilot control */}
      <Panel className="relative overflow-hidden p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <span
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
                autopilotOn ? "bg-volt/10 text-volt" : "bg-secondary text-muted-foreground",
              )}
            >
              <RocketIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-ink">Autopilot</h2>
                <Pill tone={autopilotOn ? "success" : "neutral"}>
                  {autopilotOn ? "Active" : "Paused"}
                </Pill>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {autopilotOn
                  ? `Writing & publishing ${cadence} ${cadence === 1 ? "article" : "articles"} per week — fully hands-off.`
                  : "Paused. You're in manual control — turn it back on to resume automatic publishing."}
              </p>
              {autopilotOn && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-xs font-medium text-muted-foreground">Per week:</span>
                  {CADENCE_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCadence(n)}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
                        cadence === n
                          ? "border-volt bg-volt/10 text-volt"
                          : "border-border bg-card text-muted-foreground hover:text-ink",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <span className="text-sm font-medium text-ink">{autopilotOn ? "On" : "Off"}</span>
            <Switch checked={autopilotOn} disabled={savingAutopilot} onCheckedChange={setAutopilot} />
          </div>
        </div>

        {/* Live status strip */}
        <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
          <StatusItem
            icon={<Loader2 className={cn("h-4 w-4", writing ? "animate-spin text-volt" : "text-muted-foreground")} />}
            label="Writing now"
            value={writing ? writing.title : "Idle"}
          />
          <StatusItem
            icon={<VoltMark className="h-4 w-4 text-info" />}
            label="Next up"
            value={nextScheduled ? nextScheduled.title : "Nothing queued"}
          />
          <StatusItem
            icon={<CheckIcon className="h-4 w-4 text-success" />}
            label="Last published"
            value={lastPublished ? lastPublished.title : "None yet"}
          />
        </div>
      </Panel>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Projected Monthly Traffic"
          value={
            <span className="text-volt">
              <CountUp value={estimatedTraffic} />
            </span>
          }
          hint="Monthly organic visitors"
          emphasis
        />
        <Panel className="flex min-h-[128px] flex-col items-center justify-center gap-2 p-5 text-center">
          <ProgressRing value={finished.length} max={MONTHLY_GOAL}>
            <span className="text-lg font-semibold text-ink tabular-nums">{finished.length}</span>
          </ProgressRing>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Published / {MONTHLY_GOAL} goal
          </p>
        </Panel>
        <StatCard
          label="Publishing Streak"
          value={`${streak}`}
          hint={streak > 0 ? "Consecutive days live" : "Publish to start a streak"}
          media={streak > 0 ? <StreakBadge days={streak} /> : undefined}
        />
        <StatCard
          label="Article Credits"
          value={remainingCredits === null ? "—" : remainingCredits.toLocaleString()}
          hint="Remaining this cycle"
          icon={<AutopilotIcon className="h-4 w-4" />}
        />
      </div>

      {/* AI engines */}
      <StatCard
        label="Optimized for AI Answer Engines"
        media={<AlgorithmLogos />}
        hint="Your articles are written to get cited across leading AI engines"
      />

      <div className="space-y-5">
        <h2 className="text-sm font-semibold text-ink">Autopilot Queue</h2>

        <RadarSection
          label="In the queue"
          count={queue.length}
          empty={
            <span>
              Queue is empty.{" "}
              <span className="text-ink">Add an opportunity below</span> and autopilot takes it from there.
            </span>
          }
        >
          {queue.map((opp) => (
            <RadarRow
              key={opp.id}
              opp={opp}
              action={
                opp.status === "generating" ? (
                  <Pill tone="info">
                    <Loader2 className="h-3 w-3 animate-spin" /> Writing
                  </Pill>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" onClick={() => prioritize(opp)} disabled={busyId === opp.id}>
                      <PublishIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => generateNow(opp)} disabled={busyId === opp.id}>
                      {busyId === opp.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <VoltMark className="h-4 w-4" />}
                      <span className="hidden sm:inline">Write now</span>
                    </Button>
                    <Button variant="danger" onClick={() => remove(opp)} disabled={busyId === opp.id}>
                      <RemoveIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )
              }
            />
          ))}
        </RadarSection>

        <RadarSection
          label="Content gaps to win"
          count={opportunities.length}
          empty={
            <span>
              No new opportunities right now.{" "}
              <Link to="/dashboard/keywords" className="text-ink underline">
                Explore Keyword Lab
              </Link>{" "}
              to find more.
            </span>
          }
        >
          {opportunities.map((opp) => (
            <RadarRow
              key={opp.id}
              opp={opp}
              action={
                <Button onClick={() => addToQueue(opp)} disabled={busyId === opp.id}>
                  {busyId === opp.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <AddIcon className="h-4 w-4" />}
                  Add to Queue
                </Button>
              }
            />
          ))}
        </RadarSection>
      </div>
    </div>
  );
}

function StatusItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-secondary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
