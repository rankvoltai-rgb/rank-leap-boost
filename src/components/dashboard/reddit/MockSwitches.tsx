/**
 * Mock-only. Lets a reviewer see the page as each kind of account without
 * waiting for one to exist — the gate, the lapsed banner and the unconfigured
 * card are all states that are otherwise awkward to reach on purpose.
 */
import {
  getMockRedditSwitches,
  setMockRedditAccess,
  setMockRedditProvider,
  type RedditAccess,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const VIEWS: Array<{ id: RedditAccess | null; label: string }> = [
  { id: null, label: "As is" },
  { id: "none", label: "No plan" },
  { id: "trial", label: "Trial" },
  { id: "paid", label: "Paid" },
  { id: "lapsed", label: "Lapsed" },
];

export function MockSwitches({ onChanged }: { onChanged: () => void }) {
  const current = getMockRedditSwitches();
  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium transition-colors",
      active
        ? "border-ink bg-ink text-background"
        : "border-border bg-card text-muted-foreground hover:text-ink",
    );
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-card border border-dashed border-border px-3 py-2">
      <span className="mr-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        Mock · view as
      </span>
      {VIEWS.map((v) => (
        <button
          key={v.label}
          type="button"
          className={chip(current.access === v.id)}
          onClick={() => void setMockRedditAccess(v.id).then(onChanged)}
        >
          {v.label}
        </button>
      ))}
      <span className="mx-1 h-4 w-px bg-border" />
      <button
        type="button"
        className={chip(!current.provider)}
        onClick={() => void setMockRedditProvider(!current.provider).then(onChanged)}
      >
        No provider
      </button>
    </div>
  );
}
