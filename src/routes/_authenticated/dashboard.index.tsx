import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  VoltMark,
  RemoveIcon,
  RocketIcon,
  ArticleIcon,
  ChartIcon,
  TargetIcon,
  CardIcon,
  CalendarIcon,
  PulseIcon,
} from "@/components/dashboard/icons";
import {
  listBlogs,
  getCredits,
  listIntegrationKeys,
  TRIAL_DAYS,
  addOpportunityToQueue,
  generateBlogArticle,
  deleteBlog,
  getSubscription,
  getCurrentUser,
  getSettings,
  creditsRemaining,
  CreditsExhaustedError,
  TrialRequiredError,
  type Blog,
} from "@/lib/data";
import { Panel, Pill, Button } from "@/components/dashboard/primitives";
import { DataTable, Tr, Td, TdActions, type Column } from "@/components/dashboard/data-table";
import { AI_ALGORITHM_MARKS } from "@/components/landing/ai-logos";
import { Confetti } from "@/components/dashboard/rewards";
import { CreditPaywallDialog } from "@/components/dashboard/CreditPaywallDialog";
import { StartTrialDialog } from "@/components/dashboard/StartTrialDialog";
import { CountUp } from "@/components/ui/count-up";
import { PlatformLogos } from "@/components/dashboard/platforms";
import { TrafficValue } from "@/components/dashboard/traffic";
import { lastSync, siteStatus, timeAgo } from "@/components/dashboard/connection-model";
import { PublishingSchedule } from "@/components/dashboard/PublishingSchedule";
import { ContentGaps } from "@/components/dashboard/ContentGaps";
import { engineState, type EngineState } from "@/components/dashboard/autopilot-state";
import { paceLabel } from "@/components/dashboard/queue-plan";
import { firstNameOf } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: SystemConsole,
});

const MONTHLY_GOAL = 30; // articles per month target

type QueueFilter = "all" | "scheduled" | "generating";

/** Rows shown before "View all" — enough to see what's next without pushing
 *  the schedule and content gaps off the screen. */
const QUEUE_PREVIEW = 5;

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function AlgorithmLogos() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {AI_ALGORITHM_MARKS.map(({ name, Mark }) => (
        <span
          key={name}
          title={name}
          aria-label={name}
          className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card"
        >
          <Mark className="h-4 w-4" />
        </span>
      ))}
    </div>
  );
}

/** A single flat metric cell used inside the consolidated stats panel. */
function StatCell({
  label,
  value,
  icon,
  hint,
  accent,
  valueClassName,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  accent?: boolean;
  /** Renders the value at text size — for statuses rather than figures. */
  valueClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5 bg-card p-5", accent && "volt-glow")}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p
        className={cn(
          "text-[1.9rem] font-semibold leading-none tracking-tight tabular-nums",
          accent ? "font-bold text-black dark:text-white" : "text-ink",
          valueClassName,
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-auto text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Where an article stands, in the queue's own vocabulary. */
function StatusPill({ status }: { status: Blog["status"] }) {
  if (status === "generating") {
    return (
      <Pill tone="info">
        <Loader2 className="h-3 w-3 animate-spin" /> Writing
      </Pill>
    );
  }
  if (status === "finished") return <Pill tone="success">Ready</Pill>;
  return <Pill tone="neutral">Scheduled</Pill>;
}

const QUEUE_COLUMNS: Column[] = [
  { label: "Article" },
  { label: "Keyword" },
  { label: "Est. traffic" },
  { label: "Status" },
  { label: "", className: "text-right" },
];

/** A single queued article. */
function QueueRow({ blog, action }: { blog: Blog; action: React.ReactNode }) {
  return (
    <Tr>
      <Td>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
            <ArticleIcon className="h-3.5 w-3.5" />
          </span>
          <span className="block max-w-[260px] truncate font-medium text-ink" title={blog.title}>
            {blog.title}
          </span>
        </div>
      </Td>
      <Td>
        <Pill tone="neutral" className="whitespace-nowrap">
          {blog.keyword}
        </Pill>
      </Td>
      <Td>
        <TrafficValue value={blog.traffic_estimate} />
      </Td>
      <Td>
        <StatusPill status={blog.status} />
      </Td>
      <TdActions>{action}</TdActions>
    </Tr>
  );
}

const OFFLINE_REASON: Record<Exclude<EngineState, "running">, string> = {
  "needs-trial": "Start your free trial to turn autopilot on.",
  "out-of-credits": "This month's articles are used up. Autopilot resumes when your plan renews.",
  paused: "Autopilot is paused. Turn it back on in Settings.",
};

/** Autopilot on or off at a glance; opens the switch in Settings. */
function AutopilotStatus({ state, perWeek }: { state: EngineState | null; perWeek: number }) {
  const online = state === "running";
  const label = state === null ? "" : online ? "Online" : "Offline";
  const detail =
    state === null
      ? undefined
      : state === "running"
        ? `Autopilot is writing ${paceLabel(perWeek)}.`
        : OFFLINE_REASON[state];
  return (
    <Link
      to="/dashboard/settings"
      hash="autopilot"
      title={detail}
      aria-label={state === null ? "Autopilot" : `Autopilot ${label}. ${detail}`}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-secondary"
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
        {online && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:animate-none" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            online ? "bg-success" : "bg-muted-foreground/50",
          )}
        />
      </span>
      Autopilot
      {label && (
        <span className={cn("font-semibold", online ? "text-success" : "text-muted-foreground")}>
          {label}
        </span>
      )}
    </Link>
  );
}

function SystemConsole() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
  const [showAllQueue, setShowAllQueue] = useState(false);
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

  const { data: allBlogs = [] } = useQuery({
    queryKey: ["blogs", "all"],
    queryFn: () => listBlogs(),
  });
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
      const { fullName } = await getCurrentUser();
      return firstNameOf(fullName);
    },
  });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const { data: integrationKeys, isLoading: integrationsLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: listIntegrationKeys,
  });
  // A key existing isn't a connection; a site using it is.
  const connection = siteStatus(integrationKeys);
  const lastSiteSync = lastSync(integrationKeys);
  // Drives the trial banner: it disappears the moment a subscription exists.
  const hasEntitlement =
    !!subscription && ["trialing", "active", "past_due"].includes(subscription.status);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  // Set when Generate was blocked, so the article runs itself once the trial starts.
  const [pendingBlog, setPendingBlog] = useState<Blog | null>(null);

  const estimatedTraffic = allBlogs.reduce((sum, b) => sum + (b.traffic_estimate ?? 0), 0);
  const queue = [...generating, ...scheduled];
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
      navigate({ to: "/dashboard/blog-engine", search: { article: blog.id } });
    } catch (err) {
      // No trial yet: this is the moment the trial is sold, not onboarding.
      if (err instanceof TrialRequiredError) {
        setPendingBlog(blog);
        setTrialOpen(true);
        return;
      }
      if (err instanceof CreditsExhaustedError) {
        setPaywallOpen(true);
        return;
      }
      toast.error(err instanceof Error ? err.message : "Generation failed.");
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

  const today = new Date();
  const dateLine = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(today);
  // Null until everything it depends on has loaded, so it never flashes "Offline".
  const autopilot =
    settings === undefined || subscription === undefined || credits === undefined
      ? null
      : engineState({
          subscription,
          remaining: remainingCredits ?? 0,
          enabled: settings?.autopilot_enabled !== false,
        });
  const visibleQueue = queue.filter((b) => queueFilter === "all" || b.status === queueFilter);
  const shownQueue = showAllQueue ? visibleQueue : visibleQueue.slice(0, QUEUE_PREVIEW);
  const hiddenCount = visibleQueue.length - shownQueue.length;

  return (
    <div className="space-y-6">
      <Confetti fireKey={confettiKey} />
      <StartTrialDialog
        open={trialOpen}
        onOpenChange={setTrialOpen}
        queuedCount={scheduled.length + opportunities.length}
        projectedTraffic={estimatedTraffic}
        onStarted={() => {
          const b = pendingBlog;
          setPendingBlog(null);
          if (b) void generateNow(b);
        }}
      />
      <CreditPaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        credits={credits}
        subscription={subscription}
      />

      {/* Greeting, then the one action worth taking right now. */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{dateLine}</p>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-[2.1rem]">
            {timeGreeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {finished.length > 0
              ? `Your articles are working for you — ${finished.length} published so far.`
              : "Your autopilot engine is building your traffic — sit back and watch it grow."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/calendar"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-secondary"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </Link>
          <AutopilotStatus state={autopilot} perWeek={settings?.weekly_cadence ?? 7} />
        </div>
      </header>

      {/* Stats + AI engines — one consolidated, hairline-divided panel */}
      <Panel className="overflow-hidden">
        <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
          <StatCell
            label="Projected Traffic"
            value={<CountUp value={estimatedTraffic} />}
            icon={<ChartIcon className="h-4 w-4" />}
            hint="Est. monthly organic visitors"
            accent
          />
          <StatCell
            label="Published"
            value={
              <>
                {finished.length}
                <span className="text-lg font-medium text-muted-foreground"> / {MONTHLY_GOAL}</span>
              </>
            }
            icon={<TargetIcon className="h-4 w-4" />}
            hint={`${Math.round((finished.length / MONTHLY_GOAL) * 100)}% of monthly goal`}
          />
          <StatCell
            label={<PlatformLogos />}
            valueClassName="text-[1.35rem]"
            value={
              <span className="inline-flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    connection === "live"
                      ? "bg-success"
                      : connection === "stale"
                        ? "bg-warning"
                        : connection === "waiting"
                          ? "bg-brand-blue"
                          : "bg-muted-foreground/40",
                  )}
                />
                <span
                  className={cn(
                    connection === "live"
                      ? "text-success"
                      : connection === "none"
                        ? "text-muted-foreground"
                        : "text-ink",
                  )}
                >
                  {integrationsLoading
                    ? "—"
                    : { live: "Live", stale: "Not syncing", waiting: "Waiting", none: "Offline" }[
                        connection
                      ]}
                </span>
              </span>
            }
            hint={
              connection === "live" ? (
                `Synced ${timeAgo(lastSiteSync)}`
              ) : (
                <Link
                  to="/dashboard/integrations"
                  className="font-medium text-volt underline-offset-2 hover:underline"
                >
                  {connection === "none"
                    ? "Connect your site →"
                    : connection === "waiting"
                      ? "Finish setup →"
                      : `Last sync ${timeAgo(lastSiteSync)} →`}
                </Link>
              )
            }
          />
          <StatCell
            label="Article Credits"
            value={remainingCredits === null ? "—" : remainingCredits.toLocaleString()}
            icon={<CardIcon className="h-4 w-4" />}
            hint="remaining this cycle"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-5 py-4">
          <p className="text-sm font-medium text-ink">Optimized for AI answer engines</p>
          <AlgorithmLogos />
          <p className="ml-auto text-xs text-muted-foreground">
            Written to get cited across leading AI engines
          </p>
        </div>

        {/* Only until the trial exists — it disappears once subscribed. */}
        {!hasEntitlement && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border bg-brand-blue px-5 py-4 text-white">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-card bg-white/15">
              <RocketIcon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                Start your {TRIAL_DAYS}-day free trial to publish these articles
              </p>
              <p className="mt-0.5 text-xs text-white/75">
                {queue.length + opportunities.length} articles are queued and ready. No charge
                today.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTrialOpen(true)}
              className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-4 text-sm font-semibold text-brand-blue transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Start free trial
            </button>
          </div>
        )}
      </Panel>

      {outOfCredits && (
        <Panel className="flex flex-wrap items-center justify-between gap-3 border-destructive/30 bg-destructive/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-card bg-destructive/10 text-destructive">
              <RocketIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">You're out of article credits</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                You've used all {MONTHLY_GOAL} articles this month. Upgrade to keep publishing
                today.
              </p>
            </div>
          </div>
          <Button onClick={() => setPaywallOpen(true)}>
            <RocketIcon className="h-4 w-4" /> Upgrade
          </Button>
        </Panel>
      )}

      {/* The queue: what autopilot writes next, in order. */}
      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4">
          <PulseIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold text-ink">Autopilot queue</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums text-muted-foreground">
            {queue.length}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={queueFilter}
              onChange={(e) => setQueueFilter(e.target.value as QueueFilter)}
              aria-label="Filter the queue"
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-ink outline-none transition-colors hover:bg-secondary focus:ring-2 focus:ring-ring"
            >
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="generating">Writing</option>
            </select>
            <Link
              to="/dashboard/blog-engine"
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
            >
              See all
            </Link>
          </div>
        </div>

        <div className="border-t border-border">
          {visibleQueue.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              {queue.length === 0
                ? "Queue is empty. Claim a content gap below and autopilot takes it from there."
                : "Nothing matches this filter."}
            </p>
          ) : (
            // The card is the frame; the table's own border would double it.
            <DataTable columns={QUEUE_COLUMNS} className="rounded-none border-0">
              {shownQueue.map((blog) => (
                <QueueRow
                  key={blog.id}
                  blog={blog}
                  action={
                    blog.status === "generating" ? null : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => generateNow(blog)}
                          disabled={busyId === blog.id}
                          // White at rest; blue on hover, press, and while this row is writing.
                          className={cn(
                            "whitespace-nowrap hover:border-brand-blue hover:bg-brand-blue hover:text-white focus-visible:border-brand-blue focus-visible:bg-brand-blue focus-visible:text-white active:border-brand-blue active:bg-brand-blue active:text-white",
                            busyId === blog.id && "border-brand-blue bg-brand-blue text-white",
                          )}
                        >
                          {busyId === blog.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <VoltMark className="h-4 w-4" />
                          )}
                          Generate now
                        </Button>
                        <Button
                          variant="danger"
                          title="Remove from queue"
                          aria-label="Remove from queue"
                          onClick={() => remove(blog)}
                          disabled={busyId === blog.id}
                        >
                          <RemoveIcon className="h-4 w-4" />
                        </Button>
                      </>
                    )
                  }
                />
              ))}
            </DataTable>
          )}
        </div>

        {(hiddenCount > 0 || showAllQueue) && visibleQueue.length > QUEUE_PREVIEW && (
          <button
            type="button"
            onClick={() => setShowAllQueue((v) => !v)}
            className="flex w-full items-center justify-center gap-1.5 border-t border-border px-5 py-3 text-sm font-medium text-brand-blue transition-colors hover:bg-secondary/60"
          >
            {showAllQueue ? "Show less" : `View all ${visibleQueue.length}`}
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", showAllQueue && "rotate-180")}
            />
          </button>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <PublishingSchedule blogs={queue} />
        <ContentGaps gaps={opportunities} busyId={busyId} onQueue={addToQueue} />
      </div>
    </div>
  );
}
