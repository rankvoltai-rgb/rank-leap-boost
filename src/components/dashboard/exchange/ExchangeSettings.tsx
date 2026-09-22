/**
 * How this site takes part: whether its articles host links at all, how
 * many, what it refuses to link to, and what it is about. All of it is per
 * site — another site on the account has its own.
 */
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button, Panel } from "@/components/dashboard/primitives";
import { Switch } from "@/components/ui/switch";
import { useSiteId } from "@/components/dashboard/site-context";
import {
  blockExchangeDomain,
  EXCHANGE_CATEGORIES,
  listExchangeBlocks,
  unblockExchangeDomain,
  updateExchangeSettings,
  type ExchangeSite,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { inputClass } from "./format";
import { ChipInput } from "./shared";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Panel className="divide-y divide-border">{children}</Panel>
    </section>
  );
}

function Row({
  title,
  description,
  htmlFor,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10">
      <div>
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {title}
        </label>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function ExchangeSettings({
  site,
  onChanged,
}: {
  site: ExchangeSite;
  onChanged: () => void;
}) {
  const siteId = useSiteId();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [niche, setNiche] = useState(site.niche ?? "");
  const [tags, setTags] = useState<string[]>(site.topicTags);
  const [dirty, setDirty] = useState(false);
  const { data: blocks = [] } = useQuery({
    queryKey: ["exchange", siteId, "blocks"],
    queryFn: () => listExchangeBlocks(siteId),
  });
  const [blockDraft, setBlockDraft] = useState("");

  useEffect(() => {
    if (!dirty) {
      setNiche(site.niche ?? "");
      setTags(site.topicTags);
    }
  }, [site, dirty]);

  async function patch(
    key: string,
    data: Parameters<typeof updateExchangeSettings>[1],
    done?: string,
  ) {
    setBusy(key);
    try {
      await updateExchangeSettings(siteId, data);
      await queryClient.invalidateQueries({ queryKey: ["exchange", siteId, "overview"] });
      onChanged();
      if (done) toast.success(done);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setBusy(null);
    }
  }

  async function addBlock() {
    const d = blockDraft.trim();
    if (!d) return;
    setBusy("block");
    try {
      await blockExchangeDomain(siteId, { domain: d });
      setBlockDraft("");
      await queryClient.invalidateQueries({ queryKey: ["exchange", siteId, "blocks"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't block that domain.");
    } finally {
      setBusy(null);
    }
  }

  async function removeBlock(domain: string) {
    try {
      await unblockExchangeDomain(siteId, { domain });
      await queryClient.invalidateQueries({ queryKey: ["exchange", siteId, "blocks"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't unblock that domain.");
    }
  }

  return (
    <div className="space-y-8">
      <Section
        title="Hosting"
        description="Whether your articles carry links for other members. This is the whole deal: hosting is how credits are earned, and it's also what makes your own targets eligible."
      >
        <Row
          title="Host links in my articles"
          htmlFor="opt-in"
          description={
            site.optedIn
              ? "On. New articles may carry one relevant link. Turning it off also pauses your own targets."
              : "Off. Nothing is written into your articles, and your targets are not matched."
          }
        >
          <div className="flex items-center gap-3">
            <Switch
              id="opt-in"
              checked={site.optedIn}
              disabled={busy === "opt"}
              onCheckedChange={(v) =>
                void patch("opt", { optedIn: v }, v ? "Hosting is on." : "Hosting is off.")
              }
            />
            <span className="text-sm text-ink">{site.optedIn ? "On" : "Off"}</span>
          </div>
        </Row>
        <Row
          title="Links per article"
          description="One is the default and the safest. Two is fine in a long article, and helps when the network is short of hosts."
        >
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Links per article">
            {[0, 1, 2].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={site.maxLinksPerArticle === n}
                disabled={busy === "max"}
                onClick={() => void patch("max", { maxLinksPerArticle: n })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
                  site.maxLinksPerArticle === n
                    ? "border-ink bg-ink text-background"
                    : "border-border bg-card text-muted-foreground hover:border-ink/20 hover:text-ink",
                )}
              >
                {n === 0 ? "None" : n === 1 ? "One" : "Up to two"}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      <Section
        title="Your site"
        description="What the matcher knows about you. It compares this with every target to decide what belongs in your articles, and what your pages belong in."
      >
        <Row title="Niche" htmlFor="niche" description="One short phrase.">
          <input
            id="niche"
            value={niche}
            onChange={(e) => {
              setNiche(e.target.value);
              setDirty(true);
            }}
            placeholder="e.g. project management software"
            className={inputClass}
          />
        </Row>
        <Row
          title="Topics"
          htmlFor="topics"
          description="The subjects your articles cover. Press Enter after each."
        >
          <ChipInput
            id="topics"
            values={tags}
            onChange={(v) => {
              setTags(v);
              setDirty(true);
            }}
            placeholder="e.g. sprint planning"
            max={15}
          />
        </Row>
        {dirty && (
          <div className="flex justify-end gap-2 px-5 py-3 sm:px-6">
            <Button
              variant="ghost"
              onClick={() => {
                setDirty(false);
                setNiche(site.niche ?? "");
                setTags(site.topicTags);
              }}
            >
              Discard
            </Button>
            <Button
              variant="brand"
              disabled={busy === "site"}
              onClick={() =>
                void patch("site", { niche: niche.trim(), topicTags: tags }, "Saved.").then(() =>
                  setDirty(false),
                )
              }
            >
              {busy === "site" && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </Button>
          </div>
        )}
      </Section>

      <Section
        title="What you won't link to"
        description="The matcher skips these. A blocked category applies to any member whose niche or topics fall in it; a blocked domain is that site, both directions."
      >
        <Row
          title="Categories"
          description="Tick what you'd never want a link to from your articles."
        >
          <div className="flex flex-wrap gap-1.5">
            {EXCHANGE_CATEGORIES.map((c) => {
              const on = site.blockedCategories.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  disabled={busy === "cat"}
                  onClick={() =>
                    void patch("cat", {
                      blockedCategories: on
                        ? site.blockedCategories.filter((x) => x !== c.id)
                        : [...site.blockedCategories, c.id],
                    })
                  }
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-60",
                    on
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : "border-border bg-card text-muted-foreground hover:border-ink/20 hover:text-ink",
                  )}
                >
                  {on ? "✕ " : ""}
                  {c.label}
                </button>
              );
            })}
          </div>
        </Row>
        <Row
          title="Domains"
          htmlFor="block-domain"
          description="Competitors, or anyone you'd rather not trade with."
        >
          <div className="space-y-2.5">
            <div className="flex gap-2">
              <input
                id="block-domain"
                value={blockDraft}
                onChange={(e) => setBlockDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void addBlock()}
                placeholder="competitor.com"
                inputMode="url"
                className={inputClass}
              />
              <Button
                variant="ghost"
                onClick={() => void addBlock()}
                disabled={busy === "block" || !blockDraft.trim()}
              >
                Block
              </Button>
            </div>
            {blocks.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {blocks.map((b) => (
                  <span
                    key={b.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-ink"
                  >
                    {b.domain}
                    <button
                      type="button"
                      aria-label={`Unblock ${b.domain}`}
                      onClick={() => void removeBlock(b.domain)}
                      className="text-muted-foreground hover:text-ink"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Row>
      </Section>

      <Section
        title="Standing"
        description="How the network sees your site. Reputation drops when a live link you host disappears; below 40, the site is paused for review."
      >
        <Row title="Tier & reputation">
          <p className="text-sm text-ink">
            Tier {site.tier} · reputation {site.reputation}/100 · {site.liveHostedCount} live hosted
            {site.lostHostedCount > 0 && ` · ${site.lostHostedCount} lost`}
          </p>
        </Row>
      </Section>
    </div>
  );
}
