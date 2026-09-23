import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  ConnectIcon,
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
import { Meter, NextStepCard, type LaunchStep } from "@/components/dashboard/NextStep";
import { TrafficValue } from "@/components/dashboard/traffic";
import { lastSync, siteStatus, timeAgo } from "@/components/dashboard/connection-model";
import { PublishingSchedule } from "@/components/dashboard/PublishingSchedule";
import { ContentGaps } from "@/components/dashboard/ContentGaps";
import { engineState, type EngineState } from "@/components/dashboard/autopilot-state";
import { paceLabel } from "@/components/dashboard/queue-plan";
import { useSiteId } from "@/components/dashboard/site-context";
import { allArticlesKey } from "@/components/dashboard/useArticleActions";
import { firstNameOf } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Overview,
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

/** Large blue call to action, for a `Link` — `Button` covers the rest. */
const CTA_LINK =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[0_1px_2px_color-mix(in_oklab,var(--cta)_35%,transparent)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const CTA_BUTTON = "h-11 px-5 text-[0.95rem] font-semibold";

function AlgorithmLogos() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="flex items-center -space-x-1.5">
        {AI_ALGORITHM_MARKS.map(({ name, Mark }) => (
          <span
            key={name}
            title={name}
            aria-label={name}
            className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card ring-2 ring-card"
          >
            <Mark className="h-3.5 w-3.5" />
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Written to get cited in AI answers</p>
    </div>
  );
}

/** A single flat metric cell used inside the consolidated stats panel. */
function StatCell({
  label,
  value,
  icon,
  hint,
  meter,
  valueClassName,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  /** A progress meter between the figure and the hint. */
  meter?: React.ReactNode;
  /** Renders the value at text size — for statuses rather than figures. */
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-3 bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p
        className={cn(
          "text-[1.9rem] font-semibold leading-none tracking-tight tabular-nums text-ink",
          valueClassName,
        )}
      >
        {value}
      </p>
      {meter}
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
          <span className="block max-w-[340px] truncate font-medium text-ink" title={blog.title}>
            {blog.title}
          </span>
        </div>
      </Td>
      <Td>
        <span
          className="block max-w-[220px] truncate text-muted-foreground"
          title={blog.keyword ?? undefined}
        >
          {blog.keyword}
        </span>
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
  const label = state === null ? "" : online ? "On" : "Off";
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

/**
 * Keyed by site: switching sites starts the page over, so the other site's
 * published count never reads as a new article going live.
 */
function Overview() {
  const siteId = useSiteId();
  return <SystemConsole key={siteId} siteId={siteId} />;
}

function SystemConsole({ siteId }: { siteId: string }) {
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
      // Only the flag goes: `site` stays, so a refresh reopens the same site.
      params.delete("checkout");
      const rest = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (rest ? `?${rest}` : ""));
    }
  }, []);

  const { data: allBlogs = [] } = useQuery({
    queryKey: allArticlesKey(siteId),
    queryFn: () => listBlogs(siteId),
  });
  const { data: opportunities = [] } = useQuery({
    queryKey: ["blogs", siteId, "opportunity"],
    queryFn: () => listBlogs(siteId, "opportunity"),
  });
  const { data: scheduled = [] } = useQuery({
    queryKey: ["blogs", siteId, "scheduled"],
    queryFn: () => listBlogs(siteId, "scheduled"),
  });
  const { data: generating = [] } = useQuery({
    queryKey: ["blogs", siteId, "generating"],
    queryFn: () => listBlogs(siteId, "generating"),
  });
  const finishedQuery = useQuery({
    queryKey: ["blogs", siteId, "finished"],
    queryFn: () => listBlogs(siteId, "finished"),
  });
  const finished = finishedQuery.data ?? [];
  const { data: credits } = useQuery({
    queryKey: ["credits", siteId],
    queryFn: () => getCredits(siteId),
  });
  const { data: firstName = "" } = useQuery({
    queryKey: ["auth", "first-name"],
    queryFn: async () => {
      const { fullName } = await getCurrentUser();
      return firstNameOf(fullName);
    },
  });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const { data: settings } = useQuery({
    queryKey: ["settings", siteId],
    queryFn: () => getSettings(siteId),
  });
  const { data: integrationKeys, isLoading: integrationsLoading } = useQuery({
    queryKey: ["api-keys", siteId],
    queryFn: () => listIntegrationKeys(siteId),
  });
  // A key existing isn't a connection; a site using it is.
  const connection = siteStatus(integrationKeys);
  const lastSiteSync = lastSync(integrationKeys);
  // Drives the trial banner: it disappears the moment a subscription exists.
  const hasEntitlement =
    !!subscription && ["trialing", "active", "past_due"].includes(subscription.status);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);

  // Links elsewhere in the dashboard (the rail, Billing) land here with
  // #start-trial to open the trial straight away. The hash is spent on arrival.
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    if (hash !== "start-trial" || subscription === undefined) return;
    if (!hasEntitlement) setTrialOpen(true);
    navigate({ to: "/dashboard", hash: "", replace: true });
  }, [hash, subscription, hasEntitlement, navigate]);
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
      await generateBlogArticle(blog.site_id, blog);
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

  // The launch checklist. Trial first: it's what lets anything publish, and the
  // queue is already full of work waiting on it.
  const connected = connection === "live" || connection === "stale";
  const steps: LaunchStep[] = [
    { id: "trial", label: `Start your ${TRIAL_DAYS}-day free trial`, done: hasEntitlement },
    { id: "connect", label: "Connect your site", done: connected },
    { id: "publish", label: "Publish your first article", done: finished.length > 0 },
  ];
  const stepNo = steps.findIndex((s) => !s.done) + 1;
  const eyebrow = `Next step · ${stepNo} of ${steps.length}`;
  const readyCount = queue.length + opportunities.length;
  const nextUp = scheduled[0] ?? null;
  // Held back until everything it reads has loaded, so it never flashes the
  // wrong step at someone who has already done it.
  const settled = subscription !== undefined && !integrationsLoading && finishedQuery.isSuccess;

  let nextStep: React.ReactNode = null;
  if (settled && !hasEntitlement) {
    nextStep = (
      <NextStepCard
        eyebrow={eyebrow}
        title={
          readyCount > 0
            ? `Put your ${readyCount} ready articles to work`
            : "Turn on autopilot and start ranking"
        }
        body={
          estimatedTraffic > 0
            ? `They're projected to bring an estimated ${estimatedTraffic.toLocaleString()} visitors a month. Start your trial and autopilot writes and publishes them for you.`
            : "Start your trial and autopilot researches, writes and publishes for you."
        }
        aside={<AlgorithmLogos />}
        action={
          <Button className={CTA_BUTTON} onClick={() => setTrialOpen(true)}>
            <RocketIcon className="h-4 w-4" /> Start free trial
          </Button>
        }
        note="No charge today · cancel in one click"
        steps={steps}
      />
    );
  } else if (settled && outOfCredits) {
    nextStep = (
      <NextStepCard
        eyebrow="Credits used up"
        title="You've used every article this cycle"
        body="Upgrade to keep publishing today, or autopilot picks back up when your plan renews."
        action={
          <Button className={CTA_BUTTON} onClick={() => setPaywallOpen(true)}>
            <RocketIcon className="h-4 w-4" /> Upgrade
          </Button>
        }
      />
    );
  } else if (settled && !connected) {
    nextStep = (
      <NextStepCard
        eyebrow={eyebrow}
        title={
          connection === "waiting"
            ? "Finish connecting your site"
            : "Connect your site so articles publish themselves"
        }
        body={
          connection === "waiting"
            ? "Your key is ready. Add it to your site and Rankbox confirms the first sync here."
            : "Link your site once. From then on, every finished article goes live without you."
        }
        aside={<PlatformLogos size="h-6 w-6" />}
        action={
          <Link to="/dashboard/integrations" className={CTA_LINK}>
            <ConnectIcon className="h-4 w-4" />
            {connection === "waiting" ? "Finish setup" : "Connect your site"}
          </Link>
        }
        steps={steps}
      />
    );
  } else if (settled && finished.length === 0) {
    nextStep = (
      <NextStepCard
        eyebrow={eyebrow}
        title="Write your first article"
        body={
          nextUp
            ? `Next in the queue: "${nextUp.title}". Generate it now to see what autopilot writes for you.`
            : "Pick a content gap below and autopilot takes it from there."
        }
        action={
          nextUp ? (
            <Button
              className={CTA_BUTTON}
              onClick={() => generateNow(nextUp)}
              disabled={busyId === nextUp.id}
            >
              {busyId === nextUp.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <VoltMark className="h-4 w-4" />
              )}
              Generate now
            </Button>
          ) : (
            <Link to="/dashboard/blog-engine" className={CTA_LINK}>
              Browse ideas
            </Link>
          )
        }
        steps={steps}
      />
    );
  } else if (settled && autopilot === "paused") {
    nextStep = (
      <NextStepCard
        eyebrow="Autopilot paused"
        title="Autopilot isn't writing right now"
        body="Your queue is waiting. Turn autopilot back on and it picks up where it left off."
        action={
          <Link to="/dashboard/settings" hash="autopilot" className={CTA_LINK}>
            Turn autopilot on
          </Link>
        }
      />
    );
  }

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

      {/* Greeting, and whether the engine is running. */}
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
              : "Here's your traffic engine. One step at a time, it runs itself."}
          </p>
        </div>
        <AutopilotStatus state={autopilot} perWeek={settings?.weekly_cadence ?? 7} />
      </header>

      {nextStep}

      {/* The numbers, in one hairline-divided panel. */}
      <Panel className="overflow-hidden">
        <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
          <StatCell
            label="Projected traffic"
            value={<CountUp value={estimatedTraffic} />}
            icon={<ChartIcon className="h-4 w-4" />}
            hint="Est. monthly organic visitors"
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
            meter={<Meter value={finished.length} max={MONTHLY_GOAL} label="Monthly goal" />}
            hint={`${Math.round((finished.length / MONTHLY_GOAL) * 100)}% of monthly goal`}
          />
          <StatCell
            label="Your site"
            icon={<ConnectIcon className="h-4 w-4" />}
            valueClassName="whitespace-nowrap text-lg sm:text-[1.35rem]"
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
                          ? "bg-cta"
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
                    : {
                        live: "Live",
                        stale: "Not syncing",
                        waiting: "Waiting",
                        none: "Not connected",
                      }[connection]}
                </span>
              </span>
            }
            hint={
              connection === "live" ? (
                `Synced ${timeAgo(lastSiteSync)}`
              ) : (
                <Link
                  to="/dashboard/integrations"
                  className="font-medium text-cta underline-offset-2 hover:underline"
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
            label="Article credits"
            value={remainingCredits === null ? "—" : remainingCredits.toLocaleString()}
            icon={<CardIcon className="h-4 w-4" />}
            meter={
              credits ? (
                <Meter
                  value={remainingCredits ?? 0}
                  max={credits.credits_total}
                  label="Credits remaining"
                />
              ) : undefined
            }
            hint={credits ? `of ${credits.credits_total} left this cycle` : "remaining this cycle"}
          />
        </div>
      </Panel>

      {/* The queue: what autopilot writes next, in order. */}
      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4">
          <PulseIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold text-ink">Autopilot queue</h2>
          <div className="ml-auto flex items-center gap-2">
            <div
              role="radiogroup"
              aria-label="Filter the queue"
              className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5"
            >
              {(
                [
                  { id: "all", label: "All", count: queue.length },
                  { id: "scheduled", label: "Scheduled", count: scheduled.length },
                  { id: "generating", label: "Writing", count: generating.length },
                ] as const
              ).map((f) => {
                const on = queueFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setQueueFilter(f.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                      on ? "bg-cta-soft text-cta" : "text-muted-foreground hover:text-ink",
                    )}
                  >
                    {f.label}
                    <span className="tabular-nums opacity-70">{f.count}</span>
                  </button>
                );
              })}
            </div>
            <Link
              to="/dashboard/blog-engine"
              className="hidden rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink sm:inline-flex"
            >
              Open Articles
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
                          title="Write this article now"
                          disabled={busyId === blog.id}
                          // White at rest; blue on hover, press, and while this row is writing.
                          className={cn(
                            "group/gen h-8 whitespace-nowrap px-3 text-[0.8rem] hover:border-cta hover:bg-cta hover:text-white focus-visible:border-cta focus-visible:bg-cta focus-visible:text-white active:border-cta active:bg-cta active:text-white",
                            busyId === blog.id && "border-cta bg-cta text-white",
                          )}
                        >
                          {busyId === blog.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <VoltMark className="h-4 w-4 text-cta group-hover/gen:text-white group-focus-visible/gen:text-white" />
                          )}
                          Generate now
                        </Button>
                        <Button
                          variant="danger"
                          className="h-8 w-8 px-0"
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
            className="flex w-full items-center justify-center gap-1.5 border-t border-border px-5 py-3 text-sm font-medium text-cta transition-colors hover:bg-secondary/60"
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
