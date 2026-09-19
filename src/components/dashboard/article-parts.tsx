import { useState, type ReactNode } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Undo2,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatShortDate } from "@/lib/format-date";
import { dateKey, parseDateKey } from "@/components/dashboard/queue-plan";
import { Pill } from "@/components/dashboard/primitives";
import type { Stage } from "@/components/dashboard/article-stages";
import { cn } from "@/lib/utils";

/* ── Pipeline stage ─────────────────────────────────────────────── */

export function StagePill({ stage, overdue }: { stage: Stage; overdue?: boolean }) {
  if (stage === "writing") {
    return (
      <Pill tone="info">
        <Loader2 className="h-3 w-3 animate-spin" /> Writing
      </Pill>
    );
  }
  if (stage === "published") return <Pill tone="success">Published</Pill>;
  if (stage === "scheduled") {
    return overdue ? <Pill tone="warning">Overdue</Pill> : <Pill tone="neutral">Scheduled</Pill>;
  }
  // Dashed: an idea is a candidate, not yet a commitment.
  return (
    <Pill tone="neutral" className="border-dashed">
      Idea
    </Pill>
  );
}

/* ── Panel chrome ───────────────────────────────────────────────── */

export function IconButton({
  label,
  shortcut,
  onClick,
  disabled,
  children,
}: {
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={shortcut ? `${label} (${shortcut})` : label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}

export interface PanelNav {
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Zero-based position in the list the arrows walk, when there is one. */
  position?: { index: number; total: number } | null;
}

/**
 * The slide-over's top bar. Leaving controls sit on the left, nearest the list
 * the user came from; the article's own actions sit on the right.
 */
export function PanelHeader({
  nav,
  stage,
  overdue,
  children,
}: {
  nav: PanelNav;
  stage?: Stage;
  overdue?: boolean;
  children?: ReactNode;
}) {
  const { position } = nav;
  return (
    <header className="flex h-14 shrink-0 items-center gap-1 border-b border-border px-3 sm:px-4">
      <IconButton label="Close" shortcut="Esc" onClick={nav.onClose}>
        <X className="h-4 w-4" />
      </IconButton>
      <span aria-hidden className="mx-1.5 h-5 w-px bg-border" />
      <IconButton label="Previous article" shortcut="K" onClick={nav.onPrev} disabled={!nav.onPrev}>
        <ChevronUp className="h-4 w-4" />
      </IconButton>
      <IconButton label="Next article" shortcut="J" onClick={nav.onNext} disabled={!nav.onNext}>
        <ChevronDown className="h-4 w-4" />
      </IconButton>
      {position && position.total > 1 && (
        <span className="ml-1 hidden text-xs tabular-nums text-muted-foreground sm:inline">
          {position.index + 1} of {position.total}
        </span>
      )}
      {stage && (
        <span className="ml-3 hidden sm:inline-flex">
          <StagePill stage={stage} overdue={overdue} />
        </span>
      )}
      <div className="ml-auto flex min-w-0 items-center gap-2">{children}</div>
    </header>
  );
}

/* ── Properties rail ────────────────────────────────────────────── */

export function PanelSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-b border-border px-5 py-5 last:border-b-0">
      <h3 className="mb-3 text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
        {label}
      </h3>
      {children}
    </section>
  );
}

export function PropertyRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-8 items-center gap-3 text-sm">
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1 text-ink">{children}</div>
    </div>
  );
}

export function ScoreGauge({ score, size = 64 }: { score: number; size?: number }) {
  const tone =
    score >= 80 ? "var(--success)" : score >= 55 ? "var(--warning)" : "var(--destructive)";
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  return (
    <div
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80" aria-hidden>
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
          strokeDashoffset={circ - (score / 100) * circ}
          className="transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute text-lg font-semibold tabular-nums text-ink">{score}</span>
    </div>
  );
}

/**
 * A day, editable in place: reads as plain text until hovered, opens a month
 * picker on click. Past days are off the table — autopilot can't write there.
 */
export function DayField({
  value,
  onChange,
  label,
}: {
  value: string | null;
  onChange: (day: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={`${label}: ${value ? formatShortDate(value) : "not set"}. Change`}
        className="-mx-2 rounded-md border border-transparent px-2 py-1 text-left text-sm text-ink transition-colors hover:border-border hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:border-border data-[state=open]:bg-card"
      >
        {value ? formatShortDate(value) : "Pick a day"}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto rounded-card border-border p-0 shadow-elevation-lg"
      >
        <Calendar
          mode="single"
          selected={value ? parseDateKey(value) : undefined}
          defaultMonth={value && parseDateKey(value) >= today ? parseDateKey(value) : today}
          disabled={{ before: today }}
          onSelect={(date) => {
            if (!date) return;
            setOpen(false);
            onChange(dateKey(date));
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/* ── Confirmation ───────────────────────────────────────────────── */

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  body,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  /** Block content below the description (the description itself is a paragraph). */
  body?: ReactNode;
  /** The buttons, primary action last. Mark the safe one with data-autofocus. */
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md gap-0 border-border bg-card p-0"
        onOpenAutoFocus={(e) => {
          // Radix would focus the first button — often the destructive one, one
          // stray Enter from disaster. Land on the button marked safe instead.
          const safe = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(
            "[data-autofocus]",
          );
          if (safe) {
            e.preventDefault();
            safe.focus();
          }
        }}
      >
        <div className="space-y-1.5 px-6 pt-6">
          <DialogTitle className="text-base font-semibold tracking-tight text-ink">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
          {body && <div className="pt-2">{body}</div>}
        </div>
        <div className="flex flex-col-reverse gap-2 px-6 pb-6 pt-5 sm:flex-row sm:justify-end">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Formatting toolbar ─────────────────────────────────────────── */

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      // Keep the editor's selection: a toolbar click must not blur it.
      onMouseDown={(e) => e.preventDefault()}
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

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-border" />;
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  // TipTap 3 doesn't re-render on selection changes; subscribe to the marks the
  // toolbar reflects so its active states follow the cursor.
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      focused: e.isFocused,
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
    }),
  });

  function editLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
      <div
        role="toolbar"
        aria-label="Formatting"
        className="mx-auto flex h-11 w-full max-w-[46rem] items-center gap-0.5 overflow-x-auto px-4 @2xl:px-8"
      >
        <ToolbarButton
          label="Bold"
          active={active.focused && active.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={active.focused && active.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          label="Heading 2"
          active={active.focused && active.h2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={active.focused && active.h3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          label="Bullet list"
          active={active.focused && active.bullet}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={active.focused && active.ordered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={active.focused && active.quote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Link" active={active.focused && active.link} onClick={editLink}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}
