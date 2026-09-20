/**
 * Proving the member controls the domain they publish to. Three ways, any one
 * passes; the result says exactly what we saw so a failed check is fixable.
 */
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button, Panel, Pill } from "@/components/dashboard/primitives";
import { CheckIcon } from "@/components/dashboard/icons";
import {
  checkDomainVerification,
  getProfile,
  startDomainVerification,
  type ExchangeSite,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { inputClass } from "./format";
import { CopyRow } from "./shared";

type Method = "dns_txt" | "meta_tag" | "well_known";

const METHODS: Array<{ id: Method; label: string; blurb: string }> = [
  {
    id: "dns_txt",
    label: "DNS record",
    blurb: "Add a TXT record at your DNS provider. Works for any site.",
  },
  { id: "meta_tag", label: "Meta tag", blurb: "Paste one tag into the <head> of your home page." },
  { id: "well_known", label: "File", blurb: "Upload a small text file to your site." },
];

export function VerifyDomainCard({
  site,
  onChange,
}: {
  site: ExchangeSite | null;
  onChange: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const suggested = profile?.website_url?.replace(/^https?:\/\//i, "").replace(/\/.*$/, "") ?? "";
  const [domain, setDomain] = useState(site?.domain ?? "");
  const [method, setMethod] = useState<Method>("dns_txt");
  const [busy, setBusy] = useState<"start" | "check" | null>(null);
  const [result, setResult] = useState<{ ok: boolean; reason?: string } | null>(null);
  const [editing, setEditing] = useState(false);

  const value = domain || suggested;

  async function start() {
    setBusy("start");
    setResult(null);
    try {
      await startDomainVerification({ domain: value });
      setEditing(false);
      await queryClient.invalidateQueries({ queryKey: ["exchange"] });
      onChange();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't add that domain.");
    } finally {
      setBusy(null);
    }
  }

  async function check() {
    setBusy("check");
    try {
      const r = await checkDomainVerification();
      setResult(r);
      if (r.ok) {
        toast.success("Domain verified.");
        await queryClient.invalidateQueries({ queryKey: ["exchange"] });
        onChange();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't check the domain.");
    } finally {
      setBusy(null);
    }
  }

  const pending = site && site.status !== "verified" && !editing;

  return (
    <Panel className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Verify your domain</h2>
          <p className="mt-0.5 max-w-lg text-xs leading-relaxed text-muted-foreground">
            Every link in the exchange is earned by a verified site and points at one. One account
            per domain, and nothing happens until this passes.
          </p>
        </div>
        {site && (
          <Pill tone={site.status === "verified" ? "success" : "warning"}>
            {site.status === "verified" ? "Verified" : "Not verified yet"}
          </Pill>
        )}
      </div>

      {!pending ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            aria-label="Your domain"
            value={value}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            inputMode="url"
            className={cn(inputClass, "sm:max-w-sm")}
          />
          <Button
            variant="brand"
            onClick={() => void start()}
            disabled={busy !== null || !value.trim()}
          >
            {busy === "start" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {site?.status === "verified" ? "Change domain" : "Continue"}
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink">
            <span className="font-medium">{site.domain}</span>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setEditing(true);
              }}
              className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-ink"
            >
              use a different domain
            </button>
          </div>

          <div
            className="flex flex-wrap gap-1.5"
            role="radiogroup"
            aria-label="Verification method"
          >
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={method === m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  method === m.id
                    ? "border-ink bg-ink text-background"
                    : "border-border bg-card text-muted-foreground hover:border-ink/20 hover:text-ink",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {METHODS.find((m) => m.id === method)?.blurb}
          </p>

          {method === "dns_txt" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <CopyRow label="Host / name" value={`_rankbox.${site.domain}`} />
              <CopyRow label="TXT value" value={`rankbox-site-verification=${site.verifyToken}`} />
            </div>
          )}
          {method === "meta_tag" && (
            <CopyRow
              label={`Add to the <head> of https://${site.domain}/`}
              value={`<meta name="rankbox-site-verification" content="${site.verifyToken}">`}
            />
          )}
          {method === "well_known" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <CopyRow
                label="Create this file"
                value={`https://${site.domain}/.well-known/rankbox-verification`}
              />
              <CopyRow label="File contents" value={site.verifyToken} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="brand" onClick={() => void check()} disabled={busy !== null}>
              {busy === "check" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
              Check now
            </Button>
            <span className="text-xs text-muted-foreground">
              DNS can take a few minutes to propagate. Any one method is enough.
            </span>
          </div>

          {result && !result.ok && (
            <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-xs leading-relaxed text-destructive">
              {result.reason}
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}
