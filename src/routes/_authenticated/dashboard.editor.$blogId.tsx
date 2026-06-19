import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Undo2,
  Redo2,
  Quote,
  Sparkles,
  Loader2,
  Check,
  AlertTriangle,
  X,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import { getBlog, updateBlog, type Blog } from "@/lib/api";
import { editBlogSection } from "@/lib/ai.functions";
import { markdownToHtml, htmlToMarkdown } from "@/lib/markdown";
import { analyzeContent, type SeoAnalysis, type CheckStatus } from "@/lib/seo-analysis";
import { Button } from "@/components/dashboard/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/editor/$blogId")({
  component: BlogEditor,
});

type SaveState = "idle" | "saving" | "saved";

const AI_ACTIONS: { id: string; label: string }[] = [
  { id: "improve_seo", label: "Improve SEO" },
  { id: "rewrite", label: "Rewrite" },
  { id: "expand", label: "Expand" },
  { id: "shorten", label: "Shorten" },
];

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-ink",
        active && "bg-ink text-background hover:bg-ink hover:text-background",
      )}
    >
      {children}
    </button>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const tone =
    score >= 80 ? "var(--success)" : score >= 55 ? "var(--warning)" : "var(--destructive)";
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--border)" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="block text-2xl font-bold tabular-nums text-ink">{score}</span>
        <span className="block text-[0.6rem] uppercase tracking-wide text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

const CHECK_ICON: Record<CheckStatus, React.ReactNode> = {
  pass: <CheckCircle2 className="h-4 w-4 text-success" />,
  warn: <AlertTriangle className="h-4 w-4 text-warning" />,
  fail: <CircleDashed className="h-4 w-4 text-destructive" />,
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <p className="text-base font-bold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-[0.68rem] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function AnalysisPanel({
  analysis,
  keyword,
  setKeyword,
  meta,
  setMeta,
}: {
  analysis: SeoAnalysis;
  keyword: string;
  setKeyword: (v: string) => void;
  meta: string;
  setMeta: (v: string) => void;
}) {
  const m = analysis.metrics;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-elevation">
        <div className="flex items-center gap-4">
          <ScoreGauge score={analysis.score} />
          <div>
            <p className="text-sm font-semibold text-ink">SEO Score</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {analysis.score >= 80
                ? "Strong — ready to publish."
                : analysis.score >= 55
                  ? "Good — a few tweaks left."
                  : "Needs work to rank well."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-elevation">
        <label className="text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">
          Target keyword
        </label>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. local seo services"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink outline-none focus:border-ink/30 focus:ring-2 focus:ring-ring/20"
        />
        <label className="mt-4 block text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">
          Meta description
          <span className="ml-1 font-normal tabular-nums text-muted-foreground/70">
            {meta.length}/160
          </span>
        </label>
        <textarea
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          rows={3}
          placeholder="Compelling summary shown in search results…"
          className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink outline-none focus:border-ink/30 focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-elevation">
        <p className="mb-3 text-sm font-semibold text-ink">Analytics</p>
        <div className="grid grid-cols-2 gap-2.5">
          <Metric label="Words" value={m.words.toLocaleString()} />
          <Metric label="Read time" value={`${m.readingTime} min`} />
          <Metric label="Keyword density" value={`${m.keywordDensity}%`} />
          <Metric label="Headings" value={`${m.h2} H2 · ${m.h3} H3`} />
          <Metric label="Links" value={String(m.links)} />
          <Metric label="Readability" value={m.readabilityGrade} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-elevation">
        <p className="mb-3 text-sm font-semibold text-ink">Optimization checklist</p>
        <ul className="space-y-2.5">
          {analysis.checks.map((c) => (
            <li key={c.id} className="flex gap-2.5">
              <span className="mt-0.5 shrink-0">{CHECK_ICON[c.status]}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BlogEditor() {
  const { blogId } = useParams({ from: "/_authenticated/dashboard/editor/$blogId" });
  const queryClient = useQueryClient();
  const aiEdit = useServerFn(editBlogSection);

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getBlog(blogId),
  });

  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [meta, setMeta] = useState("");
  const [docHtml, setDocHtml] = useState("");
  const [docText, setDocText] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  const loadedRef = useRef(false);
  const dirtyRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Start writing your article…" }),
    ],
    editorProps: {
      attributes: { class: "min-h-[60vh] max-w-none focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      dirtyRef.current = true;
      setDocHtml(editor.getHTML());
      setDocText(editor.getText());
      setSaveState("saving");
    },
  });

  // Hydrate editor + fields once the blog loads.
  useEffect(() => {
    if (!blog || !editor || loadedRef.current) return;
    loadedRef.current = true;
    setTitle(blog.title);
    setKeyword(blog.keyword ?? "");
    setMeta(blog.description ?? "");
    setPublished(blog.status === "finished");
    const html = markdownToHtml(blog.body ?? "");
    editor.commands.setContent(html || "<p></p>");
    setDocHtml(editor.getHTML());
    setDocText(editor.getText());
  }, [blog, editor]);

  const analysis = useMemo(
    () => analyzeContent({ title, keyword, metaDescription: meta, html: docHtml, text: docText }),
    [title, keyword, meta, docHtml, docText],
  );

  const save = useCallback(
    async (extra?: Partial<Blog>) => {
      if (!blog) return;
      setSaveState("saving");
      try {
        await updateBlog(blog.id, {
          title: title.trim() || blog.title,
          keyword: keyword.trim() || null,
          description: meta.trim(),
          body: htmlToMarkdown(docHtml),
          seo_score: analysis.score,
          ...extra,
        });
        dirtyRef.current = false;
        setSaveState("saved");
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
        queryClient.invalidateQueries({ queryKey: ["blog", blog.id] });
      } catch (err) {
        setSaveState("idle");
        toast.error(err instanceof Error ? err.message : "Could not save.");
      }
    },
    [blog, title, keyword, meta, docHtml, analysis.score, queryClient],
  );

  // Debounced autosave.
  useEffect(() => {
    if (!loadedRef.current || !dirtyRef.current) return;
    const t = setTimeout(() => void save(), 1500);
    return () => clearTimeout(t);
  }, [title, keyword, meta, docHtml, save]);

  function markDirty() {
    dirtyRef.current = true;
    setSaveState("saving");
  }

  async function publish() {
    await save({ status: "finished" });
    setPublished(true);
    toast.success("Article published.");
  }

  async function runAi(action: string, ed: Editor) {
    const { from, to } = ed.state.selection;
    const selection = ed.state.doc.textBetween(from, to, " ").trim();
    if (!selection) {
      toast.error("Select some text first.");
      return;
    }
    setAiBusy(action);
    try {
      const res = await aiEdit({ data: { selection, action } });
      const result = (res as { result: string }).result?.trim();
      if (result) {
        ed.chain().focus().insertContentAt({ from, to }, result).run();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI edit failed.");
    } finally {
      setAiBusy(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading article…
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="space-y-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">This article could not be found.</p>
        <Link to="/dashboard/blog-engine">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" /> Back to Content Studio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/dashboard/blog-engine">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Content Studio
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {saveState === "saving" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
              </>
            ) : saveState === "saved" ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" /> Saved
              </>
            ) : (
              "Autosave on"
            )}
          </span>
          <Button onClick={publish}>
            <Sparkles className="h-4 w-4" /> {published ? "Update & Publish" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Document */}
        <div className="doc-editor overflow-hidden rounded-2xl border border-border bg-card shadow-elevation">
          {/* Toolbar */}
          <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-border bg-card/95 px-3 py-2 backdrop-blur">
            <ToolbarButton
              label="Bold"
              active={editor?.isActive("bold")}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              active={editor?.isActive("italic")}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton
              label="Heading 2"
              active={editor?.isActive("heading", { level: 2 })}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 3"
              active={editor?.isActive("heading", { level: 3 })}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton
              label="Bullet list"
              active={editor?.isActive("bulletList")}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Numbered list"
              active={editor?.isActive("orderedList")}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Quote"
              active={editor?.isActive("blockquote")}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Link"
              active={editor?.isActive("link")}
              onClick={() => {
                if (!editor) return;
                const prev = editor.getAttributes("link").href as string | undefined;
                const url = window.prompt("Link URL", prev ?? "https://");
                if (url === null) return;
                if (url === "") {
                  editor.chain().focus().unsetLink().run();
                } else {
                  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }
              }}
            >
              <Link2 className="h-4 w-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton label="Undo" onClick={() => editor?.chain().focus().undo().run()}>
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Redo" onClick={() => editor?.chain().focus().redo().run()}>
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Paper */}
          <div className="px-6 py-8 sm:px-12 sm:py-10">
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                markDirty();
              }}
              placeholder="Article title"
              className="mb-6 w-full border-none bg-transparent text-3xl font-bold tracking-tight text-ink outline-none placeholder:text-muted-foreground/50"
            />
            {editor && (
              <BubbleMenu
                editor={editor}
                className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-elevation-lg"
              >
                <span className="px-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  AI
                </span>
                {AI_ACTIONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    disabled={aiBusy !== null}
                    onClick={() => runAi(a.id, editor)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-ink transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    {aiBusy === a.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    {a.label}
                  </button>
                ))}
              </BubbleMenu>
            )}
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Analytics */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <AnalysisPanel
            analysis={analysis}
            keyword={keyword}
            setKeyword={(v) => {
              setKeyword(v);
              markDirty();
            }}
            meta={meta}
            setMeta={(v) => {
              setMeta(v);
              markDirty();
            }}
          />
        </aside>
      </div>
    </div>
  );
}