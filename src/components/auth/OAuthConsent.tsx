import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, TriangleAlert, X } from "lucide-react";
import {
  answerOAuthRequest,
  getOAuthRequest,
  getSessionUser,
  signOut,
  type OAuthRequest,
} from "@/lib/auth";
import { Logo } from "@/components/landing/shared";

type ConsentRequest = Extract<OAuthRequest, { kind: "consent" }>;

type View =
  | { kind: "loading" }
  | { kind: "signed-out" }
  | { kind: "consent"; request: ConsentRequest }
  | { kind: "leaving" }
  | { kind: "error"; title: string; body: string };

const NO_REQUEST: View = {
  kind: "error",
  title: "Start from the app you're connecting",
  body: "This page only works when an app like Claude or ChatGPT sends you here to connect Rankbox. Go back to it and add Rankbox again.",
};

const EXPIRED: View = {
  kind: "error",
  title: "This request is no longer valid",
  body: "It may have expired or already been answered. Go back to the app you were connecting and add Rankbox again.",
};

/**
 * What approving lets the app do. The tokens it gets are refused everywhere
 * except the MCP server (see auth-middleware.ts and the oauth_clients_blocked
 * migration), which is what makes the "can't" line true. openid only means
 * "sign in", so it has no line of its own.
 */
function permissionsFor(scopes: string[]): string[] {
  const lines = ["Use Rankbox's AI search tools for you"];
  if (scopes.includes("profile")) lines.push("See your name and profile picture");
  if (scopes.includes("email")) lines.push("See your email address");
  if (scopes.includes("phone")) lines.push("See your phone number");
  if (scopes.includes("offline_access")) lines.push("Stay connected without asking you again");
  return lines;
}

/** Where the browser goes after a decision, in words a person can check. */
function destinationOf(redirectUri: string): string {
  try {
    const { hostname, host } = new URL(redirectUri);
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
      return "an app on this computer";
    }
    return host || redirectUri;
  } catch {
    return redirectUri;
  }
}

export function OAuthConsent({ authorizationId }: { authorizationId?: string }) {
  const navigate = useNavigate();
  const [view, setView] = useState<View>(authorizationId ? { kind: "loading" } : NO_REQUEST);
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const here = `/oauth/consent?authorization_id=${encodeURIComponent(authorizationId ?? "")}`;

  useEffect(() => {
    if (!authorizationId) return;
    let cancelled = false;
    (async () => {
      try {
        if (!(await getSessionUser())) {
          if (!cancelled) setView({ kind: "signed-out" });
          return;
        }
        const request = await getOAuthRequest(authorizationId);
        if (cancelled) return;
        if (request.kind === "done") {
          // Approved this app before: nothing to ask, straight back to it.
          setView({ kind: "leaving" });
          window.location.assign(request.redirectUrl);
          return;
        }
        setView({ kind: "consent", request });
      } catch {
        if (!cancelled) setView(EXPIRED);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authorizationId]);

  async function decide(decision: "approve" | "deny") {
    if (!authorizationId) return;
    setBusy(decision);
    try {
      const to = await answerOAuthRequest(authorizationId, decision);
      setView({ kind: "leaving" });
      window.location.assign(to);
    } catch {
      setBusy(null);
      setView(EXPIRED);
    }
  }

  async function switchAccount() {
    await signOut();
    navigate({ to: "/auth", search: { redirect: here } });
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface px-4 py-8 sm:px-6">
      <a href="/" className="mx-auto shrink-0">
        <Logo />
      </a>
      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {view.kind === "loading" && <Waiting label="Loading the request…" />}
          {view.kind === "leaving" && <Waiting label="Taking you back to the app…" />}

          {view.kind === "signed-out" && (
            <>
              <h1 className="text-balance text-2xl font-bold tracking-tight text-ink">
                Sign in to connect an app
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                An app is asking to use your Rankbox account. Sign in to see which one and decide.
              </p>
              <Link
                to="/auth"
                search={{ redirect: here }}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-cta px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cta-hover"
              >
                Sign in to Rankbox
              </Link>
            </>
          )}

          {view.kind === "error" && (
            <>
              <h1 className="text-balance text-2xl font-bold tracking-tight text-ink">
                {view.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{view.body}</p>
              <a
                href="/"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-secondary"
              >
                Go to Rankbox
              </a>
            </>
          )}

          {view.kind === "consent" && (
            <Consent
              request={view.request}
              busy={busy}
              onDecide={decide}
              onSwitchAccount={switchAccount}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function Consent({
  request,
  busy,
  onDecide,
  onSwitchAccount,
}: {
  request: ConsentRequest;
  busy: "approve" | "deny" | null;
  onDecide: (decision: "approve" | "deny") => void;
  onSwitchAccount: () => void;
}) {
  const { appName, email, redirectUri, scopes } = request;
  return (
    <>
      <span
        aria-hidden
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary text-lg font-bold text-ink"
      >
        {appName.charAt(0).toUpperCase()}
      </span>
      <h1 className="mt-4 text-balance text-center text-2xl font-bold tracking-tight text-ink">
        {appName} wants to use your Rankbox account
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-ink">{email}</span>.{" "}
        <button
          type="button"
          onClick={onSwitchAccount}
          disabled={busy !== null}
          className="font-semibold text-ink hover:underline"
        >
          Not you?
        </button>
      </p>

      <section className="mt-6 rounded-xl border border-border p-4">
        <h2 className="text-sm font-semibold text-ink">{appName} will be able to</h2>
        <ul className="mt-3 space-y-2.5">
          {permissionsFor(scopes).map((line) => (
            <Permission key={line} icon={<Check className="h-4 w-4 text-cta" />}>
              {line}
            </Permission>
          ))}
          <Permission muted icon={<X className="h-4 w-4 text-muted-foreground" />}>
            It can't see or change your sites, articles, or billing
          </Permission>
        </ul>
      </section>

      <div className="mt-4 flex gap-2.5 rounded-xl bg-secondary/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
        <TriangleAlert className="mt-px h-4 w-4 shrink-0 text-ink" aria-hidden />
        <p>
          Apps name themselves and Rankbox doesn't check the name, so only continue if you just
          added Rankbox to {appName} yourself. Afterwards you'll go to{" "}
          <span className="font-semibold text-ink" title={redirectUri}>
            {destinationOf(redirectUri)}
          </span>
          .
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onDecide("deny")}
          disabled={busy !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-secondary disabled:opacity-70"
        >
          {busy === "deny" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel"}
        </button>
        <button
          type="button"
          onClick={() => onDecide("approve")}
          disabled={busy !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cta-hover disabled:opacity-70"
        >
          {busy === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
        </button>
      </div>
    </>
  );
}

function Permission({
  icon,
  muted = false,
  children,
}: {
  icon: ReactNode;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <li className={`flex gap-2.5 text-sm ${muted ? "text-muted-foreground" : "text-ink"}`}>
      <span className="mt-0.5 shrink-0" aria-hidden>
        {icon}
      </span>
      {children}
    </li>
  );
}

function Waiting({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-sm text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      {label}
    </div>
  );
}
