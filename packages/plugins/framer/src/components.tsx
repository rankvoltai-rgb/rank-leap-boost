import type { ReactNode } from "react";
import { openExternal } from "./open-url";
import type { DescribedError } from "./lib/errors";

export function Mark() {
  return (
    <svg className="rb-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2.6 2.6 Q12 6.9 21.4 2.6 Q17.1 12 21.4 21.4 Q12 17.1 2.6 21.4 Q6.9 12 2.6 2.6 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <button type="button" className="rb-link" onClick={() => openExternal(href)}>
      {children}
    </button>
  );
}

export function Progress({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className="rb-progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ErrorPanel({
  error,
  onRetry,
  onReconnect,
  onResetFields,
}: {
  error: DescribedError;
  onRetry?: () => void;
  onReconnect?: () => void;
  onResetFields?: () => void;
}) {
  const { action } = error;
  const handler =
    action?.intent === "retry"
      ? onRetry
      : action?.intent === "reconnect"
        ? onReconnect
        : action?.intent === "reset-fields"
          ? onResetFields
          : undefined;

  return (
    <div className="rb-error" role="alert" aria-live="polite">
      <span className="rb-title">{error.title}</span>
      <span className="rb-muted">{error.body}</span>
      {action?.href && <ExternalLink href={action.href}>{action.label}</ExternalLink>}
      {handler && (
        <button type="button" className="rb-link" onClick={handler}>
          {action?.label}
        </button>
      )}
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <label className="rb-check">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <span>
        <span className="rb-label">{label}</span>
        {hint && (
          <>
            <br />
            <span className="rb-muted">{hint}</span>
          </>
        )}
      </span>
    </label>
  );
}
