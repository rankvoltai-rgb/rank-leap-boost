import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  createApiKey,
  listIntegrationKeys,
  revokeApiKey,
  TRIAL_DAYS,
  type IntegrationKey,
} from "@/lib/data";
import { Button, PageHeader, Panel, Pill } from "@/components/dashboard/primitives";
import { CheckIcon, ConnectIcon } from "@/components/dashboard/icons";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import { ConfirmDialog } from "@/components/dashboard/article-parts";
import { useAllArticles, useArticleActions } from "@/components/dashboard/useArticleActions";
import { isEntitled } from "@/components/dashboard/autopilot-state";
import { SubscriptionGate } from "@/components/dashboard/SubscriptionGate";
import { useSiteId } from "@/components/dashboard/site-context";
import {
  delivery,
  keyStatus,
  lastSync,
  platformOf,
  siteStatus,
  timeAgo,
  type KeyStatus,
  type SiteStatus,
} from "@/components/dashboard/connection-model";
import { PUBLISH_PLATFORMS, type Platform, type PlatformId } from "@/data/platforms";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/integrations")({
  component: Integrations,
});

// The published origin sites call. Hardcoded to production so the setup
// instructions are right no matter which environment renders them.
const API_BASE = "https://rankbox.xyz";
const API_ROOT = `${API_BASE}/api/public/v1`;

type Choice = PlatformId | "custom";

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/* ── Page ───────────────────────────────────────────────────────── */

/**
 * Keys belong to one site. Keyed by it, so a key shown once for one site is
 * never left on screen under another's.
 */
function Integrations() {
  const siteId = useSiteId();
  return <SiteIntegrations key={siteId} siteId={siteId} />;
}

function SiteIntegrations({ siteId }: { siteId: string }) {
  const queryClient = useQueryClient();
  const { data: blogs = [] } = useAllArticles();
  const { data: keys = [], isLoading } = useQuery({
    queryKey: ["api-keys", siteId],
    queryFn: () => listIntegrationKeys(siteId),
    // While any key waits for its first request, keep watching for it — the
    // page turns live the moment the site calls in.
    refetchInterval: (q) =>
      (q.state.data ?? []).some((k) => !k.revoked_at && !k.last_used_at) ? 5000 : false,
  });

  // Brings the same trial dialog Generate raises; connecting a site needs a plan.
  const actions = useArticleActions({ openId: undefined, onOpen: () => undefined });
  // Unknown while the subscription loads, so the page never flashes locked.
  const locked = actions.subscription !== undefined && !isEntitled(actions.subscription);

  const status = siteStatus(keys);
  const synced = lastSync(keys);
  const sent = delivery(blogs, synced);
  const active = keys.filter((k) => !k.revoked_at);

  const setupRef = useRef<HTMLElement>(null);
  const [choice, setChoice] = useState<Choice | null>(null);
  // The key made in setup, held only for this visit: it's shown once, never again.
  const [fresh, setFresh] = useState<{ id: string; raw: string } | null>(null);
  const [replacement, setReplacement] = useState<{ old: IntegrationKey; raw: string } | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<IntegrationKey | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function goToSetup(pick?: Choice) {
    if (pick) setChoice(pick);
    setupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function createKey(name: string) {
    if (locked) {
      actions.openTrial();
      return;
    }
    setBusy("create");
    try {
      const result = await createApiKey(siteId, { name });
      setFresh({ id: result.id, raw: result.raw });
      await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create a key.");
    } finally {
      setBusy(null);
    }
  }

  async function replace(key: IntegrationKey) {
    if (locked) {
      actions.openTrial();
      return;
    }
    setBusy(key.id);
    try {
      const result = await createApiKey(siteId, { name: key.name });
      setReplacement({ old: key, raw: result.raw });
      await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create a new key.");
    } finally {
      setBusy(null);
    }
  }

  async function revoke(key: IntegrationKey) {
    setBusy(key.id);
    try {
      await revokeApiKey({ id: key.id });
      await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success(`“${key.name}” revoked.`);
      setRevokeTarget(null);
      setReplacement((r) => (r?.old.id === key.id ? null : r));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't revoke the key.");
    } finally {
      setBusy(null);
    }
  }

  const freshKey = fresh ? keys.find((k) => k.id === fresh.id) : undefined;
  const chosen = PUBLISH_PLATFORMS.find((p) => p.id === choice);

  return (
    <div className="space-y-8">
      {actions.dialogs}

      <PageHeader
        title="Integrations"
        description="Connect your site and every article autopilot writes appears on it automatically — then see that it did."
      />

      <SubscriptionGate
        locked={locked}
        className="space-y-8"
        title="Publish straight to your site"
        description="Connect your site once and every article autopilot writes appears there on its own."
        points={[
          "Works with any site today through the API",
          "Live status for every article that reaches your site",
          "Keys you can replace or revoke any time",
        ]}
        onStartTrial={actions.openTrial}
      >
        <StatusHero
          loading={isLoading}
          status={status}
          synced={synced}
          sent={sent}
          locked={locked}
          onSetup={() => goToSetup()}
          onStartTrial={actions.openTrial}
        />

        {active.length > 0 && (
          <Connections
            keys={keys}
            blogs={blogs}
            busy={busy}
            onReplace={(k) => void replace(k)}
            onRevoke={setRevokeTarget}
          />
        )}

        <section ref={setupRef} className="scroll-mt-6 space-y-4">
          <SectionHeading
            title={active.length > 0 ? "Connect another site" : "Connect your site"}
            description="Where does your site run?"
          />
          <PlatformPicker choice={choice} onChoose={setChoice} />
          {chosen && !chosen.addonLive && (
            <PlatformSetup platform={chosen} onUseApi={() => setChoice("custom")} />
          )}
          {(choice === "custom" || chosen?.addonLive) && (
            <ApiSetup
              key={choice}
              platform={chosen?.addonLive ? chosen : undefined}
              creating={busy === "create"}
              locked={locked}
              fresh={fresh}
              freshKey={freshKey}
              onCreate={(name) => void createKey(name)}
              onReset={() => setFresh(null)}
              onStartTrial={actions.openTrial}
            />
          )}
        </section>

        <DeveloperApi />
        <AssistantCard />
      </SubscriptionGate>

      {/* A replaced key is shown once, next to the one step left: retire the old one. */}
      <ConfirmDialog
        open={!!replacement}
        onOpenChange={(o) => !o && setReplacement(null)}
        title={`Your new key for “${replacement?.old.name ?? ""}”`}
        description="Put it in your site in place of the old one — this is the only time it's shown. Once your site uses it, revoke the old key so it stops working."
        body={replacement && <SecretField value={replacement.raw} />}
      >
        <Button
          variant="danger"
          disabled={!!replacement && busy === replacement.old.id}
          onClick={() => replacement && void revoke(replacement.old)}
        >
          Revoke old key
        </Button>
        <Button data-autofocus onClick={() => setReplacement(null)}>
          Done
        </Button>
      </ConfirmDialog>

      <ConfirmDialog
        open={!!revokeTarget}
        onOpenChange={(o) => !o && setRevokeTarget(null)}
        title={`Revoke “${revokeTarget?.name ?? ""}”?`}
        description={
          revokeTarget?.last_used_at
            ? `A site synced with this key ${timeAgo(revokeTarget.last_used_at)}. It stops getting new articles the moment you revoke it, and this can't be undone.`
            : "Anything using this key stops working right away. This can't be undone."
        }
      >
        <Button variant="ghost" data-autofocus onClick={() => setRevokeTarget(null)}>
          Cancel
        </Button>
        <Button
          className="bg-destructive text-white hover:bg-destructive/90"
          disabled={!!revokeTarget && busy === revokeTarget.id}
          onClick={() => revokeTarget && void revoke(revokeTarget)}
        >
          {revokeTarget && busy === revokeTarget.id && <Loader2 className="h-4 w-4 animate-spin" />}
          Revoke key
        </Button>
      </ConfirmDialog>
    </div>
  );
}

/* ── Status ─────────────────────────────────────────────────────── */

const DOT: Record<SiteStatus, string> = {
  none: "bg-muted-foreground/40",
  waiting: "bg-brand-blue",
  live: "bg-success",
  stale: "bg-warning",
};

function StatusHero({
  loading,
  status,
  synced,
  sent,
  locked,
  onSetup,
  onStartTrial,
}: {
  loading: boolean;
  status: SiteStatus;
  synced: string | null;
  sent: ReturnType<typeof delivery>;
  locked: boolean;
  onSetup: () => void;
  onStartTrial: () => void;
}) {
  if (loading) return <div className="skeleton h-[118px] rounded-card" />;

  const copy: Record<SiteStatus, { title: string; detail: string }> = {
    none: {
      title: "Your site isn't connected yet",
      detail: sent.published
        ? `${plural(sent.published, "published article is", "published articles are")} waiting in Rankbox. Connect your site and they appear there automatically.`
        : "Connect your site now and every article autopilot writes appears there automatically.",
    },
    waiting: {
      title: "Waiting for your site's first sync",
      detail:
        "Your key is ready. This turns live the moment your site uses it — usually within a minute of pasting it in.",
    },
    live: {
      title: "Your site is connected",
      detail: `Last synced ${timeAgo(synced)}. ${
        sent.waiting
          ? `${plural(sent.waiting, "new article arrives", "new articles arrive")} on the next sync.`
          : "Every published article has reached it."
      }`,
    },
    stale: {
      title: `Your site hasn't synced since ${formatShortDate(synced)}`,
      detail: `${
        sent.waiting
          ? `${plural(sent.waiting, "article hasn't", "articles haven't")} reached it yet. `
          : ""
      }Check the plugin or code is still running and using an active key.`,
    },
  };

  // Without a plan the API refuses the site's key, so a connected site has
  // stopped syncing. Say that, rather than blaming the plugin.
  const paused = locked && status !== "none";
  const { title, detail } = paused
    ? {
        title: "Syncing is paused",
        detail: `Your site can't receive articles without an active plan${
          sent.waiting
            ? ` — ${plural(sent.waiting, "article is", "articles are")} waiting for it`
            : ""
        }. Start your free trial to turn syncing back on.`,
      }
    : copy[status];
  const dot = paused ? DOT.stale : DOT[status];

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3 px-5 py-4">
        <span className="relative mt-[5px] flex h-2.5 w-2.5 shrink-0" aria-hidden>
          {!paused && (status === "live" || status === "waiting") && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 motion-reduce:animate-none",
                dot,
              )}
            />
          )}
          <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", dot)} />
        </span>
        <div className="min-w-0 flex-1 basis-60" role="status">
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>
        </div>
        {paused ? (
          <Button
            variant="brand"
            className="ml-[1.625rem] shrink-0 self-center sm:ml-0"
            onClick={onStartTrial}
          >
            Start free trial
          </Button>
        ) : (
          (status === "none" || status === "stale") && (
            <Button
              variant={status === "none" ? "brand" : "ghost"}
              className="ml-[1.625rem] shrink-0 self-center sm:ml-0"
              onClick={onSetup}
            >
              {status === "none" ? "Connect your site" : "Review setup"}
            </Button>
          )
        )}
      </div>
      {status !== "none" && (
        <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
          <HeroStat label="Last sync" value={synced ? timeAgo(synced) : "Never"} />
          <HeroStat
            label="Delivered"
            value={`${sent.delivered} of ${sent.published}`}
            hint="published articles"
          />
          <HeroStat
            label="On the way"
            value={String(sent.waiting)}
            hint={sent.waiting ? "arrive next sync" : "all caught up"}
          />
        </div>
      )}
    </Panel>
  );
}

function HeroStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-card px-5 py-3.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold tabular-nums text-ink">
        {value}
        {hint && <span className="ml-1.5 text-xs font-normal text-muted-foreground">{hint}</span>}
      </p>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

/* ── Connections ────────────────────────────────────────────────── */

const KEY_PILL: Record<
  KeyStatus,
  { tone: "success" | "warning" | "neutral" | "danger"; label: string }
> = {
  live: { tone: "success", label: "Live" },
  idle: { tone: "warning", label: "Idle" },
  waiting: { tone: "neutral", label: "Waiting" },
  revoked: { tone: "danger", label: "Revoked" },
};

function KeyMark({ keyRow }: { keyRow: IntegrationKey }) {
  const platform = platformOf(keyRow);
  if (platform) return <IntegrationLogo id={platform} title={false} className="h-9 w-9" />;
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[25%] border border-border bg-secondary text-muted-foreground">
      <ConnectIcon className="h-4 w-4" />
    </span>
  );
}

function Connections({
  keys,
  blogs,
  busy,
  onReplace,
  onRevoke,
}: {
  keys: IntegrationKey[];
  blogs: Parameters<typeof delivery>[0];
  busy: string | null;
  onReplace: (key: IntegrationKey) => void;
  onRevoke: (key: IntegrationKey) => void;
}) {
  const [showRevoked, setShowRevoked] = useState(false);
  const active = keys.filter((k) => !k.revoked_at);
  const revoked = keys.filter((k) => k.revoked_at);
  const rows = showRevoked ? [...active, ...revoked] : active;

  return (
    <section className="space-y-3">
      <SectionHeading
        title="Your connections"
        description="One key per site. Replace a key if it may have leaked; revoke one you no longer use."
      />
      <Panel className="divide-y divide-border">
        {rows.map((k) => {
          const status = keyStatus(k);
          const sent = delivery(blogs, k.last_used_at);
          return (
            <div
              key={k.id}
              className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-3 p-4",
                status === "revoked" && "opacity-60",
              )}
            >
              <KeyMark keyRow={k} />
              <div className="min-w-0 flex-1 basis-48">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-ink">{k.name}</p>
                  <Pill tone={KEY_PILL[status].tone}>{KEY_PILL[status].label}</Pill>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  <span className="font-mono">{k.key_prefix}</span> · created{" "}
                  {formatShortDate(k.created_at)}
                </p>
              </div>
              <div className="min-w-[9rem] text-sm">
                <p className="text-ink">
                  {status === "revoked"
                    ? `Revoked ${formatShortDate(k.revoked_at)}`
                    : k.last_used_at
                      ? `Synced ${timeAgo(k.last_used_at)}`
                      : "No requests yet"}
                </p>
                {status !== "revoked" && k.last_used_at && (
                  <p className="text-xs text-muted-foreground">
                    {sent.waiting ? `${plural(sent.waiting, "article")} on the way` : "Up to date"}
                  </p>
                )}
              </div>
              {status !== "revoked" && (
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    className="h-8 px-3 text-xs"
                    disabled={busy === k.id}
                    onClick={() => onReplace(k)}
                  >
                    {busy === k.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Replace key
                  </Button>
                  <Button
                    variant="danger"
                    className="h-8 px-3 text-xs"
                    disabled={busy === k.id}
                    onClick={() => onRevoke(k)}
                  >
                    Revoke
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {revoked.length > 0 && (
          <button
            type="button"
            onClick={() => setShowRevoked((v) => !v)}
            className="w-full px-4 py-2.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-ink"
          >
            {showRevoked ? "Hide revoked keys" : `Show ${plural(revoked.length, "revoked key")}`}
          </button>
        )}
      </Panel>
    </section>
  );
}

/* ── Setup ──────────────────────────────────────────────────────── */

function PlatformPicker({
  choice,
  onChoose,
}: {
  choice: Choice | null;
  onChoose: (c: Choice) => void;
}) {
  const tile =
    "flex flex-col items-start gap-3 rounded-card border bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {PUBLISH_PLATFORMS.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={choice === p.id}
          onClick={() => onChoose(p.id)}
          className={cn(
            tile,
            choice === p.id ? "border-ink ring-1 ring-ink" : "border-border hover:border-ink/20",
          )}
        >
          <IntegrationLogo id={p.id} title={false} className="h-10 w-10" />
          <div>
            <p className="text-sm font-semibold text-ink">{p.name}</p>
            <p className="text-xs text-muted-foreground">
              {p.addonLive ? `${p.addon === "app" ? "App" : "Plugin"} available` : "Coming soon"}
            </p>
          </div>
        </button>
      ))}
      <button
        type="button"
        aria-pressed={choice === "custom"}
        onClick={() => onChoose("custom")}
        className={cn(
          tile,
          choice === "custom" ? "border-ink ring-1 ring-ink" : "border-border hover:border-ink/20",
        )}
      >
        <span className="grid h-10 w-10 place-items-center rounded-[25%] bg-ink font-mono text-sm font-semibold text-background">
          {"{ }"}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Any site</p>
          <p className="text-xs font-medium text-success">Available now · API</p>
        </div>
      </button>
    </div>
  );
}

function addonStore(platform: Platform): string {
  return platform.id === "wordpress"
    ? "the WordPress plugin directory"
    : `the ${platform.name} ${platform.addon === "app" ? "App Store" : "plugin marketplace"}`;
}

/** A platform whose add-on hasn't shipped: say so plainly, and offer the route that works today. */
function PlatformSetup({ platform, onUseApi }: { platform: Platform; onUseApi: () => void }) {
  const steps = [
    `Install the Rankbox ${platform.addon} from ${addonStore(platform)}.`,
    "Paste your Rankbox key when it asks.",
    "New articles appear on your site on their own.",
  ];
  return (
    <Panel className="grid grid-cols-1 gap-6 p-5 sm:p-6 md:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <IntegrationLogo id={platform.id} title={false} className="h-9 w-9" />
          <div>
            <p className="text-sm font-semibold text-ink">
              The Rankbox {platform.addon} for {platform.name}
            </p>
            <Pill tone="neutral">Coming soon</Pill>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Here's how it'll work once it ships:</p>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-2.5 text-sm text-muted-foreground">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border text-[0.65rem] font-semibold text-ink">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col justify-center gap-3 rounded-card bg-secondary/50 p-5">
        <p className="text-sm font-semibold text-ink">Connect today with the API</p>
        <p className="text-sm text-muted-foreground">
          Any {platform.name} site can pull its articles from Rankbox now. A developer can set it up
          in a few minutes.
        </p>
        <div>
          <Button variant="brand" onClick={onUseApi}>
            Connect with the API
          </Button>
        </div>
      </div>
    </Panel>
  );
}

/**
 * Create a key, copy it, put it to work, and watch the site call in. With a
 * platform whose add-on has shipped, step 3 is installing it; otherwise it's
 * the API call.
 */
function ApiSetup({
  platform,
  creating,
  locked,
  fresh,
  freshKey,
  onCreate,
  onReset,
  onStartTrial,
}: {
  platform?: Platform;
  creating: boolean;
  locked: boolean;
  fresh: { id: string; raw: string } | null;
  freshKey: IntegrationKey | undefined;
  onCreate: (name: string) => void;
  onReset: () => void;
  onStartTrial: () => void;
}) {
  // Named after the platform, so the connection shows its logo later.
  const [name, setName] = useState(platform ? `${platform.name} site` : "My website");
  const connected = !!freshKey?.last_used_at;

  return (
    <Panel className="p-5 sm:p-6">
      <ol className="space-y-6">
        <SetupStep n={1} title="Create a key for this site" done={!!fresh}>
          {fresh ? (
            <p className="text-sm text-muted-foreground">
              Key created.{" "}
              <button
                type="button"
                onClick={onReset}
                className="font-medium text-ink underline-offset-4 hover:underline"
              >
                Create another
              </button>
            </p>
          ) : locked ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">
                Connecting a site comes with your plan. Start your {TRIAL_DAYS}-day free trial to
                create a key.
              </p>
              <Button variant="brand" onClick={onStartTrial}>
                Start free trial
              </Button>
            </div>
          ) : (
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                onCreate(name.trim() || "My website");
              }}
            >
              <label className="sr-only" htmlFor="key-name">
                Site name
              </label>
              <input
                id="key-name"
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme blog"
                className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-ring/20 sm:w-64"
              />
              <Button type="submit" disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create key
              </Button>
            </form>
          )}
        </SetupStep>

        <SetupStep n={2} title="Copy your key" done={false} muted={!fresh}>
          {fresh ? (
            <div className="space-y-2">
              <SecretField value={fresh.raw} />
              <p className="text-xs text-muted-foreground">
                This is the only time it's shown. Store it where your site's secrets live.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Shown once, right after you create it.</p>
          )}
        </SetupStep>

        {platform ? (
          <SetupStep
            n={3}
            title={`Install the Rankbox ${platform.addon}`}
            done={false}
            muted={!fresh}
          >
            <p className="text-sm text-muted-foreground">
              Get it from {addonStore(platform)}, then paste your key when it asks. New articles
              appear on your {platform.name} site on their own.
            </p>
          </SetupStep>
        ) : (
          <SetupStep n={3} title="Ask for your articles" done={false} muted={!fresh}>
            <p className="mb-3 text-sm text-muted-foreground">
              Call this from your site — at build time or on a schedule. Pass back{" "}
              <code className="font-mono text-xs text-ink">next_since</code> to get only what's new.
            </p>
            <CodeSamples apiKey={fresh?.raw} />
          </SetupStep>
        )}

        <SetupStep n={4} title="See it connect" done={connected} muted={!fresh}>
          {!fresh ? (
            <p className="text-sm text-muted-foreground">
              This step confirms the moment your site makes its first request.
            </p>
          ) : connected ? (
            <p className="flex items-center gap-2 text-sm font-medium text-success" role="status">
              <CheckIcon className="h-4 w-4" /> Connected — your site called in{" "}
              {timeAgo(freshKey?.last_used_at ?? null)}.
            </p>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
              <Loader2 className="h-4 w-4 animate-spin" /> Listening for your site's first request…
            </p>
          )}
        </SetupStep>
      </ol>
    </Panel>
  );
}

function SetupStep({
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
          done ? "bg-success text-white" : "bg-ink text-background",
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

/* ── Developer reference ────────────────────────────────────────── */

const ENDPOINTS = [
  {
    path: "/ping",
    what: "Checks a key and returns your brand name. Call it when someone pastes a key.",
  },
  {
    path: "/articles",
    what: "Published articles, oldest change first. since= returns only what changed after a time; limit= up to 100. Pass next_since back to page through.",
  },
  { path: "/articles/{id}", what: "One published article." },
];

const FIELDS = [
  "id",
  "slug",
  "title",
  "description",
  "body_html",
  "body_markdown",
  "tags",
  "seo_score",
  "published_at",
  "updated_at",
];

function DeveloperApi() {
  return (
    <section className="space-y-3">
      <SectionHeading
        title="Developer API"
        description="Read-only, and your site never hands Rankbox a password — just a key it can revoke."
      />
      <Panel className="divide-y divide-border">
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Base URL</p>
            <CopyField value={API_ROOT} />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Authentication</p>
            <CopyField value="Authorization: Bearer YOUR_API_KEY" />
          </div>
        </div>
        <ul className="divide-y divide-border">
          {ENDPOINTS.map((e) => (
            <li key={e.path} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:gap-4">
              <p className="shrink-0 font-mono text-xs text-ink sm:w-52">
                <span className="mr-2 rounded-sm bg-success/10 px-1.5 py-0.5 font-semibold text-success">
                  GET
                </span>
                {e.path}
              </p>
              <p className="text-sm text-muted-foreground">{e.what}</p>
            </li>
          ))}
        </ul>
        <div className="px-5 py-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Each article has</p>
          <div className="flex flex-wrap gap-1.5">
            {FIELDS.map((f) => (
              <code
                key={f}
                className="rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-xs text-ink"
              >
                {f}
              </code>
            ))}
          </div>
        </div>
      </Panel>
    </section>
  );
}

function AssistantCard() {
  return (
    <section className="space-y-3">
      <SectionHeading
        title="Use Rankbox in your AI assistant"
        description="Research and plan content without leaving the chat."
      />
      <Panel className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Add Rankbox's MCP server to Claude, ChatGPT or Cursor as a custom connector. You get
            three tools:
          </p>
          <ul className="space-y-1.5 text-sm text-ink">
            <li>Find the questions people ask AI about a topic</li>
            <li>Build a content brief for a keyword</li>
            <li>Write meta descriptions</li>
          </ul>
        </div>
        <div className="self-center">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Server URL</p>
          <CopyField value={`${API_BASE}/mcp`} />
        </div>
      </Panel>
    </section>
  );
}

/* ── Small pieces ───────────────────────────────────────────────── */

function useCopy() {
  const [copied, setCopied] = useState(false);
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy to the clipboard.");
    }
  }
  return { copied, copy };
}

function CopyField({ value }: { value: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="flex items-stretch gap-2">
      <code className="min-w-0 flex-1 truncate rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-xs text-ink">
        {value}
      </code>
      <Button variant="ghost" onClick={() => void copy(value)} className="w-[4.5rem] shrink-0">
        {copied ? <CheckIcon className="h-4 w-4 text-success" /> : "Copy"}
      </Button>
    </div>
  );
}

/** A secret shown once: full value, one tap to copy, and a loud border so it isn't missed. */
function SecretField({ value }: { value: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="flex items-stretch gap-2">
      <code className="flex min-w-0 flex-1 items-center break-all rounded-lg border border-brand-blue/40 bg-brand-blue/5 px-3 py-2 font-mono text-xs text-ink">
        {value}
      </code>
      <Button
        variant="brand"
        onClick={() => void copy(value)}
        className="min-w-[7rem] shrink-0 whitespace-nowrap"
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4" /> Copied
          </>
        ) : (
          "Copy key"
        )}
      </Button>
    </div>
  );
}

function CodeSamples({ apiKey }: { apiKey?: string }) {
  const [lang, setLang] = useState<"curl" | "js">("curl");
  const { copied, copy } = useCopy();
  const key = apiKey ?? "YOUR_API_KEY";
  const code =
    lang === "curl"
      ? `curl "${API_ROOT}/articles?since=2026-01-01T00:00:00Z" \\\n  -H "Authorization: Bearer ${key}"`
      : `const res = await fetch(\n  \`${API_ROOT}/articles?since=\${lastSync}\`,\n  { headers: { Authorization: "Bearer ${key}" } },\n);\nconst { articles, next_since } = await res.json();\n// Save next_since and send it as ?since= next time.`;
  return (
    <div className="overflow-hidden rounded-card border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-hero-black px-3 py-2">
        <div className="flex gap-1" role="tablist" aria-label="Language">
          {(
            [
              ["curl", "cURL"],
              ["js", "JavaScript"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={lang === id}
              onClick={() => setLang(id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                lang === id ? "bg-white/15 text-white" : "text-white/55 hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void copy(code)}
          className="rounded-md px-2 py-1 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-hero-black p-4 font-mono text-[12.5px] leading-relaxed text-white/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
