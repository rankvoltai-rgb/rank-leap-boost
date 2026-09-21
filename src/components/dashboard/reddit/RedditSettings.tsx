/**
 * Reddit settings. One of these is not really a setting: the disclosure line
 * can be reworded but never removed, and the form says why.
 */
import { useState } from "react";
import { toast } from "sonner";
import { Button, Panel } from "@/components/dashboard/primitives";
import { updateRedditSettings, type RedditSettings as Settings } from "@/lib/data";
import { isValidDisclosureLine, resolveDisclosure } from "@/lib/reddit/compliance";
import { cn } from "@/lib/utils";
import { inputClass } from "./format";
import { ChipInput, Field } from "./shared";

export function RedditSettings({
  settings,
  brandName,
  onChanged,
}: {
  settings: Settings;
  brandName: string;
  onChanged: () => void;
}) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const disclosureOk = isValidDisclosureLine(form.disclosureLine, brandName);
  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  async function save() {
    setSaving(true);
    try {
      await updateRedditSettings({
        sweepEnabled: form.sweepEnabled,
        niche: form.niche ?? "",
        topicTags: form.topicTags,
        disclosureLine: form.disclosureLine,
        tone: form.tone,
        maxLinksPerReply: form.maxLinksPerReply,
        allowSubreddits: form.allowSubreddits,
        denySubreddits: form.denySubreddits,
      });
      toast.success("Saved. Your threads have been re-ranked.");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save that.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Panel className="space-y-5 p-5">
        <Field
          label="Disclosure line"
          htmlFor="reddit-disclosure"
          hint={
            <>
              Every draft includes this. It can&rsquo;t be turned off — undisclosed promotion is
              what gets replies removed and accounts banned. Use <code>{"{brand}"}</code> for your
              brand name.
              {disclosureOk ? (
                <span className="mt-1 block text-ink">
                  Reads as: &ldquo;{resolveDisclosure(form.disclosureLine, brandName)}&rdquo;
                </span>
              ) : (
                <span className="mt-1 block font-medium text-destructive">
                  It has to name {brandName} and say, in the first person, that you work on it.
                </span>
              )}
            </>
          }
        >
          <input
            id="reddit-disclosure"
            required
            value={form.disclosureLine}
            onChange={(e) => set("disclosureLine", e.target.value)}
            aria-invalid={!disclosureOk}
            className={cn(inputClass, !disclosureOk && "border-destructive/50")}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Your space"
            htmlFor="reddit-niche"
            hint="What you know enough about to be useful on."
          >
            <input
              id="reddit-niche"
              value={form.niche ?? ""}
              onChange={(e) => set("niche", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Links per reply"
            htmlFor="reddit-links"
            hint="A reply has to stand on its own either way."
          >
            <select
              id="reddit-links"
              value={form.maxLinksPerReply}
              onChange={(e) => set("maxLinksPerReply", Number(e.target.value))}
              className={inputClass}
            >
              <option value={0}>None</option>
              <option value={1}>One at most</option>
            </select>
          </Field>
        </div>

        <Field
          label="Topics"
          htmlFor="reddit-topics"
          hint="Used to judge whether a thread is one you can help in."
        >
          <ChipInput
            id="reddit-topics"
            values={form.topicTags}
            onChange={(v) => set("topicTags", v)}
            placeholder="kanban, sprint planning…"
            max={12}
          />
        </Field>
      </Panel>

      <Panel className="space-y-5 p-5">
        <Field
          label="Never these subreddits"
          htmlFor="reddit-deny"
          hint="Threads here are set aside, whatever they rank for."
        >
          <ChipInput
            id="reddit-deny"
            values={form.denySubreddits}
            onChange={(v) => set("denySubreddits", v)}
            placeholder="r/…"
            max={50}
          />
        </Field>
        <Field
          label="Only these subreddits"
          htmlFor="reddit-allow"
          hint="Leave empty to consider every subreddit. Subreddits that ban self-promotion are excluded automatically, and listing one here doesn't bring it back."
        >
          <ChipInput
            id="reddit-allow"
            values={form.allowSubreddits}
            onChange={(v) => set("allowSubreddits", v)}
            placeholder="r/…"
            max={50}
          />
        </Field>
      </Panel>

      <Panel className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">Weekly sweep</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Searches Google and Reddit for your tracked keywords once a week. Free — only drafts
            spend credits.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.sweepEnabled}
          aria-label="Weekly sweep"
          onClick={() => set("sweepEnabled", !form.sweepEnabled)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            form.sweepEnabled ? "bg-brand-blue" : "bg-border",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left]",
              form.sweepEnabled ? "left-[1.375rem]" : "left-0.5",
            )}
          />
        </button>
      </Panel>

      <div className="flex justify-end">
        <Button onClick={() => void save()} disabled={!dirty || saving || !disclosureOk}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
