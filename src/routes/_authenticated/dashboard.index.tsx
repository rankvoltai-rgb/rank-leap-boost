import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AddIcon,
  TrendIcon,
  VoltMark,
  RemoveIcon,
  PublishIcon,
  RocketIcon,
  ArticleIcon,
  ChartIcon,
  TargetIcon,
  FlameIcon,
  CardIcon,
} from "@/components/dashboard/icons";
import {
  listBlogs,
  getCredits,
  addOpportunityToQueue,
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
  Pill,
  Button,
  PageHeader,
} from "@/components/dashboard/primitives";
import { MeterBar, DifficultyBar } from "@/components/dashboard/signals";
import { DataTable, Tr, Td, TdActions, type Column } from "@/components/dashboard/data-table";
import { AI_ALGORITHM_MARKS } from "@/components/landing/ai-logos";
import { Confetti } from "@/components/dashboard/rewards";
import { CreditPaywallDialog } from "@/components/dashboard/CreditPaywallDialog";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: SystemConsole,
});

const MONTHLY_GOAL = 30; // articles per month target

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

/** A single flat metric cell used inside the consolidated stats strip. */
function StatCell({
  label,
  value,
  icon,
  hint,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5 bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p
        className={cn(
          "text-[1.9rem] font-semibold leading-none tracking-tight tabular-nums",
          accent ? "text-volt" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-auto text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const QUEUE_COLUMNS: Column[] = [
  { label: "Article" },
  { label: "Keyword" },
  { label: "Est. Traffic" },
  { label: "AI Signal" },
  { label: "Competition" },
  { label: "", className: "text-right" },
];

/** A single article row in the queue / opportunities tables. */
function ArticleRow({ opp, action }: { opp: Blog; action: React.ReactNode }) {
  const sig = opp.ai_signal ?? 0;
  const tone = sig >= 80 ? "success" : sig >= 55 ? "volt" : "warning";
  return (
    <Tr>
      <Td>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
            <ArticleIcon className="h-3.5 w-3.5" />
          </span>
          <span className="block max-w-[220px] truncate font-medium text-ink" title={opp.title}>
            {opp.title}
          </span>
        </div>
      </Td>
      <Td>
        <Pill tone="neutral">{opp.keyword}</Pill>
      </Td>
      <Td>
        <span className="inline-flex items-center gap-1 font-medium tabular-nums text-ink">
          <TrendIcon className="h-3.5 w-3.5 text-success" />
          {opp.traffic_estimate.toLocaleString()}
          <span className="font-normal text-muted-foreground">/mo</span>
        </span>
      </Td>
      <Td>
        <div className="flex items-center gap-2.5">
          <MeterBar value={sig} tone={tone} className="w-16" />
          <span className="text-xs font-semibold tabular-nums text-ink">{sig}</span>
        </div>
      </Td>
      <Td>
        <DifficultyBar label={opp.competition} />
      </Td>
      <TdActions>{action}</TdActions>
    </Tr>
  );
}

/** Section wrapper: heading + count, then either an empty panel or a table. */
function QueueTableSection({
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
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</h3>
        <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <Panel className="p-6 text-center text-sm text-muted-foreground">{empty}</Panel>
      ) : (
        <DataTable columns={QUEUE_COLUMNS}>{children}</DataTable>
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
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const [paywallOpen, setPaywallOpen] = useState(false);

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
        size="lg"
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
            label="Publishing Streak"
            value={`${streak}`}
            icon={<FlameIcon className="h-4 w-4" />}
            hint={streak > 0 ? "consecutive days live" : "publish to start a streak"}
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
      </Panel>

      <div className="space-y-5">
        <h2 className="text-sm font-semibold text-ink">Autopilot Queue</h2>

        <QueueTableSection
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
            <ArticleRow
              key={opp.id}
              opp={opp}
              action={
                opp.status === "generating" ? (
                  <Pill tone="info">
                    <Loader2 className="h-3 w-3 animate-spin" /> Writing
                  </Pill>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      title="Move to top"
                      onClick={() => prioritize(opp)}
                      disabled={busyId === opp.id}
                    >
                      <PublishIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      title="Write now"
                      onClick={() => generateNow(opp)}
                      disabled={busyId === opp.id}
                    >
                      {busyId === opp.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <VoltMark className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="danger"
                      title="Remove from queue"
                      onClick={() => remove(opp)}
                      disabled={busyId === opp.id}
                    >
                      <RemoveIcon className="h-4 w-4" />
                    </Button>
                  </>
                )
              }
            />
          ))}
        </QueueTableSection>

        <QueueTableSection
          label="Content gaps to win"
          count={opportunities.length}
          empty={
            <span>
              No new opportunities right now. Autopilot will surface new content gaps as it
              scans your space.
            </span>
          }
        >
          {opportunities.map((opp) => (
            <ArticleRow
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
        </QueueTableSection>
      </div>
    </div>
  );
}


