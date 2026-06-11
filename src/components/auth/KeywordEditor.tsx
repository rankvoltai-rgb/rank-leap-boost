import { useState } from "react";
import { Plus, X } from "lucide-react";

export const SEED_KEYWORDS = [
  "ai seo tools",
  "automated content writing",
  "rank on chatgpt",
  "programmatic seo",
  "best blog automation",
  "get cited by ai",
];

export function KeywordEditor({
  keywords,
  onChange,
}: {
  keywords: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim().toLowerCase();
    if (!value || keywords.includes(value)) return;
    onChange([...keywords, value]);
    setDraft("");
  }

  function remove(word: string) {
    onChange(keywords.filter((w) => w !== word));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((word) => (
          <span
            key={word}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-ink"
          >
            {word}
            <button
              type="button"
              onClick={() => remove(word)}
              aria-label={`Remove ${word}`}
              className="text-muted-foreground transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Add a keyword"
          className="h-11 flex-1 rounded-xl border border-border bg-card px-3.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink focus:ring-2 focus:ring-ink/10"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-secondary"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}