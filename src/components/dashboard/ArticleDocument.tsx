import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  CircleDashed,
  Link2,
  Loader2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { editBlogSection, updateBlog, type Blog } from "@/lib/data";
import { markdownToHtml } from "@/lib/markdown";
import { htmlToMarkdown } from "@/lib/editor-markdown";
import { YoutubeEmbed } from "@/lib/editor-youtube";
import { analyzeContent, htmlToPlainText, type CheckStatus } from "@/lib/seo-analysis";
import { formatShortDate } from "@/lib/format-date";
import { Button } from "@/components/dashboard/primitives";
import { Confetti } from "@/components/dashboard/rewards";
import { AiSignalFlames, DifficultyBar } from "@/components/dashboard/signals";
import { PublishIcon, RemoveIcon, VoltMark } from "@/components/dashboard/icons";
import { TrafficValue } from "@/components/dashboard/traffic";
import { hasBody, isOverdue, stageOf } from "@/components/dashboard/article-stages";
import {
  ConfirmDialog,
  DayField,
  EditorToolbar,
  PanelHeader,
  PanelSection,
  PropertyRow,
  ScoreGauge,
  StagePill,
  type PanelNav,
} from "@/components/dashboard/article-parts";
import { cn } from "@/lib/utils";

/** What the list page does on the article's behalf — it owns credits, the trial and the paywall. */
export interface ArticleActions {
  creditsLeft: number;
  onWrite: (blog: Blog) => void;
  onSchedule: (blog: Blog) => Promise<void>;
  onDelete: (blog: Blog) => Promise<void>;
  /** Move a scheduled article to another day ("yyyy-MM-dd"). */
  onReschedule: (blog: Blog, day: string) => Promise<void>;
}

type SaveState = "idle" | "saving" | "saved" | "error";

const AI_ACTIONS: { id: string; label: string }[] = [
  { id: "improve_seo", label: "Improve SEO" },
  { id: "rewrite", label: "Rewrite" },
  { id: "expand", label: "Expand" },
  { id: "shorten", label: "Shorten" },
];

const CHECK_ICON: Record<CheckStatus, React.ReactNode> = {
  pass: <CheckCircle2 className="h-4 w-4 text-success" />,
  warn: <AlertTriangle className="h-4 w-4 text-warning" />,
  fail: <CircleDashed className="h-4 w-4 text-destructive" />,
};

const META_LIMIT = 160;

/**
 * One article, open in the slide-over.
 *
 * Saving follows what the article is. A draft autosaves, because nothing reads
 * it yet. A published article is served to the site as soon as its row
 * changes, so its edits stay local until "Publish changes" — half-typed
 * sentences never go live, and leaving with unpublished edits asks first.
 */
export function ArticleDocument({
  blog,
  nav,
  actions,
}: {
  blog: Blog;
  nav: PanelNav;
  actions: ArticleActions;
}) {
  const queryClient = useQueryClient();
  const stage = stageOf(blog);
  const published = stage === "published";

  const [title, setTitle] = useState(blog.title);
  const [keyword, setKeyword] = useState(blog.keyword ?? "");
  const [meta, setMeta] = useState(blog.description ?? "");
  const [initialHtml] = useState(() => markdownToHtml(blog.body ?? ""));
  const [docHtml, setDocHtml] = useState(initialHtml);
  // Fixed at open (or by "Start writing"), so clearing a draft's last word
  // never swaps the editor out from under the cursor.
  const [showEditor, setShowEditor] = useState(() => hasBody(blog));
  const [dirty, setDirty] = useState(false);
  const [editTick, setEditTick] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [busy, setBusy] = useState<"publish" | "schedule" | "delete" | null>(null);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  function markEdited() {
    setDirty(true);
    setEditTick((t) => t + 1);
  }

  const editor = useEditor({
    immediatelyRender: false,
    content: initialHtml,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: false }),
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Start writing your article…" }),
      // Generated articles embed a video; without this the editor drops it.
      YoutubeEmbed,
    ],
    editorProps: {
      attributes: {
        class: "min-h-[45vh] max-w-none focus:outline-none",
        "aria-label": "Article body",
      },
    },
    onUpdate: ({ editor: e }) => {
      setDocHtml(e.getHTML());
      markEdited();
    },
  });

  const docText = useMemo(() => htmlToPlainText(docHtml), [docHtml]);
  const analysis = useMemo(
    () => analyzeContent({ title, keyword, metaDescription: meta, html: docHtml, text: docText }),
    [title, keyword, meta, docHtml, docText],
  );
  const passed = analysis.checks.filter((c) => c.status === "pass").length;

  // Saves read the latest values, not the ones a stale closure caught.
  const latest = useRef({ title, keyword, meta, html: docHtml, score: analysis.score, showEditor });
  latest.current = { title, keyword, meta, html: docHtml, score: analysis.score, showEditor };
  const tickRef = useRef(editTick);
  tickRef.current = editTick;

  const save = useCallback(
    async (extra?: Partial<Blog>): Promise<boolean> => {
      const v = latest.current;
      const patch: Partial<Blog> = {
        title: v.title.trim() || blog.title,
        keyword: v.keyword.trim() || null,
        description: v.meta.trim(),
        ...extra,
      };
      // An unwritten article only has its brief; don't store an empty body and
      // a score for text that doesn't exist.
      if (v.showEditor) {
        patch.body = htmlToMarkdown(v.html);
        patch.seo_score = v.score;
      }
      const tickAtStart = tickRef.current;
      setSaveState("saving");
      try {
        await updateBlog(blog.id, patch);
        // Edits typed while the request was out still need their own save.
        if (tickRef.current === tickAtStart) setDirty(false);
        setSaveState("saved");
        void queryClient.invalidateQueries({ queryKey: ["blogs"] });
        return true;
      } catch (err) {
        setSaveState("error");
        toast.error(err instanceof Error ? err.message : "Couldn't save your changes.");
        return false;
      }
    },
    [blog.id, blog.title, queryClient],
  );

  // Drafts autosave a beat after typing stops.
  useEffect(() => {
    if (published || !dirty) return;
    const t = setTimeout(() => void save(), 1000);
    return () => clearTimeout(t);
  }, [editTick, published, dirty, save]);

  // Set when the user chose to throw edits away — nothing should save them after.
  const discarded = useRef(false);

  // Closing or switching articles inside the debounce window must not drop the
  // last words typed.
  const flushOnLeave = useRef(() => {});
  flushOnLeave.current = () => {
    if (!published && dirty && !discarded.current) void save();
  };
  useEffect(() => () => flushOnLeave.current(), []);

  // Leaving is only unsafe when edits can't follow on their own: a live article
  // with unpublished changes, or a draft whose last save failed.
  const unsafe = !discarded.current && ((published && dirty) || saveState === "error");
  const unsafeRef = useRef(unsafe);
  unsafeRef.current = unsafe;
  const pendingRef = useRef(false);
  pendingRef.current = !published && dirty;
  const blocker = useBlocker({
    shouldBlockFn: () => unsafeRef.current,
    enableBeforeUnload: () => unsafeRef.current || pendingRef.current,
    withResolver: true,
  });

  async function publish() {
    setBusy("publish");
    const ok = await save({ status: "finished" });
    setBusy(null);
    if (ok) {
      setConfettiKey((k) => k + 1);
      toast.success("Article published.");
    }
    return ok;
  }

  async function publishChanges() {
    setBusy("publish");
    const ok = await save();
    setBusy(null);
    if (ok) toast.success("Changes published.");
    return ok;
  }

  async function write() {
    // The brief steers the writer, so edits to it must land first.
    if (dirty && !(await save())) return;
    const v = latest.current;
    actions.onWrite({
      ...blog,
      title: v.title.trim() || blog.title,
      keyword: v.keyword.trim() || null,
      description: v.meta.trim(),
    });
  }

  async function schedule() {
    if (dirty && !(await save())) return;
    setBusy("schedule");
    try {
      await actions.onSchedule(blog);
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setBusy("delete");
    // The panel closes as part of deleting; unpublished edits die with the article.
    discarded.current = true;
    unsafeRef.current = false;
    try {
      await actions.onDelete(blog);
      setConfirmDelete(false);
    } catch {
      discarded.current = false;
      setBusy(null);
    }
  }

  function startWriting() {
    setShowEditor(true);
    requestAnimationFrame(() => editor?.commands.focus("end"));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied.");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }

  async function runAi(action: string) {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selection = editor.state.doc.textBetween(from, to, " ").trim();
    if (!selection) {
      toast.error("Select some text first.");
      return;
    }
    setAiBusy(action);
    try {
      const { result } = await editBlogSection({ selection, action });
      const text = result?.trim();
      if (text) editor.chain().focus().insertContentAt({ from, to }, text).run();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI edit failed.");
    } finally {
      setAiBusy(null);
    }
  }

  // ⌘S / Ctrl+S: the reflex every writer has. Save a draft now; publish a live
  // article's changes.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "s") return;
      e.preventDefault();
      if (!dirty || busy) return;
      if (published) void publishChanges();
      else void save();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const hasText = docText.trim().length > 0;
  const scheduledOn = formatShortDate(blog.scheduled_date);
  const overdue = isOverdue(blog);
  const blocked = blocker.status === "blocked";

  /* ── Header actions ── */

  let primary: React.ReactNode;
  if (published) {
    primary = (
      <Button onClick={() => void publishChanges()} disabled={!dirty || busy !== null}>
        {busy === "publish" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PublishIcon className="h-4 w-4" />
        )}
        Publish changes
      </Button>
    );
  } else if (showEditor) {
    primary = (
      <Button
        onClick={() => void publish()}
        disabled={!hasText || busy !== null}
        title={hasText ? undefined : "Write something first"}
      >
        {busy === "publish" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PublishIcon className="h-4 w-4" />
        )}
        Publish
      </Button>
    );
  } else {
    primary = (
      <>
        {stage === "idea" && (
          <Button variant="ghost" onClick={() => void schedule()} disabled={busy !== null}>
            {busy === "schedule" && <Loader2 className="h-4 w-4 animate-spin" />}
            Schedule
          </Button>
        )}
        <Button variant="brand" onClick={() => void write()} disabled={busy !== null}>
          <VoltMark className="h-4 w-4" />
          {actions.creditsLeft > 0 ? "Write now" : "Upgrade to write"}
        </Button>
      </>
    );
  }

  return (
    <>
      <Confetti fireKey={confettiKey} />
      <PanelHeader nav={nav} stage={stage} overdue={overdue}>
        <SaveStatus
          published={published}
          dirty={dirty}
          state={saveState}
          onRetry={() => void save()}
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More actions"
            title="More actions"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-secondary data-[state=open]:text-ink"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-44 rounded-card border-border bg-card p-1 shadow-elevation-lg"
          >
            <DropdownMenuItem onSelect={() => void copyLink()} className="rounded-lg">
              <Link2 /> Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setConfirmDelete(true)}
              className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <RemoveIcon /> Delete article
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {primary}
      </PanelHeader>

      <div className="min-h-0 flex-1 overflow-y-auto @4xl:grid @4xl:grid-cols-[minmax(0,1fr)_20rem] @4xl:overflow-hidden">
        {/* Document */}
        <section className="doc-editor min-w-0 @4xl:overflow-y-auto">
          {showEditor && editor && <EditorToolbar editor={editor} />}
          <div className="mx-auto w-full max-w-[46rem] px-6 pb-24 pt-10 @2xl:px-10">
            {showEditor && stage === "scheduled" && (
              <div className="mb-8 flex gap-3 rounded-card border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-ink">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p>
                  {overdue
                    ? "This article is overdue, so autopilot writes it on its next run"
                    : `Autopilot writes this article${scheduledOn ? ` on ${scheduledOn}` : ""}`}{" "}
                  and will replace this text. Publish it to keep your version.
                </p>
              </div>
            )}

            <TitleField
              value={title}
              onChange={(v) => {
                setTitle(v);
                markEdited();
              }}
              onEnter={() => (showEditor ? editor?.commands.focus("start") : undefined)}
            />

            {showEditor ? (
              <>
                {editor && (
                  <BubbleMenu
                    editor={editor}
                    className="flex items-center gap-1 rounded-card border border-border bg-card p-1 shadow-elevation-lg"
                  >
                    <span className="px-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                      AI
                    </span>
                    {AI_ACTIONS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        disabled={aiBusy !== null}
                        onClick={() => void runAi(a.id)}
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
                <EditorContent editor={editor} className="mt-6" />
              </>
            ) : (
              <NotWrittenYet
                scheduledOn={stage === "scheduled" ? scheduledOn : null}
                overdue={overdue}
                creditsLeft={actions.creditsLeft}
                onStartWriting={startWriting}
              />
            )}
          </div>
        </section>

        {/* Properties */}
        <aside className="border-t border-border bg-secondary/25 @4xl:overflow-y-auto @4xl:border-l @4xl:border-t-0">
          <PanelSection label="SEO">
            {showEditor && (
              <div className="mb-5 flex items-center gap-4">
                <ScoreGauge score={analysis.score} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {analysis.score >= 80
                      ? "Strong — ready to rank."
                      : analysis.score >= 55
                        ? "Good — a few tweaks left."
                        : "Needs work to rank well."}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {passed} of {analysis.checks.length} checks passed
                  </p>
                </div>
              </div>
            )}
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Target keyword
              </span>
              <input
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  markEdited();
                }}
                placeholder="e.g. project management for startups"
                className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 flex items-baseline justify-between text-xs font-medium text-muted-foreground">
                Meta description
                <span
                  className={cn(
                    "tabular-nums",
                    meta.length > META_LIMIT ? "text-destructive" : "font-normal",
                  )}
                >
                  {meta.length}/{META_LIMIT}
                </span>
              </span>
              <textarea
                value={meta}
                onChange={(e) => {
                  setMeta(e.target.value);
                  markEdited();
                }}
                rows={4}
                placeholder="The summary search results show under your title."
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
              />
            </label>
          </PanelSection>

          <PanelSection label="Details">
            <div className="space-y-1">
              <PropertyRow label="Status">
                <StagePill stage={stage} overdue={overdue} />
              </PropertyRow>
              {stage === "scheduled" && (
                <PropertyRow label={overdue ? "Was due" : "Writes on"}>
                  <DayField
                    label={overdue ? "Was due" : "Writes on"}
                    value={blog.scheduled_date}
                    onChange={(day) => void actions.onReschedule(blog, day)}
                  />
                </PropertyRow>
              )}
              {published && (
                <PropertyRow label="Updated">{formatShortDate(blog.updated_at)}</PropertyRow>
              )}
              <PropertyRow label="Est. traffic">
                <TrafficValue value={blog.traffic_estimate ?? 0} className="font-normal" />
              </PropertyRow>
              <PropertyRow label="Competition">
                <DifficultyBar label={blog.competition} />
              </PropertyRow>
              <PropertyRow label="AI signal">
                <AiSignalFlames signal={blog.ai_signal ?? 0} label={false} />
              </PropertyRow>
            </div>
          </PanelSection>

          {showEditor && (
            <>
              <PanelSection label="Content">
                <div className="grid grid-cols-2 gap-2">
                  <Metric label="Words" value={analysis.metrics.words.toLocaleString()} />
                  <Metric label="Read time" value={`${analysis.metrics.readingTime} min`} />
                  <Metric label="Keyword density" value={`${analysis.metrics.keywordDensity}%`} />
                  <Metric
                    label="Headings"
                    value={`${analysis.metrics.h2} H2 · ${analysis.metrics.h3} H3`}
                  />
                  <Metric label="Links" value={String(analysis.metrics.links)} />
                  <Metric label="Readability" value={analysis.metrics.readabilityGrade} />
                </div>
              </PanelSection>
              <PanelSection label="Checklist">
                <ul className="space-y-3">
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
              </PanelSection>
            </>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={(o) => busy !== "delete" && setConfirmDelete(o)}
        title="Delete this article?"
        description={
          <>
            This permanently deletes “{title.trim() || blog.title}” from Rankbox. It can't be
            undone.
          </>
        }
      >
        <Button
          variant="ghost"
          data-autofocus
          onClick={() => setConfirmDelete(false)}
          disabled={busy === "delete"}
        >
          Cancel
        </Button>
        <Button
          onClick={() => void remove()}
          disabled={busy === "delete"}
          className="bg-destructive text-white hover:bg-destructive/90"
        >
          {busy === "delete" && <Loader2 className="h-4 w-4 animate-spin" />}
          Delete article
        </Button>
      </ConfirmDialog>

      <ConfirmDialog
        open={blocked}
        onOpenChange={(o) => !o && blocker.reset?.()}
        title={published ? "Publish your changes?" : "Your latest edits didn't save"}
        description={
          published
            ? "This article is live. If you leave now, the edits you haven't published are discarded."
            : "If you leave now, they're lost."
        }
      >
        <Button
          variant="danger"
          onClick={() => {
            discarded.current = true;
            unsafeRef.current = false;
            blocker.proceed?.();
          }}
        >
          Discard
        </Button>
        <Button variant="ghost" data-autofocus onClick={() => blocker.reset?.()}>
          Keep editing
        </Button>
        <Button
          disabled={saveState === "saving"}
          onClick={async () => {
            const ok = published ? await publishChanges() : await save();
            if (ok) {
              unsafeRef.current = false;
              blocker.proceed?.();
            }
          }}
        >
          {saveState === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
          {published ? "Publish changes" : "Try again"}
        </Button>
      </ConfirmDialog>
    </>
  );
}

/* ── Pieces ─────────────────────────────────────────────────────── */

function SaveStatus({
  published,
  dirty,
  state,
  onRetry,
}: {
  published: boolean;
  dirty: boolean;
  state: SaveState;
  onRetry: () => void;
}) {
  const base =
    "hidden items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground sm:flex";
  if (state === "error") {
    return (
      <span className={cn(base, "text-destructive")}>
        Couldn't save
        <button
          type="button"
          onClick={onRetry}
          className="font-medium underline underline-offset-2"
        >
          Retry
        </button>
      </span>
    );
  }
  if (state === "saving") {
    return (
      <span className={base}>
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> {published ? "Publishing…" : "Saving…"}
      </span>
    );
  }
  if (published) {
    return dirty ? (
      <span className={base}>
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warning" /> Unpublished changes
      </span>
    ) : null;
  }
  if (dirty) {
    return (
      <span className={base}>
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
      </span>
    );
  }
  return state === "saved" ? (
    <span className={base}>
      <Check className="h-3.5 w-3.5 text-success" /> Saved
    </span>
  ) : null;
}

/** The title as the document's first line: grows with the text, Enter moves into the body. */
function TitleField({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.height = "0px";
      el.style.height = `${el.scrollHeight}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\n/g, " "))}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnter();
        }
      }}
      placeholder="Untitled article"
      aria-label="Title"
      className="block w-full resize-none overflow-hidden border-none bg-transparent p-0 text-[2rem] font-semibold leading-[1.2] tracking-tight text-ink outline-none placeholder:text-muted-foreground/40"
    />
  );
}

function NotWrittenYet({
  scheduledOn,
  overdue,
  creditsLeft,
  onStartWriting,
}: {
  /** Set for a scheduled article; null for an idea. */
  scheduledOn: string | null;
  overdue: boolean;
  creditsLeft: number;
  onStartWriting: () => void;
}) {
  return (
    <div className="mt-8 rounded-card border border-dashed border-border">
      <div className="flex items-start gap-4 p-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-card border border-border bg-secondary text-muted-foreground">
          <VoltMark className="h-5 w-5" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-ink">Not written yet</p>
          <p className="text-sm text-muted-foreground">
            {scheduledOn === null
              ? "This idea isn't on the schedule. Write it now, or schedule it for autopilot."
              : overdue
                ? `Autopilot hasn't written this yet — it was due ${scheduledOn}. Write it now to publish it today.`
                : `Autopilot writes this${scheduledOn ? ` on ${scheduledOn}` : " soon"}. Write it now to publish it today.`}{" "}
            It writes from the title, keyword and meta description, so edit those first to steer it.
          </p>
          <p className="pt-1 text-xs text-muted-foreground">
            {creditsLeft > 0
              ? `Writing uses 1 article credit · ${creditsLeft} left this month`
              : "You've used this month's article credits."}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-dashed border-border px-5 py-3 text-sm">
        <span className="text-muted-foreground">Rather write it yourself?</span>
        <button
          type="button"
          onClick={onStartWriting}
          className="font-medium text-ink underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
        >
          Start writing
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <p className="text-sm font-semibold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-[0.68rem] text-muted-foreground">{label}</p>
    </div>
  );
}
