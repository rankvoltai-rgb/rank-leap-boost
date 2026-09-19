import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listBlogs,
  generateBlogArticle,
  addOpportunityToQueue,
  deleteBlog,
  updateBlog,
  getCredits,
  getSubscription,
  creditsRemaining,
  CreditsExhaustedError,
  TrialRequiredError,
  type Blog,
} from "@/lib/data";
import { formatShortDate } from "@/lib/format-date";
import { trafficScale, trafficTier, type TrafficTier } from "@/lib/traffic-tier";
import { Confetti } from "@/components/dashboard/rewards";
import { CreditPaywallDialog } from "@/components/dashboard/CreditPaywallDialog";
import { StartTrialDialog } from "@/components/dashboard/StartTrialDialog";
import {
  applyPatches,
  inversePatches,
  planMove,
  type QueuePatch,
} from "@/components/dashboard/queue-plan";

const ALL_KEY = ["blogs", "all"] as const;

/** Every article, shared by the Overview, Articles and Calendar. */
export function useAllArticles() {
  return useQuery({
    queryKey: ALL_KEY,
    queryFn: () => listBlogs(),
    // Follow articles being written — by this tab or by autopilot — through to done.
    refetchInterval: (q) => (q.state.data?.some((b) => b.status === "generating") ? 3000 : false),
  });
}

/** How an article's projected traffic ranks among this account's own articles. */
export function useTrafficTier(): (value: number) => TrafficTier {
  const { data: all } = useAllArticles();
  const scale = useMemo(() => trafficScale((all ?? []).map((b) => b.traffic_estimate ?? 0)), [all]);
  return useCallback((value: number) => trafficTier(value, scale), [scale]);
}

/**
 * Opening and closing the article slide-over through the URL (?article=).
 *
 * An article opened from the page's own list pushes a history entry, so
 * closing pops back to exactly where the user was. One that arrived by link
 * replaces instead, so closing never walks the user back out of the page.
 */
export function useArticleRouting(
  article: string | undefined,
  go: (id: string | undefined, replace: boolean) => void,
) {
  const router = useRouter();
  const openedHere = useRef(false);
  useEffect(() => {
    if (!article) openedHere.current = false;
  }, [article]);

  return {
    open(id: string) {
      openedHere.current = true;
      go(id, false);
    },
    /** For links that navigate themselves: remember the push happened here. */
    markOpenedHere() {
      openedHere.current = true;
    },
    show(id: string) {
      go(id, true);
    },
    close() {
      if (openedHere.current) router.history.back();
      else go(undefined, true);
    },
  };
}

/**
 * What any page showing articles can do to them — write, schedule, move,
 * delete — with the trial, paywall and celebration that go with it. Render
 * `dialogs` once on the page.
 */
export function useArticleActions({
  openId,
  onOpen,
}: {
  /** The article open in the slide-over, if any. */
  openId: string | undefined;
  onOpen: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const [writingIds, setWritingIds] = useState<ReadonlySet<string>>(() => new Set());
  const [confettiKey, setConfettiKey] = useState(0);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [pendingBlog, setPendingBlog] = useState<Blog | null>(null);
  const openRef = useRef(openId);
  openRef.current = openId;

  const { data: all = [] } = useAllArticles();
  const { data: credits } = useQuery({ queryKey: ["credits"], queryFn: getCredits });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const remaining = creditsRemaining(credits);

  const isWriting = useCallback((id: string) => writingIds.has(id), [writingIds]);

  async function write(blog: Blog) {
    if (remaining <= 0) {
      setPaywallOpen(true);
      return;
    }
    setWritingIds((prev) => new Set(prev).add(blog.id));
    try {
      await generateBlogArticle(blog);
      // Hold "writing" until the list carries the finished text, so an open
      // panel goes straight from the placeholder to the article.
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
      void queryClient.invalidateQueries({ queryKey: ["credits"] });
      setConfettiKey((k) => k + 1);
      if (openRef.current === blog.id) {
        toast.success("Written and published.");
      } else {
        toast.success(`“${blog.title}” is written and published.`, {
          action: { label: "Open", onClick: () => onOpen(blog.id) },
        });
      }
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
      toast.error(err instanceof Error ? err.message : "Couldn't write this article.");
      void queryClient.invalidateQueries({ queryKey: ["blogs"] });
    } finally {
      setWritingIds((prev) => {
        const next = new Set(prev);
        next.delete(blog.id);
        return next;
      });
    }
  }

  async function schedule(blog: Blog) {
    try {
      await addOpportunityToQueue(blog);
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Scheduled. Autopilot will write it.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't schedule this idea.");
    }
  }

  /** Delete; `beforeRefresh` runs before the list drops the row (e.g. close the panel). */
  async function remove(blog: Blog, beforeRefresh?: () => void) {
    try {
      await deleteBlog(blog.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete this article.");
      throw err;
    }
    beforeRefresh?.();
    void queryClient.invalidateQueries({ queryKey: ["blogs"] });
    toast.success("Article deleted.");
  }

  /**
   * Apply queue changes: shown at once, saved behind, undoable. Nothing about
   * a schedule change is destructive, so it gets an Undo, not a confirm.
   */
  async function commitQueue(
    patches: QueuePatch[],
    message: string,
    { undoable = true }: { undoable?: boolean } = {},
  ) {
    if (patches.length === 0) return;
    const before = queryClient.getQueryData<Blog[]>(ALL_KEY) ?? all;
    const undo = inversePatches(before, patches);
    queryClient.setQueryData<Blog[]>(ALL_KEY, applyPatches(before, patches));
    try {
      await Promise.all(patches.map(({ id, ...patch }) => updateBlog(id, patch)));
      toast.success(
        message,
        undoable
          ? {
              action: {
                label: "Undo",
                onClick: () => void commitQueue(undo, "Change undone.", { undoable: false }),
              },
            }
          : undefined,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update the schedule.");
    } finally {
      void queryClient.invalidateQueries({ queryKey: ["blogs"] });
    }
  }

  async function reschedule(blog: Blog, day: string) {
    if (blog.scheduled_date?.slice(0, 10) === day) return;
    const current = queryClient.getQueryData<Blog[]>(ALL_KEY) ?? all;
    await commitQueue(planMove(current, blog.id, day), `Moved to ${formatShortDate(day)}.`);
  }

  const dialogs = (
    <>
      <Confetti fireKey={confettiKey} />
      <StartTrialDialog
        open={trialOpen}
        onOpenChange={setTrialOpen}
        queuedCount={
          all.filter((b) => b.status === "scheduled" || b.status === "opportunity").length
        }
        projectedTraffic={all.reduce((s, b) => s + (b.traffic_estimate ?? 0), 0)}
        onStarted={() => {
          // Starting the trial switches autopilot on; its status reads from settings.
          void queryClient.invalidateQueries({ queryKey: ["settings"] });
          const b = pendingBlog;
          setPendingBlog(null);
          if (b) void write(b);
        }}
      />
      <CreditPaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        credits={credits}
        subscription={subscription}
      />
    </>
  );

  return {
    remaining,
    credits,
    subscription,
    isWriting,
    writingIds,
    write,
    schedule,
    remove,
    reschedule,
    commitQueue,
    openTrial: () => setTrialOpen(true),
    openPaywall: () => setPaywallOpen(true),
    dialogs,
  };
}
