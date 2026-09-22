/**
 * Demand: the pages on this site the member wants links pointed at, and what
 * has arrived.
 */
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button, EmptyState, Panel, Pill } from "@/components/dashboard/primitives";
import { AddIcon, TargetIcon } from "@/components/dashboard/icons";
import { ConfirmDialog } from "@/components/dashboard/article-parts";
import { useSiteId } from "@/components/dashboard/site-context";
import {
  createExchangeTarget,
  deleteExchangeTarget,
  listExchangeTargets,
  listInboundPlacements,
  updateExchangeTarget,
  type ExchangeOverview,
  type ExchangeTarget,
  type InboundPlacement,
  type TargetInput,
} from "@/lib/data";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { inputClass, plural, shortUrl } from "./format";
import { ChipInput, Field, StatusPill } from "./shared";

const EMPTY: TargetInput = {
  url: "",
  anchors: [],
  topicTags: [],
  priority: 5,
  maxNewLinksPerMonth: 4,
  active: true,
};

function daysSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 86_400_000));
}

export function TargetsTab({
  overview,
  readOnly,
}: {
  overview: ExchangeOverview;
  readOnly?: boolean;
}) {
  const siteId = useSiteId();
  const queryClient = useQueryClient();
  const { data: targets = [], isLoading } = useQuery({
    queryKey: ["exchange", siteId, "targets"],
    queryFn: () => listExchangeTargets(siteId),
  });
  const { data: inbound = [] } = useQuery({
    queryKey: ["exchange", siteId, "inbound"],
    queryFn: () => listInboundPlacements(siteId),
    refetchInterval: 30_000,
  });
  const [editing, setEditing] = useState<ExchangeTarget | "new" | null>(null);
  const [removing, setRemoving] = useState<ExchangeTarget | null>(null);
  const domain = overview.site?.domain ?? "";

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["exchange", siteId, "targets"] }),
      queryClient.invalidateQueries({ queryKey: ["exchange", siteId, "overview"] }),
    ]);
  }

  async function toggle(t: ExchangeTarget) {
    try {
      await updateExchangeTarget(siteId, { id: t.id, patch: { active: !t.active } });
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update the target.");
    }
  }

  async function remove(t: ExchangeTarget) {
    try {
      const r = await deleteExchangeTarget(siteId, { id: t.id });
      toast.success(
        r.deleted ? "Target removed." : "Target paused — its live links stay where they are.",
      );
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove the target.");
    }
  }

  const byTarget = new Map<string, InboundPlacement[]>();
  for (const p of inbound) byTarget.set(p.targetId, [...(byTarget.get(p.targetId) ?? []), p]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Pages you want links to</h2>
          <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-muted-foreground">
            Each target is a page on {domain || "your site"} with a few ways to link to it. The
            matcher places one link at a time, in the most relevant member article it can find, and
            never the same anchor twice from one domain.
          </p>
        </div>
        {!readOnly && editing === null && (
          <Button variant="brand" onClick={() => setEditing("new")} disabled={targets.length >= 25}>
            <AddIcon className="h-4 w-4" /> Add a target
          </Button>
        )}
      </div>

      {editing !== null && (
        <TargetForm
          domain={domain}
          initial={editing === "new" ? EMPTY : editing}
          onCancel={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refresh();
          }}
        />
      )}

      {isLoading ? (
        <div className="skeleton h-32 w-full" />
      ) : targets.length === 0 && editing === null ? (
        <EmptyState
          icon={<TargetIcon className="h-5 w-5" />}
          title="Add the page you want ranked"
          description="Your best product page, a cornerstone guide — the page a link would move most. Credits are only spent when a link to it is verified live."
          action={
            !readOnly ? (
              <Button variant="brand" onClick={() => setEditing("new")}>
                <AddIcon className="h-4 w-4" /> Add a target
              </Button>
            ) : undefined
          }
        />
      ) : (
        targets.map((t) => {
          const placements = byTarget.get(t.id) ?? [];
          const live = placements.filter((p) => p.status === "live").length;
          const pending = placements.filter(
            (p) => p.status === "reserved" || p.status === "placed",
          ).length;
          const waiting = t.active && pending === 0;
          return (
            <Panel key={t.id} className={cn("divide-y divide-border", !t.active && "opacity-70")}>
              <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-semibold text-ink underline-offset-2 hover:underline"
                    >
                      {shortUrl(t.url)}
                    </a>
                    {!t.active ? (
                      <Pill tone="neutral">Paused</Pill>
                    ) : waiting ? (
                      <Pill tone="info">
                        Waiting for a relevant host · {plural(daysSince(t.queuedSince), "day")}
                      </Pill>
                    ) : (
                      <Pill tone="warning">{plural(pending, "link")} in progress</Pill>
                    )}
                    {live > 0 && <Pill tone="success">{plural(live, "live link")}</Pill>}
                  </div>
                  <p className="mt-1.5 flex flex-wrap gap-1.5">
                    {t.anchors.map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs text-ink"
                      >
                        “{a}”
                      </span>
                    ))}
                  </p>
                  {t.topicTags.length > 0 && (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Topics: {t.topicTags.join(", ")} · up to {t.maxNewLinksPerMonth}/month ·
                      priority {t.priority}
                    </p>
                  )}
                </div>
                {!readOnly && (
                  <div className="flex shrink-0 gap-1.5">
                    <Button
                      variant="ghost"
                      className="px-2.5 py-1.5 text-xs"
                      onClick={() => setEditing(t)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2.5 py-1.5 text-xs"
                      onClick={() => void toggle(t)}
                    >
                      {t.active ? "Pause" : "Resume"}
                    </Button>
                    <Button
                      variant="danger"
                      className="px-2.5 py-1.5 text-xs"
                      onClick={() => setRemoving(t)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
              {placements.length > 0 && (
                <div className="divide-y divide-border">
                  {placements.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-6"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-ink">
                          “{p.anchor}” from <span className="font-medium">{p.hostDomain}</span>
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            tier {p.hostTier} · {plural(p.credits, "credit")}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.status === "live" && p.hostUrl ? (
                            <a
                              href={p.hostUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline-offset-2 hover:underline"
                            >
                              {shortUrl(p.hostUrl)}
                            </a>
                          ) : p.status === "live" ? (
                            `live since ${formatShortDate(p.liveAt)}`
                          ) : p.endReason ? (
                            p.endReason
                          ) : (
                            `reserved ${formatShortDate(p.reservedAt)}`
                          )}
                        </p>
                      </div>
                      <StatusPill status={p.status} />
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          );
        })
      )}

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(o) => !o && setRemoving(null)}
        title="Remove this target?"
        description="Links in progress are cancelled and their credits returned. Links already live in other members' articles stay — they can't be taken back."
      >
        <Button variant="ghost" data-autofocus onClick={() => setRemoving(null)}>
          Keep it
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            if (removing) await remove(removing);
            setRemoving(null);
          }}
        >
          Remove target
        </Button>
      </ConfirmDialog>
    </div>
  );
}

function TargetForm({
  domain,
  initial,
  onCancel,
  onSaved,
}: {
  domain: string;
  initial: TargetInput | ExchangeTarget;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}) {
  const siteId = useSiteId();
  const isEdit = "id" in initial;
  const [url, setUrl] = useState(initial.url);
  const [anchors, setAnchors] = useState<string[]>(initial.anchors);
  const [tags, setTags] = useState<string[]>(initial.topicTags);
  const [priority, setPriority] = useState(initial.priority);
  const [perMonth, setPerMonth] = useState(initial.maxNewLinksPerMonth);
  const [busy, setBusy] = useState(false);

  const valid = /^https?:\/\//i.test(url.trim()) && anchors.length >= 3;

  async function save() {
    setBusy(true);
    try {
      const data: TargetInput = {
        url: url.trim(),
        anchors,
        topicTags: tags,
        priority,
        maxNewLinksPerMonth: perMonth,
        active: "active" in initial ? initial.active : true,
      };
      if (isEdit) await updateExchangeTarget(siteId, { id: initial.id, patch: data });
      else await createExchangeTarget(siteId, data);
      toast.success(
        isEdit ? "Target updated." : "Target added. The matcher will place it as hosts come up.",
      );
      await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the target.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel className="space-y-5 p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-ink">{isEdit ? "Edit target" : "New target"}</h3>
      <Field
        label="Page URL"
        htmlFor="target-url"
        hint={`Must be on ${domain || "your verified domain"}.`}
      >
        <input
          id="target-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v && !/^https?:\/\//i.test(v)) setUrl(`https://${v}`);
          }}
          placeholder={`https://${domain || "example.com"}/your-best-page`}
          inputMode="url"
          className={inputClass}
        />
      </Field>
      <Field
        label="Anchor texts"
        htmlFor="target-anchors"
        hint="Three to five natural phrases a writer might link with. They rotate, so no two hosts use the same one. Press Enter after each."
      >
        <ChipInput
          id="target-anchors"
          values={anchors}
          onChange={setAnchors}
          placeholder="e.g. project management guide"
          max={5}
        />
      </Field>
      <Field
        label="Topics"
        htmlFor="target-tags"
        hint="What the page is about, in a few tags. This is how the matcher finds articles it belongs in."
      >
        <ChipInput
          id="target-tags"
          values={tags}
          onChange={setTags}
          placeholder="e.g. sprint planning"
          max={10}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Priority"
          htmlFor="target-priority"
          hint="Higher gets matched first among your own targets."
        >
          <select
            id="target-priority"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className={inputClass}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
                {n === 10 ? " — highest" : n === 1 ? " — lowest" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="New links per month"
          htmlFor="target-velocity"
          hint="A cap, not a promise. Slow and steady looks natural; 4 is a good default."
        >
          <select
            id="target-velocity"
            value={perMonth}
            onChange={(e) => setPerMonth(Number(e.target.value))}
            className={inputClass}
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
              <option key={n} value={n}>
                up to {n}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button variant="brand" onClick={() => void save()} disabled={!valid || busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Add target"}
        </Button>
      </div>
    </Panel>
  );
}
