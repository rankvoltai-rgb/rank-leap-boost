import { useEffect, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import type { Blog } from "@/lib/data";
import { Button } from "@/components/dashboard/primitives";
import { ArticleDocument, type ArticleActions } from "@/components/dashboard/ArticleDocument";
import { PanelHeader, type PanelNav } from "@/components/dashboard/article-parts";

/**
 * The article slide-over: 80% of the screen from the right, so the list the
 * user came from stays in view at the edge — the place they return to, and a
 * wide target to click back to it.
 *
 * The open article lives in the URL (?article=), so it survives a refresh,
 * can be shared, and closes with the browser's back button.
 */
export function ArticlePanel({
  articleId,
  blog,
  loading,
  writing,
  nav,
  actions,
}: {
  articleId: string | undefined;
  /** The open article, from the list already in memory — opening costs no fetch. */
  blog: Blog | undefined;
  loading: boolean;
  /** This tab is writing the article right now. */
  writing: boolean;
  nav: PanelNav;
  actions: ArticleActions;
}) {
  const open = !!articleId;

  // Keep rendering the last article while the panel slides out.
  const last = useRef<{ id?: string; blog?: Blog; writing: boolean }>({ writing: false });
  if (articleId) last.current = { id: articleId, blog, writing };
  const shown = last.current;

  // J / K walk the list, but never while the user is typing.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-article-panel]")) return;
      if (target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "j" && nav.onNext) {
        e.preventDefault();
        nav.onNext();
      } else if (e.key === "k" && nav.onPrev) {
        e.preventDefault();
        nav.onPrev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, nav]);

  let body: React.ReactNode;
  if (!shown.blog) {
    body = loading ? <PanelLoading nav={nav} /> : <PanelMissing nav={nav} />;
  } else if (shown.writing || shown.blog.status === "generating") {
    body = <PanelWriting blog={shown.blog} nav={nav} />;
  } else {
    // Keyed so switching articles starts from that article's saved state.
    body = <ArticleDocument key={shown.blog.id} blog={shown.blog} nav={nav} actions={actions} />;
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && nav.onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/25 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none dark:bg-black/60" />
        <DialogPrimitive.Content
          data-article-panel
          aria-describedby={undefined}
          onInteractOutside={(e) => {
            // Toasts float over the overlay; dismissing one shouldn't close the article.
            const target = e.target as Element | null;
            if (target?.closest?.("[data-sonner-toaster]")) e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            // Hand focus back to the row the article was opened from.
            e.preventDefault();
            if (!shown.id) return;
            document
              .querySelector<HTMLElement>(`[data-article-link="${CSS.escape(shown.id)}"]`)
              ?.focus({ preventScroll: true });
          }}
          className="@container fixed inset-0 z-50 flex flex-col overflow-hidden bg-card outline-none ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-200 motion-reduce:animate-none sm:inset-y-2 sm:left-auto sm:right-2 sm:w-[80vw] sm:rounded-card sm:border sm:border-border sm:shadow-elevation-lg"
        >
          <DialogPrimitive.Title className="sr-only">
            {shown.blog?.title || "Article"}
          </DialogPrimitive.Title>
          {body}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ── States ─────────────────────────────────────────────────────── */

function PanelLoading({ nav }: { nav: PanelNav }) {
  return (
    <>
      <PanelHeader nav={nav} />
      <div className="mx-auto w-full max-w-[46rem] space-y-4 px-6 pt-10 @2xl:px-10" aria-busy>
        <div className="skeleton h-9 w-3/4" />
        <div className="skeleton mt-8 h-4 w-full" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-4/5" />
      </div>
    </>
  );
}

function PanelMissing({ nav }: { nav: PanelNav }) {
  return (
    <>
      <PanelHeader nav={nav} />
      <div className="grid flex-1 place-items-center px-6">
        <div className="max-w-sm space-y-3 text-center">
          <p className="text-sm font-semibold text-ink">This article isn't here anymore</p>
          <p className="text-sm text-muted-foreground">
            It may have been deleted, or the link is out of date.
          </p>
          <Button variant="ghost" onClick={nav.onClose}>
            Back to articles
          </Button>
        </div>
      </div>
    </>
  );
}

/** Being written — by this tab or by autopilot. The panel fills in when it's done. */
function PanelWriting({ blog, nav }: { blog: Blog; nav: PanelNav }) {
  return (
    <>
      <PanelHeader nav={nav} stage="writing">
        <Button variant="brand" disabled>
          <Loader2 className="h-4 w-4 animate-spin" /> Writing…
        </Button>
      </PanelHeader>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[46rem] px-6 pb-24 pt-10 @2xl:px-10" aria-busy>
          <h2 className="text-[2rem] font-semibold leading-[1.2] tracking-tight text-ink">
            {blog.title}
          </h2>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <Loader2 className="h-4 w-4 animate-spin" />
            Writing your article. This usually takes under a minute — it keeps going if you close
            this.
          </p>
          <div className="mt-10 space-y-3">
            {["w-full", "w-11/12", "w-4/5", "w-full", "w-3/4"].map((w, i) => (
              <div key={i} className={`skeleton h-4 ${w}`} />
            ))}
            <div className="skeleton !mt-8 h-6 w-1/2" />
            {["w-full", "w-10/12", "w-11/12", "w-2/3"].map((w, i) => (
              <div key={i} className={`skeleton h-4 ${w}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
