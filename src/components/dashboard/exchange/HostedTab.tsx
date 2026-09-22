/**
 * Supply: the links this site's articles carry for other members.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button, EmptyState, Panel, Pill } from "@/components/dashboard/primitives";
import { PublishIcon } from "@/components/dashboard/icons";
import { ConfirmDialog } from "@/components/dashboard/article-parts";
import { useSiteId } from "@/components/dashboard/site-context";
import {
  blockExchangeDomain,
  listHostedPlacements,
  removeHostedPlacement,
  setPublishedUrl,
  tierCost,
  type ExchangeOverview,
  type HostedPlacement,
} from "@/lib/data";
import { formatShortDate } from "@/lib/format-date";
import { timeAgo } from "@/components/dashboard/connection-model";
import { inputClass, plural, shortUrl } from "./format";
import { StatusPill } from "./shared";

export function HostedTab({
  overview,
  readOnly,
}: {
  overview: ExchangeOverview;
  readOnly?: boolean;
}) {
  const siteId = useSiteId();
  const queryClient = useQueryClient();
  const { data: hosted = [], isLoading } = useQuery({
    queryKey: ["exchange", siteId, "hosted"],
    queryFn: () => listHostedPlacements(siteId),
    refetchInterval: 30_000,
  });
  const [removing, setRemoving] = useState<HostedPlacement | null>(null);
  const [pasting, setPasting] = useState<HostedPlacement | null>(null);
  const site = overview.site;
  const optedIn = site?.optedIn ?? false;

  async function refresh() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["exchange", siteId, "hosted"] }),
      queryClient.invalidateQueries({ queryKey: ["exchange", siteId, "overview"] }),
    ]);
  }

  async function remove(p: HostedPlacement) {
    try {
      await removeHostedPlacement(siteId, { id: p.id });
      toast.success(p.status === "live" ? "Link removed. The credits went back." : "Link removed.");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove the link.");
    }
  }

  async function block(p: HostedPlacement) {
    try {
      await blockExchangeDomain(siteId, {
        domain: p.targetDomain,
        reason: "blocked from a hosted link",
      });
      toast.success(`${p.targetDomain} blocked. This site won't be matched with it again.`);
      await queryClient.invalidateQueries({ queryKey: ["exchange", siteId, "blocks"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't block that domain.");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-ink">Links your articles carry</h2>
        <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-muted-foreground">
          When an article of yours is written, the matcher may weave in one link to another member's
          page where it genuinely fits. You earn {plural(tierCost(site?.tier ?? 1), "credit")} when
          it's verified live on your site — and the link must stay: removing a live one returns the
          credits and lowers your reputation.
        </p>
      </div>

      {!optedIn && (
        <p className="rounded-lg border border-warning/30 bg-warning/15 px-3.5 py-2.5 text-xs text-ink">
          Hosting is off. Turn it on in Settings to start earning credits — it's also what lets your
          own targets be matched.
        </p>
      )}

      {isLoading ? (
        <div className="skeleton h-32 w-full" />
      ) : hosted.length === 0 ? (
        <EmptyState
          icon={<PublishIcon className="h-5 w-5" />}
          title="No hosted links yet"
          description={
            optedIn
              ? "The next article you write gets one, if the network has a page that genuinely belongs in it. No fit, no link — and no credit."
              : "Turn on hosting in Settings. Your next article can then carry a link and earn a credit."
          }
        />
      ) : (
        <Panel className="divide-y divide-border">
          {hosted.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">
                  {p.blogId ? (
                    <Link
                      to="/dashboard/blog-engine"
                      search={{ article: p.blogId }}
                      className="font-semibold underline-offset-2 hover:underline"
                    >
                      {p.blogTitle ?? "Article"}
                    </Link>
                  ) : (
                    <span className="font-semibold">{p.blogTitle ?? "Article (deleted)"}</span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  “{p.anchor}” → <span className="text-ink">{p.targetDomain}</span> ·{" "}
                  {plural(p.credits, "credit")}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {p.status === "live" ? (
                    <>
                      live {p.liveAt ? `since ${formatShortDate(p.liveAt)}` : ""}
                      {p.hostUrl && (
                        <>
                          {" · "}
                          <a
                            href={p.hostUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline-offset-2 hover:underline"
                          >
                            {shortUrl(p.hostUrl)}
                          </a>
                        </>
                      )}
                      {p.lastCheckedAt && ` · checked ${timeAgo(p.lastCheckedAt)}`}
                    </>
                  ) : p.status === "placed" ? (
                    p.hostUrl ? (
                      `waiting to see it at ${shortUrl(p.hostUrl)}`
                    ) : (
                      "in the article — we'll find it on your site once it's published"
                    )
                  ) : p.endReason ? (
                    p.endReason
                  ) : (
                    `reserved ${formatShortDate(p.reservedAt)}`
                  )}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                {p.status === "live" && p.consecutiveFailures > 0 && (
                  <Pill tone="danger" className="whitespace-nowrap">
                    Can't see the link · {p.consecutiveFailures}/3
                  </Pill>
                )}
                <StatusPill status={p.status} />
                {!readOnly && p.status === "placed" && p.blogId && (
                  <Button
                    variant="ghost"
                    className="px-2.5 py-1.5 text-xs"
                    onClick={() => setPasting(p)}
                  >
                    Paste live URL
                  </Button>
                )}
                {!readOnly &&
                  (p.status === "live" || p.status === "placed" || p.status === "reserved") && (
                    <Button
                      variant="danger"
                      className="px-2.5 py-1.5 text-xs"
                      onClick={() => setRemoving(p)}
                    >
                      Remove
                    </Button>
                  )}
                {!readOnly && (
                  <Button
                    variant="ghost"
                    className="px-2.5 py-1.5 text-xs"
                    onClick={() => void block(p)}
                  >
                    Block domain
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Panel>
      )}

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={removing?.status === "live" ? "Remove a live link?" : "Remove this link?"}
        description={
          removing?.status === "live"
            ? `This link is verified live and the credits are already yours. Removing it returns ${plural(removing.credits, "credit")} to ${removing.targetDomain} and lowers your reputation by 10 — the same as if the link had vanished.`
            : "The link is taken out of the article and the other member's credits are returned."
        }
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
          Remove link
        </Button>
      </ConfirmDialog>

      {pasting && (
        <PasteUrlDialog
          placement={pasting}
          domain={site?.domain ?? ""}
          onClose={() => setPasting(null)}
          onSaved={async () => {
            setPasting(null);
            await refresh();
          }}
        />
      )}
    </div>
  );
}

function PasteUrlDialog({
  placement,
  domain,
  onClose,
  onSaved,
}: {
  placement: HostedPlacement;
  domain: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const siteId = useSiteId();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!placement.blogId) return;
    setBusy(true);
    try {
      await setPublishedUrl(siteId, { blogId: placement.blogId, url: url.trim() });
      toast.success("Got it. We'll check the page within the day and settle the credits.");
      await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save that URL.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel className="space-y-3 border-ink/15 p-5">
      <p className="text-sm font-semibold text-ink">
        Where did “{placement.blogTitle ?? "this article"}” go live?
      </p>
      <p className="text-xs text-muted-foreground">
        Paste the page's URL on {domain}. We check it for the link and settle the credits once it's
        found.
      </p>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={`https://${domain}/blog/…`}
        inputMode="url"
        className={inputClass}
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="brand"
          onClick={() => void save()}
          disabled={busy || !/^https?:\/\//i.test(url.trim())}
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save URL
        </Button>
      </div>
    </Panel>
  );
}
