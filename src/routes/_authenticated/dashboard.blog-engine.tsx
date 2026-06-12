import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  TrendingUp,
  FileText,
  X,
  Eye,
} from "lucide-react";
import { listBlogs, generateBlogArticle, type Blog, type BlogStatus } from "@/lib/api";
import { Panel, Pill, Button, PageHeader } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/_authenticated/dashboard/blog-engine")({
  component: BlogEngine,
});

type Tab = "opportunity" | "queue" | "finished";

const TABS: { id: Tab; label: string }[] = [
  { id: "opportunity", label: "Opportunities" },
  { id: "queue", label: "In Queue" },
  { id: "finished", label: "Published" },
];

function MarkdownLite({ body }: { body: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink">
      {body.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return null;
        if (t.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-2 text-lg font-bold tracking-tight text-ink">
              {t.replace(/^##\s+/, "")}
            </h2>
          );
        }
        if (t.startsWith("# ")) {
          return (
            <h1 key={i} className="text-xl font-bold tracking-tight text-ink">
              {t.replace(/^#\s+/, "")}
            </h1>
          );
        }
        if (t.startsWith("- ") || t.startsWith("* ")) {
          return (
            <li key={i} className="ml-5 list-disc text-muted-foreground">
              {t.replace(/^[-*]\s+/, "")}
            </li>
          );
        }
        return (
          <p key={i} className="text-muted-foreground">
            {t}
          </p>
        );
      })}
    </div>
  );
}

function BlogEngine() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("opportunity");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Blog | null>(null);

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
      toast.success(`"${blog.title}" is published.`);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Engine"
        description="Turn opportunities into published, SEO-optimized articles with one click."
      />

      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
              (tab === t.id
                ? "bg-ink text-background"
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
            <Panel key={b.id} className="flex items-center justify-between gap-4 p-4">
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
              <div className="shrink-0">
                {b.status === "finished" ? (
                  <Button variant="ghost" onClick={() => setViewing(b)}>
                    <Eye className="h-4 w-4" /> View
                  </Button>
                ) : (
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
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}

      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:p-8"
          onClick={() => setViewing(null)}
        >
          <div
            className="my-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  <FileText className="h-3 w-3" /> Published article
                </div>
                <h2 className="text-xl font-bold tracking-tight text-ink">{viewing.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setViewing(null)}
                aria-label="Close"
                className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="ink">SEO {viewing.seo_score}</Pill>
              <Pill tone="success">
                <TrendingUp className="h-3 w-3" />
                {viewing.traffic_estimate.toLocaleString()}/mo
              </Pill>
              {viewing.tags.map((t) => (
                <Pill key={t} tone="neutral">
                  {t}
                </Pill>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-6">
              {viewing.body ? (
                <MarkdownLite body={viewing.body} />
              ) : (
                <p className="text-sm text-muted-foreground">No content yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}