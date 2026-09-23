import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { framer, type ManagedCollection } from "framer-plugin";
import { RankboxClient, type PingResult, type PublishedArticle } from "@rankbox/api-client";
import { syncArticles, type SyncProgress, type SyncResult } from "./lib/sync";
import { composeLiveUrl, normalizeBlogPath, sameSite } from "./lib/live-url";
import { describeError, type DescribedError } from "./lib/errors";
import { emptyLedger, type Ledger } from "./lib/ledger";
import { RANKBOX_FIELDS } from "./lib/fields";
import { activeCollection, findOrCreateCollection } from "./collection";
import {
  adaptCollection,
  can,
  productionUrl as readProductionUrl,
  readConfig,
  siteFingerprint,
  writeConfig,
  type PluginConfig,
} from "./framer-adapter";
import { addSlugRedirects, installSeo, removeSeo, reportLiveUrls } from "./services";
import {
  clearApiKey,
  isStorageBlocked,
  keyPrefixOf,
  loadApiKey,
  loadBaseUrl,
  saveApiKey,
} from "./storage";
import { ErrorPanel, ExternalLink, Mark, Progress } from "./components";
import { relativeTime } from "./lib/relative-time";
import { openExternal } from "./open-url";
import { Connect } from "./screens/Connect";
import { FieldList, Help, Settings, type SettingsValue } from "./screens/Settings";

type Stage = "loading" | "connect" | "ready" | "working";

interface Status {
  message: string;
  value?: number;
  max?: number;
}

export function App() {
  const baseUrl = useMemo(() => loadBaseUrl(), []);
  const [stage, setStage] = useState<Stage>("loading");
  const [collection, setCollection] = useState<ManagedCollection | null>(null);
  const [config, setConfig] = useState<PluginConfig | null>(null);
  const [client, setClient] = useState<RankboxClient | null>(null);
  const [who, setWho] = useState<PingResult | null>(null);
  const [error, setError] = useState<DescribedError | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [ledger, setLedger] = useState<Ledger>(emptyLedger());
  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [origin, setOrigin] = useState<string | null>(null);
  const [pendingReports, setPendingReports] = useState(0);
  const abort = useRef<AbortController | null>(null);

  // Memoized: this feeds useCallback deps, so a fresh object each render
  // would rebuild every handler.
  const settings: SettingsValue = useMemo(
    () => ({
      blogPath: config?.blogPath ?? "",
      autoReport: config?.autoReport ?? true,
      seoEnabled: config?.seoEnabled ?? true,
      followSlugRenames: config?.followSlugRenames ?? false,
    }),
    [config],
  );

  const fail = useCallback(
    (err: unknown, phase: "connect" | "sync" | "report") => {
      setError(
        describeError(err, {
          baseUrl,
          phase,
          actualDomain: origin ? new URL(origin).hostname : undefined,
        }),
      );
    },
    [baseUrl, origin],
  );

  /* ---------------------------------------------------------------- boot */

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        // In configure/sync modes Framer already picked the collection; from
        // the canvas the plugin finds or creates its own.
        const resolved =
          framer.mode === "configureManagedCollection"
            ? await activeCollection()
            : await findOrCreateCollection();
        if (cancelled) return;

        const adapted = adaptCollection(resolved);
        const [loaded, published] = await Promise.all([readConfig(adapted), readProductionUrl()]);
        if (cancelled) return;

        setCollection(resolved);
        setConfig(loaded);
        setOrigin(published);

        const apiKey = loadApiKey(resolved.id);
        if (!apiKey) {
          setStage("connect");
          return;
        }
        const next = new RankboxClient({ apiKey, baseUrl });
        const identity = await next.ping();
        if (cancelled) return;
        setClient(next);
        setWho(identity);
        setStage("ready");
      } catch (err) {
        if (cancelled) return;
        fail(err, "connect");
        setStage("connect");
      }
    })();
    return () => {
      cancelled = true;
    };
    // Runs once: the collection and key are resolved on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The Report button should light up the moment the site is published.
  useEffect(() => {
    try {
      return framer.subscribeToPublishInfo((info) => setOrigin(info.production?.url ?? null));
    } catch {
      return undefined;
    }
  }, []);

  /* ------------------------------------------------------------- actions */

  const disconnect = useCallback(async () => {
    if (collection) clearApiKey(collection.id);
    await removeSeo();
    setClient(null);
    setWho(null);
    setResult(null);
    setArticles([]);
    setError(null);
    setStage("connect");
    void framer.notify("Disconnected. Your CMS items are untouched.", { variant: "info" });
  }, [collection]);

  const connect = useCallback(
    async (apiKey: string) => {
      if (!collection) return;
      setStage("working");
      setError(null);
      try {
        const next = new RankboxClient({ apiKey: apiKey.trim(), baseUrl });
        const identity = await next.ping();

        // A key pointing at a different Rankbox site must not quietly merge two
        // sites' articles into one collection.
        const fingerprint = siteFingerprint(keyPrefixOf(apiKey), identity.brand_name);
        if (config?.fingerprint && config.fingerprint !== fingerprint) {
          setError({
            title: "That key is for a different site",
            body: `This collection was synced from ${config.brandName ?? "another site"}. Connecting ${identity.brand_name ?? "this site"} would replace its articles. Disconnect and start a new collection instead.`,
          });
          setStage("connect");
          return;
        }

        saveApiKey(collection.id, apiKey);
        const adapted = adaptCollection(collection);
        await writeConfig(adapted, {
          brandName: identity.brand_name,
          keyPrefix: keyPrefixOf(apiKey),
          siteFingerprint: fingerprint,
        });
        setConfig(await readConfig(adapted));
        setClient(next);
        setWho(identity);
        setStage("ready");
      } catch (err) {
        fail(err, "connect");
        setStage("connect");
      }
    },
    [baseUrl, collection, config, fail],
  );

  const patchSettings = useCallback(
    (patch: Partial<SettingsValue>) => {
      if (!collection || !config) return;
      const merged = { ...settings, ...patch };
      setConfig({ ...config, ...merged });
      void writeConfig(adaptCollection(collection), {
        blogPath: merged.blogPath,
        autoReport: String(merged.autoReport),
        seoEnabled: String(merged.seoEnabled),
        followSlugRenames: String(merged.followSlugRenames),
      });
      if (!merged.seoEnabled) void removeSeo();
    },
    [collection, config, settings],
  );

  const runSync = useCallback(
    async (force: boolean) => {
      if (!collection || !client || !config) return;
      const controller = new AbortController();
      abort.current = controller;
      setStage("working");
      setError(null);
      setStatus({ message: "Fetching articles…" });

      try {
        const path = normalizeBlogPath(config.blogPath);
        const liveUrlFor = origin
          ? (slug: string) => composeLiveUrl(origin, path, slug)
          : undefined;

        const synced = await syncArticles({
          collection: adaptCollection(collection),
          client,
          liveUrlFor,
          followSlugRenames: config.followSlugRenames,
          force,
          signal: controller.signal,
          can,
          onProgress: (p) => setStatus(progressText(p)),
        });

        setResult(synced);
        setLedger(synced.ledger);
        setArticles(synced.articles);
        await writeConfig(adaptCollection(collection), {
          lastSyncAt: new Date().toISOString(),
        });
        setConfig(await readConfig(adaptCollection(collection)));

        // A renamed slug leaves the old URL dead; redirect it. Best-effort:
        // the project's plan or the user's role may not allow redirects.
        if (synced.slugChanges.length > 0) {
          const added = await addSlugRedirects(synced.slugChanges, path);
          if (added > 0) {
            void framer.notify(
              `Added ${added} redirect${added === 1 ? "" : "s"} for renamed articles.`,
              { variant: "success" },
            );
          }
        }

        if (synced.stalled === "no-progress") {
          setError({
            title: "Some articles share a timestamp",
            body: "Rankbox couldn't page past them, so a few may be missing. Contact support and they can fix it on their side.",
          });
        }

        // Structured data and reporting both need a published site to point at.
        if (origin && config.seoEnabled) {
          const outcome = await installSeo({
            articles: synced.articles,
            ledger: synced.ledger,
            productionUrl: origin,
            blogPath: path,
            brandName: who?.brand_name ?? config.brandName ?? null,
            logoUrl: who?.logo_url ?? null,
          });
          if (outcome === "skipped-occupied") {
            void framer.notify(
              "Your site's head already has custom code, so Rankbox left it alone.",
              { variant: "warning" },
            );
          }
        }

        if (origin && config.autoReport) {
          await runReport(synced.articles, synced.ledger, path, controller.signal);
        } else {
          setPendingReports(countPending(synced.articles, origin));
        }

        setStage("ready");
        setStatus(null);
      } catch (err) {
        fail(err, "sync");
        setStage("ready");
        setStatus(null);
      } finally {
        abort.current = null;
      }
    },
    // runReport is defined below and stable for this component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, collection, config, fail, origin, who],
  );

  const runReport = useCallback(
    async (list: PublishedArticle[], currentLedger: Ledger, path: string, signal?: AbortSignal) => {
      if (!client || !origin) return;
      setStatus({ message: "Reporting live URLs…" });
      const report = await reportLiveUrls({
        client,
        articles: list,
        ledger: currentLedger,
        productionUrl: origin,
        blogPath: path,
        signal,
        onProgress: (done, total) =>
          setStatus({ message: "Reporting live URLs…", value: done, max: total }),
      });

      if (report.domainRejection) {
        fail(report.domainRejection, "report");
        setPendingReports(report.total);
        return;
      }
      setPendingReports(Math.max(0, report.total - report.reported - report.skipped));
    },
    [client, fail, origin],
  );

  const reportNow = useCallback(async () => {
    if (!config) return;
    setStage("working");
    setError(null);
    try {
      await runReport(articles, ledger, normalizeBlogPath(config.blogPath));
    } catch (err) {
      fail(err, "report");
    } finally {
      setStage("ready");
      setStatus(null);
    }
  }, [articles, config, fail, ledger, runReport]);

  const resetFields = useCallback(async () => {
    if (!collection) return;
    if (!can("ManagedCollection.setFields")) return;
    await adaptCollection(collection).setFields(RANKBOX_FIELDS);
    setError(null);
    void framer.notify("Fields reset. Sync again to refill them.", { variant: "success" });
  }, [collection]);

  /* ---------------------------------------------------------------- menu */

  useEffect(() => {
    const items = [
      { label: "Sync now", enabled: stage === "ready", onAction: () => void runSync(false) },
      {
        label: "Resync everything",
        enabled: stage === "ready",
        onAction: () => void runSync(true),
      },
      { type: "separator" as const },
      { label: "Open Rankbox", onAction: () => openExternal(`${baseUrl}/dashboard`) },
      {
        label: "Help & troubleshooting",
        onAction: () => openExternal(`${baseUrl}/integrations/framer`),
      },
    ];
    // Framer's marketplace rules require authenticated plugins to offer logout
    // from the header menu.
    if (client) {
      items.push({ type: "separator" as const });
      items.push({ label: "Log Out", onAction: () => void disconnect() });
    }
    void framer.setMenu(items);
  }, [baseUrl, client, disconnect, runSync, stage]);

  /* -------------------------------------------------------------- render */

  if (stage === "loading") {
    return (
      <div className="rb-root">
        <div className="rb-center">
          <Mark />
          <span className="rb-muted">Opening your collection…</span>
        </div>
      </div>
    );
  }

  if (!client || stage === "connect") {
    return (
      <Connect
        baseUrl={baseUrl}
        busy={stage === "working"}
        error={error}
        knownBrand={config?.brandName ?? null}
        knownKeyPrefix={config?.keyPrefix ?? null}
        storageBlocked={isStorageBlocked()}
        onConnect={(key) => void connect(key)}
      />
    );
  }

  const busy = stage === "working";
  const sampleSlug = articles[0] ? (ledger.items[articles[0].id]?.slug ?? articles[0].slug) : null;
  // Warn before firing a request the API will reject: published_url has to be
  // on the site's own domain, and a project still on its .framer.website
  // address never will be.
  const domainMismatch =
    origin && who?.website_url && !sameSite(origin, who.website_url) ? who.website_url : null;

  return (
    <div className="rb-root">
      <div className="rb-scroll">
        <div className="rb-spread">
          <div className="rb-row">
            <Mark />
            <span className="rb-title">{who?.brand_name ?? "Rankbox"}</span>
          </div>
          {result && <span className="rb-badge">{result.total} articles</span>}
        </div>

        {busy && status ? (
          <div className="rb-card">
            <span className="rb-muted" aria-live="polite">
              {status.message}
              {status.value !== undefined && status.max
                ? ` ${status.value} of ${status.max}`
                : status.value !== undefined
                  ? ` ${status.value}`
                  : ""}
            </span>
            {status.max ? <Progress value={status.value ?? 0} max={status.max} /> : null}
          </div>
        ) : (
          <SyncSummary
            result={result}
            lastSyncAt={config?.lastSyncAt ?? null}
            articleCount={articles.length}
          />
        )}

        {result && result.conflicts.length > 0 && (
          <div className="rb-error">
            <span className="rb-title">A field was changed in the CMS</span>
            <span className="rb-muted">
              {result.conflicts.map((c) => c.name).join(", ")} no longer matches what Rankbox
              writes. Reset it to sync that field again.
            </span>
            <button type="button" className="rb-link" onClick={() => void resetFields()}>
              Reset fields
            </button>
          </div>
        )}

        {error && (
          <ErrorPanel
            error={error}
            onRetry={() => void runSync(false)}
            onReconnect={() => void disconnect()}
            onResetFields={() => void resetFields()}
          />
        )}

        <ReportCard
          origin={origin}
          pending={pendingReports}
          busy={busy}
          expectedDomain={domainMismatch}
          baseUrl={baseUrl}
          onReport={() => void reportNow()}
        />

        <div className="rb-divider" />

        <Settings
          value={settings}
          productionUrl={origin}
          sampleSlug={sampleSlug}
          onChange={patchSettings}
        />

        <FieldList />
        <Help baseUrl={baseUrl} />
      </div>

      <div className="rb-footer">
        {busy ? (
          <button type="button" onClick={() => abort.current?.abort()}>
            Cancel
          </button>
        ) : (
          <button type="button" onClick={() => void runSync(false)}>
            Sync articles
          </button>
        )}
      </div>
    </div>
  );
}

function SyncSummary({
  result,
  lastSyncAt,
  articleCount,
}: {
  result: SyncResult | null;
  lastSyncAt: string | null;
  articleCount: number;
}) {
  if (!result) {
    return (
      <div className="rb-card">
        <span className="rb-muted">
          {lastSyncAt
            ? `Last synced ${relativeTime(lastSyncAt)}. Sync to bring the collection up to date.`
            : "Ready to sync. Rankbox will fill this collection with your finished articles."}
        </span>
      </div>
    );
  }

  if (result.total === 0) {
    return (
      <div className="rb-card">
        <span className="rb-title">No finished articles yet</span>
        <span className="rb-muted">
          Rankbox syncs articles once autopilot finishes writing them.
        </span>
      </div>
    );
  }

  const parts = [
    result.written ? `${result.written} written` : null,
    result.removed ? `${result.removed} removed` : null,
    result.unchanged ? `${result.unchanged} unchanged` : null,
  ].filter(Boolean);

  return (
    <div className="rb-card">
      <span className="rb-title">Up to date &middot; {articleCount} articles</span>
      <span className="rb-muted">
        {parts.length ? parts.join(", ") : "Nothing changed"} &middot; synced{" "}
        {relativeTime(lastSyncAt)}
      </span>
    </div>
  );
}

function ReportCard({
  origin,
  pending,
  busy,
  expectedDomain,
  baseUrl,
  onReport,
}: {
  origin: string | null;
  pending: number;
  busy: boolean;
  expectedDomain: string | null;
  baseUrl: string;
  onReport: () => void;
}) {
  if (origin && expectedDomain) {
    return (
      <div className="rb-card">
        <span className="rb-label">Live URLs</span>
        <span className="rb-muted">
          Rankbox expects your articles on {hostOf(expectedDomain)}, but this project publishes to{" "}
          {hostOf(origin)}. Publish to your own domain, or update your website in Rankbox.
        </span>
        <ExternalLink href={`${baseUrl}/dashboard/settings`}>Open Rankbox settings</ExternalLink>
      </div>
    );
  }
  if (!origin) {
    return (
      <div className="rb-card">
        <span className="rb-label">Live URLs</span>
        <span className="rb-muted">
          Publish this project in Framer and Rankbox can record where each article lives.
        </span>
      </div>
    );
  }
  if (pending === 0) {
    return (
      <div className="rb-card">
        <span className="rb-label">Live URLs</span>
        <span className="rb-muted">All reported to Rankbox.</span>
      </div>
    );
  }
  return (
    <div className="rb-card">
      <span className="rb-label">Live URLs</span>
      <span className="rb-muted">
        {pending} article{pending === 1 ? " isn't" : "s aren't"} reported to Rankbox yet.
      </span>
      <button type="button" className="rb-link" disabled={busy} onClick={onReport}>
        Report live URLs
      </button>
    </div>
  );
}

function hostOf(value: string): string {
  try {
    return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).hostname;
  } catch {
    return value;
  }
}

function progressText(progress: SyncProgress): Status {
  switch (progress.phase) {
    case "fetching":
      return { message: "Fetching articles…", value: progress.fetched };
    case "fields":
      return { message: "Checking collection fields…" };
    case "writing":
      return { message: "Writing to the CMS…", value: progress.written, max: progress.total };
    case "removing":
      return { message: "Removing deleted articles…" };
    default:
      return { message: "Finishing up…" };
  }
}

function countPending(list: PublishedArticle[], origin: string | null): number {
  if (!origin) return 0;
  return list.filter((a) => !a.published_url).length;
}
