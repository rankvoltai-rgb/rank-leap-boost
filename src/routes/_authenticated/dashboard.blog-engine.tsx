import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles, Loader2, TrendingUp, Pencil } from "lucide-react";
import { listBlogs, generateBlogArticle, type Blog, type BlogStatus } from "@/lib/api";
import { Panel, Pill, Button, PageHeader } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/blog-engine")({
  component: BlogEngine,
});

type Tab = "opportunity" | "queue" | "finished";

const TABS: { id: Tab; label: string }[] = [
  { id: "opportunity", label: "Ideas" },
  { id: "queue", label: "Scheduled" },
  { id: "finished", label: "Published" },
];

function BlogEngine() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("opportunity");
  const [busyId, setBusyId] = useState<string | null>(null);

  const statuses: BlogStatus[] =
    tab === "queue" ? ["scheduled", "generating"] : [tab];

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs", "engine", tab],
    queryFn: async () => {
      const lists = await Promise.all(statuses.map((s) => listBlogs(s)));
      return lists.flat();
    },
  });

  async function generate(blog: Blog) {
    setBusyId(blog.id);
    try {
      await generateBlogArticle(blog);
      toast.success(`"${blog.title}" is ready to edit.`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      navigate({ to: "/dashboard/editor/$blogId", params: { blogId: blog.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Studio"
        description="Turn ideas into long-form, AI-optimized articles, then refine them in the editor."
      />

      <div className="flex gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all " +
              (tab === t.id
                ? "bg-ink text-background shadow-sm"
                : "text-muted-foreground hover:text-ink")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Panel className="flex items-center justify-center p-12 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
        </Panel>
      ) : blogs.length === 0 ? (
        <Panel className="p-12 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </Panel>
      ) : (
        <div className="grid gap-3">
          {blogs.map((b) => (
            <Panel key={b.id} hover className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{b.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{b.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Pill tone="success">
                    <TrendingUp className="h-3 w-3" />
                    {b.traffic_estimate.toLocaleString()}/mo
                  </Pill>
                  {b.status === "finished" && <Pill tone="ink">SEO {b.seo_score}</Pill>}
                  {b.keyword && <Pill tone="neutral">{b.keyword}</Pill>}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {b.status === "finished" ? (
                  <Button
                    onClick={() =>
                      navigate({ to: "/dashboard/editor/$blogId", params: { blogId: b.id } })
                    }
                  >
                    <Pencil className="h-4 w-4" /> Open Editor
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        navigate({ to: "/dashboard/editor/$blogId", params: { blogId: b.id } })
                      }
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button onClick={() => generate(b)} disabled={busyId === b.id}>
                      {busyId === b.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Writing…
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" /> Generate
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}