import { useState } from "react";
import { ErrorPanel, ExternalLink, Mark } from "../components";
import { isRankboxKey } from "../storage";
import type { DescribedError } from "../lib/errors";

export function Connect({
  baseUrl,
  busy,
  error,
  knownBrand,
  knownKeyPrefix,
  storageBlocked,
  onConnect,
}: {
  baseUrl: string;
  busy: boolean;
  error: DescribedError | null;
  knownBrand: string | null;
  knownKeyPrefix: string | null;
  storageBlocked: boolean;
  onConnect: (apiKey: string) => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && apiKey.length > 0 && !isRankboxKey(apiKey);

  return (
    <div className="rb-root">
      <div className="rb-scroll">
        <div className="rb-row">
          <Mark />
          <span className="rb-title">Rankbox</span>
        </div>

        <p className="rb-muted">
          Sync your finished Rankbox articles into this project&rsquo;s CMS.
        </p>

        {/* A teammate opening a configured collection needs to know WHICH key
            to ask for, which the collection can say without holding a secret. */}
        {knownBrand && (
          <div className="rb-card">
            <span className="rb-muted">
              This collection syncs <strong className="rb-title">{knownBrand}</strong>
              {knownKeyPrefix ? " with key " : "."}
              {knownKeyPrefix && <code className="rb-preview">{knownKeyPrefix}</code>}
            </span>
            <span className="rb-faint">
              Keys are stored in your browser, not the project, so each person enters their own.
            </span>
          </div>
        )}

        <div className="rb-field">
          <label className="rb-label" htmlFor="rb-key">
            Rankbox API key
          </label>
          <input
            id="rb-key"
            className="rb-input"
            type="password"
            autoComplete="off"
            aria-label="Rankbox API key"
            placeholder="rv_live_…"
            value={apiKey}
            disabled={busy}
            onBlur={() => setTouched(true)}
            onChange={(e) => setApiKey(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isRankboxKey(apiKey)) onConnect(apiKey);
            }}
          />
          {invalid && (
            <span className="rb-muted" aria-live="polite">
              Rankbox keys start with <code>rv_live_</code>.
            </span>
          )}
        </div>

        <ExternalLink href={`${baseUrl}/dashboard/integrations`}>
          Get a key in Rankbox &rarr; Integrations
        </ExternalLink>

        {storageBlocked && (
          <span className="rb-faint">
            This browser blocks plugin storage, so you&rsquo;ll re-enter your key each session.
          </span>
        )}

        {error && <ErrorPanel error={error} />}
      </div>

      <div className="rb-footer">
        <button
          type="button"
          disabled={busy || !isRankboxKey(apiKey)}
          onClick={() => onConnect(apiKey)}
        >
          {busy ? "Checking…" : "Connect"}
        </button>
      </div>
    </div>
  );
}
