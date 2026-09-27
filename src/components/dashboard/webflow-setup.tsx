/**
 * The Webflow overlay: connect through Webflow OAuth, pick a collection, match
 * its fields once, then every finished article is pushed into it server-side.
 *
 * Everything Webflow-side (sites, collections, fields) is read live through
 * the server and labelled with when it was fetched, with a refresh, as the
 * Webflow Marketplace guidelines ask. The token never reaches the browser.
 */
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWebflowStatus, webflowStatusKey } from "@/components/dashboard/webflow-status";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  disconnectWebflow,
  getWebflowFields,
  listWebflowCollections,
  listWebflowSites,
  saveWebflowSetup,
  startWebflowConnect,
  syncWebflowNow,
  TRIAL_DAYS,
  type WebflowFieldMap,
  type WebflowStatus,
} from "@/lib/data";
import { candidatesFor, checkFieldMap, ROLE_KEYS, ROLES, type Role } from "@/lib/webflow/fields";
import { Button, Pill } from "@/components/dashboard/primitives";
import { CheckIcon } from "@/components/dashboard/icons";
import { ConfirmDialog } from "@/components/dashboard/article-parts";
import { timeAgo } from "@/components/dashboard/connection-model";
import { cn } from "@/lib/utils";

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

function message(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}

const READ_ON_DEMAND = { staleTime: Infinity, refetchOnWindowFocus: false } as const;

const INPUT =
  "h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-60";

export function WebflowSetup({
  siteId,
  locked,
  onStartTrial,
  onUseApi,
}: {
  siteId: string;
  locked: boolean;
  onStartTrial: () => void;
  onUseApi: () => void;
}) {
  const { data: status, isLoading, error } = useWebflowStatus(siteId);
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking your Webflow connection…
      </p>
    );
  }
  if (error || !status) {
    return (
      <p className="text-sm text-destructive">
        {message(error, "Couldn't load your Webflow connection.")}
      </p>
    );
  }
  if (!status.configured) {
    return (
      <div className="space-y-3 rounded-card bg-secondary/50 p-5">
        <p className="text-sm font-semibold text-ink">
          Connecting Webflow isn't available right now
        </p>
        <p className="text-sm text-muted-foreground">
          Any Webflow site can still pull its articles from Rankbox with the API.
        </p>
        <Button variant="brand" onClick={onUseApi}>
          Connect with the API
        </Button>
      </div>
    );
  }

  const conn = status.connection;
  const connected = !!conn?.connected;
  const mapped = connected && !!conn.collectionId && conn.status !== "setup";

  return (
    <div className="space-y-6">
      {conn && !connected && conn.lastError && <Notice tone="warning">{conn.lastError}</Notice>}
      <ol className="space-y-6">
        <Step n={1} title="Connect Webflow" done={connected}>
          {connected ? (
            <ConnectedLine siteId={siteId} status={status} />
          ) : (
            <ConnectButton siteId={siteId} locked={locked} onStartTrial={onStartTrial} />
          )}
        </Step>

        {mapped && !editing ? (
          <Step n={2} title="Publishing" done>
            <Publishing siteId={siteId} status={status} onEdit={() => setEditing(true)} />
          </Step>
        ) : (
          <Step
            n={2}
            title="Choose your collection and match its fields"
            done={false}
            muted={!connected}
          >
            {connected ? (
              <MappingForm
                siteId={siteId}
                status={status}
                onSaved={() => setEditing(false)}
                onCancel={mapped ? () => setEditing(false) : undefined}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Pick the CMS collection your blog uses and tell Rankbox which field holds what. Your
                collection template does the layout.
              </p>
            )}
          </Step>
        )}
      </ol>

      {!connected && (
        <p className="text-xs text-muted-foreground">
          Rather wire it up yourself?{" "}
          <button
            type="button"
            onClick={onUseApi}
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            Use the API instead
          </button>
        </p>
      )}
    </div>
  );
}

/* ── Connect ────────────────────────────────────────────────────── */

function ConnectButton({
  siteId,
  locked,
  onStartTrial,
}: {
  siteId: string;
  locked: boolean;
  onStartTrial: () => void;
}) {
  const [busy, setBusy] = useState(false);

  if (locked) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Publishing to your site comes with your plan. Start your {TRIAL_DAYS}-day free trial to
          connect Webflow.
        </p>
        <Button variant="brand" onClick={onStartTrial}>
          Start free trial
        </Button>
      </div>
    );
  }

  async function connect() {
    setBusy(true);
    try {
      const { url } = await startWebflowConnect(siteId);
      window.location.assign(url);
    } catch (err) {
      setBusy(false);
      toast.error(message(err, "Couldn't start connecting to Webflow."));
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Webflow asks which sites Rankbox may publish to. Rankbox only reads your collections and
        creates and updates the blog items it writes. It never changes your design, pages, or other
        items.
      </p>
      <Button variant="brand" onClick={() => void connect()} disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Connect Webflow
      </Button>
    </div>
  );
}

function ConnectedLine({ siteId, status }: { siteId: string; status: WebflowStatus }) {
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const conn = status.connection!;

  async function disconnect() {
    setBusy(true);
    try {
      await disconnectWebflow(siteId);
      await queryClient.invalidateQueries({ queryKey: webflowStatusKey(siteId) });
      toast.success("Webflow disconnected.");
      setConfirm(false);
    } catch (err) {
      toast.error(message(err, "Couldn't disconnect Webflow."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Connected{conn.webflowSiteName ? ` to ${conn.webflowSiteName}` : ""}.{" "}
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="font-medium text-ink underline-offset-4 hover:underline"
        >
          Disconnect
        </button>
      </p>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Disconnect Webflow?"
        description="Rankbox stops publishing to Webflow and deletes its access. Items already in your collection stay exactly as they are. Reconnect any time and it picks up where it left off."
      >
        <Button variant="ghost" data-autofocus onClick={() => setConfirm(false)}>
          Cancel
        </Button>
        <Button
          className="bg-destructive text-white hover:bg-destructive/90"
          disabled={busy}
          onClick={() => void disconnect()}
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Disconnect
        </Button>
      </ConfirmDialog>
    </>
  );
}

/* ── Collection + fields ────────────────────────────────────────── */

function MappingForm({
  siteId,
  status,
  onSaved,
  onCancel,
}: {
  siteId: string;
  status: WebflowStatus;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const queryClient = useQueryClient();
  const conn = status.connection!;
  const [webflowSiteId, setWebflowSiteId] = useState<string | null>(conn.webflowSiteId);
  const [collectionId, setCollectionId] = useState<string | null>(conn.collectionId);
  const [map, setMap] = useState<WebflowFieldMap | null>(null);
  const [mode, setMode] = useState<"live" | "draft">(conn.publishMode);
  const [saving, setSaving] = useState(false);

  // Read from Webflow when asked (open, pick, Refresh), not on every tab
  // focus: each read spends the user's Webflow rate limit, and a refetch must
  // never reset a mapping they're halfway through.
  const sites = useQuery({
    queryKey: ["webflow-sites", siteId],
    queryFn: () => listWebflowSites(siteId),
    ...READ_ON_DEMAND,
  });
  // One authorized site: nothing to choose.
  useEffect(() => {
    const list = sites.data?.sites ?? [];
    if (!webflowSiteId && list.length === 1) setWebflowSiteId(list[0].id);
  }, [sites.data, webflowSiteId]);

  const collections = useQuery({
    queryKey: ["webflow-collections", siteId, webflowSiteId],
    queryFn: () => listWebflowCollections(siteId, webflowSiteId!),
    enabled: !!webflowSiteId,
    ...READ_ON_DEMAND,
  });

  const fields = useQuery({
    queryKey: ["webflow-fields", siteId, webflowSiteId, collectionId],
    queryFn: () => getWebflowFields(siteId, webflowSiteId!, collectionId!),
    enabled: !!webflowSiteId && !!collectionId,
    ...READ_ON_DEMAND,
  });
  // A newly chosen collection brings its own suggestion, and the user's edits
  // start from it. A refresh of the same collection keeps their edits; the
  // check below re-validates them against the fresh schema.
  const [seededFor, setSeededFor] = useState<string | null>(null);
  useEffect(() => {
    if (fields.data && fields.data.collection.id !== seededFor) {
      setMap(fields.data.suggested);
      setSeededFor(fields.data.collection.id);
    }
  }, [fields.data, seededFor]);

  const check = useMemo(
    () => (fields.data && map ? checkFieldMap(fields.data.fields, map) : null),
    [fields.data, map],
  );

  function refresh() {
    void sites.refetch();
    if (webflowSiteId) void collections.refetch();
    if (collectionId) void fields.refetch();
  }

  async function save() {
    if (!webflowSiteId || !collectionId || !map) return;
    setSaving(true);
    try {
      await saveWebflowSetup({
        siteId,
        webflowSiteId,
        collectionId,
        fieldMap: map,
        publishMode: mode,
      });
      await queryClient.invalidateQueries({ queryKey: webflowStatusKey(siteId) });
      toast.success("Saved. New articles now go straight to Webflow.");
      onSaved();
    } catch (err) {
      toast.error(message(err, "Couldn't save your Webflow setup."));
    } finally {
      setSaving(false);
    }
  }

  const fetchedAt = fields.data?.fetchedAt ?? collections.data?.fetchedAt ?? sites.data?.fetchedAt;
  const loadError = sites.error ?? collections.error ?? fields.error;
  const siteList = sites.data?.sites ?? [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Webflow site</span>
          <select
            className={INPUT}
            value={webflowSiteId ?? ""}
            disabled={sites.isLoading}
            onChange={(e) => {
              setWebflowSiteId(e.target.value || null);
              setCollectionId(null);
              setMap(null);
              setSeededFor(null);
            }}
          >
            <option value="">{sites.isLoading ? "Loading…" : "Choose a site"}</option>
            {siteList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.displayName}
                {s.domain ? ` (${s.domain})` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Blog collection</span>
          <select
            className={INPUT}
            value={collectionId ?? ""}
            disabled={!webflowSiteId || collections.isLoading}
            onChange={(e) => {
              setCollectionId(e.target.value || null);
              setMap(null);
              setSeededFor(null);
            }}
          >
            <option value="">{collections.isLoading ? "Loading…" : "Choose a collection"}</option>
            {(collections.data?.collections ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.displayName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {sites.data && siteList.length === 0 && (
        <Notice tone="warning">
          Rankbox can't see any Webflow sites. Disconnect, connect again, and tick your site on
          Webflow's screen.
        </Notice>
      )}
      {collections.data && collections.data.collections.length === 0 && (
        <Notice tone="warning">
          This site has no CMS collections yet. Add a blog collection in Webflow, then refresh.
        </Notice>
      )}
      {loadError && (
        <Notice tone="danger">{message(loadError, "Couldn't read from Webflow.")}</Notice>
      )}

      {fields.isLoading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Reading the collection's fields…
        </p>
      )}

      {fields.data && map && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">From Rankbox</th>
                  <th className="px-3 py-2 font-medium">Into your Webflow field</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <FixedRow from="Title" to="Name" />
                <FixedRow from="Slug" to="Slug (kept once published, so links never break)" />
                {ROLE_KEYS.map((role) => (
                  <RoleRow
                    key={role}
                    role={role}
                    value={map[role]}
                    options={candidatesFor(fields.data.fields, role)}
                    onChange={(slug) => setMap({ ...map, [role]: slug })}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {check && !check.ok && (
            <ul className="space-y-1">
              {check.problems.map((p) => (
                <li key={p} className="text-sm text-destructive">
                  {p}
                </li>
              ))}
            </ul>
          )}

          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-muted-foreground">New articles go</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["live", "Live on your site", "Published the moment they're written."],
                  ["draft", "To drafts", "Saved as drafts to review and publish in Webflow."],
                ] as const
              ).map(([value, label, hint]) => (
                <label
                  key={value}
                  className={cn(
                    "flex min-w-[12rem] flex-1 cursor-pointer gap-2.5 rounded-lg border p-3",
                    mode === value ? "border-cta bg-cta/5" : "border-border hover:bg-secondary/50",
                  )}
                >
                  <input
                    type="radio"
                    name="webflow-mode"
                    className="mt-0.5 accent-[var(--cta)]"
                    checked={mode === value}
                    onChange={() => setMode(value)}
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink">{label}</span>
                    <span className="block text-xs text-muted-foreground">{hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="brand" disabled={!check?.ok || saving} onClick={() => void save()}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {conn.status === "setup" ? "Start publishing" : "Save"}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
        {fetchedAt && (
          <p className="text-xs text-muted-foreground">
            Read from Webflow {timeAgo(fetchedAt)}.{" "}
            <button
              type="button"
              onClick={refresh}
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              Refresh
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

function FixedRow({ from, to }: { from: string; to: string }) {
  return (
    <tr>
      <td className="px-3 py-2.5 text-ink">{from}</td>
      <td className="px-3 py-2.5 text-muted-foreground">{to}</td>
    </tr>
  );
}

function RoleRow({
  role,
  value,
  options,
  onChange,
}: {
  role: Role;
  value: string | null;
  options: { slug: string; displayName: string }[];
  onChange: (slug: string | null) => void;
}) {
  const spec = ROLES[role];
  const id = `webflow-role-${role}`;
  return (
    <tr>
      <td className="px-3 py-2.5 align-middle">
        <label htmlFor={id} className="text-ink">
          {spec.label}
        </label>
        {spec.required && <span className="ml-1 text-xs text-muted-foreground">required</span>}
      </td>
      <td className="px-3 py-2">
        <select
          id={id}
          className={INPUT}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">
            {options.length === 0
              ? `No ${spec.types.join(" or ")} field in this collection`
              : spec.required
                ? "Choose a field"
                : "Don't fill"}
          </option>
          {options.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.displayName}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

/* ── Publishing ─────────────────────────────────────────────────── */

function Publishing({
  siteId,
  status,
  onEdit,
}: {
  siteId: string;
  status: WebflowStatus;
  onEdit: () => void;
}) {
  const queryClient = useQueryClient();
  const conn = status.connection!;
  const { inWebflow, notYet, editedInWebflow } = status.counts;
  const [syncing, setSyncing] = useState<string | null>(null);

  async function sync() {
    const totals = { created: 0, updated: 0, failed: 0 };
    let firstError: string | undefined;
    setSyncing("Publishing…");
    try {
      // The server works for up to ~45s per call; keep going until it's through.
      for (let round = 0; round < 20; round++) {
        const r = await syncWebflowNow(siteId);
        totals.created += r.created;
        totals.updated += r.updated;
        totals.failed += r.failed;
        firstError ??= r.errors[0];
        if (r.remaining === 0 || (r.failed > 0 && r.created + r.updated === 0)) break;
        setSyncing(`Publishing… ${plural(totals.created + totals.updated, "article")} so far`);
      }
      if (totals.failed) {
        toast.error(
          `${plural(totals.failed, "article")} couldn't be published${firstError ? `: ${firstError}` : "."}`,
        );
      } else if (totals.created || totals.updated) {
        toast.success(
          [
            totals.created && `${plural(totals.created, "article")} added`,
            totals.updated && `${plural(totals.updated, "article")} updated`,
          ]
            .filter(Boolean)
            .join(", ") + " in Webflow.",
        );
      } else {
        toast.success("Webflow is up to date.");
      }
    } catch (err) {
      toast.error(message(err, "Couldn't publish to Webflow."));
    } finally {
      setSyncing(null);
      await queryClient.invalidateQueries({ queryKey: webflowStatusKey(siteId) });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>
          Into <span className="font-medium text-ink">{conn.collectionName}</span>
          {conn.webflowSiteName ? ` on ${conn.webflowSiteName}` : ""}
        </span>
        <Pill tone={conn.publishMode === "live" ? "success" : "neutral"}>
          {conn.publishMode === "live" ? "Live" : "Drafts"}
        </Pill>
      </div>

      {conn.status === "error" && conn.lastError && (
        <Notice tone="danger">The last publish failed: {conn.lastError}</Notice>
      )}

      <dl className="grid grid-cols-3 gap-3">
        <Stat label="In Webflow" value={inWebflow} />
        <Stat label="Not yet" value={notYet} />
        <Stat
          label="Edited in Webflow"
          value={editedInWebflow}
          hint={editedInWebflow ? "Left as you edited them" : undefined}
        />
      </dl>

      <p className="text-sm text-muted-foreground">
        New articles go to Webflow the moment they're written
        {conn.lastPublishedAt ? `. Last one ${timeAgo(conn.lastPublishedAt)}` : ""}.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={notYet ? "brand" : "ghost"}
          disabled={!!syncing}
          onClick={() => void sync()}
        >
          {syncing && <Loader2 className="h-4 w-4 animate-spin" />}
          {syncing ?? (notYet ? `Publish ${plural(notYet, "article")} now` : "Sync now")}
        </Button>
        <Button variant="ghost" disabled={!!syncing} onClick={onEdit}>
          Change collection or fields
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums text-ink">{value}</dd>
      {hint && <dd className="text-xs text-muted-foreground">{hint}</dd>}
    </div>
  );
}

/* ── Bits ───────────────────────────────────────────────────────── */

function Step({
  n,
  title,
  done,
  muted,
  children,
}: {
  n: number;
  title: string;
  done: boolean;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className={cn("flex gap-4", muted && "opacity-55")}>
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold",
          done ? "bg-success text-white" : "bg-cta text-white",
        )}
      >
        {done ? <CheckIcon className="h-3.5 w-3.5" /> : n}
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {children}
      </div>
    </li>
  );
}

function Notice({ tone, children }: { tone: "warning" | "danger"; children: React.ReactNode }) {
  return (
    <p
      role="status"
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        tone === "warning"
          ? "border-warning/30 bg-warning/10 text-ink"
          : "border-destructive/20 bg-destructive/10 text-destructive",
      )}
    >
      {children}
    </p>
  );
}
