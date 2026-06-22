import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  listApiKeys,
  createApiKey,
  revokeApiKey,
  type ApiKeyRow,
} from "@/lib/api-keys.functions";
import {
  Panel,
  Pill,
  Button,
  PageHeader,
  EmptyState,
} from "@/components/dashboard/primitives";
import { PublishIcon, CheckIcon, AddIcon } from "@/components/dashboard/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/dashboard/integrations")({
  component: Integrations,
});

// The published API origin plugins must call. Hardcoded to production so the
// setup instructions are correct regardless of which environment renders them.
const API_BASE = "https://rankvolt.top";

function CopyField({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy to clipboard.");
    }
  }
  return (
    <div>
      {label && (
        <p className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex items-stretch gap-2">
        <code className="flex-1 truncate rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-xs text-ink">
          {value}
        </code>
        <Button variant="ghost" onClick={copy} className="shrink-0">
          {copied ? <CheckIcon className="h-4 w-4 text-success" /> : "Copy"}
        </Button>
      </div>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Brand marks (used only as supporting platform logos) ───────────── */
function FramerMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path d="M5 2h14v7H12L5 2zm0 7h7l7 7H12v7l-7-7V9z" fill="currentColor" />
    </svg>
  );
}
function ShopifyMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        d="M15.3 4.6c-.1 0-1 .3-1 .3s-.7-.7-.8-.8c-.1-.1-.3-.1-.4-.1l-.6 13.9 4.7-1L15.6 4.8c0-.1-.2-.2-.3-.2zM12.8 5.3l-.8.2c0-.5-.1-1.1-.3-1.5.6.1 1 .9 1.1 1.3zm-1.6.5-1.7.5c.2-.7.6-1.4 1.2-1.6.1.3.3.7.5 1.1zM9.4 4c.1 0 .1 0 .2.1-.6.3-1.1 1-1.4 2l-1.4.4C7.2 5.1 8.2 4 9.4 4zM5 7.2l1-.3 1.6 12.3L4 18.4 5 7.2z"
        fill="currentColor"
      />
    </svg>
  );
}
function WordPressMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-8 10a8 8 0 0 1 .8-3.5l3.9 10.6A8 8 0 0 1 4 12zm8 8c-.8 0-1.6-.1-2.3-.3l2.4-7 2.5 6.8v.1A8 8 0 0 1 12 20zm1.1-11.7c.5 0 .9-.1.9-.1.4 0 .4-.6-.1-.6 0 0-1.3.1-2.1.1-.8 0-2.1-.1-2.1-.1-.5 0-.5.6-.1.6 0 0 .4.1.9.1l1.3 3.6-1.9 5.6-3.1-9.2c.5 0 .9-.1.9-.1.4 0 .4-.6-.1-.6 0 0-1.3.1-2.1.1h-.5A8 8 0 0 1 17 5.2h-.2c-.7 0-1.2.6-1.2 1.3 0 .6.3 1.1.7 1.7.3.5.6 1 .6 1.9 0 .6-.2 1.3-.5 2.3l-.7 2.3-2.4-7.1zm5.7 1.2a8 8 0 0 1-3 10.8L18.3 14c.5-1.2.6-2.1.6-3 0-.3 0-.6-.1-.9.6 1 .9 2.1.9 3.3l.1-.7z"
        fill="currentColor"
      />
    </svg>
  );
}

const PLATFORMS = [
  {
    name: "Framer",
    mark: <FramerMark />,
    steps: [
      "Open your Framer project and add the Rankvolt CMS plugin.",
      "Paste your Rankvolt API key when prompted.",
      "Map article fields to your CMS collection and sync.",
    ],
  },
  {
    name: "Shopify",
    mark: <ShopifyMark />,
    steps: [
      "Install the Rankvolt app from your Shopify admin.",
      "Paste your Rankvolt API key in the app settings.",
      "Choose the blog to publish into and enable auto-sync.",
    ],
  },
  {
    name: "WordPress",
    mark: <WordPressMark />,
    steps: [
      "Install and activate the Rankvolt plugin.",
      "Go to Settings → Rankvolt and paste your API key.",
      "Pick a post status (draft or publish) and save.",
    ],
  },
];

function Integrations() {
  const queryClient = useQueryClient();
  const create = useServerFn(createApiKey);
  const revoke = useServerFn(revokeApiKey);

  const { data: keys, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => listApiKeys(),
  });

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyRow | null>(null);
  const [revoking, setRevoking] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const result = await create({ data: { name: name.trim() || undefined } });
      setNewKey(result.raw);
      setName("");
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create key.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke() {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await revoke({ data: { id: revokeTarget.id } });
      toast.success("API key revoked.");
      setRevokeTarget(null);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't revoke key.");
    } finally {
      setRevoking(false);
    }
  }

  const activeKeys = (keys ?? []).filter((k) => !k.revoked_at);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect your website to Rankvolt. Generate an API key, paste it into your Framer, Shopify, or WordPress plugin, and your finished articles flow straight to your site."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <AddIcon className="h-4 w-4" /> Create API key
          </Button>
        }
      />

      <Panel className="p-6">
        <h2 className="text-sm font-semibold text-ink">Your API endpoint</h2>
        <p className="mt-1 mb-4 max-w-2xl text-sm text-muted-foreground">
          Plugins pull your finished articles from this base URL using your API key.
          No website passwords are ever stored in Rankvolt.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <CopyField label="API base URL" value={`${API_BASE}/api/public/v1`} />
          <CopyField label="List articles" value={`${API_BASE}/api/public/v1/articles`} />
        </div>
      </Panel>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">API keys</h2>
          {activeKeys.length > 0 && (
            <Pill tone="neutral">{activeKeys.length} active</Pill>
          )}
        </div>

        {isLoading ? (
          <Panel className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading keys…
          </Panel>
        ) : (keys ?? []).length === 0 ? (
          <EmptyState
            icon={<PublishIcon className="h-5 w-5" />}
            title="No API keys yet"
            description="Create your first key to connect a website. You'll see the full key once — store it somewhere safe."
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <AddIcon className="h-4 w-4" /> Create API key
              </Button>
            }
          />
        ) : (
          <Panel className="divide-y divide-border">
            {(keys ?? []).map((k) => (
              <div
                key={k.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-ink">{k.name}</p>
                    {k.revoked_at ? (
                      <Pill tone="danger">Revoked</Pill>
                    ) : (
                      <Pill tone="success">Active</Pill>
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {k.key_prefix} · last used {formatDate(k.last_used_at)}
                  </p>
                </div>
                {!k.revoked_at && (
                  <Button variant="danger" onClick={() => setRevokeTarget(k)}>
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </Panel>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Connect your site</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLATFORMS.map((p) => (
            <Panel key={p.name} className="flex flex-col gap-4 p-5" hover>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-secondary text-ink">
                  {p.mark}
                </span>
                <p className="text-sm font-semibold text-ink">{p.name}</p>
              </div>
              <ol className="space-y-2">
                {p.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-[0.65rem] font-semibold text-background">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-auto text-xs text-muted-foreground">
                Plugin coming soon — the API is live and ready today.
              </p>
            </Panel>
          ))}
        </div>
      </div>

      {/* Create key dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>
              Give this key a name so you remember where it's used (e.g. your site name).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="key-name">Name</Label>
            <Input
              id="key-name"
              placeholder="e.g. My WordPress site"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                "Create key"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reveal-once dialog */}
      <Dialog open={!!newKey} onOpenChange={(o) => !o && setNewKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy your API key now</DialogTitle>
            <DialogDescription>
              This is the only time you'll see the full key. Store it somewhere safe —
              you can't retrieve it again, but you can always create a new one.
            </DialogDescription>
          </DialogHeader>
          {newKey && <CopyField value={newKey} />}
          <DialogFooter>
            <Button onClick={() => setNewKey(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke confirmation */}
      <AlertDialog open={!!revokeTarget} onOpenChange={(o) => !o && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this API key?</AlertDialogTitle>
            <AlertDialogDescription>
              Any plugin using "{revokeTarget?.name}" will stop syncing immediately.
              This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={revoking}
            >
              {revoking ? "Revoking…" : "Revoke key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}